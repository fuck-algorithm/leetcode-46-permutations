import { ValidationResult } from '../types';

/**
 * 验证用户输入的数字字符串
 * @param input 用户输入的字符串，数字以逗号分隔
 * @returns 验证结果，包含是否有效、错误信息和解析后的数字数组
 */
export function validateInput(input: string): ValidationResult {
  const trimmed = input.trim();

  // 检查空输入
  if (!trimmed) {
    return { isValid: false, error: '请输入至少一个数字' };
  }

  // 分割并解析数字
  const parts = trimmed.split(',').map((s) => s.trim());
  const numbers: number[] = [];

  for (const part of parts) {
    // 检查是否为有效整数格式
    if (!/^-?\d+$/.test(part)) {
      return { isValid: false, error: '请输入有效的整数' };
    }

    const num = parseInt(part, 10);

    // 检查数字范围
    if (num < -10 || num > 10) {
      return { isValid: false, error: '数字必须在-10到10之间' };
    }

    numbers.push(num);
  }

  // 检查数组长度
  if (numbers.length > 6) {
    return { isValid: false, error: '最多支持6个数字' };
  }

  // 检查重复数字
  const uniqueSet = new Set(numbers);
  if (uniqueSet.size !== numbers.length) {
    return { isValid: false, error: '数字不能重复' };
  }

  return { isValid: true, parsedNumbers: numbers };
}
