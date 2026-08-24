import { useEffect, useState } from 'react';
import api from '../api/api';

const defaultRetailerProducts = [
  { id: 'b1', name: 'Essential Leather Tote', category: 'Bags', price: 2899, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'f1', name: 'Aero Knit Sneakers', category: 'Footwear', price: 2499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', stock: 4 },
  { id: 'a1', name: 'Mono Chronograph Watch', category: 'Accessories', price: 3999, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: 'c1', name: 'Essential Cotton Hoodie', category: 'Apparel', price: 1599, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80', stock: 0 }
];

export default function Admin() {
  const [tab, setTab] = useState('inventory'); // 'inventory' | 'orders' | 'add'
  const [products, setProducts] = useState(defaultRetailerProducts);
  const [orders, setOrders] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Bags',
    image: '',
    stock: 10
  });

  const loadData = () => {
    // Load local storage orders placed by customers
    const localOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
    
    api.get('/products?limit=50')
      .then(r => { if (r.data.items?.length) setProducts(r.data.items); })
      .catch(() => {});

    api.get('/orders/admin/all')
      .then(r => {
        const combined = [...localOrders, ...(r.data || [])];
        const unique = Array.from(new Set(combined.map(o => o._id))).map(id => combined.find(o => o._id === id));
        setOrders(unique);
      })
      .catch(() => setOrders(localOrders));
  };

  useEffect(() => { loadData(); }, []);

  // ADD OR EDIT PRODUCT
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    const newProd = {
      _id: editingId || 'p-' + Date.now(),
      id: editingId || 'p-' + Date.now(),
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
      } else {
        await api.post('/products', form);
      }
    } catch (err) {
      // Local fallback for standalone retailer testing
    }

    if (editingId) {
      setProducts(products.map(p => (p._id === editingId || p.id === editingId) ? newProd : p));
    } else {
      setProducts([newProd, ...products]);
    }

    setForm({ name: '', description: '', price: '', category: 'Bags', image: '', stock: 10 });
    setEditingId(null);
    setTab('inventory');
  };

  // EDIT PRODUCT TRIGGER
  const handleStartEdit = (p) => {
    setEditingId(p._id || p.id);
    setForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      category: p.category,
      image: p.image,
      stock: p.stock
    });
    setTab('add');
  };

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product from your inventory?')) {
      try { await api.delete(`/products/${id}`); } catch (e) {}
      setProducts(products.filter(p => (p._id || p.id) !== id));
    }
  };

  // UPDATE ORDER STATUS
  const handleUpdateStatus = (orderId, newStatus) => {
    const updated = orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
    localStorage.setItem('user_orders', JSON.stringify(updated));
    try { api.patch(`/orders/${orderId}/status`, { status: newStatus }); } catch (e) {}
  };

  // STATS CALCULATIONS
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalAvailableStock = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <section className="page" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <p className="eyebrow">RETAILER PORTAL</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '38px' }}>Store & Inventory Management</h1>
        </div>

        <button 
          className="primary" 
          onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: '', category: 'Bags', image: '', stock: 10 }); setTab('add'); }}
        >
          + Add New Product
        </button>
      </div>

      {/* RETAILER DASHBOARD METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL REVENUE</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginTop: '4px' }}>₹{totalRevenue.toLocaleString('en-IN')}</h2>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL PRODUCTS</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginTop: '4px' }}>{products.length}</h2>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>AVAILABLE UNITS</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginTop: '4px' }}>{totalAvailableStock}</h2>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>STOCK ALERTS</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: (lowStockCount || outOfStockCount) ? '#dc2626' : 'var(--text-dark)', marginTop: '4px' }}>
            {lowStockCount + outOfStockCount} <small style={{ fontSize: '13px' }}>low/out</small>
          </h2>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-light)', marginBottom: '28px' }}>
        <button 
          onClick={() => setTab('inventory')}
          style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: tab === 'inventory' ? '2px solid var(--text-dark)' : 'none', fontWeight: tab === 'inventory' ? 700 : 500, cursor: 'pointer' }}
        >
          Inventory Catalog ({products.length})
        </button>
        <button 
          onClick={() => setTab('orders')}
          style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: tab === 'orders' ? '2px solid var(--text-dark)' : 'none', fontWeight: tab === 'orders' ? 700 : 500, cursor: 'pointer' }}
        >
          Sold Products & Customer Orders ({orders.length})
        </button>
        {tab === 'add' && (
          <button 
            style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: '2px solid var(--text-dark)', fontWeight: 700, cursor: 'pointer' }}
          >
            {editingId ? 'Edit Product' : 'Add Product'}
          </button>
        )}
      </div>

      {/* TAB 1: INVENTORY MANAGEMENT */}
      {tab === 'inventory' && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px' }}>Product Catalog & Stock Levels</h3>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 20px' }}>Product</th>
                <th style={{ padding: '14px 20px' }}>Category</th>
                <th style={{ padding: '14px 20px' }}>Price</th>
                <th style={{ padding: '14px 20px' }}>Stock Level</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id || p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img src={p.image} alt={p.name} style={{ width: '48px', height: '56px', objectFit: 'cover', borderRadius: '6px' }} />
                    <span style={{ fontWeight: 600 }}>{p.name}</span>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>{p.category}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>₹{p.price?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>{p.stock} units</td>
                  <td style={{ padding: '14px 20px' }}>
                    {p.stock === 0 ? (
                      <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>Out of Stock</span>
                    ) : p.stock < 5 ? (
                      <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>Low Stock ({p.stock})</span>
                    ) : (
                      <span style={{ background: '#def7ec', color: '#03543f', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>In Stock</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button onClick={() => handleStartEdit(p)} style={{ background: 'none', border: 'none', color: 'var(--text-dark)', fontWeight: 600, cursor: 'pointer', marginRight: '16px' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p._id || p.id)} style={{ background: 'none', border: 'none', color: '#dc2626', fontWeight: 600, cursor: 'pointer' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: SOLD PRODUCTS & CUSTOMER ORDERS */}
      {tab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.length ? (
            orders.map(o => (
              <div key={o._id} style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px' }}>Order #{o._id}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Customer: <strong>{o.shipping?.name || 'Customer'}</strong> | Phone: {o.shipping?.phone}</p>
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
                    <b style={{ fontSize: '18px' }}>₹{o.total?.toLocaleString('en-IN')}</b>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', fontSize: '14px' }}>
                  <strong style={{ display: 'block', marginBottom: '8px' }}>Purchased Items:</strong>
                  {o.items?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                      <span>{item.name} (Qty: {item.quantity})</span>
                      <b>₹{(item.price * item.quantity).toLocaleString('en-IN')}</b>
                    </div>
                  ))}
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

      {/* TAB 3: ADD / EDIT PRODUCT FORM */}
      {tab === 'add' && (
        <div style={{ background: '#fff', padding: '36px', borderRadius: '16px', border: '1px solid var(--border-light)', maxWidth: '600px', margin: '0 auto', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '24px' }}>
            {editingId ? 'Edit Inventory Product' : 'Add New Product to Store'}
          </h2>

          <form onSubmit={handleSubmitProduct} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Product Title</label>
              <input required placeholder="e.g. Essential Leather Backpack" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="Bags">Bags</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Home">Home</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Price (₹)</label>
                <input type="number" required placeholder="2499" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Inventory Stock Units</label>
                <input type="number" required placeholder="15" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Image URL</label>
                <input required placeholder="https://images.unsplash.com/..." value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Description</label>
              <textarea rows="3" placeholder="Product description, materials, sizing details..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
              <button className="primary" style={{ flex: 1 }}>{editingId ? 'Save Product Changes' : 'Upload Product to Store'}</button>
              <button type="button" onClick={() => setTab('inventory')} style={{ padding: '14px 24px', background: '#fff', border: '1px solid var(--border-light)', borderRadius: '30px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}