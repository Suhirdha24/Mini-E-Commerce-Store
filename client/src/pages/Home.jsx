import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { initialAdminProducts } from '../data/initialProducts';
import { useCart } from '../context/CartContext';
import api from '../api/api';

// Circular category stories data (Sable template inspiration)
const STORY_CATEGORIES = [
  { name: 'Bags', count: '10+ Items', query: 'Bags', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&auto=format&fit=crop&q=80' },
  { name: 'Footwear', count: '10+ Items', query: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80' },
  { name: 'Accessories', count: '10+ Items', query: 'Accessories', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&auto=format&fit=crop&q=80' },
  { name: 'Apparel', count: '10+ Items', query: 'Apparel', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&auto=format&fit=crop&q=80' },
  { name: 'Home', count: '10+ Items', query: 'Home', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&auto=format&fit=crop&q=80' },
  { name: 'Electronics', count: '10+ Items', query: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80' }
];

export default function Home() {
  const navigate = useNavigate();
  const { add } = useCart();
  const [allProducts, setAllProducts] = useState(initialAdminProducts || []);
  const [activeTab, setActiveTab] = useState('All');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [bentoAddedId, setBentoAddedId] = useState(null);

  useEffect(() => {
    api.get('/products?limit=100')
      .then(res => {
        if (res.data?.items && Array.isArray(res.data.items) && res.data.items.length > 0) {
          setAllProducts(res.data.items);
        } else if (Array.isArray(res.data) && res.data.length > 0) {
          setAllProducts(res.data);
        }
      })
      .catch(() => {
        // Safe fallback to initial products
      });
  }, []);

  // Filter products for the Bestsellers section based on active tab
  const displayedBestsellers = (allProducts || [])
    .filter(p => activeTab === 'All' || p.category === activeTab)
    .slice(0, 8);

  // Curated 4 items for the "This Week's Edit" bento grid
  const bentoItems = (allProducts || []).slice(0, 4);

  const handleQuickBentoAdd = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    add(item, 1);
    setBentoAddedId(item.id || item._id || item.sku);
    setTimeout(() => setBentoAddedId(null), 1500);
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
      {/* 1. CIRCULAR STORY CATEGORIES STRIP (From Sable Luxury Template) */}
      <section className="story-categories-strip" aria-label="Category Stories">
        {STORY_CATEGORIES.map(cat => (
          <Link 
            key={cat.name} 
            to={`/shop?cat=${encodeURIComponent(cat.query)}`}
            className="story-category-item"
          >
            <div className="story-ring">
              <div className="story-image-inner">
                <img src={cat.image} alt={cat.name} loading="lazy" />
              </div>
            </div>
            <span className="story-label">{cat.name}</span>
            <span className="story-count">{cat.count}</span>
          </Link>
        ))}
      </section>

      {/* 2. EDITORIAL HERO SECTION (Homedine & Sable Fusion) */}
      <section className="editorial-hero-canvas">
        <div className="hero-rounded-container">
          {/* LEFT: TEXT & EDITORIAL STATEMENT */}
          <div>
            <div className="hero-eyebrow-pill">
              <span>✦ The 2026 Archive</span>
              <span style={{ opacity: 0.4 }}>|</span>
              <span>Ethical Luxury</span>
            </div>

            <h1 className="hero-main-heading">
              Quiet luxury,<br />loudly considered.
            </h1>

            <p className="hero-lead-text">
              Explore sixty thoughtfully curated creations spanning handcrafted leather goods, breathable knitwear, acoustic listening devices, and tactile living ceramics.
            </p>

            <div className="hero-actions-row">
              <Link to="/shop" className="btn-luxury-primary">
                Shop The Edit →
              </Link>
              <Link to="/about" className="btn-luxury-secondary">
                View Lookbook
              </Link>
            </div>
          </div>

          {/* RIGHT: HERO VISUAL STAGING WITH FLOATING GLASS BADGES (Homedine & Nitec) */}
          <div className="hero-visual-stage">
            {/* Top Right Floating Badge */}
            <div className="floating-glass-badge top-right">
              <div className="badge-stat-number">96%</div>
              <div className="badge-stat-text">
                Natural &<br />Sustainable
              </div>
            </div>

            {/* Main Stage Image */}
            <div className="hero-stage-card">
              <img 
                src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80" 
                alt="Nova Signature Leather Tote" 
              />
            </div>

            {/* Bottom Left Floating Badge */}
            <div className="floating-glass-badge bottom-left">
              <div style={{ fontSize: '22px' }}>★</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>4.9 / 5 Rating</div>
                <div className="badge-stat-text">From 25,000+ Verified Buyers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR-PILLAR TRUST RIBBON (From Homedine Template) */}
      <section className="trust-pillars-section">
        <div className="trust-pillars-grid">
          <div className="trust-pillar-card">
            <div className="pillar-icon-box">🚚</div>
            <div>
              <h4 className="pillar-title">Complimentary Express</h4>
              <p className="pillar-desc">Free pan-India delivery on orders over ₹1,999.</p>
            </div>
          </div>

          <div className="trust-pillar-card">
            <div className="pillar-icon-box">🌿</div>
            <div>
              <h4 className="pillar-title">Conscious Materials</h4>
              <p className="pillar-desc">Sourced ethically with zero synthetic compromises.</p>
            </div>
          </div>

          <div className="trust-pillar-card">
            <div className="pillar-icon-box">🔄</div>
            <div>
              <h4 className="pillar-title">30-Day Concierge Returns</h4>
              <p className="pillar-desc">Hassle-free exchanges and instant refunds.</p>
            </div>
          </div>

          <div className="trust-pillar-card">
            <div className="pillar-icon-box">🔒</div>
            <div>
              <h4 className="pillar-title">Encrypted Checkout</h4>
              <p className="pillar-desc">UPI, Cards, NetBanking & Cash on Delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "THIS WEEK'S EDIT" BENTO GRID (Sable & Nitec Inspiration) */}
      <section className="editorial-bento-section">
        <div className="section-header-row">
          <div>
            <p className="section-sublabel">CURATED SPOTLIGHT</p>
            <h2 className="section-headline">This Week's Edit</h2>
          </div>
          <Link to="/shop" className="section-link-more">
            View All Pieces →
          </Link>
        </div>

        <div className="bento-edit-layout">
          {/* TALL EDITORIAL PORTRAIT CARD (Left) */}
          <div className="bento-hero-portrait">
            <img 
              src="https://images.unsplash.com/photo-1544441893-675973e31985?w=900&auto=format&fit=crop&q=80" 
              alt="Tailored Wool Outerwear Collection" 
            />
            <div className="bento-hero-overlay">
              <span className="bento-tag-pill">Limited Capsule</span>
              <h3 className="bento-hero-title">Carry Confidence With Every Single Outfit</h3>
              <p className="bento-hero-desc">
                Clean silhouettes crafted from natural wool and breathable organic linen for effortless everyday luxury.
              </p>
              <Link 
                to="/shop?cat=Apparel" 
                style={{ 
                  color: '#fff', 
                  fontWeight: 600, 
                  fontSize: '13.5px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Explore Apparel Capsule →
              </Link>
            </div>
          </div>

          {/* 2x2 MINI PRODUCT BENTO GRID (Right) */}
          <div className="bento-quad-grid">
            {bentoItems.map(item => {
              const itemId = item.id || item._id || item.sku;
              const isAdded = bentoAddedId === itemId;
              const price = Number(item.salePrice || item.regularPrice || item.price || 0);

              return (
                <div key={itemId} className="bento-mini-card">
                  <Link to={`/product/${itemId}`} className="bento-mini-thumb">
                    <img src={item.image} alt={item.name} loading="lazy" />
                  </Link>
                  <div className="bento-mini-body">
                    <span className="bento-mini-cat">{item.category}</span>
                    <Link to={`/product/${itemId}`} style={{ textDecoration: 'none' }}>
                      <h4 className="bento-mini-name">{item.name}</h4>
                    </Link>
                    <div className="bento-mini-row">
                      <span className="bento-mini-price">₹{price.toLocaleString('en-IN')}</span>
                      <button 
                        className="bento-mini-add"
                        onClick={(e) => handleQuickBentoAdd(item, e)}
                        title="Add to Shopping Bag"
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

      {/* 5. BESTSELLER PRODUCTS WITH CATEGORY TABS (Homedine Inspiration) */}
      <section className="bestsellers-section">
        <div className="section-header-row">
          <div>
            <p className="section-sublabel">PLANET-PRIORITIZING ESSENTIALS</p>
            <h2 className="section-headline">Bestselling Products ◇</h2>
          </div>
          <Link to="/shop" className="section-link-more">
            More Products →
          </Link>
        </div>

        {/* CATEGORY TABS BAR */}
        <div className="category-filter-tabs">
          {['All', 'Bags', 'Footwear', 'Accessories', 'Apparel', 'Home', 'Electronics'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`category-tab-btn ${activeTab === tab ? 'active' : ''}`}
            >
              {tab === 'All' ? `All (${allProducts.length})` : tab}
            </button>
          ))}
        </div>

        {/* PRODUCTS GRID */}
        <div className="product-grid">
          {displayedBestsellers.map(p => (
            <ProductCard key={p._id || p.id || p.sku || p.name} p={p} />
          ))}
        </div>
      </section>

      {/* 6. EDITORIAL LIFESTYLE & BRAND COMMITMENT (Homedine & Sable Inspiration) */}
      <section className="editorial-statement-banner">
        <div className="statement-banner-box">
          <div>
            <span className="statement-badge">Our Artisan Promise</span>
            <h2 className="statement-title">
              Crafted for a healthier planet and a simpler lifestyle.
            </h2>
            <p className="statement-desc">
              We collaborate with family-run workshops and mindful ateliers who honor ethical sourcing, low-impact vegetal tanning, and durable heirloom construction.
            </p>

            <div className="statement-metrics">
              <div className="metric-col">
                <h4>100%</h4>
                <p>Plastic-Free Packaging</p>
              </div>
              <div className="metric-col">
                <h4>60+</h4>
                <p>Curated Designs</p>
              </div>
              <div className="metric-col">
                <h4>0%</h4>
                <p>Compromise</p>
              </div>
            </div>
          </div>

          <div className="statement-visual-box">
            <img 
              src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80" 
              alt="Artisan ceramic crafted lamp" 
            />
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS & SOCIAL PROOF (From Homedine Template) */}
      <section className="reviews-section">
        <div className="reviews-header">
          <div className="reviews-score-pill">
            <span>★ 4.9 / 5</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span>Over 25,000 Verified Customer Reviews</span>
          </div>
          <h2 className="section-headline">Loved by Design Enthusiasts</h2>
        </div>

        <div className="reviews-grid">
          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <p className="review-quote">
              "The Contour Ceramic Lamp and linen cushions have completely transformed our studio space. The textures are authentic, understated, and feel deeply organic."
            </p>
            <div className="review-author-row">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" 
                alt="Elena Rostova" 
                className="review-author-avatar" 
              />
              <div>
                <h4 className="author-name">Elena Rostova</h4>
                <p className="author-role">Interior Architect, Mumbai</p>
              </div>
            </div>
          </div>

          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <p className="review-quote">
              "The Acoustic Wireless Headphones are magnificent. Crisp highs, warm midtones, and the battery lasts through my entire travel week without requiring a recharge."
            </p>
            <div className="review-author-row">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" 
                alt="Marcus Vance" 
                className="review-author-avatar" 
              />
              <div>
                <h4 className="author-name">Marcus Vance</h4>
                <p className="author-role">Audio Engineer, Bengaluru</p>
              </div>
            </div>
          </div>

          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <p className="review-quote">
              "The Essential Leather Tote has that rare balance of supple grain and sturdy structure. It carries my 15-inch laptop effortlessly while looking timelessly elegant."
            </p>
            <div className="review-author-row">
              <img 
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80" 
                alt="Priya Sharma" 
                className="review-author-avatar" 
              />
              <div>
                <h4 className="author-name">Priya Sharma</h4>
                <p className="author-role">Creative Director, New Delhi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. VIP CLUB NEWSLETTER (From Sable Luxury Template) */}
      <section className="newsletter-section">
        <div className="newsletter-box">
          <p className="section-sublabel">JOIN THE ATELIER</p>
          <h3>Join & Get 10% Off Your First Order</h3>
          <p>
            Sign up now and enjoy exclusive private sales, early access to limited capsule editions, and thoughtful living inspiration.
          </p>

          {newsletterSubmitted ? (
            <div style={{ background: '#def7ec', color: '#03543f', padding: '14px 24px', borderRadius: '30px', display: 'inline-block', fontWeight: 600 }}>
              ✓ Welcome to the Nova Circle! Check your inbox for your 10% privilege code.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <input 
                type="email" 
                required 
                placeholder="Enter your email address..." 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                Become a Member →
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}