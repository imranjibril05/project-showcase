const id = new URLSearchParams(window.location.search).get("id");

function getUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return JSON.parse(atob(token.split(".")[1])).id;
}

async function loadProject() {
  const res = await fetch(API + "/projects/" + id);
  const p = await res.json();

  document.getElementById("project").innerHTML = `
    <h2>${p.title}</h2>
    <p>${p.description}</p>

    ${p.images?.map(img => `
      <img src="${getImageUrl(img)}">
    `).join("")}

    <button onclick="likeProject('${p._id}', this)">
      ❤️ ${p.likes.length}
    </button>
  `;

  loadComments(p);
}

async function likeProject(id, btn) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(API + "/projects/" + id + "/like", {
      method: "PUT",
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();
    btn.innerHTML = `❤️ ${data.likes}`;
  } catch {
    alert("Error");
  }
}

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
  const text = document.getElementById("commentText").value;

  await fetch(API + "/projects/" + id + "/comment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({ text })
  });

  loadProject();
}

async function deleteComment(commentId) {
  await fetch(API + "/projects/" + id + "/comment/" + commentId, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });

  loadProject();
}

async function editComment(commentId, oldText) {
  const newText = prompt("Edit:", oldText);
  if (!newText) return;

  await fetch(API + "/projects/" + id + "/comment/" + commentId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({ text: newText })
  });

  loadProject();
}

loadProject();