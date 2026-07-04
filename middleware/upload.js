const multer = require("multer"); 
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "projects",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [
      { width: 800, height: 800, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" }
                     ]
  }
});

const upload = multer({ storage,  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB max
  } });

module.exports = upload;