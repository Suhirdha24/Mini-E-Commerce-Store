import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/mine').then((r) => setOrders(r.data || [])).catch(() => setOrders([]));
  }, []);

  return (
    <section className="page">
      <p className="eyebrow">ACCOUNT</p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', marginBottom: '32px' }}>My Orders</h1>

      {orders.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((o) => (
            <Link
              to={`/orders/${o._id}`}
              key={o._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '24px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div>
                <b style={{ fontSize: '16px' }}>Order #{o._id.slice(-6).toUpperCase()}</b>
                <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                  {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--bg-secondary)', borderRadius: '12px', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  {o.status}
                </span>
                <b style={{ display: 'block', fontSize: '16px' }}>₹{o.total?.toLocaleString('en-IN')}</b>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px' }}>No orders placed yet.</div>
      )}
    </section>
  );
}