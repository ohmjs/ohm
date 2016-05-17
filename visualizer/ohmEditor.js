/* eslint-env browser */
/* global CodeMirror, fbemitter */

'use strict';

// Global helpers
// --------------

/* eslint-disable no-unused-vars */
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
/* eslint-enable no-unused-vars */

// Exports
// -------

/*
  Events:
  - 'init:inputEditor' (codeMirror)
  - 'init:grammarEditor' (codeMirror)
  - 'change:grammar' (grammarSource)
  - 'parse:grammar' (grammar, matchResult)
  - 'change:input' (inputSource)
 */
var ohmEditor = new fbemitter.EventEmitter();

ohmEditor.grammar = null;
ohmEditor.options = {};
ohmEditor.ui = {
  inputEditor: CodeMirror($('#inputContainer .editorWrapper')),
  grammarEditor: CodeMirror($('#grammarContainer .editorWrapper'))
};
ohmEditor.emit('init:inputEditor', ohmEditor.ui.inputEditor);
ohmEditor.emit('init:grammarEditor', ohmEditor.ui.grammarEditor);
