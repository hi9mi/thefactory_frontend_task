/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
  ],
  rules: {
    'selector-class-pattern': '^[a-z][a-zA-Z0-9]+$',
  },
  ignoreFiles: ['node_modules/**/*', 'dist/**/*', 'dev-dist/**/*', '.histoire/**/*'],
}
