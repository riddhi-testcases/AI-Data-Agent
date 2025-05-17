import { DatabaseSchema, DatabaseInfo } from '../types';

// This is a mock implementation for the prototype
// In a real implementation, this would connect to an actual database
// and handle SQL queries properly

// Sample database data
let database = {
  // Sample data would be initialized here
};

export const initDb = async (): Promise<void> => {
  // In a real implementation, this would initialize an actual database connection
  // and potentially seed it with initial data if needed
  
  // For our prototype, we'll simulate by creating a mock in-memory database
  console.log('Initializing sample database...');
  
  // Create sample data
  // This simulates tables and data that would be in a real SQL database
  database = createSampleDatabase();
  
  console.log('Database initialized with sample data');
  
  return Promise.resolve();
};

export const getDatabaseSchema = async (): Promise<DatabaseSchema> => {
  // In a real implementation, this would query the database for its schema
  // For our prototype, we'll return a simulated schema
  
  return {
    'products': [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'name', type: 'TEXT' },
      { name: 'description', type: 'TEXT' },
      { name: 'price', type: 'REAL' },
      { name: 'category_id', type: 'INTEGER', references: 'product_categories.id' },
      { name: 'created_at', type: 'DATETIME' },
    ],
    'product_categories': [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'name', type: 'TEXT' },
      { name: 'parent_category_id', type: 'INTEGER', nullable: true },
    ],
    'customers': [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'first_name', type: 'TEXT' },
      { name: 'last_name', type: 'TEXT' },
      { name: 'email', type: 'TEXT' },
      { name: 'acquisition_channel', type: 'TEXT' },
      { name: 'created_at', type: 'DATETIME' },
      { name: 'region_id', type: 'INTEGER', references: 'regions.id' },
    ],
    'regions': [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'name', type: 'TEXT' },
      { name: 'country', type: 'TEXT' },
    ],
    'orders': [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'customer_id', type: 'INTEGER', references: 'customers.id' },
      { name: 'order_date', type: 'DATETIME' },
      { name: 'status', type: 'TEXT' },
      { name: 'total_amount', type: 'REAL' },
    ],
    'order_items': [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'order_id', type: 'INTEGER', references: 'orders.id' },
      { name: 'product_id', type: 'INTEGER', references: 'products.id' },
      { name: 'quantity', type: 'INTEGER' },
      { name: 'price', type: 'REAL' },
    ],
    'returns': [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'order_item_id', type: 'INTEGER', references: 'order_items.id' },
      { name: 'return_date', type: 'DATETIME' },
      { name: 'reason', type: 'TEXT' },
    ],
  };
};

export const getDatabaseInfo = async (): Promise<DatabaseInfo> => {
  // In a real implementation, this would query the database for metadata
  // For our prototype, we'll simulate this information
  
  return {
    name: 'Sample Retail Database',
    tables: 8,
    records: 1250,
    lastUpdated: '2025-05-01T12:00:00Z',
  };
};

export const runQuery = async (sqlQuery: string): Promise<Record<string, any>[]> => {
  // In a real implementation, this would execute the SQL query against the database
  // For our prototype, we'll simulate results based on the query
  
  console.log('Running query:', sqlQuery);
  
  // Extract key parts from the SQL query for our simple pattern matching
  const lowerQuery = sqlQuery.toLowerCase();
  
  // Simulate query results based on patterns in the query
  // In a real implementation, this would actually execute SQL
  
  if (lowerQuery.includes('product_categories pc') && lowerQuery.includes('group by month, pc.name')) {
    // Revenue by product category and month
    return generateRevenueByProductCategoryData();
  } 
  else if (lowerQuery.includes('regions r') && lowerQuery.includes('avg_order_value')) {
    // Region performance data
    return generateRegionPerformanceData();
  }
  else if (lowerQuery.includes('acquisition_channel') && lowerQuery.includes('retention_rate')) {
    // Retention rate by acquisition channel
    return generateRetentionRateData();
  }
  else if (lowerQuery.includes('return_rate')) {
    // Product return rates
    return generateProductReturnRateData();
  }
  else {
    // Default to overall revenue if no specific pattern is matched
    return generateOverallRevenueData();
  }
};

// Helper functions to generate mock data for different query patterns

