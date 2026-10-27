-- Seed Data: Retail Products, Store Layout Distribution, and 10-Year Market Basket Affinities

-- 1. Insert Initial Sample Products
INSERT INTO products (id, sku, name, category, width_m, height_m, depth_m, price, margin, historical_sales_velocity, color, model_url)
VALUES
('prod-milk-whole', 'DAIRY-001', 'Whole Milk 1L Carton', 'dairy', 0.08, 0.22, 0.08, 1.85, 0.3200, 145.00, '#60a5fa', NULL),
('prod-milk-almond', 'DAIRY-002', 'Almond Milk 1L', 'dairy', 0.08, 0.22, 0.08, 2.95, 0.4500, 88.00, '#93c5fd', NULL),
('prod-cereal-oats', 'BAKERY-001', 'Toasted Honey Oats Cereal 500g', 'bakery', 0.18, 0.28, 0.06, 3.49, 0.4800, 94.00, '#f59e0b', NULL),
('prod-bread-artisan', 'BAKERY-002', 'Artisan Sliced Brioche', 'bakery', 0.12, 0.14, 0.24, 2.75, 0.4200, 120.00, '#d97706', NULL),
('prod-soda-cola', 'BEV-001', 'Sparkling Cola 2L Bottle', 'beverages', 0.11, 0.32, 0.11, 2.29, 0.3800, 180.00, '#ef4444', NULL),
('prod-chips-salted', 'SNACK-001', 'Crispy Potato Chips 180g', 'snacks', 0.16, 0.26, 0.08, 1.99, 0.5200, 165.00, '#eab308', NULL),
('prod-beer-craft', 'BEV-002', 'Craft IPA 6-Pack', 'beverages', 0.18, 0.22, 0.12, 9.99, 0.4400, 72.00, '#ca8a04', NULL),
('prod-pasta-spaghetti', 'CANNED-001', 'Italian Spaghetti 500g', 'canned_goods', 0.08, 0.28, 0.04, 1.25, 0.3500, 130.00, '#fbbf24', NULL),
('prod-tomato-sauce', 'CANNED-002', 'Organic Basil Tomato Sauce 400g', 'canned_goods', 0.08, 0.14, 0.08, 1.65, 0.4000, 115.00, '#dc2626', NULL)
ON CONFLICT (id) DO UPDATE SET
    sku = EXCLUDED.sku,
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    width_m = EXCLUDED.width_m,
    height_m = EXCLUDED.height_m,
    depth_m = EXCLUDED.depth_m,
    price = EXCLUDED.price,
    margin = EXCLUDED.margin,
    historical_sales_velocity = EXCLUDED.historical_sales_velocity,
    color = EXCLUDED.color,
    model_url = EXCLUDED.model_url,
    updated_at = NOW();

-- 2. Insert 10-Year Historical Affinity Rules (POS Transactions)
INSERT INTO product_affinities (product_a_id, product_b_id, support, confidence, lift, co_occurrence_count)
VALUES
('prod-milk-whole', 'prod-cereal-oats', 0.2800, 0.6500, 2.320, 42100),
('prod-beer-craft', 'prod-chips-salted', 0.2200, 0.5800, 2.640, 33400),
('prod-pasta-spaghetti', 'prod-tomato-sauce', 0.3500, 0.7400, 3.120, 51200),
('prod-milk-whole', 'prod-bread-artisan', 0.3100, 0.5200, 1.680, 46800),
('prod-soda-cola', 'prod-chips-salted', 0.2500, 0.4900, 1.850, 37900)
ON CONFLICT (product_a_id, product_b_id) DO UPDATE SET
    support = EXCLUDED.support,
    confidence = EXCLUDED.confidence,
    lift = EXCLUDED.lift,
    co_occurrence_count = EXCLUDED.co_occurrence_count;

-- 3. Insert Base Store Layout according to physical store distribution
INSERT INTO store_layouts (id, name, width, length, ceiling_height, entrance_x, entrance_y, entrance_z, checkout_x, checkout_y, checkout_z, aisle_width, gondolas)
VALUES (
    'store-main-layout',
    'Main Retail Floor (Standard Distribution)',
    24.0,
    36.0,
    4.5,
    0.0,
    0.0,
    16.5,
    6.0,
    0.0,
    16.0,
    2.4,
    '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    width = EXCLUDED.width,
    length = EXCLUDED.length,
    ceiling_height = EXCLUDED.ceiling_height,
    entrance_x = EXCLUDED.entrance_x,
    entrance_y = EXCLUDED.entrance_y,
    entrance_z = EXCLUDED.entrance_z,
    checkout_x = EXCLUDED.checkout_x,
    checkout_y = EXCLUDED.checkout_y,
    checkout_z = EXCLUDED.checkout_z,
    aisle_width = EXCLUDED.aisle_width,
    updated_at = NOW();
