/* global URL */

import * as ohm from '@ohm-js/compiler/compat';
import test from 'ava';
import {readFileSync} from 'node:fs';

import type {CstViewOperation} from './cstViewOps.ts';
import {createCstViewOperation} from './cstViewOps.ts';
import type {ReaderOperation} from './reader.ts';
import {createReaderOperation} from './reader.ts';

const scriptRel = (relPath: string) => new URL(relPath, import.meta.url);

test('cstView-based: arithmetic', t => {
  const g2 = ohm.grammar(readFileSync(scriptRel('../../ohm-js/test/arithmetic.ohm'), 'utf8'));
  g2.match('1+(2*3)').use(r => {
    if (!r.succeeded()) return t.fail('parse failed');
    const cst = r.cstView();

    const evalIt: CstViewOperation<number> = createCstViewOperation<number>('evalIt', {
      addExp_plus(h, a, _, b) {
        return evalIt(cst, a) + evalIt(cst, b);
      },
      addExp_minus(h, a, _, b) {
        return evalIt(cst, a) - evalIt(cst, b);
      },
      mulExp_times(h, a, _, b) {
        return evalIt(cst, a) * evalIt(cst, b);
      },
      mulExp_divide(h, a, _, b) {
        return evalIt(cst, a) / evalIt(cst, b);
      },
      priExp_paren(h, _, e, _2) {
        return evalIt(cst, e);
      },
      number(h, _) {
        return parseInt(cst.sourceString(h), 10);
      },
    });
    t.is(evalIt(cst, cst.root), 7);
  });
});

test('reader compatibility exports still work', t => {
  const g2 = ohm.grammar(readFileSync(scriptRel('../../ohm-js/test/arithmetic.ohm'), 'utf8'));
  g2.match('1+(2*3)').use(r => {
    if (!r.succeeded()) return t.fail('parse failed');
    const cst = r.cstView();

    const evalIt: ReaderOperation<number> = createReaderOperation<number>('evalIt', {
      addExp_plus(h, a, _, b) {
        return evalIt(cst, a) + evalIt(cst, b);
      },
      addExp_minus(h, a, _, b) {
        return evalIt(cst, a) - evalIt(cst, b);
      },
      mulExp_times(h, a, _, b) {
        return evalIt(cst, a) * evalIt(cst, b);
      },
      mulExp_divide(h, a, _, b) {
        return evalIt(cst, a) / evalIt(cst, b);
      },
      priExp_paren(h, _, e, _2) {
        return evalIt(cst, e);
      },
      number(h, _) {
        return parseInt(cst.sourceString(h), 10);
      },
    });

    t.is(createReaderOperation, createCstViewOperation);
    t.is(evalIt(cst, cst.root), 7);
  });
});

test('cstView-based: list and opt', t => {
  const g = ohm.grammar(String.raw`
    G {
      Start = ~end #"a" &(letter "c") ("b"+ letter?)* punc?
      punc = ("!" space?)+
    }
  `);

  g.match('abcbc!!').use(r => {
    if (!r.succeeded()) return t.fail('parse failed');
    const cst = r.cstView();

    const reversed: CstViewOperation<string> = createCstViewOperation<string>('reversed', {
      Start(h, a, list, opt) {
        const parts: string[] = [];
        cst.forEachTuple(list, (b, optLetter) => {
          parts.push(reversed(cst, optLetter) + reversed(cst, b));
        });
        return reversed(cst, opt) + parts.reverse().join('') + reversed(cst, a);
      },
      punc(h, list) {
        return reversed(cst, list);
      },
      _list(h) {
        const parts: string[] = [];
        cst.forEachTuple(h, (...children) => {
          let text = '';
          for (const child of children) {
            text += reversed(cst, child);
          }
          parts.push(text);
        });
        return parts.join('');
      },
      _opt(h) {
        if (!cst.isPresent(h)) return '';
        return cst.withChildren(h, (_handle, ...children) => {
          let text = '';
          for (const child of children) {
            text += reversed(cst, child);
          }
          return text;
        });
      },
      _terminal(h) {
        return cst.sourceString(h);
      },
      _default(h) {
        let result = '';
        cst.forEachChild(h, child => {
          result += reversed(cst, child);
        });
        return result;
      },
    });
    t.is(reversed(cst, cst.root), '!!cbcba');
  });
});
