const prisma = require('../utils/prisma');
const path = require('path');
const fs = require('fs');

exports.createHeroImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    const heroImage = await prisma.heroImage.create({
      data: { imageUrl }
    });
    res.status(201).json(heroImage);
  } catch (error) {
    console.error('Error in createHeroImage:', error);
    next(error);
  }
};

exports.getHeroImages = async (req, res, next) => {
  try {
    const heroImages = await prisma.heroImage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1 // Ambil hanya gambar hero terbaru (sesuaikan jika perlu)
    });
    res.status(200).json(heroImages);
  } catch (error) {
    next(error);
  }
};

exports.deleteHeroImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const heroImage = await prisma.heroImage.findUnique({ where: { id } });
    if (!heroImage) {
      return res.status(404).json({ message: 'Hero image not found' });
    }
    const imagePath = path.join(__dirname, '../..', heroImage.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    await prisma.heroImage.delete({ where: { id } });
    res.status(200).json({ message: 'Hero image deleted successfully' });
  } catch (error) {
    next(error);
  }
};
