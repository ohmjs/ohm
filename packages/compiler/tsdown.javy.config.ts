import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'tsdown';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  entry: {'compiler-javy': 'src/javy-entry.ts'},
  format: 'iife',
  outDir: 'build',
  clean: false,
  sourcemap: false,
  dts: false,
  external: [],
  noExternal: [/.*/],
  inlineOnly: false,
  alias: {
    'ohm-js': resolve(__dirname, 'src/javy-ohm-js-stub.ts'),
  },
  // Polyfill atob — not available in QuickJS but used by base64-encoded
  // Wasm sections. Must run before the IIFE body.
  banner: `
var atob = function(encoded) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var result = '';
  encoded = encoded.replace(/=+$/, '');
  for (var i = 0; i < encoded.length; ) {
    var a = chars.indexOf(encoded[i++]);
    var b = i < encoded.length ? chars.indexOf(encoded[i++]) : 0;
    var c = i < encoded.length ? chars.indexOf(encoded[i++]) : -1;
    var d = i < encoded.length ? chars.indexOf(encoded[i++]) : -1;
    var bits = (a << 18) | (b << 12) | ((c === -1 ? 0 : c) << 6) | (d === -1 ? 0 : d);
    result += String.fromCharCode((bits >> 16) & 0xff);
    if (c !== -1) result += String.fromCharCode((bits >> 8) & 0xff);
    if (d !== -1) result += String.fromCharCode(bits & 0xff);
  }
  return result;
};
`,
});
