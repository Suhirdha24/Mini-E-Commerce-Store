import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { safeGetJSON, safeSetJSON } from '../utils/storage';

export default function Favorites() {
  const { user } = useAuth();
  const [favoriteItems, setFavoriteItems] = useState([]);

  // User storage key
  const userKey = user?.email ? `fav_${String(user.email).toLowerCase()}` : 'fav_guest';

  const loadFavorites = () => {
    const favs = safeGetJSON(userKey, []);
    setFavoriteItems(Array.isArray(favs) ? favs.filter(Boolean) : []);
  };

  useEffect(() => {
    loadFavorites();

    // Listen to favorite updates
    window.addEventListener('favoritesUpdated', loadFavorites);
    window.addEventListener('storage', loadFavorites);

    return () => {
      window.removeEventListener('favoritesUpdated', loadFavorites);
      window.removeEventListener('storage', loadFavorites);
    };
  }, [userKey]);

  const removeFav = (productId) => {
    const favs = favoriteItems.filter(item => item && String(item._id || item.id) !== String(productId));
    safeSetJSON(userKey, favs);
    setFavoriteItems(favs);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  return (
    <section className="page">
      <p className="eyebrow">SAVED ITEMS</p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '40px', marginBottom: '12px' }}>
        {user?.name ? `${user.name}'s Favorites` : 'Saved Favorites'}
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '36px' }}>Your favorite items saved permanently for your account.</p>

      {favoriteItems.length ? (
        <div className="grid">
          {favoriteItems.map((p) => (
            <div key={p._id || p.id} style={{ position: 'relative' }}>
              <ProductCard p={p} />
              <button
                onClick={() => removeFav(p._id || p.id)}
                style={{
                  marginTop: '8px',
                  width: '100%',
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '12px' }}>Your favorites list is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Click the heart (♡) icon on any product to save it to your account.</p>
          <Link className="primary" to="/shop">Explore Shop →</Link>
        </div>
      )}
    </section>
  );
}