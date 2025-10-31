
import axios from 'axios';

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001';
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

export const uploadPdf = async (file: File, onProgress?: (progress: number) => void) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
  return response.data;
};

interface ChatResponse {
  success: boolean;
  response: string;
  sources?: Array<{
    id: string;
    documentId: string;
    documentName: string;
    pageNumber: number;
    excerpt: string;
    confidence: number;
    startIndex?: number;
    endIndex?: number;
  }>;
  documentId: string;
  userType: string;
  contextLength: number;
  timestamp: string;
}

interface StreamChatParams {
  message: string;
  documentId: string;
  userType?: 'student' | 'teacher' | 'researcher' | 'general';
  onChunk: (chunk: string) => void;
}

export const streamChatResponse = async ({ message, documentId, userType = 'general', onChunk }: StreamChatParams): Promise<ChatResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, documentId, userType }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch response' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    
    // Simulate streaming by calling onChunk with the full response
    onChunk(data.response);
    
    return data;
};
