import {
  Link,
  useNavigate,
} from "react-router-dom";

export default function Cart() {

  /*
    Keep your existing cart state/API logic here.
    This component controls the new visual structure.
  */

  const navigate = useNavigate();

  const cart = [];

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  const shipping =
    subtotal > 0 ? 0 : 0;

  const total =
    subtotal + shipping;


  if (cart.length === 0) {
    return (
      <section className="empty-page">

        <span className="eyebrow">
          YOUR SELECTION
        </span>

        <h1>
          Your cart is empty.
        </h1>

        <p>
          Nothing here yet. Discover
          something you love.
        </p>

        <Link
          to="/"
          className="dark-button"
        >
          Continue Shopping →
        </Link>

      </section>
    );
  }


  return (
    <section className="cart-page">

      <div className="page-heading">

        <span className="eyebrow">
          YOUR SELECTION
        </span>

        <h1>
          Shopping Cart
        </h1>

      </div>


      <div className="cart-layout">

        <div className="cart-items">

          {cart.map((item) => (
            <div
              className="cart-item"
              key={item.id}
            >

              <img
                src={item.image}
                alt={item.name}
              />

              <div className="cart-item-info">

                <span>
                  {item.category}
                </span>

                <h3>
                  {item.name}
                </h3>

                <strong>
                  ₹
                  {Number(
                    item.price
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <div className="quantity">
                − {item.quantity} +
              </div>

            </div>
          ))}

        </div>


        <aside className="order-summary">

          <span className="eyebrow">
            SUMMARY
          </span>

          <h2>
            Your Order
          </h2>

          <div>
            <span>
              Subtotal
            </span>

            <strong>
              ₹
              {subtotal.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div>
            <span>
              Shipping
            </span>

            <strong>
              Free
            </strong>
          </div>

          <hr />

          <div>
            <span>
              Total
            </span>

            <strong>
              ₹
              {total.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <button
            className="dark-button full"
            onClick={() =>
              navigate("/checkout")
            }
          >
            Checkout →
          </button>

        </aside>

      </div>

    </section>
  );
}