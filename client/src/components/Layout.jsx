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
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);

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
      {/* SHOPCART HEADER */}
      <header className="shopcart-header">
        {/* LOGO: NOVA WITH CART ICON */}
        <Link className="shopcart-logo-wrap" to="/home">
          <span className="shopcart-logo-icon">🛒</span>
          <span className="shopcart-logo-text">NOVA</span>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="shopcart-nav">
          <div 
            className="shopcart-dropdown-wrap"
            onMouseEnter={() => setIsCatDropdownOpen(true)}
            onMouseLeave={() => setIsCatDropdownOpen(false)}
          >
            <button 
              type="button" 
              className="shopcart-dropdown-trigger"
              onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
            >
              Categories ▾
            </button>

            {isCatDropdownOpen && (
              <div className="shopcart-dropdown-menu">
                <Link to="/shop?cat=Electronics" onClick={() => setIsCatDropdownOpen(false)}>Electronics & Audio</Link>
                <Link to="/shop?cat=Bags" onClick={() => setIsCatDropdownOpen(false)}>Bags & Totes</Link>
                <Link to="/shop?cat=Footwear" onClick={() => setIsCatDropdownOpen(false)}>Footwear & Sneakers</Link>
                <Link to="/shop?cat=Accessories" onClick={() => setIsCatDropdownOpen(false)}>Accessories & Watches</Link>
                <Link to="/shop?cat=Apparel" onClick={() => setIsCatDropdownOpen(false)}>Apparel & Clothing</Link>
                <Link to="/shop?cat=Home" onClick={() => setIsCatDropdownOpen(false)}>Home & Living</Link>
              </div>
            )}
          </div>

          <NavLink to="/shop?offer=50">Deals</NavLink>
          <NavLink to="/shop?sort=newest">What's New</NavLink>
          <NavLink to="/about">Delivery</NavLink>
        </nav>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearchSubmit} className="shopcart-search-form">
          <input 
            type="text" 
            placeholder="Search Product" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="shopcart-search-input"
          />
          <button type="submit" className="shopcart-search-icon-btn" aria-label="Search">
            🔍
          </button>
        </form>

        {/* ACTIONS: ACCOUNT, FAVORITES & CART */}
        <div className="shopcart-actions">
          {/* FAVORITES */}
          <Link to="/favorites" className="shopcart-action-link" title="Wishlist">
            <span>♡</span>
            {favCount > 0 && <span className="shopcart-cart-count-pill">{favCount}</span>}
          </Link>

          {/* USER ACCOUNT */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/profile" className="shopcart-action-link">
                <span>👤</span>
                <span>{displayName}</span>
              </Link>
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  style={{ 
                    background: 'var(--sc-green-primary)', 
                    color: '#fff', 
                    padding: '3px 8px', 
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
            <Link to="/login" className="shopcart-action-link">
              <span>👤</span>
              <span>Account</span>
            </Link>
          )}

          {/* CART BUTTON */}
          <Link to="/cart" className="shopcart-action-link" style={{ gap: '6px' }}>
            <span>🛒</span>
            <span>Cart</span>
            {count > 0 && <span className="shopcart-cart-count-pill">{count}</span>}
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main>
        <Outlet />
      </main>

      {/* SHOPCART FOOTER */}
      <footer className="shopcart-footer">
        <div className="shopcart-footer-inner">
          <div className="shopcart-footer-brand">
            <h3>🛒 NOVA</h3>
            <p>
              Your everyday destination for premium audio, modern apparel, crafted footwear, and contemporary essentials.
            </p>
          </div>

          <div className="shopcart-footer-col">
            <h4>Department</h4>
            <ul>
              <li><Link to="/shop?cat=Electronics">Audio & Headphones</Link></li>
              <li><Link to="/shop?cat=Bags">Bags & Luggage</Link></li>
              <li><Link to="/shop?cat=Footwear">Shoes & Loafers</Link></li>
              <li><Link to="/shop?cat=Apparel">Fashion & Clothing</Link></li>
            </ul>
          </div>

          <div className="shopcart-footer-col">
            <h4>About Us</h4>
            <ul>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/about">Delivery Information</Link></li>
              <li><Link to="/about">Terms & Conditions</Link></li>
              <li><Link to="/about">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="shopcart-footer-col">
            <h4>Customer Care</h4>
            <ul>
              <li><Link to="/orders">Order Tracking</Link></li>
              <li><Link to="/favorites">My Wishlist</Link></li>
              <li><Link to="/profile">Account Settings</Link></li>
              <li><Link to="/cart">Shopping Bag</Link></li>
            </ul>
          </div>
        </div>

        <div className="shopcart-footer-bottom">
          <span>© {new Date().getFullYear()} NOVA Store. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>UPI</span>
            <span>•</span>
            <span>Cards</span>
            <span>•</span>
            <span>NetBanking</span>
            <span>•</span>
            <span>Cash on Delivery</span>
          </div>
        </div>
      </footer>
    </>
  );
}