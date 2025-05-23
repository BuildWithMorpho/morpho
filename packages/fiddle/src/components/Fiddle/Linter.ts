import { configs as lintConfigs, rules } from '@builder.io/eslint-plugin-morpho';
import { parse } from '@typescript-eslint/typescript-estree';
import { Linter as ESLinter } from 'eslint';

const Linter: typeof ESLinter = require('eslint/lib/linter/linter').Linter;
const linter = new Linter();
const recommendedRules: Record<string, any> = {};
const TS_PARSER = 'morpho-ts-parser';

linter.defineParser(TS_PARSER, {
  parse(code) {
    return parse(code, {
      loc: true,
      range: true,
      jsx: true,
      tokens: true,
      comment: true,
    }) as any;
  },
});

linter.defineRules(rules as any);
Object.entries(lintConfigs.recommended.rules).forEach(([key, value]) => {
  const trimmedKey = key.replace(/^@builder.io\/morpho\//, '');
  recommendedRules[trimmedKey] = value;
});

export function eslint(code: string, version: any) {
  try {
    const markers = linter
      .verify(
        code,
        {
          parser: TS_PARSER,
          rules: {
            ...recommendedRules,
            'no-var-declaration-or-assignment-in-component': 'off',
          },
          parserOptions: {
            sourceType: 'module',
            ecmaVersion: 2020,
            ecmaFeatures: {
              jsx: true,
            },
          },
        },
        {
          filename: 'morpho.lite.tsx',
        },
      )
      .map((err) => ({
        startLineNumber: err.line,
        endLineNumber: err.line,
        startColumn: err.column,
        endColumn: err.column,
        message: `${err.message} (${err.ruleId})`,
        severity: 3,
        source: 'ESLint',
      }));
    return { markers, version };
  } catch (err) {
    // These can generally be ignored - invalid syntax and whatnot
    console.warn('Eslint error', err);
    return null;
  }
}
