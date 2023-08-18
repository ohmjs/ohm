import ohmGrammar from '../dist/ohm-grammar.js';
import {Builder} from './Builder.js';
import * as common from './common.js';
import * as errors from './errors.js';
import {Grammar} from './Grammar.js';
import * as pexprs from './pexprs.js';
import { validateOption } from './util.js';

const superSplicePlaceholder = Object.create(pexprs.PExpr.prototype);

function namespaceHas(ns, name) {
  // Look for an enumerable property, anywhere in the prototype chain.
  for (const prop in ns) {
    if (prop === name) return true;
  }
  return false;
}

// Returns a Grammar instance (i.e., an object with a `match` method) for
// `tree`, which is the concrete syntax tree of a user-written grammar.
// The grammar will be assigned into `namespace` under the name of the grammar
// as specified in the source.
export function buildGrammar(match, namespace, options, optOhmGrammarForTesting) {
  const builder = new Builder();
  let decl;
  let currentRuleName;
  let currentRuleFormals;
  let overriding = false;
  const metaGrammar = optOhmGrammarForTesting || ohmGrammar;
  
  const fetchGrammarInternal = (path) => {
    if (!validateOption(options, 'fetchGrammar', 'function'))
    {
      throw new Error("Missing option 'fetchGrammar' of type `function` when trying to include.");
    }

    const grammarContent = options.fetchGrammar(path);

    if (typeof grammarContent !== "string")
    {
      throw new Error(`Expected string from 'fetchGrammar' function, but got ${typeof(grammarContent)}`);
    }

    return grammarContent.trim();
  }

  const rematchInput = (includes) => {
    let modifiedGrammarSource = match.input;

    for (let i = 0; i < includes.length; i++) {
      const [sourceString, fileContent] = includes[i];
      
      // Always substitute the include even with a nothing to prevent infinite loop.
      modifiedGrammarSource = modifiedGrammarSource.replace(sourceString, fileContent);
    }

    const newMatch = ohmGrammar.match(modifiedGrammarSource);

    if (newMatch.failed()) {
      throw errors.grammarSyntaxError(newMatch);
    }

    helpers(newMatch).visit()
  }

  // A visitor that produces a Grammar instance from the CST.
  const helpers = metaGrammar.createSemantics().addOperation('visit', {
    Document(includesNode, grammarsNode)
    {
      const resolvedIncludes = includesNode.visit();

      // We need to rebuild the grammar match with the resolved includes substituted.
      // Note: It's important we prevent any deeper visits in this tree as it's now pointless.
      if (resolvedIncludes.length > 0) {
        rematchInput(resolvedIncludes);
        return;
      }
      
      return grammarsNode.visit();
    },
    Includes(includesIter) {
      const resolvedIncludes = [];

      includesIter.children.flatMap(c => {
        resolvedIncludes.push(c.visit());
      })

      return resolvedIncludes;
    },
    Include(_, _la, relativePathNode, _ra) {
      return [
        this.sourceString, 
        fetchGrammarInternal(relativePathNode.sourceString)
      ];
    },
    Grammars(grammarIter) {
      return grammarIter.children.map(c => c.visit());
    },
    Grammar(id, s, _open, rules, _close) {
      const grammarName = id.visit();
      decl = builder.newGrammar(grammarName);
      s.child(0) && s.child(0).visit();
      rules.children.map(c => c.visit());
      const g = decl.build();
      g.source = this.source.trimmed();
      if (namespaceHas(namespace, grammarName)) {
        throw errors.duplicateGrammarDeclaration(g, namespace);
      }
      namespace[grammarName] = g;
      return g;
    },
    SuperGrammar(_, n) {
      const superGrammarName = n.visit();
      if (superGrammarName === 'null') {
        decl.withSuperGrammar(null);
      } else {
        if (!namespace || !namespaceHas(namespace, superGrammarName)) {
          throw errors.undeclaredGrammar(superGrammarName, namespace, n.source);
        }
        decl.withSuperGrammar(namespace[superGrammarName]);
      }
    },

    Rule_define(n, fs, d, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.children.map(c => c.visit())[0] || [];
      // If there is no default start rule yet, set it now. This must be done before visiting
      // the body, because it might contain an inline rule definition.
      if (!decl.defaultStartRule && decl.ensureSuperGrammar() !== Grammar.ProtoBuiltInRules) {
        decl.withDefaultStartRule(currentRuleName);
      }
      const body = b.visit();
      const description = d.children.map(c => c.visit())[0];
      const source = this.source.trimmed();
      return decl.define(currentRuleName, currentRuleFormals, body, description, source);
    },
    Rule_override(n, fs, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.children.map(c => c.visit())[0] || [];

      const source = this.source.trimmed();
      decl.ensureSuperGrammarRuleForOverriding(currentRuleName, source);

      overriding = true;
      const body = b.visit();
      overriding = false;
      return decl.override(currentRuleName, currentRuleFormals, body, null, source);
    },
    Rule_extend(n, fs, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.children.map(c => c.visit())[0] || [];
      const body = b.visit();
      const source = this.source.trimmed();
      return decl.extend(currentRuleName, currentRuleFormals, body, null, source);
    },
    RuleBody(_, terms) {
      return builder.alt(...terms.visit()).withSource(this.source);
    },
    OverrideRuleBody(_, terms) {
      const args = terms.visit();

      // Check if the super-splice operator (`...`) appears in the terms.
      const expansionPos = args.indexOf(superSplicePlaceholder);
      if (expansionPos >= 0) {
        const beforeTerms = args.slice(0, expansionPos);
        const afterTerms = args.slice(expansionPos + 1);

        // Ensure it appears no more than once.
        afterTerms.forEach(t => {
          if (t === superSplicePlaceholder) throw errors.multipleSuperSplices(t);
        });

        return new pexprs.Splice(
            decl.superGrammar,
            currentRuleName,
            beforeTerms,
            afterTerms,
        ).withSource(this.source);
      } else {
        return builder.alt(...args).withSource(this.source);
      }
    },
    Formals(opointy, fs, cpointy) {
      return fs.visit();
    },

    Params(opointy, ps, cpointy) {
      return ps.visit();
    },

    Alt(seqs) {
      return builder.alt(...seqs.visit()).withSource(this.source);
    },

    TopLevelTerm_inline(b, n) {
      const inlineRuleName = currentRuleName + '_' + n.visit();
      const body = b.visit();
      const source = this.source.trimmed();
      const isNewRuleDeclaration = !(
        decl.superGrammar && decl.superGrammar.rules[inlineRuleName]
      );
      if (overriding && !isNewRuleDeclaration) {
        decl.override(inlineRuleName, currentRuleFormals, body, null, source);
      } else {
        decl.define(inlineRuleName, currentRuleFormals, body, null, source);
      }
      const params = currentRuleFormals.map(formal => builder.app(formal));
      return builder.app(inlineRuleName, params).withSource(body.source);
    },
    OverrideTopLevelTerm_superSplice(_) {
      return superSplicePlaceholder;
    },

    Seq(expr) {
      return builder.seq(...expr.children.map(c => c.visit())).withSource(this.source);
    },

    Iter_star(x, _) {
      return builder.star(x.visit()).withSource(this.source);
    },
    Iter_plus(x, _) {
      return builder.plus(x.visit()).withSource(this.source);
    },
    Iter_opt(x, _) {
      return builder.opt(x.visit()).withSource(this.source);
    },

    Pred_not(_, x) {
      return builder.not(x.visit()).withSource(this.source);
    },
    Pred_lookahead(_, x) {
      return builder.lookahead(x.visit()).withSource(this.source);
    },

    Lex_lex(_, x) {
      return builder.lex(x.visit()).withSource(this.source);
    },

    Base_application(rule, ps) {
      const params = ps.children.map(c => c.visit())[0] || [];
      return builder.app(rule.visit(), params).withSource(this.source);
    },
    Base_range(from, _, to) {
      return builder.range(from.visit(), to.visit()).withSource(this.source);
    },
    Base_terminal(expr) {
      return builder.terminal(expr.visit()).withSource(this.source);
    },
    Base_paren(open, x, close) {
      return x.visit();
    },

    ruleDescr(open, t, close) {
      return t.visit();
    },
    ruleDescrText(_) {
      return this.sourceString.trim();
    },

    caseName(_, space1, n, space2, end) {
      return n.visit();
    },

    name(first, rest) {
      return this.sourceString;
    },
    nameFirst(expr) {},
    nameRest(expr) {},

    terminal(open, cs, close) {
      return cs.children.map(c => c.visit()).join('');
    },

    oneCharTerminal(open, c, close) {
      return c.visit();
    },

    escapeChar(c) {
      try {
        return common.unescapeCodePoint(this.sourceString);
      } catch (err) {
        if (err instanceof RangeError && err.message.startsWith('Invalid code point ')) {
          throw errors.invalidCodePoint(c);
        }
        throw err; // Rethrow
      }
    },

    NonemptyListOf(x, _, xs) {
      return [x.visit()].concat(xs.children.map(c => c.visit()));
    },
    EmptyListOf() {
      return [];
    },

    _terminal() {
      return this.sourceString;
    },
  });

  return helpers(match).visit();
}
