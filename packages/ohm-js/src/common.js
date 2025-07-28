// --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------

// Helpers

const escapeStringFor = {};
for (let c = 0; c < 128; c++) {
  escapeStringFor[c] = String.fromCharCode(c);
}
escapeStringFor["'".charCodeAt(0)] = "\\'";
escapeStringFor['"'.charCodeAt(0)] = '\\"';
escapeStringFor['\\'.charCodeAt(0)] = '\\\\';
escapeStringFor['\b'.charCodeAt(0)] = '\\b';
escapeStringFor['\f'.charCodeAt(0)] = '\\f';
escapeStringFor['\n'.charCodeAt(0)] = '\\n';
escapeStringFor['\r'.charCodeAt(0)] = '\\r';
escapeStringFor['\t'.charCodeAt(0)] = '\\t';
escapeStringFor['\u000b'.charCodeAt(0)] = '\\v';

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

export function abstract(optMethodName) {
  const methodName = optMethodName || '';
  return function() {
    throw new Error(
        'this method ' +
        methodName +
        ' is abstract! ' +
        '(it has no implementation in class ' +
        this.constructor.name +
        ')',
    );
  };
}

export function assert(cond, message) {
  if (!cond) {
    throw new Error(message || 'Assertion failed');
  }
}

// Define a lazily-computed, non-enumerable property named `propName`
// on the object `obj`. `getterFn` will be called to compute the value the
// first time the property is accessed.
export function defineLazyProperty(obj, propName, getterFn) {
  let memo;
  Object.defineProperty(obj, propName, {
    get() {
      if (!memo) {
        memo = getterFn.call(this);
      }
      return memo;
    },
  });
}

export function clone(obj) {
  if (obj) {
    return Object.assign({}, obj);
  }
  return obj;
}

export function repeatFn(fn, n) {
  const arr = [];
  while (n-- > 0) {
    arr.push(fn());
  }
  return arr;
}

export function repeatStr(str, n) {
  return new Array(n + 1).join(str);
}

export function repeat(x, n) {
  return repeatFn(() => x, n);
}

export function getDuplicates(array) {
  const duplicates = [];
  for (let idx = 0; idx < array.length; idx++) {
    const x = array[idx];
    if (array.lastIndexOf(x) !== idx && duplicates.indexOf(x) < 0) {
      duplicates.push(x);
    }
  }
  return duplicates;
}

export function copyWithoutDuplicates(array) {
  const noDuplicates = [];
  array.forEach(entry => {
    if (noDuplicates.indexOf(entry) < 0) {
      noDuplicates.push(entry);
    }
  });
  return noDuplicates;
}

export function isSyntactic(ruleName) {
  const firstChar = ruleName[0];
  return firstChar === firstChar.toUpperCase();
}

export function isLexical(ruleName) {
  return !isSyntactic(ruleName);
}

export function padLeft(str, len, optChar) {
  const ch = optChar || ' ';
  if (str.length < len) {
    return repeatStr(ch, len - str.length) + str;
  }
  return str;
}

// StringBuffer

export function StringBuffer() {
  this.strings = [];
}

StringBuffer.prototype.append = function(str) {
  this.strings.push(str);
};

StringBuffer.prototype.contents = function() {
  return this.strings.join('');
};

const escapeUnicode = str => String.fromCodePoint(parseInt(str, 16));

export function unescapeCodePoint(s) {
  if (s.charAt(0) === '\\') {
    switch (s.charAt(1)) {
      case 'b':
        return '\b';
      case 'f':
        return '\f';
      case 'n':
        return '\n';
      case 'r':
        return '\r';
      case 't':
        return '\t';
      case 'v':
        return '\v';
      case 'x':
        return escapeUnicode(s.slice(2, 4));
      case 'u':
        return s.charAt(2) === '{' ?
          escapeUnicode(s.slice(3, -1)) :
          escapeUnicode(s.slice(2, 6));
      default:
        return s.charAt(1);
    }
  } else {
    return s;
  }
}

// Helper for producing a description of an unknown object in a safe way.
// Especially useful for error messages where an unexpected type of object was encountered.
export function unexpectedObjToString(obj) {
  if (obj == null) {
    return String(obj);
  }
  const baseToString = Object.prototype.toString.call(obj);
  try {
    let typeName;
    if (obj.constructor && obj.constructor.name) {
      typeName = obj.constructor.name;
    } else if (baseToString.indexOf('[object ') === 0) {
      typeName = baseToString.slice(8, -1); // Extract e.g. "Array" from "[object Array]".
    } else {
      typeName = typeof obj;
    }
    return typeName + ': ' + JSON.stringify(String(obj));
  } catch (e) {
    return baseToString;
  }
}

export function checkNotNull(obj, message = 'unexpected null value') {
  if (obj == null) {
    throw new Error(message);
  }
  return obj;
}
