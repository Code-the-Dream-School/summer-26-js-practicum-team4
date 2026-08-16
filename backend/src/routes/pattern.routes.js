const express = require("express");

// Route handler function imports
const {
  getAllUserPatterns,
  createPattern,
  getPattern,
  deletePattern,
  updatePattern,
  generatePattern,
} = require("../controllers/pattern.controller");

// Middleware imports
const upload = require("../middleware/upload.middleware");
const authMiddleware = require("../middleware/authentication");

// Router to handle all routes to patterns
const router = express.Router();

// JWT authentication for route
router.use(authMiddleware);

// Generate image
router.post("/generate", upload.single("image"), generatePattern);

// Retrieve all image URLs for given user
router.route("/").get(getAllUserPatterns);

// CRUD operations for individual patterns
router.route("/").post(createPattern);
router.route("/:id").get(getPattern);
router.route("/:id").delete(deletePattern);
router.route("/:id").patch(updatePattern);

module.exports = router;
