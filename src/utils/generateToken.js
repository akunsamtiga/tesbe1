// src/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateAccessToken = (payload) => {
  // Access token berlaku selama 15 menit
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (payload) => {
  // Refresh token berlaku selama 7 hari
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

module.exports = { generateAccessToken, generateRefreshToken };
