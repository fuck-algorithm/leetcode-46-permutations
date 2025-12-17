import { useMemo, useEffect, useState } from 'react';
import { formatJavaArray } from '../engine/javaTokenizer';
import './MemoryPanel.css';

interface MemoryPanelProps {
  currentPath: number[];
  available: number[];
  inputNumbers: number[];
  resultCount: number;
  previousPath?: number[];
  previousAvailable?: number[];
}

// 调用栈帧接口
interface StackFrame {
  depth: number;
  path: number[];
  currentChoice: number | null;
  availableChoices: number[];
}

interface VariableState {
  name: string;
  value: string;
  type: string;
  changed: boolean;
}

// 根据 path 和 inputNumbers 计算 used 数组
function computeUsedArray(inputNumbers: number[], currentPath: number[]): boolean[] {
  return inputNumbers.map(num => currentPath.includes(num));
}

// 格式化 boolean 数组为字符串
function formatBooleanArray(arr: boolean[]): string {
  return `[${arr.map(v => v ? 'T' : 'F').join(', ')}]`;
}

export function MemoryPanel({
  currentPath,
  available: _available,
  inputNumbers,
  resultCount,
  previousPath = [],
  previousAvailable: _previousAvailable = [],
}: MemoryPanelProps) {
  // Note: available and previousAvailable are kept for interface compatibility
  // but not used since we now compute 'used' array from inputNumbers and currentPath
  void _available;
  void _previousAvailable;
  const [flashStates, setFlashStates] = useState<Record<string, boolean>>({});

  const usedArray = useMemo(() => computeUsedArray(inputNumbers, currentPath), [inputNumbers, currentPath]);
  const previousUsedArray = useMemo(() => computeUsedArray(inputNumbers, previousPath), [inputNumbers, previousPath]);

  const variables: VariableState[] = useMemo(() => {
    const pathChanged = JSON.stringify(currentPath) !== JSON.stringify(previousPath);
    const usedChanged = JSON.stringify(usedArray) !== JSON.stringify(previousUsedArray);
    
    return [
      {
        name: 'path',
        value: formatJavaArray(currentPath),
        type: 'Deque<Integer>',
        changed: pathChanged,
      },
      {
        name: 'used',
        value: formatBooleanArray(usedArray),
        type: 'boolean[]',
        changed: usedChanged,
      },
      {
        name: 'res.size()',
        value: String(resultCount),
        type: 'int',
        changed: false,
      },
    ];
  }, [currentPath, usedArray, resultCount, previousPath, previousUsedArray]);

  const depth = currentPath.length;

  // 处理变化闪烁效果
  useEffect(() => {
    const changedVars = variables.filter(v => v.changed).map(v => v.name);
    if (changedVars.length > 0) {
      const newFlashStates: Record<string, boolean> = {};
      changedVars.forEach(name => {
        newFlashStates[name] = true;
      });
      setFlashStates(prev => ({ ...prev, ...newFlashStates }));

      const timer = setTimeout(() => {
        setFlashStates({});
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [variables]);

  return (
    <div className="memory-panel">
      <div className="memory-header">
        <span className="memory-icon">📊</span>
        <span className="memory-title">Variables</span>
      </div>
      
      <div className="memory-content">
        <div className="variables-section">
          {variables.map((variable) => (
            <div
              key={variable.name}
              className={`variable-row ${flashStates[variable.name] ? 'flash' : ''}`}
            >
              <span className="var-name">{variable.name}</span>
              <span className="var-separator">:</span>
              <span className="var-value">{variable.value}</span>
              <span className="var-type">{variable.type}</span>
            </div>
          ))}
        </div>

        {/* 调用栈可视化 */}
        <div className="call-stack-section">
          <div className="stack-header">
            <span className="stack-icon">📚</span>
            <span className="stack-title">调用栈</span>
            <span className="stack-depth">深度: {depth}</span>
          </div>
          <div className="stack-frames">
            {depth === 0 ? (
              <div className="stack-empty">
                <span className="empty-icon">⏳</span>
                <span>等待开始...</span>
              </div>
            ) : (
              <>
                {/* 从栈底到栈顶显示 */}
                {Array.from({ length: depth }).map((_, i) => {
                  const frameDepth = i;
                  const framePath = currentPath.slice(0, frameDepth + 1);
                  const currentChoice = currentPath[frameDepth];
                  const isTopFrame = frameDepth === depth - 1;
                  
                  return (
                    <div 
                      key={frameDepth} 
                      className={`stack-frame ${isTopFrame ? 'active' : ''}`}
                      style={{ marginLeft: `${frameDepth * 8}px` }}
                    >
                      <div className="frame-header">
                        <span className="frame-icon">{isTopFrame ? '▶' : '│'}</span>
                        <span className="frame-name">dfs(depth={frameDepth + 1})</span>
                      </div>
                      <div className="frame-content">
                        <span className="frame-path">path=[{framePath.join(',')}]</span>
                        <span className="frame-choice">选择: {currentChoice}</span>
                      </div>
                    </div>
                  );
                })}
                {/* 栈底标识 */}
                <div className="stack-bottom">
                  <span className="bottom-icon">═</span>
                  <span className="bottom-label">permute()</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 用于测试的辅助函数：计算递归深度
 */
export function calculateDepth(path: number[]): number {
  return path.length;
}

/**
 * 用于测试的辅助函数：获取变量显示状态
 */
export function getVariableDisplayState(
  currentPath: number[],
  available: number[],
  resultCount: number
): { path: string; remaining: string; resultSize: string; depth: number } {
  return {
    path: formatJavaArray(currentPath),
    remaining: formatJavaArray(available),
    resultSize: String(resultCount),
    depth: currentPath.length,
  };
}
