export function findIndentation(input) {
  let pos = 0;
  const stack = [0];
  const topOfStack = () => stack[stack.length - 1];

  const result = {};

  const regex = /( *).*(?:$|\r?\n|\r)/g;
  let match;
  while ((match = regex.exec(input)) != null) {
    const [line, indent] = match;

    // The last match will always have length 0. In every other case, some
    // characters will be matched (possibly only the end of line chars).
    if (line.length === 0) break;

    const indentSize = indent.length;
    const prevSize = topOfStack();

    const indentPos = pos + indentSize;

    if (indentSize > prevSize) {
      // Indent -- always only 1.
      stack.push(indentSize);
      result[indentPos] = 1;
    } else if (indentSize < prevSize) {
      // Dedent -- can be multiple levels.
      const prevLength = stack.length;
      while (topOfStack() !== indentSize) {
        stack.pop();
      }
      result[indentPos] = -1 * (prevLength - stack.length);
    }
    pos += line.length;
  }
  // Ensure that there is a matching DEDENT for every remaining INDENT.
  if (stack.length > 1) {
    result[pos] = 1 - stack.length;
  }
  return result;
}
