const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const c = require("../controllers/projectController");

// GET all projects
router.get("/", c.getProjects);


//category
router.get("/category/:category", c.getProjectsByCategory);
router.get("/category", c.getProjectsByCategory);

//search
router.get("/search/:query", c.searchProjects);
//user projects
router.get("/user/:userId", c.getProjectsByUser);
//current user projects
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});




// GET single project
router.get("/:id", c.getProject);

// CREATE project
router.post("/", auth, upload.array("images", 5), c.createProject);
//Update project
router.put("/:id",auth,upload.array("images", 5),c.updateProject);
//DELETE project
router.delete("/:id", auth, c.deleteProject);
// LIKE project
router.put("/:id/like", auth, c.toggleLike);

// COMMENTS
router.post("/:id/comment", auth, c.addComment);
router.put("/:id/comment/:commentId", auth, c.editComment);
router.delete("/:id/comment/:commentId", auth, c.deleteComment);

module.exports = router;