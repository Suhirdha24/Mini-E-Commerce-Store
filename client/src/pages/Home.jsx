import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { initialAdminProducts } from '../data/initialProducts';
import { useCart } from '../context/CartContext';
import api from '../api/api';

// 6 Circular Story Highlights from the Sable Template
const SABLE_STORIES = [
  { name: 'Men', count: '120+ Items', cat: 'Apparel', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=360&auto=format&fit=crop&q=80' },
  { name: 'Women', count: '180+ Items', cat: 'Apparel', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=360&auto=format&fit=crop&q=80' },
  { name: 'Bags', count: '220+ Items', cat: 'Bags', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=360&auto=format&fit=crop&q=80' },
  { name: 'Shoes', count: '140+ Items', cat: 'Footwear', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=360&auto=format&fit=crop&q=80' },
  { name: 'Watches', count: '210+ Items', cat: 'Accessories', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=360&auto=format&fit=crop&q=80' },
  { name: 'Accessories', count: '320+ Items', cat: 'Accessories', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=360&auto=format&fit=crop&q=80' }
];

export default function Home() {
  const { add } = useCart();
  const [allProducts, setAllProducts] = useState(initialAdminProducts || []);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [quickAddedId, setQuickAddedId] = useState(null);

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

  // 8 Bestsellers for the Sable grid
  const bestsellers = (allProducts || []).slice(0, 8);

  // 4 Curated pieces for "This week's edit"
  const quadItems = (allProducts || []).slice(0, 4);

  const handleQuickAdd = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    add(item, 1);
    setQuickAddedId(item.id || item._id || item.sku);
    setTimeout(() => setQuickAddedId(null), 1500);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 4000);
    }
  };

  return (
    <>
      {/* 1. SABLE EDITORIAL HERO BANNER */}
      <section className="sable-hero-section">
        <div className="sable-hero-frame">
          <div className="sable-hero-content">
            <p className="sable-hero-kicker">Best Collection</p>
            <h1 className="sable-hero-headline">
              Quiet luxury,<br />
              <em>loudly considered.</em>
            </h1>
            <p className="sable-hero-paragraph">
              Explore premium clothing and statement accessories curated for every season, every style, and every occasion.
            </p>
            <div className="sable-hero-actions">
              <Link to="/shop" className="sable-btn-primary">
                SHOP THE EDIT
              </Link>
              <Link to="/about" className="sable-btn-secondary">
                View Lookbook →
              </Link>
            </div>
          </div>

          <div className="sable-hero-visual">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80" 
              alt="Sable Quiet Luxury Collection" 
            />
          </div>
        </div>
      </section>

      {/* 2. SABLE CIRCULAR STORY CATEGORIES */}
      <section className="sable-stories-section">
        <div className="sable-stories-row">
          {SABLE_STORIES.map(story => (
            <Link 
              key={story.name} 
              to={`/shop?cat=${encodeURIComponent(story.cat)}`}
              className="sable-story-circle-item"
            >
              <div className="sable-story-avatar">
                <div className="sable-story-inner">
                  <img src={story.img} alt={story.name} loading="lazy" />
                </div>
              </div>
              <span className="sable-story-name">{story.name}</span>
              <span className="sable-story-count">{story.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. "THIS WEEK'S EDIT" ASYMMETRIC FASHION BENTO */}
      <section className="sable-edit-section">
        <div className="sable-section-header">
          <div>
            <p className="sable-kicker-small">NEW ARRIVALS</p>
            <h2 className="sable-title-editorial">This week's edit</h2>
          </div>
          <Link to="/shop" className="sable-view-all-link">
            View all →
          </Link>
        </div>

        <div className="sable-bento-grid">
          {/* TALL EDITORIAL PORTRAIT (Left) */}
          <div className="sable-bento-tall">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80" 
              alt="The Column Dress — Sandstone Capsule" 
            />
            <div className="sable-bento-tall-overlay">
              <span className="sable-bento-capsule-badge">Capsule Edit</span>
              <h3 className="sable-bento-tall-title">The Column Dress</h3>
              <p className="sable-bento-tall-desc">
                Organic Cotton • Handwoven Sandstone Hue. Engineered for timeless poise and understated comfort.
              </p>
              <Link 
                to="/shop?cat=Apparel" 
                style={{ 
                  color: '#FFFFFF', 
                  fontSize: '13.5px', 
                  fontWeight: 700, 
                  letterSpacing: '0.04em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Shop The Dress (₹4,999) →
              </Link>
            </div>
          </div>

          {/* 2x2 CLEAN FASHION GRID (Right) */}
          <div className="sable-bento-quad">
            {quadItems.map(item => {
              const itemId = item.id || item._id || item.sku;
              const isAdded = quickAddedId === itemId;
              const price = Number(item.salePrice || item.regularPrice || item.price || 0);

              return (
                <div key={itemId} className="sable-quad-card">
                  <Link to={`/product/${itemId}`} className="sable-quad-thumb">
                    <img src={item.image} alt={item.name} loading="lazy" />
                  </Link>
                  <div className="sable-quad-body">
                    <span className="sable-quad-cat">{item.category}</span>
                    <Link to={`/product/${itemId}`} style={{ textDecoration: 'none' }}>
                      <h4 className="sable-quad-name">{item.name}</h4>
                    </Link>
                    <div className="sable-quad-row">
                      <span className="sable-quad-price">₹{price.toLocaleString('en-IN')}</span>
                      <button 
                        className="sable-quad-add-btn"
                        onClick={(e) => handleQuickAdd(item, e)}
                        title="Add to Bag"
                        aria-label="Add to bag"
                      >
                        {isAdded ? '✓' : '+'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. SABLE FULL-WIDTH PEDESTAL BANNER */}
      <section className="sable-pedestal-section">
        <div className="sable-pedestal-frame">
          <img 
            src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1400&auto=format&fit=crop&q=80" 
            alt="Handbag on stone pedestal" 
          />
          <div className="sable-pedestal-overlay">
            <span className="sable-pedestal-tag">THE LEATHER CAPSULE</span>
            <h2 className="sable-pedestal-title">
              Carry Confidence With Every Single Outfit Today
            </h2>
            <p className="sable-pedestal-desc">
              A highly refined silhouette crafted from full-grain calfskin leather, built to age with grace and elevate modern wardrobes.
            </p>
            <div>
              <Link to="/shop?cat=Bags" className="sable-btn-primary">
                VIEW THE CAPSULE →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SABLE BESTSELLERS 8-CARD GRID */}
      <section className="sable-bestsellers-section">
        <div className="sable-section-header">
          <div>
            <p className="sable-kicker-small">SEASONAL FAVORITES</p>
            <h2 className="sable-title-editorial">Best sellers</h2>
          </div>
          <Link to="/shop" className="sable-view-all-link">
            Explore All Catalog →
          </Link>
        </div>

        <div className="sable-product-grid">
          {bestsellers.map(p => (
            <ProductCard key={p._id || p.id || p.sku || p.name} p={p} />
          ))}
        </div>
      </section>

      {/* 6. SABLE VIP NEWSLETTER */}
      <section className="sable-newsletter-section">
        <div className="sable-newsletter-box">
          <p className="sable-kicker-small">PRIVILEGE ACCESS</p>
          <h3 className="sable-newsletter-title">Join & Get 10% Off</h3>
          <p className="sable-newsletter-desc">
            Sign up now and enjoy exclusive deals, private seasonal lookbooks, and early access just for members.
          </p>

          {newsletterSubmitted ? (
            <div style={{ 
              background: '#E0DDD4', 
              color: 'var(--sable-text-dark)', 
              padding: '12px 24px', 
              borderRadius: 'var(--sable-radius-pill)', 
              display: 'inline-block',
              fontWeight: 600,
              fontSize: '13.5px' 
            }}>
              ✓ Welcome to Sable. Your 10% invitation code has been sent.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="sable-newsletter-form">
              <input 
                type="email" 
                required 
                placeholder="Enter your email address..." 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="sable-newsletter-input"
              />
              <button type="submit" className="sable-newsletter-btn">
                Become a Member →
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}