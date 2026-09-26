/**
 * Blog Application - Master JavaScript File
 * Complete REST API Integration with Full CRUD, JWT Auth, Route Protection & Profile Management:
 * - Route Guards: Protects dashboard.html & create-blog.html
 * - User-scoped Dashboard: Filters blogs created by the logged-in user
 * - Profile & Logout: Dynamic navbar user menu & session clear
 */

// Dynamic API URL: Uses localhost for local dev, and Render backend when deployed
const isLocalEnv = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1';

const API_URL = isLocalEnv 
  ? 'http://localhost:5000/api' 
  : 'https://devpulse-backend-nlm0.onrender.com/api';

const INITIAL_BLOGS = [
  {
    id: "blog_1",
    title: "Mastering Modern CSS Grid & Flexbox in 2026",
    category: "Web Development",
    description: "A comprehensive guide to creating fluid, responsive, and accessible web layouts without relying on bulky CSS frameworks.",
    content: "Building web layouts used to be a frustrating experience with CSS floats and clearfix hacks. Modern CSS has evolved tremendously.\n\nFlexbox is perfect for one-dimensional layouts, like navigation bars, button groups, and aligned card items. CSS Grid excels at complex two-dimensional layouts like main page structures and card grids.",
    author: "Alex Morgan",
    authorEmail: "alex.morgan@example.com",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    date: "Sep 10, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    status: "Published",
    views: 1420,
    tags: ["CSS", "WebDev", "Responsive"]
  },
  {
    id: "blog_2",
    title: "10 Tips for Landing Your First Software Engineering Internship",
    category: "Career",
    description: "Essential advice on crafting your resume, building portfolio projects, and acing frontend coding interviews.",
    content: "Landing your first software engineering internship is a significant milestone. Build real projects, practice clean code, master Git & GitHub, and practice core CS fundamentals.",
    author: "Sarah Jenkins",
    authorEmail: "sarah@example.com",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    date: "Sep 08, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    status: "Published",
    views: 3250,
    tags: ["Career", "Internship", "Tips"]
  },
  {
    id: "blog_3",
    title: "The Future of Web Development: What to Expect in 2026 and Beyond",
    category: "Technology",
    description: "Exploring artificial intelligence tools, WebAssembly performance gains, and new browser standards reshaping the web.",
    content: "Web development is advancing faster than ever with AI tools, WebAssembly, and browser enhancements.",
    author: "David Chen",
    authorEmail: "david@example.com",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    date: "Sep 05, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    status: "Published",
    views: 2180,
    tags: ["Tech", "Future", "AI"]
  }
];

// Helper to get active logged-in user
function getLoggedInUser() {
  const userStr = localStorage.getItem('blog_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
}

// Route Protection Guard
function checkRouteProtection() {
  const currentPath = window.location.pathname.split('/').pop();
  const protectedPages = ['dashboard.html', 'create-blog.html'];

  if (protectedPages.includes(currentPath)) {
    const user = getLoggedInUser();
    if (!user) {
      alert('Access Restricted: Please sign in to view your dashboard or create a blog.');
      window.location.href = 'login.html';
    }
  }
}

// Async helper to fetch blogs from Express API or fallback to LocalStorage
async function fetchBlogsFromApi() {
  try {
    const res = await fetch(`${API_URL}/blogs`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        localStorage.setItem('blog_app_posts', JSON.stringify(json.data));
        return json.data;
      }
    }
  } catch (err) {
    console.log('Backend API offline, using LocalStorage fallback.');
  }

  const data = localStorage.getItem('blog_app_posts');
  if (!data) {
    localStorage.setItem('blog_app_posts', JSON.stringify(INITIAL_BLOGS));
    return INITIAL_BLOGS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_BLOGS;
  }
}

function getStoredBlogsSync() {
  const data = localStorage.getItem('blog_app_posts');
  return data ? JSON.parse(data) : INITIAL_BLOGS;
}

function saveStoredBlogsSync(blogs) {
  localStorage.setItem('blog_app_posts', JSON.stringify(blogs));
}

// Global Toast Notification System
function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '❌';
  if (type === 'warning') icon = '⚠️';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

