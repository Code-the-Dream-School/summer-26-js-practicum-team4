const express = require("express");

// Route handler function imports
const {} = require("../controllers/user.controller");

// Router to handle all routes to users
const router = express.Router();

// Routes
router.get("/profile", getUser);
router.patch("/profile", updateUser);
router.delete("/profile", deleteUser);

module.exports = router;
