import fs from 'fs/promises';
import path from 'path';

// Define the structure of a message and a conversation
export interface ChatMessage {
    messageId: string;
    role: 'user' | 'model';
    text: string;
    timestamp: string;
    feedback?: 'like' | 'dislike'; // Optional feedback field
    sources?: Array<{ pageNumber: number; textSnippet: string }>; // Optional for model responses
}

export type Conversation = ChatMessage[];

// Path to our JSON database file
const dbPath = path.join(process.cwd(), 'chat_logs.json');

// Reads the entire chat database from the JSON file
export const readChatDatabase = async (): Promise<Record<string, Conversation>> => {
    try {
        const fileContent = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error: any) {
        // If the file doesn't exist, return an empty object
        if (error.code === 'ENOENT') {
            return {};
        }
        throw error;
    }
};

// Writes the entire chat database to the JSON file
export const writeChatDatabase = async (data: Record<string, Conversation>): Promise<void> => {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
};