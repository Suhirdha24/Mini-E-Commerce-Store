import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

import {
  useAuth,
} from "../context/AuthContext";


export default function Layout({
  children,
}) {

  const {
    user,
  } = useAuth();

  const navigate =
    useNavigate();

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);


  return (
    <div className="site">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="site-header">

        {/* BRAND */}

        <Link
          to="/"
          className="brand"
        >

          <div className="brand-mark">
            N
          </div>

          <div className="brand-copy">

            <strong>
              NOVA
            </strong>

            <span>
              STORE
            </span>

          </div>

        </Link>


        {/* MAIN NAVIGATION */}

        <nav className="main-nav">

          <Link to="/">
            Home
          </Link>

          <Link to="/shop">
            Shop
          </Link>

          <Link to="/collections/new-arrivals">
            Collections
          </Link>

          <Link to="/about">
            About
          </Link>

        </nav>


        {/* HEADER ACTIONS */}

        <div className="header-actions">

          {/* FAVORITES */}

          <Link
            to="/favorites"
            className="header-icon"
            title="Favorites"
          >
            ♡
          </Link>


          {/* CART */}

          <Link
            to="/cart"
            className="header-icon"
            title="Cart"
          >
            🛒
          </Link>


          {/* PROFILE */}

          {user ? (

            <div className="account-wrapper">

              <button
                className="account-button"
                onClick={() =>
                  setMenuOpen(
                    !menuOpen
                  )
                }
              >

                <span className="account-avatar">

                  {(
                    user.name ||
                    user.email ||
                    "U"
                  )
                    .charAt(0)
                    .toUpperCase()}

                </span>

                <span className="account-name">

                  {user.name ||
                    "Account"}

                </span>

                <span>
                  ↓
                </span>

              </button>


              {menuOpen && (

                <div className="account-menu">

                  {/* USER INFO */}

                  <div className="account-menu-user">

                    <strong>
                      {user.name ||
                        "User"}
                    </strong>

                    <span>
                      {user.email}
                    </span>

                  </div>


                  {/* PROFILE */}

                  <Link
                    to="/profile"
                    onClick={() =>
                      setMenuOpen(
                        false
                      )
                    }
                  >
                    My Profile
                  </Link>


                  {/* FAVORITES */}

                  <Link
                    to="/favorites"
                    onClick={() =>
                      setMenuOpen(
                        false
                      )
                    }
                  >
                    Favorites
                  </Link>


                  {/* ORDERS */}

                  <Link
                    to="/orders"
                    onClick={() =>
                      setMenuOpen(
                        false
                      )
                    }
                  >
                    My Orders
                  </Link>


                  {/* ADMIN */}

                  {user.role ===
                    "admin" && (

                    <Link
                      to="/admin"
                      onClick={() =>
                        setMenuOpen(
                          false
                        )
                      }
                    >
                      Admin Portal
                    </Link>

                  )}


                  {/* LOGOUT */}

                  <Link
                    to="/logout"
                    onClick={() =>
                      setMenuOpen(
                        false
                      )
                    }
                  >
                    Logout
                  </Link>

                </div>

              )}

            </div>

          ) : (

            <Link
              to="/login"
              className="header-cta"
            >
              Sign In
            </Link>

          )}

        </div>

      </header>


      {/* =================================================
          PAGE CONTENT
      ================================================= */}

      <main>
        {children}
      </main>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="site-footer">

        <div className="footer-brand">

          <div className="brand-mark">
            N
          </div>

          <div>

            <strong>
              NOVA STORE
            </strong>

            <p>
              Thoughtfully selected.
              Beautifully made.
            </p>

          </div>

        </div>


        <div className="footer-links">

          <div>

            <span>
              EXPLORE
            </span>

            <Link to="/">
              Home
            </Link>

            <Link to="/shop">
              Shop
            </Link>

            <Link to="/collections/new-arrivals">
              Collections
            </Link>

            <Link to="/about">
              About
            </Link>

          </div>


          <div>

            <span>
              ACCOUNT
            </span>

            <Link to="/profile">
              Profile
            </Link>

            <Link to="/favorites">
              Favorites
            </Link>

            <Link to="/cart">
              Cart
            </Link>

            <Link to="/orders">
              Orders
            </Link>

          </div>


          <div>

            <span>
              SUPPORT
            </span>

            <Link to="/about">
              About Store
            </Link>

            <Link to="/shop">
              Collections
            </Link>

          </div>

        </div>


        <div className="footer-bottom">

          © {new Date().getFullYear()}
          {" "}
          NOVA STORE

        </div>

      </footer>

    </div>
  );
}