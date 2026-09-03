import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { safeGetJSON } from '../utils/storage';
import { PackageIcon, HeartIcon, ShieldIcon, CheckIcon, ArrowRightIcon } from '../components/Icons';

export default function Profile() {
  const { user, logout } = useAuth();
  const [savedAddress, setSavedAddress] = useState(null);

  const userAddressKey = user?.email ? `saved_address_${String(user.email).toLowerCase()}` : 'saved_address_guest';

  useEffect(() => {
    const saved = safeGetJSON(userAddressKey, null);
    if (saved) setSavedAddress(saved);
  }, [userAddressKey]);

  return (
    <section className="page" style={{ maxWidth: '750px', margin: '0 auto' }}>
      <p className="eyebrow">USER PROFILE</p>
      <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '4px 0 24px' }}>My Account</h1>

      <div style={{ background: '#fff', padding: '28px', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--text-dark)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '20px', fontWeight: 600 }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 4px' }}>{user?.name || 'User'}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>{user?.email || ''}</p>
            {user?.role === 'admin' && (
              <span style={{ display: 'inline-block', background: '#0f172a', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, marginTop: '4px' }}>
                ADMINISTRATOR
              </span>
            )}
          </div>
        </div>

        {/* SAVED ADDRESS DISPLAY CARD */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckIcon size={14} /> Saved Delivery Address
          </h3>
          {savedAddress ? (
            <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', fontSize: '13px', border: '1px solid var(--border)' }}>
              <strong style={{ color: 'var(--text-dark)' }}>{savedAddress.name}</strong><br />
              {savedAddress.address}, {savedAddress.city}, {savedAddress.state} - {savedAddress.postalCode}<br />
              Phone: {savedAddress.phone}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>No saved address yet. Your address will be saved here upon checkout.</p>
          )}
        </div>

        {/* QUICK NAVIGATION LINKS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <Link to="/orders" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', color: 'var(--text-dark)', fontSize: '14px', fontWeight: 500, padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: '6px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PackageIcon size={16} /> My Orders & History
            </span>
            <ArrowRightIcon size={14} />
          </Link>
          
          <Link to="/favorites" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', color: 'var(--text-dark)', fontSize: '14px', fontWeight: 500, padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: '6px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HeartIcon size={16} /> Saved Favorites
            </span>
            <ArrowRightIcon size={14} />
          </Link>

          {user?.role === 'admin' && (
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', color: '#0f172a', fontSize: '14px', fontWeight: 600, padding: '10px 14px', background: '#f1f5f9', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldIcon size={16} /> Admin Management Console
              </span>
              <ArrowRightIcon size={14} />
            </Link>
          )}

          <button 
            onClick={logout}
            style={{ marginTop: '10px', background: '#fff', border: '1px solid var(--border)', color: '#dc2626', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', textAlign: 'left' }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </section>
  );
}