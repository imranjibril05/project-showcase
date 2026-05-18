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
    const res = await fetch(API + "/projects/user/" + userId);
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
    <div class="projectCard">

      <div onclick="openProject('${p._id}')">
        ${
          p.images?.length
            ? `<img src="${getImageUrl(p.images[0])}">`
            : `<div>No Image</div>`
        }
      </div>

      <h3>${p.title}</h3>
      <p>${p.description}</p>

      <div class="userInfo" onclick="openUser('${p.user?._id}')">

        <img
          class="avatarSmall"
          src="${p.user?.profilePic || 'https://i.imgur.com/HeIi0wU.png'}"
        >

        <span>
          ${p.user?.name || "Unknown"}
        </span>

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

function getImageUrl(img) {
  if (!img) return "";
  if (typeof img === "string" && img.startsWith("http")) return img;
  return "http://localhost:5000/uploads/" + img;
}