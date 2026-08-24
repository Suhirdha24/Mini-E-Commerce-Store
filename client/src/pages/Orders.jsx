import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Load both local orders and API orders
    const localOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');

    api.get('/orders/mine')
      .then((r) => {
        const combined = [...localOrders, ...(r.data || [])];
        const unique = Array.from(new Set(combined.map(o => o._id))).map(id => combined.find(o => o._id === id));
        setOrders(unique);
      })
      .catch(() => {
        setOrders(localOrders);
      });
  }, []);

  return (
    <section className="page" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <p className="eyebrow">ACCOUNT</p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', marginBottom: '32px' }}>My Orders</h1>

      {orders.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((o) => (
            <div
              key={o._id}
              style={{
                padding: '24px',
                background: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <b style={{ fontSize: '18px', fontFamily: 'var(--font-serif)' }}>Order #{o._id}</b>
                  <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                    Placed on {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'inline-block', padding: '4px 14px', background: '#def7ec', color: '#03543f', borderRadius: '20px', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    {o.status || 'Processing'}
                  </span>
                  <b style={{ display: 'block', fontSize: '18px' }}>₹{o.total?.toLocaleString('en-IN')}</b>
                </div>
              </div>

              {/* ORDER ITEMS SNAPSHOT */}
              {o.items?.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', gap: '16px', overflowX: 'auto' }}>
                  {o.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {item.image && <img src={item.image} alt={item.name} style={{ width: '50px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />}
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '12px' }}>No orders placed yet</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Your completed orders will appear here.</p>
          <Link className="primary" to="/shop">Start Shopping →</Link>
        </div>
      )}
    </section>
  );
}