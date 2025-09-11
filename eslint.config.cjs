/* global __dirname */

const {defineConfig, globalIgnores} = require('eslint/config');

const {fixupConfigRules, fixupPluginRules} = require('@eslint/compat');

const camelcaseOhm = require('eslint-plugin-camelcase-ohm');
const ava = require('eslint-plugin-ava');
const js = require('@eslint/js');

const {FlatCompat} = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {},

      globals: {
        console: true,
        exports: true,
        module: true,
        require: true,
      },
    },

    extends: fixupConfigRules(compat.extends('eslint:recommended', 'plugin:ava/recommended')),

    plugins: {
      'camelcase-ohm': camelcaseOhm,
      ava: fixupPluginRules(ava),
    },

    rules: {
      // Rules migrated from eslint-config-google.
      // As of 2025-09-11, that package is not compatible with ESLint 8+, so
      // we just pulled all the relevant rules in here.
      curly: ['error', 'multi-line'],
      'no-caller': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      // 'no-invalid-this': 'error',
      'no-multi-str': 'error',
      'no-new-wrappers': 'error',
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',

      // Stylistic issues
      // Ohm note: virtually everything under "Stylistic issues" is deprecated
      // and moved to @stylistic/eslint-plugin. Others are listed here.
      // no-multi-spaces: 'error'
      camelcase: ['error', {properties: 'never'}],
      // 'new-cap': 'error',
      'no-array-constructor': 'error',
      'no-object-constructor': 'error',
      'one-var': [
        'error',
        {
          var: 'never',
          let: 'never',
          const: 'never',
        },
      ],

      // ECMAScript 6
      // Ohm note: Most rules were moved to @stylistic/eslint-plugin.
      'constructor-super': 'error',
      'no-new-native-nonconstructor': 'error',
      'no-var': 'error',
      // 'prefer-const': ['error', {destructuring: 'all'}],
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      // [end rules migrated]

      'arrow-parens': ['error', 'as-needed'],
      'block-spacing': ['error', 'always'],

      'new-cap': [
        'error',
        {
          capIsNew: false,
        },
      ],

      'no-constant-condition': [
        'error',
        {
          checkLoops: false,
        },
      ],

      'no-invalid-this': 'off',
      'no-redeclare': 'off',

      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],

      'require-jsdoc': 'off',
      // camelcase: 0,
      'camelcase-ohm/camelcase-ohm': 'error',
      eqeqeq: ['error', 'allow-null'],

      'max-len': [
        'error',
        {
          code: 100,
          ignoreUrls: true,
        },
      ],

      'max-statements-per-line': [
        'error',
        {
          max: 2,
        },
      ],

      'no-console': 2,
      'no-unused-vars': [
        'error',
        {
          args: 'none',
        },
      ],
      'no-warning-comments': [
        'error',
        {
          terms: ['xxx', 'fixme'],
        },
      ],

      strict: ['error', 'global'],
      'object-shorthand': ['error', 'always'],
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',

      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: {
            object: true,
            array: false,
          },
        },
      ],
    },
  },
  globalIgnores([
    '**/node_modules/**/*',
    '**/third_party/**/*',
    '**/testdata/**/*',
    '**/test/data/**/*',
    '**/dist/*',
    '**/*.ohm-bundle.*',
    '**/ava-ts.config.js',
    'visualizer/assets/**/*',
    'packages/cli/src/helpers/generateTypes.test.js',
    'packages/wasm/build/**/*',
    'packages/wasm/runtime/**/*',
  ]),
  {
    files: ['examples/nl-datalog-syntax/**'],
    rules: {
      'no-unused-vars': 'off',
    },
  },
]);
