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
          {user?.role === 'admin' && <NavLink to="/admin">Admin Portal</NavLink>}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Hi, {user.name?.split(' ')[0]}</span>
              <Link className="cart-btn" to="/cart">
                Bag ({count})
              </Link>
              {/* LOGOUT BUTTON WITH IMMEDIATE REDIRECT TO /LOGIN */}
              <button 
                onClick={handleLogout} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  color: 'var(--text-dark)', 
                  cursor: 'pointer',
                  paddingLeft: '6px' 
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