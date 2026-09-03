import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { initialAdminProducts } from '../data/initialProducts';
import { safeGetJSON, safeSetJSON } from '../utils/storage.js';
import ProductCard from '../components/ProductCard';
import { HeartIcon, CheckIcon } from '../components/Icons';
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
    add(p, q);
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };

  if (!p) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Product Not Found</h2>
        <Link to="/shop" className="primary">Back to Shop</Link>
      </div>
    );
  }

  const price = Number(p.salePrice || p.regularPrice || p.price || 0);

  const related = initialAdminProducts
    .filter(item => item && item.category === p.category && String(item.id || item._id) !== String(p.id || p._id))
    .slice(0, 4);

  return (
    <section className="page" style={{ maxWidth: '1100px' }}>
      {/* BREADCRUMB */}
      <nav style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        <Link to="/home">Home</Link>
        <span>/</span>
        <Link to={`/shop?cat=${encodeURIComponent(p.category || '')}`}>
          {p.category || 'Category'}
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{p.name}</span>
      </nav>

      {/* DETAIL GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '44px', alignItems: 'start', marginBottom: '60px' }}>
        {/* PRODUCT IMAGE BOX (1:1 RATIO) */}
        <div style={{ 
          background: 'var(--bg-muted)', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border-color)',
          aspectRatio: '1 / 1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '32px',
          position: 'relative'
        }}>
          <button
            onClick={toggleFavorite}
            className={`card-wishlist-btn ${isFav ? 'active' : ''}`}
            title={isFav ? "Remove from wishlist" : "Add to wishlist"}
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
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-blue)', letterSpacing: '0.04em' }}>
            {p.category || 'Collection'}
          </span>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3, margin: '4px 0 12px' }}>
            {p.name}
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
            {p.description || 'Crafted with premium materials for maximum durability and everyday performance.'}
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '18px 0' }} />

          {/* PRICE */}
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
            ₹{price.toLocaleString('en-IN')}
          </div>

          {/* STOCK BADGE */}
          <div style={{ marginBottom: '20px' }}>
            {p.stock === 0 ? (
              <span style={{ background: '#FEE2E2', color: 'var(--danger)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600 }}>
                Out of Stock
              </span>
            ) : p.stock < 5 ? (
              <span style={{ background: '#FEF3C7', color: '#D97706', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600 }}>
                Only {p.stock} remaining in stock
              </span>
            ) : (
              <span style={{ background: '#DEF7EC', color: 'var(--success)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600 }}>
                In Stock ({p.stock} units available)
              </span>
            )}
          </div>

          {addedMsg && (
            <div style={{ 
              background: '#DEF7EC', 
              color: '#03543F', 
              padding: '10px 14px', 
              borderRadius: 'var(--radius-sm)', 
              marginBottom: '16px', 
              fontWeight: 600,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckIcon size={14} /> Added {q} item(s) to Cart!
            </div>
          )}

          {/* QUANTITY & ADD TO CART */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '28px' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-pill)', 
              background: '#FFFFFF' 
            }}>
              <button
                type="button"
                onClick={() => setQ(Math.max(1, q - 1))}
                disabled={p.stock === 0 || q <= 1}
                style={{ background: 'none', border: 'none', padding: '8px 14px', fontSize: '15px', fontWeight: 700 }}
              >
                −
              </button>
              <span style={{ width: '24px', textAlign: 'center', fontSize: '13.5px', fontWeight: 600 }}>
                {q}
              </span>
              <button
                type="button"
                onClick={() => setQ(Math.min(p.stock || 20, q + 1))}
                disabled={p.stock === 0 || q >= (p.stock || 20)}
                style={{ background: 'none', border: 'none', padding: '8px 14px', fontSize: '15px', fontWeight: 700 }}
              >
                +
              </button>
            </div>

            <button 
              className="primary"
              disabled={p.stock === 0} 
              onClick={handleAddToCart} 
              style={{ flex: 1, padding: '11px 24px', fontSize: '13.5px' }}
            >
              {p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {/* PERKS */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckIcon size={14} /> Free delivery on all orders over ₹1,999
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckIcon size={14} /> 30-day hassle-free returns & replacement
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckIcon size={14} /> 100% verified authentic product
            </div>
          </div>
        </div>
      </div>

      {/* RELATED ITEMS */}
      {related.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '36px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Similar Products</h2>
          <div className="product-grid">
            {related.map(item => (
              <ProductCard key={item.id || item._id} p={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}