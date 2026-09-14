import React, { useState } from 'react';
import { 
  solveLinearEquation, 
  solveQuadraticEquation, 
  solveLinearSystem2x2, 
  calculateRuleOfThree, 
  calculateStatistics, 
  combinations, 
  permutations 
} from '../utils/algebraEngine';
import { StatsResult, QuadraticResult } from '../types';
import { 
  Sigma, 
  Variable, 
  Divide, 
  Binary, 
  BarChart3, 
  Check, 
  CornerDownLeft,
  Info
} from 'lucide-react';

interface AdvancedToolsModalProps {
  onInsertToCalculator: (val: string) => void;
}

type SubTool = 'linear' | 'quadratic' | 'system' | 'ruleOfThree' | 'combinatorics' | 'statistics';

export const AdvancedToolsModal: React.FC<AdvancedToolsModalProps> = ({
  onInsertToCalculator,
}) => {
  const [activeTool, setActiveTool] = useState<SubTool>('linear');

  // Linear Equation: ax + b = c
  const [linA, setLinA] = useState<string>('2');
  const [linB, setLinB] = useState<string>('4');
  const [linC, setLinC] = useState<string>('12');
  const [linResult, setLinResult] = useState<{ solution: number | string; description: string } | null>(null);

  // Quadratic Equation: ax² + bx + c = 0
  const [quadA, setQuadA] = useState<string>('1');
  const [quadB, setQuadB] = useState<string>('-5');
  const [quadC, setQuadC] = useState<string>('6');
  const [quadResult, setQuadResult] = useState<QuadraticResult | null>(null);
  const [quadError, setQuadError] = useState<string | null>(null);

  // System 2x2:
  // a1*x + b1*y = c1
  // a2*x + b2*y = c2
  const [sysA1, setSysA1] = useState<string>('2');
  const [sysB1, setSysB1] = useState<string>('1');
  const [sysC1, setSysC1] = useState<string>('7');
  const [sysA2, setSysA2] = useState<string>('1');
  const [sysB2, setSysB2] = useState<string>('-1');
  const [sysC2, setSysC2] = useState<string>('2');
  const [sysResult, setSysResult] = useState<{ x: number; y: number } | { error: string } | null>(null);

  // Rule of three
  const [r3A, setR3A] = useState<string>('4');
  const [r3B, setR3B] = useState<string>('100');
  const [r3C, setR3C] = useState<string>('10');
  const [r3Type, setR3Type] = useState<'direct' | 'inverse'>('direct');
  const [r3Result, setR3Result] = useState<number | null>(null);
  const [r3Error, setR3Error] = useState<string | null>(null);

  // Combinatorics
  const [combN, setCombN] = useState<string>('10');
  const [combR, setCombR] = useState<string>('3');
  const [combResult, setCombResult] = useState<{ nCr: number; nPr: number } | null>(null);
  const [combError, setCombError] = useState<string | null>(null);

  // Statistics
  const [statsInput, setStatsInput] = useState<string>('12, 15, 18, 20, 22, 22, 25, 30');
  const [statsResult, setStatsResult] = useState<StatsResult | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Solvers
  const handleSolveLinear = () => {
    const a = parseFloat(linA);
    const b = parseFloat(linB);
    const c = parseFloat(linC);
    if (isNaN(a) || isNaN(b) || isNaN(c)) return;
    setLinResult(solveLinearEquation(a, b, c));
  };

  const handleSolveQuadratic = () => {
    setQuadError(null);
    const a = parseFloat(quadA);
    const b = parseFloat(quadB);
    const c = parseFloat(quadC);
    if (isNaN(a) || isNaN(b) || isNaN(c)) return;
    try {
      setQuadResult(solveQuadraticEquation(a, b, c));
    } catch (e: any) {
      setQuadError(e.message);
      setQuadResult(null);
    }
  };

  const handleSolveSystem = () => {
    const a1 = parseFloat(sysA1);
    const b1 = parseFloat(sysB1);
    const c1 = parseFloat(sysC1);
    const a2 = parseFloat(sysA2);
    const b2 = parseFloat(sysB2);
    const c2 = parseFloat(sysC2);
    if (isNaN(a1) || isNaN(b1) || isNaN(c1) || isNaN(a2) || isNaN(b2) || isNaN(c2)) return;
    setSysResult(solveLinearSystem2x2(a1, b1, c1, a2, b2, c2));
  };

  const handleSolveRuleOfThree = () => {
    setR3Error(null);
    const a = parseFloat(r3A);
    const b = parseFloat(r3B);
    const c = parseFloat(r3C);
    if (isNaN(a) || isNaN(b) || isNaN(c)) return;
    try {
      setR3Result(calculateRuleOfThree(a, b, c, r3Type));
    } catch (e: any) {
      setR3Error(e.message);
      setR3Result(null);
    }
  };

  const handleSolveCombinatorics = () => {
    setCombError(null);
    const n = parseInt(combN, 10);
    const r = parseInt(combR, 10);
    if (isNaN(n) || isNaN(r)) return;
    try {
      const nCr = combinations(n, r);
      const nPr = permutations(n, r);
      setCombResult({ nCr, nPr });
    } catch (e: any) {
      setCombError(e.message);
      setCombResult(null);
    }
  };

  const handleCalculateStatistics = () => {
    setStatsError(null);
    const parts = statsInput
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map(Number);

    if (parts.some(isNaN)) {
      setStatsError('Por favor verifique que todos los valores sean numéricos.');
      setStatsResult(null);
      return;
    }

    try {
      setStatsResult(calculateStatistics(parts));
    } catch (e: any) {
      setStatsError(e.message);
      setStatsResult(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-6">
      {/* Subtools Selector */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sigma className="w-5 h-5 text-indigo-500" />
            Cálculos Avanzados & Álgebra
          </h2>
          <span className="text-xs text-slate-500">Resolución exacta</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
          {[
            { id: 'linear' as SubTool, label: 'Ecuación 1er Grado' },
            { id: 'quadratic' as SubTool, label: 'Ecuación 2do Grado' },
            { id: 'system' as SubTool, label: 'Sistema 2×2' },
            { id: 'ruleOfThree' as SubTool, label: 'Regla de Tres' },
            { id: 'combinatorics' as SubTool, label: 'Combinatoria' },
            { id: 'statistics' as SubTool, label: 'Estadística' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTool(tab.id)}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                activeTool === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Subtool Content */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70">
        {/* 1. LINEAR EQUATION: ax + b = c */}
        {activeTool === 'linear' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Ecuación Lineal de Primer Grado: <span className="text-indigo-600 dark:text-indigo-400 font-mono">ax + b = c</span>
              </h3>
              <p className="text-xs text-slate-500">
                Introduce los coeficientes para despejar la incógnita <span className="font-mono">x</span>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-base font-mono">
              <input
                type="number"
                value={linA}
                onChange={(e) => setLinA(e.target.value)}
                className="w-20 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-center font-bold"
                placeholder="a"
              />
              <span className="font-bold text-slate-500">x +</span>
              <input
                type="number"
                value={linB}
                onChange={(e) => setLinB(e.target.value)}
                className="w-20 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-center font-bold"
                placeholder="b"
              />
              <span className="font-bold text-slate-500">=</span>
              <input
                type="number"
                value={linC}
                onChange={(e) => setLinC(e.target.value)}
                className="w-20 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-center font-bold"
                placeholder="c"
              />

              <button
                onClick={handleSolveLinear}
                className="ml-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20"
              >
                Resolver
              </button>
            </div>

            {linResult && (
              <div className="mt-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Resultado:</div>
                  <div className="font-mono text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    x = {linResult.solution}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-mono">
                    {linResult.description}
                  </div>
                </div>
                {typeof linResult.solution === 'number' && (
                  <button
                    onClick={() => onInsertToCalculator(String(linResult.solution))}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <CornerDownLeft className="w-3.5 h-3.5" />
                    Insertar en calculadora
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 2. QUADRATIC EQUATION: ax² + bx + c = 0 */}
        {activeTool === 'quadratic' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Ecuación de Segundo Grado: <span className="text-indigo-600 dark:text-indigo-400 font-mono">ax² + bx + c = 0</span>
              </h3>
              <p className="text-xs text-slate-500">
                Calcula raíces reales o complejas utilizando la fórmula cuadrática general y calcula el vértice.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-base font-mono">
              <input
                type="number"
                value={quadA}
                onChange={(e) => setQuadA(e.target.value)}
                className="w-20 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-center font-bold"
                placeholder="a"
              />
              <span className="font-bold text-slate-500">x² +</span>
              <input
                type="number"
                value={quadB}
                onChange={(e) => setQuadB(e.target.value)}
                className="w-20 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-center font-bold"
                placeholder="b"
              />
              <span className="font-bold text-slate-500">x +</span>
              <input
                type="number"
                value={quadC}
                onChange={(e) => setQuadC(e.target.value)}
                className="w-20 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-center font-bold"
                placeholder="c"
              />
              <span className="font-bold text-slate-500">= 0</span>

              <button
                onClick={handleSolveQuadratic}
                className="ml-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20"
              >
                Resolver
              </button>
            </div>

            {quadError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold">
                {quadError}
              </div>
            )}

            {quadResult && (
              <div className="mt-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-indigo-900/50 space-y-3">
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span>Discriminante (Δ = b² - 4ac): <strong className="text-slate-900 dark:text-white font-mono">{quadResult.discriminant}</strong></span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold">
                    {quadResult.type === 'two_real' ? '2 Raíces Reales' : quadResult.type === 'one_real' ? '1 Raíz Doble' : '2 Raíces Complejas'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="text-xs text-slate-500">Raíz x₁:</div>
                    <div className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      x₁ = {quadResult.x1}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="text-xs text-slate-500">Raíz x₂:</div>
                    <div className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      x₂ = {quadResult.x2}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  Vértice de la parábola: V({quadResult.vertex.x}, {quadResult.vertex.y})
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. SYSTEM 2x2 */}
        {activeTool === 'system' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Sistema de Ecuaciones Lineales 2×2
              </h3>
              <p className="text-xs text-slate-500">
                Resuelve sistemas de dos ecuaciones lineales con dos incógnitas por regla de Cramer.
              </p>
            </div>

            <div className="space-y-2 font-mono">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  value={sysA1}
                  onChange={(e) => setSysA1(e.target.value)}
                  className="w-16 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 text-center font-bold"
                />
                <span>x +</span>
                <input
                  type="number"
                  value={sysB1}
                  onChange={(e) => setSysB1(e.target.value)}
                  className="w-16 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 text-center font-bold"
                />
                <span>y =</span>
                <input
                  type="number"
                  value={sysC1}
                  onChange={(e) => setSysC1(e.target.value)}
                  className="w-16 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 text-center font-bold"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  value={sysA2}
                  onChange={(e) => setSysA2(e.target.value)}
                  className="w-16 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 text-center font-bold"
                />
                <span>x +</span>
                <input
                  type="number"
                  value={sysB2}
                  onChange={(e) => setSysB2(e.target.value)}
                  className="w-16 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 text-center font-bold"
                />
                <span>y =</span>
                <input
                  type="number"
                  value={sysC2}
                  onChange={(e) => setSysC2(e.target.value)}
                  className="w-16 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 text-center font-bold"
                />

                <button
                  onClick={handleSolveSystem}
                  className="ml-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20"
                >
                  Resolver Sistema
                </button>
              </div>
            </div>

            {sysResult && (
              <div className="mt-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-indigo-900/50">
                {'error' in sysResult ? (
                  <div className="text-rose-500 font-semibold text-xs">{sysResult.error}</div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-xs text-slate-500 font-medium">Solución de x:</div>
                      <div className="font-mono text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        x = {sysResult.x}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-xs text-slate-500 font-medium">Solución de y:</div>
                      <div className="font-mono text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        y = {sysResult.y}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 4. RULE OF THREE */}
        {activeTool === 'ruleOfThree' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Regla de Tres
                </h3>
                <p className="text-xs text-slate-500">
                  Proporcionalidad directa o inversa: Si A da B, entonces C da X.
                </p>
              </div>

              <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-900 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setR3Type('direct')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    r3Type === 'direct' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Directa
                </button>
                <button
                  onClick={() => setR3Type('inverse')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    r3Type === 'inverse' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Inversa
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-lg font-mono">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500 mb-1">Valor A:</div>
                <input
                  type="number"
                  value={r3A}
                  onChange={(e) => setR3A(e.target.value)}
                  className="w-full font-bold text-lg bg-transparent outline-hidden"
                />
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500 mb-1">Produce B:</div>
                <input
                  type="number"
                  value={r3B}
                  onChange={(e) => setR3B(e.target.value)}
                  className="w-full font-bold text-lg bg-transparent outline-hidden"
                />
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500 mb-1">Valor C:</div>
                <input
                  type="number"
                  value={r3C}
                  onChange={(e) => setR3C(e.target.value)}
                  className="w-full font-bold text-lg bg-transparent outline-hidden"
                />
              </div>

              <div className="p-3 bg-indigo-50/60 dark:bg-slate-800/80 rounded-xl border border-indigo-200 dark:border-indigo-900 flex flex-col justify-between">
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">Resultado X:</div>
                <div className="text-xl font-bold text-indigo-600 dark:text-indigo-300">
                  {r3Result !== null ? r3Result : '?'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-mono">
                {r3Type === 'direct' ? 'Fórmula: X = (B × C) / A' : 'Fórmula: X = (A × B) / C'}
              </span>
              <button
                onClick={handleSolveRuleOfThree}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20"
              >
                Calcular Proporción
              </button>
            </div>
          </div>
        )}

        {/* 5. COMBINATORICS: nCr, nPr */}
        {activeTool === 'combinatorics' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Combinatoria: Combinaciones (nCr) y Permutaciones (nPr)
              </h3>
              <p className="text-xs text-slate-500">
                Calcula subconjuntos ordenados (permutaciones) y sin orden (combinaciones) de n elementos tomados de r en r.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-500">n =</span>
                <input
                  type="number"
                  min="0"
                  value={combN}
                  onChange={(e) => setCombN(e.target.value)}
                  className="w-24 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-center font-bold"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-500">r =</span>
                <input
                  type="number"
                  min="0"
                  value={combR}
                  onChange={(e) => setCombR(e.target.value)}
                  className="w-24 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-center font-bold"
                />
              </div>

              <button
                onClick={handleSolveCombinatorics}
                className="ml-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20"
              >
                Calcular
              </button>
            </div>

            {combError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold">
                {combError}
              </div>
            )}

            {combResult && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-xs text-slate-500 font-semibold mb-1">
                    Combinaciones C({combN}, {combR}):
                  </div>
                  <div className="font-mono text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {combResult.nCr.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    n! / (r! × (n - r)!)
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-xs text-slate-500 font-semibold mb-1">
                    Permutaciones P({combN}, {combR}):
                  </div>
                  <div className="font-mono text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {combResult.nPr.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    n! / (n - r)!
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. STATISTICS */}
        {activeTool === 'statistics' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Estadística Descriptiva & Promedios
              </h3>
              <p className="text-xs text-slate-500">
                Introduce números separados por comas o espacios para calcular media, mediana, moda, varianza y desviación estándar.
              </p>
            </div>

            <div>
              <textarea
                value={statsInput}
                onChange={(e) => setStatsInput(e.target.value)}
                rows={2}
                className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 font-mono text-sm focus:ring-2 focus:ring-indigo-500"
                placeholder="Ejemplo: 10, 15, 20, 20, 25, 30"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleCalculateStatistics}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20"
                >
                  Analizar Datos Estadísticos
                </button>
              </div>
            </div>

            {statsError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold">
                {statsError}
              </div>
            )}

            {statsResult && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 font-medium">Media (Promedio):</span>
                  <div className="font-mono text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {statsResult.mean}
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 font-medium">Mediana:</span>
                  <div className="font-mono text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                    {statsResult.median}
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 font-medium">Moda:</span>
                  <div className="font-mono text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                    {statsResult.mode.length > 0 ? statsResult.mode.join(', ') : 'Sin moda'}
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 font-medium">Desviación Estándar (σ):</span>
                  <div className="font-mono text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {statsResult.stdDev}
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 font-medium">Varianza (σ²):</span>
                  <div className="font-mono text-lg font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                    {statsResult.variance}
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 font-medium">Suma Total (Σx):</span>
                  <div className="font-mono text-lg font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                    {statsResult.sum}
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 font-medium">Rango [Min, Max]:</span>
                  <div className="font-mono text-base font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                    [{statsResult.min}, {statsResult.max}]
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 font-medium">Cantidad (N):</span>
                  <div className="font-mono text-lg font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                    {statsResult.count}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
