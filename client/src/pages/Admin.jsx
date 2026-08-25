import { useEffect, useState } from 'react';
import api from '../api/api';

const defaultRetailerProducts = [
  { id: 'b1', name: 'Essential Leather Tote', category: 'Bags', price: 2899, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'f1', name: 'Aero Knit Sneakers', category: 'Footwear', price: 2499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', stock: 4 },
  { id: 'a1', name: 'Mono Chronograph Watch', category: 'Accessories', price: 3999, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', stock: 12 }
];

export default function Admin() {
  const [tab, setTab] = useState('inventory');
  const [products, setProducts] = useState(defaultRetailerProducts);
  const [orders, setOrders] = useState([]);

  const loadData = () => {
    const localOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
    api.get('/products?limit=50').then(r => { if (r.data.items?.length) setProducts(r.data.items); }).catch(() => {});
    api.get('/orders/admin/all').then(r => {
      const combined = [...localOrders, ...(r.data || [])];
      const unique = Array.from(new Set(combined.map(o => o._id))).map(id => combined.find(o => o._id === id));
      setOrders(unique);
    }).catch(() => setOrders(localOrders));
  };

  useEffect(() => { loadData(); }, []);

  const handleUpdateStatus = (orderId, newStatus) => {
    const updated = orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
    localStorage.setItem('user_orders', JSON.stringify(updated));
  };

  return (
    <section className="page" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <p className="eyebrow">RETAILER PORTAL</p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '38px', marginBottom: '32px' }}>Customer Orders & Store Management</h1>

      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-light)', marginBottom: '28px' }}>
        <button onClick={() => setTab('inventory')} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: tab === 'inventory' ? '2px solid var(--text-dark)' : 'none', fontWeight: tab === 'inventory' ? 700 : 500, cursor: 'pointer' }}>
          Inventory Catalog ({products.length})
        </button>
        <button onClick={() => setTab('orders')} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: tab === 'orders' ? '2px solid var(--text-dark)' : 'none', fontWeight: tab === 'orders' ? 700 : 500, cursor: 'pointer' }}>
          Customer Orders ({orders.length})
        </button>
      </div>

      {/* TAB 2: DETAILED CUSTOMER ORDERS */}
      {tab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.length ? (
            orders.map(o => (
              <div key={o._id} style={{ background: '#fff', padding: '28px', borderRadius: '14px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px' }}>Order #{o._id}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Placed on {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <select 
                      value={o.status || 'Processing'} 
                      onChange={e => handleUpdateStatus(o._id, e.target.value)}
                      style={{ padding: '8px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, width: 'auto' }}
                    >
                      <option value="Processing">Status: Processing</option>
                      <option value="Shipped">Status: Shipped</option>
                      <option value="Delivered">Status: Delivered</option>
                      <option value="Cancelled">Status: Cancelled</option>
                    </select>
                    <b style={{ fontSize: '20px' }}>₹{o.total?.toLocaleString('en-IN')}</b>
                  </div>
                </div>

                {/* COMPLETE CUSTOMER DETAILS BOX */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'var(--bg-primary)', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', marginBottom: '6px' }}>Customer Contact Profile</h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                      Name: <strong>{o.shipping?.name || 'Customer'}</strong><br />
                      Phone: <strong>{o.shipping?.phone || 'N/A'}</strong><br />
                      Payment Method: <strong>{o.paymentMethod || 'Cash on Delivery (COD)'}</strong>
                    </p>
                  </div>

                  <div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', marginBottom: '6px' }}>Full Delivery Address</h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                      {o.shipping?.address}<br />
                      {o.shipping?.city}, {o.shipping?.state} - <strong>{o.shipping?.postalCode}</strong>
                    </p>
                  </div>
                </div>

                {/* PURCHASED ITEMS SNAPSHOT WITH PHOTOS */}
                <div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', marginBottom: '12px' }}>Ordered Products</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {o.items?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          {item.image && <img src={item.image} alt={item.name} style={{ width: '50px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />}
                          <div>
                            <strong style={{ fontSize: '15px' }}>{item.name}</strong>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quantity: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                        <b>₹{(item.price * item.quantity).toLocaleString('en-IN')}</b>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              No customer orders received yet.
            </div>
          )}
        </div>
      )}
    </section>
  );
}