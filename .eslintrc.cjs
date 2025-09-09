module.exports = {
  parserOptions: {
    ecmaVersion: 11, // es2020
    sourceType: 'module'
  },

  // To minimize dependencies on Node- or browser-specific features, leave the
  // env empty, and instead define globals as needed.
  env: {},
  extends: ['eslint:recommended', 'google', 'plugin:ava/recommended'],

  // Project-wide globals. If other globals are necessary, prefer putting them
  // in a comment at the top of the file rather than adding them here.
  globals: {
    console: true,
    exports: true,
    module: true,
    require: true
  },
  plugins: ['camelcase-ohm', 'ava'],
  rules: {
    // ----- Exceptions to the configs we extend -----

    'arrow-parens': ['error', 'as-needed'],

    // We follow the old Google style guide here.
    // The default was changed in https://github.com/google/eslint-config-google/pull/23.
    'block-spacing': ['error', 'always'], // google

    'new-cap': ['error', {capIsNew: false}], // google: 'error'
    'no-constant-condition': ['error', {checkLoops: false}], // eslint:recommended: 'error'
    'no-invalid-this': 'off', // google
    'no-redeclare': 'off', // eslint:recommended
    quotes: ['error', 'single', {avoidEscape: true}], // google
    'require-jsdoc': 'off', // google

    // ----- Extra things we enforce in Ohm -----

    // Turn off the regular camelcase rule, and use a custom rule which
    // allows semantic actions to be named like `RuleName_caseName`.
    camelcase: 0,
    'camelcase-ohm/camelcase-ohm': 'error',

    eqeqeq: ['error', 'allow-null'],
    'max-len': ['error', {code: 100, ignoreUrls: true}],
    'max-statements-per-line': ['error', {max: 2}],
    'no-console': 2,
    'no-warning-comments': ['error', {terms: ['xxx', 'fixme']}],
    strict: ['error', 'global'],

    // ------ Prefer newer language features -----

    // Object shorthand is allowed by Google style; we are more opinionated.
    // https://google.github.io/styleguide/jsguide.html#features-objects-method-shorthand
    'object-shorthand': ['error', 'always'],

    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-destructuring': ['error', {object: true, array: false}]
  }
};
