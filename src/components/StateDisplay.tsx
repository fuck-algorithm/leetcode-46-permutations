import { StepType } from '../types';
import './StateDisplay.css';

interface StateDisplayProps {
  currentPath: number[];
  available: number[];
  stepType: StepType | null;
  lastSelected?: number;
}

export function StateDisplay({
  currentPath,
  available,
  stepType,
  lastSelected,
}: StateDisplayProps) {
  return (
    <div className="state-display">
      <div className="state-row">
        <span className="state-label">当前路径：</span>
        <div className="number-boxes">
          {currentPath.length === 0 ? (
            <span className="empty-hint">[ 空 ]</span>
          ) : (
            currentPath.map((num, idx) => (
              <div
                key={`path-${idx}`}
                className={`number-box path-box ${
                  idx === currentPath.length - 1 && stepType === 'select'
                    ? 'just-added'
                    : ''
                }`}
              >
                {num}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 箭头指示 */}
      {stepType && (
        <div className={`arrow-indicator ${stepType}`}>
          {stepType === 'select' && (
            <>
              <span className="arrow">↑</span>
              <span className="arrow-text">选择</span>
            </>
          )}
          {stepType === 'backtrack' && (
            <>
              <span className="arrow">↓</span>
              <span className="arrow-text">回溯</span>
            </>
          )}
          {stepType === 'complete' && (
            <>
              <span className="arrow">✓</span>
              <span className="arrow-text">完成</span>
            </>
          )}
        </div>
      )}

      <div className="state-row">
        <span className="state-label">可选数字：</span>
        <div className="number-boxes">
          {available.length === 0 ? (
            <span className="empty-hint">[ 空 ]</span>
          ) : (
            available.map((num, idx) => (
              <div
                key={`avail-${idx}`}
                className={`number-box available-box ${
                  num === lastSelected && stepType === 'backtrack'
                    ? 'just-returned'
                    : ''
                }`}
              >
                {num}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
