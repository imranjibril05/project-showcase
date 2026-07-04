const API_URL = API + "/auth";
const GOOGLE_CLIENT_ID = "569048598863-jp2rtuf68ujtm4pgkaejt9f77gir2ums.apps.googleusercontent.com";

// ======================
// MODALS
// ======================

function openRegisterModal() {
  document.getElementById("registerModal").style.display = "flex";
}

function openLoginModal() {
  document.getElementById("loginModal").style.display = "flex";
}

function closeAuthModals() {
  document.getElementById("registerModal").style.display = "none";
  document.getElementById("loginModal").style.display = "none";
}

// ======================
// REGISTER
// ======================

async function register() {
  try {
    const nameInput = document.getElementById("registerName");
    const emailInput = document.getElementById("registerEmail");
    const passwordInput = document.getElementById("registerPassword");
    const profilePicInput = document.getElementById("registerProfilePic");

   
    if (!nameInput || !emailInput || !passwordInput) {
      return showToast("Register inputs not found.", "error");
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    console.log("Register values:", { name, email, password });

    if (!name || !email || !password) {
      return showToast("Please fill in all fields.");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    if (profilePicInput.files.length > 0) {
      formData.append("profilePic", profilePicInput.files[0]);
    }

    const res = await fetch(API_URL + "/register", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    console.log("Server response:", data);

    if (!res.ok) {
      return showToast(data.message, "error");
    }

    localStorage.setItem("token", data.token);

    closeAuthModals();
    window.location.href = "/profile.html";

  } catch (err) {
    console.error(err);
   showToast("Register failed", "error");
  }
}

// ======================
// LOGIN
// ======================

async function login() {
  try {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      return showToast("Please enter email and password.", "error");
    }

    const res = await fetch(API_URL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return showToast(data.message, "error");
    }

    localStorage.setItem("token", data.token);

    closeAuthModals();
    window.location.href = "/profile.html";

  } catch (err) {
    console.error(err);
    showToast("Login failed", "error" );
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("registerProfilePic");
  const preview = document.getElementById("profilePreview");

  if (!input || !preview) return;

  input.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      preview.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
});
function initGoogleLogin() {

  if (typeof google === "undefined") return;

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleLogin
  });

 google.accounts.id.renderButton(
    document.getElementById("googleLoginBtn"),
    {
      theme: "outline",
      size: "large"
    }
  );

  google.accounts.id.renderButton(
    document.getElementById("googleButtonRegister"),
    {
      theme: "outline",
      size: "large"
    }
  );



}
async function handleGoogleLogin(response) {

  try {

    const res = await fetch(API_URL + "/google-login", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        credential: response.credential
      })

    });

    const data = await res.json();

    if (!res.ok) {
      return showToast(data.message, "error");
    }

    localStorage.setItem("token", data.token);

    window.location = "/profile.html";

  } catch (err) {

    console.error(err);

    showToast("Google login failed", "error ");

  }

}
window.onload = () => {

  initGoogleLogin();

};