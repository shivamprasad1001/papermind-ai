import React from 'react';
import { MessageSource } from '../../types';
import { FileTextIcon, ExternalLinkIcon } from '../common/icons';
import { useChat } from '../../hooks/useChat';

interface SourceCitationProps {
  sources: MessageSource[];
}

const SourceCitation: React.FC<SourceCitationProps> = ({ sources }) => {
  const { showPreview } = useChat();

  const handleSourceClick = (source: MessageSource) => {
    // Show document preview with highlighting
    showPreview(source.documentId, {
      pageNumber: source.pageNumber,
      startIndex: source.startIndex,
      endIndex: source.endIndex,
      excerpt: source.excerpt
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (confidence >= 0.6) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
        <FileTextIcon className="w-4 h-4" />
        <span className="font-medium">Sources ({sources.length})</span>
      </div>
      
      <div className="space-y-2">
        {sources.map((source, index) => (
          <button
            key={source.id}
            onClick={() => handleSourceClick(source)}
            className="w-full text-left p-3 rounded-lg bg-[var(--bg-input)]/50 border border-[var(--bg-border)] hover:bg-[var(--bg-surface)]/70 hover:border-[var(--bg-button)]/30 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-[var(--bg-button)] bg-[var(--bg-button)]/10 rounded border border-[var(--bg-button)]/20">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {source.documentName}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] bg-[var(--bg-surface)] px-2 py-1 rounded">
                    Page {source.pageNumber}
                  </span>
                </div>
                
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-2">
                  "{source.excerpt}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className={`inline-flex items-center space-x-1 text-xs px-2 py-1 rounded-full border ${getConfidenceColor(source.confidence)}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                    <span>{getConfidenceLabel(source.confidence)} confidence</span>
                  </div>
                  
                  <ExternalLinkIcon className="w-3 h-3 text-[var(--text-secondary)] group-hover:text-[var(--bg-button)] transition-colors" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="text-xs text-[var(--text-secondary)] italic">
        Click on any source to view the relevant section in the document
      </div>
    </div>
  );
};

export default SourceCitation;
