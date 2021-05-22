# Ohm Documentation

* [Ohm/JS API Reference](./api-reference.md)
* [Ohm Syntax Reference](./syntax-reference.md)
* Learn more about the [Ohm philosophy](./philosophy.md)
* See [Patterns and Pitfalls](./patterns-and-pitfalls.md) for some common Ohm patterns and solutions to frequently-encountered difficulties.

## Examples

Here are some quick samples of what it's like to work with Ohm. For more in-depth examples, see the [examples directory](../examples/), especially the [math example](../examples/math/index.html) which is extensively commented.

### Matching Strings

Instantiate a grammar from a string using `ohm.grammar()`, and check inputs using the grammar's `match()` method:

<!-- @markscript
  // Replace 'const g' with 'var g' to allow it to redeclared.
  markscript.transformNextBlock(code => code.replace('const g', 'var g'));
-->

```js
const ohm = require('ohm-js');
const g = ohm.grammar(
    'Laugh {' +
    '  laugh = lol | "lmao"' +
    '  lol = "l" "o"+ "l"' +
    '}');
assert(g.match('lol').succeeded());
assert(!g.match('lmao').failed());
assert(g.match('loooooool').succeeded());
```

### Implementing Semantics

You can use _operations_ and _attributes_ to analyze and extract values from parsed data. For example, take the following grammar in `arithmetic.ohm`:

<!-- @markscript
  // Make sure the grammar embedded below is the same as in 'arithmetic.ohm'.
  markscript.transformNextBlock(function(code) {
    assert(code === require('fs').readFileSync('arithmetic.ohm').toString(),
           'arithmetic.ohm does not match grammar in doc');
    return '';  // Don't actually execute anything.
  });
-->

```
Arithmetic {
  Exp
    = AddExp

  AddExp
    = AddExp "+" PriExp  -- plus
    | AddExp "-" PriExp  -- minus
    | PriExp

  PriExp
    = "(" Exp ")"  -- paren
    | number

  number
    = digit+
}
```

We can create an operation named 'eval' to evaluate arithmetic expressions that match the grammar:

<!-- @markscript
  // Replace 'const g' with 'var g' to allow it to redeclared.
  markscript.transformNextBlock(code => code.replace('const g', 'var g'));
-->

```js
// Instantiate the grammar.
const fs = require('fs');
const g = ohm.grammar(fs.readFileSync('arithmetic.ohm'));

// Create an operation that evaluates the expression. An operation always belongs to a Semantics,
// which is a family of related operations and attributes for a particular grammar.
const semantics = g.createSemantics().addOperation('eval', {
  Exp(e) {
    return e.eval();
  },
  AddExp(e) {
    return e.eval();
  },
  AddExp_plus(left, op, right) {
    return left.eval() + right.eval();
  },
  AddExp_minus(left, op, right) {
    return left.eval() - right.eval();
  },
  PriExp(e) {
    return e.eval();
  },
  PriExp_paren(open, exp, close) {
    return exp.eval();
  },
  number(chars) {
    return parseInt(this.sourceString, 10);
  },
});
const match = g.match('1 + (2 - 3) + 4');
assert.equal(semantics(match).eval(), 4);
```

You can learn more about semantics in the [API reference](./api-reference.md#semantics).
