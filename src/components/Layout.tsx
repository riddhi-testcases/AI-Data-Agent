import React, { useEffect, useRef } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ChatInterface from './ChatInterface';
import { useQuery } from '../context/QueryContext';
import { useDatabase } from '../context/DatabaseContext';

const Layout: React.FC = () => {
  const { initializeDatabase } = useDatabase();
  const { loading } = useQuery();
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeDatabase();
  }, [initializeDatabase]);

  return (
    <div className="flex flex-col h-screen bg-gray-50" ref={appRef}>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden relative">
          <ChatInterface />
          {loading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
              <div className="flex flex-col items-center p-8 rounded-lg">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-medium text-gray-800">Analyzing your question...</p>
                <p className="text-sm text-gray-600 mt-2">Complex queries may take a moment to process</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;