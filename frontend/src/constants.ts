
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
};

export const GREETING_MESSAGE = {
    id: 'initial-greeting',
    text: "Hello! I'm PaperMind AI. Please upload one or more PDF documents from the sidebar to get started.",
    sender: 'ai' as const,
};
