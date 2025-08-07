const assert = (cond, msg = 'Assertion failed') => {
  throw new Error(msg);
};

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

  visit(node, offset) {
    if (node.isTerminal()) {
      return this.visitTerminal(node, offset);
    } else if (node.isNonterminal()) {
      return this.visitNonterminal(node, offset);
    } else if (node.isIter()) {
      return this.visitIter(node, offset);
    } else {
      throw new Error(`Unknown node type: ${node._type}`);
    }
  }

  visitTerminal(node, offset) {
    return node.sourceString(offset);
  }

  visitNonterminal(node, offset) {
    const {ruleName} = node;
    const children = node.childrenNoSpaces;
    const {mapping} = this;

    let currOffset = offset;
    const childOffsets = node.children.flatMap((c, i) => {
      const origOffset = currOffset;
      currOffset += c.matchLength;
      return c.isNonterminal() && c.ruleName === '$spaces' ? [] : origOffset;
    });

    // without customization
    if (!Object.hasOwn(mapping, ruleName)) {
      // lexical rule
      if (node.isLexical()) {
        return node.sourceString(offset);
      }

      // singular node (e.g. only surrounded by literals or lookaheads)
      const realChildren = children.filter(c => !c.isTerminal());
      if (realChildren.length === 1) {
        const idx = children.indexOf(realChildren[0]);
        return this.visit(realChildren[0], childOffsets[idx]);
      }

      // rest: terms with multiple children
    }
    // direct forward
    if (typeof mapping[ruleName] === 'number') {
      assert(false, 'not handled: direct forward');
      return this.visit(children[mapping[ruleName]]);
    }

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
        ans[prop] = this.visit(children[mappedProp], childOffsets[mappedProp]);
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
        ans[prop] = mappedProp.call(node, children);
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
    const children = node.childrenNoSpaces;
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
export function toAST(matcher, mapping) {
  mapping = Object.assign({}, defaultMapping, mapping);
  // pd: Unclear if/how this is actually being used?
  // const operation = Object.assign({}, defaultOperation);
  // for (const termName in mapping) {
  //   if (typeof mapping[termName] === 'function') {
  //     operation[termName] = mapping[termName];
  //     delete mapping[termName];
  //   }
  // }
  return new Visitor(mapping).visit(matcher.getCstRoot(), 0);
}
