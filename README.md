# DevPulse — Full-Stack Blog Application

## About
**DevPulse** is a complete, full-stack **Blog Application** built for the **Codomax Digital Solutions** internship assignment. It features a modern, responsive frontend (**HTML5**, **CSS3**, **Vanilla JavaScript**) paired with a robust **Node.js & Express.js REST API** backend backed by **MongoDB** data persistence, **bcryptjs** password security, and **JWT (JSON Web Token)** user authentication with private route protection.

---

## Key Features

### 🔐 Authentication & Protected Dashboard
- **JWT Token Authentication**: Issues signed JSON Web Tokens (`jsonwebtoken`) upon registration and login.
- **Protected Private Routes**: Unauthenticated users attempting to access `dashboard.html` or `create-blog.html` are automatically redirected to `login.html`.
- **User-Scoped Dashboard**: Restricts articles displayed on `dashboard.html` to only those created by the active logged-in author.
- **Dynamic Profile & Logout**: Navbar dynamically displays user profile information and a **Logout** button when logged in.

### 💻 Frontend Architecture
- **Custom Aesthetic Palette**: Styled with Deep Forest Teal (`#004741`) and Soft Warm Cream (`#F0EDE4`).
- **Responsive Architecture**: Mobile-first design covering 320px to 1440px+ viewports with zero horizontal scrolling.
- **Dedicated Article Detail Page (`blog-detail.html`)**: Dynamic single article view (`blog-detail.html?id=...`) with view counting, cover images, and tags.
- **Interactive Full CRUD Dashboard**: Real-time stat cards, responsive table/cards, search, status filtering, and blog edit/delete modals.

### ⚡ Backend REST API
- **Auth Routes**:
  - `POST /api/auth/register` — Registers new users with `bcryptjs` password hashing and issues JWT.
  - `POST /api/auth/login` — Verifies hashed credentials and returns JWT token.
- **Blog Routes**:
  - `POST /api/blogs` — Creates a new blog post.
  - `GET /api/blogs` — Retrieves all blogs (supports `?category=...`, `?search=...`, and `?status=...`).
  - `GET /api/blogs/:id` — Retrieves a single blog by ID and automatically increments view count.
  - `PUT /api/blogs/:id` — Updates an existing blog article.
  - `DELETE /api/blogs/:id` — Deletes a blog post from database.

---

## Technologies Used
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (Vanilla ES6+), LocalStorage fallback engine.
- **Backend**: Node.js, Express.js, CORS, `jsonwebtoken` middleware.
- **Database**: MongoDB (via Mongoose ODM) with JSON database fallback.
- **Security**: `bcryptjs` password hashing & JWT token validation.

---

## Pages Included
1. `index.html` — Homepage (Hero, Search/Filter, Featured Blogs Grid, Category Cards)
2. `login.html` — Login Page (Form validation, password toggle, JWT issuance)
3. `register.html` — Registration Page (Bcrypt registration, password confirmation)
4. `dashboard.html` — Protected Author Dashboard (Stats, User-scoped table, edit modal, delete modal)
5. `create-blog.html` — Protected Blog Editor (Character counter, cover image preview, publishing)
6. `blog-detail.html` — Individual Article Detail View (Full article text, author details, view counter)

---

## How to Run

### 1. Start the Express Backend Server
```bash
cd backend
npm install
npm start
```
The Express server will start on `http://localhost:5000`.

### 2. Open the Frontend
Open `index.html` directly in any web browser or use VS Code **Live Server**.

---

## Internship Details

- **Internship:** Codomax Digital Solutions  
- **Module:** Full-Stack Web Development  

---

## Repository Link

- **GitHub Repository:** https://github.com/pravxn-15/DevPulse.git
