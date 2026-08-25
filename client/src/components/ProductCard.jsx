import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ p }) {
  const { add } = useCart();
  const { user } = useAuth();
  const productId = p._id || p.id;
  const [isFav, setIsFav] = useState(false);

  const userKey = user?.email ? `fav_${user.email.toLowerCase()}` : 'fav_guest';

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem(userKey) || '[]');
    setIsFav(favs.some(item => (item._id || item.id) === productId));
  }, [productId, userKey]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let favs = JSON.parse(localStorage.getItem(userKey) || '[]');
    if (isFav) {
      favs = favs.filter(item => (item._id || item.id) !== productId);
    } else {
      favs.push(p);
    }
    localStorage.setItem(userKey, JSON.stringify(favs));
    setIsFav(!isFav);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  return (
    <article className="card" style={{ position: 'relative' }}>
      {/* HEART FAVORITE BUTTON */}
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

      {/* DYNAMIC PRODUCT LINK FIX */}
      <Link to={`/product/${productId}`}>
        <img src={p.image} alt={p.name} />
      </Link>
      
      <div className="card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="muted">{p.category}</div>
          
          {/* STOCK VISIBILITY FEATURE */}
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