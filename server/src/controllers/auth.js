import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Fallback JWT secret prevents 500 server crashes if environment variable is missing
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_fallback_key_2026';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
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

  // Check if user already exists
  const existingUser = await User.findOne({ email: cleanEmail });
  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  // Hash password & create user
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

  // Find user by normalized email
  const user = await User.findOne({ email: cleanEmail });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  // Verify bcrypt password
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

// GET LOGGED IN USER (/api/auth/me)
export const me = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
};