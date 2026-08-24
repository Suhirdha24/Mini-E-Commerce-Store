import { useEffect, useMemo, useState } from "react";
import api from "../api/api";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  stock: 0,
  featured: false,
};

const ORDER_STATUSES = [
  "Placed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [productSearch, setProductSearch] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [productsResponse, ordersResponse] = await Promise.all([
        api.get("/products?limit=50"),
        api.get("/orders/admin/all"),
      ]);

      setProducts(productsResponse.data.items || []);
      setOrders(ordersResponse.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalRevenue = useMemo(() => {
    return orders
      .filter((order) => order.status !== "Cancelled")
      .reduce((total, order) => total + Number(order.total || 0), 0);
  }, [orders]);

  const lowStockProducts = useMemo(() => {
    return products.filter((product) => Number(product.stock) <= 5);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const search = productSearch.toLowerCase().trim();

    if (!search) return products;

    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search)
    );
  }, [products, productSearch]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        image: form.image,
        stock: Number(form.stock),
        featured: Boolean(form.featured),
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      resetForm();
      await loadData();

      setActiveSection("products");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      image: product.image || "",
      stock: product.stock || 0,
      featured: product.featured || false,
    });

    setActiveSection("add-product");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/products/${productId}`);

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to delete product."
      );
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setError("");

      await api.patch(`/orders/${orderId}/status`, {
        status,
      });

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to update order status."
      );
    }
  };

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderDashboard = () => (
    <>
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">ADMIN PORTAL</p>
          <h1>Dashboard</h1>
          <p className="admin-subtitle">
            Manage your store, products and customer orders.
          </p>
        </div>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <span className="admin-stat-icon">P</span>
          <div>
            <strong>{products.length}</strong>
            <span>Total Products</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-icon">O</span>
          <div>
            <strong>{orders.length}</strong>
            <span>Total Orders</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-icon">₹</span>
          <div>
            <strong>{formatCurrency(totalRevenue)}</strong>
            <span>Total Revenue</span>
          </div>
        </div>

        <div className="admin-stat-card warning">
          <span className="admin-stat-icon">!</span>
          <div>
            <strong>{lowStockProducts.length}</strong>
            <span>Low Stock Items</span>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Recent Orders</h2>
              <p>Latest customer purchases</p>
            </div>

            <button
              className="admin-text-button"
              onClick={() => setActiveSection("orders")}
            >
              View all
            </button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id}>
                    <td>
                      <strong>
                        #{order._id.slice(-6).toUpperCase()}
                      </strong>
                      <small>
                        {formatDate(order.createdAt)}
                      </small>
                    </td>

                    <td>
                      {order.user?.name || "Unknown"}
                    </td>

                    <td>
                      {formatCurrency(order.total)}
                    </td>

                    <td>
                      <span
                        className={`status-badge status-${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td colSpan="4" className="empty-cell">
                      No orders available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Low Stock</h2>
              <p>Products requiring attention</p>
            </div>
          </div>

          <div className="low-stock-list">
            {lowStockProducts.length === 0 ? (
              <div className="empty-state-small">
                All products have healthy stock.
              </div>
            ) : (
              lowStockProducts.slice(0, 6).map((product) => (
                <div
                  className="low-stock-item"
                  key={product._id}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.category}</span>
                  </div>

                  <b>{product.stock}</b>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderProducts = () => (
    <>
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">CATALOG</p>
          <h1>Products</h1>
          <p className="admin-subtitle">
            Add, edit and manage your store products.
          </p>
        </div>

        <button
          className="admin-primary-button"
          onClick={() => {
            resetForm();
            setActiveSection("add-product");
          }}
        >
          + Add Product
        </button>
      </div>

      <div className="admin-panel">
        <div className="admin-toolbar">
          <input
            className="admin-search"
            placeholder="Search products..."
            value={productSearch}
            onChange={(event) =>
              setProductSearch(event.target.value)
            }
          />

          <span className="admin-result-count">
            {filteredProducts.length} products
          </span>
        </div>

        <div className="admin-product-grid">
          {filteredProducts.map((product) => (
            <div
              className="admin-product-card"
              key={product._id}
            >
              <div className="admin-product-image">
                <img
                  src={product.image}
                  alt={product.name}
                />

                {product.featured && (
                  <span className="featured-label">
                    Featured
                  </span>
                )}
              </div>

              <div className="admin-product-content">
                <div>
                  <span className="admin-product-category">
                    {product.category}
                  </span>

                  <h3>{product.name}</h3>

                  <p>
                    {product.description?.slice(0, 90)}
                    {product.description?.length > 90
                      ? "..."
                      : ""}
                  </p>
                </div>

                <div className="admin-product-meta">
                  <strong>
                    {formatCurrency(product.price)}
                  </strong>

                  <span
                    className={
                      product.stock <= 5
                        ? "stock-low"
                        : "stock-good"
                    }
                  >
                    {product.stock} in stock
                  </span>
                </div>

                <div className="admin-product-actions">
                  <button
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>

                  <button
                    className="danger-button"
                    onClick={() =>
                      handleDelete(product._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="admin-empty">
              No products found.
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderAddProduct = () => (
    <>
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">CATALOG</p>

          <h1>
            {editingId ? "Edit Product" : "Add Product"}
          </h1>

          <p className="admin-subtitle">
            {editingId
              ? "Update the selected product."
              : "Create a new product for your store."}
          </p>
        </div>
      </div>

      <div className="admin-form-panel">
        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-form-field full">
              <label>Product Name</label>

              <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Example: Classic Oversized T-Shirt"
                required
              />
            </div>

            <div className="admin-form-field">
              <label>Category</label>

              <input
                name="category"
                value={form.category}
                onChange={handleInputChange}
                placeholder="Example: Clothing"
                required
              />
            </div>

            <div className="admin-form-field">
              <label>Price</label>

              <input
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleInputChange}
                placeholder="999"
                required
              />
            </div>

            <div className="admin-form-field">
              <label>Stock</label>

              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleInputChange}
                placeholder="50"
                required
              />
            </div>

            <div className="admin-form-field">
              <label>Image URL</label>

              <input
                name="image"
                value={form.image}
                onChange={handleInputChange}
                placeholder="https://..."
                required
              />
            </div>

            <div className="admin-form-field full">
              <label>Description</label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Describe the product..."
                rows="6"
                required
              />
            </div>

            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleInputChange}
              />

              <span>Feature this product on the store</span>
            </label>
          </div>

          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Product"
                : "Create Product"}
            </button>

            <button
              type="button"
              className="admin-secondary-button"
              onClick={() => {
                resetForm();
                setActiveSection("products");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );

  const renderOrders = () => (
    <>
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">SALES</p>
          <h1>Orders</h1>
          <p className="admin-subtitle">
            Manage customer orders and delivery status.
          </p>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-table-wrapper">
          <table className="admin-table orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <strong>
                      #{order._id.slice(-6).toUpperCase()}
                    </strong>
                  </td>

                  <td>
                    <strong>
                      {order.user?.name || "Unknown"}
                    </strong>

                    <small>
                      {order.user?.email || ""}
                    </small>
                  </td>

                  <td>
                    {order.items?.reduce(
                      (total, item) =>
                        total + Number(item.quantity || 0),
                      0
                    )}
                  </td>

                  <td>
                    <strong>
                      {formatCurrency(order.total)}
                    </strong>
                  </td>

                  <td>
                    {formatDate(order.createdAt)}
                  </td>

                  <td>
                    <select
                      className="order-status-select"
                      value={order.status}
                      onChange={(event) =>
                        updateOrderStatus(
                          order._id,
                          event.target.value
                        )
                      }
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option
                          value={status}
                          key={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="empty-cell"
                  >
                    No orders available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  if (loading) {
    return (
      <section className="admin-page">
        <div className="admin-loading">
          Loading admin portal...
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <strong>NOVA</strong>
          <span>ADMIN</span>
        </div>

        <nav className="admin-menu">
          <button
            className={
              activeSection === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("dashboard")
            }
          >
            <span>01</span>
            Dashboard
          </button>

          <button
            className={
              activeSection === "products"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("products")
            }
          >
            <span>02</span>
            Products
          </button>

          <button
            className={
              activeSection === "add-product"
                ? "active"
                : ""
            }
            onClick={() => {
              resetForm();
              setActiveSection("add-product");
            }}
          >
            <span>03</span>
            Add Product
          </button>

          <button
            className={
              activeSection === "orders"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("orders")
            }
          >
            <span>04</span>
            Orders
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <span>Store Management</span>
          <strong>NOVA STORE</strong>
        </div>
      </aside>

      <main className="admin-content">
        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {activeSection === "dashboard" &&
          renderDashboard()}

        {activeSection === "products" &&
          renderProducts()}

        {activeSection === "add-product" &&
          renderAddProduct()}

        {activeSection === "orders" &&
          renderOrders()}
      </main>
    </section>
  );
}