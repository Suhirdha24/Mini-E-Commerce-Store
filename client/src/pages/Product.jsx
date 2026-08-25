import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const catalog90 = [
  // BAGS (15 ITEMS)
  { id: 'b1', name: 'Essential Leather Tote', category: 'Bags', price: 2899, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', description: 'Structured daily tote crafted from premium leather, designed for work, travel, and everyday elegance.', stock: 15 },
  { id: 'b2', name: 'Everyday Canvas Backpack', category: 'Bags', price: 1999, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', description: 'Durable canvas backpack with dedicated laptop compartment and ergonomic padded shoulder straps.', stock: 14 },
  { id: 'b3', name: 'Minimal Crossbody Bag', category: 'Bags', price: 1799, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80', description: 'Compact crossbody bag designed for hands-free daily travel and phone/wallet storage.', stock: 20 },
  { id: 'b4', name: 'Travel Duffle Bag', category: 'Bags', price: 3599, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', description: 'Spacious weekend duffle bag with water-resistant lining.', stock: 9 },
  { id: 'b5', name: 'Structured Work Briefcase', category: 'Bags', price: 4299, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', description: 'Sleek executive briefcase crafted from genuine calfskin leather.', stock: 6 },
  { id: 'b6', name: 'Suede Shoulder Bag', category: 'Bags', price: 2499, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80', description: 'Soft suede shoulder bag with magnetic snap closure.', stock: 12 },
  { id: 'b7', name: 'Urban Sling Pack', category: 'Bags', price: 1499, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', description: 'Compact water-resistant sling bag for daily essentials.', stock: 18 },
  { id: 'b8', name: 'Executive Laptop Satchel', category: 'Bags', price: 3899, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', description: 'Padded laptop messenger bag with multiple organizer slots.', stock: 11 },
  { id: 'b9', name: 'Woven Straw Beach Tote', category: 'Bags', price: 1299, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80', description: 'Natural hand-woven straw tote bag for summer getaways.', stock: 25 },
  { id: 'b10', name: 'Compact Belt Bag', category: 'Bags', price: 1199, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', description: 'Versatile waist belt bag with adjustable clip strap.', stock: 30 },
  { id: 'b11', name: 'Quilted Evening Clutch', category: 'Bags', price: 2199, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', description: 'Elegant evening clutch with removable gold chain strap.', stock: 8 },
  { id: 'b12', name: 'Roll-Top Commuter Backpack', category: 'Bags', price: 2799, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', description: 'Expandable roll-top weather-proof backpack.', stock: 15 },
  { id: 'b13', name: 'Classic Leather Hobo Bag', category: 'Bags', price: 3199, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80', description: 'Slouchy genuine leather hobo shoulder bag.', stock: 10 },
  { id: 'b14', name: 'Waterproof Gym Duffle', category: 'Bags', price: 1899, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', description: 'Heavy-duty gym bag with separate shoe compartment.', stock: 22 },
  { id: 'b15', name: 'Vintage Messenger Bag', category: 'Bags', price: 2999, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', description: 'Canvas and leather trim crossbody messenger bag.', stock: 7 },

  // FOOTWEAR (15 ITEMS)
  { id: 'f1', name: 'Aero Knit Sneakers', category: 'Footwear', price: 2499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', description: 'Minimalist everyday sneakers featuring breathable knit uppers and lightweight cushioned soles.', stock: 18 },
  { id: 'f2', name: 'Neutral Studio Sneakers', category: 'Footwear', price: 3499, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80', description: 'Chic pastel streetwear sneakers with supportive arch cushioning for all-day urban walking.', stock: 12 },
  { id: 'f3', name: 'Minimal Canvas Loafers', category: 'Footwear', price: 2999, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80', description: 'Slip-on casual canvas loafers with flexible rubber outsoles.', stock: 15 },
  { id: 'f4', name: 'Classic Leather Boots', category: 'Footwear', price: 4499, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80', description: 'Handcrafted leather boots built for durability and style.', stock: 8 },
  { id: 'f5', name: 'Urban Trail Runners', category: 'Footwear', price: 3899, image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80', description: 'All-terrain running shoes with high-traction rubber treads.', stock: 10 },
  { id: 'f6', name: 'Retro High-Top Sneakers', category: 'Footwear', price: 3299, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', description: 'Classic retro basketball high-top sneakers with rubber toe cap.', stock: 14 },
  { id: 'f7', name: 'Suede Chelsea Boots', category: 'Footwear', price: 4299, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80', description: 'Refined suede Chelsea boots with elastic side gores.', stock: 9 },
  { id: 'f8', name: 'Minimalist Slip-On Vans', category: 'Footwear', price: 1999, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80', description: 'Low-profile canvas slip-on sneakers for daily wear.', stock: 20 },
  { id: 'f9', name: 'Leather Oxford Dress Shoes', category: 'Footwear', price: 4999, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80', description: 'Polished calfskin leather Oxford formal dress shoes.', stock: 6 },
  { id: 'f10', name: 'Lightweight Running Shoes', category: 'Footwear', price: 2799, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', description: 'Ultra-lightweight mesh athletic trainers.', stock: 25 },
  { id: 'f11', name: 'Ergonomic Comfort Sandals', category: 'Footwear', price: 1499, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80', description: 'Cushioned footbed strap sandals.', stock: 18 },
  { id: 'f12', name: 'Chunky Sole Platform Sneakers', category: 'Footwear', price: 3699, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80', description: 'Trendy thick sole platform sneakers.', stock: 11 },
  { id: 'f13', name: 'Handcrafted Monk Strap Shoes', category: 'Footwear', price: 5299, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80', description: 'Double buckle leather monk strap dress shoes.', stock: 5 },
  { id: 'f14', name: 'Breathable Gym Trainers', category: 'Footwear', price: 2399, image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80', description: 'Supportive cross-training athletic shoes.', stock: 16 },
  { id: 'f15', name: 'Waterproof Hiking Boots', category: 'Footwear', price: 4799, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80', description: 'Rugged waterproof outdoor hiking boots.', stock: 8 },

  // ACCESSORIES (15 ITEMS)
  { id: 'a1', name: 'Mono Chronograph Watch', category: 'Accessories', price: 3999, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', description: 'Clean chronograph watch with a modern stainless steel case and genuine leather strap.', stock: 12 },
  { id: 'a2', name: 'Classic Leather Wallet', category: 'Accessories', price: 999, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', description: 'Slim bifold wallet made with genuine full-grain leather and RFID protection.', stock: 20 },
  { id: 'a3', name: 'Sleek Polarized Sunglasses', category: 'Accessories', price: 1499, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', description: 'Lightweight UV400 polarized sunglasses with matte black frames.', stock: 30 },
  { id: 'a4', name: 'Minimal Gold Ring', category: 'Accessories', price: 1199, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80', description: '18k gold-plated minimalist ring for daily statement wear.', stock: 25 },
  { id: 'a5', name: 'Silk Knit Scarf', category: 'Accessories', price: 1599, image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&auto=format&fit=crop&q=80', description: 'Luxurious 100% mulberry silk knit scarf.', stock: 16 },
  { id: 'a6', name: 'Minimalist Card Holder', category: 'Accessories', price: 799, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', description: 'Ultra-thin front pocket leather card sleeve.', stock: 35 },
  { id: 'a7', name: 'Silver Chain Pendant', category: 'Accessories', price: 1399, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80', description: 'Sterling silver geometric pendant necklace.', stock: 22 },
  { id: 'a8', name: 'Automatic Minimal Watch', category: 'Accessories', price: 4999, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', description: 'Self-winding automatic mechanical watch.', stock: 7 },
  { id: 'a9', name: 'Full-Grain Leather Belt', category: 'Accessories', price: 1299, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', description: 'Durable solid brass buckle leather belt.', stock: 19 },
  { id: 'a10', name: 'Retro Aviator Sunglasses', category: 'Accessories', price: 1699, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', description: 'Gold frame classic aviator sunglasses.', stock: 15 },
  { id: 'a11', name: 'Wool Knit Beanie', category: 'Accessories', price: 899, image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&auto=format&fit=crop&q=80', description: 'Warm ribbed wool knit winter beanie.', stock: 28 },
  { id: 'a12', name: 'Leather Key Keychain', category: 'Accessories', price: 499, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', description: 'Handcrafted leather key organizer clip.', stock: 45 },
  { id: 'a13', name: 'Stainless Steel Cuff Bracelet', category: 'Accessories', price: 1099, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80', description: 'Brushed matte stainless steel cuff bracelet.', stock: 18 },
  { id: 'a14', name: 'Cashmere Winter Gloves', category: 'Accessories', price: 1799, image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&auto=format&fit=crop&q=80', description: 'Touchscreen compatible cashmere gloves.', stock: 12 },
  { id: 'a15', name: 'Travel Passport Wallet', category: 'Accessories', price: 1199, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', description: 'Multi-card passport travel organizer.', stock: 24 },

  // APPAREL (15 ITEMS)
  { id: 'c1', name: 'Essential Cotton Hoodie', category: 'Apparel', price: 1599, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80', description: 'Heavyweight organic cotton hoodie with a relaxed, cozy fit.', stock: 30 },
  { id: 'c2', name: 'Heavyweight Linen Shirt', category: 'Apparel', price: 1899, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80', description: 'Breathable 100% natural linen button-down shirt.', stock: 25 },
  { id: 'c3', name: 'Tailored Wool Coat', category: 'Apparel', price: 4999, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80', description: 'Elegant double-breasted wool blend coat.', stock: 8 },
  { id: 'c4', name: 'Relaxed Denim Jacket', category: 'Apparel', price: 2799, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80', description: 'Vintage washed denim jacket with metal shank buttons.', stock: 14 },
  { id: 'c5', name: 'Oversized Cotton Tee', category: 'Apparel', price: 899, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', description: 'Premium heavyweight cotton t-shirt with dropped shoulders.', stock: 40 },
  { id: 'c6', name: 'Slim Fit Chino Pants', category: 'Apparel', price: 2199, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80', description: 'Stretch cotton twill chino trousers.', stock: 18 },
  { id: 'c7', name: 'Merino Wool Crewneck Sweater', category: 'Apparel', price: 2999, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80', description: 'Fine knit Australian merino wool sweater.', stock: 12 },
  { id: 'c8', name: 'Classic Oxford Button-Down', category: 'Apparel', price: 1799, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80', description: '100% cotton Oxford weave formal shirt.', stock: 22 },
  { id: 'c9', name: 'Puffer Winter Vest', category: 'Apparel', price: 2599, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80', description: 'Insulated sleeveless winter puffer jacket.', stock: 15 },
  { id: 'c10', name: 'Athletic Jogger Pants', category: 'Apparel', price: 1499, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80', description: 'Tapered fleece casual jogger pants.', stock: 28 },
  { id: 'c11', name: 'Striped Breton Long Sleeve', category: 'Apparel', price: 1299, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', description: 'Nautical striped cotton long sleeve top.', stock: 32 },
  { id: 'c12', name: 'Fleece Lined Parka', category: 'Apparel', price: 5499, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80', description: 'Heavy winter parka with faux fur hood.', stock: 6 },
  { id: 'c13', name: 'Casual Short Sleeve Polo', category: 'Apparel', price: 1199, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80', description: 'Pique cotton polo shirt.', stock: 24 },
  { id: 'c14', name: 'Cargo Utility Trousers', category: 'Apparel', price: 2399, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80', description: 'Multi-pocket heavy cotton cargo pants.', stock: 17 },
  { id: 'c15', name: 'Tailored Blazer Jacket', category: 'Apparel', price: 4299, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80', description: 'Single-breasted structured blazer jacket.', stock: 9 },

  // HOME (15 ITEMS)
  { id: 'h1', name: 'Contour Ceramic Lamp', category: 'Home', price: 2199, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', description: 'Sculptural ceramic lamp producing warm, ambient room illumination.', stock: 10 },
  { id: 'h2', name: 'Minimalist Wall Clock', category: 'Home', price: 1499, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=80', description: 'Silent sweeping movement wall clock with wooden frame.', stock: 15 },
  { id: 'h3', name: 'Linen Throw Pillow', category: 'Home', price: 999, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', description: 'Soft textured linen cushion with feather fill.', stock: 22 },
  { id: 'h4', name: 'Scented Soy Candle', category: 'Home', price: 799, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80', description: 'Hand-poured soy wax candle infused with sandalwood notes.', stock: 35 },
  { id: 'h5', name: 'Ceramic Coffee Mug', category: 'Home', price: 649, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', description: 'Matte stoneware coffee mug handcrafted by local artisans.', stock: 50 },
  { id: 'h6', name: 'Woven Cotton Area Rug', category: 'Home', price: 3499, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', description: 'Hand-woven geometric pattern cotton area rug.', stock: 8 },
  { id: 'h7', name: 'Glass Aroma Diffuser', category: 'Home', price: 1799, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80', description: 'Ultrasonic essential oil diffuser with ambient LED lighting.', stock: 16 },
  { id: 'h8', name: 'Oak Wood Desk Organizer', category: 'Home', price: 1299, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', description: 'Solid oak desktop pen and stationary holder.', stock: 20 },
  { id: 'h9', name: 'Minimalist Flower Vase', category: 'Home', price: 899, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', description: 'Matte white ceramic decorative flower vase.', stock: 28 },
  { id: 'h10', name: 'Soft Velvet Throw Blanket', category: 'Home', price: 1899, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', description: 'Plush velvet couch throw blanket.', stock: 14 },
  { id: 'h11', name: 'Bamboo Serving Tray', category: 'Home', price: 1099, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', description: 'Eco-friendly bamboo breakfast serving tray with handles.', stock: 19 },
  { id: 'h12', name: 'Brass Table Mirror', category: 'Home', price: 1599, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=80', description: 'Swivel dual-sided vanity mirror.', stock: 12 },
  { id: 'h13', name: 'Ceramic Planter Pot', category: 'Home', price: 749, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', description: 'Indoor plant pot with drainage saucer.', stock: 32 },
  { id: 'h14', name: 'Linen Table Runner', category: 'Home', price: 849, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', description: 'Natural unbleached linen dining table runner.', stock: 25 },
  { id: 'h15', name: 'LED Arc Floor Lamp', category: 'Home', price: 4299, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', description: 'Modern arched standing floor reading lamp.', stock: 6 },

  // ELECTRONICS (15 ITEMS)
  { id: 'e1', name: 'Acoustic Wireless Headphones', category: 'Electronics', price: 4299, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', description: 'Over-ear wireless headphones with active noise cancellation and high-fidelity sound.', stock: 11 },
  { id: 'e2', name: 'Minimal Bluetooth Speaker', category: 'Electronics', price: 2999, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80', description: 'Portable wireless speaker delivering 360-degree room-filling audio.', stock: 18 },
  { id: 'e3', name: 'Wireless Charging Pad', category: 'Electronics', price: 1299, image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&auto=format&fit=crop&q=80', description: 'Fast 15W Qi-certified wireless phone charger.', stock: 30 },
  { id: 'e4', name: 'Aluminum Laptop Stand', category: 'Electronics', price: 1799, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80', description: 'Ergonomic aluminum laptop riser for improved posture.', stock: 20 },
  { id: 'e5', name: 'Slim Magnetic Power Bank', category: 'Electronics', price: 1999, image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop&q=80', description: '10,000mAh magnetic portable charger.', stock: 25 },
  { id: 'e6', name: 'True Wireless Earbuds', category: 'Electronics', price: 3499, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', description: 'In-ear noise isolating Bluetooth earbuds with charging case.', stock: 15 },
  { id: 'e7', name: 'Mechanical Ergonomic Keyboard', category: 'Electronics', price: 4999, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80', description: 'Wireless mechanical keyboard with tactile brown switches.', stock: 9 },
  { id: 'e8', name: 'Precision Wireless Mouse', category: 'Electronics', price: 1899, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80', description: 'Ergonomic multi-device Bluetooth wireless mouse.', stock: 22 },
  { id: 'e9', name: 'HD USB Webcam', category: 'Electronics', price: 2499, image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&auto=format&fit=crop&q=80', description: '1080p 60fps streaming webcam with built-in mic.', stock: 14 },
  { id: 'e10', name: 'Smart Fitness Tracker', category: 'Electronics', price: 2799, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', description: 'Waterproof fitness watch with heart rate and sleep tracking.', stock: 19 },
  { id: 'e11', name: 'Multi-Port USB-C Hub', category: 'Electronics', price: 1599, image: 'https://images.unsplash.com/photo-1622445268465-843d3876878b?w=800&auto=format&fit=crop&q=80', description: '7-in-1 USB-C dongle with 4K HDMI and SD card reader.', stock: 28 },
  { id: 'e12', name: 'Noise Isolating Earphones', category: 'Electronics', price: 1199, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', description: 'Wired studio monitor earphones with mic.', stock: 35 },
  { id: 'e13', name: 'Portable SSD Drive 1TB', category: 'Electronics', price: 5999, image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop&q=80', description: 'High-speed 1050MB/s USB 3.2 external solid state drive.', stock: 8 },
  { id: 'e14', name: 'Smart Home Security Cam', category: 'Electronics', price: 3299, image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&auto=format&fit=crop&q=80', description: '1080p indoor Wi-Fi night vision camera.', stock: 12 },
  { id: 'e15', name: 'Desk LED Ring Light', category: 'Electronics', price: 999, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', description: 'Dimmable USB desk ring light for video calls.', stock: 40 }
];

const getProductById = (targetId) => {
  const custom = JSON.parse(localStorage.getItem('custom_products') || '[]');
  const combined = [...custom, ...catalog90];
  const uniqueMap = new Map();
  combined.forEach(item => {
    if (!item || !item.name) return;
    const key = item.name.trim().toLowerCase();
    if (!uniqueMap.has(key)) uniqueMap.set(key, item);
  });
  const allProds = Array.from(uniqueMap.values());
  if (!targetId) return allProds[0];
  const cleanId = String(targetId).trim().toLowerCase();
  return allProds.find(item => 
    String(item.id || item._id).trim().toLowerCase() === cleanId ||
    item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(cleanId)
  ) || allProds[0];
};

export default function Product() {
  const { id } = useParams();
  const { add } = useCart();
  const { user } = useAuth();
  const userKey = user?.email ? `fav_${user.email.toLowerCase()}` : 'fav_guest';

  // GUARANTEED NON-NULL INITIALIZATION SO IT NEVER STAYS STUCK LOADING
  const [p, setP] = useState(() => getProductById(id));

  const [q, setQ] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const [addedMsg, setAddedMsg] = useState(false);

  useEffect(() => {
    const item = getProductById(id);
    if (item) setP(item);

    api.get(`/products/${id}`)
      .then(r => { if (r.data?._id || r.data?.id) setP(r.data); })
      .catch(() => {});

    const favs = JSON.parse(localStorage.getItem(userKey) || '[]');
    setIsFav(favs.some(item => String(item.id || item._id).toLowerCase() === String(id).toLowerCase()));
  }, [id, userKey]);

  const toggleFavorite = () => {
    if (!p) return;
    let favs = JSON.parse(localStorage.getItem(userKey) || '[]');
    const pId = p._id || p.id;
    if (isFav) {
      favs = favs.filter(item => String(item._id || item.id).toLowerCase() !== String(pId).toLowerCase());
    } else {
      favs.push(p);
    }
    localStorage.setItem(userKey, JSON.stringify(favs));
    setIsFav(!isFav);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const handleAddToCart = () => {
    add(p, q);
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };

  if (!p) return <div style={{ textAlign: 'center', padding: '100px', fontSize: '18px' }}>Loading product details...</div>;

  return (
    <section className="page" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <Link to="/shop" style={{ textDecoration: 'none', color: 'var(--text-muted)', marginBottom: '24px', display: 'inline-block', fontWeight: 600 }}>
        ← Back to Shop
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
        <img src={p.image} alt={p.name} style={{ width: '100%', height: '480px', objectFit: 'cover', borderRadius: '14px', boxShadow: 'var(--shadow-md)' }} />
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="eyebrow">{p.category}</p>
            
            <button 
              onClick={toggleFavorite}
              style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: isFav ? '#dc2626' : '#666', fontWeight: 600 }}
            >
              {isFav ? '♥ Saved to Favorites' : '♡ Add to Favorites'}
            </button>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '42px', marginBottom: '12px' }}>{p.name}</h1>
          <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px' }}>₹{p.price?.toLocaleString('en-IN')}</p>

          {/* STOCK REMAINING BADGE */}
          <div style={{ marginBottom: '20px' }}>
            {p.stock === 0 ? (
              <span style={{ background: '#fee2e2', color: '#dc2626', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700 }}>
                Out of Stock
              </span>
            ) : p.stock < 5 ? (
              <span style={{ background: '#fef3c7', color: '#d97706', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700 }}>
                ⚠️ Only {p.stock} items left in stock - Order Soon!
              </span>
            ) : (
              <span style={{ background: '#def7ec', color: '#03543f', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700 }}>
                ✓ In Stock ({p.stock} units available)
              </span>
            )}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.7, marginBottom: '28px' }}>
            {p.description || 'Thoughtfully crafted luxury essential with high quality aesthetic design.'}
          </p>

          {addedMsg && (
            <div style={{ background: '#def7ec', color: '#03543f', padding: '12px 18px', borderRadius: '8px', marginBottom: '16px', fontWeight: 600 }}>
              ✓ Added {q} item(s) to your Bag!
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <input 
              type="number" 
              min="1" 
              max={p.stock || 20} 
              value={q} 
              disabled={p.stock === 0}
              onChange={e => setQ(Math.max(1, Math.min(p.stock || 20, +e.target.value)))} 
              style={{ width: '80px', textAlign: 'center' }} 
            />
            <button className="primary" disabled={p.stock === 0} onClick={handleAddToCart} style={{ flex: 1 }}>
              {p.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}