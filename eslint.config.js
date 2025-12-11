import antfu from '@antfu/eslint-config'

export default antfu({
  vue: {
    a11y: true,
  },
  formatters: {
    css: true,
    html: true,
    markdown: 'prettier',
  },
  rules: {
    'node/prefer-global/process': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
  },
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
}, {
  files: ['./src/shared/libs/logger/logger.ts'],
  rules: {
    'no-console': 'off',
  },
})
