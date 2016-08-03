/* eslint-env browser */

'use strict';

// This module handles the parsing timeline that appears at the bottom of the parse tree.
(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohmEditor, root.domUtil);
  }
})(this, function(ohmEditor, domUtil) {
  var parsingSteps;

  // Maps from a node ID (i.e., the `id` property of a trace element) to an object
  // {enter: Number, exit: Number}. The numbers are the indices in `parsingSteps` where
  // the enter and exit steps are found.
  var stepsByNodeId;

  // Maps from a Failure key to the parsing step for that failure.
  var stepsByFailureKey;

  var matchResult;
  var oldStep;
  var slider = domUtil.$('#timeSlider');

  var timelineEnabled;

  // Helpers
  // -------

  function addParsingStep(obj) {
    parsingSteps.push(obj);
    slider.value = slider.max = parsingSteps.length;
  }

  // If the match failed and `node` corresponds to one of the rightmost failures, record
  // the current parsing step in the `stepsByFailureKey` map. This makes it possible
  // to jump to the step when the user hovers over the failure message.
  function maybeRecordFailureStep(result, node) {
    if (result.failed() && !node.succeeded) {
      if (node.pos === result.getRightmostFailurePosition()) {
        result.getRightmostFailures().find(function(f) {
          if (f.pexpr === node.expr) {
            stepsByFailureKey[f.toKey()] = parsingSteps.length;
            return true;
          }
          return false;
        });
      }
    }
  }

  function gotoTimestep(step) {
    slider.value = step;
    for (var i = 0; i < parsingSteps.length; ++i) {
      var cmd = parsingSteps[i];
      var el = cmd.el;
      var isStepComplete = i <= step;

      switch (cmd.type) {
        case 'enter':
          el.hidden = !isStepComplete;
          // Mark the element as undecided, unless it is a leaf node.
          // Leaf nodes become decided as soon as control moves to them.
          if (!el.classList.contains('leaf')) {
            el.classList.add('undecided');
          }
          break;
        case 'exit':
          if (isStepComplete) {
            el.classList.remove('undecided');
          }
          break;
      }
    }
    // Highlight the currently-active step (unhighlighting the previous one first).
    var stepEl = domUtil.$('.currentParseStep');
    if (stepEl) {
      stepEl.classList.remove('currentParseStep');

      // Re-collapse anything that was expanded just to make the current step visible.
      while ((stepEl = domUtil.closestElementMatching('.pexpr.should-collapse', stepEl))) {
        stepEl.classList.remove('should-collapse');
        ohmEditor.parseTree.setTraceElementCollapsed(stepEl, true, 0);
      }
    }
    if (step < parsingSteps.length) {
      stepEl = parsingSteps[step].el;
      stepEl.classList.add('currentParseStep');

      // Make sure the current step is not hidden in a collapsed tree.
      while ((stepEl = domUtil.closestElementMatching('.pexpr.collapsed', stepEl))) {
        stepEl.classList.add('should-collapse');
        ohmEditor.parseTree.setTraceElementCollapsed(stepEl, false, 0);
      }
    }
  }

  // Event listeners
  // ---------------

  // When the time slider is scrubbed, move backwards/forwards through the
  // individual parsing steps.
  slider.oninput = function(e) {
    gotoTimestep(parseInt(e.target.value, 10));
  };

  ohmEditor.parseTree.addListener('render:parseTree', function(trace) {
    parsingSteps = [];
    stepsByNodeId = {};
    stepsByFailureKey = {};

    matchResult = trace.result;

    // If matchResult is not defined, we are not rendering the top-level trace, so disable
    // the timeline feature.
    timelineEnabled = matchResult != null;
    slider.disabled = !timelineEnabled;
    slider.value = slider.max = 1;
  });

  ohmEditor.parseTree.addListener('create:traceElement', function(el, traceNode) {
    // If the node is labeled, record it as a distinct "step" in the parsing timeline.
    if (timelineEnabled && !el.classList.contains('hidden')) {
      maybeRecordFailureStep(matchResult, traceNode);
      stepsByNodeId[el.id] = {enter: parsingSteps.length};
      addParsingStep({
        type: 'enter',
        el: el,
        node: traceNode,
        collapsed: el.classList.contains('collapsed')
      });
    }
  });

  ohmEditor.parseTree.addListener('exit:traceElement', function(el, traceNode) {
    if (timelineEnabled && el.id in stepsByNodeId) {
      // Attempt to record the failure step again, possibly overwriting the previous value.
      // This means that we prefer the 'exit' step over the 'enter' step.
      maybeRecordFailureStep(matchResult, traceNode);
      stepsByNodeId[el.id].exit = parsingSteps.length;
      addParsingStep({type: 'exit', node: traceNode, el: el});
    }
  });

  ohmEditor.addListener('peek:failure', function(failure) {
    oldStep = slider.value;
    gotoTimestep(stepsByFailureKey[failure.toKey()]);
  });

  ohmEditor.addListener('unpeek:failure', function() {
    if (oldStep !== -1) {
      gotoTimestep(oldStep);
      oldStep = -1;
    }
  });

  ohmEditor.addListener('goto:failure', function(failure) {
    gotoTimestep(stepsByFailureKey[failure.toKey()]);
    oldStep = -1;
    slider.focus();
  });
});
