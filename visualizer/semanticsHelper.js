/* eslint-env browser */

'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohmEditor, root.CheckedEmitter);
  }
})(this, function(ohmEditor, CheckedEmitter) {
  // Exports
  // -------
  ohmEditor.semantics = new CheckedEmitter();
  ohmEditor.semantics.registerEvents({
    // Emitted after adding an new operation/attribute
    'add:semanticOperation': ['type', 'name', 'optArguments']
  });

  // Privates
  // --------
  var semantics = null;
  ohmEditor.addListener('parse:grammar', function(matchResult, grammar, error) {
    if (grammar && grammar.defaultStartRule) {
      semantics = grammar.semantics();
    }
  });

  // Add new operation/attribute to the semantics
  function addSemanticOperation(type, name, optArguments) {
    var signature = name;
    if (type === 'Operation' && optArguments) {
      var argumentNames = Object.keys(optArguments);
      if (argumentNames.length > 0) {
        signature += '(' + argumentNames.join(',') + ')';
      }
    }
    semantics['add' + type](signature, {});
  }
  ohmEditor.semantics.addListener('add:semanticOperation', addSemanticOperation);
});
