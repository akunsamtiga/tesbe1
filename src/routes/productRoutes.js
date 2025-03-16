// src/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductsByCategoryId,
  createProduct,
  updateProduct,
  updateProductStock,
  deleteProduct,
} = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const upload = require("../middlewares/upload");

// Urutan route: route yang lebih spesifik ditempatkan di atas route dinamis
router.get("/category", getProductsByCategoryId);
router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", authMiddleware, adminMiddleware, upload.single("image"), createProduct);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateProduct);
router.patch("/:id/stock", authMiddleware, adminMiddleware, updateProductStock);

router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
