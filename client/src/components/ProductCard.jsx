import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { safeGetJSON, safeSetJSON } from '../utils/storage';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';

export default function ProductCard({ p }) {
  const { add } = useCart();
  const { user } = useAuth();
  if (!p) return null;

  const productId = p.id || p._id || p.sku;
  const [isFav, setIsFav] = useState(false);
  const [imgSrc, setImgSrc] = useState(p.image || FALLBACK_IMAGE);
  const [isAdded, setIsAdded] = useState(false);

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
  const formattedPrice = Math.floor(displayPrice).toLocaleString('en-IN');

  return (
    <article className="shopcart-product-card">
      {/* CARD IMAGE WITH FLOATING HEART */}
      <div className="shopcart-card-image-box">
        <button
          onClick={toggleFavorite}
          className={`shopcart-card-heart-btn ${isFav ? 'active' : ''}`}
          title={isFav ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist"
        >
          {isFav ? '♥' : '♡'}
        </button>

        <Link to={`/product/${productId}`} style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
          <img 
            src={imgSrc} 
            alt={p.name || 'Product'} 
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            loading="lazy"
          />
        </Link>
      </div>

      {/* CARD DETAILS */}
      <div className="shopcart-card-details">
        {/* TITLE & PRICE ROW */}
        <div className="shopcart-card-header-row">
          <Link to={`/product/${productId}`} style={{ textDecoration: 'none' }}>
            <h3 className="shopcart-card-title">{p.name}</h3>
          </Link>
          <div className="shopcart-card-price">
            ₹{formattedPrice}<sup>.00</sup>
          </div>
        </div>

        {/* SHORT DESCRIPTION / SUBTITLE */}
        <p className="shopcart-card-subtitle">
          {p.description || `${p.category || 'Curated'} essential with high quality build`}
        </p>

        {/* GREEN RATING STARS */}
        <div className="shopcart-card-rating">
          <span className="shopcart-card-rating-stars">★★★★★</span>
          <span className="shopcart-card-rating-count">(121)</span>
        </div>

        {/* ADD TO CART BUTTON */}
        <button 
          className={`shopcart-card-add-btn ${isAdded ? 'added' : ''}`}
          disabled={p.stock === 0} 
          onClick={handleAddToCart}
          aria-label="Add to cart"
        >
          {isAdded ? 'Added ✓' : p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
}