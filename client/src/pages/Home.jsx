import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?limit=4')
      .then(r => setProducts(r.data.items || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div>
          <p className="eyebrow">THE 2026 EDITORIAL COLLECTION</p>
          <h1>Simple things,<br />beautifully chosen.</h1>
          <p>Thoughtful essentials for modern living, work, travel, and home. Crafted with exceptional quality and timeless style.</p>
          <Link className="primary" to="/shop">Explore Collection →</Link>
        </div>

        <div className="hero-art">
          <img 
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop&q=80" 
            alt="Hero Product" 
          />
          <div className="hero-badge">
            <span>NEW DROP</span>
            <strong>2026 ESSENTIALS</strong>
          </div>
        </div>
      </section>

      {/* FEATURED SHOP SECTION */}
      <section className="page" id="shop">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <p className="eyebrow">CURATED FOR YOU</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px' }}>Shop Essentials</h2>
          </div>
          <Link to="/shop" style={{ textDecoration: 'underline', color: 'var(--text-dark)', fontWeight: 600 }}>
            View All Products →
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading products...</div>
        ) : products.length ? (
          <div className="grid">
            {products.map(p => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>No products available.</div>
        )}
      </section>
    </>
  );
}