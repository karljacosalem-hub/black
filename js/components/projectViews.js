import { getAllProjects, getFeaturedProjects, getProjectBySlug } from "./projectData.js";

const FALLBACK_IMAGE = "/assets/images/fallback/default.jpg";

function normalizeImagePath(path) {
  const value = String(path || "").trim();
  if (!value) return FALLBACK_IMAGE;
  return value.startsWith("/") ? value : `/${value}`;
}

function projectImage(project) {
  return normalizeImagePath(project?.image);
}

function executionImage(project, key) {
  return normalizeImagePath(project?.[key]);
}

function heroAlt(project) {
  return `${project?.title || "Project"} hero image`;
}

function statusLabel(value) {
  const v = String(value || "").trim().toLowerCase();
  if (!v) return "Project";
  return v.charAt(0).toUpperCase() + v.slice(1);
}

function parseMetric(metric) {
  const text = String(metric || "").trim();
  if (!text) return { value: "-", label: "" };
  const match = text.match(/^(\S+)\s+(.+)$/);
  if (!match) return { value: text, label: "" };
  return { value: match[1], label: match[2] };
}

function makeProjectItemCard(project) {
  const image = projectImage(project);
  return `
    <article class="project-item project-card reveal" data-status="${String(project.status || "").toLowerCase()}">
      <figure class="project-thumb">
        <img src="${image}" alt="${project.title || "Project"} preview image" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';" />
      </figure>
      <span class="badge">${statusLabel(project.status)}</span>
      <h3>${project.title || "Untitled Project"}</h3>
      <p>${project.excerpt || project.subtitle || ""}</p>
      <a href="single-project.html?slug=${encodeURIComponent(project.slug || "")}" class="card-link">Open Case</a>
    </article>
  `;
}

function makeProjectFeatureCard(project) {
  const image = projectImage(project);
  return `
    <article class="card project-card reveal" data-status="${String(project.status || "").toLowerCase()}">
      <figure class="project-thumb">
        <img src="${image}" alt="${project.title || "Project"} card image" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';" />
      </figure>
      <h3>${project.title || "Untitled Project"}</h3>
      <p>${project.excerpt || project.subtitle || ""}</p>
      <a href="single-project.html?slug=${encodeURIComponent(project.slug || "")}" class="card-link">Open Case</a>
    </article>
  `;
}

function showFallback(container, message) {
  if (!container) return;
  const fallback = container.querySelector("[data-project-fallback]");
  if (fallback) {
    fallback.textContent = message;
    fallback.hidden = false;
    return;
  }
  container.innerHTML = `<p class="lead">${message}</p>`;
}

async function renderIndexProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;
  try {
    const projects = await getFeaturedProjects(3);
    grid.innerHTML = projects.map(makeProjectItemCard).join("");
  } catch (_error) {
    showFallback(grid, "Unable to load projects right now.");
  }
}

