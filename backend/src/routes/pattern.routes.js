const express = require("express");

// Route handler function imports
const {
  getAllUserPatterns,
  getAllPatterns,
  createPattern,
  createMultiplePatterns,
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

// Retrieve all patterns from database
router.route("/all").get(getAllPatterns);

// CRUD operations for individual patterns
router.route("/").post(createPattern);
router.route("/:id").get(getPattern);
router.route("/:id").delete(deletePattern);
router.route("/:id").patch(updatePattern);

// Bulk operations
route.route("/bulkcreate").post(createMultiplePatterns);

module.exports = router;
