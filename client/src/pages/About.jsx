import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '../components/Icons';

export default function About() {
  return (
    <section className="page" style={{ maxWidth: '960px' }}>
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-blue)', letterSpacing: '0.08em' }}>
          About NOVA
        </span>
        <h1 style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-main)', margin: '6px 0 14px', letterSpacing: '-0.02em' }}>
          Simple, Reliable E-Commerce.
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '580px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          NOVA connects consumers with authentic electronics, everyday streetwear, and high-performance lifestyle essentials backed by fast shipping and trusted warranty.
        </p>
        <Link className="primary" to="/shop">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            Shop Our Products <ArrowRightIcon size={14} />
          </span>
        </Link>
      </div>

      {/* VALUE PILLARS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '48px' }}>
        <div style={{ background: 'var(--bg-muted)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
            Fast Delivery
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: 1.5 }}>
            Express order dispatch across all major cities with real-time package status and automated tracking.
          </p>
        </div>

        <div style={{ background: 'var(--bg-muted)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
            Verified Quality
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: 1.5 }}>
            Authentic items sourced from approved suppliers with original documentation and manufacturer warranty.
          </p>
        </div>

        <div style={{ background: 'var(--bg-muted)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
            30-Day Returns
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: 1.5 }}>
            Simple doorstep returns and replacements if an item doesn't meet your everyday expectations.
          </p>
        </div>
      </div>
    </section>
  );
}