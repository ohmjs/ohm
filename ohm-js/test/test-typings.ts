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

test('basic matching', (t) => {
  const matchResult = g.match('Ahoy-hoy, Alexander!');
  t.is(s(matchResult)['getName'](), 'Alexander');
});

test('incremental matching', (t) => {
  const matcher = g.matcher();
  matcher.setInput('foo');
  matcher.replaceInputRange(0, 1, 'g').replaceInputRange(1, 3, 'ah');
  t.is(matcher.getInput(), 'gah');
  t.is(matcher.match('Greeting').succeeded(), false);
});
