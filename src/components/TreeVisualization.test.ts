import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { NODE_COLORS, NodeVisualState } from '../types';

/**
 * **Feature: permutation-visualizer, Property 7: Node Visual State Consistency**
 * *For any* node in the tree, its visual state SHALL be one of:
 * 'unvisited', 'visiting', 'visited', 'backtracked', or 'complete',
 * and each state SHALL have a distinct color.
 * **Validates: Requirements 2.2, 2.3, 2.4, 6.3**
 */
describe('Node Visual States', () => {
  const validStates: NodeVisualState[] = [
    'unvisited',
    'visiting',
    'visited',
    'backtracked',
    'complete',
  ];

  it('Property 7: all valid states should have distinct colors', () => {
    // 验证所有状态都有对应的颜色
    for (const state of validStates) {
      expect(NODE_COLORS[state]).toBeDefined();
      expect(typeof NODE_COLORS[state]).toBe('string');
      expect(NODE_COLORS[state].length).toBeGreaterThan(0);
    }

    // 验证所有颜色都是唯一的
    const colors = Object.values(NODE_COLORS);
    const uniqueColors = new Set(colors);
    expect(uniqueColors.size).toBe(colors.length);
  });

  it('Property 7: NODE_COLORS should only contain valid states', () => {
    const stateKeys = Object.keys(NODE_COLORS) as NodeVisualState[];

    for (const key of stateKeys) {
      expect(validStates).toContain(key);
    }

    // 验证所有有效状态都有颜色定义
    expect(stateKeys.length).toBe(validStates.length);
  });

  it('Property 7: colors should be valid hex or named colors', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...validStates),
        (state) => {
          const color = NODE_COLORS[state];
          // 检查是否为有效的十六进制颜色格式
          const isHexColor = /^#[0-9A-Fa-f]{6}$/.test(color);
          // 或者是有效的命名颜色（简单检查非空字符串）
          const isNamedColor = /^[a-zA-Z]+$/.test(color);

          expect(isHexColor || isNamedColor).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have exactly 5 visual states defined', () => {
    expect(Object.keys(NODE_COLORS).length).toBe(5);
  });

  it('each state should map to a non-empty color string', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...validStates),
        (state) => {
          const color = NODE_COLORS[state];
          expect(color).toBeTruthy();
          expect(color.trim().length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
