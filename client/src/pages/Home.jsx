import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { initialAdminProducts } from '../data/initialProducts';
import { useCart } from '../context/CartContext';
import api from '../api/api';

export default function Home() {
  const navigate = useNavigate();
  const { add } = useCart();
  const [allProducts, setAllProducts] = useState(initialAdminProducts || []);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    api.get('/products?limit=100')
      .then(res => {
        if (res.data?.items && Array.isArray(res.data.items) && res.data.items.length > 0) {
          setAllProducts(res.data.items);
        } else if (Array.isArray(res.data) && res.data.length > 0) {
          setAllProducts(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Quick add helper for bento cards
  const handleQuickAdd = (productName, category, price, image) => {
    const matched = allProducts.find(p => p.name && p.name.toLowerCase().includes(productName.toLowerCase())) || {
      id: `bento_${Date.now()}`,
      name: productName,
      category,
      price,
      salePrice: price,
      image,
      stock: 15
    };
    add(matched, 1);
  };

  const stories = [
    { label: 'Tech', ring: 'ring-blue', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80', cat: 'Electronics' },
    { label: 'Streetwear', ring: 'ring-violet', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&auto=format&fit=crop&q=80', cat: 'Apparel' },
    { label: 'Footwear', ring: 'ring-lime', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80', cat: 'Footwear' },
    { label: 'Accessories', ring: 'ring-orange', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80', cat: 'Accessories' },
    { label: 'Home Tech', ring: 'ring-blue', img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&auto=format&fit=crop&q=80', cat: 'Electronics' },
    { label: 'Fitness', ring: 'ring-violet', img: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=300&auto=format&fit=crop&q=80', cat: 'Accessories' },
  ];

  const filteredProducts = activeCategory 
    ? allProducts.filter(p => p.category === activeCategory)
    : allProducts;

  return (
    <>
      {/* 1. CATEGORY STORY CIRCLES STRIP */}
      <section className="bento-stories-container">
        <div className="bento-stories-row">
          {stories.map(s => (
            <div 
              key={s.label} 
              className="bento-story-item"
              onClick={() => {
                setActiveCategory(activeCategory === s.cat ? '' : s.cat);
              }}
            >
              <div className={`bento-story-ring ${s.ring}`}>
                <div className="bento-story-inner">
                  <img src={s.img} alt={s.label} />
                </div>
              </div>
              <span className="bento-story-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. ASYMMETRIC 3D SPATIAL BENTO HERO (Concept B) */}
      <section className="bento-hero-section">
        <div className="bento-hero-grid">
          {/* TILE 1: OBSIDIAN TECH CAPSULE (LEFT) */}
          <div className="bento-tile-obsidian">
            <div className="bento-neon-glow-line"></div>

            <div className="bento-obsidian-visual">
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80" 
                alt="NOVA Spatial Audio Headphones" 
              />
            </div>

            <div>
              <h2 className="bento-obsidian-headline">
                NOVA FUTURE:<br />The Tech Collection
              </h2>
              <p className="bento-obsidian-sub">
                Spatial acoustic architecture & high-fidelity acoustics.
              </p>
              <Link to="/shop?cat=Electronics" className="bento-btn-white-pill">
                SHOP NOW
              </Link>
            </div>
          </div>

          {/* TILE 2: PLATINUM CUBE SHOWCASE (CENTER) */}
          <div className="bento-tile-platinum">
            <div>
              <span className="eyebrow">CURATED GEAR</span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
                Next-Gen Spatial Living
              </h3>
            </div>

            <div className="bento-platinum-visual">
              <img 
                src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80" 
                alt="Modern camera tech essentials" 
              />
            </div>

            <div className="bento-platinum-footer">
              <span className="bento-platinum-title">TECH ESSENTIALS</span>
              <button 
                className="bento-btn-lime"
                onClick={() => navigate('/shop?cat=Electronics')}
              >
                EXPLORE
              </button>
            </div>
          </div>

          {/* TILE 3: RIGHT MINI STACK (JACKET & KICKS) */}
          <div className="bento-right-stack">
            {/* MINI CARD 1: TECHNICAL JACKET */}
            <div className="bento-mini-stack-card">
              <div className="bento-mini-thumb">
                <img 
                  src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&auto=format&fit=crop&q=80" 
                  alt="NOVA Jacket 2.0" 
                />
              </div>
              <div className="bento-mini-info">
                <span className="bento-mini-tag">Streetwear</span>
                <h4 className="bento-mini-title">NOVA Jacket 2.0</h4>
                <div className="bento-mini-row">
                  <span className="bento-mini-price">₹4,999</span>
                  <button 
                    className="bento-btn-blue-add"
                    onClick={() => handleQuickAdd('NOVA Jacket 2.0', 'Apparel', 4999, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&auto=format&fit=crop&q=80')}
                  >
                    Add +
                  </button>
                </div>
              </div>
            </div>

            {/* MINI CARD 2: KICKS / SNEAKERS */}
            <div className="bento-mini-stack-card">
              <div className="bento-mini-thumb">
                <img 
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80" 
                  alt="NOVA Kicks Streetwear" 
                />
              </div>
              <div className="bento-mini-info">
                <span className="bento-mini-tag" style={{ color: 'var(--bento-orange)' }}>Footwear</span>
                <h4 className="bento-mini-title">NOVA Hyper Kicks</h4>
                <div className="bento-mini-row">
                  <span className="bento-mini-price">₹3,499</span>
                  <button 
                    className="bento-btn-blue-add"
                    onClick={() => handleQuickAdd('NOVA Hyper Kicks', 'Footwear', 3499, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80')}
                  >
                    Add +
                  </button>
                </div>
              </div>
            </div>

            {/* MINI CARD 3: AURORA EARBUDS */}
            <div className="bento-mini-stack-card">
              <div className="bento-mini-thumb">
                <img 
                  src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80" 
                  alt="Aurora Earbuds" 
                />
              </div>
              <div className="bento-mini-info">
                <span className="bento-mini-tag" style={{ color: 'var(--bento-violet)' }}>Audio</span>
                <h4 className="bento-mini-title">Aurora Earbuds Pro</h4>
                <div className="bento-mini-row">
                  <span className="bento-mini-price">₹2,499</span>
                  <button 
                    className="bento-btn-blue-add"
                    onClick={() => handleQuickAdd('Aurora Earbuds Pro', 'Electronics', 2499, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80')}
                  >
                    Add +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MODERN PRODUCT CATALOG GRID */}
      <section className="bento-catalog-section">
        <div className="bento-section-header-row">
          <div>
            <span className="eyebrow">DISCOVER THE ARCHIVE</span>
            <h2 className="bento-section-title">
              {activeCategory ? `${activeCategory} Collection` : 'Trending Releases'}
            </h2>
          </div>
          <Link to="/shop" className="bento-view-all-link">
            Explore All Catalog →
          </Link>
        </div>

        <div className="bento-product-grid">
          {filteredProducts.slice(0, 8).map(p => (
            <ProductCard key={p._id || p.id || p.sku || p.name} p={p} />
          ))}
        </div>
      </section>
    </>
  );
}