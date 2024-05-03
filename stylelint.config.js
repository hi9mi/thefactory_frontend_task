/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
  ],
  rules: {
    'selector-class-pattern': '^[a-zA-Z][a-zA-Z0-9]*((-|--)[a-zA-Z0-9]+)*$',
    'selector-pseudo-class-no-unknown': [true, {
      ignorePseudoClasses: ['global'],
    }],
    'no-empty-source': null,
    'block-no-empty': null,
    'comment-empty-line-before': null,
    'no-descending-specificity': null,
  },
  ignoreFiles: ['node_modules/**/*', 'dist/**/*', 'dev-dist/**/*', '.histoire/**/*'],
}
