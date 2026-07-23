const express = require("express");

// Route handler function imports
const { getAllPatterns } = require("../controllers/pattern.controller");

// Router to handle all routes to patterns
const router = express.Router();

// Retrieve all image URLs for given user
router.get("/getAllPatterns", getAllPatterns);

module.exports = router;
