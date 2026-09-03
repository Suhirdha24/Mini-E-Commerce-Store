import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { safeGetJSON, safeSetJSON } from '../utils/storage';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80';

const CATEGORY_SWATCHES = {
  Bags: ['#282420', '#8D694E', '#D9C8B4'],
  Footwear: ['#1C1B1A', '#8F7B6B', '#E5DDD3'],
  Accessories: ['#C5A059', '#1C1B1A', '#7A8288'],
  Apparel: ['#EAE3D9', '#3D4944', '#8C5B3E'],
  Home: ['#E6DEC8', '#677565', '#D29471'],
  Electronics: ['#1C1B1A', '#5C5C60', '#D5D5DA']
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
  const swatches = CATEGORY_SWATCHES[p.category] || ['#282420', '#C5A059', '#EAE3D9'];

  return (
    <article className="sable-product-card">
      {/* SABLE BADGE */}
      {p.stock === 0 ? (
        <span className="sable-card-badge" style={{ color: '#dc2626' }}>
          Sold Out
        </span>
      ) : hasDiscount ? (
        <span className="sable-card-badge">
          New
        </span>
      ) : null}

      {/* WISHLIST HEART */}
      <button
        onClick={toggleFavorite}
        className={`sable-card-fav-btn ${isFav ? 'active' : ''}`}
        title={isFav ? "Remove from wishlist" : "Add to wishlist"}
        aria-label="Wishlist"
      >
        {isFav ? '♥' : '♡'}
      </button>

      {/* PRODUCT IMAGE */}
      <Link to={`/product/${productId}`} className="sable-card-thumb-wrap">
        <img 
          src={imgSrc} 
          alt={p.name || 'Product'} 
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          loading="lazy"
        />
      </Link>
      
      {/* CARD BODY */}
      <div className="sable-card-body">
        {/* COLOR SWATCHES */}
        <div className="sable-card-swatches">
          {swatches.map((col, idx) => (
            <span
              key={idx}
              onClick={() => setActiveSwatch(idx)}
              className="sable-swatch-dot"
              style={{
                backgroundColor: col,
                outline: activeSwatch === idx ? '1.5px solid var(--sable-text-dark)' : 'none',
                outlineOffset: '1px'
              }}
            />
          ))}
          <span className="sable-card-cat" style={{ marginLeft: 'auto' }}>
            {p.category || 'Atelier'}
          </span>
        </div>

        {/* TITLE */}
        <Link to={`/product/${productId}`} style={{ textDecoration: 'none' }}>
          <h3 className="sable-card-title">{p.name}</h3>
        </Link>
        
        {/* FOOTER ROW */}
        <div className="sable-card-footer">
          <div className="sable-price-wrap">
            <span className="sable-price-now">
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="sable-price-was">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button 
            className={`sable-card-add-btn ${isAdded ? 'added' : ''}`}
            disabled={p.stock === 0} 
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            {isAdded ? 'Added ✓' : p.stock === 0 ? 'Out' : '+ Bag'}
          </button>
        </div>
      </div>
    </article>
  );
}