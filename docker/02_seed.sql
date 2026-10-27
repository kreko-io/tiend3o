-- Seed Data: Retail Products, Store Layout Distribution, and 10-Year Market Basket Affinities

-- 1. Insert 36 Realistic High-Contrast SKUs
INSERT INTO products (id, sku, name, category, width_m, height_m, depth_m, weight_kg, price, margin, historical_sales_velocity, color, model_url)
VALUES
-- Dairy
('prod-milk-whole', 'DAIRY-001', 'Whole Milk 1L Carton', 'dairy', 0.08, 0.22, 0.08, 1.050, 1.85, 0.3200, 145.00, '#60a5fa', NULL),
('prod-milk-almond', 'DAIRY-002', 'Almond Milk 1L', 'dairy', 0.08, 0.22, 0.08, 1.050, 2.95, 0.4500, 88.00, '#93c5fd', NULL),
('prod-greek-yogurt', 'DAIRY-003', 'Greek Yogurt 500g Tub', 'dairy', 0.11, 0.12, 0.11, 0.520, 3.29, 0.4800, 110.00, '#38bdf8', NULL),
('prod-butter-organic', 'DAIRY-004', 'Organic Grass-Fed Butter 250g', 'dairy', 0.12, 0.06, 0.08, 0.260, 4.49, 0.5200, 95.00, '#fef08a', NULL),
('prod-cheese-parmesan', 'DAIRY-005', 'Aged Parmesan Block 200g', 'dairy', 0.10, 0.08, 0.08, 0.220, 6.89, 0.5500, 75.00, '#fef9c3', NULL),

-- Bakery
('prod-cereal-oats', 'BAKERY-001', 'Toasted Honey Oats Cereal 500g', 'bakery', 0.18, 0.28, 0.06, 0.550, 3.49, 0.4800, 94.00, '#f59e0b', NULL),
('prod-bread-artisan', 'BAKERY-002', 'Artisan Sliced Brioche', 'bakery', 0.12, 0.14, 0.24, 0.450, 2.75, 0.4200, 120.00, '#d97706', NULL),
('prod-cookies-artisan', 'BAKERY-003', 'Choc-Chip Butter Cookies 300g', 'bakery', 0.16, 0.20, 0.08, 0.350, 4.19, 0.5800, 130.00, '#b45309', NULL),
('prod-croissants-box', 'BAKERY-004', 'All-Butter Croissants 4-Pack', 'bakery', 0.20, 0.12, 0.14, 0.320, 3.99, 0.4600, 85.00, '#fde047', NULL),

-- Beverages (includes heavy items: 2L Cola 2.1kg, 6x1.5L Water 9.2kg, 6-Pack Beer 2.4kg)
('prod-soda-cola', 'BEV-001', 'Sparkling Cola 2L Bottle', 'beverages', 0.11, 0.32, 0.11, 2.100, 2.29, 0.3800, 180.00, '#ef4444', NULL),
('prod-water-6pack', 'BEV-002', 'Spring Mineral Water 6x1.5L', 'beverages', 0.28, 0.34, 0.18, 9.200, 4.99, 0.2800, 160.00, '#38bdf8', NULL),
('prod-beer-craft', 'BEV-003', 'Craft IPA 6-Pack Bottles', 'beverages', 0.18, 0.22, 0.12, 2.400, 9.99, 0.4400, 72.00, '#ca8a04', NULL),
('prod-wine-red', 'BEV-004', 'Reserva Cabernet Sauvignon 750ml', 'beverages', 0.08, 0.30, 0.08, 1.250, 14.99, 0.5200, 65.00, '#881337', NULL),
('prod-juice-orange', 'BEV-005', 'Fresh Pressed Orange Juice 1L', 'beverages', 0.09, 0.24, 0.09, 1.080, 3.49, 0.4000, 90.00, '#f97316', NULL),
('prod-energy-drink', 'BEV-006', 'Energy Drink 4-Pack Cans', 'beverages', 0.12, 0.16, 0.12, 1.100, 6.49, 0.5000, 115.00, '#10b981', NULL),

-- Snacks
('prod-chips-salted', 'SNACK-001', 'Crispy Potato Chips 180g', 'snacks', 0.16, 0.26, 0.08, 0.190, 1.99, 0.5200, 165.00, '#eab308', NULL),
('prod-nuts-mixed', 'SNACK-002', 'Roasted Salted Mixed Nuts 250g', 'snacks', 0.12, 0.18, 0.06, 0.280, 5.99, 0.5400, 80.00, '#a16207', NULL),
('prod-chocolate-dark', 'SNACK-003', 'Premium Dark Chocolate 85% 100g', 'snacks', 0.10, 0.19, 0.02, 0.110, 3.79, 0.6200, 140.00, '#451a03', NULL),
('prod-pretzels', 'SNACK-004', 'Oven Baked Pretzels 200g', 'snacks', 0.15, 0.22, 0.06, 0.220, 2.19, 0.4500, 90.00, '#78350f', NULL),

