import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { RefreshIcon, CheckIcon, PackageIcon } from '../components/Icons';

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
        setActionError(err.response?.data?.message || err.message || 'Failed to load your orders.');
        setOrders([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { 
    loadOrders(); 
  }, []);

  // CANCEL ORDER FUNCTION VIA DEDICATED CUSTOMER ENDPOINT (WITH STOCK RESTORATION)
  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order? Stock will be restored to store inventory.')) {
      try {
        await api.post(`/orders/${orderId}/cancel`);
        loadOrders();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel order.');
      }
    }
  };

  return (
    <div className="container page" style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <p className="eyebrow">CUSTOMER ACCOUNT</p>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '4px 0 0' }}>My Orders</h1>
        </div>
        <button 
          onClick={loadOrders} 
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid var(--border)', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
        >
          <RefreshIcon size={14} /> Refresh
        </button>
      </div>

      {actionError && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>
          {actionError}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
          Loading orders...
        </div>
      ) : orders.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((o) => {
            const rawItems = Array.isArray(o.items) ? o.items : JSON.parse(o.items || '[]');
            const orderId = o.id || o._id;
            const orderDate = o.created_at || o.createdAt;

            return (
              <div
                key={orderId}
                style={{
                  padding: '20px',
                  background: 'var(--bg-card)',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <b style={{ fontSize: '15px' }}>Order #{orderId}</b>
                    <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                      Placed on {orderDate ? new Date(orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                    </span>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <span 
                      style={{ 
                        display: 'inline-block', 
                        padding: '3px 10px', 
                        background: o.status === 'Cancelled' ? '#fee2e2' : o.status === 'Delivered' ? '#def7ec' : '#fef3c7', 
                        color: o.status === 'Cancelled' ? '#dc2626' : o.status === 'Delivered' ? '#03543f' : '#92400e', 
                        borderRadius: '4px', 
                        fontSize: '12px', 
                        fontWeight: 600, 
                        marginBottom: '4px' 
                      }}
                    >
                      {o.status || 'Processing'}
                    </span>
                    <b style={{ display: 'block', fontSize: '16px' }}>₹{Number(o.total || 0).toLocaleString('en-IN')}</b>
                  </div>
                </div>

                {/* ITEMS SNAPSHOT */}
                {rawItems.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', gap: '14px', overflowX: 'auto', marginBottom: '14px' }}>
                    {rawItems.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', minWidth: '200px' }}>
                        {item.image && <img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '4px' }} />}
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-dark)' }}>{item.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ₹{Number(item.price || 0).toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ACTIONS */}
                <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border)', paddingTop: '12px', alignItems: 'center' }}>
                  <button 
                    onClick={() => setTrackingOrder(o)}
                    style={{ background: 'var(--text-dark)', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}
                  >
                    Track Order
                  </button>

                  <Link 
                    to={`/orders/${orderId}`}
                    style={{ textDecoration: 'none', background: '#fff', color: 'var(--text-dark)', border: '1px solid var(--border)', padding: '6px 14px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}
                  >
                    View Receipt
                  </Link>

                  {o.status !== 'Cancelled' && o.status !== 'Delivered' && (
                    <button 
                      onClick={() => handleCancelOrder(orderId)}
                      style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}
                    >
                      Cancel Order
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
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-secondary)', color: 'var(--text-muted)', display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}>
            <PackageIcon size={24} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '6px' }}>No orders placed yet</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '18px' }}>Your completed orders will appear here directly from the cloud database.</p>
          <Link className="primary" to="/shop">Start Shopping</Link>
        </div>
      )}

      {/* TRACK ORDER TIMELINE MODAL */}
      {trackingOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '480px', padding: '28px', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Track Order #{trackingOrder.id || trackingOrder._id}</h2>
              <button onClick={() => setTrackingOrder(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>

            {/* TIMELINE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingLeft: '8px', borderLeft: '2px solid var(--border)' }}>
              <div style={{ position: 'relative', paddingLeft: '14px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#059669' }}>Order Placed</span>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Confirmed in Database</p>
              </div>

              <div style={{ position: 'relative', paddingLeft: '14px' }}>
                <span style={{ fontWeight: trackingOrder.status !== 'Cancelled' ? 600 : 400, fontSize: '14px' }}>
                  {trackingOrder.status === 'Cancelled' ? 'Order Cancelled' : 'Processing & Packed'}
                </span>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Items inspected and prepared at warehouse</p>
              </div>

              {trackingOrder.status !== 'Cancelled' && (
                <>
                  <div style={{ position: 'relative', paddingLeft: '14px' }}>
                    <span style={{ fontWeight: ['Shipped', 'Delivered'].includes(trackingOrder.status) ? 600 : 400, fontSize: '14px' }}>Out for Delivery</span>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Handed over to courier service</p>
                  </div>

                  <div style={{ position: 'relative', paddingLeft: '14px' }}>
                    <span style={{ fontWeight: trackingOrder.status === 'Delivered' ? 600 : 400, fontSize: '14px' }}>Delivered to Customer</span>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      {(typeof trackingOrder.shipping === 'object' ? trackingOrder.shipping?.address : JSON.parse(trackingOrder.shipping || '{}')?.address) || 'Customer Address'}
                    </p>
                  </div>
                </>
              )}
            </div>

            <button className="primary wide" onClick={() => setTrackingOrder(null)} style={{ marginTop: '24px' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}