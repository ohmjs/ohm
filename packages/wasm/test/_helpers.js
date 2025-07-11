/* global process */

import {WasmMatcher} from '@ohm-js/miniohm-js';

import {Compiler} from '../src/index.js';

const DEBUG = process.env.OHM_DEBUG === '1';

export async function wasmMatcherForGrammar(grammar, modBytes = undefined) {
  const compiler = new Compiler(grammar);
  const bytes = modBytes ?? compiler.compile();

  const m = new WasmMatcher();

  // eslint-disable-next-line no-unused-vars, prefer-const
  let depth = 0;
  let debugImports = {};
  if (DEBUG) {
    debugImports = compiler.getDebugImports((label, ret) => {
      const result = ret === 0 ? 'FAIL' : 'SUCCESS';
      const indented = s => new Array(depth).join('  ') + s;
      const pos = m._instance.exports.pos.value;
      if (label.startsWith('BEGIN')) depth += 1;
      const tail = label.startsWith('END') ? ` -> ${result}` : '';
      // eslint-disable-next-line no-console
      console.log(`pos: ${pos} ${indented(label)}${tail}`);
      if (label.startsWith('END')) depth -= 1;
    });
  }
  return m._instantiate(bytes, debugImports);
}
