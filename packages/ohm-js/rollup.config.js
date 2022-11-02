import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'index.js',
    output: {
      exports: 'default',
      file: 'dist/ohm.cjs',
      format: 'cjs',
      // Help Deno to find the types when the module is loaded from a server.
      // See https://deno.land/manual/typescript/types#using-the-triple-slash-reference-directive
      banner: '/// <reference types="../index.d.ts" />',
    },
    plugins: [resolve(), json()],
  },
  {
    input: 'index.js',
    output: {
      exports: 'default',
      file: 'dist/ohm.cjs',
      format: 'cjs',
      // Help Deno to find the types when the module is loaded from a server.
      // See https://deno.land/manual/typescript/types#using-the-triple-slash-reference-directive
      banner: '/// <reference types="../index.d.ts" />',
    },
    plugins: [resolve(), json()],
  },
];
