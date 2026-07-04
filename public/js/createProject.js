import { API } from "./config.js";
const token = localStorage.getItem("token");
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

let images = [];

function renderImages() {

  const box = document.getElementById("imageBox");

  box.innerHTML = images.map((img, index) => `

    <div class="image-slot image-filled">

      <img src="${URL.createObjectURL(img)}">

      <button
        class="remove-btn"
        onclick="removeImage(event, ${index})"
      >
        ×
      </button>

    </div>

  `).join("");

  // add upload slot
  if (images.length < 5) {

    box.innerHTML += `

      <div
        class="image-slot add-slot"
        onclick="addImageSlot()"
      >
      </div>

    `;
  }
}

window.addImageSlot = function() {
  if (images.length >= 5) return showToast("Max 5 images", "error");

  const input = document.createElement("input");
  input.type = "file";

  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

       if (file.size > MAX_SIZE) {
      return   showToast("Image too large. Max 2MB allowed.");
    }

    images.push(file);
    renderImages();
  };

  input.click();
}

window.addImageSlot = addImageSlot;

window.removeImage = function(e, index) {
  e.stopPropagation();
  images.splice(index, 1);
  renderImages();
};

window.replaceImage = function(index) {
  const input = document.createElement("input");
  input.type = "file";

  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_SIZE) {
      return showToast("Image too large. Max 2MB allowed.", "error");
    }


    images[index] = file;
    renderImages();
  };

  input.click();
}

 window.createProject = async function() {
  const btn = document.getElementById("createBtn");

  try {
    // 🔥 LOADING STATE
    btn.disabled = true;
    btn.innerText = "Uploading project...";

    const formData = new FormData();

    formData.append("title", title.value);
    formData.append("description", description.value);
    formData.append("category", category.value);
    formData.append("technologies", technologies.value);
    formData.append("link", link.value);

    images.forEach(img => formData.append("images", img));

    const res = await fetch(`${API}/projects`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token
      },
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message, "error");
      return;
    }

    btn.innerText = "Done!";
    window.location = "/profile.html";

  } catch (err) {
    console.error(err);
    showToast("Upload failed", "error");

  } finally {
    btn.disabled = false;
    btn.innerText = "Create Project";
  }
}

renderImages();