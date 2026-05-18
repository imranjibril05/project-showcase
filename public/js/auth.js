const API_URL = API + "/auth";

async function register() {
  try {
    const formData = new FormData();

    formData.append("name", document.getElementById("name").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("password", document.getElementById("password").value);

    const file = document.getElementById("profilePic").files[0];
    if (file) formData.append("profilePic", file);

    const res = await fetch(API_URL + "/register", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (!res.ok) return alert(data.message);

    localStorage.setItem("token", data.token);

    // IMPORTANT: delay redirect slightly
    setTimeout(() => {
      window.location = "/profile.html";
    }, 300);

  } catch (err) {
    console.error(err);
    alert("Register failed");
  }
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API_URL + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) return alert(data.message);

  localStorage.setItem("token", data.token);
  window.location = "/profile.html";
}