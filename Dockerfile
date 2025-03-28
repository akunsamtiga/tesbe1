# Gunakan image Node.js sebagai base
FROM node:18

# Set direktori kerja dalam container
WORKDIR /app

# Salin package.json dan install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Salin semua kode backend
COPY . .

# Ekspose port (sesuaikan dengan backend-mu)
EXPOSE 5000

# Perintah untuk menjalankan aplikasi
CMD ["npm", "start"]
