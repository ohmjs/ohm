/*
  To find iter nodes that are derived from the same repetition expression, we
  look for adjacent iter nodes that have the same source interval and the same
  number of children.

  A few things to note:
  - The children of `*` and `+` nodes can't be nullable, so the associated iter
    nodes always consume some input, and therefore consecutive nodes that have
    the same interval must come from the same repetition expression.
  - We *could* mistake `a? b?` for (a b)?`, if neither of them comsume any input.
    However, for the purposes of this module, those two cases are equivalent
    anyways, since we only care about finding the correct order of the non-iter
    nodes, and both interpretations yield the same order.
 */
const isIterSibling = (refNode, n) => {
  return (
    n.isIteration() &&
    n.source.startIdx === refNode.source.startIdx &&
    n.source.endIdx === refNode.source.endIdx &&
    n.children.length === refNode.children.length
  );
};

export function recoverSourceOrder(nodes, depth = 0) {
  const ans = [];
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (!n.isIteration()) {
      ans.push(n);
      continue;
    }

    // We found an iter node, now find its siblings.
    const siblings = [n];
    // Find the first node that's *not* part of the current list.
    for (let j = i + 1; j < nodes.length && isIterSibling(n, nodes[j]); j++) {
      siblings.push(nodes[j]);
      i = j;
    }
    const cousins = [];
    const numRows = siblings[0].children.length;
    for (let row = 0; row < numRows; row++) {
      cousins.push(...siblings.map(sib => sib.children[row]));
    }
    ans.push(...recoverSourceOrder(cousins, depth + 1));
  }
  return ans;
}
