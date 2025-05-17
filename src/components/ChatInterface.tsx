import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useQuery } from '../context/QueryContext';
import MessageList from './MessageList';

const ChatInterface: React.FC = () => {
  const [question, setQuestion] = useState('');
  const { submitQuestion, loading } = useQuery();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [question]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !loading) {
      submitQuestion(question);
      setQuestion('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full overflow-hidden bg-gray-50 pb-4"
    >
      <MessageList />
      
      <div className="px-4 sm:px-6 lg:px-8 mt-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <div className="relative shadow-sm rounded-lg border border-gray-300 bg-white overflow-hidden">
            <textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a complex business question..."
              className="w-full px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-0 focus:border-transparent"
              rows={1}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className={`absolute right-2 bottom-3 rounded-full p-1 ${
                loading || !question.trim()
                  ? 'text-gray-400 bg-gray-100'
                  : 'text-white bg-blue-800 hover:bg-blue-700'
              } transition-colors`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            Try "What's the revenue trend by product category over the last year?"
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;