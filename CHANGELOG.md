# Changelog

## v0.12.0 - August 16, 2016

- [17d1e32]: Grammar.prototype.semantics renamed to `createSemantics`.
- [e98ba04]: Combine ruleBodies, ruleFormals, ruleDescriptions properties of Grammar
  objects into a single 'rules' property.
- [555dc22, 6ef0bce, 17ee66f]: The 'interval' property of CST nodes & semantic wrappers
  is now called 'source'.
- [7b34725]: Add 'sourceString' property to Wrappers, as an alias for `source.contents`
  (formerly `interval.contents`)
- [7797eba]: Grammar recipe format is now pure JSON, rather than JavaScript source.

## v0.11.0 - May 16, 2016

### Notable changes:

**Language**
- [5d972f6]: Inline rule declarations are now only allowed in top-level alternation nodes.
  * Previously, the grammar allowed inline rule declarations in any alternation, but it
    only really makes sense at the top level.
- [fdf4381]: Matching on structured data (Objects, Arrays, etc.) is no longer supported.
  * This was a feature that Ohm inherited from OMeta, but we found that we almost never
    used it in Ohm. Removing it allows significant simplification to the language, code,
    and documentation.

**API**
- [e497d47]: Like grammars, Semantics instances now have a `toRecipe` method

## v0.10.0 - May 2, 2016

### Notable changes:

**Language**
- [3ce66ea]: Allow leading pipe in rule bodies (suggested by Jason Merrill).
  * In rule definitions, the body may optionally begin with a `|` character, which will be ignored.
- [761d6ef]: `ListOf_some` and `ListOf_none` renamed to `NonemptyListOf` and `EmptyListOf`.
- [c548f01]: The built-in `spaces_` rule has been renamed to `spaces`.

**API**
- [22ff905]: No more default semantic action for _terminal.
  * To duplicate the old behavior, you can write a "_terminal" semantic action that just
    returns `this.primitiveValue`, as [in the math example](https://github.com/cdglabs/ohm/commit/22ff905b5842d52a8c8a63ef8186f574e01bf2e4#diff-215507e52f6cd81b5c49dc9cd72aae2eR390).
- [8efa687]: Expose pexprs as part of the public API (`ohm.pexprs`).
- #63: Semantics instances now include a built-in attribute named 'asIteration'.
  * This simplifies working with the built-in `ListOf` rule.
  * Needs documentation (#93)
- [7590d82]: Add "extras" module, with toAST() operation.
  * See the [documentation](./doc/extras.md) for more information.
- [e24a146]: New `isOptional` method on parse nodes.
  * See the [documentation](./doc/api-reference.md#parse-nodes) for more information.
- [64ee822]: New `getDiscardedSpaces` method on MatchResult, which makes Alex happy.
  * Needs documentation (#92)
