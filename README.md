# 📚 BookStore

> Fullstack-интернет-магазин книг с авторизацией, корзиной, заказами, отзывами, избранным и административной панелью.

<p align="center">
  <a href="https://starrager-books.surge.sh">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20App-8B5CF6?style=for-the-badge" alt="Live Demo">
  </a>
  <a href="https://github.com/starrager">
    <img src="https://img.shields.io/badge/GitHub-starrager-181717?style=for-the-badge&logo=github" alt="GitHub">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat-square&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Vue.js-3-4FC08D?style=flat-square&logo=vue.js&logoColor=white">
  <img src="https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white">
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white">
  <img src="https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white">
</p>

---

## 🌐 Demo

**Frontend**

👉 https://starrager-books.surge.sh

**Backend API**

👉 https://bookstore-fullstack-6vy8.onrender.com

Приложение полностью доступно для тестирования в браузере.

---

## ✨ Features

### 🔐 Authentication

* User registration & login
* JWT-based authentication
* Password hashing with bcrypt
* Protected routes
* Role-based access control
* Profile management
* Password changing

### 📚 Book Catalog

* Paginated catalog
* Search by title and author
* Category filtering
* Price filtering
* Sorting by price, rating and newest
* Book details
* Stock tracking

### 🛒 Shopping Cart

* Add/remove books
* Change quantity
* Automatic total calculation
* Cart persistence
* Clear cart

### 📦 Orders

* Checkout flow
* Delivery information
* Order history
* Order status tracking
* Order cancellation

Supported statuses:

`pending` · `paid` · `shipped` · `delivered` · `cancelled`

### ⭐ Reviews

* 1–5 star
