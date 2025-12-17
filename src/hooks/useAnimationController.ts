import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimationState, AnimationStep } from '../types';

interface UseAnimationControllerProps {
  steps: AnimationStep[];
  onStepChange: (step: AnimationStep, index: number) => void;
}

interface UseAnimationControllerReturn {
  state: AnimationState;
  currentStepIndex: number;
  speed: number;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  reset: () => void;
  setSpeed: (ms: number) => void;
  goToStep: (index: number) => void;
}

export function useAnimationController({
  steps,
  onStepChange,
}: UseAnimationControllerProps): UseAnimationControllerReturn {
  const [state, setState] = useState<AnimationState>('idle');
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [speed, setSpeedState] = useState(500);
  const intervalRef = useRef<number | null>(null);

  // 清除定时器
  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 执行单步
  const executeStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < steps.length) {
        setCurrentStepIndex(index);
        onStepChange(steps[index], index);

        if (index === steps.length - 1) {
          setState('completed');
          clearTimer();
        }
      }
    },
    [steps, onStepChange, clearTimer]
  );

  // 播放
  const play = useCallback(() => {
    if (steps.length === 0) return;

    if (state === 'completed') {
      // 如果已完成，从头开始
      setCurrentStepIndex(-1);
    }

    setState('playing');
  }, [steps.length, state]);

  // 暂停
  const pause = useCallback(() => {
    setState('paused');
    clearTimer();
  }, [clearTimer]);

  // 单步前进
  const stepForward = useCallback(() => {
    if (steps.length === 0) return;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      executeStep(nextIndex);
      if (state === 'idle') {
        setState('paused');
      }
    }
  }, [steps.length, currentStepIndex, executeStep, state]);

  // 单步后退
  const stepBackward = useCallback(() => {
    if (steps.length === 0) return;

    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      executeStep(prevIndex);
      if (state === 'completed') {
        setState('paused');
      }
    } else if (currentStepIndex === 0) {
      // 回到初始状态
      setCurrentStepIndex(-1);
      setState('idle');
    }
  }, [steps.length, currentStepIndex, executeStep, state]);

  // 跳转到指定步骤
  const goToStep = useCallback((index: number) => {
    if (steps.length === 0) return;
    if (index < 0 || index >= steps.length) return;

    clearTimer();
    executeStep(index);
    if (state === 'playing') {
      setState('paused');
    } else if (state === 'idle') {
      setState('paused');
    }
  }, [steps.length, executeStep, clearTimer, state]);

  // 重置
  const reset = useCallback(() => {
    clearTimer();
    setState('idle');
    setCurrentStepIndex(-1);
  }, [clearTimer]);

  // 设置速度
  const setSpeed = useCallback((ms: number) => {
    setSpeedState(Math.max(100, Math.min(2000, ms)));
  }, []);

  // 处理播放状态的定时器
  useEffect(() => {
    if (state === 'playing') {
      clearTimer();

      const tick = () => {
        setCurrentStepIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex < steps.length) {
            onStepChange(steps[nextIndex], nextIndex);
            if (nextIndex === steps.length - 1) {
              setState('completed');
              clearTimer();
            }
            return nextIndex;
          }
          return prevIndex;
        });
      };

      // 立即执行第一步（如果从头开始）
      if (currentStepIndex === -1) {
        tick();
      }

      intervalRef.current = window.setInterval(tick, speed);
    }

    return () => {
      if (state !== 'playing') {
        clearTimer();
      }
    };
  }, [state, speed, steps, onStepChange, clearTimer, currentStepIndex]);

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    state,
    currentStepIndex,
    speed,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    setSpeed,
    goToStep,
  };
}
