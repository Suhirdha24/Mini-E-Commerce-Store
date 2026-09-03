import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { TrashIcon, ArrowRightIcon, ShieldIcon, TruckIcon } from '../components/Icons';

export default function Cart() {
  const { items, update, remove, total } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'NOVA20') {
      const disc = Math.round(total * 0.2);
      setDiscount(disc);
      setPromoMsg('Promo code "NOVA20" applied! (20% OFF)');
    } else if (promoCode.trim().toUpperCase() === 'WELCOME100') {
      const disc = Math.min(100, total);
      setDiscount(disc);
      setPromoMsg('Promo code "WELCOME100" applied! (₹100 OFF)');
    } else {
      setDiscount(0);
      setPromoMsg('Invalid promo code. Try "NOVA20"');
    }
  };

  if (!items.length) {
    return (
      <div className="container page" style={{ textAlign: 'center', padding: '96px 24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-dark)' }}>
          Your shopping cart is empty
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>
          Discover our curated collection of precision audio, technical bags, and everyday essentials.
        </p>
        <Link to="/shop" className="btn btn-primary">
          <span>Explore Catalog</span>
          <ArrowRightIcon size={14} />
        </Link>
      </div>
    );
  }

  const finalTotal = Math.max(0, total - discount);

  return (
    <div className="container page">
      {/* BREADCRUMBS */}
      <nav style={{ display: 'flex', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
        <Link to="/home" style={{ color: 'var(--text-muted)' }}>Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Shopping Bag</span>
      </nav>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
          Shopping Cart ({items.length})
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Items in your cart are reserved for immediate checkout.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px', alignItems: 'start' }}>
        {/* CART ITEMS LIST */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          {items.map((i) => {
            const pId = i.product._id || i.product.id || i.product.sku;
            const unitPrice = Number(i.product.salePrice || i.product.price || 0);

            return (
              <div 
                key={pId} 
                style={{ 
                  display: 'flex', 
                  gap: '18px', 
                  padding: '18px 0', 
                  borderBottom: '1px solid var(--border)', 
                  alignItems: 'center' 
                }}
              >
                {/* 1:1 THUMBNAIL */}
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: 'var(--bg-secondary)', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0,
                  overflow: 'hidden'
                }}>
                  <img 
                    src={i.product.image} 
                    alt={i.product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <span className="eyebrow" style={{ fontSize: '10.5px' }}>{i.product.category || 'Product'}</span>
                  <Link to={`/product/${pId}`}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-dark)', margin: '2px 0 6px' }}>
                      {i.product.name}
                    </h3>
                  </Link>
                  <p style={{ color: 'var(--text-dark)', fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>
                    ₹{unitPrice.toLocaleString('en-IN')}
                  </p>
                  
                  {/* QUANTITY CONTROLS */}
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', background: 'var(--bg-surface)' }}>
                      <button 
                        onClick={() => update(pId, i.quantity - 1)} 
                        style={{ border: 'none', background: 'none', padding: '4px 12px', fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}
                      >
                        −
                      </button>
                      <span style={{ fontSize: '13px', fontWeight: 700, width: '24px', textAlign: 'center' }}>{i.quantity}</span>
                      <button 
                        disabled={i.quantity >= (i.product.stock || 10)} 
                        onClick={() => update(pId, i.quantity + 1)} 
                        style={{ border: 'none', background: 'none', padding: '4px 12px', fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => remove(pId)} 
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'var(--accent-red)', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}
                    >
                      <TrashIcon size={14} /> Remove
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', whiteSpace: 'nowrap' }}>
                  ₹{(unitPrice * i.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            );
          })}
        </div>

        {/* ORDER SUMMARY */}
        <aside style={{ background: 'var(--bg-surface)', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '18px', color: 'var(--text-dark)' }}>
            Order Summary
          </h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Subtotal ({items.length} items)</span>
            <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>₹{total.toLocaleString('en-IN')}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Standard Delivery</span>
            <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Free Express Delivery</span>
          </div>

          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: 'var(--accent-green)' }}>
              <span>Promo Discount</span>
              <span style={{ fontWeight: 600 }}>-₹{discount.toLocaleString('en-IN')}</span>
            </div>
          )}

          {/* PROMO CODE INPUT */}
          <form onSubmit={handleApplyPromo} style={{ margin: '16px 0', display: 'flex', gap: '8px' }}>
            <input 
              placeholder="Promo Code (NOVA20)"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
              style={{ fontSize: '13px', padding: '8px 12px', textTransform: 'uppercase' }}
            />
            <button type="submit" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '13px' }}>
              Apply
            </button>
          </form>
          {promoMsg && (
            <p style={{ fontSize: '12px', color: discount > 0 ? 'var(--accent-green)' : 'var(--accent-red)', marginBottom: '12px' }}>
              {promoMsg}
            </p>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)' }}>
            <span>Estimated Total</span>
            <span>₹{finalTotal.toLocaleString('en-IN')}</span>
          </div>

          <button 
            className="btn btn-primary btn-wide" 
            style={{ padding: '14px', fontSize: '15px' }}
            onClick={() => (user ? nav('/checkout') : nav('/login'))}
          >
            {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <ShieldIcon size={14} />
            <span>Secure 256-bit encrypted checkout</span>
          </div>
        </aside>
      </div>
    </div>
  );
}