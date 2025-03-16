// src/controllers/userController.js
const prisma = require('../utils/prisma'); // Tambahkan impor prisma
const { getUserProfile } = require('../services/userService');

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await getUserProfile(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return next(error);
  }
};

// Update data profil (nama, alamat, dll)
exports.updateUserProfile = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.id, 10);
    const { name, address } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, address },
    });
    return res.status(200).json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return next(error);
  }
};

// Update foto profil (dengan upload file)
exports.updateProfilePicture = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.id, 10);
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Misal file disimpan dalam folder /uploads
    const imageUrl = `/uploads/${req.file.filename}`;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: imageUrl },
    });
    return res.status(200).json({ message: 'Profile picture updated', user: updatedUser });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return next(error);
  }
};

// Ambil ulasan yang ditulis oleh pengguna
exports.getReviewsByUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.id, 10);
    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        product: {
          select: { title: true, image: true, price: true },
        },
      },
    });
    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return next(error);
  }
};
