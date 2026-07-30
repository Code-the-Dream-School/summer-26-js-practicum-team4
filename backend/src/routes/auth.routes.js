const express = require('express');
const { registerUser, loginUser, getCurrentUser, logoutUser } = require('../controllers/auth.controller');
const authenticationMiddleware = require('../middleware/authentication')
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticationMiddleware, getCurrentUser)
router.post('/logout', logoutUser)

module.exports = router;
