// src/services/userService.js
const prisma = require('../utils/prisma');

async function getUserProfile(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      address: true,
      createdAt: true,
    },
  });
}

module.exports = { getUserProfile };
