let projectsPromise;

async function fetchProjects() {
  const response = await fetch("data/projects.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load projects: ${response.status}`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Projects payload is not an array");
  }
  return data;
}

function getProjectsCache() {
  if (!projectsPromise) {
    projectsPromise = fetchProjects();
  }
  return projectsPromise;
}

export async function getAllProjects() {
  return getProjectsCache();
}

export async function getProjectBySlug(slug) {
  if (!slug) return null;
  const projects = await getProjectsCache();
  return projects.find((project) => project.slug === slug) || null;
}

export async function getProjectsByStatus(status) {
  const projects = await getProjectsCache();
  if (!status || status === "all") return projects;
  return projects.filter((project) => String(project.status || "").toLowerCase() === String(status).toLowerCase());
}

export async function getFeaturedProjects(limit = 3) {
  const projects = await getProjectsCache();
  return projects.slice(0, Math.max(0, limit));
}