const request = require('supertest');
const { createApp } = require('../src/app');
const Database = require('better-sqlite3');

function makeMemoryApp() {
  const db = new Database(':memory:');
  db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product TEXT NOT NULL,
    qty INTEGER NOT NULL,
    price REAL NOT NULL
  );
  `);
  return { app: createApp(db), db };
}

describe('POST /api/orders (integration)', () => {
  test('inserts valid order and returns it', async () => {
    const { app } = makeMemoryApp();
    const res = await request(app)
      .post('/api/orders')
      .send({ product: 'TestItem', qty: 3, price: 12.5 })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.product).toBe('TestItem');
    expect(res.body.qty).toBe(3);
    expect(res.body.price).toBe(12.5);

    // fetch via list
    const list = await request(app).get('/api/orders').expect(200);
    expect(Array.isArray(list.body.data)).toBe(true);
    expect(list.body.total).toBe(1);
    expect(list.body.data[0].product).toBe('TestItem');
  });

  test('rejects invalid input', async () => {
    const { app } = makeMemoryApp();
    await request(app)
      .post('/api/orders')
      .send({ product: 'A', qty: -1, price: 0 })
      .expect(400);
  });
});
