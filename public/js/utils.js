// ======================
// IMAGE HANDLING
// ======================
function getImageUrl(img) {
  if (!img) return "";

  if (typeof img === "object" && img.url) {
    return img.url;
  }
 

  return img;
}

// ======================
// NAV PROFILE AVATAR
// ======================
function setNavAvatar(user) {
  const img = document.getElementById("navAvatar");
  if (!img) return;

  img.src = user?.profilePic || "https://i.imgur.com/HeIi0wU.png";
}

// ======================
// TOKEN HELPERS
// ======================
function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1])).id;
  } catch {
    return null;
  }
}

function isAdmin() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    return JSON.parse(atob(token.split(".")[1])).role === "admin";
  } catch {
    return false;
  }
}

// ======================
// OPTIONAL: SAFE USER GET
// ======================
/*function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}*/
async function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await fetch(API + "/auth/me", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  return await res.json();
}
function logout() {
  localStorage.removeItem("token");
  window.location = "/login.html";
}

window.logout = logout;