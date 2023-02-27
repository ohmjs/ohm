import {InputStream} from './InputStream.js';
import {MatchResult} from './MatchResult.js';
import {PosInfo} from './PosInfo.js';
import {Trace} from './Trace.js';
import * as pexprs from './pexprs.js';
import * as util from './util.js';

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

let builtInApplySyntacticBody;

util.awaitBuiltInRules(builtInRules => {
  builtInApplySyntacticBody = builtInRules.rules.applySyntactic.body;
});

const applySpaces = new pexprs.Apply('spaces');

export class MatchState {
  constructor(matcher, startExpr, optPositionToRecordFailures) {
    this.matcher = matcher;
    this.startExpr = startExpr;

    this.grammar = matcher.grammar;
    this.input = matcher.getInput();
    this.inputStream = new InputStream(this.input);
    this.memoTable = matcher._memoTable;

    this.userData = undefined;
    this.doNotMemoize = false;

    this._bindings = [];
    this._bindingOffsets = [];
    this._applicationStack = [];
    this._posStack = [0];
    this.inLexifiedContextStack = [false];

    this.rightmostFailurePosition = -1;
    this._rightmostFailurePositionStack = [];
    this._recordedFailuresStack = [];

    if (optPositionToRecordFailures !== undefined) {
      this.positionToRecordFailures = optPositionToRecordFailures;
      this.recordedFailures = Object.create(null);
    }
  }

  posToOffset(pos) {
    return pos - this._posStack[this._posStack.length - 1];
  }

  enterApplication(posInfo, app) {
    this._posStack.push(this.inputStream.pos);
    this._applicationStack.push(app);
    this.inLexifiedContextStack.push(false);
    posInfo.enter(app);
    this._rightmostFailurePositionStack.push(this.rightmostFailurePosition);
    this.rightmostFailurePosition = -1;
  }

  exitApplication(posInfo, optNode) {
    const origPos = this._posStack.pop();
    this._applicationStack.pop();
    this.inLexifiedContextStack.pop();
    posInfo.exit();

    this.rightmostFailurePosition = Math.max(
        this.rightmostFailurePosition,
        this._rightmostFailurePositionStack.pop(),
    );

    if (optNode) {
      this.pushBinding(optNode, origPos);
    }
  }

  enterLexifiedContext() {
    this.inLexifiedContextStack.push(true);
  }

  exitLexifiedContext() {
    this.inLexifiedContextStack.pop();
  }

  currentApplication() {
    return this._applicationStack[this._applicationStack.length - 1];
  }

  inSyntacticContext() {
    const currentApplication = this.currentApplication();
    if (currentApplication) {
      return currentApplication.isSyntactic() && !this.inLexifiedContext();
    } else {
      // The top-level context is syntactic if the start application is.
      return this.startExpr.factors[0].isSyntactic();
    }
  }

  inLexifiedContext() {
    return this.inLexifiedContextStack[this.inLexifiedContextStack.length - 1];
  }

  skipSpaces() {
    this.pushFailuresInfo();
    this.eval(applySpaces);
    this.popBinding();
    this.popFailuresInfo();
    return this.inputStream.pos;
  }

  skipSpacesIfInSyntacticContext() {
    return this.inSyntacticContext() ? this.skipSpaces() : this.inputStream.pos;
  }

  maybeSkipSpacesBefore(expr) {
    if (expr.allowsSkippingPrecedingSpace() && expr !== applySpaces) {
      return this.skipSpacesIfInSyntacticContext();
    } else {
      return this.inputStream.pos;
    }
  }

  pushBinding(node, origPos) {
    this._bindings.push(node);
    this._bindingOffsets.push(this.posToOffset(origPos));
  }

  popBinding() {
    this._bindings.pop();
    this._bindingOffsets.pop();
  }

  numBindings() {
    return this._bindings.length;
  }

