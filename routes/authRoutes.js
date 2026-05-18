const router = require("express").Router();
const upload = require("../middleware/upload");
const safeUpload = require("../middleware/safeUpload");
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const c = require("../controllers/authController");

// ======================
// REGISTER
// ======================
router.post(
  "/register",
  safeUpload("profilePic"),
  c.register
);

// ======================
// LOGIN
// ======================
router.post("/login", c.login);

// ======================
// GET CURRENT USER (FIX)
// ======================
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;