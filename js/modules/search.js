export function initSearch() {
  const header = document.getElementById("siteHeader");
  const toggle = document.getElementById("searchToggle");
  const input = document.getElementById("siteSearch");
  const form = document.getElementById("searchShell");

  if (!header || !toggle || !input || !form) return;

  const open = () => {
    if (window.innerWidth <= 1024) return;
    header.classList.add("search-active");
    toggle.setAttribute("aria-expanded", "true");
    window.requestAnimationFrame(() => input.focus());
  };

  const close = () => {
    if (window.innerWidth <= 1024) return;
    header.classList.remove("search-active");
    toggle.setAttribute("aria-expanded", "false");
    input.blur();
  };

  toggle.addEventListener("click", () => {
    if (window.innerWidth <= 1024) return;
    const active = header.classList.contains("search-active");
    if (active) close();
    else open();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      open();
    }
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth <= 1024) return;
    if (!header.classList.contains("search-active")) return;
    if (header.contains(event.target)) return;
    close();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();
    const url = new URL("search.html", window.location.href);
    if (query) url.searchParams.set("q", query);
    window.location.assign(url.toString());
  });
}
