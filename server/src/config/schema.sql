-- SUPABASE POSTGRESQL SCHEMA FOR NOVA MINI E-COMMERCE

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE,
  name TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  regular_price NUMERIC(10, 2) DEFAULT 0,
  sale_price NUMERIC(10, 2) DEFAULT 0,
  cost_price NUMERIC(10, 2) DEFAULT 0,
  image TEXT NOT NULL,
  stock INT NOT NULL DEFAULT 10,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  shipping JSONB NOT NULL DEFAULT '{}'::jsonb,
  payment_method TEXT DEFAULT 'Cash on Delivery (COD)',
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'Processing',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
