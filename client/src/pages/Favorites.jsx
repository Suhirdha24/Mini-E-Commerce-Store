import { Link } from "react-router-dom";

export default function Favorites() {
  return (
    <section className="simple-page">

      <span className="eyebrow">
        YOUR COLLECTION
      </span>

      <h1>
        Favorites
      </h1>

      <p>
        Products you love will appear here.
      </p>

      <Link
        to="/shop"
        className="dark-button"
      >
        Explore Shop →
      </Link>

    </section>
  );
}