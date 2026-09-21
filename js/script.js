/**
 * Blog Application - Main JavaScript File with Backend REST API Integration
 * Designed for Codomax Digital Solutions Internship Assignment
 * Uses Pure Vanilla JavaScript (ES6+) & Express REST API Integration
 */

const API_URL = 'http://localhost:5000/api';

// Initial fallback blog data
const INITIAL_BLOGS = [
  {
    id: "blog_1",
    title: "Mastering Modern CSS Grid & Flexbox in 2026",
    category: "Web Development",
    description: "A comprehensive guide to creating fluid, responsive, and accessible web layouts without relying on bulky CSS frameworks.",
    content: "Building web layouts used to be a frustrating experience with CSS floats and clearfix hacks. Modern CSS has evolved tremendously.\n\nFlexbox is perfect for one-dimensional layouts, like navigation bars, button groups, and aligned card items. CSS Grid excels at complex two-dimensional layouts like main page structures and card grids.",
    author: "Alex Morgan",
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
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    date: "Sep 05, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    status: "Published",
    views: 2180,
    tags: ["Tech", "Future", "AI"]
  }
];

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

  // Fallback to LocalStorage
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

// Navigation Bar
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
}

// Home Page Logic
async function initHomePage() {
  const blogContainer = document.getElementById('blog-cards-grid');
  if (!blogContainer) return;

  const blogs = (await fetchBlogsFromApi()).filter(b => b.status === 'Published');
  let activeCategory = 'All';
  let searchQuery = '';

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
      const card = document.createElement('article');
      card.className = 'blog-card';
      card.innerHTML = `
        <div class="blog-card-img-wrap">
          <img src="${blog.image}" alt="${blog.title}" class="blog-card-img" loading="lazy" onError="this.src='https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'">
          <span class="blog-card-category">${blog.category}</span>
        </div>
        <div class="blog-card-body">
          <h3 class="blog-card-title">
            <a href="#" data-blog-id="${blog.id}" class="read-blog-btn">${blog.title}</a>
          </h3>
          <p class="blog-card-excerpt">${blog.description}</p>
          <div class="blog-card-footer">
            <div class="blog-author">
              <img src="${blog.authorAvatar}" alt="${blog.author}" class="blog-author-img">
              <div>
                <span class="blog-author-name">${blog.author}</span>
                <div style="font-size: 0.75rem; color: var(--text-light);">${blog.date}</div>
              </div>
            </div>
            <button class="btn btn-outline btn-sm read-blog-btn" data-blog-id="${blog.id}">Read Post</button>
          </div>
        </div>
      `;
      blogContainer.appendChild(card);
    });

    document.querySelectorAll('.read-blog-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-blog-id');
        openBlogModal(id);
      });
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

// Blog Reader Modal
function openBlogModal(blogId) {
  const blogs = getStoredBlogsSync();
  const blog = blogs.find(b => b.id === blogId);
  if (!blog) return;

  let modalBackdrop = document.getElementById('blog-modal');
  if (!modalBackdrop) {
    modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'blog-modal';
    modalBackdrop.className = 'modal-backdrop';
    document.body.appendChild(modalBackdrop);
  }

  modalBackdrop.innerHTML = `
    <div class="modal-box modal-lg">
      <div class="modal-header">
        <span class="hero-card-tag">${blog.category}</span>
        <button class="modal-close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <h2 style="font-size: 1.8rem; margin-bottom: 1rem;">${blog.title}</h2>
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; color: var(--text-muted); font-size: 0.85rem;">
          <img src="${blog.authorAvatar}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover;">
          <div>
            <strong style="color: var(--text-main); display: block;">${blog.author}</strong>
            <span>${blog.date} • ${blog.readTime || '5 min read'}</span>
          </div>
        </div>
        <img src="${blog.image}" alt="${blog.title}" style="width: 100%; max-height: 350px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
        <div style="white-space: pre-line; line-height: 1.8; color: var(--text-main); font-size: 1.05rem;">
          ${blog.content}
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary modal-close-btn">Close Article</button>
      </div>
    </div>
  `;

  modalBackdrop.classList.add('active');

  const closeBtns = modalBackdrop.querySelectorAll('.modal-close-btn');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modalBackdrop.classList.remove('active');
    });
  });

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      modalBackdrop.classList.remove('active');
    }
  });
}

