const isIterSibling = (refNode, n) => {
  return (
    n.isIteration() &&
    n.source.startIdx === refNode.source.startIdx &&
    n.source.endIdx === refNode.source.endIdx &&
    n.children.length === refNode.children.length
  );
};

export function groupIterSiblings(nodes) {
  const groups = [];
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (!n.isIteration()) {
      groups.push({kind: 'node', node: n});
      continue;
    }
    const siblings = [n];
    for (let j = i + 1; j < nodes.length && isIterSibling(n, nodes[j]); j++) {
      siblings.push(nodes[j]);
      i = j;
    }
    groups.push({kind: 'iter', siblings});
  }
  return groups;
}
