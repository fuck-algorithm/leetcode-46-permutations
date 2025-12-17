import { StepType } from '../types';
import './StepExplanation.css';

interface StepExplanationProps {
  stepType: StepType | null;
  currentPath: number[];
  available: number[];
  stepIndex: number;
  totalSteps: number;
}

export function StepExplanation({
  stepType,
  currentPath,
  available: _available,
  stepIndex,
  totalSteps,
}: StepExplanationProps) {
  void _available; // 保留参数以保持接口兼容性
  const getExplanation = () => {
    if (!stepType) {
      return {
        title: '准备开始',
        description: '点击"播放"或"单步"按钮开始演示回溯算法',
        icon: '🎯',
      };
    }

    switch (stepType) {
      case 'select':
        const selectedNum = currentPath[currentPath.length - 1];
        return {
          title: '选择数字',
          description: `从可选数字中选择 ${selectedNum}，加入当前路径`,
          icon: '➡️',
          detail: `路径深入：尝试将 ${selectedNum} 放在第 ${currentPath.length} 个位置`,
        };
      case 'backtrack':
        return {
          title: '回溯',
          description: '当前分支已探索完毕，返回上一层尝试其他选择',
          icon: '↩️',
          detail: '撤销上一步选择，恢复可选数字',
        };
      case 'complete':
        return {
          title: '找到一个排列！',
          description: `完整排列：[${currentPath.join(', ')}]`,
          icon: '✅',
          detail: '所有数字都已使用，记录这个排列结果',
        };
      default:
        return {
          title: '算法执行中',
          description: '正在探索排列组合...',
          icon: '🔄',
        };
    }
  };

  const explanation = getExplanation();

  return (
    <div className={`step-explanation ${stepType || 'idle'}`}>
      <div className="step-header">
        <span className="step-icon">{explanation.icon}</span>
        <span className="step-title">{explanation.title}</span>
        {stepIndex >= 0 && (
          <span className="step-progress">
            步骤 {stepIndex + 1} / {totalSteps}
          </span>
        )}
      </div>
      <div className="step-description">{explanation.description}</div>
      {explanation.detail && (
        <div className="step-detail">{explanation.detail}</div>
      )}
    </div>
  );
}
