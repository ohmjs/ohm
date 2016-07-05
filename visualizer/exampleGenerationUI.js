/* eslint-env browser */

'use strict';

//TODO: handle invalid grammar in textbox

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohm, root.ohmEditor, root.utils, root.autosize);
  }
})(this, function(ohm, ohmEditor, utils, autosize) {
  var exampleGenerator = new Worker('exampleGenerator.js');
  var examplesNeeded = null;
  var focusedElement = null;
  var focusedRuleName = '';

  // TODO: may want to reset current worker instead
  ohmEditor.addListener('parse:grammar', function(_, grammar, __) {
    exampleGenerator.terminate();
    exampleGenerator = new Worker('exampleGenerator.js');
    exampleGenerator.onmessage = onWorkerMessage;
    exampleGenerator.postMessage({
      name: 'initialize', recipe: grammar.toRecipe()
    });
  });

  function onWorkerMessage(event) {
    switch(event.data.name){
      case 'examplesNeeded':
        onExamplesNeeded(event);
        break;
      default:
        console.log('WORKER:', event.data);
    }
  }

  var timeout = null;
  var lastUpdated = 0;
  function onExamplesNeeded(event) {
    console.log('EXAMPLES NEEDED UPDATED', event.data.examplesNeeded);
    examplesNeeded = event.data.examplesNeeded;
    if(timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(function () {
      console.log('updating');
      lastUpdated = Date.now();
      var neededExampleList = utils.$('#exampleRequests ul');

      Array.prototype.slice.call(neededExampleList.children)
      .forEach(function(childNode) {
        if(childNode.firstChild !== focusedElement){
          neededExampleList.removeChild(childNode);
        } else {
          console.log('skipping focused element', focusedElement);
        }
      });

      event.data.examplesNeeded.filter(function(ruleName) {
        return ruleName !== focusedRuleName;
      }).forEach(function(ruleName) {
        neededExampleList.appendChild(
          utils._('li', {}, makeExampleRequest(ruleName))
        );
      });
    }, 200);
  }

  function makeExampleRequest(ruleName) {
    var request = new ExampleRequest(ohmEditor.grammar, ruleName);

    request.domNode.addEventListener('focusin', function() {
      console.log('FOCUSED', request.ruleName);
      focusedElement = request.domNode;
      focusedRuleName = request.ruleName;
    });
    request.domNode.addEventListener('focusout', function(e) {
      console.log('UNFOCUSED', request.ruleName, e);
      focusedElement = null;
      focusedRuleName = '';

      exampleGenerator.postMessage({
        name: 'examplesNeeded'
      });
    });
    request.addListener('validSubmit', function(event) {
      request.domNode.value = '';
      exampleGenerator.postMessage({
        name: 'userExample',
        example: event.text,
        ruleName: request.ruleName
      });
    });

    return request.domNode;
  }

  function ExampleRequest(grammar, ruleName) {
    this.ruleName = ruleName;
    this.grammar = grammar;
    this.domNode = utils._('textarea', {
      type: 'text',
      placeholder: ruleName
    });
    autosize(this.domNode);

    this.listeners = {};

    var that = this;
    this.domNode.addEventListener('keydown', function(kbevent) {
      if(kbevent.code === 'Enter' && kbevent.ctrlKey){
        kbevent.preventDefault();
      }
    });
    this.domNode.addEventListener('keyup', function(kbevent) {
      that.onChange(kbevent);
      if(that._previousTimeout){
        clearTimeout(that._previousTimeout);
      }
      that.onSettledChange(kbevent);
    });
  }

  ExampleRequest.prototype.isValid = function() {
    return this.grammar.match(this.domNode.value, this.ruleName).succeeded();
  }

  ExampleRequest.prototype.onChange = function(kbevent) {
    if(kbevent.code === 'Enter' && kbevent.ctrlKey){
      console.log(kbevent);
      if(this.isValid()){
        this.emit('validSubmit', {
          text: this.domNode.value,
          ruleName: this.ruleName
        });
      }
    }
  };

  ExampleRequest.prototype.onSettledChange = function(kbevent) {
    if(this.isValid()){
      this.domNode.classList.remove('invalid');
    } else {
      this.domNode.classList.add('invalid');
    }
  }

  ExampleRequest.prototype.addListener = function(eventName, listener){
    if(!this.listeners.hasOwnProperty(eventName)){
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(listener);
  }

  ExampleRequest.prototype.removeListener = function(eventName, listener){
    if(this.listeners.hasOwnProperty(eventName)){
      this.listeners[eventName] = this.listeners[eventName].filter(l=> l !== listener);
    }
  }

  ExampleRequest.prototype.emit = function(eventName, event){
    if(this.listeners.hasOwnProperty(eventName)){
      this.listeners[eventName].forEach(listener=> listener(event));
    }
  }


  // TODO: add event for new example/example change

  // TODO: add linewidgets
});
