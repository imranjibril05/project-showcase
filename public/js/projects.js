(function () {


  
if (window.location.pathname.includes("user.html")) {
  // DO NOT RUN HOME FEED ON USER PAGE
  return;
}
  // ======================
  // STATE (ISOLATED)
  // ======================
  let page = 1;
  let loading = false;
  let end = false;
  let searching = false;

  // ======================
  // INIT
  // ======================
  loadProjects();



 window.addEventListener("scroll", () => {

  // STOP PAGINATION WHILE SEARCHING
  if (searching) return;

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
      const res = await fetch(API + "/projects?page=" + page);
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
  <div class="projectCard">

    <div onclick="openProject('${p._id}')">
      ${
        p.images?.length
          ? `<img src="${getImageUrl(p.images[0])}">`
          : `<div>No Image</div>`
      }
    </div>

    <h3>${p.title}</h3>
    <div class="categoryTag">
  ${p.category || "Creative"}
</div>
    <p>${truncate(p.description)}</p>
    <p class="tech">
  ${p.technologies?.join(", ") || ""}
</p>

    <div>
      <button onclick="likeProjectUI(event,'${p._id}',this)">
        ❤️ ${p.likes?.length || 0}
      </button>

      <span onclick="openProject('${p._id}')">
        💬 ${p.comments?.length || 0}
      </span>
    </div>

    <div>
      <div class="userRow" onclick="openUser('${p.user?._id}')">
        <img class="avatarSmall" src="${
          p.user?.profilePic || "https://i.imgur.com/HeIi0wU.png"
        }">

        <span>${p.user?.name || "Unknown"}</span>
      </div>
    </div>

    ${
      (p.user?._id === currentUserId || admin)
        ? `
          <button class="deleteBtn"
            onclick="deleteProject('${p._id}')">
            Delete
          </button>
        `
        : ""
    }

  </div>
`).join("");

    container.innerHTML = append
      ? container.innerHTML + html
      : html;
  }

  // ======================
  // LIKE
  // ======================
  async function likeProjectUI(e, id, btn) {
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) return alert("Login first");

    try {
      const res = await fetch(API + "/projects/" + id + "/like", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token
        }
      });

      const data = await res.json();
      btn.innerHTML = `❤️ ${data.likes}`;

    } catch (err) {
      console.error(err);
    }
  }

  // ======================
  // HELPERS
  // ======================
  function truncate(text, max = 80) {
    return text?.length > max
      ? text.slice(0, max) + "..."
      : text || "";
  }

  function openUser(userId) {
    window.location = "/user.html?id=" + userId;
  }

  function openProject(id) {
    window.location = "/project.html?id=" + id;
  }

 function getImageUrl(img) {

  if (!img) return "";

  // cloudinary/full url
  if (typeof img === "string" && img.startsWith("http")) {
    return img;
  }

  // old local uploads
  return "http://localhost:5000/uploads/" + img;
}

  // ======================
  // EXPOSE GLOBAL ONLY WHAT IS NEEDED
  // ======================
  // ======================

  

// ======================
// SEARCH
// ======================

const searchInput = document.getElementById("search");

/*searchInput.addEventListener("input", async (e) => {

  const query = e.target.value.trim();

  // ======================
  // EMPTY SEARCH
  // ======================
  if (!query) {

    searching = false;

    page = 1;
    end = false;

    document.getElementById("projects").innerHTML = "";

    loadProjects();

    return;
  }

  // ======================
  // SEARCH MODE
  // ======================
  searching = true;

  try {

    const res = await fetch(
      API + "/projects/search/" + query
    );

    const projects = await res.json();

    displayProjects(projects, false);

  } catch (err) {
    console.error("Search error:", err);
  }

});*/


if (searchInput) {
  searchInput.addEventListener("input", async (e) => {

    const query = e.target.value.trim();

    if (!query) {
      searching = false;
      page = 1;
      end = false;
      document.getElementById("projects").innerHTML = "";
      loadProjects();
      return;
    }

    searching = true;

    try {
      const res = await fetch(API + "/projects/search/" + query);
      const projects = await res.json();
      displayProjects(projects, false);
    } catch (err) {
      console.error("Search error:", err);
    }

  });
}

async function deleteProject(id) {

  if (!confirm("Delete project?")) return;

  const token = localStorage.getItem("token");

  try {

    const res = await fetch(API + "/projects/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const data = await res.json();

    if (!res.ok) {
      return alert(data.message || "Delete failed");
    }

    // reload page
    location.reload();

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
}

async function filterCategory(category) {

  if (category === "all") {

    searching = false;

    page = 1;
    end = false;

    document.getElementById("projects").innerHTML = "";

    loadProjects();

    return;
  }

  searching = true;

  try {

    const res = await fetch(
      API + "/projects/category/" + category
    );

    const projects = await res.json();

    displayProjects(projects, false);

  } catch (err) {
    console.error(err);
  }
}


  window.openUser = openUser;
  window.openProject = openProject;
  window.likeProjectUI = likeProjectUI;
  window.deleteProject = deleteProject;
  window.filterCategory = filterCategory;

})();