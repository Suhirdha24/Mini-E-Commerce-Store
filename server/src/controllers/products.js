import Product from '../models/Product.js';
import { pool, supabase } from '../config/supabase.js';

const slugify = s => (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const list = async (req, res) => {
  const { search = '', category = '', page = 1, limit = 50 } = req.query;

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
    const l = Math.min(100, Math.max(1, +limit));
    const offset = (p - 1) * l;

    const dataRes = await pool.query(
      `SELECT id as _id, id, sku, name, slug, description, category,
              price, regular_price as "regularPrice", sale_price as "salePrice", cost_price as "costPrice",
              image, stock, active, created_at as "createdAt"
       FROM products 
       ${whereSql} 
       ORDER BY created_at DESC 
       LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
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
    const l = Math.min(100, Math.max(1, +limit));
    const from = (p - 1) * l;
    const to = from + l - 1;

    const { data, count, error } = await query.range(from, to).order('created_at', { ascending: false });
    if (error) return res.status(500).json({ message: error.message });

    const formatted = (data || []).map(item => ({
      ...item,
      _id: item.id,
      regularPrice: item.regular_price,
      salePrice: item.sale_price,
      costPrice: item.cost_price
    }));

    return res.json({
      items: formatted,
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
  const l = Math.min(100, Math.max(1, +limit));
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
    const r = await pool.query(
      `SELECT id as _id, id, sku, name, slug, description, category,
              price, regular_price as "regularPrice", sale_price as "salePrice", cost_price as "costPrice",
              image, stock, active, created_at as "createdAt"
       FROM products 
       WHERE id::text = $1 OR sku = $1`,
      [targetId]
    );
    if (!r.rows.length) return res.status(404).json({ message: 'Product not found' });
    return res.json(r.rows[0]);
  }

  const p = await Product.findById(targetId);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json(p);
};

export const create = async (req, res) => {
  const { name, category, price, regularPrice, salePrice, costPrice, image, stock, description, sku } = req.body;
  const slug = slugify(name);
  const unitPrice = Number(salePrice || price || regularPrice || 0);

  if (pool) {
    const r = await pool.query(
      `INSERT INTO products (sku, name, slug, description, category, price, regular_price, sale_price, cost_price, image, stock, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true)
       RETURNING id as _id, id, sku, name, slug, description, category, price, regular_price as "regularPrice", sale_price as "salePrice", cost_price as "costPrice", image, stock, active`,
      [sku || 'SKU-' + Date.now(), name, slug, description, category, unitPrice, Number(regularPrice || unitPrice), Number(salePrice || unitPrice), Number(costPrice || 0), image, Number(stock || 10)]
    );
    return res.status(201).json(r.rows[0]);
  }

  const data = { ...req.body, slug };
  res.status(201).json(await Product.create(data));
};

export const update = async (req, res) => {
  const targetId = req.params.id;

  if (pool) {
    const { name, price, regularPrice, salePrice, costPrice, stock, active, category, image, description } = req.body;
    const r = await pool.query(
      `UPDATE products SET 
        name = COALESCE($1, name),
        price = COALESCE($2, price),
        regular_price = COALESCE($3, regular_price),
        sale_price = COALESCE($4, sale_price),
        cost_price = COALESCE($5, cost_price),
        stock = COALESCE($6, stock),
        active = COALESCE($7, active),
        category = COALESCE($8, category),
        image = COALESCE($9, image),
        description = COALESCE($10, description),
        updated_at = NOW()
       WHERE (id::text = $11 OR sku = $11)
       RETURNING id as _id, id, sku, name, slug, description, category, price, regular_price as "regularPrice", sale_price as "salePrice", cost_price as "costPrice", image, stock, active`,
      [name, price, regularPrice, salePrice, costPrice, stock, active, category, image, description, targetId]
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
    const r = await pool.query(`DELETE FROM products WHERE id::text = $1 OR sku = $1 RETURNING id`, [targetId]);
    if (!r.rows.length) return res.status(404).json({ message: 'Product not found' });
    return res.json({ message: 'Product deleted successfully' });
  }

  const p = await Product.findByIdAndDelete(targetId);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted successfully' });
};
