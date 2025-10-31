import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { SendIcon } from '../common/icons';
import { useAppContext } from '../../context/AppContext';

const MessageInput = () => {
  const [text, setText] = useState('');
  const { sendMessage, isStreaming, activeDocumentId } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { state } = useAppContext();

  const isPdfMode = state.mode === 'pdf';
  const isGeneralMode = state.mode === 'general';
  const isYouTubeMode = state.mode === 'youtube';
  const isSiteMode = state.mode === 'site';

  const canSend = (
    (isPdfMode && !!activeDocumentId) ||
    isGeneralMode ||
    (isYouTubeMode && !!state.youtubeUrl) ||
    (isSiteMode && !!state.siteUrl)
  );
  const isDisabled = isStreaming || !canSend;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isDisabled) {
      sendMessage(text);
      setText('');
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl"
      >
        <div className="relative flex items-end bg-[var(--bg-input)] border border-[var(--bg-border)] rounded-2xl shadow-sm hover:shadow-md focus-within:shadow-md transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={(() => {
              if (isPdfMode) return !activeDocumentId ? 'Please upload a document first' : 'Message PaperMind AI';
              if (isGeneralMode) return 'Message PaperMind AI';
              if (isYouTubeMode) return state.youtubeUrl ? 'Ask about the YouTube video' : 'Paste a YouTube URL above to start';
              if (isSiteMode) return state.siteUrl ? 'Ask about the website' : 'Enter a website URL above to start';
              return 'Message PaperMind AI';
            })()}
            className="flex-1 resize-none bg-transparent text-[var(--text-primary)] 
                       placeholder-[var(--text-secondary)] focus:outline-none 
                       text-base px-4 py-3 pr-12 rounded-2xl min-h-[52px] max-h-[200px]
                       leading-6"
            rows={1}
            disabled={isDisabled}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={isDisabled || !text.trim()}
            className={`absolute right-2 bottom-2 flex items-center justify-center w-8 h-8 rounded-lg
                       transition-all duration-200
                       ${!isDisabled && text.trim() 
                         ? 'bg-[var(--text-primary)] hover:bg-[var(--text-primary)]/80 text-[var(--bg-input)]' 
                         : 'bg-transparent text-[var(--text-secondary)] cursor-not-allowed'
                       }`}
            aria-label="Send message"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Footer text like ChatGPT */}
        <div className="mt-2 text-center text-xs text-[var(--text-secondary)]/60">
          PaperMind AI can make mistakes. Check important info.
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
