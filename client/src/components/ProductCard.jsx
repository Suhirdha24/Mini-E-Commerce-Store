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

  return (
    <article className="bento-card">
      {/* THUMBNAIL BOX */}
      <div className="bento-card-thumb-wrap">
        <button
          onClick={toggleFavorite}
          className={`bento-card-fav ${isFav ? 'active' : ''}`}
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

      {/* CONTENT */}
      <span className="bento-card-cat">{p.category || 'Gear'}</span>
      <Link to={`/product/${productId}`} style={{ textDecoration: 'none' }}>
        <h3 className="bento-card-name">{p.name}</h3>
      </Link>
      <p className="bento-card-desc">
        {p.description || 'Next-gen performance and durable high-grade materials.'}
      </p>

      {/* BOTTOM ROW */}
      <div className="bento-card-bottom">
        <span className="bento-card-price">₹{displayPrice.toLocaleString('en-IN')}</span>
        <button 
          className={`bento-card-add-btn ${isAdded ? 'added' : ''}`}
          disabled={p.stock === 0} 
          onClick={handleAddToCart}
          aria-label="Add to cart"
        >
          {isAdded ? 'Added ✓' : p.stock === 0 ? 'Out' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
}