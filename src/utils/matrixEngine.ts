import { cleanPrecision } from './mathEngine';

export type Matrix = number[][];

export function createEmptyMatrix(rows: number, cols: number, initialValue: number = 0): Matrix {
  return Array.from({ length: rows }, () => Array(cols).fill(initialValue));
}

export function addMatrices(A: Matrix, B: Matrix): Matrix {
  const rows = A.length;
  const cols = A[0].length;
  if (rows !== B.length || cols !== B[0].length) {
    throw new Error('Error: Las matrices deben tener exactamente las mismas dimensiones para sumarse.');
  }

  const result: Matrix = createEmptyMatrix(rows, cols);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      result[r][c] = cleanPrecision(A[r][c] + B[r][c]);
    }
  }
  return result;
}

export function subtractMatrices(A: Matrix, B: Matrix): Matrix {
  const rows = A.length;
  const cols = A[0].length;
  if (rows !== B.length || cols !== B[0].length) {
    throw new Error('Error: Las matrices deben tener exactamente las mismas dimensiones para restarse.');
  }

  const result: Matrix = createEmptyMatrix(rows, cols);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      result[r][c] = cleanPrecision(A[r][c] - B[r][c]);
    }
  }
  return result;
}

export function multiplyMatrices(A: Matrix, B: Matrix): Matrix {
  const rowsA = A.length;
  const colsA = A[0].length;
  const rowsB = B.length;
  const colsB = B[0].length;

  if (colsA !== rowsB) {
    throw new Error(`Error: No se pueden multiplicar. Las columnas de A (${colsA}) deben ser iguales a las filas de B (${rowsB}).`);
  }

  const result: Matrix = createEmptyMatrix(rowsA, colsB);
  for (let r = 0; r < rowsA; r++) {
    for (let c = 0; c < colsB; c++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += A[r][k] * B[k][c];
      }
      result[r][c] = cleanPrecision(sum);
    }
  }
  return result;
}

export function transposeMatrix(M: Matrix): Matrix {
  const rows = M.length;
  const cols = M[0].length;
  const result: Matrix = createEmptyMatrix(cols, rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      result[c][r] = M[r][c];
    }
  }
  return result;
}

// Determinant using Gaussian elimination
export function determinantMatrix(M: Matrix): number {
  const n = M.length;
  if (n !== M[0].length) {
    throw new Error('Error: El determinante solo está definido para matrices cuadradas.');
  }

  // Clone matrix
  const A: Matrix = M.map((row) => [...row]);
  let det = 1;

  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(A[j][i]) > Math.abs(A[pivot][i])) {
        pivot = j;
      }
    }

    if (Math.abs(A[pivot][i]) < 1e-12) {
      return 0;
    }

    if (pivot !== i) {
      const temp = A[i];
      A[i] = A[pivot];
      A[pivot] = temp;
      det = -det;
    }

    det *= A[i][i];

    for (let j = i + 1; j < n; j++) {
      const factor = A[j][i] / A[i][i];
      for (let k = i; k < n; k++) {
        A[j][k] -= factor * A[i][k];
      }
    }
  }

  return cleanPrecision(det);
}

// Invert matrix using Gauss-Jordan elimination
export function invertMatrix(M: Matrix): Matrix {
  const n = M.length;
  if (n !== M[0].length) {
    throw new Error('Error: La inversa solo está definida para matrices cuadradas.');
  }

  const det = determinantMatrix(M);
  if (Math.abs(det) < 1e-12) {
    throw new Error('Error: La matriz es singular (determinante = 0), por lo que no tiene inversa.');
  }

  // Augmented matrix [A | I]
  const aug: Matrix = M.map((row, i) => [
    ...row,
    ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  ]);

  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(aug[j][i]) > Math.abs(aug[pivot][i])) {
        pivot = j;
      }
    }

    if (Math.abs(aug[pivot][i]) < 1e-12) {
      throw new Error('Error: La matriz no es invertible.');
    }

    if (pivot !== i) {
      const temp = aug[i];
      aug[i] = aug[pivot];
      aug[pivot] = temp;
    }

    const pivotVal = aug[i][i];
    for (let k = 0; k < 2 * n; k++) {
      aug[i][k] /= pivotVal;
    }

    for (let j = 0; j < n; j++) {
      if (j !== i) {
        const factor = aug[j][i];
        for (let k = 0; k < 2 * n; k++) {
          aug[j][k] -= factor * aug[i][k];
        }
      }
    }
  }

  // Extract right half
  const inv: Matrix = aug.map((row) =>
    row.slice(n).map((v) => cleanPrecision(v))
  );

  return inv;
}
