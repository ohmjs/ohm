!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ohm=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var ohm = _dereq_('..');
module.exports = ohm.makeRecipe(function() {
  return new this.newGrammar('BuiltInRules')
    .define('alnum', [], this.prim(/[0-9a-zA-Z]/), 'an alpha-numeric character')
    .define('letter', [], this.prim(/[a-zA-Z]/), 'a letter')
    .define('lower', [], this.prim(/[a-z]/), 'a lower-case letter')
    .define('upper', [], this.prim(/[A-Z]/), 'an upper-case letter')
    .define('digit', [], this.prim(/[0-9]/), 'a digit')
    .define('hexDigit', [], this.prim(/[0-9a-fA-F]/), 'a hexadecimal digit')
    .define('ListOf_some', ['elem', 'sep'], this.seq(this.param(0), this.star(this.seq(this.param(1), this.param(0)))))
    .define('ListOf_none', ['elem', 'sep'], this.seq())
    .define('ListOf', ['elem', 'sep'], this.alt(this.app('ListOf_some', [this.app('elem'), this.app('sep')]), this.app('ListOf_none', [this.app('elem'), this.app('sep')])))
    .build();
});


},{"..":28}],2:[function(_dereq_,module,exports){
var ohm = _dereq_('..');
module.exports = ohm.makeRecipe(function() {
  return new this.newGrammar('Ohm')
    .withDefaultStartRule('Grammars')
    .define('Grammars', [], this.star(this.app('Grammar')))
    .define('Grammar', [], this.seq(this.app('ident'), this.opt(this.app('SuperGrammar')), this.prim('{'), this.star(this.app('Rule')), this.prim('}')))
    .define('SuperGrammar', [], this.seq(this.prim('<:'), this.app('ident')))
    .define('Rule_define', [], this.seq(this.app('ident'), this.opt(this.app('Formals')), this.opt(this.app('ruleDescr')), this.prim('='), this.app('Alt')))
    .define('Rule_override', [], this.seq(this.app('ident'), this.opt(this.app('Formals')), this.prim(':='), this.app('Alt')))
    .define('Rule_extend', [], this.seq(this.app('ident'), this.opt(this.app('Formals')), this.prim('+='), this.app('Alt')))
    .define('Rule', [], this.alt(this.app('Rule_define'), this.app('Rule_override'), this.app('Rule_extend')))
    .define('Formals', [], this.seq(this.prim('<'), this.app('ListOf', [this.app('ident'), this.prim(',')]), this.prim('>')))
    .define('Params', [], this.seq(this.prim('<'), this.app('ListOf', [this.app('Seq'), this.prim(',')]), this.prim('>')))
    .define('Alt', [], this.seq(this.app('Term'), this.star(this.seq(this.prim('|'), this.app('Term')))))
    .define('Term_inline', [], this.seq(this.app('Seq'), this.app('caseName')))
    .define('Term', [], this.alt(this.app('Term_inline'), this.app('Seq')))
    .define('Seq', [], this.star(this.app('Iter')))
    .define('Iter_star', [], this.seq(this.app('Pred'), this.prim('*')))
    .define('Iter_plus', [], this.seq(this.app('Pred'), this.prim('+')))
    .define('Iter_opt', [], this.seq(this.app('Pred'), this.prim('?')))
    .define('Iter', [], this.alt(this.app('Iter_star'), this.app('Iter_plus'), this.app('Iter_opt'), this.app('Pred')))
    .define('Pred_not', [], this.seq(this.prim('~'), this.app('Base')))
    .define('Pred_lookahead', [], this.seq(this.prim('&'), this.app('Base')))
    .define('Pred', [], this.alt(this.app('Pred_not'), this.app('Pred_lookahead'), this.app('Base')))
    .define('Base_application', [], this.seq(this.app('ident'), this.opt(this.app('Params')), this.not(this.alt(this.seq(this.opt(this.app('ruleDescr')), this.prim('=')), this.prim(':='), this.prim('+=')))))
    .define('Base_prim', [], this.alt(this.app('keyword'), this.app('string'), this.app('regExp'), this.app('number')))
    .define('Base_paren', [], this.seq(this.prim('('), this.app('Alt'), this.prim(')')))
    .define('Base_arr', [], this.seq(this.prim('['), this.app('Alt'), this.prim(']')))
    .define('Base_str', [], this.seq(this.prim('``'), this.app('Alt'), this.prim("''")))
    .define('Base_obj', [], this.seq(this.prim('{'), this.opt(this.prim('...')), this.prim('}')))
    .define('Base_objWithProps', [], this.seq(this.prim('{'), this.app('Props'), this.opt(this.seq(this.prim(','), this.prim('...'))), this.prim('}')))
    .define('Base', [], this.alt(this.app('Base_application'), this.app('Base_prim'), this.app('Base_paren'), this.app('Base_arr'), this.app('Base_str'), this.app('Base_obj'), this.app('Base_objWithProps')))
    .define('Props', [], this.seq(this.app('Prop'), this.star(this.seq(this.prim(','), this.app('Prop')))))
    .define('Prop', [], this.seq(this.alt(this.app('name'), this.app('string')), this.prim(':'), this.app('Alt')))
    .define('ruleDescr', [], this.seq(this.prim('('), this.app('ruleDescrText'), this.prim(')')), 'a rule description')
    .define('ruleDescrText', [], this.star(this.seq(this.not(this.prim(')')), this.app('_'))))
    .define('caseName', [], this.seq(this.prim('--'), this.star(this.seq(this.not(this.prim('\n')), this.app('space'))), this.app('name'), this.star(this.seq(this.not(this.prim('\n')), this.app('space'))), this.alt(this.prim('\n'), this.la(this.prim('}')))))
    .define('name', [], this.seq(this.app('nameFirst'), this.star(this.app('nameRest'))), 'a name')
    .define('nameFirst', [], this.alt(this.prim('_'), this.app('letter')))
    .define('nameRest', [], this.alt(this.prim('_'), this.app('alnum')))
    .define('ident', [], this.seq(this.not(this.app('keyword')), this.app('name')), 'an identifier')
    .define('keyword_null', [], this.seq(this.prim('null'), this.not(this.app('nameRest'))))
    .define('keyword_true', [], this.seq(this.prim('true'), this.not(this.app('nameRest'))))
    .define('keyword_false', [], this.seq(this.prim('false'), this.not(this.app('nameRest'))))
    .define('keyword', [], this.alt(this.app('keyword_null'), this.app('keyword_true'), this.app('keyword_false')))
    .define('string', [], this.seq(this.prim('"'), this.star(this.app('strChar')), this.prim('"')), 'a string literal')
    .define('strChar', [], this.alt(this.app('escapeChar'), this.seq(this.not(this.prim('\\')), this.not(this.prim('"')), this.not(this.prim('\n')), this.app('_'))))
    .define('escapeChar_backslash', [], this.prim('\\\\'))
    .define('escapeChar_doubleQuote', [], this.prim('\\"'))
    .define('escapeChar_singleQuote', [], this.prim("\\'"))
    .define('escapeChar_backspace', [], this.prim('\\b'))
    .define('escapeChar_lineFeed', [], this.prim('\\n'))
    .define('escapeChar_carriageReturn', [], this.prim('\\r'))
    .define('escapeChar_tab', [], this.prim('\\t'))
    .define('escapeChar_unicodeEscape', [], this.seq(this.prim('\\u'), this.app('hexDigit'), this.app('hexDigit'), this.app('hexDigit'), this.app('hexDigit')))
    .define('escapeChar_hexEscape', [], this.seq(this.prim('\\x'), this.app('hexDigit'), this.app('hexDigit')))
    .define('escapeChar', [], this.alt(this.app('escapeChar_backslash'), this.app('escapeChar_doubleQuote'), this.app('escapeChar_singleQuote'), this.app('escapeChar_backspace'), this.app('escapeChar_lineFeed'), this.app('escapeChar_carriageReturn'), this.app('escapeChar_tab'), this.app('escapeChar_unicodeEscape'), this.app('escapeChar_hexEscape')))
    .define('regExp', [], this.seq(this.prim('/'), this.app('reCharClass'), this.prim('/')), 'a regular expression')
    .define('reCharClass_unicode', [], this.seq(this.prim('\\p{'), this.plus(this.prim(/[A-Za-z]/)), this.prim('}')))
    .define('reCharClass_ordinary', [], this.seq(this.prim('['), this.star(this.alt(this.prim('\\]'), this.seq(this.not(this.prim(']')), this.app('_')))), this.prim(']')))
    .define('reCharClass', [], this.alt(this.app('reCharClass_unicode'), this.app('reCharClass_ordinary')))
    .define('number', [], this.seq(this.opt(this.prim('-')), this.plus(this.app('digit'))), 'a number')
    .define('space_singleLine', [], this.seq(this.prim('//'), this.star(this.seq(this.not(this.prim('\n')), this.app('_'))), this.prim('\n')))
    .define('space_multiLine', [], this.seq(this.prim('/*'), this.star(this.seq(this.not(this.prim('*/')), this.app('_'))), this.prim('*/')))
    .extend('space', [], this.alt(this.alt(this.app('space_singleLine'), this.app('space_multiLine')), this.prim(/[\s]/)), 'a space')
    .build();
});


},{"..":28}],3:[function(_dereq_,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = _dereq_('base64-js')
var ieee754 = _dereq_('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

},{"base64-js":4,"ieee754":5}],4:[function(_dereq_,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],5:[function(_dereq_,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],6:[function(_dereq_,module,exports){
var Buffer = _dereq_('buffer').Buffer;
var intSize = 4;
var zeroBuffer = new Buffer(intSize); zeroBuffer.fill(0);
var chrsz = 8;

function toArray(buf, bigEndian) {
  if ((buf.length % intSize) !== 0) {
    var len = buf.length + (intSize - (buf.length % intSize));
    buf = Buffer.concat([buf, zeroBuffer], len);
  }

  var arr = [];
  var fn = bigEndian ? buf.readInt32BE : buf.readInt32LE;
  for (var i = 0; i < buf.length; i += intSize) {
    arr.push(fn.call(buf, i));
  }
  return arr;
}

function toBuffer(arr, size, bigEndian) {
  var buf = new Buffer(size);
  var fn = bigEndian ? buf.writeInt32BE : buf.writeInt32LE;
  for (var i = 0; i < arr.length; i++) {
    fn.call(buf, arr[i], i * 4, true);
  }
  return buf;
}

function hash(buf, fn, hashSize, bigEndian) {
  if (!Buffer.isBuffer(buf)) buf = new Buffer(buf);
  var arr = fn(toArray(buf, bigEndian), buf.length * chrsz);
  return toBuffer(arr, hashSize, bigEndian);
}

module.exports = { hash: hash };

},{"buffer":3}],7:[function(_dereq_,module,exports){
var Buffer = _dereq_('buffer').Buffer
var sha = _dereq_('./sha')
var sha256 = _dereq_('./sha256')
var rng = _dereq_('./rng')
var md5 = _dereq_('./md5')

var algorithms = {
  sha1: sha,
  sha256: sha256,
  md5: md5
}

var blocksize = 64
var zeroBuffer = new Buffer(blocksize); zeroBuffer.fill(0)
function hmac(fn, key, data) {
  if(!Buffer.isBuffer(key)) key = new Buffer(key)
  if(!Buffer.isBuffer(data)) data = new Buffer(data)

  if(key.length > blocksize) {
    key = fn(key)
  } else if(key.length < blocksize) {
    key = Buffer.concat([key, zeroBuffer], blocksize)
  }

  var ipad = new Buffer(blocksize), opad = new Buffer(blocksize)
  for(var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }

  var hash = fn(Buffer.concat([ipad, data]))
  return fn(Buffer.concat([opad, hash]))
}

function hash(alg, key) {
  alg = alg || 'sha1'
  var fn = algorithms[alg]
  var bufs = []
  var length = 0
  if(!fn) error('algorithm:', alg, 'is not yet supported')
  return {
    update: function (data) {
      if(!Buffer.isBuffer(data)) data = new Buffer(data)
        
      bufs.push(data)
      length += data.length
      return this
    },
    digest: function (enc) {
      var buf = Buffer.concat(bufs)
      var r = key ? hmac(fn, key, buf) : fn(buf)
      bufs = null
      return enc ? r.toString(enc) : r
    }
  }
}

function error () {
  var m = [].slice.call(arguments).join(' ')
  throw new Error([
    m,
    'we accept pull requests',
    'http://github.com/dominictarr/crypto-browserify'
    ].join('\n'))
}

exports.createHash = function (alg) { return hash(alg) }
exports.createHmac = function (alg, key) { return hash(alg, key) }
exports.randomBytes = function(size, callback) {
  if (callback && callback.call) {
    try {
      callback.call(this, undefined, new Buffer(rng(size)))
    } catch (err) { callback(err) }
  } else {
    return new Buffer(rng(size))
  }
}

function each(a, f) {
  for(var i in a)
    f(a[i], i)
}

// the least I can do is make error messages for the rest of the node.js/crypto api.
each(['createCredentials'
, 'createCipher'
, 'createCipheriv'
, 'createDecipher'
, 'createDecipheriv'
, 'createSign'
, 'createVerify'
, 'createDiffieHellman'
, 'pbkdf2'], function (name) {
  exports[name] = function () {
    error('sorry,', name, 'is not implemented yet')
  }
})

},{"./md5":8,"./rng":9,"./sha":10,"./sha256":11,"buffer":3}],8:[function(_dereq_,module,exports){
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

var helpers = _dereq_('./helpers');

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

module.exports = function md5(buf) {
  return helpers.hash(buf, core_md5, 16);
};

},{"./helpers":6}],9:[function(_dereq_,module,exports){
// Original code adapted from Robert Kieffer.
// details at https://github.com/broofa/node-uuid
(function() {
  var _global = this;

  var mathRNG, whatwgRNG;

  // NOTE: Math.random() does not guarantee "cryptographic quality"
  mathRNG = function(size) {
    var bytes = new Array(size);
    var r;

    for (var i = 0, r; i < size; i++) {
      if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
      bytes[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return bytes;
  }

  if (_global.crypto && crypto.getRandomValues) {
    whatwgRNG = function(size) {
      var bytes = new Uint8Array(size);
      crypto.getRandomValues(bytes);
      return bytes;
    }
  }

  module.exports = whatwgRNG || mathRNG;

}())

},{}],10:[function(_dereq_,module,exports){
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

var helpers = _dereq_('./helpers');

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

module.exports = function sha1(buf) {
  return helpers.hash(buf, core_sha1, 20, true);
};

},{"./helpers":6}],11:[function(_dereq_,module,exports){

/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var helpers = _dereq_('./helpers');

var safe_add = function(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
};

var S = function(X, n) {
  return (X >>> n) | (X << (32 - n));
};

var R = function(X, n) {
  return (X >>> n);
};

var Ch = function(x, y, z) {
  return ((x & y) ^ ((~x) & z));
};

var Maj = function(x, y, z) {
  return ((x & y) ^ (x & z) ^ (y & z));
};

var Sigma0256 = function(x) {
  return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
};

var Sigma1256 = function(x) {
  return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
};

var Gamma0256 = function(x) {
  return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
};

var Gamma1256 = function(x) {
  return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
};

var core_sha256 = function(m, l) {
  var K = new Array(0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0xFC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x6CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2);
  var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;
  /* append padding */
  m[l >> 5] |= 0x80 << (24 - l % 32);
  m[((l + 64 >> 9) << 4) + 15] = l;
  for (var i = 0; i < m.length; i += 16) {
    a = HASH[0]; b = HASH[1]; c = HASH[2]; d = HASH[3]; e = HASH[4]; f = HASH[5]; g = HASH[6]; h = HASH[7];
    for (var j = 0; j < 64; j++) {
      if (j < 16) {
        W[j] = m[j + i];
      } else {
        W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
      }
      T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
      T2 = safe_add(Sigma0256(a), Maj(a, b, c));
      h = g; g = f; f = e; e = safe_add(d, T1); d = c; c = b; b = a; a = safe_add(T1, T2);
    }
    HASH[0] = safe_add(a, HASH[0]); HASH[1] = safe_add(b, HASH[1]); HASH[2] = safe_add(c, HASH[2]); HASH[3] = safe_add(d, HASH[3]);
    HASH[4] = safe_add(e, HASH[4]); HASH[5] = safe_add(f, HASH[5]); HASH[6] = safe_add(g, HASH[6]); HASH[7] = safe_add(h, HASH[7]);
  }
  return HASH;
};

module.exports = function sha256(buf) {
  return helpers.hash(buf, core_sha256, 32, true);
};

},{"./helpers":6}],12:[function(_dereq_,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],13:[function(_dereq_,module,exports){
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var crypto = _dereq_('crypto');

var defineProperty = Object.defineProperty;
function next() {
  return "@@symbol:" + crypto.randomBytes(8).toString('hex');
}


function Symbol(desc) {
  if (!(this instanceof Symbol)) {
    return new Symbol(desc);
  }
  var _symbol = this._symbol = next();
  defineProperty(this, '_desc', {
    value: desc,
    enumerable: false,
    writable: false,
    configurable: false
  });
  defineProperty(Object.prototype, _symbol, {
    set: function(value) {
      defineProperty(this, _symbol, {
        value: value,
        enumerable: false,
        writable: true
      });
    }
  });
}

Symbol.prototype.toString = function toString() {
  return this._symbol;
};

var globalSymbolRegistry = {};
Symbol.for = function symbolFor(key) {
  key = String(key);
  return globalSymbolRegistry[key] || (globalSymbolRegistry[key] = Symbol(key));
};

Symbol.keyFor = function keyFor(sym) {
  if (!(sym instanceof Symbol)) {
    throw new TypeError("Symbol.keyFor requires a Symbol argument");
  }
  for (var key in globalSymbolRegistry) {
    if (globalSymbolRegistry[key] === sym) {
      return key;
    }
  }
  return undefined;
};

module.exports = this.Symbol || Symbol;

},{"crypto":7}],14:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = extend;
function extend(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || typeof add !== 'object') return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
}

},{}],15:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var GrammarDecl = _dereq_('./GrammarDecl');
var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Builder() {}

Builder.prototype = {
  newGrammar: function(name) {
    return new GrammarDecl(name);
  },

  anything: function() {
    return pexprs.anything;
  },

  end: function() {
    return pexprs.end;
  },

  prim: function(x) {
    return pexprs.makePrim(x);
  },

  param: function(index) {
    return new pexprs.Param(index);
  },

  alt: function(/* term1, term1, ... */) {
    var terms = [];
    for (var idx = 0; idx < arguments.length; idx++) {
      var arg = arguments[idx];
      if (arg instanceof pexprs.Alt) {
        terms = terms.concat(arg.terms);
      } else {
        terms.push(arg);
      }
    }
    return terms.length === 1 ? terms[0] : new pexprs.Alt(terms);
  },

  seq: function(/* factor1, factor2, ... */) {
    var factors = [];
    for (var idx = 0; idx < arguments.length; idx++) {
      var arg = arguments[idx];
      if (arg instanceof pexprs.Seq) {
        factors = factors.concat(arg.factors);
      } else {
        factors.push(arg);
      }
    }
    return factors.length === 1 ? factors[0] : new pexprs.Seq(factors);
  },

  star: function(expr) {
    return new pexprs.Star(expr);
  },

  plus: function(expr) {
    return new pexprs.Plus(expr);
  },

  opt: function(expr) {
    return new pexprs.Opt(expr);
  },

  not: function(expr) {
    return new pexprs.Not(expr);
  },

  la: function(expr) {
    return new pexprs.Lookahead(expr);
  },

  arr: function(expr) {
    return new pexprs.Arr(expr);
  },

  str: function(expr) {
    return new pexprs.Str(expr);
  },

  obj: function(properties, isLenient) {
    return new pexprs.Obj(properties, !!isLenient);
  },

  app: function(ruleName, optParams) {
    return new pexprs.Apply(ruleName, optParams);
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Builder;

},{"./GrammarDecl":17,"./pexprs":44}],16:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var InputStream = _dereq_('./InputStream');
var Interval = _dereq_('./Interval');
var MatchResult = _dereq_('./MatchResult');
var Semantics = _dereq_('./Semantics');
var State = _dereq_('./State');
var common = _dereq_('./common');
var errors = _dereq_('./errors');
var nodes = _dereq_('./nodes');
var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Grammar(name, superGrammar, ruleDict, optDefaultStartRule) {
  this.name = name;
  this.superGrammar = superGrammar;
  this.ruleDict = ruleDict;
  if (optDefaultStartRule) {
    if (!(optDefaultStartRule in ruleDict)) {
      throw new Error("Invalid start rule: '" + optDefaultStartRule +
                      "' is not a rule in grammar '" + name + "'");
    }
    this.defaultStartRule = optDefaultStartRule;
  }
  this.constructors = this.ctors = this.createConstructors();
}

Grammar.prototype = {
  construct: function(ruleName, children) {
    var body = this.ruleDict[ruleName];
    if (!body || !body.check(this, children) || children.length !== body.getArity()) {
      throw new errors.InvalidConstructorCall(this, ruleName, children);
    }
    var interval = new Interval(InputStream.newFor(children), 0, children.length);
    return new nodes.Node(this, ruleName, children, interval);
  },

  createConstructors: function() {
    var self = this;
    var constructors = {};

    function makeConstructor(ruleName) {
      return function(/* val1, val2, ... */) {
        return self.construct(ruleName, Array.prototype.slice.call(arguments));
      };
    }

    for (var ruleName in this.ruleDict) {
      // We want *all* properties, not just own properties, because of
      // supergrammars.
      constructors[ruleName] = makeConstructor(ruleName);
    }
    return constructors;
  },

  // Return true if the grammar is a built-in grammar, otherwise false.
  // NOTE: This might give an unexpected result if called before BuiltInRules is defined!
  isBuiltIn: function() {
    return this === Grammar.ProtoBuiltInRules || this === Grammar.BuiltInRules;
  },

  match: function(obj, optStartRule) {
    var startRule = optStartRule || this.defaultStartRule;
    if (!startRule) {
      throw new Error('Missing start rule argument -- the grammar has no default start rule.');
    }
    var state = this._match(obj, startRule, false);
    return MatchResult.newFor(state);
  },

  _match: function(obj, startRule, tracingEnabled) {
    var inputStream = InputStream.newFor(typeof obj === 'string' ? obj : [obj]);
    var state = new State(this, inputStream, startRule, tracingEnabled);
    var succeeded = new pexprs.Apply(startRule).eval(state);
    if (succeeded) {
      // Link every CSTNode to its parent.
      var stack = [undefined];
      var helpers = this.semantics().addOperation('setParents', {
        _terminal: function() {
          this._node.parent = stack[stack.length - 1];
        },
        _default: function(children) {
          stack.push(this._node);
          children.forEach(function(child) { child.setParents(); });
          stack.pop();
          this._node.parent = stack[stack.length - 1];
        }
      });
      helpers(MatchResult.newFor(state)).setParents();
    }
    return state;
  },

  trace: function(obj, optStartRule) {
    var startRule = optStartRule || this.defaultStartRule;
    if (!startRule) {
      throw new Error('Missing start rule argument -- the grammar has no default start rule.');
    }
    var state = this._match(obj, startRule, true);

    var rootTrace = state.trace[0];
    rootTrace.state = state;
    rootTrace.result = MatchResult.newFor(state);
    return rootTrace;
  },

  semantics: function() {
    return Semantics.createSemantics(this);
  },

  extendSemantics: function(superSemantics) {
    return Semantics.createSemantics(this, superSemantics._getSemantics());
  },

  // Check that every key in `actionDict` corresponds to a semantic action, and that it maps to
  // a function of the correct arity. If not, throw an exception.
  _checkTopDownActionDict: function(what, name, actionDict) {
    function isSpecialAction(name) {
      return name === '_terminal' || name === '_default';
    }

    var problems = [];
    for (var k in actionDict) {
      var v = actionDict[k];
      if (!isSpecialAction(k) && !(k in this.ruleDict)) {
        problems.push("'" + k + "' is not a valid semantic action for '" + this.name + "'");
      } else if (typeof v !== 'function') {
        problems.push(
            "'" + k + "' must be a function in an action dictionary for '" + this.name + "'");
      } else {
        var actual = v.length;
        var expected = this._topDownActionArity(k);
        if (actual !== expected) {
          problems.push(
              "Semantic action '" + k + "' has the wrong arity: " +
              'expected ' + expected + ', got ' + actual);
        }
      }
    }
    if (problems.length > 0) {
      var prettyProblems = problems.map(function(problem) { return '- ' + problem; });
      var error = new Error(
          "Found errors in the action dictionary of the '" + name + "' " + what + ':\n' +
          prettyProblems.join('\n'));
      error.problems = problems;
      throw error;
    }
  },

  // Return the expected arity for a semantic action named `actionName`, which
  // is either a rule name or a special action name like '_default'.
  _topDownActionArity: function(actionName) {
    if (actionName === '_default') {
      return 1;
    } else if (actionName === '_terminal') {
      return 0;
    }
    return this.ruleDict[actionName].getArity();
  },

  _inheritsFrom: function(grammar) {
    var g = this.superGrammar;
    while (g) {
      if (g === grammar) {
        return true;
      }
      g = g.superGrammar;
    }
    return false;
  },

  toRecipe: function(optVarName) {
    if (this.isBuiltIn()) {
      throw new Error(
          'Why would anyone want to generate a recipe for the ' + this.name + ' grammar?!?!');
    }

    var sb = new common.StringBuffer();
    if (optVarName) {
      sb.append('var ' + optVarName + ' = ');
    }
    sb.append('(function() {\n');

    // Include the supergrammar in the recipe if it's not a built-in grammar.
    var superGrammarDecl = '';
    if (!this.superGrammar.isBuiltIn()) {
      sb.append(this.superGrammar.toRecipe('buildSuperGrammar'));
      superGrammarDecl = '    .withSuperGrammar(buildSuperGrammar.call(this))\n';
    }
    sb.append('  return new this.newGrammar(' + common.toStringLiteral(this.name) + ')\n');
    sb.append(superGrammarDecl);

    if (this.defaultStartRule) {
      sb.append("    .withDefaultStartRule('" + this.defaultStartRule + "')\n");
    }

    var self = this;
    Object.keys(this.ruleDict).forEach(function(ruleName) {
      var body = self.ruleDict[ruleName];
      sb.append('    .');
      if (self.superGrammar.ruleDict[ruleName]) {
        sb.append(body instanceof pexprs.Extend ? 'extend' : 'override');
      } else {
        sb.append('define');
      }
      var formals = '[' + body.formals.map(common.toStringLiteral).join(', ') + ']';
      sb.append('(' + common.toStringLiteral(ruleName) + ', ' + formals + ', ');
      body.outputRecipe(sb, body.formals);
      if (body.description) {
        sb.append(', ' + common.toStringLiteral(body.description));
      }
      sb.append(')\n');
    });
    sb.append('    .build();\n});\n');
    return sb.contents();
  },

  // TODO: Come up with better names for these methods.
  // TODO: Write the analog of these methods for inherited attributes.
  toOperationActionDictionaryTemplate: function() {
    return this._toOperationOrAttributeActionDictionaryTemplate();
  },
  toAttributeActionDictionaryTemplate: function() {
    return this._toOperationOrAttributeActionDictionaryTemplate();
  },

  _toOperationOrAttributeActionDictionaryTemplate: function() {
    // TODO: add the super-grammar's templates at the right place, e.g., a case for AddExpr_plus
    // should appear next to other cases of AddExpr.

    var self = this;
    var sb = new common.StringBuffer();
    sb.append('{');

    var first = true;
    for (var ruleName in this.ruleDict) {
      if (ruleName === 'spaces_') {
        // This rule is not for the user, it's more of an implementation detail of syntactic rules.
        continue;
      }
      var body = this.ruleDict[ruleName];
      if (first) {
        first = false;
      } else {
        sb.append(',');
      }
      sb.append('\n');
      sb.append('  ');
      this.addSemanticActionTemplate(ruleName, body, sb);
    }

    sb.append('\n}');
    return sb.contents();
  },

  addSemanticActionTemplate: function(ruleName, body, sb) {
    sb.append(ruleName);
    sb.append(': function(');
    var arity = this._topDownActionArity(ruleName);
    sb.append(common.repeat('_', arity).join(', '));
    sb.append(') {\n');
    sb.append('  }');
  }
};

// The following grammar contains a few rules that couldn't be written  in "userland".
// At the bottom of src/main.js, we create a sub-grammar of this grammar that's called
// `BuiltInRules`. That grammar contains several convenience rules, e.g., `letter` and
// `digit`, and is implicitly the super-grammar of any grammar whose super-grammar
// isn't specified.
Grammar.ProtoBuiltInRules = new Grammar('ProtoBuiltInRules', undefined, {
  // The following rules can't be written in userland because they reference
  // `anything` and `end` directly.
  _: pexprs.anything.withFormals([]),
  end: pexprs.end.withFormals([]),

  // The following rule is part of the Ohm implementation. Its name ends with '_' to
  // discourage programmers from invoking, extending, and overriding it.
  spaces_: new pexprs.Star(new pexprs.Apply('space')).withFormals([]),

  // The `space` rule must be defined here because it's referenced by `spaces_`.
  space: pexprs.makePrim(/[\s]/).withFormals([]).withDescription('a space')
});

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Grammar;

},{"./InputStream":18,"./Interval":19,"./MatchResult":20,"./Semantics":23,"./State":24,"./common":26,"./errors":27,"./nodes":29,"./pexprs":44}],17:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Grammar = _dereq_('./Grammar');
var common = _dereq_('./common');
var errors = _dereq_('./errors');
var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------

// Constructors

function GrammarDecl(name) {
  this.name = name;
}

// Helpers

function onOhmError(doFn, onErrorFn) {
  try {
    doFn();
  } catch (e) {
    if (e instanceof errors.Error) {
      onErrorFn(e);
    } else {
      throw e;
    }
  }
}

GrammarDecl.prototype.ensureSuperGrammar = function() {
  if (!this.superGrammar) {
    this.withSuperGrammar(
        // TODO: The conditional expression below is an ugly hack. It's kind of ok because
        // I doubt anyone will ever try to declare a grammar called `BuiltInRules`. Still,
        // we should try to find a better way to do this.
        this.name === 'BuiltInRules' ?
            Grammar.ProtoBuiltInRules :
            Grammar.BuiltInRules);
  }
  return this.superGrammar;
};

GrammarDecl.prototype.installOverriddenOrExtendedRule = function(name, formals, body) {
  var duplicateParameterNames = common.getDuplicates(formals);
  if (duplicateParameterNames.length > 0) {
    throw new errors.DuplicateParameterNames(name, duplicateParameterNames);
  }
  var baseRule = this.ensureSuperGrammar().ruleDict[name];
  if (formals.length !== baseRule.formals.length) {
    throw new errors.WrongNumberOfParameters(name, baseRule.formals.length, formals.length);
  }
  return this.install(name, formals, baseRule.description, body);
};

GrammarDecl.prototype.install = function(name, formals, description, body) {
  body = body.introduceParams(formals);
  body.formals = formals;
  body.description = description;
  this.ruleDict[name] = body;
  return this;
};

// Stuff that you should only do once

GrammarDecl.prototype.withSuperGrammar = function(superGrammar) {
  if (this.superGrammar) {
    throw new Error('the super grammar of a GrammarDecl cannot be set more than once');
  }
  this.superGrammar = superGrammar;
  this.ruleDict = Object.create(superGrammar.ruleDict);

  // Grammars with an explicit supergrammar inherit a default start rule.
  if (!superGrammar.isBuiltIn()) {
    this.defaultStartRule = superGrammar.defaultStartRule;
  }
  return this;
};

GrammarDecl.prototype.withDefaultStartRule = function(ruleName) {
  this.defaultStartRule = ruleName;
  return this;
};

// Creates a Grammar instance, and if it passes the sanity checks, returns it.
GrammarDecl.prototype.build = function() {
  var grammar =
      new Grammar(this.name, this.ensureSuperGrammar(), this.ruleDict, this.defaultStartRule);
  // TODO: change the pexpr.prototype.assert... methods to make them add
  // exceptions to an array that's provided as an arg. Then we'll be able to
  // show more than one error of the same type at a time.
  // TODO: include the offending pexpr in the errors, that way we can show
  // the part of the source that caused it.
  var grammarErrors = [];
  var grammarHasInvalidApplications = false;
  Object.keys(grammar.ruleDict).forEach(function(ruleName) {
    var body = grammar.ruleDict[ruleName];
    onOhmError(
        function() { body.assertChoicesHaveUniformArity(ruleName); },
        function(e) { grammarErrors.push(e); });
    onOhmError(
        function() { body.assertAllApplicationsAreValid(grammar); },
        function(e) {
          grammarErrors.push(e);
          grammarHasInvalidApplications = true;
        });
  });
  if (!grammarHasInvalidApplications) {
    // The following check can only be done if the grammar has no invalid applications.
    Object.keys(grammar.ruleDict).forEach(function(ruleName) {
      var body = grammar.ruleDict[ruleName];
      onOhmError(
          function() { body.assertIteratedExprsAreNotNullable(grammar, ruleName); },
          function(e) { grammarErrors.push(e); });
    });
  }
  if (grammarErrors.length > 0) {
    errors.throwErrors(grammarErrors);
  }
  return grammar;
};

// Rule declarations

GrammarDecl.prototype.define = function(name, formals, body, optDescr) {
  this.ensureSuperGrammar();
  if (this.superGrammar.ruleDict[name]) {
    throw new errors.DuplicateRuleDeclaration(name, this.name, this.superGrammar.name);
  } else if (this.ruleDict[name]) {
    throw new errors.DuplicateRuleDeclaration(name, this.name, this.name);
  }
  var duplicateParameterNames = common.getDuplicates(formals);
  if (duplicateParameterNames.length > 0) {
    throw new errors.DuplicateParameterNames(name, duplicateParameterNames);
  }
  return this.install(name, formals, optDescr, body);
};

GrammarDecl.prototype.override = function(name, formals, body) {
  var baseRule = this.ensureSuperGrammar().ruleDict[name];
  if (!baseRule) {
    throw new errors.CannotOverrideUndeclaredRule(name, this.superGrammar.name);
  }
  this.installOverriddenOrExtendedRule(name, formals, body);
  return this;
};

GrammarDecl.prototype.extend = function(name, formals, body) {
  var baseRule = this.ensureSuperGrammar().ruleDict[name];
  if (!baseRule) {
    throw new errors.CannotExtendUndeclaredRule(name, this.superGrammar.name);
  }
  this.installOverriddenOrExtendedRule(
      name, formals, new pexprs.Extend(this.superGrammar, name, body));
  return this;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = GrammarDecl;

},{"./Grammar":16,"./common":26,"./errors":27,"./pexprs":44}],18:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common');
var Interval = _dereq_('./Interval');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function InputStream() {
  throw new Error('InputStream cannot be instantiated -- it\'s abstract');
}

InputStream.newFor = function(obj) {
  if (typeof obj === 'string') {
    return new StringInputStream(obj);
  } else if (Array.isArray(obj)) {
    return new ListInputStream(obj);
  } else if (obj instanceof InputStream) {
    return obj;
  } else {
    throw new Error('cannot make input stream for ' + obj);
  }
};

InputStream.prototype = {
  init: function(source) {
    this.source = source;
    this.pos = 0;
    this.posInfos = [];
  },

  atEnd: function() {
    return this.pos === this.source.length;
  },

  next: function() {
    if (this.atEnd()) {
      return common.fail;
    } else {
      return this.source[this.pos++];
    }
  },

  matchExactly: function(x) {
    return this.next() === x ? true : common.fail;
  },

  sourceSlice: function(startIdx, endIdx) {
    return this.source.slice(startIdx, endIdx);
  },

  intervalFrom: function(startIdx) {
    return new Interval(this, startIdx, this.pos);
  }
};

function StringInputStream(source) {
  this.init(source);
}

StringInputStream.prototype = Object.create(InputStream.prototype, {
  matchString: {
    value: function(s) {
      for (var idx = 0; idx < s.length; idx++) {
        if (this.matchExactly(s[idx]) === common.fail) {
          return common.fail;
        }
      }
      return true;
    }
  },

  matchRegExp: {
    value: function(e) {
      // IMPORTANT: e must be a non-global, one-character expression, e.g., /./ and /[0-9]/
      var c = this.next();
      return c !== common.fail && e.test(c) ? true : common.fail;
    }
  }
});

function ListInputStream(source) {
  this.init(source);
}

ListInputStream.prototype = Object.create(InputStream.prototype, {
  matchString: {
    value: function(s) {
      return this.matchExactly(s);
    }
  },

  matchRegExp: {
    value: function(e) {
      return this.matchExactly(e);
    }
  }
});

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = InputStream;


},{"./Interval":19,"./common":26}],19:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var errors = _dereq_('./errors');
var util = _dereq_('./util');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Interval(inputStream, startIdx, endIdx) {
  this.inputStream = inputStream;
  this.startIdx = startIdx;
  this.endIdx = endIdx;
}

Interval.coverage = function(/* interval1, interval2, ... */) {
  var inputStream = arguments[0].inputStream;
  var startIdx = arguments[0].startIdx;
  var endIdx = arguments[0].endIdx;
  for (var idx = 1; idx < arguments.length; idx++) {
    var interval = arguments[idx];
    if (interval.inputStream !== inputStream) {
      throw new errors.IntervalSourcesDontMatch();
    } else {
      startIdx = Math.min(startIdx, arguments[idx].startIdx);
      endIdx = Math.max(endIdx, arguments[idx].endIdx);
    }
  }
  return new Interval(inputStream, startIdx, endIdx);
};

Interval.prototype = {
  coverageWith: function(/* interval1, interval2, ... */) {
    var intervals = Array.prototype.slice.call(arguments);
    intervals.push(this);
    return Interval.coverage.apply(undefined, intervals);
  },

  collapsedLeft: function() {
    return new Interval(this.inputStream, this.startIdx, this.startIdx);
  },

  collapsedRight: function() {
    return new Interval(this.inputStream, this.endIdx, this.endIdx);
  },

  getLineAndColumnMessage: function() {
    return util.getLineAndColumnMessage(this.inputStream.source, this.startIdx);
  },

  // Returns a new Interval which contains the same contents as this one,
  // but with whitespace trimmed from both ends. (This only makes sense when
  // the input stream is a string.)
  trimmed: function() {
    var contents = this.contents;
    var startIdx = this.startIdx + contents.match(/^\s*/)[0].length;
    var endIdx = this.endIdx - contents.match(/\s*$/)[0].length;
    return new Interval(this.inputStream, startIdx, endIdx);
  }
};

Object.defineProperties(Interval.prototype, {
  contents: {
    get: function() {
      if (this._contents === undefined) {
        this._contents = this.inputStream.sourceSlice(this.startIdx, this.endIdx);
      }
      return this._contents;
    },
    enumerable: true
  }
});

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Interval;


},{"./errors":27,"./util":45}],20:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var inherits = _dereq_('inherits');

var common = _dereq_('./common');
var util = _dereq_('./util');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// Create a short error message for an error that occurred during matching.
function getShortMatchErrorMessage(pos, source, detail) {
  var errorInfo = util.getLineAndColumn(source, pos);
  return 'Line ' + errorInfo.lineNum + ', col ' + errorInfo.colNum + ': ' + detail;
}

// ----------------- MatchFailure -----------------

function MatchResult(state) {
  this.state = state;
  this._cst = state.bindings[0];
}

MatchResult.newFor = function(state) {
  var succeeded = state.bindings.length === 1;
  return succeeded ? new MatchResult(state) : new MatchFailure(state);
};

MatchResult.prototype.failed = function() {
  return false;
};

MatchResult.prototype.succeeded = function() {
  return !this.failed();
};

// ----------------- MatchFailure -----------------

function MatchFailure(state) {
  this.state = state;
  common.defineLazyProperty(this, '_exprsAndStacks', function() {
    return this.state.getFailures();
  });
  common.defineLazyProperty(this, 'message', function() {
    var source = this.state.inputStream.source;
    if (typeof source !== 'string') {
      return 'match failed at position ' + this.getPos();
    }

    var detail = 'Expected ' + this.getExpectedText();
    return util.getLineAndColumnMessage(source, this.getPos()) + detail;
  });
  common.defineLazyProperty(this, 'shortMessage', function() {
    if (typeof this.state.inputStream.source !== 'string') {
      return 'match failed at position ' + this.getPos();
    }
    var detail = 'expected ' + this.getExpectedText();
    return getShortMatchErrorMessage(this.getPos(), this.state.inputStream.source, detail);
  });
}
inherits(MatchFailure, MatchResult);

MatchFailure.prototype.toString = function() {
  return '[MatchFailure at position ' + this.getPos() + ']';
};

MatchFailure.prototype.failed = function() {
  return true;
};

MatchFailure.prototype.getPos = function() {
  return this.state.getFailuresPos();
};

// Return a string summarizing the expected contents of the input stream when
// the match failure occurred.
MatchFailure.prototype.getExpectedText = function() {
  var sb = new common.StringBuffer();
  var expected = this.getExpected();
  for (var idx = 0; idx < expected.length; idx++) {
    if (idx > 0) {
      if (idx === expected.length - 1) {
        sb.append((expected.length > 2 ? ', or ' : ' or '));
      } else {
        sb.append(', ');
      }
    }
    sb.append(expected[idx]);
  }
  return sb.contents();
};

// Return an Array of unique strings representing the terminals or rules that
// were expected to be matched.
MatchFailure.prototype.getExpected = function() {
  var expected = {};
  var ruleDict = this.state.grammar.ruleDict;
  this._exprsAndStacks.forEach(function(obj) {
    expected[obj.expr.toExpected(ruleDict)] = true;
  });
  return Object.keys(expected);
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = MatchResult;

},{"./common":26,"./util":45,"inherits":12}],21:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var extend = _dereq_('util-extend');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Namespace() {
}
Namespace.prototype = Object.create(null);

Namespace.asNamespace = function(objOrNamespace) {
  if (objOrNamespace instanceof Namespace) {
    return objOrNamespace;
  }
  return Namespace.createNamespace(objOrNamespace);
};

// Create a new namespace. If `optProps` is specified, all of its properties
// will be copied to the new namespace.
Namespace.createNamespace = function(optProps) {
  return Namespace.extend(Namespace.prototype, optProps);
};

// Create a new namespace which extends another namespace. If `optProps` is
// specified, all of its properties will be copied to the new namespace.
Namespace.extend = function(namespace, optProps) {
  if (namespace !== Namespace.prototype && !(namespace instanceof Namespace)) {
    throw new TypeError('not a Namespace object: ' + namespace);
  }
  var ns = Object.create(namespace, {
    constructor: {
      value: Namespace,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  return extend(ns, optProps);
};

// TODO: Should this be a regular method?
Namespace.toString = function(ns) {
  return Object.prototype.toString.call(ns);
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Namespace;

},{"util-extend":14}],22:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function PosInfo(globalApplicationStack) {
  this.globalApplicationStack = globalApplicationStack;
  this.applicationStack = [];
  // Redundant (could be generated from applicationStack) but useful for performance reasons.
  this.activeApplications = {};
  this.memo = {};
}

PosInfo.prototype = {
  isActive: function(application) {
    return this.activeApplications[application.toMemoKey()];
  },

  enter: function(application) {
    this.globalApplicationStack.push(application);
    this.applicationStack.push(application);
    this.activeApplications[application.toMemoKey()] = true;
  },

  exit: function() {
    var application = this.globalApplicationStack.pop();
    this.applicationStack.pop();
    this.activeApplications[application.toMemoKey()] = false;
  },

  shouldUseMemoizedResult: function(memoRec) {
    var involvedApplications = memoRec.involvedApplications;
    for (var memoKey in involvedApplications) {
      if (involvedApplications[memoKey] && this.activeApplications[memoKey]) {
        return false;
      }
    }
    return true;
  },

  getCurrentLeftRecursion: function() {
    if (this.leftRecursionStack) {
      return this.leftRecursionStack[this.leftRecursionStack.length - 1];
    }
  },

  startLeftRecursion: function(application) {
    if (!this.leftRecursionStack) {
      this.leftRecursionStack = [];
    }
    this.leftRecursionStack.push({
        memoKey: application.toMemoKey(),
        value: false,
        pos: -1,
        involvedApplications: {}});
    this.updateInvolvedApplications();
  },

  endLeftRecursion: function(application) {
    this.leftRecursionStack.pop();
  },

  updateInvolvedApplications: function() {
    var currentLeftRecursion = this.getCurrentLeftRecursion();
    var involvedApplications = currentLeftRecursion.involvedApplications;
    var lrApplicationMemoKey = currentLeftRecursion.memoKey;
    var idx = this.applicationStack.length - 1;
    while (true) {
      var memoKey = this.applicationStack[idx--].toMemoKey();
      if (memoKey === lrApplicationMemoKey) {
        break;
      }
      involvedApplications[memoKey] = true;
    }
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = PosInfo;

},{}],23:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Symbol = _dereq_('symbol');  // eslint-disable-line no-undef
var inherits = _dereq_('inherits');

var MatchResult = _dereq_('./MatchResult');
var common = _dereq_('./common');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// ----------------- Wrappers -----------------

// Wrappers decorate CST nodes with all of the functionality (i.e., operations and attributes)
// provided by a Semantics (see below). `Wrapper` is the abstract superclass of all wrappers. A
// `Wrapper` must have `_node` and `_semantics` instance variables, which refer to the CST node and
// Semantics (resp.) for which it was created, and a `_childWrappers` instance variable which is
// used to cache the wrapper instances that are created for its child nodes. Setting these instance
// variables is the responsibility of the constructor of each Semantics-specific subclass of
// `Wrapper`.
function Wrapper() {}

Wrapper.prototype.toString = function() {
  return '[semantics wrapper for ' + this._node.grammar.name + ']';
};

// Returns the wrapper of the specified child node. Child wrappers are created lazily and cached in
// the parent wrapper's `_childWrappers` instance variable.
Wrapper.prototype.child = function(idx) {
  if (!(0 <= idx && idx < this._node.numChildren())) {
    // TODO: Consider throwing an exception here.
    return undefined;
  }
  var childWrapper = this._childWrappers[idx];
  if (!childWrapper) {
    childWrapper = this._childWrappers[idx] = this._semantics.wrap(this._node.childAt(idx));
  }
  return childWrapper;
};

// Returns an array containing the wrappers of all of the children of the node associated with this
// wrapper.
Wrapper.prototype._children = function() {
  // Force the creation of all child wrappers
  for (var idx = 0; idx < this._node.numChildren(); idx++) {
    this.child(idx);
  }
  return this._childWrappers;
};

// Returns the wrapper of the first child node. Throws an exception if the node associated with this
// wrapper doesn't have exactly one child.
Wrapper.prototype._onlyChild = function() {
  if (this._node.numChildren() !== 1) {
    throw new Error(
        'cannot get only child of a node of type ' + this.ctorName() +
        ' (it has ' + this._node.numChildren() + ' children)');
  } else {
    return this.child(0);
  }
};

// Returns `true` if the CST node associated with this wrapper corresponds to an iteration
// expression, i.e., a Kleene-*, Kleene-+, or an optional. Returns `false` otherwise.
Wrapper.prototype.isIteration = function() {
  return this._node.ctorName === '_iter';
};

// Returns `true` if the CST node associated with this wrapper is a terminal node, `false`
// otherwise.
Wrapper.prototype.isTerminal = function() {
  return this._node.isTerminal();
};

Object.defineProperties(Wrapper.prototype, {
  // Returns an array containing the children of this CST node.
  children: {get: function() { return this._children(); }},

  // Returns the name of grammar rule that created this CST node.
  ctorName: {get: function() { return this._node.ctorName; }},

  // Returns the interval consumed by the CST node associated with this wrapper.
  interval: {get: function() { return this._node.interval; }},

  // Returns the number of children of this CST node.
  numChildren: {get: function() { return this._node.numChildren(); }},

  // Returns the primitive value of this CST node, if it's a terminal node. Otherwise,
  // throws an exception.
  primitiveValue: {
    get: function() {
      if (this.isTerminal()) {
        return this._node.primitiveValue;
      }
      throw new TypeError(
          "tried to access the 'primitiveValue' attribute of a non-terminal CST node");
    }
  }
});

// ----------------- Semantics -----------------

// A Semantics is a container for a family of Operations and Attributes for a given grammar.
// Semantics enable modularity (different clients of a grammar can create their set of operations
// and attributes in isolation) and extensibility even when operations and attributes are mutually-
// recursive. This constructor should not be called directly except from
// `Semantics.createSemantics`. The normal ways to create a Semantics, given a grammar 'g', are
// `g.semantics()` and `g.extendSemantics(parentSemantics)`.
function Semantics(grammar, optSuperSemantics) {
  var self = this;
  this.grammar = grammar;
  this.checkedActionDicts = false;

  // Constructor for wrapper instances, which are passed as the arguments to the semantic actions
  // of an operation or attribute. Operations and attributes require double dispatch: the semantic
  // action is chosen based on both the node's type and the semantics. Wrappers ensure that
  // the `execute` method is called with the correct (most specific) semantics object as an
  // argument.
  this.Wrapper = function(node) {
    self.checkActionDictsIfHaventAlready();
    this._semantics = self;
    this._node = node;
    this._childWrappers = [];
  };

  if (optSuperSemantics) {
    this.super = optSuperSemantics;
    if (grammar !== this.super.grammar && !grammar._inheritsFrom(this.super.grammar)) {
      throw new Error(
          "Cannot extend a semantics for grammar '" + this.super.grammar.name +
          "' for use with grammar '" + grammar.name + "' (not a sub-grammar)");
    }
    inherits(this.Wrapper, this.super.Wrapper);
    this.operations = Object.create(this.super.operations);
    this.attributes = Object.create(this.super.attributes);
    this.attributeKeys = Object.create(null);

    // Assign unique symbols for each of the attributes inherited from the super-semantics so that
    // they are memoized independently.
    for (var attributeName in this.attributes) {
      this.attributeKeys[attributeName] = Symbol();
    }
  } else {
    inherits(this.Wrapper, Wrapper);
    this.operations = Object.create(null);
    this.attributes = Object.create(null);
    this.attributeKeys = Object.create(null);
  }
}

Semantics.prototype.toString = function() {
  return '[semantics for ' + this.grammar.name + ']';
};

Semantics.prototype.checkActionDictsIfHaventAlready = function() {
  if (!this.checkedActionDicts) {
    this.checkActionDicts();
    this.checkedActionDicts = true;
  }
};

// Checks that the action dictionaries for all operations and attributes in this semantics,
// including the ones that were inherited from the super-semantics, agree with the grammar.
// Throws an exception if one or more of them doesn't.
Semantics.prototype.checkActionDicts = function() {
  for (var name in this.operations) {
    this.operations[name].checkActionDict(this.grammar);
  }
  for (name in this.attributes) {
    this.attributes[name].checkActionDict(this.grammar);
  }
};

Semantics.prototype.addOperationOrAttribute = function(type, name, actionDict) {
  var typePlural = type + 's';
  var Ctor = type === 'operation' ? Operation : Attribute;

  this.assertNewName(name, type);
  this[typePlural][name] = new Ctor(name, actionDict);

  // The following check is not strictly necessary (it will happen later anyway) but it's better to
  // catch errors early.
  this[typePlural][name].checkActionDict(this.grammar);

  function doIt() {
    // Dispatch to most specific version of this operation / attribute -- it may have been
    // overridden by a sub-semantics.
    var thisThing = this._semantics[typePlural][name];
    return thisThing.execute(this._semantics, this);
  }

  if (type === 'operation') {
    this.Wrapper.prototype[name] = doIt;
    this.Wrapper.prototype[name].toString = function() {
      return '[' + name + ' operation]';
    };
  } else {
    Object.defineProperty(this.Wrapper.prototype, name, {get: doIt});
    this.attributeKeys[name] = Symbol();
  }
};

Semantics.prototype.extendOperationOrAttribute = function(type, name, actionDict) {
  var typePlural = type + 's';
  var Ctor = type === 'operation' ? Operation : Attribute;

  if (!(this.super && name in this.super[typePlural])) {
    throw new Error('Cannot extend ' + type + " '" + name +
        "': did not inherit an " + type + ' with that name');
  }
  if (Object.prototype.hasOwnProperty.call(this[typePlural], name)) {
    throw new Error('Cannot extend ' + type + " '" + name + "' again");
  }

  // Create a new operation / attribute whose actionDict delegates to the super operation /
  // attribute's actionDict, and which has all the keys from `inheritedActionDict`.
  var inheritedActionDict = this[typePlural][name].actionDict;
  var newActionDict = Object.create(inheritedActionDict);
  Object.keys(actionDict).forEach(function(name) {
    newActionDict[name] = actionDict[name];
  });

  this[typePlural][name] = new Ctor(name, newActionDict);

  // The following check is not strictly necessary (it will happen later anyway) but it's better to
  // catch errors early.
  this[typePlural][name].checkActionDict(this.grammar);
};

Semantics.prototype.assertNewName = function(name, type) {
  if (Wrapper.prototype.hasOwnProperty(name)) {
    throw new Error(
        'Cannot add ' + type + " '" + name + "': that's a reserved name");
  }
  if (name in this.operations) {
    throw new Error(
        'Cannot add ' + type + " '" + name + "': an operation with that name already exists");
  }
  if (name in this.attributes) {
    throw new Error(
        'Cannot add ' + type + " '" + name + "': an attribute with that name already exists");
  }
};

// Returns a wrapper for the given CST `node` in this semantics.
Semantics.prototype.wrap = function(node) {
  return new this.Wrapper(node);
};

// Creates a new Semantics instance for `grammar`, inheriting operations and attributes from
// `optSuperSemantics`, if it is specified. Returns a function that acts as a proxy for the new
// Semantics instance. When that function is invoked with a CST node as an argument, it returns
// a wrapper for that node which gives access to the operations and attributes provided by this
// semantics.
Semantics.createSemantics = function(grammar, optSuperSemantics) {
  var s = new Semantics(grammar, optSuperSemantics);

  // To enable clients to invoke a semantics like a function, return a function that acts as a proxy
  // for `s`, which is the real `Semantics` instance.
  var proxy = function ASemantics(matchResult) {
    if (!(matchResult instanceof MatchResult)) {
      throw new TypeError(
          'Semantics expected a MatchResult, but got ' + common.unexpectedObjToString(matchResult));
    }
    if (!matchResult.succeeded()) {
      throw new TypeError(
          'cannot apply Semantics to ' + matchResult.toString());
    }

    var cst = matchResult._cst;
    if (cst.grammar !== grammar) {
      throw new Error(
          "Cannot use a CST node created by grammar '" + cst.grammar.name +
          "' with a semantics for '" + grammar.name + "'");
    }
    return s.wrap(cst);
  };

  // Forward public methods from the proxy to the semantics instance.
  proxy.addOperation = function(name, actionDict) {
    s.addOperationOrAttribute.call(s, 'operation', name, actionDict);
    return proxy;
  };
  proxy.extendOperation = function(name, actionDict) {
    s.extendOperationOrAttribute.call(s, 'operation', name, actionDict);
    return proxy;
  };
  proxy.addAttribute = function(name, actionDict) {
    s.addOperationOrAttribute.call(s, 'attribute', name, actionDict);
    return proxy;
  };
  proxy.extendAttribute = function(name, actionDict) {
    s.extendOperationOrAttribute.call(s, 'attribute', name, actionDict);
    return proxy;
  };

  // Make the proxy's toString() work.
  proxy.toString = s.toString.bind(s);

  // Returns the semantics for the proxy.
  proxy._getSemantics = function() {
    return s;
  };

  return proxy;
};

// ----------------- Default semantic actions -----------------

var actions = {
  getPrimitiveValue: function() {
    return this.primitiveValue;
  },
  passThrough: function(childNode) {
    throw new Error('BUG: ohm.actions.passThrough should never be called');
  }
};

Semantics.actions = actions;

// ----------------- Operation -----------------

// An Operation represents a function to be applied to a concrete syntax tree (CST) -- it's very
// similar to a Visitor (http://en.wikipedia.org/wiki/Visitor_pattern). An operation is executed by
// recursively walking the CST, and at each node, invoking the matching semantic action from
// `actionDict`. See `Operation.prototype.execute` for details of how a CST node's matching semantic
// action is found.
function Operation(name, actionDict) {
  this.name = name;
  this.actionDict = actionDict;
}

Operation.prototype.typeName = 'operation';

Operation.prototype.checkActionDict = function(grammar) {
  grammar._checkTopDownActionDict(this.typeName, this.name, this.actionDict);
};

// Execute this operation on the CST node associated with `nodeWrapper` in the context of the given
// Semantics instance.
Operation.prototype.execute = function(semantics, nodeWrapper) {
  if (nodeWrapper.isIteration()) {
    // This CST node corresponds to an iteration expression in the grammar (*, +, or ?), so we map
    // this operation over all of its child nodes.
    var results = [];
    for (var idx = 0; idx < nodeWrapper._node.numChildren(); idx++) {
      results.push(this.execute(semantics, nodeWrapper.child(idx)));
    }
    return results;
  }

  // Look for a semantic action whose name matches the node's constructor name, which is either the
  // name of a rule in the grammar, or the special value '_terminal'.
  var actionFn = this.actionDict[nodeWrapper._node.ctorName];
  if (actionFn) {
    return this.doAction(semantics, nodeWrapper, actionFn);
  }

  // The action dictionary does not contain a semantic action for this specific type of node, so
  // invoke the '_default' semantic action if it exists (but only if this node is not a terminal).
  var defaultActionFn = this.actionDict._default;
  if (defaultActionFn && !nodeWrapper.isTerminal()) {
    return this.doAction(semantics, nodeWrapper, defaultActionFn, true);
  }

  // The programmer hasn't written a semantic action for this type of node yet.
  throw new Error(
      'missing semantic action for ' + nodeWrapper._node.ctorName + ' in ' + this.name + ' ' +
      this.typeName);
};

// Invoke `actionFn` on the CST node that corresponds to `nodeWrapper`, in the context of
// `semantics`. If `optPassChildrenAsArray` is true, `actionFn` will be called with a single
// argument, which is an array of wrappers. Otherwise, the number of arguments to `actionFn` will
// be equal to the number of children in the CST node.
Operation.prototype.doAction = function(semantics, nodeWrapper, actionFn, optPassChildrenAsArray) {
  if (actionFn === actions.passThrough) {
    return this.execute(semantics, nodeWrapper._onlyChild());
  }
  return optPassChildrenAsArray ?
      actionFn.call(nodeWrapper, nodeWrapper._children()) :
      actionFn.apply(nodeWrapper, nodeWrapper._children());
};

// ----------------- Attribute -----------------

// Attributes are Operations whose results are memoized. This means that, for any given semantics,
// the semantic action for a CST node will be invoked no more than once.
function Attribute(name, actionDict) {
  this.name = name;
  this.actionDict = actionDict;
}
inherits(Attribute, Operation);

Attribute.prototype.typeName = 'attribute';

Attribute.prototype.execute = function(semantics, nodeWrapper) {
  var node = nodeWrapper._node;
  var key = semantics.attributeKeys[this.name];
  if (!node.hasOwnProperty(key)) {
    // The following is a super-send -- isn't JS beautiful? :/
    node[key] = Operation.prototype.execute.call(this, semantics, nodeWrapper);
  }
  return node[key];
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Semantics;

},{"./MatchResult":20,"./common":26,"inherits":12,"symbol":13}],24:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var PosInfo = _dereq_('./PosInfo');
var Trace = _dereq_('./Trace');
var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function State(grammar, inputStream, startRule, tracingEnabled) {
  this.grammar = grammar;
  this.origInputStream = inputStream;
  this.startRule = startRule;
  this.tracingEnabled = tracingEnabled;
  this.rightmostFailPos = -1;
  this.init();
}

State.prototype = {
  init: function(optFailuresArray) {
    this.inputStreamStack = [];
    this.posInfosStack = [];
    this.pushInputStream(this.origInputStream);
    this.applicationStack = [];
    this.bindings = [];
    this.failures = optFailuresArray;
    this.ignoreFailuresCount = 0;
    if (this.isTracing()) {
      this.trace = [];
    }
  },

  pushInputStream: function(inputStream) {
    this.inputStreamStack.push(this.inputStream);
    this.posInfosStack.push(this.posInfos);
    this.inputStream = inputStream;
    this.posInfos = [];
  },

  popInputStream: function() {
    this.inputStream = this.inputStreamStack.pop();
    this.posInfos = this.posInfosStack.pop();
  },

  getCurrentPosInfo: function() {
    return this.getPosInfo(this.inputStream.pos);
  },

  getPosInfo: function(pos) {
    var posInfo = this.posInfos[pos];
    return posInfo || (this.posInfos[pos] = new PosInfo(this.applicationStack));
  },

  recordFailure: function(pos, expr) {
    if (this.ignoreFailuresCount > 0) {
      return;
    }
    if (pos < this.rightmostFailPos) {
      // it would be useless to record this failure, so don't do it
      return;
    } else if (pos > this.rightmostFailPos) {
      // new rightmost failure!
      this.rightmostFailPos = pos;
    }
    if (!this.failures) {
      // we're not really recording failures, so we're done
      return;
    }

    // TODO: consider making this code more OO, e.g., add an ExprAndStacks class
    // that supports an addStack(stack) method.
    function addStack(stack, stacks) {
      for (var idx = 0; idx < stacks.length; idx++) {
        var otherStack = stacks[idx];
        if (stack.length !== otherStack.length) {
          continue;
        }
        for (var idx2 = 0; idx2 < stack.length; idx2++) {
          if (stack[idx2] !== otherStack[idx2]) {
            break;
          }
        }
        if (idx2 === stack.length) {
          // found it, no need to add
          return;
        }
      }
      stacks.push(stack);
    }

    // Another failure at right-most position -- record it if it wasn't already.
    var stack = this.applicationStack.slice();
    var exprsAndStacks = this.failures;
    for (var idx = 0; idx < exprsAndStacks.length; idx++) {
      var exprAndStacks = exprsAndStacks[idx];
      if (exprAndStacks.expr === expr) {
        addStack(stack, exprAndStacks.stacks);
        return;
      }
    }
    exprsAndStacks.push({expr: expr, stacks: [stack]});
  },

  ignoreFailures: function() {
    this.ignoreFailuresCount++;
  },

  recordFailures: function() {
    this.ignoreFailuresCount--;
  },

  getFailuresPos: function() {
    return this.rightmostFailPos;
  },

  getFailures: function() {
    if (!this.failures) {
      // Rewind, then try to match the input again, recording failures.
      this.init([]);
      this.tracingEnabled = false;
      var succeeded = new pexprs.Apply(this.startRule).eval(this);
      if (succeeded) {
        this.failures = [];
      }
    }
    return this.failures;
  },

  // Returns the memoized trace entry for `pos` and `expr`, if one exists.
  getMemoizedTraceEntry: function(pos, expr) {
    var posInfo = this.posInfos[pos];
    if (posInfo && expr.ruleName) {
      var memoRec = posInfo.memo[expr.ruleName];
      if (memoRec) {
        return memoRec.traceEntry;
      }
    }
    return null;
  },

  // Make a new trace entry, using the currently active trace array as the
  // new entry's children.
  getTraceEntry: function(pos, expr, result) {
    var entry = this.getMemoizedTraceEntry(pos, expr);
    if (!entry) {
      entry = new Trace(this.inputStream, pos, expr, result, this.trace);
    }
    return entry;
  },

  isTracing: function() {
    return this.tracingEnabled;
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = State;


},{"./PosInfo":22,"./Trace":25,"./pexprs":44}],25:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Interval = _dereq_('./Interval');
var common = _dereq_('./common');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// Unicode characters that are used in the `toString` output.
var BALLOT_X = '\u2717';
var CHECK_MARK = '\u2713';
var DOT_OPERATOR = '\u22C5';
var RIGHTWARDS_DOUBLE_ARROW = '\u21D2';
var SYMBOL_FOR_HORIZONTAL_TABULATION = '\u2409';
var SYMBOL_FOR_LINE_FEED = '\u240A';
var SYMBOL_FOR_CARRIAGE_RETURN = '\u240D';

function linkLeftRecursiveChildren(children) {
  for (var i = 0; i < children.length; ++i) {
    var child = children[i];
    var nextChild = children[i + 1];

    if (nextChild && child.expr === nextChild.expr) {
      child.replacedBy = nextChild;
    }
  }
}

function spaces(n) {
  return common.repeat(' ', n).join('');
}

// Return a string representation of a portion of `inputStream` at offset `pos`.
// The result will contain exactly `len` characters.
function getInputExcerpt(inputStream, pos, len) {
  var excerpt = asEscapedString(inputStream.sourceSlice(pos, pos + len));

  // Pad the output if necessary.
  if (excerpt.length < len) {
    return excerpt + common.repeat(' ', len - excerpt.length).join('');
  }
  return excerpt;
}

function asEscapedString(obj) {
  if (typeof obj === 'string') {
    // Replace non-printable characters with visible symbols.
    return obj
        .replace(/ /g, DOT_OPERATOR)
        .replace(/\t/g, SYMBOL_FOR_HORIZONTAL_TABULATION)
        .replace(/\n/g, SYMBOL_FOR_LINE_FEED)
        .replace(/\r/g, SYMBOL_FOR_CARRIAGE_RETURN);
  }
  return String(obj);
}

// ----------------- Trace -----------------

function Trace(inputStream, pos, expr, ans, optChildren) {
  this.children = optChildren || [];
  this.expr = expr;
  if (ans) {
    this.interval = new Interval(inputStream, pos, inputStream.pos);
  }
  this.isLeftRecursive = false;
  this.pos = pos;
  this.inputStream = inputStream;
  this.succeeded = !!ans;
}

Object.defineProperty(Trace.prototype, 'displayString', {
  get: function() { return this.expr.toDisplayString(); }
});

Trace.prototype.setLeftRecursive = function(leftRecursive) {
  this.isLeftRecursive = leftRecursive;
  if (leftRecursive) {
    linkLeftRecursiveChildren(this.children);
  }
};

// Recursively traverse this trace node and all its descendents, calling a visitor function
// for each node that is visited. If `vistorObjOrFn` is an object, then its 'enter' property
// is a function to call before visiting the children of a node, and its 'exit' property is
// a function to call afterwards. If `visitorObjOrFn` is a function, it represents the 'enter'
// function.
//
// The functions are called with three arguments: the Trace node, its parent Trace, and a number
// representing the depth of the node in the tree. (The root node has depth 0.) `optThisArg`, if
// specified, is the value to use for `this` when executing the visitor functions.
Trace.prototype.walk = function(visitorObjOrFn, optThisArg) {
  var visitor = visitorObjOrFn;
  if (typeof visitor === 'function') {
    visitor = {enter: visitor};
  }
  return (function _walk(node, parent, depth) {
    if (visitor.enter) {
      visitor.enter.call(optThisArg, node, parent, depth);
    }
    node.children.forEach(function(c) {
      if (c && ('walk' in c)) {
        _walk(c, node, depth + 1);
      }
    });
    if (visitor.exit) {
      visitor.exit.call(optThisArg, node, parent, depth);
    }
  })(this, null, 0);
};

// Return a string representation of the trace.
// Sample:
//     12⋅+⋅2⋅*⋅3 ✓ exp ⇒  "12"
//     12⋅+⋅2⋅*⋅3   ✓ addExp (LR) ⇒  "12"
//     12⋅+⋅2⋅*⋅3       ✗ addExp_plus
Trace.prototype.toString = function() {
  var sb = new common.StringBuffer();
  this.walk(function(node, parent, depth) {
    var ctorName = node.expr.constructor.name;
    if (ctorName === 'Alt') {
      return;  // Don't print anything for Alt nodes.
    }
    sb.append(getInputExcerpt(node.inputStream, node.pos, 10) + spaces(depth * 2 + 1));
    sb.append((node.succeeded ? CHECK_MARK : BALLOT_X) + ' ' + node.displayString);
    if (node.isLeftRecursive) {
      sb.append(' (LR)');
    }
    if (node.succeeded) {
      var contents = asEscapedString(node.interval.contents);
      sb.append(' ' + RIGHTWARDS_DOUBLE_ARROW + '  ');
      sb.append(typeof contents === 'string' ? '"' + contents + '"' : contents);
    }
    sb.append('\n');
  });
  return sb.contents();
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Trace;

},{"./Interval":19,"./common":26}],26:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var extend = _dereq_('util-extend');

// --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------

// Helpers

function repeatStr(str, n) {
  return new Array(n + 1).join(str);
}

var escapeStringFor = {};
for (var c = 0; c < 128; c++) {
  escapeStringFor[c] = String.fromCharCode(c);
}
escapeStringFor["'".charCodeAt(0)]  = "\\'";
escapeStringFor['"'.charCodeAt(0)]  = '\\"';
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

exports.abstract = function() {
  throw new Error('this method is abstract!');
};

// Define a lazily-computed, non-enumerable property named `propName`
// on the object `obj`. `getterFn` will be called to compute the value the
// first time the property is accessed.
exports.defineLazyProperty = function(obj, propName, getterFn) {
  var memo;
  Object.defineProperty(obj, propName, {
    get: function() {
      if (!memo) {
        memo = getterFn.call(this);
      }
      return memo;
    }
  });
};

exports.clone = function(obj) {
  if (obj) {
    return extend({}, obj);
  }
  return obj;
};

exports.extend = extend;

exports.repeatFn = function(fn, n) {
  var arr = [];
  while (n-- > 0) {
    arr.push(fn());
  }
  return arr;
};

exports.repeat = function(x, n) {
  return exports.repeatFn(function() { return x; }, n);
};

exports.getDuplicates = function(array) {
  var duplicates = [];
  for (var idx = 0; idx < array.length; idx++) {
    var x = array[idx];
    if (array.lastIndexOf(x) !== idx && duplicates.indexOf(x) < 0) {
      duplicates.push(x);
    }
  }
  return duplicates;
};

exports.fail = {};

exports.isSyntactic = function(ruleName) {
  var firstChar = ruleName[0];
  return ('A' <= firstChar && firstChar <= 'Z');
};

exports.padLeft = function(str, len, optChar) {
  var ch = optChar || ' ';
  if (str.length < len) {
    return repeatStr(ch, len - str.length) + str;
  }
  return str;
};

// StringBuffer

exports.StringBuffer = function() {
  this.strings = [];
};

exports.StringBuffer.prototype.append = function(str) {
  this.strings.push(str);
};

exports.StringBuffer.prototype.contents = function() {
  return this.strings.join('');
};

// Character escaping and unescaping

exports.escapeChar = function(c, optDelim) {
  var charCode = c.charCodeAt(0);
  if ((c === '"' || c === "'") && optDelim && c !== optDelim) {
    return c;
  } else if (charCode < 128) {
    return escapeStringFor[charCode];
  } else if (128 <= charCode && charCode < 256) {
    return '\\x' + exports.padLeft(charCode.toString(16), 2, '0');
  } else {
    return '\\u' + exports.padLeft(charCode.toString(16), 4, '0');
  }
};

exports.unescapeChar = function(s) {
  if (s.charAt(0) === '\\') {
    switch (s.charAt(1)) {
      case 'b': return '\b';
      case 'f': return '\f';
      case 'n': return '\n';
      case 'r': return '\r';
      case 't': return '\t';
      case 'v': return '\v';
      case 'x': return String.fromCharCode(parseInt(s.substring(2, 4), 16));
      case 'u': return String.fromCharCode(parseInt(s.substring(2, 6), 16));
      default:   return s.charAt(1);
    }
  } else {
    return s;
  }
};

// Helper for producing a description of an unknown object in a safe way.
// Especially useful for error messages where an unexpected type of object was encountered.
exports.unexpectedObjToString = function(obj) {
  if (obj == null) {
    return String(obj);
  }
  var baseToString = Object.prototype.toString.call(obj);
  try {
    var typeName;
    if (obj.constructor && obj.constructor.name) {
      typeName = obj.constructor.name;
    } else if (baseToString.indexOf('[object ') === 0) {
      typeName = baseToString.slice(8, -1);  // Extract e.g. "Array" from "[object Array]".
    } else {
      typeName = typeof obj;
    }
    return typeName + ': ' + JSON.stringify(String(obj));
  } catch (e) {
    return baseToString;
  }
};

// Pretty-printing of strings

exports.toStringLiteral = function(str) {
  if (typeof str !== 'string') {
    throw new Error('toStringLiteral only works on strings');
  }
  var hasSingleQuotes = str.indexOf("'") >= 0;
  var hasDoubleQuotes = str.indexOf('"') >= 0;
  var delim = hasSingleQuotes && !hasDoubleQuotes ? '"' : "'";
  var sb = new exports.StringBuffer();
  sb.append(delim);
  for (var idx = 0; idx < str.length; idx++) {
    sb.append(exports.escapeChar(str[idx], delim));
  }
  sb.append(delim);
  return sb.contents();
};


},{"util-extend":14}],27:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Namespace = _dereq_('./Namespace');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function OhmError() {}
OhmError.prototype = Object.create(Error.prototype);

function makeCustomError(name, initFn) {
  // Make E think it's really called OhmError, so that errors look nicer when they're
  // console.log'ed in Chrome.
  var E = function OhmError() {
    initFn.apply(this, arguments);
    // `captureStackTrace` is V8-only.
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      var e = new Error();
      Object.defineProperty(this, 'stack', {get: function() { return e.stack; }});
    }
  };
  E.prototype = Object.create(OhmError.prototype);
  E.prototype.constructor = E;
  E.prototype.name = name;
  return E;
}

// ----------------- errors about intervals -----------------

var IntervalSourcesDontMatch = makeCustomError(
    'ohm.error.IntervalSourcesDontMatch',
    function() {
      this.message = "Interval sources don't match";
    }
);

// ----------------- errors about grammars -----------------

// Grammar syntax error

var GrammarSyntaxError = makeCustomError(
    'ohm.error.GrammarSyntaxError',
    function(matchFailure) {
      Object.defineProperty(this, 'message', {
        get: function() {
          return 'Failed to parse grammar:\n' + matchFailure.message;
        }
      });
    }
);

// Undeclared grammar

var UndeclaredGrammar = makeCustomError(
    'ohm.error.UndeclaredGrammar',
    function(grammarName, namespace) {
      this.grammarName = grammarName;
      this.namespace = namespace;
      if (this.namespace) {
        this.message = 'Grammar ' + this.grammarName +
            ' is not declared in namespace ' + Namespace.toString(this.namespace);
      } else {
        this.message = 'Undeclared grammar ' + this.grammarName;
      }
    }
);

// Duplicate grammar declaration

var DuplicateGrammarDeclaration = makeCustomError(
    'ohm.error.DuplicateGrammarDeclaration',
    function(grammarName, namespace) {
      this.grammarName = grammarName;
      this.namespace = namespace;
      this.message = 'Grammar ' + this.grammarName +
          ' is already declared in namespace ' + Namespace.toString(this.namespace);
    }
);

// ----------------- rules -----------------

// Undeclared rule

var UndeclaredRule = makeCustomError(
    'ohm.error.UndeclaredRule',
    function(ruleName, grammarName) {
      this.ruleName = ruleName;
      this.grammarName = grammarName;
      this.message = 'Rule ' + this.ruleName + ' is not declared in grammar ' + this.grammarName;
    }
);

// Cannot override undeclared rule

var CannotOverrideUndeclaredRule = makeCustomError(
    'ohm.error.CannotOverrideUndeclaredRule',
    function(ruleName, grammarName) {
      this.ruleName = ruleName;
      this.grammarName = grammarName;
      this.message =
          'Cannot override rule ' + this.ruleName +
          ' because it is not declared in ' + this.grammarName;
    }
);

// Cannot extend undeclared rule

var CannotExtendUndeclaredRule = makeCustomError(
    'ohm.error.CannotExtendUndeclaredRule',
    function(ruleName, grammarName) {
      this.ruleName = ruleName;
      this.grammarName = grammarName;
      this.message =
          'Cannot extend rule ' + this.ruleName +
          ' because it is not declared in ' + this.grammarName;
    }
);

// Duplicate rule declaration

var DuplicateRuleDeclaration = makeCustomError(
    'ohm.error.DuplicateRuleDeclaration',
    function(ruleName, offendingGrammarName, declGrammarName) {
      this.ruleName = ruleName;
      this.offendingGrammarName = offendingGrammarName;
      this.declGrammarName = declGrammarName;
      this.message = "Duplicate declaration for rule '" + this.ruleName +
                     "' in grammar '" + this.offendingGrammarName + "'";
      if (this.offendingGrammarName !== declGrammarName) {
        this.message += " (originally declared in grammar '" + this.declGrammarName + "')";
      }
    }
);

// Wrong number of parameters

var WrongNumberOfParameters = makeCustomError(
    'ohm.error.WrongNumberOfParameters',
    function(ruleName, expected, actual) {
      this.ruleName = ruleName;
      this.expected = expected;
      this.actual = actual;
      this.message = 'Wrong number of parameters for rule ' + this.ruleName +
                     ' (expected ' + this.expected + ', got ' + this.actual + ')';
    }
);

// Duplicate parameter names

var DuplicateParameterNames = makeCustomError(
    'ohm.error.DuplicateParameterNames',
    function(ruleName, duplicates) {
      this.ruleName = ruleName;
      this.duplicates = duplicates;
      this.message = 'Duplicate parameter names in rule ' + this.ruleName + ': ' +
                     this.duplicates.join(',');
    }
);

// Invalid parameter expression

var InvalidParameter = makeCustomError(
    'ohm.error.InvalidParameter',
    function(ruleName, expr) {
      this.ruleName = ruleName;
      this.expr = expr;
      this.message = 'Invalid parameter to rule ' + this.ruleName + ': ' + this.expr +
                     ' has arity ' + this.expr.getArity() + ', but parameter expressions ' +
                     'must have arity 1';
    }
);

// ----------------- Kleene operators -----------------

var KleeneExprHasNullableOperand = makeCustomError(
    'ohm.error.KleeneExprHasNullableOperand',
    function(kleeneExpr) {
      this.expr = kleeneExpr;

      var operator = kleeneExpr.operator;
      var nullableExpr = kleeneExpr.expr;
      this.message = nullableExpr.interval.getLineAndColumnMessage() +
                     'Nullable expression ' + nullableExpr.interval.contents +
                     " is not allowed inside '" + operator + "' (possible infinite loop)";
    }
);

// ----------------- arity -----------------

var InconsistentArity = makeCustomError(
    'ohm.error.InconsistentArity',
    function(ruleName, expected, actual) {
      this.ruleName = ruleName;
      this.expected = expected;
      this.actual = actual;
      this.message =
          'Rule ' + this.ruleName + ' involves an alternation which has inconsistent arity ' +
          '(expected ' + this.expected + ', got ' + this.actual + ')';
    }
);

// ----------------- properties -----------------

var DuplicatePropertyNames = makeCustomError(
    'ohm.error.DuplicatePropertyNames',
    function(duplicates) {
      this.duplicates = duplicates;
      this.message = 'Object pattern has duplicate property names: ' + this.duplicates.join(', ');
    }
);

// ----------------- constructors -----------------

var InvalidConstructorCall = makeCustomError(
    'ohm.error.InvalidConstructorCall',
    function(grammar, ctorName, children) {
      this.grammar = grammar;
      this.ctorName = ctorName;
      this.children = children;
      this.message = 'Attempt to invoke constructor ' + this.ctorName +
                     ' with invalid or unexpected arguments';
    }
);

// ----------------- convenience -----------------

var MultipleErrors = makeCustomError(
    'ohm.error.MultipleErrors',
    function(errors) {
      this.errors = errors;
      var messages = errors.map(function(e) { return e.message; });
      this.message = ['Errors:'].concat(messages).join('\n- ');
    }
);

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = {
  CannotExtendUndeclaredRule: CannotExtendUndeclaredRule,
  CannotOverrideUndeclaredRule: CannotOverrideUndeclaredRule,
  DuplicateGrammarDeclaration: DuplicateGrammarDeclaration,
  DuplicateParameterNames: DuplicateParameterNames,
  DuplicatePropertyNames: DuplicatePropertyNames,
  DuplicateRuleDeclaration: DuplicateRuleDeclaration,
  Error: OhmError,
  InconsistentArity: InconsistentArity,
  IntervalSourcesDontMatch: IntervalSourcesDontMatch,
  InvalidConstructorCall: InvalidConstructorCall,
  InvalidParameter: InvalidParameter,
  GrammarSyntaxError: GrammarSyntaxError,
  KleeneExprHasNullableOperand: KleeneExprHasNullableOperand,
  MultipleErrors: MultipleErrors,
  UndeclaredGrammar: UndeclaredGrammar,
  UndeclaredRule: UndeclaredRule,
  WrongNumberOfParameters: WrongNumberOfParameters,

  throwErrors: function(errors) {
    if (errors.length === 1) {
      throw errors[0];
    }
    if (errors.length > 1) {
      throw new MultipleErrors(errors);
    }
  }
};

},{"./Namespace":21}],28:[function(_dereq_,module,exports){
(function (Buffer){
/* global document, Buffer, XMLHttpRequest */

'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Builder = _dereq_('./Builder');
var Grammar = _dereq_('./Grammar');
var Namespace = _dereq_('./Namespace');
var Semantics = _dereq_('./Semantics');
var UnicodeCategories = _dereq_('../third_party/unicode').UnicodeCategories;
var common = _dereq_('./common');
var errors = _dereq_('./errors');
var util = _dereq_('./util');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// The metagrammar, i.e. the grammar for Ohm grammars. Initialized at the
// bottom of this file because loading the grammar requires Ohm itself.
var ohmGrammar;

// An object which makes it possible to stub out the document API for testing.
var documentInterface = {
  querySelector: function(sel) { return document.querySelector(sel); },
  querySelectorAll: function(sel) { return document.querySelectorAll(sel); }
};

// Check if `obj` is a DOM element.
function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}

function isUndefined(obj) {
  return obj === void 0;
}

var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

function isArrayLike(obj) {
  if (obj == null) {
    return false;
  }
  var length = obj.length;
  return typeof length === 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}

// TODO: just use the jQuery thing
function load(url) {
  var req = new XMLHttpRequest();
  req.open('GET', url, false);
  try {
    req.send();
    if (req.status === 0 || req.status === 200) {
      return req.responseText;
    }
  } catch (e) {}
  throw new Error('unable to load url ' + url);
}

// Returns a Grammar instance (i.e., an object with a `match` method) for
// `tree`, which is the concrete syntax tree of a user-written grammar.
// The grammar will be assigned into `namespace` under the name of the grammar
// as specified in the source.
function buildGrammar(match, namespace, optOhmGrammarForTesting) {
  var builder;
  var decl;
  var currentRuleName;
  var currentRuleFormals;
  var overriding = false;
  var metaGrammar = optOhmGrammarForTesting || ohmGrammar;

  // A visitor that produces a Grammar instance from the CST.
  var helpers = metaGrammar.semantics().addOperation('visit', {
    Grammar: function(n, s, open, rs, close) {
      builder = new Builder();
      var grammarName = n.visit();
      decl = builder.newGrammar(grammarName, namespace);
      s.visit();
      rs.visit();
      var g = decl.build();
      if (grammarName in namespace) {
        throw new errors.DuplicateGrammarDeclaration(grammarName, namespace);
      }
      g.definitionInterval = this.interval.trimmed();
      namespace[grammarName] = g;
      return g;
    },

    SuperGrammar: function(_, n) {
      var superGrammarName = n.visit();
      if (superGrammarName === 'null') {
        decl.withSuperGrammar(null);
      } else {
        if (!namespace || !(superGrammarName in namespace)) {
          throw new errors.UndeclaredGrammar(superGrammarName, namespace);
        }
        decl.withSuperGrammar(namespace[superGrammarName]);
      }
    },

    Rule_define: function(n, fs, d, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];
      // If there is no default start rule yet, set it now. This must be done before visiting
      // the body, because it might contain an inline rule definition.
      if (!decl.defaultStartRule && decl.ensureSuperGrammar() !== Grammar.ProtoBuiltInRules) {
        decl.withDefaultStartRule(currentRuleName);
      }
      var body = b.visit();
      body.definitionInterval = this.interval.trimmed();
      var description = d.visit()[0];
      return decl.define(currentRuleName, currentRuleFormals, body, description);
    },
    Rule_override: function(n, fs, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];
      overriding = true;
      var body = b.visit();
      body.definitionInterval = this.interval.trimmed();
      var ans = decl.override(currentRuleName, currentRuleFormals, body);
      overriding = false;
      return ans;
    },
    Rule_extend: function(n, fs, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];
      var body = b.visit();
      var ans = decl.extend(currentRuleName, currentRuleFormals, body);
      decl.ruleDict[currentRuleName].definitionInterval = this.interval.trimmed();
      return ans;
    },

    Formals: function(opointy, fs, cpointy) {
      return fs.visit();
    },

    Params: function(opointy, ps, cpointy) {
      return ps.visit();
    },

    Alt: function(term, _, terms) {
      var args = [term.visit()].concat(terms.visit());
      return builder.alt.apply(builder, args).withInterval(this.interval);
    },

    Term_inline: function(b, n) {
      var inlineRuleName = currentRuleName + '_' + n.visit();
      var body = b.visit();
      body.definitionInterval = this.interval.trimmed();
      var isNewRuleDeclaration = !(decl.superGrammar && decl.superGrammar.ruleDict[inlineRuleName]);
      if (overriding && !isNewRuleDeclaration) {
        decl.override(inlineRuleName, currentRuleFormals, body);
      } else {
        decl.define(inlineRuleName, currentRuleFormals, body);
      }
      var params = currentRuleFormals.map(function(formal) { return builder.app(formal); });
      return builder.app(inlineRuleName, params).withInterval(body.interval);
    },

    Seq: function(expr) {
      return builder.seq.apply(builder, expr.visit()).withInterval(this.interval);
    },

    Iter_star: function(x, _) {
      return builder.star(x.visit()).withInterval(this.interval);
    },
    Iter_plus: function(x, _) {
      return builder.plus(x.visit()).withInterval(this.interval);
    },
    Iter_opt: function(x, _) {
      return builder.opt(x.visit()).withInterval(this.interval);
    },

    Pred_not: function(_, x) {
      return builder.not(x.visit()).withInterval(this.interval);
    },
    Pred_lookahead: function(_, x) {
      return builder.la(x.visit()).withInterval(this.interval);
    },

    Base_application: function(rule, ps) {
      return builder.app(rule.visit(), ps.visit()[0] || []).withInterval(this.interval);
    },
    Base_prim: function(expr) {
      return builder.prim(expr.visit()).withInterval(this.interval);
    },
    Base_paren: function(open, x, close) {
      return x.visit();
    },
    Base_arr: function(open, x, close) {
      return builder.arr(x.visit()).withInterval(this.interval);
    },
    Base_str: function(open, x, close) {
      return builder.str(x.visit());
    },
    Base_obj: function(open, lenient, close) {
      return builder.obj([], lenient.visit()[0]);
    },

    Base_objWithProps: function(open, ps, _, lenient, close) {
      return builder.obj(ps.visit(), lenient.visit()[0]).withInterval(this.interval);
    },

    Props: function(p, _, ps) {
      return [p.visit()].concat(ps.visit());
    },
    Prop: function(n, _, p) {
      return {name: n.visit(), pattern: p.visit()};
    },

    ruleDescr: function(open, t, close) {
      return t.visit();
    },
    ruleDescrText: function(_) {
      return this.interval.contents.trim();
    },

    caseName: function(_, space1, n, space2, end) {
      return n.visit();
    },

    name: function(first, rest) {
      return this.interval.contents;
    },
    nameFirst: function(expr) {},
    nameRest: function(expr) {},

    keyword_null: function(_) {
      return null;
    },
    keyword_true: function(_) {
      return true;
    },
    keyword_false: function(_) {
      return false;
    },

    string: function(open, cs, close) {
      return cs.visit().map(function(c) { return common.unescapeChar(c); }).join('');
    },

    strChar: function(_) {
      return this.interval.contents;
    },

    escapeChar: function(_) {
      return this.interval.contents;
    },

    regExp: function(open, e, close) {
      return e.visit();
    },

    reCharClass_unicode: function(open, unicodeClass, close) {
      return UnicodeCategories[unicodeClass.visit().join('')];
    },
    reCharClass_ordinary: function(open, _, close) {
      return new RegExp(this.interval.contents);
    },

    number: function(_, digits) {
      return parseInt(this.interval.contents);
    },

    space: function(expr) {},
    space_multiLine: function(start, _, end) {},
    space_singleLine: function(start, _, end) {},

    ListOf_some: function(x, _, xs) {
      return [x.visit()].concat(xs.visit());
    },
    ListOf_none: function() {
      return [];
    },

    _terminal: Semantics.actions.getPrimitiveValue,
    _default: Semantics.actions.passThrough
  });
  return helpers(match).visit();
}

function compileAndLoad(source, namespace) {
  var m = ohmGrammar.match(source, 'Grammars');
  if (m.failed()) {
    throw new errors.GrammarSyntaxError(m);
  }
  return buildGrammar(m, namespace);
}

// Return the contents of a script element, fetching it via XHR if necessary.
function getScriptElementContents(el) {
  if (!isElement(el)) {
    throw new TypeError('Expected a DOM Node, got ' + common.unexpectedObjToString(el));
  }
  if (el.type !== 'text/ohm-js') {
    throw new Error('Expected a script tag with type="text/ohm-js", got ' + el);
  }
  return el.getAttribute('src') ? load(el.getAttribute('src')) : el.innerHTML;
}

function grammar(source, optNamespace) {
  var ns = grammars(source, optNamespace);

  // Ensure that the source contained no more than one grammar definition.
  var grammarNames = Object.keys(ns);
  if (grammarNames.length === 0) {
    throw new Error('Missing grammar definition');
  } else if (grammarNames.length > 1) {
    var secondGrammar = ns[grammarNames[1]];
    var interval = secondGrammar.definitionInterval;
    throw new Error(
        util.getLineAndColumnMessage(interval.inputStream.source, interval.startIdx) +
        'Found more than one grammar definition -- use ohm.grammars() instead.');
  }
  return ns[grammarNames[0]];  // Return the one and only grammar.
}

function grammars(source, optNamespace) {
  var ns = Namespace.extend(Namespace.asNamespace(optNamespace));
  if (typeof source !== 'string') {
    // For convenience, detect Node.js Buffer objects and automatically call toString().
    if (Buffer && Buffer.isBuffer(source)) {
      source = source.toString();
    } else {
      throw new TypeError(
          'Expected string as first argument, got ' + common.unexpectedObjToString(source));
    }
  }
  compileAndLoad(source, ns);
  return ns;
}

function grammarFromScriptElement(optNode) {
  var node = optNode;
  if (isUndefined(node)) {
    var nodeList = documentInterface.querySelectorAll('script[type="text/ohm-js"]');
    if (nodeList.length !== 1) {
      throw new Error(
          'Expected exactly one script tag with type="text/ohm-js", found ' + nodeList.length);
    }
    node = nodeList[0];
  }
  return grammar(getScriptElementContents(node));
}

function grammarsFromScriptElements(optNodeOrNodeList) {
  // Simple case: the argument is a DOM node.
  if (isElement(optNodeOrNodeList)) {
    return grammars(optNodeOrNodeList);
  }
  // Otherwise, it must be either undefined or a NodeList.
  var nodeList = optNodeOrNodeList;
  if (isUndefined(nodeList)) {
    // Find all script elements with type="text/ohm-js".
    nodeList = documentInterface.querySelectorAll('script[type="text/ohm-js"]');
  } else if (typeof nodeList === 'string' || (!isElement(nodeList) && !isArrayLike(nodeList))) {
    throw new TypeError('Expected a Node, NodeList, or Array, but got ' + nodeList);
  }
  var ns = Namespace.createNamespace();
  for (var i = 0; i < nodeList.length; ++i) {
    // Copy the new grammars into `ns` to keep the namespace flat.
    common.extend(ns, grammars(getScriptElementContents(nodeList[i]), ns));
  }
  return ns;
}

function makeRecipe(recipeFn) {
  return recipeFn.call(new Builder());
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

// Stuff that users should know about

module.exports = {
  actions: Semantics.actions,
  createNamespace: Namespace.createNamespace,
  error: errors,
  grammar: grammar,
  grammars: grammars,
  grammarFromScriptElement: grammarFromScriptElement,
  grammarsFromScriptElements: grammarsFromScriptElements,
  makeRecipe: makeRecipe,
  util: util
};

// Stuff that's only here for bootstrapping, testing, etc.
Grammar.BuiltInRules = _dereq_('../dist/built-in-rules');
ohmGrammar = _dereq_('../dist/ohm-grammar');
module.exports._buildGrammar = buildGrammar;
module.exports._setDocumentInterfaceForTesting = function(doc) { documentInterface = doc; };
module.exports.ohmGrammar = ohmGrammar;

}).call(this,_dereq_("buffer").Buffer)
},{"../dist/built-in-rules":1,"../dist/ohm-grammar":2,"../third_party/unicode":46,"./Builder":15,"./Grammar":16,"./Namespace":21,"./Semantics":23,"./common":26,"./errors":27,"./util":45,"buffer":3}],29:[function(_dereq_,module,exports){
'use strict';

var inherits = _dereq_('inherits');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Node(grammar, ctorName, children, interval) {
  this.grammar = grammar;
  this.ctorName = ctorName;
  this.children = children;
  this.interval = interval;
}

Node.prototype.numChildren = function() {
  return this.children.length;
};

Node.prototype.childAt = function(idx) {
  return this.children[idx];
};

Node.prototype.indexOfChild = function(arg) {
  return this.children.indexOf(arg);
};

Node.prototype.hasChildren = function() {
  return this.children.length > 0;
};

Node.prototype.hasNoChildren = function() {
  return !this.hasChildren();
};

Node.prototype.onlyChild = function() {
  if (this.children.length !== 1) {
    throw new Error(
        'cannot get only child of a node of type ' + this.ctorName +
        ' (it has ' + this.numChildren() + ' children)');
  } else {
    return this.firstChild();
  }
};

Node.prototype.firstChild = function() {
  if (this.hasNoChildren()) {
    throw new Error(
        'cannot get first child of a ' + this.ctorName + ' node, which has no children');
  } else {
    return this.childAt(0);
  }
};

Node.prototype.lastChild = function() {
  if (this.hasNoChildren()) {
    throw new Error(
        'cannot get last child of a ' + this.ctorName + ' node, which has no children');
  } else {
    return this.childAt(this.numChildren() - 1);
  }
};

Node.prototype.childBefore = function(child) {
  var childIdx = this.indexOfChild(child);
  if (childIdx < 0) {
    throw new Error('Node.childBefore() called w/ an argument that is not a child');
  } else if (childIdx === 0) {
    throw new Error('cannot get child before first child');
  } else {
    return this.childAt(childIdx - 1);
  }
};

Node.prototype.childAfter = function(child) {
  var childIdx = this.indexOfChild(child);
  if (childIdx < 0) {
    throw new Error('Node.childAfter() called w/ an argument that is not a child');
  } else if (childIdx === this.numChildren() - 1) {
    throw new Error('cannot get child after last child');
  } else {
    return this.childAt(childIdx + 1);
  }
};

Node.prototype.isTerminal = function() {
  return false;
};

Node.prototype.toJSON = function() {
  var r = {};
  r[this.ctorName] = this.children;
  return r;
};

function TerminalNode(grammar, value, interval) {
  Node.call(this, grammar, '_terminal', [], interval);
  this.primitiveValue = value;
}
inherits(TerminalNode, Node);

TerminalNode.prototype.isTerminal = function() {
  return true;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = {Node: Node, TerminalNode: TerminalNode};

},{"inherits":12}],30:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common');
var pexprs = _dereq_('./pexprs');
var errors = _dereq_('./errors');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertAllApplicationsAreValid = common.abstract;

pexprs.anything.assertAllApplicationsAreValid = function(grammar) {
  // no-op
};

pexprs.end.assertAllApplicationsAreValid = function(grammar) {
  // no-op
};

pexprs.Prim.prototype.assertAllApplicationsAreValid = function(grammar) {
  // no-op
};

pexprs.Param.prototype.assertAllApplicationsAreValid = function(grammar) {
  // no-op
};

pexprs.Alt.prototype.assertAllApplicationsAreValid = function(grammar) {
  for (var idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx].assertAllApplicationsAreValid(grammar);
  }
};

pexprs.Seq.prototype.assertAllApplicationsAreValid = function(grammar) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertAllApplicationsAreValid(grammar);
  }
};

pexprs.Iter.prototype.assertAllApplicationsAreValid =
pexprs.Not.prototype.assertAllApplicationsAreValid =
pexprs.Lookahead.prototype.assertAllApplicationsAreValid =
pexprs.Arr.prototype.assertAllApplicationsAreValid =
pexprs.Str.prototype.assertAllApplicationsAreValid = function(grammar) {
  this.expr.assertAllApplicationsAreValid(grammar);
};

pexprs.Obj.prototype.assertAllApplicationsAreValid = function(grammar) {
  for (var idx = 0; idx < this.properties.length; idx++) {
    this.properties[idx].pattern.assertAllApplicationsAreValid(grammar);
  }
};

pexprs.Apply.prototype.assertAllApplicationsAreValid = function(grammar) {
  var body = grammar.ruleDict[this.ruleName];

  // Make sure that the rule exists
  if (!body) {
    throw new errors.UndeclaredRule(this.ruleName, grammar.name);
  }

  // ... and that this application has the correct number of parameters
  var actual = this.params.length;
  var expected = body.formals.length;
  if (actual !== expected) {
    throw new errors.WrongNumberOfParameters(this.ruleName, expected, actual);
  }

  // ... and that all of the parameter expressions only have valid applications and have arity 1
  var self = this;
  this.params.forEach(function(param) {
    param.assertAllApplicationsAreValid(grammar);
    if (param.getArity() !== 1) {
      throw new errors.InvalidParameter(self.ruleName, param);
    }
  });
};

},{"./common":26,"./errors":27,"./pexprs":44}],31:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common');
var pexprs = _dereq_('./pexprs');
var errors = _dereq_('./errors');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertChoicesHaveUniformArity = common.abstract;

pexprs.anything.assertChoicesHaveUniformArity =
pexprs.end.assertChoicesHaveUniformArity =
pexprs.Prim.prototype.assertChoicesHaveUniformArity =
pexprs.Param.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  // no-op
};

pexprs.Alt.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  if (this.terms.length === 0) {
    return;
  }
  var arity = this.terms[0].getArity();
  for (var idx = 0; idx < this.terms.length; idx++) {
    var term = this.terms[idx];
    term.assertChoicesHaveUniformArity();
    var otherArity = term.getArity();
    if (arity !== otherArity) {
      throw new errors.InconsistentArity(ruleName, arity, otherArity);
    }
  }
};

pexprs.Extend.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  // Extend is a special case of Alt that's guaranteed to have exactly two
  // cases: [extensions, origBody].
  var actualArity = this.terms[0].getArity();
  var expectedArity = this.terms[1].getArity();
  if (actualArity !== expectedArity) {
    throw new errors.InconsistentArity(ruleName, expectedArity, actualArity);
  }
};

pexprs.Seq.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertChoicesHaveUniformArity(ruleName);
  }
};

pexprs.Iter.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  this.expr.assertChoicesHaveUniformArity(ruleName);
};

pexprs.Not.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  // no-op (not required b/c the nested expr doesn't show up in the CST)
};

pexprs.Lookahead.prototype.assertChoicesHaveUniformArity =
pexprs.Arr.prototype.assertChoicesHaveUniformArity =
pexprs.Str.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  this.expr.assertChoicesHaveUniformArity(ruleName);
};

pexprs.Obj.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  for (var idx = 0; idx < this.properties.length; idx++) {
    this.properties[idx].pattern.assertChoicesHaveUniformArity(ruleName);
  }
};

pexprs.Apply.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  // The arities of the parameter expressions is required to be 1 by
  // `assertAllApplicationsAreValid()`.
};

},{"./common":26,"./errors":27,"./pexprs":44}],32:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = _dereq_('./pexprs');
var errors = _dereq_('./errors');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  // no-op
};

pexprs.Alt.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  for (var idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx].assertIteratedExprsAreNotNullable(grammar, ruleName);
  }
};

pexprs.Seq.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertIteratedExprsAreNotNullable(grammar, ruleName);
  }
};

pexprs.Iter.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  // Note: this is the implementation of this method for `Star` and `Plus` expressions.
  // It is overridden for `Opt` below.
  this.expr.assertIteratedExprsAreNotNullable(grammar, ruleName);
  if (this.expr.isNullable(grammar)) {
    throw new errors.KleeneExprHasNullableOperand(this, ruleName);
  }
};

pexprs.Opt.prototype.assertIteratedExprsAreNotNullable =
pexprs.Not.prototype.assertIteratedExprsAreNotNullable =
pexprs.Lookahead.prototype.assertIteratedExprsAreNotNullable =
pexprs.Arr.prototype.assertIteratedExprsAreNotNullable =
pexprs.Str.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  this.expr.assertIteratedExprsAreNotNullable(grammar, ruleName);
};

pexprs.Obj.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  for (var idx = 0; idx < this.properties.length; idx++) {
    this.properties[idx].pattern.assertIteratedExprsAreNotNullable(grammar, ruleName);
  }
};

pexprs.Apply.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  this.params.forEach(function(param) {
    param.assertIteratedExprsAreNotNullable(grammar, ruleName);
  });
};

},{"./errors":27,"./pexprs":44}],33:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common');
var nodes = _dereq_('./nodes');
var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.check = common.abstract;

pexprs.anything.check = function(grammar, vals) {
  return vals.length >= 1;
};

pexprs.end.check = function(grammar, vals) {
  return vals[0] instanceof nodes.Node &&
         vals[0].isTerminal() &&
         vals[0].primitiveValue === undefined;
};

pexprs.Prim.prototype.check = function(grammar, vals) {
  return vals[0] instanceof nodes.Node &&
         vals[0].isTerminal() &&
         vals[0].primitiveValue === this.obj;
};

pexprs.Param.prototype.check = function(grammar, vals) {
  return vals.length >= 1;
};

pexprs.RegExpPrim.prototype.check = function(grammar, vals) {
  // TODO: more efficient "total match checker" than the use of .replace here
  return vals[0] instanceof nodes.Node &&
         vals[0].isTerminal() &&
         typeof vals[0].primitiveValue === 'string' &&
         vals[0].primitiveValue.replace(this.obj, '') === '';
};

pexprs.Alt.prototype.check = function(grammar, vals) {
  for (var i = 0; i < this.terms.length; i++) {
    var term = this.terms[i];
    if (term.check(grammar, vals)) {
      return true;
    }
  }
  return false;
};

pexprs.Seq.prototype.check = function(grammar, vals) {
  var pos = 0;
  for (var i = 0; i < this.factors.length; i++) {
    var factor = this.factors[i];
    if (factor.check(grammar, vals.slice(pos))) {
      pos += factor.getArity();
    } else {
      return false;
    }
  }
  return true;
};

pexprs.Iter.prototype.check = function(grammar, vals) {
  var arity = this.getArity();
  var columns = vals.slice(0, arity);
  if (columns.length !== arity) {
    return false;
  }
  var rowCount = columns[0].length;
  var i;
  for (i = 1; i < arity; i++) {
    if (columns[i].length !== rowCount) {
      return false;
    }
  }

  for (i = 0; i < rowCount; i++) {
    var row = [];
    for (var j = 0; j < arity; j++) {
      row.push(columns[j][i]);
    }
    if (!this.expr.check(grammar, row)) {
      return false;
    }
  }

  return true;
};

pexprs.Not.prototype.check = function(grammar, vals) {
  return true;
};

pexprs.Lookahead.prototype.check = function(grammar, vals) {
  return this.expr.check(grammar, vals);
};

pexprs.Arr.prototype.check = function(grammar, vals) {
  return this.expr.check(grammar, vals);
};

pexprs.Str.prototype.check = function(grammar, vals) {
  return this.expr.check(grammar, vals);
};

pexprs.Obj.prototype.check = function(grammar, vals) {
  var fixedArity = this.getArity();
  if (this.isLenient) {
    fixedArity--;
  }

  var pos = 0;
  for (var i = 0; i < fixedArity; i++) {
    var pattern = this.properties[i].pattern;
    if (pattern.check(grammar, vals.slice(pos))) {
      pos += pattern.getArity();
    } else {
      return false;
    }
  }

  return this.isLenient ? typeof vals[pos] === 'object' && vals[pos] : true;
};

pexprs.Apply.prototype.check = function(grammar, vals) {
  if (!(vals[0] instanceof nodes.Node &&
        vals[0].grammar === grammar &&
        vals[0].ctorName === this.ruleName)) {
    return false;
  }

  // TODO: think about *not* doing the following checks, i.e., trusting that the rule
  // was correctly constructed.
  var ruleNode = vals[0];
  var body = grammar.ruleDict[this.ruleName];
  return body.check(grammar, ruleNode.children) && ruleNode.numChildren() === body.getArity();
};

},{"./common":26,"./nodes":29,"./pexprs":44}],34:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var InputStream = _dereq_('./InputStream');
var common = _dereq_('./common');
var nodes = _dereq_('./nodes');
var pexprs = _dereq_('./pexprs');

var Node = nodes.Node;
var TerminalNode = nodes.TerminalNode;

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

var applySpaces_ = new pexprs.Apply('spaces_');

function skipSpacesIfAppropriate(state) {
  var currentApplication = state.applicationStack[state.applicationStack.length - 1];
  var ruleName = currentApplication.ruleName || '';
  if (typeof state.inputStream.source === 'string' && common.isSyntactic(ruleName)) {
    skipSpaces(state);
  }
}

function skipSpaces(state) {
  state.ignoreFailures();
  applySpaces_.eval(state);
  state.bindings.pop();
  state.recordFailures();
}

// Evaluate the expression and return true if it succeeded, otherwise false.
// On success, the bindings will have `this.arity` more elements than before,
// and the position could be anywhere. On failure, the bindings and position
// will be unchanged.
pexprs.PExpr.prototype.eval = function(state) {
  var origPos = state.inputStream.pos;
  var origNumBindings = state.bindings.length;
  var origTrace = state.trace;
  if (state.isTracing()) {
    state.trace = [];
  }

  // Do the actual evaluation.
  var ans = this._eval(state, state.inputStream, origPos);

  if (state.isTracing()) {
    var traceEntry = state.getTraceEntry(origPos, this, ans);
    origTrace.push(traceEntry);
    state.trace = origTrace;
  }

  if (!ans) {
    this.maybeRecordFailure(state, origPos);

    // Reset the position and the bindings.
    state.inputStream.pos = origPos;
    state.bindings.length = origNumBindings;
  }
  return ans;
};

// Evaluate the expression and return true if it succeeded, otherwise false.
// This should not be called directly except by `eval`.
//
// The contract of this method is as follows:
// * When the return value is true:
//   -- bindings will have expr.arity more elements than before
// * When the return value is false:
//   -- bindings will have exactly the same number of elements as before
//   -- position could be anywhere

pexprs.PExpr.prototype._eval = common.abstract;

pexprs.anything._eval = function(state, inputStream, origPos) {
  var value = inputStream.next();
  if (value === common.fail) {
    return false;
  } else {
    var interval = inputStream.intervalFrom(origPos);
    state.bindings.push(new TerminalNode(state.grammar, value, interval));
    return true;
  }
};

pexprs.end._eval = function(state, inputStream, origPos) {
  if (state.inputStream.atEnd()) {
    var interval = inputStream.intervalFrom(inputStream.pos);
    state.bindings.push(new TerminalNode(state.grammar, undefined, interval));
    return true;
  } else {
    return false;
  }
};

pexprs.Prim.prototype._eval = function(state, inputStream, origPos) {
  if (this.match(inputStream) === common.fail) {
    return false;
  } else {
    var interval = inputStream.intervalFrom(origPos);
    state.bindings.push(new TerminalNode(state.grammar, this.obj, interval));
    return true;
  }
};

pexprs.Prim.prototype.match = function(inputStream) {
  return inputStream.matchExactly(this.obj);
};

pexprs.StringPrim.prototype.match = function(inputStream) {
  return inputStream.matchString(this.obj);
};

pexprs.RegExpPrim.prototype._eval = function(state, inputStream, origPos) {
  if (inputStream.matchRegExp(this.obj) === common.fail) {
    return false;
  } else {
    var interval = inputStream.intervalFrom(origPos);
    state.bindings.push(
        new TerminalNode(state.grammar, inputStream.source[origPos], interval));
    return true;
  }
};

pexprs.Param.prototype._eval = function(state, inputStream, origPos) {
  var currentApplication = state.applicationStack[state.applicationStack.length - 1];
  return currentApplication.params[this.index].eval(state);
};

pexprs.Alt.prototype._eval = function(state, inputStream, origPos) {
  var bindings = state.bindings;
  var origNumBindings = bindings.length;
  for (var idx = 0; idx < this.terms.length; idx++) {
    if (this.terms[idx].eval(state)) {
      return true;
    } else {
      inputStream.pos = origPos;
      bindings.length = origNumBindings;
    }
  }
  return false;
};

pexprs.Seq.prototype._eval = function(state, inputStream, origPos) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    skipSpacesIfAppropriate(state);
    var factor = this.factors[idx];
    if (!factor.eval(state)) {
      return false;
    }
  }
  return true;
};

pexprs.Iter.prototype._eval = function(state, inputStream, origPos) {
  var arity = this.getArity();
  var columns = common.repeatFn(function() { return []; }, arity);
  var numMatches = 0;
  var idx;
  while (numMatches < this.maxNumMatches) {
    var backtrackPos = inputStream.pos;
    skipSpacesIfAppropriate(state);
    if (this.expr.eval(state)) {
      numMatches++;
      var row = state.bindings.splice(state.bindings.length - arity, arity);
      for (idx = 0; idx < row.length; idx++) {
        columns[idx].push(row[idx]);
      }
    } else {
      inputStream.pos = backtrackPos;
      break;
    }
  }
  if (numMatches < this.minNumMatches) {
    return false;
  }
  for (idx = 0; idx < columns.length; idx++) {
    var interval = inputStream.intervalFrom(origPos);
    state.bindings.push(new Node(state.grammar, '_iter', columns[idx], interval));
  }
  return true;
};

pexprs.Not.prototype._eval = function(state, inputStream, origPos) {
  // TODO:
  // * Right now we're just throwing away all of the failures that happen inside a `not`,
  //   and recording `this` as a failed expression.
  // * Double negation should be equivalent to lookahead, but that's not the case right now wrt
  //   failures. E.g., ~~'foo' produces a failure for ~~'foo', but maybe it should produce
  //   a failure for 'foo' instead.

  state.ignoreFailures();
  var ans = this.expr.eval(state);
  state.recordFailures();
  if (ans) {
    state.bindings.length -= this.getArity();
    return false;
  } else {
    inputStream.pos = origPos;
    return true;
  }
};

pexprs.Lookahead.prototype._eval = function(state, inputStream, origPos) {
  if (this.expr.eval(state)) {
    inputStream.pos = origPos;
    return true;
  } else {
    return false;
  }
};

pexprs.Arr.prototype._eval = function(state, inputStream, origPos) {
  var obj = inputStream.next();
  if (Array.isArray(obj)) {
    var objInputStream = InputStream.newFor(obj);
    state.pushInputStream(objInputStream);
    var ans = this.expr.eval(state) && state.inputStream.atEnd();
    state.popInputStream();
    return ans;
  } else {
    return false;
  }
};

pexprs.Str.prototype._eval = function(state, inputStream, origPos) {
  var obj = inputStream.next();
  if (typeof obj === 'string') {
    var strInputStream = InputStream.newFor(obj);
    state.pushInputStream(strInputStream);
    var ans = this.expr.eval(state) && (skipSpacesIfAppropriate(state), state.inputStream.atEnd());
    state.popInputStream();
    return ans;
  } else {
    return false;
  }
};

pexprs.Obj.prototype._eval = function(state, inputStream, origPos) {
  var obj = inputStream.next();
  if (obj !== common.fail && obj && (typeof obj === 'object' || typeof obj === 'function')) {
    var numOwnPropertiesMatched = 0;
    for (var idx = 0; idx < this.properties.length; idx++) {
      var property = this.properties[idx];
      if (!obj.hasOwnProperty(property.name)) {
        return false;
      }
      var value = obj[property.name];
      var valueInputStream = InputStream.newFor([value]);
      state.pushInputStream(valueInputStream);
      var matched = property.pattern.eval(state) && state.inputStream.atEnd();
      state.popInputStream();
      if (!matched) {
        return false;
      }
      numOwnPropertiesMatched++;
    }
    if (this.isLenient) {
      var remainder = {};
      for (var p in obj) {
        if (obj.hasOwnProperty(p) && this.properties.indexOf(p) < 0) {
          remainder[p] = obj[p];
        }
      }
      var interval = inputStream.intervalFrom(origPos);
      state.bindings.push(new TerminalNode(state.grammar, remainder, interval));
      return true;
    } else {
      return numOwnPropertiesMatched === Object.keys(obj).length;
    }
  } else {
    return false;
  }
};

pexprs.Apply.prototype._eval = function(state, inputStream) {
  var self = this;
  var grammar = state.grammar;
  var bindings = state.bindings;

  function useMemoizedResult(memoRecOrLR) {
    inputStream.pos = memoRecOrLR.pos;
    if (memoRecOrLR.failureDescriptor) {
      state.recordFailures(memoRecOrLR.failureDescriptor, self);
    }
    if (state.isTracing()) {
      state.trace.push(memoRecOrLR.traceEntry);
    }
    if (memoRecOrLR.value) {
      bindings.push(memoRecOrLR.value);
      return true;
    } else {
      return false;
    }
  }

  var actuals = state.applicationStack.length > 1 ?
      state.applicationStack[state.applicationStack.length - 1].params :
      [];
  var app = this.substituteParams(actuals);
  var ruleName = app.ruleName;
  var memoKey = app.toMemoKey();

  if (common.isSyntactic(ruleName)) {
    skipSpaces(state);
  }

  var origPosInfo = state.getCurrentPosInfo();

  var memoRec = origPosInfo.memo[memoKey];
  var currentLR;
  if (memoRec && origPosInfo.shouldUseMemoizedResult(memoRec)) {
    return useMemoizedResult(memoRec);
  } else if (origPosInfo.isActive(app)) {
    currentLR = origPosInfo.getCurrentLeftRecursion();
    if (currentLR && currentLR.memoKey === memoKey) {
      origPosInfo.updateInvolvedApplications();
      return useMemoizedResult(currentLR);
    } else {
      origPosInfo.startLeftRecursion(app);
      return false;
    }
  } else {
    var body = grammar.ruleDict[ruleName];
    var origPos = inputStream.pos;
    origPosInfo.enter(app);
    if (body.description) {
      state.ignoreFailures();
    }
    var value = app.evalOnce(body, state, inputStream, origPos);
    currentLR = origPosInfo.getCurrentLeftRecursion();
    if (currentLR) {
      if (currentLR.memoKey === memoKey) {
        value = app.handleLeftRecursion(body, state, origPos, currentLR, value);
        origPosInfo.memo[memoKey] = {
          pos: inputStream.pos,
          value: value,
          involvedApplications: currentLR.involvedApplications
        };
        origPosInfo.endLeftRecursion(app);
      } else if (!currentLR.involvedApplications[memoKey]) {
        // Only memoize if this application is not involved in the current left recursion
        origPosInfo.memo[memoKey] = {pos: inputStream.pos, value: value};
      }
    } else {
      origPosInfo.memo[memoKey] = {pos: inputStream.pos, value: value};
    }
    if (body.description) {
      state.recordFailures();
      if (!value) {
        state.recordFailure(origPos, app);
      }
    }
    // Record trace information in the memo table, so that it is
    // available if the memoized result is used later.
    if (state.isTracing() && origPosInfo.memo[memoKey]) {
      var entry = state.getTraceEntry(origPos, app, value);
      entry.setLeftRecursive(currentLR && (currentLR.memoKey === memoKey));
      origPosInfo.memo[memoKey].traceEntry = entry;
    }
    var ans;
    if (value) {
      bindings.push(value);
      if (state.applicationStack.length === 1) {
        if (common.isSyntactic(ruleName)) {
          skipSpaces(state);
        }
        ans = pexprs.end.eval(state);
        bindings.pop();
      } else {
        ans = true;
      }
    } else {
      ans = false;
    }

    origPosInfo.exit();
    return ans;
  }
};

pexprs.Apply.prototype.evalOnce = function(expr, state, inputStream, origPos) {
  if (expr.eval(state)) {
    var arity = expr.getArity();
    var bindings = state.bindings.splice(state.bindings.length - arity, arity);
    var ans = new Node(state.grammar, this.ruleName, bindings, inputStream.intervalFrom(origPos));
    return ans;
  } else {
    return false;
  }
};

pexprs.Apply.prototype.handleLeftRecursion = function(body, state, origPos, currentLR, seedValue) {
  if (!seedValue) {
    return seedValue;
  }

  var inputStream = state.inputStream;
  var value = seedValue;
  currentLR.value = seedValue;
  currentLR.pos = inputStream.pos;

  while (true) {
    if (state.isTracing()) {
      currentLR.traceEntry = common.clone(state.trace[state.trace.length - 1]);
    }

    inputStream.pos = origPos;
    value = this.evalOnce(body, state, inputStream, origPos);
    if (value && inputStream.pos > currentLR.pos) {
      // The left-recursive result was expanded -- keep looping.
      currentLR.value = value;
      currentLR.pos = inputStream.pos;
    } else {
      // Failed to expand the result.
      inputStream.pos = currentLR.pos;
      if (state.isTracing()) {
        state.trace.pop();  // Drop last trace entry since `value` was unused.
      }
      break;
    }
  }
  return currentLR.value;
};

},{"./InputStream":18,"./common":26,"./nodes":29,"./pexprs":44}],35:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.getArity = function() {
  return 1;
};

pexprs.Alt.prototype.getArity = function() {
  // This is ok b/c all terms must have the same arity -- this property is
  // checked by the Grammar constructor.
  return this.terms.length === 0 ? 0 : this.terms[0].getArity();
};

pexprs.Seq.prototype.getArity = function() {
  var arity = 0;
  for (var idx = 0; idx < this.factors.length; idx++) {
    arity += this.factors[idx].getArity();
  }
  return arity;
};

pexprs.Iter.prototype.getArity = function() {
  return this.expr.getArity();
};

pexprs.Not.prototype.getArity = function() {
  return 0;
};

pexprs.Lookahead.prototype.getArity =
pexprs.Arr.prototype.getArity =
pexprs.Str.prototype.getArity = function() {
  return this.expr.getArity();
};

pexprs.Obj.prototype.getArity = function() {
  var arity = this.isLenient ? 1 : 0;
  for (var idx = 0; idx < this.properties.length; idx++) {
    arity += this.properties[idx].pattern.getArity();
  }
  return arity;
};

},{"./pexprs":44}],36:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

// NOTE: the `introduceParams` method modifies the receiver in place.

pexprs.PExpr.prototype.introduceParams = function(formals) {
  return this;
};

pexprs.Alt.prototype.introduceParams = function(formals) {
  this.terms.forEach(function(term, idx, terms) {
    terms[idx] = term.introduceParams(formals);
  });
  return this;
};

pexprs.Seq.prototype.introduceParams = function(formals) {
  this.factors.forEach(function(factor, idx, factors) {
    factors[idx] = factor.introduceParams(formals);
  });
  return this;
};

pexprs.Iter.prototype.introduceParams =
pexprs.Not.prototype.introduceParams =
pexprs.Lookahead.prototype.introduceParams =
pexprs.Arr.prototype.introduceParams =
pexprs.Str.prototype.introduceParams = function(formals) {
  this.expr = this.expr.introduceParams(formals);
  return this;
};

pexprs.Obj.prototype.introduceParams = function(formals) {
  this.properties.forEach(function(property, idx) {
    property.pattern = property.pattern.introduceParams(formals);
  });
  return this;
};

pexprs.Apply.prototype.introduceParams = function(formals) {
  var index = formals.indexOf(this.ruleName);
  if (index >= 0) {
    if (this.params.length > 0) {
      throw new Error('FIXME: should catch this earlier');
    }
    return new pexprs.Param(index);
  } else {
    this.params.forEach(function(param, idx, params) {
      params[idx] = param.introduceParams(formals);
    });
    return this;
  }
};

},{"./pexprs":44}],37:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

// Returns `true` if this parsing expression may accept without consuming any input.
pexprs.PExpr.prototype.isNullable = function(grammar) {
  return this._isNullable(grammar, Object.create(null));
};

pexprs.PExpr.prototype._isNullable = function(grammar, memo) {
  return false;
};

pexprs.end._isNullable = function(grammar, memo) {
  return true;
};

pexprs.StringPrim.prototype._isNullable = function(grammar, memo) {
  // This is an over-simplification: it's only correct if the input is a string. If it's an array
  // or an object, then the empty string parsing expression is not nullable.
  return this.obj === '';
};

pexprs.Alt.prototype._isNullable = function(grammar, memo) {
  return this.terms.length === 0 ||
      this.terms.some(function(term) { return term._isNullable(grammar, memo); });
};

pexprs.Seq.prototype._isNullable = function(grammar, memo) {
  return this.factors.every(function(factor) { return factor._isNullable(grammar, memo); });
};

pexprs.Star.prototype._isNullable =
pexprs.Opt.prototype._isNullable =
pexprs.Not.prototype._isNullable =
pexprs.Lookahead.prototype._isNullable = function(grammar, memo) {
  return true;
};

pexprs.Str.prototype._isNullable = function(grammar, memo) {
  // This is also an over-simplification that is only correct when the input is a string.
  return this.expr._isNullable(grammar, memo);
};

pexprs.Apply.prototype._isNullable = function(grammar, memo) {
  var key = this.toMemoKey();
  if (!Object.prototype.hasOwnProperty.call(memo, key)) {
    var body = grammar.ruleDict[this.ruleName];
    var inlined = body.substituteParams(this.params);
    memo[key] = false;
    memo[key] = inlined._isNullable(grammar, memo);
  }
  return memo[key];
};

},{"./pexprs":44}],38:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

// Do nothing by default.
pexprs.PExpr.prototype.maybeRecordFailure = function(state, startPos) {
};

// For PExprs that directly consume input, record the failure in the state object.
pexprs.anything.maybeRecordFailure =
pexprs.end.maybeRecordFailure =
pexprs.Prim.prototype.maybeRecordFailure =
pexprs.Not.prototype.maybeRecordFailure = function(state, startPos) {
  state.recordFailure(startPos, this);
};

},{"./pexprs":44}],39:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common');
var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.outputRecipe = common.abstract;

pexprs.anything.outputRecipe = function(sb, formals) {
  sb.append('this.anything()');
};

pexprs.end.outputRecipe = function(sb, formals) {
  sb.append('this.end()');
};

pexprs.Prim.prototype.outputRecipe = function(sb, formals) {
  sb.append('this.prim(');
  sb.append(typeof this.obj === 'string' ? common.toStringLiteral(this.obj) : '' + this.obj);
  sb.append(')');
};

pexprs.Param.prototype.outputRecipe = function(sb, formals) {
  sb.append('this.param(' + this.index + ')');
};

pexprs.Alt.prototype.outputRecipe = function(sb, formals) {
  sb.append('this.alt(');
  for (var idx = 0; idx < this.terms.length; idx++) {
    if (idx > 0) {
      sb.append(', ');
    }
    this.terms[idx].outputRecipe(sb, formals);
  }
  sb.append(')');
};

pexprs.Seq.prototype.outputRecipe = function(sb, formals) {
  sb.append('this.seq(');
  for (var idx = 0; idx < this.factors.length; idx++) {
    if (idx > 0) {
      sb.append(', ');
    }
    this.factors[idx].outputRecipe(sb, formals);
  }
  sb.append(')');
};

pexprs.Star.prototype.outputRecipe = function(sb, formals) {
  sb.append('this.star(');
  this.expr.outputRecipe(sb, formals);
  sb.append(')');
};

pexprs.Plus.prototype.outputRecipe = function(sb, formals) {
  sb.append('this.plus(');
  this.expr.outputRecipe(sb, formals);
  sb.append(')');
};

pexprs.Opt.prototype.outputRecipe = function(sb, formals) {
  sb.append('this.opt(');
  this.expr.outputRecipe(sb, formals);
  sb.append(')');
};

pexprs.Not.prototype.outputRecipe = function(sb, formals) {
  sb.append('this.not(');
  this.expr.outputRecipe(sb, formals);
  sb.append(')');
};

pexprs.Lookahead.prototype.outputRecipe = function(sb, formals) {
  sb.append('this.la(');
  this.expr.outputRecipe(sb, formals);
  sb.append(')');
};

pexprs.Arr.prototype.outputRecipe = function(sb, formals) {
  sb.append('this.arr(');
  this.expr.outputRecipe(sb, formals);
  sb.append(')');
};

pexprs.Str.prototype.outputRecipe = function(sb, formals) {
  sb.append('this.str(');
  this.expr.outputRecipe(sb, formals);
  sb.append(')');
};

pexprs.Obj.prototype.outputRecipe = function(sb, formals) {
  function outputPropertyRecipe(prop) {
    sb.append('{name: ');
    sb.append(common.toStringLiteral(prop.name));
    sb.append(', pattern: ');
    prop.pattern.outputRecipe(sb, formals);
    sb.append('}');
  }

  sb.append('this.obj([');
  for (var idx = 0; idx < this.properties.length; idx++) {
    if (idx > 0) {
      sb.append(', ');
    }
    outputPropertyRecipe(this.properties[idx]);
  }
  sb.append('], ');
  sb.append(!!this.isLenient);
  sb.append(')');
};

pexprs.Apply.prototype.outputRecipe = function(sb, formals) {
  sb.append('this.app(');
  sb.append(common.toStringLiteral(this.ruleName));
  if (this.ruleName.indexOf('_') >= 0 && formals.length > 0) {
    var apps = formals.
        map(function(formal) { return 'this.app(' + common.toStringLiteral(formal) + ')'; });
    sb.append(', [' + apps.join(', ') + ']');
  } else if (this.params.length > 0) {
    sb.append(', [');
    this.params.forEach(function(param, idx) {
      if (idx > 0) {
        sb.append(', ');
      }
      param.outputRecipe(sb, formals);
    });
    sb.append(']');
  }
  sb.append(')');
};

},{"./common":26,"./pexprs":44}],40:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.substituteParams = function(actuals) {
  return this;
};

pexprs.Param.prototype.substituteParams = function(actuals) {
  return actuals[this.index];
};

pexprs.Alt.prototype.substituteParams = function(actuals) {
  return new pexprs.Alt(
      this.terms.map(function(term) { return term.substituteParams(actuals); }));
};

pexprs.Seq.prototype.substituteParams = function(actuals) {
  return new pexprs.Seq(
      this.factors.map(function(factor) { return factor.substituteParams(actuals); }));
};

pexprs.Iter.prototype.substituteParams =
pexprs.Not.prototype.substituteParams =
pexprs.Lookahead.prototype.substituteParams =
pexprs.Arr.prototype.substituteParams =
pexprs.Str.prototype.substituteParams = function(actuals) {
  return new this.constructor(this.expr.substituteParams(actuals));
};

pexprs.Obj.prototype.substituteParams = function(actuals) {
  var properties = this.properties.map(function(property) {
    return {
      name: property.name,
      pattern: property.pattern.substituteParams(actuals)
    };
  });
  return new pexprs.Obj(properties, this.isLenient);
};

pexprs.Apply.prototype.substituteParams = function(actuals) {
  if (this.params.length === 0) {
    // Avoid making a copy of this application, as an optimization
    return this;
  } else {
    var params = this.params.map(function(param) { return param.substituteParams(actuals); });
    return new pexprs.Apply(this.ruleName, params);
  }
};

},{"./pexprs":44}],41:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

// Returns a string representing the PExpr, for use as a UI label, etc.
pexprs.PExpr.prototype.toDisplayString = function() {
  if (this.interval) {
    return this.interval.trimmed().contents;
  }
  return '[' + this.constructor.name + ']';
};

pexprs.anything.toDisplayString = function() {
  return '_';
};

pexprs.end.toDisplayString = function() {
  return 'end';
};

pexprs.Prim.prototype.toDisplayString = function() {
  return String(this.obj);
};

pexprs.Param.prototype.toDisplayString = function() {
  return '#' + this.index;
};

pexprs.StringPrim.prototype.toDisplayString = function() {
  return '"' + this.obj + '"';
};

pexprs.Apply.prototype.toDisplayString = function() {
  return this.ruleName;
};

},{"./pexprs":44}],42:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common');
var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.toExpected = function(ruleDict) {
  return undefined;
};

pexprs.anything.toExpected = function(ruleDict) {
  return 'any object';
};

pexprs.end.toExpected = function(ruleDict) {
  return 'end of input';
};

pexprs.Prim.prototype.toExpected = function(ruleDict) {
  return common.toStringLiteral(this.obj);
};

pexprs.Not.prototype.toExpected = function(ruleDict) {
  if (this.expr === pexprs.anything) {
    return 'nothing';
  } else {
    return 'not ' + this.expr.toExpected(ruleDict);
  }
};

// TODO: think about Arr, Str, and Obj

pexprs.Apply.prototype.toExpected = function(ruleDict) {
  var description = ruleDict[this.ruleName].description;
  if (description) {
    return description;
  } else {
    var article = (/^[aeiouAEIOU]/.test(this.ruleName) ? 'an' : 'a');
    return article + ' ' + this.ruleName;
  }
};


},{"./common":26,"./pexprs":44}],43:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common');
var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  e1.toString() === e2.toString() ==> e1 and e2 are semantically equivalent.
  Note that this is not an iff (<==>): e.g.,
  (~"b" "a").toString() !== ("a").toString(), even though
  ~"b" "a" and "a" are interchangeable in any grammar,
  both in terms of the languages they accept and their arities.
*/
pexprs.PExpr.prototype.toString = common.abstract;

pexprs.anything.toString = function() {
  return '_';
};

pexprs.end.toString = function() {
  return 'end';
};

pexprs.Prim.prototype.toString = function() {
  return JSON.stringify(this.obj);
};

pexprs.Param.prototype.toString = function() {
  return '#' + this.index;
};

pexprs.RegExpPrim.prototype.toString = function() {
  return this.obj.toString();
};

pexprs.Alt.prototype.toString = function() {
  return this.terms.length === 1 ?
    this.terms[0].toString() :
    '(' + this.terms.map(function(term) { return term.toString(); }).join(' | ') + ')';
};

pexprs.Seq.prototype.toString = function() {
  return this.factors.length === 1 ?
    this.factors[0].toString() :
    '(' + this.factors.map(function(factor) { return factor.toString(); }).join(' ') + ')';
};

pexprs.Iter.prototype.toString = function() {
  return this.expr + this.operator;
};

pexprs.Not.prototype.toString = function() {
  return '~' + this.expr;
};

pexprs.Lookahead.prototype.toString = function() {
  return '&' + this.expr;
};

pexprs.Arr.prototype.toString = function() {
  return '[' + this.expr.toString() + ']';
};

pexprs.Str.prototype.toString = function() {
  return '``' + this.expr.toString() + "''";
};

pexprs.Obj.prototype.toString = function() {
  var parts = ['{'];

  var first = true;
  function emit(part) {
    if (first) {
      first = false;
    } else {
      parts.push(', ');
    }
    parts.push(part);
  }

  this.properties.forEach(function(property) {
    emit(JSON.stringify(property.name) + ': ' + property.pattern.toString());
  });
  if (this.isLenient) {
    emit('...');
  }

  parts.push('}');
  return parts.join('');
};

pexprs.Apply.prototype.toString = function() {
  if (this.params.length > 0) {
    var ps = this.params.map(function(param) { return param.toString(); });
    return this.ruleName + '<' + ps.join(',') + '>';
  } else {
    return this.ruleName;
  }
};

},{"./common":26,"./pexprs":44}],44:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common');
var errors = _dereq_('./errors');
var inherits = _dereq_('inherits');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// General stuff

function PExpr() {
  throw new Error("PExpr cannot be instantiated -- it's abstract");
}

PExpr.prototype.withDescription = function(description) {
  this.description = description;
  return this;
};

PExpr.prototype.withInterval = function(interval) {
  this.interval = interval.trimmed();
  return this;
};

PExpr.prototype.withFormals = function(formals) {
  this.formals = formals;
  return this;
};

// Anything

var anything = Object.create(PExpr.prototype);

// End

var end = Object.create(PExpr.prototype);

// Primitives

function Prim(obj) {
  this.obj = obj;
}
inherits(Prim, PExpr);

function StringPrim(obj) {
  this.obj = obj;
}
inherits(StringPrim, Prim);

function RegExpPrim(obj) {
  this.obj = obj;
}
inherits(RegExpPrim, Prim);

// Parameters

function Param(index) {
  this.index = index;
}
inherits(Param, PExpr);

// Alternation

function Alt(terms) {
  this.terms = terms;
}
inherits(Alt, PExpr);

// Extend is an implementation detail of rule extension

function Extend(superGrammar, name, body) {
  var origBody = superGrammar.ruleDict[name];
  this.terms = [body, origBody];
}
inherits(Extend, Alt);

// Sequences

function Seq(factors) {
  this.factors = factors;
}
inherits(Seq, PExpr);

// Iterators and optionals

function Iter(expr) {
  this.expr = expr;
}
inherits(Iter, PExpr);

function Star(expr) {
  this.expr = expr;
}
inherits(Star, Iter);

function Plus(expr) {
  this.expr = expr;
}
inherits(Plus, Iter);

function Opt(expr) {
  this.expr = expr;
}
inherits(Opt, Iter);

Star.prototype.operator = '*';
Plus.prototype.operator = '+';
Opt.prototype.operator = '?';

Star.prototype.minNumMatches = 0;
Plus.prototype.minNumMatches = 1;
Opt.prototype.minNumMatches = 0;

Star.prototype.maxNumMatches = Number.POSITIVE_INFINITY;
Plus.prototype.maxNumMatches = Number.POSITIVE_INFINITY;
Opt.prototype.maxNumMatches = 1;

// Predicates

function Not(expr) {
  this.expr = expr;
}
inherits(Not, PExpr);

function Lookahead(expr) {
  this.expr = expr;
}
inherits(Lookahead, PExpr);

// Array decomposition

function Arr(expr) {
  this.expr = expr;
}
inherits(Arr, PExpr);

// String decomposition

function Str(expr) {
  this.expr = expr;
}
inherits(Str, PExpr);

// Object decomposition

function Obj(properties, isLenient) {
  var names = properties.map(function(property) { return property.name; });
  var duplicates = common.getDuplicates(names);
  if (duplicates.length > 0) {
    throw new errors.DuplicatePropertyNames(duplicates);
  } else {
    this.properties = properties;
    this.isLenient = isLenient;
  }
}
inherits(Obj, PExpr);

// Rule application

function Apply(ruleName, optParams) {
  this.ruleName = ruleName;
  this.params = optParams || [];
}
inherits(Apply, PExpr);

// This method just caches the result of `this.toString()` in a non-enumerable property.
Apply.prototype.toMemoKey = function() {
  if (!this._memoKey) {
    Object.defineProperty(this, '_memoKey', {value: this.toString()});
  }
  return this._memoKey;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.makePrim = function(obj) {
  if (typeof obj === 'string' && obj.length !== 1) {
    return new StringPrim(obj);
  } else if (obj instanceof RegExp) {
    return new RegExpPrim(obj);
  } else {
    return new Prim(obj);
  }
};

exports.PExpr = PExpr;
exports.anything = anything;
exports.end = end;
exports.Prim = Prim;
exports.StringPrim = StringPrim;
exports.RegExpPrim = RegExpPrim;
exports.Param = Param;
exports.Alt = Alt;
exports.Extend = Extend;
exports.Seq = Seq;
exports.Iter = Iter;
exports.Star = Star;
exports.Plus = Plus;
exports.Opt = Opt;
exports.Not = Not;
exports.Lookahead = Lookahead;
exports.Arr = Arr;
exports.Str = Str;
exports.Obj = Obj;
exports.Apply = Apply;

// --------------------------------------------------------------------
// Extensions
// --------------------------------------------------------------------

_dereq_('./pexprs-assertAllApplicationsAreValid');
_dereq_('./pexprs-assertChoicesHaveUniformArity');
_dereq_('./pexprs-assertIteratedExprsAreNotNullable');
_dereq_('./pexprs-check');
_dereq_('./pexprs-eval');
_dereq_('./pexprs-maybeRecordFailure');
_dereq_('./pexprs-getArity');
_dereq_('./pexprs-outputRecipe');
_dereq_('./pexprs-introduceParams');
_dereq_('./pexprs-isNullable');
_dereq_('./pexprs-substituteParams');
_dereq_('./pexprs-toDisplayString');
_dereq_('./pexprs-toExpected');
_dereq_('./pexprs-toString');

},{"./common":26,"./errors":27,"./pexprs-assertAllApplicationsAreValid":30,"./pexprs-assertChoicesHaveUniformArity":31,"./pexprs-assertIteratedExprsAreNotNullable":32,"./pexprs-check":33,"./pexprs-eval":34,"./pexprs-getArity":35,"./pexprs-introduceParams":36,"./pexprs-isNullable":37,"./pexprs-maybeRecordFailure":38,"./pexprs-outputRecipe":39,"./pexprs-substituteParams":40,"./pexprs-toDisplayString":41,"./pexprs-toExpected":42,"./pexprs-toString":43,"inherits":12}],45:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// Given an array of numbers `arr`, return an array of the numbers as strings,
// right-justified and padded to the same length.
function padNumbersToEqualLength(arr) {
  var maxLen = 0;
  var strings = arr.map(function(n) {
    var str = n.toString();
    maxLen = Math.max(maxLen, str.length);
    return str;
  });
  return strings.map(function(s) { return common.padLeft(s, maxLen); });
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

// Return an object with the line and column information for the given
// offset in `str`.
exports.getLineAndColumn = function(str, offset) {
  var lineNum = 1;
  var colNum = 1;

  var currOffset = 0;
  var lineStartOffset = 0;

  var nextLine = null;
  var prevLine = null;
  var prevLineStartOffset = -1;

  while (currOffset < offset) {
    var c = str.charAt(currOffset++);
    if (c === '\n') {
      lineNum++;
      colNum = 1;
      prevLineStartOffset = lineStartOffset;
      lineStartOffset = currOffset;
    } else if (c !== '\r') {
      colNum++;
    }
  }

  // Find the end of the target line.
  var lineEndOffset = str.indexOf('\n', lineStartOffset);
  if (lineEndOffset === -1) {
    lineEndOffset = str.length;
  } else {
    // Get the next line.
    var nextLineEndOffset = str.indexOf('\n', lineEndOffset + 1);
    nextLine = nextLineEndOffset === -1 ? str.slice(lineEndOffset)
                                        : str.slice(lineEndOffset, nextLineEndOffset);
    // Strip leading and trailing EOL char(s).
    nextLine = nextLine.replace(/^\r?\n/, '').replace(/\r$/, '');
  }

  // Get the previous line.
  if (prevLineStartOffset >= 0) {
    prevLine = str.slice(prevLineStartOffset, lineStartOffset)
                  .replace(/\r?\n$/, '');  // Strip trailing EOL char(s).
  }

  // Get the target line, stripping a trailing carriage return if necessary.
  var line = str.slice(lineStartOffset, lineEndOffset).replace(/\r$/, '');

  return {
    lineNum: lineNum,
    colNum: colNum,
    line: line,
    prevLine: prevLine,
    nextLine: nextLine
  };
};

// Return a nicely-formatted string describing the line and column for the
// given offset in `str`.
exports.getLineAndColumnMessage = function(str, offset) {
  var lineAndCol = exports.getLineAndColumn(str, offset);
  var sb = new common.StringBuffer();
  sb.append('Line ' + lineAndCol.lineNum + ', col ' + lineAndCol.colNum + ':\n');

  // An array of the previous, current, and next line numbers as strings of equal length.
  var lineNumbers = padNumbersToEqualLength([
      lineAndCol.prevLine == null ? 0 : lineAndCol.lineNum - 1,
      lineAndCol.lineNum,
      lineAndCol.nextLine == null ? 0 : lineAndCol.lineNum + 1
  ]);

  // Helper for appending formatting input lines to the buffer.
  function appendLine(num, content, prefix) {
    sb.append(prefix + lineNumbers[num] + ' | ' + content + '\n');
  }

  // Include the previous line for context if possible.
  if (lineAndCol.prevLine != null) {
    appendLine(0, lineAndCol.prevLine, '  ');
  }
  // Line that the error occurred on.
  appendLine(1, lineAndCol.line, '> ');

  // Line indicating the column on which the error occurred.
  var gutterWidth = 2 + lineNumbers[1].length + 3;
  sb.append(common.padLeft('^', gutterWidth + lineAndCol.colNum) + '\n');

  // Include the next line for context if possible.
  if (lineAndCol.nextLine != null) {
    appendLine(2, lineAndCol.nextLine, '  ');
  }
  return sb.contents();
};

},{"./common":26}],46:[function(_dereq_,module,exports){
// From https://code.google.com/p/es-lab/source/browse/trunk/src/parser/unicode.js
exports.UnicodeCategories = {
  ZWNJ : /\u200C/,
  ZWJ  : /\u200D/,
  TAB  : /\u0009/,
  VT   : /\u000B/,
  FF   : /\u000C/,
  SP   : /\u0020/,
  NBSP : /\u00A0/,
  BOM  : /\uFEFF/,
  LF   : /\u000A/,
  CR   : /\u000D/,
  LS   : /\u2028/,
  PS   : /\u2029/,
  L    : /[\u0041-\u005A]|[\u00C0-\u00D6]|[\u00D8-\u00DE]|[\u0100-\u0100]|[\u0102-\u0102]|[\u0104-\u0104]|[\u0106-\u0106]|[\u0108-\u0108]|[\u010A-\u010A]|[\u010C-\u010C]|[\u010E-\u010E]|[\u0110-\u0110]|[\u0112-\u0112]|[\u0114-\u0114]|[\u0116-\u0116]|[\u0118-\u0118]|[\u011A-\u011A]|[\u011C-\u011C]|[\u011E-\u011E]|[\u0120-\u0120]|[\u0122-\u0122]|[\u0124-\u0124]|[\u0126-\u0126]|[\u0128-\u0128]|[\u012A-\u012A]|[\u012C-\u012C]|[\u012E-\u012E]|[\u0130-\u0130]|[\u0132-\u0132]|[\u0134-\u0134]|[\u0136-\u0136]|[\u0139-\u0139]|[\u013B-\u013B]|[\u013D-\u013D]|[\u013F-\u013F]|[\u0141-\u0141]|[\u0143-\u0143]|[\u0145-\u0145]|[\u0147-\u0147]|[\u014A-\u014A]|[\u014C-\u014C]|[\u014E-\u014E]|[\u0150-\u0150]|[\u0152-\u0152]|[\u0154-\u0154]|[\u0156-\u0156]|[\u0158-\u0158]|[\u015A-\u015A]|[\u015C-\u015C]|[\u015E-\u015E]|[\u0160-\u0160]|[\u0162-\u0162]|[\u0164-\u0164]|[\u0166-\u0166]|[\u0168-\u0168]|[\u016A-\u016A]|[\u016C-\u016C]|[\u016E-\u016E]|[\u0170-\u0170]|[\u0172-\u0172]|[\u0174-\u0174]|[\u0176-\u0176]|[\u0178-\u0179]|[\u017B-\u017B]|[\u017D-\u017D]|[\u0181-\u0182]|[\u0184-\u0184]|[\u0186-\u0187]|[\u0189-\u018B]|[\u018E-\u0191]|[\u0193-\u0194]|[\u0196-\u0198]|[\u019C-\u019D]|[\u019F-\u01A0]|[\u01A2-\u01A2]|[\u01A4-\u01A4]|[\u01A6-\u01A7]|[\u01A9-\u01A9]|[\u01AC-\u01AC]|[\u01AE-\u01AF]|[\u01B1-\u01B3]|[\u01B5-\u01B5]|[\u01B7-\u01B8]|[\u01BC-\u01BC]|[\u01C4-\u01C4]|[\u01C7-\u01C7]|[\u01CA-\u01CA]|[\u01CD-\u01CD]|[\u01CF-\u01CF]|[\u01D1-\u01D1]|[\u01D3-\u01D3]|[\u01D5-\u01D5]|[\u01D7-\u01D7]|[\u01D9-\u01D9]|[\u01DB-\u01DB]|[\u01DE-\u01DE]|[\u01E0-\u01E0]|[\u01E2-\u01E2]|[\u01E4-\u01E4]|[\u01E6-\u01E6]|[\u01E8-\u01E8]|[\u01EA-\u01EA]|[\u01EC-\u01EC]|[\u01EE-\u01EE]|[\u01F1-\u01F1]|[\u01F4-\u01F4]|[\u01FA-\u01FA]|[\u01FC-\u01FC]|[\u01FE-\u01FE]|[\u0200-\u0200]|[\u0202-\u0202]|[\u0204-\u0204]|[\u0206-\u0206]|[\u0208-\u0208]|[\u020A-\u020A]|[\u020C-\u020C]|[\u020E-\u020E]|[\u0210-\u0210]|[\u0212-\u0212]|[\u0214-\u0214]|[\u0216-\u0216]|[\u0386-\u0386]|[\u0388-\u038A]|[\u038C-\u038C]|[\u038E-\u038F]|[\u0391-\u03A1]|[\u03A3-\u03AB]|[\u03D2-\u03D4]|[\u03DA-\u03DA]|[\u03DC-\u03DC]|[\u03DE-\u03DE]|[\u03E0-\u03E0]|[\u03E2-\u03E2]|[\u03E4-\u03E4]|[\u03E6-\u03E6]|[\u03E8-\u03E8]|[\u03EA-\u03EA]|[\u03EC-\u03EC]|[\u03EE-\u03EE]|[\u0401-\u040C]|[\u040E-\u042F]|[\u0460-\u0460]|[\u0462-\u0462]|[\u0464-\u0464]|[\u0466-\u0466]|[\u0468-\u0468]|[\u046A-\u046A]|[\u046C-\u046C]|[\u046E-\u046E]|[\u0470-\u0470]|[\u0472-\u0472]|[\u0474-\u0474]|[\u0476-\u0476]|[\u0478-\u0478]|[\u047A-\u047A]|[\u047C-\u047C]|[\u047E-\u047E]|[\u0480-\u0480]|[\u0490-\u0490]|[\u0492-\u0492]|[\u0494-\u0494]|[\u0496-\u0496]|[\u0498-\u0498]|[\u049A-\u049A]|[\u049C-\u049C]|[\u049E-\u049E]|[\u04A0-\u04A0]|[\u04A2-\u04A2]|[\u04A4-\u04A4]|[\u04A6-\u04A6]|[\u04A8-\u04A8]|[\u04AA-\u04AA]|[\u04AC-\u04AC]|[\u04AE-\u04AE]|[\u04B0-\u04B0]|[\u04B2-\u04B2]|[\u04B4-\u04B4]|[\u04B6-\u04B6]|[\u04B8-\u04B8]|[\u04BA-\u04BA]|[\u04BC-\u04BC]|[\u04BE-\u04BE]|[\u04C1-\u04C1]|[\u04C3-\u04C3]|[\u04C7-\u04C7]|[\u04CB-\u04CB]|[\u04D0-\u04D0]|[\u04D2-\u04D2]|[\u04D4-\u04D4]|[\u04D6-\u04D6]|[\u04D8-\u04D8]|[\u04DA-\u04DA]|[\u04DC-\u04DC]|[\u04DE-\u04DE]|[\u04E0-\u04E0]|[\u04E2-\u04E2]|[\u04E4-\u04E4]|[\u04E6-\u04E6]|[\u04E8-\u04E8]|[\u04EA-\u04EA]|[\u04EE-\u04EE]|[\u04F0-\u04F0]|[\u04F2-\u04F2]|[\u04F4-\u04F4]|[\u04F8-\u04F8]|[\u0531-\u0556]|[\u10A0-\u10C5]|[\u1E00-\u1E00]|[\u1E02-\u1E02]|[\u1E04-\u1E04]|[\u1E06-\u1E06]|[\u1E08-\u1E08]|[\u1E0A-\u1E0A]|[\u1E0C-\u1E0C]|[\u1E0E-\u1E0E]|[\u1E10-\u1E10]|[\u1E12-\u1E12]|[\u1E14-\u1E14]|[\u1E16-\u1E16]|[\u1E18-\u1E18]|[\u1E1A-\u1E1A]|[\u1E1C-\u1E1C]|[\u1E1E-\u1E1E]|[\u1E20-\u1E20]|[\u1E22-\u1E22]|[\u1E24-\u1E24]|[\u1E26-\u1E26]|[\u1E28-\u1E28]|[\u1E2A-\u1E2A]|[\u1E2C-\u1E2C]|[\u1E2E-\u1E2E]|[\u1E30-\u1E30]|[\u1E32-\u1E32]|[\u1E34-\u1E34]|[\u1E36-\u1E36]|[\u1E38-\u1E38]|[\u1E3A-\u1E3A]|[\u1E3C-\u1E3C]|[\u1E3E-\u1E3E]|[\u1E40-\u1E40]|[\u1E42-\u1E42]|[\u1E44-\u1E44]|[\u1E46-\u1E46]|[\u1E48-\u1E48]|[\u1E4A-\u1E4A]|[\u1E4C-\u1E4C]|[\u1E4E-\u1E4E]|[\u1E50-\u1E50]|[\u1E52-\u1E52]|[\u1E54-\u1E54]|[\u1E56-\u1E56]|[\u1E58-\u1E58]|[\u1E5A-\u1E5A]|[\u1E5C-\u1E5C]|[\u1E5E-\u1E5E]|[\u1E60-\u1E60]|[\u1E62-\u1E62]|[\u1E64-\u1E64]|[\u1E66-\u1E66]|[\u1E68-\u1E68]|[\u1E6A-\u1E6A]|[\u1E6C-\u1E6C]|[\u1E6E-\u1E6E]|[\u1E70-\u1E70]|[\u1E72-\u1E72]|[\u1E74-\u1E74]|[\u1E76-\u1E76]|[\u1E78-\u1E78]|[\u1E7A-\u1E7A]|[\u1E7C-\u1E7C]|[\u1E7E-\u1E7E]|[\u1E80-\u1E80]|[\u1E82-\u1E82]|[\u1E84-\u1E84]|[\u1E86-\u1E86]|[\u1E88-\u1E88]|[\u1E8A-\u1E8A]|[\u1E8C-\u1E8C]|[\u1E8E-\u1E8E]|[\u1E90-\u1E90]|[\u1E92-\u1E92]|[\u1E94-\u1E94]|[\u1EA0-\u1EA0]|[\u1EA2-\u1EA2]|[\u1EA4-\u1EA4]|[\u1EA6-\u1EA6]|[\u1EA8-\u1EA8]|[\u1EAA-\u1EAA]|[\u1EAC-\u1EAC]|[\u1EAE-\u1EAE]|[\u1EB0-\u1EB0]|[\u1EB2-\u1EB2]|[\u1EB4-\u1EB4]|[\u1EB6-\u1EB6]|[\u1EB8-\u1EB8]|[\u1EBA-\u1EBA]|[\u1EBC-\u1EBC]|[\u1EBE-\u1EBE]|[\u1EC0-\u1EC0]|[\u1EC2-\u1EC2]|[\u1EC4-\u1EC4]|[\u1EC6-\u1EC6]|[\u1EC8-\u1EC8]|[\u1ECA-\u1ECA]|[\u1ECC-\u1ECC]|[\u1ECE-\u1ECE]|[\u1ED0-\u1ED0]|[\u1ED2-\u1ED2]|[\u1ED4-\u1ED4]|[\u1ED6-\u1ED6]|[\u1ED8-\u1ED8]|[\u1EDA-\u1EDA]|[\u1EDC-\u1EDC]|[\u1EDE-\u1EDE]|[\u1EE0-\u1EE0]|[\u1EE2-\u1EE2]|[\u1EE4-\u1EE4]|[\u1EE6-\u1EE6]|[\u1EE8-\u1EE8]|[\u1EEA-\u1EEA]|[\u1EEC-\u1EEC]|[\u1EEE-\u1EEE]|[\u1EF0-\u1EF0]|[\u1EF2-\u1EF2]|[\u1EF4-\u1EF4]|[\u1EF6-\u1EF6]|[\u1EF8-\u1EF8]|[\u1F08-\u1F0F]|[\u1F18-\u1F1D]|[\u1F28-\u1F2F]|[\u1F38-\u1F3F]|[\u1F48-\u1F4D]|[\u1F59-\u1F59]|[\u1F5B-\u1F5B]|[\u1F5D-\u1F5D]|[\u1F5F-\u1F5F]|[\u1F68-\u1F6F]|[\u1F88-\u1F8F]|[\u1F98-\u1F9F]|[\u1FA8-\u1FAF]|[\u1FB8-\u1FBC]|[\u1FC8-\u1FCC]|[\u1FD8-\u1FDB]|[\u1FE8-\u1FEC]|[\u1FF8-\u1FFC]|[\u2102-\u2102]|[\u2107-\u2107]|[\u210B-\u210D]|[\u2110-\u2112]|[\u2115-\u2115]|[\u2119-\u211D]|[\u2124-\u2124]|[\u2126-\u2126]|[\u2128-\u2128]|[\u212A-\u212D]|[\u2130-\u2131]|[\u2133-\u2133]|[\uFF21-\uFF3A]|[\u0061-\u007A]|[\u00AA-\u00AA]|[\u00B5-\u00B5]|[\u00BA-\u00BA]|[\u00DF-\u00F6]|[\u00F8-\u00FF]|[\u0101-\u0101]|[\u0103-\u0103]|[\u0105-\u0105]|[\u0107-\u0107]|[\u0109-\u0109]|[\u010B-\u010B]|[\u010D-\u010D]|[\u010F-\u010F]|[\u0111-\u0111]|[\u0113-\u0113]|[\u0115-\u0115]|[\u0117-\u0117]|[\u0119-\u0119]|[\u011B-\u011B]|[\u011D-\u011D]|[\u011F-\u011F]|[\u0121-\u0121]|[\u0123-\u0123]|[\u0125-\u0125]|[\u0127-\u0127]|[\u0129-\u0129]|[\u012B-\u012B]|[\u012D-\u012D]|[\u012F-\u012F]|[\u0131-\u0131]|[\u0133-\u0133]|[\u0135-\u0135]|[\u0137-\u0138]|[\u013A-\u013A]|[\u013C-\u013C]|[\u013E-\u013E]|[\u0140-\u0140]|[\u0142-\u0142]|[\u0144-\u0144]|[\u0146-\u0146]|[\u0148-\u0149]|[\u014B-\u014B]|[\u014D-\u014D]|[\u014F-\u014F]|[\u0151-\u0151]|[\u0153-\u0153]|[\u0155-\u0155]|[\u0157-\u0157]|[\u0159-\u0159]|[\u015B-\u015B]|[\u015D-\u015D]|[\u015F-\u015F]|[\u0161-\u0161]|[\u0163-\u0163]|[\u0165-\u0165]|[\u0167-\u0167]|[\u0169-\u0169]|[\u016B-\u016B]|[\u016D-\u016D]|[\u016F-\u016F]|[\u0171-\u0171]|[\u0173-\u0173]|[\u0175-\u0175]|[\u0177-\u0177]|[\u017A-\u017A]|[\u017C-\u017C]|[\u017E-\u0180]|[\u0183-\u0183]|[\u0185-\u0185]|[\u0188-\u0188]|[\u018C-\u018D]|[\u0192-\u0192]|[\u0195-\u0195]|[\u0199-\u019B]|[\u019E-\u019E]|[\u01A1-\u01A1]|[\u01A3-\u01A3]|[\u01A5-\u01A5]|[\u01A8-\u01A8]|[\u01AB-\u01AB]|[\u01AD-\u01AD]|[\u01B0-\u01B0]|[\u01B4-\u01B4]|[\u01B6-\u01B6]|[\u01B9-\u01BA]|[\u01BD-\u01BD]|[\u01C6-\u01C6]|[\u01C9-\u01C9]|[\u01CC-\u01CC]|[\u01CE-\u01CE]|[\u01D0-\u01D0]|[\u01D2-\u01D2]|[\u01D4-\u01D4]|[\u01D6-\u01D6]|[\u01D8-\u01D8]|[\u01DA-\u01DA]|[\u01DC-\u01DD]|[\u01DF-\u01DF]|[\u01E1-\u01E1]|[\u01E3-\u01E3]|[\u01E5-\u01E5]|[\u01E7-\u01E7]|[\u01E9-\u01E9]|[\u01EB-\u01EB]|[\u01ED-\u01ED]|[\u01EF-\u01F0]|[\u01F3-\u01F3]|[\u01F5-\u01F5]|[\u01FB-\u01FB]|[\u01FD-\u01FD]|[\u01FF-\u01FF]|[\u0201-\u0201]|[\u0203-\u0203]|[\u0205-\u0205]|[\u0207-\u0207]|[\u0209-\u0209]|[\u020B-\u020B]|[\u020D-\u020D]|[\u020F-\u020F]|[\u0211-\u0211]|[\u0213-\u0213]|[\u0215-\u0215]|[\u0217-\u0217]|[\u0250-\u02A8]|[\u0390-\u0390]|[\u03AC-\u03CE]|[\u03D0-\u03D1]|[\u03D5-\u03D6]|[\u03E3-\u03E3]|[\u03E5-\u03E5]|[\u03E7-\u03E7]|[\u03E9-\u03E9]|[\u03EB-\u03EB]|[\u03ED-\u03ED]|[\u03EF-\u03F2]|[\u0430-\u044F]|[\u0451-\u045C]|[\u045E-\u045F]|[\u0461-\u0461]|[\u0463-\u0463]|[\u0465-\u0465]|[\u0467-\u0467]|[\u0469-\u0469]|[\u046B-\u046B]|[\u046D-\u046D]|[\u046F-\u046F]|[\u0471-\u0471]|[\u0473-\u0473]|[\u0475-\u0475]|[\u0477-\u0477]|[\u0479-\u0479]|[\u047B-\u047B]|[\u047D-\u047D]|[\u047F-\u047F]|[\u0481-\u0481]|[\u0491-\u0491]|[\u0493-\u0493]|[\u0495-\u0495]|[\u0497-\u0497]|[\u0499-\u0499]|[\u049B-\u049B]|[\u049D-\u049D]|[\u049F-\u049F]|[\u04A1-\u04A1]|[\u04A3-\u04A3]|[\u04A5-\u04A5]|[\u04A7-\u04A7]|[\u04A9-\u04A9]|[\u04AB-\u04AB]|[\u04AD-\u04AD]|[\u04AF-\u04AF]|[\u04B1-\u04B1]|[\u04B3-\u04B3]|[\u04B5-\u04B5]|[\u04B7-\u04B7]|[\u04B9-\u04B9]|[\u04BB-\u04BB]|[\u04BD-\u04BD]|[\u04BF-\u04BF]|[\u04C2-\u04C2]|[\u04C4-\u04C4]|[\u04C8-\u04C8]|[\u04CC-\u04CC]|[\u04D1-\u04D1]|[\u04D3-\u04D3]|[\u04D5-\u04D5]|[\u04D7-\u04D7]|[\u04D9-\u04D9]|[\u04DB-\u04DB]|[\u04DD-\u04DD]|[\u04DF-\u04DF]|[\u04E1-\u04E1]|[\u04E3-\u04E3]|[\u04E5-\u04E5]|[\u04E7-\u04E7]|[\u04E9-\u04E9]|[\u04EB-\u04EB]|[\u04EF-\u04EF]|[\u04F1-\u04F1]|[\u04F3-\u04F3]|[\u04F5-\u04F5]|[\u04F9-\u04F9]|[\u0561-\u0587]|[\u10D0-\u10F6]|[\u1E01-\u1E01]|[\u1E03-\u1E03]|[\u1E05-\u1E05]|[\u1E07-\u1E07]|[\u1E09-\u1E09]|[\u1E0B-\u1E0B]|[\u1E0D-\u1E0D]|[\u1E0F-\u1E0F]|[\u1E11-\u1E11]|[\u1E13-\u1E13]|[\u1E15-\u1E15]|[\u1E17-\u1E17]|[\u1E19-\u1E19]|[\u1E1B-\u1E1B]|[\u1E1D-\u1E1D]|[\u1E1F-\u1E1F]|[\u1E21-\u1E21]|[\u1E23-\u1E23]|[\u1E25-\u1E25]|[\u1E27-\u1E27]|[\u1E29-\u1E29]|[\u1E2B-\u1E2B]|[\u1E2D-\u1E2D]|[\u1E2F-\u1E2F]|[\u1E31-\u1E31]|[\u1E33-\u1E33]|[\u1E35-\u1E35]|[\u1E37-\u1E37]|[\u1E39-\u1E39]|[\u1E3B-\u1E3B]|[\u1E3D-\u1E3D]|[\u1E3F-\u1E3F]|[\u1E41-\u1E41]|[\u1E43-\u1E43]|[\u1E45-\u1E45]|[\u1E47-\u1E47]|[\u1E49-\u1E49]|[\u1E4B-\u1E4B]|[\u1E4D-\u1E4D]|[\u1E4F-\u1E4F]|[\u1E51-\u1E51]|[\u1E53-\u1E53]|[\u1E55-\u1E55]|[\u1E57-\u1E57]|[\u1E59-\u1E59]|[\u1E5B-\u1E5B]|[\u1E5D-\u1E5D]|[\u1E5F-\u1E5F]|[\u1E61-\u1E61]|[\u1E63-\u1E63]|[\u1E65-\u1E65]|[\u1E67-\u1E67]|[\u1E69-\u1E69]|[\u1E6B-\u1E6B]|[\u1E6D-\u1E6D]|[\u1E6F-\u1E6F]|[\u1E71-\u1E71]|[\u1E73-\u1E73]|[\u1E75-\u1E75]|[\u1E77-\u1E77]|[\u1E79-\u1E79]|[\u1E7B-\u1E7B]|[\u1E7D-\u1E7D]|[\u1E7F-\u1E7F]|[\u1E81-\u1E81]|[\u1E83-\u1E83]|[\u1E85-\u1E85]|[\u1E87-\u1E87]|[\u1E89-\u1E89]|[\u1E8B-\u1E8B]|[\u1E8D-\u1E8D]|[\u1E8F-\u1E8F]|[\u1E91-\u1E91]|[\u1E93-\u1E93]|[\u1E95-\u1E9B]|[\u1EA1-\u1EA1]|[\u1EA3-\u1EA3]|[\u1EA5-\u1EA5]|[\u1EA7-\u1EA7]|[\u1EA9-\u1EA9]|[\u1EAB-\u1EAB]|[\u1EAD-\u1EAD]|[\u1EAF-\u1EAF]|[\u1EB1-\u1EB1]|[\u1EB3-\u1EB3]|[\u1EB5-\u1EB5]|[\u1EB7-\u1EB7]|[\u1EB9-\u1EB9]|[\u1EBB-\u1EBB]|[\u1EBD-\u1EBD]|[\u1EBF-\u1EBF]|[\u1EC1-\u1EC1]|[\u1EC3-\u1EC3]|[\u1EC5-\u1EC5]|[\u1EC7-\u1EC7]|[\u1EC9-\u1EC9]|[\u1ECB-\u1ECB]|[\u1ECD-\u1ECD]|[\u1ECF-\u1ECF]|[\u1ED1-\u1ED1]|[\u1ED3-\u1ED3]|[\u1ED5-\u1ED5]|[\u1ED7-\u1ED7]|[\u1ED9-\u1ED9]|[\u1EDB-\u1EDB]|[\u1EDD-\u1EDD]|[\u1EDF-\u1EDF]|[\u1EE1-\u1EE1]|[\u1EE3-\u1EE3]|[\u1EE5-\u1EE5]|[\u1EE7-\u1EE7]|[\u1EE9-\u1EE9]|[\u1EEB-\u1EEB]|[\u1EED-\u1EED]|[\u1EEF-\u1EEF]|[\u1EF1-\u1EF1]|[\u1EF3-\u1EF3]|[\u1EF5-\u1EF5]|[\u1EF7-\u1EF7]|[\u1EF9-\u1EF9]|[\u1F00-\u1F07]|[\u1F10-\u1F15]|[\u1F20-\u1F27]|[\u1F30-\u1F37]|[\u1F40-\u1F45]|[\u1F50-\u1F57]|[\u1F60-\u1F67]|[\u1F70-\u1F7D]|[\u1F80-\u1F87]|[\u1F90-\u1F97]|[\u1FA0-\u1FA7]|[\u1FB0-\u1FB4]|[\u1FB6-\u1FB7]|[\u1FBE-\u1FBE]|[\u1FC2-\u1FC4]|[\u1FC6-\u1FC7]|[\u1FD0-\u1FD3]|[\u1FD6-\u1FD7]|[\u1FE0-\u1FE7]|[\u1FF2-\u1FF4]|[\u1FF6-\u1FF7]|[\u207F-\u207F]|[\u210A-\u210A]|[\u210E-\u210F]|[\u2113-\u2113]|[\u2118-\u2118]|[\u212E-\u212F]|[\u2134-\u2134]|[\uFB00-\uFB06]|[\uFB13-\uFB17]|[\uFF41-\uFF5A]|[\u01C5-\u01C5]|[\u01C8-\u01C8]|[\u01CB-\u01CB]|[\u01F2-\u01F2]|[\u02B0-\u02B8]|[\u02BB-\u02C1]|[\u02D0-\u02D1]|[\u02E0-\u02E4]|[\u037A-\u037A]|[\u0559-\u0559]|[\u0640-\u0640]|[\u06E5-\u06E6]|[\u0E46-\u0E46]|[\u0EC6-\u0EC6]|[\u3005-\u3005]|[\u3031-\u3035]|[\u309D-\u309E]|[\u30FC-\u30FE]|[\uFF70-\uFF70]|[\uFF9E-\uFF9F]|[\u01AA-\u01AA]|[\u01BB-\u01BB]|[\u01BE-\u01C3]|[\u03F3-\u03F3]|[\u04C0-\u04C0]|[\u05D0-\u05EA]|[\u05F0-\u05F2]|[\u0621-\u063A]|[\u0641-\u064A]|[\u0671-\u06B7]|[\u06BA-\u06BE]|[\u06C0-\u06CE]|[\u06D0-\u06D3]|[\u06D5-\u06D5]|[\u0905-\u0939]|[\u093D-\u093D]|[\u0950-\u0950]|[\u0958-\u0961]|[\u0985-\u098C]|[\u098F-\u0990]|[\u0993-\u09A8]|[\u09AA-\u09B0]|[\u09B2-\u09B2]|[\u09B6-\u09B9]|[\u09DC-\u09DD]|[\u09DF-\u09E1]|[\u09F0-\u09F1]|[\u0A05-\u0A0A]|[\u0A0F-\u0A10]|[\u0A13-\u0A28]|[\u0A2A-\u0A30]|[\u0A32-\u0A33]|[\u0A35-\u0A36]|[\u0A38-\u0A39]|[\u0A59-\u0A5C]|[\u0A5E-\u0A5E]|[\u0A72-\u0A74]|[\u0A85-\u0A8B]|[\u0A8D-\u0A8D]|[\u0A8F-\u0A91]|[\u0A93-\u0AA8]|[\u0AAA-\u0AB0]|[\u0AB2-\u0AB3]|[\u0AB5-\u0AB9]|[\u0ABD-\u0ABD]|[\u0AD0-\u0AD0]|[\u0AE0-\u0AE0]|[\u0B05-\u0B0C]|[\u0B0F-\u0B10]|[\u0B13-\u0B28]|[\u0B2A-\u0B30]|[\u0B32-\u0B33]|[\u0B36-\u0B39]|[\u0B3D-\u0B3D]|[\u0B5C-\u0B5D]|[\u0B5F-\u0B61]|[\u0B85-\u0B8A]|[\u0B8E-\u0B90]|[\u0B92-\u0B95]|[\u0B99-\u0B9A]|[\u0B9C-\u0B9C]|[\u0B9E-\u0B9F]|[\u0BA3-\u0BA4]|[\u0BA8-\u0BAA]|[\u0BAE-\u0BB5]|[\u0BB7-\u0BB9]|[\u0C05-\u0C0C]|[\u0C0E-\u0C10]|[\u0C12-\u0C28]|[\u0C2A-\u0C33]|[\u0C35-\u0C39]|[\u0C60-\u0C61]|[\u0C85-\u0C8C]|[\u0C8E-\u0C90]|[\u0C92-\u0CA8]|[\u0CAA-\u0CB3]|[\u0CB5-\u0CB9]|[\u0CDE-\u0CDE]|[\u0CE0-\u0CE1]|[\u0D05-\u0D0C]|[\u0D0E-\u0D10]|[\u0D12-\u0D28]|[\u0D2A-\u0D39]|[\u0D60-\u0D61]|[\u0E01-\u0E30]|[\u0E32-\u0E33]|[\u0E40-\u0E45]|[\u0E81-\u0E82]|[\u0E84-\u0E84]|[\u0E87-\u0E88]|[\u0E8A-\u0E8A]|[\u0E8D-\u0E8D]|[\u0E94-\u0E97]|[\u0E99-\u0E9F]|[\u0EA1-\u0EA3]|[\u0EA5-\u0EA5]|[\u0EA7-\u0EA7]|[\u0EAA-\u0EAB]|[\u0EAD-\u0EB0]|[\u0EB2-\u0EB3]|[\u0EBD-\u0EBD]|[\u0EC0-\u0EC4]|[\u0EDC-\u0EDD]|[\u0F00-\u0F00]|[\u0F40-\u0F47]|[\u0F49-\u0F69]|[\u0F88-\u0F8B]|[\u1100-\u1159]|[\u115F-\u11A2]|[\u11A8-\u11F9]|[\u2135-\u2138]|[\u3006-\u3006]|[\u3041-\u3094]|[\u30A1-\u30FA]|[\u3105-\u312C]|[\u3131-\u318E]|[\u4E00-\u9FA5]|[\uAC00-\uD7A3]|[\uF900-\uFA2D]|[\uFB1F-\uFB28]|[\uFB2A-\uFB36]|[\uFB38-\uFB3C]|[\uFB3E-\uFB3E]|[\uFB40-\uFB41]|[\uFB43-\uFB44]|[\uFB46-\uFBB1]|[\uFBD3-\uFD3D]|[\uFD50-\uFD8F]|[\uFD92-\uFDC7]|[\uFDF0-\uFDFB]|[\uFE70-\uFE72]|[\uFE74-\uFE74]|[\uFE76-\uFEFC]|[\uFF66-\uFF6F]|[\uFF71-\uFF9D]|[\uFFA0-\uFFBE]|[\uFFC2-\uFFC7]|[\uFFCA-\uFFCF]|[\uFFD2-\uFFD7]|[\uFFDA-\uFFDC]/,

/* L = union of the below Unicode categories */
  Lu   : /[\u0041-\u005A]|[\u00C0-\u00D6]|[\u00D8-\u00DE]|[\u0100-\u0100]|[\u0102-\u0102]|[\u0104-\u0104]|[\u0106-\u0106]|[\u0108-\u0108]|[\u010A-\u010A]|[\u010C-\u010C]|[\u010E-\u010E]|[\u0110-\u0110]|[\u0112-\u0112]|[\u0114-\u0114]|[\u0116-\u0116]|[\u0118-\u0118]|[\u011A-\u011A]|[\u011C-\u011C]|[\u011E-\u011E]|[\u0120-\u0120]|[\u0122-\u0122]|[\u0124-\u0124]|[\u0126-\u0126]|[\u0128-\u0128]|[\u012A-\u012A]|[\u012C-\u012C]|[\u012E-\u012E]|[\u0130-\u0130]|[\u0132-\u0132]|[\u0134-\u0134]|[\u0136-\u0136]|[\u0139-\u0139]|[\u013B-\u013B]|[\u013D-\u013D]|[\u013F-\u013F]|[\u0141-\u0141]|[\u0143-\u0143]|[\u0145-\u0145]|[\u0147-\u0147]|[\u014A-\u014A]|[\u014C-\u014C]|[\u014E-\u014E]|[\u0150-\u0150]|[\u0152-\u0152]|[\u0154-\u0154]|[\u0156-\u0156]|[\u0158-\u0158]|[\u015A-\u015A]|[\u015C-\u015C]|[\u015E-\u015E]|[\u0160-\u0160]|[\u0162-\u0162]|[\u0164-\u0164]|[\u0166-\u0166]|[\u0168-\u0168]|[\u016A-\u016A]|[\u016C-\u016C]|[\u016E-\u016E]|[\u0170-\u0170]|[\u0172-\u0172]|[\u0174-\u0174]|[\u0176-\u0176]|[\u0178-\u0179]|[\u017B-\u017B]|[\u017D-\u017D]|[\u0181-\u0182]|[\u0184-\u0184]|[\u0186-\u0187]|[\u0189-\u018B]|[\u018E-\u0191]|[\u0193-\u0194]|[\u0196-\u0198]|[\u019C-\u019D]|[\u019F-\u01A0]|[\u01A2-\u01A2]|[\u01A4-\u01A4]|[\u01A6-\u01A7]|[\u01A9-\u01A9]|[\u01AC-\u01AC]|[\u01AE-\u01AF]|[\u01B1-\u01B3]|[\u01B5-\u01B5]|[\u01B7-\u01B8]|[\u01BC-\u01BC]|[\u01C4-\u01C4]|[\u01C7-\u01C7]|[\u01CA-\u01CA]|[\u01CD-\u01CD]|[\u01CF-\u01CF]|[\u01D1-\u01D1]|[\u01D3-\u01D3]|[\u01D5-\u01D5]|[\u01D7-\u01D7]|[\u01D9-\u01D9]|[\u01DB-\u01DB]|[\u01DE-\u01DE]|[\u01E0-\u01E0]|[\u01E2-\u01E2]|[\u01E4-\u01E4]|[\u01E6-\u01E6]|[\u01E8-\u01E8]|[\u01EA-\u01EA]|[\u01EC-\u01EC]|[\u01EE-\u01EE]|[\u01F1-\u01F1]|[\u01F4-\u01F4]|[\u01FA-\u01FA]|[\u01FC-\u01FC]|[\u01FE-\u01FE]|[\u0200-\u0200]|[\u0202-\u0202]|[\u0204-\u0204]|[\u0206-\u0206]|[\u0208-\u0208]|[\u020A-\u020A]|[\u020C-\u020C]|[\u020E-\u020E]|[\u0210-\u0210]|[\u0212-\u0212]|[\u0214-\u0214]|[\u0216-\u0216]|[\u0386-\u0386]|[\u0388-\u038A]|[\u038C-\u038C]|[\u038E-\u038F]|[\u0391-\u03A1]|[\u03A3-\u03AB]|[\u03D2-\u03D4]|[\u03DA-\u03DA]|[\u03DC-\u03DC]|[\u03DE-\u03DE]|[\u03E0-\u03E0]|[\u03E2-\u03E2]|[\u03E4-\u03E4]|[\u03E6-\u03E6]|[\u03E8-\u03E8]|[\u03EA-\u03EA]|[\u03EC-\u03EC]|[\u03EE-\u03EE]|[\u0401-\u040C]|[\u040E-\u042F]|[\u0460-\u0460]|[\u0462-\u0462]|[\u0464-\u0464]|[\u0466-\u0466]|[\u0468-\u0468]|[\u046A-\u046A]|[\u046C-\u046C]|[\u046E-\u046E]|[\u0470-\u0470]|[\u0472-\u0472]|[\u0474-\u0474]|[\u0476-\u0476]|[\u0478-\u0478]|[\u047A-\u047A]|[\u047C-\u047C]|[\u047E-\u047E]|[\u0480-\u0480]|[\u0490-\u0490]|[\u0492-\u0492]|[\u0494-\u0494]|[\u0496-\u0496]|[\u0498-\u0498]|[\u049A-\u049A]|[\u049C-\u049C]|[\u049E-\u049E]|[\u04A0-\u04A0]|[\u04A2-\u04A2]|[\u04A4-\u04A4]|[\u04A6-\u04A6]|[\u04A8-\u04A8]|[\u04AA-\u04AA]|[\u04AC-\u04AC]|[\u04AE-\u04AE]|[\u04B0-\u04B0]|[\u04B2-\u04B2]|[\u04B4-\u04B4]|[\u04B6-\u04B6]|[\u04B8-\u04B8]|[\u04BA-\u04BA]|[\u04BC-\u04BC]|[\u04BE-\u04BE]|[\u04C1-\u04C1]|[\u04C3-\u04C3]|[\u04C7-\u04C7]|[\u04CB-\u04CB]|[\u04D0-\u04D0]|[\u04D2-\u04D2]|[\u04D4-\u04D4]|[\u04D6-\u04D6]|[\u04D8-\u04D8]|[\u04DA-\u04DA]|[\u04DC-\u04DC]|[\u04DE-\u04DE]|[\u04E0-\u04E0]|[\u04E2-\u04E2]|[\u04E4-\u04E4]|[\u04E6-\u04E6]|[\u04E8-\u04E8]|[\u04EA-\u04EA]|[\u04EE-\u04EE]|[\u04F0-\u04F0]|[\u04F2-\u04F2]|[\u04F4-\u04F4]|[\u04F8-\u04F8]|[\u0531-\u0556]|[\u10A0-\u10C5]|[\u1E00-\u1E00]|[\u1E02-\u1E02]|[\u1E04-\u1E04]|[\u1E06-\u1E06]|[\u1E08-\u1E08]|[\u1E0A-\u1E0A]|[\u1E0C-\u1E0C]|[\u1E0E-\u1E0E]|[\u1E10-\u1E10]|[\u1E12-\u1E12]|[\u1E14-\u1E14]|[\u1E16-\u1E16]|[\u1E18-\u1E18]|[\u1E1A-\u1E1A]|[\u1E1C-\u1E1C]|[\u1E1E-\u1E1E]|[\u1E20-\u1E20]|[\u1E22-\u1E22]|[\u1E24-\u1E24]|[\u1E26-\u1E26]|[\u1E28-\u1E28]|[\u1E2A-\u1E2A]|[\u1E2C-\u1E2C]|[\u1E2E-\u1E2E]|[\u1E30-\u1E30]|[\u1E32-\u1E32]|[\u1E34-\u1E34]|[\u1E36-\u1E36]|[\u1E38-\u1E38]|[\u1E3A-\u1E3A]|[\u1E3C-\u1E3C]|[\u1E3E-\u1E3E]|[\u1E40-\u1E40]|[\u1E42-\u1E42]|[\u1E44-\u1E44]|[\u1E46-\u1E46]|[\u1E48-\u1E48]|[\u1E4A-\u1E4A]|[\u1E4C-\u1E4C]|[\u1E4E-\u1E4E]|[\u1E50-\u1E50]|[\u1E52-\u1E52]|[\u1E54-\u1E54]|[\u1E56-\u1E56]|[\u1E58-\u1E58]|[\u1E5A-\u1E5A]|[\u1E5C-\u1E5C]|[\u1E5E-\u1E5E]|[\u1E60-\u1E60]|[\u1E62-\u1E62]|[\u1E64-\u1E64]|[\u1E66-\u1E66]|[\u1E68-\u1E68]|[\u1E6A-\u1E6A]|[\u1E6C-\u1E6C]|[\u1E6E-\u1E6E]|[\u1E70-\u1E70]|[\u1E72-\u1E72]|[\u1E74-\u1E74]|[\u1E76-\u1E76]|[\u1E78-\u1E78]|[\u1E7A-\u1E7A]|[\u1E7C-\u1E7C]|[\u1E7E-\u1E7E]|[\u1E80-\u1E80]|[\u1E82-\u1E82]|[\u1E84-\u1E84]|[\u1E86-\u1E86]|[\u1E88-\u1E88]|[\u1E8A-\u1E8A]|[\u1E8C-\u1E8C]|[\u1E8E-\u1E8E]|[\u1E90-\u1E90]|[\u1E92-\u1E92]|[\u1E94-\u1E94]|[\u1EA0-\u1EA0]|[\u1EA2-\u1EA2]|[\u1EA4-\u1EA4]|[\u1EA6-\u1EA6]|[\u1EA8-\u1EA8]|[\u1EAA-\u1EAA]|[\u1EAC-\u1EAC]|[\u1EAE-\u1EAE]|[\u1EB0-\u1EB0]|[\u1EB2-\u1EB2]|[\u1EB4-\u1EB4]|[\u1EB6-\u1EB6]|[\u1EB8-\u1EB8]|[\u1EBA-\u1EBA]|[\u1EBC-\u1EBC]|[\u1EBE-\u1EBE]|[\u1EC0-\u1EC0]|[\u1EC2-\u1EC2]|[\u1EC4-\u1EC4]|[\u1EC6-\u1EC6]|[\u1EC8-\u1EC8]|[\u1ECA-\u1ECA]|[\u1ECC-\u1ECC]|[\u1ECE-\u1ECE]|[\u1ED0-\u1ED0]|[\u1ED2-\u1ED2]|[\u1ED4-\u1ED4]|[\u1ED6-\u1ED6]|[\u1ED8-\u1ED8]|[\u1EDA-\u1EDA]|[\u1EDC-\u1EDC]|[\u1EDE-\u1EDE]|[\u1EE0-\u1EE0]|[\u1EE2-\u1EE2]|[\u1EE4-\u1EE4]|[\u1EE6-\u1EE6]|[\u1EE8-\u1EE8]|[\u1EEA-\u1EEA]|[\u1EEC-\u1EEC]|[\u1EEE-\u1EEE]|[\u1EF0-\u1EF0]|[\u1EF2-\u1EF2]|[\u1EF4-\u1EF4]|[\u1EF6-\u1EF6]|[\u1EF8-\u1EF8]|[\u1F08-\u1F0F]|[\u1F18-\u1F1D]|[\u1F28-\u1F2F]|[\u1F38-\u1F3F]|[\u1F48-\u1F4D]|[\u1F59-\u1F59]|[\u1F5B-\u1F5B]|[\u1F5D-\u1F5D]|[\u1F5F-\u1F5F]|[\u1F68-\u1F6F]|[\u1F88-\u1F8F]|[\u1F98-\u1F9F]|[\u1FA8-\u1FAF]|[\u1FB8-\u1FBC]|[\u1FC8-\u1FCC]|[\u1FD8-\u1FDB]|[\u1FE8-\u1FEC]|[\u1FF8-\u1FFC]|[\u2102-\u2102]|[\u2107-\u2107]|[\u210B-\u210D]|[\u2110-\u2112]|[\u2115-\u2115]|[\u2119-\u211D]|[\u2124-\u2124]|[\u2126-\u2126]|[\u2128-\u2128]|[\u212A-\u212D]|[\u2130-\u2131]|[\u2133-\u2133]|[\uFF21-\uFF3A]/,
  Ll   : /[\u0061-\u007A]|[\u00AA-\u00AA]|[\u00B5-\u00B5]|[\u00BA-\u00BA]|[\u00DF-\u00F6]|[\u00F8-\u00FF]|[\u0101-\u0101]|[\u0103-\u0103]|[\u0105-\u0105]|[\u0107-\u0107]|[\u0109-\u0109]|[\u010B-\u010B]|[\u010D-\u010D]|[\u010F-\u010F]|[\u0111-\u0111]|[\u0113-\u0113]|[\u0115-\u0115]|[\u0117-\u0117]|[\u0119-\u0119]|[\u011B-\u011B]|[\u011D-\u011D]|[\u011F-\u011F]|[\u0121-\u0121]|[\u0123-\u0123]|[\u0125-\u0125]|[\u0127-\u0127]|[\u0129-\u0129]|[\u012B-\u012B]|[\u012D-\u012D]|[\u012F-\u012F]|[\u0131-\u0131]|[\u0133-\u0133]|[\u0135-\u0135]|[\u0137-\u0138]|[\u013A-\u013A]|[\u013C-\u013C]|[\u013E-\u013E]|[\u0140-\u0140]|[\u0142-\u0142]|[\u0144-\u0144]|[\u0146-\u0146]|[\u0148-\u0149]|[\u014B-\u014B]|[\u014D-\u014D]|[\u014F-\u014F]|[\u0151-\u0151]|[\u0153-\u0153]|[\u0155-\u0155]|[\u0157-\u0157]|[\u0159-\u0159]|[\u015B-\u015B]|[\u015D-\u015D]|[\u015F-\u015F]|[\u0161-\u0161]|[\u0163-\u0163]|[\u0165-\u0165]|[\u0167-\u0167]|[\u0169-\u0169]|[\u016B-\u016B]|[\u016D-\u016D]|[\u016F-\u016F]|[\u0171-\u0171]|[\u0173-\u0173]|[\u0175-\u0175]|[\u0177-\u0177]|[\u017A-\u017A]|[\u017C-\u017C]|[\u017E-\u0180]|[\u0183-\u0183]|[\u0185-\u0185]|[\u0188-\u0188]|[\u018C-\u018D]|[\u0192-\u0192]|[\u0195-\u0195]|[\u0199-\u019B]|[\u019E-\u019E]|[\u01A1-\u01A1]|[\u01A3-\u01A3]|[\u01A5-\u01A5]|[\u01A8-\u01A8]|[\u01AB-\u01AB]|[\u01AD-\u01AD]|[\u01B0-\u01B0]|[\u01B4-\u01B4]|[\u01B6-\u01B6]|[\u01B9-\u01BA]|[\u01BD-\u01BD]|[\u01C6-\u01C6]|[\u01C9-\u01C9]|[\u01CC-\u01CC]|[\u01CE-\u01CE]|[\u01D0-\u01D0]|[\u01D2-\u01D2]|[\u01D4-\u01D4]|[\u01D6-\u01D6]|[\u01D8-\u01D8]|[\u01DA-\u01DA]|[\u01DC-\u01DD]|[\u01DF-\u01DF]|[\u01E1-\u01E1]|[\u01E3-\u01E3]|[\u01E5-\u01E5]|[\u01E7-\u01E7]|[\u01E9-\u01E9]|[\u01EB-\u01EB]|[\u01ED-\u01ED]|[\u01EF-\u01F0]|[\u01F3-\u01F3]|[\u01F5-\u01F5]|[\u01FB-\u01FB]|[\u01FD-\u01FD]|[\u01FF-\u01FF]|[\u0201-\u0201]|[\u0203-\u0203]|[\u0205-\u0205]|[\u0207-\u0207]|[\u0209-\u0209]|[\u020B-\u020B]|[\u020D-\u020D]|[\u020F-\u020F]|[\u0211-\u0211]|[\u0213-\u0213]|[\u0215-\u0215]|[\u0217-\u0217]|[\u0250-\u02A8]|[\u0390-\u0390]|[\u03AC-\u03CE]|[\u03D0-\u03D1]|[\u03D5-\u03D6]|[\u03E3-\u03E3]|[\u03E5-\u03E5]|[\u03E7-\u03E7]|[\u03E9-\u03E9]|[\u03EB-\u03EB]|[\u03ED-\u03ED]|[\u03EF-\u03F2]|[\u0430-\u044F]|[\u0451-\u045C]|[\u045E-\u045F]|[\u0461-\u0461]|[\u0463-\u0463]|[\u0465-\u0465]|[\u0467-\u0467]|[\u0469-\u0469]|[\u046B-\u046B]|[\u046D-\u046D]|[\u046F-\u046F]|[\u0471-\u0471]|[\u0473-\u0473]|[\u0475-\u0475]|[\u0477-\u0477]|[\u0479-\u0479]|[\u047B-\u047B]|[\u047D-\u047D]|[\u047F-\u047F]|[\u0481-\u0481]|[\u0491-\u0491]|[\u0493-\u0493]|[\u0495-\u0495]|[\u0497-\u0497]|[\u0499-\u0499]|[\u049B-\u049B]|[\u049D-\u049D]|[\u049F-\u049F]|[\u04A1-\u04A1]|[\u04A3-\u04A3]|[\u04A5-\u04A5]|[\u04A7-\u04A7]|[\u04A9-\u04A9]|[\u04AB-\u04AB]|[\u04AD-\u04AD]|[\u04AF-\u04AF]|[\u04B1-\u04B1]|[\u04B3-\u04B3]|[\u04B5-\u04B5]|[\u04B7-\u04B7]|[\u04B9-\u04B9]|[\u04BB-\u04BB]|[\u04BD-\u04BD]|[\u04BF-\u04BF]|[\u04C2-\u04C2]|[\u04C4-\u04C4]|[\u04C8-\u04C8]|[\u04CC-\u04CC]|[\u04D1-\u04D1]|[\u04D3-\u04D3]|[\u04D5-\u04D5]|[\u04D7-\u04D7]|[\u04D9-\u04D9]|[\u04DB-\u04DB]|[\u04DD-\u04DD]|[\u04DF-\u04DF]|[\u04E1-\u04E1]|[\u04E3-\u04E3]|[\u04E5-\u04E5]|[\u04E7-\u04E7]|[\u04E9-\u04E9]|[\u04EB-\u04EB]|[\u04EF-\u04EF]|[\u04F1-\u04F1]|[\u04F3-\u04F3]|[\u04F5-\u04F5]|[\u04F9-\u04F9]|[\u0561-\u0587]|[\u10D0-\u10F6]|[\u1E01-\u1E01]|[\u1E03-\u1E03]|[\u1E05-\u1E05]|[\u1E07-\u1E07]|[\u1E09-\u1E09]|[\u1E0B-\u1E0B]|[\u1E0D-\u1E0D]|[\u1E0F-\u1E0F]|[\u1E11-\u1E11]|[\u1E13-\u1E13]|[\u1E15-\u1E15]|[\u1E17-\u1E17]|[\u1E19-\u1E19]|[\u1E1B-\u1E1B]|[\u1E1D-\u1E1D]|[\u1E1F-\u1E1F]|[\u1E21-\u1E21]|[\u1E23-\u1E23]|[\u1E25-\u1E25]|[\u1E27-\u1E27]|[\u1E29-\u1E29]|[\u1E2B-\u1E2B]|[\u1E2D-\u1E2D]|[\u1E2F-\u1E2F]|[\u1E31-\u1E31]|[\u1E33-\u1E33]|[\u1E35-\u1E35]|[\u1E37-\u1E37]|[\u1E39-\u1E39]|[\u1E3B-\u1E3B]|[\u1E3D-\u1E3D]|[\u1E3F-\u1E3F]|[\u1E41-\u1E41]|[\u1E43-\u1E43]|[\u1E45-\u1E45]|[\u1E47-\u1E47]|[\u1E49-\u1E49]|[\u1E4B-\u1E4B]|[\u1E4D-\u1E4D]|[\u1E4F-\u1E4F]|[\u1E51-\u1E51]|[\u1E53-\u1E53]|[\u1E55-\u1E55]|[\u1E57-\u1E57]|[\u1E59-\u1E59]|[\u1E5B-\u1E5B]|[\u1E5D-\u1E5D]|[\u1E5F-\u1E5F]|[\u1E61-\u1E61]|[\u1E63-\u1E63]|[\u1E65-\u1E65]|[\u1E67-\u1E67]|[\u1E69-\u1E69]|[\u1E6B-\u1E6B]|[\u1E6D-\u1E6D]|[\u1E6F-\u1E6F]|[\u1E71-\u1E71]|[\u1E73-\u1E73]|[\u1E75-\u1E75]|[\u1E77-\u1E77]|[\u1E79-\u1E79]|[\u1E7B-\u1E7B]|[\u1E7D-\u1E7D]|[\u1E7F-\u1E7F]|[\u1E81-\u1E81]|[\u1E83-\u1E83]|[\u1E85-\u1E85]|[\u1E87-\u1E87]|[\u1E89-\u1E89]|[\u1E8B-\u1E8B]|[\u1E8D-\u1E8D]|[\u1E8F-\u1E8F]|[\u1E91-\u1E91]|[\u1E93-\u1E93]|[\u1E95-\u1E9B]|[\u1EA1-\u1EA1]|[\u1EA3-\u1EA3]|[\u1EA5-\u1EA5]|[\u1EA7-\u1EA7]|[\u1EA9-\u1EA9]|[\u1EAB-\u1EAB]|[\u1EAD-\u1EAD]|[\u1EAF-\u1EAF]|[\u1EB1-\u1EB1]|[\u1EB3-\u1EB3]|[\u1EB5-\u1EB5]|[\u1EB7-\u1EB7]|[\u1EB9-\u1EB9]|[\u1EBB-\u1EBB]|[\u1EBD-\u1EBD]|[\u1EBF-\u1EBF]|[\u1EC1-\u1EC1]|[\u1EC3-\u1EC3]|[\u1EC5-\u1EC5]|[\u1EC7-\u1EC7]|[\u1EC9-\u1EC9]|[\u1ECB-\u1ECB]|[\u1ECD-\u1ECD]|[\u1ECF-\u1ECF]|[\u1ED1-\u1ED1]|[\u1ED3-\u1ED3]|[\u1ED5-\u1ED5]|[\u1ED7-\u1ED7]|[\u1ED9-\u1ED9]|[\u1EDB-\u1EDB]|[\u1EDD-\u1EDD]|[\u1EDF-\u1EDF]|[\u1EE1-\u1EE1]|[\u1EE3-\u1EE3]|[\u1EE5-\u1EE5]|[\u1EE7-\u1EE7]|[\u1EE9-\u1EE9]|[\u1EEB-\u1EEB]|[\u1EED-\u1EED]|[\u1EEF-\u1EEF]|[\u1EF1-\u1EF1]|[\u1EF3-\u1EF3]|[\u1EF5-\u1EF5]|[\u1EF7-\u1EF7]|[\u1EF9-\u1EF9]|[\u1F00-\u1F07]|[\u1F10-\u1F15]|[\u1F20-\u1F27]|[\u1F30-\u1F37]|[\u1F40-\u1F45]|[\u1F50-\u1F57]|[\u1F60-\u1F67]|[\u1F70-\u1F7D]|[\u1F80-\u1F87]|[\u1F90-\u1F97]|[\u1FA0-\u1FA7]|[\u1FB0-\u1FB4]|[\u1FB6-\u1FB7]|[\u1FBE-\u1FBE]|[\u1FC2-\u1FC4]|[\u1FC6-\u1FC7]|[\u1FD0-\u1FD3]|[\u1FD6-\u1FD7]|[\u1FE0-\u1FE7]|[\u1FF2-\u1FF4]|[\u1FF6-\u1FF7]|[\u207F-\u207F]|[\u210A-\u210A]|[\u210E-\u210F]|[\u2113-\u2113]|[\u2118-\u2118]|[\u212E-\u212F]|[\u2134-\u2134]|[\uFB00-\uFB06]|[\uFB13-\uFB17]|[\uFF41-\uFF5A]/,
  Lt   : /[\u01C5-\u01C5]|[\u01C8-\u01C8]|[\u01CB-\u01CB]|[\u01F2-\u01F2]/,
  Lm   : /[\u02B0-\u02B8]|[\u02BB-\u02C1]|[\u02D0-\u02D1]|[\u02E0-\u02E4]|[\u037A-\u037A]|[\u0559-\u0559]|[\u0640-\u0640]|[\u06E5-\u06E6]|[\u0E46-\u0E46]|[\u0EC6-\u0EC6]|[\u3005-\u3005]|[\u3031-\u3035]|[\u309D-\u309E]|[\u30FC-\u30FE]|[\uFF70-\uFF70]|[\uFF9E-\uFF9F]/,
  Lo   : /[\u01AA-\u01AA]|[\u01BB-\u01BB]|[\u01BE-\u01C3]|[\u03F3-\u03F3]|[\u04C0-\u04C0]|[\u05D0-\u05EA]|[\u05F0-\u05F2]|[\u0621-\u063A]|[\u0641-\u064A]|[\u0671-\u06B7]|[\u06BA-\u06BE]|[\u06C0-\u06CE]|[\u06D0-\u06D3]|[\u06D5-\u06D5]|[\u0905-\u0939]|[\u093D-\u093D]|[\u0950-\u0950]|[\u0958-\u0961]|[\u0985-\u098C]|[\u098F-\u0990]|[\u0993-\u09A8]|[\u09AA-\u09B0]|[\u09B2-\u09B2]|[\u09B6-\u09B9]|[\u09DC-\u09DD]|[\u09DF-\u09E1]|[\u09F0-\u09F1]|[\u0A05-\u0A0A]|[\u0A0F-\u0A10]|[\u0A13-\u0A28]|[\u0A2A-\u0A30]|[\u0A32-\u0A33]|[\u0A35-\u0A36]|[\u0A38-\u0A39]|[\u0A59-\u0A5C]|[\u0A5E-\u0A5E]|[\u0A72-\u0A74]|[\u0A85-\u0A8B]|[\u0A8D-\u0A8D]|[\u0A8F-\u0A91]|[\u0A93-\u0AA8]|[\u0AAA-\u0AB0]|[\u0AB2-\u0AB3]|[\u0AB5-\u0AB9]|[\u0ABD-\u0ABD]|[\u0AD0-\u0AD0]|[\u0AE0-\u0AE0]|[\u0B05-\u0B0C]|[\u0B0F-\u0B10]|[\u0B13-\u0B28]|[\u0B2A-\u0B30]|[\u0B32-\u0B33]|[\u0B36-\u0B39]|[\u0B3D-\u0B3D]|[\u0B5C-\u0B5D]|[\u0B5F-\u0B61]|[\u0B85-\u0B8A]|[\u0B8E-\u0B90]|[\u0B92-\u0B95]|[\u0B99-\u0B9A]|[\u0B9C-\u0B9C]|[\u0B9E-\u0B9F]|[\u0BA3-\u0BA4]|[\u0BA8-\u0BAA]|[\u0BAE-\u0BB5]|[\u0BB7-\u0BB9]|[\u0C05-\u0C0C]|[\u0C0E-\u0C10]|[\u0C12-\u0C28]|[\u0C2A-\u0C33]|[\u0C35-\u0C39]|[\u0C60-\u0C61]|[\u0C85-\u0C8C]|[\u0C8E-\u0C90]|[\u0C92-\u0CA8]|[\u0CAA-\u0CB3]|[\u0CB5-\u0CB9]|[\u0CDE-\u0CDE]|[\u0CE0-\u0CE1]|[\u0D05-\u0D0C]|[\u0D0E-\u0D10]|[\u0D12-\u0D28]|[\u0D2A-\u0D39]|[\u0D60-\u0D61]|[\u0E01-\u0E30]|[\u0E32-\u0E33]|[\u0E40-\u0E45]|[\u0E81-\u0E82]|[\u0E84-\u0E84]|[\u0E87-\u0E88]|[\u0E8A-\u0E8A]|[\u0E8D-\u0E8D]|[\u0E94-\u0E97]|[\u0E99-\u0E9F]|[\u0EA1-\u0EA3]|[\u0EA5-\u0EA5]|[\u0EA7-\u0EA7]|[\u0EAA-\u0EAB]|[\u0EAD-\u0EB0]|[\u0EB2-\u0EB3]|[\u0EBD-\u0EBD]|[\u0EC0-\u0EC4]|[\u0EDC-\u0EDD]|[\u0F00-\u0F00]|[\u0F40-\u0F47]|[\u0F49-\u0F69]|[\u0F88-\u0F8B]|[\u1100-\u1159]|[\u115F-\u11A2]|[\u11A8-\u11F9]|[\u2135-\u2138]|[\u3006-\u3006]|[\u3041-\u3094]|[\u30A1-\u30FA]|[\u3105-\u312C]|[\u3131-\u318E]|[\u4E00-\u9FA5]|[\uAC00-\uD7A3]|[\uF900-\uFA2D]|[\uFB1F-\uFB28]|[\uFB2A-\uFB36]|[\uFB38-\uFB3C]|[\uFB3E-\uFB3E]|[\uFB40-\uFB41]|[\uFB43-\uFB44]|[\uFB46-\uFBB1]|[\uFBD3-\uFD3D]|[\uFD50-\uFD8F]|[\uFD92-\uFDC7]|[\uFDF0-\uFDFB]|[\uFE70-\uFE72]|[\uFE74-\uFE74]|[\uFE76-\uFEFC]|[\uFF66-\uFF6F]|[\uFF71-\uFF9D]|[\uFFA0-\uFFBE]|[\uFFC2-\uFFC7]|[\uFFCA-\uFFCF]|[\uFFD2-\uFFD7]|[\uFFDA-\uFFDC]/,
/* --- */

  Nl   : /[\u2160-\u2182]|[\u3007-\u3007]|[\u3021-\u3029]/,
  Mn   : /[\u0300-\u0345]|[\u0360-\u0361]|[\u0483-\u0486]|[\u0591-\u05A1]|[\u05A3-\u05B9]|[\u05BB-\u05BD]|[\u05BF-\u05BF]|[\u05C1-\u05C2]|[\u05C4-\u05C4]|[\u064B-\u0652]|[\u0670-\u0670]|[\u06D6-\u06DC]|[\u06DF-\u06E4]|[\u06E7-\u06E8]|[\u06EA-\u06ED]|[\u0901-\u0902]|[\u093C-\u093C]|[\u0941-\u0948]|[\u094D-\u094D]|[\u0951-\u0954]|[\u0962-\u0963]|[\u0981-\u0981]|[\u09BC-\u09BC]|[\u09C1-\u09C4]|[\u09CD-\u09CD]|[\u09E2-\u09E3]|[\u0A02-\u0A02]|[\u0A3C-\u0A3C]|[\u0A41-\u0A42]|[\u0A47-\u0A48]|[\u0A4B-\u0A4D]|[\u0A70-\u0A71]|[\u0A81-\u0A82]|[\u0ABC-\u0ABC]|[\u0AC1-\u0AC5]|[\u0AC7-\u0AC8]|[\u0ACD-\u0ACD]|[\u0B01-\u0B01]|[\u0B3C-\u0B3C]|[\u0B3F-\u0B3F]|[\u0B41-\u0B43]|[\u0B4D-\u0B4D]|[\u0B56-\u0B56]|[\u0B82-\u0B82]|[\u0BC0-\u0BC0]|[\u0BCD-\u0BCD]|[\u0C3E-\u0C40]|[\u0C46-\u0C48]|[\u0C4A-\u0C4D]|[\u0C55-\u0C56]|[\u0CBF-\u0CBF]|[\u0CC6-\u0CC6]|[\u0CCC-\u0CCD]|[\u0D41-\u0D43]|[\u0D4D-\u0D4D]|[\u0E31-\u0E31]|[\u0E34-\u0E3A]|[\u0E47-\u0E4E]|[\u0EB1-\u0EB1]|[\u0EB4-\u0EB9]|[\u0EBB-\u0EBC]|[\u0EC8-\u0ECD]|[\u0F18-\u0F19]|[\u0F35-\u0F35]|[\u0F37-\u0F37]|[\u0F39-\u0F39]|[\u0F71-\u0F7E]|[\u0F80-\u0F84]|[\u0F86-\u0F87]|[\u0F90-\u0F95]|[\u0F97-\u0F97]|[\u0F99-\u0FAD]|[\u0FB1-\u0FB7]|[\u0FB9-\u0FB9]|[\u20D0-\u20DC]|[\u20E1-\u20E1]|[\u302A-\u302F]|[\u3099-\u309A]|[\uFB1E-\uFB1E]|[\uFE20-\uFE23]/,
  Mc   : /[\u0903-\u0903]|[\u093E-\u0940]|[\u0949-\u094C]|[\u0982-\u0983]|[\u09BE-\u09C0]|[\u09C7-\u09C8]|[\u09CB-\u09CC]|[\u09D7-\u09D7]|[\u0A3E-\u0A40]|[\u0A83-\u0A83]|[\u0ABE-\u0AC0]|[\u0AC9-\u0AC9]|[\u0ACB-\u0ACC]|[\u0B02-\u0B03]|[\u0B3E-\u0B3E]|[\u0B40-\u0B40]|[\u0B47-\u0B48]|[\u0B4B-\u0B4C]|[\u0B57-\u0B57]|[\u0B83-\u0B83]|[\u0BBE-\u0BBF]|[\u0BC1-\u0BC2]|[\u0BC6-\u0BC8]|[\u0BCA-\u0BCC]|[\u0BD7-\u0BD7]|[\u0C01-\u0C03]|[\u0C41-\u0C44]|[\u0C82-\u0C83]|[\u0CBE-\u0CBE]|[\u0CC0-\u0CC4]|[\u0CC7-\u0CC8]|[\u0CCA-\u0CCB]|[\u0CD5-\u0CD6]|[\u0D02-\u0D03]|[\u0D3E-\u0D40]|[\u0D46-\u0D48]|[\u0D4A-\u0D4C]|[\u0D57-\u0D57]|[\u0F3E-\u0F3F]|[\u0F7F-\u0F7F]/,
  Nd   : /[\u0030-\u0039]|[\u0660-\u0669]|[\u06F0-\u06F9]|[\u0966-\u096F]|[\u09E6-\u09EF]|[\u0A66-\u0A6F]|[\u0AE6-\u0AEF]|[\u0B66-\u0B6F]|[\u0BE7-\u0BEF]|[\u0C66-\u0C6F]|[\u0CE6-\u0CEF]|[\u0D66-\u0D6F]|[\u0E50-\u0E59]|[\u0ED0-\u0ED9]|[\u0F20-\u0F29]|[\uFF10-\uFF19]/,
  Pc   : /[\u005F-\u005F]|[\u203F-\u2040]|[\u30FB-\u30FB]|[\uFE33-\uFE34]|[\uFE4D-\uFE4F]|[\uFF3F-\uFF3F]|[\uFF65-\uFF65]/,
  Zs   : /[\u2000-\u200B]|[\u3000-\u3000]/,
};

},{}]},{},[28])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hd2FydGgvcHJvZy9vaG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vaG0vZGlzdC9idWlsdC1pbi1ydWxlcy5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vaG0vZGlzdC9vaG0tZ3JhbW1hci5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vaG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vaG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9jcnlwdG8tYnJvd3NlcmlmeS9oZWxwZXJzLmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29obS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvY3J5cHRvLWJyb3dzZXJpZnkvaW5kZXguanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9jcnlwdG8tYnJvd3NlcmlmeS9tZDUuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9jcnlwdG8tYnJvd3NlcmlmeS9ybmcuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9jcnlwdG8tYnJvd3NlcmlmeS9zaGEuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9jcnlwdG8tYnJvd3NlcmlmeS9zaGEyNTYuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29obS9ub2RlX21vZHVsZXMvc3ltYm9sL2luZGV4LmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29obS9ub2RlX21vZHVsZXMvdXRpbC1leHRlbmQvZXh0ZW5kLmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29obS9zcmMvQnVpbGRlci5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vaG0vc3JjL0dyYW1tYXIuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb2htL3NyYy9HcmFtbWFyRGVjbC5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vaG0vc3JjL0lucHV0U3RyZWFtLmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29obS9zcmMvSW50ZXJ2YWwuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb2htL3NyYy9NYXRjaFJlc3VsdC5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vaG0vc3JjL05hbWVzcGFjZS5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vaG0vc3JjL1Bvc0luZm8uanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb2htL3NyYy9TZW1hbnRpY3MuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb2htL3NyYy9TdGF0ZS5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vaG0vc3JjL1RyYWNlLmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29obS9zcmMvY29tbW9uLmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29obS9zcmMvZXJyb3JzLmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29obS9zcmMvbWFpbi5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vaG0vc3JjL25vZGVzLmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29obS9zcmMvcGV4cHJzLWFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkLmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29obS9zcmMvcGV4cHJzLWFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5LmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29obS9zcmMvcGV4cHJzLWFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZS5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy1jaGVjay5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy1ldmFsLmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29obS9zcmMvcGV4cHJzLWdldEFyaXR5LmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29obS9zcmMvcGV4cHJzLWludHJvZHVjZVBhcmFtcy5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy1pc051bGxhYmxlLmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29obS9zcmMvcGV4cHJzLW1heWJlUmVjb3JkRmFpbHVyZS5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy1vdXRwdXRSZWNpcGUuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb2htL3NyYy9wZXhwcnMtc3Vic3RpdHV0ZVBhcmFtcy5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy10b0Rpc3BsYXlTdHJpbmcuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb2htL3NyYy9wZXhwcnMtdG9FeHBlY3RlZC5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy10b1N0cmluZy5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vaG0vc3JjL3V0aWwuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb2htL3RoaXJkX3BhcnR5L3VuaWNvZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNybENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaGFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1YUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBvaG0gPSByZXF1aXJlKCcuLicpO1xubW9kdWxlLmV4cG9ydHMgPSBvaG0ubWFrZVJlY2lwZShmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyB0aGlzLm5ld0dyYW1tYXIoJ0J1aWx0SW5SdWxlcycpXG4gICAgLmRlZmluZSgnYWxudW0nLCBbXSwgdGhpcy5wcmltKC9bMC05YS16QS1aXS8pLCAnYW4gYWxwaGEtbnVtZXJpYyBjaGFyYWN0ZXInKVxuICAgIC5kZWZpbmUoJ2xldHRlcicsIFtdLCB0aGlzLnByaW0oL1thLXpBLVpdLyksICdhIGxldHRlcicpXG4gICAgLmRlZmluZSgnbG93ZXInLCBbXSwgdGhpcy5wcmltKC9bYS16XS8pLCAnYSBsb3dlci1jYXNlIGxldHRlcicpXG4gICAgLmRlZmluZSgndXBwZXInLCBbXSwgdGhpcy5wcmltKC9bQS1aXS8pLCAnYW4gdXBwZXItY2FzZSBsZXR0ZXInKVxuICAgIC5kZWZpbmUoJ2RpZ2l0JywgW10sIHRoaXMucHJpbSgvWzAtOV0vKSwgJ2EgZGlnaXQnKVxuICAgIC5kZWZpbmUoJ2hleERpZ2l0JywgW10sIHRoaXMucHJpbSgvWzAtOWEtZkEtRl0vKSwgJ2EgaGV4YWRlY2ltYWwgZGlnaXQnKVxuICAgIC5kZWZpbmUoJ0xpc3RPZl9zb21lJywgWydlbGVtJywgJ3NlcCddLCB0aGlzLnNlcSh0aGlzLnBhcmFtKDApLCB0aGlzLnN0YXIodGhpcy5zZXEodGhpcy5wYXJhbSgxKSwgdGhpcy5wYXJhbSgwKSkpKSlcbiAgICAuZGVmaW5lKCdMaXN0T2Zfbm9uZScsIFsnZWxlbScsICdzZXAnXSwgdGhpcy5zZXEoKSlcbiAgICAuZGVmaW5lKCdMaXN0T2YnLCBbJ2VsZW0nLCAnc2VwJ10sIHRoaXMuYWx0KHRoaXMuYXBwKCdMaXN0T2Zfc29tZScsIFt0aGlzLmFwcCgnZWxlbScpLCB0aGlzLmFwcCgnc2VwJyldKSwgdGhpcy5hcHAoJ0xpc3RPZl9ub25lJywgW3RoaXMuYXBwKCdlbGVtJyksIHRoaXMuYXBwKCdzZXAnKV0pKSlcbiAgICAuYnVpbGQoKTtcbn0pO1xuXG4iLCJ2YXIgb2htID0gcmVxdWlyZSgnLi4nKTtcbm1vZHVsZS5leHBvcnRzID0gb2htLm1ha2VSZWNpcGUoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgdGhpcy5uZXdHcmFtbWFyKCdPaG0nKVxuICAgIC53aXRoRGVmYXVsdFN0YXJ0UnVsZSgnR3JhbW1hcnMnKVxuICAgIC5kZWZpbmUoJ0dyYW1tYXJzJywgW10sIHRoaXMuc3Rhcih0aGlzLmFwcCgnR3JhbW1hcicpKSlcbiAgICAuZGVmaW5lKCdHcmFtbWFyJywgW10sIHRoaXMuc2VxKHRoaXMuYXBwKCdpZGVudCcpLCB0aGlzLm9wdCh0aGlzLmFwcCgnU3VwZXJHcmFtbWFyJykpLCB0aGlzLnByaW0oJ3snKSwgdGhpcy5zdGFyKHRoaXMuYXBwKCdSdWxlJykpLCB0aGlzLnByaW0oJ30nKSkpXG4gICAgLmRlZmluZSgnU3VwZXJHcmFtbWFyJywgW10sIHRoaXMuc2VxKHRoaXMucHJpbSgnPDonKSwgdGhpcy5hcHAoJ2lkZW50JykpKVxuICAgIC5kZWZpbmUoJ1J1bGVfZGVmaW5lJywgW10sIHRoaXMuc2VxKHRoaXMuYXBwKCdpZGVudCcpLCB0aGlzLm9wdCh0aGlzLmFwcCgnRm9ybWFscycpKSwgdGhpcy5vcHQodGhpcy5hcHAoJ3J1bGVEZXNjcicpKSwgdGhpcy5wcmltKCc9JyksIHRoaXMuYXBwKCdBbHQnKSkpXG4gICAgLmRlZmluZSgnUnVsZV9vdmVycmlkZScsIFtdLCB0aGlzLnNlcSh0aGlzLmFwcCgnaWRlbnQnKSwgdGhpcy5vcHQodGhpcy5hcHAoJ0Zvcm1hbHMnKSksIHRoaXMucHJpbSgnOj0nKSwgdGhpcy5hcHAoJ0FsdCcpKSlcbiAgICAuZGVmaW5lKCdSdWxlX2V4dGVuZCcsIFtdLCB0aGlzLnNlcSh0aGlzLmFwcCgnaWRlbnQnKSwgdGhpcy5vcHQodGhpcy5hcHAoJ0Zvcm1hbHMnKSksIHRoaXMucHJpbSgnKz0nKSwgdGhpcy5hcHAoJ0FsdCcpKSlcbiAgICAuZGVmaW5lKCdSdWxlJywgW10sIHRoaXMuYWx0KHRoaXMuYXBwKCdSdWxlX2RlZmluZScpLCB0aGlzLmFwcCgnUnVsZV9vdmVycmlkZScpLCB0aGlzLmFwcCgnUnVsZV9leHRlbmQnKSkpXG4gICAgLmRlZmluZSgnRm9ybWFscycsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oJzwnKSwgdGhpcy5hcHAoJ0xpc3RPZicsIFt0aGlzLmFwcCgnaWRlbnQnKSwgdGhpcy5wcmltKCcsJyldKSwgdGhpcy5wcmltKCc+JykpKVxuICAgIC5kZWZpbmUoJ1BhcmFtcycsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oJzwnKSwgdGhpcy5hcHAoJ0xpc3RPZicsIFt0aGlzLmFwcCgnU2VxJyksIHRoaXMucHJpbSgnLCcpXSksIHRoaXMucHJpbSgnPicpKSlcbiAgICAuZGVmaW5lKCdBbHQnLCBbXSwgdGhpcy5zZXEodGhpcy5hcHAoJ1Rlcm0nKSwgdGhpcy5zdGFyKHRoaXMuc2VxKHRoaXMucHJpbSgnfCcpLCB0aGlzLmFwcCgnVGVybScpKSkpKVxuICAgIC5kZWZpbmUoJ1Rlcm1faW5saW5lJywgW10sIHRoaXMuc2VxKHRoaXMuYXBwKCdTZXEnKSwgdGhpcy5hcHAoJ2Nhc2VOYW1lJykpKVxuICAgIC5kZWZpbmUoJ1Rlcm0nLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoJ1Rlcm1faW5saW5lJyksIHRoaXMuYXBwKCdTZXEnKSkpXG4gICAgLmRlZmluZSgnU2VxJywgW10sIHRoaXMuc3Rhcih0aGlzLmFwcCgnSXRlcicpKSlcbiAgICAuZGVmaW5lKCdJdGVyX3N0YXInLCBbXSwgdGhpcy5zZXEodGhpcy5hcHAoJ1ByZWQnKSwgdGhpcy5wcmltKCcqJykpKVxuICAgIC5kZWZpbmUoJ0l0ZXJfcGx1cycsIFtdLCB0aGlzLnNlcSh0aGlzLmFwcCgnUHJlZCcpLCB0aGlzLnByaW0oJysnKSkpXG4gICAgLmRlZmluZSgnSXRlcl9vcHQnLCBbXSwgdGhpcy5zZXEodGhpcy5hcHAoJ1ByZWQnKSwgdGhpcy5wcmltKCc/JykpKVxuICAgIC5kZWZpbmUoJ0l0ZXInLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoJ0l0ZXJfc3RhcicpLCB0aGlzLmFwcCgnSXRlcl9wbHVzJyksIHRoaXMuYXBwKCdJdGVyX29wdCcpLCB0aGlzLmFwcCgnUHJlZCcpKSlcbiAgICAuZGVmaW5lKCdQcmVkX25vdCcsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oJ34nKSwgdGhpcy5hcHAoJ0Jhc2UnKSkpXG4gICAgLmRlZmluZSgnUHJlZF9sb29rYWhlYWQnLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKCcmJyksIHRoaXMuYXBwKCdCYXNlJykpKVxuICAgIC5kZWZpbmUoJ1ByZWQnLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoJ1ByZWRfbm90JyksIHRoaXMuYXBwKCdQcmVkX2xvb2thaGVhZCcpLCB0aGlzLmFwcCgnQmFzZScpKSlcbiAgICAuZGVmaW5lKCdCYXNlX2FwcGxpY2F0aW9uJywgW10sIHRoaXMuc2VxKHRoaXMuYXBwKCdpZGVudCcpLCB0aGlzLm9wdCh0aGlzLmFwcCgnUGFyYW1zJykpLCB0aGlzLm5vdCh0aGlzLmFsdCh0aGlzLnNlcSh0aGlzLm9wdCh0aGlzLmFwcCgncnVsZURlc2NyJykpLCB0aGlzLnByaW0oJz0nKSksIHRoaXMucHJpbSgnOj0nKSwgdGhpcy5wcmltKCcrPScpKSkpKVxuICAgIC5kZWZpbmUoJ0Jhc2VfcHJpbScsIFtdLCB0aGlzLmFsdCh0aGlzLmFwcCgna2V5d29yZCcpLCB0aGlzLmFwcCgnc3RyaW5nJyksIHRoaXMuYXBwKCdyZWdFeHAnKSwgdGhpcy5hcHAoJ251bWJlcicpKSlcbiAgICAuZGVmaW5lKCdCYXNlX3BhcmVuJywgW10sIHRoaXMuc2VxKHRoaXMucHJpbSgnKCcpLCB0aGlzLmFwcCgnQWx0JyksIHRoaXMucHJpbSgnKScpKSlcbiAgICAuZGVmaW5lKCdCYXNlX2FycicsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oJ1snKSwgdGhpcy5hcHAoJ0FsdCcpLCB0aGlzLnByaW0oJ10nKSkpXG4gICAgLmRlZmluZSgnQmFzZV9zdHInLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKCdgYCcpLCB0aGlzLmFwcCgnQWx0JyksIHRoaXMucHJpbShcIicnXCIpKSlcbiAgICAuZGVmaW5lKCdCYXNlX29iaicsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oJ3snKSwgdGhpcy5vcHQodGhpcy5wcmltKCcuLi4nKSksIHRoaXMucHJpbSgnfScpKSlcbiAgICAuZGVmaW5lKCdCYXNlX29ialdpdGhQcm9wcycsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oJ3snKSwgdGhpcy5hcHAoJ1Byb3BzJyksIHRoaXMub3B0KHRoaXMuc2VxKHRoaXMucHJpbSgnLCcpLCB0aGlzLnByaW0oJy4uLicpKSksIHRoaXMucHJpbSgnfScpKSlcbiAgICAuZGVmaW5lKCdCYXNlJywgW10sIHRoaXMuYWx0KHRoaXMuYXBwKCdCYXNlX2FwcGxpY2F0aW9uJyksIHRoaXMuYXBwKCdCYXNlX3ByaW0nKSwgdGhpcy5hcHAoJ0Jhc2VfcGFyZW4nKSwgdGhpcy5hcHAoJ0Jhc2VfYXJyJyksIHRoaXMuYXBwKCdCYXNlX3N0cicpLCB0aGlzLmFwcCgnQmFzZV9vYmonKSwgdGhpcy5hcHAoJ0Jhc2Vfb2JqV2l0aFByb3BzJykpKVxuICAgIC5kZWZpbmUoJ1Byb3BzJywgW10sIHRoaXMuc2VxKHRoaXMuYXBwKCdQcm9wJyksIHRoaXMuc3Rhcih0aGlzLnNlcSh0aGlzLnByaW0oJywnKSwgdGhpcy5hcHAoJ1Byb3AnKSkpKSlcbiAgICAuZGVmaW5lKCdQcm9wJywgW10sIHRoaXMuc2VxKHRoaXMuYWx0KHRoaXMuYXBwKCduYW1lJyksIHRoaXMuYXBwKCdzdHJpbmcnKSksIHRoaXMucHJpbSgnOicpLCB0aGlzLmFwcCgnQWx0JykpKVxuICAgIC5kZWZpbmUoJ3J1bGVEZXNjcicsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oJygnKSwgdGhpcy5hcHAoJ3J1bGVEZXNjclRleHQnKSwgdGhpcy5wcmltKCcpJykpLCAnYSBydWxlIGRlc2NyaXB0aW9uJylcbiAgICAuZGVmaW5lKCdydWxlRGVzY3JUZXh0JywgW10sIHRoaXMuc3Rhcih0aGlzLnNlcSh0aGlzLm5vdCh0aGlzLnByaW0oJyknKSksIHRoaXMuYXBwKCdfJykpKSlcbiAgICAuZGVmaW5lKCdjYXNlTmFtZScsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oJy0tJyksIHRoaXMuc3Rhcih0aGlzLnNlcSh0aGlzLm5vdCh0aGlzLnByaW0oJ1xcbicpKSwgdGhpcy5hcHAoJ3NwYWNlJykpKSwgdGhpcy5hcHAoJ25hbWUnKSwgdGhpcy5zdGFyKHRoaXMuc2VxKHRoaXMubm90KHRoaXMucHJpbSgnXFxuJykpLCB0aGlzLmFwcCgnc3BhY2UnKSkpLCB0aGlzLmFsdCh0aGlzLnByaW0oJ1xcbicpLCB0aGlzLmxhKHRoaXMucHJpbSgnfScpKSkpKVxuICAgIC5kZWZpbmUoJ25hbWUnLCBbXSwgdGhpcy5zZXEodGhpcy5hcHAoJ25hbWVGaXJzdCcpLCB0aGlzLnN0YXIodGhpcy5hcHAoJ25hbWVSZXN0JykpKSwgJ2EgbmFtZScpXG4gICAgLmRlZmluZSgnbmFtZUZpcnN0JywgW10sIHRoaXMuYWx0KHRoaXMucHJpbSgnXycpLCB0aGlzLmFwcCgnbGV0dGVyJykpKVxuICAgIC5kZWZpbmUoJ25hbWVSZXN0JywgW10sIHRoaXMuYWx0KHRoaXMucHJpbSgnXycpLCB0aGlzLmFwcCgnYWxudW0nKSkpXG4gICAgLmRlZmluZSgnaWRlbnQnLCBbXSwgdGhpcy5zZXEodGhpcy5ub3QodGhpcy5hcHAoJ2tleXdvcmQnKSksIHRoaXMuYXBwKCduYW1lJykpLCAnYW4gaWRlbnRpZmllcicpXG4gICAgLmRlZmluZSgna2V5d29yZF9udWxsJywgW10sIHRoaXMuc2VxKHRoaXMucHJpbSgnbnVsbCcpLCB0aGlzLm5vdCh0aGlzLmFwcCgnbmFtZVJlc3QnKSkpKVxuICAgIC5kZWZpbmUoJ2tleXdvcmRfdHJ1ZScsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oJ3RydWUnKSwgdGhpcy5ub3QodGhpcy5hcHAoJ25hbWVSZXN0JykpKSlcbiAgICAuZGVmaW5lKCdrZXl3b3JkX2ZhbHNlJywgW10sIHRoaXMuc2VxKHRoaXMucHJpbSgnZmFsc2UnKSwgdGhpcy5ub3QodGhpcy5hcHAoJ25hbWVSZXN0JykpKSlcbiAgICAuZGVmaW5lKCdrZXl3b3JkJywgW10sIHRoaXMuYWx0KHRoaXMuYXBwKCdrZXl3b3JkX251bGwnKSwgdGhpcy5hcHAoJ2tleXdvcmRfdHJ1ZScpLCB0aGlzLmFwcCgna2V5d29yZF9mYWxzZScpKSlcbiAgICAuZGVmaW5lKCdzdHJpbmcnLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKCdcIicpLCB0aGlzLnN0YXIodGhpcy5hcHAoJ3N0ckNoYXInKSksIHRoaXMucHJpbSgnXCInKSksICdhIHN0cmluZyBsaXRlcmFsJylcbiAgICAuZGVmaW5lKCdzdHJDaGFyJywgW10sIHRoaXMuYWx0KHRoaXMuYXBwKCdlc2NhcGVDaGFyJyksIHRoaXMuc2VxKHRoaXMubm90KHRoaXMucHJpbSgnXFxcXCcpKSwgdGhpcy5ub3QodGhpcy5wcmltKCdcIicpKSwgdGhpcy5ub3QodGhpcy5wcmltKCdcXG4nKSksIHRoaXMuYXBwKCdfJykpKSlcbiAgICAuZGVmaW5lKCdlc2NhcGVDaGFyX2JhY2tzbGFzaCcsIFtdLCB0aGlzLnByaW0oJ1xcXFxcXFxcJykpXG4gICAgLmRlZmluZSgnZXNjYXBlQ2hhcl9kb3VibGVRdW90ZScsIFtdLCB0aGlzLnByaW0oJ1xcXFxcIicpKVxuICAgIC5kZWZpbmUoJ2VzY2FwZUNoYXJfc2luZ2xlUXVvdGUnLCBbXSwgdGhpcy5wcmltKFwiXFxcXCdcIikpXG4gICAgLmRlZmluZSgnZXNjYXBlQ2hhcl9iYWNrc3BhY2UnLCBbXSwgdGhpcy5wcmltKCdcXFxcYicpKVxuICAgIC5kZWZpbmUoJ2VzY2FwZUNoYXJfbGluZUZlZWQnLCBbXSwgdGhpcy5wcmltKCdcXFxcbicpKVxuICAgIC5kZWZpbmUoJ2VzY2FwZUNoYXJfY2FycmlhZ2VSZXR1cm4nLCBbXSwgdGhpcy5wcmltKCdcXFxccicpKVxuICAgIC5kZWZpbmUoJ2VzY2FwZUNoYXJfdGFiJywgW10sIHRoaXMucHJpbSgnXFxcXHQnKSlcbiAgICAuZGVmaW5lKCdlc2NhcGVDaGFyX3VuaWNvZGVFc2NhcGUnLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKCdcXFxcdScpLCB0aGlzLmFwcCgnaGV4RGlnaXQnKSwgdGhpcy5hcHAoJ2hleERpZ2l0JyksIHRoaXMuYXBwKCdoZXhEaWdpdCcpLCB0aGlzLmFwcCgnaGV4RGlnaXQnKSkpXG4gICAgLmRlZmluZSgnZXNjYXBlQ2hhcl9oZXhFc2NhcGUnLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKCdcXFxceCcpLCB0aGlzLmFwcCgnaGV4RGlnaXQnKSwgdGhpcy5hcHAoJ2hleERpZ2l0JykpKVxuICAgIC5kZWZpbmUoJ2VzY2FwZUNoYXInLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoJ2VzY2FwZUNoYXJfYmFja3NsYXNoJyksIHRoaXMuYXBwKCdlc2NhcGVDaGFyX2RvdWJsZVF1b3RlJyksIHRoaXMuYXBwKCdlc2NhcGVDaGFyX3NpbmdsZVF1b3RlJyksIHRoaXMuYXBwKCdlc2NhcGVDaGFyX2JhY2tzcGFjZScpLCB0aGlzLmFwcCgnZXNjYXBlQ2hhcl9saW5lRmVlZCcpLCB0aGlzLmFwcCgnZXNjYXBlQ2hhcl9jYXJyaWFnZVJldHVybicpLCB0aGlzLmFwcCgnZXNjYXBlQ2hhcl90YWInKSwgdGhpcy5hcHAoJ2VzY2FwZUNoYXJfdW5pY29kZUVzY2FwZScpLCB0aGlzLmFwcCgnZXNjYXBlQ2hhcl9oZXhFc2NhcGUnKSkpXG4gICAgLmRlZmluZSgncmVnRXhwJywgW10sIHRoaXMuc2VxKHRoaXMucHJpbSgnLycpLCB0aGlzLmFwcCgncmVDaGFyQ2xhc3MnKSwgdGhpcy5wcmltKCcvJykpLCAnYSByZWd1bGFyIGV4cHJlc3Npb24nKVxuICAgIC5kZWZpbmUoJ3JlQ2hhckNsYXNzX3VuaWNvZGUnLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKCdcXFxccHsnKSwgdGhpcy5wbHVzKHRoaXMucHJpbSgvW0EtWmEtel0vKSksIHRoaXMucHJpbSgnfScpKSlcbiAgICAuZGVmaW5lKCdyZUNoYXJDbGFzc19vcmRpbmFyeScsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oJ1snKSwgdGhpcy5zdGFyKHRoaXMuYWx0KHRoaXMucHJpbSgnXFxcXF0nKSwgdGhpcy5zZXEodGhpcy5ub3QodGhpcy5wcmltKCddJykpLCB0aGlzLmFwcCgnXycpKSkpLCB0aGlzLnByaW0oJ10nKSkpXG4gICAgLmRlZmluZSgncmVDaGFyQ2xhc3MnLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoJ3JlQ2hhckNsYXNzX3VuaWNvZGUnKSwgdGhpcy5hcHAoJ3JlQ2hhckNsYXNzX29yZGluYXJ5JykpKVxuICAgIC5kZWZpbmUoJ251bWJlcicsIFtdLCB0aGlzLnNlcSh0aGlzLm9wdCh0aGlzLnByaW0oJy0nKSksIHRoaXMucGx1cyh0aGlzLmFwcCgnZGlnaXQnKSkpLCAnYSBudW1iZXInKVxuICAgIC5kZWZpbmUoJ3NwYWNlX3NpbmdsZUxpbmUnLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKCcvLycpLCB0aGlzLnN0YXIodGhpcy5zZXEodGhpcy5ub3QodGhpcy5wcmltKCdcXG4nKSksIHRoaXMuYXBwKCdfJykpKSwgdGhpcy5wcmltKCdcXG4nKSkpXG4gICAgLmRlZmluZSgnc3BhY2VfbXVsdGlMaW5lJywgW10sIHRoaXMuc2VxKHRoaXMucHJpbSgnLyonKSwgdGhpcy5zdGFyKHRoaXMuc2VxKHRoaXMubm90KHRoaXMucHJpbSgnKi8nKSksIHRoaXMuYXBwKCdfJykpKSwgdGhpcy5wcmltKCcqLycpKSlcbiAgICAuZXh0ZW5kKCdzcGFjZScsIFtdLCB0aGlzLmFsdCh0aGlzLmFsdCh0aGlzLmFwcCgnc3BhY2Vfc2luZ2xlTGluZScpLCB0aGlzLmFwcCgnc3BhY2VfbXVsdGlMaW5lJykpLCB0aGlzLnByaW0oL1tcXHNdLykpLCAnYSBzcGFjZScpXG4gICAgLmJ1aWxkKCk7XG59KTtcblxuIiwiLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MlxuXG4vKipcbiAqIElmIGBCdWZmZXIuX3VzZVR5cGVkQXJyYXlzYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKGNvbXBhdGlibGUgZG93biB0byBJRTYpXG4gKi9cbkJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBEZXRlY3QgaWYgYnJvd3NlciBzdXBwb3J0cyBUeXBlZCBBcnJheXMuIFN1cHBvcnRlZCBicm93c2VycyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLFxuICAvLyBDaHJvbWUgNyssIFNhZmFyaSA1LjErLCBPcGVyYSAxMS42KywgaU9TIDQuMisuIElmIHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYWRkaW5nXG4gIC8vIHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcywgdGhlbiB0aGF0J3MgdGhlIHNhbWUgYXMgbm8gYFVpbnQ4QXJyYXlgIHN1cHBvcnRcbiAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gYWRkIGFsbCB0aGUgbm9kZSBCdWZmZXIgQVBJIG1ldGhvZHMuIFRoaXMgaXMgYW4gaXNzdWVcbiAgLy8gaW4gRmlyZWZveCA0LTI5LiBOb3cgZml4ZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOFxuICB0cnkge1xuICAgIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMClcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIDQyID09PSBhcnIuZm9vKCkgJiZcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAvLyBDaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59KSgpXG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybylcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0XG5cbiAgLy8gV29ya2Fyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5nc1xuICAvLyB3aGlsZSBiYXNlNjQtanMgZG9lcyBub3QuXG4gIGlmIChlbmNvZGluZyA9PT0gJ2Jhc2U2NCcgJiYgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBzdWJqZWN0ID0gc3RyaW5ndHJpbShzdWJqZWN0KVxuICAgIHdoaWxlIChzdWJqZWN0Lmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICAgIHN1YmplY3QgPSBzdWJqZWN0ICsgJz0nXG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gIHZhciBsZW5ndGhcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KVxuICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJylcbiAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZylcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKSAvLyBhc3N1bWUgdGhhdCBvYmplY3QgaXMgYXJyYXktbGlrZVxuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgYXJyYXkgb3Igc3RyaW5nLicpXG5cbiAgdmFyIGJ1ZlxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIC8vIFByZWZlcnJlZDogUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBidWYgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIFRISVMgaW5zdGFuY2Ugb2YgQnVmZmVyIChjcmVhdGVkIGJ5IGBuZXdgKVxuICAgIGJ1ZiA9IHRoaXNcbiAgICBidWYubGVuZ3RoID0gbGVuZ3RoXG4gICAgYnVmLl9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmIHR5cGVvZiBzdWJqZWN0LmJ5dGVMZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgLy8gU3BlZWQgb3B0aW1pemF0aW9uIC0tIHVzZSBzZXQgaWYgd2UncmUgY29weWluZyBmcm9tIGEgdHlwZWQgYXJyYXlcbiAgICBidWYuX3NldChzdWJqZWN0KVxuICB9IGVsc2UgaWYgKGlzQXJyYXlpc2goc3ViamVjdCkpIHtcbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXlcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3RbaV1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBidWYud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgIW5vWmVybykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYnVmW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuLy8gU1RBVElDIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiAoYikge1xuICByZXR1cm4gISEoYiAhPT0gbnVsbCAmJiBiICE9PSB1bmRlZmluZWQgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgdmFyIHJldFxuICBzdHIgPSBzdHIgKyAnJ1xuICBzd2l0Y2ggKGVuY29kaW5nIHx8ICd1dGY4Jykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoIC8gMlxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAqIDJcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGFzc2VydChpc0FycmF5KGxpc3QpLCAnVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4nICtcbiAgICAgICdsaXN0IHNob3VsZCBiZSBhbiBBcnJheS4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG90YWxMZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBCVUZGRVIgSU5TVEFOQ0UgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gX2hleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgYXNzZXJ0KHN0ckxlbiAlIDIgPT09IDAsICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBhc3NlcnQoIWlzTmFOKGJ5dGUpLCAnSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlXG4gIH1cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMlxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBfdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2FzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2JpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIF9hc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcbiAgc3RhcnQgPSBOdW1iZXIoc3RhcnQpIHx8IDBcbiAgZW5kID0gKGVuZCAhPT0gdW5kZWZpbmVkKVxuICAgID8gTnVtYmVyKGVuZClcbiAgICA6IGVuZCA9IHNlbGYubGVuZ3RoXG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoZW5kID09PSBzdGFydClcbiAgICByZXR1cm4gJydcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzXG5cbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKCF0YXJnZXRfc3RhcnQpIHRhcmdldF9zdGFydCA9IDBcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpXG4gIGFzc2VydCh0YXJnZXRfc3RhcnQgPj0gMCAmJiB0YXJnZXRfc3RhcnQgPCB0YXJnZXQubGVuZ3RoLFxuICAgICAgJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSBzb3VyY2UubGVuZ3RoLCAnc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aClcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KVxuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydFxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmIChsZW4gPCAxMDAgfHwgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRfc3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0Ll9zZXQodGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLCB0YXJnZXRfc3RhcnQpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBfdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJlcyA9ICcnXG4gIHZhciB0bXAgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gICAgICB0bXAgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXAgKz0gJyUnICsgYnVmW2ldLnRvU3RyaW5nKDE2KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF9hc2NpaVNsaWNlKGJ1Ziwgc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gX2hleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSsxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSBjbGFtcChzdGFydCwgbGVuLCAwKVxuICBlbmQgPSBjbGFtcChlbmQsIGxlbiwgbGVuKVxuXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5fYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmXG4gIH1cbn1cblxuLy8gYGdldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLmdldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMucmVhZFVJbnQ4KG9mZnNldClcbn1cblxuLy8gYHNldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHYsIG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLnNldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMud3JpdGVVSW50OCh2LCBvZmZzZXQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgdmFsID0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV1cbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDJdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgICB2YWwgfD0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0ICsgM10gPDwgMjQgPj4+IDApXG4gIH0gZWxzZSB7XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMV0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMl0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAzXVxuICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0XSA8PCAyNCA+Pj4gMClcbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICB2YXIgbmVnID0gdGhpc1tvZmZzZXRdICYgMHg4MFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQxNihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MzIoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMDAwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZmZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRmxvYXQgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWREb3VibGUgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuXG5cbiAgdGhpc1tvZmZzZXRdID0gdmFsdWVcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCAyKTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAgICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZmZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgNCk7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2YsIC0weDgwKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICB0aGlzLndyaXRlVUludDgodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICB0aGlzLndyaXRlVUludDgoMHhmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmLCAtMHg4MDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQxNihidWYsIDB4ZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQzMihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MzIoYnVmLCAweGZmZmZmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApXG4gIH1cblxuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpLCAndmFsdWUgaXMgbm90IGEgbnVtYmVyJylcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgdGhpcy5sZW5ndGgsICdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSB0aGlzLmxlbmd0aCwgJ2VuZCBvdXQgb2YgYm91bmRzJylcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG91dCA9IFtdXG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSlcbiAgICBpZiAoaSA9PT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPidcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBBcnJheUJ1ZmZlcmAgd2l0aCB0aGUgKmNvcGllZCogbWVtb3J5IG9mIHRoZSBidWZmZXIgaW5zdGFuY2UuXG4gKiBBZGRlZCBpbiBOb2RlIDAuMTIuIE9ubHkgYXZhaWxhYmxlIGluIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBBcnJheUJ1ZmZlci5cbiAqL1xuQnVmZmVyLnByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAgIHJldHVybiAobmV3IEJ1ZmZlcih0aGlzKSkuYnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBidWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmxlbmd0aClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBidWYubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpXG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQnVmZmVyLnRvQXJyYXlCdWZmZXIgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKVxuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxudmFyIEJQID0gQnVmZmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF1Z21lbnQgYSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgVWludDhBcnJheSBjbGFzcyEpIHdpdGggQnVmZmVyIG1ldGhvZHNcbiAqL1xuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgZ2V0L3NldCBtZXRob2RzIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX2dldCA9IGFyci5nZXRcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIG5vZGUgMC4xMytcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wIChpbmRleCwgbGVuLCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICBpbmRleCArPSBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBjb2VyY2UgKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpXG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aFxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChzdWJqZWN0KSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfSkoc3ViamVjdClcbn1cblxuZnVuY3Rpb24gaXNBcnJheWlzaCAoc3ViamVjdCkge1xuICByZXR1cm4gaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGIgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHN0YXJ0ID0gaVxuICAgICAgaWYgKGIgPj0gMHhEODAwICYmIGIgPD0gMHhERkZGKSBpKytcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5zbGljZShzdGFydCwgaSsxKSkuc3Vic3RyKDEpLnNwbGl0KCclJylcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShzdHIpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpXG4gICAgICBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyIChzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKSAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG4vKlxuICogV2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgYSB2YWxpZCBpbnRlZ2VyLiBUaGlzIG1lYW5zIHRoYXQgaXRcbiAqIGlzIG5vbi1uZWdhdGl2ZS4gSXQgaGFzIG5vIGZyYWN0aW9uYWwgY29tcG9uZW50IGFuZCB0aGF0IGl0IGRvZXMgbm90XG4gKiBleGNlZWQgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50ICh2YWx1ZSwgbWF4KSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA+PSAwLCAnc3BlY2lmaWVkIGEgbmVnYXRpdmUgdmFsdWUgZm9yIHdyaXRpbmcgYW4gdW5zaWduZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgaXMgbGFyZ2VyIHRoYW4gbWF4aW11bSB2YWx1ZSBmb3IgdHlwZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmc2ludCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG59XG5cbmZ1bmN0aW9uIGFzc2VydCAodGVzdCwgbWVzc2FnZSkge1xuICBpZiAoIXRlc3QpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdGYWlsZWQgYXNzZXJ0aW9uJylcbn1cbiIsInZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cdHZhciBQTFVTX1VSTF9TQUZFID0gJy0nLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIX1VSTF9TQUZFID0gJ18nLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUyB8fFxuXHRcdCAgICBjb2RlID09PSBQTFVTX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYyIC8vICcrJ1xuXHRcdGlmIChjb2RlID09PSBTTEFTSCB8fFxuXHRcdCAgICBjb2RlID09PSBTTEFTSF9VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MyAvLyAnLydcblx0XHRpZiAoY29kZSA8IE5VTUJFUilcblx0XHRcdHJldHVybiAtMSAvL25vIG1hdGNoXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIgKyAxMClcblx0XHRcdHJldHVybiBjb2RlIC0gTlVNQkVSICsgMjYgKyAyNlxuXHRcdGlmIChjb2RlIDwgVVBQRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gVVBQRVJcblx0XHRpZiAoY29kZSA8IExPV0VSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIExPV0VSICsgMjZcblx0fVxuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jylcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0dmFyIGxlbiA9IGI2NC5sZW5ndGhcblx0XHRwbGFjZUhvbGRlcnMgPSAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMikgPyAyIDogJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDEpID8gMSA6IDBcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cblx0XHR2YXIgTCA9IDBcblxuXHRcdGZ1bmN0aW9uIHB1c2ggKHYpIHtcblx0XHRcdGFycltMKytdID0gdlxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuXHRcdFx0cHVzaCgodG1wID4+IDgpICYgMHhGRilcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyXG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoXG5cblx0XHRmdW5jdGlvbiBlbmNvZGUgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cC5jaGFyQXQobnVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKG51bSA+PiAxOCAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiAxMiAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiA2ICYgMHgzRikgKyBlbmNvZGUobnVtICYgMHgzRilcblx0XHR9XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKVxuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAyKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSdcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSlcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDEwKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wID4+IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCAyKSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPSdcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0XG5cdH1cblxuXHRleHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXlcblx0ZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcgPyAodGhpcy5iYXNlNjRqcyA9IHt9KSA6IGV4cG9ydHMpKVxuIiwiZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sXG4gICAgICBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxLFxuICAgICAgZU1heCA9ICgxIDw8IGVMZW4pIC0gMSxcbiAgICAgIGVCaWFzID0gZU1heCA+PiAxLFxuICAgICAgbkJpdHMgPSAtNyxcbiAgICAgIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMCxcbiAgICAgIGQgPSBpc0xFID8gLTEgOiAxLFxuICAgICAgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgYyxcbiAgICAgIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDEsXG4gICAgICBlTWF4ID0gKDEgPDwgZUxlbikgLSAxLFxuICAgICAgZUJpYXMgPSBlTWF4ID4+IDEsXG4gICAgICBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMCksXG4gICAgICBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSksXG4gICAgICBkID0gaXNMRSA/IDEgOiAtMSxcbiAgICAgIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiIsInZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7XG52YXIgaW50U2l6ZSA9IDQ7XG52YXIgemVyb0J1ZmZlciA9IG5ldyBCdWZmZXIoaW50U2l6ZSk7IHplcm9CdWZmZXIuZmlsbCgwKTtcbnZhciBjaHJzeiA9IDg7XG5cbmZ1bmN0aW9uIHRvQXJyYXkoYnVmLCBiaWdFbmRpYW4pIHtcbiAgaWYgKChidWYubGVuZ3RoICUgaW50U2l6ZSkgIT09IDApIHtcbiAgICB2YXIgbGVuID0gYnVmLmxlbmd0aCArIChpbnRTaXplIC0gKGJ1Zi5sZW5ndGggJSBpbnRTaXplKSk7XG4gICAgYnVmID0gQnVmZmVyLmNvbmNhdChbYnVmLCB6ZXJvQnVmZmVyXSwgbGVuKTtcbiAgfVxuXG4gIHZhciBhcnIgPSBbXTtcbiAgdmFyIGZuID0gYmlnRW5kaWFuID8gYnVmLnJlYWRJbnQzMkJFIDogYnVmLnJlYWRJbnQzMkxFO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1Zi5sZW5ndGg7IGkgKz0gaW50U2l6ZSkge1xuICAgIGFyci5wdXNoKGZuLmNhbGwoYnVmLCBpKSk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuZnVuY3Rpb24gdG9CdWZmZXIoYXJyLCBzaXplLCBiaWdFbmRpYW4pIHtcbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIoc2l6ZSk7XG4gIHZhciBmbiA9IGJpZ0VuZGlhbiA/IGJ1Zi53cml0ZUludDMyQkUgOiBidWYud3JpdGVJbnQzMkxFO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgIGZuLmNhbGwoYnVmLCBhcnJbaV0sIGkgKiA0LCB0cnVlKTtcbiAgfVxuICByZXR1cm4gYnVmO1xufVxuXG5mdW5jdGlvbiBoYXNoKGJ1ZiwgZm4sIGhhc2hTaXplLCBiaWdFbmRpYW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgYnVmID0gbmV3IEJ1ZmZlcihidWYpO1xuICB2YXIgYXJyID0gZm4odG9BcnJheShidWYsIGJpZ0VuZGlhbiksIGJ1Zi5sZW5ndGggKiBjaHJzeik7XG4gIHJldHVybiB0b0J1ZmZlcihhcnIsIGhhc2hTaXplLCBiaWdFbmRpYW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgaGFzaDogaGFzaCB9O1xuIiwidmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlclxudmFyIHNoYSA9IHJlcXVpcmUoJy4vc2hhJylcbnZhciBzaGEyNTYgPSByZXF1aXJlKCcuL3NoYTI1NicpXG52YXIgcm5nID0gcmVxdWlyZSgnLi9ybmcnKVxudmFyIG1kNSA9IHJlcXVpcmUoJy4vbWQ1JylcblxudmFyIGFsZ29yaXRobXMgPSB7XG4gIHNoYTE6IHNoYSxcbiAgc2hhMjU2OiBzaGEyNTYsXG4gIG1kNTogbWQ1XG59XG5cbnZhciBibG9ja3NpemUgPSA2NFxudmFyIHplcm9CdWZmZXIgPSBuZXcgQnVmZmVyKGJsb2Nrc2l6ZSk7IHplcm9CdWZmZXIuZmlsbCgwKVxuZnVuY3Rpb24gaG1hYyhmbiwga2V5LCBkYXRhKSB7XG4gIGlmKCFCdWZmZXIuaXNCdWZmZXIoa2V5KSkga2V5ID0gbmV3IEJ1ZmZlcihrZXkpXG4gIGlmKCFCdWZmZXIuaXNCdWZmZXIoZGF0YSkpIGRhdGEgPSBuZXcgQnVmZmVyKGRhdGEpXG5cbiAgaWYoa2V5Lmxlbmd0aCA+IGJsb2Nrc2l6ZSkge1xuICAgIGtleSA9IGZuKGtleSlcbiAgfSBlbHNlIGlmKGtleS5sZW5ndGggPCBibG9ja3NpemUpIHtcbiAgICBrZXkgPSBCdWZmZXIuY29uY2F0KFtrZXksIHplcm9CdWZmZXJdLCBibG9ja3NpemUpXG4gIH1cblxuICB2YXIgaXBhZCA9IG5ldyBCdWZmZXIoYmxvY2tzaXplKSwgb3BhZCA9IG5ldyBCdWZmZXIoYmxvY2tzaXplKVxuICBmb3IodmFyIGkgPSAwOyBpIDwgYmxvY2tzaXplOyBpKyspIHtcbiAgICBpcGFkW2ldID0ga2V5W2ldIF4gMHgzNlxuICAgIG9wYWRbaV0gPSBrZXlbaV0gXiAweDVDXG4gIH1cblxuICB2YXIgaGFzaCA9IGZuKEJ1ZmZlci5jb25jYXQoW2lwYWQsIGRhdGFdKSlcbiAgcmV0dXJuIGZuKEJ1ZmZlci5jb25jYXQoW29wYWQsIGhhc2hdKSlcbn1cblxuZnVuY3Rpb24gaGFzaChhbGcsIGtleSkge1xuICBhbGcgPSBhbGcgfHwgJ3NoYTEnXG4gIHZhciBmbiA9IGFsZ29yaXRobXNbYWxnXVxuICB2YXIgYnVmcyA9IFtdXG4gIHZhciBsZW5ndGggPSAwXG4gIGlmKCFmbikgZXJyb3IoJ2FsZ29yaXRobTonLCBhbGcsICdpcyBub3QgeWV0IHN1cHBvcnRlZCcpXG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgaWYoIUJ1ZmZlci5pc0J1ZmZlcihkYXRhKSkgZGF0YSA9IG5ldyBCdWZmZXIoZGF0YSlcbiAgICAgICAgXG4gICAgICBidWZzLnB1c2goZGF0YSlcbiAgICAgIGxlbmd0aCArPSBkYXRhLmxlbmd0aFxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuICAgIGRpZ2VzdDogZnVuY3Rpb24gKGVuYykge1xuICAgICAgdmFyIGJ1ZiA9IEJ1ZmZlci5jb25jYXQoYnVmcylcbiAgICAgIHZhciByID0ga2V5ID8gaG1hYyhmbiwga2V5LCBidWYpIDogZm4oYnVmKVxuICAgICAgYnVmcyA9IG51bGxcbiAgICAgIHJldHVybiBlbmMgPyByLnRvU3RyaW5nKGVuYykgOiByXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGVycm9yICgpIHtcbiAgdmFyIG0gPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykuam9pbignICcpXG4gIHRocm93IG5ldyBFcnJvcihbXG4gICAgbSxcbiAgICAnd2UgYWNjZXB0IHB1bGwgcmVxdWVzdHMnLFxuICAgICdodHRwOi8vZ2l0aHViLmNvbS9kb21pbmljdGFyci9jcnlwdG8tYnJvd3NlcmlmeSdcbiAgICBdLmpvaW4oJ1xcbicpKVxufVxuXG5leHBvcnRzLmNyZWF0ZUhhc2ggPSBmdW5jdGlvbiAoYWxnKSB7IHJldHVybiBoYXNoKGFsZykgfVxuZXhwb3J0cy5jcmVhdGVIbWFjID0gZnVuY3Rpb24gKGFsZywga2V5KSB7IHJldHVybiBoYXNoKGFsZywga2V5KSB9XG5leHBvcnRzLnJhbmRvbUJ5dGVzID0gZnVuY3Rpb24oc2l6ZSwgY2FsbGJhY2spIHtcbiAgaWYgKGNhbGxiYWNrICYmIGNhbGxiYWNrLmNhbGwpIHtcbiAgICB0cnkge1xuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCB1bmRlZmluZWQsIG5ldyBCdWZmZXIocm5nKHNpemUpKSlcbiAgICB9IGNhdGNoIChlcnIpIHsgY2FsbGJhY2soZXJyKSB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIocm5nKHNpemUpKVxuICB9XG59XG5cbmZ1bmN0aW9uIGVhY2goYSwgZikge1xuICBmb3IodmFyIGkgaW4gYSlcbiAgICBmKGFbaV0sIGkpXG59XG5cbi8vIHRoZSBsZWFzdCBJIGNhbiBkbyBpcyBtYWtlIGVycm9yIG1lc3NhZ2VzIGZvciB0aGUgcmVzdCBvZiB0aGUgbm9kZS5qcy9jcnlwdG8gYXBpLlxuZWFjaChbJ2NyZWF0ZUNyZWRlbnRpYWxzJ1xuLCAnY3JlYXRlQ2lwaGVyJ1xuLCAnY3JlYXRlQ2lwaGVyaXYnXG4sICdjcmVhdGVEZWNpcGhlcidcbiwgJ2NyZWF0ZURlY2lwaGVyaXYnXG4sICdjcmVhdGVTaWduJ1xuLCAnY3JlYXRlVmVyaWZ5J1xuLCAnY3JlYXRlRGlmZmllSGVsbG1hbidcbiwgJ3Bia2RmMiddLCBmdW5jdGlvbiAobmFtZSkge1xuICBleHBvcnRzW25hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgIGVycm9yKCdzb3JyeSwnLCBuYW1lLCAnaXMgbm90IGltcGxlbWVudGVkIHlldCcpXG4gIH1cbn0pXG4iLCIvKlxyXG4gKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFJTQSBEYXRhIFNlY3VyaXR5LCBJbmMuIE1ENSBNZXNzYWdlXHJcbiAqIERpZ2VzdCBBbGdvcml0aG0sIGFzIGRlZmluZWQgaW4gUkZDIDEzMjEuXHJcbiAqIFZlcnNpb24gMi4xIENvcHlyaWdodCAoQykgUGF1bCBKb2huc3RvbiAxOTk5IC0gMjAwMi5cclxuICogT3RoZXIgY29udHJpYnV0b3JzOiBHcmVnIEhvbHQsIEFuZHJldyBLZXBlcnQsIFlkbmFyLCBMb3N0aW5ldFxyXG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgQlNEIExpY2Vuc2VcclxuICogU2VlIGh0dHA6Ly9wYWpob21lLm9yZy51ay9jcnlwdC9tZDUgZm9yIG1vcmUgaW5mby5cclxuICovXHJcblxyXG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpO1xyXG5cclxuLypcclxuICogUGVyZm9ybSBhIHNpbXBsZSBzZWxmLXRlc3QgdG8gc2VlIGlmIHRoZSBWTSBpcyB3b3JraW5nXHJcbiAqL1xyXG5mdW5jdGlvbiBtZDVfdm1fdGVzdCgpXHJcbntcclxuICByZXR1cm4gaGV4X21kNShcImFiY1wiKSA9PSBcIjkwMDE1MDk4M2NkMjRmYjBkNjk2M2Y3ZDI4ZTE3ZjcyXCI7XHJcbn1cclxuXHJcbi8qXHJcbiAqIENhbGN1bGF0ZSB0aGUgTUQ1IG9mIGFuIGFycmF5IG9mIGxpdHRsZS1lbmRpYW4gd29yZHMsIGFuZCBhIGJpdCBsZW5ndGhcclxuICovXHJcbmZ1bmN0aW9uIGNvcmVfbWQ1KHgsIGxlbilcclxue1xyXG4gIC8qIGFwcGVuZCBwYWRkaW5nICovXHJcbiAgeFtsZW4gPj4gNV0gfD0gMHg4MCA8PCAoKGxlbikgJSAzMik7XHJcbiAgeFsoKChsZW4gKyA2NCkgPj4+IDkpIDw8IDQpICsgMTRdID0gbGVuO1xyXG5cclxuICB2YXIgYSA9ICAxNzMyNTg0MTkzO1xyXG4gIHZhciBiID0gLTI3MTczMzg3OTtcclxuICB2YXIgYyA9IC0xNzMyNTg0MTk0O1xyXG4gIHZhciBkID0gIDI3MTczMzg3ODtcclxuXHJcbiAgZm9yKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpICs9IDE2KVxyXG4gIHtcclxuICAgIHZhciBvbGRhID0gYTtcclxuICAgIHZhciBvbGRiID0gYjtcclxuICAgIHZhciBvbGRjID0gYztcclxuICAgIHZhciBvbGRkID0gZDtcclxuXHJcbiAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSsgMF0sIDcgLCAtNjgwODc2OTM2KTtcclxuICAgIGQgPSBtZDVfZmYoZCwgYSwgYiwgYywgeFtpKyAxXSwgMTIsIC0zODk1NjQ1ODYpO1xyXG4gICAgYyA9IG1kNV9mZihjLCBkLCBhLCBiLCB4W2krIDJdLCAxNywgIDYwNjEwNTgxOSk7XHJcbiAgICBiID0gbWQ1X2ZmKGIsIGMsIGQsIGEsIHhbaSsgM10sIDIyLCAtMTA0NDUyNTMzMCk7XHJcbiAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSsgNF0sIDcgLCAtMTc2NDE4ODk3KTtcclxuICAgIGQgPSBtZDVfZmYoZCwgYSwgYiwgYywgeFtpKyA1XSwgMTIsICAxMjAwMDgwNDI2KTtcclxuICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpKyA2XSwgMTcsIC0xNDczMjMxMzQxKTtcclxuICAgIGIgPSBtZDVfZmYoYiwgYywgZCwgYSwgeFtpKyA3XSwgMjIsIC00NTcwNTk4Myk7XHJcbiAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSsgOF0sIDcgLCAgMTc3MDAzNTQxNik7XHJcbiAgICBkID0gbWQ1X2ZmKGQsIGEsIGIsIGMsIHhbaSsgOV0sIDEyLCAtMTk1ODQxNDQxNyk7XHJcbiAgICBjID0gbWQ1X2ZmKGMsIGQsIGEsIGIsIHhbaSsxMF0sIDE3LCAtNDIwNjMpO1xyXG4gICAgYiA9IG1kNV9mZihiLCBjLCBkLCBhLCB4W2krMTFdLCAyMiwgLTE5OTA0MDQxNjIpO1xyXG4gICAgYSA9IG1kNV9mZihhLCBiLCBjLCBkLCB4W2krMTJdLCA3ICwgIDE4MDQ2MDM2ODIpO1xyXG4gICAgZCA9IG1kNV9mZihkLCBhLCBiLCBjLCB4W2krMTNdLCAxMiwgLTQwMzQxMTAxKTtcclxuICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpKzE0XSwgMTcsIC0xNTAyMDAyMjkwKTtcclxuICAgIGIgPSBtZDVfZmYoYiwgYywgZCwgYSwgeFtpKzE1XSwgMjIsICAxMjM2NTM1MzI5KTtcclxuXHJcbiAgICBhID0gbWQ1X2dnKGEsIGIsIGMsIGQsIHhbaSsgMV0sIDUgLCAtMTY1Nzk2NTEwKTtcclxuICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpKyA2XSwgOSAsIC0xMDY5NTAxNjMyKTtcclxuICAgIGMgPSBtZDVfZ2coYywgZCwgYSwgYiwgeFtpKzExXSwgMTQsICA2NDM3MTc3MTMpO1xyXG4gICAgYiA9IG1kNV9nZyhiLCBjLCBkLCBhLCB4W2krIDBdLCAyMCwgLTM3Mzg5NzMwMik7XHJcbiAgICBhID0gbWQ1X2dnKGEsIGIsIGMsIGQsIHhbaSsgNV0sIDUgLCAtNzAxNTU4NjkxKTtcclxuICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpKzEwXSwgOSAsICAzODAxNjA4Myk7XHJcbiAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSsxNV0sIDE0LCAtNjYwNDc4MzM1KTtcclxuICAgIGIgPSBtZDVfZ2coYiwgYywgZCwgYSwgeFtpKyA0XSwgMjAsIC00MDU1Mzc4NDgpO1xyXG4gICAgYSA9IG1kNV9nZyhhLCBiLCBjLCBkLCB4W2krIDldLCA1ICwgIDU2ODQ0NjQzOCk7XHJcbiAgICBkID0gbWQ1X2dnKGQsIGEsIGIsIGMsIHhbaSsxNF0sIDkgLCAtMTAxOTgwMzY5MCk7XHJcbiAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSsgM10sIDE0LCAtMTg3MzYzOTYxKTtcclxuICAgIGIgPSBtZDVfZ2coYiwgYywgZCwgYSwgeFtpKyA4XSwgMjAsICAxMTYzNTMxNTAxKTtcclxuICAgIGEgPSBtZDVfZ2coYSwgYiwgYywgZCwgeFtpKzEzXSwgNSAsIC0xNDQ0NjgxNDY3KTtcclxuICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpKyAyXSwgOSAsIC01MTQwMzc4NCk7XHJcbiAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSsgN10sIDE0LCAgMTczNTMyODQ3Myk7XHJcbiAgICBiID0gbWQ1X2dnKGIsIGMsIGQsIGEsIHhbaSsxMl0sIDIwLCAtMTkyNjYwNzczNCk7XHJcblxyXG4gICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2krIDVdLCA0ICwgLTM3ODU1OCk7XHJcbiAgICBkID0gbWQ1X2hoKGQsIGEsIGIsIGMsIHhbaSsgOF0sIDExLCAtMjAyMjU3NDQ2Myk7XHJcbiAgICBjID0gbWQ1X2hoKGMsIGQsIGEsIGIsIHhbaSsxMV0sIDE2LCAgMTgzOTAzMDU2Mik7XHJcbiAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSsxNF0sIDIzLCAtMzUzMDk1NTYpO1xyXG4gICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2krIDFdLCA0ICwgLTE1MzA5OTIwNjApO1xyXG4gICAgZCA9IG1kNV9oaChkLCBhLCBiLCBjLCB4W2krIDRdLCAxMSwgIDEyNzI4OTMzNTMpO1xyXG4gICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2krIDddLCAxNiwgLTE1NTQ5NzYzMik7XHJcbiAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSsxMF0sIDIzLCAtMTA5NDczMDY0MCk7XHJcbiAgICBhID0gbWQ1X2hoKGEsIGIsIGMsIGQsIHhbaSsxM10sIDQgLCAgNjgxMjc5MTc0KTtcclxuICAgIGQgPSBtZDVfaGgoZCwgYSwgYiwgYywgeFtpKyAwXSwgMTEsIC0zNTg1MzcyMjIpO1xyXG4gICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2krIDNdLCAxNiwgLTcyMjUyMTk3OSk7XHJcbiAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSsgNl0sIDIzLCAgNzYwMjkxODkpO1xyXG4gICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2krIDldLCA0ICwgLTY0MDM2NDQ4Nyk7XHJcbiAgICBkID0gbWQ1X2hoKGQsIGEsIGIsIGMsIHhbaSsxMl0sIDExLCAtNDIxODE1ODM1KTtcclxuICAgIGMgPSBtZDVfaGgoYywgZCwgYSwgYiwgeFtpKzE1XSwgMTYsICA1MzA3NDI1MjApO1xyXG4gICAgYiA9IG1kNV9oaChiLCBjLCBkLCBhLCB4W2krIDJdLCAyMywgLTk5NTMzODY1MSk7XHJcblxyXG4gICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2krIDBdLCA2ICwgLTE5ODYzMDg0NCk7XHJcbiAgICBkID0gbWQ1X2lpKGQsIGEsIGIsIGMsIHhbaSsgN10sIDEwLCAgMTEyNjg5MTQxNSk7XHJcbiAgICBjID0gbWQ1X2lpKGMsIGQsIGEsIGIsIHhbaSsxNF0sIDE1LCAtMTQxNjM1NDkwNSk7XHJcbiAgICBiID0gbWQ1X2lpKGIsIGMsIGQsIGEsIHhbaSsgNV0sIDIxLCAtNTc0MzQwNTUpO1xyXG4gICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2krMTJdLCA2ICwgIDE3MDA0ODU1NzEpO1xyXG4gICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2krIDNdLCAxMCwgLTE4OTQ5ODY2MDYpO1xyXG4gICAgYyA9IG1kNV9paShjLCBkLCBhLCBiLCB4W2krMTBdLCAxNSwgLTEwNTE1MjMpO1xyXG4gICAgYiA9IG1kNV9paShiLCBjLCBkLCBhLCB4W2krIDFdLCAyMSwgLTIwNTQ5MjI3OTkpO1xyXG4gICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2krIDhdLCA2ICwgIDE4NzMzMTMzNTkpO1xyXG4gICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2krMTVdLCAxMCwgLTMwNjExNzQ0KTtcclxuICAgIGMgPSBtZDVfaWkoYywgZCwgYSwgYiwgeFtpKyA2XSwgMTUsIC0xNTYwMTk4MzgwKTtcclxuICAgIGIgPSBtZDVfaWkoYiwgYywgZCwgYSwgeFtpKzEzXSwgMjEsICAxMzA5MTUxNjQ5KTtcclxuICAgIGEgPSBtZDVfaWkoYSwgYiwgYywgZCwgeFtpKyA0XSwgNiAsIC0xNDU1MjMwNzApO1xyXG4gICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2krMTFdLCAxMCwgLTExMjAyMTAzNzkpO1xyXG4gICAgYyA9IG1kNV9paShjLCBkLCBhLCBiLCB4W2krIDJdLCAxNSwgIDcxODc4NzI1OSk7XHJcbiAgICBiID0gbWQ1X2lpKGIsIGMsIGQsIGEsIHhbaSsgOV0sIDIxLCAtMzQzNDg1NTUxKTtcclxuXHJcbiAgICBhID0gc2FmZV9hZGQoYSwgb2xkYSk7XHJcbiAgICBiID0gc2FmZV9hZGQoYiwgb2xkYik7XHJcbiAgICBjID0gc2FmZV9hZGQoYywgb2xkYyk7XHJcbiAgICBkID0gc2FmZV9hZGQoZCwgb2xkZCk7XHJcbiAgfVxyXG4gIHJldHVybiBBcnJheShhLCBiLCBjLCBkKTtcclxuXHJcbn1cclxuXHJcbi8qXHJcbiAqIFRoZXNlIGZ1bmN0aW9ucyBpbXBsZW1lbnQgdGhlIGZvdXIgYmFzaWMgb3BlcmF0aW9ucyB0aGUgYWxnb3JpdGhtIHVzZXMuXHJcbiAqL1xyXG5mdW5jdGlvbiBtZDVfY21uKHEsIGEsIGIsIHgsIHMsIHQpXHJcbntcclxuICByZXR1cm4gc2FmZV9hZGQoYml0X3JvbChzYWZlX2FkZChzYWZlX2FkZChhLCBxKSwgc2FmZV9hZGQoeCwgdCkpLCBzKSxiKTtcclxufVxyXG5mdW5jdGlvbiBtZDVfZmYoYSwgYiwgYywgZCwgeCwgcywgdClcclxue1xyXG4gIHJldHVybiBtZDVfY21uKChiICYgYykgfCAoKH5iKSAmIGQpLCBhLCBiLCB4LCBzLCB0KTtcclxufVxyXG5mdW5jdGlvbiBtZDVfZ2coYSwgYiwgYywgZCwgeCwgcywgdClcclxue1xyXG4gIHJldHVybiBtZDVfY21uKChiICYgZCkgfCAoYyAmICh+ZCkpLCBhLCBiLCB4LCBzLCB0KTtcclxufVxyXG5mdW5jdGlvbiBtZDVfaGgoYSwgYiwgYywgZCwgeCwgcywgdClcclxue1xyXG4gIHJldHVybiBtZDVfY21uKGIgXiBjIF4gZCwgYSwgYiwgeCwgcywgdCk7XHJcbn1cclxuZnVuY3Rpb24gbWQ1X2lpKGEsIGIsIGMsIGQsIHgsIHMsIHQpXHJcbntcclxuICByZXR1cm4gbWQ1X2NtbihjIF4gKGIgfCAofmQpKSwgYSwgYiwgeCwgcywgdCk7XHJcbn1cclxuXHJcbi8qXHJcbiAqIEFkZCBpbnRlZ2Vycywgd3JhcHBpbmcgYXQgMl4zMi4gVGhpcyB1c2VzIDE2LWJpdCBvcGVyYXRpb25zIGludGVybmFsbHlcclxuICogdG8gd29yayBhcm91bmQgYnVncyBpbiBzb21lIEpTIGludGVycHJldGVycy5cclxuICovXHJcbmZ1bmN0aW9uIHNhZmVfYWRkKHgsIHkpXHJcbntcclxuICB2YXIgbHN3ID0gKHggJiAweEZGRkYpICsgKHkgJiAweEZGRkYpO1xyXG4gIHZhciBtc3cgPSAoeCA+PiAxNikgKyAoeSA+PiAxNikgKyAobHN3ID4+IDE2KTtcclxuICByZXR1cm4gKG1zdyA8PCAxNikgfCAobHN3ICYgMHhGRkZGKTtcclxufVxyXG5cclxuLypcclxuICogQml0d2lzZSByb3RhdGUgYSAzMi1iaXQgbnVtYmVyIHRvIHRoZSBsZWZ0LlxyXG4gKi9cclxuZnVuY3Rpb24gYml0X3JvbChudW0sIGNudClcclxue1xyXG4gIHJldHVybiAobnVtIDw8IGNudCkgfCAobnVtID4+PiAoMzIgLSBjbnQpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtZDUoYnVmKSB7XHJcbiAgcmV0dXJuIGhlbHBlcnMuaGFzaChidWYsIGNvcmVfbWQ1LCAxNik7XHJcbn07XHJcbiIsIi8vIE9yaWdpbmFsIGNvZGUgYWRhcHRlZCBmcm9tIFJvYmVydCBLaWVmZmVyLlxuLy8gZGV0YWlscyBhdCBodHRwczovL2dpdGh1Yi5jb20vYnJvb2ZhL25vZGUtdXVpZFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgX2dsb2JhbCA9IHRoaXM7XG5cbiAgdmFyIG1hdGhSTkcsIHdoYXR3Z1JORztcblxuICAvLyBOT1RFOiBNYXRoLnJhbmRvbSgpIGRvZXMgbm90IGd1YXJhbnRlZSBcImNyeXB0b2dyYXBoaWMgcXVhbGl0eVwiXG4gIG1hdGhSTkcgPSBmdW5jdGlvbihzaXplKSB7XG4gICAgdmFyIGJ5dGVzID0gbmV3IEFycmF5KHNpemUpO1xuICAgIHZhciByO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIHI7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGlmICgoaSAmIDB4MDMpID09IDApIHIgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDA7XG4gICAgICBieXRlc1tpXSA9IHIgPj4+ICgoaSAmIDB4MDMpIDw8IDMpICYgMHhmZjtcbiAgICB9XG5cbiAgICByZXR1cm4gYnl0ZXM7XG4gIH1cblxuICBpZiAoX2dsb2JhbC5jcnlwdG8gJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xuICAgIHdoYXR3Z1JORyA9IGZ1bmN0aW9uKHNpemUpIHtcbiAgICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KHNpemUpO1xuICAgICAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhieXRlcyk7XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfVxuICB9XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSB3aGF0d2dSTkcgfHwgbWF0aFJORztcblxufSgpKVxuIiwiLypcbiAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgU2VjdXJlIEhhc2ggQWxnb3JpdGhtLCBTSEEtMSwgYXMgZGVmaW5lZFxuICogaW4gRklQUyBQVUIgMTgwLTFcbiAqIFZlcnNpb24gMi4xYSBDb3B5cmlnaHQgUGF1bCBKb2huc3RvbiAyMDAwIC0gMjAwMi5cbiAqIE90aGVyIGNvbnRyaWJ1dG9yczogR3JlZyBIb2x0LCBBbmRyZXcgS2VwZXJ0LCBZZG5hciwgTG9zdGluZXRcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSBCU0QgTGljZW5zZVxuICogU2VlIGh0dHA6Ly9wYWpob21lLm9yZy51ay9jcnlwdC9tZDUgZm9yIGRldGFpbHMuXG4gKi9cblxudmFyIGhlbHBlcnMgPSByZXF1aXJlKCcuL2hlbHBlcnMnKTtcblxuLypcbiAqIENhbGN1bGF0ZSB0aGUgU0hBLTEgb2YgYW4gYXJyYXkgb2YgYmlnLWVuZGlhbiB3b3JkcywgYW5kIGEgYml0IGxlbmd0aFxuICovXG5mdW5jdGlvbiBjb3JlX3NoYTEoeCwgbGVuKVxue1xuICAvKiBhcHBlbmQgcGFkZGluZyAqL1xuICB4W2xlbiA+PiA1XSB8PSAweDgwIDw8ICgyNCAtIGxlbiAlIDMyKTtcbiAgeFsoKGxlbiArIDY0ID4+IDkpIDw8IDQpICsgMTVdID0gbGVuO1xuXG4gIHZhciB3ID0gQXJyYXkoODApO1xuICB2YXIgYSA9ICAxNzMyNTg0MTkzO1xuICB2YXIgYiA9IC0yNzE3MzM4Nzk7XG4gIHZhciBjID0gLTE3MzI1ODQxOTQ7XG4gIHZhciBkID0gIDI3MTczMzg3ODtcbiAgdmFyIGUgPSAtMTAwOTU4OTc3NjtcblxuICBmb3IodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkgKz0gMTYpXG4gIHtcbiAgICB2YXIgb2xkYSA9IGE7XG4gICAgdmFyIG9sZGIgPSBiO1xuICAgIHZhciBvbGRjID0gYztcbiAgICB2YXIgb2xkZCA9IGQ7XG4gICAgdmFyIG9sZGUgPSBlO1xuXG4gICAgZm9yKHZhciBqID0gMDsgaiA8IDgwOyBqKyspXG4gICAge1xuICAgICAgaWYoaiA8IDE2KSB3W2pdID0geFtpICsgal07XG4gICAgICBlbHNlIHdbal0gPSByb2wod1tqLTNdIF4gd1tqLThdIF4gd1tqLTE0XSBeIHdbai0xNl0sIDEpO1xuICAgICAgdmFyIHQgPSBzYWZlX2FkZChzYWZlX2FkZChyb2woYSwgNSksIHNoYTFfZnQoaiwgYiwgYywgZCkpLFxuICAgICAgICAgICAgICAgICAgICAgICBzYWZlX2FkZChzYWZlX2FkZChlLCB3W2pdKSwgc2hhMV9rdChqKSkpO1xuICAgICAgZSA9IGQ7XG4gICAgICBkID0gYztcbiAgICAgIGMgPSByb2woYiwgMzApO1xuICAgICAgYiA9IGE7XG4gICAgICBhID0gdDtcbiAgICB9XG5cbiAgICBhID0gc2FmZV9hZGQoYSwgb2xkYSk7XG4gICAgYiA9IHNhZmVfYWRkKGIsIG9sZGIpO1xuICAgIGMgPSBzYWZlX2FkZChjLCBvbGRjKTtcbiAgICBkID0gc2FmZV9hZGQoZCwgb2xkZCk7XG4gICAgZSA9IHNhZmVfYWRkKGUsIG9sZGUpO1xuICB9XG4gIHJldHVybiBBcnJheShhLCBiLCBjLCBkLCBlKTtcblxufVxuXG4vKlxuICogUGVyZm9ybSB0aGUgYXBwcm9wcmlhdGUgdHJpcGxldCBjb21iaW5hdGlvbiBmdW5jdGlvbiBmb3IgdGhlIGN1cnJlbnRcbiAqIGl0ZXJhdGlvblxuICovXG5mdW5jdGlvbiBzaGExX2Z0KHQsIGIsIGMsIGQpXG57XG4gIGlmKHQgPCAyMCkgcmV0dXJuIChiICYgYykgfCAoKH5iKSAmIGQpO1xuICBpZih0IDwgNDApIHJldHVybiBiIF4gYyBeIGQ7XG4gIGlmKHQgPCA2MCkgcmV0dXJuIChiICYgYykgfCAoYiAmIGQpIHwgKGMgJiBkKTtcbiAgcmV0dXJuIGIgXiBjIF4gZDtcbn1cblxuLypcbiAqIERldGVybWluZSB0aGUgYXBwcm9wcmlhdGUgYWRkaXRpdmUgY29uc3RhbnQgZm9yIHRoZSBjdXJyZW50IGl0ZXJhdGlvblxuICovXG5mdW5jdGlvbiBzaGExX2t0KHQpXG57XG4gIHJldHVybiAodCA8IDIwKSA/ICAxNTE4NTAwMjQ5IDogKHQgPCA0MCkgPyAgMTg1OTc3NTM5MyA6XG4gICAgICAgICAodCA8IDYwKSA/IC0xODk0MDA3NTg4IDogLTg5OTQ5NzUxNDtcbn1cblxuLypcbiAqIEFkZCBpbnRlZ2Vycywgd3JhcHBpbmcgYXQgMl4zMi4gVGhpcyB1c2VzIDE2LWJpdCBvcGVyYXRpb25zIGludGVybmFsbHlcbiAqIHRvIHdvcmsgYXJvdW5kIGJ1Z3MgaW4gc29tZSBKUyBpbnRlcnByZXRlcnMuXG4gKi9cbmZ1bmN0aW9uIHNhZmVfYWRkKHgsIHkpXG57XG4gIHZhciBsc3cgPSAoeCAmIDB4RkZGRikgKyAoeSAmIDB4RkZGRik7XG4gIHZhciBtc3cgPSAoeCA+PiAxNikgKyAoeSA+PiAxNikgKyAobHN3ID4+IDE2KTtcbiAgcmV0dXJuIChtc3cgPDwgMTYpIHwgKGxzdyAmIDB4RkZGRik7XG59XG5cbi8qXG4gKiBCaXR3aXNlIHJvdGF0ZSBhIDMyLWJpdCBudW1iZXIgdG8gdGhlIGxlZnQuXG4gKi9cbmZ1bmN0aW9uIHJvbChudW0sIGNudClcbntcbiAgcmV0dXJuIChudW0gPDwgY250KSB8IChudW0gPj4+ICgzMiAtIGNudCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNoYTEoYnVmKSB7XG4gIHJldHVybiBoZWxwZXJzLmhhc2goYnVmLCBjb3JlX3NoYTEsIDIwLCB0cnVlKTtcbn07XG4iLCJcbi8qKlxuICogQSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBTZWN1cmUgSGFzaCBBbGdvcml0aG0sIFNIQS0yNTYsIGFzIGRlZmluZWRcbiAqIGluIEZJUFMgMTgwLTJcbiAqIFZlcnNpb24gMi4yLWJldGEgQ29weXJpZ2h0IEFuZ2VsIE1hcmluLCBQYXVsIEpvaG5zdG9uIDIwMDAgLSAyMDA5LlxuICogT3RoZXIgY29udHJpYnV0b3JzOiBHcmVnIEhvbHQsIEFuZHJldyBLZXBlcnQsIFlkbmFyLCBMb3N0aW5ldFxuICpcbiAqL1xuXG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpO1xuXG52YXIgc2FmZV9hZGQgPSBmdW5jdGlvbih4LCB5KSB7XG4gIHZhciBsc3cgPSAoeCAmIDB4RkZGRikgKyAoeSAmIDB4RkZGRik7XG4gIHZhciBtc3cgPSAoeCA+PiAxNikgKyAoeSA+PiAxNikgKyAobHN3ID4+IDE2KTtcbiAgcmV0dXJuIChtc3cgPDwgMTYpIHwgKGxzdyAmIDB4RkZGRik7XG59O1xuXG52YXIgUyA9IGZ1bmN0aW9uKFgsIG4pIHtcbiAgcmV0dXJuIChYID4+PiBuKSB8IChYIDw8ICgzMiAtIG4pKTtcbn07XG5cbnZhciBSID0gZnVuY3Rpb24oWCwgbikge1xuICByZXR1cm4gKFggPj4+IG4pO1xufTtcblxudmFyIENoID0gZnVuY3Rpb24oeCwgeSwgeikge1xuICByZXR1cm4gKCh4ICYgeSkgXiAoKH54KSAmIHopKTtcbn07XG5cbnZhciBNYWogPSBmdW5jdGlvbih4LCB5LCB6KSB7XG4gIHJldHVybiAoKHggJiB5KSBeICh4ICYgeikgXiAoeSAmIHopKTtcbn07XG5cbnZhciBTaWdtYTAyNTYgPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiAoUyh4LCAyKSBeIFMoeCwgMTMpIF4gUyh4LCAyMikpO1xufTtcblxudmFyIFNpZ21hMTI1NiA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIChTKHgsIDYpIF4gUyh4LCAxMSkgXiBTKHgsIDI1KSk7XG59O1xuXG52YXIgR2FtbWEwMjU2ID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4gKFMoeCwgNykgXiBTKHgsIDE4KSBeIFIoeCwgMykpO1xufTtcblxudmFyIEdhbW1hMTI1NiA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIChTKHgsIDE3KSBeIFMoeCwgMTkpIF4gUih4LCAxMCkpO1xufTtcblxudmFyIGNvcmVfc2hhMjU2ID0gZnVuY3Rpb24obSwgbCkge1xuICB2YXIgSyA9IG5ldyBBcnJheSgweDQyOEEyRjk4LDB4NzEzNzQ0OTEsMHhCNUMwRkJDRiwweEU5QjVEQkE1LDB4Mzk1NkMyNUIsMHg1OUYxMTFGMSwweDkyM0Y4MkE0LDB4QUIxQzVFRDUsMHhEODA3QUE5OCwweDEyODM1QjAxLDB4MjQzMTg1QkUsMHg1NTBDN0RDMywweDcyQkU1RDc0LDB4ODBERUIxRkUsMHg5QkRDMDZBNywweEMxOUJGMTc0LDB4RTQ5QjY5QzEsMHhFRkJFNDc4NiwweEZDMTlEQzYsMHgyNDBDQTFDQywweDJERTkyQzZGLDB4NEE3NDg0QUEsMHg1Q0IwQTlEQywweDc2Rjk4OERBLDB4OTgzRTUxNTIsMHhBODMxQzY2RCwweEIwMDMyN0M4LDB4QkY1OTdGQzcsMHhDNkUwMEJGMywweEQ1QTc5MTQ3LDB4NkNBNjM1MSwweDE0MjkyOTY3LDB4MjdCNzBBODUsMHgyRTFCMjEzOCwweDREMkM2REZDLDB4NTMzODBEMTMsMHg2NTBBNzM1NCwweDc2NkEwQUJCLDB4ODFDMkM5MkUsMHg5MjcyMkM4NSwweEEyQkZFOEExLDB4QTgxQTY2NEIsMHhDMjRCOEI3MCwweEM3NkM1MUEzLDB4RDE5MkU4MTksMHhENjk5MDYyNCwweEY0MEUzNTg1LDB4MTA2QUEwNzAsMHgxOUE0QzExNiwweDFFMzc2QzA4LDB4Mjc0ODc3NEMsMHgzNEIwQkNCNSwweDM5MUMwQ0IzLDB4NEVEOEFBNEEsMHg1QjlDQ0E0RiwweDY4MkU2RkYzLDB4NzQ4RjgyRUUsMHg3OEE1NjM2RiwweDg0Qzg3ODE0LDB4OENDNzAyMDgsMHg5MEJFRkZGQSwweEE0NTA2Q0VCLDB4QkVGOUEzRjcsMHhDNjcxNzhGMik7XG4gIHZhciBIQVNIID0gbmV3IEFycmF5KDB4NkEwOUU2NjcsIDB4QkI2N0FFODUsIDB4M0M2RUYzNzIsIDB4QTU0RkY1M0EsIDB4NTEwRTUyN0YsIDB4OUIwNTY4OEMsIDB4MUY4M0Q5QUIsIDB4NUJFMENEMTkpO1xuICAgIHZhciBXID0gbmV3IEFycmF5KDY0KTtcbiAgICB2YXIgYSwgYiwgYywgZCwgZSwgZiwgZywgaCwgaSwgajtcbiAgICB2YXIgVDEsIFQyO1xuICAvKiBhcHBlbmQgcGFkZGluZyAqL1xuICBtW2wgPj4gNV0gfD0gMHg4MCA8PCAoMjQgLSBsICUgMzIpO1xuICBtWygobCArIDY0ID4+IDkpIDw8IDQpICsgMTVdID0gbDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSArPSAxNikge1xuICAgIGEgPSBIQVNIWzBdOyBiID0gSEFTSFsxXTsgYyA9IEhBU0hbMl07IGQgPSBIQVNIWzNdOyBlID0gSEFTSFs0XTsgZiA9IEhBU0hbNV07IGcgPSBIQVNIWzZdOyBoID0gSEFTSFs3XTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IDY0OyBqKyspIHtcbiAgICAgIGlmIChqIDwgMTYpIHtcbiAgICAgICAgV1tqXSA9IG1baiArIGldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgV1tqXSA9IHNhZmVfYWRkKHNhZmVfYWRkKHNhZmVfYWRkKEdhbW1hMTI1NihXW2ogLSAyXSksIFdbaiAtIDddKSwgR2FtbWEwMjU2KFdbaiAtIDE1XSkpLCBXW2ogLSAxNl0pO1xuICAgICAgfVxuICAgICAgVDEgPSBzYWZlX2FkZChzYWZlX2FkZChzYWZlX2FkZChzYWZlX2FkZChoLCBTaWdtYTEyNTYoZSkpLCBDaChlLCBmLCBnKSksIEtbal0pLCBXW2pdKTtcbiAgICAgIFQyID0gc2FmZV9hZGQoU2lnbWEwMjU2KGEpLCBNYWooYSwgYiwgYykpO1xuICAgICAgaCA9IGc7IGcgPSBmOyBmID0gZTsgZSA9IHNhZmVfYWRkKGQsIFQxKTsgZCA9IGM7IGMgPSBiOyBiID0gYTsgYSA9IHNhZmVfYWRkKFQxLCBUMik7XG4gICAgfVxuICAgIEhBU0hbMF0gPSBzYWZlX2FkZChhLCBIQVNIWzBdKTsgSEFTSFsxXSA9IHNhZmVfYWRkKGIsIEhBU0hbMV0pOyBIQVNIWzJdID0gc2FmZV9hZGQoYywgSEFTSFsyXSk7IEhBU0hbM10gPSBzYWZlX2FkZChkLCBIQVNIWzNdKTtcbiAgICBIQVNIWzRdID0gc2FmZV9hZGQoZSwgSEFTSFs0XSk7IEhBU0hbNV0gPSBzYWZlX2FkZChmLCBIQVNIWzVdKTsgSEFTSFs2XSA9IHNhZmVfYWRkKGcsIEhBU0hbNl0pOyBIQVNIWzddID0gc2FmZV9hZGQoaCwgSEFTSFs3XSk7XG4gIH1cbiAgcmV0dXJuIEhBU0g7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNoYTI1NihidWYpIHtcbiAgcmV0dXJuIGhlbHBlcnMuaGFzaChidWYsIGNvcmVfc2hhMjU2LCAzMiwgdHJ1ZSk7XG59O1xuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCIvKiBUaGlzIFNvdXJjZSBDb2RlIEZvcm0gaXMgc3ViamVjdCB0byB0aGUgdGVybXMgb2YgdGhlIE1vemlsbGEgUHVibGljXG4gKiBMaWNlbnNlLCB2LiAyLjAuIElmIGEgY29weSBvZiB0aGUgTVBMIHdhcyBub3QgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzXG4gKiBmaWxlLCBZb3UgY2FuIG9idGFpbiBvbmUgYXQgaHR0cDovL21vemlsbGEub3JnL01QTC8yLjAvLiAqL1xuXG52YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbmZ1bmN0aW9uIG5leHQoKSB7XG4gIHJldHVybiBcIkBAc3ltYm9sOlwiICsgY3J5cHRvLnJhbmRvbUJ5dGVzKDgpLnRvU3RyaW5nKCdoZXgnKTtcbn1cblxuXG5mdW5jdGlvbiBTeW1ib2woZGVzYykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgU3ltYm9sKSkge1xuICAgIHJldHVybiBuZXcgU3ltYm9sKGRlc2MpO1xuICB9XG4gIHZhciBfc3ltYm9sID0gdGhpcy5fc3ltYm9sID0gbmV4dCgpO1xuICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX2Rlc2MnLCB7XG4gICAgdmFsdWU6IGRlc2MsXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgd3JpdGFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgfSk7XG4gIGRlZmluZVByb3BlcnR5KE9iamVjdC5wcm90b3R5cGUsIF9zeW1ib2wsIHtcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCBfc3ltYm9sLCB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5TeW1ib2wucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiB0aGlzLl9zeW1ib2w7XG59O1xuXG52YXIgZ2xvYmFsU3ltYm9sUmVnaXN0cnkgPSB7fTtcblN5bWJvbC5mb3IgPSBmdW5jdGlvbiBzeW1ib2xGb3Ioa2V5KSB7XG4gIGtleSA9IFN0cmluZyhrZXkpO1xuICByZXR1cm4gZ2xvYmFsU3ltYm9sUmVnaXN0cnlba2V5XSB8fCAoZ2xvYmFsU3ltYm9sUmVnaXN0cnlba2V5XSA9IFN5bWJvbChrZXkpKTtcbn07XG5cblN5bWJvbC5rZXlGb3IgPSBmdW5jdGlvbiBrZXlGb3Ioc3ltKSB7XG4gIGlmICghKHN5bSBpbnN0YW5jZW9mIFN5bWJvbCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmtleUZvciByZXF1aXJlcyBhIFN5bWJvbCBhcmd1bWVudFwiKTtcbiAgfVxuICBmb3IgKHZhciBrZXkgaW4gZ2xvYmFsU3ltYm9sUmVnaXN0cnkpIHtcbiAgICBpZiAoZ2xvYmFsU3ltYm9sUmVnaXN0cnlba2V5XSA9PT0gc3ltKSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0aGlzLlN5bWJvbCB8fCBTeW1ib2w7XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxubW9kdWxlLmV4cG9ydHMgPSBleHRlbmQ7XG5mdW5jdGlvbiBleHRlbmQob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCB0eXBlb2YgYWRkICE9PSAnb2JqZWN0JykgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBHcmFtbWFyRGVjbCA9IHJlcXVpcmUoJy4vR3JhbW1hckRlY2wnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gQnVpbGRlcigpIHt9XG5cbkJ1aWxkZXIucHJvdG90eXBlID0ge1xuICBuZXdHcmFtbWFyOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBHcmFtbWFyRGVjbChuYW1lKTtcbiAgfSxcblxuICBhbnl0aGluZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHBleHBycy5hbnl0aGluZztcbiAgfSxcblxuICBlbmQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBwZXhwcnMuZW5kO1xuICB9LFxuXG4gIHByaW06IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gcGV4cHJzLm1ha2VQcmltKHgpO1xuICB9LFxuXG4gIHBhcmFtOiBmdW5jdGlvbihpbmRleCkge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLlBhcmFtKGluZGV4KTtcbiAgfSxcblxuICBhbHQ6IGZ1bmN0aW9uKC8qIHRlcm0xLCB0ZXJtMSwgLi4uICovKSB7XG4gICAgdmFyIHRlcm1zID0gW107XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbaWR4XTtcbiAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBwZXhwcnMuQWx0KSB7XG4gICAgICAgIHRlcm1zID0gdGVybXMuY29uY2F0KGFyZy50ZXJtcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXJtcy5wdXNoKGFyZyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0ZXJtcy5sZW5ndGggPT09IDEgPyB0ZXJtc1swXSA6IG5ldyBwZXhwcnMuQWx0KHRlcm1zKTtcbiAgfSxcblxuICBzZXE6IGZ1bmN0aW9uKC8qIGZhY3RvcjEsIGZhY3RvcjIsIC4uLiAqLykge1xuICAgIHZhciBmYWN0b3JzID0gW107XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbaWR4XTtcbiAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBwZXhwcnMuU2VxKSB7XG4gICAgICAgIGZhY3RvcnMgPSBmYWN0b3JzLmNvbmNhdChhcmcuZmFjdG9ycyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmYWN0b3JzLnB1c2goYXJnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhY3RvcnMubGVuZ3RoID09PSAxID8gZmFjdG9yc1swXSA6IG5ldyBwZXhwcnMuU2VxKGZhY3RvcnMpO1xuICB9LFxuXG4gIHN0YXI6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICByZXR1cm4gbmV3IHBleHBycy5TdGFyKGV4cHIpO1xuICB9LFxuXG4gIHBsdXM6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICByZXR1cm4gbmV3IHBleHBycy5QbHVzKGV4cHIpO1xuICB9LFxuXG4gIG9wdDogZnVuY3Rpb24oZXhwcikge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLk9wdChleHByKTtcbiAgfSxcblxuICBub3Q6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICByZXR1cm4gbmV3IHBleHBycy5Ob3QoZXhwcik7XG4gIH0sXG5cbiAgbGE6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICByZXR1cm4gbmV3IHBleHBycy5Mb29rYWhlYWQoZXhwcik7XG4gIH0sXG5cbiAgYXJyOiBmdW5jdGlvbihleHByKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuQXJyKGV4cHIpO1xuICB9LFxuXG4gIHN0cjogZnVuY3Rpb24oZXhwcikge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLlN0cihleHByKTtcbiAgfSxcblxuICBvYmo6IGZ1bmN0aW9uKHByb3BlcnRpZXMsIGlzTGVuaWVudCkge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLk9iaihwcm9wZXJ0aWVzLCAhIWlzTGVuaWVudCk7XG4gIH0sXG5cbiAgYXBwOiBmdW5jdGlvbihydWxlTmFtZSwgb3B0UGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuQXBwbHkocnVsZU5hbWUsIG9wdFBhcmFtcyk7XG4gIH1cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1aWxkZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgSW5wdXRTdHJlYW0gPSByZXF1aXJlKCcuL0lucHV0U3RyZWFtJyk7XG52YXIgSW50ZXJ2YWwgPSByZXF1aXJlKCcuL0ludGVydmFsJyk7XG52YXIgTWF0Y2hSZXN1bHQgPSByZXF1aXJlKCcuL01hdGNoUmVzdWx0Jyk7XG52YXIgU2VtYW50aWNzID0gcmVxdWlyZSgnLi9TZW1hbnRpY3MnKTtcbnZhciBTdGF0ZSA9IHJlcXVpcmUoJy4vU3RhdGUnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgbm9kZXMgPSByZXF1aXJlKCcuL25vZGVzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIEdyYW1tYXIobmFtZSwgc3VwZXJHcmFtbWFyLCBydWxlRGljdCwgb3B0RGVmYXVsdFN0YXJ0UnVsZSkge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbiAgdGhpcy5ydWxlRGljdCA9IHJ1bGVEaWN0O1xuICBpZiAob3B0RGVmYXVsdFN0YXJ0UnVsZSkge1xuICAgIGlmICghKG9wdERlZmF1bHRTdGFydFJ1bGUgaW4gcnVsZURpY3QpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHN0YXJ0IHJ1bGU6ICdcIiArIG9wdERlZmF1bHRTdGFydFJ1bGUgK1xuICAgICAgICAgICAgICAgICAgICAgIFwiJyBpcyBub3QgYSBydWxlIGluIGdyYW1tYXIgJ1wiICsgbmFtZSArIFwiJ1wiKTtcbiAgICB9XG4gICAgdGhpcy5kZWZhdWx0U3RhcnRSdWxlID0gb3B0RGVmYXVsdFN0YXJ0UnVsZTtcbiAgfVxuICB0aGlzLmNvbnN0cnVjdG9ycyA9IHRoaXMuY3RvcnMgPSB0aGlzLmNyZWF0ZUNvbnN0cnVjdG9ycygpO1xufVxuXG5HcmFtbWFyLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0OiBmdW5jdGlvbihydWxlTmFtZSwgY2hpbGRyZW4pIHtcbiAgICB2YXIgYm9keSA9IHRoaXMucnVsZURpY3RbcnVsZU5hbWVdO1xuICAgIGlmICghYm9keSB8fCAhYm9keS5jaGVjayh0aGlzLCBjaGlsZHJlbikgfHwgY2hpbGRyZW4ubGVuZ3RoICE9PSBib2R5LmdldEFyaXR5KCkpIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuSW52YWxpZENvbnN0cnVjdG9yQ2FsbCh0aGlzLCBydWxlTmFtZSwgY2hpbGRyZW4pO1xuICAgIH1cbiAgICB2YXIgaW50ZXJ2YWwgPSBuZXcgSW50ZXJ2YWwoSW5wdXRTdHJlYW0ubmV3Rm9yKGNoaWxkcmVuKSwgMCwgY2hpbGRyZW4ubGVuZ3RoKTtcbiAgICByZXR1cm4gbmV3IG5vZGVzLk5vZGUodGhpcywgcnVsZU5hbWUsIGNoaWxkcmVuLCBpbnRlcnZhbCk7XG4gIH0sXG5cbiAgY3JlYXRlQ29uc3RydWN0b3JzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGNvbnN0cnVjdG9ycyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gbWFrZUNvbnN0cnVjdG9yKHJ1bGVOYW1lKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oLyogdmFsMSwgdmFsMiwgLi4uICovKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmNvbnN0cnVjdChydWxlTmFtZSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZvciAodmFyIHJ1bGVOYW1lIGluIHRoaXMucnVsZURpY3QpIHtcbiAgICAgIC8vIFdlIHdhbnQgKmFsbCogcHJvcGVydGllcywgbm90IGp1c3Qgb3duIHByb3BlcnRpZXMsIGJlY2F1c2Ugb2ZcbiAgICAgIC8vIHN1cGVyZ3JhbW1hcnMuXG4gICAgICBjb25zdHJ1Y3RvcnNbcnVsZU5hbWVdID0gbWFrZUNvbnN0cnVjdG9yKHJ1bGVOYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnN0cnVjdG9ycztcbiAgfSxcblxuICAvLyBSZXR1cm4gdHJ1ZSBpZiB0aGUgZ3JhbW1hciBpcyBhIGJ1aWx0LWluIGdyYW1tYXIsIG90aGVyd2lzZSBmYWxzZS5cbiAgLy8gTk9URTogVGhpcyBtaWdodCBnaXZlIGFuIHVuZXhwZWN0ZWQgcmVzdWx0IGlmIGNhbGxlZCBiZWZvcmUgQnVpbHRJblJ1bGVzIGlzIGRlZmluZWQhXG4gIGlzQnVpbHRJbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMgPT09IEdyYW1tYXIuUHJvdG9CdWlsdEluUnVsZXMgfHwgdGhpcyA9PT0gR3JhbW1hci5CdWlsdEluUnVsZXM7XG4gIH0sXG5cbiAgbWF0Y2g6IGZ1bmN0aW9uKG9iaiwgb3B0U3RhcnRSdWxlKSB7XG4gICAgdmFyIHN0YXJ0UnVsZSA9IG9wdFN0YXJ0UnVsZSB8fCB0aGlzLmRlZmF1bHRTdGFydFJ1bGU7XG4gICAgaWYgKCFzdGFydFJ1bGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBzdGFydCBydWxlIGFyZ3VtZW50IC0tIHRoZSBncmFtbWFyIGhhcyBubyBkZWZhdWx0IHN0YXJ0IHJ1bGUuJyk7XG4gICAgfVxuICAgIHZhciBzdGF0ZSA9IHRoaXMuX21hdGNoKG9iaiwgc3RhcnRSdWxlLCBmYWxzZSk7XG4gICAgcmV0dXJuIE1hdGNoUmVzdWx0Lm5ld0ZvcihzdGF0ZSk7XG4gIH0sXG5cbiAgX21hdGNoOiBmdW5jdGlvbihvYmosIHN0YXJ0UnVsZSwgdHJhY2luZ0VuYWJsZWQpIHtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBJbnB1dFN0cmVhbS5uZXdGb3IodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycgPyBvYmogOiBbb2JqXSk7XG4gICAgdmFyIHN0YXRlID0gbmV3IFN0YXRlKHRoaXMsIGlucHV0U3RyZWFtLCBzdGFydFJ1bGUsIHRyYWNpbmdFbmFibGVkKTtcbiAgICB2YXIgc3VjY2VlZGVkID0gbmV3IHBleHBycy5BcHBseShzdGFydFJ1bGUpLmV2YWwoc3RhdGUpO1xuICAgIGlmIChzdWNjZWVkZWQpIHtcbiAgICAgIC8vIExpbmsgZXZlcnkgQ1NUTm9kZSB0byBpdHMgcGFyZW50LlxuICAgICAgdmFyIHN0YWNrID0gW3VuZGVmaW5lZF07XG4gICAgICB2YXIgaGVscGVycyA9IHRoaXMuc2VtYW50aWNzKCkuYWRkT3BlcmF0aW9uKCdzZXRQYXJlbnRzJywge1xuICAgICAgICBfdGVybWluYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMuX25vZGUucGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgIH0sXG4gICAgICAgIF9kZWZhdWx0OiBmdW5jdGlvbihjaGlsZHJlbikge1xuICAgICAgICAgIHN0YWNrLnB1c2godGhpcy5fbm9kZSk7XG4gICAgICAgICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkgeyBjaGlsZC5zZXRQYXJlbnRzKCk7IH0pO1xuICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgIHRoaXMuX25vZGUucGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaGVscGVycyhNYXRjaFJlc3VsdC5uZXdGb3Ioc3RhdGUpKS5zZXRQYXJlbnRzKCk7XG4gICAgfVxuICAgIHJldHVybiBzdGF0ZTtcbiAgfSxcblxuICB0cmFjZTogZnVuY3Rpb24ob2JqLCBvcHRTdGFydFJ1bGUpIHtcbiAgICB2YXIgc3RhcnRSdWxlID0gb3B0U3RhcnRSdWxlIHx8IHRoaXMuZGVmYXVsdFN0YXJ0UnVsZTtcbiAgICBpZiAoIXN0YXJ0UnVsZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHN0YXJ0IHJ1bGUgYXJndW1lbnQgLS0gdGhlIGdyYW1tYXIgaGFzIG5vIGRlZmF1bHQgc3RhcnQgcnVsZS4nKTtcbiAgICB9XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fbWF0Y2gob2JqLCBzdGFydFJ1bGUsIHRydWUpO1xuXG4gICAgdmFyIHJvb3RUcmFjZSA9IHN0YXRlLnRyYWNlWzBdO1xuICAgIHJvb3RUcmFjZS5zdGF0ZSA9IHN0YXRlO1xuICAgIHJvb3RUcmFjZS5yZXN1bHQgPSBNYXRjaFJlc3VsdC5uZXdGb3Ioc3RhdGUpO1xuICAgIHJldHVybiByb290VHJhY2U7XG4gIH0sXG5cbiAgc2VtYW50aWNzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gU2VtYW50aWNzLmNyZWF0ZVNlbWFudGljcyh0aGlzKTtcbiAgfSxcblxuICBleHRlbmRTZW1hbnRpY3M6IGZ1bmN0aW9uKHN1cGVyU2VtYW50aWNzKSB7XG4gICAgcmV0dXJuIFNlbWFudGljcy5jcmVhdGVTZW1hbnRpY3ModGhpcywgc3VwZXJTZW1hbnRpY3MuX2dldFNlbWFudGljcygpKTtcbiAgfSxcblxuICAvLyBDaGVjayB0aGF0IGV2ZXJ5IGtleSBpbiBgYWN0aW9uRGljdGAgY29ycmVzcG9uZHMgdG8gYSBzZW1hbnRpYyBhY3Rpb24sIGFuZCB0aGF0IGl0IG1hcHMgdG9cbiAgLy8gYSBmdW5jdGlvbiBvZiB0aGUgY29ycmVjdCBhcml0eS4gSWYgbm90LCB0aHJvdyBhbiBleGNlcHRpb24uXG4gIF9jaGVja1RvcERvd25BY3Rpb25EaWN0OiBmdW5jdGlvbih3aGF0LCBuYW1lLCBhY3Rpb25EaWN0KSB7XG4gICAgZnVuY3Rpb24gaXNTcGVjaWFsQWN0aW9uKG5hbWUpIHtcbiAgICAgIHJldHVybiBuYW1lID09PSAnX3Rlcm1pbmFsJyB8fCBuYW1lID09PSAnX2RlZmF1bHQnO1xuICAgIH1cblxuICAgIHZhciBwcm9ibGVtcyA9IFtdO1xuICAgIGZvciAodmFyIGsgaW4gYWN0aW9uRGljdCkge1xuICAgICAgdmFyIHYgPSBhY3Rpb25EaWN0W2tdO1xuICAgICAgaWYgKCFpc1NwZWNpYWxBY3Rpb24oaykgJiYgIShrIGluIHRoaXMucnVsZURpY3QpKSB7XG4gICAgICAgIHByb2JsZW1zLnB1c2goXCInXCIgKyBrICsgXCInIGlzIG5vdCBhIHZhbGlkIHNlbWFudGljIGFjdGlvbiBmb3IgJ1wiICsgdGhpcy5uYW1lICsgXCInXCIpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwcm9ibGVtcy5wdXNoKFxuICAgICAgICAgICAgXCInXCIgKyBrICsgXCInIG11c3QgYmUgYSBmdW5jdGlvbiBpbiBhbiBhY3Rpb24gZGljdGlvbmFyeSBmb3IgJ1wiICsgdGhpcy5uYW1lICsgXCInXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGFjdHVhbCA9IHYubGVuZ3RoO1xuICAgICAgICB2YXIgZXhwZWN0ZWQgPSB0aGlzLl90b3BEb3duQWN0aW9uQXJpdHkoayk7XG4gICAgICAgIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKSB7XG4gICAgICAgICAgcHJvYmxlbXMucHVzaChcbiAgICAgICAgICAgICAgXCJTZW1hbnRpYyBhY3Rpb24gJ1wiICsgayArIFwiJyBoYXMgdGhlIHdyb25nIGFyaXR5OiBcIiArXG4gICAgICAgICAgICAgICdleHBlY3RlZCAnICsgZXhwZWN0ZWQgKyAnLCBnb3QgJyArIGFjdHVhbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByb2JsZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBwcmV0dHlQcm9ibGVtcyA9IHByb2JsZW1zLm1hcChmdW5jdGlvbihwcm9ibGVtKSB7IHJldHVybiAnLSAnICsgcHJvYmxlbTsgfSk7XG4gICAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICAgXCJGb3VuZCBlcnJvcnMgaW4gdGhlIGFjdGlvbiBkaWN0aW9uYXJ5IG9mIHRoZSAnXCIgKyBuYW1lICsgXCInIFwiICsgd2hhdCArICc6XFxuJyArXG4gICAgICAgICAgcHJldHR5UHJvYmxlbXMuam9pbignXFxuJykpO1xuICAgICAgZXJyb3IucHJvYmxlbXMgPSBwcm9ibGVtcztcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSxcblxuICAvLyBSZXR1cm4gdGhlIGV4cGVjdGVkIGFyaXR5IGZvciBhIHNlbWFudGljIGFjdGlvbiBuYW1lZCBgYWN0aW9uTmFtZWAsIHdoaWNoXG4gIC8vIGlzIGVpdGhlciBhIHJ1bGUgbmFtZSBvciBhIHNwZWNpYWwgYWN0aW9uIG5hbWUgbGlrZSAnX2RlZmF1bHQnLlxuICBfdG9wRG93bkFjdGlvbkFyaXR5OiBmdW5jdGlvbihhY3Rpb25OYW1lKSB7XG4gICAgaWYgKGFjdGlvbk5hbWUgPT09ICdfZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSBpZiAoYWN0aW9uTmFtZSA9PT0gJ190ZXJtaW5hbCcpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5ydWxlRGljdFthY3Rpb25OYW1lXS5nZXRBcml0eSgpO1xuICB9LFxuXG4gIF9pbmhlcml0c0Zyb206IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgICB2YXIgZyA9IHRoaXMuc3VwZXJHcmFtbWFyO1xuICAgIHdoaWxlIChnKSB7XG4gICAgICBpZiAoZyA9PT0gZ3JhbW1hcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGcgPSBnLnN1cGVyR3JhbW1hcjtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIHRvUmVjaXBlOiBmdW5jdGlvbihvcHRWYXJOYW1lKSB7XG4gICAgaWYgKHRoaXMuaXNCdWlsdEluKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnV2h5IHdvdWxkIGFueW9uZSB3YW50IHRvIGdlbmVyYXRlIGEgcmVjaXBlIGZvciB0aGUgJyArIHRoaXMubmFtZSArICcgZ3JhbW1hcj8hPyEnKTtcbiAgICB9XG5cbiAgICB2YXIgc2IgPSBuZXcgY29tbW9uLlN0cmluZ0J1ZmZlcigpO1xuICAgIGlmIChvcHRWYXJOYW1lKSB7XG4gICAgICBzYi5hcHBlbmQoJ3ZhciAnICsgb3B0VmFyTmFtZSArICcgPSAnKTtcbiAgICB9XG4gICAgc2IuYXBwZW5kKCcoZnVuY3Rpb24oKSB7XFxuJyk7XG5cbiAgICAvLyBJbmNsdWRlIHRoZSBzdXBlcmdyYW1tYXIgaW4gdGhlIHJlY2lwZSBpZiBpdCdzIG5vdCBhIGJ1aWx0LWluIGdyYW1tYXIuXG4gICAgdmFyIHN1cGVyR3JhbW1hckRlY2wgPSAnJztcbiAgICBpZiAoIXRoaXMuc3VwZXJHcmFtbWFyLmlzQnVpbHRJbigpKSB7XG4gICAgICBzYi5hcHBlbmQodGhpcy5zdXBlckdyYW1tYXIudG9SZWNpcGUoJ2J1aWxkU3VwZXJHcmFtbWFyJykpO1xuICAgICAgc3VwZXJHcmFtbWFyRGVjbCA9ICcgICAgLndpdGhTdXBlckdyYW1tYXIoYnVpbGRTdXBlckdyYW1tYXIuY2FsbCh0aGlzKSlcXG4nO1xuICAgIH1cbiAgICBzYi5hcHBlbmQoJyAgcmV0dXJuIG5ldyB0aGlzLm5ld0dyYW1tYXIoJyArIGNvbW1vbi50b1N0cmluZ0xpdGVyYWwodGhpcy5uYW1lKSArICcpXFxuJyk7XG4gICAgc2IuYXBwZW5kKHN1cGVyR3JhbW1hckRlY2wpO1xuXG4gICAgaWYgKHRoaXMuZGVmYXVsdFN0YXJ0UnVsZSkge1xuICAgICAgc2IuYXBwZW5kKFwiICAgIC53aXRoRGVmYXVsdFN0YXJ0UnVsZSgnXCIgKyB0aGlzLmRlZmF1bHRTdGFydFJ1bGUgKyBcIicpXFxuXCIpO1xuICAgIH1cblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBPYmplY3Qua2V5cyh0aGlzLnJ1bGVEaWN0KS5mb3JFYWNoKGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgICB2YXIgYm9keSA9IHNlbGYucnVsZURpY3RbcnVsZU5hbWVdO1xuICAgICAgc2IuYXBwZW5kKCcgICAgLicpO1xuICAgICAgaWYgKHNlbGYuc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W3J1bGVOYW1lXSkge1xuICAgICAgICBzYi5hcHBlbmQoYm9keSBpbnN0YW5jZW9mIHBleHBycy5FeHRlbmQgPyAnZXh0ZW5kJyA6ICdvdmVycmlkZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2IuYXBwZW5kKCdkZWZpbmUnKTtcbiAgICAgIH1cbiAgICAgIHZhciBmb3JtYWxzID0gJ1snICsgYm9keS5mb3JtYWxzLm1hcChjb21tb24udG9TdHJpbmdMaXRlcmFsKS5qb2luKCcsICcpICsgJ10nO1xuICAgICAgc2IuYXBwZW5kKCcoJyArIGNvbW1vbi50b1N0cmluZ0xpdGVyYWwocnVsZU5hbWUpICsgJywgJyArIGZvcm1hbHMgKyAnLCAnKTtcbiAgICAgIGJvZHkub3V0cHV0UmVjaXBlKHNiLCBib2R5LmZvcm1hbHMpO1xuICAgICAgaWYgKGJvZHkuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgc2IuYXBwZW5kKCcsICcgKyBjb21tb24udG9TdHJpbmdMaXRlcmFsKGJvZHkuZGVzY3JpcHRpb24pKTtcbiAgICAgIH1cbiAgICAgIHNiLmFwcGVuZCgnKVxcbicpO1xuICAgIH0pO1xuICAgIHNiLmFwcGVuZCgnICAgIC5idWlsZCgpO1xcbn0pO1xcbicpO1xuICAgIHJldHVybiBzYi5jb250ZW50cygpO1xuICB9LFxuXG4gIC8vIFRPRE86IENvbWUgdXAgd2l0aCBiZXR0ZXIgbmFtZXMgZm9yIHRoZXNlIG1ldGhvZHMuXG4gIC8vIFRPRE86IFdyaXRlIHRoZSBhbmFsb2cgb2YgdGhlc2UgbWV0aG9kcyBmb3IgaW5oZXJpdGVkIGF0dHJpYnV0ZXMuXG4gIHRvT3BlcmF0aW9uQWN0aW9uRGljdGlvbmFyeVRlbXBsYXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fdG9PcGVyYXRpb25PckF0dHJpYnV0ZUFjdGlvbkRpY3Rpb25hcnlUZW1wbGF0ZSgpO1xuICB9LFxuICB0b0F0dHJpYnV0ZUFjdGlvbkRpY3Rpb25hcnlUZW1wbGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RvT3BlcmF0aW9uT3JBdHRyaWJ1dGVBY3Rpb25EaWN0aW9uYXJ5VGVtcGxhdGUoKTtcbiAgfSxcblxuICBfdG9PcGVyYXRpb25PckF0dHJpYnV0ZUFjdGlvbkRpY3Rpb25hcnlUZW1wbGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgLy8gVE9ETzogYWRkIHRoZSBzdXBlci1ncmFtbWFyJ3MgdGVtcGxhdGVzIGF0IHRoZSByaWdodCBwbGFjZSwgZS5nLiwgYSBjYXNlIGZvciBBZGRFeHByX3BsdXNcbiAgICAvLyBzaG91bGQgYXBwZWFyIG5leHQgdG8gb3RoZXIgY2FzZXMgb2YgQWRkRXhwci5cblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgc2IgPSBuZXcgY29tbW9uLlN0cmluZ0J1ZmZlcigpO1xuICAgIHNiLmFwcGVuZCgneycpO1xuXG4gICAgdmFyIGZpcnN0ID0gdHJ1ZTtcbiAgICBmb3IgKHZhciBydWxlTmFtZSBpbiB0aGlzLnJ1bGVEaWN0KSB7XG4gICAgICBpZiAocnVsZU5hbWUgPT09ICdzcGFjZXNfJykge1xuICAgICAgICAvLyBUaGlzIHJ1bGUgaXMgbm90IGZvciB0aGUgdXNlciwgaXQncyBtb3JlIG9mIGFuIGltcGxlbWVudGF0aW9uIGRldGFpbCBvZiBzeW50YWN0aWMgcnVsZXMuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgdmFyIGJvZHkgPSB0aGlzLnJ1bGVEaWN0W3J1bGVOYW1lXTtcbiAgICAgIGlmIChmaXJzdCkge1xuICAgICAgICBmaXJzdCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2IuYXBwZW5kKCcsJyk7XG4gICAgICB9XG4gICAgICBzYi5hcHBlbmQoJ1xcbicpO1xuICAgICAgc2IuYXBwZW5kKCcgICcpO1xuICAgICAgdGhpcy5hZGRTZW1hbnRpY0FjdGlvblRlbXBsYXRlKHJ1bGVOYW1lLCBib2R5LCBzYik7XG4gICAgfVxuXG4gICAgc2IuYXBwZW5kKCdcXG59Jyk7XG4gICAgcmV0dXJuIHNiLmNvbnRlbnRzKCk7XG4gIH0sXG5cbiAgYWRkU2VtYW50aWNBY3Rpb25UZW1wbGF0ZTogZnVuY3Rpb24ocnVsZU5hbWUsIGJvZHksIHNiKSB7XG4gICAgc2IuYXBwZW5kKHJ1bGVOYW1lKTtcbiAgICBzYi5hcHBlbmQoJzogZnVuY3Rpb24oJyk7XG4gICAgdmFyIGFyaXR5ID0gdGhpcy5fdG9wRG93bkFjdGlvbkFyaXR5KHJ1bGVOYW1lKTtcbiAgICBzYi5hcHBlbmQoY29tbW9uLnJlcGVhdCgnXycsIGFyaXR5KS5qb2luKCcsICcpKTtcbiAgICBzYi5hcHBlbmQoJykge1xcbicpO1xuICAgIHNiLmFwcGVuZCgnICB9Jyk7XG4gIH1cbn07XG5cbi8vIFRoZSBmb2xsb3dpbmcgZ3JhbW1hciBjb250YWlucyBhIGZldyBydWxlcyB0aGF0IGNvdWxkbid0IGJlIHdyaXR0ZW4gIGluIFwidXNlcmxhbmRcIi5cbi8vIEF0IHRoZSBib3R0b20gb2Ygc3JjL21haW4uanMsIHdlIGNyZWF0ZSBhIHN1Yi1ncmFtbWFyIG9mIHRoaXMgZ3JhbW1hciB0aGF0J3MgY2FsbGVkXG4vLyBgQnVpbHRJblJ1bGVzYC4gVGhhdCBncmFtbWFyIGNvbnRhaW5zIHNldmVyYWwgY29udmVuaWVuY2UgcnVsZXMsIGUuZy4sIGBsZXR0ZXJgIGFuZFxuLy8gYGRpZ2l0YCwgYW5kIGlzIGltcGxpY2l0bHkgdGhlIHN1cGVyLWdyYW1tYXIgb2YgYW55IGdyYW1tYXIgd2hvc2Ugc3VwZXItZ3JhbW1hclxuLy8gaXNuJ3Qgc3BlY2lmaWVkLlxuR3JhbW1hci5Qcm90b0J1aWx0SW5SdWxlcyA9IG5ldyBHcmFtbWFyKCdQcm90b0J1aWx0SW5SdWxlcycsIHVuZGVmaW5lZCwge1xuICAvLyBUaGUgZm9sbG93aW5nIHJ1bGVzIGNhbid0IGJlIHdyaXR0ZW4gaW4gdXNlcmxhbmQgYmVjYXVzZSB0aGV5IHJlZmVyZW5jZVxuICAvLyBgYW55dGhpbmdgIGFuZCBgZW5kYCBkaXJlY3RseS5cbiAgXzogcGV4cHJzLmFueXRoaW5nLndpdGhGb3JtYWxzKFtdKSxcbiAgZW5kOiBwZXhwcnMuZW5kLndpdGhGb3JtYWxzKFtdKSxcblxuICAvLyBUaGUgZm9sbG93aW5nIHJ1bGUgaXMgcGFydCBvZiB0aGUgT2htIGltcGxlbWVudGF0aW9uLiBJdHMgbmFtZSBlbmRzIHdpdGggJ18nIHRvXG4gIC8vIGRpc2NvdXJhZ2UgcHJvZ3JhbW1lcnMgZnJvbSBpbnZva2luZywgZXh0ZW5kaW5nLCBhbmQgb3ZlcnJpZGluZyBpdC5cbiAgc3BhY2VzXzogbmV3IHBleHBycy5TdGFyKG5ldyBwZXhwcnMuQXBwbHkoJ3NwYWNlJykpLndpdGhGb3JtYWxzKFtdKSxcblxuICAvLyBUaGUgYHNwYWNlYCBydWxlIG11c3QgYmUgZGVmaW5lZCBoZXJlIGJlY2F1c2UgaXQncyByZWZlcmVuY2VkIGJ5IGBzcGFjZXNfYC5cbiAgc3BhY2U6IHBleHBycy5tYWtlUHJpbSgvW1xcc10vKS53aXRoRm9ybWFscyhbXSkud2l0aERlc2NyaXB0aW9uKCdhIHNwYWNlJylcbn0pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBHcmFtbWFyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIEdyYW1tYXIgPSByZXF1aXJlKCcuL0dyYW1tYXInKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgU3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIENvbnN0cnVjdG9yc1xuXG5mdW5jdGlvbiBHcmFtbWFyRGVjbChuYW1lKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG59XG5cbi8vIEhlbHBlcnNcblxuZnVuY3Rpb24gb25PaG1FcnJvcihkb0ZuLCBvbkVycm9yRm4pIHtcbiAgdHJ5IHtcbiAgICBkb0ZuKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoZSBpbnN0YW5jZW9mIGVycm9ycy5FcnJvcikge1xuICAgICAgb25FcnJvckZuKGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfVxufVxuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuZW5zdXJlU3VwZXJHcmFtbWFyID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5zdXBlckdyYW1tYXIpIHtcbiAgICB0aGlzLndpdGhTdXBlckdyYW1tYXIoXG4gICAgICAgIC8vIFRPRE86IFRoZSBjb25kaXRpb25hbCBleHByZXNzaW9uIGJlbG93IGlzIGFuIHVnbHkgaGFjay4gSXQncyBraW5kIG9mIG9rIGJlY2F1c2VcbiAgICAgICAgLy8gSSBkb3VidCBhbnlvbmUgd2lsbCBldmVyIHRyeSB0byBkZWNsYXJlIGEgZ3JhbW1hciBjYWxsZWQgYEJ1aWx0SW5SdWxlc2AuIFN0aWxsLFxuICAgICAgICAvLyB3ZSBzaG91bGQgdHJ5IHRvIGZpbmQgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXMuXG4gICAgICAgIHRoaXMubmFtZSA9PT0gJ0J1aWx0SW5SdWxlcycgP1xuICAgICAgICAgICAgR3JhbW1hci5Qcm90b0J1aWx0SW5SdWxlcyA6XG4gICAgICAgICAgICBHcmFtbWFyLkJ1aWx0SW5SdWxlcyk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuc3VwZXJHcmFtbWFyO1xufTtcblxuR3JhbW1hckRlY2wucHJvdG90eXBlLmluc3RhbGxPdmVycmlkZGVuT3JFeHRlbmRlZFJ1bGUgPSBmdW5jdGlvbihuYW1lLCBmb3JtYWxzLCBib2R5KSB7XG4gIHZhciBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyA9IGNvbW1vbi5nZXREdXBsaWNhdGVzKGZvcm1hbHMpO1xuICBpZiAoZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuRHVwbGljYXRlUGFyYW1ldGVyTmFtZXMobmFtZSwgZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMpO1xuICB9XG4gIHZhciBiYXNlUnVsZSA9IHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyKCkucnVsZURpY3RbbmFtZV07XG4gIGlmIChmb3JtYWxzLmxlbmd0aCAhPT0gYmFzZVJ1bGUuZm9ybWFscy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLldyb25nTnVtYmVyT2ZQYXJhbWV0ZXJzKG5hbWUsIGJhc2VSdWxlLmZvcm1hbHMubGVuZ3RoLCBmb3JtYWxzLmxlbmd0aCk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuaW5zdGFsbChuYW1lLCBmb3JtYWxzLCBiYXNlUnVsZS5kZXNjcmlwdGlvbiwgYm9keSk7XG59O1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuaW5zdGFsbCA9IGZ1bmN0aW9uKG5hbWUsIGZvcm1hbHMsIGRlc2NyaXB0aW9uLCBib2R5KSB7XG4gIGJvZHkgPSBib2R5LmludHJvZHVjZVBhcmFtcyhmb3JtYWxzKTtcbiAgYm9keS5mb3JtYWxzID0gZm9ybWFscztcbiAgYm9keS5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICB0aGlzLnJ1bGVEaWN0W25hbWVdID0gYm9keTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBTdHVmZiB0aGF0IHlvdSBzaG91bGQgb25seSBkbyBvbmNlXG5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS53aXRoU3VwZXJHcmFtbWFyID0gZnVuY3Rpb24oc3VwZXJHcmFtbWFyKSB7XG4gIGlmICh0aGlzLnN1cGVyR3JhbW1hcikge1xuICAgIHRocm93IG5ldyBFcnJvcigndGhlIHN1cGVyIGdyYW1tYXIgb2YgYSBHcmFtbWFyRGVjbCBjYW5ub3QgYmUgc2V0IG1vcmUgdGhhbiBvbmNlJyk7XG4gIH1cbiAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXI7XG4gIHRoaXMucnVsZURpY3QgPSBPYmplY3QuY3JlYXRlKHN1cGVyR3JhbW1hci5ydWxlRGljdCk7XG5cbiAgLy8gR3JhbW1hcnMgd2l0aCBhbiBleHBsaWNpdCBzdXBlcmdyYW1tYXIgaW5oZXJpdCBhIGRlZmF1bHQgc3RhcnQgcnVsZS5cbiAgaWYgKCFzdXBlckdyYW1tYXIuaXNCdWlsdEluKCkpIHtcbiAgICB0aGlzLmRlZmF1bHRTdGFydFJ1bGUgPSBzdXBlckdyYW1tYXIuZGVmYXVsdFN0YXJ0UnVsZTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS53aXRoRGVmYXVsdFN0YXJ0UnVsZSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZGVmYXVsdFN0YXJ0UnVsZSA9IHJ1bGVOYW1lO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIENyZWF0ZXMgYSBHcmFtbWFyIGluc3RhbmNlLCBhbmQgaWYgaXQgcGFzc2VzIHRoZSBzYW5pdHkgY2hlY2tzLCByZXR1cm5zIGl0LlxuR3JhbW1hckRlY2wucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBncmFtbWFyID1cbiAgICAgIG5ldyBHcmFtbWFyKHRoaXMubmFtZSwgdGhpcy5lbnN1cmVTdXBlckdyYW1tYXIoKSwgdGhpcy5ydWxlRGljdCwgdGhpcy5kZWZhdWx0U3RhcnRSdWxlKTtcbiAgLy8gVE9ETzogY2hhbmdlIHRoZSBwZXhwci5wcm90b3R5cGUuYXNzZXJ0Li4uIG1ldGhvZHMgdG8gbWFrZSB0aGVtIGFkZFxuICAvLyBleGNlcHRpb25zIHRvIGFuIGFycmF5IHRoYXQncyBwcm92aWRlZCBhcyBhbiBhcmcuIFRoZW4gd2UnbGwgYmUgYWJsZSB0b1xuICAvLyBzaG93IG1vcmUgdGhhbiBvbmUgZXJyb3Igb2YgdGhlIHNhbWUgdHlwZSBhdCBhIHRpbWUuXG4gIC8vIFRPRE86IGluY2x1ZGUgdGhlIG9mZmVuZGluZyBwZXhwciBpbiB0aGUgZXJyb3JzLCB0aGF0IHdheSB3ZSBjYW4gc2hvd1xuICAvLyB0aGUgcGFydCBvZiB0aGUgc291cmNlIHRoYXQgY2F1c2VkIGl0LlxuICB2YXIgZ3JhbW1hckVycm9ycyA9IFtdO1xuICB2YXIgZ3JhbW1hckhhc0ludmFsaWRBcHBsaWNhdGlvbnMgPSBmYWxzZTtcbiAgT2JqZWN0LmtleXMoZ3JhbW1hci5ydWxlRGljdCkuZm9yRWFjaChmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHZhciBib2R5ID0gZ3JhbW1hci5ydWxlRGljdFtydWxlTmFtZV07XG4gICAgb25PaG1FcnJvcihcbiAgICAgICAgZnVuY3Rpb24oKSB7IGJvZHkuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpOyB9LFxuICAgICAgICBmdW5jdGlvbihlKSB7IGdyYW1tYXJFcnJvcnMucHVzaChlKTsgfSk7XG4gICAgb25PaG1FcnJvcihcbiAgICAgICAgZnVuY3Rpb24oKSB7IGJvZHkuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQoZ3JhbW1hcik7IH0sXG4gICAgICAgIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBncmFtbWFyRXJyb3JzLnB1c2goZSk7XG4gICAgICAgICAgZ3JhbW1hckhhc0ludmFsaWRBcHBsaWNhdGlvbnMgPSB0cnVlO1xuICAgICAgICB9KTtcbiAgfSk7XG4gIGlmICghZ3JhbW1hckhhc0ludmFsaWRBcHBsaWNhdGlvbnMpIHtcbiAgICAvLyBUaGUgZm9sbG93aW5nIGNoZWNrIGNhbiBvbmx5IGJlIGRvbmUgaWYgdGhlIGdyYW1tYXIgaGFzIG5vIGludmFsaWQgYXBwbGljYXRpb25zLlxuICAgIE9iamVjdC5rZXlzKGdyYW1tYXIucnVsZURpY3QpLmZvckVhY2goZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICAgIHZhciBib2R5ID0gZ3JhbW1hci5ydWxlRGljdFtydWxlTmFtZV07XG4gICAgICBvbk9obUVycm9yKFxuICAgICAgICAgIGZ1bmN0aW9uKCkgeyBib2R5LmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyLCBydWxlTmFtZSk7IH0sXG4gICAgICAgICAgZnVuY3Rpb24oZSkgeyBncmFtbWFyRXJyb3JzLnB1c2goZSk7IH0pO1xuICAgIH0pO1xuICB9XG4gIGlmIChncmFtbWFyRXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICBlcnJvcnMudGhyb3dFcnJvcnMoZ3JhbW1hckVycm9ycyk7XG4gIH1cbiAgcmV0dXJuIGdyYW1tYXI7XG59O1xuXG4vLyBSdWxlIGRlY2xhcmF0aW9uc1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuZGVmaW5lID0gZnVuY3Rpb24obmFtZSwgZm9ybWFscywgYm9keSwgb3B0RGVzY3IpIHtcbiAgdGhpcy5lbnN1cmVTdXBlckdyYW1tYXIoKTtcbiAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W25hbWVdKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5EdXBsaWNhdGVSdWxlRGVjbGFyYXRpb24obmFtZSwgdGhpcy5uYW1lLCB0aGlzLnN1cGVyR3JhbW1hci5uYW1lKTtcbiAgfSBlbHNlIGlmICh0aGlzLnJ1bGVEaWN0W25hbWVdKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5EdXBsaWNhdGVSdWxlRGVjbGFyYXRpb24obmFtZSwgdGhpcy5uYW1lLCB0aGlzLm5hbWUpO1xuICB9XG4gIHZhciBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyA9IGNvbW1vbi5nZXREdXBsaWNhdGVzKGZvcm1hbHMpO1xuICBpZiAoZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuRHVwbGljYXRlUGFyYW1ldGVyTmFtZXMobmFtZSwgZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMpO1xuICB9XG4gIHJldHVybiB0aGlzLmluc3RhbGwobmFtZSwgZm9ybWFscywgb3B0RGVzY3IsIGJvZHkpO1xufTtcblxuR3JhbW1hckRlY2wucHJvdG90eXBlLm92ZXJyaWRlID0gZnVuY3Rpb24obmFtZSwgZm9ybWFscywgYm9keSkge1xuICB2YXIgYmFzZVJ1bGUgPSB0aGlzLmVuc3VyZVN1cGVyR3JhbW1hcigpLnJ1bGVEaWN0W25hbWVdO1xuICBpZiAoIWJhc2VSdWxlKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5DYW5ub3RPdmVycmlkZVVuZGVjbGFyZWRSdWxlKG5hbWUsIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUpO1xuICB9XG4gIHRoaXMuaW5zdGFsbE92ZXJyaWRkZW5PckV4dGVuZGVkUnVsZShuYW1lLCBmb3JtYWxzLCBib2R5KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuZXh0ZW5kID0gZnVuY3Rpb24obmFtZSwgZm9ybWFscywgYm9keSkge1xuICB2YXIgYmFzZVJ1bGUgPSB0aGlzLmVuc3VyZVN1cGVyR3JhbW1hcigpLnJ1bGVEaWN0W25hbWVdO1xuICBpZiAoIWJhc2VSdWxlKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5DYW5ub3RFeHRlbmRVbmRlY2xhcmVkUnVsZShuYW1lLCB0aGlzLnN1cGVyR3JhbW1hci5uYW1lKTtcbiAgfVxuICB0aGlzLmluc3RhbGxPdmVycmlkZGVuT3JFeHRlbmRlZFJ1bGUoXG4gICAgICBuYW1lLCBmb3JtYWxzLCBuZXcgcGV4cHJzLkV4dGVuZCh0aGlzLnN1cGVyR3JhbW1hciwgbmFtZSwgYm9keSkpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdyYW1tYXJEZWNsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgSW50ZXJ2YWwgPSByZXF1aXJlKCcuL0ludGVydmFsJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBJbnB1dFN0cmVhbSgpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdJbnB1dFN0cmVhbSBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0XFwncyBhYnN0cmFjdCcpO1xufVxuXG5JbnB1dFN0cmVhbS5uZXdGb3IgPSBmdW5jdGlvbihvYmopIHtcbiAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIG5ldyBTdHJpbmdJbnB1dFN0cmVhbShvYmopO1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgIHJldHVybiBuZXcgTGlzdElucHV0U3RyZWFtKG9iaik7XG4gIH0gZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgSW5wdXRTdHJlYW0pIHtcbiAgICByZXR1cm4gb2JqO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IG1ha2UgaW5wdXQgc3RyZWFtIGZvciAnICsgb2JqKTtcbiAgfVxufTtcblxuSW5wdXRTdHJlYW0ucHJvdG90eXBlID0ge1xuICBpbml0OiBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLnBvcyA9IDA7XG4gICAgdGhpcy5wb3NJbmZvcyA9IFtdO1xuICB9LFxuXG4gIGF0RW5kOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wb3MgPT09IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgfSxcblxuICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5hdEVuZCgpKSB7XG4gICAgICByZXR1cm4gY29tbW9uLmZhaWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZVt0aGlzLnBvcysrXTtcbiAgICB9XG4gIH0sXG5cbiAgbWF0Y2hFeGFjdGx5OiBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHRoaXMubmV4dCgpID09PSB4ID8gdHJ1ZSA6IGNvbW1vbi5mYWlsO1xuICB9LFxuXG4gIHNvdXJjZVNsaWNlOiBmdW5jdGlvbihzdGFydElkeCwgZW5kSWR4KSB7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0SWR4LCBlbmRJZHgpO1xuICB9LFxuXG4gIGludGVydmFsRnJvbTogZnVuY3Rpb24oc3RhcnRJZHgpIHtcbiAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMsIHN0YXJ0SWR4LCB0aGlzLnBvcyk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIFN0cmluZ0lucHV0U3RyZWFtKHNvdXJjZSkge1xuICB0aGlzLmluaXQoc291cmNlKTtcbn1cblxuU3RyaW5nSW5wdXRTdHJlYW0ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJbnB1dFN0cmVhbS5wcm90b3R5cGUsIHtcbiAgbWF0Y2hTdHJpbmc6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24ocykge1xuICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoRXhhY3RseShzW2lkeF0pID09PSBjb21tb24uZmFpbCkge1xuICAgICAgICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9LFxuXG4gIG1hdGNoUmVnRXhwOiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgIC8vIElNUE9SVEFOVDogZSBtdXN0IGJlIGEgbm9uLWdsb2JhbCwgb25lLWNoYXJhY3RlciBleHByZXNzaW9uLCBlLmcuLCAvLi8gYW5kIC9bMC05XS9cbiAgICAgIHZhciBjID0gdGhpcy5uZXh0KCk7XG4gICAgICByZXR1cm4gYyAhPT0gY29tbW9uLmZhaWwgJiYgZS50ZXN0KGMpID8gdHJ1ZSA6IGNvbW1vbi5mYWlsO1xuICAgIH1cbiAgfVxufSk7XG5cbmZ1bmN0aW9uIExpc3RJbnB1dFN0cmVhbShzb3VyY2UpIHtcbiAgdGhpcy5pbml0KHNvdXJjZSk7XG59XG5cbkxpc3RJbnB1dFN0cmVhbS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKElucHV0U3RyZWFtLnByb3RvdHlwZSwge1xuICBtYXRjaFN0cmluZzoge1xuICAgIHZhbHVlOiBmdW5jdGlvbihzKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXRjaEV4YWN0bHkocyk7XG4gICAgfVxuICB9LFxuXG4gIG1hdGNoUmVnRXhwOiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hdGNoRXhhY3RseShlKTtcbiAgICB9XG4gIH1cbn0pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dFN0cmVhbTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gSW50ZXJ2YWwoaW5wdXRTdHJlYW0sIHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgdGhpcy5pbnB1dFN0cmVhbSA9IGlucHV0U3RyZWFtO1xuICB0aGlzLnN0YXJ0SWR4ID0gc3RhcnRJZHg7XG4gIHRoaXMuZW5kSWR4ID0gZW5kSWR4O1xufVxuXG5JbnRlcnZhbC5jb3ZlcmFnZSA9IGZ1bmN0aW9uKC8qIGludGVydmFsMSwgaW50ZXJ2YWwyLCAuLi4gKi8pIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gYXJndW1lbnRzWzBdLmlucHV0U3RyZWFtO1xuICB2YXIgc3RhcnRJZHggPSBhcmd1bWVudHNbMF0uc3RhcnRJZHg7XG4gIHZhciBlbmRJZHggPSBhcmd1bWVudHNbMF0uZW5kSWR4O1xuICBmb3IgKHZhciBpZHggPSAxOyBpZHggPCBhcmd1bWVudHMubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciBpbnRlcnZhbCA9IGFyZ3VtZW50c1tpZHhdO1xuICAgIGlmIChpbnRlcnZhbC5pbnB1dFN0cmVhbSAhPT0gaW5wdXRTdHJlYW0pIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuSW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0SWR4ID0gTWF0aC5taW4oc3RhcnRJZHgsIGFyZ3VtZW50c1tpZHhdLnN0YXJ0SWR4KTtcbiAgICAgIGVuZElkeCA9IE1hdGgubWF4KGVuZElkeCwgYXJndW1lbnRzW2lkeF0uZW5kSWR4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5ldyBJbnRlcnZhbChpbnB1dFN0cmVhbSwgc3RhcnRJZHgsIGVuZElkeCk7XG59O1xuXG5JbnRlcnZhbC5wcm90b3R5cGUgPSB7XG4gIGNvdmVyYWdlV2l0aDogZnVuY3Rpb24oLyogaW50ZXJ2YWwxLCBpbnRlcnZhbDIsIC4uLiAqLykge1xuICAgIHZhciBpbnRlcnZhbHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIGludGVydmFscy5wdXNoKHRoaXMpO1xuICAgIHJldHVybiBJbnRlcnZhbC5jb3ZlcmFnZS5hcHBseSh1bmRlZmluZWQsIGludGVydmFscyk7XG4gIH0sXG5cbiAgY29sbGFwc2VkTGVmdDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLmlucHV0U3RyZWFtLCB0aGlzLnN0YXJ0SWR4LCB0aGlzLnN0YXJ0SWR4KTtcbiAgfSxcblxuICBjb2xsYXBzZWRSaWdodDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLmlucHV0U3RyZWFtLCB0aGlzLmVuZElkeCwgdGhpcy5lbmRJZHgpO1xuICB9LFxuXG4gIGdldExpbmVBbmRDb2x1bW5NZXNzYWdlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdXRpbC5nZXRMaW5lQW5kQ29sdW1uTWVzc2FnZSh0aGlzLmlucHV0U3RyZWFtLnNvdXJjZSwgdGhpcy5zdGFydElkeCk7XG4gIH0sXG5cbiAgLy8gUmV0dXJucyBhIG5ldyBJbnRlcnZhbCB3aGljaCBjb250YWlucyB0aGUgc2FtZSBjb250ZW50cyBhcyB0aGlzIG9uZSxcbiAgLy8gYnV0IHdpdGggd2hpdGVzcGFjZSB0cmltbWVkIGZyb20gYm90aCBlbmRzLiAoVGhpcyBvbmx5IG1ha2VzIHNlbnNlIHdoZW5cbiAgLy8gdGhlIGlucHV0IHN0cmVhbSBpcyBhIHN0cmluZy4pXG4gIHRyaW1tZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250ZW50cyA9IHRoaXMuY29udGVudHM7XG4gICAgdmFyIHN0YXJ0SWR4ID0gdGhpcy5zdGFydElkeCArIGNvbnRlbnRzLm1hdGNoKC9eXFxzKi8pWzBdLmxlbmd0aDtcbiAgICB2YXIgZW5kSWR4ID0gdGhpcy5lbmRJZHggLSBjb250ZW50cy5tYXRjaCgvXFxzKiQvKVswXS5sZW5ndGg7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLmlucHV0U3RyZWFtLCBzdGFydElkeCwgZW5kSWR4KTtcbiAgfVxufTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoSW50ZXJ2YWwucHJvdG90eXBlLCB7XG4gIGNvbnRlbnRzOiB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9jb250ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2NvbnRlbnRzID0gdGhpcy5pbnB1dFN0cmVhbS5zb3VyY2VTbGljZSh0aGlzLnN0YXJ0SWR4LCB0aGlzLmVuZElkeCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fY29udGVudHM7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlXG4gIH1cbn0pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcnZhbDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gQ3JlYXRlIGEgc2hvcnQgZXJyb3IgbWVzc2FnZSBmb3IgYW4gZXJyb3IgdGhhdCBvY2N1cnJlZCBkdXJpbmcgbWF0Y2hpbmcuXG5mdW5jdGlvbiBnZXRTaG9ydE1hdGNoRXJyb3JNZXNzYWdlKHBvcywgc291cmNlLCBkZXRhaWwpIHtcbiAgdmFyIGVycm9ySW5mbyA9IHV0aWwuZ2V0TGluZUFuZENvbHVtbihzb3VyY2UsIHBvcyk7XG4gIHJldHVybiAnTGluZSAnICsgZXJyb3JJbmZvLmxpbmVOdW0gKyAnLCBjb2wgJyArIGVycm9ySW5mby5jb2xOdW0gKyAnOiAnICsgZGV0YWlsO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBNYXRjaEZhaWx1cmUgLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gTWF0Y2hSZXN1bHQoc3RhdGUpIHtcbiAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICB0aGlzLl9jc3QgPSBzdGF0ZS5iaW5kaW5nc1swXTtcbn1cblxuTWF0Y2hSZXN1bHQubmV3Rm9yID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIHN1Y2NlZWRlZCA9IHN0YXRlLmJpbmRpbmdzLmxlbmd0aCA9PT0gMTtcbiAgcmV0dXJuIHN1Y2NlZWRlZCA/IG5ldyBNYXRjaFJlc3VsdChzdGF0ZSkgOiBuZXcgTWF0Y2hGYWlsdXJlKHN0YXRlKTtcbn07XG5cbk1hdGNoUmVzdWx0LnByb3RvdHlwZS5mYWlsZWQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuTWF0Y2hSZXN1bHQucHJvdG90eXBlLnN1Y2NlZWRlZCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIXRoaXMuZmFpbGVkKCk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBNYXRjaEZhaWx1cmUgLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gTWF0Y2hGYWlsdXJlKHN0YXRlKSB7XG4gIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgY29tbW9uLmRlZmluZUxhenlQcm9wZXJ0eSh0aGlzLCAnX2V4cHJzQW5kU3RhY2tzJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuZ2V0RmFpbHVyZXMoKTtcbiAgfSk7XG4gIGNvbW1vbi5kZWZpbmVMYXp5UHJvcGVydHkodGhpcywgJ21lc3NhZ2UnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgc291cmNlID0gdGhpcy5zdGF0ZS5pbnB1dFN0cmVhbS5zb3VyY2U7XG4gICAgaWYgKHR5cGVvZiBzb3VyY2UgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gJ21hdGNoIGZhaWxlZCBhdCBwb3NpdGlvbiAnICsgdGhpcy5nZXRQb3MoKTtcbiAgICB9XG5cbiAgICB2YXIgZGV0YWlsID0gJ0V4cGVjdGVkICcgKyB0aGlzLmdldEV4cGVjdGVkVGV4dCgpO1xuICAgIHJldHVybiB1dGlsLmdldExpbmVBbmRDb2x1bW5NZXNzYWdlKHNvdXJjZSwgdGhpcy5nZXRQb3MoKSkgKyBkZXRhaWw7XG4gIH0pO1xuICBjb21tb24uZGVmaW5lTGF6eVByb3BlcnR5KHRoaXMsICdzaG9ydE1lc3NhZ2UnLCBmdW5jdGlvbigpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuc3RhdGUuaW5wdXRTdHJlYW0uc291cmNlICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuICdtYXRjaCBmYWlsZWQgYXQgcG9zaXRpb24gJyArIHRoaXMuZ2V0UG9zKCk7XG4gICAgfVxuICAgIHZhciBkZXRhaWwgPSAnZXhwZWN0ZWQgJyArIHRoaXMuZ2V0RXhwZWN0ZWRUZXh0KCk7XG4gICAgcmV0dXJuIGdldFNob3J0TWF0Y2hFcnJvck1lc3NhZ2UodGhpcy5nZXRQb3MoKSwgdGhpcy5zdGF0ZS5pbnB1dFN0cmVhbS5zb3VyY2UsIGRldGFpbCk7XG4gIH0pO1xufVxuaW5oZXJpdHMoTWF0Y2hGYWlsdXJlLCBNYXRjaFJlc3VsdCk7XG5cbk1hdGNoRmFpbHVyZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdbTWF0Y2hGYWlsdXJlIGF0IHBvc2l0aW9uICcgKyB0aGlzLmdldFBvcygpICsgJ10nO1xufTtcblxuTWF0Y2hGYWlsdXJlLnByb3RvdHlwZS5mYWlsZWQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5NYXRjaEZhaWx1cmUucHJvdG90eXBlLmdldFBvcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5zdGF0ZS5nZXRGYWlsdXJlc1BvcygpO1xufTtcblxuLy8gUmV0dXJuIGEgc3RyaW5nIHN1bW1hcml6aW5nIHRoZSBleHBlY3RlZCBjb250ZW50cyBvZiB0aGUgaW5wdXQgc3RyZWFtIHdoZW5cbi8vIHRoZSBtYXRjaCBmYWlsdXJlIG9jY3VycmVkLlxuTWF0Y2hGYWlsdXJlLnByb3RvdHlwZS5nZXRFeHBlY3RlZFRleHQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNiID0gbmV3IGNvbW1vbi5TdHJpbmdCdWZmZXIoKTtcbiAgdmFyIGV4cGVjdGVkID0gdGhpcy5nZXRFeHBlY3RlZCgpO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBleHBlY3RlZC5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKGlkeCA+IDApIHtcbiAgICAgIGlmIChpZHggPT09IGV4cGVjdGVkLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgc2IuYXBwZW5kKChleHBlY3RlZC5sZW5ndGggPiAyID8gJywgb3IgJyA6ICcgb3IgJykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2IuYXBwZW5kKCcsICcpO1xuICAgICAgfVxuICAgIH1cbiAgICBzYi5hcHBlbmQoZXhwZWN0ZWRbaWR4XSk7XG4gIH1cbiAgcmV0dXJuIHNiLmNvbnRlbnRzKCk7XG59O1xuXG4vLyBSZXR1cm4gYW4gQXJyYXkgb2YgdW5pcXVlIHN0cmluZ3MgcmVwcmVzZW50aW5nIHRoZSB0ZXJtaW5hbHMgb3IgcnVsZXMgdGhhdFxuLy8gd2VyZSBleHBlY3RlZCB0byBiZSBtYXRjaGVkLlxuTWF0Y2hGYWlsdXJlLnByb3RvdHlwZS5nZXRFeHBlY3RlZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZXhwZWN0ZWQgPSB7fTtcbiAgdmFyIHJ1bGVEaWN0ID0gdGhpcy5zdGF0ZS5ncmFtbWFyLnJ1bGVEaWN0O1xuICB0aGlzLl9leHByc0FuZFN0YWNrcy5mb3JFYWNoKGZ1bmN0aW9uKG9iaikge1xuICAgIGV4cGVjdGVkW29iai5leHByLnRvRXhwZWN0ZWQocnVsZURpY3QpXSA9IHRydWU7XG4gIH0pO1xuICByZXR1cm4gT2JqZWN0LmtleXMoZXhwZWN0ZWQpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gTWF0Y2hSZXN1bHQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgndXRpbC1leHRlbmQnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIE5hbWVzcGFjZSgpIHtcbn1cbk5hbWVzcGFjZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5OYW1lc3BhY2UuYXNOYW1lc3BhY2UgPSBmdW5jdGlvbihvYmpPck5hbWVzcGFjZSkge1xuICBpZiAob2JqT3JOYW1lc3BhY2UgaW5zdGFuY2VvZiBOYW1lc3BhY2UpIHtcbiAgICByZXR1cm4gb2JqT3JOYW1lc3BhY2U7XG4gIH1cbiAgcmV0dXJuIE5hbWVzcGFjZS5jcmVhdGVOYW1lc3BhY2Uob2JqT3JOYW1lc3BhY2UpO1xufTtcblxuLy8gQ3JlYXRlIGEgbmV3IG5hbWVzcGFjZS4gSWYgYG9wdFByb3BzYCBpcyBzcGVjaWZpZWQsIGFsbCBvZiBpdHMgcHJvcGVydGllc1xuLy8gd2lsbCBiZSBjb3BpZWQgdG8gdGhlIG5ldyBuYW1lc3BhY2UuXG5OYW1lc3BhY2UuY3JlYXRlTmFtZXNwYWNlID0gZnVuY3Rpb24ob3B0UHJvcHMpIHtcbiAgcmV0dXJuIE5hbWVzcGFjZS5leHRlbmQoTmFtZXNwYWNlLnByb3RvdHlwZSwgb3B0UHJvcHMpO1xufTtcblxuLy8gQ3JlYXRlIGEgbmV3IG5hbWVzcGFjZSB3aGljaCBleHRlbmRzIGFub3RoZXIgbmFtZXNwYWNlLiBJZiBgb3B0UHJvcHNgIGlzXG4vLyBzcGVjaWZpZWQsIGFsbCBvZiBpdHMgcHJvcGVydGllcyB3aWxsIGJlIGNvcGllZCB0byB0aGUgbmV3IG5hbWVzcGFjZS5cbk5hbWVzcGFjZS5leHRlbmQgPSBmdW5jdGlvbihuYW1lc3BhY2UsIG9wdFByb3BzKSB7XG4gIGlmIChuYW1lc3BhY2UgIT09IE5hbWVzcGFjZS5wcm90b3R5cGUgJiYgIShuYW1lc3BhY2UgaW5zdGFuY2VvZiBOYW1lc3BhY2UpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbm90IGEgTmFtZXNwYWNlIG9iamVjdDogJyArIG5hbWVzcGFjZSk7XG4gIH1cbiAgdmFyIG5zID0gT2JqZWN0LmNyZWF0ZShuYW1lc3BhY2UsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IE5hbWVzcGFjZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZXh0ZW5kKG5zLCBvcHRQcm9wcyk7XG59O1xuXG4vLyBUT0RPOiBTaG91bGQgdGhpcyBiZSBhIHJlZ3VsYXIgbWV0aG9kP1xuTmFtZXNwYWNlLnRvU3RyaW5nID0gZnVuY3Rpb24obnMpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChucyk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBOYW1lc3BhY2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBQb3NJbmZvKGdsb2JhbEFwcGxpY2F0aW9uU3RhY2spIHtcbiAgdGhpcy5nbG9iYWxBcHBsaWNhdGlvblN0YWNrID0gZ2xvYmFsQXBwbGljYXRpb25TdGFjaztcbiAgdGhpcy5hcHBsaWNhdGlvblN0YWNrID0gW107XG4gIC8vIFJlZHVuZGFudCAoY291bGQgYmUgZ2VuZXJhdGVkIGZyb20gYXBwbGljYXRpb25TdGFjaykgYnV0IHVzZWZ1bCBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucy5cbiAgdGhpcy5hY3RpdmVBcHBsaWNhdGlvbnMgPSB7fTtcbiAgdGhpcy5tZW1vID0ge307XG59XG5cblBvc0luZm8ucHJvdG90eXBlID0ge1xuICBpc0FjdGl2ZTogZnVuY3Rpb24oYXBwbGljYXRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVBcHBsaWNhdGlvbnNbYXBwbGljYXRpb24udG9NZW1vS2V5KCldO1xuICB9LFxuXG4gIGVudGVyOiBmdW5jdGlvbihhcHBsaWNhdGlvbikge1xuICAgIHRoaXMuZ2xvYmFsQXBwbGljYXRpb25TdGFjay5wdXNoKGFwcGxpY2F0aW9uKTtcbiAgICB0aGlzLmFwcGxpY2F0aW9uU3RhY2sucHVzaChhcHBsaWNhdGlvbik7XG4gICAgdGhpcy5hY3RpdmVBcHBsaWNhdGlvbnNbYXBwbGljYXRpb24udG9NZW1vS2V5KCldID0gdHJ1ZTtcbiAgfSxcblxuICBleGl0OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXBwbGljYXRpb24gPSB0aGlzLmdsb2JhbEFwcGxpY2F0aW9uU3RhY2sucG9wKCk7XG4gICAgdGhpcy5hcHBsaWNhdGlvblN0YWNrLnBvcCgpO1xuICAgIHRoaXMuYWN0aXZlQXBwbGljYXRpb25zW2FwcGxpY2F0aW9uLnRvTWVtb0tleSgpXSA9IGZhbHNlO1xuICB9LFxuXG4gIHNob3VsZFVzZU1lbW9pemVkUmVzdWx0OiBmdW5jdGlvbihtZW1vUmVjKSB7XG4gICAgdmFyIGludm9sdmVkQXBwbGljYXRpb25zID0gbWVtb1JlYy5pbnZvbHZlZEFwcGxpY2F0aW9ucztcbiAgICBmb3IgKHZhciBtZW1vS2V5IGluIGludm9sdmVkQXBwbGljYXRpb25zKSB7XG4gICAgICBpZiAoaW52b2x2ZWRBcHBsaWNhdGlvbnNbbWVtb0tleV0gJiYgdGhpcy5hY3RpdmVBcHBsaWNhdGlvbnNbbWVtb0tleV0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICBnZXRDdXJyZW50TGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrKSB7XG4gICAgICByZXR1cm4gdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2tbdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2subGVuZ3RoIC0gMV07XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0TGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24oYXBwbGljYXRpb24pIHtcbiAgICBpZiAoIXRoaXMubGVmdFJlY3Vyc2lvblN0YWNrKSB7XG4gICAgICB0aGlzLmxlZnRSZWN1cnNpb25TdGFjayA9IFtdO1xuICAgIH1cbiAgICB0aGlzLmxlZnRSZWN1cnNpb25TdGFjay5wdXNoKHtcbiAgICAgICAgbWVtb0tleTogYXBwbGljYXRpb24udG9NZW1vS2V5KCksXG4gICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICAgICAgcG9zOiAtMSxcbiAgICAgICAgaW52b2x2ZWRBcHBsaWNhdGlvbnM6IHt9fSk7XG4gICAgdGhpcy51cGRhdGVJbnZvbHZlZEFwcGxpY2F0aW9ucygpO1xuICB9LFxuXG4gIGVuZExlZnRSZWN1cnNpb246IGZ1bmN0aW9uKGFwcGxpY2F0aW9uKSB7XG4gICAgdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2sucG9wKCk7XG4gIH0sXG5cbiAgdXBkYXRlSW52b2x2ZWRBcHBsaWNhdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJyZW50TGVmdFJlY3Vyc2lvbiA9IHRoaXMuZ2V0Q3VycmVudExlZnRSZWN1cnNpb24oKTtcbiAgICB2YXIgaW52b2x2ZWRBcHBsaWNhdGlvbnMgPSBjdXJyZW50TGVmdFJlY3Vyc2lvbi5pbnZvbHZlZEFwcGxpY2F0aW9ucztcbiAgICB2YXIgbHJBcHBsaWNhdGlvbk1lbW9LZXkgPSBjdXJyZW50TGVmdFJlY3Vyc2lvbi5tZW1vS2V5O1xuICAgIHZhciBpZHggPSB0aGlzLmFwcGxpY2F0aW9uU3RhY2subGVuZ3RoIC0gMTtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIG1lbW9LZXkgPSB0aGlzLmFwcGxpY2F0aW9uU3RhY2tbaWR4LS1dLnRvTWVtb0tleSgpO1xuICAgICAgaWYgKG1lbW9LZXkgPT09IGxyQXBwbGljYXRpb25NZW1vS2V5KSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaW52b2x2ZWRBcHBsaWNhdGlvbnNbbWVtb0tleV0gPSB0cnVlO1xuICAgIH1cbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gUG9zSW5mbztcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBTeW1ib2wgPSByZXF1aXJlKCdzeW1ib2wnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBNYXRjaFJlc3VsdCA9IHJlcXVpcmUoJy4vTWF0Y2hSZXN1bHQnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gV3JhcHBlcnMgLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gV3JhcHBlcnMgZGVjb3JhdGUgQ1NUIG5vZGVzIHdpdGggYWxsIG9mIHRoZSBmdW5jdGlvbmFsaXR5IChpLmUuLCBvcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzKVxuLy8gcHJvdmlkZWQgYnkgYSBTZW1hbnRpY3MgKHNlZSBiZWxvdykuIGBXcmFwcGVyYCBpcyB0aGUgYWJzdHJhY3Qgc3VwZXJjbGFzcyBvZiBhbGwgd3JhcHBlcnMuIEFcbi8vIGBXcmFwcGVyYCBtdXN0IGhhdmUgYF9ub2RlYCBhbmQgYF9zZW1hbnRpY3NgIGluc3RhbmNlIHZhcmlhYmxlcywgd2hpY2ggcmVmZXIgdG8gdGhlIENTVCBub2RlIGFuZFxuLy8gU2VtYW50aWNzIChyZXNwLikgZm9yIHdoaWNoIGl0IHdhcyBjcmVhdGVkLCBhbmQgYSBgX2NoaWxkV3JhcHBlcnNgIGluc3RhbmNlIHZhcmlhYmxlIHdoaWNoIGlzXG4vLyB1c2VkIHRvIGNhY2hlIHRoZSB3cmFwcGVyIGluc3RhbmNlcyB0aGF0IGFyZSBjcmVhdGVkIGZvciBpdHMgY2hpbGQgbm9kZXMuIFNldHRpbmcgdGhlc2UgaW5zdGFuY2Vcbi8vIHZhcmlhYmxlcyBpcyB0aGUgcmVzcG9uc2liaWxpdHkgb2YgdGhlIGNvbnN0cnVjdG9yIG9mIGVhY2ggU2VtYW50aWNzLXNwZWNpZmljIHN1YmNsYXNzIG9mXG4vLyBgV3JhcHBlcmAuXG5mdW5jdGlvbiBXcmFwcGVyKCkge31cblxuV3JhcHBlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdbc2VtYW50aWNzIHdyYXBwZXIgZm9yICcgKyB0aGlzLl9ub2RlLmdyYW1tYXIubmFtZSArICddJztcbn07XG5cbi8vIFJldHVybnMgdGhlIHdyYXBwZXIgb2YgdGhlIHNwZWNpZmllZCBjaGlsZCBub2RlLiBDaGlsZCB3cmFwcGVycyBhcmUgY3JlYXRlZCBsYXppbHkgYW5kIGNhY2hlZCBpblxuLy8gdGhlIHBhcmVudCB3cmFwcGVyJ3MgYF9jaGlsZFdyYXBwZXJzYCBpbnN0YW5jZSB2YXJpYWJsZS5cbldyYXBwZXIucHJvdG90eXBlLmNoaWxkID0gZnVuY3Rpb24oaWR4KSB7XG4gIGlmICghKDAgPD0gaWR4ICYmIGlkeCA8IHRoaXMuX25vZGUubnVtQ2hpbGRyZW4oKSkpIHtcbiAgICAvLyBUT0RPOiBDb25zaWRlciB0aHJvd2luZyBhbiBleGNlcHRpb24gaGVyZS5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHZhciBjaGlsZFdyYXBwZXIgPSB0aGlzLl9jaGlsZFdyYXBwZXJzW2lkeF07XG4gIGlmICghY2hpbGRXcmFwcGVyKSB7XG4gICAgY2hpbGRXcmFwcGVyID0gdGhpcy5fY2hpbGRXcmFwcGVyc1tpZHhdID0gdGhpcy5fc2VtYW50aWNzLndyYXAodGhpcy5fbm9kZS5jaGlsZEF0KGlkeCkpO1xuICB9XG4gIHJldHVybiBjaGlsZFdyYXBwZXI7XG59O1xuXG4vLyBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIHdyYXBwZXJzIG9mIGFsbCBvZiB0aGUgY2hpbGRyZW4gb2YgdGhlIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXNcbi8vIHdyYXBwZXIuXG5XcmFwcGVyLnByb3RvdHlwZS5fY2hpbGRyZW4gPSBmdW5jdGlvbigpIHtcbiAgLy8gRm9yY2UgdGhlIGNyZWF0aW9uIG9mIGFsbCBjaGlsZCB3cmFwcGVyc1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLl9ub2RlLm51bUNoaWxkcmVuKCk7IGlkeCsrKSB7XG4gICAgdGhpcy5jaGlsZChpZHgpO1xuICB9XG4gIHJldHVybiB0aGlzLl9jaGlsZFdyYXBwZXJzO1xufTtcblxuLy8gUmV0dXJucyB0aGUgd3JhcHBlciBvZiB0aGUgZmlyc3QgY2hpbGQgbm9kZS4gVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGUgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpc1xuLy8gd3JhcHBlciBkb2Vzbid0IGhhdmUgZXhhY3RseSBvbmUgY2hpbGQuXG5XcmFwcGVyLnByb3RvdHlwZS5fb25seUNoaWxkID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLl9ub2RlLm51bUNoaWxkcmVuKCkgIT09IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdjYW5ub3QgZ2V0IG9ubHkgY2hpbGQgb2YgYSBub2RlIG9mIHR5cGUgJyArIHRoaXMuY3Rvck5hbWUoKSArXG4gICAgICAgICcgKGl0IGhhcyAnICsgdGhpcy5fbm9kZS5udW1DaGlsZHJlbigpICsgJyBjaGlsZHJlbiknKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZCgwKTtcbiAgfVxufTtcblxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHdyYXBwZXIgY29ycmVzcG9uZHMgdG8gYW4gaXRlcmF0aW9uXG4vLyBleHByZXNzaW9uLCBpLmUuLCBhIEtsZWVuZS0qLCBLbGVlbmUtKywgb3IgYW4gb3B0aW9uYWwuIFJldHVybnMgYGZhbHNlYCBvdGhlcndpc2UuXG5XcmFwcGVyLnByb3RvdHlwZS5pc0l0ZXJhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5fbm9kZS5jdG9yTmFtZSA9PT0gJ19pdGVyJztcbn07XG5cbi8vIFJldHVybnMgYHRydWVgIGlmIHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyB3cmFwcGVyIGlzIGEgdGVybWluYWwgbm9kZSwgYGZhbHNlYFxuLy8gb3RoZXJ3aXNlLlxuV3JhcHBlci5wcm90b3R5cGUuaXNUZXJtaW5hbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5fbm9kZS5pc1Rlcm1pbmFsKCk7XG59O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhXcmFwcGVyLnByb3RvdHlwZSwge1xuICAvLyBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGNoaWxkcmVuIG9mIHRoaXMgQ1NUIG5vZGUuXG4gIGNoaWxkcmVuOiB7Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2NoaWxkcmVuKCk7IH19LFxuXG4gIC8vIFJldHVybnMgdGhlIG5hbWUgb2YgZ3JhbW1hciBydWxlIHRoYXQgY3JlYXRlZCB0aGlzIENTVCBub2RlLlxuICBjdG9yTmFtZToge2dldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9ub2RlLmN0b3JOYW1lOyB9fSxcblxuICAvLyBSZXR1cm5zIHRoZSBpbnRlcnZhbCBjb25zdW1lZCBieSB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlci5cbiAgaW50ZXJ2YWw6IHtnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fbm9kZS5pbnRlcnZhbDsgfX0sXG5cbiAgLy8gUmV0dXJucyB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuIG9mIHRoaXMgQ1NUIG5vZGUuXG4gIG51bUNoaWxkcmVuOiB7Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX25vZGUubnVtQ2hpbGRyZW4oKTsgfX0sXG5cbiAgLy8gUmV0dXJucyB0aGUgcHJpbWl0aXZlIHZhbHVlIG9mIHRoaXMgQ1NUIG5vZGUsIGlmIGl0J3MgYSB0ZXJtaW5hbCBub2RlLiBPdGhlcndpc2UsXG4gIC8vIHRocm93cyBhbiBleGNlcHRpb24uXG4gIHByaW1pdGl2ZVZhbHVlOiB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLmlzVGVybWluYWwoKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZS5wcmltaXRpdmVWYWx1ZTtcbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJ0cmllZCB0byBhY2Nlc3MgdGhlICdwcmltaXRpdmVWYWx1ZScgYXR0cmlidXRlIG9mIGEgbm9uLXRlcm1pbmFsIENTVCBub2RlXCIpO1xuICAgIH1cbiAgfVxufSk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIFNlbWFudGljcyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBBIFNlbWFudGljcyBpcyBhIGNvbnRhaW5lciBmb3IgYSBmYW1pbHkgb2YgT3BlcmF0aW9ucyBhbmQgQXR0cmlidXRlcyBmb3IgYSBnaXZlbiBncmFtbWFyLlxuLy8gU2VtYW50aWNzIGVuYWJsZSBtb2R1bGFyaXR5IChkaWZmZXJlbnQgY2xpZW50cyBvZiBhIGdyYW1tYXIgY2FuIGNyZWF0ZSB0aGVpciBzZXQgb2Ygb3BlcmF0aW9uc1xuLy8gYW5kIGF0dHJpYnV0ZXMgaW4gaXNvbGF0aW9uKSBhbmQgZXh0ZW5zaWJpbGl0eSBldmVuIHdoZW4gb3BlcmF0aW9ucyBhbmQgYXR0cmlidXRlcyBhcmUgbXV0dWFsbHktXG4vLyByZWN1cnNpdmUuIFRoaXMgY29uc3RydWN0b3Igc2hvdWxkIG5vdCBiZSBjYWxsZWQgZGlyZWN0bHkgZXhjZXB0IGZyb21cbi8vIGBTZW1hbnRpY3MuY3JlYXRlU2VtYW50aWNzYC4gVGhlIG5vcm1hbCB3YXlzIHRvIGNyZWF0ZSBhIFNlbWFudGljcywgZ2l2ZW4gYSBncmFtbWFyICdnJywgYXJlXG4vLyBgZy5zZW1hbnRpY3MoKWAgYW5kIGBnLmV4dGVuZFNlbWFudGljcyhwYXJlbnRTZW1hbnRpY3MpYC5cbmZ1bmN0aW9uIFNlbWFudGljcyhncmFtbWFyLCBvcHRTdXBlclNlbWFudGljcykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG4gIHRoaXMuY2hlY2tlZEFjdGlvbkRpY3RzID0gZmFsc2U7XG5cbiAgLy8gQ29uc3RydWN0b3IgZm9yIHdyYXBwZXIgaW5zdGFuY2VzLCB3aGljaCBhcmUgcGFzc2VkIGFzIHRoZSBhcmd1bWVudHMgdG8gdGhlIHNlbWFudGljIGFjdGlvbnNcbiAgLy8gb2YgYW4gb3BlcmF0aW9uIG9yIGF0dHJpYnV0ZS4gT3BlcmF0aW9ucyBhbmQgYXR0cmlidXRlcyByZXF1aXJlIGRvdWJsZSBkaXNwYXRjaDogdGhlIHNlbWFudGljXG4gIC8vIGFjdGlvbiBpcyBjaG9zZW4gYmFzZWQgb24gYm90aCB0aGUgbm9kZSdzIHR5cGUgYW5kIHRoZSBzZW1hbnRpY3MuIFdyYXBwZXJzIGVuc3VyZSB0aGF0XG4gIC8vIHRoZSBgZXhlY3V0ZWAgbWV0aG9kIGlzIGNhbGxlZCB3aXRoIHRoZSBjb3JyZWN0IChtb3N0IHNwZWNpZmljKSBzZW1hbnRpY3Mgb2JqZWN0IGFzIGFuXG4gIC8vIGFyZ3VtZW50LlxuICB0aGlzLldyYXBwZXIgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgc2VsZi5jaGVja0FjdGlvbkRpY3RzSWZIYXZlbnRBbHJlYWR5KCk7XG4gICAgdGhpcy5fc2VtYW50aWNzID0gc2VsZjtcbiAgICB0aGlzLl9ub2RlID0gbm9kZTtcbiAgICB0aGlzLl9jaGlsZFdyYXBwZXJzID0gW107XG4gIH07XG5cbiAgaWYgKG9wdFN1cGVyU2VtYW50aWNzKSB7XG4gICAgdGhpcy5zdXBlciA9IG9wdFN1cGVyU2VtYW50aWNzO1xuICAgIGlmIChncmFtbWFyICE9PSB0aGlzLnN1cGVyLmdyYW1tYXIgJiYgIWdyYW1tYXIuX2luaGVyaXRzRnJvbSh0aGlzLnN1cGVyLmdyYW1tYXIpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgXCJDYW5ub3QgZXh0ZW5kIGEgc2VtYW50aWNzIGZvciBncmFtbWFyICdcIiArIHRoaXMuc3VwZXIuZ3JhbW1hci5uYW1lICtcbiAgICAgICAgICBcIicgZm9yIHVzZSB3aXRoIGdyYW1tYXIgJ1wiICsgZ3JhbW1hci5uYW1lICsgXCInIChub3QgYSBzdWItZ3JhbW1hcilcIik7XG4gICAgfVxuICAgIGluaGVyaXRzKHRoaXMuV3JhcHBlciwgdGhpcy5zdXBlci5XcmFwcGVyKTtcbiAgICB0aGlzLm9wZXJhdGlvbnMgPSBPYmplY3QuY3JlYXRlKHRoaXMuc3VwZXIub3BlcmF0aW9ucyk7XG4gICAgdGhpcy5hdHRyaWJ1dGVzID0gT2JqZWN0LmNyZWF0ZSh0aGlzLnN1cGVyLmF0dHJpYnV0ZXMpO1xuICAgIHRoaXMuYXR0cmlidXRlS2V5cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICAvLyBBc3NpZ24gdW5pcXVlIHN5bWJvbHMgZm9yIGVhY2ggb2YgdGhlIGF0dHJpYnV0ZXMgaW5oZXJpdGVkIGZyb20gdGhlIHN1cGVyLXNlbWFudGljcyBzbyB0aGF0XG4gICAgLy8gdGhleSBhcmUgbWVtb2l6ZWQgaW5kZXBlbmRlbnRseS5cbiAgICBmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgICAgdGhpcy5hdHRyaWJ1dGVLZXlzW2F0dHJpYnV0ZU5hbWVdID0gU3ltYm9sKCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGluaGVyaXRzKHRoaXMuV3JhcHBlciwgV3JhcHBlcik7XG4gICAgdGhpcy5vcGVyYXRpb25zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0aGlzLmF0dHJpYnV0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRoaXMuYXR0cmlidXRlS2V5cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIH1cbn1cblxuU2VtYW50aWNzLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ1tzZW1hbnRpY3MgZm9yICcgKyB0aGlzLmdyYW1tYXIubmFtZSArICddJztcbn07XG5cblNlbWFudGljcy5wcm90b3R5cGUuY2hlY2tBY3Rpb25EaWN0c0lmSGF2ZW50QWxyZWFkeSA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuY2hlY2tlZEFjdGlvbkRpY3RzKSB7XG4gICAgdGhpcy5jaGVja0FjdGlvbkRpY3RzKCk7XG4gICAgdGhpcy5jaGVja2VkQWN0aW9uRGljdHMgPSB0cnVlO1xuICB9XG59O1xuXG4vLyBDaGVja3MgdGhhdCB0aGUgYWN0aW9uIGRpY3Rpb25hcmllcyBmb3IgYWxsIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgaW4gdGhpcyBzZW1hbnRpY3MsXG4vLyBpbmNsdWRpbmcgdGhlIG9uZXMgdGhhdCB3ZXJlIGluaGVyaXRlZCBmcm9tIHRoZSBzdXBlci1zZW1hbnRpY3MsIGFncmVlIHdpdGggdGhlIGdyYW1tYXIuXG4vLyBUaHJvd3MgYW4gZXhjZXB0aW9uIGlmIG9uZSBvciBtb3JlIG9mIHRoZW0gZG9lc24ndC5cblNlbWFudGljcy5wcm90b3R5cGUuY2hlY2tBY3Rpb25EaWN0cyA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBuYW1lIGluIHRoaXMub3BlcmF0aW9ucykge1xuICAgIHRoaXMub3BlcmF0aW9uc1tuYW1lXS5jaGVja0FjdGlvbkRpY3QodGhpcy5ncmFtbWFyKTtcbiAgfVxuICBmb3IgKG5hbWUgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgdGhpcy5hdHRyaWJ1dGVzW25hbWVdLmNoZWNrQWN0aW9uRGljdCh0aGlzLmdyYW1tYXIpO1xuICB9XG59O1xuXG5TZW1hbnRpY3MucHJvdG90eXBlLmFkZE9wZXJhdGlvbk9yQXR0cmlidXRlID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgYWN0aW9uRGljdCkge1xuICB2YXIgdHlwZVBsdXJhbCA9IHR5cGUgKyAncyc7XG4gIHZhciBDdG9yID0gdHlwZSA9PT0gJ29wZXJhdGlvbicgPyBPcGVyYXRpb24gOiBBdHRyaWJ1dGU7XG5cbiAgdGhpcy5hc3NlcnROZXdOYW1lKG5hbWUsIHR5cGUpO1xuICB0aGlzW3R5cGVQbHVyYWxdW25hbWVdID0gbmV3IEN0b3IobmFtZSwgYWN0aW9uRGljdCk7XG5cbiAgLy8gVGhlIGZvbGxvd2luZyBjaGVjayBpcyBub3Qgc3RyaWN0bHkgbmVjZXNzYXJ5IChpdCB3aWxsIGhhcHBlbiBsYXRlciBhbnl3YXkpIGJ1dCBpdCdzIGJldHRlciB0b1xuICAvLyBjYXRjaCBlcnJvcnMgZWFybHkuXG4gIHRoaXNbdHlwZVBsdXJhbF1bbmFtZV0uY2hlY2tBY3Rpb25EaWN0KHRoaXMuZ3JhbW1hcik7XG5cbiAgZnVuY3Rpb24gZG9JdCgpIHtcbiAgICAvLyBEaXNwYXRjaCB0byBtb3N0IHNwZWNpZmljIHZlcnNpb24gb2YgdGhpcyBvcGVyYXRpb24gLyBhdHRyaWJ1dGUgLS0gaXQgbWF5IGhhdmUgYmVlblxuICAgIC8vIG92ZXJyaWRkZW4gYnkgYSBzdWItc2VtYW50aWNzLlxuICAgIHZhciB0aGlzVGhpbmcgPSB0aGlzLl9zZW1hbnRpY3NbdHlwZVBsdXJhbF1bbmFtZV07XG4gICAgcmV0dXJuIHRoaXNUaGluZy5leGVjdXRlKHRoaXMuX3NlbWFudGljcywgdGhpcyk7XG4gIH1cblxuICBpZiAodHlwZSA9PT0gJ29wZXJhdGlvbicpIHtcbiAgICB0aGlzLldyYXBwZXIucHJvdG90eXBlW25hbWVdID0gZG9JdDtcbiAgICB0aGlzLldyYXBwZXIucHJvdG90eXBlW25hbWVdLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJ1snICsgbmFtZSArICcgb3BlcmF0aW9uXSc7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5XcmFwcGVyLnByb3RvdHlwZSwgbmFtZSwge2dldDogZG9JdH0pO1xuICAgIHRoaXMuYXR0cmlidXRlS2V5c1tuYW1lXSA9IFN5bWJvbCgpO1xuICB9XG59O1xuXG5TZW1hbnRpY3MucHJvdG90eXBlLmV4dGVuZE9wZXJhdGlvbk9yQXR0cmlidXRlID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgYWN0aW9uRGljdCkge1xuICB2YXIgdHlwZVBsdXJhbCA9IHR5cGUgKyAncyc7XG4gIHZhciBDdG9yID0gdHlwZSA9PT0gJ29wZXJhdGlvbicgPyBPcGVyYXRpb24gOiBBdHRyaWJ1dGU7XG5cbiAgaWYgKCEodGhpcy5zdXBlciAmJiBuYW1lIGluIHRoaXMuc3VwZXJbdHlwZVBsdXJhbF0pKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZXh0ZW5kICcgKyB0eXBlICsgXCIgJ1wiICsgbmFtZSArXG4gICAgICAgIFwiJzogZGlkIG5vdCBpbmhlcml0IGFuIFwiICsgdHlwZSArICcgd2l0aCB0aGF0IG5hbWUnKTtcbiAgfVxuICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXNbdHlwZVBsdXJhbF0sIG5hbWUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZXh0ZW5kICcgKyB0eXBlICsgXCIgJ1wiICsgbmFtZSArIFwiJyBhZ2FpblwiKTtcbiAgfVxuXG4gIC8vIENyZWF0ZSBhIG5ldyBvcGVyYXRpb24gLyBhdHRyaWJ1dGUgd2hvc2UgYWN0aW9uRGljdCBkZWxlZ2F0ZXMgdG8gdGhlIHN1cGVyIG9wZXJhdGlvbiAvXG4gIC8vIGF0dHJpYnV0ZSdzIGFjdGlvbkRpY3QsIGFuZCB3aGljaCBoYXMgYWxsIHRoZSBrZXlzIGZyb20gYGluaGVyaXRlZEFjdGlvbkRpY3RgLlxuICB2YXIgaW5oZXJpdGVkQWN0aW9uRGljdCA9IHRoaXNbdHlwZVBsdXJhbF1bbmFtZV0uYWN0aW9uRGljdDtcbiAgdmFyIG5ld0FjdGlvbkRpY3QgPSBPYmplY3QuY3JlYXRlKGluaGVyaXRlZEFjdGlvbkRpY3QpO1xuICBPYmplY3Qua2V5cyhhY3Rpb25EaWN0KS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBuZXdBY3Rpb25EaWN0W25hbWVdID0gYWN0aW9uRGljdFtuYW1lXTtcbiAgfSk7XG5cbiAgdGhpc1t0eXBlUGx1cmFsXVtuYW1lXSA9IG5ldyBDdG9yKG5hbWUsIG5ld0FjdGlvbkRpY3QpO1xuXG4gIC8vIFRoZSBmb2xsb3dpbmcgY2hlY2sgaXMgbm90IHN0cmljdGx5IG5lY2Vzc2FyeSAoaXQgd2lsbCBoYXBwZW4gbGF0ZXIgYW55d2F5KSBidXQgaXQncyBiZXR0ZXIgdG9cbiAgLy8gY2F0Y2ggZXJyb3JzIGVhcmx5LlxuICB0aGlzW3R5cGVQbHVyYWxdW25hbWVdLmNoZWNrQWN0aW9uRGljdCh0aGlzLmdyYW1tYXIpO1xufTtcblxuU2VtYW50aWNzLnByb3RvdHlwZS5hc3NlcnROZXdOYW1lID0gZnVuY3Rpb24obmFtZSwgdHlwZSkge1xuICBpZiAoV3JhcHBlci5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdDYW5ub3QgYWRkICcgKyB0eXBlICsgXCIgJ1wiICsgbmFtZSArIFwiJzogdGhhdCdzIGEgcmVzZXJ2ZWQgbmFtZVwiKTtcbiAgfVxuICBpZiAobmFtZSBpbiB0aGlzLm9wZXJhdGlvbnMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdDYW5ub3QgYWRkICcgKyB0eXBlICsgXCIgJ1wiICsgbmFtZSArIFwiJzogYW4gb3BlcmF0aW9uIHdpdGggdGhhdCBuYW1lIGFscmVhZHkgZXhpc3RzXCIpO1xuICB9XG4gIGlmIChuYW1lIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBhZGQgJyArIHR5cGUgKyBcIiAnXCIgKyBuYW1lICsgXCInOiBhbiBhdHRyaWJ1dGUgd2l0aCB0aGF0IG5hbWUgYWxyZWFkeSBleGlzdHNcIik7XG4gIH1cbn07XG5cbi8vIFJldHVybnMgYSB3cmFwcGVyIGZvciB0aGUgZ2l2ZW4gQ1NUIGBub2RlYCBpbiB0aGlzIHNlbWFudGljcy5cblNlbWFudGljcy5wcm90b3R5cGUud3JhcCA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgcmV0dXJuIG5ldyB0aGlzLldyYXBwZXIobm9kZSk7XG59O1xuXG4vLyBDcmVhdGVzIGEgbmV3IFNlbWFudGljcyBpbnN0YW5jZSBmb3IgYGdyYW1tYXJgLCBpbmhlcml0aW5nIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgZnJvbVxuLy8gYG9wdFN1cGVyU2VtYW50aWNzYCwgaWYgaXQgaXMgc3BlY2lmaWVkLiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBhY3RzIGFzIGEgcHJveHkgZm9yIHRoZSBuZXdcbi8vIFNlbWFudGljcyBpbnN0YW5jZS4gV2hlbiB0aGF0IGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aCBhIENTVCBub2RlIGFzIGFuIGFyZ3VtZW50LCBpdCByZXR1cm5zXG4vLyBhIHdyYXBwZXIgZm9yIHRoYXQgbm9kZSB3aGljaCBnaXZlcyBhY2Nlc3MgdG8gdGhlIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgcHJvdmlkZWQgYnkgdGhpc1xuLy8gc2VtYW50aWNzLlxuU2VtYW50aWNzLmNyZWF0ZVNlbWFudGljcyA9IGZ1bmN0aW9uKGdyYW1tYXIsIG9wdFN1cGVyU2VtYW50aWNzKSB7XG4gIHZhciBzID0gbmV3IFNlbWFudGljcyhncmFtbWFyLCBvcHRTdXBlclNlbWFudGljcyk7XG5cbiAgLy8gVG8gZW5hYmxlIGNsaWVudHMgdG8gaW52b2tlIGEgc2VtYW50aWNzIGxpa2UgYSBmdW5jdGlvbiwgcmV0dXJuIGEgZnVuY3Rpb24gdGhhdCBhY3RzIGFzIGEgcHJveHlcbiAgLy8gZm9yIGBzYCwgd2hpY2ggaXMgdGhlIHJlYWwgYFNlbWFudGljc2AgaW5zdGFuY2UuXG4gIHZhciBwcm94eSA9IGZ1bmN0aW9uIEFTZW1hbnRpY3MobWF0Y2hSZXN1bHQpIHtcbiAgICBpZiAoIShtYXRjaFJlc3VsdCBpbnN0YW5jZW9mIE1hdGNoUmVzdWx0KSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAnU2VtYW50aWNzIGV4cGVjdGVkIGEgTWF0Y2hSZXN1bHQsIGJ1dCBnb3QgJyArIGNvbW1vbi51bmV4cGVjdGVkT2JqVG9TdHJpbmcobWF0Y2hSZXN1bHQpKTtcbiAgICB9XG4gICAgaWYgKCFtYXRjaFJlc3VsdC5zdWNjZWVkZWQoKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAnY2Fubm90IGFwcGx5IFNlbWFudGljcyB0byAnICsgbWF0Y2hSZXN1bHQudG9TdHJpbmcoKSk7XG4gICAgfVxuXG4gICAgdmFyIGNzdCA9IG1hdGNoUmVzdWx0Ll9jc3Q7XG4gICAgaWYgKGNzdC5ncmFtbWFyICE9PSBncmFtbWFyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgXCJDYW5ub3QgdXNlIGEgQ1NUIG5vZGUgY3JlYXRlZCBieSBncmFtbWFyICdcIiArIGNzdC5ncmFtbWFyLm5hbWUgK1xuICAgICAgICAgIFwiJyB3aXRoIGEgc2VtYW50aWNzIGZvciAnXCIgKyBncmFtbWFyLm5hbWUgKyBcIidcIik7XG4gICAgfVxuICAgIHJldHVybiBzLndyYXAoY3N0KTtcbiAgfTtcblxuICAvLyBGb3J3YXJkIHB1YmxpYyBtZXRob2RzIGZyb20gdGhlIHByb3h5IHRvIHRoZSBzZW1hbnRpY3MgaW5zdGFuY2UuXG4gIHByb3h5LmFkZE9wZXJhdGlvbiA9IGZ1bmN0aW9uKG5hbWUsIGFjdGlvbkRpY3QpIHtcbiAgICBzLmFkZE9wZXJhdGlvbk9yQXR0cmlidXRlLmNhbGwocywgJ29wZXJhdGlvbicsIG5hbWUsIGFjdGlvbkRpY3QpO1xuICAgIHJldHVybiBwcm94eTtcbiAgfTtcbiAgcHJveHkuZXh0ZW5kT3BlcmF0aW9uID0gZnVuY3Rpb24obmFtZSwgYWN0aW9uRGljdCkge1xuICAgIHMuZXh0ZW5kT3BlcmF0aW9uT3JBdHRyaWJ1dGUuY2FsbChzLCAnb3BlcmF0aW9uJywgbmFtZSwgYWN0aW9uRGljdCk7XG4gICAgcmV0dXJuIHByb3h5O1xuICB9O1xuICBwcm94eS5hZGRBdHRyaWJ1dGUgPSBmdW5jdGlvbihuYW1lLCBhY3Rpb25EaWN0KSB7XG4gICAgcy5hZGRPcGVyYXRpb25PckF0dHJpYnV0ZS5jYWxsKHMsICdhdHRyaWJ1dGUnLCBuYW1lLCBhY3Rpb25EaWN0KTtcbiAgICByZXR1cm4gcHJveHk7XG4gIH07XG4gIHByb3h5LmV4dGVuZEF0dHJpYnV0ZSA9IGZ1bmN0aW9uKG5hbWUsIGFjdGlvbkRpY3QpIHtcbiAgICBzLmV4dGVuZE9wZXJhdGlvbk9yQXR0cmlidXRlLmNhbGwocywgJ2F0dHJpYnV0ZScsIG5hbWUsIGFjdGlvbkRpY3QpO1xuICAgIHJldHVybiBwcm94eTtcbiAgfTtcblxuICAvLyBNYWtlIHRoZSBwcm94eSdzIHRvU3RyaW5nKCkgd29yay5cbiAgcHJveHkudG9TdHJpbmcgPSBzLnRvU3RyaW5nLmJpbmQocyk7XG5cbiAgLy8gUmV0dXJucyB0aGUgc2VtYW50aWNzIGZvciB0aGUgcHJveHkuXG4gIHByb3h5Ll9nZXRTZW1hbnRpY3MgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcztcbiAgfTtcblxuICByZXR1cm4gcHJveHk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBEZWZhdWx0IHNlbWFudGljIGFjdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGFjdGlvbnMgPSB7XG4gIGdldFByaW1pdGl2ZVZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wcmltaXRpdmVWYWx1ZTtcbiAgfSxcbiAgcGFzc1Rocm91Z2g6IGZ1bmN0aW9uKGNoaWxkTm9kZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQlVHOiBvaG0uYWN0aW9ucy5wYXNzVGhyb3VnaCBzaG91bGQgbmV2ZXIgYmUgY2FsbGVkJyk7XG4gIH1cbn07XG5cblNlbWFudGljcy5hY3Rpb25zID0gYWN0aW9ucztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gT3BlcmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEFuIE9wZXJhdGlvbiByZXByZXNlbnRzIGEgZnVuY3Rpb24gdG8gYmUgYXBwbGllZCB0byBhIGNvbmNyZXRlIHN5bnRheCB0cmVlIChDU1QpIC0tIGl0J3MgdmVyeVxuLy8gc2ltaWxhciB0byBhIFZpc2l0b3IgKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVmlzaXRvcl9wYXR0ZXJuKS4gQW4gb3BlcmF0aW9uIGlzIGV4ZWN1dGVkIGJ5XG4vLyByZWN1cnNpdmVseSB3YWxraW5nIHRoZSBDU1QsIGFuZCBhdCBlYWNoIG5vZGUsIGludm9raW5nIHRoZSBtYXRjaGluZyBzZW1hbnRpYyBhY3Rpb24gZnJvbVxuLy8gYGFjdGlvbkRpY3RgLiBTZWUgYE9wZXJhdGlvbi5wcm90b3R5cGUuZXhlY3V0ZWAgZm9yIGRldGFpbHMgb2YgaG93IGEgQ1NUIG5vZGUncyBtYXRjaGluZyBzZW1hbnRpY1xuLy8gYWN0aW9uIGlzIGZvdW5kLlxuZnVuY3Rpb24gT3BlcmF0aW9uKG5hbWUsIGFjdGlvbkRpY3QpIHtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbiAgdGhpcy5hY3Rpb25EaWN0ID0gYWN0aW9uRGljdDtcbn1cblxuT3BlcmF0aW9uLnByb3RvdHlwZS50eXBlTmFtZSA9ICdvcGVyYXRpb24nO1xuXG5PcGVyYXRpb24ucHJvdG90eXBlLmNoZWNrQWN0aW9uRGljdCA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgZ3JhbW1hci5fY2hlY2tUb3BEb3duQWN0aW9uRGljdCh0aGlzLnR5cGVOYW1lLCB0aGlzLm5hbWUsIHRoaXMuYWN0aW9uRGljdCk7XG59O1xuXG4vLyBFeGVjdXRlIHRoaXMgb3BlcmF0aW9uIG9uIHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggYG5vZGVXcmFwcGVyYCBpbiB0aGUgY29udGV4dCBvZiB0aGUgZ2l2ZW5cbi8vIFNlbWFudGljcyBpbnN0YW5jZS5cbk9wZXJhdGlvbi5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uKHNlbWFudGljcywgbm9kZVdyYXBwZXIpIHtcbiAgaWYgKG5vZGVXcmFwcGVyLmlzSXRlcmF0aW9uKCkpIHtcbiAgICAvLyBUaGlzIENTVCBub2RlIGNvcnJlc3BvbmRzIHRvIGFuIGl0ZXJhdGlvbiBleHByZXNzaW9uIGluIHRoZSBncmFtbWFyICgqLCArLCBvciA/KSwgc28gd2UgbWFwXG4gICAgLy8gdGhpcyBvcGVyYXRpb24gb3ZlciBhbGwgb2YgaXRzIGNoaWxkIG5vZGVzLlxuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbm9kZVdyYXBwZXIuX25vZGUubnVtQ2hpbGRyZW4oKTsgaWR4KyspIHtcbiAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmV4ZWN1dGUoc2VtYW50aWNzLCBub2RlV3JhcHBlci5jaGlsZChpZHgpKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgLy8gTG9vayBmb3IgYSBzZW1hbnRpYyBhY3Rpb24gd2hvc2UgbmFtZSBtYXRjaGVzIHRoZSBub2RlJ3MgY29uc3RydWN0b3IgbmFtZSwgd2hpY2ggaXMgZWl0aGVyIHRoZVxuICAvLyBuYW1lIG9mIGEgcnVsZSBpbiB0aGUgZ3JhbW1hciwgb3IgdGhlIHNwZWNpYWwgdmFsdWUgJ190ZXJtaW5hbCcuXG4gIHZhciBhY3Rpb25GbiA9IHRoaXMuYWN0aW9uRGljdFtub2RlV3JhcHBlci5fbm9kZS5jdG9yTmFtZV07XG4gIGlmIChhY3Rpb25Gbikge1xuICAgIHJldHVybiB0aGlzLmRvQWN0aW9uKHNlbWFudGljcywgbm9kZVdyYXBwZXIsIGFjdGlvbkZuKTtcbiAgfVxuXG4gIC8vIFRoZSBhY3Rpb24gZGljdGlvbmFyeSBkb2VzIG5vdCBjb250YWluIGEgc2VtYW50aWMgYWN0aW9uIGZvciB0aGlzIHNwZWNpZmljIHR5cGUgb2Ygbm9kZSwgc29cbiAgLy8gaW52b2tlIHRoZSAnX2RlZmF1bHQnIHNlbWFudGljIGFjdGlvbiBpZiBpdCBleGlzdHMgKGJ1dCBvbmx5IGlmIHRoaXMgbm9kZSBpcyBub3QgYSB0ZXJtaW5hbCkuXG4gIHZhciBkZWZhdWx0QWN0aW9uRm4gPSB0aGlzLmFjdGlvbkRpY3QuX2RlZmF1bHQ7XG4gIGlmIChkZWZhdWx0QWN0aW9uRm4gJiYgIW5vZGVXcmFwcGVyLmlzVGVybWluYWwoKSkge1xuICAgIHJldHVybiB0aGlzLmRvQWN0aW9uKHNlbWFudGljcywgbm9kZVdyYXBwZXIsIGRlZmF1bHRBY3Rpb25GbiwgdHJ1ZSk7XG4gIH1cblxuICAvLyBUaGUgcHJvZ3JhbW1lciBoYXNuJ3Qgd3JpdHRlbiBhIHNlbWFudGljIGFjdGlvbiBmb3IgdGhpcyB0eXBlIG9mIG5vZGUgeWV0LlxuICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnbWlzc2luZyBzZW1hbnRpYyBhY3Rpb24gZm9yICcgKyBub2RlV3JhcHBlci5fbm9kZS5jdG9yTmFtZSArICcgaW4gJyArIHRoaXMubmFtZSArICcgJyArXG4gICAgICB0aGlzLnR5cGVOYW1lKTtcbn07XG5cbi8vIEludm9rZSBgYWN0aW9uRm5gIG9uIHRoZSBDU1Qgbm9kZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGBub2RlV3JhcHBlcmAsIGluIHRoZSBjb250ZXh0IG9mXG4vLyBgc2VtYW50aWNzYC4gSWYgYG9wdFBhc3NDaGlsZHJlbkFzQXJyYXlgIGlzIHRydWUsIGBhY3Rpb25GbmAgd2lsbCBiZSBjYWxsZWQgd2l0aCBhIHNpbmdsZVxuLy8gYXJndW1lbnQsIHdoaWNoIGlzIGFuIGFycmF5IG9mIHdyYXBwZXJzLiBPdGhlcndpc2UsIHRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRvIGBhY3Rpb25GbmAgd2lsbFxuLy8gYmUgZXF1YWwgdG8gdGhlIG51bWJlciBvZiBjaGlsZHJlbiBpbiB0aGUgQ1NUIG5vZGUuXG5PcGVyYXRpb24ucHJvdG90eXBlLmRvQWN0aW9uID0gZnVuY3Rpb24oc2VtYW50aWNzLCBub2RlV3JhcHBlciwgYWN0aW9uRm4sIG9wdFBhc3NDaGlsZHJlbkFzQXJyYXkpIHtcbiAgaWYgKGFjdGlvbkZuID09PSBhY3Rpb25zLnBhc3NUaHJvdWdoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShzZW1hbnRpY3MsIG5vZGVXcmFwcGVyLl9vbmx5Q2hpbGQoKSk7XG4gIH1cbiAgcmV0dXJuIG9wdFBhc3NDaGlsZHJlbkFzQXJyYXkgP1xuICAgICAgYWN0aW9uRm4uY2FsbChub2RlV3JhcHBlciwgbm9kZVdyYXBwZXIuX2NoaWxkcmVuKCkpIDpcbiAgICAgIGFjdGlvbkZuLmFwcGx5KG5vZGVXcmFwcGVyLCBub2RlV3JhcHBlci5fY2hpbGRyZW4oKSk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBBdHRyaWJ1dGUgLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gQXR0cmlidXRlcyBhcmUgT3BlcmF0aW9ucyB3aG9zZSByZXN1bHRzIGFyZSBtZW1vaXplZC4gVGhpcyBtZWFucyB0aGF0LCBmb3IgYW55IGdpdmVuIHNlbWFudGljcyxcbi8vIHRoZSBzZW1hbnRpYyBhY3Rpb24gZm9yIGEgQ1NUIG5vZGUgd2lsbCBiZSBpbnZva2VkIG5vIG1vcmUgdGhhbiBvbmNlLlxuZnVuY3Rpb24gQXR0cmlidXRlKG5hbWUsIGFjdGlvbkRpY3QpIHtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbiAgdGhpcy5hY3Rpb25EaWN0ID0gYWN0aW9uRGljdDtcbn1cbmluaGVyaXRzKEF0dHJpYnV0ZSwgT3BlcmF0aW9uKTtcblxuQXR0cmlidXRlLnByb3RvdHlwZS50eXBlTmFtZSA9ICdhdHRyaWJ1dGUnO1xuXG5BdHRyaWJ1dGUucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbihzZW1hbnRpY3MsIG5vZGVXcmFwcGVyKSB7XG4gIHZhciBub2RlID0gbm9kZVdyYXBwZXIuX25vZGU7XG4gIHZhciBrZXkgPSBzZW1hbnRpY3MuYXR0cmlidXRlS2V5c1t0aGlzLm5hbWVdO1xuICBpZiAoIW5vZGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgIC8vIFRoZSBmb2xsb3dpbmcgaXMgYSBzdXBlci1zZW5kIC0tIGlzbid0IEpTIGJlYXV0aWZ1bD8gOi9cbiAgICBub2RlW2tleV0gPSBPcGVyYXRpb24ucHJvdG90eXBlLmV4ZWN1dGUuY2FsbCh0aGlzLCBzZW1hbnRpY3MsIG5vZGVXcmFwcGVyKTtcbiAgfVxuICByZXR1cm4gbm9kZVtrZXldO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gU2VtYW50aWNzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIFBvc0luZm8gPSByZXF1aXJlKCcuL1Bvc0luZm8nKTtcbnZhciBUcmFjZSA9IHJlcXVpcmUoJy4vVHJhY2UnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gU3RhdGUoZ3JhbW1hciwgaW5wdXRTdHJlYW0sIHN0YXJ0UnVsZSwgdHJhY2luZ0VuYWJsZWQpIHtcbiAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hcjtcbiAgdGhpcy5vcmlnSW5wdXRTdHJlYW0gPSBpbnB1dFN0cmVhbTtcbiAgdGhpcy5zdGFydFJ1bGUgPSBzdGFydFJ1bGU7XG4gIHRoaXMudHJhY2luZ0VuYWJsZWQgPSB0cmFjaW5nRW5hYmxlZDtcbiAgdGhpcy5yaWdodG1vc3RGYWlsUG9zID0gLTE7XG4gIHRoaXMuaW5pdCgpO1xufVxuXG5TdGF0ZS5wcm90b3R5cGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKG9wdEZhaWx1cmVzQXJyYXkpIHtcbiAgICB0aGlzLmlucHV0U3RyZWFtU3RhY2sgPSBbXTtcbiAgICB0aGlzLnBvc0luZm9zU3RhY2sgPSBbXTtcbiAgICB0aGlzLnB1c2hJbnB1dFN0cmVhbSh0aGlzLm9yaWdJbnB1dFN0cmVhbSk7XG4gICAgdGhpcy5hcHBsaWNhdGlvblN0YWNrID0gW107XG4gICAgdGhpcy5iaW5kaW5ncyA9IFtdO1xuICAgIHRoaXMuZmFpbHVyZXMgPSBvcHRGYWlsdXJlc0FycmF5O1xuICAgIHRoaXMuaWdub3JlRmFpbHVyZXNDb3VudCA9IDA7XG4gICAgaWYgKHRoaXMuaXNUcmFjaW5nKCkpIHtcbiAgICAgIHRoaXMudHJhY2UgPSBbXTtcbiAgICB9XG4gIH0sXG5cbiAgcHVzaElucHV0U3RyZWFtOiBmdW5jdGlvbihpbnB1dFN0cmVhbSkge1xuICAgIHRoaXMuaW5wdXRTdHJlYW1TdGFjay5wdXNoKHRoaXMuaW5wdXRTdHJlYW0pO1xuICAgIHRoaXMucG9zSW5mb3NTdGFjay5wdXNoKHRoaXMucG9zSW5mb3MpO1xuICAgIHRoaXMuaW5wdXRTdHJlYW0gPSBpbnB1dFN0cmVhbTtcbiAgICB0aGlzLnBvc0luZm9zID0gW107XG4gIH0sXG5cbiAgcG9wSW5wdXRTdHJlYW06IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5wdXRTdHJlYW0gPSB0aGlzLmlucHV0U3RyZWFtU3RhY2sucG9wKCk7XG4gICAgdGhpcy5wb3NJbmZvcyA9IHRoaXMucG9zSW5mb3NTdGFjay5wb3AoKTtcbiAgfSxcblxuICBnZXRDdXJyZW50UG9zSW5mbzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UG9zSW5mbyh0aGlzLmlucHV0U3RyZWFtLnBvcyk7XG4gIH0sXG5cbiAgZ2V0UG9zSW5mbzogZnVuY3Rpb24ocG9zKSB7XG4gICAgdmFyIHBvc0luZm8gPSB0aGlzLnBvc0luZm9zW3Bvc107XG4gICAgcmV0dXJuIHBvc0luZm8gfHwgKHRoaXMucG9zSW5mb3NbcG9zXSA9IG5ldyBQb3NJbmZvKHRoaXMuYXBwbGljYXRpb25TdGFjaykpO1xuICB9LFxuXG4gIHJlY29yZEZhaWx1cmU6IGZ1bmN0aW9uKHBvcywgZXhwcikge1xuICAgIGlmICh0aGlzLmlnbm9yZUZhaWx1cmVzQ291bnQgPiAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwb3MgPCB0aGlzLnJpZ2h0bW9zdEZhaWxQb3MpIHtcbiAgICAgIC8vIGl0IHdvdWxkIGJlIHVzZWxlc3MgdG8gcmVjb3JkIHRoaXMgZmFpbHVyZSwgc28gZG9uJ3QgZG8gaXRcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKHBvcyA+IHRoaXMucmlnaHRtb3N0RmFpbFBvcykge1xuICAgICAgLy8gbmV3IHJpZ2h0bW9zdCBmYWlsdXJlIVxuICAgICAgdGhpcy5yaWdodG1vc3RGYWlsUG9zID0gcG9zO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuZmFpbHVyZXMpIHtcbiAgICAgIC8vIHdlJ3JlIG5vdCByZWFsbHkgcmVjb3JkaW5nIGZhaWx1cmVzLCBzbyB3ZSdyZSBkb25lXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVE9ETzogY29uc2lkZXIgbWFraW5nIHRoaXMgY29kZSBtb3JlIE9PLCBlLmcuLCBhZGQgYW4gRXhwckFuZFN0YWNrcyBjbGFzc1xuICAgIC8vIHRoYXQgc3VwcG9ydHMgYW4gYWRkU3RhY2soc3RhY2spIG1ldGhvZC5cbiAgICBmdW5jdGlvbiBhZGRTdGFjayhzdGFjaywgc3RhY2tzKSB7XG4gICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBzdGFja3MubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB2YXIgb3RoZXJTdGFjayA9IHN0YWNrc1tpZHhdO1xuICAgICAgICBpZiAoc3RhY2subGVuZ3RoICE9PSBvdGhlclN0YWNrLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGlkeDIgPSAwOyBpZHgyIDwgc3RhY2subGVuZ3RoOyBpZHgyKyspIHtcbiAgICAgICAgICBpZiAoc3RhY2tbaWR4Ml0gIT09IG90aGVyU3RhY2tbaWR4Ml0pIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaWR4MiA9PT0gc3RhY2subGVuZ3RoKSB7XG4gICAgICAgICAgLy8gZm91bmQgaXQsIG5vIG5lZWQgdG8gYWRkXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdGFja3MucHVzaChzdGFjayk7XG4gICAgfVxuXG4gICAgLy8gQW5vdGhlciBmYWlsdXJlIGF0IHJpZ2h0LW1vc3QgcG9zaXRpb24gLS0gcmVjb3JkIGl0IGlmIGl0IHdhc24ndCBhbHJlYWR5LlxuICAgIHZhciBzdGFjayA9IHRoaXMuYXBwbGljYXRpb25TdGFjay5zbGljZSgpO1xuICAgIHZhciBleHByc0FuZFN0YWNrcyA9IHRoaXMuZmFpbHVyZXM7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZXhwcnNBbmRTdGFja3MubGVuZ3RoOyBpZHgrKykge1xuICAgICAgdmFyIGV4cHJBbmRTdGFja3MgPSBleHByc0FuZFN0YWNrc1tpZHhdO1xuICAgICAgaWYgKGV4cHJBbmRTdGFja3MuZXhwciA9PT0gZXhwcikge1xuICAgICAgICBhZGRTdGFjayhzdGFjaywgZXhwckFuZFN0YWNrcy5zdGFja3MpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIGV4cHJzQW5kU3RhY2tzLnB1c2goe2V4cHI6IGV4cHIsIHN0YWNrczogW3N0YWNrXX0pO1xuICB9LFxuXG4gIGlnbm9yZUZhaWx1cmVzOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmlnbm9yZUZhaWx1cmVzQ291bnQrKztcbiAgfSxcblxuICByZWNvcmRGYWlsdXJlczogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pZ25vcmVGYWlsdXJlc0NvdW50LS07XG4gIH0sXG5cbiAgZ2V0RmFpbHVyZXNQb3M6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJpZ2h0bW9zdEZhaWxQb3M7XG4gIH0sXG5cbiAgZ2V0RmFpbHVyZXM6IGZ1bmN0aW9uKCkge1xuICAgIGlmICghdGhpcy5mYWlsdXJlcykge1xuICAgICAgLy8gUmV3aW5kLCB0aGVuIHRyeSB0byBtYXRjaCB0aGUgaW5wdXQgYWdhaW4sIHJlY29yZGluZyBmYWlsdXJlcy5cbiAgICAgIHRoaXMuaW5pdChbXSk7XG4gICAgICB0aGlzLnRyYWNpbmdFbmFibGVkID0gZmFsc2U7XG4gICAgICB2YXIgc3VjY2VlZGVkID0gbmV3IHBleHBycy5BcHBseSh0aGlzLnN0YXJ0UnVsZSkuZXZhbCh0aGlzKTtcbiAgICAgIGlmIChzdWNjZWVkZWQpIHtcbiAgICAgICAgdGhpcy5mYWlsdXJlcyA9IFtdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5mYWlsdXJlcztcbiAgfSxcblxuICAvLyBSZXR1cm5zIHRoZSBtZW1vaXplZCB0cmFjZSBlbnRyeSBmb3IgYHBvc2AgYW5kIGBleHByYCwgaWYgb25lIGV4aXN0cy5cbiAgZ2V0TWVtb2l6ZWRUcmFjZUVudHJ5OiBmdW5jdGlvbihwb3MsIGV4cHIpIHtcbiAgICB2YXIgcG9zSW5mbyA9IHRoaXMucG9zSW5mb3NbcG9zXTtcbiAgICBpZiAocG9zSW5mbyAmJiBleHByLnJ1bGVOYW1lKSB7XG4gICAgICB2YXIgbWVtb1JlYyA9IHBvc0luZm8ubWVtb1tleHByLnJ1bGVOYW1lXTtcbiAgICAgIGlmIChtZW1vUmVjKSB7XG4gICAgICAgIHJldHVybiBtZW1vUmVjLnRyYWNlRW50cnk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9LFxuXG4gIC8vIE1ha2UgYSBuZXcgdHJhY2UgZW50cnksIHVzaW5nIHRoZSBjdXJyZW50bHkgYWN0aXZlIHRyYWNlIGFycmF5IGFzIHRoZVxuICAvLyBuZXcgZW50cnkncyBjaGlsZHJlbi5cbiAgZ2V0VHJhY2VFbnRyeTogZnVuY3Rpb24ocG9zLCBleHByLCByZXN1bHQpIHtcbiAgICB2YXIgZW50cnkgPSB0aGlzLmdldE1lbW9pemVkVHJhY2VFbnRyeShwb3MsIGV4cHIpO1xuICAgIGlmICghZW50cnkpIHtcbiAgICAgIGVudHJ5ID0gbmV3IFRyYWNlKHRoaXMuaW5wdXRTdHJlYW0sIHBvcywgZXhwciwgcmVzdWx0LCB0aGlzLnRyYWNlKTtcbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5O1xuICB9LFxuXG4gIGlzVHJhY2luZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhY2luZ0VuYWJsZWQ7XG4gIH1cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YXRlO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgSW50ZXJ2YWwgPSByZXF1aXJlKCcuL0ludGVydmFsJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFVuaWNvZGUgY2hhcmFjdGVycyB0aGF0IGFyZSB1c2VkIGluIHRoZSBgdG9TdHJpbmdgIG91dHB1dC5cbnZhciBCQUxMT1RfWCA9ICdcXHUyNzE3JztcbnZhciBDSEVDS19NQVJLID0gJ1xcdTI3MTMnO1xudmFyIERPVF9PUEVSQVRPUiA9ICdcXHUyMkM1JztcbnZhciBSSUdIVFdBUkRTX0RPVUJMRV9BUlJPVyA9ICdcXHUyMUQyJztcbnZhciBTWU1CT0xfRk9SX0hPUklaT05UQUxfVEFCVUxBVElPTiA9ICdcXHUyNDA5JztcbnZhciBTWU1CT0xfRk9SX0xJTkVfRkVFRCA9ICdcXHUyNDBBJztcbnZhciBTWU1CT0xfRk9SX0NBUlJJQUdFX1JFVFVSTiA9ICdcXHUyNDBEJztcblxuZnVuY3Rpb24gbGlua0xlZnRSZWN1cnNpdmVDaGlsZHJlbihjaGlsZHJlbikge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgdmFyIG5leHRDaGlsZCA9IGNoaWxkcmVuW2kgKyAxXTtcblxuICAgIGlmIChuZXh0Q2hpbGQgJiYgY2hpbGQuZXhwciA9PT0gbmV4dENoaWxkLmV4cHIpIHtcbiAgICAgIGNoaWxkLnJlcGxhY2VkQnkgPSBuZXh0Q2hpbGQ7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNwYWNlcyhuKSB7XG4gIHJldHVybiBjb21tb24ucmVwZWF0KCcgJywgbikuam9pbignJyk7XG59XG5cbi8vIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIHBvcnRpb24gb2YgYGlucHV0U3RyZWFtYCBhdCBvZmZzZXQgYHBvc2AuXG4vLyBUaGUgcmVzdWx0IHdpbGwgY29udGFpbiBleGFjdGx5IGBsZW5gIGNoYXJhY3RlcnMuXG5mdW5jdGlvbiBnZXRJbnB1dEV4Y2VycHQoaW5wdXRTdHJlYW0sIHBvcywgbGVuKSB7XG4gIHZhciBleGNlcnB0ID0gYXNFc2NhcGVkU3RyaW5nKGlucHV0U3RyZWFtLnNvdXJjZVNsaWNlKHBvcywgcG9zICsgbGVuKSk7XG5cbiAgLy8gUGFkIHRoZSBvdXRwdXQgaWYgbmVjZXNzYXJ5LlxuICBpZiAoZXhjZXJwdC5sZW5ndGggPCBsZW4pIHtcbiAgICByZXR1cm4gZXhjZXJwdCArIGNvbW1vbi5yZXBlYXQoJyAnLCBsZW4gLSBleGNlcnB0Lmxlbmd0aCkuam9pbignJyk7XG4gIH1cbiAgcmV0dXJuIGV4Y2VycHQ7XG59XG5cbmZ1bmN0aW9uIGFzRXNjYXBlZFN0cmluZyhvYmopIHtcbiAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnKSB7XG4gICAgLy8gUmVwbGFjZSBub24tcHJpbnRhYmxlIGNoYXJhY3RlcnMgd2l0aCB2aXNpYmxlIHN5bWJvbHMuXG4gICAgcmV0dXJuIG9ialxuICAgICAgICAucmVwbGFjZSgvIC9nLCBET1RfT1BFUkFUT1IpXG4gICAgICAgIC5yZXBsYWNlKC9cXHQvZywgU1lNQk9MX0ZPUl9IT1JJWk9OVEFMX1RBQlVMQVRJT04pXG4gICAgICAgIC5yZXBsYWNlKC9cXG4vZywgU1lNQk9MX0ZPUl9MSU5FX0ZFRUQpXG4gICAgICAgIC5yZXBsYWNlKC9cXHIvZywgU1lNQk9MX0ZPUl9DQVJSSUFHRV9SRVRVUk4pO1xuICB9XG4gIHJldHVybiBTdHJpbmcob2JqKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gVHJhY2UgLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gVHJhY2UoaW5wdXRTdHJlYW0sIHBvcywgZXhwciwgYW5zLCBvcHRDaGlsZHJlbikge1xuICB0aGlzLmNoaWxkcmVuID0gb3B0Q2hpbGRyZW4gfHwgW107XG4gIHRoaXMuZXhwciA9IGV4cHI7XG4gIGlmIChhbnMpIHtcbiAgICB0aGlzLmludGVydmFsID0gbmV3IEludGVydmFsKGlucHV0U3RyZWFtLCBwb3MsIGlucHV0U3RyZWFtLnBvcyk7XG4gIH1cbiAgdGhpcy5pc0xlZnRSZWN1cnNpdmUgPSBmYWxzZTtcbiAgdGhpcy5wb3MgPSBwb3M7XG4gIHRoaXMuaW5wdXRTdHJlYW0gPSBpbnB1dFN0cmVhbTtcbiAgdGhpcy5zdWNjZWVkZWQgPSAhIWFucztcbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFRyYWNlLnByb3RvdHlwZSwgJ2Rpc3BsYXlTdHJpbmcnLCB7XG4gIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmV4cHIudG9EaXNwbGF5U3RyaW5nKCk7IH1cbn0pO1xuXG5UcmFjZS5wcm90b3R5cGUuc2V0TGVmdFJlY3Vyc2l2ZSA9IGZ1bmN0aW9uKGxlZnRSZWN1cnNpdmUpIHtcbiAgdGhpcy5pc0xlZnRSZWN1cnNpdmUgPSBsZWZ0UmVjdXJzaXZlO1xuICBpZiAobGVmdFJlY3Vyc2l2ZSkge1xuICAgIGxpbmtMZWZ0UmVjdXJzaXZlQ2hpbGRyZW4odGhpcy5jaGlsZHJlbik7XG4gIH1cbn07XG5cbi8vIFJlY3Vyc2l2ZWx5IHRyYXZlcnNlIHRoaXMgdHJhY2Ugbm9kZSBhbmQgYWxsIGl0cyBkZXNjZW5kZW50cywgY2FsbGluZyBhIHZpc2l0b3IgZnVuY3Rpb25cbi8vIGZvciBlYWNoIG5vZGUgdGhhdCBpcyB2aXNpdGVkLiBJZiBgdmlzdG9yT2JqT3JGbmAgaXMgYW4gb2JqZWN0LCB0aGVuIGl0cyAnZW50ZXInIHByb3BlcnR5XG4vLyBpcyBhIGZ1bmN0aW9uIHRvIGNhbGwgYmVmb3JlIHZpc2l0aW5nIHRoZSBjaGlsZHJlbiBvZiBhIG5vZGUsIGFuZCBpdHMgJ2V4aXQnIHByb3BlcnR5IGlzXG4vLyBhIGZ1bmN0aW9uIHRvIGNhbGwgYWZ0ZXJ3YXJkcy4gSWYgYHZpc2l0b3JPYmpPckZuYCBpcyBhIGZ1bmN0aW9uLCBpdCByZXByZXNlbnRzIHRoZSAnZW50ZXInXG4vLyBmdW5jdGlvbi5cbi8vXG4vLyBUaGUgZnVuY3Rpb25zIGFyZSBjYWxsZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6IHRoZSBUcmFjZSBub2RlLCBpdHMgcGFyZW50IFRyYWNlLCBhbmQgYSBudW1iZXJcbi8vIHJlcHJlc2VudGluZyB0aGUgZGVwdGggb2YgdGhlIG5vZGUgaW4gdGhlIHRyZWUuIChUaGUgcm9vdCBub2RlIGhhcyBkZXB0aCAwLikgYG9wdFRoaXNBcmdgLCBpZlxuLy8gc3BlY2lmaWVkLCBpcyB0aGUgdmFsdWUgdG8gdXNlIGZvciBgdGhpc2Agd2hlbiBleGVjdXRpbmcgdGhlIHZpc2l0b3IgZnVuY3Rpb25zLlxuVHJhY2UucHJvdG90eXBlLndhbGsgPSBmdW5jdGlvbih2aXNpdG9yT2JqT3JGbiwgb3B0VGhpc0FyZykge1xuICB2YXIgdmlzaXRvciA9IHZpc2l0b3JPYmpPckZuO1xuICBpZiAodHlwZW9mIHZpc2l0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2aXNpdG9yID0ge2VudGVyOiB2aXNpdG9yfTtcbiAgfVxuICByZXR1cm4gKGZ1bmN0aW9uIF93YWxrKG5vZGUsIHBhcmVudCwgZGVwdGgpIHtcbiAgICBpZiAodmlzaXRvci5lbnRlcikge1xuICAgICAgdmlzaXRvci5lbnRlci5jYWxsKG9wdFRoaXNBcmcsIG5vZGUsIHBhcmVudCwgZGVwdGgpO1xuICAgIH1cbiAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oYykge1xuICAgICAgaWYgKGMgJiYgKCd3YWxrJyBpbiBjKSkge1xuICAgICAgICBfd2FsayhjLCBub2RlLCBkZXB0aCArIDEpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICh2aXNpdG9yLmV4aXQpIHtcbiAgICAgIHZpc2l0b3IuZXhpdC5jYWxsKG9wdFRoaXNBcmcsIG5vZGUsIHBhcmVudCwgZGVwdGgpO1xuICAgIH1cbiAgfSkodGhpcywgbnVsbCwgMCk7XG59O1xuXG4vLyBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRyYWNlLlxuLy8gU2FtcGxlOlxuLy8gICAgIDEy4ouFK+KLhTLii4Uq4ouFMyDinJMgZXhwIOKHkiAgXCIxMlwiXG4vLyAgICAgMTLii4Ur4ouFMuKLhSrii4UzICAg4pyTIGFkZEV4cCAoTFIpIOKHkiAgXCIxMlwiXG4vLyAgICAgMTLii4Ur4ouFMuKLhSrii4UzICAgICAgIOKclyBhZGRFeHBfcGx1c1xuVHJhY2UucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzYiA9IG5ldyBjb21tb24uU3RyaW5nQnVmZmVyKCk7XG4gIHRoaXMud2FsayhmdW5jdGlvbihub2RlLCBwYXJlbnQsIGRlcHRoKSB7XG4gICAgdmFyIGN0b3JOYW1lID0gbm9kZS5leHByLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgaWYgKGN0b3JOYW1lID09PSAnQWx0Jykge1xuICAgICAgcmV0dXJuOyAgLy8gRG9uJ3QgcHJpbnQgYW55dGhpbmcgZm9yIEFsdCBub2Rlcy5cbiAgICB9XG4gICAgc2IuYXBwZW5kKGdldElucHV0RXhjZXJwdChub2RlLmlucHV0U3RyZWFtLCBub2RlLnBvcywgMTApICsgc3BhY2VzKGRlcHRoICogMiArIDEpKTtcbiAgICBzYi5hcHBlbmQoKG5vZGUuc3VjY2VlZGVkID8gQ0hFQ0tfTUFSSyA6IEJBTExPVF9YKSArICcgJyArIG5vZGUuZGlzcGxheVN0cmluZyk7XG4gICAgaWYgKG5vZGUuaXNMZWZ0UmVjdXJzaXZlKSB7XG4gICAgICBzYi5hcHBlbmQoJyAoTFIpJyk7XG4gICAgfVxuICAgIGlmIChub2RlLnN1Y2NlZWRlZCkge1xuICAgICAgdmFyIGNvbnRlbnRzID0gYXNFc2NhcGVkU3RyaW5nKG5vZGUuaW50ZXJ2YWwuY29udGVudHMpO1xuICAgICAgc2IuYXBwZW5kKCcgJyArIFJJR0hUV0FSRFNfRE9VQkxFX0FSUk9XICsgJyAgJyk7XG4gICAgICBzYi5hcHBlbmQodHlwZW9mIGNvbnRlbnRzID09PSAnc3RyaW5nJyA/ICdcIicgKyBjb250ZW50cyArICdcIicgOiBjb250ZW50cyk7XG4gICAgfVxuICAgIHNiLmFwcGVuZCgnXFxuJyk7XG4gIH0pO1xuICByZXR1cm4gc2IuY29udGVudHMoKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ3V0aWwtZXh0ZW5kJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIFN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBIZWxwZXJzXG5cbmZ1bmN0aW9uIHJlcGVhdFN0cihzdHIsIG4pIHtcbiAgcmV0dXJuIG5ldyBBcnJheShuICsgMSkuam9pbihzdHIpO1xufVxuXG52YXIgZXNjYXBlU3RyaW5nRm9yID0ge307XG5mb3IgKHZhciBjID0gMDsgYyA8IDEyODsgYysrKSB7XG4gIGVzY2FwZVN0cmluZ0ZvcltjXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYyk7XG59XG5lc2NhcGVTdHJpbmdGb3JbXCInXCIuY2hhckNvZGVBdCgwKV0gID0gXCJcXFxcJ1wiO1xuZXNjYXBlU3RyaW5nRm9yWydcIicuY2hhckNvZGVBdCgwKV0gID0gJ1xcXFxcIic7XG5lc2NhcGVTdHJpbmdGb3JbJ1xcXFwnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxcXFxcJztcbmVzY2FwZVN0cmluZ0ZvclsnXFxiJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcYic7XG5lc2NhcGVTdHJpbmdGb3JbJ1xcZicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXGYnO1xuZXNjYXBlU3RyaW5nRm9yWydcXG4nLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxuJztcbmVzY2FwZVN0cmluZ0ZvclsnXFxyJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxccic7XG5lc2NhcGVTdHJpbmdGb3JbJ1xcdCcuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHQnO1xuZXNjYXBlU3RyaW5nRm9yWydcXHUwMDBiJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcdic7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLmFic3RyYWN0ID0gZnVuY3Rpb24oKSB7XG4gIHRocm93IG5ldyBFcnJvcigndGhpcyBtZXRob2QgaXMgYWJzdHJhY3QhJyk7XG59O1xuXG4vLyBEZWZpbmUgYSBsYXppbHktY29tcHV0ZWQsIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVkIGBwcm9wTmFtZWBcbi8vIG9uIHRoZSBvYmplY3QgYG9iamAuIGBnZXR0ZXJGbmAgd2lsbCBiZSBjYWxsZWQgdG8gY29tcHV0ZSB0aGUgdmFsdWUgdGhlXG4vLyBmaXJzdCB0aW1lIHRoZSBwcm9wZXJ0eSBpcyBhY2Nlc3NlZC5cbmV4cG9ydHMuZGVmaW5lTGF6eVByb3BlcnR5ID0gZnVuY3Rpb24ob2JqLCBwcm9wTmFtZSwgZ2V0dGVyRm4pIHtcbiAgdmFyIG1lbW87XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3BOYW1lLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghbWVtbykge1xuICAgICAgICBtZW1vID0gZ2V0dGVyRm4uY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH1cbiAgfSk7XG59O1xuXG5leHBvcnRzLmNsb25lID0gZnVuY3Rpb24ob2JqKSB7XG4gIGlmIChvYmopIHtcbiAgICByZXR1cm4gZXh0ZW5kKHt9LCBvYmopO1xuICB9XG4gIHJldHVybiBvYmo7XG59O1xuXG5leHBvcnRzLmV4dGVuZCA9IGV4dGVuZDtcblxuZXhwb3J0cy5yZXBlYXRGbiA9IGZ1bmN0aW9uKGZuLCBuKSB7XG4gIHZhciBhcnIgPSBbXTtcbiAgd2hpbGUgKG4tLSA+IDApIHtcbiAgICBhcnIucHVzaChmbigpKTtcbiAgfVxuICByZXR1cm4gYXJyO1xufTtcblxuZXhwb3J0cy5yZXBlYXQgPSBmdW5jdGlvbih4LCBuKSB7XG4gIHJldHVybiBleHBvcnRzLnJlcGVhdEZuKGZ1bmN0aW9uKCkgeyByZXR1cm4geDsgfSwgbik7XG59O1xuXG5leHBvcnRzLmdldER1cGxpY2F0ZXMgPSBmdW5jdGlvbihhcnJheSkge1xuICB2YXIgZHVwbGljYXRlcyA9IFtdO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcnJheS5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdmFyIHggPSBhcnJheVtpZHhdO1xuICAgIGlmIChhcnJheS5sYXN0SW5kZXhPZih4KSAhPT0gaWR4ICYmIGR1cGxpY2F0ZXMuaW5kZXhPZih4KSA8IDApIHtcbiAgICAgIGR1cGxpY2F0ZXMucHVzaCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGR1cGxpY2F0ZXM7XG59O1xuXG5leHBvcnRzLmZhaWwgPSB7fTtcblxuZXhwb3J0cy5pc1N5bnRhY3RpYyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHZhciBmaXJzdENoYXIgPSBydWxlTmFtZVswXTtcbiAgcmV0dXJuICgnQScgPD0gZmlyc3RDaGFyICYmIGZpcnN0Q2hhciA8PSAnWicpO1xufTtcblxuZXhwb3J0cy5wYWRMZWZ0ID0gZnVuY3Rpb24oc3RyLCBsZW4sIG9wdENoYXIpIHtcbiAgdmFyIGNoID0gb3B0Q2hhciB8fCAnICc7XG4gIGlmIChzdHIubGVuZ3RoIDwgbGVuKSB7XG4gICAgcmV0dXJuIHJlcGVhdFN0cihjaCwgbGVuIC0gc3RyLmxlbmd0aCkgKyBzdHI7XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cbi8vIFN0cmluZ0J1ZmZlclxuXG5leHBvcnRzLlN0cmluZ0J1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnN0cmluZ3MgPSBbXTtcbn07XG5cbmV4cG9ydHMuU3RyaW5nQnVmZmVyLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihzdHIpIHtcbiAgdGhpcy5zdHJpbmdzLnB1c2goc3RyKTtcbn07XG5cbmV4cG9ydHMuU3RyaW5nQnVmZmVyLnByb3RvdHlwZS5jb250ZW50cyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5zdHJpbmdzLmpvaW4oJycpO1xufTtcblxuLy8gQ2hhcmFjdGVyIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nXG5cbmV4cG9ydHMuZXNjYXBlQ2hhciA9IGZ1bmN0aW9uKGMsIG9wdERlbGltKSB7XG4gIHZhciBjaGFyQ29kZSA9IGMuY2hhckNvZGVBdCgwKTtcbiAgaWYgKChjID09PSAnXCInIHx8IGMgPT09IFwiJ1wiKSAmJiBvcHREZWxpbSAmJiBjICE9PSBvcHREZWxpbSkge1xuICAgIHJldHVybiBjO1xuICB9IGVsc2UgaWYgKGNoYXJDb2RlIDwgMTI4KSB7XG4gICAgcmV0dXJuIGVzY2FwZVN0cmluZ0ZvcltjaGFyQ29kZV07XG4gIH0gZWxzZSBpZiAoMTI4IDw9IGNoYXJDb2RlICYmIGNoYXJDb2RlIDwgMjU2KSB7XG4gICAgcmV0dXJuICdcXFxceCcgKyBleHBvcnRzLnBhZExlZnQoY2hhckNvZGUudG9TdHJpbmcoMTYpLCAyLCAnMCcpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnXFxcXHUnICsgZXhwb3J0cy5wYWRMZWZ0KGNoYXJDb2RlLnRvU3RyaW5nKDE2KSwgNCwgJzAnKTtcbiAgfVxufTtcblxuZXhwb3J0cy51bmVzY2FwZUNoYXIgPSBmdW5jdGlvbihzKSB7XG4gIGlmIChzLmNoYXJBdCgwKSA9PT0gJ1xcXFwnKSB7XG4gICAgc3dpdGNoIChzLmNoYXJBdCgxKSkge1xuICAgICAgY2FzZSAnYic6IHJldHVybiAnXFxiJztcbiAgICAgIGNhc2UgJ2YnOiByZXR1cm4gJ1xcZic7XG4gICAgICBjYXNlICduJzogcmV0dXJuICdcXG4nO1xuICAgICAgY2FzZSAncic6IHJldHVybiAnXFxyJztcbiAgICAgIGNhc2UgJ3QnOiByZXR1cm4gJ1xcdCc7XG4gICAgICBjYXNlICd2JzogcmV0dXJuICdcXHYnO1xuICAgICAgY2FzZSAneCc6IHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KHMuc3Vic3RyaW5nKDIsIDQpLCAxNikpO1xuICAgICAgY2FzZSAndSc6IHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KHMuc3Vic3RyaW5nKDIsIDYpLCAxNikpO1xuICAgICAgZGVmYXVsdDogICByZXR1cm4gcy5jaGFyQXQoMSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBzO1xuICB9XG59O1xuXG4vLyBIZWxwZXIgZm9yIHByb2R1Y2luZyBhIGRlc2NyaXB0aW9uIG9mIGFuIHVua25vd24gb2JqZWN0IGluIGEgc2FmZSB3YXkuXG4vLyBFc3BlY2lhbGx5IHVzZWZ1bCBmb3IgZXJyb3IgbWVzc2FnZXMgd2hlcmUgYW4gdW5leHBlY3RlZCB0eXBlIG9mIG9iamVjdCB3YXMgZW5jb3VudGVyZWQuXG5leHBvcnRzLnVuZXhwZWN0ZWRPYmpUb1N0cmluZyA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAob2JqID09IG51bGwpIHtcbiAgICByZXR1cm4gU3RyaW5nKG9iaik7XG4gIH1cbiAgdmFyIGJhc2VUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopO1xuICB0cnkge1xuICAgIHZhciB0eXBlTmFtZTtcbiAgICBpZiAob2JqLmNvbnN0cnVjdG9yICYmIG9iai5jb25zdHJ1Y3Rvci5uYW1lKSB7XG4gICAgICB0eXBlTmFtZSA9IG9iai5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgIH0gZWxzZSBpZiAoYmFzZVRvU3RyaW5nLmluZGV4T2YoJ1tvYmplY3QgJykgPT09IDApIHtcbiAgICAgIHR5cGVOYW1lID0gYmFzZVRvU3RyaW5nLnNsaWNlKDgsIC0xKTsgIC8vIEV4dHJhY3QgZS5nLiBcIkFycmF5XCIgZnJvbSBcIltvYmplY3QgQXJyYXldXCIuXG4gICAgfSBlbHNlIHtcbiAgICAgIHR5cGVOYW1lID0gdHlwZW9mIG9iajtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGVOYW1lICsgJzogJyArIEpTT04uc3RyaW5naWZ5KFN0cmluZyhvYmopKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBiYXNlVG9TdHJpbmc7XG4gIH1cbn07XG5cbi8vIFByZXR0eS1wcmludGluZyBvZiBzdHJpbmdzXG5cbmV4cG9ydHMudG9TdHJpbmdMaXRlcmFsID0gZnVuY3Rpb24oc3RyKSB7XG4gIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBFcnJvcigndG9TdHJpbmdMaXRlcmFsIG9ubHkgd29ya3Mgb24gc3RyaW5ncycpO1xuICB9XG4gIHZhciBoYXNTaW5nbGVRdW90ZXMgPSBzdHIuaW5kZXhPZihcIidcIikgPj0gMDtcbiAgdmFyIGhhc0RvdWJsZVF1b3RlcyA9IHN0ci5pbmRleE9mKCdcIicpID49IDA7XG4gIHZhciBkZWxpbSA9IGhhc1NpbmdsZVF1b3RlcyAmJiAhaGFzRG91YmxlUXVvdGVzID8gJ1wiJyA6IFwiJ1wiO1xuICB2YXIgc2IgPSBuZXcgZXhwb3J0cy5TdHJpbmdCdWZmZXIoKTtcbiAgc2IuYXBwZW5kKGRlbGltKTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgc3RyLmxlbmd0aDsgaWR4KyspIHtcbiAgICBzYi5hcHBlbmQoZXhwb3J0cy5lc2NhcGVDaGFyKHN0cltpZHhdLCBkZWxpbSkpO1xuICB9XG4gIHNiLmFwcGVuZChkZWxpbSk7XG4gIHJldHVybiBzYi5jb250ZW50cygpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIE5hbWVzcGFjZSA9IHJlcXVpcmUoJy4vTmFtZXNwYWNlJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBPaG1FcnJvcigpIHt9XG5PaG1FcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIG1ha2VDdXN0b21FcnJvcihuYW1lLCBpbml0Rm4pIHtcbiAgLy8gTWFrZSBFIHRoaW5rIGl0J3MgcmVhbGx5IGNhbGxlZCBPaG1FcnJvciwgc28gdGhhdCBlcnJvcnMgbG9vayBuaWNlciB3aGVuIHRoZXkncmVcbiAgLy8gY29uc29sZS5sb2cnZWQgaW4gQ2hyb21lLlxuICB2YXIgRSA9IGZ1bmN0aW9uIE9obUVycm9yKCkge1xuICAgIGluaXRGbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIC8vIGBjYXB0dXJlU3RhY2tUcmFjZWAgaXMgVjgtb25seS5cbiAgICBpZiAodHlwZW9mIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnc3RhY2snLCB7Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIGUuc3RhY2s7IH19KTtcbiAgICB9XG4gIH07XG4gIEUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShPaG1FcnJvci5wcm90b3R5cGUpO1xuICBFLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEU7XG4gIEUucHJvdG90eXBlLm5hbWUgPSBuYW1lO1xuICByZXR1cm4gRTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gZXJyb3JzIGFib3V0IGludGVydmFscyAtLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgSW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoID0gbWFrZUN1c3RvbUVycm9yKFxuICAgICdvaG0uZXJyb3IuSW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoJyxcbiAgICBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMubWVzc2FnZSA9IFwiSW50ZXJ2YWwgc291cmNlcyBkb24ndCBtYXRjaFwiO1xuICAgIH1cbik7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIGVycm9ycyBhYm91dCBncmFtbWFycyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBHcmFtbWFyIHN5bnRheCBlcnJvclxuXG52YXIgR3JhbW1hclN5bnRheEVycm9yID0gbWFrZUN1c3RvbUVycm9yKFxuICAgICdvaG0uZXJyb3IuR3JhbW1hclN5bnRheEVycm9yJyxcbiAgICBmdW5jdGlvbihtYXRjaEZhaWx1cmUpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbWVzc2FnZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gJ0ZhaWxlZCB0byBwYXJzZSBncmFtbWFyOlxcbicgKyBtYXRjaEZhaWx1cmUubWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuKTtcblxuLy8gVW5kZWNsYXJlZCBncmFtbWFyXG5cbnZhciBVbmRlY2xhcmVkR3JhbW1hciA9IG1ha2VDdXN0b21FcnJvcihcbiAgICAnb2htLmVycm9yLlVuZGVjbGFyZWRHcmFtbWFyJyxcbiAgICBmdW5jdGlvbihncmFtbWFyTmFtZSwgbmFtZXNwYWNlKSB7XG4gICAgICB0aGlzLmdyYW1tYXJOYW1lID0gZ3JhbW1hck5hbWU7XG4gICAgICB0aGlzLm5hbWVzcGFjZSA9IG5hbWVzcGFjZTtcbiAgICAgIGlmICh0aGlzLm5hbWVzcGFjZSkge1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSAnR3JhbW1hciAnICsgdGhpcy5ncmFtbWFyTmFtZSArXG4gICAgICAgICAgICAnIGlzIG5vdCBkZWNsYXJlZCBpbiBuYW1lc3BhY2UgJyArIE5hbWVzcGFjZS50b1N0cmluZyh0aGlzLm5hbWVzcGFjZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSAnVW5kZWNsYXJlZCBncmFtbWFyICcgKyB0aGlzLmdyYW1tYXJOYW1lO1xuICAgICAgfVxuICAgIH1cbik7XG5cbi8vIER1cGxpY2F0ZSBncmFtbWFyIGRlY2xhcmF0aW9uXG5cbnZhciBEdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24gPSBtYWtlQ3VzdG9tRXJyb3IoXG4gICAgJ29obS5lcnJvci5EdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24nLFxuICAgIGZ1bmN0aW9uKGdyYW1tYXJOYW1lLCBuYW1lc3BhY2UpIHtcbiAgICAgIHRoaXMuZ3JhbW1hck5hbWUgPSBncmFtbWFyTmFtZTtcbiAgICAgIHRoaXMubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuICAgICAgdGhpcy5tZXNzYWdlID0gJ0dyYW1tYXIgJyArIHRoaXMuZ3JhbW1hck5hbWUgK1xuICAgICAgICAgICcgaXMgYWxyZWFkeSBkZWNsYXJlZCBpbiBuYW1lc3BhY2UgJyArIE5hbWVzcGFjZS50b1N0cmluZyh0aGlzLm5hbWVzcGFjZSk7XG4gICAgfVxuKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gcnVsZXMgLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gVW5kZWNsYXJlZCBydWxlXG5cbnZhciBVbmRlY2xhcmVkUnVsZSA9IG1ha2VDdXN0b21FcnJvcihcbiAgICAnb2htLmVycm9yLlVuZGVjbGFyZWRSdWxlJyxcbiAgICBmdW5jdGlvbihydWxlTmFtZSwgZ3JhbW1hck5hbWUpIHtcbiAgICAgIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgICAgIHRoaXMuZ3JhbW1hck5hbWUgPSBncmFtbWFyTmFtZTtcbiAgICAgIHRoaXMubWVzc2FnZSA9ICdSdWxlICcgKyB0aGlzLnJ1bGVOYW1lICsgJyBpcyBub3QgZGVjbGFyZWQgaW4gZ3JhbW1hciAnICsgdGhpcy5ncmFtbWFyTmFtZTtcbiAgICB9XG4pO1xuXG4vLyBDYW5ub3Qgb3ZlcnJpZGUgdW5kZWNsYXJlZCBydWxlXG5cbnZhciBDYW5ub3RPdmVycmlkZVVuZGVjbGFyZWRSdWxlID0gbWFrZUN1c3RvbUVycm9yKFxuICAgICdvaG0uZXJyb3IuQ2Fubm90T3ZlcnJpZGVVbmRlY2xhcmVkUnVsZScsXG4gICAgZnVuY3Rpb24ocnVsZU5hbWUsIGdyYW1tYXJOYW1lKSB7XG4gICAgICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWU7XG4gICAgICB0aGlzLmdyYW1tYXJOYW1lID0gZ3JhbW1hck5hbWU7XG4gICAgICB0aGlzLm1lc3NhZ2UgPVxuICAgICAgICAgICdDYW5ub3Qgb3ZlcnJpZGUgcnVsZSAnICsgdGhpcy5ydWxlTmFtZSArXG4gICAgICAgICAgJyBiZWNhdXNlIGl0IGlzIG5vdCBkZWNsYXJlZCBpbiAnICsgdGhpcy5ncmFtbWFyTmFtZTtcbiAgICB9XG4pO1xuXG4vLyBDYW5ub3QgZXh0ZW5kIHVuZGVjbGFyZWQgcnVsZVxuXG52YXIgQ2Fubm90RXh0ZW5kVW5kZWNsYXJlZFJ1bGUgPSBtYWtlQ3VzdG9tRXJyb3IoXG4gICAgJ29obS5lcnJvci5DYW5ub3RFeHRlbmRVbmRlY2xhcmVkUnVsZScsXG4gICAgZnVuY3Rpb24ocnVsZU5hbWUsIGdyYW1tYXJOYW1lKSB7XG4gICAgICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWU7XG4gICAgICB0aGlzLmdyYW1tYXJOYW1lID0gZ3JhbW1hck5hbWU7XG4gICAgICB0aGlzLm1lc3NhZ2UgPVxuICAgICAgICAgICdDYW5ub3QgZXh0ZW5kIHJ1bGUgJyArIHRoaXMucnVsZU5hbWUgK1xuICAgICAgICAgICcgYmVjYXVzZSBpdCBpcyBub3QgZGVjbGFyZWQgaW4gJyArIHRoaXMuZ3JhbW1hck5hbWU7XG4gICAgfVxuKTtcblxuLy8gRHVwbGljYXRlIHJ1bGUgZGVjbGFyYXRpb25cblxudmFyIER1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbiA9IG1ha2VDdXN0b21FcnJvcihcbiAgICAnb2htLmVycm9yLkR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbicsXG4gICAgZnVuY3Rpb24ocnVsZU5hbWUsIG9mZmVuZGluZ0dyYW1tYXJOYW1lLCBkZWNsR3JhbW1hck5hbWUpIHtcbiAgICAgIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgICAgIHRoaXMub2ZmZW5kaW5nR3JhbW1hck5hbWUgPSBvZmZlbmRpbmdHcmFtbWFyTmFtZTtcbiAgICAgIHRoaXMuZGVjbEdyYW1tYXJOYW1lID0gZGVjbEdyYW1tYXJOYW1lO1xuICAgICAgdGhpcy5tZXNzYWdlID0gXCJEdXBsaWNhdGUgZGVjbGFyYXRpb24gZm9yIHJ1bGUgJ1wiICsgdGhpcy5ydWxlTmFtZSArXG4gICAgICAgICAgICAgICAgICAgICBcIicgaW4gZ3JhbW1hciAnXCIgKyB0aGlzLm9mZmVuZGluZ0dyYW1tYXJOYW1lICsgXCInXCI7XG4gICAgICBpZiAodGhpcy5vZmZlbmRpbmdHcmFtbWFyTmFtZSAhPT0gZGVjbEdyYW1tYXJOYW1lKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZSArPSBcIiAob3JpZ2luYWxseSBkZWNsYXJlZCBpbiBncmFtbWFyICdcIiArIHRoaXMuZGVjbEdyYW1tYXJOYW1lICsgXCInKVwiO1xuICAgICAgfVxuICAgIH1cbik7XG5cbi8vIFdyb25nIG51bWJlciBvZiBwYXJhbWV0ZXJzXG5cbnZhciBXcm9uZ051bWJlck9mUGFyYW1ldGVycyA9IG1ha2VDdXN0b21FcnJvcihcbiAgICAnb2htLmVycm9yLldyb25nTnVtYmVyT2ZQYXJhbWV0ZXJzJyxcbiAgICBmdW5jdGlvbihydWxlTmFtZSwgZXhwZWN0ZWQsIGFjdHVhbCkge1xuICAgICAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lO1xuICAgICAgdGhpcy5leHBlY3RlZCA9IGV4cGVjdGVkO1xuICAgICAgdGhpcy5hY3R1YWwgPSBhY3R1YWw7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSAnV3JvbmcgbnVtYmVyIG9mIHBhcmFtZXRlcnMgZm9yIHJ1bGUgJyArIHRoaXMucnVsZU5hbWUgK1xuICAgICAgICAgICAgICAgICAgICAgJyAoZXhwZWN0ZWQgJyArIHRoaXMuZXhwZWN0ZWQgKyAnLCBnb3QgJyArIHRoaXMuYWN0dWFsICsgJyknO1xuICAgIH1cbik7XG5cbi8vIER1cGxpY2F0ZSBwYXJhbWV0ZXIgbmFtZXNcblxudmFyIER1cGxpY2F0ZVBhcmFtZXRlck5hbWVzID0gbWFrZUN1c3RvbUVycm9yKFxuICAgICdvaG0uZXJyb3IuRHVwbGljYXRlUGFyYW1ldGVyTmFtZXMnLFxuICAgIGZ1bmN0aW9uKHJ1bGVOYW1lLCBkdXBsaWNhdGVzKSB7XG4gICAgICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWU7XG4gICAgICB0aGlzLmR1cGxpY2F0ZXMgPSBkdXBsaWNhdGVzO1xuICAgICAgdGhpcy5tZXNzYWdlID0gJ0R1cGxpY2F0ZSBwYXJhbWV0ZXIgbmFtZXMgaW4gcnVsZSAnICsgdGhpcy5ydWxlTmFtZSArICc6ICcgK1xuICAgICAgICAgICAgICAgICAgICAgdGhpcy5kdXBsaWNhdGVzLmpvaW4oJywnKTtcbiAgICB9XG4pO1xuXG4vLyBJbnZhbGlkIHBhcmFtZXRlciBleHByZXNzaW9uXG5cbnZhciBJbnZhbGlkUGFyYW1ldGVyID0gbWFrZUN1c3RvbUVycm9yKFxuICAgICdvaG0uZXJyb3IuSW52YWxpZFBhcmFtZXRlcicsXG4gICAgZnVuY3Rpb24ocnVsZU5hbWUsIGV4cHIpIHtcbiAgICAgIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgICAgIHRoaXMuZXhwciA9IGV4cHI7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSAnSW52YWxpZCBwYXJhbWV0ZXIgdG8gcnVsZSAnICsgdGhpcy5ydWxlTmFtZSArICc6ICcgKyB0aGlzLmV4cHIgK1xuICAgICAgICAgICAgICAgICAgICAgJyBoYXMgYXJpdHkgJyArIHRoaXMuZXhwci5nZXRBcml0eSgpICsgJywgYnV0IHBhcmFtZXRlciBleHByZXNzaW9ucyAnICtcbiAgICAgICAgICAgICAgICAgICAgICdtdXN0IGhhdmUgYXJpdHkgMSc7XG4gICAgfVxuKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gS2xlZW5lIG9wZXJhdG9ycyAtLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgS2xlZW5lRXhwckhhc051bGxhYmxlT3BlcmFuZCA9IG1ha2VDdXN0b21FcnJvcihcbiAgICAnb2htLmVycm9yLktsZWVuZUV4cHJIYXNOdWxsYWJsZU9wZXJhbmQnLFxuICAgIGZ1bmN0aW9uKGtsZWVuZUV4cHIpIHtcbiAgICAgIHRoaXMuZXhwciA9IGtsZWVuZUV4cHI7XG5cbiAgICAgIHZhciBvcGVyYXRvciA9IGtsZWVuZUV4cHIub3BlcmF0b3I7XG4gICAgICB2YXIgbnVsbGFibGVFeHByID0ga2xlZW5lRXhwci5leHByO1xuICAgICAgdGhpcy5tZXNzYWdlID0gbnVsbGFibGVFeHByLmludGVydmFsLmdldExpbmVBbmRDb2x1bW5NZXNzYWdlKCkgK1xuICAgICAgICAgICAgICAgICAgICAgJ051bGxhYmxlIGV4cHJlc3Npb24gJyArIG51bGxhYmxlRXhwci5pbnRlcnZhbC5jb250ZW50cyArXG4gICAgICAgICAgICAgICAgICAgICBcIiBpcyBub3QgYWxsb3dlZCBpbnNpZGUgJ1wiICsgb3BlcmF0b3IgKyBcIicgKHBvc3NpYmxlIGluZmluaXRlIGxvb3ApXCI7XG4gICAgfVxuKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gYXJpdHkgLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIEluY29uc2lzdGVudEFyaXR5ID0gbWFrZUN1c3RvbUVycm9yKFxuICAgICdvaG0uZXJyb3IuSW5jb25zaXN0ZW50QXJpdHknLFxuICAgIGZ1bmN0aW9uKHJ1bGVOYW1lLCBleHBlY3RlZCwgYWN0dWFsKSB7XG4gICAgICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWU7XG4gICAgICB0aGlzLmV4cGVjdGVkID0gZXhwZWN0ZWQ7XG4gICAgICB0aGlzLmFjdHVhbCA9IGFjdHVhbDtcbiAgICAgIHRoaXMubWVzc2FnZSA9XG4gICAgICAgICAgJ1J1bGUgJyArIHRoaXMucnVsZU5hbWUgKyAnIGludm9sdmVzIGFuIGFsdGVybmF0aW9uIHdoaWNoIGhhcyBpbmNvbnNpc3RlbnQgYXJpdHkgJyArXG4gICAgICAgICAgJyhleHBlY3RlZCAnICsgdGhpcy5leHBlY3RlZCArICcsIGdvdCAnICsgdGhpcy5hY3R1YWwgKyAnKSc7XG4gICAgfVxuKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gcHJvcGVydGllcyAtLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgRHVwbGljYXRlUHJvcGVydHlOYW1lcyA9IG1ha2VDdXN0b21FcnJvcihcbiAgICAnb2htLmVycm9yLkR1cGxpY2F0ZVByb3BlcnR5TmFtZXMnLFxuICAgIGZ1bmN0aW9uKGR1cGxpY2F0ZXMpIHtcbiAgICAgIHRoaXMuZHVwbGljYXRlcyA9IGR1cGxpY2F0ZXM7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSAnT2JqZWN0IHBhdHRlcm4gaGFzIGR1cGxpY2F0ZSBwcm9wZXJ0eSBuYW1lczogJyArIHRoaXMuZHVwbGljYXRlcy5qb2luKCcsICcpO1xuICAgIH1cbik7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIGNvbnN0cnVjdG9ycyAtLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgSW52YWxpZENvbnN0cnVjdG9yQ2FsbCA9IG1ha2VDdXN0b21FcnJvcihcbiAgICAnb2htLmVycm9yLkludmFsaWRDb25zdHJ1Y3RvckNhbGwnLFxuICAgIGZ1bmN0aW9uKGdyYW1tYXIsIGN0b3JOYW1lLCBjaGlsZHJlbikge1xuICAgICAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hcjtcbiAgICAgIHRoaXMuY3Rvck5hbWUgPSBjdG9yTmFtZTtcbiAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgIHRoaXMubWVzc2FnZSA9ICdBdHRlbXB0IHRvIGludm9rZSBjb25zdHJ1Y3RvciAnICsgdGhpcy5jdG9yTmFtZSArXG4gICAgICAgICAgICAgICAgICAgICAnIHdpdGggaW52YWxpZCBvciB1bmV4cGVjdGVkIGFyZ3VtZW50cyc7XG4gICAgfVxuKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gY29udmVuaWVuY2UgLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIE11bHRpcGxlRXJyb3JzID0gbWFrZUN1c3RvbUVycm9yKFxuICAgICdvaG0uZXJyb3IuTXVsdGlwbGVFcnJvcnMnLFxuICAgIGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgdGhpcy5lcnJvcnMgPSBlcnJvcnM7XG4gICAgICB2YXIgbWVzc2FnZXMgPSBlcnJvcnMubWFwKGZ1bmN0aW9uKGUpIHsgcmV0dXJuIGUubWVzc2FnZTsgfSk7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSBbJ0Vycm9yczonXS5jb25jYXQobWVzc2FnZXMpLmpvaW4oJ1xcbi0gJyk7XG4gICAgfVxuKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDYW5ub3RFeHRlbmRVbmRlY2xhcmVkUnVsZTogQ2Fubm90RXh0ZW5kVW5kZWNsYXJlZFJ1bGUsXG4gIENhbm5vdE92ZXJyaWRlVW5kZWNsYXJlZFJ1bGU6IENhbm5vdE92ZXJyaWRlVW5kZWNsYXJlZFJ1bGUsXG4gIER1cGxpY2F0ZUdyYW1tYXJEZWNsYXJhdGlvbjogRHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uLFxuICBEdXBsaWNhdGVQYXJhbWV0ZXJOYW1lczogRHVwbGljYXRlUGFyYW1ldGVyTmFtZXMsXG4gIER1cGxpY2F0ZVByb3BlcnR5TmFtZXM6IER1cGxpY2F0ZVByb3BlcnR5TmFtZXMsXG4gIER1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbjogRHVwbGljYXRlUnVsZURlY2xhcmF0aW9uLFxuICBFcnJvcjogT2htRXJyb3IsXG4gIEluY29uc2lzdGVudEFyaXR5OiBJbmNvbnNpc3RlbnRBcml0eSxcbiAgSW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoOiBJbnRlcnZhbFNvdXJjZXNEb250TWF0Y2gsXG4gIEludmFsaWRDb25zdHJ1Y3RvckNhbGw6IEludmFsaWRDb25zdHJ1Y3RvckNhbGwsXG4gIEludmFsaWRQYXJhbWV0ZXI6IEludmFsaWRQYXJhbWV0ZXIsXG4gIEdyYW1tYXJTeW50YXhFcnJvcjogR3JhbW1hclN5bnRheEVycm9yLFxuICBLbGVlbmVFeHBySGFzTnVsbGFibGVPcGVyYW5kOiBLbGVlbmVFeHBySGFzTnVsbGFibGVPcGVyYW5kLFxuICBNdWx0aXBsZUVycm9yczogTXVsdGlwbGVFcnJvcnMsXG4gIFVuZGVjbGFyZWRHcmFtbWFyOiBVbmRlY2xhcmVkR3JhbW1hcixcbiAgVW5kZWNsYXJlZFJ1bGU6IFVuZGVjbGFyZWRSdWxlLFxuICBXcm9uZ051bWJlck9mUGFyYW1ldGVyczogV3JvbmdOdW1iZXJPZlBhcmFtZXRlcnMsXG5cbiAgdGhyb3dFcnJvcnM6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgIGlmIChlcnJvcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICB0aHJvdyBlcnJvcnNbMF07XG4gICAgfVxuICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMSkge1xuICAgICAgdGhyb3cgbmV3IE11bHRpcGxlRXJyb3JzKGVycm9ycyk7XG4gICAgfVxuICB9XG59O1xuIiwiKGZ1bmN0aW9uIChCdWZmZXIpe1xuLyogZ2xvYmFsIGRvY3VtZW50LCBCdWZmZXIsIFhNTEh0dHBSZXF1ZXN0ICovXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBCdWlsZGVyID0gcmVxdWlyZSgnLi9CdWlsZGVyJyk7XG52YXIgR3JhbW1hciA9IHJlcXVpcmUoJy4vR3JhbW1hcicpO1xudmFyIE5hbWVzcGFjZSA9IHJlcXVpcmUoJy4vTmFtZXNwYWNlJyk7XG52YXIgU2VtYW50aWNzID0gcmVxdWlyZSgnLi9TZW1hbnRpY3MnKTtcbnZhciBVbmljb2RlQ2F0ZWdvcmllcyA9IHJlcXVpcmUoJy4uL3RoaXJkX3BhcnR5L3VuaWNvZGUnKS5Vbmljb2RlQ2F0ZWdvcmllcztcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gVGhlIG1ldGFncmFtbWFyLCBpLmUuIHRoZSBncmFtbWFyIGZvciBPaG0gZ3JhbW1hcnMuIEluaXRpYWxpemVkIGF0IHRoZVxuLy8gYm90dG9tIG9mIHRoaXMgZmlsZSBiZWNhdXNlIGxvYWRpbmcgdGhlIGdyYW1tYXIgcmVxdWlyZXMgT2htIGl0c2VsZi5cbnZhciBvaG1HcmFtbWFyO1xuXG4vLyBBbiBvYmplY3Qgd2hpY2ggbWFrZXMgaXQgcG9zc2libGUgdG8gc3R1YiBvdXQgdGhlIGRvY3VtZW50IEFQSSBmb3IgdGVzdGluZy5cbnZhciBkb2N1bWVudEludGVyZmFjZSA9IHtcbiAgcXVlcnlTZWxlY3RvcjogZnVuY3Rpb24oc2VsKSB7IHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbCk7IH0sXG4gIHF1ZXJ5U2VsZWN0b3JBbGw6IGZ1bmN0aW9uKHNlbCkgeyByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpOyB9XG59O1xuXG4vLyBDaGVjayBpZiBgb2JqYCBpcyBhIERPTSBlbGVtZW50LlxuZnVuY3Rpb24gaXNFbGVtZW50KG9iaikge1xuICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKG9iaikge1xuICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG59XG5cbnZhciBNQVhfQVJSQVlfSU5ERVggPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuXG5mdW5jdGlvbiBpc0FycmF5TGlrZShvYmopIHtcbiAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsZW5ndGggPSBvYmoubGVuZ3RoO1xuICByZXR1cm4gdHlwZW9mIGxlbmd0aCA9PT0gJ251bWJlcicgJiYgbGVuZ3RoID49IDAgJiYgbGVuZ3RoIDw9IE1BWF9BUlJBWV9JTkRFWDtcbn1cblxuLy8gVE9ETzoganVzdCB1c2UgdGhlIGpRdWVyeSB0aGluZ1xuZnVuY3Rpb24gbG9hZCh1cmwpIHtcbiAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICByZXEub3BlbignR0VUJywgdXJsLCBmYWxzZSk7XG4gIHRyeSB7XG4gICAgcmVxLnNlbmQoKTtcbiAgICBpZiAocmVxLnN0YXR1cyA9PT0gMCB8fCByZXEuc3RhdHVzID09PSAyMDApIHtcbiAgICAgIHJldHVybiByZXEucmVzcG9uc2VUZXh0O1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge31cbiAgdGhyb3cgbmV3IEVycm9yKCd1bmFibGUgdG8gbG9hZCB1cmwgJyArIHVybCk7XG59XG5cbi8vIFJldHVybnMgYSBHcmFtbWFyIGluc3RhbmNlIChpLmUuLCBhbiBvYmplY3Qgd2l0aCBhIGBtYXRjaGAgbWV0aG9kKSBmb3Jcbi8vIGB0cmVlYCwgd2hpY2ggaXMgdGhlIGNvbmNyZXRlIHN5bnRheCB0cmVlIG9mIGEgdXNlci13cml0dGVuIGdyYW1tYXIuXG4vLyBUaGUgZ3JhbW1hciB3aWxsIGJlIGFzc2lnbmVkIGludG8gYG5hbWVzcGFjZWAgdW5kZXIgdGhlIG5hbWUgb2YgdGhlIGdyYW1tYXJcbi8vIGFzIHNwZWNpZmllZCBpbiB0aGUgc291cmNlLlxuZnVuY3Rpb24gYnVpbGRHcmFtbWFyKG1hdGNoLCBuYW1lc3BhY2UsIG9wdE9obUdyYW1tYXJGb3JUZXN0aW5nKSB7XG4gIHZhciBidWlsZGVyO1xuICB2YXIgZGVjbDtcbiAgdmFyIGN1cnJlbnRSdWxlTmFtZTtcbiAgdmFyIGN1cnJlbnRSdWxlRm9ybWFscztcbiAgdmFyIG92ZXJyaWRpbmcgPSBmYWxzZTtcbiAgdmFyIG1ldGFHcmFtbWFyID0gb3B0T2htR3JhbW1hckZvclRlc3RpbmcgfHwgb2htR3JhbW1hcjtcblxuICAvLyBBIHZpc2l0b3IgdGhhdCBwcm9kdWNlcyBhIEdyYW1tYXIgaW5zdGFuY2UgZnJvbSB0aGUgQ1NULlxuICB2YXIgaGVscGVycyA9IG1ldGFHcmFtbWFyLnNlbWFudGljcygpLmFkZE9wZXJhdGlvbigndmlzaXQnLCB7XG4gICAgR3JhbW1hcjogZnVuY3Rpb24obiwgcywgb3BlbiwgcnMsIGNsb3NlKSB7XG4gICAgICBidWlsZGVyID0gbmV3IEJ1aWxkZXIoKTtcbiAgICAgIHZhciBncmFtbWFyTmFtZSA9IG4udmlzaXQoKTtcbiAgICAgIGRlY2wgPSBidWlsZGVyLm5ld0dyYW1tYXIoZ3JhbW1hck5hbWUsIG5hbWVzcGFjZSk7XG4gICAgICBzLnZpc2l0KCk7XG4gICAgICBycy52aXNpdCgpO1xuICAgICAgdmFyIGcgPSBkZWNsLmJ1aWxkKCk7XG4gICAgICBpZiAoZ3JhbW1hck5hbWUgaW4gbmFtZXNwYWNlKSB7XG4gICAgICAgIHRocm93IG5ldyBlcnJvcnMuRHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uKGdyYW1tYXJOYW1lLCBuYW1lc3BhY2UpO1xuICAgICAgfVxuICAgICAgZy5kZWZpbml0aW9uSW50ZXJ2YWwgPSB0aGlzLmludGVydmFsLnRyaW1tZWQoKTtcbiAgICAgIG5hbWVzcGFjZVtncmFtbWFyTmFtZV0gPSBnO1xuICAgICAgcmV0dXJuIGc7XG4gICAgfSxcblxuICAgIFN1cGVyR3JhbW1hcjogZnVuY3Rpb24oXywgbikge1xuICAgICAgdmFyIHN1cGVyR3JhbW1hck5hbWUgPSBuLnZpc2l0KCk7XG4gICAgICBpZiAoc3VwZXJHcmFtbWFyTmFtZSA9PT0gJ251bGwnKSB7XG4gICAgICAgIGRlY2wud2l0aFN1cGVyR3JhbW1hcihudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghbmFtZXNwYWNlIHx8ICEoc3VwZXJHcmFtbWFyTmFtZSBpbiBuYW1lc3BhY2UpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IGVycm9ycy5VbmRlY2xhcmVkR3JhbW1hcihzdXBlckdyYW1tYXJOYW1lLCBuYW1lc3BhY2UpO1xuICAgICAgICB9XG4gICAgICAgIGRlY2wud2l0aFN1cGVyR3JhbW1hcihuYW1lc3BhY2Vbc3VwZXJHcmFtbWFyTmFtZV0pO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBSdWxlX2RlZmluZTogZnVuY3Rpb24obiwgZnMsIGQsIF8sIGIpIHtcbiAgICAgIGN1cnJlbnRSdWxlTmFtZSA9IG4udmlzaXQoKTtcbiAgICAgIGN1cnJlbnRSdWxlRm9ybWFscyA9IGZzLnZpc2l0KClbMF0gfHwgW107XG4gICAgICAvLyBJZiB0aGVyZSBpcyBubyBkZWZhdWx0IHN0YXJ0IHJ1bGUgeWV0LCBzZXQgaXQgbm93LiBUaGlzIG11c3QgYmUgZG9uZSBiZWZvcmUgdmlzaXRpbmdcbiAgICAgIC8vIHRoZSBib2R5LCBiZWNhdXNlIGl0IG1pZ2h0IGNvbnRhaW4gYW4gaW5saW5lIHJ1bGUgZGVmaW5pdGlvbi5cbiAgICAgIGlmICghZGVjbC5kZWZhdWx0U3RhcnRSdWxlICYmIGRlY2wuZW5zdXJlU3VwZXJHcmFtbWFyKCkgIT09IEdyYW1tYXIuUHJvdG9CdWlsdEluUnVsZXMpIHtcbiAgICAgICAgZGVjbC53aXRoRGVmYXVsdFN0YXJ0UnVsZShjdXJyZW50UnVsZU5hbWUpO1xuICAgICAgfVxuICAgICAgdmFyIGJvZHkgPSBiLnZpc2l0KCk7XG4gICAgICBib2R5LmRlZmluaXRpb25JbnRlcnZhbCA9IHRoaXMuaW50ZXJ2YWwudHJpbW1lZCgpO1xuICAgICAgdmFyIGRlc2NyaXB0aW9uID0gZC52aXNpdCgpWzBdO1xuICAgICAgcmV0dXJuIGRlY2wuZGVmaW5lKGN1cnJlbnRSdWxlTmFtZSwgY3VycmVudFJ1bGVGb3JtYWxzLCBib2R5LCBkZXNjcmlwdGlvbik7XG4gICAgfSxcbiAgICBSdWxlX292ZXJyaWRlOiBmdW5jdGlvbihuLCBmcywgXywgYikge1xuICAgICAgY3VycmVudFJ1bGVOYW1lID0gbi52aXNpdCgpO1xuICAgICAgY3VycmVudFJ1bGVGb3JtYWxzID0gZnMudmlzaXQoKVswXSB8fCBbXTtcbiAgICAgIG92ZXJyaWRpbmcgPSB0cnVlO1xuICAgICAgdmFyIGJvZHkgPSBiLnZpc2l0KCk7XG4gICAgICBib2R5LmRlZmluaXRpb25JbnRlcnZhbCA9IHRoaXMuaW50ZXJ2YWwudHJpbW1lZCgpO1xuICAgICAgdmFyIGFucyA9IGRlY2wub3ZlcnJpZGUoY3VycmVudFJ1bGVOYW1lLCBjdXJyZW50UnVsZUZvcm1hbHMsIGJvZHkpO1xuICAgICAgb3ZlcnJpZGluZyA9IGZhbHNlO1xuICAgICAgcmV0dXJuIGFucztcbiAgICB9LFxuICAgIFJ1bGVfZXh0ZW5kOiBmdW5jdGlvbihuLCBmcywgXywgYikge1xuICAgICAgY3VycmVudFJ1bGVOYW1lID0gbi52aXNpdCgpO1xuICAgICAgY3VycmVudFJ1bGVGb3JtYWxzID0gZnMudmlzaXQoKVswXSB8fCBbXTtcbiAgICAgIHZhciBib2R5ID0gYi52aXNpdCgpO1xuICAgICAgdmFyIGFucyA9IGRlY2wuZXh0ZW5kKGN1cnJlbnRSdWxlTmFtZSwgY3VycmVudFJ1bGVGb3JtYWxzLCBib2R5KTtcbiAgICAgIGRlY2wucnVsZURpY3RbY3VycmVudFJ1bGVOYW1lXS5kZWZpbml0aW9uSW50ZXJ2YWwgPSB0aGlzLmludGVydmFsLnRyaW1tZWQoKTtcbiAgICAgIHJldHVybiBhbnM7XG4gICAgfSxcblxuICAgIEZvcm1hbHM6IGZ1bmN0aW9uKG9wb2ludHksIGZzLCBjcG9pbnR5KSB7XG4gICAgICByZXR1cm4gZnMudmlzaXQoKTtcbiAgICB9LFxuXG4gICAgUGFyYW1zOiBmdW5jdGlvbihvcG9pbnR5LCBwcywgY3BvaW50eSkge1xuICAgICAgcmV0dXJuIHBzLnZpc2l0KCk7XG4gICAgfSxcblxuICAgIEFsdDogZnVuY3Rpb24odGVybSwgXywgdGVybXMpIHtcbiAgICAgIHZhciBhcmdzID0gW3Rlcm0udmlzaXQoKV0uY29uY2F0KHRlcm1zLnZpc2l0KCkpO1xuICAgICAgcmV0dXJuIGJ1aWxkZXIuYWx0LmFwcGx5KGJ1aWxkZXIsIGFyZ3MpLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuXG4gICAgVGVybV9pbmxpbmU6IGZ1bmN0aW9uKGIsIG4pIHtcbiAgICAgIHZhciBpbmxpbmVSdWxlTmFtZSA9IGN1cnJlbnRSdWxlTmFtZSArICdfJyArIG4udmlzaXQoKTtcbiAgICAgIHZhciBib2R5ID0gYi52aXNpdCgpO1xuICAgICAgYm9keS5kZWZpbml0aW9uSW50ZXJ2YWwgPSB0aGlzLmludGVydmFsLnRyaW1tZWQoKTtcbiAgICAgIHZhciBpc05ld1J1bGVEZWNsYXJhdGlvbiA9ICEoZGVjbC5zdXBlckdyYW1tYXIgJiYgZGVjbC5zdXBlckdyYW1tYXIucnVsZURpY3RbaW5saW5lUnVsZU5hbWVdKTtcbiAgICAgIGlmIChvdmVycmlkaW5nICYmICFpc05ld1J1bGVEZWNsYXJhdGlvbikge1xuICAgICAgICBkZWNsLm92ZXJyaWRlKGlubGluZVJ1bGVOYW1lLCBjdXJyZW50UnVsZUZvcm1hbHMsIGJvZHkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVjbC5kZWZpbmUoaW5saW5lUnVsZU5hbWUsIGN1cnJlbnRSdWxlRm9ybWFscywgYm9keSk7XG4gICAgICB9XG4gICAgICB2YXIgcGFyYW1zID0gY3VycmVudFJ1bGVGb3JtYWxzLm1hcChmdW5jdGlvbihmb3JtYWwpIHsgcmV0dXJuIGJ1aWxkZXIuYXBwKGZvcm1hbCk7IH0pO1xuICAgICAgcmV0dXJuIGJ1aWxkZXIuYXBwKGlubGluZVJ1bGVOYW1lLCBwYXJhbXMpLndpdGhJbnRlcnZhbChib2R5LmludGVydmFsKTtcbiAgICB9LFxuXG4gICAgU2VxOiBmdW5jdGlvbihleHByKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5zZXEuYXBwbHkoYnVpbGRlciwgZXhwci52aXNpdCgpKS53aXRoSW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfSxcblxuICAgIEl0ZXJfc3RhcjogZnVuY3Rpb24oeCwgXykge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIuc3Rhcih4LnZpc2l0KCkpLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuICAgIEl0ZXJfcGx1czogZnVuY3Rpb24oeCwgXykge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIucGx1cyh4LnZpc2l0KCkpLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuICAgIEl0ZXJfb3B0OiBmdW5jdGlvbih4LCBfKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5vcHQoeC52aXNpdCgpKS53aXRoSW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfSxcblxuICAgIFByZWRfbm90OiBmdW5jdGlvbihfLCB4KSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5ub3QoeC52aXNpdCgpKS53aXRoSW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfSxcbiAgICBQcmVkX2xvb2thaGVhZDogZnVuY3Rpb24oXywgeCkge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIubGEoeC52aXNpdCgpKS53aXRoSW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfSxcblxuICAgIEJhc2VfYXBwbGljYXRpb246IGZ1bmN0aW9uKHJ1bGUsIHBzKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5hcHAocnVsZS52aXNpdCgpLCBwcy52aXNpdCgpWzBdIHx8IFtdKS53aXRoSW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfSxcbiAgICBCYXNlX3ByaW06IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICAgIHJldHVybiBidWlsZGVyLnByaW0oZXhwci52aXNpdCgpKS53aXRoSW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfSxcbiAgICBCYXNlX3BhcmVuOiBmdW5jdGlvbihvcGVuLCB4LCBjbG9zZSkge1xuICAgICAgcmV0dXJuIHgudmlzaXQoKTtcbiAgICB9LFxuICAgIEJhc2VfYXJyOiBmdW5jdGlvbihvcGVuLCB4LCBjbG9zZSkge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIuYXJyKHgudmlzaXQoKSkud2l0aEludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH0sXG4gICAgQmFzZV9zdHI6IGZ1bmN0aW9uKG9wZW4sIHgsIGNsb3NlKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5zdHIoeC52aXNpdCgpKTtcbiAgICB9LFxuICAgIEJhc2Vfb2JqOiBmdW5jdGlvbihvcGVuLCBsZW5pZW50LCBjbG9zZSkge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIub2JqKFtdLCBsZW5pZW50LnZpc2l0KClbMF0pO1xuICAgIH0sXG5cbiAgICBCYXNlX29ialdpdGhQcm9wczogZnVuY3Rpb24ob3BlbiwgcHMsIF8sIGxlbmllbnQsIGNsb3NlKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5vYmoocHMudmlzaXQoKSwgbGVuaWVudC52aXNpdCgpWzBdKS53aXRoSW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfSxcblxuICAgIFByb3BzOiBmdW5jdGlvbihwLCBfLCBwcykge1xuICAgICAgcmV0dXJuIFtwLnZpc2l0KCldLmNvbmNhdChwcy52aXNpdCgpKTtcbiAgICB9LFxuICAgIFByb3A6IGZ1bmN0aW9uKG4sIF8sIHApIHtcbiAgICAgIHJldHVybiB7bmFtZTogbi52aXNpdCgpLCBwYXR0ZXJuOiBwLnZpc2l0KCl9O1xuICAgIH0sXG5cbiAgICBydWxlRGVzY3I6IGZ1bmN0aW9uKG9wZW4sIHQsIGNsb3NlKSB7XG4gICAgICByZXR1cm4gdC52aXNpdCgpO1xuICAgIH0sXG4gICAgcnVsZURlc2NyVGV4dDogZnVuY3Rpb24oXykge1xuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJ2YWwuY29udGVudHMudHJpbSgpO1xuICAgIH0sXG5cbiAgICBjYXNlTmFtZTogZnVuY3Rpb24oXywgc3BhY2UxLCBuLCBzcGFjZTIsIGVuZCkge1xuICAgICAgcmV0dXJuIG4udmlzaXQoKTtcbiAgICB9LFxuXG4gICAgbmFtZTogZnVuY3Rpb24oZmlyc3QsIHJlc3QpIHtcbiAgICAgIHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzO1xuICAgIH0sXG4gICAgbmFtZUZpcnN0OiBmdW5jdGlvbihleHByKSB7fSxcbiAgICBuYW1lUmVzdDogZnVuY3Rpb24oZXhwcikge30sXG5cbiAgICBrZXl3b3JkX251bGw6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAga2V5d29yZF90cnVlOiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGtleXdvcmRfZmFsc2U6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgc3RyaW5nOiBmdW5jdGlvbihvcGVuLCBjcywgY2xvc2UpIHtcbiAgICAgIHJldHVybiBjcy52aXNpdCgpLm1hcChmdW5jdGlvbihjKSB7IHJldHVybiBjb21tb24udW5lc2NhcGVDaGFyKGMpOyB9KS5qb2luKCcnKTtcbiAgICB9LFxuXG4gICAgc3RyQ2hhcjogZnVuY3Rpb24oXykge1xuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJ2YWwuY29udGVudHM7XG4gICAgfSxcblxuICAgIGVzY2FwZUNoYXI6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzO1xuICAgIH0sXG5cbiAgICByZWdFeHA6IGZ1bmN0aW9uKG9wZW4sIGUsIGNsb3NlKSB7XG4gICAgICByZXR1cm4gZS52aXNpdCgpO1xuICAgIH0sXG5cbiAgICByZUNoYXJDbGFzc191bmljb2RlOiBmdW5jdGlvbihvcGVuLCB1bmljb2RlQ2xhc3MsIGNsb3NlKSB7XG4gICAgICByZXR1cm4gVW5pY29kZUNhdGVnb3JpZXNbdW5pY29kZUNsYXNzLnZpc2l0KCkuam9pbignJyldO1xuICAgIH0sXG4gICAgcmVDaGFyQ2xhc3Nfb3JkaW5hcnk6IGZ1bmN0aW9uKG9wZW4sIF8sIGNsb3NlKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cCh0aGlzLmludGVydmFsLmNvbnRlbnRzKTtcbiAgICB9LFxuXG4gICAgbnVtYmVyOiBmdW5jdGlvbihfLCBkaWdpdHMpIHtcbiAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLmludGVydmFsLmNvbnRlbnRzKTtcbiAgICB9LFxuXG4gICAgc3BhY2U6IGZ1bmN0aW9uKGV4cHIpIHt9LFxuICAgIHNwYWNlX211bHRpTGluZTogZnVuY3Rpb24oc3RhcnQsIF8sIGVuZCkge30sXG4gICAgc3BhY2Vfc2luZ2xlTGluZTogZnVuY3Rpb24oc3RhcnQsIF8sIGVuZCkge30sXG5cbiAgICBMaXN0T2Zfc29tZTogZnVuY3Rpb24oeCwgXywgeHMpIHtcbiAgICAgIHJldHVybiBbeC52aXNpdCgpXS5jb25jYXQoeHMudmlzaXQoKSk7XG4gICAgfSxcbiAgICBMaXN0T2Zfbm9uZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSxcblxuICAgIF90ZXJtaW5hbDogU2VtYW50aWNzLmFjdGlvbnMuZ2V0UHJpbWl0aXZlVmFsdWUsXG4gICAgX2RlZmF1bHQ6IFNlbWFudGljcy5hY3Rpb25zLnBhc3NUaHJvdWdoXG4gIH0pO1xuICByZXR1cm4gaGVscGVycyhtYXRjaCkudmlzaXQoKTtcbn1cblxuZnVuY3Rpb24gY29tcGlsZUFuZExvYWQoc291cmNlLCBuYW1lc3BhY2UpIHtcbiAgdmFyIG0gPSBvaG1HcmFtbWFyLm1hdGNoKHNvdXJjZSwgJ0dyYW1tYXJzJyk7XG4gIGlmIChtLmZhaWxlZCgpKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5HcmFtbWFyU3ludGF4RXJyb3IobSk7XG4gIH1cbiAgcmV0dXJuIGJ1aWxkR3JhbW1hcihtLCBuYW1lc3BhY2UpO1xufVxuXG4vLyBSZXR1cm4gdGhlIGNvbnRlbnRzIG9mIGEgc2NyaXB0IGVsZW1lbnQsIGZldGNoaW5nIGl0IHZpYSBYSFIgaWYgbmVjZXNzYXJ5LlxuZnVuY3Rpb24gZ2V0U2NyaXB0RWxlbWVudENvbnRlbnRzKGVsKSB7XG4gIGlmICghaXNFbGVtZW50KGVsKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgRE9NIE5vZGUsIGdvdCAnICsgY29tbW9uLnVuZXhwZWN0ZWRPYmpUb1N0cmluZyhlbCkpO1xuICB9XG4gIGlmIChlbC50eXBlICE9PSAndGV4dC9vaG0tanMnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBhIHNjcmlwdCB0YWcgd2l0aCB0eXBlPVwidGV4dC9vaG0tanNcIiwgZ290ICcgKyBlbCk7XG4gIH1cbiAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSgnc3JjJykgPyBsb2FkKGVsLmdldEF0dHJpYnV0ZSgnc3JjJykpIDogZWwuaW5uZXJIVE1MO1xufVxuXG5mdW5jdGlvbiBncmFtbWFyKHNvdXJjZSwgb3B0TmFtZXNwYWNlKSB7XG4gIHZhciBucyA9IGdyYW1tYXJzKHNvdXJjZSwgb3B0TmFtZXNwYWNlKTtcblxuICAvLyBFbnN1cmUgdGhhdCB0aGUgc291cmNlIGNvbnRhaW5lZCBubyBtb3JlIHRoYW4gb25lIGdyYW1tYXIgZGVmaW5pdGlvbi5cbiAgdmFyIGdyYW1tYXJOYW1lcyA9IE9iamVjdC5rZXlzKG5zKTtcbiAgaWYgKGdyYW1tYXJOYW1lcy5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgZ3JhbW1hciBkZWZpbml0aW9uJyk7XG4gIH0gZWxzZSBpZiAoZ3JhbW1hck5hbWVzLmxlbmd0aCA+IDEpIHtcbiAgICB2YXIgc2Vjb25kR3JhbW1hciA9IG5zW2dyYW1tYXJOYW1lc1sxXV07XG4gICAgdmFyIGludGVydmFsID0gc2Vjb25kR3JhbW1hci5kZWZpbml0aW9uSW50ZXJ2YWw7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICB1dGlsLmdldExpbmVBbmRDb2x1bW5NZXNzYWdlKGludGVydmFsLmlucHV0U3RyZWFtLnNvdXJjZSwgaW50ZXJ2YWwuc3RhcnRJZHgpICtcbiAgICAgICAgJ0ZvdW5kIG1vcmUgdGhhbiBvbmUgZ3JhbW1hciBkZWZpbml0aW9uIC0tIHVzZSBvaG0uZ3JhbW1hcnMoKSBpbnN0ZWFkLicpO1xuICB9XG4gIHJldHVybiBuc1tncmFtbWFyTmFtZXNbMF1dOyAgLy8gUmV0dXJuIHRoZSBvbmUgYW5kIG9ubHkgZ3JhbW1hci5cbn1cblxuZnVuY3Rpb24gZ3JhbW1hcnMoc291cmNlLCBvcHROYW1lc3BhY2UpIHtcbiAgdmFyIG5zID0gTmFtZXNwYWNlLmV4dGVuZChOYW1lc3BhY2UuYXNOYW1lc3BhY2Uob3B0TmFtZXNwYWNlKSk7XG4gIGlmICh0eXBlb2Ygc291cmNlICE9PSAnc3RyaW5nJykge1xuICAgIC8vIEZvciBjb252ZW5pZW5jZSwgZGV0ZWN0IE5vZGUuanMgQnVmZmVyIG9iamVjdHMgYW5kIGF1dG9tYXRpY2FsbHkgY2FsbCB0b1N0cmluZygpLlxuICAgIGlmIChCdWZmZXIgJiYgQnVmZmVyLmlzQnVmZmVyKHNvdXJjZSkpIHtcbiAgICAgIHNvdXJjZSA9IHNvdXJjZS50b1N0cmluZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICdFeHBlY3RlZCBzdHJpbmcgYXMgZmlyc3QgYXJndW1lbnQsIGdvdCAnICsgY29tbW9uLnVuZXhwZWN0ZWRPYmpUb1N0cmluZyhzb3VyY2UpKTtcbiAgICB9XG4gIH1cbiAgY29tcGlsZUFuZExvYWQoc291cmNlLCBucyk7XG4gIHJldHVybiBucztcbn1cblxuZnVuY3Rpb24gZ3JhbW1hckZyb21TY3JpcHRFbGVtZW50KG9wdE5vZGUpIHtcbiAgdmFyIG5vZGUgPSBvcHROb2RlO1xuICBpZiAoaXNVbmRlZmluZWQobm9kZSkpIHtcbiAgICB2YXIgbm9kZUxpc3QgPSBkb2N1bWVudEludGVyZmFjZS5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHRbdHlwZT1cInRleHQvb2htLWpzXCJdJyk7XG4gICAgaWYgKG5vZGVMaXN0Lmxlbmd0aCAhPT0gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdFeHBlY3RlZCBleGFjdGx5IG9uZSBzY3JpcHQgdGFnIHdpdGggdHlwZT1cInRleHQvb2htLWpzXCIsIGZvdW5kICcgKyBub2RlTGlzdC5sZW5ndGgpO1xuICAgIH1cbiAgICBub2RlID0gbm9kZUxpc3RbMF07XG4gIH1cbiAgcmV0dXJuIGdyYW1tYXIoZ2V0U2NyaXB0RWxlbWVudENvbnRlbnRzKG5vZGUpKTtcbn1cblxuZnVuY3Rpb24gZ3JhbW1hcnNGcm9tU2NyaXB0RWxlbWVudHMob3B0Tm9kZU9yTm9kZUxpc3QpIHtcbiAgLy8gU2ltcGxlIGNhc2U6IHRoZSBhcmd1bWVudCBpcyBhIERPTSBub2RlLlxuICBpZiAoaXNFbGVtZW50KG9wdE5vZGVPck5vZGVMaXN0KSkge1xuICAgIHJldHVybiBncmFtbWFycyhvcHROb2RlT3JOb2RlTGlzdCk7XG4gIH1cbiAgLy8gT3RoZXJ3aXNlLCBpdCBtdXN0IGJlIGVpdGhlciB1bmRlZmluZWQgb3IgYSBOb2RlTGlzdC5cbiAgdmFyIG5vZGVMaXN0ID0gb3B0Tm9kZU9yTm9kZUxpc3Q7XG4gIGlmIChpc1VuZGVmaW5lZChub2RlTGlzdCkpIHtcbiAgICAvLyBGaW5kIGFsbCBzY3JpcHQgZWxlbWVudHMgd2l0aCB0eXBlPVwidGV4dC9vaG0tanNcIi5cbiAgICBub2RlTGlzdCA9IGRvY3VtZW50SW50ZXJmYWNlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdFt0eXBlPVwidGV4dC9vaG0tanNcIl0nKTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygbm9kZUxpc3QgPT09ICdzdHJpbmcnIHx8ICghaXNFbGVtZW50KG5vZGVMaXN0KSAmJiAhaXNBcnJheUxpa2Uobm9kZUxpc3QpKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgTm9kZSwgTm9kZUxpc3QsIG9yIEFycmF5LCBidXQgZ290ICcgKyBub2RlTGlzdCk7XG4gIH1cbiAgdmFyIG5zID0gTmFtZXNwYWNlLmNyZWF0ZU5hbWVzcGFjZSgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVMaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgLy8gQ29weSB0aGUgbmV3IGdyYW1tYXJzIGludG8gYG5zYCB0byBrZWVwIHRoZSBuYW1lc3BhY2UgZmxhdC5cbiAgICBjb21tb24uZXh0ZW5kKG5zLCBncmFtbWFycyhnZXRTY3JpcHRFbGVtZW50Q29udGVudHMobm9kZUxpc3RbaV0pLCBucykpO1xuICB9XG4gIHJldHVybiBucztcbn1cblxuZnVuY3Rpb24gbWFrZVJlY2lwZShyZWNpcGVGbikge1xuICByZXR1cm4gcmVjaXBlRm4uY2FsbChuZXcgQnVpbGRlcigpKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFN0dWZmIHRoYXQgdXNlcnMgc2hvdWxkIGtub3cgYWJvdXRcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFjdGlvbnM6IFNlbWFudGljcy5hY3Rpb25zLFxuICBjcmVhdGVOYW1lc3BhY2U6IE5hbWVzcGFjZS5jcmVhdGVOYW1lc3BhY2UsXG4gIGVycm9yOiBlcnJvcnMsXG4gIGdyYW1tYXI6IGdyYW1tYXIsXG4gIGdyYW1tYXJzOiBncmFtbWFycyxcbiAgZ3JhbW1hckZyb21TY3JpcHRFbGVtZW50OiBncmFtbWFyRnJvbVNjcmlwdEVsZW1lbnQsXG4gIGdyYW1tYXJzRnJvbVNjcmlwdEVsZW1lbnRzOiBncmFtbWFyc0Zyb21TY3JpcHRFbGVtZW50cyxcbiAgbWFrZVJlY2lwZTogbWFrZVJlY2lwZSxcbiAgdXRpbDogdXRpbFxufTtcblxuLy8gU3R1ZmYgdGhhdCdzIG9ubHkgaGVyZSBmb3IgYm9vdHN0cmFwcGluZywgdGVzdGluZywgZXRjLlxuR3JhbW1hci5CdWlsdEluUnVsZXMgPSByZXF1aXJlKCcuLi9kaXN0L2J1aWx0LWluLXJ1bGVzJyk7XG5vaG1HcmFtbWFyID0gcmVxdWlyZSgnLi4vZGlzdC9vaG0tZ3JhbW1hcicpO1xubW9kdWxlLmV4cG9ydHMuX2J1aWxkR3JhbW1hciA9IGJ1aWxkR3JhbW1hcjtcbm1vZHVsZS5leHBvcnRzLl9zZXREb2N1bWVudEludGVyZmFjZUZvclRlc3RpbmcgPSBmdW5jdGlvbihkb2MpIHsgZG9jdW1lbnRJbnRlcmZhY2UgPSBkb2M7IH07XG5tb2R1bGUuZXhwb3J0cy5vaG1HcmFtbWFyID0gb2htR3JhbW1hcjtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyKSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIE5vZGUoZ3JhbW1hciwgY3Rvck5hbWUsIGNoaWxkcmVuLCBpbnRlcnZhbCkge1xuICB0aGlzLmdyYW1tYXIgPSBncmFtbWFyO1xuICB0aGlzLmN0b3JOYW1lID0gY3Rvck5hbWU7XG4gIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgdGhpcy5pbnRlcnZhbCA9IGludGVydmFsO1xufVxuXG5Ob2RlLnByb3RvdHlwZS5udW1DaGlsZHJlbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGg7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5jaGlsZEF0ID0gZnVuY3Rpb24oaWR4KSB7XG4gIHJldHVybiB0aGlzLmNoaWxkcmVuW2lkeF07XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5pbmRleE9mQ2hpbGQgPSBmdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uaW5kZXhPZihhcmcpO1xufTtcblxuTm9kZS5wcm90b3R5cGUuaGFzQ2hpbGRyZW4gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoID4gMDtcbn07XG5cbk5vZGUucHJvdG90eXBlLmhhc05vQ2hpbGRyZW4gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICF0aGlzLmhhc0NoaWxkcmVuKCk7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5vbmx5Q2hpbGQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnY2Fubm90IGdldCBvbmx5IGNoaWxkIG9mIGEgbm9kZSBvZiB0eXBlICcgKyB0aGlzLmN0b3JOYW1lICtcbiAgICAgICAgJyAoaXQgaGFzICcgKyB0aGlzLm51bUNoaWxkcmVuKCkgKyAnIGNoaWxkcmVuKScpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmZpcnN0Q2hpbGQoKTtcbiAgfVxufTtcblxuTm9kZS5wcm90b3R5cGUuZmlyc3RDaGlsZCA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5oYXNOb0NoaWxkcmVuKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdjYW5ub3QgZ2V0IGZpcnN0IGNoaWxkIG9mIGEgJyArIHRoaXMuY3Rvck5hbWUgKyAnIG5vZGUsIHdoaWNoIGhhcyBubyBjaGlsZHJlbicpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmNoaWxkQXQoMCk7XG4gIH1cbn07XG5cbk5vZGUucHJvdG90eXBlLmxhc3RDaGlsZCA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5oYXNOb0NoaWxkcmVuKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdjYW5ub3QgZ2V0IGxhc3QgY2hpbGQgb2YgYSAnICsgdGhpcy5jdG9yTmFtZSArICcgbm9kZSwgd2hpY2ggaGFzIG5vIGNoaWxkcmVuJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRBdCh0aGlzLm51bUNoaWxkcmVuKCkgLSAxKTtcbiAgfVxufTtcblxuTm9kZS5wcm90b3R5cGUuY2hpbGRCZWZvcmUgPSBmdW5jdGlvbihjaGlsZCkge1xuICB2YXIgY2hpbGRJZHggPSB0aGlzLmluZGV4T2ZDaGlsZChjaGlsZCk7XG4gIGlmIChjaGlsZElkeCA8IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vZGUuY2hpbGRCZWZvcmUoKSBjYWxsZWQgdy8gYW4gYXJndW1lbnQgdGhhdCBpcyBub3QgYSBjaGlsZCcpO1xuICB9IGVsc2UgaWYgKGNoaWxkSWR4ID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZ2V0IGNoaWxkIGJlZm9yZSBmaXJzdCBjaGlsZCcpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmNoaWxkQXQoY2hpbGRJZHggLSAxKTtcbiAgfVxufTtcblxuTm9kZS5wcm90b3R5cGUuY2hpbGRBZnRlciA9IGZ1bmN0aW9uKGNoaWxkKSB7XG4gIHZhciBjaGlsZElkeCA9IHRoaXMuaW5kZXhPZkNoaWxkKGNoaWxkKTtcbiAgaWYgKGNoaWxkSWR4IDwgMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm9kZS5jaGlsZEFmdGVyKCkgY2FsbGVkIHcvIGFuIGFyZ3VtZW50IHRoYXQgaXMgbm90IGEgY2hpbGQnKTtcbiAgfSBlbHNlIGlmIChjaGlsZElkeCA9PT0gdGhpcy5udW1DaGlsZHJlbigpIC0gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGdldCBjaGlsZCBhZnRlciBsYXN0IGNoaWxkJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRBdChjaGlsZElkeCArIDEpO1xuICB9XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5pc1Rlcm1pbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbk5vZGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgciA9IHt9O1xuICByW3RoaXMuY3Rvck5hbWVdID0gdGhpcy5jaGlsZHJlbjtcbiAgcmV0dXJuIHI7XG59O1xuXG5mdW5jdGlvbiBUZXJtaW5hbE5vZGUoZ3JhbW1hciwgdmFsdWUsIGludGVydmFsKSB7XG4gIE5vZGUuY2FsbCh0aGlzLCBncmFtbWFyLCAnX3Rlcm1pbmFsJywgW10sIGludGVydmFsKTtcbiAgdGhpcy5wcmltaXRpdmVWYWx1ZSA9IHZhbHVlO1xufVxuaW5oZXJpdHMoVGVybWluYWxOb2RlLCBOb2RlKTtcblxuVGVybWluYWxOb2RlLnByb3RvdHlwZS5pc1Rlcm1pbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0cnVlO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0ge05vZGU6IE5vZGUsIFRlcm1pbmFsTm9kZTogVGVybWluYWxOb2RlfTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnl0aGluZy5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5lbmQuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuUHJpbS5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMudGVybXNbaWR4XS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChncmFtbWFyKTtcbiAgfVxufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy5mYWN0b3JzW2lkeF0uYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQoZ3JhbW1hcik7XG4gIH1cbn07XG5cbnBleHBycy5JdGVyLnByb3RvdHlwZS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG5wZXhwcnMuTm90LnByb3RvdHlwZS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG5wZXhwcnMuQXJyLnByb3RvdHlwZS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG5wZXhwcnMuU3RyLnByb3RvdHlwZS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgdGhpcy5leHByLmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKGdyYW1tYXIpO1xufTtcblxucGV4cHJzLk9iai5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzW2lkeF0ucGF0dGVybi5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChncmFtbWFyKTtcbiAgfVxufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgdmFyIGJvZHkgPSBncmFtbWFyLnJ1bGVEaWN0W3RoaXMucnVsZU5hbWVdO1xuXG4gIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBydWxlIGV4aXN0c1xuICBpZiAoIWJvZHkpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLlVuZGVjbGFyZWRSdWxlKHRoaXMucnVsZU5hbWUsIGdyYW1tYXIubmFtZSk7XG4gIH1cblxuICAvLyAuLi4gYW5kIHRoYXQgdGhpcyBhcHBsaWNhdGlvbiBoYXMgdGhlIGNvcnJlY3QgbnVtYmVyIG9mIHBhcmFtZXRlcnNcbiAgdmFyIGFjdHVhbCA9IHRoaXMucGFyYW1zLmxlbmd0aDtcbiAgdmFyIGV4cGVjdGVkID0gYm9keS5mb3JtYWxzLmxlbmd0aDtcbiAgaWYgKGFjdHVhbCAhPT0gZXhwZWN0ZWQpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLldyb25nTnVtYmVyT2ZQYXJhbWV0ZXJzKHRoaXMucnVsZU5hbWUsIGV4cGVjdGVkLCBhY3R1YWwpO1xuICB9XG5cbiAgLy8gLi4uIGFuZCB0aGF0IGFsbCBvZiB0aGUgcGFyYW1ldGVyIGV4cHJlc3Npb25zIG9ubHkgaGF2ZSB2YWxpZCBhcHBsaWNhdGlvbnMgYW5kIGhhdmUgYXJpdHkgMVxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMucGFyYW1zLmZvckVhY2goZnVuY3Rpb24ocGFyYW0pIHtcbiAgICBwYXJhbS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChncmFtbWFyKTtcbiAgICBpZiAocGFyYW0uZ2V0QXJpdHkoKSAhPT0gMSkge1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5JbnZhbGlkUGFyYW1ldGVyKHNlbGYucnVsZU5hbWUsIHBhcmFtKTtcbiAgICB9XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnl0aGluZy5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG5wZXhwcnMuZW5kLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbnBleHBycy5QcmltLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgaWYgKHRoaXMudGVybXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBhcml0eSA9IHRoaXMudGVybXNbMF0uZ2V0QXJpdHkoKTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdmFyIHRlcm0gPSB0aGlzLnRlcm1zW2lkeF07XG4gICAgdGVybS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSgpO1xuICAgIHZhciBvdGhlckFyaXR5ID0gdGVybS5nZXRBcml0eSgpO1xuICAgIGlmIChhcml0eSAhPT0gb3RoZXJBcml0eSkge1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5JbmNvbnNpc3RlbnRBcml0eShydWxlTmFtZSwgYXJpdHksIG90aGVyQXJpdHkpO1xuICAgIH1cbiAgfVxufTtcblxucGV4cHJzLkV4dGVuZC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICAvLyBFeHRlbmQgaXMgYSBzcGVjaWFsIGNhc2Ugb2YgQWx0IHRoYXQncyBndWFyYW50ZWVkIHRvIGhhdmUgZXhhY3RseSB0d29cbiAgLy8gY2FzZXM6IFtleHRlbnNpb25zLCBvcmlnQm9keV0uXG4gIHZhciBhY3R1YWxBcml0eSA9IHRoaXMudGVybXNbMF0uZ2V0QXJpdHkoKTtcbiAgdmFyIGV4cGVjdGVkQXJpdHkgPSB0aGlzLnRlcm1zWzFdLmdldEFyaXR5KCk7XG4gIGlmIChhY3R1YWxBcml0eSAhPT0gZXhwZWN0ZWRBcml0eSkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuSW5jb25zaXN0ZW50QXJpdHkocnVsZU5hbWUsIGV4cGVjdGVkQXJpdHksIGFjdHVhbEFyaXR5KTtcbiAgfVxufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMuZmFjdG9yc1tpZHhdLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KHJ1bGVOYW1lKTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gbm8tb3AgKG5vdCByZXF1aXJlZCBiL2MgdGhlIG5lc3RlZCBleHByIGRvZXNuJ3Qgc2hvdyB1cCBpbiB0aGUgQ1NUKVxufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxucGV4cHJzLkFyci5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxucGV4cHJzLlN0ci5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLk9iai5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpO1xuICB9XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gVGhlIGFyaXRpZXMgb2YgdGhlIHBhcmFtZXRlciBleHByZXNzaW9ucyBpcyByZXF1aXJlZCB0byBiZSAxIGJ5XG4gIC8vIGBhc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCgpYC5cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBydWxlTmFtZSkge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgcnVsZU5hbWUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy50ZXJtc1tpZHhdLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyLCBydWxlTmFtZSk7XG4gIH1cbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIHJ1bGVOYW1lKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy5mYWN0b3JzW2lkeF0uYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIsIHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIHJ1bGVOYW1lKSB7XG4gIC8vIE5vdGU6IHRoaXMgaXMgdGhlIGltcGxlbWVudGF0aW9uIG9mIHRoaXMgbWV0aG9kIGZvciBgU3RhcmAgYW5kIGBQbHVzYCBleHByZXNzaW9ucy5cbiAgLy8gSXQgaXMgb3ZlcnJpZGRlbiBmb3IgYE9wdGAgYmVsb3cuXG4gIHRoaXMuZXhwci5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUoZ3JhbW1hciwgcnVsZU5hbWUpO1xuICBpZiAodGhpcy5leHByLmlzTnVsbGFibGUoZ3JhbW1hcikpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLktsZWVuZUV4cHJIYXNOdWxsYWJsZU9wZXJhbmQodGhpcywgcnVsZU5hbWUpO1xuICB9XG59O1xuXG5wZXhwcnMuT3B0LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLk5vdC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG5wZXhwcnMuQXJyLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLlN0ci5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgcnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyLCBydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIsIHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBydWxlTmFtZSkge1xuICB0aGlzLnBhcmFtcy5mb3JFYWNoKGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgcGFyYW0uYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIsIHJ1bGVOYW1lKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgbm9kZXMgPSByZXF1aXJlKCcuL25vZGVzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuY2hlY2sgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnl0aGluZy5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHZhbHMubGVuZ3RoID49IDE7XG59O1xuXG5wZXhwcnMuZW5kLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICByZXR1cm4gdmFsc1swXSBpbnN0YW5jZW9mIG5vZGVzLk5vZGUgJiZcbiAgICAgICAgIHZhbHNbMF0uaXNUZXJtaW5hbCgpICYmXG4gICAgICAgICB2YWxzWzBdLnByaW1pdGl2ZVZhbHVlID09PSB1bmRlZmluZWQ7XG59O1xuXG5wZXhwcnMuUHJpbS5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIHJldHVybiB2YWxzWzBdIGluc3RhbmNlb2Ygbm9kZXMuTm9kZSAmJlxuICAgICAgICAgdmFsc1swXS5pc1Rlcm1pbmFsKCkgJiZcbiAgICAgICAgIHZhbHNbMF0ucHJpbWl0aXZlVmFsdWUgPT09IHRoaXMub2JqO1xufTtcblxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHZhbHMubGVuZ3RoID49IDE7XG59O1xuXG5wZXhwcnMuUmVnRXhwUHJpbS5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIC8vIFRPRE86IG1vcmUgZWZmaWNpZW50IFwidG90YWwgbWF0Y2ggY2hlY2tlclwiIHRoYW4gdGhlIHVzZSBvZiAucmVwbGFjZSBoZXJlXG4gIHJldHVybiB2YWxzWzBdIGluc3RhbmNlb2Ygbm9kZXMuTm9kZSAmJlxuICAgICAgICAgdmFsc1swXS5pc1Rlcm1pbmFsKCkgJiZcbiAgICAgICAgIHR5cGVvZiB2YWxzWzBdLnByaW1pdGl2ZVZhbHVlID09PSAnc3RyaW5nJyAmJlxuICAgICAgICAgdmFsc1swXS5wcmltaXRpdmVWYWx1ZS5yZXBsYWNlKHRoaXMub2JqLCAnJykgPT09ICcnO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50ZXJtcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB0ZXJtID0gdGhpcy50ZXJtc1tpXTtcbiAgICBpZiAodGVybS5jaGVjayhncmFtbWFyLCB2YWxzKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICB2YXIgcG9zID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZmFjdG9yID0gdGhpcy5mYWN0b3JzW2ldO1xuICAgIGlmIChmYWN0b3IuY2hlY2soZ3JhbW1hciwgdmFscy5zbGljZShwb3MpKSkge1xuICAgICAgcG9zICs9IGZhY3Rvci5nZXRBcml0eSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICB2YXIgYXJpdHkgPSB0aGlzLmdldEFyaXR5KCk7XG4gIHZhciBjb2x1bW5zID0gdmFscy5zbGljZSgwLCBhcml0eSk7XG4gIGlmIChjb2x1bW5zLmxlbmd0aCAhPT0gYXJpdHkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHJvd0NvdW50ID0gY29sdW1uc1swXS5sZW5ndGg7XG4gIHZhciBpO1xuICBmb3IgKGkgPSAxOyBpIDwgYXJpdHk7IGkrKykge1xuICAgIGlmIChjb2x1bW5zW2ldLmxlbmd0aCAhPT0gcm93Q291bnQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgcm93Q291bnQ7IGkrKykge1xuICAgIHZhciByb3cgPSBbXTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFyaXR5OyBqKyspIHtcbiAgICAgIHJvdy5wdXNoKGNvbHVtbnNbal1baV0pO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuZXhwci5jaGVjayhncmFtbWFyLCByb3cpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5jaGVjayhncmFtbWFyLCB2YWxzKTtcbn07XG5cbnBleHBycy5BcnIucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICByZXR1cm4gdGhpcy5leHByLmNoZWNrKGdyYW1tYXIsIHZhbHMpO1xufTtcblxucGV4cHJzLlN0ci5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuY2hlY2soZ3JhbW1hciwgdmFscyk7XG59O1xuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgdmFyIGZpeGVkQXJpdHkgPSB0aGlzLmdldEFyaXR5KCk7XG4gIGlmICh0aGlzLmlzTGVuaWVudCkge1xuICAgIGZpeGVkQXJpdHktLTtcbiAgfVxuXG4gIHZhciBwb3MgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpeGVkQXJpdHk7IGkrKykge1xuICAgIHZhciBwYXR0ZXJuID0gdGhpcy5wcm9wZXJ0aWVzW2ldLnBhdHRlcm47XG4gICAgaWYgKHBhdHRlcm4uY2hlY2soZ3JhbW1hciwgdmFscy5zbGljZShwb3MpKSkge1xuICAgICAgcG9zICs9IHBhdHRlcm4uZ2V0QXJpdHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzLmlzTGVuaWVudCA/IHR5cGVvZiB2YWxzW3Bvc10gPT09ICdvYmplY3QnICYmIHZhbHNbcG9zXSA6IHRydWU7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICBpZiAoISh2YWxzWzBdIGluc3RhbmNlb2Ygbm9kZXMuTm9kZSAmJlxuICAgICAgICB2YWxzWzBdLmdyYW1tYXIgPT09IGdyYW1tYXIgJiZcbiAgICAgICAgdmFsc1swXS5jdG9yTmFtZSA9PT0gdGhpcy5ydWxlTmFtZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBUT0RPOiB0aGluayBhYm91dCAqbm90KiBkb2luZyB0aGUgZm9sbG93aW5nIGNoZWNrcywgaS5lLiwgdHJ1c3RpbmcgdGhhdCB0aGUgcnVsZVxuICAvLyB3YXMgY29ycmVjdGx5IGNvbnN0cnVjdGVkLlxuICB2YXIgcnVsZU5vZGUgPSB2YWxzWzBdO1xuICB2YXIgYm9keSA9IGdyYW1tYXIucnVsZURpY3RbdGhpcy5ydWxlTmFtZV07XG4gIHJldHVybiBib2R5LmNoZWNrKGdyYW1tYXIsIHJ1bGVOb2RlLmNoaWxkcmVuKSAmJiBydWxlTm9kZS5udW1DaGlsZHJlbigpID09PSBib2R5LmdldEFyaXR5KCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIElucHV0U3RyZWFtID0gcmVxdWlyZSgnLi9JbnB1dFN0cmVhbScpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgbm9kZXMgPSByZXF1aXJlKCcuL25vZGVzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxudmFyIE5vZGUgPSBub2Rlcy5Ob2RlO1xudmFyIFRlcm1pbmFsTm9kZSA9IG5vZGVzLlRlcm1pbmFsTm9kZTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBhcHBseVNwYWNlc18gPSBuZXcgcGV4cHJzLkFwcGx5KCdzcGFjZXNfJyk7XG5cbmZ1bmN0aW9uIHNraXBTcGFjZXNJZkFwcHJvcHJpYXRlKHN0YXRlKSB7XG4gIHZhciBjdXJyZW50QXBwbGljYXRpb24gPSBzdGF0ZS5hcHBsaWNhdGlvblN0YWNrW3N0YXRlLmFwcGxpY2F0aW9uU3RhY2subGVuZ3RoIC0gMV07XG4gIHZhciBydWxlTmFtZSA9IGN1cnJlbnRBcHBsaWNhdGlvbi5ydWxlTmFtZSB8fCAnJztcbiAgaWYgKHR5cGVvZiBzdGF0ZS5pbnB1dFN0cmVhbS5zb3VyY2UgPT09ICdzdHJpbmcnICYmIGNvbW1vbi5pc1N5bnRhY3RpYyhydWxlTmFtZSkpIHtcbiAgICBza2lwU3BhY2VzKHN0YXRlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBza2lwU3BhY2VzKHN0YXRlKSB7XG4gIHN0YXRlLmlnbm9yZUZhaWx1cmVzKCk7XG4gIGFwcGx5U3BhY2VzXy5ldmFsKHN0YXRlKTtcbiAgc3RhdGUuYmluZGluZ3MucG9wKCk7XG4gIHN0YXRlLnJlY29yZEZhaWx1cmVzKCk7XG59XG5cbi8vIEV2YWx1YXRlIHRoZSBleHByZXNzaW9uIGFuZCByZXR1cm4gdHJ1ZSBpZiBpdCBzdWNjZWVkZWQsIG90aGVyd2lzZSBmYWxzZS5cbi8vIE9uIHN1Y2Nlc3MsIHRoZSBiaW5kaW5ncyB3aWxsIGhhdmUgYHRoaXMuYXJpdHlgIG1vcmUgZWxlbWVudHMgdGhhbiBiZWZvcmUsXG4vLyBhbmQgdGhlIHBvc2l0aW9uIGNvdWxkIGJlIGFueXdoZXJlLiBPbiBmYWlsdXJlLCB0aGUgYmluZGluZ3MgYW5kIHBvc2l0aW9uXG4vLyB3aWxsIGJlIHVuY2hhbmdlZC5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBvcmlnUG9zID0gc3RhdGUuaW5wdXRTdHJlYW0ucG9zO1xuICB2YXIgb3JpZ051bUJpbmRpbmdzID0gc3RhdGUuYmluZGluZ3MubGVuZ3RoO1xuICB2YXIgb3JpZ1RyYWNlID0gc3RhdGUudHJhY2U7XG4gIGlmIChzdGF0ZS5pc1RyYWNpbmcoKSkge1xuICAgIHN0YXRlLnRyYWNlID0gW107XG4gIH1cblxuICAvLyBEbyB0aGUgYWN0dWFsIGV2YWx1YXRpb24uXG4gIHZhciBhbnMgPSB0aGlzLl9ldmFsKHN0YXRlLCBzdGF0ZS5pbnB1dFN0cmVhbSwgb3JpZ1Bvcyk7XG5cbiAgaWYgKHN0YXRlLmlzVHJhY2luZygpKSB7XG4gICAgdmFyIHRyYWNlRW50cnkgPSBzdGF0ZS5nZXRUcmFjZUVudHJ5KG9yaWdQb3MsIHRoaXMsIGFucyk7XG4gICAgb3JpZ1RyYWNlLnB1c2godHJhY2VFbnRyeSk7XG4gICAgc3RhdGUudHJhY2UgPSBvcmlnVHJhY2U7XG4gIH1cblxuICBpZiAoIWFucykge1xuICAgIHRoaXMubWF5YmVSZWNvcmRGYWlsdXJlKHN0YXRlLCBvcmlnUG9zKTtcblxuICAgIC8vIFJlc2V0IHRoZSBwb3NpdGlvbiBhbmQgdGhlIGJpbmRpbmdzLlxuICAgIHN0YXRlLmlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3M7XG4gICAgc3RhdGUuYmluZGluZ3MubGVuZ3RoID0gb3JpZ051bUJpbmRpbmdzO1xuICB9XG4gIHJldHVybiBhbnM7XG59O1xuXG4vLyBFdmFsdWF0ZSB0aGUgZXhwcmVzc2lvbiBhbmQgcmV0dXJuIHRydWUgaWYgaXQgc3VjY2VlZGVkLCBvdGhlcndpc2UgZmFsc2UuXG4vLyBUaGlzIHNob3VsZCBub3QgYmUgY2FsbGVkIGRpcmVjdGx5IGV4Y2VwdCBieSBgZXZhbGAuXG4vL1xuLy8gVGhlIGNvbnRyYWN0IG9mIHRoaXMgbWV0aG9kIGlzIGFzIGZvbGxvd3M6XG4vLyAqIFdoZW4gdGhlIHJldHVybiB2YWx1ZSBpcyB0cnVlOlxuLy8gICAtLSBiaW5kaW5ncyB3aWxsIGhhdmUgZXhwci5hcml0eSBtb3JlIGVsZW1lbnRzIHRoYW4gYmVmb3JlXG4vLyAqIFdoZW4gdGhlIHJldHVybiB2YWx1ZSBpcyBmYWxzZTpcbi8vICAgLS0gYmluZGluZ3Mgd2lsbCBoYXZlIGV4YWN0bHkgdGhlIHNhbWUgbnVtYmVyIG9mIGVsZW1lbnRzIGFzIGJlZm9yZVxuLy8gICAtLSBwb3NpdGlvbiBjb3VsZCBiZSBhbnl3aGVyZVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLl9ldmFsID0gY29tbW9uLmFic3RyYWN0O1xuXG5wZXhwcnMuYW55dGhpbmcuX2V2YWwgPSBmdW5jdGlvbihzdGF0ZSwgaW5wdXRTdHJlYW0sIG9yaWdQb3MpIHtcbiAgdmFyIHZhbHVlID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAodmFsdWUgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHZhciBpbnRlcnZhbCA9IGlucHV0U3RyZWFtLmludGVydmFsRnJvbShvcmlnUG9zKTtcbiAgICBzdGF0ZS5iaW5kaW5ncy5wdXNoKG5ldyBUZXJtaW5hbE5vZGUoc3RhdGUuZ3JhbW1hciwgdmFsdWUsIGludGVydmFsKSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cbnBleHBycy5lbmQuX2V2YWwgPSBmdW5jdGlvbihzdGF0ZSwgaW5wdXRTdHJlYW0sIG9yaWdQb3MpIHtcbiAgaWYgKHN0YXRlLmlucHV0U3RyZWFtLmF0RW5kKCkpIHtcbiAgICB2YXIgaW50ZXJ2YWwgPSBpbnB1dFN0cmVhbS5pbnRlcnZhbEZyb20oaW5wdXRTdHJlYW0ucG9zKTtcbiAgICBzdGF0ZS5iaW5kaW5ncy5wdXNoKG5ldyBUZXJtaW5hbE5vZGUoc3RhdGUuZ3JhbW1hciwgdW5kZWZpbmVkLCBpbnRlcnZhbCkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLl9ldmFsID0gZnVuY3Rpb24oc3RhdGUsIGlucHV0U3RyZWFtLCBvcmlnUG9zKSB7XG4gIGlmICh0aGlzLm1hdGNoKGlucHV0U3RyZWFtKSA9PT0gY29tbW9uLmZhaWwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGludGVydmFsID0gaW5wdXRTdHJlYW0uaW50ZXJ2YWxGcm9tKG9yaWdQb3MpO1xuICAgIHN0YXRlLmJpbmRpbmdzLnB1c2gobmV3IFRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCB0aGlzLm9iaiwgaW50ZXJ2YWwpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24oaW5wdXRTdHJlYW0pIHtcbiAgcmV0dXJuIGlucHV0U3RyZWFtLm1hdGNoRXhhY3RseSh0aGlzLm9iaik7XG59O1xuXG5wZXhwcnMuU3RyaW5nUHJpbS5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbihpbnB1dFN0cmVhbSkge1xuICByZXR1cm4gaW5wdXRTdHJlYW0ubWF0Y2hTdHJpbmcodGhpcy5vYmopO1xufTtcblxucGV4cHJzLlJlZ0V4cFByaW0ucHJvdG90eXBlLl9ldmFsID0gZnVuY3Rpb24oc3RhdGUsIGlucHV0U3RyZWFtLCBvcmlnUG9zKSB7XG4gIGlmIChpbnB1dFN0cmVhbS5tYXRjaFJlZ0V4cCh0aGlzLm9iaikgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHZhciBpbnRlcnZhbCA9IGlucHV0U3RyZWFtLmludGVydmFsRnJvbShvcmlnUG9zKTtcbiAgICBzdGF0ZS5iaW5kaW5ncy5wdXNoKFxuICAgICAgICBuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIGlucHV0U3RyZWFtLnNvdXJjZVtvcmlnUG9zXSwgaW50ZXJ2YWwpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5fZXZhbCA9IGZ1bmN0aW9uKHN0YXRlLCBpbnB1dFN0cmVhbSwgb3JpZ1Bvcykge1xuICB2YXIgY3VycmVudEFwcGxpY2F0aW9uID0gc3RhdGUuYXBwbGljYXRpb25TdGFja1tzdGF0ZS5hcHBsaWNhdGlvblN0YWNrLmxlbmd0aCAtIDFdO1xuICByZXR1cm4gY3VycmVudEFwcGxpY2F0aW9uLnBhcmFtc1t0aGlzLmluZGV4XS5ldmFsKHN0YXRlKTtcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLl9ldmFsID0gZnVuY3Rpb24oc3RhdGUsIGlucHV0U3RyZWFtLCBvcmlnUG9zKSB7XG4gIHZhciBiaW5kaW5ncyA9IHN0YXRlLmJpbmRpbmdzO1xuICB2YXIgb3JpZ051bUJpbmRpbmdzID0gYmluZGluZ3MubGVuZ3RoO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAodGhpcy50ZXJtc1tpZHhdLmV2YWwoc3RhdGUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICAgIGJpbmRpbmdzLmxlbmd0aCA9IG9yaWdOdW1CaW5kaW5ncztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuX2V2YWwgPSBmdW5jdGlvbihzdGF0ZSwgaW5wdXRTdHJlYW0sIG9yaWdQb3MpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBza2lwU3BhY2VzSWZBcHByb3ByaWF0ZShzdGF0ZSk7XG4gICAgdmFyIGZhY3RvciA9IHRoaXMuZmFjdG9yc1tpZHhdO1xuICAgIGlmICghZmFjdG9yLmV2YWwoc3RhdGUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLl9ldmFsID0gZnVuY3Rpb24oc3RhdGUsIGlucHV0U3RyZWFtLCBvcmlnUG9zKSB7XG4gIHZhciBhcml0eSA9IHRoaXMuZ2V0QXJpdHkoKTtcbiAgdmFyIGNvbHVtbnMgPSBjb21tb24ucmVwZWF0Rm4oZnVuY3Rpb24oKSB7IHJldHVybiBbXTsgfSwgYXJpdHkpO1xuICB2YXIgbnVtTWF0Y2hlcyA9IDA7XG4gIHZhciBpZHg7XG4gIHdoaWxlIChudW1NYXRjaGVzIDwgdGhpcy5tYXhOdW1NYXRjaGVzKSB7XG4gICAgdmFyIGJhY2t0cmFja1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICBza2lwU3BhY2VzSWZBcHByb3ByaWF0ZShzdGF0ZSk7XG4gICAgaWYgKHRoaXMuZXhwci5ldmFsKHN0YXRlKSkge1xuICAgICAgbnVtTWF0Y2hlcysrO1xuICAgICAgdmFyIHJvdyA9IHN0YXRlLmJpbmRpbmdzLnNwbGljZShzdGF0ZS5iaW5kaW5ncy5sZW5ndGggLSBhcml0eSwgYXJpdHkpO1xuICAgICAgZm9yIChpZHggPSAwOyBpZHggPCByb3cubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICBjb2x1bW5zW2lkeF0ucHVzaChyb3dbaWR4XSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlucHV0U3RyZWFtLnBvcyA9IGJhY2t0cmFja1BvcztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBpZiAobnVtTWF0Y2hlcyA8IHRoaXMubWluTnVtTWF0Y2hlcykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmb3IgKGlkeCA9IDA7IGlkeCA8IGNvbHVtbnMubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciBpbnRlcnZhbCA9IGlucHV0U3RyZWFtLmludGVydmFsRnJvbShvcmlnUG9zKTtcbiAgICBzdGF0ZS5iaW5kaW5ncy5wdXNoKG5ldyBOb2RlKHN0YXRlLmdyYW1tYXIsICdfaXRlcicsIGNvbHVtbnNbaWR4XSwgaW50ZXJ2YWwpKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLl9ldmFsID0gZnVuY3Rpb24oc3RhdGUsIGlucHV0U3RyZWFtLCBvcmlnUG9zKSB7XG4gIC8vIFRPRE86XG4gIC8vICogUmlnaHQgbm93IHdlJ3JlIGp1c3QgdGhyb3dpbmcgYXdheSBhbGwgb2YgdGhlIGZhaWx1cmVzIHRoYXQgaGFwcGVuIGluc2lkZSBhIGBub3RgLFxuICAvLyAgIGFuZCByZWNvcmRpbmcgYHRoaXNgIGFzIGEgZmFpbGVkIGV4cHJlc3Npb24uXG4gIC8vICogRG91YmxlIG5lZ2F0aW9uIHNob3VsZCBiZSBlcXVpdmFsZW50IHRvIGxvb2thaGVhZCwgYnV0IHRoYXQncyBub3QgdGhlIGNhc2UgcmlnaHQgbm93IHdydFxuICAvLyAgIGZhaWx1cmVzLiBFLmcuLCB+fidmb28nIHByb2R1Y2VzIGEgZmFpbHVyZSBmb3Igfn4nZm9vJywgYnV0IG1heWJlIGl0IHNob3VsZCBwcm9kdWNlXG4gIC8vICAgYSBmYWlsdXJlIGZvciAnZm9vJyBpbnN0ZWFkLlxuXG4gIHN0YXRlLmlnbm9yZUZhaWx1cmVzKCk7XG4gIHZhciBhbnMgPSB0aGlzLmV4cHIuZXZhbChzdGF0ZSk7XG4gIHN0YXRlLnJlY29yZEZhaWx1cmVzKCk7XG4gIGlmIChhbnMpIHtcbiAgICBzdGF0ZS5iaW5kaW5ncy5sZW5ndGggLT0gdGhpcy5nZXRBcml0eSgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5fZXZhbCA9IGZ1bmN0aW9uKHN0YXRlLCBpbnB1dFN0cmVhbSwgb3JpZ1Bvcykge1xuICBpZiAodGhpcy5leHByLmV2YWwoc3RhdGUpKSB7XG4gICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbnBleHBycy5BcnIucHJvdG90eXBlLl9ldmFsID0gZnVuY3Rpb24oc3RhdGUsIGlucHV0U3RyZWFtLCBvcmlnUG9zKSB7XG4gIHZhciBvYmogPSBpbnB1dFN0cmVhbS5uZXh0KCk7XG4gIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICB2YXIgb2JqSW5wdXRTdHJlYW0gPSBJbnB1dFN0cmVhbS5uZXdGb3Iob2JqKTtcbiAgICBzdGF0ZS5wdXNoSW5wdXRTdHJlYW0ob2JqSW5wdXRTdHJlYW0pO1xuICAgIHZhciBhbnMgPSB0aGlzLmV4cHIuZXZhbChzdGF0ZSkgJiYgc3RhdGUuaW5wdXRTdHJlYW0uYXRFbmQoKTtcbiAgICBzdGF0ZS5wb3BJbnB1dFN0cmVhbSgpO1xuICAgIHJldHVybiBhbnM7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5wZXhwcnMuU3RyLnByb3RvdHlwZS5fZXZhbCA9IGZ1bmN0aW9uKHN0YXRlLCBpbnB1dFN0cmVhbSwgb3JpZ1Bvcykge1xuICB2YXIgb2JqID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgc3RySW5wdXRTdHJlYW0gPSBJbnB1dFN0cmVhbS5uZXdGb3Iob2JqKTtcbiAgICBzdGF0ZS5wdXNoSW5wdXRTdHJlYW0oc3RySW5wdXRTdHJlYW0pO1xuICAgIHZhciBhbnMgPSB0aGlzLmV4cHIuZXZhbChzdGF0ZSkgJiYgKHNraXBTcGFjZXNJZkFwcHJvcHJpYXRlKHN0YXRlKSwgc3RhdGUuaW5wdXRTdHJlYW0uYXRFbmQoKSk7XG4gICAgc3RhdGUucG9wSW5wdXRTdHJlYW0oKTtcbiAgICByZXR1cm4gYW5zO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxucGV4cHJzLk9iai5wcm90b3R5cGUuX2V2YWwgPSBmdW5jdGlvbihzdGF0ZSwgaW5wdXRTdHJlYW0sIG9yaWdQb3MpIHtcbiAgdmFyIG9iaiA9IGlucHV0U3RyZWFtLm5leHQoKTtcbiAgaWYgKG9iaiAhPT0gY29tbW9uLmZhaWwgJiYgb2JqICYmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyB8fCB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nKSkge1xuICAgIHZhciBudW1Pd25Qcm9wZXJ0aWVzTWF0Y2hlZCA9IDA7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBwcm9wZXJ0eSA9IHRoaXMucHJvcGVydGllc1tpZHhdO1xuICAgICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkocHJvcGVydHkubmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdmFyIHZhbHVlID0gb2JqW3Byb3BlcnR5Lm5hbWVdO1xuICAgICAgdmFyIHZhbHVlSW5wdXRTdHJlYW0gPSBJbnB1dFN0cmVhbS5uZXdGb3IoW3ZhbHVlXSk7XG4gICAgICBzdGF0ZS5wdXNoSW5wdXRTdHJlYW0odmFsdWVJbnB1dFN0cmVhbSk7XG4gICAgICB2YXIgbWF0Y2hlZCA9IHByb3BlcnR5LnBhdHRlcm4uZXZhbChzdGF0ZSkgJiYgc3RhdGUuaW5wdXRTdHJlYW0uYXRFbmQoKTtcbiAgICAgIHN0YXRlLnBvcElucHV0U3RyZWFtKCk7XG4gICAgICBpZiAoIW1hdGNoZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgbnVtT3duUHJvcGVydGllc01hdGNoZWQrKztcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNMZW5pZW50KSB7XG4gICAgICB2YXIgcmVtYWluZGVyID0ge307XG4gICAgICBmb3IgKHZhciBwIGluIG9iaikge1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHApICYmIHRoaXMucHJvcGVydGllcy5pbmRleE9mKHApIDwgMCkge1xuICAgICAgICAgIHJlbWFpbmRlcltwXSA9IG9ialtwXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIGludGVydmFsID0gaW5wdXRTdHJlYW0uaW50ZXJ2YWxGcm9tKG9yaWdQb3MpO1xuICAgICAgc3RhdGUuYmluZGluZ3MucHVzaChuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIHJlbWFpbmRlciwgaW50ZXJ2YWwpKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVtT3duUHJvcGVydGllc01hdGNoZWQgPT09IE9iamVjdC5rZXlzKG9iaikubGVuZ3RoO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuX2V2YWwgPSBmdW5jdGlvbihzdGF0ZSwgaW5wdXRTdHJlYW0pIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgZ3JhbW1hciA9IHN0YXRlLmdyYW1tYXI7XG4gIHZhciBiaW5kaW5ncyA9IHN0YXRlLmJpbmRpbmdzO1xuXG4gIGZ1bmN0aW9uIHVzZU1lbW9pemVkUmVzdWx0KG1lbW9SZWNPckxSKSB7XG4gICAgaW5wdXRTdHJlYW0ucG9zID0gbWVtb1JlY09yTFIucG9zO1xuICAgIGlmIChtZW1vUmVjT3JMUi5mYWlsdXJlRGVzY3JpcHRvcikge1xuICAgICAgc3RhdGUucmVjb3JkRmFpbHVyZXMobWVtb1JlY09yTFIuZmFpbHVyZURlc2NyaXB0b3IsIHNlbGYpO1xuICAgIH1cbiAgICBpZiAoc3RhdGUuaXNUcmFjaW5nKCkpIHtcbiAgICAgIHN0YXRlLnRyYWNlLnB1c2gobWVtb1JlY09yTFIudHJhY2VFbnRyeSk7XG4gICAgfVxuICAgIGlmIChtZW1vUmVjT3JMUi52YWx1ZSkge1xuICAgICAgYmluZGluZ3MucHVzaChtZW1vUmVjT3JMUi52YWx1ZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHZhciBhY3R1YWxzID0gc3RhdGUuYXBwbGljYXRpb25TdGFjay5sZW5ndGggPiAxID9cbiAgICAgIHN0YXRlLmFwcGxpY2F0aW9uU3RhY2tbc3RhdGUuYXBwbGljYXRpb25TdGFjay5sZW5ndGggLSAxXS5wYXJhbXMgOlxuICAgICAgW107XG4gIHZhciBhcHAgPSB0aGlzLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscyk7XG4gIHZhciBydWxlTmFtZSA9IGFwcC5ydWxlTmFtZTtcbiAgdmFyIG1lbW9LZXkgPSBhcHAudG9NZW1vS2V5KCk7XG5cbiAgaWYgKGNvbW1vbi5pc1N5bnRhY3RpYyhydWxlTmFtZSkpIHtcbiAgICBza2lwU3BhY2VzKHN0YXRlKTtcbiAgfVxuXG4gIHZhciBvcmlnUG9zSW5mbyA9IHN0YXRlLmdldEN1cnJlbnRQb3NJbmZvKCk7XG5cbiAgdmFyIG1lbW9SZWMgPSBvcmlnUG9zSW5mby5tZW1vW21lbW9LZXldO1xuICB2YXIgY3VycmVudExSO1xuICBpZiAobWVtb1JlYyAmJiBvcmlnUG9zSW5mby5zaG91bGRVc2VNZW1vaXplZFJlc3VsdChtZW1vUmVjKSkge1xuICAgIHJldHVybiB1c2VNZW1vaXplZFJlc3VsdChtZW1vUmVjKTtcbiAgfSBlbHNlIGlmIChvcmlnUG9zSW5mby5pc0FjdGl2ZShhcHApKSB7XG4gICAgY3VycmVudExSID0gb3JpZ1Bvc0luZm8uZ2V0Q3VycmVudExlZnRSZWN1cnNpb24oKTtcbiAgICBpZiAoY3VycmVudExSICYmIGN1cnJlbnRMUi5tZW1vS2V5ID09PSBtZW1vS2V5KSB7XG4gICAgICBvcmlnUG9zSW5mby51cGRhdGVJbnZvbHZlZEFwcGxpY2F0aW9ucygpO1xuICAgICAgcmV0dXJuIHVzZU1lbW9pemVkUmVzdWx0KGN1cnJlbnRMUik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9yaWdQb3NJbmZvLnN0YXJ0TGVmdFJlY3Vyc2lvbihhcHApO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYm9keSA9IGdyYW1tYXIucnVsZURpY3RbcnVsZU5hbWVdO1xuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgIG9yaWdQb3NJbmZvLmVudGVyKGFwcCk7XG4gICAgaWYgKGJvZHkuZGVzY3JpcHRpb24pIHtcbiAgICAgIHN0YXRlLmlnbm9yZUZhaWx1cmVzKCk7XG4gICAgfVxuICAgIHZhciB2YWx1ZSA9IGFwcC5ldmFsT25jZShib2R5LCBzdGF0ZSwgaW5wdXRTdHJlYW0sIG9yaWdQb3MpO1xuICAgIGN1cnJlbnRMUiA9IG9yaWdQb3NJbmZvLmdldEN1cnJlbnRMZWZ0UmVjdXJzaW9uKCk7XG4gICAgaWYgKGN1cnJlbnRMUikge1xuICAgICAgaWYgKGN1cnJlbnRMUi5tZW1vS2V5ID09PSBtZW1vS2V5KSB7XG4gICAgICAgIHZhbHVlID0gYXBwLmhhbmRsZUxlZnRSZWN1cnNpb24oYm9keSwgc3RhdGUsIG9yaWdQb3MsIGN1cnJlbnRMUiwgdmFsdWUpO1xuICAgICAgICBvcmlnUG9zSW5mby5tZW1vW21lbW9LZXldID0ge1xuICAgICAgICAgIHBvczogaW5wdXRTdHJlYW0ucG9zLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICBpbnZvbHZlZEFwcGxpY2F0aW9uczogY3VycmVudExSLmludm9sdmVkQXBwbGljYXRpb25zXG4gICAgICAgIH07XG4gICAgICAgIG9yaWdQb3NJbmZvLmVuZExlZnRSZWN1cnNpb24oYXBwKTtcbiAgICAgIH0gZWxzZSBpZiAoIWN1cnJlbnRMUi5pbnZvbHZlZEFwcGxpY2F0aW9uc1ttZW1vS2V5XSkge1xuICAgICAgICAvLyBPbmx5IG1lbW9pemUgaWYgdGhpcyBhcHBsaWNhdGlvbiBpcyBub3QgaW52b2x2ZWQgaW4gdGhlIGN1cnJlbnQgbGVmdCByZWN1cnNpb25cbiAgICAgICAgb3JpZ1Bvc0luZm8ubWVtb1ttZW1vS2V5XSA9IHtwb3M6IGlucHV0U3RyZWFtLnBvcywgdmFsdWU6IHZhbHVlfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3JpZ1Bvc0luZm8ubWVtb1ttZW1vS2V5XSA9IHtwb3M6IGlucHV0U3RyZWFtLnBvcywgdmFsdWU6IHZhbHVlfTtcbiAgICB9XG4gICAgaWYgKGJvZHkuZGVzY3JpcHRpb24pIHtcbiAgICAgIHN0YXRlLnJlY29yZEZhaWx1cmVzKCk7XG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHN0YXRlLnJlY29yZEZhaWx1cmUob3JpZ1BvcywgYXBwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gUmVjb3JkIHRyYWNlIGluZm9ybWF0aW9uIGluIHRoZSBtZW1vIHRhYmxlLCBzbyB0aGF0IGl0IGlzXG4gICAgLy8gYXZhaWxhYmxlIGlmIHRoZSBtZW1vaXplZCByZXN1bHQgaXMgdXNlZCBsYXRlci5cbiAgICBpZiAoc3RhdGUuaXNUcmFjaW5nKCkgJiYgb3JpZ1Bvc0luZm8ubWVtb1ttZW1vS2V5XSkge1xuICAgICAgdmFyIGVudHJ5ID0gc3RhdGUuZ2V0VHJhY2VFbnRyeShvcmlnUG9zLCBhcHAsIHZhbHVlKTtcbiAgICAgIGVudHJ5LnNldExlZnRSZWN1cnNpdmUoY3VycmVudExSICYmIChjdXJyZW50TFIubWVtb0tleSA9PT0gbWVtb0tleSkpO1xuICAgICAgb3JpZ1Bvc0luZm8ubWVtb1ttZW1vS2V5XS50cmFjZUVudHJ5ID0gZW50cnk7XG4gICAgfVxuICAgIHZhciBhbnM7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBiaW5kaW5ncy5wdXNoKHZhbHVlKTtcbiAgICAgIGlmIChzdGF0ZS5hcHBsaWNhdGlvblN0YWNrLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpZiAoY29tbW9uLmlzU3ludGFjdGljKHJ1bGVOYW1lKSkge1xuICAgICAgICAgIHNraXBTcGFjZXMoc3RhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGFucyA9IHBleHBycy5lbmQuZXZhbChzdGF0ZSk7XG4gICAgICAgIGJpbmRpbmdzLnBvcCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYW5zID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYW5zID0gZmFsc2U7XG4gICAgfVxuXG4gICAgb3JpZ1Bvc0luZm8uZXhpdCgpO1xuICAgIHJldHVybiBhbnM7XG4gIH1cbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuZXZhbE9uY2UgPSBmdW5jdGlvbihleHByLCBzdGF0ZSwgaW5wdXRTdHJlYW0sIG9yaWdQb3MpIHtcbiAgaWYgKGV4cHIuZXZhbChzdGF0ZSkpIHtcbiAgICB2YXIgYXJpdHkgPSBleHByLmdldEFyaXR5KCk7XG4gICAgdmFyIGJpbmRpbmdzID0gc3RhdGUuYmluZGluZ3Muc3BsaWNlKHN0YXRlLmJpbmRpbmdzLmxlbmd0aCAtIGFyaXR5LCBhcml0eSk7XG4gICAgdmFyIGFucyA9IG5ldyBOb2RlKHN0YXRlLmdyYW1tYXIsIHRoaXMucnVsZU5hbWUsIGJpbmRpbmdzLCBpbnB1dFN0cmVhbS5pbnRlcnZhbEZyb20ob3JpZ1BvcykpO1xuICAgIHJldHVybiBhbnM7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmhhbmRsZUxlZnRSZWN1cnNpb24gPSBmdW5jdGlvbihib2R5LCBzdGF0ZSwgb3JpZ1BvcywgY3VycmVudExSLCBzZWVkVmFsdWUpIHtcbiAgaWYgKCFzZWVkVmFsdWUpIHtcbiAgICByZXR1cm4gc2VlZFZhbHVlO1xuICB9XG5cbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciB2YWx1ZSA9IHNlZWRWYWx1ZTtcbiAgY3VycmVudExSLnZhbHVlID0gc2VlZFZhbHVlO1xuICBjdXJyZW50TFIucG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgaWYgKHN0YXRlLmlzVHJhY2luZygpKSB7XG4gICAgICBjdXJyZW50TFIudHJhY2VFbnRyeSA9IGNvbW1vbi5jbG9uZShzdGF0ZS50cmFjZVtzdGF0ZS50cmFjZS5sZW5ndGggLSAxXSk7XG4gICAgfVxuXG4gICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICB2YWx1ZSA9IHRoaXMuZXZhbE9uY2UoYm9keSwgc3RhdGUsIGlucHV0U3RyZWFtLCBvcmlnUG9zKTtcbiAgICBpZiAodmFsdWUgJiYgaW5wdXRTdHJlYW0ucG9zID4gY3VycmVudExSLnBvcykge1xuICAgICAgLy8gVGhlIGxlZnQtcmVjdXJzaXZlIHJlc3VsdCB3YXMgZXhwYW5kZWQgLS0ga2VlcCBsb29waW5nLlxuICAgICAgY3VycmVudExSLnZhbHVlID0gdmFsdWU7XG4gICAgICBjdXJyZW50TFIucG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGYWlsZWQgdG8gZXhwYW5kIHRoZSByZXN1bHQuXG4gICAgICBpbnB1dFN0cmVhbS5wb3MgPSBjdXJyZW50TFIucG9zO1xuICAgICAgaWYgKHN0YXRlLmlzVHJhY2luZygpKSB7XG4gICAgICAgIHN0YXRlLnRyYWNlLnBvcCgpOyAgLy8gRHJvcCBsYXN0IHRyYWNlIGVudHJ5IHNpbmNlIGB2YWx1ZWAgd2FzIHVudXNlZC5cbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY3VycmVudExSLnZhbHVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gMTtcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24oKSB7XG4gIC8vIFRoaXMgaXMgb2sgYi9jIGFsbCB0ZXJtcyBtdXN0IGhhdmUgdGhlIHNhbWUgYXJpdHkgLS0gdGhpcyBwcm9wZXJ0eSBpc1xuICAvLyBjaGVja2VkIGJ5IHRoZSBHcmFtbWFyIGNvbnN0cnVjdG9yLlxuICByZXR1cm4gdGhpcy50ZXJtcy5sZW5ndGggPT09IDAgPyAwIDogdGhpcy50ZXJtc1swXS5nZXRBcml0eSgpO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGFyaXR5ID0gMDtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBhcml0eSArPSB0aGlzLmZhY3RvcnNbaWR4XS5nZXRBcml0eSgpO1xuICB9XG4gIHJldHVybiBhcml0eTtcbn07XG5cbnBleHBycy5JdGVyLnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5leHByLmdldEFyaXR5KCk7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gMDtcbn07XG5cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmdldEFyaXR5ID1cbnBleHBycy5BcnIucHJvdG90eXBlLmdldEFyaXR5ID1cbnBleHBycy5TdHIucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuZ2V0QXJpdHkoKTtcbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBhcml0eSA9IHRoaXMuaXNMZW5pZW50ID8gMSA6IDA7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgYXJpdHkgKz0gdGhpcy5wcm9wZXJ0aWVzW2lkeF0ucGF0dGVybi5nZXRBcml0eSgpO1xuICB9XG4gIHJldHVybiBhcml0eTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIE5PVEU6IHRoZSBgaW50cm9kdWNlUGFyYW1zYCBtZXRob2QgbW9kaWZpZXMgdGhlIHJlY2VpdmVyIGluIHBsYWNlLlxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGZ1bmN0aW9uKGZvcm1hbHMpIHtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPSBmdW5jdGlvbihmb3JtYWxzKSB7XG4gIHRoaXMudGVybXMuZm9yRWFjaChmdW5jdGlvbih0ZXJtLCBpZHgsIHRlcm1zKSB7XG4gICAgdGVybXNbaWR4XSA9IHRlcm0uaW50cm9kdWNlUGFyYW1zKGZvcm1hbHMpO1xuICB9KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPSBmdW5jdGlvbihmb3JtYWxzKSB7XG4gIHRoaXMuZmFjdG9ycy5mb3JFYWNoKGZ1bmN0aW9uKGZhY3RvciwgaWR4LCBmYWN0b3JzKSB7XG4gICAgZmFjdG9yc1tpZHhdID0gZmFjdG9yLmludHJvZHVjZVBhcmFtcyhmb3JtYWxzKTtcbiAgfSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG5wZXhwcnMuTm90LnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5BcnIucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG5wZXhwcnMuU3RyLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPSBmdW5jdGlvbihmb3JtYWxzKSB7XG4gIHRoaXMuZXhwciA9IHRoaXMuZXhwci5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxucGV4cHJzLk9iai5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID0gZnVuY3Rpb24oZm9ybWFscykge1xuICB0aGlzLnByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSwgaWR4KSB7XG4gICAgcHJvcGVydHkucGF0dGVybiA9IHByb3BlcnR5LnBhdHRlcm4uaW50cm9kdWNlUGFyYW1zKGZvcm1hbHMpO1xuICB9KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGZ1bmN0aW9uKGZvcm1hbHMpIHtcbiAgdmFyIGluZGV4ID0gZm9ybWFscy5pbmRleE9mKHRoaXMucnVsZU5hbWUpO1xuICBpZiAoaW5kZXggPj0gMCkge1xuICAgIGlmICh0aGlzLnBhcmFtcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZJWE1FOiBzaG91bGQgY2F0Y2ggdGhpcyBlYXJsaWVyJyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgcGV4cHJzLlBhcmFtKGluZGV4KTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnBhcmFtcy5mb3JFYWNoKGZ1bmN0aW9uKHBhcmFtLCBpZHgsIHBhcmFtcykge1xuICAgICAgcGFyYW1zW2lkeF0gPSBwYXJhbS5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFJldHVybnMgYHRydWVgIGlmIHRoaXMgcGFyc2luZyBleHByZXNzaW9uIG1heSBhY2NlcHQgd2l0aG91dCBjb25zdW1pbmcgYW55IGlucHV0LlxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5pc051bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICByZXR1cm4gdGhpcy5faXNOdWxsYWJsZShncmFtbWFyLCBPYmplY3QuY3JlYXRlKG51bGwpKTtcbn07XG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnBleHBycy5lbmQuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLlN0cmluZ1ByaW0ucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICAvLyBUaGlzIGlzIGFuIG92ZXItc2ltcGxpZmljYXRpb246IGl0J3Mgb25seSBjb3JyZWN0IGlmIHRoZSBpbnB1dCBpcyBhIHN0cmluZy4gSWYgaXQncyBhbiBhcnJheVxuICAvLyBvciBhbiBvYmplY3QsIHRoZW4gdGhlIGVtcHR5IHN0cmluZyBwYXJzaW5nIGV4cHJlc3Npb24gaXMgbm90IG51bGxhYmxlLlxuICByZXR1cm4gdGhpcy5vYmogPT09ICcnO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHJldHVybiB0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMCB8fFxuICAgICAgdGhpcy50ZXJtcy5zb21lKGZ1bmN0aW9uKHRlcm0pIHsgcmV0dXJuIHRlcm0uX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7IH0pO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHJldHVybiB0aGlzLmZhY3RvcnMuZXZlcnkoZnVuY3Rpb24oZmFjdG9yKSB7IHJldHVybiBmYWN0b3IuX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7IH0pO1xufTtcblxucGV4cHJzLlN0YXIucHJvdG90eXBlLl9pc051bGxhYmxlID1cbnBleHBycy5PcHQucHJvdG90eXBlLl9pc051bGxhYmxlID1cbnBleHBycy5Ob3QucHJvdG90eXBlLl9pc051bGxhYmxlID1cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnBleHBycy5TdHIucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICAvLyBUaGlzIGlzIGFsc28gYW4gb3Zlci1zaW1wbGlmaWNhdGlvbiB0aGF0IGlzIG9ubHkgY29ycmVjdCB3aGVuIHRoZSBpbnB1dCBpcyBhIHN0cmluZy5cbiAgcmV0dXJuIHRoaXMuZXhwci5faXNOdWxsYWJsZShncmFtbWFyLCBtZW1vKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHZhciBrZXkgPSB0aGlzLnRvTWVtb0tleSgpO1xuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtZW1vLCBrZXkpKSB7XG4gICAgdmFyIGJvZHkgPSBncmFtbWFyLnJ1bGVEaWN0W3RoaXMucnVsZU5hbWVdO1xuICAgIHZhciBpbmxpbmVkID0gYm9keS5zdWJzdGl0dXRlUGFyYW1zKHRoaXMucGFyYW1zKTtcbiAgICBtZW1vW2tleV0gPSBmYWxzZTtcbiAgICBtZW1vW2tleV0gPSBpbmxpbmVkLl9pc051bGxhYmxlKGdyYW1tYXIsIG1lbW8pO1xuICB9XG4gIHJldHVybiBtZW1vW2tleV07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBEbyBub3RoaW5nIGJ5IGRlZmF1bHQuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLm1heWJlUmVjb3JkRmFpbHVyZSA9IGZ1bmN0aW9uKHN0YXRlLCBzdGFydFBvcykge1xufTtcblxuLy8gRm9yIFBFeHBycyB0aGF0IGRpcmVjdGx5IGNvbnN1bWUgaW5wdXQsIHJlY29yZCB0aGUgZmFpbHVyZSBpbiB0aGUgc3RhdGUgb2JqZWN0LlxucGV4cHJzLmFueXRoaW5nLm1heWJlUmVjb3JkRmFpbHVyZSA9XG5wZXhwcnMuZW5kLm1heWJlUmVjb3JkRmFpbHVyZSA9XG5wZXhwcnMuUHJpbS5wcm90b3R5cGUubWF5YmVSZWNvcmRGYWlsdXJlID1cbnBleHBycy5Ob3QucHJvdG90eXBlLm1heWJlUmVjb3JkRmFpbHVyZSA9IGZ1bmN0aW9uKHN0YXRlLCBzdGFydFBvcykge1xuICBzdGF0ZS5yZWNvcmRGYWlsdXJlKHN0YXJ0UG9zLCB0aGlzKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnl0aGluZy5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscykge1xuICBzYi5hcHBlbmQoJ3RoaXMuYW55dGhpbmcoKScpO1xufTtcblxucGV4cHJzLmVuZC5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscykge1xuICBzYi5hcHBlbmQoJ3RoaXMuZW5kKCknKTtcbn07XG5cbnBleHBycy5QcmltLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscykge1xuICBzYi5hcHBlbmQoJ3RoaXMucHJpbSgnKTtcbiAgc2IuYXBwZW5kKHR5cGVvZiB0aGlzLm9iaiA9PT0gJ3N0cmluZycgPyBjb21tb24udG9TdHJpbmdMaXRlcmFsKHRoaXMub2JqKSA6ICcnICsgdGhpcy5vYmopO1xuICBzYi5hcHBlbmQoJyknKTtcbn07XG5cbnBleHBycy5QYXJhbS5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IsIGZvcm1hbHMpIHtcbiAgc2IuYXBwZW5kKCd0aGlzLnBhcmFtKCcgKyB0aGlzLmluZGV4ICsgJyknKTtcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiLCBmb3JtYWxzKSB7XG4gIHNiLmFwcGVuZCgndGhpcy5hbHQoJyk7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChpZHggPiAwKSB7XG4gICAgICBzYi5hcHBlbmQoJywgJyk7XG4gICAgfVxuICAgIHRoaXMudGVybXNbaWR4XS5vdXRwdXRSZWNpcGUoc2IsIGZvcm1hbHMpO1xuICB9XG4gIHNiLmFwcGVuZCgnKScpO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IsIGZvcm1hbHMpIHtcbiAgc2IuYXBwZW5kKCd0aGlzLnNlcSgnKTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAoaWR4ID4gMCkge1xuICAgICAgc2IuYXBwZW5kKCcsICcpO1xuICAgIH1cbiAgICB0aGlzLmZhY3RvcnNbaWR4XS5vdXRwdXRSZWNpcGUoc2IsIGZvcm1hbHMpO1xuICB9XG4gIHNiLmFwcGVuZCgnKScpO1xufTtcblxucGV4cHJzLlN0YXIucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiLCBmb3JtYWxzKSB7XG4gIHNiLmFwcGVuZCgndGhpcy5zdGFyKCcpO1xuICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHNiLCBmb3JtYWxzKTtcbiAgc2IuYXBwZW5kKCcpJyk7XG59O1xuXG5wZXhwcnMuUGx1cy5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IsIGZvcm1hbHMpIHtcbiAgc2IuYXBwZW5kKCd0aGlzLnBsdXMoJyk7XG4gIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUoc2IsIGZvcm1hbHMpO1xuICBzYi5hcHBlbmQoJyknKTtcbn07XG5cbnBleHBycy5PcHQucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiLCBmb3JtYWxzKSB7XG4gIHNiLmFwcGVuZCgndGhpcy5vcHQoJyk7XG4gIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUoc2IsIGZvcm1hbHMpO1xuICBzYi5hcHBlbmQoJyknKTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiLCBmb3JtYWxzKSB7XG4gIHNiLmFwcGVuZCgndGhpcy5ub3QoJyk7XG4gIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUoc2IsIGZvcm1hbHMpO1xuICBzYi5hcHBlbmQoJyknKTtcbn07XG5cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiLCBmb3JtYWxzKSB7XG4gIHNiLmFwcGVuZCgndGhpcy5sYSgnKTtcbiAgdGhpcy5leHByLm91dHB1dFJlY2lwZShzYiwgZm9ybWFscyk7XG4gIHNiLmFwcGVuZCgnKScpO1xufTtcblxucGV4cHJzLkFyci5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IsIGZvcm1hbHMpIHtcbiAgc2IuYXBwZW5kKCd0aGlzLmFycignKTtcbiAgdGhpcy5leHByLm91dHB1dFJlY2lwZShzYiwgZm9ybWFscyk7XG4gIHNiLmFwcGVuZCgnKScpO1xufTtcblxucGV4cHJzLlN0ci5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IsIGZvcm1hbHMpIHtcbiAgc2IuYXBwZW5kKCd0aGlzLnN0cignKTtcbiAgdGhpcy5leHByLm91dHB1dFJlY2lwZShzYiwgZm9ybWFscyk7XG4gIHNiLmFwcGVuZCgnKScpO1xufTtcblxucGV4cHJzLk9iai5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IsIGZvcm1hbHMpIHtcbiAgZnVuY3Rpb24gb3V0cHV0UHJvcGVydHlSZWNpcGUocHJvcCkge1xuICAgIHNiLmFwcGVuZCgne25hbWU6ICcpO1xuICAgIHNiLmFwcGVuZChjb21tb24udG9TdHJpbmdMaXRlcmFsKHByb3AubmFtZSkpO1xuICAgIHNiLmFwcGVuZCgnLCBwYXR0ZXJuOiAnKTtcbiAgICBwcm9wLnBhdHRlcm4ub3V0cHV0UmVjaXBlKHNiLCBmb3JtYWxzKTtcbiAgICBzYi5hcHBlbmQoJ30nKTtcbiAgfVxuXG4gIHNiLmFwcGVuZCgndGhpcy5vYmooWycpO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChpZHggPiAwKSB7XG4gICAgICBzYi5hcHBlbmQoJywgJyk7XG4gICAgfVxuICAgIG91dHB1dFByb3BlcnR5UmVjaXBlKHRoaXMucHJvcGVydGllc1tpZHhdKTtcbiAgfVxuICBzYi5hcHBlbmQoJ10sICcpO1xuICBzYi5hcHBlbmQoISF0aGlzLmlzTGVuaWVudCk7XG4gIHNiLmFwcGVuZCgnKScpO1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscykge1xuICBzYi5hcHBlbmQoJ3RoaXMuYXBwKCcpO1xuICBzYi5hcHBlbmQoY29tbW9uLnRvU3RyaW5nTGl0ZXJhbCh0aGlzLnJ1bGVOYW1lKSk7XG4gIGlmICh0aGlzLnJ1bGVOYW1lLmluZGV4T2YoJ18nKSA+PSAwICYmIGZvcm1hbHMubGVuZ3RoID4gMCkge1xuICAgIHZhciBhcHBzID0gZm9ybWFscy5cbiAgICAgICAgbWFwKGZ1bmN0aW9uKGZvcm1hbCkgeyByZXR1cm4gJ3RoaXMuYXBwKCcgKyBjb21tb24udG9TdHJpbmdMaXRlcmFsKGZvcm1hbCkgKyAnKSc7IH0pO1xuICAgIHNiLmFwcGVuZCgnLCBbJyArIGFwcHMuam9pbignLCAnKSArICddJyk7XG4gIH0gZWxzZSBpZiAodGhpcy5wYXJhbXMubGVuZ3RoID4gMCkge1xuICAgIHNiLmFwcGVuZCgnLCBbJyk7XG4gICAgdGhpcy5wYXJhbXMuZm9yRWFjaChmdW5jdGlvbihwYXJhbSwgaWR4KSB7XG4gICAgICBpZiAoaWR4ID4gMCkge1xuICAgICAgICBzYi5hcHBlbmQoJywgJyk7XG4gICAgICB9XG4gICAgICBwYXJhbS5vdXRwdXRSZWNpcGUoc2IsIGZvcm1hbHMpO1xuICAgIH0pO1xuICAgIHNiLmFwcGVuZCgnXScpO1xuICB9XG4gIHNiLmFwcGVuZCgnKScpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID0gZnVuY3Rpb24oYWN0dWFscykge1xuICByZXR1cm4gdGhpcztcbn07XG5cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uKGFjdHVhbHMpIHtcbiAgcmV0dXJuIGFjdHVhbHNbdGhpcy5pbmRleF07XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID0gZnVuY3Rpb24oYWN0dWFscykge1xuICByZXR1cm4gbmV3IHBleHBycy5BbHQoXG4gICAgICB0aGlzLnRlcm1zLm1hcChmdW5jdGlvbih0ZXJtKSB7IHJldHVybiB0ZXJtLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscyk7IH0pKTtcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbihhY3R1YWxzKSB7XG4gIHJldHVybiBuZXcgcGV4cHJzLlNlcShcbiAgICAgIHRoaXMuZmFjdG9ycy5tYXAoZnVuY3Rpb24oZmFjdG9yKSB7IHJldHVybiBmYWN0b3Iuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKTsgfSkpO1xufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxucGV4cHJzLk5vdC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID1cbnBleHBycy5BcnIucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxucGV4cHJzLlN0ci5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uKGFjdHVhbHMpIHtcbiAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMuZXhwci5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpKTtcbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbihhY3R1YWxzKSB7XG4gIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5wcm9wZXJ0aWVzLm1hcChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBwcm9wZXJ0eS5uYW1lLFxuICAgICAgcGF0dGVybjogcHJvcGVydHkucGF0dGVybi5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpXG4gICAgfTtcbiAgfSk7XG4gIHJldHVybiBuZXcgcGV4cHJzLk9iaihwcm9wZXJ0aWVzLCB0aGlzLmlzTGVuaWVudCk7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbihhY3R1YWxzKSB7XG4gIGlmICh0aGlzLnBhcmFtcy5sZW5ndGggPT09IDApIHtcbiAgICAvLyBBdm9pZCBtYWtpbmcgYSBjb3B5IG9mIHRoaXMgYXBwbGljYXRpb24sIGFzIGFuIG9wdGltaXphdGlvblxuICAgIHJldHVybiB0aGlzO1xuICB9IGVsc2Uge1xuICAgIHZhciBwYXJhbXMgPSB0aGlzLnBhcmFtcy5tYXAoZnVuY3Rpb24ocGFyYW0pIHsgcmV0dXJuIHBhcmFtLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscyk7IH0pO1xuICAgIHJldHVybiBuZXcgcGV4cHJzLkFwcGx5KHRoaXMucnVsZU5hbWUsIHBhcmFtcyk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBQRXhwciwgZm9yIHVzZSBhcyBhIFVJIGxhYmVsLCBldGMuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5pbnRlcnZhbCkge1xuICAgIHJldHVybiB0aGlzLmludGVydmFsLnRyaW1tZWQoKS5jb250ZW50cztcbiAgfVxuICByZXR1cm4gJ1snICsgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgJ10nO1xufTtcblxucGV4cHJzLmFueXRoaW5nLnRvRGlzcGxheVN0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ18nO1xufTtcblxucGV4cHJzLmVuZC50b0Rpc3BsYXlTdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdlbmQnO1xufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gU3RyaW5nKHRoaXMub2JqKTtcbn07XG5cbnBleHBycy5QYXJhbS5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnIycgKyB0aGlzLmluZGV4O1xufTtcblxucGV4cHJzLlN0cmluZ1ByaW0ucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ1wiJyArIHRoaXMub2JqICsgJ1wiJztcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnJ1bGVOYW1lO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLnRvRXhwZWN0ZWQgPSBmdW5jdGlvbihydWxlRGljdCkge1xuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxucGV4cHJzLmFueXRoaW5nLnRvRXhwZWN0ZWQgPSBmdW5jdGlvbihydWxlRGljdCkge1xuICByZXR1cm4gJ2FueSBvYmplY3QnO1xufTtcblxucGV4cHJzLmVuZC50b0V4cGVjdGVkID0gZnVuY3Rpb24ocnVsZURpY3QpIHtcbiAgcmV0dXJuICdlbmQgb2YgaW5wdXQnO1xufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLnRvRXhwZWN0ZWQgPSBmdW5jdGlvbihydWxlRGljdCkge1xuICByZXR1cm4gY29tbW9uLnRvU3RyaW5nTGl0ZXJhbCh0aGlzLm9iaik7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS50b0V4cGVjdGVkID0gZnVuY3Rpb24ocnVsZURpY3QpIHtcbiAgaWYgKHRoaXMuZXhwciA9PT0gcGV4cHJzLmFueXRoaW5nKSB7XG4gICAgcmV0dXJuICdub3RoaW5nJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ25vdCAnICsgdGhpcy5leHByLnRvRXhwZWN0ZWQocnVsZURpY3QpO1xuICB9XG59O1xuXG4vLyBUT0RPOiB0aGluayBhYm91dCBBcnIsIFN0ciwgYW5kIE9ialxuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnRvRXhwZWN0ZWQgPSBmdW5jdGlvbihydWxlRGljdCkge1xuICB2YXIgZGVzY3JpcHRpb24gPSBydWxlRGljdFt0aGlzLnJ1bGVOYW1lXS5kZXNjcmlwdGlvbjtcbiAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgcmV0dXJuIGRlc2NyaXB0aW9uO1xuICB9IGVsc2Uge1xuICAgIHZhciBhcnRpY2xlID0gKC9eW2FlaW91QUVJT1VdLy50ZXN0KHRoaXMucnVsZU5hbWUpID8gJ2FuJyA6ICdhJyk7XG4gICAgcmV0dXJuIGFydGljbGUgKyAnICcgKyB0aGlzLnJ1bGVOYW1lO1xuICB9XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLypcbiAgZTEudG9TdHJpbmcoKSA9PT0gZTIudG9TdHJpbmcoKSA9PT4gZTEgYW5kIGUyIGFyZSBzZW1hbnRpY2FsbHkgZXF1aXZhbGVudC5cbiAgTm90ZSB0aGF0IHRoaXMgaXMgbm90IGFuIGlmZiAoPD09Pik6IGUuZy4sXG4gICh+XCJiXCIgXCJhXCIpLnRvU3RyaW5nKCkgIT09IChcImFcIikudG9TdHJpbmcoKSwgZXZlbiB0aG91Z2hcbiAgflwiYlwiIFwiYVwiIGFuZCBcImFcIiBhcmUgaW50ZXJjaGFuZ2VhYmxlIGluIGFueSBncmFtbWFyLFxuICBib3RoIGluIHRlcm1zIG9mIHRoZSBsYW5ndWFnZXMgdGhleSBhY2NlcHQgYW5kIHRoZWlyIGFyaXRpZXMuXG4qL1xucGV4cHJzLlBFeHByLnByb3RvdHlwZS50b1N0cmluZyA9IGNvbW1vbi5hYnN0cmFjdDtcblxucGV4cHJzLmFueXRoaW5nLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnXyc7XG59O1xuXG5wZXhwcnMuZW5kLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnZW5kJztcbn07XG5cbnBleHBycy5QcmltLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5vYmopO1xufTtcblxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJyMnICsgdGhpcy5pbmRleDtcbn07XG5cbnBleHBycy5SZWdFeHBQcmltLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5vYmoudG9TdHJpbmcoKTtcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMSA/XG4gICAgdGhpcy50ZXJtc1swXS50b1N0cmluZygpIDpcbiAgICAnKCcgKyB0aGlzLnRlcm1zLm1hcChmdW5jdGlvbih0ZXJtKSB7IHJldHVybiB0ZXJtLnRvU3RyaW5nKCk7IH0pLmpvaW4oJyB8ICcpICsgJyknO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZmFjdG9ycy5sZW5ndGggPT09IDEgP1xuICAgIHRoaXMuZmFjdG9yc1swXS50b1N0cmluZygpIDpcbiAgICAnKCcgKyB0aGlzLmZhY3RvcnMubWFwKGZ1bmN0aW9uKGZhY3RvcikgeyByZXR1cm4gZmFjdG9yLnRvU3RyaW5nKCk7IH0pLmpvaW4oJyAnKSArICcpJztcbn07XG5cbnBleHBycy5JdGVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5leHByICsgdGhpcy5vcGVyYXRvcjtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnficgKyB0aGlzLmV4cHI7XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJyYnICsgdGhpcy5leHByO1xufTtcblxucGV4cHJzLkFyci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdbJyArIHRoaXMuZXhwci50b1N0cmluZygpICsgJ10nO1xufTtcblxucGV4cHJzLlN0ci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdgYCcgKyB0aGlzLmV4cHIudG9TdHJpbmcoKSArIFwiJydcIjtcbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXJ0cyA9IFsneyddO1xuXG4gIHZhciBmaXJzdCA9IHRydWU7XG4gIGZ1bmN0aW9uIGVtaXQocGFydCkge1xuICAgIGlmIChmaXJzdCkge1xuICAgICAgZmlyc3QgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFydHMucHVzaCgnLCAnKTtcbiAgICB9XG4gICAgcGFydHMucHVzaChwYXJ0KTtcbiAgfVxuXG4gIHRoaXMucHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgZW1pdChKU09OLnN0cmluZ2lmeShwcm9wZXJ0eS5uYW1lKSArICc6ICcgKyBwcm9wZXJ0eS5wYXR0ZXJuLnRvU3RyaW5nKCkpO1xuICB9KTtcbiAgaWYgKHRoaXMuaXNMZW5pZW50KSB7XG4gICAgZW1pdCgnLi4uJyk7XG4gIH1cblxuICBwYXJ0cy5wdXNoKCd9Jyk7XG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMucGFyYW1zLmxlbmd0aCA+IDApIHtcbiAgICB2YXIgcHMgPSB0aGlzLnBhcmFtcy5tYXAoZnVuY3Rpb24ocGFyYW0pIHsgcmV0dXJuIHBhcmFtLnRvU3RyaW5nKCk7IH0pO1xuICAgIHJldHVybiB0aGlzLnJ1bGVOYW1lICsgJzwnICsgcHMuam9pbignLCcpICsgJz4nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLnJ1bGVOYW1lO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBHZW5lcmFsIHN0dWZmXG5cbmZ1bmN0aW9uIFBFeHByKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoXCJQRXhwciBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0J3MgYWJzdHJhY3RcIik7XG59XG5cblBFeHByLnByb3RvdHlwZS53aXRoRGVzY3JpcHRpb24gPSBmdW5jdGlvbihkZXNjcmlwdGlvbikge1xuICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gIHJldHVybiB0aGlzO1xufTtcblxuUEV4cHIucHJvdG90eXBlLndpdGhJbnRlcnZhbCA9IGZ1bmN0aW9uKGludGVydmFsKSB7XG4gIHRoaXMuaW50ZXJ2YWwgPSBpbnRlcnZhbC50cmltbWVkKCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuUEV4cHIucHJvdG90eXBlLndpdGhGb3JtYWxzID0gZnVuY3Rpb24oZm9ybWFscykge1xuICB0aGlzLmZvcm1hbHMgPSBmb3JtYWxzO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIEFueXRoaW5nXG5cbnZhciBhbnl0aGluZyA9IE9iamVjdC5jcmVhdGUoUEV4cHIucHJvdG90eXBlKTtcblxuLy8gRW5kXG5cbnZhciBlbmQgPSBPYmplY3QuY3JlYXRlKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIFByaW1pdGl2ZXNcblxuZnVuY3Rpb24gUHJpbShvYmopIHtcbiAgdGhpcy5vYmogPSBvYmo7XG59XG5pbmhlcml0cyhQcmltLCBQRXhwcik7XG5cbmZ1bmN0aW9uIFN0cmluZ1ByaW0ob2JqKSB7XG4gIHRoaXMub2JqID0gb2JqO1xufVxuaW5oZXJpdHMoU3RyaW5nUHJpbSwgUHJpbSk7XG5cbmZ1bmN0aW9uIFJlZ0V4cFByaW0ob2JqKSB7XG4gIHRoaXMub2JqID0gb2JqO1xufVxuaW5oZXJpdHMoUmVnRXhwUHJpbSwgUHJpbSk7XG5cbi8vIFBhcmFtZXRlcnNcblxuZnVuY3Rpb24gUGFyYW0oaW5kZXgpIHtcbiAgdGhpcy5pbmRleCA9IGluZGV4O1xufVxuaW5oZXJpdHMoUGFyYW0sIFBFeHByKTtcblxuLy8gQWx0ZXJuYXRpb25cblxuZnVuY3Rpb24gQWx0KHRlcm1zKSB7XG4gIHRoaXMudGVybXMgPSB0ZXJtcztcbn1cbmluaGVyaXRzKEFsdCwgUEV4cHIpO1xuXG4vLyBFeHRlbmQgaXMgYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsIG9mIHJ1bGUgZXh0ZW5zaW9uXG5cbmZ1bmN0aW9uIEV4dGVuZChzdXBlckdyYW1tYXIsIG5hbWUsIGJvZHkpIHtcbiAgdmFyIG9yaWdCb2R5ID0gc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W25hbWVdO1xuICB0aGlzLnRlcm1zID0gW2JvZHksIG9yaWdCb2R5XTtcbn1cbmluaGVyaXRzKEV4dGVuZCwgQWx0KTtcblxuLy8gU2VxdWVuY2VzXG5cbmZ1bmN0aW9uIFNlcShmYWN0b3JzKSB7XG4gIHRoaXMuZmFjdG9ycyA9IGZhY3RvcnM7XG59XG5pbmhlcml0cyhTZXEsIFBFeHByKTtcblxuLy8gSXRlcmF0b3JzIGFuZCBvcHRpb25hbHNcblxuZnVuY3Rpb24gSXRlcihleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhJdGVyLCBQRXhwcik7XG5cbmZ1bmN0aW9uIFN0YXIoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoU3RhciwgSXRlcik7XG5cbmZ1bmN0aW9uIFBsdXMoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoUGx1cywgSXRlcik7XG5cbmZ1bmN0aW9uIE9wdChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhPcHQsIEl0ZXIpO1xuXG5TdGFyLnByb3RvdHlwZS5vcGVyYXRvciA9ICcqJztcblBsdXMucHJvdG90eXBlLm9wZXJhdG9yID0gJysnO1xuT3B0LnByb3RvdHlwZS5vcGVyYXRvciA9ICc/JztcblxuU3Rhci5wcm90b3R5cGUubWluTnVtTWF0Y2hlcyA9IDA7XG5QbHVzLnByb3RvdHlwZS5taW5OdW1NYXRjaGVzID0gMTtcbk9wdC5wcm90b3R5cGUubWluTnVtTWF0Y2hlcyA9IDA7XG5cblN0YXIucHJvdG90eXBlLm1heE51bU1hdGNoZXMgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG5QbHVzLnByb3RvdHlwZS5tYXhOdW1NYXRjaGVzID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuT3B0LnByb3RvdHlwZS5tYXhOdW1NYXRjaGVzID0gMTtcblxuLy8gUHJlZGljYXRlc1xuXG5mdW5jdGlvbiBOb3QoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoTm90LCBQRXhwcik7XG5cbmZ1bmN0aW9uIExvb2thaGVhZChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhMb29rYWhlYWQsIFBFeHByKTtcblxuLy8gQXJyYXkgZGVjb21wb3NpdGlvblxuXG5mdW5jdGlvbiBBcnIoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoQXJyLCBQRXhwcik7XG5cbi8vIFN0cmluZyBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIFN0cihleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhTdHIsIFBFeHByKTtcblxuLy8gT2JqZWN0IGRlY29tcG9zaXRpb25cblxuZnVuY3Rpb24gT2JqKHByb3BlcnRpZXMsIGlzTGVuaWVudCkge1xuICB2YXIgbmFtZXMgPSBwcm9wZXJ0aWVzLm1hcChmdW5jdGlvbihwcm9wZXJ0eSkgeyByZXR1cm4gcHJvcGVydHkubmFtZTsgfSk7XG4gIHZhciBkdXBsaWNhdGVzID0gY29tbW9uLmdldER1cGxpY2F0ZXMobmFtZXMpO1xuICBpZiAoZHVwbGljYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5EdXBsaWNhdGVQcm9wZXJ0eU5hbWVzKGR1cGxpY2F0ZXMpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG4gICAgdGhpcy5pc0xlbmllbnQgPSBpc0xlbmllbnQ7XG4gIH1cbn1cbmluaGVyaXRzKE9iaiwgUEV4cHIpO1xuXG4vLyBSdWxlIGFwcGxpY2F0aW9uXG5cbmZ1bmN0aW9uIEFwcGx5KHJ1bGVOYW1lLCBvcHRQYXJhbXMpIHtcbiAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lO1xuICB0aGlzLnBhcmFtcyA9IG9wdFBhcmFtcyB8fCBbXTtcbn1cbmluaGVyaXRzKEFwcGx5LCBQRXhwcik7XG5cbi8vIFRoaXMgbWV0aG9kIGp1c3QgY2FjaGVzIHRoZSByZXN1bHQgb2YgYHRoaXMudG9TdHJpbmcoKWAgaW4gYSBub24tZW51bWVyYWJsZSBwcm9wZXJ0eS5cbkFwcGx5LnByb3RvdHlwZS50b01lbW9LZXkgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLl9tZW1vS2V5KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdfbWVtb0tleScsIHt2YWx1ZTogdGhpcy50b1N0cmluZygpfSk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuX21lbW9LZXk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy5tYWtlUHJpbSA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycgJiYgb2JqLmxlbmd0aCAhPT0gMSkge1xuICAgIHJldHVybiBuZXcgU3RyaW5nUHJpbShvYmopO1xuICB9IGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwUHJpbShvYmopO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgUHJpbShvYmopO1xuICB9XG59O1xuXG5leHBvcnRzLlBFeHByID0gUEV4cHI7XG5leHBvcnRzLmFueXRoaW5nID0gYW55dGhpbmc7XG5leHBvcnRzLmVuZCA9IGVuZDtcbmV4cG9ydHMuUHJpbSA9IFByaW07XG5leHBvcnRzLlN0cmluZ1ByaW0gPSBTdHJpbmdQcmltO1xuZXhwb3J0cy5SZWdFeHBQcmltID0gUmVnRXhwUHJpbTtcbmV4cG9ydHMuUGFyYW0gPSBQYXJhbTtcbmV4cG9ydHMuQWx0ID0gQWx0O1xuZXhwb3J0cy5FeHRlbmQgPSBFeHRlbmQ7XG5leHBvcnRzLlNlcSA9IFNlcTtcbmV4cG9ydHMuSXRlciA9IEl0ZXI7XG5leHBvcnRzLlN0YXIgPSBTdGFyO1xuZXhwb3J0cy5QbHVzID0gUGx1cztcbmV4cG9ydHMuT3B0ID0gT3B0O1xuZXhwb3J0cy5Ob3QgPSBOb3Q7XG5leHBvcnRzLkxvb2thaGVhZCA9IExvb2thaGVhZDtcbmV4cG9ydHMuQXJyID0gQXJyO1xuZXhwb3J0cy5TdHIgPSBTdHI7XG5leHBvcnRzLk9iaiA9IE9iajtcbmV4cG9ydHMuQXBwbHkgPSBBcHBseTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4dGVuc2lvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnJlcXVpcmUoJy4vcGV4cHJzLWFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkJyk7XG5yZXF1aXJlKCcuL3BleHBycy1hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eScpO1xucmVxdWlyZSgnLi9wZXhwcnMtYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlJyk7XG5yZXF1aXJlKCcuL3BleHBycy1jaGVjaycpO1xucmVxdWlyZSgnLi9wZXhwcnMtZXZhbCcpO1xucmVxdWlyZSgnLi9wZXhwcnMtbWF5YmVSZWNvcmRGYWlsdXJlJyk7XG5yZXF1aXJlKCcuL3BleHBycy1nZXRBcml0eScpO1xucmVxdWlyZSgnLi9wZXhwcnMtb3V0cHV0UmVjaXBlJyk7XG5yZXF1aXJlKCcuL3BleHBycy1pbnRyb2R1Y2VQYXJhbXMnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWlzTnVsbGFibGUnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXN1YnN0aXR1dGVQYXJhbXMnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXRvRGlzcGxheVN0cmluZycpO1xucmVxdWlyZSgnLi9wZXhwcnMtdG9FeHBlY3RlZCcpO1xucmVxdWlyZSgnLi9wZXhwcnMtdG9TdHJpbmcnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gR2l2ZW4gYW4gYXJyYXkgb2YgbnVtYmVycyBgYXJyYCwgcmV0dXJuIGFuIGFycmF5IG9mIHRoZSBudW1iZXJzIGFzIHN0cmluZ3MsXG4vLyByaWdodC1qdXN0aWZpZWQgYW5kIHBhZGRlZCB0byB0aGUgc2FtZSBsZW5ndGguXG5mdW5jdGlvbiBwYWROdW1iZXJzVG9FcXVhbExlbmd0aChhcnIpIHtcbiAgdmFyIG1heExlbiA9IDA7XG4gIHZhciBzdHJpbmdzID0gYXJyLm1hcChmdW5jdGlvbihuKSB7XG4gICAgdmFyIHN0ciA9IG4udG9TdHJpbmcoKTtcbiAgICBtYXhMZW4gPSBNYXRoLm1heChtYXhMZW4sIHN0ci5sZW5ndGgpO1xuICAgIHJldHVybiBzdHI7XG4gIH0pO1xuICByZXR1cm4gc3RyaW5ncy5tYXAoZnVuY3Rpb24ocykgeyByZXR1cm4gY29tbW9uLnBhZExlZnQocywgbWF4TGVuKTsgfSk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBSZXR1cm4gYW4gb2JqZWN0IHdpdGggdGhlIGxpbmUgYW5kIGNvbHVtbiBpbmZvcm1hdGlvbiBmb3IgdGhlIGdpdmVuXG4vLyBvZmZzZXQgaW4gYHN0cmAuXG5leHBvcnRzLmdldExpbmVBbmRDb2x1bW4gPSBmdW5jdGlvbihzdHIsIG9mZnNldCkge1xuICB2YXIgbGluZU51bSA9IDE7XG4gIHZhciBjb2xOdW0gPSAxO1xuXG4gIHZhciBjdXJyT2Zmc2V0ID0gMDtcbiAgdmFyIGxpbmVTdGFydE9mZnNldCA9IDA7XG5cbiAgdmFyIG5leHRMaW5lID0gbnVsbDtcbiAgdmFyIHByZXZMaW5lID0gbnVsbDtcbiAgdmFyIHByZXZMaW5lU3RhcnRPZmZzZXQgPSAtMTtcblxuICB3aGlsZSAoY3Vyck9mZnNldCA8IG9mZnNldCkge1xuICAgIHZhciBjID0gc3RyLmNoYXJBdChjdXJyT2Zmc2V0KyspO1xuICAgIGlmIChjID09PSAnXFxuJykge1xuICAgICAgbGluZU51bSsrO1xuICAgICAgY29sTnVtID0gMTtcbiAgICAgIHByZXZMaW5lU3RhcnRPZmZzZXQgPSBsaW5lU3RhcnRPZmZzZXQ7XG4gICAgICBsaW5lU3RhcnRPZmZzZXQgPSBjdXJyT2Zmc2V0O1xuICAgIH0gZWxzZSBpZiAoYyAhPT0gJ1xccicpIHtcbiAgICAgIGNvbE51bSsrO1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmQgdGhlIGVuZCBvZiB0aGUgdGFyZ2V0IGxpbmUuXG4gIHZhciBsaW5lRW5kT2Zmc2V0ID0gc3RyLmluZGV4T2YoJ1xcbicsIGxpbmVTdGFydE9mZnNldCk7XG4gIGlmIChsaW5lRW5kT2Zmc2V0ID09PSAtMSkge1xuICAgIGxpbmVFbmRPZmZzZXQgPSBzdHIubGVuZ3RoO1xuICB9IGVsc2Uge1xuICAgIC8vIEdldCB0aGUgbmV4dCBsaW5lLlxuICAgIHZhciBuZXh0TGluZUVuZE9mZnNldCA9IHN0ci5pbmRleE9mKCdcXG4nLCBsaW5lRW5kT2Zmc2V0ICsgMSk7XG4gICAgbmV4dExpbmUgPSBuZXh0TGluZUVuZE9mZnNldCA9PT0gLTEgPyBzdHIuc2xpY2UobGluZUVuZE9mZnNldClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHN0ci5zbGljZShsaW5lRW5kT2Zmc2V0LCBuZXh0TGluZUVuZE9mZnNldCk7XG4gICAgLy8gU3RyaXAgbGVhZGluZyBhbmQgdHJhaWxpbmcgRU9MIGNoYXIocykuXG4gICAgbmV4dExpbmUgPSBuZXh0TGluZS5yZXBsYWNlKC9eXFxyP1xcbi8sICcnKS5yZXBsYWNlKC9cXHIkLywgJycpO1xuICB9XG5cbiAgLy8gR2V0IHRoZSBwcmV2aW91cyBsaW5lLlxuICBpZiAocHJldkxpbmVTdGFydE9mZnNldCA+PSAwKSB7XG4gICAgcHJldkxpbmUgPSBzdHIuc2xpY2UocHJldkxpbmVTdGFydE9mZnNldCwgbGluZVN0YXJ0T2Zmc2V0KVxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xccj9cXG4kLywgJycpOyAgLy8gU3RyaXAgdHJhaWxpbmcgRU9MIGNoYXIocykuXG4gIH1cblxuICAvLyBHZXQgdGhlIHRhcmdldCBsaW5lLCBzdHJpcHBpbmcgYSB0cmFpbGluZyBjYXJyaWFnZSByZXR1cm4gaWYgbmVjZXNzYXJ5LlxuICB2YXIgbGluZSA9IHN0ci5zbGljZShsaW5lU3RhcnRPZmZzZXQsIGxpbmVFbmRPZmZzZXQpLnJlcGxhY2UoL1xcciQvLCAnJyk7XG5cbiAgcmV0dXJuIHtcbiAgICBsaW5lTnVtOiBsaW5lTnVtLFxuICAgIGNvbE51bTogY29sTnVtLFxuICAgIGxpbmU6IGxpbmUsXG4gICAgcHJldkxpbmU6IHByZXZMaW5lLFxuICAgIG5leHRMaW5lOiBuZXh0TGluZVxuICB9O1xufTtcblxuLy8gUmV0dXJuIGEgbmljZWx5LWZvcm1hdHRlZCBzdHJpbmcgZGVzY3JpYmluZyB0aGUgbGluZSBhbmQgY29sdW1uIGZvciB0aGVcbi8vIGdpdmVuIG9mZnNldCBpbiBgc3RyYC5cbmV4cG9ydHMuZ2V0TGluZUFuZENvbHVtbk1lc3NhZ2UgPSBmdW5jdGlvbihzdHIsIG9mZnNldCkge1xuICB2YXIgbGluZUFuZENvbCA9IGV4cG9ydHMuZ2V0TGluZUFuZENvbHVtbihzdHIsIG9mZnNldCk7XG4gIHZhciBzYiA9IG5ldyBjb21tb24uU3RyaW5nQnVmZmVyKCk7XG4gIHNiLmFwcGVuZCgnTGluZSAnICsgbGluZUFuZENvbC5saW5lTnVtICsgJywgY29sICcgKyBsaW5lQW5kQ29sLmNvbE51bSArICc6XFxuJyk7XG5cbiAgLy8gQW4gYXJyYXkgb2YgdGhlIHByZXZpb3VzLCBjdXJyZW50LCBhbmQgbmV4dCBsaW5lIG51bWJlcnMgYXMgc3RyaW5ncyBvZiBlcXVhbCBsZW5ndGguXG4gIHZhciBsaW5lTnVtYmVycyA9IHBhZE51bWJlcnNUb0VxdWFsTGVuZ3RoKFtcbiAgICAgIGxpbmVBbmRDb2wucHJldkxpbmUgPT0gbnVsbCA/IDAgOiBsaW5lQW5kQ29sLmxpbmVOdW0gLSAxLFxuICAgICAgbGluZUFuZENvbC5saW5lTnVtLFxuICAgICAgbGluZUFuZENvbC5uZXh0TGluZSA9PSBudWxsID8gMCA6IGxpbmVBbmRDb2wubGluZU51bSArIDFcbiAgXSk7XG5cbiAgLy8gSGVscGVyIGZvciBhcHBlbmRpbmcgZm9ybWF0dGluZyBpbnB1dCBsaW5lcyB0byB0aGUgYnVmZmVyLlxuICBmdW5jdGlvbiBhcHBlbmRMaW5lKG51bSwgY29udGVudCwgcHJlZml4KSB7XG4gICAgc2IuYXBwZW5kKHByZWZpeCArIGxpbmVOdW1iZXJzW251bV0gKyAnIHwgJyArIGNvbnRlbnQgKyAnXFxuJyk7XG4gIH1cblxuICAvLyBJbmNsdWRlIHRoZSBwcmV2aW91cyBsaW5lIGZvciBjb250ZXh0IGlmIHBvc3NpYmxlLlxuICBpZiAobGluZUFuZENvbC5wcmV2TGluZSAhPSBudWxsKSB7XG4gICAgYXBwZW5kTGluZSgwLCBsaW5lQW5kQ29sLnByZXZMaW5lLCAnICAnKTtcbiAgfVxuICAvLyBMaW5lIHRoYXQgdGhlIGVycm9yIG9jY3VycmVkIG9uLlxuICBhcHBlbmRMaW5lKDEsIGxpbmVBbmRDb2wubGluZSwgJz4gJyk7XG5cbiAgLy8gTGluZSBpbmRpY2F0aW5nIHRoZSBjb2x1bW4gb24gd2hpY2ggdGhlIGVycm9yIG9jY3VycmVkLlxuICB2YXIgZ3V0dGVyV2lkdGggPSAyICsgbGluZU51bWJlcnNbMV0ubGVuZ3RoICsgMztcbiAgc2IuYXBwZW5kKGNvbW1vbi5wYWRMZWZ0KCdeJywgZ3V0dGVyV2lkdGggKyBsaW5lQW5kQ29sLmNvbE51bSkgKyAnXFxuJyk7XG5cbiAgLy8gSW5jbHVkZSB0aGUgbmV4dCBsaW5lIGZvciBjb250ZXh0IGlmIHBvc3NpYmxlLlxuICBpZiAobGluZUFuZENvbC5uZXh0TGluZSAhPSBudWxsKSB7XG4gICAgYXBwZW5kTGluZSgyLCBsaW5lQW5kQ29sLm5leHRMaW5lLCAnICAnKTtcbiAgfVxuICByZXR1cm4gc2IuY29udGVudHMoKTtcbn07XG4iLCIvLyBGcm9tIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvZXMtbGFiL3NvdXJjZS9icm93c2UvdHJ1bmsvc3JjL3BhcnNlci91bmljb2RlLmpzXG5leHBvcnRzLlVuaWNvZGVDYXRlZ29yaWVzID0ge1xuICBaV05KIDogL1xcdTIwMEMvLFxuICBaV0ogIDogL1xcdTIwMEQvLFxuICBUQUIgIDogL1xcdTAwMDkvLFxuICBWVCAgIDogL1xcdTAwMEIvLFxuICBGRiAgIDogL1xcdTAwMEMvLFxuICBTUCAgIDogL1xcdTAwMjAvLFxuICBOQlNQIDogL1xcdTAwQTAvLFxuICBCT00gIDogL1xcdUZFRkYvLFxuICBMRiAgIDogL1xcdTAwMEEvLFxuICBDUiAgIDogL1xcdTAwMEQvLFxuICBMUyAgIDogL1xcdTIwMjgvLFxuICBQUyAgIDogL1xcdTIwMjkvLFxuICBMICAgIDogL1tcXHUwMDQxLVxcdTAwNUFdfFtcXHUwMEMwLVxcdTAwRDZdfFtcXHUwMEQ4LVxcdTAwREVdfFtcXHUwMTAwLVxcdTAxMDBdfFtcXHUwMTAyLVxcdTAxMDJdfFtcXHUwMTA0LVxcdTAxMDRdfFtcXHUwMTA2LVxcdTAxMDZdfFtcXHUwMTA4LVxcdTAxMDhdfFtcXHUwMTBBLVxcdTAxMEFdfFtcXHUwMTBDLVxcdTAxMENdfFtcXHUwMTBFLVxcdTAxMEVdfFtcXHUwMTEwLVxcdTAxMTBdfFtcXHUwMTEyLVxcdTAxMTJdfFtcXHUwMTE0LVxcdTAxMTRdfFtcXHUwMTE2LVxcdTAxMTZdfFtcXHUwMTE4LVxcdTAxMThdfFtcXHUwMTFBLVxcdTAxMUFdfFtcXHUwMTFDLVxcdTAxMUNdfFtcXHUwMTFFLVxcdTAxMUVdfFtcXHUwMTIwLVxcdTAxMjBdfFtcXHUwMTIyLVxcdTAxMjJdfFtcXHUwMTI0LVxcdTAxMjRdfFtcXHUwMTI2LVxcdTAxMjZdfFtcXHUwMTI4LVxcdTAxMjhdfFtcXHUwMTJBLVxcdTAxMkFdfFtcXHUwMTJDLVxcdTAxMkNdfFtcXHUwMTJFLVxcdTAxMkVdfFtcXHUwMTMwLVxcdTAxMzBdfFtcXHUwMTMyLVxcdTAxMzJdfFtcXHUwMTM0LVxcdTAxMzRdfFtcXHUwMTM2LVxcdTAxMzZdfFtcXHUwMTM5LVxcdTAxMzldfFtcXHUwMTNCLVxcdTAxM0JdfFtcXHUwMTNELVxcdTAxM0RdfFtcXHUwMTNGLVxcdTAxM0ZdfFtcXHUwMTQxLVxcdTAxNDFdfFtcXHUwMTQzLVxcdTAxNDNdfFtcXHUwMTQ1LVxcdTAxNDVdfFtcXHUwMTQ3LVxcdTAxNDddfFtcXHUwMTRBLVxcdTAxNEFdfFtcXHUwMTRDLVxcdTAxNENdfFtcXHUwMTRFLVxcdTAxNEVdfFtcXHUwMTUwLVxcdTAxNTBdfFtcXHUwMTUyLVxcdTAxNTJdfFtcXHUwMTU0LVxcdTAxNTRdfFtcXHUwMTU2LVxcdTAxNTZdfFtcXHUwMTU4LVxcdTAxNThdfFtcXHUwMTVBLVxcdTAxNUFdfFtcXHUwMTVDLVxcdTAxNUNdfFtcXHUwMTVFLVxcdTAxNUVdfFtcXHUwMTYwLVxcdTAxNjBdfFtcXHUwMTYyLVxcdTAxNjJdfFtcXHUwMTY0LVxcdTAxNjRdfFtcXHUwMTY2LVxcdTAxNjZdfFtcXHUwMTY4LVxcdTAxNjhdfFtcXHUwMTZBLVxcdTAxNkFdfFtcXHUwMTZDLVxcdTAxNkNdfFtcXHUwMTZFLVxcdTAxNkVdfFtcXHUwMTcwLVxcdTAxNzBdfFtcXHUwMTcyLVxcdTAxNzJdfFtcXHUwMTc0LVxcdTAxNzRdfFtcXHUwMTc2LVxcdTAxNzZdfFtcXHUwMTc4LVxcdTAxNzldfFtcXHUwMTdCLVxcdTAxN0JdfFtcXHUwMTdELVxcdTAxN0RdfFtcXHUwMTgxLVxcdTAxODJdfFtcXHUwMTg0LVxcdTAxODRdfFtcXHUwMTg2LVxcdTAxODddfFtcXHUwMTg5LVxcdTAxOEJdfFtcXHUwMThFLVxcdTAxOTFdfFtcXHUwMTkzLVxcdTAxOTRdfFtcXHUwMTk2LVxcdTAxOThdfFtcXHUwMTlDLVxcdTAxOURdfFtcXHUwMTlGLVxcdTAxQTBdfFtcXHUwMUEyLVxcdTAxQTJdfFtcXHUwMUE0LVxcdTAxQTRdfFtcXHUwMUE2LVxcdTAxQTddfFtcXHUwMUE5LVxcdTAxQTldfFtcXHUwMUFDLVxcdTAxQUNdfFtcXHUwMUFFLVxcdTAxQUZdfFtcXHUwMUIxLVxcdTAxQjNdfFtcXHUwMUI1LVxcdTAxQjVdfFtcXHUwMUI3LVxcdTAxQjhdfFtcXHUwMUJDLVxcdTAxQkNdfFtcXHUwMUM0LVxcdTAxQzRdfFtcXHUwMUM3LVxcdTAxQzddfFtcXHUwMUNBLVxcdTAxQ0FdfFtcXHUwMUNELVxcdTAxQ0RdfFtcXHUwMUNGLVxcdTAxQ0ZdfFtcXHUwMUQxLVxcdTAxRDFdfFtcXHUwMUQzLVxcdTAxRDNdfFtcXHUwMUQ1LVxcdTAxRDVdfFtcXHUwMUQ3LVxcdTAxRDddfFtcXHUwMUQ5LVxcdTAxRDldfFtcXHUwMURCLVxcdTAxREJdfFtcXHUwMURFLVxcdTAxREVdfFtcXHUwMUUwLVxcdTAxRTBdfFtcXHUwMUUyLVxcdTAxRTJdfFtcXHUwMUU0LVxcdTAxRTRdfFtcXHUwMUU2LVxcdTAxRTZdfFtcXHUwMUU4LVxcdTAxRThdfFtcXHUwMUVBLVxcdTAxRUFdfFtcXHUwMUVDLVxcdTAxRUNdfFtcXHUwMUVFLVxcdTAxRUVdfFtcXHUwMUYxLVxcdTAxRjFdfFtcXHUwMUY0LVxcdTAxRjRdfFtcXHUwMUZBLVxcdTAxRkFdfFtcXHUwMUZDLVxcdTAxRkNdfFtcXHUwMUZFLVxcdTAxRkVdfFtcXHUwMjAwLVxcdTAyMDBdfFtcXHUwMjAyLVxcdTAyMDJdfFtcXHUwMjA0LVxcdTAyMDRdfFtcXHUwMjA2LVxcdTAyMDZdfFtcXHUwMjA4LVxcdTAyMDhdfFtcXHUwMjBBLVxcdTAyMEFdfFtcXHUwMjBDLVxcdTAyMENdfFtcXHUwMjBFLVxcdTAyMEVdfFtcXHUwMjEwLVxcdTAyMTBdfFtcXHUwMjEyLVxcdTAyMTJdfFtcXHUwMjE0LVxcdTAyMTRdfFtcXHUwMjE2LVxcdTAyMTZdfFtcXHUwMzg2LVxcdTAzODZdfFtcXHUwMzg4LVxcdTAzOEFdfFtcXHUwMzhDLVxcdTAzOENdfFtcXHUwMzhFLVxcdTAzOEZdfFtcXHUwMzkxLVxcdTAzQTFdfFtcXHUwM0EzLVxcdTAzQUJdfFtcXHUwM0QyLVxcdTAzRDRdfFtcXHUwM0RBLVxcdTAzREFdfFtcXHUwM0RDLVxcdTAzRENdfFtcXHUwM0RFLVxcdTAzREVdfFtcXHUwM0UwLVxcdTAzRTBdfFtcXHUwM0UyLVxcdTAzRTJdfFtcXHUwM0U0LVxcdTAzRTRdfFtcXHUwM0U2LVxcdTAzRTZdfFtcXHUwM0U4LVxcdTAzRThdfFtcXHUwM0VBLVxcdTAzRUFdfFtcXHUwM0VDLVxcdTAzRUNdfFtcXHUwM0VFLVxcdTAzRUVdfFtcXHUwNDAxLVxcdTA0MENdfFtcXHUwNDBFLVxcdTA0MkZdfFtcXHUwNDYwLVxcdTA0NjBdfFtcXHUwNDYyLVxcdTA0NjJdfFtcXHUwNDY0LVxcdTA0NjRdfFtcXHUwNDY2LVxcdTA0NjZdfFtcXHUwNDY4LVxcdTA0NjhdfFtcXHUwNDZBLVxcdTA0NkFdfFtcXHUwNDZDLVxcdTA0NkNdfFtcXHUwNDZFLVxcdTA0NkVdfFtcXHUwNDcwLVxcdTA0NzBdfFtcXHUwNDcyLVxcdTA0NzJdfFtcXHUwNDc0LVxcdTA0NzRdfFtcXHUwNDc2LVxcdTA0NzZdfFtcXHUwNDc4LVxcdTA0NzhdfFtcXHUwNDdBLVxcdTA0N0FdfFtcXHUwNDdDLVxcdTA0N0NdfFtcXHUwNDdFLVxcdTA0N0VdfFtcXHUwNDgwLVxcdTA0ODBdfFtcXHUwNDkwLVxcdTA0OTBdfFtcXHUwNDkyLVxcdTA0OTJdfFtcXHUwNDk0LVxcdTA0OTRdfFtcXHUwNDk2LVxcdTA0OTZdfFtcXHUwNDk4LVxcdTA0OThdfFtcXHUwNDlBLVxcdTA0OUFdfFtcXHUwNDlDLVxcdTA0OUNdfFtcXHUwNDlFLVxcdTA0OUVdfFtcXHUwNEEwLVxcdTA0QTBdfFtcXHUwNEEyLVxcdTA0QTJdfFtcXHUwNEE0LVxcdTA0QTRdfFtcXHUwNEE2LVxcdTA0QTZdfFtcXHUwNEE4LVxcdTA0QThdfFtcXHUwNEFBLVxcdTA0QUFdfFtcXHUwNEFDLVxcdTA0QUNdfFtcXHUwNEFFLVxcdTA0QUVdfFtcXHUwNEIwLVxcdTA0QjBdfFtcXHUwNEIyLVxcdTA0QjJdfFtcXHUwNEI0LVxcdTA0QjRdfFtcXHUwNEI2LVxcdTA0QjZdfFtcXHUwNEI4LVxcdTA0QjhdfFtcXHUwNEJBLVxcdTA0QkFdfFtcXHUwNEJDLVxcdTA0QkNdfFtcXHUwNEJFLVxcdTA0QkVdfFtcXHUwNEMxLVxcdTA0QzFdfFtcXHUwNEMzLVxcdTA0QzNdfFtcXHUwNEM3LVxcdTA0QzddfFtcXHUwNENCLVxcdTA0Q0JdfFtcXHUwNEQwLVxcdTA0RDBdfFtcXHUwNEQyLVxcdTA0RDJdfFtcXHUwNEQ0LVxcdTA0RDRdfFtcXHUwNEQ2LVxcdTA0RDZdfFtcXHUwNEQ4LVxcdTA0RDhdfFtcXHUwNERBLVxcdTA0REFdfFtcXHUwNERDLVxcdTA0RENdfFtcXHUwNERFLVxcdTA0REVdfFtcXHUwNEUwLVxcdTA0RTBdfFtcXHUwNEUyLVxcdTA0RTJdfFtcXHUwNEU0LVxcdTA0RTRdfFtcXHUwNEU2LVxcdTA0RTZdfFtcXHUwNEU4LVxcdTA0RThdfFtcXHUwNEVBLVxcdTA0RUFdfFtcXHUwNEVFLVxcdTA0RUVdfFtcXHUwNEYwLVxcdTA0RjBdfFtcXHUwNEYyLVxcdTA0RjJdfFtcXHUwNEY0LVxcdTA0RjRdfFtcXHUwNEY4LVxcdTA0RjhdfFtcXHUwNTMxLVxcdTA1NTZdfFtcXHUxMEEwLVxcdTEwQzVdfFtcXHUxRTAwLVxcdTFFMDBdfFtcXHUxRTAyLVxcdTFFMDJdfFtcXHUxRTA0LVxcdTFFMDRdfFtcXHUxRTA2LVxcdTFFMDZdfFtcXHUxRTA4LVxcdTFFMDhdfFtcXHUxRTBBLVxcdTFFMEFdfFtcXHUxRTBDLVxcdTFFMENdfFtcXHUxRTBFLVxcdTFFMEVdfFtcXHUxRTEwLVxcdTFFMTBdfFtcXHUxRTEyLVxcdTFFMTJdfFtcXHUxRTE0LVxcdTFFMTRdfFtcXHUxRTE2LVxcdTFFMTZdfFtcXHUxRTE4LVxcdTFFMThdfFtcXHUxRTFBLVxcdTFFMUFdfFtcXHUxRTFDLVxcdTFFMUNdfFtcXHUxRTFFLVxcdTFFMUVdfFtcXHUxRTIwLVxcdTFFMjBdfFtcXHUxRTIyLVxcdTFFMjJdfFtcXHUxRTI0LVxcdTFFMjRdfFtcXHUxRTI2LVxcdTFFMjZdfFtcXHUxRTI4LVxcdTFFMjhdfFtcXHUxRTJBLVxcdTFFMkFdfFtcXHUxRTJDLVxcdTFFMkNdfFtcXHUxRTJFLVxcdTFFMkVdfFtcXHUxRTMwLVxcdTFFMzBdfFtcXHUxRTMyLVxcdTFFMzJdfFtcXHUxRTM0LVxcdTFFMzRdfFtcXHUxRTM2LVxcdTFFMzZdfFtcXHUxRTM4LVxcdTFFMzhdfFtcXHUxRTNBLVxcdTFFM0FdfFtcXHUxRTNDLVxcdTFFM0NdfFtcXHUxRTNFLVxcdTFFM0VdfFtcXHUxRTQwLVxcdTFFNDBdfFtcXHUxRTQyLVxcdTFFNDJdfFtcXHUxRTQ0LVxcdTFFNDRdfFtcXHUxRTQ2LVxcdTFFNDZdfFtcXHUxRTQ4LVxcdTFFNDhdfFtcXHUxRTRBLVxcdTFFNEFdfFtcXHUxRTRDLVxcdTFFNENdfFtcXHUxRTRFLVxcdTFFNEVdfFtcXHUxRTUwLVxcdTFFNTBdfFtcXHUxRTUyLVxcdTFFNTJdfFtcXHUxRTU0LVxcdTFFNTRdfFtcXHUxRTU2LVxcdTFFNTZdfFtcXHUxRTU4LVxcdTFFNThdfFtcXHUxRTVBLVxcdTFFNUFdfFtcXHUxRTVDLVxcdTFFNUNdfFtcXHUxRTVFLVxcdTFFNUVdfFtcXHUxRTYwLVxcdTFFNjBdfFtcXHUxRTYyLVxcdTFFNjJdfFtcXHUxRTY0LVxcdTFFNjRdfFtcXHUxRTY2LVxcdTFFNjZdfFtcXHUxRTY4LVxcdTFFNjhdfFtcXHUxRTZBLVxcdTFFNkFdfFtcXHUxRTZDLVxcdTFFNkNdfFtcXHUxRTZFLVxcdTFFNkVdfFtcXHUxRTcwLVxcdTFFNzBdfFtcXHUxRTcyLVxcdTFFNzJdfFtcXHUxRTc0LVxcdTFFNzRdfFtcXHUxRTc2LVxcdTFFNzZdfFtcXHUxRTc4LVxcdTFFNzhdfFtcXHUxRTdBLVxcdTFFN0FdfFtcXHUxRTdDLVxcdTFFN0NdfFtcXHUxRTdFLVxcdTFFN0VdfFtcXHUxRTgwLVxcdTFFODBdfFtcXHUxRTgyLVxcdTFFODJdfFtcXHUxRTg0LVxcdTFFODRdfFtcXHUxRTg2LVxcdTFFODZdfFtcXHUxRTg4LVxcdTFFODhdfFtcXHUxRThBLVxcdTFFOEFdfFtcXHUxRThDLVxcdTFFOENdfFtcXHUxRThFLVxcdTFFOEVdfFtcXHUxRTkwLVxcdTFFOTBdfFtcXHUxRTkyLVxcdTFFOTJdfFtcXHUxRTk0LVxcdTFFOTRdfFtcXHUxRUEwLVxcdTFFQTBdfFtcXHUxRUEyLVxcdTFFQTJdfFtcXHUxRUE0LVxcdTFFQTRdfFtcXHUxRUE2LVxcdTFFQTZdfFtcXHUxRUE4LVxcdTFFQThdfFtcXHUxRUFBLVxcdTFFQUFdfFtcXHUxRUFDLVxcdTFFQUNdfFtcXHUxRUFFLVxcdTFFQUVdfFtcXHUxRUIwLVxcdTFFQjBdfFtcXHUxRUIyLVxcdTFFQjJdfFtcXHUxRUI0LVxcdTFFQjRdfFtcXHUxRUI2LVxcdTFFQjZdfFtcXHUxRUI4LVxcdTFFQjhdfFtcXHUxRUJBLVxcdTFFQkFdfFtcXHUxRUJDLVxcdTFFQkNdfFtcXHUxRUJFLVxcdTFFQkVdfFtcXHUxRUMwLVxcdTFFQzBdfFtcXHUxRUMyLVxcdTFFQzJdfFtcXHUxRUM0LVxcdTFFQzRdfFtcXHUxRUM2LVxcdTFFQzZdfFtcXHUxRUM4LVxcdTFFQzhdfFtcXHUxRUNBLVxcdTFFQ0FdfFtcXHUxRUNDLVxcdTFFQ0NdfFtcXHUxRUNFLVxcdTFFQ0VdfFtcXHUxRUQwLVxcdTFFRDBdfFtcXHUxRUQyLVxcdTFFRDJdfFtcXHUxRUQ0LVxcdTFFRDRdfFtcXHUxRUQ2LVxcdTFFRDZdfFtcXHUxRUQ4LVxcdTFFRDhdfFtcXHUxRURBLVxcdTFFREFdfFtcXHUxRURDLVxcdTFFRENdfFtcXHUxRURFLVxcdTFFREVdfFtcXHUxRUUwLVxcdTFFRTBdfFtcXHUxRUUyLVxcdTFFRTJdfFtcXHUxRUU0LVxcdTFFRTRdfFtcXHUxRUU2LVxcdTFFRTZdfFtcXHUxRUU4LVxcdTFFRThdfFtcXHUxRUVBLVxcdTFFRUFdfFtcXHUxRUVDLVxcdTFFRUNdfFtcXHUxRUVFLVxcdTFFRUVdfFtcXHUxRUYwLVxcdTFFRjBdfFtcXHUxRUYyLVxcdTFFRjJdfFtcXHUxRUY0LVxcdTFFRjRdfFtcXHUxRUY2LVxcdTFFRjZdfFtcXHUxRUY4LVxcdTFFRjhdfFtcXHUxRjA4LVxcdTFGMEZdfFtcXHUxRjE4LVxcdTFGMURdfFtcXHUxRjI4LVxcdTFGMkZdfFtcXHUxRjM4LVxcdTFGM0ZdfFtcXHUxRjQ4LVxcdTFGNERdfFtcXHUxRjU5LVxcdTFGNTldfFtcXHUxRjVCLVxcdTFGNUJdfFtcXHUxRjVELVxcdTFGNURdfFtcXHUxRjVGLVxcdTFGNUZdfFtcXHUxRjY4LVxcdTFGNkZdfFtcXHUxRjg4LVxcdTFGOEZdfFtcXHUxRjk4LVxcdTFGOUZdfFtcXHUxRkE4LVxcdTFGQUZdfFtcXHUxRkI4LVxcdTFGQkNdfFtcXHUxRkM4LVxcdTFGQ0NdfFtcXHUxRkQ4LVxcdTFGREJdfFtcXHUxRkU4LVxcdTFGRUNdfFtcXHUxRkY4LVxcdTFGRkNdfFtcXHUyMTAyLVxcdTIxMDJdfFtcXHUyMTA3LVxcdTIxMDddfFtcXHUyMTBCLVxcdTIxMERdfFtcXHUyMTEwLVxcdTIxMTJdfFtcXHUyMTE1LVxcdTIxMTVdfFtcXHUyMTE5LVxcdTIxMURdfFtcXHUyMTI0LVxcdTIxMjRdfFtcXHUyMTI2LVxcdTIxMjZdfFtcXHUyMTI4LVxcdTIxMjhdfFtcXHUyMTJBLVxcdTIxMkRdfFtcXHUyMTMwLVxcdTIxMzFdfFtcXHUyMTMzLVxcdTIxMzNdfFtcXHVGRjIxLVxcdUZGM0FdfFtcXHUwMDYxLVxcdTAwN0FdfFtcXHUwMEFBLVxcdTAwQUFdfFtcXHUwMEI1LVxcdTAwQjVdfFtcXHUwMEJBLVxcdTAwQkFdfFtcXHUwMERGLVxcdTAwRjZdfFtcXHUwMEY4LVxcdTAwRkZdfFtcXHUwMTAxLVxcdTAxMDFdfFtcXHUwMTAzLVxcdTAxMDNdfFtcXHUwMTA1LVxcdTAxMDVdfFtcXHUwMTA3LVxcdTAxMDddfFtcXHUwMTA5LVxcdTAxMDldfFtcXHUwMTBCLVxcdTAxMEJdfFtcXHUwMTBELVxcdTAxMERdfFtcXHUwMTBGLVxcdTAxMEZdfFtcXHUwMTExLVxcdTAxMTFdfFtcXHUwMTEzLVxcdTAxMTNdfFtcXHUwMTE1LVxcdTAxMTVdfFtcXHUwMTE3LVxcdTAxMTddfFtcXHUwMTE5LVxcdTAxMTldfFtcXHUwMTFCLVxcdTAxMUJdfFtcXHUwMTFELVxcdTAxMURdfFtcXHUwMTFGLVxcdTAxMUZdfFtcXHUwMTIxLVxcdTAxMjFdfFtcXHUwMTIzLVxcdTAxMjNdfFtcXHUwMTI1LVxcdTAxMjVdfFtcXHUwMTI3LVxcdTAxMjddfFtcXHUwMTI5LVxcdTAxMjldfFtcXHUwMTJCLVxcdTAxMkJdfFtcXHUwMTJELVxcdTAxMkRdfFtcXHUwMTJGLVxcdTAxMkZdfFtcXHUwMTMxLVxcdTAxMzFdfFtcXHUwMTMzLVxcdTAxMzNdfFtcXHUwMTM1LVxcdTAxMzVdfFtcXHUwMTM3LVxcdTAxMzhdfFtcXHUwMTNBLVxcdTAxM0FdfFtcXHUwMTNDLVxcdTAxM0NdfFtcXHUwMTNFLVxcdTAxM0VdfFtcXHUwMTQwLVxcdTAxNDBdfFtcXHUwMTQyLVxcdTAxNDJdfFtcXHUwMTQ0LVxcdTAxNDRdfFtcXHUwMTQ2LVxcdTAxNDZdfFtcXHUwMTQ4LVxcdTAxNDldfFtcXHUwMTRCLVxcdTAxNEJdfFtcXHUwMTRELVxcdTAxNERdfFtcXHUwMTRGLVxcdTAxNEZdfFtcXHUwMTUxLVxcdTAxNTFdfFtcXHUwMTUzLVxcdTAxNTNdfFtcXHUwMTU1LVxcdTAxNTVdfFtcXHUwMTU3LVxcdTAxNTddfFtcXHUwMTU5LVxcdTAxNTldfFtcXHUwMTVCLVxcdTAxNUJdfFtcXHUwMTVELVxcdTAxNURdfFtcXHUwMTVGLVxcdTAxNUZdfFtcXHUwMTYxLVxcdTAxNjFdfFtcXHUwMTYzLVxcdTAxNjNdfFtcXHUwMTY1LVxcdTAxNjVdfFtcXHUwMTY3LVxcdTAxNjddfFtcXHUwMTY5LVxcdTAxNjldfFtcXHUwMTZCLVxcdTAxNkJdfFtcXHUwMTZELVxcdTAxNkRdfFtcXHUwMTZGLVxcdTAxNkZdfFtcXHUwMTcxLVxcdTAxNzFdfFtcXHUwMTczLVxcdTAxNzNdfFtcXHUwMTc1LVxcdTAxNzVdfFtcXHUwMTc3LVxcdTAxNzddfFtcXHUwMTdBLVxcdTAxN0FdfFtcXHUwMTdDLVxcdTAxN0NdfFtcXHUwMTdFLVxcdTAxODBdfFtcXHUwMTgzLVxcdTAxODNdfFtcXHUwMTg1LVxcdTAxODVdfFtcXHUwMTg4LVxcdTAxODhdfFtcXHUwMThDLVxcdTAxOERdfFtcXHUwMTkyLVxcdTAxOTJdfFtcXHUwMTk1LVxcdTAxOTVdfFtcXHUwMTk5LVxcdTAxOUJdfFtcXHUwMTlFLVxcdTAxOUVdfFtcXHUwMUExLVxcdTAxQTFdfFtcXHUwMUEzLVxcdTAxQTNdfFtcXHUwMUE1LVxcdTAxQTVdfFtcXHUwMUE4LVxcdTAxQThdfFtcXHUwMUFCLVxcdTAxQUJdfFtcXHUwMUFELVxcdTAxQURdfFtcXHUwMUIwLVxcdTAxQjBdfFtcXHUwMUI0LVxcdTAxQjRdfFtcXHUwMUI2LVxcdTAxQjZdfFtcXHUwMUI5LVxcdTAxQkFdfFtcXHUwMUJELVxcdTAxQkRdfFtcXHUwMUM2LVxcdTAxQzZdfFtcXHUwMUM5LVxcdTAxQzldfFtcXHUwMUNDLVxcdTAxQ0NdfFtcXHUwMUNFLVxcdTAxQ0VdfFtcXHUwMUQwLVxcdTAxRDBdfFtcXHUwMUQyLVxcdTAxRDJdfFtcXHUwMUQ0LVxcdTAxRDRdfFtcXHUwMUQ2LVxcdTAxRDZdfFtcXHUwMUQ4LVxcdTAxRDhdfFtcXHUwMURBLVxcdTAxREFdfFtcXHUwMURDLVxcdTAxRERdfFtcXHUwMURGLVxcdTAxREZdfFtcXHUwMUUxLVxcdTAxRTFdfFtcXHUwMUUzLVxcdTAxRTNdfFtcXHUwMUU1LVxcdTAxRTVdfFtcXHUwMUU3LVxcdTAxRTddfFtcXHUwMUU5LVxcdTAxRTldfFtcXHUwMUVCLVxcdTAxRUJdfFtcXHUwMUVELVxcdTAxRURdfFtcXHUwMUVGLVxcdTAxRjBdfFtcXHUwMUYzLVxcdTAxRjNdfFtcXHUwMUY1LVxcdTAxRjVdfFtcXHUwMUZCLVxcdTAxRkJdfFtcXHUwMUZELVxcdTAxRkRdfFtcXHUwMUZGLVxcdTAxRkZdfFtcXHUwMjAxLVxcdTAyMDFdfFtcXHUwMjAzLVxcdTAyMDNdfFtcXHUwMjA1LVxcdTAyMDVdfFtcXHUwMjA3LVxcdTAyMDddfFtcXHUwMjA5LVxcdTAyMDldfFtcXHUwMjBCLVxcdTAyMEJdfFtcXHUwMjBELVxcdTAyMERdfFtcXHUwMjBGLVxcdTAyMEZdfFtcXHUwMjExLVxcdTAyMTFdfFtcXHUwMjEzLVxcdTAyMTNdfFtcXHUwMjE1LVxcdTAyMTVdfFtcXHUwMjE3LVxcdTAyMTddfFtcXHUwMjUwLVxcdTAyQThdfFtcXHUwMzkwLVxcdTAzOTBdfFtcXHUwM0FDLVxcdTAzQ0VdfFtcXHUwM0QwLVxcdTAzRDFdfFtcXHUwM0Q1LVxcdTAzRDZdfFtcXHUwM0UzLVxcdTAzRTNdfFtcXHUwM0U1LVxcdTAzRTVdfFtcXHUwM0U3LVxcdTAzRTddfFtcXHUwM0U5LVxcdTAzRTldfFtcXHUwM0VCLVxcdTAzRUJdfFtcXHUwM0VELVxcdTAzRURdfFtcXHUwM0VGLVxcdTAzRjJdfFtcXHUwNDMwLVxcdTA0NEZdfFtcXHUwNDUxLVxcdTA0NUNdfFtcXHUwNDVFLVxcdTA0NUZdfFtcXHUwNDYxLVxcdTA0NjFdfFtcXHUwNDYzLVxcdTA0NjNdfFtcXHUwNDY1LVxcdTA0NjVdfFtcXHUwNDY3LVxcdTA0NjddfFtcXHUwNDY5LVxcdTA0NjldfFtcXHUwNDZCLVxcdTA0NkJdfFtcXHUwNDZELVxcdTA0NkRdfFtcXHUwNDZGLVxcdTA0NkZdfFtcXHUwNDcxLVxcdTA0NzFdfFtcXHUwNDczLVxcdTA0NzNdfFtcXHUwNDc1LVxcdTA0NzVdfFtcXHUwNDc3LVxcdTA0NzddfFtcXHUwNDc5LVxcdTA0NzldfFtcXHUwNDdCLVxcdTA0N0JdfFtcXHUwNDdELVxcdTA0N0RdfFtcXHUwNDdGLVxcdTA0N0ZdfFtcXHUwNDgxLVxcdTA0ODFdfFtcXHUwNDkxLVxcdTA0OTFdfFtcXHUwNDkzLVxcdTA0OTNdfFtcXHUwNDk1LVxcdTA0OTVdfFtcXHUwNDk3LVxcdTA0OTddfFtcXHUwNDk5LVxcdTA0OTldfFtcXHUwNDlCLVxcdTA0OUJdfFtcXHUwNDlELVxcdTA0OURdfFtcXHUwNDlGLVxcdTA0OUZdfFtcXHUwNEExLVxcdTA0QTFdfFtcXHUwNEEzLVxcdTA0QTNdfFtcXHUwNEE1LVxcdTA0QTVdfFtcXHUwNEE3LVxcdTA0QTddfFtcXHUwNEE5LVxcdTA0QTldfFtcXHUwNEFCLVxcdTA0QUJdfFtcXHUwNEFELVxcdTA0QURdfFtcXHUwNEFGLVxcdTA0QUZdfFtcXHUwNEIxLVxcdTA0QjFdfFtcXHUwNEIzLVxcdTA0QjNdfFtcXHUwNEI1LVxcdTA0QjVdfFtcXHUwNEI3LVxcdTA0QjddfFtcXHUwNEI5LVxcdTA0QjldfFtcXHUwNEJCLVxcdTA0QkJdfFtcXHUwNEJELVxcdTA0QkRdfFtcXHUwNEJGLVxcdTA0QkZdfFtcXHUwNEMyLVxcdTA0QzJdfFtcXHUwNEM0LVxcdTA0QzRdfFtcXHUwNEM4LVxcdTA0QzhdfFtcXHUwNENDLVxcdTA0Q0NdfFtcXHUwNEQxLVxcdTA0RDFdfFtcXHUwNEQzLVxcdTA0RDNdfFtcXHUwNEQ1LVxcdTA0RDVdfFtcXHUwNEQ3LVxcdTA0RDddfFtcXHUwNEQ5LVxcdTA0RDldfFtcXHUwNERCLVxcdTA0REJdfFtcXHUwNERELVxcdTA0RERdfFtcXHUwNERGLVxcdTA0REZdfFtcXHUwNEUxLVxcdTA0RTFdfFtcXHUwNEUzLVxcdTA0RTNdfFtcXHUwNEU1LVxcdTA0RTVdfFtcXHUwNEU3LVxcdTA0RTddfFtcXHUwNEU5LVxcdTA0RTldfFtcXHUwNEVCLVxcdTA0RUJdfFtcXHUwNEVGLVxcdTA0RUZdfFtcXHUwNEYxLVxcdTA0RjFdfFtcXHUwNEYzLVxcdTA0RjNdfFtcXHUwNEY1LVxcdTA0RjVdfFtcXHUwNEY5LVxcdTA0RjldfFtcXHUwNTYxLVxcdTA1ODddfFtcXHUxMEQwLVxcdTEwRjZdfFtcXHUxRTAxLVxcdTFFMDFdfFtcXHUxRTAzLVxcdTFFMDNdfFtcXHUxRTA1LVxcdTFFMDVdfFtcXHUxRTA3LVxcdTFFMDddfFtcXHUxRTA5LVxcdTFFMDldfFtcXHUxRTBCLVxcdTFFMEJdfFtcXHUxRTBELVxcdTFFMERdfFtcXHUxRTBGLVxcdTFFMEZdfFtcXHUxRTExLVxcdTFFMTFdfFtcXHUxRTEzLVxcdTFFMTNdfFtcXHUxRTE1LVxcdTFFMTVdfFtcXHUxRTE3LVxcdTFFMTddfFtcXHUxRTE5LVxcdTFFMTldfFtcXHUxRTFCLVxcdTFFMUJdfFtcXHUxRTFELVxcdTFFMURdfFtcXHUxRTFGLVxcdTFFMUZdfFtcXHUxRTIxLVxcdTFFMjFdfFtcXHUxRTIzLVxcdTFFMjNdfFtcXHUxRTI1LVxcdTFFMjVdfFtcXHUxRTI3LVxcdTFFMjddfFtcXHUxRTI5LVxcdTFFMjldfFtcXHUxRTJCLVxcdTFFMkJdfFtcXHUxRTJELVxcdTFFMkRdfFtcXHUxRTJGLVxcdTFFMkZdfFtcXHUxRTMxLVxcdTFFMzFdfFtcXHUxRTMzLVxcdTFFMzNdfFtcXHUxRTM1LVxcdTFFMzVdfFtcXHUxRTM3LVxcdTFFMzddfFtcXHUxRTM5LVxcdTFFMzldfFtcXHUxRTNCLVxcdTFFM0JdfFtcXHUxRTNELVxcdTFFM0RdfFtcXHUxRTNGLVxcdTFFM0ZdfFtcXHUxRTQxLVxcdTFFNDFdfFtcXHUxRTQzLVxcdTFFNDNdfFtcXHUxRTQ1LVxcdTFFNDVdfFtcXHUxRTQ3LVxcdTFFNDddfFtcXHUxRTQ5LVxcdTFFNDldfFtcXHUxRTRCLVxcdTFFNEJdfFtcXHUxRTRELVxcdTFFNERdfFtcXHUxRTRGLVxcdTFFNEZdfFtcXHUxRTUxLVxcdTFFNTFdfFtcXHUxRTUzLVxcdTFFNTNdfFtcXHUxRTU1LVxcdTFFNTVdfFtcXHUxRTU3LVxcdTFFNTddfFtcXHUxRTU5LVxcdTFFNTldfFtcXHUxRTVCLVxcdTFFNUJdfFtcXHUxRTVELVxcdTFFNURdfFtcXHUxRTVGLVxcdTFFNUZdfFtcXHUxRTYxLVxcdTFFNjFdfFtcXHUxRTYzLVxcdTFFNjNdfFtcXHUxRTY1LVxcdTFFNjVdfFtcXHUxRTY3LVxcdTFFNjddfFtcXHUxRTY5LVxcdTFFNjldfFtcXHUxRTZCLVxcdTFFNkJdfFtcXHUxRTZELVxcdTFFNkRdfFtcXHUxRTZGLVxcdTFFNkZdfFtcXHUxRTcxLVxcdTFFNzFdfFtcXHUxRTczLVxcdTFFNzNdfFtcXHUxRTc1LVxcdTFFNzVdfFtcXHUxRTc3LVxcdTFFNzddfFtcXHUxRTc5LVxcdTFFNzldfFtcXHUxRTdCLVxcdTFFN0JdfFtcXHUxRTdELVxcdTFFN0RdfFtcXHUxRTdGLVxcdTFFN0ZdfFtcXHUxRTgxLVxcdTFFODFdfFtcXHUxRTgzLVxcdTFFODNdfFtcXHUxRTg1LVxcdTFFODVdfFtcXHUxRTg3LVxcdTFFODddfFtcXHUxRTg5LVxcdTFFODldfFtcXHUxRThCLVxcdTFFOEJdfFtcXHUxRThELVxcdTFFOERdfFtcXHUxRThGLVxcdTFFOEZdfFtcXHUxRTkxLVxcdTFFOTFdfFtcXHUxRTkzLVxcdTFFOTNdfFtcXHUxRTk1LVxcdTFFOUJdfFtcXHUxRUExLVxcdTFFQTFdfFtcXHUxRUEzLVxcdTFFQTNdfFtcXHUxRUE1LVxcdTFFQTVdfFtcXHUxRUE3LVxcdTFFQTddfFtcXHUxRUE5LVxcdTFFQTldfFtcXHUxRUFCLVxcdTFFQUJdfFtcXHUxRUFELVxcdTFFQURdfFtcXHUxRUFGLVxcdTFFQUZdfFtcXHUxRUIxLVxcdTFFQjFdfFtcXHUxRUIzLVxcdTFFQjNdfFtcXHUxRUI1LVxcdTFFQjVdfFtcXHUxRUI3LVxcdTFFQjddfFtcXHUxRUI5LVxcdTFFQjldfFtcXHUxRUJCLVxcdTFFQkJdfFtcXHUxRUJELVxcdTFFQkRdfFtcXHUxRUJGLVxcdTFFQkZdfFtcXHUxRUMxLVxcdTFFQzFdfFtcXHUxRUMzLVxcdTFFQzNdfFtcXHUxRUM1LVxcdTFFQzVdfFtcXHUxRUM3LVxcdTFFQzddfFtcXHUxRUM5LVxcdTFFQzldfFtcXHUxRUNCLVxcdTFFQ0JdfFtcXHUxRUNELVxcdTFFQ0RdfFtcXHUxRUNGLVxcdTFFQ0ZdfFtcXHUxRUQxLVxcdTFFRDFdfFtcXHUxRUQzLVxcdTFFRDNdfFtcXHUxRUQ1LVxcdTFFRDVdfFtcXHUxRUQ3LVxcdTFFRDddfFtcXHUxRUQ5LVxcdTFFRDldfFtcXHUxRURCLVxcdTFFREJdfFtcXHUxRURELVxcdTFFRERdfFtcXHUxRURGLVxcdTFFREZdfFtcXHUxRUUxLVxcdTFFRTFdfFtcXHUxRUUzLVxcdTFFRTNdfFtcXHUxRUU1LVxcdTFFRTVdfFtcXHUxRUU3LVxcdTFFRTddfFtcXHUxRUU5LVxcdTFFRTldfFtcXHUxRUVCLVxcdTFFRUJdfFtcXHUxRUVELVxcdTFFRURdfFtcXHUxRUVGLVxcdTFFRUZdfFtcXHUxRUYxLVxcdTFFRjFdfFtcXHUxRUYzLVxcdTFFRjNdfFtcXHUxRUY1LVxcdTFFRjVdfFtcXHUxRUY3LVxcdTFFRjddfFtcXHUxRUY5LVxcdTFFRjldfFtcXHUxRjAwLVxcdTFGMDddfFtcXHUxRjEwLVxcdTFGMTVdfFtcXHUxRjIwLVxcdTFGMjddfFtcXHUxRjMwLVxcdTFGMzddfFtcXHUxRjQwLVxcdTFGNDVdfFtcXHUxRjUwLVxcdTFGNTddfFtcXHUxRjYwLVxcdTFGNjddfFtcXHUxRjcwLVxcdTFGN0RdfFtcXHUxRjgwLVxcdTFGODddfFtcXHUxRjkwLVxcdTFGOTddfFtcXHUxRkEwLVxcdTFGQTddfFtcXHUxRkIwLVxcdTFGQjRdfFtcXHUxRkI2LVxcdTFGQjddfFtcXHUxRkJFLVxcdTFGQkVdfFtcXHUxRkMyLVxcdTFGQzRdfFtcXHUxRkM2LVxcdTFGQzddfFtcXHUxRkQwLVxcdTFGRDNdfFtcXHUxRkQ2LVxcdTFGRDddfFtcXHUxRkUwLVxcdTFGRTddfFtcXHUxRkYyLVxcdTFGRjRdfFtcXHUxRkY2LVxcdTFGRjddfFtcXHUyMDdGLVxcdTIwN0ZdfFtcXHUyMTBBLVxcdTIxMEFdfFtcXHUyMTBFLVxcdTIxMEZdfFtcXHUyMTEzLVxcdTIxMTNdfFtcXHUyMTE4LVxcdTIxMThdfFtcXHUyMTJFLVxcdTIxMkZdfFtcXHUyMTM0LVxcdTIxMzRdfFtcXHVGQjAwLVxcdUZCMDZdfFtcXHVGQjEzLVxcdUZCMTddfFtcXHVGRjQxLVxcdUZGNUFdfFtcXHUwMUM1LVxcdTAxQzVdfFtcXHUwMUM4LVxcdTAxQzhdfFtcXHUwMUNCLVxcdTAxQ0JdfFtcXHUwMUYyLVxcdTAxRjJdfFtcXHUwMkIwLVxcdTAyQjhdfFtcXHUwMkJCLVxcdTAyQzFdfFtcXHUwMkQwLVxcdTAyRDFdfFtcXHUwMkUwLVxcdTAyRTRdfFtcXHUwMzdBLVxcdTAzN0FdfFtcXHUwNTU5LVxcdTA1NTldfFtcXHUwNjQwLVxcdTA2NDBdfFtcXHUwNkU1LVxcdTA2RTZdfFtcXHUwRTQ2LVxcdTBFNDZdfFtcXHUwRUM2LVxcdTBFQzZdfFtcXHUzMDA1LVxcdTMwMDVdfFtcXHUzMDMxLVxcdTMwMzVdfFtcXHUzMDlELVxcdTMwOUVdfFtcXHUzMEZDLVxcdTMwRkVdfFtcXHVGRjcwLVxcdUZGNzBdfFtcXHVGRjlFLVxcdUZGOUZdfFtcXHUwMUFBLVxcdTAxQUFdfFtcXHUwMUJCLVxcdTAxQkJdfFtcXHUwMUJFLVxcdTAxQzNdfFtcXHUwM0YzLVxcdTAzRjNdfFtcXHUwNEMwLVxcdTA0QzBdfFtcXHUwNUQwLVxcdTA1RUFdfFtcXHUwNUYwLVxcdTA1RjJdfFtcXHUwNjIxLVxcdTA2M0FdfFtcXHUwNjQxLVxcdTA2NEFdfFtcXHUwNjcxLVxcdTA2QjddfFtcXHUwNkJBLVxcdTA2QkVdfFtcXHUwNkMwLVxcdTA2Q0VdfFtcXHUwNkQwLVxcdTA2RDNdfFtcXHUwNkQ1LVxcdTA2RDVdfFtcXHUwOTA1LVxcdTA5MzldfFtcXHUwOTNELVxcdTA5M0RdfFtcXHUwOTUwLVxcdTA5NTBdfFtcXHUwOTU4LVxcdTA5NjFdfFtcXHUwOTg1LVxcdTA5OENdfFtcXHUwOThGLVxcdTA5OTBdfFtcXHUwOTkzLVxcdTA5QThdfFtcXHUwOUFBLVxcdTA5QjBdfFtcXHUwOUIyLVxcdTA5QjJdfFtcXHUwOUI2LVxcdTA5QjldfFtcXHUwOURDLVxcdTA5RERdfFtcXHUwOURGLVxcdTA5RTFdfFtcXHUwOUYwLVxcdTA5RjFdfFtcXHUwQTA1LVxcdTBBMEFdfFtcXHUwQTBGLVxcdTBBMTBdfFtcXHUwQTEzLVxcdTBBMjhdfFtcXHUwQTJBLVxcdTBBMzBdfFtcXHUwQTMyLVxcdTBBMzNdfFtcXHUwQTM1LVxcdTBBMzZdfFtcXHUwQTM4LVxcdTBBMzldfFtcXHUwQTU5LVxcdTBBNUNdfFtcXHUwQTVFLVxcdTBBNUVdfFtcXHUwQTcyLVxcdTBBNzRdfFtcXHUwQTg1LVxcdTBBOEJdfFtcXHUwQThELVxcdTBBOERdfFtcXHUwQThGLVxcdTBBOTFdfFtcXHUwQTkzLVxcdTBBQThdfFtcXHUwQUFBLVxcdTBBQjBdfFtcXHUwQUIyLVxcdTBBQjNdfFtcXHUwQUI1LVxcdTBBQjldfFtcXHUwQUJELVxcdTBBQkRdfFtcXHUwQUQwLVxcdTBBRDBdfFtcXHUwQUUwLVxcdTBBRTBdfFtcXHUwQjA1LVxcdTBCMENdfFtcXHUwQjBGLVxcdTBCMTBdfFtcXHUwQjEzLVxcdTBCMjhdfFtcXHUwQjJBLVxcdTBCMzBdfFtcXHUwQjMyLVxcdTBCMzNdfFtcXHUwQjM2LVxcdTBCMzldfFtcXHUwQjNELVxcdTBCM0RdfFtcXHUwQjVDLVxcdTBCNURdfFtcXHUwQjVGLVxcdTBCNjFdfFtcXHUwQjg1LVxcdTBCOEFdfFtcXHUwQjhFLVxcdTBCOTBdfFtcXHUwQjkyLVxcdTBCOTVdfFtcXHUwQjk5LVxcdTBCOUFdfFtcXHUwQjlDLVxcdTBCOUNdfFtcXHUwQjlFLVxcdTBCOUZdfFtcXHUwQkEzLVxcdTBCQTRdfFtcXHUwQkE4LVxcdTBCQUFdfFtcXHUwQkFFLVxcdTBCQjVdfFtcXHUwQkI3LVxcdTBCQjldfFtcXHUwQzA1LVxcdTBDMENdfFtcXHUwQzBFLVxcdTBDMTBdfFtcXHUwQzEyLVxcdTBDMjhdfFtcXHUwQzJBLVxcdTBDMzNdfFtcXHUwQzM1LVxcdTBDMzldfFtcXHUwQzYwLVxcdTBDNjFdfFtcXHUwQzg1LVxcdTBDOENdfFtcXHUwQzhFLVxcdTBDOTBdfFtcXHUwQzkyLVxcdTBDQThdfFtcXHUwQ0FBLVxcdTBDQjNdfFtcXHUwQ0I1LVxcdTBDQjldfFtcXHUwQ0RFLVxcdTBDREVdfFtcXHUwQ0UwLVxcdTBDRTFdfFtcXHUwRDA1LVxcdTBEMENdfFtcXHUwRDBFLVxcdTBEMTBdfFtcXHUwRDEyLVxcdTBEMjhdfFtcXHUwRDJBLVxcdTBEMzldfFtcXHUwRDYwLVxcdTBENjFdfFtcXHUwRTAxLVxcdTBFMzBdfFtcXHUwRTMyLVxcdTBFMzNdfFtcXHUwRTQwLVxcdTBFNDVdfFtcXHUwRTgxLVxcdTBFODJdfFtcXHUwRTg0LVxcdTBFODRdfFtcXHUwRTg3LVxcdTBFODhdfFtcXHUwRThBLVxcdTBFOEFdfFtcXHUwRThELVxcdTBFOERdfFtcXHUwRTk0LVxcdTBFOTddfFtcXHUwRTk5LVxcdTBFOUZdfFtcXHUwRUExLVxcdTBFQTNdfFtcXHUwRUE1LVxcdTBFQTVdfFtcXHUwRUE3LVxcdTBFQTddfFtcXHUwRUFBLVxcdTBFQUJdfFtcXHUwRUFELVxcdTBFQjBdfFtcXHUwRUIyLVxcdTBFQjNdfFtcXHUwRUJELVxcdTBFQkRdfFtcXHUwRUMwLVxcdTBFQzRdfFtcXHUwRURDLVxcdTBFRERdfFtcXHUwRjAwLVxcdTBGMDBdfFtcXHUwRjQwLVxcdTBGNDddfFtcXHUwRjQ5LVxcdTBGNjldfFtcXHUwRjg4LVxcdTBGOEJdfFtcXHUxMTAwLVxcdTExNTldfFtcXHUxMTVGLVxcdTExQTJdfFtcXHUxMUE4LVxcdTExRjldfFtcXHUyMTM1LVxcdTIxMzhdfFtcXHUzMDA2LVxcdTMwMDZdfFtcXHUzMDQxLVxcdTMwOTRdfFtcXHUzMEExLVxcdTMwRkFdfFtcXHUzMTA1LVxcdTMxMkNdfFtcXHUzMTMxLVxcdTMxOEVdfFtcXHU0RTAwLVxcdTlGQTVdfFtcXHVBQzAwLVxcdUQ3QTNdfFtcXHVGOTAwLVxcdUZBMkRdfFtcXHVGQjFGLVxcdUZCMjhdfFtcXHVGQjJBLVxcdUZCMzZdfFtcXHVGQjM4LVxcdUZCM0NdfFtcXHVGQjNFLVxcdUZCM0VdfFtcXHVGQjQwLVxcdUZCNDFdfFtcXHVGQjQzLVxcdUZCNDRdfFtcXHVGQjQ2LVxcdUZCQjFdfFtcXHVGQkQzLVxcdUZEM0RdfFtcXHVGRDUwLVxcdUZEOEZdfFtcXHVGRDkyLVxcdUZEQzddfFtcXHVGREYwLVxcdUZERkJdfFtcXHVGRTcwLVxcdUZFNzJdfFtcXHVGRTc0LVxcdUZFNzRdfFtcXHVGRTc2LVxcdUZFRkNdfFtcXHVGRjY2LVxcdUZGNkZdfFtcXHVGRjcxLVxcdUZGOURdfFtcXHVGRkEwLVxcdUZGQkVdfFtcXHVGRkMyLVxcdUZGQzddfFtcXHVGRkNBLVxcdUZGQ0ZdfFtcXHVGRkQyLVxcdUZGRDddfFtcXHVGRkRBLVxcdUZGRENdLyxcblxuLyogTCA9IHVuaW9uIG9mIHRoZSBiZWxvdyBVbmljb2RlIGNhdGVnb3JpZXMgKi9cbiAgTHUgICA6IC9bXFx1MDA0MS1cXHUwMDVBXXxbXFx1MDBDMC1cXHUwMEQ2XXxbXFx1MDBEOC1cXHUwMERFXXxbXFx1MDEwMC1cXHUwMTAwXXxbXFx1MDEwMi1cXHUwMTAyXXxbXFx1MDEwNC1cXHUwMTA0XXxbXFx1MDEwNi1cXHUwMTA2XXxbXFx1MDEwOC1cXHUwMTA4XXxbXFx1MDEwQS1cXHUwMTBBXXxbXFx1MDEwQy1cXHUwMTBDXXxbXFx1MDEwRS1cXHUwMTBFXXxbXFx1MDExMC1cXHUwMTEwXXxbXFx1MDExMi1cXHUwMTEyXXxbXFx1MDExNC1cXHUwMTE0XXxbXFx1MDExNi1cXHUwMTE2XXxbXFx1MDExOC1cXHUwMTE4XXxbXFx1MDExQS1cXHUwMTFBXXxbXFx1MDExQy1cXHUwMTFDXXxbXFx1MDExRS1cXHUwMTFFXXxbXFx1MDEyMC1cXHUwMTIwXXxbXFx1MDEyMi1cXHUwMTIyXXxbXFx1MDEyNC1cXHUwMTI0XXxbXFx1MDEyNi1cXHUwMTI2XXxbXFx1MDEyOC1cXHUwMTI4XXxbXFx1MDEyQS1cXHUwMTJBXXxbXFx1MDEyQy1cXHUwMTJDXXxbXFx1MDEyRS1cXHUwMTJFXXxbXFx1MDEzMC1cXHUwMTMwXXxbXFx1MDEzMi1cXHUwMTMyXXxbXFx1MDEzNC1cXHUwMTM0XXxbXFx1MDEzNi1cXHUwMTM2XXxbXFx1MDEzOS1cXHUwMTM5XXxbXFx1MDEzQi1cXHUwMTNCXXxbXFx1MDEzRC1cXHUwMTNEXXxbXFx1MDEzRi1cXHUwMTNGXXxbXFx1MDE0MS1cXHUwMTQxXXxbXFx1MDE0My1cXHUwMTQzXXxbXFx1MDE0NS1cXHUwMTQ1XXxbXFx1MDE0Ny1cXHUwMTQ3XXxbXFx1MDE0QS1cXHUwMTRBXXxbXFx1MDE0Qy1cXHUwMTRDXXxbXFx1MDE0RS1cXHUwMTRFXXxbXFx1MDE1MC1cXHUwMTUwXXxbXFx1MDE1Mi1cXHUwMTUyXXxbXFx1MDE1NC1cXHUwMTU0XXxbXFx1MDE1Ni1cXHUwMTU2XXxbXFx1MDE1OC1cXHUwMTU4XXxbXFx1MDE1QS1cXHUwMTVBXXxbXFx1MDE1Qy1cXHUwMTVDXXxbXFx1MDE1RS1cXHUwMTVFXXxbXFx1MDE2MC1cXHUwMTYwXXxbXFx1MDE2Mi1cXHUwMTYyXXxbXFx1MDE2NC1cXHUwMTY0XXxbXFx1MDE2Ni1cXHUwMTY2XXxbXFx1MDE2OC1cXHUwMTY4XXxbXFx1MDE2QS1cXHUwMTZBXXxbXFx1MDE2Qy1cXHUwMTZDXXxbXFx1MDE2RS1cXHUwMTZFXXxbXFx1MDE3MC1cXHUwMTcwXXxbXFx1MDE3Mi1cXHUwMTcyXXxbXFx1MDE3NC1cXHUwMTc0XXxbXFx1MDE3Ni1cXHUwMTc2XXxbXFx1MDE3OC1cXHUwMTc5XXxbXFx1MDE3Qi1cXHUwMTdCXXxbXFx1MDE3RC1cXHUwMTdEXXxbXFx1MDE4MS1cXHUwMTgyXXxbXFx1MDE4NC1cXHUwMTg0XXxbXFx1MDE4Ni1cXHUwMTg3XXxbXFx1MDE4OS1cXHUwMThCXXxbXFx1MDE4RS1cXHUwMTkxXXxbXFx1MDE5My1cXHUwMTk0XXxbXFx1MDE5Ni1cXHUwMTk4XXxbXFx1MDE5Qy1cXHUwMTlEXXxbXFx1MDE5Ri1cXHUwMUEwXXxbXFx1MDFBMi1cXHUwMUEyXXxbXFx1MDFBNC1cXHUwMUE0XXxbXFx1MDFBNi1cXHUwMUE3XXxbXFx1MDFBOS1cXHUwMUE5XXxbXFx1MDFBQy1cXHUwMUFDXXxbXFx1MDFBRS1cXHUwMUFGXXxbXFx1MDFCMS1cXHUwMUIzXXxbXFx1MDFCNS1cXHUwMUI1XXxbXFx1MDFCNy1cXHUwMUI4XXxbXFx1MDFCQy1cXHUwMUJDXXxbXFx1MDFDNC1cXHUwMUM0XXxbXFx1MDFDNy1cXHUwMUM3XXxbXFx1MDFDQS1cXHUwMUNBXXxbXFx1MDFDRC1cXHUwMUNEXXxbXFx1MDFDRi1cXHUwMUNGXXxbXFx1MDFEMS1cXHUwMUQxXXxbXFx1MDFEMy1cXHUwMUQzXXxbXFx1MDFENS1cXHUwMUQ1XXxbXFx1MDFENy1cXHUwMUQ3XXxbXFx1MDFEOS1cXHUwMUQ5XXxbXFx1MDFEQi1cXHUwMURCXXxbXFx1MDFERS1cXHUwMURFXXxbXFx1MDFFMC1cXHUwMUUwXXxbXFx1MDFFMi1cXHUwMUUyXXxbXFx1MDFFNC1cXHUwMUU0XXxbXFx1MDFFNi1cXHUwMUU2XXxbXFx1MDFFOC1cXHUwMUU4XXxbXFx1MDFFQS1cXHUwMUVBXXxbXFx1MDFFQy1cXHUwMUVDXXxbXFx1MDFFRS1cXHUwMUVFXXxbXFx1MDFGMS1cXHUwMUYxXXxbXFx1MDFGNC1cXHUwMUY0XXxbXFx1MDFGQS1cXHUwMUZBXXxbXFx1MDFGQy1cXHUwMUZDXXxbXFx1MDFGRS1cXHUwMUZFXXxbXFx1MDIwMC1cXHUwMjAwXXxbXFx1MDIwMi1cXHUwMjAyXXxbXFx1MDIwNC1cXHUwMjA0XXxbXFx1MDIwNi1cXHUwMjA2XXxbXFx1MDIwOC1cXHUwMjA4XXxbXFx1MDIwQS1cXHUwMjBBXXxbXFx1MDIwQy1cXHUwMjBDXXxbXFx1MDIwRS1cXHUwMjBFXXxbXFx1MDIxMC1cXHUwMjEwXXxbXFx1MDIxMi1cXHUwMjEyXXxbXFx1MDIxNC1cXHUwMjE0XXxbXFx1MDIxNi1cXHUwMjE2XXxbXFx1MDM4Ni1cXHUwMzg2XXxbXFx1MDM4OC1cXHUwMzhBXXxbXFx1MDM4Qy1cXHUwMzhDXXxbXFx1MDM4RS1cXHUwMzhGXXxbXFx1MDM5MS1cXHUwM0ExXXxbXFx1MDNBMy1cXHUwM0FCXXxbXFx1MDNEMi1cXHUwM0Q0XXxbXFx1MDNEQS1cXHUwM0RBXXxbXFx1MDNEQy1cXHUwM0RDXXxbXFx1MDNERS1cXHUwM0RFXXxbXFx1MDNFMC1cXHUwM0UwXXxbXFx1MDNFMi1cXHUwM0UyXXxbXFx1MDNFNC1cXHUwM0U0XXxbXFx1MDNFNi1cXHUwM0U2XXxbXFx1MDNFOC1cXHUwM0U4XXxbXFx1MDNFQS1cXHUwM0VBXXxbXFx1MDNFQy1cXHUwM0VDXXxbXFx1MDNFRS1cXHUwM0VFXXxbXFx1MDQwMS1cXHUwNDBDXXxbXFx1MDQwRS1cXHUwNDJGXXxbXFx1MDQ2MC1cXHUwNDYwXXxbXFx1MDQ2Mi1cXHUwNDYyXXxbXFx1MDQ2NC1cXHUwNDY0XXxbXFx1MDQ2Ni1cXHUwNDY2XXxbXFx1MDQ2OC1cXHUwNDY4XXxbXFx1MDQ2QS1cXHUwNDZBXXxbXFx1MDQ2Qy1cXHUwNDZDXXxbXFx1MDQ2RS1cXHUwNDZFXXxbXFx1MDQ3MC1cXHUwNDcwXXxbXFx1MDQ3Mi1cXHUwNDcyXXxbXFx1MDQ3NC1cXHUwNDc0XXxbXFx1MDQ3Ni1cXHUwNDc2XXxbXFx1MDQ3OC1cXHUwNDc4XXxbXFx1MDQ3QS1cXHUwNDdBXXxbXFx1MDQ3Qy1cXHUwNDdDXXxbXFx1MDQ3RS1cXHUwNDdFXXxbXFx1MDQ4MC1cXHUwNDgwXXxbXFx1MDQ5MC1cXHUwNDkwXXxbXFx1MDQ5Mi1cXHUwNDkyXXxbXFx1MDQ5NC1cXHUwNDk0XXxbXFx1MDQ5Ni1cXHUwNDk2XXxbXFx1MDQ5OC1cXHUwNDk4XXxbXFx1MDQ5QS1cXHUwNDlBXXxbXFx1MDQ5Qy1cXHUwNDlDXXxbXFx1MDQ5RS1cXHUwNDlFXXxbXFx1MDRBMC1cXHUwNEEwXXxbXFx1MDRBMi1cXHUwNEEyXXxbXFx1MDRBNC1cXHUwNEE0XXxbXFx1MDRBNi1cXHUwNEE2XXxbXFx1MDRBOC1cXHUwNEE4XXxbXFx1MDRBQS1cXHUwNEFBXXxbXFx1MDRBQy1cXHUwNEFDXXxbXFx1MDRBRS1cXHUwNEFFXXxbXFx1MDRCMC1cXHUwNEIwXXxbXFx1MDRCMi1cXHUwNEIyXXxbXFx1MDRCNC1cXHUwNEI0XXxbXFx1MDRCNi1cXHUwNEI2XXxbXFx1MDRCOC1cXHUwNEI4XXxbXFx1MDRCQS1cXHUwNEJBXXxbXFx1MDRCQy1cXHUwNEJDXXxbXFx1MDRCRS1cXHUwNEJFXXxbXFx1MDRDMS1cXHUwNEMxXXxbXFx1MDRDMy1cXHUwNEMzXXxbXFx1MDRDNy1cXHUwNEM3XXxbXFx1MDRDQi1cXHUwNENCXXxbXFx1MDREMC1cXHUwNEQwXXxbXFx1MDREMi1cXHUwNEQyXXxbXFx1MDRENC1cXHUwNEQ0XXxbXFx1MDRENi1cXHUwNEQ2XXxbXFx1MDREOC1cXHUwNEQ4XXxbXFx1MDREQS1cXHUwNERBXXxbXFx1MDREQy1cXHUwNERDXXxbXFx1MDRERS1cXHUwNERFXXxbXFx1MDRFMC1cXHUwNEUwXXxbXFx1MDRFMi1cXHUwNEUyXXxbXFx1MDRFNC1cXHUwNEU0XXxbXFx1MDRFNi1cXHUwNEU2XXxbXFx1MDRFOC1cXHUwNEU4XXxbXFx1MDRFQS1cXHUwNEVBXXxbXFx1MDRFRS1cXHUwNEVFXXxbXFx1MDRGMC1cXHUwNEYwXXxbXFx1MDRGMi1cXHUwNEYyXXxbXFx1MDRGNC1cXHUwNEY0XXxbXFx1MDRGOC1cXHUwNEY4XXxbXFx1MDUzMS1cXHUwNTU2XXxbXFx1MTBBMC1cXHUxMEM1XXxbXFx1MUUwMC1cXHUxRTAwXXxbXFx1MUUwMi1cXHUxRTAyXXxbXFx1MUUwNC1cXHUxRTA0XXxbXFx1MUUwNi1cXHUxRTA2XXxbXFx1MUUwOC1cXHUxRTA4XXxbXFx1MUUwQS1cXHUxRTBBXXxbXFx1MUUwQy1cXHUxRTBDXXxbXFx1MUUwRS1cXHUxRTBFXXxbXFx1MUUxMC1cXHUxRTEwXXxbXFx1MUUxMi1cXHUxRTEyXXxbXFx1MUUxNC1cXHUxRTE0XXxbXFx1MUUxNi1cXHUxRTE2XXxbXFx1MUUxOC1cXHUxRTE4XXxbXFx1MUUxQS1cXHUxRTFBXXxbXFx1MUUxQy1cXHUxRTFDXXxbXFx1MUUxRS1cXHUxRTFFXXxbXFx1MUUyMC1cXHUxRTIwXXxbXFx1MUUyMi1cXHUxRTIyXXxbXFx1MUUyNC1cXHUxRTI0XXxbXFx1MUUyNi1cXHUxRTI2XXxbXFx1MUUyOC1cXHUxRTI4XXxbXFx1MUUyQS1cXHUxRTJBXXxbXFx1MUUyQy1cXHUxRTJDXXxbXFx1MUUyRS1cXHUxRTJFXXxbXFx1MUUzMC1cXHUxRTMwXXxbXFx1MUUzMi1cXHUxRTMyXXxbXFx1MUUzNC1cXHUxRTM0XXxbXFx1MUUzNi1cXHUxRTM2XXxbXFx1MUUzOC1cXHUxRTM4XXxbXFx1MUUzQS1cXHUxRTNBXXxbXFx1MUUzQy1cXHUxRTNDXXxbXFx1MUUzRS1cXHUxRTNFXXxbXFx1MUU0MC1cXHUxRTQwXXxbXFx1MUU0Mi1cXHUxRTQyXXxbXFx1MUU0NC1cXHUxRTQ0XXxbXFx1MUU0Ni1cXHUxRTQ2XXxbXFx1MUU0OC1cXHUxRTQ4XXxbXFx1MUU0QS1cXHUxRTRBXXxbXFx1MUU0Qy1cXHUxRTRDXXxbXFx1MUU0RS1cXHUxRTRFXXxbXFx1MUU1MC1cXHUxRTUwXXxbXFx1MUU1Mi1cXHUxRTUyXXxbXFx1MUU1NC1cXHUxRTU0XXxbXFx1MUU1Ni1cXHUxRTU2XXxbXFx1MUU1OC1cXHUxRTU4XXxbXFx1MUU1QS1cXHUxRTVBXXxbXFx1MUU1Qy1cXHUxRTVDXXxbXFx1MUU1RS1cXHUxRTVFXXxbXFx1MUU2MC1cXHUxRTYwXXxbXFx1MUU2Mi1cXHUxRTYyXXxbXFx1MUU2NC1cXHUxRTY0XXxbXFx1MUU2Ni1cXHUxRTY2XXxbXFx1MUU2OC1cXHUxRTY4XXxbXFx1MUU2QS1cXHUxRTZBXXxbXFx1MUU2Qy1cXHUxRTZDXXxbXFx1MUU2RS1cXHUxRTZFXXxbXFx1MUU3MC1cXHUxRTcwXXxbXFx1MUU3Mi1cXHUxRTcyXXxbXFx1MUU3NC1cXHUxRTc0XXxbXFx1MUU3Ni1cXHUxRTc2XXxbXFx1MUU3OC1cXHUxRTc4XXxbXFx1MUU3QS1cXHUxRTdBXXxbXFx1MUU3Qy1cXHUxRTdDXXxbXFx1MUU3RS1cXHUxRTdFXXxbXFx1MUU4MC1cXHUxRTgwXXxbXFx1MUU4Mi1cXHUxRTgyXXxbXFx1MUU4NC1cXHUxRTg0XXxbXFx1MUU4Ni1cXHUxRTg2XXxbXFx1MUU4OC1cXHUxRTg4XXxbXFx1MUU4QS1cXHUxRThBXXxbXFx1MUU4Qy1cXHUxRThDXXxbXFx1MUU4RS1cXHUxRThFXXxbXFx1MUU5MC1cXHUxRTkwXXxbXFx1MUU5Mi1cXHUxRTkyXXxbXFx1MUU5NC1cXHUxRTk0XXxbXFx1MUVBMC1cXHUxRUEwXXxbXFx1MUVBMi1cXHUxRUEyXXxbXFx1MUVBNC1cXHUxRUE0XXxbXFx1MUVBNi1cXHUxRUE2XXxbXFx1MUVBOC1cXHUxRUE4XXxbXFx1MUVBQS1cXHUxRUFBXXxbXFx1MUVBQy1cXHUxRUFDXXxbXFx1MUVBRS1cXHUxRUFFXXxbXFx1MUVCMC1cXHUxRUIwXXxbXFx1MUVCMi1cXHUxRUIyXXxbXFx1MUVCNC1cXHUxRUI0XXxbXFx1MUVCNi1cXHUxRUI2XXxbXFx1MUVCOC1cXHUxRUI4XXxbXFx1MUVCQS1cXHUxRUJBXXxbXFx1MUVCQy1cXHUxRUJDXXxbXFx1MUVCRS1cXHUxRUJFXXxbXFx1MUVDMC1cXHUxRUMwXXxbXFx1MUVDMi1cXHUxRUMyXXxbXFx1MUVDNC1cXHUxRUM0XXxbXFx1MUVDNi1cXHUxRUM2XXxbXFx1MUVDOC1cXHUxRUM4XXxbXFx1MUVDQS1cXHUxRUNBXXxbXFx1MUVDQy1cXHUxRUNDXXxbXFx1MUVDRS1cXHUxRUNFXXxbXFx1MUVEMC1cXHUxRUQwXXxbXFx1MUVEMi1cXHUxRUQyXXxbXFx1MUVENC1cXHUxRUQ0XXxbXFx1MUVENi1cXHUxRUQ2XXxbXFx1MUVEOC1cXHUxRUQ4XXxbXFx1MUVEQS1cXHUxRURBXXxbXFx1MUVEQy1cXHUxRURDXXxbXFx1MUVERS1cXHUxRURFXXxbXFx1MUVFMC1cXHUxRUUwXXxbXFx1MUVFMi1cXHUxRUUyXXxbXFx1MUVFNC1cXHUxRUU0XXxbXFx1MUVFNi1cXHUxRUU2XXxbXFx1MUVFOC1cXHUxRUU4XXxbXFx1MUVFQS1cXHUxRUVBXXxbXFx1MUVFQy1cXHUxRUVDXXxbXFx1MUVFRS1cXHUxRUVFXXxbXFx1MUVGMC1cXHUxRUYwXXxbXFx1MUVGMi1cXHUxRUYyXXxbXFx1MUVGNC1cXHUxRUY0XXxbXFx1MUVGNi1cXHUxRUY2XXxbXFx1MUVGOC1cXHUxRUY4XXxbXFx1MUYwOC1cXHUxRjBGXXxbXFx1MUYxOC1cXHUxRjFEXXxbXFx1MUYyOC1cXHUxRjJGXXxbXFx1MUYzOC1cXHUxRjNGXXxbXFx1MUY0OC1cXHUxRjREXXxbXFx1MUY1OS1cXHUxRjU5XXxbXFx1MUY1Qi1cXHUxRjVCXXxbXFx1MUY1RC1cXHUxRjVEXXxbXFx1MUY1Ri1cXHUxRjVGXXxbXFx1MUY2OC1cXHUxRjZGXXxbXFx1MUY4OC1cXHUxRjhGXXxbXFx1MUY5OC1cXHUxRjlGXXxbXFx1MUZBOC1cXHUxRkFGXXxbXFx1MUZCOC1cXHUxRkJDXXxbXFx1MUZDOC1cXHUxRkNDXXxbXFx1MUZEOC1cXHUxRkRCXXxbXFx1MUZFOC1cXHUxRkVDXXxbXFx1MUZGOC1cXHUxRkZDXXxbXFx1MjEwMi1cXHUyMTAyXXxbXFx1MjEwNy1cXHUyMTA3XXxbXFx1MjEwQi1cXHUyMTBEXXxbXFx1MjExMC1cXHUyMTEyXXxbXFx1MjExNS1cXHUyMTE1XXxbXFx1MjExOS1cXHUyMTFEXXxbXFx1MjEyNC1cXHUyMTI0XXxbXFx1MjEyNi1cXHUyMTI2XXxbXFx1MjEyOC1cXHUyMTI4XXxbXFx1MjEyQS1cXHUyMTJEXXxbXFx1MjEzMC1cXHUyMTMxXXxbXFx1MjEzMy1cXHUyMTMzXXxbXFx1RkYyMS1cXHVGRjNBXS8sXG4gIExsICAgOiAvW1xcdTAwNjEtXFx1MDA3QV18W1xcdTAwQUEtXFx1MDBBQV18W1xcdTAwQjUtXFx1MDBCNV18W1xcdTAwQkEtXFx1MDBCQV18W1xcdTAwREYtXFx1MDBGNl18W1xcdTAwRjgtXFx1MDBGRl18W1xcdTAxMDEtXFx1MDEwMV18W1xcdTAxMDMtXFx1MDEwM118W1xcdTAxMDUtXFx1MDEwNV18W1xcdTAxMDctXFx1MDEwN118W1xcdTAxMDktXFx1MDEwOV18W1xcdTAxMEItXFx1MDEwQl18W1xcdTAxMEQtXFx1MDEwRF18W1xcdTAxMEYtXFx1MDEwRl18W1xcdTAxMTEtXFx1MDExMV18W1xcdTAxMTMtXFx1MDExM118W1xcdTAxMTUtXFx1MDExNV18W1xcdTAxMTctXFx1MDExN118W1xcdTAxMTktXFx1MDExOV18W1xcdTAxMUItXFx1MDExQl18W1xcdTAxMUQtXFx1MDExRF18W1xcdTAxMUYtXFx1MDExRl18W1xcdTAxMjEtXFx1MDEyMV18W1xcdTAxMjMtXFx1MDEyM118W1xcdTAxMjUtXFx1MDEyNV18W1xcdTAxMjctXFx1MDEyN118W1xcdTAxMjktXFx1MDEyOV18W1xcdTAxMkItXFx1MDEyQl18W1xcdTAxMkQtXFx1MDEyRF18W1xcdTAxMkYtXFx1MDEyRl18W1xcdTAxMzEtXFx1MDEzMV18W1xcdTAxMzMtXFx1MDEzM118W1xcdTAxMzUtXFx1MDEzNV18W1xcdTAxMzctXFx1MDEzOF18W1xcdTAxM0EtXFx1MDEzQV18W1xcdTAxM0MtXFx1MDEzQ118W1xcdTAxM0UtXFx1MDEzRV18W1xcdTAxNDAtXFx1MDE0MF18W1xcdTAxNDItXFx1MDE0Ml18W1xcdTAxNDQtXFx1MDE0NF18W1xcdTAxNDYtXFx1MDE0Nl18W1xcdTAxNDgtXFx1MDE0OV18W1xcdTAxNEItXFx1MDE0Ql18W1xcdTAxNEQtXFx1MDE0RF18W1xcdTAxNEYtXFx1MDE0Rl18W1xcdTAxNTEtXFx1MDE1MV18W1xcdTAxNTMtXFx1MDE1M118W1xcdTAxNTUtXFx1MDE1NV18W1xcdTAxNTctXFx1MDE1N118W1xcdTAxNTktXFx1MDE1OV18W1xcdTAxNUItXFx1MDE1Ql18W1xcdTAxNUQtXFx1MDE1RF18W1xcdTAxNUYtXFx1MDE1Rl18W1xcdTAxNjEtXFx1MDE2MV18W1xcdTAxNjMtXFx1MDE2M118W1xcdTAxNjUtXFx1MDE2NV18W1xcdTAxNjctXFx1MDE2N118W1xcdTAxNjktXFx1MDE2OV18W1xcdTAxNkItXFx1MDE2Ql18W1xcdTAxNkQtXFx1MDE2RF18W1xcdTAxNkYtXFx1MDE2Rl18W1xcdTAxNzEtXFx1MDE3MV18W1xcdTAxNzMtXFx1MDE3M118W1xcdTAxNzUtXFx1MDE3NV18W1xcdTAxNzctXFx1MDE3N118W1xcdTAxN0EtXFx1MDE3QV18W1xcdTAxN0MtXFx1MDE3Q118W1xcdTAxN0UtXFx1MDE4MF18W1xcdTAxODMtXFx1MDE4M118W1xcdTAxODUtXFx1MDE4NV18W1xcdTAxODgtXFx1MDE4OF18W1xcdTAxOEMtXFx1MDE4RF18W1xcdTAxOTItXFx1MDE5Ml18W1xcdTAxOTUtXFx1MDE5NV18W1xcdTAxOTktXFx1MDE5Ql18W1xcdTAxOUUtXFx1MDE5RV18W1xcdTAxQTEtXFx1MDFBMV18W1xcdTAxQTMtXFx1MDFBM118W1xcdTAxQTUtXFx1MDFBNV18W1xcdTAxQTgtXFx1MDFBOF18W1xcdTAxQUItXFx1MDFBQl18W1xcdTAxQUQtXFx1MDFBRF18W1xcdTAxQjAtXFx1MDFCMF18W1xcdTAxQjQtXFx1MDFCNF18W1xcdTAxQjYtXFx1MDFCNl18W1xcdTAxQjktXFx1MDFCQV18W1xcdTAxQkQtXFx1MDFCRF18W1xcdTAxQzYtXFx1MDFDNl18W1xcdTAxQzktXFx1MDFDOV18W1xcdTAxQ0MtXFx1MDFDQ118W1xcdTAxQ0UtXFx1MDFDRV18W1xcdTAxRDAtXFx1MDFEMF18W1xcdTAxRDItXFx1MDFEMl18W1xcdTAxRDQtXFx1MDFENF18W1xcdTAxRDYtXFx1MDFENl18W1xcdTAxRDgtXFx1MDFEOF18W1xcdTAxREEtXFx1MDFEQV18W1xcdTAxREMtXFx1MDFERF18W1xcdTAxREYtXFx1MDFERl18W1xcdTAxRTEtXFx1MDFFMV18W1xcdTAxRTMtXFx1MDFFM118W1xcdTAxRTUtXFx1MDFFNV18W1xcdTAxRTctXFx1MDFFN118W1xcdTAxRTktXFx1MDFFOV18W1xcdTAxRUItXFx1MDFFQl18W1xcdTAxRUQtXFx1MDFFRF18W1xcdTAxRUYtXFx1MDFGMF18W1xcdTAxRjMtXFx1MDFGM118W1xcdTAxRjUtXFx1MDFGNV18W1xcdTAxRkItXFx1MDFGQl18W1xcdTAxRkQtXFx1MDFGRF18W1xcdTAxRkYtXFx1MDFGRl18W1xcdTAyMDEtXFx1MDIwMV18W1xcdTAyMDMtXFx1MDIwM118W1xcdTAyMDUtXFx1MDIwNV18W1xcdTAyMDctXFx1MDIwN118W1xcdTAyMDktXFx1MDIwOV18W1xcdTAyMEItXFx1MDIwQl18W1xcdTAyMEQtXFx1MDIwRF18W1xcdTAyMEYtXFx1MDIwRl18W1xcdTAyMTEtXFx1MDIxMV18W1xcdTAyMTMtXFx1MDIxM118W1xcdTAyMTUtXFx1MDIxNV18W1xcdTAyMTctXFx1MDIxN118W1xcdTAyNTAtXFx1MDJBOF18W1xcdTAzOTAtXFx1MDM5MF18W1xcdTAzQUMtXFx1MDNDRV18W1xcdTAzRDAtXFx1MDNEMV18W1xcdTAzRDUtXFx1MDNENl18W1xcdTAzRTMtXFx1MDNFM118W1xcdTAzRTUtXFx1MDNFNV18W1xcdTAzRTctXFx1MDNFN118W1xcdTAzRTktXFx1MDNFOV18W1xcdTAzRUItXFx1MDNFQl18W1xcdTAzRUQtXFx1MDNFRF18W1xcdTAzRUYtXFx1MDNGMl18W1xcdTA0MzAtXFx1MDQ0Rl18W1xcdTA0NTEtXFx1MDQ1Q118W1xcdTA0NUUtXFx1MDQ1Rl18W1xcdTA0NjEtXFx1MDQ2MV18W1xcdTA0NjMtXFx1MDQ2M118W1xcdTA0NjUtXFx1MDQ2NV18W1xcdTA0NjctXFx1MDQ2N118W1xcdTA0NjktXFx1MDQ2OV18W1xcdTA0NkItXFx1MDQ2Ql18W1xcdTA0NkQtXFx1MDQ2RF18W1xcdTA0NkYtXFx1MDQ2Rl18W1xcdTA0NzEtXFx1MDQ3MV18W1xcdTA0NzMtXFx1MDQ3M118W1xcdTA0NzUtXFx1MDQ3NV18W1xcdTA0NzctXFx1MDQ3N118W1xcdTA0NzktXFx1MDQ3OV18W1xcdTA0N0ItXFx1MDQ3Ql18W1xcdTA0N0QtXFx1MDQ3RF18W1xcdTA0N0YtXFx1MDQ3Rl18W1xcdTA0ODEtXFx1MDQ4MV18W1xcdTA0OTEtXFx1MDQ5MV18W1xcdTA0OTMtXFx1MDQ5M118W1xcdTA0OTUtXFx1MDQ5NV18W1xcdTA0OTctXFx1MDQ5N118W1xcdTA0OTktXFx1MDQ5OV18W1xcdTA0OUItXFx1MDQ5Ql18W1xcdTA0OUQtXFx1MDQ5RF18W1xcdTA0OUYtXFx1MDQ5Rl18W1xcdTA0QTEtXFx1MDRBMV18W1xcdTA0QTMtXFx1MDRBM118W1xcdTA0QTUtXFx1MDRBNV18W1xcdTA0QTctXFx1MDRBN118W1xcdTA0QTktXFx1MDRBOV18W1xcdTA0QUItXFx1MDRBQl18W1xcdTA0QUQtXFx1MDRBRF18W1xcdTA0QUYtXFx1MDRBRl18W1xcdTA0QjEtXFx1MDRCMV18W1xcdTA0QjMtXFx1MDRCM118W1xcdTA0QjUtXFx1MDRCNV18W1xcdTA0QjctXFx1MDRCN118W1xcdTA0QjktXFx1MDRCOV18W1xcdTA0QkItXFx1MDRCQl18W1xcdTA0QkQtXFx1MDRCRF18W1xcdTA0QkYtXFx1MDRCRl18W1xcdTA0QzItXFx1MDRDMl18W1xcdTA0QzQtXFx1MDRDNF18W1xcdTA0QzgtXFx1MDRDOF18W1xcdTA0Q0MtXFx1MDRDQ118W1xcdTA0RDEtXFx1MDREMV18W1xcdTA0RDMtXFx1MDREM118W1xcdTA0RDUtXFx1MDRENV18W1xcdTA0RDctXFx1MDREN118W1xcdTA0RDktXFx1MDREOV18W1xcdTA0REItXFx1MDREQl18W1xcdTA0REQtXFx1MDRERF18W1xcdTA0REYtXFx1MDRERl18W1xcdTA0RTEtXFx1MDRFMV18W1xcdTA0RTMtXFx1MDRFM118W1xcdTA0RTUtXFx1MDRFNV18W1xcdTA0RTctXFx1MDRFN118W1xcdTA0RTktXFx1MDRFOV18W1xcdTA0RUItXFx1MDRFQl18W1xcdTA0RUYtXFx1MDRFRl18W1xcdTA0RjEtXFx1MDRGMV18W1xcdTA0RjMtXFx1MDRGM118W1xcdTA0RjUtXFx1MDRGNV18W1xcdTA0RjktXFx1MDRGOV18W1xcdTA1NjEtXFx1MDU4N118W1xcdTEwRDAtXFx1MTBGNl18W1xcdTFFMDEtXFx1MUUwMV18W1xcdTFFMDMtXFx1MUUwM118W1xcdTFFMDUtXFx1MUUwNV18W1xcdTFFMDctXFx1MUUwN118W1xcdTFFMDktXFx1MUUwOV18W1xcdTFFMEItXFx1MUUwQl18W1xcdTFFMEQtXFx1MUUwRF18W1xcdTFFMEYtXFx1MUUwRl18W1xcdTFFMTEtXFx1MUUxMV18W1xcdTFFMTMtXFx1MUUxM118W1xcdTFFMTUtXFx1MUUxNV18W1xcdTFFMTctXFx1MUUxN118W1xcdTFFMTktXFx1MUUxOV18W1xcdTFFMUItXFx1MUUxQl18W1xcdTFFMUQtXFx1MUUxRF18W1xcdTFFMUYtXFx1MUUxRl18W1xcdTFFMjEtXFx1MUUyMV18W1xcdTFFMjMtXFx1MUUyM118W1xcdTFFMjUtXFx1MUUyNV18W1xcdTFFMjctXFx1MUUyN118W1xcdTFFMjktXFx1MUUyOV18W1xcdTFFMkItXFx1MUUyQl18W1xcdTFFMkQtXFx1MUUyRF18W1xcdTFFMkYtXFx1MUUyRl18W1xcdTFFMzEtXFx1MUUzMV18W1xcdTFFMzMtXFx1MUUzM118W1xcdTFFMzUtXFx1MUUzNV18W1xcdTFFMzctXFx1MUUzN118W1xcdTFFMzktXFx1MUUzOV18W1xcdTFFM0ItXFx1MUUzQl18W1xcdTFFM0QtXFx1MUUzRF18W1xcdTFFM0YtXFx1MUUzRl18W1xcdTFFNDEtXFx1MUU0MV18W1xcdTFFNDMtXFx1MUU0M118W1xcdTFFNDUtXFx1MUU0NV18W1xcdTFFNDctXFx1MUU0N118W1xcdTFFNDktXFx1MUU0OV18W1xcdTFFNEItXFx1MUU0Ql18W1xcdTFFNEQtXFx1MUU0RF18W1xcdTFFNEYtXFx1MUU0Rl18W1xcdTFFNTEtXFx1MUU1MV18W1xcdTFFNTMtXFx1MUU1M118W1xcdTFFNTUtXFx1MUU1NV18W1xcdTFFNTctXFx1MUU1N118W1xcdTFFNTktXFx1MUU1OV18W1xcdTFFNUItXFx1MUU1Ql18W1xcdTFFNUQtXFx1MUU1RF18W1xcdTFFNUYtXFx1MUU1Rl18W1xcdTFFNjEtXFx1MUU2MV18W1xcdTFFNjMtXFx1MUU2M118W1xcdTFFNjUtXFx1MUU2NV18W1xcdTFFNjctXFx1MUU2N118W1xcdTFFNjktXFx1MUU2OV18W1xcdTFFNkItXFx1MUU2Ql18W1xcdTFFNkQtXFx1MUU2RF18W1xcdTFFNkYtXFx1MUU2Rl18W1xcdTFFNzEtXFx1MUU3MV18W1xcdTFFNzMtXFx1MUU3M118W1xcdTFFNzUtXFx1MUU3NV18W1xcdTFFNzctXFx1MUU3N118W1xcdTFFNzktXFx1MUU3OV18W1xcdTFFN0ItXFx1MUU3Ql18W1xcdTFFN0QtXFx1MUU3RF18W1xcdTFFN0YtXFx1MUU3Rl18W1xcdTFFODEtXFx1MUU4MV18W1xcdTFFODMtXFx1MUU4M118W1xcdTFFODUtXFx1MUU4NV18W1xcdTFFODctXFx1MUU4N118W1xcdTFFODktXFx1MUU4OV18W1xcdTFFOEItXFx1MUU4Ql18W1xcdTFFOEQtXFx1MUU4RF18W1xcdTFFOEYtXFx1MUU4Rl18W1xcdTFFOTEtXFx1MUU5MV18W1xcdTFFOTMtXFx1MUU5M118W1xcdTFFOTUtXFx1MUU5Ql18W1xcdTFFQTEtXFx1MUVBMV18W1xcdTFFQTMtXFx1MUVBM118W1xcdTFFQTUtXFx1MUVBNV18W1xcdTFFQTctXFx1MUVBN118W1xcdTFFQTktXFx1MUVBOV18W1xcdTFFQUItXFx1MUVBQl18W1xcdTFFQUQtXFx1MUVBRF18W1xcdTFFQUYtXFx1MUVBRl18W1xcdTFFQjEtXFx1MUVCMV18W1xcdTFFQjMtXFx1MUVCM118W1xcdTFFQjUtXFx1MUVCNV18W1xcdTFFQjctXFx1MUVCN118W1xcdTFFQjktXFx1MUVCOV18W1xcdTFFQkItXFx1MUVCQl18W1xcdTFFQkQtXFx1MUVCRF18W1xcdTFFQkYtXFx1MUVCRl18W1xcdTFFQzEtXFx1MUVDMV18W1xcdTFFQzMtXFx1MUVDM118W1xcdTFFQzUtXFx1MUVDNV18W1xcdTFFQzctXFx1MUVDN118W1xcdTFFQzktXFx1MUVDOV18W1xcdTFFQ0ItXFx1MUVDQl18W1xcdTFFQ0QtXFx1MUVDRF18W1xcdTFFQ0YtXFx1MUVDRl18W1xcdTFFRDEtXFx1MUVEMV18W1xcdTFFRDMtXFx1MUVEM118W1xcdTFFRDUtXFx1MUVENV18W1xcdTFFRDctXFx1MUVEN118W1xcdTFFRDktXFx1MUVEOV18W1xcdTFFREItXFx1MUVEQl18W1xcdTFFREQtXFx1MUVERF18W1xcdTFFREYtXFx1MUVERl18W1xcdTFFRTEtXFx1MUVFMV18W1xcdTFFRTMtXFx1MUVFM118W1xcdTFFRTUtXFx1MUVFNV18W1xcdTFFRTctXFx1MUVFN118W1xcdTFFRTktXFx1MUVFOV18W1xcdTFFRUItXFx1MUVFQl18W1xcdTFFRUQtXFx1MUVFRF18W1xcdTFFRUYtXFx1MUVFRl18W1xcdTFFRjEtXFx1MUVGMV18W1xcdTFFRjMtXFx1MUVGM118W1xcdTFFRjUtXFx1MUVGNV18W1xcdTFFRjctXFx1MUVGN118W1xcdTFFRjktXFx1MUVGOV18W1xcdTFGMDAtXFx1MUYwN118W1xcdTFGMTAtXFx1MUYxNV18W1xcdTFGMjAtXFx1MUYyN118W1xcdTFGMzAtXFx1MUYzN118W1xcdTFGNDAtXFx1MUY0NV18W1xcdTFGNTAtXFx1MUY1N118W1xcdTFGNjAtXFx1MUY2N118W1xcdTFGNzAtXFx1MUY3RF18W1xcdTFGODAtXFx1MUY4N118W1xcdTFGOTAtXFx1MUY5N118W1xcdTFGQTAtXFx1MUZBN118W1xcdTFGQjAtXFx1MUZCNF18W1xcdTFGQjYtXFx1MUZCN118W1xcdTFGQkUtXFx1MUZCRV18W1xcdTFGQzItXFx1MUZDNF18W1xcdTFGQzYtXFx1MUZDN118W1xcdTFGRDAtXFx1MUZEM118W1xcdTFGRDYtXFx1MUZEN118W1xcdTFGRTAtXFx1MUZFN118W1xcdTFGRjItXFx1MUZGNF18W1xcdTFGRjYtXFx1MUZGN118W1xcdTIwN0YtXFx1MjA3Rl18W1xcdTIxMEEtXFx1MjEwQV18W1xcdTIxMEUtXFx1MjEwRl18W1xcdTIxMTMtXFx1MjExM118W1xcdTIxMTgtXFx1MjExOF18W1xcdTIxMkUtXFx1MjEyRl18W1xcdTIxMzQtXFx1MjEzNF18W1xcdUZCMDAtXFx1RkIwNl18W1xcdUZCMTMtXFx1RkIxN118W1xcdUZGNDEtXFx1RkY1QV0vLFxuICBMdCAgIDogL1tcXHUwMUM1LVxcdTAxQzVdfFtcXHUwMUM4LVxcdTAxQzhdfFtcXHUwMUNCLVxcdTAxQ0JdfFtcXHUwMUYyLVxcdTAxRjJdLyxcbiAgTG0gICA6IC9bXFx1MDJCMC1cXHUwMkI4XXxbXFx1MDJCQi1cXHUwMkMxXXxbXFx1MDJEMC1cXHUwMkQxXXxbXFx1MDJFMC1cXHUwMkU0XXxbXFx1MDM3QS1cXHUwMzdBXXxbXFx1MDU1OS1cXHUwNTU5XXxbXFx1MDY0MC1cXHUwNjQwXXxbXFx1MDZFNS1cXHUwNkU2XXxbXFx1MEU0Ni1cXHUwRTQ2XXxbXFx1MEVDNi1cXHUwRUM2XXxbXFx1MzAwNS1cXHUzMDA1XXxbXFx1MzAzMS1cXHUzMDM1XXxbXFx1MzA5RC1cXHUzMDlFXXxbXFx1MzBGQy1cXHUzMEZFXXxbXFx1RkY3MC1cXHVGRjcwXXxbXFx1RkY5RS1cXHVGRjlGXS8sXG4gIExvICAgOiAvW1xcdTAxQUEtXFx1MDFBQV18W1xcdTAxQkItXFx1MDFCQl18W1xcdTAxQkUtXFx1MDFDM118W1xcdTAzRjMtXFx1MDNGM118W1xcdTA0QzAtXFx1MDRDMF18W1xcdTA1RDAtXFx1MDVFQV18W1xcdTA1RjAtXFx1MDVGMl18W1xcdTA2MjEtXFx1MDYzQV18W1xcdTA2NDEtXFx1MDY0QV18W1xcdTA2NzEtXFx1MDZCN118W1xcdTA2QkEtXFx1MDZCRV18W1xcdTA2QzAtXFx1MDZDRV18W1xcdTA2RDAtXFx1MDZEM118W1xcdTA2RDUtXFx1MDZENV18W1xcdTA5MDUtXFx1MDkzOV18W1xcdTA5M0QtXFx1MDkzRF18W1xcdTA5NTAtXFx1MDk1MF18W1xcdTA5NTgtXFx1MDk2MV18W1xcdTA5ODUtXFx1MDk4Q118W1xcdTA5OEYtXFx1MDk5MF18W1xcdTA5OTMtXFx1MDlBOF18W1xcdTA5QUEtXFx1MDlCMF18W1xcdTA5QjItXFx1MDlCMl18W1xcdTA5QjYtXFx1MDlCOV18W1xcdTA5REMtXFx1MDlERF18W1xcdTA5REYtXFx1MDlFMV18W1xcdTA5RjAtXFx1MDlGMV18W1xcdTBBMDUtXFx1MEEwQV18W1xcdTBBMEYtXFx1MEExMF18W1xcdTBBMTMtXFx1MEEyOF18W1xcdTBBMkEtXFx1MEEzMF18W1xcdTBBMzItXFx1MEEzM118W1xcdTBBMzUtXFx1MEEzNl18W1xcdTBBMzgtXFx1MEEzOV18W1xcdTBBNTktXFx1MEE1Q118W1xcdTBBNUUtXFx1MEE1RV18W1xcdTBBNzItXFx1MEE3NF18W1xcdTBBODUtXFx1MEE4Ql18W1xcdTBBOEQtXFx1MEE4RF18W1xcdTBBOEYtXFx1MEE5MV18W1xcdTBBOTMtXFx1MEFBOF18W1xcdTBBQUEtXFx1MEFCMF18W1xcdTBBQjItXFx1MEFCM118W1xcdTBBQjUtXFx1MEFCOV18W1xcdTBBQkQtXFx1MEFCRF18W1xcdTBBRDAtXFx1MEFEMF18W1xcdTBBRTAtXFx1MEFFMF18W1xcdTBCMDUtXFx1MEIwQ118W1xcdTBCMEYtXFx1MEIxMF18W1xcdTBCMTMtXFx1MEIyOF18W1xcdTBCMkEtXFx1MEIzMF18W1xcdTBCMzItXFx1MEIzM118W1xcdTBCMzYtXFx1MEIzOV18W1xcdTBCM0QtXFx1MEIzRF18W1xcdTBCNUMtXFx1MEI1RF18W1xcdTBCNUYtXFx1MEI2MV18W1xcdTBCODUtXFx1MEI4QV18W1xcdTBCOEUtXFx1MEI5MF18W1xcdTBCOTItXFx1MEI5NV18W1xcdTBCOTktXFx1MEI5QV18W1xcdTBCOUMtXFx1MEI5Q118W1xcdTBCOUUtXFx1MEI5Rl18W1xcdTBCQTMtXFx1MEJBNF18W1xcdTBCQTgtXFx1MEJBQV18W1xcdTBCQUUtXFx1MEJCNV18W1xcdTBCQjctXFx1MEJCOV18W1xcdTBDMDUtXFx1MEMwQ118W1xcdTBDMEUtXFx1MEMxMF18W1xcdTBDMTItXFx1MEMyOF18W1xcdTBDMkEtXFx1MEMzM118W1xcdTBDMzUtXFx1MEMzOV18W1xcdTBDNjAtXFx1MEM2MV18W1xcdTBDODUtXFx1MEM4Q118W1xcdTBDOEUtXFx1MEM5MF18W1xcdTBDOTItXFx1MENBOF18W1xcdTBDQUEtXFx1MENCM118W1xcdTBDQjUtXFx1MENCOV18W1xcdTBDREUtXFx1MENERV18W1xcdTBDRTAtXFx1MENFMV18W1xcdTBEMDUtXFx1MEQwQ118W1xcdTBEMEUtXFx1MEQxMF18W1xcdTBEMTItXFx1MEQyOF18W1xcdTBEMkEtXFx1MEQzOV18W1xcdTBENjAtXFx1MEQ2MV18W1xcdTBFMDEtXFx1MEUzMF18W1xcdTBFMzItXFx1MEUzM118W1xcdTBFNDAtXFx1MEU0NV18W1xcdTBFODEtXFx1MEU4Ml18W1xcdTBFODQtXFx1MEU4NF18W1xcdTBFODctXFx1MEU4OF18W1xcdTBFOEEtXFx1MEU4QV18W1xcdTBFOEQtXFx1MEU4RF18W1xcdTBFOTQtXFx1MEU5N118W1xcdTBFOTktXFx1MEU5Rl18W1xcdTBFQTEtXFx1MEVBM118W1xcdTBFQTUtXFx1MEVBNV18W1xcdTBFQTctXFx1MEVBN118W1xcdTBFQUEtXFx1MEVBQl18W1xcdTBFQUQtXFx1MEVCMF18W1xcdTBFQjItXFx1MEVCM118W1xcdTBFQkQtXFx1MEVCRF18W1xcdTBFQzAtXFx1MEVDNF18W1xcdTBFREMtXFx1MEVERF18W1xcdTBGMDAtXFx1MEYwMF18W1xcdTBGNDAtXFx1MEY0N118W1xcdTBGNDktXFx1MEY2OV18W1xcdTBGODgtXFx1MEY4Ql18W1xcdTExMDAtXFx1MTE1OV18W1xcdTExNUYtXFx1MTFBMl18W1xcdTExQTgtXFx1MTFGOV18W1xcdTIxMzUtXFx1MjEzOF18W1xcdTMwMDYtXFx1MzAwNl18W1xcdTMwNDEtXFx1MzA5NF18W1xcdTMwQTEtXFx1MzBGQV18W1xcdTMxMDUtXFx1MzEyQ118W1xcdTMxMzEtXFx1MzE4RV18W1xcdTRFMDAtXFx1OUZBNV18W1xcdUFDMDAtXFx1RDdBM118W1xcdUY5MDAtXFx1RkEyRF18W1xcdUZCMUYtXFx1RkIyOF18W1xcdUZCMkEtXFx1RkIzNl18W1xcdUZCMzgtXFx1RkIzQ118W1xcdUZCM0UtXFx1RkIzRV18W1xcdUZCNDAtXFx1RkI0MV18W1xcdUZCNDMtXFx1RkI0NF18W1xcdUZCNDYtXFx1RkJCMV18W1xcdUZCRDMtXFx1RkQzRF18W1xcdUZENTAtXFx1RkQ4Rl18W1xcdUZEOTItXFx1RkRDN118W1xcdUZERjAtXFx1RkRGQl18W1xcdUZFNzAtXFx1RkU3Ml18W1xcdUZFNzQtXFx1RkU3NF18W1xcdUZFNzYtXFx1RkVGQ118W1xcdUZGNjYtXFx1RkY2Rl18W1xcdUZGNzEtXFx1RkY5RF18W1xcdUZGQTAtXFx1RkZCRV18W1xcdUZGQzItXFx1RkZDN118W1xcdUZGQ0EtXFx1RkZDRl18W1xcdUZGRDItXFx1RkZEN118W1xcdUZGREEtXFx1RkZEQ10vLFxuLyogLS0tICovXG5cbiAgTmwgICA6IC9bXFx1MjE2MC1cXHUyMTgyXXxbXFx1MzAwNy1cXHUzMDA3XXxbXFx1MzAyMS1cXHUzMDI5XS8sXG4gIE1uICAgOiAvW1xcdTAzMDAtXFx1MDM0NV18W1xcdTAzNjAtXFx1MDM2MV18W1xcdTA0ODMtXFx1MDQ4Nl18W1xcdTA1OTEtXFx1MDVBMV18W1xcdTA1QTMtXFx1MDVCOV18W1xcdTA1QkItXFx1MDVCRF18W1xcdTA1QkYtXFx1MDVCRl18W1xcdTA1QzEtXFx1MDVDMl18W1xcdTA1QzQtXFx1MDVDNF18W1xcdTA2NEItXFx1MDY1Ml18W1xcdTA2NzAtXFx1MDY3MF18W1xcdTA2RDYtXFx1MDZEQ118W1xcdTA2REYtXFx1MDZFNF18W1xcdTA2RTctXFx1MDZFOF18W1xcdTA2RUEtXFx1MDZFRF18W1xcdTA5MDEtXFx1MDkwMl18W1xcdTA5M0MtXFx1MDkzQ118W1xcdTA5NDEtXFx1MDk0OF18W1xcdTA5NEQtXFx1MDk0RF18W1xcdTA5NTEtXFx1MDk1NF18W1xcdTA5NjItXFx1MDk2M118W1xcdTA5ODEtXFx1MDk4MV18W1xcdTA5QkMtXFx1MDlCQ118W1xcdTA5QzEtXFx1MDlDNF18W1xcdTA5Q0QtXFx1MDlDRF18W1xcdTA5RTItXFx1MDlFM118W1xcdTBBMDItXFx1MEEwMl18W1xcdTBBM0MtXFx1MEEzQ118W1xcdTBBNDEtXFx1MEE0Ml18W1xcdTBBNDctXFx1MEE0OF18W1xcdTBBNEItXFx1MEE0RF18W1xcdTBBNzAtXFx1MEE3MV18W1xcdTBBODEtXFx1MEE4Ml18W1xcdTBBQkMtXFx1MEFCQ118W1xcdTBBQzEtXFx1MEFDNV18W1xcdTBBQzctXFx1MEFDOF18W1xcdTBBQ0QtXFx1MEFDRF18W1xcdTBCMDEtXFx1MEIwMV18W1xcdTBCM0MtXFx1MEIzQ118W1xcdTBCM0YtXFx1MEIzRl18W1xcdTBCNDEtXFx1MEI0M118W1xcdTBCNEQtXFx1MEI0RF18W1xcdTBCNTYtXFx1MEI1Nl18W1xcdTBCODItXFx1MEI4Ml18W1xcdTBCQzAtXFx1MEJDMF18W1xcdTBCQ0QtXFx1MEJDRF18W1xcdTBDM0UtXFx1MEM0MF18W1xcdTBDNDYtXFx1MEM0OF18W1xcdTBDNEEtXFx1MEM0RF18W1xcdTBDNTUtXFx1MEM1Nl18W1xcdTBDQkYtXFx1MENCRl18W1xcdTBDQzYtXFx1MENDNl18W1xcdTBDQ0MtXFx1MENDRF18W1xcdTBENDEtXFx1MEQ0M118W1xcdTBENEQtXFx1MEQ0RF18W1xcdTBFMzEtXFx1MEUzMV18W1xcdTBFMzQtXFx1MEUzQV18W1xcdTBFNDctXFx1MEU0RV18W1xcdTBFQjEtXFx1MEVCMV18W1xcdTBFQjQtXFx1MEVCOV18W1xcdTBFQkItXFx1MEVCQ118W1xcdTBFQzgtXFx1MEVDRF18W1xcdTBGMTgtXFx1MEYxOV18W1xcdTBGMzUtXFx1MEYzNV18W1xcdTBGMzctXFx1MEYzN118W1xcdTBGMzktXFx1MEYzOV18W1xcdTBGNzEtXFx1MEY3RV18W1xcdTBGODAtXFx1MEY4NF18W1xcdTBGODYtXFx1MEY4N118W1xcdTBGOTAtXFx1MEY5NV18W1xcdTBGOTctXFx1MEY5N118W1xcdTBGOTktXFx1MEZBRF18W1xcdTBGQjEtXFx1MEZCN118W1xcdTBGQjktXFx1MEZCOV18W1xcdTIwRDAtXFx1MjBEQ118W1xcdTIwRTEtXFx1MjBFMV18W1xcdTMwMkEtXFx1MzAyRl18W1xcdTMwOTktXFx1MzA5QV18W1xcdUZCMUUtXFx1RkIxRV18W1xcdUZFMjAtXFx1RkUyM10vLFxuICBNYyAgIDogL1tcXHUwOTAzLVxcdTA5MDNdfFtcXHUwOTNFLVxcdTA5NDBdfFtcXHUwOTQ5LVxcdTA5NENdfFtcXHUwOTgyLVxcdTA5ODNdfFtcXHUwOUJFLVxcdTA5QzBdfFtcXHUwOUM3LVxcdTA5QzhdfFtcXHUwOUNCLVxcdTA5Q0NdfFtcXHUwOUQ3LVxcdTA5RDddfFtcXHUwQTNFLVxcdTBBNDBdfFtcXHUwQTgzLVxcdTBBODNdfFtcXHUwQUJFLVxcdTBBQzBdfFtcXHUwQUM5LVxcdTBBQzldfFtcXHUwQUNCLVxcdTBBQ0NdfFtcXHUwQjAyLVxcdTBCMDNdfFtcXHUwQjNFLVxcdTBCM0VdfFtcXHUwQjQwLVxcdTBCNDBdfFtcXHUwQjQ3LVxcdTBCNDhdfFtcXHUwQjRCLVxcdTBCNENdfFtcXHUwQjU3LVxcdTBCNTddfFtcXHUwQjgzLVxcdTBCODNdfFtcXHUwQkJFLVxcdTBCQkZdfFtcXHUwQkMxLVxcdTBCQzJdfFtcXHUwQkM2LVxcdTBCQzhdfFtcXHUwQkNBLVxcdTBCQ0NdfFtcXHUwQkQ3LVxcdTBCRDddfFtcXHUwQzAxLVxcdTBDMDNdfFtcXHUwQzQxLVxcdTBDNDRdfFtcXHUwQzgyLVxcdTBDODNdfFtcXHUwQ0JFLVxcdTBDQkVdfFtcXHUwQ0MwLVxcdTBDQzRdfFtcXHUwQ0M3LVxcdTBDQzhdfFtcXHUwQ0NBLVxcdTBDQ0JdfFtcXHUwQ0Q1LVxcdTBDRDZdfFtcXHUwRDAyLVxcdTBEMDNdfFtcXHUwRDNFLVxcdTBENDBdfFtcXHUwRDQ2LVxcdTBENDhdfFtcXHUwRDRBLVxcdTBENENdfFtcXHUwRDU3LVxcdTBENTddfFtcXHUwRjNFLVxcdTBGM0ZdfFtcXHUwRjdGLVxcdTBGN0ZdLyxcbiAgTmQgICA6IC9bXFx1MDAzMC1cXHUwMDM5XXxbXFx1MDY2MC1cXHUwNjY5XXxbXFx1MDZGMC1cXHUwNkY5XXxbXFx1MDk2Ni1cXHUwOTZGXXxbXFx1MDlFNi1cXHUwOUVGXXxbXFx1MEE2Ni1cXHUwQTZGXXxbXFx1MEFFNi1cXHUwQUVGXXxbXFx1MEI2Ni1cXHUwQjZGXXxbXFx1MEJFNy1cXHUwQkVGXXxbXFx1MEM2Ni1cXHUwQzZGXXxbXFx1MENFNi1cXHUwQ0VGXXxbXFx1MEQ2Ni1cXHUwRDZGXXxbXFx1MEU1MC1cXHUwRTU5XXxbXFx1MEVEMC1cXHUwRUQ5XXxbXFx1MEYyMC1cXHUwRjI5XXxbXFx1RkYxMC1cXHVGRjE5XS8sXG4gIFBjICAgOiAvW1xcdTAwNUYtXFx1MDA1Rl18W1xcdTIwM0YtXFx1MjA0MF18W1xcdTMwRkItXFx1MzBGQl18W1xcdUZFMzMtXFx1RkUzNF18W1xcdUZFNEQtXFx1RkU0Rl18W1xcdUZGM0YtXFx1RkYzRl18W1xcdUZGNjUtXFx1RkY2NV0vLFxuICBacyAgIDogL1tcXHUyMDAwLVxcdTIwMEJdfFtcXHUzMDAwLVxcdTMwMDBdLyxcbn07XG4iXX0=
(28)
});
