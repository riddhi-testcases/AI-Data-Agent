import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Code, Copy, Check } from 'lucide-react';
import { Message as MessageType } from '../types';
import DataVisualizer from './DataVisualizer';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const [showSQL, setShowSQL] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 max-w-3xl mr-auto">
        <p className="text-gray-900">{message.content}</p>
      </div>
    );
  }

  const formatSQLQuery = (sql: string) => {
    // A simple formatting function - in a real app, you might use a SQL formatter
    return sql.replace(/FROM/g, '\nFROM')
      .replace(/WHERE/g, '\nWHERE')
      .replace(/GROUP BY/g, '\nGROUP BY')
      .replace(/ORDER BY/g, '\nORDER BY')
      .replace(/HAVING/g, '\nHAVING')
      .replace(/INNER JOIN|LEFT JOIN|RIGHT JOIN|JOIN/g, '\n$&')
      .replace(/LIMIT/g, '\nLIMIT');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 max-w-3xl ml-auto space-y-4">
      <div className="flex items-start">
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
        <div className="text-gray-800">{message.content}</div>
      </div>

      {message.data && (
        <div className="mt-4 chart-appear">
          <DataVisualizer data={message.data} />
        </div>
      )}

      {message.sqlQuery && (
        <div className="mt-2">
          <button
            onClick={() => setShowSQL(!showSQL)}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <Code className="h-4 w-4 mr-1" />
            <span>
              {showSQL ? 'Hide SQL Query' : 'Show SQL Query'}
            </span>
            {showSQL ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </button>

          {showSQL && (
            <div className="mt-2 relative">
              <pre className="bg-gray-50 p-3 rounded-md text-sm text-gray-800 overflow-x-auto">
                {formatSQLQuery(message.sqlQuery)}
              </pre>
              <button
                onClick={() => copyToClipboard(message.sqlQuery)}
                className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-200 transition-colors"
                title="Copy SQL"
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-500" />}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-2">
        {new Date(message.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default Message;