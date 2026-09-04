import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { safeGetJSON, safeSetJSON } from '../utils/storage';
import { HeartIcon, CheckIcon, StarIcon } from './Icons';

const getCategoryFallback = (cat) => {
  const map = {
    'Electronics': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    'Bags': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    'Footwear': 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&auto=format&fit=crop&q=80',
    'Accessories': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    'Apparel': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80',
    'Home': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    'Workspace': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    'Fitness': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80'
  };
  return map[cat] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
};

export default function ProductCard({ p }) {
  const { add } = useCart();
  const { user } = useAuth();
  if (!p) return null;

  const fallback = getCategoryFallback(p?.category);
  const productId = p.id || p._id || p.sku;
  const [isFav, setIsFav] = useState(false);
  const [imgSrc, setImgSrc] = useState(p.image || fallback);
  const [isAdded, setIsAdded] = useState(false);

  const userKey = user?.email ? `fav_${String(user.email).toLowerCase()}` : 'fav_guest';

  useEffect(() => {
    setImgSrc(p?.image || getCategoryFallback(p?.category));
    const favs = safeGetJSON(userKey, []);
    if (Array.isArray(favs)) {
      setIsFav(favs.some(item => item && String(item.id || item._id || item.sku).toLowerCase() === String(productId).toLowerCase()));
    }
  }, [p?.image, p?.category, productId, userKey]);

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
    setTimeout(() => setIsAdded(false), 1400);
  };

  const displayPrice = Number(p.salePrice || p.price || 0);
  const regularPrice = Number(p.regularPrice || 0);
  const hasDiscount = regularPrice > displayPrice;
  const discountPercent = hasDiscount ? Math.round(((regularPrice - displayPrice) / regularPrice) * 100) : 0;

  return (
    <article className="product-card">
      {/* 1:1 ASPECT RATIO IMAGE WRAPPER */}
      <div className="product-card-thumb-wrap">
        {/* BADGES */}
        {hasDiscount ? (
          <span className="card-badge sale">{discountPercent}% OFF</span>
        ) : p.featured ? (
          <span className="card-badge">FEATURED</span>
        ) : (
          <span className="card-badge">NEW</span>
        )}

        {/* WISHLIST BUTTON */}
        <button
          onClick={toggleFavorite}
          className={`card-fav-btn ${isFav ? 'active' : ''}`}
          title={isFav ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist"
        >
          <HeartIcon size={16} filled={isFav} />
        </button>

        <Link to={`/product/${productId}`} style={{ width: '100%', height: '100%', display: 'block' }}>
          <img 
            src={imgSrc} 
            alt={p.name || 'Product'} 
            className="product-card-thumb"
            onError={() => setImgSrc(getCategoryFallback(p?.category))}
            loading="lazy"
          />
        </Link>
      </div>

      {/* CARD BODY */}
      <div className="product-card-body">
        <span className="card-category">{p.category || 'Lifestyle'}</span>
        
        <Link to={`/product/${productId}`}>
          <h3 className="card-title" title={p.name}>{p.name}</h3>
        </Link>

        {/* RATING */}
        <div className="card-rating">
          <StarIcon size={13} filled={true} />
          <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>4.9</span>
          <span>(84)</span>
        </div>

        {/* STOCK STATUS */}
        {p.stock === 0 ? (
          <span className="card-stock-tag low" style={{ color: 'var(--accent-red)' }}>Out of Stock</span>
        ) : p.stock <= 5 ? (
          <span className="card-stock-tag low">Only {p.stock} left in stock</span>
        ) : (
          <span className="card-stock-tag">In Stock</span>
        )}

        {/* PRICE ROW */}
        <div className="card-price-row">
          <span className="card-price">₹{displayPrice.toLocaleString('en-IN')}</span>
          {hasDiscount && (
            <span className="card-price-regular">₹{regularPrice.toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* ADD TO CART ACTION */}
        <button 
          className="card-add-btn"
          disabled={p.stock === 0} 
          onClick={handleAddToCart}
          aria-label="Add to cart"
        >
          {isAdded ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckIcon size={14} /> Added to Cart
            </span>
          ) : p.stock === 0 ? (
            'Out of Stock'
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
    </article>
  );
}