async function renderProjectsPage() {
  const featuredGrid = document.getElementById("projectsPageGrid");
  const statusGrid = document.getElementById("projectsStatusGrid");
  if (!featuredGrid && !statusGrid) return;
  try {
    const projects = await getAllProjects();

    if (featuredGrid) {
      featuredGrid.innerHTML = projects.map(makeProjectFeatureCard).join("");
    }

    if (statusGrid) {
      statusGrid.innerHTML = projects.map(makeProjectItemCard).join("");
    }
  } catch (_error) {
    showFallback(featuredGrid, "Unable to load projects right now.");
    showFallback(statusGrid, "Unable to load projects right now.");
  }
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (!node) return;
  node.textContent = value || "";
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

function setExecutionImage(id, src, alt) {
  const host = document.getElementById(id);
  if (!host) return;
  host.innerHTML = `
    <figure class="execution-media">
      <img src="${src}" alt="${alt}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';" />
    </figure>
  `;
}

function setContextImage(id, src, alt) {
  const host = document.getElementById(id);
  if (!host) return;
  host.innerHTML = `
    <figure class="context-media">
      <img src="${src}" alt="${alt}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';" />
    </figure>
  `;
}

function setCounter(id, metricText) {
  const node = document.getElementById(id);
  if (!node) return;
  const parsed = parseMetric(metricText || "");
  const metricToken = String(parsed.value || "");
  const numberMatch = metricToken.match(/^([+-]?)(\d+(?:\.\d+)?)(.*)$/);
  if (!numberMatch) {
    node.textContent = metricToken || "-";
    node.removeAttribute("data-target");
    node.removeAttribute("data-prefix");
    node.removeAttribute("data-suffix");
    node.removeAttribute("data-decimals");
    return;
  }

  const sign = numberMatch[1] || "";
  const number = Number.parseFloat(numberMatch[2] || "0");
  const tail = numberMatch[3] || "";
  const decimals = (numberMatch[2].split(".")[1] || "").length;
  node.dataset.target = String(number);
  node.dataset.prefix = sign;
  node.dataset.suffix = tail;
  node.dataset.decimals = String(decimals);
  node.textContent = `${sign}0${tail}`;
}

async function renderSingleProject() {
  const titleNode = document.getElementById("projectTitle");
  if (!titleNode) return;

  const slug = new URLSearchParams(window.location.search).get("slug") || "";
  if (!slug) {
    setText("projectTitle", "Project not found");
    setText("projectSubtitle", "No project slug was provided in the URL.");
    return;
  }

  try {
    const project = await getProjectBySlug(slug);
    if (!project) {
      setText("projectTitle", "Project not found");
      setText("projectSubtitle", "The requested project does not exist.");
      return;
    }

    document.title = `Black | ${project.title}`;

    setText("projectTitle", project.title);
    setText("projectSubtitle", project.subtitle);
    setText("projectStatus", statusLabel(project.status));
    setText("projectMeta", ` ${project.industry} / ${project.year}`);

    const heroMedia = document.getElementById("projectHeroMedia");
    if (heroMedia) {
      const src = projectImage(project);
      preloadHeroImage(src);
      heroMedia.innerHTML = `
        <figure class="project-hero-media">
          <img src="${src}" alt="${heroAlt(project)}" decoding="async" fetchpriority="high" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';" />
        </figure>
      `;
    }

    setText("projectBackground1", project.background?.[0] || "");
    setText("projectBackground2", project.background?.[1] || "");
    setContextImage(
      "projectContextImage",
      normalizeImagePath(project?.contextImage),
      `${project.title || "Project"} context image`
    );

    const approachGrid = document.getElementById("projectApproachGrid");
    if (approachGrid) {
      const approach = Array.isArray(project.approach) ? project.approach : [];
      if (!approach.length) {
        showFallback(approachGrid, "Approach details are unavailable for this project.");
      } else {
        approachGrid.innerHTML = approach
        .map(
          (step, index) => `
            <article class="card reveal">
              <p class="icon">${String(index + 1).padStart(2, "0")}</p>
              <h3>${step.title || ""}</h3>
              <p>${step.description || ""}</p>
            </article>
          `
        )
        .join("");
      }
    }

    setText("projectExecution1", project.execution?.[0] || "");
    setText("projectExecution2", project.execution?.[1] || "");
    const executionA = executionImage(project, "executionImageA");
    let executionB = executionImage(project, "executionImageB");
    if (executionA === executionB) {
      console.warn(`[project] executionImageA and executionImageB are identical for slug "${slug}". Using fallback for image B.`);
      executionB = FALLBACK_IMAGE;
    }
    console.info("[project] execution image A:", executionA);
    console.info("[project] execution image B:", executionB);
    setExecutionImage("projectExecutionImageA", executionA, `${project.title || "Project"} execution image A`);
    setExecutionImage("projectExecutionImageB", executionB, `${project.title || "Project"} execution image B`);
    setText("projectResultsSummary", project.results?.summary || "");

    const metrics = Array.isArray(project.results?.metrics) ? project.results.metrics : [];
    [1, 2, 3].forEach((idx) => {
      const metric = parseMetric(metrics[idx - 1] || "");
      setCounter(`metricValue${idx}`, metric.value);
      setText(`metricLabel${idx}`, metric.label);
    });

    setText("projectQuote", `"${project.excerpt || project.subtitle}"`);
  } catch (_error) {
    setText("projectTitle", "Project unavailable");
    setText("projectSubtitle", "Unable to load project data right now.");
  }
}

export async function initProjectViews() {
  await Promise.all([renderIndexProjects(), renderProjectsPage(), renderSingleProject()]);
}
