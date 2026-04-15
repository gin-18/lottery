// 定义各玩法的奖金规则（匹配号码数: 奖金）
export const prizeTables = {
  1: { 1: 4.6 },
  2: { 2: 19 },
  3: { 2: 3, 3: 53 },
  4: { 2: 3, 3: 5, 4: 100 },
  5: { 3: 3, 4: 21, 5: 1000 },
  6: { 3: 3, 4: 10, 5: 30, 6: 3000 },
  7: { 0: 2, 4: 4, 5: 28, 6: 288, 7: 10000 },
  8: { 0: 2, 4: 3, 5: 10, 6: 88, 7: 800, 8: 50000 },
  9: { 0: 2, 4: 3, 5: 5, 6: 20, 7: 200, 8: 2000, 9: 300000 },
  10: { 0: 2, 5: 3, 6: 5, 7: 80, 8: 800, 9: 8000, 10: 5000000 },
}

// 组合数计算函数
export function comb(n, k) {
  if (k < 0 || k > n) return 0
  if (k === 0 || k === n) return 1

  k = Math.min(k, n - k)
  let result = 1
  for (let i = 1; i <= k; i++) {
    result = (result * (n - i + 1)) / i
  }
  return Math.round(result)
}

// 格式化价格
export function formatPrice(number) {
  // 转换为数字
  const num = parseFloat(number).toFixed(1);

  // 分割整数和小数部分
  const parts = num.toString().split('.');
  let integerPart = parts[0];
  const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

  // 添加逗号分隔符
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return integerPart + decimalPart;
}
