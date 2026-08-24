import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';

export default function Product() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [q, setQ] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const { add } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => { if (r.data) setP(r.data); })
      .catch(() => {});
      
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFav(favs.some(item => (item._id || item.id) === id));
  }, [id]);

  const toggleFavorite = () => {
    if (!p) return;
    let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFav) {
      favs = favs.filter(item => (item._id || item.id) !== id);
    } else {
      favs.push(p);
    }
    localStorage.setItem('favorites', JSON.stringify(favs));
    setIsFav(!isFav);
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
            
            {/* HEART FAVORITE BUTTON */}
            <button 
              onClick={toggleFavorite}
              style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: isFav ? '#dc2626' : '#666' }}
            >
              {isFav ? '♥ Saved' : '♡ Add to Favorites'}
            </button>
          </div>

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