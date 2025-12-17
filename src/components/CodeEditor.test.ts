import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getHighlightedLineNumbers, getCodeLineCount } from './CodeEditor';
import { getJavaPermutationCode } from '../engine/javaTokenizer';
import { JAVA_LINE_MAPPING, StepType } from '../types';

describe('CodeEditor', () => {
  /**
   * Property 2: Line Number Consistency
   * For any array of code lines with length N, the rendered output SHALL contain
   * exactly N line number elements, numbered 1 through N.
   * Validates: Requirements 1.3
   */
  describe('Property 2: Line Number Consistency', () => {
    it('should have correct number of lines', () => {
      const lines = getJavaPermutationCode();
      const lineCount = getCodeLineCount();
      
      expect(lines.length).toBe(lineCount);
      expect(lineCount).toBeGreaterThan(0);
    });

    it('should have sequential line numbers starting from 1', () => {
      const lines = getJavaPermutationCode();
      
      lines.forEach((line, index) => {
        expect(line.lineNumber).toBe(index + 1);
      });
    });

    it('should have line numbers for all lines', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: getCodeLineCount() }),
          (lineNum) => {
            const lines = getJavaPermutationCode();
            const line = lines.find(l => l.lineNumber === lineNum);
            expect(line).toBeDefined();
            expect(line?.lineNumber).toBe(lineNum);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 3: Step-to-Line Highlight Mapping
   * For any step type (select, backtrack, complete), the highlighted line numbers
   * SHALL match the predefined mapping for that step type.
   * Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5
   */
  describe('Property 3: Step-to-Line Highlight Mapping', () => {
    const stepTypes: StepType[] = ['select', 'backtrack', 'complete'];

    it('should return correct highlighted lines for each step type', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...stepTypes),
          (stepType) => {
            const highlightedLines = getHighlightedLineNumbers(stepType);
            const expectedLines = JAVA_LINE_MAPPING[stepType];
            
            expect(highlightedLines).toEqual(expectedLines);
            expect(highlightedLines.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return empty array for null step type', () => {
      const highlightedLines = getHighlightedLineNumbers(null);
      expect(highlightedLines).toEqual([]);
    });

    it('should highlight select lines correctly', () => {
      const lines = getHighlightedLineNumbers('select');
      expect(lines).toEqual(JAVA_LINE_MAPPING.select);
      // Select should highlight for loop, add, and recursive call
      expect(lines.length).toBeGreaterThanOrEqual(1);
    });

    it('should highlight backtrack line correctly', () => {
      const lines = getHighlightedLineNumbers('backtrack');
      expect(lines).toEqual(JAVA_LINE_MAPPING.backtrack);
      // Backtrack should highlight the remove line
      expect(lines.length).toBeGreaterThanOrEqual(1);
    });

    it('should highlight complete lines correctly', () => {
      const lines = getHighlightedLineNumbers('complete');
      expect(lines).toEqual(JAVA_LINE_MAPPING.complete);
      // Complete should highlight if check, add result, and return
      expect(lines.length).toBeGreaterThanOrEqual(1);
    });

    it('should have all highlighted lines within valid range', () => {
      const totalLines = getCodeLineCount();
      
      stepTypes.forEach(stepType => {
        const highlightedLines = getHighlightedLineNumbers(stepType);
        highlightedLines.forEach(lineNum => {
          expect(lineNum).toBeGreaterThanOrEqual(1);
          expect(lineNum).toBeLessThanOrEqual(totalLines);
        });
      });
    });
  });
});
