import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const catalog30 = [
  // BAGS
  { id: 'b1', name: 'Essential Leather Tote', category: 'Bags', price: 2899, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', description: 'Structured daily tote crafted from premium leather, designed for work, travel, and everyday elegance.', stock: 15 },
  { id: 'b2', name: 'Everyday Canvas Backpack', category: 'Bags', price: 1999, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', description: 'Durable canvas backpack with dedicated laptop compartment and ergonomic padded shoulder straps.', stock: 14 },
  { id: 'b3', name: 'Minimal Crossbody Bag', category: 'Bags', price: 1799, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80', description: 'Compact crossbody bag designed for hands-free daily travel and phone/wallet storage.', stock: 20 },
  { id: 'b4', name: 'Travel Duffle Bag', category: 'Bags', price: 3599, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', description: 'Spacious weekend duffle bag with water-resistant lining.', stock: 9 },
  { id: 'b5', name: 'Structured Work Briefcase', category: 'Bags', price: 4299, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', description: 'Sleek executive briefcase crafted from genuine calfskin leather.', stock: 6 },

  // FOOTWEAR
  { id: 'f1', name: 'Aero Knit Sneakers', category: 'Footwear', price: 2499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', description: 'Minimalist everyday sneakers featuring breathable knit uppers and lightweight cushioned soles.', stock: 18 },
  { id: 'f2', name: 'Neutral Studio Sneakers', category: 'Footwear', price: 3499, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80', description: 'Chic pastel streetwear sneakers with supportive arch cushioning for all-day urban walking.', stock: 12 },
  { id: 'f3', name: 'Minimal Canvas Loafers', category: 'Footwear', price: 2999, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80', description: 'Slip-on casual canvas loafers with flexible rubber outsoles.', stock: 15 },
  { id: 'f4', name: 'Classic Leather Boots', category: 'Footwear', price: 4499, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80', description: 'Handcrafted leather boots built for durability and style.', stock: 8 },
  { id: 'f5', name: 'Urban Trail Runners', category: 'Footwear', price: 3899, image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80', description: 'All-terrain running shoes with high-traction rubber treads.', stock: 10 },

  // ACCESSORIES
  { id: 'a1', name: 'Mono Chronograph Watch', category: 'Accessories', price: 3999, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', description: 'Clean chronograph watch with a modern stainless steel case and genuine leather strap.', stock: 12 },
  { id: 'a2', name: 'Classic Leather Wallet', category: 'Accessories', price: 999, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', description: 'Slim bifold wallet made with genuine full-grain leather and RFID protection.', stock: 20 },
  { id: 'a3', name: 'Sleek Polarized Sunglasses', category: 'Accessories', price: 1499, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', description: 'Lightweight UV400 polarized sunglasses with matte black frames.', stock: 30 },
  { id: 'a4', name: 'Minimal Gold Ring', category: 'Accessories', price: 1199, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80', description: '18k gold-plated minimalist ring for daily statement wear.', stock: 25 },
  { id: 'a5', name: 'Silk Knit Scarf', category: 'Accessories', price: 1599, image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&auto=format&fit=crop&q=80', description: 'Luxurious 100% mulberry silk knit scarf.', stock: 16 },

  // APPAREL
  { id: 'c1', name: 'Essential Cotton Hoodie', category: 'Apparel', price: 1599, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80', description: 'Heavyweight organic cotton hoodie with a relaxed, cozy fit.', stock: 30 },
  { id: 'c2', name: 'Heavyweight Linen Shirt', category: 'Apparel', price: 1899, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80', description: 'Breathable 100% natural linen button-down shirt.', stock: 25 },
  { id: 'c3', name: 'Tailored Wool Coat', category: 'Apparel', price: 4999, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80', description: 'Elegant double-breasted wool blend coat.', stock: 8 },
  { id: 'c4', name: 'Relaxed Denim Jacket', category: 'Apparel', price: 2799, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80', description: 'Vintage washed denim jacket with metal shank buttons.', stock: 14 },
  { id: 'c5', name: 'Oversized Cotton Tee', category: 'Apparel', price: 899, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', description: 'Premium heavyweight cotton t-shirt with dropped shoulders.', stock: 40 },

  // HOME
  { id: 'h1', name: 'Contour Ceramic Lamp', category: 'Home', price: 2199, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', description: 'Sculptural ceramic lamp producing warm, ambient room illumination.', stock: 10 },
  { id: 'h2', name: 'Minimalist Wall Clock', category: 'Home', price: 1499, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=80', description: 'Silent sweeping movement wall clock with wooden frame.', stock: 15 },
  { id: 'h3', name: 'Linen Throw Pillow', category: 'Home', price: 999, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', description: 'Soft textured linen cushion with feather fill.', stock: 22 },
  { id: 'h4', name: 'Scented Soy Candle', category: 'Home', price: 799, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80', description: 'Hand-poured soy wax candle infused with sandalwood notes.', stock: 35 },
  { id: 'h5', name: 'Ceramic Coffee Mug', category: 'Home', price: 649, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', description: 'Matte stoneware coffee mug handcrafted by local artisans.', stock: 50 },

  // ELECTRONICS
  { id: 'e1', name: 'Acoustic Wireless Headphones', category: 'Electronics', price: 4299, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', description: 'Over-ear wireless headphones with active noise cancellation and high-fidelity sound.', stock: 11 },
  { id: 'e2', name: 'Minimal Bluetooth Speaker', category: 'Electronics', price: 2999, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80', description: 'Portable wireless speaker delivering 360-degree room-filling audio.', stock: 18 },
  { id: 'e3', name: 'Wireless Charging Pad', category: 'Electronics', price: 1299, image: 'https://images.unsplash.com/photo-1622445268465-843d3876878b?w=800&auto=format&fit=crop&q=80', description: 'Fast 15W Qi-certified wireless phone charger.', stock: 30 },
  { id: 'e4', name: 'Aluminum Laptop Stand', category: 'Electronics', price: 1799, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80', description: 'Ergonomic aluminum laptop riser for improved posture.', stock: 20 },
  { id: 'e5', name: 'Slim Magnetic Power Bank', category: 'Electronics', price: 1999, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80', description: '10,000mAh magnetic portable charger.', stock: 25 }
];

export default function Product() {
  const { id } = useParams();
  const { add } = useCart();
  const { user } = useAuth();
  const userKey = user?.email ? `fav_${user.email.toLowerCase()}` : 'fav_guest';

  // EXACT DYNAMIC LOOKUP BY URL PARAMETER ID
  const [p, setP] = useState(() => {
    return catalog30.find(item => 
      String(item.id).toLowerCase() === String(id).toLowerCase() || 
      String(item._id).toLowerCase() === String(id).toLowerCase()
    ) || null;
  });

  const [q, setQ] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const [addedMsg, setAddedMsg] = useState(false);

  useEffect(() => {
    // 1. Search local catalog by parameter ID
    const found = catalog30.find(item => 
      String(item.id).toLowerCase() === String(id).toLowerCase() || 
      String(item._id).toLowerCase() === String(id).toLowerCase()
    );
    if (found) setP(found);

    // 2. Fetch API if available
    api.get(`/products/${id}`)
      .then(r => { if (r.data?._id || r.data?.id) setP(r.data); })
      .catch(() => {});

    // Favorite status
    const favs = JSON.parse(localStorage.getItem(userKey) || '[]');
    setIsFav(favs.some(item => String(item._id || item.id).toLowerCase() === String(id).toLowerCase()));
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