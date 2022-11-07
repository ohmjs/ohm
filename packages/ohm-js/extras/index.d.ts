import {MatchResult, Grammar, Semantics} from 'ohm-js';

interface LineAndColumnInfo {
  offset: number;
  lineNumber: number;
  colNum: number;
  line: string;
  prevLine: string;
  nextLine: string;
  toString(...ranges: number[][]): string;
}

export function toAST(matchResult: MatchResult, mapping?: {}): {};
export function semanticsForToAST(g: Grammar): Semantics;

/**
 * Returns contextual information (line and column number, etc.) about a
 * specific character in a string.
 */
export function getLineAndColumn(str: string, offset: number): LineAndColumnInfo;

/**
 * Returns a nicely-formatted message (appropriate for syntax errors, etc.)
 * pointing to a specific character within a string. Optionally, one or more
 * ranges within the string can also be highlighted.
 */
export function getLineAndColumnMessage(
  str: string,
  offset: number,
  ...ranges: number[][]
): string;
