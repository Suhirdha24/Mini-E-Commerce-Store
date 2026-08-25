import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import ProductCard from '../components/ProductCard';

const mockHomeProducts = [
  { id: 'b1', name: 'Essential Leather Tote', category: 'Bags', price: 2899, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'f1', name: 'Aero Knit Sneakers', category: 'Footwear', price: 2499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', stock: 18 },
  { id: 'a1', name: 'Mono Chronograph Watch', category: 'Accessories', price: 3999, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: 'c1', name: 'Essential Cotton Hoodie', category: 'Apparel', price: 1599, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80', stock: 30 },
  { id: 'h1', name: 'Contour Ceramic Lamp', category: 'Home', price: 2199, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', stock: 10 },
  { id: 'e1', name: 'Acoustic Wireless Headphones', category: 'Electronics', price: 4299, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', stock: 11 }
];

const categoryCards = [
  { name: 'Bags', count: '15 Products', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80' },
  { name: 'Footwear', count: '15 Products', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80' },
  { name: 'Accessories', count: '15 Products', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80' },
  { name: 'Apparel', count: '15 Products', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80' },
  { name: 'Home', count: '15 Products', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80' },
  { name: 'Electronics', count: '15 Products', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' }
];

export default function Home() {
  const [products, setProducts] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('admin_products') || localStorage.getItem('custom_products') || '[]');
    return saved.slice(0, 6);
  });

  useEffect(() => {
    const updateLocal = () => {
      const saved = JSON.parse(localStorage.getItem('admin_products') || localStorage.getItem('custom_products') || '[]');
      setProducts(saved.slice(0, 6));
    };
    window.addEventListener('productsUpdated', updateLocal);
    return () => window.removeEventListener('productsUpdated', updateLocal);
  }, []);

  return (
    <>
      {/* HERO BANNER */}
      <section className="hero">
        <div>
          <span className="script-accent">The 2026 Collection</span>
          <p className="eyebrow">NOVA PREMIUM STORE</p>
          <h1>Minimalist Luxury,<br />Beautifully Crafted.</h1>
          <p>Explore 90 thoughtfully curated products across Bags, Footwear, Accessories, Apparel, Home, and Electronics.</p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <Link className="primary" to="/shop">Explore Shop →</Link>
          </div>
        </div>

        <div className="hero-art-wrapper">
          <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80" alt="Luxury Leather Tote" />
        </div>
      </section>

      {/* TRUST BADGES SECTION */}
      <section style={{ maxWidth: '1150px', margin: '40px auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', padding: '0 20px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🚚</div>
          <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>Free Express Shipping</h4>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>On all orders across India</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🛡️</div>
          <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>100% Genuine Guarantee</h4>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Direct from verified creators</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔄</div>
          <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>30-Day Easy Returns</h4>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>No questions asked refund</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>💳</div>
          <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>Secure Checkout</h4>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>UPI, Cards, NetBanking & COD</p>
        </div>
      </section>

      {/* FEATURED CATEGORIES SECTION */}
      <section className="page" style={{ paddingTop: '10px' }}>
        <div style={{ marginBottom: '28px' }}>
          <p className="eyebrow">DISCOVER OUR CATALOG</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px' }}>Shop by Category</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px' }}>
          {categoryCards.map(cat => (
            <Link key={cat.name} to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ position: 'relative', height: '200px', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)' }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#fff' }}>
                  <h3 style={{ margin: 0, fontSize: '20px', fontFamily: 'var(--font-serif)' }}>{cat.name}</h3>
                  <span style={{ fontSize: '12px', opacity: 0.9 }}>{cat.count}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED ESSENTIALS GRID */}
      <section className="page" style={{ paddingTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <p className="eyebrow">TRENDING ESSENTIALS</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px' }}>Featured Collection</h2>
          </div>
          <Link to="/shop" style={{ textDecoration: 'underline', color: 'var(--text-dark)', fontWeight: 600 }}>
            Explore All 90 Products →
          </Link>
        </div>

        <div className="grid">
          {products.map(p => (
            <ProductCard key={p._id || p.id} p={p} />
          ))}
        </div>
      </section>
    </>
  );
}