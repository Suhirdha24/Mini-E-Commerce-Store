import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section className="page" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span className="eyebrow">ABOUT NOVA STORE</span>
        <h1 style={{ fontSize: '40px', fontWeight: 800, color: 'var(--sc-text-dark)', marginBottom: '16px' }}>
          Shopping Made Seamless.
        </h1>
        <p style={{ color: 'var(--sc-text-muted)', fontSize: '16px', maxWidth: '640px', margin: '0 auto 28px', lineHeight: 1.65 }}>
          NOVA is your reliable marketplace bringing verified electronics, fashion, lifestyle goods, and daily essentials straight to your doorstep with speed and security.
        </p>
        <Link className="shopcart-btn-buy" to="/shop">
          Explore All Products →
        </Link>
      </div>

      {/* 3 VALUE PILLARS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '60px' }}>
        <div style={{ background: 'var(--sc-bg-soft)', padding: '32px', borderRadius: 'var(--sc-radius-md)', border: '1px solid var(--sc-border)' }}>
          <div style={{ fontSize: '32px', marginBottom: '14px' }}>⚡</div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--sc-text-dark)', marginBottom: '10px' }}>
            Next-Day Delivery
          </h3>
          <p style={{ color: 'var(--sc-text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            Reliable express transit across key cities in India with live tracking and automated delivery alerts.
          </p>
        </div>

        <div style={{ background: 'var(--sc-bg-soft)', padding: '32px', borderRadius: 'var(--sc-radius-md)', border: '1px solid var(--sc-border)' }}>
          <div style={{ fontSize: '32px', marginBottom: '14px' }}>🛡️</div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--sc-text-dark)', marginBottom: '10px' }}>
            100% Verified Quality
          </h3>
          <p style={{ color: 'var(--sc-text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            Direct manufacturer relationships guaranteeing authentic items, original warranties, and verified parts.
          </p>
        </div>

        <div style={{ background: 'var(--sc-bg-soft)', padding: '32px', borderRadius: 'var(--sc-radius-md)', border: '1px solid var(--sc-border)' }}>
          <div style={{ fontSize: '32px', marginBottom: '14px' }}>🔄</div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--sc-text-dark)', marginBottom: '10px' }}>
            30-Day Hassle-Free Returns
          </h3>
          <p style={{ color: 'var(--sc-text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            Simple returns with doorstep pickups and instant account credits for complete customer peace of mind.
          </p>
        </div>
      </div>
    </section>
  );
}