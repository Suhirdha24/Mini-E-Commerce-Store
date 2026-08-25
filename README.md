# NOVA STORE — MERN Mini E-Commerce Store

🚀 **Live Store App (Vercel)**: [https://mini-e-commerce-store-6l2l6dtca-suhirdha24s-projects.vercel.app/](https://mini-e-commerce-store-6l2l6dtca-suhirdha24s-projects.vercel.app/)

A full-stack MERN assessment project with JWT authentication, product search/filtering, cart, stock validation, checkout, orders, admin product/order management, responsive UI, Docker support and MongoDB Atlas deployment readiness.


> The visual direction is an original modern editorial storefront inspired by current Dribbble-style layouts: large typography, neutral palette, strong whitespace, product cards and a bold hero. It does not copy a specific Dribbble design.

## 1. Stack
- Frontend: React 18, React Router, Axios, Vite
- Backend: Node.js, Express, JWT, bcryptjs, Mongoose
- Database: MongoDB / MongoDB Atlas
- Deployment: any Node/container host; MongoDB Atlas for production
- Optional local orchestration: Docker Compose

## 2. Project structure
```text
mern-store/
├── client/
│   ├── src/api
│   ├── src/components
│   ├── src/context
│   ├── src/pages
│   ├── src/App.jsx
│   └── src/styles.css
├── server/
│   ├── src/config
│   ├── src/controllers
│   ├── src/middleware
│   ├── src/models
│   ├── src/routes
│   ├── src/utils/seed.js
│   └── src/server.js
├── docker-compose.yml
└── README.md
```

## 3. MongoDB schema
### User
`name, email(unique), password(hashed), role(user/admin), timestamps`

### Product
`name, slug(unique), description, price, category, image, stock, featured, timestamps`

### Order
`user, items(product snapshot/name/image/price/quantity), shipping, total, status, timestamps`

Order items store a price/name/image snapshot so historical orders remain correct even if the product changes later.

## 4. API endpoints
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` — JWT required

### Products
- `GET /api/products?search=&category=&page=1&limit=8`
- `GET /api/products/:id`
- `POST /api/products` — admin
- `PUT /api/products/:id` — admin
- `DELETE /api/products/:id` — admin

### Orders
- `POST /api/orders` — user
- `GET /api/orders/mine` — user
- `GET /api/orders/:id` — owner/admin
- `GET /api/orders/admin/all` — admin
- `PATCH /api/orders/:id/status` — admin

## 5. Run locally — recommended method
### Prerequisites
Install Node.js 20+, Git and MongoDB. You can either use MongoDB locally or MongoDB Atlas.

### Step A — MongoDB Atlas
1. Create a free MongoDB Atlas cluster.
2. Create a database user.
3. Allow your development IP address in Network Access. For a temporary development setup, `0.0.0.0/0` can be used, but restrict it for production.
4. Copy the connection string.

### Step B — backend
```bash
cd server
npm install
copy .env.example .env
```
On macOS/Linux use `cp .env.example .env`.

Edit `.env`:
```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
CLIENT_URL=http://localhost:5173
```

Seed the admin account and sample products:
```bash
npm run seed
npm run dev
```

Admin credentials created by the seed script:
```text
Email: admin@ministore.com
Password: Admin@123
```
Change this password before any real deployment.

### Step C — frontend
Open a second terminal:
```bash
cd client
npm install
copy .env.example .env
npm run dev
```
macOS/Linux:
```bash
cp .env.example .env
```
Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## 6. Complete user flow
1. Register a user.
2. Browse products.
3. Search by product name/description.
4. Filter by category.
5. Open a product and select quantity.
6. Add to bag.
7. Increase/decrease/remove cart items.
8. Checkout with shipping details.
9. Backend re-checks stock before creating the order.
10. Stock is reduced after validation.
11. User sees the order under My Orders.
12. Admin logs in and opens `/admin`.
13. Admin creates/edits/deletes products and changes order status.

## 7. Docker — run the whole stack locally
From the project root:
```bash
copy server/.env.example server/.env
```
Then set `MONGO_URI=mongodb://mongo:27017/mini_store` and a JWT secret in `server/.env`.

Run:
```bash
docker compose up --build
```
Frontend: `http://localhost:5173`
Backend: `http://localhost:5000/api/health`
MongoDB: `localhost:27017`

## 8. Production deployment architecture
Recommended simple architecture:
```text
React/Vite static frontend
        |
        v
Production static host / Nginx
        |
        | HTTPS API calls
        v
Express/Node API
        |
        v
MongoDB Atlas
```

The frontend only needs `VITE_API_URL=https://YOUR-API-DOMAIN/api` at build time. The backend needs `MONGO_URI`, `JWT_SECRET`, `PORT` and `CLIENT_URL`.

### Backend deployment checklist
1. Push this repository to GitHub.
2. Create a Node.js web service on your preferred cloud host.
3. Set root directory to `server`.
4. Build command: `npm install`.
5. Start command: `npm start`.
6. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `PORT` if your provider requires it; otherwise the platform-provided port is used.
7. Deploy.
8. Test `https://YOUR-API-DOMAIN/api/health`.

### Frontend deployment checklist
1. Create a static site on your preferred cloud host.
2. Set root directory to `client`.
3. Build command: `npm install && npm run build`.
4. Output directory: `dist`.
5. Add `VITE_API_URL=https://YOUR-API-DOMAIN/api`.
6. Deploy.
7. Configure SPA fallback so `/products/:id`, `/orders`, `/admin`, etc. return `index.html`.
8. Update backend `CLIENT_URL` to the final frontend URL.

## 9. Production security improvements before submission
- Replace the seeded admin password.
- Use a strong random JWT secret.
- Restrict MongoDB Atlas Network Access.
- Add rate limiting and helmet.
- Validate all request bodies with a schema validator such as Zod/Joi/express-validator.
- Add refresh tokens or short-lived access tokens for a production-grade auth system.
- Use an object storage service for product uploads instead of remote image URLs.
- Add payment integration only if the assessment asks for it.

## 10. Suggested assessment demo
Demo in this order:
1. Home page + responsive design.
2. Search/category filter.
3. Product detail + stock limit.
4. Registration/login + JWT.
5. Cart quantity validation.
6. Checkout + order creation.
7. My Orders.
8. Admin product CRUD.
9. Admin order status update.
10. Explain MongoDB schemas and REST endpoints.

## 11. Notes
This implementation intentionally keeps payment out because the assessment requires placing orders but does not require a payment gateway. Product image upload is also represented by an image URL to keep the project deployable without adding cloud storage credentials.
