# Ohm Documentation

* There's no tutorial yet, but the [math example](../examples/math/index.html) is extensively commented and is probably the best place to start.
* [Ohm/JS API Reference](./api-reference.md)
* [Ohm Syntax Reference](./syntax-reference.md)
* Learn more about the [Ohm philosophy](./philosophy.md)

## Examples

Here are some quick samples of what it's like to work with Ohm. For more in-depth examples, see the [examples directory](../examples/).

### Matching Strings

Instantiate a grammar from a string using `ohm.grammar()`, and check inputs using the grammar's `match()` method:

```js
var ohm = require('ohm-js');
var g = ohm.grammar(
    'Laugh {' +
    '  laugh = lol | "lmao"' +
    '  lol = "l" "o"+ "l"' +
    '}');
assert(g.match('lol').succeeded());
assert(!g.match('lmao').failed());
assert(g.match('loooooool').succeeded());
```

### Matching Objects

You can match against arbitrary objects (not just strings):

```js
var g = ohm.grammar('Named { named = { name: any, ... } }');
assert(g.match({name: 'Manuel', age: 29}).succeeded());
assert(g.match({}).failed());
```

Arrays, numbers, and `null` are all valid patterns:

```js
var g = ohm.grammar('G { start = [13 null] }');
assert(g.match([13, null]).succeeded());
```

### Implementing Semantics

You can use _operations_ and _attributes_ to analyze and extract values from parsed data. For example, take the following grammar in `arithmetic.ohm`:

<script type="text/markscript">
  var fs = require('fs');
  // Make sure the grammar embedded below is the same as in 'arithmetic.ohm'.
  markscript.transformNextBlock(function(code) {
    assert(code === fs.readFileSync('arithmetic.ohm').toString(),
           'arithmetic.ohm does not match grammar in doc');
    return '';  // Don't actually execute anything.
  });
</script>

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

```js
// Instantiate the grammar.
var fs = require('fs');
var g = ohm.grammar(fs.readFileSync('arithmetic.ohm'));

// Create an operation that evaluates the expression. An operation always belongs to a Semantics,
// which is a family of related operations and attributes for a particular grammar.
var semantics = g.semantics().addOperation('eval', {
  Exp: function(e) {
    return e.eval();
  },
  AddExp: function(e) {
    return e.eval();
  },
  AddExp_plus: function(left, op, right) {
    return left.eval() + right.eval();
  },
  AddExp_minus: function(left, op, right) {
    return left.eval() - right.eval();
  },
  PriExp: function(e) {
    return e.eval();
  },
  PriExp_paren: function(open, exp, close) {
    return exp.eval();
  },
  number: function(chars) {
    return parseInt(this.interval.contents, 10);
  },
});
var match = g.match('1 + (2 - 3) + 4');
assert.equal(semantics(match).eval(), 4);
```

You can learn more about semantics in the [API reference](./api-reference.md#semantics).
