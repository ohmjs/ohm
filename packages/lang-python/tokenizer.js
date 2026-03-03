// Python tokenizer that scans source and produces tokens for memo table pre-fill.
//
// The tokenizer handles:
// - INDENT/DEDENT via sentinel characters (\uFDD0 / \uFDD1)
// - Replacing insignificant newlines (inside brackets) with spaces
// - NAME, NUMBER, STRING, NEWLINE tokens

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

// Char codes for readability
const CH_TAB = 0x09;
const CH_NL = 0x0a;
const CH_SPACE = 0x20;
const CH_HASH = 0x23;
const CH_QUOTE1 = 0x27; // '
const CH_QUOTE2 = 0x22; // "
const CH_OPAREN = 0x28;
const CH_CPAREN = 0x29;
const CH_OBRACK = 0x5b;
const CH_CBRACK = 0x5d;
const CH_BACKSLASH = 0x5c;
const CH_OBRACE = 0x7b;
const CH_CBRACE = 0x7d;
const CH_INDENT = 0xfdd0;
const CH_DEDENT = 0xfdd1;

function isStringPrefixCode(ch) {
  // r, R, u, U, b, B, f, F, t, T
  return (
    ch === 0x72 ||
    ch === 0x52 ||
    ch === 0x75 ||
    ch === 0x55 ||
    ch === 0x62 ||
    ch === 0x42 ||
    ch === 0x66 ||
    ch === 0x46 ||
    ch === 0x74 ||
    ch === 0x54
  );
}

function isOpenBracket(ch) {
  return ch === CH_OPAREN || ch === CH_OBRACK || ch === CH_OBRACE;
}

function isCloseBracket(ch) {
  return ch === CH_CPAREN || ch === CH_CBRACK || ch === CH_CBRACE;
}

/**
 * Check if position starts a string prefix (r, b, u, f, t, etc.)
 * followed by a quote character.
 */
