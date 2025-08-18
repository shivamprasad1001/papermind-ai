
import { Buffer } from 'buffer';
import pdf from 'pdf-parse';

/**
 * Extracts text content from a PDF buffer.
 * @param buffer - The PDF file buffer.
 * @returns A promise that resolves to the text content of the PDF.
 */

export const parsePdf = async (buffer: Buffer): Promise<string> => {
    const data = await pdf(buffer);
    return data.text;
    };
/**
 * Splits a long text into smaller, overlapping chunks.
 * @param text - The text to chunk.
 * @param chunkSize - The desired size of each chunk (in characters).
 * @param overlap - The number of characters to overlap between chunks.
 * @returns An array of text chunks.
 */
export const chunkText = (text: string, chunkSize = 1500, overlap = 200): string[] => {
    const chunks: string[] = [];
    let i = 0;
    while (i < text.length) {
        const end = Math.min(i + chunkSize, text.length);
        chunks.push(text.slice(i, end));
        i += chunkSize - overlap;
        if (i >= text.length) break;
    }
    return chunks;
};
