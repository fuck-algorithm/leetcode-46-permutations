import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateInput } from './validation';

describe('validateInput', () => {
  /**
   * **Feature: permutation-visualizer, Property 1: Valid Input Acceptance**
   * *For any* array of 1 to 6 unique integers within range [-10, 10],
   * the validation function SHALL return `isValid: true` and correctly parse the numbers.
   * **Validates: Requirements 1.1**
   */
  it('Property 1: should accept valid arrays of 1-6 unique integers in range [-10, 10]', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.integer({ min: -10, max: 10 }), { minLength: 1, maxLength: 6 }),
        (numbers) => {
          const input = numbers.join(',');
          const result = validateInput(input);

          expect(result.isValid).toBe(true);
          expect(result.parsedNumbers).toEqual(numbers);
          expect(result.error).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: permutation-visualizer, Property 2: Invalid Input Rejection**
   * *For any* input that contains duplicates, is empty, or has more than 6 numbers,
   * the validation function SHALL return `isValid: false` with an appropriate error message.
   * **Validates: Requirements 1.2**
   */
  describe('Property 2: Invalid Input Rejection', () => {
    it('should reject empty input', () => {
      fc.assert(
        fc.property(fc.constant(''), (input) => {
          const result = validateInput(input);
          expect(result.isValid).toBe(false);
          expect(result.error).toBe('请输入至少一个数字');
        }),
        { numRuns: 100 }
      );
    });

    it('should reject whitespace-only input', () => {
      fc.assert(
        fc.property(
          fc.stringOf(fc.constantFrom(' ', '\t', '\n')).filter((s) => s.length > 0),
          (input) => {
            const result = validateInput(input);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('请输入至少一个数字');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject arrays with more than 6 numbers', () => {
      fc.assert(
        fc.property(
          fc.uniqueArray(fc.integer({ min: -10, max: 10 }), { minLength: 7, maxLength: 10 }),
          (numbers) => {
            const input = numbers.join(',');
            const result = validateInput(input);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('最多支持6个数字');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject arrays with duplicate numbers', () => {
      fc.assert(
        fc.property(
          fc
            .tuple(
              fc.uniqueArray(fc.integer({ min: -10, max: 10 }), { minLength: 1, maxLength: 5 }),
              fc.nat({ max: 4 })
            )
            .map(([arr, idx]) => {
              // 确保有重复：复制数组中的一个元素
              const dupIdx = idx % arr.length;
              return [...arr, arr[dupIdx]];
            }),
          (numbers) => {
            const input = numbers.join(',');
            const result = validateInput(input);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('数字不能重复');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject numbers out of range [-10, 10]', () => {
      fc.assert(
        fc.property(
          fc.oneof(fc.integer({ min: 11, max: 100 }), fc.integer({ min: -100, max: -11 })),
          (outOfRangeNum) => {
            const input = outOfRangeNum.toString();
            const result = validateInput(input);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('数字必须在-10到10之间');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject invalid number formats', () => {
      fc.assert(
        fc.property(
          fc.stringOf(fc.constantFrom('a', 'b', 'x', '!', '@', '.')).filter((s) => s.length > 0),
          (invalidInput) => {
            const result = validateInput(invalidInput);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('请输入有效的整数');
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