  truncateBindings(newLength) {
    // Yes, this is this really faster than setting the `length` property (tested with
    // bin/es5bench on Node v6.1.0).
    // Update 2021-10-25: still true on v14.15.5 — it's ~20% speedup on es5bench.
    while (this._bindings.length > newLength) {
      this.popBinding();
    }
  }

  getCurrentPosInfo() {
    return this.getPosInfo(this.inputStream.pos);
  }

  getPosInfo(pos) {
    let posInfo = this.memoTable[pos];
    if (!posInfo) {
      posInfo = this.memoTable[pos] = new PosInfo();
    }
    return posInfo;
  }

  processFailure(pos, expr) {
    this.rightmostFailurePosition = Math.max(this.rightmostFailurePosition, pos);

    if (this.recordedFailures && pos === this.positionToRecordFailures) {
      const app = this.currentApplication();
      if (app) {
        // Substitute parameters with the actual pexprs that were passed to
        // the current rule.
        expr = expr.substituteParams(app.args);
      } else {
        // This branch is only reached for the "end-check" that is
        // performed after the top-level application. In that case,
        // expr === pexprs.end so there is no need to substitute
        // parameters.
      }

      this.recordFailure(expr.toFailure(this.grammar), false);
    }
  }

  recordFailure(failure, shouldCloneIfNew) {
    const key = failure.toKey();
    if (!this.recordedFailures[key]) {
      this.recordedFailures[key] = shouldCloneIfNew ? failure.clone() : failure;
    } else if (this.recordedFailures[key].isFluffy() && !failure.isFluffy()) {
      this.recordedFailures[key].clearFluffy();
    }
  }

  recordFailures(failures, shouldCloneIfNew) {
    Object.keys(failures).forEach(key => {
      this.recordFailure(failures[key], shouldCloneIfNew);
    });
  }

  cloneRecordedFailures() {
    if (!this.recordedFailures) {
      return undefined;
    }

    const ans = Object.create(null);
    Object.keys(this.recordedFailures).forEach(key => {
      ans[key] = this.recordedFailures[key].clone();
    });
    return ans;
  }

  getRightmostFailurePosition() {
    return this.rightmostFailurePosition;
  }

  _getRightmostFailureOffset() {
    return this.rightmostFailurePosition >= 0 ?
      this.posToOffset(this.rightmostFailurePosition) :
      -1;
  }

  // Returns the memoized trace entry for `expr` at `pos`, if one exists, `null` otherwise.
  getMemoizedTraceEntry(pos, expr) {
    const posInfo = this.memoTable[pos];
    if (posInfo && expr instanceof pexprs.Apply) {
      const memoRec = posInfo.memo[expr.toMemoKey()];
      if (memoRec && memoRec.traceEntry) {
        const entry = memoRec.traceEntry.cloneWithExpr(expr);
        entry.isMemoized = true;
        return entry;
      }
    }
    return null;
  }

  // Returns a new trace entry, with the currently active trace array as its children.
  getTraceEntry(pos, expr, succeeded, bindings) {
    if (expr instanceof pexprs.Apply) {
      const app = this.currentApplication();
      const actuals = app ? app.args : [];
      expr = expr.substituteParams(actuals);
    }
    return (
      this.getMemoizedTraceEntry(pos, expr) ||
      new Trace(this.input, pos, this.inputStream.pos, expr, succeeded, bindings, this.trace)
    );
  }

  isTracing() {
    return !!this.trace;
  }

  hasNecessaryInfo(memoRec) {
    if (this.trace && !memoRec.traceEntry) {
      return false;
    }

    if (
      this.recordedFailures &&
      this.inputStream.pos + memoRec.rightmostFailureOffset === this.positionToRecordFailures
    ) {
      return !!memoRec.failuresAtRightmostPosition;
    }

    return true;
  }

