/* eslint-env browser */
/* global CheckedEmitter, ohmEditor */

'use strict';

ohmEditor.semantics = new CheckedEmitter();
ohmEditor.semantics.registerEvents({
  // Emitted after adding an new operation/attribute
  'add:semanticOperation': ['type', 'name', 'optArguments', 'optOrigActionDict'],

  // Emitted after changing to another semantic operation
  'change:semanticOperation': ['targetName', 'optArguments'],

  // Emitted after editing the semantics operation button
  'edit:semanticOperation': ['wrapper', 'operationName', 'optArguments'],

  // Emitted after pressing cmd/ctrl-S in semantics editor
  'save:semanticAction': ['traceNode', 'actionArguments', 'actionBody', 'optOperation']
});
