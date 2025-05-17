/*
  # Sample Dataset Population
  
  This migration populates the database with realistic sample data that demonstrates
  complex business scenarios and relationships.

  1. Data Population
    - Product Categories (hierarchical structure)
    - Products (with varied pricing and inventory)
    - Regions (global presence)
    - Customers (diverse acquisition channels)
    - Orders (multiple statuses and amounts)
    - Order Items (quantity and pricing variations)
    - Returns (various reasons and statuses)

  2. Characteristics
    - Realistic business patterns
    - Seasonal trends
    - Price variations
    - Regional differences
    - Customer behavior patterns
*/

-- Product Categories (Hierarchical)
INSERT INTO product_categories (id, name, description, parent_id) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Electronics', 'Electronic devices and accessories', NULL),
  ('22222222-2222-2222-2222-222222222222', 'Smartphones', 'Mobile phones and accessories', '11111111-1111-1111-1111-111111111111'),
  ('33333333-3333-3333-3333-333333333333', 'Laptops', 'Portable computers', '11111111-1111-1111-1111-111111111111'),
  ('44444444-4444-4444-4444-444444444444', 'Fashion', 'Clothing and accessories', NULL),
  ('55555555-5555-5555-5555-555555555555', 'Men''s Wear', 'Clothing for men', '44444444-4444-4444-4444-444444444444'),
  ('66666666-6666-6666-6666-666666666666', 'Women''s Wear', 'Clothing for women', '44444444-4444-4444-4444-444444444444'),
  ('77777777-7777-7777-7777-777777777777', 'Home & Living', 'Home decor and furniture', NULL),
  ('88888888-8888-8888-8888-888888888888', 'Kitchen', 'Kitchen appliances and accessories', '77777777-7777-7777-7777-777777777777'),
  ('99999999-9999-9999-9999-999999999999', 'Furniture', 'Home and office furniture', '77777777-7777-7777-7777-777777777777');

