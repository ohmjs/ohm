import {assert} from '../src/common.js';

// Helpers

function getProp(name, thing, fn) {
  return fn(thing[name]);
}

function mapProp(name, thing, fn) {
  return thing[name].map(fn);
}

// Returns a function that will walk a single property of a node.
// `descriptor` is a string indicating the property name, optionally ending
// with '[]' (e.g., 'children[]').
function getPropWalkFn(descriptor) {
  const parts = descriptor.split(/ ?\[\]/);
  if (parts.length === 2) {
    return mapProp.bind(null, parts[0]);
  }
  return getProp.bind(null, descriptor);
}

function getProps(walkFns, thing, fn) {
  return walkFns.map(walkFn => walkFn(thing, fn));
}

function getWalkFn(shape) {
  if (typeof shape === 'string') {
    return getProps.bind(null, [getPropWalkFn(shape)]);
  } else if (Array.isArray(shape)) {
    return getProps.bind(null, shape.map(getPropWalkFn));
  } else {
    assert(typeof shape === 'function', 'Expected a string, Array, or function');
    assert(shape.length === 2, 'Expected a function of arity 2, got ' + shape.length);
    return shape;
  }
}

function isRestrictedIdentifier(str) {
  return /^[a-zA-Z_][0-9a-zA-Z_]*$/.test(str);
}

function trim(s) {
  return s.trim();
}

function parseSignature(sig) {
  const parts = sig.split(/[()]/).map(trim);
  if (parts.length === 3 && parts[2] === '') {
    const name = parts[0];
    let params = [];
    if (parts[1].length > 0) {
      params = parts[1].split(',').map(trim);
    }
    if (isRestrictedIdentifier(name) && params.every(isRestrictedIdentifier)) {
      return {name, formals: params};
    }
  }
  throw new Error('Invalid operation signature: ' + sig);
}

/*
  A VisitorFamily contains a set of recursive operations that are defined over some kind of
  tree structure. The `config` parameter specifies how to walk the tree:
  - 'getTag' is function which, given a node in the tree, returns the node's 'tag' (type)
  - 'shapes' an object that maps from a tag to a value that describes how to recursively
    evaluate the operation for nodes of that type. The value can be:
    * a string indicating the property name that holds that node's only child
    * an Array of property names (or an empty array indicating a leaf type), or
    * a function taking two arguments (node, fn), and returning an Array which is the result
      of apply `fn` to each of the node's children.
 */
export class VisitorFamily {
  constructor(config) {
    this._shapes = config.shapes;
    this._getTag = config.getTag;

    this.Adapter = function(thing, family) {
      this._adaptee = thing;
      this._family = family;
    };
    this.Adapter.prototype.valueOf = function() {
      throw new Error('heeey!');
    };
    this.operations = {};

    this._arities = Object.create(null);
    this._getChildren = Object.create(null);

    Object.keys(this._shapes).forEach(k => {
      const shape = this._shapes[k];
      this._getChildren[k] = getWalkFn(shape);

      // A function means the arity isn't fixed, so don't put an entry in the arity map.
      if (typeof shape !== 'function') {
        this._arities[k] = Array.isArray(shape) ? shape.length : 1;
      }
    });
    this._wrap = thing => new this.Adapter(thing, this);
  }

  wrap(thing) {
    return this._wrap(thing);
  }

  _checkActionDict(dict) {
    Object.keys(dict).forEach(k => {
      assert(k in this._getChildren, "Unrecognized action name '" + k + "'");
      const action = dict[k];
      assert(
          typeof action === 'function',
          "Key '" + k + "': expected function, got " + action,
      );
      if (k in this._arities) {
        const expected = this._arities[k];
        const actual = dict[k].length;
        assert(
            actual === expected,
            "Action '" + k + "' has the wrong arity: expected " + expected + ', got ' + actual,
        );
      }
    });
  }

  addOperation(signature, actions) {
    const sig = parseSignature(signature);
    const {name} = sig;
    this._checkActionDict(actions);
    this.operations[name] = {
      name,
      formals: sig.formals,
      actions,
    };

    const family = this;
    this.Adapter.prototype[name] = function(...args) {
      const tag = family._getTag(this._adaptee);
      assert(tag in family._getChildren, "getTag returned unrecognized tag '" + tag + "'");
      assert(tag in actions, "No action for '" + tag + "' in operation '" + name + "'");

      // Create an "arguments object" from the arguments that were passed to this
      // operation / attribute.
      const argsObj = Object.create(null);
      for (const [i, val] of Object.entries(args)) {
        argsObj[sig.formals[i]] = val;
      }

      const oldArgs = this.args;
      this.args = argsObj;
      const ans = actions[tag].apply(
          this,
          family._getChildren[tag](this._adaptee, family._wrap),
      );
      this.args = oldArgs;
      return ans;
    };
    return this;
  }
}
