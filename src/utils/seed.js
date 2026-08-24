import dotenv from 'dotenv';dotenv.config();import mongoose from 'mongoose';import bcrypt from 'bcryptjs';import {connectDB} from '../config/db.js';import User from '../models/User.js';import Product from '../models/Product.js';
const products=[
{name:'Aero Knit Sneakers',description:'Minimal everyday sneakers with breathable knit upper.',price:2499,category:'Footwear',image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900',stock:18,featured:true},
{name:'Mono Chronograph',description:'Clean chronograph watch with a modern stainless case.',price:3999,category:'Accessories',image:'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900',stock:12,featured:true},
{name:'Studio Tote',description:'Structured daily tote designed for work and travel.',price:1899,category:'Bags',image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900',stock:25},
{name:'Essential Hoodie',description:'Heavyweight cotton hoodie with a relaxed silhouette.',price:1599,category:'Apparel',image:'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900',stock:30},
{name:'Contour Lamp',description:'Soft ambient table lamp for a calm workspace.',price:2199,category:'Home',image:'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900',stock:10}
];
await connectDB();await User.updateOne({email:'admin@ministore.com'},{$set:{name:'Store Admin',email:'admin@ministore.com',password:await bcrypt.hash('Admin@123',10),role:'admin'}},{upsert:true});for(const p of products)await Product.updateOne({name:p.name},{$set:{...p,slug:p.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}},{upsert:true});console.log('Seed complete. Admin: admin@ministore.com / Admin@123');await mongoose.disconnect();
