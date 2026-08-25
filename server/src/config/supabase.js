import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || '';
const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || '';

export const isSupabaseConfigured = Boolean((supabaseUrl && supabaseKey) || databaseUrl);

// 1. Supabase SDK Client
export const supabase = isSupabaseConfigured && supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// 2. PostgreSQL Connection Pool
export const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false
      }
    })
  : null;

// Helper to query PostgreSQL directly or fallback
export const query = async (text, params) => {
  if (!pool) {
    throw new Error("PostgreSQL DATABASE_URL is not configured.");
  }
  return pool.query(text, params);
};

// Initialize PostgreSQL Tables automatically
export const initSupabaseDB = async () => {
  if (pool) {
    try {
      console.log("Connecting to Supabase PostgreSQL via Pool...");
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

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
      `);
      console.log("✓ Supabase PostgreSQL tables verified & ready!");
    } catch (err) {
      console.error("Warning: Supabase PostgreSQL direct init error:", err.message);
    }
  } else if (supabase) {
    console.log("✓ Connected to Supabase via JavaScript Client API");
  } else {
    console.log("ℹ️ Supabase environment variables not yet provided in server/.env. Add SUPABASE_URL & SUPABASE_KEY or DATABASE_URL to connect.");
  }
};
