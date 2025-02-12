import {
  convertToCoreMessages, CoreMessage,
  Message,
  StreamData,
  streamObject,
  streamText,
  CoreTool, JSONValue
} from 'ai';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import { customModel } from '@/ai';
import {Model, models, vertex, openai, DEFAULT_MODEL_NAME, FALLBACK_MODEL_NAME} from '@/ai/models';
import { systemPrompt } from '@/ai/prompts';
import { getRagContext, RetrievalDocument } from '@/ai/ragContext';
import { getTokenPrice } from '@/ai/tools/get-token-price';
import { auth } from '@/app/(auth)/auth';
import {
  deleteChatById,
  getChatById,
  getDocumentById,
  saveChat,
  saveDocument,
  saveMessages,
  saveSuggestions,
} from '@/db/queries';
import { Suggestion } from '@/db/schema';
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';

import { generateTitleFromUserMessage } from '../../actions';




export const maxDuration = 60;

type AllowedTools =
    | 'getTokenPrice';

const allTools: AllowedTools[] = ['getTokenPrice'];

export async function POST(request: Request) {
  const {
    id,
    messages,
  }: { id: string; messages: Array<Message> } =
    await request.json();

  const session = await auth();

  /* Uncomment to only allow authenticated users
  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }
   */

  const vertexModel = models.find((model) => model.id === DEFAULT_MODEL_NAME);
  const openaiModel = models.find((model) => model.id === FALLBACK_MODEL_NAME);

  if (!vertexModel || !openaiModel) {
      return new Response('Model not found', { status: 400 });
  }


  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  const chat = await getChatById({ id });

  if (!chat && session && session.user && session.user.id) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    await saveChat({ id, userId: session.user.id, title });
  }

  if (session && session.user && session.user.id){
    await saveMessages({
      messages: [
        { ...userMessage, id: generateUUID(), createdAt: new Date(), chatId: id },
      ],
    });
  }

  const streamingData = new StreamData();

  console.log("Retrieving Rag documents");
  const ragDocuments : RetrievalDocument[] = await getRagContext(coreMessages, userMessage);
  const ragContext = ragDocuments.map(
      (doc, index) =>
          `<document index="${index + 1}">
        <content>${doc.content}</content>
        <metadata>
          rerank_score: ${doc.metadata.rerank_score || 'N/A'}
          username: ${doc.username || 'N/A'}
          link: ${doc.link || 'N/A'}
          timestamp: ${doc.timestamp || 'N/A'}
          source: ${doc.source || 'N/A'}
        </metadata>
      </document>`
  )
      .join('\n');

  const result = await tryWithFallback({
    vertexModel: vertexModel,
    openaiModel: openaiModel,
    temperature: 0.65,
    system: systemPrompt + "\n\n" +
      "<retrieved-documents>\n" + ragContext + "\n</retrieved-documents>\n\n",
    messages: coreMessages,
    maxSteps: 5,
    experimental_activeTools: allTools,
    tools: {
      getTokenPrice
    },
    onFinish: async ({ responseMessages }) => {
      if (session && session.user && session.user.id) {
        try {
          const responseMessagesWithoutIncompleteToolCalls =
            sanitizeResponseMessages(responseMessages);

          await saveMessages({
            messages: responseMessagesWithoutIncompleteToolCalls.map(
              (message) => {
                const messageId = generateUUID();
                const serializedRagDocuments = serializeDocuments(ragDocuments);

                if (message.role === 'assistant') {
                  streamingData.appendMessageAnnotation({
                    messageIdFromServer: messageId,
                    ragDocuments: serializedRagDocuments,
                  });
                }

                return {
                  id: messageId,
                  chatId: id,
                  role: message.role,
                  content: message.content,
                  //ragDocument: serializedRagDocuments,
                  createdAt: new Date(),
                };
              }
            ),
          });
        } catch (error) {
          console.error('Failed to save chat');
        }
      } else {
        const responseMessagesWithoutIncompleteToolCalls = sanitizeResponseMessages(responseMessages);
        for (const message of responseMessagesWithoutIncompleteToolCalls) {
          if (message.role === 'assistant') {
            streamingData.appendMessageAnnotation({
              ragDocuments: serializeDocuments(ragDocuments),
            });
          }
        }
      }
      //console.log((await result.request).body);
      streamingData.close();
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'stream-text',
    },
  });

  return result.toDataStreamResponse({
    data: streamingData,
  });
}

