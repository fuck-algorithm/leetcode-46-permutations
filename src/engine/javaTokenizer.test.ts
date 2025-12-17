import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { tokenizeLine, formatJavaArray, parseJavaCode, getJavaPermutationCode, getCurrentExecutionLine } from './javaTokenizer';
import { JAVA_KEYWORDS, JAVA_TYPES } from '../types';

describe('javaTokenizer', () => {
  /**
   * Property 1: Syntax Highlighting Consistency
   * For any Java keyword in the code, the tokenizer SHALL assign it the 'keyword' token type
   * Validates: Requirements 1.2
   */
  describe('Property 1: Syntax Highlighting Consistency', () => {
    it('should tokenize all Java keywords as keyword type', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...JAVA_KEYWORDS),
          (keyword) => {
            const tokens = tokenizeLine(keyword);
            const keywordToken = tokens.find(t => t.value === keyword);
            expect(keywordToken).toBeDefined();
            expect(keywordToken?.type).toBe('keyword');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should tokenize all Java types as type token', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...JAVA_TYPES),
          (type) => {
            const tokens = tokenizeLine(type);
            const typeToken = tokens.find(t => t.value === type);
            expect(typeToken).toBeDefined();
            expect(typeToken?.type).toBe('type');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should tokenize numbers correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 9999 }),
          (num) => {
            const tokens = tokenizeLine(String(num));
            expect(tokens.some(t => t.type === 'number' && t.value === String(num))).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should tokenize strings correctly', () => {
      const tokens = tokenizeLine('"hello world"');
      expect(tokens.some(t => t.type === 'string' && t.value === '"hello world"')).toBe(true);
    });

    it('should tokenize comments correctly', () => {
      const tokens = tokenizeLine('// this is a comment');
      expect(tokens.some(t => t.type === 'comment')).toBe(true);
    });

    it('should tokenize method calls correctly', () => {
      const tokens = tokenizeLine('result.add(path)');
      expect(tokens.some(t => t.type === 'method' && t.value === 'add')).toBe(true);
    });
  });

  /**
   * Property 5: Array Formatting Consistency
   * For any array of integers, formatJavaArray SHALL produce a string in format "[x, y, z]"
   * Validates: Requirements 3.6
   */
  describe('Property 5: Array Formatting Consistency', () => {
    it('should format arrays in Java notation', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 0, maxLength: 10 }),
          (arr) => {
            const result = formatJavaArray(arr);
            // Should start with [ and end with ]
            expect(result.startsWith('[')).toBe(true);
            expect(result.endsWith(']')).toBe(true);
            
            // Should contain all elements
            for (const num of arr) {
              expect(result).toContain(String(num));
            }
            
            // Empty array should be []
            if (arr.length === 0) {
              expect(result).toBe('[]');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle empty arrays', () => {
      expect(formatJavaArray([])).toBe('[]');
    });

    it('should separate elements with comma and space', () => {
      expect(formatJavaArray([1, 2, 3])).toBe('[1, 2, 3]');
    });
  });

  describe('parseJavaCode', () => {
    it('should parse code into lines with correct line numbers', () => {
      const code = 'int x = 1;\nint y = 2;';
      const lines = parseJavaCode(code);
      expect(lines).toHaveLength(2);
      expect(lines[0].lineNumber).toBe(1);
      expect(lines[1].lineNumber).toBe(2);
    });

    it('should tokenize each line', () => {
      const code = 'public void test() {}';
      const lines = parseJavaCode(code);
      expect(lines[0].tokens.length).toBeGreaterThan(0);
      expect(lines[0].tokens.some(t => t.type === 'keyword' && t.value === 'public')).toBe(true);
    });
  });

  describe('getJavaPermutationCode', () => {
    it('should return pre-parsed Java permutation code', () => {
      const lines = getJavaPermutationCode();
      expect(lines.length).toBeGreaterThan(0);
      expect(lines[0].lineNumber).toBe(1);
      // First line should contain 'class' (new code structure)
      expect(lines[0].tokens.some(t => t.value === 'class')).toBe(true);
    });
  });

  describe('getCurrentExecutionLine', () => {
    it('should return correct line for select step', () => {
      // path.addLast(nums[i]) is on line 18
      expect(getCurrentExecutionLine('select')).toBe(18);
    });

    it('should return correct line for backtrack step', () => {
      // path.removeLast() is on line 21
      expect(getCurrentExecutionLine('backtrack')).toBe(21);
    });

    it('should return correct line for complete step', () => {
      // res.add(new ArrayList<>(path)) is on line 14
      expect(getCurrentExecutionLine('complete')).toBe(14);
    });

    it('should return null for null step', () => {
      expect(getCurrentExecutionLine(null)).toBeNull();
    });
  });
});
