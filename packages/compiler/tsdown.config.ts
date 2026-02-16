import {defineConfig} from 'tsdown';

export default defineConfig({
  entry: {
    index: 'index.ts',
    'src/compat': 'src/compat.ts',
    'src/cli': 'src/cli.js',
  },
  format: 'esm',
  fixedExtension: false,
  dts: true,
  sourcemap: true,
  external: ['ohm-js'],
  publint: true,
  attw: {profile: 'esm-only'},
});
