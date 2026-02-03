// --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------

// Helpers

const escapeStringFor = {
  0: '\x00',
  1: '\x01',
  2: '\x02',
  3: '\x03',
  4: '\x04',
  5: '\x05',
  6: '\x06',
  7: '\x07',
  8: '\\b',
  9: '\\t',
  10: '\\n',
  11: '\\v',
  12: '\\f',
  13: '\\r',
  14: '\x0E',
  15: '\x0F',
  16: '\x10',
  17: '\x11',
  18: '\x12',
  19: '\x13',
  20: '\x14',
  21: '\x15',
  22: '\x16',
  23: '\x17',
  24: '\x18',
  25: '\x19',
  26: '\x1A',
  27: '\x1B',
  28: '\x1C',
  29: '\x1D',
  30: '\x1E',
  31: '\x1F',
  32: ' ',
  33: '!',
  34: '\\"',
  35: '#',
  36: '$',
  37: '%',
  38: '&',
  39: "\\'",
  40: '(',
  41: ')',
  42: '*',
  43: '+',
  44: ',',
  45: '-',
  46: '.',
  47: '/',
  48: '0',
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  55: '7',
  56: '8',
  57: '9',
  58: ':',
  59: ';',
  60: '<',
  61: '=',
  62: '>',
  63: '?',
  64: '@',
  65: 'A',
  66: 'B',
  67: 'C',
  68: 'D',
  69: 'E',
  70: 'F',
  71: 'G',
  72: 'H',
  73: 'I',
  74: 'J',
  75: 'K',
  76: 'L',
  77: 'M',
  78: 'N',
  79: 'O',
  80: 'P',
  81: 'Q',
  82: 'R',
  83: 'S',
  84: 'T',
  85: 'U',
  86: 'V',
  87: 'W',
  88: 'X',
  89: 'Y',
  90: 'Z',
  91: '[',
  92: '\\\\',
  93: ']',
  94: '^',
  95: '_',
  96: '`',
  97: 'a',
  98: 'b',
  99: 'c',
  100: 'd',
  101: 'e',
  102: 'f',
  103: 'g',
  104: 'h',
  105: 'i',
  106: 'j',
  107: 'k',
  108: 'l',
  109: 'm',
  110: 'n',
  111: 'o',
  112: 'p',
  113: 'q',
  114: 'r',
  115: 's',
  116: 't',
  117: 'u',
  118: 'v',
  119: 'w',
  120: 'x',
  121: 'y',
  122: 'z',
  123: '{',
  124: '|',
  125: '}',
  126: '~',
  127: '\x7F',
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

export function abstract(optMethodName) {
  const methodName = optMethodName || '';
  return function () {
    throw new Error(
      'this method ' +
        methodName +
        ' is abstract! ' +
        '(it has no implementation in class ' +
        this.constructor.name +
        ')'
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
    return {...obj};
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
  const duplicates = new Set();
  for (let idx = 0; idx < array.length; idx++) {
    const x = array[idx];
    if (array.lastIndexOf(x) !== idx && duplicates.has(x) < 0) {
      duplicates.add(x);
    }
  }
  return [...duplicates];
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

StringBuffer.prototype.append = function (str) {
  this.strings.push(str);
};

StringBuffer.prototype.contents = function () {
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
        return s.charAt(2) === '{'
          ? escapeUnicode(s.slice(3, -1))
          : escapeUnicode(s.slice(2, 6));
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
  } catch {
    return baseToString;
  }
}

export function checkNotNull(obj, message = 'unexpected null value') {
  if (obj == null) {
    throw new Error(message);
  }
  return obj;
}
