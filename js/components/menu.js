import { initNavbar } from "../modules/navbar.js";
import { initSearch } from "../modules/search.js";
import { initCursor } from "../modules/cursor.js";

export function initMenu() {
  initNavbar();
  initSearch();
  initCursor();
}