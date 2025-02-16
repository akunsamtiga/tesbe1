// src/controllers/authController.js
const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

// Fungsi registerUser tetap sama
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    if (password.length < 8) {
      return res.status(400).json({ error: "Password harus minimal 8 karakter" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });
    
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    
    // **Perbaikan:** Hash refresh token sebelum menyimpannya ke database
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken }
    });

    res.status(200).json({ 
      message: 'Login successful', 
      accessToken, 
      refreshToken 
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }
    
    // Verifikasi refresh token dengan JWT
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // **Perbaikan:** Ambil user dari DB untuk memeriksa hash refresh token yang tersimpan
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || !user.refreshToken) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    
    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    
    const newAccessToken = generateAccessToken({
      id: payload.id,
      email: payload.email,
      role: payload.role
    });
    
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    // Menggunakan logger untuk mencatat error
    logger.error('Refresh token error: %s', error.message);
    res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }
    });
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};
