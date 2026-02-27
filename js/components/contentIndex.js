import { getAllBlogs } from "./blogData.js";
import { getAllProjects } from "./projectData.js";

let contentIndexPromise;
const FALLBACK_IMAGE = "/assets/images/fallback/default.jpg";

function normalizeImagePath(path) {
  const value = String(path || "").trim();
  if (!value) return FALLBACK_IMAGE;
  return value.startsWith("/") ? value : `/${value}`;
}

function normalizeTagList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((tag) => String(tag || "").trim()).filter(Boolean);
}

function buildBlogItem(blog) {
  const slug = String(blog.slug || "");
  const category = String(blog.category || "Blog");
  const tags = normalizeTagList(blog.tags);
  if (!tags.length) tags.push(category);
  return {
    id: String(blog.id || `blog-${slug}`),
    title: String(blog.title || "Untitled Blog"),
    slug,
    excerpt: String(blog.excerpt || blog.content?.[0] || ""),
    content: Array.isArray(blog.content) ? blog.content : [],
    image: normalizeImagePath(blog.image),
    type: "blog",
    tags,
    category,
    status: "",
    link: `blog-post.html?slug=${encodeURIComponent(slug)}`
  };
}

function buildProjectItem(project) {
  const slug = String(project.slug || "");
  const category = String(project.industry || "Project");
  const status = String(project.status || "").toLowerCase();
  const tags = normalizeTagList(project.tags);
  if (!tags.length) {
    if (category) tags.push(category);
    if (status) tags.push(status);
  }
  return {
    id: String(project.id || `project-${slug}`),
    title: String(project.title || "Untitled Project"),
    slug,
    excerpt: String(project.subtitle || project.results?.summary || ""),
    content: Array.isArray(project.content) ? project.content : [],
    image: normalizeImagePath(project.image),
    type: "project",
    tags,
    category,
    status,
    link: `single-project.html?slug=${encodeURIComponent(slug)}`
  };
}

async function buildContentIndex() {
  const [blogs, projects] = await Promise.all([getAllBlogs(), getAllProjects()]);
  const blogItems = Array.isArray(blogs) ? blogs.map(buildBlogItem) : [];
  const projectItems = Array.isArray(projects) ? projects.map(buildProjectItem) : [];
  return [...blogItems, ...projectItems];
}

export async function getContentIndex() {
  if (!contentIndexPromise) contentIndexPromise = buildContentIndex();
  return contentIndexPromise;
}
