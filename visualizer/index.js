/* eslint-env browser */
/* global $$, $ */

'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohm, root.ohmEditor, root.cmUtil);
  }
})(this, function(ohm, ohmEditor, cmUtil) {
  var checkboxes;
  var grammarChanged = true;
  var inputChanged = true;

  // Helpers
  // -------

  function parseGrammar(source) {
    var matchResult = ohm.ohmGrammar.match(source);
    var grammar;
    var err;

    if (matchResult.succeeded()) {
      var ns = {};
      try {
        ohm._buildGrammar(matchResult, ns);
        var firstProp = Object.keys(ns)[0];
        if (firstProp) {
          grammar = ns[firstProp];
        }
      } catch (ex) {
        err = ex;
      }
    } else {
      err = {
        message: matchResult.message,
        shortMessage: matchResult.shortMessage,
        interval: matchResult.getInterval()
      };
    }
    return {
      matchResult: matchResult,
      grammar: grammar,
      error: err
    };
  }

  function refresh() {
    var grammarEditor = ohmEditor.ui.grammarEditor;
    var inputEditor = ohmEditor.ui.inputEditor;

    var grammarSource = grammarEditor.getValue();
    var inputSource = inputEditor.getValue();

    hideError('input', inputEditor);
    saveEditorState(inputEditor, 'input');

    // Refresh the option values.
    for (var i = 0; i < checkboxes.length; ++i) {
      var checkbox = checkboxes[i];
      ohmEditor.options[checkbox.name] = checkbox.checked;
    }

    if (inputChanged) {
      inputChanged = false;
      ohmEditor.emit('change:input', inputSource);
    }

    if (grammarChanged) {
      grammarChanged = false;
      ohmEditor.emit('change:grammar', grammarSource);
      saveEditorState(grammarEditor, 'grammar');

      var result = parseGrammar(grammarSource);
      ohmEditor.grammar = result.grammar;
      ohmEditor.emit('parse:grammar', result.grammar, result.matchResult);

      if (result.error) {
        var err = result.error;
        setError('grammar', grammarEditor, err.interval, err.shortMessage || err.message);
      }
    }

    if (ohmEditor.grammar && ohmEditor.grammar.defaultStartRule) {
      // TODO: Move this stuff to parseTree.js. We probably want a proper event system,
      // with events like 'beforeGrammarParse' and 'afterGrammarParse'.
      hideBottomOverlay();

      var trace = ohmEditor.grammar.trace(inputSource);
      if (trace.result.failed()) {
        // Intervals with start == end won't show up in CodeMirror.
        var interval = trace.result.getInterval();
        interval.endIdx += 1;
        setError('input', inputEditor, interval, 'Expected ' + trace.result.getExpectedText());
      }

      ohmEditor.refreshParseTree(trace, true);
    }
  }

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

  function hideBottomOverlay() {
    $('#bottomSection .overlay').style.width = 0;
  }

  function showBottomOverlay() {
    $('#bottomSection .overlay').style.width = '100%';
  }

  function restoreEditorState(editor, key, defaultEl) {
    var value = localStorage.getItem(key);
    if (value) {
      editor.setValue(value);
    } else if (defaultEl) {
      editor.setValue(defaultEl.textContent);
    }
  }

  function saveEditorState(editor, key) {
    localStorage.setItem(key, editor.getValue());
  }

  // Main
  // ----

  var refreshTimeout;
  function triggerRefresh(delay) {
    showBottomOverlay();
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    refreshTimeout = setTimeout(refresh.bind(ohmEditor), delay || 0);
  }

  checkboxes = document.querySelectorAll('#options input[type=checkbox]');
  Array.prototype.forEach.call(checkboxes, function(cb) {
    cb.addEventListener('click', function(e) { triggerRefresh(); });
  });

  restoreEditorState(ohmEditor.ui.inputEditor, 'input', $('#sampleInput'));
  restoreEditorState(ohmEditor.ui.grammarEditor, 'grammar', $('#sampleGrammar'));

  ohmEditor.ui.inputEditor.on('change', function() {
    inputChanged = true;
    hideError('input', ohmEditor.ui.inputEditor);
    triggerRefresh(250);
  });
  ohmEditor.ui.grammarEditor.on('change', function() {
    grammarChanged = true;
    hideError('grammar', ohmEditor.ui.grammarEditor);
    triggerRefresh(250);
  });

  /* eslint-disable no-console */
  console.log('%cOhm visualizer', 'color: #e0a; font-family: Avenir; font-size: 18px;');
  console.log([
    '- `ohm` is the Ohm library',
    '- `ohmEditor` is editor object with',
    '  `.grammar` as the current grammar object (if the source is valid)',
    '  `.ui` containing the `inputEditor` and `grammarEditor`'
  ].join('\n'));
  /* eslint-enable no-console */

  refresh();

  $$('.hiddenDuringLoading').forEach(function(el) {
    el.classList.remove('hiddenDuringLoading');
  });
});
