// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  // Hapus seluruh data user terlebih dahulu (opsional, sesuaikan dengan kebutuhan)
//   await prisma.user.deleteMany();

  // Hash password untuk akun admin
  const adminPassword = await bcrypt.hash("adminpassword", 10);

  // Buat akun admin
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN"
    }
  });

  console.log("Admin account created:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
