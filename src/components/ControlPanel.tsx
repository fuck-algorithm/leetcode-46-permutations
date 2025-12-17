import { useEffect } from 'react';
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
  onGoToStep: (step: number) => void;
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
  onGoToStep,
  hasSteps,
}: ControlPanelProps) {
  const isPlaying = animationState === 'playing';
  const isCompleted = animationState === 'completed';
  const isIdle = animationState === 'idle';
  const canStepBackward = currentStepIndex >= 0 && !isPlaying;
  const canStepForward = currentStepIndex < totalSteps - 1 && !isPlaying;

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果焦点在输入框中，不处理快捷键
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case ' ': // 空格键：播放/暂停
          e.preventDefault();
          if (isPlaying) {
            onPause();
          } else if (hasSteps) {
            onPlay();
          }
          break;
        case 'ArrowLeft': // 左方向键：上一步
          e.preventDefault();
          if (hasSteps && canStepBackward) {
            onStepBackward();
          }
          break;
        case 'ArrowRight': // 右方向键：下一步
          e.preventDefault();
          if (hasSteps && canStepForward) {
            onStepForward();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, hasSteps, canStepBackward, canStepForward, onPlay, onPause, onStepForward, onStepBackward]);

  return (
    <div className="control-panel">
      <div className="controls">
        {isPlaying ? (
          <button className="control-btn pause-btn" onClick={onPause} title="快捷键: 空格">
            ⏸ 暂停 <span className="shortcut-hint">[空格]</span>
          </button>
        ) : (
          <button
            className="control-btn play-btn"
            onClick={onPlay}
            disabled={!hasSteps}
            title="快捷键: 空格"
          >
            ▶ {isCompleted ? '重播' : '播放'} <span className="shortcut-hint">[空格]</span>
          </button>
        )}

        <button
          className="control-btn step-back-btn"
          onClick={onStepBackward}
          disabled={!hasSteps || !canStepBackward}
          title="上一步 (快捷键: ←)"
        >
          ⏮ 上一步 <span className="shortcut-hint">[←]</span>
        </button>

        <button
          className="control-btn step-btn"
          onClick={onStepForward}
          disabled={!hasSteps || !canStepForward}
          title="下一步 (快捷键: →)"
        >
          ⏭ 下一步 <span className="shortcut-hint">[→]</span>
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

      {/* 步骤进度滑块 */}
      {hasSteps && (
        <div className="step-indicator">
          <span className="step-text">
            步骤: {currentStepIndex + 1} / {totalSteps}
          </span>
          <input
            type="range"
            className="step-slider"
            min="0"
            max={totalSteps - 1}
            value={Math.max(0, currentStepIndex)}
            onChange={(e) => onGoToStep(Number(e.target.value))}
            title={`拖动跳转到任意步骤`}
            style={{
              background: `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${((Math.max(0, currentStepIndex) / (totalSteps - 1)) * 100)}%, #e0e0e0 ${((Math.max(0, currentStepIndex) / (totalSteps - 1)) * 100)}%, #e0e0e0 100%)`
            }}
          />
        </div>
      )}
    </div>
  );
}
