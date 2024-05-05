import antfu from '@antfu/eslint-config'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'

export default antfu({
  vue: true,
  plugins: {
    eslintPluginSimpleImportSort,
  },
  rules: {
    'sort-imports': 'off',
    'eslintPluginSimpleImportSort/imports': ['error', {
      groups: [
        ['^\\u0000'],
        ['^node:'],
        ['(^vue)(.*|$)', '^@?\\w'],
        ['^(@tf-app)(.*|$)'],
        ['^\\.'],
      ],
    }],
    'eslintPluginSimpleImportSort/exports': 'error',
    'node/prefer-global/process': 'off',
  },
  formatters: true,
  ignores: [
    'node_modules',
    'dist',
    'dev-dist',
    '.histoire',
    'coverage',
  ],
}, {
  files: ['**/*.worker.ts'],
  rules: {
    'no-restricted-globals': 'off',
  },
})
