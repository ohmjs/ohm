'use strict';

const NLDatalog = {};

NLDatalog.grammar = ohm.grammar(`

  NLDatalog {

    Rules
      = ListOf<Rule, "."> "."?

    Rule
      = Clause if Body  -- conditional
      | Clause          -- fact

    Clause
      = (val | var | word | not)+

    Body
      = ListOf<Clause, and>

    val
      = upper alnum*  -- symbol
      | digit+        -- number

    var
      = upper  -- name
      | "_"    -- wildcard

    keyword = if | and | not
    if = "if" ~wordChar
    and = "and" ~wordChar
    not = "not" ~wordChar
    word = ~keyword wordChar+
    wordChar = "'" | lower

  }

`);

NLDatalog.semantics = NLDatalog.grammar.createSemantics().addOperation('toAST', {
  Rules(rules, optPeriod) {
    return new Program(rules.toAST());
  },

  Rule_conditional(head, _if, body) {
    return new Rule(head.toAST(), body.toAST());
  },

  Rule_fact(head) {
    return new Rule(head.toAST(), []);
  },

  Clause(parts) {
    let negated = false;
    let name = '';
    const args = [];
    parts.children.forEach((part, idx) => {
      if (part.isA('word')) {
        if (idx > 0 && part.sourceString[0] !== "'") {
          name = name + ' ';
        }
        name = name + part.sourceString;
      } else if (part.isA('not')) {
        negated = !negated;
      } else {
        if (idx > 0) {
          name = name + ' ';
        }
        name = name + '@';
        args.push(part.toAST());
      }
    });
    const clause = new Clause(name, args);
    return negated ? new Not(clause) : clause;
  },

  val_symbol(firstChar, otherChars) {
    return new Value(this.sourceString);
  },

  val_number(digits) {
    return new Value(parseInt(this.sourceString));
  },

  var_name(name) {
    return new Variable(name.sourceString);
  },

  var_wildcard(_) {
    return new Wildcard();
  },

  EmptyListOf() {
    return [];
  },

  NonemptyListOf(x, sep, xs) {
    return [x.toAST()].concat(xs.toAST());
  }

}).addOperation('isA(type)', {
  _nonterminal(children) {
    return this.ctorName === this.args.type;
  }
});

NLDatalog.parse = function(input) {
  const matchResult = this.grammar.match(input);
  if (matchResult.succeeded()) {
    return this.semantics(matchResult).toAST();
  } else {
    throw new Error(matchResult.message);
  }
};
