/* eslint-env browser */

'use strict';

// TODO: handle invalid grammar in textbox

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohm, root.ohmEditor, root.exampleWorkerManager,
               root.utils, root.domUtil, root.autosize);
  }
})(this, function(ohm, ohmEditor, exampleWorkerManager, utils, domUtil, autosize) {

  var neededExamples = [];

  var focusedElement = null;
  var focusedRuleName = '';

  var timeout = null;
  exampleWorkerManager.addListener('received:neededExamples', function(updatedNeededExamples) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(function() {
      // var neededExampleList = domUtil.$('#exampleRequests ul');
      var inputList = domUtil.$('#neededExamples > ul');

      neededExamples = updatedNeededExamples;

      Array.prototype.slice.call(inputList.children)
        .forEach(function(childNode) {
          if (childNode.firstChild !== focusedElement) {
            inputList.removeChild(childNode);
          }
        });

      neededExamples.filter(function(ruleName) {
        return ruleName !== focusedRuleName;
      }).forEach(function(ruleName) {
        inputList.appendChild(domUtil.createElement('li', ruleName));
      });
    }, 200);
  });

  exampleWorkerManager.addListener('received:neededExamples', function(updatedNeededExamples) {
    var inputList = domUtil.$('#neededExamples > ul');
    var startRuleDropdown = domUtil.$('#startRuleDropdown');

    var startRule = ohmEditor.examples.getSelected().startRule;

    if (startRuleDropdown) {
      startRuleDropdown.parentElement.removeChild(startRuleDropdown);
    }
    inputList.parentElement.insertBefore(
      makeStartRuleDropdown(ohmEditor.grammar, neededExamples, startRule), inputList
    );
  });

  ohmEditor.examples.addListener('set:selected', function(id) {
    var value = ohmEditor.examples.getExample(id);
    var inputList = domUtil.$('#neededExamples > ul');
    var startRuleDropdown = domUtil.$('#startRuleDropdown');
    var startRule = value.startRule;

    if (startRuleDropdown) {
      startRuleDropdown.parentElement.removeChild(startRuleDropdown);
    }
    inputList.parentElement.insertBefore(
      makeStartRuleDropdown(ohmEditor.grammar, neededExamples, startRule), inputList
    );

    ohmEditor.startRule = value.startRule;
  });

  function makeStartRuleDropdown(grammar, neededExamples, optStartRule) {
    var startRule = optStartRule || null;
    var dropdown = domUtil.createElement('select');
    dropdown.id = 'startRuleDropdown';

    Object.keys(grammar.rules).forEach(function(ruleName) {
      var item = domUtil.createElement('option', ruleName);
      item.value = ruleName;

      if (neededExamples.includes(ruleName)) {
        item.classList.add('needed');
      }

      dropdown.appendChild(item);
    });

    if (startRule !== null) {
      var option = Array.prototype.find.call(
        dropdown.options,
        function(option) { return option.value === startRule; }
      );
      option.selected = true;
    }

    return dropdown;
  }
});
