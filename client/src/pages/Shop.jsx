import { useEffect, useState } from 'react';
import api from '../api/api';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [data, setData] = useState({ items: [], categories: [] });
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/products', { params: { search: q, category: cat, page, limit: 12 } })
      .then(r => setData(r.data))
      .catch(() => setData({ items: [], categories: [] }))
      .finally(() => setLoading(false));
  }, [q, cat, page]);

  return (
    <section className="page">
      <div className="shop-hero">
        <div>
          <p className="eyebrow">NOVA COLLECTION</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', marginBottom: '12px' }}>Shop Everything</h1>
          <p style={{ color: 'var(--text-muted)' }}>Explore our complete collection of thoughtfully selected essentials.</p>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="shop-toolbar" style={{ marginTop: '24px' }}>
        <input
          value={q}
          onChange={e => { setQ(e.target.value); setPage(1); }}
          placeholder="Search products by name or description..."
          style={{ maxWidth: '400px' }}
        />

        <div className="shop-categories">
          <button className={cat === '' ? 'active' : ''} onClick={() => { setCat(''); setPage(1); }}>
            All Categories
          </button>
          {data.categories?.map(c => (
            <button key={c} className={cat === c ? 'active' : ''} onClick={() => { setCat(c); setPage(1); }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>Loading collection...</div>
      ) : data.items?.length ? (
        <div className="grid">
          {data.items.map(p => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px' }}>No products found.</div>
      )}
    </section>
  );
}