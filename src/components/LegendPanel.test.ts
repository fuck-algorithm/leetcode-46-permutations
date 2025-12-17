import { describe, it, expect } from 'vitest';
import { LEGEND_ITEMS, NODE_COLORS, NodeVisualState } from '../types';

describe('Legend Panel', () => {
  /**
   * **Feature: animation-enhancement, Property 8: Legend Completeness for Node States**
   * *For any* node visual state defined in the system (unvisited, visiting, visited,
   * backtracked, complete), there SHALL exist a corresponding legend item with a
   * matching color and description.
   * **Validates: Requirements 7.1**
   */
  describe('Property 8: Legend Completeness for Node States', () => {
    const nodeVisualStates: NodeVisualState[] = [
      'unvisited',
      'visiting',
      'visited',
      'backtracked',
      'complete',
    ];

    it('should have a legend item for each node visual state', () => {
      for (const state of nodeVisualStates) {
        const legendItem = LEGEND_ITEMS.find((item) => item.id === state);
        expect(legendItem).toBeDefined();
        expect(legendItem!.type).toBe('color');
      }
    });

    it('should have matching colors for each node visual state', () => {
      for (const state of nodeVisualStates) {
        const legendItem = LEGEND_ITEMS.find((item) => item.id === state);
        expect(legendItem).toBeDefined();
        expect(legendItem!.visual).toBe(NODE_COLORS[state]);
      }
    });

    it('should have non-empty labels and descriptions for all legend items', () => {
      for (const item of LEGEND_ITEMS) {
        expect(item.label).toBeTruthy();
        expect(item.label.length).toBeGreaterThan(0);
        expect(item.description).toBeTruthy();
        expect(item.description.length).toBeGreaterThan(0);
      }
    });

    it('should have legend items for arrow types', () => {
      const arrowItems = LEGEND_ITEMS.filter((item) => item.type === 'arrow');
      expect(arrowItems.length).toBeGreaterThanOrEqual(2);
      
      // Should have select arrow
      const selectArrow = arrowItems.find((item) => item.id === 'arrow-select');
      expect(selectArrow).toBeDefined();
      expect(selectArrow!.label).toContain('选择');
      
      // Should have backtrack arrow
      const backtrackArrow = arrowItems.find((item) => item.id === 'arrow-backtrack');
      expect(backtrackArrow).toBeDefined();
      expect(backtrackArrow!.label).toContain('撤销');
    });

    it('should have unique IDs for all legend items', () => {
      const ids = LEGEND_ITEMS.map((item) => item.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
