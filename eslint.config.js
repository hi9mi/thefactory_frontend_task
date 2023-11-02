import antfu from '@antfu/eslint-config'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'

export default antfu({
  rules: {
    'sort-imports': 'off',
  },
  ignores: [
    'node_modules',
    'dist',
    'dev-dist',
    '*.html',
    '*.md',
    '.histoire',
  ],
}, {
  plugins: {
    eslintPluginSimpleImportSort,
  },
  rules: {
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
  },
}, {
  rules: {
    'node/prefer-global/process': 'off',
  },
})
