export type AngleMode = 'DEG' | 'RAD' | 'GRAD';

export type NumberFormatMode = 'standard' | 'scientific' | 'fraction';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  fraction?: string;
  timestamp: number;
  angleMode: AngleMode;
}

export type MainTab = 'calculator' | 'converter' | 'advanced' | 'complex' | 'matrix' | 'history';

export type UnitCategory = 'length' | 'mass' | 'time' | 'temperature' | 'area' | 'volume';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}

export interface ComplexNumber {
  re: number;
  im: number;
}

export interface StatsResult {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  variance: number;
  stdDev: number;
  min: number;
  max: number;
}

export interface QuadraticResult {
  discriminant: number;
  type: 'two_real' | 'one_real' | 'two_complex';
  x1: string;
  x2: string;
  vertex: { x: number; y: number };
}
