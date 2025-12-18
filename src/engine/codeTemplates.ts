import { ProgrammingLanguage, LanguageLineMapping, LineVariableMapping, LanguageSyntax } from '../types/languages';

// ============ Java ============
export const JAVA_CODE = `class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        int len = nums.length;
        boolean[] used = new boolean[len];
        Deque<Integer> path = new ArrayDeque<>();
        dfs(nums, len, 0, path, used, res);
        return res;
    }

    void dfs(int[] nums, int len, int depth,
             Deque<Integer> path, boolean[] used,
             List<List<Integer>> res) {
        if (depth == len) {
            res.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < len; i++) {
            if (used[i]) continue;
            path.addLast(nums[i]);
            used[i] = true;
            dfs(nums, len, depth + 1, path, used, res);
            path.removeLast();
            used[i] = false;
        }
    }
}`;

export const JAVA_LINE_MAPPING: LanguageLineMapping = {
  select: [18, 19, 20, 21, 22],
  backtrack: [23, 24],
  complete: [14, 15, 16],
};

export const JAVA_VARIABLE_MAPPING: LineVariableMapping = {
  3: ['res'],
  4: ['len'],
  5: ['used'],
  6: ['path'],
  11: ['depth'],
  14: ['depth', 'len'],
  18: ['i', 'len'],
  19: ['used[i]'],
  20: ['nums[i]'],
  21: ['used[i]'],
};

export const JAVA_SYNTAX: LanguageSyntax = {
  keywords: [
    'public', 'private', 'protected', 'static', 'final', 'void',
    'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break',
    'return', 'new', 'this', 'super', 'class', 'interface', 'extends',
    'implements', 'import', 'package', 'try', 'catch', 'finally',
    'throw', 'throws', 'continue', 'default', 'instanceof'
  ],
  types: [
    'int', 'long', 'short', 'byte', 'float', 'double', 'boolean', 'char',
    'String', 'Integer', 'Long', 'Short', 'Byte', 'Float', 'Double',
    'Boolean', 'Character', 'Object', 'List', 'ArrayList', 'Set',
    'HashSet', 'Map', 'HashMap', 'Arrays', 'Collections', 'Deque', 'ArrayDeque'
  ],
};

export const JAVA_EXECUTION_LINES: Record<string, number> = {
  select: 20,
  backtrack: 23,
  complete: 15,
};


// ============ Python ============
export const PYTHON_CODE = `class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        res = []
        n = len(nums)
        used = [False] * n
        path = []
        
        def dfs(depth: int):
            if depth == n:
                res.append(path[:])
                return
            
            for i in range(n):
                if used[i]:
                    continue
                path.append(nums[i])
                used[i] = True
                dfs(depth + 1)
                path.pop()
                used[i] = False
        
        dfs(0)
        return res`;

export const PYTHON_LINE_MAPPING: LanguageLineMapping = {
  select: [13, 14, 15, 16, 17],
  backtrack: [18, 19],
  complete: [9, 10, 11],
};

export const PYTHON_VARIABLE_MAPPING: LineVariableMapping = {
  3: ['res'],
  4: ['n'],
  5: ['used'],
  6: ['path'],
  8: ['depth'],
  9: ['depth', 'n'],
  13: ['i', 'n'],
  14: ['used[i]'],
  15: ['nums[i]'],
  16: ['used[i]'],
};

export const PYTHON_SYNTAX: LanguageSyntax = {
  keywords: [
    'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'break',
    'continue', 'return', 'pass', 'raise', 'try', 'except', 'finally',
    'with', 'as', 'import', 'from', 'lambda', 'yield', 'global',
    'nonlocal', 'assert', 'and', 'or', 'not', 'in', 'is', 'None',
    'True', 'False', 'self', 'range'
  ],
  types: ['int', 'str', 'float', 'bool', 'list', 'dict', 'set', 'tuple', 'List', 'Dict', 'Set', 'Tuple', 'Optional'],
  builtins: ['len', 'range', 'print', 'append', 'pop', 'extend'],
};

export const PYTHON_EXECUTION_LINES: Record<string, number> = {
  select: 15,
  backtrack: 18,
  complete: 10,
};

// ============ Go ============
export const GOLANG_CODE = `func permute(nums []int) [][]int {
    res := [][]int{}
    n := len(nums)
    used := make([]bool, n)
    path := []int{}
    
    var dfs func(depth int)
    dfs = func(depth int) {
        if depth == n {
            tmp := make([]int, len(path))
            copy(tmp, path)
            res = append(res, tmp)
            return
        }
        
        for i := 0; i < n; i++ {
            if used[i] {
                continue
            }
            path = append(path, nums[i])
            used[i] = true
            dfs(depth + 1)
            path = path[:len(path)-1]
            used[i] = false
        }
    }
    
    dfs(0)
    return res
}`;

export const GOLANG_LINE_MAPPING: LanguageLineMapping = {
  select: [16, 17, 18, 19, 20, 21],
  backtrack: [22, 23],
  complete: [9, 10, 11, 12, 13],
};

