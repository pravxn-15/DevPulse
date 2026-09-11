/**
 * Blog Application - Main JavaScript File
 * Designed for Codomax Digital Solutions Internship Assignment
 * Uses Pure Vanilla JavaScript (ES6+)
 */

// ==========================================================================
// 1. Initial Sample Blog Data & LocalStorage Setup
// ==========================================================================

const INITIAL_BLOGS = [
  {
    id: "blog_1",
    title: "Mastering Modern CSS Grid & Flexbox in 2026",
    category: "Web Development",
    description: "A comprehensive guide to creating fluid, responsive, and accessible web layouts without relying on bulky CSS frameworks.",
    content: `Building web layouts used to be a frustrating experience with CSS floats and clearfix hacks. Modern CSS has evolved tremendously.

Flexbox is perfect for one-dimensional layouts, like navigation bars, button groups, and aligned card items. CSS Grid excels at complex two-dimensional layouts like main page structures and card grids.

When combined with dynamic CSS functions like minmax(), repeat(), and clamp(), developers can create ultra-responsive web designs that seamlessly adapt to any screen resolution from mobile devices to 4K displays.`,
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
    content: `Landing your first software engineering internship is a significant milestone. Here are actionable tips to stand out:

1. **Build Real Projects**: Don't rely solely on tutorial clones. Create original applications that solve real-world problems.
2. **Clean Code and Documentation**: Write clear README files and ensure your code is well-structured and commented.
3. **Master Git & GitHub**: Recruiters look for consistent commit histories and collaborative skills.
4. **Practice Core Fundamentals**: Focus on HTML5, CSS3, and JavaScript basics before jumping into heavy frameworks.`,
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
    content: `Web development is advancing faster than ever. AI-assisted coding tools are making developer workflows dramatically more efficient.

WebAssembly (Wasm) is bringing high-performance desktop capabilities directly into browser environments, allowing complex video editing, 3D rendering, and real-time processing to execute seamlessly.

As web standards evolve, performance and accessibility remain the paramount metrics for web application success.`,
    author: "David Chen",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    date: "Sep 05, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    status: "Published",
    views: 2180,
    tags: ["Tech", "Future", "AI"]
  },
  {
    id: "blog_4",
    title: "Understanding Asynchronous JavaScript: Async/Await Made Easy",
    category: "Programming",
    description: "Demystifying callbacks, promises, and async/await syntax to write non-blocking clean JavaScript code.",
    content: `JavaScript is single-threaded, which means it executes code one line at a time. To handle long-running operations like API requests or file reads without freezing the browser, JavaScript uses asynchronous programming.

Promises introduced a structured way to handle async results using .then() and .catch().

Async/Await syntactically sugarcoats Promises, allowing developers to write asynchronous code that looks and behaves like synchronous code while maintaining high performance.`,
    author: "Alex Morgan",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    date: "Sep 02, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    status: "Published",
    views: 1890,
    tags: ["JavaScript", "Async", "Coding"]
  },
  {
    id: "blog_5",
    title: "UI/UX Best Practices for Frontend Developers",
    category: "Design",
    description: "How to bridge the gap between design and code to build intuitive, user-friendly digital experiences.",
    content: `Great frontend development goes beyond writing clean code; it requires a strong understanding of user experience design principles.

Key takeaways include:
- **Visual Hierarchy**: Guide the user's eye using font sizing, weight, and color contrast.
- **Consistent Spacing**: Use a standard spacing scale (4px/8px grid system) across all components.
- **Interactive Feedback**: Always provide visible hover, focus, and active states for buttons and interactive controls.`,
    author: "Elena Rostova",
    authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
    date: "Aug 28, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80",
    status: "Draft",
    views: 0,
    tags: ["UI", "UX", "Design"]
  },
  {
    id: "blog_6",
    title: "Building Accessible Web Applications: A Starter Checklist",
    category: "Education",
    description: "Learn how to make your websites accessible to users of all abilities using semantic HTML and ARIA roles.",
    content: `Web accessibility (a11y) ensures that people with disabilities can navigate, understand, and interact with web content effectively.

Checklist for beginner developers:
1. Always use semantic HTML tags (<main>, <nav>, <article>, <header>, <footer>).
2. Include descriptive alt attributes for informative images.
3. Ensure adequate color contrast between text and backgrounds.
4. Support keyboard navigation for all interactive controls.`,
    author: "Marcus Vance",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    date: "Aug 25, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    status: "Published",
    views: 940,
    tags: ["Accessibility", "HTML5", "a11y"]
  }
];

