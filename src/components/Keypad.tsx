import React, { useState } from 'react';
import { Sparkles, CornerDownLeft, Equal } from 'lucide-react';

interface KeypadProps {
  onInput: (val: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onCalculate: () => void;
  onToggleSign: () => void;
  // Memory
  onMemoryClear: () => void;
  onMemoryRecall: () => void;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
  onMemoryStore: () => void;
  hasMemory: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  onInput,
  onClear,
  onBackspace,
  onCalculate,
  onToggleSign,
  onMemoryClear,
  onMemoryRecall,
  onMemoryAdd,
  onMemorySubtract,
  onMemoryStore,
  hasMemory,
}) => {
  const [isSecond, setIsSecond] = useState(false);
  const [activeScientificSubTab, setActiveScientificSubTab] = useState<'trig' | 'powers' | 'constants' | 'hyperbolic'>('trig');

  return (
    <div className="w-full flex flex-col gap-2.5 select-none">
      {/* Memory Bar */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        <button
          onClick={onMemoryClear}
          disabled={!hasMemory}
          className="py-1.5 px-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          title="Borrar memoria (MC)"
        >
          MC
        </button>
        <button
          onClick={onMemoryRecall}
          disabled={!hasMemory}
          className="py-1.5 px-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          title="Recuperar de memoria (MR)"
        >
          MR
        </button>
        <button
          onClick={onMemoryAdd}
          className="py-1.5 px-2 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Sumar resultado a memoria (M+)"
        >
          M+
        </button>
        <button
          onClick={onMemorySubtract}
          className="py-1.5 px-2 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Restar resultado de memoria (M-)"
        >
          M−
        </button>
        <button
          onClick={onMemoryStore}
          className="py-1.5 px-2 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Guardar en memoria (MS)"
        >
          MS
        </button>
      </div>

      {/* Scientific Function Panel Sub-navigation */}
      <div className="flex items-center justify-between gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveScientificSubTab('trig')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              activeScientificSubTab === 'trig'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Trigonometría
          </button>
          <button
            onClick={() => setActiveScientificSubTab('powers')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              activeScientificSubTab === 'powers'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Potencias & Raíces
          </button>
          <button
            onClick={() => setActiveScientificSubTab('hyperbolic')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              activeScientificSubTab === 'hyperbolic'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Hiperbólicas
          </button>
          <button
            onClick={() => setActiveScientificSubTab('constants')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              activeScientificSubTab === 'constants'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Constantes
          </button>
        </div>

        {/* 2nd Function Toggle */}
        <button
          onClick={() => setIsSecond(!isSecond)}
          className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition-all ${
            isSecond
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
          }`}
          title="Alternar funciones secundarias (2nd)"
        >
          <Sparkles className="w-3 h-3" />
          <span>2nd</span>
        </button>
      </div>

      {/* Scientific Functions Grid (Adaptive) */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
        {activeScientificSubTab === 'trig' && (
          <>
            {!isSecond ? (
              <>
                <button
                  onClick={() => onInput('sin(')}
                  className="btn-scientific"
                >
                  sin
                </button>
                <button
                  onClick={() => onInput('cos(')}
                  className="btn-scientific"
                >
                  cos
                </button>
                <button
                  onClick={() => onInput('tan(')}
                  className="btn-scientific"
                >
                  tan
                </button>
                <button
                  onClick={() => onInput('log(')}
                  className="btn-scientific"
                  title="Logaritmo base 10"
                >
                  log
                </button>
                <button
                  onClick={() => onInput('ln(')}
                  className="btn-scientific"
                  title="Logaritmo natural"
                >
                  ln
                </button>
                <button
                  onClick={() => onInput('log2(')}
                  className="btn-scientific"
                  title="Logaritmo base 2"
                >
                  log₂
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onInput('asin(')}
                  className="btn-scientific text-indigo-600 dark:text-indigo-400 font-semibold"
                  title="Arcoseno"
                >
                  asin
                </button>
                <button
                  onClick={() => onInput('acos(')}
                  className="btn-scientific text-indigo-600 dark:text-indigo-400 font-semibold"
                  title="Arcocoseno"
                >
                  acos
                </button>
                <button
                  onClick={() => onInput('atan(')}
                  className="btn-scientific text-indigo-600 dark:text-indigo-400 font-semibold"
                  title="Arcotangente"
                >
                  atan
                </button>
                <button
                  onClick={() => onInput('10^(')}
                  className="btn-scientific text-indigo-600 dark:text-indigo-400 font-semibold"
                >
                  10ˣ
                </button>
                <button
                  onClick={() => onInput('e^(')}
                  className="btn-scientific text-indigo-600 dark:text-indigo-400 font-semibold"
                >
                  eˣ
                </button>
                <button
                  onClick={() => onInput('2^(')}
                  className="btn-scientific text-indigo-600 dark:text-indigo-400 font-semibold"
                >
                  2ˣ
                </button>
              </>
            )}
          </>
        )}

        {activeScientificSubTab === 'powers' && (
          <>
            <button
              onClick={() => onInput('^2')}
              className="btn-scientific"
              title="Elevar al cuadrado"
            >
              x²
            </button>
            <button
              onClick={() => onInput('^3')}
              className="btn-scientific"
              title="Elevar al cubo"
            >
              x³
            </button>
            <button
              onClick={() => onInput('^')}
              className="btn-scientific font-bold"
              title="Potencia xʸ"
            >
              xⁿ
            </button>
            <button
              onClick={() => onInput('sqrt(')}
              className="btn-scientific"
              title="Raíz cuadrada"
            >
              √
            </button>
            <button
              onClick={() => onInput('cbrt(')}
              className="btn-scientific"
              title="Raíz cúbica"
            >
              ∛
            </button>
            <button
              onClick={() => onInput('nroot(')}
              className="btn-scientific"
              title="Raíz n-ésima: nroot(índice, radicando)"
            >
              ⁿ√
            </button>
          </>
        )}

        {activeScientificSubTab === 'hyperbolic' && (
          <>
            <button
              onClick={() => onInput('sinh(')}
              className="btn-scientific"
            >
              sinh
            </button>
            <button
              onClick={() => onInput('cosh(')}
              className="btn-scientific"
            >
              cosh
            </button>
            <button
              onClick={() => onInput('tanh(')}
              className="btn-scientific"
            >
              tanh
            </button>
            <button
              onClick={() => onInput('abs(')}
              className="btn-scientific"
              title="Valor absoluto"
            >
              |x|
            </button>
            <button
              onClick={() => onInput('!')}
              className="btn-scientific font-bold"
              title="Factorial"
            >
              x!
            </button>
            <button
              onClick={() => onInput('inv(')}
              className="btn-scientific"
              title="Inverso multiplicativo 1/x"
            >
              1/x
            </button>
          </>
        )}

        {activeScientificSubTab === 'constants' && (
          <>
            <button
              onClick={() => onInput('π')}
              className="btn-scientific font-serif text-base"
              title="Pi (3.14159...)"
            >
              π
            </button>
            <button
              onClick={() => onInput('e')}
              className="btn-scientific font-serif text-base"
              title="Número de Euler (2.71828...)"
            >
              e
            </button>
            <button
              onClick={() => onInput('φ')}
              className="btn-scientific font-serif text-base"
              title="Número áureo Phi (1.61803...)"
            >
              φ
            </button>
            <button
              onClick={() => onInput('√2')}
              className="btn-scientific"
              title="Raíz de 2 (1.41421...)"
            >
              √2
            </button>
            <button
              onClick={() => onInput('√3')}
              className="btn-scientific"
              title="Raíz de 3 (1.73205...)"
            >
              √3
            </button>
            <button
              onClick={() => onInput('γ')}
              className="btn-scientific font-serif text-base"
              title="Constante de Euler-Mascheroni (0.57721...)"
            >
              γ
            </button>
          </>
        )}
      </div>

      {/* Main Combined Scientific & Numeric Keypad */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-1">
        {/* Row 1: Special Math Ops */}
        <button
          onClick={() => onInput('(')}
          className="btn-keypad-secondary"
        >
          (
        </button>
        <button
          onClick={() => onInput(')')}
          className="btn-keypad-secondary"
        >
          )
        </button>
        <button
          onClick={() => onInput('%')}
          className="btn-keypad-secondary"
          title="Porcentaje o residuo"
        >
          %
        </button>
        <button
          onClick={() => onInput(' mod ')}
          className="btn-keypad-secondary hidden sm:flex items-center justify-center"
          title="Módulo matemático"
        >
          mod
        </button>
        <button
          onClick={() => onInput(' ÷ ')}
          className="btn-operator text-lg sm:text-xl font-bold"
        >
          ÷
        </button>

        {/* Row 2: 7, 8, 9, x, mod (mobile) */}
        <button
          onClick={() => onInput('7')}
          className="btn-digit"
        >
          7
        </button>
        <button
          onClick={() => onInput('8')}
          className="btn-digit"
        >
          8
        </button>
        <button
          onClick={() => onInput('9')}
          className="btn-digit"
        >
          9
        </button>
        <button
          onClick={() => onInput('inv(')}
          className="btn-keypad-secondary hidden sm:flex items-center justify-center text-xs"
          title="1/x"
        >
          1/x
        </button>
        <button
          onClick={() => onInput(' × ')}
          className="btn-operator text-lg sm:text-xl font-bold"
        >
          ×
        </button>

        {/* Row 3: 4, 5, 6, -, factorial */}
        <button
          onClick={() => onInput('4')}
          className="btn-digit"
        >
          4
        </button>
        <button
          onClick={() => onInput('5')}
          className="btn-digit"
        >
          5
        </button>
        <button
          onClick={() => onInput('6')}
          className="btn-digit"
        >
          6
        </button>
        <button
          onClick={() => onInput('!')}
          className="btn-keypad-secondary hidden sm:flex items-center justify-center font-bold"
          title="Factorial"
        >
          n!
        </button>
        <button
          onClick={() => onInput(' − ')}
          className="btn-operator text-lg sm:text-xl font-bold"
        >
          −
        </button>

        {/* Row 4: 1, 2, 3, +, sqrt */}
        <button
          onClick={() => onInput('1')}
          className="btn-digit"
        >
          1
        </button>
        <button
          onClick={() => onInput('2')}
          className="btn-digit"
        >
          2
        </button>
        <button
          onClick={() => onInput('3')}
          className="btn-digit"
        >
          3
        </button>
        <button
          onClick={() => onInput('sqrt(')}
          className="btn-keypad-secondary hidden sm:flex items-center justify-center font-bold"
          title="Raíz cuadrada"
        >
          √
        </button>
        <button
          onClick={() => onInput(' + ')}
          className="btn-operator text-lg sm:text-xl font-bold"
        >
          +
        </button>

        {/* Row 5: +/-, 0, ., =, power */}
        <button
          onClick={onToggleSign}
          className="btn-digit font-medium text-sm"
          title="Cambiar signo (+/-)"
        >
          ±
        </button>
        <button
          onClick={() => onInput('0')}
          className="btn-digit font-bold"
        >
          0
        </button>
        <button
          onClick={() => onInput('.')}
          className="btn-digit font-bold"
        >
          .
        </button>
        <button
          onClick={() => onInput('^')}
          className="btn-keypad-secondary hidden sm:flex items-center justify-center font-bold"
          title="Potencia xʸ"
        >
          xʸ
        </button>
        <button
          onClick={onCalculate}
          className="btn-calculate sm:col-span-1 shadow-lg shadow-indigo-600/30"
          title="Calcular resultado (Enter o =)"
        >
          <Equal className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
