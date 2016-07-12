/* eslint-env browser */

'use strict';

self.importScripts('../dist/ohm.js', 'utils.js');

// Web Worker that generates examples.
// communicates with 'exampleGenerationUI.js'

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohm, root.utils);
  }
})(this, function(ohm, utils) {
  postMessage('WORKER STARTED');
  var grammar;

  var examplePieces = {};
  var generator;

  var overrides = {
    ident: function(g, ex, syn, args) {
      return {needHelp: true};
    },
    letter: function(g, ex, syn, args) {
      if (Math.floor(Math.random() * 2) === 0) {
        return {example: String.fromCharCode(Math.floor(26 * Math.random()) + 'a'.charCodeAt(0))};
      } else {
        return {example: String.fromCharCode(Math.floor(26 * Math.random()) + 'A'.charCodeAt(0))};
      }
    }
  };

  self.addEventListener('message', function(e) {
    postMessage(e.data.name);
    switch (e.data.name) {
      case 'initialize':
        /* eslint-disable no-eval */
        grammar = ohm.makeRecipe(eval(e.data.recipe));
        /* eslint-enable no-eval */

        start();
        break;
      case 'request:examples':
        var ruleName = e.data.args[0];

        var examplesForRule = examplePieces[ruleName] || null;
        self.postMessage({name: 'received:examples',
                          args: [ruleName, examplesForRule]});
        break;
      case 'update:neededExamples':
        var neededExamples = utils.difference(
          Object.keys(grammar.ruleBodies),
          Object.keys(examplePieces)
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
  }, false);

  function addPiecesToDict(trace, examples) {
    if (trace.expr.constructor.name === 'Terminal') {
      return;
    } else {
      if (trace.expr.constructor.name === 'Apply') {
        var ruleName = trace.expr.toString();
        if (!examples.hasOwnProperty(ruleName)) {
          examples[ruleName] = [];
        }

        if (!examples[ruleName].includes(trace.interval.contents)) {
          examples[ruleName].push(trace.interval.contents);
        }
      }
      trace.children
           .filter(function(child) { return child.succeeded; })
           .forEach(function(child) { return addPiecesToDict(child, examples); });
    }
  }

  function ExampleGenerator(examplePieces) {
    this.examplePieces = examplePieces;
    this.rules = initialRules(grammar);
    this.examplesNeeded = utils.difference(
      Object.keys(grammar.ruleBodies),
      Object.keys(examplePieces)
    );
    this.currentRuleIndex = 0;
  }

  ExampleGenerator.prototype.processExampleFromUser = function(example, optRuleName) {
    if (optRuleName) {
      var trace = grammar.trace(example, optRuleName);
      if (trace.succeeded) {
        addPiecesToDict(trace, examplePieces);
      }
    }

    utils.objectForEach(grammar.ruleBodies, function(ruleName) {
      var trace = grammar.trace(example, ruleName);
      if (trace.succeeded) {
        addPiecesToDict(trace, examplePieces);
      }
    });

    var oldSize = this.examplesNeeded.length;
    this.examplesNeeded = this.examplesNeeded.filter(function(ruleName) {
      return !examplePieces.hasOwnProperty(ruleName);
    });
    if (this.examplesNeeded.length < oldSize) {
      self.postMessage({name: 'received:neededExamples',
                        args: [this.examplesNeeded]});
    }
  };

  ExampleGenerator.prototype.next = function() {
    var that = this;
    var currentRuleName = this.rules[this.currentRuleIndex];

    utils.repeat(2, function() {
      that.examplesNeeded =
        generateExampleForRule(that.rules,
                               currentRuleName,
                               that.examplesNeeded);
    });

    this.currentRuleIndex = (this.currentRuleIndex + 1) % this.rules.length;
  };

  function runComputationStep(generator, n) {
    n = n || 1;

    utils.repeat(n, function() {
      generator.next();
    });

    if (generator.examplesNeeded.length > 0) {
      setTimeout(function() { runComputationStep(generator, n); }, 0);
    }
  }

  function start() {
    generator = new ExampleGenerator(examplePieces);
    runComputationStep(generator, 100);
  }

  // HELPER FUNCTIONS

  function initialRules(grammar) {
    var rules = [];
    utils.objectForEach(grammar.ruleBodies, function(ruleName, ruleBody) {
      if (!parametrized(ruleName, grammar)) {
        rules.push(ruleName);
      }
    });
    return rules;
  }

  function generateExampleForRule(rules, ruleName, examplesNeeded) {
    var rulePExpr = parseToPExpr(ruleName);

    var example;
    if (overrides.hasOwnProperty(ruleName)) {
      example = overrides[ruleName](
        grammar, examplePieces, isSyntactic(rulePExpr.ruleName),
        rulePExpr.args
      );
    } else {
      example = grammar.ruleBodies[rulePExpr.ruleName].generateExample(
        grammar, examplePieces, isSyntactic(rulePExpr.ruleName),
        rulePExpr.args
      );
    }

    if (example.hasOwnProperty('example') &&
        grammar.match(example.example, ruleName).succeeded()) {
      if (examplesNeeded.includes(ruleName)) {
        examplesNeeded = examplesNeeded.filter(function(rn) {
          return rn !== ruleName;
        });
        self.postMessage('generated ' + ruleName +
                         ' ' + JSON.stringify(examplesNeeded));
        self.postMessage({name: 'received:neededExamples',
                          args: [examplesNeeded]});
      }
      if (!examplePieces.hasOwnProperty(ruleName)) {
        examplePieces[ruleName] = [];
      }
      if (!examplePieces[ruleName].includes(example.example)) {
        examplePieces[ruleName].push(example.example);
      }
    }

    if (example.hasOwnProperty('examplesNeeded')) {
      example.examplesNeeded.forEach(function(needed) {
        if (!rules.includes(needed)) {
          rules.push(needed);
        }
      });
    }

    return examplesNeeded;
  }

  function parametrized(ruleName, grammar) {
    return grammar.ruleFormals[ruleName].length > 0;
  }

  function parseToPExpr(ruleName) {
    return ohm._buildGrammar(ohm.ohmGrammar.match(ruleName, 'Base_application'));
  }

  function isSyntactic(ruleName) {
    return ruleName.charAt(0).toUpperCase() === ruleName.charAt(0);
  }

});
