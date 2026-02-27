let blogsPromise;

async function fetchBlogs() {
  const response = await fetch("data/blogs.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`Failed to load blogs: ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error("Blogs payload is not an array");
  return data;
}

function getBlogsCache() {
  if (!blogsPromise) blogsPromise = fetchBlogs();
  return blogsPromise;
}

export async function getAllBlogs() {
  return getBlogsCache();
}

export async function getBlogBySlug(slug) {
  if (!slug) return null;
  const blogs = await getBlogsCache();
  return blogs.find((blog) => blog.slug === slug) || null;
}