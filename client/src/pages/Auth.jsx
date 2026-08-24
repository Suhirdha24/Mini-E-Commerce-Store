import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Auth({ mode = 'login' }) {
  const isLogin = mode === 'login';
  const loc = useLocation();
  const nav = useNavigate();
  const { login, register } = useAuth();
  
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState(loc.state?.msg || '');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');

    try {
      if (isLogin) {
        await login(f);
        nav(loc.state?.from || '/');
      } else {
        await register(f);
        // Redirect to Login page after successful registration
        nav('/login', { state: { msg: 'Account created successfully! Please sign in below.' } });
      }
    } catch (x) {
      setErr(x.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className="auth">
      <form onSubmit={submit}>
        <p className="eyebrow">NOVA STORE</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
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
        <input
          type="email"
          placeholder="Email Address"
          required
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password (6+ characters)"
          minLength="6"
          required
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
        />

        <button className="primary wide">{isLogin ? 'Sign In' : 'Create Account'}</button>
        
        <p style={{ fontSize: '14px', textAlign: 'center', color: 'var(--text-muted)' }}>
          {isLogin ? (
            <>New to NOVA? <Link to="/register" style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Create an account</Link></>
          ) : (
            <>Already have an account? <Link to="/login" style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Sign in</Link></>
          )}
        </p>
      </form>
    </section>
  );
}