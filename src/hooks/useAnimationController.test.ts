import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useAnimationController } from './useAnimationController';
import { AnimationStep } from '../types';

// 生成测试用的动画步骤
function generateMockSteps(count: number): AnimationStep[] {
  return Array.from({ length: count }, (_, i) => ({
    type: i === count - 1 ? 'complete' : 'select',
    nodeId: `node-${i}`,
    currentPath: Array.from({ length: i + 1 }, (_, j) => j),
    available: Array.from({ length: count - i - 1 }, (_, j) => i + j + 1),
    result: i === count - 1 ? Array.from({ length: count }, (_, j) => j) : undefined,
  })) as AnimationStep[];
}

describe('useAnimationController', () => {
  /**
   * **Feature: permutation-visualizer, Property 8: Step Forward Determinism**
   * *For any* animation state with `currentStepIndex < steps.length - 1`,
   * calling `stepForward()` SHALL increment `currentStepIndex` by exactly 1
   * and update the visualization state accordingly.
   * **Validates: Requirements 4.3**
   */
  it('Property 8: stepForward should increment currentStepIndex by exactly 1', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 10 }), // 步骤数量
        fc.integer({ min: 0, max: 8 }), // 初始步骤索引偏移
        (stepCount, initialOffset) => {
          const steps = generateMockSteps(stepCount);
          const onStepChange = vi.fn();

          const { result } = renderHook(() =>
            useAnimationController({ steps, onStepChange })
          );

          // 执行多次 stepForward 到达初始位置
          const targetIndex = Math.min(initialOffset, stepCount - 2);
          for (let i = 0; i <= targetIndex; i++) {
            act(() => {
              result.current.stepForward();
            });
          }

          const indexBefore = result.current.currentStepIndex;

          // 如果还没到最后一步，再执行一次 stepForward
          if (indexBefore < stepCount - 1) {
            act(() => {
              result.current.stepForward();
            });

            // 验证索引增加了 1
            expect(result.current.currentStepIndex).toBe(indexBefore + 1);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: permutation-visualizer, Property 9: Reset State Restoration**
   * *For any* animation state, calling `reset()` SHALL restore `currentStepIndex` to -1 (before first step),
   * `animationState` to 'idle', and prepare for fresh animation.
   * **Validates: Requirements 4.4**
   */
  it('Property 9: reset should restore to initial state', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }), // 步骤数量
        fc.integer({ min: 0, max: 9 }), // 执行的步骤数
        (stepCount, stepsToExecute) => {
          const steps = generateMockSteps(stepCount);
          const onStepChange = vi.fn();

          const { result } = renderHook(() =>
            useAnimationController({ steps, onStepChange })
          );

          // 执行一些步骤
          const actualSteps = Math.min(stepsToExecute, stepCount);
          for (let i = 0; i < actualSteps; i++) {
            act(() => {
              result.current.stepForward();
            });
          }

          // 调用 reset
          act(() => {
            result.current.reset();
          });

          // 验证状态已重置
          expect(result.current.currentStepIndex).toBe(-1);
          expect(result.current.state).toBe('idle');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should start in idle state', () => {
    const steps = generateMockSteps(3);
    const onStepChange = vi.fn();

    const { result } = renderHook(() =>
      useAnimationController({ steps, onStepChange })
    );

    expect(result.current.state).toBe('idle');
    expect(result.current.currentStepIndex).toBe(-1);
  });

  it('should change to paused state after stepForward from idle', () => {
    const steps = generateMockSteps(3);
    const onStepChange = vi.fn();

    const { result } = renderHook(() =>
      useAnimationController({ steps, onStepChange })
    );

    act(() => {
      result.current.stepForward();
    });

    expect(result.current.state).toBe('paused');
    expect(result.current.currentStepIndex).toBe(0);
  });

  it('should clamp speed between 100 and 2000', () => {
    const steps = generateMockSteps(3);
    const onStepChange = vi.fn();

    const { result } = renderHook(() =>
      useAnimationController({ steps, onStepChange })
    );

    act(() => {
      result.current.setSpeed(50);
    });
    expect(result.current.speed).toBe(100);

    act(() => {
      result.current.setSpeed(3000);
    });
    expect(result.current.speed).toBe(2000);

    act(() => {
      result.current.setSpeed(500);
    });
    expect(result.current.speed).toBe(500);
  });
});
