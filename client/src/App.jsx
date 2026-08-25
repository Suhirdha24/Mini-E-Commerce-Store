import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import About from "./pages/About";
import Admin from "./pages/Admin";

function App() {
  return (
    <Routes>
      {/* AUTHENTICATION ROUTES */}
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />
      {/* SEPARATE DEDICATED ADMIN LOGIN ROUTE */}
      <Route path="/admin-login" element={<Auth mode="admin-login" />} />

      {/* MAIN WEBSITE LAYOUT ROUTES */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/admin" element={<Admin />} />
      </Route>

      {/* FALLBACK CATCH-ALL ROUTE */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;