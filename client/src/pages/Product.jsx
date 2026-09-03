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
      <nav style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--sc-text-muted)', marginBottom: '28px' }}>
        <Link to="/home">Home</Link>
        <span>/</span>
        <Link to={`/shop?cat=${encodeURIComponent(p.category || '')}`}>
          {p.category || 'Category'}
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--sc-text-dark)', fontWeight: 600 }}>{p.name}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '50px', alignItems: 'start', marginBottom: '70px' }}>
        {/* PRODUCT IMAGE BOX */}
        <div style={{ 
          background: 'var(--sc-bg-soft)', 
          borderRadius: 'var(--sc-radius-md)', 
          padding: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '460px',
          position: 'relative'
        }}>
          <button
            onClick={toggleFavorite}
            className={`shopcart-card-heart-btn ${isFav ? 'active' : ''}`}
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
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--sc-text-dark)', lineHeight: 1.25, marginBottom: '12px' }}>
            {p.name}
          </h1>

          <p style={{ color: 'var(--sc-text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '18px' }}>
            {p.description || 'Engineered with high precision components and premium quality materials for long-lasting performance.'}
          </p>

          {/* RATING */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{ color: 'var(--sc-green-rating)', fontSize: '16px', letterSpacing: '2px' }}>★★★★★</span>
            <span style={{ color: 'var(--sc-text-dark)', fontWeight: 700, fontSize: '13.5px' }}>(121 reviews)</span>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--sc-border)', margin: '20px 0' }} />

          {/* PRICE */}
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--sc-text-dark)', marginBottom: '20px' }}>
            ₹{price.toLocaleString('en-IN')}<sup style={{ fontSize: '18px' }}>.00</sup>
          </div>

          {/* STOCK BADGE */}
          <div style={{ marginBottom: '24px' }}>
            {p.stock === 0 ? (
              <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
                Out of Stock
              </span>
            ) : p.stock < 5 ? (
              <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
                ⚠️ Only {p.stock} units left in stock!
              </span>
            ) : (
              <span style={{ background: '#def7ec', color: '#03543f', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
                ✓ In Stock ({p.stock} units available)
              </span>
            )}
          </div>

          {addedMsg && (
            <div style={{ 
              background: '#def7ec', 
              color: '#03543f', 
              padding: '12px 18px', 
              borderRadius: 'var(--sc-radius-pill)', 
              marginBottom: '20px', 
              fontWeight: 600,
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
              border: '1px solid var(--sc-border)', 
              borderRadius: 'var(--sc-radius-pill)', 
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
              className="shopcart-btn-buy"
              disabled={p.stock === 0} 
              onClick={handleAddToCart} 
              style={{ flex: 1 }}
            >
              {p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {/* DELIVERY PERKS */}
          <div style={{ borderTop: '1px solid var(--sc-border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '13.5px' }}>
              <span>🚚</span>
              <div>
                <b>Free Delivery</b>
                <span style={{ color: 'var(--sc-text-muted)', display: 'block', fontSize: '12px' }}>Enter your postal code for delivery availability</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '13.5px' }}>
              <span>🔄</span>
              <div>
                <b>Return Delivery</b>
                <span style={{ color: 'var(--sc-text-muted)', display: 'block', fontSize: '12px' }}>Free 30 days delivery returns. Details</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SIMILAR PRODUCTS */}
      {related.length > 0 && (
        <div style={{ marginTop: '50px', paddingTop: '40px', borderTop: '1px solid var(--sc-border)' }}>
          <h2 className="shopcart-section-heading">Similar Items You Might Like</h2>
          <div className="shopcart-product-grid">
            {related.map(item => (
              <ProductCard key={item.id || item._id} p={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}