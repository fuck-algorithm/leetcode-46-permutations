# Requirements Document

## Introduction

本项目是一个全排列算法（LeetCode 46）的交互式动画演示工具。使用 TypeScript、React 和 D3.js 构建，通过可视化方式展示回溯算法如何生成一个不含重复数字数组的所有排列组合。用户可以输入自定义数组，观看算法执行过程的动画演示，并控制动画播放速度。

## Glossary

- **Permutation_Visualizer**: 全排列算法可视化演示系统
- **Backtracking_Tree**: 回溯算法执行过程中形成的决策树结构
- **Current_Path**: 当前正在构建的排列路径
- **Available_Numbers**: 当前步骤中可供选择的剩余数字
- **Animation_Step**: 算法执行过程中的单个可视化步骤
- **Result_Set**: 已生成的所有完整排列的集合

## Requirements

### Requirement 1

**User Story:** As a user, I want to input a custom array of numbers, so that I can visualize permutations for different inputs.

#### Acceptance Criteria

1. WHEN the user enters numbers in the input field THEN the Permutation_Visualizer SHALL accept an array of 1 to 6 unique integers
2. WHEN the user submits invalid input (duplicate numbers, empty array, or more than 6 numbers) THEN the Permutation_Visualizer SHALL display a clear error message and prevent algorithm execution
3. WHEN the user submits valid input THEN the Permutation_Visualizer SHALL reset any previous visualization state and prepare for new animation

### Requirement 2

**User Story:** As a user, I want to see the backtracking tree structure, so that I can understand how the algorithm explores different paths.

#### Acceptance Criteria

1. WHEN the algorithm executes THEN the Permutation_Visualizer SHALL render a tree structure using D3.js showing all decision branches
2. WHEN a tree node is being visited THEN the Permutation_Visualizer SHALL highlight that node with a distinct visual indicator
3. WHEN the algorithm backtracks THEN the Permutation_Visualizer SHALL visually indicate the backtracking action by changing the node appearance
4. WHEN a complete permutation is found THEN the Permutation_Visualizer SHALL highlight the leaf node as a successful result

### Requirement 3

**User Story:** As a user, I want to see the current path and available numbers, so that I can track the algorithm state at each step.

#### Acceptance Criteria

1. WHILE the animation is running THEN the Permutation_Visualizer SHALL display the Current_Path array showing numbers selected so far
2. WHILE the animation is running THEN the Permutation_Visualizer SHALL display the Available_Numbers showing remaining choices
3. WHEN a number is added to Current_Path THEN the Permutation_Visualizer SHALL animate the transition from Available_Numbers to Current_Path
4. WHEN the algorithm backtracks THEN the Permutation_Visualizer SHALL animate the number returning from Current_Path to Available_Numbers

### Requirement 4

**User Story:** As a user, I want to control the animation playback, so that I can learn at my own pace.

#### Acceptance Criteria

1. WHEN the user clicks the play button THEN the Permutation_Visualizer SHALL start or resume the animation
2. WHEN the user clicks the pause button THEN the Permutation_Visualizer SHALL pause the animation at the current step
3. WHEN the user clicks the step forward button THEN the Permutation_Visualizer SHALL advance exactly one Animation_Step
4. WHEN the user clicks the reset button THEN the Permutation_Visualizer SHALL return to the initial state before animation started
5. WHEN the user adjusts the speed slider THEN the Permutation_Visualizer SHALL modify the animation delay between steps accordingly

### Requirement 5

**User Story:** As a user, I want to see all generated permutations, so that I can verify the algorithm results.

#### Acceptance Criteria

1. WHEN a complete permutation is generated THEN the Permutation_Visualizer SHALL add it to the visible Result_Set display
2. WHEN the animation completes THEN the Permutation_Visualizer SHALL display the total count of permutations found
3. WHEN hovering over a result in Result_Set THEN the Permutation_Visualizer SHALL highlight the corresponding path in the Backtracking_Tree

### Requirement 6

**User Story:** As a user, I want the visualization to be responsive and visually appealing, so that I can have a good learning experience.

#### Acceptance Criteria

1. THE Permutation_Visualizer SHALL render correctly on screen widths from 768 pixels to 1920 pixels
2. THE Permutation_Visualizer SHALL use smooth CSS transitions for all state changes with duration between 200ms and 500ms
3. THE Permutation_Visualizer SHALL use a consistent color scheme to distinguish between unvisited, visiting, visited, and backtracked nodes
