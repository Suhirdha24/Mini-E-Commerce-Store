import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const catalog90 = [
  // BAGS (15 UNIQUE ITEMS & IMAGES)
  { id: 'b1', name: 'Essential Leather Tote', category: 'Bags', price: 2899, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'b2', name: 'Everyday Canvas Backpack', category: 'Bags', price: 1999, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', stock: 14 },
  { id: 'b3', name: 'Minimal Crossbody Bag', category: 'Bags', price: 1799, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80', stock: 20 },
  { id: 'b4', name: 'Travel Duffle Bag', category: 'Bags', price: 3599, image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&auto=format&fit=crop&q=80', stock: 9 },
  { id: 'b5', name: 'Structured Work Briefcase', category: 'Bags', price: 4299, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80', stock: 6 },
  { id: 'b6', name: 'Suede Shoulder Bag', category: 'Bags', price: 2499, image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: 'b7', name: 'Urban Sling Pack', category: 'Bags', price: 1499, image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80', stock: 18 },
  { id: 'b8', name: 'Executive Laptop Satchel', category: 'Bags', price: 3899, image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&auto=format&fit=crop&q=80', stock: 11 },
  { id: 'b9', name: 'Woven Straw Beach Tote', category: 'Bags', price: 1299, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80', stock: 25 },
  { id: 'b10', name: 'Compact Belt Bag', category: 'Bags', price: 1199, image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&auto=format&fit=crop&q=80', stock: 30 },
  { id: 'b11', name: 'Quilted Evening Clutch', category: 'Bags', price: 2199, image: 'https://images.unsplash.com/photo-1566150902880-d9d1c1cf9c98?w=800&auto=format&fit=crop&q=80', stock: 8 },
  { id: 'b12', name: 'Roll-Top Commuter Backpack', category: 'Bags', price: 2799, image: 'https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'b13', name: 'Classic Leather Hobo Bag', category: 'Bags', price: 3199, image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&auto=format&fit=crop&q=80', stock: 10 },
  { id: 'b14', name: 'Waterproof Gym Duffle', category: 'Bags', price: 1899, image: 'https://images.unsplash.com/photo-1512413914633-b5043f4942e5?w=800&auto=format&fit=crop&q=80', stock: 22 },
  { id: 'b15', name: 'Vintage Messenger Bag', category: 'Bags', price: 2999, image: 'https://images.unsplash.com/photo-1524498250077-390f9e378fc0?w=800&auto=format&fit=crop&q=80', stock: 7 },

  // FOOTWEAR (15 UNIQUE ITEMS & IMAGES)
  { id: 'f1', name: 'Aero Knit Sneakers', category: 'Footwear', price: 2499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', stock: 18 },
  { id: 'f2', name: 'Neutral Studio Sneakers', category: 'Footwear', price: 3499, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: 'f3', name: 'Minimal Canvas Loafers', category: 'Footwear', price: 2999, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'f4', name: 'Classic Leather Boots', category: 'Footwear', price: 4499, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80', stock: 8 },
  { id: 'f5', name: 'Urban Trail Runners', category: 'Footwear', price: 3899, image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80', stock: 10 },
  { id: 'f6', name: 'Retro High-Top Sneakers', category: 'Footwear', price: 3299, image: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800&auto=format&fit=crop&q=80', stock: 14 },
  { id: 'f7', name: 'Suede Chelsea Boots', category: 'Footwear', price: 4299, image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80', stock: 9 },
  { id: 'f8', name: 'Minimalist Slip-On Vans', category: 'Footwear', price: 1999, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80', stock: 20 },
  { id: 'f9', name: 'Leather Oxford Dress Shoes', category: 'Footwear', price: 4999, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80', stock: 6 },
  { id: 'f10', name: 'Lightweight Running Shoes', category: 'Footwear', price: 2799, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80', stock: 25 },
  { id: 'f11', name: 'Ergonomic Comfort Sandals', category: 'Footwear', price: 1499, image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=80', stock: 18 },
  { id: 'f12', name: 'Chunky Sole Platform Sneakers', category: 'Footwear', price: 3699, image: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800&auto=format&fit=crop&q=80', stock: 11 },
  { id: 'f13', name: 'Handcrafted Monk Strap Shoes', category: 'Footwear', price: 5299, image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80', stock: 5 },
  { id: 'f14', name: 'Breathable Gym Trainers', category: 'Footwear', price: 2399, image: 'https://images.unsplash.com/photo-1460353581641-37baff1e6f91?w=800&auto=format&fit=crop&q=80', stock: 16 },
  { id: 'f15', name: 'Waterproof Hiking Boots', category: 'Footwear', price: 4799, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80', stock: 8 },

  // ACCESSORIES (15 UNIQUE ITEMS & IMAGES)
  { id: 'a1', name: 'Mono Chronograph Watch', category: 'Accessories', price: 3999, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: 'a2', name: 'Classic Leather Wallet', category: 'Accessories', price: 999, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', stock: 20 },
  { id: 'a3', name: 'Sleek Polarized Sunglasses', category: 'Accessories', price: 1499, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', stock: 30 },
  { id: 'a4', name: 'Minimal Gold Ring', category: 'Accessories', price: 1199, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80', stock: 25 },
  { id: 'a5', name: 'Silk Knit Scarf', category: 'Accessories', price: 1599, image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&auto=format&fit=crop&q=80', stock: 16 },
  { id: 'a6', name: 'Minimalist Card Holder', category: 'Accessories', price: 799, image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=800&auto=format&fit=crop&q=80', stock: 35 },
  { id: 'a7', name: 'Silver Chain Pendant', category: 'Accessories', price: 1399, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80', stock: 22 },
  { id: 'a8', name: 'Automatic Minimal Watch', category: 'Accessories', price: 4999, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80', stock: 7 },
  { id: 'a9', name: 'Full-Grain Leather Belt', category: 'Accessories', price: 1299, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', stock: 19 },
  { id: 'a10', name: 'Retro Aviator Sunglasses', category: 'Accessories', price: 1699, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'a11', name: 'Wool Knit Beanie', category: 'Accessories', price: 899, image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop&q=80', stock: 28 },
  { id: 'a12', name: 'Leather Key Keychain', category: 'Accessories', price: 499, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80', stock: 45 },
  { id: 'a13', name: 'Stainless Steel Cuff Bracelet', category: 'Accessories', price: 1099, image: 'https://images.unsplash.com/photo-1611591475199-52e6462c1a01?w=800&auto=format&fit=crop&q=80', stock: 18 },
  { id: 'a14', name: 'Cashmere Winter Gloves', category: 'Accessories', price: 1799, image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: 'a15', name: 'Travel Passport Wallet', category: 'Accessories', price: 1199, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80', stock: 24 },

  // APPAREL (15 UNIQUE ITEMS & IMAGES)
  { id: 'c1', name: 'Essential Cotton Hoodie', category: 'Apparel', price: 1599, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80', stock: 30 },
  { id: 'c2', name: 'Heavyweight Linen Shirt', category: 'Apparel', price: 1899, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80', stock: 25 },
  { id: 'c3', name: 'Tailored Wool Coat', category: 'Apparel', price: 4999, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80', stock: 8 },
  { id: 'c4', name: 'Relaxed Denim Jacket', category: 'Apparel', price: 2799, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80', stock: 14 },
  { id: 'c5', name: 'Oversized Cotton Tee', category: 'Apparel', price: 899, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', stock: 40 },
  { id: 'c6', name: 'Slim Fit Chino Pants', category: 'Apparel', price: 2199, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80', stock: 18 },
  { id: 'c7', name: 'Merino Wool Crewneck Sweater', category: 'Apparel', price: 2999, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: 'c8', name: 'Classic Oxford Button-Down', category: 'Apparel', price: 1799, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80', stock: 22 },
  { id: 'c9', name: 'Puffer Winter Vest', category: 'Apparel', price: 2599, image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'c10', name: 'Athletic Jogger Pants', category: 'Apparel', price: 1499, image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80', stock: 28 },
  { id: 'c11', name: 'Striped Breton Long Sleeve', category: 'Apparel', price: 1299, image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80', stock: 32 },
  { id: 'c12', name: 'Fleece Lined Parka', category: 'Apparel', price: 5499, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80', stock: 6 },
  { id: 'c13', name: 'Casual Short Sleeve Polo', category: 'Apparel', price: 1199, image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&auto=format&fit=crop&q=80', stock: 24 },
  { id: 'c14', name: 'Cargo Utility Trousers', category: 'Apparel', price: 2399, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80', stock: 17 },
  { id: 'c15', name: 'Tailored Blazer Jacket', category: 'Apparel', price: 4299, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80', stock: 9 },

  // HOME (15 UNIQUE ITEMS & IMAGES)
  { id: 'h1', name: 'Contour Ceramic Lamp', category: 'Home', price: 2199, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', stock: 10 },
  { id: 'h2', name: 'Minimalist Wall Clock', category: 'Home', price: 1499, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'h3', name: 'Linen Throw Pillow', category: 'Home', price: 999, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', stock: 22 },
  { id: 'h4', name: 'Scented Soy Candle', category: 'Home', price: 799, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80', stock: 35 },
  { id: 'h5', name: 'Ceramic Coffee Mug', category: 'Home', price: 649, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', stock: 50 },
  { id: 'h6', name: 'Woven Cotton Area Rug', category: 'Home', price: 3499, image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&auto=format&fit=crop&q=80', stock: 8 },
  { id: 'h7', name: 'Glass Aroma Diffuser', category: 'Home', price: 1799, image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&auto=format&fit=crop&q=80', stock: 16 },
  { id: 'h8', name: 'Oak Wood Desk Organizer', category: 'Home', price: 1299, image: 'https://images.unsplash.com/photo-1585336261026-8f5786372969?w=800&auto=format&fit=crop&q=80', stock: 20 },
  { id: 'h9', name: 'Minimalist Flower Vase', category: 'Home', price: 899, image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&auto=format&fit=crop&q=80', stock: 28 },
  { id: 'h10', name: 'Soft Velvet Throw Blanket', category: 'Home', price: 1899, image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=800&auto=format&fit=crop&q=80', stock: 14 },
  { id: 'h11', name: 'Bamboo Serving Tray', category: 'Home', price: 1099, image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80', stock: 19 },
  { id: 'h12', name: 'Brass Table Mirror', category: 'Home', price: 1599, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: 'h13', name: 'Ceramic Planter Pot', category: 'Home', price: 749, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80', stock: 32 },
  { id: 'h14', name: 'Linen Table Runner', category: 'Home', price: 849, image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&auto=format&fit=crop&q=80', stock: 25 },
  { id: 'h15', name: 'LED Arc Floor Lamp', category: 'Home', price: 4299, image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80', stock: 6 },

  // ELECTRONICS (15 UNIQUE ITEMS & IMAGES)
  { id: 'e1', name: 'Acoustic Wireless Headphones', category: 'Electronics', price: 4299, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', stock: 11 },
  { id: 'e2', name: 'Minimal Bluetooth Speaker', category: 'Electronics', price: 2999, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80', stock: 18 },
  { id: 'e3', name: 'Wireless Charging Pad', category: 'Electronics', price: 1299, image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&auto=format&fit=crop&q=80', stock: 30 },
  { id: 'e4', name: 'Aluminum Laptop Stand', category: 'Electronics', price: 1799, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80', stock: 20 },
  { id: 'e5', name: 'Slim Magnetic Power Bank', category: 'Electronics', price: 1999, image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop&q=80', stock: 25 },
  { id: 'e6', name: 'True Wireless Earbuds', category: 'Electronics', price: 3499, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'e7', name: 'Mechanical Ergonomic Keyboard', category: 'Electronics', price: 4999, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', stock: 9 },
  { id: 'e8', name: 'Precision Wireless Mouse', category: 'Electronics', price: 1899, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80', stock: 22 },
  { id: 'e9', name: 'HD USB Webcam', category: 'Electronics', price: 2499, image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800&auto=format&fit=crop&q=80', stock: 14 },
  { id: 'e10', name: 'Smart Fitness Tracker', category: 'Electronics', price: 2799, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80', stock: 19 },
  { id: 'e11', name: 'Multi-Port USB-C Hub', category: 'Electronics', price: 1599, image: 'https://images.unsplash.com/photo-1622445268465-843d3876878b?w=800&auto=format&fit=crop&q=80', stock: 28 },
  { id: 'e12', name: 'Noise Isolating Earphones', category: 'Electronics', price: 1199, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80', stock: 35 },
  { id: 'e13', name: 'Portable SSD Drive 1TB', category: 'Electronics', price: 5999, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80', stock: 8 },
  { id: 'e14', name: 'Smart Home Security Cam', category: 'Electronics', price: 3299, image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: 'e15', name: 'Desk LED Ring Light', category: 'Electronics', price: 999, image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&auto=format&fit=crop&q=80', stock: 40 }
];

const getDeduplicatedProducts = () => {
  const uniqueMap = new Map();
  
  // 1. Load brand-new catalog90 with 90 unique high-resolution images
  catalog90.forEach(item => {
    if (!item || !item.name) return;
    const key = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    uniqueMap.set(key, item);
  });

  // 2. Merge only newly added admin products
  let custom = [];
  try {
    custom = JSON.parse(localStorage.getItem('custom_products') || '[]');
  } catch (e) {
    custom = [];
  }
  
  custom.forEach(item => {
    if (!item || !item.name) return;
    const key = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!uniqueMap.has(key) || String(item.id || item._id).startsWith('p-')) {
      uniqueMap.set(key, item);
    }
  });

  const result = Array.from(uniqueMap.values());
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