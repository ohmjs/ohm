/* eslint-env browser */

'use strict';

function $(sel) { return document.querySelector(sel); }

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    root.ohmEditor = root.ohmEditor || {};
    initModule(root.ohm, root.ohmEditor, root.cmUtil, root.CodeMirror);
  }
})(this, function(ohm, ohmEditor, cmUtil, CodeMirror) {
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  var checkboxes, grammarChanged;

  // EXPORTS
  // -------

  ohmEditor.options = {};
  ohmEditor.ui = {
    inputEditor: CodeMirror($('#inputContainer .editorWrapper')),
    grammarEditor: CodeMirror($('#grammarContainer .editorWrapper'))
  };
  ohmEditor.grammar = null;

  ohmEditor.parseGrammar = function() {
    var source = this.ui.grammarEditor.getValue();
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
  };

  ohmEditor.refresh = function() {
    hideError('input', this.ui.inputEditor);
    saveEditorState(this.ui.inputEditor, 'input');

    // Refresh the option values.
    for (var i = 0; i < checkboxes.length; ++i) {
      var checkbox = checkboxes[i];
      this.options[checkbox.name] = checkbox.checked;
    }

    if (grammarChanged) {
      grammarChanged = false;
      saveEditorState(this.ui.grammarEditor, 'grammar');

      var result = this.parseGrammar();
      this.grammar = result.grammar;
      this.updateExternalRules(this.ui.grammarEditor, result.matchResult, this.grammar);
      this.updateRuleHyperlinks(this.ui.grammarEditor, result.matchResult, this.grammar);
      if (result.error) {
        var err = result.error;
        setError('grammar', this.ui.grammarEditor, err.interval,
          err.shortMessage || err.message);
        return;
      }
    }

    if (this.grammar && this.grammar.defaultStartRule) {
      // TODO: Move this stuff to parseTree.js. We probably want a proper event system,
      // with events like 'beforeGrammarParse' and 'afterGrammarParse'.
      hideBottomOverlay();

      var trace = this.grammar.trace(this.ui.inputEditor.getValue());
      if (trace.result.failed()) {
        // Intervals with start == end won't show up in CodeMirror.
        var interval = trace.result.getInterval();
        interval.endIdx += 1;
        setError('input', this.ui.inputEditor, interval,
          'Expected ' + trace.result.getExpectedText());
      }

      this.refreshParseTree(trace, true);
    }
  };

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
    refreshTimeout = setTimeout(ohmEditor.refresh.bind(ohmEditor), delay || 0);
  }

  checkboxes = document.querySelectorAll('#options input[type=checkbox]');
  Array.prototype.forEach.call(checkboxes, function(cb) {
    cb.addEventListener('click', function(e) { triggerRefresh(); });
  });

  ohmEditor.searchBar.initializeForEditor(ohmEditor.ui.inputEditor);
  ohmEditor.searchBar.initializeForEditor(ohmEditor.ui.grammarEditor);

  restoreEditorState(ohmEditor.ui.inputEditor, 'input', $('#sampleInput'));
  restoreEditorState(ohmEditor.ui.grammarEditor, 'grammar', $('#sampleGrammar'));

  ohmEditor.ui.inputEditor.on('change', function() {
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

  grammarChanged = true;
  ohmEditor.refresh();

  $$('.hiddenDuringLoading').forEach(function(el) {
    el.classList.remove('hiddenDuringLoading');
  });
});
