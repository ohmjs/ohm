/* global process */

import {WasmMatcher} from '@ohm-js/miniohm-js';
import * as ohm from 'ohm-js';

import {Compiler} from '../src/index.js';
import es5fac from './data/_es5.js';

const DEBUG = process.env.OHM_DEBUG === '1';

export async function wasmMatcherForGrammar(grammar) {
  const compiler = new Compiler(grammar);
  const bytes = compiler.compile();

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

function ES5Matcher(rules) {
  // `rules` is an object with the raw rule bodies.
  // The WasmMatcher constructor requires a grammar object, so we create
  // one and manually add the rules in.
  const g = ohm.grammar('ES5 { start = }');
  for (const key of Object.keys(rules)) {
    g.rules[key] = {
      body: rules[key],
      formals: [],
      description: key,
      primitive: false,
    };
  }
  // Since this is called with `new`, we can't use `await` here.
  return wasmMatcherForGrammar(g);
}

export async function makeEs5Matcher() {
  return es5fac({
    Terminal: ohm.pexprs.Terminal,
    RuleApplication: ohm.pexprs.Apply,
    Sequence: ohm.pexprs.Seq,
    Choice: ohm.pexprs.Alt,
    Repetition: ohm.pexprs.Star,
    Not: ohm.pexprs.Not,
    Range: ohm.pexprs.Range,
    any: ohm.pexprs.any,
    end: ohm.pexprs.end,
    Matcher: ES5Matcher,
  });
}
