import { AnimationStep, TreeNode } from '../types';

/**
 * 全排列引擎 - 生成动画步骤和树结构
 * 
 * 关键：使用基于路径的确定性节点ID，确保 buildTree 和 generateSteps 生成的 ID 一致
 */
export class PermutationEngine {
  /**
   * 根据路径生成确定性的节点ID
   * 这样无论是 buildTree 还是 generateSteps，相同路径的节点都会有相同的 ID
   */
  private generateNodeIdFromPath(path: number[]): string {
    if (path.length === 0) {
      return 'node-root';
    }
    return `node-${path.join('-')}`;
  }

  /**
   * 构建回溯树结构
   * @param nums 输入数组
   * @returns 树的根节点
   */
  buildTree(nums: number[]): TreeNode {
    const root: TreeNode = {
      id: this.generateNodeIdFromPath([]),
      value: null,
      children: [],
      depth: 0,
      path: [],
    };

    this.buildTreeRecursive(root, nums, []);
    return root;
  }

  /**
   * 递归构建树
   */
  private buildTreeRecursive(parent: TreeNode, available: number[], currentPath: number[]): void {
    for (const num of available) {
      const newPath = [...currentPath, num];
      const child: TreeNode = {
        id: this.generateNodeIdFromPath(newPath),
        value: num,
        children: [],
        depth: parent.depth + 1,
        path: newPath,
      };
      parent.children.push(child);

      const remaining = available.filter((n) => n !== num);
      if (remaining.length > 0) {
        this.buildTreeRecursive(child, remaining, newPath);
      }
    }
  }

  /**
   * 生成动画步骤序列
   * @param nums 输入数组
   * @returns 动画步骤数组
   */
  generateSteps(nums: number[]): AnimationStep[] {
    const steps: AnimationStep[] = [];

    // 初始状态不需要步骤，从第一次选择开始
    this.backtrack(nums, [], nums, steps);

    return steps;
  }

  /**
   * 回溯生成排列并记录步骤
   * 关键：每次回溯只移除一个元素，确保动画演示清晰可理解
   * 返回值：递归结束时的最终路径和可用数字状态
   */
  private backtrack(
    original: number[],
    currentPath: number[],
    available: number[],
    steps: AnimationStep[]
  ): { finalPath: number[]; finalAvailable: number[] } {
    // 如果没有可用数字，说明找到一个完整排列
    if (available.length === 0) {
      const nodeId = this.generateNodeIdFromPath(currentPath);
      steps.push({
        type: 'complete',
        nodeId,
        currentPath: [...currentPath],
        available: [],
        result: [...currentPath],
      });
      return { finalPath: [...currentPath], finalAvailable: [] };
    }

    let lastFinalPath = [...currentPath];
    let lastFinalAvailable = [...available];

    // 尝试每个可用数字
    for (let i = 0; i < available.length; i++) {
      const num = available[i];
      const newPath = [...currentPath, num];
      const newAvailable = available.filter((_, idx) => idx !== i);

      // 使用基于路径的确定性节点 ID
      const nodeId = this.generateNodeIdFromPath(newPath);

      // 记录选择步骤
      steps.push({
        type: 'select',
        nodeId,
        currentPath: newPath,
        available: newAvailable,
      });

      // 递归，获取递归结束时的状态
      const result = this.backtrack(original, newPath, newAvailable, steps);
      lastFinalPath = result.finalPath;
      lastFinalAvailable = result.finalAvailable;

      // 回溯：从递归结束的状态逐步回溯到当前层级
      // 只有在还有其他选择需要探索时才添加回溯步骤
      if (i < available.length - 1) {
        this.generateBacktrackSteps(
          steps,
          lastFinalPath,
          lastFinalAvailable,
          currentPath,
          available,
          original
        );
        lastFinalPath = [...currentPath];
        lastFinalAvailable = [...available];
      }
    }

    return { finalPath: lastFinalPath, finalAvailable: lastFinalAvailable };
  }

  /**
   * 生成从当前状态回溯到目标状态的所有中间步骤
   * 确保每一步只移除一个元素，让用户能清晰看到回溯过程
   */
  private generateBacktrackSteps(
    steps: AnimationStep[],
    fromPath: number[],
    fromAvailable: number[],
    toPath: number[],
    _toAvailable: number[],
    original: number[]
  ): void {
    let tempPath = [...fromPath];
    let tempAvailable = [...fromAvailable];

    // 逐步回溯，每次移除路径末尾的一个元素
    while (tempPath.length > toPath.length) {
      const removedNum = tempPath.pop()!;
      tempAvailable = [...tempAvailable, removedNum];
      // 保持 available 的顺序与原始数组一致
      tempAvailable.sort((a, b) => original.indexOf(a) - original.indexOf(b));

      // 回溯步骤的 nodeId 应该是回溯后的路径对应的节点
      const nodeId = this.generateNodeIdFromPath(tempPath);

      steps.push({
        type: 'backtrack',
        nodeId,
        currentPath: [...tempPath],
        available: [...tempAvailable],
      });
    }
  }
}

// 导出单例实例
export const permutationEngine = new PermutationEngine();
