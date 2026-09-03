import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { safeGetJSON } from '../utils/storage';

export default function Layout() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [favCount, setFavCount] = useState(0);

  const updateFavCount = () => {
    const userKey = user?.email ? `fav_${String(user.email).toLowerCase()}` : 'fav_guest';
    const favs = safeGetJSON(userKey, []);
    setFavCount(Array.isArray(favs) ? favs.length : 0);
  };

  useEffect(() => {
    updateFavCount();
    const handleFavChange = () => updateFavCount();
    window.addEventListener('favoritesUpdated', handleFavChange);
    return () => window.removeEventListener('favoritesUpdated', handleFavChange);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  const displayName = user?.name ? String(user.name).split(' ')[0] : 'Account';

  return (
    <>
      {/* NOVA STUDIO HEADER */}
      <header className="bento-header">
        {/* BRAND LOGO */}
        <Link className="bento-brand" to="/home">
          <span className="bento-brand-name">NOVA</span>
          <span className="bento-brand-studio">STUDIO</span>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="bento-nav">
          <NavLink to="/home">New In</NavLink>
          <NavLink to="/shop?cat=Electronics">Tech</NavLink>
          <NavLink to="/shop?cat=Apparel">Streetwear</NavLink>
          <NavLink to="/shop?cat=Footwear">Footwear</NavLink>
          <NavLink to="/shop?cat=Accessories">Accessories</NavLink>
          <NavLink to="/shop">All</NavLink>
        </nav>

        {/* SEARCH PILL WITH LIVE BADGE */}
        <form onSubmit={handleSearchSubmit} className="bento-search-form">
          <input 
            type="text" 
            placeholder='Search "AirPods Max", "Tech Jacket"...' 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bento-search-input"
          />
          <div className="bento-search-right-badges">
            <span className="bento-live-badge">Live 3</span>
            <button type="submit" className="bento-search-icon" aria-label="Search">🔍</button>
          </div>
        </form>

        {/* RIGHT ACTIONS */}
        <div className="bento-header-actions">
          {/* WISHLIST */}
          <Link to="/favorites" className="bento-action-link" title="Wishlist">
            <span>♡</span>
            {favCount > 0 && <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--bento-blue)' }}>({favCount})</span>}
          </Link>

          {/* USER ACCOUNT */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/profile" className="bento-action-link">
                <span>👤</span>
                <span>{displayName}</span>
              </Link>
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  style={{ 
                    background: 'var(--bento-dark)', 
                    color: '#fff', 
                    padding: '3px 9px', 
                    borderRadius: '12px', 
                    fontSize: '11px', 
                    fontWeight: 700 
                  }}
                >
                  Admin
                </Link>
              )}
              <button 
                onClick={handleLogout} 
                style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="bento-action-link">
              Account
            </Link>
          )}

          {/* CART */}
          <Link to="/cart" className="bento-action-link" style={{ gap: '6px' }}>
            <span>Cart</span>
            <span className="bento-cart-badge">{count || 0}</span>
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main>
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bento-footer">
        <div className="bento-footer-inner">
          <div className="bento-footer-brand">
            <h3>NOVA STUDIO</h3>
            <p>
              Designing the future of modern gear. Spatial acoustics, high-performance streetwear, and next-generation lifestyle essentials.
            </p>
          </div>

          <div className="bento-footer-col">
            <h4>Catalog</h4>
            <ul>
              <li><Link to="/shop?cat=Electronics">Tech & Audio</Link></li>
              <li><Link to="/shop?cat=Apparel">Streetwear Apparel</Link></li>
              <li><Link to="/shop?cat=Footwear">Sneakers & Kicks</Link></li>
              <li><Link to="/shop?cat=Accessories">Hardware Accessories</Link></li>
            </ul>
          </div>

          <div className="bento-footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/orders">Order Tracking</Link></li>
              <li><Link to="/about">Delivery & Returns</Link></li>
              <li><Link to="/favorites">Wishlist Archive</Link></li>
              <li><Link to="/profile">Member Account</Link></li>
            </ul>
          </div>

          <div className="bento-footer-col">
            <h4>Studio</h4>
            <ul>
              <li><Link to="/about">Our Vision</Link></li>
              <li><Link to="/about">Sustainability</Link></li>
              <li><Link to="/about">Privacy & Security</Link></li>
              <li><Link to="/about">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="bento-footer-bottom">
          <span>© {new Date().getFullYear()} NOVA STUDIO. Built for the modern world.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>UPI</span>
            <span>•</span>
            <span>VISA</span>
            <span>•</span>
            <span>MASTERCARD</span>
            <span>•</span>
            <span>APPLE PAY</span>
          </div>
        </div>
      </footer>
    </>
  );
}