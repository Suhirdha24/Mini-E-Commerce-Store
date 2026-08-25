import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80';

export default function ProductCard({ p }) {
  const { add } = useCart();
  const { user } = useAuth();
  const productId = p.id || p._id;
  const [isFav, setIsFav] = useState(false);
  const [imgSrc, setImgSrc] = useState(p.image || FALLBACK_IMAGE);

  const userKey = user?.email ? `fav_${user.email.toLowerCase()}` : 'fav_guest';

  useEffect(() => {
    setImgSrc(p.image || FALLBACK_IMAGE);
    const favs = JSON.parse(localStorage.getItem(userKey) || '[]');
    setIsFav(favs.some(item => String(item.id || item._id).toLowerCase() === String(productId).toLowerCase()));
  }, [p.image, productId, userKey]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let favs = JSON.parse(localStorage.getItem(userKey) || '[]');
    if (isFav) {
      favs = favs.filter(item => String(item.id || item._id).toLowerCase() !== String(productId).toLowerCase());
    } else {
      favs.push(p);
    }
    localStorage.setItem(userKey, JSON.stringify(favs));
    setIsFav(!isFav);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  return (
    <article className="card" style={{ position: 'relative' }}>
      <button
        onClick={toggleFavorite}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.92)',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
          fontSize: '18px',
          color: isFav ? '#dc2626' : '#666'
        }}
      >
        {isFav ? '♥' : '♡'}
      </button>

      {/* DYNAMIC PRODUCT LINK + BROKEN IMAGE FALLBACK HANDLER */}
      <Link to={`/product/${productId}`}>
        <img 
          src={imgSrc} 
          alt={p.name} 
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          style={{ width: '100%', height: '240px', objectFit: 'cover' }}
        />
      </Link>
      
      <div className="card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="muted">{p.category}</div>
          {p.stock === 0 ? (
            <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700 }}>Out of Stock</span>
          ) : p.stock < 5 ? (
            <span style={{ fontSize: '11px', color: '#d97706', fontWeight: 700 }}>Only {p.stock} left!</span>
          ) : (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.stock} items left</span>
          )}
        </div>

        <h3 style={{ margin: '8px 0 12px' }}>{p.name}</h3>
        
        <div className="row">
          <b>₹{p.price?.toLocaleString('en-IN')}</b>
          <button disabled={p.stock === 0} onClick={() => add(p)}>
            {p.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
          </button>
        </div>
      </div>
    </article>
  );
}