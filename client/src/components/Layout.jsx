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

  const displayName = user?.name ? String(user.name).split(' ')[0] : 'Member';
  const initial = displayName ? displayName.charAt(0).toUpperCase() : 'M';

  return (
    <>
      {/* 1. SABLE TOP ANNOUNCEMENT BAR */}
      <div className="sable-announcement-bar">
        <div className="sable-announcement-text">
          FREE SHIPPING OVER ₹1,999 — RETURNS WITHIN 30 DAYS
        </div>
        <div className="sable-announcement-meta">
          <span>English ▾</span>
          <span>INR ₹ ▾</span>
        </div>
      </div>

      {/* 2. SABLE CENTERED LUXURY HEADER */}
      <header className="sable-header">
        {/* LEFT NAVIGATION LINKS */}
        <nav className="sable-nav-left">
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/shop?cat=Apparel">Clothing</NavLink>
          <NavLink to="/shop?cat=Bags">Bags</NavLink>
          <NavLink to="/shop?cat=Footwear">Shoes</NavLink>
          <NavLink to="/shop?cat=Accessories">Accessories</NavLink>
          <NavLink to="/shop">Shop All</NavLink>
        </nav>

        {/* CENTER LOGO */}
        <div className="sable-logo-center">
          <Link to="/home" style={{ textDecoration: 'none' }}>
            <span className="sable-logo-text">SABLE</span>
          </Link>
        </div>

        {/* RIGHT HEADER ACTIONS */}
        <div className="sable-header-right">
          {/* SEARCH PILL */}
          <form onSubmit={handleSearchSubmit} className="sable-search-wrap">
            <span className="sable-search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sable-search-input"
            />
          </form>

          {/* WISHLIST HEART WITH LIVE COUNT */}
          <Link to="/favorites" className="sable-icon-btn" title="Saved Favorites" aria-label="Favorites">
            <span>♡</span>
            {favCount > 0 && <span className="sable-badge-count">{favCount}</span>}
          </Link>

          {/* SHOPPING BAG */}
          <Link to="/cart" className="sable-cart-link" title="Shopping Bag">
            <span>Bag</span>
            <span style={{ 
              background: 'rgba(255,255,255,0.22)', 
              padding: '1px 7px', 
              borderRadius: '999px',
              fontSize: '11px' 
            }}>
              {count || 0}
            </span>
          </Link>

          {/* USER AUTH / PROFILE */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                <span style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: 'var(--sable-text-dark)', 
                  color: '#fff', 
                  display: 'grid', 
                  placeItems: 'center',
                  fontSize: '10.5px' 
                }}>
                  {initial}
                </span>
                <span>{displayName}</span>
              </Link>

              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  style={{ 
                    background: 'var(--sable-text-dark)', 
                    color: 'var(--sable-gold)', 
                    padding: '4px 10px', 
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
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: '#dc2626', 
                  cursor: 'pointer' 
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="sable-auth-link">
              Login
            </Link>
          )}
        </div>
      </header>

      {/* 3. MAIN OUTLET */}
      <main>
        <Outlet />
      </main>

      {/* 4. SABLE LUXURY MINIMALIST FOOTER */}
      <footer className="sable-footer">
        <div className="sable-footer-grid">
          {/* BRAND MANIFESTO */}
          <div className="sable-footer-brand">
            <h2>SABLE</h2>
            <p>
              Quiet luxury, loudly considered. Curated collections of enduring clothing, leather goods, and statement accessories for the mindful wardrobe.
            </p>
          </div>

          {/* COLLECTIONS */}
          <div className="sable-footer-col">
            <h4>Collections</h4>
            <ul>
              <li><Link to="/shop?cat=Apparel">Clothing & Knitwear</Link></li>
              <li><Link to="/shop?cat=Bags">Leather Goods & Totes</Link></li>
              <li><Link to="/shop?cat=Footwear">Handcrafted Footwear</Link></li>
              <li><Link to="/shop?cat=Accessories">Watches & Accents</Link></li>
              <li><Link to="/shop">New Arrivals</Link></li>
            </ul>
          </div>

          {/* CLIENT SERVICES */}
          <div className="sable-footer-col">
            <h4>Client Care</h4>
            <ul>
              <li><Link to="/orders">Order Tracking</Link></li>
              <li><Link to="/about">Shipping & Delivery</Link></li>
              <li><Link to="/about">Returns & Exchanges</Link></li>
              <li><Link to="/favorites">Wishlist</Link></li>
              <li><Link to="/profile">Personal Account</Link></li>
            </ul>
          </div>

          {/* THE ATELIER */}
          <div className="sable-footer-col">
            <h4>The Atelier</h4>
            <ul>
              <li><Link to="/about">Our Philosophy</Link></li>
              <li><Link to="/about">Material Provenance</Link></li>
              <li><Link to="/about">Artisan Standards</Link></li>
              <li><Link to="/about">Sustainability</Link></li>
              <li><Link to="/about">Privacy & Terms</Link></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="sable-footer-bottom">
          <div className="sable-footer-bottom-inner">
            <span>© {new Date().getFullYear()} SABLE. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
              <span>UPI</span>
              <span>•</span>
              <span>VISA</span>
              <span>•</span>
              <span>MASTERCARD</span>
              <span>•</span>
              <span>AMEX</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}