// 算法步骤类型
export type StepType = 'select' | 'backtrack' | 'complete';

// 单个动画步骤
export interface AnimationStep {
  type: StepType;
  nodeId: string;
  currentPath: number[];
  available: number[];
  result?: number[]; // 当 type 为 'complete' 时存在
}

// 树节点结构
export interface TreeNode {
  id: string;
  value: number | null; // null 表示根节点
  children: TreeNode[];
  depth: number;
  path: number[]; // 从根到当前节点的路径
}

// 动画状态
export type AnimationState = 'idle' | 'playing' | 'paused' | 'completed';

// 输入验证结果
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  parsedNumbers?: number[];
}

// 节点视觉状态
export type NodeVisualState = 'unvisited' | 'visiting' | 'visited' | 'backtracked' | 'complete';

// 节点颜色映射
export const NODE_COLORS: Record<NodeVisualState, string> = {
  unvisited: '#e0e0e0',
  visiting: '#4CAF50',
  visited: '#2196F3',
  backtracked: '#FF9800',
  complete: '#9C27B0',
};

// 应用状态
export interface AppState {
  // 输入相关
  inputNumbers: number[];

  // 树结构
  tree: TreeNode | null;

  // 动画相关
  steps: AnimationStep[];
  currentStepIndex: number;
  animationState: AnimationState;
  speed: number;

  // 可视化状态
  currentNodeId: string | null;
  visitedNodes: Set<string>;
  currentPath: number[];
  available: number[];

  // 结果
  results: number[][];
  highlightPath: string[] | null;
}

// ============ 动画增强类型 ============

// 伪代码行结构
export interface PseudocodeLine {
  id: number;
  code: string;
  explanation: string;
  indent: number;
}

// 代码高亮映射
export type CodeHighlightMapping = Record<StepType, number[]>;

// 节点标注类型
export type NodeAnnotationType = 'visiting' | 'selected' | 'backtracking' | 'complete' | null;

// 动画箭头配置
export interface AnimatedArrow {
  id: string;
  fromPosition: { x: number; y: number };
  toPosition: { x: number; y: number };
  label: string;
  type: 'select' | 'backtrack';
  duration: number;
}

// 步骤上下文
export interface StepContext {
  stepType: StepType;
  currentPath: number[];
  available: number[];
  selectedNumber: number | null;
  alternatives: number[];
  reason: string;
  nextAction: string;
}

// 步骤解释
export interface StepExplanationData {
  title: string;
  main: string;
  reason: string;
  next: string;
}

// 进度信息
export interface ProgressInfo {
  totalNodes: number;
  visitedCount: number;
  completedCount: number;
  expectedPermutations: number;
  foundPermutations: number;
  currentDepth: number;
  maxDepth: number;
  percentage: number;
}

// 迷你地图节点
export interface MiniMapNode {
  id: string;
  x: number;
  y: number;
  state: 'visited' | 'current' | 'unvisited';
}

// 教程步骤类型
export type TutorialStep =
  | 'intro'
  | 'first-select'
  | 'continue-select'
  | 'first-complete'
  | 'first-backtrack'
  | 'explore-branch'
  | 'summary';

// 教程状态
export interface TutorialState {
  isActive: boolean;
  currentStep: TutorialStep;
  userPrediction: string | null;
  isWaitingForPrediction: boolean;
}

// 图例项
export interface LegendItem {
  id: string;
  type: 'color' | 'icon' | 'arrow';
  visual: string;
  label: string;
  description: string;
}

// 伪代码定义
export const PERMUTATION_PSEUDOCODE: PseudocodeLine[] = [
  { id: 1, code: 'function permute(nums):', explanation: '定义排列函数，接收数字数组', indent: 0 },
  { id: 2, code: '  result = []', explanation: '初始化结果数组，用于存储所有排列', indent: 1 },
  { id: 3, code: '  backtrack([], nums)', explanation: '开始回溯，初始路径为空', indent: 1 },
  { id: 4, code: '  return result', explanation: '返回所有找到的排列', indent: 1 },
  { id: 5, code: '', explanation: '', indent: 0 },
  { id: 6, code: 'function backtrack(path, remaining):', explanation: '回溯函数：path是当前路径，remaining是剩余可选数字', indent: 0 },
  { id: 7, code: '  if remaining is empty:', explanation: '检查是否所有数字都已使用', indent: 1 },
  { id: 8, code: '    result.add(path)', explanation: '找到一个完整排列，添加到结果中', indent: 2 },
  { id: 9, code: '    return', explanation: '返回上一层继续探索', indent: 2 },
  { id: 10, code: '  for num in remaining:', explanation: '遍历所有剩余可选的数字', indent: 1 },
  { id: 11, code: '    path.add(num)', explanation: '选择当前数字，加入路径', indent: 2 },
  { id: 12, code: '    backtrack(path, remaining - num)', explanation: '递归探索，剩余数字减少', indent: 2 },
  { id: 13, code: '    path.remove(num)', explanation: '回溯：撤销选择，恢复状态', indent: 2 },
];

