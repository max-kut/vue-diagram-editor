module.exports = {
  root: true,
  extends: [ 'plugin:vue/recommended' ],
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module",
    ecmaVersion: 2017
  },
  globals: {
    PKG_VERSION: true,
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  settings: {
    'import/resolver': {
      node: null,
      webpack: {
        config: 'build/webpack-configs/base.js',
      },
    },
  },
  rules: {
    'semi': 'error',
    'import/no-named-as-default': 0,
    'unicorn/consistent-function-scoping': 0,
    'vue/attributes-order': 0,
    'vue/no-v-html': 0,
    'no-confusing-arrow': 1,
    'no-console': 1,
    'no-warning-comments': 1,
    'no-undefined': 1,
    'prefer-destructuring': 0,
    'vue/max-attributes-per-line': 0,
    'vue/html-closing-bracket-spacing': 0,
    "vue/no-parsing-error": ["error", {
      "x-invalid-namespace": false
    }],
  },
  overrides: [ {
    files: [ 'src/**' ],
    rules: {
      'unicorn/no-for-loop': 0,
      'unicorn/prefer-includes': 0,
      'unicorn/prefer-node-append': 0,
    },
  } ],
}
