import { pool, supabase } from '../config/supabase.js';
import dotenv from 'dotenv';
dotenv.config();

export const seedProductsList = [
  // BAGS
  { sku: 'SKU-BAG-01', name: 'Essential Leather Tote', category: 'Bags', regular_price: 3200, sale_price: 2899, cost_price: 1800, price: 2899, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', description: 'Structured daily tote crafted from premium leather.', stock: 15, active: true },
  { sku: 'SKU-BAG-02', name: 'Everyday Canvas Backpack', category: 'Bags', regular_price: 2200, sale_price: 1999, cost_price: 1200, price: 1999, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', description: 'Durable canvas backpack with dedicated laptop sleeve.', stock: 14, active: true },
  { sku: 'SKU-BAG-03', name: 'Minimal Crossbody Bag', category: 'Bags', regular_price: 1999, sale_price: 1799, cost_price: 1000, price: 1799, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80', description: 'Compact crossbody bag designed for hands-free daily travel.', stock: 20, active: true },
  { sku: 'SKU-BAG-04', name: 'Travel Duffle Bag', category: 'Bags', regular_price: 3999, sale_price: 3599, cost_price: 2200, price: 3599, image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&auto=format&fit=crop&q=80', description: 'Spacious weekend duffle bag with water-resistant lining.', stock: 9, active: true },
  { sku: 'SKU-BAG-05', name: 'Structured Work Briefcase', category: 'Bags', regular_price: 4800, sale_price: 4299, cost_price: 2500, price: 4299, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80', description: 'Sleek executive briefcase crafted from genuine calfskin.', stock: 6, active: true },
  { sku: 'SKU-BAG-06', name: 'Suede Shoulder Bag', category: 'Bags', regular_price: 2800, sale_price: 2499, cost_price: 1500, price: 2499, image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80', description: 'Soft suede shoulder bag with magnetic snap closure.', stock: 12, active: true },
  { sku: 'SKU-BAG-07', name: 'Urban Sling Pack', category: 'Bags', regular_price: 1799, sale_price: 1499, cost_price: 800, price: 1499, image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80', description: 'Compact water-resistant sling bag for daily essentials.', stock: 18, active: true },
  { sku: 'SKU-BAG-08', name: 'Executive Laptop Satchel', category: 'Bags', regular_price: 4299, sale_price: 3899, cost_price: 2300, price: 3899, image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&auto=format&fit=crop&q=80', description: 'Padded laptop messenger bag with multiple organizer slots.', stock: 11, active: true },
  { sku: 'SKU-BAG-09', name: 'Woven Straw Beach Tote', category: 'Bags', regular_price: 1499, sale_price: 1299, cost_price: 700, price: 1299, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80', description: 'Natural hand-woven straw tote bag for summer getaways.', stock: 25, active: true },
  { sku: 'SKU-BAG-10', name: 'Compact Belt Bag', category: 'Bags', regular_price: 1399, sale_price: 1199, cost_price: 600, price: 1199, image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&auto=format&fit=crop&q=80', description: 'Versatile waist belt bag with adjustable clip strap.', stock: 30, active: true },

  // FOOTWEAR
  { sku: 'SKU-FTW-01', name: 'Aero Knit Sneakers', category: 'Footwear', regular_price: 2800, sale_price: 2499, cost_price: 1400, price: 2499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', description: 'Minimalist everyday sneakers with breathable knit upper.', stock: 18, active: true },
  { sku: 'SKU-FTW-02', name: 'Neutral Studio Sneakers', category: 'Footwear', regular_price: 3800, sale_price: 3499, cost_price: 2000, price: 3499, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80', description: 'Chic urban sneakers with arch cushioning.', stock: 12, active: true },
  { sku: 'SKU-FTW-03', name: 'Minimal Canvas Loafers', category: 'Footwear', regular_price: 3299, sale_price: 2999, cost_price: 1600, price: 2999, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80', description: 'Slip-on casual canvas loafers with flexible rubber outsoles.', stock: 15, active: true },
  { sku: 'SKU-FTW-04', name: 'Classic Leather Boots', category: 'Footwear', regular_price: 4999, sale_price: 4499, cost_price: 2800, price: 4499, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80', description: 'Handcrafted leather boots built for durability.', stock: 8, active: true },
  { sku: 'SKU-FTW-05', name: 'Urban Trail Runners', category: 'Footwear', regular_price: 4299, sale_price: 3899, cost_price: 2300, price: 3899, image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80', description: 'All-terrain running shoes with high-traction rubber treads.', stock: 10, active: true },
  { sku: 'SKU-FTW-06', name: 'Retro High-Top Sneakers', category: 'Footwear', regular_price: 3699, sale_price: 3299, cost_price: 1900, price: 3299, image: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800&auto=format&fit=crop&q=80', description: 'Classic retro basketball high-top sneakers.', stock: 14, active: true },
  { sku: 'SKU-FTW-07', name: 'Suede Chelsea Boots', category: 'Footwear', regular_price: 4799, sale_price: 4299, cost_price: 2500, price: 4299, image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80', description: 'Refined suede Chelsea boots with elastic side gores.', stock: 9, active: true },
  { sku: 'SKU-FTW-08', name: 'Minimalist Slip-On Vans', category: 'Footwear', regular_price: 2299, sale_price: 1999, cost_price: 1100, price: 1999, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80', description: 'Low-profile canvas slip-on sneakers.', stock: 20, active: true },
  { sku: 'SKU-FTW-09', name: 'Leather Oxford Dress Shoes', category: 'Footwear', regular_price: 5499, sale_price: 4999, cost_price: 3000, price: 4999, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80', description: 'Polished calfskin leather Oxford formal dress shoes.', stock: 6, active: true },
  { sku: 'SKU-FTW-10', name: 'Lightweight Running Shoes', category: 'Footwear', regular_price: 2999, sale_price: 2799, cost_price: 1500, price: 2799, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80', description: 'Ultra-lightweight mesh athletic trainers.', stock: 25, active: true },

  // ACCESSORIES
  { sku: 'SKU-ACC-01', name: 'Mono Chronograph Watch', category: 'Accessories', regular_price: 4500, sale_price: 3999, cost_price: 2500, price: 3999, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', description: 'Stainless steel watch with genuine leather strap.', stock: 12, active: true },
  { sku: 'SKU-ACC-02', name: 'Classic Leather Wallet', category: 'Accessories', regular_price: 1299, sale_price: 999, cost_price: 500, price: 999, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', description: 'Slim bifold wallet made with full-grain leather.', stock: 20, active: true },
  { sku: 'SKU-ACC-03', name: 'Sleek Polarized Sunglasses', category: 'Accessories', regular_price: 1800, sale_price: 1499, cost_price: 800, price: 1499, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', description: 'UV400 polarized sunglasses with matte black frames.', stock: 30, active: true },
  { sku: 'SKU-ACC-04', name: 'Minimal Gold Ring', category: 'Accessories', regular_price: 1399, sale_price: 1199, cost_price: 600, price: 1199, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80', description: '18k gold-plated minimalist statement ring.', stock: 25, active: true },
  { sku: 'SKU-ACC-05', name: 'Silk Knit Scarf', category: 'Accessories', regular_price: 1899, sale_price: 1599, cost_price: 900, price: 1599, image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&auto=format&fit=crop&q=80', description: 'Luxurious 100% mulberry silk knit scarf.', stock: 16, active: true },
  { sku: 'SKU-ACC-06', name: 'Minimalist Card Holder', category: 'Accessories', regular_price: 999, sale_price: 799, cost_price: 400, price: 799, image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=800&auto=format&fit=crop&q=80', description: 'Ultra-thin front pocket leather card sleeve.', stock: 35, active: true },
  { sku: 'SKU-ACC-07', name: 'Silver Chain Pendant', category: 'Accessories', regular_price: 1599, sale_price: 1399, cost_price: 700, price: 1399, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80', description: 'Sterling silver geometric pendant necklace.', stock: 22, active: true },
  { sku: 'SKU-ACC-08', name: 'Automatic Minimal Watch', category: 'Accessories', regular_price: 5499, sale_price: 4999, cost_price: 2900, price: 4999, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80', description: 'Self-winding automatic mechanical watch.', stock: 7, active: true },
  { sku: 'SKU-ACC-09', name: 'Full-Grain Leather Belt', category: 'Accessories', regular_price: 1499, sale_price: 1299, cost_price: 700, price: 1299, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', description: 'Durable solid brass buckle leather belt.', stock: 19, active: true },
  { sku: 'SKU-ACC-10', name: 'Retro Aviator Sunglasses', category: 'Accessories', regular_price: 1999, sale_price: 1699, cost_price: 900, price: 1699, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80', description: 'Gold frame classic aviator sunglasses.', stock: 15, active: true },

  // APPAREL
  { sku: 'SKU-APP-01', name: 'Essential Cotton Hoodie', category: 'Apparel', regular_price: 1999, sale_price: 1599, cost_price: 900, price: 1599, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80', description: 'Heavyweight organic cotton hoodie with relaxed fit.', stock: 30, active: true },
  { sku: 'SKU-APP-02', name: 'Heavyweight Linen Shirt', category: 'Apparel', regular_price: 2200, sale_price: 1899, cost_price: 1100, price: 1899, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80', description: 'Breathable 100% natural linen button-down shirt.', stock: 25, active: true },
  { sku: 'SKU-APP-03', name: 'Tailored Wool Coat', category: 'Apparel', regular_price: 5999, sale_price: 4999, cost_price: 3000, price: 4999, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80', description: 'Elegant double-breasted wool blend coat.', stock: 8, active: true },
  { sku: 'SKU-APP-04', name: 'Relaxed Denim Jacket', category: 'Apparel', regular_price: 3199, sale_price: 2799, cost_price: 1600, price: 2799, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80', description: 'Vintage washed denim jacket with shank buttons.', stock: 14, active: true },
  { sku: 'SKU-APP-05', name: 'Oversized Cotton Tee', category: 'Apparel', regular_price: 1099, sale_price: 899, cost_price: 450, price: 899, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', description: 'Premium heavyweight cotton tee with dropped shoulders.', stock: 40, active: true },
  { sku: 'SKU-APP-06', name: 'Slim Fit Chino Pants', category: 'Apparel', regular_price: 2499, sale_price: 2199, cost_price: 1200, price: 2199, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80', description: 'Stretch cotton twill chino trousers.', stock: 18, active: true },
  { sku: 'SKU-APP-07', name: 'Merino Wool Crewneck', category: 'Apparel', regular_price: 3499, sale_price: 2999, cost_price: 1700, price: 2999, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80', description: 'Fine knit Australian merino wool sweater.', stock: 12, active: true },
  { sku: 'SKU-APP-08', name: 'Classic Oxford Button-Down', category: 'Apparel', regular_price: 1999, sale_price: 1799, cost_price: 950, price: 1799, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80', description: '100% cotton Oxford weave formal shirt.', stock: 22, active: true },
  { sku: 'SKU-APP-09', name: 'Puffer Winter Vest', category: 'Apparel', regular_price: 2899, sale_price: 2599, cost_price: 1400, price: 2599, image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80', description: 'Insulated sleeveless winter puffer vest.', stock: 15, active: true },
  { sku: 'SKU-APP-10', name: 'Athletic Jogger Pants', category: 'Apparel', regular_price: 1799, sale_price: 1499, cost_price: 800, price: 1499, image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80', description: 'Tapered fleece casual jogger pants.', stock: 28, active: true },

  // HOME
  { sku: 'SKU-HOM-01', name: 'Contour Ceramic Lamp', category: 'Home', regular_price: 2500, sale_price: 2199, cost_price: 1200, price: 2199, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', description: 'Sculptural ceramic lamp producing warm ambient light.', stock: 10, active: true },
  { sku: 'SKU-HOM-02', name: 'Minimalist Wall Clock', category: 'Home', regular_price: 1800, sale_price: 1499, cost_price: 900, price: 1499, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=80', description: 'Silent sweeping movement wall clock with wooden frame.', stock: 15, active: true },
  { sku: 'SKU-HOM-03', name: 'Linen Throw Pillow', category: 'Home', regular_price: 1200, sale_price: 999, cost_price: 500, price: 999, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', description: 'Soft textured linen cushion with feather fill.', stock: 22, active: true },
  { sku: 'SKU-HOM-04', name: 'Scented Soy Candle', category: 'Home', regular_price: 999, sale_price: 799, cost_price: 400, price: 799, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80', description: 'Hand-poured soy wax candle with sandalwood notes.', stock: 35, active: true },
  { sku: 'SKU-HOM-05', name: 'Ceramic Coffee Mug', category: 'Home', regular_price: 799, sale_price: 649, cost_price: 300, price: 649, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', description: 'Matte stoneware coffee mug handcrafted by local artisans.', stock: 50, active: true },
  { sku: 'SKU-HOM-06', name: 'Woven Cotton Area Rug', category: 'Home', regular_price: 3999, sale_price: 3499, cost_price: 2000, price: 3499, image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&auto=format&fit=crop&q=80', description: 'Hand-woven geometric pattern cotton area rug.', stock: 8, active: true },
  { sku: 'SKU-HOM-07', name: 'Glass Aroma Diffuser', category: 'Home', regular_price: 1999, sale_price: 1799, cost_price: 1000, price: 1799, image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&auto=format&fit=crop&q=80', description: 'Ultrasonic essential oil diffuser with ambient LED.', stock: 16, active: true },
  { sku: 'SKU-HOM-08', name: 'Oak Wood Desk Organizer', category: 'Home', regular_price: 1499, sale_price: 1299, cost_price: 700, price: 1299, image: 'https://images.unsplash.com/photo-1585336261026-8f5786372969?w=800&auto=format&fit=crop&q=80', description: 'Solid oak desktop pen and stationary holder.', stock: 20, active: true },
  { sku: 'SKU-HOM-09', name: 'Minimalist Flower Vase', category: 'Home', regular_price: 1099, sale_price: 899, cost_price: 450, price: 899, image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&auto=format&fit=crop&q=80', description: 'Matte white ceramic decorative flower vase.', stock: 28, active: true },
  { sku: 'SKU-HOM-10', name: 'Soft Velvet Throw Blanket', category: 'Home', regular_price: 2199, sale_price: 1899, cost_price: 1000, price: 1899, image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=800&auto=format&fit=crop&q=80', description: 'Plush velvet couch throw blanket.', stock: 14, active: true },

  // ELECTRONICS
  { sku: 'SKU-ELE-01', name: 'Acoustic Wireless Headphones', category: 'Electronics', regular_price: 4999, sale_price: 4299, cost_price: 2600, price: 4299, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', description: 'Over-ear wireless headphones with active noise cancellation.', stock: 11, active: true },
  { sku: 'SKU-ELE-02', name: 'Minimal Bluetooth Speaker', category: 'Electronics', regular_price: 3499, sale_price: 2999, cost_price: 1800, price: 2999, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80', description: 'Portable wireless speaker delivering 360-degree sound.', stock: 18, active: true },
  { sku: 'SKU-ELE-03', name: 'Wireless Charging Pad', category: 'Electronics', price: 1299, regular_price: 1500, sale_price: 1299, cost_price: 700, image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&auto=format&fit=crop&q=80', description: 'Fast 15W Qi-certified wireless phone charger.', stock: 30, active: true },
  { sku: 'SKU-ELE-04', name: 'Aluminum Laptop Stand', category: 'Electronics', regular_price: 1999, sale_price: 1799, cost_price: 950, price: 1799, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80', description: 'Ergonomic aluminum laptop riser for improved posture.', stock: 20, active: true },
  { sku: 'SKU-ELE-05', name: 'Slim Magnetic Power Bank', category: 'Electronics', regular_price: 2299, sale_price: 1999, cost_price: 1100, price: 1999, image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop&q=80', description: '10,000mAh magnetic portable power bank.', stock: 25, active: true },
  { sku: 'SKU-ELE-06', name: 'True Wireless Earbuds', category: 'Electronics', regular_price: 3899, sale_price: 3499, cost_price: 2000, price: 3499, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80', description: 'In-ear noise isolating Bluetooth earbuds.', stock: 15, active: true },
  { sku: 'SKU-ELE-07', name: 'Mechanical Ergonomic Keyboard', category: 'Electronics', regular_price: 5499, sale_price: 4999, cost_price: 2900, price: 4999, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', description: 'Wireless mechanical keyboard with tactile brown switches.', stock: 9, active: true },
  { sku: 'SKU-ELE-08', name: 'Precision Wireless Mouse', category: 'Electronics', regular_price: 2199, sale_price: 1899, cost_price: 1000, price: 1899, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80', description: 'Ergonomic multi-device Bluetooth wireless mouse.', stock: 22, active: true },
  { sku: 'SKU-ELE-09', name: 'HD USB Webcam', category: 'Electronics', regular_price: 2799, sale_price: 2499, cost_price: 1300, price: 2499, image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800&auto=format&fit=crop&q=80', description: '1080p 60fps streaming webcam with built-in mic.', stock: 14, active: true },
  { sku: 'SKU-ELE-10', name: 'Smart Fitness Tracker', category: 'Electronics', regular_price: 3199, sale_price: 2799, cost_price: 1500, price: 2799, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80', description: 'Waterproof fitness watch with heart rate tracking.', stock: 19, active: true }
];

const seedSupabase = async () => {
  console.log("Seeding products to Supabase PostgreSQL...");

  if (pool) {
    for (const p of seedProductsList) {
      await pool.query(`
        INSERT INTO products (sku, name, description, category, price, regular_price, sale_price, cost_price, image, stock, active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (sku) DO UPDATE SET
          name = EXCLUDED.name,
          price = EXCLUDED.price,
          sale_price = EXCLUDED.sale_price,
          regular_price = EXCLUDED.regular_price,
          image = EXCLUDED.image,
          stock = EXCLUDED.stock;
      `, [
        p.sku,
        p.name,
        p.description || '',
        p.category,
        Number(p.sale_price || p.price || 0),
        Number(p.regular_price || p.price || 0),
        Number(p.sale_price || p.price || 0),
        Number(p.cost_price || 0),
        p.image,
        Number(p.stock || 10),
        true
      ]);
    }
    console.log(`✓ Successfully seeded ${seedProductsList.length} products to Supabase PostgreSQL database!`);
  } else if (supabase) {
    const { error } = await supabase.from('products').upsert(seedProductsList, { onConflict: 'sku' });
    if (error) {
      console.error("Supabase seed error:", error.message);
    } else {
      console.log(`✓ Successfully seeded ${seedProductsList.length} products to Supabase!`);
    }
  } else {
    console.log("⚠️ Please add your Supabase DATABASE_URL or SUPABASE_URL & SUPABASE_KEY to server/.env first.");
  }
};

seedSupabase().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
