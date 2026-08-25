import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header>
        <Link className="brand" to="/home">
          NOVA<span>STORE</span>
        </Link>
        
        <nav>
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/favorites">Favorites</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          {user && <NavLink to="/orders">My Orders</NavLink>}
        </nav>

        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {user ? (
            <>
              <span style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', color: 'var(--text-dark)' }}>
                Hi, {user.name?.split(' ')[0]}
              </span>

              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  style={{ 
                    background: '#1e293b', 
                    color: '#fff', 
                    padding: '6px 12px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  🛡️ Admin Portal
                </Link>
              )}

              <Link className="cart-btn" to="/cart">
                Bag ({count})
              </Link>
              <button 
                onClick={handleLogout} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  color: '#dc2626', 
                  cursor: 'pointer',
                  paddingLeft: '4px' 
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
              <Link className="cart-btn" to="/cart">
                Bag ({count})
              </Link>
            </>
          )}
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <div>NOVA STORE</div>
        <span>Modern Essentials. Simple Living. © 2026</span>
      </footer>
    </>
  );
}