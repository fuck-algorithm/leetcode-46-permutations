# Design Document: Java Debugger Panel

## Overview

本设计将现有的 `AlgorithmConceptPanel` 组件替换为一个新的 `JavaDebuggerPanel` 组件，提供类似 IDE 调试器的体验。该组件将显示真实的 Java 代码实现全排列算法，并与算法可视化步骤同步，提供单行高亮和变量监视功能。

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     JavaDebuggerPanel                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   CodeEditor                         │    │
│  │  ┌──────┬────────────────────────────────────────┐  │    │
│  │  │Gutter│           Code Area                     │  │    │
│  │  │ 1 ▶  │ public List<List<Integer>> permute...  │  │    │
│  │  │ 2    │     List<List<Integer>> result = ...   │  │    │
│  │  │ 3    │     backtrack(result, new ArrayList... │  │    │
│  │  │ ...  │ ...                                     │  │    │
│  │  └──────┴────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   MemoryPanel                        │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │ Variables                                    │    │    │
│  │  │  path: [1, 2]                               │    │    │
│  │  │  remaining: [3]                             │    │    │
│  │  │  result.size(): 0                           │    │    │
│  │  │  depth: 2                                   │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### JavaDebuggerPanel (主组件)

```typescript
interface JavaDebuggerPanelProps {
  currentStepType: StepType | null;
  currentPath: number[];
  available: number[];
  resultCount: number;
  isExpanded?: boolean;
}
```

### CodeEditor (代码编辑器子组件)

```typescript
interface CodeEditorProps {
  code: JavaCodeLine[];
  highlightedLines: number[];
  currentExecutionLine: number | null;
  onVariableHover?: (variable: string, value: string) => void;
}

interface JavaCodeLine {
  lineNumber: number;
  content: string;
  tokens: CodeToken[];
  indent: number;
}

interface CodeToken {
  type: 'keyword' | 'type' | 'string' | 'number' | 'comment' | 'variable' | 'method' | 'operator' | 'punctuation' | 'plain';
  value: string;
}
```

### MemoryPanel (内存面板子组件)

```typescript
interface MemoryPanelProps {
  variables: VariableDisplay[];
  depth: number;
  previousVariables?: VariableDisplay[];
}

interface VariableDisplay {
  name: string;
  value: string;
  type: string;
  changed?: boolean;
}
```

### Java 代码到步骤类型映射

```typescript
interface JavaCodeMapping {
  stepType: StepType;
  lineNumbers: number[];
  description: string;
}

// 映射定义
const JAVA_CODE_STEP_MAPPING: JavaCodeMapping[] = [
  { stepType: 'select', lineNumbers: [12, 13, 14], description: '选择数字并递归' },
  { stepType: 'backtrack', lineNumbers: [15], description: '回溯：移除数字' },
  { stepType: 'complete', lineNumbers: [7, 8, 9], description: '找到完整排列' },
];
```

## Data Models

### Java 代码定义

```typescript
const JAVA_PERMUTATION_CODE: string = `
public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(result, new ArrayList<>(), nums);
    return result;
}

void backtrack(List<List<Integer>> result, List<Integer> path, int[] nums) {
    if (path.size() == nums.length) {
        result.add(new ArrayList<>(path));
        return;
    }
    for (int num : nums) {
        if (path.contains(num)) continue;
        path.add(num);
        backtrack(result, path, nums);
        path.remove(path.size() - 1);
    }
}
`;
```

### 语法高亮 Token 类型

```typescript
type TokenType = 'keyword' | 'type' | 'string' | 'number' | 'comment' | 'variable' | 'method' | 'operator' | 'punctuation' | 'plain';

const JAVA_KEYWORDS = ['public', 'void', 'if', 'for', 'return', 'new', 'int', 'continue'];
const JAVA_TYPES = ['List', 'ArrayList', 'Integer'];
```

### 行高亮映射

```typescript
const JAVA_LINE_MAPPING: Record<StepType, number[]> = {
  select: [12, 13, 14],      // for循环选择、添加、递归调用
  backtrack: [15],           // path.remove
  complete: [7, 8, 9],       // if检查、添加结果、return
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Syntax Highlighting Consistency
*For any* Java keyword in the code, the tokenizer SHALL assign it the 'keyword' token type, and *for any* Java type, the tokenizer SHALL assign it the 'type' token type.
**Validates: Requirements 1.2**

### Property 2: Line Number Consistency
*For any* array of code lines with length N, the rendered output SHALL contain exactly N line number elements, numbered 1 through N.
**Validates: Requirements 1.3**

### Property 3: Step-to-Line Highlight Mapping
*For any* step type (select, backtrack, complete), the highlighted line numbers SHALL match the predefined mapping for that step type.
**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

### Property 4: Memory Panel State Consistency
*For any* combination of currentPath, available, and resultCount values, the memory panel SHALL display values that exactly match the input state.
**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

### Property 5: Array Formatting Consistency
*For any* array of integers, the formatJavaArray function SHALL produce a string in the format "[x, y, z]" where elements are comma-separated.
**Validates: Requirements 3.6**

### Property 6: Depth Calculation Consistency
*For any* currentPath array, the displayed recursion depth SHALL equal the length of the currentPath array.
**Validates: Requirements 4.1**

## Error Handling

1. **空状态处理**: 当 `currentStepType` 为 null 时，不高亮任何行，显示初始状态
2. **无效步骤类型**: 如果收到未知的步骤类型，默认不高亮任何行
3. **空数组显示**: 空数组显示为 `[]`
4. **组件折叠状态**: 折叠时保持内部状态，展开时恢复

## Testing Strategy

### Property-Based Testing

使用 `fast-check` 库进行属性测试：

1. **Tokenizer 测试**: 生成随机 Java 代码片段，验证关键字和类型被正确标记
2. **行号测试**: 生成随机长度的代码数组，验证行号数量匹配
3. **映射测试**: 遍历所有步骤类型，验证高亮行号符合预期
4. **内存面板测试**: 生成随机状态组合，验证显示值匹配输入
5. **数组格式化测试**: 生成随机整数数组，验证格式化输出符合 Java 语法

### Unit Tests

1. 验证 Java 代码语法正确性
2. 验证各步骤类型的行高亮映射
3. 验证变量值变化时的 changed 标记
4. 验证组件展开/折叠状态切换

### 测试框架

- 使用 `vitest` 作为测试运行器
- 使用 `fast-check` 进行属性测试
- 测试文件命名: `*.test.ts`
