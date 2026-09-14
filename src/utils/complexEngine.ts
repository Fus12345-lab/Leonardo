import { ComplexNumber, AngleMode } from '../types';
import { cleanPrecision, fromRadians } from './mathEngine';

export function formatComplex(c: ComplexNumber): string {
  const re = cleanPrecision(c.re);
  const im = cleanPrecision(c.im);

  if (im === 0) return `${re}`;
  if (re === 0) {
    if (im === 1) return 'i';
    if (im === -1) return '-i';
    return `${im}i`;
  }

  const sign = im > 0 ? '+' : '-';
  const absIm = Math.abs(im);
  const imStr = absIm === 1 ? 'i' : `${absIm}i`;
  return `${re} ${sign} ${imStr}`;
}

export function addComplex(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return {
    re: cleanPrecision(a.re + b.re),
    im: cleanPrecision(a.im + b.im),
  };
}

export function subtractComplex(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return {
    re: cleanPrecision(a.re - b.re),
    im: cleanPrecision(a.im - b.im),
  };
}

export function multiplyComplex(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return {
    re: cleanPrecision(a.re * b.re - a.im * b.im),
    im: cleanPrecision(a.re * b.im + a.im * b.re),
  };
}

export function divideComplex(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  const denom = b.re * b.re + b.im * b.im;
  if (denom === 0) {
    throw new Error('Error: no se puede dividir por cero.');
  }
  return {
    re: cleanPrecision((a.re * b.re + a.im * b.im) / denom),
    im: cleanPrecision((a.im * b.re - a.re * b.im) / denom),
  };
}

export function modulusComplex(c: ComplexNumber): number {
  return cleanPrecision(Math.sqrt(c.re * c.re + c.im * c.im));
}

export function argumentComplex(c: ComplexNumber, mode: AngleMode): number {
  const rad = Math.atan2(c.im, c.re);
  return cleanPrecision(fromRadians(rad, mode));
}

export function toPolarForm(c: ComplexNumber, mode: AngleMode): { r: number; theta: number; formatted: string } {
  const r = modulusComplex(c);
  const theta = argumentComplex(c, mode);
  const unit = mode === 'DEG' ? '°' : mode === 'GRAD' ? ' grad' : ' rad';
  return {
    r,
    theta,
    formatted: `${r} ∠ ${theta}${unit}`,
  };
}