function isStringPrefixStart(input, pos) {
  const ch = input.charCodeAt(pos);
  if (!isStringPrefixCode(ch)) return false;

  const next = input.charCodeAt(pos + 1);
  if (next === CH_QUOTE1 || next === CH_QUOTE2) return true;
  if (isStringPrefixCode(next)) {
    const afterNext = input.charCodeAt(pos + 2);
    return afterNext === CH_QUOTE1 || afterNext === CH_QUOTE2;
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
  while (i < input.length && isStringPrefixCode(input.charCodeAt(i))) {
    i++;
  }

  if (i >= input.length) return pos; // No quote found.

  const quoteCode = input.charCodeAt(i);
  if (quoteCode !== CH_QUOTE1 && quoteCode !== CH_QUOTE2) return pos;

  // Check for triple quote.
  const triple =
    i + 2 < input.length &&
    input.charCodeAt(i + 1) === quoteCode &&
    input.charCodeAt(i + 2) === quoteCode;
  i += triple ? 3 : 1;

  // Scan until closing delimiter.
  while (i < input.length) {
    const ch = input.charCodeAt(i);
    if (ch === CH_BACKSLASH) {
      i += 2; // Skip escaped character.
      continue;
    }
    if (triple) {
      if (
        ch === quoteCode &&
        i + 2 < input.length &&
        input.charCodeAt(i + 1) === quoteCode &&
        input.charCodeAt(i + 2) === quoteCode
      ) {
        return i + 3;
      }
    } else {
      if (ch === quoteCode) {
        return i + 1;
      }
      if (ch === CH_NL) {
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
 * Tokenize Python source code in a single pass.
 *
 * Returns:
 *   tokens: Array of {type, start, end} in the modified input
 *   input:  Modified input string (with sentinels, insignificant newlines replaced)
 *
 * Token types: 'name', 'number', 'string', 'newline', 'indent', 'dedent'
 */
export function tokenize(rawInput) {
  const tokens = [];
  const len = rawInput.length;

  // Count newlines for buffer sizing (sentinels can add at most ~2*newlineCount chars).
  let nlCount = 0;
  for (let i = 0; i < len; i++) {
    if (rawInput.charCodeAt(i) === CH_NL) nlCount++;
  }
  const out = new Uint16Array(len + 2 * nlCount + 1);
  let outPos = 0;

  // State
  let bracketDepth = 0;
  const indentStack = [0];
  let lineHasContent = false;
  let atLineStart = true;
  let indent = 0;
  let lineWSStart = 0; // raw input position where current line's whitespace starts

  let pos = 0;
  while (pos < len) {
    const ch = rawInput.charCodeAt(pos);

    // === Handle line start: measure indentation ===
    if (atLineStart) {
      if (ch === CH_SPACE) {
        indent++;
        pos++;
        continue;
      }
      if (ch === CH_TAB) {
        // Tab stops at every 8 columns (CPython behavior).
        indent = (Math.floor(indent / 8) + 1) * 8;
        pos++;
        continue;
      }
      // Line continuation in leading whitespace (rare)
      if (ch === CH_BACKSLASH && pos + 1 < len && rawInput.charCodeAt(pos + 1) === CH_NL) {
        indent += 2;
        pos += 2;
        continue;
      }

      // First non-whitespace character — decide on sentinels.
      atLineStart = false;

      // Only emit INDENT/DEDENT for lines with actual content (not blank/comment-only).
      if (ch !== CH_NL && ch !== CH_HASH) {
        const currentIndent = indentStack[indentStack.length - 1];
        if (indent > currentIndent) {
          indentStack.push(indent);
          tokens.push({type: 'indent', start: outPos, end: outPos + 1});
          out[outPos++] = CH_INDENT;
        } else if (indent < currentIndent) {
          while (indentStack.length > 1 && indentStack[indentStack.length - 1] > indent) {
            indentStack.pop();
            tokens.push({type: 'dedent', start: outPos, end: outPos + 1});
            out[outPos++] = CH_DEDENT;
          }
        }
      }

      // Write deferred whitespace (replacing line continuations with spaces).
      for (let j = lineWSStart; j < pos; j++) {
        if (
          rawInput.charCodeAt(j) === CH_BACKSLASH &&
          j + 1 < pos &&
          rawInput.charCodeAt(j + 1) === CH_NL
        ) {
          out[outPos++] = CH_SPACE;
          out[outPos++] = CH_SPACE;
          j++; // skip the \n too
        } else {
          out[outPos++] = rawInput.charCodeAt(j);
        }
      }

      // Fall through to handle the current character (ch).
    }

    // === Line continuation ===
    if (ch === CH_BACKSLASH && pos + 1 < len && rawInput.charCodeAt(pos + 1) === CH_NL) {
      out[outPos++] = CH_SPACE;
      out[outPos++] = CH_SPACE;
      pos += 2;
      continue;
    }

    // === Newline ===
    if (ch === CH_NL) {
      if (bracketDepth > 0) {
        // Inside brackets: insignificant newline.
        out[outPos++] = CH_SPACE;
        pos++;
        continue;
      }
      if (lineHasContent) {
        tokens.push({type: 'newline', start: outPos, end: outPos + 1});
        out[outPos++] = CH_NL;
      } else {
        // Blank or comment-only line.
        out[outPos++] = CH_SPACE;
      }
      lineHasContent = false;
      atLineStart = true;
      indent = 0;
      lineWSStart = pos + 1;
      pos++;
      continue;
    }

    // === Horizontal whitespace ===
    if (ch === CH_SPACE || ch === CH_TAB) {
      out[outPos++] = ch;
      pos++;
      continue;
    }

    // === Comment — replace with spaces ===
    if (ch === CH_HASH) {
      while (pos < len && rawInput.charCodeAt(pos) !== CH_NL) {
        out[outPos++] = CH_SPACE;
        pos++;
      }
      continue;
    }

    // === From here on, any token or character counts as line content ===
    lineHasContent = true;

    // === Brackets ===
    if (isOpenBracket(ch)) {
      bracketDepth++;
      out[outPos++] = ch;
      pos++;
      continue;
    }
    if (isCloseBracket(ch)) {
      bracketDepth = Math.max(0, bracketDepth - 1);
      out[outPos++] = ch;
      pos++;
      continue;
    }

    // === String ===
    if (ch === CH_QUOTE1 || ch === CH_QUOTE2 || isStringPrefixStart(rawInput, pos)) {
      const end = scanString(rawInput, pos);
      if (end > pos) {
        const slen = end - pos;
        tokens.push({type: 'string', start: outPos, end: outPos + slen});
        for (let j = pos; j < end; j++) {
          out[outPos++] = rawInput.charCodeAt(j);
        }
        pos = end;
        continue;
      }
    }

    // === Number ===
    NUMBER_RE.lastIndex = pos;
    const numMatch = NUMBER_RE.exec(rawInput);
    if (numMatch && numMatch.index === pos) {
      const mlen = numMatch[0].length;
      tokens.push({type: 'number', start: outPos, end: outPos + mlen});
      for (let j = pos; j < pos + mlen; j++) {
        out[outPos++] = rawInput.charCodeAt(j);
      }
      pos += mlen;
      continue;
    }

    // === Name ===
    NAME_RE.lastIndex = pos;
    const nameMatch = NAME_RE.exec(rawInput);
    if (nameMatch && nameMatch.index === pos) {
      const mlen = nameMatch[0].length;
      tokens.push({type: 'name', start: outPos, end: outPos + mlen});
      for (let j = pos; j < pos + mlen; j++) {
        out[outPos++] = rawInput.charCodeAt(j);
      }
      pos += mlen;
      continue;
    }

    // === Any other character (operators, punctuation) ===
    out[outPos++] = ch;
    pos++;
  }

  // === Final DEDENTs at EOF ===
  while (indentStack.length > 1) {
    indentStack.pop();
    tokens.push({type: 'dedent', start: outPos, end: outPos + 1});
    out[outPos++] = CH_DEDENT;
  }

  // Convert Uint16Array to string (chunked to avoid max args limit).
  const CHUNK = 8192;
  let input = '';
  for (let i = 0; i < outPos; i += CHUNK) {
    input += String.fromCharCode.apply(null, out.subarray(i, Math.min(i + CHUNK, outPos)));
  }

  return {tokens, input};
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
