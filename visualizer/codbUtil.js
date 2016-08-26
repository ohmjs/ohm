/* eslint-env browser */
'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    root.codbUtil = initModule(root.httpUtil, root.utils, root.CheckedEmitter, root.ohm);
  }
})(this, function(httpUtil, utils, CheckedEmitter, ohm) {

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
    this.initialized = false;

    // TODO: move this to worker

    var self = this;
    var url = this.baseUrl + '/_design/ohm/_rewrite/examples/' + this.grammar.name;

    this.events = new CheckedEmitter();
    this.events.registerEvents({
      'initialized:DB': []
    });

    httpUtil.$http(url)
      .get({}, function(err, examplesString) {
        if (err) {
          errorWithPrefix('Failed Initialization: ')(err);
          return;
        }

        self.examples = JSON.parse(examplesString);

        // can check flag to see if initialized
        self.initialized = true;
        self.events.emit('initialized:DB');
      });
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
      .post(example, function(err) { // TODO: add parameters
        if (err) {
          errorWithPrefix('Failed to add example: ')(err);
          if (!this.failedExamples.hasOwnProperty(ruleName)) {
            this.failedExamples[ruleName] = [];
          }

          this.failedExamples[ruleName].push(example);
        }
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
