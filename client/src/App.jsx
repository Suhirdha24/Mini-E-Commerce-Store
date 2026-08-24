import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Cart from "./pages/Cart";

import Auth from "./pages/Auth";

import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";

import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";

import About from "./pages/About";

import Admin from "./pages/Admin";
import Logout from "./pages/Logout";

import { useAuth } from "./context/AuthContext";


/* =========================================================
   AUTH GUARD
========================================================= */

function Guard({
  children,
  admin = false,
}) {
  const {
    user,
    loading,
  } = useAuth();

  const location = useLocation();


  if (loading) {
    return (
      <div className="page-loader">

        <div className="loader-mark">
          N
        </div>

        <span>
          Loading...
        </span>

      </div>
    );
  }


  /*
    User is not logged in.

    Remember the page they originally
    wanted to visit so we can send them
    back after login.
  */

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
        }}
        replace
      />
    );
  }


  /*
    Admin-only protection
  */

  if (
    admin &&
    user.role !== "admin"
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  return children;
}


/* =========================================================
   APP
========================================================= */

export default function App() {

  return (
    <Layout>

      <Routes>

        {/* =================================================
            PUBLIC
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* Home / Shop catalogue */}

        <Route
          path="/shop"
          element={<Shop />}
        />

        {/* Individual product */}

        <Route
          path="/products/:id"
          element={<Product />}
        />

        {/* Collections */}

        <Route
          path="/collections/:slug"
          element={<Shop />}
        />

        {/* About */}

        <Route
          path="/about"
          element={<About />}
        />

        {/* Authentication */}

        <Route
          path="/login"
          element={<Auth />}
        />

        <Route
          path="/register"
          element={
            <Auth mode="register" />
          }
        />

        {/* Cart can be viewed without login */}

        <Route
          path="/cart"
          element={<Cart />}
        />


        {/* =================================================
            LOGGED-IN USER
        ================================================= */}

        <Route
          path="/profile"
          element={
            <Guard>
              <Profile />
            </Guard>
          }
        />

        <Route
          path="/favorites"
          element={
            <Guard>
              <Favorites />
            </Guard>
          }
        />

        <Route
          path="/checkout"
          element={
            <Guard>
              <Checkout />
            </Guard>
          }
        />

        <Route
          path="/orders"
          element={
            <Guard>
              <Orders />
            </Guard>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <Guard>
              <OrderDetail />
            </Guard>
          }
        />

        {/* Logout */}

        <Route
          path="/logout"
          element={<Logout />}
        />


        {/* =================================================
            ADMIN
        ================================================= */}

        <Route
          path="/admin"
          element={
            <Guard admin>
              <Admin />
            </Guard>
          }
        />


        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </Layout>
  );
}