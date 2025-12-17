import { StepType, StepContext } from '../types';
import { generateStepExplanation, createStepContext } from '../engine/annotations';
import './EnhancedStepExplanation.css';

interface EnhancedStepExplanationProps {
  stepType: StepType | null;
  currentPath: number[];
  available: number[];
  previousPath: number[];
  previousAvailable: number[];
  stepIndex: number;
  totalSteps: number;
  isPaused: boolean;
}

export function EnhancedStepExplanation({
  stepType,
  currentPath,
  available,
  previousPath,
  previousAvailable,
  stepIndex,
  totalSteps,
  isPaused,
}: EnhancedStepExplanationProps) {
  // 创建步骤上下文
  const context: StepContext | null = stepType
    ? createStepContext(stepType, currentPath, available, previousPath, previousAvailable)
    : null;

  // 生成解释
  const explanation = context ? generateStepExplanation(context) : null;

  const getStepIcon = () => {
    switch (stepType) {
      case 'select':
        return '📥';
      case 'backtrack':
        return '↩️';
      case 'complete':
        return '✅';
      default:
        return '🎯';
    }
  };

  const getStepClass = () => {
    if (!stepType) return 'idle';
    return stepType;
  };

  return (
    <div className={`enhanced-step-explanation ${getStepClass()} ${isPaused ? 'paused' : ''}`}>
      {/* 步骤头部 */}
      <div className="step-header">
        <span className="step-icon">{getStepIcon()}</span>
        <span className="step-title">
          {explanation?.title || '准备开始'}
        </span>
        {stepIndex >= 0 && (
          <span className="step-progress">
            步骤 {stepIndex + 1} / {totalSteps}
          </span>
        )}
      </div>

      {/* 主要说明 */}
      <div className="step-main">
        {explanation?.main || '点击"播放"或"单步"按钮开始演示回溯算法'}
      </div>

      {/* 详细解释 */}
      {explanation && (
        <div className="step-details">
          {/* 原因说明 */}
          {explanation.reason && (
            <div className="detail-section">
              <span className="detail-label">💡 为什么：</span>
              <span className="detail-text">{explanation.reason}</span>
            </div>
          )}

          {/* 下一步预告 */}
          {explanation.next && (
            <div className="detail-section">
              <span className="detail-label">➡️ 接下来：</span>
              <span className="detail-text">{explanation.next}</span>
            </div>
          )}

          {/* 可选数字提示 */}
          {stepType === 'select' && context?.alternatives && context.alternatives.length > 0 && (
            <div className="alternatives-section">
              <span className="detail-label">🔄 其他选择：</span>
              <div className="alternatives-list">
                {context.alternatives.map((num, idx) => (
                  <span key={idx} className="alternative-num">{num}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 暂停状态提示 */}
      {isPaused && stepType && (
        <div className="paused-hint">
          <span className="hint-icon">⏸️</span>
          <span className="hint-text">
            动画已暂停 - 仔细观察当前状态，理解算法的决策过程
          </span>
        </div>
      )}

      {/* 当前状态摘要 */}
      {stepType && (
        <div className="state-summary">
          <div className="summary-item">
            <span className="summary-label">当前路径：</span>
            <span className="summary-value">
              [{currentPath.join(', ') || '空'}]
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">剩余可选：</span>
            <span className="summary-value">
              [{available.join(', ') || '空'}]
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
