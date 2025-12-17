import './ResultsPanel.css';

interface ResultsPanelProps {
  results: number[][];
  onHover: (result: number[] | null) => void;
}

export function ResultsPanel({ results, onHover }: ResultsPanelProps) {
  return (
    <div className="results-panel">
      <div className="results-header">
        <h3>生成的排列</h3>
        <span className="results-count">共 {results.length} 个</span>
      </div>

      <div className="results-list">
        {results.length === 0 ? (
          <div className="no-results">等待生成排列...</div>
        ) : (
          results.map((result, idx) => (
            <div
              key={idx}
              className="result-item"
              onMouseEnter={() => onHover(result)}
              onMouseLeave={() => onHover(null)}
            >
              [{result.join(', ')}]
            </div>
          ))
        )}
      </div>
    </div>
  );
}
