import { useState, useCallback } from 'react';
import { TutorialStep, TutorialState, StepType } from '../types';

interface TutorialControllerOptions {
  onPause?: () => void;
  onResume?: () => void;
}

interface TutorialControllerReturn {
  tutorialState: TutorialState;
  startTutorial: () => void;
  exitTutorial: () => void;
  submitPrediction: (prediction: string) => void;
  continueTutorial: () => void;
  checkDecisionPoint: (stepType: StepType, stepIndex: number) => boolean;
  getTutorialPrompt: () => TutorialPrompt | null;
}

interface TutorialPrompt {
  title: string;
  message: string;
  options?: string[];
  showPrediction?: boolean;
}

const TUTORIAL_PROMPTS: Record<TutorialStep, TutorialPrompt> = {
  'intro': {
    title: '🎓 欢迎来到回溯算法教程',
    message: '在这个教程中，你将学习回溯算法如何生成所有排列组合。我们会在关键步骤暂停，让你思考算法的下一步操作。',
  },
  'first-select': {
    title: '📥 第一次选择',
    message: '算法开始执行！现在需要选择第一个数字放入路径。你认为算法会选择哪个数字？',
    showPrediction: true,
    options: ['选择第一个可用数字', '随机选择', '选择最大的数字'],
  },
  'continue-select': {
    title: '📥 继续选择',
    message: '很好！算法继续选择下一个数字。注意观察：每次选择后，可选数字会减少一个。',
  },
  'first-complete': {
    title: '✅ 找到第一个排列！',
    message: '恭喜！算法找到了第一个完整的排列。当所有数字都被使用时，就形成了一个有效的排列。接下来算法会做什么？',
    showPrediction: true,
    options: ['记录结果并回溯', '结束算法', '重新开始'],
  },
  'first-backtrack': {
    title: '↩️ 第一次回溯',
    message: '这就是"回溯"！算法撤销上一步选择，尝试其他可能性。这是回溯算法的核心思想。',
  },
  'explore-branch': {
    title: '🔍 探索新分支',
    message: '算法现在正在探索另一个分支。通过系统地尝试所有可能的选择，算法能够找到所有的排列组合。',
  },
  'summary': {
    title: '🎉 教程完成！',
    message: '你已经了解了回溯算法的基本原理：\n\n1. 选择：从可用选项中选择一个\n2. 探索：递归地继续选择\n3. 回溯：撤销选择，尝试其他可能\n\n这种"尝试-回退"的策略让算法能够系统地探索所有可能性。',
  },
};

export function useTutorialController(
  options: TutorialControllerOptions = {}
): TutorialControllerReturn {
  const { onPause, onResume } = options;

  const [tutorialState, setTutorialState] = useState<TutorialState>({
    isActive: false,
    currentStep: 'intro',
    userPrediction: null,
    isWaitingForPrediction: false,
  });

  const [completedSteps, setCompletedSteps] = useState<Set<TutorialStep>>(new Set());
  const [firstCompleteFound, setFirstCompleteFound] = useState(false);
  const [firstBacktrackFound, setFirstBacktrackFound] = useState(false);

  const startTutorial = useCallback(() => {
    setTutorialState({
      isActive: true,
      currentStep: 'intro',
      userPrediction: null,
      isWaitingForPrediction: false,
    });
    setCompletedSteps(new Set());
    setFirstCompleteFound(false);
    setFirstBacktrackFound(false);
    onPause?.();
  }, [onPause]);

  const exitTutorial = useCallback(() => {
    setTutorialState({
      isActive: false,
      currentStep: 'intro',
      userPrediction: null,
      isWaitingForPrediction: false,
    });
    onResume?.();
  }, [onResume]);

  const submitPrediction = useCallback((prediction: string) => {
    setTutorialState((prev) => ({
      ...prev,
      userPrediction: prediction,
      isWaitingForPrediction: false,
    }));
  }, []);

  const continueTutorial = useCallback(() => {
    setCompletedSteps((prev) => new Set([...prev, tutorialState.currentStep]));
    setTutorialState((prev) => ({
      ...prev,
      userPrediction: null,
      isWaitingForPrediction: false,
    }));
    onResume?.();
  }, [tutorialState.currentStep, onResume]);

  const checkDecisionPoint = useCallback(
    (stepType: StepType, stepIndex: number): boolean => {
      if (!tutorialState.isActive) return false;

      // 检查是否是第一次完成
      if (stepType === 'complete' && !firstCompleteFound && !completedSteps.has('first-complete')) {
        setFirstCompleteFound(true);
        setTutorialState((prev) => ({
          ...prev,
          currentStep: 'first-complete',
          isWaitingForPrediction: true,
        }));
        onPause?.();
        return true;
      }

      // 检查是否是第一次回溯
      if (stepType === 'backtrack' && !firstBacktrackFound && !completedSteps.has('first-backtrack')) {
        setFirstBacktrackFound(true);
        setTutorialState((prev) => ({
          ...prev,
          currentStep: 'first-backtrack',
          isWaitingForPrediction: false,
        }));
        onPause?.();
        return true;
      }

      // 检查第一次选择
      if (stepIndex === 0 && stepType === 'select' && !completedSteps.has('first-select')) {
        setTutorialState((prev) => ({
          ...prev,
          currentStep: 'first-select',
          isWaitingForPrediction: true,
        }));
        onPause?.();
        return true;
      }

      // 检查继续选择
      if (stepIndex === 2 && stepType === 'select' && !completedSteps.has('continue-select')) {
        setTutorialState((prev) => ({
          ...prev,
          currentStep: 'continue-select',
          isWaitingForPrediction: false,
        }));
        onPause?.();
        return true;
      }

      return false;
    },
    [tutorialState.isActive, firstCompleteFound, firstBacktrackFound, completedSteps, onPause]
  );

  const getTutorialPrompt = useCallback((): TutorialPrompt | null => {
    if (!tutorialState.isActive) return null;
    return TUTORIAL_PROMPTS[tutorialState.currentStep];
  }, [tutorialState.isActive, tutorialState.currentStep]);

  return {
    tutorialState,
    startTutorial,
    exitTutorial,
    submitPrediction,
    continueTutorial,
    checkDecisionPoint,
    getTutorialPrompt,
  };
}
