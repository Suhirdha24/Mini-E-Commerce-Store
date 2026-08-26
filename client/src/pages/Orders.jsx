import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [actionError, setActionError] = useState('');

  const loadOrders = () => {
    setLoading(true);
    setActionError('');
    api.get('/orders/mine')
      .then((r) => {
        const data = Array.isArray(r.data) ? r.data : [];
        setOrders(data);
      })
      .catch((err) => {
        setActionError(err.response?.data?.message || err.message || 'Failed to load your orders from database.');
        setOrders([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { 
    loadOrders(); 
  }, []);

  // CANCEL ORDER FUNCTION WITH ACID RESTORATION IN DB
  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order? Stock will be restored to store inventory.')) {
      try {
        await api.patch(`/orders/${orderId}/status`, { status: 'Cancelled' });
        loadOrders();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel order.');
      }
    }
  };

  if (!user) {
    return (
      <section className="page" style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'center' }}>
        <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '12px' }}>Sign in to View Orders</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>
            Please log in to your account to view your past purchases and track deliveries.
          </p>
          <Link className="primary" to="/login">Sign In</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <p className="eyebrow">CUSTOMER ACCOUNT</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px' }}>My Orders</h1>
        </div>
        <button onClick={loadOrders} style={{ background: '#f8fafc', border: '1px solid var(--border-light)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
          🔄 Refresh
        </button>
      </div>

      {actionError && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '14px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
          {actionError}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          Loading orders from cloud database...
        </div>
      ) : orders.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map((o) => {
            const rawItems = Array.isArray(o.items) ? o.items : JSON.parse(o.items || '[]');
            const orderId = o.id || o._id;
            const orderDate = o.created_at || o.createdAt;

            return (
              <div
                key={orderId}
                style={{
                  padding: '24px',
                  background: 'var(--bg-card)',
                  borderRadius: '14px',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <b style={{ fontSize: '18px', fontFamily: 'var(--font-serif)' }}>Order #{orderId}</b>
                    <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                      Placed on {orderDate ? new Date(orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </span>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <span 
                      style={{ 
                        display: 'inline-block', 
                        padding: '4px 14px', 
                        background: o.status === 'Cancelled' ? '#fee2e2' : o.status === 'Delivered' ? '#def7ec' : '#fef3c7', 
                        color: o.status === 'Cancelled' ? '#dc2626' : o.status === 'Delivered' ? '#03543f' : '#92400e', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: 700, 
                        marginBottom: '6px' 
                      }}
                    >
                      {o.status || 'Processing'}
                    </span>
                    <b style={{ display: 'block', fontSize: '18px' }}>₹{Number(o.total || 0).toLocaleString('en-IN')}</b>
                  </div>
                </div>

                {/* ITEMS SNAPSHOT */}
                {rawItems.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', gap: '16px', overflowX: 'auto', marginBottom: '16px' }}>
                    {rawItems.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', minWidth: '220px' }}>
                        {item.image && <img src={item.image} alt={item.name} style={{ width: '50px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />}
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ₹{Number(item.price || 0).toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TRACK & CANCEL ORDER BUTTONS */}
                <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '16px', alignItems: 'center' }}>
                  <button 
                    onClick={() => setTrackingOrder(o)}
                    style={{ background: 'var(--text-dark)', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    🚚 Track Order
                  </button>

                  {o.status !== 'Cancelled' && o.status !== 'Delivered' && (
                    <button 
                      onClick={() => handleCancelOrder(orderId)}
                      style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      ✕ Cancel Order
                    </button>
                  )}

                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    Method: {o.payment_method || o.paymentMethod || 'Cash on Delivery'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '12px' }}>No orders placed yet</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Your completed orders will appear here directly from the cloud database.</p>
          <Link className="primary" to="/shop">Start Shopping →</Link>
        </div>
      )}

      {/* TRACK ORDER TIMELINE MODAL */}
      {trackingOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '520px', padding: '32px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px' }}>Track Order #{trackingOrder.id || trackingOrder._id}</h2>
              <button onClick={() => setTrackingOrder(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            {/* TIMELINE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingLeft: '10px', borderLeft: '2px solid var(--accent-gold)' }}>
              <div style={{ position: 'relative', paddingLeft: '16px' }}>
                <span style={{ fontWeight: 700 }}>✓ Order Placed</span>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Confirmed in Database</p>
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
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {(typeof trackingOrder.shipping === 'object' ? trackingOrder.shipping?.address : JSON.parse(trackingOrder.shipping || '{}')?.address) || 'Customer Address'}
                    </p>
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