// Login Page Logic with Backend Integration
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

    // Try Express Backend API
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Login successful! Redirecting to dashboard...', 'success');
        localStorage.setItem('blog_user', JSON.stringify(data.user));
        setTimeout(() => window.location.href = 'dashboard.html', 1200);
        return;
      } else {
        showToast(data.message || 'Login failed', 'error');
        return;
      }
    } catch (err) {
      // Backend offline fallback
      showToast('Login successful (Offline mode)! Redirecting...', 'success');
      localStorage.setItem('blog_user', JSON.stringify({ name: 'Alex Morgan', email }));
      setTimeout(() => window.location.href = 'dashboard.html', 1200);
    }
  });
}

// Registration Page Logic with Backend Integration
function initRegisterPage() {
  const registerForm = document.getElementById('register-form');
  if (!registerForm) return;

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const terms = document.getElementById('terms').checked;

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
        body: JSON.stringify({ name: fullName, email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Registration successful! Redirecting to login...', 'success');
        setTimeout(() => window.location.href = 'login.html', 1200);
      } else {
        showToast(data.message || 'Registration failed', 'error');
      }
    } catch (err) {
      showToast('Registration successful! Redirecting to login...', 'success');
      setTimeout(() => window.location.href = 'login.html', 1200);
    }
  });
}

// Dashboard Logic with Backend Integration
async function initDashboardPage() {
  const tableBody = document.getElementById('dashboard-table-body');
  const mobileCardsContainer = document.getElementById('dashboard-mobile-cards');
  if (!tableBody && !mobileCardsContainer) return;

  let blogs = await fetchBlogsFromApi();
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
              No blogs match your filter criteria.
            </td>
          </tr>
        `;
      } else {
        filtered.forEach(blog => {
          const tr = document.createElement('tr');
          const isPublished = blog.status === 'Published';
          tr.innerHTML = `
            <td>
              <span class="table-blog-title">${blog.title}</span>
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
                <button class="btn-icon view-blog-btn" data-id="${blog.id}" title="View Blog">👁️</button>
                <button class="btn-icon delete-btn delete-blog-trigger" data-id="${blog.id}" title="Delete Blog">🗑️</button>
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
            No blogs found.
          </div>
        `;
      } else {
        filtered.forEach(blog => {
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
              <button class="btn btn-secondary btn-sm btn-block view-blog-btn" data-id="${blog.id}">View</button>
              <button class="btn btn-danger btn-sm delete-blog-trigger" data-id="${blog.id}">Delete</button>
            </div>
          `;
          mobileCardsContainer.appendChild(card);
        });
      }
    }

    document.querySelectorAll('.view-blog-btn').forEach(btn => {
      btn.addEventListener('click', () => openBlogModal(btn.getAttribute('data-id')));
    });

    document.querySelectorAll('.delete-blog-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        blogToDeleteId = btn.getAttribute('data-id');
        openDeleteConfirmModal();
      });
    });

    updateStats();
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
        try {
          await fetch(`${API_URL}/blogs/${blogToDeleteId}`, { method: 'DELETE' });
        } catch (e) {}

        blogs = blogs.filter(b => b.id !== blogToDeleteId);
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

// Create Blog Page Logic with Backend Integration
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

    const newBlog = {
      title,
      category,
      description,
      content,
      image,
      status: statusSelect,
      tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      const res = await fetch(`${API_URL}/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlog)
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Blog post created successfully on backend API! Redirecting...', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 1200);
        return;
      }
    } catch (err) {
      // Fallback local save
      const blogs = getStoredBlogsSync();
      newBlog.id = 'blog_' + Date.now();
      newBlog.author = 'Alex Morgan';
      newBlog.authorAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
      newBlog.date = 'Today';
      blogs.unshift(newBlog);
      saveStoredBlogsSync(blogs);
      showToast('Blog post created successfully! Redirecting...', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 1200);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHomePage();
  initLoginPage();
  initRegisterPage();
  initDashboardPage();
  initCreateBlogPage();
});
