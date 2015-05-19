Ohm
===

[Ohm](https://gitlab.com/cdg/ohm) is a library and domain-specific language for parsing and pattern matching. You can use it to parse custom file formats, transform complex data structures, and quickly build parsers, interpreters, and compilers for programming languages. The _Ohm language_ is based on [parsing expression grammars](http://en.wikipedia.org/wiki/Parsing_expression_grammar) (PEGs), which are a formal way of describing syntax, similar to regular expressions and context-free grammars. The _Ohm library_ provides a JavaScript interface (known as Ohm/JS) for creating parsers and interpreters from the grammars you write.

Like its older sibling [OMeta](http://tinlizzie.org/ometa/), Ohm supports object-oriented grammar extension and allows pattern matching of arbitrary data structures (not just strings). One thing that distinguishes Ohm from other parsing tools is that it completely separates grammars from semantic actions. In Ohm, a grammar defines a language, and semantic actions specify what to do with valid inputs in that language. Semantic actions are written in the _host language_ -- e.g., for Ohm/JS, the host language is JavaScript. Ohm grammars, on the other hand, work without modification in any host language. This separation improves modularity, and makes both grammars and semantic actions easier to read and understand.

About PEGs
----------

Like a [context-free grammar](http://en.wikipedia.org/wiki/Context-free_grammar) (CFG), a PEG is a formal way to describe the syntax of a language. We use the term "language" loosely: formal grammars describe patterns, and anything that matches the pattern is said to be part of the _language_ described by that grammar. A PEG might describe a programming language, a file format, or something as simple as the set of valid North American phone numbers.

PEGs and CFGs share many concepts with regular expressions, but are generally more powerful and easier to understand. Compared to context-free grammars, the main advantage of PEGs is that they are never ambiguous, and as a result, a PEG maps directly to a top-down parser for the language it describes. For more on the history and theory of PEGs, see Bryan Ford's page on [Packrat Parsing and Parsing Expression Grammars](http://bford.info/packrat/).

Usage
-----

### Getting Started

For Node.js and io.js (**Note:** As soon as Ohm is ready for release, it will be published on NPM):

    git clone git@gitlab.com:cdg/ohm.git
    npm install -g --ignore-scripts ./ohm

Then require it from anywhere:

```js
var ohm = require('ohm');
var g = ohm.grammar('MyGrammar { greeting = "Hello" | "Hola" }');
var result = g.match('Hallo');
if (result.failed()) console.log(result.message);
```

For use in the browser, simply download [dist/ohm.js](./dist/ohm.js) or [dist/ohm.min.js](./dist/ohm.min.js), and add it as a script tag to your page:

```html
<script src="ohm.min.js"></script>
<script>
  var g = ohm.grammar('MyGrammar { greeting = "Hello" | "Hola" }');
  var result = g.match('hola');
  if (result.failed()) console.log(result.message);
</script>
```

### Basics

#### Instantiating Grammars

To use Ohm, you'll need a grammar that is written in the Ohm language. The grammar provides a formal definition of the language or data format that you want to parse. In the examples above, the grammar was simply stored as a string literal in the source code. This works for simple examples, but for larger grammars, you'll probably want to do things differently. If you are using Node or io.js, you can store the grammar in a separate file (e.g. 
'myGrammar.ohm') and use it like this:

```js
var fs = require('fs');
var ohm = require('ohm');
var myGrammar = ohm.grammar(fs.readFileSync('myGrammar.ohm').toString());
```

In the browser, you can put the grammar into a separate script element, with `type="text/ohm-js"`:

```html
<script type="text/ohm-js" id="grammarSrc">
  MyGrammar {
    greeting = "Hello" | "Hola"
  }
</script>
```

Then, you can instantiate the grammar like this:

```js
var myGrammar = ohm.grammarFromScriptElement();
```

If you have more than one script tag with `type="text/ohm-js"` in your document, you will need to pass the appropriate script tag as an argument:

```js
var myGrammar = ohm.grammarFromScriptElement(document.querySelector('#grammarSrc'));
```

To instantiate multiple grammars at once, use `ohm.grammars()` and `ohm.grammarsFromScriptElements()`.

#### Using Grammars

Once you've instantiated a grammar object, you can use the grammar's `match()` method:

```js
var userInput = 'Hello';
var m = myGrammar.match(userInput);
if (m.succeeded()) {
  console.log('Greetings, human.');
} else {
  console.log("That's not a greeting!");
}
```

For more information, see the [tutorial](./doc/tutorial.md) or the [reference](./doc/reference.md).

Contributing
------------

All you need to get started:

    git clone git@gitlab.com:cdg/ohm.git
    cd ohm
    npm install

### Some useful scripts

* `npm test` runs the unit tests.
* `npm run test-watch` re-runs the unit tests every time a file changes.
* `npm run build` builds [dist/ohm.js](./dist/ohm.js) and [dist/ohm.min.js](./dist/ohm.min.js), which are stand-alone bundles that can be included in a webpage.
* When editing Ohm's own grammar (in `src/ohm-grammar.ohm`), run `npm run bootstrap` to re-build Ohm and test your changes.

Before submitting a pull request, be sure to add tests, and ensure that `npm run prepublish` runs without errors.
