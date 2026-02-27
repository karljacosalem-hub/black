import { getContentIndex } from "./contentIndex.js";

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function parseContext() {
  const params = new URLSearchParams(window.location.search);
  return {
    query: String(params.get("q") || "").trim(),
    tag: String(params.get("tag") || "").trim(),
    category: String(params.get("category") || "").trim(),
    status: String(params.get("status") || "").trim().toLowerCase(),
    type: String(params.get("type") || "all").toLowerCase()
  };
}

function getPageCopy(context) {
  if (context.tag) {
    return {
      title: "Tag Results",
      subtitle: `Showing items tagged "${context.tag}"`,
      empty: `No items found for tag "${context.tag}".`
    };
  }
  if (context.category) {
    return {
      title: "Category Results",
      subtitle: `Showing items in category "${context.category}"`,
      empty: `No items found in category "${context.category}".`
    };
  }
  if (context.status) {
    const label = context.status === "completed" ? "Completed Projects" : "Ongoing Projects";
    return {
      title: label,
      subtitle: `Showing ${context.status} project entries`,
      empty: `No ${context.status} projects are available right now.`
    };
  }
  return {
    title: "Search Results",
    subtitle: context.query ? `Results for "${context.query}"` : "Use search to find blog posts and projects",
    empty: context.query ? `No results found for "${context.query}".` : "Type a query in the global search bar to get started."
  };
}

function matchSearch(item, query) {
  const q = normalize(query);
  if (!q) return true;
  const haystack = [
    item.title,
    item.excerpt,
    item.category,
    ...(Array.isArray(item.tags) ? item.tags : [])
  ]
    .map(normalize)
    .join(" ");
  return haystack.includes(q);
}

function matchContext(item, context) {
  if (context.status) {
    if (item.type !== "project") return false;
    if (normalize(item.status) !== normalize(context.status)) return false;
  }
  if (context.tag) {
    const tags = Array.isArray(item.tags) ? item.tags : [];
    const target = normalize(context.tag);
    if (!tags.some((tag) => normalize(tag).includes(target))) return false;
  }
  if (context.category) {
    if (!normalize(item.category).includes(normalize(context.category))) return false;
  }
  if (context.query && !matchSearch(item, context.query)) return false;
  return true;
}

function applyTypeFilter(items, type) {
  if (type === "blog" || type === "project") {
    return items.filter((item) => item.type === type);
  }
  return items;
}

function hasActiveContext(context) {
  return Boolean(context.query || context.tag || context.category || context.status);
}

function renderResultCard(item) {
  const typeLabel = item.type === "blog" ? "Blog" : "Project";
  const openLabel = item.type === "blog" ? "Read More" : "Open Case";
  return `
    <article class="card project-card reveal">
      <figure class="project-thumb">
        <img src="${escapeHtml(item.image || "/assets/images/fallback/default.jpg")}" alt="${escapeHtml(item.title || typeLabel)} card image" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='/assets/images/fallback/default.jpg';" />
      </figure>
      <span class="badge">${typeLabel}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p class="lead">${escapeHtml(item.excerpt)}</p>
      <a class="card-link" href="${item.link}">${openLabel}</a>
    </article>
  `;
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}

function updateTypeButtons(type) {
  document.querySelectorAll("[data-listing-type]").forEach((button) => {
    const active = button.dataset.listingType === type;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function updateTypeInUrl(type) {
  const url = new URL(window.location.href);
  if (!type || type === "all") url.searchParams.delete("type");
  else url.searchParams.set("type", type);
  history.replaceState({}, "", url);
}

async function renderListingPage() {
  const grid = document.getElementById("listingGrid");
  if (!grid) return;

  const context = parseContext();
  const copy = getPageCopy(context);
  setText("listingTitle", copy.title);
  setText("listingSubtitle", copy.subtitle);

  try {
    const dataset = await getContentIndex();
    const baseItems = hasActiveContext(context) ? dataset.filter((item) => matchContext(item, context)) : [];
    const activeType = context.type === "blog" || context.type === "project" ? context.type : "all";
    const finalItems = applyTypeFilter(baseItems, activeType);

    setText("listingCount", `${finalItems.length} result${finalItems.length === 1 ? "" : "s"}`);
    updateTypeButtons(activeType);

    const emptyState = document.getElementById("listingEmpty");
    if (!finalItems.length) {
      grid.innerHTML = "";
      if (emptyState) {
        emptyState.hidden = false;
        emptyState.querySelector("p").textContent = copy.empty;
      }
      return;
    }

    if (emptyState) emptyState.hidden = true;
    grid.innerHTML = finalItems.map(renderResultCard).join("");

    document.querySelectorAll("[data-listing-type]").forEach((button) => {
      button.addEventListener("click", () => {
        const type = String(button.dataset.listingType || "all").toLowerCase();
        updateTypeInUrl(type);
        const filtered = applyTypeFilter(baseItems, type);
        setText("listingCount", `${filtered.length} result${filtered.length === 1 ? "" : "s"}`);
        updateTypeButtons(type);
        if (!filtered.length) {
          grid.innerHTML = "";
          if (emptyState) {
            emptyState.hidden = false;
            emptyState.querySelector("p").textContent = copy.empty;
          }
          return;
        }
        if (emptyState) emptyState.hidden = true;
        grid.innerHTML = filtered.map(renderResultCard).join("");
      });
    });
  } catch (_error) {
    setText("listingCount", "0 results");
    grid.innerHTML = "";
    const emptyState = document.getElementById("listingEmpty");
    if (emptyState) {
      emptyState.hidden = false;
      emptyState.querySelector("p").textContent = "Unable to load content right now. Please try again.";
    }
  }
}

export async function initListingViews() {
  await renderListingPage();
}
