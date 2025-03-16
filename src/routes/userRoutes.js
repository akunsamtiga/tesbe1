// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  getReviewsByUser,
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload'); // Middleware untuk menangani upload file

// Route untuk mendapatkan data profil user
router.get('/profile', authMiddleware, getUserProfile);

// Route untuk mengupdate data profil (nama, alamat, dll)
router.put('/profile', authMiddleware, updateUserProfile);

// Route untuk mengupdate foto profil (dengan upload file)
router.put(
  '/profile/picture',
  authMiddleware,
  upload.single('profilePicture'),
  updateProfilePicture
);

// Route untuk mendapatkan ulasan yang ditulis oleh user
router.get('/reviews', authMiddleware, getReviewsByUser);

module.exports = router;
