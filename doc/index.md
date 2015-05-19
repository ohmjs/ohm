# Ohm Documentation

* [Tutorial](./tutorial.md)
* [Reference](./reference.md)

## Examples

### Matching Strings

Instantiate a grammar from a string using `ohm.grammar()`, and check inputs using the grammar's `match()` method:

```js
var ohm = require('ohm');
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
var g = ohm.grammar('Named { named = { name: _, ... } }');
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
var fs = require('fs');

// Instantiate the grammar.
var g = ohm.grammar(fs.readFileSync('arithmetic.ohm').toString());

// Create an operation that evaluates the expression.
var semantics = g.semantics().addOperation('eval', {
  AddExp_plus: function(left, op, right) {
    return left.eval() + right.eval();
  },
  AddExp_minus: function(left, op, right) {
    return left.eval() - right.eval();
  },
  PriExp_paren: function(open, exp, close) {
    return exp.eval();
  },
  number: function(chars) {
    return parseInt(this.interval.contents, 10);
  },
  _default: ohm.actions.passThrough
});
var match = g.match('1 + (2 - 3) + 4');
assert.equal(semantics(match).eval(), 4);
```

### TODO

* Should we say something about the methods of the "action dictionary", e.g., what their arguments are, that each of them must have the correct arity, etc.?
* I'm afraid the use of `ohm.actions.passThrough` will be confusing here. Consider starting without it, then showing that we can avoid writing a bunch of the methods in the action dictionary if you use `_default` and `ohm.actions.passThrough`.
* It's OK to explain "semantics" later, but we may want to say something about it here so that the call to `semantics()` doesn't seem so mysterious.
