import { useMemo } from 'react';
import { StepType, JAVA_LINE_MAPPING } from '../types';
import { getJavaPermutationCode, getCurrentExecutionLine } from '../engine/javaTokenizer';
import './CodeEditor.css';

interface CodeEditorProps {
  currentStepType: StepType | null;
  currentPath?: number[];
  available?: number[];
  inputNumbers?: number[];
  resultCount?: number;
}

// 定义哪些行需要显示哪些变量的值
const LINE_VARIABLE_MAPPING: Record<number, string[]> = {
  3: ['res'],           // List<List<Integer>> res = new ArrayList<>();
  4: ['len'],           // int len = nums.length;
  5: ['used'],          // boolean[] used = new boolean[len];
  6: ['path'],          // Deque<Integer> path = new ArrayDeque<>();
  11: ['depth'],        // void dfs(..., int depth, ...)
  14: ['depth', 'len'], // if (depth == len)
  18: ['i', 'len'],     // for (int i = 0; i < len; i++)
  19: ['used[i]'],      // if (used[i]) continue;
  20: ['nums[i]'],      // path.addLast(nums[i]);
  21: ['used[i]'],      // used[i] = true;
};

export function CodeEditor({ 
  currentStepType, 
  currentPath = [], 
  available = [],
  inputNumbers = [],
  resultCount = 0,
}: CodeEditorProps) {
  const codeLines = useMemo(() => getJavaPermutationCode(), []);
  
  const highlightedLines = useMemo(() => {
    if (!currentStepType) return [];
    return JAVA_LINE_MAPPING[currentStepType] || [];
  }, [currentStepType]);

  const currentExecutionLine = useMemo(() => {
    return getCurrentExecutionLine(currentStepType);
  }, [currentStepType]);

  // 计算变量值
  const getVariableValue = useMemo(() => {
    const depth = currentPath.length;
    const len = inputNumbers.length;
    const used = inputNumbers.map(n => !available.includes(n));
    // 当前正在处理的索引 (最后选择的数字在原数组中的位置)
    const currentI = currentPath.length > 0 
      ? inputNumbers.indexOf(currentPath[currentPath.length - 1])
      : 0;

    return (varName: string): string | null => {
      switch (varName) {
        case 'res':
          return `size=${resultCount}`;
        case 'len':
          return `${len}`;
        case 'used':
          return `[${used.map(u => u ? 'T' : 'F').join(', ')}]`;
        case 'path':
          return `[${currentPath.join(', ')}]`;
        case 'depth':
          return `${depth}`;
        case 'i':
          return `${currentI}`;
        case 'used[i]':
          return currentI >= 0 && currentI < used.length ? `${used[currentI]}` : null;
        case 'nums[i]':
          return currentI >= 0 && currentI < inputNumbers.length ? `${inputNumbers[currentI]}` : null;
        default:
          return null;
      }
    };
  }, [currentPath, available, inputNumbers, resultCount]);

  // 获取某行的变量值显示
  const getLineVariableDisplay = (lineNumber: number): string | null => {
    const variables = LINE_VARIABLE_MAPPING[lineNumber];
    if (!variables || inputNumbers.length === 0) return null;

    const values = variables
      .map(v => {
        const value = getVariableValue(v);
        return value !== null ? `${v}=${value}` : null;
      })
      .filter(Boolean);

    return values.length > 0 ? values.join(', ') : null;
  };

  return (
    <div className="code-editor">
      <div className="editor-header">
        <span className="file-icon">☕</span>
        <span className="file-name">Solution.java</span>
      </div>
      <div className="editor-content">
        {codeLines.map((line) => {
          const isHighlighted = highlightedLines.includes(line.lineNumber);
          const isCurrentLine = currentExecutionLine === line.lineNumber;
          const variableDisplay = getLineVariableDisplay(line.lineNumber);

          return (
            <div
              key={line.lineNumber}
              className={`code-line ${isHighlighted ? 'highlighted' : ''} ${isCurrentLine ? 'current' : ''}`}
            >
              <div className="gutter">
                <span className="line-number">{line.lineNumber}</span>
                {isCurrentLine && <span className="execution-arrow">▶</span>}
              </div>
              <div className="line-content">
                {line.tokens.map((token, idx) => (
                  <span key={idx} className={`token token-${token.type}`}>
                    {token.value}
                  </span>
                ))}
                {variableDisplay && (
                  <span className="inline-variable-value">// {variableDisplay}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 用于测试的辅助函数：获取高亮行号
 */
export function getHighlightedLineNumbers(stepType: StepType | null): number[] {
  if (!stepType) return [];
  return JAVA_LINE_MAPPING[stepType] || [];
}

/**
 * 用于测试的辅助函数：获取代码行数
 */
export function getCodeLineCount(): number {
  return getJavaPermutationCode().length;
}
