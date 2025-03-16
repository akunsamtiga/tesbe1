// src/controllers/heroImageController.js
const prisma = require('../utils/prisma');
const path = require('path');
const fs = require('fs');

// Create Hero Image
exports.createHeroImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    const heroImage = await prisma.heroImage.create({
      data: { imageUrl },
    });
    res.status(201).json(heroImage);
  } catch (error) {
    console.error('Error in createHeroImage:', error);
    next(error);
  }
};

// Get All Hero Images
exports.getHeroImages = async (req, res, next) => {
  try {
    const heroImages = await prisma.heroImage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(heroImages);
  } catch (error) {
    next(error);
  }
};

// Get a Single Hero Image by ID
exports.getHeroImageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const heroImage = await prisma.heroImage.findUnique({
      where: { id },
    });
    if (!heroImage) {
      return res.status(404).json({ message: 'Hero image not found' });
    }
    res.status(200).json(heroImage);
  } catch (error) {
    next(error);
  }
};

// Update Hero Image
exports.updateHeroImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Cek apakah Hero Image dengan ID tersebut ada
    const heroImage = await prisma.heroImage.findUnique({ where: { id } });
    if (!heroImage) {
      return res.status(404).json({ message: 'Hero image not found' });
    }

    let updatedImageUrl = heroImage.imageUrl; // Default ke URL gambar lama

    // Jika ada file baru diunggah, ganti gambar lama
    if (req.file) {
      const oldImagePath = path.join(__dirname, '../..', heroImage.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Hapus gambar lama dari sistem
      }
      updatedImageUrl = `/uploads/${req.file.filename}`; // Simpan URL gambar baru
    }

    // Update data di database
    const updatedHeroImage = await prisma.heroImage.update({
      where: { id },
      data: {
        imageUrl: updatedImageUrl,
      },
    });

    res.status(200).json(updatedHeroImage);
  } catch (error) {
    console.error('Error in updateHeroImage:', error);
    next(error);
  }
};

// Delete Hero Image
exports.deleteHeroImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Cek apakah Hero Image dengan ID tersebut ada
    const heroImage = await prisma.heroImage.findUnique({ where: { id } });
    if (!heroImage) {
      return res.status(404).json({ message: 'Hero image not found' });
    }

    // Hapus file gambar dari sistem
    const imagePath = path.join(__dirname, '../..', heroImage.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Hapus data dari database
    await prisma.heroImage.delete({ where: { id } });

    res.status(200).json({ message: 'Hero image deleted successfully' });
  } catch (error) {
    next(error);
  }
};