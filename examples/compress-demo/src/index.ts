/**
 * Compress Demo Library
 * 用于测试 vite-enhance 的压缩功能
 */

export function add(a: number, b: number): number {
  return a + b
}

export function subtract(a: number, b: number): number {
  return a - b
}

export function multiply(a: number, b: number): number {
  return a * b
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Cannot divide by zero')
  return a / b
}

export const VERSION = '1.0.0'

export default {
  add,
  subtract,
  multiply,
  divide,
  VERSION,
}
