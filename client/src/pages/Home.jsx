import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import ProductCard from '../components/ProductCard';

const mockHomeProducts = [
  { id: '1', name: 'Essential Leather Tote', category: 'Bags', price: 2899, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: '2', name: 'Neutral Studio Sneakers', category: 'Footwear', price: 3499, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80', stock: 18 },
  { id: '3', name: 'Mono Chronograph Watch', category: 'Accessories', price: 3999, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: '4', name: 'Contour Ceramic Lamp', category: 'Home', price: 2199, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', stock: 10 }
];

export default function Home() {
  const [products, setProducts] = useState(mockHomeProducts);

  useEffect(() => {
    api.get('/products?limit=4')
      .then(r => { if (r.data.items?.length) setProducts(r.data.items); })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* HERO BANNER WITH NEUTRAL PHOTO */}
      <section className="hero">
        <div>
          <span className="script-accent">The 2026 Everyday Edit</span>
          <p className="eyebrow">NOVA STORE</p>
          <h1>Simple things,<br />beautifully chosen.</h1>
          <p>Thoughtful products for work, travel, and home. Built around clean aesthetics and timeless quality.</p>
          <Link className="primary" to="/shop">Explore Shop →</Link>
        </div>

        <div className="hero-art-wrapper">
          <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80" alt="Luxury Essential Tote" />
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <p className="eyebrow">CURATED FOR YOU</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px' }}>Shop Essentials</h2>
          </div>
          <Link to="/shop" style={{ textDecoration: 'underline', color: 'var(--text-dark)', fontWeight: 600 }}>
            View All Products →
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