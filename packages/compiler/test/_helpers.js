/* global process, URL */

import {Compiler} from '../src/Compiler.ts';
import {Grammar} from 'ohm-js';
import {grammars as parseGrammars} from '../src/parseGrammars.ts';

const DEBUG = process.env.OHM_DEBUG === '1';

// Compile and load a Wasm grammar from source, using the Wasm metagrammar
// path (no legacy ohm-js). For single-grammar sources.
export async function compileAndLoad(source, compilerOpts = {}) {
  const ns = parseGrammars(source);
  const names = Object.keys(ns);
  const g = ns[names[names.length - 1]];
  return _compileAndInstantiate(g, compilerOpts);
}

// Compile and load all grammars from a multi-grammar source, returning
// a {name: Grammar} map. Uses the Wasm metagrammar path.
export async function compileAndLoadAll(source, compilerOpts = {}) {
  const ns = parseGrammars(source);
  const result = {};
  for (const [name, g] of Object.entries(ns)) {
    result[name] = await _compileAndInstantiate(g, compilerOpts);
  }
  return result;
}

async function _compileAndInstantiate(parsedGrammar, compilerOpts) {
  const compiler = new Compiler(parsedGrammar, compilerOpts);
  const bytes = compiler.compile();

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

// Takes a *legacy* ohm-js Grammar object and compiles it to Wasm.
// Use this only in tests that deliberately compare Wasm vs legacy behavior.
export async function toWasmGrammar(grammar, {modBytes, ...compilerOpts} = {}) {
  const compiler = new Compiler(grammar, compilerOpts);
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

export function unparse(g) {
  const root = g._getCstRoot();
  const input = g._input;
  let ans = '';
  let pos = 0;
  function walk(node) {
    // Emit any gap (spaces) between our current position and this node's start.
    if (node.startIdx > pos) {
      ans += input.slice(pos, node.startIdx);
      pos = node.startIdx;
    }
    if (node.isTerminal()) {
      ans += node.sourceString;
      pos = node.source.endIdx;
    }
    node.children.forEach(c => walk(c));
  }
  walk(root);
  return ans;
}

export const scriptRel = relPath => new URL(relPath, import.meta.url);

// TODO: Consider refactoring this to return true/false.
export function matchWithInput(g, str) {
  return g.match(str).use(r => (r.succeeded() ? 1 : 0));
}
