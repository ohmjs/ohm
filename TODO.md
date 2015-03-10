# Ohm TODO

## First Release Blockers

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

* Add `Grammar.prototype.extend(semanticActionOrAttribute, { ... })`
* The grammar that the 1st argument belongs to must be a (transitive) super-grammar of the receiver of `extend()`.
* The methods in the 2nd argument override / add to those of the original  semantic action or attribute.
* (Does this do what Pat wanted?)

### `match` vs. `matchContents`

* Get rid of `Grammar.prototype.matchContents()` -- I think `Grammar.prototype.match()` does the right thing w/ its special treatment of `String` inputs.
* This is easy to do, but the unit tests are currently testing the different semantics between `match` and `matchContents`. So I think it's a good idea to fix the unit tests before doing this. (More on unit tests below.)

### Rule Descriptions

* ... should always start with an indefinite article, e.g., "a rule description",  "an expression", etc. This makes them work better for error-reporting purposes. **Update all of the rule descriptions in our codebase accordingly.**
* Come up with a better syntax for them. Right now they look a little confusing b/c they look just like inline rule declarations. A couple of options:
    * `()`s, e.g., `(an expression)`
    * `""`s, e.g., `"an expression"` -- this is the syntax for rule descriptions in PEG.js (using it may be a good idea b/c it will look familiar to lots of people)
    * Any other ideas?

### The `empty` Rule

* ... is a bad smell in any grammar that uses it. Always better to use case labels / inline rule declarations or optionals instead.
* So let's remove the `empty` rule from `src/Grammar.js`.

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