import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { initialAdminProducts } from '../data/initialProducts';
import api from '../api/api';

export default function Home() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState(initialAdminProducts || []);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState('');
  const [sortBy, setSortBy] = useState('popular');

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

  // Filter products based on selected pill filters
  let displayedProducts = (allProducts || []).filter(p => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (selectedPriceFilter === 'under2000' && (p.salePrice || p.price || 0) > 2000) return false;
    if (selectedPriceFilter === 'above3000' && (p.salePrice || p.price || 0) < 3000) return false;
    return true;
  });

  if (sortBy === 'price-low') {
    displayedProducts.sort((a, b) => (a.salePrice || a.price || 0) - (b.salePrice || b.price || 0));
  } else if (sortBy === 'price-high') {
    displayedProducts.sort((a, b) => (b.salePrice || b.price || 0) - (a.salePrice || a.price || 0));
  }

  // Put Electronics first to match the screenshot!
  const audioAndTopPicks = [
    ...displayedProducts.filter(p => p.category === 'Electronics'),
    ...displayedProducts.filter(p => p.category !== 'Electronics')
  ].slice(0, 12);

  return (
    <>
      {/* 1. PEACH HERO PROMO BANNER (Exact match to Shopcart template) */}
      <section className="shopcart-hero-section">
        <div className="shopcart-hero-card">
          <div>
            <h1 className="shopcart-hero-title">
              Grab Upto 50% Off On<br />Selected Headphone
            </h1>
            <Link to="/shop?cat=Electronics" className="shopcart-btn-buy">
              Buy Now
            </Link>
          </div>

          <div className="shopcart-hero-image-wrap">
            <img 
              src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80" 
              alt="Person enjoying music with headphones" 
            />
          </div>
        </div>
      </section>

      {/* 2. HORIZONTAL FILTER PILLS BAR (Exact match to Shopcart template) */}
      <section className="shopcart-filters-bar">
        <div className="shopcart-filter-pills-row">
          {/* CATEGORY / TYPE PILL */}
          <button 
            className={`shopcart-pill-btn ${selectedCategory === 'Electronics' ? 'active' : ''}`}
            onClick={() => setSelectedCategory(selectedCategory === 'Electronics' ? '' : 'Electronics')}
          >
            Headphone Type ▾
          </button>

          {/* PRICE PILL */}
          <button 
            className={`shopcart-pill-btn ${selectedPriceFilter === 'under2000' ? 'active' : ''}`}
            onClick={() => setSelectedPriceFilter(selectedPriceFilter === 'under2000' ? '' : 'under2000')}
          >
            Price ▾
          </button>

          {/* REVIEW PILL */}
          <button 
            className="shopcart-pill-btn"
            onClick={() => navigate('/shop?sort=popular')}
          >
            Review ▾
          </button>

          {/* COLOR PILL */}
          <button 
            className="shopcart-pill-btn"
            onClick={() => navigate('/shop')}
          >
            Color ▾
          </button>

          {/* MATERIAL PILL */}
          <button 
            className="shopcart-pill-btn"
            onClick={() => navigate('/shop')}
          >
            Material ▾
          </button>

          {/* OFFER PILL */}
          <button 
            className="shopcart-pill-btn"
            onClick={() => navigate('/shop?offer=50')}
          >
            Offer ▾
          </button>

          {/* ALL FILTERS BUTTON */}
          <Link to="/shop" className="shopcart-pill-btn">
            All Filters 🎚️
          </Link>
        </div>

        {/* SORT BY DROPDOWN */}
        <div className="shopcart-sort-wrap">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="shopcart-sort-select"
          >
            <option value="popular">Sort by ▾</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </section>

      {/* 3. "HEADPHONES FOR YOU!" PRODUCTS SECTION (Exact match to Shopcart template) */}
      <section className="shopcart-section-container">
        <h2 className="shopcart-section-heading">
          {selectedCategory ? `${selectedCategory} For You!` : 'Headphones For You!'}
        </h2>

        <div className="shopcart-product-grid">
          {audioAndTopPicks.map(p => (
            <ProductCard key={p._id || p.id || p.sku || p.name} p={p} />
          ))}
        </div>
      </section>
    </>
  );
}