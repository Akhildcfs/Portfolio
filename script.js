// ===== Helper: Smooth Scroll for internal links =====
function enableSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// ===== Mobile Nav Toggle =====
function setupMobileNav() {
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const nav = document.getElementById("main-nav");

  if (!mobileBtn || !nav) return;

  mobileBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  // Close on link click
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });
}

// ===== Active Nav on Scroll =====
function setupActiveNavOnScroll() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function onScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const height = section.offsetHeight;
      const top = section.offsetTop - 100;
      const id = section.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", onScroll);
}

// ===== Back to Top Button =====
function setupBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 400) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ===== Typing Effect =====
function setupTypingEffect() {
  const element = document.getElementById("typed-text");
  if (!element) return;

  const roles = [
    "Cybersecurity Student",
    "Web Security Enthusiast",
    "Vulnerability Analyst",
    "Future Security Engineer"
  ];

  let currentRoleIndex = 0;
  let charIndex = 0;
  let typing = true;

  function type() {
    const currentRole = roles[currentRoleIndex];

    if (typing) {
      element.textContent = currentRole.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        typing = false;
        setTimeout(type, 1000);
        return;
      }
    } else {
      element.textContent = currentRole.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        typing = true;
        currentRoleIndex = (currentRoleIndex + 1) % roles.length;
      }
    }

    const delay = typing ? 80 : 40;
    setTimeout(type, delay);
  }

  type();
}

// ===== Blog Posts (Dynamic) =====
// NOTE: This function now avoids duplicating cards if the container already has children.
// It also deduplicates by title if needed.
function loadBlogPosts() {
  const container = document.getElementById("blog-posts");
  if (!container) return;

  // If the container already has any children (static cards), do not inject duplicates.
  if (container.children.length > 0) {
    console.info("blog-posts container already populated — skipping dynamic injection.");
    return;
  }

  // Helper to dedupe by title
  const seen = new Set();

  const posts = [
    {
      title: "Getting Started with Web Application Security",
      date: "Jan 2025",
      readTime: "6 min read",
      excerpt:
        "A beginner-friendly guide on how to start with web app security, from understanding HTTP to trying DVWA and Juice Shop.",
      tags: ["Web Security", "Beginner"],
      // <-- correct path to the individual blog file inside blog/
      link: "blog/post-getting-started.html"
    },
    {
      title: "My Approach to Vulnerability Analysis on a New Website",
      date: "Dec 2024",
      readTime: "7 min read",
      excerpt:
        "How I perform basic recon, scanning, and manual testing when exploring a new target for vulnerabilities.",
      tags: ["VAPT", "Recon"],
      link: "blog/post-vuln-analysis.html"
    },
    {
      title: "Linux Basics for Cybersecurity Students",
      date: "Nov 2024",
      readTime: "5 min read",
      excerpt:
        "Essential Linux commands and concepts every cybersecurity student should practice daily.",
      tags: ["Linux", "CLI"],
      link: "blog/post-linux-basics.html"
    }
  ];

  posts.forEach((post) => {
    // dedupe by title (safe fallback)
    const key = post.title && post.title.trim().toLowerCase();
    if (seen.has(key)) {
      return;
    }
    seen.add(key);

    const card = document.createElement("article");
    card.className = "blog-card reveal";

    card.innerHTML = `
      <div class="blog-meta">
        <span>${post.date}</span>
        <span>${post.readTime}</span>
      </div>
      <h3 class="blog-title">${escapeHtml(post.title)}</h3>
      <p class="blog-excerpt">${escapeHtml(post.excerpt)}</p>
      <div class="blog-tags">
        ${post.tags.map((tag) => `<span class="blog-tag">${escapeHtml(tag)}</span>`).join("")}
      </div>
      <a href="${post.link}" class="blog-readmore">
        Read more <i class="fas fa-arrow-right"></i>
      </a>
    `;

    container.appendChild(card);
  });
}

// small helper to escape text (prevent accidental HTML injection)
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ===== View All Blog Button =====
function setupViewAllBlog() {
  const btn = document.getElementById("view-all-blog");
  if (!btn) return;

  btn.addEventListener("click", () => {
    // prefer navigating to the blog index page if it exists
    const blogIndexPath = "blog/index.html";
    // quick check if the blog index file exists (best-effort; fetch HEAD might be blocked file://)
    fetch(blogIndexPath, { method: "HEAD" })
      .then((resp) => {
        if (resp.ok) {
          window.location.href = blogIndexPath;
        } else {
          alert(
            "Full blog page not found locally. In a real deployment this would navigate to the blog index."
          );
        }
      })
      .catch(() => {
        // fallback for local file system (fetch may fail); still try navigation
        window.location.href = blogIndexPath;
      });
  });
}

// ===== Project Filters =====
function setupProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || filter === category) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// ===== Contact Form (Front-end Only) =====
function setupContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");

  if (!form || !status) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      status.textContent = "Please fill in all required fields.";
      status.style.color = "#f97373";
      return;
    }

    // Simple email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      status.textContent = "Please enter a valid email address.";
      status.style.color = "#f97373";
      return;
    }

    status.textContent =
      "Thanks for your message! (This is a demo — connect a backend or service to actually send emails.)";
    status.style.color = "#4ade80";
    form.reset();
  });
}

// ===== Newsletter Form =====
function setupNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  const emailInput = document.getElementById("newsletter-email");
  const status = document.getElementById("newsletter-status");

  if (!form || !emailInput || !status) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    if (!email) {
      status.textContent = "Please enter your email.";
      status.style.color = "#f97373";
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      status.textContent = "Please enter a valid email.";
      status.style.color = "#f97373";
      return;
    }

    status.textContent =
      "Subscribed successfully! (Demo only - connect a real email service later.)";
    status.style.color = "#4ade80";
    form.reset();
  });
}

// ===== Theme Toggle (Dark / Light) =====
function setupThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    toggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const isLight = document.body.classList.contains("light-theme");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    toggle.innerHTML = isLight
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
  });
}

// ===== Reveal on Scroll (Intersection Observer) =====
function setupRevealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1
    }
  );

  reveals.forEach((el) => observer.observe(el));
}

// ===== Footer Year =====
function setYear() {
  const yearSpan = document.getElementById("year");
  if (!yearSpan) return;
  yearSpan.textContent = new Date().getFullYear();
}

// ===== Init on DOMContentLoaded =====
document.addEventListener("DOMContentLoaded", () => {
  enableSmoothScroll();
  setupMobileNav();
  setupActiveNavOnScroll();
  setupBackToTop();
  setupTypingEffect();
  loadBlogPosts();             // will skip if static cards already exist
  setupViewAllBlog();
  setupProjectFilters();
  setupContactForm();
  setupNewsletterForm();
  setupThemeToggle();
  setupRevealOnScroll();
  setYear();
});
