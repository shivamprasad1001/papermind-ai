
import React, { useState, useEffect } from 'react';
import type { Document } from '../../types';
import { 
  XIcon, 
  FileTextIcon, 
  EyeIcon,
  UploadCloudIcon,
  LoaderIcon
} from '../common/icons';

interface DocumentPreviewPanelProps {
  doc: Document | null;
  onClose: () => void;
}

const DocumentPreviewPanel = ({ doc, onClose }: DocumentPreviewPanelProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const isVisible = !!doc;
  const highlightInfo = doc?.highlightInfo;

  useEffect(() => {
    if (doc) {
      setIsLoading(true);
      setHasError(false);
      setZoomLevel(100);
    }
  }, [doc]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  };

  return (
    <>
      {/* Backdrop */}
      {isVisible && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full bg-[var(--bg-surface)] border-l border-[var(--bg-border)] shadow-2xl
          transition-all duration-500 ease-in-out z-40
          ${isVisible 
            ? 'translate-x-0 w-full md:w-1/2 lg:w-2/5 xl:w-1/4' 
            : 'translate-x-full w-0'
          }
        `}
        aria-hidden={!isVisible}
        style={{
          right: isVisible ? '0' : '-100%'
        }}
      >
        {doc && (
          <div className="flex flex-col h-full">
            {/* Enhanced Header */}
            <header className="flex-shrink-0 bg-[var(--bg-header)] border-b border-[var(--bg-border)]">
              {/* Title Bar */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="flex-shrink-0 w-10 h-10 bg-[var(--bg-button)]/10 rounded-lg flex items-center justify-center">
                    <FileTextIcon className="w-5 h-5 text-[var(--bg-button)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-[var(--text-primary)] truncate" title={doc.name}>
                      {doc.name}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-[var(--text-secondary)]">
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <span>{getFileExtension(doc.name)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <EyeIcon className="w-3 h-3" />
                        <span>Preview Mode</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  {/* Zoom Controls */}
                  <div className="hidden lg:flex items-center space-x-1 bg-[var(--bg-input)] rounded-lg p-1">
                    <button
                      onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                      className="px-2 py-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded transition-colors"
                      disabled={zoomLevel <= 50}
                    >
                      -
                    </button>
                    <span className="px-2 py-1 text-xs font-medium text-[var(--text-primary)] min-w-[3rem] text-center">
                      {zoomLevel}%
                    </span>
                    <button
                      onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                      className="px-2 py-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded transition-colors"
                      disabled={zoomLevel >= 200}
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-input)] hover:text-[var(--text-primary)] transition-all duration-200 hover:scale-105"
                    aria-label="Close preview"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </header>

            {/* Highlight Information */}
            {highlightInfo && (
              <div className="flex-shrink-0 bg-[var(--bg-button)]/5 border-b border-[var(--bg-border)] p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-[var(--bg-button)]/10 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-[var(--bg-button)]">📍</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                        Source Reference
                      </h3>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-[var(--bg-button)]/10 text-[var(--bg-button)] rounded-full border border-[var(--bg-button)]/20">
                        Page {highlightInfo.pageNumber}
                      </span>
                    </div>
                    <blockquote className="text-sm text-[var(--text-secondary)] italic border-l-2 border-[var(--bg-button)]/30 pl-3 py-1 bg-[var(--bg-input)]/30 rounded-r">
                      "{highlightInfo.excerpt}"
                    </blockquote>
                    <p className="text-xs text-[var(--text-secondary)] mt-2">
                      This section was referenced in the AI response above
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 relative bg-[var(--bg-surface)] overflow-hidden">
              {/* Loading State */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-surface)]">
                  <div className="text-center">
                    <LoaderIcon className="w-8 h-8 text-[var(--bg-button)] animate-spin mx-auto mb-3" />
                    <p className="text-sm text-[var(--text-secondary)]">Loading document...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-surface)]">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <XIcon className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                      Preview Not Available
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                      This document cannot be previewed in the browser.
                    </p>
                    <button
                      onClick={() => window.open(doc.fileUrl, '_blank')}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-[var(--bg-button)] text-white rounded-lg hover:bg-[var(--bg-button-hover)] transition-colors"
                    >
                      <UploadCloudIcon className="w-4 h-4" />
                      <span>Open in New Tab</span>
                    </button>
                  </div>
                </div>
              )}

              {/* PDF Iframe */}
              <iframe
                src={highlightInfo ? `${doc.fileUrl}#page=${highlightInfo.pageNumber}` : doc.fileUrl}
                title={`Preview of ${doc.name}`}
                className={`w-full h-full border-0 transition-opacity duration-300 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                style={{ 
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top left',
                  width: `${100 * (100 / zoomLevel)}%`,
                  height: `${100 * (100 / zoomLevel)}%`
                }}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-4 py-3 bg-[var(--bg-header)] border-t border-[var(--bg-border)]">
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>Document Preview</span>
                <div className="flex items-center space-x-4">
                  <span>Zoom: {zoomLevel}%</span>
                  <button
                    onClick={() => window.open(doc.fileUrl, '_blank')}
                    className="text-[var(--bg-button)] hover:text-[var(--bg-button-hover)] transition-colors"
                  >
                    Open in new tab
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentPreviewPanel;
