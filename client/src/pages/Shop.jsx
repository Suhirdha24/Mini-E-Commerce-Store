import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { initialAdminProducts } from '../data/initialProducts';
import { SearchIcon, CloseIcon } from '../components/Icons';
import api from '../api/api';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState(initialAdminProducts || []);
  const [loading, setLoading] = useState(false);
  
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('cat') || '';
  const sortParam = searchParams.get('sort') || 'featured';

  const [q, setQ] = useState(queryParam);
  const [cat, setCat] = useState(categoryParam);
  const [sortBy, setSortBy] = useState(sortParam);

  useEffect(() => {
    setQ(searchParams.get('q') || '');
    setCat(searchParams.get('cat') || '');
    setSortBy(searchParams.get('sort') || 'featured');
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

  const handleSortChange = (value) => {
    setSortBy(value);
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'featured') {
      params.set('sort', value);
    } else {
      params.delete('sort');
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
    filtered.sort((a, b) => Number(a.salePrice || a.price || 0) - Number(b.salePrice || b.price || 0));
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => Number(b.salePrice || b.price || 0) - Number(a.salePrice || a.price || 0));
  } else if (sortBy === 'name') {
    filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else if (sortBy === 'deals') {
    filtered = filtered.filter(p => Number(p.regularPrice || 0) > Number(p.salePrice || p.price || 0) || p.featured);
  }

  return (
    <div className="container page">
      {/* BREADCRUMBS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
        <Link to="/home" style={{ color: 'var(--text-muted)' }}>Home</Link>
        <span>/</span>
        <Link to="/shop" style={{ color: 'var(--text-muted)' }}>Catalog</Link>
        {cat && (
          <>
            <span>/</span>
            <span style={{ color: 'var(--text-dark)', fontWeight: 600 }}>{cat}</span>
          </>
        )}
      </div>

      {/* HEADER TITLE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
            {cat ? `${cat} Collection` : sortBy === 'deals' ? "Today's Deals & Offers" : 'Store Catalog'}
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Showing {filtered.length} products available for immediate dispatch.
          </p>
        </div>

        {/* ACTIVE FILTER BADGES */}
        {(q || cat) && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {cat && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: '12px', fontWeight: 600 }}>
                Category: {cat}
                <button onClick={() => handleCategoryClick('')} style={{ display: 'flex' }}><CloseIcon size={12} /></button>
              </span>
            )}
            {q && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: '12px', fontWeight: 600 }}>
                Search: "{q}"
                <button onClick={() => handleSearchChange('')} style={{ display: 'flex' }}><CloseIcon size={12} /></button>
              </span>
            )}
          </div>
        )}
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
        borderBottom: '1px solid var(--border)'
      }}>
        {/* CATEGORY FILTER CHIPS */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => handleCategoryClick('')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '13px',
              fontWeight: 600,
              background: cat === '' ? 'var(--text-dark)' : 'var(--bg-surface)',
              color: cat === '' ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border)'
            }}
          >
            All Products ({items.length})
          </button>
          {categories.map(c => {
            const count = items.filter(i => i && i.category === c).length;
            const isSel = cat === c;
            return (
              <button 
                key={c} 
                onClick={() => handleCategoryClick(c)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '13px',
                  fontWeight: 600,
                  background: isSel ? 'var(--text-dark)' : 'var(--bg-surface)',
                  color: isSel ? '#fff' : 'var(--text-muted)',
                  border: '1px solid var(--border)'
                }}
              >
                {c} ({count})
              </button>
            );
          })}
        </div>

        {/* SEARCH & SORT SELECTOR */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input
              value={q}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Search in catalog..."
              style={{ 
                width: '200px', 
                padding: '8px 12px 8px 32px',
                fontSize: '13px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border)'
              }}
            />
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
              <SearchIcon size={14} />
            </span>
          </div>

          <select 
            value={sortBy} 
            onChange={e => handleSortChange(e.target.value)}
            style={{ 
              width: 'auto',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 500,
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border)',
              background: 'var(--bg-surface)',
              cursor: 'pointer'
            }}
          >
            <option value="featured">Sort by: Featured</option>
            <option value="deals">Sort by: Best Deals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* PRODUCT GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>
          Loading products from inventory...
        </div>
      ) : filtered.length > 0 ? (
        <div className="product-grid">
          {filtered.map(p => (
            <ProductCard key={p._id || p.id || p.sku} p={p} />
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '64px 20px', 
          background: 'var(--bg-surface)', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border)' 
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>
            No products matched your criteria
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '20px' }}>
            Try resetting your search query or selecting a different category.
          </p>
          <button 
            onClick={() => { handleCategoryClick(''); handleSearchChange(''); }}
            className="btn btn-primary"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}