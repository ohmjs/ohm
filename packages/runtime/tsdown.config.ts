import {defineConfig} from 'tsdown';

export default defineConfig({
  entry: {
    index: 'index.ts',
    'src/unstableDebug': 'src/unstableDebug.ts',
  },
  format: 'esm',
  fixedExtension: false,
  dts: true,
  sourcemap: true,
  publint: true,
  attw: {profile: 'esm-only'},
});
