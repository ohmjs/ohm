# packaging-tests

Notes:

- src/ is intended to mimic a user's Ohm-based project. We bundle it with
  different bundlers (Webpack, Rollup, etc.) and then test the result.
- test/ has tests which verify various aspects of the bundled sources.
- test/test-typings.ts is a little different: we mostly care whether it
  _compiles_, but we still execute it to make sure the source makes sense.
