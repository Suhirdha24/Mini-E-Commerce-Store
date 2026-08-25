import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getStoredProducts } from '../data/initialProducts';

const getAdminProducts = () => {
  return getStoredProducts();
};

export default function Shop() {
  const [items, setItems] = useState(() => getAdminProducts());
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');

  const loadProducts = () => {
    setItems([...getAdminProducts()]);
  };

  useEffect(() => {
    loadProducts();
    window.addEventListener('productsUpdated', loadProducts);
    window.addEventListener('storage', loadProducts);
    return () => {
      window.removeEventListener('productsUpdated', loadProducts);
      window.removeEventListener('storage', loadProducts);
    };
  }, []);

  // Dynamically extract categories from admin products
  const categories = Array.from(new Set(items.map(i => i.category).filter(Boolean)));

  const filtered = items.filter(i => 
    (!cat || i.category === cat) &&
    (!q || i.name.toLowerCase().includes(q.toLowerCase()) || (i.category && i.category.toLowerCase().includes(q.toLowerCase())))
  );

  return (
    <section className="page">
      <p className="eyebrow">ADMIN MANAGED CATALOG ({items.length} PRODUCTS)</p>
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
            const count = items.filter(i => i.category === c).length;
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
          <p style={{ color: 'var(--text-muted)' }}>There are no products matching your selection. Add or update products in the Admin Module to see them here!</p>
        </div>
      ) : (
        <div className="grid">
          {filtered.map(p => (
            <ProductCard key={p._id || p.id || p.name} p={p} />
          ))}
        </div>
      )}
    </section>
  );
}