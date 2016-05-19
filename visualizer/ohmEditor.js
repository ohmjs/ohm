/* eslint-env browser */
/* global CheckedEmitter, CodeMirror */

'use strict';

var ohmEditor = new CheckedEmitter();

ohmEditor.registerEvents({
  // Emitted when the CodeMirror instances for the input and grammar have been initialized.
  'init:inputEditor': ['codeMirror'],
  'init:grammarEditor': ['codeMirror'],

  // Emitted as soon as the user has made a change in the respective editor. Any listeners which
  // may be long running should use 'change:input' or 'change:grammar' instead.
  'change:inputEditor': ['codeMirror'],
  'change:grammarEditor': ['codeMirror'],

  // Emitted after a short delay when one or more editor change events have occurred.
  'change:grammar': ['grammarSource'],
  'change:input': ['inputSource'],

  // Emitted after attempting to parse the grammar and the input, respectively.
  'parse:grammar': ['matchResult', 'grammar', 'err'],
  'parse:input': ['matchResult', 'trace']

});

ohmEditor.grammar = null;
ohmEditor.options = {};
ohmEditor.ui = {
  inputEditor: CodeMirror(document.querySelector('#inputContainer .editorWrapper')),
  grammarEditor: CodeMirror(document.querySelector('#grammarContainer .editorWrapper'))
};
ohmEditor.emit('init:inputEditor', ohmEditor.ui.inputEditor);
ohmEditor.emit('init:grammarEditor', ohmEditor.ui.grammarEditor);
