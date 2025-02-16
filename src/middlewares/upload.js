// src/middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/';
// Pastikan folder uploads ada
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // Maksimal 4MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedTypes.includes(file.mimetype) || ![".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
      return cb(new Error("Format file tidak diperbolehkan"), false);
    }
    cb(null, true);
  }
});

module.exports = upload;
