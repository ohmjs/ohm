What is this thing?
===================

Ohm is a new object-oriented language for pattern matching. Like its older sibling [OMeta](https://github.com/alexwarth/ometa-js), it is based on [Parsing Expression Grammars (PEGs)](http://en.wikipedia.org/wiki/Parsing_expression_grammar), and [supports pattern matching on arbitrary data](http://tinlizzie.org/~awarth/papers/dls07.pdf), e.g., strings, lists, and objects.

One feature that distinguishes Ohm from OMeta and other parsing DSLs / frameworks is that Ohm completely separates grammars from semantic actions. In Ohm, a grammar defines a language, and semantic actions specify what to do with valid inputs in that language. The benefits of this separation of concerns include:

* __Improved readability__
    - Grammars are *pure*, not cluttered with semantic actions.
    - The meaning of the semantic actions is also more obvious when they're seen in isolation, and not scattered throughout a grammar, amidst Kleene-*s and other control structures.
* __Better modularity__
    - Grammars and semantic actions can be extended independently, using familiar object-oriented mechanisms.
    - The same grammar can be used with different semantic actions to (for instance) parse, syntax highlight, and compile programs. (In fact, Ohm lets you do all of these things without making multiple passes over the input.)
* __Portability__
    - The same Ohm grammar can be used, without modification, with Ohm implementations that run on top of different languages, e.g., Ohm/JS and Ohm/Scheme. (Note that semantic actions are still language-dependent.)

Another interesting aspect of Ohm is that it applies semantic actions *lazily*, i.e., a semantic action is only evaluated if and when its result is required, and never more than once. The benefits of laziness are:

* __A more sensible programming model__
    - When writing semantic actions, programmers don't have to worry about backtracking. This is especially nice when you're writing side-effectful semantic actions.
* __Semantic actions (not the grammar!) control the evaluation of sub-expressions__
    - Like the visitor design pattern, this enables programmers to specify what to do *before* and *after* the semantic actions of sub-epressions are evaluated.
    - Unlike visitors, laziness enables different semantic actions (i.e., different uses of the same grammar) to customize the order in which sub-expressions are evaluated to suit their own needs.
* __Efficiency__
    - No semantic actions are evaluated if the input is invalid.
    - No semantic actions are evaluated for the failed branches of an alternation (`|`) expression, i.e., for anything that causes backtracking.
    - If a semantic action doesn't mention a particular sub-expression, that sub-expression's semantic actions will never be evaluated.

Notes for users
===============

Installation
------------

    git clone git@gitlab.com:cdg/ohm.git
    npm install -g --ignore-scripts ohm/.

**Note:** As soon as the language is a little more mature and I get around to writing some documentation, I'll publish the npm module so that people won't have to clone this repository.

Using Ohm
---------

For now, the best place to start is the example code in `demo/index.html`. It defines a simple grammar of arithmetic expressions and shows how you can write *semantic action dictionaries* that make it do interesting things.

*(A proper tutorial is coming soon.)*

Notes for contributors
======================

To get started
--------------

    git clone git@gitlab.com:cdg/ohm.git
    cd ohm
    npm install .   # this will install the required dependencies

Some useful scripts
-------------------

* `npm test` runs the unit tests
* `npm test-watch` runs the unit tests every time a file changes
* `npm run build` builds `dist/ohm.js` and `dist/ohm.min.js`, which are stand-alone "binaries" that can be included in a webpage. (The latter is a minified version of the former.)
* `npm run build-ohm-grammar` generates `dist/ohm-grammar.js` from `src/ohm-grammar.ohm`
