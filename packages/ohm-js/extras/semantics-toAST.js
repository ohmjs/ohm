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

const defaultOperation = {
  _terminal() {
    return this.sourceString;
  },

  _nonterminal(...children) {
    const {ctorName} = this._node;
    const {mapping} = this.args;

    // without customization
    if (!Object.prototype.hasOwnProperty.call(mapping, ctorName)) {
      // lexical rule
      if (this.isLexical()) {
        return this.sourceString;
      }

      // singular node (e.g. only surrounded by literals or lookaheads)
      const realChildren = children.filter(child => !child.isTerminal());
      if (realChildren.length === 1) {
        return realChildren[0].toAST(mapping);
      }

      // rest: terms with multiple children
    }
    // direct forward
    if (typeof mapping[ctorName] === 'number') {
      return children[mapping[ctorName]].toAST(mapping);
    }

    // named/mapped children or unnamed children ('0', '1', '2', ...)
    const propMap = mapping[ctorName] || children;
    const node = {
      type: ctorName,
    };

    for (const prop in propMap) {
      const mappedProp = mapping[ctorName] && mapping[ctorName][prop];
      if (typeof mappedProp === 'number') {
        // direct forward
        node[prop] = children[mappedProp].toAST(mapping);
      } else if (
        typeof mappedProp === 'string' ||
        typeof mappedProp === 'boolean' ||
        mappedProp === null
      ) {
        // primitive value
        node[prop] = mappedProp;
      } else if (typeof mappedProp === 'object' && mappedProp instanceof Number) {
        // primitive number (must be unboxed)
        node[prop] = Number(mappedProp);
      } else if (typeof mappedProp === 'function') {
        // computed value
        node[prop] = mappedProp.call(this, children);
      } else if (mappedProp === undefined) {
        if (children[prop] && !children[prop].isTerminal()) {
          node[prop] = children[prop].toAST(mapping);
        } else {
          // delete predefined 'type' properties, like 'type', if explicitely removed
          delete node[prop];
        }
      }
    }
    return node;
  },

  _iter(...children) {
    if (this._node.isOptional()) {
      if (this.numChildren === 0) {
        return null;
      } else {
        return children[0].toAST(this.args.mapping);
      }
    }

    return children.map(c => c.toAST(this.args.mapping));
  },
};

// Returns a plain JavaScript object that includes an abstract syntax tree (AST)
// for the given match result `res` containg a concrete syntax tree (CST) and grammar.
// The optional `mapping` parameter can be used to customize how the nodes of the CST
// are mapped to the AST (see /doc/extras.md#toastmatchresult-mapping).
export function toAST(res, mapping) {
  if (typeof res.failed !== 'function' || res.failed()) {
    throw new Error('toAST() expects a succesful MatchResult as first parameter');
  }

  mapping = Object.assign({}, defaultMapping, mapping);
  const operation = Object.assign({}, defaultOperation);
  for (const termName in mapping) {
    if (typeof mapping[termName] === 'function') {
      operation[termName] = mapping[termName];
      delete mapping[termName];
    }
  }
  const g = res._cst.grammar;
  const s = g.createSemantics().addOperation('toAST(mapping)', operation);
  return s(res).toAST(mapping);
}

// Returns a semantics containg the toAST(mapping) operation for the given grammar g.
export function semanticsForToAST(g) {
  if (typeof g.createSemantics !== 'function') {
    throw new Error('semanticsToAST() expects a Grammar as parameter');
  }

  return g.createSemantics().addOperation('toAST(mapping)', defaultOperation);
}
