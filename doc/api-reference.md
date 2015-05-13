API Reference
=============

This page documents the API of Ohm/JS, a JavaScript library for working with grammars written in the Ohm language. For documentation on the Ohm language, see the [syntax reference](./syntax.md).

Instantiating Grammars
----------------------

<code class="api">ohm.grammar(source: string, optNamespace?: object) &rarr; Grammar</code>

Create a Grammar instance based on the grammar defined by `source`. If specified, `optNamespace` is a namespace to use when resolving external references (e.g., a supergrammar that is not defined in `source`).

<code class="api">ohm.grammarFromScriptElement(optNode?: Node, optNamespace?: object) &rarr; Grammar</code>

Convenience method for creating a Grammar instance from the contents of a `<script>` tag. `optNode`, if specified, is a script tag with the attribute `type="text/ohm-js"`. If it is not specified, the result of `document.querySelector(script[type="text/ohm-js"])` will be used instead. `optNamespace` has the same meaning as in `ohm.grammar`.

<code class="api">ohm.grammars(source: string, optNamespace?: object) &rarr; Namespace</code>

Create a new Namespace containing Grammar instances for all of the grammars defined in `source`. If `optNamespace` is specified, it will be the prototype of the new Namespace.

<code class="api">ohm.grammarsFromScriptElements(optNodeList?: NodeList, optNamespace?: object) &rarr; Namespace</code>

Create a new Namespace containing Grammar instances for all of the grammars defined in the `<script>` tags in `optNodeList`. If `optNodeList` is not specified, the result of `document.querySelectorAll('script[type="text/ohm-js"]')` will be used. `optNamespace` has the same meaning as in `ohm.grammars`.

Grammar objects
---------------

Instances of Grammar have the following properties:

<code class="api">grammar.match(obj: string|object, optStartRule?: string) &rarr; MatchResult</code>

Try to match `obj` against the grammar, returning a MatchResult. If `optStartRule` is given, it specifies the rule on which to start matching. By default, the start rule is inherited from the supergrammar, or if there is no supergrammar specified, it is the first rule in the grammar definition.

<code class="api">grammar.semantics(optSuperSemantics?: Semantics) &rarr; Semantics</code>

Create a new [Semantics](#semantics) object for the grammar. If `optSuperSemantics` is specified, the new Semantics object will inherit all its operations and attributes.

<h2 id="MatchResult">MatchResult objects</h2>

Instances of MatchResult have the following properties:

<code class="api">matchResult.succeeded() &rarr; boolean</code>

Return `true` if the match succeeded, otherwise `false`.

<code class="api">matchResult.failed() &rarr; boolean</code>

Return `true` if the match failed, otherwise `false.

### MatchFailure properties

When `matchResult.failed()` is `true`, MatchResult objects also have the following properties:

#### <code>matchResult.message: string</code>

If the match failed, contains a message indicating where and why it failed. The message is suitable for end users of a language (i.e., people who do not have access to the grammar source).

<code>matchResult.shortMessage: string</code>

<h2 id="semantics">Semantics, Operations, and Attributes</h2>
<!---------------------------------------------------------->

An Operation represents a function to be applied to a successful match result. It's very similar to a [Visitor](http://en.wikipedia.org/wiki/Visitor_pattern). An operation is executed by recursively walking the parse tree, and at each node, invoking the matching semantic action from its action dictionary. An Attribute is like an Operation, except that attributes are calculated no more than once for a given node, and the value is memoized.

A Semantics object is a container for a family of operations and/or attributes. They make it possible for an operation to invoke other operations in the same semantics, and for operations (and attributes) to be mutually recursive. Semantics instances are created using the `grammar.semantics()` method.

Operations and attributes are accessed by applying the semantics instance to a [MatchResult](#MatchResult). This returns an object whose properties correspond to the operations and attributes of the semantics. For example, to invoke an operation named 'prettyPrint': `semantics(matchResult).prettyPrint()`. Attributes are accessed using property syntax -- e.g., for an attribute named 'value': `semantics(matchResult).value`.

Semantics instances have the following properties:

<code class="api">semantics.addOperation(name: string, actionDict: object) &rarr; this</code>

Add a new Operation named `name` to this Semantics, using the [semantic actions](#semantic-actions) contained in `actionDict`. It is an error if there is already an operation or attribute called `name` in this semantics or its super.

<code class="api">semantics.addAttribute(name: string, actionDict: object) &rarr; this</code>

Exactly like `semantics.addOperation`, except it will add an Attribute to the semantics rather than an Operation.

<code class="api">semantics.extendOperation(name: string, actionDict: object) &rarr; this</code>

Extend the Operation named `name` with the semantic actions contained in `actionDict`. `name` must be the name of an operation in the super semantics.

<code class="api">semantics.extendAttribute(name: string, actionDict: object) &rarr; this</code>

Exactly like `semantics.extendOperation`, except it will extend an Attribute of the super semantics rather than an Operation.

<h3 id="semantic-actions">Semantic Actions</h3>

A semantic action is a function that computes the value of an operation or attribute for a specific type of node in the parse tree. Generally, you write a semantic action for every rule in your grammar, and store them together in an _action dictionary_. For example, given the following grammar:

    RestrictiveName {
      FullName = name name
      name = (letter | "-" | ".")+
    }

<script type="text/markscript">
  // Make sure this grammar is the same as the one above!
  var g = require('ohm').grammar([
      'RestrictiveName {',
      '  FullName = name name',
      '  name = (letter | "-" | ".")+',
      '}'].join('\n'));
</script>

Here's what a set of semantic actions for this grammar might look like:

    var actions = {
      FullName: function(firstName, lastName) { ... },
      name: function(chars) { ... }
    };

<script type="text/markscript">
// This will be executed by Markscript but won't be visible in the HTML output.
var actions = {
  FullName: function(firstName, lastName) {
  	return lastName.x().toUpperCase() + ', ' + firstName.x();
  },
  name: function(chars) {
    return this.node.interval.contents;
  }
};
var semantics = g.semantics().addOperation('x', actions);
assert.equal(semantics(g.match('Guy Incognito')).x(), 'INCOGNITO, Guy');
</script>

