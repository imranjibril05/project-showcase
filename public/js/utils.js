import { API } from "./config.js";

// =========================
// TOKEN
// =========================

export function getToken() {
  return localStorage.getItem("token");
}

// =========================
// CURRENT USER
// =========================

export async function getCurrentUser() {
  const token = getToken();

  if (!token) return null;

  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) return null;

    return await res.json();

  } catch (err) {
    console.error(err);
    return null;
  }
}

// =========================
// USER ID
// =========================

export function getUserIdFromToken() {
  const token = getToken();

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;

  } catch {
    return null;
  }
}

// =========================
// ADMIN
// =========================

export function isAdmin() {
  const token = getToken();

  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role === "admin";

  } catch {
    return false;
  }
}

// =========================
// IMAGE URL
// =========================

export function getImageUrl(img) {

  if (!img)
    return "https://i.imgur.com/HeIi0wU.png";

  if (typeof img === "string")
    return img;

  if (img.url)
    return img.url;

  return "https://i.imgur.com/HeIi0wU.png";
}

// =========================
// NAV AVATAR
// =========================

export function setNavAvatar(user) {

  const avatar = document.getElementById("navAvatar");

  if (!avatar) return;

  avatar.src =
    user?.profilePic ||
    "https://i.imgur.com/HeIi0wU.png";
}

// =========================
// LOGOUT
// =========================

export function logout() {

  localStorage.removeItem("token");

  window.location.href = "/";
}

window.logout = logout;