// ======================
// SAFE GLOBAL STATE
// ======================
import { API } from "./config.js";
import {
  getCurrentUser,
  logout
} from "./utils.js";
import { showToast } from "./toast.js";
import { projects, CLUBS, INITIAL_EVENTS, INNOVATORS } from "./data.js";

let currentCategory = "All";

// ======================
// USER INIT
// ======================
async function initUser() {

  const token = localStorage.getItem("token");

  const avatar = document.getElementById("navAvatar");
  const profileMenu = document.getElementById("profileMenu");
  const loginBtn = document.getElementById("navAuth");
  const createLink = document.getElementById("createLink");
  const userName = document.getElementById("navUserName");

  if (!token) {

    // NOT LOGGED IN
    if (avatar) avatar.style.display = "none";
    if (profileMenu) profileMenu.style.display = "none";
    if (createLink) createLink.style.display = "none";

    if (loginBtn) loginBtn.style.display = "flex";

    return;
  }

  const user = await getCurrentUser();

  if (user) {

    if (avatar) {
      avatar.style.display = "block";
      avatar.src = user.profilePic || "https://i.imgur.com/HeIi0wU.png";
    }

    if (userName) userName.innerText = user.name;

    if (profileMenu) profileMenu.style.display = "block";

    if (loginBtn) loginBtn.style.display = "none";

    if (createLink) createLink.style.display = "block";
  }
}

// ======================
// PROFILE MENU (FIXED)
// ======================
function toggleProfileMenu() {
  const menu = document.getElementById("profileMenu");
  if (!menu) return;

  const isHidden = menu.classList.contains("hidden");

  if (isHidden) {
    menu.classList.remove("hidden");
    menu.classList.add("active");
  } else {
    menu.classList.add("hidden");
    menu.classList.remove("active");
  }
}

window.toggleMenu = toggleProfileMenu;

// close on outside click
function setupProfileOutsideClick() {
  document.addEventListener("click", (e) => {
    const menu = document.getElementById("profileMenu");
    const trigger = document.querySelector(".profile-trigger");

    if (!menu || !trigger) return;

    if (!trigger.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add("hidden");
      menu.classList.remove("active");
    }
  });
 

}

// ======================
// MOBILE MENU (FIXED)
// ======================
function setupMobileMenu() {t
  const toggle = document.getElementById("menu-toggle");
  if (!toggle) return;

  let overlay = document.getElementById("mobile-overlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "mobile-overlay";
    overlay.className = "mobile-overlay";

    overlay.innerHTML = `
      <div class="mobile-nav">
        <a href="#showcase" class="mobile-nav-link">Showcase</a>
        <a href="#clubs" class="mobile-nav-link">Clubs</a>
        <a href="#events" class="mobile-nav-link">Events</a>
        <a href="#members" class="mobile-nav-link">Innovators</a>
        <a href="/create.html" class="mobile-nav-link">Create</a>
      </div>
    `;

    document.body.appendChild(overlay);

    // 🔥 IMPORTANT: attach link close logic ONCE
    overlay.querySelectorAll(".mobile-nav-link").forEach(link => {
      link.addEventListener("click", () => {
        overlay.classList.remove("active");
        toggle.classList.remove("active");
        navbar.classList.remove("menu-open");
        document.body.style.overflow = "auto";
      });
    });
  }

  const navbar = document.getElementById("navbar");

toggle.addEventListener("click", () => {
  const isActive = toggle.classList.toggle("active");

  overlay.classList.toggle("active");
  navbar.classList.toggle("menu-open", isActive);

  document.body.style.overflow = isActive ? "hidden" : "auto";
});
}
// ======================
// PROJECT RENDERING
// ======================
function renderProjects(searchQuery = "") {
  const grid = document.getElementById("projects");
  if (!grid) return;

  let filtered = projects;

 

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }

  grid.innerHTML = filtered.map((p, i) => `
    <div class="project-card projectCard glass reveal" style="transition-delay:${i * 0.05}s">

      <div class="project-image">
        <img 
          src="${p.screenshot}" 
          alt="${p.title}" 
          loading="lazy" 
          onerror="this.src='/images/fallback.png'"
        >
        <div class="category-tag">${p.category}</div>
      </div>

      <div class="project-content">

        <div class="tags-container">
          ${(p.tags || []).map(tag => `
            <span class="project-tag">${tag}</span>
          `).join("")}
        </div>

        <h3>${p.title}</h3>
        <p>${p.description}</p>

        <div class="project-footer">
          <div class="project-author">
            <div class="author-avatar">
              <img src="https://i.pravatar.cc/100?u=${p.author}" alt="${p.author}">
            </div>
            <span>${p.author}</span>
          </div>
        </div>

      </div>
    </div>
  `).join("");

  setupReveal();
}

// ======================
// CATEGORY FILTER
// ======================


// ======================
// SEARCH
// ======================
function setupSearch() {
  const input = document.getElementById("search");
  if (!input) return;

  input.addEventListener("input", e => {
    renderProjects(e.target.value);
  });
}

// ======================
// REVEAL FIX (IMPORTANT)
// ======================
function setupReveal() {
  const els = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
}

// ======================
// NAVBAR SCROLL
// ======================
function setupNavbar() {
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", () => {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });
}





async function likeProjectUI(e, id, btn) {
  e.stopPropagation();

  const token = localStorage.getItem("token");
  if (!token) return showToast("Login first", "error");

  try {
    const res = await fetch(`${API}/projects/${id}/like`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const data = await res.json();
    btn.innerHTML = `❤️ ${data.likes}`;
  } catch (err) {
    console.error(err);
    showToast("Error", "error");
  }
}
 window.likeProjectUI = likeProjectUI;


 function renderHomeSections() {
  const clubs = document.getElementById("d");
  const events = document.getElementById("events-list");
  const members = document.getElementById("innovators-grid");

  if (clubs) {
    clubs.innerHTML = CLUBS.map(c => `
      <div class="club-card">

          <a 
      href="${c.telegram}"
      target="_blank"
      class="club-link"
    >
      <i class="fa-solid fa-arrow-up-right-from-square"></i>
    </a>




        <img src="${c.image}">
        <h3>${c.name}</h3>
        <p>${c.description}</p>
      </div>
    `).join("");
  }

  if (events) {
    events.innerHTML = INITIAL_EVENTS.map(e => `
      <div class="event-card">
        <div class="event-date">
          <span>${e.date}</span>
          <span>${e.month}</span>
        </div>
        <h3>${e.title}</h3>
        <p>${e.description}</p>
      </div>
    `).join("");
  }

  if (members) {
    members.innerHTML = INNOVATORS.map(m => `
      <div class="member-card">
        <img src="${m.avatar}">
        <h3>${m.name}</h3>
        <p>${m.role}</p>
      </div>
    `).join("");
  }
}


// ======================
// INIT ALL
// ======================
document.addEventListener("DOMContentLoaded", async () => {
  await initUser();

  if (projects?.length) {
    renderProjects();
}

  setupNavbar();
  setupMobileMenu();
  setupSearch();
  setupProfileOutsideClick();
  setupReveal();
  renderHomeSections();

  
  
});
function goToAllProjects() {
  window.location.href = "/projects.html";
}

window.goToAllProjects = goToAllProjects;
window.renderProjects = renderProjects;
window.logout = logout;
 