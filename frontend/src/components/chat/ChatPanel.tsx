import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAppContext } from '../../context/AppContext';
import Message from './Message';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import WelcomeScreen from './WelcomeScreen';
import ComingSoonOverlay from '../common/ComingSoonOverlay';
import UserTypeSelector from '../common/UserTypeSelector';
import QuickActions from '../common/QuickActions';

const ChatPanel = () => {
  const { messages, isStreaming, activeDocumentId, documents } = useChat();
  const { state } = useAppContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const activeDocument = documents.find(d => d.id === activeDocumentId);
  
  // Check if we should show welcome screen (only greeting message exists)
  const shouldShowWelcome = messages.length === 1 && messages[0].id.includes('greeting');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[var(--bg-primary)] relative">
      {/* Coming Soon Overlay for non-PDF modes */}
      <ComingSoonOverlay 
        mode={state.mode} 
        isVisible={state.mode !== 'pdf'} 
      />
      {/* URL Prompts - Fixed at top when needed */}
      {!shouldShowWelcome && state.mode === 'youtube' && !state.youtubeUrl && (
        <div className="flex-shrink-0 border-b border-[var(--bg-border)]">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <YouTubeUrlPrompt />
          </div>
        </div>
      )}
      
      {!shouldShowWelcome && state.mode === 'site' && !state.siteUrl && (
        <div className="flex-shrink-0 border-b border-[var(--bg-border)]">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <SiteUrlPrompt />
          </div>
        </div>
      )}

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Show Welcome Screen when only greeting message exists */}
        {shouldShowWelcome ? (
          <WelcomeScreen mode={state.mode} hasDocument={!!activeDocument} />
        ) : (
          <div className="max-w-3xl mx-auto px-4">
            <div className="space-y-6 py-6">
              {messages.map((msg) => (
                <Message key={msg.id} message={msg} />
              ))}
              {isStreaming && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Message Input - Fixed at Bottom */}
      <div className="flex-shrink-0 bg-[var(--bg-primary)] border-t border-[var(--bg-border)]">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatPanel;

// Inline prompt components for URLs
const YouTubeUrlPrompt: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [val, setVal] = useState(state.youtubeUrl ?? '');
  const onSave = () => dispatch({ type: 'SET_YOUTUBE_URL', payload: val || null });
  
  return (
    <div className="bg-[var(--bg-input)] border border-[var(--bg-border)] rounded-2xl p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-1">YouTube Video URL</h3>
        <p className="text-xs text-[var(--text-secondary)]">Enter a YouTube URL to analyze the video content</p>
      </div>
      <div className="flex gap-2">
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--bg-border)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--bg-button)] text-sm"
        />
        <button 
          onClick={onSave} 
          className="px-4 py-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--text-primary)]/80 transition-colors text-sm font-medium"
        >
          Set URL
        </button>
      </div>
    </div>
  );
};

const SiteUrlPrompt: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [val, setVal] = useState(state.siteUrl ?? '');
  const onSave = () => dispatch({ type: 'SET_SITE_URL', payload: val || null });
  
  return (
    <div className="bg-[var(--bg-input)] border border-[var(--bg-border)] rounded-2xl p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-1">Website URL</h3>
        <p className="text-xs text-[var(--text-secondary)]">Enter a website URL to analyze the content</p>
      </div>
      <div className="flex gap-2">
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--bg-border)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--bg-button)] text-sm"
        />
        <button 
          onClick={onSave} 
          className="px-4 py-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--text-primary)]/80 transition-colors text-sm font-medium"
        >
          Set URL
        </button>
      </div>
    </div>
  );
};
