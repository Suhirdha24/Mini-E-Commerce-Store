import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { isSupabaseConfigured, pool, supabase } from '../config/supabase.js';

export const create = async (req, res) => {
  const { items, shipping, paymentMethod } = req.body;
  if (!items?.length) return res.status(400).json({ message: 'Cart is empty' });

  // 1. Supabase / PostgreSQL Direct
  if (pool) {
    let total = 0;
    const snapshot = [];

    for (const item of items) {
      const pRes = await pool.query(`SELECT * FROM products WHERE id::text = $1 OR sku = $1`, [String(item.product)]);
      if (!pRes.rows.length) return res.status(404).json({ message: `Product not found` });
      const p = pRes.rows[0];

      const q = Number(item.quantity);
      if (!Number.isInteger(q) || q < 1) return res.status(400).json({ message: 'Invalid quantity' });
      if (q > p.stock) return res.status(400).json({ message: `Only ${p.stock} units available for ${p.name}` });

      const price = Number(p.sale_price || p.price || 0);
      total += price * q;
      snapshot.push({
        product: p.id,
        sku: p.sku,
        name: p.name,
        image: p.image,
        price,
        quantity: q
      });
    }

    // Deduct stock
    for (const i of snapshot) {
      await pool.query(`UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2`, [i.quantity, i.product]);
    }

    const userId = req.user?.id || req.user?._id || null;
    const orderRes = await pool.query(
      `INSERT INTO orders (user_id, items, shipping, payment_method, total, status)
       VALUES ($1, $2, $3, $4, $5, 'Processing') RETURNING *`,
      [userId, JSON.stringify(snapshot), JSON.stringify(shipping || {}), paymentMethod || 'Cash on Delivery (COD)', total]
    );

    return res.status(201).json(orderRes.rows[0]);
  }

  // 2. Mongoose Fallback
  let total = 0;
  const snapshot = [];
  for (const item of items) {
    const p = await Product.findById(item.product);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    const q = Number(item.quantity);
    if (!Number.isInteger(q) || q < 1) return res.status(400).json({ message: 'Invalid quantity' });
    if (q > p.stock) return res.status(400).json({ message: `Only ${p.stock} units available for ${p.name}` });
    total += p.price * q;
    snapshot.push({ product: p._id, name: p.name, image: p.image, price: p.price, quantity: q });
  }

  for (const i of snapshot) await Product.findByIdAndUpdate(i.product, { $inc: { stock: -i.quantity } });
  const order = await Order.create({ user: req.user?._id, items: snapshot, shipping, total });
  res.status(201).json(order);
};

export const myOrders = async (req, res) => {
  const userId = req.user?.id || req.user?._id;

  if (pool) {
    const r = await pool.query(`SELECT * FROM orders WHERE user_id::text = $1 ORDER BY created_at DESC`, [String(userId)]);
    return res.json(r.rows);
  }

  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
};

export const getOne = async (req, res) => {
  const targetId = req.params.id;

  if (pool) {
    const r = await pool.query(`SELECT * FROM orders WHERE id::text = $1`, [targetId]);
    if (!r.rows.length) return res.status(404).json({ message: 'Order not found' });
    return res.json(r.rows[0]);
  }

  const o = await Order.findById(targetId).populate('user', 'name email');
  if (!o) return res.status(404).json({ message: 'Order not found' });
  res.json(o);
};

export const all = async (req, res) => {
  if (pool) {
    const r = await pool.query(`SELECT * FROM orders ORDER BY created_at DESC`);
    return res.json(r.rows);
  }

  res.json(await Order.find().populate('user', 'name email').sort({ createdAt: -1 }));
};

export const updateStatus = async (req, res) => {
  const allowed = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' });

  const targetId = req.params.id;

  if (pool) {
    const r = await pool.query(`UPDATE orders SET status = $1, updated_at = NOW() WHERE id::text = $2 RETURNING *`, [req.body.status, targetId]);
    if (!r.rows.length) return res.status(404).json({ message: 'Order not found' });
    return res.json(r.rows[0]);
  }

  const o = await Order.findByIdAndUpdate(targetId, { status: req.body.status }, { new: true });
  if (!o) return res.status(404).json({ message: 'Order not found' });
  res.json(o);
};
