'use strict';

window.ErrorCheckingTextBox = function(grammar, ruleName){
  this.ruleName = ruleName;
  this.grammar = grammar;
  this.domNode = _('textArea', {
    type: 'text',
    placeholder: ruleName
  });

  this.listeners = {};

  this.domNode.addEventListener('keydown', (kbevent)=>{
    if(kbevent.code === 'Enter' && kbevent.ctrlKey){
      kbevent.preventDefault();
    }
  })
  this.domNode.addEventListener('keyup', (kbevent)=>{
    this._emit('change', kbevent);
    if(this._previousTimeout){
      clearTimeout(this._previousTimeout);
    }
    this._previousTimeout = setTimeout(()=> this._emit('settledChange', kbevent), 500);
  });

  this.on('change', (kbevent)=>{
    let valid = this.grammar.match(this.domNode.value, this.ruleName).succeeded();
    if(kbevent.code === 'Enter' && kbevent.ctrlKey){
      console.log(kbevent);
      // kbevent.stopPropagation();
      if(valid){
        this._emit('validSubmit', {
          text: this.domNode.value,
          ruleName: this.ruleName
        });
      }
    }
  });

  this.on('settledChange', (kbevent)=>{
    //check against rule
    let valid = this.grammar.match(this.domNode.value, this.ruleName).succeeded();
    if(valid){
      this.domNode.classList.remove('invalid');
    } else {
      this.domNode.classList.add('invalid');
    }
  });
}

ErrorCheckingTextBox.prototype.on = function(eventName, listener){
  if(!this.listeners.hasOwnProperty(eventName)){
    this.listeners[eventName] = [];
  }

  this.listeners[eventName].push(listener);
}

ErrorCheckingTextBox.prototype.off = function(eventName, listener){
  if(this.listeners.hasOwnProperty(eventName)){
    this.listeners[eventName] = this.listeners[eventName].filter(l=> l !== listener);
  }
}

ErrorCheckingTextBox.prototype._emit = function(eventName, event){
  if(this.listeners.hasOwnProperty(eventName)){
    this.listeners[eventName].forEach(listener=> listener(event));
  }
}
