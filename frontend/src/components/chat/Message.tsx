import React from 'react';
import type { Message as MessageType } from '../../types';
import { UserIcon, BrainCircuitIcon } from '../common/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SourceCitation from './SourceCitation';

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const isUser = message.sender === 'user';

  const baseMessageClasses = "max-w-xl lg:max-w-3xl px-4 py-3 rounded-2xl prose prose-sm prose-invert dark:prose-invert max-w-none";
  const userMessageClasses = "glass-message text-[var(--text)] self-end rounded-br-lg border-[var(--userMessage-border)] bg-[var(--userMessage)]";
  const aiMessageClasses = "glass-message text-[var(--text)] self-start rounded-bl-lg border-[var(--aiMessage-border)] bg-[var(--aiMessage)]";

  return (
    <div className={`flex items-start gap-3 w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center glass">
          <BrainCircuitIcon className="w-5 h-5 text-primary" />
        </div>
      )}

      <div className={`${baseMessageClasses} ${isUser ? userMessageClasses : aiMessageClasses} liquid-hover`}>
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        ) : (
          <>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.text}
            </ReactMarkdown>
            {message.sources && message.sources.length > 0 && (
              <SourceCitation sources={message.sources} />
            )}
          </>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center glass-dark">  
          <UserIcon className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};

export default Message;
