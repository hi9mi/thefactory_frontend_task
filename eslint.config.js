import antfu from '@antfu/eslint-config'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'

export default antfu({
  ignores: [
    'node_modules',
    'dist',
    'dev-dist',
    '*.html',
    '*.md',
  ],
}, {
  plugins: {
    eslintPluginSimpleImportSort,
  },
  rules: {
    'eslintPluginSimpleImportSort/imports': ['error', {
      groups: [
        [
          '^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks|node:)(.*|$)',
        ],
        ['(^vue)(.*|$)', '^@?\\w'],
        ['^(@tf-app)(.*|$)'],
        ['^\\u0000'],
        ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
        ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ['^.+\\.s?css$'],
      ],
    }],
    'eslintPluginSimpleImportSort/exports': 'error',
  },
}, {
  rules: {
    'node/prefer-global/process': 'off',
  },
})
