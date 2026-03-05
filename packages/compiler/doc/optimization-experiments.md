# Compiler Optimization Experiments

Short summary of some of the optimizations I have already tried (all on my
M1 MacBook Pro).

## Alt-Prealloc

Hoist Alt branches in rules like `letter = lower | upper | unicodeLtmo` into
synthetic preallocatable wrapper rules, skipping memo table lookup for the
parent. No measurable improvement.

## GuardedIter & RangeIter (incl SIMD)

Use Wasm SIMD to scan 8 UTF-16 code units at a time in `(~delim any)*` loops,
instead of checking one character at a time. The input buffer is padded with
`0xFFFF` sentinels so the SIMD loop needs no bounds check. On a guard char hit,
`i8x16.bitmask` + `ctz` locates the exact position and the full delimiter is
evaluated normally via `emitPExpr`.

RangeIter was something similar for non-lookahead loops. Also added
`resolveToRange` in the IR optimizer so that `digit*` (where
`digit = "0".."9"`) is recognized as a RangeIter, not just literal `"0".."9"*`.

Tried both of these with scalar ops too, no difference (or barely any).

Saw small improvement on ES5 benchmark after adding support for hoisting `any`
through trivial aliases (e.g. `sourceCharacter = any`) and supporting multiple
ranges in RangeIter.

Also did preallocated iter nodes for this, as an expr like `(~lit any)*` doesn't
require a separate child for each iteration.

## Fast space skipping

Added `fastSkipSpaces()` for grammars with the default space rule
(`space = Range(0, 32)`). Precomputes a position bitmap at match time (one bit
per input position where the char code is ≤ 0x20), then uses CTZ to skip runs
of up to 32 space positions per word. `hasDefaultSpaceRules()` gates the
optimization at compile time. At each implicit spacing point, the compiler
emits an inline `charCode > 0x20` fast-reject that pushes a preallocated empty
`$spaces` node (the common case), otherwise calls `fastSkipSpaces()` for the
bitmap+CTZ scan. Preallocated `$spaces` CST nodes for matchLength 0..8 avoid
allocation for typical space runs. Small (~5-8%) improvement in parseLiquid.

Tried to generalize this to grammars that override `space` (e.g. ES5's
`space := whitespace | lineTerminator | comment`). Added `Range` handling to
`computeFirstChars()` to compute the set of possible space-starting chars at
compile time, then tried using that set as a fast-reject filter. No measurable
improvement — the compiled `Star(Apply('space'))` already fails fast at
non-space positions, so the reject check alone doesn't help. A generalized
`fastSkipSpaces` equivalent (position bitmap for an arbitrary char set) would
be needed, but was not attempted. Kept the `Range` case in
`computeFirstChars()`.

## Single-child optimization

For rules whose body produces exactly one binding (`outArity === 1`), replace
the child in-place (`newNonterminalNodeInPlace`) instead of the general count/copy
path, and skip saving/restoring bindings state on the success path. No measurable
improvement on its own — most single-child lexical rules already hit the prealloc
fast path, so few rules benefit.

## CST chunk allocator

Tried a bump allocator for CST nodes: grab 64KB chunks from `heap.alloc` and
bump-allocate individual nodes within each chunk, amortizing the per-allocation
overhead (4-byte header + 16-byte alignment). Slightly lower memory usage due
to eliminating alignment padding, but no measurable performance improvement.
Removed in favour of direct `heap.alloc` calls.

## Others

- Eliminating call_indirect
