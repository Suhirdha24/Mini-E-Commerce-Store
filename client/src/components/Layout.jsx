import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { safeGetJSON } from '../utils/storage';
import { SearchIcon, CartIcon, UserIcon, HeartIcon } from './Icons';

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
      {/* CLEAN APP HEADER */}
      <header className="app-header">
        <div className="header-inner">
          {/* BRAND */}
          <Link className="header-brand" to="/home">
            <span>NOVA</span>
            <span className="header-brand-badge">Store</span>
          </Link>

          {/* MAIN NAV */}
          <nav className="header-nav">
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/shop">Shop All</NavLink>
            <NavLink to="/shop?cat=Electronics">Electronics</NavLink>
            <NavLink to="/shop?cat=Apparel">Apparel</NavLink>
            <NavLink to="/shop?cat=Footwear">Footwear</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>

          {/* SEARCH INPUT */}
          <form onSubmit={handleSearchSubmit} className="header-search-wrap">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="header-search-input"
            />
            <button type="submit" className="header-search-icon-btn" aria-label="Search">
              <SearchIcon size={16} />
            </button>
          </form>

          {/* HEADER ACTIONS */}
          <div className="header-actions">
            {/* WISHLIST */}
            <Link to="/favorites" className="header-action-btn" title="Saved Wishlist">
              <HeartIcon size={18} />
              {favCount > 0 && <span className="cart-count-badge">{favCount}</span>}
            </Link>

            {/* USER ACCOUNT */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/profile" className="header-action-btn">
                  <UserIcon size={18} />
                  <span>{displayName}</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    style={{ 
                      background: 'var(--primary)', 
                      color: '#fff', 
                      padding: '2px 8px', 
                      borderRadius: 'var(--radius-sm)', 
                      fontSize: '11px', 
                      fontWeight: 600 
                    }}
                  >
                    Admin
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="header-action-btn">
                <UserIcon size={18} />
                <span>Sign In</span>
              </Link>
            )}

            {/* CART */}
            <Link to="/cart" className="header-action-btn">
              <CartIcon size={18} />
              <span>Cart</span>
              {count > 0 && <span className="cart-count-badge">{count}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN VIEW */}
      <main>
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>NOVA</h3>
            <p>
              Contemporary essentials across modern electronics, curated apparel, footwear, and lifestyle goods.
            </p>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/shop?cat=Electronics">Electronics & Audio</Link></li>
              <li><Link to="/shop?cat=Apparel">Clothing & Apparel</Link></li>
              <li><Link to="/shop?cat=Footwear">Footwear & Sneakers</Link></li>
              <li><Link to="/shop?cat=Accessories">Accessories</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Customer Support</h4>
            <ul>
              <li><Link to="/orders">Track Order</Link></li>
              <li><Link to="/about">Shipping & Delivery</Link></li>
              <li><Link to="/about">Returns & Exchanges</Link></li>
              <li><Link to="/favorites">Wishlist</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/about">Privacy Policy</Link></li>
              <li><Link to="/about">Terms of Service</Link></li>
              <li><Link to="/profile">My Account</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} NOVA Store. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>UPI</span>
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Net Banking</span>
          </div>
        </div>
      </footer>
    </>
  );
}