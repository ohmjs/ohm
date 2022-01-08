import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'index.mjs',
  output: {
    file: 'dist/ohm.esm.js',
    format: 'es'
  },
  plugins: [resolve(), commonjs(), json()]
};
