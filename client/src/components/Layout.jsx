import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { safeGetJSON } from '../utils/storage';

export default function Layout() {
  const { user, logout } = useAuth();
  const { count, total } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [favCount, setFavCount] = useState(0);

  // Update favorites count dynamically
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

  const displayName = user?.name ? String(user.name).split(' ')[0] : 'Member';
  const initial = displayName ? displayName.charAt(0).toUpperCase() : 'U';

  return (
    <>
      {/* 1. TOP TICKER ANNOUNCEMENT BAR (Sable & Homedine Inspiration) */}
      <div className="top-ticker-bar">
        <div className="ticker-content">
          <span>Complimentary Express Shipping on Orders Over ₹1,999</span>
          <span className="ticker-dot">✦</span>
          <span>30-Day Effortless Concierge Returns</span>
          <span className="ticker-dot">✦</span>
          <span>100% Certified Artisan Crafted</span>
        </div>
        <div className="ticker-meta">
          <span>INDIA (INR ₹)</span>
          <span>ENGLISH</span>
        </div>
      </div>

      {/* 2. MAIN SITE NAVIGATION BAR */}
      <header className="site-header">
        {/* BRAND MARK */}
        <Link className="header-brand-wrap" to="/home">
          <span className="brand-title">NOVA</span>
          <span className="brand-tag">ATELIER</span>
        </Link>
        
        {/* NAV LINKS */}
        <nav className="main-nav">
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/shop">Shop All</NavLink>
          <NavLink to="/shop?cat=Bags">Bags</NavLink>
          <NavLink to="/shop?cat=Footwear">Footwear</NavLink>
          <NavLink to="/about">About & Craft</NavLink>
          {user && <NavLink to="/orders">My Orders</NavLink>}
        </nav>

        {/* PILL SEARCH BAR (Homedine & Nitec Inspiration) */}
        <form onSubmit={handleSearchSubmit} className="header-search-form">
          <span className="header-search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search our catalog..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="header-search-input"
          />
        </form>

        {/* HEADER ACTIONS */}
        <div className="header-actions">
          {/* WISHLIST BUTTON WITH LIVE BADGE */}
          <Link to="/favorites" className="icon-action-btn" title="Saved Favorites" aria-label="Favorites">
            <span>♡</span>
            {favCount > 0 && <span className="icon-badge">{favCount}</span>}
          </Link>

          {/* SHOPPING BAG PILL BUTTON */}
          <Link className="cart-pill-btn" to="/cart" title="View Shopping Bag">
            <span>Bag</span>
            <span style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '2px 8px', 
              borderRadius: '999px',
              fontSize: '11px' 
            }}>
              {count || 0}
            </span>
          </Link>

          {/* AUTHENTICATION / USER PROFILE */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/profile" className="user-account-badge" title="My Profile">
                <span className="user-avatar-circle">{initial}</span>
                <span>{displayName}</span>
              </Link>

              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  style={{ 
                    background: '#223f2f', 
                    color: '#c9e4d1', 
                    padding: '6px 12px', 
                    borderRadius: '20px', 
                    fontSize: '11.5px', 
                    fontWeight: 700, 
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  🛡️ Admin
                </Link>
              )}

              <button 
                onClick={handleLogout} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '12.5px', 
                  fontWeight: 600, 
                  color: '#dc2626', 
                  cursor: 'pointer',
                  padding: '4px 6px'
                }}
                title="Log out of account"
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/login" style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>
                Sign In
              </Link>
              <Link to="/register" style={{ 
                fontSize: '13px', 
                fontWeight: 600, 
                color: 'var(--text-main)', 
                border: '1px solid var(--border-light)', 
                padding: '6px 14px', 
                borderRadius: '20px',
                background: '#fff' 
              }}>
                Join
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* 3. PAGE MAIN CONTENT */}
      <main>
        <Outlet />
      </main>

      {/* 4. LUXURY FOOTER (Sable & Homedine Inspiration) */}
      <footer className="site-footer">
        <div className="footer-top-row">
          {/* BRAND STATEMENT & SOCIAL */}
          <div className="footer-brand-summary">
            <h2>NOVA ATELIER</h2>
            <p>
              Quiet luxury and intentional living. Thoughtfully curated essentials across leather craft, knit footwear, timeless apparel, and contemporary living spaces.
            </p>
            <div className="footer-social-icons">
              <a href="#instagram" className="footer-social-icon" aria-label="Instagram">IG</a>
              <a href="#pinterest" className="footer-social-icon" aria-label="Pinterest">PI</a>
              <a href="#twitter" className="footer-social-icon" aria-label="Twitter">TW</a>
              <a href="#facebook" className="footer-social-icon" aria-label="Facebook">FB</a>
            </div>
          </div>

          {/* COLUMN 1: COLLECTIONS */}
          <div className="footer-col">
            <h4>Collections</h4>
            <ul>
              <li><Link to="/shop?cat=Bags">Fine Leather Bags</Link></li>
              <li><Link to="/shop?cat=Footwear">Modern Footwear</Link></li>
              <li><Link to="/shop?cat=Accessories">Luxury Timepieces</Link></li>
              <li><Link to="/shop?cat=Apparel">Organic Cotton & Wool</Link></li>
              <li><Link to="/shop?cat=Home">Home & Ceramics</Link></li>
              <li><Link to="/shop?cat=Electronics">Acoustic Audio</Link></li>
            </ul>
          </div>

          {/* COLUMN 2: CONCIERGE */}
          <div className="footer-col">
            <h4>Concierge</h4>
            <ul>
              <li><Link to="/orders">Track My Order</Link></li>
              <li><Link to="/about">Shipping & Delivery</Link></li>
              <li><Link to="/about">30-Day Return Policy</Link></li>
              <li><Link to="/favorites">My Wishlist</Link></li>
              <li><Link to="/profile">Account Settings</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: SUSTAINABILITY */}
          <div className="footer-col">
            <h4>Ethics & Craft</h4>
            <ul>
              <li><Link to="/about">Material Provenance</Link></li>
              <li><Link to="/about">Artisan Partnerships</Link></li>
              <li><Link to="/about">Zero-Waste Commitment</Link></li>
              <li><Link to="/about">Sustainability Report</Link></li>
              <li><Link to="/about">Terms & Privacy</Link></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & PAYMENT BADGES */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-inner">
            <span>© {new Date().getFullYear()} NOVA ATELIER STORE. All rights reserved. Crafted with precision.</span>
            <div className="footer-payment-badges">
              <span title="UPI Accepted">⚡ UPI</span>
              <span title="Visa Cards">💳 Visa</span>
              <span title="Mastercard">Mastercard</span>
              <span title="RuPay">RuPay</span>
              <span title="Safe Checkout">🔒 256-Bit SSL</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}