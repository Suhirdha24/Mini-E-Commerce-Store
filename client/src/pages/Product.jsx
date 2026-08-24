import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';

const fallbackProducts = {
  '1': { _id: '1', name: 'Essential Leather Tote', category: 'Bags', price: 2899, description: 'Structured daily tote crafted from premium leather, designed for work, travel, and everyday elegance.', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80', stock: 15 },
  '2': { _id: '2', name: 'Aero Knit Sneakers', category: 'Footwear', price: 2499, description: 'Minimalist everyday sneakers featuring breathable knit uppers and lightweight cushioned soles.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop&q=80', stock: 18 },
  '3': { _id: '3', name: 'Mono Chronograph Watch', category: 'Accessories', price: 3999, description: 'Clean chronograph watch with a modern stainless steel case and genuine leather strap.', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&auto=format&fit=crop&q=80', stock: 12 }
};

export default function Product() {
  const { id } = useParams();
  const [p, setP] = useState(fallbackProducts[id] || null);
  const [q, setQ] = useState(1);
  const { add } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => { if (r.data) setP(r.data); })
      .catch(() => {});
  }, [id]);

  if (!p) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading product details...</div>;

  return (
    <section className="page" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <Link to="/shop" style={{ textDecoration: 'none', color: 'var(--text-muted)', marginBottom: '24px', display: 'inline-block' }}>
        ← Back to Shop
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
        <img src={p.image} alt={p.name} style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '14px', boxShadow: 'var(--shadow-md)' }} />
        
        <div>
          <p className="eyebrow">{p.category}</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '42px', marginBottom: '16px' }}>{p.name}</h1>
          <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '20px' }}>₹{p.price?.toLocaleString('en-IN')}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.7, marginBottom: '28px' }}>{p.description}</p>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <input type="number" min="1" max={p.stock} value={q} onChange={e => setQ(Math.max(1, Math.min(p.stock, +e.target.value)))} style={{ width: '80px', textAlign: 'center' }} />
            <button className="primary" disabled={!p.stock} onClick={() => add(p, q)} style={{ flex: 1 }}>
              {p.stock ? 'Add to Bag' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}