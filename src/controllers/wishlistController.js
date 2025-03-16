// src/controllers/wishlistController.js
const prisma = require('../utils/prisma');

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Validasi product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Cek duplikat
    const existing = await prisma.wishlist.findFirst({
      where: { userId, productId: parseInt(productId) },
    });
    if (existing) return res.status(409).json({ error: 'Already in wishlist' });

    // Simpan ke database
    const wishlist = await prisma.wishlist.create({
      data: { userId, productId: parseInt(productId) },
    });

    res.status(201).json({ message: 'Added to wishlist', wishlist });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Hapus wishlist
    await prisma.wishlist.delete({
      where: { userId_productId: { userId, productId: parseInt(productId) } },
    });

    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(404).json({ error: 'Wishlist item not found' });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
    });

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};