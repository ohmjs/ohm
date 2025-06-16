import {WasmMatcher} from '@ohm-js/miniohm-js';

import {Compiler} from '../src/index.js';

export async function wasmMatcherForGrammar(grammar) {
  const compiler = new Compiler(grammar);
  const bytes = compiler.compile();

  const m = new WasmMatcher();

  // let depth = 0;
  const debugImports = compiler.getDebugImports((label, ret) => {
    // const result = ret === 0 ? 'FAIL' : 'SUCCESS';
    // const indented = s => new Array(depth).join('  ') + s;
    // const pos = m._instance.exports.pos.value;
    // if (label.startsWith('BEGIN')) depth += 1;
    // const tail = label.startsWith('END') ? ` -> ${result}` : '';
    // console.log(`pos: ${pos} ${indented(label)}${tail}`);
    // if (label.startsWith('END')) depth -= 1;
  });
  return m._instantiate(bytes, debugImports);
}
