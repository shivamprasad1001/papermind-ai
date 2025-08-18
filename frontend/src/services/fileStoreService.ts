// A simple in-memory cache to hold File objects on the client-side.
// This allows us to preview files without re-uploading or complex state management.
const fileCache = new Map<string, File>();

/**
 * Stores a File object associated with its unique document ID.
 * @param id The unique ID of the document from the backend.
 * @param file The File object to store.
 */
export const storeFile = (id: string, file: File): void => {
  fileCache.set(id, file);
};

/**
 * Retrieves a File object by its document ID.
 * @param id The unique ID of the document.
 * @returns The File object, or undefined if not found.
 */
export const getFile = (id: string): File | undefined => {
  return fileCache.get(id);
};

/**
 * Removes a file from the cache. (Optional, can be used for cleanup)
 * @param id The unique ID of the document to remove.
 */
export const removeFile = (id: string): void => {
    fileCache.delete(id);
};