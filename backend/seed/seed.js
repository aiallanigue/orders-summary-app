require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { connect } = require('../src/db');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data.db');
const db = connect(DB_PATH);

db.exec(`
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product TEXT NOT NULL,
  qty INTEGER NOT NULL,
  price REAL NOT NULL
);
`);

const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
db.exec(seedSql);
console.log('Seed complete:', DB_PATH);
