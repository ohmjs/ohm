import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'index.mjs',
    output: [
      {file: 'dist/ohm.cjs', format: 'cjs', exports: 'default'},
      {file: 'dist/ohm.js', format: 'iife', name: 'ohm'},
    ],
    plugins: [resolve()],
  },
  {
    input: 'extras/index.mjs',
    output: {
      exports: 'named',
      file: 'dist/ohm-extras.cjs',
      format: 'cjs',
    },
    plugins: [resolve()],
  },
];
