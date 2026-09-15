🛒 E-Commerce Management System

A full-stack e-commerce web application built from scratch with Spring Boot (backend) and React (frontend), featuring complete customer shopping flows, JWT-based authentication, and a role-protected admin panel — fully tested and deployed to production.

🔗 Live Demo: ecommerce-management-system-one.vercel.app
🔗 Backend API: ecommerce-backend-3m5h.onrender.com

⚠️ The backend is hosted on Render's free tier, which spins down after inactivity. The first request after idle time may take up to ~50 seconds to respond.

📋 Table of Contents

Features

Tech Stack

Architecture

Engineering Highlights

Project Structure

Getting Started (Local Setup)

API Overview

Deployment

Screenshots

✨ Features

Customer-Facing

Authentication — Registration, JWT-based login, protected routes

Product Catalog — Search, filter (name/category/price range), sort, and pagination — all combinable in a single dynamic query

Product Details — Full product view with stock awareness

Cart — Add/update/remove items, automatic quantity merging for duplicate adds, live totals

Wishlist — Add/remove products, move directly to cart

Checkout — Address management (add/select), order placement from cart

Order History — View past orders, order details, cancel eligible orders (with automatic stock restoration)

Admin Panel (role-protected)

Category Management — Full CRUD

Product Management — Full CRUD with category assignment and stock control

Order Management — View all orders across all users, enforce valid status transitions (Placed → Processing → Shipped → Delivered, or Cancelled)

User Management — View all users, promote/demote roles (with safeguard against self-demotion)

Security

Stateless JWT authentication with a custom filter chain

Role-based route protection on both frontend (React) and backend (Spring Security)

CORS properly configured for cross-origin frontend/backend communication

Passwords hashed with BCrypt; write-only password serialization (never exposed in API responses)

Centralized exception handling — no raw stack traces or unhandled 500 errors reach the client

🛠 Tech Stack

Backend

Java 17, Spring Boot 3.5, Spring Security, Spring Data JPA (Hibernate)

MySQL

JWT (jjwt)

Maven

Frontend

React 19 (Vite)

Redux Toolkit (auth state)

React Router

Tailwind CSS v4

Axios

Infrastructure

Frontend hosting: Vercel

Backend hosting: Render (Docker)

Database: Railway (MySQL)

Version control: Git / GitHub

🏗 Architecture

┌─────────────────┐         ┌──────────────────┐        ┌─────────────────┐
│  React Frontend │  HTTPS  │  Spring Boot API   │  JDBC  │   MySQL (Railway) │
│    (Vercel)     ├────────▶│     (Render)       ├───────▶│                 │
└─────────────────┘         └──────────────────┘        └─────────────────┘
       │                              │
       │  JWT in Authorization        │  Spring Security filter chain
       │  header on every request     │  validates token before
       └──────────────────────────────┘  reaching controllers


Dynamic product filtering (search + category + price range + sort + pagination, all combinable) is implemented using Spring Data JPA Specifications, replacing an earlier design of six separate single-purpose endpoints with one flexible, composable query.

🔍 Engineering Highlights

A few real issues found and fixed during development and testing — included here because working through them was as much a part of building this project as the initial implementation:

Issue Root Cause Fix





Duplicate cart rows on repeat "Add to Cart"

No existing-item check before insert

Added findByUserAndProduct lookup; merges quantity into existing row

Business-rule violations (duplicate wishlist item, invalid order status transition, etc.) crashing with raw 500 errors

Plain RuntimeException with no exception handling

Centralized @RestControllerAdvice with a global fallback handler mapping to clean 4xx responses

Registration silently failing with rawPassword cannot be null

@JsonIgnore on the password field blocked incoming JSON too, not just outgoing

Switched to @JsonProperty(access = WRITE_ONLY) — readable on input, hidden on output

CORS blocking all frontend requests

No CORS configuration in the Spring Security filter chain

Added explicit CorsConfigurationSource bean, applied before other filters

Garbage/malformed JWTs crashing requests with 500

Unhandled exception inside the JWT filter itself (filters run before Spring's normal exception handling)

Wrapped token parsing in try/catch inside the filter

📁 Project Structure

E-Commerce-Management-System/
├── backend/backend/                 # Spring Boot application
│   ├── src/main/java/com/ecommerce/backend/
│   │   ├── config/                  # Security & CORS configuration
│   │   ├── controller/              # REST controllers
│   │   ├── dto/                     # Request/response DTOs
│   │   ├── entity/                  # JPA entities
│   │   ├── exception/               # Custom exceptions + global handler
│   │   ├── repository/              # Spring Data JPA repositories
│   │   ├── security/                # JWT filter, UserDetailsService
│   │   ├── service/                 # Business logic interfaces + impl
│   │   ├── specification/           # Dynamic query specifications
│   │   └── util/                    # JWT utility
│   └── Dockerfile
└── frontend/                        # React (Vite) application
    └── src/
        ├── api/                     # Axios instance with JWT interceptor
        ├── components/              # Shared UI (Navbar, etc.)
        ├── pages/                   # Route-level pages
        │   └── admin/                # Admin panel pages
        ├── redux/                   # Auth state (Redux Toolkit)
        └── routes/                  # ProtectedRoute / AdminRoute guards


🚀 Getting Started (Local Setup)

Prerequisites

Java 17+, Maven

Node.js + npm

MySQL running locally

Backend

cd backend/backend
# application.properties reads from environment variables with local defaults,
# so it connects to localhost:3306/ecommerce_db out of the box
./mvnw spring-boot:run


Runs on http://localhost:8081.

Frontend

cd frontend
npm install
npm run dev


Runs on http://localhost:5173. Create a .env file with VITE_API_URL=http://localhost:8081/api (falls back to this automatically if omitted).

🔌 API Overview

Resource Base Path Notes





Auth

/api/auth

Login

Users

/api/users

Register, admin user management

Products

/api/products

CRUD + /list (unified dynamic search/filter/sort/pagination)

Categories

/api/categories

CRUD

Cart

/api/cart

Add (auto-merges duplicates), update, remove, clear

Wishlist

/api/wishlist

Add, get, remove — fully tested including duplicate/invalid-input/auth edge cases

Addresses

/api/addresses

CRUD, scoped per user

Orders

/api/orders

Create (from cart), cancel, status transitions, per-user and admin-wide views

All protected endpoints require a Bearer JWT in the Authorization header, obtained from /api/auth/login.

☁️ Deployment

Layer Platform Notes





Frontend

Vercel

Auto-deploys on push to main; VITE_API_URL env var points to Render backend

Backend

Render (Docker)

Multi-stage Dockerfile (Maven build → JRE runtime); DB_URL/DB_USERNAME/DB_PASSWORD env vars point to Railway

Database

Railway (MySQL)

Public TCP proxy endpoint for external access from Render

📸 Screenshots

(Add screenshots of the storefront, product listing, cart, checkout, and admin panel here.)

📄 License

This project was built for educational/portfolio purposes.