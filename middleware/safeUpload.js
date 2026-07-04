const upload = require("./upload");

const safeUploadSingle = (field) => {
  return [
    upload.single(field),
    (req, res, next) => {
      next();
    },
    (err, req, res, next) => {
      if (err) {
        console.error("Upload error:", err.message);

        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "Image too large. Max size is 2MB."
          });
        }

        return res.status(500).json({
          message: "Upload failed"
        });
      }
      next();
    }
  ];
};

module.exports = safeUploadSingle;