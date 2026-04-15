/**
 * Reduces a number to a single digit, unless it's a master number (11, 22, 33).
 */
function reduceNumber(num: number, keepMaster: boolean = true): number {
  if (keepMaster && (num === 11 || num === 22 || num === 33)) {
    return num;
  }
  let sum = num;
  while (sum > 9 && !(keepMaster && (sum === 11 || sum === 22 || sum === 33))) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return sum;
}

/**
 * Calculates Life Path Number from Date of Birth
 * Format of dob: "YYYY-MM-DD" or similar containing digits
 */
export function getLifePathNumber(dob: string): number {
  const digits = dob.replace(/\D/g, '').split('').map(d => parseInt(d, 10));
  const sum = digits.reduce((a, b) => a + b, 0);
  return reduceNumber(sum, true);
}

const letterValues: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
};

const vowels = ['a', 'e', 'i', 'o', 'u'];

/**
 * Calculates Expression Number from Full Name
 */
export function getExpressionNumber(name: string): number {
  const normalized = name.toLowerCase().replace(/[^a-z]/g, '');
  const sum = normalized.split('').reduce((acc, char) => acc + (letterValues[char] || 0), 0);
  return reduceNumber(sum, true);
}

/**
 * Calculates Soul Urge Number from vowels in Full Name
 */
export function getSoulUrgeNumber(name: string): number {
  const normalized = name.toLowerCase().replace(/[^a-z]/g, '');
  const vowelsOnly = normalized.split('').filter(char => vowels.includes(char));
  const sum = vowelsOnly.reduce((acc, char) => acc + (letterValues[char] || 0), 0);
  return reduceNumber(sum, true);
}
