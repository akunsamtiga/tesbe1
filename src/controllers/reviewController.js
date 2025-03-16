// src/controllers/reviewController.js
const prisma = require('../utils/prisma');

exports.createReview = async (req, res, next) => {
  try {
    const { rating, comment, productId } = req.body;
    // Pastikan userId diambil dari token (melalui authMiddleware)
    const userId = req.user.id; // Asumsi authMiddleware sudah memasukkan req.user
    const userRole = req.user.role.toUpperCase(); // Pastikan role ada dan uppercase

    // Pastikan user adalah USER atau ADMIN
    if (!["USER", "ADMIN"].includes(userRole)) {
      return res.status(403).json({ error: "Hanya USER/ADMIN yang diperbolehkan" });
    }

    const review = await prisma.review.create({
      data: { rating, comment, productId: parseInt(productId), userId }
    });
    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    next(error);
  }
};

exports.getReviewsByProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { name: true, email: true } } }
    });
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      include: { user: { select: { name: true, email: true, address: true, profilePicture: true } } },
    });
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

exports.editReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const reviewId = parseInt(req.params.id);
    const userId = req.user.id;
    const userRole = req.user.role.toUpperCase(); // Pastikan role ada dan uppercase

    // Cek apakah review ada dan dimiliki oleh user atau admin
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    if (review.userId !== userId && userRole !== "ADMIN") {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { rating, comment }
    });
    res.status(200).json({ message: 'Review updated', review: updatedReview });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const reviewId = parseInt(req.params.id);
    const userRole = req.user.role.toUpperCase(); // Pastikan role ada dan uppercase

    // Cek apakah review ada dan dimiliki oleh admin
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    if (userRole !== "ADMIN") {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.review.delete({ where: { id: reviewId } });
    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};