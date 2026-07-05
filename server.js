require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// middleware
app.use(cors({
  origin: "https://project-showcase-pi-beige.vercel.app",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));

// start server ONLY after db connects
async function start() {
  try {
    await connectDB();
     app.listen(5000, () => {
      console.log("Server running on port 5000");
    });

  } catch (err) {
    console.error(err);
  }
}
start();
