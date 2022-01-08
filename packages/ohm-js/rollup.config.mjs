import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'index.mjs',
  output: {
    file: 'dist/ohm.esm.js',
    format: 'es',
    // Help Deno to find the types when the module is loaded from a server.
    // See https://deno.land/manual/typescript/types#using-the-triple-slash-reference-directive
    banner: '/// <reference types="../index.d.ts" />'
  },
  plugins: [resolve(), commonjs(), json()],
};