// Dynamic Navigation Bar & User Profile Logout Handler
function initNavigation() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  let overlay = document.querySelector('.mobile-overlay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);
  }

  if (toggleBtn && navMenu) {
    const toggleMenu = () => {
      navMenu.classList.toggle('active');
      overlay.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
    };

    toggleBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
  }

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Dynamic Profile / Logout in Navbar Actions
  const user = getLoggedInUser();
  const navActions = document.querySelector('.nav-actions');

  if (navActions && user) {
    const userAvatar = user.avatar || (user.gender === 'Female' ? 'female.jpg' : 'male.jpg');
    navActions.innerHTML = `
      <span class="nav-user-chip">
        <img src="${userAvatar}" alt="${user.name}" class="nav-avatar-img">
        <span>${user.name}</span>
      </span>
      <a href="create-blog.html" class="btn btn-primary btn-sm">+ Write Post</a>
      <button class="btn btn-outline btn-sm" id="nav-logout-btn">Logout</button>
      <button class="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false">☰</button>
    `;

    const logoutBtn = document.getElementById('nav-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('blog_user');
        localStorage.removeItem('blog_token');
        showToast('Logged out successfully', 'info');
        setTimeout(() => window.location.href = 'login.html', 1000);
      });
    }
  }
}

// Home Page Logic (index.html)
async function initHomePage() {
  const blogContainer = document.getElementById('blog-cards-grid');
  if (!blogContainer) return;

  const blogs = (await fetchBlogsFromApi()).filter(b => b.status === 'Published');
  let activeCategory = 'All';
  let searchQuery = '';

  // Dynamically populate Hero Featured Post from real published articles
  if (blogs.length > 0) {
    const featuredBlog = blogs[0];
    const featuredId = featuredBlog._id || featuredBlog.id;
    const featuredLink = document.getElementById('hero-featured-link');
    const categoryElem = document.getElementById('hero-card-category');
    const readTimeElem = document.getElementById('hero-card-readtime');
    const titleElem = document.getElementById('hero-card-title');
    const descElem = document.getElementById('hero-card-description');
    const authorElem = document.getElementById('hero-card-author');
    const dateElem = document.getElementById('hero-card-date');
    const avatarElem = document.getElementById('hero-card-avatar');

    if (featuredLink) featuredLink.href = `blog-detail.html?id=${featuredId}`;
    if (categoryElem) categoryElem.textContent = featuredBlog.category || 'Featured Post';
    if (readTimeElem) readTimeElem.textContent = featuredBlog.readTime || '5 min read';
    if (titleElem) titleElem.textContent = featuredBlog.title;
    if (descElem) descElem.textContent = featuredBlog.description;
    if (authorElem) authorElem.textContent = featuredBlog.author || 'DevPulse Author';
    if (dateElem) dateElem.textContent = featuredBlog.date || 'Published Article';
    if (avatarElem) {
      avatarElem.src = featuredBlog.authorAvatar || 'male.jpg';
      avatarElem.alt = featuredBlog.author || 'Author';
    }
  }

  function renderBlogs() {
    blogContainer.innerHTML = '';

    const filtered = blogs.filter(blog => {
      const matchesCategory = (activeCategory === 'All') || (blog.category.toLowerCase() === activeCategory.toLowerCase());
      const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      blogContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <h3 style="margin-bottom: 0.5rem; color: var(--text-muted);">No blogs found</h3>
          <p style="color: var(--text-light);">Try adjusting your search query or selected category.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(blog => {
      const blogId = blog._id || blog.id;
      const card = document.createElement('article');
      card.className = 'blog-card';
      card.innerHTML = `
        <div class="blog-card-img-wrap">
          <img src="${blog.image}" alt="${blog.title}" class="blog-card-img" loading="lazy" onError="this.src='https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'">
          <span class="blog-card-category">${blog.category}</span>
        </div>
        <div class="blog-card-body">
          <h3 class="blog-card-title">
            <a href="blog-detail.html?id=${blogId}">${blog.title}</a>
          </h3>
          <p class="blog-card-excerpt">${blog.description}</p>
          <div class="blog-card-footer">
            <div class="blog-author">
              <img src="${blog.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}" alt="${blog.author}" class="blog-author-img">
              <div>
                <span class="blog-author-name">${blog.author || 'Alex Morgan'}</span>
                <div style="font-size: 0.75rem; color: var(--text-light);">${blog.date}</div>
              </div>
            </div>
            <a href="blog-detail.html?id=${blogId}" class="btn btn-outline btn-sm">Read Post</a>
          </div>
        </div>
      `;
      blogContainer.appendChild(card);
    });
  }

  const categoryPills = document.querySelectorAll('.category-pill');
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category');
      renderBlogs();
    });
  });

  const searchInput = document.getElementById('home-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderBlogs();
    });
  }

  renderBlogs();
}

