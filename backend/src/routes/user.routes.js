const express = require("express");
const authenticationMiddleware = require("../middleware/authentication.js");
// Route handler function imports
const {
  deleteUser,
} = require("../controllers/user.controller");

// Router to handle all routes to users
const router = express.Router();

// Routes
router.delete("/profile", authenticationMiddleware, deleteUser);

module.exports = router;
