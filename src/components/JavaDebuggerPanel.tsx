import { useState } from 'react';
import { StepType } from '../types';
import { CodeEditor } from './CodeEditor';
import { MemoryPanel } from './MemoryPanel';
import './JavaDebuggerPanel.css';

interface JavaDebuggerPanelProps {
  currentStepType: StepType | null;
  currentPath: number[];
  available: number[];
  inputNumbers: number[];
  resultCount: number;
  previousPath?: number[];
  previousAvailable?: number[];
  isExpanded?: boolean;
}

export function JavaDebuggerPanel({
  currentStepType,
  currentPath,
  available,
  inputNumbers,
  resultCount,
  previousPath = [],
  previousAvailable = [],
  isExpanded: initialExpanded = true,
}: JavaDebuggerPanelProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  return (
    <div className={`java-debugger-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="debugger-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="debugger-icon">🐛</span>
        <span className="debugger-title">Debug</span>
        <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
      </div>

      {isExpanded && (
        <div className="debugger-content">
          <CodeEditor currentStepType={currentStepType} />
          <MemoryPanel
            currentPath={currentPath}
            available={available}
            inputNumbers={inputNumbers}
            resultCount={resultCount}
            previousPath={previousPath}
            previousAvailable={previousAvailable}
          />
        </div>
      )}
    </div>
  );
}
