document.addEventListener("DOMContentLoaded",async () => {

  const user = await getCurrentUser();

  const avatar = document.getElementById("navAvatar");
  const loginLink = document.getElementById("loginLink");
  const createLink = document.getElementById("createLink");
  const profileMenu = document.getElementById("profileMenu");
  const userName = document.getElementById("navUserName");

  // ======================
  // IF USER EXISTS
  // ======================
  if (user) {

    if (avatar) setNavAvatar(user);

    if (loginLink) loginLink.style.display = "none";

    if (userName) userName.innerText = user.name;

  } else {

    if (avatar) avatar.style.display = "none";
    if (createLink) createLink.style.display = "none";
    if (profileMenu) profileMenu.style.display = "none";
  }

});
function toggleMenu() {
  const menu = document.getElementById("profileMenu");
  if (!menu) return;

  menu.classList.toggle("hidden");
}



window.toggleMenu = toggleMenu;
