
import React, { useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAppContext } from '../../context/AppContext';
import Message from './Message';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import UserTypeSelector from '../common/UserTypeSelector';
import QuickActions from '../common/QuickActions';

const ChatPanel = () => {
  const { messages, isStreaming, activeDocumentId, documents } = useChat();
  const { state } = useAppContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const activeDocument = documents.find(d => d.id === activeDocumentId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  return (
    <div className="flex flex-col h-full max-h-screen">
      <header className="p-4 border-b border-[var(--bg-border)] bg-[var(--bg-header)] backdrop-blur-sm z-10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] truncate">
              {activeDocument ? <>Chatting with: <span className="text-[var(--bg-button)]">{activeDocument.name}</span></> : "No Document Selected"}
            </h2>
            {activeDocument && (
              <div className="flex items-center space-x-2 px-2 py-1 bg-[var(--bg-surface)] rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-[var(--text-secondary)] font-medium">
                  {state.userType.charAt(0).toUpperCase() + state.userType.slice(1)} Mode
                </span>
              </div>
            )}
          </div>
          {activeDocument && <UserTypeSelector />}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {activeDocument && <QuickActions />}
        <div className="p-4 md:p-6 space-y-6">
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
          {isStreaming && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t border-transparent  flex-shrink-0 bg-transparent">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatPanel;
