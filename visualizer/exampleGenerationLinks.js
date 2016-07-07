/* eslint-env browser */

'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohmEditor, root.cmUtil, root.utils, root.d3, root.exampleGenerationUI);
  }
})(this, function(ohmEditor, cmUtil, utils, d3, exampleGenerationUI) {
  var grammar;
  var grammarEditor;
  var grammarPosInfos;  // Holds the memo table from the last successful parse.
  var mouseCoords;
  var mark;
  var markPosition;
  var lineWidget;

  var isMouseDown;

  // TODO: spin off common functionality as helpers
  function isPlatformMac() {
    return /Mac/.test(navigator.platform);
  }

  // modifier+Shift
  function areLinksEnabled(e) {
    var modifierKey = isPlatformMac() ? e.metaKey : e.ctrlKey;
    return modifierKey && e.shiftKey && !e.altKey && !(isPlatformMac() ? e.ctrlKey : e.metaKey);
  }

  function updateLinks(cm, e) {
    cmUtil.clearMark(mark);
    markPosition = null;

    if (mouseCoords && grammarPosInfos && areLinksEnabled(e)) {
      var position = getPointPosition(cm, mouseCoords.x, mouseCoords.y);
      var ruleDef = ruleDefinitionFor(cm, position);
      if (ruleDef && !exampleGenerationUI.examplesNeeded().includes(ruleDef.ruleName)) {
        var startPos = cm.posFromIndex(ruleDef.definitionInterval.startIdx);
        var endPos = cm.posFromIndex(ruleDef.definitionInterval.endIdx);
        mark = cm.markText(startPos, endPos, {
          css: 'text-decoration: underline; color: #268BD2; cursor: pointer;'
        });
        markPosition = position;
      }
    }
  }

  function handleMouseMove(cm, e) {
    mouseCoords = {x: e.clientX, y: e.clientY};
    if (!isMouseDown) {
      updateLinks(cm, e);
    }
  }

  function getPointPosition(cm, x, y) {
    return cm.coordsChar({left: x, top: y});
  }

  function ruleDefinitionFor(cm, position) {
    var index = cm.indexFromPos(position);
    var relevantRuleDefinitions = [];
    utils.objectForEach(grammar.ruleBodies, function(ruleName, ruleBody) {
      if (ruleBody.definitionInterval.startIdx <= index &&
          ruleBody.definitionInterval.endIdx > index) {
        relevantRuleDefinitions.push(Object.assign({}, ruleBody, {ruleName: ruleName}));
      }
    });

    if (relevantRuleDefinitions.length === 0) {
      return null;
    } else if (relevantRuleDefinitions.length === 1) {
      return relevantRuleDefinitions[0];
    } else {
      return relevantRuleDefinitions.reduce(function(agg, b) {
        return agg.ruleName.length > b.ruleName.length ? agg : b;
      });
    }
  }

  function showExamplesFor(position) {
    // ruleDef, lineNo
    ohmEditor.emit('fetch:examples', ruleDefinitionFor(grammarEditor, position).ruleName);
  }

  function makeExampleDisplay(ruleName, examples) {
    return utils._('div', {
      class: 'exampleDisplay'
    }, utils._('h3', {}, utils.t(ruleName)),
       makeExampleList(examples));
  }

  function makeExampleList(examples) {
    if (examples.length === 0) {
      return utils.t('No Examples Found');
    }

    var args = ['ul', {class: 'exampleList'}].concat(examples.map(function(example) {
      return utils._('li', {}, utils.t(example));
    }));

    return utils._.apply(utils, args);
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
      if (markPosition) {
        // check for a relatively close click ( same line? )
        showExamplesFor(getPointPosition(editor, e.clientX, e.clientY));
        // var wordInfo = getWordUnderPoint(editor, e.clientX, e.clientY);
        // if (isSameWord(editor, wordInfo, markWordInfo)) {
        //   goToRuleDefinition(markWordInfo.value);
        // }
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

  // TODO: toggle for same line
  ohmEditor.addListener('fetched:examples', function(ruleName, examples) {
    examples = examples || [];
    if (lineWidget) {
      lineWidget.clear();
    }
    var exampleDisplay = makeExampleDisplay(ruleName, examples.filter(function(_, i) {
      return i < 10;
    }));
    lineWidget = grammarEditor.addLineWidget(markPosition.line, exampleDisplay);
    exampleDisplay.style.height = 0;
    setTimeout(function() { exampleDisplay.style.height = 'auto'; }, 0);
  });

});
