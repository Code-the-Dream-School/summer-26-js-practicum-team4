const multer = require("multer");

const storage = multer.memoryStorage();

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

function fileFilter(req, file, callback) {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(new Error("Only JPEG, PNG, and WebP images are allowed."));
  }

  return callback(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;
