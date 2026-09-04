
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const products12 = [
  { name: 'Essential Leather Tote', description: 'Structured daily tote crafted from premium leather, designed for work, travel, and everyday elegance.', price: 2899, category: 'Bags', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', stock: 15, featured: true },
  { name: 'Everyday Canvas Backpack', description: 'Durable canvas backpack with dedicated laptop compartment and ergonomic padded shoulder straps.', price: 1999, category: 'Bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', stock: 14 },
  { name: 'Aero Knit Sneakers', description: 'Minimalist everyday sneakers featuring breathable knit uppers and lightweight cushioned soles.', price: 2499, category: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', stock: 18, featured: true },
  { name: 'Neutral Studio Sneakers', description: 'Chic pastel streetwear sneakers with supportive arch cushioning for all-day urban walking.', price: 3499, category: 'Footwear', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { name: 'Mono Chronograph Watch', description: 'Clean chronograph watch with a modern stainless steel case and genuine leather strap.', price: 3999, category: 'Accessories', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', stock: 12, featured: true },
  { name: 'Classic Leather Wallet', description: 'Slim bifold wallet made with genuine full-grain leather and RFID protection.', price: 999, category: 'Accessories', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', stock: 20 },
  { name: 'Sleek Polarized Sunglasses', description: 'Lightweight UV400 polarized sunglasses with matte black frames.', price: 1499, category: 'Accessories', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', stock: 30 },
  { name: 'Essential Cotton Hoodie', description: 'Heavyweight organic cotton hoodie with a relaxed, cozy fit.', price: 1599, category: 'Apparel', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80', stock: 30 },
  { name: 'Heavyweight Linen Shirt', description: 'Breathable 100% natural linen button-down shirt.', price: 1899, category: 'Apparel', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80', stock: 25 },
  { name: 'Contour Ceramic Lamp', description: 'Sculptural ceramic lamp producing warm, ambient room illumination.', price: 2199, category: 'Home', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', stock: 10 },
  { name: 'Minimalist Wall Clock', description: 'Silent sweeping movement wall clock with wooden frame.', price: 1499, category: 'Home', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { name: 'Acoustic Wireless Headphones', description: 'Over-ear wireless headphones with active noise cancellation and high-fidelity sound.', price: 4299, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', stock: 11 }
];

async function seed() {
  await connectDB();
  
  // Seed Admin Account
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  await User.updateOne(
    { email: 'admin@ministore.com' },
    { $set: { name: 'Store Admin', email: 'admin@ministore.com', password: adminPassword, role: 'admin' } },
    { upsert: true }
  );

  // Seed Customer Account
  const customerPassword = await bcrypt.hash('Customer@123', 10);
  await User.updateOne(
    { email: 'customer@novastore.com' },
    { $set: { name: 'Demo Customer', email: 'customer@novastore.com', password: customerPassword, role: 'user' } },
    { upsert: true }
  );

  // Seed 12 Curated Products
  for (const p of products12) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await Product.updateOne({ name: p.name }, { $set: { ...p, slug } }, { upsert: true });
  }

  console.log('✓ Database Seeded cleanly with Admin & 12 Curated Products!');
  await mongoose.disconnect();
}

seed();
