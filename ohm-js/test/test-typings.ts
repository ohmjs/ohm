import * as ohm from '..';
import * as test from 'tape';

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
  t.equal(s(matchResult)['getName'](), 'Alexander');
  t.end();
});

test('incremental matching', t => {
  const matcher = g.matcher();
  matcher.setInput('foo');
  matcher.replaceInputRange(0, 1, 'g')
         .replaceInputRange(1, 3, 'ah');
  t.equal(matcher.getInput(), 'gah');
  t.equal(matcher.match('Greeting').succeeded(), false);
  t.end();
});
