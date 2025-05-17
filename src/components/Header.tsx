import React from 'react';
import { BarChart3, Database, Github } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';

const Header: React.FC = () => {
  const { databaseInfo } = useDatabase();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-800" />
            <span className="ml-2 text-xl font-bold text-gray-900">DataAgent</span>
            {databaseInfo && (
              <div className="ml-4 flex items-center text-sm text-gray-600">
                <Database className="h-4 w-4 mr-1" />
                <span>Connected to: {databaseInfo.name}</span>
                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                  {databaseInfo.tables} tables
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 transition-colors duration-200"
            >
              Documentation
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;