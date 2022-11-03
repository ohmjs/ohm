import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'index.mjs',
    output: [
      {file: 'dist/ohm.cjs', format: 'cjs', exports: 'default', sourcemap: true},
      {file: 'dist/ohm.js', format: 'umd', name: 'ohm', sourcemap: 'inline'},
    ],
    plugins: [resolve()],
  },
  {
    input: 'extras/index.mjs',
    output: [
      {file: 'dist/ohm-extras.cjs', format: 'cjs', exports: 'named'},
      {file: 'dist/ohm-extras.js', format: 'umd', name: 'ohmExtras'},
    ],
    plugins: [resolve()],
  },
];
