import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import ProductCard from '../components/ProductCard';

const mockProducts = [
  { id: '1', name: 'Essential Leather Tote', category: 'Bags', price: 2899, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: '2', name: 'Aero Knit Sneakers', category: 'Footwear', price: 2499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', stock: 18 },
  { id: '3', name: 'Mono Chronograph Watch', category: 'Accessories', price: 3999, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: '4', name: 'Contour Ambient Lamp', category: 'Home', price: 2199, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', stock: 10 }
];

const visualCategories = [
  { title: "Bags & Totes", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80" },
  { title: "Footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80" },
  { title: "Accessories", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80" },
  { title: "Home Decor", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80" }
];

export default function Home() {
  const [products, setProducts] = useState(mockProducts);

  useEffect(() => {
    api.get('/products?limit=4')
      .then(r => { if (r.data.items?.length) setProducts(r.data.items); })
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="hero">
        <div>
          <span className="script-accent">The 2026 Everyday Edit</span>
          <p className="eyebrow">NOVA STORE</p>
          <h1>Simple things,<br />beautifully chosen.</h1>
          <p>Thoughtful products for work, travel, and everyday life. Built around clean design and timeless quality.</p>
          <Link className="primary" to="/shop">Explore Shop →</Link>
        </div>

        <div className="hero-art-wrapper">
          <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop&q=80" alt="Hero Product" />
        </div>
      </section>

      {/* VISUAL CATEGORIES WITH PHOTOS */}
      <section className="page">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="script-accent">Curated Collections</span>
          <p className="eyebrow">EXPLORE CATEGORIES</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px' }}>Shop By Collection</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          {visualCategories.map((c) => (
            <Link to="/shop" key={c.title} style={{ textDecoration: 'none', position: 'relative', height: '280px', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <img src={c.image} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', display: 'flex', alignItems: 'flex-end', padding: '20px', color: '#fff' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px' }}>{c.title}</h3>
              </div>
            </Link>
          ))}
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