import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <section className="page" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <p className="eyebrow">USER PROFILE</p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '38px', marginBottom: '32px' }}>My Account</h1>

      <div style={{ background: '#fff', padding: '36px', borderRadius: '14px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--text-dark)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '24px', fontWeight: 700 }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px' }}>{user?.name || 'Guest User'}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{user?.email || 'Sign in to access your account'}</p>
            {user?.role === 'admin' && (
              <span style={{ display: 'inline-block', background: 'var(--accent-gold)', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, marginTop: '4px' }}>
                ADMIN ACCOUNT
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
          <Link to="/orders" style={{ textDecoration: 'none', color: 'var(--text-dark)', fontSize: '16px', fontWeight: 600 }}>
            📦 My Orders →
          </Link>
          <Link to="/favorites" style={{ textDecoration: 'none', color: 'var(--text-dark)', fontSize: '16px', fontWeight: 600 }}>
            ❤️ Saved Favorites →
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" style={{ textDecoration: 'none', color: 'var(--accent-gold)', fontSize: '16px', fontWeight: 600 }}>
              👑 Admin Management Portal →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}