/* eslint-env browser */

'use strict';

// Web Worker that generates examples.
// communicates with 'exampleGenerationUI.js'

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else { // inside web worker
    root.importScripts(
      '../dist/ohm.js',
      'utils.js',
      'third_party/checked-emitter-1.0.1.js',
      './httpUtil.js',
      './codbUtil.js'
    );
    initModule(root, root.ohm, root.utils, root.httpUtil, root.codbUtil, root.overrides);
  }
})(this, function(workerGlobalScope, ohm, utils, httpUtil, codbUtil, optOverrides) {
  var self = workerGlobalScope;

  // -------------------------------------------------------
  // HELPERS
  // -------------------------------------------------------

  function randInt(first, optSecond) {
    var max = optSecond || first;
    var min;
    if (!optSecond) {
      min = 0;
    } else {
      min = first;
    }

    return min + Math.floor(max * Math.random());
  }

  // -------------------------------------------------------
  // MAIN WORKER CODE
  // -------------------------------------------------------

  self.postMessage('WORKER STARTED');
  var grammar;
  var grammarName;
  var semantics;

  var generator;

  var overrides = optOverrides || {
    ident: function(g, ex, syn, args) {
      return {needHelp: true};
    },
    ctor: function(g, ex, syn, args) {
      return {needHelp: true};
    },
    letter: function(g, ex, syn, args) {
      if (randInt(2) === 0) {
        return {example: String.fromCharCode(randInt(26) + 'a'.charCodeAt(0))};
      } else {
        return {example: String.fromCharCode(randInt(26) + 'A'.charCodeAt(0))};
      }
    }
  };

  self.addEventListener('message', function(e) {
    self.postMessage(e.data.name);
    switch (e.data.name) {
      case 'initialize':
        grammarName = e.data.grammarName;
        var baseUrl = this.baseUrl || codbUtil.localUrl;
        httpUtil.$http(baseUrl + '/_design/ohm/_rewrite/grammars/' + grammarName)
          .get({}, function(err, grammarString) {
            if (err) {
              codbUtil.errorWithPrefix('GET grammar ' + this.grammarName + ': ')(err);
              return;
            }

            grammar = ohm.grammar(grammarString);
            initializeSemantics(grammar);

            // flag to disable starting of process for testing
            var runStart = true;
            if (e.data.hasOwnProperty('start')) {
              runStart = e.data.runStart;
            }

            if (runStart) {
              start();
            }
            self.postMessage('started:worker');
          });
        break;
      case 'request:examples':
        var ruleName = e.data.args[0];

        var examplesForRule = generator.exampleDB.getExamples(ruleName);
        self.postMessage({name: 'received:examples',
                          args: [ruleName, examplesForRule]});
        break;
      case 'update:neededExamples':
        var neededExamples = utils.difference(
          Object.keys(grammar.rules),
          Object.keys(generator.exampleDB.examples)
        );

        self.postMessage({name: 'received:neededExamples',
                          args: [neededExamples]});
        break;
      case 'add:userExample':
        ruleName = e.data.args[0];
        var example = e.data.args[1];
        generator.processExampleFromUser(example, ruleName);
        break;
    }
  });

  function ExampleGenerator() {
    var self = this;
    var codbUrl = codbUtil.localUrl; // TODO: codbUrl
    this.exampleDB = new codbUtil.ExampleDatabase(grammar, codbUrl);
    this.exampleDB.events.addListener('initialized:DB', function() {
      self.examplesNeeded = utils.difference(
        Object.keys(grammar.rules),
        Object.keys(self.exampleDB.examples)
      );
    });

    this.rules = initialRules(grammar);
    this.numStepsWithoutChange = 0;
    this.currentRuleIndex = 0;
  }

  ExampleGenerator.prototype.processExampleFromUser = function(example, optRuleName) {
    var that = this;

    if (optRuleName) {
      var match = grammar.match(example, optRuleName);
      if (match.succeeded()) {
        semantics(match).addPiecesToDict(this.exampleDB);
      }
    } else {
      // try all rules
      Object.keys(grammar.rules).forEach(function(ruleName) {
        var match = grammar.match(example, ruleName);
        if (match.succeeded()) {
          semantics(match).addPiecesToDict(this.exampleDB);
        }
      });
    }

    var oldSize = this.examplesNeeded.length;
    this.examplesNeeded = this.examplesNeeded.filter(function(ruleName) {
      return !that.exampleDB.examples.hasOwnProperty(ruleName);
    });
    if (this.examplesNeeded.length < oldSize) {
      self.postMessage({name: 'received:neededExamples',
                        args: [this.examplesNeeded]});
    }

    // resume generation process on user example
    if (this.paused) {
      this.paused = false;
      runComputationStep(generator, 100);
    }
  };

  ExampleGenerator.prototype.next = function() {
    var currentRuleName = this.rules[this.currentRuleIndex];

    var that = this;
    var lastExamplesNeeded = this.examplesNeeded.slice();
    utils.repeat(2, function() {
      that.generateExampleForRule(currentRuleName);
    });

    if (this.examplesNeeded.length !== lastExamplesNeeded.length) {
      this.numStepsWithoutChange = 0;
    } else {
      this.numStepsWithoutChange++;
      if (this.numStepsWithoutChange > 2 * this.rules.length) {
        this.paused = true;
      }
    }

    this.currentRuleIndex = (this.currentRuleIndex + 1) % this.rules.length;
  };

  ExampleGenerator.prototype.generateExampleForRule = function(ruleName) {
    var that = this;
    var rulePExpr = parseToPExpr(ruleName);

    var example;
    if (overrides.hasOwnProperty(ruleName)) {
      example = overrides[ruleName](
        grammar, this.exampleDB.examples, isSyntactic(rulePExpr.ruleName),
        rulePExpr.args
      );
    } else {
      example = grammar.rules[rulePExpr.ruleName].body.generateExample(
        grammar, this.exampleDB.examples, isSyntactic(rulePExpr.ruleName),
        rulePExpr.args
      );
    }

    if (example.hasOwnProperty('value') &&
        grammar.match(example.value, ruleName).succeeded()) {
      if (utils.includes(this.examplesNeeded, ruleName)) {
        this.examplesNeeded = this.examplesNeeded.filter(function(rn) {
          return rn !== ruleName;
        });
        self.postMessage('generated ' + ruleName +
                         ' ' + JSON.stringify(this.examplesNeeded));
        self.postMessage({name: 'received:neededExamples',
                          args: [this.examplesNeeded]});
      }
      this.exampleDB.addExample(ruleName, example.value);
    }

    if (example.hasOwnProperty('examplesNeeded')) {
      example.examplesNeeded.forEach(function(needed) {
        if (!utils.includes(that.rules, needed)) {
          that.rules.push(needed);
        }
      });
    }
  };

  function start() {
    generator = new ExampleGenerator();
    generator.exampleDB.events.addListener('initialized:DB', function() {
      runComputationStep(generator, 100);
    });
  }

  function runComputationStep(generator, n) {
    n = n || 1;

    // Attempt to generate several examples for a given rule
    // to increase likelihood of generating several branches
    utils.repeat(n, function() {
      generator.next();
    });

    if (generator.examplesNeeded.length > 0 && !generator.paused) {
      setTimeout(function() { runComputationStep(generator, n); }, 0);
    }
  }

  // --------------------------------------------------------------
  // HELPER FUNCTIONS
  // --------------------------------------------------------------

  function initializeSemantics(grammar) {
    semantics = grammar.createSemantics();

    semantics.addOperation('addPiecesToDict(db)', {
      _nonterminal: function(children) {
        var ruleName = this.ctorName;
        var db = this.args.db;

        db.addExample(ruleName, this.source.contents);

        children.forEach(function(child) {
          child.addPiecesToDict(db);
        });
      },
      _terminal: function() {
        return;
      }
    });
  }

  function initialRules(grammar) {
    var rules = [];
    Object.keys(grammar.rules).forEach(function(ruleName) {
      if (!isParameterized(ruleName, grammar)) {
        rules.push(ruleName);
      }
    });
    return rules;
  }

  function isParameterized(ruleName, grammar) {
    return grammar.rules[ruleName].formals.length > 0;
  }

  function parseToPExpr(ruleName) {
    var match = ohm.ohmGrammar.match(ruleName, 'Base_application');
    return ohm._buildGrammar(match);
  }

  function isSyntactic(ruleName) {
    return ruleName.charAt(0).toUpperCase() === ruleName.charAt(0);
  }

  return {ExampleGenerator: ExampleGenerator};
});
