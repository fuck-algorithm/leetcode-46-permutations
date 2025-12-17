import { AnimationState } from '../types';
import './ControlPanel.css';

interface ControlPanelProps {
  animationState: AnimationState;
  speed: number;
  currentStepIndex: number;
  totalSteps: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  hasSteps: boolean;
}

export function ControlPanel({
  animationState,
  speed,
  currentStepIndex,
  totalSteps,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
  hasSteps,
}: ControlPanelProps) {
  const isPlaying = animationState === 'playing';
  const isCompleted = animationState === 'completed';
  const isIdle = animationState === 'idle';
  const canStepBackward = currentStepIndex >= 0 && !isPlaying;
  const canStepForward = currentStepIndex < totalSteps - 1 && !isPlaying;

  return (
    <div className="control-panel">
      <div className="controls">
        {isPlaying ? (
          <button className="control-btn pause-btn" onClick={onPause}>
            ⏸ 暂停
          </button>
        ) : (
          <button
            className="control-btn play-btn"
            onClick={onPlay}
            disabled={!hasSteps}
          >
            ▶ {isCompleted ? '重播' : '播放'}
          </button>
        )}

        <button
          className="control-btn step-back-btn"
          onClick={onStepBackward}
          disabled={!hasSteps || !canStepBackward}
          title="上一步"
        >
          ⏮ 上一步
        </button>

        <button
          className="control-btn step-btn"
          onClick={onStepForward}
          disabled={!hasSteps || !canStepForward}
          title="下一步"
        >
          ⏭ 下一步
        </button>

        <button
          className="control-btn reset-btn"
          onClick={onReset}
          disabled={!hasSteps || isIdle}
        >
          ↺ 重置
        </button>

        <div className="speed-control">
          <label htmlFor="speed-slider">速度：</label>
          <input
            id="speed-slider"
            type="range"
            min="100"
            max="2000"
            step="100"
            value={2100 - speed}
            onChange={(e) => onSpeedChange(2100 - Number(e.target.value))}
          />
          <span className="speed-value">{speed}ms</span>
        </div>
      </div>

      {/* 步骤进度指示 */}
      {hasSteps && (
        <div className="step-indicator">
          <span className="step-text">
            步骤: {currentStepIndex + 1} / {totalSteps}
          </span>
          <div className="step-progress-bar">
            <div 
              className="step-progress-fill"
              style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
