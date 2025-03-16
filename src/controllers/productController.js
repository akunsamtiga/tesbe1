// src/controllers/productController.js
const prisma = require("../utils/prisma");

// Ambil semua produk dengan filter, sorting, dan pagination
exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, sortBy, order, page, limit } = req.query;

    // Buat filter pencarian
    const filters = {};
    if (search) {
      filters.title = { contains: search, mode: "insensitive" };
    }
    if (category) {
      const categoryId = parseInt(category, 10);
      if (!isNaN(categoryId)) {
        filters.categoryId = categoryId;
      }
    }
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.gte = parseFloat(minPrice);
      if (maxPrice) filters.price.lte = parseFloat(maxPrice);
    }

    // Buat opsi pengurutan
    const orderBy = {};
    if (sortBy && ["price", "createdAt", "rating"].includes(sortBy)) {
      orderBy[sortBy] = order === "desc" ? "desc" : "asc";
    }

    // Konfigurasi pagination
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = limit ? parseInt(limit, 10) : undefined; // Jika tidak ada limit, ambil semua data
    const skip = (pageNumber - 1) * (pageSize || 10); // Skip tetap diperhitungkan untuk pagination
    
    const products = await prisma.product.findMany({
      where: filters,
      orderBy: Object.keys(orderBy).length ? orderBy : undefined,
      skip,
      take: pageSize,
      include: {
        reviews: { select: { rating: true } },
        category: true,
      },
    });

    // Hitung rata-rata rating untuk setiap produk dan bulatkan ke 1 angka di belakang koma
    const productsWithRating = products.map((product) => {
      const reviews = product.reviews || [];
      const avgRating =
        reviews.length > 0
          ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
          : 0;
      return { ...product, rating: avgRating };
    });

    res.status(200).json(productsWithRating);
  } catch (error) {
    next(error);
  }
};

// Ambil detail produk berdasarkan ID
exports.getProductById = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { reviews: { select: { rating: true } }, category: true },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const reviews = product.reviews || [];
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    res.status(200).json({ ...product, rating: avgRating });
  } catch (error) {
    next(error);
  }
};

// Ambil produk berdasarkan categoryId (query parameter)
exports.getProductsByCategoryId = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.query.categoryId, 10);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Category ID must be a valid number" });
    }

    console.log("Fetching products for categoryId:", categoryId);

    const products = await prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
        reviews: { select: { rating: true } },
      },
    });

    console.log("Products found:", products.length);

    if (products.length === 0) {
      return res.status(404).json({ error: "No products found for this category" });
    }

    res.json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    next(error);
  }
};

// Update stok produk
exports.updateProductStock = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const { stock } = req.body;

    if (isNaN(productId) || stock === undefined) {
      return res.status(400).json({ error: "Invalid product ID or missing stock value" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { stock: parseInt(stock, 10) },
    });
    res.status(200).json({ message: "Product stock updated", product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

// Buat produk baru
exports.createProduct = async (req, res, next) => {
  try {
    const { title, description, price, categoryId, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !description || !price || !categoryId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const parsedCategoryId = parseInt(categoryId, 10);
    if (isNaN(parsedCategoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        image,
        categoryId: parsedCategoryId,
        // Tambahkan field stock; jika tidak dikirim, default ke 0
        stock: stock !== undefined ? parseInt(stock, 10) : 0,
      },
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error("Error creating product:", error);
    next(error);
  }
};

// Update produk berdasarkan ID
exports.updateProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const { title, description, price, categoryId, stock } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice)) {
        return res.status(400).json({ error: "Price must be a number" });
      }
      updateData.price = parsedPrice;
    }
    if (categoryId) {
      const parsedCategoryId = parseInt(categoryId, 10);
      if (isNaN(parsedCategoryId)) {
        return res.status(400).json({ error: "Category ID must be a valid number" });
      }
      updateData.category = { connect: { id: parsedCategoryId } };
    }
    // Tambahkan logika update stock
    if (stock !== undefined) {
      const parsedStock = parseInt(stock, 10);
      if (isNaN(parsedStock)) {
        return res.status(400).json({ error: "Stock must be a number" });
      }
      updateData.stock = parsedStock;
    }
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    console.error("Error updating product:", error);
    next(error);
  }
};

exports.updateProductStock = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id, 10);
    let { stock } = req.body;

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // Pastikan stock dikirim dan merupakan angka yang valid
    if (stock === undefined || isNaN(parseInt(stock, 10))) {
      return res.status(400).json({ error: "Missing or invalid stock value" });
    }
    
    stock = parseInt(stock, 10);
    if (stock < 0) {
      return res.status(400).json({ error: "Stock cannot be negative" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { stock },
    });
    res.status(200).json({ message: "Product stock updated", product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

// Hapus produk berdasarkan ID
exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // Cari produk dulu untuk memastikan produk ada
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Hapus produk
    await prisma.product.delete({
      where: { id: productId },
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    next(error);
  }
};
