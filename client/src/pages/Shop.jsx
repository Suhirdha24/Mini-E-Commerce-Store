import { useEffect, useState } from 'react';
import api from '../api/api';
import ProductCard from '../components/ProductCard';

const mockShopProducts = [
  { id: '1', name: 'Essential Leather Tote', category: 'Bags', price: 2899, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: '2', name: 'Aero Knit Sneakers', category: 'Footwear', price: 2499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', stock: 18 },
  { id: '3', name: 'Mono Chronograph Watch', category: 'Accessories', price: 3999, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: '4', name: 'Essential Cotton Hoodie', category: 'Apparel', price: 1599, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80', stock: 30 },
  { id: '5', name: 'Contour Ambient Lamp', category: 'Home', price: 2199, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', stock: 10 },
  { id: '6', name: 'Classic Leather Wallet', category: 'Accessories', price: 999, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', stock: 20 }
];

export default function Shop() {
  const [items, setItems] = useState(mockShopProducts);
  const [categories, setCategories] = useState(['Bags', 'Footwear', 'Accessories', 'Apparel', 'Home']);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');

  useEffect(() => {
    api.get('/products', { params: { search: q, category: cat, limit: 20 } })
      .then(r => {
        if (r.data.items?.length) setItems(r.data.items);
        if (r.data.categories?.length) setCategories(r.data.categories);
      })
      .catch(() => {});
  }, [q, cat]);

  return (
    <section className="page">
      <p className="eyebrow">NOVA COLLECTION</p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '44px', marginBottom: '16px' }}>Shop Everything</h1>

      {/* SEARCH AND FILTERS */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', margin: '24px 0 36px' }}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search products..."
          style={{ maxWidth: '380px' }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setCat('')} style={{ padding: '10px 18px', background: cat === '' ? 'var(--text-dark)' : '#fff', color: cat === '' ? '#fff' : 'var(--text-dark)', border: '1px solid var(--border-light)', borderRadius: '20px', cursor: 'pointer' }}>
            All
          </button>
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ padding: '10px 18px', background: cat === c ? 'var(--text-dark)' : '#fff', color: cat === c ? '#fff' : 'var(--text-dark)', border: '1px solid var(--border-light)', borderRadius: '20px', cursor: 'pointer' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid">
        {items.map(p => (
          <ProductCard key={p._id || p.id} p={p} />
        ))}
      </div>
    </section>
  );
}