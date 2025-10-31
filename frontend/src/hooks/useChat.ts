import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import * as apiService from '../services/apiService';
import { storeFile, getFile } from '../services/fileStoreService';
import { MAX_FILE_SIZE_BYTES } from '../constants';
import type { Document, HighlightInfo } from '../types';

export const useChat = () => {
  const { state, dispatch } = useAppContext();
  const { activeDocumentId } = state;

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
  }, [dispatch]);
  
  const uploadFile = useCallback(async (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      showToast(`File size exceeds 10MB limit.`, 'error');
      return;
    }
    
    // Initialize upload progress
    dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: {
      fileName: file.name,
      progress: 0,
      status: 'uploading'
    }});
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await apiService.uploadPdf(file, (progress) => {
        dispatch({ type: 'UPDATE_UPLOAD_PROGRESS', payload: { progress } });
      });
      
      // Update status to processing
      dispatch({ type: 'UPDATE_UPLOAD_PROGRESS', payload: { 
        status: 'processing',
        progress: 100 
      }});
      
      const newDocument = response.document;
      
      // Store the file locally for previewing, linking it to the new document ID
      storeFile(newDocument.id, file);

      dispatch({ type: 'ADD_DOCUMENT', payload: newDocument });
      dispatch({ type: 'SET_ACTIVE_DOCUMENT', payload: newDocument.id });
      
      // Mark upload as complete
      dispatch({ type: 'UPDATE_UPLOAD_PROGRESS', payload: { 
        status: 'complete',
        progress: 100 
      }});
      
      showToast(`'${newDocument.name}' uploaded successfully!`, 'success');
      
      // Clear upload progress after a short delay
      setTimeout(() => {
        dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: null });
      }, 2000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during upload.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'UPDATE_UPLOAD_PROGRESS', payload: { 
        status: 'error',
        error: errorMessage 
      }});
      showToast(errorMessage, 'error');
      
      // Clear upload progress after error
      setTimeout(() => {
        dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: null });
      }, 3000);
    }
  }, [dispatch, showToast]);
  
  const setActiveDocument = useCallback((docId: string | null) => {
    dispatch({ type: 'SET_ACTIVE_DOCUMENT', payload: docId });
    // If a document is being previewed, close it when switching context
    if (state.previewingDocument) {
        dispatch({ type: 'HIDE_PREVIEW' });
    }
  }, [dispatch, state.previewingDocument]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage = { id: Date.now().toString(), text, sender: 'user' as const };
    dispatch({ type: 'ADD_USER_MESSAGE', payload: userMessage });

    const aiMessageId = (Date.now() + 1).toString();
    dispatch({ type: 'START_AI_RESPONSE', payload: { id: aiMessageId } });

    try {
      if (state.mode === 'pdf') {
        if (!activeDocumentId) {
          showToast('Please select or upload a PDF before chatting.', 'error');
          return;
        }
        const chatResponse = await apiService.streamChatResponse({
          message: text,
          documentId: activeDocumentId,
          userType: state.userType,
          onChunk: (chunk) => {
            dispatch({ type: 'APPEND_AI_RESPONSE', payload: { id: aiMessageId, chunk } });
          },
        });
        
        // Add sources to the message if available
        if (chatResponse.sources && chatResponse.sources.length > 0) {
          dispatch({ 
            type: 'ADD_SOURCES_TO_MESSAGE', 
            payload: { 
              messageId: aiMessageId, 
              sources: chatResponse.sources 
            } 
          });
        }
      } else if (state.mode === 'general') {
        const reply = `General chat: You said "${text}"`;
        dispatch({ type: 'APPEND_AI_RESPONSE', payload: { id: aiMessageId, chunk: reply } });
      } else if (state.mode === 'youtube') {
        if (!state.youtubeUrl) {
          showToast('Please paste a YouTube URL first.', 'error');
          return;
        }
        const reply = `YouTube (${state.youtubeUrl}): Received your message "${text}". (Analysis coming soon)`;
        dispatch({ type: 'APPEND_AI_RESPONSE', payload: { id: aiMessageId, chunk: reply } });
      } else if (state.mode === 'site') {
        if (!state.siteUrl) {
          showToast('Please enter a Website URL first.', 'error');
          return;
        }
        const reply = `Website (${state.siteUrl}): Received your message "${text}". (Analysis coming soon)`;
        dispatch({ type: 'APPEND_AI_RESPONSE', payload: { id: aiMessageId, chunk: reply } });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI response';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      showToast(errorMessage, 'error');
    } finally {
      dispatch({ type: 'FINISH_AI_RESPONSE' });
    }
  }, [activeDocumentId, dispatch, showToast, state.mode, state.siteUrl, state.userType, state.youtubeUrl]);
  
  const showPreview = useCallback((docOrId: Document | string, highlightInfo?: HighlightInfo) => {
    let doc: Document;
    
    if (typeof docOrId === 'string') {
      // Find document by ID
      const foundDoc = state.documents.find((d: Document) => d.id === docOrId);
      if (!foundDoc) {
        showToast("Document not found", 'error');
        return;
      }
      doc = foundDoc;
    } else {
      doc = docOrId;
    }
    
    const file = getFile(doc.id);
    if (file) {
      // Create a temporary URL for the file blob to show in the preview
      const fileUrl = URL.createObjectURL(file);
      dispatch({ 
        type: 'SHOW_PREVIEW', 
        payload: { 
          ...doc, 
          fileUrl,
          highlightInfo 
        } 
      });
    } else {
      showToast("Could not find the file to preview. Please try re-uploading.", 'error');
    }
  }, [dispatch, showToast, state.documents]);
  
  const hidePreview = useCallback(() => {
    const { previewingDocument } = state;
    if (previewingDocument && previewingDocument.fileUrl) {
      // Clean up the object URL to prevent memory leaks
      URL.revokeObjectURL(previewingDocument.fileUrl);
    }
    dispatch({ type: 'HIDE_PREVIEW' });
  }, [dispatch, state]);

  return { ...state, uploadFile, sendMessage, setActiveDocument, showPreview, hidePreview };
  
};
