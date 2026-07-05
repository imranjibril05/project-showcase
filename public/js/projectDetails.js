import { API } from "./config.js";
import { getImageUrl, isAdmin } from "./utils.js";
import { showToast } from "./toast.js";

const id = new URLSearchParams(window.location.search).get("id");
let currentImages = [];
let currentIndex = 0;

function getUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return JSON.parse(atob(token.split(".")[1])).id;
}

async function loadProject() {
  const res = await fetch(`${API}/projects/${id}`);
  const p = await res.json();
document.getElementById("project").innerHTML = `

  <div class="project-top">

    <div class="project-gallery">

      ${p.images?.map((img, i) => `
  <img 
    src="${getImageUrl(img)}"
    onclick='openViewer(${JSON.stringify(p.images.map(getImageUrl))}, ${i})'
    style="cursor:pointer"
  >
`).join("")}

    </div>
      
    <div class="project-info">

  <div class="project-header">
    <div class="project-text">
      <h2>${p.title}</h2>
      <p>${p.description}</p>
    </div>

    <button class="like-btn" onclick="likeProjectUI(event,'${p._id}',this)">
      <i class="fa-regular fa-heart"></i>
      <span class="like-count">${p.likes.length}</span>
    </button>
  </div>

</div>
    

  </div>

`;
function setupCommentTextarea() {
  const textarea = document.getElementById("commentText");

  if (!textarea) return;

  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  });
}

  loadComments(p);
}


function openViewer(images, index) {
  currentImages = images;
  currentIndex = index;

  document.getElementById("imageViewer").classList.remove("hidden");
  document.getElementById("viewerImg").src = currentImages[currentIndex];
}
window.openViewer = openViewer;

function closeViewer() {
  document.getElementById("imageViewer").classList.add("hidden");
}
window.closeViewer = closeViewer;
function nextImage() {
  if (currentIndex < currentImages.length - 1) {
    currentIndex++;
    document.getElementById("viewerImg").src = currentImages[currentIndex];
  }
}
window.nextImage = nextImage;

function prevImage() {
  if (currentIndex > 0) {
    currentIndex--;
    document.getElementById("viewerImg").src = currentImages[currentIndex];
  }
}
window.prevImage = prevImage;

async function likeProjectUI(e, id, btn) {
  if (e) e.stopPropagation();

  const token = localStorage.getItem("token");

  if (!token) {
    return showToast("Login first", "error");
  }

  try {

    const res = await fetch(`${API}/projects/${id}/like`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const data = await res.json();

    // update count only
    const count = btn.querySelector(".like-count");

    if (count) {
      count.innerText = data.likes;
    }

    // toggle heart style
    const icon = btn.querySelector("i");

    if (icon) {
      icon.classList.toggle("fa-regular");
      icon.classList.toggle("fa-solid");
      icon.classList.toggle("liked");
    }

  } catch (err) {
    console.error(err);
  }
}
window.likeProjectUI = likeProjectUI;

async function loadComments(project) {
  const userId = getUserId();

  document.getElementById("comments").innerHTML =
    project.comments.map(c => `
      <div class="commentBox">

        <div class="commentHeader">
          <img class="avatarSmall"
               src="${c.user?.profilePic || 'https://i.imgur.com/HeIi0wU.png'}">

          <b>${c.user?.name || "User"}</b>
        </div>

        <p>${c.text}</p>

       ${c.user?._id === userId || isAdmin() ? `
          <div class="commentActions">
            <button onclick="editComment('${c._id}', '${c.text}')">Edit</button>
            <button onclick="deleteComment('${c._id}')">Delete</button>
          </div>
        ` : ""}

      </div>
    `).join("");
     
}


async function addComment() {
  const input = document.getElementById("commentText");

  if (!input || typeof input.value !== "string") {
    console.error("commentText input missing or invalid");
    return;
  }

  const text = input.value.trim();

  if (!text) {
    showToast("Write comment first", "error");
    return;
  }

  const res = await fetch(`${API}/projects/${id}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({ text })
  });

  const data = await res.json();

  if (!res.ok) {
    console.log("SERVER ERROR:", data);
    return showToast(data.message);
  }

  input.value = "";
  loadProject();
}
window.addComment = addComment;

async function deleteComment(commentId) {
  await fetch(`${API}/projects/${id}/comment/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });

  loadProject();
}
window.deleteComment = deleteComment;

async function editComment(commentId, oldText) {
  const newText = prompt("Edit:", oldText);
  if (!newText) return;

  await fetch(`${API}/projects/${id}/comment/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({ text: newText })
  });

  loadProject();
}
window.editComment = editComment;

loadProject();