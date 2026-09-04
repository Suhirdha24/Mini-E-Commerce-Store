import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';

export default function OrderDetail() {
  const { id } = useParams();
  const [o, setO] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((r) => setO(r.data))
      .catch((e) => setErr(e.response?.data?.message || 'Failed to load order details.'));
  }, [id]);

  if (err) {
    return (
      <section className="page" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
        <div style={{ background: '#fff', padding: '32px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#dc2626', marginBottom: '8px' }}>Access Error</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>{err}</p>
          <Link className="primary" to="/orders">Back to My Orders</Link>
        </div>
      </section>
    );
  }

  if (!o) return <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)', fontSize: '14px' }}>Loading order details...</div>;

  const rawItems = Array.isArray(o.items) ? o.items : JSON.parse(o.items || '[]');
  const shippingInfo = typeof o.shipping === 'object' ? o.shipping : JSON.parse(o.shipping || '{}');
  const orderId = o.id || o._id || id;
  const shortId = String(orderId).slice(-8).toUpperCase();

  return (
    <div className="container page">
      <Link to="/orders" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px', display: 'inline-block' }}>
        ← Back to My Orders
      </Link>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <p className="eyebrow">ORDER RECEIPT</p>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '4px 0 0' }}>#{shortId}</h1>
        </div>
        <span 
          style={{ 
            padding: '4px 12px', 
            borderRadius: '4px', 
            fontSize: '12px', 
            fontWeight: 600,
            background: o.status === 'Cancelled' ? '#fee2e2' : o.status === 'Delivered' ? '#def7ec' : '#fef3c7',
            color: o.status === 'Cancelled' ? '#dc2626' : o.status === 'Delivered' ? '#03543f' : '#92400e'
          }}
        >
          {o.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '28px', alignItems: 'start' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>Purchased Items</h2>
          {rawItems.map((i, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '14px', padding: '12px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
              {i.image && <img src={i.image} alt={i.name} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px' }} />}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px' }}>{i.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>₹{Number(i.price || 0).toLocaleString('en-IN')} × {i.quantity}</p>
              </div>
              <b style={{ fontSize: '14px' }}>₹{(Number(i.price || 0) * (i.quantity || 1)).toLocaleString('en-IN')}</b>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', fontSize: '15px', fontWeight: 700 }}>
            <span>Subtotal</span>
            <span>₹{Number(o.total || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <aside style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Shipping Address</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
            <strong style={{ color: 'var(--text-dark)' }}>{shippingInfo?.name}</strong><br />
            {shippingInfo?.address}<br />
            {shippingInfo?.city}, {shippingInfo?.state} {shippingInfo?.postalCode}<br />
            Phone: {shippingInfo?.phone}
          </p>
          <hr style={{ borderColor: 'var(--border)', margin: '14px 0' }} />
          <div style={{ fontSize: '13px', marginBottom: '8px', color: 'var(--text-muted)' }}>
            Payment: <strong style={{ color: 'var(--text-dark)' }}>{o.payment_method || o.paymentMethod || 'Cash on Delivery'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700 }}>
            <span>Total Paid</span>
            <span>₹{Number(o.total || 0).toLocaleString('en-IN')}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}