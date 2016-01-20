# Ohm Extras

Ohm comes with a few extras that are not part of Ohm's core but are related to grammars and semantics created with Ohm.
Here is how you can access those extras:

```js
  var extras = require('ohm-js/extras');
  // use something like extras.toAST(...);
```

In the future, the extras may contain helper methods, semantics and operations that are useful for many grammars but are not always wanted or necessary and would otherwise e.g. pollute the actions of a grammar.

## toAST(matchResult, [mapping])

`toAST()` is a helper method that takes a successful MatchResult and an optional mapping to convert the concrete syntax tree (**CST**) that Ohm creates when parsing input into an abstract syntax tree (**AST**).
To do so, a generic operation is used that can be configure by the optional mapping.

The resulting AST is inspired by the [ECMAScript Tree](https://github.com/estree/estree) format that is the output of popular JavaScript parsers like [acorn](https://github.com/ternjs/acorn) or [esprima](http://esprima.org/).

<a name="example"></a>
**Example:**

```js
  var ohm = require('ohm-js');
  var g = ohm.grammar('G { Equation = AddExpr   AddExpr = number "+" number   number = digit+ }');
  var match = g.match('24 +  6');
  var toAST = require('ohm-js/extras').toAST;
  var ast = toAST(match);
```

will produce an AST like this:

```js
  {
    "type": "AddExpr",  // 'type' automatically taken from the rule name
    "0": "24",          // First part (position 0) matched by AddExpr rule
    "2": "6"            // Third part (position 2) matched by AddExpr rule
  }
```

There are certain general assumptions for the CST-to-AST conversion. They are explained in the following section.

### General Assumptions

Per default:

1. Every node in an AST has a **'type' property** that is derived from the name of the matching rule (those rule names may consist of the original rule name and the case name (see [Inline Rule Declarations](syntax-reference.md#inline-rule-declarations))).
2. If a node's value is a **concrete value**, like the `"+"` in the example above, it will be omitted in the AST (not if there different possibilities though).
3. If a rule only has one child node, it is considered an **intermediate node** that does not add any value and is therefore omitted.
4. Possibly **repetitive** applications (`*` and `+` operator, `ListOf`) are represented as arrays of values, **optional** applications (`?` operator) are represented by their matched value or `null`.

All those defaults can be changed by the optional second parameter - _mapping_ - handed to `toAST()`.

### Configuration Using A Mapping

The _mapping_ parameter is a JavaScript object that consists of key-value pairs where the key is name of the rule (including the case name) that needs a custom translation from CST to AST and it's value one of the possibly values below.

**Customized Example (see [Example](#example)):**

```js
  // create ohm, g, match and toAST
  var ast = toAST(match, {
    Equation: { content: 0 },
    AddExpr: { type: 'Expression', expr1: 0, op: 1, expr2: 2) }
  });
```

results in an AST like:

```js
  {
    "type": "Equation",      // explicitly reintroduced node
    "content": {             // "0" named "content"
      "type": "Expression",  // rename type
      "expr1": "24",         // "0" named "expr1"
      "op": "+",             // explicitly reintroduced value
      "expr2": "6"           // "2" named "expr2"
    }
  }
```

The following mapping options are possible **on the node-level** (values in the key-value map):

* `an object`: A template for a node (see below: possible values _on the property-level_)
* `a number`: Does not create a node for the corresponding rule but forwards to the _number_-th children of the rule (node omission).
* `a function`: A [semantic action](api-reference.md#semantic-actions) for that rule that replaces the general `toAST()` action for this case. To call the default action on a child node, `[child].toAST(this.args.mapping)` can be called.

Additionally, the following mapping options can be use **on the property-level** inside the node templates:

* `a number`: Inserts the children's value return by `toAST()` as this property
* `a string|a boolean|an object|null`: Values that is used as-is for this property
* `a function`: A function similar to a [semantic action](api-reference.md#semantic-actions). Will only have one parameter that is a list of all the CST's child nodes. `[child].toAST(this.args.mapping)` can be called to convert a single child.

**Note:** To use a primitive number as value for a property, the number has to be boxed, e.g. `new Number(12)` or `Object(12)`.
