import {
  StepType,
  AnimatedArrow,
  StepContext,
  StepExplanationData,
  CODE_HIGHLIGHT_MAPPING,
} from '../types';

/**
 * 获取当前步骤类型对应的代码高亮行
 * **Feature: animation-enhancement, Property 1: Code Highlight Mapping Correctness**
 */
export function getCodeHighlightLines(stepType: StepType | null): number[] {
  if (!stepType) return [];
  return CODE_HIGHLIGHT_MAPPING[stepType] || [];
}

/**
 * 生成动画箭头配置
 * **Feature: animation-enhancement, Property 2: Arrow Generation Correctness**
 */
export function generateArrow(
  stepType: StepType,
  fromPosition: { x: number; y: number },
  toPosition: { x: number; y: number }
): AnimatedArrow | null {
  if (stepType === 'complete') return null;

  const id = `arrow-${Date.now()}`;
  
  if (stepType === 'select') {
    return {
      id,
      fromPosition,
      toPosition,
      label: '选择',
      type: 'select',
      duration: 300,
    };
  }
  
  if (stepType === 'backtrack') {
    return {
      id,
      fromPosition,
      toPosition,
      label: '撤销',
      type: 'backtrack',
      duration: 300,
    };
  }
  
  return null;
}

/**
 * 生成步骤解释
 * **Feature: animation-enhancement, Property 4: Step Explanation Completeness**
 */
export function generateStepExplanation(context: StepContext): StepExplanationData {
  const { stepType, currentPath, selectedNumber, alternatives } = context;

  switch (stepType) {
    case 'select': {
      const position = currentPath.length;
      
      return {
        title: '📥 选择数字',
        main: `选择数字 ${selectedNumber} 放在第 ${position} 个位置`,
        reason: `当前按顺序尝试可选数字，选择了 ${selectedNumber}`,
        next: alternatives.length > 0
          ? `如果这条路径走不通，会回来尝试 ${alternatives[0]}`
          : '继续向下探索',
      };
    }
    
    case 'backtrack': {
      const removedNum = selectedNumber;
      return {
        title: '↩️ 回溯',
        main: `撤销选择，将 ${removedNum} 放回可选列表`,
        reason: '当前分支已经探索完毕（找到了排列或无路可走）',
        next: alternatives.length > 0
          ? `返回上一层，尝试其他选择`
          : '继续回溯到更上一层',
      };
    }
    
    case 'complete': {
      return {
        title: '✅ 找到排列',
        main: `成功找到一个排列：[${currentPath.join(', ')}]`,
        reason: '所有数字都已使用，当前路径就是一个完整的排列',
        next: '记录这个结果，然后回溯寻找其他排列',
      };
    }
    
    default:
      return {
        title: '准备开始',
        main: '点击播放按钮开始演示',
        reason: '',
        next: '',
      };
  }
}

/**
 * 根据动画步骤创建步骤上下文
 */
export function createStepContext(
  stepType: StepType,
  currentPath: number[],
  available: number[],
  previousPath: number[],
  previousAvailable: number[]
): StepContext {
  let selectedNumber: number | null = null;
  let alternatives: number[] = [];

  if (stepType === 'select') {
    // 选择步骤：找出新加入路径的数字
    selectedNumber = currentPath[currentPath.length - 1];
    // 其他可选数字（不包括已选的）
    alternatives = previousAvailable.filter(n => n !== selectedNumber);
  } else if (stepType === 'backtrack') {
    // 回溯步骤：找出被移除的数字
    selectedNumber = previousPath[previousPath.length - 1];
    alternatives = available.filter(n => n !== selectedNumber);
  }

  return {
    stepType,
    currentPath,
    available,
    selectedNumber,
    alternatives,
    reason: '',
    nextAction: '',
  };
}

/**
 * 获取节点标注文本
 */
export function getNodeAnnotationText(stepType: StepType | null): string {
  switch (stepType) {
    case 'select':
      return '选择';
    case 'backtrack':
      return '撤销';
    case 'complete':
      return '找到排列!';
    default:
      return '正在访问';
  }
}
