const express = require("express");

// Route handler function imports
const {
  getAllUserPatterns,
  createPattern,
  getPattern,
  deletePattern,
  updatePattern,
} = require("../controllers/pattern.controller");

// Router to handle all routes to patterns
const router = express.Router();

// Retrieve all image URLs for given user
router.route("/").get(getAllUserPatterns);

// CRUD operations for individual patterns
router.route("").post(createPattern);
router.route("/:id").get(getPattern);
router.route("/:id").post(deletePattern);
router.route("/:id").patch(updatePattern);

module.exports = router;
