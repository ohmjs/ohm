import {writeFileSync} from 'node:fs';
import process from 'node:process';

import {Compiler} from '../src/Compiler.js';
import es5 from '../test/data/_es5.js';

const outFilename = process.argv[2];

if (!outFilename) {
  // eslint-disable-next-line no-console
  console.error('Usage: node es5ToWasm.js <output-file>');
  process.exit(1);
}

const bytes = new Compiler(es5).compile();
writeFileSync(outFilename, bytes);
