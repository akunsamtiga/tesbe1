// src/middlewares/errorHandler.js
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log error secara detail menggunakan Winston
  logger.error('Error: %s', err.stack);
  // Jika error memiliki properti statusCode, gunakan itu, jika tidak gunakan 500
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
};

module.exports = errorHandler;
