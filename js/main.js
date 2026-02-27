import { initShell } from "./components/shell.js";
import { initMenu } from "./components/menu.js";
import { initTheme } from "./components/theme.js";
import { initFilter } from "./components/filter.js";
import { initSlider } from "./components/slider.js";
import { initAnimations } from "./components/animations.js";
import { initProjectViews } from "./components/projectViews.js";
import { initCounters } from "./components/counters.js";
import { initBlogViews } from "./components/blogViews.js";
import { initListingViews } from "./components/listingViews.js";

async function boot() {
  initShell(document.body.dataset.page || "");
  initMenu();
  initTheme();
  initSlider();
  await Promise.all([initProjectViews(), initBlogViews(), initListingViews()]);
  initCounters();
  initFilter();
  initAnimations();

  const yearNode = document.getElementById("year");
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());
}

boot();
