import { useState } from 'react';
import Sidebar from './sidebar/Sidebar';
import ChatPanel from './chat/ChatPanel';
import DocumentPreviewPanel from './chat/DocumentPreviewPanel';
import { MenuIcon, XIcon } from './common/icons';
import { useChat } from '../hooks/useChat';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { previewingDocument, hidePreview } = useChat();

  return (
    <div className="flex h-screen w-full relative overflow-hidden">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        className="md:hidden absolute top-4 left-4 z-30 p-2 rounded-md bg-gray-700 hover:bg-gray-600"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        absolute md:static md:translate-x-0
        h-full w-72 lg:w-80 bg-gray-800 border-r border-gray-700
        transition-transform duration-300 ease-in-out z-20 flex-shrink-0
      `}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0">
        <main className={`flex-1 transition-all duration-300 ease-in-out ${previewingDocument ? 'w-1/2' : 'w-full'}`}>
          <ChatPanel />
        </main>
      </div>

      {/* Document Preview Panel */}
      <DocumentPreviewPanel doc={previewingDocument} onClose={hidePreview} />
    </div>
  );
};

export default Layout;
