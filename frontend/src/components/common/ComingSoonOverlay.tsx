import React from 'react';
import { SparklesIcon, ClockIcon } from './icons';

interface ComingSoonOverlayProps {
  mode: string;
  isVisible: boolean;
}

const ComingSoonOverlay: React.FC<ComingSoonOverlayProps> = ({ mode, isVisible }) => {
  if (!isVisible) return null;

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'general': return 'General Chat';
      case 'youtube': return 'YouTube Analysis';
      case 'site': return 'Website Analysis';
      default: return 'This Feature';
    }
  };

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />
      
      {/* Coming Soon Card */}
      <div className="relative bg-[var(--bg-surface)]/95 backdrop-blur-sm border border-[var(--bg-border)] rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center animate-fade-in">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-[var(--bg-button)] to-[var(--bg-button-hover)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <SparklesIcon className="w-8 h-8 text-white" />
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
          Coming Soon
        </h2>
        
        {/* Description */}
        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
          <span className="font-semibold text-[var(--bg-button)]">{getModeLabel(mode)}</span> is currently under development. 
          We're working hard to bring you this amazing feature!
        </p>
        
        {/* Status */}
        <div className="flex items-center justify-center space-x-2 text-sm text-[var(--text-secondary)]">
          <ClockIcon className="w-4 h-4" />
          <span>Expected release: Soon</span>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-[var(--bg-button)] rounded-full opacity-60 animate-pulse" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[var(--bg-button-hover)] rounded-full opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
    </div>
  );
};

export default ComingSoonOverlay;
