import js from '@eslint/js'
import ts from '@typescript-eslint/parser'
import globals from 'globals'
import tsEslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import esLintImport from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import jestPlugin from 'eslint-plugin-jest'

const customRules = {
  /* eslint */
  'max-len': ['warn', { code: 120 }],
  /* eslint-plugin-simple-import-sort */
  'simple-import-sort/imports': 'error',
  'simple-import-sort/exports': 'error',
  /* eslint-plugin-import */
  'import/first': 'error',
  'import/newline-after-import': 'error',
  'import/no-duplicates': 'error',
  /* no-unused-vars */
  '@typescript-eslint/no-unused-vars': 'error',
  'no-unused-vars': 'off',
}

const baseConfig = {
  ignores: ['dist'],
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
}

const tsConfig = {
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    parser: ts,
    ecmaVersion: 2020,
    globals: {
      ...globals.browser,
      ...globals.node,
    },
    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: import.meta.dirname,
      sourceType: 'module',
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: {
    'simple-import-sort': simpleImportSort,
    import: esLintImport,
  },
  rules: {
    ...js.configs.recommended.rules,
    ...prettier.rules,
    ...customRules,
    '@typescript-eslint/no-misused-promises': [
      2,
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
  },
}

const jestConfig = /** @type {import('eslint').Linter.FlatConfig} */ {
  files: ['**/*.test.{js,ts}', '**/*.spec.{js,ts}'],
  plugins: {
    jest: jestPlugin,
  },
  languageOptions: {
    globals: {
      ...globals.jest,
    },
  },
  rules: {
    ...jestPlugin.configs.recommended.rules,
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
  },
}

const tsTypeCheckedConfig = tsEslint.configs.strictTypeChecked.map(config => {
  if (config.rules) {
    return {
      ...config,
      files: ['**/*.{ts,tsx}'],
    }
  }
  return config
})

export default [baseConfig, js.configs.recommended, ...tsTypeCheckedConfig, tsConfig, jestConfig]
