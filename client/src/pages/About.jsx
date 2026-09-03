import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section className="page" style={{ maxWidth: '1140px', margin: '0 auto' }}>
      {/* HEADER STATEMENT */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <p className="eyebrow">OUR PHILOSOPHY & MANIFESTO</p>
        <h1 style={{ 
          fontFamily: 'var(--font-serif)', 
          fontSize: 'clamp(2.8rem, 4.5vw, 4.2rem)', 
          lineHeight: 1.12, 
          marginBottom: '24px',
          fontWeight: 500 
        }}>
          Simplicity is not the lack of clutter,<br />
          it is the presence of purpose.
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '17px', maxWidth: '680px', margin: '0 auto 32px', lineHeight: 1.7 }}>
          NOVA ATELIER was founded on a singular conviction: that objects we surround ourselves with each day should be crafted with honesty, built to age with grace, and kind to the earth.
        </p>
        <Link className="btn-luxury-primary" to="/shop">
          Explore The Collection →
        </Link>
      </div>

      {/* THREE ETHICAL PILLARS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', marginBottom: '70px' }}>
        <div style={{ 
          background: 'var(--bg-surface)', 
          padding: '36px 30px', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border-light)', 
          boxShadow: 'var(--shadow-subtle)' 
        }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: 'var(--radius-sm)', 
            background: 'var(--bg-warm)', 
            display: 'grid', 
            placeItems: 'center', 
            fontSize: '24px', 
            marginBottom: '18px' 
          }}>
            🌿
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '12px', fontWeight: 600 }}>
            Zero Compromise Materials
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: 1.65 }}>
            Every hide, yarn, and timber is selected for provenance and low ecological footprint. We work exclusively with certified tanneries and certified organic cotton mills.
          </p>
        </div>

        <div style={{ 
          background: 'var(--bg-surface)', 
          padding: '36px 30px', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border-light)', 
          boxShadow: 'var(--shadow-subtle)' 
        }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: 'var(--radius-sm)', 
            background: 'var(--bg-warm)', 
            display: 'grid', 
            placeItems: 'center', 
            fontSize: '24px', 
            marginBottom: '18px' 
          }}>
            🤲
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '12px', fontWeight: 600 }}>
            Artisan Dignity & Fair Living
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: 1.65 }}>
            Our pieces are shaped by generational makers who receive transparent, thriving living wages. We celebrate the master creator behind every hand-finished stitch.
          </p>
        </div>

        <div style={{ 
          background: 'var(--bg-surface)', 
          padding: '36px 30px', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border-light)', 
          boxShadow: 'var(--shadow-subtle)' 
        }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: 'var(--radius-sm)', 
            background: 'var(--bg-warm)', 
            display: 'grid', 
            placeItems: 'center', 
            fontSize: '24px', 
            marginBottom: '18px' 
          }}>
            ⏳
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '12px', fontWeight: 600 }}>
            Built for Heirlooms
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: 1.65 }}>
            We reject fast turnover trends. Our goods are engineered to withstand decades of daily devotion, acquiring a rich, soulful patina as the seasons pass.
          </p>
        </div>
      </div>

      {/* LIFESTYLE PHOTO EDITORIAL SPREAD */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.2fr 0.8fr', 
        gap: '24px', 
        borderRadius: 'var(--radius-xl)', 
        overflow: 'hidden', 
        boxShadow: 'var(--shadow-sm)' 
      }}>
        <div style={{ height: '420px' }}>
          <img 
            src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80" 
            alt="Handmade leather goods workshop" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div style={{ 
          background: 'var(--bg-warm)', 
          padding: '48px 40px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center' 
        }}>
          <span className="eyebrow">THE ATELIER PROMISE</span>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '16px', fontWeight: 600 }}>
            Designed for mindful modern living.
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>
            From our studio in Bengaluru to homes across India, we invite you to experience the tactile joy of genuine quality.
          </p>
          <Link to="/shop" style={{ 
            fontWeight: 700, 
            fontSize: '14px', 
            color: 'var(--text-main)', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
            Explore Curated Works →
          </Link>
        </div>
      </div>
    </section>
  );
}