// src/routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, addToWishlist);
router.get('/', authMiddleware, getWishlist);
router.delete('/:id', authMiddleware, removeFromWishlist);

module.exports = router;
