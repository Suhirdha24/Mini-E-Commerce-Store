import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section className="page" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* ABOUT HERO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '60px', alignItems: 'center', marginBottom: '80px' }}>
        <div>
          <span className="script-accent">Our Philosophy</span>
          <p className="eyebrow">ABOUT NOVA STORE</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '52px', lineHeight: 1.1, marginBottom: '24px' }}>
            Simple things,<br />beautifully chosen.
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '32px' }}>
            NOVA STORE is a modern lifestyle brand built around curated essentials, clean aesthetics, and timeless design. We believe shopping should feel personal, simple, and inspiring.
          </p>
          <Link className="primary" to="/shop">Explore Collection →</Link>
        </div>

        <div style={{ position: 'relative' }}>
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
            alt="About Brand"
            style={{ width: '100%', height: '440px', objectFit: 'cover', borderRadius: '14px', boxShadow: 'var(--shadow-md)' }}
          />
        </div>
      </div>

      {/* THREE VALUE CARDS WITH PHOTOS */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="script-accent">Why Choose NOVA</span>
        <p className="eyebrow">OUR CORE VALUES</p>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px' }}>Curated with Purpose</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '80px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <img src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=80" alt="Value 1" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '8px' }}>Curated Quality</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Every item in our collection is handpicked for exceptional craftsmanship and durability.</p>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=80" alt="Value 2" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '8px' }}>Timeless Aesthetics</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Clean lines, neutral tones, and versatile pieces designed to complement your lifestyle.</p>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <img src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=80" alt="Value 3" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '8px' }}>Seamless Experience</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>From browsing to checkout, enjoy a calm and effortless shopping experience.</p>
        </div>
      </div>
    </section>
  );
}