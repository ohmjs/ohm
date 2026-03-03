// Python tokenizer that scans source and produces tokens for memo table pre-fill.
//
// The tokenizer handles:
// - INDENT/DEDENT via sentinel characters (\uFDD0 / \uFDD1)
// - Replacing insignificant newlines (inside brackets) with spaces
// - NAME, NUMBER, STRING, NEWLINE tokens

const INDENT_SENTINEL = '\uFDD0';
const DEDENT_SENTINEL = '\uFDD1';

// --- Token patterns ---
// NAME: identifiers and keywords
const NAME_RE = /[a-zA-Z_]\w*/y;

// NUMBER: integer and float literals
// Order matters: hex/oct/bin before decimal, float before int.
const hex = String.raw`0[xX][\da-fA-F](?:_?[\da-fA-F])*[jJ]?`;
const oct = String.raw`0[oO][0-7](?:_?[0-7])*[jJ]?`;
const bin = String.raw`0[bB][01](?:_?[01])*[jJ]?`;
const flt =
  String.raw`(?:\d(?:_?\d)*\.(?:\d(?:_?\d)*)?` +
  String.raw`|\.\d(?:_?\d)*)(?:[eE][+-]?\d(?:_?\d)*)?[jJ]?`;
const exp = String.raw`\d(?:_?\d)*[eE][+-]?\d(?:_?\d)*[jJ]?`;
const int = String.raw`\d(?:_?\d)*[jJ]?`;
const NUMBER_RE = new RegExp([hex, oct, bin, flt, exp, int].join('|'), 'y');

// Bracket characters that suppress newlines
const OPEN_BRACKETS = new Set(['(', '[', '{']);
const CLOSE_BRACKETS = new Set([')', ']', '}']);

/**
 * Tokenize Python source code.
 *
 * Returns:
 *   tokens: Array of {type, start, end} in the modified input
 *   input:  Modified input string (with sentinels, insignificant newlines replaced)
 *
 * Token types: 'name', 'number', 'string', 'newline', 'indent', 'dedent'
 */
