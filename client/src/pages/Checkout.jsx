import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { safeGetJSON, safeSetJSON } from '../utils/storage.js';
import { CheckIcon, ArrowRightIcon } from '../components/Icons';

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

    const validItems = (items || []).filter(i => i && (i.product || i.id || i._id));
    if (validItems.length === 0) {
      setErr('Your shopping cart is empty.');
      return;
    }

    setBusy(true);
    setErr('');

    const formattedPaymentMethod = paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : `UPI (${upiId})`;

    const orderPayload = {
      shipping: f,
      paymentMethod: formattedPaymentMethod,
      items: validItems.map(i => ({
        product: i.product?._id || i.product?.id || i.id || i._id,
        quantity: Number(i.quantity) || 1
      }))
    };

    try {
      const response = await api.post('/orders', orderPayload);
      const placedOrder = response.data;

      clear();
      setBusy(false);
      setSuccessOrder(placedOrder);
      setStep('success');
    } catch (apiErr) {
      setBusy(false);
      const errMsg = apiErr.response?.data?.message || apiErr.message || 'Failed to place order. Please try again.';
      setErr(errMsg);
    }
  };

  if (step === 'success' && successOrder) {
    const orderId = successOrder.id || successOrder._id || 'CONFIRMED';

    return (
      <section className="page" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
        <div style={{ background: '#fff', padding: '36px', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
            <CheckIcon size={28} />
          </div>
          <p className="eyebrow" style={{ color: '#059669', fontWeight: 600 }}>ORDER CONFIRMED</p>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '8px 0 12px' }}>
            Payment Successful!
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>
            Order ID: <strong>#{orderId}</strong>
          </p>

          <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', textAlign: 'left', marginBottom: '24px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
              <strong style={{ color: 'var(--text-dark)' }}>{successOrder.payment_method || successOrder.paymentMethod}</strong>
            </div>
            <hr style={{ borderColor: 'var(--border)', margin: '12px 0' }} />
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Shipping Address</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--text-dark)' }}>{f.name}</strong><br />
              {f.address}, {f.city}, {f.state} - {f.postalCode}<br />
              Phone: {f.phone}
            </p>
            <hr style={{ borderColor: 'var(--border)', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '15px' }}>
              <span>Total Paid</span>
              <span>₹{Number(successOrder.total || total || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="primary" onClick={() => nav('/orders')}>View My Orders</button>
            <Link to="/shop" style={{ padding: '10px 20px', textDecoration: 'none', color: 'var(--text-dark)', fontWeight: 500, fontSize: '14px' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page" style={{ maxWidth: '600px', margin: '20px auto' }}>
      <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '14px', fontSize: '14px' }}>
          <div style={{ fontWeight: step === 'shipping' ? 600 : 400, color: step === 'shipping' ? 'var(--text-dark)' : 'var(--text-muted)' }}>
            1. Shipping Address
          </div>
          <div style={{ fontWeight: step === 'payment' ? 600 : 400, color: step === 'payment' ? 'var(--text-dark)' : 'var(--text-muted)' }}>
            2. Payment Method
          </div>
        </div>

        {step === 'shipping' && (
          <form onSubmit={handleProceedToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 600 }}>Shipping Details</h1>

            {savedAddress && (
              <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckIcon size={14} /> Saved Delivery Address
                  </strong>
                  <button 
                    type="button" 
                    onClick={() => {
                      setUseNewAddress(!useNewAddress);
                      if (useNewAddress) setF(savedAddress);
                      else setF({ name: user?.name || '', address: '', city: 'Erode', state: 'Tamil Nadu', postalCode: '', phone: '' });
                    }} 
                    style={{ background: 'none', border: 'none', color: 'var(--text-dark)', textDecoration: 'underline', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
                  >
                    {useNewAddress ? 'Use Saved Address' : '+ Add New Address'}
                  </button>
                </div>
                {!useNewAddress && (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
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
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Full Name</label>
                  <input required placeholder="Your Full Name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Street Address</label>
                  <input required placeholder="Door No, Street Name" value={f.address} onChange={e => setF({ ...f, address: e.target.value })} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>State</label>
                    <select value={f.state} onChange={e => setF({ ...f, state: e.target.value, city: CITIES[e.target.value]?.[0] || '' })}>
                      {INDIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>City</label>
                    <select value={f.city} onChange={e => setF({ ...f, city: e.target.value })}>
                      {(CITIES[f.state] || []).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Postal Code</label>
                    <input required placeholder="638153" value={f.postalCode} onChange={e => setF({ ...f, postalCode: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Phone Number</label>
                    <input required placeholder="9876543210" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} />
                  </div>
                </div>
              </>
            )}

            {err && <div style={{ color: '#dc2626', background: '#fee2e2', padding: '10px 14px', borderRadius: '6px', fontSize: '13px' }}>{err}</div>}

            <button className="primary wide" style={{ marginTop: '8px' }}>
              Proceed to Payment (₹{Number(total || 0).toLocaleString('en-IN')})
            </button>
          </form>
        )}

        {step === 'payment' && (
          <form onSubmit={handleFinalPayment} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 600 }}>Select Payment Method</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Total Amount: <strong>₹{Number(total || 0).toLocaleString('en-IN')}</strong></p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', border: paymentMethod === 'cod' ? '2px solid var(--text-dark)' : '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}>
                <input type="radio" name="pm" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} style={{ width: 'auto' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '14px' }}>Cash on Delivery (COD)</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pay with cash upon delivery.</span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', border: paymentMethod === 'upi' ? '2px solid var(--text-dark)' : '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}>
                <input type="radio" name="pm" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} style={{ width: 'auto' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '14px' }}>UPI Payment (GPay, PhonePe, Paytm)</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Instant digital payment via UPI ID.</span>
                </div>
              </label>
            </div>

            {paymentMethod === 'upi' && (
              <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>UPI ID / Mobile Number</label>
                <input required placeholder="name@okaxis or 9876543210@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
              </div>
            )}

            {err && <div style={{ color: '#dc2626', background: '#fee2e2', padding: '10px 14px', borderRadius: '6px', fontSize: '13px' }}>{err}</div>}

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="button" onClick={() => setStep('shipping')} style={{ padding: '10px 18px', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontWeight: 500, fontSize: '14px', cursor: 'pointer' }}>
                Back to Address
              </button>
              <button className="primary" disabled={busy} style={{ flex: 1 }}>
                {busy ? 'Processing...' : `Pay ₹${Number(total || 0).toLocaleString('en-IN')}`}
              </button>
            </div>
          </form>
        )}

      </div>
    </section>
  );
}