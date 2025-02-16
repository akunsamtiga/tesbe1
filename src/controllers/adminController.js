// src/controllers/adminController.js
const prisma = require('../utils/prisma');

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
