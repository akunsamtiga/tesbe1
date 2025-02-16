// server.js
const app = require('./app');

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
// Tangani error jika server gagal berjalan
server.on("error", (err) => {
  console.error("❌ Server failed to start:", err.message);
});
module.exports = server;
