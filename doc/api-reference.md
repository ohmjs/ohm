# API Reference

This page documents the API of Ohm/JS, a JavaScript library for working with grammars written in the Ohm language. For documentation on the Ohm language, see the [syntax reference](./syntax-reference.md).

## Instantiating Grammars

**NOTE:** For grammars defined in a JavaScript string literal (i.e., not in a separate .ohm file), it's recommended to use a [template literal with the String.raw tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw).

```ts
ohm.grammar(source: string, optNamespace?: object): Grammar
```

Instantiate the Grammar defined by `source`. If specified, `optNamespace` is an object in which references to other grammars should be resolved. For example, if the grammar source begins with an inheritance declaration like `MyGrammar <: OtherGrammar { ... }`, then `optNamespace` should have a property named `OtherGrammar`.

```ts
ohm.grammars(source: string, optNamespace?: object): object
```

Create a new object containing Grammar instances for all of the grammars defined in `source`. As with `ohm.grammar`, if `optNamespace` is specified, it is an object in which references to other grammars should be resolved. Additionally, it will be the prototype of the returned object.

Here is an example of instantiating a Grammar:

<!-- @markscript
  // Imports ohm so that we can process the code below.
  const ohm = require('ohm-js');
-->

```js
const parentDef = String.raw`
  Parent {
    start = "parent"
  }
`;
const parentGrammar = ohm.grammar(parentDef);
```

<!-- @markscript
  // Verify parent grammar.
  assert.ok(parentGrammar.name == "Parent");
-->

In the next example We instantiate a new grammar, *Child*, that inherits from our *Parent* grammar. We use the `ohm.grammars` method, which returns an object of our grammars:

```js
const childDef = String.raw`
  Child <: Parent {
    start := "child"
  }
`;
const childGrammar = ohm.grammars(childDef, {Parent: parentGrammar});
console.log(Object.keys(childGrammar));
// > [ 'Child' ]
```

<!-- @markscript
  // Verify that we're actually making the right grammars.
  assert.ok(childGrammar.Child);
  assert.deepEqual([ 'Child' ], Object.keys(childGrammar))
-->

You could also concatenate the grammar definitions, and then instantiate them. This results in an object with both Grammars:

```js
const combinedDef = parentDef.concat(childDef);
const grammars = ohm.grammars(combinedDef);
console.log(Object.keys(grammars));
// > [ 'Parent', 'Child' ]
```

<!-- @markscript
  // Verify that the combined grammar contains both sub grammars.
  assert.deepEqual([ 'Parent', 'Child' ], Object.keys(grammars))
-->

## Grammar objects

A Grammar instance `g` has the following methods:

<span id="Grammar.match"></span>
```ts
g.match(str: string, optStartRule?: string): MatchResult
```

