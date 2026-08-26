import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { initialAdminProducts } from '../data/initialProducts';
import api from '../api/api';

export default function Shop() {
  const [items, setItems] = useState(initialAdminProducts || []);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');

  const loadProducts = () => {
    setLoading(true);
    api.get('/products?limit=100')
      .then(res => {
        if (res.data?.items && Array.isArray(res.data.items) && res.data.items.length > 0) {
          setItems(res.data.items);
        } else if (Array.isArray(res.data) && res.data.length > 0) {
          setItems(res.data);
        }
      })
      .catch(() => {
        // Fallback to initial seed products if offline
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Dynamically extract categories from products
  const categories = Array.from(new Set((items || []).map(i => i?.category).filter(Boolean)));

  const filtered = (items || []).filter(i => 
    i &&
    (!cat || i.category === cat) &&
    (!q || (i.name && i.name.toLowerCase().includes(q.toLowerCase())) || (i.category && i.category.toLowerCase().includes(q.toLowerCase())))
  );

  return (
    <section className="page">
      <p className="eyebrow">STORE CATALOG ({items.length} PRODUCTS)</p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '44px', marginBottom: '16px' }}>Shop Everything</h1>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', margin: '24px 0 36px' }}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search products..."
          style={{ maxWidth: '360px' }}
        />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => setCat('')} style={{ padding: '10px 18px', background: cat === '' ? 'var(--text-dark)' : '#fff', color: cat === '' ? '#fff' : 'var(--text-dark)', border: '1px solid var(--border-light)', borderRadius: '20px', cursor: 'pointer' }}>
            All ({items.length})
          </button>
          {categories.map(c => {
            const count = items.filter(i => i && i.category === c).length;
            return (
              <button key={c} onClick={() => setCat(c)} style={{ padding: '10px 18px', background: cat === c ? 'var(--text-dark)' : '#fff', color: cat === c ? '#fff' : 'var(--text-dark)', border: '1px solid var(--border-light)', borderRadius: '20px', cursor: 'pointer' }}>
                {c} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '12px', border: '1px solid var(--border-light)', margin: '20px 0' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '8px' }}>No Products Available</h3>
          <p style={{ color: 'var(--text-muted)' }}>There are no products matching your selection.</p>
        </div>
      ) : (
        <div className="grid">
          {filtered.map(p => (
            <ProductCard key={p._id || p.id || p.sku || p.name} p={p} />
          ))}
        </div>
      )}
    </section>
  );
}