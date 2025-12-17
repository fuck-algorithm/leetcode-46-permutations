import { useState } from 'react';
import { LEGEND_ITEMS, LegendItem } from '../types';
import './LegendPanel.css';

interface LegendPanelProps {
  onItemHover?: (itemId: string | null) => void;
}

export function LegendPanel({ onItemHover }: LegendPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleItemHover = (itemId: string | null) => {
    setHoveredItem(itemId);
    onItemHover?.(itemId);
  };

  const colorItems = LEGEND_ITEMS.filter((item) => item.type === 'color');
  const arrowItems = LEGEND_ITEMS.filter((item) => item.type === 'arrow');

  return (
    <div className={`legend-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="legend-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="legend-icon">🎨</span>
        <span className="legend-title">图例说明</span>
        <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
      </div>

      {isExpanded && (
        <div className="legend-content">
          {/* 节点颜色说明 */}
          <div className="legend-section">
            <div className="section-title">节点状态</div>
            <div className="legend-items">
              {colorItems.map((item) => (
                <LegendItemComponent
                  key={item.id}
                  item={item}
                  isHovered={hoveredItem === item.id}
                  onHover={handleItemHover}
                />
              ))}
            </div>
          </div>

          {/* 箭头说明 */}
          <div className="legend-section">
            <div className="section-title">操作类型</div>
            <div className="legend-items">
              {arrowItems.map((item) => (
                <LegendItemComponent
                  key={item.id}
                  item={item}
                  isHovered={hoveredItem === item.id}
                  onHover={handleItemHover}
                />
              ))}
            </div>
          </div>

          {/* 快速提示 */}
          <div className="quick-tips">
            <div className="tips-title">💡 快速提示</div>
            <ul className="tips-list">
              <li>绿色节点表示当前正在处理</li>
              <li>紫色节点表示找到了完整排列</li>
              <li>橙色表示回溯操作</li>
              <li>悬停在结果上可以高亮对应路径</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

interface LegendItemComponentProps {
  item: LegendItem;
  isHovered: boolean;
  onHover: (itemId: string | null) => void;
}

function LegendItemComponent({
  item,
  isHovered,
  onHover,
}: LegendItemComponentProps) {
  return (
    <div
      className={`legend-item ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="item-visual">
        {item.type === 'color' ? (
          <span
            className="color-swatch"
            style={{ backgroundColor: item.visual }}
          />
        ) : (
          <span className="icon-visual">{item.visual}</span>
        )}
      </div>
      <div className="item-info">
        <span className="item-label">{item.label}</span>
        <span className="item-description">{item.description}</span>
      </div>
    </div>
  );
}
