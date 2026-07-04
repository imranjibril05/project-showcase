import { API } from "./config.js";
(function () {

  if (window.location.pathname.includes("user.html")) {
    return;
  }

  // ======================
  // STATE
  // ======================
  let page = 1;
  let loading = false;
  let end = false;
  let searching = false;

  // ======================
  // INIT
  // ======================
  document.addEventListener("DOMContentLoaded", () => {
    loadProjects();
  });

  // ======================
  // SCROLL (ONLY PROJECTS PAGE)
  // ======================
  window.addEventListener("scroll", () => {

    if (searching) return;

    const isProjectsPage =
      window.location.pathname.includes("projects.html");

    if (!isProjectsPage) return;

    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 200
    ) {
      loadProjects();
    }
  });

  // ======================
  // LOAD PROJECTS
  // ======================
  async function loadProjects() {
    if (loading || end) return;

    loading = true;

    try {

      const isHomePage =
        window.location.pathname === "/" ||
        window.location.pathname.includes("index.html");

      const url = isHomePage
        ? `${API}/projects?page=1&limit=6`
        : `${API}/projects?page=${page}`;

      const res = await fetch(url);
      const projects = await res.json();

      if (!projects.length) {
        end = true;
        return;
      }

      displayProjects(projects, true);
      page++;

    } catch (err) {
      console.error("Load projects error:", err);
    }

    loading = false;
  }

  // ======================
  // DISPLAY
  // ======================
  function displayProjects(projects, append = false) {
    const container = document.getElementById("projects");
    if (!container) return;

    const currentUserId = getUserIdFromToken?.();
    const admin = isAdmin?.();

    const html = projects.map(p => `
      <div class="project-card projectCard">

        <div class="project-image" onclick="openProject('${p._id}')">
          ${
            p.images?.length
              ? `<img src="${getImageUrl(p.images[0])}" alt="${p.title}">`
              : `<div style="color:white;padding:20px;">No Image</div>`
          }

          <div class="category-tag">
            ${p.category || "Creative"}
          </div>
        </div>

        <div class="project-content">

          <h3>${p.title}</h3>

          <p
          
          >${(p.description)}</p>

          <p class="tech">
           ${(p.technologies || []).map(t => `<span>${t}</span>`).join("")}
          </p>

          <div class="project-footer">

            <div class="project-author" onclick="openUser('${p.user?._id}')">
              <div class="author-avatar">
                <img src="${
                  p.user?.profilePic ||
                  "https://i.imgur.com/HeIi0wU.png"
                }">
              </div>
              <span>${p.user?.name || "Unknown"}</span>
            </div>

            <div class="project-actions">

  <button class="like-btn" onclick="likeProjectUI(event,'${p._id}',this)">
    <i class="fa-regular fa-heart"></i>
    <span>${p.likes?.length || 0}</span>
  </button>

  <span class="comment-btn" onclick="openProject('${p._id}')">
    <i class="fa-regular fa-comment"></i>
    <span>${p.comments?.length || 0}</span>
  </span>

</div>

          </div>

          ${
            (p.user?._id === currentUserId || admin)
              ? `<button class="deleteBtn" onclick="deleteProject('${p._id}')">Delete</button>`
              : ""
          }

        </div>
      </div>
    `).join("");

    container.innerHTML = append
      ? container.innerHTML + html
      : html;
  }

  // ======================
  // HELPERS
  // ======================
  function truncate(text, max = 120) {
    return text?.length > max ? text.slice(0, max) + "..." : text || "";
  }

  function openUser(userId) {
    window.location = "/user.html?id=" + userId;
  }

  function openProject(id) {
    window.location = "/project.html?id=" + id;
  }

 function getImageUrl(img) {
  if (!img) return "";
  if (typeof img === "string" && img.startsWith("http")) return img;
  return `${API}/uploads/${img}`;
}

  // ======================
  // DELETE
  // ======================
  async function deleteProject(id) {
    if (!confirm("Delete project?")) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API}/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token
        }
      });

      const data = await res.json();

      if (!res.ok) {
        return showToast(data.message || "Delete failed", "error");
      }

      location.reload();

    } catch (err) {
      console.error(err);
    }
  }

  // ======================
  // CATEGORY FILTER
  // ======================
  /*async function filterCategory(category) {
    const container = document.getElementById("projects");
    if (!container) return;

    if (category === "all") {
      page = 1;
      end = false;
      searching = false;
      container.innerHTML = "";
      loadProjects();
      return;
    }

    searching = true;

    try {
      const res = await fetch(
        API + "/projects/category?category=" + encodeURIComponent(category)
      );

      if (!res.ok) {
        console.error("Category failed:", res.status);
        return;
      }

      const data = await res.json();
      displayProjects(data, false);

    } catch (err) {
      console.error(err);
    }
  }*/
 function filterCategory(category, btn) {

  const container = document.getElementById("projects");
  if (!container) return;

  // active button UI fix
  document.querySelectorAll(".filter-btn")
    .forEach(b => b.classList.remove("active"));

  if (btn) btn.classList.add("active");

  // reset infinite scroll state
  page = 1;
  end = false;
  searching = category !== "all";

  container.innerHTML = "";

  // ALL
  if (category === "all") {
    loadProjects();
    return;
  }

  // FILTERED FETCH (IMPORTANT)
  fetch(`${API}/projects/category?category=${category}`)
    .then(res => res.json())
    .then(data => {
      displayProjects(data, false);
    })
    .catch(err => console.error(err));
}

  // ======================
  // GLOBAL EXPORTS
  // ======================
  window.openUser = openUser;
  window.openProject = openProject;
  window.deleteProject = deleteProject;
  window.filterCategory = filterCategory;

})();