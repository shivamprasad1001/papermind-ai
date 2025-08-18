import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { SendIcon } from '../common/icons';

const MessageInput = () => {
  const [text, setText] = useState('');
  const { sendMessage, isStreaming, activeDocumentId } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDisabled = isStreaming || !activeDocumentId;

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
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center mx-auto bg-transparent"
    >
    <div className="flex items-center w-full md:w-1/2 p-1 bg-[var(--bg-input)] border border-[var(--border-input)] lg:rounded-3xl backdrop-blur ">
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
    placeholder={
      !activeDocumentId
        ? 'Please upload a document first'
        : 'Ask a question about your document...'
    }
    className="flex-1 resize-none bg-transparent text-[var(--text-primary)] 
               placeholder-[var(--text-secondary)] focus:outline-none 
               text-sm p-2 backdrop-blur lg:rounded-3xl"
    rows={1}
    disabled={isDisabled}
    style={{ maxHeight: '150px' }}
  />

  <button
    type="submit"
    disabled={isDisabled || !text.trim()}
    className="ml-2 flex items-center justify-center rounded-full p-2 
               transition-colors duration-200 bg-[var(--bg-button)] 
               hover:bg-[var(--bg-button-hover)] enabled:shadow-lg 
               disabled:cursor-not-allowed disabled:opacity-50"
    aria-label="Send message"
  >
    <SendIcon className="h-5 w-5 text-white" />
  </button>
</div>

    </form>
  );
};

export default MessageInput;
