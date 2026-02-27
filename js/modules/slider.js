export function initSlider() {
  const track = document.getElementById("sliderTrack");
  const viewport = document.querySelector(".slider-viewport");
  const prev = document.getElementById("prevSlide");
  const next = document.getElementById("nextSlide");
  if (!track || !viewport || !prev || !next) return;

  const slides = Array.from(track.children);
  let index = 0;

  const render = () => {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === index);
    });
    const activeSlide = slides[index];
    if (activeSlide) {
      viewport.style.height = `${activeSlide.scrollHeight}px`;
    }
  };

  const goTo = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    render();
  };

  prev.addEventListener("click", () => goTo(index - 1));
  next.addEventListener("click", () => goTo(index + 1));

  let auto = window.setInterval(() => goTo(index + 1), 6200);
  const pause = () => {
    window.clearInterval(auto);
    auto = window.setInterval(() => goTo(index + 1), 6200);
  };

  [prev, next, track].forEach((node) => node.addEventListener("pointerdown", pause));
  window.addEventListener("resize", render);
  render();
}
