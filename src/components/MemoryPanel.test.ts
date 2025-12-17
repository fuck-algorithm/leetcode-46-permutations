import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateDepth, getVariableDisplayState } from './MemoryPanel';
import { formatJavaArray } from '../engine/javaTokenizer';

describe('MemoryPanel', () => {
  /**
   * Property 4: Memory Panel State Consistency
   * For any combination of currentPath, available, and resultCount values,
   * the memory panel SHALL display values that exactly match the input state.
   * Validates: Requirements 3.1, 3.2, 3.3, 3.4
   */
  describe('Property 4: Memory Panel State Consistency', () => {
    it('should display path value matching input', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 1, max: 9 }), { minLength: 0, maxLength: 6 }),
          (path) => {
            const state = getVariableDisplayState(path, [], 0);
            expect(state.path).toBe(formatJavaArray(path));
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display remaining value matching input', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 1, max: 9 }), { minLength: 0, maxLength: 6 }),
          (available) => {
            const state = getVariableDisplayState([], available, 0);
            expect(state.remaining).toBe(formatJavaArray(available));
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display result count matching input', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 720 }), // max 6! = 720
          (count) => {
            const state = getVariableDisplayState([], [], count);
            expect(state.resultSize).toBe(String(count));
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle all state combinations consistently', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 1, max: 9 }), { minLength: 0, maxLength: 6 }),
          fc.array(fc.integer({ min: 1, max: 9 }), { minLength: 0, maxLength: 6 }),
          fc.integer({ min: 0, max: 100 }),
          (path, available, count) => {
            const state = getVariableDisplayState(path, available, count);
            
            // All values should match inputs
            expect(state.path).toBe(formatJavaArray(path));
            expect(state.remaining).toBe(formatJavaArray(available));
            expect(state.resultSize).toBe(String(count));
            expect(state.depth).toBe(path.length);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 6: Depth Calculation Consistency
   * For any currentPath array, the displayed recursion depth SHALL equal the length of the currentPath array.
   * Validates: Requirements 4.1
   */
  describe('Property 6: Depth Calculation Consistency', () => {
    it('should calculate depth equal to path length', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 1, max: 9 }), { minLength: 0, maxLength: 10 }),
          (path) => {
            const depth = calculateDepth(path);
            expect(depth).toBe(path.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return 0 for empty path', () => {
      expect(calculateDepth([])).toBe(0);
    });

    it('should return correct depth for various path lengths', () => {
      expect(calculateDepth([1])).toBe(1);
      expect(calculateDepth([1, 2])).toBe(2);
      expect(calculateDepth([1, 2, 3])).toBe(3);
      expect(calculateDepth([1, 2, 3, 4, 5, 6])).toBe(6);
    });
  });
});
