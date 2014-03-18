/*

TODO:

* Think about improving the implementation of syntactic rules' automatic space skipping:
  -- Could keep track of the current rule name by modifying the code (in Apply.eval) where enter and exit methods
     are called. (Would also want to keep track of whether the rule is syntactic to avoid re-doing that work
     at each application.)

* Consider borrowing (something like) the variable-not-otherwise-mentioned idea from Robby Findler's redex, as a way
  to make it easier for programmers to deal with keywords and identifiers.

* Think about a better way to deal with lists
  -- Built-in list operator?
  -- Parameterized rules? (But they're not so great for readability, and could be tricky for semantic action dicts.)

* Improve test coverage
  -- Add tests for scoping, e.g., "foo:a [bar:b baz:c]:d" should have 4 bindings.
     (Same kind of thing for nested string and lookahead expressions, their bindings should leak to the enclosing seq.)

* Think about foreign rule invocation
  -- Can't just be done in the same way as in OMeta b/c of the actionDict
  -- Will want to preserve the "no unnecessary semantic actions" guarantee
  -- The solution might be to enable the programmer to provide multiple actionDicts,
     but I'll have to come up with a convenient way to associate each with a particular grammar.

* Think about incremental parsing (good for editors)
  -- Basic idea: keep track of max index seen to compute a result
     (store this in memo rec as an int relative to curr pos)
  -- Ok to reuse memoized value as long as range from current index to max index hasn't changed
  -- Could be a cute workshop paper...


Syntax / language ideas:

* Syntax for rule declarations:

    foo == bar baz     (define)
    foo := bar baz     (override / replace)
    foo <= bar baz     (extend)

* Inline rules, e.g.,

    addExpr = addExpr:x '+' mulExpr:y {plus}
            | addExpr:x '-' mulExpr:y {minus}
            | mulExpr

  is syntactic sugar for

    addExpr = plus | minus | mulExpr,
    plus = addExpr:x '+' mulExpr:y,
    minus = addExpr:x '-' mulExpr:y

* In this example:

    foo = "bar"
    bar = 'abc'

  The foo rule says it wants the bar rule to match the contents of a string object. (The "s is a kind of parenthesis.)
  Then you could either say

    m.matchAll('abc', 'bar')

  or

    m.match('abc', 'foo')

  Both should succeed.

* About object matching

  Some issues:
  -- Should definitely allow pattern matching on each property's value. But what about property names?
  -- What to do about unspecified properties?
  -- Syntax: JSON uses colons to separate property names and values. Will look bad w/ bindings, e.g.,
     {foo: number:n} (ewwww)

  Current strawman:
  -- Require property names to be string literals (not patterns), only allow pattern matching on their values.
  -- Allow an optional '...' as the last pattern, that would match any unspecified properties.
       {'foo': number, 'bar': string, 'baz': 5, ...}
     Might even allow the ... to be bound to a variable that would contain all of those properties.
  -- Consider changing binding syntax from expr:name to expr.name
     (More JSON-friendly, but it doesn't work well with ... syntax. But maybe it's not so important to be able to bind
     the rest of the properties and values anyway, since you can always bind the entire object.)


Optimization ideas:

* Optimize 'binds' -- should pre-allocate an array of bindings instead of doing pushes, throwing away arrays on fail
  (see Alt), etc.

* Consider adding an additional code generation step that generates efficient code from the ASTs, instead of
  interpreting them directly.

* Don't bother creating thunks / lists of thunks when value is not needed (OMeta did this)
  -- E.g., in "foo = space* bar" the result of space* is not needed, so don't bother creating a list of thunks / values
  -- Could just return undefined (anything except fail)

* Get rid of unnecessary Seqs and Alts (OMeta did this too)

*/

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

require('../dist/ohm-grammar.js');

var Builder = require('./Builder.js');
var Namespace = require('./Namespace.js');
var errors = require('./errors.js');

var awlib = require('awlib');
var unescapeChar = awlib.stringUtils.unescapeChar;
var browser = awlib.browser;

