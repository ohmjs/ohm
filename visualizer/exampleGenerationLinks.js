/* eslint-env browser */

// TODO: sane variable naming
// TODO: organize state better
// TODO: fix UI timing issues
// TODO: update selectable links on neededExamples
// TODO: in indicator, don't highlight all cases if rule is doable
// TODO: fix line bug

'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohmEditor, root.exampleWorkerManager,
               root.cmUtil, root.utils, root.d3);
  }
})(this, function(ohmEditor, exampleWorkerManager, cmUtil, utils, d3) {
  var grammar;
  var grammarEditor;

  var mouseCoords;

  var mousePositionInfo = {
    mark: null,
    rule: null,
    position: null
  };

  var clickableMarks;

  var exampleDisplay = {
    lineWidget: null,
    DOM: null,
    rule: null
  };

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
    cmUtil.clearMark(mousePositionInfo.mark);
    mousePositionInfo.markRule = null;
    mousePositionInfo.markPosition = null;

    if (mouseCoords && areLinksEnabled(e)) {
      var position = getPointPosition(cm, mouseCoords.x, mouseCoords.y);
      var rule = ruleDefinitionFor(cm, position);
      if (rule && !exampleWorkerManager.neededExamples.includes(rule.ruleName)) {
        mousePositionInfo.mark = markRuleBody(cm, rule, 'currentExampleLink');
        mousePositionInfo.rule = rule;
        mousePositionInfo.position = position;
      }
    }
  }

  function updateLinkIndicators(cm, e) {
    if (mouseCoords && areLinksEnabled(e)) {
      if (!clickableMarks) {
        var availableExamples = utils.difference(
          Object.keys(grammar.ruleBodies),
          exampleWorkerManager.neededExamples
        );
        var availableExampleBodies = availableExamples.map(function(ruleName) {
          return grammar.ruleBodies[ruleName];
        });
        clickableMarks = availableExampleBodies.map(function(rule) {
          return markRuleBody(cm, rule, 'clickableExampleLink');
        });
      }
    } else {
      if (clickableMarks) {
        clickableMarks.forEach(function(clickableMark) {
          cmUtil.clearMark(clickableMark);
        });
        clickableMarks = null;
      }
    }
  }

  function markRuleBody(cm, ruleBody, className) {
    var startPos = cm.posFromIndex(ruleBody.definitionInterval.startIdx);
    var endPos = cm.posFromIndex(ruleBody.definitionInterval.endIdx);
    return cm.markText(startPos, endPos, {
      className: className
    });
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

  function toggleExamplesFor(position) {
    if (exampleDisplay.lineWidget) {
      exampleDisplay.DOM.style.height = 0;
      setTimeout(function() {
        exampleDisplay.lineWidget.clear();
        exampleDisplay.lineWidget = null;
        exampleDisplay.DOM = null;
        exampleDisplay.rule = null;
      }, 500);
    }
    if ((exampleDisplay.rule &&
         exampleDisplay.rule.ruleName !== mousePositionInfo.rule.ruleName) ||
        !exampleDisplay.rule) {
      exampleWorkerManager.requestExamples(
        ruleDefinitionFor(grammarEditor, position).ruleName
      );
    }
  }

  // TODO: toggle for same line
  exampleWorkerManager.addListener('received:examples', function(ruleName, examples) {
    examples = examples || [];
    exampleDisplay.DOM = makeExampleDisplay(ruleName, examples.filter(function(_, i) {
      return i < 10;
    }));
    exampleDisplay.lineWidget = grammarEditor.addLineWidget(
      mousePositionInfo.position.line, exampleDisplay.DOM
    );
    exampleDisplay.rule = grammar.ruleBody[ruleName];
    exampleDisplay.DOM.style.height = 0;
    setTimeout(function() { exampleDisplay.DOM.style.height = 'auto'; }, 0);
  });

  function makeExampleDisplay(ruleName, examples) {
    return utils._('div', {
      class: 'exampleDisplay'
    }, utils._('h3', {}, utils.t(ruleName)), makeExampleList(examples));
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

    window.addEventListener('keydown', updateLinkIndicators.bind(null, editor));
    window.addEventListener('keyup', updateLinkIndicators.bind(null, editor));

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
      if (mousePositionInfo.mark) {
        var position = getPointPosition(editor, mouseCoords.x, mouseCoords.y);
        var rule = ruleDefinitionFor(editor, position);
        if (rule.ruleName === mousePositionInfo.rule.ruleName) {
          toggleExamplesFor(getPointPosition(editor, e.clientX, e.clientY));
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
  });

});
