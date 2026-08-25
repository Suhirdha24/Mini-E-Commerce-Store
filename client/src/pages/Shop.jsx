import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const catalog90 = [
  // BAGS (15 ITEMS)
  { id: 'b1', name: 'Essential Leather Tote', category: 'Bags', price: 2899, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'b2', name: 'Everyday Canvas Backpack', category: 'Bags', price: 1999, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', stock: 14 },
  { id: 'b3', name: 'Minimal Crossbody Bag', category: 'Bags', price: 1799, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80', stock: 20 },
  { id: 'b4', name: 'Travel Duffle Bag', category: 'Bags', price: 3599, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', stock: 9 },
  { id: 'b5', name: 'Structured Work Briefcase', category: 'Bags', price: 4299, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', stock: 6 },
  { id: 'b6', name: 'Suede Shoulder Bag', category: 'Bags', price: 2499, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: 'b7', name: 'Urban Sling Pack', category: 'Bags', price: 1499, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', stock: 18 },
  { id: 'b8', name: 'Executive Laptop Satchel', category: 'Bags', price: 3899, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', stock: 11 },
  { id: 'b9', name: 'Woven Straw Beach Tote', category: 'Bags', price: 1299, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80', stock: 25 },
  { id: 'b10', name: 'Compact Belt Bag', category: 'Bags', price: 1199, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', stock: 30 },
  { id: 'b11', name: 'Quilted Evening Clutch', category: 'Bags', price: 2199, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', stock: 8 },
  { id: 'b12', name: 'Roll-Top Commuter Backpack', category: 'Bags', price: 2799, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'b13', name: 'Classic Leather Hobo Bag', category: 'Bags', price: 3199, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80', stock: 10 },
  { id: 'b14', name: 'Waterproof Gym Duffle', category: 'Bags', price: 1899, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', stock: 22 },
  { id: 'b15', name: 'Vintage Messenger Bag', category: 'Bags', price: 2999, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', stock: 7 },

  // FOOTWEAR (15 ITEMS)
  { id: 'f1', name: 'Aero Knit Sneakers', category: 'Footwear', price: 2499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', stock: 18 },
  { id: 'f2', name: 'Neutral Studio Sneakers', category: 'Footwear', price: 3499, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: 'f3', name: 'Minimal Canvas Loafers', category: 'Footwear', price: 2999, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'f4', name: 'Classic Leather Boots', category: 'Footwear', price: 4499, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80', stock: 8 },
  { id: 'f5', name: 'Urban Trail Runners', category: 'Footwear', price: 3899, image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80', stock: 10 },
  { id: 'f6', name: 'Retro High-Top Sneakers', category: 'Footwear', price: 3299, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', stock: 14 },
  { id: 'f7', name: 'Suede Chelsea Boots', category: 'Footwear', price: 4299, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80', stock: 9 },
  { id: 'f8', name: 'Minimalist Slip-On Vans', category: 'Footwear', price: 1999, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80', stock: 20 },
  { id: 'f9', name: 'Leather Oxford Dress Shoes', category: 'Footwear', price: 4999, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80', stock: 6 },
  { id: 'f10', name: 'Lightweight Running Shoes', category: 'Footwear', price: 2799, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', stock: 25 },
  { id: 'f11', name: 'Ergonomic Comfort Sandals', category: 'Footwear', price: 1499, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80', stock: 18 },
  { id: 'f12', name: 'Chunky Sole Platform Sneakers', category: 'Footwear', price: 3699, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80', stock: 11 },
  { id: 'f13', name: 'Handcrafted Monk Strap Shoes', category: 'Footwear', price: 5299, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80', stock: 5 },
  { id: 'f14', name: 'Breathable Gym Trainers', category: 'Footwear', price: 2399, image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80', stock: 16 },
  { id: 'f15', name: 'Waterproof Hiking Boots', category: 'Footwear', price: 4799, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80', stock: 8 },

  // ACCESSORIES (15 ITEMS)
  { id: 'a1', name: 'Mono Chronograph Watch', category: 'Accessories', price: 3999, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: 'a2', name: 'Classic Leather Wallet', category: 'Accessories', price: 999, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', stock: 20 },
  { id: 'a3', name: 'Sleek Polarized Sunglasses', category: 'Accessories', price: 1499, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', stock: 30 },
  { id: 'a4', name: 'Minimal Gold Ring', category: 'Accessories', price: 1199, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80', stock: 25 },
  { id: 'a5', name: 'Silk Knit Scarf', category: 'Accessories', price: 1599, image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&auto=format&fit=crop&q=80', stock: 16 },
  { id: 'a6', name: 'Minimalist Card Holder', category: 'Accessories', price: 799, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', stock: 35 },
  { id: 'a7', name: 'Silver Chain Pendant', category: 'Accessories', price: 1399, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80', stock: 22 },
  { id: 'a8', name: 'Automatic Minimal Watch', category: 'Accessories', price: 4999, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', stock: 7 },
  { id: 'a9', name: 'Full-Grain Leather Belt', category: 'Accessories', price: 1299, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', stock: 19 },
  { id: 'a10', name: 'Retro Aviator Sunglasses', category: 'Accessories', price: 1699, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'a11', name: 'Wool Knit Beanie', category: 'Accessories', price: 899, image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&auto=format&fit=crop&q=80', stock: 28 },
  { id: 'a12', name: 'Leather Key Keychain', category: 'Accessories', price: 499, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', stock: 45 },
  { id: 'a13', name: 'Stainless Steel Cuff Bracelet', category: 'Accessories', price: 1099, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80', stock: 18 },
  { id: 'a14', name: 'Cashmere Winter Gloves', category: 'Accessories', price: 1799, image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: 'a15', name: 'Travel Passport Wallet', category: 'Accessories', price: 1199, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', stock: 24 },

  // APPAREL (15 ITEMS)
  { id: 'c1', name: 'Essential Cotton Hoodie', category: 'Apparel', price: 1599, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80', stock: 30 },
  { id: 'c2', name: 'Heavyweight Linen Shirt', category: 'Apparel', price: 1899, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80', stock: 25 },
  { id: 'c3', name: 'Tailored Wool Coat', category: 'Apparel', price: 4999, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80', stock: 8 },
  { id: 'c4', name: 'Relaxed Denim Jacket', category: 'Apparel', price: 2799, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80', stock: 14 },
  { id: 'c5', name: 'Oversized Cotton Tee', category: 'Apparel', price: 899, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', stock: 40 },
  { id: 'c6', name: 'Slim Fit Chino Pants', category: 'Apparel', price: 2199, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80', stock: 18 },
  { id: 'c7', name: 'Merino Wool Crewneck Sweater', category: 'Apparel', price: 2999, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: 'c8', name: 'Classic Oxford Button-Down', category: 'Apparel', price: 1799, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80', stock: 22 },
  { id: 'c9', name: 'Puffer Winter Vest', category: 'Apparel', price: 2599, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'c10', name: 'Athletic Jogger Pants', category: 'Apparel', price: 1499, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80', stock: 28 },
  { id: 'c11', name: 'Striped Breton Long Sleeve', category: 'Apparel', price: 1299, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', stock: 32 },
  { id: 'c12', name: 'Fleece Lined Parka', category: 'Apparel', price: 5499, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80', stock: 6 },
  { id: 'c13', name: 'Casual Short Sleeve Polo', category: 'Apparel', price: 1199, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80', stock: 24 },
  { id: 'c14', name: 'Cargo Utility Trousers', category: 'Apparel', price: 2399, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80', stock: 17 },
  { id: 'c15', name: 'Tailored Blazer Jacket', category: 'Apparel', price: 4299, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80', stock: 9 },

  // HOME (15 ITEMS)
  { id: 'h1', name: 'Contour Ceramic Lamp', category: 'Home', price: 2199, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', stock: 10 },
  { id: 'h2', name: 'Minimalist Wall Clock', category: 'Home', price: 1499, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'h3', name: 'Linen Throw Pillow', category: 'Home', price: 999, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', stock: 22 },
  { id: 'h4', name: 'Scented Soy Candle', category: 'Home', price: 799, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80', stock: 35 },
  { id: 'h5', name: 'Ceramic Coffee Mug', category: 'Home', price: 649, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', stock: 50 },
  { id: 'h6', name: 'Woven Cotton Area Rug', category: 'Home', price: 3499, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', stock: 8 },
  { id: 'h7', name: 'Glass Aroma Diffuser', category: 'Home', price: 1799, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80', stock: 16 },
  { id: 'h8', name: 'Oak Wood Desk Organizer', category: 'Home', price: 1299, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', stock: 20 },
  { id: 'h9', name: 'Minimalist Flower Vase', category: 'Home', price: 899, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', stock: 28 },
  { id: 'h10', name: 'Soft Velvet Throw Blanket', category: 'Home', price: 1899, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', stock: 14 },
  { id: 'h11', name: 'Bamboo Serving Tray', category: 'Home', price: 1099, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', stock: 19 },
  { id: 'h12', name: 'Brass Table Mirror', category: 'Home', price: 1599, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: 'h13', name: 'Ceramic Planter Pot', category: 'Home', price: 749, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', stock: 32 },
  { id: 'h14', name: 'Linen Table Runner', category: 'Home', price: 849, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', stock: 25 },
  { id: 'h15', name: 'LED Arc Floor Lamp', category: 'Home', price: 4299, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', stock: 6 },

  // ELECTRONICS (15 ITEMS)
  { id: 'e1', name: 'Acoustic Wireless Headphones', category: 'Electronics', price: 4299, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', stock: 11 },
  { id: 'e2', name: 'Minimal Bluetooth Speaker', category: 'Electronics', price: 2999, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80', stock: 18 },
  { id: 'e3', name: 'Wireless Charging Pad', category: 'Electronics', price: 1299, image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&auto=format&fit=crop&q=80', stock: 30 },
  { id: 'e4', name: 'Aluminum Laptop Stand', category: 'Electronics', price: 1799, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80', stock: 20 },
  { id: 'e5', name: 'Slim Magnetic Power Bank', category: 'Electronics', price: 1999, image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop&q=80', stock: 25 },
  { id: 'e6', name: 'True Wireless Earbuds', category: 'Electronics', price: 3499, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'e7', name: 'Mechanical Ergonomic Keyboard', category: 'Electronics', price: 4999, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80', stock: 9 },
  { id: 'e8', name: 'Precision Wireless Mouse', category: 'Electronics', price: 1899, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80', stock: 22 },
  { id: 'e9', name: 'HD USB Webcam', category: 'Electronics', price: 2499, image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&auto=format&fit=crop&q=80', stock: 14 },
  { id: 'e10', name: 'Smart Fitness Tracker', category: 'Electronics', price: 2799, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', stock: 19 },
  { id: 'e11', name: 'Multi-Port USB-C Hub', category: 'Electronics', price: 1599, image: 'https://images.unsplash.com/photo-1622445268465-843d3876878b?w=800&auto=format&fit=crop&q=80', stock: 28 },
  { id: 'e12', name: 'Noise Isolating Earphones', category: 'Electronics', price: 1199, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', stock: 35 },
  { id: 'e13', name: 'Portable SSD Drive 1TB', category: 'Electronics', price: 5999, image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop&q=80', stock: 8 },
  { id: 'e14', name: 'Smart Home Security Cam', category: 'Electronics', price: 3299, image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: 'e15', name: 'Desk LED Ring Light', category: 'Electronics', price: 999, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', stock: 40 }
];

const getDeduplicatedProducts = () => {
  let custom = [];
  try {
    custom = JSON.parse(localStorage.getItem('custom_products') || '[]');
  } catch (e) {
    custom = [];
  }
  
  const combined = [...custom, ...catalog90];
  const uniqueMap = new Map();
  
  combined.forEach(item => {
    if (!item || !item.name) return;
    // Standardize key by removing non-alphanumeric characters for 100% accurate deduplication
    const key = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, item);
    }
  });
  
  const result = Array.from(uniqueMap.values());
  // Self-heal localStorage so bad legacy duplicates are erased permanently!
  localStorage.setItem('custom_products', JSON.stringify(result));
  return result;
};

export default function Shop() {
  const [items, setItems] = useState(() => getDeduplicatedProducts());
  const [categories] = useState(['Bags', 'Footwear', 'Accessories', 'Apparel', 'Home', 'Electronics']);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');

  const loadProducts = () => {
    setItems(getDeduplicatedProducts());
  };

  useEffect(() => {
    loadProducts();
    window.addEventListener('productsUpdated', loadProducts);
    return () => window.removeEventListener('productsUpdated', loadProducts);
  }, []);

  const filtered = items.filter(i => 
    (!cat || i.category === cat) &&
    (!q || i.name.toLowerCase().includes(q.toLowerCase()) || i.category.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <section className="page">
      <p className="eyebrow">NOVA CATALOG ({items.length} PRODUCTS)</p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '44px', marginBottom: '16px' }}>Shop Everything</h1>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', margin: '24px 0 36px' }}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search 90 products..."
          style={{ maxWidth: '360px' }}
        />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => setCat('')} style={{ padding: '10px 18px', background: cat === '' ? 'var(--text-dark)' : '#fff', color: cat === '' ? '#fff' : 'var(--text-dark)', border: '1px solid var(--border-light)', borderRadius: '20px', cursor: 'pointer' }}>
            All (90)
          </button>
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ padding: '10px 18px', background: cat === c ? 'var(--text-dark)' : '#fff', color: cat === c ? '#fff' : 'var(--text-dark)', border: '1px solid var(--border-light)', borderRadius: '20px', cursor: 'pointer' }}>
              {c} (15)
            </button>
          ))}
        </div>
      </div>

      <div className="grid">
        {filtered.map(p => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}