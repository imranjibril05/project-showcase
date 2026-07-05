// config.js

const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const API = isLocal
  ? "http://localhost:5000/api"
  : "https://project-showcase-fi39.onrender.com/api";