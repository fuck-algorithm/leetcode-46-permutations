import { useMemo } from 'react';
import { StepType } from '../types';
import { ProgrammingLanguage, LANGUAGE_CONFIGS, getLanguageConfig } from '../types/languages';
import { 
  getCodeLines, 
  getHighlightedLines, 
  getCurrentExecutionLine,
  getLineVariableMapping 
} from '../engine/multiLangTokenizer';
import './CodeEditor.css';

interface CodeEditorProps {
  currentStepType: StepType | null;
  currentPath?: number[];
  available?: number[];
  inputNumbers?: number[];
  resultCount?: number;
  language: ProgrammingLanguage;
  onLanguageChange: (lang: ProgrammingLanguage) => void;
}

export function CodeEditor({ 
  currentStepType, 
  currentPath = [], 
  available = [],
  inputNumbers = [],
  resultCount = 0,
  language,
  onLanguageChange,
}: CodeEditorProps) {
  const codeLines = useMemo(() => getCodeLines(language), [language]);
  const langConfig = useMemo(() => getLanguageConfig(language), [language]);
  const lineVariableMapping = useMemo(() => getLineVariableMapping(language), [language]);
  
  const highlightedLines = useMemo(() => {
    return getHighlightedLines(language, currentStepType);
  }, [language, currentStepType]);

  const currentExecutionLine = useMemo(() => {
    return getCurrentExecutionLine(language, currentStepType);
  }, [language, currentStepType]);

  // 计算变量值
  const getVariableValue = useMemo(() => {
    const depth = currentPath.length;
    const len = inputNumbers.length;
    const used = inputNumbers.map(n => !available.includes(n));
    const currentI = currentPath.length > 0 
      ? inputNumbers.indexOf(currentPath[currentPath.length - 1])
      : 0;

    return (varName: string): string | null => {
      switch (varName) {
        case 'res':
          return `size=${resultCount}`;
        case 'len':
        case 'n':
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
    const variables = lineVariableMapping[lineNumber];
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
        <div className="file-info">
          <span className="file-icon">{langConfig.icon}</span>
          <span className="file-name">{langConfig.fileName}</span>
        </div>
        <div className="language-selector">
          {LANGUAGE_CONFIGS.map((config) => (
            <button
              key={config.id}
              className={`lang-btn ${language === config.id ? 'active' : ''}`}
              onClick={() => onLanguageChange(config.id)}
              title={config.name}
            >
              <span className="lang-icon">{config.icon}</span>
              <span className="lang-name">{config.name}</span>
            </button>
          ))}
        </div>
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
                  <span className="inline-variable-value">
                    {language === 'python' ? ' # ' : ' // '}
                    {variableDisplay}
                  </span>
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
export function getHighlightedLineNumbers(stepType: StepType | null, lang: ProgrammingLanguage = 'java'): number[] {
  return getHighlightedLines(lang, stepType);
}

/**
 * 用于测试的辅助函数：获取代码行数
 */
export function getCodeLineCount(lang: ProgrammingLanguage = 'java'): number {
  return getCodeLines(lang).length;
}
