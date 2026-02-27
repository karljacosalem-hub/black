export function initCounters() {
  const counters = Array.from(document.querySelectorAll(".counter[data-target]"));
  if (!counters.length) return;

  const animate = (node) => {
    if (node.dataset.counted === "true") return;
    node.dataset.counted = "true";

    const target = Number.parseFloat(node.dataset.target || "0");
    if (!Number.isFinite(target)) {
      node.textContent = node.dataset.target || node.textContent;
      return;
    }

    const duration = Math.min(1500, Math.max(1000, Number.parseInt(node.dataset.duration || "1200", 10)));
    const decimals = Number.parseInt(node.dataset.decimals || "0", 10);
    const prefix = node.dataset.prefix || "";
    const suffix = node.dataset.suffix || "";

    const start = performance.now();
    const from = 0;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const frame = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);
      const value = from + (target - from) * eased;
      node.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        node.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
      }
    };

    requestAnimationFrame(frame);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.4, rootMargin: "0px 0px -10% 0px" }
  );

  counters.forEach((node) => observer.observe(node));
}