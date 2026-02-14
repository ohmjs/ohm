/* global process, URL */

import {Compiler} from '../src/Compiler.js';
import {Grammar} from 'ohm-js';

const DEBUG = process.env.OHM_DEBUG === '1';

export async function toWasmGrammar(grammar, modBytes = undefined) {
  const compiler = new Compiler(grammar);
  const bytes = modBytes ?? compiler.compile();

  const wasmGrammar = new Grammar();

  let depth = 0;
  let debugImports = {};
  if (DEBUG) {
    debugImports = compiler.getDebugImports((label, ret) => {
      const result = ret === 0 ? 'FAIL' : 'SUCCESS';
      const indented = s => new Array(depth).join('  ') + s;
      const pos = wasmGrammar._instance.exports.pos.value;
      if (label.startsWith('BEGIN')) depth += 1;
      const tail = label.startsWith('END') ? ` -> ${result}` : '';
      // eslint-disable-next-line no-console
      console.log(`pos: ${pos} ${indented(label)}${tail}`);
      if (label.startsWith('END')) depth -= 1;
    });
  }
  return wasmGrammar._instantiate(bytes, debugImports);
}

export function unparse(m) {
  let ans = '';
  function walk(node) {
    if (node.leadingSpaces) {
      ans += node.leadingSpaces.sourceString;
    }
    if (node.isTerminal()) {
      ans += node.sourceString;
    }
    node.children.forEach(c => walk(c));
  }
  walk(m.getCstRoot());
  return ans;
}

export const scriptRel = relPath => new URL(relPath, import.meta.url);

// TODO: Consider refactoring this to return true/false.
export function matchWithInput(g, str) {
  return g.match(str).use(r => (r.succeeded() ? 1 : 0));
}