export function tokenize(rawInput) {
  const tokens = [];
  let input = rawInput;

  // --- Phase 1: Handle line continuations ---
  // Replace backslash-newline with two spaces (preserving positions).
  input = input.replace(/\\\n/g, '  ');

  // --- Phase 2: Replace insignificant newlines ---
  // Newlines inside brackets are insignificant.
  let bracketDepth = 0;
  const chars = [...input];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (OPEN_BRACKETS.has(ch)) {
      bracketDepth++;
    } else if (CLOSE_BRACKETS.has(ch)) {
      bracketDepth = Math.max(0, bracketDepth - 1);
    } else if (ch === '\n' && bracketDepth > 0) {
      chars[i] = ' ';
    } else if (ch === '#') {
      // Skip to end of line (comments don't affect brackets).
      // But we need to handle newlines in comments inside brackets.
      while (i + 1 < chars.length && chars[i + 1] !== '\n') {
        i++;
      }
    } else if (ch === "'" || ch === '"') {
      // Skip string contents — brackets inside strings don't count.
      i = skipStringBody(chars, i);
    } else if ('rRuUbBfFtT'.includes(ch)) {
      // Check for prefixed strings like r"...", b'...', etc.
      const next = chars[i + 1];
      if (next === "'" || next === '"') {
        i = skipStringBody(chars, i + 1);
      } else if (next && 'rRuUbBfFtT'.includes(next)) {
        const afterNext = chars[i + 2];
        if (afterNext === "'" || afterNext === '"') {
          i = skipStringBody(chars, i + 2);
        }
      }
    }
  }
  input = chars.join('');

  // --- Phase 3: Insert INDENT/DEDENT sentinels ---
  input = insertIndentSentinels(input);

  // --- Phase 4: Scan tokens ---
  // Track whether the current line has meaningful content (for blank line detection).
  // Python's tokenizer only emits NEWLINE for logical lines, not blank lines.
  let lineHasContent = false;
  let pos = 0;
  while (pos < input.length) {
    const ch = input[pos];

    // Skip horizontal whitespace.
    if (ch === ' ' || ch === '\t') {
      pos++;
      continue;
    }

    // Skip comments (comment-only lines are treated like blank lines).
    if (ch === '#') {
      while (pos < input.length && input[pos] !== '\n') {
        pos++;
      }
      continue;
    }

    // INDENT sentinel
    if (ch === INDENT_SENTINEL) {
      tokens.push({type: 'indent', start: pos, end: pos + 1});
      pos++;
      continue;
    }

    // DEDENT sentinel
    if (ch === DEDENT_SENTINEL) {
      tokens.push({type: 'dedent', start: pos, end: pos + 1});
      pos++;
      continue;
    }

    // NEWLINE — only emit for logical lines (lines with content), not blank lines.
    if (ch === '\n') {
      if (lineHasContent) {
        tokens.push({type: 'newline', start: pos, end: pos + 1});
      }
      lineHasContent = false;
      pos++;
      continue;
    }

    // From here on, any token or character counts as line content.
    lineHasContent = true;

    // STRING (check before NAME because of string prefixes like r"..." or b"...")
    if (ch === "'" || ch === '"' || isStringPrefixStart(input, pos)) {
      const end = scanString(input, pos);
      if (end > pos) {
        tokens.push({type: 'string', start: pos, end});
        pos = end;
        continue;
      }
    }

    // NUMBER
    NUMBER_RE.lastIndex = pos;
    const numMatch = NUMBER_RE.exec(input);
    if (numMatch && numMatch.index === pos) {
      tokens.push({type: 'number', start: pos, end: pos + numMatch[0].length});
      pos += numMatch[0].length;
      continue;
    }

    // NAME (identifiers and keywords)
    NAME_RE.lastIndex = pos;
    const nameMatch = NAME_RE.exec(input);
    if (nameMatch && nameMatch.index === pos) {
      tokens.push({type: 'name', start: pos, end: pos + nameMatch[0].length});
      pos += nameMatch[0].length;
      continue;
    }

    // Any other character (operators, punctuation) — skip.
    // These are matched directly by the grammar's terminal rules.
    pos++;
  }

  // --- Phase 5: Replace comments and non-tokenized newlines with spaces ---
  // Comments are handled here so the grammar doesn't need to deal with them.
  // Non-tokenized \n chars (blank lines, comment-only lines) are also replaced.
  const newlinePositions = new Set(tokens.filter(t => t.type === 'newline').map(t => t.start));
  const finalChars = [...input];
  for (let i = 0; i < finalChars.length; i++) {
    if (finalChars[i] === '#') {
      // Replace comment text with spaces (up to but not including \n).
      while (i < finalChars.length && finalChars[i] !== '\n') {
        finalChars[i] = ' ';
        i++;
      }
      // Now i points to \n (or end) — fall through to newline check below.
    }
    if (finalChars[i] === '\n' && !newlinePositions.has(i)) {
      finalChars[i] = ' ';
    }
  }
  input = finalChars.join('');

  return {tokens, input};
}

/**
 * Check if position starts a string prefix (r, b, u, f, t, etc.)
 * followed by a quote character.
 */
function isStringPrefixStart(input, pos) {
  const ch = input[pos].toLowerCase();
  if (!'rbuft'.includes(ch)) return false;

  // Check for 1-2 prefix chars followed by a quote.
  const next = input[pos + 1];
  if (next === "'" || next === '"') return true;
  if (next && 'rbuft'.includes(next.toLowerCase())) {
    const afterNext = input[pos + 2];
    return afterNext === "'" || afterNext === '"';
  }
  return false;
}

/**
 * Scan a string literal starting at `pos`. Returns the end position.
 * Handles single/double quotes, triple quotes, and string prefixes.
 */
