import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <section className="simple-page">

        <h1>
          Sign in to view your profile.
        </h1>

        <p>
          You need an account to access your
          profile and orders.
        </p>

        <Link
          to="/login"
          className="dark-button"
        >
          Sign In
        </Link>

      </section>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <section className="profile-page">

      <span className="eyebrow">
        MY ACCOUNT
      </span>

      <h1>
        Welcome, {user.name}.
      </h1>

      <div className="profile-grid">

        <div className="profile-card">

          <span>Name</span>

          <h3>
            {user.name}
          </h3>

        </div>

        <div className="profile-card">

          <span>Email</span>

          <h3>
            {user.email}
          </h3>

        </div>

      </div>

      <div className="profile-actions">

        <Link to="/orders">
          View Orders
        </Link>

        <Link to="/favorites">
          My Favorites
        </Link>

        <Link to="/cart">
          My Cart
        </Link>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>

    </section>
  );
}