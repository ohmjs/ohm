'use strict';

var examples = {};

semantics.addOperation('addPiecesToDict(dict)', {
  _nonterminal(children){
    let {dict} = this.args;

    if(!dict.hasOwnProperty(this.ctorName)){
      dict[this.ctorName] = [];
    }

    if(!dict[this.ctorName].includes(this.interval.contents)){
      dict[this.ctorName].push(this.interval.contents);
    }

    children.forEach((child)=> child.addPiecesToDict(dict));
  }, _terminal(){}
});

var isSyntactic = function(ruleName){
  return ruleName.charAt(0).toUpperCase() === ruleName.charAt(0);
};

var allExamplesNeeded = function(){
  let needed = new Set();
  objectForEach(grammar.ruleBodies, (ruleName, rule)=>{
    let example = rule.generateExample(grammar, examples, isSyntactic(ruleName));
    if(example.hasOwnProperty('examplesNeeded')){
      example.examplesNeeded.forEach(neededRuleName => needed.add(neededRuleName));
    }
    if(example.hasOwnProperty('example')){
      processExample(example.example);
      if(!(grammar.match(example.example, ruleName).succeeded())){
        needed.add(ruleName);
      }
    } else if(!examples.hasOwnProperty(ruleName)) { //if we can't make an example and don't have any others
      needed.add(ruleName);
    }
  });

  //try generating examples in needed list
  while(needed.size > 0 && attemptGeneration(needed));

  return Array.from(needed);
};

var attemptGeneration = function(needed){
  for(let neededRuleName of needed){
    if(grammar.ruleBodies.hasOwnProperty(neededRuleName)){
      if(examples.hasOwnProperty(neededRuleName)){
        needed.delete(neededRuleName);
        return true;
      }

      let example = grammar.ruleBodies[neededRuleName].generateExample(
        grammar, examples, isSyntactic(neededRuleName)
      );

      if(example.hasOwnProperty('example')
         && grammar.match(example.example, neededRuleName).succeeded()){
        processExample(example.example);
        needed.delete(neededRuleName);
        return true;
      }
    }
  }
  return false;
}


var refreshExampleRequests = function(){
  let exampleRequests = $('#exampleRequests');
  clearDOMNode(exampleRequests);
  let needed = allExamplesNeeded().filter(neededRuleName=>
    grammar.ruleBodies.hasOwnProperty(neededRuleName));
  return needed;
}

var processExample = function(example){
  objectForEach(grammar.ruleBodies, function(ruleName){
    let match = grammar.match(example, ruleName);
    if(match.succeeded()){
      semantics(match).addPiecesToDict(examples);
    }
  });
};

var displayExamples = function(examples){
  return _('div', {},
    ...objectMap(grammar.ruleBodies, function(ruleName){
    let ruleExamples = examples[ruleName];
    let exampleRequest = new ErrorCheckingTextBox(grammar, ruleName);
    exampleRequest.on('validSubmit', function(event){
      exampleRequest.domNode.value = '';
      processExample(event.text, event.ruleName);
      refresh();
    });

    let rendered;
    if(ruleExamples){
      rendered = _('examplesForRule', {class: ruleName},
        exampleRequest.domNode,
        _('h4', {}, t('= '+grammar.ruleBodies[ruleName].interval.contents)),
        ...ruleExamples.map(example=> _('example', {}, t(example)))
      );
    } else {
      exampleRequest.domNode.classList.add('request');
      rendered = _('examplesForRule', {class: ruleName},
        exampleRequest.domNode,
        _('h4', {}, t('= '+grammar.ruleBodies[ruleName].interval.contents))
      );
    }

    return rendered;
  }));
}

var refresh = function(){
  let needed = refreshExampleRequests();
  let coverage = 1 - needed.length/(Object.keys(grammar.ruleBodies).length);
  clearDOMNode($('#examples'));
  $('#examples').appendChild(_('h3', {}, t(`coverage: ${Math.floor(coverage*100)}%`)));
  $('#examples').appendChild(_('ul', {}, ...needed.map(ruleName=>{
    let exampleRequest = new ErrorCheckingTextBox(grammar, ruleName);
    exampleRequest.on('validSubmit', function(event){
      exampleRequest.domNode.value = '';
      processExample(event.text, event.ruleName);
      refresh();
    });
    return _('li', {}, exampleRequest.domNode);
  })));
  $('#examples').appendChild(_('hr'))
  $('#examples').appendChild(displayExamples(examples));
}

refresh();

//$('#examples').textContent = JSON.stringify(examples, null, 2);
