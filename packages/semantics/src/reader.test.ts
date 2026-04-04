/* global URL */

import * as ohm from '@ohm-js/compiler/compat';
import {createReader} from 'ohm-js/cstReader';
import test from 'ava';
import {readFileSync} from 'node:fs';

import type {ReaderOperation} from './reader.ts';
import {createReaderOperation} from './reader.ts';

const scriptRel = (relPath: string) => new URL(relPath, import.meta.url);

test('reader-based: arithmetic', t => {
  const g2 = ohm.grammar(readFileSync(scriptRel('../../ohm-js/test/arithmetic.ohm'), 'utf8'));
  g2.match('1+(2*3)').use(r => {
    if (!r.succeeded()) return t.fail('parse failed');
    const rd = createReader(r);

    const evalIt: ReaderOperation<number> = createReaderOperation<number>('evalIt', {
      addExp_plus(h, a, _, b) {
        return evalIt(rd, a) + evalIt(rd, b);
      },
      addExp_minus(h, a, _, b) {
        return evalIt(rd, a) - evalIt(rd, b);
      },
      mulExp_times(h, a, _, b) {
        return evalIt(rd, a) * evalIt(rd, b);
      },
      mulExp_divide(h, a, _, b) {
        return evalIt(rd, a) / evalIt(rd, b);
      },
      priExp_paren(h, _, e, _2) {
        return evalIt(rd, e);
      },
      number(h, _) {
        return parseInt(rd.sourceString(h), 10);
      },
    });
    t.is(evalIt(rd, rd.root), 7);
  });
});

test('reader-based: list and opt', t => {
  const g = ohm.grammar(String.raw`
    G {
      Start = ~end #"a" &(letter "c") ("b"+ letter?)* punc?
      punc = ("!" space?)+
    }
  `);

  g.match('abcbc!!').use(r => {
    if (!r.succeeded()) return t.fail('parse failed');
    const rd = createReader(r);

    const reversed: ReaderOperation<string> = createReaderOperation<string>('reversed', {
      Start(h, a, list, opt) {
        const parts: string[] = [];
        rd.forEachTuple(list, (b, optLetter) => {
          parts.push(reversed(rd, optLetter) + reversed(rd, b));
        });
        return reversed(rd, opt) + parts.reverse().join('') + reversed(rd, a);
      },
      punc(h, list) {
        return reversed(rd, list);
      },
      _list(h) {
        const parts: string[] = [];
        rd.forEachTuple(h, (...children) => {
          let text = '';
          for (const child of children) {
            text += reversed(rd, child);
          }
          parts.push(text);
        });
        return parts.join('');
      },
      _opt(h) {
        if (!rd.isPresent(h)) return '';
        return rd.withChildren(h, (_handle, ...children) => {
          let text = '';
          for (const child of children) {
            text += reversed(rd, child);
          }
          return text;
        });
      },
      _terminal(h) {
        return rd.sourceString(h);
      },
      _default(h) {
        let result = '';
        rd.forEachChild(h, child => {
          result += reversed(rd, child);
        });
        return result;
      },
    });
    t.is(reversed(rd, rd.root), '!!cbcba');
  });
});
