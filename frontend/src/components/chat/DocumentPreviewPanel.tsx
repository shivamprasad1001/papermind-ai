
import React from 'react';
import type { Document } from '../../types';
import { XIcon } from '../common/icons';

interface DocumentPreviewPanelProps {
  doc: Document | null;
  onClose: () => void;
}

const DocumentPreviewPanel = ({ doc, onClose }: DocumentPreviewPanelProps) => {
  const isVisible = !!doc;

  return (
    <div
      className={`
        absolute top-0 right-0 h-full bg-gray-800 border-l border-gray-700 shadow-2xl
        transition-transform duration-400 ease-in-out z-40
        ${isVisible ? 'translate-x-0 w-1/3' : 'translate-x-full w-1/5'}
      `}
      aria-hidden={!isVisible}
    >
      {doc && (
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0 bg-gray-800">
            <h2 className="text-lg font-semibold text-white truncate pr-4" title={doc.name}>
              Preview: {doc.name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
              aria-label="Close preview"
            >
              <XIcon className="w-8 h-6" />
            </button>
          </header>
          <div className="flex-1 bg-gray-100 overflow-hidden">
            <iframe
              src={doc.fileUrl}
              title={`Preview of ${doc.name}`}
              className="w-full h-full border-10"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentPreviewPanel;
