import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState('dashboard'); // 'dashboard' | 'inventory' | 'add' | 'orders' | 'coupons'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // COUPONS & DISCOUNTS MANAGEMENT
  const [coupons, setCoupons] = useState([
    { id: 'c1', code: 'NOVA20', discount: '20% OFF', active: true },
    { id: 'c2', code: 'WELCOME100', discount: '₹100 OFF', active: true }
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');

  const [form, setForm] = useState({
    sku: '', name: '', description: '', regularPrice: '', salePrice: '', costPrice: '', category: 'Bags', image: '', stock: 10, active: true
  });

  const getPId = p => String(p?.id || p?._id || '');

  // Load all products and global customer orders directly from Cloud PostgreSQL
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes] = await Promise.all([
        api.get('/products?limit=100'),
        api.get('/orders/admin/all').catch(() => ({ data: [] }))
      ]);

      if (prodRes.data?.items) {
        setProducts(prodRes.data.items);
      } else if (Array.isArray(prodRes.data)) {
        setProducts(prodRes.data);
      }

      if (Array.isArray(orderRes.data)) {
        setOrders(orderRes.data);
      }
    } catch (err) {
      setErrorMsg('Failed to load database data: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleAdjustPrice = async (product, delta) => {
    const pId = getPId(product);
    const currentPrice = Number(product.salePrice || product.regularPrice || product.price || 0);
    const newPrice = Math.max(1, currentPrice + delta);

    try {
      await api.put(`/products/${pId}`, {
        price: newPrice,
        salePrice: newPrice
      });
      setProducts(products.map(p => getPId(p) === pId ? { ...p, price: newPrice, salePrice: newPrice } : p));
    } catch (err) {
      alert('Failed to update price in database: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAdjustStock = async (product, delta) => {
    const pId = getPId(product);
    const newStock = Math.max(0, Number(product.stock || 0) + delta);

    try {
      await api.put(`/products/${pId}`, {
        stock: newStock,
        active: newStock > 0
      });
      setProducts(products.map(p => getPId(p) === pId ? { ...p, stock: newStock, active: newStock > 0 } : p));
    } catch (err) {
      alert('Failed to adjust stock in database: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleStatus = async (productId, currentActive) => {
    try {
      await api.put(`/products/${productId}`, {
        active: !currentActive
      });
      setProducts(products.map(p => getPId(p) === String(productId) ? { ...p, active: !currentActive } : p));
    } catch (err) {
      alert('Failed to toggle status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Delete this product permanently from the cloud database?')) {
      try {
        await api.delete(`/products/${productId}`);
        setProducts(products.filter(p => getPId(p) !== String(productId)));
      } catch (err) {
        alert('Failed to delete product: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => (o.id === orderId || o._id === orderId) ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Failed to update order status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!form.sku || !form.name || !form.regularPrice || !form.image) {
      setErrorMsg('Please fill in all required fields (SKU, Name, Regular Price, and Image URL).');
      return;
    }

    const payload = {
      ...form,
      regularPrice: Number(form.regularPrice),
      salePrice: form.salePrice ? Number(form.salePrice) : Number(form.regularPrice),
      costPrice: form.costPrice ? Number(form.costPrice) : 0,
      price: form.salePrice ? Number(form.salePrice) : Number(form.regularPrice),
      stock: Number(form.stock)
    };

    try {
      if (editingId) {
        const res = await api.put(`/products/${editingId}`, payload);
        const updated = res.data;
        setProducts(products.map(p => getPId(p) === String(editingId) ? updated : p));
        setSuccessMsg(`✓ Product "${form.name}" updated successfully in Supabase DB!`);
      } else {
        const res = await api.post('/products', payload);
        const created = res.data;
        setProducts([created, ...products]);
        setSuccessMsg(`✓ New product "${form.name}" added to Supabase DB & live in Store!`);
      }

      setForm({ sku: '', name: '', description: '', regularPrice: '', salePrice: '', costPrice: '', category: 'Bags', image: '', stock: 10, active: true });
      setEditingId(null);
      setTimeout(() => { setSuccessMsg(''); setTab('inventory'); }, 1200);
    } catch (err) {
      setErrorMsg('Database save error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode || !newCouponDiscount) return;
    setCoupons([...coupons, { id: 'c-' + Date.now(), code: newCouponCode.toUpperCase(), discount: newCouponDiscount, active: true }]);
    setNewCouponCode('');
    setNewCouponDiscount('');
  };

  const totalRevenue = (orders || []).reduce((sum, o) => sum + (Number(o?.total) || 0), 0);
  const lowStockCount = (products || []).filter(p => Number(p?.stock) > 0 && Number(p?.stock) < 5).length;

  if (user && user.role !== 'admin') {
    return (
      <section className="page" style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'center' }}>
        <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '12px' }}>Admin Access Only</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>
            You are logged in as customer (<strong>{user.email}</strong>). Please sign in with an Administrator account to view this dashboard.
          </p>
          <Link className="primary" to="/login">Sign in as Admin</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page" style={{ maxWidth: '1150px', margin: '0 auto' }}>
      {/* STANDALONE ADMIN HEADER BANNER */}
      <div style={{ background: '#0f172a', color: '#fff', padding: '16px 24px', borderRadius: '12px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🛡️</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#f8fafc', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>NOVA CLOUD MANAGEMENT CONSOLE</h3>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Connected to Supabase PostgreSQL Database</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={loadAdminData} style={{ background: '#334155', border: '1px solid #475569', color: '#f8fafc', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            🔄 Refresh Live DB
          </button>
          <Link to="/shop" style={{ background: '#3b82f6', color: '#fff', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
            🛍️ View Customer Store →
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <p className="eyebrow">ENTERPRISE ADMIN PORTAL</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '38px' }}>Store Management Dashboard</h1>
        </div>

        <button className="primary" onClick={() => { setEditingId(null); setTab('add'); }}>
          + Add New Product
        </button>
      </div>

      {/* DASHBOARD METRICS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>GLOBAL REVENUE</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', marginTop: '4px' }}>₹{totalRevenue.toLocaleString('en-IN')}</h2>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL DB ORDERS</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', marginTop: '4px' }}>{orders.length} Orders</h2>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>INVENTORY CATALOG</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', marginTop: '4px' }}>{products.length} Products</h2>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>LOW STOCK ALERTS</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: lowStockCount ? '#d97706' : 'var(--text-dark)', marginTop: '4px' }}>{lowStockCount} Items</h2>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', marginBottom: '28px', flexWrap: 'wrap' }}>
        <button onClick={() => setTab('dashboard')} style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: tab === 'dashboard' ? '2px solid var(--text-dark)' : 'none', fontWeight: tab === 'dashboard' ? 700 : 500, cursor: 'pointer' }}>
          📊 Overview
        </button>
        <button onClick={() => setTab('inventory')} style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: tab === 'inventory' ? '2px solid var(--text-dark)' : 'none', fontWeight: tab === 'inventory' ? 700 : 500, cursor: 'pointer' }}>
          📦 Inventory & Stock ({products.length})
        </button>
        <button onClick={() => setTab('add')} style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: tab === 'add' ? '2px solid var(--text-dark)' : 'none', fontWeight: tab === 'add' ? 700 : 500, cursor: 'pointer' }}>
          + Add Product
        </button>
        <button onClick={() => setTab('orders')} style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: tab === 'orders' ? '2px solid var(--text-dark)' : 'none', fontWeight: tab === 'orders' ? 700 : 500, cursor: 'pointer' }}>
          🛒 Customer Orders ({orders.length})
        </button>
        <button onClick={() => setTab('coupons')} style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: tab === 'coupons' ? '2px solid var(--text-dark)' : 'none', fontWeight: tab === 'coupons' ? 700 : 500, cursor: 'pointer' }}>
          🏷️ Coupons & Promo
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {tab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', marginBottom: '16px' }}>Supabase PostgreSQL Status</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              Database Host: <strong>Supabase Cloud</strong><br />
              Total Revenue Recorded: <strong>₹{totalRevenue.toLocaleString('en-IN')}</strong><br />
              Total Active Products: <strong>{products.filter(p => p.active !== false).length}</strong><br />
              Total Customers Placed Orders: <strong>{new Set(orders.map(o => o.user_id || o.customerEmail)).size}</strong>
            </p>
          </div>

          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', marginBottom: '16px' }}>Recent Customer Orders</h3>
            {orders.slice(0, 4).map(o => (
              <div key={o.id || o._id} style={{ fontSize: '13px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>Order #{o.id || o._id}</strong> — <span style={{ color: 'var(--text-muted)' }}>{o.customerName || 'Customer'}</span>
                </div>
                <b>₹{Number(o.total || 0).toLocaleString('en-IN')}</b>
              </div>
            ))}
            {orders.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No orders placed in database yet.</p>}
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY & STOCK MANAGEMENT */}
      {tab === 'inventory' && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 20px' }}>Product</th>
                <th style={{ padding: '14px 20px' }}>Price (₹)</th>
                <th style={{ padding: '14px 20px' }}>Stock Adjustment</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(products || []).map(p => {
                const id = getPId(p);
                const price = Number(p.salePrice || p.regularPrice || p.price || 0);
                return (
                  <tr key={id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img src={p.image} alt={p.name} style={{ width: '44px', height: '52px', objectFit: 'cover', borderRadius: '6px' }} />
                      <div>
                        <strong style={{ display: 'block' }}>{p.name}</strong>
                        <small style={{ color: 'var(--text-muted)' }}>{p.sku || 'N/A'} | {p.category}</small>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>
                        ₹{price.toLocaleString('en-IN')}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => handleAdjustPrice(p, +100)} title="Increase Price by ₹100" style={{ padding: '3px 6px', border: '1px solid var(--border-light)', background: '#f3f4f6', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>+₹100</button>
                        <button onClick={() => handleAdjustPrice(p, -100)} title="Decrease Price by ₹100" style={{ padding: '3px 6px', border: '1px solid var(--border-light)', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>-₹100</button>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button onClick={() => handleAdjustStock(p, -1)} style={{ width: '28px', height: '28px', border: '1px solid var(--border-light)', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}>-</button>
                        <b style={{ minWidth: '28px', textAlign: 'center', fontSize: '15px' }}>{p.stock}</b>
                        <button onClick={() => handleAdjustStock(p, +1)} style={{ padding: '4px 8px', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>+1</button>
                        <button onClick={() => handleAdjustStock(p, +5)} style={{ padding: '4px 8px', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>+5</button>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <button onClick={() => handleToggleStatus(id, p.active !== false)} style={{ background: p.active !== false ? '#def7ec' : '#fee2e2', color: p.active !== false ? '#03543f' : '#dc2626', border: 'none', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                        {p.active !== false ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button onClick={() => { setEditingId(id); setForm({ ...p, regularPrice: p.regularPrice || p.price }); setTab('add'); }} style={{ marginRight: '12px', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDeleteProduct(id)} style={{ background: 'none', border: 'none', color: '#dc2626', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: ADD NEW PRODUCT WORKFLOW */}
      {tab === 'add' && (
        <div style={{ background: '#fff', padding: '36px', borderRadius: '16px', border: '1px solid var(--border-light)', maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '20px' }}>{editingId ? 'Edit Product' : 'Add New Product to Cloud DB'}</h2>
          {successMsg && <div style={{ background: '#def7ec', color: '#03543f', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: 600 }}>{successMsg}</div>}
          {errorMsg && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: 600 }}>{errorMsg}</div>}

          <form onSubmit={handleSubmitProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>SKU Code *</label>
                <input required placeholder="SKU-101" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Product Title *</label>
                <input required placeholder="Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Regular Price (₹) *</label>
                <input type="number" required placeholder="2499" value={form.regularPrice} onChange={e => setForm({ ...form, regularPrice: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Sale Price (₹)</label>
                <input type="number" placeholder="1999" value={form.salePrice} onChange={e => setForm({ ...form, salePrice: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Initial Stock</label>
                <input type="number" required placeholder="10" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>
            </div>

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
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Image URL *</label>
              <input required placeholder="https://images.unsplash.com/..." value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            </div>

            <button className="primary" style={{ marginTop: '12px' }}>{editingId ? 'Save Changes to Supabase' : 'Create Product in Supabase'}</button>
          </form>
        </div>
      )}

      {/* TAB 4: ALL CUSTOMER ORDERS (GLOBAL DB) */}
      {tab === 'orders' && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', margin: 0 }}>Worldwide Customer Orders</h3>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{orders.length} total orders recorded in Supabase</span>
          </div>

          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No customer orders in database yet. Orders placed by customers from any device will appear here in real time.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '14px 20px' }}>Order ID</th>
                  <th style={{ padding: '14px 20px' }}>Customer</th>
                  <th style={{ padding: '14px 20px' }}>Items</th>
                  <th style={{ padding: '14px 20px' }}>Total Amount</th>
                  <th style={{ padding: '14px 20px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => {
                  const orderId = o.id || o._id;
                  const rawItems = Array.isArray(o.items) ? o.items : JSON.parse(o.items || '[]');
                  const rawShipping = typeof o.shipping === 'object' ? o.shipping : JSON.parse(o.shipping || '{}');

                  return (
                    <tr key={orderId} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '14px 20px' }}>
                        <strong>#{orderId}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{o.paymentMethod || o.payment_method || 'COD'}</div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <strong>{o.customerName || rawShipping.name || 'Customer'}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {rawShipping.city ? `${rawShipping.city}, ${rawShipping.state}` : (o.customerEmail || 'N/A')}
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {rawItems.map((it, idx) => (
                          <div key={idx} style={{ fontSize: '13px' }}>
                            {it.name} (x{it.quantity})
                          </div>
                        ))}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <strong style={{ fontSize: '15px' }}>₹{Number(o.total || 0).toLocaleString('en-IN')}</strong>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '12px', 
                          fontSize: '12px', 
                          fontWeight: 700,
                          background: o.status === 'Cancelled' ? '#fee2e2' : o.status === 'Delivered' ? '#def7ec' : '#fef3c7',
                          color: o.status === 'Cancelled' ? '#dc2626' : o.status === 'Delivered' ? '#03543f' : '#92400e'
                        }}>
                          {o.status || 'Processing'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <select 
                          value={o.status || 'Processing'} 
                          onChange={(e) => handleUpdateOrderStatus(orderId, e.target.value)}
                          style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '12px', border: '1px solid var(--border-light)', cursor: 'pointer' }}
                        >
                          <option value="Placed">Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB 5: COUPONS */}
      {tab === 'coupons' && (
        <div style={{ background: '#fff', padding: '28px', borderRadius: '12px', border: '1px solid var(--border-light)', maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '16px' }}>Discount & Promo Coupons</h3>
          <form onSubmit={handleCreateCoupon} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input required placeholder="Coupon Code (e.g. SAVE20)" value={newCouponCode} onChange={e => setNewCouponCode(e.target.value)} />
            <input required placeholder="Discount (e.g. 20% OFF)" value={newCouponDiscount} onChange={e => setNewCouponDiscount(e.target.value)} />
            <button className="primary">Add</button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {coupons.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                <strong>{c.code}</strong>
                <span>{c.discount}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}