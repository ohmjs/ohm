/* eslint-env browser */

'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohmEditor, root.cmUtil);
  }
})(this, function(ohmEditor, cmUtil) {
  var grammar;
  var grammarEditor;
  var grammarPosInfos;  // Holds the memo table from the last successful parse.
  var mouseCoords;
  var mark;
  var markWordInfo;

  var isMouseDown;

  function isPlatformMac() {
    return /Mac/.test(navigator.platform);
  }

  function areLinksEnabled(e) {
    var modifierKey = isPlatformMac() ? e.metaKey : e.ctrlKey;
    return modifierKey && !e.shiftKey && !e.altKey && !e.ctrlKey;
  }

  function updateLinks(cm, e) {
    cmUtil.clearMark(mark);
    markWordInfo = null;

    if (mouseCoords && grammarPosInfos && areLinksEnabled(e)) {
      var wordInfo = getWordUnderPoint(cm, mouseCoords.x, mouseCoords.y);
      if (isRuleApplication(wordInfo)) {
        mark = cm.markText(wordInfo.startPos, wordInfo.endPos, {
          css: 'text-decoration: underline; color: #268BD2; cursor: pointer;'
        });
        markWordInfo = wordInfo;
      }
    }
  }

  function handleMouseMove(cm, e) {
    mouseCoords = {x: e.clientX, y: e.clientY};
    if (!isMouseDown) {
      updateLinks(cm, e);
    }
  }

  function getWordUnderPoint(cm, x, y) {
    var pos = cm.coordsChar({left: x, top: y});
    var wordPos = cm.findWordAt(pos);
    return {
      startIdx: cm.indexFromPos(wordPos.anchor),
      startPos: wordPos.anchor,
      endPos: wordPos.head,
      value: cm.getRange(wordPos.anchor, wordPos.head).trim()
    };
  }

  function isRuleApplication(wordInfo) {
    if (wordInfo.value.length > 0 && grammarPosInfos && grammarPosInfos[wordInfo.startIdx]) {
      var memo = grammarPosInfos[wordInfo.startIdx].memo;
      if (memo && memo.Base_application && memo.Base_application.value) {
        return true;
      }
    }
    return false;
  }

  function goToRuleDefinition(ruleName) {
    var interval = grammar.rules[ruleName].source;
    if (interval) {
      var defMark = cmUtil.markInterval(grammarEditor, interval, 'active-definition', true);
      setTimeout(defMark.clear.bind(defMark), 1000);
      cmUtil.scrollToInterval(grammarEditor, interval);
    }
  }

  function isSameWord(cm, a, b) {
    return cm.indexFromPos(a.startPos) === cm.indexFromPos(b.startPos) &&
           cm.indexFromPos(a.endPos) === cm.indexFromPos(b.endPos);
  }

  function registerListeners(editor) {
    editor.getWrapperElement().addEventListener('mousemove', handleMouseMove.bind(null, editor));
    window.addEventListener('keydown', updateLinks.bind(null, editor));
    window.addEventListener('keyup', updateLinks.bind(null, editor));

    // Prevent CodeMirror's default behaviour for Cmd-click, which is to place an additional
    // cursor at the clicked location. This must be done during the capture phase.
    editor.on('mousedown', function(cm, e) {
      isMouseDown = true;
      if (areLinksEnabled(e)) {
        e.preventDefault();
      }
    }, true);

    // It's not possible to capture `click` events inside the editor window, so do link
    // navigation on mouseup.
    editor.getWrapperElement().addEventListener('mouseup', function(e) {
      isMouseDown = false;
      if (markWordInfo) {
        var wordInfo = getWordUnderPoint(editor, e.clientX, e.clientY);
        if (isSameWord(editor, wordInfo, markWordInfo)) {
          goToRuleDefinition(markWordInfo.value);
        }
      }
    });
  }

  ohmEditor.addListener('parse:grammar', function(matchResult, g, err) {
    if (!grammarEditor) {
      grammarEditor = ohmEditor.ui.grammarEditor;
      registerListeners(grammarEditor);
    }
    grammar = g;
    grammarPosInfos = matchResult.succeeded() ? matchResult.state.posInfos : null;
  });
});
