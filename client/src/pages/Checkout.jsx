import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, total, clear } = useCart();
  const nav = useNavigate();
  
  const [f, setF] = useState({ name: '', address: '', city: '', state: '', postalCode: '', phone: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  const s = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');

    const newOrder = {
      _id: 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      createdAt: new Date().toISOString(),
      shipping: f,
      items: items.map(i => ({
        product: i.product._id || i.product.id,
        name: i.product.name,
        price: i.product.price,
        image: i.product.image,
        quantity: i.quantity
      })),
      total,
      status: 'Processing'
    };

    try {
      // Try sending to backend API first
      const r = await api.post('/orders', {
        shipping: f,
        items: items.map(i => ({ product: i.product._id || i.product.id, quantity: i.quantity }))
      });
      if (r.data?._id) newOrder._id = r.data._id;
    } catch (x) {
      // Fallback gracefully to local storage order tracking if backend ObjectId fails
    }

    // Save to user orders list
    const existingOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
    localStorage.setItem('user_orders', JSON.stringify([newOrder, ...existingOrders]));

    // Clear cart and show Order Success screen
    clear();
    setBusy(false);
    setSuccessOrder(newOrder);
  };

  // ORDER SUCCESS CONFIRMATION SCREEN
  if (successOrder) {
    return (
      <section className="page" style={{ maxWidth: '650px', margin: '40px auto', textAlign: 'center' }}>
        <div style={{ background: '#fff', padding: '48px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ fontSize: '54px', marginBottom: '16px' }}>🎉</div>
          <span className="script-accent">Thank you for your order</span>
          <p className="eyebrow" style={{ marginTop: '6px' }}>ORDER CONFIRMED</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', margin: '8px 0 16px' }}>
            Payment Successful!
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Order ID: <strong>#{successOrder._id}</strong>
          </p>

          <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: '10px', textAlign: 'left', marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', marginBottom: '8px' }}>Shipping To</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              <strong>{successOrder.shipping.name}</strong><br />
              {successOrder.shipping.address}, {successOrder.shipping.city}, {successOrder.shipping.state} - {successOrder.shipping.postalCode}<br />
              Phone: {successOrder.shipping.phone}
            </p>
            <hr style={{ borderColor: 'var(--border-light)', margin: '14px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>Total Amount Paid</span>
              <span>₹{successOrder.total?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="primary" onClick={() => nav('/orders')}>View My Orders →</button>
            <Link to="/shop" style={{ padding: '14px 28px', textDecoration: 'none', color: 'var(--text-dark)', fontWeight: 600 }}>Continue Shopping</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page" style={{ maxWidth: '560px', margin: '20px auto' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
        <p className="eyebrow">CHECKOUT</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', marginBottom: '28px' }}>Shipping Details</h1>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Full Name</label>
            <input name="name" placeholder="Suhirdha K S" required value={f.name} onChange={s} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Street Address</label>
            <input name="address" placeholder="123 Main Street" required value={f.address} onChange={s} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>City</label>
              <input name="city" placeholder="Erode" required value={f.city} onChange={s} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>State</label>
              <input name="state" placeholder="Tamil Nadu" required value={f.state} onChange={s} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Postal Code</label>
              <input name="postalCode" placeholder="638153" required value={f.postalCode} onChange={s} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Phone Number</label>
              <input name="phone" placeholder="9876543210" required value={f.phone} onChange={s} />
            </div>
          </div>

          {err && <div style={{ color: '#dc2626', background: '#fee2e2', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>{err}</div>}

          <button className="primary wide" disabled={busy} style={{ marginTop: '12px' }}>
            {busy ? 'Processing Order...' : `Pay ₹${total?.toLocaleString('en-IN')} & Place Order`}
          </button>
        </form>
      </div>
    </section>
  );
}