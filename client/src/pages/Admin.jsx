import { useEffect, useState } from 'react';
import api from '../api/api';

const initialInventory = [
  { id: 'b1', sku: 'SKU-BAG-01', name: 'Essential Leather Tote', category: 'Bags', subcategory: 'Tote Bags', regularPrice: 3200, salePrice: 2899, costPrice: 1800, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', description: 'Structured daily tote.', stock: 15, active: true },
  { id: 'f1', sku: 'SKU-FTW-02', name: 'Aero Knit Sneakers', category: 'Footwear', subcategory: 'Sneakers', regularPrice: 2800, salePrice: 2499, costPrice: 1400, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', description: 'Breathable knit sneakers.', stock: 3, active: true },
  { id: 'a1', sku: 'SKU-ACC-03', name: 'Mono Chronograph Watch', category: 'Accessories', subcategory: 'Watches', regularPrice: 4500, salePrice: 3999, costPrice: 2500, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', description: 'Stainless steel watch.', stock: 0, active: false }
];

export default function Admin() {
  const [tab, setTab] = useState('inventory'); // 'inventory' | 'add' | 'audit'
  const [products, setProducts] = useState(initialInventory);
  const [editingId, setEditingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [auditLogs, setAuditLogs] = useState([
    { id: 'log-1', timestamp: new Date(Date.now() - 3600000).toLocaleString('en-IN'), sku: 'SKU-BAG-01', productName: 'Essential Leather Tote', change: '+5', reason: 'Restock Shipment', updatedBy: 'Admin' },
    { id: 'log-2', timestamp: new Date(Date.now() - 7200000).toLocaleString('en-IN'), sku: 'SKU-FTW-02', productName: 'Aero Knit Sneakers', change: '-1', reason: 'Damaged Write-off', updatedBy: 'Admin' }
  ]);

  const [form, setForm] = useState({
    sku: '',
    name: '',
    description: '',
    regularPrice: '',
    salePrice: '',
    costPrice: '',
    category: 'Bags',
    subcategory: 'Totes',
    image: '',
    stock: 10,
    active: true
  });

  const getPId = p => p._id || p.id;

  useEffect(() => {
    api.get('/products?limit=50')
      .then(r => { if (r.data.items?.length) setProducts(r.data.items); })
      .catch(() => {});
  }, []);

  const handleAdjustStock = (product, delta, reason) => {
    const pId = getPId(product);
    const oldStock = product.stock || 0;
    const newStock = Math.max(0, oldStock + delta);

    setProducts(prev => prev.map(p => {
      if (getPId(p) === pId) {
        return { ...p, stock: newStock, active: newStock > 0 };
      }
      return p;
    }));

    const logEntry = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleString('en-IN'),
      sku: product.sku || 'N/A',
      productName: product.name,
      change: delta > 0 ? `+${delta}` : `${delta}`,
      reason: reason || (delta > 0 ? 'Restock' : 'Adjustment'),
      updatedBy: 'Admin Store Manager'
    };
    setAuditLogs([logEntry, ...auditLogs]);
  };

  const handleToggleStatus = (productId) => {
    setProducts(prev => prev.map(p => {
      if (getPId(p) === productId) {
        return { ...p, active: !p.active };
      }
      return p;
    }));
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!form.sku || !form.name || !form.regularPrice || !form.image) {
      setErrorMsg('Please complete all required fields (SKU, Name, Regular Price, and Image URL).');
      return;
    }

    if (!editingId && products.some(p => p.sku && p.sku.trim().toLowerCase() === form.sku.trim().toLowerCase())) {
      setErrorMsg(`Duplicate SKU Error: Product Code "${form.sku}" already exists in inventory.`);
      return;
    }

    const newProd = {
      _id: editingId || 'p-' + Date.now(),
      id: editingId || 'p-' + Date.now(),
      ...form,
      regularPrice: Number(form.regularPrice),
      salePrice: form.salePrice ? Number(form.salePrice) : Number(form.regularPrice),
      costPrice: form.costPrice ? Number(form.costPrice) : 0,
      stock: Number(form.stock)
    };

    if (editingId) {
      setProducts(products.map(p => getPId(p) === editingId ? newProd : p));
      setSuccessMsg(`✓ Success: Product "${form.name}" updated cleanly!`);
    } else {
      setProducts([newProd, ...products]);
      setSuccessMsg(`✓ Success: New product "${form.name}" (SKU: ${form.sku}) added to inventory!`);
      
      setAuditLogs([{
        id: 'log-' + Date.now(),
        timestamp: new Date().toLocaleString('en-IN'),
        sku: form.sku,
        productName: form.name,
        change: `+${form.stock}`,
        reason: 'Initial Stock Creation',
        updatedBy: 'Admin'
      }, ...auditLogs]);
    }

    setForm({ sku: '', name: '', description: '', regularPrice: '', salePrice: '', costPrice: '', category: 'Bags', subcategory: 'Totes', image: '', stock: 10, active: true });
    setEditingId(null);
    setTimeout(() => { setSuccessMsg(''); setTab('inventory'); }, 1800);
  };

  const handleEdit = (p) => {
    setEditingId(getPId(p));
    setForm({
      sku: p.sku || 'SKU-' + Math.floor(Math.random()*1000),
      name: p.name,
      description: p.description || '',
      regularPrice: p.regularPrice || p.price,
      salePrice: p.salePrice || p.price,
      costPrice: p.costPrice || 0,
      category: p.category || 'Bags',
      subcategory: p.subcategory || 'General',
      image: p.image,
      stock: p.stock,
      active: p.active !== undefined ? p.active : true
    });
    setTab('add');
  };

  const handleDelete = (id) => {
    if (confirm('Permanently delete this product from database?')) {
      setProducts(products.filter(p => getPId(p) !== id));
    }
  };

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <section className="page" style={{ maxWidth: '1150px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <p className="eyebrow">ADMINISTRATIVE BACKEND</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '38px' }}>Store & Inventory Control Center</h1>
        </div>

        <button className="primary" onClick={() => { setEditingId(null); setTab('add'); }}>
          + Add New Product
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL PRODUCTS</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginTop: '4px' }}>{products.length} SKUs</h2>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL INVENTORY UNITS</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginTop: '4px' }}>
            {products.reduce((s, p) => s + Number(p.stock || 0), 0)} Units
          </h2>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>LOW STOCK ALERTS</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: lowStockCount ? '#d97706' : 'var(--text-dark)', marginTop: '4px' }}>
            {lowStockCount} Items (&lt; 5)
          </h2>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>OUT OF STOCK</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: outOfStockCount ? '#dc2626' : 'var(--text-dark)', marginTop: '4px' }}>
            {outOfStockCount} Items
          </h2>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-light)', marginBottom: '28px' }}>
        <button onClick={() => setTab('inventory')} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: tab === 'inventory' ? '2px solid var(--text-dark)' : 'none', fontWeight: tab === 'inventory' ? 700 : 500, cursor: 'pointer' }}>
          Stock Maintenance ({products.length})
        </button>
        <button onClick={() => setTab('add')} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: tab === 'add' ? '2px solid var(--text-dark)' : 'none', fontWeight: tab === 'add' ? 700 : 500, cursor: 'pointer' }}>
          {editingId ? 'Edit Product' : '+ Add New Product'}
        </button>
        <button onClick={() => setTab('audit')} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: tab === 'audit' ? '2px solid var(--text-dark)' : 'none', fontWeight: tab === 'audit' ? 700 : 500, cursor: 'pointer' }}>
          Stock Audit Trail & Logs ({auditLogs.length})
        </button>
      </div>

      {tab === 'inventory' && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 20px' }}>Product & SKU</th>
                <th style={{ padding: '14px 20px' }}>Prices (Regular / Sale / Cost)</th>
                <th style={{ padding: '14px 20px' }}>Manual Stock Restock / Adjust</th>
                <th style={{ padding: '14px 20px' }}>Active Status</th>
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
                      <div style={{ fontWeight: 600 }}>₹{(p.salePrice || p.regularPrice || p.price)?.toLocaleString('en-IN')}</div>
                      <small style={{ color: 'var(--text-muted)' }}>Cost: ₹{p.costPrice || 0}</small>
                    </td>

                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={() => handleAdjustStock(p, -1, 'Manual Adjustment')} style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid var(--border-light)', background: '#fff', cursor: 'pointer' }}>-</button>
                        <b style={{ width: '32px', textAlign: 'center' }}>{p.stock}</b>
                        <button onClick={() => handleAdjustStock(p, +5, 'Restock Shipment')} style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>+5 Restock</button>
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

      {tab === 'add' && (
        <div style={{ background: '#fff', padding: '36px', borderRadius: '16px', border: '1px solid var(--border-light)', maxWidth: '680px', margin: '0 auto', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '20px' }}>
            {editingId ? 'Edit Product Information' : 'Add New Product to Inventory'}
          </h2>

          {successMsg && <div style={{ background: '#def7ec', color: '#03543f', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: 600 }}>{successMsg}</div>}
          {errorMsg && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: 600 }}>{errorMsg}</div>}

          <form onSubmit={handleSubmitProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>SKU / Product Code *</label>
                <input required placeholder="SKU-BAG-101" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Product Title *</label>
                <input required placeholder="e.g. Leather Laptop Sleeve" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Regular Price (₹) *</label>
                <input type="number" required placeholder="3200" value={form.regularPrice} onChange={e => setForm({ ...form, regularPrice: e.target.value })} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Sale Price (₹)</label>
                <input type="number" placeholder="2899" value={form.salePrice} onChange={e => setForm({ ...form, salePrice: e.target.value })} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Cost Price (₹)</label>
                <input type="number" placeholder="1500" value={form.costPrice} onChange={e => setForm({ ...form, costPrice: e.target.value })} />
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
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Subcategory</label>
                <input placeholder="Totes / Sneakers" value={form.subcategory} onChange={e => setForm({ ...form, subcategory: e.target.value })} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Initial Stock Units</label>
                <input type="number" required placeholder="15" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Main Image URL *</label>
              <input required placeholder="https://images.unsplash.com/..." value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            </div>

            {form.image && (
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Image Preview:</span>
                <img src={form.image} alt="Preview" style={{ width: '90px', height: '100px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-light)' }} />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Detailed Description</label>
              <textarea rows="3" placeholder="Materials, dimensions, and specifications..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <div style={{ display: 'flex', gap: '14px', marginTop: '12px' }}>
              <button className="primary" style={{ flex: 1 }}>{editingId ? 'Save Product Changes' : 'Create Product'}</button>
              <button type="button" onClick={() => setTab('inventory')} style={{ padding: '14px 20px', background: '#fff', border: '1px solid var(--border-light)', borderRadius: '30px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {tab === 'audit' && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px' }}>Stock Quantity Audit Trail & Logs</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Recorded quantity updates with timestamps, reasons, and user tracking.</p>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 20px' }}>Timestamp</th>
                <th style={{ padding: '14px 20px' }}>SKU & Product Name</th>
                <th style={{ padding: '14px 20px' }}>Quantity Change</th>
                <th style={{ padding: '14px 20px' }}>Reason / Audit Trigger</th>
                <th style={{ padding: '14px 20px' }}>Modified By</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-muted)' }}>{log.timestamp}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>{log.productName} <small style={{ color: 'var(--text-muted)' }}>({log.sku})</small></td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: log.change.startsWith('+') ? '#03543f' : '#dc2626' }}>
                    {log.change} Units
                  </td>
                  <td style={{ padding: '14px 20px' }}>{log.reason}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px' }}>{log.updatedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}