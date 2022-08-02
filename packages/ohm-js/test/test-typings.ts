import * as ohm from '..';
import test from 'ava';

const g = ohm.grammar(`
  G {
    Greeting = interjection "," name "!"
    interjection = "Hello" | "Hi" | "Ahoy-hoy"
    name = upper letter+
  }
`);
const s = g.createSemantics().addOperation('getName', {
  Greeting(interj, comma, name, punc) {
    return name.sourceString;
  }
});

test('basic matching', t => {
  const matchResult = g.match('Ahoy-hoy, Alexander!');
  t.is(s(matchResult)['getName'](), 'Alexander');
});

test('incremental matching', t => {
  const matcher = g.matcher();
  matcher.setInput('foo');
  matcher.replaceInputRange(0, 1, 'g').replaceInputRange(1, 3, 'ah');
  t.is(matcher.getInput(), 'gah');
  t.is(matcher.match('Greeting').succeeded(), false);
});

test('pexprs - #390', t => {
  const {interjection, name, any, end} = g.rules;

  if (interjection.body instanceof ohm.pexprs.Alt) {
    t.true(interjection.body.terms[0] instanceof ohm.pexprs.Terminal);
  } else {
    t.fail('expected an Alt');
  }

  if (name.body instanceof ohm.pexprs.Seq) {
    const plus = name.body.factors[1];
    t.true(plus instanceof ohm.pexprs.Iter);
    t.true(plus instanceof ohm.pexprs.Plus);
  } else {
    t.fail('expected a Seq');
  }

  t.true(any.body === ohm.pexprs.any, 'any should be a singleton');
  t.true(end.body === ohm.pexprs.end, 'end should be a singleton');
});
