// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require("../utils/passport");
const { registerUser, loginUser, refreshToken, logoutUser } = require('../controllers/authController');
const { loginValidationRules, registerValidationRules, validate } = require('../middlewares/validators');
const authMiddleware = require('../middlewares/authMiddleware');
const { generateAccessToken } = require('../utils/generateToken');

router.post('/register', registerValidationRules(), validate, registerUser);
router.post('/login', loginValidationRules(), validate, loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', authMiddleware, logoutUser);

// --- Routes untuk Google OAuth ---
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
  router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      // Buat token berdasarkan data user yang telah di-authenticate
      const payload = { id: req.user.id, email: req.user.email, role: req.user.role };
      const accessToken = generateAccessToken(payload);
      // Redirect ke frontend dengan menyertakan token di query parameter
      res.redirect(`${process.env.FRONTEND_URL}/success?token=${accessToken}`);
    }
  );  
    
module.exports = router;