import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ p }) {
  const { add } = useCart();
  const productId = p._id || p.id;

  return (
    <article className="card">
      <Link to={`/products/${productId}`}>
        <img src={p.image} alt={p.name} />
      </Link>
      <div className="card-body">
        <div className="muted">{p.category}</div>
        <h3>{p.name}</h3>
        <div className="row">
          <b>₹{p.price?.toLocaleString('en-IN')}</b>
          <button disabled={!p.stock} onClick={() => add(p)}>
            {p.stock ? 'Add to Bag' : 'Out of Stock'}
          </button>
        </div>
        {p.stock < 5 && p.stock > 0 && (
          <small style={{ color: '#d97706', marginTop: '6px' }}>Only {p.stock} units left</small>
        )}
      </div>
    </article>
  );
}