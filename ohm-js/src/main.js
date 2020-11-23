/* global document, XMLHttpRequest */

'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const Builder = require('./Builder');
const Grammar = require('./Grammar');
const Namespace = require('./Namespace');
const common = require('./common');
const errors = require('./errors');
const pexprs = require('./pexprs');
const util = require('./util');
const version = require('./version');

const isBuffer = require('is-buffer');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// The metagrammar, i.e. the grammar for Ohm grammars. Initialized at the
// bottom of this file because loading the grammar requires Ohm itself.
let ohmGrammar;

// An object which makes it possible to stub out the document API for testing.
let documentInterface = {
  querySelector(sel) { return document.querySelector(sel); },
  querySelectorAll(sel) { return document.querySelectorAll(sel); }
};

const superSplicePlaceholder = Object.create(pexprs.PExpr.prototype);

// Check if `obj` is a DOM element.
function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}

function isUndefined(obj) {
  return obj === void 0; // eslint-disable-line no-void
}

const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

function isArrayLike(obj) {
  if (obj == null) {
    return false;
  }
  const length = obj.length;
  return typeof length === 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}

// TODO: just use the jQuery thing
function load(url) {
  const req = new XMLHttpRequest();
  req.open('GET', url, false);
  try {
    req.send();
    if (req.status === 0 || req.status === 200) {
      return req.responseText;
    }
  } catch (e) {}
  throw new Error('unable to load url ' + url);
}

// Returns a Grammar instance (i.e., an object with a `match` method) for
// `tree`, which is the concrete syntax tree of a user-written grammar.
// The grammar will be assigned into `namespace` under the name of the grammar
// as specified in the source.
function buildGrammar(match, namespace, optOhmGrammarForTesting) {
  const builder = new Builder();
  let decl;
  let currentRuleName;
  let currentRuleFormals;
  let overriding = false;
  const metaGrammar = optOhmGrammarForTesting || ohmGrammar;

  // A visitor that produces a Grammar instance from the CST.
  const helpers = metaGrammar.createSemantics().addOperation('visit', {
    Grammar(n, s, open, rs, close) {
      const grammarName = n.visit();
      decl = builder.newGrammar(grammarName, namespace);
      s.visit();
      rs.visit();
      const g = decl.build();
      g.source = this.source.trimmed();
      if (grammarName in namespace) {
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
        if (!namespace || !(superGrammarName in namespace)) {
          throw errors.undeclaredGrammar(superGrammarName, namespace, n.source);
        }
        decl.withSuperGrammar(namespace[superGrammarName]);
      }
    },

    Rule_define(n, fs, d, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];
      // If there is no default start rule yet, set it now. This must be done before visiting
      // the body, because it might contain an inline rule definition.
      if (!decl.defaultStartRule && decl.ensureSuperGrammar() !== Grammar.ProtoBuiltInRules) {
        decl.withDefaultStartRule(currentRuleName);
      }
      const body = b.visit();
      const description = d.visit()[0];
      const source = this.source.trimmed();
      return decl.define(currentRuleName, currentRuleFormals, body, description, source);
    },
    Rule_override(n, fs, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];

      const source = this.source.trimmed();
      decl.ensureSuperGrammarRuleForOverriding(currentRuleName, source);

      overriding = true;
      const body = b.visit();
      overriding = false;
      return decl.override(currentRuleName, currentRuleFormals, body, null, source);
    },
    Rule_extend(n, fs, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];
      const body = b.visit();
      const source = this.source.trimmed();
      return decl.extend(currentRuleName, currentRuleFormals, body, null, source);
    },
    RuleBody(_, terms) {
      const args = terms.visit();
      return builder.alt.apply(builder, args).withSource(this.source);
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
            decl.superGrammar, currentRuleName, beforeTerms, afterTerms).withSource(this.source);
      } else {
        return builder.alt.apply(builder, args).withSource(this.source);
      }
    },
    Formals(opointy, fs, cpointy) {
      return fs.visit();
    },

    Params(opointy, ps, cpointy) {
      return ps.visit();
    },

    Alt(seqs) {
      const args = seqs.visit();
      return builder.alt.apply(builder, args).withSource(this.source);
    },

    TopLevelTerm_inline(b, n) {
      const inlineRuleName = currentRuleName + '_' + n.visit();
      const body = b.visit();
      const source = this.source.trimmed();
      const isNewRuleDeclaration =
          !(decl.superGrammar && decl.superGrammar.rules[inlineRuleName]);
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
      return builder.seq.apply(builder, expr.visit()).withSource(this.source);
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
      return builder.app(rule.visit(), ps.visit()[0] || []).withSource(this.source);
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
      return cs.visit().join('');
    },

    oneCharTerminal(open, c, close) {
      return c.visit();
    },

    terminalChar(_) {
      return common.unescapeChar(this.sourceString);
    },

    escapeChar(_) {
      return this.sourceString;
    },

    NonemptyListOf(x, _, xs) {
      return [x.visit()].concat(xs.visit());
    },
    EmptyListOf() {
      return [];
    },

    _terminal() {
      return this.primitiveValue;
    }
  });
  return helpers(match).visit();
}

