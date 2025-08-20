/**
 * @typedef {{ id: number, product: string, qty: number, price: number }} Order
 * @typedef {{ totalRevenue: number|null, medianOrderPrice: number|null, topProductByQty: string|null, uniqueProductCount: number }} Summary
 */

/**
 * Compute the median of a numeric array. Returns 0 for empty arrays.
 * @param {number[]} arr
 */
function median(arr) {
  if (!arr || arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * @param {Order[]} orders
 * @returns {Summary}
 */
function summarizeOrders(orders) {
  const revenuePerOrder = [];
  let totalRevenue = 0;

  const qtyByProduct = new Map();
  const productSet = new Set();

  for (const o of orders) {
    const orderRevenue = o.qty * o.price;
    revenuePerOrder.push(orderRevenue);
    totalRevenue += orderRevenue;

    productSet.add(o.product);
    qtyByProduct.set(o.product, (qtyByProduct.get(o.product) || 0) + o.qty);
  }

  // Determine top product by accumulated qty
  let topProductByQty = "";
  let maxQty = -Infinity;
  for (const [product, q] of qtyByProduct.entries()) {
    if (q > maxQty) {
      maxQty = q;
      topProductByQty = product;
    }
  }

  // Empty dataset handling
  if (orders.length === 0) {
    return {
      totalRevenue: null,
      medianOrderPrice: null,
      topProductByQty: null,
      uniqueProductCount: 0,
    };
  }

  return {
    totalRevenue,
    medianOrderPrice: median(revenuePerOrder),
    topProductByQty: topProductByQty || null,
    uniqueProductCount: productSet.size,
  };
}

module.exports = { summarizeOrders, median };
