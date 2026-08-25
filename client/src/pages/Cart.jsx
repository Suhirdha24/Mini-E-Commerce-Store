import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, update, remove, total } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();

  if (!items.length) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', marginBottom: '16px' }}>Your bag is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Discover something special from our curated collection.</p>
        <Link className="primary" to="/shop">Explore Collection →</Link>
      </div>
    );
  }

  return (
    <section className="page" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <p className="eyebrow">YOUR SELECTION</p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '40px', marginBottom: '32px' }}>Review Bag ({items.length} Items)</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '48px', alignItems: 'start' }}>
        <div>
          {items.map((i) => {
            const pId = i.product._id || i.product.id;
            return (
              <div key={pId} style={{ display: 'flex', gap: '20px', padding: '20px 0', borderBottom: '1px solid var(--border-light)', alignItems: 'center' }}>
                <img src={i.product.image} alt={i.product.name} style={{ width: '90px', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px' }}>{i.product.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '4px 0 8px' }}>₹{i.product.price?.toLocaleString('en-IN')}</p>
                  
                  {/* STOCK REMAINING MESSAGE */}
                  <small style={{ color: i.product.stock < 5 ? '#d97706' : 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>
                    {i.product.stock < 5 ? `Only ${i.product.stock} left in stock!` : `${i.product.stock} available`}
                  </small>

                  {/* QUANTITY ADJUSTMENT CONTROLS */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button 
                      onClick={() => update(pId, i.quantity - 1)} 
                      style={{ width: '32px', height: '32px', border: '1px solid var(--border-light)', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 600, width: '24px', textAlign: 'center' }}>{i.quantity}</span>
                    <button 
                      disabled={i.quantity >= i.product.stock} 
                      onClick={() => update(pId, i.quantity + 1)} 
                      style={{ width: '32px', height: '32px', border: '1px solid var(--border-light)', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                    >
                      +
                    </button>

                    {/* REMOVE PRODUCT BUTTON */}
                    <button 
                      onClick={() => remove(pId)} 
                      style={{ marginLeft: '20px', background: 'none', border: 'none', color: '#dc2626', fontWeight: 600, cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <b style={{ fontSize: '16px' }}>₹{(i.product.price * i.quantity).toLocaleString('en-IN')}</b>
              </div>
            );
          })}
        </div>

        {/* ORDER SUMMARY */}
        <aside style={{ background: 'var(--bg-card)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '20px' }}>Order Summary</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span>Subtotal</span>
            <b>₹{total.toLocaleString('en-IN')}</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span>Shipping</span>
            <span style={{ color: '#16a34a', fontWeight: 600 }}>Free</span>
          </div>
          <hr style={{ borderColor: 'var(--border-light)', margin: '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '18px' }}>
            <span>Total</span>
            <b>₹{total.toLocaleString('en-IN')}</b>
          </div>
          <button className="primary wide" onClick={() => (user ? nav('/checkout') : nav('/login'))}>
            {user ? 'Proceed to Checkout →' : 'Sign in to Checkout'}
          </button>
        </aside>
      </div>
    </section>
  );
}