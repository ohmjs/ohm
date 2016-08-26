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
    };
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

    var self = this;
    var url = this.baseUrl + '/_design/ohm/_rewrite/examples/' + this.grammar.name;
    var fetchExamples = httpUtil.$http(url)
      .get({}) // no args = get them all
      .then(function(examplesString) {
        self.examples = JSON.parse(examplesString);
      });

    // can check flag to see if initialized, or can add 'then' to initialization promise
    this.initialization = fetchExamples
      .then(function(_) {
        self.initialized = true;
        return true;
      }, errorWithPrefix('Failed Initialization: '));
    this.initialized = false;
  }

  ExampleDatabase.prototype.addExample = function(ruleName, example) {
    if (!this.examples.hasOwnProperty(ruleName)) {
      this.examples[ruleName] = [];
    }

    if (!utils.includes(this.examples[ruleName], example)) {
      this.examples[ruleName].push(example);
      this._addExampleToServer(ruleName, example);
    }
  };

  ExampleDatabase.prototype._addExampleToServer = function(ruleName, example) {
    var url = this.baseUrl + '/_design/ohm/_rewrite/examples/' + this.grammar.name +
      '/' + ruleName;
    httpUtil.$http(url)
    .post(example) // TODO: add parameters
      .catch(function(reason) {
        errorWithPrefix('Failed to add example: ')(reason);
        if (!this.failedExamples.hasOwnProperty(ruleName)) {
          this.failedExamples[ruleName] = [];
        }

        this.failedExamples[ruleName].push(example);
      });
  };

  ExampleDatabase.prototype.getExamples = function(ruleName) {
    return this.examples[ruleName] || [];
  };

  return {
    localUrl: location.toString().match(/^(.*)\/_design\//)[1],
    ExampleDatabase: ExampleDatabase,
    errorWithPrefix: errorWithPrefix
  };
});