function compileAndLoad(source, namespace) {
  const m = ohmGrammar.match(source, 'Grammars');
  if (m.failed()) {
    throw errors.grammarSyntaxError(m);
  }
  return buildGrammar(m, namespace);
}

// Return the contents of a script element, fetching it via XHR if necessary.
function getScriptElementContents(el) {
  if (!isElement(el)) {
    throw new TypeError('Expected a DOM Node, got ' + common.unexpectedObjToString(el));
  }
  if (el.type !== 'text/ohm-js') {
    throw new Error('Expected a script tag with type="text/ohm-js", got ' + el);
  }
  return el.getAttribute('src') ? load(el.getAttribute('src')) : el.innerHTML;
}

function grammar(source, optNamespace) {
  const ns = grammars(source, optNamespace);

  // Ensure that the source contained no more than one grammar definition.
  const grammarNames = Object.keys(ns);
  if (grammarNames.length === 0) {
    throw new Error('Missing grammar definition');
  } else if (grammarNames.length > 1) {
    const secondGrammar = ns[grammarNames[1]];
    const interval = secondGrammar.source;
    throw new Error(
        util.getLineAndColumnMessage(interval.sourceString, interval.startIdx) +
        'Found more than one grammar definition -- use ohm.grammars() instead.');
  }
  return ns[grammarNames[0]]; // Return the one and only grammar.
}

function grammars(source, optNamespace) {
  const ns = Namespace.extend(Namespace.asNamespace(optNamespace));
  if (typeof source !== 'string') {
    // For convenience, detect Node.js Buffer objects and automatically call toString().
    if (isBuffer(source)) {
      source = source.toString();
    } else {
      throw new TypeError(
          'Expected string as first argument, got ' + common.unexpectedObjToString(source));
    }
  }
  compileAndLoad(source, ns);
  return ns;
}

function grammarFromScriptElement(optNode) {
  let node = optNode;
  if (isUndefined(node)) {
    const nodeList = documentInterface.querySelectorAll('script[type="text/ohm-js"]');
    if (nodeList.length !== 1) {
      throw new Error(
          'Expected exactly one script tag with type="text/ohm-js", found ' + nodeList.length);
    }
    node = nodeList[0];
  }
  return grammar(getScriptElementContents(node));
}

function grammarsFromScriptElements(optNodeOrNodeList) {
  // Simple case: the argument is a DOM node.
  if (isElement(optNodeOrNodeList)) {
    return grammars(optNodeOrNodeList);
  }
  // Otherwise, it must be either undefined or a NodeList.
  let nodeList = optNodeOrNodeList;
  if (isUndefined(nodeList)) {
    // Find all script elements with type="text/ohm-js".
    nodeList = documentInterface.querySelectorAll('script[type="text/ohm-js"]');
  } else if (typeof nodeList === 'string' || (!isElement(nodeList) && !isArrayLike(nodeList))) {
    throw new TypeError('Expected a Node, NodeList, or Array, but got ' + nodeList);
  }
  const ns = Namespace.createNamespace();
  for (let i = 0; i < nodeList.length; ++i) {
    // Copy the new grammars into `ns` to keep the namespace flat.
    common.extend(ns, grammars(getScriptElementContents(nodeList[i]), ns));
  }
  return ns;
}

function makeRecipe(recipe) {
  if (typeof recipe === 'function') {
    return recipe.call(new Builder());
  } else {
    if (typeof recipe === 'string') {
      // stringified JSON recipe
      recipe = JSON.parse(recipe);
    }
    return (new Builder()).fromRecipe(recipe);
  }
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

// Stuff that users should know about
module.exports = {
  createNamespace: Namespace.createNamespace,
  grammar,
  grammars,
  grammarFromScriptElement,
  grammarsFromScriptElements,
  makeRecipe,
  ohmGrammar: null, // Initialized below, after Grammar.BuiltInRules.
  pexprs,
  util,
  extras: require('../extras'),
  version
};

// Stuff for testing, etc.
module.exports._buildGrammar = buildGrammar;
module.exports._setDocumentInterfaceForTesting = function(doc) { documentInterface = doc; };

// Late initialization for stuff that is bootstrapped.

Grammar.BuiltInRules = require('../dist/built-in-rules');
util.announceBuiltInRules(Grammar.BuiltInRules);

module.exports.ohmGrammar = ohmGrammar = require('../dist/ohm-grammar');
Grammar.initApplicationParser(ohmGrammar, buildGrammar);
