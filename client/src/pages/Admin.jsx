import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { ShieldIcon, RefreshIcon, PackageIcon, TagIcon, CartIcon, LockIcon } from '../components/Icons';

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

  // Load all products and global customer orders
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes] = await Promise.all([
        api.get('/products?limit=200'),
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
      setErrorMsg('Failed to load store data: ' + (err.response?.data?.message || err.message));
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
      alert('Failed to update price: ' + (err.response?.data?.message || err.message));
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
      alert('Failed to adjust stock: ' + (err.response?.data?.message || err.message));
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
    if (window.confirm('Are you sure you want to delete this product?')) {
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
        setSuccessMsg(`Product "${form.name}" updated successfully.`);
      } else {
        const res = await api.post('/products', payload);
        const created = res.data;
        setProducts([created, ...products]);
        setSuccessMsg(`New product "${form.name}" added successfully.`);
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
        <div style={{ background: '#fff', padding: '36px', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
            <LockIcon size={22} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Admin Access Required</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '13px' }}>
            You are signed in as a customer (<strong>{user.email}</strong>). Please sign in with an Administrator account to view this dashboard.
          </p>
          <Link className="primary" to="/admin-login">Sign in as Admin</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page" style={{ maxWidth: '1150px', margin: '0 auto' }}>
      {/* ADMIN CONSOLE HEADER */}
      <div style={{ background: '#0f172a', color: '#fff', padding: '16px 20px', borderRadius: '8px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldIcon size={20} />
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', color: '#f8fafc', fontWeight: 600 }}>NOVA MANAGEMENT CONSOLE</h3>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Store Administration & Inventory Management</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={loadAdminData} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#334155', border: '1px solid #475569', color: '#f8fafc', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
            <RefreshIcon size={14} /> Refresh
          </button>
          <Link to="/shop" style={{ background: '#2563eb', color: '#fff', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, textDecoration: 'none' }}>
            View Store
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <p className="eyebrow">ADMIN PORTAL</p>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '4px 0 0' }}>Dashboard Overview</h1>
        </div>

        <button className="primary" onClick={() => { setEditingId(null); setTab('add'); }}>
          + Add Product
        </button>
      </div>

      {/* METRICS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Revenue</span>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '6px 0 0' }}>₹{totalRevenue.toLocaleString('en-IN')}</h2>
        </div>

        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Orders</span>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '6px 0 0' }}>{orders.length}</h2>
        </div>

        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Products</span>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '6px 0 0' }}>{products.length}</h2>
        </div>

        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Low Stock</span>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: lowStockCount ? '#d97706' : 'var(--text-dark)', margin: '6px 0 0' }}>{lowStockCount}</h2>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--border)', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button onClick={() => setTab('dashboard')} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: tab === 'dashboard' ? '2px solid var(--text-dark)' : 'none', fontWeight: tab === 'dashboard' ? 600 : 400, fontSize: '13px', cursor: 'pointer' }}>
          Overview
        </button>
        <button onClick={() => setTab('inventory')} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: tab === 'inventory' ? '2px solid var(--text-dark)' : 'none', fontWeight: tab === 'inventory' ? 600 : 400, fontSize: '13px', cursor: 'pointer' }}>
          Inventory ({products.length})
        </button>
        <button onClick={() => setTab('add')} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: tab === 'add' ? '2px solid var(--text-dark)' : 'none', fontWeight: tab === 'add' ? 600 : 400, fontSize: '13px', cursor: 'pointer' }}>
          {editingId ? 'Edit Product' : '+ Add Product'}
        </button>
        <button onClick={() => setTab('orders')} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: tab === 'orders' ? '2px solid var(--text-dark)' : 'none', fontWeight: tab === 'orders' ? 600 : 400, fontSize: '13px', cursor: 'pointer' }}>
          Customer Orders ({orders.length})
        </button>
        <button onClick={() => setTab('coupons')} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: tab === 'coupons' ? '2px solid var(--text-dark)' : 'none', fontWeight: tab === 'coupons' ? 600 : 400, fontSize: '13px', cursor: 'pointer' }}>
          Coupons
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {tab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>Store Overview</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              Store Name: <strong>NOVA STORE</strong><br />
              Total Revenue: <strong>₹{totalRevenue.toLocaleString('en-IN')}</strong><br />
              Active Products: <strong>{products.filter(p => p.active !== false).length}</strong><br />
              Total Unique Customers: <strong>{new Set(orders.map(o => o.user_id || o.customerEmail)).size}</strong>
            </p>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>Recent Customer Orders</h3>
            {orders.slice(0, 4).map(o => (
              <div key={o.id || o._id} style={{ fontSize: '13px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>Order #{o.id || o._id}</strong> — <span style={{ color: 'var(--text-muted)' }}>{o.customerName || 'Customer'}</span>
                </div>
                <b>₹{Number(o.total || 0).toLocaleString('en-IN')}</b>
              </div>
            ))}
            {orders.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No orders placed in database yet.</p>}
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY & STOCK MANAGEMENT */}
      {tab === 'inventory' && (
        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px' }}>Product</th>
                <th style={{ padding: '12px 16px' }}>Price (₹)</th>
                <th style={{ padding: '12px 16px' }}>Stock</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(products || []).map(p => {
                const id = getPId(p);
                const price = Number(p.salePrice || p.regularPrice || p.price || 0);
                return (
                  <tr key={id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div>
                        <strong style={{ display: 'block', color: 'var(--text-dark)' }}>{p.name}</strong>
                        <small style={{ color: 'var(--text-muted)' }}>{p.sku || 'N/A'} | {p.category}</small>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                        ₹{price.toLocaleString('en-IN')}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => handleAdjustPrice(p, +100)} title="Increase Price by ₹100" style={{ padding: '2px 6px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', borderRadius: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: 500 }}>+₹100</button>
                        <button onClick={() => handleAdjustPrice(p, -100)} title="Decrease Price by ₹100" style={{ padding: '2px 6px', border: '1px solid var(--border)', background: '#fff', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}>-₹100</button>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button onClick={() => handleAdjustStock(p, -1)} style={{ width: '24px', height: '24px', border: '1px solid var(--border)', background: '#fff', borderRadius: '3px', cursor: 'pointer', fontWeight: 600 }}>-</button>
                        <b style={{ minWidth: '24px', textAlign: 'center', fontSize: '14px' }}>{p.stock}</b>
                        <button onClick={() => handleAdjustStock(p, +1)} style={{ padding: '2px 6px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', borderRadius: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: 500 }}>+1</button>
                        <button onClick={() => handleAdjustStock(p, +5)} style={{ padding: '2px 6px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', borderRadius: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: 500 }}>+5</button>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => handleToggleStatus(id, p.active !== false)} style={{ background: p.active !== false ? '#def7ec' : '#fee2e2', color: p.active !== false ? '#03543f' : '#dc2626', border: 'none', padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                        {p.active !== false ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button onClick={() => { setEditingId(id); setForm({ ...p, regularPrice: p.regularPrice || p.price }); setTab('add'); }} style={{ marginRight: '10px', background: 'none', border: 'none', fontWeight: 500, fontSize: '12px', cursor: 'pointer', color: 'var(--text-dark)' }}>Edit</button>
                      <button onClick={() => handleDeleteProduct(id)} style={{ background: 'none', border: 'none', color: '#dc2626', fontWeight: 500, fontSize: '12px', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: ADD/EDIT PRODUCT */}
      {tab === 'add' && (
        <div style={{ background: '#fff', padding: '28px', borderRadius: '10px', border: '1px solid var(--border)', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          {successMsg && <div style={{ background: '#def7ec', color: '#03543f', padding: '10px 14px', borderRadius: '6px', marginBottom: '14px', fontSize: '13px', fontWeight: 500 }}>{successMsg}</div>}
          {errorMsg && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '6px', marginBottom: '14px', fontSize: '13px', fontWeight: 500 }}>{errorMsg}</div>}

          <form onSubmit={handleSubmitProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>SKU Code *</label>
                <input required placeholder="SKU-101" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Product Name *</label>
                <input required placeholder="Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Regular Price (₹) *</label>
                <input type="number" required placeholder="2499" value={form.regularPrice} onChange={e => setForm({ ...form, regularPrice: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Sale Price (₹)</label>
                <input type="number" placeholder="1999" value={form.salePrice} onChange={e => setForm({ ...form, salePrice: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Initial Stock</label>
                <input type="number" required placeholder="10" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Category</label>
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
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Image URL *</label>
              <input required placeholder="https://images.unsplash.com/..." value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            </div>

            <button className="primary" style={{ marginTop: '8px' }}>{editingId ? 'Save Changes' : 'Create Product'}</button>
          </form>
        </div>
      )}

      {/* TAB 4: ORDERS */}
      {tab === 'orders' && (
        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Customer Orders</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{orders.length} total orders</span>
          </div>

          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '13px' }}>
              No customer orders recorded yet.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px' }}>Order ID</th>
                  <th style={{ padding: '12px 16px' }}>Customer</th>
                  <th style={{ padding: '12px 16px' }}>Items</th>
                  <th style={{ padding: '12px 16px' }}>Total</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => {
                  const orderId = o.id || o._id;
                  const rawItems = Array.isArray(o.items) ? o.items : JSON.parse(o.items || '[]');
                  const rawShipping = typeof o.shipping === 'object' ? o.shipping : JSON.parse(o.shipping || '{}');

                  return (
                    <tr key={orderId} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <strong>#{orderId}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{o.paymentMethod || o.payment_method || 'COD'}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <strong>{o.customerName || rawShipping.name || 'Customer'}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {rawShipping.city ? `${rawShipping.city}, ${rawShipping.state}` : (o.customerEmail || '')}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {rawItems.map((it, idx) => (
                          <div key={idx} style={{ fontSize: '12px' }}>
                            {it.name} (x{it.quantity})
                          </div>
                        ))}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <strong style={{ fontSize: '14px' }}>₹{Number(o.total || 0).toLocaleString('en-IN')}</strong>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ 
                          padding: '3px 8px', 
                          borderRadius: '4px', 
                          fontSize: '11px', 
                          fontWeight: 600,
                          background: o.status === 'Cancelled' ? '#fee2e2' : o.status === 'Delivered' ? '#def7ec' : '#fef3c7',
                          color: o.status === 'Cancelled' ? '#dc2626' : o.status === 'Delivered' ? '#03543f' : '#92400e'
                        }}>
                          {o.status || 'Processing'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <select 
                          value={o.status || 'Processing'} 
                          onChange={(e) => handleUpdateOrderStatus(orderId, e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', border: '1px solid var(--border)', cursor: 'pointer' }}
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
        <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', border: '1px solid var(--border)', maxWidth: '550px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '14px' }}>Discount & Promo Coupons</h3>
          <form onSubmit={handleCreateCoupon} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input required placeholder="Coupon Code (e.g. SAVE20)" value={newCouponCode} onChange={e => setNewCouponCode(e.target.value)} />
            <input required placeholder="Discount (e.g. 20% OFF)" value={newCouponDiscount} onChange={e => setNewCouponDiscount(e.target.value)} />
            <button className="primary">Add</button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {coupons.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: '6px', fontSize: '13px' }}>
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