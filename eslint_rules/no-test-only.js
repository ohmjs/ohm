'use strict';

// An ESLint plugin that flags code like: `test.only('test name', function(t) { ... })`.
// This is a way of temporarily disabling all other tests, and should only be used for debugging.
module.exports = function(context) {
  return {
    CallExpression: function(node) {
      var callee = node.callee;
      if (callee.type === 'MemberExpression' &&
          callee.object.name === 'test' &&
          callee.property.name === 'only') {
        context.report(node, 'test.only should only be used for debugging');
      }
    }
  };
};
