// server.js
require('dotenv-safe').config();
const app = require('./app');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});

// Tangani error jika server gagal berjalan
server.on("error", (err) => {
  console.error("❌ Server failed to start:", err.message);
});

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'online' });
});
module.exports = server;