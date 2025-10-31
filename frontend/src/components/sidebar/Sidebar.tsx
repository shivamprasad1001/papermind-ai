
import React, { useState } from 'react';
import DocumentList from './DocumentList';
import { 
  BrainCircuitIcon, 
  PlusIcon, 
  MessageCircleIcon, 
  YoutubeIcon, 
  FileTextIcon, 
  GlobeIcon 
} from '../common/icons';
import ThemeSwitcher from '../common/ThemeSwitcher';
import HelpButton from '../common/HelpButton';
import { useAppContext } from '../../context/AppContext';

const Sidebar = () => {
  const [isNewChatHovered, setIsNewChatHovered] = useState(false);
  const { state, dispatch } = useAppContext();

  const modes = [
    { key: 'general', label: 'General', icon: MessageCircleIcon, description: 'Chat with AI' },
    { key: 'youtube', label: 'YouTube', icon: YoutubeIcon, description: 'Analyze videos' },
    { key: 'pdf', label: 'PDF', icon: FileTextIcon, description: 'Chat with docs' },
    { key: 'site', label: 'Website', icon: GlobeIcon, description: 'Browse & chat' },
  ];

  return (
    <div className="flex flex-col h-full bg-[var(--bg-sidebar)] text-[var(--text-primary)] border-r border-[var(--bg-border)] shadow-lg glass-sidebar">
      {/* App Header */}
      <div className="p-6 border-b border-[var(--bg-border)]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 text-[var(--bg-button)] flex-shrink-0">
            <BrainCircuitIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">PaperMind</h1>
            <p className="text-xs text-[var(--text-secondary)] font-medium">AI Assistant</p>
          </div>
        </div>
      </div>
      
      {/* New Chat Button */}
      <div className="p-4">
        <button 
          className="w-full bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] text-white py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md group"
          onMouseEnter={() => setIsNewChatHovered(true)}
          onMouseLeave={() => setIsNewChatHovered(false)}
        >
          <PlusIcon className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
          <span className="font-medium">New Chat</span>
          {isNewChatHovered && (
            <span className="text-xs opacity-75 ml-auto">⌘N</span>
          )}
        </button>
      </div>

      {/* Chat Modes */}
      <div className="px-4 pb-4">
        <div className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider mb-3">
          Chat Modes
        </div>
        <div className="space-y-2">
          {modes.map((mode) => {
            const isActive = state.mode === (mode.key as any);
            const Icon = mode.icon;
            return (
              <button
                key={mode.key}
                onClick={() => dispatch({ type: 'SET_MODE', payload: mode.key as any })}
                className={`w-full p-3 rounded-lg text-left transition-all duration-200 group relative overflow-hidden
                  ${isActive
                    ? 'bg-[var(--bg-button)] text-white shadow-md'
                    : 'bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] border border-[var(--bg-border)]'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-[var(--bg-button)]'}`} />
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm ${isActive ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                      {mode.label}
                    </div>
                    <div className={`text-xs ${isActive ? 'text-white/70' : 'text-[var(--text-secondary)]'}`}>
                      {mode.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Documents Section - Only show for PDF mode */}
      {state.mode === 'pdf' && (
        <div className="flex-grow overflow-y-auto px-4 pb-4">
          <div className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider mb-3">
            Your Documents
          </div>
          <div className="space-y-3">
            <DocumentList />
          </div>
        </div>
      )}

      {/* Spacer for non-PDF modes */}
      {state.mode !== 'pdf' && <div className="flex-grow" />}

      {/* Footer */}
      <div className="p-4 border-t border-[var(--bg-border)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-medium">
            v2.1.0
          </div>
        </div>
        <div className="text-xs text-[var(--text-secondary)] text-center">
          Made with ❤️ by PaperMind
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
