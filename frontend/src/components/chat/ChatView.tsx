

// import React, { useState, useEffect } from 'react';
// import Message from './Message';
// import type { MessageType } from '../types';

// // Assuming you have a documentId from somewhere
// const ChatView = ({ documentId }: { documentId: string }) => {
//   const [messages, setMessages] = useState<MessageType[]>([]);
//   const [currentInput, setCurrentInput] = useState('');
//   const [isStreaming, setIsStreaming] = useState(false);

//   // This function will be called when a form is submitted
//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!currentInput.trim()) return;

//     const userMessage: MessageType = {
//       messageId: `msg_${Date.now()}`, // Temporary ID for UI
//       role: 'user',
//       text: currentInput,
//       timestamp: new Date().toISOString(),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setCurrentInput('');
//     setIsStreaming(true);

//     // Create a placeholder for the AI response
//     const aiPlaceholder: MessageType = {
//       messageId: `ai_placeholder_${Date.now()}`,
//       role: 'model',
//       text: '...',
//       timestamp: new Date().toISOString(),
//     };
//     setMessages(prev => [...prev, aiPlaceholder]);
    
//     // --- SSE Logic ---
//     const eventSource = new EventSource(`/api/chat?documentId=${documentId}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ message: currentInput })
//     });
    
//     let aiResponseText = '';

//     eventSource.onmessage = (event) => {
//       const parsedData = JSON.parse(event.data);

//       if (parsedData.type === 'token') {
//         aiResponseText += parsedData.payload;
//         // Update the placeholder message with the streaming text
//         setMessages(prev => prev.map(msg => 
//           msg.messageId === aiPlaceholder.messageId ? { ...msg, text: aiResponseText } : msg
//         ));
//       } else if (parsedData.type === 'complete') {
//         // Replace the placeholder with the final, complete message
//         setMessages(prev => prev.map(msg => 
//           msg.messageId === aiPlaceholder.messageId ? parsedData.payload : msg
//         ));
//         setIsStreaming(false);
//         eventSource.close();
//       } else if (parsedData.type === 'error') {
//         console.error('Stream error:', parsedData.payload.message);
//         setIsStreaming(false);
//         eventSource.close();
//       }
//     };
    
//     eventSource.onerror = (err) => {
//       console.error("EventSource failed:", err);
//       setIsStreaming(false);
//       eventSource.close();
//     };
//   };

//   // NEW: Function to handle feedback submissions
//   const handleFeedback = async (messageId: string, feedback: 'like' | 'dislike') => {
//     // Optimistically update the UI
//     setMessages(prevMessages =>
//       prevMessages.map(msg =>
//         msg.messageId === messageId ? { ...msg, feedback: feedback } : msg
//       )
//     );

//     // Call the backend API
//     try {
//       await fetch('/api/feedback', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ documentId, messageId, feedback }),
//       });
//     } catch (error) {
//       console.error('Failed to submit feedback:', error);
//       // Optional: Revert UI change on failure
//       setMessages(prevMessages =>
//         prevMessages.map(msg =>
//           msg.messageId === messageId ? { ...msg, feedback: undefined } : msg
//         )
//       );
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((msg) => (
//           <Message key={msg.messageId} message={msg} onFeedback={handleFeedback} />
//         ))}
//       </div>
//       <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
//         {/* Your input form here */}
//       </form>
//     </div>
//   );
// };