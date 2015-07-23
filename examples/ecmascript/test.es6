/*eslint-disable */

var add = (arg1, arg2) => {
  return arg1 + arg2;
};
var obj = {
  foo: () => 'foo:' + this,
  blah: x => function() { return '' + this; }
};
[1, 2, 3].forEach(x => x + 1, this);
