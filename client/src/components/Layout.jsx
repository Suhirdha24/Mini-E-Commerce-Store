import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { safeGetJSON } from '../utils/storage';
import { SearchIcon, CartIcon, UserIcon, HeartIcon, MenuIcon, CloseIcon, ShieldIcon } from './Icons';

export default function Layout() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [favCount, setFavCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    setMobileOpen(false);
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    } else {
      navigate('/shop');
      setMobileOpen(false);
    }
  };

  const displayName = user?.name ? String(user.name).split(' ')[0] : 'Account';

  return (
    <>
      {/* TWO-TIER MODERN HEADER */}
      <header className="app-header">
        {/* TOP MAIN HEADER */}
        <div className="header-top">
          <div className="header-top-inner">
            {/* MOBILE MENU TOGGLE */}
            <button 
              className="mobile-menu-btn" 
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
            </button>

            {/* BRAND LOGO */}
            <Link className="header-brand" to="/home">
              <span>NOVA</span>
              <span className="header-brand-badge">Store</span>
            </Link>

            {/* EXPANSIVE CENTER SEARCH BAR */}
            <form onSubmit={handleSearchSubmit} className="header-search-wrap">
              <input 
                type="text" 
                placeholder="Search premium audio, bags, footwear, accessories..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="header-search-input"
              />
              <button type="submit" className="header-search-icon-btn" aria-label="Search">
                <SearchIcon size={16} />
              </button>
            </form>

            {/* ACTION ICONS */}
            <div className="header-actions">
              {/* WISHLIST */}
              <Link to="/favorites" className="header-action-btn" title="Saved Wishlist">
                <HeartIcon size={19} />
                <span style={{ display: 'none' }}>Wishlist</span>
                {favCount > 0 && <span className="badge-count">{favCount}</span>}
              </Link>

              {/* CART */}
              <Link to="/cart" className="header-action-btn" title="Shopping Cart">
                <CartIcon size={19} />
                <span>Cart</span>
                {count > 0 && <span className="badge-count">{count}</span>}
              </Link>

              {/* USER / AUTH */}
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link to="/profile" className="header-action-btn">
                    <UserIcon size={19} />
                    <span>{displayName}</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: '#0F172A', 
                        color: '#FFFFFF', 
                        padding: '4px 10px', 
                        borderRadius: 'var(--radius-xs)', 
                        fontSize: '11px', 
                        fontWeight: 700 
                      }}
                      title="Admin Management Console"
                    >
                      <ShieldIcon size={12} />
                      Admin
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout} 
                    style={{ background: 'none', border: 'none', color: 'var(--accent-red)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: '4px 8px' }}
                  >
                    Exit
                  </button>
                </div>
              ) : (
                <Link to="/login" className="header-action-btn">
                  <UserIcon size={19} />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* SECONDARY SUB-NAVIGATION BAR */}
        <div className="header-subnav">
          <div className="header-subnav-inner">
            <nav className="subnav-links">
              <NavLink to="/home">Home</NavLink>
              <NavLink to="/shop">Shop All</NavLink>
              <NavLink to="/shop?sort=deals">Today's Deals</NavLink>
              <NavLink to="/shop?sort=new">New Arrivals</NavLink>
              <NavLink to="/shop?sort=best">Best Sellers</NavLink>
              <NavLink to="/shop?cat=Electronics">Electronics</NavLink>
              <NavLink to="/shop?cat=Bags">Bags</NavLink>
              <NavLink to="/shop?cat=Footwear">Footwear</NavLink>
              <NavLink to="/shop?cat=Accessories">Accessories</NavLink>
              <NavLink to="/about">About Us</NavLink>
            </nav>

            <div className="subnav-promo">
              Free Express Shipping on orders over <strong>₹1,999</strong>
            </div>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {mobileOpen && (
          <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 40px 10px 14px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
              />
              <button type="submit" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none' }}>
                <SearchIcon size={16} />
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', fontWeight: 500 }}>
              <Link to="/home" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/shop" onClick={() => setMobileOpen(false)}>Shop All Catalog</Link>
              <Link to="/shop?sort=deals" onClick={() => setMobileOpen(false)}>Today's Deals</Link>
              <Link to="/shop?cat=Electronics" onClick={() => setMobileOpen(false)}>Electronics</Link>
              <Link to="/shop?cat=Bags" onClick={() => setMobileOpen(false)}>Bags</Link>
              <Link to="/shop?cat=Footwear" onClick={() => setMobileOpen(false)}>Footwear</Link>
              <Link to="/shop?cat=Accessories" onClick={() => setMobileOpen(false)}>Accessories</Link>
              <Link to="/favorites" onClick={() => setMobileOpen(false)}>Saved Wishlist ({favCount})</Link>
              <Link to="/orders" onClick={() => setMobileOpen(false)}>My Orders</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT OUTLET */}
      <main>
        <Outlet />
      </main>

      {/* PROFESSIONAL FOOTER */}
      <footer className="app-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>NOVA STORE</h3>
              <p>
                Crafted for modern everyday utility. Discover precision audio, technical apparel, and durable essentials built for longevity.
              </p>
            </div>

            <div className="footer-col">
              <h4>Shop Catalog</h4>
              <ul>
                <li><Link to="/shop?cat=Electronics">Electronics & Audio</Link></li>
                <li><Link to="/shop?cat=Bags">Bags & Carry</Link></li>
                <li><Link to="/shop?cat=Footwear">Footwear & Sneakers</Link></li>
                <li><Link to="/shop?cat=Accessories">Accessories</Link></li>
                <li><Link to="/shop?sort=deals">Special Offers</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Customer Support</h4>
              <ul>
                <li><Link to="/orders">Track My Order</Link></li>
                <li><Link to="/orders">Order History & Returns</Link></li>
                <li><Link to="/checkout">Shipping Guidelines</Link></li>
                <li><Link to="/about">About NOVA</Link></li>
                <li><Link to="/about">Contact Support</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Account & Services</h4>
              <ul>
                <li><Link to="/profile">My Account</Link></li>
                <li><Link to="/favorites">Wishlist</Link></li>
                <li><Link to="/cart">View Cart</Link></li>
                <li><Link to="/admin-login">Admin Portal</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} NOVA Store. All rights reserved.</span>
            <span>Premium E-Commerce Experience • Powered by MERN Stack</span>
          </div>
        </div>
      </footer>
    </>
  );
}