/* global URL */

import * as ohm from '@ohm-js/compiler/compat';
import {createReader} from 'ohm-js/cstReader';
import test from 'ava';
import {readFileSync} from 'node:fs';

import type {ReaderOperation} from './reader.ts';
import {collect, createReaderOperation, ifPresent} from './reader.ts';

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
        return (
          ifPresent(
            rd,
            opt,
            p => reversed(rd, p),
            () => ''
          ) +
          collect(rd, list, (b, optLetter) => {
            return (
              ifPresent(
                rd,
                optLetter,
                l => reversed(rd, l),
                () => ''
              ) + collect(rd, b, b => reversed(rd, b)).join('')
            );
          })
            .reverse()
            .join('') +
          reversed(rd, a)
        );
      },
      punc(h, list) {
        return collect(rd, list, (c, opt) => reversed(rd, c)).join('');
      },
      _terminal(h) {
        return rd.sourceString(h);
      },
      _default(h) {
        let result = '';
        rd.forEachChild(h, child => {
          result = reversed(rd, child);
        });
        return result;
      },
    });
    t.is(reversed(rd, rd.root), '!!cbcba');
  });
});
