import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);

  const loadOrders = () => {
    const localOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
    api.get('/orders/mine')
      .then((r) => {
        const combined = [...localOrders, ...(r.data || [])];
        const unique = Array.from(new Set(combined.map(o => o._id))).map(id => combined.find(o => o._id === id));
        setOrders(unique);
      })
      .catch(() => setOrders(localOrders));
  };

  useEffect(() => { loadOrders(); }, []);

  // CANCEL ORDER FUNCTION
  const handleCancelOrder = (orderId) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      const updated = orders.map(o => o._id === orderId ? { ...o, status: 'Cancelled' } : o);
      setOrders(updated);
      localStorage.setItem('user_orders', JSON.stringify(updated));
      try { api.patch(`/orders/${orderId}/status`, { status: 'Cancelled' }); } catch (e) {}
    }
  };

  return (
    <section className="page" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <p className="eyebrow">ACCOUNT</p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', marginBottom: '32px' }}>My Orders</h1>

      {orders.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map((o) => (
            <div
              key={o._id}
              style={{
                padding: '24px',
                background: 'var(--bg-card)',
                borderRadius: '14px',
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
                  <span 
                    style={{ 
                      display: 'inline-block', 
                      padding: '4px 14px', 
                      background: o.status === 'Cancelled' ? '#fee2e2' : '#def7ec', 
                      color: o.status === 'Cancelled' ? '#dc2626' : '#03543f', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      fontWeight: 700, 
                      marginBottom: '6px' 
                    }}
                  >
                    {o.status || 'Processing'}
                  </span>
                  <b style={{ display: 'block', fontSize: '18px' }}>₹{o.total?.toLocaleString('en-IN')}</b>
                </div>
              </div>

              {/* ITEMS SNAPSHOT */}
              {o.items?.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', gap: '16px', overflowX: 'auto', marginBottom: '16px' }}>
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

              {/* TRACK & CANCEL ORDER BUTTONS */}
              <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <button 
                  onClick={() => setTrackingOrder(o)}
                  style={{ background: 'var(--text-dark)', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  🚚 Track Order
                </button>

                {o.status !== 'Cancelled' && o.status !== 'Delivered' && (
                  <button 
                    onClick={() => handleCancelOrder(o._id)}
                    style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    ✕ Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '12px' }}>No orders placed yet</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Your completed orders will appear here.</p>
          <Link className="primary" to="/shop">Start Shopping →</Link>
        </div>
      )}

      {/* TRACK ORDER TIMELINE MODAL */}
      {trackingOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '520px', padding: '32px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px' }}>Track Order #{trackingOrder._id}</h2>
              <button onClick={() => setTrackingOrder(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            {/* TIMELINE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingLeft: '10px', borderLeft: '2px solid var(--accent-gold)' }}>
              <div style={{ position: 'relative', paddingLeft: '16px' }}>
                <span style={{ fontWeight: 700 }}>✓ Order Placed</span>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Confirmed on {new Date(trackingOrder.createdAt).toLocaleDateString('en-IN')}</p>
              </div>

              <div style={{ position: 'relative', paddingLeft: '16px' }}>
                <span style={{ fontWeight: trackingOrder.status !== 'Cancelled' ? 700 : 400 }}>
                  {trackingOrder.status === 'Cancelled' ? '✕ Order Cancelled' : '📦 Processing & Packed'}
                </span>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Items inspected and prepared at warehouse</p>
              </div>

              {trackingOrder.status !== 'Cancelled' && (
                <>
                  <div style={{ position: 'relative', paddingLeft: '16px' }}>
                    <span style={{ fontWeight: ['Shipped', 'Delivered'].includes(trackingOrder.status) ? 700 : 400 }}>🚚 Out for Delivery</span>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Handed over to courier service</p>
                  </div>

                  <div style={{ position: 'relative', paddingLeft: '16px' }}>
                    <span style={{ fontWeight: trackingOrder.status === 'Delivered' ? 700 : 400 }}>🏠 Delivered to Customer</span>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{trackingOrder.shipping?.address}, {trackingOrder.shipping?.city}</p>
                  </div>
                </>
              )}
            </div>

            <button className="primary wide" onClick={() => setTrackingOrder(null)} style={{ marginTop: '28px' }}>
              Close Tracker
            </button>
          </div>
        </div>
      )}
    </section>
  );
}