export class PosInfo {
  constructor() {
    this.applicationMemoKeyStack = []; // active applications at this position
    this.memo = {};
    this.maxExaminedLength = 0;
    this.maxRightmostFailureOffset = -1;
    this.currentLeftRecursion = undefined;
  }

  isActive(application) {
    return this.applicationMemoKeyStack.indexOf(application.toMemoKey()) >= 0;
  }

  enter(application) {
    this.applicationMemoKeyStack.push(application.toMemoKey());
  }

  exit() {
    this.applicationMemoKeyStack.pop();
  }

  startLeftRecursion(headApplication, memoRec) {
    memoRec.isLeftRecursion = true;
    memoRec.headApplication = headApplication;
    memoRec.nextLeftRecursion = this.currentLeftRecursion;
    this.currentLeftRecursion = memoRec;

    const {applicationMemoKeyStack} = this;
    const indexOfFirstInvolvedRule =
      applicationMemoKeyStack.indexOf(headApplication.toMemoKey()) + 1;
    const involvedApplicationMemoKeys = applicationMemoKeyStack.slice(
        indexOfFirstInvolvedRule,
    );

    memoRec.isInvolved = function(applicationMemoKey) {
      return involvedApplicationMemoKeys.indexOf(applicationMemoKey) >= 0;
    };

    memoRec.updateInvolvedApplicationMemoKeys = function() {
      for (let idx = indexOfFirstInvolvedRule; idx < applicationMemoKeyStack.length; idx++) {
        const applicationMemoKey = applicationMemoKeyStack[idx];
        if (!this.isInvolved(applicationMemoKey)) {
          involvedApplicationMemoKeys.push(applicationMemoKey);
        }
      }
    };
  }

  endLeftRecursion() {
    this.currentLeftRecursion = this.currentLeftRecursion.nextLeftRecursion;
  }

  // Note: this method doesn't get called for the "head" of a left recursion -- for LR heads,
  // the memoized result (which starts out being a failure) is always used.
  shouldUseMemoizedResult(memoRec) {
    if (!memoRec.isLeftRecursion) {
      return true;
    }
    const {applicationMemoKeyStack} = this;
    for (let idx = 0; idx < applicationMemoKeyStack.length; idx++) {
      const applicationMemoKey = applicationMemoKeyStack[idx];
      if (memoRec.isInvolved(applicationMemoKey)) {
        return false;
      }
    }
    return true;
  }

  memoize(memoKey, memoRec) {
    this.memo[memoKey] = memoRec;
    this.maxExaminedLength = Math.max(this.maxExaminedLength, memoRec.examinedLength);
    this.maxRightmostFailureOffset = Math.max(
        this.maxRightmostFailureOffset,
        memoRec.rightmostFailureOffset,
    );
    return memoRec;
  }

  clearObsoleteEntries(pos, invalidatedIdx) {
    if (pos + this.maxExaminedLength <= invalidatedIdx) {
      // Optimization: none of the rule applications that were memoized here examined the
      // interval of the input that changed, so nothing has to be invalidated.
      return;
    }

    const {memo} = this;
    this.maxExaminedLength = 0;
    this.maxRightmostFailureOffset = -1;
    Object.keys(memo).forEach(k => {
      const memoRec = memo[k];
      if (pos + memoRec.examinedLength > invalidatedIdx) {
        delete memo[k];
      } else {
        this.maxExaminedLength = Math.max(this.maxExaminedLength, memoRec.examinedLength);
        this.maxRightmostFailureOffset = Math.max(
            this.maxRightmostFailureOffset,
            memoRec.rightmostFailureOffset,
        );
      }
    });
  }
}