export const GOLANG_VARIABLE_MAPPING: LineVariableMapping = {
  2: ['res'],
  3: ['n'],
  4: ['used'],
  5: ['path'],
  8: ['depth'],
  9: ['depth', 'n'],
  16: ['i', 'n'],
  17: ['used[i]'],
  19: ['nums[i]'],
  20: ['used[i]'],
};

export const GOLANG_SYNTAX: LanguageSyntax = {
  keywords: [
    'func', 'var', 'const', 'type', 'struct', 'interface', 'map',
    'chan', 'if', 'else', 'for', 'range', 'switch', 'case', 'default',
    'break', 'continue', 'return', 'go', 'defer', 'select', 'package',
    'import', 'make', 'new', 'len', 'cap', 'append', 'copy', 'delete',
    'nil', 'true', 'false'
  ],
  types: ['int', 'int8', 'int16', 'int32', 'int64', 'uint', 'float32', 'float64', 'bool', 'string', 'byte', 'rune', 'error'],
};

export const GOLANG_EXECUTION_LINES: Record<string, number> = {
  select: 19,
  backtrack: 22,
  complete: 12,
};

// ============ JavaScript ============
export const JAVASCRIPT_CODE = `function permute(nums) {
    const res = [];
    const n = nums.length;
    const used = new Array(n).fill(false);
    const path = [];
    
    function dfs(depth) {
        if (depth === n) {
            res.push([...path]);
            return;
        }
        
        for (let i = 0; i < n; i++) {
            if (used[i]) continue;
            path.push(nums[i]);
            used[i] = true;
            dfs(depth + 1);
            path.pop();
            used[i] = false;
        }
    }
    
    dfs(0);
    return res;
}`;

export const JAVASCRIPT_LINE_MAPPING: LanguageLineMapping = {
  select: [13, 14, 15, 16, 17],
  backtrack: [18, 19],
  complete: [8, 9, 10],
};

export const JAVASCRIPT_VARIABLE_MAPPING: LineVariableMapping = {
  2: ['res'],
  3: ['n'],
  4: ['used'],
  5: ['path'],
  7: ['depth'],
  8: ['depth', 'n'],
  13: ['i', 'n'],
  14: ['used[i]'],
  15: ['nums[i]'],
  16: ['used[i]'],
};

export const JAVASCRIPT_SYNTAX: LanguageSyntax = {
  keywords: [
    'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while',
    'do', 'switch', 'case', 'break', 'continue', 'return', 'throw',
    'try', 'catch', 'finally', 'new', 'this', 'class', 'extends',
    'import', 'export', 'default', 'async', 'await', 'yield',
    'typeof', 'instanceof', 'in', 'of', 'true', 'false', 'null', 'undefined'
  ],
  types: ['Array', 'Object', 'String', 'Number', 'Boolean', 'Map', 'Set', 'Promise'],
  builtins: ['console', 'Math', 'JSON', 'push', 'pop', 'length', 'fill'],
};

export const JAVASCRIPT_EXECUTION_LINES: Record<string, number> = {
  select: 15,
  backtrack: 18,
  complete: 9,
};


// ============ 统一接口 ============
export interface LanguageCodeConfig {
  code: string;
  lineMapping: LanguageLineMapping;
  variableMapping: LineVariableMapping;
  syntax: LanguageSyntax;
  executionLines: Record<string, number>;
}

export function getLanguageCodeConfig(lang: ProgrammingLanguage): LanguageCodeConfig {
  switch (lang) {
    case 'java':
      return {
        code: JAVA_CODE,
        lineMapping: JAVA_LINE_MAPPING,
        variableMapping: JAVA_VARIABLE_MAPPING,
        syntax: JAVA_SYNTAX,
        executionLines: JAVA_EXECUTION_LINES,
      };
    case 'python':
      return {
        code: PYTHON_CODE,
        lineMapping: PYTHON_LINE_MAPPING,
        variableMapping: PYTHON_VARIABLE_MAPPING,
        syntax: PYTHON_SYNTAX,
        executionLines: PYTHON_EXECUTION_LINES,
      };
    case 'golang':
      return {
        code: GOLANG_CODE,
        lineMapping: GOLANG_LINE_MAPPING,
        variableMapping: GOLANG_VARIABLE_MAPPING,
        syntax: GOLANG_SYNTAX,
        executionLines: GOLANG_EXECUTION_LINES,
      };
    case 'javascript':
      return {
        code: JAVASCRIPT_CODE,
        lineMapping: JAVASCRIPT_LINE_MAPPING,
        variableMapping: JAVASCRIPT_VARIABLE_MAPPING,
        syntax: JAVASCRIPT_SYNTAX,
        executionLines: JAVASCRIPT_EXECUTION_LINES,
      };
    default:
      return {
        code: JAVA_CODE,
        lineMapping: JAVA_LINE_MAPPING,
        variableMapping: JAVA_VARIABLE_MAPPING,
        syntax: JAVA_SYNTAX,
        executionLines: JAVA_EXECUTION_LINES,
      };
  }
}
