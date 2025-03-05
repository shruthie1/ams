/* eslint-disable prettier/prettier */
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

// Resolve the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper for relative project paths
const projectRootDir = path.resolve(__dirname, './'); // Adjust as per your project's directory structure

// FlatCompat for extending older ESLint configs in a modern format
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/.eslint.config.mjs'],
  },
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslintEslintPlugin,
    },
    settings: {
      'import/resolver': {
        node: {
          moduleDirectory: ['node_modules', 'src'],
        },
      },
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        project: path.join(projectRootDir, 'tsconfig.json'),
        tsconfigRootDir: projectRootDir,
      },
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
