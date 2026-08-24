import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <header
        style={{
          padding: "20px 40px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: "28px",
            fontWeight: "700",
            textDecoration: "none",
            color: "#111",
          }}
        >
          NOVA
        </Link>

        <nav
          style={{
            display: "flex",
            gap: "25px",
          }}
        >
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}