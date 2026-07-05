// toast.js

export function showToast(message, type = "info") {

  const container = document.getElementById("toast-container");

  if (!container) {
    console.warn("Toast container not found.");
    return;
  }

  const toast = document.createElement("div");

  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {

    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 300);

  }, 3000);
}

// keep global for onclick handlers or older code
window.showToast = showToast;