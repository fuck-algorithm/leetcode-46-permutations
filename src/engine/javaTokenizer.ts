import { CodeToken, JavaCodeLine, JAVA_KEYWORDS, JAVA_TYPES, JAVA_PERMUTATION_CODE, StepType } from '../types';
import type { TokenType } from '../types';

/**
 * 将 Java 代码行分词为 Token 数组
 */
export function tokenizeLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let i = 0;

  while (i < line.length) {
    // 跳过空白但保留为 token
    if (/\s/.test(line[i])) {
      let whitespace = '';
      while (i < line.length && /\s/.test(line[i])) {
        whitespace += line[i];
        i++;
      }
      tokens.push({ type: 'plain', value: whitespace });
      continue;
    }

    // 单行注释
    if (line.slice(i, i + 2) === '//') {
      tokens.push({ type: 'comment', value: line.slice(i) });
      break;
    }

    // 字符串
    if (line[i] === '"') {
      let str = '"';
      i++;
      while (i < line.length && line[i] !== '"') {
        if (line[i] === '\\' && i + 1 < line.length) {
          str += line[i] + line[i + 1];
          i += 2;
        } else {
          str += line[i];
          i++;
        }
      }
      if (i < line.length) {
        str += '"';
        i++;
      }
      tokens.push({ type: 'string', value: str });
      continue;
    }

    // 数字
    if (/\d/.test(line[i])) {
      let num = '';
      while (i < line.length && /[\d.]/.test(line[i])) {
        num += line[i];
        i++;
      }
      tokens.push({ type: 'number', value: num });
      continue;
    }

    // 标识符（关键字、类型、变量、方法）
    if (/[a-zA-Z_]/.test(line[i])) {
      let ident = '';
      while (i < line.length && /[a-zA-Z0-9_]/.test(line[i])) {
        ident += line[i];
        i++;
      }

      let type: TokenType = 'variable';
      if (JAVA_KEYWORDS.includes(ident)) {
        type = 'keyword';
      } else if (JAVA_TYPES.includes(ident)) {
        type = 'type';
      } else if (i < line.length && line[i] === '(') {
        type = 'method';
      }

      tokens.push({ type, value: ident });
      continue;
    }

    // 操作符
    const operators = ['==', '!=', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '->', '<', '>', '+', '-', '*', '/', '%', '=', '!', '&', '|', ':'];
    let foundOp = false;
    for (const op of operators) {
      if (line.slice(i, i + op.length) === op) {
        tokens.push({ type: 'operator', value: op });
        i += op.length;
        foundOp = true;
        break;
      }
    }
    if (foundOp) continue;

    // 标点符号
    if (/[{}()\[\];,.<>]/.test(line[i])) {
      tokens.push({ type: 'punctuation', value: line[i] });
      i++;
      continue;
    }

    // 其他字符
    tokens.push({ type: 'plain', value: line[i] });
    i++;
  }

  return tokens;
}

/**
 * 格式化数组为 Java 数组表示法
 */
export function formatJavaArray(arr: number[]): string {
  return `[${arr.join(', ')}]`;
}

/**
 * 计算行的缩进级别
 */
function getIndentLevel(line: string): number {
  const match = line.match(/^(\s*)/);
  return match ? Math.floor(match[1].length / 4) : 0;
}

/**
 * 解析 Java 代码为 JavaCodeLine 数组
 */
export function parseJavaCode(code: string): JavaCodeLine[] {
  const lines = code.split('\n');
  return lines.map((content, index) => ({
    lineNumber: index + 1,
    content,
    tokens: tokenizeLine(content),
    indent: getIndentLevel(content),
  }));
}

/**
 * 获取预解析的 Java 全排列代码
 */
export function getJavaPermutationCode(): JavaCodeLine[] {
  return parseJavaCode(JAVA_PERMUTATION_CODE);
}

/**
 * 根据步骤类型获取当前执行行（单行高亮）
 */
export function getCurrentExecutionLine(stepType: StepType | null): number | null {
  if (!stepType) return null;
  
  const lineMap: Record<string, number> = {
    select: 18,      // path.addLast(nums[i])
    backtrack: 21,   // path.removeLast()
    complete: 14,    // res.add(new ArrayList<>(path))
  };
  
  return lineMap[stepType] ?? null;
}
