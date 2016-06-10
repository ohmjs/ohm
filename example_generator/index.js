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

var addPiecesToDict = function(trace, examples){
  if(trace.expr.constructor.name === 'Terminal'){
    return;
  } else {
    if(trace.expr.constructor.name === 'Apply'){
      let ruleName = trace.expr.toString();
      if(!examples.hasOwnProperty(ruleName)){
        examples[ruleName] = [];
      }

      if(!examples[ruleName].includes(trace.interval.contents)){
        examples[ruleName].push(trace.interval.contents);
      }
    }
    trace.children
         .filter(child=> child.succeeded)
         .forEach(child=> addPiecesToDict(child, examples));
  }
}

var isSyntactic = function(ruleName){
  return ruleName.charAt(0).toUpperCase() === ruleName.charAt(0);
};

var parseToPExpr = function(ruleName){
  return ohm._buildGrammar(ohm.ohmGrammar.match(ruleName, 'Base_application'));
}


var allExamplesNeeded = function(){
  let needed = new Set();
  objectForEach(grammar.ruleBodies, (ruleName, rule)=>{
    let example = rule.generateExample(grammar, examples, isSyntactic(ruleName), []);
    if(example.hasOwnProperty('examplesNeeded')){
      example.examplesNeeded.forEach(neededRuleName => needed.add(neededRuleName));
    }
    if(example.hasOwnProperty('example') && example.example !== undefined){
      processExample(example.example, ruleName);
      if(!(grammar.match(example.example, ruleName).succeeded())){
        needed.add(ruleName);
      }
    } else if(!examples.hasOwnProperty(ruleName)) { //if we can't make an example and don't have any others
      needed.add(ruleName);
    }
  });
  console.log(Array.from(needed));

  //try generating examples in needed list
  while(needed.size > 0 && attemptGeneration(needed));

  return Array.from(needed);
};

var attemptGeneration = function(needed){
  let r = false;
  for(let neededRuleName of needed){
    if(examples.hasOwnProperty(neededRuleName)){
      needed.delete(neededRuleName);
      return true;
    }

    let rulePExpr = parseToPExpr(neededRuleName);

    let example = grammar.ruleBodies[rulePExpr.ruleName].generateExample(
      grammar, examples, isSyntactic(rulePExpr.ruleName), rulePExpr.args
    );

    if(example.hasOwnProperty('example') && example.example !== undefined
       && grammar.match(example.example, neededRuleName).succeeded()){
      console.log(neededRuleName);
      processExample(example.example, neededRuleName);
      needed.delete(neededRuleName);
      return true;
    } else if(example.hasOwnProperty('examplesNeeded')) {
      let sizeBefore = needed.size;
      example.examplesNeeded.forEach(ruleName=> needed.add(ruleName));
      if(needed.size > sizeBefore){
        r = true;
      }
    }
  }
  return r;
}

var processExample = function(example, optRuleName){
  if(optRuleName){
    // console.log(optRuleName);
    console.log(example, optRuleName);
    let trace = grammar.match(example, optRuleName);
    if(trace.succeeded()){
      console.log(example, optRuleName);
      if(!examples.hasOwnProperty(optRuleName)){
        examples[optRuleName] = [];
      }

      if(!examples[optRuleName].includes(example)){
        examples[optRuleName].push(example);
      }
      // addPiecesToDict(trace, examples);
    }
  }

  // objectForEach(grammar.ruleBodies, function(ruleName){
  //   let trace = grammar.trace(example, ruleName);
  //   if(trace.succeeded){
  //     addPiecesToDict(trace, examples);
  //   }
  // });
};

var processExampleFromUser = function(example, optRuleName){
  if(optRuleName){
    console.log(optRuleName);
    let trace = grammar.trace(example, optRuleName);
    if(trace.succeeded){
      console.log(example, optRuleName);
      addPiecesToDict(trace, examples);
    }
  }

  // objectForEach(grammar.ruleBodies, function(ruleName){
  //   let trace = grammar.trace(example, ruleName);
  //   if(trace.succeeded){
  //     addPiecesToDict(trace, examples);
  //   }
  // });
};


//DISPLAY FUNCTIONS

var refreshExampleRequests = function(){
  let exampleRequests = $('#exampleRequests');
  clearDOMNode(exampleRequests);
  let needed = allExamplesNeeded().filter(neededRuleName=>
    grammar.ruleBodies.hasOwnProperty(neededRuleName));
  return needed;
}

var submitHandler = function(event){
  this.domNode.value = '';
  processExampleFromUser(event.text, event.ruleName);
  refresh();
};

var displayExamples = function(examples){
  return _('div', {},
    ...objectMap(grammar.ruleBodies, function(ruleName){
    let ruleExamples = examples[ruleName];
    let exampleRequest = new ErrorCheckingTextBox(grammar, ruleName);
    exampleRequest.on('validSubmit', submitHandler.bind(exampleRequest));

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
    exampleRequest.on('validSubmit', submitHandler.bind(exampleRequest));
    return _('li', {}, exampleRequest.domNode);
  })));
  $('#examples').appendChild(_('hr'))
  $('#examples').appendChild(displayExamples(examples));
}


refresh();