Try to match `str` against `g`, returning a [MatchResult](#matchresult-objects). If `optStartRule` is given, it specifies the rule on which to start matching. By default, the start rule is inherited from the supergrammar, or if there is no supergrammar specified, it is the first rule in `g`'s definition.

```ts
g.matcher()
```

Create a new [Matcher](#matcher-objects) object which supports incrementally matching `g` against a changing input string.

<span id="Grammar.trace"></span>
```ts
g.trace(str: string, optStartRule?: string): Trace
```

Try to match `str` against `g`, returning a Trace object. `optStartRule` has the same meaning as in `g.match`. Trace objects have a `toString()` method, which returns a string which summarizes each parsing step (useful for debugging).

```ts
g.createSemantics(): Semantics
```

Create a new [Semantics](#semantics-objects) object for `g`.

<span id="extendSemantics"></span>
```ts
g.extendSemantics(superSemantics: Semantics): Semantics
```

Create a new [Semantics](#semantics-objects) object for `g` that inherits all of the operations and attributes in `superSemantics`. `g` must be a descendent of the grammar associated with `superSemantics`.

## Matcher objects

Matcher objects can be used to incrementally match a changing input against the Matcher's grammar, e.g. in an editor or IDE. When a Matcher's input is modified via `replaceInputRange`, further calls to `match` will reuse the partial results of previous calls wherever possible. Generally, this means that small changes to the input will result in very short match times.

A Matcher instance `m` has the following methods:

```ts
m.getInput(): string
```

Return the current input string.

```ts
m.setInput(str: string)
```

Set the input string to `str`.

```ts
m.replaceInputRange(startIdx: number, endIdx: number, str: string)
```

Edit the current input string, replacing the characters between `startIdx` and `endIdx` with `str`.

```ts
m.match(optStartRule?: string): MatchResult
```

Like [Grammar's `match` method](#Grammar.match), but operates incrementally.

```ts
m.trace(optStartRule?: string): Trace
```

Like [Grammar's `trace` method](#Grammar.trace), but operates incrementally.

## MatchResult objects

Internally, a successful MatchResult contains a _parse tree_, which is made up of _parse nodes_. Parse trees are not directly exposed -- instead, they are inspected indirectly through _operations_ and _attributes_, which are described in the next section.

A MatchResult instance `r` has the following methods:

```ts
r.succeeded(): boolean
```

Return `true` if the match succeeded, otherwise `false`.

```ts
r.failed(): boolean
```

Return `true` if the match failed, otherwise `false`.

### MatchFailure objects

When `r.failed()` is `true`, `r` has the following additional properties and methods:

```ts
r.message: string
```

Contains a message indicating where and why the match failed. This message is suitable for end users of a language (i.e., people who do not have access to the grammar source).

```ts
r.shortMessage: string
```

Contains an abbreviated version of `r.message` that does not include an excerpt from the invalid input.

```ts
r.getRightmostFailurePosition(): number
```

Return the index in the input stream at which the match failed.

```ts
r.getRightmostFailures(): Array
```

Return an array of Failure objects describing the failures the occurred at the rightmost failure position.

## Semantics, Operations, and Attributes

An Operation represents a function that can be applied to a successful match result. Like a [Visitor](http://en.wikipedia.org/wiki/Visitor_pattern), an operation is evaluated by recursively walking the parse tree, and at each node, invoking the matching semantic action from its _action dictionary_.

An Attribute is an Operation whose result is memoized, i.e., it is evaluated at most once for any given node.

A Semantics is a family of operations and/or attributes for a given grammar. A grammar may have any number of Semantics instances associated with it — this means that the clients of a grammar (even in the same program) never have to worry about operation/attribute name clashes.

### Semantics objects

Operations and attributes are accessed by applying a semantics instance to a [MatchResult](#matchresult-objects).
This returns a parse node, whose properties correspond to the operations and attributes of the semantics. For example, to invoke an operation named 'prettyPrint': `mySemantics(matchResult).prettyPrint()`. Attributes are accessed using property syntax — e.g., for an attribute named 'value': `mySemantics(matchResult).value`.

A Semantics instance `s` has the following methods, which all return `this` so they can be chained:

```ts
mySemantics.addOperation(nameOrSignature: string, actionDict: object): Semantics
```

Add a new Operation to this Semantics, using the [semantic actions](#semantic-actions) contained in `actionDict`. The first argument is either a name (e.g. `'prettyPrint'`) or a _signature_ which specifies the operation name and zero or more named parameters (e.g., `'prettyPrint()'`, `'prettyPrint(depth, strict)'`). It is an error if there is already an operation or attribute called `name` in this semantics.

If the operation has arguments, they are accessible via `this.args` within a semantic action. For example, `this.args.depth` would hold the value of the `depth` argument for the current action.

```ts
mySemantics.addAttribute(name: string, actionDict: object): Semantics
```

Exactly like `semantics.addOperation`, except it will add an Attribute to the semantics rather than an Operation.

```ts
mySemantics.extendOperation(name: string, actionDict: object): Semantics
```

Extend the Operation named `name` with the semantic actions contained in `actionDict`. `name` must be the name of an operation in the super semantics — i.e., you must first extend the Semantics via [`extendSemantics`](#extendSemantics) before you can extend any of its operations.

```ts
semantics.extendAttribute(name: string, actionDict: object): Semantics
```

Exactly like `semantics.extendOperation`, except it will extend an Attribute of the super semantics rather than an Operation.

### Semantic Actions

A semantic action is a function that computes the value of an operation or attribute for a specific type of node in the parse tree. There are three different types of parse nodes:

- _Rule application_, or _non-terminal_ nodes, which correspond to rule application expressions
- _Terminal_ nodes, for string and number literals, and keyword expressions
- _Iteration_ nodes, which are associated with expressions inside a [repetition operator](./syntax-reference.md#repetition-operators---) (`*`, `+`, and `?`)

Generally, you write a semantic action for each rule in your grammar, and store them together in an _action dictionary_. For example, given the following grammar:

<!-- @markscript
  // Take the grammar below and instantiate it as `g` in the markscript environment.
  markscript.transformNextBlock((code) =>
    `const g = require('ohm-js').grammar(${JSON.stringify(code)});`
  );
-->

```
Name {
  FullName = name name
  name = (letter | "-" | ".")+
}
```

A set of semantic actions for this grammar might look like this:

<!-- @markscript
  // Replace '...' in the action dict below with some actual function definitions,
  // so that we can be sure that the code actually works.
  markscript.transformNextBlock((code) =>
    code.replace('...', "return lastName.x().toUpperCase() + ', ' + firstName.x()")
        .replace('...', "return this.sourceString;")
  );
-->

```js
const actions = {
  FullName(firstName, lastName) { ... },
  name(parts) { ... }
};
```

<!-- @markscript
  // Verify that the action dict actually works.
  const semantics = g.createSemantics().addOperation('x', actions);
  assert.equal(semantics(g.match('Guy Incognito')).x(), 'INCOGNITO, Guy');
-->

The value of an operation or attribute for a node is the result of invoking the node's matching semantic action. In the grammar above, the body of the `FullName` rule produces two values — one for each application of the `name` rule. The values are represented as parse nodes, which are passed as arguments when the semantic action is invoked. An error is thrown if the function arity does not match the number of values produced by the expression.

The matching semantic action for a particular node is chosen as follows:

- On a _rule application_ (non-terminal) node, first look for a semantic action with the same name as the rule (e.g., 'FullName'). If the action dictionary does not have a property with that name, use the action named `_nonterminal`, if it exists. If there is no `_nonterminal` action, and the node has exactly one child, then return the result of invoking the operation/attribute on the child node.
- On a terminal node (e.g., a node produced by the parsing expression `"hello"`), use the semantic action named `_terminal`.
- On an iteration node (e.g., a node produced by the parsing expression `letter+`), use the semantic action named `_iter`.

<span id="special-actions"></span>The `_iter`, `_nonterminal`, and `_terminal` actions are sometimes called _special actions_. `_iter` and `_nonterminal` take a variable number of arguments, which are typically captured into an array using [rest parameter syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) , e.g. <code>_iter(...children) &lbrace; ... &rbrace;</code>. The `_terminal` action takes no arguments.

<!-- @markscript
  markscript.transformNextBlock((code) =>
    code.replace('...', "return lastName.x().toUpperCase() + ', ' + firstName.x()")
        .replace('...', "return this.sourceString;")
  );
-->

_**NOTE:** Versions of Ohm prior to v16.0 had slightly different behaviour with regards to default semantic actions. See [here](./releases/ohm-js-16.0.md#default-semantic-actions) for more details._

Note that you can also write semantic actions for built-in rules like `letter` or `digit`. For `ListOf`, please see the documentation on [asIteration](#asiteration) below.

### Parse Nodes

Each parse node is associated with a particular _parsing expression_ (a fragment of an Ohm grammar), and the node captures any input that was successfully parsed by that expression. Unlike many parsing frameworks, Ohm does not have a syntax for binding/capturing -- every parsing expression captures all the input it consumes, and produces a fixed number of values.

A node `n` has the following methods and properties:

```ts
n.child(idx: number): Node
```

Get the child at index `idx`.

```ts
n.isTerminal(): boolean
```

`true` if the node is a terminal node, otherwise `false`.

```ts
n.isIteration(): boolean
```

`true` if the node is an iteration node (i.e., if it associated with a repetition operator in the grammar), otherwise `false`.

```ts
n.children: Array
```

An array containing the node's children.

```ts
n.ctorName: string
```

The name of grammar rule that created the node.

```ts
n.source: Interval
```

Captures the portion of the input that was consumed by the node.

```ts
n.sourceString: string
```

The substring of the input that was consumed by the node. Equivalent to `n.source.contents`.

```ts
n.numChildren: number
```

The number of child nodes that the node has.

```ts
n.isOptional(): boolean
```

`true` if the node is an iterator node having either one or no child (? operator), otherwise `false`.

#### Operations and Attributes

In addition to the properties listed above, within a given semantics, every node also has a method/property corresponding to each operation/attribute in the semantics. For example, in a semantics that has an operation named 'prettyPrint' and an attribute named 'freeVars', every node has a `prettyPrint()` method and a `freeVars` property.

## Built-in Operations

### asIteration

The built-in `asIteration` operation offers a convenient way of handling _ListOf_ expressions, by adapting them to have the same interface as built-in iteration nodes. As an example, take the following grammar:

<!-- @markscript
  // Take the grammar below and instantiate it as `g_asIteration` in the markscript environment.
  markscript.transformNextBlock((code) =>
    `const g_asIteration = require('ohm-js').grammar(${JSON.stringify(code)});`
  );
-->

```
G {
  Start = ListOf<letter, ",">
}
```

...and an operation defined as follows:

<!-- @markscript
  const s = g_asIteration.createSemantics();
-->

```js
s.addOperation('upper()', {
  Start(list) {
    return list.asIteration().children.map(c => c.upper());
  },
  letter(l) {
    return this.sourceString.toUpperCase();
  }
});
```

<!-- @markscript
  assert.deepEqual(
    s(g_asIteration.match('a, b, c')).upper(),
    ['A', 'B', 'C']
  );
-->

Then `s(g.match('a, b, c')).upper()` will return `['A', 'B', 'C']`. Note that calling `upper()` on the result of `asIteration` implicitly maps the `upper` operation over each element of the list.

You can also extend the `asIteration` operation to handle other list-like rules in your own language.
