// src/routes/articleRoutes.js
const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// Jika menggunakan middleware upload seperti Multer, import dan gunakan di sini:
const upload = require('../middlewares/upload'); // Pastikan middleware ini sudah dikonfigurasi

// Create Article
router.post('/', upload.single('featuredImage'), articleController.createArticle);

// Get All Articles
router.get('/', articleController.getArticles);

// Get Article by ID
router.get('/:id', articleController.getArticleById);

// Update Article
router.put('/:id', upload.single('featuredImage'), articleController.updateArticle);

// Delete Article
router.delete('/:id', articleController.deleteArticle);

module.exports = router;
