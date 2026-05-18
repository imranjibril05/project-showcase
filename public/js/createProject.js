const token = localStorage.getItem("token");

let images = [];

function renderImages() {
  const box = document.getElementById("imageBox");

  box.innerHTML = images.map((img, index) => `
    <div class="image-slot" onclick="replaceImage(${index})">

      <img src="${URL.createObjectURL(img)}">

      <button class="remove-btn"
        onclick="removeImage(event, ${index})">x</button>

    </div>
  `).join("");

  // empty slots
  while (images.length < 5) {
    box.innerHTML += `
      <div class="image-slot" onclick="addImageSlot()">
        +
      </div>
    `;
    break;
  }
}

function addImageSlot() {
  if (images.length >= 5) return alert("Max 5 images");

  const input = document.createElement("input");
  input.type = "file";

  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    images.push(file);
    renderImages();
  };

  input.click();
}

function removeImage(e, index) {
  e.stopPropagation();
  images.splice(index, 1);
  renderImages();
}

function replaceImage(index) {
  const input = document.createElement("input");
  input.type = "file";

  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    images[index] = file;
    renderImages();
  };

  input.click();
}

async function createProject() {
  const formData = new FormData();

  formData.append("title", title.value);
  formData.append("description", description.value);
  formData.append(
  "category",
  category.value
);
  formData.append("technologies", technologies.value);
  formData.append("link", link.value);
  

  images.forEach(img => formData.append("images", img));

  const res = await fetch(API + "/projects", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token
    },
    body: formData
  });

  if (res.ok) window.location = "/profile.html";
}

renderImages();