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

        <div className="depth-section">
          <div className="depth-header">
            <span className="depth-label">递归深度</span>
            <span className="depth-value">{depth}</span>
          </div>
          <div className="depth-indicator">
            {Array.from({ length: Math.max(depth, 1) }).map((_, i) => (
              <div
                key={i}
                className={`depth-bar ${i < depth ? 'active' : ''}`}
                style={{ opacity: 0.3 + (i / Math.max(depth, 1)) * 0.7 }}
              />
            ))}
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
