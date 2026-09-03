import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { initialAdminProducts } from '../data/initialProducts';
import { ArrowRightIcon } from '../components/Icons';
import api from '../api/api';

export default function Home() {
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

  const categories = ['All', 'Electronics', 'Apparel', 'Footwear', 'Accessories'];

  const filteredProducts = (activeCategory && activeCategory !== 'All')
    ? allProducts.filter(p => p.category === activeCategory)
    : allProducts;

  return (
    <>
      {/* 1. HERO PROMO BANNER (BALANCED RATIO) */}
      <section className="home-hero-banner">
        <div className="hero-card">
          <div>
            <span className="hero-badge">Curated Collection</span>
            <h1 className="hero-title">
              Thoughtful Design for Everyday Living.
            </h1>
            <p className="hero-desc">
              Discover precision audio, modern technical apparel, and durable everyday carry items crafted for lasting utility.
            </p>
            <Link to="/shop" className="hero-btn">
              <span>Shop All Products</span>
              <ArrowRightIcon size={15} />
            </Link>
          </div>

          <div className="hero-image-wrap">
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80" 
              alt="NOVA Headphone Collection" 
            />
          </div>
        </div>
      </section>

      {/* 2. CATEGORY PILLS FILTER BAR */}
      <section className="categories-bar">
        {categories.map(c => {
          const isSelected = (c === 'All' && !activeCategory) || activeCategory === c;
          return (
            <button
              key={c}
              className={`cat-pill ${isSelected ? 'active' : ''}`}
              onClick={() => setActiveCategory(c === 'All' ? '' : c)}
            >
              {c}
            </button>
          );
        })}
      </section>

      {/* 3. FEATURED PRODUCTS (PROPORTIONAL 4-COL GRID) */}
      <section className="section-container">
        <div className="section-header">
          <h2 className="section-title">
            {activeCategory && activeCategory !== 'All' ? `${activeCategory} Collection` : 'Featured Products'}
          </h2>
          <Link to="/shop" className="section-link">
            <span>View Catalog</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>

        <div className="product-grid">
          {filteredProducts.slice(0, 8).map(p => (
            <ProductCard key={p._id || p.id || p.sku || p.name} p={p} />
          ))}
        </div>
      </section>
    </>
  );
}