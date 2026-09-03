import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { safeGetJSON, safeSetJSON } from '../utils/storage';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80';

// Curated palette swatch combinations based on product categories
const CATEGORY_SWATCHES = {
  Bags: ['#2e2722', '#8c684d', '#c2b29f'],
  Footwear: ['#1f1e1d', '#968878', '#ded6cb'],
  Accessories: ['#c5a059', '#1a1918', '#7f8c8d'],
  Apparel: ['#3b4843', '#8b5a3e', '#e3dcce'],
  Home: ['#ded1c1', '#6b7a69', '#d99873'],
  Electronics: ['#1c1c1e', '#59595f', '#d2d2d7']
};

export default function ProductCard({ p }) {
  const { add } = useCart();
  const { user } = useAuth();
  if (!p) return null;

  const productId = p.id || p._id || p.sku;
  const [isFav, setIsFav] = useState(false);
  const [imgSrc, setImgSrc] = useState(p.image || FALLBACK_IMAGE);
  const [isAdded, setIsAdded] = useState(false);
  const [activeSwatch, setActiveSwatch] = useState(0);

  const userKey = user?.email ? `fav_${String(user.email).toLowerCase()}` : 'fav_guest';

  useEffect(() => {
    setImgSrc(p?.image || FALLBACK_IMAGE);
    const favs = safeGetJSON(userKey, []);
    if (Array.isArray(favs)) {
      setIsFav(favs.some(item => item && String(item.id || item._id || item.sku).toLowerCase() === String(productId).toLowerCase()));
    }
  }, [p?.image, productId, userKey]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let favs = safeGetJSON(userKey, []);
    if (!Array.isArray(favs)) favs = [];

    if (isFav) {
      favs = favs.filter(item => item && String(item.id || item._id || item.sku).toLowerCase() !== String(productId).toLowerCase());
    } else {
      favs.push(p);
    }
    safeSetJSON(userKey, favs);
    setIsFav(!isFav);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (p.stock === 0) return;
    add(p, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const displayPrice = Number(p.salePrice || p.regularPrice || p.price || 0);
  const originalPrice = Number(p.regularPrice || 0);
  const hasDiscount = originalPrice > displayPrice;
  const swatches = CATEGORY_SWATCHES[p.category] || ['#2e2722', '#c5a059', '#eae5dc'];

  return (
    <article className="refined-product-card">
      {/* CARD STATUS BADGE */}
      {p.stock === 0 ? (
        <span className="card-status-badge" style={{ color: '#dc2626', borderColor: 'rgba(220,38,38,0.2)' }}>
          Sold Out
        </span>
      ) : p.stock < 5 ? (
        <span className="card-status-badge promo">
          Only {p.stock} Left
        </span>
      ) : hasDiscount ? (
        <span className="card-status-badge promo">
          Special Edit
        </span>
      ) : (
        <span className="card-status-badge bestseller">
          Curated
        </span>
      )}

      {/* FLOATING WISHLIST HEART */}
      <button
        onClick={toggleFavorite}
        className={`card-wishlist-btn ${isFav ? 'active' : ''}`}
        title={isFav ? "Remove from wishlist" : "Add to wishlist"}
        aria-label="Toggle Wishlist"
      >
        {isFav ? '♥' : '♡'}
      </button>

      {/* PRODUCT IMAGE WRAP */}
      <Link to={`/product/${productId}`} className="card-visual-wrap">
        <img 
          src={imgSrc} 
          alt={p.name || 'Product'} 
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          loading="lazy"
        />
      </Link>
      
      {/* PRODUCT CARD BODY */}
      <div className="refined-card-body">
        {/* INTERACTIVE COLOR SWATCHES (Homedine & Nitec) */}
        <div className="card-swatches-row">
          {swatches.map((color, index) => (
            <span
              key={index}
              onClick={() => setActiveSwatch(index)}
              className="card-color-dot"
              style={{
                backgroundColor: color,
                outline: activeSwatch === index ? '2px solid var(--text-main)' : 'none',
                outlineOffset: '1px'
              }}
              title={`Finish ${index + 1}`}
            />
          ))}
          <span className="card-category-text" style={{ marginLeft: 'auto' }}>
            {p.category || 'Atelier'}
          </span>
        </div>

        {/* TITLE */}
        <Link to={`/product/${productId}`} className="card-title-link">
          <h3 className="card-product-title">{p.name}</h3>
        </Link>
        
        {/* FOOTER ROW WITH PRICE & +BAG BUTTON */}
        <div className="card-footer-row">
          <div className="card-pricing-block">
            <span className="card-price-current">
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="card-price-original">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button 
            className={`card-add-btn ${isAdded ? 'added' : ''}`}
            disabled={p.stock === 0} 
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            {isAdded ? 'Added ✓' : p.stock === 0 ? 'Out of Stock' : '+ Bag'}
          </button>
        </div>
      </div>
    </article>
  );
}