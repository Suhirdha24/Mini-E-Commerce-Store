import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const catalog30 = [
  { id: 'b1', name: 'Essential Leather Tote', category: 'Bags', price: 2899, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', description: 'Structured daily tote crafted from premium leather.', stock: 15 },
  { id: 'f1', name: 'Aero Knit Sneakers', category: 'Footwear', price: 2499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', description: 'Minimalist everyday sneakers featuring breathable knit uppers.', stock: 18 },
  { id: 'a1', name: 'Mono Chronograph Watch', category: 'Accessories', price: 3999, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', description: 'Clean chronograph watch with stainless steel case.', stock: 3 },
  { id: 'c1', name: 'Essential Cotton Hoodie', category: 'Apparel', price: 1599, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80', description: 'Heavyweight cotton hoodie with relaxed fit.', stock: 0 }
];

export default function Product() {
  const { id } = useParams();
  const { add } = useCart();
  const { user } = useAuth();
  const userKey = user?.email ? `fav_${user.email.toLowerCase()}` : 'fav_guest';

  const [p, setP] = useState(null);
  const [q, setQ] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const [addedMsg, setAddedMsg] = useState(false);

  useEffect(() => {
    // Search catalog by current URL parameter ID
    const found = catalog30.find(item => item.id === id || item._id === id);
    if (found) setP(found);

    api.get(`/products/${id}`)
      .then(r => { if (r.data) setP(r.data); })
      .catch(() => {});

    const favs = JSON.parse(localStorage.getItem(userKey) || '[]');
    setIsFav(favs.some(item => (item._id || item.id) === id));
  }, [id, userKey]);

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
            <button onClick={() => setIsFav(!isFav)} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}>
              {isFav ? '♥ Saved' : '♡ Favorite'}
            </button>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '42px', marginBottom: '12px' }}>{p.name}</h1>
          <p style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>₹{p.price?.toLocaleString('en-IN')}</p>
          
          {/* STOCK STATUS BADGE */}
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

          <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.7, marginBottom: '28px' }}>{p.description}</p>

          {addedMsg && (
            <div style={{ background: '#def7ec', color: '#03543f', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: 600 }}>
              ✓ Added {q} item(s) to your Bag!
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <input 
              type="number" 
              min="1" 
              max={p.stock} 
              value={q} 
              disabled={p.stock === 0}
              onChange={e => setQ(Math.max(1, Math.min(p.stock, +e.target.value)))} 
              style={{ width: '80px', textAlign: 'center' }} 
            />
            <button className="primary" disabled={p.stock === 0} onClick={() => { add(p, q); setAddedMsg(true); setTimeout(() => setAddedMsg(false), 2000); }} style={{ flex: 1 }}>
              {p.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}