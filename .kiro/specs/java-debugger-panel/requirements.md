# Requirements Document

## Introduction

本功能将左侧的算法概念面板升级为类似 IDE 调试器的 Java 代码面板。该面板将显示真实的 Java 代码实现全排列算法，并提供调试器风格的交互体验，包括单行高亮（与当前算法步骤同步）和内存/变量值的实时显示。

## Glossary

- **JavaCodePanel**: 显示 Java 代码的面板组件，替代现有的 AlgorithmConceptPanel
- **LineHighlight**: 代码行高亮效果，指示当前执行到的代码行
- **MemoryPanel**: 显示当前变量值的子面板，模拟调试器的变量监视窗口
- **StepType**: 算法步骤类型（select、backtrack、complete）
- **Breakpoint**: 断点标记，视觉上标识可暂停的代码行
- **CallStack**: 调用栈显示，展示当前递归深度和调用层次

## Requirements

### Requirement 1

**User Story:** As a learner, I want to see real Java code for the permutation algorithm, so that I can understand how to implement it in a real programming language.

#### Acceptance Criteria

1. WHEN the JavaCodePanel renders THEN the system SHALL display syntactically correct Java code implementing the backtracking permutation algorithm
2. WHEN the Java code is displayed THEN the system SHALL include proper syntax highlighting for keywords, types, strings, and comments
3. WHEN the panel loads THEN the system SHALL display line numbers alongside each line of code
4. WHEN the code is displayed THEN the system SHALL use a monospace font consistent with IDE conventions

### Requirement 2

**User Story:** As a learner, I want the current execution line to be highlighted, so that I can follow along with the algorithm visualization.

#### Acceptance Criteria

1. WHEN the algorithm step changes THEN the system SHALL highlight the corresponding Java code line with a distinct background color
2. WHEN a line is highlighted THEN the system SHALL display a visual indicator (arrow or marker) in the gutter area
3. WHEN the step type is 'select' THEN the system SHALL highlight the lines related to choosing a number and recursive call
4. WHEN the step type is 'backtrack' THEN the system SHALL highlight the line where the number is removed from the path
5. WHEN the step type is 'complete' THEN the system SHALL highlight the lines checking for completion and adding to results
6. WHEN transitioning between steps THEN the system SHALL animate the highlight change with a smooth transition

### Requirement 3

**User Story:** As a learner, I want to see the current values of variables, so that I can understand the algorithm state at each step.

#### Acceptance Criteria

1. WHEN the algorithm is running THEN the system SHALL display a memory panel showing current variable values
2. WHEN the currentPath changes THEN the system SHALL update the path variable display immediately
3. WHEN the available numbers change THEN the system SHALL update the remaining variable display immediately
4. WHEN a permutation is found THEN the system SHALL update the result count in the memory panel
5. WHEN variables change THEN the system SHALL briefly highlight the changed values with a flash animation
6. WHEN displaying arrays THEN the system SHALL format them in Java array notation (e.g., [1, 2, 3])

### Requirement 4

**User Story:** As a learner, I want to see the call stack depth, so that I can understand the recursive nature of the algorithm.

#### Acceptance Criteria

1. WHEN the algorithm recurses THEN the system SHALL display the current recursion depth in the memory panel
2. WHEN displaying call stack THEN the system SHALL show the depth as a number and visual indicator
3. WHEN the depth changes THEN the system SHALL animate the depth indicator change

### Requirement 5

**User Story:** As a learner, I want the code panel to be visually similar to a real IDE debugger, so that the experience feels familiar and professional.

#### Acceptance Criteria

1. WHEN the panel renders THEN the system SHALL use a dark theme consistent with popular IDE debuggers
2. WHEN displaying the gutter THEN the system SHALL include space for line numbers and breakpoint indicators
3. WHEN a line is the current execution point THEN the system SHALL display a yellow arrow indicator in the gutter
4. WHEN hovering over a variable in the code THEN the system SHALL display a tooltip showing its current value
