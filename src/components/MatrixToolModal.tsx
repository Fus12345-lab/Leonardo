import React, { useState } from 'react';
import { Matrix, addMatrices, subtractMatrices, multiplyMatrices, transposeMatrix, determinantMatrix, invertMatrix, createEmptyMatrix } from '../utils/matrixEngine';
import { Grid2X2, RotateCw, CornerDownLeft, Sparkles, Hash } from 'lucide-react';

interface MatrixToolModalProps {
  onInsertToCalculator: (val: string) => void;
}

export const MatrixToolModal: React.FC<MatrixToolModalProps> = ({
  onInsertToCalculator,
}) => {
  const [dim, setDim] = useState<2 | 3>(2);

  // Matrix A state
  const [matA, setMatA] = useState<Matrix>([
    [1, 2],
    [3, 4],
  ]);

  // Matrix B state
  const [matB, setMatB] = useState<Matrix>([
    [5, 6],
    [7, 8],
  ]);

  const [resultMat, setResultMat] = useState<Matrix | null>(null);
  const [scalarResult, setScalarResult] = useState<{ label: string; val: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Update dimensions
  const changeDimension = (newDim: 2 | 3) => {
    setDim(newDim);
    setMatA(createEmptyMatrix(newDim, newDim, 1));
    setMatB(createEmptyMatrix(newDim, newDim, 2));
    setResultMat(null);
    setScalarResult(null);
    setErrorMsg(null);
  };

  const handleCellChange = (mat: 'A' | 'B', r: number, c: number, val: string) => {
    const parsed = parseFloat(val) || 0;
    if (mat === 'A') {
      const next = matA.map((row, rowIdx) =>
        row.map((cell, colIdx) => (rowIdx === r && colIdx === c ? parsed : cell))
      );
      setMatA(next);
    } else {
      const next = matB.map((row, rowIdx) =>
        row.map((cell, colIdx) => (rowIdx === r && colIdx === c ? parsed : cell))
      );
      setMatB(next);
    }
  };

  // Operations
  const handleAdd = () => {
    setErrorMsg(null);
    setScalarResult(null);
    try {
      setResultMat(addMatrices(matA, matB));
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  const handleSubtract = () => {
    setErrorMsg(null);
    setScalarResult(null);
    try {
      setResultMat(subtractMatrices(matA, matB));
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  const handleMultiply = () => {
    setErrorMsg(null);
    setScalarResult(null);
    try {
      setResultMat(multiplyMatrices(matA, matB));
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  const handleTransposeA = () => {
    setErrorMsg(null);
    setScalarResult(null);
    setResultMat(transposeMatrix(matA));
  };

  const handleDetA = () => {
    setErrorMsg(null);
    setResultMat(null);
    try {
      const d = determinantMatrix(matA);
      setScalarResult({ label: 'det(A)', val: d });
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  const handleInvertA = () => {
    setErrorMsg(null);
    setScalarResult(null);
    try {
      setResultMat(invertMatrix(matA));
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-6">
      {/* Header & Size switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Grid2X2 className="w-5 h-5 text-indigo-500" />
            Operaciones con Matrices
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suma, resta, multiplicación, determinante, inversa y transpuesta.
          </p>
        </div>

        {/* Dimension selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <span className="text-xs font-semibold px-2 text-slate-500">Dimensión:</span>
          <button
            onClick={() => changeDimension(2)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              dim === 2
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            2 × 2
          </button>
          <button
            onClick={() => changeDimension(3)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              dim === 3
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            3 × 3
          </button>
        </div>
      </div>

      {/* Matrices input grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matrix A */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Matriz A ({dim}×{dim})
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={handleDetA}
                className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300"
              >
                det(A)
              </button>
              <button
                onClick={handleInvertA}
                className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300"
              >
                A⁻¹
              </button>
              <button
                onClick={handleTransposeA}
                className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300"
              >
                Aᵀ
              </button>
            </div>
          </div>

          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${dim}, minmax(0, 1fr))` }}
          >
            {matA.map((row, r) =>
              row.map((cell, c) => (
                <input
                  key={`a-${r}-${c}`}
                  type="number"
                  value={cell}
                  onChange={(e) => handleCellChange('A', r, c, e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 text-center font-mono font-bold text-base focus:ring-2 focus:ring-indigo-500"
                />
              ))
            )}
          </div>
        </div>

        {/* Matrix B */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
              Matriz B ({dim}×{dim})
            </span>
          </div>

          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${dim}, minmax(0, 1fr))` }}
          >
            {matB.map((row, r) =>
              row.map((cell, c) => (
                <input
                  key={`b-${r}-${c}`}
                  type="number"
                  value={cell}
                  onChange={(e) => handleCellChange('B', r, c, e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 text-center font-mono font-bold text-base focus:ring-2 focus:ring-violet-500"
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Operations buttons between A and B */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
        >
          A + B (Suma)
        </button>
        <button
          onClick={handleSubtract}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
        >
          A − B (Resta)
        </button>
        <button
          onClick={handleMultiply}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
        >
          A × B (Multiplicación)
        </button>
      </div>

      {/* Error display */}
      {errorMsg && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Result Display */}
      {scalarResult && (
        <div className="p-4 bg-indigo-50 dark:bg-slate-800/80 rounded-xl border border-indigo-200 dark:border-indigo-900 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">{scalarResult.label}:</div>
            <div className="font-mono text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {scalarResult.val}
            </div>
          </div>
          <button
            onClick={() => onInsertToCalculator(String(scalarResult.val))}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
            Usar en calculadora
          </button>
        </div>
      )}

      {resultMat && (
        <div className="p-4 bg-indigo-50 dark:bg-slate-800/80 rounded-xl border border-indigo-200 dark:border-indigo-900 space-y-3">
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            Matriz Resultante:
          </div>

          <div
            className="grid gap-2 max-w-sm mx-auto"
            style={{ gridTemplateColumns: `repeat(${resultMat[0].length}, minmax(0, 1fr))` }}
          >
            {resultMat.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`res-${r}-${c}`}
                  className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-indigo-200 dark:border-indigo-800 text-center font-mono font-bold text-slate-900 dark:text-white"
                >
                  {cell}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
