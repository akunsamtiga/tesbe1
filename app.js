// app.js
const dotenv = require('dotenv-safe');
dotenv.config({
  allowEmptyValues: false,
  example: '.env.example'
});

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "your-secret-key", // Ganti dengan secret key yang aman
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' } // true jika HTTPS
  })
);

// Gunakan `morgan` hanya di development mode
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Konfigurasi rate limiter: maksimal 100 request per IP dalam 15 menit.
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 menit
  max: 500, // Maksimal 500 request per IP per windowMs
  message: {
    error: 'Terlalu banyak permintaan dari IP ini. Silakan coba lagi setelah 15 menit.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Terapkan rate limiter secara global
app.use(limiter);

// Sediakan folder uploads sebagai static agar file dapat diakses
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route dasar
app.get('/', (req, res) => {
  res.send('E-commerce Backend is running.');
});

// Mount routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const productRoutes = require('./src/routes/productRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const wishlistRoutes = require('./src/routes/wishlistRoutes');
const heroImageRoutes = require('./src/routes/heroImageRoutes');
const articleRoutes = require('./src/routes/articleRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hero-images', heroImageRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);


// Global error handler
app.use(errorHandler);

module.exports = app; 
