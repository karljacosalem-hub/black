export function initAnimations() {
  const reveals = document.querySelectorAll(".reveal");
  const titleReveals = document.querySelectorAll(".title-reveal");

  if ("IntersectionObserver" in window) {
    const groups = new Map();
    reveals.forEach((node) => {
      const section = node.closest("section") || document.body;
      const current = groups.get(section) || [];
      current.push(node);
      groups.set(section, current);
    });

    groups.forEach((nodes) => {
      nodes.forEach((node, idx) => {
        node.style.setProperty("--reveal-delay", `${Math.min(idx * 70, 280)}ms`);
      });
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        }
      },
      { threshold: 0.16, rootMargin: "-4% 0px -10% 0px" }
    );

    reveals.forEach((node) => io.observe(node));

    const titleIO = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.35 }
    );

    titleReveals.forEach((node) => titleIO.observe(node));
  }

  const form = document.querySelector(".contact-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    if (form.checkValidity()) return;
    event.preventDefault();
    form.querySelectorAll("input,textarea").forEach((field) => {
      if (!field.checkValidity()) field.reportValidity();
    });
  });
}