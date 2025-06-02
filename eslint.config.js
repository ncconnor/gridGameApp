// eslint.config.js
const js = require('@eslint/js');
const globals = require('globals');
const tsEslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

function cleanGlobals(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => key.trim() === key)
  );
}

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js', '.env', 'coverage/**', 'tests/**'],
  },
  {
    files: ['**/*.js'],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.node,
        ...cleanGlobals(globals.browser)
      }
    }
  },
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tsEslint
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    rules: {
      ...tsEslint.configs['recommended-type-checked'].rules,
      ...tsEslint.configs['stylistic-type-checked'].rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-floating-promises': 'error'
    }
  }
];