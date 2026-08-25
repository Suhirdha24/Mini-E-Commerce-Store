import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section className="page" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span className="script-accent">Digital Commerce Vision</span>
        <p className="eyebrow">ABOUT NOVA STORE PLATFORM</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '52px', lineHeight: 1.1, marginBottom: '24px' }}>
          Redefining Modern<br />Online Shopping.
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '680px', margin: '0 auto 32px' }}>
          NOVA STORE is an end-to-end digital retail platform designed to bring clarity, elegance, and effortless convenience to contemporary online shopping.
        </p>
        <Link className="primary" to="/shop">Explore Platform →</Link>
      </div>

      {/* PLATFORM FEATURES SHOWCASE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '60px' }}>
        <div style={{ background: '#fff', padding: '32px', borderRadius: '14px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '10px' }}>Secure & Seamless Auth</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            Powered by encrypted JWT authentication, per-user account isolation, and robust duplicate registration security.
          </p>
        </div>

        <div style={{ background: '#fff', padding: '32px', borderRadius: '14px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '10px' }}>Instant Order Tracking</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            Real-time order status tracking, interactive fulfillment timelines, and full order history at your fingertips.
          </p>
        </div>

        <div style={{ background: '#fff', padding: '32px', borderRadius: '14px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>👑</div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '10px' }}>Merchant Management</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            Built-in Retailer Portal allowing store managers to inspect inventory levels, add products, and track customer sales.
          </p>
        </div>
      </div>
    </section>
  );
}