import React from 'react';
import { QueryProvider } from './context/QueryContext';
import { DatabaseProvider } from './context/DatabaseContext';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <DatabaseProvider>
      <QueryProvider>
        <Layout />
      </QueryProvider>
    </DatabaseProvider>
  );
}

export default App;