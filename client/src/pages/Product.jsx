import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const catalog30 = [
  { id: 'b1', name: 'Essential Leather Tote', category: 'Bags', price: 2899, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', description: 'Structured daily tote crafted from premium leather, designed for work, travel, and everyday elegance.', stock: 15 },
  { id: 'b2', name: 'Everyday Canvas Backpack', category: 'Bags', price: 1999, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', description: 'Durable canvas backpack with laptop compartment and ergonomic straps.', stock: 14 },
  { id: 'b3', name: 'Minimal Crossbody Bag', category: 'Bags', price: 1799, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80', description: 'Compact crossbody bag for hands-free daily essentials.', stock: 20 },
  { id: 'f1', name: 'Aero Knit Sneakers', category: 'Footwear', price: 2499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', description: 'Minimalist everyday sneakers featuring breathable knit uppers and lightweight soles.', stock: 18 },
  { id: 'f2', name: 'Neutral Studio Sneakers', category: 'Footwear', price: 3499, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80', description: 'Chic pastels and supportive cushioning for all-day urban walking.', stock: 12 },
  { id: 'a1', name: 'Mono Chronograph Watch', category: 'Accessories', price: 3999, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', description: 'Clean chronograph watch with stainless steel case and leather strap.', stock: 12 },
  { id: 'a2', name: 'Classic Leather Wallet', category: 'Accessories', price: 999, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', description: 'Slim bifold wallet made with genuine full-grain leather.', stock: 20 },
  { id: 'c1', name: 'Essential Cotton Hoodie', category: 'Apparel', price: 1599, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80', description: 'Heavyweight organic cotton hoodie with a relaxed, comfortable fit.', stock: 30 },
  { id: 'h1', name: 'Contour Ceramic Lamp', category: 'Home', price: 2199, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', description: 'Sculptural ceramic lamp producing warm, ambient room illumination.', stock: 10 },
  { id: 'e1', name: 'Acoustic Wireless Headphones', category: 'Electronics', price: 4299, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', description: 'Over-ear wireless headphones with active noise cancellation and high-fidelity sound.', stock: 11 }
];

export default function Product() {
  const { id } = useParams();
  const { add } = useCart();
  const { user } = useAuth();

  const userKey = user?.email ? `fav_${user.email.toLowerCase()}` : 'fav_guest';

  const [p, setP] = useState(() => catalog30.find(item => item.id === id || item._id === id) || catalog30[0]);
  const [q, setQ] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const [addedMsg, setAddedMsg] = useState(false);

  useEffect(() => {
    // Look up in API or local catalog immediately
    api.get(`/products/${id}`)
      .then(r => { if (r.data) setP(r.data); })
      .catch(() => {
        const found = catalog30.find(item => item.id === id || item._id === id);
        if (found) setP(found);
      });

    const favs = JSON.parse(localStorage.getItem(userKey) || '[]');
    setIsFav(favs.some(item => (item._id || item.id) === id));
  }, [id, userKey]);

  const toggleFavorite = () => {
    if (!p) return;
    let favs = JSON.parse(localStorage.getItem(userKey) || '[]');
    const productId = p._id || p.id;
    if (isFav) {
      favs = favs.filter(item => (item._id || item.id) !== productId);
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
    setTimeout(() => setAddedMsg(false), 2500);
  };

  if (!p) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading product details...</div>;

  return (
    <section className="page" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <Link to="/shop" style={{ textDecoration: 'none', color: 'var(--text-muted)', marginBottom: '24px', display: 'inline-block' }}>
        ← Back to Shop
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
        <img src={p.image} alt={p.name} style={{ width: '100%', height: '480px', objectFit: 'cover', borderRadius: '14px', boxShadow: 'var(--shadow-md)' }} />
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="eyebrow">{p.category}</p>
            
            <button 
              onClick={toggleFavorite}
              style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: isFav ? '#dc2626' : '#666', fontWeight: 600 }}
            >
              {isFav ? '♥ Saved to Favorites' : '♡ Add to Favorites'}
            </button>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '42px', marginBottom: '16px' }}>{p.name}</h1>
          <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '20px' }}>₹{p.price?.toLocaleString('en-IN')}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.7, marginBottom: '28px' }}>{p.description || 'Thoughtfully crafted daily essential with modern aesthetic quality.'}</p>
          
          {addedMsg && (
            <div style={{ background: '#def7ec', color: '#03543f', padding: '12px 18px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: 600 }}>
              ✓ Added {q} item(s) to your Bag!
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <input 
              type="number" 
              min="1" 
              max={p.stock || 20} 
              value={q} 
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