import React, { useState } from 'react';
import { HelpCircleIcon, XIcon } from './icons';

const HelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const helpSteps = [
    {
      title: "1. Upload Your Document",
      description: "Drag and drop a PDF file into the upload area in the sidebar, or click to browse and select a file."
    },
    {
      title: "2. Select Your Role",
      description: "Choose how you want the AI to help you: Student (study guides), Teacher (lesson plans), Researcher (analysis), or General (balanced help)."
    },
    {
      title: "3. Start Chatting",
      description: "Ask questions about your document and get personalized responses based on your selected role."
    },
    {
      title: "4. Customize Your Experience",
      description: "Change themes using the theme switcher in the sidebar, and switch user types anytime during your chat."
    }
  ];

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center group"
        aria-label="Get help"
      >
        <HelpCircleIcon className="w-6 h-6" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
          ?
        </div>
      </button>

      {/* Help Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto animate-fade-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Welcome to PaperMind AI! 🎉</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <XIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                {helpSteps.map((step, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                      <p className="text-sm text-gray-300 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-white mb-2">💡 Pro Tips:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Try different user types for the same question to see different perspectives</li>
                  <li>• Use specific questions like "Create a study guide" or "Design a lesson plan"</li>
                  <li>• Change themes anytime to match your mood or preference</li>
                </ul>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full mt-6 bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Got it! Let's get started
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpButton; 