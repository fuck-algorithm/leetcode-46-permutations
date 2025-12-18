import { CodeToken, JavaCodeLine, StepType } from '../types';
import type { TokenType } from '../types';
import { ProgrammingLanguage, LanguageSyntax } from '../types/languages';
import { getLanguageCodeConfig } from './codeTemplates';

/**
 * 通用代码行分词器
 */
export function tokenizeLine(line: string, syntax: LanguageSyntax): CodeToken[] {
  const tokens: CodeToken[] = [];
  let i = 0;

  while (i < line.length) {
    // 空白字符
    if (/\s/.test(line[i])) {
      let whitespace = '';
      while (i < line.length && /\s/.test(line[i])) {
        whitespace += line[i];
        i++;
      }
      tokens.push({ type: 'plain', value: whitespace });
      continue;
    }

    // 单行注释 (// 或 #)
    if (line.slice(i, i + 2) === '//' || line[i] === '#') {
      tokens.push({ type: 'comment', value: line.slice(i) });
      break;
    }

    // 字符串 (双引号或单引号)
    if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
      const quote = line[i];
      let str = quote;
      i++;
      while (i < line.length && line[i] !== quote) {
        if (line[i] === '\\' && i + 1 < line.length) {
          str += line[i] + line[i + 1];
          i += 2;
        } else {
          str += line[i];
          i++;
        }
      }
      if (i < line.length) {
        str += quote;
        i++;
      }
      tokens.push({ type: 'string', value: str });
      continue;
    }

    // 数字
    if (/\d/.test(line[i])) {
      let num = '';
      while (i < line.length && /[\d.xXa-fA-F]/.test(line[i])) {
        num += line[i];
        i++;
      }
      tokens.push({ type: 'number', value: num });
      continue;
    }

    // 标识符
    if (/[a-zA-Z_]/.test(line[i])) {
      let ident = '';
      while (i < line.length && /[a-zA-Z0-9_]/.test(line[i])) {
        ident += line[i];
        i++;
      }

      let type: TokenType = 'variable';
      if (syntax.keywords.includes(ident)) {
        type = 'keyword';
      } else if (syntax.types.includes(ident)) {
        type = 'type';
      } else if (syntax.builtins?.includes(ident)) {
        type = 'method';
      } else if (i < line.length && line[i] === '(') {
        type = 'method';
      }

      tokens.push({ type, value: ident });
      continue;
    }

    // 操作符
    const operators = [
      ':=', '...', '==', '!=', '<=', '>=', '&&', '||', '++', '--', 
      '+=', '-=', '*=', '/=', '->', '=>', '**', '//', 
      '<', '>', '+', '-', '*', '/', '%', '=', '!', '&', '|', ':', '^'
    ];
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
    if (/[{}()\[\];,.<>@]/.test(line[i])) {
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
 * 计算缩进级别
 */
function getIndentLevel(line: string): number {
  const match = line.match(/^(\s*)/);
  if (!match) return 0;
  const spaces = match[1].length;
  // Python 使用 4 空格，其他语言也用 4
  return Math.floor(spaces / 4);
}


/**
 * 解析代码为 JavaCodeLine 数组（通用格式）
 */
export function parseCode(code: string, lang: ProgrammingLanguage): JavaCodeLine[] {
  const config = getLanguageCodeConfig(lang);
  const lines = code.split('\n');
  return lines.map((content, index) => ({
    lineNumber: index + 1,
    content,
    tokens: tokenizeLine(content, config.syntax),
    indent: getIndentLevel(content),
  }));
}

/**
 * 获取指定语言的代码行
 */
export function getCodeLines(lang: ProgrammingLanguage): JavaCodeLine[] {
  const config = getLanguageCodeConfig(lang);
  return parseCode(config.code, lang);
}

/**
 * 获取指定语言的高亮行
 */
export function getHighlightedLines(lang: ProgrammingLanguage, stepType: StepType | null): number[] {
  if (!stepType) return [];
  const config = getLanguageCodeConfig(lang);
  return config.lineMapping[stepType] || [];
}

/**
 * 获取当前执行行
 */
export function getCurrentExecutionLine(lang: ProgrammingLanguage, stepType: StepType | null): number | null {
  if (!stepType) return null;
  const config = getLanguageCodeConfig(lang);
  return config.executionLines[stepType] ?? null;
}

/**
 * 获取行变量映射
 */
export function getLineVariableMapping(lang: ProgrammingLanguage): Record<number, string[]> {
  const config = getLanguageCodeConfig(lang);
  return config.variableMapping;
}
