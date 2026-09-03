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

const SABLE_FINISHES = [
  { name: 'Onyx Black', code: '#1C1B1A' },
  { name: 'Natural Sand', code: '#D9C8B4' },
  { name: 'Caramel Tan', code: '#8D694E' },
  { name: 'Olive Drab', code: '#425747' }
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
        <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '32px', marginBottom: '16px' }}>Creation Not Found</h2>
        <Link to="/shop" className="primary">Back to Catalog</Link>
      </div>
    );
  }

  const price = Number(p.salePrice || p.regularPrice || p.price || 0);
  const originalPrice = Number(p.regularPrice || 0);
  const hasDiscount = originalPrice > price;

  const related = initialAdminProducts
    .filter(item => item && item.category === p.category && String(item.id || item._id) !== String(p.id || p._id))
    .slice(0, 4);

  return (
    <section className="page" style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* BREADCRUMB */}
      <nav style={{ display: 'flex', gap: '8px', fontSize: '12.5px', color: 'var(--sable-text-muted)', marginBottom: '32px' }}>
        <Link to="/home">Home</Link>
        <span>/</span>
        <Link to={`/shop?cat=${encodeURIComponent(p.category || '')}`}>
          {p.category || 'Shop'}
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--sable-text-dark)', fontWeight: 600 }}>{p.name}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '54px', alignItems: 'start', marginBottom: '80px' }}>
        {/* PRODUCT IMAGE */}
        <div style={{ position: 'relative' }}>
          <div style={{ 
            borderRadius: 'var(--sable-radius-lg)', 
            overflow: 'hidden', 
            background: '#FFFFFF', 
            boxShadow: 'var(--sable-shadow-card)',
            border: '1px solid var(--sable-sand-border)',
            height: '560px'
          }}>
            <img 
              src={p.image} 
              alt={p.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>

          <div style={{ 
            position: 'absolute', 
            bottom: '20px', 
            left: '20px', 
            background: 'rgba(255,255,255,0.92)', 
            backdropFilter: 'blur(8px)', 
            padding: '8px 16px', 
            borderRadius: 'var(--sable-radius-pill)', 
            fontSize: '11.5px', 
            fontWeight: 700, 
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--sable-text-dark)',
            border: '1px solid rgba(22,21,20,0.06)'
          }}>
            ✦ NOVA Atelier Edition
          </div>
        </div>
        
        {/* PRODUCT DETAILS & BUYING */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: 700, 
              letterSpacing: '0.18em', 
              textTransform: 'uppercase', 
              color: 'var(--sable-gold)' 
            }}>
              {p.category || 'COLLECTION'}
            </span>

            <button 
              onClick={toggleFavorite}
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: '13px', 
                cursor: 'pointer', 
                color: isFav ? '#dc2626' : 'var(--sable-text-muted)', 
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>{isFav ? '♥' : '♡'}</span>
              <span>{isFav ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>

          <h1 style={{ fontFamily: 'var(--font-editorial)', fontSize: '42px', fontWeight: 500, lineHeight: 1.15, marginBottom: '16px' }}>
            {p.name}
          </h1>

          {/* PRICE */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '18px' }}>
            <span style={{ fontSize: '30px', fontWeight: 700, color: 'var(--sable-text-dark)' }}>
              ₹{price.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span style={{ fontSize: '17px', color: 'var(--sable-text-light)', textDecoration: 'line-through' }}>
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* STOCK STATUS */}
          <div style={{ marginBottom: '24px' }}>
            {p.stock === 0 ? (
              <span style={{ background: '#fee2e2', color: '#dc2626', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                Sold Out
              </span>
            ) : p.stock < 5 ? (
              <span style={{ background: '#fef3c7', color: '#d97706', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                ⚠️ Only {p.stock} remaining in vault
              </span>
            ) : (
              <span style={{ background: '#EAE3D9', color: 'var(--sable-text-dark)', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                ✓ In Stock — Ready for Dispatch
              </span>
            )}
          </div>

          <p style={{ color: 'var(--sable-text-muted)', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>
            {p.description || 'Crafted with premium materials, refined silhouettes, and meticulous attention to stitchwork and proportion.'}
          </p>

          {/* COLOR FINISH */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Color: <span style={{ color: 'var(--sable-text-muted)', fontWeight: 500 }}>{SABLE_FINISHES[selectedFinish]?.name}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {SABLE_FINISHES.map((fin, idx) => (
                <button
                  key={fin.name}
                  onClick={() => setSelectedFinish(idx)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: fin.code,
                    border: '2px solid #fff',
                    outline: selectedFinish === idx ? '2px solid var(--sable-text-dark)' : '1px solid var(--sable-sand-border)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  title={fin.name}
                />
              ))}
            </div>
          </div>

          {addedMsg && (
            <div style={{ 
              background: '#EAE3D9', 
              color: 'var(--sable-text-dark)', 
              padding: '12px 20px', 
              borderRadius: 'var(--sable-radius-pill)', 
              marginBottom: '20px', 
              fontWeight: 600,
              fontSize: '13.5px' 
            }}>
              ✓ Added {q} item(s) to your Shopping Bag.
            </div>
          )}

          {/* QUANTITY & ADD TO BAG */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '36px' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              border: '1px solid var(--sable-sand-border)', 
              borderRadius: 'var(--sable-radius-pill)', 
              background: '#fff',
              overflow: 'hidden' 
            }}>
              <button
                type="button"
                onClick={() => setQ(Math.max(1, q - 1))}
                disabled={p.stock === 0 || q <= 1}
                style={{ background: 'none', border: 'none', padding: '12px 16px', cursor: 'pointer', fontSize: '16px', fontWeight: 600 }}
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
                style={{ background: 'none', border: 'none', padding: '12px 16px', cursor: 'pointer', fontSize: '16px', fontWeight: 600 }}
              >
                +
              </button>
            </div>

            <button 
              className="sable-btn-primary" 
              disabled={p.stock === 0} 
              onClick={handleAddToCart} 
              style={{ flex: 1 }}
            >
              {p.stock === 0 ? 'Sold Out' : 'ADD TO BAG →'}
            </button>
          </div>

          {/* ACCORDIONS */}
          <div style={{ borderTop: '1px solid var(--sable-sand-border)' }}>
            <div 
              onClick={() => setOpenAccordion(openAccordion === 'materials' ? '' : 'materials')}
              style={{ padding: '16px 0', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontWeight: 600, fontSize: '13.5px' }}
            >
              <span>✦ Craftsmanship & Materials</span>
              <span>{openAccordion === 'materials' ? '−' : '+'}</span>
            </div>
            {openAccordion === 'materials' && (
              <div style={{ paddingBottom: '16px', color: 'var(--sable-text-muted)', fontSize: '13.5px', lineHeight: 1.65 }}>
                Engineered with vegetable-tanned leathers, organic combed cottons, and solid brass accents. Built to develop a rich, timeless patina.
              </div>
            )}

            <div 
              onClick={() => setOpenAccordion(openAccordion === 'shipping' ? '' : 'shipping')}
              style={{ padding: '16px 0', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontWeight: 600, fontSize: '13.5px', borderTop: '1px solid var(--sable-sand-border)' }}
            >
              <span>✦ Complimentary Delivery & Returns</span>
              <span>{openAccordion === 'shipping' ? '−' : '+'}</span>
            </div>
            {openAccordion === 'shipping' && (
              <div style={{ paddingBottom: '16px', color: 'var(--sable-text-muted)', fontSize: '13.5px', lineHeight: 1.65 }}>
                Free tracked express delivery on all orders over ₹1,999. Includes 30-day effortless concierge home pickup and returns.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RELATED CREATIONS */}
      {related.length > 0 && (
        <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid var(--sable-sand-border)' }}>
          <div style={{ marginBottom: '28px' }}>
            <p className="eyebrow">CURATED COMPLEMENTS</p>
            <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '32px', fontWeight: 500 }}>
              Complete the Look
            </h2>
          </div>

          <div className="sable-product-grid">
            {related.map(item => (
              <ProductCard key={item.id || item._id} p={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}