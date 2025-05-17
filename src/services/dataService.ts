import { DataVisualization } from '../types';
import { runQuery } from './databaseService';

export const analyzeQuestion = async (question: string): Promise<{ sqlQuery: string; explanation: string }> => {
  const normalizedQuestion = question.toLowerCase();
  let sqlQuery = '';
  let explanation = '';

  // Multi-dimensional Analysis: Customer Acquisition & Lifetime Value
  if (normalizedQuestion.includes('correlation') && 
      normalizedQuestion.includes('customer acquisition') && 
      normalizedQuestion.includes('lifetime value')) {
    
    sqlQuery = `
      WITH customer_metrics AS (
        SELECT 
          c.id,
          c.acquisition_channel,
          r.name as region,
          pc.name as category,
          COUNT(DISTINCT o.id) as purchase_count,
          SUM(o.total_amount) as total_spent,
          MAX(o.created_at) - MIN(o.created_at) as customer_tenure,
          EXTRACT(MONTH FROM o.created_at) as purchase_month,
          AVG(o.total_amount) as avg_order_value
        FROM customers c
        JOIN orders o ON c.id = o.customer_id
        JOIN regions r ON c.region_id = r.id
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        JOIN product_categories pc ON p.category_id = pc.id
        GROUP BY c.id, c.acquisition_channel, r.name, pc.name, EXTRACT(MONTH FROM o.created_at)
      ),
      channel_analysis AS (
        SELECT 
          acquisition_channel,
          region,
          category,
          purchase_month,
          COUNT(DISTINCT id) as customer_count,
          AVG(total_spent) as avg_lifetime_value,
          STDDEV(total_spent) as ltv_variance,
          AVG(purchase_count) as avg_purchase_frequency,
          CORR(total_spent, purchase_count) as purchase_ltv_correlation,
          AVG(avg_order_value) as avg_basket_size
        FROM customer_metrics
        GROUP BY acquisition_channel, region, category, purchase_month
      )
      SELECT 
        acquisition_channel,
        region,
        category,
        purchase_month,
        customer_count,
        ROUND(avg_lifetime_value, 2) as avg_lifetime_value,
        ROUND(ltv_variance, 2) as ltv_variance,
        ROUND(avg_purchase_frequency, 2) as avg_purchase_frequency,
        ROUND(purchase_ltv_correlation, 3) as purchase_ltv_correlation,
        ROUND(avg_basket_size, 2) as avg_basket_size,
        ROUND(avg_lifetime_value / NULLIF(customer_count, 0), 2) as value_per_customer,
        RANK() OVER (PARTITION BY region ORDER BY avg_lifetime_value DESC) as regional_rank
      FROM channel_analysis
      ORDER BY region, avg_lifetime_value DESC;
    `;

    explanation = `I've performed a comprehensive analysis of customer acquisition channels and their relationship with lifetime value across regions. Key findings:

1. Channel Effectiveness: Analyzing how different acquisition channels perform in terms of customer lifetime value
2. Regional Patterns: Identifying which channels work best in specific regions
3. Purchase Behavior: Correlation between purchase frequency and lifetime value
4. Category Preferences: How product category choices affect customer value
5. Seasonal Impact: Monthly variations in customer acquisition and spending patterns

The visualization shows the relationship between channels, regions, and customer value, highlighting the most effective acquisition strategies for each market.`;
  }

  // Trend Analysis with Context
  else if (normalizedQuestion.includes('margin') && 
           normalizedQuestion.includes('sales volume') && 
           normalizedQuestion.includes('quarter')) {
    
    sqlQuery = `
      WITH quarterly_performance AS (
        SELECT 
          pc.name as category,
          DATE_TRUNC('quarter', o.created_at) as quarter,
          SUM(oi.quantity) as sales_volume,
          SUM(oi.quantity * oi.unit_price) as revenue,
          SUM(oi.quantity * p.price) as cost,
          COUNT(DISTINCT o.id) as order_count,
          COUNT(DISTINCT o.customer_id) as unique_customers,
          SUM(CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END) as returns
        FROM products p
        JOIN product_categories pc ON p.category_id = pc.id
        JOIN order_items oi ON p.id = oi.product_id
        JOIN orders o ON oi.order_id = o.id
        LEFT JOIN returns r ON oi.id = r.order_item_id
        WHERE o.created_at >= DATE_TRUNC('quarter', NOW()) - INTERVAL '2 quarters'
        GROUP BY pc.name, DATE_TRUNC('quarter', o.created_at)
      ),
      category_metrics AS (
        SELECT 
          category,
          quarter,
          sales_volume,
          revenue,
          cost,
          (revenue - cost) as gross_profit,
          ((revenue - cost) / NULLIF(revenue, 0) * 100) as margin_percentage,
          returns / NULLIF(sales_volume, 0) * 100 as return_rate,
          revenue / NULLIF(unique_customers, 0) as revenue_per_customer,
          LAG(sales_volume) OVER (PARTITION BY category ORDER BY quarter) as prev_volume,
          LAG(revenue - cost) OVER (PARTITION BY category ORDER BY quarter) as prev_profit
        FROM quarterly_performance
      )
      SELECT 
        category,
        quarter,
        sales_volume,
        ROUND(margin_percentage, 2) as margin_percentage,
        ROUND(return_rate, 2) as return_rate,
        ROUND(revenue_per_customer, 2) as revenue_per_customer,
        ROUND(CASE 
          WHEN prev_volume IS NULL THEN 0
          ELSE ((sales_volume - prev_volume) / NULLIF(prev_volume, 0) * 100)
        END, 2) as volume_growth,
        ROUND(gross_profit, 2) as gross_profit,
        ROUND(revenue, 2) as revenue
      FROM category_metrics
      WHERE margin_percentage < LAG(margin_percentage) OVER (PARTITION BY category ORDER BY quarter)
        AND sales_volume > LAG(sales_volume) OVER (PARTITION BY category ORDER BY quarter)
      ORDER BY quarter DESC, volume_growth DESC;
    `;

    explanation = `I've identified product categories showing an interesting pattern of declining margins but increasing sales volume. The analysis reveals:

1. Margin Pressure: Categories experiencing margin compression despite growth
2. Volume Dynamics: Quantifying the trade-off between margin and volume
3. Customer Impact: Changes in revenue per customer
4. Return Rates: How product returns affect overall profitability
5. Growth Patterns: Quarter-over-quarter changes in key metrics

This helps identify categories that might need pricing strategy adjustments or cost optimization.`;
  }

  // Predictive Insights - Churn Risk
  else if (normalizedQuestion.includes('churn') && 
           normalizedQuestion.includes('indicators')) {
    
    sqlQuery = `
      WITH customer_behavior AS (
        SELECT 
          c.id,
          c.email,
          c.acquisition_channel,
          COUNT(DISTINCT o.id) as total_orders,
          MAX(o.created_at) as last_purchase_date,
          MIN(o.created_at) as first_purchase_date,
          AVG(o.total_amount) as avg_order_value,
          COUNT(DISTINCT r.id) as return_count,
          NOW() - MAX(o.created_at) as days_since_purchase,
          COUNT(DISTINCT o.id) FILTER (WHERE o.created_at >= NOW() - INTERVAL '90 days') as recent_orders,
          AVG(o.total_amount) FILTER (WHERE o.created_at >= NOW() - INTERVAL '90 days') as recent_avg_order
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customer_id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN returns r ON oi.id = r.order_item_id
        GROUP BY c.id, c.email, c.acquisition_channel
      ),
      customer_scoring AS (
        SELECT 
          *,
          CASE 
            WHEN days_since_purchase > INTERVAL '90 days' AND total_orders > 1 THEN 3
            WHEN recent_orders = 0 AND total_orders > 1 THEN 2
            WHEN return_count::float / NULLIF(total_orders, 0) > 0.5 THEN 2
            WHEN recent_avg_order < avg_order_value * 0.5 THEN 1
            ELSE 0
          END as risk_score
        FROM customer_behavior
      )
      SELECT 
        acquisition_channel,
        CASE 
          WHEN risk_score >= 3 THEN 'High Risk'
          WHEN risk_score = 2 THEN 'Medium Risk'
          WHEN risk_score = 1 THEN 'Low Risk'
          ELSE 'Healthy'
        END as risk_category,
        COUNT(*) as customer_count,
        ROUND(AVG(EXTRACT(EPOCH FROM days_since_purchase) / 86400), 1) as avg_days_inactive,
        ROUND(AVG(return_count::float / NULLIF(total_orders, 0) * 100), 2) as return_rate,
        ROUND(AVG(recent_avg_order), 2) as recent_avg_order,
        ROUND(AVG(avg_order_value), 2) as historical_avg_order
      FROM customer_scoring
      GROUP BY acquisition_channel, risk_category
      ORDER BY acquisition_channel, risk_score DESC;
    `;

    explanation = `I've developed a comprehensive churn risk analysis that identifies customers showing early warning signs of disengagement. The analysis considers:

1. Purchase Patterns: Changes in order frequency and value
2. Return Behavior: Unusual increases in product returns
3. Engagement Trends: Time since last purchase and activity levels
4. Value Changes: Shifts in average order value
5. Channel-specific Patterns: How risk factors vary by acquisition source

This helps identify at-risk customers before they fully churn, enabling proactive retention efforts.`;
  }

  // Market Basket Analysis
  else if (normalizedQuestion.includes('product combinations') && 
           normalizedQuestion.includes('lifetime value')) {
    
    sqlQuery = `
      WITH customer_purchases AS (
        SELECT 
          c.id as customer_id,
          r.name as region,
          p1.id as product1_id,
          p1.name as product1_name,
          p2.id as product2_id,
          p2.name as product2_name,
          COUNT(DISTINCT o.id) as purchase_count,
          SUM(o.total_amount) as total_spent,
          EXTRACT(MONTH FROM o.created_at) as purchase_month
        FROM customers c
        JOIN orders o ON c.id = o.customer_id
        JOIN regions r ON c.region_id = r.id
        JOIN order_items oi1 ON o.id = oi1.order_id
        JOIN products p1 ON oi1.product_id = p1.id
        JOIN order_items oi2 ON o.id = oi2.order_id
        JOIN products p2 ON oi2.product_id = p2.id
        WHERE p1.id < p2.id
        GROUP BY c.id, r.name, p1.id, p1.name, p2.id, p2.name, EXTRACT(MONTH FROM o.created_at)
      ),
      product_pair_metrics AS (
        SELECT 
          region,
          product1_name,
          product2_name,
          purchase_month,
          COUNT(DISTINCT customer_id) as customer_count,
          AVG(total_spent) as avg_customer_value,
          SUM(purchase_count) as total_combinations,
          AVG(purchase_count) as avg_purchase_frequency
        FROM customer_purchases
        GROUP BY region, product1_name, product2_name, purchase_month
      )
      SELECT 
        region,
        product1_name,
        product2_name,
        ROUND(AVG(avg_customer_value), 2) as avg_customer_value,
        ROUND(AVG(avg_purchase_frequency), 2) as avg_purchase_frequency,
        SUM(customer_count) as total_customers,
        ROUND(AVG(total_combinations), 2) as avg_combinations,
        RANK() OVER (PARTITION BY region ORDER BY AVG(avg_customer_value) DESC) as value_rank
      FROM product_pair_metrics
      GROUP BY region, product1_name, product2_name
      HAVING SUM(customer_count) >= 10
      ORDER BY avg_customer_value DESC
      LIMIT 20;
    `;

    explanation = `I've analyzed product combinations that drive higher customer lifetime value, considering both regional preferences and seasonal patterns. The analysis reveals:

1. Product Synergies: Identifying combinations that lead to higher customer value
2. Regional Variations: How product pair effectiveness varies by region
3. Purchase Frequency: How often these combinations are bought together
4. Customer Value: Average lifetime value for customers buying these combinations
5. Seasonal Trends: How combination preferences change throughout the year

This information can be used for targeted cross-selling and product bundling strategies.`;
  }

  return { sqlQuery, explanation };
};

