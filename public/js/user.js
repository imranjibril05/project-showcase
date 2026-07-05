import { API } from "./config.js";
import { getImageUrl, isAdmin } from "./utils.js";
import { showToast } from "./toast.js";
const userId = new URLSearchParams(window.location.search).get("id");

if (!userId) {
  document.body.innerHTML = "<h2>User not found</h2>";
  throw new Error("Missing userId");
}

loadUserProjects();

// ======================
// LOAD USER PROJECTS
// ======================
async function loadUserProjects() {
  try {
    const res = await fetch(`${API}/projects/user/${userId}`);
    const projects = await res.json();

    renderProjects(projects);

  } catch (err) {
    console.error(err);
  }
}

// ======================
// LOCAL RENDER (NO DEPENDENCY)
// ======================
function renderProjects(projects) {
  const container = document.getElementById("projects");

  container.innerHTML = projects.map(p => `
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

        <p>${p.description}</p>

        <div class="project-footer">

          <div class="project-author" onclick="openUser('${p.user?._id}')">

            <div class="author-avatar">
              <img
                src="${p.user?.profilePic || 'https://i.imgur.com/HeIi0wU.png'}"
                alt="${p.user?.name}"
              >
            </div>

            <span>${p.user?.name || "Unknown"}</span>

          </div>

        </div>

      </div>

    </div>
  `).join("");
}  


// ======================
// HELPERS
// ======================
function openUser(id) {
  window.location = "/user.html?id=" + id;
}

function openProject(id) {
  window.location = "/project.html?id=" + id;
}

    