import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { TreeNode, NODE_COLORS, NodeVisualState, StepType } from '../types';
import { getHighlightPath, getDimmedNodes } from '../engine/progress';
import './TreeVisualization.css';

interface TreeVisualizationProps {
  tree: TreeNode | null;
  currentNodeId: string | null;
  visitedNodes: Set<string>;
  completedNodes: Set<string>;
  backtrackedNodes?: Set<string>;
  highlightPath: string[] | null;
  stepType?: StepType | null;
  showAnnotations?: boolean;
  dimUnexplored?: boolean;
}

interface D3TreeNode {
  id: string;
  value: number | null;
  children?: D3TreeNode[];
  path: number[];
}

export function TreeVisualization({
  tree,
  currentNodeId,
  visitedNodes,
  completedNodes,
  backtrackedNodes = new Set(),
  highlightPath,
  stepType,
  showAnnotations = true,
  dimUnexplored = true,
}: TreeVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    if (!tree || !svgRef.current || !containerRef.current) return;

    // 获取容器实际尺寸
    const containerRect = containerRef.current.getBoundingClientRect();
    const width = Math.max(containerRect.width, 600);
    const height = Math.max(containerRect.height, 400);
    const margin = { top: 50, right: 30, bottom: 30, left: 30 };

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // 添加渐变定义
    const defs = svg.append('defs');
    
    // 脉冲动画渐变
    const pulseGradient = defs.append('radialGradient')
      .attr('id', 'pulse-gradient');
    pulseGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#4CAF50')
      .attr('stop-opacity', 1);
    pulseGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#4CAF50')
      .attr('stop-opacity', 0.3);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const root = d3.hierarchy<D3TreeNode>(tree as D3TreeNode);

    const treeLayout = d3
      .tree<D3TreeNode>()
      .size([width - margin.left - margin.right, height - margin.top - margin.bottom - 20]);

    const treeData = treeLayout(root);

    // 计算当前路径和需要变暗的节点
    const currentPathIds = currentNodeId 
      ? new Set(getHighlightPath(tree, currentNodeId))
      : new Set<string>();
    
    const dimmedNodes = dimUnexplored && currentNodeId
      ? getDimmedNodes(tree, currentNodeId, visitedNodes)
      : new Set<string>();

    const getNodeState = (nodeId: string): NodeVisualState => {
      if (nodeId === currentNodeId) return 'visiting';
      if (completedNodes.has(nodeId)) return 'complete';
      if (backtrackedNodes.has(nodeId)) return 'backtracked';
      if (visitedNodes.has(nodeId)) return 'visited';
      return 'unvisited';
    };

    const isHighlighted = (nodeId: string): boolean => {
      return highlightPath?.includes(nodeId) ?? false;
    };

    const isInCurrentPath = (nodeId: string): boolean => {
      return currentPathIds.has(nodeId);
    };

    const isDimmed = (nodeId: string): boolean => {
      return dimmedNodes.has(nodeId);
    };

    // 绘制连接线
    g.selectAll('.link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', (d) => {
        return `M${d.source.x},${d.source.y}
                C${d.source.x},${(d.source.y + d.target.y) / 2}
                 ${d.target.x},${(d.source.y + d.target.y) / 2}
                 ${d.target.x},${d.target.y}`;
      })
      .attr('fill', 'none')
      .attr('stroke', (d) => {
        const targetId = d.target.data.id;
        if (isHighlighted(targetId)) return '#9C27B0';
        if (isInCurrentPath(targetId)) return '#4CAF50';
        if (isDimmed(targetId)) return '#e0e0e0';
        return '#ccc';
      })
      .attr('stroke-width', (d) => {
        const targetId = d.target.data.id;
        if (isHighlighted(targetId) || isInCurrentPath(targetId)) return 3;
        return 1.5;
      })
      .attr('opacity', (d) => {
        const targetId = d.target.data.id;
        if (isDimmed(targetId)) return 0.3;
        return 1;
      });

    // 绘制节点组
    const nodes = g
      .selectAll('.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', (d) => {
        const classes = ['node'];
        if (d.data.id === currentNodeId) classes.push('current');
        if (isDimmed(d.data.id)) classes.push('dimmed');
        return classes.join(' ');
      })
      .attr('transform', (d) => `translate(${d.x},${d.y})`);

    // 当前节点的脉冲效果
    nodes
      .filter((d) => d.data.id === currentNodeId)
      .append('circle')
      .attr('class', 'pulse-ring')
      .attr('r', 20)
      .attr('fill', 'none')
      .attr('stroke', '#4CAF50')
      .attr('stroke-width', 2)
      .attr('opacity', 0.6);

    // 主节点圆
    nodes
      .append('circle')
      .attr('class', 'node-circle')
      .attr('r', (d) => (d.data.value === null ? 12 : 16))
      .attr('fill', (d) => {
        const state = getNodeState(d.data.id);
        if (isHighlighted(d.data.id)) return '#9C27B0';
        return NODE_COLORS[state];
      })
      .attr('stroke', (d) => {
        if (d.data.id === currentNodeId) return '#2E7D32';
        if (isHighlighted(d.data.id)) return '#7B1FA2';
        if (isInCurrentPath(d.data.id)) return '#4CAF50';
        return 'transparent';
      })
      .attr('stroke-width', 3)
      .attr('opacity', (d) => isDimmed(d.data.id) ? 0.3 : 1)
      .on('mouseenter', function(_event, d) {
        setHoveredNode(d.data.id);
      })
      .on('mouseleave', function() {
        setHoveredNode(null);
      });

    // 节点文字
    nodes
      .append('text')
      .attr('class', 'node-text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => {
        const state = getNodeState(d.data.id);
        if (state === 'unvisited' && !isHighlighted(d.data.id)) return '#666';
        return 'white';
      })
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('opacity', (d) => isDimmed(d.data.id) ? 0.3 : 1)
      .text((d) => (d.data.value === null ? '根' : d.data.value.toString()));

    // 添加节点标注
    if (showAnnotations && currentNodeId) {
      const currentNode = treeData.descendants().find(d => d.data.id === currentNodeId);
      if (currentNode) {
        const annotationGroup = g.append('g')
          .attr('class', 'annotation-group')
          .attr('transform', `translate(${currentNode.x},${currentNode.y})`);

        // 标注背景
        const labelText = getAnnotationLabel(stepType);
        const labelWidth = labelText.length * 10 + 16;
        
        annotationGroup.append('rect')
          .attr('class', `annotation-bg ${stepType || 'idle'}`)
          .attr('x', -labelWidth / 2)
          .attr('y', -38)
          .attr('width', labelWidth)
          .attr('height', 20)
          .attr('rx', 10)
          .attr('fill', getAnnotationColor(stepType))
          .attr('opacity', 0.9);

        // 标注文字
        annotationGroup.append('text')
          .attr('class', 'annotation-text')
          .attr('y', -24)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-size', '11px')
          .attr('font-weight', 'bold')
          .text(labelText);

        // 指向箭头
        annotationGroup.append('path')
          .attr('d', 'M0,-18 L-5,-12 L5,-12 Z')
          .attr('fill', getAnnotationColor(stepType));
      }
    }

    // 悬停时显示路径提示
    if (hoveredNode) {
      const hoveredNodeData = treeData.descendants().find(d => d.data.id === hoveredNode);
      if (hoveredNodeData && hoveredNodeData.data.path.length > 0) {
        const tooltipGroup = g.append('g')
          .attr('class', 'tooltip-group')
          .attr('transform', `translate(${hoveredNodeData.x},${hoveredNodeData.y + 25})`);

        const pathText = `路径: [${hoveredNodeData.data.path.join(' → ')}]`;
        const tooltipWidth = pathText.length * 7 + 16;

        tooltipGroup.append('rect')
          .attr('x', -tooltipWidth / 2)
          .attr('y', 0)
          .attr('width', tooltipWidth)
          .attr('height', 22)
          .attr('rx', 4)
          .attr('fill', '#333')
          .attr('opacity', 0.9);

        tooltipGroup.append('text')
          .attr('y', 15)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-size', '10px')
          .text(pathText);
      }
    }

  }, [tree, currentNodeId, visitedNodes, completedNodes, backtrackedNodes, highlightPath, stepType, showAnnotations, dimUnexplored, hoveredNode]);

  return (
    <div className="tree-visualization" ref={containerRef}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

function getAnnotationLabel(stepType: StepType | null | undefined): string {
  switch (stepType) {
    case 'select':
      return '📥 选择';
    case 'backtrack':
      return '↩️ 回溯';
    case 'complete':
      return '✅ 找到排列!';
    default:
      return '👁️ 访问中';
  }
}

function getAnnotationColor(stepType: StepType | null | undefined): string {
  switch (stepType) {
    case 'select':
      return '#4CAF50';
    case 'backtrack':
      return '#FF9800';
    case 'complete':
      return '#9C27B0';
    default:
      return '#2196F3';
  }
}
