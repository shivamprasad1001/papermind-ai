
import React from 'react';
import { BrainCircuitIcon } from '../common/icons';

const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary/30">
        <BrainCircuitIcon className="w-5 h-5 text-primary" />
      </div>
      <div className="bg-gray-700 text-gray-200 rounded-2xl rounded-bl-lg px-4 py-3 flex items-center space-x-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-0"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
