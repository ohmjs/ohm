# miniohm-js

## Differences

### Arity

- Iter and Opt nodes are no longer flattened.
- Positive lookahead does not bind a node.

## Building ASTs

- `AstBuilder` class replaces `toAST`.
- Recursive calls: `this.toAst(node)` rather than `node.toAST(this.args.mapping)`
- `this.currNode` vs `this`.
