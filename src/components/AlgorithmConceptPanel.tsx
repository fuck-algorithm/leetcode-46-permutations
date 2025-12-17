import { useState } from 'react';
import { StepType, PERMUTATION_PSEUDOCODE } from '../types';
import { getCodeHighlightLines } from '../engine/annotations';
import './AlgorithmConceptPanel.css';

interface AlgorithmConceptPanelProps {
  currentStepType: StepType | null;
  isExpanded?: boolean;
}

export function AlgorithmConceptPanel({
  currentStepType,
  isExpanded: initialExpanded = true,
}: AlgorithmConceptPanelProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  const highlightedLines = getCodeHighlightLines(currentStepType);

  return (
    <div className={`algorithm-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="panel-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="panel-icon">📝</span>
        <span className="panel-title">算法伪代码</span>
        <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
      </div>

      {isExpanded && (
        <div className="panel-content">
          <div className="concept-intro">
            <p>
              <strong>回溯算法</strong>是一种通过探索所有可能的候选解来找出所有解的算法。
              当发现当前候选解不可能是有效解时，就"回溯"到上一步，尝试其他选择。
            </p>
          </div>

          <div className="pseudocode-container">
            {PERMUTATION_PSEUDOCODE.map((line) => {
              const isHighlighted = highlightedLines.includes(line.id);
              const isHovered = hoveredLine === line.id;

              return (
                <div
                  key={line.id}
                  className={`code-line ${isHighlighted ? 'highlighted' : ''} ${
                    isHovered ? 'hovered' : ''
                  }`}
                  style={{ paddingLeft: `${line.indent * 20 + 12}px` }}
                  onMouseEnter={() => setHoveredLine(line.id)}
                  onMouseLeave={() => setHoveredLine(null)}
                >
                  <span className="line-number">{line.id}</span>
                  <code className="line-code">{line.code || '\u00A0'}</code>
                  {isHovered && line.explanation && (
                    <div className="line-tooltip">{line.explanation}</div>
                  )}
                  {isHighlighted && (
                    <span className="highlight-indicator">◀ 当前执行</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="step-legend">
            <div className="legend-item">
              <span className="legend-color select"></span>
              <span>选择 (第10-12行)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color backtrack"></span>
              <span>回溯 (第13行)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color complete"></span>
              <span>完成 (第7-9行)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
