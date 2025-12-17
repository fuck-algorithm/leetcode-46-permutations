import { ProgressInfo, MiniMapNode } from '../types';
import './ProgressTracker.css';

interface ProgressTrackerProps {
  progress: ProgressInfo;
  miniMapNodes: MiniMapNode[];
  isCompleted: boolean;
}

export function ProgressTracker({
  progress,
  miniMapNodes,
  isCompleted,
}: ProgressTrackerProps) {
  const {
    percentage,
    foundPermutations,
    expectedPermutations,
    visitedCount,
    totalNodes,
    currentDepth,
    maxDepth,
  } = progress;

  return (
    <div className={`progress-tracker ${isCompleted ? 'completed' : ''}`}>
      <div className="tracker-header">
        <span className="tracker-icon">📊</span>
        <span className="tracker-title">探索进度</span>
      </div>

      {/* 进度条 */}
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <span className="progress-text">{percentage.toFixed(1)}%</span>
      </div>

      {/* 统计信息 */}
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-icon">🎯</span>
          <span className="stat-label">已找到排列</span>
          <span className="stat-value highlight">
            {foundPermutations} / {expectedPermutations}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🔍</span>
          <span className="stat-label">已访问节点</span>
          <span className="stat-value">
            {visitedCount} / {totalNodes}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📏</span>
          <span className="stat-label">当前深度</span>
          <span className="stat-value">
            {currentDepth} / {maxDepth}
          </span>
        </div>
      </div>

      {/* 迷你地图 */}
      <div className="mini-map-container">
        <div className="mini-map-header">
          <span>🗺️ 探索地图</span>
        </div>
        <div className="mini-map">
          {miniMapNodes.map((node) => (
            <div
              key={node.id}
              className={`mini-node ${node.state}`}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
              }}
              title={`节点 ${node.id}`}
            />
          ))}
        </div>
        <div className="mini-map-legend">
          <span className="legend-item">
            <span className="dot current"></span>当前
          </span>
          <span className="legend-item">
            <span className="dot visited"></span>已访问
          </span>
          <span className="legend-item">
            <span className="dot unvisited"></span>未访问
          </span>
        </div>
      </div>

      {/* 完成摘要 */}
      {isCompleted && (
        <div className="completion-summary">
          <div className="summary-icon">🎉</div>
          <div className="summary-text">
            <strong>探索完成！</strong>
            <p>
              共找到 {foundPermutations} 个排列，
              访问了 {visitedCount} 个节点
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
