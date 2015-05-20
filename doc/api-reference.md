API Reference
=============

This page documents the API of Ohm/JS, a JavaScript library for working with grammars written in the Ohm language. For documentation on the Ohm language, see the [syntax reference](./syntax-reference.md).

Instantiating Grammars
----------------------

<code class="api">ohm.grammar(source: string, optNamespace?: object) &rarr; Grammar</code>

Instantiate the Grammar defined by `source`. If specified, `optNamespace` is the Namespace to use when resolving external references in the grammar. For more information, see the documentation on [Namespace objects](#namespace) below.

<code class="api">ohm.grammarFromScriptElement(optNode?: Node, optNamespace?: object) &rarr; Grammar</code>

Convenience method for creating a Grammar instance from the contents of a `<script>` tag. `optNode`, if specified, is a script tag with the attribute `type="text/ohm-js"`. If it is not specified, the result of `document.querySelector(script[type="text/ohm-js"])` will be used instead. `optNamespace` has the same meaning as in `ohm.grammar`.

<code class="api">ohm.grammars(source: string, optNamespace?: object) &rarr; Namespace</code>

Create a new Namespace containing Grammar instances for all of the grammars defined in `source`. If `optNamespace` is specified, it will be the prototype of the new Namespace.

<code class="api">ohm.grammarsFromScriptElements(optNodeList?: NodeList, optNamespace?: object) &rarr; Namespace</code>

Create a new Namespace containing Grammar instances for all of the grammars defined in the `<script>` tags in `optNodeList`. If `optNodeList` is not specified, the result of `document.querySelectorAll('script[type="text/ohm-js"]')` will be used. `optNamespace` has the same meaning as in `ohm.grammars`.

<h2 id="namespace">Namespace objects</h2>

When instantiating a grammar that refers to another grammar -- e.g. `SuperJava <: Java { ... }` -- the supergrammar name ('Java') is resolved to a grammar by looking up the name in a Namespace. In Ohm/JS, Namespaces are a plain old JavaScript objects, and an object literal like `{Java: ...}` can be passed to any API that expects a Namespace. For convenience, Ohm also has the following methods for working with namespaces:

<code class="api">ohm.namespace(optProps?: object)</code>

Create a new namespace. If `optProps` is specified, all of its properties will be copied to the new namespace.

<code class="api">ohm.extendNamespace(namespace: object, optProps?: object)</coder>

Create a new namespace which inherits from `namespace`. If `optProps` is specified, all of its properties will be copied to the new namespace.

Grammar objects
---------------

Instances of Grammar have the following methods:

<code class="api">grammar.match(obj: string|object, optStartRule?: string) &rarr; MatchResult</code>

Try to match `obj` against `grammar`, returning a MatchResult. If `optStartRule` is given, it specifies the rule on which to start matching. By default, the start rule is inherited from the supergrammar, or if there is no supergrammar specified, it is the first rule in `grammar`'s definition.

<code class="api">grammar.semantics() &rarr; Semantics</code>

Create a new [Semantics](#semantics) object for `grammar`.

<code class="api">grammar.extendSemantics(superSemantics: Semantics) &rarr; Semantics</code>

Create a new [Semantics](#semantics) object for `grammar` that inherits all of the operations and attributes in `superSemantics`. `grammar` must be a descendent of the grammar associated with `superSemantics`.

<h2 id="MatchResult">MatchResult objects</h2>

Instances of MatchResult have the following methods:

<code class="api">matchResult.succeeded() &rarr; boolean</code>

Return `true` if the match succeeded, otherwise `false`.

<code class="api">matchResult.failed() &rarr; boolean</code>

Return `true` if the match failed, otherwise `false`.

### MatchFailure properties

When `matchResult.failed()` is `true`, `matchResult` has the following additional properties:

<code>matchResult.message: string</code>

Contains a message indicating where and why the match failed. This message is suitable for end users of a language (i.e., people who do not have access to the grammar source).

<code>matchResult.shortMessage: string</code>

Contains an abbreviated version of `matchResult.message` that does not include an excerpt from the invalid input.

<h2 id="semantics">Semantics, Operations, and Attributes</h2>

An Operation represents a function that can be applied to a successful match result. Like a [Visitor](http://en.wikipedia.org/wiki/Visitor_pattern), an operation is evaluated by recursively walking the parse tree, and at each node, invoking the matching semantic action from its *action dictionary*.

An Attribute is an Operation whose result is memoized, i.e., it is evaluated at most once for any given node.

A Semantics is a family of operations and/or attributes for a given grammar. A grammar may have any number of Semantics instances associated with it -- this means that the clients of a grammar (even in the same program) never have to worry about operation/attribute name clashes.

Operations and attributes are accessed by applying a semantics instance to a [MatchResult](#MatchResult). This returns an object whose properties correspond to the operations and attributes of the semantics. For example, to invoke an operation named 'prettyPrint': `mySemantics(matchResult).prettyPrint()`. Attributes are accessed using property syntax -- e.g., for an attribute named 'value': `mySemantics(matchResult).value`.

Semantics instances have the following properties:

<code class="api">mySemantics.addOperation(name: string, actionDict: object) &rarr; this</code>

Add a new Operation named `name` to this Semantics, using the [semantic actions](#semantic-actions) contained in `actionDict`. It is an error if there is already an operation or attribute called `name` in this semantics.

<code class="api">mySemantics.addAttribute(name: string, actionDict: object) &rarr; this</code>

Exactly like `semantics.addOperation`, except it will add an Attribute to the semantics rather than an Operation.

<code class="api">mySemantics.extendOperation(name: string, actionDict: object) &rarr; this</code>

Extend the Operation named `name` with the semantic actions contained in `actionDict`. `name` must be the name of an operation in the super semantics.

<code class="api">semantics.extendAttribute(name: string, actionDict: object) &rarr; this</code>

Exactly like `semantics.extendOperation`, except it will extend an Attribute of the super semantics rather than an Operation.

<h3 id="semantic-actions">Semantic Actions</h3>

A semantic action is a function that computes the value of an operation or attribute for a specific type of node in the parse tree. Generally, you write a semantic action for each rule in your grammar, and store them together in an _action dictionary_. For example, given the following grammar:

<script type="text/markscript">
  // Take the grammar below and instantiate it as `g` in the markscript environment.
  markscript.transformNextBlock(function(code) {
    return "var g = require('ohm').grammar('" + code.replace(/\n/g, '\\n') + "');";
  });
</script>

```
Name {
  FullName = name name
  name = (letter | "-" | ".")+
}
```

A set of semantic actions for this grammar might look like this:

<script type="text/markscript">
  // Replace '...' in the action dict below with some actual function definitions,
  // so that we can be sure that the code actually works.
  markscript.transformNextBlock(function(code) {
    return code.replace('...', "return lastName.x().toUpperCase() + ', ' + firstName.x()")
               .replace('...', "return this.interval.contents;")
  });
</script>

```js
var actions = {
  FullName: function(firstName, lastName) { ... },
  name: function(parts) { ... }
};
```

<script type="text/markscript">
  // Verify that the action dict actually works.
  var semantics = g.semantics().addOperation('x', actions);
  assert.equal(semantics(g.match('Guy Incognito')).x(), 'INCOGNITO, Guy');
</script>

The value of an operation or attribute for a node is the result of invoking the node's _matching semantic action_, which is chosen as follows:

- On a _rule application_ (i.e., non-terminal) node, first look for a semantic action with the same name as the rule (e.g., 'FullName'). If the action dictionary does not have a property with that name, use the action named '_default'.
- On a terminal node (e.g., a node produced by the parsing expression `"-"`), use the semantic action named '_terminal' if it exists, otherwise use '_default'.

#### Arity

When a semantic action is invoked, the arity of the function must be the same as the arity of the node. Unlike many other parsing frameworks, Ohm does not have a syntax for binding/capturing -- every parsing expression will capture all of the input it consumes. In the grammar above, the body of the `FullName` rule captures two values -- one for each application of the `name` rule -- so the semantic action `FullName` must have two arguments.

The `*` (zero or more) and `+` (one or more) operators do not affect the arity: the expressions `"a" "b"` and `("a" "b")+` both have arity 2. However, a semantic action for the latter would be invoked with two arrays as arguments, with both arrays having a length of at least 1. **TODO:** Not quite true, they would actually be passed the result of the '_many' semantic action.
