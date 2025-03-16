// src/routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const WishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rute untuk menambahkan ke wishlist
router.post('/add/:productId', authMiddleware, WishlistController.addToWishlist);

// Rute untuk menghapus dari wishlist
router.delete('/remove/:productId', authMiddleware, WishlistController.removeFromWishlist);

// Rute untuk mendapatkan wishlist user
router.get('/', authMiddleware, WishlistController.getWishlist);

module.exports = router;
