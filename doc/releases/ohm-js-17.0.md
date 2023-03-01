# Ohm v17.0

## Upgrading

### Namespace helpers removed

The top-level `namespace` and `extendNamespace` functions have been removed. They were never required — it was always possible to use a plain old object in any API that asked for a namespace.

For example, take the following code (which no longer works in v17+):

```js
const ns = ohm.createNamespace();
ns.G = ohm.grammar('G {}');
ns.G2 = ohm.grammar('G2 <: G {}', ns);
```

In Ohm v17 *and* in previous versions, the code could instead be written like this:

```js
const ns = {}; // <- Use a normal object literal
ns.G = ohm.grammar('G {}');
ns.G2 = ohm.grammar('G2 <: G {}', ns);
```

### Named exports only

When used as ES module, the `ohm-js` and `ohm-js/extras` modules now have *only* named exports, and no default export. This fixes some issues with the use of Ohm bundles (`.ohm-bundle` files) when used with JS module bundlers like Webpack and Rollup (e.g., [#377][issue-377]).

As a result, the following code will no longer work (unless your bundler supports [synthetic default imports](https://www.typescriptlang.org/tsconfig#allowSyntheticDefaultImports)):

```js
import ohm from 'ohm-js';
```

In Ohm v17, it should be written like this:

```js
import * as ohm from 'ohm-js';
```

See [#386](https://github.com/harc/ohm/issues/386) for more context on this change.

### `util` removed

The `util` object has been removed from Ohm's public API. The two methods that were relevant to grammar authors — `getLineAndColumn` and `getLineAndColumnMessage` — have been moved into the `extras` module.

Old code (no longer works):

```js
ohm.util.getLineAndColumnMessage(str, [startIdx, endIdx]);
```

New code (works in Ohm v17+):

```js
import {getLineAndColumnMessage} from 'ohm-js/extras';
// ...
getLineAndColumnMessage(str, [startIdx, endIdx]);
```

By the way, the `Interval` class also has a `getLineAndColumnMessage` method, which can be useful inside of semantic actions. For example, if you are using this method with the `sourceString` attribute, like this:

```js
getLineAndColumnMessage(aNode.sourceString, [startIdx, endIdx]);
```

...you can write it this way instead:

```js
aNode.source.getLineAndColumnMessage();
```

### `toAST` on built-in list rules

Ohm v17 changed the default behavior of `toAST` for the built-in list rules (`ListOf` and friends). Both the syntactic (`ListOf`, ...) and lexical versions (`listOf`, ...) are now represented as arrays, with the separators _discarded_. Previously, the syntactic versions were represented by arrays, but with separators _included_, and the lexical versions were represented as strings (just like other lexical rules).

See [#394](https://github.com/harc/ohm/issues/394) for the reasoning behind this change.

## Other changes

- The deprecated `grammarFromScriptElement` and `grammarsFromScriptElements` functions have been entirely removed.
- The `primitiveValue` property of nodes, which was deprecated in Ohm v16, has now been completely removed — use `Node.sourceString` instead.
