import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { initialAdminProducts } from '../data/initialProducts';
import api from '../api/api';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState(initialAdminProducts || []);
  const [loading, setLoading] = useState(false);
  
  // Read query params if present
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('cat') || '';

  const [q, setQ] = useState(queryParam);
  const [cat, setCat] = useState(categoryParam);
  const [sortBy, setSortBy] = useState('featured');

  // Keep state synchronized if URL search params change
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
      .catch(() => {
        // Fallback to initial seed products
      })
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

  // Dynamically extract distinct categories
  const categories = Array.from(new Set((items || []).map(i => i?.category).filter(Boolean)));

  // Filter products
  let filtered = (items || []).filter(i => 
    i &&
    (!cat || i.category === cat) &&
    (!q || (i.name && i.name.toLowerCase().includes(q.toLowerCase())) || 
     (i.category && i.category.toLowerCase().includes(q.toLowerCase())) ||
     (i.description && i.description.toLowerCase().includes(q.toLowerCase())))
  );

  // Apply sorting
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => (a.salePrice || a.price || 0) - (b.salePrice || b.price || 0));
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => (b.salePrice || b.price || 0) - (a.salePrice || a.price || 0));
  } else if (sortBy === 'name') {
    filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  return (
    <section className="page">
      <div style={{ marginBottom: '32px' }}>
        <p className="eyebrow">THE COMPLETE CATALOG ({items.length} PIECES)</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '44px', fontWeight: 500, color: 'var(--text-main)', margin: '4px 0 12px' }}>
          {cat ? `${cat} Collection` : 'All Curated Pieces'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15.5px', maxWidth: '640px' }}>
          Discover handcrafted essentials manufactured with natural fibers, certified full-grain leathers, and low-waste production processes.
        </p>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '20px', 
        flexWrap: 'wrap', 
        marginBottom: '32px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border-light)'
      }}>
        {/* CATEGORY PILLS */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button 
            onClick={() => handleCategoryClick('')}
            className={`category-tab-btn ${cat === '' ? 'active' : ''}`}
          >
            All ({items.length})
          </button>
          {categories.map(c => {
            const count = items.filter(i => i && i.category === c).length;
            return (
              <button 
                key={c} 
                onClick={() => handleCategoryClick(c)}
                className={`category-tab-btn ${cat === c ? 'active' : ''}`}
              >
                {c} ({count})
              </button>
            );
          })}
        </div>

        {/* SEARCH & SORT CONTROLS */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '13px' }}>🔍</span>
            <input
              value={q}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Filter catalog..."
              style={{ paddingLeft: '34px', paddingRight: '12px', borderRadius: '30px', fontSize: '13px' }}
            />
          </div>

          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            style={{ 
              width: 'auto', 
              borderRadius: '30px', 
              fontSize: '13px', 
              fontWeight: 600,
              padding: '11px 18px',
              cursor: 'pointer' 
            }}
          >
            <option value="featured">Featured Curation</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS DISPLAY GRID */}
      {filtered.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px', 
          background: 'var(--bg-surface)', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border-light)', 
          margin: '20px 0' 
        }}>
          <span style={{ fontSize: '36px', display: 'block', marginBottom: '12px' }}>🔍</span>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', marginBottom: '8px' }}>No Matching Creations Found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 20px' }}>
            We could not find any items matching your active filters. Try clearing your search keyword or switching categories.
          </p>
          <button 
            onClick={() => { setQ(''); handleCategoryClick(''); }} 
            className="primary"
          >
            Reset All Filters
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