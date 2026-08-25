import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { getStoredProducts } from '../data/initialProducts';

export default function Admin() {
  const [tab, setTab] = useState('dashboard'); // 'dashboard' | 'inventory' | 'add' | 'orders' | 'customers' | 'coupons'
  const [products, setProducts] = useState(() => getStoredProducts());
  const [orders, setOrders] = useState([]);
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

  const [auditLogs, setAuditLogs] = useState([
    { id: 'log-1', timestamp: new Date().toLocaleString('en-IN'), sku: 'SKU-BAG-01', productName: 'Essential Leather Tote', change: '+5', reason: 'Restock Shipment', updatedBy: 'Admin' }
  ]);

  const [form, setForm] = useState({
    sku: '', name: '', description: '', regularPrice: '', salePrice: '', costPrice: '', category: 'Bags', image: '', stock: 10, active: true
  });

  const getPId = p => String(p._id || p.id);

  const saveProducts = (newList) => {
    setProducts(newList);
    localStorage.setItem('admin_products', JSON.stringify(newList));
    localStorage.setItem('custom_products', JSON.stringify(newList));
    window.dispatchEvent(new Event('productsUpdated'));
  };

  useEffect(() => {
    const localOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
    setOrders(localOrders);
    // Ensure initial storage sync
    if (!localStorage.getItem('admin_products')) {
      localStorage.setItem('admin_products', JSON.stringify(products));
    }
  }, []);

  const handleAdjustPrice = (product, delta) => {
    const pId = getPId(product);
    const currentPrice = Number(product.salePrice || product.regularPrice || product.price || 0);
    const newPrice = Math.max(1, currentPrice + delta);

    const newList = products.map(p => {
      if (getPId(p) === pId) {
        return {
          ...p,
          price: newPrice,
          salePrice: newPrice,
          regularPrice: Math.max(newPrice, Number(p.regularPrice || newPrice))
        };
      }
      return p;
    });
    saveProducts(newList);
  };

  const handleAdjustStock = (product, delta, reason) => {
    const pId = getPId(product);
    const newStock = Math.max(0, (product.stock || 0) + delta);

    const newList = products.map(p => {
      if (getPId(p) === pId) return { ...p, stock: newStock, active: newStock > 0 };
      return p;
    });
    saveProducts(newList);

    setAuditLogs([{
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleString('en-IN'),
      sku: product.sku || 'N/A',
      productName: product.name,
      change: delta > 0 ? `+${delta}` : `${delta}`,
      reason: reason || 'Stock Adjustment',
      updatedBy: 'Admin Store Manager'
    }, ...auditLogs]);
  };

  const handleToggleStatus = (productId) => {
    const newList = products.map(p => {
      if (getPId(p) === String(productId)) return { ...p, active: !p.active };
      return p;
    });
    saveProducts(newList);
  };

  const handleDeleteProduct = (productId) => {
    const newList = products.filter(p => getPId(p) !== String(productId));
    saveProducts(newList);
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!form.sku || !form.name || !form.regularPrice || !form.image) {
      setErrorMsg('Please fill in all required fields (SKU, Name, Regular Price, and Image URL).');
      return;
    }

    if (!editingId && products.some(p => p.sku && p.sku.trim().toLowerCase() === form.sku.trim().toLowerCase())) {
      setErrorMsg(`SKU "${form.sku}" already exists in inventory.`);
      return;
    }

    const newProd = {
      _id: editingId || 'p-' + Date.now(),
      id: editingId || 'p-' + Date.now(),
      ...form,
      regularPrice: Number(form.regularPrice),
      salePrice: form.salePrice ? Number(form.salePrice) : Number(form.regularPrice),
      costPrice: form.costPrice ? Number(form.costPrice) : 0,
      price: form.salePrice ? Number(form.salePrice) : Number(form.regularPrice),
      stock: Number(form.stock)
    };

    if (editingId) {
      const newList = products.map(p => getPId(p) === String(editingId) ? newProd : p);
      saveProducts(newList);
      setSuccessMsg(`✓ Product "${form.name}" updated successfully!`);
    } else {
      const newList = [newProd, ...products];
      saveProducts(newList);
      setSuccessMsg(`✓ New product "${form.name}" added to inventory & live in Customer Store!`);
    }

    setForm({ sku: '', name: '', description: '', regularPrice: '', salePrice: '', costPrice: '', category: 'Bags', image: '', stock: 10, active: true });
    setEditingId(null);
    setTimeout(() => { setSuccessMsg(''); setTab('inventory'); }, 1200);
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode || !newCouponDiscount) return;
    setCoupons([...coupons, { id: 'c-' + Date.now(), code: newCouponCode.toUpperCase(), discount: newCouponDiscount, active: true }]);
    setNewCouponCode('');
    setNewCouponDiscount('');
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <section className="page" style={{ maxWidth: '1150px', margin: '0 auto' }}>
      {/* DISTINCT STANDALONE ADMIN HEADER BANNER */}
      <div style={{ background: '#0f172a', color: '#fff', padding: '16px 24px', borderRadius: '12px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🛡️</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#f8fafc', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>NOVA MANAGEMENT CONSOLE</h3>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Standalone Admin Portal | Isolated Inventory & Order Controls</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>🟢 Management Console Active</span>
          <Link to="/shop" style={{ background: '#3b82f6', color: '#fff', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
            🛍️ View Customer Store →
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <p className="eyebrow">ENTERPRISE ADMIN PORTAL</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '38px' }}>Store & Management Dashboard</h1>
        </div>

        <button className="primary" onClick={() => { setEditingId(null); setTab('add'); }}>
          + Add New Product
        </button>
      </div>

      {/* DASHBOARD METRICS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL SALES REVENUE</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', marginTop: '4px' }}>₹{totalRevenue.toLocaleString('en-IN')}</h2>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>CUSTOMER ORDERS</span>
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
          📦 Inventory & Stock
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

      {/* TAB 1: EXECUTIVE DASHBOARD */}
      {tab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', marginBottom: '16px' }}>Store Performance Summary</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Total Revenue Generated: <strong>₹{totalRevenue.toLocaleString('en-IN')}</strong><br />
              Total Product SKUs: <strong>{products.length}</strong><br />
              Total Units in Stock: <strong>{products.reduce((s, p) => s + (p.stock || 0), 0)}</strong><br />
              Out of Stock Products: <strong>{outOfStockCount}</strong>
            </p>
          </div>

          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', marginBottom: '16px' }}>Stock Audit Log Activity</h3>
            {auditLogs.slice(0, 3).map(log => (
              <div key={log.id} style={{ fontSize: '13px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', marginBottom: '8px' }}>
                <strong>{log.productName}</strong> ({log.change} Units) — <span style={{ color: 'var(--text-muted)' }}>{log.reason}</span>
              </div>
            ))}
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
                <th style={{ padding: '14px 20px' }}>Price</th>
                <th style={{ padding: '14px 20px' }}>Stock Adjustment</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => {
                const id = getPId(p);
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
                        ₹{(p.salePrice || p.regularPrice || p.price)?.toLocaleString('en-IN')}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => handleAdjustPrice(p, +100)} title="Increase Price by ₹100" style={{ padding: '3px 6px', border: '1px solid var(--border-light)', background: '#f3f4f6', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>+₹100</button>
                        <button onClick={() => handleAdjustPrice(p, +500)} title="Increase Price by ₹500" style={{ padding: '3px 6px', border: '1px solid var(--border-light)', background: '#f3f4f6', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>+₹500</button>
                        <button onClick={() => handleAdjustPrice(p, -100)} title="Decrease Price by ₹100" style={{ padding: '3px 6px', border: '1px solid var(--border-light)', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>-₹100</button>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button onClick={() => handleAdjustStock(p, -1, 'Manual Reduction')} style={{ width: '28px', height: '28px', border: '1px solid var(--border-light)', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}>-</button>
                        <b style={{ minWidth: '28px', textAlign: 'center', fontSize: '15px' }}>{p.stock}</b>
                        <button onClick={() => handleAdjustStock(p, +1, 'Stock Increase (+1)')} style={{ padding: '4px 8px', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>+1</button>
                        <button onClick={() => handleAdjustStock(p, +5, 'Restock (+5)')} style={{ padding: '4px 8px', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>+5</button>
                        <button onClick={() => handleAdjustStock(p, +10, 'Bulk Restock (+10)')} style={{ padding: '4px 8px', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>+10</button>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <button onClick={() => handleToggleStatus(id)} style={{ background: p.active !== false ? '#def7ec' : '#fee2e2', color: p.active !== false ? '#03543f' : '#dc2626', border: 'none', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
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
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '20px' }}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
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

            <button className="primary" style={{ marginTop: '12px' }}>{editingId ? 'Save Changes' : 'Create Product'}</button>
          </form>
        </div>
      )}

      {/* TAB 4: COUPONS MANAGEMENT */}
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