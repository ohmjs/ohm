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

  // TODO: clicking off of textarea triggers refresh, deleting content

  // logic for arrow to open drawer and show needed examples menu
  var examplesNeededDrawer = domUtil.$('#examplesNeededDrawer');
  var examplesNeededIndicator = domUtil.$('#examplesNeededDrawer .indicator');
  var exampleSplitter = domUtil.$('#exampleSplitter');
  examplesNeededDrawer.addEventListener('click', function() {
    var exampleRequestContainer = domUtil.$('#exampleRequestContainer');
    exampleRequestContainer.classList.toggle('hidden');
    exampleSplitter.classList.toggle('disabled',
      exampleRequestContainer.classList.contains('hidden')
    );
  });

  var timeout = null;
  exampleWorkerManager.addListener('received:neededExamples', function(updatedNeededExamples) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(function() {
      var neededExampleList = domUtil.$('#exampleRequests ul');

      neededExamples = updatedNeededExamples;

      Array.prototype.slice.call(neededExampleList.children)
        .forEach(function(childNode) {
          if (childNode.firstChild !== focusedElement) {
            neededExampleList.removeChild(childNode);
          }
        });

      neededExamples.filter(function(ruleName) {
        return ruleName !== focusedRuleName;
      }).forEach(function(ruleName) {
        var li = domUtil.createElement('li');
        li.appendChild(makeExampleRequest(ruleName));
        neededExampleList.appendChild(li);
      });

      examplesNeededIndicator.classList.toggle('active', neededExamples.length !== 0);
    }, 200);
  });

  function makeExampleRequest(ruleName) {
    var request = new ExampleRequest(ohmEditor.grammar, ruleName, function(event) {
      request.domNode.value = '';
      exampleWorkerManager.addUserExample(request.ruleName, event.text);
      exampleWorkerManager.updateNeededExamples();
    });

    request.domNode.addEventListener('focusin', function() {
      focusedElement = request.domNode;
      focusedRuleName = request.ruleName;
    });
    request.domNode.addEventListener('focusout', function(e) {
      focusedElement = null;
      focusedRuleName = '';

      if (request.domNode.value.trim() === '' &&
          !neededExamples.includes(ruleName)) {
        request.domNode.parentNode.removeChild(request.domNode);
      }
    });

    return request.domNode;
  }

  // ExampleRequest is a textarea with the ability to check if its contents are valid
  //  according to a rule. If not, the background is turned pink.
  function ExampleRequest(grammar, ruleName, validSubmitListener) {
    this.ruleName = ruleName;
    this.grammar = grammar;

    this.domNode = domUtil.createElement('textarea');
    this.domNode.placeholder = ruleName;
    autosize(this.domNode);

    this.validSubmitListener = validSubmitListener;

    var that = this;
    this.domNode.addEventListener('keydown', function(kbevent) {
      if (kbevent.code === 'Enter' && kbevent.ctrlKey) {
        kbevent.preventDefault();
      }
    });
    this.domNode.addEventListener('keyup', function(kbevent) {
      that.onChange(kbevent);
      if (that._previousTimeout) {
        clearTimeout(that._previousTimeout);
      }
      that._previousTimeout = setTimeout(function() {
        that._previousTimeout = null;
        that.onSettledChange(kbevent);
      }, 500);
    });
  }

  ExampleRequest.prototype.isValid = function() {
    return this.grammar.match(this.domNode.value, this.ruleName).succeeded();
  };

  ExampleRequest.prototype.onChange = function(kbevent) {
    if (kbevent.code === 'Enter' && kbevent.ctrlKey) {
      if (this.isValid()) {
        this.validSubmitListener({
          text: this.domNode.value,
          ruleName: this.ruleName
        });
      }
    }
  };

  ExampleRequest.prototype.onSettledChange = function(kbevent) {
    if (this.isValid()) {
      this.domNode.classList.remove('invalid');
    } else {
      this.domNode.classList.add('invalid');
    }
  };
});
