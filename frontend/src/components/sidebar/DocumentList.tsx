import { useChat } from '../../hooks/useChat';
import { FileTextIcon, EyeIcon } from '../common/icons';
import type { Document } from '../../types';

const DocumentList = () => {
  const { documents, activeDocumentId, setActiveDocument, showPreview } = useChat();

  const handlePreviewClick = (doc: Document) => {
    showPreview(doc);
  };

  if (documents.length === 0) {
    return (
      <div className="text-center text-sm text-[var(--text-secondary)] mt-4">
        No documents uploaded yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
       <h2 className="text-sm font-semibold text-[var(--text-secondary)] px-2 uppercase tracking-wider">Documents</h2>
       <ul className="space-y-1">
        {documents.map((doc, index) => (
          <li
            key={doc.id}
            className={`flex items-center justify-between p-2 rounded-md transition-all duration-200 group animate-fade-in ${
              activeDocumentId === doc.id
                ? 'bg-[var(--bg-button)]/20 scale-[1.01]'
                : 'hover:bg-[var(--bg-input)] hover:scale-[1.01]'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <button
              onClick={() => setActiveDocument(doc.id)}
              className="flex items-center space-x-3 text-left flex-1 truncate"
            >
              <FileTextIcon className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${activeDocumentId === doc.id ? 'text-[var(--bg-button)]' : 'text-[var(--text-secondary)]'}`} />
              <span className={`truncate flex-1 text-sm transition-all duration-200 ${activeDocumentId === doc.id ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                {doc.name}
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePreviewClick(doc);
              }}
              title="Preview document"
              className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)] opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <EyeIcon className="w-5 h-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentList;