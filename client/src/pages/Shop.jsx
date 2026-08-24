import { useState } from 'react';
import ProductCard from '../components/ProductCard';

const catalog30 = [
  // BAGS (5 ITEMS)
  { id: 'b1', name: 'Essential Leather Tote', category: 'Bags', price: 2899, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'b2', name: 'Everyday Canvas Backpack', category: 'Bags', price: 1999, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', stock: 14 },
  { id: 'b3', name: 'Minimal Crossbody Bag', category: 'Bags', price: 1799, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80', stock: 20 },
  { id: 'b4', name: 'Travel Duffle Bag', category: 'Bags', price: 3599, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', stock: 9 },
  { id: 'b5', name: 'Structured Work Briefcase', category: 'Bags', price: 4299, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', stock: 6 },

  // FOOTWEAR (5 ITEMS)
  { id: 'f1', name: 'Aero Knit Sneakers', category: 'Footwear', price: 2499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', stock: 18 },
  { id: 'f2', name: 'Neutral Studio Sneakers', category: 'Footwear', price: 3499, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: 'f3', name: 'Minimal Canvas Loafers', category: 'Footwear', price: 2999, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'f4', name: 'Classic Leather Boots', category: 'Footwear', price: 4499, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80', stock: 8 },
  { id: 'f5', name: 'Urban Trail Runners', category: 'Footwear', price: 3899, image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80', stock: 10 },

  // ACCESSORIES (5 ITEMS)
  { id: 'a1', name: 'Mono Chronograph Watch', category: 'Accessories', price: 3999, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', stock: 12 },
  { id: 'a2', name: 'Classic Leather Wallet', category: 'Accessories', price: 999, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', stock: 20 },
  { id: 'a3', name: 'Sleek Polarized Sunglasses', category: 'Accessories', price: 1499, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', stock: 30 },
  { id: 'a4', name: 'Minimal Gold Ring', category: 'Accessories', price: 1199, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80', stock: 25 },
  { id: 'a5', name: 'Silk Knit Scarf', category: 'Accessories', price: 1599, image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&auto=format&fit=crop&q=80', stock: 16 },

  // APPAREL (5 ITEMS)
  { id: 'c1', name: 'Essential Cotton Hoodie', category: 'Apparel', price: 1599, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80', stock: 30 },
  { id: 'c2', name: 'Heavyweight Linen Shirt', category: 'Apparel', price: 1899, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80', stock: 25 },
  { id: 'c3', name: 'Tailored Wool Coat', category: 'Apparel', price: 4999, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80', stock: 8 },
  { id: 'c4', name: 'Relaxed Denim Jacket', category: 'Apparel', price: 2799, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80', stock: 14 },
  { id: 'c5', name: 'Oversized Cotton Tee', category: 'Apparel', price: 899, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', stock: 40 },

  // HOME (5 ITEMS)
  { id: 'h1', name: 'Contour Ceramic Lamp', category: 'Home', price: 2199, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', stock: 10 },
  { id: 'h2', name: 'Minimalist Wall Clock', category: 'Home', price: 1499, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=80', stock: 15 },
  { id: 'h3', name: 'Linen Throw Pillow', category: 'Home', price: 999, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', stock: 22 },
  { id: 'h4', name: 'Scented Soy Candle', category: 'Home', price: 799, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80', stock: 35 },
  { id: 'h5', name: 'Ceramic Coffee Mug', category: 'Home', price: 649, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', stock: 50 },

  // ELECTRONICS (5 ITEMS)
  { id: 'e1', name: 'Acoustic Wireless Headphones', category: 'Electronics', price: 4299, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', stock: 11 },
  { id: 'e2', name: 'Minimal Bluetooth Speaker', category: 'Electronics', price: 2999, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80', stock: 18 },
  { id: 'e3', name: 'Wireless Charging Pad', category: 'Electronics', price: 1299, image: 'https://images.unsplash.com/photo-1622445268465-843d3876878b?w=800&auto=format&fit=crop&q=80', stock: 30 },
  { id: 'e4', name: 'Aluminum Laptop Stand', category: 'Electronics', price: 1799, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80', stock: 20 },
  { id: 'e5', name: 'Slim Magnetic Power Bank', category: 'Electronics', price: 1999, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80', stock: 25 }
];

export default function Shop() {
  const [items] = useState(catalog30);
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