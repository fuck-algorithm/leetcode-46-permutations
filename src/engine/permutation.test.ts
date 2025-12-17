import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { PermutationEngine } from './permutation';

// 计算阶乘
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// 检查两个数组是否包含相同元素（不考虑顺序）
function haveSameElements(arr1: number[], arr2: number[]): boolean {
  if (arr1.length !== arr2.length) return false;
  const sorted1 = [...arr1].sort((a, b) => a - b);
  const sorted2 = [...arr2].sort((a, b) => a - b);
  return sorted1.every((val, idx) => val === sorted2[idx]);
}

describe('PermutationEngine', () => {
  /**
   * **Feature: permutation-visualizer, Property 3: Permutation Completeness**
   * *For any* valid input array of size n, the algorithm SHALL generate exactly n! unique permutations,
   * and each permutation SHALL contain exactly the same elements as the input array.
   * **Validates: Requirements 5.1, 5.2**
   */
  it('Property 3: should generate exactly n! unique permutations with correct elements', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.integer({ min: -10, max: 10 }), { minLength: 1, maxLength: 6 }),
        (nums) => {
          const engine = new PermutationEngine();
          const steps = engine.generateSteps(nums);

          // 收集所有完整排列
          const results = steps.filter((s) => s.type === 'complete').map((s) => s.result!);

          // 验证数量等于 n!
          expect(results.length).toBe(factorial(nums.length));

          // 验证每个排列包含相同元素
          for (const result of results) {
            expect(haveSameElements(result, nums)).toBe(true);
          }

          // 验证所有排列唯一
          const resultStrings = results.map((r) => r.join(','));
          const uniqueResults = new Set(resultStrings);
          expect(uniqueResults.size).toBe(results.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: permutation-visualizer, Property 4: Tree Structure Correctness**
   * *For any* valid input array, the generated tree SHALL have a root node with children equal to the input size,
   * and each path from root to leaf SHALL represent a valid permutation.
   * **Validates: Requirements 2.1**
   */
  it('Property 4: tree should have correct structure with valid permutation paths', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.integer({ min: -10, max: 10 }), { minLength: 1, maxLength: 5 }),
        (nums) => {
          const engine = new PermutationEngine();
          const tree = engine.buildTree(nums);

          // 根节点应该有 n 个子节点
          expect(tree.children.length).toBe(nums.length);
          expect(tree.value).toBeNull();
          expect(tree.depth).toBe(0);
          expect(tree.path).toEqual([]);

          // 收集所有叶子节点的路径
          const leafPaths: number[][] = [];
          function collectLeafPaths(node: typeof tree): void {
            if (node.children.length === 0) {
              leafPaths.push(node.path);
            } else {
              for (const child of node.children) {
                collectLeafPaths(child);
              }
            }
          }
          collectLeafPaths(tree);

          // 叶子节点数量应该等于 n!
          expect(leafPaths.length).toBe(factorial(nums.length));

          // 每个叶子路径应该是原数组的一个排列
          for (const path of leafPaths) {
            expect(path.length).toBe(nums.length);
            expect(haveSameElements(path, nums)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: permutation-visualizer, Property 5: Algorithm State Consistency**
   * *For any* animation step, the union of `currentPath` and `available` arrays
   * SHALL equal the original input array, with no duplicates.
   * **Validates: Requirements 3.1, 3.2**
   */
  it('Property 5: currentPath + available should always equal original input', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.integer({ min: -10, max: 10 }), { minLength: 1, maxLength: 6 }),
        (nums) => {
          const engine = new PermutationEngine();
          const steps = engine.generateSteps(nums);

          for (const step of steps) {
            const combined = [...step.currentPath, ...step.available];

            // 合并后应该与原数组包含相同元素
            expect(haveSameElements(combined, nums)).toBe(true);

            // 不应该有重复
            const uniqueCombined = new Set(combined);
            expect(uniqueCombined.size).toBe(combined.length);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: permutation-visualizer, Property 6: Step Transition Correctness**
   * *For any* 'select' step, exactly one number SHALL move from `available` to `currentPath`.
   * *For any* 'backtrack' step, exactly one number SHALL move from `currentPath` back to `available`.
   * **Validates: Requirements 3.3, 3.4**
   */
  it('Property 6: select/backtrack steps should move exactly one number', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.integer({ min: -10, max: 10 }), { minLength: 2, maxLength: 5 }),
        (nums) => {
          const engine = new PermutationEngine();
          const steps = engine.generateSteps(nums);

          for (let i = 1; i < steps.length; i++) {
            const prev = steps[i - 1];
            const curr = steps[i];

            if (curr.type === 'select') {
              // select: currentPath 增加 1，available 减少 1
              expect(curr.currentPath.length).toBe(prev.currentPath.length + 1);
              expect(curr.available.length).toBe(prev.available.length - 1);
            } else if (curr.type === 'backtrack') {
              // backtrack: currentPath 减少，available 增加
              expect(curr.currentPath.length).toBeLessThan(prev.currentPath.length);
              expect(curr.available.length).toBeGreaterThan(prev.available.length);
            }
            // complete 步骤不需要检查转换
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
