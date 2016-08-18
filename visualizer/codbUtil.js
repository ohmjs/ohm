/* eslint-env browser */
'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    root.codbUtil = initModule(root.Promise, root.httpUtil, root.ohm);
  }
})(this, function(Promise, httpUtil, ohm) {

  // ---------
  // Helpers
  // ---------

  function errorWithPrefix(prefix) {
    return function(error) {
      throw new Error(prefix + error);
    }
  }

  // ---------
  // Exports
  // ---------

  function ExampleDatabase(grammar, codbUrl) {
    this.grammar = grammar;
    this.baseUrl = codbUrl;

    this.examples = {};
    this.failedExamples = {};

    // TODO: move this to worker


    var fetchExamples = httpUtil.$http(this.baseUrl + '_design/' + this.grammar.name + '/_rewrite/examples/')
      .get({}) // no args = get them all
      .then(function(examplesString) {
        this.examples = JSON.parse(examplesString);
      });

    // can check flag to see if initialized, or can add 'then' to initialization promise
    this.initialization = fetchExamples;
      .then(function(_) {
        this.initialized = true;
        return true;
      }, errorWithPrefix('Failed Initialization: '));
    this.initialized = false;
  }

  ExampleDatabase.prototype.addExample(ruleName, example) {
    if (!this.examples.hasOwnProperty(ruleName)) {
      this.examples[ruleName] = [];
    }

    if (!utils.includes(this.examples[ruleName], example)) {
      this.examples[ruleName].push(example);
      this._addExampleToServer(ruleName, example);
    }
  }

  ExampleDatabase.prototype._addExampleToServer(ruleName, example) {
    httpUtil.$http(this.baseUrl + '_design/' + this.grammarName + '/_rewrite/examples/')
      .put({}) // TODO: add parameters
      .catch(function(reason) {
        errorWithPrefix('Failed to add example: ')(reason);
        if (!this.failedExamples.hasOwnProperty(ruleName)) {
          this.failedExamples[ruleName] = [];
        }

        this.failedExamples[ruleName].push(example);
      });
  }

  ExampleDatabase.prototype.getExamples(ruleName) { return this.examples[ruleName] || []; }

  return {
    ExampleDatabase: ExampleDatabase
  };
});
