import {writeFileSync} from 'node:fs';
import process from 'node:process';

import {grammar as es5} from '../../../examples/ecmascript/index.js';
import {Compiler} from '../src/Compiler.js';

const outFilename = process.argv[2];

if (!outFilename) {
  // eslint-disable-next-line no-console
  console.error('Usage: node es5ToWasm.js <output-file>');
  process.exit(1);
}

const bytes = new Compiler(es5).compile();
writeFileSync(outFilename, bytes);
