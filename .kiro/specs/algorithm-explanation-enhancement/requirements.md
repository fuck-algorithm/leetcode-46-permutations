# Requirements Document

## Introduction

本项目旨在增强全排列算法可视化演示工具，参考 LeetCode 题解（liweiwei1419）的讲解方式，添加更深入的算法概念解释功能。核心目标是帮助用户理解回溯算法的"选择-探索-撤销"模式、used 数组的作用、以及递归调用栈的变化过程。

## Glossary

- **Algorithm_Explainer**: 算法解释增强系统
- **Used_Array**: 标记数组，记录每个数字是否已被选择到当前路径中
- **Recursion_Stack**: 递归调用栈，展示当前递归深度和每层的状态
- **Choice_Pattern**: "选择-探索-撤销"模式，回溯算法的核心操作流程
- **Pruning_Indicator**: 剪枝指示器，展示哪些分支被跳过及原因
- **Algorithm_Pseudocode**: 算法伪代码，与当前执行步骤同步高亮

## Requirements

### Requirement 1

**User Story:** As a user, I want to see the used array visualization, so that I can understand how the algorithm tracks which numbers have been selected.

#### Acceptance Criteria

1. WHILE the animation is running THEN the Algorithm_Explainer SHALL display a Used_Array showing true/false status for each input number
2. WHEN a number is selected into the current path THEN the Algorithm_Explainer SHALL animate the corresponding Used_Array element changing from false to true
3. WHEN the algorithm backtracks THEN the Algorithm_Explainer SHALL animate the corresponding Used_Array element changing from true to false
4. THE Algorithm_Explainer SHALL display the Used_Array with visual distinction between used (true) and unused (false) states

### Requirement 2

**User Story:** As a user, I want to see the recursion call stack, so that I can understand the depth and state of recursive calls.

#### Acceptance Criteria

1. WHILE the animation is running THEN the Algorithm_Explainer SHALL display a Recursion_Stack showing all active recursive call frames
2. WHEN a new recursive call is made (select step) THEN the Algorithm_Explainer SHALL push a new frame onto the Recursion_Stack display
3. WHEN the algorithm backtracks THEN the Algorithm_Explainer SHALL pop the top frame from the Recursion_Stack display
4. WHEN displaying each stack frame THEN the Algorithm_Explainer SHALL show the current depth level and the path state at that level

### Requirement 3

**User Story:** As a user, I want to see the "choose-explore-unchoose" pattern highlighted, so that I can understand the core backtracking operation.

#### Acceptance Criteria

1. WHEN a select step occurs THEN the Algorithm_Explainer SHALL display "选择" (Choose) phase indicator with the selected number
2. WHEN exploring child branches THEN the Algorithm_Explainer SHALL display "探索" (Explore) phase indicator
3. WHEN a backtrack step occurs THEN the Algorithm_Explainer SHALL display "撤销" (Unchoose) phase indicator with the removed number
4. THE Algorithm_Explainer SHALL use distinct colors for each phase of the Choice_Pattern

### Requirement 4

**User Story:** As a user, I want to see synchronized pseudocode highlighting, so that I can connect the visualization to the actual algorithm code.

#### Acceptance Criteria

1. THE Algorithm_Explainer SHALL display Algorithm_Pseudocode for the backtracking algorithm in a code panel
2. WHEN a select step occurs THEN the Algorithm_Explainer SHALL highlight the "选择" code line in the pseudocode
3. WHEN a recursive call is made THEN the Algorithm_Explainer SHALL highlight the "递归" code line in the pseudocode
4. WHEN a backtrack step occurs THEN the Algorithm_Explainer SHALL highlight the "撤销" code line in the pseudocode
5. WHEN a complete permutation is found THEN the Algorithm_Explainer SHALL highlight the "添加结果" code line in the pseudocode

### Requirement 5

**User Story:** As a user, I want to see why certain branches are not explored, so that I can understand the pruning logic.

#### Acceptance Criteria

1. WHEN the algorithm skips a number because it is already used THEN the Algorithm_Explainer SHALL display a Pruning_Indicator explaining the skip reason
2. WHEN hovering over an unexplored branch in the tree THEN the Algorithm_Explainer SHALL show a tooltip explaining why that branch was pruned
3. THE Algorithm_Explainer SHALL visually distinguish pruned branches from unexplored branches in the tree visualization

</content>
</invoke>