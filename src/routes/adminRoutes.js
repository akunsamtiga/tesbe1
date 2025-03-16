// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats, moderateReview, updateProductStock, deleteProduct, getAdminProfile, updateAdminProfile, uploadProfilePicture } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const upload = require("../middlewares/upload");

// Semua route di sini hanya dapat diakses oleh admin
router.use(authMiddleware, adminMiddleware);

// Statistik dashboard
router.get('/dashboard', getDashboardStats);

// Moderasi review (ubah status review)
router.patch('/reviews/:id', moderateReview);

// Update stok produk
router.patch('/product/:id/stock', updateProductStock);

// Hapus produk
router.delete('/product/:id', deleteProduct);

// **Route Profil Admin**
router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);
router.post("/profile/upload", upload.single("profilePicture"), uploadProfilePicture);

module.exports = router;
