const express = require("express");

// Route handler function imports
const { getAllUserPatterns } = require("../controllers/pattern.controller");

// Router to handle all routes to patterns
const router = express.Router();

// Retrieve all image URLs for given user
router.get("/", getAllUserPatterns);

module.exports = router;
