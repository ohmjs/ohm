# Ohm TODO

## First Release Blockers

### Better error messages

Implement Alex's de-spockification idea.

### "Namespaces"

* `ohm.grammar(stringOrNodeList, optNS)` returns a `Grammar`
* `ohm.grammars(stringOrNodeList, optNS)` returns a namespace
* Namespaces are just JS objects mapping grammar names to `Grammar` objects.
* If the `stringOrNodeList` argument is a `NodeList`, it must only contain `<script>` tags whose `type` attribute is set to `text/ohm-js`.
* Grammars that are used as super-grammars in grammar declarations should be looked up in the `optNS` dictionary, if there is one.
* The `ohm.grammars()` method should create a new namespace object in which it should put all of the grammars it creates. Lookup for super-grammars should start in that object, and if there's no match, it should go to the `optNS` object, if present.
* You can't re-declare a grammar -- that's an error. This could happen with `ohm.grammar()` if the grammar is already declared in `optNS`, and in `ohm.grammars()` if the grammar is already in the new namespace, or in `optNS`.
* After doing this stuff, we should be able to:
    * Remove the stuff having to do with `Namespaces` from the codebase.
    * In `src/ohm-grammar.oh`, remove `SuperGrammar_qualified` rule
    * No more `namespace` attribute in Ohm `<script>` tags.
    * Maybe now the stuff that's done in `src/bootstrap.js` can be done for any grammar? That would enable people to share grammar as "binaries". (A while ago I had an `ohm` command, but I removed it b/c it didn't support inheritance properly. That command turned into the less general but essential `src/bootstrap.js`.)

### Refactorings

* Pass origPos, etc., as arguments to `PExpr.prototype._eval`

### Inheriting from Semantic Actions and Attributes

I'm starting to think that you should always have to create an instance of `Semantics` on which you can create semantic actions and attributes. Here's how this might work:

```
var g1 = ohm.grammar(...);
var s1 = g1.semanticsBuilder()
  .addSemanticAction("eval", {
  	AddExp_plus: function(x, _, y) {
  	  return this.eval(x) + this.eval(y);  	},
  	...  })
  .build();
```

Note that `SemanticsBuilder.prototype.semanticAction(name, dict)` returns the receiver to allow chaining. (Same goes for `Semantics.prototype.{synthesizedAttribute, inheritedAttribute}`.) I'm going with a builder pattern b/c the `build()` method tells us when it's OK to perform checks on the action dictionaries -- this is important for extensions, see below.

The `Semantics` objects act as a family of semantic actions and attributes. Note that recursive (even mutually-recursive) calls of semantic actions / attributes must go through the semantics object, which is what `this` is bound to in the methods of action dictionaries. (This solves the problems I was having with early-binding in recursive calls, which were getting in the way of extensibility.)

To extend a semantic action, you create a new `Semantics` object that  extends the one that the semantic action in question belongs to. You do this by passing the `Semantics` that you want to extend as an argument to *your grammar*'s `semantics` method. Then you call `extend(semanticActionOrAttributeName, dict)` on that. E.g.,

```
var g2 = ... // some grammar that extends g1
var s2 = g2.semanticsBuilder(s1)
  .extend("eval", {
  	AddExp_foo: function(x, _, y) { ... }  })
  .build();
```

Some checks we'll have to do when `build()` is called:
	
* `SemanticsBuilder.prototype.extend` should make sure that there is already a semantic action / attribute with the given name. (It's an error if there isn't.)
* Conversely, `SemanticsBuilder.prototype.{addSemanticAction, addSynthesizedAttribute, addInheritedAttribute}` should throw an error if there is already a semantic action / attribute with the given name.
* It should also be an error to try to declare a new semantic action / attribute whose name is `node` (see below).
* You should only be able to extend a `Semantics` from the same grammar, or from a grammar that your grammar inherits from.
* Other semantic checks, e.g., all action dict methods have the correct arity, and there are no "useless" methods.

Now that `this` is bound to an instance of `Semantics`, we'll need a different way to access the current CST node. At the moment the best option I've come up with is `this.node`.  Here are some thoughts on implementing this:

* We'll want to disallow assignment into `this.node`. So maybe we'll use `Object.defineProperty`?
* We may need a try/finally around the outermost call to clean up in case an exception is thrown, or make `this` an object that delegates to the `Semantics` object and adds the `node` property.
* We also have to make sure that whatever we do works with mutually-recursive semantic actions / attributes. (I.e., the value of `this.node` obeys a stack discipline.)

------------

Old version:

**NOTE: I've had a stab at this (it's easy enough to implement) but it needs more thinking. The problem is that recursive calls to the semantic action / attribute will still "dispatch" to the original instead of the extension. Maybe the semantic action / whatever needs to become `this`, but then what do we do about the parent node? I don't like the idea of including the parent node as an argument, that's too verbose.**

* Add `Grammar.prototype.extend(semanticActionOrAttribute, { ... })`
* The grammar that the 1st argument belongs to must be a (transitive) super-grammar of the receiver of `extend()`.
* The methods in the 2nd argument override / add to those of the original  semantic action or attribute.
* (Does this do what Pat wanted?)

### Unit Tests

* The unit tests are a mess right now. They were pretty good early on, but the language has been changed a lot since then. **We should spend a couple of days cleaning up the unit tests.** E.g.,
    * Now that we have CSTs, there's no reason to check acceptance and semantic actions separately for each kind of `PExpr`. We should just compare the result of `Grammar.prototype.match` with the expected CST. (We may have to do some work to get `Node.equals(anotherNode)` to work.)
    * ...

### Documentation

* Write it.

## Things that should be included in future releases

* Pat's visualizer / omniscient debugger
* An IDE for Ohm
    * Integrate Pat's visualizer
    * Built-in support for unit testing grammars (re-run unit tests while programmer changes the grammar, show coverage, etc.)
    * Automatic generation of random valid inputs
* Better support for attribute grammars
    * Take another pass at the API for writing inherited attributes
    * Akira's editor?
* Incremental parsing ala [Papa Carlo](http://lakhin.com/projects/papa-carlo/)?    