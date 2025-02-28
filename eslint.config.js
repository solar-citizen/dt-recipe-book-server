import js from '@eslint/js'
import globals from 'globals'
import prettier from 'eslint-config-prettier'
import nodePkg from 'eslint-plugin-node'
import importPlugin from 'eslint-plugin-import'
import tsEsLint from '@typescript-eslint/eslint-plugin'
import tsEslintParser from '@typescript-eslint/parser'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 2024,
      sourceType: 'module',
    },
    plugins: {
      node: nodePkg,
      import: importPlugin,
    },
    rules: {
      // node.js rules
      'node/no-unsupported-features/es-syntax': [
        'error',
        {
          version: '>=14.0.0',
          ignores: [],
        },
      ],
      'node/no-missing-import': 'error',
      'node/no-extraneous-import': 'error',

      // import plugin rules
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
          },
        },
      ],
      // js rules
      'no-console': 'warn',
      'no-unused-vars': 'warn',
    },
  },
  // ts override
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsEslintParser,
    },
    plugins: {
      '@typescript-eslint': tsEsLint,
      node: nodePkg,
      import: importPlugin,
    },
    extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'error',
    },
  },
  prettier,
]
