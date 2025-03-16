// src/routes/heroImageRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadHeroImage'); // Middleware untuk mengunggah gambar
const heroImageController = require('../controllers/heroImageController');

// Create a new Hero Image (Upload Gambar Baru)
router.post('/', upload.single('heroImage'), heroImageController.createHeroImage);

// Get all Hero Images
router.get('/', heroImageController.getHeroImages);

// Get a single Hero Image by ID
router.get('/:id', heroImageController.getHeroImageById);

// Update a Hero Image by ID (Mengganti gambar atau memperbarui metadata)
router.put('/:id', upload.single('heroImage'), heroImageController.updateHeroImage);

// Delete a Hero Image by ID
router.delete('/:id', heroImageController.deleteHeroImage);

module.exports = router;
