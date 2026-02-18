// Entry point: parses Ohm grammar source into v17 Grammar objects using
// the WASM-compiled Ohm meta-grammar for parsing, and v17's GrammarDecl
// for building and validation.

import {Grammar as WasmGrammar} from 'ohm-js';
import type {CstNode} from 'ohm-js';

import {Grammar} from 'ohm-js-legacy/src/Grammar.js';

import BuiltInRules from './built-in-rules.ts';
import {buildGrammars} from './buildGrammar.ts';
import ohmGrammarWasmBytes from '../build/ohm-grammar-wasm.ts';

// Initialize the WASM meta-grammar synchronously at module load time.
const wasmMetaGrammar = new WasmGrammar(ohmGrammarWasmBytes);

// Ensure Grammar.BuiltInRules is initialized (may already be set if
// ohm-js-legacy's main entry was imported elsewhere).
if (!Grammar.BuiltInRules) {
  Grammar.BuiltInRules = BuiltInRules;
}

export function grammar(source: string): any {
  const ns = grammars(source);
  const values = Object.values(ns);
  return values[values.length - 1];
}

export function grammars(source: string): Record<string, any> {
  const ns: Record<string, any> = {};
  wasmMetaGrammar.match(source).use((result: any) => {
    if (result.failed()) {
      throw new Error(`Failed to parse grammar:\n${result.message}`);
    }
    buildGrammars(result.getCstRoot() as CstNode, ns, source);
  });
  return ns;
}
