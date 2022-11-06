import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.rollup.js',
  output: {
    file: 'dist/main-rollup.js',
    format: 'iife'
  },
  plugins: [resolve({ modulesOnly: true })],
};
