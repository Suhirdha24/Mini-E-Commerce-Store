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

const FINISH_COLORS = [
  { name: 'Onyx Noir', code: '#1c1c1e' },
  { name: 'Natural Tan', code: '#9e7b56' },
  { name: 'Warm Cream', code: '#e5dec9' },
  { name: 'Forest Sage', code: '#425747' }
];

export default function Product() {
  const { id } = useParams();
  const { add } = useCart();
  const { user } = useAuth();
  const userKey = user?.email ? `fav_${String(user.email).toLowerCase()}` : 'fav_guest';

  const [p, setP] = useState(() => findFallbackProduct(id));
  const [q, setQ] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const [addedMsg, setAddedMsg] = useState(false);
  const [selectedFinish, setSelectedFinish] = useState(0);
  const [openAccordion, setOpenAccordion] = useState('materials');

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch live product details
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
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', marginBottom: '16px' }}>Creation Not Found</h2>
        <Link to="/shop" className="primary">Back to Catalog</Link>
      </div>
    );
  }

  const price = Number(p.salePrice || p.regularPrice || p.price || 0);
  const originalPrice = Number(p.regularPrice || 0);
  const hasDiscount = originalPrice > price;

  // Find related products in the same category
  const related = initialAdminProducts
    .filter(item => item && item.category === p.category && String(item.id || item._id) !== String(p.id || p._id))
    .slice(0, 4);

  return (
    <section className="page" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* BREADCRUMB */}
      <nav style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
        <Link to="/home" style={{ textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link to={`/shop?cat=${encodeURIComponent(p.category || '')}`} style={{ textDecoration: 'none' }}>
          {p.category || 'Shop'}
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{p.name}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '60px', alignItems: 'start', marginBottom: '80px' }}>
        {/* PRODUCT VISUAL SHOWCASE */}
        <div style={{ position: 'relative' }}>
          <div style={{ 
            borderRadius: 'var(--radius-xl)', 
            overflow: 'hidden', 
            background: 'var(--bg-surface)', 
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-light)',
            height: '540px'
          }}>
            <img 
              src={p.image} 
              alt={p.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>

          {/* FLOATING AUTHENTICITY TAG */}
          <div style={{ 
            position: 'absolute', 
            bottom: '24px', 
            left: '24px', 
            background: 'rgba(255,255,255,0.92)', 
            backdropFilter: 'blur(10px)', 
            padding: '10px 18px', 
            borderRadius: 'var(--radius-pill)', 
            fontSize: '12px', 
            fontWeight: 700, 
            color: 'var(--text-main)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid rgba(25,24,23,0.06)'
          }}>
            ✦ 100% Genuine Master Atelier Edition
          </div>
        </div>
        
        {/* PRODUCT DETAILS & BUYING ACTIONS */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: 700, 
              letterSpacing: '0.18em', 
              textTransform: 'uppercase', 
              color: 'var(--accent-gold)' 
            }}>
              {p.category || 'COLLECTION'}
            </span>

            <button 
              onClick={toggleFavorite}
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: '13.5px', 
                cursor: 'pointer', 
                color: isFav ? '#dc2626' : 'var(--text-muted)', 
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{isFav ? '♥' : '♡'}</span>
              <span>{isFav ? 'Saved' : 'Wishlist'}</span>
            </button>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '38px', fontWeight: 500, lineHeight: 1.15, marginBottom: '14px' }}>
            {p.name}
          </h1>

          {/* PRICE & DISCOUNT BADGE */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '18px' }}>
            <span style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-main)' }}>
              ₹{price.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span style={{ fontSize: '17px', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {hasDiscount && (
              <span style={{ 
                background: 'rgba(184, 93, 56, 0.12)', 
                color: 'var(--accent-terracotta)', 
                padding: '3px 10px', 
                borderRadius: '20px', 
                fontSize: '11.5px', 
                fontWeight: 700 
              }}>
                Save ₹{(originalPrice - price).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* STOCK STATUS BADGE */}
          <div style={{ marginBottom: '24px' }}>
            {p.stock === 0 ? (
              <span style={{ background: '#fee2e2', color: '#dc2626', padding: '6px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 700 }}>
                Sold Out
              </span>
            ) : p.stock < 5 ? (
              <span style={{ background: '#fef3c7', color: '#d97706', padding: '6px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 700 }}>
                ⚠️ Only {p.stock} units remaining in vault
              </span>
            ) : (
              <span style={{ background: '#eaf5ee', color: 'var(--accent-forest)', padding: '6px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 700 }}>
                ✓ In Stock — Ready for Dispatch
              </span>
            )}
          </div>

          {/* DESCRIPTION */}
          <p style={{ color: 'var(--text-muted)', fontSize: '15.5px', lineHeight: 1.7, marginBottom: '28px' }}>
            {p.description || 'Thoughtfully crafted luxury essential with high quality aesthetic design and sustainable production ethics.'}
          </p>

          {/* COLOR FINISH SELECTOR */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Color Finish: <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{FINISH_COLORS[selectedFinish]?.name}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {FINISH_COLORS.map((fin, idx) => (
                <button
                  key={fin.name}
                  onClick={() => setSelectedFinish(idx)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: fin.code,
                    border: '2px solid #fff',
                    outline: selectedFinish === idx ? '2px solid var(--text-main)' : '1px solid var(--border-light)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  title={fin.name}
                />
              ))}
            </div>
          </div>

          {/* ADDED TO BAG TOAST */}
          {addedMsg && (
            <div style={{ 
              background: '#eaf5ee', 
              color: 'var(--accent-forest)', 
              padding: '12px 20px', 
              borderRadius: 'var(--radius-pill)', 
              marginBottom: '20px', 
              fontWeight: 600,
              fontSize: '13.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>✓</span>
              <span>Added {q} item(s) to your Shopping Bag!</span>
            </div>
          )}

          {/* QUANTITY & BUY BUTTONS */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '36px' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              border: '1px solid var(--border-light)', 
              borderRadius: 'var(--radius-pill)', 
              background: '#fff',
              overflow: 'hidden' 
            }}>
              <button
                type="button"
                onClick={() => setQ(Math.max(1, q - 1))}
                disabled={p.stock === 0 || q <= 1}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  padding: '12px 16px', 
                  cursor: 'pointer', 
                  fontSize: '16px',
                  fontWeight: 600 
                }}
              >
                −
              </button>
              <span style={{ width: '32px', textAlign: 'center', fontSize: '14px', fontWeight: 700 }}>
                {q}
              </span>
              <button
                type="button"
                onClick={() => setQ(Math.min(p.stock || 20, q + 1))}
                disabled={p.stock === 0 || q >= (p.stock || 20)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  padding: '12px 16px', 
                  cursor: 'pointer', 
                  fontSize: '16px',
                  fontWeight: 600 
                }}
              >
                +
              </button>
            </div>

            <button 
              className="btn-luxury-primary" 
              disabled={p.stock === 0} 
              onClick={handleAddToCart} 
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {p.stock === 0 ? 'Sold Out' : 'Add to Shopping Bag →'}
            </button>
          </div>

          {/* ACCORDIONS (Craft & Materials, Delivery, Care) */}
          <div style={{ borderTop: '1px solid var(--border-light)' }}>
            <div 
              onClick={() => setOpenAccordion(openAccordion === 'materials' ? '' : 'materials')}
              style={{ 
                padding: '16px 0', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px'
              }}
            >
              <span>✦ Craftsmanship & Material Origins</span>
              <span>{openAccordion === 'materials' ? '−' : '+'}</span>
            </div>
            {openAccordion === 'materials' && (
              <div style={{ paddingBottom: '16px', color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: 1.65 }}>
                Individually handcrafted by master artisans. Finished with plant-based botanical waxes and solid brushed brass fittings. Zero toxic sealants or microplastic linings.
              </div>
            )}

            <div 
              onClick={() => setOpenAccordion(openAccordion === 'shipping' ? '' : 'shipping')}
              style={{ 
                padding: '16px 0', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                borderTop: '1px solid var(--border-light)'
              }}
            >
              <span>✦ Shipping & Concierge Returns</span>
              <span>{openAccordion === 'shipping' ? '−' : '+'}</span>
            </div>
            {openAccordion === 'shipping' && (
              <div style={{ paddingBottom: '16px', color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: 1.65 }}>
                Complimentary tracked express shipping across India for orders over ₹1,999. Includes 30-day effortless return window with complimentary home pickup.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RELATED PIECES SHOWCASE */}
      {related.length > 0 && (
        <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ marginBottom: '28px' }}>
            <p className="eyebrow">CURATED COMPLEMENTS</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 500 }}>
              You May Also Appreciate
            </h2>
          </div>

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