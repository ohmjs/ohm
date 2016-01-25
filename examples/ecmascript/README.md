# ohm-grammar-ecmascript

This directory contains Ohm grammars for various versions of the ECMAScript
spec. Currently, only the ES5 grammar is reasonably complete, but we are
working on ES6.

## Usage (NPM)

You can install these grammars as an NPM package:

```
npm install ohm-grammar-ecmascript
```

After installing, you can use the ES5 grammar like this:


```js
var es5 = require('ohm-grammar-ecmascript');
var result = es5.grammar.match('var x = 3; console.log(x);');
assert(result.succeeded());
```
