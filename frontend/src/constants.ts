
export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
};

export const GREETING_MESSAGES = {
    pdf: {
        id: 'pdf-greeting',
        text: "Hello! I'm PaperMind AI. 📄 Upload a PDF document to start chatting with your documents. I can help you analyze, summarize, and answer questions about your PDFs.",
        sender: 'ai' as const,
    },
    general: {
        id: 'general-greeting',
        text: "Hello! I'm PaperMind AI. 💬 I'm here to help with any questions or tasks you have. Feel free to ask me anything - from explanations to creative writing!",
        sender: 'ai' as const,
    },
    youtube: {
        id: 'youtube-greeting',
        text: "Hello! I'm PaperMind AI. 🎥 Paste a YouTube video URL above and I'll help you analyze the content, create summaries, or answer questions about the video.",
        sender: 'ai' as const,
    },
    site: {
        id: 'site-greeting',
        text: "Hello! I'm PaperMind AI. 🌐 Enter a website URL above and I'll help you analyze the content, extract key information, or answer questions about the site.",
        sender: 'ai' as const,
    },
};
