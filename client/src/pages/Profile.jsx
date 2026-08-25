import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { safeGetJSON } from '../utils/storage';

export default function Profile() {
  const { user } = useAuth();
  const [savedAddress, setSavedAddress] = useState(null);

  const userAddressKey = user?.email ? `saved_address_${String(user.email).toLowerCase()}` : 'saved_address_guest';

  useEffect(() => {
    const saved = safeGetJSON(userAddressKey, null);
    if (saved) setSavedAddress(saved);
  }, [userAddressKey]);

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

        {/* SAVED ADDRESS DISPLAY CARD */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', marginBottom: '12px' }}>📍 Saved Delivery Address</h3>
          {savedAddress ? (
            <div style={{ background: 'var(--bg-primary)', padding: '18px', borderRadius: '10px', fontSize: '14px' }}>
              <strong>{savedAddress.name}</strong><br />
              {savedAddress.address}, {savedAddress.city}, {savedAddress.state} - {savedAddress.postalCode}<br />
              Phone: {savedAddress.phone}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No saved address yet. Checkout an order to save your address for quick future orders!</p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
          <Link to="/orders" style={{ textDecoration: 'none', color: 'var(--text-dark)', fontSize: '16px', fontWeight: 600 }}>
            📦 My Orders & Tracking →
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