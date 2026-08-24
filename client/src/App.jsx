import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Admin from "./pages/Admin";

import { useAuth } from "./context/AuthContext";


/*
  ============================================================
  PROTECTED ROUTE / GUARD
  ============================================================

  Guard protects pages that require authentication.

  Usage:

  <Guard>
    <Checkout />
  </Guard>

  For admin-only pages:

  <Guard admin>
    <Admin />
  </Guard>
*/

function Guard({ children, admin = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ----------------------------------------------------------
  // Wait until authentication state is loaded
  // ----------------------------------------------------------

  if (loading) {
    return (
      <div className="state">
        Loading...
      </div>
    );
  }

  // ----------------------------------------------------------
  // User is not logged in
  // ----------------------------------------------------------

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // ----------------------------------------------------------
  // Admin-only protection
  // ----------------------------------------------------------

  if (admin && user.role !== "admin") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // ----------------------------------------------------------
  // User is authorized
  // ----------------------------------------------------------

  return children;
}


/*
  ============================================================
  APPLICATION ROUTES
  ============================================================
*/

export default function App() {
  return (
    <Layout>
      <Routes>

        {/* ====================================================
            PUBLIC ROUTES
        ==================================================== */}

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Product Details */}
        <Route
          path="/products/:id"
          element={<Product />}
        />

        {/* Shopping Cart */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Auth />}
        />

        {/* Register */}
        <Route
          path="/register"
          element={<Auth mode="register" />}
        />


        {/* ====================================================
            CUSTOMER PROTECTED ROUTES
        ==================================================== */}

        {/* Checkout */}
        <Route
          path="/checkout"
          element={
            <Guard>
              <Checkout />
            </Guard>
          }
        />

        {/* Customer Orders */}
        <Route
          path="/orders"
          element={
            <Guard>
              <Orders />
            </Guard>
          }
        />

        {/* Individual Order */}
        <Route
          path="/orders/:id"
          element={
            <Guard>
              <OrderDetail />
            </Guard>
          }
        />


        {/* ====================================================
            ADMIN ROUTE
        ==================================================== */}

        {/*

          Admin Portal

          Only users with:

          user.role === "admin"

          can access this page.

        */}

        <Route
          path="/admin"
          element={
            <Guard admin>
              <Admin />
            </Guard>
          }
        />


        {/* ====================================================
            FALLBACK ROUTE
        ==================================================== */}

        {/*

          If the user enters an invalid URL,
          redirect them back to Home.

          Example:

          /something-that-does-not-exist
          ↓
          /

        */}

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