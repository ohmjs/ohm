import {groupIterSiblings} from '../src/groupIterSiblings.js';

export function recoverSourceOrder(nodes, depth = 0) {
  const ans = [];
  for (const group of groupIterSiblings(nodes)) {
    if (group.kind === 'node') {
      ans.push(group.node);
      continue;
    }
    const {siblings} = group;
    const cousins = [];
    const numRows = siblings[0].children.length;
    for (let row = 0; row < numRows; row++) {
      cousins.push(...siblings.map(sib => sib.children[row]));
    }
    ans.push(...recoverSourceOrder(cousins, depth + 1));
  }
  return ans;
}
