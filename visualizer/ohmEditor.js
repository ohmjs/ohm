/* eslint-env browser */
/* global CodeMirror, fbemitter */

'use strict';

/*
  Events:

  * 'init:inputEditor' (codeMirror)
    - Emitted when the CodeMirror instance for the input has been initialized.
  * 'init:grammarEditor' (codeMirror)
    - Emitted when the CodeMirror instance for the grammar has been initialized.

  * 'change:inputEditor' (codeMirror)
    - Emitted as soon as the user has made a change in the input editor. Any listeners which
      may be long running should use 'change:input' instead.
  * 'change:grammarEditor' (codeMirror)
    - Emitted as soon as the user has made a change in the grammar editor. Any listeners which
      may be long running should use 'change:grammar' instead.

  * 'change:grammar' (grammarSource)
    - Emitted after a short delay when one or more 'change:grammarEditor' events have occurred.
  * 'parse:grammar' (matchResult, grammar)
    - Emitted after attempting to parse the grammar.

  * 'change:input' (inputSource)
    - Emitted after a short delay when one or more 'change:inputEditor' events have occurred.
  * 'parse:input' (matchResult, trace)
    - Emitted after attempting to parse the input.
 */
var ohmEditor = new fbemitter.EventEmitter();

ohmEditor.grammar = null;
ohmEditor.options = {};
ohmEditor.ui = {
  inputEditor: CodeMirror(document.querySelector('#inputContainer .editorWrapper')),
  grammarEditor: CodeMirror(document.querySelector('#grammarContainer .editorWrapper'))
};
ohmEditor.emit('init:inputEditor', ohmEditor.ui.inputEditor);
ohmEditor.emit('init:grammarEditor', ohmEditor.ui.grammarEditor);
