import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ p }) {
  const { add } = useCart();
  const { user } = useAuth();
  const productId = p._id || p.id;
  const [isFav, setIsFav] = useState(false);

  // Persistent key tied to user email
  const userKey = user?.email ? `fav_${user.email.toLowerCase()}` : 'fav_guest';

  const checkFav = () => {
    const favs = JSON.parse(localStorage.getItem(userKey) || '[]');
    setIsFav(favs.some(item => (item._id || item.id) === productId));
  };

  useEffect(() => {
    checkFav();
    window.addEventListener('favoritesUpdated', checkFav);
    return () => window.removeEventListener('favoritesUpdated', checkFav);
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

    // Dispatch event to update Favorites page instantly
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
        title={isFav ? "Remove from Favorites" : "Add to Favorites"}
      >
        {isFav ? '♥' : '♡'}
      </button>

      <Link to={`/products/${productId}`}>
        <img src={p.image} alt={p.name} />
      </Link>
      
      <div className="card-body">
        <div className="muted">{p.category}</div>
        <h3>{p.name}</h3>
        <div className="row">
          <b>₹{p.price?.toLocaleString('en-IN')}</b>
          <button disabled={!p.stock} onClick={() => add(p)}>
            {p.stock ? 'Add to Bag' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </article>
  );
}