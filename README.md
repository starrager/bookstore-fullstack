# 📚 BookStore

> Fullstack-интернет-магазин книг с авторизацией, корзиной, заказами, отзывами, избранным и административной панелью.

<p align="center">
  <a href="https://starrager-books.surge.sh">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20App-8B5CF6?style=for-the-badge" alt="Live Demo">
  </a>
  <a href="https://github.com/starrager/bookstore-fullstack">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat-square&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Vue.js-3-4FC08D?style=flat-square&logo=vue.js&logoColor=white">
  <img src="https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white">
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white">
  <img src="https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white">
  <img src="https://img.shields.io/badge/JWT-Authorization-000000?style=flat-square&logo=jsonwebtokens&logoColor=white">
  <img src="https://img.shields.io/badge/Zod-Validation-3068B7?style=flat-square&logo=zod&logoColor=white">
</p>

---

## 🌐 Demo

| **Frontend** | [https://starrager-books.surge.sh](https://starrager-books.surge.sh) |
|--------------|----------------------------------------------------------------------|
| **Backend API** | [https://bookstore-fullstack-6vy8.onrender.com](https://bookstore-fullstack-6vy8.onrender.com) |
| **Repository** | [https://github.com/starrager/bookstore-fullstack](https://github.com/starrager/bookstore-fullstack) |

---

## ✨ Features

### 🔐 Authentication
- User registration & login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Role-based access control
- Profile management
- Password changing

### 📚 Book Catalog
- Paginated catalog
- Search by title and author
- Category filtering
- Price filtering
- Sorting by price, rating and newest
- Book details
- Stock tracking

### 🛒 Shopping Cart
- Add/remove books
- Change quantity
- Automatic total calculation
- Cart persistence
- Clear cart

### 📦 Orders
- Checkout flow
- Delivery information
- Order history
- Order status tracking
- Order cancellation

**Supported statuses:** `pending` · `paid` · `shipped` · `delivered` · `cancelled`

### ⭐ Reviews
- 1–5 star rating system
- Text reviews
- Real-time rating updates
- Only authenticated users can review

### ❤️ Favorites
- Add/remove books
- Personal wishlist
- Quick access

### 👤 Profile
- View and edit profile
- Change password
- Order history

### 🛠️ Admin Panel
- **Book management** — CRUD operations
- **Admin stats** — users, books, orders, revenue, top books

---

## 🧱 Architecture

### Backend

```plaintext
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, validation, logging
│   ├── validators/      # Zod validation schemas
│   ├── scripts/         # Utils & seeds
│   ├── server.ts        # Entry point
│   └── logger.ts        # Winston logging
├── prisma/
│   └── schema.prisma    # Database models
├── logs/                # App logs
└── package.json
Frontend
plaintext
frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── views/           # Pages
│   ├── stores/          # Pinia stores
│   ├── api/             # API client
│   ├── router/          # Vue Router
│   ├── styles/          # Global styles
│   ├── App.vue
│   └── main.js
├── public/
│   └── covers/          # Book cover images
└── package.json
🗄️ Database Schema
Table	Fields
users	id, username, email, password, role
books	id, title, author, price, stock, description, coverId, categoryId
categories	id, name
cart_items	id, cartId, bookId, quantity
orders	id, userId, total, status, address, phone
order_items	id, orderId, bookId, quantity, price
reviews	id, userId, bookId, rating, text
favorites	id, userId, bookId
🚀 Local Development
1. Backend
bash
cd backend
npm install
npm run dev
Server: http://localhost:5178

2. Frontend
bash
cd frontend
npm install
npm run dev
App: http://localhost:5173

🛠️ Tech Stack
Backend
Technology	Purpose
Node.js + Express	Runtime & framework
TypeScript	Type safety
Prisma	ORM
SQLite	Database
JWT	Authentication
bcrypt	Password hashing
Zod	Validation
Winston	Logging
Frontend
Technology	Purpose
Vue 3	UI framework
Pinia	State management
Vue Router	Routing
Axios	HTTP client
Bootstrap 5	Styling
🚀 Deployment
Service	URL
Backend	Render → https://bookstore-fullstack-6vy8.onrender.com
Frontend	Surge → https://starrager-books.surge.sh
🤝 Author
starrager

https://img.shields.io/badge/GitHub-starrager-181717?style=for-the-badge&logo=github
https://img.shields.io/badge/Telegram-@starragerofshit-26A5E4?style=for-the-badge&logo=telegram

📄 License
MIT © 2026 starrager
