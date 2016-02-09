/* eslint-env browser */
/* global CodeMirror, ohm, refreshParseTree, Storage */

'use strict';

function $(sel) { return document.querySelector(sel); }
var options = {};

var inputEditor = CodeMirror.fromTextArea($('#input'));
var grammarEditor = CodeMirror.fromTextArea($('#grammar'));
var grammar;

// CodeMirror Helpers
// ------------------

function countLeadingWhitespace(str) {
  return str.match(/^\s*/)[0].length;
}

function countTrailingWhitespace(str) {
  return str.match(/\s*$/)[0].length;
}

function isBlockSelectable(cm, startPos, endPos) {
  var lastLine = cm.getLine(endPos.line);
  return countLeadingWhitespace(cm.getLine(startPos.line)) === startPos.ch &&
         (lastLine.length - countTrailingWhitespace(lastLine)) === endPos.ch;
}

// Mark a block of text with `className` by marking entire lines.
function markBlock(cm, startLine, endLine, className) {
  for (var i = startLine; i <= endLine; ++i) {
    cm.addLineClass(i, 'wrap', className);
  }
  return {
    clear: function() {
      for (var i = startLine; i <= endLine; ++i) {
        cm.removeLineClass(i, 'wrap', className);
      }
    }
  };
}

function markInterval(cm, interval, className, canHighlightBlocks) {
  var startPos = cm.posFromIndex(interval.startIdx);
  var endPos = cm.posFromIndex(interval.endIdx);

  // See if the selection can be expanded to a block selection.
  if (canHighlightBlocks && isBlockSelectable(cm, startPos, endPos)) {
    return markBlock(cm, startPos.line, endPos.line, className);
  }
  return cm.markText(startPos, endPos, {className: className});
}

function clearMark(mark) {  // eslint-disable-line no-unused-vars
  if (mark) {
    mark.clear();
  }
}

function indexToHeight(cm, index) {
  var pos = cm.posFromIndex(index);
  return cm.heightAtLine(pos.line, 'local');
}

function scrollToInterval(cm, interval) {  // eslint-disable-line no-unused-vars
  var startHeight = indexToHeight(cm, interval.startIdx);
  var endHeight = indexToHeight(cm, interval.endIdx);
  var scrollInfo = cm.getScrollInfo();
  var margin = scrollInfo.clientHeight - (endHeight - startHeight);
  if (startHeight < scrollInfo.top  ||
      endHeight > (scrollInfo.top + scrollInfo.clientHeight)) {
    cm.scrollIntoView({left: 0, top: startHeight,
                       right: 0, bottom: endHeight},
                      margin > 0 ? margin / 2 : undefined);
  }
}

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
    mark: markInterval(editor, interval, 'error-interval', false),
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
