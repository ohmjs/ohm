Ohm
===

[![Build Status](https://img.shields.io/travis/cdglabs/ohm.svg?style=flat-square)](https://travis-ci.org/cdglabs/ohm) 
[![NPM](https://img.shields.io/npm/v/ohm-js.svg?style=flat-square)](https://www.npmjs.com/package/ohm-js)

[Ohm](https://github.com/cdglabs/ohm) is a library and domain-specific language for parsing and
pattern matching. You can use it to parse custom file formats, transform complex data structures,
and quickly build parsers, interpreters, and compilers for programming languages. The _Ohm language_
is based on [parsing expression grammars](http://en.wikipedia.org/wiki/Parsing_expression_grammar)
(PEGs), which are a formal way of describing syntax, similar to regular expressions and context-free
grammars. The _Ohm library_ provides a JavaScript interface (known as Ohm/JS) for creating parsers,
interpreters, and more from the grammars you write.

Like its older sibling [OMeta](http://tinlizzie.org/ometa/), Ohm supports object-oriented grammar
extension and allows pattern matching on structured data as well as strings. One thing that
distinguishes Ohm from other parsing tools is that it completely separates grammars from semantic
actions. In Ohm, a grammar defines a language, and semantic actions specify what to do with valid
inputs in that language. Semantic actions are written in the _host language_ -- e.g., for Ohm/JS,
the host language is JavaScript. Ohm grammars, on the other hand, work without modification in any
host language. This separation improves modularity, and makes both grammars and semantic actions
easier to read and understand. Currently, JavaScript is the only host language, but as the API
stabilizes, we hope to have implementations for other languages.

Learn more about the Ohm philosophy [here](doc/philosophy.md).

Getting Started
---------------

The easiest way to get started with Ohm is to play with one of the following examples on JSFiddle:

- [Basic parsing example](http://jsfiddle.net/pdubroy/p3b1v2xb/)
- [Arithmetic example with semantics](http://jsfiddle.net/pdubroy/15k63qae/)

### Resources

- There's no tutorial yet, but the [math example](examples/math/index.html) is extensively commented and is probably the best place to start.
- [Examples](examples/)
- [Documentation](doc/index.md)
- Ask questions and give us feedback in the [Ohm Google Group](https://groups.google.com/a/cdglabs.org/forum/#!forum/ohm).

### Installation

For use in the browser:

-  Download [ohm.js](https://cdglabs.github.io/ohm/dist/ohm.js) (development version, with full source and comments) or [ohm.min.js](https://cdglabs.github.io/ohm/dist/ohm.min.js) (a minified version for faster page loads).
-  Add a new script tag to your page, and set the `src` attribute to the path of the file you just downloaded. E.g.:
    ```html
    <script src="ohm.js"></script>
    ```

    This creates a global variable named `ohm`.

If you are using Node.js, you can just install the `ohm-js` package using [npm](http://npmjs.org):

    npm install ohm-js

This will install Ohm in the local node_modules folder. Use `require` to access it from a Node script:

```js
var ohm = require('ohm-js');
```

### Basics

#### Defining Grammars

![Instantiating a grammar](http://www.cdglabs.org/ohm/doc/images/instantiating-grammars.png)

To use Ohm, you need a grammar that is written in the Ohm language. The grammar provides a formal
definition of the language or data format that you want to parse. There are a few different ways
you can define an Ohm grammar:

- Define the grammar directly in a JavaScript string and instantiate it using `ohm.grammar()`:

    ```js
    var myGrammar = ohm.grammar('MyGrammar { greeting = "Hello" | "Hola" }');
    ```

    This is the simplest option, but it can be awkward to define larger grammars this way.

- **Recommended when running in the browser:** Embed the grammar source inside its own `<script>` tag with the attribute `type="text/ohm-js"`, and instantiate it using `ohm.grammarFromScriptElement()`:

    ```html
    <script type="text/ohm-js">
      MyGrammar {
        greeting = "Hello" | "Hola"
      }
    </script>
    <script>
      var myGrammar = ohm.grammarFromScriptElement();
    </script>
    ```

- **Recommended with Node.js:** Define the grammar in a separate file, read the file's contents and instantiate it using `ohm.grammar(contents)`:

    In `myGrammar.ohm`:

        MyGrammar {
          greeting = "Hello" | "Hola"
        }

    In JavaScript:

    ```js
    var fs = require('fs');
    var contents = fs.readFileSync('myGrammar.ohm');
    var myGrammar = ohm.grammar(contents);
    ```

For more information, see [Instantiating Grammars](doc/api-reference.md#instantiating-grammars) in the API reference.

#### Using Grammars

![Matching input](http://www.cdglabs.org/ohm/doc/images/matching.png)

<script type="text/markscript">
  // The duplication here is required because Markscript only executes top-level code blocks.
  // TODO: Consider fixing this in Markscript.
  var ohm = require('ohm-js');
  var myGrammar = ohm.grammar('MyGrammar { greeting = "Hello" | "Hola" }');
</script>

Once you've instantiated a grammar object, use the grammar's `match()` method to recognize input:

```js
var userInput = 'Hello';
var m = myGrammar.match(userInput);
if (m.succeeded()) {
  console.log('Greetings, human.');
} else {
  console.log("That's not a greeting!");
}
```

The result is a MatchResult object. You can use the `succeeded()` and `failed()` methods to see whether the input was recognized or not.

For more information, see the [main documentation](doc/index.md).

### Debugging

Ohm has two tools to help you debug grammars: a text trace, and a graphical visualizer. The
visualizer is still under development (i.e., it might be buggy!) but it can still be useful.

[![Ohm Visualizer](http://www.cdglabs.org/ohm/doc/images/visualizer-small.png)](http://www.cdglabs.org/ohm/visualizer/)

You can [try the visualizer online](http://www.cdglabs.org/ohm/visualizer/), or if you have an Ohm checkout, open `visualizer/index.html` in your web browser.

To see the text trace for a grammar `g`, just use the [`g.trace()`](./doc/api-reference.md#trace)
method instead of `g.match`. It takes the same arguments, but instead of returning a MatchResult
object, it returns a Trace object -- calling its `toString` method returns a string describing
all of the decisions the parser made when trying to match the input. For example, here is the
result of `g.trace('ab').toString()` for the grammar `G { start = letter+ }`:

<script type="text/markscript">
  markscript.transformNextBlock(function(code) {
    var trace = ohm.grammar('G { start = letter+ }').trace('ab');
    assert.equal(trace.toString().trim(), code.trim());
  });
</script>

```
ab         ✓ start ⇒  "ab"
ab           ✓ letter+ ⇒  "ab"
ab             ✓ letter ⇒  "a"
ab                 ✓ lower ⇒  "a"
ab                   ✓ Unicode {Ll} character ⇒  "a"
b              ✓ letter ⇒  "b"
b                  ✓ lower ⇒  "b"
b                    ✓ Unicode {Ll} character ⇒  "b"
               ✗ letter
                   ✗ lower
                     ✗ Unicode {Ll} character
                   ✗ upper
                     ✗ Unicode {Lu} character
                   ✗ unicodeLtmo
                     ✗ Unicode {Ltmo} character
             ✓ end ⇒  ""
```

Contributing
------------

All you need to get started:

    git clone https://github.com/cdglabs/ohm.git
    cd ohm
    npm install

**NOTE:** We recommend using the latest Node.js stable release (>=0.12.1) for
development. Some of the JSDOM-based tests are flaky on io.js, and other tests
will reliably fail on older versions of Node.

### Some useful scripts

* `npm test` runs the unit tests.
* `npm run test-watch` re-runs the unit tests every time a file changes.
* `npm run build` builds [dist/ohm.js](./dist/ohm.js) and [dist/ohm.min.js](./dist/ohm.min.js),
  which are stand-alone bundles that can be included in a webpage.
* When editing Ohm's own grammar (in `src/ohm-grammar.ohm`), run `npm run bootstrap` to re-build Ohm
  and test your changes.

Before submitting a pull request, be sure to add tests, and ensure that `npm run prepublish` runs
without errors.
