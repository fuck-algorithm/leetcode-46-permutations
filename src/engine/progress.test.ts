import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateProgress,
  generateMiniMap,
  getHighlightPath,
  getDimmedNodes,
} from './progress';
import { TreeNode } from '../types';
import { PermutationEngine } from './permutation';

// 辅助函数：创建测试用的树
function createTestTree(nums: number[]): TreeNode {
  const engine = new PermutationEngine();
  return engine.buildTree(nums);
}

// 辅助函数：计算阶乘
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// 辅助函数：收集树中所有节点ID
function collectAllNodeIds(tree: TreeNode): string[] {
  const ids: string[] = [tree.id];
  for (const child of tree.children) {
    ids.push(...collectAllNodeIds(child));
  }
  return ids;
}

describe('Progress Calculator', () => {
  /**
   * **Feature: animation-enhancement, Property 6: Progress Calculation Correctness**
   * *For any* animation state, the progress percentage SHALL equal
   * (visitedNodes.size / totalNodes) * 100, and the found permutations count
   * SHALL equal the length of the results array.
   * **Validates: Requirements 5.1, 5.2**
   */
  describe('Property 6: Progress Calculation Correctness', () => {
    it('should calculate correct progress percentage', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 4 }),
          fc.integer({ min: 0, max: 100 }),
          (inputSize, visitedPercentage) => {
            const nums = Array.from({ length: inputSize }, (_, i) => i + 1);
            const tree = createTestTree(nums);
            const allNodeIds = collectAllNodeIds(tree);
            const totalNodes = allNodeIds.length;
            
            // 随机选择一些节点作为已访问
            const visitedCount = Math.floor((visitedPercentage / 100) * totalNodes);
            const visitedNodes = new Set(allNodeIds.slice(0, visitedCount));
            const completedNodes = new Set<string>();
            const results: number[][] = [];
            
            const progress = calculateProgress(
              tree,
              visitedNodes,
              completedNodes,
              results,
              inputSize,
              null
            );

            // 验证百分比计算
            const expectedPercentage = (visitedCount / totalNodes) * 100;
            expect(progress.percentage).toBeCloseTo(expectedPercentage, 5);
            
            // 验证总节点数
            expect(progress.totalNodes).toBe(totalNodes);
            
            // 验证已访问节点数
            expect(progress.visitedCount).toBe(visitedCount);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly count found permutations', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 4 }),
          fc.integer({ min: 0, max: 24 }),
          (inputSize, foundCount) => {
            const nums = Array.from({ length: inputSize }, (_, i) => i + 1);
            const tree = createTestTree(nums);
            const maxPermutations = factorial(inputSize);
            const actualFoundCount = Math.min(foundCount, maxPermutations);
            
            // 创建模拟结果
            const results: number[][] = Array.from(
              { length: actualFoundCount },
              () => nums
            );
            
            const progress = calculateProgress(
              tree,
              new Set(),
              new Set(),
              results,
              inputSize,
              null
            );

            expect(progress.foundPermutations).toBe(actualFoundCount);
            expect(progress.expectedPermutations).toBe(maxPermutations);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: animation-enhancement, Property 5: Path Highlighting Correctness**
   * *For any* current node in the tree, the highlight path SHALL contain exactly
   * all node IDs from the root to the current node, in order from root to current.
   * **Validates: Requirements 4.2**
   */
  describe('Property 5: Path Highlighting Correctness', () => {
    it('should return path from root to current node', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 4 }),
          (inputSize) => {
            const nums = Array.from({ length: inputSize }, (_, i) => i + 1);
            const tree = createTestTree(nums);
            const allNodeIds = collectAllNodeIds(tree);
            
            // 随机选择一个节点
            const randomIndex = Math.floor(Math.random() * allNodeIds.length);
            const targetNodeId = allNodeIds[randomIndex];
            
            const path = getHighlightPath(tree, targetNodeId);
            
            // 路径应该非空
            expect(path.length).toBeGreaterThan(0);
            
            // 路径应该以根节点开始
            expect(path[0]).toBe(tree.id);
            
            // 路径应该以目标节点结束
            expect(path[path.length - 1]).toBe(targetNodeId);
            
            // 路径中的每个节点应该是下一个节点的父节点
            for (let i = 0; i < path.length - 1; i++) {
              const parentId = path[i];
              const childId = path[i + 1];
              
              // 验证父子关系
              function findNode(node: TreeNode, id: string): TreeNode | null {
                if (node.id === id) return node;
                for (const child of node.children) {
                  const found = findNode(child, id);
                  if (found) return found;
                }
                return null;
              }
              
              const parent = findNode(tree, parentId);
              expect(parent).not.toBeNull();
              expect(parent!.children.some(c => c.id === childId)).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return empty array for null nodeId', () => {
      const tree = createTestTree([1, 2, 3]);
      const path = getHighlightPath(tree, null);
      expect(path).toEqual([]);
    });

    it('should return empty array for null tree', () => {
      const path = getHighlightPath(null, 'some-id');
      expect(path).toEqual([]);
    });
  });

  /**
   * **Feature: animation-enhancement, Property 7: Mini-map Position Correctness**
   * *For any* tree and current node ID, the mini-map SHALL correctly mark the
   * current node as 'current', visited nodes as 'visited', and all other nodes
   * as 'unvisited'.
   * **Validates: Requirements 5.4**
   */
  describe('Property 7: Mini-map Position Correctness', () => {
    it('should correctly mark node states in mini-map', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 4 }),
          (inputSize) => {
            const nums = Array.from({ length: inputSize }, (_, i) => i + 1);
            const tree = createTestTree(nums);
            const allNodeIds = collectAllNodeIds(tree);
            
            // 随机选择当前节点
            const currentIndex = Math.floor(Math.random() * allNodeIds.length);
            const currentNodeId = allNodeIds[currentIndex];
            
            // 随机选择一些已访问节点
            const visitedCount = Math.floor(Math.random() * allNodeIds.length);
            const visitedNodes = new Set(
              allNodeIds
                .filter(id => id !== currentNodeId)
                .slice(0, visitedCount)
            );
            
            const miniMap = generateMiniMap(tree, currentNodeId, visitedNodes);
            
            // 验证所有节点都在迷你地图中
            expect(miniMap.length).toBe(allNodeIds.length);
            
            // 验证当前节点标记为 'current'
            const currentNode = miniMap.find(n => n.id === currentNodeId);
            expect(currentNode).toBeDefined();
            expect(currentNode!.state).toBe('current');
            
            // 验证已访问节点标记为 'visited'
            for (const visitedId of visitedNodes) {
              const node = miniMap.find(n => n.id === visitedId);
              expect(node).toBeDefined();
              expect(node!.state).toBe('visited');
            }
            
            // 验证其他节点标记为 'unvisited'
            for (const node of miniMap) {
              if (node.id !== currentNodeId && !visitedNodes.has(node.id)) {
                expect(node.state).toBe('unvisited');
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return empty array for null tree', () => {
      const miniMap = generateMiniMap(null, 'some-id', new Set());
      expect(miniMap).toEqual([]);
    });
  });

  /**
   * **Feature: animation-enhancement, Property 3: Unexplored Branch Dimming**
   * *For any* tree state with a current node, all nodes that are not ancestors
   * of the current node and have not been visited SHALL be marked for dimming.
   * **Validates: Requirements 2.5**
   */
  describe('Property 3: Unexplored Branch Dimming', () => {
    it('should dim unexplored branches correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 2, max: 4 }),
          (inputSize) => {
            const nums = Array.from({ length: inputSize }, (_, i) => i + 1);
            const tree = createTestTree(nums);
            const allNodeIds = collectAllNodeIds(tree);
            
            // 选择一个非根节点作为当前节点
            const nonRootIds = allNodeIds.filter(id => id !== tree.id);
            if (nonRootIds.length === 0) return;
            
            const currentIndex = Math.floor(Math.random() * nonRootIds.length);
            const currentNodeId = nonRootIds[currentIndex];
            
            // 获取高亮路径（祖先节点）
            const highlightPath = getHighlightPath(tree, currentNodeId);
            const highlightSet = new Set(highlightPath);
            
            // 获取需要变暗的节点
            const dimmedNodes = getDimmedNodes(tree, currentNodeId, new Set());
            
            // 验证：高亮路径上的节点不应该被变暗
            for (const nodeId of highlightPath) {
              expect(dimmedNodes.has(nodeId)).toBe(false);
            }
            
            // 验证：不在高亮路径上且未访问的节点应该被变暗
            for (const nodeId of allNodeIds) {
              if (!highlightSet.has(nodeId)) {
                expect(dimmedNodes.has(nodeId)).toBe(true);
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not dim visited nodes', () => {
      const tree = createTestTree([1, 2, 3]);
      const allNodeIds = collectAllNodeIds(tree);
      const currentNodeId = allNodeIds[1]; // 选择第二个节点
      
      // 将一些节点标记为已访问
      const visitedNodes = new Set([allNodeIds[2], allNodeIds[3]]);
      
      const dimmedNodes = getDimmedNodes(tree, currentNodeId, visitedNodes);
      
      // 已访问的节点不应该被变暗
      for (const visitedId of visitedNodes) {
        expect(dimmedNodes.has(visitedId)).toBe(false);
      }
    });
  });
});
