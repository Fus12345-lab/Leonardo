import { AngleMode } from '../types';

export const CONSTANTS = {
  PI: Math.PI,
  E: Math.E,
  PHI: (1 + Math.sqrt(5)) / 2, // Número áureo
  SQRT2: Math.SQRT2,
  SQRT3: Math.sqrt(3),
  EULER_MASCHERONI: 0.57721566490153286, // γ
};

// Factorial exact calculation
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('Error: factorial de número negativo o no entero.');
  }
  if (n > 170) {
    throw new Error('Error: desbordamiento numérico en factorial (>170!).');
  }
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Convert angle to radians based on mode
export function toRadians(angle: number, mode: AngleMode): number {
  switch (mode) {
    case 'DEG':
      return (angle * Math.PI) / 180;
    case 'GRAD':
      return (angle * Math.PI) / 200;
    case 'RAD':
    default:
      return angle;
  }
}

// Convert radians to angle based on mode
export function fromRadians(rad: number, mode: AngleMode): number {
  switch (mode) {
    case 'DEG':
      return (rad * 180) / Math.PI;
    case 'GRAD':
      return (rad * 200) / Math.PI;
    case 'RAD':
    default:
      return rad;
  }
}

// Clean floating point artifacts (e.g. 0.30000000000000004 -> 0.3)
export function cleanPrecision(val: number, precision: number = 12): number {
  if (!Number.isFinite(val)) return val;
  if (Math.abs(val) < 1e-15) return 0;
  
  // Check if very close to an integer
  const rounded = Math.round(val);
  if (Math.abs(val - rounded) < 1e-12) {
    return rounded;
  }

  const factor = Math.pow(10, precision);
  return Math.round(val * factor) / factor;
}

// Format number in readable form: standard, scientific notation
export function formatNumber(val: number): string {
  if (Number.isNaN(val)) return 'Error: valor no numérico';
  if (!Number.isFinite(val)) {
    return val > 0 ? 'Infinity' : '-Infinity';
  }

  const cleaned = cleanPrecision(val);
  const abs = Math.abs(cleaned);

  // If very large or very small (except 0), use scientific notation
  if (abs !== 0 && (abs >= 1e14 || abs <= 1e-7)) {
    return cleaned.toExponential(8).replace(/e\+?/, ' × 10^');
  }

  // Standard representation with up to 10 decimal digits
  const str = cleaned.toLocaleString('es-ES', {
    maximumFractionDigits: 10,
    useGrouping: true,
  });

  return str;
}

// Convert decimal to exact fraction approximation (Stern-Brocot / continued fraction)
export function decimalToFraction(val: number, maxDenominator: number = 10000): string | null {
  if (!Number.isFinite(val) || Number.isNaN(val)) return null;
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  // If it's already an integer
  if (Number.isInteger(absVal)) {
    return `${isNegative ? '-' : ''}${absVal}/1`;
  }

  // Continued fraction algorithm
  let h1 = 1, h2 = 0;
  let k1 = 0, k2 = 1;
  let b = absVal;

  do {
    const a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;

    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;

    b = 1 / (b - a);
  } while (Math.abs(absVal - h1 / k1) > absVal * 1e-9 && k1 <= maxDenominator && Number.isFinite(b));

  if (k1 > maxDenominator || k1 === 1) {
    return null;
  }

  // Verify accuracy
  const error = Math.abs(absVal - h1 / k1);
  if (error > 1e-5) {
    return null;
  }

  return `${isNegative ? '-' : ''}${h1}/${k1}`;
}

