require('dotenv').config();
const { connect } = require('./db');
const { createApp } = require('./app');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data.db');

// Ensure DB exists with required schema (auto-migrate minimal)
const db = connect(DB_PATH);
db.exec(`
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product TEXT NOT NULL,
  qty INTEGER NOT NULL,
  price REAL NOT NULL
);
`);

const app = createApp(db);
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
