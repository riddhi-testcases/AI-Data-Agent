// Message types for chat interface
export interface Message {
  sender: 'user' | 'agent';
  content: string;
  timestamp: number;
  sqlQuery?: string;
  data?: DataVisualization;
}

export interface HistoryItem {
  question: string;
  answer: string;
  sqlQuery: string;
  data: DataVisualization;
  timestamp: number;
}

// Database schema types
export interface DatabaseColumn {
  name: string;
  type: string;
  primaryKey?: boolean;
  nullable?: boolean;
  references?: string;
}

export type DatabaseSchema = Record<string, DatabaseColumn[]>;

export interface DatabaseInfo {
  name: string;
  tables: number;
  records: number;
  lastUpdated: string;
}

// Data visualization types
export interface DataVisualization {
  records: Record<string, any>[];
  dimensions: string[];
  measures: string[];
  recommendedChart: 'bar' | 'line' | 'pie';
  insight?: string;
  labels?: Record<string, string>;
}