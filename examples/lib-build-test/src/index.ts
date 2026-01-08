/**
 * 测试库 - 验证输出目录
 */
export function hello(name: string): string {
  return `Hello, ${name}!`
}

export const VERSION = '1.0.0'

export default {
  hello,
  VERSION
}