function assert(cond, message = 'Assertion failed') {
  if (!cond) throw new Error(message);
}

function handleListOf(child) {
  return child.toAST(this.args.mapping);
}

function handleEmptyListOf() {
  return [];
}

function handleNonemptyListOf(first, sep, rest) {
  return [first.toAST(this.args.mapping)].concat(rest.toAST(this.args.mapping));
}

const defaultMapping = {
  listOf: handleListOf,
  ListOf: handleListOf,

  emptyListOf: handleEmptyListOf,
  EmptyListOf: handleEmptyListOf,

  nonemptyListOf: handleNonemptyListOf,
  NonemptyListOf: handleNonemptyListOf,
};

class Visitor {
  constructor(mapping) {
    this.mapping = mapping;
  }

  visit(node) {
    const ctorName = node.isTerminal() ? '_terminal' : node.isIter() ? '_iter' : node.ruleName;
    if (ctorName in this.mapping && typeof this.mapping[ctorName] === 'function') {
      return this.mapping[ctorName].apply(this, node.children);
    }

    if (node.isTerminal()) {
      return this.visitTerminal(node);
    } else if (node.isNonterminal()) {
      return this.visitNonterminal(node);
    } else if (node.isIter()) {
      return this.visitIter(node);
    } else {
      throw new Error(`Unknown node type: ${node._type}`);
    }
  }

  visitTerminal(node, offset) {
    return node.sourceString;
  }

  visitNonterminal(node) {
    const {children, ruleName} = node;
    const {mapping} = this;

    // without customization
    if (!Object.hasOwn(mapping, ruleName)) {
      // lexical rule
      if (node.isLexical()) {
        return node.sourceString;
      }

      // singular node (e.g. only surrounded by literals or lookaheads)
      const realChildren = children.filter(c => !c.isTerminal());
      if (realChildren.length === 1) {
        return this.visit(realChildren[0]);
      }

      // rest: terms with multiple children
    }
    // direct forward
    if (typeof mapping[ruleName] === 'number') {
      return this.visit(children[mapping[ruleName]]);
    }
    assert(typeof mapping[ruleName] !== 'function', "shouldn't be possible");

    // named/mapped children or unnamed children ('0', '1', '2', ...)
    const propMap = mapping[ruleName] || children;
    const ans = {
      type: ruleName,
    };
    // eslint-disable-next-line guard-for-in
    for (const prop in propMap) {
      const mappedProp = mapping[ruleName] && mapping[ruleName][prop];
      if (typeof mappedProp === 'number') {
        // direct forward
        ans[prop] = this.visit(children[mappedProp]);
      } else if (
        typeof mappedProp === 'string' ||
        typeof mappedProp === 'boolean' ||
        mappedProp === null
      ) {
        // primitive value
        ans[prop] = mappedProp;
      } else if (typeof mappedProp === 'object' && mappedProp instanceof Number) {
        // primitive number (must be unboxed)
        ans[prop] = Number(mappedProp);
      } else if (typeof mappedProp === 'function') {
        // computed value
        ans[prop] = mappedProp.call(this, children);
      } else if (mappedProp === undefined) {
        if (children[prop] && !children[prop].isTerminal()) {
          ans[prop] = this.visit(children[prop]);
        } else {
          // delete predefined 'type' properties, like 'type', if explicitely removed
          delete ans[prop];
        }
      }
    }
    return ans;
  }

  visitIter(node) {
    const {children} = node;
    if (node.isOptional()) {
      if (children.length === 0) {
        return null;
      } else {
        return this.visit(children[0]);
      }
    }

    return children.map(c => this.visit(c));
  }
}

// Returns a plain JavaScript object that includes an abstract syntax tree (AST)
// for the given match result `res` containg a concrete syntax tree (CST) and grammar.
// The optional `mapping` parameter can be used to customize how the nodes of the CST
// are mapped to the AST (see /doc/extras.md#toastmatchresult-mapping).
export function toAST(result, mapping) {
  const visitor = new Visitor({...defaultMapping, ...mapping});
  // Note: in the original implementation of toAST, any functions in `mapping`
  // are removed after copying over to the final mapping. Looking at the code,
  // it doesn't seem strictly necessary, but it's not 100% clear.
  return visitor.visit(result._cst, 0);
}
