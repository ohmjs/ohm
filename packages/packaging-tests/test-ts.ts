import * as ohm from 'ohm-js';
import * as extras from 'ohm-js/extras';
import {test} from 'uvu';
import * as assert from 'uvu/assert';

test('basic functionality from TS', () => {
  const g: ohm.Grammar = ohm.grammar('G { start = "!!?" }');
  const terminalExpr: ohm.Terminal = g.rules.start.body;
  
  const semantics: ohm.Semantics = g.createSemantics().addOperation('getQ', {
    start(t) {
      return t.sourceString[2];
    }
  });

  const matchResult: ohm.MatchResult = g.match('!!?');
  if (matchResult.succeeded()) {
    assert.is(semantics(matchResult).getQ(), '?');
  }
});

test('Main exports (TS)', async () => {
  const {checkExports} = await import('./checkExports.mjs');
  checkExports(ohm);
});

test('Extras exports (TS)', async () => {
//  assert.equal(typeof extras.VisitorFamily, 'function');
  assert.equal(typeof extras.toAST, 'function');
  assert.ok(Object.keys(extras).length === 3);

  const exports = await import('ohm-js/extras');
  assert.equal((exports as any).default, undefined, 'there should be no default export');
});
