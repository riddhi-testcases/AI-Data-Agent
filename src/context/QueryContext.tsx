import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { analyzeQuestion, fetchData } from '../services/dataService';
import { Message, HistoryItem } from '../types';

interface QueryState {
  messages: Message[];
  queryHistory: HistoryItem[];
  loading: boolean;
  error: string | null;
}

type QueryAction =
  | { type: 'SUBMIT_QUESTION' }
  | { type: 'RECEIVE_ANSWER'; payload: { message: Message, historyItem: HistoryItem } }
  | { type: 'SELECT_HISTORY_ITEM'; payload: HistoryItem }
  | { type: 'SET_ERROR'; payload: string };

const initialState: QueryState = {
  messages: [],
  queryHistory: [],
  loading: false,
  error: null,
};

const queryReducer = (state: QueryState, action: QueryAction): QueryState => {
  switch (action.type) {
    case 'SUBMIT_QUESTION':
      return {
        ...state,
        loading: true,
        error: null,
      };
    
    case 'RECEIVE_ANSWER':
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
        queryHistory: [action.payload.historyItem, ...state.queryHistory],
        loading: false,
      };
    
    case 'SELECT_HISTORY_ITEM':
      // Find if we already have this question in our messages
      const questionIndex = state.messages.findIndex(
        msg => msg.content === action.payload.question && msg.sender === 'user'
      );
      
      if (questionIndex >= 0) {
        // We already have this question, just show from that point on
        const relevantMessages = state.messages.slice(questionIndex);
        return { ...state, messages: relevantMessages };
      } else {
        // We need to re-process this question
        const userMessage: Message = {
          sender: 'user',
          content: action.payload.question,
          timestamp: Date.now(),
        };
        
        const agentMessage: Message = {
          sender: 'agent',
          content: action.payload.answer,
          timestamp: action.payload.timestamp,
          sqlQuery: action.payload.sqlQuery,
          data: action.payload.data,
        };
        
        return {
          ...state,
          messages: [userMessage, agentMessage],
        };
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    
    default:
      return state;
  }
};

interface QueryContextType extends QueryState {
  submitQuestion: (question: string) => void;
  selectHistoryItem: (historyItem: HistoryItem) => void;
}

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(queryReducer, initialState);

  const submitQuestion = useCallback(async (question: string) => {
    // Add user message to the chat
    const userMessage: Message = {
      sender: 'user',
      content: question,
      timestamp: Date.now(),
    };
    
    dispatch({ type: 'SUBMIT_QUESTION' });
    
    try {
      // Process question and generate SQL
      const { sqlQuery, explanation } = await analyzeQuestion(question);
      
      // Fetch data based on the SQL query
      const data = await fetchData(sqlQuery);
      
      // Create the agent's response message
      const agentMessage: Message = {
        sender: 'agent',
        content: explanation,
        timestamp: Date.now(),
        sqlQuery,
        data,
      };
      
      // Add to history
      const historyItem: HistoryItem = {
        question,
        answer: explanation,
        sqlQuery,
        data,
        timestamp: Date.now(),
      };
      
      // Update messages with both user question and agent response
      dispatch({ 
        type: 'RECEIVE_ANSWER', 
        payload: { 
          message: agentMessage, 
          historyItem 
        } 
      });
    } catch (error) {
      console.error('Error processing question:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    }
  }, []);

  const selectHistoryItem = useCallback((historyItem: HistoryItem) => {
    dispatch({ type: 'SELECT_HISTORY_ITEM', payload: historyItem });
  }, []);

  return (
    <QueryContext.Provider value={{ ...state, submitQuestion, selectHistoryItem }}>
      {children}
    </QueryContext.Provider>
  );
};

export const useQuery = (): QueryContextType => {
  const context = useContext(QueryContext);
  if (context === undefined) {
    throw new Error('useQuery must be used within a QueryProvider');
  }
  return context;
};