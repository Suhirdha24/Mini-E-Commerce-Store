import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isSupabaseConfigured, pool, supabase } from '../config/supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_fallback_key_2026';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id || user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// REGISTER NEW USER
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // 1. Supabase / PostgreSQL Direct
  if (pool) {
    const existing = await pool.query(`SELECT id FROM users WHERE email = $1`, [cleanEmail]);
    if (existing.rows.length) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const r = await pool.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role`,
      [name.trim(), cleanEmail, hashedPassword, 'user']
    );
    const newUser = r.rows[0];
    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser
    });
  }

  // 2. Mongoose Fallback
  const existingUser = await User.findOne({ email: cleanEmail });
  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: cleanEmail,
    password: hashedPassword,
    role: 'user'
  });

  const token = generateToken(user);

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

// LOGIN USER
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // 1. Supabase / PostgreSQL Direct
  if (pool) {
    const r = await pool.query(`SELECT * FROM users WHERE email = $1`, [cleanEmail]);
    if (!r.rows.length) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const dbUser = r.rows[0];
    const isMatch = await bcrypt.compare(password, dbUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = generateToken(dbUser);
    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role
      }
    });
  }

  // 2. Mongoose Fallback
  const user = await User.findOne({ email: cleanEmail });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = generateToken(user);

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

// GET LOGGED IN USER
export const me = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  res.json({
    user: {
      id: req.user.id || req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
};