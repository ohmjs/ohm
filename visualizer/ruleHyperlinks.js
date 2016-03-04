/* eslint-env browser */
/* global cmUtil */

'use strict';

var updateRuleHyperlinks = (function() {  // eslint-disable-line no-unused-vars
  var registeredListeners = false;
  var grammar;
  var grammarEditor;
  var grammarPosInfos;  // Holds the memo table from the last successful parse.
  var mouseCoords;
  var mark;
  var defMark;

  var markNode = document.createElement('span');
  markNode.style = 'text-decoration: underline; color: #268BD2; cursor: pointer;';

  function areLinksEnabled(e) {
    return e.metaKey && !e.shiftKey && !e.altKey && !e.ctrlKey;
  }

  function updateLinks(cm, e) {
    cmUtil.clearMark(mark);
    cmUtil.clearMark(defMark);

    if (mouseCoords && grammarPosInfos && areLinksEnabled(e)) {
      var wordInfo = getWordUnderPoint(cm, mouseCoords.x, mouseCoords.y);
      if (isRuleApplication(wordInfo)) {
        var ruleName = wordInfo.value;
        markNode.textContent = ruleName;
        mark = cm.markText(wordInfo.startPos, wordInfo.endPos, {replacedWith: markNode});
      }
    }
  }

  function handleMouseMove(cm, e) {
    mouseCoords = {x: e.clientX, y: e.clientY};
    updateLinks(cm, e);
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

  function handleLinkClick(e) {
    var ruleName = e.target.textContent;
    var interval = grammar.ruleBodies[ruleName].definitionInterval;
    if (interval) {
      defMark = cmUtil.markInterval(grammarEditor, interval, 'active-definition', true);
      cmUtil.scrollToInterval(grammarEditor, interval);
    }
    e.preventDefault();
    e.stopPropagation();
  }

  function registerListeners(editor) {
    editor.getWrapperElement().addEventListener('mousemove', handleMouseMove.bind(null, editor));
    window.addEventListener('keydown', updateLinks.bind(null, editor));
    window.addEventListener('keyup', updateLinks.bind(null, editor));
    markNode.onclick = handleLinkClick;
  }

  // Export a function to be called when the grammar contents change.
  return function onGrammarChanged(editor, matchResult, g) {
    if (!registeredListeners) {
      grammarEditor = editor;
      registerListeners(editor);
      registeredListeners = true;
    }
    grammar = g;
    grammarPosInfos = matchResult.succeeded() ? matchResult.state.posInfos : null;
  };
})();
