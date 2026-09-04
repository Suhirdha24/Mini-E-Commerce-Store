import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeOffIcon, CheckIcon, ShieldIcon } from '../components/Icons';

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

  const handleFillCustomerDemo = () => {
    setF({ name: 'Demo Customer', email: 'customer@novastore.com', password: 'Customer@123' });
    setErr('');
  };

  const handleFillAdminDemo = () => {
    setF({ name: 'Store Admin', email: 'admin@ministore.com', password: 'Admin@123' });
    setErr('');
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
    ? 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1000&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80';

  return (
    <div className="auth-page-wrap">
      <div className="auth-split-card">
        {/* LEFT COLUMN: EDITORIAL PHOTO */}
        <div className="auth-image-col">
          <img 
            src={photoBg} 
            alt="NOVA Lifestyle" 
            className="auth-image-bg" 
          />
          <div className="auth-overlay"></div>

          <div className="auth-image-top">
            <span style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '11px', 
              fontWeight: 700, 
              letterSpacing: '0.08em', 
              textTransform: 'uppercase', 
              color: '#FFFFFF' 
            }}>
              {isAdminLogin ? 'Merchant Console' : 'NOVA Membership'}
            </span>
          </div>

          <div className="auth-image-bottom">
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', lineHeight: 1.3 }}>
              {isAdminLogin ? 'Merchant Operations & Inventory Control' : 'Curated Essentials for Modern Living'}
            </h3>
            <p style={{ fontSize: '13px', fontWeight: 400, lineHeight: 1.6, color: '#E2E8F0', marginBottom: '16px' }}>
              {isAdminLogin 
                ? 'Authorized management console for real-time catalog adjustments, order dispatch, and warehouse stock tracking.'
                : 'Sign in to access your synchronized bag, saved wishlist items, and real-time order tracking.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#CBD5E1' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckIcon size={14} /> Direct order tracking with timeline updates
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckIcon size={14} /> Secure encrypted authentication protocol
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckIcon size={14} /> Priority member dispatch & customer care
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CLEAN BALANCED FORM */}
        <div className="auth-form-col">
          <div className="auth-header">
            <span className="eyebrow" style={{ color: 'var(--accent-blue)', marginBottom: '4px', display: 'block' }}>
              {isAdminLogin ? 'PORTAL ACCESS' : 'WELCOME TO NOVA'}
            </span>
            <h1 className="auth-title">
              {isAdminLogin ? 'Admin Sign In' : isLogin ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="auth-sub">
              {isAdminLogin 
                ? 'Enter authorized store administrator credentials.'
                : isLogin 
                  ? 'Access your orders, saved bag, and personal wishlist.'
                  : 'Join NOVA Store for seamless order tracking and member perks.'}
            </p>
          </div>

          {/* ONE-CLICK DEMO AUTO-FILL CHIPS */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
            {!isAdminLogin && (
              <button 
                type="button" 
                onClick={handleFillCustomerDemo} 
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-dark)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Demo Customer</span>
                <span style={{ color: 'var(--accent-blue)', fontSize: '11px' }}>(1-Click Fill)</span>
              </button>
            )}

            <button 
              type="button" 
              onClick={handleFillAdminDemo} 
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-pill)',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-dark)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ShieldIcon size={13} />
              <span>Demo Admin</span>
              <span style={{ color: 'var(--accent-blue)', fontSize: '11px' }}>(1-Click Fill)</span>
            </button>
          </div>

          {/* NOTIFICATION MESSAGES */}
          {msg && (
            <div style={{ background: 'var(--accent-green-bg)', color: 'var(--accent-green)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginBottom: '14px', fontWeight: 600 }}>
              {msg}
            </div>
          )}

          {err && (
            <div style={{ background: 'var(--accent-red-bg)', color: 'var(--accent-red)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginBottom: '14px', fontWeight: 600 }}>
              {err}
            </div>
          )}

          <form onSubmit={submit}>
            {!isLogin && (
              <div className="auth-input-group">
                <label className="auth-label">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
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
                placeholder={isAdminLogin ? "admin@ministore.com" : "customer@novastore.com"}
                required
                value={f.email}
                onChange={(e) => setF({ ...f, email: e.target.value })}
              />
            </div>

            <div className="auth-input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                <label className="auth-label" style={{ margin: 0 }}>Password</label>
                {isLogin && !isAdminLogin && (
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Min. 6 characters
                  </span>
                )}
              </div>
              <div className="auth-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  minLength="6"
                  required
                  value={f.password}
                  onChange={(e) => setF({ ...f, password: e.target.value })}
                  style={{ paddingRight: '42px' }}
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
              {loading 
                ? 'Authenticating...' 
                : isAdminLogin 
                  ? 'Sign In to Admin Portal' 
                  : isLogin 
                    ? 'Sign In to Account' 
                    : 'Create Account'}
            </button>
          </form>

          {/* FOOTER SWITCH LINKS */}
          <div className="auth-footer-links">
            {isAdminLogin ? (
              <div style={{ textAlign: 'center', paddingTop: '8px' }}>
                <Link to="/login" className="auth-link-highlight">
                  Return to Customer Sign In
                </Link>
              </div>
            ) : isLogin ? (
              <>
                <div style={{ textAlign: 'center' }}>
                  Don't have an account?{' '}
                  <Link to="/register" className="auth-link-highlight">
                    Create free account
                  </Link>
                </div>
                <div style={{ textAlign: 'center', paddingTop: '10px', borderTop: '1px solid var(--border)', fontSize: '12.5px' }}>
                  Store Staff or Manager?{' '}
                  <Link to="/admin-login" className="auth-link-highlight">
                    Admin Portal Sign In
                  </Link>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                Already have an account?{' '}
                <Link to="/login" className="auth-link-highlight">
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}