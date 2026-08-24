import { Link } from "react-router-dom";

export default function OrderDetail() {

  return (
    <section className="order-detail-page">

      <Link
        to="/orders"
        className="back-link"
      >
        ← Back to orders
      </Link>


      <div className="page-heading">

        <span className="eyebrow">
          ORDER DETAILS
        </span>

        <h1>
          Your order.
        </h1>

      </div>


      <div className="order-detail-grid">

        <div className="order-products">

          {/* Render existing order items here */}

          <div className="order-detail-item">

            <div className="placeholder-image" />

            <div>

              <span>
                PRODUCT
              </span>

              <h3>
                Product Name
              </h3>

              <p>
                Quantity: 1
              </p>

            </div>

          </div>

        </div>


        <aside className="order-detail-summary">

          <span className="eyebrow">
            STATUS
          </span>

          <h2>
            Processing
          </h2>

          <hr />

          <span>
            Total
          </span>

          <strong>
            ₹0
          </strong>

        </aside>

      </div>

    </section>
  );
}