
import FileUpload from './FileUpload';
import DocumentList from './DocumentList';
import { BrainCircuitIcon } from '../common/icons';
import ThemeSwitcher from '../common/ThemeSwitcher';
import HelpButton from '../common/HelpButton';


const Sidebar = () => {
  return (
    <div className="flex flex-col h-full text-[var(--text-secondary)] p-4 space-y-6 overflow-hidden bg-[var(--bg-sidebar)] border-r border-[var(--bg-border)]">
      <div className="flex items-center space-x-3 px-2 flex-shrink-0">
        <BrainCircuitIcon className="w-8 h-8 text-[var(--bg-button)]" />
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">PaperMind AI</h1>
      </div>
      
      <div className="flex-grow flex flex-col space-y-4 overflow-y-auto">
        <FileUpload />
        <div className="flex-grow overflow-y-auto pr-1">
          <DocumentList />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] flex-shrink-0">
        <span>v2.1.0</span>
        <HelpButton />
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default Sidebar;