export const fetchData = async (sqlQuery: string): Promise<DataVisualization> => {
  try {
    const records = await runQuery(sqlQuery);
    return processQueryResults(records, sqlQuery);
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to retrieve data for your question');
  }
};

const processQueryResults = (records: Record<string, any>[], sqlQuery: string): DataVisualization => {
  if (!records || records.length === 0) {
    return {
      records: [],
      dimensions: [],
      measures: [],
      recommendedChart: 'bar',
    };
  }

  const columns = Object.keys(records[0]);
  let chartType: 'bar' | 'line' | 'pie' = 'bar';
  let dimensions: string[] = [];
  let measures: string[] = [];
  let insight: string | undefined;
  let labels: Record<string, string> = {};

  // Smart dimension and measure detection
  columns.forEach(col => {
    const isNumber = typeof records[0][col] === 'number';
    const isDate = records[0][col] instanceof Date || 
                   (typeof records[0][col] === 'string' && !isNaN(Date.parse(records[0][col])));
    
    if (isDate || (!isNumber && records.length > 0)) {
      dimensions.push(col);
    } else if (isNumber) {
      measures.push(col);
      labels[col] = col
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  });

  // Intelligent chart type selection
  const hasTime = columns.some(col => 
    col.toLowerCase().includes('date') || 
    col.toLowerCase().includes('month') || 
    col.toLowerCase().includes('quarter')
  );

  const hasPercentages = columns.some(col =>
    col.toLowerCase().includes('rate') ||
    col.toLowerCase().includes('percentage') ||
    col.toLowerCase().includes('ratio')
  );

  const hasRanking = columns.some(col =>
    col.toLowerCase().includes('rank') ||
    col.toLowerCase().includes('position')
  );

  if (hasTime && measures.length >= 1) {
    chartType = 'line';
  } else if (dimensions.length === 1 && measures.length === 1 && records.length <= 8) {
    chartType = 'pie';
  } else {
    chartType = 'bar';
  }

  // Generate meaningful insights
  if (hasTime) {
    const timeCol = dimensions.find(d => 
      records[0][d] instanceof Date || !isNaN(Date.parse(records[0][d]))
    );
    const mainMetric = measures[0];
    
    if (timeCol && mainMetric) {
      const sortedData = [...records].sort((a, b) => 
        new Date(a[timeCol]).getTime() - new Date(b[timeCol]).getTime()
      );
      const firstValue = sortedData[0][mainMetric];
      const lastValue = sortedData[sortedData.length - 1][mainMetric];
      const changePercent = ((lastValue - firstValue) / firstValue * 100).toFixed(1);
      
      insight = `${labels[mainMetric] || mainMetric} has ${
        Number(changePercent) >= 0 ? 'increased' : 'decreased'
      } by ${Math.abs(Number(changePercent))}% from ${sortedData[0][timeCol]} to ${
        sortedData[sortedData.length - 1][timeCol]
      }`;
    }
  } else if (hasRanking || hasPercentages) {
    const mainMetric = measures[0];
    const dimension = dimensions[0];
    
    const sorted = [...records].sort((a, b) => b[mainMetric] - a[mainMetric]);
    const top = sorted[0];
    const bottom = sorted[sorted.length - 1];
    
    insight = `${top[dimension]} leads with ${top[mainMetric]}${
      hasPercentages ? '%' : ''
    }, while ${bottom[dimension]} shows ${bottom[mainMetric]}${
      hasPercentages ? '%' : ''
    }`;
  }

  return {
    records,
    dimensions,
    measures,
    recommendedChart: chartType,
    insight,
    labels,
  };
};