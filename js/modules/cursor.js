export function initCursor() {
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (!finePointer) return;

  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (!dot || !ring) return;

  document.body.classList.add("has-custom-cursor");

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let ringX = pointerX;
  let ringY = pointerY;
  let ringScale = 1;

  const render = () => {
    ringX += (pointerX - ringX) * 0.16;
    ringY += (pointerY - ringY) * 0.16;
    dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;
    requestAnimationFrame(render);
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    },
    { passive: true }
  );

  const hoverables = document.querySelectorAll("a, button, input, textarea, .chip, .card, .project-item");
  hoverables.forEach((node) => {
    node.addEventListener("pointerenter", () => {
      ring.classList.add("is-hover");
      ringScale = 1.45;
    });
    node.addEventListener("pointerleave", () => {
      ring.classList.remove("is-hover");
      ringScale = 1;
    });
  });

  render();
}
