import React, { useState, useEffect } from 'react';
import { UnitCategory, UnitDefinition } from '../types';
import { UNIT_CATEGORIES, convertUnits } from '../utils/unitsEngine';
import { ArrowLeftRight, Check, CornerDownLeft, Sparkles } from 'lucide-react';

interface UnitConverterModalProps {
  onInsertToCalculator: (val: string) => void;
}

export const UnitConverterModal: React.FC<UnitConverterModalProps> = ({
  onInsertToCalculator,
}) => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromValue, setFromValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('cm');
  const [convertedValue, setConvertedValue] = useState<string>('100');
  const [copied, setCopied] = useState(false);

  // When category changes, reset default units
  useEffect(() => {
    const units = Object.keys(UNIT_CATEGORIES[category].units);
    if (units.length >= 2) {
      setFromUnit(units[0]);
      setToUnit(units[1]);
    }
  }, [category]);

  // Recalculate conversion
  useEffect(() => {
    const num = parseFloat(fromValue);
    if (isNaN(num)) {
      setConvertedValue('');
      return;
    }

    try {
      const res = convertUnits(num, category, fromUnit, toUnit);
      // Clean display
      const formatted = Math.abs(res) < 1e-6 || Math.abs(res) > 1e9
        ? res.toExponential(6)
        : Number(res.toFixed(8)).toString();
      setConvertedValue(formatted);
    } catch {
      setConvertedValue('Error');
    }
  }, [fromValue, category, fromUnit, toUnit]);

  const handleSwapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const currentCategoryData = UNIT_CATEGORIES[category];
  const unitList: UnitDefinition[] = Object.values(currentCategoryData.units);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-6">
      {/* Category Tabs */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-indigo-500" />
            Conversor de Unidades
          </h2>
          <span className="text-xs text-slate-500">Cálculo instantáneo</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
          {(Object.keys(UNIT_CATEGORIES) as UnitCategory[]).map((cat) => {
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {UNIT_CATEGORIES[cat].name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Converter Input / Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
        {/* From Box */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 flex flex-col gap-3">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            De:
          </label>
          <input
            type="number"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-2xl font-bold p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            placeholder="0"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium text-sm p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer focus:ring-2 focus:ring-indigo-500"
          >
            {unitList.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwapUnits}
            className="p-3 rounded-full bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-slate-700 transition-transform active:rotate-180 duration-200 border border-indigo-200 dark:border-slate-700"
            title="Intercambiar unidades"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        {/* To Box */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 flex flex-col gap-3">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            A:
          </label>
          <div className="w-full bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-mono text-2xl font-bold p-3 rounded-xl border border-slate-300 dark:border-slate-700 overflow-x-auto min-h-[58px] flex items-center">
            {convertedValue || '0'}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium text-sm p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer focus:ring-2 focus:ring-indigo-500"
          >
            {unitList.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          1 {currentCategoryData.units[fromUnit]?.symbol} ={' '}
          {(() => {
            try {
              const unitVal = convertUnits(1, category, fromUnit, toUnit);
              return Number(unitVal.toFixed(6)).toString();
            } catch {
              return '-';
            }
          })()}{' '}
          {currentCategoryData.units[toUnit]?.symbol}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (convertedValue && convertedValue !== 'Error') {
                onInsertToCalculator(convertedValue);
              }
            }}
            disabled={!convertedValue || convertedValue === 'Error'}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20 disabled:opacity-40"
          >
            <CornerDownLeft className="w-4 h-4" />
            <span>Usar en Calculadora</span>
          </button>
        </div>
      </div>
    </div>
  );
};
