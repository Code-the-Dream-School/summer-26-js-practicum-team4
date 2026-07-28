const express = require("express");

// Route handler function imports
const upload = require("../middleware/upload.middleware");
const { generatePattern, getAllUserPatterns } = require("../controllers/pattern.controller");

// Router to handle all routes to patterns
const router = express.Router();

// Retrieve all image URLs for given user
router.get("/", getAllUserPatterns);

// Generate image
router.post("/generate", upload.single("image"), generatePattern);

module.exports = router;
