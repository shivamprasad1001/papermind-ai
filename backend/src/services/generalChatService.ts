import { getChatCompletion } from './geminiService';
import { Content } from "@google/genai";

// In-memory storage for general chat history per session
// In production, use a database (MongoDB, PostgreSQL, etc.)
const sessionHistory: Map<string, Content[]> = new Map();

/**
 * Gets the chat history for a general chat session.
 * @param sessionId - Unique session ID for the user/browser
 * @returns Array of previous messages in the conversation
 */
export const getSessionHistory = (sessionId: string): Content[] => {
  return sessionHistory.get(sessionId) || [];
};

/**
 * Adds a message to the general chat session history.
 * @param sessionId - Unique session ID for the user/browser
 * @param message - Message to add (user or model)
 */
export const addMessageToSessionHistory = (
  sessionId: string,
  message: Content
): void => {
  if (!sessionHistory.has(sessionId)) {
    sessionHistory.set(sessionId, []);
  }
  const history = sessionHistory.get(sessionId);
  if (history) {
    history.push(message);
  }
};

/**
 * Clears the chat history for a session.
 * @param sessionId - Unique session ID for the user/browser
 */
export const clearSessionHistory = (sessionId: string): void => {
  sessionHistory.delete(sessionId);
};

/**
 * Generates a general chat response without document context.
 * @param message - User's message
 * @param sessionId - Unique session ID for conversation continuity
 * @param userType - Type of user (student, teacher, researcher, general)
 * @returns Promise resolving to the AI response text
 */
export const generateGeneralChatResponse = async (
  message: string,
  sessionId: string,
  userType: 'student' | 'teacher' | 'researcher' | 'general' = 'general'
): Promise<string> => {
  try {
    console.log(`Generating general chat response for session: ${sessionId}, user type: ${userType}`);

    // Get conversation history
    const history = getSessionHistory(sessionId);
    console.log(`Chat history length: ${history.length}`);

    // Add user message to history
    addMessageToSessionHistory(sessionId, {
      role: 'user',
      parts: [{ text: message }]
    });

    // Generate response from Gemini (no document context)
    console.log('Getting chat completion from Gemini...');
    const stream = await getChatCompletion(message, '', history, userType);

    let fullResponse = '';
    for await (const chunk of stream) {
      const textPart = chunk.text;
      if (textPart) {
        fullResponse += textPart;
      }
    }

    console.log(`Generated response length: ${fullResponse.length} characters`);

    // Add AI response to history
    addMessageToSessionHistory(sessionId, {
      role: 'model',
      parts: [{ text: fullResponse }]
    });

    return fullResponse;
  } catch (error) {
    console.error('Error in general chat response generation:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate response: ${error.message}`);
    } else {
      throw new Error('Failed to generate response');
    }
  }
};
