import { UnitCategory, UnitDefinition } from '../types';

export interface UnitCategoryData {
  name: string;
  units: Record<string, UnitDefinition>;
}

export const UNIT_CATEGORIES: Record<UnitCategory, UnitCategoryData> = {
  length: {
    name: 'Longitud',
    units: {
      mm: {
        id: 'mm',
        name: 'Milímetros',
        symbol: 'mm',
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000,
      },
      cm: {
        id: 'cm',
        name: 'Centímetros',
        symbol: 'cm',
        toBase: (v) => v / 100,
        fromBase: (v) => v * 100,
      },
      m: {
        id: 'm',
        name: 'Metros',
        symbol: 'm',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      km: {
        id: 'km',
        name: 'Kilómetros',
        symbol: 'km',
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000,
      },
      in: {
        id: 'in',
        name: 'Pulgadas',
        symbol: 'in',
        toBase: (v) => v * 0.0254,
        fromBase: (v) => v / 0.0254,
      },
      ft: {
        id: 'ft',
        name: 'Pies',
        symbol: 'ft',
        toBase: (v) => v * 0.3048,
        fromBase: (v) => v / 0.3048,
      },
      yd: {
        id: 'yd',
        name: 'Yardas',
        symbol: 'yd',
        toBase: (v) => v * 0.9144,
        fromBase: (v) => v / 0.9144,
      },
      mi: {
        id: 'mi',
        name: 'Millas',
        symbol: 'mi',
        toBase: (v) => v * 1609.344,
        fromBase: (v) => v / 1609.344,
      },
    },
  },
  mass: {
    name: 'Masa / Peso',
    units: {
      mg: {
        id: 'mg',
        name: 'Miligramos',
        symbol: 'mg',
        toBase: (v) => v / 1000000,
        fromBase: (v) => v * 1000000,
      },
      g: {
        id: 'g',
        name: 'Gramos',
        symbol: 'g',
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000,
      },
      kg: {
        id: 'kg',
        name: 'Kilogramos',
        symbol: 'kg',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      ton: {
        id: 'ton',
        name: 'Toneladas métricas',
        symbol: 't',
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000,
      },
      oz: {
        id: 'oz',
        name: 'Onzas',
        symbol: 'oz',
        toBase: (v) => v * 0.028349523125,
        fromBase: (v) => v / 0.028349523125,
      },
      lb: {
        id: 'lb',
        name: 'Libras',
        symbol: 'lb',
        toBase: (v) => v * 0.45359237,
        fromBase: (v) => v / 0.45359237,
      },
    },
  },
  time: {
    name: 'Tiempo',
    units: {
      s: {
        id: 's',
        name: 'Segundos',
        symbol: 's',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      min: {
        id: 'min',
        name: 'Minutos',
        symbol: 'min',
        toBase: (v) => v * 60,
        fromBase: (v) => v / 60,
      },
      h: {
        id: 'h',
        name: 'Horas',
        symbol: 'h',
        toBase: (v) => v * 3600,
        fromBase: (v) => v / 3600,
      },
      d: {
        id: 'd',
        name: 'Días',
        symbol: 'd',
        toBase: (v) => v * 86400,
        fromBase: (v) => v / 86400,
      },
    },
  },
  temperature: {
    name: 'Temperatura',
    units: {
      c: {
        id: 'c',
        name: 'Celsius',
        symbol: '°C',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      f: {
        id: 'f',
        name: 'Fahrenheit',
        symbol: '°F',
        toBase: (v) => ((v - 32) * 5) / 9,
        fromBase: (v) => (v * 9) / 5 + 32,
      },
      k: {
        id: 'k',
        name: 'Kelvin',
        symbol: 'K',
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    },
  },
  area: {
    name: 'Área',
    units: {
      cm2: {
        id: 'cm2',
        name: 'Centímetros cuadrados',
        symbol: 'cm²',
        toBase: (v) => v / 10000,
        fromBase: (v) => v * 10000,
      },
      m2: {
        id: 'm2',
        name: 'Metros cuadrados',
        symbol: 'm²',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      km2: {
        id: 'km2',
        name: 'Kilómetros cuadrados',
        symbol: 'km²',
        toBase: (v) => v * 1000000,
        fromBase: (v) => v / 1000000,
      },
      ha: {
        id: 'ha',
        name: 'Hectáreas',
        symbol: 'ha',
        toBase: (v) => v * 10000,
        fromBase: (v) => v / 10000,
      },
    },
  },
  volume: {
    name: 'Volumen',
    units: {
      ml: {
        id: 'ml',
        name: 'Mililitros',
        symbol: 'mL',
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000,
      },
      l: {
        id: 'l',
        name: 'Litros',
        symbol: 'L',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      cm3: {
        id: 'cm3',
        name: 'Centímetros cúbicos',
        symbol: 'cm³',
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000,
      },
      m3: {
        id: 'm3',
        name: 'Metros cúbicos',
        symbol: 'm³',
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000,
      },
    },
  },
};

export function convertUnits(
  val: number,
  category: UnitCategory,
  fromUnitId: string,
  toUnitId: string
): number {
  const cat = UNIT_CATEGORIES[category];
  if (!cat) throw new Error('Categoría de unidades no válida.');
  const from = cat.units[fromUnitId];
  const to = cat.units[toUnitId];
  if (!from || !to) throw new Error('Unidad no encontrada.');

  const baseVal = from.toBase(val);
  return to.fromBase(baseVal);
}
