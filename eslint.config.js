import antfu from '@antfu/eslint-config'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'

export default antfu({
  formatter: {
    markdown: 'prettier',
    html: true,
  },
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
  ignores: [
    'node_modules',
    'dist',
    'dev-dist',
    '*.html',
    '.histoire',
  ],
}, {
  files: ['**/*.worker.ts'],
  rules: {
    'no-restricted-globals': 'off',
  },
})
