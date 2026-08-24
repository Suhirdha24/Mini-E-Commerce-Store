import { Link } from "react-router-dom";

export default function Orders() {

  const orders = [];

  return (
    <section className="orders-page">

      <div className="page-heading">

        <span className="eyebrow">
          YOUR ACCOUNT
        </span>

        <h1>
          Orders
        </h1>

      </div>


      {orders.length === 0 ? (

        <div className="empty-page compact">

          <h2>
            No orders yet.
          </h2>

          <p>
            Your future purchases will
            appear here.
          </p>

          <Link
            to="/"
            className="dark-button"
          >
            Explore Store →
          </Link>

        </div>

      ) : (

        <div className="orders-list">

          {orders.map((order) => (

            <Link
              to={`/orders/${order._id}`}
              className="order-card"
              key={order._id}
            >

              <div>

                <span>
                  ORDER #
                  {order._id
                    .slice(-6)
                    .toUpperCase()}
                </span>

                <h2>
                  ₹
                  {Number(
                    order.total
                  ).toLocaleString(
                    "en-IN"
                  )}
                </h2>

              </div>


              <div>

                <span>
                  {order.status}
                </span>

                <small>
                  →
                </small>

              </div>

            </Link>

          ))}

        </div>

      )}

    </section>
  );
}