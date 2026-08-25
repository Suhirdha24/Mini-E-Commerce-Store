import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { pool } from '../config/supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_fallback_key_2026';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      if (pool) {
        const r = await pool.query(`SELECT id, name, email, role FROM users WHERE id::text = $1`, [String(decoded.id)]);
        if (!r.rows.length) {
          return res.status(401).json({ message: 'User not found or token expired' });
        }
        req.user = r.rows[0];
        return next();
      }

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found or token expired' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
};