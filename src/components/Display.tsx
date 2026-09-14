import React, { useState } from 'react';
import { AngleMode, NumberFormatMode } from '../types';
import { Copy, Check, ClipboardPaste, Delete, RotateCcw } from 'lucide-react';

interface DisplayProps {
  expression: string;
  result: string;
  fractionResult: string | null;
  error: string | null;
  angleMode: AngleMode;
  setAngleMode: (mode: AngleMode) => void;
  formatMode: NumberFormatMode;
  setFormatMode: (mode: NumberFormatMode) => void;
  hasMemory: boolean;
  onClear: () => void;
  onBackspace: () => void;
  onPaste: (text: string) => void;
  onSelectResult: (val: string) => void;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  fractionResult,
  error,
  angleMode,
  setAngleMode,
  formatMode,
  setFormatMode,
  hasMemory,
  onClear,
  onBackspace,
  onPaste,
  onSelectResult,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = error ? '' : (formatMode === 'fraction' && fractionResult ? fractionResult : result || expression);
    if (!textToCopy) return;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handlePasteClick = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          onPaste(text);
        }
      }
    } catch {
      // Ignore if permission denied in iframe
    }
  };

  const cycleAngleMode = () => {
    if (angleMode === 'DEG') setAngleMode('RAD');
    else if (angleMode === 'RAD') setAngleMode('GRAD');
    else setAngleMode('DEG');
  };

  const toggleFractionMode = () => {
    if (fractionResult) {
      setFormatMode(formatMode === 'fraction' ? 'standard' : 'fraction');
    }
  };

  // Determine what result to display
  let displayedResult = result;
  if (error) {
    displayedResult = error;
  } else if (formatMode === 'fraction' && fractionResult) {
    displayedResult = fractionResult;
  }

  return (
    <div className="w-full bg-slate-900 text-slate-100 rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-800 flex flex-col gap-2 relative overflow-hidden transition-all duration-200">
      {/* Top Status Bar: Modes & Memory */}
      <div className="flex items-center justify-between text-xs text-slate-400 select-none border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          {/* Angle Mode Selector */}
          <div className="inline-flex rounded-lg bg-slate-800/90 p-0.5 border border-slate-700/60">
            {(['DEG', 'RAD', 'GRAD'] as AngleMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setAngleMode(mode)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wider transition-colors ${
                  angleMode === mode
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Cambiar a ${mode}`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Memory Flag */}
          {hasMemory && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px] border border-amber-500/30">
              M
            </span>
          )}

          {/* Fraction availability badge */}
          {fractionResult && !error && (
            <button
              onClick={toggleFractionMode}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-all border ${
                formatMode === 'fraction'
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-800 text-emerald-400 border-emerald-500/40 hover:bg-emerald-950/40'
              }`}
              title="Cambiar entre Decimal y Fracción exacta (S⇔D)"
            >
              S ⇔ D {formatMode === 'fraction' ? `(${fractionResult})` : ''}
            </button>
          )}
        </div>

        {/* Action quick buttons on the display */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            disabled={!result && !expression}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            title="Copiar resultado"
            aria-label="Copiar"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handlePasteClick}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Pegar expresión desde portapapeles"
            aria-label="Pegar"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onBackspace}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Borrar último carácter (Retroceso)"
            aria-label="Borrar carácter"
          >
            <Delete className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClear}
            className="px-2 py-0.5 rounded-lg text-rose-400 font-bold hover:bg-rose-950/30 transition-colors text-xs border border-rose-900/40"
            title="Limpiar todo (AC / Escape)"
            aria-label="Limpiar todo"
          >
            AC
          </button>
        </div>
      </div>

      {/* Main Expression Box */}
      <div className="min-h-[46px] flex items-end justify-end overflow-x-auto no-scrollbar py-1">
        <span className="font-mono text-base sm:text-lg text-slate-300 tracking-wider break-all text-right select-all">
          {expression || <span className="text-slate-600">0</span>}
        </span>
      </div>

      {/* Result Display Box */}
      <div className="min-h-[58px] flex items-baseline justify-between gap-3 overflow-x-auto no-scrollbar pt-1">
        <div className="text-xs text-indigo-400/80 font-mono font-semibold select-none flex items-center gap-1">
          {error ? (
            <span className="text-rose-400 font-medium">Error</span>
          ) : result ? (
            <button 
              onClick={() => onSelectResult(result)}
              className="hover:underline flex items-center gap-1"
              title="Click para usar este resultado como base"
            >
              <span>= Ans</span>
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {copied && (
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              ¡Copiado!
            </span>
          )}
          <span
            className={`font-mono font-bold tracking-tight text-right select-all transition-colors ${
              error
                ? 'text-rose-400 text-sm sm:text-base font-normal leading-relaxed'
                : 'text-2xl sm:text-4xl text-white'
            }`}
          >
            {displayedResult || (expression ? ' ' : '0')}
          </span>
        </div>
      </div>
    </div>
  );
};
