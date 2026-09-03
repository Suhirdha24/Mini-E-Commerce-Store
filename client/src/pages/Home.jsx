import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { initialAdminProducts } from '../data/initialProducts';
import { ArrowRightIcon, TruckIcon, ShieldIcon, RefreshIcon, CheckIcon, StarIcon } from '../components/Icons';
import api from '../api/api';

export default function Home() {
  const [allProducts, setAllProducts] = useState(initialAdminProducts || []);
  const [activeDealCategory, setActiveDealCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/products?limit=100')
      .then(res => {
        if (res.data?.items && Array.isArray(res.data.items) && res.data.items.length > 0) {
          setAllProducts(res.data.items);
        } else if (Array.isArray(res.data) && res.data.length > 0) {
          setAllProducts(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Category counts and list
  const categoryMeta = [
    { name: 'Electronics', count: allProducts.filter(p => p.category === 'Electronics').length || 4, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80' },
    { name: 'Bags', count: allProducts.filter(p => p.category === 'Bags').length || 3, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80' },
    { name: 'Footwear', count: allProducts.filter(p => p.category === 'Footwear').length || 3, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80' },
    { name: 'Accessories', count: allProducts.filter(p => p.category === 'Accessories').length || 3, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80' },
    { name: 'Apparel', count: allProducts.filter(p => p.category === 'Apparel').length || 2, img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80' },
    { name: 'Home', count: allProducts.filter(p => p.category === 'Home').length || 2, img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80' }
  ];

  // Deals: Products with discount or sale price
  const dealProducts = (activeDealCategory === 'All')
    ? allProducts.filter(p => (Number(p.regularPrice || 0) > Number(p.salePrice || p.price || 0)) || p.featured).slice(0, 8)
    : allProducts.filter(p => p.category === activeDealCategory).slice(0, 8);

  // New arrivals: sorted by createdAt
  const newArrivals = [...allProducts].slice(0, 4);

  // Best sellers: featured or popular items
  const bestSellers = [...allProducts].reverse().slice(0, 4);

  return (
    <div className="container page">
      {/* 1. LARGE PROMOTIONAL HERO AREA */}
      <section className="home-hero">
        <div className="hero-banner-card">
          <div className="hero-content">
            <span className="hero-tag">Curated Seasonal Drop</span>
            <h1 className="hero-heading">
              Upgrade Your Everyday Living.
            </h1>
            <p className="hero-subtitle">
              Discover precision acoustics, minimalist everyday carry, and durable lifestyle essentials crafted for modern living.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn-white">
                <span>Shop Catalog</span>
                <ArrowRightIcon size={16} />
              </Link>
              <Link to="/shop?sort=deals" className="btn-outline">
                Explore Deals
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80" 
              alt="NOVA Audio & Lifestyle" 
            />
          </div>
        </div>
      </section>

      {/* 2. PROMOTIONAL BANNERS (3-CARD BENTO) */}
      <section className="promo-grid">
        <div className="promo-card" style={{ background: '#EFF6FF', borderColor: '#DBEAFE' }}>
          <div className="promo-card-content">
            <span className="promo-card-tag" style={{ color: '#1D4ED8' }}>Studio Acoustics</span>
            <h3 className="promo-card-title">Wireless ANC Over-Ears</h3>
            <p className="promo-card-desc">Lossless audio with active noise cancelling.</p>
            <Link to="/shop?cat=Electronics" className="promo-card-link">
              <span>Explore Audio</span>
              <ArrowRightIcon size={13} />
            </Link>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&auto=format&fit=crop&q=80" 
            alt="Studio Audio" 
            className="promo-card-thumb"
          />
        </div>

        <div className="promo-card" style={{ background: '#FEF3C7', borderColor: '#FDE68A' }}>
          <div className="promo-card-content">
            <span className="promo-card-tag" style={{ color: '#B45309' }}>Everyday Utility</span>
            <h3 className="promo-card-title">Minimalist Daypack</h3>
            <p className="promo-card-desc">Weatherproof Cordura fabric with laptop sleeve.</p>
            <Link to="/shop?cat=Bags" className="promo-card-link">
              <span>View Carry</span>
              <ArrowRightIcon size={13} />
            </Link>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&auto=format&fit=crop&q=80" 
            alt="Minimalist Daypack" 
            className="promo-card-thumb"
          />
        </div>

        <div className="promo-card" style={{ background: '#DCFCE7', borderColor: '#BBF7D0' }}>
          <div className="promo-card-content">
            <span className="promo-card-tag" style={{ color: '#15803D' }}>Active Footwear</span>
            <h3 className="promo-card-title">Responsive Runners</h3>
            <p className="promo-card-desc">Breathable mesh with energy-returning foam.</p>
            <Link to="/shop?cat=Footwear" className="promo-card-link">
              <span>Shop Footwear</span>
              <ArrowRightIcon size={13} />
            </Link>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80" 
            alt="Footwear" 
            className="promo-card-thumb"
          />
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY SECTION */}
      <section className="section-wrap">
        <div className="section-head">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-desc">Explore carefully curated categories built for performance and comfort.</p>
          </div>
          <Link to="/shop" className="promo-card-link">
            <span>Browse All</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>

        <div className="category-grid">
          {categoryMeta.map(cat => (
            <Link 
              key={cat.name} 
              to={`/shop?cat=${cat.name}`}
              className="category-card"
            >
              <div className="category-card-icon">
                <img src={cat.img} alt={cat.name} />
              </div>
              <span className="category-card-name">{cat.name}</span>
              <span className="category-card-count">{cat.count} Products</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. TODAY'S BEST DEALS SECTION */}
      <section className="section-wrap">
        <div className="section-head">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ background: 'var(--accent-red-bg)', color: 'var(--accent-red)', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-xs)' }}>
                LIMITED TIME
              </span>
              <h2 className="section-title" style={{ margin: 0 }}>Today's Best Offers</h2>
            </div>
            <p className="section-desc">Special promotional prices on top-tier everyday gear.</p>
          </div>

          {/* CATEGORY CHIPS */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Electronics', 'Bags', 'Footwear'].map(c => (
              <button
                key={c}
                onClick={() => setActiveDealCategory(c)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  background: activeDealCategory === c ? 'var(--text-dark)' : 'var(--bg-surface)',
                  color: activeDealCategory === c ? '#fff' : 'var(--text-muted)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer'
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {dealProducts.length > 0 ? (
            dealProducts.map(p => (
              <ProductCard key={p._id || p.id || p.sku} p={p} />
            ))
          ) : (
            allProducts.slice(0, 4).map(p => (
              <ProductCard key={p._id || p.id || p.sku} p={p} />
            ))
          )}
        </div>
      </section>

      {/* 5. FEATURED COLLECTION EDITORIAL BANNER */}
      <section className="collection-split-banner">
        <img 
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80" 
          alt="Precision Timepieces & EDC"
          className="collection-banner-img"
        />
        <div className="collection-banner-info">
          <span className="eyebrow" style={{ color: 'var(--accent-amber)', marginBottom: '8px', display: 'block' }}>
            COLLECTION HIGHLIGHT
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1.2, color: 'var(--text-dark)', marginBottom: '14px' }}>
            Thoughtful Utility for the Modern Commute.
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
            Engineered with aerospace-grade anodized aluminum, sapphire crystal, and premium Horween leather straps. Designed to withstand daily rigor without compromising minimalist aesthetics.
          </p>
          <Link to="/shop?cat=Accessories" className="btn btn-primary">
            <span>Explore Accessories</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="section-wrap">
        <div className="section-head">
          <div>
            <h2 className="section-title">New Arrivals</h2>
            <p className="section-desc">The newest products added to the store inventory.</p>
          </div>
          <Link to="/shop?sort=new" className="promo-card-link">
            <span>View All New</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>

        <div className="product-grid">
          {newArrivals.map(p => (
            <ProductCard key={p._id || p.id || p.sku} p={p} />
          ))}
        </div>
      </section>

      {/* 7. BEST SELLERS */}
      <section className="section-wrap">
        <div className="section-head">
          <div>
            <h2 className="section-title">Best Sellers</h2>
            <p className="section-desc">Our community's most loved and highly-rated products.</p>
          </div>
          <Link to="/shop?sort=best" className="promo-card-link">
            <span>Explore Best Sellers</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>

        <div className="product-grid">
          {bestSellers.map(p => (
            <ProductCard key={p._id || p.id || p.sku} p={p} />
          ))}
        </div>
      </section>

      {/* 8. TRUST / SERVICE BENEFITS STRIP */}
      <section className="trust-strip">
        <div className="trust-item">
          <div className="trust-icon-box">
            <TruckIcon size={20} />
          </div>
          <div>
            <h4 className="trust-title">Free Shipping</h4>
            <p className="trust-subtitle">On all domestic orders over ₹1,999</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon-box">
            <ShieldIcon size={20} />
          </div>
          <div>
            <h4 className="trust-title">Secure Payments</h4>
            <p className="trust-subtitle">Cash on Delivery & Instant UPI verified</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon-box">
            <RefreshIcon size={20} />
          </div>
          <div>
            <h4 className="trust-title">30-Day Easy Returns</h4>
            <p className="trust-subtitle">Hassle-free exchange policy</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon-box">
            <StarIcon size={20} filled={false} />
          </div>
          <div>
            <h4 className="trust-title">Authenticity Guaranteed</h4>
            <p className="trust-subtitle">100% genuine brand warranty</p>
          </div>
        </div>
      </section>
    </div>
  );
}