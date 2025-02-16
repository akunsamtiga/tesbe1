// src/controllers/wishlistController.js
const prisma = require('../utils/prisma');

exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id; // dari authMiddleware
    const wishlistItem = await prisma.wishlist.create({
      data: { userId, productId: parseInt(productId) }
    });
    res.status(201).json({ message: 'Added to wishlist', wishlistItem });
  } catch (error) {
    next(error);
  }
};

exports.getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: { product: true }
    });
    res.status(200).json(wishlist);
  } catch (error) {
    next(error);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const wishlistId = parseInt(req.params.id);
    await prisma.wishlist.delete({
      where: { id: wishlistId }
    });
    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
};