// Login Page Logic with JWT Token Storage
function initLoginPage() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  const togglePassBtn = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');

  if (togglePassBtn && passwordInput) {
    togglePassBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      togglePassBtn.textContent = isPassword ? 'Hide' : 'Show';
    });
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value.trim();
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      emailError.textContent = 'Please enter a valid email address.';
      emailError.classList.add('active');
      isValid = false;
    } else {
      emailError.classList.remove('active');
    }

    if (!password || password.length < 6) {
      passwordError.textContent = 'Password must be at least 6 characters.';
      passwordError.classList.add('active');
      isValid = false;
    } else {
      passwordError.classList.remove('active');
    }

    if (!isValid) return;

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Login successful! Redirecting...', 'success');
        localStorage.setItem('blog_token', data.token);
        localStorage.setItem('blog_user', JSON.stringify(data.user));
        setTimeout(() => window.location.href = 'dashboard.html', 1200);
        return;
      } else {
        showToast(data.message || 'Login failed', 'error');
        return;
      }
    } catch (err) {
      showToast('Unable to connect to server. If on Render, please wait ~30s for the server to wake up and try again.', 'error');
    }
  });
}

// Registration Page Logic with Gender Selection & JWT Token Storage
function initRegisterPage() {
  const registerForm = document.getElementById('register-form');
  if (!registerForm) return;

  // Gender selection card click handlers
  const genderCards = document.querySelectorAll('.gender-card');
  genderCards.forEach(card => {
    card.addEventListener('click', () => {
      genderCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const terms = document.getElementById('terms').checked;
    const selectedGenderRadio = document.querySelector('input[name="gender"]:checked');
    const gender = selectedGenderRadio ? selectedGenderRadio.value : 'Male';
    const defaultAvatar = gender === 'Female' ? 'female.jpg' : 'male.jpg';

    const nameErr = document.getElementById('name-error');
    const emailErr = document.getElementById('email-error');
    const passErr = document.getElementById('password-error');
    const confirmErr = document.getElementById('confirm-error');
    const termsErr = document.getElementById('terms-error');

    let isValid = true;
    if (!fullName || fullName.length < 2) {
      nameErr.textContent = 'Please enter your full name.';
      nameErr.classList.add('active');
      isValid = false;
    } else {
      nameErr.classList.remove('active');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      emailErr.textContent = 'Please enter a valid email address.';
      emailErr.classList.add('active');
      isValid = false;
    } else {
      emailErr.classList.remove('active');
    }

    if (!password || password.length < 6) {
      passErr.textContent = 'Password must be at least 6 characters.';
      passErr.classList.add('active');
      isValid = false;
    } else {
      passErr.classList.remove('active');
    }

    if (confirmPassword !== password) {
      confirmErr.textContent = 'Passwords do not match.';
      confirmErr.classList.add('active');
      isValid = false;
    } else {
      confirmErr.classList.remove('active');
    }

    if (!terms) {
      termsErr.textContent = 'You must accept the Terms & Conditions.';
      termsErr.classList.add('active');
      isValid = false;
    } else {
      termsErr.classList.remove('active');
    }

    if (!isValid) return;

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          gender,
          avatar: defaultAvatar
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Registration successful! Redirecting to login...', 'success');
        if (data.token) localStorage.setItem('blog_token', data.token);
        if (data.user) localStorage.setItem('blog_user', JSON.stringify(data.user));
        setTimeout(() => window.location.href = 'login.html', 1200);
      } else {
        showToast(data.message || 'Registration failed', 'error');
      }
    } catch (err) {
      showToast('Unable to connect to registration server. Please wait a moment and try again.', 'error');
    }
  });
}

