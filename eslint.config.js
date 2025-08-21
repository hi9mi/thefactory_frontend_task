import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  rules: {
    'node/prefer-global/process': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
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
