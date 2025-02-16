const { check, validationResult } = require('express-validator');

// Aturan validasi untuk registrasi pengguna
const registerValidationRules = () => [
  check('name')
    .trim()
    .notEmpty().withMessage('Nama wajib diisi')
    .isLength({ min: 3 }).withMessage('Nama minimal 3 karakter'),
  check('email')
    .trim()
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Format email tidak valid'),
  check('password')
    .notEmpty().withMessage('Password wajib diisi')
    .isLength({ min: 8 }).withMessage('Password minimal 8 karakter'),
];

// Aturan validasi untuk login
const loginValidationRules = () => [
  check('email')
    .trim()
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Format email tidak valid'),
  check('password')
    .notEmpty().withMessage('Password wajib diisi'),
];

// Aturan validasi untuk produk
const productValidationRules = () => [
  check('title')
    .notEmpty().withMessage('Nama produk wajib diisi'),
  check('price')
    .isFloat({ gt: 0 }).withMessage('Harga harus lebih dari 0'),
  check('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock minimal 0'),
];

// Aturan validasi untuk review
const reviewValidationRules = () => [
  check('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating harus antara 1 dan 5'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: errors.array() });
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  productValidationRules,
  reviewValidationRules,
  validate,
};
