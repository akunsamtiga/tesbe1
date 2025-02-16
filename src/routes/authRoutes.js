// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, refreshToken, logoutUser } = require('../controllers/authController');
const { loginValidationRules, registerValidationRules, validate } = require('../middlewares/validators');
const authMiddleware = require('../middlewares/authMiddleware');

router.post("/register", registerValidationRules(), validate, registerUser);
router.post('/login', loginValidationRules(), validate, loginUser);
router.post('/refresh-token', refreshToken);
// Endpoint logout memerlukan token autentikasi
router.post('/logout', authMiddleware, logoutUser);

module.exports = router;