function generateRevenueByProductCategoryData(): Record<string, any>[] {
  const months = ['2024-12', '2025-01', '2025-02', '2025-03', '2025-04', '2025-05'];
  const categories = ['Electronics', 'Clothing', 'Home Goods', 'Sporting Goods', 'Beauty'];
  
  const result: Record<string, any>[] = [];
  
  months.forEach(month => {
    categories.forEach(category => {
      // Base value that increases over time
      const baseValue = 20000 + (months.indexOf(month) * 2000);
      
      // Different multipliers for different categories
      let multiplier = 1;
      switch (category) {
        case 'Electronics': multiplier = 1.5; break;
        case 'Clothing': multiplier = 1.2; break;
        case 'Home Goods': multiplier = 0.9; break;
        case 'Sporting Goods': multiplier = 0.7; break;
        case 'Beauty': multiplier = 0.5; break;
      }
      
      // Add some randomness
      const randomFactor = 0.8 + (Math.random() * 0.4); // Between 0.8 and 1.2
      
      const revenue = Math.round(baseValue * multiplier * randomFactor);
      
      result.push({
        month,
        category,
        revenue
      });
    });
  });
  
  return result;
}

function generateRegionPerformanceData(): Record<string, any>[] {
  return [
    { region: 'Northeast', avg_order_value: 128.42, top_product: 'Premium Headphones', num_orders: 1425 },
    { region: 'West', avg_order_value: 115.87, top_product: 'Wireless Earbuds', num_orders: 1876 },
    { region: 'Southeast', avg_order_value: 102.34, top_product: 'Smart Watch', num_orders: 1532 },
    { region: 'Midwest', avg_order_value: 98.56, top_product: 'Fitness Tracker', num_orders: 1245 },
    { region: 'Southwest', avg_order_value: 89.21, top_product: 'Phone Case', num_orders: 987 },
  ];
}

function generateRetentionRateData(): Record<string, any>[] {
  return [
    { acquisition_channel: 'Email Marketing', total_customers: 2547, retained_customers: 1452, retention_rate: 57.0 },
    { acquisition_channel: 'Referral', total_customers: 1853, retained_customers: 985, retention_rate: 53.2 },
    { acquisition_channel: 'Organic Search', total_customers: 3254, retained_customers: 1524, retention_rate: 46.8 },
    { acquisition_channel: 'Social Media', total_customers: 4125, retained_customers: 1850, retention_rate: 44.8 },
    { acquisition_channel: 'Paid Search', total_customers: 2875, retained_customers: 978, retention_rate: 34.0 },
    { acquisition_channel: 'Display Ads', total_customers: 1542, retained_customers: 412, retention_rate: 26.7 },
  ];
}

function generateProductReturnRateData(): Record<string, any>[] {
  return [
    { product: 'Economy Bluetooth Speaker', returns: 68, total_sold: 245, return_rate: 27.8 },
    { product: 'Basic Desk Lamp', returns: 42, total_sold: 187, return_rate: 22.5 },
    { product: 'Entry-level Fitness Tracker', returns: 57, total_sold: 312, return_rate: 18.3 },
    { product: 'Generic Phone Case', returns: 83, total_sold: 523, return_rate: 15.9 },
    { product: 'Standard T-Shirt', returns: 112, total_sold: 876, return_rate: 12.8 },
    { product: 'Wireless Mouse', returns: 47, total_sold: 421, return_rate: 11.2 },
    { product: 'USB-C Cable 3-Pack', returns: 31, total_sold: 348, return_rate: 8.9 },
    { product: 'Premium Headphones', returns: 23, total_sold: 276, return_rate: 8.3 },
    { product: 'Smartphone Charger', returns: 34, total_sold: 512, return_rate: 6.6 },
    { product: 'Laptop Sleeve', returns: 19, total_sold: 394, return_rate: 4.8 },
  ];
}

function generateOverallRevenueData(): Record<string, any>[] {
  return [
    { month: '2024-12', revenue: 125000 },
    { month: '2025-01', revenue: 132000 },
    { month: '2025-02', revenue: 141000 },
    { month: '2025-03', revenue: 138000 },
    { month: '2025-04', revenue: 156000 },
    { month: '2025-05', revenue: 172000 },
  ];
}

function createSampleDatabase() {
  // In a real implementation, this would create and populate a database
  // For our prototype, we'll just create a skeleton structure
  return {
    tables: {
      products: [],
      product_categories: [],
      customers: [],
      regions: [],
      orders: [],
      order_items: [],
      returns: [],
    }
  };
}