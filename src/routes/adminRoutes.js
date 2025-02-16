// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats, moderateReview, updateProductStock, deleteProduct } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

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

module.exports = router;
