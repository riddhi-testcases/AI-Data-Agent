import React, { useState } from 'react';
import { Database, History, Info, Settings, PanelLeft } from 'lucide-react';
import { useQuery } from '../context/QueryContext';
import { useDatabase } from '../context/DatabaseContext';

const Sidebar: React.FC = () => {
  const { queryHistory, selectHistoryItem } = useQuery();
  const { databaseSchema } = useDatabase();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'schema' | 'info'>('history');

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside 
      className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-16' : 'w-72'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && <h2 className="font-semibold text-gray-800">Data Explorer</h2>}
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          <PanelLeft className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          className={`flex items-center justify-center py-3 flex-1 ${
            activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('history')}
        >
          {collapsed ? (
            <History className="h-5 w-5" />
          ) : (
            <>
              <History className="h-5 w-5 mr-2" />
              <span>History</span>
            </>
          )}
        </button>
        <button
          className={`flex items-center justify-center py-3 flex-1 ${
            activeTab === 'schema' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('schema')}
        >
          {collapsed ? (
            <Database className="h-5 w-5" />
          ) : (
            <>
              <Database className="h-5 w-5 mr-2" />
              <span>Schema</span>
            </>
          )}
        </button>
        <button
          className={`flex items-center justify-center py-3 flex-1 ${
            activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('info')}
        >
          {collapsed ? (
            <Info className="h-5 w-5" />
          ) : (
            <>
              <Info className="h-5 w-5 mr-2" />
              <span>Info</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'history' && !collapsed && (
          <div className="p-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Previous Queries
            </h3>
            {queryHistory.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No query history yet</p>
            ) : (
              <ul className="space-y-2">
                {queryHistory.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => selectHistoryItem(item)}
                      className="w-full text-left p-2 rounded-md hover:bg-gray-100 text-sm text-gray-700 transition-colors"
                    >
                      <p className="font-medium truncate">{item.question}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'schema' && !collapsed && (
          <div className="p-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Database Schema
            </h3>
            {databaseSchema ? (
              <div className="space-y-4">
                {Object.entries(databaseSchema).map(([tableName, columns]) => (
                  <div key={tableName} className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                      <h4 className="font-medium text-sm">{tableName}</h4>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {columns.map((column, i) => (
                        <li key={i} className="px-3 py-2 text-sm flex items-center justify-between">
                          <span>{column.name}</span>
                          <span className="text-xs text-gray-500">{column.type}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Loading schema...</p>
            )}
          </div>
        )}

        {activeTab === 'info' && !collapsed && (
          <div className="p-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              About DataAgent
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              DataAgent is an AI-powered SQL query assistant that helps you analyze complex 
              databases using natural language questions.
            </p>
            <h4 className="font-medium text-sm mb-2">Example Questions:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              <li>What's the revenue trend over the last 6 months?</li>
              <li>Which products have the highest return rate?</li>
              <li>Compare sales performance across regions</li>
              <li>What's our customer retention by acquisition channel?</li>
            </ul>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center text-gray-700 hover:text-gray-900">
            <Settings className="h-5 w-5 mr-2" />
            <span>Settings</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;