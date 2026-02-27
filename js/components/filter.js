export function initFilter() {
  const filterButtons = document.querySelectorAll(".chip[data-filter]");
  const projectItems = document.querySelectorAll(".project-item");
  if (!filterButtons.length || !projectItems.length) return;

  const hideProject = (item) => {
    if (item.hidden || item.classList.contains("is-hidden")) return;
    item.classList.add("is-hidden");
    window.setTimeout(() => {
      if (item.classList.contains("is-hidden")) item.hidden = true;
    }, 320);
  };

  const showProject = (item) => {
    if (!item.hidden && !item.classList.contains("is-hidden")) return;
    item.hidden = false;
    item.classList.add("is-hidden");
    window.requestAnimationFrame(() => {
      item.classList.remove("is-hidden");
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";
      filterButtons.forEach((btn) => btn.classList.toggle("is-active", btn === button));
      projectItems.forEach((item) => {
        const show = filter === "all" || item.dataset.status === filter;
        if (show) showProject(item);
        else hideProject(item);
      });
    });
  });
}