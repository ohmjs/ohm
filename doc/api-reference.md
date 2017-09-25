API Reference
=============

This page documents the API of Ohm/JS, a JavaScript library for working with grammars written in the Ohm language. For documentation on the Ohm language, see the [syntax reference](./syntax-reference.md).

Instantiating Grammars
----------------------

<b><pre class="api">ohm.grammar(source: string, optNamespace?: object) &rarr; Grammar</pre></b>

Instantiate the Grammar defined by `source`. If specified, `optNamespace` is the Namespace to use when resolving external references in the grammar. For more information, see the documentation on [Namespace objects](#namespace-objects) below.

<b><pre class="api">ohm.grammarFromScriptElement(optNode?: Node, optNamespace?: object) &rarr; Grammar</pre></b>

Convenience method for creating a Grammar instance from the contents of a `<script>` tag. `optNode`, if specified, is a script tag with the attribute `type="text/ohm-js"`. If it is not specified, the result of `document.querySelector(script[type="text/ohm-js"])` will be used instead. `optNamespace` has the same meaning as in `ohm.grammar`.

<b><pre class="api">ohm.grammars(source: string, optNamespace?: object) &rarr; Namespace</pre></b>

Create a new Namespace containing Grammar instances for all of the grammars defined in `source`. If `optNamespace` is specified, it will be the prototype of the new Namespace.

<b><pre class="api">ohm.grammarsFromScriptElements(optNodeList?: NodeList, optNamespace?: object) &rarr; Namespace</pre></b>

Create a new Namespace containing Grammar instances for all of the grammars defined in the `<script>` tags in `optNodeList`. If `optNodeList` is not specified, the result of `document.querySelectorAll('script[type="text/ohm-js"]')` will be used. `optNamespace` has the same meaning as in `ohm.grammars`.

Namespace objects
-----------------

When instantiating a grammar that refers to another grammar -- e.g. `MyJava <: Java { keyword += "async" }` -- the supergrammar name ('Java') is resolved to a grammar by looking up the name in a Namespace. In Ohm/JS, Namespaces are a plain old JavaScript objects, and an object literal like `{Java: myJavaGrammar}` can be passed to any API that expects a Namespace. For convenience, Ohm also has the following methods for working with namespaces:

<b><pre class="api">ohm.namespace(optProps?: object)</pre></b>

Create a new namespace. If `optProps` is specified, all of its properties will be copied to the new namespace.

<b><pre class="api">ohm.extendNamespace(namespace: object, optProps?: object)</pre></b>

Create a new namespace which inherits from `namespace`. If `optProps` is specified, all of its properties will be copied to the new namespace.

Grammar objects
---------------

A Grammar instance `g` has the following methods:

<a name="Grammar.match"><b><pre class="api">g.match(str: string, optStartRule?: string) &rarr; MatchResult</pre></b></a>

Try to match `str` against `g`, returning a [MatchResult](#matchresult-objects). If `optStartRule` is given, it specifies the rule on which to start matching. By default, the start rule is inherited from the supergrammar, or if there is no supergrammar specified, it is the first rule in `g`'s definition.

<b><pre class="api">g.matcher()</pre></b>

Create a new [Matcher](#matcher-objects) object which supports incrementally matching `g` against a changing input string.

<a name="Grammar.trace"><b><pre class="api" id="trace">g.trace(str: string, optStartRule?: string) &rarr; Trace</pre></b></a>

Try to match `str` against `g`, returning a Trace object. `optNamespace` has the same meaning as in `ohm.grammar`. Trace objects have a `toString()` method, which returns a string which summarizes each parsing step (useful for debugging).

<b><pre class="api">g.createSemantics() &rarr; Semantics</pre></b>

Create a new [Semantics](#semantics) object for `g`.

<b><pre class="api">g.extendSemantics(superSemantics: Semantics) &rarr; Semantics</pre></b>

Create a new [Semantics](#semantics) object for `g` that inherits all of the operations and attributes in `superSemantics`. `g` must be a descendent of the grammar associated with `superSemantics`.

Matcher objects
---------------

Matcher objects can be used to incrementally match a changing input against the Matcher's grammar, e.g. in an editor or IDE. When a Matcher's input is modified via `replaceInputRange`, further calls to `match` will reuse the partial results of previous calls wherever possible. Generally, this means that small changes to the input will result in very short match times.

A Matcher instance `m` has the following methods:

<b><pre class="api">m.getInput() &rarr; string</pre></b>

Return the current input string.

<b><pre class="api">m.setInput(str: string)</pre></b>

Set the input string to `str`.

<b><pre class="api">m.replaceInputRange(startIdx: number, endIdx: number, str: string)</pre></b>

Edit the current input string, replacing the characters between `startIdx` and `endIdx` with `str`.

<b><pre class="api">m.match(optStartRule?: string) &rarr; MatchResult</pre></b>

Like [Grammar's `match` method](#Grammar.match), but operates incrementally.

<b><pre class="api">m.trace(optStartRule?: string) &rarr; Trace</pre></b>

Like [Grammar's `trace` method](#Grammar.trace), but operates incrementally.

MatchResult objects
-------------------

Internally, a successful MatchResult contains a _parse tree_, which is made up of _parse nodes_. Parse trees are not directly exposed -- instead, they are inspected indirectly through _operations_ and _attributes_, which are described in the next section.

A MatchResult instance `r` has the following methods:

<b><pre class="api">r.succeeded() &rarr; boolean</pre></b>

Return `true` if the match succeeded, otherwise `false`.

<b><pre class="api">r.failed() &rarr; boolean</pre></b>

Return `true` if the match failed, otherwise `false`.

### MatchFailure objects

When `r.failed()` is `true`, `r` has the following additional properties and methods:

<b><pre class="api">r.message: string</pre></b>

Contains a message indicating where and why the match failed. This message is suitable for end users of a language (i.e., people who do not have access to the grammar source).

<b><pre class="api">r.shortMessage: string</pre></b>

Contains an abbreviated version of `r.message` that does not include an excerpt from the invalid input.

<b><pre class="api">r.getRightmostFailurePosition() &rarr; number</pre></b>

Return the index in the input stream at which the match failed.

<b><pre class="api">r.getRightmostFailures() &rarr; Array</pre></b>

Return an array of Failure objects describing the failures the occurred at the rightmost failure position.

<h2 id="semantics">Semantics, Operations, and Attributes</h2>

An Operation represents a function that can be applied to a successful match result. Like a [Visitor](http://en.wikipedia.org/wiki/Visitor_pattern), an operation is evaluated by recursively walking the parse tree, and at each node, invoking the matching semantic action from its _action dictionary_.

An Attribute is an Operation whose result is memoized, i.e., it is evaluated at most once for any given node.

A Semantics is a family of operations and/or attributes for a given grammar. A grammar may have any number of Semantics instances associated with it -- this means that the clients of a grammar (even in the same program) never have to worry about operation/attribute name clashes.

### Semantics objects

Operations and attributes are accessed by applying a semantics instance to a [MatchResult](#matchresult-objects).
This returns a parse node, whose properties correspond to the operations and attributes of the semantics. For example, to invoke an operation named 'prettyPrint': `mySemantics(matchResult).prettyPrint()`. Attributes are accessed using property syntax -- e.g., for an attribute named 'value': `mySemantics(matchResult).value`.

A Semantics instance `s` has the following methods, which all return `this` so they can be chained:

<b><pre class="api">mySemantics.addOperation(name: string, actionDict: object) &rarr; Semantics</pre></b>

Add a new Operation named `name` to this Semantics, using the [semantic actions](#semantic-actions) contained in `actionDict`. It is an error if there is already an operation or attribute called `name` in this semantics.

<b><pre class="api">mySemantics.addAttribute(name: string, actionDict: object) &rarr; Semantics</pre></b>

Exactly like `semantics.addOperation`, except it will add an Attribute to the semantics rather than an Operation.

<b><pre class="api">mySemantics.extendOperation(name: string, actionDict: object) &rarr; Semantics</pre></b>

Extend the Operation named `name` with the semantic actions contained in `actionDict`. `name` must be the name of an operation in the super semantics.

<b><pre class="api">semantics.extendAttribute(name: string, actionDict: object) &rarr; Semantics</pre></b>

Exactly like `semantics.extendOperation`, except it will extend an Attribute of the super semantics rather than an Operation.

### Semantic Actions

A semantic action is a function that computes the value of an operation or attribute for a specific type of node in the parse tree. There are three different types of parse nodes:

- _Rule application_, or _non-terminal_ nodes, which correspond to rule application expressions
- _Terminal_ nodes, for string and number literals, and keyword expressions
- _Iteration_ nodes, which are associated with expressions inside a [repetition operator](./syntax-reference.md#repetition-operators) (`*`, `+`, and `?`)

Generally, you write a semantic action for each rule in your grammar, and store them together in an _action dictionary_. For example, given the following grammar:

<!-- @markscript
  // Take the grammar below and instantiate it as `g` in the markscript environment.
  markscript.transformNextBlock(function(code) {
    return "var g = require('ohm-js').grammar('" + code.replace(/\n/g, '\\n') + "');";
  });
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
  markscript.transformNextBlock(function(code) {
    return code.replace('...', "return lastName.x().toUpperCase() + ', ' + firstName.x()")
               .replace('...', "return this.sourceString;")
  });
-->

```js
var actions = {
  FullName: function(firstName, lastName) { ... },
  name: function(parts) { ... }
};
```

<!-- @markscript
  // Verify that the action dict actually works.
  var semantics = g.createSemantics().addOperation('x', actions);
  assert.equal(semantics(g.match('Guy Incognito')).x(), 'INCOGNITO, Guy');
-->

The value of an operation or attribute for a node is the result of invoking the node's matching semantic action. In the grammar above, the body of the `FullName` rule produces two values -- one for each application of the `name` rule. The values are represented as parse nodes, which are passed as arguments when the semantic action is invoked. An error is thrown if the function arity does not match the number of values produced by the expression.

The matching semantic action for a particular node is chosen as follows:

- On a _rule application_ node, first look for a semantic action with the same name as the rule (e.g., 'FullName'). If the action dictionary does not have a property with that name, use the action named '_nonterminal', if it exists. If not, the default action is used, which returns the result of applying the operation or attribute to the node's only child. There is no default action for non-terminal nodes that have no children, or more than one child.
- On a terminal node (e.g., a node produced by the parsing expression `"hello"`), use the semantic action named '_terminal'.
- On an iteration node (e.g., a node produced by the parsing expression `letter+`), use the semantic action named '_iter'. If the action dictionary does not have a property with that name, the default action returns an array containing the results of applying the operation or attribute to each child node.

### Parse Nodes

Each parse node is associated with a particular _parsing expression_ (a fragment of an Ohm grammar), and the node captures any input that was successfully parsed by that expression. Unlike many parsing frameworks, Ohm does not have a syntax for binding/capturing -- every parsing expression captures all the input it consumes, and produces a fixed number of values.

A node `n` has the following methods and properties:

<b><pre class="api">n.child(idx: number) &rarr; Node</pre></b>

Get the child at index `idx`.

<b><pre class="api">n.isTerminal() &rarr; boolean</pre></b>

`true` if the node is a terminal node, otherwise `false`.

<b><pre class="api">n.isIteration() &rarr; boolean</pre></b>

`true` if the node is an iteration node (i.e., if it associated with a repetition operator in the grammar), otherwise `false`.

<b><pre class="api">n.children: Array</pre></b>

An array containing the node's children.

<b><pre class="api">n.ctorName: string</pre></b>

The name of grammar rule that created the node.

<b><pre class="api">n.source: Interval</pre></b>

Captures the portion of the input that was consumed by the node.

<b><pre class="api">n.numChildren: number</pre></b>

The number of child nodes that the node has.

<b><pre class="api">n.isOptional() &rarr; boolean</pre></b>

`true` if the node is an iterator node having either one or no child (? operator), otherwise `false`.

<b><pre class="api">n.primitiveValue: string</pre></b>

For a terminal node, the raw value that was consumed from the input stream.

#### Operations and Attributes

In addition to the properties listed above, within a given semantics, every node also has a method/property corresponding to each operation/attribute in the semantics. For example, in a semantics that has an operation named 'prettyPrint' and an attribute named 'freeVars', every node has a `prettyPrint()` method and a `freeVars` property.
