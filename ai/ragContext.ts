import {CoreMessage, CoreUserMessage} from 'ai';

import { fetchWithRetry } from "@/lib/utils";

const RETRIEVAL_PORT = process.env.RETRIEVAL_PORT || '9010';

export interface RetrievalDocument {
    content: string;
    metadata: {
        vector_score?: number;
        rerank_score?: number;
    };
    username?: string;
    link?: string;
    source?: string;
    timestamp?: number;
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

export async function getRagContext(messages: CoreMessage[], userMessage : CoreUserMessage): Promise<RetrievalDocument[]> {
    try {
      const chatHistory = messages.slice(0, -1);

      const response = await fetchWithRetry(
        `http://api.juphorizon.com:${RETRIEVAL_PORT}/process_query`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_message: userMessage.content,
            chat_history: chatHistory,
            limit: 20,
            is_chat: true,
          }),
        },
      );

      if (!response) {
        return [];
      }

      const result: RetrievalResponse = await response.json();

      console.log(
        'Gottten Rag Context in: ' +
          result.search_metadata?.processing_time +
          's'
          + ' with ' + result.retrieved_documents.length + ' documents'
      );

      //console.log(result.retrieved_documents);

      return result.retrieved_documents;
    } catch (error) {
      console.error('Error fetching RAG context:', error);
      return [];
    }
}