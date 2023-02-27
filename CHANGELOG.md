# Changelog

## Next (Ohm v17)

### Breaking changes:

- [55c787b]: The namespace helpers (`namespace`, `extendNamespace`) have been removed. (These were always optional.)
- [bea0be9]: When used as an ES module, the main 'ohm-js' module now has *only* named exports (i.e., no default export). The same is true for `ohm-js/extras'.
- [#395]: In generated type definitions, action dictionary types now inherit from `BaseActionDict<T>`, a new supertype of `ActionDict<T>`.
- [9e32f8d]: `ohm.util` is removed from the public API. `getLineAndColumn` and `getLineAndColumn` have been moved into the `extras` module.
- [#398]: Changed the default behavior `toAST` for the built-in list rules (`ListOf` and friends). Both the syntactic (`ListOf`, ...) and lexical versions (`listOf`, ...) are now represented as arrays, with the separators _discarded_. Previously, the syntactic versions were represented by arrays, but with separators _included_, and the lexical versions were represented as strings (just like other lexical rules).

### Other notable changes:

- [#416]: Fix crash when calling `toString` on a non-root node
- [13c8991]: The deprecated `grammarFromScriptElement` and `grammarsFromScriptElements` functions have been entirely removed.
- Improvements to the TypeScript types:
  - [#407]: Added types for the built-in `asIteration` operation
  - [#410]: Added types for `Interval.getLineAndColumn`
- [#368]: The `primitiveValue` property of nodes, which was deprecated in Ohm v16, has now been completely removed.

## v16.4.0 - Aug 2, 2022

### New features:

- [#390] Added type information for ohm.pexprs

## v16.3.4 - May 2, 2022

(Same as 16.3.3)

## v16.3.3 - May 2, 2022

- [#374] Fixed incorrect type annotation for Node.isOptional()

## v16.3.2 - Mar 23, 2022

### Fixes:

- [#370] Fix harc/ohm-editor#72 - grammars with super-splice (...) not working in the Ohm Editor

### Other notable changes:

- [#368]: The (undocumented) `toJSON()` method of nodes has been removed. It was originally intended to support an experimental feature of the Ohm Editor.

## v16.3.1 - Feb 28, 2022

### Fixes:

- [#366]: Fix #363 by removing imports of ohm-js from extras (it’s not required)

## v16.3.0 - Jan 29, 2022

### New features:

- Added support for ES6-style Unicode code point escapes (`\u{...}`) inside terminal expressions. This can be used to specify code points above `0xFFFF`.
- Range expressions can now match a single code point, rather than being limited to a single, 16-bit code unit. E.g., `"😇".."😈"` is now a valid range expression.

### Fixes:

- [#357] The "wrong number of arguments for rule" error message now includes the line and column where the error occurred.

## v16.2.0 - Jan 8, 2022

- [#350] Added full support for importing Ohm as an ES module.

## v16.1.1 - Jan 7, 2022

- [#344] Removed circular dependencies between core modules, allowing Ohm to be built with Rollup.

## v16.1.0 - Jan 6, 2022

- Added [`applySyntactic`][], a built-in rule to allow application of a syntactic rule from a lexical context (see #136 for details).

[applysyntactic]: ./doc/syntax-reference.md#applySyntactic

## v16.0.0 - Oct 1, 2021

Ohm v16 is primarily about improving the experience of [using Ohm with TypeScript][using-ohm-with-typescript]. In order to do that, we needed to make some minor breaking changes. With the major version change, we also took the opportunity to clean up and simplify some parts of the API.

All of the breaking changes are described below. For more information about how to modify your existing code to work with Ohm v16, see the [upgrade guide][upgrading].

[using-ohm-with-typescript]: https://github.com/harc/ohm/blob/master/doc/typescript.md
[upgrading]: https://github.com/harc/ohm/blob/master/doc/releases/ohm-js-16.0.md#upgrading

### Breaking changes:

**API**

- [2519de5] `grammarFromScriptElement` and `grammarsFromScriptElements` have been removed.
- [74ff254] The ohm-js package now requires an ES2017 environment. This means that very old browsers (e.g., Internet Explorer and Edge 14 and below) are no longer supported. See [caniuse][caniuse-es2017] for an overview.
- There is no longer a default semantic action for iteration nodes. _Release notes: [default semantic actions][default-semantic-actions]._
- The [`_iter` and `_nonterminal` actions](./doc/api-reference.md#special-actions) now take a variable number of arguments, rather than a single `Node[]` argument. _Release notes: [args to \_iter and \_nonterminal actions][args-to-_iter-and-_nonterminal]._
- (_TypeScript only_): On semantics objects, the methods `addOperation`, `extendOperation`, `addAttribute`, and `extendAttribute` now have a required type parameter, which is the return type of the operation (or the type of the attribute). The related types `Action` and `ActionDict` are similarly parameterized by the return type of the semantic actions. _Release notes: [type parameters for operations and actions][type-parameters]._

[caniuse-es2017]: https://caniuse.com/async-functions,object-values,object-entries,mdn-javascript_builtins_object_getownpropertydescriptors,pad-start-end,mdn-javascript_grammar_trailing_commas_trailing_commas_in_functions
[default-semantic-actions]: ./doc/releases/ohm-js-16.0.md#default-semantic-actions
[args-to-_iter-and-_nonterminal]: ./doc/releases/ohm-js-16.0.md#args-to-_iter-and-_nonterminal-actions
[type-parameters]: ./doc/releases/ohm-js-16.0.md#type-parameters-for-operations-and-actions-typescript-only

### Other notable changes:

- [7d69cde] Node.primitiveValue is now deprecated — [Node.sourceString][sourcestring] is equivalent, and should be used instead.
- Improvements and additions to the TypeScript declarations (index.d.ts) to make them more accurate and comprehensive.
- [37a2091] The `generateExample` method has been removed from the PExpr class. (It was never part of Ohm's public API.)
- [bcbb864] Removed the `ohm-js` executable, as it was only ever intended for internal use. The new @ohm-js/cli package can now be used to generate grammar bundles.

[sourcestring]: ./doc/api-reference.md#Node-sourceString

## v15.5.0 - Apr 5, 2021

## Notable changes:

- [0af8165] Fixed an off-by-one error in Node.hasChildren(), where it returned false for nodes with a single child.

## v15.4.1 - January 14, 2021

(Same as 15.4.0)

## Notable changes:

- [15c63a9] Added a toString() method to the object returned from getLineAndColumn().
- [b39b4f6] Added `getLineAndColumn` method to `Interval`.
- [255693c] Fixed [#282](https://github.com/harc/ohm/issues/282): Single-line comments can't appear after case name

## v15.3.0

### Notable changes:

- [b519a05] Added a new [_super-splice_ operator](https://github.com/harc/ohm/blob/master/doc/syntax-reference.md#super-splice) (`...`) to the Ohm language, which can be used to append and/or prepend cases to a supergrammar rule body.

## v15.2.1 - September 30, 2020

(Same as 15.2.0)

### Notable changes:

- [1986ee2] Eliminated dependency on 'inherits' package
- [e5fa522] Moved TypeScript dependencies to devDependencies

## v15.1.0 - September 24, 2020

### Notable changes:

- [7fe5b7c] Removed the dependency on the es6-symbol package
- [5b15169] Converted the Ohm codebase to more modern JS, and switched from Browserify
  to Webpack for bundling. (#264)

## v15.0.1 - August 23, 2020

The first _official_ stable release of Ohm! 🌭🎉

Going forward, Ohm will follow the [semantic versioning](https://semver.org/) convention.
This means that breaking changes to either the language or the API will only be introduced
in a new major version of the `ohm-js` package.

### Notable changes:

(Same as 15.0.0.)

**API**

Features:

- [1c286f6] The `message` and `shortMessage` properties of errors are now enumerable.
- [dec2846] Added a TypeScript type definition file (d.ts) for the extras submodule (#214)
- [369a1de] Prevent infinite loops during parsing, by throwing an error if a [repetition expression](https://github.com/harc/ohm/blob/master/doc/syntax-reference.md#repetition-operators---) consumes no input. (#211)

Fixes:

- [7857b8f] Fixed `npm install` issue with the 15.0.0 release (#260)
- [8202eff] Switched to Buffer.from, as `new Buffer` is deprecated in Node v10.
- [59b28be] CaseInsensitiveTerminal.toFailure() now passes the grammar arg through.
- [b9499e2] Crash w/ ERR_INVALID_CALLBACK in Node v10.0.0.
- [db8573c] Undefined errors with nested expression toFailure(...) (#218)

## v0.14.0 - November 3, 2017

### Notable changes:

**API**

- [753dc4d] Ohm's version number is now exposed as a top-level 'version' property
- [c5d7046] missingSemanticAction errors include an action call stack
- [f06ccbb] Range expressions now only work with single-character terminals. E.g.,
  `"a".."z"` is valid but `"foo".."bar"` is not.

## v0.13.0 - February 24, 2017

### Notable changes:

**Big stuff**

- Ohm now supports incremental parsing! See the new Matcher class, which
  can be instantiated for a grammar `g` via `g.matcher()`.

**Language**

- [75d1bc8] Update built-in `lower`, `upper`, and `unicodeLtmo` rules to be
  consistent with unicode-9.0.0
- [4f864a0] Add built-in rule `caseInsensitive` rule for case-insensitive
  string matching (fixes #162)

**API**

- [b63aa84] Remove MatchResult.prototype.getDiscardedSpaces()
- [7b455d2] Remove `children` and `childOffset` from TerminalNodes (fixes #176)

**Misc**

- [865c948] Add Typescript type declarations (#187)
- [798ea77] Show action call stack when a semantic action is missing (fixes #53)
- [482b693] Add VisitorFamily to extras (#156)

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
  - Previously, the grammar allowed inline rule declarations in any alternation, but it
    only really makes sense at the top level.
- [fdf4381]: Matching on structured data (Objects, Arrays, etc.) is no longer supported.
  - This was a feature that Ohm inherited from OMeta, but we found that we almost never
    used it in Ohm. Removing it allows significant simplification to the language, code,
    and documentation.

**API**

- [e497d47]: Like grammars, Semantics instances now have a `toRecipe` method

## v0.10.0 - May 2, 2016

### Notable changes:

**Language**

- [3ce66ea]: Allow leading pipe in rule bodies (suggested by Jason Merrill).
  - In rule definitions, the body may optionally begin with a `|` character, which will be ignored.
- [761d6ef]: `ListOf_some` and `ListOf_none` renamed to `NonemptyListOf` and `EmptyListOf`.
- [c548f01]: The built-in `spaces_` rule has been renamed to `spaces`.

**API**

- [22ff905]: No more default semantic action for \_terminal.
  - To duplicate the old behavior, you can write a "\_terminal" semantic action that just
    returns `this.primitiveValue`, as [in the math example](https://github.com/cdglabs/ohm/commit/22ff905b5842d52a8c8a63ef8186f574e01bf2e4#diff-215507e52f6cd81b5c49dc9cd72aae2eR390).
- [8efa687]: Expose pexprs as part of the public API (`ohm.pexprs`).
- #63: Semantics instances now include a built-in attribute named 'asIteration'.
  - This simplifies working with the built-in `ListOf` rule.
  - Needs documentation (#93)
- [7590d82]: Add "extras" module, with toAST() operation.
  - See the [documentation](./doc/extras.md) for more information.
- [e24a146]: New `isOptional` method on parse nodes.
  - See the [documentation](./doc/api-reference.md#parse-nodes) for more information.
- [64ee822]: New `getDiscardedSpaces` method on MatchResult, which makes Alex happy.
  - Needs documentation (#92)
