/**
 * Cross-implementation CST shape equality tests.
 *
 * Ensures that ohm-js/v18 produces the same CST shape as the wasm
 * implementation for a representative set of grammars and inputs.
 */

import test from 'ava';
import {readFileSync} from 'node:fs';
import * as ohm from 'ohm-js';
import {grammar as v18Grammar, grammars as v18Grammars} from 'ohm-js/v18';

import {matchWithInput, scriptRel, toWasmGrammar} from './_helpers.js';

// --- Serializer: reduces a CST node to a plain JSON "shape" ---

function serializeCst(node) {
  const base = {
    ctorName: node.ctorName,
    matchLength: node.matchLength,
    sourceString: node.sourceString,
  };

  if (node.source && typeof node.source.startIdx === 'number') {
    base.interval = {startIdx: node.source.startIdx, endIdx: node.source.endIdx};
  }

  if (node.isTerminal()) base.kind = 'terminal';
  else if (node.isNonterminal()) base.kind = 'nonterminal';
  else if (node.isList()) base.kind = 'list';
  else if (node.isOptional()) base.kind = 'opt';
  else if (node.isSeq()) base.kind = 'seq';
  else base.kind = 'other';

  if (node.isOptional()) {
    base.present = node.isPresent();
    base.empty = node.isEmpty();
  }

  if (node.isNonterminal()) {
    base.syntactic = node.isSyntactic();
    base.lexical = node.isLexical();
  }

  base.children = (node.children ?? []).map(serializeCst);
  return base;
}

// --- Tests ---

const arithmeticSrc = readFileSync(scriptRel('../../ohm-js/test/data/arithmetic.ohm'), 'utf8');

test.failing('compat: arithmetic', async t => {
  const wasmG = await toWasmGrammar(ohm.grammar(arithmeticSrc));
  const v18G = v18Grammar(arithmeticSrc);

  for (const input of ['1', '10 + 20', '1+276*(3+4)', '(10+ 999)- 1 +222']) {
    matchWithInput(wasmG, input);
    const wasmShape = serializeCst(wasmG.getCstRoot());
    const v18Shape = serializeCst(v18G.match(input).getCstRoot());
    t.deepEqual(v18Shape, wasmShape);
  }
});

const liquidHtmlSrc = readFileSync(scriptRel('data/liquid-html.ohm'), 'utf8');

test.failing('compat: liquid-html', async t => {
  const wasmG = await toWasmGrammar(ohm.grammars(liquidHtmlSrc).LiquidHTML);
  const v18G = v18Grammars(liquidHtmlSrc).LiquidHTML;

  const inputs = [
    '<b>hi</b>',
    "{% assign year = page.started | date: '%Y' %}",
    readFileSync(scriptRel('data/book-review.liquid'), 'utf8'),
  ];
  for (const input of inputs) {
    matchWithInput(wasmG, input);
    const wasmShape = serializeCst(wasmG.getCstRoot());
    const v18Shape = serializeCst(v18G.match(input).getCstRoot());
    t.deepEqual(v18Shape, wasmShape);
  }
});
