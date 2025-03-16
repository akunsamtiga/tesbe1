// src/controllers/authController.js
const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redis = require('../utils/redis');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

// ✅ LOGIN USER & SIMPAN REFRESH TOKEN DI REDIS
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Kredensial salah' });

    // 🔹 Generate Access & Refresh Token
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // 🔹 Simpan refresh token di Redis (expired dalam 7 hari)
    await redis.set(`refresh:${user.id}`, refreshToken, 'EX', 604800);

    // 🔹 Simpan refresh token dalam cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
    });

    res.status(200).json({ message: 'Login sukses', accessToken });
  } catch (error) {
    next(error);
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Semua kolom wajib diisi" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    res.status(201).json({ message: "Registrasi berhasil", user });
  } catch (error) {
    next(error);
  }
};

// ✅ REFRESH TOKEN (Mengambil Token Baru)
exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token diperlukan' });

    // 🔹 Verifikasi token
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // 🔹 Cek apakah token masih valid di Redis
    const storedToken = await redis.get(`refresh:${payload.id}`);
    if (!storedToken || storedToken !== refreshToken) {
      return res.status(403).json({ error: 'Refresh token tidak valid' });
    }

    // 🔹 Buat token baru
    const newAccessToken = generateAccessToken({ id: payload.id, email: payload.email, role: payload.role });
    const newRefreshToken = generateRefreshToken({ id: payload.id, email: payload.email, role: payload.role });

    // 🔹 Perbarui refresh token di Redis
    await redis.set(`refresh:${payload.id}`, newRefreshToken, 'EX', 604800);

    // 🔹 Simpan refresh token baru di cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ error: 'Refresh token tidak valid atau kedaluwarsa' });
  }
};

// ✅ LOGOUT USER & HAPUS TOKEN DARI REDIS
exports.logoutUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 🔹 Hapus refresh token dari Redis
    await redis.del(`refresh:${userId}`);

    // 🔹 Hapus cookie refresh token
    res.clearCookie('refreshToken');

    res.status(200).json({ message: 'Logout sukses' });
  } catch (error) {
    next(error);
  }
};
