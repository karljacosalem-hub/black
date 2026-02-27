import { getAllBlogs, getBlogBySlug } from "./blogData.js";

const FALLBACK_IMAGE = "/assets/images/fallback/default.jpg";

function normalizeImagePath(path) {
  const value = String(path || "").trim();
  if (!value) return FALLBACK_IMAGE;
  return value.startsWith("/") ? value : `/${value}`;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function showFallback(node, text) {
  if (!node) return;
  node.innerHTML = `<p class="lead">${text}</p>`;
}

async function renderBlogList() {
  const grid = document.getElementById("blogGrid");
  if (!grid) return;
  try {
    const blogs = await getAllBlogs();
    grid.innerHTML = blogs
      .map(
        (blog) => `
        <article class="card project-card reveal blog-card">
          <figure class="project-thumb">
            <img src="${normalizeImagePath(blog.image)}" alt="${blog.title || "Blog"} cover image" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';" />
          </figure>
          <p class="eyebrow">${blog.category || "Article"}</p>
          <h3>${blog.title || "Untitled"}</h3>
          <p class="lead">${blog.excerpt || ""}</p>
          <p class="metric-label">${formatDate(blog.date)}</p>
          <a class="card-link" href="blog-post.html?slug=${encodeURIComponent(blog.slug || "")}">Read More</a>
        </article>
      `
      )
      .join("");
  } catch (_error) {
    showFallback(grid, "Unable to load articles right now.");
  }
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value || "";
}

function estimateReadingTime(content) {
  const words = String(content || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

function renderTags(tags) {
  const node = document.getElementById("blogPostTags");
  if (!node) return;
  node.innerHTML = "";
  tags.forEach((tag) => {
    const chip = document.createElement("span");
    chip.className = "blog-tag";
    chip.textContent = tag;
    node.appendChild(chip);
  });
}

function preloadHeroImage(src) {
  const href = normalizeImagePath(src);
  const existing = document.querySelector(`link[rel="preload"][as="image"][href="${href}"]`);
  if (existing) return;
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = href;
  document.head.appendChild(link);
}

function setSupportingImage(id, src, alt) {
  const host = document.getElementById(id);
  if (!host) return;
  host.innerHTML = `
    <figure class="supporting-media">
      <img src="${src}" alt="${alt}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';" />
    </figure>
  `;
}

async function renderBlogPost() {
  const title = document.getElementById("blogPostTitle");
  if (!title) return;

  const slug = new URLSearchParams(window.location.search).get("slug") || "";
  if (!slug) {
    setText("blogPostTitle", "Article not found");
    setText("blogPostSubtitle", "No blog slug was provided.");
    return;
  }

  try {
    const blog = await getBlogBySlug(slug);
    if (!blog) {
      setText("blogPostTitle", "Article not found");
      setText("blogPostSubtitle", "The requested article does not exist.");
      return;
    }

    document.title = `Black | ${blog.title}`;
    const contentBlocks = Array.isArray(blog.content) ? blog.content : [];
    const readingTime = estimateReadingTime(contentBlocks.join(" "));
    const author = blog.author || "Black Editorial Team";
    const tags = Array.isArray(blog.tags) && blog.tags.length
      ? blog.tags
      : [blog.category, "Editorial", "Digital Strategy"].filter(Boolean);

    setText("blogPostTitle", blog.title);
    setText("blogPostSubtitle", blog.subtitle);
    setText("blogPostDate", formatDate(blog.date));
    setText("blogPostCategory", blog.category);
    setText("blogPostAuthor", author);
    setText("blogPostReadingTime", readingTime);
    setText("blogPostCategoryMeta", blog.category || "Article");
    setText("blogIntro", contentBlocks[0] || "");
    renderTags(tags);

    const heroMedia = document.getElementById("blogPostHeroMedia");
    if (heroMedia) {
      const src = normalizeImagePath(blog.image);
      preloadHeroImage(src);
      heroMedia.innerHTML = `
        <figure class="blog-hero-media">
          <img src="${src}" alt="${blog.title || "Blog post"} hero image" decoding="async" fetchpriority="high" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';" />
        </figure>
      `;
    }
    setSupportingImage(
      "blogSupportingImage",
      normalizeImagePath(blog.supportingImage),
      `${blog.title || "Blog post"} supporting image`
    );

    const body = document.getElementById("blogBody");
    if (body) {
      const sections = contentBlocks.slice(1);
      body.innerHTML = sections
        .map((para, idx) => (idx === 1 ? `<h3>Practical Implications</h3><p class="lead">${para}</p>` : `<p class="lead">${para}</p>`))
        .join("");
    }

    const pageUrl = window.location.href;
    const shareX = document.getElementById("shareX");
    const shareLinkedIn = document.getElementById("shareLinkedIn");
    if (shareX) shareX.href = `https://x.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(blog.title || "Black Blog")}`;
    if (shareLinkedIn) shareLinkedIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;

    setText("blogPullQuote", blog.pullQuote ? `"${blog.pullQuote}"` : "");
    setText("blogClosing", blog.closing);
  } catch (_error) {
    setText("blogPostTitle", "Article unavailable");
    setText("blogPostSubtitle", "Unable to load content right now.");
  }
}

export async function initBlogViews() {
  await Promise.all([renderBlogList(), renderBlogPost()]);
}
