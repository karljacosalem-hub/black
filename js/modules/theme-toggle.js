const STORAGE_KEY = "black-theme";

export function initThemeToggle() {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const wash = document.getElementById("themeWash");
  if (!toggle) return;

  const saved = localStorage.getItem(STORAGE_KEY);
  const initial = saved || "dark";
  if (initial === "light") root.setAttribute("data-theme", "light");

  const setTheme = (theme, clickEvent) => {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    localStorage.setItem(STORAGE_KEY, theme);

    if (!wash) return;
    const x = clickEvent?.clientX ?? window.innerWidth / 2;
    const y = clickEvent?.clientY ?? window.innerHeight / 2;
    wash.style.setProperty("--wash-x", `${x}px`);
    wash.style.setProperty("--wash-y", `${y}px`);
    document.body.classList.add("theme-switching");
    wash.classList.remove("is-active");
    window.requestAnimationFrame(() => {
      wash.classList.add("is-active");
    });

    window.setTimeout(() => {
      wash.classList.remove("is-active");
      document.body.classList.remove("theme-switching");
    }, 460);
  };

  toggle.addEventListener("click", (event) => {
    const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";
    setTheme(next, event);
  });
}
