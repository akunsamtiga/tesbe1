// src/controllers/reviewController.js
const prisma = require('../utils/prisma');

exports.createReview = async (req, res, next) => {
  try {
    const { rating, comment, productId } = req.body;
    // Pastikan userId diambil dari token (melalui authMiddleware)
    const userId = req.user.id; // Asumsi authMiddleware sudah memasukkan req.user
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
      include: { user: { select: { name: true, email: true } } },
    });
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};