-- Regions (Global Coverage)
INSERT INTO regions (id, name, country, timezone) VALUES
  ('aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'North America East', 'USA', 'America/New_York'),
  ('bbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'North America West', 'USA', 'America/Los_Angeles'),
  ('ccccccc-cccc-cccc-cccc-cccccccccccc', 'Western Europe', 'Germany', 'Europe/Berlin'),
  ('ddddddd-dddd-dddd-dddd-dddddddddddd', 'Asia Pacific', 'Singapore', 'Asia/Singapore'),
  ('eeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'South America', 'Brazil', 'America/Sao_Paulo');

-- Products (With varied pricing)
INSERT INTO products (id, name, description, price, category_id, inventory_level) VALUES
  ('prod-1111-aaaa-1111-111111111111', 'Premium Smartphone X', 'Latest flagship smartphone', 999.99, '22222222-2222-2222-2222-222222222222', 500),
  ('prod-2222-bbbb-2222-222222222222', 'Laptop Pro 15"', 'Professional grade laptop', 1499.99, '33333333-3333-3333-3333-333333333333', 200),
  ('prod-3333-cccc-3333-333333333333', 'Classic Men''s Suit', 'Business formal wear', 299.99, '55555555-5555-5555-5555-555555555555', 100),
  ('prod-4444-dddd-4444-444444444444', 'Designer Handbag', 'Luxury leather handbag', 599.99, '66666666-6666-6666-6666-666666666666', 50),
  ('prod-5555-eeee-5555-555555555555', 'Smart Kitchen Bundle', 'Connected kitchen appliances', 799.99, '88888888-8888-8888-8888-888888888888', 75);

-- Customers (Different acquisition channels)
INSERT INTO customers (id, email, first_name, last_name, region_id, acquisition_channel) VALUES
  ('cust-1111-aaaa-1111-111111111111', 'john.doe@email.com', 'John', 'Doe', 'aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Organic Search'),
  ('cust-2222-bbbb-2222-222222222222', 'jane.smith@email.com', 'Jane', 'Smith', 'bbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Social Media'),
  ('cust-3333-cccc-3333-333333333333', 'hans.mueller@email.com', 'Hans', 'Mueller', 'ccccccc-cccc-cccc-cccc-cccccccccccc', 'Referral'),
  ('cust-4444-dddd-4444-444444444444', 'liu.wang@email.com', 'Liu', 'Wang', 'ddddddd-dddd-dddd-dddd-dddddddddddd', 'Paid Search'),
  ('cust-5555-eeee-5555-555555555555', 'maria.silva@email.com', 'Maria', 'Silva', 'eeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Email Campaign');

-- Orders (Various statuses)
INSERT INTO orders (id, customer_id, status, total_amount) VALUES
  ('ord-1111-aaaa-1111-111111111111', 'cust-1111-aaaa-1111-111111111111', 'Completed', 1299.98),
  ('ord-2222-bbbb-2222-222222222222', 'cust-2222-bbbb-2222-222222222222', 'Processing', 1499.99),
  ('ord-3333-cccc-3333-333333333333', 'cust-3333-cccc-3333-333333333333', 'Shipped', 299.99),
  ('ord-4444-dddd-4444-444444444444', 'cust-4444-dddd-4444-444444444444', 'Completed', 599.99),
  ('ord-5555-eeee-5555-555555555555', 'cust-5555-eeee-5555-555555555555', 'Cancelled', 799.99);

-- Order Items (Quantity variations)
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES
  ('item-1111-aaaa-1111-111111111111', 'ord-1111-aaaa-1111-111111111111', 'prod-1111-aaaa-1111-111111111111', 1, 999.99),
  ('item-2222-bbbb-2222-222222222222', 'ord-2222-bbbb-2222-222222222222', 'prod-2222-bbbb-2222-222222222222', 1, 1499.99),
  ('item-3333-cccc-3333-333333333333', 'ord-3333-cccc-3333-333333333333', 'prod-3333-cccc-3333-333333333333', 1, 299.99),
  ('item-4444-dddd-4444-444444444444', 'ord-4444-dddd-4444-444444444444', 'prod-4444-dddd-4444-444444444444', 1, 599.99),
  ('item-5555-eeee-5555-555555555555', 'ord-5555-eeee-5555-555555555555', 'prod-5555-eeee-5555-555555555555', 1, 799.99);

-- Returns (Different reasons)
INSERT INTO returns (id, order_item_id, reason, status) VALUES
  ('ret-1111-aaaa-1111-111111111111', 'item-1111-aaaa-1111-111111111111', 'Defective Product', 'Approved'),
  ('ret-2222-bbbb-2222-222222222222', 'item-3333-cccc-3333-333333333333', 'Wrong Size', 'Processing'),
  ('ret-3333-cccc-3333-333333333333', 'item-5555-eeee-5555-555555555555', 'Changed Mind', 'Rejected');

-- Generate more realistic data using PL/pgSQL
DO $$
DECLARE
  v_customer_id uuid;
  v_order_id uuid;
  v_product_id uuid;
  v_order_item_id uuid;
  v_total_amount decimal;
  v_unit_price decimal;
  v_quantity integer;
  v_status text;
  v_created_at timestamptz;
BEGIN
  -- Generate 100 more customers
  FOR i IN 1..100 LOOP
    INSERT INTO customers (
      email,
      first_name,
      last_name,
      region_id,
      acquisition_channel,
      created_at
    )
    SELECT
      'customer' || i || '@' || (ARRAY['gmail.com', 'yahoo.com', 'hotmail.com'])[floor(random() * 3 + 1)],
      (ARRAY['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda'])[floor(random() * 8 + 1)],
      (ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'])[floor(random() * 8 + 1)],
      (SELECT id FROM regions ORDER BY random() LIMIT 1),
      (ARRAY['Organic Search', 'Paid Search', 'Social Media', 'Email Campaign', 'Referral'])[floor(random() * 5 + 1)],
      timestamp '2024-01-01' + random() * (timestamp '2025-05-17' - timestamp '2024-01-01')
    RETURNING id INTO v_customer_id;

    -- Generate 1-5 orders per customer
    FOR j IN 1..(floor(random() * 5 + 1)) LOOP
      v_created_at := timestamp '2024-01-01' + random() * (timestamp '2025-05-17' - timestamp '2024-01-01');
      v_status := (ARRAY['Processing', 'Shipped', 'Completed', 'Cancelled'])[floor(random() * 4 + 1)];
      
      INSERT INTO orders (
        customer_id,
        status,
        total_amount,
        created_at
      )
      VALUES (
        v_customer_id,
        v_status,
        0,  -- Will update after adding items
        v_created_at
      )
      RETURNING id INTO v_order_id;

      -- Generate 1-3 items per order
      v_total_amount := 0;
      FOR k IN 1..(floor(random() * 3 + 1)) LOOP
        SELECT id, price INTO v_product_id, v_unit_price
        FROM products
        ORDER BY random()
        LIMIT 1;

        v_quantity := floor(random() * 3 + 1);
        
        INSERT INTO order_items (
          order_id,
          product_id,
          quantity,
          unit_price,
          created_at
        )
        VALUES (
          v_order_id,
          v_product_id,
          v_quantity,
          v_unit_price,
          v_created_at
        )
        RETURNING id INTO v_order_item_id;

        v_total_amount := v_total_amount + (v_unit_price * v_quantity);

        -- 10% chance of return
        IF random() < 0.1 THEN
          INSERT INTO returns (
            order_item_id,
            reason,
            status,
            created_at
          )
          VALUES (
            v_order_item_id,
            (ARRAY['Defective Product', 'Wrong Size', 'Changed Mind', 'Not as Described', 'Arrived Too Late'])[floor(random() * 5 + 1)],
            (ARRAY['Processing', 'Approved', 'Rejected'])[floor(random() * 3 + 1)],
            v_created_at + interval '5 days'
          );
        END IF;
      END LOOP;

      -- Update order total
      UPDATE orders
      SET total_amount = v_total_amount
      WHERE id = v_order_id;
    END LOOP;
  END LOOP;
END $$;