/* global URL */

import * as ohm from '@ohm-js/compiler/compat';
import type {CstNode, ListNode, SucceededMatchResult, TerminalNode} from '@ohm-js/compiler';
import test from 'ava';
import {readFileSync} from 'node:fs';
import * as ohmJs from 'ohm-js';

import type {Operation, VisitorCtx} from './types.ts';
import {createOperation} from './index.ts';

const scriptRel = (relPath: string) => new URL(relPath, import.meta.url);
const g = ohm.grammar(readFileSync(scriptRel('../../ohm-js/test/arithmetic.ohm'), 'utf8'));

function assert(condition: boolean, message?: string): asserts condition {
  if (!condition) throw new Error(message ?? 'Assertion failed');
}

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
  if (r.succeeded()) {
    t.is(evalIt(r._cst), 7);
  } else {
    t.fail('parse failed');
  }
});

test('it handles v17 CSTs', t => {
  // The structural differences between v17 and v18 are in the treatment of positive
  // lookahead, optional, and repetition — so test a grammar that uses all of these.
  const g = ohm.grammar(String.raw`
    G {
      Start = ~end #"a" &(letter "c") ("b"+ letter?)* punc?
      punc = ("!" space?)+
    }
  `);

  const reversed: Operation<string> = createOperation('reversed', {
    Start(ctx, a, list, opt) {
      assert(opt.isOptional() && list.isList());
      return (
        opt.ifPresent(
          (p: CstNode) => reversed(p),
          () => ''
        ) +
        list
          .collect((b, optLetter) => {
            assert(b.isList() && optLetter.isOptional());
            return (
              optLetter.ifPresent(
                (l: CstNode) => reversed(l),
                () => ''
              ) + b.collect(b => reversed(b)).join('')
            );
          })
          .reverse()
          .join('') +
        reversed(a)
      );
    },
    punc(ctx, list) {
      assert(list.isList());
      return list
        .collect((c, opt) => {
          assert(opt.isOptional());
          return reversed(c);
        })
        .join('');
    },
    _terminal(ctx) {
      return ctx.thisNode.sourceString;
    },
  });
  const r = g.match('abcbc!!');
  if (r.succeeded()) {
    // t.is(reversed(adaptCstFromMatchResult(r)), '!!cbcba');
    t.is(reversed(r._cst), '!!cbcba');
    // t.pass();
  } else {
    t.fail('parse failed');
  }
});
