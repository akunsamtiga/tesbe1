// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Tambahkan log ini
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    console.error("Token verification error:", error); // Tambahkan log ini
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;