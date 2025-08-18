
export type Sender = 'user' | 'ai';

export interface Message {
  id: string;
  text: string;
  sender: Sender;
}

export interface Document {
  id: string;
  name: string;
  // fileUrl is now optional as it's generated for preview
  fileUrl?: string; 
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface UploadProgress {
  fileName: string;
  progress: number; // 0-100
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export type Theme = 'dark' | 'light' | 'blue' | 'green' | 'purple' | 'orange';
export type UserType = 'student' | 'teacher' | 'researcher' | 'general';

export interface AppState {
  documents: Document[];
  activeDocumentId: string | null;
  // This now holds the document to be shown in the side panel
  previewingDocument: Document | null; 
  messages: Message[];
  isLoading: boolean; // For file uploads
  isStreaming: boolean; // For chat responses
  uploadProgress: UploadProgress | null;
  theme: Theme;
  userType: UserType;
  error: string | null;
  toasts: Toast[];
}

// for 