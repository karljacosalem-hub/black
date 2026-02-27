export function initNavbar() {
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const headerMain = document.getElementById("headerMain");
  const menuClose = document.getElementById("menuClose");
  const menuPanel = document.getElementById("mobileMenuPanel");

  if (!header || !menuToggle || !headerMain) return;

  const setScrolled = () => header.classList.toggle("is-scrolled", window.scrollY > 10);

  const setExpandedState = (isOpen) => {
    if (window.innerWidth > 1024) {
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      headerMain.setAttribute("aria-hidden", "false");
      document.body.classList.remove("is-lock");
      document.body.classList.remove("menu-open");
      header.classList.remove("menu-open");
      return;
    }
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    headerMain.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("is-lock", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    header.classList.toggle("menu-open", isOpen);
  };

  const closeMobile = () => {
    headerMain.classList.remove("is-open");
    setExpandedState(false);
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = headerMain.classList.toggle("is-open");
    setExpandedState(isOpen);
  });

  if (menuClose) menuClose.addEventListener("click", closeMobile);

  headerMain.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobile));

  document.addEventListener("pointerdown", (event) => {
    if (window.innerWidth > 1024) return;
    if (!headerMain.classList.contains("is-open")) return;
    if (menuToggle.contains(event.target)) return;
    if (menuPanel && menuPanel.contains(event.target)) return;
    if (headerMain.contains(event.target)) {
      closeMobile();
      return;
    }
    if (header.contains(event.target)) return;
    closeMobile();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!headerMain.classList.contains("is-open")) return;
    closeMobile();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
      headerMain.classList.remove("is-open");
      setExpandedState(false);
      return;
    }
    setExpandedState(headerMain.classList.contains("is-open"));
  });

  window.addEventListener("scroll", setScrolled, { passive: true });
  setScrolled();
  setExpandedState(false);
}
