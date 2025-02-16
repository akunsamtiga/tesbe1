// src/routes/reviewRoutes.js:
const express = require('express');
const router = express.Router();
const { createReview, getReviewsByProduct, getAllReviews } = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', getAllReviews);
router.post('/', authMiddleware, createReview);  // Hanya user yang login dapat membuat review
router.get('/product/:id', getReviewsByProduct);

module.exports = router;
