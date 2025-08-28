import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import * as apiService from '../services/apiService';
import { storeFile, getFile } from '../services/fileStoreService';
import { MAX_FILE_SIZE_BYTES } from '../constants';
import type { Document } from '../types';

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
    if (!activeDocumentId) {
      showToast('Please select a document before chatting.', 'error');
      return;
    }
    if (!text.trim()) return;

    const userMessage = { id: Date.now().toString(), text, sender: 'user' as const };
    dispatch({ type: 'ADD_USER_MESSAGE', payload: userMessage });

    const aiMessageId = (Date.now() + 1).toString();
    dispatch({ type: 'START_AI_RESPONSE', payload: { id: aiMessageId } });

    try {
        console.log('Sending message with userType:', state.userType);
        await apiService.streamChatResponse({
    message: text,
    documentId: activeDocumentId,
    userType: state.userType,
    onChunk: (chunk) => {
        try {
            // Parse JSON if chunk is string
            const parsed = typeof chunk === "string" ? JSON.parse(chunk) : chunk;

            // Only take response field
            const aiResponse = parsed.response || "";

            if (aiResponse) {
                dispatch({
                    type: 'APPEND_AI_RESPONSE',
                    payload: { id: aiMessageId, chunk: aiResponse }
                });
            }
        } catch (e) {
            console.error("Failed to parse AI response chunk:", e, chunk);
        }
    },
});
    } catch (err) {
       const errorMessage = err instanceof Error ? err.message : 'Failed to get AI response';
       dispatch({ type: 'SET_ERROR', payload: errorMessage });
       showToast(errorMessage, 'error');
    } finally {
      dispatch({ type: 'FINISH_AI_RESPONSE' });
    }
  }, [activeDocumentId, dispatch, showToast, state.userType]);
  
  const showPreview = useCallback((doc: Document) => {
    const file = getFile(doc.id);
    if (file) {
      // Create a temporary URL for the file blob to show in the preview
      const fileUrl = URL.createObjectURL(file);
      dispatch({ type: 'SHOW_PREVIEW', payload: { ...doc, fileUrl } });
    } else {
      showToast("Could not find the file to preview. Please try re-uploading.", 'error');
    }
  }, [dispatch, showToast]);
  
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
