import {CoreMessage, CoreUserMessage} from 'ai';

import { fetchWithRetry } from "@/lib/utils";

interface RetrievalDocument {
    content: string;
    metadata: {
        vector_score?: number;
        rerank_score?: number;
    };
}

interface RetrievalResponse {
    processed_query: string;
    retrieved_documents: RetrievalDocument[];
    search_metadata?: {
        total_found: number;
        num_queries: number;
        alpha_used: number;
        distance_threshold: number;
        processing_time: number;
    };
    expanded_queries?: string[];
    error?: string;
}

export async function getRagContext(messages: CoreMessage[], userMessage : CoreUserMessage): Promise<string> {
    let timeout;
    try {
      const chatHistory = messages.slice(0, -1);

      const response = await fetchWithRetry(
        'http://localhost:9001/process_query',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_message: userMessage.content,
            chat_history: chatHistory,
          }),
        },
      );

      if (!response) {
        return '';
      }

      const result: RetrievalResponse = await response.json();

      console.log(
        'Gottten Rag Context in: ' +
          result.search_metadata?.processing_time +
          's'
      );

      return result.retrieved_documents
        .map(
          (doc, index) =>
            `<document index="${index + 1}">
        <content>${doc.content}</content>
        <metadata>
          rerank_score: ${doc.metadata.rerank_score || 'N/A'}
        </metadata>
      </document>`
        )
        .join('\n');
    } catch (error) {
      console.error('Error fetching RAG context:', error);
      return '';
    }
}