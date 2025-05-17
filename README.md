# DataAgent - AI-Powered Business Analytics

DataAgent is a sophisticated analytics platform that transforms complex business questions into actionable insights through natural language processing and interactive visualizations.

## Features

- 🤖 Natural Language Query Processing
- 📊 Intelligent Data Visualization
- 📈 Real-time Analytics
- 🔄 Complex Query Handling
- 💡 Automated Insights Generation

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: React Context API
- **Styling**: Tailwind CSS with custom animations
- **Charts**: Recharts for data visualization
- **Database**: Supabase with PostgreSQL
- **API**: Edge Functions for complex processing
- **Deployment**: Netlify

## Architecture

### 1. Query Processing Layer
- Natural language processing to convert questions into SQL
- Context-aware query generation
- Query optimization and validation

### 2. Data Layer
- Supabase PostgreSQL database
- Real-time subscriptions
- Row-level security
- Automated data type inference

### 3. Visualization Layer
- Dynamic chart type selection
- Responsive layouts
- Interactive data exploration
- Custom animation system

### 4. Analytics Engine
- Automated insight generation
- Trend detection
- Anomaly identification
- Statistical analysis

## Sample Dataset

Our sample dataset models a complex e-commerce business with:

### Tables
1. **products** (50,000 records)
   - Product details, pricing, categories
   - Historical price changes
   - Inventory levels

2. **customers** (100,000 records)
   - Demographics
   - Acquisition channels
   - Behavioral segments

3. **orders** (500,000 records)
   - Transaction details
   - Payment information
   - Delivery status

4. **order_items** (1,000,000 records)
   - Product quantities
   - Unit prices
   - Discounts

5. **returns** (50,000 records)
   - Return reasons
   - Processing status
   - Resolution times

6. **product_categories** (100 records)
   - Hierarchical categories
   - Category attributes
   - Department mappings

7. **regions** (50 records)
   - Geographical data
   - Market information
   - Local preferences

### Complex Questions Handled

1. **Multi-dimensional Analysis**
   ```
   "What's the correlation between customer acquisition channels and lifetime value across different regions, 
   considering seasonal variations and product category preferences?"
   ```
   - Analyzes multiple dimensions
   - Considers temporal patterns
   - Accounts for geographical variations

2. **Trend Analysis with Context**
   ```
   "Show me product categories with declining margins but increasing sales volume in the last 2 quarters, 
   factoring in promotional impacts and inventory costs"
   ```
   - Multiple metric correlation
   - Time-series analysis
   - Promotional impact assessment

3. **Predictive Insights**
   ```
   "Which customers are showing early churn indicators based on purchase frequency changes, 
   support ticket patterns, and product return history?"
   ```
   - Behavioral pattern analysis
   - Multi-factor risk assessment
   - Historical trend comparison

4. **Cross-functional Analysis**
   ```
   "What's the impact of shipping times on customer retention rates across different product categories, 
   considering regional weather patterns and carrier performance?"
   ```
   - Multi-department data integration
   - External factor correlation
   - Performance impact analysis

5. **Market Basket Analysis**
   ```
   "Identify product combinations that drive higher customer lifetime value, 
   accounting for seasonal trends and regional preferences"
   ```
   - Purchase pattern analysis
   - Customer segmentation
   - Regional preference mapping

## License

MIT License - see [LICENSE](LICENSE) for details.
