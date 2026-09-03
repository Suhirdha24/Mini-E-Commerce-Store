import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeOffIcon, CheckIcon } from '../components/Icons';

export default function Auth({ mode = 'login' }) {
  const isAdminLogin = mode === 'admin-login';
  const isLogin = mode === 'login' || isAdminLogin;
  
  const loc = useLocation();
  const nav = useNavigate();
  const { login, register } = useAuth();
  
  const [f, setF] = useState({ 
    name: '', 
    email: isAdminLogin ? 'admin@ministore.com' : '', 
    password: isAdminLogin ? 'Admin@123' : '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg] = useState(loc.state?.msg || '');

  const handleFillDemo = () => {
    if (isAdminLogin) {
      setF({ ...f, email: 'admin@ministore.com', password: 'Admin@123' });
    } else {
      setF({ ...f, email: 'member@novastore.com', password: 'Password@123' });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(f);
        if (isAdminLogin || f.email.toLowerCase().includes('admin')) {
          nav('/admin');
        } else {
          nav('/home');
        }
      } else {
        await register(f);
        nav('/login', { state: { msg: 'Account created successfully! Please sign in below.' } });
      }
    } catch (x) {
      const errorText = x.response?.data?.message || x.message || 'Unable to connect to server. Please check your network connection.';
      setErr(errorText);
    } finally {
      setLoading(false);
    }
  };

  const photoBg = isAdminLogin
    ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80';

  return (
    <section className="auth-page-wrap">
      <div className="auth-split-card">
        {/* LEFT COLUMN: EDITORIAL PHOTO */}
        <div className="auth-image-col">
          <img 
            src={photoBg} 
            alt="NOVA Authentication" 
            className="auth-image-bg" 
          />
          <div className="auth-overlay"></div>

          <div className="auth-image-top">
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#93C5FD' }}>
              {isAdminLogin ? 'Merchant Console' : 'Member Access'}
            </span>
          </div>

          <div className="auth-image-bottom">
            <p style={{ fontSize: '13.5px', fontWeight: 500, lineHeight: 1.5, color: '#FFFFFF', marginBottom: '10px' }}>
              {isAdminLogin 
                ? 'Store management console for inventory control, order fulfillment, and metrics.'
                : 'Sign in to access your synchronized bag, wishlist, and order status tracking.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', color: '#CBD5E1' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckIcon size={14} /> Direct order tracking & live updates
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckIcon size={14} /> Secure encrypted authentication
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CLEAN BALANCED FORM */}
        <div className="auth-form-col">
          <div>
            <h1 className="auth-title">
              {isAdminLogin ? 'Admin Sign In' : isLogin ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="auth-sub">
              {isAdminLogin 
                ? 'Enter your store administrator credentials.'
                : isLogin 
                  ? 'Enter your account details below.'
                  : 'Join NOVA to track orders and save your wishlist.'}
            </p>
          </div>

          {/* DEMO FILL QUICK BUTTON */}
          <div style={{ marginBottom: '16px' }}>
            <button 
              type="button" 
              onClick={handleFillDemo} 
              style={{
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: 'var(--radius-pill)',
                padding: '5px 12px',
                fontSize: '11.5px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              {isAdminLogin ? 'Fill Demo Admin' : 'Fill Demo Account'}
            </button>
          </div>

          {/* MESSAGES */}
          {msg && (
            <div style={{ background: '#DEF7EC', color: '#03543F', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', fontWeight: 500 }}>
              {msg}
            </div>
          )}

          {err && (
            <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', fontWeight: 500 }}>
              {err}
            </div>
          )}

          <form onSubmit={submit}>
            {!isLogin && (
              <div className="auth-input-group">
                <label className="auth-label">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  required
                  value={f.name}
                  onChange={(e) => setF({ ...f, name: e.target.value })}
                />
              </div>
            )}

            <div className="auth-input-group">
              <label className="auth-label">
                {isAdminLogin ? 'Admin Email' : 'Email Address'}
              </label>
              <input
                type="email"
                placeholder={isAdminLogin ? "admin@ministore.com" : "you@example.com"}
                required
                value={f.email}
                onChange={(e) => setF({ ...f, email: e.target.value })}
              />
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  minLength="6"
                  required
                  value={f.password}
                  onChange={(e) => setF({ ...f, password: e.target.value })}
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-eye-btn"
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn" 
              disabled={loading}
            >
              {loading ? 'Authenticating...' : isAdminLogin ? 'Sign In to Admin' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* SWITCH LINKS */}
          <div className="auth-footer-links">
            {isAdminLogin ? (
              <Link to="/login" className="auth-link-highlight">
                Return to Customer Sign In
              </Link>
            ) : isLogin ? (
              <>
                <div>
                  Don't have an account?{' '}
                  <Link to="/register" className="auth-link-highlight">
                    Create account
                  </Link>
                </div>
                <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-color)', fontSize: '12px' }}>
                  Store Staff?{' '}
                  <Link to="/admin-login" className="auth-link-highlight">
                    Admin Portal
                  </Link>
                </div>
              </>
            ) : (
              <div>
                Already have an account?{' '}
                <Link to="/login" className="auth-link-highlight">
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}