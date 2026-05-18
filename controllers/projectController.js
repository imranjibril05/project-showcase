const Project = require("../models/Project");
const User = require("../models/User"); 

// GET ALL (PAGINATION)
exports.getProjects = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;

    const projects = await Project.find()
      .populate("user", "name profilePic ")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json(projects);
  } catch (err) {
    next(err);
  }
};
exports.getProjectsByUser = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;

    const projects = await Project.find({ user: req.params.userId })
      .populate("user", "name profilePic")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json(projects);
  } catch (err) {
    next(err);
  }
};


// GET ONE
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("user", "name profilePic")
      .populate("comments.user", "name profilePic");
    res.json(project);
  } catch (err) {
    next(err);
  }
};
    

// CREATE
exports.createProject = async (req, res) => {
  try {
    const images = req.files?.map(f => f.path) || [];

    const project = await Project.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      technologies: req.body.technologies?.split(",") || [],
      link: req.body.link,
      images, // ALWAYS ARRAY OF STRINGS
      user: req.user.id
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//catagories
exports.getProjectsByCategory = async (req, res, next) => {
  try {

    const projects = await Project.find({
      category: req.params.category
    })
    .populate("user", "name profilePic")
    .sort({ createdAt: -1 });

    res.json(projects);

  } catch (err) {
    next(err);
  }
};
//Update Project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (
  project.user.toString() !== req.user.id &&
  req.user.role !== "admin"
) {
  return res.status(403).json({ message: "Unauthorized" });
}

    // ======================
    // TEXT UPDATE
    // ======================
    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.link = req.body.link || project.link;

    project.technologies = req.body.technologies
      ? req.body.technologies.split(",").map(t => t.trim())
      : project.technologies;

    // ======================
    // IMAGE UPDATE (FIXED)
    // ======================

    const replaceIndex = req.body.replaceIndex !== undefined
      ? Number(req.body.replaceIndex)
      : null;

    // CASE 1: replace single image
    if (req.files && req.files.length > 0 && replaceIndex !== null && !isNaN(replaceIndex)) {

      if (project.images[replaceIndex] !== undefined) {
        project.images[replaceIndex] = req.files[0].path;
      } else {
        // fallback safety
        project.images.push(req.files[0].path);
      }
    }

    // CASE 2: add new images (no replaceIndex)
    else if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => f.path);
      project.images = [...project.images, ...newImages];
    }

    await project.save();

    res.json(project);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// =======================
// DELETE PROJECT
// =======================


exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    // ======================
    // GET USER ROLE
    // ======================
    const user = await User.findById(req.user.id);
    const isAdmin = user?.role === "admin";

    // ======================
    // OWNER OR ADMIN CHECK
    // ======================
    if (!isAdmin && project.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not allowed"
      });
    }

    await project.deleteOne();

    res.json({
      message: "Project deleted"
    });

  } catch (err) {
    next(err);
  }
};

// LIKE
exports.toggleLike = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    const userId = req.user.id;

    const index = project.likes.findIndex(
      id => id.toString() === userId
    );

    if (index === -1) {
      project.likes.push(userId);
    } else {
      project.likes.splice(index, 1);
    }

    await project.save();

    res.json({ likes: project.likes.length });
  } catch (err) {
    next(err);
  }
};

// COMMENT
exports.addComment = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    const newComment = {
      text: req.body.text,
      user: req.user.id
    };

    project.comments.push(newComment);

    await project.save();

    res.json(newComment);
  } catch (err) {
    next(err);
  }
};
//Edit comment
exports.editComment = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    const comment = project.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // only owner can edit
  if (
  comment.user.toString() !== req.user.id &&
  req.user.role !== "admin"
) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    comment.text = req.body.text;

    await project.save();

    res.json({
      success: true,
      updatedComment: comment
    });

  } catch (err) {
    next(err);
  }
};
// DELETE COMMENT
exports.deleteComment = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const comment = project.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // ======================
    // GET USER ROLE
    // ======================
    const user = await User.findById(req.user.id);
    const isAdmin = user?.role === "admin";

    // ======================
    // OWNER OR ADMIN CHECK
    // ======================
    if (!isAdmin && comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    comment.deleteOne();
    await project.save();

    res.json({ success: true });

  } catch (err) {
    next(err);
  }
};

// SEARCH PROJECTS
exports.searchProjects = async (req, res, next) => {
  try {

    const query = req.params.query;

    const projects = await Project.find({
      title: {
        $regex: query,
        $options: "i"
      }
    })
    .populate("user", "name profilePic")
    .sort({ createdAt: -1 });

    res.json(projects);

  } catch (err) {
    next(err);
  }
};