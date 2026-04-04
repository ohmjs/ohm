import type {MatchContext} from './miniohm.ts';

import {CstView} from './cstReader.ts';
import {createHandle, HANDLE_BITS, INPUT_LENGTH_LIMIT, SHIFT} from './cstReaderShared.ts';

/**
 * Create a CstView from a MatchContext and Wasm exports.
 * Validates packed-handle limits (heap size and input length).
 */
export function createReaderFromCtx(ctx: MatchContext, exports: any): CstView {
  const heapTop = exports.__offset.value;
  if (heapTop >= SHIFT) {
    throw new Error(
      `Wasm heap too large for CstView: ${heapTop} bytes exceeds ${HANDLE_BITS}-bit limit (${SHIFT} bytes)`
    );
  }
  if (ctx.input.length >= INPUT_LENGTH_LIMIT) {
    throw new Error(
      `Input too long for CstView: ${ctx.input.length} chars exceeds limit (${INPUT_LENGTH_LIMIT} chars)`
    );
  }

  const rootLeadingSpacesLen = Math.max(0, exports.getSpacesLenAt(0));
  const rootPtr = exports.bindingsAt(0);
  return new CstView(ctx, createHandle(rootPtr, rootLeadingSpacesLen), rootLeadingSpacesLen);
}
