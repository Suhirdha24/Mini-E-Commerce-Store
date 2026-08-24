export default function Checkout() {
  return (
    <section className="checkout-page">

      <div className="page-heading">

        <span className="eyebrow">
          NOVA CHECKOUT
        </span>

        <h1>
          Complete your order.
        </h1>

      </div>


      <div className="checkout-layout">

        <div className="checkout-form">

          <section>
            <span className="form-number">
              01
            </span>

            <h2>
              Contact information
            </h2>

            <input
              type="email"
              placeholder="Email address"
            />
          </section>


          <section>
            <span className="form-number">
              02
            </span>

            <h2>
              Shipping address
            </h2>

            <div className="form-row">

              <input
                placeholder="First name"
              />

              <input
                placeholder="Last name"
              />

            </div>

            <input
              placeholder="Address"
            />

            <div className="form-row">

              <input
                placeholder="City"
              />

              <input
                placeholder="Postal code"
              />

            </div>

          </section>


          <section>
            <span className="form-number">
              03
            </span>

            <h2>
              Payment
            </h2>

            <div className="payment-option">
              Cash on Delivery
            </div>
          </section>


          <button className="dark-button">
            Place Order →
          </button>

        </div>


        <aside className="checkout-summary">

          <span className="eyebrow">
            YOUR ORDER
          </span>

          <h2>
            Order Summary
          </h2>

          {/* Render existing cart items here */}

          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹0
            </strong>

          </div>

        </aside>

      </div>

    </section>
  );
}