// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, updateProfilePicture, getReviewsByUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload'); // untuk menangani upload file

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.put('/profile/picture', authMiddleware, upload.single('profilePicture'), updateProfilePicture);
router.get('/reviews', authMiddleware, getReviewsByUser);

module.exports = router;
