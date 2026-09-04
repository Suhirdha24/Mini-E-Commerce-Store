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
    // Only set loading true if we don't already have catalog products
    if (!items || items.length === 0) {
      setLoading(true);
    }
    api.get('/products?limit=200', { timeout: 3500 })
      .then(res => {
        if (res.data?.items && Array.isArray(res.data.items) && res.data.items.length > 0) {
          setItems(res.data.items);
        } else if (Array.isArray(res.data) && res.data.length > 0) {
          setItems(res.data);
        }
      })
      .catch((err) => {
        console.warn('Catalog network fetch fallback:', err?.message);
        if (!items || items.length === 0) {
          setItems(initialAdminProducts || []);
        }
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

  // Deduplicate products by unique key
  const seenCatalogKeys = new Set();
  const uniqueItems = (items || []).filter(item => {
    if (!item) return false;
    const key = (item._id || item.id || item.sku || item.name).toString().toLowerCase();
    if (seenCatalogKeys.has(key)) return false;
    seenCatalogKeys.add(key);
    return true;
  });

  const DEPARTMENT_ORDER = [
    'Electronics',
    'Workspace',
    'Fitness',
    'Bags',
    'Footwear',
    'Accessories',
    'Apparel',
    'Home'
  ];

  const categories = Array.from(new Set(uniqueItems.map(i => i?.category).filter(Boolean))).sort((a, b) => {
    const idxA = DEPARTMENT_ORDER.indexOf(a);
    const idxB = DEPARTMENT_ORDER.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  let filtered = uniqueItems.filter(i => 
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
    // Strictly products with real discounts, sorted by discount percentage descending
    filtered = filtered.filter(p => Number(p.regularPrice || 0) > Number(p.salePrice || p.price || 0));
    filtered.sort((a, b) => {
      const discA = (Number(a.regularPrice) - Number(a.salePrice || a.price)) / Number(a.regularPrice);
      const discB = (Number(b.regularPrice) - Number(b.salePrice || b.price)) / Number(b.regularPrice);
      return discB - discA;
    });
  } else if (sortBy === 'new') {
    // New Arrivals: prioritize new categories (Workspace & Fitness) and newest releases
    filtered.sort((a, b) => {
      const isNewA = (a.category === 'Workspace' || a.category === 'Fitness' || (a.sku && (a.sku.includes('WKS') || a.sku.includes('FIT')))) ? 1 : 0;
      const isNewB = (b.category === 'Workspace' || b.category === 'Fitness' || (b.sku && (b.sku.includes('WKS') || b.sku.includes('FIT')))) ? 1 : 0;
      if (isNewA !== isNewB) return isNewB - isNewA;
      const dateA = a.created_at || a.createdAt ? new Date(a.created_at || a.createdAt).getTime() : 0;
      const dateB = b.created_at || b.createdAt ? new Date(b.created_at || b.createdAt).getTime() : 0;
      if (dateB !== dateA) return dateB - dateA;
      return String(b.id || b._id || '').localeCompare(String(a.id || a._id || ''));
    });
  } else if (sortBy === 'best') {
    filtered.sort((a, b) => {
      const featA = a.featured ? 1 : 0;
      const featB = b.featured ? 1 : 0;
      if (featA !== featB) return featB - featA;
      return (b.stock || 0) - (a.stock || 0);
    });
  }

  return (
    <div className="container page">
      {/* BREADCRUMBS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
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

      {/* DISTINCTIVE CURATED HERO BANNER FOR SPECIAL VIEWS */}
      {sortBy === 'deals' && (
        <div style={{
          background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
          border: '1px solid #FDE68A',
          borderRadius: '20px',
          padding: '28px 36px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#B45309', display: 'inline-block', marginBottom: '6px' }}>
              TODAY'S SPECIAL MARKDOWNS
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#78350F', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              Verified Flash Deals — Up to 35% Instant Price Drops
            </h2>
            <p style={{ fontSize: '14.5px', color: '#92400E', margin: 0 }}>
              Showing {filtered.length} products with active savings. Sorted by highest percentage discount first.
            </p>
          </div>
          <div style={{ background: '#F59E0B', color: '#FFFFFF', padding: '10px 22px', borderRadius: 'var(--radius-pill)', fontWeight: 700, fontSize: '14px', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)' }}>
            🔥 Live Flash Deals
          </div>
        </div>
      )}

      {sortBy === 'new' && (
        <div style={{
          background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
          border: '1px solid #BBF7D0',
          borderRadius: '20px',
          padding: '28px 36px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#15803D', display: 'inline-block', marginBottom: '6px' }}>
              JUST LANDED • NEW SEASON RELEASES
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#14532D', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              Workspace Ergonomics & Active Fitness Collections
            </h2>
            <p style={{ fontSize: '14.5px', color: '#166534', margin: 0 }}>
              Explore our newest arrivals crafted for focus and daily movement.
            </p>
          </div>
          <div style={{ background: '#16A34A', color: '#FFFFFF', padding: '10px 22px', borderRadius: 'var(--radius-pill)', fontWeight: 700, fontSize: '14px', boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)' }}>
            ✨ Fresh Drops Added
          </div>
        </div>
      )}

      {sortBy === 'best' && (
        <div style={{
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
          border: '1px solid #BFDBFE',
          borderRadius: '20px',
          padding: '28px 36px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#1D4ED8', display: 'inline-block', marginBottom: '6px' }}>
              COMMUNITY FAVORITES
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#1E3A8A', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              Highest Rated & Most Popular Essentials
            </h2>
            <p style={{ fontSize: '14.5px', color: '#1E40AF', margin: 0 }}>
              Curated customer essentials with 4.9★ satisfaction ratings.
            </p>
          </div>
          <div style={{ background: '#2563EB', color: '#FFFFFF', padding: '10px 22px', borderRadius: 'var(--radius-pill)', fontWeight: 700, fontSize: '14px', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)' }}>
            ⭐ 4.9★ Community Rating
          </div>
        </div>
      )}

      {/* HEADER TITLE */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '34px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.03em' }}>
                {cat 
                  ? `${cat} Collection` 
                  : sortBy === 'deals' 
                    ? "Today's Deals & Offers" 
                    : sortBy === 'new' 
                      ? 'New Arrivals' 
                      : sortBy === 'best' 
                        ? 'Best Sellers' 
                        : 'Store Catalog'}
              </h1>
              <span style={{ background: '#E2E8F0', color: '#1E293B', fontSize: '13.5px', fontWeight: 700, padding: '5px 14px', borderRadius: '9999px' }}>
                {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
              </span>
            </div>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: '6px 0 0' }}>
              {cat 
                ? `Explore precision crafted products for the ${cat.toLowerCase()} collection.` 
                : 'Showing curated lifestyle products available for immediate dispatch.'}
            </p>
          </div>
        </div>
      </div>

      {/* 1. CATEGORY DEPARTMENT PILLS ROW */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        overflowX: 'auto',
        paddingBottom: '12px',
        marginBottom: '22px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        <button 
          onClick={() => handleCategoryClick('')}
          style={{
            padding: '10px 22px',
            borderRadius: '9999px',
            fontSize: '14.5px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            background: cat === '' ? '#0F172A' : '#FFFFFF',
            color: cat === '' ? '#FFFFFF' : '#334155',
            border: cat === '' ? '1px solid #0F172A' : '1px solid #CBD5E1',
            boxShadow: cat === '' ? '0 4px 14px rgba(15, 23, 42, 0.22)' : '0 1px 3px rgba(15, 23, 42, 0.04)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          All Products ({uniqueItems.length})
        </button>
        {categories.map(c => {
          const count = uniqueItems.filter(i => i && i.category === c).length;
          const isSel = cat === c;
          return (
            <button 
              key={c} 
              onClick={() => handleCategoryClick(c)}
              style={{
                padding: '10px 22px',
                borderRadius: '9999px',
                fontSize: '14.5px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                background: isSel ? '#0F172A' : '#FFFFFF',
                color: isSel ? '#FFFFFF' : '#334155',
                border: isSel ? '1px solid #0F172A' : '1px solid #CBD5E1',
                boxShadow: isSel ? '0 4px 14px rgba(15, 23, 42, 0.22)' : '0 1px 3px rgba(15, 23, 42, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {c} ({count})
            </button>
          );
        })}
      </div>

      {/* 2. ACTIONS & SORT BAR */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '16px', 
        flexWrap: 'wrap', 
        marginBottom: '28px',
        padding: '16px 24px',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
      }}>
        {/* LEFT: RESULTS & ACTIVE FILTER PILLS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
            Showing {filtered.length} products
          </span>
          {(cat || q) && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {cat && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                  Category: {cat}
                  <button onClick={() => handleCategoryClick('')} style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }} aria-label="Clear category filter">
                    <CloseIcon size={13} />
                  </button>
                </span>
              )}
              {q && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                  Search: "{q}"
                  <button onClick={() => handleSearchChange('')} style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }} aria-label="Clear search">
                    <CloseIcon size={13} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: SEARCH & SORT SELECTOR */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input
              value={q}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Search in catalog..."
              style={{ 
                width: '280px', 
                padding: '10px 16px 10px 42px',
                fontSize: '14px',
                borderRadius: '9999px',
                border: '1px solid #CBD5E1',
                background: '#F8FAFC',
                color: '#0F172A',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', display: 'flex', pointerEvents: 'none' }}>
              <SearchIcon size={16} />
            </span>
          </div>

          <select 
            value={sortBy} 
            onChange={e => handleSortChange(e.target.value)}
            style={{ 
              width: 'auto',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '9999px',
              border: '1px solid #CBD5E1',
              background: '#F8FAFC',
              color: '#0F172A',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="featured">Sort by: Featured</option>
            <option value="deals">Sort by: Best Deals</option>
            <option value="new">Sort by: New Arrivals</option>
            <option value="best">Sort by: Best Sellers</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* PRODUCT GRID */}
      {filtered.length > 0 ? (
        <div className="product-grid">
          {filtered.map(p => (
            <ProductCard key={p._id || p.id || p.sku} p={p} />
          ))}
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)', fontSize: '15px' }}>
          Loading products from inventory...
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