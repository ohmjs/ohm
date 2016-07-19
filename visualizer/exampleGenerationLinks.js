/* eslint-env browser */

// TODO: update selectable links on neededExamples
// TODO: nicer formatting for example display
// TODO: live-updating example displays

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
  var linksEnabled;

  // TODO: spin off common functionality as helpers
  function isPlatformMac() {
    return /Mac/.test(navigator.platform);
  }

  // modifier+Shift
  function areLinksEnabled(e) {
    var modifierKey = isPlatformMac() ? e.metaKey : e.ctrlKey;
    linksEnabled = modifierKey && e.shiftKey && !e.altKey &&
                   !(isPlatformMac() ? e.ctrlKey : e.metaKey);
    return linksEnabled;
  }

  function updateLinks(cm, e) {
    cmUtil.clearMark(mousePositionInfo.mark);
    mousePositionInfo.markRule = null;
    mousePositionInfo.markPosition = null;

    if (mouseCoords && areLinksEnabled(e)) {
      var position = getPointPosition(cm, mouseCoords.x, mouseCoords.y);
      var rule = ruleDefinitionFor(cm, position);
      if (rule && !exampleWorkerManager.neededExamples.includes(rule.ruleName)) {
        mousePositionInfo.mark = cmUtil.markInterval(cm,
          nameInterval(rule), 'currentExampleLink', false);
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
          return Object.assign({}, grammar.ruleBodies[ruleName], {ruleName: ruleName});
        });
        var neededExampleBodies = exampleWorkerManager.neededExamples.map(function(ruleName) {
          return Object.assign({}, grammar.ruleBodies[ruleName], {ruleName: ruleName});
        });

        clickableMarks = availableExampleBodies.map(function(rule) {
          return cmUtil.markInterval(cm, nameInterval(rule), 'coveredExampleLink', false);
        });
        neededExampleBodies.forEach(function(rule) {
          clickableMarks.push(
            cmUtil.markInterval(cm, indicatorInterval(rule), 'coverageIndicator', false)
          );
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

  function indicatorInterval(ruleDefinition) {
    var defString = ruleDefinition.definitionInterval.contents;
    var startIdx, endIdx;
    if (ruleDefinition.ruleName.includes('_')) {
      startIdx = ruleDefinition.definitionInterval.startIdx + defString.lastIndexOf('--');
      endIdx = startIdx + 2;
      return {
        startIdx: startIdx,
        endIdx: endIdx
      };
    } else {
      return nameInterval(ruleDefinition);
    }
  }

  function nameInterval(ruleDefinition) {
    var defString = ruleDefinition.definitionInterval.contents;
    var startIdx, endIdx;
    if (ruleDefinition.ruleName.includes('_')) {
      // next token after --
      var beginName = defString.lastIndexOf('--');
      var afterDashes = defString.slice(beginName + 2);
      var afterDashesTrimmed = afterDashes.trim();
      var afterDashesTrIdx = afterDashes.indexOf(afterDashesTrimmed);

      startIdx = beginName + 2 + afterDashesTrIdx;
      endIdx = startIdx + afterDashesTrimmed.length;
    } else {
      // first token before =
      var equalsIndex = defString.indexOf('+=');
      if (equalsIndex === -1) {
        equalsIndex = defString.indexOf(':=');
      }
      if (equalsIndex === -1) {
        equalsIndex = defString.indexOf('=');
      }

      var beforeEquals = defString.slice(0, equalsIndex);
      var beforeEqualsTrimmed = beforeEquals.trim();
      var beforeEqualsTrIdx = beforeEquals.indexOf(beforeEqualsTrimmed);

      startIdx = beforeEqualsTrIdx;
      endIdx = startIdx + beforeEqualsTrimmed.length;
    }

    return {
      startIdx: ruleDefinition.definitionInterval.startIdx + startIdx,
      endIdx: ruleDefinition.definitionInterval.startIdx + endIdx
    };
  }

  function toggleExamplesFor(position) {
    if (exampleDisplay.lineWidget) {
      exampleDisplay.DOM.style.height = 0;
      exampleDisplay.lineWidget.clear();
      exampleDisplay.lineWidget = null;
      exampleDisplay.DOM = null;
    }
    if ((exampleDisplay.rule &&
         exampleDisplay.rule.ruleName !== mousePositionInfo.rule.ruleName) ||
        !exampleDisplay.rule) {
      exampleWorkerManager.requestExamples(
        ruleDefinitionFor(grammarEditor, position).ruleName
      );
    } else {
      exampleDisplay.rule = null;
    }
  }

  exampleWorkerManager.addListener('received:examples', function(ruleName, examples) {
    examples = examples || [];
    exampleDisplay.DOM = makeExampleDisplay(ruleName, examples.filter(function(_, i) {
      return i < 10;
    }));
    exampleDisplay.lineWidget = grammarEditor.addLineWidget(
      mousePositionInfo.position.line, exampleDisplay.DOM
    );
    exampleDisplay.rule = Object.assign({}, grammar.ruleBodies[ruleName], {ruleName: ruleName});
    exampleDisplay.DOM.style.height = 0;
    setTimeout(function() { exampleDisplay.DOM.style.height = 'auto'; }, 0);
  });

  function makeExampleDisplay(ruleName, examples) {
    return utils._('div', {
      class: 'exampleDisplay'
    }, utils._('h3', {}, utils.t(ruleName)), makeExampleList(examples, ruleName));
  }

  function makeExampleList(examples, ruleName) {
    if (examples.length === 0) {
      return utils.t('No Examples Found');
    }

    var args = ['ul', {class: 'exampleList'}].concat(examples.map(function(example) {
      var DOMNode = utils._('li', {},
                      utils._('span', {class: 'exampleText'}, utils.t(example)),
                      utils._('span', {class: 'addExample'}, utils.t('+')));

      var id;
      DOMNode.addEventListener('click', function(e) {
        var examples = ohmEditor.examples.getExamples();
        examples = utils.objectMap(examples, function(_, value) { return value; });
        if (!examples.some(function(ex) {
               return ex.text === example;
             })) {
          id = ohmEditor.examples.addExample();
          ohmEditor.examples.setExample(id, example, ruleName);
          ohmEditor.examples.saveExamples();
        }

        ohmEditor.examples.setSelected(id);
      });

      return DOMNode;
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
      if (linksEnabled && mousePositionInfo.mark) {
        var position = getPointPosition(editor, mouseCoords.x, mouseCoords.y);
        var rule = ruleDefinitionFor(editor, position);
        if (rule && rule.ruleName === mousePositionInfo.rule.ruleName) {
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
