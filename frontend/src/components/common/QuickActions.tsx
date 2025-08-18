import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useChat } from '../../hooks/useChat';
import { 
  BookOpenIcon, 
  ClipboardListIcon, 
  LightbulbIcon, 
  FileTextIcon 
} from './icons';

const QuickActions = () => {
  const { state } = useAppContext();
  const { userType } = state;
  const { sendMessage, isStreaming } = useChat();
  const [clickedAction, setClickedAction] = useState<string | null>(null);

  const quickActions = {
    student: [
      { icon: BookOpenIcon, text: "Create Study Guide", prompt: "Create a comprehensive study guide for this document" },
      { icon: ClipboardListIcon, text: "Generate Quiz", prompt: "Create a quiz with questions based on this document" },
      { icon: LightbulbIcon, text: "Key Concepts", prompt: "What are the main concepts and key points in this document?" },
      { icon: FileTextIcon, text: "Summarize", prompt: "Provide a clear summary of this document" }
    ],
    teacher: [
      { icon: BookOpenIcon, text: "Lesson Plan", prompt: "Create a detailed lesson plan based on this document" },
      { icon: ClipboardListIcon, text: "Discussion Questions", prompt: "Generate discussion questions for classroom use" },
      { icon: LightbulbIcon, text: "Activities", prompt: "Suggest engaging classroom activities related to this content" },
      { icon: FileTextIcon, text: "Assessment Ideas", prompt: "Provide assessment and evaluation ideas for this topic" }
    ],
    researcher: [
      { icon: BookOpenIcon, text: "Research Gaps", prompt: "Identify research gaps and opportunities in this document" },
      { icon: ClipboardListIcon, text: "Methodology", prompt: "Analyze the methodology and suggest improvements" },
      { icon: LightbulbIcon, text: "Literature Review", prompt: "Help with literature review and synthesis of this work" },
      { icon: FileTextIcon, text: "Citations", prompt: "Provide proper citation format and references" }
    ],
    general: [
      { icon: BookOpenIcon, text: "Main Points", prompt: "What are the main points and key takeaways from this document?" },
      { icon: ClipboardListIcon, text: "Analysis", prompt: "Provide a balanced analysis of this document" },
      { icon: LightbulbIcon, text: "Applications", prompt: "What are the practical applications of this content?" },
      { icon: FileTextIcon, text: "Overview", prompt: "Give me an overview of this document" }
    ]
  };

  const currentActions = quickActions[userType] || quickActions.general;

  // Reset clicked action when streaming stops
  React.useEffect(() => {
    if (!isStreaming) {
      setClickedAction(null);
    }
  }, [isStreaming]);

  return (
    <div className="p-4 border-b border-[var(--bg-border)] bg-[var(--bg-surface)]/30">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-[var(--text-secondary)] font-medium">Quick Actions</div>
        <div className="text-xs text-[var(--bg-button)] font-medium capitalize">
          {userType} Mode
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {currentActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => {
                console.log('Quick action clicked:', action.prompt);
                setClickedAction(action.text);
                sendMessage(action.prompt);
              }}
              disabled={isStreaming}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 text-left group hover:scale-105 ${
                clickedAction === action.text && isStreaming
                  ? 'bg-[var(--bg-button)] text-white'
                  : 'bg-[var(--bg-input)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={action.prompt}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-medium truncate">{action.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions; 