// Get stored posts or initialize with default sample posts
function getStoredBlogs() {
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

function saveStoredBlogs(blogs) {
  localStorage.setItem('blog_app_posts', JSON.stringify(blogs));
}

// ==========================================================================
// 2. Global Toast Notification System
// ==========================================================================

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

  // Trigger smooth enter animation
  setTimeout(() => toast.classList.add('show'), 50);

  // Auto remove toast
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

// ==========================================================================
// 3. Mobile Navigation & active link handler
// ==========================================================================

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

  // Highlight active menu item based on current location
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

// ==========================================================================
// 4. Home Page Logic (index.html)
// ==========================================================================

function initHomePage() {
  const blogContainer = document.getElementById('blog-cards-grid');
  if (!blogContainer) return;

  const blogs = getStoredBlogs().filter(b => b.status === 'Published');
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

    // Attach click listener to "Read Post" buttons to launch modal
    document.querySelectorAll('.read-blog-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-blog-id');
        openBlogModal(id);
      });
    });
  }

  // Category Pills Filtering
  const categoryPills = document.querySelectorAll('.category-pill');
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category');
      renderBlogs();
    });
  });

  // Real-time Search Input
  const searchInput = document.getElementById('home-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderBlogs();
    });
  }

  renderBlogs();
}

// Global Blog Reader Modal Handler
function openBlogModal(blogId) {
  const blogs = getStoredBlogs();
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

// ==========================================================================
// 5. Login Page Logic (login.html)
// ==========================================================================

function initLoginPage() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  // Toggle Password Visibility
  const togglePassBtn = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');

  if (togglePassBtn && passwordInput) {
    togglePassBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      togglePassBtn.textContent = isPassword ? 'Hide' : 'Show';
    });
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value.trim();

    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      emailError.textContent = 'Email address is required.';
      emailError.classList.add('active');
      document.getElementById('email').classList.add('is-invalid');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      emailError.textContent = 'Please enter a valid email address.';
      emailError.classList.add('active');
      document.getElementById('email').classList.add('is-invalid');
      isValid = false;
    } else {
      emailError.classList.remove('active');
      document.getElementById('email').classList.remove('is-invalid');
    }

    // Password validation
    if (!password) {
      passwordError.textContent = 'Password is required.';
      passwordError.classList.add('active');
      passwordInput.classList.add('is-invalid');
      isValid = false;
    } else if (password.length < 6) {
      passwordError.textContent = 'Password must be at least 6 characters long.';
      passwordError.classList.add('active');
      passwordInput.classList.add('is-invalid');
      isValid = false;
    } else {
      passwordError.classList.remove('active');
      passwordInput.classList.remove('is-invalid');
    }

    if (isValid) {
      // Simulate successful login
      showToast('Login successful! Redirecting to dashboard...', 'success');
      localStorage.setItem('blog_user', JSON.stringify({ name: 'Alex Morgan', email: email }));
      
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1200);
    } else {
      showToast('Please fix the highlighted errors in the form.', 'error');
    }
  });
}

// ==========================================================================
// 6. Registration Page Logic (register.html)
// ==========================================================================

