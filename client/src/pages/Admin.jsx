import { useEffect, useState } from 'react';
import api from '../api/api';

const initialInventory = [
  { id: 'b1', sku: 'BAG-001', name: 'Essential Leather Tote', category: 'Bags', price: 2899, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', description: 'Structured daily tote.', stock: 15, active: true },
  { id: 'f1', sku: 'FTW-002', name: 'Aero Knit Sneakers', category: 'Footwear', price: 2499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', description: 'Breathable knit sneakers.', stock: 3, active: true },
  { id: 'a1', sku: 'ACC-003', name: 'Mono Chronograph Watch', category: 'Accessories', price: 3999, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', description: 'Stainless steel watch.', stock: 0, active: false }
];

export default function Admin() {
  const [tab, setTab] = useState('inventory'); // 'inventory' | 'add' | 'orders'
  const [products, setProducts] = useState(initialInventory);
  const [editingId, setEditingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    sku: '',
    name: '',
    description: '',
    price: '',
    category: 'Bags',
    image: '',
    stock: 10,
    active: true
  });

  const getPId = p => p._id || p.id;

  // LOAD INVENTORY FROM API OR LOCAL
  useEffect(() => {
    api.get('/products?limit=50')
      .then(r => { if (r.data.items?.length) setProducts(r.data.items); })
      .catch(() => {});
  }, []);

  // MANUAL STOCK ADJUSTMENT (+ / - Restock System)
  const handleStockAdjustment = (productId, delta) => {
    setProducts(prev => prev.map(p => {
      if (getPId(p) === productId) {
        const newStock = Math.max(0, (p.stock || 0) + delta);
        return { ...p, stock: newStock, active: newStock > 0 };
      }
      return p;
    }));
  };

  // TOGGLE ACTIVE STATUS
  const handleToggleStatus = (productId) => {
    setProducts(prev => prev.map(p => {
      if (getPId(p) === productId) {
        return { ...p, active: !p.active };
      }
      return p;
    }));
  };

  // NEW PRODUCT WORKFLOW & DUPLICATE SKU PREVENTION
  const handleSubmitProduct = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Duplicate SKU check
    if (!editingId && products.some(p => p.sku && p.sku.toLowerCase() === form.sku.toLowerCase())) {
      setErrorMsg(`SKU code "${form.sku}" already exists. Please use a unique SKU.`);
      return;
    }

    const newProd = {
      _id: editingId || 'p-' + Date.now(),
      id: editingId || 'p-' + Date.now(),
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    };

    if (editingId) {
      setProducts(products.map(p => getPId(p) === editingId ? newProd : p));
      setSuccessMsg(`✓ Product "${form.name}" updated successfully!`);
    } else {
      setProducts([newProd, ...products]);
      setSuccessMsg(`✓ New product "${form.name}" added to inventory!`);
    }

    setForm({ sku: '', name: '', description: '', price: '', category: 'Bags', image: '', stock: 10, active: true });
    setEditingId(null);
    setTimeout(() => { setSuccessMsg(''); setTab('inventory'); }, 1500);
  };

  const handleEdit = (p) => {
    setEditingId(getPId(p));
    setForm({
      sku: p.sku || 'SKU-' + Math.floor(Math.random()*1000),
      name: p.name,
      description: p.description || '',
      price: p.price,
      category: p.category,
      image: p.image,
      stock: p.stock,
      active: p.active !== undefined ? p.active : true
    });
    setTab('add');
  };

  const handleDelete = (id) => {
    if (confirm('Delete this product permanently?')) {
      setProducts(products.filter(p => getPId(p) !== id));
    }
  };

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <section className="page" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <p className="eyebrow">BACKEND MANAGEMENT</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '38px' }}>Inventory & Product Maintenance</h1>
        </div>

        <button className="primary" onClick={() => { setEditingId(null); setTab('add'); }}>
          + Add New Product
        </button>
      </div>

      {/* METRICS & LOW STOCK ALERTS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL CATALOG</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginTop: '4px' }}>{products.length} Items</h2>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>AVAILABLE UNITS</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginTop: '4px' }}>
            {products.reduce((s, p) => s + Number(p.stock || 0), 0)} Units
          </h2>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>LOW STOCK ALERTS</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: lowStockCount ? '#d97706' : 'var(--text-dark)', marginTop: '4px' }}>
            {lowStockCount} Products
          </h2>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>OUT OF STOCK</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: outOfStockCount ? '#dc2626' : 'var(--text-dark)', marginTop: '4px' }}>
            {outOfStockCount} Products
          </h2>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-light)', marginBottom: '28px' }}>
        <button onClick={() => setTab('inventory')} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: tab === 'inventory' ? '2px solid var(--text-dark)' : 'none', fontWeight: tab === 'inventory' ? 700 : 500, cursor: 'pointer' }}>
          Stock Maintenance ({products.length})
        </button>
        <button onClick={() => setTab('add')} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: tab === 'add' ? '2px solid var(--text-dark)' : 'none', fontWeight: tab === 'add' ? 700 : 500, cursor: 'pointer' }}>
          {editingId ? 'Edit Product' : '+ Add New Product'}
        </button>
      </div>

      {/* TAB 1: STOCK MAINTENANCE SYSTEM */}
      {tab === 'inventory' && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 20px' }}>Product & SKU</th>
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
                        <small style={{ color: 'var(--text-muted)' }}>SKU: {p.sku || 'N/A'} | {p.category}</small>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 600 }}>₹{p.price?.toLocaleString('en-IN')}</td>
                    
                    {/* MANUAL STOCK ADJUSTMENTS (+ / - RESTOCK) */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={() => handleStockAdjustment(id, -1)} style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid var(--border-light)', background: '#fff', cursor: 'pointer' }}>-</button>
                        <b style={{ width: '32px', textAlign: 'center' }}>{p.stock}</b>
                        <button onClick={() => handleStockAdjustment(id, +1)} style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid var(--border-light)', background: '#fff', cursor: 'pointer' }}>+</button>
                      </div>
                    </td>

                    <td style={{ padding: '14px 20px' }}>
                      <button 
                        onClick={() => handleToggleStatus(id)}
                        style={{ 
                          background: p.active !== false ? '#def7ec' : '#fee2e2', 
                          color: p.active !== false ? '#03543f' : '#dc2626', 
                          border: 'none', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' 
                        }}
                      >
                        {p.active !== false ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button onClick={() => handleEdit(p)} style={{ marginRight: '14px', background: 'none', border: 'none', color: 'var(--text-dark)', fontWeight: 600, cursor: 'pointer' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(id)} style={{ background: 'none', border: 'none', color: '#dc2626', fontWeight: 600, cursor: 'pointer' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: NEW PRODUCT ADDITION WORKFLOW */}
      {tab === 'add' && (
        <div style={{ background: '#fff', padding: '36px', borderRadius: '16px', border: '1px solid var(--border-light)', maxWidth: '640px', margin: '0 auto', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '20px' }}>
            {editingId ? 'Edit Product Information' : 'Add New Product to Inventory'}
          </h2>

          {successMsg && <div style={{ background: '#def7ec', color: '#03543f', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: 600 }}>{successMsg}</div>}
          {errorMsg && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: 600 }}>{errorMsg}</div>}

          <form onSubmit={handleSubmitProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>SKU / Product Code</label>
                <input required placeholder="SKU-1001" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Product Title</label>
                <input required placeholder="e.g. Leather Laptop Sleeve" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="Bags">Bags</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Home">Home</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Price (₹)</label>
                <input type="number" required placeholder="2499" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Initial Stock</label>
                <input type="number" required placeholder="15" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Image URL</label>
              <input required placeholder="https://images.unsplash.com/..." value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            </div>

            {form.image && (
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Image Preview:</span>
                <img src={form.image} alt="Preview" style={{ width: '80px', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-light)' }} />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Detailed Description</label>
              <textarea rows="3" placeholder="Materials, dimensions, and specifications..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <div style={{ display: 'flex', gap: '14px', marginTop: '12px' }}>
              <button className="primary" style={{ flex: 1 }}>{editingId ? 'Save Changes' : 'Create Product'}</button>
              <button type="button" onClick={() => setTab('inventory')} style={{ padding: '14px 20px', background: '#fff', border: '1px solid var(--border-light)', borderRadius: '30px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}