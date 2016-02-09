/* eslint-env browser */
/* global cmUtil, CodeMirror, ohm, refreshParseTree, Storage */

'use strict';

function $(sel) { return document.querySelector(sel); }
var options = {};

var inputEditor = CodeMirror.fromTextArea($('#input'));
var grammarEditor = CodeMirror.fromTextArea($('#grammar'));

// Misc Helpers
// ------------

function createElement(sel, optContent) {
  var parts = sel.split('.');
  var tagName = parts[0];
  if (tagName.length === 0) {
    tagName = 'div';
  }

  var el = document.createElement(tagName);
  el.className = parts.slice(1).join(' ');
  if (optContent) {
    el.textContent = optContent;
  }
  return el;
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
    timeout: setTimeout(function() { showError(category, editor, interval, message); }, 1500),
    widget: null
  };
}

function showError(category, editor, interval, message) {
  var errorEl = createElement('.error', message);
  var line = editor.posFromIndex(interval.endIdx).line;
  errorMarks[category].widget = editor.addLineWidget(line, errorEl);
}

function useLocalStorage() {
  return typeof localStorage !== 'undefined' &&
         typeof Storage === 'function' &&
         localStorage instanceof Storage;
}

function setEditorValueFromLocalStorage(editor, key) {
  if (useLocalStorage()) {
    var contents = localStorage.getItem(key);
    if (contents != null) {
      editor.setValue(contents);
    }
  }
}

function hideBottomOverlay() {
  $('#bottomSection .overlay').style.width = 0;
}

function showBottomOverlay() {
  $('#bottomSection .overlay').style.width = '100%';
}

// Main
// ----

(function main() {
  var checkboxes = document.querySelectorAll('#options input[type=checkbox]');
  var refreshTimeout;
  var grammar;
  var grammarChanged = true;

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

  setEditorValueFromLocalStorage(inputEditor, 'input');
  setEditorValueFromLocalStorage(grammarEditor, 'grammar');

  inputEditor.on('change', function() { triggerRefresh(250); });
  grammarEditor.on('change', function() {
    grammarChanged = true;
    hideError('grammar', grammarEditor);
    triggerRefresh(250);
  });

  function refresh() {
    hideError('input', inputEditor);
    if (useLocalStorage()) {
      localStorage.setItem('input', inputEditor.getValue());
    }

    // Refresh the option values.
    for (var i = 0; i < checkboxes.length; ++i) {
      var checkbox = checkboxes[i];
      options[checkbox.name] = checkbox.checked;
    }

    if (grammarChanged) {
      grammarChanged = false;

      var grammarSrc = grammarEditor.getValue();
      if (useLocalStorage()) {
        localStorage.setItem('grammar', grammarSrc);
      }
      try {
        grammar = ohm.grammar(grammarSrc);
      } catch (e) {
        console.log(e);  // eslint-disable-line no-console

        var message = e.shortMessage ? e.shortMessage : e.message;
        setError('grammar', grammarEditor, e.interval, message);
        // If the grammar is unusable, prevent the input from being parsed.
        grammar = null;
        return;
      }
    }

    if (!grammar) {
      return;
    }
    hideBottomOverlay();
    $('#expandedInput').innerHTML = '';
    $('#parseResults').innerHTML = '';

    refreshParseTree(grammar, inputEditor.getValue());
  }
  refresh();
})();