function initRegisterPage() {
  const registerForm = document.getElementById('register-form');
  if (!registerForm) return;

  registerForm.addEventListener('submit', (e) => {
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

    // Full Name
    if (!fullName || fullName.length < 2) {
      nameErr.textContent = 'Please enter your full name.';
      nameErr.classList.add('active');
      document.getElementById('fullname').classList.add('is-invalid');
      isValid = false;
    } else {
      nameErr.classList.remove('active');
      document.getElementById('fullname').classList.remove('is-invalid');
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      emailErr.textContent = 'Please enter a valid email address.';
      emailErr.classList.add('active');
      document.getElementById('email').classList.add('is-invalid');
      isValid = false;
    } else {
      emailErr.classList.remove('active');
      document.getElementById('email').classList.remove('is-invalid');
    }

    // Password
    if (!password || password.length < 6) {
      passErr.textContent = 'Password must be at least 6 characters.';
      passErr.classList.add('active');
      document.getElementById('password').classList.add('is-invalid');
      isValid = false;
    } else {
      passErr.classList.remove('active');
      document.getElementById('password').classList.remove('is-invalid');
    }

    // Confirm Password
    if (confirmPassword !== password) {
      confirmErr.textContent = 'Passwords do not match.';
      confirmErr.classList.add('active');
      document.getElementById('confirm-password').classList.add('is-invalid');
      isValid = false;
    } else {
      confirmErr.classList.remove('active');
      document.getElementById('confirm-password').classList.remove('is-invalid');
    }

    // Terms
    if (!terms) {
      termsErr.textContent = 'You must accept the Terms & Conditions.';
      termsErr.classList.add('active');
      isValid = false;
    } else {
      termsErr.classList.remove('active');
    }

    if (isValid) {
      showToast('Registration successful! Redirecting to login...', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1200);
    } else {
      showToast('Please fix the errors in the form before submitting.', 'error');
    }
  });
}

// ==========================================================================
// 7. Dashboard Page Logic (dashboard.html)
// ==========================================================================

function initDashboardPage() {
  const tableBody = document.getElementById('dashboard-table-body');
  const mobileCardsContainer = document.getElementById('dashboard-mobile-cards');
  if (!tableBody && !mobileCardsContainer) return;

  let blogs = getStoredBlogs();
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

    // Render Table Rows for Desktop
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

    // Render Cards for Mobile View
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

    // Attach Event Listeners to View & Delete buttons
    document.querySelectorAll('.view-blog-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openBlogModal(btn.getAttribute('data-id'));
      });
    });

    document.querySelectorAll('.delete-blog-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        blogToDeleteId = btn.getAttribute('data-id');
        openDeleteConfirmModal();
      });
    });

    updateStats();
  }

  // Confirm Delete Modal Handler
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
    confirmBtn.addEventListener('click', () => {
      if (blogToDeleteId) {
        blogs = blogs.filter(b => b.id !== blogToDeleteId);
        saveStoredBlogs(blogs);
        renderDashboardItems();
        showToast('Blog post deleted successfully.', 'success');
        blogToDeleteId = null;
      }
      closeModal();
    });
  }

  // Filter & Search Attachments
  const searchInput = document.getElementById('dashboard-search-input');
  if (searchInput) searchInput.addEventListener('input', renderDashboardItems);

  const statusFilterSelect = document.getElementById('dashboard-status-filter');
  if (statusFilterSelect) statusFilterSelect.addEventListener('change', renderDashboardItems);

  renderDashboardItems();
}

// ==========================================================================
// 8. Create Blog Page Logic (create-blog.html)
// ==========================================================================

