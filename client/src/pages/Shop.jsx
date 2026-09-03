import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { initialAdminProducts } from '../data/initialProducts';
import api from '../api/api';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState(initialAdminProducts || []);
  const [loading, setLoading] = useState(false);
  
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('cat') || '';

  const [q, setQ] = useState(queryParam);
  const [cat, setCat] = useState(categoryParam);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    setQ(searchParams.get('q') || '');
    setCat(searchParams.get('cat') || '');
  }, [searchParams]);

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
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCategoryClick = (category) => {
    setCat(category);
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('cat', category);
    } else {
      params.delete('cat');
    }
    setSearchParams(params);
  };

  const handleSearchChange = (value) => {
    setQ(value);
    const params = new URLSearchParams(searchParams);
    if (value.trim()) {
      params.set('q', value.trim());
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  const categories = Array.from(new Set((items || []).map(i => i?.category).filter(Boolean)));

  let filtered = (items || []).filter(i => 
    i &&
    (!cat || i.category === cat) &&
    (!q || (i.name && i.name.toLowerCase().includes(q.toLowerCase())) || 
     (i.category && i.category.toLowerCase().includes(q.toLowerCase())) ||
     (i.description && i.description.toLowerCase().includes(q.toLowerCase())))
  );

  if (sortBy === 'price-low') {
    filtered.sort((a, b) => (a.salePrice || a.price || 0) - (b.salePrice || b.price || 0));
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => (b.salePrice || b.price || 0) - (a.salePrice || a.price || 0));
  } else if (sortBy === 'name') {
    filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  return (
    <section className="page">
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">
          {cat ? `${cat} Collection` : 'All Products'}
        </h1>
        <p className="page-sub">
          Showing {filtered.length} products available for immediate delivery.
        </p>
      </div>

      {/* TOOLBAR */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '16px', 
        flexWrap: 'wrap', 
        marginBottom: '28px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {/* CATEGORY PILLS */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => handleCategoryClick('')}
            className={`cat-pill ${cat === '' ? 'active' : ''}`}
          >
            All ({items.length})
          </button>
          {categories.map(c => {
            const count = items.filter(i => i && i.category === c).length;
            const isSel = cat === c;
            return (
              <button 
                key={c} 
                onClick={() => handleCategoryClick(c)}
                className={`cat-pill ${isSel ? 'active' : ''}`}
              >
                {c} ({count})
              </button>
            );
          })}
        </div>

        {/* SEARCH & SORT */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            value={q}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder="Filter items..."
            style={{ 
              width: '180px', 
              padding: '7px 12px',
              fontSize: '13px' 
            }}
          />

          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            style={{ 
              width: 'auto', 
              padding: '7px 12px',
              fontSize: '13px', 
              fontWeight: 500,
              cursor: 'pointer' 
            }}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS DISPLAY GRID */}
      {filtered.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          background: 'var(--bg-muted)', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border-color)', 
          margin: '20px 0' 
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '6px' }}>No products found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '13.5px' }}>
            No creations match your active filters.
          </p>
          <button 
            onClick={() => { setQ(''); handleCategoryClick(''); }} 
            className="primary"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map(p => (
            <ProductCard key={p._id || p.id || p.sku || p.name} p={p} />
          ))}
        </div>
      )}
    </section>
  );
}