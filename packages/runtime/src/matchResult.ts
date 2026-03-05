import {assert} from './assert.ts';
import {getLineAndColumn, getLineAndColumnMessage} from './extras.ts';
import {Failure, Interval} from './miniohm.ts';

import type {CstNode, Grammar, MatchContext} from './miniohm.ts';

export abstract class MatchResult {
  // Note: This is different from the JS implementation, which has:
  //    matcher: Matcher;
  // …instead.
  grammar: Grammar;
  startExpr: string;
  /** @internal */
  _ctx: MatchContext;
  /** @internal */
  _succeeded: boolean;
  /** @internal */
  _attached = true;
  /** @internal */
  _managed = false;
  /** @internal */
  _heapWatermark = 0;

  /** @internal */
  protected constructor(
    grammar: Grammar,
    startExpr: string,
    ctx: MatchContext,
    succeeded: boolean
  ) {
    this.grammar = grammar;
    this.startExpr = startExpr;
    this._ctx = ctx;
    this._succeeded = succeeded;
  }

  get input(): string {
    return (this.grammar as any)._input;
  }

  // `using` accesses [Symbol.dispose] at declaration time to get the
  // disposal method. We use this as the signal that the result is managed.
  get [Symbol.dispose](): () => void {
    this.grammar._manage(this);
    return () => this.dispose();
  }

  dispose(): void {
    throw new Error('MatchResult is not attached to any grammar');
  }

  succeeded(): this is SucceededMatchResult {
    return this._succeeded;
  }

  failed(): this is FailedMatchResult {
    return !this._succeeded;
  }

  toString(): string {
    return this.failed()
      ? '[match failed at position ' + this.getRightmostFailurePosition() + ']'
      : '[match succeeded]';
  }

  use<T>(cb: (r: this) => T): T {
    this.grammar._manage(this);
    try {
      return cb(this);
    } finally {
      this.dispose();
    }
  }
}

export function createMatchResult(
  grammar: Grammar,
  startExpr: string,
  ctx: MatchContext,
  succeeded: boolean
): MatchResult {
  return succeeded
    ? new SucceededMatchResult(grammar, startExpr, ctx, succeeded)
    : new FailedMatchResult(
        grammar,
        startExpr,
        ctx,
        succeeded,
        grammar.getRightmostFailurePosition()
      );
}

export class SucceededMatchResult extends MatchResult {
  /** @internal */
  _cst: CstNode;

  /** @internal */
  protected constructor(
    grammar: Grammar,
    startExpr: string,
    ctx: MatchContext,
    succeeded: boolean
  ) {
    super(grammar, startExpr, ctx, succeeded);
    this._cst = grammar._getCstRoot(ctx);
  }

  getCstRoot(): CstNode {
    return this._cst;
  }
}

export class FailedMatchResult extends MatchResult {
  /** @internal */
  _rightmostFailurePosition: number;
  /** @internal */
  private _rightmostFailures: Failure[] | null = null;
  /** @internal */
  private _failureDescriptions: string[] | null = null;

  /** @internal */
  protected constructor(
    grammar: Grammar,
    startExpr: string,
    ctx: MatchContext,
    succeeded: boolean,
    rightmostFailurePosition: number
  ) {
    super(grammar, startExpr, ctx, succeeded);
    this._rightmostFailurePosition = rightmostFailurePosition;
  }

  /** @internal */
  private _assertAttached(property: string) {
    if (!this._attached) {
      throw new Error(
        `Cannot access '${property}' after MatchResult has been disposed. ` +
          `Access failure information before calling dispose(), or use result.use().`
      );
    }
  }

  getRightmostFailurePosition(): number {
    return this._rightmostFailurePosition;
  }

  getRightmostFailures(): Failure[] {
    if (this._rightmostFailures === null) {
      this._assertAttached('getRightmostFailures()');
      const {exports} = (this.grammar as any)._instance;
      const ruleIds = (this.grammar as any)._ruleIds;
      const ruleNames = (this.grammar as any)._ruleNames;
      const inputLength = (this.grammar as any)._input.length;
      exports.recordFailures(inputLength, ruleIds.get(ruleNames[0]));

      // Use a Map to deduplicate by description while preserving fluffy status.
      // A failure is only fluffy if ALL occurrences are fluffy.
      const failureMap = new Map<string, boolean>();
      const len = exports.getRecordedFailuresLength();
      for (let i = 0; i < len; i++) {
        const id = exports.recordedFailuresAt(i);
        const desc = this.grammar.getFailureDescription(id);
        const fluffy = exports.isFluffy(i);
        if (failureMap.has(desc)) {
          // Only keep fluffy=true if both are fluffy
          failureMap.set(desc, failureMap.get(desc)! && fluffy);
        } else {
          failureMap.set(desc, fluffy);
        }
      }

      this._rightmostFailures = Array.from(failureMap.entries()).map(
        ([desc, fluffy]) => new Failure(desc, fluffy)
      );
    }
    return this._rightmostFailures;
  }

  // Get the non-fluffy failure descriptions.
  /** @internal */
  private _getFailureDescriptions(): string[] {
    if (this._failureDescriptions === null) {
      this._failureDescriptions = this.getRightmostFailures()
        .filter(f => !f.isFluffy())
        .map(f => f.toString());
    }
    return this._failureDescriptions;
  }

  // Return a string summarizing the expected contents of the input stream when
  // the match failure occurred.
  getExpectedText(): string {
    assert(!this._succeeded, 'cannot get expected text of a successful MatchResult');
    const descriptions = this._getFailureDescriptions();
    switch (descriptions.length) {
      case 0:
        return '';
      case 1:
        return descriptions[0];
      case 2:
        return descriptions[0] + ' or ' + descriptions[1];
      default:
        // For 3+ items: "a, b, or c"
        return (
          descriptions.slice(0, -1).join(', ') +
          ', or ' +
          descriptions[descriptions.length - 1]
        );
    }
  }

  getInterval(): Interval {
    const pos = this.getRightmostFailurePosition();
    return new Interval(this.input, pos, pos);
  }

  get message(): string {
    const detail = 'Expected ' + this.getExpectedText();
    return getLineAndColumnMessage(this.input, this.getRightmostFailurePosition()) + detail;
  }

  get shortMessage(): string {
    const detail = 'expected ' + this.getExpectedText();
    const errorInfo = getLineAndColumn(this.input, this.getRightmostFailurePosition());
    return 'Line ' + errorInfo.lineNum + ', col ' + errorInfo.colNum + ': ' + detail;
  }
}
