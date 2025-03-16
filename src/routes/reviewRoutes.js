// src/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { createReview, getReviewsByProduct, getAllReviews, editReview, deleteReview } = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', getAllReviews);
router.post('/', authMiddleware, createReview);  // Hanya user yang login dapat membuat review
router.get('/product/:id', getReviewsByProduct);
router.put('/:id', authMiddleware, editReview);  // Hanya admin dapat mengedit review
router.delete('/:id', authMiddleware, deleteReview);  // Hanya admin dapat menghapus review

module.exports = router;
