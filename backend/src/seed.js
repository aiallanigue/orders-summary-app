const Database = require("better-sqlite3");
const db = new Database("data.db");

db.exec(`CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product TEXT NOT NULL,
  qty INTEGER NOT NULL,
  price REAL NOT NULL
)`);

const orders = [
  { product: "Apple", qty: 3, price: 2.5 },
  { product: "Banana", qty: 5, price: 1.2 },
  { product: "Orange", qty: 2, price: 3.0 },
  { product: "Mango", qty: 4, price: 2.0 },
  { product: "Grapes", qty: 1, price: 4.5 },
];

const stmt = db.prepare("INSERT INTO orders (product, qty, price) VALUES (?, ?, ?)");
for (const o of orders) {
  stmt.run(o.product, o.qty, o.price);
}

console.log("Seeded orders");
