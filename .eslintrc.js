'use strict';

module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'script'
  },

  // To minimize dependencies on Node- or browser-specific features, leave the
  // env empty, and instead define globals as needed.
  env: {},
  extends: ['google', 'plugin:ava/recommended'],

  // Project-wide globals. If other globals are necessary, prefer putting them
  // in a comment at the top of the file rather than adding them here.
  globals: {
    console: true,
    exports: true,
    module: true,
    require: true
  },
  plugins: ['camelcase-ohm', 'no-extension-in-require', 'ava'],
  rules: {
    // Google style guide allows omitting parentheses for single-parameter arrow functions.
    'arrow-parens': ['error', 'as-needed'],

    // We follow the old Google style guide here.
    // The default was changed in https://github.com/google/eslint-config-google/pull/23.
    'block-spacing': ['error', 'always'],

    // Exception: allow start and end braces to be on the same line.
    'brace-style': ['error', '1tbs', {allowSingleLine: true}],

    // Turn off the regular camelcase rule, and use a custom rule which
    // allows semantic actions to be named like `RuleName_caseName`.
    'camelcase': 0,
    'camelcase-ohm/camelcase-ohm': 2,
    'comma-dangle': ['error', 'never'], // Disallow trailing commas.

    'consistent-this': 0,
    'default-case': 0,

    // Allow use of `==` and `!=` only with null.
    'eqeqeq': ['error', 'allow-null'],

    'guard-for-in': 0,

    'max-len': ['error', {code: 100, ignoreUrls: true}],
    'max-statements-per-line': ['error', {max: 2}],

    // Don't require `new` when calling functions whose name starts with a capital letter.
    'new-cap': ['error', {capIsNew: false}],

    'no-console': 2,
    'no-constant-condition': 0, // Allow things like `while(true)`.
    'no-else-return': 0, // Allow `else` after a return statement.
    'no-eq-null': 0,
    'no-invalid-this': 0, // Allow `this` outside of classes.

    // Don't allow require() statements to include the '.js' extension.
    'no-extension-in-require/main': 2,

    'no-implicit-coercion': 0,
    'no-negated-condition': 0,
    'no-nested-ternary': 0,

    // Allow unused parameters, but not unused variables.
    'no-unused-vars': ['error', {vars: 'all', args: 'none'}],

    'no-warning-comments': ['error', {terms: ['xxx', 'fixme']}],

    // Object shorthand is allowed by Google style; we are more opinionated.
    // https://google.github.io/styleguide/jsguide.html#features-objects-method-shorthand
    'object-shorthand': ['error', 'always'],

    'operator-linebreak': ['error', 'after', {overrides: {':': 'ignore', '?': 'ignore'}}],

    // https://google.github.io/styleguide/jsguide.html#features-functions-arrow-functions
    'prefer-arrow-callback': 2,

    'padded-blocks': 0,
    'quotes': ['error', 'single', 'avoid-escape'],
    'radix': 0,
    'require-jsdoc': 0,

    'strict': ['error', 'global'],

    // We would use `["error", "never", {exceptRange: true}]` here, but it doesn't seem to work.
    'yoda': 0,

    // The following rules suggest replacing certain patterns with ES6 features.
    // They are disabled for now, but we should consider enabling them if/when we move to ES6.
    'prefer-rest-params': 0,
    'prefer-spread': 0
  }
};
