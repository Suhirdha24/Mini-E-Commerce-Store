import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section className="page" style={{ maxWidth: '1140px', margin: '0 auto' }}>
      {/* HEADER STATEMENT */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <p className="eyebrow">OUR PHILOSOPHY</p>
        <h1 style={{ 
          fontFamily: 'var(--font-editorial)', 
          fontSize: 'clamp(2.8rem, 4.8vw, 4.2rem)', 
          lineHeight: 1.12, 
          marginBottom: '24px',
          fontWeight: 500 
        }}>
          Quiet luxury,<br />
          loudly considered.
        </h1>
        <p style={{ color: 'var(--sable-text-muted)', fontSize: '16.5px', maxWidth: '640px', margin: '0 auto 32px', lineHeight: 1.7 }}>
          SABLE creates timeless clothing, leather goods, and statement accessories designed for effortless living. We craft pieces that honor material purity, generational mastery, and lasting beauty.
        </p>
        <Link className="sable-btn-primary" to="/shop">
          EXPLORE THE ARCHIVE
        </Link>
      </div>

      {/* THREE PILLARS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', marginBottom: '70px' }}>
        <div style={{ 
          background: '#FFFFFF', 
          padding: '36px 30px', 
          borderRadius: 'var(--sable-radius-lg)', 
          border: '1px solid var(--sable-sand-border)', 
          boxShadow: 'var(--sable-shadow-subtle)' 
        }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '14px' }}>✦</span>
          <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '24px', marginBottom: '12px', fontWeight: 600 }}>
            Conscious Materials
          </h3>
          <p style={{ color: 'var(--sable-text-muted)', fontSize: '14.5px', lineHeight: 1.65 }}>
            Every yarn, hide, and fiber is ethically selected for texture, weight, and longevity. We reject fast trends in favor of sustainable, enduring construction.
          </p>
        </div>

        <div style={{ 
          background: '#FFFFFF', 
          padding: '36px 30px', 
          borderRadius: 'var(--sable-radius-lg)', 
          border: '1px solid var(--sable-sand-border)', 
          boxShadow: 'var(--sable-shadow-subtle)' 
        }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '14px' }}>✦</span>
          <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '24px', marginBottom: '12px', fontWeight: 600 }}>
            Generational Craft
          </h3>
          <p style={{ color: 'var(--sable-text-muted)', fontSize: '14.5px', lineHeight: 1.65 }}>
            Our collections are hand-assembled by master workshops who have preserved ancestral tailoring and leather-forming traditions across decades.
          </p>
        </div>

        <div style={{ 
          background: '#FFFFFF', 
          padding: '36px 30px', 
          borderRadius: 'var(--sable-radius-lg)', 
          border: '1px solid var(--sable-sand-border)', 
          boxShadow: 'var(--sable-shadow-subtle)' 
        }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '14px' }}>✦</span>
          <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '24px', marginBottom: '12px', fontWeight: 600 }}>
            Enduring Heirlooms
          </h3>
          <p style={{ color: 'var(--sable-text-muted)', fontSize: '14.5px', lineHeight: 1.65 }}>
            Designed to become faithful companions throughout your journey, gaining rich soul and soft patina with every wearing season.
          </p>
        </div>
      </div>

      {/* LIFESTYLE PHOTO */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.2fr 0.8fr', 
        gap: '24px', 
        borderRadius: 'var(--sable-radius-xl)', 
        overflow: 'hidden', 
        boxShadow: 'var(--sable-shadow-card)',
        border: '1px solid var(--sable-sand-border)'
      }}>
        <div style={{ height: '420px' }}>
          <img 
            src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80" 
            alt="Sable Handcrafted Leather Atelier" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div style={{ 
          background: '#EAE3D9', 
          padding: '48px 40px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center' 
        }}>
          <span className="eyebrow">THE SABLE STANDARD</span>
          <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '32px', marginBottom: '16px', fontWeight: 500 }}>
            Made with intention.
          </h3>
          <p style={{ color: 'var(--sable-text-muted)', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>
            We invite you to experience the tactile poetry of genuine craftsmanship and discover your signature daily essentials.
          </p>
          <Link to="/shop" className="sable-btn-secondary">
            View All Pieces →
          </Link>
        </div>
      </div>
    </section>
  );
}