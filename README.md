# 👟 KicksCart — Full Stack E-Commerce Platform

> Premium sneaker e-commerce built with the MERN stack, featuring JWT RBAC, Stripe payments, Redux Toolkit, and Docker deployment.

---

## 🏗️ Architecture Overview

```
kickscart/
├── backend/                 # Node.js + Express REST API
│   ├── config/db.js         # MongoDB connection
│   ├── controllers/         # Business logic (auth, products, orders, payments, cart)
│   ├── middleware/          # JWT auth + RBAC middleware
│   ├── models/              # Mongoose schemas (User, Product, Order, Cart)
│   ├── routes/              # Express route definitions
│   ├── utils/               # JWT helpers, email, seeder
│   └── server.js            # App entry point
│
├── frontend/                # React 18 SPA
│   ├── public/              # Static assets
│   └── src/
│       ├── components/      # Reusable UI components
│       │   ├── cart/        # CartDrawer
│       │   ├── common/      # ProtectedRoute, AdminRoute
│       │   ├── layout/      # Navbar, Footer
│       │   └── product/     # ProductCard
│       ├── pages/           # Route-level page components
│       │   └── admin/       # Admin dashboard pages
│       ├── store/           # Redux Toolkit store
│       │   └── slices/      # auth, cart, product, order, ui
│       └── utils/           # Axios instance with interceptors
│
├── docker-compose.yml       # Full stack Docker deployment
└── package.json             # Monorepo scripts
```

---

## ✨ Key Features

### Security
- **JWT RBAC** — Short-lived access tokens (15 min) + rotating refresh tokens (7 days) stored as httpOnly cookies
- **Multi-device sessions** — Up to 5 concurrent refresh tokens per user
- **Rate limiting** — 100 req/15min globally, 10 req/15min on auth routes
- **Helmet.js** — HTTP security headers
- **bcryptjs** — Password hashing with salt rounds of 12

### E-Commerce Engine
- Product catalog with filtering, sorting, and pagination
- Size-based inventory management with real-time stock tracking
- Cart persistence with server-side sync (Redux Toolkit + backend)
- Wishlist functionality
- Order lifecycle: pending → confirmed → processing → shipped → delivered
- **Stripe payment integration** with webhook handling for async confirmation
- Cash on Delivery support
- GST calculation + free shipping threshold

### State Management (Redux Toolkit)
- **redux-persist** — auth + cart state survive page reloads
- Async thunks for all API calls
- Optimistic UI updates
- Axios interceptor for automatic token refresh with request queuing

### Admin Panel
- Dashboard with revenue analytics
- Product CRUD (create, edit, delete)
- Order management with status updates
- User management

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Stripe account (for payments)

### 1. Clone and install dependencies
```bash
git clone <your-repo>
cd kickscart
npm run install:all
```

### 2. Configure environment variables
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your values
```

**Required env vars:**
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Strong random string for access tokens |
| `JWT_REFRESH_SECRET` | Strong random string for refresh tokens |
| `STRIPE_SECRET_KEY` | From Stripe dashboard |
| `STRIPE_PUBLISHABLE_KEY` | From Stripe dashboard |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook settings |

### 3. Seed the database
```bash
npm run seed
```
This creates:
- **Admin:** admin@kickscart.com / admin123
- **User:** user@kickscart.com / user1234
- 6 sample products

### 4. Run in development
```bash
npm run dev
```
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

---

## 🐳 Docker Deployment

### Create `.env` at project root:
```env
MONGO_ROOT_USER=admin
MONGO_ROOT_PASS=strongpassword
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
CLIENT_URL=https://yourdomain.com
REACT_APP_API_URL=https://yourdomain.com/api
```

### Deploy:
```bash
npm run docker:build
```

This spins up:
1. **MongoDB** container with persistent volume
2. **Backend** Node.js API on port 5000
3. **Frontend** Nginx serving the React build on port 3000, proxying `/api` to backend

---

## ☁️ Cloud Deployment Options

### Option A: Render.com (Recommended for beginners)

**Backend:**
1. Create new Web Service → connect GitHub
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all env vars from `.env.example`

**Frontend:**
1. Create new Static Site → connect GitHub
2. Root directory: `frontend`
3. Build command: `npm install && npm run build`
4. Publish directory: `build`
5. Set `REACT_APP_API_URL` to your backend URL

**MongoDB:** Use MongoDB Atlas free tier

### Option B: Railway.app
1. Deploy MongoDB plugin
2. Deploy backend as Node.js service
3. Deploy frontend as Static site

### Option C: AWS (Production)
- **ECS Fargate** for containerised services
- **DocumentDB** or **MongoDB Atlas** for database
- **CloudFront + S3** for frontend static assets
- **ALB** for load balancing

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns accessToken + sets refreshToken cookie) |
| POST | `/api/auth/refresh` | Rotate refresh token → new access token |
| POST | `/api/auth/logout` | Revoke refresh token |
| POST | `/api/auth/forgot-password` | Send reset email |
| PUT | `/api/auth/reset-password/:token` | Reset password |
| GET | `/api/auth/me` | Get current user (protected) |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List products (filter, sort, paginate) |
| GET | `/api/products/featured` | Featured/new/bestseller products |
| GET | `/api/products/:id` | Single product |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |
| POST | `/api/products/:id/reviews` | Add review (auth) |

### Cart
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart` | Add item |
| PUT | `/api/cart/:itemId` | Update quantity |
| DELETE | `/api/cart/:itemId` | Remove item |
| DELETE | `/api/cart` | Clear cart |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/my` | Get my orders |
| GET | `/api/orders/:id` | Get order |
| PUT | `/api/orders/:id/pay` | Mark as paid |
| GET | `/api/orders` | All orders (admin) |
| PUT | `/api/orders/:id/status` | Update status (admin) |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/payments/config` | Get Stripe publishable key |
| POST | `/api/payments/create-intent` | Create Stripe PaymentIntent |
| POST | `/api/payments/webhook` | Stripe webhook handler |

---

## 🧪 Testing Stripe Payments

Use Stripe test cards:
- ✅ Success: `4242 4242 4242 4242`
- ❌ Declined: `4000 0000 0000 0002`
- 🔐 3D Secure: `4000 0025 0000 3155`

Expiry: any future date | CVC: any 3 digits

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Redux Toolkit, React Router v6, Framer Motion |
| Styling | Pure CSS custom design system with CSS variables |
| State | Redux Toolkit + redux-persist |
| Payments | Stripe.js + @stripe/react-stripe-js |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose ODM |
| Auth | JWT (access + refresh token rotation) |
| Email | Nodemailer |
| Images | Cloudinary |
| Deployment | Docker + Docker Compose + Nginx |
