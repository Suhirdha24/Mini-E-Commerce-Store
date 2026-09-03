import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { safeGetJSON, safeSetJSON } from '../utils/storage';
import { HeartIcon, CheckIcon } from './Icons';

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
    setTimeout(() => setIsAdded(false), 1400);
  };

  const displayPrice = Number(p.salePrice || p.regularPrice || p.price || 0);

  return (
    <article className="product-card">
      {/* 1:1 ASPECT RATIO IMAGE BOX */}
      <div className="product-card-thumb">
        <button
          onClick={toggleFavorite}
          className={`card-wishlist-btn ${isFav ? 'active' : ''}`}
          title={isFav ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist"
        >
          <HeartIcon size={16} filled={isFav} />
        </button>

        <Link to={`/product/${productId}`} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src={imgSrc} 
            alt={p.name || 'Product'} 
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            loading="lazy"
          />
        </Link>
      </div>

      {/* DETAILS */}
      <span className="card-category">{p.category || 'Product'}</span>
      <Link to={`/product/${productId}`} style={{ textDecoration: 'none' }}>
        <h3 className="card-title" title={p.name}>{p.name}</h3>
      </Link>
      <p className="card-desc" title={p.description}>
        {p.description || 'Quality crafted essential for daily use.'}
      </p>

      {/* BOTTOM ROW */}
      <div className="card-bottom-row">
        <span className="card-price">₹{displayPrice.toLocaleString('en-IN')}</span>
        <button 
          className={`card-add-btn ${isAdded ? 'added' : ''}`}
          disabled={p.stock === 0} 
          onClick={handleAddToCart}
          aria-label="Add to cart"
        >
          {isAdded ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckIcon size={13} /> Added
            </span>
          ) : p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
}