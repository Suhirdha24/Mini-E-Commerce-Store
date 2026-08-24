import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <>
      <header>
        <Link className="brand" to="/">
          NOVA<span>STORE</span>
        </Link>
        
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/favorites">Favorites</NavLink>
          {user && <NavLink to="/orders">My Orders</NavLink>}
          <NavLink to="/admin">Admin Portal</NavLink>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Hi, {user.name?.split(' ')[0]}</span>
              <button className="link-btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          <Link className="cart-btn" to="/cart">
            Bag ({count})
          </Link>
        </div>
      </header>

      <main>{children}</main>

      <footer>
        <div>NOVA STORE</div>
        <span>Modern Essentials. Simple Living. © 2026</span>
      </footer>
    </>
  );
}