// 代码高亮映射
export const CODE_HIGHLIGHT_MAPPING: CodeHighlightMapping = {
  select: [10, 11, 12],
  backtrack: [13],
  complete: [7, 8, 9],
};

// 图例数据
export const LEGEND_ITEMS: LegendItem[] = [
  { id: 'unvisited', type: 'color', visual: NODE_COLORS.unvisited, label: '未访问', description: '尚未探索的节点' },
  { id: 'visiting', type: 'color', visual: NODE_COLORS.visiting, label: '正在访问', description: '当前正在处理的节点' },
  { id: 'visited', type: 'color', visual: NODE_COLORS.visited, label: '已访问', description: '已经探索过的节点' },
  { id: 'backtracked', type: 'color', visual: NODE_COLORS.backtracked, label: '回溯', description: '回溯经过的节点' },
  { id: 'complete', type: 'color', visual: NODE_COLORS.complete, label: '完成', description: '找到完整排列的叶节点' },
  { id: 'arrow-select', type: 'arrow', visual: '➡️', label: '选择', description: '从可选数字中选择一个加入路径' },
  { id: 'arrow-backtrack', type: 'arrow', visual: '↩️', label: '撤销', description: '撤销选择，将数字放回可选列表' },
];


// ============ Java 调试器面板类型 ============

// Token 类型
export type TokenType = 'keyword' | 'type' | 'string' | 'number' | 'comment' | 'variable' | 'method' | 'operator' | 'punctuation' | 'plain';

// 代码 Token
export interface CodeToken {
  type: TokenType;
  value: string;
}

// Java 代码行
export interface JavaCodeLine {
  lineNumber: number;
  content: string;
  tokens: CodeToken[];
  indent: number;
}

// 变量显示
export interface VariableDisplay {
  name: string;
  value: string;
  type: string;
  changed?: boolean;
}

// Java 代码映射
export interface JavaCodeMapping {
  stepType: StepType;
  lineNumbers: number[];
  description: string;
}

// Java 行高亮映射
export const JAVA_LINE_MAPPING: Record<StepType, number[]> = {
  select: [17, 18, 19, 20],  // for循环、path.addLast、used[i]=true、递归调用
  backtrack: [21, 22],       // path.removeLast、used[i]=false
  complete: [13, 14, 15],    // if检查、res.add、return
};

// Java 关键字
export const JAVA_KEYWORDS = [
  'public', 'private', 'protected', 'static', 'final', 'void',
  'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break',
  'return', 'new', 'this', 'super', 'class', 'interface', 'extends',
  'implements', 'import', 'package', 'try', 'catch', 'finally',
  'throw', 'throws', 'continue', 'default', 'instanceof'
];

// Java 类型
export const JAVA_TYPES = [
  'int', 'long', 'short', 'byte', 'float', 'double', 'boolean', 'char',
  'String', 'Integer', 'Long', 'Short', 'Byte', 'Float', 'Double',
  'Boolean', 'Character', 'Object', 'List', 'ArrayList', 'Set',
  'HashSet', 'Map', 'HashMap', 'Arrays', 'Collections'
];

// Java 全排列代码 (基于 liweiwei 题解优化)
export const JAVA_PERMUTATION_CODE = `class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        int len = nums.length;
        boolean[] used = new boolean[len];
        Deque<Integer> path = new ArrayDeque<>();
        dfs(nums, len, 0, path, used, res);
        return res;
    }

    void dfs(int[] nums, int len, int depth,
             Deque<Integer> path, boolean[] used,
             List<List<Integer>> res) {
        if (depth == len) {
            res.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < len; i++) {
            if (used[i]) continue;
            path.addLast(nums[i]);
            used[i] = true;
            dfs(nums, len, depth + 1, path, used, res);
            path.removeLast();
            used[i] = false;
        }
    }
}`;
