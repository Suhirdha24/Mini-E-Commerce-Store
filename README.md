# NOVA STORE — MERN Mini E-Commerce & Retailer Portal

Production Store URL (Vercel):  
**[https://mini-e-commerce-store-lake.vercel.app/](https://mini-e-commerce-store-lake.vercel.app/)**

---

## 1. Technology Stack
- **Frontend**: React 18, React Router v6, Axios, Vite, Vanilla CSS Design System with custom SVG icons (zero AI-generated emojis).
- **Backend**: Node.js, Express.js (ES Modules), JWT, bcryptjs, Mongoose, pg (node-postgres), @supabase/supabase-js.
- **Database Architecture**: Dual-Engine Support:
  - Primary Engine: Cloud PostgreSQL via Supabase with ACID transactions (`BEGIN`, `COMMIT`, `ROLLBACK`, `FOR UPDATE` pessimistic row locking).
  - Secondary/Fallback Engine: MongoDB via Mongoose.
- **Deployment**: Vercel (Frontend), Render / Container Host (Backend).

---

## 2. Project Structure
```text
mini-e-commerce/
├── client/
│   ├── src/api/api.js          # Axios instance with 401 response interceptor
│   ├── src/components/
│   │   ├── Icons.jsx           # Clean SVG vector icon library
│   │   ├── Layout.jsx          # Proportional header, navigation, footer
│   │   ├── ProductCard.jsx     # 1:1 aspect ratio card with wishlist toggle
│   │   └── ProtectedRoute.jsx  # Route guards for User and Admin
│   ├── src/context/
│   │   ├── AuthContext.jsx     # Global authentication state
│   │   └── CartContext.jsx     # Local storage backed shopping cart
│   ├── src/pages/
│   │   ├── Home.jsx            # Clean hero & category showcase
│   │   ├── Shop.jsx            # Filterable product catalog with search
│   │   ├── Product.jsx         # Product details with stock counter
│   │   ├── Cart.jsx            # Cart review & quantity steppers
│   │   ├── Checkout.jsx        # Shipping & payment method selector
│   │   ├── Orders.jsx          # Order history & cancellation
│   │   ├── OrderDetail.jsx     # Single order receipt
│   │   ├── Auth.jsx            # Split-screen login & register
│   │   ├── Profile.jsx         # User details & saved addresses
│   │   └── Admin.jsx           # Management portal (CRUD & status)
│   ├── src/styles.css          # Balanced design system (1200px container)
│   └── src/App.jsx             # React router configuration
├── server/
│   ├── src/config/
│   │   ├── db.js               # Multi-engine connection initializer
│   │   └── supabase.js         # Cloud PostgreSQL connection & pool
│   ├── src/controllers/
│   │   ├── auth.js             # Register, login, profile
│   │   ├── products.js         # List, getOne, create, update, delete
│   │   └── orders.js           # Create, user orders, getOne, cancel, updateStatus
│   ├── src/middleware/
│   │   ├── auth.js             # JWT verification & adminOnly guard
│   │   └── error.js            # Not found & global error handlers
│   ├── src/models/
│   │   ├── User.js             # User Mongoose model
│   │   ├── Product.js          # Product Mongoose model
│   │   └── Order.js            # Order Mongoose model
│   ├── src/routes/
│   │   ├── auth.js             # /api/auth
│   │   ├── products.js         # /api/products
│   │   └── orders.js           # /api/orders
│   └── src/server.js           # Express application entrypoint
├── docker-compose.yml
└── README.md
```

---

## 3. Database Schema

### User Schema
- `name` (String, required, trimmed)
- `email` (String, required, unique, lowercase, trimmed)
- `password` (String, required, bcrypt hashed)
- `role` (String, enum: `['user', 'admin']`, default: `'user'`)
- `timestamps` (`createdAt`, `updatedAt`)

### Product Schema
- `name` (String, required, trimmed)
- `slug` (String, unique)
- `description` (String, required)
- `price` (Number, required, min: 0)
- `regularPrice` / `salePrice` / `costPrice` (Number)
- `category` (String, required, trimmed)
- `image` (String, required)
- `stock` (Number, required, min: 0, default: 0)
- `sku` (String)
- `active` (Boolean, default: true)
- `timestamps` (`createdAt`, `updatedAt`)

### Order Schema
- `user` / `user_id` (Reference to User)
- `items` (Array of snapshots: `product`, `sku`, `name`, `image`, `price`, `quantity`)
- `shipping` (Object: `name`, `address`, `city`, `state`, `postalCode`, `phone`)
- `paymentMethod` (String)
- `total` (Number, required)
- `status` (String, enum: `['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']`, default: `'Placed'`)
- `timestamps` (`createdAt`, `updatedAt`)

---

## 4. REST API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new customer account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Retrieve authenticated user profile (Protected)

### Products
- `GET /api/products` — List products with search, category filtering, and pagination
- `GET /api/products/:id` — Get single product details by ID or slug
- `POST /api/products` — Create a new product (Admin only)
- `PUT /api/products/:id` — Update an existing product (Admin only)
- `DELETE /api/products/:id` — Delete a product (Admin only)

### Orders
- `POST /api/orders` — Create order with atomic stock deduction (Protected)
- `GET /api/orders/mine` — Get current customer's order history (Protected)
- `GET /api/orders/:id` — Get order details (Protected, Owner or Admin only)
- `POST /api/orders/:id/cancel` — Cancel customer order and restore inventory (Protected, Owner only)
- `GET /api/orders/admin/all` — View all customer orders across store (Admin only)
- `PATCH /api/orders/:id/status` — Update order status (Admin only)

---

## 5. Security Safeguards
1. **Password Hashing**: Passwords hashed using bcrypt with salt rounds = 10; raw passwords are never stored or returned in responses.
2. **JWT Authentication**: Tokens verified with JWT secret via Bearer header; tokens expire and are cleared automatically on 401 response.
3. **Role-Based Access Control**: Strict `adminOnly` middleware protects product modification and administrative order endpoints.
4. **Order Authorization**: `GET /api/orders/:id` ensures non-admin users can only view their own orders.
5. **Inventory Race Prevention**: Atomic decrement during checkout and automatic inventory restoration upon order cancellation.
6. **Input Sanitization**: Email lowercasing and trimming, positive integer quantity bounds checking.

---

## 6. Running Locally

### Step 1: Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Configure your DATABASE_URL or MONGO_URI in .env
npm run dev
```

### Step 2: Frontend Setup
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.
