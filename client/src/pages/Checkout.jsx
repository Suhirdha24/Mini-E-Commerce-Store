import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { safeGetJSON, safeSetJSON } from '../utils/storage';

const INDIAN_STATES = ['Tamil Nadu', 'Karnataka', 'Kerala', 'Maharashtra', 'Delhi', 'Telangana', 'Andhra Pradesh', 'Gujarat'];
const CITIES = {
  'Tamil Nadu': ['Erode', 'Chennai', 'Coimbatore', 'Madurai', 'Salem'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru'],
  'Kerala': ['Kochi', 'Thiruvananthapuram'],
  'Maharashtra': ['Mumbai', 'Pune'],
  'Delhi': ['New Delhi', 'North Delhi'],
  'Telangana': ['Hyderabad'],
  'Andhra Pradesh': ['Visakhapatnam'],
  'Gujarat': ['Ahmedabad', 'Surat']
};

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  
  const [step, setStep] = useState('shipping');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [upiId, setUpiId] = useState('');
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);

  const userAddressKey = user?.email ? `saved_address_${String(user.email).toLowerCase()}` : 'saved_address_guest';

  const [f, setF] = useState({
    name: user?.name || '',
    address: '',
    city: 'Erode',
    state: 'Tamil Nadu',
    postalCode: '',
    phone: ''
  });

  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  useEffect(() => {
    const saved = safeGetJSON(userAddressKey, null);
    if (saved) {
      setSavedAddress(saved);
      setF(saved);
    }
  }, [userAddressKey]);

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!f.name || !f.address || !f.postalCode || !f.phone) {
      setErr('Please fill in all address fields.');
      return;
    }
    setErr('');
    safeSetJSON(userAddressKey, f);
    setStep('payment');
  };

  const handleFinalPayment = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'upi' && !upiId) {
      setErr('Please enter your UPI ID or Mobile Number.');
      return;
    }

    setBusy(true);

    const validItems = (items || []).filter(i => i && i.product);

    const newOrder = {
      _id: 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      createdAt: new Date().toISOString(),
      shipping: f,
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : `UPI (${upiId})`,
      items: validItems.map(i => ({
        product: i.product._id || i.product.id,
        name: i.product.name,
        price: Number(i.product.price || i.product.salePrice || i.product.regularPrice || 0),
        image: i.product.image,
        quantity: Number(i.quantity) || 1
      })),
      total: Number(total) || 0,
      status: 'Processing'
    };

    try {
      const r = await api.post('/orders', {
        shipping: f,
        paymentMethod: newOrder.paymentMethod,
        items: validItems.map(i => ({ product: i.product._id || i.product.id, quantity: Number(i.quantity) || 1 }))
      });
      if (r.data?._id) newOrder._id = r.data._id;
    } catch (x) {}

    const existingOrders = safeGetJSON('user_orders', []);
    const updatedOrders = Array.isArray(existingOrders) ? [newOrder, ...existingOrders] : [newOrder];
    safeSetJSON('user_orders', updatedOrders);

    clear();
    setBusy(false);
    setSuccessOrder(newOrder);
    setStep('success');
  };

  if (step === 'success' && successOrder) {
    return (
      <section className="page" style={{ maxWidth: '650px', margin: '40px auto', textAlign: 'center' }}>
        <div style={{ background: '#fff', padding: '44px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ fontSize: '54px', marginBottom: '16px' }}>🎉</div>
          <span className="script-accent">Thank you for your purchase</span>
          <p className="eyebrow" style={{ marginTop: '6px' }}>ORDER CONFIRMED</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', margin: '8px 0 16px' }}>
            Payment Successful!
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Order ID: <strong>#{successOrder._id}</strong>
          </p>

          <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: '10px', textAlign: 'left', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Payment Method:</span>
              <strong>{successOrder.paymentMethod}</strong>
            </div>
            <hr style={{ borderColor: 'var(--border-light)', margin: '12px 0' }} />
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', marginBottom: '6px' }}>Shipping Address</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              <strong>{successOrder.shipping?.name}</strong><br />
              {successOrder.shipping?.address}, {successOrder.shipping?.city}, {successOrder.shipping?.state} - {successOrder.shipping?.postalCode}<br />
              Phone: {successOrder.shipping?.phone}
            </p>
            <hr style={{ borderColor: 'var(--border-light)', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '16px' }}>
              <span>Total Paid</span>
              <span>₹{Number(successOrder.total || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="primary" onClick={() => nav('/orders')}>View My Orders →</button>
            <Link to="/shop" style={{ padding: '14px 24px', textDecoration: 'none', color: 'var(--text-dark)', fontWeight: 600 }}>Continue Shopping</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page" style={{ maxWidth: '600px', margin: '20px auto' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
          <div style={{ fontWeight: step === 'shipping' ? 700 : 400 }}>1. Shipping Address</div>
          <div style={{ fontWeight: step === 'payment' ? 700 : 400 }}>2. Payment Method</div>
        </div>

        {step === 'shipping' && (
          <form onSubmit={handleProceedToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px' }}>Shipping Details</h1>

            {/* SAVED ADDRESS VS NEW ADDRESS TOGGLE */}
            {savedAddress && (
              <div style={{ background: 'var(--bg-primary)', padding: '18px', borderRadius: '10px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px' }}>📍 Saved Delivery Address</strong>
                  <button 
                    type="button" 
                    onClick={() => {
                      setUseNewAddress(!useNewAddress);
                      if (useNewAddress) setF(savedAddress);
                      else setF({ name: user?.name || '', address: '', city: 'Erode', state: 'Tamil Nadu', postalCode: '', phone: '' });
                    }} 
                    style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {useNewAddress ? 'Use Saved Address' : '+ Add New Address'}
                  </button>
                </div>
                {!useNewAddress && (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    <strong>{savedAddress.name}</strong><br />
                    {savedAddress.address}, {savedAddress.city}, {savedAddress.state} - {savedAddress.postalCode}<br />
                    Phone: {savedAddress.phone}
                  </p>
                )}
              </div>
            )}

            {(useNewAddress || !savedAddress) && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Full Name</label>
                  <input required placeholder="Suhirdha K S" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Street Address</label>
                  <input required placeholder="Door No, Street Name" value={f.address} onChange={e => setF({ ...f, address: e.target.value })} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>State</label>
                    <select value={f.state} onChange={e => setF({ ...f, state: e.target.value, city: CITIES[e.target.value]?.[0] || '' })}>
                      {INDIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>City</label>
                    <select value={f.city} onChange={e => setF({ ...f, city: e.target.value })}>
                      {(CITIES[f.state] || []).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Postal Code</label>
                    <input required placeholder="638153" value={f.postalCode} onChange={e => setF({ ...f, postalCode: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Phone Number</label>
                    <input required placeholder="9876543210" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} />
                  </div>
                </div>
              </>
            )}

            {err && <div style={{ color: '#dc2626', background: '#fee2e2', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>{err}</div>}

            <button className="primary wide" style={{ marginTop: '12px' }}>
              Proceed to Payment → (₹{Number(total || 0).toLocaleString('en-IN')})
            </button>
          </form>
        )}

        {step === 'payment' && (
          <form onSubmit={handleFinalPayment} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px' }}>Select Payment Method</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Total Amount: <strong>₹{Number(total || 0).toLocaleString('en-IN')}</strong></p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', border: paymentMethod === 'cod' ? '2px solid var(--text-dark)' : '1px solid var(--border-light)', borderRadius: '10px', cursor: 'pointer' }}>
                <input type="radio" name="pm" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} style={{ width: 'auto' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '15px' }}>💵 Cash on Delivery (COD)</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pay with cash upon delivery.</span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', border: paymentMethod === 'upi' ? '2px solid var(--text-dark)' : '1px solid var(--border-light)', borderRadius: '10px', cursor: 'pointer' }}>
                <input type="radio" name="pm" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} style={{ width: 'auto' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '15px' }}>📱 UPI Payment (GPay, PhonePe, Paytm)</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Instant digital payment via UPI ID.</span>
                </div>
              </label>
            </div>

            {paymentMethod === 'upi' && (
              <div style={{ background: 'var(--bg-primary)', padding: '18px', borderRadius: '10px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>UPI ID / Mobile Number</label>
                <input required placeholder="name@okaxis or 9876543210@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
              </div>
            )}

            {err && <div style={{ color: '#dc2626', background: '#fee2e2', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>{err}</div>}

            <div style={{ display: 'flex', gap: '14px', marginTop: '12px' }}>
              <button type="button" onClick={() => setStep('shipping')} style={{ padding: '14px 20px', background: '#fff', border: '1px solid var(--border-light)', borderRadius: '30px', fontWeight: 600, cursor: 'pointer' }}>
                ← Edit Address
              </button>
              <button className="primary" disabled={busy} style={{ flex: 1 }}>
                {busy ? 'Processing Payment...' : `Complete Payment (₹${Number(total || 0).toLocaleString('en-IN')}) →`}
              </button>
            </div>
          </form>
        )}

      </div>
    </section>
  );
}