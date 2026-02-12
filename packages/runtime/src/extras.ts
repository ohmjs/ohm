// Self-contained copies of getLineAndColumn / getLineAndColumnMessage,
// originally from packages/ohm-js/src/util.js. Inlined here so the runtime
// package has zero dependency on the legacy engine.

function repeatStr(str: string, n: number): string {
  return new Array(n + 1).join(str);
}

function padLeft(str: string, len: number, ch = ' '): string {
  if (str.length < len) {
    return repeatStr(ch, len - str.length) + str;
  }
  return str;
}

function padNumbersToEqualLength(arr: number[]): string[] {
  let maxLen = 0;
  const strings = arr.map(n => {
    const str = n.toString();
    maxLen = Math.max(maxLen, str.length);
    return str;
  });
  return strings.map(s => padLeft(s, maxLen));
}

function strcpy(dest: string, src: string, offset: number): string {
  const origDestLen = dest.length;
  const start = dest.slice(0, offset);
  const end = dest.slice(offset + src.length);
  return (start + src + end).substr(0, origDestLen);
}

interface LineAndColumnInfo {
  offset: number;
  lineNum: number;
  colNum: number;
  line: string;
  prevLine: string | null;
  nextLine: string | null;
  toString(...ranges: [number, number][]): string;
}

function lineAndColumnToMessage(
  this: LineAndColumnInfo,
  ...ranges: [number, number][]
): string {
  const lineAndCol = this;
  const {offset} = lineAndCol;

  let result = '';
  result += 'Line ' + lineAndCol.lineNum + ', col ' + lineAndCol.colNum + ':\n';

  const lineNumbers = padNumbersToEqualLength([
    lineAndCol.prevLine == null ? 0 : lineAndCol.lineNum - 1,
    lineAndCol.lineNum,
    lineAndCol.nextLine == null ? 0 : lineAndCol.lineNum + 1,
  ]);

  const appendLine = (num: number, content: string, prefix: string) => {
    result += prefix + lineNumbers[num] + ' | ' + content + '\n';
  };

  if (lineAndCol.prevLine != null) {
    appendLine(0, lineAndCol.prevLine, '  ');
  }
  appendLine(1, lineAndCol.line, '> ');

  const lineLen = lineAndCol.line.length;
  let indicationLine = repeatStr(' ', lineLen + 1);
  for (let i = 0; i < ranges.length; ++i) {
    let startIdx = ranges[i][0];
    let endIdx = ranges[i][1];
    if (!(startIdx >= 0 && startIdx <= endIdx)) {
      throw new Error('range start must be >= 0 and <= end');
    }

    const lineStartOffset = offset - lineAndCol.colNum + 1;
    startIdx = Math.max(0, startIdx - lineStartOffset);
    endIdx = Math.min(endIdx - lineStartOffset, lineLen);

    indicationLine = strcpy(indicationLine, repeatStr('~', endIdx - startIdx), startIdx);
  }
  const gutterWidth = 2 + lineNumbers[1].length + 3;
  result += repeatStr(' ', gutterWidth);
  indicationLine = strcpy(indicationLine, '^', lineAndCol.colNum - 1);
  result += indicationLine.replace(/ +$/, '') + '\n';

  if (lineAndCol.nextLine != null) {
    appendLine(2, lineAndCol.nextLine, '  ');
  }
  return result;
}

export function getLineAndColumn(str: string, offset: number): LineAndColumnInfo {
  let lineNum = 1;
  let colNum = 1;

  let currOffset = 0;
  let lineStartOffset = 0;

  let nextLine: string | null = null;
  let prevLine: string | null = null;
  let prevLineStartOffset = -1;

  while (currOffset < offset) {
    const c = str.charAt(currOffset++);
    if (c === '\n') {
      lineNum++;
      colNum = 1;
      prevLineStartOffset = lineStartOffset;
      lineStartOffset = currOffset;
    } else if (c !== '\r') {
      colNum++;
    }
  }

  // Find the end of the target line.
  let lineEndOffset = str.indexOf('\n', lineStartOffset);
  if (lineEndOffset === -1) {
    lineEndOffset = str.length;
  } else {
    // Get the next line.
    const nextLineEndOffset = str.indexOf('\n', lineEndOffset + 1);
    nextLine =
      nextLineEndOffset === -1
        ? str.slice(lineEndOffset)
        : str.slice(lineEndOffset, nextLineEndOffset);
    // Strip leading and trailing EOL char(s).
    nextLine = nextLine.replace(/^\r?\n/, '').replace(/\r$/, '');
  }

  // Get the previous line.
  if (prevLineStartOffset >= 0) {
    // Strip trailing EOL char(s).
    prevLine = str.slice(prevLineStartOffset, lineStartOffset).replace(/\r?\n$/, '');
  }

  // Get the target line, stripping a trailing carriage return if necessary.
  const line = str.slice(lineStartOffset, lineEndOffset).replace(/\r$/, '');

  return {
    offset,
    lineNum,
    colNum,
    line,
    prevLine,
    nextLine,
    toString: lineAndColumnToMessage,
  };
}

export function getLineAndColumnMessage(
  str: string,
  offset: number,
  ...ranges: [number, number][]
): string {
  return getLineAndColumn(str, offset).toString(...ranges);
}
