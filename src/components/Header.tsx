import React from 'react';
import { MainTab } from '../types';
import { 
  Calculator, 
  ArrowLeftRight, 
  Sigma, 
  Grid2X2, 
  Clock, 
  Sun, 
  Moon,
  Atom
} from 'lucide-react';

interface HeaderProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  hasMemory: boolean;
  historyCount: number;
  openHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  setIsDark,
  hasMemory,
  historyCount,
  openHistory,
}) => {
  const tabs: { id: MainTab; label: string; icon: React.ReactNode }[] = [
    { id: 'calculator', label: 'Calculadora', icon: <Calculator className="w-4 h-4" /> },
    { id: 'converter', label: 'Conversor', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'advanced', label: 'Álgebra & Stats', icon: <Sigma className="w-4 h-4" /> },
    { id: 'complex', label: 'Complejos', icon: <Atom className="w-4 h-4" /> },
    { id: 'matrix', label: 'Matrices', icon: <Grid2X2 className="w-4 h-4" /> },
  ];

  return (
    <header className="w-full max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Scientific Calculator
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Calculadora Científica Profesional
            </p>
          </div>
        </div>

        {/* Mobile top actions */}
        <div className="flex items-center gap-2 sm:hidden">
          {hasMemory && (
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              M
            </span>
          )}
          <button
            onClick={openHistory}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Historial de cálculos"
            aria-label="Ver historial"
          >
            <Clock className="w-5 h-5" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Cambiar tema"
            aria-label="Cambiar tema"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Navigation Pills */}
      <nav className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/90 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto max-w-full no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Desktop right actions */}
      <div className="hidden sm:flex items-center gap-2">
        {hasMemory && (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 tracking-wide">
            MEMORIA ACTIVA [M]
          </span>
        )}

        <button
          onClick={openHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200/70 dark:border-slate-700/60"
          title="Ver historial de operaciones"
        >
          <Clock className="w-4 h-4 text-indigo-500" />
          <span>Historial</span>
          {historyCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
              {historyCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200/70 dark:border-slate-700/60"
          title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          aria-label="Cambiar tema"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>
    </header>
  );
};
