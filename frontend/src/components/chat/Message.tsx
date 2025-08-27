import React from 'react';
import type { Message as MessageType } from '../../types';
import { UserIcon, BrainCircuitIcon } from '../common/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const isUser = message.sender === 'user';

  const baseMessageClasses = "max-w-xl lg:max-w-3xl px-4 py-3 rounded-2xl prose prose-sm prose-invert dark:prose-invert max-w-none";
  const userMessageClasses = "bg-[var(--userMessage)] text-[var(--text)] self-end rounded-br-lg border border-[var(--userMessage-border)]";
  const aiMessageClasses = "bg-[var(--aiMessage)]  text-[var(--text)] self-start rounded-bl-lg  border border-[var(--aiMessage-border)] backdrop-blur-lg";

  return (
    <div className={`flex items-start gap-3 w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary/30">
          <BrainCircuitIcon className="w-5 h-5 text-primary " />
        </div>
      )}

      <div className={`${baseMessageClasses} ${isUser ? userMessageClasses : aiMessageClasses}`}>
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap ">{message.text}</p>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.text}
          </ReactMarkdown>
        )}
      </div>

      {isUser && (
        // bg-gray-600 user Icon
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-600">  
          <UserIcon className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};

export default Message;
