import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { pool } from '../config/supabase.js';

// CREATE ORDER WITH FULL ACID TRANSACTIONS
export const create = async (req, res) => {
  const { items, shipping, paymentMethod } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty. Please add items to order.' });
  }

  // 1. Supabase / PostgreSQL Direct with Full ACID Transactions
  if (pool) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN'); // Start Transaction (Atomicity)

      let total = 0;
      const snapshot = [];

      for (const item of items) {
        const prodIdentifier = String(item.product || item.id || item._id);
        const q = Number(item.quantity || 1);

        if (!Number.isInteger(q) || q < 1) {
          throw new Error('Invalid quantity requested.');
        }

        // PESSIMISTIC LOCK: Lock row for update (Isolation & Consistency)
        const pRes = await client.query(
          `SELECT id, sku, name, price, regular_price, sale_price, stock, image, active 
           FROM products 
           WHERE (id::text = $1 OR sku = $1) 
           FOR UPDATE`,
          [prodIdentifier]
        );

        if (!pRes.rows.length) {
          throw new Error(`Product "${prodIdentifier}" not found in inventory.`);
        }

        const p = pRes.rows[0];

        if (!p.active) {
          throw new Error(`Product "${p.name}" is currently unavailable.`);
        }

        if (p.stock < q) {
          throw new Error(`Insufficient stock for "${p.name}". Only ${p.stock} available in warehouse.`);
        }

        const unitPrice = Number(p.sale_price || p.price || 0);
        total += unitPrice * q;

        // Atomically deduct inventory stock
        await client.query(
          `UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2`,
          [q, p.id]
        );

        snapshot.push({
          product: p.id,
          sku: p.sku,
          name: p.name,
          image: p.image,
          price: unitPrice,
          quantity: q
        });
      }

      const userId = req.user?.id || req.user?._id || null;
      const cleanPaymentMethod = paymentMethod || 'Cash on Delivery (COD)';

      const orderRes = await client.query(
        `INSERT INTO orders (user_id, items, shipping, payment_method, total, status)
         VALUES ($1, $2, $3, $4, $5, 'Processing') RETURNING *`,
        [userId, JSON.stringify(snapshot), JSON.stringify(shipping || {}), cleanPaymentMethod, total]
      );

      await client.query('COMMIT'); // Commit Transaction (Durability)

      const createdOrder = orderRes.rows[0];
      return res.status(201).json({
        ...createdOrder,
        _id: createdOrder.id
      });
    } catch (err) {
      await client.query('ROLLBACK'); // Rollback on any failure (Atomicity)
      return res.status(400).json({ message: err.message || 'Failed to process order.' });
    } finally {
      client.release();
    }
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
  res.status(201).json({ ...order.toObject(), _id: order._id });
};

// GET USER'S OWN ORDERS
export const myOrders = async (req, res) => {
  const userId = req.user?.id || req.user?._id;

  if (pool) {
    const r = await pool.query(
      `SELECT id as _id, id, user_id, items, shipping, payment_method as "paymentMethod", total, status, created_at as "createdAt", updated_at as "updatedAt" 
       FROM orders 
       WHERE user_id::text = $1 
       ORDER BY created_at DESC`,
      [String(userId)]
    );
    return res.json(r.rows);
  }

  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
};

// GET SINGLE ORDER
export const getOne = async (req, res) => {
  const targetId = req.params.id;

  if (pool) {
    const r = await pool.query(
      `SELECT o.id as _id, o.id, o.user_id, o.items, o.shipping, o.payment_method as "paymentMethod", o.total, o.status, o.created_at as "createdAt",
              u.name as "userName", u.email as "userEmail"
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id::text = $1`,
      [targetId]
    );
    if (!r.rows.length) return res.status(404).json({ message: 'Order not found' });
    return res.json(r.rows[0]);
  }

  const o = await Order.findById(targetId).populate('user', 'name email');
  if (!o) return res.status(404).json({ message: 'Order not found' });
  res.json(o);
};

// GET ALL GLOBAL ORDERS (ADMIN)
export const all = async (req, res) => {
  if (pool) {
    const r = await pool.query(
      `SELECT o.id as _id, o.id, o.user_id, o.items, o.shipping, o.payment_method as "paymentMethod", o.total, o.status, o.created_at as "createdAt",
              COALESCE(u.name, o.shipping->>'name', 'Customer') as "customerName",
              COALESCE(u.email, 'customer@store.com') as "customerEmail"
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );
    return res.json(r.rows);
  }

  res.json(await Order.find().populate('user', 'name email').sort({ createdAt: -1 }));
};

// UPDATE ORDER STATUS (WITH INVENTORY RESTORATION ON CANCELLATION)
export const updateStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const targetId = req.params.id;

  if (pool) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Lock order
      const oRes = await client.query(
        `SELECT id, status, items FROM orders WHERE id::text = $1 FOR UPDATE`,
        [targetId]
      );

      if (!oRes.rows.length) {
        throw new Error('Order not found');
      }

      const existingOrder = oRes.rows[0];

      // If cancelling an order that was NOT already cancelled, restore inventory
      if (status === 'Cancelled' && existingOrder.status !== 'Cancelled') {
        const items = Array.isArray(existingOrder.items) ? existingOrder.items : JSON.parse(existingOrder.items || '[]');
        for (const item of items) {
          if (item.product && item.quantity) {
            await client.query(
              `UPDATE products SET stock = stock + $1, updated_at = NOW() WHERE id::text = $2`,
              [Number(item.quantity), String(item.product)]
            );
          }
        }
      }

      const r = await client.query(
        `UPDATE orders SET status = $1, updated_at = NOW() WHERE id::text = $2 RETURNING id as _id, *`,
        [status, targetId]
      );

      await client.query('COMMIT');
      return res.json(r.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: err.message || 'Failed to update order status' });
    } finally {
      client.release();
    }
  }

  const o = await Order.findByIdAndUpdate(targetId, { status }, { new: true });
  if (!o) return res.status(404).json({ message: 'Order not found' });
  res.json(o);
};
