const { summarizeOrders, median } = require('../src/summarize');

describe('summarizeOrders', () => {
  test('typical dataset computes correct summary', () => {
    const orders = [
      { id: 1, product: 'A', qty: 2, price: 10 },  // revenue 20
      { id: 2, product: 'B', qty: 5, price: 5 },   // revenue 25
      { id: 3, product: 'A', qty: 1, price: 10 },  // revenue 10
      { id: 4, product: 'C', qty: 3, price: 7 }    // revenue 21
    ];
    const s = summarizeOrders(orders);
    expect(s.totalRevenue).toBe(76); // 20+25+10+21
    expect(s.medianOrderPrice).toBe((20+21)/2); // [10,20,21,25]
    expect(s.topProductByQty).toBe('B'); // B has 5, A has 3, C has 3
    expect(s.uniqueProductCount).toBe(3);
  });

  test('edge case: empty orders returns nulls/0', () => {
    const s = summarizeOrders([]);
    expect(s.totalRevenue).toBeNull();
    expect(s.medianOrderPrice).toBeNull();
    expect(s.topProductByQty).toBeNull();
    expect(s.uniqueProductCount).toBe(0);
  });
});

describe('median helper', () => {
  test('even count', () => {
    expect(median([10, 20, 21, 25])).toBe((20+21)/2);
  });
  test('odd count', () => {
    expect(median([10, 20, 21])).toBe(20);
  });
  test('empty', () => {
    expect(median([])).toBe(0);
  });
});
