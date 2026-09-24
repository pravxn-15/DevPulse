# ⚡ DevPulse — Full-Stack Blog & Technical Publishing Platform

[![Node.js](https://img.shields.io/badge/Node.js-18.x%20%7C%2020.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%20ODM-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20HTML5%20%2F%20CSS3%20%2F%20ES6+-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/)
[![Status](https://img.shields.io/badge/Deployment-Ready-success?style=for-the-badge)](#-deployment-guide)

> **DevPulse** is a modern, high-performance Full-Stack Web Application designed for developers, technical writers, and content creators. Built with a pristine Vanilla HTML5/CSS3/JavaScript frontend and an asynchronous Express & MongoDB REST API, DevPulse delivers a frictionless experience for writing, reading, managing, and discovering technical articles.

---

## 🌟 Core Features & Capabilities

### 🔐 1. Authentication & Custom Profile Engine
- **JWT-Secured Sessions**: Issue and verify JSON Web Tokens (`jsonwebtoken`) with `bcryptjs` password encryption.
- **Gender-Based Default Avatars**: Automatically assigns customized default profile images upon registration (`male.jpg` / `female.jpg` / other).
- **Interactive Avatar Editor**: Update author profile pictures directly from the Dashboard via:
  - Presets (👨 Male Avatar / 👩 Female Avatar)
  - Device File Upload (Instant FileReader Base64 conversion)
  - Custom Image URL
- **Dynamic Navbar User Menu**: Live profile chip, personalized welcome badges, and single-click session clearance.
- **Route Guarding**: Restricts unauthenticated access to author-specific endpoints and dashboards.

### 📝 2. Full-Featured Blog Publishing & CRUD Engine
- **Create & Publish**: Rich article editor with real-time character counters, featured image previews, tags, and category taxonomies.
- **Dynamic Clickable Featured Hero**: Automatically showcases the latest published article on the homepage hero banner with direct 1-click navigation.
- **Real-Time Article Detail View (`blog-detail.html`)**: Dynamic URL routing (`?id=...`), reading time calculation, view counter incrementation, tag badges, and author bios.
- **Search & Multi-Category Filtering**: Instant client-side & server-side filtering across Technology, Web Development, Programming, Career, Design, and Education.

### 📊 3. Author Dashboard & Analytics
- **User-Scoped Content Filter**: Authors see and manage strictly their own articles.
- **Live Metrics**: Overview cards calculating Total Articles, Published Posts, Drafts, and Total Views.
- **In-Place Article Editor Modal**: Edit titles, categories, descriptions, content, and publishing status without leaving the dashboard.
- **Safe Deletion Guard**: Modal confirmation safeguarding against accidental article deletion.

### 🎨 4. Design & Mobile Responsiveness
- **Curated Palette**: Deep Teal (`#004741`), Warm Soft Sand (`#F0EDE4`), and crisp accent highlights.
- **100% Fluid & Mobile Responsive**: Tailored viewports from 320px smartphones to 4K desktop screens with native CSS Grid, Flexbox, and zero heavy UI dependencies.
- **Global Toast Alert System**: Animated visual notifications for logins, creations, updates, and validations.

---

## 🏗️ Architecture & Tech Stack

```
                                    ┌────────────────────────┐
                                    │    Client Browser      │
                                    │ (HTML5, CSS3, ES6+ JS) │
                                    └───────────┬────────────┘
                                                │
                               HTTP Requests    │  REST API Calls
                               (JSON & Assets)  ▼  (JWT Headers)
                                    ┌────────────────────────┐
                                    │   Express REST API     │
                                    │      (Node.js)         │
                                    └───────────┬────────────┘
                                                │
                                    ┌───────────┴────────────┐
                                    ▼                        ▼
                        ┌──────────────────────┐  ┌──────────────────────┐
                        │   MongoDB Database   │  │ JSON DB Engine (Sync)│
                        │    (Mongoose ODM)    │  │  (Fallback Storage)  │
                        └──────────────────────┘  └──────────────────────┘
```

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Vanilla HTML5, CSS3 (Custom Variables, Flexbox, Grid), Modern JavaScript (ES6+ Async/Await, Fetch API) |
| **Backend** | Node.js, Express.js REST Framework, CORS, Dotenv, JWT Authentication |
| **Database** | MongoDB (Mongoose Schema Validation) + Resilient JSON File Persistence fallback |
| **Security** | Bcrypt password salting (10 rounds), JSON Web Tokens (7-day validity), CORS protection |

---

## 📡 REST API Reference

### 🔐 Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user with chosen gender & avatar | `{ name, email, password, gender, avatar }` |
| `POST` | `/api/auth/login` | Authenticate user and receive signed JWT | `{ email, password }` |
| `PUT` | `/api/auth/profile` | Update user profile, name, or custom avatar | `{ email, name, avatar, gender }` |

### 📝 Blog Endpoints (`/api/blogs`)
| Method | Endpoint | Description | Query / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/blogs` | Retrieve all blog posts (supports filtering) | `?category=...&search=...&status=...` |
| `GET` | `/api/blogs/:id` | Get single article details and increment views | URL param `:id` |
| `POST` | `/api/blogs` | Create a new blog post | `{ title, category, description, content, author, authorAvatar, image, tags, status }` |
| `PUT` | `/api/blogs/:id` | Update an existing blog post | `{ title, category, description, content, status }` |
| `DELETE` | `/api/blogs/:id` | Remove a blog post from database | URL param `:id` |

---

## 🚀 Getting Started (Local Setup)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [Git](https://git-scm.com/)
- (Optional) MongoDB local server or MongoDB Atlas connection URI

### 2. Clone Repository
```bash
git clone https://github.com/pravxn-15/DevPulse.git
cd DevPulse
```

### 3. Install & Start Backend Server
```bash
cd backend
npm install
npm start
```
The Express REST API server will launch at:
```
⚡ DevPulse Express API Server running on port 5000
🌐 Base API URL: http://localhost:5000/api
```

### 4. Launch Frontend
Open `index.html` in your favorite web browser or start a local static server:
```bash
# Using VS Code Live Server extension OR Python HTTP server:
python -m http.server 3000
```

---

## ☁️ Deployment Guide

### 🅰️ Deploy on Vercel (Recommended for Full Stack)
1. Fork or push this repository to your **GitHub** account.
2. Go to [Vercel.com](https://vercel.com/) and click **"Add New Project"**.
3. Import the `DevPulse` repository.
4. The project includes pre-configured `vercel.json` routing. Click **Deploy**.
5. Your full-stack application will be live with free global CDN!

### 🅱️ Deploy on Render (Backend) + Netlify (Frontend)
1. **Render Backend**:
   - Create a new **Web Service** on [Render.com](https://render.com/).
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Set environment variables: `PORT=5000`, `JWT_SECRET=your_secret_key`, `MONGO_URI=your_mongodb_uri`.
2. **Netlify Frontend**:
   - Create a new site on [Netlify.com](https://www.netlify.com/) linked to your repository.
   - Publish Directory: `.`
   - In `js/script.js`, point `API_URL` to your live Render backend URL.

---

## 📂 Project Directory Structure

```
DevPulse/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & fallback setup
│   ├── controllers/
│   │   ├── authController.js     # User registration, login & profile update
│   │   └── blogController.js     # Full CRUD controllers for articles
│   ├── data/
│   │   ├── blogs.json            # JSON Database fallback for articles
│   │   └── users.json            # JSON Database fallback for users
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT route protection middleware
│   ├── models/
│   │   ├── Blog.js               # Mongoose Blog schema & validation
│   │   └── User.js               # Mongoose User schema & validation
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   └── blogRoutes.js         # /api/blogs routes
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Main Express server entrypoint
├── css/
│   └── style.css                 # Master responsive stylesheet
├── js/
│   └── script.js                 # Master frontend client script
├── index.html                    # Homepage & dynamic featured article
├── blog-detail.html              # Dedicated full article reader
├── create-blog.html              # Article authoring & publishing editor
├── dashboard.html                # User-scoped analytics & CRUD dashboard
├── login.html                    # User sign-in interface
├── register.html                 # User account creation with gender selection
├── male.jpg                      # Default male author avatar
├── female.jpg                    # Default female author avatar
├── vercel.json                   # Vercel deployment configuration
├── netlify.toml                  # Netlify deployment configuration
└── README.md                     # Documentation
```

---

## 👥 Authors & Acknowledgments

- **Developer:** Praveen Kumar
- **Repository:** [https://github.com/pravxn-15/DevPulse](https://github.com/pravxn-15/DevPulse)
- **Organization:** Codomax Digital Solutions Internship Submission

---
*Developed with ❤️ using Vanilla Web Technologies, Express.js & MongoDB.*
