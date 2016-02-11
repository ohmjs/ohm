/* eslint-env browser */
/* global cmUtil, CodeMirror, escape, ohm, QueryString, refreshParseTree, unescape */

'use strict';

function $(sel) { return document.querySelector(sel); }
var options = {};

var inputEditor = CodeMirror($('#inputContainer .editorWrapper'));
var grammarEditor = CodeMirror($('#grammarContainer .editorWrapper'));

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

function hideBottomOverlay() {
  $('#bottomSection .overlay').style.width = 0;
}

function showBottomOverlay() {
  $('#bottomSection .overlay').style.width = '100%';
}

function fromBase64(str) {
  return decodeURIComponent(unescape(atob(str)));
}

function toBase64(str) {
  return btoa(escape(encodeURIComponent(str)));
}

function restoreEditorState(editor, stateObj, key) {
  if (stateObj.hasOwnProperty(key)) {
    editor.setValue(fromBase64(stateObj[key]));
  }
}

function saveEditorState(editor, stateObj, key) {
  stateObj[key] = toBase64(editor.getValue());
  history.replaceState(null, '', '#' + QueryString.stringify(stateObj));
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

  var hashVars = QueryString.parse(window.location.hash.slice(1));
  restoreEditorState(inputEditor, hashVars, 'input');
  restoreEditorState(grammarEditor, hashVars, 'grammar');

  inputEditor.on('change', function() { triggerRefresh(250); });
  grammarEditor.on('change', function() {
    grammarChanged = true;
    hideError('grammar', grammarEditor);
    triggerRefresh(250);
  });

  function refresh() {
    hideError('input', inputEditor);

    saveEditorState(inputEditor, hashVars, 'input');

    // Refresh the option values.
    for (var i = 0; i < checkboxes.length; ++i) {
      var checkbox = checkboxes[i];
      options[checkbox.name] = checkbox.checked;
    }

    if (grammarChanged) {
      grammarChanged = false;

      var grammarSrc = grammarEditor.getValue();
      saveEditorState(grammarEditor, hashVars, 'grammar');

      if (grammarSrc.length > 0) {
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
