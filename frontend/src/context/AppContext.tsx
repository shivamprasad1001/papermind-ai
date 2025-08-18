
import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import type { AppState, Document, Message, Toast, UploadProgress, Theme, UserType } from '../types';
import { GREETING_MESSAGE } from '../constants';

type Action =
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'SET_ACTIVE_DOCUMENT'; payload: string | null }
  | { type: 'ADD_USER_MESSAGE'; payload: Message }
  | { type: 'START_AI_RESPONSE'; payload: { id: string } }
  | { type: 'APPEND_AI_RESPONSE'; payload: { id: string; chunk: string } }
  | { type: 'FINISH_AI_RESPONSE' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'SHOW_PREVIEW'; payload: Document }
  | { type: 'HIDE_PREVIEW' }
  | { type: 'SET_UPLOAD_PROGRESS'; payload: UploadProgress | null }
  | { type: 'UPDATE_UPLOAD_PROGRESS'; payload: Partial<UploadProgress> }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_USER_TYPE'; payload: UserType };

const initialState: AppState = {
  documents: [],
  activeDocumentId: null,
  previewingDocument: null,
  messages: [GREETING_MESSAGE],
  isLoading: false,
  isStreaming: false,
  uploadProgress: null,
  theme: 'dark',
  userType: 'general',
  error: null,
  toasts: [],
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_DOCUMENT':
      // Avoid adding duplicates
      if (state.documents.some(doc => doc.id === action.payload.id)) {
        return state;
      }
      return { ...state, documents: [...state.documents, action.payload] };
    case 'SET_ACTIVE_DOCUMENT':
      // If switching to a new document, clear messages. If deselecting, show greeting.
      const newMessages = action.payload ? [] : [GREETING_MESSAGE];
      return { 
        ...state, 
        activeDocumentId: action.payload,
        messages: newMessages,
        error: null 
      };
    case 'ADD_USER_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'START_AI_RESPONSE':
      return {
        ...state,
        isStreaming: true,
        messages: [...state.messages, { id: action.payload.id, text: '', sender: 'ai' }],
      };
    case 'APPEND_AI_RESPONSE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id
            ? { ...msg, text: msg.text + action.payload.chunk }
            : msg
        ),
      };
    case 'FINISH_AI_RESPONSE':
      return { ...state, isStreaming: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    case 'SHOW_PREVIEW':
        return { ...state, previewingDocument: action.payload };
    case 'HIDE_PREVIEW':
        return { ...state, previewingDocument: null };
    case 'SET_UPLOAD_PROGRESS':
        return { ...state, uploadProgress: action.payload };
    case 'UPDATE_UPLOAD_PROGRESS':
        return { 
          ...state, 
          uploadProgress: state.uploadProgress 
            ? { ...state.uploadProgress, ...action.payload }
            : null 
        };
    case 'SET_THEME':
        return { ...state, theme: action.payload };
    case 'SET_USER_TYPE':
        return { ...state, userType: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Apply theme to document body
  useEffect(() => {
    document.documentElement.className = `theme-${state.theme}`;
    localStorage.setItem('papermind-theme', state.theme);
  }, [state.theme]);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('papermind-theme') as Theme;
    if (savedTheme && savedTheme !== state.theme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
