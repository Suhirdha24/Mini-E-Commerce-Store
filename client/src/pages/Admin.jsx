import { useEffect, useState } from 'react';
import api from '../api/api';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', image: '', stock: 0 });
  const [editing, setEditing] = useState(null);

  const load = () => {
    Promise.all([api.get('/products?limit=50'), api.get('/orders/admin/all')])
      .then(([p, o]) => {
        setProducts(p.data.items || []);
        setOrders(o.data || []);
      })
      .catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const submit = async e => {
    e.preventDefault();
    try {
      editing ? await api.put(`/products/${editing}`, form) : await api.post('/products', form);
      setForm({ name: '', description: '', price: '', category: '', image: '', stock: 0 });
      setEditing(null);
      load();
    } catch (err) { alert(err.response?.data?.message || 'Error saving product'); }
  };

  const del = async id => {
    if (confirm('Delete product?')) { await api.delete(`/products/${id}`); load(); }
  };

  const status = async (id, s) => {
    await api.patch(`/orders/${id}/status`, { status: s });
    load();
  };

  return (
    <section className="page">
      <p className="eyebrow">ADMIN PORTAL</p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', marginBottom: '32px' }}>Store Management Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <b style={{ fontSize: '32px', fontFamily: 'var(--font-serif)' }}>{products.length}</b>
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>PRODUCTS</span>
        </div>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <b style={{ fontSize: '32px', fontFamily: 'var(--font-serif)' }}>{orders.length}</b>
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>ORDERS</span>
        </div>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <b style={{ fontSize: '32px', fontFamily: 'var(--font-serif)' }}>₹{orders.reduce((s, o) => s + (o.total || 0), 0).toLocaleString('en-IN')}</b>
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>REVENUE</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', alignItems: 'start' }}>
        <form className="form-card" onSubmit={submit}>
          <h2 style={{ fontFamily: 'var(--font-serif)' }}>{editing ? 'Edit Product' : 'Add Product'}</h2>
          {['name', 'description', 'price', 'category', 'image', 'stock'].map(k => (
            <input
              key={k}
              name={k}
              type={['price', 'stock'].includes(k) ? 'number' : 'text'}
              placeholder={k[0].toUpperCase() + k.slice(1)}
              required
              value={form[k]}
              onChange={e => setForm({ ...form, [k]: e.target.value })}
            />
          ))}
          <button className="primary wide">{editing ? 'Update Product' : 'Create Product'}</button>
        </form>

        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>Catalog & Orders</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {products.map(p => (
              <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#fff', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div>
                  <b>{p.name}</b>
                  <small style={{ display: 'block', color: 'var(--text-muted)' }}>Stock: {p.stock} | ₹{p.price}</small>
                </div>
                <div>
                  <button onClick={() => { setEditing(p._id); setForm({ ...p }); }} style={{ marginRight: '8px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => del(p._id)} style={{ color: '#dc2626', cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}