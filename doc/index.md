# Ohm Documentation

* [Tutorial](./tutorial.md)
* [Reference](./reference.md)

## Examples

### Matching Strings

Instantiate a grammar from a string using `ohm.grammar()`, and check inputs using the grammar's `match()` method:

```js
var ohm = require('ohm');
var g = ohm.grammar([
    'Laugh {',
    '  laugh = lol | "lmao"',
    '  lol = "l" "o"+ "l"',
    '}'].join('\n'));
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
var g = ohm.grammar('G { value = null | 13 | [value] }');
assert(g.match(null).succeeded());
assert(g.match([13]).succeeded());
assert(g.match(['not null or 13']).failed());
```

### Implementing Semantics

You can use _operations_ and _attributes_ to analyze and extract values from parsed data. In this example, we'll parse a simple comma-separated value (CSV) file, like you might be able to download from your bank. Assume we have the following data in `account.csv`:

    Symbol,Quantity,Price,Total Value
    DB900,11,465.207,5117.28
    DB904,2,1566.705,3133.41
    DB905,2,2013.168,4026.34

In `csv.ohm`, we can write a grammar to parse this format:

    CSV {
      csv = line*
      line = ~end (~eol fields)* eol
      fields = ListOf<field, ",">
      field = (~(eol | ",") _)*
      eol = "\r"? "\n" -- char
          | end        -- endOfFile
    }

To parse the file and extract some values from it:

```js
var fs = require('fs');

// Instantiate the grammar and match the contents of the file.
var g = ohm.grammar(fs.readFileSync('csv.ohm').toString());
var match = g.match(fs.readFileSync('account.csv').toString());
assert(match.succeeded());

// Create an operation that returns the value of the last column of each line.
var semantics = g.semantics().addOperation('getLastColumn', {
  line: function(fields, eol) {
    return fields.getLastColumn()[0];
  },
  ListOf_some: function(first, seps, rest) {
	var lastNode = rest.node.lastChild();
    return lastNode.interval.contents;
  },
  _default: ohm.actions.passThrough,
  _many: ohm.actions.makeArray
});
var col = semantics(match).getLastColumn();
assert.deepEqual(col, ['Total Value', '5117.28', '3133.41', '4026.34']);
```