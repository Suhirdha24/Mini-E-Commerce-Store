import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const favoriteItems = [
  { id: '1', name: 'Essential Leather Tote', category: 'Bags', price: 2899, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: '3', name: 'Mono Chronograph Watch', category: 'Accessories', price: 3999, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: '5', name: 'Contour Ambient Lamp', category: 'Home', price: 2199, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', stock: 10 }
];

export default function Favorites() {
  return (
    <section className="page">
      <p className="eyebrow">YOUR COLLECTION</p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '40px', marginBottom: '12px' }}>Saved Favorites</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '36px' }}>Your favorite items saved in one place for quick access.</p>

      {favoriteItems.length ? (
        <div className="grid">
          {favoriteItems.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <h3>No favorites saved yet.</h3>
          <Link className="primary" to="/shop" style={{ marginTop: '16px' }}>Explore Shop →</Link>
        </div>
      )}
    </section>
  );
}