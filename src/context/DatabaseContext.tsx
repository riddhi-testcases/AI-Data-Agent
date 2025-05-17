import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { initDb, getDatabaseSchema, getDatabaseInfo } from '../services/databaseService';
import { DatabaseSchema, DatabaseInfo } from '../types';

interface DatabaseState {
  initialized: boolean;
  loading: boolean;
  error: string | null;
  databaseSchema: DatabaseSchema | null;
  databaseInfo: DatabaseInfo | null;
}

type DatabaseAction = 
  | { type: 'INIT_START' }
  | { type: 'INIT_SUCCESS'; payload: { schema: DatabaseSchema; info: DatabaseInfo } }
  | { type: 'INIT_ERROR'; payload: string };

const initialState: DatabaseState = {
  initialized: false,
  loading: false,
  error: null,
  databaseSchema: null,
  databaseInfo: null,
};

const databaseReducer = (state: DatabaseState, action: DatabaseAction): DatabaseState => {
  switch (action.type) {
    case 'INIT_START':
      return { ...state, loading: true, error: null };
    
    case 'INIT_SUCCESS':
      return {
        ...state,
        initialized: true,
        loading: false,
        databaseSchema: action.payload.schema,
        databaseInfo: action.payload.info,
      };
    
    case 'INIT_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    
    default:
      return state;
  }
};

interface DatabaseContextType extends DatabaseState {
  initializeDatabase: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(databaseReducer, initialState);

  const initializeDatabase = useCallback(async () => {
    if (state.initialized) return;
    
    dispatch({ type: 'INIT_START' });
    
    try {
      // Initialize the sample database
      await initDb();
      
      // Get database schema information
      const schema = await getDatabaseSchema();
      
      // Get database metadata
      const info = await getDatabaseInfo();
      
      dispatch({ 
        type: 'INIT_SUCCESS', 
        payload: { schema, info } 
      });
    } catch (error) {
      console.error('Database initialization error:', error);
      dispatch({ 
        type: 'INIT_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to initialize database' 
      });
    }
  }, [state.initialized]);

  return (
    <DatabaseContext.Provider value={{ ...state, initializeDatabase }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};