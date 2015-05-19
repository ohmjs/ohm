# Ohm Philosophy

One feature that distinguishes Ohm from OMeta and other parsing DSLs / frameworks is that Ohm completely separates grammars from semantic actions. In Ohm, a grammar defines a language, and semantic actions specify what to do with valid inputs in that language. The benefits of this separation of concerns include:

* __Improved readability__
    - Grammars are *pure*, not cluttered with semantic actions.
    - The meaning of the semantic actions is also more obvious when they're seen in isolation, and not scattered throughout a grammar, amidst Kleene-*s and other control structures.
* __Better modularity__
    - Grammars and semantic actions can be extended independently, using familiar object-oriented mechanisms.
    - The same grammar can be used with different semantic actions to (for instance) parse, syntax highlight, and compile programs. (In fact, Ohm lets you do all of these things without taking multiple passes over the input.)
* __Portability__
    - The same Ohm grammar can be used, without modification, with Ohm implementations that run on top of different languages, e.g., Ohm/JS and Ohm/Scheme. (Note that semantic actions are still language-dependent.)

Another interesting aspect of Ohm is that it applies semantic actions *lazily*, i.e., a semantic action is only evaluated if and when its result is required. The benefits of laziness are:

* __A more sensible programming model__
    - When writing semantic actions, programmers don't have to worry about backtracking. This is especially nice when you're writing side-effectful semantic actions.
* __Semantic actions (not the grammar!) control the evaluation of sub-expressions__
    - Like the visitor design pattern, this enables programmers to specify what to do *before* and *after* the semantic actions of sub-epressions are evaluated.
    - Unlike visitors, laziness enables different semantic actions (i.e., different uses of the same grammar) to customize the order in which sub-expressions are evaluated to suit their own needs.
* __Efficiency__
    - No semantic actions are evaluated if the input is invalid.
    - No semantic actions are evaluated for the failed branches of an alternation (`|`) expression, i.e., for anything that causes backtracking.
    - If a semantic action doesn't mention a particular sub-expression, that sub-expression's semantic actions will never be evaluated.