// User-Scoped Dashboard Logic & Profile Management
async function initDashboardPage() {
  const tableBody = document.getElementById('dashboard-table-body');
  const mobileCardsContainer = document.getElementById('dashboard-mobile-cards');
  if (!tableBody && !mobileCardsContainer) return;

  let currentUser = getLoggedInUser();

  // Helper to refresh Dashboard User Header UI
  const updateDashboardProfileUI = (user) => {
    if (!user) return;
    const welcomeElem = document.getElementById('dashboard-user-name');
    const emailElem = document.getElementById('dashboard-user-email');
    const avatarElem = document.getElementById('dashboard-user-avatar');

    if (welcomeElem) welcomeElem.textContent = `Welcome back, ${user.name} 👋`;
    if (emailElem) emailElem.textContent = user.email || 'author@devpulse.com';
    const avatarSrc = user.avatar || (user.gender === 'Female' ? 'female.jpg' : 'male.jpg');
    if (avatarElem) avatarElem.src = avatarSrc;
  };

  if (currentUser) {
    updateDashboardProfileUI(currentUser);
  }

  // Profile Picture Change Modal Implementation
  function openChangeAvatarModal() {
    let modal = document.getElementById('change-avatar-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'change-avatar-modal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    const user = getLoggedInUser() || { name: 'Author', gender: 'Male', avatar: 'male.jpg' };
    let selectedAvatar = user.avatar || (user.gender === 'Female' ? 'female.jpg' : 'male.jpg');

    modal.innerHTML = `
      <div class="modal-box">
        <div class="modal-header">
          <h3>Change Profile Picture</h3>
          <button class="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="modal-avatar-preview-wrap">
            <img src="${selectedAvatar}" alt="Selected Avatar Preview" id="avatar-modal-preview" class="modal-avatar-preview">
            <span style="font-size: 0.85rem; color: var(--text-muted);">Current Preview</span>
          </div>

          <div class="form-group">
            <label class="form-label">Choose from Gender Preset Avatars:</label>
            <div class="avatar-preset-grid">
              <div class="avatar-preset-card ${selectedAvatar === 'male.jpg' ? 'active' : ''}" data-avatar="male.jpg">
                <img src="male.jpg" alt="Male Avatar" class="avatar-preset-img">
                <span style="font-size: 0.8rem; font-weight: 600;">👨 Male</span>
              </div>
              <div class="avatar-preset-card ${selectedAvatar === 'female.jpg' ? 'active' : ''}" data-avatar="female.jpg">
                <img src="female.jpg" alt="Female Avatar" class="avatar-preset-img">
                <span style="font-size: 0.8rem; font-weight: 600;">👩 Female</span>
              </div>
            </div>
          </div>

          <div class="form-group" style="margin-top: 1.25rem;">
            <label class="form-label">Or Upload Your Own Photo (from device):</label>
            <input type="file" id="avatar-file-input" class="form-input" accept="image/*">
          </div>

          <div class="form-group">
            <label class="form-label">Or Enter Custom Image URL:</label>
            <input type="url" id="avatar-url-input" class="form-input" placeholder="https://example.com/my-photo.jpg">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary cancel-avatar-modal">Cancel</button>
          <button class="btn btn-primary" id="save-avatar-btn">Save Profile Picture</button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    const closeModal = () => modal.classList.remove('active');

    modal.querySelectorAll('.modal-close-btn, .cancel-avatar-modal').forEach(b => b.addEventListener('click', closeModal));

    const previewImg = modal.querySelector('#avatar-modal-preview');
    const presetCards = modal.querySelectorAll('.avatar-preset-card');
    const fileInput = modal.querySelector('#avatar-file-input');
    const urlInput = modal.querySelector('#avatar-url-input');

    presetCards.forEach(card => {
      card.addEventListener('click', () => {
        presetCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedAvatar = card.getAttribute('data-avatar');
        previewImg.src = selectedAvatar;
        if (urlInput) urlInput.value = '';
      });
    });

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (uploadEvent) => {
            selectedAvatar = uploadEvent.target.result;
            previewImg.src = selectedAvatar;
            presetCards.forEach(c => c.classList.remove('active'));
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (urlInput) {
      urlInput.addEventListener('input', () => {
        const val = urlInput.value.trim();
        if (val) {
          selectedAvatar = val;
          previewImg.src = selectedAvatar;
          presetCards.forEach(c => c.classList.remove('active'));
        }
      });
    }

    const saveBtn = modal.querySelector('#save-avatar-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        const token = localStorage.getItem('blog_token');
        const activeUser = getLoggedInUser() || user;
        const updatedUser = { ...activeUser, avatar: selectedAvatar };

        try {
          const res = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : ''
            },
            body: JSON.stringify({ email: activeUser.email, avatar: selectedAvatar })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            localStorage.setItem('blog_user', JSON.stringify(data.user));
            if (data.token) localStorage.setItem('blog_token', data.token);
          } else {
            localStorage.setItem('blog_user', JSON.stringify(updatedUser));
          }
        } catch (err) {
          localStorage.setItem('blog_user', JSON.stringify(updatedUser));
        }

        updateDashboardProfileUI(getLoggedInUser());
        initNavigation();
        showToast('Profile picture updated successfully!', 'success');
        closeModal();
      });
    }
  }

  // Bind change avatar triggers
  const changeAvatarTrigger = document.getElementById('change-avatar-trigger');
  const btnChangeAvatar = document.getElementById('btn-change-avatar');
  if (changeAvatarTrigger) changeAvatarTrigger.addEventListener('click', openChangeAvatarModal);
  if (btnChangeAvatar) btnChangeAvatar.addEventListener('click', openChangeAvatarModal);

  let allBlogs = await fetchBlogsFromApi();
  // Filter blogs created by or associated with logged-in user
  let blogs = allBlogs;
  if (currentUser) {
    blogs = allBlogs.filter(b =>
      !b.authorEmail ||
      b.authorEmail.toLowerCase() === currentUser.email.toLowerCase() ||
      b.author.toLowerCase() === currentUser.name.toLowerCase()
    );
  }

  let blogToDeleteId = null;

  function updateStats() {
    const totalCount = blogs.length;
    const publishedCount = blogs.filter(b => b.status === 'Published').length;
    const draftCount = blogs.filter(b => b.status === 'Draft').length;
    const totalViews = blogs.reduce((acc, curr) => acc + (curr.views || 0), 0);

    const totalElem = document.getElementById('stat-total');
    const pubElem = document.getElementById('stat-published');
    const draftElem = document.getElementById('stat-drafts');
    const viewElem = document.getElementById('stat-views');

    if (totalElem) totalElem.textContent = totalCount;
    if (pubElem) pubElem.textContent = publishedCount;
    if (draftElem) draftElem.textContent = draftCount;
    if (viewElem) viewElem.textContent = totalViews.toLocaleString();
  }

  function renderDashboardItems() {
    const searchQuery = (document.getElementById('dashboard-search-input')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('dashboard-status-filter')?.value || 'All';

    const filtered = blogs.filter(b => {
      const matchSearch = b.title.toLowerCase().includes(searchQuery) || b.category.toLowerCase().includes(searchQuery);
      const matchStatus = statusFilter === 'All' || b.status === statusFilter;
      return matchSearch && matchStatus;
    });

    if (tableBody) {
      tableBody.innerHTML = '';
      if (filtered.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
              No articles match your dashboard filter criteria.
            </td>
          </tr>
        `;
      } else {
        filtered.forEach(blog => {
          const blogId = blog._id || blog.id;
          const tr = document.createElement('tr');
          const isPublished = blog.status === 'Published';
          tr.innerHTML = `
            <td>
              <a href="blog-detail.html?id=${blogId}" class="table-blog-title">${blog.title}</a>
            </td>
            <td><span class="hero-card-tag" style="font-size: 0.75rem;">${blog.category}</span></td>
            <td>
              <span class="status-badge ${isPublished ? 'status-published' : 'status-draft'}">
                ${isPublished ? '● Published' : '○ Draft'}
              </span>
            </td>
            <td>${blog.date}</td>
            <td>${blog.views ? blog.views.toLocaleString() : 0}</td>
            <td>
              <div class="action-buttons">
                <a href="blog-detail.html?id=${blogId}" class="btn-icon" title="View Blog">👁️</a>
                <button class="btn-icon edit-blog-btn" data-id="${blogId}" title="Edit Blog">✏️</button>
                <button class="btn-icon delete-btn delete-blog-trigger" data-id="${blogId}" title="Delete Blog">🗑️</button>
              </div>
            </td>
          `;
          tableBody.appendChild(tr);
        });
      }
    }

    if (mobileCardsContainer) {
      mobileCardsContainer.innerHTML = '';
      if (filtered.length === 0) {
        mobileCardsContainer.innerHTML = `
          <div style="text-align: center; padding: 2rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-color); color: var(--text-muted);">
            No articles found.
          </div>
        `;
      } else {
        filtered.forEach(blog => {
          const blogId = blog._id || blog.id;
          const card = document.createElement('div');
          card.className = 'dashboard-mobile-card';
          const isPublished = blog.status === 'Published';
          card.innerHTML = `
            <div class="dashboard-mobile-card-header">
              <span class="hero-card-tag">${blog.category}</span>
              <span class="status-badge ${isPublished ? 'status-published' : 'status-draft'}">
                ${isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            <h4 class="dashboard-mobile-card-title">${blog.title}</h4>
            <div class="dashboard-mobile-card-meta">
              <span>📅 ${blog.date}</span>
              <span>👁️ ${blog.views || 0} views</span>
            </div>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
              <a href="blog-detail.html?id=${blogId}" class="btn btn-secondary btn-sm btn-block">View Article</a>
              <button class="btn btn-outline btn-sm edit-blog-btn" data-id="${blogId}">Edit</button>
              <button class="btn btn-danger btn-sm delete-blog-trigger" data-id="${blogId}">Delete</button>
            </div>
          `;
          mobileCardsContainer.appendChild(card);
        });
      }
    }

    document.querySelectorAll('.edit-blog-btn').forEach(btn => {
      btn.addEventListener('click', () => openEditBlogModal(btn.getAttribute('data-id')));
    });

    document.querySelectorAll('.delete-blog-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        blogToDeleteId = btn.getAttribute('data-id');
        openDeleteConfirmModal();
      });
    });

    updateStats();
  }

  function openEditBlogModal(blogId) {
    const blog = blogs.find(b => (b._id === blogId || b.id === blogId));
    if (!blog) return;

    let modal = document.getElementById('edit-blog-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'edit-blog-modal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-box modal-lg">
        <div class="modal-header">
          <h3>Edit Article — ${blog.title}</h3>
          <button class="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <form id="edit-blog-form">
            <div class="form-group">
              <label class="form-label">Blog Title</label>
              <input type="text" id="edit-title" class="form-input" value="${blog.title}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Category</label>
              <select id="edit-category" class="filter-select" style="width: 100%;">
                <option value="Technology" ${blog.category === 'Technology' ? 'selected' : ''}>Technology</option>
                <option value="Web Development" ${blog.category === 'Web Development' ? 'selected' : ''}>Web Development</option>
                <option value="Programming" ${blog.category === 'Programming' ? 'selected' : ''}>Programming</option>
                <option value="Career" ${blog.category === 'Career' ? 'selected' : ''}>Career</option>
                <option value="Design" ${blog.category === 'Design' ? 'selected' : ''}>Design</option>
                <option value="Education" ${blog.category === 'Education' ? 'selected' : ''}>Education</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Short Description</label>
              <textarea id="edit-desc" class="form-input" rows="3" required>${blog.description}</textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Content</label>
              <textarea id="edit-content" class="form-input" rows="6" required>${blog.content}</textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select id="edit-status" class="filter-select" style="width: 100%;">
                <option value="Published" ${blog.status === 'Published' ? 'selected' : ''}>Published</option>
                <option value="Draft" ${blog.status === 'Draft' ? 'selected' : ''}>Draft</option>
              </select>
            </div>
            <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border: none;">
              <button type="button" class="btn btn-secondary cancel-edit-btn">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    `;

    modal.classList.add('active');
    const closeModal = () => modal.classList.remove('active');

    modal.querySelectorAll('.modal-close-btn, .cancel-edit-btn').forEach(b => b.addEventListener('click', closeModal));

    const editForm = modal.querySelector('#edit-blog-form');
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const updatedData = {
        title: document.getElementById('edit-title').value.trim(),
        category: document.getElementById('edit-category').value,
        description: document.getElementById('edit-desc').value.trim(),
        content: document.getElementById('edit-content').value.trim(),
        status: document.getElementById('edit-status').value
      };

      const token = localStorage.getItem('blog_token');
      try {
        await fetch(`${API_URL}/blogs/${blogId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify(updatedData)
        });
      } catch (err) { }

      blogs = blogs.map(b => (b._id === blogId || b.id === blogId) ? { ...b, ...updatedData } : b);
      saveStoredBlogsSync(blogs);
      renderDashboardItems();
      showToast('Article updated successfully!', 'success');
      closeModal();
    });
  }

  function openDeleteConfirmModal() {
    let modal = document.getElementById('delete-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'delete-modal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-box">
        <div class="modal-header">
          <h3 style="font-size: 1.2rem; color: var(--danger);">Confirm Deletion</h3>
          <button class="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this blog post? This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary cancel-delete-btn">Cancel</button>
          <button class="btn btn-danger confirm-delete-btn">Delete Post</button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    const closeModal = () => modal.classList.remove('active');

    modal.querySelectorAll('.modal-close-btn, .cancel-delete-btn').forEach(b => b.addEventListener('click', closeModal));

    const confirmBtn = modal.querySelector('.confirm-delete-btn');
    confirmBtn.addEventListener('click', async () => {
      if (blogToDeleteId) {
        const token = localStorage.getItem('blog_token');
        try {
          await fetch(`${API_URL}/blogs/${blogToDeleteId}`, {
            method: 'DELETE',
            headers: { 'Authorization': token ? `Bearer ${token}` : '' }
          });
        } catch (e) { }

        blogs = blogs.filter(b => (b._id !== blogToDeleteId && b.id !== blogToDeleteId));
        saveStoredBlogsSync(blogs);
        renderDashboardItems();
        showToast('Blog post deleted successfully.', 'success');
        blogToDeleteId = null;
      }
      closeModal();
    });
  }

  const searchInput = document.getElementById('dashboard-search-input');
  if (searchInput) searchInput.addEventListener('input', renderDashboardItems);

  const statusFilterSelect = document.getElementById('dashboard-status-filter');
  if (statusFilterSelect) statusFilterSelect.addEventListener('change', renderDashboardItems);

  renderDashboardItems();
}

