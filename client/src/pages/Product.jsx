import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getStoredProducts } from '../data/initialProducts';
import { safeGetJSON, safeSetJSON } from '../utils/storage';

const getProductById = (targetId) => {
  const allProds = getStoredProducts() || [];
  if (!allProds.length) return null;
  if (!targetId) return allProds[0];
  const cleanId = String(targetId).trim().toLowerCase();
  return allProds.find(item => 
    item && (
      String(item.id || item._id).trim().toLowerCase() === cleanId ||
      (item.name && item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(cleanId))
    )
  ) || allProds[0];
};

export default function Product() {
  const { id } = useParams();
  const { add } = useCart();
  const { user } = useAuth();
  const userKey = user?.email ? `fav_${String(user.email).toLowerCase()}` : 'fav_guest';

  const [p, setP] = useState(() => getProductById(id));
  const [q, setQ] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const [addedMsg, setAddedMsg] = useState(false);

  useEffect(() => {
    const updateProduct = () => {
      const item = getProductById(id);
      if (item) setP(item);
    };

    updateProduct();

    window.addEventListener('productsUpdated', updateProduct);
    window.addEventListener('storage', updateProduct);

    const favs = safeGetJSON(userKey, []);
    if (Array.isArray(favs)) {
      setIsFav(favs.some(item => item && String(item.id || item._id).toLowerCase() === String(id).toLowerCase()));
    }

    return () => {
      window.removeEventListener('productsUpdated', updateProduct);
      window.removeEventListener('storage', updateProduct);
    };
  }, [id, userKey]);

  const toggleFavorite = () => {
    if (!p) return;
    let favs = safeGetJSON(userKey, []);
    if (!Array.isArray(favs)) favs = [];
    const pId = p._id || p.id;
    if (isFav) {
      favs = favs.filter(item => item && String(item._id || item.id).toLowerCase() !== String(pId).toLowerCase());
    } else {
      favs.push(p);
    }
    safeSetJSON(userKey, favs);
    setIsFav(!isFav);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const handleAddToCart = () => {
    add(p, q);
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };

  if (!p) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', fontSize: '18px' }}>
        <h2>Product not found</h2>
        <Link to="/shop" className="primary" style={{ display: 'inline-block', marginTop: '16px' }}>Back to Shop</Link>
      </div>
    );
  }

  const price = Number(p.price || p.salePrice || p.regularPrice || 0);

  return (
    <section className="page" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <Link to="/shop" style={{ textDecoration: 'none', color: 'var(--text-muted)', marginBottom: '24px', display: 'inline-block', fontWeight: 600 }}>
        ← Back to Shop
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
        <img src={p.image} alt={p.name} style={{ width: '100%', height: '480px', objectFit: 'cover', borderRadius: '14px', boxShadow: 'var(--shadow-md)' }} />
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="eyebrow">{p.category || 'Collection'}</p>
            
            <button 
              onClick={toggleFavorite}
              style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: isFav ? '#dc2626' : '#666', fontWeight: 600 }}
            >
              {isFav ? '♥ Saved to Favorites' : '♡ Add to Favorites'}
            </button>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '42px', marginBottom: '12px' }}>{p.name}</h1>
          <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px' }}>₹{price.toLocaleString('en-IN')}</p>

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