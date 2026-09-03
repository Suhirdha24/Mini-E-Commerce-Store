import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, update, remove, total } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();

  if (!items.length) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '10px' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '14px' }}>Discover something from our featured collection.</p>
        <Link className="primary" to="/shop">Shop Products</Link>
      </div>
    );
  }

  return (
    <section className="page" style={{ maxWidth: '1000px' }}>
      <h1 className="page-title">Shopping Cart</h1>
      <p className="page-sub">Review {items.length} item(s) in your cart</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '40px', alignItems: 'start' }}>
        <div>
          {items.map((i) => {
            const pId = i.product._id || i.product.id;
            return (
              <div key={pId} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}>
                <div style={{ width: '76px', height: '76px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img src={i.product.image} alt={i.product.name} style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{i.product.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '8px' }}>₹{i.product.price?.toLocaleString('en-IN')}</p>
                  
                  {/* QUANTITY CONTROLS */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-pill)', background: '#FFFFFF' }}>
                      <button 
                        onClick={() => update(pId, i.quantity - 1)} 
                        style={{ border: 'none', background: 'none', padding: '4px 10px', fontSize: '13px', fontWeight: 700 }}
                      >
                        −
                      </button>
                      <span style={{ fontSize: '13px', fontWeight: 600, width: '20px', textAlign: 'center' }}>{i.quantity}</span>
                      <button 
                        disabled={i.quantity >= i.product.stock} 
                        onClick={() => update(pId, i.quantity + 1)} 
                        style={{ border: 'none', background: 'none', padding: '4px 10px', fontSize: '13px', fontWeight: 700 }}
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => remove(pId)} 
                      style={{ marginLeft: '12px', background: 'none', border: 'none', color: 'var(--danger)', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '15px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  ₹{(i.product.price * i.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            );
          })}
        </div>

        {/* ORDER SUMMARY */}
        <aside style={{ background: 'var(--bg-muted)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px' }}>Order Summary</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13.5px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
            <span style={{ fontWeight: 600 }}>₹{total.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13.5px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>Free</span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '14px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '16px', fontWeight: 700 }}>
            <span>Total</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
          <button 
            className="primary" 
            style={{ width: '100%' }}
            onClick={() => (user ? nav('/checkout') : nav('/login'))}
          >
            {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
          </button>
        </aside>
      </div>
    </section>
  );
}