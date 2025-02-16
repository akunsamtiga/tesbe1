// src/utils/logger.js
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info', // Level default, bisa diubah sesuai kebutuhan (debug, warn, error, dll)
  format: format.combine(
    format.timestamp(),                     // Tambahkan timestamp di setiap log
    format.errors({ stack: true }),         // Sertakan stack trace pada error
    format.splat(),                         // Mendukung string interpolation
    format.json()                           // Format output sebagai JSON
  ),
  transports: [
    // Tampilkan log di console dengan output yang berwarna
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    // Simpan log error ke file
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Simpan semua log ke file
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

module.exports = logger;
