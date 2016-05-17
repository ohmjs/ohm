/* eslint-env browser */

'use strict';

// This module handles showing and hiding errors in the grammar editor and the input editor.
(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohmEditor, root.cmUtil);
  }
})(this, function(ohmEditor, cmUtil) {
  var errorMarks = {
    grammar: null,
    input: null
  };

  function hideError(category, editor) {
    var errInfo = errorMarks[category];
    if (errInfo) {
      errInfo.mark.clear();
      clearTimeout(errInfo.timeout);
      if (errInfo.widget) {
        errInfo.widget.clear();
      }
      errorMarks[category] = null;
    }
  }

  function setError(category, editor, interval, message) {
    hideError(category, editor);

    errorMarks[category] = {
      mark: cmUtil.markInterval(editor, interval, 'error-interval', false),
      timeout: setTimeout(showError.bind(null, category, editor, interval, message), 1500),
      widget: null
    };
  }

  function showError(category, editor, interval, message) {
    var errorEl = document.createElement('div');
    errorEl.className = 'error';
    errorEl.textContent = message;
    var line = editor.posFromIndex(interval.endIdx).line;
    errorMarks[category].widget = editor.addLineWidget(line, errorEl, {insertAt: 0});
  }

  // Hide errors in the editors as soon as the user starts typing again.
  ohmEditor.addListener('change:grammarEditor', function(cm) {
    hideError('grammar', cm);
  });
  ohmEditor.addListener('change:inputEditor', function(cm) {
    hideError('input', cm);
  });

  // Hide the input error when the grammar is about to be reparsed.
  ohmEditor.addListener('change:grammar', function(source) {
    hideError('input', ohmEditor.ui.inputEditor);
  });

  ohmEditor.addListener('parse:grammar', function(matchResult, grammar, err) {
    if (err) {
      var editor = ohmEditor.ui.grammarEditor;
      setError('grammar', editor, err.interval, err.shortMessage || err.message);
    }
  });
  ohmEditor.addListener('parse:input', function(matchResult, trace) {
    if (trace.result.failed()) {
      var editor = ohmEditor.ui.inputEditor;
      // Intervals with start == end won't show up in CodeMirror.
      var interval = trace.result.getInterval();
      interval.endIdx += 1;
      setError('input', editor, interval, 'Expected ' + trace.result.getExpectedText());
    }
  });
});
