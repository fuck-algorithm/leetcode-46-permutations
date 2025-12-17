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
    message: '算法开始执行！现在需要选择第一个数字放入路径。回溯算法会按顺序尝试每个可用的数字。\n\n观察左侧代码：for 循环会遍历所有可用数字，第一次会选择列表中的第一个。',
  },
  'continue-select': {
    title: '📥 继续深入',
    message: '很好！算法继续选择下一个数字。\n\n注意观察：\n• 当前路径（path）增加了一个数字\n• 可选数字（available）减少了一个\n\n这就是递归深入的过程！',
  },
  'first-complete': {
    title: '✅ 找到第一个排列！',
    message: '恭喜！当路径长度等于输入数组长度时，说明所有数字都已使用，形成了一个完整的排列。\n\n算法会：\n1. 将当前路径记录到结果中\n2. 然后开始回溯，寻找其他排列',
  },
  'first-backtrack': {
    title: '↩️ 回溯的奥秘',
    message: '这就是"回溯"的核心！\n\n算法撤销了上一步的选择：\n• 从路径中移除最后一个数字\n• 将该数字放回可选列表\n\n这样就可以尝试其他的选择了。回溯让算法能够系统地探索所有可能性！',
  },
  'explore-branch': {
    title: '🔍 探索新分支',
    message: '算法现在正在探索另一个分支。\n\n通过不断地：\n• 选择 → 深入\n• 完成 → 记录\n• 回溯 → 尝试其他\n\n算法最终会找到所有可能的排列组合！',
  },
  'summary': {
    title: '🎉 教程完成！',
    message: '你已经掌握了回溯算法的核心思想：\n\n🔹 选择：从可用选项中选择一个加入路径\n🔹 探索：递归地继续选择，直到形成完整排列\n🔹 回溯：撤销选择，尝试其他可能性\n\n这种"尝试-回退"的策略是解决排列、组合、子集等问题的通用方法！',
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
    const currentStep = tutorialState.currentStep;
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    
    // 如果是 intro，直接进入 first-select 并恢复播放
    if (currentStep === 'intro') {
      setTutorialState((prev) => ({
        ...prev,
        currentStep: 'first-select',
        userPrediction: null,
        isWaitingForPrediction: false,
      }));
      onResume?.();
      return;
    }
    
    // 如果是 summary，退出教程
    if (currentStep === 'summary') {
      setTutorialState({
        isActive: false,
        currentStep: 'intro',
        userPrediction: null,
        isWaitingForPrediction: false,
      });
      onResume?.();
      return;
    }
    
    // 其他步骤，清除状态并恢复播放，等待下一个决策点
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
      
      // 如果当前在 intro 步骤，不检查决策点
      if (tutorialState.currentStep === 'intro') return false;

      // 检查第一次选择 (stepIndex === 0)
      if (stepIndex === 0 && stepType === 'select' && !completedSteps.has('first-select')) {
        setTutorialState((prev) => ({
          ...prev,
          currentStep: 'first-select',
          isWaitingForPrediction: false,
        }));
        onPause?.();
        return true;
      }

      // 检查继续选择 (第2或第3步的选择)
      if ((stepIndex === 1 || stepIndex === 2) && stepType === 'select' && 
          completedSteps.has('first-select') && !completedSteps.has('continue-select')) {
        setTutorialState((prev) => ({
          ...prev,
          currentStep: 'continue-select',
          isWaitingForPrediction: false,
        }));
        onPause?.();
        return true;
      }

      // 检查是否是第一次完成
      if (stepType === 'complete' && !firstCompleteFound && !completedSteps.has('first-complete')) {
        setFirstCompleteFound(true);
        setTutorialState((prev) => ({
          ...prev,
          currentStep: 'first-complete',
          isWaitingForPrediction: false,
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

      // 检查探索新分支 (回溯后的第一次选择)
      if (stepType === 'select' && firstBacktrackFound && !completedSteps.has('explore-branch')) {
        setTutorialState((prev) => ({
          ...prev,
          currentStep: 'explore-branch',
          isWaitingForPrediction: false,
        }));
        onPause?.();
        return true;
      }

      // 如果已经完成了所有关键步骤，显示总结
      if (completedSteps.has('explore-branch') && !completedSteps.has('summary')) {
        setTutorialState((prev) => ({
          ...prev,
          currentStep: 'summary',
          isWaitingForPrediction: false,
        }));
        onPause?.();
        return true;
      }

      return false;
    },
    [tutorialState.isActive, tutorialState.currentStep, firstCompleteFound, firstBacktrackFound, completedSteps, onPause]
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
