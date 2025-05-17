import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from 'recharts';
import { ChevronRight, ChevronDown, Table as TableIcon, BarChart as BarChartIcon, PieChart as PieChartIcon } from 'lucide-react';
import { DataVisualization } from '../types';

interface DataVisualizerProps {
  data: DataVisualization;
}

const DataVisualizer: React.FC<DataVisualizerProps> = ({ data }) => {
  const [activeView, setActiveView] = useState<'chart' | 'table'>('chart');
  const [expandTable, setExpandTable] = useState(false);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#8dd1e1'];

  const renderChart = () => {
    switch (data.recommendedChart) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.records}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={data.dimensions[0]} />
              <YAxis />
              <Tooltip />
              <Legend />
              {data.measures.map((measure, index) => (
                <Bar 
                  key={measure} 
                  dataKey={measure} 
                  fill={COLORS[index % COLORS.length]} 
                  name={data.labels?.[measure] || measure}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.records}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={data.dimensions[0]} />
              <YAxis />
              <Tooltip />
              <Legend />
              {data.measures.map((measure, index) => (
                <Line 
                  key={measure} 
                  type="monotone" 
                  dataKey={measure} 
                  stroke={COLORS[index % COLORS.length]} 
                  name={data.labels?.[measure] || measure}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={data.records}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey={data.measures[0]}
                nameKey={data.dimensions[0]}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.records.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.records}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={data.dimensions[0]} />
              <YAxis />
              <Tooltip />
              <Legend />
              {data.measures.map((measure, index) => (
                <Bar 
                  key={measure} 
                  dataKey={measure} 
                  fill={COLORS[index % COLORS.length]} 
                  name={data.labels?.[measure] || measure}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  const renderTable = () => {
    if (!data.records.length) return <p>No data available</p>;
    
    // Get all keys from first record
    const columns = Object.keys(data.records[0]);
    const displayRows = expandTable ? data.records : data.records.slice(0, 5);
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {data.labels?.[column] || column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {data.records.length > 5 && (
          <button
            onClick={() => setExpandTable(!expandTable)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            {expandTable ? (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show less
              </>
            ) : (
              <>
                <ChevronRight className="h-4 w-4 mr-1" />
                Show all {data.records.length} rows
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  const ChartIcon = () => {
    switch (data.recommendedChart) {
      case 'bar':
        return <BarChartIcon className="h-4 w-4" />;
      case 'pie':
        return <PieChartIcon className="h-4 w-4" />;
      default:
        return <BarChartIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex border-b">
        <button
          onClick={() => setActiveView('chart')}
          className={`flex items-center px-4 py-2 text-sm font-medium ${
            activeView === 'chart'
              ? 'bg-white text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 bg-gray-50'
          }`}
        >
          <ChartIcon />
          <span className="ml-2">Chart</span>
        </button>
        <button
          onClick={() => setActiveView('table')}
          className={`flex items-center px-4 py-2 text-sm font-medium ${
            activeView === 'table'
              ? 'bg-white text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 bg-gray-50'
          }`}
        >
          <TableIcon className="h-4 w-4" />
          <span className="ml-2">Table</span>
        </button>
      </div>
      
      <div className="p-4">
        {activeView === 'chart' ? renderChart() : renderTable()}
      </div>
      
      {data.insight && (
        <div className="bg-blue-50 p-4 border-t border-blue-100 text-sm text-gray-700">
          <strong className="text-blue-800">Key Insight:</strong> {data.insight}
        </div>
      )}
    </div>
  );
};

export default DataVisualizer;