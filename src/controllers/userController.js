// src/controllers/userController.js
const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');

// Ambil data profil pengguna
exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, profilePicture: true, address: true, createdAt: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Update data profil (nama, alamat, dll)
exports.updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, address } = req.body;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, address }
    });
    res.status(200).json({ message: 'Profile updated', user });
  } catch (error) {
    next(error);
  }
};

// Update foto profil (dengan upload file)
exports.updateProfilePicture = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const imageUrl = `/uploads/${req.file.filename}`;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: imageUrl }
    });
    res.status(200).json({ message: 'Profile picture updated', user });
  } catch (error) {
    next(error);
  }
};

// Ambil ulasan yang ditulis oleh pengguna
exports.getReviewsByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const reviews = await prisma.review.findMany({
      where: { userId },
      include: { product: { select: { title: true, image: true, price: true } } }
    });
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};
