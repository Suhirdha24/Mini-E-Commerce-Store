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
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--sc-text-dark)', marginBottom: '8px' }}>
          {cat ? `${cat} For You!` : 'All Products For You!'}
        </h1>
        <p style={{ color: 'var(--sc-text-muted)', fontSize: '14.5px' }}>
          Showing {filtered.length} products available for instant dispatch.
        </p>
      </div>

      {/* FILTER CONTROLS */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '16px', 
        flexWrap: 'wrap', 
        marginBottom: '36px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--sc-border)'
      }}>
        {/* CATEGORY PILLS */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => handleCategoryClick('')}
            className={`shopcart-pill-btn ${cat === '' ? 'active' : ''}`}
          >
            All Products ({items.length})
          </button>
          {categories.map(c => {
            const count = items.filter(i => i && i.category === c).length;
            return (
              <button 
                key={c} 
                onClick={() => handleCategoryClick(c)}
                className={`shopcart-pill-btn ${cat === c ? 'active' : ''}`}
              >
                {c} ({count})
              </button>
            );
          })}
        </div>

        {/* SEARCH & SORT */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            value={q}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder="Search products..."
            style={{ 
              width: '200px', 
              borderRadius: 'var(--sc-radius-pill)', 
              padding: '9px 16px',
              fontSize: '13px' 
            }}
          />

          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            style={{ 
              width: 'auto', 
              borderRadius: 'var(--sc-radius-pill)', 
              fontSize: '13px', 
              fontWeight: 600,
              padding: '9px 16px',
              cursor: 'pointer',
              background: '#FFFFFF' 
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
          padding: '80px 20px', 
          background: 'var(--sc-bg-soft)', 
          borderRadius: 'var(--sc-radius-md)', 
          border: '1px solid var(--sc-border)', 
          margin: '20px 0' 
        }}>
          <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>No products found</h3>
          <p style={{ color: 'var(--sc-text-muted)', marginBottom: '20px', fontSize: '14px' }}>
            No creations match your current filters.
          </p>
          <button 
            onClick={() => { setQ(''); handleCategoryClick(''); }} 
            className="primary"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="shopcart-product-grid">
          {filtered.map(p => (
            <ProductCard key={p._id || p.id || p.sku || p.name} p={p} />
          ))}
        </div>
      )}
    </section>
  );
}