-- Canned Goods & Grains (includes 5kg Rice)
('prod-pasta-spaghetti', 'CANNED-001', 'Italian Spaghetti 500g', 'canned_goods', 0.08, 0.28, 0.04, 0.520, 1.25, 0.3500, 130.00, '#fbbf24', NULL),
('prod-tomato-sauce', 'CANNED-002', 'Organic Basil Tomato Sauce 400g', 'canned_goods', 0.08, 0.14, 0.08, 0.440, 1.65, 0.4000, 115.00, '#dc2626', NULL),
('prod-olive-oil', 'CANNED-003', 'Extra Virgin Olive Oil 1L', 'canned_goods', 0.08, 0.28, 0.08, 1.150, 11.50, 0.4800, 70.00, '#65a30d', NULL),
('prod-tuna-can', 'CANNED-004', 'Yellowfin Tuna in Olive Oil 3-Pack', 'canned_goods', 0.08, 0.12, 0.08, 0.380, 4.29, 0.4200, 105.00, '#0284c7', NULL),
('prod-rice-jasmine', 'CANNED-005', 'Jasmine Fragrant Rice 5kg', 'canned_goods', 0.24, 0.36, 0.12, 5.100, 8.99, 0.3000, 85.00, '#f1f5f9', NULL),

-- Personal Care
('prod-shampoo', 'CARE-001', 'Restorative Argan Shampoo 400ml', 'personal_care', 0.07, 0.21, 0.05, 0.450, 5.49, 0.5500, 85.00, '#06b6d4', NULL),
('prod-conditioner', 'CARE-002', 'Restorative Argan Conditioner 400ml', 'personal_care', 0.07, 0.21, 0.05, 0.450, 5.49, 0.5500, 82.00, '#22d3ee', NULL),
('prod-body-wash', 'CARE-003', 'Citrus Moisturizing Body Wash 500ml', 'personal_care', 0.08, 0.22, 0.06, 0.550, 4.29, 0.4800, 95.00, '#f59e0b', NULL),
('prod-toothpaste', 'CARE-004', 'Whitening Mineral Toothpaste 100ml', 'personal_care', 0.05, 0.18, 0.04, 0.150, 3.29, 0.5800, 140.00, '#14b8a6', NULL),

-- Cleaning & Household (includes 4L Detergent 4.3kg)
('prod-laundry-detergent', 'CLEAN-001', 'Liquid Laundry Detergent 4L', 'cleaning', 0.22, 0.34, 0.14, 4.300, 12.99, 0.3200, 90.00, '#2563eb', NULL),
('prod-dish-soap', 'CLEAN-002', 'Ultra Degreaser Dish Soap 750ml', 'cleaning', 0.09, 0.25, 0.06, 0.800, 2.89, 0.4200, 125.00, '#16a34a', NULL),
('prod-cleaner-spray', 'CLEAN-003', 'All-Surface Antibacterial Spray 750ml', 'cleaning', 0.10, 0.27, 0.06, 0.820, 3.49, 0.4600, 100.00, '#059669', NULL),
('prod-paper-towels', 'CLEAN-004', 'Ultra Absorbent Paper Towels 6-Roll', 'cleaning', 0.28, 0.28, 0.18, 1.200, 6.99, 0.3600, 110.00, '#e2e8f0', NULL),

-- General & Outdoor (includes 4kg Charcoal)
('prod-charcoal-bag', 'GEN-001', 'Natural Hardwood Charcoal 4kg', 'general', 0.26, 0.42, 0.15, 4.100, 7.49, 0.3500, 60.00, '#334155', NULL),
('prod-coffee-ground', 'GEN-002', 'Colombian Roast Ground Coffee 340g', 'general', 0.10, 0.18, 0.07, 0.360, 7.99, 0.5600, 115.00, '#7c2d12', NULL),
('prod-tea-green', 'GEN-003', 'Organic Jasmine Green Tea 50 Bags', 'general', 0.12, 0.14, 0.07, 0.120, 4.49, 0.6000, 85.00, '#4ade80', NULL),
('prod-bbq-sauce', 'GEN-004', 'Smoky Chipotle BBQ Sauce 500ml', 'general', 0.08, 0.22, 0.08, 0.550, 3.89, 0.4800, 95.00, '#991b1b', NULL)
ON CONFLICT (id) DO UPDATE SET
    sku = EXCLUDED.sku,
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    width_m = EXCLUDED.width_m,
    height_m = EXCLUDED.height_m,
    depth_m = EXCLUDED.depth_m,
    weight_kg = EXCLUDED.weight_kg,
    price = EXCLUDED.price,
    margin = EXCLUDED.margin,
    historical_sales_velocity = EXCLUDED.historical_sales_velocity,
    color = EXCLUDED.color,
    model_url = EXCLUDED.model_url,
    updated_at = NOW();

-- 2. Insert 10-Year Historical Affinity Rules (POS Transactions)
INSERT INTO product_affinities (product_a_id, product_b_id, support, confidence, lift, co_occurrence_count)
VALUES
('prod-beer-craft', 'prod-chips-salted', 0.2400, 0.6200, 2.850, 38400),
('prod-milk-whole', 'prod-cereal-oats', 0.2800, 0.6500, 2.750, 44200),
('prod-pasta-spaghetti', 'prod-tomato-sauce', 0.3500, 0.7400, 3.200, 52600),
('prod-soda-cola', 'prod-charcoal-bag', 0.1800, 0.5400, 2.400, 29500),
('prod-wine-red', 'prod-cheese-parmesan', 0.2100, 0.6800, 2.950, 31200),
('prod-coffee-ground', 'prod-cookies-artisan', 0.2300, 0.5900, 2.650, 34100),
('prod-shampoo', 'prod-conditioner', 0.2600, 0.7200, 3.150, 41800),
('prod-bread-artisan', 'prod-butter-organic', 0.2200, 0.5500, 2.350, 35700),
('prod-charcoal-bag', 'prod-bbq-sauce', 0.1600, 0.5100, 2.250, 26800),
('prod-olive-oil', 'prod-pasta-spaghetti', 0.2000, 0.4800, 2.100, 32000)
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
