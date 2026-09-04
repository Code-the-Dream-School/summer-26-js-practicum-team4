const express = require("express");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  googleUserAuth,
} = require("../controllers/auth.controller");
const authenticationMiddleware = require("../middleware/authentication");
const router = express.Router();
const validate = require('../middleware/validate');
const { userSchema } = require('../validation/userSchema');

router.post("/register", validate(userSchema), registerUser);
router.post("/login", loginUser);
router.post("/google", googleUserAuth);
router.get("/me", authenticationMiddleware, getCurrentUser);
router.post("/logout", logoutUser);

module.exports = router;