// Create Blog Page Logic with Author Tracking
function initCreateBlogPage() {
  const createForm = document.getElementById('create-blog-form');
  if (!createForm) return;

  const descInput = document.getElementById('blog-description');
  const descCounter = document.getElementById('desc-char-count');
  const imageUrlInput = document.getElementById('blog-image-url');
  const imagePreviewContainer = document.getElementById('image-preview-container');

  if (descInput && descCounter) {
    descInput.addEventListener('input', () => {
      const length = descInput.value.length;
      descCounter.textContent = `${length} / 200 characters`;
      descCounter.style.color = length > 200 ? 'var(--danger)' : 'var(--text-muted)';
    });
  }

  if (imageUrlInput && imagePreviewContainer) {
    imageUrlInput.addEventListener('input', () => {
      const url = imageUrlInput.value.trim();
      if (url) {
        imagePreviewContainer.innerHTML = `<img src="${url}" alt="Featured Preview" onError="this.parentNode.innerHTML='<span style=\\'color:var(--danger)\\'>Invalid Image URL</span>'">`;
      } else {
        imagePreviewContainer.innerHTML = `<span>Image Preview</span>`;
      }
    });
  }

  createForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const currentUser = getLoggedInUser();
    const title = document.getElementById('blog-title').value.trim();
    const category = document.getElementById('blog-category').value;
    const description = descInput.value.trim();
    const image = imageUrlInput.value.trim() || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';
    const content = document.getElementById('blog-content').value.trim();
    const tagsStr = document.getElementById('blog-tags').value.trim();
    const statusSelect = document.getElementById('publish-status') ? document.getElementById('publish-status').value : 'Published';

    if (!title || !description || !content) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    const token = localStorage.getItem('blog_token');
    const authorAvatar = currentUser ? (currentUser.avatar || (currentUser.gender === 'Female' ? 'female.jpg' : 'male.jpg')) : 'male.jpg';
    const newBlog = {
      title,
      category,
      description,
      content,
      image,
      author: currentUser ? currentUser.name : 'Alex Morgan',
      authorEmail: currentUser ? currentUser.email : 'alex@example.com',
      authorAvatar: authorAvatar,
      status: statusSelect,
      tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      const res = await fetch(`${API_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(newBlog)
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Blog post created successfully! Redirecting...', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 1200);
        return;
      }
    } catch (err) {
      const blogs = getStoredBlogsSync();
      newBlog.id = 'blog_' + Date.now();
      newBlog.authorAvatar = authorAvatar;
      newBlog.date = 'Today';
      blogs.unshift(newBlog);
      saveStoredBlogsSync(blogs);
      showToast('Blog post created successfully! Redirecting...', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 1200);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  checkRouteProtection();
  initNavigation();
  initHomePage();
  initLoginPage();
  initRegisterPage();
  initDashboardPage();
  initCreateBlogPage();
});