function initCreateBlogPage() {
  const createForm = document.getElementById('create-blog-form');
  if (!createForm) return;

  const descInput = document.getElementById('blog-description');
  const descCounter = document.getElementById('desc-char-count');
  const imageUrlInput = document.getElementById('blog-image-url');
  const imagePreviewContainer = document.getElementById('image-preview-container');

  // Description Character Counter
  if (descInput && descCounter) {
    descInput.addEventListener('input', () => {
      const length = descInput.value.length;
      descCounter.textContent = `${length} / 200 characters`;
      if (length > 200) {
        descCounter.style.color = 'var(--danger)';
      } else {
        descCounter.style.color = 'var(--text-muted)';
      }
    });
  }

  // Live Image URL Preview
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

  // Auto load draft from LocalStorage
  const savedDraft = localStorage.getItem('blog_app_draft');
  if (savedDraft) {
    try {
      const draftObj = JSON.parse(savedDraft);
      if (document.getElementById('blog-title')) document.getElementById('blog-title').value = draftObj.title || '';
      if (document.getElementById('blog-category')) document.getElementById('blog-category').value = draftObj.category || 'Technology';
      if (descInput) descInput.value = draftObj.description || '';
      if (imageUrlInput) {
        imageUrlInput.value = draftObj.image || '';
        imageUrlInput.dispatchEvent(new Event('input'));
      }
      if (document.getElementById('blog-content')) document.getElementById('blog-content').value = draftObj.content || '';
      if (document.getElementById('blog-tags')) document.getElementById('blog-tags').value = draftObj.tags || '';
      showToast('Loaded saved draft from LocalStorage', 'info');
    } catch (e) {
      console.error(e);
    }
  }

  // "Save as Draft" Button Handler
  const saveDraftBtn = document.getElementById('save-draft-btn');
  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', () => {
      const draftObj = {
        title: document.getElementById('blog-title').value.trim(),
        category: document.getElementById('blog-category').value,
        description: descInput.value.trim(),
        image: imageUrlInput.value.trim(),
        content: document.getElementById('blog-content').value.trim(),
        tags: document.getElementById('blog-tags').value.trim()
      };

      localStorage.setItem('blog_app_draft', JSON.stringify(draftObj));
      showToast('Draft saved successfully in LocalStorage!', 'success');
    });
  }

  // Live Post Preview Handler
  const previewBtn = document.getElementById('preview-blog-btn');
  if (previewBtn) {
    previewBtn.addEventListener('click', () => {
      const title = document.getElementById('blog-title').value.trim() || 'Untitled Post';
      const category = document.getElementById('blog-category').value;
      const content = document.getElementById('blog-content').value.trim() || 'No content provided yet.';
      const image = imageUrlInput.value.trim() || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';

      const tempId = 'temp_preview';
      const tempBlog = {
        id: tempId,
        title,
        category,
        content,
        author: 'Alex Morgan (You)',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        date: 'Today',
        readTime: 'Preview',
        image
      };

      const currentBlogs = getStoredBlogs();
      saveStoredBlogs([tempBlog, ...currentBlogs]);
      openBlogModal(tempId);
      // Clean up temporary preview item after closing modal
      saveStoredBlogs(currentBlogs);
    });
  }

  // Form Submit (Publish Blog)
  createForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('blog-title').value.trim();
    const category = document.getElementById('blog-category').value;
    const description = descInput.value.trim();
    const image = imageUrlInput.value.trim() || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';
    const content = document.getElementById('blog-content').value.trim();
    const tagsStr = document.getElementById('blog-tags').value.trim();
    const statusSelect = document.getElementById('publish-status') ? document.getElementById('publish-status').value : 'Published';

    if (!title || !description || !content) {
      showToast('Please complete all required fields (Title, Description, and Content).', 'error');
      return;
    }

    const newBlog = {
      id: 'blog_' + Date.now(),
      title,
      category,
      description,
      content,
      author: 'Alex Morgan',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readTime: Math.ceil(content.split(' ').length / 200) + ' min read',
      image,
      status: statusSelect,
      views: 0,
      tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean)
    };

    const blogs = getStoredBlogs();
    blogs.unshift(newBlog);
    saveStoredBlogs(blogs);

    // Clear saved draft
    localStorage.removeItem('blog_app_draft');

    showToast('Blog post created successfully! Redirecting...', 'success');

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1200);
  });
}

// ==========================================================================
// 9. Document Ready Initialization
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHomePage();
  initLoginPage();
  initRegisterPage();
  initDashboardPage();
  initCreateBlogPage();
});
