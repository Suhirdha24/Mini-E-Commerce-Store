import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeOffIcon, CheckIcon, ShieldIcon, UserIcon, LockIcon } from '../components/Icons';

export default function Auth({ mode = 'login' }) {
  const isAdminLogin = mode === 'admin-login';
  const isLogin = mode === 'login' || isAdminLogin;
  
  const loc = useLocation();
  const nav = useNavigate();
  const { login, register } = useAuth();
  
  const [f, setF] = useState({ 
    name: '', 
    email: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg] = useState(loc.state?.msg || '');

  // Reset form inputs whenever navigating between sign in and register
  useEffect(() => {
    setF({ name: '', email: '', password: '' });
    setErr('');
    setShowPassword(false);
  }, [mode, loc.pathname]);

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
      const errorText = x.response?.data?.message || x.message || 'Unable to connect to server. Please check your credentials.';
      setErr(errorText);
    } finally {
      setLoading(false);
    }
  };

  const photoBg = isAdminLogin
    ? 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1000&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80';

  return (
    <div className="container page" style={{ minHeight: 'calc(100vh - 140px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 0' }}>
      {/* EXPANDED LUXURY SPLIT CARD (1380px max-width, full-scale proportions) */}
      <div 
        style={{
          width: '100%',
          maxWidth: '1380px',
          background: '#FFFFFF',
          borderRadius: '28px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 30px 60px -15px rgba(15, 23, 42, 0.14)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          minHeight: '680px'
        }}
      >
        {/* LEFT COLUMN: EDITORIAL VISUAL FRAME */}
        <div 
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: '#0F172A',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '52px clamp(32px, 4vw, 64px)',
            color: '#FFFFFF',
            minHeight: '360px'
          }}
        >
          {/* BACKGROUND PHOTO WITH FIXED COVER RATIO */}
          <img 
            src={photoBg} 
            alt="NOVA Lifestyle" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.52,
              zIndex: 1
            }} 
          />

          {/* GRADIENT OVERLAY */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.88) 100%)',
              zIndex: 2
            }} 
          />

          {/* TOP PILL BADGE */}
          <div style={{ position: 'relative', zIndex: 3 }}>
            <span 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.16)',
                backdropFilter: 'blur(10px)',
                padding: '6px 18px',
                borderRadius: '9999px',
                fontSize: '12px', 
                fontWeight: 700, 
                letterSpacing: '0.09em', 
                textTransform: 'uppercase', 
                color: '#FFFFFF' 
              }}
            >
              {isAdminLogin ? 'Merchant Console' : 'NOVA Membership'}
            </span>
          </div>

          {/* BOTTOM VALUE PROPOSITIONS */}
          <div style={{ position: 'relative', zIndex: 3 }}>
            <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
              {isAdminLogin ? 'Merchant Operations & Warehouse Control' : 'Curated Essentials for Modern Living'}
            </h3>
            <p style={{ fontSize: '14.5px', fontWeight: 400, lineHeight: 1.6, color: '#E2E8F0', marginBottom: '20px' }}>
              {isAdminLogin 
                ? 'Authorized management console for real-time inventory adjustments and order status updates.'
                : 'Sign in to access your synchronized bag, saved wishlist items, and real-time order tracking.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: '#E2E8F0' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckIcon size={16} /> Direct order tracking with timeline updates
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckIcon size={16} /> 256-bit encrypted authentication security
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckIcon size={16} /> Priority member dispatch & customer care
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PROPORTIONATE AUTHENTICATION FORM */}
        <div 
          style={{
            padding: '52px clamp(32px, 4vw, 64px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: '#FFFFFF'
          }}
        >
          {/* HEADER */}
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--accent-blue)', display: 'block', marginBottom: '6px' }}>
              {isAdminLogin ? 'PORTAL ACCESS' : 'SECURE SIGN IN'}
            </span>
            <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em', color: '#0F172A', margin: '0 0 8px' }}>
              {isAdminLogin ? 'Admin Sign In' : isLogin ? 'Sign In to NOVA' : 'Create Account'}
            </h1>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              {isAdminLogin 
                ? 'Enter authorized store administrator credentials.'
                : isLogin 
                  ? 'Welcome back. Enter your account credentials below.'
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
                  borderRadius: '9999px',
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
                borderRadius: '9999px',
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

            {(f.email || f.password || f.name) && (
              <button 
                type="button" 
                onClick={() => setF({ name: '', email: '', password: '' })} 
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Clear Fields
              </button>
            )}
          </div>

          {/* STATUS MESSAGES */}
          {msg && (
            <div style={{ background: 'var(--accent-green-bg)', color: 'var(--accent-green)', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', fontWeight: 600 }}>
              {msg}
            </div>
          )}

          {err && (
            <div style={{ background: 'var(--accent-red-bg)', color: 'var(--accent-red)', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', fontWeight: 600 }}>
              {err}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={submit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  autoComplete="off"
                  placeholder="Enter your full name"
                  required
                  value={f.name}
                  onChange={(e) => setF({ ...f, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '14px',
                    background: '#FFFFFF'
                  }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
                {isAdminLogin ? 'Admin Email' : 'Email Address'}
              </label>
              <input
                type="email"
                name="userEmail"
                autoComplete="new-password"
                readOnly
                onFocus={(e) => e.target.removeAttribute('readonly')}
                placeholder="Enter your email address"
                required
                value={f.email}
                onChange={(e) => setF({ ...f, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  fontSize: '14px',
                  background: '#FFFFFF'
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
                  Password
                </label>
                {isLogin && !isAdminLogin && (
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Min. 6 characters
                  </span>
                )}
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="userPassword"
                  autoComplete="new-password"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                  placeholder="Enter your password"
                  minLength="6"
                  required
                  value={f.password}
                  onChange={(e) => setF({ ...f, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '14px',
                    background: '#FFFFFF'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'grid',
                    placeItems: 'center',
                    padding: '4px'
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: 'var(--primary)',
                color: '#FFFFFF',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '6px',
                marginBottom: '14px',
                transition: 'var(--transition)'
              }}
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
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {isAdminLogin ? (
              <div style={{ textAlign: 'center', paddingTop: '8px' }}>
                <Link to="/login" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>
                  Return to Customer Sign In
                </Link>
              </div>
            ) : isLogin ? (
              <>
                <div style={{ textAlign: 'center' }}>
                  Don't have an account?{' '}
                  <Link to="/register" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>
                    Create free account
                  </Link>
                </div>
                <div style={{ textAlign: 'center', paddingTop: '10px', borderTop: '1px solid var(--border)', fontSize: '12.5px' }}>
                  Store Staff or Manager?{' '}
                  <Link to="/admin-login" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>
                    Admin Portal Sign In
                  </Link>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>
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