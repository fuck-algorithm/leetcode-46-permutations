import { useMemo } from 'react';
import { StepType, JAVA_LINE_MAPPING } from '../types';
import { getJavaPermutationCode, getCurrentExecutionLine } from '../engine/javaTokenizer';
import './CodeEditor.css';

interface CodeEditorProps {
  currentStepType: StepType | null;
}

export function CodeEditor({ currentStepType }: CodeEditorProps) {
  const codeLines = useMemo(() => getJavaPermutationCode(), []);
  
  const highlightedLines = useMemo(() => {
    if (!currentStepType) return [];
    return JAVA_LINE_MAPPING[currentStepType] || [];
  }, [currentStepType]);

  const currentExecutionLine = useMemo(() => {
    return getCurrentExecutionLine(currentStepType);
  }, [currentStepType]);

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