async function tryWithFallback(options: {
  vertexModel: Model,
  openaiModel: Model,
  temperature: number,
  system: string,
  messages: CoreMessage[],
  maxSteps: number,
  experimental_activeTools?: string[] | undefined,
  tools?: Record<string, CoreTool<any, any>> | undefined,
  onFinish: (params: { responseMessages: any[] }) => Promise<void>,
  experimental_telemetry: Object,
  initialTimeout?: number,
  maxRetries?: number
}) {
  const {
    vertexModel,
    openaiModel,
    initialTimeout = 5000,
    maxRetries = 3,
    ...streamOptions
  } = options;

  async function streamWithTimeout(model: any) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      let initialTimeoutId: ReturnType<typeof setTimeout> | undefined = setTimeout(() => controller.abort(), initialTimeout);
      let chunkTimeoutId: ReturnType<typeof setTimeout> | undefined;
      let wasChunkTimeout = false;  // Flag to track chunk timeouts

      try {
        return await streamText({
          ...streamOptions,
          model,
          abortSignal: controller.signal,
          onChunk: async (event) => {
            // Clear initial connection timeout on first chunk
            if (initialTimeoutId) {
              clearTimeout(initialTimeoutId);
              initialTimeoutId = undefined;
            }

            // Reset chunk timeout
            if (chunkTimeoutId) {
              clearTimeout(chunkTimeoutId);
            }
            chunkTimeoutId = setTimeout(() => {
              controller.abort();
              wasChunkTimeout = true;
            } , initialTimeout * 10);
          }
        });
      } catch (error: any) {
        // Clean up any pending timeouts
        if (initialTimeoutId) clearTimeout(initialTimeoutId);
        if (chunkTimeoutId) clearTimeout(chunkTimeoutId);

        if (error.name === 'AbortError') {
          if (attempt === maxRetries || wasChunkTimeout) {
            throw error;
          }
          console.warn(`Timeout attempt ${attempt}/${maxRetries}, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 250 * Math.pow(2, attempt - 1)));
          continue;
        }
        throw error;
      }
    }
    throw new Error('Should not reach here');
  }

  try {
    return await streamWithTimeout(vertex(vertexModel.apiIdentifier));
  } catch (error: any) {
    console.error(
        error.name === 'AbortError'
            ? "Vertex model timed out after all retries, falling back to OpenAI model"
            : "Vertex model failed, falling back to OpenAI model:" + error
    );
    return await streamWithTimeout(openai(openaiModel.apiIdentifier));
  }
}

function serializeDocuments(documents: RetrievalDocument[]): JSONValue {
  return documents.map(doc => {
    // Create metadata object without undefined values
    const metadata: { [key: string]: number } = {};
    let username = "";
    let link = "";
    let timestamp = 0;
    let source = "";

    if (doc.metadata.vector_score !== undefined) {
      metadata.vector_score = doc.metadata.vector_score;
    }

    if (doc.metadata.rerank_score !== undefined) {
      metadata.rerank_score = doc.metadata.rerank_score;
    }

    if (doc.username !== undefined){
      username = doc.username;
    }

    if (doc.link !== undefined){
      link = doc.link;

    }

    if (doc.timestamp !== undefined && doc.timestamp !== 0){
      timestamp = doc.timestamp;
    }

    if (doc.source !== undefined) {
      source = doc.source;

    }

    return {
      content: doc.content,
      metadata: metadata,
      username: username,
      link: link,
      timestamp: timestamp,
      source: source,

    };
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
