# 🛒 E-Commerce Backend API

A production-style e-commerce REST API built with Node.js, Express, and MongoDB.  
It supports authentication, product management, cart system, order processing, Paystack payments, and admin operations.

This project is designed with a modular feature-based architecture and includes security, logging, email notifications, and inventory management.

---

# 🚀 Features

## 🔐 Authentication & Security
- User registration and login
- JWT authentication (access & refresh tokens)
- Password reset via email
- Role-based access control (Admin / Customer)
- Secure password hashing
- Rate limiting & security middleware

---

## 👤 User Management
- User profile management
- Role-based permissions
- Admin user controls

---

## 📦 Product Management
- Create, update, delete products (Admin only)
- Product image upload support
- Inventory stock tracking
- Product search, filtering, and pagination

---

## 🛒 Cart System
- Add/remove items from cart
- Update item quantity
- Persistent cart per user

---

## 📑 Order System
- Place orders from cart
- Order status tracking:
  - Pending
  - Processing
  - Shipped
  - Delivered
- Order history per user

---

## 💳 Payments
- Paystack payment integration
- Payment verification flow
- Order confirmation after successful payment

---

## 📧 Notifications
- Email notifications for:
  - Account verification / password reset
  - Order confirmation
  - Payment success

---

## 📊 Admin Features
- Product management dashboard endpoints
- Order management
- Inventory control
- User management endpoints

---

## 📄 Logging & Monitoring
- Application logging for requests and errors
- Centralized error handling system

---

# 🏗️ Architecture

This project follows a **feature-based modular architecture**:

src/
modules/
auth/
users/
products/
orders/
cart/
config/
middlewares/
utils/
services/
app.ts


### Design Approach:
- Each feature is isolated into modules
- Business logic separated from request handling
- Centralized error handling middleware
- Clean and scalable folder structure

---

# 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Paystack API
- Nodemailer (Email service)
- Multer (File uploads)
- Winston (Logging)
- Express Rate Limit (Security)

---

# ⚙️ Setup Instructions

## 1. Clone repository
```bash
git clone https://github.com/your-username/ecommerce-backend.git
cd ecommerce-backend