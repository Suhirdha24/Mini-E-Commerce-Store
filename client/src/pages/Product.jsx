import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { initialAdminProducts } from '../data/initialProducts';
import { safeGetJSON, safeSetJSON } from '../utils/storage.js';
import ProductCard from '../components/ProductCard';
import { HeartIcon, CheckIcon, StarIcon, TruckIcon, ShieldIcon, RefreshIcon } from '../components/Icons';
import api from '../api/api';

const findFallbackProduct = (targetId) => {
  if (!targetId) return initialAdminProducts[0];
  const cleanId = String(targetId).trim().toLowerCase();
  return initialAdminProducts.find(item => 
    item && (
      String(item.id || item._id || item.sku).trim().toLowerCase() === cleanId ||
      (item.name && item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(cleanId))
    )
  ) || initialAdminProducts[0];
};

export default function Product() {
  const { id } = useParams();
  const { add } = useCart();
  const { user } = useAuth();
  const userKey = user?.email ? `fav_${String(user.email).toLowerCase()}` : 'fav_guest';

  const [p, setP] = useState(() => findFallbackProduct(id));
  const [allProducts, setAllProducts] = useState(initialAdminProducts || []);
  const [q, setQ] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const [addedMsg, setAddedMsg] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/products/${id}`)
      .then(res => {
        if (res.data) setP(res.data);
      })
      .catch(() => {
        const fallback = findFallbackProduct(id);
        if (fallback) setP(fallback);
      });

    api.get('/products?limit=100')
      .then(res => {
        if (res.data?.items && Array.isArray(res.data.items)) {
          setAllProducts(res.data.items);
        }
      })
      .catch(() => {});

    const favs = safeGetJSON(userKey, []);
    if (Array.isArray(favs)) {
      setIsFav(favs.some(item => item && String(item.id || item._id || item.sku).toLowerCase() === String(id).toLowerCase()));
    }
  }, [id, userKey]);

  const toggleFavorite = () => {
    if (!p) return;
    let favs = safeGetJSON(userKey, []);
    if (!Array.isArray(favs)) favs = [];
    const pId = p._id || p.id || p.sku;
    if (isFav) {
      favs = favs.filter(item => item && String(item._id || item.id || item.sku).toLowerCase() !== String(pId).toLowerCase());
    } else {
      favs.push(p);
    }
    safeSetJSON(userKey, favs);
    setIsFav(!isFav);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const handleAddToCart = () => {
    if (p.stock === 0) return;
    add(p, q);
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };

  if (!p) {
    return (
      <div className="container page" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>Product Not Found</h2>
        <Link to="/shop" className="btn btn-primary">Back to Catalog</Link>
      </div>
    );
  }

  const displayPrice = Number(p.salePrice || p.price || 0);
  const regularPrice = Number(p.regularPrice || 0);
  const hasDiscount = regularPrice > displayPrice;
  const discountPercent = hasDiscount ? Math.round(((regularPrice - displayPrice) / regularPrice) * 100) : 0;

  const related = allProducts
    .filter(item => item && item.category === p.category && String(item.id || item._id) !== String(p.id || p._id))
    .slice(0, 4);

  return (
    <div className="container page">
      {/* BREADCRUMBS */}
      <nav style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        <Link to="/home" style={{ color: 'var(--text-muted)' }}>Home</Link>
        <span>/</span>
        <Link to="/shop" style={{ color: 'var(--text-muted)' }}>Catalog</Link>
        <span>/</span>
        <Link to={`/shop?cat=${encodeURIComponent(p.category || '')}`} style={{ color: 'var(--text-muted)' }}>
          {p.category || 'Category'}
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--text-dark)', fontWeight: 600 }}>{p.name}</span>
      </nav>

      {/* DETAIL GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start', marginBottom: '64px' }}>
        {/* PRODUCT IMAGE (1:1 RATIO) */}
        <div style={{ 
          background: 'var(--bg-secondary)', 
          borderRadius: 'var(--radius-xl)', 
          border: '1px solid var(--border)',
          aspectRatio: '1 / 1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {hasDiscount && (
            <span className="card-badge sale" style={{ top: '20px', left: '20px' }}>
              {discountPercent}% OFF
            </span>
          )}

          <button
            onClick={toggleFavorite}
            className={`card-fav-btn ${isFav ? 'active' : ''}`}
            style={{ top: '20px', right: '20px' }}
            title={isFav ? "Remove from wishlist" : "Add to wishlist"}
            aria-label="Wishlist"
          >
            <HeartIcon size={18} filled={isFav} />
          </button>

          <img 
            src={p.image} 
            alt={p.name} 
            style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain' }} 
          />
        </div>

        {/* DETAILS */}
        <div>
          <span className="eyebrow" style={{ color: 'var(--accent-blue)', marginBottom: '6px', display: 'block' }}>
            {p.category || 'Lifestyle'}
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.25, margin: '0 0 12px' }}>
            {p.name}
          </h1>

          {/* RATING */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <StarIcon key={star} size={14} filled={true} />
              ))}
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>4.9</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>(128 customer reviews)</span>
          </div>

          {/* PRICE ROW */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-dark)' }}>
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span style={{ fontSize: '16px', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                ₹{regularPrice.toLocaleString('en-IN')}
              </span>
            )}
            {hasDiscount && (
              <span style={{ background: 'var(--accent-green-bg)', color: 'var(--accent-green)', fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-xs)' }}>
                Save ₹{(regularPrice - displayPrice).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
            {p.description || 'Crafted with premium materials for maximum durability and everyday performance.'}
          </p>

          {/* STOCK STATUS BADGE */}
          <div style={{ marginBottom: '24px' }}>
            {p.stock === 0 ? (
              <span style={{ display: 'inline-block', background: 'var(--accent-red-bg)', color: 'var(--accent-red)', padding: '4px 10px', borderRadius: 'var(--radius-xs)', fontSize: '12px', fontWeight: 600 }}>
                Out of Stock
              </span>
            ) : p.stock <= 5 ? (
              <span style={{ display: 'inline-block', background: 'var(--accent-amber-bg)', color: 'var(--accent-amber)', padding: '4px 10px', borderRadius: 'var(--radius-xs)', fontSize: '12px', fontWeight: 600 }}>
                Only {p.stock} units left in warehouse
              </span>
            ) : (
              <span style={{ display: 'inline-block', background: 'var(--accent-green-bg)', color: 'var(--accent-green)', padding: '4px 10px', borderRadius: 'var(--radius-xs)', fontSize: '12px', fontWeight: 600 }}>
                In Stock & Ready to Ship
              </span>
            )}
          </div>

          {/* QUANTITY & ACTIONS */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '32px' }}>
            {/* STEPPER */}
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', background: 'var(--bg-surface)' }}>
              <button
                type="button"
                onClick={() => setQ(Math.max(1, q - 1))}
                disabled={q <= 1 || p.stock === 0}
                style={{ width: '38px', height: '38px', display: 'grid', placeItems: 'center', fontSize: '16px', color: 'var(--text-dark)' }}
              >
                −
              </button>
              <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 700, fontSize: '14px' }}>
                {q}
              </span>
              <button
                type="button"
                onClick={() => setQ(Math.min(p.stock || 10, q + 1))}
                disabled={q >= (p.stock || 10) || p.stock === 0}
                style={{ width: '38px', height: '38px', display: 'grid', placeItems: 'center', fontSize: '16px', color: 'var(--text-dark)' }}
              >
                +
              </button>
            </div>

            {/* ADD TO CART */}
            <button
              onClick={handleAddToCart}
              disabled={p.stock === 0}
              className="btn btn-primary"
              style={{ flex: 1, padding: '12px 24px', fontSize: '14px' }}
            >
              {addedMsg ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <CheckIcon size={16} /> Added to Cart
                </span>
              ) : p.stock === 0 ? (
                'Out of Stock'
              ) : (
                `Add to Cart • ₹${(displayPrice * q).toLocaleString('en-IN')}`
              )}
            </button>
          </div>

          {/* TRUST BADGES IN PRODUCT DETAIL */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <TruckIcon size={18} />
              <span>Free delivery on all orders over ₹1,999</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <RefreshIcon size={18} />
              <span>30-Day Hassle-Free Returns & Replacements</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <ShieldIcon size={18} />
              <span>100% Authentic Brand Guarantee with 1-Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <section style={{ borderTop: '1px solid var(--border)', paddingTop: '48px' }}>
          <h2 className="section-title" style={{ marginBottom: '20px' }}>
            You May Also Like
          </h2>
          <div className="product-grid">
            {related.map(item => (
              <ProductCard key={item._id || item.id || item.sku} p={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}