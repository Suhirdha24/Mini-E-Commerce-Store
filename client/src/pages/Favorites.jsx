import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { safeGetJSON, safeSetJSON } from '../utils/storage';

export default function Favorites() {
  const { user } = useAuth();
  const [favoriteItems, setFavoriteItems] = useState([]);

  const userKey = user?.email ? `fav_${String(user.email).toLowerCase()}` : 'fav_guest';

  const loadFavorites = () => {
    const favs = safeGetJSON(userKey, []);
    setFavoriteItems(Array.isArray(favs) ? favs.filter(Boolean) : []);
  };

  useEffect(() => {
    loadFavorites();
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
      <h1 className="page-title">
        {user?.name ? `${user.name}'s Wishlist` : 'Saved Wishlist'}
      </h1>
      <p className="page-sub">
        Your saved items synced to your account.
      </p>

      {favoriteItems.length ? (
        <div className="product-grid">
          {favoriteItems.map((p) => (
            <div key={p._id || p.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <ProductCard p={p} />
              <button
                onClick={() => removeFav(p._id || p.id)}
                style={{
                  marginTop: '8px',
                  width: '100%',
                  background: '#FEE2E2',
                  color: '#DC2626',
                  border: 'none',
                  padding: '7px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Your wishlist is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '13.5px' }}>Click the heart icon on any product to save it here.</p>
          <Link className="primary" to="/shop">Explore Products</Link>
        </div>
      )}
    </section>
  );
}