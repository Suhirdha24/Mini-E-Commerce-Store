import { isSupabaseConfigured, pool, supabase } from '../config/supabase.js';
import { initialAdminProducts } from '../../../client/src/data/initialProducts.js';
import dotenv from 'dotenv';
dotenv.config();

const seedSupabase = async () => {
  console.log("Seeding products to Supabase PostgreSQL...");

  if (pool) {
    for (const p of initialAdminProducts) {
      await pool.query(`
        INSERT INTO products (sku, name, description, category, price, regular_price, sale_price, cost_price, image, stock, active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (sku) DO UPDATE SET
          name = EXCLUDED.name,
          price = EXCLUDED.price,
          sale_price = EXCLUDED.sale_price,
          regular_price = EXCLUDED.regular_price,
          image = EXCLUDED.image,
          stock = EXCLUDED.stock;
      `, [
        p.sku,
        p.name,
        p.description || '',
        p.category,
        Number(p.salePrice || p.price || 0),
        Number(p.regularPrice || p.price || 0),
        Number(p.salePrice || p.price || 0),
        Number(p.costPrice || 0),
        p.image,
        Number(p.stock || 10),
        true
      ]);
    }
    console.log(`✓ Successfully seeded ${initialAdminProducts.length} products to Supabase PostgreSQL database!`);
  } else if (supabase) {
    const records = initialAdminProducts.map(p => ({
      sku: p.sku,
      name: p.name,
      description: p.description || '',
      category: p.category,
      price: Number(p.salePrice || p.price || 0),
      regular_price: Number(p.regularPrice || p.price || 0),
      sale_price: Number(p.salePrice || p.price || 0),
      cost_price: Number(p.costPrice || 0),
      image: p.image,
      stock: Number(p.stock || 10),
      active: true
    }));

    const { error } = await supabase.from('products').upsert(records, { onConflict: 'sku' });
    if (error) {
      console.error("Supabase seed error:", error.message);
    } else {
      console.log(`✓ Successfully seeded ${records.length} products to Supabase!`);
    }
  } else {
    console.log("⚠️ Please add your Supabase DATABASE_URL or SUPABASE_URL & SUPABASE_KEY to server/.env first.");
  }
};

seedSupabase().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
