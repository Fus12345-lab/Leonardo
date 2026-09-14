import React, { useState, useEffect, useCallback } from 'react';
import { AngleMode, NumberFormatMode, HistoryItem, MainTab } from './types';
import { evaluateExpression, formatNumber } from './utils/mathEngine';
import { Header } from './components/Header';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { HistoryDrawer } from './components/HistoryDrawer';
import { UnitConverterModal } from './components/UnitConverterModal';
import { AdvancedToolsModal } from './components/AdvancedToolsModal';
import { ComplexToolModal } from './components/ComplexToolModal';
import { MatrixToolModal } from './components/MatrixToolModal';
import { Keyboard, HelpCircle } from 'lucide-react';

const STORAGE_KEY_HISTORY = 'scientific_calculator_history_v1';
const STORAGE_KEY_THEME = 'scientific_calculator_theme_v1';
const STORAGE_KEY_MEMORY = 'scientific_calculator_memory_v1';
const STORAGE_KEY_ANGLE = 'scientific_calculator_angle_v1';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Main UI Tab
  const [activeTab, setActiveTab] = useState<MainTab>('calculator');

  // Calculator core state
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [fractionResult, setFractionResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);

  // Angle mode (DEG, RAD, GRAD)
  const [angleMode, setAngleMode] = useState<AngleMode>(() => {
    return (localStorage.getItem(STORAGE_KEY_ANGLE) as AngleMode) || 'DEG';
  });

  // Formatting (Standard, Scientific, Fraction)
  const [formatMode, setFormatMode] = useState<NumberFormatMode>('standard');

  // Memory
  const [memory, setMemory] = useState<number | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MEMORY);
    return saved ? parseFloat(saved) : null;
  });

  // History
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [isDark]);

  // Persist angle mode
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ANGLE, angleMode);
  }, [angleMode]);

  // Persist memory
  useEffect(() => {
    if (memory !== null) {
      localStorage.setItem(STORAGE_KEY_MEMORY, String(memory));
    } else {
      localStorage.removeItem(STORAGE_KEY_MEMORY);
    }
  }, [memory]);

  // Persist history
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  }, [history]);

  // Execute evaluation
  const handleCalculate = useCallback(() => {
    if (!expression.trim()) return;

    try {
      const { result: numResult, formatted, fraction } = evaluateExpression(expression, angleMode);
      setResult(formatted);
      setFractionResult(fraction);
      setError(null);
      setIsEvaluated(true);

      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        expression,
        result: formatted,
        fraction: fraction || undefined,
        timestamp: Date.now(),
        angleMode,
      };

      setHistory((prev) => [newItem, ...prev.slice(0, 49)]); // Keep last 50
    } catch (err: any) {
      setError(err.message || 'Error en la expresión');
      setIsEvaluated(false);
    }
  }, [expression, angleMode]);

  // Input append helper
  const handleInput = useCallback((val: string) => {
    setError(null);

    // If expression was just calculated:
    // If the input is an operator, start from previous result
    const isOperator = val.includes('+') || val.includes('−') || val.includes('×') || val.includes('÷') || val.includes('^') || val.includes(' mod ');

    if (isEvaluated) {
      if (isOperator && result && !error) {
        setExpression(result + val);
      } else {
        setExpression(val);
      }
      setIsEvaluated(false);
      return;
    }

    setExpression((prev) => prev + val);
  }, [isEvaluated, result, error]);

  // Clear all (AC)
  const handleClear = useCallback(() => {
    setExpression('');
    setResult('');
    setFractionResult(null);
    setError(null);
    setIsEvaluated(false);
  }, []);

  // Backspace (DEL)
  const handleBackspace = useCallback(() => {
    setError(null);
    if (isEvaluated) {
      handleClear();
      return;
    }

    setExpression((prev) => {
      if (!prev) return '';
      // Check multi-character tokens like 'sin(', 'cos(', 'log(', 'sqrt(', ' mod '
      const multiTokens = [
        'sin(', 'cos(', 'tan(', 'asin(', 'acos(', 'atan(',
        'sinh(', 'cosh(', 'tanh(', 'log(', 'ln(', 'log2(',
        'sqrt(', 'cbrt(', 'nroot(', 'abs(', 'inv(', ' + ', ' − ', ' × ', ' ÷ ', ' mod '
      ];

      for (const token of multiTokens) {
        if (prev.endsWith(token)) {
          return prev.slice(0, -token.length);
        }
      }

      return prev.slice(0, -1);
    });
  }, [isEvaluated, handleClear]);

  // Toggle Sign (+/-)
  const handleToggleSign = useCallback(() => {
    setError(null);
    if (isEvaluated && result) {
      const num = parseFloat(result.replace(/\./g, '').replace(',', '.'));
      if (!isNaN(num)) {
        const toggled = -num;
        setExpression(String(toggled));
        setResult(formatNumber(toggled));
        return;
      }
    }

    setExpression((prev) => {
      if (!prev) return '-';
      if (prev.startsWith('-(') && prev.endsWith(')')) {
        return prev.slice(2, -1);
      }
      return `-(${prev})`;
    });
  }, [isEvaluated, result]);

  // Paste text
  const handlePaste = useCallback((text: string) => {
    setError(null);
    const cleaned = text.replace(/[\r\n]+/g, ' ').trim();
    if (cleaned) {
      setExpression((prev) => prev + cleaned);
    }
  }, []);

  // Memory Actions
  const handleMemoryClear = () => setMemory(null);
  const handleMemoryRecall = () => {
    if (memory !== null) {
      handleInput(String(memory));
    }
  };
  const handleMemoryStore = () => {
    const target = result ? parseFloat(result.replace(/\./g, '').replace(',', '.')) : parseFloat(expression);
    if (!isNaN(target)) {
      setMemory(target);
    }
  };
  const handleMemoryAdd = () => {
    const target = result ? parseFloat(result.replace(/\./g, '').replace(',', '.')) : parseFloat(expression);
    if (!isNaN(target)) {
      setMemory((prev) => (prev || 0) + target);
    }
  };
  const handleMemorySubtract = () => {
    const target = result ? parseFloat(result.replace(/\./g, '').replace(',', '.')) : parseFloat(expression);
    if (!isNaN(target)) {
      setMemory((prev) => (prev || 0) - target);
    }
  };

  // History Selection
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setExpression(item.expression);
    setResult(item.result);
    setFractionResult(item.fraction || null);
    setAngleMode(item.angleMode);
    setError(null);
    setIsEvaluated(true);
    setIsHistoryOpen(false);
    setActiveTab('calculator');
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleInsertToCalculator = (val: string) => {
    handleInput(val);
    setActiveTab('calculator');
  };

  // Keyboard Event Listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing inside an input or textarea
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleInput(e.key);
      } else if (e.key === '+') {
        e.preventDefault();
        handleInput(' + ');
      } else if (e.key === '-') {
        e.preventDefault();
        handleInput(' − ');
      } else if (e.key === '*' || e.key === 'x') {
        e.preventDefault();
        handleInput(' × ');
      } else if (e.key === '/') {
        e.preventDefault();
        handleInput(' ÷ ');
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        handleInput(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        handleInput('.');
      } else if (e.key === '^') {
        e.preventDefault();
        handleInput('^');
      } else if (e.key === '%') {
        e.preventDefault();
        handleInput('%');
      } else if (e.key === '!' && !e.shiftKey) {
        e.preventDefault();
        handleInput('!');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleInput, handleCalculate, handleBackspace, handleClear]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        setIsDark={setIsDark}
        hasMemory={memory !== null}
        historyCount={history.length}
        openHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center justify-start">
        {/* 1. Main Scientific Calculator */}
        {activeTab === 'calculator' && (
          <div className="w-full max-w-xl mx-auto flex flex-col gap-4">
            {/* Display */}
            <Display
              expression={expression}
              result={result}
              fractionResult={fractionResult}
              error={error}
              angleMode={angleMode}
              setAngleMode={setAngleMode}
              formatMode={formatMode}
              setFormatMode={setFormatMode}
              hasMemory={memory !== null}
              onClear={handleClear}
              onBackspace={handleBackspace}
              onPaste={handlePaste}
              onSelectResult={(val) => {
                setExpression(val);
                setResult('');
                setIsEvaluated(false);
              }}
            />

            {/* Keypad */}
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-3 sm:p-4 shadow-xl border border-slate-200 dark:border-slate-800">
              <Keypad
                onInput={handleInput}
                onClear={handleClear}
                onBackspace={handleBackspace}
                onCalculate={handleCalculate}
                onToggleSign={handleToggleSign}
                onMemoryClear={handleMemoryClear}
                onMemoryRecall={handleMemoryRecall}
                onMemoryAdd={handleMemoryAdd}
                onMemorySubtract={handleMemorySubtract}
                onMemoryStore={handleMemoryStore}
                hasMemory={memory !== null}
              />
            </div>

            {/* Keyboard shortcut helper bar */}
            <div className="flex items-center justify-between px-2 text-[11px] text-slate-500 dark:text-slate-400 select-none">
              <button
                onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
                className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>Atajos de teclado físico</span>
              </button>
              <span>Trigonometría activa en {angleMode}</span>
            </div>

            {/* Keyboard Shortcuts modal / toggle info */}
            {showKeyboardHelp && (
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 shadow-md">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
                  <HelpCircle className="w-4 h-4 text-indigo-500" />
                  Atajos rápidos disponibles:
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">0 - 9</kbd> Números</div>
                  <div><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">Enter / =</kbd> Calcular</div>
                  <div><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">+ - * /</kbd> Operadores</div>
                  <div><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">Backspace</kbd> Borrar carácter</div>
                  <div><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">Esc</kbd> Limpiar todo (AC)</div>
                  <div><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">( ) . ^ %</kbd> Paréntesis y potencia</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Unit Converter */}
        {activeTab === 'converter' && (
          <UnitConverterModal onInsertToCalculator={handleInsertToCalculator} />
        )}

        {/* 3. Advanced Algebraic Tools & Statistics */}
        {activeTab === 'advanced' && (
          <AdvancedToolsModal onInsertToCalculator={handleInsertToCalculator} />
        )}

        {/* 4. Complex Numbers */}
        {activeTab === 'complex' && (
          <ComplexToolModal
            angleMode={angleMode}
            onInsertToCalculator={handleInsertToCalculator}
          />
        )}

        {/* 5. Matrix Operations */}
        {activeTab === 'matrix' && (
          <MatrixToolModal onInsertToCalculator={handleInsertToCalculator} />
        )}
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onDeleteItem={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
