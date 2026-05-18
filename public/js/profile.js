const token = localStorage.getItem("token");

if (!token) {
  window.location = "/login.html";
}

// ======================
// GLOBAL STATE
// ======================
let selectedImageIndex = null;

// ======================
// HELPERS
// ======================
function getUserIdFromToken() {
  try {
    return JSON.parse(atob(token.split(".")[1])).id;
  } catch {
    return null;
  }
}

function getImageUrl(img) {

  if (!img) {
    return "https://i.imgur.com/HeIi0wU.png";
  }

  if (typeof img === "string") {
    return img;
  }

  if (typeof img === "object" && img.url) {
    return img.url;
  }

  return "https://i.imgur.com/HeIi0wU.png";
}

// ======================
// LOAD PROJECTS
// ======================
// ======================
// LOAD PROJECTS (FIXED)
// ======================
async function loadMyProjects() {
  const userId = getUserIdFromToken();

  const res = await fetch(API + "/projects/user/" + userId);
  const projects = await res.json();

  const container = document.getElementById("myProjects");

  container.innerHTML = projects.map(p => `
    <div class="projectCard">

      <div class="imageRow">
        ${p.images?.map(img => `
          <img 
            src="${getImageUrl(img)}"
            class="project-img"
          >
        `).join("")}
      </div>

      <h3>${p.title}</h3>
      <p>${p.description}</p>

      <div class="actions">
        <button onclick="fillEdit('${p._id}')">Edit</button>
        <button onclick="deleteProject('${p._id}')">Delete</button>
      </div>

    </div>
  `).join("");
}

// ======================
// FILL EDIT FORM
// ======================
window.fillEdit = async function (id, imgIndex = null) {
  const res = await fetch(API + "/projects/" + id);
  const p = await res.json();

  document.getElementById("editId").value = p._id;
  document.getElementById("editTitle").value = p.title;
  document.getElementById("editDescription").value = p.description;
  document.getElementById("editTechnologies").value =
    p.technologies?.join(", ") || "";

  selectedImageIndex = imgIndex;

  const preview = document.getElementById("editImagesPreview");

  preview.innerHTML = p.images.map((img, i) => `
    <div class="edit-box">
      <img 
        src="${getImageUrl(img)}"
        onclick="selectImage(${i})"
        class="${i === imgIndex ? 'active-img' : ''}"
      >
    </div>
  `).join("");
};

// ======================
// SELECT IMAGE TO REPLACE
// ======================
window.selectImage = function (index) {
  selectedImageIndex = index;

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const id = document.getElementById("editId").value;

    const formData = new FormData();

    formData.append("images", file);
    formData.append("replaceIndex", index);

    formData.append("title", document.getElementById("editTitle").value);
    formData.append("description", document.getElementById("editDescription").value);
    formData.append("technologies", document.getElementById("editTechnologies").value);

    const res = await fetch(API + "/projects/" + id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token
      },
      body: formData
    });

    const data = await res.json();

    if (!res.ok) return alert(data.message);

    alert("Image updated");

    fillEdit(id);
    loadMyProjects();
  };

  input.click();
};

// ======================
// UPDATE TEXT ONLY (NO IMAGE OVERWRITE)
// ======================
window.updateProject = async function () {
  const id = document.getElementById("editId").value;

  if (!id) return alert("Select project first");

  const formData = new FormData();

  formData.append("title", document.getElementById("editTitle").value);
  formData.append("description", document.getElementById("editDescription").value);
  formData.append("technologies", document.getElementById("editTechnologies").value);

  const res = await fetch(API + "/projects/" + id, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token
    },
    body: formData
  });

  const data = await res.json();

  if (!res.ok) return alert(data.message);

  alert("Updated");
  loadMyProjects();
};

// ======================
// DELETE
// ======================
window.deleteProject = async function (id) {
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
      return alert(data.message || "Failed to delete");
    }

    loadMyProjects();

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};


document.addEventListener("DOMContentLoaded", async () => {
  const user = await getCurrentUser();

  const img = document.getElementById("profilePicView");
  const name = document.getElementById("profileName");

  if (img) {
    img.src = user?.profilePic || "https://i.imgur.com/HeIi0wU.png";
  }

  if (name) {
    name.innerText = user?.name || "User";
  }
});

// ======================
// INIT
// ======================
loadMyProjects();