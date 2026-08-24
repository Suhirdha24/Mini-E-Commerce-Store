import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';

export default function OrderDetail() {
  const { id } = useParams();
  const [o, setO] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then((r) => setO(r.data)).catch(() => {});
  }, [id]);

  if (!o) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading order details...</div>;

  return (
    <section className="page" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/orders" style={{ textDecoration: 'none', color: 'var(--text-muted)', marginBottom: '16px', display: 'inline-block' }}>
        ← Back to My Orders
      </Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <p className="eyebrow">ORDER CONFIRMATION</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px' }}>#{o._id.slice(-8).toUpperCase()}</h1>
        </div>
        <span style={{ background: 'var(--text-dark)', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
          {o.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '40px', alignItems: 'start' }}>
        <div>
          {o.items?.map((i) => (
            <div key={i.product} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--border-light)', alignItems: 'center' }}>
              <img src={i.image} alt={i.name} style={{ width: '70px', height: '85px', objectFit: 'cover', borderRadius: '6px' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '16px' }}>{i.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>₹{i.price?.toLocaleString('en-IN')} × {i.quantity}</p>
              </div>
              <b>₹{(i.price * i.quantity).toLocaleString('en-IN')}</b>
            </div>
          ))}
        </div>

        <aside style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', marginBottom: '16px' }}>Shipping Address</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            <strong>{o.shipping?.name}</strong><br />
            {o.shipping?.address}<br />
            {o.shipping?.city}, {o.shipping?.state} {o.shipping?.postalCode}<br />
            Phone: {o.shipping?.phone}
          </p>
          <hr style={{ borderColor: 'var(--border-light)', margin: '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}>
            <span>Total Paid</span>
            <b>₹{o.total?.toLocaleString('en-IN')}</b>
          </div>
        </aside>
      </div>
    </section>
  );
}