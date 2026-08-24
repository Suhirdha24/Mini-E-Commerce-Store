import { Link } from "react-router-dom";


const featuredProducts = [
  {
    id: 1,
    name: "Essential Collection",
    category: "NEW ARRIVAL",
    price: "₹1,499",
    image:
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Everyday Edit",
    category: "BEST SELLER",
    price: "₹1,899",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Modern Classic",
    category: "CURATED",
    price: "₹2,199",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  },
];


export default function Home() {
  return (
    <div className="home-page">

      {/* HERO */}

      <section className="editorial-hero">

        <div className="hero-copy">

          <span className="eyebrow">
            THE NEW COLLECTION
          </span>

          <h1>
            BEAUTY IN
            <br />
            THE EVERYDAY.
          </h1>

          <p>
            A considered collection of
            modern essentials, selected
            for people who appreciate
            simplicity.
          </p>

          <Link
            to="/"
            className="dark-button"
          >
            Explore Collection
            <span>→</span>
          </Link>

        </div>


        <div className="hero-art">

          <div className="hero-image-main">

            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85"
              alt="NOVA collection"
            />

          </div>


          <div className="hero-floating-card">

            <span>
              NOVA
            </span>

            <strong>
              01
            </strong>

          </div>

        </div>

      </section>


      {/* INTRO */}

      <section className="editorial-intro">

        <span className="eyebrow">
          OUR PHILOSOPHY
        </span>

        <h2>
          Less, but
          <br />
          better.
        </h2>

        <p>
          We believe the things you
          choose should feel intentional.
          Every piece is selected with
          quality, simplicity and everyday
          beauty in mind.
        </p>

      </section>


      {/* PRODUCTS */}

      <section className="featured-section">

        <div className="section-heading">

          <div>

            <span className="eyebrow">
              CURATED FOR YOU
            </span>

            <h2>
              The Edit
            </h2>

          </div>

          <Link to="/">
            View all →
          </Link>

        </div>


        <div className="editorial-product-grid">

          {featuredProducts.map(
            (product) => (
              <Link
                to={`/products/${product.id}`}
                className="editorial-product"
                key={product.id}
              >

                <div className="product-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <span>
                    View
                  </span>

                </div>


                <div className="product-info">

                  <div>

                    <span>
                      {product.category}
                    </span>

                    <h3>
                      {product.name}
                    </h3>

                  </div>

                  <strong>
                    {product.price}
                  </strong>

                </div>

              </Link>
            )
          )}

        </div>

      </section>


      {/* STATEMENT */}

      <section className="statement-section">

        <span>
          DESIGNED FOR LIFE
        </span>

        <h2>
          Objects with
          <br />
          intention.
        </h2>

        <Link
          to="/"
          className="outline-button"
        >
          Discover NOVA
        </Link>

      </section>


      {/* NEWSLETTER */}

      <section className="newsletter">

        <span className="eyebrow">
          STAY IN THE KNOW
        </span>

        <h2>
          Join our world.
        </h2>

        <p>
          New collections, thoughtful
          stories and occasional surprises.
        </p>

        <form>

          <input
            type="email"
            placeholder="Your email address"
          />

          <button>
            →
          </button>

        </form>

      </section>

    </div>
  );
}