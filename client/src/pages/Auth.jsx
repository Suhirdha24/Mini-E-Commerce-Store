import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
      setF({ ...f, email: 'member@novastudio.com', password: 'Password@123' });
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
    ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80';

  return (
    <section className="bento-auth-container">
      <div className="bento-auth-card">
        {/* LEFT COLUMN: EDITORIAL PHOTO & MEMBER PERKS */}
        <div className="bento-auth-image-col">
          <img 
            src={photoBg} 
            alt="NOVA Gear Aesthetics" 
            className="bento-auth-image-bg" 
          />
          <div className="bento-auth-overlay"></div>

          {/* TOP BADGE */}
          <div className="bento-auth-top-badge">
            <span>{isAdminLogin ? '✦ NOVA RETAILER PORTAL' : '✦ NOVA STUDIO ACCESS'}</span>
          </div>

          {/* BOTTOM GLASS CARD */}
          <div className="bento-auth-bottom-info">
            <p className="bento-auth-quote">
              {isAdminLogin 
                ? '“Unified merchant command console for catalog control, inventory management, and telemetry.”'
                : '“Experience spatial acoustics, technical streetwear, and progressive hardware gear.”'}
            </p>
            <ul className="bento-auth-perks">
              {isAdminLogin ? (
                <>
                  <li>✓ Real-time inventory & price updates</li>
                  <li>✓ Instant order status fulfillment tracking</li>
                  <li>✓ High-security encrypted session</li>
                </>
              ) : (
                <>
                  <li>✓ Express priority dispatch on limited drops</li>
                  <li>✓ Wishlist & cart synced across all devices</li>
                  <li>✓ 30-day effortless return privilege</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN / REGISTER FORM */}
        <div className="bento-auth-form-col">
          <div className="bento-auth-header">
            <span className="eyebrow">{isAdminLogin ? 'ADMINISTRATION' : 'MEMBER PORTAL'}</span>
            <h1 className="bento-auth-title">
              {isAdminLogin ? 'Admin Sign In' : isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="bento-auth-subtitle">
              {isAdminLogin 
                ? 'Enter authorized store administrator credentials below.'
                : isLogin 
                  ? 'Sign in to access your saved bag, wishlist, and orders.'
                  : 'Join NOVA STUDIO to unlock exclusive gear releases.'}
            </p>
          </div>

          {/* DEMO FILL QUICK BUTTON */}
          <div>
            <button 
              type="button" 
              onClick={handleFillDemo} 
              className="bento-demo-pill-btn"
              title="Click to quickly fill demo login"
            >
              <span>⚡</span>
              <span>{isAdminLogin ? 'Auto-Fill Demo Admin' : 'Auto-Fill Demo Credentials'}</span>
            </button>
          </div>

          {/* SUCCESS MESSAGE */}
          {msg && (
            <div style={{ background: '#DEF7EC', color: '#03543F', padding: '12px 16px', borderRadius: '10px', fontSize: '13.5px', marginBottom: '16px', fontWeight: 600 }}>
              ✓ {msg}
            </div>
          )}

          {/* ERROR ALERT */}
          {err && (
            <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '12px 16px', borderRadius: '10px', fontSize: '13.5px', marginBottom: '16px', fontWeight: 600 }}>
              ⚠️ {err}
            </div>
          )}

          <form onSubmit={submit}>
            {/* NAME FIELD (REGISTER ONLY) */}
            {!isLogin && (
              <div className="bento-auth-input-group">
                <label className="bento-auth-label">
                  <span>Full Name</span>
                </label>
                <div className="bento-auth-input-wrap">
                  <input
                    type="text"
                    placeholder="Alex Rivera"
                    required
                    value={f.name}
                    onChange={(e) => setF({ ...f, name: e.target.value })}
                    className="bento-auth-input"
                  />
                </div>
              </div>
            )}

            {/* EMAIL FIELD */}
            <div className="bento-auth-input-group">
              <label className="bento-auth-label">
                <span>{isAdminLogin ? 'Merchant Admin Email' : 'Email Address'}</span>
              </label>
              <div className="bento-auth-input-wrap">
                <input
                  type="email"
                  placeholder={isAdminLogin ? "admin@ministore.com" : "you@example.com"}
                  required
                  value={f.email}
                  onChange={(e) => setF({ ...f, email: e.target.value })}
                  className="bento-auth-input"
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div className="bento-auth-input-group">
              <label className="bento-auth-label">
                <span>Password</span>
                {isLogin && !isAdminLogin && (
                  <span style={{ fontSize: '12px', color: 'var(--bento-blue)', cursor: 'pointer', fontWeight: 600 }}>
                    Forgot?
                  </span>
                )}
              </label>
              <div className="bento-auth-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  minLength="6"
                  required
                  value={f.password}
                  onChange={(e) => setF({ ...f, password: e.target.value })}
                  className="bento-auth-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="bento-auth-eye-btn"
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              type="submit" 
              className="bento-auth-submit-btn" 
              disabled={loading}
            >
              {loading 
                ? 'Authenticating...' 
                : isAdminLogin 
                  ? 'Sign In to Admin Portal →' 
                  : isLogin 
                    ? 'Sign In to Account →' 
                    : 'Create My Account →'}
            </button>
          </form>

          {/* FOOTER SWITCHERS */}
          <div className="bento-auth-footer-links">
            {isAdminLogin ? (
              <Link to="/login" className="bento-auth-switch-link">
                ← Return to Customer Sign In
              </Link>
            ) : isLogin ? (
              <>
                <div>
                  New to NOVA?{' '}
                  <Link to="/register" className="bento-auth-switch-link">
                    Create an account
                  </Link>
                </div>

                <div className="bento-auth-admin-box">
                  <span>Are you a Store Admin / Retailer?</span>
                  <Link to="/admin-login" className="bento-auth-admin-link">
                    Admin Portal →
                  </Link>
                </div>
              </>
            ) : (
              <div>
                Already have an account?{' '}
                <Link to="/login" className="bento-auth-switch-link">
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