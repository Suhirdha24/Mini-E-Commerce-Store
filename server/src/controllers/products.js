import Product from '../models/Product.js';
import { isSupabaseConfigured, pool, supabase } from '../config/supabase.js';

const slugify = s => (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const list = async (req, res) => {
  const { search = '', category = '', page = 1, limit = 12 } = req.query;

  // Supabase / PostgreSQL Direct
  if (pool) {
    let whereClauses = ['active = true'];
    const values = [];
    
    if (category) {
      values.push(category);
      whereClauses.push(`category = $${values.length}`);
    }
    if (search) {
      values.push(`%${search}%`);
      whereClauses.push(`(name ILIKE $${values.length} OR description ILIKE $${values.length})`);
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const countRes = await pool.query(`SELECT COUNT(*) FROM products ${whereSql}`, values);
    const total = parseInt(countRes.rows[0].count, 10);

    const p = Math.max(1, +page);
    const l = Math.min(50, Math.max(1, +limit));
    const offset = (p - 1) * l;

    const dataRes = await pool.query(
      `SELECT * FROM products ${whereSql} ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      [...values, l, offset]
    );

    const catsRes = await pool.query(`SELECT DISTINCT category FROM products WHERE active = true`);
    const categories = catsRes.rows.map(r => r.category).filter(Boolean);

    return res.json({
      items: dataRes.rows,
      total,
      page: p,
      pages: Math.ceil(total / l),
      categories
    });
  }

  // Supabase SDK
  if (supabase) {
    let query = supabase.from('products').select('*', { count: 'exact' }).eq('active', true);
    if (category) query = query.eq('category', category);
    if (search) query = query.ilike('name', `%${search}%`);

    const p = Math.max(1, +page);
    const l = Math.min(50, Math.max(1, +limit));
    const from = (p - 1) * l;
    const to = from + l - 1;

    const { data, count, error } = await query.range(from, to).order('created_at', { ascending: false });
    if (error) return res.status(500).json({ message: error.message });

    return res.json({
      items: data || [],
      total: count || 0,
      page: p,
      pages: Math.ceil((count || 0) / l)
    });
  }

  // Fallback to Mongoose
  const filter = {};
  if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
  if (category) filter.category = category;
  const p = Math.max(1, +page);
  const l = Math.min(50, Math.max(1, +limit));
  const [items, total, categories] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l),
    Product.countDocuments(filter),
    Product.distinct('category')
  ]);
  res.json({ items, total, page: p, pages: Math.ceil(total / l), categories });
};

export const getOne = async (req, res) => {
  const targetId = req.params.id;

  if (pool) {
    const r = await pool.query(`SELECT * FROM products WHERE id::text = $1 OR sku = $1`, [targetId]);
    if (!r.rows.length) return res.status(404).json({ message: 'Product not found' });
    return res.json(r.rows[0]);
  }

  if (supabase) {
    const { data } = await supabase.from('products').select('*').eq('id', targetId).maybeSingle();
    if (!data) return res.status(404).json({ message: 'Product not found' });
    return res.json(data);
  }

  const p = await Product.findById(targetId);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json(p);
};

export const create = async (req, res) => {
  const { name, category, price, regularPrice, salePrice, costPrice, image, stock, description, sku } = req.body;
  const slug = slugify(name);

  if (pool) {
    const r = await pool.query(
      `INSERT INTO products (sku, name, slug, description, category, price, regular_price, sale_price, cost_price, image, stock, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true) RETURNING *`,
      [sku || 'SKU-' + Date.now(), name, slug, description, category, price, regularPrice || price, salePrice || price, costPrice || 0, image, stock || 10]
    );
    return res.status(201).json(r.rows[0]);
  }

  const data = { ...req.body, slug };
  res.status(201).json(await Product.create(data));
};

export const update = async (req, res) => {
  const targetId = req.params.id;

  if (pool) {
    const { name, price, salePrice, stock, active, category } = req.body;
    const r = await pool.query(
      `UPDATE products SET 
        name = COALESCE($1, name),
        price = COALESCE($2, price),
        sale_price = COALESCE($3, sale_price),
        stock = COALESCE($4, stock),
        active = COALESCE($5, active),
        category = COALESCE($6, category),
        updated_at = NOW()
       WHERE id::text = $7 RETURNING *`,
      [name, price, salePrice, stock, active, category, targetId]
    );
    if (!r.rows.length) return res.status(404).json({ message: 'Product not found' });
    return res.json(r.rows[0]);
  }

  const data = { ...req.body };
  if (data.name) data.slug = slugify(data.name);
  const p = await Product.findByIdAndUpdate(targetId, data, { new: true, runValidators: true });
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json(p);
};

export const remove = async (req, res) => {
  const targetId = req.params.id;

  if (pool) {
    const r = await pool.query(`DELETE FROM products WHERE id::text = $1 RETURNING id`, [targetId]);
    if (!r.rows.length) return res.status(404).json({ message: 'Product not found' });
    return res.json({ message: 'Product deleted' });
  }

  const p = await Product.findByIdAndDelete(targetId);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
};
