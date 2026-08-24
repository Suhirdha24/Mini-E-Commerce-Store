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
  const [err, setErr] = useState('');
  const [msg] = useState(loc.state?.msg || '');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    try {
      if (isLogin) {
        await login(f);
        // If logging in via Admin Portal, redirect to /admin dashboard
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
      setErr(x.response?.data?.message || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <section className="auth">
      <form onSubmit={submit}>
        <p className="eyebrow">{isAdminLogin ? 'RETAILER & MERCHANT PORTAL' : 'NOVA STORE'}</p>
        
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px' }}>
          {isAdminLogin ? 'Admin Sign In' : isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        
        {msg && <div style={{ background: '#def7ec', color: '#03543f', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>{msg}</div>}
        {err && <div className="alert">{err}</div>}

        {!isLogin && (
          <input
            placeholder="Full Name"
            required
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
          />
        )}
        
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            {isAdminLogin ? 'Retailer Admin Email' : 'Email Address'}
          </label>
          <input
            type="email"
            placeholder={isAdminLogin ? "admin@ministore.com" : "you@example.com"}
            required
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            minLength="6"
            required
            value={f.password}
            onChange={(e) => setF({ ...f, password: e.target.value })}
          />
        </div>

        <button className="primary wide" style={{ marginTop: '8px' }}>
          {isAdminLogin ? 'Sign In to Admin Portal →' : isLogin ? 'Sign In' : 'Create Account'}
        </button>
        
        {/* NAVIGATION LINKS BETWEEN CUSTOMER & ADMIN LOGIN */}
        <div style={{ fontSize: '14px', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          {isAdminLogin ? (
            <Link to="/login" style={{ color: 'var(--text-dark)', fontWeight: 600 }}>
              ← Return to Customer Sign In
            </Link>
          ) : isLogin ? (
            <>
              <div>New to NOVA? <Link to="/register" style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Create an account</Link></div>
              <hr style={{ borderColor: 'var(--border-light)', margin: '8px 0' }} />
              {/* DEDICATED LINK TO ADMIN PORTAL */}
              <div style={{ fontSize: '13px' }}>
                Are you a Store Admin / Retailer? <Link to="/admin-login" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>Sign in to Admin Portal →</Link>
              </div>
            </>
          ) : (
            <div>Already have an account? <Link to="/login" style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Sign in</Link></div>
          )}
        </div>
      </form>
    </section>
  );
}