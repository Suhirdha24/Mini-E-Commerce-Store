import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, total, clear } = useCart();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', address: '', city: '', state: '', postalCode: '', phone: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const s = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api.post('/orders', {
        shipping: f,
        items: items.map((i) => ({ product: i.product._id || i.product.id, quantity: i.quantity })),
      });
      clear();
      nav(`/orders/${r.data._id}`);
    } catch (x) {
      setErr(x.response?.data?.message || 'Could not place order');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <p className="eyebrow">CHECKOUT</p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', marginBottom: '32px' }}>Shipping Details</h1>

      <form className="form-card" onSubmit={submit}>
        {['name', 'address', 'city', 'state', 'postalCode', 'phone'].map((k) => (
          <input
            key={k}
            name={k}
            placeholder={k === 'postalCode' ? 'Postal Code' : k[0].toUpperCase() + k.slice(1)}
            required
            value={f[k]}
            onChange={s}
          />
        ))}
        {err && <div className="alert">{err}</div>}
        <button className="primary wide" disabled={busy}>
          {busy ? 'Processing Order...' : `Pay ₹${total.toLocaleString('en-IN')} & Place Order`}
        </button>
      </form>
    </section>
  );
}