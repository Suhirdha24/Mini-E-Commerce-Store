import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '../components/Icons';

export default function About() {
  return (
    <div className="container page">
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }}>
        <span className="eyebrow" style={{ color: 'var(--accent-blue)', display: 'block', marginBottom: '8px' }}>
          About NOVA STORE
        </span>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
          Precision Essentials for Everyday Utility.
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
          NOVA connects consumers with authentic high-fidelity acoustics, minimalist everyday carry, and durable lifestyle essentials backed by express dispatch and direct manufacturer warranty.
        </p>
        <Link className="btn btn-primary" to="/shop">
          <span>Explore Store Catalog</span>
          <ArrowRightIcon size={14} />
        </Link>
      </div>

      {/* VALUE PILLARS (3-CARD GRID MATCHING HOMEPAGE RATIO) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
        <div style={{ background: 'var(--bg-surface)', padding: '32px 28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px' }}>
            Fast Express Dispatch
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: 1.6 }}>
            Express courier dispatch across all major cities with automated real-time status notifications and trackable transit.
          </p>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '32px 28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px' }}>
            Verified Authentic
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: 1.6 }}>
            Every product is sourced directly from certified authorized distributors with genuine manufacturer packaging and warranty.
          </p>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '32px 28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px' }}>
            30-Day Hassle-Free Returns
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: 1.6 }}>
            Doorstep replacements and instant refunds if any item does not completely meet your day-to-day requirements.
          </p>
        </div>
      </div>
    </div>
  );
}