// 支持的编程语言
export type ProgrammingLanguage = 'java' | 'python' | 'golang' | 'javascript';

// 语言配置
export interface LanguageConfig {
  id: ProgrammingLanguage;
  name: string;
  icon: string;
  fileExtension: string;
  fileName: string;
}

// 语言代码映射 - 每种语言的行号映射到步骤类型
export interface LanguageLineMapping {
  select: number[];
  backtrack: number[];
  complete: number[];
}

// 语言变量映射 - 每行显示哪些变量
export type LineVariableMapping = Record<number, string[]>;

// 语言关键字和类型
export interface LanguageSyntax {
  keywords: string[];
  types: string[];
  builtins?: string[];
}

// 语言配置列表
export const LANGUAGE_CONFIGS: LanguageConfig[] = [
  { id: 'java', name: 'Java', icon: '☕', fileExtension: '.java', fileName: 'Solution.java' },
  { id: 'python', name: 'Python', icon: '🐍', fileExtension: '.py', fileName: 'solution.py' },
  { id: 'golang', name: 'Go', icon: '🐹', fileExtension: '.go', fileName: 'solution.go' },
  { id: 'javascript', name: 'JavaScript', icon: '🟨', fileExtension: '.js', fileName: 'solution.js' },
];

// 获取语言配置
export function getLanguageConfig(lang: ProgrammingLanguage): LanguageConfig {
  return LANGUAGE_CONFIGS.find(c => c.id === lang) || LANGUAGE_CONFIGS[0];
}
