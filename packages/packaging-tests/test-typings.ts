import * as ohm from 'ohm-js';
import {test} from 'uvu';
import * as assert from 'uvu/assert';

const g: ohm.Grammar = ohm.grammar(`
  G {
    Greeting = interjection "," name "!"
    interjection = "Hello" | "Hi" | "Ahoy-hoy"
    name = upper letter+
  }
`);
const s: ohm.Semantics = g.createSemantics().addOperation('getName', {
  Greeting(interj, comma, name, punc) {
    return name.sourceString;
  }
});

test('basic matching', () => {
  const matchResult = g.match('Ahoy-hoy, Alexander!');
  assert.is(s(matchResult)['getName'](), 'Alexander');
});

test('incremental matching', () => {
  const matcher = g.matcher();
  matcher.setInput('foo');
  matcher.replaceInputRange(0, 1, 'g').replaceInputRange(1, 3, 'ah');
  assert.is(matcher.getInput(), 'gah');
  assert.is(matcher.match('Greeting').succeeded(), false);
});

test('pexprs - #390', () => {
  const {interjection, name, any, end} = g.rules;

  if (interjection.body instanceof ohm.pexprs.Alt) {
    assert.instance(interjection.body.terms[0], ohm.pexprs.Terminal);
  } else {
    assert.unreachable('expected an Alt');
  }

  if (name.body instanceof ohm.pexprs.Seq) {
    const plus = name.body.factors[1];
    assert.instance(plus, ohm.pexprs.Iter);
    assert.instance(plus, ohm.pexprs.Plus);
  } else {
    assert.unreachable('expected a Seq');
  }

  assert.is(any.body, ohm.pexprs.any, 'any should be a singleton');
  assert.is(end.body, ohm.pexprs.end, 'end should be a singleton');
});
