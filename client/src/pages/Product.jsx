import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { initialAdminProducts } from '../data/initialProducts';
import { safeGetJSON, safeSetJSON } from '../utils/storage.js';
import ProductCard from '../components/ProductCard';
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
    setTimeout(() => setAddedMsg(false), 2400);
  };

  if (!p) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', fontSize: '18px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Product Not Found</h2>
        <Link to="/shop" className="primary">Back to Shop</Link>
      </div>
    );
  }

  const price = Number(p.salePrice || p.regularPrice || p.price || 0);

  const related = initialAdminProducts
    .filter(item => item && item.category === p.category && String(item.id || item._id) !== String(p.id || p._id))
    .slice(0, 4);

  return (
    <section className="page" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* BREADCRUMB */}
      <nav style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--bento-text-muted)', marginBottom: '28px' }}>
        <Link to="/home">Home</Link>
        <span>/</span>
        <Link to={`/shop?cat=${encodeURIComponent(p.category || '')}`}>
          {p.category || 'Category'}
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--bento-text-dark)', fontWeight: 600 }}>{p.name}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '50px', alignItems: 'start', marginBottom: '70px' }}>
        {/* PRODUCT IMAGE BOX */}
        <div style={{ 
          background: 'var(--bento-surface-soft)', 
          borderRadius: 'var(--bento-radius-lg)', 
          padding: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '460px',
          position: 'relative',
          border: '1px solid var(--bento-border)'
        }}>
          <button
            onClick={toggleFavorite}
            className={`bento-card-fav ${isFav ? 'active' : ''}`}
            style={{ position: 'absolute', top: '16px', right: '16px' }}
            title={isFav ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isFav ? '♥' : '♡'}
          </button>

          <img 
            src={p.image} 
            alt={p.name} 
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} 
          />
        </div>

        {/* DETAILS */}
        <div>
          <span className="eyebrow">{p.category || 'STUDIO EDITION'}</span>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--bento-text-dark)', lineHeight: 1.25, margin: '6px 0 12px' }}>
            {p.name}
          </h1>

          <p style={{ color: 'var(--bento-text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
            {p.description || 'Engineered with spatial audio architecture and aerospace materials for pristine fidelity.'}
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid var(--bento-border)', margin: '20px 0' }} />

          {/* PRICE */}
          <div style={{ fontSize: '34px', fontWeight: 800, color: 'var(--bento-text-dark)', marginBottom: '20px' }}>
            ₹{price.toLocaleString('en-IN')}
          </div>

          {/* STOCK BADGE */}
          <div style={{ marginBottom: '24px' }}>
            {p.stock === 0 ? (
              <span style={{ background: '#fee2e2', color: '#dc2626', padding: '5px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
                Out of Stock
              </span>
            ) : p.stock < 5 ? (
              <span style={{ background: '#fef3c7', color: '#d97706', padding: '5px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
                ⚠️ Only {p.stock} units remaining in studio!
              </span>
            ) : (
              <span style={{ background: '#EBF2FF', color: 'var(--bento-blue)', padding: '5px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
                ✓ In Stock ({p.stock} units ready to ship)
              </span>
            )}
          </div>

          {addedMsg && (
            <div style={{ 
              background: '#DEF7EC', 
              color: '#03543F', 
              padding: '12px 18px', 
              borderRadius: 'var(--bento-radius-pill)', 
              marginBottom: '20px', 
              fontWeight: 700,
              fontSize: '13.5px' 
            }}>
              ✓ Added {q} item(s) to Cart!
            </div>
          )}

          {/* QUANTITY & ADD TO CART */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              border: '1px solid var(--bento-border)', 
              borderRadius: 'var(--bento-radius-pill)', 
              background: '#fff',
              overflow: 'hidden' 
            }}>
              <button
                type="button"
                onClick={() => setQ(Math.max(1, q - 1))}
                disabled={p.stock === 0 || q <= 1}
                style={{ background: 'none', border: 'none', padding: '10px 16px', cursor: 'pointer', fontSize: '16px', fontWeight: 700 }}
              >
                −
              </button>
              <span style={{ width: '28px', textAlign: 'center', fontSize: '14px', fontWeight: 700 }}>
                {q}
              </span>
              <button
                type="button"
                onClick={() => setQ(Math.min(p.stock || 20, q + 1))}
                disabled={p.stock === 0 || q >= (p.stock || 20)}
                style={{ background: 'none', border: 'none', padding: '10px 16px', cursor: 'pointer', fontSize: '16px', fontWeight: 700 }}
              >
                +
              </button>
            </div>

            <button 
              className="primary"
              disabled={p.stock === 0} 
              onClick={handleAddToCart} 
              style={{ flex: 1, padding: '14px 28px', fontSize: '14.5px' }}
            >
              {p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {/* VALUE PERKS */}
          <div style={{ borderTop: '1px solid var(--bento-border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '13.5px' }}>
              <span>🚀</span>
              <div>
                <b>Priority Dispatch</b>
                <span style={{ color: 'var(--bento-text-muted)', display: 'block', fontSize: '12px' }}>Express transit across major metros with live GPS tracking</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '13.5px' }}>
              <span>🛡️</span>
              <div>
                <b>2-Year Official Warranty</b>
                <span style={{ color: 'var(--bento-text-muted)', display: 'block', fontSize: '12px' }}>Full manufacturer coverage and instant replacement policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SIMILAR PRODUCTS */}
      {related.length > 0 && (
        <div style={{ marginTop: '50px', paddingTop: '40px', borderTop: '1px solid var(--bento-border)' }}>
          <h2 className="bento-section-title" style={{ marginBottom: '24px' }}>Complete The Look</h2>
          <div className="bento-product-grid">
            {related.map(item => (
              <ProductCard key={item.id || item._id} p={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}