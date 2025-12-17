import { useState, useCallback, useMemo, useRef } from 'react';
import { InputPanel } from './components/InputPanel';
import { ControlPanel } from './components/ControlPanel';
import { StateDisplay } from './components/StateDisplay';
import { ResultsPanel } from './components/ResultsPanel';
import { TreeVisualization } from './components/TreeVisualization';
import { JavaDebuggerPanel } from './components/JavaDebuggerPanel';
import { EnhancedStepExplanation } from './components/EnhancedStepExplanation';
import { LegendPanel } from './components/LegendPanel';
import { TutorialOverlay } from './components/TutorialOverlay';
import { useAnimationController } from './hooks/useAnimationController';
import { useTutorialController } from './hooks/useTutorialController';
import { PermutationEngine } from './engine/permutation';
import { AnimationStep, TreeNode, StepType } from './types';
import './App.css';

function App() {
  const [inputNumbers, setInputNumbers] = useState<number[]>([]);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [steps, setSteps] = useState<AnimationStep[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set());
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());
  const [backtrackedNodes, setBacktrackedNodes] = useState<Set<string>>(new Set());
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [available, setAvailable] = useState<number[]>([]);
  const [currentStepType, setCurrentStepType] = useState<StepType | null>(null);
  const [lastSelected, setLastSelected] = useState<number | undefined>();
  const [results, setResults] = useState<number[][]>([]);
  const [highlightPath, setHighlightPath] = useState<string[] | null>(null);
  const [previousPath, setPreviousPath] = useState<number[]>([]);
  const [previousAvailable, setPreviousAvailable] = useState<number[]>([]);

  const animationRef = useRef<{ play: () => void; pause: () => void } | null>(null);

  const {
    tutorialState,
    startTutorial,
    exitTutorial,
    submitPrediction,
    continueTutorial,
    checkDecisionPoint,
    getTutorialPrompt,
  } = useTutorialController({
    onPause: () => animationRef.current?.pause(),
    onResume: () => {},
  });

  const rebuildStateFromSteps = useCallback((targetIndex: number) => {
    const newVisitedNodes = new Set<string>();
    const newCompletedNodes = new Set<string>();
    const newBacktrackedNodes = new Set<string>();
    const newResults: number[][] = [];

    for (let i = 0; i <= targetIndex; i++) {
      const step = steps[i];
      if (step.type === 'select') {
        newVisitedNodes.add(step.nodeId);
      } else if (step.type === 'complete') {
        newCompletedNodes.add(step.nodeId);
        if (step.result) {
          newResults.push(step.result);
        }
      } else if (step.type === 'backtrack') {
        newBacktrackedNodes.add(step.nodeId);
      }
    }

    setVisitedNodes(newVisitedNodes);
    setCompletedNodes(newCompletedNodes);
    setBacktrackedNodes(newBacktrackedNodes);
    setResults(newResults);
  }, [steps]);

  const handleStepChange = useCallback((step: AnimationStep, index: number) => {
    setPreviousPath(currentPath);
    setPreviousAvailable(available);
    
    setCurrentNodeId(step.nodeId);
    setCurrentPath(step.currentPath);
    setAvailable(step.available);
    setCurrentStepType(step.type);

    rebuildStateFromSteps(index);

    if (step.type === 'select') {
      setLastSelected(step.currentPath[step.currentPath.length - 1]);
    } else if (step.type === 'backtrack') {
      setLastSelected(step.available[step.available.length - 1]);
    }

    checkDecisionPoint(step.type, index);
  }, [currentPath, available, checkDecisionPoint, rebuildStateFromSteps]);

  const {
    state: animationState,
    currentStepIndex,
    speed,
    play,
    pause,
    stepForward,
    stepBackward,
    reset: resetAnimation,
    setSpeed,
  } = useAnimationController({
    steps,
    onStepChange: handleStepChange,
  });

  animationRef.current = { play, pause };

  const handleSubmit = useCallback((nums: number[]) => {
    const engine = new PermutationEngine();
    const newTree = engine.buildTree(nums);
    const newSteps = engine.generateSteps(nums);

    setInputNumbers(nums);
    setTree(newTree);
    setSteps(newSteps);
    setCurrentNodeId(null);
    setVisitedNodes(new Set());
    setCompletedNodes(new Set());
    setBacktrackedNodes(new Set());
    setCurrentPath([]);
    setAvailable(nums);
    setPreviousPath([]);
    setPreviousAvailable(nums);
    setResults([]);
    setHighlightPath(null);
    setCurrentStepType(null);
    setLastSelected(undefined);
  }, []);

  const handleReset = useCallback(() => {
    resetAnimation();
    setCurrentNodeId(null);
    setVisitedNodes(new Set());
    setCompletedNodes(new Set());
    setBacktrackedNodes(new Set());
    setCurrentPath([]);
    setAvailable(inputNumbers);
    setPreviousPath([]);
    setPreviousAvailable(inputNumbers);
    setResults([]);
    setHighlightPath(null);
    setCurrentStepType(null);
    setLastSelected(undefined);
  }, [resetAnimation, inputNumbers]);

  const handleResultHover = useCallback(
    (result: number[] | null) => {
      if (!result || !tree) {
        setHighlightPath(null);
        return;
      }

      const findPath = (
        node: TreeNode,
        targetPath: number[],
        currentIds: string[]
      ): string[] | null => {
        const newIds = [...currentIds, node.id];
        if (node.children.length === 0) {
          if (
            node.path.length === targetPath.length &&
            node.path.every((v, i) => v === targetPath[i])
          ) {
            return newIds;
          }
          return null;
        }
        for (const child of node.children) {
          const found = findPath(child, targetPath, newIds);
          if (found) return found;
        }
        return null;
      };

      const path = findPath(tree, result, []);
      setHighlightPath(path);
    },
    [tree]
  );

  const isPlaying = animationState === 'playing';
  const isPaused = animationState === 'paused';

  const displayAvailable = useMemo(() => {
    if (currentPath.length === 0 && available.length === 0 && inputNumbers.length > 0) {
      return inputNumbers;
    }
    return available;
  }, [currentPath, available, inputNumbers]);

  return (
    <div className="app">
      {/* 顶部标题和控制栏 */}
      <header className="app-header">
        <div className="header-left">
          <h1>46. 全排列</h1>
          <span className="subtitle">
            <a href="https://leetcode.cn/problems/permutations/" target="_blank" rel="noopener noreferrer">
              LeetCode 46
            </a>
            {' · '}回溯算法可视化
          </span>
        </div>
        <div className="header-center">
          <InputPanel onSubmit={handleSubmit} disabled={isPlaying} />
        </div>
        <div className="header-right">
          {steps.length > 0 && !tutorialState.isActive && (
            <button className="tutorial-button" onClick={startTutorial}>
              🎓 教程
            </button>
          )}
        </div>
      </header>

      {/* 控制面板 */}
      {steps.length > 0 && (
        <div className="control-bar">
          <ControlPanel
            animationState={animationState}
            speed={speed}
            currentStepIndex={currentStepIndex}
            totalSteps={steps.length}
            onPlay={play}
            onPause={pause}
            onStepForward={stepForward}
            onStepBackward={stepBackward}
            onReset={handleReset}
            onSpeedChange={setSpeed}
            hasSteps={steps.length > 0}
          />
        </div>
      )}

      {/* 三栏主内容区 */}
      {steps.length > 0 && (
        <div className="main-content">
          {/* 左侧：代码面板 */}
          <aside className="left-panel">
            <JavaDebuggerPanel
              currentStepType={currentStepType}
              currentPath={currentPath}
              available={displayAvailable}
              inputNumbers={inputNumbers}
              resultCount={results.length}
              previousPath={previousPath}
              previousAvailable={previousAvailable}
            />
          </aside>

          {/* 中间：画布区域（回溯树 + 状态显示） */}
          <main className="center-panel">
            <div className="canvas-area">
              <TreeVisualization
                tree={tree}
                currentNodeId={currentNodeId}
                visitedNodes={visitedNodes}
                completedNodes={completedNodes}
                backtrackedNodes={backtrackedNodes}
                highlightPath={highlightPath}
                stepType={currentStepType}
                showAnnotations={true}
                dimUnexplored={true}
              />
            </div>
            <div className="state-bar">
              <StateDisplay
                currentPath={currentPath}
                available={displayAvailable}
                stepType={currentStepType}
                lastSelected={lastSelected}
              />
            </div>
          </main>

          {/* 右侧：辅助信息 */}
          <aside className="right-panel">
            <EnhancedStepExplanation
              stepType={currentStepType}
              currentPath={currentPath}
              available={displayAvailable}
              previousPath={previousPath}
              previousAvailable={previousAvailable}
              stepIndex={currentStepIndex}
              totalSteps={steps.length}
              isPaused={isPaused}
            />
            <LegendPanel />
            <ResultsPanel results={results} onHover={handleResultHover} />
          </aside>
        </div>
      )}

      {/* 空状态提示 */}
      {steps.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🌳</div>
          <h2>输入数字开始演示</h2>
          <p>在上方输入框中输入 1-6 个不重复的数字（如 1,2,3），然后点击"开始"</p>
        </div>
      )}

      <TutorialOverlay
        tutorialState={tutorialState}
        prompt={getTutorialPrompt()}
        onContinue={continueTutorial}
        onExit={exitTutorial}
        onPrediction={submitPrediction}
      />
    </div>
  );
}

export default App;