function scanString(input, pos) {
  let i = pos;

  // Skip prefix chars (r, b, u, f, t, etc.)
  while (i < input.length && /[rRuUbBfFtT]/y.test(input[i])) {
    i++;
  }

  if (i >= input.length) return pos; // No quote found.

  const quote = input[i];
  if (quote !== "'" && quote !== '"') return pos; // Not a string.

  // Check for triple quote.
  const triple = input.slice(i, i + 3) === quote.repeat(3);
  const delimiter = triple ? quote.repeat(3) : quote;
  i += delimiter.length;

  // Scan until closing delimiter.
  while (i < input.length) {
    if (input[i] === '\\') {
      i += 2; // Skip escaped character.
      continue;
    }
    if (triple) {
      if (input.slice(i, i + 3) === delimiter) {
        return i + 3;
      }
    } else {
      if (input[i] === quote) {
        return i + 1;
      }
      if (input[i] === '\n') {
        // Unterminated single-line string.
        return i;
      }
    }
    i++;
  }

  // Unterminated string — return what we have.
  return i;
}

/**
 * Skip over a string body in the character array (for bracket depth tracking).
 * `pos` points to the opening quote character.
 * Returns the index of the last character of the string.
 */
function skipStringBody(chars, pos) {
  let i = pos;

  const quote = chars[i];
  const triple = i + 2 < chars.length && chars[i + 1] === quote && chars[i + 2] === quote;
  const delimLen = triple ? 3 : 1;
  i += delimLen;

  while (i < chars.length) {
    if (chars[i] === '\\') {
      i += 2;
      continue;
    }
    if (triple) {
      if (
        chars[i] === quote &&
        i + 2 < chars.length &&
        chars[i + 1] === quote &&
        chars[i + 2] === quote
      ) {
        return i + 2;
      }
    } else {
      if (chars[i] === quote) {
        return i;
      }
      if (chars[i] === '\n') {
        return i - 1; // Unterminated.
      }
    }
    i++;
  }
  return i - 1;
}

/**
 * Insert INDENT/DEDENT sentinel characters into the input.
 * Uses Python's indentation algorithm: track a stack of indentation levels.
 */
function insertIndentSentinels(input) {
  const lines = input.split('\n');
  const indentStack = [0];
  const result = [];

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];

    // Determine indentation of this line.
    let indent = 0;
    while (indent < line.length && (line[indent] === ' ' || line[indent] === '\t')) {
      if (line[indent] === '\t') {
        // Tab stops at every 8 columns (CPython behavior).
        indent = (Math.floor(indent / 8) + 1) * 8;
      } else {
        indent++;
      }
    }

    // Blank lines and comment-only lines don't affect indentation.
    if (indent >= line.length || line[indent] === '#') {
      result.push(line);
      continue;
    }

    const currentIndent = indentStack[indentStack.length - 1];

    if (indent > currentIndent) {
      // INDENT
      indentStack.push(indent);
      result.push(INDENT_SENTINEL + line);
    } else if (indent < currentIndent) {
      // DEDENT(s)
      let dedents = '';
      while (indentStack.length > 1 && indentStack[indentStack.length - 1] > indent) {
        indentStack.pop();
        dedents += DEDENT_SENTINEL;
      }
      result.push(dedents + line);
    } else {
      result.push(line);
    }
  }

  // Emit remaining DEDENTs at EOF.
  let finalDedents = '';
  while (indentStack.length > 1) {
    indentStack.pop();
    finalDedents += DEDENT_SENTINEL;
  }
  if (finalDedents) {
    result[result.length - 1] += finalDedents;
  }

  return result.join('\n');
}

/**
 * Create a match function that tokenizes input and pre-fills the memo table.
 *
 * @param {Grammar} grammar - An Ohm grammar compiled with @ohm-js/compiler/compat
 * @returns {function(string): MatchResult} A function that tokenizes and matches Python source
 */
export function createMatcher(grammar) {
  return function matchPython(rawInput) {
    const {tokens, input} = tokenize(rawInput);
    grammar._beforeParse = (exports, _input, ruleIds) => {
      for (const {type, start, end} of tokens) {
        const ruleId = ruleIds.get(type);
        if (ruleId !== undefined) {
          exports.memoizeToken(start, end - start, ruleId);
        }
      }
    };
    return grammar.match(input);
  };
}
