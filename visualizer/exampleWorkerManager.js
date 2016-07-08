/* eslint-env browser */

'use strict';

// TODO: handle invalid grammar in textbox

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    root.exampleWorkerManager = initModule(root.ohm, root.ohmEditor,
                                           root.utils, root.CheckedEmitter);
  }
})(this, function(ohm, ohmEditor, utils, CheckedEmitter) {
  var exampleWorkerManager = new CheckedEmitter();

  exampleWorkerManager.registerEvents({

    'request:examples': ['ruleName'],
    'received:examples': ['ruleName', 'examples'],

    'update:neededExamples': [],
    'received:neededExamples': ['neededExamples'],

    'add:userExample': ['ruleName', 'example']
  });

  var eventsToEmit = ['received:examples', 'received:neededExamples'];

  var exampleWorker = new Worker('exampleWorker.js');
  /* eslint-disable no-unused-vars */
  var examplesNeeded = null;
  /* eslint-enable no-unused-vars */

  // TODO: may want to reset current worker instead
  ohmEditor.addListener('parse:grammar', function(_, grammar, __) {
    exampleWorker.terminate();
    exampleWorker = new Worker('exampleWorker.js');
    exampleWorker.onmessage = onWorkerMessage;
    exampleWorker.postMessage({
      name: 'initialize', recipe: grammar.toRecipe()
    });
  });

  function onWorkerMessage(event) {
    if (eventsToEmit.includes(event.data.name)) {
      exampleWorkerManager.emit.apply(exampleWorkerManager,
                                      [event.data.name].concat(event.data.args));
    } else {
      /* eslint-disable no-console */
      console.debug('WORKER:', event.data);
      /* eslint-enable no-console */
    }
  }

  exampleWorkerManager.addListener('request:examples', function(ruleName) {
    relayEvent('request:examples', [ruleName]);
  });

  exampleWorkerManager.addListener('update:neededExamples', function() {
    relayEvent('update:neededExamples', []);
  });

  exampleWorkerManager.addListener('add:userExample', function(ruleName, example) {
    relayEvent('add:userExample', [ruleName, example]);
  });

  function relayEvent(eventName, args) {
    exampleWorker.postMessage({
      name: eventName,
      args: args
    });
  }

  exampleWorkerManager.neededExamples = null;
  exampleWorkerManager.addListener('received:neededExamples', function(neededExamples) {
    exampleWorkerManager.neededExamples = neededExamples;
  });

  return exampleWorkerManager;
});
