const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { summarizeOrders } = require('./summarize');

/**
 * Creates an Express app bound to a given SQLite connection.
 * @param {import('better-sqlite3').Database} db
 */
function createApp(db) {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // Simple request-logging middleware (minimal, custom)
  app.use((req, res, next) => {
    console.log(`[req] ${req.method} ${req.url}`);
    next();
  });

  // GET /api/summary
  app.get('/api/summary', (req, res) => {
    try {
      const rows = db.prepare('SELECT id, product, qty, price FROM orders ORDER BY id DESC').all();
      const summary = summarizeOrders(rows);
      res.json(summary);
    } catch (err) {
      res.status(500).json({ error: 'Failed to compute summary', details: String(err) });
    }
  });

  // GET /api/orders?product=&limit=&offset=
  app.get('/api/orders', (req, res) => {
    try {
      const { product = '', limit = '10', offset = '0' } = req.query;
      const lim = Math.max(0, Math.min(parseInt(limit, 10) || 10, 50));
      const off = Math.max(0, parseInt(offset, 10) || 0);

      let where = '';
      let params = {};
      if (product) {
        where = 'WHERE product LIKE @product';
        params.product = `%${product}%`;
      }

      const rows = db.prepare(`SELECT id, product, qty, price FROM orders ${where} ORDER BY id DESC LIMIT @limit OFFSET @offset`)
        .all({ ...params, limit: lim, offset: off });

      const totalRow = db.prepare(`SELECT COUNT(*) as cnt FROM orders ${where}`).get(params);
      res.json({ data: rows, total: totalRow.cnt });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch orders', details: String(err) });
    }
  });

  // POST /api/orders
  app.post('/api/orders', (req, res) => {
    try {
      const { product, qty, price } = req.body || {};

      if (typeof product !== 'string' || product.trim().length < 2) {
        return res.status(400).json({ error: 'Invalid product (min length 2)' });
      }
      const qtyNum = Number(qty);
      const priceNum = Number(price);
      if (!Number.isInteger(qtyNum) || qtyNum <= 0) {
        return res.status(400).json({ error: 'Invalid qty (must be positive integer)' });
      }
      if (!Number.isFinite(priceNum) || priceNum <= 0) {
        return res.status(400).json({ error: 'Invalid price (must be > 0)' });
      }

      const stmt = db.prepare('INSERT INTO orders (product, qty, price) VALUES (@product, @qty, @price)');
      const info = stmt.run({ product: product.trim(), qty: qtyNum, price: priceNum });

      const row = db.prepare('SELECT id, product, qty, price FROM orders WHERE id = ?').get(info.lastInsertRowid);
      res.status(201).json(row);
    } catch (err) {
      res.status(500).json({ error: 'Failed to insert order', details: String(err) });
    }
  });

  return app;
}

module.exports = { createApp };
