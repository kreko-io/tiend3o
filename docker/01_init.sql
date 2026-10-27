-- tiend3o Retail Space & Planogram Platform Database Schema
-- Strict adherence to Clean Architecture & Domain Entities

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    sku VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    width_m NUMERIC(6,3) NOT NULL,
    height_m NUMERIC(6,3) NOT NULL,
    depth_m NUMERIC(6,3) NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price > 0),
    margin NUMERIC(5,4) NOT NULL CHECK (margin >= 0 AND margin <= 1),
    historical_sales_velocity NUMERIC(10,2) NOT NULL CHECK (historical_sales_velocity >= 0),
    model_url VARCHAR(255),
    color VARCHAR(32) NOT NULL DEFAULT '#3b82f6',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS store_layouts (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    width NUMERIC(8,2) NOT NULL CHECK (width > 0),
    length NUMERIC(8,2) NOT NULL CHECK (length > 0),
    ceiling_height NUMERIC(8,2) NOT NULL DEFAULT 4.5 CHECK (ceiling_height > 0),
    entrance_x NUMERIC(8,2) NOT NULL DEFAULT 0,
    entrance_y NUMERIC(8,2) NOT NULL DEFAULT 0,
    entrance_z NUMERIC(8,2) NOT NULL DEFAULT 0,
    checkout_x NUMERIC(8,2) NOT NULL DEFAULT 5,
    checkout_y NUMERIC(8,2) NOT NULL DEFAULT 0,
    checkout_z NUMERIC(8,2) NOT NULL DEFAULT 0,
    aisle_width NUMERIC(8,2) NOT NULL DEFAULT 2.2 CHECK (aisle_width > 0),
    gondolas JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_affinities (
    product_a_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_b_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    support NUMERIC(5,4) NOT NULL CHECK (support >= 0 AND support <= 1),
    confidence NUMERIC(5,4) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    lift NUMERIC(6,3) NOT NULL CHECK (lift > 0),
    co_occurrence_count INTEGER NOT NULL CHECK (co_occurrence_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (product_a_id, product_b_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_store_layouts_name ON store_layouts(name);
CREATE INDEX IF NOT EXISTS idx_product_affinities_lift ON product_affinities(lift DESC);
CREATE INDEX IF NOT EXISTS idx_product_affinities_b ON product_affinities(product_b_id);
