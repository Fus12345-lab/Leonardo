import React, { useState } from 'react';
import { AngleMode, ComplexNumber } from '../types';
import { 
  formatComplex, 
  addComplex, 
  subtractComplex, 
  multiplyComplex, 
  divideComplex, 
  modulusComplex, 
  argumentComplex, 
  toPolarForm 
} from '../utils/complexEngine';
import { Atom, CornerDownLeft, Plus, Minus, X, Divide, Compass } from 'lucide-react';

interface ComplexToolModalProps {
  angleMode: AngleMode;
  onInsertToCalculator: (val: string) => void;
}

export const ComplexToolModal: React.FC<ComplexToolModalProps> = ({
  angleMode,
  onInsertToCalculator,
}) => {
  // Complex z1 = a + bi
  const [z1Re, setZ1Re] = useState<string>('3');
  const [z1Im, setZ1Im] = useState<string>('4');

  // Complex z2 = c + di
  const [z2Re, setZ2Re] = useState<string>('1');
  const [z2Im, setZ2Im] = useState<string>('-2');

  const [operation, setOperation] = useState<'+' | '-' | '*' | '/'>('+');
  const [error, setError] = useState<string | null>(null);

  const c1: ComplexNumber = {
    re: parseFloat(z1Re) || 0,
    im: parseFloat(z1Im) || 0,
  };

  const c2: ComplexNumber = {
    re: parseFloat(z2Re) || 0,
    im: parseFloat(z2Im) || 0,
  };

  let opResult: ComplexNumber | null = null;
  try {
    if (operation === '+') opResult = addComplex(c1, c2);
    else if (operation === '-') opResult = subtractComplex(c1, c2);
    else if (operation === '*') opResult = multiplyComplex(c1, c2);
    else if (operation === '/') opResult = divideComplex(c1, c2);
  } catch (err: any) {
    // division by zero
  }

  // Properties of z1
  const polar1 = toPolarForm(c1, angleMode);
  const polar2 = toPolarForm(c2, angleMode);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Atom className="w-5 h-5 text-indigo-500" />
            Calculadora de Números Complejos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suma, resta, multiplicación, división, módulo y argumento en modo {angleMode}.
          </p>
        </div>
      </div>

      {/* Input of Z1 and Z2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Z1 Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Número Complejo z₁:
            </span>
            <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {formatComplex(c1)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono">
            <div>
              <label className="text-[11px] text-slate-500 font-medium">Parte Real (a):</label>
              <input
                type="number"
                value={z1Re}
                onChange={(e) => setZ1Re(e.target.value)}
                className="w-full mt-1 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 text-base font-bold text-center"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 font-medium">Parte Imaginaria (b·i):</label>
              <input
                type="number"
                value={z1Im}
                onChange={(e) => setZ1Im(e.target.value)}
                className="w-full mt-1 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 text-base font-bold text-center"
              />
            </div>
          </div>

          {/* Properties of z1 */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
            <div className="flex justify-between text-slate-500">
              <span>Módulo |z₁|:</span>
              <strong className="font-mono text-slate-800 dark:text-slate-200">{polar1.r}</strong>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Argumento θ ({angleMode}):</span>
              <strong className="font-mono text-slate-800 dark:text-slate-200">{polar1.theta}°</strong>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Forma Polar:</span>
              <strong className="font-mono text-indigo-600 dark:text-indigo-400">{polar1.formatted}</strong>
            </div>
          </div>
        </div>

        {/* Z2 Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Número Complejo z₂:
            </span>
            <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {formatComplex(c2)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono">
            <div>
              <label className="text-[11px] text-slate-500 font-medium">Parte Real (c):</label>
              <input
                type="number"
                value={z2Re}
                onChange={(e) => setZ2Re(e.target.value)}
                className="w-full mt-1 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 text-base font-bold text-center"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 font-medium">Parte Imaginaria (d·i):</label>
              <input
                type="number"
                value={z2Im}
                onChange={(e) => setZ2Im(e.target.value)}
                className="w-full mt-1 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 text-base font-bold text-center"
              />
            </div>
          </div>

          {/* Properties of z2 */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
            <div className="flex justify-between text-slate-500">
              <span>Módulo |z₂|:</span>
              <strong className="font-mono text-slate-800 dark:text-slate-200">{polar2.r}</strong>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Argumento θ ({angleMode}):</span>
              <strong className="font-mono text-slate-800 dark:text-slate-200">{polar2.theta}°</strong>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Forma Polar:</span>
              <strong className="font-mono text-indigo-600 dark:text-indigo-400">{polar2.formatted}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Operation selector pills */}
      <div className="flex items-center justify-center gap-3">
        {[
          { op: '+' as const, label: 'Suma (z₁ + z₂)' },
          { op: '-' as const, label: 'Resta (z₁ − z₂)' },
          { op: '*' as const, label: 'Multiplicación (z₁ × z₂)' },
          { op: '/' as const, label: 'División (z₁ ÷ z₂)' },
        ].map((item) => (
          <button
            key={item.op}
            onClick={() => setOperation(item.op)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              operation === item.op
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Calculation Result */}
      {opResult ? (
        <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-slate-800/80 dark:to-slate-800/50 border border-indigo-200 dark:border-indigo-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
              Resultado Binómico (a + bi):
            </div>
            <div className="font-mono text-2xl font-bold text-slate-950 dark:text-white">
              {formatComplex(opResult)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Forma polar: {toPolarForm(opResult, angleMode).formatted}
            </div>
          </div>

          <button
            onClick={() => onInsertToCalculator(String(opResult?.re))}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
          >
            <CornerDownLeft className="w-4 h-4" />
            <span>Usar parte real</span>
          </button>
        </div>
      ) : (
        <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold">
          Error: división por cero con z₂ = 0.
        </div>
      )}
    </div>
  );
};
