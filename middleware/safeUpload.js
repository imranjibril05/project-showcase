const upload = require("./upload");

const safeUploadSingle = (field) => {
  return (req, res, next) => {
    upload.single(field)(req, res, (err) => {
      if (err) {
        console.error("Upload error:", err);
        return res.status(500).json({
          message: "Upload failed"
        });
      }
      next();
    });
  };
};

module.exports = safeUploadSingle;