import React, { useEffect, useRef } from 'react';
import { useQuery } from '../context/QueryContext';
import Message from './Message';

const MessageList: React.FC = () => {
  const { messages, loading } = useQuery();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 scrollbar-hide">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-20">
            <div className="gradient-bg w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg mb-6">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="40" 
                height="40" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                <line x1="10" y1="11" x2="14" y2="11"></line>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Welcome to DataAgent!</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              I can answer complex business questions by analyzing your database and generating 
              visualizations to help you understand the insights.
            </p>
            <div className="mt-8 space-y-3 max-w-lg mx-auto">
              <button 
                className="w-full p-3 bg-white rounded-lg shadow-sm border border-gray-200 text-left hover:bg-gray-50 transition-colors"
                onClick={() => {
                  const example = "What's our monthly revenue trend for the last year, broken down by product category?";
                  document.querySelector('textarea')?.focus();
                  const event = new Event('input', { bubbles: true });
                  const textareaElement = document.querySelector('textarea');
                  if (textareaElement) {
                    (textareaElement as HTMLTextAreaElement).value = example;
                    textareaElement.dispatchEvent(event);
                  }
                }}
              >
                <p className="font-medium text-gray-800">Monthly revenue by product category</p>
                <p className="text-sm text-gray-500 mt-1">See how different product categories contribute to revenue over time</p>
              </button>
              <button 
                className="w-full p-3 bg-white rounded-lg shadow-sm border border-gray-200 text-left hover:bg-gray-50 transition-colors"
                onClick={() => {
                  const example = "Which sales regions have the highest average order value and what products do they sell most?";
                  document.querySelector('textarea')?.focus();
                  const event = new Event('input', { bubbles: true });
                  const textareaElement = document.querySelector('textarea');
                  if (textareaElement) {
                    (textareaElement as HTMLTextAreaElement).value = example;
                    textareaElement.dispatchEvent(event);
                  }
                }}
              >
                <p className="font-medium text-gray-800">Region performance analysis</p>
                <p className="text-sm text-gray-500 mt-1">Compare sales regions by order value and top-selling products</p>
              </button>
              <button 
                className="w-full p-3 bg-white rounded-lg shadow-sm border border-gray-200 text-left hover:bg-gray-50 transition-colors"
                onClick={() => {
                  const example = "What is our customer retention rate by acquisition channel?";
                  document.querySelector('textarea')?.focus();
                  const event = new Event('input', { bubbles: true });
                  const textareaElement = document.querySelector('textarea');
                  if (textareaElement) {
                    (textareaElement as HTMLTextAreaElement).value = example;
                    textareaElement.dispatchEvent(event);
                  }
                }}
              >
                <p className="font-medium text-gray-800">Customer retention analysis</p>
                <p className="text-sm text-gray-500 mt-1">Understand which acquisition channels lead to the most loyal customers</p>
              </button>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <Message key={index} message={message} />
          ))
        )}
        
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 max-w-3xl ml-auto">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-blue-800"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <div className="typing-indicator text-gray-500">
                Analyzing<span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;