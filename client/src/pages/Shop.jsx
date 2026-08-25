import { useState } from 'react';
import ProductCard from '../components/ProductCard';

const catalog12 = [
  // BAGS (2 ITEMS)
  { id: 'b1', name: 'Essential Leather Tote', category: 'Bags', price: 2899, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'b2', name: 'Everyday Canvas Backpack', category: 'Bags', price: 1999, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', stock: 14 },

  // FOOTWEAR (2 ITEMS)
  { id: 'f1', name: 'Aero Knit Sneakers', category: 'Footwear', price: 2499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', stock: 18 },
  { id: 'f2', name: 'Neutral Studio Sneakers', category: 'Footwear', price: 3499, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80', stock: 12 },

  // ACCESSORIES (3 ITEMS)
  { id: 'a1', name: 'Mono Chronograph Watch', category: 'Accessories', price: 3999, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: 'a2', name: 'Classic Leather Wallet', category: 'Accessories', price: 999, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', stock: 20 },
  { id: 'a3', name: 'Sleek Polarized Sunglasses', category: 'Accessories', price: 1499, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', stock: 30 },

  // APPAREL (2 ITEMS)
  { id: 'c1', name: 'Essential Cotton Hoodie', category: 'Apparel', price: 1599, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80', stock: 30 },
  { id: 'c2', name: 'Heavyweight Linen Shirt', category: 'Apparel', price: 1899, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80', stock: 25 },

  // HOME (2 ITEMS)
  { id: 'h1', name: 'Contour Ceramic Lamp', category: 'Home', price: 2199, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', stock: 10 },
  { id: 'h2', name: 'Minimalist Wall Clock', category: 'Home', price: 1499, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=80', stock: 15 },

  // ELECTRONICS (1 ITEM)
  { id: 'e1', name: 'Acoustic Wireless Headphones', category: 'Electronics', price: 4299, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', stock: 11 }
];

export default function Shop() {
  const [items] = useState(catalog12);
  const [categories] = useState(['Bags', 'Footwear', 'Accessories', 'Apparel', 'Home', 'Electronics']);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');

  const filtered = items.filter(i => 
    (!cat || i.category === cat) &&
    (!q || i.name.toLowerCase().includes(q.toLowerCase()) || i.category.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <section className="page">
      <p className="eyebrow">NOVA COLLECTION</p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '44px', marginBottom: '16px' }}>Shop Everything</h1>

      {/* SEARCH AND CATEGORY FILTERS */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', margin: '24px 0 36px' }}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search products..."
          style={{ maxWidth: '360px' }}
        />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => setCat('')} style={{ padding: '10px 18px', background: cat === '' ? 'var(--text-dark)' : '#fff', color: cat === '' ? '#fff' : 'var(--text-dark)', border: '1px solid var(--border-light)', borderRadius: '20px', cursor: 'pointer' }}>
            All
          </button>
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ padding: '10px 18px', background: cat === c ? 'var(--text-dark)' : '#fff', color: cat === c ? '#fff' : 'var(--text-dark)', border: '1px solid var(--border-light)', borderRadius: '20px', cursor: 'pointer' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid">
        {filtered.map(p => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}