export function initShell(page = "") {
  const headerMount = document.getElementById("globalHeader");
  const footerMount = document.getElementById("globalFooter");
  const pageKey = String(page || document.body.dataset.page || "").toLowerCase();

  if (headerMount) {
    headerMount.innerHTML = `
      <header class="site-header" id="siteHeader">
        <div class="container header-inner">
          <a href="index.html" class="brand">Black</a>

          <div class="header-main fullscreen-menu" id="headerMain" aria-hidden="true">
            <div class="mobile-menu-panel" id="mobileMenuPanel">
              <div class="mobile-menu-head">
                <a href="index.html" class="brand menu-brand">Black</a>
                <button class="menu-close" id="menuClose" aria-label="Close navigation menu">&times;</button>
              </div>
              <nav class="site-nav" id="siteNav" aria-label="Main navigation">
                <a class="nav-link ${pageKey === "home" ? "is-active" : ""}" href="index.html">Home</a>
                <a class="nav-link ${pageKey === "about" ? "is-active" : ""}" href="about.html">About</a>
                <a class="nav-link ${pageKey === "projects" || pageKey === "single-project" ? "is-active" : ""}" href="projects.html">Projects</a>
                <a class="nav-link ${pageKey === "blog" || pageKey === "blog-post" ? "is-active" : ""}" href="blog.html">Blog</a>
                <a class="nav-link ${pageKey === "contact" ? "is-active" : ""}" href="contact.html">Contact</a>
              </nav>

              <form class="search-shell" id="searchShell" role="search" aria-label="Site search">
                <label class="sr-only" for="siteSearch">Search</label>
                <input id="siteSearch" class="search-input" type="search" placeholder="Search projects, blogs..." autocomplete="off" />
              </form>
            </div>
          </div>

          <div class="header-actions">
            <button class="icon-btn" id="searchToggle" aria-label="Open search" aria-expanded="false">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 4a6.5 6.5 0 1 1 0 13a6.5 6.5 0 0 1 0-13Zm0 1.8a4.7 4.7 0 1 0 0 9.4a4.7 4.7 0 0 0 0-9.4Zm10.1 13.63l-3.19-3.18-1.27 1.27 3.18 3.19a.9.9 0 1 0 1.28-1.28Z"/></svg>
            </button>
            <button class="icon-btn" id="themeToggle" aria-label="Toggle theme">
              <svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.91 4.58A8.5 8.5 0 1 0 19.42 19a7.2 7.2 0 1 1-4.5-14.42Z"/></svg>
              <svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 1 0 0 10a5 5 0 0 0 0-10Zm0-4a1 1 0 0 1 1 1v1.2a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Zm0 15.8a1 1 0 0 1 1 1V21a1 1 0 1 1-2 0v-1.2a1 1 0 0 1 1-1Zm9-6.8a1 1 0 0 1-1 1h-1.2a1 1 0 1 1 0-2H20a1 1 0 0 1 1 1ZM6.2 12a1 1 0 0 1-1 1H4a1 1 0 1 1 0-2h1.2a1 1 0 0 1 1 1Zm11.34-6.34a1 1 0 0 1 1.42 0l.85.85a1 1 0 0 1-1.42 1.42l-.85-.85a1 1 0 0 1 0-1.42ZM5.19 17.39a1 1 0 0 1 1.42 0l.85.85a1 1 0 1 1-1.42 1.42l-.85-.85a1 1 0 0 1 0-1.42Zm13.77 1.42a1 1 0 0 1-1.42 0l-.85-.85a1 1 0 1 1 1.42-1.42l.85.85a1 1 0 0 1 0 1.42ZM7.46 7.08a1 1 0 0 1-1.42 0l-.85-.85a1 1 0 0 1 1.42-1.42l.85.85a1 1 0 0 1 0 1.42Z"/></svg>
            </button>
            <button class="menu-toggle" id="menuToggle" aria-expanded="false" aria-controls="headerMain" aria-label="Toggle navigation">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>
    `;
  }

  if (footerMount) {
    footerMount.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-grid footer-block">
          <div class="footer-brand">
            <a href="index.html" class="brand">Black</a>
            <p class="footer-copy">Black designs and builds calm, high-performance digital experiences for ambitious teams. We combine editorial clarity, strong systems, and measured motion to create work that feels premium and performs in real conditions.</p>
          </div>
          <nav class="footer-links" aria-label="Footer navigation">
            <a href="index.html">Home</a>
            <a href="about.html">About</a>
            <a href="projects.html">Projects</a>
            <a href="blog.html">Blog</a>
            <a href="contact.html">Contact</a>
          </nav>
          <div class="footer-contact">
            <p class="footer-label">Contact</p>
            <a class="footer-email" href="mailto:hello@blackstudio.co">hello@blackstudio.co</a>
          </div>
          <div class="social-links" aria-label="Social links">
            <a href="#" aria-label="X">X / Twitter</a>
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
          </div>
        </div>
        <div class="container footer-bottom">
          <p>&copy; <span id="year"></span> Black. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  initPageLoader();
}

function initPageLoader() {
  if (window.__blackPageLoaderReady) return;
  window.__blackPageLoaderReady = true;

  const loader = document.createElement("div");
  loader.className = "page-loader";
  loader.id = "pageLoader";
  loader.setAttribute("aria-hidden", "true");
  loader.innerHTML = `
    <div class="page-loader-inner" role="status" aria-live="polite">
      <span class="page-loader-spinner" aria-hidden="true"></span>
      <p class="page-loader-text">Build with BLACK</p>
    </div>
  `;
  document.body.appendChild(loader);

  let timer = null;
  let visible = false;

  const showLoader = () => {
    if (visible) return;
    visible = true;
    loader.classList.add("is-visible");
    document.body.classList.add("is-loading-nav");
  };

  const hideLoader = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    visible = false;
    loader.classList.remove("is-visible");
    document.body.classList.remove("is-loading-nav");
  };

  const scheduleShow = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(showLoader, 180);
  };

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest("a[href]");
    if (!link) return;
    if (link.hasAttribute("download")) return;
    if (link.getAttribute("target") === "_blank") return;
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const href = link.getAttribute("href") || "";
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

    const nextUrl = new URL(link.href, window.location.href);
    if (nextUrl.origin !== window.location.origin) return;
    if (nextUrl.pathname === window.location.pathname && nextUrl.search === window.location.search && nextUrl.hash) return;

    scheduleShow();
  });

  window.addEventListener("pageshow", hideLoader);
  window.addEventListener("beforeunload", hideLoader);
}
