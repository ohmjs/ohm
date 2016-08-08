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
               root.cmUtil, root.utils, root.domUtil, root.d3);
  }
})(this, function(ohmEditor, exampleWorkerManager, cmUtil, utils, domUtil, d3) {
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
  function updateLinksEnabled(e) {
    var modifierKey = isPlatformMac() ? e.metaKey : e.ctrlKey;
    linksEnabled = modifierKey && e.shiftKey && !e.altKey &&
                   !(isPlatformMac() ? e.ctrlKey : e.metaKey);
    return linksEnabled && ohmEditor.options.showExampleGenerator;
  }

  function updateLinks(cm, e) {
    cmUtil.clearMark(mousePositionInfo.mark);
    mousePositionInfo.markRule = null;
    mousePositionInfo.markPosition = null;

    if (mouseCoords && updateLinksEnabled(e)) {
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
    if (mouseCoords && updateLinksEnabled(e)) {
      if (!clickableMarks) {
        var availableExamples = utils.difference(
          Object.keys(grammar.rules),
          exampleWorkerManager.neededExamples
        );
        var availableExampleBodies = availableExamples.map(function(ruleName) {
          return Object.assign({}, grammar.rules[ruleName], {ruleName: ruleName});
        });
        var neededExampleBodies = exampleWorkerManager.neededExamples.map(function(ruleName) {
          return Object.assign({}, grammar.rules[ruleName], {ruleName: ruleName});
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
    } else if (clickableMarks) {
      clickableMarks.forEach(function(clickableMark) {
        cmUtil.clearMark(clickableMark);
      });
      clickableMarks = null;
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
    utils.objectForEach(grammar.rules, function(ruleName, rule) {
      if (rule.source.startIdx <= index &&
          rule.source.endIdx > index) {
        relevantRuleDefinitions.push(Object.assign({}, rule, {ruleName: ruleName}));
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

  function indicatorInterval(rule) {
    var defString = rule.source.contents;
    var startIdx;
    var endIdx;
    if (rule.ruleName.includes('_')) {
      startIdx = rule.source.startIdx + defString.lastIndexOf('--');
      endIdx = startIdx + 2;
      return {
        startIdx: startIdx,
        endIdx: endIdx
      };
    } else {
      return nameInterval(rule);
    }
  }

  function nameInterval(rule) {
    var defString = rule.source.contents;
    var startIdx;
    var endIdx;
    if (rule.ruleName.includes('_')) {
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
      startIdx: rule.source.startIdx + startIdx,
      endIdx: rule.source.startIdx + endIdx
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
    exampleDisplay.rule = Object.assign({}, grammar.rules[ruleName], {ruleName: ruleName});
    exampleDisplay.DOM.style.height = 0;
    setTimeout(function() { exampleDisplay.DOM.style.height = 'auto'; }, 0);
  });

  function makeExampleDisplay(ruleName, examples) {
    var div = domUtil.createElement('div.exampleDisplay');
    div.appendChild(domUtil.createElement('h3', ruleName));
    div.appendChild(makeExampleList(examples, ruleName));

    return div;
  }

  function makeExampleList(examples, ruleName) {
    if (examples.length === 0) {
      return domUtil.createElement('span', 'No Examples Found');
    }

    var ul = domUtil.createElement('ul.exampleList');
    examples.forEach(function(example) {
      var li = domUtil.createElement('li');
      li.appendChild(domUtil.createElement('span.exampleText', example));
      li.appendChild(domUtil.createElement('span.addExample', '+'));

      var id;
      li.addEventListener('click', function(e) {
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

      ul.appendChild(li);
    });

    return ul;
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
      if (updateLinksEnabled(e)) {
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
    if (!err) {
      if (!grammarEditor) {
        grammarEditor = ohmEditor.ui.grammarEditor;
        registerListeners(grammarEditor);
      }
      grammar = g;
    }
    clickableMarks = null;
  });

});
