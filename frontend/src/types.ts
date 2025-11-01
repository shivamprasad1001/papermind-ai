export type Sender = 'user' | 'ai';

export interface MessageSource {
  id: string;
  documentId: string;
  documentName: string;
  pageNumber: number;
  excerpt: string;
  confidence: number; // 0-1
  startIndex?: number;
  endIndex?: number;
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  sources?: MessageSource[];
}

export interface HighlightInfo {
  pageNumber: number;
  startIndex?: number;
  endIndex?: number;
  excerpt: string;
}

export interface Document {
  id: string;
  name: string;
  // fileUrl is now optional as it's generated for preview
  fileUrl?: string;
  highlightInfo?: HighlightInfo;
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
export type ChatMode = 'pdf' | 'general' | 'youtube' | 'site';

export interface AppState {
  documents: Document[];
  activeDocumentId: string | null;
  // This now holds the document to be shown in the side panel
  previewingDocument: Document | null; 
  messages: Message[];
  messagesByMode?: Record<ChatMode, Message[]>;
  messagesByDocument?: Record<string, Message[]>; // Store chat history per document ID
  isLoading: boolean; // For file uploads
  isStreaming: boolean; // For chat responses
  uploadProgress: UploadProgress | null;
  theme: Theme;
  userType: UserType;
  mode: ChatMode;
  youtubeUrl?: string | null;
  siteUrl?: string | null;
  error: string | null;
  toasts: Toast[];
}

// for 