  useMemoizedResult(origPos, memoRec) {
    if (this.trace) {
      this.trace.push(memoRec.traceEntry);
    }

    const memoRecRightmostFailurePosition =
      this.inputStream.pos + memoRec.rightmostFailureOffset;
    this.rightmostFailurePosition = Math.max(
        this.rightmostFailurePosition,
        memoRecRightmostFailurePosition,
    );
    if (
      this.recordedFailures &&
      this.positionToRecordFailures === memoRecRightmostFailurePosition &&
      memoRec.failuresAtRightmostPosition
    ) {
      this.recordFailures(memoRec.failuresAtRightmostPosition, true);
    }

    this.inputStream.examinedLength = Math.max(
        this.inputStream.examinedLength,
        memoRec.examinedLength + origPos,
    );

    if (memoRec.value) {
      this.inputStream.pos += memoRec.matchLength;
      this.pushBinding(memoRec.value, origPos);
      return true;
    }
    return false;
  }

  // Evaluate `expr` and return `true` if it succeeded, `false` otherwise. On success, `bindings`
  // will have `expr.getArity()` more elements than before, and the input stream's position may
  // have increased. On failure, `bindings` and position will be unchanged.
  eval(expr) {
    const {inputStream} = this;
    const origNumBindings = this._bindings.length;
    const origUserData = this.userData;

    let origRecordedFailures;
    if (this.recordedFailures) {
      origRecordedFailures = this.recordedFailures;
      this.recordedFailures = Object.create(null);
    }

    const origPos = inputStream.pos;
    const memoPos = this.maybeSkipSpacesBefore(expr);

    let origTrace;
    if (this.trace) {
      origTrace = this.trace;
      this.trace = [];
    }

    // Do the actual evaluation.
    const ans = expr.eval(this);

    if (this.trace) {
      const bindings = this._bindings.slice(origNumBindings);
      const traceEntry = this.getTraceEntry(memoPos, expr, ans, bindings);
      traceEntry.isImplicitSpaces = expr === applySpaces;
      traceEntry.isRootNode = expr === this.startExpr;
      origTrace.push(traceEntry);
      this.trace = origTrace;
    }

    if (ans) {
      if (this.recordedFailures && inputStream.pos === this.positionToRecordFailures) {
        Object.keys(this.recordedFailures).forEach(key => {
          this.recordedFailures[key].makeFluffy();
        });
      }
    } else {
      // Reset the position, bindings, and userData.
      inputStream.pos = origPos;
      this.truncateBindings(origNumBindings);
      this.userData = origUserData;
    }

    if (this.recordedFailures) {
      this.recordFailures(origRecordedFailures, false);
    }

    // The built-in applySyntactic rule needs special handling: we want to skip
    // trailing spaces, just as with the top-level application of a syntactic rule.
    if (expr === builtInApplySyntacticBody) {
      this.skipSpaces();
    }

    return ans;
  }

  getMatchResult() {
    this.grammar._setUpMatchState(this);
    this.eval(this.startExpr);
    let rightmostFailures;
    if (this.recordedFailures) {
      rightmostFailures = Object.keys(this.recordedFailures).map(
          key => this.recordedFailures[key],
      );
    }
    const cst = this._bindings[0];
    if (cst) {
      cst.grammar = this.grammar;
    }
    return new MatchResult(
        this.matcher,
        this.input,
        this.startExpr,
        cst,
        this._bindingOffsets[0],
        this.rightmostFailurePosition,
        rightmostFailures,
    );
  }

  getTrace() {
    this.trace = [];
    const matchResult = this.getMatchResult();

    // The trace node for the start rule is always the last entry. If it is a syntactic rule,
    // the first entry is for an application of 'spaces'.
    // TODO(pdubroy): Clean this up by introducing a special `Match<startAppl>` rule, which will
    // ensure that there is always a single root trace node.
    const rootTrace = this.trace[this.trace.length - 1];
    rootTrace.result = matchResult;
    return rootTrace;
  }

  pushFailuresInfo() {
    this._rightmostFailurePositionStack.push(this.rightmostFailurePosition);
    this._recordedFailuresStack.push(this.recordedFailures);
  }

  popFailuresInfo() {
    this.rightmostFailurePosition = this._rightmostFailurePositionStack.pop();
    this.recordedFailures = this._recordedFailuresStack.pop();
  }
}
