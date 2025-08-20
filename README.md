# Orders Summary App (Tweaked)

A minimal full-stack project with stricter validation, improved pagination, null-safe summary, and richer API responses.

## Tech Stack
- **Backend:** Node.js + Express + SQLite (better-sqlite3)
- **Frontend:** React (Vite, JavaScript)
- **Testing:** Jest + Supertest
- **Config:** `.env` for settings

## For each Tasks, it includes
1. **Summary on empty dataset**  
   Returns:
   ```json
   {
     "totalRevenue": null,
     "medianOrderPrice": null,
     "topProductByQty": null,
     "uniqueProductCount": 0
   }
   ```
2. **Validation rules**  
   - `product`: string length ≥ 2 (trimmed)
   - `qty`: positive integer (> 0)
   - `price`: strictly positive (> 0)
3. **Pagination**  
   - Default `limit=10`, maximum `50`
4. **API response shape**  
   - `GET /api/orders` returns `{ data, total }` where `total` is the count of all matching rows (ignoring limit/offset).

## Quick Start

### 1) Backend
```bash
cd backend
cp .env.example .env   # edit if needed
npm install
npm run seed           # creates data.db and inserts sample data
npm run dev            # starts API on PORT from .env (default 3000)
```

### 2) Frontend
```bash
cd ../frontend
npm install
npm run dev            # Vite dev server (default http://localhost:5173)
```
The frontend expects the API at `http://localhost:3000` by default. To change:
- Create `frontend/.env` with `VITE_API_BASE=http://localhost:4000` (for example).

### 3) Tests
```bash
cd backend
npm test
```

## Endpoints

- `GET /api/summary`  
  Returns:
  ```ts
  type Summary = {
    totalRevenue: number | null;
    medianOrderPrice: number | null;
    topProductByQty: string | null;
    uniqueProductCount: number;
  };
  ```

- `GET /api/orders?product=foo&limit=10&offset=0`  
  Returns `{ data: Order[], total: number }` with optional partial `product` filter and pagination.

- `POST /api/orders`  
  Accepts `{ product, qty, price }`, validates inputs, inserts, and returns the new record.

## Git Repository
To create and push a new repo:
```bash
git init
git add .
git commit -m "Initial submission (tweaked)"
git branch -M main
git remote add origin YOUR_URL
git push -u origin main
```
