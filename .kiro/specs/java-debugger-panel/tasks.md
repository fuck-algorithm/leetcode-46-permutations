# Implementation Plan

- [x] 1. Create type definitions and Java code data
  - [x] 1.1 Add new type definitions to src/types/index.ts
    - Add `JavaCodeLine`, `CodeToken`, `TokenType` interfaces
    - Add `VariableDisplay`, `JavaCodeMapping` interfaces
    - Add `JAVA_LINE_MAPPING` constant for step-to-line mapping
    - _Requirements: 1.1, 2.1, 2.3, 2.4, 2.5_
  - [x] 1.2 Create Java code tokenizer utility
    - Create `src/engine/javaTokenizer.ts`
    - Implement `tokenizeLine(line: string): CodeToken[]` function
    - Define `JAVA_KEYWORDS` and `JAVA_TYPES` constants
    - Implement syntax highlighting logic for keywords, types, variables, operators
    - _Requirements: 1.2_
  - [x] 1.3 Write property test for tokenizer
    - **Property 1: Syntax Highlighting Consistency**
    - **Validates: Requirements 1.2**

- [x] 2. Implement array formatting utility
  - [x] 2.1 Create formatJavaArray function
    - Add `formatJavaArray(arr: number[]): string` to `src/engine/javaTokenizer.ts`
    - Format arrays as `[1, 2, 3]` notation
    - Handle empty arrays as `[]`
    - _Requirements: 3.6_
  - [x] 2.2 Write property test for array formatting
    - **Property 5: Array Formatting Consistency**
    - **Validates: Requirements 3.6**

- [x] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement MemoryPanel component
  - [x] 4.1 Create MemoryPanel component
    - Create `src/components/MemoryPanel.tsx` and `src/components/MemoryPanel.css`
    - Display variables: path, remaining, result.size(), depth
    - Implement change detection and flash animation for changed values
    - Use dark theme styling consistent with IDE debuggers
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3_
  - [x] 4.2 Write property test for memory panel state
    - **Property 4: Memory Panel State Consistency**
    - **Property 6: Depth Calculation Consistency**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 4.1**

- [x] 5. Implement CodeEditor component
  - [x] 5.1 Create CodeEditor component
    - Create `src/components/CodeEditor.tsx` and `src/components/CodeEditor.css`
    - Render Java code with syntax highlighting using tokenizer
    - Display line numbers in gutter area
    - Implement line highlighting based on current step type
    - Add yellow arrow indicator for current execution line
    - Use dark theme (VS Code/IntelliJ style)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.6, 5.1, 5.2, 5.3_
  - [x] 5.2 Write property tests for CodeEditor
    - **Property 2: Line Number Consistency**
    - **Property 3: Step-to-Line Highlight Mapping**
    - **Validates: Requirements 1.3, 2.1, 2.2, 2.3, 2.4, 2.5**

- [x] 6. Implement JavaDebuggerPanel component
  - [x] 6.1 Create JavaDebuggerPanel component
    - Create `src/components/JavaDebuggerPanel.tsx` and `src/components/JavaDebuggerPanel.css`
    - Compose CodeEditor and MemoryPanel components
    - Implement expand/collapse functionality
    - Add variable hover tooltip functionality
    - _Requirements: 5.4_
  - [x] 6.2 Define Java permutation code constant
    - Add `JAVA_PERMUTATION_CODE` constant with full Java implementation
    - Pre-tokenize code lines for efficient rendering
    - _Requirements: 1.1_

- [x] 7. Integrate JavaDebuggerPanel into App
  - [x] 7.1 Replace AlgorithmConceptPanel with JavaDebuggerPanel
    - Update `src/App.tsx` to use JavaDebuggerPanel
    - Pass required props: currentStepType, currentPath, available, resultCount
    - Remove old AlgorithmConceptPanel import
    - _Requirements: 1.1, 2.1, 3.1_

- [x] 8. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
