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
    console.log(`generated ${ruleName} (${example.example})`);
    if(example.hasOwnProperty('example')){
      if(!(grammar.match(example.example, ruleName).succeeded())){
        needed.add(ruleName);
      }
      processExample(example.example);
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
      let example = grammar.ruleBodies[neededRuleName].generateExample(
        grammar, examples, isSyntactic(neededRuleName)
      );

      if(example.hasOwnProperty('example')){
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

  needed.forEach(neededRuleName=> {
    let exampleRequest = new ErrorCheckingTextBox(grammar, neededRuleName);
    exampleRequests.appendChild(_('li', {}, exampleRequest.domNode));

    exampleRequest.on('validSubmit', function(event){
      exampleRequest.domNode.value = '';
      processExample(event.text, event.ruleName);
      refresh();
    });
  });

  return needed.length;
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
  return _('examples', {},
    ...objectMap(examples, function(ruleName, examples){
      return _('examplesForRule', {class: ruleName},
        ...[t(ruleName), ...examples.map(example=> _('example', {}, t(example)))]
      )
    })
  )
}

var refresh = function(){
  let numReqs = refreshExampleRequests();
  let coverage = 1 - numReqs/(Object.keys(grammar.ruleBodies).length);
  clearDOMNode($('#examples'));
  $('#examples').appendChild(_('h3', {}, t(`coverage: ${Math.floor(coverage*100)}%`)));
  $('#examples').appendChild(displayExamples(examples));
}

refresh();

//$('#examples').textContent = JSON.stringify(examples, null, 2);
