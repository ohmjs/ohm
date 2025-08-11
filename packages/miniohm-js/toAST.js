function assert(cond, message = 'Assertion failed') {
  if (!cond) throw new Error(message);
}

export function toAstWithMapping(mapping) {
  const handleListOf = child => visit(child);
  const handleEmptyListOf = () => [];
  const handleNonemptyListOf = (first, sep, rest) => {
    return [visit(first), ...visit(rest)];
  };

  mapping = {
    listOf: handleListOf,
    ListOf: handleListOf,
    emptyListOf: handleEmptyListOf,
    EmptyListOf: handleEmptyListOf,
    nonemptyListOf: handleNonemptyListOf,
    NonemptyListOf: handleNonemptyListOf,
    ...mapping,
  };

  function visitTerminal(node, offset) {
    return node.sourceString;
  }

  function visitNonterminal(node) {
    const {children, ruleName} = node;

    // without customization
    if (!Object.hasOwn(mapping, ruleName)) {
      // lexical rule
      if (node.isLexical()) {
        return node.sourceString;
      }

      // singular node (e.g. only surrounded by literals or lookaheads)
      const realChildren = children.filter(c => !c.isTerminal());
      if (realChildren.length === 1) {
        return visit(realChildren[0]);
      }

      // rest: terms with multiple children
    }
    // direct forward
    if (typeof mapping[ruleName] === 'number') {
      return visit(children[mapping[ruleName]]);
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
        ans[prop] = visit(children[mappedProp]);
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
          ans[prop] = visit(children[prop]);
        } else {
          // delete predefined 'type' properties, like 'type', if explicitely removed
          delete ans[prop];
        }
      }
    }
    return ans;
  }

  function visitIter(node) {
    const {children} = node;
    if (node.isOptional()) {
      if (children.length === 0) {
        return null;
      } else {
        return visit(children[0]);
      }
    }

    return children.map(c => visit(c));
  }

  function visit(nodeOrResult) {
    let node = nodeOrResult;
    if (typeof nodeOrResult.succeeded === 'function') {
      assert(nodeOrResult.succeeded(), 'Cannot convert failed match result to AST');
      node = nodeOrResult._cst;
    }
    const {ctorName} = node;
    if (ctorName in mapping && typeof mapping[ctorName] === 'function') {
      return mapping[ctorName].apply(this, node.children);
    }
    if (node.isTerminal()) {
      return visitTerminal(node);
    } else if (node.isIter()) {
      return visitIter(node);
    } else {
      assert(node.isNonterminal(), `Unknown node type: ${node._type}`);
      return node.ctorName in mapping && typeof mapping[node.ctorName] === 'function' ?
        mapping[node.ctorName].apply(this, node.children) :
        visitNonterminal(node);
    }
  }

  return visit;
}

export const toAst = toAstWithMapping({});
