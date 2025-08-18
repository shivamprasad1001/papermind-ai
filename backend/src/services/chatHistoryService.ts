
import type { Content } from "@google/genai";

// Simple in-memory store for chat histories, keyed by documentId
const chatHistories = new Map<string, Content[]>();

const MAX_HISTORY_LENGTH = 10; // Max number of user/model message pairs

/**
 * Retrieves the chat history for a given document.
 * @param documentId The ID of the document.
 * @returns The chat history array.
 */
export const getHistory = (documentId: string): Content[] => {
    return chatHistories.get(documentId) || [];
};

/**
 * Adds a new message to the chat history for a document.
 * @param documentId The ID of the document.
 * @param message The message content to add.
 */
export const addMessageToHistory = (documentId: string, message: Content): void => {
    const history = getHistory(documentId);
    history.push(message);

    // Prune history to keep it within the size limit
    if (history.length > MAX_HISTORY_LENGTH * 2) {
        chatHistories.set(documentId, history.slice(-MAX_HISTORY_LENGTH * 2));
    } else {
        chatHistories.set(documentId, history);
    }
};

/**
 * Clears the chat history for a document.
 * @param documentId The ID of the document.
 */
export const clearHistory = (documentId: string): void => {
    chatHistories.delete(documentId);
};
