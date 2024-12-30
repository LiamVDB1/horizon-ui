import {CoreMessage, CoreUserMessage} from 'ai';

import { fetchWithRetry } from "@/lib/utils";

export interface RetrievalDocument {
    content: string;
    metadata: {
        vector_score?: number;
        rerank_score?: number;
    };
    url?: string;
    source?: string;
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
        'http://89.168.40.57:9001/process_query',
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
        return [];
      }

      const result: RetrievalResponse = await response.json();

      console.log(
        'Gottten Rag Context in: ' +
          result.search_metadata?.processing_time +
          's'
          + ' with ' + result.retrieved_documents.length + ' documents'
      );

      return result.retrieved_documents;
    } catch (error) {
      console.error('Error fetching RAG context:', error);
      return [];
    }
}