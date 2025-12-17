# Requirements Document

## Introduction

本项目是对现有全排列算法可视化演示工具的增强升级。目标是通过增加更多的指示说明、视觉引导和教学内容，让用户能够直观地理解回溯算法的工作原理。当前版本的动画演示虽然展示了算法执行过程，但缺乏足够的解释性内容，用户难以理解每一步操作的含义和算法的整体逻辑。

## Glossary

- **Animation_Enhancement_System**: 动画增强系统，负责提供额外的视觉指示和教学说明
- **Algorithm_Concept_Panel**: 算法概念面板，展示回溯算法的核心概念和伪代码
- **Step_Annotation**: 步骤标注，在树节点和状态显示上添加的解释性文字
- **Visual_Guide**: 视觉引导，使用箭头、高亮、动画等方式引导用户注意力
- **Decision_Indicator**: 决策指示器，显示当前算法正在做什么决策
- **Progress_Tracker**: 进度追踪器，显示算法执行的整体进度和阶段

## Requirements

### Requirement 1

**User Story:** As a user, I want to see a clear explanation of the backtracking algorithm concept, so that I can understand the fundamental idea before watching the animation.

#### Acceptance Criteria

1. WHEN the page loads THEN the Animation_Enhancement_System SHALL display an Algorithm_Concept_Panel showing the core idea of backtracking in simple terms
2. WHEN the Algorithm_Concept_Panel is displayed THEN the Animation_Enhancement_System SHALL show pseudocode of the permutation algorithm with syntax highlighting
3. WHEN the animation is running THEN the Animation_Enhancement_System SHALL highlight the current line of pseudocode being executed
4. WHEN the user hovers over a pseudocode line THEN the Animation_Enhancement_System SHALL display a tooltip explaining that line in plain language

### Requirement 2

**User Story:** As a user, I want to see clear visual indicators on the tree showing what is happening at each step, so that I can follow the algorithm's decision-making process.

#### Acceptance Criteria

1. WHEN a node is being visited THEN the Animation_Enhancement_System SHALL display a pulsing animation and a label showing "正在访问" near the node
2. WHEN the algorithm selects a number THEN the Animation_Enhancement_System SHALL show an animated arrow from the available numbers to the current path with a label "选择"
3. WHEN the algorithm backtracks THEN the Animation_Enhancement_System SHALL show an animated arrow from the current path back to available numbers with a label "撤销"
4. WHEN a complete permutation is found THEN the Animation_Enhancement_System SHALL display a celebration effect and a label "找到排列!" on the leaf node
5. WHEN the algorithm is exploring a branch THEN the Animation_Enhancement_System SHALL dim the unexplored branches to focus attention on the current path

### Requirement 3

**User Story:** As a user, I want to see a detailed step-by-step explanation panel, so that I can understand exactly what the algorithm is doing and why.

#### Acceptance Criteria

1. WHILE the animation is running THEN the Animation_Enhancement_System SHALL display a Step_Annotation panel with a detailed explanation of the current action
2. WHEN a 'select' step occurs THEN the Step_Annotation SHALL explain why this number was chosen and what alternatives exist
3. WHEN a 'backtrack' step occurs THEN the Step_Annotation SHALL explain why backtracking is necessary and what will happen next
4. WHEN a 'complete' step occurs THEN the Step_Annotation SHALL explain that all positions are filled and this permutation will be recorded
5. WHEN the animation is paused THEN the Step_Annotation SHALL provide additional context about the current state and suggest what to look for

### Requirement 4

**User Story:** As a user, I want to see the relationship between the tree visualization and the current state, so that I can understand how the tree represents the algorithm's exploration.

#### Acceptance Criteria

1. WHEN a node is highlighted in the tree THEN the Animation_Enhancement_System SHALL draw a connecting line to the corresponding state display
2. WHEN the current path changes THEN the Animation_Enhancement_System SHALL highlight the path from root to current node in the tree with a distinct color
3. WHEN hovering over a tree node THEN the Animation_Enhancement_System SHALL display a tooltip showing the path from root to that node
4. WHEN the animation is at a leaf node THEN the Animation_Enhancement_System SHALL visually connect the leaf to the corresponding result in the results panel

### Requirement 5

**User Story:** As a user, I want to see a progress indicator showing where I am in the algorithm execution, so that I can understand the overall scope of the exploration.

#### Acceptance Criteria

1. WHILE the animation is running THEN the Animation_Enhancement_System SHALL display a Progress_Tracker showing the percentage of tree explored
2. WHEN a new permutation is found THEN the Progress_Tracker SHALL update to show "已找到 X/N! 个排列"
3. WHEN the animation completes THEN the Progress_Tracker SHALL display a summary of the total steps taken and permutations found
4. WHEN the user is at any step THEN the Progress_Tracker SHALL show a mini-map of the tree with the current position highlighted

### Requirement 6

**User Story:** As a user, I want to have an interactive tutorial mode, so that I can learn the algorithm step by step with guided explanations.

#### Acceptance Criteria

1. WHEN the user clicks a "教程模式" button THEN the Animation_Enhancement_System SHALL enter a guided tutorial mode
2. WHILE in tutorial mode THEN the Animation_Enhancement_System SHALL pause at key decision points and display educational prompts
3. WHEN at a decision point in tutorial mode THEN the Animation_Enhancement_System SHALL ask the user to predict the next step before revealing it
4. WHEN the user completes the tutorial THEN the Animation_Enhancement_System SHALL display a summary of key concepts learned

### Requirement 7

**User Story:** As a user, I want to see a legend explaining all visual elements, so that I can understand what each color and symbol means.

#### Acceptance Criteria

1. THE Animation_Enhancement_System SHALL display a collapsible legend panel explaining all node colors and their meanings
2. THE Animation_Enhancement_System SHALL display explanations for all arrow types and animation effects used
3. WHEN the user hovers over a legend item THEN the Animation_Enhancement_System SHALL highlight all corresponding elements in the visualization
4. THE Animation_Enhancement_System SHALL use consistent iconography throughout the interface with clear labels

