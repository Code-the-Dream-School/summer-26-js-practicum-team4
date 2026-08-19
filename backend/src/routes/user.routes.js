const express = require("express");
const authenticationMiddleware = require("../middleware/authentication");

// Route handler function imports
const { getUser, deleteUser } = require("../controllers/user.controller");

// Router to handle all routes to users
const router = express.Router();

// Routes
router.get("/profile", authenticationMiddleware, getUser);
router.delete("/profile", authenticationMiddleware, deleteUser);

module.exports = router;
