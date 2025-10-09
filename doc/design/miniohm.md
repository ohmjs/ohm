# Ohm and miniohm

As part of the [WebAssembly MVP](https://github.com/ohmjs/ohm/issues/503), I've created a small Go library that takes a .wasm blob and provides a minimal interface for matching input and walking the resulting CST. I'm calling this interface "miniohm". There's also a JavaScript implementation, and eventually we'll have versions for other languages.

Eventually, we want the WebAssembly-based matcher to be the core of `ohm-js`. Ideally we can do this by wrapping miniohm, so that `miniohm-js` would be both an implementation detail of `ohm-js`, _and_ a standalone library you could adopt. We'd also have `miniohm-go`, `miniohm-rs`, etc., but likely no "full" version of Ohm for those languages.

Here's how I'm picturing this:

![Relationship between Ohm and miniohm](https://ohmjs.org/img/docs/ohm-miniohm.png)
