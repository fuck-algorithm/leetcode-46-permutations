import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  getCodeHighlightLines,
  generateArrow,
  generateStepExplanation,
  createStepContext,
} from './annotations';
import { StepType, PERMUTATION_PSEUDOCODE } from '../types';

describe('Annotation Engine', () => {
  /**
   * **Feature: animation-enhancement, Property 1: Code Highlight Mapping Correctness**
   * *For any* step type (select, backtrack, complete), the code highlight mapping
   * SHALL return a non-empty array of line IDs that correspond to the relevant
   * pseudocode lines for that operation.
   * **Validates: Requirements 1.3**
   */
  describe('Property 1: Code Highlight Mapping Correctness', () => {
    const stepTypes: StepType[] = ['select', 'backtrack', 'complete'];
    const validLineIds = PERMUTATION_PSEUDOCODE.map(line => line.id);

    it('should return non-empty array for all step types', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...stepTypes),
          (stepType) => {
            const lines = getCodeHighlightLines(stepType);
            // Should return non-empty array
            expect(lines.length).toBeGreaterThan(0);
            // All line IDs should be valid
            lines.forEach(lineId => {
              expect(validLineIds).toContain(lineId);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return empty array for null step type', () => {
      const lines = getCodeHighlightLines(null);
      expect(lines).toEqual([]);
    });

    it('should return correct lines for select step', () => {
      const lines = getCodeHighlightLines('select');
      expect(lines).toContain(10); // for num in remaining
      expect(lines).toContain(11); // path.add(num)
      expect(lines).toContain(12); // backtrack(path, remaining - num)
    });

    it('should return correct lines for backtrack step', () => {
      const lines = getCodeHighlightLines('backtrack');
      expect(lines).toContain(13); // path.remove(num)
    });

    it('should return correct lines for complete step', () => {
      const lines = getCodeHighlightLines('complete');
      expect(lines).toContain(7); // if remaining is empty
      expect(lines).toContain(8); // result.add(path)
      expect(lines).toContain(9); // return
    });
  });

  /**
   * **Feature: animation-enhancement, Property 2: Arrow Generation Correctness**
   * *For any* animation step of type 'select' or 'backtrack', the arrow generation
   * function SHALL produce an arrow with correct direction, appropriate label,
   * and valid position coordinates.
   * **Validates: Requirements 2.2, 2.3**
   */
  describe('Property 2: Arrow Generation Correctness', () => {
    const positionArb = fc.record({
      x: fc.integer({ min: 0, max: 1000 }),
      y: fc.integer({ min: 0, max: 1000 }),
    });

    it('should generate correct arrow for select step', () => {
      fc.assert(
        fc.property(
          positionArb,
          positionArb,
          (fromPos, toPos) => {
            const arrow = generateArrow('select', fromPos, toPos);
            expect(arrow).not.toBeNull();
            expect(arrow!.type).toBe('select');
            expect(arrow!.label).toBe('选择');
            expect(arrow!.fromPosition).toEqual(fromPos);
            expect(arrow!.toPosition).toEqual(toPos);
            expect(arrow!.duration).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate correct arrow for backtrack step', () => {
      fc.assert(
        fc.property(
          positionArb,
          positionArb,
          (fromPos, toPos) => {
            const arrow = generateArrow('backtrack', fromPos, toPos);
            expect(arrow).not.toBeNull();
            expect(arrow!.type).toBe('backtrack');
            expect(arrow!.label).toBe('撤销');
            expect(arrow!.fromPosition).toEqual(fromPos);
            expect(arrow!.toPosition).toEqual(toPos);
            expect(arrow!.duration).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return null for complete step', () => {
      const arrow = generateArrow('complete', { x: 0, y: 0 }, { x: 100, y: 100 });
      expect(arrow).toBeNull();
    });
  });

  /**
   * **Feature: animation-enhancement, Property 4: Step Explanation Completeness**
   * *For any* step context, the generated explanation SHALL contain:
   * - For 'select': the selected number, its position, and available alternatives
   * - For 'backtrack': the removed number and the reason for backtracking
   * - For 'complete': the complete permutation array
   * **Validates: Requirements 3.2, 3.3, 3.4**
   */
  describe('Property 4: Step Explanation Completeness', () => {
    const numberArb = fc.integer({ min: 1, max: 9 });
    const pathArb = fc.array(numberArb, { minLength: 1, maxLength: 6 });
    const availableArb = fc.array(numberArb, { minLength: 0, maxLength: 5 });

    it('should generate complete explanation for select step', () => {
      fc.assert(
        fc.property(
          pathArb,
          availableArb,
          (currentPath, alternatives) => {
            const selectedNumber = currentPath[currentPath.length - 1];
            const context = {
              stepType: 'select' as StepType,
              currentPath,
              available: alternatives,
              selectedNumber,
              alternatives,
              reason: '',
              nextAction: '',
            };
            
            const explanation = generateStepExplanation(context);
            
            // Should contain title
            expect(explanation.title).toBeTruthy();
            // Should mention the selected number
            expect(explanation.main).toContain(String(selectedNumber));
            // Should mention position
            expect(explanation.main).toContain(String(currentPath.length));
            // Should have reason
            expect(explanation.reason).toBeTruthy();
            // Should have next action
            expect(explanation.next).toBeTruthy();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate complete explanation for backtrack step', () => {
      fc.assert(
        fc.property(
          numberArb,
          availableArb,
          (removedNum, alternatives) => {
            const context = {
              stepType: 'backtrack' as StepType,
              currentPath: [],
              available: alternatives,
              selectedNumber: removedNum,
              alternatives,
              reason: '',
              nextAction: '',
            };
            
            const explanation = generateStepExplanation(context);
            
            // Should contain title
            expect(explanation.title).toBeTruthy();
            // Should mention the removed number
            expect(explanation.main).toContain(String(removedNum));
            // Should explain why backtracking
            expect(explanation.reason).toContain('探索完毕');
            // Should have next action
            expect(explanation.next).toBeTruthy();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate complete explanation for complete step', () => {
      fc.assert(
        fc.property(
          pathArb,
          (permutation) => {
            const context = {
              stepType: 'complete' as StepType,
              currentPath: permutation,
              available: [],
              selectedNumber: null,
              alternatives: [],
              reason: '',
              nextAction: '',
            };
            
            const explanation = generateStepExplanation(context);
            
            // Should contain title
            expect(explanation.title).toContain('找到');
            // Should contain the permutation
            expect(explanation.main).toContain(permutation.join(', '));
            // Should explain completion
            expect(explanation.reason).toContain('所有数字');
            // Should mention recording result
            expect(explanation.next).toContain('记录');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('createStepContext', () => {
    it('should correctly identify selected number for select step', () => {
      const previousPath = [1, 2];
      const currentPath = [1, 2, 3];
      const previousAvailable = [3, 4, 5];
      const available = [4, 5];

      const context = createStepContext(
        'select',
        currentPath,
        available,
        previousPath,
        previousAvailable
      );

      expect(context.selectedNumber).toBe(3);
      expect(context.alternatives).toEqual([4, 5]);
    });

    it('should correctly identify removed number for backtrack step', () => {
      const previousPath = [1, 2, 3];
      const currentPath = [1, 2];
      const previousAvailable = [4, 5];
      const available = [3, 4, 5];

      const context = createStepContext(
        'backtrack',
        currentPath,
        available,
        previousPath,
        previousAvailable
      );

      expect(context.selectedNumber).toBe(3);
    });
  });
});
