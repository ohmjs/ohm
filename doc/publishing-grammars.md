# Publishing Grammars

One of the core ideas behind Ohm is that _grammars are APIs_. If you have
developed a grammar for a particular language and would like to share it
for other people to use and build upon, here's what we suggest:

## Module Exports

By convention, modules should export an object with a `grammar` property, and
optionally a `semantics` property. For example, see the [ES5](https://github.com/cdglabs/ohm/blob/master/examples/ecmascript/es5.js)
module in the `examples/` directory. If a single package contains multiple
languages, each language should be exported as a separate object. E.g., a
package supporting multiple versions of Python might be used like this:

```js
var python2 = require('./your-python-package').python2;
var result = python2.grammar.match('print 3');
python2.createSemantics(result).eval();
```

To package a single primary language along with other variants, you can expose
the primary language from the top-level module, and the other languages as
separate modules within the same package:

```js
var smalltalk = require('./your-smalltalk-package');
var smalltalk72 = require('./your-smalltalk-package/smalltalk72');
```

## Package Naming

To help users find your package, we suggest using a name of the form "ohm-grammar-someLanguage". E.g., the ES5 grammar in the `examples` directory is published on NPM as [ohm-grammar-ecmascript](https://www.npmjs.com/package/ohm-grammar-ecmascript).
