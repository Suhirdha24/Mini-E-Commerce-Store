import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const INDIAN_STATES = [
  'Tamil Nadu', 'Karnataka', 'Kerala', 'Maharashtra', 
  'Delhi', 'Telangana', 'Andhra Pradesh', 'Gujarat'
];

const CITIES = {
  'Tamil Nadu': ['Erode', 'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi'],
  'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi'],
  'Telangana': ['Hyderabad', 'Warangal'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara']
};

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  
  const [step, setStep] = useState('shipping'); // 'shipping' | 'payment' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'upi'
  const [upiId, setUpiId] = useState('');
  const [saveAddress, setSaveAddress] = useState(true);

  const userAddressKey = user ? `saved_address_${user.email}` : 'saved_address_guest';

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

  // AUTO-FILL FLIPKART STYLE SAVED ADDRESS
  useEffect(() => {
    const saved = localStorage.getItem(userAddressKey);
    if (saved) {
      setF(JSON.parse(saved));
    }
  }, [userAddressKey]);

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    const availableCities = CITIES[selectedState] || [];
    setF({
      ...f,
      state: selectedState,
      city: availableCities[0] || ''
    });
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!f.name || !f.address || !f.postalCode || !f.phone) {
      setErr('Please fill in all shipping fields.');
      return;
    }
    setErr('');

    // Save Flipkart-style address for future orders
    if (saveAddress) {
      localStorage.setItem(userAddressKey, JSON.stringify(f));
    }

    setStep('payment');
  };

  const handleFinalPayment = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'upi' && !upiId) {
      setErr('Please enter your UPI ID or Mobile Number.');
      return;
    }

    setBusy(true);
    setErr('');

    const newOrder = {
      _id: 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      createdAt: new Date().toISOString(),
      shipping: f,
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : `UPI (${upiId})`,
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
      const r = await api.post('/orders', {
        shipping: f,
        paymentMethod: newOrder.paymentMethod,
        items: items.map(i => ({ product: i.product._id || i.product.id, quantity: i.quantity }))
      });
      if (r.data?._id) newOrder._id = r.data._id;
    } catch (x) {}

    const existingOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
    localStorage.setItem('user_orders', JSON.stringify([newOrder, ...existingOrders]));

    clear();
    setBusy(false);
    setSuccessOrder(newOrder);
    setStep('success');
  };

  // 1. ORDER SUCCESS SCREEN
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
              <strong>{successOrder.shipping.name}</strong><br />
              {successOrder.shipping.address}, {successOrder.shipping.city}, {successOrder.shipping.state} - {successOrder.shipping.postalCode}<br />
              Phone: {successOrder.shipping.phone}
            </p>
            <hr style={{ borderColor: 'var(--border-light)', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '16px' }}>
              <span>Total Paid</span>
              <span>₹{successOrder.total?.toLocaleString('en-IN')}</span>
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
        
        {/* CHECKOUT STEP INDICATOR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
          <div style={{ fontWeight: step === 'shipping' ? 700 : 400, color: step === 'shipping' ? 'var(--text-dark)' : 'var(--text-muted)' }}>
            1. Shipping Address
          </div>
          <div style={{ fontWeight: step === 'payment' ? 700 : 400, color: step === 'payment' ? 'var(--text-dark)' : 'var(--text-muted)' }}>
            2. Payment Method
          </div>
        </div>

        {/* STEP 1: SHIPPING DETAILS */}
        {step === 'shipping' && (
          <form onSubmit={handleProceedToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px' }}>Shipping Details</h1>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Full Name</label>
              <input required placeholder="Suhirdha K S" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Street Address</label>
              <input required placeholder="Door No, Street Name, Locality" value={f.address} onChange={e => setF({ ...f, address: e.target.value })} />
            </div>

            {/* DROPDOWNS FOR STATE & CITY */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>State</label>
                <select value={f.state} onChange={handleStateChange}>
                  {INDIAN_STATES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>City</label>
                <select value={f.city} onChange={e => setF({ ...f, city: e.target.value })}>
                  {(CITIES[f.state] || []).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
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

            {/* FLIPKART STYLE AUTO-SAVE CHECKBOX */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-muted)', cursor: 'pointer', marginTop: '6px' }}>
              <input 
                type="checkbox" 
                checked={saveAddress} 
                onChange={e => setSaveAddress(e.target.checked)} 
                style={{ width: 'auto' }} 
              />
              Save address for future orders (like Flipkart)
            </label>

            {err && <div style={{ color: '#dc2626', background: '#fee2e2', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>{err}</div>}

            <button className="primary wide" style={{ marginTop: '12px' }}>
              Proceed to Payment → (₹{total?.toLocaleString('en-IN')})
            </button>
          </form>
        )}

        {/* STEP 2: PAYMENT PAGE (COD vs UPI) */}
        {step === 'payment' && (
          <form onSubmit={handleFinalPayment} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px' }}>Select Payment Method</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Total Amount to Pay: <strong>₹{total?.toLocaleString('en-IN')}</strong></p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* CASH ON DELIVERY OPTION */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', border: paymentMethod === 'cod' ? '2px solid var(--text-dark)' : '1px solid var(--border-light)', borderRadius: '10px', cursor: 'pointer', background: paymentMethod === 'cod' ? '#fcfbf9' : '#fff' }}>
                <input 
                  type="radio" 
                  name="pm" 
                  checked={paymentMethod === 'cod'} 
                  onChange={() => setPaymentMethod('cod')} 
                  style={{ width: 'auto' }} 
                />
                <div>
                  <strong style={{ display: 'block', fontSize: '15px' }}>💵 Cash on Delivery (COD)</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pay with cash upon delivery to your doorstep.</span>
                </div>
              </label>

              {/* UPI PAYMENT OPTION */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', border: paymentMethod === 'upi' ? '2px solid var(--text-dark)' : '1px solid var(--border-light)', borderRadius: '10px', cursor: 'pointer', background: paymentMethod === 'upi' ? '#fcfbf9' : '#fff' }}>
                <input 
                  type="radio" 
                  name="pm" 
                  checked={paymentMethod === 'upi'} 
                  onChange={() => setPaymentMethod('upi')} 
                  style={{ width: 'auto' }} 
                />
                <div>
                  <strong style={{ display: 'block', fontSize: '15px' }}>📱 UPI / QR Payment (GPay, PhonePe, Paytm)</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Instant, secure digital payment via UPI ID or Mobile Number.</span>
                </div>
              </label>
            </div>

            {/* UPI INPUT FIELD */}
            {paymentMethod === 'upi' && (
              <div style={{ background: 'var(--bg-primary)', padding: '18px', borderRadius: '10px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Enter your UPI ID or Mobile Number</label>
                <input 
                  required 
                  placeholder="name@okaxis or 9876543210@upi" 
                  value={upiId} 
                  onChange={e => setUpiId(e.target.value)} 
                />
              </div>
            )}

            {err && <div style={{ color: '#dc2626', background: '#fee2e2', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>{err}</div>}

            <div style={{ display: 'flex', gap: '14px', marginTop: '12px' }}>
              <button type="button" onClick={() => setStep('shipping')} style={{ padding: '14px 20px', background: '#fff', border: '1px solid var(--border-light)', borderRadius: '30px', fontWeight: 600, cursor: 'pointer' }}>
                ← Edit Address
              </button>
              <button className="primary" disabled={busy} style={{ flex: 1 }}>
                {busy ? 'Processing Payment...' : `Complete Payment (₹${total?.toLocaleString('en-IN')}) →`}
              </button>
            </div>
          </form>
        )}

      </div>
    </section>
  );
}