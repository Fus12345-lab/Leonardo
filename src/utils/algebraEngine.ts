import { StatsResult, QuadraticResult } from '../types';
import { factorial, cleanPrecision } from './mathEngine';

// Solve 1st degree linear equation: ax + b = c
export function solveLinearEquation(a: number, b: number, c: number): { solution: number | string; description: string } {
  if (a === 0) {
    if (b === c) {
      return { solution: 'Infinitas soluciones', description: 'La identidad se cumple para cualquier valor de x.' };
    } else {
      return { solution: 'Sin solución', description: '0x = ' + (c - b) + ' es una contradicción.' };
    }
  }
  const x = cleanPrecision((c - b) / a);
  return {
    solution: x,
    description: `x = (${c} - ${b}) / ${a} = ${x}`,
  };
}

// Solve 2nd degree quadratic equation: ax² + bx + c = 0
export function solveQuadraticEquation(a: number, b: number, c: number): QuadraticResult {
  if (a === 0) {
    throw new Error('El coeficiente "a" no puede ser 0 en una ecuación cuadrática.');
  }

  const disc = cleanPrecision(b * b - 4 * a * c);
  const vertexX = cleanPrecision(-b / (2 * a));
  const vertexY = cleanPrecision(a * vertexX * vertexX + b * vertexX + c);

  if (disc > 0) {
    const sqrtD = Math.sqrt(disc);
    const x1 = cleanPrecision((-b + sqrtD) / (2 * a));
    const x2 = cleanPrecision((-b - sqrtD) / (2 * a));
    return {
      discriminant: disc,
      type: 'two_real',
      x1: String(x1),
      x2: String(x2),
      vertex: { x: vertexX, y: vertexY },
    };
  } else if (disc === 0) {
    const x = cleanPrecision(-b / (2 * a));
    return {
      discriminant: disc,
      type: 'one_real',
      x1: String(x),
      x2: String(x),
      vertex: { x: vertexX, y: vertexY },
    };
  } else {
    // Complex roots
    const realPart = cleanPrecision(-b / (2 * a));
    const imagPart = cleanPrecision(Math.sqrt(-disc) / (2 * a));
    return {
      discriminant: disc,
      type: 'two_complex',
      x1: `${realPart} + ${Math.abs(imagPart)}i`,
      x2: `${realPart} - ${Math.abs(imagPart)}i`,
      vertex: { x: vertexX, y: vertexY },
    };
  }
}

// Solve 2x2 linear system using Cramer's rule:
// a1*x + b1*y = c1
// a2*x + b2*y = c2
export function solveLinearSystem2x2(
  a1: number, b1: number, c1: number,
  a2: number, b2: number, c2: number
): { x: number; y: number } | { error: string } {
  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) < 1e-12) {
    return { error: 'El sistema no tiene solución única (determinante = 0, rectas paralelas o coincidentes).' };
  }

  const detX = c1 * b2 - c2 * b1;
  const detY = a1 * c2 - a2 * c1;

  const x = cleanPrecision(detX / det);
  const y = cleanPrecision(detY / det);

  return { x, y };
}

// Rule of three
// Direct: A -> B, C -> x => x = (B * C) / A
// Inverse: A -> B, C -> x => x = (A * B) / C
export function calculateRuleOfThree(a: number, b: number, c: number, type: 'direct' | 'inverse'): number {
  if (type === 'direct') {
    if (a === 0) throw new Error('En la regla de tres directa, A no puede ser cero.');
    return cleanPrecision((b * c) / a);
  } else {
    if (c === 0) throw new Error('En la regla de tres inversa, C no puede ser cero.');
    return cleanPrecision((a * b) / c);
  }
}

// Combinations nCr = n! / (r! * (n-r)!)
export function combinations(n: number, r: number): number {
  if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) {
    throw new Error('n y r deben ser números enteros no negativos.');
  }
  if (r > n) return 0;
  if (r === 0 || r === n) return 1;

  // Optimize calculation
  const k = Math.min(r, n - r);
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = (res * (n - k + i)) / i;
  }
  return Math.round(res);
}

// Permutations nPr = n! / (n-r)!
export function permutations(n: number, r: number): number {
  if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) {
    throw new Error('n y r deben ser números enteros no negativos.');
  }
  if (r > n) return 0;
  let res = 1;
  for (let i = 0; i < r; i++) {
    res *= (n - i);
  }
  return res;
}

// Statistics: mean, median, mode, variance, stdDev, etc.
export function calculateStatistics(numbers: number[]): StatsResult {
  if (numbers.length === 0) {
    throw new Error('Debe proporcionar al menos un número.');
  }

  const count = numbers.length;
  const sum = cleanPrecision(numbers.reduce((acc, v) => acc + v, 0));
  const mean = cleanPrecision(sum / count);

  // Sorted copy for median and quartiles
  const sorted = [...numbers].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  let median: number;
  const mid = Math.floor(count / 2);
  if (count % 2 === 0) {
    median = cleanPrecision((sorted[mid - 1] + sorted[mid]) / 2);
  } else {
    median = sorted[mid];
  }

  // Frequency map for mode
  const freq: Record<number, number> = {};
  let maxFreq = 0;
  for (const num of sorted) {
    freq[num] = (freq[num] || 0) + 1;
    if (freq[num] > maxFreq) {
      maxFreq = freq[num];
    }
  }

  const modes: number[] = [];
  if (maxFreq > 1) {
    for (const key in freq) {
      if (freq[key] === maxFreq) {
        modes.push(Number(key));
      }
    }
  }

  // Variance & Standard Deviation (Sample & Population)
  // Population variance
  const variance = cleanPrecision(
    numbers.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / count
  );
  const stdDev = cleanPrecision(Math.sqrt(variance));

  return {
    count,
    sum,
    mean,
    median,
    mode: modes,
    variance,
    stdDev,
    min,
    max,
  };
}
