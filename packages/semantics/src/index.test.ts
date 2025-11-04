/* global URL */

import test from 'ava';
import {readFileSync} from 'node:fs';
import * as ohm from '@ohm-js/wasm/compat';
import type {SucceededMatchResult} from '@ohm-js/wasm';

import type {Operation} from './types.ts';
import {createOperation} from './index.ts';

const scriptRel = (relPath: string) => new URL(relPath, import.meta.url);
const g = ohm.grammar(readFileSync(scriptRel('../../ohm-js/test/arithmetic.ohm'), 'utf8'));

test('it basically works', t => {
  const r = g.match('1+(2*3)');
  const evalIt: Operation<number> = createOperation('evalIt', {
    exp(ctx, addExp) {
      return evalIt(addExp);
    },
    addExp_plus(ctx, a, _, b) {
      return evalIt(a) + evalIt(b);
    },
    addExp_minus(ctx, a, _, b) {
      return evalIt(a) - evalIt(b);
    },
    mulExp_times(ctx, a, _, b) {
      return evalIt(a) * evalIt(b);
    },
    mulExp_divide(ctx, a, _, b) {
      return evalIt(a) / evalIt(b);
    },
    priExp_paren(ctx, _, e, _2) {
      return evalIt(e);
    },
    number(ctx, _) {
      return parseInt(ctx.thisNode.sourceString, 10);
    },
  });
  t.assert(r.succeeded());
  t.is(evalIt((r as SucceededMatchResult)._cst), 7);
});
