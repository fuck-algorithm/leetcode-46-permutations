import { TreeNode, ProgressInfo, MiniMapNode } from '../types';

/**
 * 计算阶乘
 */
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

/**
 * 计算树的总节点数
 */
function countTreeNodes(tree: TreeNode | null): number {
  if (!tree) return 0;
  let count = 1;
  for (const child of tree.children) {
    count += countTreeNodes(child);
  }
  return count;
}

/**
 * 获取树的最大深度
 */
function getTreeMaxDepth(tree: TreeNode | null): number {
  if (!tree) return 0;
  if (tree.children.length === 0) return tree.depth;
  return Math.max(...tree.children.map(child => getTreeMaxDepth(child)));
}

/**
 * 获取当前节点的深度
 */
function getNodeDepth(tree: TreeNode | null, nodeId: string): number {
  if (!tree) return 0;
  if (tree.id === nodeId) return tree.depth;
  for (const child of tree.children) {
    const depth = getNodeDepth(child, nodeId);
    if (depth > 0) return depth;
  }
  return 0;
}

/**
 * 计算进度信息
 * **Feature: animation-enhancement, Property 6: Progress Calculation Correctness**
 */
export function calculateProgress(
  tree: TreeNode | null,
  visitedNodes: Set<string>,
  completedNodes: Set<string>,
  results: number[][],
  inputSize: number,
  currentNodeId: string | null
): ProgressInfo {
  const totalNodes = countTreeNodes(tree);
  const visitedCount = visitedNodes.size;
  const completedCount = completedNodes.size;
  const expectedPermutations = factorial(inputSize);
  const foundPermutations = results.length;
  const currentDepth = currentNodeId ? getNodeDepth(tree, currentNodeId) : 0;
  const maxDepth = getTreeMaxDepth(tree);
  const percentage = totalNodes > 0 ? (visitedCount / totalNodes) * 100 : 0;

  return {
    totalNodes,
    visitedCount,
    completedCount,
    expectedPermutations,
    foundPermutations,
    currentDepth,
    maxDepth,
    percentage,
  };
}

/**
 * 生成迷你地图节点
 * **Feature: animation-enhancement, Property 7: Mini-map Position Correctness**
 */
export function generateMiniMap(
  tree: TreeNode | null,
  currentNodeId: string | null,
  visitedNodes: Set<string>
): MiniMapNode[] {
  if (!tree) return [];

  const nodes: MiniMapNode[] = [];
  
  // 使用简单的布局算法
  function traverse(node: TreeNode, index: number, total: number, depth: number) {
    const x = (index / Math.max(total - 1, 1)) * 100;
    const y = (depth / Math.max(getTreeMaxDepth(tree), 1)) * 100;
    
    let state: 'visited' | 'current' | 'unvisited';
    if (node.id === currentNodeId) {
      state = 'current';
    } else if (visitedNodes.has(node.id)) {
      state = 'visited';
    } else {
      state = 'unvisited';
    }

    nodes.push({ id: node.id, x, y, state });

    let childIndex = 0;
    for (const child of node.children) {
      traverse(child, childIndex, node.children.length, depth + 1);
      childIndex++;
    }
  }

  traverse(tree, 0, 1, 0);
  return nodes;
}

/**
 * 获取从根到指定节点的高亮路径
 * **Feature: animation-enhancement, Property 5: Path Highlighting Correctness**
 */
export function getHighlightPath(tree: TreeNode | null, nodeId: string | null): string[] {
  if (!tree || !nodeId) return [];

  function findPath(node: TreeNode, targetId: string, currentPath: string[]): string[] | null {
    const newPath = [...currentPath, node.id];
    
    if (node.id === targetId) {
      return newPath;
    }

    for (const child of node.children) {
      const found = findPath(child, targetId, newPath);
      if (found) return found;
    }

    return null;
  }

  return findPath(tree, nodeId, []) || [];
}

/**
 * 获取需要变暗的节点（未探索的分支）
 * **Feature: animation-enhancement, Property 3: Unexplored Branch Dimming**
 */
export function getDimmedNodes(
  tree: TreeNode | null,
  currentNodeId: string | null,
  visitedNodes: Set<string>
): Set<string> {
  const dimmed = new Set<string>();
  if (!tree || !currentNodeId) return dimmed;

  const highlightPath = getHighlightPath(tree, currentNodeId);
  const highlightSet = new Set(highlightPath);

  function traverse(node: TreeNode) {
    // 如果节点不在高亮路径上且未被访问，则变暗
    if (!highlightSet.has(node.id) && !visitedNodes.has(node.id)) {
      dimmed.add(node.id);
    }
    for (const child of node.children) {
      traverse(child);
    }
  }

  traverse(tree);
  return dimmed;
}

/**
 * 检查节点是否是叶节点
 */
export function isLeafNode(tree: TreeNode | null, nodeId: string): boolean {
  if (!tree) return false;
  
  function find(node: TreeNode): boolean {
    if (node.id === nodeId) {
      return node.children.length === 0;
    }
    for (const child of node.children) {
      if (find(child)) return true;
    }
    return false;
  }

  return find(tree);
}
