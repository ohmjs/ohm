'use strict';

class AST {
  constructor() {}

  toString() {
    throw new Error('abstract method!');
  }
}

class Program extends AST {
  constructor(rules) {
    super();
    this.rules = rules;
  }

  toString() {
    return this.rules.map(rule => rule.toString() + '.').join('\n');
  }
}

class Rule extends AST {
  constructor(head, body) {
    super();
    this.head = head;
    this.body = body;
  }

  toString() {
    return this.body.length === 0 ?
        this.head.toString() :
        this.head.toString() + ' :- ' + this.body.map(clause => clause.toString()).join(' and ');
  }
}

class Clause extends AST {
  constructor(name, args) {
    super();
    this.name = name;
    this.args = args;
  }

  toString() {
    return '<' + this.name + '>(' + this.args.map(arg => arg.toString()).join(', ') + ')';
  }
}

class Not extends AST {
  constructor(clause) {
    super();
    this.clause = clause;
  }

  toString() {
    return 'not ' + this.clause.toString();
  }
}

class Value extends AST {
  constructor(value) {
    super();
    this.value = value;
  }

  toString() {
    return this.value.toString();
  }
}

class Variable extends AST {
  constructor(name) {
    super();
    this.name = name;
  }

  toString() {
    return this.name;
  }
}

class Wildcard extends AST {
  constructor() {
    super();
  }

  toString() {
    return '_';
  }
}
