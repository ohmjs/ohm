'use strict';

var examples = {};

var overrides = {
  ident(g, ex, syn, args){
    return {needHelp: true};
  },
  letter(g, ex, syn, args){
    if(Math.floor(Math.random()*2) === 0){
      return {example: String.fromCharCode(Math.floor(26*Math.random()) + 'a'.charCodeAt(0))}
    } else {
      return {example: String.fromCharCode(Math.floor(26*Math.random()) + 'A'.charCodeAt(0))}
    }
  }
};


var isSyntactic = function(ruleName){
  return ruleName.charAt(0).toUpperCase() === ruleName.charAt(0);
};

var parseToPExpr = function(ruleName){
  return ohm._buildGrammar(ohm.ohmGrammar.match(ruleName, 'Base_application'));
}

var parametrized = function(ruleName, grammar){
  return grammar.ruleFormals[ruleName].length > 0;
}

var initialRules = function(grammar){
  let rules = [];
  objectForEach(grammar.ruleBodies, (ruleName, ruleBody)=>{
    if(!parametrized(ruleName, grammar)){
      rules.push(ruleName);
    }
  });
  return rules;
}

var generateForRule = function(rules, ruleName){
  let rulePExpr = parseToPExpr(ruleName);

  let example;
  if(overrides.hasOwnProperty(ruleName)){
    //  && (grammar.ruleBodies[ruleName] ===
    //      ohm.ohmGrammar.superGrammar.ruleBodies[ruleName])){
    example = overrides[ruleName](
      grammar, examples, isSyntactic(rulePExpr.ruleName), rulePExpr.args
    );
    console.log('override for', ruleName, example);
  } else {
    example = grammar.ruleBodies[rulePExpr.ruleName].generateExample(
      grammar, examples, isSyntactic(rulePExpr.ruleName), rulePExpr.args
    );
  }

  if(example.hasOwnProperty('example')
     && grammar.match(example.example, ruleName).succeeded()){
       console.info(ruleName, example.example);
       if(!examples.hasOwnProperty(ruleName)){
         examples[ruleName] = [];
       }
       if(!examples[ruleName].includes(example.example)){
         examples[ruleName].push(example.example);
       }
  }

  if(example.hasOwnProperty('examplesNeeded')) {
    example.examplesNeeded.forEach(needed=> {
      if(!rules.includes(needed)){
        rules.push(needed)
      }
    });
  }
}

var runGenerationPass = function(rules){
  console.info('*********NEW GENERATION PASS*******')
  for(let ruleName of rules){
    repeat(3, ()=>{
      generateForRule(rules, ruleName);
    });
  }
}

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

var processExampleFromUser = function(example, optRuleName){
  if(optRuleName){
    console.log(optRuleName);
    let trace = grammar.trace(example, optRuleName);
    if(trace.succeeded){
      console.log(example, optRuleName);
      addPiecesToDict(trace, examples);
    }
  }

  objectForEach(grammar.ruleBodies, function(ruleName){
    let trace = grammar.trace(example, ruleName);
    if(trace.succeeded){
      addPiecesToDict(trace, examples);
    }
  });
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
  propagateExamples(0.1);
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
  // let needed = refreshExampleRequests();
  // let coverage = 1 - needed.length/(Object.keys(grammar.ruleBodies).length);
  clearDOMNode($('#examples'));
  // $('#examples').appendChild(_('h3', {}, t(`coverage: ${Math.floor(coverage*100)}%`)));
  // $('#examples').appendChild(_('ul', {}, ...needed.map(ruleName=>{
  //   let exampleRequest = new ErrorCheckingTextBox(grammar, ruleName);
  //   exampleRequest.on('validSubmit', submitHandler.bind(exampleRequest));
  //   return _('li', {}, exampleRequest.domNode);
  // })));
  $('#examples').appendChild(_('hr'))
  $('#examples').appendChild(displayExamples(examples));
}

let rules = initialRules(grammar);


var propagateExamples = function(multiplier){
  let numIterations = rules.length * multiplier;
  repeat(numIterations, (n)=>{
    console.log(n);
    shuffle(rules);
    runGenerationPass(rules);
  });
}

propagateExamples(0.3);
refresh();
