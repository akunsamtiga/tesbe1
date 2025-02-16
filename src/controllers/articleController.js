// src/controllers/articleController.js
const prisma = require('../utils/prisma');

// Create Article
exports.createArticle = async (req, res, next) => {
  try {
    // Destructuring nilai dari req.body
    const { title, content, author, published } = req.body;
    
    // Validasi: pastikan title dan content tersedia
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Jika ada file (misalnya untuk featuredImage) dari middleware upload, tetapkan featuredImage
    let featuredImage = null;
    if (req.file) {
      featuredImage = `/uploads/${req.file.filename}`; // Pastikan folder uploads tersedia
    }

    // Konversi nilai published menjadi Boolean
    // Jika published dikirim sebagai string "true", maka ubah ke Boolean true
    const publishedBool = published === 'true' || published === true;

    // Debug log untuk memverifikasi payload
    console.log('Creating article with data:', {
      title,
      content,
      author,
      published: publishedBool,
      featuredImage,
    });

    // Pembuatan artikel menggunakan Prisma
    const article = await prisma.article.create({
      data: {
        title: title,         // Required: title
        content: content,     // Required: content
        author: author || null,
        published: publishedBool,
        featuredImage: featuredImage, // Optional
      },
    });
    res.status(201).json({ message: 'Article created successfully', article });
  } catch (error) {
    next(error);
  }
};

// Get All Articles (dengan pagination & pencarian)
exports.getArticles = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', order = 'desc' } = req.query;
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Filter pencarian berdasarkan judul atau konten (case-insensitive)
    let where = {};
    if (search) {
      where = {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: { [sortBy]: order === 'desc' ? 'desc' : 'asc' },
      skip,
      take: pageSize,
    });

    const totalCount = await prisma.article.count({ where });
    res.status(200).json({ articles, totalCount, page: pageNumber, limit: pageSize });
  } catch (error) {
    next(error);
  }
};

// Get Article By ID
exports.getArticleById = async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.id);
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

// Update Article
exports.updateArticle = async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.id);
    const { title, content, author, published } = req.body;

    // Validasi: Pastikan title dan content tersedia
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Konversi nilai published menjadi boolean
    // Jika published diterima sebagai string "true", maka ubah ke Boolean true
    const publishedBool = published === 'true' || published === true;

    // Siapkan data update
    let updateData = {
      title,
      content,
      author: author || null,
      published: publishedBool,
    };

    // Jika ada file baru untuk featuredImage, tambahkan ke data update
    if (req.file) {
      updateData.featuredImage = `/uploads/${req.file.filename}`;
    }

    const article = await prisma.article.update({
      where: { id: articleId },
      data: updateData,
    });

    res.status(200).json({ message: 'Article updated successfully', article });
  } catch (error) {
    next(error);
  }
};


// Delete Article
exports.deleteArticle = async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.id);
    await prisma.article.delete({
      where: { id: articleId },
    });
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    next(error);
  }
};
