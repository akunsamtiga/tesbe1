// src/controllers/categoryController.js
const prisma = require("../utils/prisma");
const fs = require("fs");
const path = require("path");

exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const category = await prisma.category.create({
      data: { name, imageUrl },
    });

    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    next(error);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
};

// Update kategori
exports.updateCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    const updateData = { name };
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }
    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });
    res.json({ message: "Category updated", category });
  } catch (err) {
    next(err);
  }
};

// Hapus kategori
exports.deleteCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    if (category.imageUrl) {
      const fileName = category.imageUrl.replace("/uploads/", "");
      const filePath = path.join(__dirname, "..", "uploads", fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await prisma.category.delete({ where: { id } });
    res.json({ message: "Category deleted" });
  } catch (err) {
    next(err);
  }
};