import ohm from '..';

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

const matchResult = g.match('Ahoy-hoy, Alexander!');
console.log(s(matchResult).getName());

const matcher = g.matcher();
matcher.setInput('foo');
matcher.replaceInputRange(0, 1, 'g')
       .replaceInputRange(2, 4, 'ah');
if (matcher.match('Greeting').succeeded()) {
  console.log('input:', matcher.getInput());
}
