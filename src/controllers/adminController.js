// src/controllers/adminController.js
const prisma = require("../utils/prisma");
const fs = require("fs");
const path = require("path");

// Statistik dashboard (jumlah pengguna, produk, review)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const reviewCount = await prisma.review.count();
    res.status(200).json({ userCount, productCount, reviewCount });
  } catch (error) {
    next(error);
  }
};

// Moderasi review (ubah status review: approved / rejected)
exports.moderateReview = async (req, res, next) => {
  try {
    const reviewId = parseInt(req.params.id);
    const { status } = req.body; // status: "approved" atau "rejected"
    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { status }
    });
    res.status(200).json({ message: 'Review updated', review });
  } catch (error) {
    next(error);
  }
};

// Update stok produk (manajemen inventaris)
exports.updateProductStock = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const { stock } = req.body;
    const product = await prisma.product.update({
      where: { id: productId },
      data: { stock: parseInt(stock) }
    });
    res.status(200).json({ message: 'Product stock updated', product });
  } catch (error) {
    next(error);
  }
};

// Hapus produk (misalnya, untuk moderasi konten atau pengelolaan)
exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    await prisma.product.delete({ where: { id: productId }});
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

// Get admin profile
exports.getAdminProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, address: true, profilePicture: true, email: true }
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Update admin profile
exports.updateAdminProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, address, profilePicture } = req.body;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, address, profilePicture }
    });
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    next(error);
  }
};

// Upload dan update foto profil admin
exports.uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.user.id;
    const profilePicture = `/uploads/${req.file.filename}`;

    // Hapus foto lama jika ada
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.profilePicture) {
      const oldPath = path.join(__dirname, "../../", user.profilePicture);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Perbarui data pengguna
    await prisma.user.update({
      where: { id: userId },
      data: { profilePicture },
    });

    res.status(200).json({ message: "Profile picture updated", profilePicture });
  } catch (error) {
    next(error);
  }
};