var thisModule = exports;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function makeGrammarActionDict(optNamespace) {
  var builder;
  return {
    space:                      function(env) {},
    space_multiLine:            function()    {},
    space_singleLine:           function()    {},

    _name:                      function()    { return this.interval.contents; },
    nameFirst:                  function(env) {},
    nameRest:                   function(env) {},

    name:                       function(env) { return env.n; },

    namedConst:                 function(env) { return env.value; },
    namedConst_undefined:       function()    { return undefined; },
    namedConst_null:            function()    { return null; },
    namedConst_true:            function()    { return true; },
    namedConst_false:           function()    { return false; },

    string:                     function(env) {
                                  return env.cs.map(function(c) { return unescapeChar(c); }).join('');
                                },
    sChar:                      function()    { return this.interval.contents; },
    regexp:                     function(env) { return new RegExp(env.e); },
    reCharClass:                function()    { return this.interval.contents; },
    number:                     function()    { return parseInt(this.interval.contents); },

    Alt:                        function(env) { return env.value; },
    Alt_rec:                    function(env) { return builder.alt(env.x, env.y); },

    Term:                       function(env) { return env.value; },
    Term_inline:                function(env) { return builder.inline(builder.currentRuleName + '_' + env.n, env.x); },

    Seq:                        function(env) { return builder.seq.apply(builder, env.value); },

    Factor:                     function(env) { return env.value; },
    Factor_bind:                function(env) { return builder.bind(env.x, env.n); },

    Iter:                       function(env) { return env.value; },
    Iter_star:                  function(env) { return builder.many(env.x, 0); },
    Iter_plus:                  function(env) { return builder.many(env.x, 1); },
    Iter_opt:                   function(env) { return builder.opt(env.x); },

    Pred:                       function(env) { return env.value; },
    Pred_not:                   function(env) { return builder.not(env.x); },
    Pred_lookahead:             function(env) { return builder.la(env.x); },

    Base:                       function(env) { return env.value; },
    Base_undefined:             function()    { return builder.prim(undefined); },
    Base_null:                  function()    { return builder.prim(null); },
    Base_true:                  function()    { return builder.prim(true); },
    Base_false:                 function()    { return builder.prim(false); },
    Base_application:           function(env) { return builder.app(env.ruleName); },
    Base_prim:                  function(env) { return builder.prim(env.value); },
    Base_lst:                   function(env) { return builder.lst(env.x); },
    Base_str:                   function(env) { return builder.str(env.x); },
    Base_paren:                 function(env) { return env.x; },
    Base_obj:                   function(env) { return builder.obj([], env.lenient); },
    Base_objWithProps:          function(env) { return builder.obj(env.ps, env.lenient); },

    Props:                      function(env) { return env.value; },
    Props_base:                 function(env) { return [env.p]; },
    Props_rec:                  function(env) { return [env.p].concat(env.ps); },
    Prop:                       function(env) { return {name: env.n, pattern: env.p}; },

    Rule:                       function(env) { return env.value; },
    Rule_define:                function(env) {
                                  builder.currentRuleName = env.n;
                                  return builder.define(env.n, env.b);
                                },
    Rule_override:              function(env) {
                                  builder.currentRuleName = env.n;
                                  return builder.override(env.n, env.b);
                                },
    Rule_extend:                function(env) {
                                  builder.currentRuleName = env.n;
                                  return builder.extend(env.n, env.b);
                                },

    SuperGrammar:               function(env) { builder.setSuperGrammar(env.value); },
    SuperGrammar_qualified:     function(env) { return thisModule.namespace(env.ns).getGrammar(env.n); },
    SuperGrammar_unqualified:   function(env) {
                                  if (optNamespace) {
                                    return optNamespace.getGrammar(env.n);
                                  } else {
                                    throw new errors.UndeclaredGrammarError(env.n);
                                  }
                                },

    Grammar:                    function(env) {
                                  builder = new Builder();
                                  builder.setName(env.n);
                                  env.s;  // force evaluation
                                  env.rs;  // force evaluation
                                  return builder.build(optNamespace);
                                },
    Grammars:                   function(env) { return env.value; }
  };
}

function compileAndLoad(source, whatItIs, optNamespace) {
  var thunk = thisModule._ohmGrammar.matchContents(source, whatItIs);
  if (thunk) {
    return thunk(makeGrammarActionDict(optNamespace));
  } else {
    // TODO: improve error message (show what part of the input is wrong, what was expected, etc.)
    browser.error('invalid input in:', source);
  }
}

function makeGrammar(source, optNamespace) {
  return compileAndLoad(source, 'Grammar', optNamespace);
}

function makeGrammars(source, optNamespace) {
  return compileAndLoad(source, 'Grammars', optNamespace);
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

// Stuff that users should know about

var namespaces = {};
exports.namespace = function(name) {
  if (namespaces[name] === undefined) {
    namespaces[name] = new Namespace(name);
  }
  return namespaces[name];
};

exports.make = function(recipe) {
  return recipe(thisModule);
};

exports.makeGrammar = makeGrammar;
exports.makeGrammars = makeGrammars;

// Stuff that's only here for bootstrapping, testing, etc.

exports._builder = function() {
  return new Builder();
};

exports._makeGrammarActionDict = makeGrammarActionDict;

var ohmGrammar;
Object.defineProperty(exports, '_ohmGrammar', {
  get: function() {
    if (!ohmGrammar) {
      ohmGrammar = this._ohmGrammarFactory(this);
    }
    return ohmGrammar;
  }
});

