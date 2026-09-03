import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section className="page" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span className="eyebrow">NOVA STUDIO MANIFESTO</span>
        <h1 style={{ fontSize: '42px', fontWeight: 800, color: 'var(--bento-text-dark)', margin: '8px 0 16px', letterSpacing: '-0.02em' }}>
          Form Follows Spatial Function.
        </h1>
        <p style={{ color: 'var(--bento-text-muted)', fontSize: '16px', maxWidth: '640px', margin: '0 auto 28px', lineHeight: 1.65 }}>
          NOVA STUDIO bridges next-generation acoustics, technical streetwear, and progressive hardware to create gear designed for modern creators.
        </p>
        <Link className="primary" to="/shop">
          Explore The Catalog →
        </Link>
      </div>

      {/* 3 VALUE PILLARS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '60px' }}>
        <div style={{ background: 'var(--bento-surface-soft)', padding: '36px', borderRadius: 'var(--bento-radius-lg)', border: '1px solid var(--bento-border)' }}>
          <div style={{ fontSize: '32px', marginBottom: '14px' }}>⚡</div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--bento-text-dark)', marginBottom: '10px' }}>
            Acoustic Engineering
          </h3>
          <p style={{ color: 'var(--bento-text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            Bespoke driver tuning and lossless wireless architectures calibrated for maximum emotional range and tactile bass clarity.
          </p>
        </div>

        <div style={{ background: 'var(--bento-surface-soft)', padding: '36px', borderRadius: 'var(--bento-radius-lg)', border: '1px solid var(--bento-border)' }}>
          <div style={{ fontSize: '32px', marginBottom: '14px' }}>🛡️</div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--bento-text-dark)', marginBottom: '10px' }}>
            Aerospace Provenance
          </h3>
          <p style={{ color: 'var(--bento-text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            Anodized aluminum, ballistic nylon, and custom polymers built to withstand rigorous daily transit across the world.
          </p>
        </div>

        <div style={{ background: 'var(--bento-surface-soft)', padding: '36px', borderRadius: 'var(--bento-radius-lg)', border: '1px solid var(--bento-border)' }}>
          <div style={{ fontSize: '32px', marginBottom: '14px' }}>🌐</div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--bento-text-dark)', marginBottom: '10px' }}>
            Circular Longevity
          </h3>
          <p style={{ color: 'var(--bento-text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            Modular part architectures, easily replaceable batteries, and 100% recyclable post-consumer composite packaging.
          </p>
        </div>
      </div>
    </section>
  );
}