// Custom Safe Shunting-Yard Parser and Evaluator
export function evaluateExpression(rawExpr: string, angleMode: AngleMode): { result: number; formatted: string; fraction: string | null } {
  if (!rawExpr || !rawExpr.trim()) {
    throw new Error('Error: expresión incompleta.');
  }

  // Check balanced parentheses
  let parenCount = 0;
  for (const ch of rawExpr) {
    if (ch === '(') parenCount++;
    if (ch === ')') parenCount--;
    if (parenCount < 0) {
      throw new Error('Error: paréntesis desbalanceados.');
    }
  }
  if (parenCount !== 0) {
    throw new Error('Error: paréntesis desbalanceados.');
  }

  // Normalize expression string
  let expr = rawExpr
    // Replace visual symbols
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/–/g, '-')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/π/g, ' PI ')
    .replace(/φ/g, ' PHI ')
    .replace(/√2/g, ' SQRT2 ')
    .replace(/√3/g, ' SQRT3 ')
    .replace(/γ/g, ' EULER_MASCHERONI ')
    .replace(/√\s*\(/g, 'sqrt(')
    .replace(/√(\d+(\.\d+)?)/g, 'sqrt($1)')
    .replace(/ⁿ√/g, 'nroot')
    .replace(/(\d+(\.\d+)?)\s*([+\-])\s*(\d+(\.\d+)?)\s*%/g, '$1 $3 ($1 * ($4 / 100))')
    .replace(/(\d+)\s*%\s*de\s*(\d+(\.\d+)?)/gi, '($1/100)*$2')
    .replace(/(\d+(\.\d+)?)\s*%/g, '($1/100)')
    .replace(/\)\s*%/g, ')/100')
    .replace(/\|([^|]+)\|/g, 'abs($1)')
    .replace(/mod/gi, ' mod ')
    .trim();

  // Tokenize
  const tokens: string[] = [];
  let i = 0;

  const isDigit = (c: string) => /\d/.test(c) || c === '.';
  const isAlpha = (c: string) => /[a-zA-Z_]/.test(c);

  while (i < expr.length) {
    const c = expr[i];

    if (/\s/.test(c)) {
      i++;
      continue;
    }

    if (isDigit(c)) {
      let num = '';
      while (i < expr.length && (isDigit(expr[i]) || expr[i] === '.')) {
        num += expr[i];
        i++;
      }
      tokens.push(num);
      continue;
    }

    if (isAlpha(c)) {
      let ident = '';
      while (i < expr.length && (isAlpha(expr[i]) || isDigit(expr[i]))) {
        ident += expr[i];
        i++;
      }
      tokens.push(ident.toLowerCase());
      continue;
    }

    // Two-character or single-character operators
    if (c === '^' || c === '+' || c === '-' || c === '*' || c === '/' || c === '(' || c === ')' || c === '!' || c === ',') {
      tokens.push(c);
      i++;
      continue;
    }

    throw new Error(`Error: carácter inválido "${c}".`);
  }

  // Handle implicit multiplication (e.g. 2(3), (2)(3), 2PI, 2sqrt(4), 5x)
  const processedTokens: string[] = [];
  for (let k = 0; k < tokens.length; k++) {
    const cur = tokens[k];
    const prev = k > 0 ? tokens[k - 1] : null;

    if (prev) {
      const prevIsNum = !isNaN(Number(prev)) || prev === 'pi' || prev === 'e' || prev === 'phi' || prev === 'sqrt2' || prev === 'sqrt3' || prev === 'euler_mascheroni' || prev === ')';
      const curIsStart = cur === '(' || (!isNaN(Number(cur))) || cur === 'pi' || cur === 'e' || cur === 'phi' || cur === 'sqrt2' || cur === 'sqrt3' || cur === 'euler_mascheroni' || (isAlpha(cur[0]) && cur !== 'mod');

      if (prevIsNum && curIsStart) {
        processedTokens.push('*');
      }
    }
    processedTokens.push(cur);
  }

  // Handle unary minus / plus
  const unaryProcessedTokens: string[] = [];
  for (let k = 0; k < processedTokens.length; k++) {
    const cur = processedTokens[k];
    const prev = k > 0 ? unaryProcessedTokens[unaryProcessedTokens.length - 1] : null;

    if (cur === '-' || cur === '+') {
      const isUnary = !prev || prev === '(' || prev === ',' || prev === '+' || prev === '-' || prev === '*' || prev === '/' || prev === '^' || prev === 'mod';
      if (isUnary) {
        unaryProcessedTokens.push(cur === '-' ? 'neg' : 'pos');
        continue;
      }
    }
    unaryProcessedTokens.push(cur);
  }

  // Shunting Yard Algorithm (Infix to Reverse Polish Notation / Postfix)
  const outputQueue: string[] = [];
  const operatorStack: string[] = [];

  const precedence: Record<string, number> = {
    '+': 2,
    '-': 2,
    '*': 3,
    '/': 3,
    'mod': 3,
    'neg': 4,
    'pos': 4,
    '^': 5,
    '!': 6,
  };

  const isRightAssociative = (op: string) => op === '^' || op === 'neg' || op === 'pos';

  const functions = new Set([
    'sin', 'cos', 'tan',
    'asin', 'acos', 'atan',
    'sinh', 'cosh', 'tanh',
    'log', 'ln', 'log2',
    'sqrt', 'cbrt', 'nroot',
    'abs', 'inv', 'fact'
  ]);

  for (const token of unaryProcessedTokens) {
    if (!isNaN(Number(token))) {
      outputQueue.push(token);
    } else if (token === 'pi') {
      outputQueue.push(String(CONSTANTS.PI));
    } else if (token === 'e') {
      outputQueue.push(String(CONSTANTS.E));
    } else if (token === 'phi') {
      outputQueue.push(String(CONSTANTS.PHI));
    } else if (token === 'sqrt2') {
      outputQueue.push(String(CONSTANTS.SQRT2));
    } else if (token === 'sqrt3') {
      outputQueue.push(String(CONSTANTS.SQRT3));
    } else if (token === 'euler_mascheroni') {
      outputQueue.push(String(CONSTANTS.EULER_MASCHERONI));
    } else if (functions.has(token)) {
      operatorStack.push(token);
    } else if (token === ',') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length === 0) {
        throw new Error('Error: argumento inválido en función.');
      }
    } else if (token in precedence) {
      const o1 = token;
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== '(' &&
        (
          (!isRightAssociative(o1) && precedence[operatorStack[operatorStack.length - 1]] >= precedence[o1]) ||
          (isRightAssociative(o1) && precedence[operatorStack[operatorStack.length - 1]] > precedence[o1])
        )
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(o1);
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length === 0) {
        throw new Error('Error: paréntesis desbalanceados.');
      }
      operatorStack.pop(); // Pop '('
      // If operator at top is function, pop to output
      if (operatorStack.length > 0 && functions.has(operatorStack[operatorStack.length - 1])) {
        outputQueue.push(operatorStack.pop()!);
      }
    } else {
      throw new Error(`Error: función u operador desconocido "${token}".`);
    }
  }

  while (operatorStack.length > 0) {
    const op = operatorStack.pop()!;
    if (op === '(' || op === ')') {
      throw new Error('Error: paréntesis desbalanceados.');
    }
    outputQueue.push(op);
  }

  // Evaluate Postfix (RPN) Queue
  const evalStack: number[] = [];

  for (const token of outputQueue) {
    if (!isNaN(Number(token))) {
      evalStack.push(Number(token));
      continue;
    }

    if (token === 'neg') {
      if (evalStack.length < 1) throw new Error('Error: expresión incompleta.');
      const val = evalStack.pop()!;
      evalStack.push(-val);
      continue;
    }

    if (token === 'pos') {
      if (evalStack.length < 1) throw new Error('Error: expresión incompleta.');
      continue;
    }

    if (token === '!') {
      if (evalStack.length < 1) throw new Error('Error: expresión incompleta.');
      const val = evalStack.pop()!;
      evalStack.push(factorial(val));
      continue;
    }

    // Single-argument functions
    if (functions.has(token) && token !== 'nroot') {
      if (evalStack.length < 1) throw new Error(`Error: argumento faltante en ${token}.`);
      const val = evalStack.pop()!;

      switch (token) {
        case 'sin': {
          const rad = toRadians(val, angleMode);
          // Check for exact zero at multiples of PI
          if (angleMode === 'DEG' && val % 180 === 0) {
            evalStack.push(0);
          } else {
            evalStack.push(cleanPrecision(Math.sin(rad)));
          }
          break;
        }
        case 'cos': {
          const rad = toRadians(val, angleMode);
          // Check for exact zero at 90, 270, etc.
          if (angleMode === 'DEG' && Math.abs(val % 180) === 90) {
            evalStack.push(0);
          } else {
            evalStack.push(cleanPrecision(Math.cos(rad)));
          }
          break;
        }
        case 'tan': {
          const rad = toRadians(val, angleMode);
          if (angleMode === 'DEG' && Math.abs(val % 180) === 90) {
            throw new Error('Error: no se puede dividir por cero (tangente no definida).');
          }
          if (angleMode === 'GRAD' && Math.abs(val % 200) === 100) {
            throw new Error('Error: no se puede dividir por cero (tangente no definida).');
          }
          const res = Math.tan(rad);
          if (!Number.isFinite(res) || Math.abs(res) > 1e14) {
            throw new Error('Error: no se puede dividir por cero (tangente indefinida).');
          }
          evalStack.push(cleanPrecision(res));
          break;
        }
        case 'asin': {
          if (val < -1 || val > 1) {
            throw new Error('Error: argumento inválido (asin requiere dominio [-1, 1]).');
          }
          const rad = Math.asin(val);
          evalStack.push(cleanPrecision(fromRadians(rad, angleMode)));
          break;
        }
        case 'acos': {
          if (val < -1 || val > 1) {
            throw new Error('Error: argumento inválido (acos requiere dominio [-1, 1]).');
          }
          const rad = Math.acos(val);
          evalStack.push(cleanPrecision(fromRadians(rad, angleMode)));
          break;
        }
        case 'atan': {
          const rad = Math.atan(val);
          evalStack.push(cleanPrecision(fromRadians(rad, angleMode)));
          break;
        }
        case 'sinh':
          evalStack.push(cleanPrecision(Math.sinh(val)));
          break;
        case 'cosh':
          evalStack.push(cleanPrecision(Math.cosh(val)));
          break;
        case 'tanh':
          evalStack.push(cleanPrecision(Math.tanh(val)));
          break;
        case 'log': {
          if (val <= 0) {
            throw new Error('Error: argumento inválido (log requiere valor > 0).');
          }
          evalStack.push(cleanPrecision(Math.log10(val)));
          break;
        }
        case 'ln': {
          if (val <= 0) {
            throw new Error('Error: argumento inválido (ln requiere valor > 0).');
          }
          evalStack.push(cleanPrecision(Math.log(val)));
          break;
        }
        case 'log2': {
          if (val <= 0) {
            throw new Error('Error: argumento inválido (log₂ requiere valor > 0).');
          }
          evalStack.push(cleanPrecision(Math.log2(val)));
          break;
        }
        case 'sqrt': {
          if (val < 0) {
            throw new Error('Error: raíz par de número negativo.');
          }
          evalStack.push(cleanPrecision(Math.sqrt(val)));
          break;
        }
        case 'cbrt':
          evalStack.push(cleanPrecision(Math.cbrt(val)));
          break;
        case 'abs':
          evalStack.push(Math.abs(val));
          break;
        case 'inv': {
          if (val === 0) {
            throw new Error('Error: no se puede dividir por cero.');
          }
          evalStack.push(cleanPrecision(1 / val));
          break;
        }
        case 'fact':
          evalStack.push(factorial(val));
          break;
        default:
          throw new Error(`Error: función no implementada "${token}".`);
      }
      continue;
    }

    // Binary operators & functions
    if (evalStack.length < 2) {
      throw new Error('Error: expresión incompleta.');
    }

    const b = evalStack.pop()!;
    const a = evalStack.pop()!;

    switch (token) {
      case '+':
        evalStack.push(cleanPrecision(a + b));
        break;
      case '-':
        evalStack.push(cleanPrecision(a - b));
        break;
      case '*':
        evalStack.push(cleanPrecision(a * b));
        break;
      case '/': {
        if (b === 0) {
          throw new Error('Error: no se puede dividir por cero.');
        }
        evalStack.push(cleanPrecision(a / b));
        break;
      }
      case 'mod': {
        if (b === 0) {
          throw new Error('Error: no se puede dividir por cero en módulo.');
        }
        evalStack.push(cleanPrecision(a % b));
        break;
      }
      case '^': {
        if (a === 0 && b < 0) {
          throw new Error('Error: no se puede dividir por cero (0 con potencia negativa).');
        }
        if (a < 0 && !Number.isInteger(b)) {
          throw new Error('Error: potencia no entera de número negativo.');
        }
        evalStack.push(cleanPrecision(Math.pow(a, b)));
        break;
      }
      case 'nroot': {
        // nroot(degree, radicand) -> b is radicand, a is degree
        if (a === 0) {
          throw new Error('Error: índice de raíz no puede ser cero.');
        }
        if (b < 0 && a % 2 === 0) {
          throw new Error('Error: raíz par de número negativo.');
        }
        if (b < 0) {
          evalStack.push(cleanPrecision(-Math.pow(-b, 1 / a)));
        } else {
          evalStack.push(cleanPrecision(Math.pow(b, 1 / a)));
        }
        break;
      }
      default:
        throw new Error(`Error: operador desconocido "${token}".`);
    }
  }

  if (evalStack.length !== 1) {
    throw new Error('Error: sintaxis matemática inválida.');
  }

  const finalResult = evalStack[0];
  const formatted = formatNumber(finalResult);
  const fraction = decimalToFraction(finalResult);

  return {
    result: finalResult,
    formatted,
    fraction,
  };
}
