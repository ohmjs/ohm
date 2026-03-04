// Entry point: parses Ohm grammar source into ParsedGrammar objects using
// the WASM-compiled Ohm meta-grammar for parsing, and GrammarDecl for
// building and validation.

import {Grammar} from 'ohm-js';
import type {CstNode} from 'ohm-js';

import {Grammar as ParsedGrammar} from 'ohm-js-legacy/src/Grammar.js';

import BuiltInRules from './built-in-rules.ts';
import {buildGrammars} from './buildGrammar.ts';
import ohmGrammarWasmBytes from '../build/ohm-grammar-wasm.ts';

// Initialize the WASM meta-grammar lazily. This allows the bootstrap script
// to import Compiler.js (which transitively imports this module) without
// requiring a pre-built ohm-grammar-wasm.ts.
let metaGrammar: Grammar;
function getMetaGrammar(): Grammar {
  if (!metaGrammar) {
    if (!ohmGrammarWasmBytes || ohmGrammarWasmBytes.byteLength === 0) {
      throw new Error('No Ohm metagrammar found.');
    }
    metaGrammar = new Grammar(ohmGrammarWasmBytes);
  }
  return metaGrammar;
}

// Ensure ParsedGrammar.BuiltInRules is initialized (may already be set if
// ohm-js-legacy's main entry was imported elsewhere).
if (!(ParsedGrammar as any).BuiltInRules) {
  (ParsedGrammar as any).BuiltInRules = BuiltInRules;
}

export function grammar(source: string): any {
  const ns = grammars(source);
  const values = Object.values(ns);
  return values[values.length - 1];
}

export function grammars(source: string): Record<string, any> {
  const ns: Record<string, any> = {};
  getMetaGrammar()
    .match(source)
    .use((result: any) => {
      if (result.failed()) {
        throw new Error(`Failed to parse grammar:\n${result.message}`);
      }
      buildGrammars(result.getCstRoot() as CstNode, ns, source);
    });
  return ns;
}
