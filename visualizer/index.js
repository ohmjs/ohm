/* eslint-env browser */
/* global cmUtil, CodeMirror, ohm, refreshParseTree, searchBar */
/* global updateExternalRules, updateRuleHyperlinks */

'use strict';

function $(sel) { return document.querySelector(sel); }
function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
var options = {};

var inputEditor = CodeMirror($('#inputContainer .editorWrapper'));
var grammarEditor = CodeMirror($('#grammarContainer .editorWrapper'));

// Expose the grammar globally so that it can easily be accessed from the console.
var grammar = null;

// Misc Helpers
// ------------

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
    timeout: setTimeout(function() { showError(category, editor, interval, message); }, 1500),
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

// Main
// ----

(function main() {
  var checkboxes = document.querySelectorAll('#options input[type=checkbox]');
  var refreshTimeout;
  var grammarChanged = true;

  searchBar.initializeForEditor(inputEditor);
  searchBar.initializeForEditor(grammarEditor);

  var ui = {
    grammarEditor: grammarEditor,
    inputEditor: inputEditor
  };

  function triggerRefresh(delay) {
    showBottomOverlay();
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    refreshTimeout = setTimeout(refresh, delay || 0);
  }
  Array.prototype.forEach.call(checkboxes, function(cb) {
    cb.addEventListener('click', function(e) { triggerRefresh(); });
  });

  restoreEditorState(inputEditor, 'input', $('#sampleInput'));
  restoreEditorState(grammarEditor, 'grammar', $('#sampleGrammar'));

  inputEditor.on('change', function() { triggerRefresh(250); });
  grammarEditor.on('change', function() {
    grammarChanged = true;
    hideError('grammar', grammarEditor);
    triggerRefresh(250);
  });

  function refresh() {
    hideError('input', inputEditor);
    saveEditorState(inputEditor, 'input');

    // Refresh the option values.
    for (var i = 0; i < checkboxes.length; ++i) {
      var checkbox = checkboxes[i];
      options[checkbox.name] = checkbox.checked;
    }

    if (grammarChanged) {
      grammarChanged = false;
      saveEditorState(grammarEditor, 'grammar');

      var result = parseGrammar(grammarEditor.getValue());
      grammar = result.grammar;
      updateExternalRules(grammarEditor, result.matchResult, grammar);
      updateRuleHyperlinks(grammarEditor, result.matchResult, grammar);
      if (result.error) {
        var err = result.error;
        setError('grammar', grammarEditor, err.interval, err.shortMessage || err.message);
        return;
      }
    }

    if (grammar && grammar.defaultStartRule) {
      // TODO: Move this stuff to parseTree.js. We probably want a proper event system,
      // with events like 'beforeGrammarParse' and 'afterGrammarParse'.
      hideBottomOverlay();
      $('#expandedInput').innerHTML = '';
      $('#parseResults').innerHTML = '';

      var trace = grammar.trace(inputEditor.getValue());
      if (trace.result.failed()) {
        // Intervals with start == end won't show up in CodeMirror.
        var interval = trace.result.getInterval();
        interval.endIdx += 1;
        setError('input', inputEditor, interval, 'Expected ' + trace.result.getExpectedText());
      }
      refreshParseTree(ui, grammar, trace, options.showFailures);
    }
  }

  /* eslint-disable no-console */
  console.log('%cOhm visualizer', 'color: #e0a; font-family: Avenir; font-size: 18px;');
  console.log([
    '- `ohm` is the Ohm library',
    '- `grammar` is the current grammar object (if the source is valid)'
  ].join('\n'));
  /* eslint-enable no-console */

  refresh();

  $$('.hiddenDuringLoading').forEach(function(el) {
    el.classList.remove('hiddenDuringLoading');
  });
})();
