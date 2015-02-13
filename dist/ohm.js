!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ohm=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var ohm = _dereq_('../src/main.js');
ohm.makeRecipe(function() {
  return new this.newGrammar('Ohm', /* in namespace */ 'default')
      .withSuperGrammar('Grammar', /* from namespace */ 'default')
      .define('Grammars', this.many(this.app('Grammar'), 0))
      .define('Grammar', this.seq(this.app('ident'), this.opt(this.app('SuperGrammar')), this.prim('{'), this.many(this.app('Rule'), 0), this.prim('}')))
      .define('SuperGrammar_qualified', this.seq(this.prim('<:'), this.app('ident'), this.prim('.'), this.app('ident')))
      .define('SuperGrammar_unqualified', this.seq(this.prim('<:'), this.app('ident')))
      .define('SuperGrammar', this.alt(this.app('SuperGrammar_qualified'), this.app('SuperGrammar_unqualified')))
      .define('Rule_define', this.seq(this.app('ident'), this.opt(this.app('ruleDescr')), this.prim('='), this.app('Alt')))
      .define('Rule_override', this.seq(this.app('ident'), this.prim(':='), this.app('Alt')))
      .define('Rule_extend', this.seq(this.app('ident'), this.prim('+='), this.app('Alt')))
      .define('Rule', this.alt(this.app('Rule_define'), this.app('Rule_override'), this.app('Rule_extend')))
      .define('Alt_rec', this.seq(this.app('Term'), this.prim('|'), this.app('Alt')))
      .define('Alt', this.alt(this.app('Alt_rec'), this.app('Term')))
      .define('Term_inline', this.seq(this.app('Seq'), this.app('caseName')))
      .define('Term', this.alt(this.app('Term_inline'), this.app('Seq')))
      .define('Seq', this.many(this.app('Iter'), 0))
      .define('Iter_star', this.seq(this.app('Pred'), this.prim('*')))
      .define('Iter_plus', this.seq(this.app('Pred'), this.prim('+')))
      .define('Iter_opt', this.seq(this.app('Pred'), this.prim('?')))
      .define('Iter', this.alt(this.app('Iter_star'), this.app('Iter_plus'), this.app('Iter_opt'), this.app('Pred')))
      .define('Pred_not', this.seq(this.prim('~'), this.app('Base')))
      .define('Pred_lookahead', this.seq(this.prim('&'), this.app('Base')))
      .define('Pred', this.alt(this.app('Pred_not'), this.app('Pred_lookahead'), this.app('Base')))
      .define('Base_application', this.seq(this.app('ident'), this.not(this.alt(this.seq(this.opt(this.app('ruleDescr')), this.prim('=')), this.prim(':='), this.prim('+=')))))
      .define('Base_prim', this.alt(this.app('keyword'), this.app('string'), this.app('regExp'), this.app('number')))
      .define('Base_paren', this.seq(this.prim('('), this.app('Alt'), this.prim(')')))
      .define('Base_arr', this.seq(this.prim('['), this.app('Alt'), this.prim(']')))
      .define('Base_obj', this.seq(this.prim('{'), this.opt(this.prim('...')), this.prim('}')))
      .define('Base_objWithProps', this.seq(this.prim('{'), this.app('Props'), this.opt(this.seq(this.prim(','), this.prim('...'))), this.prim('}')))
      .define('Base', this.alt(this.app('Base_application'), this.app('Base_prim'), this.app('Base_paren'), this.app('Base_arr'), this.app('Base_obj'), this.app('Base_objWithProps')))
      .define('Props_rec', this.seq(this.app('Prop'), this.prim(','), this.app('Props')))
      .define('Props_base', this.app('Prop'))
      .define('Props', this.alt(this.app('Props_rec'), this.app('Props_base')))
      .define('Prop', this.seq(this.alt(this.app('name'), this.app('string')), this.prim(':'), this.app('Alt')))
      .define('ruleDescr', this.seq(this.prim('--'), this.app('ruleDescrText'), this.prim('\n')))
      .define('ruleDescrText', this.many(this.seq(this.not(this.prim('\n')), this.app('_')), 0))
      .define('caseName', this.seq(this.prim('--'), this.many(this.seq(this.not(this.prim('\n')), this.app('space')), 0), this.app('name'), this.many(this.seq(this.not(this.prim('\n')), this.app('space')), 0), this.alt(this.prim('\n'), this.la(this.prim('}')))))
      .define('name', this.seq(this.app('nameFirst'), this.many(this.app('nameRest'), 0)))
      .define('nameFirst', this.alt(this.prim('_'), this.app('letter')))
      .define('nameRest', this.alt(this.prim('_'), this.app('alnum')))
      .define('ident', this.seq(this.not(this.app('keyword')), this.app('name')))
      .define('keyword_undefined', this.seq(this.prim('undefined'), this.not(this.app('nameRest'))))
      .define('keyword_null', this.seq(this.prim('null'), this.not(this.app('nameRest'))))
      .define('keyword_true', this.seq(this.prim('true'), this.not(this.app('nameRest'))))
      .define('keyword_false', this.seq(this.prim('false'), this.not(this.app('nameRest'))))
      .define('keyword', this.alt(this.app('keyword_undefined'), this.app('keyword_null'), this.app('keyword_true'), this.app('keyword_false')))
      .define('string', this.alt(this.seq(this.prim("'"), this.many(this.app('singleQuoteStrChar'), 0), this.prim("'")), this.seq(this.prim('"'), this.many(this.app('doubleQuoteStrChar'), 0), this.prim('"'))))
      .define('singleQuoteStrChar', this.alt(this.app('escapeChar'), this.seq(this.not(this.prim("'")), this.not(this.prim('\n')), this.app('_'))))
      .define('doubleQuoteStrChar', this.alt(this.app('escapeChar'), this.seq(this.not(this.prim('"')), this.not(this.prim('\n')), this.app('_'))))
      .define('escapeChar_hexEscape', this.seq(this.prim('\\x'), this.app('hexDigit'), this.app('hexDigit')))
      .define('escapeChar_unicodeEscape', this.seq(this.prim('\\u'), this.app('hexDigit'), this.app('hexDigit'), this.app('hexDigit'), this.app('hexDigit')))
      .define('escapeChar_escape', this.seq(this.prim('\\'), this.app('_')))
      .define('escapeChar', this.alt(this.app('escapeChar_hexEscape'), this.app('escapeChar_unicodeEscape'), this.app('escapeChar_escape')))
      .define('regExp', this.seq(this.prim('/'), this.app('reCharClass'), this.prim('/')))
      .define('reCharClass_unicode', this.seq(this.prim('\\p{'), this.many(this.prim(/[A-Za-z]/), 1), this.prim('}')))
      .define('reCharClass_ordinary', this.seq(this.prim('['), this.many(this.alt(this.prim('\\]'), this.seq(this.not(this.prim(']')), this.app('_'))), 0), this.prim(']')))
      .define('reCharClass', this.alt(this.app('reCharClass_unicode'), this.app('reCharClass_ordinary')))
      .define('number', this.seq(this.opt(this.prim('-')), this.many(this.app('digit'), 1)))
      .define('space_singleLine', this.seq(this.prim('//'), this.many(this.seq(this.not(this.prim('\n')), this.app('_')), 0), this.prim('\n')))
      .define('space_multiLine', this.seq(this.prim('/*'), this.many(this.seq(this.not(this.prim('*/')), this.app('_')), 0), this.prim('*/')))
      .extend('space', this.alt(this.alt(this.app('space_singleLine'), this.app('space_multiLine')), this.prim(/[\s]/)))
      .install();
});

},{"../src/main.js":23}],2:[function(_dereq_,module,exports){
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

},{"base64-js":3,"ieee754":4}],3:[function(_dereq_,module,exports){
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

},{}],4:[function(_dereq_,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],5:[function(_dereq_,module,exports){
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

},{"buffer":2}],6:[function(_dereq_,module,exports){
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

},{"./md5":7,"./rng":8,"./sha":9,"./sha256":10,"buffer":2}],7:[function(_dereq_,module,exports){
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

},{"./helpers":5}],8:[function(_dereq_,module,exports){
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

},{}],9:[function(_dereq_,module,exports){
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

},{"./helpers":5}],10:[function(_dereq_,module,exports){

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

},{"./helpers":5}],11:[function(_dereq_,module,exports){
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

},{"crypto":6}],12:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var GrammarDecl = _dereq_("./GrammarDecl.js");
var pexprs = _dereq_("./pexprs.js");

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Builder() {}

Builder.prototype = {
  newGrammar: function(name, optNamespaceName) {
    return new GrammarDecl(name, optNamespaceName);
  },

  anything: function() {
    return pexprs.anything;
  },

  end: function() {
    return pexprs.end;
  },

  fail: function() {
    return pexprs.fail;
  },

  prim: function(x) {
    return pexprs.makePrim(x);
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

  many: function(expr, minNumMatches) {
    return new pexprs.Many(expr, minNumMatches);
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

  obj: function(properties, isLenient) {
    return new pexprs.Obj(properties, !!isLenient);
  },

  app: function(ruleName, optFromInterval) {
    return new pexprs.Apply(ruleName, optFromInterval);
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Builder;


},{"./GrammarDecl.js":14,"./pexprs.js":33}],13:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var InputStream = _dereq_("./InputStream.js");
var Interval = _dereq_("./Interval.js");
var Node = _dereq_("./Node.js");
var State = _dereq_("./State.js");
var attributes = _dereq_("./attributes.js");
var common = _dereq_("./common.js");
var errors = _dereq_("./errors.js");
var namespace = _dereq_("./namespaces.js");
var pexprs = _dereq_("./pexprs.js");

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Grammar(name, superGrammar, ruleDict) {
  this.name = name;
  this.superGrammar = superGrammar;
  this.ruleDict = ruleDict;
  this.constructors = this.ctors = this.createConstructors();
}

Grammar.prototype = {
  construct: function(ruleName, children) {
    var body = this.ruleDict[ruleName];
    if (!body || !body.check(this, children) || children.length !== body.getArity()) {
      throw new errors.InvalidConstructorCall(this, ruleName, children);
    }
    var interval = new Interval(InputStream.newFor(children), 0, children.length);
    return new Node(this, ruleName, children, interval);
  },

  createConstructors: function() {
    var self = this;
    var constructors = {};

    for (var ruleName in this.ruleDict) {
      // We want *all* properties, not just own properties, because of
      // supergrammars.

      // also WOW I can't believe I was bitten AGAIN by Javascript's
      // silly mutable for-bound variables
      (function(ruleName) {
	constructors[ruleName] = function(/* val1, val2, ... */) {
	  return self.construct(ruleName, Array.prototype.slice.call(arguments));
	};
      })(ruleName);
    }
    return constructors;
  },

  match: function(obj, startRule, optThrowOnFail) {
    return this.matchContents(typeof obj === "string" ? obj : [obj], startRule, optThrowOnFail);
  },

  matchContents: function(obj, startRule, optThrowOnFail) {
    var throwOnFail = !!optThrowOnFail;
    var inputStream = InputStream.newFor(obj);
    var state = new State(this, inputStream);
    var succeeded = new pexprs.Apply(startRule).eval(state);
    if (succeeded) {
      var node = state.bindings[0];
      var stack = [undefined];
      var setParents = this.semanticAction({
        _terminal: function() {
          this.parent = stack[stack.length - 1];
        },
        _default: function() {
          stack.push(this);
          this.children.forEach(function(child) { setParents(child); });
          stack.pop();
          this.parent = stack[stack.length - 1];
        }
      });
      setParents(node);
      return node;
    } else if (throwOnFail) {
      throw new errors.MatchFailure(state);
    } else {
      return false;
    }
  },

  semanticAction: function(actionDict) {
    this.assertSemanticActionNamesAndAritiesMatch(actionDict);
    var semanticAction = attributes.makeSemanticAction(actionDict);
    semanticAction.grammar = this;
    return semanticAction;
  },

  synthesizedAttribute: function(actionDict) {
    this.assertSemanticActionNamesAndAritiesMatch(actionDict);
    var attribute = attributes.makeSynthesizedAttribute(actionDict);
    attribute.grammar = this;
    return attribute;
  },

  inheritedAttribute: function(actionDict) {
    this.assertSemanticActionNamesAndAritiesMatch(actionDict);
    if (!actionDict._base) {
      throw new Error("inherited attribute missing base case");
    } else if (actionDict._base.length !== 1) {
      throw new Error("inherited attribute's base case must take exactly one argument");
    }
    var attribute = attributes.makeInheritedAttribute(actionDict);
    attribute.grammar = this;
    return attribute;
  },

  assertSemanticActionNamesAndAritiesMatch: function(actionDict) {
    var self = this;
    var ruleDict = this.ruleDict;
    var ok = true;
    Object.keys(ruleDict).forEach(function(ruleName) {
      if (actionDict[ruleName] === undefined) {
        return;
      }
      var actual = actionDict[ruleName].length;
      var expected = self.semanticActionArity(ruleName);
      if (actual !== expected) {
        ok = false;
        console.log("semantic action for rule", ruleName, "has the wrong arity");
        console.log("  expected", expected);
        console.log("    actual", actual);
      }
    });
    if (!ok) {
      throw new Error("one or more semantic actions have the wrong arity -- see console for details");
    }
  },

  semanticActionArity: function(ruleName) {
    if (this.superGrammar && this.superGrammar.ruleDict[ruleName]) {
      return this.superGrammar.semanticActionArity(ruleName);
    } else {
      var body = this.ruleDict[ruleName];
      return body.getArity();
    }
  },

  toRecipe: function() {
    if (this === namespace("default").grammar("Grammar")) {
      return "(function() {\n" +
          "  // no recipe required for Grammar in default namespace b/c it's built in\n" +
          "  return namespace('default').grammar('Grammar');\n" +
          "})";
    }
    var sb = new common.StringBuffer();
    sb.append("(function() {\n");
    sb.append(
        "  return new this.newGrammar(" + common.toStringLiteral(this.name) +
        ", /* in namespace */ " + common.toStringLiteral(this.namespaceName) + ")\n");
    if (this.superGrammar) {
      var sg = this.superGrammar;
      sb.append(
          "      .withSuperGrammar(" + common.toStringLiteral(sg.name) +
          ", /* from namespace */ " + common.toStringLiteral(sg.namespaceName) + ")\n");
    }
    var ruleNames = Object.keys(this.ruleDict);
    for (var idx = 0; idx < ruleNames.length; idx++) {
      var ruleName = ruleNames[idx];
      var body = this.ruleDict[ruleName];
      sb.append("      .");
      if (this.superGrammar && this.superGrammar.ruleDict[ruleName]) {
        sb.append(body instanceof pexprs.Extend ? "extend" : "override");
      } else {
        sb.append("define");
      }
      sb.append("(" + common.toStringLiteral(ruleName) + ", ");
      body.outputRecipe(sb);
      sb.append(")\n");
    }
    sb.append("      .install();\n");
    sb.append("});");
    return sb.contents();
  },

  // TODO: make sure this is still correct.
  // TODO: the analog of this method for inherited attributes.
  toSemanticActionTemplate: function(/* entryPoint1, entryPoint2, ... */) {
    var entryPoints = arguments.length > 0 ? arguments : Object.keys(this.ruleDict);
    var rulesToBeIncluded = this.rulesThatNeedSemanticAction(entryPoints);

    // TODO: add the super-grammar's templates at the right place, e.g., a case for AddExpr_plus should appear next to
    // other cases of AddExpr.

    var self = this;
    var sb = new common.StringBuffer();
    sb.append("{");

    var first = true;
    for (var ruleName in rulesToBeIncluded) {
      var body = this.ruleDict[ruleName];
      if (first) {
        first = false;
      } else {
        sb.append(",");
      }
      sb.append("\n");
      sb.append("  ");
      self.addSemanticActionTemplate(ruleName, body, sb);
    }

    sb.append("\n}");
    return sb.contents();
  },

  addSemanticActionTemplate: function(ruleName, body, sb) {
    sb.append(ruleName);
    sb.append(": function(");
    var arity = this.semanticActionArity(ruleName);
    sb.append(common.repeat("_", arity).join(", "));
    sb.append(") {\n");
    sb.append("  }");
  },

  rulesThatNeedSemanticAction: function(entryPoints) {
    var self = this;
    function getBody(ruleName) {
      if (self.ruleDict[ruleName] === undefined) {
        throw new errors.UndeclaredRule(ruleName, self.name);
      } else {
        return self.ruleDict[ruleName];
      }
    }

    var rules = {};
    for (var idx = 0; idx < entryPoints.length; idx++) {
      var ruleName = entryPoints[idx];
      getBody(ruleName);  // to make sure the rule exists
      rules[ruleName] = true;
    }

    var done = false;
    while (!done) {
      done = true;
      for (var ruleName in rules) {
        var addedNewRule = getBody(ruleName).addRulesThatNeedSemanticAction(rules, true);
        done &= !addedNewRule;
      }
    }

    return rules;
  }
};

// Install the base grammar in the default namespace

namespace("default").install(new Grammar(
    "Grammar",
    null,
    {
        _: pexprs.anything,
        empty: new pexprs.Seq([]),
        fail: pexprs.fail,
        space: pexprs.makePrim(/[\s]/).withDescription("space"),
        alnum: pexprs.makePrim(/[0-9a-zA-Z]/).withDescription("alpha-numeric character"),
        letter: pexprs.makePrim(/[a-zA-Z]/).withDescription("letter"),
        lower: pexprs.makePrim(/[a-z]/).withDescription("lower-case letter"),
        upper: pexprs.makePrim(/[A-Z]/).withDescription("upper-case letter"),
        digit: pexprs.makePrim(/[0-9]/).withDescription("digit"),
        hexDigit: pexprs.makePrim(/[0-9a-fA-F]/).withDescription("hexadecimal digit"),

        // The following rules are part of the implementation.
        // Their names end with '_' so that they can't be overridden or invoked by programmers.
        spaces_: new pexprs.Alt([new pexprs.Apply("spaces_rec_"), new pexprs.Apply("empty")]),
        spaces_rec_: new pexprs.Seq([new pexprs.Apply("space"), new pexprs.Apply("spaces_")]),
    }));

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Grammar;


},{"./InputStream.js":15,"./Interval.js":16,"./Node.js":17,"./State.js":19,"./attributes.js":20,"./common.js":21,"./errors.js":22,"./namespaces.js":24,"./pexprs.js":33}],14:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Grammar = _dereq_("./Grammar.js");
var errors = _dereq_("./errors.js");
var namespace = _dereq_("./namespaces.js");
var pexprs = _dereq_("./pexprs.js");

// --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------

// Constructors

function GrammarDecl(name, optNamespaceName) {
  this.name = name;
  this.ns = namespace(optNamespaceName || "default");
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
    this.withSuperGrammar("Grammar", "default");
  }
  return this.superGrammar;
};

// Stuff that you should only do once

GrammarDecl.prototype.withSuperGrammar = function(name, optNamespaceName) {
  if (this.superGrammar) {
    throw new Error("the super grammar of a GrammarDecl cannot be set more than once");
  }
  this.superGrammar = (optNamespaceName ? namespace(optNamespaceName) : this.ns).grammar(name);
  this.ruleDict = Object.create(this.superGrammar.ruleDict);
  return this;
};

GrammarDecl.prototype.install = function() {
  var grammar = new Grammar(this.name, this.ensureSuperGrammar(), this.ruleDict);
  var error;
  Object.keys(grammar.ruleDict).forEach(function(ruleName) {
    var body = grammar.ruleDict[ruleName];
    function handleError(e) {
      error = e;
      console.error(e.toString());
    }
    // TODO: change the pexpr.prototype.assert... methods to make them add exceptions to an array that's provided
    // as an arg. Then we'll be able to show more than one error of the same type at a time.
    // TODO: include the offending pexpr in the errors, that way we can show the part of the source that caused it.
    onOhmError(function()  { body.assertChoicesHaveUniformArity(ruleName); }, handleError);
    onOhmError(function()  { body.assertAllApplicationsAreValid(grammar); },  handleError);
  });
  if (error) {
    throw error;
  } else {
    this.ns.install(grammar);
    return grammar;
  }
};

// Rule declarations

GrammarDecl.prototype.define = function(name, body, optDescr) {
  this.ensureSuperGrammar();
  if (optDescr) {
    body.description = optDescr;
  }
  if (this.superGrammar.ruleDict[name]) {
    throw new errors.DuplicateRuleDeclaration(name, this.name, this.superGrammar.name);
  } else if (this.ruleDict[name]) {
    throw new errors.DuplicateRuleDeclaration(name, this.name, this.name);
  }
  this.ruleDict[name] = body;
  return this;
};

GrammarDecl.prototype.override = function(name, body) {
  this.ensureSuperGrammar();
  if (!this.superGrammar.ruleDict[name]) {
    throw new errors.UndeclaredRule(name, this.superGrammar.name);
  }
  this.ruleDict[name] = body;
  return this;
};

GrammarDecl.prototype.extend = function(name, body) {
  this.ensureSuperGrammar();
  if (!this.superGrammar.ruleDict[name]) {
    throw new errors.UndeclaredRule(name, this.superGrammar.name);
  }
  this.ruleDict[name] = new pexprs.Extend(this.superGrammar, name, body);
  return this;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = GrammarDecl;


},{"./Grammar.js":13,"./errors.js":22,"./namespaces.js":24,"./pexprs.js":33}],15:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var Interval = _dereq_('./Interval.js');

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


},{"./Interval.js":16,"./common.js":21}],16:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var errors = _dereq_('./errors.js');

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
}

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


},{"./errors.js":22}],17:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Interval = _dereq_('./Interval.js');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Node(grammar, ctorName, children, interval) {
  this.interval = interval;
  this.grammar = grammar;
  this.ctorName = ctorName;
  this.children = children;
}

// * pred -> childBefore
// * succ -> childAfter

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
    throw new Error('cannot get first child of a ' + this.ctorName + ' node, which has no children');
  } else {
    return this.childAt(0);
  }
};
  
Node.prototype.lastChild = function() {
  if (this.hasNoChildren()) {
    throw new Error('cannot get last child of a ' + this.ctorName + ' node, which has no children');
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

Node.prototype.isValue = function() {
  return this.ctorName === '_terminal';
};

Node.prototype.value = function() {
  if (this.isValue()) {
    return this.firstChild();
  } else {
    throw new Error('cannot get value of a non-terminal node (type ' + this.ctorName + ')');
  }
};

Node.prototype.toJSON = function() {
  var r = {};
  r[this.ctorName] = this.children;
  return r;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Node;


},{"./Interval.js":16}],18:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function PosInfo(globalRuleStack) {
  this.globalRuleStack = globalRuleStack;
  this.ruleStack = [];
  this.activeRules = {};  // redundant (could be generated from ruleStack) but useful for performance reasons
  this.memo = {};
}

PosInfo.prototype = {
  isActive: function(ruleName) {
    return this.activeRules[ruleName];
  },

  enter: function(pexpr) {
    this.globalRuleStack.push(pexpr);
    this.ruleStack.push(pexpr);
    this.activeRules[pexpr.ruleName] = true;
  },

  exit: function() {
    var pexpr = this.globalRuleStack.pop();
    this.ruleStack.pop();
    this.activeRules[pexpr.ruleName] = false;
  },

  shouldUseMemoizedResult: function(memoRec) {
    var involvedRules = memoRec.involvedRules;
    for (var ruleName in involvedRules) {
      if (involvedRules[ruleName] && this.activeRules[ruleName]) {
        return false;
      }
    }
    return true;
  },

  getCurrentLeftRecursion: function() {
    return this.leftRecursionStack ? this.leftRecursionStack[this.leftRecursionStack.length - 1] : undefined;
  },

  startLeftRecursion: function(ruleName) {
    if (!this.leftRecursionStack) {
      this.leftRecursionStack = [];
    }
    this.leftRecursionStack.push({name: ruleName, value: false, pos: -1, involvedRules: {}});
    this.updateInvolvedRules();
  },

  endLeftRecursion: function(ruleName) {
    this.leftRecursionStack.pop();
  },

  updateInvolvedRules: function() {
    var currentLeftRecursion = this.getCurrentLeftRecursion();
    var involvedRules = currentLeftRecursion.involvedRules;
    var lrRuleName = currentLeftRecursion.name;
    var idx = this.ruleStack.length - 1;
    while (true) {
      var ruleName = this.ruleStack[idx--].ruleName;
      if (ruleName === lrRuleName) {
        break;
      }
      involvedRules[ruleName] = true;
    }
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = PosInfo;


},{"./common.js":21}],19:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var pexprs = _dereq_('./pexprs.js');
var PosInfo = _dereq_('./PosInfo.js');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function State(grammar, inputStream) {
  this.grammar = grammar;
  this.inputStreamStack = [];
  this.posInfosStack = [];
  this.pushInputStream(inputStream);
  this.ruleStack = [];
  this.bindings = [];
  this.failureDescriptor = this.makeFailureDescriptor();
}

State.prototype = {
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
    return posInfo || (this.posInfos[pos] = new PosInfo(this.ruleStack));
  },

  recordFailure: function(pos, expr) {
    if (pos < this.failureDescriptor.pos) {
      return;
    } else if (pos > this.failureDescriptor.pos) {
      this.failureDescriptor.pos = pos;
      this.failureDescriptor.exprs = [];
    }
    this.failureDescriptor.exprs.push(expr);
  },

  recordFailures: function(failureDescriptor) {
    var self = this;
    failureDescriptor.exprs.forEach(function(expr) {
      self.recordFailure(failureDescriptor.pos, expr);
    });
  },

  getFailuresPos: function() {
    return this.failureDescriptor.pos;
  },

  makeFailureDescriptor: function() {
    return {pos: -1, exprs: []};
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = State;


},{"./PosInfo.js":18,"./common.js":21,"./pexprs.js":33}],20:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Symbol = this.Symbol || _dereq_('symbol');
var Node = _dereq_('./Node');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

var actions = {
  getValue:    function() { return this.value(); },
  map:         function() { throw new Error('BUG: ohm.actions.map should never be called'); },
  passThrough: function(childNode) { throw new Error('BUG: ohm.actions.passThrough should never be called'); }
};

function _makeSynthesizedAttribute(actionDict, memoize) {
  function get(node) {
    if (!(node instanceof Node)) {
      throw new Error('not an Ohm CST node: ' + JSON.stringify(node));
    }

    function doAction(actionFn, optDontPassChildrenAsAnArgument) {
      if (actionFn === actions.map) {
        if (node.ctorName === '_list') {
          return node.children.map(attribute);
        } else {
          throw new Error('the map default action cannot be used with a ' + node.ctorName + ' node');
        }
      } else if (actionFn === actions.passThrough) {
        if (node.ctorName === '_list') {
          throw new Error('the passThrough default action cannot be used with a _list node');
        } else {
          return attribute(node.onlyChild());
        }
      } else {
        return optDontPassChildrenAsAnArgument ?
            actionFn.apply(node) :
            actionFn.apply(node, node.children);
      }
    }

    if (node.ctorName === '_list' && node.parent) {
      // If an action's name is ctorName$idx, where idx is the 1-based index of a child node that happens
      // to be a list, it should override the _list action for that particular list node.
      var actionName = node.parent.ctorName + '$' + (node.parent.indexOfChild(node) + 1);
      var actionFn = actionDict[actionName];
      if (actionFn) {
        return doAction(actionFn, true);
      }
    }

    var actionFn = actionDict[node.ctorName];
    if (actionFn) {
      return doAction(actionFn);
    } else if (actionDict._default && node.ctorName !== '_terminal') {
      return doAction(actionDict._default, true);
    } else {
      throw new Error('missing method for ' + node.ctorName);
    }
  }

  var attribute;
  if (memoize) {
    var key = Symbol();
    // TODO: add black hole here to detect cycles.
    attribute = function(node) {
      if (!(node.hasOwnProperty(key))) {
        node[key] = get(node);
      }
      return node[key];
    };
    attribute.toString = function() { return '[synthesized attribute]'; };
  } else {
    attribute = get;
    attribute.toString = function() { return '[semantic action]'; };
  }
  return attribute;
}

function makeSemanticAction(actionDict) {
  return _makeSynthesizedAttribute(actionDict, false);
}

function makeSynthesizedAttribute(actionDict) {
  return _makeSynthesizedAttribute(actionDict, true);
}

function makeInheritedAttribute(actionDict) {
  function compute(node) {
    if (!(node instanceof Node)) {
      throw new Error('not an Ohm CST node: ' + JSON.stringify(node));
    }

    function doAction(actionName, optIncludeChildIndex) {
      var actionFn = actionDict[actionName];
      if (actionFn === actions.map) {
        throw new Error('the map default action cannot be used in an inherited attribute');
      } else if (actionFn === actions.passThrough) {
        attribute.set(attribute(node.parent));
        return actionName;
      } else {
        if (optIncludeChildIndex) {
          actionFn.call(node.parent, node, node.parent.indexOfChild(node));
        } else {
          actionFn.call(node.parent, node);
        }
        return actionName;
      }
    }

    if (!node.parent) {
      if (actionDict._base) {
        return doAction('_base');
      } else {
        throw new Error('missing _base action');
      }
    } else {
      if (node.parent.ctorName === '_list') {
        // If there is an action called <ctorName>$<idx>$each, where <idx> is the 1-based index of a child node
        // that happens to be a list, it should override the _list method for that particular list node.
        var grandparent = node.parent.parent;
        var actionName = grandparent.ctorName + '$' + (grandparent.indexOfChild(node.parent) + 1) + '$each';
        if (actionDict[actionName]) {
          return doAction(actionName);
        } else if (actionDict._list) {
          actionDict._list.call(node.parent, node, node.parent.indexOfChild(node));
          return '_list';
        } else if (actionDict._default) {
          return doAction('_default', true);
        } else {
          throw new Error('missing ' + actionName + ', _list, or _default method');
        }
      } else {
        var actionName = node.parent.ctorName + '$' + (node.parent.indexOfChild(node) + 1);
        if (actionDict[actionName]) {
          return doAction(actionName);
        } else if (actionDict._default) {
          return doAction('_default', true);
        } else {
          throw new Error('missing ' + actionName + ' or _default method');
        }
      }
    }
  }
  var key = Symbol();
  var currentChildStack = [];
  var attribute = function(node) {
    if (!node.hasOwnProperty(key)) {
      currentChildStack.push(node);
      try {
        var methodName = compute(node);
        if (!node.hasOwnProperty(key)) {
          throw new Error('method ' + methodName + ' did not set a value for a child node of type ' + node.ctorName);
        }
      } finally {
        currentChildStack.pop();
      }
    }
    return node[key];
  };
  attribute.set = function(value) {
    var node = currentChildStack[currentChildStack.length - 1];
    if (node.hasOwnProperty(key)) {
      throw new Error('the value of an inherited attribute cannot be set more than once');
    } else {
      node[key] = value;
    }
  };
  attribute.toString = function() { return '[inherited attribute]'; };
  return attribute;
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.makeSemanticAction = makeSemanticAction;
exports.makeSynthesizedAttribute = makeSynthesizedAttribute;
exports.makeInheritedAttribute = makeInheritedAttribute;
exports.actions = actions;


},{"./Node":17,"symbol":11}],21:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------

var thisModule = exports;

// Helpers

function pad(numberAsString, len) {
  var zeros = [];
  for (var idx = 0; idx < numberAsString.length - len; idx++) {
    zeros.push("0");
  }
  return zeros.join("") + numberAsString;
}

var escapeStringFor = {};
for (var c = 0; c < 128; c++) {
  escapeStringFor[c] = String.fromCharCode(c);
}
escapeStringFor["'".charCodeAt(0)]  = "\\'";
escapeStringFor['"'.charCodeAt(0)]  = '\\"';
escapeStringFor["\\".charCodeAt(0)] = "\\\\";
escapeStringFor["\b".charCodeAt(0)] = "\\b";
escapeStringFor["\f".charCodeAt(0)] = "\\f";
escapeStringFor["\n".charCodeAt(0)] = "\\n";
escapeStringFor["\r".charCodeAt(0)] = "\\r";
escapeStringFor["\t".charCodeAt(0)] = "\\t";
escapeStringFor["\v".charCodeAt(0)] = "\\v";

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.abstract = function() {
  throw new Error("this method is abstract!");
};

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
  return "A" <= firstChar && firstChar <= "Z";
};

// StringBuffer

exports.StringBuffer = function() {
  this.strings = [];
};

exports.StringBuffer.prototype.append = function(str) {
  this.strings.push(str);
};

exports.StringBuffer.prototype.contents = function() {
  return this.strings.join("");
};

// Character escaping and unescaping

exports.escapeChar = function(c, optDelim) {
  var charCode = c.charCodeAt(0);
  if ((c == '"' || c == "'") && optDelim && c !== optDelim) {
    return c;
  } else if (charCode < 128) {
    return escapeStringFor[charCode];
  } else if (128 <= charCode && charCode < 256) {
    return "\\x" + pad(charCode.toString(16), 2);
  } else {
    return "\\u" + pad(charCode.toString(16), 4);
  }
};

exports.unescapeChar = function(s) {
  if (s.charAt(0) == '\\') {
    switch (s.charAt(1)) {
      case "b":  return "\b";
      case "f":  return "\f";
      case "n":  return "\n";
      case "r":  return "\r";
      case "t":  return "\t";
      case "v":  return "\v";
      case "x":  return String.fromCharCode(parseInt(s.substring(2, 4), 16));
      case "u":  return String.fromCharCode(parseInt(s.substring(2, 6), 16));
      default:   return s.charAt(1);
    }
  } else {
    return s;
  }
};

// Pretty-printing of strings

exports.toStringLiteral = function(str) {
  if (typeof str !== "string") {
    throw new Error("toStringLiteral only works on strings");
  }
  var hasSingleQuotes = str.indexOf("'") >= 0;
  var hasDoubleQuotes = str.indexOf('"') >= 0;
  var delim = hasSingleQuotes && !hasDoubleQuotes ? '"' : "'";
  var sb = new thisModule.StringBuffer();
  sb.append(delim);
  for (var idx = 0; idx < str.length; idx++) {
    sb.append(thisModule.escapeChar(str[idx], delim));
  }
  sb.append(delim);
  return sb.contents();
};


},{}],22:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_("./common.js");

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function OhmError() {}
OhmError.prototype = Object.create(Error.prototype);

function makeCustomError(name, initFn) {
  // Make E think it's really called OhmError, so that errors look nicer when they're console.log'ed in Chrome.
  var E =
      function OhmError() {  
        initFn.apply(this, arguments);
        var e = new Error(this.message);
        Object.defineProperty(this, "stack", { get: function() { return e.stack; } });
      };
  E.prototype = Object.create(OhmError.prototype);
  E.prototype.constructor = E;
  E.prototype.name = name;
  return E;
}

// ----------------- errors about intervals -----------------

var IntervalSourcesDontMatch = makeCustomError(
    "ohm.error.IntervalSourcesDontMatch",
    function() {
      this.message = "interval sources don't match";
    }
);

// ----------------- errors about grammars -----------------

// Undeclared grammar

var UndeclaredGrammar = makeCustomError(
    "ohm.error.UndeclaredGrammar",
    function(grammarName, namespaceName) {
      this.grammarName = grammarName;
      this.namespaceName = namespaceName;
      this.message = this.namespaceName === "default" ?
          "undeclared grammar " + this.grammarName :
          "grammar " + this.grammarName + " is not declared in namespace " + this.namespaceName;
    }
);

// Duplicate grammar declaration

var DuplicateGrammarDeclaration = makeCustomError(
    "ohm.error.DuplicateGrammarDeclaration",
    function(grammarName, namespaceName) {
      this.grammarName = grammarName;
      this.namespaceName = namespaceName;
      this.message = "grammar " + this.grammarName + " is already declared in namespace " + this.namespaceName;
    }
);

// ----------------- rules -----------------

// Undeclared rule

var UndeclaredRule = makeCustomError(
    "ohm.error.UndeclaredRule",
    function(ruleName, optGrammarName) {
      this.ruleName = ruleName;
      this.grammarName = optGrammarName;
      this.message = this.grammarName ?
          "rule " + this.ruleName + " is not declared in grammar " + this.grammarName :
          "undeclared rule " + this.ruleName;
    }
);

// Duplicate rule declaration

var DuplicateRuleDeclaration = makeCustomError(
    "ohm.error.DuplicateRuleDeclaration",
    function(ruleName, offendingGrammarName, declGrammarName) {
      this.ruleName = ruleName;
      this.offendingGrammarName = offendingGrammarName;
      this.declGrammarName = declGrammarName;
      this.message = "duplicate declaration for rule " + this.ruleName + " in grammar " + this.offendingGrammarName;
      if (this.offendingGrammarName !== declGrammarName) {
        this.message += " (it was originally declared in grammar " + this.declGrammarName + ")";
      }
    }
);

// ----------------- arity -----------------

// Inconsistent arity

var InconsistentArity = makeCustomError(
    "ohm.error.InconsistentArity",
    function(ruleName, expected, actual) {
      this.ruleName = ruleName;
      this.expected = expected;
      this.actual = actual;
      this.message =
          "rule " + this.ruleName + " involves an alternation which has inconsistent arity " +
          "(expected " + this.expected + ", got " + this.actual + ")";
    }
);

// ----------------- properties -----------------

// Duplicate property names

var DuplicatePropertyNames = makeCustomError(
    "ohm.error.DuplicatePropertyNames",
    function(duplicates) {
      this.duplicates = duplicates;
      this.message = "object pattern has duplicate property names: " + this.duplicates.join(", ");
    }
);

// ----------------- syntax -----------------

var MatchFailure = makeCustomError(
    "ohm.error.MatchFailure",
    function(state) {
      this.state = state;
      Object.defineProperty(this, "message", {
          get: function() {
            return this.getMessage();
          }
      });
    }
);

MatchFailure.prototype.getShortMessage = function() {
  if (typeof this.state.inputStream.source !== "string") {
    return "match failed at position " + this.getPos();
  }

  var errorInfo = toErrorInfo(this.getPos(), this.state.inputStream.source);
  return "Line " + errorInfo.lineNum + ", col " + errorInfo.colNum + ": expected " + this.getExpectedText();
};

MatchFailure.prototype.getMessage = function() {
  if (typeof this.state.inputStream.source !== "string") {
    return "match failed at position " + this.getPos();
  }

  var errorInfo = toErrorInfo(this.getPos(), this.state.inputStream.source);
  var sb = new common.StringBuffer();
  var lineAndColText = "Line " + errorInfo.lineNum + ", col " + errorInfo.colNum + ": ";
  sb.append(lineAndColText + errorInfo.line + "\n");
  for (var idx = 1; idx < lineAndColText.length + errorInfo.colNum; idx++) {
    sb.append(" ");
  }
  sb.append("^\n");
  sb.append("Expected " + this.getExpectedText());
  return sb.contents();
};

MatchFailure.prototype.getPos = function() {
  return this.state.getFailuresPos();
};

MatchFailure.prototype.getExpectedText = function() {
  var sb = new common.StringBuffer();
  var expected = this.getExpected();
  for (var idx = 0; idx < expected.length; idx++) {
    if (idx > 0) {
      if (idx === expected.length - 1) {
        sb.append(expected.length > 2 ? ", or " : " or ");
      } else {
        sb.append(", ");
      }
    }
    sb.append(expected[idx]);
  }
  return sb.contents();
};

MatchFailure.prototype.getExpected = function() {
  var self = this;
  var expected = {};
  this.state.failureDescriptor.exprs.forEach(function(expr) {
    expected[expr.toExpected(self.state.grammar.ruleDict)] = true;
  });
  return Object.keys(expected);
};

function toErrorInfo(pos, str) {
  var lineNum = 1;
  var colNum = 1;

  var currPos = 0;
  var lineStartPos = 0;

  while (currPos < pos) {
    var c = str.charAt(currPos++);
    if (c === "\n") {
      lineNum++;
      colNum = 1;
      lineStartPos = currPos;
    } else if (c !== "\r") {
      colNum++;
    }
  }

  var lineEndPos = str.indexOf("\n", lineStartPos);
  if (lineEndPos < 0) {
    lineEndPos = str.length;
  }

  return {
    lineNum: lineNum,
    colNum: colNum,
    line: str.substr(lineStartPos, lineEndPos - lineStartPos)
  };
}

// ----------------- constructors -----------------

// Type error

var InvalidConstructorCall = makeCustomError(
    "ohm.error.InvalidConstructorCall",
    function(grammar, ctorName, children) {
      this.grammar = grammar;
      this.ctorName = ctorName;
      this.children = children;
      this.message = "Attempt to invoke constructor " + this.ctorName + " with invalid or unexpected arguments";
    }
);

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.Error = OhmError;
exports.IntervalSourcesDontMatch = IntervalSourcesDontMatch;
exports.UndeclaredGrammar = UndeclaredGrammar;
exports.DuplicateGrammarDeclaration = DuplicateGrammarDeclaration;
exports.UndeclaredRule = UndeclaredRule;
exports.DuplicateRuleDeclaration = DuplicateRuleDeclaration;
exports.InconsistentArity = InconsistentArity;
exports.DuplicatePropertyNames = DuplicatePropertyNames;
exports.MatchFailure = MatchFailure;
exports.InvalidConstructorCall = InvalidConstructorCall;


},{"./common.js":21}],23:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

_dereq_("./Grammar.js");  // required to initialize default namespace w/ Grammar grammar

var Builder = _dereq_("./Builder.js");
var attributes = _dereq_("./attributes.js");
var common = _dereq_("./common.js");
var errors = _dereq_("./errors.js");
var namespace = _dereq_("./namespaces.js");

var UnicodeCategories = _dereq_("./unicode.js").UnicodeCategories;

var thisModule = exports;
var ohm = exports;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function makeGrammarBuilder(optNamespaceName) {
  var builder;
  var decl;
  var currentRuleName;
  var overriding = false;
  var value = namespace("default").grammar("Ohm").semanticAction({
    Grammar: function(n, s, _, rs, _) {
      builder = new Builder();
      decl = builder.newGrammar(value(n), optNamespaceName || "default");
      value(s);  // force evaluation
      value(rs);  // force evaluation
      return decl.install();
    },

    SuperGrammar_qualified: function(_, ns, _, n) {
      decl.withSuperGrammar(value(n), value(ns));
    },
    SuperGrammar_unqualified: function(_, n) {
      decl.withSuperGrammar(value(n));
    },

    Rule_define: function(n, d, _, b) {
      currentRuleName = value(n);
      var body = value(b);
      body.definitionInterval = this.interval.trimmed();
      return decl.define(currentRuleName, body, value(d));
    },
    Rule_override: function(n, _, b) {
      currentRuleName = value(n);
      overriding = true;
      var body = value(b);
      body.definitionInterval = this.interval.trimmed();
      var ans = decl.override(currentRuleName, body);
      overriding = false;
      return ans;
    },
    Rule_extend: function(n, _, b) {
      currentRuleName = value(n);
      var ans = decl.extend(currentRuleName, value(b));
      decl.ruleDict[currentRuleName].definitionInterval = this.interval.trimmed();
      return ans;
    },

    Alt_rec: function(x, _, y) {
      return builder.alt(value(x), value(y));
    },

    Term_inline: function(b, n) {
      var inlineRuleName = currentRuleName + "_" + value(n);
      var body = value(b);
      body.definitionInterval = this.interval.trimmed();
      if (overriding) {
        decl.override(inlineRuleName, body);
      } else {
        decl.define(inlineRuleName, body);
      }
      return builder.app(inlineRuleName);
    },

    Seq: function(expr) {
      return builder.seq.apply(builder, value(expr));
    },

    Iter_star: function(x, _) {
      return builder.many(value(x), 0);
    },
    Iter_plus: function(x, _) {
      return builder.many(value(x), 1);
    },
    Iter_opt: function(x, _) {
      return builder.opt(value(x));
    },

    Pred_not: function(_, x) {
      return builder.not(value(x));
    },
    Pred_lookahead: function(_, x) {
      return builder.la(value(x));
    },

    Base_application: function(rule) {
      return builder.app(value(rule), this.interval.trimmed());
    },
    Base_prim: function(expr) {
      return builder.prim(value(expr));
    },
    Base_paren: function(_, x, _) {
      return value(x);
    },
    Base_arr: function(_, x, _) {
      return builder.arr(value(x));
    },
    Base_obj: function(_, lenient, _) {
      return builder.obj([], value(lenient));
    },
    Base_objWithProps: function(_, ps, _, lenient, _) {
      return builder.obj(value(ps), value(lenient));
    },

    Props_rec: function(p, _, ps) {
      return [value(p)].concat(value(ps));
    },
    Props_base: function(p) {
      return [value(p)];
    },
    Prop: function(n, _, p) {
      return {name: value(n), pattern: value(p)};
    },

    ruleDescr: function(_, t, _) {
      return value(t);
    },
    ruleDescrText: function(_) {
      return this.interval.contents.trim();
    },

    caseName: function(_, _, n, _, _) {
      return value(n)
    },

    name: function(_, _) {
      return this.interval.contents;
    },
    nameFirst: function(expr) {},
    nameRest: function(expr) {},

    keyword_undefined: function(_) {
      return undefined;
    },
    keyword_null: function(_) {
      return null;
    },
    keyword_true: function(_) {
      return true;
    },
    keyword_false: function(_) {
      return false;
    },

    string: function(_, cs, _) {
      return value(cs).map(function(c) { return common.unescapeChar(c); }).join("");
    },

    singleQuoteStrChar: function(_) {
      return this.interval.contents;
    },

    doubleQuoteStrChar: function(_) {
      return this.interval.contents;
    },

    regExp: function(_, e, _) {
      return value(e);
    },

    reCharClass_unicode: function(_, unicodeClass, _) {
      return UnicodeCategories[value(unicodeClass).join("")];
    },
    reCharClass_ordinary: function(_, _, _) {
      return new RegExp(this.interval.contents);
    },

    number: function(_, _) {
      return parseInt(this.interval.contents);
    },

    space: function(expr) {},
    space_multiLine: function(_, _, _) {},
    space_singleLine: function(_, _, _) {},

    _list: attributes.actions.map,
    _terminal: attributes.actions.getValue,
    _default: attributes.actions.passThrough
  });
  return value;
}

function compileAndLoad(source, whatItIs, optNamespaceName) {
  try {
    var node = namespace("default").grammar("Ohm").match(source, whatItIs, true);
    return makeGrammarBuilder(optNamespaceName)(node);
  } catch (e) {
    if (e instanceof errors.MatchFailure) {
      console.log("\n" + e.getMessage());
    }
    throw e;
  }
}

function makeGrammar(source, optNamespaceName) {
  return compileAndLoad(source, "Grammar", optNamespaceName);
}

function makeGrammars(source, optNamespaceName) {
  return compileAndLoad(source, "Grammars", optNamespaceName);
}

function makeLoc(node) {
  return {
    start: node.interval.startIdx,
    end: node.interval.endIdx
  };
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

// Stuff that users should know about

exports.error = errors;

exports.namespace = namespace;

exports.grammar = function(name) {
  return namespace("default").grammar(name);
};

exports.makeGrammar = makeGrammar;
exports.makeGrammars = makeGrammars;

exports.actions = attributes.actions;

// Stuff that's only here for bootstrapping, testing, etc.

exports.makeRecipe = function(recipe) {
  recipe.call(new Builder());
};

exports._makeGrammarBuilder = makeGrammarBuilder;

_dereq_("../dist/ohm-grammar.js");

// Load all grammars in script elements into the appropriate namespaces

if (typeof document !== "undefined") {
  Array.prototype.slice.call(document.getElementsByTagName("script")).
      filter(function(elt) {
        return elt.getAttribute("type") === "text/ohm-js";
      }).
      forEach(function(elt) {
        var ns = elt.getAttribute("namespace") || "default";
        namespace(ns).loadGrammarsFromScriptElement(elt)
      });
}


},{"../dist/ohm-grammar.js":1,"./Builder.js":12,"./Grammar.js":13,"./attributes.js":20,"./common.js":21,"./errors.js":22,"./namespaces.js":24,"./unicode.js":34}],24:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var ohm = _dereq_("./main.js");
var errors = _dereq_("./errors.js");

// --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------

// TODO: just use the jQuery thing
function load(url) {
  var req = new XMLHttpRequest();
  req.open("GET", url, false);
  try {
    req.send();
    if (req.status === 0 || req.status === 200) {
      return req.responseText;
    }
  } catch (e) {}
  throw new Error("unable to load url " + url);
}

var namespaces = {};

// --------------------------------------------------------------------
// Namespaces
// --------------------------------------------------------------------

function namespace(name) {
  return namespaces[name] ?
    namespaces[name] :
    (namespaces[name] = new Namespace(name));
}

function Namespace(name) {
  this.name = name;
  this.grammars = {};
}

Namespace.prototype = {
  install: function(grammar) {
    if (grammar.namespaceName) {
      throw new Error(
        "cannot install grammar " + grammar.name + " into namespace " + this.name +
        " because it's already in namespace " + grammar.namespaceName);
    } else if (this.grammars[grammar.name]) {
      throw new errors.DuplicateGrammarDeclaration(grammar.name, this.name);
    } else {
      this.grammars[grammar.name] = grammar;
      grammar.namespaceName = this.name;
      return this;
    }
  },

  grammar: function(name) {
    if (this.grammars[name]) {
      return this.grammars[name];
    } else {
      throw new errors.UndeclaredGrammar(name, this.name);
    }
  },

  loadGrammarsFromScriptElement: function(element) {
    if (element.type !== "text/ohm-js") {
      throw new Error("script tag's type attribute must be text/ohm-js");
    }
    var source = element.getAttribute("src") ? load(element.getAttribute("src")) : element.innerHTML;
    try {
      ohm.makeGrammars(source, this.name);
    } catch (e) {
      if (!(e instanceof errors.Error)) {
        console.error(e);
      }
    }
    return this;
  },

  make: function(recipe) {
    return recipe(ohm, this);
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = namespace;


},{"./errors.js":22,"./main.js":23}],25:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var pexprs = _dereq_('./pexprs.js');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.addRulesThatNeedSemanticAction = common.abstract;

pexprs.anything.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  // no-op
};

pexprs.end.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  // no-op
};

pexprs.fail.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  // no-op
};

pexprs.Prim.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  // no-op
};

pexprs.Alt.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  var ans = false;
  for (var idx = 0; idx < this.terms.length; idx++) {
    var term = this.terms[idx];
    ans |= term.addRulesThatNeedSemanticAction(dict, valueRequired);
  }
  return ans;
};

pexprs.Seq.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  var ans = false;
  for (var idx = 0; idx < this.factors.length; idx++) {
    var factor = this.factors[idx];
    ans |= factor.addRulesThatNeedSemanticAction(dict, valueRequired);
  }
  return ans;
};

pexprs.Many.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.expr.addRulesThatNeedSemanticAction(dict, valueRequired);
};

pexprs.Opt.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.expr.addRulesThatNeedSemanticAction(dict, valueRequired);
};

pexprs.Not.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.expr.addRulesThatNeedSemanticAction(dict, false);
};

pexprs.Lookahead.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.expr.addRulesThatNeedSemanticAction(dict, valueRequired);
};

pexprs.Arr.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.expr.addRulesThatNeedSemanticAction(dict, valueRequired);
};

pexprs.Obj.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.expr.addRulesThatNeedSemanticAction(dict, valueRequired);
};

pexprs.Apply.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  if (!valueRequired || dict[this.ruleName]) {
    return false;
  } else {
    return dict[this.ruleName] = true;
  }
};


},{"./common.js":21,"./pexprs.js":33}],26:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var pexprs = _dereq_('./pexprs.js');
var errors = _dereq_('./errors.js');

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

pexprs.fail.assertAllApplicationsAreValid = function(grammar) {
  // no-op
};

pexprs.Prim.prototype.assertAllApplicationsAreValid = function(grammar) {
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

pexprs.Many.prototype.assertAllApplicationsAreValid = function(grammar) {
  this.expr.assertAllApplicationsAreValid(grammar);
};

pexprs.Opt.prototype.assertAllApplicationsAreValid = function(grammar) {
  this.expr.assertAllApplicationsAreValid(grammar);
};

pexprs.Not.prototype.assertAllApplicationsAreValid = function(grammar) {
  this.expr.assertAllApplicationsAreValid(grammar);
};

pexprs.Lookahead.prototype.assertAllApplicationsAreValid = function(grammar) {
  this.expr.assertAllApplicationsAreValid(grammar);
};

pexprs.Arr.prototype.assertAllApplicationsAreValid = function(grammar) {
  this.expr.assertAllApplicationsAreValid(grammar);
};

pexprs.Obj.prototype.assertAllApplicationsAreValid = function(grammar) {
  for (var idx = 0; idx < this.properties.length; idx++) {
    this.properties[idx].pattern.assertAllApplicationsAreValid(grammar);
  }
};

pexprs.Apply.prototype.assertAllApplicationsAreValid = function(grammar) {
  if (!grammar.ruleDict[this.ruleName]) {
    throw new errors.UndeclaredRule(this.ruleName, grammar.name);
  }
};


},{"./common.js":21,"./errors.js":22,"./pexprs.js":33}],27:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_("./common.js");
var pexprs = _dereq_("./pexprs.js");
var errors = _dereq_("./errors.js");

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertChoicesHaveUniformArity = common.abstract;

pexprs.anything.assertChoicesHaveUniformArity = function(ruleName) {
  // no-op
};

pexprs.end.assertChoicesHaveUniformArity = function(ruleName) {
  // no-op
};

pexprs.fail.assertChoicesHaveUniformArity = function(ruleName) {
  // no-op
};

pexprs.Prim.prototype.assertChoicesHaveUniformArity = function(ruleName) {
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
  // Extend is a special case of Alt that's guaranteed to have exactly two cases: [extensions, origBody]
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

pexprs.Many.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  this.expr.assertChoicesHaveUniformArity(ruleName);
};

pexprs.Opt.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  this.expr.assertChoicesHaveUniformArity(ruleName);
};

pexprs.Not.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  // no-op (not required b/c the nested expr doesn't show up in the CST)
};

pexprs.Lookahead.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  this.expr.assertChoicesHaveUniformArity(ruleName);
};

pexprs.Arr.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  this.expr.assertChoicesHaveUniformArity(ruleName);
};

pexprs.Obj.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  for (var idx = 0; idx < this.properties.length; idx++) {
    this.properties[idx].pattern.assertChoicesHaveUniformArity(ruleName);
  }
};

pexprs.Apply.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  // no-op
};


},{"./common.js":21,"./errors.js":22,"./pexprs.js":33}],28:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var Node = _dereq_('./Node.js');
var pexprs = _dereq_('./pexprs.js');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.check = common.abstract;

pexprs.anything.check = function(grammar, vals) {
  return vals.length >= 1;
};

pexprs.end.check = function(grammar, vals) {
  return vals[0] instanceof Node && vals[0].isValue() && vals[0].value() === undefined;
};

pexprs.fail.check = function(grammar, vals) {
  return false;
};

pexprs.Prim.prototype.check = function(grammar, vals) {
  return vals[0] instanceof Node && vals[0].isValue() && vals[0].value() === this.obj;
};

pexprs.RegExpPrim.prototype.check = function(grammar, vals) {
  // TODO: more efficient "total match checker" than the use of .replace here
  return vals[0] instanceof Node &&
         vals[0].isValue() &&
         typeof vals[0].value() === 'string' &&
         vals[0].value().replace(this.obj, '') === '';
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

pexprs.Many.prototype.check = function(grammar, vals) {
  var arity = this.getArity();
  if (arity === 0) {
    // TODO: make this a static check w/ a nice error message, then remove the dynamic check.
    // cf. pexprs-eval.js for Many
    throw 'fix me!';
  }

  var columns = vals.slice(0, arity);
  if (columns.length !== arity) {
    return false;
  }
  var rowcount = columns[0].length;
  var i;
  for (i = 1; i < arity; i++) {
    if (columns[i].length !== rowcount) {
      return false;
    }
  }

  for (i = 0; i < rowcount; i++) {
    var row = []
    for (var j = 0; j < arity; j++) {
      row.push(columns[j][i]);
    }
    if (!this.expr.check(grammar, row)) {
      return false;
    }
  }

  return true;
};

pexprs.Opt.prototype.check = function(grammar, vals) {
  var arity = this.getArity();
  var allUndefined = true;
  for (var i = 0; i < arity; i++) {
    if (vals[i] !== undefined) {
      allUndefined = false;
      break;
    }
  }

  if (allUndefined) {
    return true;
  } else {
    return this.expr.check(grammar, vals);
  }
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
  if (!(vals[0] instanceof Node &&
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


},{"./Node.js":17,"./common.js":21,"./pexprs.js":33}],29:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var errors = _dereq_('./errors.js');
var Node = _dereq_('./Node.js');
var pexprs = _dereq_('./pexprs.js');
var InputStream = _dereq_('./InputStream.js');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

var applySpaces_ = new pexprs.Apply('spaces_');

function skipSpacesIfAppropriate(state) {
  var currentRule = state.ruleStack[state.ruleStack.length - 1];
  var ruleName = currentRule.ruleName || '';
  if (typeof state.inputStream.source === 'string' && common.isSyntactic(ruleName)) {
    skipSpaces(state);
  }
}

function skipSpaces(state) {
  var origFailureDescriptor = state.failureDescriptor;
  var newFailureDescriptor = state.failureDescriptor = state.makeFailureDescriptor();
  applySpaces_.eval(state);
  state.bindings.pop();
  state.failureDescriptor = origFailureDescriptor;
}

// The contract of PExpr.prototype.eval:
// * When the return value is true:
//   -- bindings will have expr.arity more elements than before
// * When the return value is false:
//   -- bindings will have exactly the same number of elements as before
//   -- position could be anywhere

pexprs.PExpr.prototype.eval = common.abstract;

pexprs.anything.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var value = inputStream.next();
  if (value === common.fail) {
    state.recordFailure(origPos, this);
    return false;
  } else {
    state.bindings.push(new Node(state.grammar, '_terminal',  [value], inputStream.intervalFrom(origPos)));
    return true;
  }
};

pexprs.end.eval = function(state) {
  var inputStream = state.inputStream;
  if (state.inputStream.atEnd()) {
    state.bindings.push(new Node(state.grammar, '_terminal', [undefined], inputStream.intervalFrom(inputStream.pos)));
    return true;
  } else {
    state.recordFailure(inputStream.pos, this);
    return false;
  }
};

pexprs.fail.eval = function(state) {
  var inputStream = state.inputStream;
  state.recordFailure(inputStream.pos, this);
  return false;
};

pexprs.Prim.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (this.match(inputStream) === common.fail) {
    state.recordFailure(origPos, this);
    return false;
  } else {
    state.bindings.push(new Node(state.grammar, '_terminal', [this.obj], inputStream.intervalFrom(origPos)));
    return true;
  }
};

pexprs.Prim.prototype.match = function(inputStream) {
  return inputStream.matchExactly(this.obj);
};

pexprs.StringPrim.prototype.match = function(inputStream) {
  return inputStream.matchString(this.obj);
};

pexprs.RegExpPrim.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (inputStream.matchRegExp(this.obj) === common.fail) {
    state.recordFailure(origPos, this);
    return false;
  } else {
    state.bindings.push(
        new Node(state.grammar, '_terminal', [inputStream.source[origPos]], inputStream.intervalFrom(origPos)));
    return true;
  }
};

pexprs.Alt.prototype.eval = function(state) {
  var bindings = state.bindings;
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
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

pexprs.Seq.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origNumBindings = state.bindings.length;
  for (var idx = 0; idx < this.factors.length; idx++) {
    skipSpacesIfAppropriate(state);
    var factor = this.factors[idx];
    if (!factor.eval(state)) {
      state.bindings.length = origNumBindings;
      return false;
    }
  }
  return true;
};

pexprs.Many.prototype.eval = function(state) {
  var arity = this.getArity();
  if (arity === 0) {
    // TODO: make this a static check w/ a nice error message, then remove the dynamic check.
    // cf. pexprs-check.js for Many
    throw 'fix me!';
  }

  var columns = common.repeatFn(function() { return []; }, arity);
  var numMatches = 0;
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  while (true) {
    var backtrackPos = inputStream.pos;
    skipSpacesIfAppropriate(state);
    if (this.expr.eval(state)) {
      numMatches++;
      var row = state.bindings.splice(state.bindings.length - arity, arity);
      for (var idx = 0; idx < row.length; idx++) {
        columns[idx].push(row[idx]);
      }
    } else {
      inputStream.pos = backtrackPos;
      break;
    }
  }
  if (numMatches < this.minNumMatches) {
    return false;
  } else {
    for (var idx = 0; idx < columns.length; idx++) {
      state.bindings.push(new Node(state.grammar, '_list', columns[idx], inputStream.intervalFrom(origPos)));
    }
    return true;
  }
};

pexprs.Opt.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var arity = this.getArity();
  var row;
  if (this.expr.eval(state)) {
    row = state.bindings.splice(state.bindings.length - arity, arity);
  } else {
    inputStream.pos = origPos;
    row = common.repeat(new Node(state.grammar, '_terminal', [undefined], inputStream.intervalFrom(origPos)), arity);
  }
  for (var idx = 0; idx < arity; idx++) {
    state.bindings.push(row[idx]);
  }
  return true;
};

pexprs.Not.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var origFailureDescriptor = state.failureDescriptor;
  var newFailureDescriptor = state.failureDescriptor = state.makeFailureDescriptor();
  var ans = this.expr.eval(state);
  state.failureDescriptor = origFailureDescriptor;
  if (ans) {
    state.recordFailure(origPos, this);
    state.bindings.length -= this.getArity();
    ans = false;
  } else {
    inputStream.pos = origPos;
    ans = true;
  }
  return ans;
};

pexprs.Lookahead.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (this.expr.eval(state)) {
    inputStream.pos = origPos;
    return true;
  } else {
    return false;
  }
};

pexprs.Arr.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var obj = inputStream.next();
  if (obj instanceof Array) {
    var objInputStream = InputStream.newFor(obj);
    state.pushInputStream(objInputStream);
    var ans = this.expr.eval(state) && state.inputStream.atEnd();
    state.popInputStream();
    return ans;
  } else {
    return false;
  }
};

pexprs.Obj.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var obj = inputStream.next();
  if (obj !== common.fail && obj && (typeof obj === 'object' || typeof obj === 'function')) {
    var numOwnPropertiesMatched = 0;
    for (var idx = 0; idx < this.properties.length; idx++) {
      var property = this.properties[idx];
      if (!obj.hasOwnProperty(property.name)) {
        return false;
      }
      var value = obj[property.name];
      var valueInputStream = InputStream.newFor(typeof value === 'string' ? value : [value]);
      state.pushInputStream(valueInputStream);
      var matched = property.pattern.eval(state) && (skipSpacesIfAppropriate(state), state.inputStream.atEnd());
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
      state.bindings.push(new Node(state.grammar, '_terminal', [remainder], inputStream.intervalFrom(origPos)));
      return true;
    } else {
      return numOwnPropertiesMatched === Object.keys(obj).length;
    }
  } else {
    return false;
  }
};

pexprs.Apply.prototype.eval = function(state) {
  function useMemoizedResult(memoRecOrLR) {
    inputStream.pos = memoRecOrLR.pos;
    if (memoRecOrLR.failureDescriptor) {
      state.recordFailures(memoRecOrLR.failureDescriptor);
    }
    if (memoRecOrLR.value) {
      bindings.push(memoRecOrLR.value);
      return true;
    } else {
      return false;
    }
  }

  var ruleName = this.ruleName;

  if (common.isSyntactic(ruleName)) {
    skipSpaces(state);
  }

  var grammar = state.grammar;
  var bindings = state.bindings;
  var inputStream = state.inputStream;
  var origPosInfo = state.getCurrentPosInfo();

  var memoRec = origPosInfo.memo[ruleName];
  if (memoRec && origPosInfo.shouldUseMemoizedResult(memoRec)) {
    return useMemoizedResult(memoRec);
  } else if (origPosInfo.isActive(ruleName)) {
    var currentLR = origPosInfo.getCurrentLeftRecursion();
    if (currentLR && currentLR.name === ruleName) {
      origPosInfo.updateInvolvedRules();
      return useMemoizedResult(currentLR);
    } else {
      origPosInfo.startLeftRecursion(ruleName);
      return false;
    }
  } else {
    var body = grammar.ruleDict[ruleName];
    if (!body) {
      // TODO: make this a "static" check
      throw new errors.UndeclaredRule(ruleName);
    }
    var origPos = inputStream.pos;
    var origFailureDescriptor = state.failureDescriptor;
    var newFailureDescriptor = state.failureDescriptor = state.makeFailureDescriptor();
    origPosInfo.enter(this);
    var value = this.evalOnce(body, state);
    var currentLR = origPosInfo.getCurrentLeftRecursion();
    if (currentLR) {
      if (currentLR.name === ruleName) {
        value = this.handleLeftRecursion(body, state, origPos, currentLR, value);
        origPosInfo.memo[ruleName] = {pos: inputStream.pos, value: value, involvedRules: currentLR.involvedRules};
        origPosInfo.endLeftRecursion(ruleName);
      } else if (!currentLR.involvedRules[ruleName]) {
        // Only memoize if this rule is not involved in the current left recursion
        origPosInfo.memo[ruleName] = {pos: inputStream.pos, value: value};
      }
    } else {
      origPosInfo.memo[ruleName] = {pos: inputStream.pos, value: value};
    }
    if (origPosInfo.memo[ruleName]) {
      origPosInfo.memo[ruleName].failureDescriptor = newFailureDescriptor;
    }
    var ans;
    if (value) {
      bindings.push(value);
      if (state.ruleStack.length === 1) {
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

    if (body.description) {
      if (value) {
        newFailureDescriptor.pos = -1;  // so that the failures are ignored
      } else if (newFailureDescriptor.pos <= origPos) {
        newFailureDescriptor.pos = origPos;
        newFailureDescriptor.exprs = [this];
      }
    }
/*
    Here's the Brian Ford version (what he describes in his Master's thesis):

    if (body.description && newFailureDescriptor.pos === origPos) {
      newFailureDescriptor.pos = origPos;
      newFailureDescriptor.exprs = [this];
    }
*/

    state.failureDescriptor = origFailureDescriptor;
    state.recordFailures(newFailureDescriptor);
    origPosInfo.exit();
    return ans;
  }
};

pexprs.Apply.prototype.evalOnce = function(expr, state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
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

  var value = seedValue;
  currentLR.value = seedValue;
  currentLR.pos = state.inputStream.pos;
  var inputStream = state.inputStream;
  while (true) {
    inputStream.pos = origPos;
    value = this.evalOnce(body, state);
    if (value && inputStream.pos > currentLR.pos) {
      currentLR.value = value;
      currentLR.pos = inputStream.pos;
    } else {
      value = currentLR.value;
      inputStream.pos = currentLR.pos;
      break;
    }
  }
  return value;
};


},{"./InputStream.js":15,"./Node.js":17,"./common.js":21,"./errors.js":22,"./pexprs.js":33}],30:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = _dereq_('./pexprs.js');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.getArity = function() {
  return 1;
};

pexprs.Alt.prototype.getArity = function() {
  // This is ok b/c all terms must have the same arity -- this property is checked by the Grammar constructor.
  return this.terms.length === 0 ? 0 : this.terms[0].getArity();
};

pexprs.Seq.prototype.getArity = function() {
  var arity = 0;
  for (var idx = 0; idx < this.factors.length; idx++) {
    arity += this.factors[idx].getArity();
  }
  return arity;
};

pexprs.Many.prototype.getArity = function() {
  return this.expr.getArity();
};

pexprs.Opt.prototype.getArity = function() {
  return this.expr.getArity();
};

pexprs.Not.prototype.getArity = function() {
  return 0;
};

pexprs.Lookahead.prototype.getArity = function() {
  return this.expr.getArity();
};

pexprs.Arr.prototype.getArity = function() {
  return this.expr.getArity();
};

pexprs.Obj.prototype.getArity = function() {
  var arity = this.isLenient ? 1 : 0;
  for (var idx = 0; idx < this.properties.length; idx++) {
    arity += this.properties[idx].pattern.getArity();
  }
  return arity;
};


},{"./pexprs.js":33}],31:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_("./common.js");
var pexprs = _dereq_("./pexprs.js");

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.outputRecipe = common.abstract;

pexprs.anything.outputRecipe = function(sb) {
  sb.append("this.anything()");
};

pexprs.end.outputRecipe = function(sb) {
  sb.append("this.end()");
};

pexprs.fail.outputRecipe = function(sb) {
  sb.append("this.fail()");
};

pexprs.Prim.prototype.outputRecipe = function(sb) {
  sb.append("this.prim(");
  sb.append(typeof this.obj === "string" ? common.toStringLiteral(this.obj) : "" + this.obj);
  sb.append(")");
};

pexprs.Alt.prototype.outputRecipe = function(sb) {
  sb.append("this.alt(");
  for (var idx = 0; idx < this.terms.length; idx++) {
    if (idx > 0) {
      sb.append(", ");
    }
    this.terms[idx].outputRecipe(sb);
  }
  sb.append(")");
};

pexprs.Seq.prototype.outputRecipe = function(sb) {
  sb.append("this.seq(");
  for (var idx = 0; idx < this.factors.length; idx++) {
    if (idx > 0) {
      sb.append(", ");
    }
    this.factors[idx].outputRecipe(sb);
  }
  sb.append(")");
};

pexprs.Many.prototype.outputRecipe = function(sb) {
  sb.append("this.many(");
  this.expr.outputRecipe(sb);
  sb.append(", ");
  sb.append(this.minNumMatches);
  sb.append(")");
};

pexprs.Opt.prototype.outputRecipe = function(sb) {
  sb.append("this.opt(");
  this.expr.outputRecipe(sb);
  sb.append(")");
};

pexprs.Not.prototype.outputRecipe = function(sb) {
  sb.append("this.not(");
  this.expr.outputRecipe(sb);
  sb.append(")");
};

pexprs.Lookahead.prototype.outputRecipe = function(sb) {
  sb.append("this.la(");
  this.expr.outputRecipe(sb);
  sb.append(")");
};

pexprs.Arr.prototype.outputRecipe = function(sb) {
  sb.append("this.arr(");
  this.expr.outputRecipe(sb);
  sb.append(")");
};

pexprs.Obj.prototype.outputRecipe = function(sb) {
  function outputPropertyRecipe(prop) {
    sb.append("{name: ");
    sb.append(common.toStringLiteral(prop.name));
    sb.append(", pattern: ");
    prop.pattern.outputRecipe(sb);
    sb.append("}");
  }

  sb.append("this.obj([");
  for (var idx = 0; idx < this.properties.length; idx++) {
    if (idx > 0) {
      sb.append(", ");
    }
    outputPropertyRecipe(this.properties[idx]);
  }
  sb.append("], ");
  sb.append(!!this.isLenient);
  sb.append(")");
};

pexprs.Apply.prototype.outputRecipe = function(sb) {
  sb.append("this.app(");
  sb.append(common.toStringLiteral(this.ruleName));
  sb.append(")");
};


},{"./common.js":21,"./pexprs.js":33}],32:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var pexprs = _dereq_('./pexprs.js');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.toExpected = function(ruleDict) {
  return undefined;
};

pexprs.anything.toExpected = function(ruleDict) {
  return "any object";
};

pexprs.end.toExpected = function(ruleDict) {
  return "end of input";
};

pexprs.fail.toExpected = function(ruleDict) {
  return "hell to freeze over";
};

pexprs.Prim.prototype.toExpected = function(ruleDict) {
  return common.toStringLiteral(this.obj);
};

pexprs.Not.prototype.toExpected = function(ruleDict) {
  if (this.expr === pexprs.anything) {
    return "nothing";
  } else {
    return "not " + this.expr.toExpected(ruleDict);
  }
};

// TODO: think about Arr and Obj

pexprs.Apply.prototype.toExpected = function(ruleDict) {
  var description = ruleDict[this.ruleName].description;
  if (description) {
    return description;
  } else {
    var article = /^[aeiouAEIOU]/.test(this.ruleName) ? "an" : "a";
    return article + " " + this.ruleName;
  }
};


},{"./common.js":21,"./pexprs.js":33}],33:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_("./common.js");
var errors = _dereq_("./errors.js");

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

// Anything

var anything = Object.create(PExpr.prototype);

// End

var end = Object.create(PExpr.prototype);

// Fail

var fail = Object.create(PExpr.prototype);

// Primitives

function Prim(obj) {
  this.obj = obj;
}

Prim.prototype = Object.create(PExpr.prototype);

function StringPrim(obj) {
  this.obj = obj;
}

StringPrim.prototype = Object.create(Prim.prototype);

function RegExpPrim(obj) {
  this.obj = obj;
}

RegExpPrim.prototype = Object.create(Prim.prototype);

// Alternation

function Alt(terms) {
  this.terms = terms;
}

Alt.prototype = Object.create(PExpr.prototype);

// Extend is an implementation detail of rule extension

function Extend(superGrammar, name, body) {
  var origBody = superGrammar.ruleDict[name];
  this.terms = [body, origBody];
}

Extend.prototype = Object.create(Alt.prototype);

// Sequences

function Seq(factors) {
  this.factors = factors;
}

Seq.prototype = Object.create(PExpr.prototype);

// Iterators and optionals

function Many(expr, minNumMatches) {
  this.expr = expr;
  this.minNumMatches = minNumMatches;
}

Many.prototype = Object.create(PExpr.prototype);

function Opt(expr) {
  this.expr = expr;
}

Opt.prototype = Object.create(PExpr.prototype);

// Predicates

function Not(expr) {
  this.expr = expr;
}

Not.prototype = Object.create(PExpr.prototype);

function Lookahead(expr) {
  this.expr = expr;
}

Lookahead.prototype = Object.create(PExpr.prototype);

// Array decomposition

function Arr(expr) {
  this.expr = expr;
}

Arr.prototype = Object.create(PExpr.prototype);

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

Obj.prototype = Object.create(PExpr.prototype);

// Rule application

function Apply(ruleName, optFromInterval) {
  this.ruleName = ruleName;
  if (optFromInterval) {
    this.fromInterval = optFromInterval;
  }
}

Apply.prototype = Object.create(PExpr.prototype);

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.makePrim = function(obj) {
  if (typeof obj === "string" && obj.length !== 1) {
    return new StringPrim(obj);
  }
  else if (obj instanceof RegExp) {
    return new RegExpPrim(obj);
  } else {
    return new Prim(obj);
  }
};

exports.PExpr = PExpr;
exports.anything = anything;
exports.end = end;
exports.fail = fail;
exports.Prim = Prim;
exports.StringPrim = StringPrim;
exports.RegExpPrim = RegExpPrim;
exports.Alt = Alt;
exports.Extend = Extend;
exports.Seq = Seq;
exports.Many = Many;
exports.Opt = Opt;
exports.Not = Not;
exports.Lookahead = Lookahead;
exports.Arr = Arr;
exports.Obj = Obj;
exports.Apply = Apply;

// --------------------------------------------------------------------
// Extensions
// --------------------------------------------------------------------

_dereq_("./pexprs-addRulesThatNeedSemanticAction.js");
_dereq_("./pexprs-assertAllApplicationsAreValid.js");
_dereq_("./pexprs-assertChoicesHaveUniformArity.js");
_dereq_("./pexprs-check.js");
_dereq_("./pexprs-getArity.js");
_dereq_("./pexprs-eval.js");
_dereq_("./pexprs-outputRecipe.js");
_dereq_("./pexprs-toExpected.js");


},{"./common.js":21,"./errors.js":22,"./pexprs-addRulesThatNeedSemanticAction.js":25,"./pexprs-assertAllApplicationsAreValid.js":26,"./pexprs-assertChoicesHaveUniformArity.js":27,"./pexprs-check.js":28,"./pexprs-eval.js":29,"./pexprs-getArity.js":30,"./pexprs-outputRecipe.js":31,"./pexprs-toExpected.js":32}],34:[function(_dereq_,module,exports){
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

},{}]},{},[23])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kdWJyb3kvZGV2L2NkZy9vaG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9kdWJyb3kvZGV2L2NkZy9vaG0vZGlzdC9vaG0tZ3JhbW1hci5qcyIsIi9Vc2Vycy9kdWJyb3kvZGV2L2NkZy9vaG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsIi9Vc2Vycy9kdWJyb3kvZGV2L2NkZy9vaG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCIvVXNlcnMvZHVicm95L2Rldi9jZGcvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCIvVXNlcnMvZHVicm95L2Rldi9jZGcvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9jcnlwdG8tYnJvd3NlcmlmeS9oZWxwZXJzLmpzIiwiL1VzZXJzL2R1YnJveS9kZXYvY2RnL29obS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvY3J5cHRvLWJyb3dzZXJpZnkvaW5kZXguanMiLCIvVXNlcnMvZHVicm95L2Rldi9jZGcvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9jcnlwdG8tYnJvd3NlcmlmeS9tZDUuanMiLCIvVXNlcnMvZHVicm95L2Rldi9jZGcvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9jcnlwdG8tYnJvd3NlcmlmeS9ybmcuanMiLCIvVXNlcnMvZHVicm95L2Rldi9jZGcvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9jcnlwdG8tYnJvd3NlcmlmeS9zaGEuanMiLCIvVXNlcnMvZHVicm95L2Rldi9jZGcvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9jcnlwdG8tYnJvd3NlcmlmeS9zaGEyNTYuanMiLCIvVXNlcnMvZHVicm95L2Rldi9jZGcvb2htL25vZGVfbW9kdWxlcy9zeW1ib2wvaW5kZXguanMiLCIvVXNlcnMvZHVicm95L2Rldi9jZGcvb2htL3NyYy9CdWlsZGVyLmpzIiwiL1VzZXJzL2R1YnJveS9kZXYvY2RnL29obS9zcmMvR3JhbW1hci5qcyIsIi9Vc2Vycy9kdWJyb3kvZGV2L2NkZy9vaG0vc3JjL0dyYW1tYXJEZWNsLmpzIiwiL1VzZXJzL2R1YnJveS9kZXYvY2RnL29obS9zcmMvSW5wdXRTdHJlYW0uanMiLCIvVXNlcnMvZHVicm95L2Rldi9jZGcvb2htL3NyYy9JbnRlcnZhbC5qcyIsIi9Vc2Vycy9kdWJyb3kvZGV2L2NkZy9vaG0vc3JjL05vZGUuanMiLCIvVXNlcnMvZHVicm95L2Rldi9jZGcvb2htL3NyYy9Qb3NJbmZvLmpzIiwiL1VzZXJzL2R1YnJveS9kZXYvY2RnL29obS9zcmMvU3RhdGUuanMiLCIvVXNlcnMvZHVicm95L2Rldi9jZGcvb2htL3NyYy9hdHRyaWJ1dGVzLmpzIiwiL1VzZXJzL2R1YnJveS9kZXYvY2RnL29obS9zcmMvY29tbW9uLmpzIiwiL1VzZXJzL2R1YnJveS9kZXYvY2RnL29obS9zcmMvZXJyb3JzLmpzIiwiL1VzZXJzL2R1YnJveS9kZXYvY2RnL29obS9zcmMvbWFpbi5qcyIsIi9Vc2Vycy9kdWJyb3kvZGV2L2NkZy9vaG0vc3JjL25hbWVzcGFjZXMuanMiLCIvVXNlcnMvZHVicm95L2Rldi9jZGcvb2htL3NyYy9wZXhwcnMtYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uLmpzIiwiL1VzZXJzL2R1YnJveS9kZXYvY2RnL29obS9zcmMvcGV4cHJzLWFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkLmpzIiwiL1VzZXJzL2R1YnJveS9kZXYvY2RnL29obS9zcmMvcGV4cHJzLWFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5LmpzIiwiL1VzZXJzL2R1YnJveS9kZXYvY2RnL29obS9zcmMvcGV4cHJzLWNoZWNrLmpzIiwiL1VzZXJzL2R1YnJveS9kZXYvY2RnL29obS9zcmMvcGV4cHJzLWV2YWwuanMiLCIvVXNlcnMvZHVicm95L2Rldi9jZGcvb2htL3NyYy9wZXhwcnMtZ2V0QXJpdHkuanMiLCIvVXNlcnMvZHVicm95L2Rldi9jZGcvb2htL3NyYy9wZXhwcnMtb3V0cHV0UmVjaXBlLmpzIiwiL1VzZXJzL2R1YnJveS9kZXYvY2RnL29obS9zcmMvcGV4cHJzLXRvRXhwZWN0ZWQuanMiLCIvVXNlcnMvZHVicm95L2Rldi9jZGcvb2htL3NyYy9wZXhwcnMuanMiLCIvVXNlcnMvZHVicm95L2Rldi9jZGcvb2htL3NyYy91bmljb2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcmxDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgb2htID0gcmVxdWlyZSgnLi4vc3JjL21haW4uanMnKTtcbm9obS5tYWtlUmVjaXBlKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IHRoaXMubmV3R3JhbW1hcignT2htJywgLyogaW4gbmFtZXNwYWNlICovICdkZWZhdWx0JylcbiAgICAgIC53aXRoU3VwZXJHcmFtbWFyKCdHcmFtbWFyJywgLyogZnJvbSBuYW1lc3BhY2UgKi8gJ2RlZmF1bHQnKVxuICAgICAgLmRlZmluZSgnR3JhbW1hcnMnLCB0aGlzLm1hbnkodGhpcy5hcHAoJ0dyYW1tYXInKSwgMCkpXG4gICAgICAuZGVmaW5lKCdHcmFtbWFyJywgdGhpcy5zZXEodGhpcy5hcHAoJ2lkZW50JyksIHRoaXMub3B0KHRoaXMuYXBwKCdTdXBlckdyYW1tYXInKSksIHRoaXMucHJpbSgneycpLCB0aGlzLm1hbnkodGhpcy5hcHAoJ1J1bGUnKSwgMCksIHRoaXMucHJpbSgnfScpKSlcbiAgICAgIC5kZWZpbmUoJ1N1cGVyR3JhbW1hcl9xdWFsaWZpZWQnLCB0aGlzLnNlcSh0aGlzLnByaW0oJzw6JyksIHRoaXMuYXBwKCdpZGVudCcpLCB0aGlzLnByaW0oJy4nKSwgdGhpcy5hcHAoJ2lkZW50JykpKVxuICAgICAgLmRlZmluZSgnU3VwZXJHcmFtbWFyX3VucXVhbGlmaWVkJywgdGhpcy5zZXEodGhpcy5wcmltKCc8OicpLCB0aGlzLmFwcCgnaWRlbnQnKSkpXG4gICAgICAuZGVmaW5lKCdTdXBlckdyYW1tYXInLCB0aGlzLmFsdCh0aGlzLmFwcCgnU3VwZXJHcmFtbWFyX3F1YWxpZmllZCcpLCB0aGlzLmFwcCgnU3VwZXJHcmFtbWFyX3VucXVhbGlmaWVkJykpKVxuICAgICAgLmRlZmluZSgnUnVsZV9kZWZpbmUnLCB0aGlzLnNlcSh0aGlzLmFwcCgnaWRlbnQnKSwgdGhpcy5vcHQodGhpcy5hcHAoJ3J1bGVEZXNjcicpKSwgdGhpcy5wcmltKCc9JyksIHRoaXMuYXBwKCdBbHQnKSkpXG4gICAgICAuZGVmaW5lKCdSdWxlX292ZXJyaWRlJywgdGhpcy5zZXEodGhpcy5hcHAoJ2lkZW50JyksIHRoaXMucHJpbSgnOj0nKSwgdGhpcy5hcHAoJ0FsdCcpKSlcbiAgICAgIC5kZWZpbmUoJ1J1bGVfZXh0ZW5kJywgdGhpcy5zZXEodGhpcy5hcHAoJ2lkZW50JyksIHRoaXMucHJpbSgnKz0nKSwgdGhpcy5hcHAoJ0FsdCcpKSlcbiAgICAgIC5kZWZpbmUoJ1J1bGUnLCB0aGlzLmFsdCh0aGlzLmFwcCgnUnVsZV9kZWZpbmUnKSwgdGhpcy5hcHAoJ1J1bGVfb3ZlcnJpZGUnKSwgdGhpcy5hcHAoJ1J1bGVfZXh0ZW5kJykpKVxuICAgICAgLmRlZmluZSgnQWx0X3JlYycsIHRoaXMuc2VxKHRoaXMuYXBwKCdUZXJtJyksIHRoaXMucHJpbSgnfCcpLCB0aGlzLmFwcCgnQWx0JykpKVxuICAgICAgLmRlZmluZSgnQWx0JywgdGhpcy5hbHQodGhpcy5hcHAoJ0FsdF9yZWMnKSwgdGhpcy5hcHAoJ1Rlcm0nKSkpXG4gICAgICAuZGVmaW5lKCdUZXJtX2lubGluZScsIHRoaXMuc2VxKHRoaXMuYXBwKCdTZXEnKSwgdGhpcy5hcHAoJ2Nhc2VOYW1lJykpKVxuICAgICAgLmRlZmluZSgnVGVybScsIHRoaXMuYWx0KHRoaXMuYXBwKCdUZXJtX2lubGluZScpLCB0aGlzLmFwcCgnU2VxJykpKVxuICAgICAgLmRlZmluZSgnU2VxJywgdGhpcy5tYW55KHRoaXMuYXBwKCdJdGVyJyksIDApKVxuICAgICAgLmRlZmluZSgnSXRlcl9zdGFyJywgdGhpcy5zZXEodGhpcy5hcHAoJ1ByZWQnKSwgdGhpcy5wcmltKCcqJykpKVxuICAgICAgLmRlZmluZSgnSXRlcl9wbHVzJywgdGhpcy5zZXEodGhpcy5hcHAoJ1ByZWQnKSwgdGhpcy5wcmltKCcrJykpKVxuICAgICAgLmRlZmluZSgnSXRlcl9vcHQnLCB0aGlzLnNlcSh0aGlzLmFwcCgnUHJlZCcpLCB0aGlzLnByaW0oJz8nKSkpXG4gICAgICAuZGVmaW5lKCdJdGVyJywgdGhpcy5hbHQodGhpcy5hcHAoJ0l0ZXJfc3RhcicpLCB0aGlzLmFwcCgnSXRlcl9wbHVzJyksIHRoaXMuYXBwKCdJdGVyX29wdCcpLCB0aGlzLmFwcCgnUHJlZCcpKSlcbiAgICAgIC5kZWZpbmUoJ1ByZWRfbm90JywgdGhpcy5zZXEodGhpcy5wcmltKCd+JyksIHRoaXMuYXBwKCdCYXNlJykpKVxuICAgICAgLmRlZmluZSgnUHJlZF9sb29rYWhlYWQnLCB0aGlzLnNlcSh0aGlzLnByaW0oJyYnKSwgdGhpcy5hcHAoJ0Jhc2UnKSkpXG4gICAgICAuZGVmaW5lKCdQcmVkJywgdGhpcy5hbHQodGhpcy5hcHAoJ1ByZWRfbm90JyksIHRoaXMuYXBwKCdQcmVkX2xvb2thaGVhZCcpLCB0aGlzLmFwcCgnQmFzZScpKSlcbiAgICAgIC5kZWZpbmUoJ0Jhc2VfYXBwbGljYXRpb24nLCB0aGlzLnNlcSh0aGlzLmFwcCgnaWRlbnQnKSwgdGhpcy5ub3QodGhpcy5hbHQodGhpcy5zZXEodGhpcy5vcHQodGhpcy5hcHAoJ3J1bGVEZXNjcicpKSwgdGhpcy5wcmltKCc9JykpLCB0aGlzLnByaW0oJzo9JyksIHRoaXMucHJpbSgnKz0nKSkpKSlcbiAgICAgIC5kZWZpbmUoJ0Jhc2VfcHJpbScsIHRoaXMuYWx0KHRoaXMuYXBwKCdrZXl3b3JkJyksIHRoaXMuYXBwKCdzdHJpbmcnKSwgdGhpcy5hcHAoJ3JlZ0V4cCcpLCB0aGlzLmFwcCgnbnVtYmVyJykpKVxuICAgICAgLmRlZmluZSgnQmFzZV9wYXJlbicsIHRoaXMuc2VxKHRoaXMucHJpbSgnKCcpLCB0aGlzLmFwcCgnQWx0JyksIHRoaXMucHJpbSgnKScpKSlcbiAgICAgIC5kZWZpbmUoJ0Jhc2VfYXJyJywgdGhpcy5zZXEodGhpcy5wcmltKCdbJyksIHRoaXMuYXBwKCdBbHQnKSwgdGhpcy5wcmltKCddJykpKVxuICAgICAgLmRlZmluZSgnQmFzZV9vYmonLCB0aGlzLnNlcSh0aGlzLnByaW0oJ3snKSwgdGhpcy5vcHQodGhpcy5wcmltKCcuLi4nKSksIHRoaXMucHJpbSgnfScpKSlcbiAgICAgIC5kZWZpbmUoJ0Jhc2Vfb2JqV2l0aFByb3BzJywgdGhpcy5zZXEodGhpcy5wcmltKCd7JyksIHRoaXMuYXBwKCdQcm9wcycpLCB0aGlzLm9wdCh0aGlzLnNlcSh0aGlzLnByaW0oJywnKSwgdGhpcy5wcmltKCcuLi4nKSkpLCB0aGlzLnByaW0oJ30nKSkpXG4gICAgICAuZGVmaW5lKCdCYXNlJywgdGhpcy5hbHQodGhpcy5hcHAoJ0Jhc2VfYXBwbGljYXRpb24nKSwgdGhpcy5hcHAoJ0Jhc2VfcHJpbScpLCB0aGlzLmFwcCgnQmFzZV9wYXJlbicpLCB0aGlzLmFwcCgnQmFzZV9hcnInKSwgdGhpcy5hcHAoJ0Jhc2Vfb2JqJyksIHRoaXMuYXBwKCdCYXNlX29ialdpdGhQcm9wcycpKSlcbiAgICAgIC5kZWZpbmUoJ1Byb3BzX3JlYycsIHRoaXMuc2VxKHRoaXMuYXBwKCdQcm9wJyksIHRoaXMucHJpbSgnLCcpLCB0aGlzLmFwcCgnUHJvcHMnKSkpXG4gICAgICAuZGVmaW5lKCdQcm9wc19iYXNlJywgdGhpcy5hcHAoJ1Byb3AnKSlcbiAgICAgIC5kZWZpbmUoJ1Byb3BzJywgdGhpcy5hbHQodGhpcy5hcHAoJ1Byb3BzX3JlYycpLCB0aGlzLmFwcCgnUHJvcHNfYmFzZScpKSlcbiAgICAgIC5kZWZpbmUoJ1Byb3AnLCB0aGlzLnNlcSh0aGlzLmFsdCh0aGlzLmFwcCgnbmFtZScpLCB0aGlzLmFwcCgnc3RyaW5nJykpLCB0aGlzLnByaW0oJzonKSwgdGhpcy5hcHAoJ0FsdCcpKSlcbiAgICAgIC5kZWZpbmUoJ3J1bGVEZXNjcicsIHRoaXMuc2VxKHRoaXMucHJpbSgnLS0nKSwgdGhpcy5hcHAoJ3J1bGVEZXNjclRleHQnKSwgdGhpcy5wcmltKCdcXG4nKSkpXG4gICAgICAuZGVmaW5lKCdydWxlRGVzY3JUZXh0JywgdGhpcy5tYW55KHRoaXMuc2VxKHRoaXMubm90KHRoaXMucHJpbSgnXFxuJykpLCB0aGlzLmFwcCgnXycpKSwgMCkpXG4gICAgICAuZGVmaW5lKCdjYXNlTmFtZScsIHRoaXMuc2VxKHRoaXMucHJpbSgnLS0nKSwgdGhpcy5tYW55KHRoaXMuc2VxKHRoaXMubm90KHRoaXMucHJpbSgnXFxuJykpLCB0aGlzLmFwcCgnc3BhY2UnKSksIDApLCB0aGlzLmFwcCgnbmFtZScpLCB0aGlzLm1hbnkodGhpcy5zZXEodGhpcy5ub3QodGhpcy5wcmltKCdcXG4nKSksIHRoaXMuYXBwKCdzcGFjZScpKSwgMCksIHRoaXMuYWx0KHRoaXMucHJpbSgnXFxuJyksIHRoaXMubGEodGhpcy5wcmltKCd9JykpKSkpXG4gICAgICAuZGVmaW5lKCduYW1lJywgdGhpcy5zZXEodGhpcy5hcHAoJ25hbWVGaXJzdCcpLCB0aGlzLm1hbnkodGhpcy5hcHAoJ25hbWVSZXN0JyksIDApKSlcbiAgICAgIC5kZWZpbmUoJ25hbWVGaXJzdCcsIHRoaXMuYWx0KHRoaXMucHJpbSgnXycpLCB0aGlzLmFwcCgnbGV0dGVyJykpKVxuICAgICAgLmRlZmluZSgnbmFtZVJlc3QnLCB0aGlzLmFsdCh0aGlzLnByaW0oJ18nKSwgdGhpcy5hcHAoJ2FsbnVtJykpKVxuICAgICAgLmRlZmluZSgnaWRlbnQnLCB0aGlzLnNlcSh0aGlzLm5vdCh0aGlzLmFwcCgna2V5d29yZCcpKSwgdGhpcy5hcHAoJ25hbWUnKSkpXG4gICAgICAuZGVmaW5lKCdrZXl3b3JkX3VuZGVmaW5lZCcsIHRoaXMuc2VxKHRoaXMucHJpbSgndW5kZWZpbmVkJyksIHRoaXMubm90KHRoaXMuYXBwKCduYW1lUmVzdCcpKSkpXG4gICAgICAuZGVmaW5lKCdrZXl3b3JkX251bGwnLCB0aGlzLnNlcSh0aGlzLnByaW0oJ251bGwnKSwgdGhpcy5ub3QodGhpcy5hcHAoJ25hbWVSZXN0JykpKSlcbiAgICAgIC5kZWZpbmUoJ2tleXdvcmRfdHJ1ZScsIHRoaXMuc2VxKHRoaXMucHJpbSgndHJ1ZScpLCB0aGlzLm5vdCh0aGlzLmFwcCgnbmFtZVJlc3QnKSkpKVxuICAgICAgLmRlZmluZSgna2V5d29yZF9mYWxzZScsIHRoaXMuc2VxKHRoaXMucHJpbSgnZmFsc2UnKSwgdGhpcy5ub3QodGhpcy5hcHAoJ25hbWVSZXN0JykpKSlcbiAgICAgIC5kZWZpbmUoJ2tleXdvcmQnLCB0aGlzLmFsdCh0aGlzLmFwcCgna2V5d29yZF91bmRlZmluZWQnKSwgdGhpcy5hcHAoJ2tleXdvcmRfbnVsbCcpLCB0aGlzLmFwcCgna2V5d29yZF90cnVlJyksIHRoaXMuYXBwKCdrZXl3b3JkX2ZhbHNlJykpKVxuICAgICAgLmRlZmluZSgnc3RyaW5nJywgdGhpcy5hbHQodGhpcy5zZXEodGhpcy5wcmltKFwiJ1wiKSwgdGhpcy5tYW55KHRoaXMuYXBwKCdzaW5nbGVRdW90ZVN0ckNoYXInKSwgMCksIHRoaXMucHJpbShcIidcIikpLCB0aGlzLnNlcSh0aGlzLnByaW0oJ1wiJyksIHRoaXMubWFueSh0aGlzLmFwcCgnZG91YmxlUXVvdGVTdHJDaGFyJyksIDApLCB0aGlzLnByaW0oJ1wiJykpKSlcbiAgICAgIC5kZWZpbmUoJ3NpbmdsZVF1b3RlU3RyQ2hhcicsIHRoaXMuYWx0KHRoaXMuYXBwKCdlc2NhcGVDaGFyJyksIHRoaXMuc2VxKHRoaXMubm90KHRoaXMucHJpbShcIidcIikpLCB0aGlzLm5vdCh0aGlzLnByaW0oJ1xcbicpKSwgdGhpcy5hcHAoJ18nKSkpKVxuICAgICAgLmRlZmluZSgnZG91YmxlUXVvdGVTdHJDaGFyJywgdGhpcy5hbHQodGhpcy5hcHAoJ2VzY2FwZUNoYXInKSwgdGhpcy5zZXEodGhpcy5ub3QodGhpcy5wcmltKCdcIicpKSwgdGhpcy5ub3QodGhpcy5wcmltKCdcXG4nKSksIHRoaXMuYXBwKCdfJykpKSlcbiAgICAgIC5kZWZpbmUoJ2VzY2FwZUNoYXJfaGV4RXNjYXBlJywgdGhpcy5zZXEodGhpcy5wcmltKCdcXFxceCcpLCB0aGlzLmFwcCgnaGV4RGlnaXQnKSwgdGhpcy5hcHAoJ2hleERpZ2l0JykpKVxuICAgICAgLmRlZmluZSgnZXNjYXBlQ2hhcl91bmljb2RlRXNjYXBlJywgdGhpcy5zZXEodGhpcy5wcmltKCdcXFxcdScpLCB0aGlzLmFwcCgnaGV4RGlnaXQnKSwgdGhpcy5hcHAoJ2hleERpZ2l0JyksIHRoaXMuYXBwKCdoZXhEaWdpdCcpLCB0aGlzLmFwcCgnaGV4RGlnaXQnKSkpXG4gICAgICAuZGVmaW5lKCdlc2NhcGVDaGFyX2VzY2FwZScsIHRoaXMuc2VxKHRoaXMucHJpbSgnXFxcXCcpLCB0aGlzLmFwcCgnXycpKSlcbiAgICAgIC5kZWZpbmUoJ2VzY2FwZUNoYXInLCB0aGlzLmFsdCh0aGlzLmFwcCgnZXNjYXBlQ2hhcl9oZXhFc2NhcGUnKSwgdGhpcy5hcHAoJ2VzY2FwZUNoYXJfdW5pY29kZUVzY2FwZScpLCB0aGlzLmFwcCgnZXNjYXBlQ2hhcl9lc2NhcGUnKSkpXG4gICAgICAuZGVmaW5lKCdyZWdFeHAnLCB0aGlzLnNlcSh0aGlzLnByaW0oJy8nKSwgdGhpcy5hcHAoJ3JlQ2hhckNsYXNzJyksIHRoaXMucHJpbSgnLycpKSlcbiAgICAgIC5kZWZpbmUoJ3JlQ2hhckNsYXNzX3VuaWNvZGUnLCB0aGlzLnNlcSh0aGlzLnByaW0oJ1xcXFxweycpLCB0aGlzLm1hbnkodGhpcy5wcmltKC9bQS1aYS16XS8pLCAxKSwgdGhpcy5wcmltKCd9JykpKVxuICAgICAgLmRlZmluZSgncmVDaGFyQ2xhc3Nfb3JkaW5hcnknLCB0aGlzLnNlcSh0aGlzLnByaW0oJ1snKSwgdGhpcy5tYW55KHRoaXMuYWx0KHRoaXMucHJpbSgnXFxcXF0nKSwgdGhpcy5zZXEodGhpcy5ub3QodGhpcy5wcmltKCddJykpLCB0aGlzLmFwcCgnXycpKSksIDApLCB0aGlzLnByaW0oJ10nKSkpXG4gICAgICAuZGVmaW5lKCdyZUNoYXJDbGFzcycsIHRoaXMuYWx0KHRoaXMuYXBwKCdyZUNoYXJDbGFzc191bmljb2RlJyksIHRoaXMuYXBwKCdyZUNoYXJDbGFzc19vcmRpbmFyeScpKSlcbiAgICAgIC5kZWZpbmUoJ251bWJlcicsIHRoaXMuc2VxKHRoaXMub3B0KHRoaXMucHJpbSgnLScpKSwgdGhpcy5tYW55KHRoaXMuYXBwKCdkaWdpdCcpLCAxKSkpXG4gICAgICAuZGVmaW5lKCdzcGFjZV9zaW5nbGVMaW5lJywgdGhpcy5zZXEodGhpcy5wcmltKCcvLycpLCB0aGlzLm1hbnkodGhpcy5zZXEodGhpcy5ub3QodGhpcy5wcmltKCdcXG4nKSksIHRoaXMuYXBwKCdfJykpLCAwKSwgdGhpcy5wcmltKCdcXG4nKSkpXG4gICAgICAuZGVmaW5lKCdzcGFjZV9tdWx0aUxpbmUnLCB0aGlzLnNlcSh0aGlzLnByaW0oJy8qJyksIHRoaXMubWFueSh0aGlzLnNlcSh0aGlzLm5vdCh0aGlzLnByaW0oJyovJykpLCB0aGlzLmFwcCgnXycpKSwgMCksIHRoaXMucHJpbSgnKi8nKSkpXG4gICAgICAuZXh0ZW5kKCdzcGFjZScsIHRoaXMuYWx0KHRoaXMuYWx0KHRoaXMuYXBwKCdzcGFjZV9zaW5nbGVMaW5lJyksIHRoaXMuYXBwKCdzcGFjZV9tdWx0aUxpbmUnKSksIHRoaXMucHJpbSgvW1xcc10vKSkpXG4gICAgICAuaW5zdGFsbCgpO1xufSk7XG4iLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5fdXNlVHlwZWRBcnJheXNgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAoY29tcGF0aWJsZSBkb3duIHRvIElFNilcbiAqL1xuQnVmZmVyLl91c2VUeXBlZEFycmF5cyA9IChmdW5jdGlvbiAoKSB7XG4gIC8vIERldGVjdCBpZiBicm93c2VyIHN1cHBvcnRzIFR5cGVkIEFycmF5cy4gU3VwcG9ydGVkIGJyb3dzZXJzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssXG4gIC8vIENocm9tZSA3KywgU2FmYXJpIDUuMSssIE9wZXJhIDExLjYrLCBpT1MgNC4yKy4gSWYgdGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBhZGRpbmdcbiAgLy8gcHJvcGVydGllcyB0byBgVWludDhBcnJheWAgaW5zdGFuY2VzLCB0aGVuIHRoYXQncyB0aGUgc2FtZSBhcyBubyBgVWludDhBcnJheWAgc3VwcG9ydFxuICAvLyBiZWNhdXNlIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBhZGQgYWxsIHRoZSBub2RlIEJ1ZmZlciBBUEkgbWV0aG9kcy4gVGhpcyBpcyBhbiBpc3N1ZVxuICAvLyBpbiBGaXJlZm94IDQtMjkuIE5vdyBmaXhlZDogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4XG4gIHRyeSB7XG4gICAgdmFyIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcigwKVxuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheShidWYpXG4gICAgYXJyLmZvbyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH1cbiAgICByZXR1cm4gNDIgPT09IGFyci5mb28oKSAmJlxuICAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nIC8vIENocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn0pKClcblxuLyoqXG4gKiBDbGFzczogQnVmZmVyXG4gKiA9PT09PT09PT09PT09XG4gKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBhcmUgYXVnbWVudGVkXG4gKiB3aXRoIGZ1bmN0aW9uIHByb3BlcnRpZXMgZm9yIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBBUEkgZnVuY3Rpb25zLiBXZSB1c2VcbiAqIGBVaW50OEFycmF5YCBzbyB0aGF0IHNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0IHJldHVybnNcbiAqIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIEJ5IGF1Z21lbnRpbmcgdGhlIGluc3RhbmNlcywgd2UgY2FuIGF2b2lkIG1vZGlmeWluZyB0aGUgYFVpbnQ4QXJyYXlgXG4gKiBwcm90b3R5cGUuXG4gKi9cbmZ1bmN0aW9uIEJ1ZmZlciAoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSlcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKVxuXG4gIHZhciB0eXBlID0gdHlwZW9mIHN1YmplY3RcblxuICAvLyBXb3JrYXJvdW5kOiBub2RlJ3MgYmFzZTY0IGltcGxlbWVudGF0aW9uIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBzdHJpbmdzXG4gIC8vIHdoaWxlIGJhc2U2NC1qcyBkb2VzIG5vdC5cbiAgaWYgKGVuY29kaW5nID09PSAnYmFzZTY0JyAmJiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHN1YmplY3QgPSBzdHJpbmd0cmltKHN1YmplY3QpXG4gICAgd2hpbGUgKHN1YmplY3QubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgICAgc3ViamVjdCA9IHN1YmplY3QgKyAnPSdcbiAgICB9XG4gIH1cblxuICAvLyBGaW5kIHRoZSBsZW5ndGhcbiAgdmFyIGxlbmd0aFxuICBpZiAodHlwZSA9PT0gJ251bWJlcicpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKVxuICAgIGxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHN1YmplY3QsIGVuY29kaW5nKVxuICBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0JylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdC5sZW5ndGgpIC8vIGFzc3VtZSB0aGF0IG9iamVjdCBpcyBhcnJheS1saWtlXG4gIGVsc2VcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG5lZWRzIHRvIGJlIGEgbnVtYmVyLCBhcnJheSBvciBzdHJpbmcuJylcblxuICB2YXIgYnVmXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgLy8gUHJlZmVycmVkOiBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIGJ1ZiA9IEJ1ZmZlci5fYXVnbWVudChuZXcgVWludDhBcnJheShsZW5ndGgpKVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gVEhJUyBpbnN0YW5jZSBvZiBCdWZmZXIgKGNyZWF0ZWQgYnkgYG5ld2ApXG4gICAgYnVmID0gdGhpc1xuICAgIGJ1Zi5sZW5ndGggPSBsZW5ndGhcbiAgICBidWYuX2lzQnVmZmVyID0gdHJ1ZVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgdHlwZW9mIHN1YmplY3QuYnl0ZUxlbmd0aCA9PT0gJ251bWJlcicpIHtcbiAgICAvLyBTcGVlZCBvcHRpbWl6YXRpb24gLS0gdXNlIHNldCBpZiB3ZSdyZSBjb3B5aW5nIGZyb20gYSB0eXBlZCBhcnJheVxuICAgIGJ1Zi5fc2V0KHN1YmplY3QpXG4gIH0gZWxzZSBpZiAoaXNBcnJheWlzaChzdWJqZWN0KSkge1xuICAgIC8vIFRyZWF0IGFycmF5LWlzaCBvYmplY3RzIGFzIGEgYnl0ZSBhcnJheVxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSlcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdC5yZWFkVUludDgoaSlcbiAgICAgIGVsc2VcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdFtpXVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIGJ1Zi53cml0ZShzdWJqZWN0LCAwLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiAhQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiAhbm9aZXJvKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBidWZbaV0gPSAwXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBTVEFUSUMgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIChiKSB7XG4gIHJldHVybiAhIShiICE9PSBudWxsICYmIGIgIT09IHVuZGVmaW5lZCAmJiBiLl9pc0J1ZmZlcilcbn1cblxuQnVmZmVyLmJ5dGVMZW5ndGggPSBmdW5jdGlvbiAoc3RyLCBlbmNvZGluZykge1xuICB2YXIgcmV0XG4gIHN0ciA9IHN0ciArICcnXG4gIHN3aXRjaCAoZW5jb2RpbmcgfHwgJ3V0ZjgnKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggLyAyXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IHV0ZjhUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBiYXNlNjRUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoICogMlxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiAobGlzdCwgdG90YWxMZW5ndGgpIHtcbiAgYXNzZXJ0KGlzQXJyYXkobGlzdCksICdVc2FnZTogQnVmZmVyLmNvbmNhdChsaXN0LCBbdG90YWxMZW5ndGhdKVxcbicgK1xuICAgICAgJ2xpc3Qgc2hvdWxkIGJlIGFuIEFycmF5LicpXG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoMClcbiAgfSBlbHNlIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBsaXN0WzBdXG4gIH1cblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHRvdGFsTGVuZ3RoICE9PSAnbnVtYmVyJykge1xuICAgIHRvdGFsTGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB0b3RhbExlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKHRvdGFsTGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXVxuICAgIGl0ZW0uY29weShidWYsIHBvcylcbiAgICBwb3MgKz0gaXRlbS5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cbi8vIEJVRkZFUiBJTlNUQU5DRSBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBfaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBhc3NlcnQoc3RyTGVuICUgMiA9PT0gMCwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBieXRlID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGFzc2VydCghaXNOYU4oYnl0ZSksICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IGJ5dGVcbiAgfVxuICBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9IGkgKiAyXG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIF91dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYmluYXJ5V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gX2FzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIFN1cHBvcnQgYm90aCAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpXG4gIC8vIGFuZCB0aGUgbGVnYWN5IChzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBpZiAoIWlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIH0gZWxzZSB7ICAvLyBsZWdhY3lcbiAgICB2YXIgc3dhcCA9IGVuY29kaW5nXG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBvZmZzZXQgPSBsZW5ndGhcbiAgICBsZW5ndGggPSBzd2FwXG4gIH1cblxuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuICBzdGFydCA9IE51bWJlcihzdGFydCkgfHwgMFxuICBlbmQgPSAoZW5kICE9PSB1bmRlZmluZWQpXG4gICAgPyBOdW1iZXIoZW5kKVxuICAgIDogZW5kID0gc2VsZi5sZW5ndGhcblxuICAvLyBGYXN0cGF0aCBlbXB0eSBzdHJpbmdzXG4gIGlmIChlbmQgPT09IHN0YXJ0KVxuICAgIHJldHVybiAnJ1xuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAodGFyZ2V0LCB0YXJnZXRfc3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNvdXJjZSA9IHRoaXNcblxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAoIXRhcmdldF9zdGFydCkgdGFyZ2V0X3N0YXJ0ID0gMFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHNvdXJjZS5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ3NvdXJjZUVuZCA8IHNvdXJjZVN0YXJ0JylcbiAgYXNzZXJ0KHRhcmdldF9zdGFydCA+PSAwICYmIHRhcmdldF9zdGFydCA8IHRhcmdldC5sZW5ndGgsXG4gICAgICAndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgc291cmNlLmxlbmd0aCwgJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKVxuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0IDwgZW5kIC0gc3RhcnQpXG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCArIHN0YXJ0XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG5cbiAgaWYgKGxlbiA8IDEwMCB8fCAhQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICB0YXJnZXRbaSArIHRhcmdldF9zdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQuX3NldCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksIHRhcmdldF9zdGFydClcbiAgfVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIF91dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmVzID0gJydcbiAgdmFyIHRtcCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIGlmIChidWZbaV0gPD0gMHg3Rikge1xuICAgICAgcmVzICs9IGRlY29kZVV0ZjhDaGFyKHRtcCkgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgICAgIHRtcCA9ICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRtcCArPSAnJScgKyBidWZbaV0udG9TdHJpbmcoMTYpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcyArIGRlY29kZVV0ZjhDaGFyKHRtcClcbn1cblxuZnVuY3Rpb24gX2FzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKVxuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBfYmluYXJ5U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICByZXR1cm4gX2FzY2lpU2xpY2UoYnVmLCBzdGFydCwgZW5kKVxufVxuXG5mdW5jdGlvbiBfaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpKzFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IGNsYW1wKHN0YXJ0LCBsZW4sIDApXG4gIGVuZCA9IGNsYW1wKGVuZCwgbGVuLCBsZW4pXG5cbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICByZXR1cm4gQnVmZmVyLl9hdWdtZW50KHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCkpXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICB2YXIgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkLCB0cnVlKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47IGkrKykge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICAgIHJldHVybiBuZXdCdWZcbiAgfVxufVxuXG4vLyBgZ2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuZ2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy5yZWFkVUludDgob2Zmc2V0KVxufVxuXG4vLyBgc2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAodiwgb2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuc2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy53cml0ZVVJbnQ4KHYsIG9mZnNldClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gIH0gZWxzZSB7XG4gICAgdmFsID0gYnVmW29mZnNldF0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMl0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICAgIHZhbCB8PSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXQgKyAzXSA8PCAyNCA+Pj4gMClcbiAgfSBlbHNlIHtcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAxXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAyXSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDNdXG4gICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXRdIDw8IDI0ID4+PiAwKVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHZhciBuZWcgPSB0aGlzW29mZnNldF0gJiAweDgwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDE2KGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQzMihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwMDAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRGbG9hdCAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZERvdWJsZSAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmYpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKSByZXR1cm5cblxuICB0aGlzW29mZnNldF0gPSB2YWx1ZVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDIpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgICAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCA0KTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSA+Pj4gKGxpdHRsZUVuZGlhbiA/IGkgOiAzIC0gaSkgKiA4KSAmIDB4ZmZcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZiwgLTB4ODApXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIHRoaXMud3JpdGVVSW50OCh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydClcbiAgZWxzZVxuICAgIHRoaXMud3JpdGVVSW50OCgweGZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmYsIC0weDgwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MTYoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgMHhmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQzMihidWYsIDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGZpbGwodmFsdWUsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gKHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIGlmICghdmFsdWUpIHZhbHVlID0gMFxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQpIGVuZCA9IHRoaXMubGVuZ3RoXG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLmNoYXJDb2RlQXQoMClcbiAgfVxuXG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSksICd2YWx1ZSBpcyBub3QgYSBudW1iZXInKVxuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnZW5kIDwgc3RhcnQnKVxuXG4gIC8vIEZpbGwgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCB0aGlzLmxlbmd0aCwgJ3N0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHRoaXMubGVuZ3RoLCAnZW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgdGhpc1tpXSA9IHZhbHVlXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgb3V0ID0gW11cbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBvdXRbaV0gPSB0b0hleCh0aGlzW2ldKVxuICAgIGlmIChpID09PSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTKSB7XG4gICAgICBvdXRbaSArIDFdID0gJy4uLidcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgb3V0LmpvaW4oJyAnKSArICc+J1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgYEFycmF5QnVmZmVyYCB3aXRoIHRoZSAqY29waWVkKiBtZW1vcnkgb2YgdGhlIGJ1ZmZlciBpbnN0YW5jZS5cbiAqIEFkZGVkIGluIE5vZGUgMC4xMi4gT25seSBhdmFpbGFibGUgaW4gYnJvd3NlcnMgdGhhdCBzdXBwb3J0IEFycmF5QnVmZmVyLlxuICovXG5CdWZmZXIucHJvdG90eXBlLnRvQXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgICAgcmV0dXJuIChuZXcgQnVmZmVyKHRoaXMpKS5idWZmZXJcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KHRoaXMubGVuZ3RoKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGJ1Zi5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSlcbiAgICAgICAgYnVmW2ldID0gdGhpc1tpXVxuICAgICAgcmV0dXJuIGJ1Zi5idWZmZXJcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdCdWZmZXIudG9BcnJheUJ1ZmZlciBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlcicpXG4gIH1cbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBzdHJpbmd0cmltIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKVxuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxufVxuXG52YXIgQlAgPSBCdWZmZXIucHJvdG90eXBlXG5cbi8qKlxuICogQXVnbWVudCBhIFVpbnQ4QXJyYXkgKmluc3RhbmNlKiAobm90IHRoZSBVaW50OEFycmF5IGNsYXNzISkgd2l0aCBCdWZmZXIgbWV0aG9kc1xuICovXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5faXNCdWZmZXIgPSB0cnVlXG5cbiAgLy8gc2F2ZSByZWZlcmVuY2UgdG8gb3JpZ2luYWwgVWludDhBcnJheSBnZXQvc2V0IG1ldGhvZHMgYmVmb3JlIG92ZXJ3cml0aW5nXG4gIGFyci5fZ2V0ID0gYXJyLmdldFxuICBhcnIuX3NldCA9IGFyci5zZXRcblxuICAvLyBkZXByZWNhdGVkLCB3aWxsIGJlIHJlbW92ZWQgaW4gbm9kZSAwLjEzK1xuICBhcnIuZ2V0ID0gQlAuZ2V0XG4gIGFyci5zZXQgPSBCUC5zZXRcblxuICBhcnIud3JpdGUgPSBCUC53cml0ZVxuICBhcnIudG9TdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9Mb2NhbGVTdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9KU09OID0gQlAudG9KU09OXG4gIGFyci5jb3B5ID0gQlAuY29weVxuICBhcnIuc2xpY2UgPSBCUC5zbGljZVxuICBhcnIucmVhZFVJbnQ4ID0gQlAucmVhZFVJbnQ4XG4gIGFyci5yZWFkVUludDE2TEUgPSBCUC5yZWFkVUludDE2TEVcbiAgYXJyLnJlYWRVSW50MTZCRSA9IEJQLnJlYWRVSW50MTZCRVxuICBhcnIucmVhZFVJbnQzMkxFID0gQlAucmVhZFVJbnQzMkxFXG4gIGFyci5yZWFkVUludDMyQkUgPSBCUC5yZWFkVUludDMyQkVcbiAgYXJyLnJlYWRJbnQ4ID0gQlAucmVhZEludDhcbiAgYXJyLnJlYWRJbnQxNkxFID0gQlAucmVhZEludDE2TEVcbiAgYXJyLnJlYWRJbnQxNkJFID0gQlAucmVhZEludDE2QkVcbiAgYXJyLnJlYWRJbnQzMkxFID0gQlAucmVhZEludDMyTEVcbiAgYXJyLnJlYWRJbnQzMkJFID0gQlAucmVhZEludDMyQkVcbiAgYXJyLnJlYWRGbG9hdExFID0gQlAucmVhZEZsb2F0TEVcbiAgYXJyLnJlYWRGbG9hdEJFID0gQlAucmVhZEZsb2F0QkVcbiAgYXJyLnJlYWREb3VibGVMRSA9IEJQLnJlYWREb3VibGVMRVxuICBhcnIucmVhZERvdWJsZUJFID0gQlAucmVhZERvdWJsZUJFXG4gIGFyci53cml0ZVVJbnQ4ID0gQlAud3JpdGVVSW50OFxuICBhcnIud3JpdGVVSW50MTZMRSA9IEJQLndyaXRlVUludDE2TEVcbiAgYXJyLndyaXRlVUludDE2QkUgPSBCUC53cml0ZVVJbnQxNkJFXG4gIGFyci53cml0ZVVJbnQzMkxFID0gQlAud3JpdGVVSW50MzJMRVxuICBhcnIud3JpdGVVSW50MzJCRSA9IEJQLndyaXRlVUludDMyQkVcbiAgYXJyLndyaXRlSW50OCA9IEJQLndyaXRlSW50OFxuICBhcnIud3JpdGVJbnQxNkxFID0gQlAud3JpdGVJbnQxNkxFXG4gIGFyci53cml0ZUludDE2QkUgPSBCUC53cml0ZUludDE2QkVcbiAgYXJyLndyaXRlSW50MzJMRSA9IEJQLndyaXRlSW50MzJMRVxuICBhcnIud3JpdGVJbnQzMkJFID0gQlAud3JpdGVJbnQzMkJFXG4gIGFyci53cml0ZUZsb2F0TEUgPSBCUC53cml0ZUZsb2F0TEVcbiAgYXJyLndyaXRlRmxvYXRCRSA9IEJQLndyaXRlRmxvYXRCRVxuICBhcnIud3JpdGVEb3VibGVMRSA9IEJQLndyaXRlRG91YmxlTEVcbiAgYXJyLndyaXRlRG91YmxlQkUgPSBCUC53cml0ZURvdWJsZUJFXG4gIGFyci5maWxsID0gQlAuZmlsbFxuICBhcnIuaW5zcGVjdCA9IEJQLmluc3BlY3RcbiAgYXJyLnRvQXJyYXlCdWZmZXIgPSBCUC50b0FycmF5QnVmZmVyXG5cbiAgcmV0dXJuIGFyclxufVxuXG4vLyBzbGljZShzdGFydCwgZW5kKVxuZnVuY3Rpb24gY2xhbXAgKGluZGV4LCBsZW4sIGRlZmF1bHRWYWx1ZSkge1xuICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykgcmV0dXJuIGRlZmF1bHRWYWx1ZVxuICBpbmRleCA9IH5+aW5kZXg7ICAvLyBDb2VyY2UgdG8gaW50ZWdlci5cbiAgaWYgKGluZGV4ID49IGxlbikgcmV0dXJuIGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIGluZGV4ICs9IGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGNvZXJjZSAobGVuZ3RoKSB7XG4gIC8vIENvZXJjZSBsZW5ndGggdG8gYSBudW1iZXIgKHBvc3NpYmx5IE5hTiksIHJvdW5kIHVwXG4gIC8vIGluIGNhc2UgaXQncyBmcmFjdGlvbmFsIChlLmcuIDEyMy40NTYpIHRoZW4gZG8gYVxuICAvLyBkb3VibGUgbmVnYXRlIHRvIGNvZXJjZSBhIE5hTiB0byAwLiBFYXN5LCByaWdodD9cbiAgbGVuZ3RoID0gfn5NYXRoLmNlaWwoK2xlbmd0aClcbiAgcmV0dXJuIGxlbmd0aCA8IDAgPyAwIDogbGVuZ3RoXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkgKHN1YmplY3QpIHtcbiAgcmV0dXJuIChBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChzdWJqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzdWJqZWN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xuICB9KShzdWJqZWN0KVxufVxuXG5mdW5jdGlvbiBpc0FycmF5aXNoIChzdWJqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5KHN1YmplY3QpIHx8IEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSB8fFxuICAgICAgc3ViamVjdCAmJiB0eXBlb2Ygc3ViamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgIHR5cGVvZiBzdWJqZWN0Lmxlbmd0aCA9PT0gJ251bWJlcidcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIHZhciBiID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBpZiAoYiA8PSAweDdGKVxuICAgICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpXG4gICAgZWxzZSB7XG4gICAgICB2YXIgc3RhcnQgPSBpXG4gICAgICBpZiAoYiA+PSAweEQ4MDAgJiYgYiA8PSAweERGRkYpIGkrK1xuICAgICAgdmFyIGggPSBlbmNvZGVVUklDb21wb25lbnQoc3RyLnNsaWNlKHN0YXJ0LCBpKzEpKS5zdWJzdHIoMSkuc3BsaXQoJyUnKVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBoLmxlbmd0aDsgaisrKVxuICAgICAgICBieXRlQXJyYXkucHVzaChwYXJzZUludChoW2pdLCAxNikpXG4gICAgfVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KHN0cilcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBwb3NcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSlcbiAgICAgIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gZGVjb2RlVXRmOENoYXIgKHN0cikge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgweEZGRkQpIC8vIFVURiA4IGludmFsaWQgY2hhclxuICB9XG59XG5cbi8qXG4gKiBXZSBoYXZlIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSB2YWx1ZSBpcyBhIHZhbGlkIGludGVnZXIuIFRoaXMgbWVhbnMgdGhhdCBpdFxuICogaXMgbm9uLW5lZ2F0aXZlLiBJdCBoYXMgbm8gZnJhY3Rpb25hbCBjb21wb25lbnQgYW5kIHRoYXQgaXQgZG9lcyBub3RcbiAqIGV4Y2VlZCB0aGUgbWF4aW11bSBhbGxvd2VkIHZhbHVlLlxuICovXG5mdW5jdGlvbiB2ZXJpZnVpbnQgKHZhbHVlLCBtYXgpIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlID49IDAsICdzcGVjaWZpZWQgYSBuZWdhdGl2ZSB2YWx1ZSBmb3Igd3JpdGluZyBhbiB1bnNpZ25lZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBpcyBsYXJnZXIgdGhhbiBtYXhpbXVtIHZhbHVlIGZvciB0eXBlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZzaW50ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZJRUVFNzU0ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbn1cblxuZnVuY3Rpb24gYXNzZXJ0ICh0ZXN0LCBtZXNzYWdlKSB7XG4gIGlmICghdGVzdCkgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UgfHwgJ0ZhaWxlZCBhc3NlcnRpb24nKVxufVxuIiwidmFyIGxvb2t1cCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblxuOyhmdW5jdGlvbiAoZXhwb3J0cykge1xuXHQndXNlIHN0cmljdCc7XG5cbiAgdmFyIEFyciA9ICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgPyBVaW50OEFycmF5XG4gICAgOiBBcnJheVxuXG5cdHZhciBQTFVTICAgPSAnKycuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0ggID0gJy8nLmNoYXJDb2RlQXQoMClcblx0dmFyIE5VTUJFUiA9ICcwJy5jaGFyQ29kZUF0KDApXG5cdHZhciBMT1dFUiAgPSAnYScuY2hhckNvZGVBdCgwKVxuXHR2YXIgVVBQRVIgID0gJ0EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFBMVVNfVVJMX1NBRkUgPSAnLScuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0hfVVJMX1NBRkUgPSAnXycuY2hhckNvZGVBdCgwKVxuXG5cdGZ1bmN0aW9uIGRlY29kZSAoZWx0KSB7XG5cdFx0dmFyIGNvZGUgPSBlbHQuY2hhckNvZGVBdCgwKVxuXHRcdGlmIChjb2RlID09PSBQTFVTIHx8XG5cdFx0ICAgIGNvZGUgPT09IFBMVVNfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjIgLy8gJysnXG5cdFx0aWYgKGNvZGUgPT09IFNMQVNIIHx8XG5cdFx0ICAgIGNvZGUgPT09IFNMQVNIX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYzIC8vICcvJ1xuXHRcdGlmIChjb2RlIDwgTlVNQkVSKVxuXHRcdFx0cmV0dXJuIC0xIC8vbm8gbWF0Y2hcblx0XHRpZiAoY29kZSA8IE5VTUJFUiArIDEwKVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBOVU1CRVIgKyAyNiArIDI2XG5cdFx0aWYgKGNvZGUgPCBVUFBFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBVUFBFUlxuXHRcdGlmIChjb2RlIDwgTE9XRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gTE9XRVIgKyAyNlxuXHR9XG5cblx0ZnVuY3Rpb24gYjY0VG9CeXRlQXJyYXkgKGI2NCkge1xuXHRcdHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG5cblx0XHRpZiAoYjY0Lmxlbmd0aCAlIDQgPiAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHR2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXHRcdHBsYWNlSG9sZGVycyA9ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAyKSA/IDIgOiAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMSkgPyAxIDogMFxuXG5cdFx0Ly8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0YXJyID0gbmV3IEFycihiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cblx0XHQvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG5cdFx0bCA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gNCA6IGI2NC5sZW5ndGhcblxuXHRcdHZhciBMID0gMFxuXG5cdFx0ZnVuY3Rpb24gcHVzaCAodikge1xuXHRcdFx0YXJyW0wrK10gPSB2XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxOCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCAxMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA8PCA2KSB8IGRlY29kZShiNjQuY2hhckF0KGkgKyAzKSlcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMDAwKSA+PiAxNilcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPj4gNClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxMCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCA0KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpID4+IDIpXG5cdFx0XHRwdXNoKCh0bXAgPj4gOCkgJiAweEZGKVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdHJldHVybiBhcnJcblx0fVxuXG5cdGZ1bmN0aW9uIHVpbnQ4VG9CYXNlNjQgKHVpbnQ4KSB7XG5cdFx0dmFyIGksXG5cdFx0XHRleHRyYUJ5dGVzID0gdWludDgubGVuZ3RoICUgMywgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcblx0XHRcdG91dHB1dCA9IFwiXCIsXG5cdFx0XHR0ZW1wLCBsZW5ndGhcblxuXHRcdGZ1bmN0aW9uIGVuY29kZSAobnVtKSB7XG5cdFx0XHRyZXR1cm4gbG9va3VwLmNoYXJBdChudW0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBlbmNvZGUobnVtID4+IDE4ICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDEyICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDYgJiAweDNGKSArIGVuY29kZShudW0gJiAweDNGKVxuXHRcdH1cblxuXHRcdC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcblx0XHRmb3IgKGkgPSAwLCBsZW5ndGggPSB1aW50OC5sZW5ndGggLSBleHRyYUJ5dGVzOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcblx0XHRcdHRlbXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApXG5cdFx0fVxuXG5cdFx0Ly8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuXHRcdHN3aXRjaCAoZXh0cmFCeXRlcykge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0ZW1wID0gdWludDhbdWludDgubGVuZ3RoIC0gMV1cblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDIpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz09J1xuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMTApXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPj4gNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDIpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9J1xuXHRcdFx0XHRicmVha1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXRcblx0fVxuXG5cdGV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheVxuXHRleHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0XG59KHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJyA/ICh0aGlzLmJhc2U2NGpzID0ge30pIDogZXhwb3J0cykpXG4iLCJleHBvcnRzLnJlYWQgPSBmdW5jdGlvbihidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLFxuICAgICAgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMSxcbiAgICAgIGVNYXggPSAoMSA8PCBlTGVuKSAtIDEsXG4gICAgICBlQmlhcyA9IGVNYXggPj4gMSxcbiAgICAgIG5CaXRzID0gLTcsXG4gICAgICBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDAsXG4gICAgICBkID0gaXNMRSA/IC0xIDogMSxcbiAgICAgIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV07XG5cbiAgaSArPSBkO1xuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpO1xuICBzID4+PSAoLW5CaXRzKTtcbiAgbkJpdHMgKz0gZUxlbjtcbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCk7XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSk7XG4gIGUgPj49ICgtbkJpdHMpO1xuICBuQml0cyArPSBtTGVuO1xuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KTtcblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXM7XG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KTtcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pO1xuICAgIGUgPSBlIC0gZUJpYXM7XG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbik7XG59O1xuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24oYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGMsXG4gICAgICBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxLFxuICAgICAgZU1heCA9ICgxIDw8IGVMZW4pIC0gMSxcbiAgICAgIGVCaWFzID0gZU1heCA+PiAxLFxuICAgICAgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApLFxuICAgICAgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpLFxuICAgICAgZCA9IGlzTEUgPyAxIDogLTEsXG4gICAgICBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwO1xuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpO1xuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwO1xuICAgIGUgPSBlTWF4O1xuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKTtcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS07XG4gICAgICBjICo9IDI7XG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcyk7XG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrO1xuICAgICAgYyAvPSAyO1xuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDA7XG4gICAgICBlID0gZU1heDtcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbik7XG4gICAgICBlID0gZSArIGVCaWFzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbik7XG4gICAgICBlID0gMDtcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KTtcblxuICBlID0gKGUgPDwgbUxlbikgfCBtO1xuICBlTGVuICs9IG1MZW47XG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCk7XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4O1xufTtcbiIsInZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7XG52YXIgaW50U2l6ZSA9IDQ7XG52YXIgemVyb0J1ZmZlciA9IG5ldyBCdWZmZXIoaW50U2l6ZSk7IHplcm9CdWZmZXIuZmlsbCgwKTtcbnZhciBjaHJzeiA9IDg7XG5cbmZ1bmN0aW9uIHRvQXJyYXkoYnVmLCBiaWdFbmRpYW4pIHtcbiAgaWYgKChidWYubGVuZ3RoICUgaW50U2l6ZSkgIT09IDApIHtcbiAgICB2YXIgbGVuID0gYnVmLmxlbmd0aCArIChpbnRTaXplIC0gKGJ1Zi5sZW5ndGggJSBpbnRTaXplKSk7XG4gICAgYnVmID0gQnVmZmVyLmNvbmNhdChbYnVmLCB6ZXJvQnVmZmVyXSwgbGVuKTtcbiAgfVxuXG4gIHZhciBhcnIgPSBbXTtcbiAgdmFyIGZuID0gYmlnRW5kaWFuID8gYnVmLnJlYWRJbnQzMkJFIDogYnVmLnJlYWRJbnQzMkxFO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1Zi5sZW5ndGg7IGkgKz0gaW50U2l6ZSkge1xuICAgIGFyci5wdXNoKGZuLmNhbGwoYnVmLCBpKSk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuZnVuY3Rpb24gdG9CdWZmZXIoYXJyLCBzaXplLCBiaWdFbmRpYW4pIHtcbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIoc2l6ZSk7XG4gIHZhciBmbiA9IGJpZ0VuZGlhbiA/IGJ1Zi53cml0ZUludDMyQkUgOiBidWYud3JpdGVJbnQzMkxFO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgIGZuLmNhbGwoYnVmLCBhcnJbaV0sIGkgKiA0LCB0cnVlKTtcbiAgfVxuICByZXR1cm4gYnVmO1xufVxuXG5mdW5jdGlvbiBoYXNoKGJ1ZiwgZm4sIGhhc2hTaXplLCBiaWdFbmRpYW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgYnVmID0gbmV3IEJ1ZmZlcihidWYpO1xuICB2YXIgYXJyID0gZm4odG9BcnJheShidWYsIGJpZ0VuZGlhbiksIGJ1Zi5sZW5ndGggKiBjaHJzeik7XG4gIHJldHVybiB0b0J1ZmZlcihhcnIsIGhhc2hTaXplLCBiaWdFbmRpYW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgaGFzaDogaGFzaCB9O1xuIiwidmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlclxudmFyIHNoYSA9IHJlcXVpcmUoJy4vc2hhJylcbnZhciBzaGEyNTYgPSByZXF1aXJlKCcuL3NoYTI1NicpXG52YXIgcm5nID0gcmVxdWlyZSgnLi9ybmcnKVxudmFyIG1kNSA9IHJlcXVpcmUoJy4vbWQ1JylcblxudmFyIGFsZ29yaXRobXMgPSB7XG4gIHNoYTE6IHNoYSxcbiAgc2hhMjU2OiBzaGEyNTYsXG4gIG1kNTogbWQ1XG59XG5cbnZhciBibG9ja3NpemUgPSA2NFxudmFyIHplcm9CdWZmZXIgPSBuZXcgQnVmZmVyKGJsb2Nrc2l6ZSk7IHplcm9CdWZmZXIuZmlsbCgwKVxuZnVuY3Rpb24gaG1hYyhmbiwga2V5LCBkYXRhKSB7XG4gIGlmKCFCdWZmZXIuaXNCdWZmZXIoa2V5KSkga2V5ID0gbmV3IEJ1ZmZlcihrZXkpXG4gIGlmKCFCdWZmZXIuaXNCdWZmZXIoZGF0YSkpIGRhdGEgPSBuZXcgQnVmZmVyKGRhdGEpXG5cbiAgaWYoa2V5Lmxlbmd0aCA+IGJsb2Nrc2l6ZSkge1xuICAgIGtleSA9IGZuKGtleSlcbiAgfSBlbHNlIGlmKGtleS5sZW5ndGggPCBibG9ja3NpemUpIHtcbiAgICBrZXkgPSBCdWZmZXIuY29uY2F0KFtrZXksIHplcm9CdWZmZXJdLCBibG9ja3NpemUpXG4gIH1cblxuICB2YXIgaXBhZCA9IG5ldyBCdWZmZXIoYmxvY2tzaXplKSwgb3BhZCA9IG5ldyBCdWZmZXIoYmxvY2tzaXplKVxuICBmb3IodmFyIGkgPSAwOyBpIDwgYmxvY2tzaXplOyBpKyspIHtcbiAgICBpcGFkW2ldID0ga2V5W2ldIF4gMHgzNlxuICAgIG9wYWRbaV0gPSBrZXlbaV0gXiAweDVDXG4gIH1cblxuICB2YXIgaGFzaCA9IGZuKEJ1ZmZlci5jb25jYXQoW2lwYWQsIGRhdGFdKSlcbiAgcmV0dXJuIGZuKEJ1ZmZlci5jb25jYXQoW29wYWQsIGhhc2hdKSlcbn1cblxuZnVuY3Rpb24gaGFzaChhbGcsIGtleSkge1xuICBhbGcgPSBhbGcgfHwgJ3NoYTEnXG4gIHZhciBmbiA9IGFsZ29yaXRobXNbYWxnXVxuICB2YXIgYnVmcyA9IFtdXG4gIHZhciBsZW5ndGggPSAwXG4gIGlmKCFmbikgZXJyb3IoJ2FsZ29yaXRobTonLCBhbGcsICdpcyBub3QgeWV0IHN1cHBvcnRlZCcpXG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgaWYoIUJ1ZmZlci5pc0J1ZmZlcihkYXRhKSkgZGF0YSA9IG5ldyBCdWZmZXIoZGF0YSlcbiAgICAgICAgXG4gICAgICBidWZzLnB1c2goZGF0YSlcbiAgICAgIGxlbmd0aCArPSBkYXRhLmxlbmd0aFxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuICAgIGRpZ2VzdDogZnVuY3Rpb24gKGVuYykge1xuICAgICAgdmFyIGJ1ZiA9IEJ1ZmZlci5jb25jYXQoYnVmcylcbiAgICAgIHZhciByID0ga2V5ID8gaG1hYyhmbiwga2V5LCBidWYpIDogZm4oYnVmKVxuICAgICAgYnVmcyA9IG51bGxcbiAgICAgIHJldHVybiBlbmMgPyByLnRvU3RyaW5nKGVuYykgOiByXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGVycm9yICgpIHtcbiAgdmFyIG0gPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykuam9pbignICcpXG4gIHRocm93IG5ldyBFcnJvcihbXG4gICAgbSxcbiAgICAnd2UgYWNjZXB0IHB1bGwgcmVxdWVzdHMnLFxuICAgICdodHRwOi8vZ2l0aHViLmNvbS9kb21pbmljdGFyci9jcnlwdG8tYnJvd3NlcmlmeSdcbiAgICBdLmpvaW4oJ1xcbicpKVxufVxuXG5leHBvcnRzLmNyZWF0ZUhhc2ggPSBmdW5jdGlvbiAoYWxnKSB7IHJldHVybiBoYXNoKGFsZykgfVxuZXhwb3J0cy5jcmVhdGVIbWFjID0gZnVuY3Rpb24gKGFsZywga2V5KSB7IHJldHVybiBoYXNoKGFsZywga2V5KSB9XG5leHBvcnRzLnJhbmRvbUJ5dGVzID0gZnVuY3Rpb24oc2l6ZSwgY2FsbGJhY2spIHtcbiAgaWYgKGNhbGxiYWNrICYmIGNhbGxiYWNrLmNhbGwpIHtcbiAgICB0cnkge1xuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCB1bmRlZmluZWQsIG5ldyBCdWZmZXIocm5nKHNpemUpKSlcbiAgICB9IGNhdGNoIChlcnIpIHsgY2FsbGJhY2soZXJyKSB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIocm5nKHNpemUpKVxuICB9XG59XG5cbmZ1bmN0aW9uIGVhY2goYSwgZikge1xuICBmb3IodmFyIGkgaW4gYSlcbiAgICBmKGFbaV0sIGkpXG59XG5cbi8vIHRoZSBsZWFzdCBJIGNhbiBkbyBpcyBtYWtlIGVycm9yIG1lc3NhZ2VzIGZvciB0aGUgcmVzdCBvZiB0aGUgbm9kZS5qcy9jcnlwdG8gYXBpLlxuZWFjaChbJ2NyZWF0ZUNyZWRlbnRpYWxzJ1xuLCAnY3JlYXRlQ2lwaGVyJ1xuLCAnY3JlYXRlQ2lwaGVyaXYnXG4sICdjcmVhdGVEZWNpcGhlcidcbiwgJ2NyZWF0ZURlY2lwaGVyaXYnXG4sICdjcmVhdGVTaWduJ1xuLCAnY3JlYXRlVmVyaWZ5J1xuLCAnY3JlYXRlRGlmZmllSGVsbG1hbidcbiwgJ3Bia2RmMiddLCBmdW5jdGlvbiAobmFtZSkge1xuICBleHBvcnRzW25hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgIGVycm9yKCdzb3JyeSwnLCBuYW1lLCAnaXMgbm90IGltcGxlbWVudGVkIHlldCcpXG4gIH1cbn0pXG4iLCIvKlxyXG4gKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFJTQSBEYXRhIFNlY3VyaXR5LCBJbmMuIE1ENSBNZXNzYWdlXHJcbiAqIERpZ2VzdCBBbGdvcml0aG0sIGFzIGRlZmluZWQgaW4gUkZDIDEzMjEuXHJcbiAqIFZlcnNpb24gMi4xIENvcHlyaWdodCAoQykgUGF1bCBKb2huc3RvbiAxOTk5IC0gMjAwMi5cclxuICogT3RoZXIgY29udHJpYnV0b3JzOiBHcmVnIEhvbHQsIEFuZHJldyBLZXBlcnQsIFlkbmFyLCBMb3N0aW5ldFxyXG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgQlNEIExpY2Vuc2VcclxuICogU2VlIGh0dHA6Ly9wYWpob21lLm9yZy51ay9jcnlwdC9tZDUgZm9yIG1vcmUgaW5mby5cclxuICovXHJcblxyXG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpO1xyXG5cclxuLypcclxuICogUGVyZm9ybSBhIHNpbXBsZSBzZWxmLXRlc3QgdG8gc2VlIGlmIHRoZSBWTSBpcyB3b3JraW5nXHJcbiAqL1xyXG5mdW5jdGlvbiBtZDVfdm1fdGVzdCgpXHJcbntcclxuICByZXR1cm4gaGV4X21kNShcImFiY1wiKSA9PSBcIjkwMDE1MDk4M2NkMjRmYjBkNjk2M2Y3ZDI4ZTE3ZjcyXCI7XHJcbn1cclxuXHJcbi8qXHJcbiAqIENhbGN1bGF0ZSB0aGUgTUQ1IG9mIGFuIGFycmF5IG9mIGxpdHRsZS1lbmRpYW4gd29yZHMsIGFuZCBhIGJpdCBsZW5ndGhcclxuICovXHJcbmZ1bmN0aW9uIGNvcmVfbWQ1KHgsIGxlbilcclxue1xyXG4gIC8qIGFwcGVuZCBwYWRkaW5nICovXHJcbiAgeFtsZW4gPj4gNV0gfD0gMHg4MCA8PCAoKGxlbikgJSAzMik7XHJcbiAgeFsoKChsZW4gKyA2NCkgPj4+IDkpIDw8IDQpICsgMTRdID0gbGVuO1xyXG5cclxuICB2YXIgYSA9ICAxNzMyNTg0MTkzO1xyXG4gIHZhciBiID0gLTI3MTczMzg3OTtcclxuICB2YXIgYyA9IC0xNzMyNTg0MTk0O1xyXG4gIHZhciBkID0gIDI3MTczMzg3ODtcclxuXHJcbiAgZm9yKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpICs9IDE2KVxyXG4gIHtcclxuICAgIHZhciBvbGRhID0gYTtcclxuICAgIHZhciBvbGRiID0gYjtcclxuICAgIHZhciBvbGRjID0gYztcclxuICAgIHZhciBvbGRkID0gZDtcclxuXHJcbiAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSsgMF0sIDcgLCAtNjgwODc2OTM2KTtcclxuICAgIGQgPSBtZDVfZmYoZCwgYSwgYiwgYywgeFtpKyAxXSwgMTIsIC0zODk1NjQ1ODYpO1xyXG4gICAgYyA9IG1kNV9mZihjLCBkLCBhLCBiLCB4W2krIDJdLCAxNywgIDYwNjEwNTgxOSk7XHJcbiAgICBiID0gbWQ1X2ZmKGIsIGMsIGQsIGEsIHhbaSsgM10sIDIyLCAtMTA0NDUyNTMzMCk7XHJcbiAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSsgNF0sIDcgLCAtMTc2NDE4ODk3KTtcclxuICAgIGQgPSBtZDVfZmYoZCwgYSwgYiwgYywgeFtpKyA1XSwgMTIsICAxMjAwMDgwNDI2KTtcclxuICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpKyA2XSwgMTcsIC0xNDczMjMxMzQxKTtcclxuICAgIGIgPSBtZDVfZmYoYiwgYywgZCwgYSwgeFtpKyA3XSwgMjIsIC00NTcwNTk4Myk7XHJcbiAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSsgOF0sIDcgLCAgMTc3MDAzNTQxNik7XHJcbiAgICBkID0gbWQ1X2ZmKGQsIGEsIGIsIGMsIHhbaSsgOV0sIDEyLCAtMTk1ODQxNDQxNyk7XHJcbiAgICBjID0gbWQ1X2ZmKGMsIGQsIGEsIGIsIHhbaSsxMF0sIDE3LCAtNDIwNjMpO1xyXG4gICAgYiA9IG1kNV9mZihiLCBjLCBkLCBhLCB4W2krMTFdLCAyMiwgLTE5OTA0MDQxNjIpO1xyXG4gICAgYSA9IG1kNV9mZihhLCBiLCBjLCBkLCB4W2krMTJdLCA3ICwgIDE4MDQ2MDM2ODIpO1xyXG4gICAgZCA9IG1kNV9mZihkLCBhLCBiLCBjLCB4W2krMTNdLCAxMiwgLTQwMzQxMTAxKTtcclxuICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpKzE0XSwgMTcsIC0xNTAyMDAyMjkwKTtcclxuICAgIGIgPSBtZDVfZmYoYiwgYywgZCwgYSwgeFtpKzE1XSwgMjIsICAxMjM2NTM1MzI5KTtcclxuXHJcbiAgICBhID0gbWQ1X2dnKGEsIGIsIGMsIGQsIHhbaSsgMV0sIDUgLCAtMTY1Nzk2NTEwKTtcclxuICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpKyA2XSwgOSAsIC0xMDY5NTAxNjMyKTtcclxuICAgIGMgPSBtZDVfZ2coYywgZCwgYSwgYiwgeFtpKzExXSwgMTQsICA2NDM3MTc3MTMpO1xyXG4gICAgYiA9IG1kNV9nZyhiLCBjLCBkLCBhLCB4W2krIDBdLCAyMCwgLTM3Mzg5NzMwMik7XHJcbiAgICBhID0gbWQ1X2dnKGEsIGIsIGMsIGQsIHhbaSsgNV0sIDUgLCAtNzAxNTU4NjkxKTtcclxuICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpKzEwXSwgOSAsICAzODAxNjA4Myk7XHJcbiAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSsxNV0sIDE0LCAtNjYwNDc4MzM1KTtcclxuICAgIGIgPSBtZDVfZ2coYiwgYywgZCwgYSwgeFtpKyA0XSwgMjAsIC00MDU1Mzc4NDgpO1xyXG4gICAgYSA9IG1kNV9nZyhhLCBiLCBjLCBkLCB4W2krIDldLCA1ICwgIDU2ODQ0NjQzOCk7XHJcbiAgICBkID0gbWQ1X2dnKGQsIGEsIGIsIGMsIHhbaSsxNF0sIDkgLCAtMTAxOTgwMzY5MCk7XHJcbiAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSsgM10sIDE0LCAtMTg3MzYzOTYxKTtcclxuICAgIGIgPSBtZDVfZ2coYiwgYywgZCwgYSwgeFtpKyA4XSwgMjAsICAxMTYzNTMxNTAxKTtcclxuICAgIGEgPSBtZDVfZ2coYSwgYiwgYywgZCwgeFtpKzEzXSwgNSAsIC0xNDQ0NjgxNDY3KTtcclxuICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpKyAyXSwgOSAsIC01MTQwMzc4NCk7XHJcbiAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSsgN10sIDE0LCAgMTczNTMyODQ3Myk7XHJcbiAgICBiID0gbWQ1X2dnKGIsIGMsIGQsIGEsIHhbaSsxMl0sIDIwLCAtMTkyNjYwNzczNCk7XHJcblxyXG4gICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2krIDVdLCA0ICwgLTM3ODU1OCk7XHJcbiAgICBkID0gbWQ1X2hoKGQsIGEsIGIsIGMsIHhbaSsgOF0sIDExLCAtMjAyMjU3NDQ2Myk7XHJcbiAgICBjID0gbWQ1X2hoKGMsIGQsIGEsIGIsIHhbaSsxMV0sIDE2LCAgMTgzOTAzMDU2Mik7XHJcbiAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSsxNF0sIDIzLCAtMzUzMDk1NTYpO1xyXG4gICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2krIDFdLCA0ICwgLTE1MzA5OTIwNjApO1xyXG4gICAgZCA9IG1kNV9oaChkLCBhLCBiLCBjLCB4W2krIDRdLCAxMSwgIDEyNzI4OTMzNTMpO1xyXG4gICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2krIDddLCAxNiwgLTE1NTQ5NzYzMik7XHJcbiAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSsxMF0sIDIzLCAtMTA5NDczMDY0MCk7XHJcbiAgICBhID0gbWQ1X2hoKGEsIGIsIGMsIGQsIHhbaSsxM10sIDQgLCAgNjgxMjc5MTc0KTtcclxuICAgIGQgPSBtZDVfaGgoZCwgYSwgYiwgYywgeFtpKyAwXSwgMTEsIC0zNTg1MzcyMjIpO1xyXG4gICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2krIDNdLCAxNiwgLTcyMjUyMTk3OSk7XHJcbiAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSsgNl0sIDIzLCAgNzYwMjkxODkpO1xyXG4gICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2krIDldLCA0ICwgLTY0MDM2NDQ4Nyk7XHJcbiAgICBkID0gbWQ1X2hoKGQsIGEsIGIsIGMsIHhbaSsxMl0sIDExLCAtNDIxODE1ODM1KTtcclxuICAgIGMgPSBtZDVfaGgoYywgZCwgYSwgYiwgeFtpKzE1XSwgMTYsICA1MzA3NDI1MjApO1xyXG4gICAgYiA9IG1kNV9oaChiLCBjLCBkLCBhLCB4W2krIDJdLCAyMywgLTk5NTMzODY1MSk7XHJcblxyXG4gICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2krIDBdLCA2ICwgLTE5ODYzMDg0NCk7XHJcbiAgICBkID0gbWQ1X2lpKGQsIGEsIGIsIGMsIHhbaSsgN10sIDEwLCAgMTEyNjg5MTQxNSk7XHJcbiAgICBjID0gbWQ1X2lpKGMsIGQsIGEsIGIsIHhbaSsxNF0sIDE1LCAtMTQxNjM1NDkwNSk7XHJcbiAgICBiID0gbWQ1X2lpKGIsIGMsIGQsIGEsIHhbaSsgNV0sIDIxLCAtNTc0MzQwNTUpO1xyXG4gICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2krMTJdLCA2ICwgIDE3MDA0ODU1NzEpO1xyXG4gICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2krIDNdLCAxMCwgLTE4OTQ5ODY2MDYpO1xyXG4gICAgYyA9IG1kNV9paShjLCBkLCBhLCBiLCB4W2krMTBdLCAxNSwgLTEwNTE1MjMpO1xyXG4gICAgYiA9IG1kNV9paShiLCBjLCBkLCBhLCB4W2krIDFdLCAyMSwgLTIwNTQ5MjI3OTkpO1xyXG4gICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2krIDhdLCA2ICwgIDE4NzMzMTMzNTkpO1xyXG4gICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2krMTVdLCAxMCwgLTMwNjExNzQ0KTtcclxuICAgIGMgPSBtZDVfaWkoYywgZCwgYSwgYiwgeFtpKyA2XSwgMTUsIC0xNTYwMTk4MzgwKTtcclxuICAgIGIgPSBtZDVfaWkoYiwgYywgZCwgYSwgeFtpKzEzXSwgMjEsICAxMzA5MTUxNjQ5KTtcclxuICAgIGEgPSBtZDVfaWkoYSwgYiwgYywgZCwgeFtpKyA0XSwgNiAsIC0xNDU1MjMwNzApO1xyXG4gICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2krMTFdLCAxMCwgLTExMjAyMTAzNzkpO1xyXG4gICAgYyA9IG1kNV9paShjLCBkLCBhLCBiLCB4W2krIDJdLCAxNSwgIDcxODc4NzI1OSk7XHJcbiAgICBiID0gbWQ1X2lpKGIsIGMsIGQsIGEsIHhbaSsgOV0sIDIxLCAtMzQzNDg1NTUxKTtcclxuXHJcbiAgICBhID0gc2FmZV9hZGQoYSwgb2xkYSk7XHJcbiAgICBiID0gc2FmZV9hZGQoYiwgb2xkYik7XHJcbiAgICBjID0gc2FmZV9hZGQoYywgb2xkYyk7XHJcbiAgICBkID0gc2FmZV9hZGQoZCwgb2xkZCk7XHJcbiAgfVxyXG4gIHJldHVybiBBcnJheShhLCBiLCBjLCBkKTtcclxuXHJcbn1cclxuXHJcbi8qXHJcbiAqIFRoZXNlIGZ1bmN0aW9ucyBpbXBsZW1lbnQgdGhlIGZvdXIgYmFzaWMgb3BlcmF0aW9ucyB0aGUgYWxnb3JpdGhtIHVzZXMuXHJcbiAqL1xyXG5mdW5jdGlvbiBtZDVfY21uKHEsIGEsIGIsIHgsIHMsIHQpXHJcbntcclxuICByZXR1cm4gc2FmZV9hZGQoYml0X3JvbChzYWZlX2FkZChzYWZlX2FkZChhLCBxKSwgc2FmZV9hZGQoeCwgdCkpLCBzKSxiKTtcclxufVxyXG5mdW5jdGlvbiBtZDVfZmYoYSwgYiwgYywgZCwgeCwgcywgdClcclxue1xyXG4gIHJldHVybiBtZDVfY21uKChiICYgYykgfCAoKH5iKSAmIGQpLCBhLCBiLCB4LCBzLCB0KTtcclxufVxyXG5mdW5jdGlvbiBtZDVfZ2coYSwgYiwgYywgZCwgeCwgcywgdClcclxue1xyXG4gIHJldHVybiBtZDVfY21uKChiICYgZCkgfCAoYyAmICh+ZCkpLCBhLCBiLCB4LCBzLCB0KTtcclxufVxyXG5mdW5jdGlvbiBtZDVfaGgoYSwgYiwgYywgZCwgeCwgcywgdClcclxue1xyXG4gIHJldHVybiBtZDVfY21uKGIgXiBjIF4gZCwgYSwgYiwgeCwgcywgdCk7XHJcbn1cclxuZnVuY3Rpb24gbWQ1X2lpKGEsIGIsIGMsIGQsIHgsIHMsIHQpXHJcbntcclxuICByZXR1cm4gbWQ1X2NtbihjIF4gKGIgfCAofmQpKSwgYSwgYiwgeCwgcywgdCk7XHJcbn1cclxuXHJcbi8qXHJcbiAqIEFkZCBpbnRlZ2Vycywgd3JhcHBpbmcgYXQgMl4zMi4gVGhpcyB1c2VzIDE2LWJpdCBvcGVyYXRpb25zIGludGVybmFsbHlcclxuICogdG8gd29yayBhcm91bmQgYnVncyBpbiBzb21lIEpTIGludGVycHJldGVycy5cclxuICovXHJcbmZ1bmN0aW9uIHNhZmVfYWRkKHgsIHkpXHJcbntcclxuICB2YXIgbHN3ID0gKHggJiAweEZGRkYpICsgKHkgJiAweEZGRkYpO1xyXG4gIHZhciBtc3cgPSAoeCA+PiAxNikgKyAoeSA+PiAxNikgKyAobHN3ID4+IDE2KTtcclxuICByZXR1cm4gKG1zdyA8PCAxNikgfCAobHN3ICYgMHhGRkZGKTtcclxufVxyXG5cclxuLypcclxuICogQml0d2lzZSByb3RhdGUgYSAzMi1iaXQgbnVtYmVyIHRvIHRoZSBsZWZ0LlxyXG4gKi9cclxuZnVuY3Rpb24gYml0X3JvbChudW0sIGNudClcclxue1xyXG4gIHJldHVybiAobnVtIDw8IGNudCkgfCAobnVtID4+PiAoMzIgLSBjbnQpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtZDUoYnVmKSB7XHJcbiAgcmV0dXJuIGhlbHBlcnMuaGFzaChidWYsIGNvcmVfbWQ1LCAxNik7XHJcbn07XHJcbiIsIi8vIE9yaWdpbmFsIGNvZGUgYWRhcHRlZCBmcm9tIFJvYmVydCBLaWVmZmVyLlxuLy8gZGV0YWlscyBhdCBodHRwczovL2dpdGh1Yi5jb20vYnJvb2ZhL25vZGUtdXVpZFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgX2dsb2JhbCA9IHRoaXM7XG5cbiAgdmFyIG1hdGhSTkcsIHdoYXR3Z1JORztcblxuICAvLyBOT1RFOiBNYXRoLnJhbmRvbSgpIGRvZXMgbm90IGd1YXJhbnRlZSBcImNyeXB0b2dyYXBoaWMgcXVhbGl0eVwiXG4gIG1hdGhSTkcgPSBmdW5jdGlvbihzaXplKSB7XG4gICAgdmFyIGJ5dGVzID0gbmV3IEFycmF5KHNpemUpO1xuICAgIHZhciByO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIHI7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGlmICgoaSAmIDB4MDMpID09IDApIHIgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDA7XG4gICAgICBieXRlc1tpXSA9IHIgPj4+ICgoaSAmIDB4MDMpIDw8IDMpICYgMHhmZjtcbiAgICB9XG5cbiAgICByZXR1cm4gYnl0ZXM7XG4gIH1cblxuICBpZiAoX2dsb2JhbC5jcnlwdG8gJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xuICAgIHdoYXR3Z1JORyA9IGZ1bmN0aW9uKHNpemUpIHtcbiAgICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KHNpemUpO1xuICAgICAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhieXRlcyk7XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfVxuICB9XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSB3aGF0d2dSTkcgfHwgbWF0aFJORztcblxufSgpKVxuIiwiLypcbiAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgU2VjdXJlIEhhc2ggQWxnb3JpdGhtLCBTSEEtMSwgYXMgZGVmaW5lZFxuICogaW4gRklQUyBQVUIgMTgwLTFcbiAqIFZlcnNpb24gMi4xYSBDb3B5cmlnaHQgUGF1bCBKb2huc3RvbiAyMDAwIC0gMjAwMi5cbiAqIE90aGVyIGNvbnRyaWJ1dG9yczogR3JlZyBIb2x0LCBBbmRyZXcgS2VwZXJ0LCBZZG5hciwgTG9zdGluZXRcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSBCU0QgTGljZW5zZVxuICogU2VlIGh0dHA6Ly9wYWpob21lLm9yZy51ay9jcnlwdC9tZDUgZm9yIGRldGFpbHMuXG4gKi9cblxudmFyIGhlbHBlcnMgPSByZXF1aXJlKCcuL2hlbHBlcnMnKTtcblxuLypcbiAqIENhbGN1bGF0ZSB0aGUgU0hBLTEgb2YgYW4gYXJyYXkgb2YgYmlnLWVuZGlhbiB3b3JkcywgYW5kIGEgYml0IGxlbmd0aFxuICovXG5mdW5jdGlvbiBjb3JlX3NoYTEoeCwgbGVuKVxue1xuICAvKiBhcHBlbmQgcGFkZGluZyAqL1xuICB4W2xlbiA+PiA1XSB8PSAweDgwIDw8ICgyNCAtIGxlbiAlIDMyKTtcbiAgeFsoKGxlbiArIDY0ID4+IDkpIDw8IDQpICsgMTVdID0gbGVuO1xuXG4gIHZhciB3ID0gQXJyYXkoODApO1xuICB2YXIgYSA9ICAxNzMyNTg0MTkzO1xuICB2YXIgYiA9IC0yNzE3MzM4Nzk7XG4gIHZhciBjID0gLTE3MzI1ODQxOTQ7XG4gIHZhciBkID0gIDI3MTczMzg3ODtcbiAgdmFyIGUgPSAtMTAwOTU4OTc3NjtcblxuICBmb3IodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkgKz0gMTYpXG4gIHtcbiAgICB2YXIgb2xkYSA9IGE7XG4gICAgdmFyIG9sZGIgPSBiO1xuICAgIHZhciBvbGRjID0gYztcbiAgICB2YXIgb2xkZCA9IGQ7XG4gICAgdmFyIG9sZGUgPSBlO1xuXG4gICAgZm9yKHZhciBqID0gMDsgaiA8IDgwOyBqKyspXG4gICAge1xuICAgICAgaWYoaiA8IDE2KSB3W2pdID0geFtpICsgal07XG4gICAgICBlbHNlIHdbal0gPSByb2wod1tqLTNdIF4gd1tqLThdIF4gd1tqLTE0XSBeIHdbai0xNl0sIDEpO1xuICAgICAgdmFyIHQgPSBzYWZlX2FkZChzYWZlX2FkZChyb2woYSwgNSksIHNoYTFfZnQoaiwgYiwgYywgZCkpLFxuICAgICAgICAgICAgICAgICAgICAgICBzYWZlX2FkZChzYWZlX2FkZChlLCB3W2pdKSwgc2hhMV9rdChqKSkpO1xuICAgICAgZSA9IGQ7XG4gICAgICBkID0gYztcbiAgICAgIGMgPSByb2woYiwgMzApO1xuICAgICAgYiA9IGE7XG4gICAgICBhID0gdDtcbiAgICB9XG5cbiAgICBhID0gc2FmZV9hZGQoYSwgb2xkYSk7XG4gICAgYiA9IHNhZmVfYWRkKGIsIG9sZGIpO1xuICAgIGMgPSBzYWZlX2FkZChjLCBvbGRjKTtcbiAgICBkID0gc2FmZV9hZGQoZCwgb2xkZCk7XG4gICAgZSA9IHNhZmVfYWRkKGUsIG9sZGUpO1xuICB9XG4gIHJldHVybiBBcnJheShhLCBiLCBjLCBkLCBlKTtcblxufVxuXG4vKlxuICogUGVyZm9ybSB0aGUgYXBwcm9wcmlhdGUgdHJpcGxldCBjb21iaW5hdGlvbiBmdW5jdGlvbiBmb3IgdGhlIGN1cnJlbnRcbiAqIGl0ZXJhdGlvblxuICovXG5mdW5jdGlvbiBzaGExX2Z0KHQsIGIsIGMsIGQpXG57XG4gIGlmKHQgPCAyMCkgcmV0dXJuIChiICYgYykgfCAoKH5iKSAmIGQpO1xuICBpZih0IDwgNDApIHJldHVybiBiIF4gYyBeIGQ7XG4gIGlmKHQgPCA2MCkgcmV0dXJuIChiICYgYykgfCAoYiAmIGQpIHwgKGMgJiBkKTtcbiAgcmV0dXJuIGIgXiBjIF4gZDtcbn1cblxuLypcbiAqIERldGVybWluZSB0aGUgYXBwcm9wcmlhdGUgYWRkaXRpdmUgY29uc3RhbnQgZm9yIHRoZSBjdXJyZW50IGl0ZXJhdGlvblxuICovXG5mdW5jdGlvbiBzaGExX2t0KHQpXG57XG4gIHJldHVybiAodCA8IDIwKSA/ICAxNTE4NTAwMjQ5IDogKHQgPCA0MCkgPyAgMTg1OTc3NTM5MyA6XG4gICAgICAgICAodCA8IDYwKSA/IC0xODk0MDA3NTg4IDogLTg5OTQ5NzUxNDtcbn1cblxuLypcbiAqIEFkZCBpbnRlZ2Vycywgd3JhcHBpbmcgYXQgMl4zMi4gVGhpcyB1c2VzIDE2LWJpdCBvcGVyYXRpb25zIGludGVybmFsbHlcbiAqIHRvIHdvcmsgYXJvdW5kIGJ1Z3MgaW4gc29tZSBKUyBpbnRlcnByZXRlcnMuXG4gKi9cbmZ1bmN0aW9uIHNhZmVfYWRkKHgsIHkpXG57XG4gIHZhciBsc3cgPSAoeCAmIDB4RkZGRikgKyAoeSAmIDB4RkZGRik7XG4gIHZhciBtc3cgPSAoeCA+PiAxNikgKyAoeSA+PiAxNikgKyAobHN3ID4+IDE2KTtcbiAgcmV0dXJuIChtc3cgPDwgMTYpIHwgKGxzdyAmIDB4RkZGRik7XG59XG5cbi8qXG4gKiBCaXR3aXNlIHJvdGF0ZSBhIDMyLWJpdCBudW1iZXIgdG8gdGhlIGxlZnQuXG4gKi9cbmZ1bmN0aW9uIHJvbChudW0sIGNudClcbntcbiAgcmV0dXJuIChudW0gPDwgY250KSB8IChudW0gPj4+ICgzMiAtIGNudCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNoYTEoYnVmKSB7XG4gIHJldHVybiBoZWxwZXJzLmhhc2goYnVmLCBjb3JlX3NoYTEsIDIwLCB0cnVlKTtcbn07XG4iLCJcbi8qKlxuICogQSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBTZWN1cmUgSGFzaCBBbGdvcml0aG0sIFNIQS0yNTYsIGFzIGRlZmluZWRcbiAqIGluIEZJUFMgMTgwLTJcbiAqIFZlcnNpb24gMi4yLWJldGEgQ29weXJpZ2h0IEFuZ2VsIE1hcmluLCBQYXVsIEpvaG5zdG9uIDIwMDAgLSAyMDA5LlxuICogT3RoZXIgY29udHJpYnV0b3JzOiBHcmVnIEhvbHQsIEFuZHJldyBLZXBlcnQsIFlkbmFyLCBMb3N0aW5ldFxuICpcbiAqL1xuXG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpO1xuXG52YXIgc2FmZV9hZGQgPSBmdW5jdGlvbih4LCB5KSB7XG4gIHZhciBsc3cgPSAoeCAmIDB4RkZGRikgKyAoeSAmIDB4RkZGRik7XG4gIHZhciBtc3cgPSAoeCA+PiAxNikgKyAoeSA+PiAxNikgKyAobHN3ID4+IDE2KTtcbiAgcmV0dXJuIChtc3cgPDwgMTYpIHwgKGxzdyAmIDB4RkZGRik7XG59O1xuXG52YXIgUyA9IGZ1bmN0aW9uKFgsIG4pIHtcbiAgcmV0dXJuIChYID4+PiBuKSB8IChYIDw8ICgzMiAtIG4pKTtcbn07XG5cbnZhciBSID0gZnVuY3Rpb24oWCwgbikge1xuICByZXR1cm4gKFggPj4+IG4pO1xufTtcblxudmFyIENoID0gZnVuY3Rpb24oeCwgeSwgeikge1xuICByZXR1cm4gKCh4ICYgeSkgXiAoKH54KSAmIHopKTtcbn07XG5cbnZhciBNYWogPSBmdW5jdGlvbih4LCB5LCB6KSB7XG4gIHJldHVybiAoKHggJiB5KSBeICh4ICYgeikgXiAoeSAmIHopKTtcbn07XG5cbnZhciBTaWdtYTAyNTYgPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiAoUyh4LCAyKSBeIFMoeCwgMTMpIF4gUyh4LCAyMikpO1xufTtcblxudmFyIFNpZ21hMTI1NiA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIChTKHgsIDYpIF4gUyh4LCAxMSkgXiBTKHgsIDI1KSk7XG59O1xuXG52YXIgR2FtbWEwMjU2ID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4gKFMoeCwgNykgXiBTKHgsIDE4KSBeIFIoeCwgMykpO1xufTtcblxudmFyIEdhbW1hMTI1NiA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIChTKHgsIDE3KSBeIFMoeCwgMTkpIF4gUih4LCAxMCkpO1xufTtcblxudmFyIGNvcmVfc2hhMjU2ID0gZnVuY3Rpb24obSwgbCkge1xuICB2YXIgSyA9IG5ldyBBcnJheSgweDQyOEEyRjk4LDB4NzEzNzQ0OTEsMHhCNUMwRkJDRiwweEU5QjVEQkE1LDB4Mzk1NkMyNUIsMHg1OUYxMTFGMSwweDkyM0Y4MkE0LDB4QUIxQzVFRDUsMHhEODA3QUE5OCwweDEyODM1QjAxLDB4MjQzMTg1QkUsMHg1NTBDN0RDMywweDcyQkU1RDc0LDB4ODBERUIxRkUsMHg5QkRDMDZBNywweEMxOUJGMTc0LDB4RTQ5QjY5QzEsMHhFRkJFNDc4NiwweEZDMTlEQzYsMHgyNDBDQTFDQywweDJERTkyQzZGLDB4NEE3NDg0QUEsMHg1Q0IwQTlEQywweDc2Rjk4OERBLDB4OTgzRTUxNTIsMHhBODMxQzY2RCwweEIwMDMyN0M4LDB4QkY1OTdGQzcsMHhDNkUwMEJGMywweEQ1QTc5MTQ3LDB4NkNBNjM1MSwweDE0MjkyOTY3LDB4MjdCNzBBODUsMHgyRTFCMjEzOCwweDREMkM2REZDLDB4NTMzODBEMTMsMHg2NTBBNzM1NCwweDc2NkEwQUJCLDB4ODFDMkM5MkUsMHg5MjcyMkM4NSwweEEyQkZFOEExLDB4QTgxQTY2NEIsMHhDMjRCOEI3MCwweEM3NkM1MUEzLDB4RDE5MkU4MTksMHhENjk5MDYyNCwweEY0MEUzNTg1LDB4MTA2QUEwNzAsMHgxOUE0QzExNiwweDFFMzc2QzA4LDB4Mjc0ODc3NEMsMHgzNEIwQkNCNSwweDM5MUMwQ0IzLDB4NEVEOEFBNEEsMHg1QjlDQ0E0RiwweDY4MkU2RkYzLDB4NzQ4RjgyRUUsMHg3OEE1NjM2RiwweDg0Qzg3ODE0LDB4OENDNzAyMDgsMHg5MEJFRkZGQSwweEE0NTA2Q0VCLDB4QkVGOUEzRjcsMHhDNjcxNzhGMik7XG4gIHZhciBIQVNIID0gbmV3IEFycmF5KDB4NkEwOUU2NjcsIDB4QkI2N0FFODUsIDB4M0M2RUYzNzIsIDB4QTU0RkY1M0EsIDB4NTEwRTUyN0YsIDB4OUIwNTY4OEMsIDB4MUY4M0Q5QUIsIDB4NUJFMENEMTkpO1xuICAgIHZhciBXID0gbmV3IEFycmF5KDY0KTtcbiAgICB2YXIgYSwgYiwgYywgZCwgZSwgZiwgZywgaCwgaSwgajtcbiAgICB2YXIgVDEsIFQyO1xuICAvKiBhcHBlbmQgcGFkZGluZyAqL1xuICBtW2wgPj4gNV0gfD0gMHg4MCA8PCAoMjQgLSBsICUgMzIpO1xuICBtWygobCArIDY0ID4+IDkpIDw8IDQpICsgMTVdID0gbDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSArPSAxNikge1xuICAgIGEgPSBIQVNIWzBdOyBiID0gSEFTSFsxXTsgYyA9IEhBU0hbMl07IGQgPSBIQVNIWzNdOyBlID0gSEFTSFs0XTsgZiA9IEhBU0hbNV07IGcgPSBIQVNIWzZdOyBoID0gSEFTSFs3XTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IDY0OyBqKyspIHtcbiAgICAgIGlmIChqIDwgMTYpIHtcbiAgICAgICAgV1tqXSA9IG1baiArIGldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgV1tqXSA9IHNhZmVfYWRkKHNhZmVfYWRkKHNhZmVfYWRkKEdhbW1hMTI1NihXW2ogLSAyXSksIFdbaiAtIDddKSwgR2FtbWEwMjU2KFdbaiAtIDE1XSkpLCBXW2ogLSAxNl0pO1xuICAgICAgfVxuICAgICAgVDEgPSBzYWZlX2FkZChzYWZlX2FkZChzYWZlX2FkZChzYWZlX2FkZChoLCBTaWdtYTEyNTYoZSkpLCBDaChlLCBmLCBnKSksIEtbal0pLCBXW2pdKTtcbiAgICAgIFQyID0gc2FmZV9hZGQoU2lnbWEwMjU2KGEpLCBNYWooYSwgYiwgYykpO1xuICAgICAgaCA9IGc7IGcgPSBmOyBmID0gZTsgZSA9IHNhZmVfYWRkKGQsIFQxKTsgZCA9IGM7IGMgPSBiOyBiID0gYTsgYSA9IHNhZmVfYWRkKFQxLCBUMik7XG4gICAgfVxuICAgIEhBU0hbMF0gPSBzYWZlX2FkZChhLCBIQVNIWzBdKTsgSEFTSFsxXSA9IHNhZmVfYWRkKGIsIEhBU0hbMV0pOyBIQVNIWzJdID0gc2FmZV9hZGQoYywgSEFTSFsyXSk7IEhBU0hbM10gPSBzYWZlX2FkZChkLCBIQVNIWzNdKTtcbiAgICBIQVNIWzRdID0gc2FmZV9hZGQoZSwgSEFTSFs0XSk7IEhBU0hbNV0gPSBzYWZlX2FkZChmLCBIQVNIWzVdKTsgSEFTSFs2XSA9IHNhZmVfYWRkKGcsIEhBU0hbNl0pOyBIQVNIWzddID0gc2FmZV9hZGQoaCwgSEFTSFs3XSk7XG4gIH1cbiAgcmV0dXJuIEhBU0g7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNoYTI1NihidWYpIHtcbiAgcmV0dXJuIGhlbHBlcnMuaGFzaChidWYsIGNvcmVfc2hhMjU2LCAzMiwgdHJ1ZSk7XG59O1xuIiwiLyogVGhpcyBTb3VyY2UgQ29kZSBGb3JtIGlzIHN1YmplY3QgdG8gdGhlIHRlcm1zIG9mIHRoZSBNb3ppbGxhIFB1YmxpY1xuICogTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpc1xuICogZmlsZSwgWW91IGNhbiBvYnRhaW4gb25lIGF0IGh0dHA6Ly9tb3ppbGxhLm9yZy9NUEwvMi4wLy4gKi9cblxudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5mdW5jdGlvbiBuZXh0KCkge1xuICByZXR1cm4gXCJAQHN5bWJvbDpcIiArIGNyeXB0by5yYW5kb21CeXRlcyg4KS50b1N0cmluZygnaGV4Jyk7XG59XG5cblxuZnVuY3Rpb24gU3ltYm9sKGRlc2MpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFN5bWJvbCkpIHtcbiAgICByZXR1cm4gbmV3IFN5bWJvbChkZXNjKTtcbiAgfVxuICB2YXIgX3N5bWJvbCA9IHRoaXMuX3N5bWJvbCA9IG5leHQoKTtcbiAgZGVmaW5lUHJvcGVydHkodGhpcywgJ19kZXNjJywge1xuICAgIHZhbHVlOiBkZXNjLFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gIH0pO1xuICBkZWZpbmVQcm9wZXJ0eShPYmplY3QucHJvdG90eXBlLCBfc3ltYm9sLCB7XG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgZGVmaW5lUHJvcGVydHkodGhpcywgX3N5bWJvbCwge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cblxuU3ltYm9sLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gdGhpcy5fc3ltYm9sO1xufTtcblxudmFyIGdsb2JhbFN5bWJvbFJlZ2lzdHJ5ID0ge307XG5TeW1ib2wuZm9yID0gZnVuY3Rpb24gc3ltYm9sRm9yKGtleSkge1xuICBrZXkgPSBTdHJpbmcoa2V5KTtcbiAgcmV0dXJuIGdsb2JhbFN5bWJvbFJlZ2lzdHJ5W2tleV0gfHwgKGdsb2JhbFN5bWJvbFJlZ2lzdHJ5W2tleV0gPSBTeW1ib2woa2V5KSk7XG59O1xuXG5TeW1ib2wua2V5Rm9yID0gZnVuY3Rpb24ga2V5Rm9yKHN5bSkge1xuICBpZiAoIShzeW0gaW5zdGFuY2VvZiBTeW1ib2wpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5rZXlGb3IgcmVxdWlyZXMgYSBTeW1ib2wgYXJndW1lbnRcIik7XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIGdsb2JhbFN5bWJvbFJlZ2lzdHJ5KSB7XG4gICAgaWYgKGdsb2JhbFN5bWJvbFJlZ2lzdHJ5W2tleV0gPT09IHN5bSkge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdGhpcy5TeW1ib2wgfHwgU3ltYm9sO1xuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBHcmFtbWFyRGVjbCA9IHJlcXVpcmUoXCIuL0dyYW1tYXJEZWNsLmpzXCIpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoXCIuL3BleHBycy5qc1wiKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIEJ1aWxkZXIoKSB7fVxuXG5CdWlsZGVyLnByb3RvdHlwZSA9IHtcbiAgbmV3R3JhbW1hcjogZnVuY3Rpb24obmFtZSwgb3B0TmFtZXNwYWNlTmFtZSkge1xuICAgIHJldHVybiBuZXcgR3JhbW1hckRlY2wobmFtZSwgb3B0TmFtZXNwYWNlTmFtZSk7XG4gIH0sXG5cbiAgYW55dGhpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBwZXhwcnMuYW55dGhpbmc7XG4gIH0sXG5cbiAgZW5kOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcGV4cHJzLmVuZDtcbiAgfSxcblxuICBmYWlsOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcGV4cHJzLmZhaWw7XG4gIH0sXG5cbiAgcHJpbTogZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiBwZXhwcnMubWFrZVByaW0oeCk7XG4gIH0sXG5cbiAgYWx0OiBmdW5jdGlvbigvKiB0ZXJtMSwgdGVybTEsIC4uLiAqLykge1xuICAgIHZhciB0ZXJtcyA9IFtdO1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2lkeF07XG4gICAgICBpZiAoYXJnIGluc3RhbmNlb2YgcGV4cHJzLkFsdCkge1xuICAgICAgICB0ZXJtcyA9IHRlcm1zLmNvbmNhdChhcmcudGVybXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGVybXMucHVzaChhcmcpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGVybXMubGVuZ3RoID09PSAxID8gdGVybXNbMF0gOiBuZXcgcGV4cHJzLkFsdCh0ZXJtcyk7XG4gIH0sXG5cbiAgc2VxOiBmdW5jdGlvbigvKiBmYWN0b3IxLCBmYWN0b3IyLCAuLi4gKi8pIHtcbiAgICB2YXIgZmFjdG9ycyA9IFtdO1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2lkeF07XG4gICAgICBpZiAoYXJnIGluc3RhbmNlb2YgcGV4cHJzLlNlcSkge1xuICAgICAgICBmYWN0b3JzID0gZmFjdG9ycy5jb25jYXQoYXJnLmZhY3RvcnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmFjdG9ycy5wdXNoKGFyZyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWN0b3JzLmxlbmd0aCA9PT0gMSA/IGZhY3RvcnNbMF0gOiBuZXcgcGV4cHJzLlNlcShmYWN0b3JzKTtcbiAgfSxcblxuICBtYW55OiBmdW5jdGlvbihleHByLCBtaW5OdW1NYXRjaGVzKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuTWFueShleHByLCBtaW5OdW1NYXRjaGVzKTtcbiAgfSxcblxuICBvcHQ6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICByZXR1cm4gbmV3IHBleHBycy5PcHQoZXhwcik7XG4gIH0sXG5cbiAgbm90OiBmdW5jdGlvbihleHByKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuTm90KGV4cHIpO1xuICB9LFxuXG4gIGxhOiBmdW5jdGlvbihleHByKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuTG9va2FoZWFkKGV4cHIpO1xuICB9LFxuXG4gIGFycjogZnVuY3Rpb24oZXhwcikge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLkFycihleHByKTtcbiAgfSxcblxuICBvYmo6IGZ1bmN0aW9uKHByb3BlcnRpZXMsIGlzTGVuaWVudCkge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLk9iaihwcm9wZXJ0aWVzLCAhIWlzTGVuaWVudCk7XG4gIH0sXG5cbiAgYXBwOiBmdW5jdGlvbihydWxlTmFtZSwgb3B0RnJvbUludGVydmFsKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuQXBwbHkocnVsZU5hbWUsIG9wdEZyb21JbnRlcnZhbCk7XG4gIH1cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1aWxkZXI7XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgSW5wdXRTdHJlYW0gPSByZXF1aXJlKFwiLi9JbnB1dFN0cmVhbS5qc1wiKTtcbnZhciBJbnRlcnZhbCA9IHJlcXVpcmUoXCIuL0ludGVydmFsLmpzXCIpO1xudmFyIE5vZGUgPSByZXF1aXJlKFwiLi9Ob2RlLmpzXCIpO1xudmFyIFN0YXRlID0gcmVxdWlyZShcIi4vU3RhdGUuanNcIik7XG52YXIgYXR0cmlidXRlcyA9IHJlcXVpcmUoXCIuL2F0dHJpYnV0ZXMuanNcIik7XG52YXIgY29tbW9uID0gcmVxdWlyZShcIi4vY29tbW9uLmpzXCIpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoXCIuL2Vycm9ycy5qc1wiKTtcbnZhciBuYW1lc3BhY2UgPSByZXF1aXJlKFwiLi9uYW1lc3BhY2VzLmpzXCIpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoXCIuL3BleHBycy5qc1wiKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIEdyYW1tYXIobmFtZSwgc3VwZXJHcmFtbWFyLCBydWxlRGljdCkge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbiAgdGhpcy5ydWxlRGljdCA9IHJ1bGVEaWN0O1xuICB0aGlzLmNvbnN0cnVjdG9ycyA9IHRoaXMuY3RvcnMgPSB0aGlzLmNyZWF0ZUNvbnN0cnVjdG9ycygpO1xufVxuXG5HcmFtbWFyLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0OiBmdW5jdGlvbihydWxlTmFtZSwgY2hpbGRyZW4pIHtcbiAgICB2YXIgYm9keSA9IHRoaXMucnVsZURpY3RbcnVsZU5hbWVdO1xuICAgIGlmICghYm9keSB8fCAhYm9keS5jaGVjayh0aGlzLCBjaGlsZHJlbikgfHwgY2hpbGRyZW4ubGVuZ3RoICE9PSBib2R5LmdldEFyaXR5KCkpIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuSW52YWxpZENvbnN0cnVjdG9yQ2FsbCh0aGlzLCBydWxlTmFtZSwgY2hpbGRyZW4pO1xuICAgIH1cbiAgICB2YXIgaW50ZXJ2YWwgPSBuZXcgSW50ZXJ2YWwoSW5wdXRTdHJlYW0ubmV3Rm9yKGNoaWxkcmVuKSwgMCwgY2hpbGRyZW4ubGVuZ3RoKTtcbiAgICByZXR1cm4gbmV3IE5vZGUodGhpcywgcnVsZU5hbWUsIGNoaWxkcmVuLCBpbnRlcnZhbCk7XG4gIH0sXG5cbiAgY3JlYXRlQ29uc3RydWN0b3JzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGNvbnN0cnVjdG9ycyA9IHt9O1xuXG4gICAgZm9yICh2YXIgcnVsZU5hbWUgaW4gdGhpcy5ydWxlRGljdCkge1xuICAgICAgLy8gV2Ugd2FudCAqYWxsKiBwcm9wZXJ0aWVzLCBub3QganVzdCBvd24gcHJvcGVydGllcywgYmVjYXVzZSBvZlxuICAgICAgLy8gc3VwZXJncmFtbWFycy5cblxuICAgICAgLy8gYWxzbyBXT1cgSSBjYW4ndCBiZWxpZXZlIEkgd2FzIGJpdHRlbiBBR0FJTiBieSBKYXZhc2NyaXB0J3NcbiAgICAgIC8vIHNpbGx5IG11dGFibGUgZm9yLWJvdW5kIHZhcmlhYmxlc1xuICAgICAgKGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG5cdGNvbnN0cnVjdG9yc1tydWxlTmFtZV0gPSBmdW5jdGlvbigvKiB2YWwxLCB2YWwyLCAuLi4gKi8pIHtcblx0ICByZXR1cm4gc2VsZi5jb25zdHJ1Y3QocnVsZU5hbWUsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuXHR9O1xuICAgICAgfSkocnVsZU5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gY29uc3RydWN0b3JzO1xuICB9LFxuXG4gIG1hdGNoOiBmdW5jdGlvbihvYmosIHN0YXJ0UnVsZSwgb3B0VGhyb3dPbkZhaWwpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaENvbnRlbnRzKHR5cGVvZiBvYmogPT09IFwic3RyaW5nXCIgPyBvYmogOiBbb2JqXSwgc3RhcnRSdWxlLCBvcHRUaHJvd09uRmFpbCk7XG4gIH0sXG5cbiAgbWF0Y2hDb250ZW50czogZnVuY3Rpb24ob2JqLCBzdGFydFJ1bGUsIG9wdFRocm93T25GYWlsKSB7XG4gICAgdmFyIHRocm93T25GYWlsID0gISFvcHRUaHJvd09uRmFpbDtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBJbnB1dFN0cmVhbS5uZXdGb3Iob2JqKTtcbiAgICB2YXIgc3RhdGUgPSBuZXcgU3RhdGUodGhpcywgaW5wdXRTdHJlYW0pO1xuICAgIHZhciBzdWNjZWVkZWQgPSBuZXcgcGV4cHJzLkFwcGx5KHN0YXJ0UnVsZSkuZXZhbChzdGF0ZSk7XG4gICAgaWYgKHN1Y2NlZWRlZCkge1xuICAgICAgdmFyIG5vZGUgPSBzdGF0ZS5iaW5kaW5nc1swXTtcbiAgICAgIHZhciBzdGFjayA9IFt1bmRlZmluZWRdO1xuICAgICAgdmFyIHNldFBhcmVudHMgPSB0aGlzLnNlbWFudGljQWN0aW9uKHtcbiAgICAgICAgX3Rlcm1pbmFsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aGlzLnBhcmVudCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgICB9LFxuICAgICAgICBfZGVmYXVsdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc3RhY2sucHVzaCh0aGlzKTtcbiAgICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHsgc2V0UGFyZW50cyhjaGlsZCk7IH0pO1xuICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgIHRoaXMucGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc2V0UGFyZW50cyhub2RlKTtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH0gZWxzZSBpZiAodGhyb3dPbkZhaWwpIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuTWF0Y2hGYWlsdXJlKHN0YXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSxcblxuICBzZW1hbnRpY0FjdGlvbjogZnVuY3Rpb24oYWN0aW9uRGljdCkge1xuICAgIHRoaXMuYXNzZXJ0U2VtYW50aWNBY3Rpb25OYW1lc0FuZEFyaXRpZXNNYXRjaChhY3Rpb25EaWN0KTtcbiAgICB2YXIgc2VtYW50aWNBY3Rpb24gPSBhdHRyaWJ1dGVzLm1ha2VTZW1hbnRpY0FjdGlvbihhY3Rpb25EaWN0KTtcbiAgICBzZW1hbnRpY0FjdGlvbi5ncmFtbWFyID0gdGhpcztcbiAgICByZXR1cm4gc2VtYW50aWNBY3Rpb247XG4gIH0sXG5cbiAgc3ludGhlc2l6ZWRBdHRyaWJ1dGU6IGZ1bmN0aW9uKGFjdGlvbkRpY3QpIHtcbiAgICB0aGlzLmFzc2VydFNlbWFudGljQWN0aW9uTmFtZXNBbmRBcml0aWVzTWF0Y2goYWN0aW9uRGljdCk7XG4gICAgdmFyIGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXMubWFrZVN5bnRoZXNpemVkQXR0cmlidXRlKGFjdGlvbkRpY3QpO1xuICAgIGF0dHJpYnV0ZS5ncmFtbWFyID0gdGhpcztcbiAgICByZXR1cm4gYXR0cmlidXRlO1xuICB9LFxuXG4gIGluaGVyaXRlZEF0dHJpYnV0ZTogZnVuY3Rpb24oYWN0aW9uRGljdCkge1xuICAgIHRoaXMuYXNzZXJ0U2VtYW50aWNBY3Rpb25OYW1lc0FuZEFyaXRpZXNNYXRjaChhY3Rpb25EaWN0KTtcbiAgICBpZiAoIWFjdGlvbkRpY3QuX2Jhc2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImluaGVyaXRlZCBhdHRyaWJ1dGUgbWlzc2luZyBiYXNlIGNhc2VcIik7XG4gICAgfSBlbHNlIGlmIChhY3Rpb25EaWN0Ll9iYXNlLmxlbmd0aCAhPT0gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW5oZXJpdGVkIGF0dHJpYnV0ZSdzIGJhc2UgY2FzZSBtdXN0IHRha2UgZXhhY3RseSBvbmUgYXJndW1lbnRcIik7XG4gICAgfVxuICAgIHZhciBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzLm1ha2VJbmhlcml0ZWRBdHRyaWJ1dGUoYWN0aW9uRGljdCk7XG4gICAgYXR0cmlidXRlLmdyYW1tYXIgPSB0aGlzO1xuICAgIHJldHVybiBhdHRyaWJ1dGU7XG4gIH0sXG5cbiAgYXNzZXJ0U2VtYW50aWNBY3Rpb25OYW1lc0FuZEFyaXRpZXNNYXRjaDogZnVuY3Rpb24oYWN0aW9uRGljdCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgcnVsZURpY3QgPSB0aGlzLnJ1bGVEaWN0O1xuICAgIHZhciBvayA9IHRydWU7XG4gICAgT2JqZWN0LmtleXMocnVsZURpY3QpLmZvckVhY2goZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICAgIGlmIChhY3Rpb25EaWN0W3J1bGVOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBhY3R1YWwgPSBhY3Rpb25EaWN0W3J1bGVOYW1lXS5sZW5ndGg7XG4gICAgICB2YXIgZXhwZWN0ZWQgPSBzZWxmLnNlbWFudGljQWN0aW9uQXJpdHkocnVsZU5hbWUpO1xuICAgICAgaWYgKGFjdHVhbCAhPT0gZXhwZWN0ZWQpIHtcbiAgICAgICAgb2sgPSBmYWxzZTtcbiAgICAgICAgY29uc29sZS5sb2coXCJzZW1hbnRpYyBhY3Rpb24gZm9yIHJ1bGVcIiwgcnVsZU5hbWUsIFwiaGFzIHRoZSB3cm9uZyBhcml0eVwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCIgIGV4cGVjdGVkXCIsIGV4cGVjdGVkKTtcbiAgICAgICAgY29uc29sZS5sb2coXCIgICAgYWN0dWFsXCIsIGFjdHVhbCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFvaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwib25lIG9yIG1vcmUgc2VtYW50aWMgYWN0aW9ucyBoYXZlIHRoZSB3cm9uZyBhcml0eSAtLSBzZWUgY29uc29sZSBmb3IgZGV0YWlsc1wiKTtcbiAgICB9XG4gIH0sXG5cbiAgc2VtYW50aWNBY3Rpb25Bcml0eTogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICBpZiAodGhpcy5zdXBlckdyYW1tYXIgJiYgdGhpcy5zdXBlckdyYW1tYXIucnVsZURpY3RbcnVsZU5hbWVdKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdXBlckdyYW1tYXIuc2VtYW50aWNBY3Rpb25Bcml0eShydWxlTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBib2R5ID0gdGhpcy5ydWxlRGljdFtydWxlTmFtZV07XG4gICAgICByZXR1cm4gYm9keS5nZXRBcml0eSgpO1xuICAgIH1cbiAgfSxcblxuICB0b1JlY2lwZTogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMgPT09IG5hbWVzcGFjZShcImRlZmF1bHRcIikuZ3JhbW1hcihcIkdyYW1tYXJcIikpIHtcbiAgICAgIHJldHVybiBcIihmdW5jdGlvbigpIHtcXG5cIiArXG4gICAgICAgICAgXCIgIC8vIG5vIHJlY2lwZSByZXF1aXJlZCBmb3IgR3JhbW1hciBpbiBkZWZhdWx0IG5hbWVzcGFjZSBiL2MgaXQncyBidWlsdCBpblxcblwiICtcbiAgICAgICAgICBcIiAgcmV0dXJuIG5hbWVzcGFjZSgnZGVmYXVsdCcpLmdyYW1tYXIoJ0dyYW1tYXInKTtcXG5cIiArXG4gICAgICAgICAgXCJ9KVwiO1xuICAgIH1cbiAgICB2YXIgc2IgPSBuZXcgY29tbW9uLlN0cmluZ0J1ZmZlcigpO1xuICAgIHNiLmFwcGVuZChcIihmdW5jdGlvbigpIHtcXG5cIik7XG4gICAgc2IuYXBwZW5kKFxuICAgICAgICBcIiAgcmV0dXJuIG5ldyB0aGlzLm5ld0dyYW1tYXIoXCIgKyBjb21tb24udG9TdHJpbmdMaXRlcmFsKHRoaXMubmFtZSkgK1xuICAgICAgICBcIiwgLyogaW4gbmFtZXNwYWNlICovIFwiICsgY29tbW9uLnRvU3RyaW5nTGl0ZXJhbCh0aGlzLm5hbWVzcGFjZU5hbWUpICsgXCIpXFxuXCIpO1xuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hcikge1xuICAgICAgdmFyIHNnID0gdGhpcy5zdXBlckdyYW1tYXI7XG4gICAgICBzYi5hcHBlbmQoXG4gICAgICAgICAgXCIgICAgICAud2l0aFN1cGVyR3JhbW1hcihcIiArIGNvbW1vbi50b1N0cmluZ0xpdGVyYWwoc2cubmFtZSkgK1xuICAgICAgICAgIFwiLCAvKiBmcm9tIG5hbWVzcGFjZSAqLyBcIiArIGNvbW1vbi50b1N0cmluZ0xpdGVyYWwoc2cubmFtZXNwYWNlTmFtZSkgKyBcIilcXG5cIik7XG4gICAgfVxuICAgIHZhciBydWxlTmFtZXMgPSBPYmplY3Qua2V5cyh0aGlzLnJ1bGVEaWN0KTtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBydWxlTmFtZXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgdmFyIHJ1bGVOYW1lID0gcnVsZU5hbWVzW2lkeF07XG4gICAgICB2YXIgYm9keSA9IHRoaXMucnVsZURpY3RbcnVsZU5hbWVdO1xuICAgICAgc2IuYXBwZW5kKFwiICAgICAgLlwiKTtcbiAgICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hciAmJiB0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFtydWxlTmFtZV0pIHtcbiAgICAgICAgc2IuYXBwZW5kKGJvZHkgaW5zdGFuY2VvZiBwZXhwcnMuRXh0ZW5kID8gXCJleHRlbmRcIiA6IFwib3ZlcnJpZGVcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzYi5hcHBlbmQoXCJkZWZpbmVcIik7XG4gICAgICB9XG4gICAgICBzYi5hcHBlbmQoXCIoXCIgKyBjb21tb24udG9TdHJpbmdMaXRlcmFsKHJ1bGVOYW1lKSArIFwiLCBcIik7XG4gICAgICBib2R5Lm91dHB1dFJlY2lwZShzYik7XG4gICAgICBzYi5hcHBlbmQoXCIpXFxuXCIpO1xuICAgIH1cbiAgICBzYi5hcHBlbmQoXCIgICAgICAuaW5zdGFsbCgpO1xcblwiKTtcbiAgICBzYi5hcHBlbmQoXCJ9KTtcIik7XG4gICAgcmV0dXJuIHNiLmNvbnRlbnRzKCk7XG4gIH0sXG5cbiAgLy8gVE9ETzogbWFrZSBzdXJlIHRoaXMgaXMgc3RpbGwgY29ycmVjdC5cbiAgLy8gVE9ETzogdGhlIGFuYWxvZyBvZiB0aGlzIG1ldGhvZCBmb3IgaW5oZXJpdGVkIGF0dHJpYnV0ZXMuXG4gIHRvU2VtYW50aWNBY3Rpb25UZW1wbGF0ZTogZnVuY3Rpb24oLyogZW50cnlQb2ludDEsIGVudHJ5UG9pbnQyLCAuLi4gKi8pIHtcbiAgICB2YXIgZW50cnlQb2ludHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50cyA6IE9iamVjdC5rZXlzKHRoaXMucnVsZURpY3QpO1xuICAgIHZhciBydWxlc1RvQmVJbmNsdWRlZCA9IHRoaXMucnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uKGVudHJ5UG9pbnRzKTtcblxuICAgIC8vIFRPRE86IGFkZCB0aGUgc3VwZXItZ3JhbW1hcidzIHRlbXBsYXRlcyBhdCB0aGUgcmlnaHQgcGxhY2UsIGUuZy4sIGEgY2FzZSBmb3IgQWRkRXhwcl9wbHVzIHNob3VsZCBhcHBlYXIgbmV4dCB0b1xuICAgIC8vIG90aGVyIGNhc2VzIG9mIEFkZEV4cHIuXG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHNiID0gbmV3IGNvbW1vbi5TdHJpbmdCdWZmZXIoKTtcbiAgICBzYi5hcHBlbmQoXCJ7XCIpO1xuXG4gICAgdmFyIGZpcnN0ID0gdHJ1ZTtcbiAgICBmb3IgKHZhciBydWxlTmFtZSBpbiBydWxlc1RvQmVJbmNsdWRlZCkge1xuICAgICAgdmFyIGJvZHkgPSB0aGlzLnJ1bGVEaWN0W3J1bGVOYW1lXTtcbiAgICAgIGlmIChmaXJzdCkge1xuICAgICAgICBmaXJzdCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2IuYXBwZW5kKFwiLFwiKTtcbiAgICAgIH1cbiAgICAgIHNiLmFwcGVuZChcIlxcblwiKTtcbiAgICAgIHNiLmFwcGVuZChcIiAgXCIpO1xuICAgICAgc2VsZi5hZGRTZW1hbnRpY0FjdGlvblRlbXBsYXRlKHJ1bGVOYW1lLCBib2R5LCBzYik7XG4gICAgfVxuXG4gICAgc2IuYXBwZW5kKFwiXFxufVwiKTtcbiAgICByZXR1cm4gc2IuY29udGVudHMoKTtcbiAgfSxcblxuICBhZGRTZW1hbnRpY0FjdGlvblRlbXBsYXRlOiBmdW5jdGlvbihydWxlTmFtZSwgYm9keSwgc2IpIHtcbiAgICBzYi5hcHBlbmQocnVsZU5hbWUpO1xuICAgIHNiLmFwcGVuZChcIjogZnVuY3Rpb24oXCIpO1xuICAgIHZhciBhcml0eSA9IHRoaXMuc2VtYW50aWNBY3Rpb25Bcml0eShydWxlTmFtZSk7XG4gICAgc2IuYXBwZW5kKGNvbW1vbi5yZXBlYXQoXCJfXCIsIGFyaXR5KS5qb2luKFwiLCBcIikpO1xuICAgIHNiLmFwcGVuZChcIikge1xcblwiKTtcbiAgICBzYi5hcHBlbmQoXCIgIH1cIik7XG4gIH0sXG5cbiAgcnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uOiBmdW5jdGlvbihlbnRyeVBvaW50cykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBmdW5jdGlvbiBnZXRCb2R5KHJ1bGVOYW1lKSB7XG4gICAgICBpZiAoc2VsZi5ydWxlRGljdFtydWxlTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgZXJyb3JzLlVuZGVjbGFyZWRSdWxlKHJ1bGVOYW1lLCBzZWxmLm5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNlbGYucnVsZURpY3RbcnVsZU5hbWVdO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBydWxlcyA9IHt9O1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGVudHJ5UG9pbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBydWxlTmFtZSA9IGVudHJ5UG9pbnRzW2lkeF07XG4gICAgICBnZXRCb2R5KHJ1bGVOYW1lKTsgIC8vIHRvIG1ha2Ugc3VyZSB0aGUgcnVsZSBleGlzdHNcbiAgICAgIHJ1bGVzW3J1bGVOYW1lXSA9IHRydWU7XG4gICAgfVxuXG4gICAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgICB3aGlsZSAoIWRvbmUpIHtcbiAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgZm9yICh2YXIgcnVsZU5hbWUgaW4gcnVsZXMpIHtcbiAgICAgICAgdmFyIGFkZGVkTmV3UnVsZSA9IGdldEJvZHkocnVsZU5hbWUpLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbihydWxlcywgdHJ1ZSk7XG4gICAgICAgIGRvbmUgJj0gIWFkZGVkTmV3UnVsZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcnVsZXM7XG4gIH1cbn07XG5cbi8vIEluc3RhbGwgdGhlIGJhc2UgZ3JhbW1hciBpbiB0aGUgZGVmYXVsdCBuYW1lc3BhY2VcblxubmFtZXNwYWNlKFwiZGVmYXVsdFwiKS5pbnN0YWxsKG5ldyBHcmFtbWFyKFxuICAgIFwiR3JhbW1hclwiLFxuICAgIG51bGwsXG4gICAge1xuICAgICAgICBfOiBwZXhwcnMuYW55dGhpbmcsXG4gICAgICAgIGVtcHR5OiBuZXcgcGV4cHJzLlNlcShbXSksXG4gICAgICAgIGZhaWw6IHBleHBycy5mYWlsLFxuICAgICAgICBzcGFjZTogcGV4cHJzLm1ha2VQcmltKC9bXFxzXS8pLndpdGhEZXNjcmlwdGlvbihcInNwYWNlXCIpLFxuICAgICAgICBhbG51bTogcGV4cHJzLm1ha2VQcmltKC9bMC05YS16QS1aXS8pLndpdGhEZXNjcmlwdGlvbihcImFscGhhLW51bWVyaWMgY2hhcmFjdGVyXCIpLFxuICAgICAgICBsZXR0ZXI6IHBleHBycy5tYWtlUHJpbSgvW2EtekEtWl0vKS53aXRoRGVzY3JpcHRpb24oXCJsZXR0ZXJcIiksXG4gICAgICAgIGxvd2VyOiBwZXhwcnMubWFrZVByaW0oL1thLXpdLykud2l0aERlc2NyaXB0aW9uKFwibG93ZXItY2FzZSBsZXR0ZXJcIiksXG4gICAgICAgIHVwcGVyOiBwZXhwcnMubWFrZVByaW0oL1tBLVpdLykud2l0aERlc2NyaXB0aW9uKFwidXBwZXItY2FzZSBsZXR0ZXJcIiksXG4gICAgICAgIGRpZ2l0OiBwZXhwcnMubWFrZVByaW0oL1swLTldLykud2l0aERlc2NyaXB0aW9uKFwiZGlnaXRcIiksXG4gICAgICAgIGhleERpZ2l0OiBwZXhwcnMubWFrZVByaW0oL1swLTlhLWZBLUZdLykud2l0aERlc2NyaXB0aW9uKFwiaGV4YWRlY2ltYWwgZGlnaXRcIiksXG5cbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBydWxlcyBhcmUgcGFydCBvZiB0aGUgaW1wbGVtZW50YXRpb24uXG4gICAgICAgIC8vIFRoZWlyIG5hbWVzIGVuZCB3aXRoICdfJyBzbyB0aGF0IHRoZXkgY2FuJ3QgYmUgb3ZlcnJpZGRlbiBvciBpbnZva2VkIGJ5IHByb2dyYW1tZXJzLlxuICAgICAgICBzcGFjZXNfOiBuZXcgcGV4cHJzLkFsdChbbmV3IHBleHBycy5BcHBseShcInNwYWNlc19yZWNfXCIpLCBuZXcgcGV4cHJzLkFwcGx5KFwiZW1wdHlcIildKSxcbiAgICAgICAgc3BhY2VzX3JlY186IG5ldyBwZXhwcnMuU2VxKFtuZXcgcGV4cHJzLkFwcGx5KFwic3BhY2VcIiksIG5ldyBwZXhwcnMuQXBwbHkoXCJzcGFjZXNfXCIpXSksXG4gICAgfSkpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBHcmFtbWFyO1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIEdyYW1tYXIgPSByZXF1aXJlKFwiLi9HcmFtbWFyLmpzXCIpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoXCIuL2Vycm9ycy5qc1wiKTtcbnZhciBuYW1lc3BhY2UgPSByZXF1aXJlKFwiLi9uYW1lc3BhY2VzLmpzXCIpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoXCIuL3BleHBycy5qc1wiKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgU3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIENvbnN0cnVjdG9yc1xuXG5mdW5jdGlvbiBHcmFtbWFyRGVjbChuYW1lLCBvcHROYW1lc3BhY2VOYW1lKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMubnMgPSBuYW1lc3BhY2Uob3B0TmFtZXNwYWNlTmFtZSB8fCBcImRlZmF1bHRcIik7XG59XG5cbi8vIEhlbHBlcnNcblxuZnVuY3Rpb24gb25PaG1FcnJvcihkb0ZuLCBvbkVycm9yRm4pIHtcbiAgdHJ5IHtcbiAgICBkb0ZuKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoZSBpbnN0YW5jZW9mIGVycm9ycy5FcnJvcikge1xuICAgICAgb25FcnJvckZuKGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfVxufVxuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuZW5zdXJlU3VwZXJHcmFtbWFyID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5zdXBlckdyYW1tYXIpIHtcbiAgICB0aGlzLndpdGhTdXBlckdyYW1tYXIoXCJHcmFtbWFyXCIsIFwiZGVmYXVsdFwiKTtcbiAgfVxuICByZXR1cm4gdGhpcy5zdXBlckdyYW1tYXI7XG59O1xuXG4vLyBTdHVmZiB0aGF0IHlvdSBzaG91bGQgb25seSBkbyBvbmNlXG5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS53aXRoU3VwZXJHcmFtbWFyID0gZnVuY3Rpb24obmFtZSwgb3B0TmFtZXNwYWNlTmFtZSkge1xuICBpZiAodGhpcy5zdXBlckdyYW1tYXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0aGUgc3VwZXIgZ3JhbW1hciBvZiBhIEdyYW1tYXJEZWNsIGNhbm5vdCBiZSBzZXQgbW9yZSB0aGFuIG9uY2VcIik7XG4gIH1cbiAgdGhpcy5zdXBlckdyYW1tYXIgPSAob3B0TmFtZXNwYWNlTmFtZSA/IG5hbWVzcGFjZShvcHROYW1lc3BhY2VOYW1lKSA6IHRoaXMubnMpLmdyYW1tYXIobmFtZSk7XG4gIHRoaXMucnVsZURpY3QgPSBPYmplY3QuY3JlYXRlKHRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVEaWN0KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuaW5zdGFsbCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZ3JhbW1hciA9IG5ldyBHcmFtbWFyKHRoaXMubmFtZSwgdGhpcy5lbnN1cmVTdXBlckdyYW1tYXIoKSwgdGhpcy5ydWxlRGljdCk7XG4gIHZhciBlcnJvcjtcbiAgT2JqZWN0LmtleXMoZ3JhbW1hci5ydWxlRGljdCkuZm9yRWFjaChmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHZhciBib2R5ID0gZ3JhbW1hci5ydWxlRGljdFtydWxlTmFtZV07XG4gICAgZnVuY3Rpb24gaGFuZGxlRXJyb3IoZSkge1xuICAgICAgZXJyb3IgPSBlO1xuICAgICAgY29uc29sZS5lcnJvcihlLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICAvLyBUT0RPOiBjaGFuZ2UgdGhlIHBleHByLnByb3RvdHlwZS5hc3NlcnQuLi4gbWV0aG9kcyB0byBtYWtlIHRoZW0gYWRkIGV4Y2VwdGlvbnMgdG8gYW4gYXJyYXkgdGhhdCdzIHByb3ZpZGVkXG4gICAgLy8gYXMgYW4gYXJnLiBUaGVuIHdlJ2xsIGJlIGFibGUgdG8gc2hvdyBtb3JlIHRoYW4gb25lIGVycm9yIG9mIHRoZSBzYW1lIHR5cGUgYXQgYSB0aW1lLlxuICAgIC8vIFRPRE86IGluY2x1ZGUgdGhlIG9mZmVuZGluZyBwZXhwciBpbiB0aGUgZXJyb3JzLCB0aGF0IHdheSB3ZSBjYW4gc2hvdyB0aGUgcGFydCBvZiB0aGUgc291cmNlIHRoYXQgY2F1c2VkIGl0LlxuICAgIG9uT2htRXJyb3IoZnVuY3Rpb24oKSAgeyBib2R5LmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KHJ1bGVOYW1lKTsgfSwgaGFuZGxlRXJyb3IpO1xuICAgIG9uT2htRXJyb3IoZnVuY3Rpb24oKSAgeyBib2R5LmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKGdyYW1tYXIpOyB9LCAgaGFuZGxlRXJyb3IpO1xuICB9KTtcbiAgaWYgKGVycm9yKSB7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5ucy5pbnN0YWxsKGdyYW1tYXIpO1xuICAgIHJldHVybiBncmFtbWFyO1xuICB9XG59O1xuXG4vLyBSdWxlIGRlY2xhcmF0aW9uc1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuZGVmaW5lID0gZnVuY3Rpb24obmFtZSwgYm9keSwgb3B0RGVzY3IpIHtcbiAgdGhpcy5lbnN1cmVTdXBlckdyYW1tYXIoKTtcbiAgaWYgKG9wdERlc2NyKSB7XG4gICAgYm9keS5kZXNjcmlwdGlvbiA9IG9wdERlc2NyO1xuICB9XG4gIGlmICh0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFtuYW1lXSkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuRHVwbGljYXRlUnVsZURlY2xhcmF0aW9uKG5hbWUsIHRoaXMubmFtZSwgdGhpcy5zdXBlckdyYW1tYXIubmFtZSk7XG4gIH0gZWxzZSBpZiAodGhpcy5ydWxlRGljdFtuYW1lXSkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuRHVwbGljYXRlUnVsZURlY2xhcmF0aW9uKG5hbWUsIHRoaXMubmFtZSwgdGhpcy5uYW1lKTtcbiAgfVxuICB0aGlzLnJ1bGVEaWN0W25hbWVdID0gYm9keTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUub3ZlcnJpZGUgPSBmdW5jdGlvbihuYW1lLCBib2R5KSB7XG4gIHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyKCk7XG4gIGlmICghdGhpcy5zdXBlckdyYW1tYXIucnVsZURpY3RbbmFtZV0pIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLlVuZGVjbGFyZWRSdWxlKG5hbWUsIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUpO1xuICB9XG4gIHRoaXMucnVsZURpY3RbbmFtZV0gPSBib2R5O1xuICByZXR1cm4gdGhpcztcbn07XG5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5leHRlbmQgPSBmdW5jdGlvbihuYW1lLCBib2R5KSB7XG4gIHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyKCk7XG4gIGlmICghdGhpcy5zdXBlckdyYW1tYXIucnVsZURpY3RbbmFtZV0pIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLlVuZGVjbGFyZWRSdWxlKG5hbWUsIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUpO1xuICB9XG4gIHRoaXMucnVsZURpY3RbbmFtZV0gPSBuZXcgcGV4cHJzLkV4dGVuZCh0aGlzLnN1cGVyR3JhbW1hciwgbmFtZSwgYm9keSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gR3JhbW1hckRlY2w7XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcbnZhciBJbnRlcnZhbCA9IHJlcXVpcmUoJy4vSW50ZXJ2YWwuanMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIElucHV0U3RyZWFtKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ0lucHV0U3RyZWFtIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXRcXCdzIGFic3RyYWN0Jyk7XG59XG5cbklucHV0U3RyZWFtLm5ld0ZvciA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbmV3IFN0cmluZ0lucHV0U3RyZWFtKG9iaik7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgcmV0dXJuIG5ldyBMaXN0SW5wdXRTdHJlYW0ob2JqKTtcbiAgfSBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBJbnB1dFN0cmVhbSkge1xuICAgIHJldHVybiBvYmo7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgbWFrZSBpbnB1dCBzdHJlYW0gZm9yICcgKyBvYmopO1xuICB9XG59O1xuXG5JbnB1dFN0cmVhbS5wcm90b3R5cGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMucG9zID0gMDtcbiAgICB0aGlzLnBvc0luZm9zID0gW107XG4gIH0sXG5cbiAgYXRFbmQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyA9PT0gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICB9LFxuXG4gIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmF0RW5kKCkpIHtcbiAgICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuc291cmNlW3RoaXMucG9zKytdO1xuICAgIH1cbiAgfSxcblxuICBtYXRjaEV4YWN0bHk6IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gdGhpcy5uZXh0KCkgPT09IHggPyB0cnVlIDogY29tbW9uLmZhaWw7XG4gIH0sXG5cbiAgc291cmNlU2xpY2U6IGZ1bmN0aW9uKHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnRJZHgsIGVuZElkeCk7XG4gIH0sXG5cbiAgaW50ZXJ2YWxGcm9tOiBmdW5jdGlvbihzdGFydElkeCkge1xuICAgIHJldHVybiBuZXcgSW50ZXJ2YWwodGhpcywgc3RhcnRJZHgsIHRoaXMucG9zKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gU3RyaW5nSW5wdXRTdHJlYW0oc291cmNlKSB7XG4gIHRoaXMuaW5pdChzb3VyY2UpO1xufVxuXG5TdHJpbmdJbnB1dFN0cmVhbS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKElucHV0U3RyZWFtLnByb3RvdHlwZSwge1xuICBtYXRjaFN0cmluZzoge1xuICAgIHZhbHVlOiBmdW5jdGlvbihzKSB7XG4gICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2hFeGFjdGx5KHNbaWR4XSkgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbW1vbi5mYWlsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0sXG5cbiAgbWF0Y2hSZWdFeHA6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oZSkge1xuICAgICAgLy8gSU1QT1JUQU5UOiBlIG11c3QgYmUgYSBub24tZ2xvYmFsLCBvbmUtY2hhcmFjdGVyIGV4cHJlc3Npb24sIGUuZy4sIC8uLyBhbmQgL1swLTldL1xuICAgICAgdmFyIGMgPSB0aGlzLm5leHQoKTtcbiAgICAgIHJldHVybiBjICE9PSBjb21tb24uZmFpbCAmJiBlLnRlc3QoYykgPyB0cnVlIDogY29tbW9uLmZhaWw7XG4gICAgfVxuICB9XG59KTtcblxuZnVuY3Rpb24gTGlzdElucHV0U3RyZWFtKHNvdXJjZSkge1xuICB0aGlzLmluaXQoc291cmNlKTtcbn1cblxuTGlzdElucHV0U3RyZWFtLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSW5wdXRTdHJlYW0ucHJvdG90eXBlLCB7XG4gIG1hdGNoU3RyaW5nOiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKHMpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hdGNoRXhhY3RseShzKTtcbiAgICB9XG4gIH0sXG5cbiAgbWF0Y2hSZWdFeHA6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oZSkge1xuICAgICAgcmV0dXJuIHRoaXMubWF0Y2hFeGFjdGx5KGUpO1xuICAgIH1cbiAgfVxufSk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0U3RyZWFtO1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzLmpzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBJbnRlcnZhbChpbnB1dFN0cmVhbSwgc3RhcnRJZHgsIGVuZElkeCkge1xuICB0aGlzLmlucHV0U3RyZWFtID0gaW5wdXRTdHJlYW07XG4gIHRoaXMuc3RhcnRJZHggPSBzdGFydElkeDtcbiAgdGhpcy5lbmRJZHggPSBlbmRJZHg7XG59XG5cbkludGVydmFsLmNvdmVyYWdlID0gZnVuY3Rpb24oLyogaW50ZXJ2YWwxLCBpbnRlcnZhbDIsIC4uLiAqLykge1xuICB2YXIgaW5wdXRTdHJlYW0gPSBhcmd1bWVudHNbMF0uaW5wdXRTdHJlYW07XG4gIHZhciBzdGFydElkeCA9IGFyZ3VtZW50c1swXS5zdGFydElkeDtcbiAgdmFyIGVuZElkeCA9IGFyZ3VtZW50c1swXS5lbmRJZHg7XG4gIGZvciAodmFyIGlkeCA9IDE7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdmFyIGludGVydmFsID0gYXJndW1lbnRzW2lkeF07XG4gICAgaWYgKGludGVydmFsLmlucHV0U3RyZWFtICE9PSBpbnB1dFN0cmVhbSkge1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5JbnRlcnZhbFNvdXJjZXNEb250TWF0Y2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnRJZHggPSBNYXRoLm1pbihzdGFydElkeCwgYXJndW1lbnRzW2lkeF0uc3RhcnRJZHgpO1xuICAgICAgZW5kSWR4ID0gTWF0aC5tYXgoZW5kSWR4LCBhcmd1bWVudHNbaWR4XS5lbmRJZHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3IEludGVydmFsKGlucHV0U3RyZWFtLCBzdGFydElkeCwgZW5kSWR4KTtcbn1cblxuSW50ZXJ2YWwucHJvdG90eXBlID0ge1xuICBjb3ZlcmFnZVdpdGg6IGZ1bmN0aW9uKC8qIGludGVydmFsMSwgaW50ZXJ2YWwyLCAuLi4gKi8pIHtcbiAgICB2YXIgaW50ZXJ2YWxzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBpbnRlcnZhbHMucHVzaCh0aGlzKTtcbiAgICByZXR1cm4gSW50ZXJ2YWwuY292ZXJhZ2UuYXBwbHkodW5kZWZpbmVkLCBpbnRlcnZhbHMpO1xuICB9LFxuXG4gIGNvbGxhcHNlZExlZnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgSW50ZXJ2YWwodGhpcy5pbnB1dFN0cmVhbSwgdGhpcy5zdGFydElkeCwgdGhpcy5zdGFydElkeCk7XG4gIH0sXG5cbiAgY29sbGFwc2VkUmlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgSW50ZXJ2YWwodGhpcy5pbnB1dFN0cmVhbSwgdGhpcy5lbmRJZHgsIHRoaXMuZW5kSWR4KTtcbiAgfSxcbiAgLy8gUmV0dXJucyBhIG5ldyBJbnRlcnZhbCB3aGljaCBjb250YWlucyB0aGUgc2FtZSBjb250ZW50cyBhcyB0aGlzIG9uZSxcbiAgLy8gYnV0IHdpdGggd2hpdGVzcGFjZSB0cmltbWVkIGZyb20gYm90aCBlbmRzLiAoVGhpcyBvbmx5IG1ha2VzIHNlbnNlIHdoZW5cbiAgLy8gdGhlIGlucHV0IHN0cmVhbSBpcyBhIHN0cmluZy4pXG4gIHRyaW1tZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250ZW50cyA9IHRoaXMuY29udGVudHM7XG4gICAgdmFyIHN0YXJ0SWR4ID0gdGhpcy5zdGFydElkeCArIGNvbnRlbnRzLm1hdGNoKC9eXFxzKi8pWzBdLmxlbmd0aDtcbiAgICB2YXIgZW5kSWR4ID0gdGhpcy5lbmRJZHggLSBjb250ZW50cy5tYXRjaCgvXFxzKiQvKVswXS5sZW5ndGg7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLmlucHV0U3RyZWFtLCBzdGFydElkeCwgZW5kSWR4KTtcbiAgfVxufTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoSW50ZXJ2YWwucHJvdG90eXBlLCB7XG4gIGNvbnRlbnRzOiB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9jb250ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2NvbnRlbnRzID0gdGhpcy5pbnB1dFN0cmVhbS5zb3VyY2VTbGljZSh0aGlzLnN0YXJ0SWR4LCB0aGlzLmVuZElkeCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fY29udGVudHM7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlXG4gIH1cbn0pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcnZhbDtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBJbnRlcnZhbCA9IHJlcXVpcmUoJy4vSW50ZXJ2YWwuanMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIE5vZGUoZ3JhbW1hciwgY3Rvck5hbWUsIGNoaWxkcmVuLCBpbnRlcnZhbCkge1xuICB0aGlzLmludGVydmFsID0gaW50ZXJ2YWw7XG4gIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG4gIHRoaXMuY3Rvck5hbWUgPSBjdG9yTmFtZTtcbiAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xufVxuXG4vLyAqIHByZWQgLT4gY2hpbGRCZWZvcmVcbi8vICogc3VjYyAtPiBjaGlsZEFmdGVyXG5cbk5vZGUucHJvdG90eXBlLm51bUNoaWxkcmVuID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcbn07XG5cbk5vZGUucHJvdG90eXBlLmNoaWxkQXQgPSBmdW5jdGlvbihpZHgpIHtcbiAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baWR4XTtcbn07XG5cbk5vZGUucHJvdG90eXBlLmluZGV4T2ZDaGlsZCA9IGZ1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGFyZyk7XG59O1xuICBcbk5vZGUucHJvdG90eXBlLmhhc0NoaWxkcmVuID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aCA+IDA7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5oYXNOb0NoaWxkcmVuID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAhdGhpcy5oYXNDaGlsZHJlbigpO1xufTtcblxuTm9kZS5wcm90b3R5cGUub25seUNoaWxkID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCAhPT0gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2Nhbm5vdCBnZXQgb25seSBjaGlsZCBvZiBhIG5vZGUgb2YgdHlwZSAnICsgdGhpcy5jdG9yTmFtZSArXG4gICAgICAgICcgKGl0IGhhcyAnICsgdGhpcy5udW1DaGlsZHJlbigpICsgJyBjaGlsZHJlbiknKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5maXJzdENoaWxkKCk7XG4gIH1cbn07XG5cbk5vZGUucHJvdG90eXBlLmZpcnN0Q2hpbGQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuaGFzTm9DaGlsZHJlbigpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZ2V0IGZpcnN0IGNoaWxkIG9mIGEgJyArIHRoaXMuY3Rvck5hbWUgKyAnIG5vZGUsIHdoaWNoIGhhcyBubyBjaGlsZHJlbicpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmNoaWxkQXQoMCk7XG4gIH1cbn07XG4gIFxuTm9kZS5wcm90b3R5cGUubGFzdENoaWxkID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmhhc05vQ2hpbGRyZW4oKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGdldCBsYXN0IGNoaWxkIG9mIGEgJyArIHRoaXMuY3Rvck5hbWUgKyAnIG5vZGUsIHdoaWNoIGhhcyBubyBjaGlsZHJlbicpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmNoaWxkQXQodGhpcy5udW1DaGlsZHJlbigpIC0gMSk7XG4gIH1cbn07XG5cbk5vZGUucHJvdG90eXBlLmNoaWxkQmVmb3JlID0gZnVuY3Rpb24oY2hpbGQpIHtcbiAgdmFyIGNoaWxkSWR4ID0gdGhpcy5pbmRleE9mQ2hpbGQoY2hpbGQpO1xuICBpZiAoY2hpbGRJZHggPCAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlLmNoaWxkQmVmb3JlKCkgY2FsbGVkIHcvIGFuIGFyZ3VtZW50IHRoYXQgaXMgbm90IGEgY2hpbGQnKTtcbiAgfSBlbHNlIGlmIChjaGlsZElkeCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGdldCBjaGlsZCBiZWZvcmUgZmlyc3QgY2hpbGQnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZEF0KGNoaWxkSWR4IC0gMSk7XG4gIH1cbn07XG5cbk5vZGUucHJvdG90eXBlLmNoaWxkQWZ0ZXIgPSBmdW5jdGlvbihjaGlsZCkge1xuICB2YXIgY2hpbGRJZHggPSB0aGlzLmluZGV4T2ZDaGlsZChjaGlsZCk7XG4gIGlmIChjaGlsZElkeCA8IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vZGUuY2hpbGRBZnRlcigpIGNhbGxlZCB3LyBhbiBhcmd1bWVudCB0aGF0IGlzIG5vdCBhIGNoaWxkJyk7XG4gIH0gZWxzZSBpZiAoY2hpbGRJZHggPT09IHRoaXMubnVtQ2hpbGRyZW4oKSAtIDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBnZXQgY2hpbGQgYWZ0ZXIgbGFzdCBjaGlsZCcpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmNoaWxkQXQoY2hpbGRJZHggKyAxKTtcbiAgfVxufTtcblxuTm9kZS5wcm90b3R5cGUuaXNWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5jdG9yTmFtZSA9PT0gJ190ZXJtaW5hbCc7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5pc1ZhbHVlKCkpIHtcbiAgICByZXR1cm4gdGhpcy5maXJzdENoaWxkKCk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZ2V0IHZhbHVlIG9mIGEgbm9uLXRlcm1pbmFsIG5vZGUgKHR5cGUgJyArIHRoaXMuY3Rvck5hbWUgKyAnKScpO1xuICB9XG59O1xuXG5Ob2RlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHIgPSB7fTtcbiAgclt0aGlzLmN0b3JOYW1lXSA9IHRoaXMuY2hpbGRyZW47XG4gIHJldHVybiByO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gTm9kZTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gUG9zSW5mbyhnbG9iYWxSdWxlU3RhY2spIHtcbiAgdGhpcy5nbG9iYWxSdWxlU3RhY2sgPSBnbG9iYWxSdWxlU3RhY2s7XG4gIHRoaXMucnVsZVN0YWNrID0gW107XG4gIHRoaXMuYWN0aXZlUnVsZXMgPSB7fTsgIC8vIHJlZHVuZGFudCAoY291bGQgYmUgZ2VuZXJhdGVkIGZyb20gcnVsZVN0YWNrKSBidXQgdXNlZnVsIGZvciBwZXJmb3JtYW5jZSByZWFzb25zXG4gIHRoaXMubWVtbyA9IHt9O1xufVxuXG5Qb3NJbmZvLnByb3RvdHlwZSA9IHtcbiAgaXNBY3RpdmU6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlUnVsZXNbcnVsZU5hbWVdO1xuICB9LFxuXG4gIGVudGVyOiBmdW5jdGlvbihwZXhwcikge1xuICAgIHRoaXMuZ2xvYmFsUnVsZVN0YWNrLnB1c2gocGV4cHIpO1xuICAgIHRoaXMucnVsZVN0YWNrLnB1c2gocGV4cHIpO1xuICAgIHRoaXMuYWN0aXZlUnVsZXNbcGV4cHIucnVsZU5hbWVdID0gdHJ1ZTtcbiAgfSxcblxuICBleGl0OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGV4cHIgPSB0aGlzLmdsb2JhbFJ1bGVTdGFjay5wb3AoKTtcbiAgICB0aGlzLnJ1bGVTdGFjay5wb3AoKTtcbiAgICB0aGlzLmFjdGl2ZVJ1bGVzW3BleHByLnJ1bGVOYW1lXSA9IGZhbHNlO1xuICB9LFxuXG4gIHNob3VsZFVzZU1lbW9pemVkUmVzdWx0OiBmdW5jdGlvbihtZW1vUmVjKSB7XG4gICAgdmFyIGludm9sdmVkUnVsZXMgPSBtZW1vUmVjLmludm9sdmVkUnVsZXM7XG4gICAgZm9yICh2YXIgcnVsZU5hbWUgaW4gaW52b2x2ZWRSdWxlcykge1xuICAgICAgaWYgKGludm9sdmVkUnVsZXNbcnVsZU5hbWVdICYmIHRoaXMuYWN0aXZlUnVsZXNbcnVsZU5hbWVdKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgZ2V0Q3VycmVudExlZnRSZWN1cnNpb246IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmxlZnRSZWN1cnNpb25TdGFjayA/IHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrW3RoaXMubGVmdFJlY3Vyc2lvblN0YWNrLmxlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuICB9LFxuXG4gIHN0YXJ0TGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICBpZiAoIXRoaXMubGVmdFJlY3Vyc2lvblN0YWNrKSB7XG4gICAgICB0aGlzLmxlZnRSZWN1cnNpb25TdGFjayA9IFtdO1xuICAgIH1cbiAgICB0aGlzLmxlZnRSZWN1cnNpb25TdGFjay5wdXNoKHtuYW1lOiBydWxlTmFtZSwgdmFsdWU6IGZhbHNlLCBwb3M6IC0xLCBpbnZvbHZlZFJ1bGVzOiB7fX0pO1xuICAgIHRoaXMudXBkYXRlSW52b2x2ZWRSdWxlcygpO1xuICB9LFxuXG4gIGVuZExlZnRSZWN1cnNpb246IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2sucG9wKCk7XG4gIH0sXG5cbiAgdXBkYXRlSW52b2x2ZWRSdWxlczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gdGhpcy5nZXRDdXJyZW50TGVmdFJlY3Vyc2lvbigpO1xuICAgIHZhciBpbnZvbHZlZFJ1bGVzID0gY3VycmVudExlZnRSZWN1cnNpb24uaW52b2x2ZWRSdWxlcztcbiAgICB2YXIgbHJSdWxlTmFtZSA9IGN1cnJlbnRMZWZ0UmVjdXJzaW9uLm5hbWU7XG4gICAgdmFyIGlkeCA9IHRoaXMucnVsZVN0YWNrLmxlbmd0aCAtIDE7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHZhciBydWxlTmFtZSA9IHRoaXMucnVsZVN0YWNrW2lkeC0tXS5ydWxlTmFtZTtcbiAgICAgIGlmIChydWxlTmFtZSA9PT0gbHJSdWxlTmFtZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGludm9sdmVkUnVsZXNbcnVsZU5hbWVdID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvc0luZm87XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycy5qcycpO1xudmFyIFBvc0luZm8gPSByZXF1aXJlKCcuL1Bvc0luZm8uanMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIFN0YXRlKGdyYW1tYXIsIGlucHV0U3RyZWFtKSB7XG4gIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG4gIHRoaXMuaW5wdXRTdHJlYW1TdGFjayA9IFtdO1xuICB0aGlzLnBvc0luZm9zU3RhY2sgPSBbXTtcbiAgdGhpcy5wdXNoSW5wdXRTdHJlYW0oaW5wdXRTdHJlYW0pO1xuICB0aGlzLnJ1bGVTdGFjayA9IFtdO1xuICB0aGlzLmJpbmRpbmdzID0gW107XG4gIHRoaXMuZmFpbHVyZURlc2NyaXB0b3IgPSB0aGlzLm1ha2VGYWlsdXJlRGVzY3JpcHRvcigpO1xufVxuXG5TdGF0ZS5wcm90b3R5cGUgPSB7XG4gIHB1c2hJbnB1dFN0cmVhbTogZnVuY3Rpb24oaW5wdXRTdHJlYW0pIHtcbiAgICB0aGlzLmlucHV0U3RyZWFtU3RhY2sucHVzaCh0aGlzLmlucHV0U3RyZWFtKTtcbiAgICB0aGlzLnBvc0luZm9zU3RhY2sucHVzaCh0aGlzLnBvc0luZm9zKTtcbiAgICB0aGlzLmlucHV0U3RyZWFtID0gaW5wdXRTdHJlYW07XG4gICAgdGhpcy5wb3NJbmZvcyA9IFtdO1xuICB9LFxuXG4gIHBvcElucHV0U3RyZWFtOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmlucHV0U3RyZWFtID0gdGhpcy5pbnB1dFN0cmVhbVN0YWNrLnBvcCgpO1xuICAgIHRoaXMucG9zSW5mb3MgPSB0aGlzLnBvc0luZm9zU3RhY2sucG9wKCk7XG4gIH0sXG5cbiAgZ2V0Q3VycmVudFBvc0luZm86IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBvc0luZm8odGhpcy5pbnB1dFN0cmVhbS5wb3MpO1xuICB9LFxuXG4gIGdldFBvc0luZm86IGZ1bmN0aW9uKHBvcykge1xuICAgIHZhciBwb3NJbmZvID0gdGhpcy5wb3NJbmZvc1twb3NdO1xuICAgIHJldHVybiBwb3NJbmZvIHx8ICh0aGlzLnBvc0luZm9zW3Bvc10gPSBuZXcgUG9zSW5mbyh0aGlzLnJ1bGVTdGFjaykpO1xuICB9LFxuXG4gIHJlY29yZEZhaWx1cmU6IGZ1bmN0aW9uKHBvcywgZXhwcikge1xuICAgIGlmIChwb3MgPCB0aGlzLmZhaWx1cmVEZXNjcmlwdG9yLnBvcykge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAocG9zID4gdGhpcy5mYWlsdXJlRGVzY3JpcHRvci5wb3MpIHtcbiAgICAgIHRoaXMuZmFpbHVyZURlc2NyaXB0b3IucG9zID0gcG9zO1xuICAgICAgdGhpcy5mYWlsdXJlRGVzY3JpcHRvci5leHBycyA9IFtdO1xuICAgIH1cbiAgICB0aGlzLmZhaWx1cmVEZXNjcmlwdG9yLmV4cHJzLnB1c2goZXhwcik7XG4gIH0sXG5cbiAgcmVjb3JkRmFpbHVyZXM6IGZ1bmN0aW9uKGZhaWx1cmVEZXNjcmlwdG9yKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGZhaWx1cmVEZXNjcmlwdG9yLmV4cHJzLmZvckVhY2goZnVuY3Rpb24oZXhwcikge1xuICAgICAgc2VsZi5yZWNvcmRGYWlsdXJlKGZhaWx1cmVEZXNjcmlwdG9yLnBvcywgZXhwcik7XG4gICAgfSk7XG4gIH0sXG5cbiAgZ2V0RmFpbHVyZXNQb3M6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmZhaWx1cmVEZXNjcmlwdG9yLnBvcztcbiAgfSxcblxuICBtYWtlRmFpbHVyZURlc2NyaXB0b3I6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7cG9zOiAtMSwgZXhwcnM6IFtdfTtcbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdGU7XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgU3ltYm9sID0gdGhpcy5TeW1ib2wgfHwgcmVxdWlyZSgnc3ltYm9sJyk7XG52YXIgTm9kZSA9IHJlcXVpcmUoJy4vTm9kZScpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGFjdGlvbnMgPSB7XG4gIGdldFZhbHVlOiAgICBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMudmFsdWUoKTsgfSxcbiAgbWFwOiAgICAgICAgIGZ1bmN0aW9uKCkgeyB0aHJvdyBuZXcgRXJyb3IoJ0JVRzogb2htLmFjdGlvbnMubWFwIHNob3VsZCBuZXZlciBiZSBjYWxsZWQnKTsgfSxcbiAgcGFzc1Rocm91Z2g6IGZ1bmN0aW9uKGNoaWxkTm9kZSkgeyB0aHJvdyBuZXcgRXJyb3IoJ0JVRzogb2htLmFjdGlvbnMucGFzc1Rocm91Z2ggc2hvdWxkIG5ldmVyIGJlIGNhbGxlZCcpOyB9XG59O1xuXG5mdW5jdGlvbiBfbWFrZVN5bnRoZXNpemVkQXR0cmlidXRlKGFjdGlvbkRpY3QsIG1lbW9pemUpIHtcbiAgZnVuY3Rpb24gZ2V0KG5vZGUpIHtcbiAgICBpZiAoIShub2RlIGluc3RhbmNlb2YgTm9kZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGFuIE9obSBDU1Qgbm9kZTogJyArIEpTT04uc3RyaW5naWZ5KG5vZGUpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkb0FjdGlvbihhY3Rpb25Gbiwgb3B0RG9udFBhc3NDaGlsZHJlbkFzQW5Bcmd1bWVudCkge1xuICAgICAgaWYgKGFjdGlvbkZuID09PSBhY3Rpb25zLm1hcCkge1xuICAgICAgICBpZiAobm9kZS5jdG9yTmFtZSA9PT0gJ19saXN0Jykge1xuICAgICAgICAgIHJldHVybiBub2RlLmNoaWxkcmVuLm1hcChhdHRyaWJ1dGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndGhlIG1hcCBkZWZhdWx0IGFjdGlvbiBjYW5ub3QgYmUgdXNlZCB3aXRoIGEgJyArIG5vZGUuY3Rvck5hbWUgKyAnIG5vZGUnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChhY3Rpb25GbiA9PT0gYWN0aW9ucy5wYXNzVGhyb3VnaCkge1xuICAgICAgICBpZiAobm9kZS5jdG9yTmFtZSA9PT0gJ19saXN0Jykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndGhlIHBhc3NUaHJvdWdoIGRlZmF1bHQgYWN0aW9uIGNhbm5vdCBiZSB1c2VkIHdpdGggYSBfbGlzdCBub2RlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZShub2RlLm9ubHlDaGlsZCgpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG9wdERvbnRQYXNzQ2hpbGRyZW5Bc0FuQXJndW1lbnQgP1xuICAgICAgICAgICAgYWN0aW9uRm4uYXBwbHkobm9kZSkgOlxuICAgICAgICAgICAgYWN0aW9uRm4uYXBwbHkobm9kZSwgbm9kZS5jaGlsZHJlbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuY3Rvck5hbWUgPT09ICdfbGlzdCcgJiYgbm9kZS5wYXJlbnQpIHtcbiAgICAgIC8vIElmIGFuIGFjdGlvbidzIG5hbWUgaXMgY3Rvck5hbWUkaWR4LCB3aGVyZSBpZHggaXMgdGhlIDEtYmFzZWQgaW5kZXggb2YgYSBjaGlsZCBub2RlIHRoYXQgaGFwcGVuc1xuICAgICAgLy8gdG8gYmUgYSBsaXN0LCBpdCBzaG91bGQgb3ZlcnJpZGUgdGhlIF9saXN0IGFjdGlvbiBmb3IgdGhhdCBwYXJ0aWN1bGFyIGxpc3Qgbm9kZS5cbiAgICAgIHZhciBhY3Rpb25OYW1lID0gbm9kZS5wYXJlbnQuY3Rvck5hbWUgKyAnJCcgKyAobm9kZS5wYXJlbnQuaW5kZXhPZkNoaWxkKG5vZGUpICsgMSk7XG4gICAgICB2YXIgYWN0aW9uRm4gPSBhY3Rpb25EaWN0W2FjdGlvbk5hbWVdO1xuICAgICAgaWYgKGFjdGlvbkZuKSB7XG4gICAgICAgIHJldHVybiBkb0FjdGlvbihhY3Rpb25GbiwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGFjdGlvbkZuID0gYWN0aW9uRGljdFtub2RlLmN0b3JOYW1lXTtcbiAgICBpZiAoYWN0aW9uRm4pIHtcbiAgICAgIHJldHVybiBkb0FjdGlvbihhY3Rpb25Gbik7XG4gICAgfSBlbHNlIGlmIChhY3Rpb25EaWN0Ll9kZWZhdWx0ICYmIG5vZGUuY3Rvck5hbWUgIT09ICdfdGVybWluYWwnKSB7XG4gICAgICByZXR1cm4gZG9BY3Rpb24oYWN0aW9uRGljdC5fZGVmYXVsdCwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWlzc2luZyBtZXRob2QgZm9yICcgKyBub2RlLmN0b3JOYW1lKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYXR0cmlidXRlO1xuICBpZiAobWVtb2l6ZSkge1xuICAgIHZhciBrZXkgPSBTeW1ib2woKTtcbiAgICAvLyBUT0RPOiBhZGQgYmxhY2sgaG9sZSBoZXJlIHRvIGRldGVjdCBjeWNsZXMuXG4gICAgYXR0cmlidXRlID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgaWYgKCEobm9kZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSkge1xuICAgICAgICBub2RlW2tleV0gPSBnZXQobm9kZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbm9kZVtrZXldO1xuICAgIH07XG4gICAgYXR0cmlidXRlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7IHJldHVybiAnW3N5bnRoZXNpemVkIGF0dHJpYnV0ZV0nOyB9O1xuICB9IGVsc2Uge1xuICAgIGF0dHJpYnV0ZSA9IGdldDtcbiAgICBhdHRyaWJ1dGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHsgcmV0dXJuICdbc2VtYW50aWMgYWN0aW9uXSc7IH07XG4gIH1cbiAgcmV0dXJuIGF0dHJpYnV0ZTtcbn1cblxuZnVuY3Rpb24gbWFrZVNlbWFudGljQWN0aW9uKGFjdGlvbkRpY3QpIHtcbiAgcmV0dXJuIF9tYWtlU3ludGhlc2l6ZWRBdHRyaWJ1dGUoYWN0aW9uRGljdCwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBtYWtlU3ludGhlc2l6ZWRBdHRyaWJ1dGUoYWN0aW9uRGljdCkge1xuICByZXR1cm4gX21ha2VTeW50aGVzaXplZEF0dHJpYnV0ZShhY3Rpb25EaWN0LCB0cnVlKTtcbn1cblxuZnVuY3Rpb24gbWFrZUluaGVyaXRlZEF0dHJpYnV0ZShhY3Rpb25EaWN0KSB7XG4gIGZ1bmN0aW9uIGNvbXB1dGUobm9kZSkge1xuICAgIGlmICghKG5vZGUgaW5zdGFuY2VvZiBOb2RlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgYW4gT2htIENTVCBub2RlOiAnICsgSlNPTi5zdHJpbmdpZnkobm9kZSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRvQWN0aW9uKGFjdGlvbk5hbWUsIG9wdEluY2x1ZGVDaGlsZEluZGV4KSB7XG4gICAgICB2YXIgYWN0aW9uRm4gPSBhY3Rpb25EaWN0W2FjdGlvbk5hbWVdO1xuICAgICAgaWYgKGFjdGlvbkZuID09PSBhY3Rpb25zLm1hcCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RoZSBtYXAgZGVmYXVsdCBhY3Rpb24gY2Fubm90IGJlIHVzZWQgaW4gYW4gaW5oZXJpdGVkIGF0dHJpYnV0ZScpO1xuICAgICAgfSBlbHNlIGlmIChhY3Rpb25GbiA9PT0gYWN0aW9ucy5wYXNzVGhyb3VnaCkge1xuICAgICAgICBhdHRyaWJ1dGUuc2V0KGF0dHJpYnV0ZShub2RlLnBhcmVudCkpO1xuICAgICAgICByZXR1cm4gYWN0aW9uTmFtZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChvcHRJbmNsdWRlQ2hpbGRJbmRleCkge1xuICAgICAgICAgIGFjdGlvbkZuLmNhbGwobm9kZS5wYXJlbnQsIG5vZGUsIG5vZGUucGFyZW50LmluZGV4T2ZDaGlsZChub2RlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWN0aW9uRm4uY2FsbChub2RlLnBhcmVudCwgbm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjdGlvbk5hbWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFub2RlLnBhcmVudCkge1xuICAgICAgaWYgKGFjdGlvbkRpY3QuX2Jhc2UpIHtcbiAgICAgICAgcmV0dXJuIGRvQWN0aW9uKCdfYmFzZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtaXNzaW5nIF9iYXNlIGFjdGlvbicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAobm9kZS5wYXJlbnQuY3Rvck5hbWUgPT09ICdfbGlzdCcpIHtcbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgYW4gYWN0aW9uIGNhbGxlZCA8Y3Rvck5hbWU+JDxpZHg+JGVhY2gsIHdoZXJlIDxpZHg+IGlzIHRoZSAxLWJhc2VkIGluZGV4IG9mIGEgY2hpbGQgbm9kZVxuICAgICAgICAvLyB0aGF0IGhhcHBlbnMgdG8gYmUgYSBsaXN0LCBpdCBzaG91bGQgb3ZlcnJpZGUgdGhlIF9saXN0IG1ldGhvZCBmb3IgdGhhdCBwYXJ0aWN1bGFyIGxpc3Qgbm9kZS5cbiAgICAgICAgdmFyIGdyYW5kcGFyZW50ID0gbm9kZS5wYXJlbnQucGFyZW50O1xuICAgICAgICB2YXIgYWN0aW9uTmFtZSA9IGdyYW5kcGFyZW50LmN0b3JOYW1lICsgJyQnICsgKGdyYW5kcGFyZW50LmluZGV4T2ZDaGlsZChub2RlLnBhcmVudCkgKyAxKSArICckZWFjaCc7XG4gICAgICAgIGlmIChhY3Rpb25EaWN0W2FjdGlvbk5hbWVdKSB7XG4gICAgICAgICAgcmV0dXJuIGRvQWN0aW9uKGFjdGlvbk5hbWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbkRpY3QuX2xpc3QpIHtcbiAgICAgICAgICBhY3Rpb25EaWN0Ll9saXN0LmNhbGwobm9kZS5wYXJlbnQsIG5vZGUsIG5vZGUucGFyZW50LmluZGV4T2ZDaGlsZChub2RlKSk7XG4gICAgICAgICAgcmV0dXJuICdfbGlzdCc7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uRGljdC5fZGVmYXVsdCkge1xuICAgICAgICAgIHJldHVybiBkb0FjdGlvbignX2RlZmF1bHQnLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21pc3NpbmcgJyArIGFjdGlvbk5hbWUgKyAnLCBfbGlzdCwgb3IgX2RlZmF1bHQgbWV0aG9kJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBhY3Rpb25OYW1lID0gbm9kZS5wYXJlbnQuY3Rvck5hbWUgKyAnJCcgKyAobm9kZS5wYXJlbnQuaW5kZXhPZkNoaWxkKG5vZGUpICsgMSk7XG4gICAgICAgIGlmIChhY3Rpb25EaWN0W2FjdGlvbk5hbWVdKSB7XG4gICAgICAgICAgcmV0dXJuIGRvQWN0aW9uKGFjdGlvbk5hbWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbkRpY3QuX2RlZmF1bHQpIHtcbiAgICAgICAgICByZXR1cm4gZG9BY3Rpb24oJ19kZWZhdWx0JywgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtaXNzaW5nICcgKyBhY3Rpb25OYW1lICsgJyBvciBfZGVmYXVsdCBtZXRob2QnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICB2YXIga2V5ID0gU3ltYm9sKCk7XG4gIHZhciBjdXJyZW50Q2hpbGRTdGFjayA9IFtdO1xuICB2YXIgYXR0cmlidXRlID0gZnVuY3Rpb24obm9kZSkge1xuICAgIGlmICghbm9kZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjdXJyZW50Q2hpbGRTdGFjay5wdXNoKG5vZGUpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBjb21wdXRlKG5vZGUpO1xuICAgICAgICBpZiAoIW5vZGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbWV0aG9kICcgKyBtZXRob2ROYW1lICsgJyBkaWQgbm90IHNldCBhIHZhbHVlIGZvciBhIGNoaWxkIG5vZGUgb2YgdHlwZSAnICsgbm9kZS5jdG9yTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGN1cnJlbnRDaGlsZFN0YWNrLnBvcCgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZVtrZXldO1xuICB9O1xuICBhdHRyaWJ1dGUuc2V0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgbm9kZSA9IGN1cnJlbnRDaGlsZFN0YWNrW2N1cnJlbnRDaGlsZFN0YWNrLmxlbmd0aCAtIDFdO1xuICAgIGlmIChub2RlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndGhlIHZhbHVlIG9mIGFuIGluaGVyaXRlZCBhdHRyaWJ1dGUgY2Fubm90IGJlIHNldCBtb3JlIHRoYW4gb25jZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH07XG4gIGF0dHJpYnV0ZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gJ1tpbmhlcml0ZWQgYXR0cmlidXRlXSc7IH07XG4gIHJldHVybiBhdHRyaWJ1dGU7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLm1ha2VTZW1hbnRpY0FjdGlvbiA9IG1ha2VTZW1hbnRpY0FjdGlvbjtcbmV4cG9ydHMubWFrZVN5bnRoZXNpemVkQXR0cmlidXRlID0gbWFrZVN5bnRoZXNpemVkQXR0cmlidXRlO1xuZXhwb3J0cy5tYWtlSW5oZXJpdGVkQXR0cmlidXRlID0gbWFrZUluaGVyaXRlZEF0dHJpYnV0ZTtcbmV4cG9ydHMuYWN0aW9ucyA9IGFjdGlvbnM7XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIFN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgdGhpc01vZHVsZSA9IGV4cG9ydHM7XG5cbi8vIEhlbHBlcnNcblxuZnVuY3Rpb24gcGFkKG51bWJlckFzU3RyaW5nLCBsZW4pIHtcbiAgdmFyIHplcm9zID0gW107XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IG51bWJlckFzU3RyaW5nLmxlbmd0aCAtIGxlbjsgaWR4KyspIHtcbiAgICB6ZXJvcy5wdXNoKFwiMFwiKTtcbiAgfVxuICByZXR1cm4gemVyb3Muam9pbihcIlwiKSArIG51bWJlckFzU3RyaW5nO1xufVxuXG52YXIgZXNjYXBlU3RyaW5nRm9yID0ge307XG5mb3IgKHZhciBjID0gMDsgYyA8IDEyODsgYysrKSB7XG4gIGVzY2FwZVN0cmluZ0ZvcltjXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYyk7XG59XG5lc2NhcGVTdHJpbmdGb3JbXCInXCIuY2hhckNvZGVBdCgwKV0gID0gXCJcXFxcJ1wiO1xuZXNjYXBlU3RyaW5nRm9yWydcIicuY2hhckNvZGVBdCgwKV0gID0gJ1xcXFxcIic7XG5lc2NhcGVTdHJpbmdGb3JbXCJcXFxcXCIuY2hhckNvZGVBdCgwKV0gPSBcIlxcXFxcXFxcXCI7XG5lc2NhcGVTdHJpbmdGb3JbXCJcXGJcIi5jaGFyQ29kZUF0KDApXSA9IFwiXFxcXGJcIjtcbmVzY2FwZVN0cmluZ0ZvcltcIlxcZlwiLmNoYXJDb2RlQXQoMCldID0gXCJcXFxcZlwiO1xuZXNjYXBlU3RyaW5nRm9yW1wiXFxuXCIuY2hhckNvZGVBdCgwKV0gPSBcIlxcXFxuXCI7XG5lc2NhcGVTdHJpbmdGb3JbXCJcXHJcIi5jaGFyQ29kZUF0KDApXSA9IFwiXFxcXHJcIjtcbmVzY2FwZVN0cmluZ0ZvcltcIlxcdFwiLmNoYXJDb2RlQXQoMCldID0gXCJcXFxcdFwiO1xuZXNjYXBlU3RyaW5nRm9yW1wiXFx2XCIuY2hhckNvZGVBdCgwKV0gPSBcIlxcXFx2XCI7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLmFic3RyYWN0ID0gZnVuY3Rpb24oKSB7XG4gIHRocm93IG5ldyBFcnJvcihcInRoaXMgbWV0aG9kIGlzIGFic3RyYWN0IVwiKTtcbn07XG5cbmV4cG9ydHMucmVwZWF0Rm4gPSBmdW5jdGlvbihmbiwgbikge1xuICB2YXIgYXJyID0gW107XG4gIHdoaWxlIChuLS0gPiAwKSB7XG4gICAgYXJyLnB1c2goZm4oKSk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn07XG5cbmV4cG9ydHMucmVwZWF0ID0gZnVuY3Rpb24oeCwgbikge1xuICByZXR1cm4gZXhwb3J0cy5yZXBlYXRGbihmdW5jdGlvbigpIHsgcmV0dXJuIHg7IH0sIG4pO1xufTtcblxuZXhwb3J0cy5nZXREdXBsaWNhdGVzID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgdmFyIGR1cGxpY2F0ZXMgPSBbXTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJyYXkubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciB4ID0gYXJyYXlbaWR4XTtcbiAgICBpZiAoYXJyYXkubGFzdEluZGV4T2YoeCkgIT09IGlkeCAmJiBkdXBsaWNhdGVzLmluZGV4T2YoeCkgPCAwKSB7XG4gICAgICBkdXBsaWNhdGVzLnB1c2goeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkdXBsaWNhdGVzO1xufTtcblxuZXhwb3J0cy5mYWlsID0ge307XG5cbmV4cG9ydHMuaXNTeW50YWN0aWMgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB2YXIgZmlyc3RDaGFyID0gcnVsZU5hbWVbMF07XG4gIHJldHVybiBcIkFcIiA8PSBmaXJzdENoYXIgJiYgZmlyc3RDaGFyIDw9IFwiWlwiO1xufTtcblxuLy8gU3RyaW5nQnVmZmVyXG5cbmV4cG9ydHMuU3RyaW5nQnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3RyaW5ncyA9IFtdO1xufTtcblxuZXhwb3J0cy5TdHJpbmdCdWZmZXIucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKHN0cikge1xuICB0aGlzLnN0cmluZ3MucHVzaChzdHIpO1xufTtcblxuZXhwb3J0cy5TdHJpbmdCdWZmZXIucHJvdG90eXBlLmNvbnRlbnRzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnN0cmluZ3Muam9pbihcIlwiKTtcbn07XG5cbi8vIENoYXJhY3RlciBlc2NhcGluZyBhbmQgdW5lc2NhcGluZ1xuXG5leHBvcnRzLmVzY2FwZUNoYXIgPSBmdW5jdGlvbihjLCBvcHREZWxpbSkge1xuICB2YXIgY2hhckNvZGUgPSBjLmNoYXJDb2RlQXQoMCk7XG4gIGlmICgoYyA9PSAnXCInIHx8IGMgPT0gXCInXCIpICYmIG9wdERlbGltICYmIGMgIT09IG9wdERlbGltKSB7XG4gICAgcmV0dXJuIGM7XG4gIH0gZWxzZSBpZiAoY2hhckNvZGUgPCAxMjgpIHtcbiAgICByZXR1cm4gZXNjYXBlU3RyaW5nRm9yW2NoYXJDb2RlXTtcbiAgfSBlbHNlIGlmICgxMjggPD0gY2hhckNvZGUgJiYgY2hhckNvZGUgPCAyNTYpIHtcbiAgICByZXR1cm4gXCJcXFxceFwiICsgcGFkKGNoYXJDb2RlLnRvU3RyaW5nKDE2KSwgMik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwiXFxcXHVcIiArIHBhZChjaGFyQ29kZS50b1N0cmluZygxNiksIDQpO1xuICB9XG59O1xuXG5leHBvcnRzLnVuZXNjYXBlQ2hhciA9IGZ1bmN0aW9uKHMpIHtcbiAgaWYgKHMuY2hhckF0KDApID09ICdcXFxcJykge1xuICAgIHN3aXRjaCAocy5jaGFyQXQoMSkpIHtcbiAgICAgIGNhc2UgXCJiXCI6ICByZXR1cm4gXCJcXGJcIjtcbiAgICAgIGNhc2UgXCJmXCI6ICByZXR1cm4gXCJcXGZcIjtcbiAgICAgIGNhc2UgXCJuXCI6ICByZXR1cm4gXCJcXG5cIjtcbiAgICAgIGNhc2UgXCJyXCI6ICByZXR1cm4gXCJcXHJcIjtcbiAgICAgIGNhc2UgXCJ0XCI6ICByZXR1cm4gXCJcXHRcIjtcbiAgICAgIGNhc2UgXCJ2XCI6ICByZXR1cm4gXCJcXHZcIjtcbiAgICAgIGNhc2UgXCJ4XCI6ICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChzLnN1YnN0cmluZygyLCA0KSwgMTYpKTtcbiAgICAgIGNhc2UgXCJ1XCI6ICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChzLnN1YnN0cmluZygyLCA2KSwgMTYpKTtcbiAgICAgIGRlZmF1bHQ6ICAgcmV0dXJuIHMuY2hhckF0KDEpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcztcbiAgfVxufTtcblxuLy8gUHJldHR5LXByaW50aW5nIG9mIHN0cmluZ3NcblxuZXhwb3J0cy50b1N0cmluZ0xpdGVyYWwgPSBmdW5jdGlvbihzdHIpIHtcbiAgaWYgKHR5cGVvZiBzdHIgIT09IFwic3RyaW5nXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0b1N0cmluZ0xpdGVyYWwgb25seSB3b3JrcyBvbiBzdHJpbmdzXCIpO1xuICB9XG4gIHZhciBoYXNTaW5nbGVRdW90ZXMgPSBzdHIuaW5kZXhPZihcIidcIikgPj0gMDtcbiAgdmFyIGhhc0RvdWJsZVF1b3RlcyA9IHN0ci5pbmRleE9mKCdcIicpID49IDA7XG4gIHZhciBkZWxpbSA9IGhhc1NpbmdsZVF1b3RlcyAmJiAhaGFzRG91YmxlUXVvdGVzID8gJ1wiJyA6IFwiJ1wiO1xuICB2YXIgc2IgPSBuZXcgdGhpc01vZHVsZS5TdHJpbmdCdWZmZXIoKTtcbiAgc2IuYXBwZW5kKGRlbGltKTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgc3RyLmxlbmd0aDsgaWR4KyspIHtcbiAgICBzYi5hcHBlbmQodGhpc01vZHVsZS5lc2NhcGVDaGFyKHN0cltpZHhdLCBkZWxpbSkpO1xuICB9XG4gIHNiLmFwcGVuZChkZWxpbSk7XG4gIHJldHVybiBzYi5jb250ZW50cygpO1xufTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKFwiLi9jb21tb24uanNcIik7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBPaG1FcnJvcigpIHt9XG5PaG1FcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIG1ha2VDdXN0b21FcnJvcihuYW1lLCBpbml0Rm4pIHtcbiAgLy8gTWFrZSBFIHRoaW5rIGl0J3MgcmVhbGx5IGNhbGxlZCBPaG1FcnJvciwgc28gdGhhdCBlcnJvcnMgbG9vayBuaWNlciB3aGVuIHRoZXkncmUgY29uc29sZS5sb2cnZWQgaW4gQ2hyb21lLlxuICB2YXIgRSA9XG4gICAgICBmdW5jdGlvbiBPaG1FcnJvcigpIHsgIFxuICAgICAgICBpbml0Rm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IodGhpcy5tZXNzYWdlKTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwic3RhY2tcIiwgeyBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gZS5zdGFjazsgfSB9KTtcbiAgICAgIH07XG4gIEUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShPaG1FcnJvci5wcm90b3R5cGUpO1xuICBFLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEU7XG4gIEUucHJvdG90eXBlLm5hbWUgPSBuYW1lO1xuICByZXR1cm4gRTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gZXJyb3JzIGFib3V0IGludGVydmFscyAtLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgSW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoID0gbWFrZUN1c3RvbUVycm9yKFxuICAgIFwib2htLmVycm9yLkludGVydmFsU291cmNlc0RvbnRNYXRjaFwiLFxuICAgIGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5tZXNzYWdlID0gXCJpbnRlcnZhbCBzb3VyY2VzIGRvbid0IG1hdGNoXCI7XG4gICAgfVxuKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gZXJyb3JzIGFib3V0IGdyYW1tYXJzIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFVuZGVjbGFyZWQgZ3JhbW1hclxuXG52YXIgVW5kZWNsYXJlZEdyYW1tYXIgPSBtYWtlQ3VzdG9tRXJyb3IoXG4gICAgXCJvaG0uZXJyb3IuVW5kZWNsYXJlZEdyYW1tYXJcIixcbiAgICBmdW5jdGlvbihncmFtbWFyTmFtZSwgbmFtZXNwYWNlTmFtZSkge1xuICAgICAgdGhpcy5ncmFtbWFyTmFtZSA9IGdyYW1tYXJOYW1lO1xuICAgICAgdGhpcy5uYW1lc3BhY2VOYW1lID0gbmFtZXNwYWNlTmFtZTtcbiAgICAgIHRoaXMubWVzc2FnZSA9IHRoaXMubmFtZXNwYWNlTmFtZSA9PT0gXCJkZWZhdWx0XCIgP1xuICAgICAgICAgIFwidW5kZWNsYXJlZCBncmFtbWFyIFwiICsgdGhpcy5ncmFtbWFyTmFtZSA6XG4gICAgICAgICAgXCJncmFtbWFyIFwiICsgdGhpcy5ncmFtbWFyTmFtZSArIFwiIGlzIG5vdCBkZWNsYXJlZCBpbiBuYW1lc3BhY2UgXCIgKyB0aGlzLm5hbWVzcGFjZU5hbWU7XG4gICAgfVxuKTtcblxuLy8gRHVwbGljYXRlIGdyYW1tYXIgZGVjbGFyYXRpb25cblxudmFyIER1cGxpY2F0ZUdyYW1tYXJEZWNsYXJhdGlvbiA9IG1ha2VDdXN0b21FcnJvcihcbiAgICBcIm9obS5lcnJvci5EdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb25cIixcbiAgICBmdW5jdGlvbihncmFtbWFyTmFtZSwgbmFtZXNwYWNlTmFtZSkge1xuICAgICAgdGhpcy5ncmFtbWFyTmFtZSA9IGdyYW1tYXJOYW1lO1xuICAgICAgdGhpcy5uYW1lc3BhY2VOYW1lID0gbmFtZXNwYWNlTmFtZTtcbiAgICAgIHRoaXMubWVzc2FnZSA9IFwiZ3JhbW1hciBcIiArIHRoaXMuZ3JhbW1hck5hbWUgKyBcIiBpcyBhbHJlYWR5IGRlY2xhcmVkIGluIG5hbWVzcGFjZSBcIiArIHRoaXMubmFtZXNwYWNlTmFtZTtcbiAgICB9XG4pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBydWxlcyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBVbmRlY2xhcmVkIHJ1bGVcblxudmFyIFVuZGVjbGFyZWRSdWxlID0gbWFrZUN1c3RvbUVycm9yKFxuICAgIFwib2htLmVycm9yLlVuZGVjbGFyZWRSdWxlXCIsXG4gICAgZnVuY3Rpb24ocnVsZU5hbWUsIG9wdEdyYW1tYXJOYW1lKSB7XG4gICAgICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWU7XG4gICAgICB0aGlzLmdyYW1tYXJOYW1lID0gb3B0R3JhbW1hck5hbWU7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSB0aGlzLmdyYW1tYXJOYW1lID9cbiAgICAgICAgICBcInJ1bGUgXCIgKyB0aGlzLnJ1bGVOYW1lICsgXCIgaXMgbm90IGRlY2xhcmVkIGluIGdyYW1tYXIgXCIgKyB0aGlzLmdyYW1tYXJOYW1lIDpcbiAgICAgICAgICBcInVuZGVjbGFyZWQgcnVsZSBcIiArIHRoaXMucnVsZU5hbWU7XG4gICAgfVxuKTtcblxuLy8gRHVwbGljYXRlIHJ1bGUgZGVjbGFyYXRpb25cblxudmFyIER1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbiA9IG1ha2VDdXN0b21FcnJvcihcbiAgICBcIm9obS5lcnJvci5EdXBsaWNhdGVSdWxlRGVjbGFyYXRpb25cIixcbiAgICBmdW5jdGlvbihydWxlTmFtZSwgb2ZmZW5kaW5nR3JhbW1hck5hbWUsIGRlY2xHcmFtbWFyTmFtZSkge1xuICAgICAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lO1xuICAgICAgdGhpcy5vZmZlbmRpbmdHcmFtbWFyTmFtZSA9IG9mZmVuZGluZ0dyYW1tYXJOYW1lO1xuICAgICAgdGhpcy5kZWNsR3JhbW1hck5hbWUgPSBkZWNsR3JhbW1hck5hbWU7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSBcImR1cGxpY2F0ZSBkZWNsYXJhdGlvbiBmb3IgcnVsZSBcIiArIHRoaXMucnVsZU5hbWUgKyBcIiBpbiBncmFtbWFyIFwiICsgdGhpcy5vZmZlbmRpbmdHcmFtbWFyTmFtZTtcbiAgICAgIGlmICh0aGlzLm9mZmVuZGluZ0dyYW1tYXJOYW1lICE9PSBkZWNsR3JhbW1hck5hbWUpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlICs9IFwiIChpdCB3YXMgb3JpZ2luYWxseSBkZWNsYXJlZCBpbiBncmFtbWFyIFwiICsgdGhpcy5kZWNsR3JhbW1hck5hbWUgKyBcIilcIjtcbiAgICAgIH1cbiAgICB9XG4pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBhcml0eSAtLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBJbmNvbnNpc3RlbnQgYXJpdHlcblxudmFyIEluY29uc2lzdGVudEFyaXR5ID0gbWFrZUN1c3RvbUVycm9yKFxuICAgIFwib2htLmVycm9yLkluY29uc2lzdGVudEFyaXR5XCIsXG4gICAgZnVuY3Rpb24ocnVsZU5hbWUsIGV4cGVjdGVkLCBhY3R1YWwpIHtcbiAgICAgIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgICAgIHRoaXMuZXhwZWN0ZWQgPSBleHBlY3RlZDtcbiAgICAgIHRoaXMuYWN0dWFsID0gYWN0dWFsO1xuICAgICAgdGhpcy5tZXNzYWdlID1cbiAgICAgICAgICBcInJ1bGUgXCIgKyB0aGlzLnJ1bGVOYW1lICsgXCIgaW52b2x2ZXMgYW4gYWx0ZXJuYXRpb24gd2hpY2ggaGFzIGluY29uc2lzdGVudCBhcml0eSBcIiArXG4gICAgICAgICAgXCIoZXhwZWN0ZWQgXCIgKyB0aGlzLmV4cGVjdGVkICsgXCIsIGdvdCBcIiArIHRoaXMuYWN0dWFsICsgXCIpXCI7XG4gICAgfVxuKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gcHJvcGVydGllcyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBEdXBsaWNhdGUgcHJvcGVydHkgbmFtZXNcblxudmFyIER1cGxpY2F0ZVByb3BlcnR5TmFtZXMgPSBtYWtlQ3VzdG9tRXJyb3IoXG4gICAgXCJvaG0uZXJyb3IuRHVwbGljYXRlUHJvcGVydHlOYW1lc1wiLFxuICAgIGZ1bmN0aW9uKGR1cGxpY2F0ZXMpIHtcbiAgICAgIHRoaXMuZHVwbGljYXRlcyA9IGR1cGxpY2F0ZXM7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSBcIm9iamVjdCBwYXR0ZXJuIGhhcyBkdXBsaWNhdGUgcHJvcGVydHkgbmFtZXM6IFwiICsgdGhpcy5kdXBsaWNhdGVzLmpvaW4oXCIsIFwiKTtcbiAgICB9XG4pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBzeW50YXggLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIE1hdGNoRmFpbHVyZSA9IG1ha2VDdXN0b21FcnJvcihcbiAgICBcIm9obS5lcnJvci5NYXRjaEZhaWx1cmVcIixcbiAgICBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwibWVzc2FnZVwiLCB7XG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldE1lc3NhZ2UoKTtcbiAgICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4pO1xuXG5NYXRjaEZhaWx1cmUucHJvdG90eXBlLmdldFNob3J0TWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodHlwZW9mIHRoaXMuc3RhdGUuaW5wdXRTdHJlYW0uc291cmNlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIFwibWF0Y2ggZmFpbGVkIGF0IHBvc2l0aW9uIFwiICsgdGhpcy5nZXRQb3MoKTtcbiAgfVxuXG4gIHZhciBlcnJvckluZm8gPSB0b0Vycm9ySW5mbyh0aGlzLmdldFBvcygpLCB0aGlzLnN0YXRlLmlucHV0U3RyZWFtLnNvdXJjZSk7XG4gIHJldHVybiBcIkxpbmUgXCIgKyBlcnJvckluZm8ubGluZU51bSArIFwiLCBjb2wgXCIgKyBlcnJvckluZm8uY29sTnVtICsgXCI6IGV4cGVjdGVkIFwiICsgdGhpcy5nZXRFeHBlY3RlZFRleHQoKTtcbn07XG5cbk1hdGNoRmFpbHVyZS5wcm90b3R5cGUuZ2V0TWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodHlwZW9mIHRoaXMuc3RhdGUuaW5wdXRTdHJlYW0uc291cmNlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIFwibWF0Y2ggZmFpbGVkIGF0IHBvc2l0aW9uIFwiICsgdGhpcy5nZXRQb3MoKTtcbiAgfVxuXG4gIHZhciBlcnJvckluZm8gPSB0b0Vycm9ySW5mbyh0aGlzLmdldFBvcygpLCB0aGlzLnN0YXRlLmlucHV0U3RyZWFtLnNvdXJjZSk7XG4gIHZhciBzYiA9IG5ldyBjb21tb24uU3RyaW5nQnVmZmVyKCk7XG4gIHZhciBsaW5lQW5kQ29sVGV4dCA9IFwiTGluZSBcIiArIGVycm9ySW5mby5saW5lTnVtICsgXCIsIGNvbCBcIiArIGVycm9ySW5mby5jb2xOdW0gKyBcIjogXCI7XG4gIHNiLmFwcGVuZChsaW5lQW5kQ29sVGV4dCArIGVycm9ySW5mby5saW5lICsgXCJcXG5cIik7XG4gIGZvciAodmFyIGlkeCA9IDE7IGlkeCA8IGxpbmVBbmRDb2xUZXh0Lmxlbmd0aCArIGVycm9ySW5mby5jb2xOdW07IGlkeCsrKSB7XG4gICAgc2IuYXBwZW5kKFwiIFwiKTtcbiAgfVxuICBzYi5hcHBlbmQoXCJeXFxuXCIpO1xuICBzYi5hcHBlbmQoXCJFeHBlY3RlZCBcIiArIHRoaXMuZ2V0RXhwZWN0ZWRUZXh0KCkpO1xuICByZXR1cm4gc2IuY29udGVudHMoKTtcbn07XG5cbk1hdGNoRmFpbHVyZS5wcm90b3R5cGUuZ2V0UG9zID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnN0YXRlLmdldEZhaWx1cmVzUG9zKCk7XG59O1xuXG5NYXRjaEZhaWx1cmUucHJvdG90eXBlLmdldEV4cGVjdGVkVGV4dCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2IgPSBuZXcgY29tbW9uLlN0cmluZ0J1ZmZlcigpO1xuICB2YXIgZXhwZWN0ZWQgPSB0aGlzLmdldEV4cGVjdGVkKCk7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGV4cGVjdGVkLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAoaWR4ID4gMCkge1xuICAgICAgaWYgKGlkeCA9PT0gZXhwZWN0ZWQubGVuZ3RoIC0gMSkge1xuICAgICAgICBzYi5hcHBlbmQoZXhwZWN0ZWQubGVuZ3RoID4gMiA/IFwiLCBvciBcIiA6IFwiIG9yIFwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNiLmFwcGVuZChcIiwgXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBzYi5hcHBlbmQoZXhwZWN0ZWRbaWR4XSk7XG4gIH1cbiAgcmV0dXJuIHNiLmNvbnRlbnRzKCk7XG59O1xuXG5NYXRjaEZhaWx1cmUucHJvdG90eXBlLmdldEV4cGVjdGVkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGV4cGVjdGVkID0ge307XG4gIHRoaXMuc3RhdGUuZmFpbHVyZURlc2NyaXB0b3IuZXhwcnMuZm9yRWFjaChmdW5jdGlvbihleHByKSB7XG4gICAgZXhwZWN0ZWRbZXhwci50b0V4cGVjdGVkKHNlbGYuc3RhdGUuZ3JhbW1hci5ydWxlRGljdCldID0gdHJ1ZTtcbiAgfSk7XG4gIHJldHVybiBPYmplY3Qua2V5cyhleHBlY3RlZCk7XG59O1xuXG5mdW5jdGlvbiB0b0Vycm9ySW5mbyhwb3MsIHN0cikge1xuICB2YXIgbGluZU51bSA9IDE7XG4gIHZhciBjb2xOdW0gPSAxO1xuXG4gIHZhciBjdXJyUG9zID0gMDtcbiAgdmFyIGxpbmVTdGFydFBvcyA9IDA7XG5cbiAgd2hpbGUgKGN1cnJQb3MgPCBwb3MpIHtcbiAgICB2YXIgYyA9IHN0ci5jaGFyQXQoY3VyclBvcysrKTtcbiAgICBpZiAoYyA9PT0gXCJcXG5cIikge1xuICAgICAgbGluZU51bSsrO1xuICAgICAgY29sTnVtID0gMTtcbiAgICAgIGxpbmVTdGFydFBvcyA9IGN1cnJQb3M7XG4gICAgfSBlbHNlIGlmIChjICE9PSBcIlxcclwiKSB7XG4gICAgICBjb2xOdW0rKztcbiAgICB9XG4gIH1cblxuICB2YXIgbGluZUVuZFBvcyA9IHN0ci5pbmRleE9mKFwiXFxuXCIsIGxpbmVTdGFydFBvcyk7XG4gIGlmIChsaW5lRW5kUG9zIDwgMCkge1xuICAgIGxpbmVFbmRQb3MgPSBzdHIubGVuZ3RoO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBsaW5lTnVtOiBsaW5lTnVtLFxuICAgIGNvbE51bTogY29sTnVtLFxuICAgIGxpbmU6IHN0ci5zdWJzdHIobGluZVN0YXJ0UG9zLCBsaW5lRW5kUG9zIC0gbGluZVN0YXJ0UG9zKVxuICB9O1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBjb25zdHJ1Y3RvcnMgLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gVHlwZSBlcnJvclxuXG52YXIgSW52YWxpZENvbnN0cnVjdG9yQ2FsbCA9IG1ha2VDdXN0b21FcnJvcihcbiAgICBcIm9obS5lcnJvci5JbnZhbGlkQ29uc3RydWN0b3JDYWxsXCIsXG4gICAgZnVuY3Rpb24oZ3JhbW1hciwgY3Rvck5hbWUsIGNoaWxkcmVuKSB7XG4gICAgICB0aGlzLmdyYW1tYXIgPSBncmFtbWFyO1xuICAgICAgdGhpcy5jdG9yTmFtZSA9IGN0b3JOYW1lO1xuICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgdGhpcy5tZXNzYWdlID0gXCJBdHRlbXB0IHRvIGludm9rZSBjb25zdHJ1Y3RvciBcIiArIHRoaXMuY3Rvck5hbWUgKyBcIiB3aXRoIGludmFsaWQgb3IgdW5leHBlY3RlZCBhcmd1bWVudHNcIjtcbiAgICB9XG4pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy5FcnJvciA9IE9obUVycm9yO1xuZXhwb3J0cy5JbnRlcnZhbFNvdXJjZXNEb250TWF0Y2ggPSBJbnRlcnZhbFNvdXJjZXNEb250TWF0Y2g7XG5leHBvcnRzLlVuZGVjbGFyZWRHcmFtbWFyID0gVW5kZWNsYXJlZEdyYW1tYXI7XG5leHBvcnRzLkR1cGxpY2F0ZUdyYW1tYXJEZWNsYXJhdGlvbiA9IER1cGxpY2F0ZUdyYW1tYXJEZWNsYXJhdGlvbjtcbmV4cG9ydHMuVW5kZWNsYXJlZFJ1bGUgPSBVbmRlY2xhcmVkUnVsZTtcbmV4cG9ydHMuRHVwbGljYXRlUnVsZURlY2xhcmF0aW9uID0gRHVwbGljYXRlUnVsZURlY2xhcmF0aW9uO1xuZXhwb3J0cy5JbmNvbnNpc3RlbnRBcml0eSA9IEluY29uc2lzdGVudEFyaXR5O1xuZXhwb3J0cy5EdXBsaWNhdGVQcm9wZXJ0eU5hbWVzID0gRHVwbGljYXRlUHJvcGVydHlOYW1lcztcbmV4cG9ydHMuTWF0Y2hGYWlsdXJlID0gTWF0Y2hGYWlsdXJlO1xuZXhwb3J0cy5JbnZhbGlkQ29uc3RydWN0b3JDYWxsID0gSW52YWxpZENvbnN0cnVjdG9yQ2FsbDtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnJlcXVpcmUoXCIuL0dyYW1tYXIuanNcIik7ICAvLyByZXF1aXJlZCB0byBpbml0aWFsaXplIGRlZmF1bHQgbmFtZXNwYWNlIHcvIEdyYW1tYXIgZ3JhbW1hclxuXG52YXIgQnVpbGRlciA9IHJlcXVpcmUoXCIuL0J1aWxkZXIuanNcIik7XG52YXIgYXR0cmlidXRlcyA9IHJlcXVpcmUoXCIuL2F0dHJpYnV0ZXMuanNcIik7XG52YXIgY29tbW9uID0gcmVxdWlyZShcIi4vY29tbW9uLmpzXCIpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoXCIuL2Vycm9ycy5qc1wiKTtcbnZhciBuYW1lc3BhY2UgPSByZXF1aXJlKFwiLi9uYW1lc3BhY2VzLmpzXCIpO1xuXG52YXIgVW5pY29kZUNhdGVnb3JpZXMgPSByZXF1aXJlKFwiLi91bmljb2RlLmpzXCIpLlVuaWNvZGVDYXRlZ29yaWVzO1xuXG52YXIgdGhpc01vZHVsZSA9IGV4cG9ydHM7XG52YXIgb2htID0gZXhwb3J0cztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIG1ha2VHcmFtbWFyQnVpbGRlcihvcHROYW1lc3BhY2VOYW1lKSB7XG4gIHZhciBidWlsZGVyO1xuICB2YXIgZGVjbDtcbiAgdmFyIGN1cnJlbnRSdWxlTmFtZTtcbiAgdmFyIG92ZXJyaWRpbmcgPSBmYWxzZTtcbiAgdmFyIHZhbHVlID0gbmFtZXNwYWNlKFwiZGVmYXVsdFwiKS5ncmFtbWFyKFwiT2htXCIpLnNlbWFudGljQWN0aW9uKHtcbiAgICBHcmFtbWFyOiBmdW5jdGlvbihuLCBzLCBfLCBycywgXykge1xuICAgICAgYnVpbGRlciA9IG5ldyBCdWlsZGVyKCk7XG4gICAgICBkZWNsID0gYnVpbGRlci5uZXdHcmFtbWFyKHZhbHVlKG4pLCBvcHROYW1lc3BhY2VOYW1lIHx8IFwiZGVmYXVsdFwiKTtcbiAgICAgIHZhbHVlKHMpOyAgLy8gZm9yY2UgZXZhbHVhdGlvblxuICAgICAgdmFsdWUocnMpOyAgLy8gZm9yY2UgZXZhbHVhdGlvblxuICAgICAgcmV0dXJuIGRlY2wuaW5zdGFsbCgpO1xuICAgIH0sXG5cbiAgICBTdXBlckdyYW1tYXJfcXVhbGlmaWVkOiBmdW5jdGlvbihfLCBucywgXywgbikge1xuICAgICAgZGVjbC53aXRoU3VwZXJHcmFtbWFyKHZhbHVlKG4pLCB2YWx1ZShucykpO1xuICAgIH0sXG4gICAgU3VwZXJHcmFtbWFyX3VucXVhbGlmaWVkOiBmdW5jdGlvbihfLCBuKSB7XG4gICAgICBkZWNsLndpdGhTdXBlckdyYW1tYXIodmFsdWUobikpO1xuICAgIH0sXG5cbiAgICBSdWxlX2RlZmluZTogZnVuY3Rpb24obiwgZCwgXywgYikge1xuICAgICAgY3VycmVudFJ1bGVOYW1lID0gdmFsdWUobik7XG4gICAgICB2YXIgYm9keSA9IHZhbHVlKGIpO1xuICAgICAgYm9keS5kZWZpbml0aW9uSW50ZXJ2YWwgPSB0aGlzLmludGVydmFsLnRyaW1tZWQoKTtcbiAgICAgIHJldHVybiBkZWNsLmRlZmluZShjdXJyZW50UnVsZU5hbWUsIGJvZHksIHZhbHVlKGQpKTtcbiAgICB9LFxuICAgIFJ1bGVfb3ZlcnJpZGU6IGZ1bmN0aW9uKG4sIF8sIGIpIHtcbiAgICAgIGN1cnJlbnRSdWxlTmFtZSA9IHZhbHVlKG4pO1xuICAgICAgb3ZlcnJpZGluZyA9IHRydWU7XG4gICAgICB2YXIgYm9keSA9IHZhbHVlKGIpO1xuICAgICAgYm9keS5kZWZpbml0aW9uSW50ZXJ2YWwgPSB0aGlzLmludGVydmFsLnRyaW1tZWQoKTtcbiAgICAgIHZhciBhbnMgPSBkZWNsLm92ZXJyaWRlKGN1cnJlbnRSdWxlTmFtZSwgYm9keSk7XG4gICAgICBvdmVycmlkaW5nID0gZmFsc2U7XG4gICAgICByZXR1cm4gYW5zO1xuICAgIH0sXG4gICAgUnVsZV9leHRlbmQ6IGZ1bmN0aW9uKG4sIF8sIGIpIHtcbiAgICAgIGN1cnJlbnRSdWxlTmFtZSA9IHZhbHVlKG4pO1xuICAgICAgdmFyIGFucyA9IGRlY2wuZXh0ZW5kKGN1cnJlbnRSdWxlTmFtZSwgdmFsdWUoYikpO1xuICAgICAgZGVjbC5ydWxlRGljdFtjdXJyZW50UnVsZU5hbWVdLmRlZmluaXRpb25JbnRlcnZhbCA9IHRoaXMuaW50ZXJ2YWwudHJpbW1lZCgpO1xuICAgICAgcmV0dXJuIGFucztcbiAgICB9LFxuXG4gICAgQWx0X3JlYzogZnVuY3Rpb24oeCwgXywgeSkge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIuYWx0KHZhbHVlKHgpLCB2YWx1ZSh5KSk7XG4gICAgfSxcblxuICAgIFRlcm1faW5saW5lOiBmdW5jdGlvbihiLCBuKSB7XG4gICAgICB2YXIgaW5saW5lUnVsZU5hbWUgPSBjdXJyZW50UnVsZU5hbWUgKyBcIl9cIiArIHZhbHVlKG4pO1xuICAgICAgdmFyIGJvZHkgPSB2YWx1ZShiKTtcbiAgICAgIGJvZHkuZGVmaW5pdGlvbkludGVydmFsID0gdGhpcy5pbnRlcnZhbC50cmltbWVkKCk7XG4gICAgICBpZiAob3ZlcnJpZGluZykge1xuICAgICAgICBkZWNsLm92ZXJyaWRlKGlubGluZVJ1bGVOYW1lLCBib2R5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlY2wuZGVmaW5lKGlubGluZVJ1bGVOYW1lLCBib2R5KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBidWlsZGVyLmFwcChpbmxpbmVSdWxlTmFtZSk7XG4gICAgfSxcblxuICAgIFNlcTogZnVuY3Rpb24oZXhwcikge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIuc2VxLmFwcGx5KGJ1aWxkZXIsIHZhbHVlKGV4cHIpKTtcbiAgICB9LFxuXG4gICAgSXRlcl9zdGFyOiBmdW5jdGlvbih4LCBfKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5tYW55KHZhbHVlKHgpLCAwKTtcbiAgICB9LFxuICAgIEl0ZXJfcGx1czogZnVuY3Rpb24oeCwgXykge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIubWFueSh2YWx1ZSh4KSwgMSk7XG4gICAgfSxcbiAgICBJdGVyX29wdDogZnVuY3Rpb24oeCwgXykge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIub3B0KHZhbHVlKHgpKTtcbiAgICB9LFxuXG4gICAgUHJlZF9ub3Q6IGZ1bmN0aW9uKF8sIHgpIHtcbiAgICAgIHJldHVybiBidWlsZGVyLm5vdCh2YWx1ZSh4KSk7XG4gICAgfSxcbiAgICBQcmVkX2xvb2thaGVhZDogZnVuY3Rpb24oXywgeCkge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIubGEodmFsdWUoeCkpO1xuICAgIH0sXG5cbiAgICBCYXNlX2FwcGxpY2F0aW9uOiBmdW5jdGlvbihydWxlKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5hcHAodmFsdWUocnVsZSksIHRoaXMuaW50ZXJ2YWwudHJpbW1lZCgpKTtcbiAgICB9LFxuICAgIEJhc2VfcHJpbTogZnVuY3Rpb24oZXhwcikge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIucHJpbSh2YWx1ZShleHByKSk7XG4gICAgfSxcbiAgICBCYXNlX3BhcmVuOiBmdW5jdGlvbihfLCB4LCBfKSB7XG4gICAgICByZXR1cm4gdmFsdWUoeCk7XG4gICAgfSxcbiAgICBCYXNlX2FycjogZnVuY3Rpb24oXywgeCwgXykge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIuYXJyKHZhbHVlKHgpKTtcbiAgICB9LFxuICAgIEJhc2Vfb2JqOiBmdW5jdGlvbihfLCBsZW5pZW50LCBfKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5vYmooW10sIHZhbHVlKGxlbmllbnQpKTtcbiAgICB9LFxuICAgIEJhc2Vfb2JqV2l0aFByb3BzOiBmdW5jdGlvbihfLCBwcywgXywgbGVuaWVudCwgXykge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIub2JqKHZhbHVlKHBzKSwgdmFsdWUobGVuaWVudCkpO1xuICAgIH0sXG5cbiAgICBQcm9wc19yZWM6IGZ1bmN0aW9uKHAsIF8sIHBzKSB7XG4gICAgICByZXR1cm4gW3ZhbHVlKHApXS5jb25jYXQodmFsdWUocHMpKTtcbiAgICB9LFxuICAgIFByb3BzX2Jhc2U6IGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiBbdmFsdWUocCldO1xuICAgIH0sXG4gICAgUHJvcDogZnVuY3Rpb24obiwgXywgcCkge1xuICAgICAgcmV0dXJuIHtuYW1lOiB2YWx1ZShuKSwgcGF0dGVybjogdmFsdWUocCl9O1xuICAgIH0sXG5cbiAgICBydWxlRGVzY3I6IGZ1bmN0aW9uKF8sIHQsIF8pIHtcbiAgICAgIHJldHVybiB2YWx1ZSh0KTtcbiAgICB9LFxuICAgIHJ1bGVEZXNjclRleHQ6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzLnRyaW0oKTtcbiAgICB9LFxuXG4gICAgY2FzZU5hbWU6IGZ1bmN0aW9uKF8sIF8sIG4sIF8sIF8pIHtcbiAgICAgIHJldHVybiB2YWx1ZShuKVxuICAgIH0sXG5cbiAgICBuYW1lOiBmdW5jdGlvbihfLCBfKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50cztcbiAgICB9LFxuICAgIG5hbWVGaXJzdDogZnVuY3Rpb24oZXhwcikge30sXG4gICAgbmFtZVJlc3Q6IGZ1bmN0aW9uKGV4cHIpIHt9LFxuXG4gICAga2V5d29yZF91bmRlZmluZWQ6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICBrZXl3b3JkX251bGw6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAga2V5d29yZF90cnVlOiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGtleXdvcmRfZmFsc2U6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgc3RyaW5nOiBmdW5jdGlvbihfLCBjcywgXykge1xuICAgICAgcmV0dXJuIHZhbHVlKGNzKS5tYXAoZnVuY3Rpb24oYykgeyByZXR1cm4gY29tbW9uLnVuZXNjYXBlQ2hhcihjKTsgfSkuam9pbihcIlwiKTtcbiAgICB9LFxuXG4gICAgc2luZ2xlUXVvdGVTdHJDaGFyOiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50cztcbiAgICB9LFxuXG4gICAgZG91YmxlUXVvdGVTdHJDaGFyOiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50cztcbiAgICB9LFxuXG4gICAgcmVnRXhwOiBmdW5jdGlvbihfLCBlLCBfKSB7XG4gICAgICByZXR1cm4gdmFsdWUoZSk7XG4gICAgfSxcblxuICAgIHJlQ2hhckNsYXNzX3VuaWNvZGU6IGZ1bmN0aW9uKF8sIHVuaWNvZGVDbGFzcywgXykge1xuICAgICAgcmV0dXJuIFVuaWNvZGVDYXRlZ29yaWVzW3ZhbHVlKHVuaWNvZGVDbGFzcykuam9pbihcIlwiKV07XG4gICAgfSxcbiAgICByZUNoYXJDbGFzc19vcmRpbmFyeTogZnVuY3Rpb24oXywgXywgXykge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAodGhpcy5pbnRlcnZhbC5jb250ZW50cyk7XG4gICAgfSxcblxuICAgIG51bWJlcjogZnVuY3Rpb24oXywgXykge1xuICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMuaW50ZXJ2YWwuY29udGVudHMpO1xuICAgIH0sXG5cbiAgICBzcGFjZTogZnVuY3Rpb24oZXhwcikge30sXG4gICAgc3BhY2VfbXVsdGlMaW5lOiBmdW5jdGlvbihfLCBfLCBfKSB7fSxcbiAgICBzcGFjZV9zaW5nbGVMaW5lOiBmdW5jdGlvbihfLCBfLCBfKSB7fSxcblxuICAgIF9saXN0OiBhdHRyaWJ1dGVzLmFjdGlvbnMubWFwLFxuICAgIF90ZXJtaW5hbDogYXR0cmlidXRlcy5hY3Rpb25zLmdldFZhbHVlLFxuICAgIF9kZWZhdWx0OiBhdHRyaWJ1dGVzLmFjdGlvbnMucGFzc1Rocm91Z2hcbiAgfSk7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gY29tcGlsZUFuZExvYWQoc291cmNlLCB3aGF0SXRJcywgb3B0TmFtZXNwYWNlTmFtZSkge1xuICB0cnkge1xuICAgIHZhciBub2RlID0gbmFtZXNwYWNlKFwiZGVmYXVsdFwiKS5ncmFtbWFyKFwiT2htXCIpLm1hdGNoKHNvdXJjZSwgd2hhdEl0SXMsIHRydWUpO1xuICAgIHJldHVybiBtYWtlR3JhbW1hckJ1aWxkZXIob3B0TmFtZXNwYWNlTmFtZSkobm9kZSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoZSBpbnN0YW5jZW9mIGVycm9ycy5NYXRjaEZhaWx1cmUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyBlLmdldE1lc3NhZ2UoKSk7XG4gICAgfVxuICAgIHRocm93IGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFrZUdyYW1tYXIoc291cmNlLCBvcHROYW1lc3BhY2VOYW1lKSB7XG4gIHJldHVybiBjb21waWxlQW5kTG9hZChzb3VyY2UsIFwiR3JhbW1hclwiLCBvcHROYW1lc3BhY2VOYW1lKTtcbn1cblxuZnVuY3Rpb24gbWFrZUdyYW1tYXJzKHNvdXJjZSwgb3B0TmFtZXNwYWNlTmFtZSkge1xuICByZXR1cm4gY29tcGlsZUFuZExvYWQoc291cmNlLCBcIkdyYW1tYXJzXCIsIG9wdE5hbWVzcGFjZU5hbWUpO1xufVxuXG5mdW5jdGlvbiBtYWtlTG9jKG5vZGUpIHtcbiAgcmV0dXJuIHtcbiAgICBzdGFydDogbm9kZS5pbnRlcnZhbC5zdGFydElkeCxcbiAgICBlbmQ6IG5vZGUuaW50ZXJ2YWwuZW5kSWR4XG4gIH07XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBTdHVmZiB0aGF0IHVzZXJzIHNob3VsZCBrbm93IGFib3V0XG5cbmV4cG9ydHMuZXJyb3IgPSBlcnJvcnM7XG5cbmV4cG9ydHMubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuXG5leHBvcnRzLmdyYW1tYXIgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHJldHVybiBuYW1lc3BhY2UoXCJkZWZhdWx0XCIpLmdyYW1tYXIobmFtZSk7XG59O1xuXG5leHBvcnRzLm1ha2VHcmFtbWFyID0gbWFrZUdyYW1tYXI7XG5leHBvcnRzLm1ha2VHcmFtbWFycyA9IG1ha2VHcmFtbWFycztcblxuZXhwb3J0cy5hY3Rpb25zID0gYXR0cmlidXRlcy5hY3Rpb25zO1xuXG4vLyBTdHVmZiB0aGF0J3Mgb25seSBoZXJlIGZvciBib290c3RyYXBwaW5nLCB0ZXN0aW5nLCBldGMuXG5cbmV4cG9ydHMubWFrZVJlY2lwZSA9IGZ1bmN0aW9uKHJlY2lwZSkge1xuICByZWNpcGUuY2FsbChuZXcgQnVpbGRlcigpKTtcbn07XG5cbmV4cG9ydHMuX21ha2VHcmFtbWFyQnVpbGRlciA9IG1ha2VHcmFtbWFyQnVpbGRlcjtcblxucmVxdWlyZShcIi4uL2Rpc3Qvb2htLWdyYW1tYXIuanNcIik7XG5cbi8vIExvYWQgYWxsIGdyYW1tYXJzIGluIHNjcmlwdCBlbGVtZW50cyBpbnRvIHRoZSBhcHByb3ByaWF0ZSBuYW1lc3BhY2VzXG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIikpLlxuICAgICAgZmlsdGVyKGZ1bmN0aW9uKGVsdCkge1xuICAgICAgICByZXR1cm4gZWx0LmdldEF0dHJpYnV0ZShcInR5cGVcIikgPT09IFwidGV4dC9vaG0tanNcIjtcbiAgICAgIH0pLlxuICAgICAgZm9yRWFjaChmdW5jdGlvbihlbHQpIHtcbiAgICAgICAgdmFyIG5zID0gZWx0LmdldEF0dHJpYnV0ZShcIm5hbWVzcGFjZVwiKSB8fCBcImRlZmF1bHRcIjtcbiAgICAgICAgbmFtZXNwYWNlKG5zKS5sb2FkR3JhbW1hcnNGcm9tU2NyaXB0RWxlbWVudChlbHQpXG4gICAgICB9KTtcbn1cblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBvaG0gPSByZXF1aXJlKFwiLi9tYWluLmpzXCIpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoXCIuL2Vycm9ycy5qc1wiKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgU3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFRPRE86IGp1c3QgdXNlIHRoZSBqUXVlcnkgdGhpbmdcbmZ1bmN0aW9uIGxvYWQodXJsKSB7XG4gIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgcmVxLm9wZW4oXCJHRVRcIiwgdXJsLCBmYWxzZSk7XG4gIHRyeSB7XG4gICAgcmVxLnNlbmQoKTtcbiAgICBpZiAocmVxLnN0YXR1cyA9PT0gMCB8fCByZXEuc3RhdHVzID09PSAyMDApIHtcbiAgICAgIHJldHVybiByZXEucmVzcG9uc2VUZXh0O1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge31cbiAgdGhyb3cgbmV3IEVycm9yKFwidW5hYmxlIHRvIGxvYWQgdXJsIFwiICsgdXJsKTtcbn1cblxudmFyIG5hbWVzcGFjZXMgPSB7fTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE5hbWVzcGFjZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIG5hbWVzcGFjZShuYW1lKSB7XG4gIHJldHVybiBuYW1lc3BhY2VzW25hbWVdID9cbiAgICBuYW1lc3BhY2VzW25hbWVdIDpcbiAgICAobmFtZXNwYWNlc1tuYW1lXSA9IG5ldyBOYW1lc3BhY2UobmFtZSkpO1xufVxuXG5mdW5jdGlvbiBOYW1lc3BhY2UobmFtZSkge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLmdyYW1tYXJzID0ge307XG59XG5cbk5hbWVzcGFjZS5wcm90b3R5cGUgPSB7XG4gIGluc3RhbGw6IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgICBpZiAoZ3JhbW1hci5uYW1lc3BhY2VOYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiY2Fubm90IGluc3RhbGwgZ3JhbW1hciBcIiArIGdyYW1tYXIubmFtZSArIFwiIGludG8gbmFtZXNwYWNlIFwiICsgdGhpcy5uYW1lICtcbiAgICAgICAgXCIgYmVjYXVzZSBpdCdzIGFscmVhZHkgaW4gbmFtZXNwYWNlIFwiICsgZ3JhbW1hci5uYW1lc3BhY2VOYW1lKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ3JhbW1hcnNbZ3JhbW1hci5uYW1lXSkge1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5EdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24oZ3JhbW1hci5uYW1lLCB0aGlzLm5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmdyYW1tYXJzW2dyYW1tYXIubmFtZV0gPSBncmFtbWFyO1xuICAgICAgZ3JhbW1hci5uYW1lc3BhY2VOYW1lID0gdGhpcy5uYW1lO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LFxuXG4gIGdyYW1tYXI6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiAodGhpcy5ncmFtbWFyc1tuYW1lXSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ3JhbW1hcnNbbmFtZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVW5kZWNsYXJlZEdyYW1tYXIobmFtZSwgdGhpcy5uYW1lKTtcbiAgICB9XG4gIH0sXG5cbiAgbG9hZEdyYW1tYXJzRnJvbVNjcmlwdEVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudC50eXBlICE9PSBcInRleHQvb2htLWpzXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInNjcmlwdCB0YWcncyB0eXBlIGF0dHJpYnV0ZSBtdXN0IGJlIHRleHQvb2htLWpzXCIpO1xuICAgIH1cbiAgICB2YXIgc291cmNlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJzcmNcIikgPyBsb2FkKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwic3JjXCIpKSA6IGVsZW1lbnQuaW5uZXJIVE1MO1xuICAgIHRyeSB7XG4gICAgICBvaG0ubWFrZUdyYW1tYXJzKHNvdXJjZSwgdGhpcy5uYW1lKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoIShlIGluc3RhbmNlb2YgZXJyb3JzLkVycm9yKSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBtYWtlOiBmdW5jdGlvbihyZWNpcGUpIHtcbiAgICByZXR1cm4gcmVjaXBlKG9obSwgdGhpcyk7XG4gIH1cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5hbWVzcGFjZTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzLmpzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGNvbW1vbi5hYnN0cmFjdDtcblxucGV4cHJzLmFueXRoaW5nLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5lbmQuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gZnVuY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCkge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLmZhaWwuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gZnVuY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCkge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpIHtcbiAgdmFyIGFucyA9IGZhbHNlO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICB2YXIgdGVybSA9IHRoaXMudGVybXNbaWR4XTtcbiAgICBhbnMgfD0gdGVybS5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCk7XG4gIH1cbiAgcmV0dXJuIGFucztcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpIHtcbiAgdmFyIGFucyA9IGZhbHNlO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciBmYWN0b3IgPSB0aGlzLmZhY3RvcnNbaWR4XTtcbiAgICBhbnMgfD0gZmFjdG9yLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbihkaWN0LCB2YWx1ZVJlcXVpcmVkKTtcbiAgfVxuICByZXR1cm4gYW5zO1xufTtcblxucGV4cHJzLk1hbnkucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCk7XG59O1xuXG5wZXhwcnMuT3B0LnByb3RvdHlwZS5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24gPSBmdW5jdGlvbihkaWN0LCB2YWx1ZVJlcXVpcmVkKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gZnVuY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCkge1xuICByZXR1cm4gdGhpcy5leHByLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbihkaWN0LCBmYWxzZSk7XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24gPSBmdW5jdGlvbihkaWN0LCB2YWx1ZVJlcXVpcmVkKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpO1xufTtcblxucGV4cHJzLkFyci5wcm90b3R5cGUuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gZnVuY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCkge1xuICByZXR1cm4gdGhpcy5leHByLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbihkaWN0LCB2YWx1ZVJlcXVpcmVkKTtcbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCk7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpIHtcbiAgaWYgKCF2YWx1ZVJlcXVpcmVkIHx8IGRpY3RbdGhpcy5ydWxlTmFtZV0pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGRpY3RbdGhpcy5ydWxlTmFtZV0gPSB0cnVlO1xuICB9XG59O1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycy5qcycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGNvbW1vbi5hYnN0cmFjdDtcblxucGV4cHJzLmFueXRoaW5nLmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLmVuZC5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5mYWlsLmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMudGVybXNbaWR4XS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChncmFtbWFyKTtcbiAgfVxufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy5mYWN0b3JzW2lkeF0uYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQoZ3JhbW1hcik7XG4gIH1cbn07XG5cbnBleHBycy5NYW55LnByb3RvdHlwZS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgdGhpcy5leHByLmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKGdyYW1tYXIpO1xufTtcblxucGV4cHJzLk9wdC5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChncmFtbWFyKTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICB0aGlzLmV4cHIuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQoZ3JhbW1hcik7XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgdGhpcy5leHByLmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKGdyYW1tYXIpO1xufTtcblxucGV4cHJzLkFyci5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChncmFtbWFyKTtcbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQoZ3JhbW1hcik7XG4gIH1cbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIGlmICghZ3JhbW1hci5ydWxlRGljdFt0aGlzLnJ1bGVOYW1lXSkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuVW5kZWNsYXJlZFJ1bGUodGhpcy5ydWxlTmFtZSwgZ3JhbW1hci5uYW1lKTtcbiAgfVxufTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKFwiLi9jb21tb24uanNcIik7XG52YXIgcGV4cHJzID0gcmVxdWlyZShcIi4vcGV4cHJzLmpzXCIpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoXCIuL2Vycm9ycy5qc1wiKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnl0aGluZy5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuZW5kLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5mYWlsLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5QcmltLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIGlmICh0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgYXJpdHkgPSB0aGlzLnRlcm1zWzBdLmdldEFyaXR5KCk7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciB0ZXJtID0gdGhpcy50ZXJtc1tpZHhdO1xuICAgIHRlcm0uYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkoKTtcbiAgICB2YXIgb3RoZXJBcml0eSA9IHRlcm0uZ2V0QXJpdHkoKTtcbiAgICBpZiAoYXJpdHkgIT09IG90aGVyQXJpdHkpIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuSW5jb25zaXN0ZW50QXJpdHkocnVsZU5hbWUsIGFyaXR5LCBvdGhlckFyaXR5KTtcbiAgICB9XG4gIH1cbn07XG5cbnBleHBycy5FeHRlbmQucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gRXh0ZW5kIGlzIGEgc3BlY2lhbCBjYXNlIG9mIEFsdCB0aGF0J3MgZ3VhcmFudGVlZCB0byBoYXZlIGV4YWN0bHkgdHdvIGNhc2VzOiBbZXh0ZW5zaW9ucywgb3JpZ0JvZHldXG4gIHZhciBhY3R1YWxBcml0eSA9IHRoaXMudGVybXNbMF0uZ2V0QXJpdHkoKTtcbiAgdmFyIGV4cGVjdGVkQXJpdHkgPSB0aGlzLnRlcm1zWzFdLmdldEFyaXR5KCk7XG4gIGlmIChhY3R1YWxBcml0eSAhPT0gZXhwZWN0ZWRBcml0eSkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuSW5jb25zaXN0ZW50QXJpdHkocnVsZU5hbWUsIGV4cGVjdGVkQXJpdHksIGFjdHVhbEFyaXR5KTtcbiAgfVxufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMuZmFjdG9yc1tpZHhdLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLk1hbnkucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KHJ1bGVOYW1lKTtcbn07XG5cbnBleHBycy5PcHQucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KHJ1bGVOYW1lKTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gbm8tb3AgKG5vdCByZXF1aXJlZCBiL2MgdGhlIG5lc3RlZCBleHByIGRvZXNuJ3Qgc2hvdyB1cCBpbiB0aGUgQ1NUKVxufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLkFyci5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLk9iai5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpO1xuICB9XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcbnZhciBOb2RlID0gcmVxdWlyZSgnLi9Ob2RlLmpzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuY2hlY2sgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnl0aGluZy5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHZhbHMubGVuZ3RoID49IDE7XG59O1xuXG5wZXhwcnMuZW5kLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICByZXR1cm4gdmFsc1swXSBpbnN0YW5jZW9mIE5vZGUgJiYgdmFsc1swXS5pc1ZhbHVlKCkgJiYgdmFsc1swXS52YWx1ZSgpID09PSB1bmRlZmluZWQ7XG59O1xuXG5wZXhwcnMuZmFpbC5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICByZXR1cm4gdmFsc1swXSBpbnN0YW5jZW9mIE5vZGUgJiYgdmFsc1swXS5pc1ZhbHVlKCkgJiYgdmFsc1swXS52YWx1ZSgpID09PSB0aGlzLm9iajtcbn07XG5cbnBleHBycy5SZWdFeHBQcmltLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgLy8gVE9ETzogbW9yZSBlZmZpY2llbnQgXCJ0b3RhbCBtYXRjaCBjaGVja2VyXCIgdGhhbiB0aGUgdXNlIG9mIC5yZXBsYWNlIGhlcmVcbiAgcmV0dXJuIHZhbHNbMF0gaW5zdGFuY2VvZiBOb2RlICYmXG4gICAgICAgICB2YWxzWzBdLmlzVmFsdWUoKSAmJlxuICAgICAgICAgdHlwZW9mIHZhbHNbMF0udmFsdWUoKSA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgIHZhbHNbMF0udmFsdWUoKS5yZXBsYWNlKHRoaXMub2JqLCAnJykgPT09ICcnO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50ZXJtcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB0ZXJtID0gdGhpcy50ZXJtc1tpXTtcbiAgICBpZiAodGVybS5jaGVjayhncmFtbWFyLCB2YWxzKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICB2YXIgcG9zID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZmFjdG9yID0gdGhpcy5mYWN0b3JzW2ldO1xuICAgIGlmIChmYWN0b3IuY2hlY2soZ3JhbW1hciwgdmFscy5zbGljZShwb3MpKSkge1xuICAgICAgcG9zICs9IGZhY3Rvci5nZXRBcml0eSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLk1hbnkucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICB2YXIgYXJpdHkgPSB0aGlzLmdldEFyaXR5KCk7XG4gIGlmIChhcml0eSA9PT0gMCkge1xuICAgIC8vIFRPRE86IG1ha2UgdGhpcyBhIHN0YXRpYyBjaGVjayB3LyBhIG5pY2UgZXJyb3IgbWVzc2FnZSwgdGhlbiByZW1vdmUgdGhlIGR5bmFtaWMgY2hlY2suXG4gICAgLy8gY2YuIHBleHBycy1ldmFsLmpzIGZvciBNYW55XG4gICAgdGhyb3cgJ2ZpeCBtZSEnO1xuICB9XG5cbiAgdmFyIGNvbHVtbnMgPSB2YWxzLnNsaWNlKDAsIGFyaXR5KTtcbiAgaWYgKGNvbHVtbnMubGVuZ3RoICE9PSBhcml0eSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcm93Y291bnQgPSBjb2x1bW5zWzBdLmxlbmd0aDtcbiAgdmFyIGk7XG4gIGZvciAoaSA9IDE7IGkgPCBhcml0eTsgaSsrKSB7XG4gICAgaWYgKGNvbHVtbnNbaV0ubGVuZ3RoICE9PSByb3djb3VudCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCByb3djb3VudDsgaSsrKSB7XG4gICAgdmFyIHJvdyA9IFtdXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBhcml0eTsgaisrKSB7XG4gICAgICByb3cucHVzaChjb2x1bW5zW2pdW2ldKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmV4cHIuY2hlY2soZ3JhbW1hciwgcm93KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLk9wdC5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIHZhciBhcml0eSA9IHRoaXMuZ2V0QXJpdHkoKTtcbiAgdmFyIGFsbFVuZGVmaW5lZCA9IHRydWU7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJpdHk7IGkrKykge1xuICAgIGlmICh2YWxzW2ldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFsbFVuZGVmaW5lZCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKGFsbFVuZGVmaW5lZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmV4cHIuY2hlY2soZ3JhbW1hciwgdmFscyk7XG4gIH1cbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICByZXR1cm4gdGhpcy5leHByLmNoZWNrKGdyYW1tYXIsIHZhbHMpO1xufTtcblxucGV4cHJzLkFyci5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuY2hlY2soZ3JhbW1hciwgdmFscyk7XG59O1xuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgdmFyIGZpeGVkQXJpdHkgPSB0aGlzLmdldEFyaXR5KCk7XG4gIGlmICh0aGlzLmlzTGVuaWVudCkge1xuICAgIGZpeGVkQXJpdHktLTtcbiAgfVxuXG4gIHZhciBwb3MgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpeGVkQXJpdHk7IGkrKykge1xuICAgIHZhciBwYXR0ZXJuID0gdGhpcy5wcm9wZXJ0aWVzW2ldLnBhdHRlcm47XG4gICAgaWYgKHBhdHRlcm4uY2hlY2soZ3JhbW1hciwgdmFscy5zbGljZShwb3MpKSkge1xuICAgICAgcG9zICs9IHBhdHRlcm4uZ2V0QXJpdHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzLmlzTGVuaWVudCA/IHR5cGVvZiB2YWxzW3Bvc10gPT09ICdvYmplY3QnICYmIHZhbHNbcG9zXSA6IHRydWU7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICBpZiAoISh2YWxzWzBdIGluc3RhbmNlb2YgTm9kZSAmJlxuICAgICAgICB2YWxzWzBdLmdyYW1tYXIgPT09IGdyYW1tYXIgJiZcbiAgICAgICAgdmFsc1swXS5jdG9yTmFtZSA9PT0gdGhpcy5ydWxlTmFtZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBUT0RPOiB0aGluayBhYm91dCAqbm90KiBkb2luZyB0aGUgZm9sbG93aW5nIGNoZWNrcywgaS5lLiwgdHJ1c3RpbmcgdGhhdCB0aGUgcnVsZVxuICAvLyB3YXMgY29ycmVjdGx5IGNvbnN0cnVjdGVkLlxuICB2YXIgcnVsZU5vZGUgPSB2YWxzWzBdO1xuICB2YXIgYm9keSA9IGdyYW1tYXIucnVsZURpY3RbdGhpcy5ydWxlTmFtZV07XG4gIHJldHVybiBib2R5LmNoZWNrKGdyYW1tYXIsIHJ1bGVOb2RlLmNoaWxkcmVuKSAmJiBydWxlTm9kZS5udW1DaGlsZHJlbigpID09PSBib2R5LmdldEFyaXR5KCk7XG59O1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMuanMnKTtcbnZhciBOb2RlID0gcmVxdWlyZSgnLi9Ob2RlLmpzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKTtcbnZhciBJbnB1dFN0cmVhbSA9IHJlcXVpcmUoJy4vSW5wdXRTdHJlYW0uanMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBhcHBseVNwYWNlc18gPSBuZXcgcGV4cHJzLkFwcGx5KCdzcGFjZXNfJyk7XG5cbmZ1bmN0aW9uIHNraXBTcGFjZXNJZkFwcHJvcHJpYXRlKHN0YXRlKSB7XG4gIHZhciBjdXJyZW50UnVsZSA9IHN0YXRlLnJ1bGVTdGFja1tzdGF0ZS5ydWxlU3RhY2subGVuZ3RoIC0gMV07XG4gIHZhciBydWxlTmFtZSA9IGN1cnJlbnRSdWxlLnJ1bGVOYW1lIHx8ICcnO1xuICBpZiAodHlwZW9mIHN0YXRlLmlucHV0U3RyZWFtLnNvdXJjZSA9PT0gJ3N0cmluZycgJiYgY29tbW9uLmlzU3ludGFjdGljKHJ1bGVOYW1lKSkge1xuICAgIHNraXBTcGFjZXMoc3RhdGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNraXBTcGFjZXMoc3RhdGUpIHtcbiAgdmFyIG9yaWdGYWlsdXJlRGVzY3JpcHRvciA9IHN0YXRlLmZhaWx1cmVEZXNjcmlwdG9yO1xuICB2YXIgbmV3RmFpbHVyZURlc2NyaXB0b3IgPSBzdGF0ZS5mYWlsdXJlRGVzY3JpcHRvciA9IHN0YXRlLm1ha2VGYWlsdXJlRGVzY3JpcHRvcigpO1xuICBhcHBseVNwYWNlc18uZXZhbChzdGF0ZSk7XG4gIHN0YXRlLmJpbmRpbmdzLnBvcCgpO1xuICBzdGF0ZS5mYWlsdXJlRGVzY3JpcHRvciA9IG9yaWdGYWlsdXJlRGVzY3JpcHRvcjtcbn1cblxuLy8gVGhlIGNvbnRyYWN0IG9mIFBFeHByLnByb3RvdHlwZS5ldmFsOlxuLy8gKiBXaGVuIHRoZSByZXR1cm4gdmFsdWUgaXMgdHJ1ZTpcbi8vICAgLS0gYmluZGluZ3Mgd2lsbCBoYXZlIGV4cHIuYXJpdHkgbW9yZSBlbGVtZW50cyB0aGFuIGJlZm9yZVxuLy8gKiBXaGVuIHRoZSByZXR1cm4gdmFsdWUgaXMgZmFsc2U6XG4vLyAgIC0tIGJpbmRpbmdzIHdpbGwgaGF2ZSBleGFjdGx5IHRoZSBzYW1lIG51bWJlciBvZiBlbGVtZW50cyBhcyBiZWZvcmVcbi8vICAgLS0gcG9zaXRpb24gY291bGQgYmUgYW55d2hlcmVcblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5ldmFsID0gY29tbW9uLmFic3RyYWN0O1xuXG5wZXhwcnMuYW55dGhpbmcuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIHZhbHVlID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAodmFsdWUgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgc3RhdGUucmVjb3JkRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgc3RhdGUuYmluZGluZ3MucHVzaChuZXcgTm9kZShzdGF0ZS5ncmFtbWFyLCAnX3Rlcm1pbmFsJywgIFt2YWx1ZV0sIGlucHV0U3RyZWFtLmludGVydmFsRnJvbShvcmlnUG9zKSkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5wZXhwcnMuZW5kLmV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgaWYgKHN0YXRlLmlucHV0U3RyZWFtLmF0RW5kKCkpIHtcbiAgICBzdGF0ZS5iaW5kaW5ncy5wdXNoKG5ldyBOb2RlKHN0YXRlLmdyYW1tYXIsICdfdGVybWluYWwnLCBbdW5kZWZpbmVkXSwgaW5wdXRTdHJlYW0uaW50ZXJ2YWxGcm9tKGlucHV0U3RyZWFtLnBvcykpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBzdGF0ZS5yZWNvcmRGYWlsdXJlKGlucHV0U3RyZWFtLnBvcywgdGhpcyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5wZXhwcnMuZmFpbC5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHN0YXRlLnJlY29yZEZhaWx1cmUoaW5wdXRTdHJlYW0ucG9zLCB0aGlzKTtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIGlmICh0aGlzLm1hdGNoKGlucHV0U3RyZWFtKSA9PT0gY29tbW9uLmZhaWwpIHtcbiAgICBzdGF0ZS5yZWNvcmRGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICBzdGF0ZS5iaW5kaW5ncy5wdXNoKG5ldyBOb2RlKHN0YXRlLmdyYW1tYXIsICdfdGVybWluYWwnLCBbdGhpcy5vYmpdLCBpbnB1dFN0cmVhbS5pbnRlcnZhbEZyb20ob3JpZ1BvcykpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24oaW5wdXRTdHJlYW0pIHtcbiAgcmV0dXJuIGlucHV0U3RyZWFtLm1hdGNoRXhhY3RseSh0aGlzLm9iaik7XG59O1xuXG5wZXhwcnMuU3RyaW5nUHJpbS5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbihpbnB1dFN0cmVhbSkge1xuICByZXR1cm4gaW5wdXRTdHJlYW0ubWF0Y2hTdHJpbmcodGhpcy5vYmopO1xufTtcblxucGV4cHJzLlJlZ0V4cFByaW0ucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIGlmIChpbnB1dFN0cmVhbS5tYXRjaFJlZ0V4cCh0aGlzLm9iaikgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgc3RhdGUucmVjb3JkRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgc3RhdGUuYmluZGluZ3MucHVzaChcbiAgICAgICAgbmV3IE5vZGUoc3RhdGUuZ3JhbW1hciwgJ190ZXJtaW5hbCcsIFtpbnB1dFN0cmVhbS5zb3VyY2Vbb3JpZ1Bvc11dLCBpbnB1dFN0cmVhbS5pbnRlcnZhbEZyb20ob3JpZ1BvcykpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBiaW5kaW5ncyA9IHN0YXRlLmJpbmRpbmdzO1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIHZhciBvcmlnTnVtQmluZGluZ3MgPSBiaW5kaW5ncy5sZW5ndGg7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmICh0aGlzLnRlcm1zW2lkeF0uZXZhbChzdGF0ZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgICAgYmluZGluZ3MubGVuZ3RoID0gb3JpZ051bUJpbmRpbmdzO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBvcmlnTnVtQmluZGluZ3MgPSBzdGF0ZS5iaW5kaW5ncy5sZW5ndGg7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgc2tpcFNwYWNlc0lmQXBwcm9wcmlhdGUoc3RhdGUpO1xuICAgIHZhciBmYWN0b3IgPSB0aGlzLmZhY3RvcnNbaWR4XTtcbiAgICBpZiAoIWZhY3Rvci5ldmFsKHN0YXRlKSkge1xuICAgICAgc3RhdGUuYmluZGluZ3MubGVuZ3RoID0gb3JpZ051bUJpbmRpbmdzO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnBleHBycy5NYW55LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGFyaXR5ID0gdGhpcy5nZXRBcml0eSgpO1xuICBpZiAoYXJpdHkgPT09IDApIHtcbiAgICAvLyBUT0RPOiBtYWtlIHRoaXMgYSBzdGF0aWMgY2hlY2sgdy8gYSBuaWNlIGVycm9yIG1lc3NhZ2UsIHRoZW4gcmVtb3ZlIHRoZSBkeW5hbWljIGNoZWNrLlxuICAgIC8vIGNmLiBwZXhwcnMtY2hlY2suanMgZm9yIE1hbnlcbiAgICB0aHJvdyAnZml4IG1lISc7XG4gIH1cblxuICB2YXIgY29sdW1ucyA9IGNvbW1vbi5yZXBlYXRGbihmdW5jdGlvbigpIHsgcmV0dXJuIFtdOyB9LCBhcml0eSk7XG4gIHZhciBudW1NYXRjaGVzID0gMDtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIHZhciBiYWNrdHJhY2tQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgc2tpcFNwYWNlc0lmQXBwcm9wcmlhdGUoc3RhdGUpO1xuICAgIGlmICh0aGlzLmV4cHIuZXZhbChzdGF0ZSkpIHtcbiAgICAgIG51bU1hdGNoZXMrKztcbiAgICAgIHZhciByb3cgPSBzdGF0ZS5iaW5kaW5ncy5zcGxpY2Uoc3RhdGUuYmluZGluZ3MubGVuZ3RoIC0gYXJpdHksIGFyaXR5KTtcbiAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHJvdy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIGNvbHVtbnNbaWR4XS5wdXNoKHJvd1tpZHhdKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaW5wdXRTdHJlYW0ucG9zID0gYmFja3RyYWNrUG9zO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIGlmIChudW1NYXRjaGVzIDwgdGhpcy5taW5OdW1NYXRjaGVzKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGNvbHVtbnMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgc3RhdGUuYmluZGluZ3MucHVzaChuZXcgTm9kZShzdGF0ZS5ncmFtbWFyLCAnX2xpc3QnLCBjb2x1bW5zW2lkeF0sIGlucHV0U3RyZWFtLmludGVydmFsRnJvbShvcmlnUG9zKSkpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxucGV4cHJzLk9wdC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIGFyaXR5ID0gdGhpcy5nZXRBcml0eSgpO1xuICB2YXIgcm93O1xuICBpZiAodGhpcy5leHByLmV2YWwoc3RhdGUpKSB7XG4gICAgcm93ID0gc3RhdGUuYmluZGluZ3Muc3BsaWNlKHN0YXRlLmJpbmRpbmdzLmxlbmd0aCAtIGFyaXR5LCBhcml0eSk7XG4gIH0gZWxzZSB7XG4gICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICByb3cgPSBjb21tb24ucmVwZWF0KG5ldyBOb2RlKHN0YXRlLmdyYW1tYXIsICdfdGVybWluYWwnLCBbdW5kZWZpbmVkXSwgaW5wdXRTdHJlYW0uaW50ZXJ2YWxGcm9tKG9yaWdQb3MpKSwgYXJpdHkpO1xuICB9XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyaXR5OyBpZHgrKykge1xuICAgIHN0YXRlLmJpbmRpbmdzLnB1c2gocm93W2lkeF0pO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIG9yaWdGYWlsdXJlRGVzY3JpcHRvciA9IHN0YXRlLmZhaWx1cmVEZXNjcmlwdG9yO1xuICB2YXIgbmV3RmFpbHVyZURlc2NyaXB0b3IgPSBzdGF0ZS5mYWlsdXJlRGVzY3JpcHRvciA9IHN0YXRlLm1ha2VGYWlsdXJlRGVzY3JpcHRvcigpO1xuICB2YXIgYW5zID0gdGhpcy5leHByLmV2YWwoc3RhdGUpO1xuICBzdGF0ZS5mYWlsdXJlRGVzY3JpcHRvciA9IG9yaWdGYWlsdXJlRGVzY3JpcHRvcjtcbiAgaWYgKGFucykge1xuICAgIHN0YXRlLnJlY29yZEZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgc3RhdGUuYmluZGluZ3MubGVuZ3RoIC09IHRoaXMuZ2V0QXJpdHkoKTtcbiAgICBhbnMgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgIGFucyA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIGFucztcbn07XG5cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIGlmICh0aGlzLmV4cHIuZXZhbChzdGF0ZSkpIHtcbiAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxucGV4cHJzLkFyci5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb2JqID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAob2JqIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICB2YXIgb2JqSW5wdXRTdHJlYW0gPSBJbnB1dFN0cmVhbS5uZXdGb3Iob2JqKTtcbiAgICBzdGF0ZS5wdXNoSW5wdXRTdHJlYW0ob2JqSW5wdXRTdHJlYW0pO1xuICAgIHZhciBhbnMgPSB0aGlzLmV4cHIuZXZhbChzdGF0ZSkgJiYgc3RhdGUuaW5wdXRTdHJlYW0uYXRFbmQoKTtcbiAgICBzdGF0ZS5wb3BJbnB1dFN0cmVhbSgpO1xuICAgIHJldHVybiBhbnM7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICB2YXIgb2JqID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAob2JqICE9PSBjb21tb24uZmFpbCAmJiBvYmogJiYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnIHx8IHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbicpKSB7XG4gICAgdmFyIG51bU93blByb3BlcnRpZXNNYXRjaGVkID0gMDtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgdmFyIHByb3BlcnR5ID0gdGhpcy5wcm9wZXJ0aWVzW2lkeF07XG4gICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eS5uYW1lKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB2YXIgdmFsdWUgPSBvYmpbcHJvcGVydHkubmFtZV07XG4gICAgICB2YXIgdmFsdWVJbnB1dFN0cmVhbSA9IElucHV0U3RyZWFtLm5ld0Zvcih0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUgOiBbdmFsdWVdKTtcbiAgICAgIHN0YXRlLnB1c2hJbnB1dFN0cmVhbSh2YWx1ZUlucHV0U3RyZWFtKTtcbiAgICAgIHZhciBtYXRjaGVkID0gcHJvcGVydHkucGF0dGVybi5ldmFsKHN0YXRlKSAmJiAoc2tpcFNwYWNlc0lmQXBwcm9wcmlhdGUoc3RhdGUpLCBzdGF0ZS5pbnB1dFN0cmVhbS5hdEVuZCgpKTtcbiAgICAgIHN0YXRlLnBvcElucHV0U3RyZWFtKCk7XG4gICAgICBpZiAoIW1hdGNoZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgbnVtT3duUHJvcGVydGllc01hdGNoZWQrKztcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNMZW5pZW50KSB7XG4gICAgICB2YXIgcmVtYWluZGVyID0ge307XG4gICAgICBmb3IgKHZhciBwIGluIG9iaikge1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHApICYmIHRoaXMucHJvcGVydGllcy5pbmRleE9mKHApIDwgMCkge1xuICAgICAgICAgIHJlbWFpbmRlcltwXSA9IG9ialtwXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc3RhdGUuYmluZGluZ3MucHVzaChuZXcgTm9kZShzdGF0ZS5ncmFtbWFyLCAnX3Rlcm1pbmFsJywgW3JlbWFpbmRlcl0sIGlucHV0U3RyZWFtLmludGVydmFsRnJvbShvcmlnUG9zKSkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudW1Pd25Qcm9wZXJ0aWVzTWF0Y2hlZCA9PT0gT2JqZWN0LmtleXMob2JqKS5sZW5ndGg7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgZnVuY3Rpb24gdXNlTWVtb2l6ZWRSZXN1bHQobWVtb1JlY09yTFIpIHtcbiAgICBpbnB1dFN0cmVhbS5wb3MgPSBtZW1vUmVjT3JMUi5wb3M7XG4gICAgaWYgKG1lbW9SZWNPckxSLmZhaWx1cmVEZXNjcmlwdG9yKSB7XG4gICAgICBzdGF0ZS5yZWNvcmRGYWlsdXJlcyhtZW1vUmVjT3JMUi5mYWlsdXJlRGVzY3JpcHRvcik7XG4gICAgfVxuICAgIGlmIChtZW1vUmVjT3JMUi52YWx1ZSkge1xuICAgICAgYmluZGluZ3MucHVzaChtZW1vUmVjT3JMUi52YWx1ZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHZhciBydWxlTmFtZSA9IHRoaXMucnVsZU5hbWU7XG5cbiAgaWYgKGNvbW1vbi5pc1N5bnRhY3RpYyhydWxlTmFtZSkpIHtcbiAgICBza2lwU3BhY2VzKHN0YXRlKTtcbiAgfVxuXG4gIHZhciBncmFtbWFyID0gc3RhdGUuZ3JhbW1hcjtcbiAgdmFyIGJpbmRpbmdzID0gc3RhdGUuYmluZGluZ3M7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1Bvc0luZm8gPSBzdGF0ZS5nZXRDdXJyZW50UG9zSW5mbygpO1xuXG4gIHZhciBtZW1vUmVjID0gb3JpZ1Bvc0luZm8ubWVtb1tydWxlTmFtZV07XG4gIGlmIChtZW1vUmVjICYmIG9yaWdQb3NJbmZvLnNob3VsZFVzZU1lbW9pemVkUmVzdWx0KG1lbW9SZWMpKSB7XG4gICAgcmV0dXJuIHVzZU1lbW9pemVkUmVzdWx0KG1lbW9SZWMpO1xuICB9IGVsc2UgaWYgKG9yaWdQb3NJbmZvLmlzQWN0aXZlKHJ1bGVOYW1lKSkge1xuICAgIHZhciBjdXJyZW50TFIgPSBvcmlnUG9zSW5mby5nZXRDdXJyZW50TGVmdFJlY3Vyc2lvbigpO1xuICAgIGlmIChjdXJyZW50TFIgJiYgY3VycmVudExSLm5hbWUgPT09IHJ1bGVOYW1lKSB7XG4gICAgICBvcmlnUG9zSW5mby51cGRhdGVJbnZvbHZlZFJ1bGVzKCk7XG4gICAgICByZXR1cm4gdXNlTWVtb2l6ZWRSZXN1bHQoY3VycmVudExSKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3JpZ1Bvc0luZm8uc3RhcnRMZWZ0UmVjdXJzaW9uKHJ1bGVOYW1lKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJvZHkgPSBncmFtbWFyLnJ1bGVEaWN0W3J1bGVOYW1lXTtcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIC8vIFRPRE86IG1ha2UgdGhpcyBhIFwic3RhdGljXCIgY2hlY2tcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVW5kZWNsYXJlZFJ1bGUocnVsZU5hbWUpO1xuICAgIH1cbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICB2YXIgb3JpZ0ZhaWx1cmVEZXNjcmlwdG9yID0gc3RhdGUuZmFpbHVyZURlc2NyaXB0b3I7XG4gICAgdmFyIG5ld0ZhaWx1cmVEZXNjcmlwdG9yID0gc3RhdGUuZmFpbHVyZURlc2NyaXB0b3IgPSBzdGF0ZS5tYWtlRmFpbHVyZURlc2NyaXB0b3IoKTtcbiAgICBvcmlnUG9zSW5mby5lbnRlcih0aGlzKTtcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmV2YWxPbmNlKGJvZHksIHN0YXRlKTtcbiAgICB2YXIgY3VycmVudExSID0gb3JpZ1Bvc0luZm8uZ2V0Q3VycmVudExlZnRSZWN1cnNpb24oKTtcbiAgICBpZiAoY3VycmVudExSKSB7XG4gICAgICBpZiAoY3VycmVudExSLm5hbWUgPT09IHJ1bGVOYW1lKSB7XG4gICAgICAgIHZhbHVlID0gdGhpcy5oYW5kbGVMZWZ0UmVjdXJzaW9uKGJvZHksIHN0YXRlLCBvcmlnUG9zLCBjdXJyZW50TFIsIHZhbHVlKTtcbiAgICAgICAgb3JpZ1Bvc0luZm8ubWVtb1tydWxlTmFtZV0gPSB7cG9zOiBpbnB1dFN0cmVhbS5wb3MsIHZhbHVlOiB2YWx1ZSwgaW52b2x2ZWRSdWxlczogY3VycmVudExSLmludm9sdmVkUnVsZXN9O1xuICAgICAgICBvcmlnUG9zSW5mby5lbmRMZWZ0UmVjdXJzaW9uKHJ1bGVOYW1lKTtcbiAgICAgIH0gZWxzZSBpZiAoIWN1cnJlbnRMUi5pbnZvbHZlZFJ1bGVzW3J1bGVOYW1lXSkge1xuICAgICAgICAvLyBPbmx5IG1lbW9pemUgaWYgdGhpcyBydWxlIGlzIG5vdCBpbnZvbHZlZCBpbiB0aGUgY3VycmVudCBsZWZ0IHJlY3Vyc2lvblxuICAgICAgICBvcmlnUG9zSW5mby5tZW1vW3J1bGVOYW1lXSA9IHtwb3M6IGlucHV0U3RyZWFtLnBvcywgdmFsdWU6IHZhbHVlfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3JpZ1Bvc0luZm8ubWVtb1tydWxlTmFtZV0gPSB7cG9zOiBpbnB1dFN0cmVhbS5wb3MsIHZhbHVlOiB2YWx1ZX07XG4gICAgfVxuICAgIGlmIChvcmlnUG9zSW5mby5tZW1vW3J1bGVOYW1lXSkge1xuICAgICAgb3JpZ1Bvc0luZm8ubWVtb1tydWxlTmFtZV0uZmFpbHVyZURlc2NyaXB0b3IgPSBuZXdGYWlsdXJlRGVzY3JpcHRvcjtcbiAgICB9XG4gICAgdmFyIGFucztcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGJpbmRpbmdzLnB1c2godmFsdWUpO1xuICAgICAgaWYgKHN0YXRlLnJ1bGVTdGFjay5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaWYgKGNvbW1vbi5pc1N5bnRhY3RpYyhydWxlTmFtZSkpIHtcbiAgICAgICAgICBza2lwU3BhY2VzKHN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICBhbnMgPSBwZXhwcnMuZW5kLmV2YWwoc3RhdGUpO1xuICAgICAgICBiaW5kaW5ncy5wb3AoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFucyA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGFucyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChib2R5LmRlc2NyaXB0aW9uKSB7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgbmV3RmFpbHVyZURlc2NyaXB0b3IucG9zID0gLTE7ICAvLyBzbyB0aGF0IHRoZSBmYWlsdXJlcyBhcmUgaWdub3JlZFxuICAgICAgfSBlbHNlIGlmIChuZXdGYWlsdXJlRGVzY3JpcHRvci5wb3MgPD0gb3JpZ1Bvcykge1xuICAgICAgICBuZXdGYWlsdXJlRGVzY3JpcHRvci5wb3MgPSBvcmlnUG9zO1xuICAgICAgICBuZXdGYWlsdXJlRGVzY3JpcHRvci5leHBycyA9IFt0aGlzXTtcbiAgICAgIH1cbiAgICB9XG4vKlxuICAgIEhlcmUncyB0aGUgQnJpYW4gRm9yZCB2ZXJzaW9uICh3aGF0IGhlIGRlc2NyaWJlcyBpbiBoaXMgTWFzdGVyJ3MgdGhlc2lzKTpcblxuICAgIGlmIChib2R5LmRlc2NyaXB0aW9uICYmIG5ld0ZhaWx1cmVEZXNjcmlwdG9yLnBvcyA9PT0gb3JpZ1Bvcykge1xuICAgICAgbmV3RmFpbHVyZURlc2NyaXB0b3IucG9zID0gb3JpZ1BvcztcbiAgICAgIG5ld0ZhaWx1cmVEZXNjcmlwdG9yLmV4cHJzID0gW3RoaXNdO1xuICAgIH1cbiovXG5cbiAgICBzdGF0ZS5mYWlsdXJlRGVzY3JpcHRvciA9IG9yaWdGYWlsdXJlRGVzY3JpcHRvcjtcbiAgICBzdGF0ZS5yZWNvcmRGYWlsdXJlcyhuZXdGYWlsdXJlRGVzY3JpcHRvcik7XG4gICAgb3JpZ1Bvc0luZm8uZXhpdCgpO1xuICAgIHJldHVybiBhbnM7XG4gIH1cbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuZXZhbE9uY2UgPSBmdW5jdGlvbihleHByLCBzdGF0ZSkge1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIGlmIChleHByLmV2YWwoc3RhdGUpKSB7XG4gICAgdmFyIGFyaXR5ID0gZXhwci5nZXRBcml0eSgpO1xuICAgIHZhciBiaW5kaW5ncyA9IHN0YXRlLmJpbmRpbmdzLnNwbGljZShzdGF0ZS5iaW5kaW5ncy5sZW5ndGggLSBhcml0eSwgYXJpdHkpO1xuICAgIHZhciBhbnMgPSBuZXcgTm9kZShzdGF0ZS5ncmFtbWFyLCB0aGlzLnJ1bGVOYW1lLCBiaW5kaW5ncywgaW5wdXRTdHJlYW0uaW50ZXJ2YWxGcm9tKG9yaWdQb3MpKTtcbiAgICByZXR1cm4gYW5zO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5oYW5kbGVMZWZ0UmVjdXJzaW9uID0gZnVuY3Rpb24oYm9keSwgc3RhdGUsIG9yaWdQb3MsIGN1cnJlbnRMUiwgc2VlZFZhbHVlKSB7XG4gIGlmICghc2VlZFZhbHVlKSB7XG4gICAgcmV0dXJuIHNlZWRWYWx1ZTtcbiAgfVxuXG4gIHZhciB2YWx1ZSA9IHNlZWRWYWx1ZTtcbiAgY3VycmVudExSLnZhbHVlID0gc2VlZFZhbHVlO1xuICBjdXJyZW50TFIucG9zID0gc3RhdGUuaW5wdXRTdHJlYW0ucG9zO1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgIHZhbHVlID0gdGhpcy5ldmFsT25jZShib2R5LCBzdGF0ZSk7XG4gICAgaWYgKHZhbHVlICYmIGlucHV0U3RyZWFtLnBvcyA+IGN1cnJlbnRMUi5wb3MpIHtcbiAgICAgIGN1cnJlbnRMUi52YWx1ZSA9IHZhbHVlO1xuICAgICAgY3VycmVudExSLnBvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBjdXJyZW50TFIudmFsdWU7XG4gICAgICBpbnB1dFN0cmVhbS5wb3MgPSBjdXJyZW50TFIucG9zO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIDE7XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uKCkge1xuICAvLyBUaGlzIGlzIG9rIGIvYyBhbGwgdGVybXMgbXVzdCBoYXZlIHRoZSBzYW1lIGFyaXR5IC0tIHRoaXMgcHJvcGVydHkgaXMgY2hlY2tlZCBieSB0aGUgR3JhbW1hciBjb25zdHJ1Y3Rvci5cbiAgcmV0dXJuIHRoaXMudGVybXMubGVuZ3RoID09PSAwID8gMCA6IHRoaXMudGVybXNbMF0uZ2V0QXJpdHkoKTtcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBhcml0eSA9IDA7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgYXJpdHkgKz0gdGhpcy5mYWN0b3JzW2lkeF0uZ2V0QXJpdHkoKTtcbiAgfVxuICByZXR1cm4gYXJpdHk7XG59O1xuXG5wZXhwcnMuTWFueS5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5nZXRBcml0eSgpO1xufTtcblxucGV4cHJzLk9wdC5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5nZXRBcml0eSgpO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIDA7XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5leHByLmdldEFyaXR5KCk7XG59O1xuXG5wZXhwcnMuQXJyLnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5leHByLmdldEFyaXR5KCk7XG59O1xuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYXJpdHkgPSB0aGlzLmlzTGVuaWVudCA/IDEgOiAwO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGFyaXR5ICs9IHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uZ2V0QXJpdHkoKTtcbiAgfVxuICByZXR1cm4gYXJpdHk7XG59O1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoXCIuL2NvbW1vbi5qc1wiKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKFwiLi9wZXhwcnMuanNcIik7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGNvbW1vbi5hYnN0cmFjdDtcblxucGV4cHJzLmFueXRoaW5nLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiKSB7XG4gIHNiLmFwcGVuZChcInRoaXMuYW55dGhpbmcoKVwiKTtcbn07XG5cbnBleHBycy5lbmQub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IpIHtcbiAgc2IuYXBwZW5kKFwidGhpcy5lbmQoKVwiKTtcbn07XG5cbnBleHBycy5mYWlsLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiKSB7XG4gIHNiLmFwcGVuZChcInRoaXMuZmFpbCgpXCIpO1xufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiKSB7XG4gIHNiLmFwcGVuZChcInRoaXMucHJpbShcIik7XG4gIHNiLmFwcGVuZCh0eXBlb2YgdGhpcy5vYmogPT09IFwic3RyaW5nXCIgPyBjb21tb24udG9TdHJpbmdMaXRlcmFsKHRoaXMub2JqKSA6IFwiXCIgKyB0aGlzLm9iaik7XG4gIHNiLmFwcGVuZChcIilcIik7XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYikge1xuICBzYi5hcHBlbmQoXCJ0aGlzLmFsdChcIik7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChpZHggPiAwKSB7XG4gICAgICBzYi5hcHBlbmQoXCIsIFwiKTtcbiAgICB9XG4gICAgdGhpcy50ZXJtc1tpZHhdLm91dHB1dFJlY2lwZShzYik7XG4gIH1cbiAgc2IuYXBwZW5kKFwiKVwiKTtcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiKSB7XG4gIHNiLmFwcGVuZChcInRoaXMuc2VxKFwiKTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAoaWR4ID4gMCkge1xuICAgICAgc2IuYXBwZW5kKFwiLCBcIik7XG4gICAgfVxuICAgIHRoaXMuZmFjdG9yc1tpZHhdLm91dHB1dFJlY2lwZShzYik7XG4gIH1cbiAgc2IuYXBwZW5kKFwiKVwiKTtcbn07XG5cbnBleHBycy5NYW55LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYikge1xuICBzYi5hcHBlbmQoXCJ0aGlzLm1hbnkoXCIpO1xuICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHNiKTtcbiAgc2IuYXBwZW5kKFwiLCBcIik7XG4gIHNiLmFwcGVuZCh0aGlzLm1pbk51bU1hdGNoZXMpO1xuICBzYi5hcHBlbmQoXCIpXCIpO1xufTtcblxucGV4cHJzLk9wdC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IpIHtcbiAgc2IuYXBwZW5kKFwidGhpcy5vcHQoXCIpO1xuICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHNiKTtcbiAgc2IuYXBwZW5kKFwiKVwiKTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiKSB7XG4gIHNiLmFwcGVuZChcInRoaXMubm90KFwiKTtcbiAgdGhpcy5leHByLm91dHB1dFJlY2lwZShzYik7XG4gIHNiLmFwcGVuZChcIilcIik7XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYikge1xuICBzYi5hcHBlbmQoXCJ0aGlzLmxhKFwiKTtcbiAgdGhpcy5leHByLm91dHB1dFJlY2lwZShzYik7XG4gIHNiLmFwcGVuZChcIilcIik7XG59O1xuXG5wZXhwcnMuQXJyLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYikge1xuICBzYi5hcHBlbmQoXCJ0aGlzLmFycihcIik7XG4gIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUoc2IpO1xuICBzYi5hcHBlbmQoXCIpXCIpO1xufTtcblxucGV4cHJzLk9iai5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IpIHtcbiAgZnVuY3Rpb24gb3V0cHV0UHJvcGVydHlSZWNpcGUocHJvcCkge1xuICAgIHNiLmFwcGVuZChcIntuYW1lOiBcIik7XG4gICAgc2IuYXBwZW5kKGNvbW1vbi50b1N0cmluZ0xpdGVyYWwocHJvcC5uYW1lKSk7XG4gICAgc2IuYXBwZW5kKFwiLCBwYXR0ZXJuOiBcIik7XG4gICAgcHJvcC5wYXR0ZXJuLm91dHB1dFJlY2lwZShzYik7XG4gICAgc2IuYXBwZW5kKFwifVwiKTtcbiAgfVxuXG4gIHNiLmFwcGVuZChcInRoaXMub2JqKFtcIik7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKGlkeCA+IDApIHtcbiAgICAgIHNiLmFwcGVuZChcIiwgXCIpO1xuICAgIH1cbiAgICBvdXRwdXRQcm9wZXJ0eVJlY2lwZSh0aGlzLnByb3BlcnRpZXNbaWR4XSk7XG4gIH1cbiAgc2IuYXBwZW5kKFwiXSwgXCIpO1xuICBzYi5hcHBlbmQoISF0aGlzLmlzTGVuaWVudCk7XG4gIHNiLmFwcGVuZChcIilcIik7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiKSB7XG4gIHNiLmFwcGVuZChcInRoaXMuYXBwKFwiKTtcbiAgc2IuYXBwZW5kKGNvbW1vbi50b1N0cmluZ0xpdGVyYWwodGhpcy5ydWxlTmFtZSkpO1xuICBzYi5hcHBlbmQoXCIpXCIpO1xufTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzLmpzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLnRvRXhwZWN0ZWQgPSBmdW5jdGlvbihydWxlRGljdCkge1xuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxucGV4cHJzLmFueXRoaW5nLnRvRXhwZWN0ZWQgPSBmdW5jdGlvbihydWxlRGljdCkge1xuICByZXR1cm4gXCJhbnkgb2JqZWN0XCI7XG59O1xuXG5wZXhwcnMuZW5kLnRvRXhwZWN0ZWQgPSBmdW5jdGlvbihydWxlRGljdCkge1xuICByZXR1cm4gXCJlbmQgb2YgaW5wdXRcIjtcbn07XG5cbnBleHBycy5mYWlsLnRvRXhwZWN0ZWQgPSBmdW5jdGlvbihydWxlRGljdCkge1xuICByZXR1cm4gXCJoZWxsIHRvIGZyZWV6ZSBvdmVyXCI7XG59O1xuXG5wZXhwcnMuUHJpbS5wcm90b3R5cGUudG9FeHBlY3RlZCA9IGZ1bmN0aW9uKHJ1bGVEaWN0KSB7XG4gIHJldHVybiBjb21tb24udG9TdHJpbmdMaXRlcmFsKHRoaXMub2JqKTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLnRvRXhwZWN0ZWQgPSBmdW5jdGlvbihydWxlRGljdCkge1xuICBpZiAodGhpcy5leHByID09PSBwZXhwcnMuYW55dGhpbmcpIHtcbiAgICByZXR1cm4gXCJub3RoaW5nXCI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwibm90IFwiICsgdGhpcy5leHByLnRvRXhwZWN0ZWQocnVsZURpY3QpO1xuICB9XG59O1xuXG4vLyBUT0RPOiB0aGluayBhYm91dCBBcnIgYW5kIE9ialxuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnRvRXhwZWN0ZWQgPSBmdW5jdGlvbihydWxlRGljdCkge1xuICB2YXIgZGVzY3JpcHRpb24gPSBydWxlRGljdFt0aGlzLnJ1bGVOYW1lXS5kZXNjcmlwdGlvbjtcbiAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgcmV0dXJuIGRlc2NyaXB0aW9uO1xuICB9IGVsc2Uge1xuICAgIHZhciBhcnRpY2xlID0gL15bYWVpb3VBRUlPVV0vLnRlc3QodGhpcy5ydWxlTmFtZSkgPyBcImFuXCIgOiBcImFcIjtcbiAgICByZXR1cm4gYXJ0aWNsZSArIFwiIFwiICsgdGhpcy5ydWxlTmFtZTtcbiAgfVxufTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKFwiLi9jb21tb24uanNcIik7XG52YXIgZXJyb3JzID0gcmVxdWlyZShcIi4vZXJyb3JzLmpzXCIpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gR2VuZXJhbCBzdHVmZlxuXG5mdW5jdGlvbiBQRXhwcigpIHtcbiAgdGhyb3cgbmV3IEVycm9yKFwiUEV4cHIgY2Fubm90IGJlIGluc3RhbnRpYXRlZCAtLSBpdCdzIGFic3RyYWN0XCIpO1xufVxuXG5QRXhwci5wcm90b3R5cGUud2l0aERlc2NyaXB0aW9uID0gZnVuY3Rpb24oZGVzY3JpcHRpb24pIHtcbiAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIEFueXRoaW5nXG5cbnZhciBhbnl0aGluZyA9IE9iamVjdC5jcmVhdGUoUEV4cHIucHJvdG90eXBlKTtcblxuLy8gRW5kXG5cbnZhciBlbmQgPSBPYmplY3QuY3JlYXRlKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIEZhaWxcblxudmFyIGZhaWwgPSBPYmplY3QuY3JlYXRlKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIFByaW1pdGl2ZXNcblxuZnVuY3Rpb24gUHJpbShvYmopIHtcbiAgdGhpcy5vYmogPSBvYmo7XG59XG5cblByaW0ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQRXhwci5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBTdHJpbmdQcmltKG9iaikge1xuICB0aGlzLm9iaiA9IG9iajtcbn1cblxuU3RyaW5nUHJpbS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFByaW0ucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gUmVnRXhwUHJpbShvYmopIHtcbiAgdGhpcy5vYmogPSBvYmo7XG59XG5cblJlZ0V4cFByaW0ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQcmltLnByb3RvdHlwZSk7XG5cbi8vIEFsdGVybmF0aW9uXG5cbmZ1bmN0aW9uIEFsdCh0ZXJtcykge1xuICB0aGlzLnRlcm1zID0gdGVybXM7XG59XG5cbkFsdC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIEV4dGVuZCBpcyBhbiBpbXBsZW1lbnRhdGlvbiBkZXRhaWwgb2YgcnVsZSBleHRlbnNpb25cblxuZnVuY3Rpb24gRXh0ZW5kKHN1cGVyR3JhbW1hciwgbmFtZSwgYm9keSkge1xuICB2YXIgb3JpZ0JvZHkgPSBzdXBlckdyYW1tYXIucnVsZURpY3RbbmFtZV07XG4gIHRoaXMudGVybXMgPSBbYm9keSwgb3JpZ0JvZHldO1xufVxuXG5FeHRlbmQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBbHQucHJvdG90eXBlKTtcblxuLy8gU2VxdWVuY2VzXG5cbmZ1bmN0aW9uIFNlcShmYWN0b3JzKSB7XG4gIHRoaXMuZmFjdG9ycyA9IGZhY3RvcnM7XG59XG5cblNlcS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIEl0ZXJhdG9ycyBhbmQgb3B0aW9uYWxzXG5cbmZ1bmN0aW9uIE1hbnkoZXhwciwgbWluTnVtTWF0Y2hlcykge1xuICB0aGlzLmV4cHIgPSBleHByO1xuICB0aGlzLm1pbk51bU1hdGNoZXMgPSBtaW5OdW1NYXRjaGVzO1xufVxuXG5NYW55LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUEV4cHIucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gT3B0KGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwcjtcbn1cblxuT3B0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUEV4cHIucHJvdG90eXBlKTtcblxuLy8gUHJlZGljYXRlc1xuXG5mdW5jdGlvbiBOb3QoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuXG5Ob3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQRXhwci5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBMb29rYWhlYWQoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuXG5Mb29rYWhlYWQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQRXhwci5wcm90b3R5cGUpO1xuXG4vLyBBcnJheSBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIEFycihleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5cbkFyci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIE9iamVjdCBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIE9iaihwcm9wZXJ0aWVzLCBpc0xlbmllbnQpIHtcbiAgdmFyIG5hbWVzID0gcHJvcGVydGllcy5tYXAoZnVuY3Rpb24ocHJvcGVydHkpIHsgcmV0dXJuIHByb3BlcnR5Lm5hbWU7IH0pO1xuICB2YXIgZHVwbGljYXRlcyA9IGNvbW1vbi5nZXREdXBsaWNhdGVzKG5hbWVzKTtcbiAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuRHVwbGljYXRlUHJvcGVydHlOYW1lcyhkdXBsaWNhdGVzKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgIHRoaXMuaXNMZW5pZW50ID0gaXNMZW5pZW50O1xuICB9XG59XG5cbk9iai5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIFJ1bGUgYXBwbGljYXRpb25cblxuZnVuY3Rpb24gQXBwbHkocnVsZU5hbWUsIG9wdEZyb21JbnRlcnZhbCkge1xuICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWU7XG4gIGlmIChvcHRGcm9tSW50ZXJ2YWwpIHtcbiAgICB0aGlzLmZyb21JbnRlcnZhbCA9IG9wdEZyb21JbnRlcnZhbDtcbiAgfVxufVxuXG5BcHBseS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLm1ha2VQcmltID0gZnVuY3Rpb24ob2JqKSB7XG4gIGlmICh0eXBlb2Ygb2JqID09PSBcInN0cmluZ1wiICYmIG9iai5sZW5ndGggIT09IDEpIHtcbiAgICByZXR1cm4gbmV3IFN0cmluZ1ByaW0ob2JqKTtcbiAgfVxuICBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cFByaW0ob2JqKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFByaW0ob2JqKTtcbiAgfVxufTtcblxuZXhwb3J0cy5QRXhwciA9IFBFeHByO1xuZXhwb3J0cy5hbnl0aGluZyA9IGFueXRoaW5nO1xuZXhwb3J0cy5lbmQgPSBlbmQ7XG5leHBvcnRzLmZhaWwgPSBmYWlsO1xuZXhwb3J0cy5QcmltID0gUHJpbTtcbmV4cG9ydHMuU3RyaW5nUHJpbSA9IFN0cmluZ1ByaW07XG5leHBvcnRzLlJlZ0V4cFByaW0gPSBSZWdFeHBQcmltO1xuZXhwb3J0cy5BbHQgPSBBbHQ7XG5leHBvcnRzLkV4dGVuZCA9IEV4dGVuZDtcbmV4cG9ydHMuU2VxID0gU2VxO1xuZXhwb3J0cy5NYW55ID0gTWFueTtcbmV4cG9ydHMuT3B0ID0gT3B0O1xuZXhwb3J0cy5Ob3QgPSBOb3Q7XG5leHBvcnRzLkxvb2thaGVhZCA9IExvb2thaGVhZDtcbmV4cG9ydHMuQXJyID0gQXJyO1xuZXhwb3J0cy5PYmogPSBPYmo7XG5leHBvcnRzLkFwcGx5ID0gQXBwbHk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHRlbnNpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5yZXF1aXJlKFwiLi9wZXhwcnMtYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uLmpzXCIpO1xucmVxdWlyZShcIi4vcGV4cHJzLWFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkLmpzXCIpO1xucmVxdWlyZShcIi4vcGV4cHJzLWFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5LmpzXCIpO1xucmVxdWlyZShcIi4vcGV4cHJzLWNoZWNrLmpzXCIpO1xucmVxdWlyZShcIi4vcGV4cHJzLWdldEFyaXR5LmpzXCIpO1xucmVxdWlyZShcIi4vcGV4cHJzLWV2YWwuanNcIik7XG5yZXF1aXJlKFwiLi9wZXhwcnMtb3V0cHV0UmVjaXBlLmpzXCIpO1xucmVxdWlyZShcIi4vcGV4cHJzLXRvRXhwZWN0ZWQuanNcIik7XG5cbiIsIi8vIEZyb20gaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC9lcy1sYWIvc291cmNlL2Jyb3dzZS90cnVuay9zcmMvcGFyc2VyL3VuaWNvZGUuanNcbmV4cG9ydHMuVW5pY29kZUNhdGVnb3JpZXMgPSB7XG4gIFpXTkogOiAvXFx1MjAwQy8sXG4gIFpXSiAgOiAvXFx1MjAwRC8sXG4gIFRBQiAgOiAvXFx1MDAwOS8sXG4gIFZUICAgOiAvXFx1MDAwQi8sXG4gIEZGICAgOiAvXFx1MDAwQy8sXG4gIFNQICAgOiAvXFx1MDAyMC8sXG4gIE5CU1AgOiAvXFx1MDBBMC8sXG4gIEJPTSAgOiAvXFx1RkVGRi8sXG4gIExGICAgOiAvXFx1MDAwQS8sXG4gIENSICAgOiAvXFx1MDAwRC8sXG4gIExTICAgOiAvXFx1MjAyOC8sXG4gIFBTICAgOiAvXFx1MjAyOS8sXG4gIEwgICAgOiAvW1xcdTAwNDEtXFx1MDA1QV18W1xcdTAwQzAtXFx1MDBENl18W1xcdTAwRDgtXFx1MDBERV18W1xcdTAxMDAtXFx1MDEwMF18W1xcdTAxMDItXFx1MDEwMl18W1xcdTAxMDQtXFx1MDEwNF18W1xcdTAxMDYtXFx1MDEwNl18W1xcdTAxMDgtXFx1MDEwOF18W1xcdTAxMEEtXFx1MDEwQV18W1xcdTAxMEMtXFx1MDEwQ118W1xcdTAxMEUtXFx1MDEwRV18W1xcdTAxMTAtXFx1MDExMF18W1xcdTAxMTItXFx1MDExMl18W1xcdTAxMTQtXFx1MDExNF18W1xcdTAxMTYtXFx1MDExNl18W1xcdTAxMTgtXFx1MDExOF18W1xcdTAxMUEtXFx1MDExQV18W1xcdTAxMUMtXFx1MDExQ118W1xcdTAxMUUtXFx1MDExRV18W1xcdTAxMjAtXFx1MDEyMF18W1xcdTAxMjItXFx1MDEyMl18W1xcdTAxMjQtXFx1MDEyNF18W1xcdTAxMjYtXFx1MDEyNl18W1xcdTAxMjgtXFx1MDEyOF18W1xcdTAxMkEtXFx1MDEyQV18W1xcdTAxMkMtXFx1MDEyQ118W1xcdTAxMkUtXFx1MDEyRV18W1xcdTAxMzAtXFx1MDEzMF18W1xcdTAxMzItXFx1MDEzMl18W1xcdTAxMzQtXFx1MDEzNF18W1xcdTAxMzYtXFx1MDEzNl18W1xcdTAxMzktXFx1MDEzOV18W1xcdTAxM0ItXFx1MDEzQl18W1xcdTAxM0QtXFx1MDEzRF18W1xcdTAxM0YtXFx1MDEzRl18W1xcdTAxNDEtXFx1MDE0MV18W1xcdTAxNDMtXFx1MDE0M118W1xcdTAxNDUtXFx1MDE0NV18W1xcdTAxNDctXFx1MDE0N118W1xcdTAxNEEtXFx1MDE0QV18W1xcdTAxNEMtXFx1MDE0Q118W1xcdTAxNEUtXFx1MDE0RV18W1xcdTAxNTAtXFx1MDE1MF18W1xcdTAxNTItXFx1MDE1Ml18W1xcdTAxNTQtXFx1MDE1NF18W1xcdTAxNTYtXFx1MDE1Nl18W1xcdTAxNTgtXFx1MDE1OF18W1xcdTAxNUEtXFx1MDE1QV18W1xcdTAxNUMtXFx1MDE1Q118W1xcdTAxNUUtXFx1MDE1RV18W1xcdTAxNjAtXFx1MDE2MF18W1xcdTAxNjItXFx1MDE2Ml18W1xcdTAxNjQtXFx1MDE2NF18W1xcdTAxNjYtXFx1MDE2Nl18W1xcdTAxNjgtXFx1MDE2OF18W1xcdTAxNkEtXFx1MDE2QV18W1xcdTAxNkMtXFx1MDE2Q118W1xcdTAxNkUtXFx1MDE2RV18W1xcdTAxNzAtXFx1MDE3MF18W1xcdTAxNzItXFx1MDE3Ml18W1xcdTAxNzQtXFx1MDE3NF18W1xcdTAxNzYtXFx1MDE3Nl18W1xcdTAxNzgtXFx1MDE3OV18W1xcdTAxN0ItXFx1MDE3Ql18W1xcdTAxN0QtXFx1MDE3RF18W1xcdTAxODEtXFx1MDE4Ml18W1xcdTAxODQtXFx1MDE4NF18W1xcdTAxODYtXFx1MDE4N118W1xcdTAxODktXFx1MDE4Ql18W1xcdTAxOEUtXFx1MDE5MV18W1xcdTAxOTMtXFx1MDE5NF18W1xcdTAxOTYtXFx1MDE5OF18W1xcdTAxOUMtXFx1MDE5RF18W1xcdTAxOUYtXFx1MDFBMF18W1xcdTAxQTItXFx1MDFBMl18W1xcdTAxQTQtXFx1MDFBNF18W1xcdTAxQTYtXFx1MDFBN118W1xcdTAxQTktXFx1MDFBOV18W1xcdTAxQUMtXFx1MDFBQ118W1xcdTAxQUUtXFx1MDFBRl18W1xcdTAxQjEtXFx1MDFCM118W1xcdTAxQjUtXFx1MDFCNV18W1xcdTAxQjctXFx1MDFCOF18W1xcdTAxQkMtXFx1MDFCQ118W1xcdTAxQzQtXFx1MDFDNF18W1xcdTAxQzctXFx1MDFDN118W1xcdTAxQ0EtXFx1MDFDQV18W1xcdTAxQ0QtXFx1MDFDRF18W1xcdTAxQ0YtXFx1MDFDRl18W1xcdTAxRDEtXFx1MDFEMV18W1xcdTAxRDMtXFx1MDFEM118W1xcdTAxRDUtXFx1MDFENV18W1xcdTAxRDctXFx1MDFEN118W1xcdTAxRDktXFx1MDFEOV18W1xcdTAxREItXFx1MDFEQl18W1xcdTAxREUtXFx1MDFERV18W1xcdTAxRTAtXFx1MDFFMF18W1xcdTAxRTItXFx1MDFFMl18W1xcdTAxRTQtXFx1MDFFNF18W1xcdTAxRTYtXFx1MDFFNl18W1xcdTAxRTgtXFx1MDFFOF18W1xcdTAxRUEtXFx1MDFFQV18W1xcdTAxRUMtXFx1MDFFQ118W1xcdTAxRUUtXFx1MDFFRV18W1xcdTAxRjEtXFx1MDFGMV18W1xcdTAxRjQtXFx1MDFGNF18W1xcdTAxRkEtXFx1MDFGQV18W1xcdTAxRkMtXFx1MDFGQ118W1xcdTAxRkUtXFx1MDFGRV18W1xcdTAyMDAtXFx1MDIwMF18W1xcdTAyMDItXFx1MDIwMl18W1xcdTAyMDQtXFx1MDIwNF18W1xcdTAyMDYtXFx1MDIwNl18W1xcdTAyMDgtXFx1MDIwOF18W1xcdTAyMEEtXFx1MDIwQV18W1xcdTAyMEMtXFx1MDIwQ118W1xcdTAyMEUtXFx1MDIwRV18W1xcdTAyMTAtXFx1MDIxMF18W1xcdTAyMTItXFx1MDIxMl18W1xcdTAyMTQtXFx1MDIxNF18W1xcdTAyMTYtXFx1MDIxNl18W1xcdTAzODYtXFx1MDM4Nl18W1xcdTAzODgtXFx1MDM4QV18W1xcdTAzOEMtXFx1MDM4Q118W1xcdTAzOEUtXFx1MDM4Rl18W1xcdTAzOTEtXFx1MDNBMV18W1xcdTAzQTMtXFx1MDNBQl18W1xcdTAzRDItXFx1MDNENF18W1xcdTAzREEtXFx1MDNEQV18W1xcdTAzREMtXFx1MDNEQ118W1xcdTAzREUtXFx1MDNERV18W1xcdTAzRTAtXFx1MDNFMF18W1xcdTAzRTItXFx1MDNFMl18W1xcdTAzRTQtXFx1MDNFNF18W1xcdTAzRTYtXFx1MDNFNl18W1xcdTAzRTgtXFx1MDNFOF18W1xcdTAzRUEtXFx1MDNFQV18W1xcdTAzRUMtXFx1MDNFQ118W1xcdTAzRUUtXFx1MDNFRV18W1xcdTA0MDEtXFx1MDQwQ118W1xcdTA0MEUtXFx1MDQyRl18W1xcdTA0NjAtXFx1MDQ2MF18W1xcdTA0NjItXFx1MDQ2Ml18W1xcdTA0NjQtXFx1MDQ2NF18W1xcdTA0NjYtXFx1MDQ2Nl18W1xcdTA0NjgtXFx1MDQ2OF18W1xcdTA0NkEtXFx1MDQ2QV18W1xcdTA0NkMtXFx1MDQ2Q118W1xcdTA0NkUtXFx1MDQ2RV18W1xcdTA0NzAtXFx1MDQ3MF18W1xcdTA0NzItXFx1MDQ3Ml18W1xcdTA0NzQtXFx1MDQ3NF18W1xcdTA0NzYtXFx1MDQ3Nl18W1xcdTA0NzgtXFx1MDQ3OF18W1xcdTA0N0EtXFx1MDQ3QV18W1xcdTA0N0MtXFx1MDQ3Q118W1xcdTA0N0UtXFx1MDQ3RV18W1xcdTA0ODAtXFx1MDQ4MF18W1xcdTA0OTAtXFx1MDQ5MF18W1xcdTA0OTItXFx1MDQ5Ml18W1xcdTA0OTQtXFx1MDQ5NF18W1xcdTA0OTYtXFx1MDQ5Nl18W1xcdTA0OTgtXFx1MDQ5OF18W1xcdTA0OUEtXFx1MDQ5QV18W1xcdTA0OUMtXFx1MDQ5Q118W1xcdTA0OUUtXFx1MDQ5RV18W1xcdTA0QTAtXFx1MDRBMF18W1xcdTA0QTItXFx1MDRBMl18W1xcdTA0QTQtXFx1MDRBNF18W1xcdTA0QTYtXFx1MDRBNl18W1xcdTA0QTgtXFx1MDRBOF18W1xcdTA0QUEtXFx1MDRBQV18W1xcdTA0QUMtXFx1MDRBQ118W1xcdTA0QUUtXFx1MDRBRV18W1xcdTA0QjAtXFx1MDRCMF18W1xcdTA0QjItXFx1MDRCMl18W1xcdTA0QjQtXFx1MDRCNF18W1xcdTA0QjYtXFx1MDRCNl18W1xcdTA0QjgtXFx1MDRCOF18W1xcdTA0QkEtXFx1MDRCQV18W1xcdTA0QkMtXFx1MDRCQ118W1xcdTA0QkUtXFx1MDRCRV18W1xcdTA0QzEtXFx1MDRDMV18W1xcdTA0QzMtXFx1MDRDM118W1xcdTA0QzctXFx1MDRDN118W1xcdTA0Q0ItXFx1MDRDQl18W1xcdTA0RDAtXFx1MDREMF18W1xcdTA0RDItXFx1MDREMl18W1xcdTA0RDQtXFx1MDRENF18W1xcdTA0RDYtXFx1MDRENl18W1xcdTA0RDgtXFx1MDREOF18W1xcdTA0REEtXFx1MDREQV18W1xcdTA0REMtXFx1MDREQ118W1xcdTA0REUtXFx1MDRERV18W1xcdTA0RTAtXFx1MDRFMF18W1xcdTA0RTItXFx1MDRFMl18W1xcdTA0RTQtXFx1MDRFNF18W1xcdTA0RTYtXFx1MDRFNl18W1xcdTA0RTgtXFx1MDRFOF18W1xcdTA0RUEtXFx1MDRFQV18W1xcdTA0RUUtXFx1MDRFRV18W1xcdTA0RjAtXFx1MDRGMF18W1xcdTA0RjItXFx1MDRGMl18W1xcdTA0RjQtXFx1MDRGNF18W1xcdTA0RjgtXFx1MDRGOF18W1xcdTA1MzEtXFx1MDU1Nl18W1xcdTEwQTAtXFx1MTBDNV18W1xcdTFFMDAtXFx1MUUwMF18W1xcdTFFMDItXFx1MUUwMl18W1xcdTFFMDQtXFx1MUUwNF18W1xcdTFFMDYtXFx1MUUwNl18W1xcdTFFMDgtXFx1MUUwOF18W1xcdTFFMEEtXFx1MUUwQV18W1xcdTFFMEMtXFx1MUUwQ118W1xcdTFFMEUtXFx1MUUwRV18W1xcdTFFMTAtXFx1MUUxMF18W1xcdTFFMTItXFx1MUUxMl18W1xcdTFFMTQtXFx1MUUxNF18W1xcdTFFMTYtXFx1MUUxNl18W1xcdTFFMTgtXFx1MUUxOF18W1xcdTFFMUEtXFx1MUUxQV18W1xcdTFFMUMtXFx1MUUxQ118W1xcdTFFMUUtXFx1MUUxRV18W1xcdTFFMjAtXFx1MUUyMF18W1xcdTFFMjItXFx1MUUyMl18W1xcdTFFMjQtXFx1MUUyNF18W1xcdTFFMjYtXFx1MUUyNl18W1xcdTFFMjgtXFx1MUUyOF18W1xcdTFFMkEtXFx1MUUyQV18W1xcdTFFMkMtXFx1MUUyQ118W1xcdTFFMkUtXFx1MUUyRV18W1xcdTFFMzAtXFx1MUUzMF18W1xcdTFFMzItXFx1MUUzMl18W1xcdTFFMzQtXFx1MUUzNF18W1xcdTFFMzYtXFx1MUUzNl18W1xcdTFFMzgtXFx1MUUzOF18W1xcdTFFM0EtXFx1MUUzQV18W1xcdTFFM0MtXFx1MUUzQ118W1xcdTFFM0UtXFx1MUUzRV18W1xcdTFFNDAtXFx1MUU0MF18W1xcdTFFNDItXFx1MUU0Ml18W1xcdTFFNDQtXFx1MUU0NF18W1xcdTFFNDYtXFx1MUU0Nl18W1xcdTFFNDgtXFx1MUU0OF18W1xcdTFFNEEtXFx1MUU0QV18W1xcdTFFNEMtXFx1MUU0Q118W1xcdTFFNEUtXFx1MUU0RV18W1xcdTFFNTAtXFx1MUU1MF18W1xcdTFFNTItXFx1MUU1Ml18W1xcdTFFNTQtXFx1MUU1NF18W1xcdTFFNTYtXFx1MUU1Nl18W1xcdTFFNTgtXFx1MUU1OF18W1xcdTFFNUEtXFx1MUU1QV18W1xcdTFFNUMtXFx1MUU1Q118W1xcdTFFNUUtXFx1MUU1RV18W1xcdTFFNjAtXFx1MUU2MF18W1xcdTFFNjItXFx1MUU2Ml18W1xcdTFFNjQtXFx1MUU2NF18W1xcdTFFNjYtXFx1MUU2Nl18W1xcdTFFNjgtXFx1MUU2OF18W1xcdTFFNkEtXFx1MUU2QV18W1xcdTFFNkMtXFx1MUU2Q118W1xcdTFFNkUtXFx1MUU2RV18W1xcdTFFNzAtXFx1MUU3MF18W1xcdTFFNzItXFx1MUU3Ml18W1xcdTFFNzQtXFx1MUU3NF18W1xcdTFFNzYtXFx1MUU3Nl18W1xcdTFFNzgtXFx1MUU3OF18W1xcdTFFN0EtXFx1MUU3QV18W1xcdTFFN0MtXFx1MUU3Q118W1xcdTFFN0UtXFx1MUU3RV18W1xcdTFFODAtXFx1MUU4MF18W1xcdTFFODItXFx1MUU4Ml18W1xcdTFFODQtXFx1MUU4NF18W1xcdTFFODYtXFx1MUU4Nl18W1xcdTFFODgtXFx1MUU4OF18W1xcdTFFOEEtXFx1MUU4QV18W1xcdTFFOEMtXFx1MUU4Q118W1xcdTFFOEUtXFx1MUU4RV18W1xcdTFFOTAtXFx1MUU5MF18W1xcdTFFOTItXFx1MUU5Ml18W1xcdTFFOTQtXFx1MUU5NF18W1xcdTFFQTAtXFx1MUVBMF18W1xcdTFFQTItXFx1MUVBMl18W1xcdTFFQTQtXFx1MUVBNF18W1xcdTFFQTYtXFx1MUVBNl18W1xcdTFFQTgtXFx1MUVBOF18W1xcdTFFQUEtXFx1MUVBQV18W1xcdTFFQUMtXFx1MUVBQ118W1xcdTFFQUUtXFx1MUVBRV18W1xcdTFFQjAtXFx1MUVCMF18W1xcdTFFQjItXFx1MUVCMl18W1xcdTFFQjQtXFx1MUVCNF18W1xcdTFFQjYtXFx1MUVCNl18W1xcdTFFQjgtXFx1MUVCOF18W1xcdTFFQkEtXFx1MUVCQV18W1xcdTFFQkMtXFx1MUVCQ118W1xcdTFFQkUtXFx1MUVCRV18W1xcdTFFQzAtXFx1MUVDMF18W1xcdTFFQzItXFx1MUVDMl18W1xcdTFFQzQtXFx1MUVDNF18W1xcdTFFQzYtXFx1MUVDNl18W1xcdTFFQzgtXFx1MUVDOF18W1xcdTFFQ0EtXFx1MUVDQV18W1xcdTFFQ0MtXFx1MUVDQ118W1xcdTFFQ0UtXFx1MUVDRV18W1xcdTFFRDAtXFx1MUVEMF18W1xcdTFFRDItXFx1MUVEMl18W1xcdTFFRDQtXFx1MUVENF18W1xcdTFFRDYtXFx1MUVENl18W1xcdTFFRDgtXFx1MUVEOF18W1xcdTFFREEtXFx1MUVEQV18W1xcdTFFREMtXFx1MUVEQ118W1xcdTFFREUtXFx1MUVERV18W1xcdTFFRTAtXFx1MUVFMF18W1xcdTFFRTItXFx1MUVFMl18W1xcdTFFRTQtXFx1MUVFNF18W1xcdTFFRTYtXFx1MUVFNl18W1xcdTFFRTgtXFx1MUVFOF18W1xcdTFFRUEtXFx1MUVFQV18W1xcdTFFRUMtXFx1MUVFQ118W1xcdTFFRUUtXFx1MUVFRV18W1xcdTFFRjAtXFx1MUVGMF18W1xcdTFFRjItXFx1MUVGMl18W1xcdTFFRjQtXFx1MUVGNF18W1xcdTFFRjYtXFx1MUVGNl18W1xcdTFFRjgtXFx1MUVGOF18W1xcdTFGMDgtXFx1MUYwRl18W1xcdTFGMTgtXFx1MUYxRF18W1xcdTFGMjgtXFx1MUYyRl18W1xcdTFGMzgtXFx1MUYzRl18W1xcdTFGNDgtXFx1MUY0RF18W1xcdTFGNTktXFx1MUY1OV18W1xcdTFGNUItXFx1MUY1Ql18W1xcdTFGNUQtXFx1MUY1RF18W1xcdTFGNUYtXFx1MUY1Rl18W1xcdTFGNjgtXFx1MUY2Rl18W1xcdTFGODgtXFx1MUY4Rl18W1xcdTFGOTgtXFx1MUY5Rl18W1xcdTFGQTgtXFx1MUZBRl18W1xcdTFGQjgtXFx1MUZCQ118W1xcdTFGQzgtXFx1MUZDQ118W1xcdTFGRDgtXFx1MUZEQl18W1xcdTFGRTgtXFx1MUZFQ118W1xcdTFGRjgtXFx1MUZGQ118W1xcdTIxMDItXFx1MjEwMl18W1xcdTIxMDctXFx1MjEwN118W1xcdTIxMEItXFx1MjEwRF18W1xcdTIxMTAtXFx1MjExMl18W1xcdTIxMTUtXFx1MjExNV18W1xcdTIxMTktXFx1MjExRF18W1xcdTIxMjQtXFx1MjEyNF18W1xcdTIxMjYtXFx1MjEyNl18W1xcdTIxMjgtXFx1MjEyOF18W1xcdTIxMkEtXFx1MjEyRF18W1xcdTIxMzAtXFx1MjEzMV18W1xcdTIxMzMtXFx1MjEzM118W1xcdUZGMjEtXFx1RkYzQV18W1xcdTAwNjEtXFx1MDA3QV18W1xcdTAwQUEtXFx1MDBBQV18W1xcdTAwQjUtXFx1MDBCNV18W1xcdTAwQkEtXFx1MDBCQV18W1xcdTAwREYtXFx1MDBGNl18W1xcdTAwRjgtXFx1MDBGRl18W1xcdTAxMDEtXFx1MDEwMV18W1xcdTAxMDMtXFx1MDEwM118W1xcdTAxMDUtXFx1MDEwNV18W1xcdTAxMDctXFx1MDEwN118W1xcdTAxMDktXFx1MDEwOV18W1xcdTAxMEItXFx1MDEwQl18W1xcdTAxMEQtXFx1MDEwRF18W1xcdTAxMEYtXFx1MDEwRl18W1xcdTAxMTEtXFx1MDExMV18W1xcdTAxMTMtXFx1MDExM118W1xcdTAxMTUtXFx1MDExNV18W1xcdTAxMTctXFx1MDExN118W1xcdTAxMTktXFx1MDExOV18W1xcdTAxMUItXFx1MDExQl18W1xcdTAxMUQtXFx1MDExRF18W1xcdTAxMUYtXFx1MDExRl18W1xcdTAxMjEtXFx1MDEyMV18W1xcdTAxMjMtXFx1MDEyM118W1xcdTAxMjUtXFx1MDEyNV18W1xcdTAxMjctXFx1MDEyN118W1xcdTAxMjktXFx1MDEyOV18W1xcdTAxMkItXFx1MDEyQl18W1xcdTAxMkQtXFx1MDEyRF18W1xcdTAxMkYtXFx1MDEyRl18W1xcdTAxMzEtXFx1MDEzMV18W1xcdTAxMzMtXFx1MDEzM118W1xcdTAxMzUtXFx1MDEzNV18W1xcdTAxMzctXFx1MDEzOF18W1xcdTAxM0EtXFx1MDEzQV18W1xcdTAxM0MtXFx1MDEzQ118W1xcdTAxM0UtXFx1MDEzRV18W1xcdTAxNDAtXFx1MDE0MF18W1xcdTAxNDItXFx1MDE0Ml18W1xcdTAxNDQtXFx1MDE0NF18W1xcdTAxNDYtXFx1MDE0Nl18W1xcdTAxNDgtXFx1MDE0OV18W1xcdTAxNEItXFx1MDE0Ql18W1xcdTAxNEQtXFx1MDE0RF18W1xcdTAxNEYtXFx1MDE0Rl18W1xcdTAxNTEtXFx1MDE1MV18W1xcdTAxNTMtXFx1MDE1M118W1xcdTAxNTUtXFx1MDE1NV18W1xcdTAxNTctXFx1MDE1N118W1xcdTAxNTktXFx1MDE1OV18W1xcdTAxNUItXFx1MDE1Ql18W1xcdTAxNUQtXFx1MDE1RF18W1xcdTAxNUYtXFx1MDE1Rl18W1xcdTAxNjEtXFx1MDE2MV18W1xcdTAxNjMtXFx1MDE2M118W1xcdTAxNjUtXFx1MDE2NV18W1xcdTAxNjctXFx1MDE2N118W1xcdTAxNjktXFx1MDE2OV18W1xcdTAxNkItXFx1MDE2Ql18W1xcdTAxNkQtXFx1MDE2RF18W1xcdTAxNkYtXFx1MDE2Rl18W1xcdTAxNzEtXFx1MDE3MV18W1xcdTAxNzMtXFx1MDE3M118W1xcdTAxNzUtXFx1MDE3NV18W1xcdTAxNzctXFx1MDE3N118W1xcdTAxN0EtXFx1MDE3QV18W1xcdTAxN0MtXFx1MDE3Q118W1xcdTAxN0UtXFx1MDE4MF18W1xcdTAxODMtXFx1MDE4M118W1xcdTAxODUtXFx1MDE4NV18W1xcdTAxODgtXFx1MDE4OF18W1xcdTAxOEMtXFx1MDE4RF18W1xcdTAxOTItXFx1MDE5Ml18W1xcdTAxOTUtXFx1MDE5NV18W1xcdTAxOTktXFx1MDE5Ql18W1xcdTAxOUUtXFx1MDE5RV18W1xcdTAxQTEtXFx1MDFBMV18W1xcdTAxQTMtXFx1MDFBM118W1xcdTAxQTUtXFx1MDFBNV18W1xcdTAxQTgtXFx1MDFBOF18W1xcdTAxQUItXFx1MDFBQl18W1xcdTAxQUQtXFx1MDFBRF18W1xcdTAxQjAtXFx1MDFCMF18W1xcdTAxQjQtXFx1MDFCNF18W1xcdTAxQjYtXFx1MDFCNl18W1xcdTAxQjktXFx1MDFCQV18W1xcdTAxQkQtXFx1MDFCRF18W1xcdTAxQzYtXFx1MDFDNl18W1xcdTAxQzktXFx1MDFDOV18W1xcdTAxQ0MtXFx1MDFDQ118W1xcdTAxQ0UtXFx1MDFDRV18W1xcdTAxRDAtXFx1MDFEMF18W1xcdTAxRDItXFx1MDFEMl18W1xcdTAxRDQtXFx1MDFENF18W1xcdTAxRDYtXFx1MDFENl18W1xcdTAxRDgtXFx1MDFEOF18W1xcdTAxREEtXFx1MDFEQV18W1xcdTAxREMtXFx1MDFERF18W1xcdTAxREYtXFx1MDFERl18W1xcdTAxRTEtXFx1MDFFMV18W1xcdTAxRTMtXFx1MDFFM118W1xcdTAxRTUtXFx1MDFFNV18W1xcdTAxRTctXFx1MDFFN118W1xcdTAxRTktXFx1MDFFOV18W1xcdTAxRUItXFx1MDFFQl18W1xcdTAxRUQtXFx1MDFFRF18W1xcdTAxRUYtXFx1MDFGMF18W1xcdTAxRjMtXFx1MDFGM118W1xcdTAxRjUtXFx1MDFGNV18W1xcdTAxRkItXFx1MDFGQl18W1xcdTAxRkQtXFx1MDFGRF18W1xcdTAxRkYtXFx1MDFGRl18W1xcdTAyMDEtXFx1MDIwMV18W1xcdTAyMDMtXFx1MDIwM118W1xcdTAyMDUtXFx1MDIwNV18W1xcdTAyMDctXFx1MDIwN118W1xcdTAyMDktXFx1MDIwOV18W1xcdTAyMEItXFx1MDIwQl18W1xcdTAyMEQtXFx1MDIwRF18W1xcdTAyMEYtXFx1MDIwRl18W1xcdTAyMTEtXFx1MDIxMV18W1xcdTAyMTMtXFx1MDIxM118W1xcdTAyMTUtXFx1MDIxNV18W1xcdTAyMTctXFx1MDIxN118W1xcdTAyNTAtXFx1MDJBOF18W1xcdTAzOTAtXFx1MDM5MF18W1xcdTAzQUMtXFx1MDNDRV18W1xcdTAzRDAtXFx1MDNEMV18W1xcdTAzRDUtXFx1MDNENl18W1xcdTAzRTMtXFx1MDNFM118W1xcdTAzRTUtXFx1MDNFNV18W1xcdTAzRTctXFx1MDNFN118W1xcdTAzRTktXFx1MDNFOV18W1xcdTAzRUItXFx1MDNFQl18W1xcdTAzRUQtXFx1MDNFRF18W1xcdTAzRUYtXFx1MDNGMl18W1xcdTA0MzAtXFx1MDQ0Rl18W1xcdTA0NTEtXFx1MDQ1Q118W1xcdTA0NUUtXFx1MDQ1Rl18W1xcdTA0NjEtXFx1MDQ2MV18W1xcdTA0NjMtXFx1MDQ2M118W1xcdTA0NjUtXFx1MDQ2NV18W1xcdTA0NjctXFx1MDQ2N118W1xcdTA0NjktXFx1MDQ2OV18W1xcdTA0NkItXFx1MDQ2Ql18W1xcdTA0NkQtXFx1MDQ2RF18W1xcdTA0NkYtXFx1MDQ2Rl18W1xcdTA0NzEtXFx1MDQ3MV18W1xcdTA0NzMtXFx1MDQ3M118W1xcdTA0NzUtXFx1MDQ3NV18W1xcdTA0NzctXFx1MDQ3N118W1xcdTA0NzktXFx1MDQ3OV18W1xcdTA0N0ItXFx1MDQ3Ql18W1xcdTA0N0QtXFx1MDQ3RF18W1xcdTA0N0YtXFx1MDQ3Rl18W1xcdTA0ODEtXFx1MDQ4MV18W1xcdTA0OTEtXFx1MDQ5MV18W1xcdTA0OTMtXFx1MDQ5M118W1xcdTA0OTUtXFx1MDQ5NV18W1xcdTA0OTctXFx1MDQ5N118W1xcdTA0OTktXFx1MDQ5OV18W1xcdTA0OUItXFx1MDQ5Ql18W1xcdTA0OUQtXFx1MDQ5RF18W1xcdTA0OUYtXFx1MDQ5Rl18W1xcdTA0QTEtXFx1MDRBMV18W1xcdTA0QTMtXFx1MDRBM118W1xcdTA0QTUtXFx1MDRBNV18W1xcdTA0QTctXFx1MDRBN118W1xcdTA0QTktXFx1MDRBOV18W1xcdTA0QUItXFx1MDRBQl18W1xcdTA0QUQtXFx1MDRBRF18W1xcdTA0QUYtXFx1MDRBRl18W1xcdTA0QjEtXFx1MDRCMV18W1xcdTA0QjMtXFx1MDRCM118W1xcdTA0QjUtXFx1MDRCNV18W1xcdTA0QjctXFx1MDRCN118W1xcdTA0QjktXFx1MDRCOV18W1xcdTA0QkItXFx1MDRCQl18W1xcdTA0QkQtXFx1MDRCRF18W1xcdTA0QkYtXFx1MDRCRl18W1xcdTA0QzItXFx1MDRDMl18W1xcdTA0QzQtXFx1MDRDNF18W1xcdTA0QzgtXFx1MDRDOF18W1xcdTA0Q0MtXFx1MDRDQ118W1xcdTA0RDEtXFx1MDREMV18W1xcdTA0RDMtXFx1MDREM118W1xcdTA0RDUtXFx1MDRENV18W1xcdTA0RDctXFx1MDREN118W1xcdTA0RDktXFx1MDREOV18W1xcdTA0REItXFx1MDREQl18W1xcdTA0REQtXFx1MDRERF18W1xcdTA0REYtXFx1MDRERl18W1xcdTA0RTEtXFx1MDRFMV18W1xcdTA0RTMtXFx1MDRFM118W1xcdTA0RTUtXFx1MDRFNV18W1xcdTA0RTctXFx1MDRFN118W1xcdTA0RTktXFx1MDRFOV18W1xcdTA0RUItXFx1MDRFQl18W1xcdTA0RUYtXFx1MDRFRl18W1xcdTA0RjEtXFx1MDRGMV18W1xcdTA0RjMtXFx1MDRGM118W1xcdTA0RjUtXFx1MDRGNV18W1xcdTA0RjktXFx1MDRGOV18W1xcdTA1NjEtXFx1MDU4N118W1xcdTEwRDAtXFx1MTBGNl18W1xcdTFFMDEtXFx1MUUwMV18W1xcdTFFMDMtXFx1MUUwM118W1xcdTFFMDUtXFx1MUUwNV18W1xcdTFFMDctXFx1MUUwN118W1xcdTFFMDktXFx1MUUwOV18W1xcdTFFMEItXFx1MUUwQl18W1xcdTFFMEQtXFx1MUUwRF18W1xcdTFFMEYtXFx1MUUwRl18W1xcdTFFMTEtXFx1MUUxMV18W1xcdTFFMTMtXFx1MUUxM118W1xcdTFFMTUtXFx1MUUxNV18W1xcdTFFMTctXFx1MUUxN118W1xcdTFFMTktXFx1MUUxOV18W1xcdTFFMUItXFx1MUUxQl18W1xcdTFFMUQtXFx1MUUxRF18W1xcdTFFMUYtXFx1MUUxRl18W1xcdTFFMjEtXFx1MUUyMV18W1xcdTFFMjMtXFx1MUUyM118W1xcdTFFMjUtXFx1MUUyNV18W1xcdTFFMjctXFx1MUUyN118W1xcdTFFMjktXFx1MUUyOV18W1xcdTFFMkItXFx1MUUyQl18W1xcdTFFMkQtXFx1MUUyRF18W1xcdTFFMkYtXFx1MUUyRl18W1xcdTFFMzEtXFx1MUUzMV18W1xcdTFFMzMtXFx1MUUzM118W1xcdTFFMzUtXFx1MUUzNV18W1xcdTFFMzctXFx1MUUzN118W1xcdTFFMzktXFx1MUUzOV18W1xcdTFFM0ItXFx1MUUzQl18W1xcdTFFM0QtXFx1MUUzRF18W1xcdTFFM0YtXFx1MUUzRl18W1xcdTFFNDEtXFx1MUU0MV18W1xcdTFFNDMtXFx1MUU0M118W1xcdTFFNDUtXFx1MUU0NV18W1xcdTFFNDctXFx1MUU0N118W1xcdTFFNDktXFx1MUU0OV18W1xcdTFFNEItXFx1MUU0Ql18W1xcdTFFNEQtXFx1MUU0RF18W1xcdTFFNEYtXFx1MUU0Rl18W1xcdTFFNTEtXFx1MUU1MV18W1xcdTFFNTMtXFx1MUU1M118W1xcdTFFNTUtXFx1MUU1NV18W1xcdTFFNTctXFx1MUU1N118W1xcdTFFNTktXFx1MUU1OV18W1xcdTFFNUItXFx1MUU1Ql18W1xcdTFFNUQtXFx1MUU1RF18W1xcdTFFNUYtXFx1MUU1Rl18W1xcdTFFNjEtXFx1MUU2MV18W1xcdTFFNjMtXFx1MUU2M118W1xcdTFFNjUtXFx1MUU2NV18W1xcdTFFNjctXFx1MUU2N118W1xcdTFFNjktXFx1MUU2OV18W1xcdTFFNkItXFx1MUU2Ql18W1xcdTFFNkQtXFx1MUU2RF18W1xcdTFFNkYtXFx1MUU2Rl18W1xcdTFFNzEtXFx1MUU3MV18W1xcdTFFNzMtXFx1MUU3M118W1xcdTFFNzUtXFx1MUU3NV18W1xcdTFFNzctXFx1MUU3N118W1xcdTFFNzktXFx1MUU3OV18W1xcdTFFN0ItXFx1MUU3Ql18W1xcdTFFN0QtXFx1MUU3RF18W1xcdTFFN0YtXFx1MUU3Rl18W1xcdTFFODEtXFx1MUU4MV18W1xcdTFFODMtXFx1MUU4M118W1xcdTFFODUtXFx1MUU4NV18W1xcdTFFODctXFx1MUU4N118W1xcdTFFODktXFx1MUU4OV18W1xcdTFFOEItXFx1MUU4Ql18W1xcdTFFOEQtXFx1MUU4RF18W1xcdTFFOEYtXFx1MUU4Rl18W1xcdTFFOTEtXFx1MUU5MV18W1xcdTFFOTMtXFx1MUU5M118W1xcdTFFOTUtXFx1MUU5Ql18W1xcdTFFQTEtXFx1MUVBMV18W1xcdTFFQTMtXFx1MUVBM118W1xcdTFFQTUtXFx1MUVBNV18W1xcdTFFQTctXFx1MUVBN118W1xcdTFFQTktXFx1MUVBOV18W1xcdTFFQUItXFx1MUVBQl18W1xcdTFFQUQtXFx1MUVBRF18W1xcdTFFQUYtXFx1MUVBRl18W1xcdTFFQjEtXFx1MUVCMV18W1xcdTFFQjMtXFx1MUVCM118W1xcdTFFQjUtXFx1MUVCNV18W1xcdTFFQjctXFx1MUVCN118W1xcdTFFQjktXFx1MUVCOV18W1xcdTFFQkItXFx1MUVCQl18W1xcdTFFQkQtXFx1MUVCRF18W1xcdTFFQkYtXFx1MUVCRl18W1xcdTFFQzEtXFx1MUVDMV18W1xcdTFFQzMtXFx1MUVDM118W1xcdTFFQzUtXFx1MUVDNV18W1xcdTFFQzctXFx1MUVDN118W1xcdTFFQzktXFx1MUVDOV18W1xcdTFFQ0ItXFx1MUVDQl18W1xcdTFFQ0QtXFx1MUVDRF18W1xcdTFFQ0YtXFx1MUVDRl18W1xcdTFFRDEtXFx1MUVEMV18W1xcdTFFRDMtXFx1MUVEM118W1xcdTFFRDUtXFx1MUVENV18W1xcdTFFRDctXFx1MUVEN118W1xcdTFFRDktXFx1MUVEOV18W1xcdTFFREItXFx1MUVEQl18W1xcdTFFREQtXFx1MUVERF18W1xcdTFFREYtXFx1MUVERl18W1xcdTFFRTEtXFx1MUVFMV18W1xcdTFFRTMtXFx1MUVFM118W1xcdTFFRTUtXFx1MUVFNV18W1xcdTFFRTctXFx1MUVFN118W1xcdTFFRTktXFx1MUVFOV18W1xcdTFFRUItXFx1MUVFQl18W1xcdTFFRUQtXFx1MUVFRF18W1xcdTFFRUYtXFx1MUVFRl18W1xcdTFFRjEtXFx1MUVGMV18W1xcdTFFRjMtXFx1MUVGM118W1xcdTFFRjUtXFx1MUVGNV18W1xcdTFFRjctXFx1MUVGN118W1xcdTFFRjktXFx1MUVGOV18W1xcdTFGMDAtXFx1MUYwN118W1xcdTFGMTAtXFx1MUYxNV18W1xcdTFGMjAtXFx1MUYyN118W1xcdTFGMzAtXFx1MUYzN118W1xcdTFGNDAtXFx1MUY0NV18W1xcdTFGNTAtXFx1MUY1N118W1xcdTFGNjAtXFx1MUY2N118W1xcdTFGNzAtXFx1MUY3RF18W1xcdTFGODAtXFx1MUY4N118W1xcdTFGOTAtXFx1MUY5N118W1xcdTFGQTAtXFx1MUZBN118W1xcdTFGQjAtXFx1MUZCNF18W1xcdTFGQjYtXFx1MUZCN118W1xcdTFGQkUtXFx1MUZCRV18W1xcdTFGQzItXFx1MUZDNF18W1xcdTFGQzYtXFx1MUZDN118W1xcdTFGRDAtXFx1MUZEM118W1xcdTFGRDYtXFx1MUZEN118W1xcdTFGRTAtXFx1MUZFN118W1xcdTFGRjItXFx1MUZGNF18W1xcdTFGRjYtXFx1MUZGN118W1xcdTIwN0YtXFx1MjA3Rl18W1xcdTIxMEEtXFx1MjEwQV18W1xcdTIxMEUtXFx1MjEwRl18W1xcdTIxMTMtXFx1MjExM118W1xcdTIxMTgtXFx1MjExOF18W1xcdTIxMkUtXFx1MjEyRl18W1xcdTIxMzQtXFx1MjEzNF18W1xcdUZCMDAtXFx1RkIwNl18W1xcdUZCMTMtXFx1RkIxN118W1xcdUZGNDEtXFx1RkY1QV18W1xcdTAxQzUtXFx1MDFDNV18W1xcdTAxQzgtXFx1MDFDOF18W1xcdTAxQ0ItXFx1MDFDQl18W1xcdTAxRjItXFx1MDFGMl18W1xcdTAyQjAtXFx1MDJCOF18W1xcdTAyQkItXFx1MDJDMV18W1xcdTAyRDAtXFx1MDJEMV18W1xcdTAyRTAtXFx1MDJFNF18W1xcdTAzN0EtXFx1MDM3QV18W1xcdTA1NTktXFx1MDU1OV18W1xcdTA2NDAtXFx1MDY0MF18W1xcdTA2RTUtXFx1MDZFNl18W1xcdTBFNDYtXFx1MEU0Nl18W1xcdTBFQzYtXFx1MEVDNl18W1xcdTMwMDUtXFx1MzAwNV18W1xcdTMwMzEtXFx1MzAzNV18W1xcdTMwOUQtXFx1MzA5RV18W1xcdTMwRkMtXFx1MzBGRV18W1xcdUZGNzAtXFx1RkY3MF18W1xcdUZGOUUtXFx1RkY5Rl18W1xcdTAxQUEtXFx1MDFBQV18W1xcdTAxQkItXFx1MDFCQl18W1xcdTAxQkUtXFx1MDFDM118W1xcdTAzRjMtXFx1MDNGM118W1xcdTA0QzAtXFx1MDRDMF18W1xcdTA1RDAtXFx1MDVFQV18W1xcdTA1RjAtXFx1MDVGMl18W1xcdTA2MjEtXFx1MDYzQV18W1xcdTA2NDEtXFx1MDY0QV18W1xcdTA2NzEtXFx1MDZCN118W1xcdTA2QkEtXFx1MDZCRV18W1xcdTA2QzAtXFx1MDZDRV18W1xcdTA2RDAtXFx1MDZEM118W1xcdTA2RDUtXFx1MDZENV18W1xcdTA5MDUtXFx1MDkzOV18W1xcdTA5M0QtXFx1MDkzRF18W1xcdTA5NTAtXFx1MDk1MF18W1xcdTA5NTgtXFx1MDk2MV18W1xcdTA5ODUtXFx1MDk4Q118W1xcdTA5OEYtXFx1MDk5MF18W1xcdTA5OTMtXFx1MDlBOF18W1xcdTA5QUEtXFx1MDlCMF18W1xcdTA5QjItXFx1MDlCMl18W1xcdTA5QjYtXFx1MDlCOV18W1xcdTA5REMtXFx1MDlERF18W1xcdTA5REYtXFx1MDlFMV18W1xcdTA5RjAtXFx1MDlGMV18W1xcdTBBMDUtXFx1MEEwQV18W1xcdTBBMEYtXFx1MEExMF18W1xcdTBBMTMtXFx1MEEyOF18W1xcdTBBMkEtXFx1MEEzMF18W1xcdTBBMzItXFx1MEEzM118W1xcdTBBMzUtXFx1MEEzNl18W1xcdTBBMzgtXFx1MEEzOV18W1xcdTBBNTktXFx1MEE1Q118W1xcdTBBNUUtXFx1MEE1RV18W1xcdTBBNzItXFx1MEE3NF18W1xcdTBBODUtXFx1MEE4Ql18W1xcdTBBOEQtXFx1MEE4RF18W1xcdTBBOEYtXFx1MEE5MV18W1xcdTBBOTMtXFx1MEFBOF18W1xcdTBBQUEtXFx1MEFCMF18W1xcdTBBQjItXFx1MEFCM118W1xcdTBBQjUtXFx1MEFCOV18W1xcdTBBQkQtXFx1MEFCRF18W1xcdTBBRDAtXFx1MEFEMF18W1xcdTBBRTAtXFx1MEFFMF18W1xcdTBCMDUtXFx1MEIwQ118W1xcdTBCMEYtXFx1MEIxMF18W1xcdTBCMTMtXFx1MEIyOF18W1xcdTBCMkEtXFx1MEIzMF18W1xcdTBCMzItXFx1MEIzM118W1xcdTBCMzYtXFx1MEIzOV18W1xcdTBCM0QtXFx1MEIzRF18W1xcdTBCNUMtXFx1MEI1RF18W1xcdTBCNUYtXFx1MEI2MV18W1xcdTBCODUtXFx1MEI4QV18W1xcdTBCOEUtXFx1MEI5MF18W1xcdTBCOTItXFx1MEI5NV18W1xcdTBCOTktXFx1MEI5QV18W1xcdTBCOUMtXFx1MEI5Q118W1xcdTBCOUUtXFx1MEI5Rl18W1xcdTBCQTMtXFx1MEJBNF18W1xcdTBCQTgtXFx1MEJBQV18W1xcdTBCQUUtXFx1MEJCNV18W1xcdTBCQjctXFx1MEJCOV18W1xcdTBDMDUtXFx1MEMwQ118W1xcdTBDMEUtXFx1MEMxMF18W1xcdTBDMTItXFx1MEMyOF18W1xcdTBDMkEtXFx1MEMzM118W1xcdTBDMzUtXFx1MEMzOV18W1xcdTBDNjAtXFx1MEM2MV18W1xcdTBDODUtXFx1MEM4Q118W1xcdTBDOEUtXFx1MEM5MF18W1xcdTBDOTItXFx1MENBOF18W1xcdTBDQUEtXFx1MENCM118W1xcdTBDQjUtXFx1MENCOV18W1xcdTBDREUtXFx1MENERV18W1xcdTBDRTAtXFx1MENFMV18W1xcdTBEMDUtXFx1MEQwQ118W1xcdTBEMEUtXFx1MEQxMF18W1xcdTBEMTItXFx1MEQyOF18W1xcdTBEMkEtXFx1MEQzOV18W1xcdTBENjAtXFx1MEQ2MV18W1xcdTBFMDEtXFx1MEUzMF18W1xcdTBFMzItXFx1MEUzM118W1xcdTBFNDAtXFx1MEU0NV18W1xcdTBFODEtXFx1MEU4Ml18W1xcdTBFODQtXFx1MEU4NF18W1xcdTBFODctXFx1MEU4OF18W1xcdTBFOEEtXFx1MEU4QV18W1xcdTBFOEQtXFx1MEU4RF18W1xcdTBFOTQtXFx1MEU5N118W1xcdTBFOTktXFx1MEU5Rl18W1xcdTBFQTEtXFx1MEVBM118W1xcdTBFQTUtXFx1MEVBNV18W1xcdTBFQTctXFx1MEVBN118W1xcdTBFQUEtXFx1MEVBQl18W1xcdTBFQUQtXFx1MEVCMF18W1xcdTBFQjItXFx1MEVCM118W1xcdTBFQkQtXFx1MEVCRF18W1xcdTBFQzAtXFx1MEVDNF18W1xcdTBFREMtXFx1MEVERF18W1xcdTBGMDAtXFx1MEYwMF18W1xcdTBGNDAtXFx1MEY0N118W1xcdTBGNDktXFx1MEY2OV18W1xcdTBGODgtXFx1MEY4Ql18W1xcdTExMDAtXFx1MTE1OV18W1xcdTExNUYtXFx1MTFBMl18W1xcdTExQTgtXFx1MTFGOV18W1xcdTIxMzUtXFx1MjEzOF18W1xcdTMwMDYtXFx1MzAwNl18W1xcdTMwNDEtXFx1MzA5NF18W1xcdTMwQTEtXFx1MzBGQV18W1xcdTMxMDUtXFx1MzEyQ118W1xcdTMxMzEtXFx1MzE4RV18W1xcdTRFMDAtXFx1OUZBNV18W1xcdUFDMDAtXFx1RDdBM118W1xcdUY5MDAtXFx1RkEyRF18W1xcdUZCMUYtXFx1RkIyOF18W1xcdUZCMkEtXFx1RkIzNl18W1xcdUZCMzgtXFx1RkIzQ118W1xcdUZCM0UtXFx1RkIzRV18W1xcdUZCNDAtXFx1RkI0MV18W1xcdUZCNDMtXFx1RkI0NF18W1xcdUZCNDYtXFx1RkJCMV18W1xcdUZCRDMtXFx1RkQzRF18W1xcdUZENTAtXFx1RkQ4Rl18W1xcdUZEOTItXFx1RkRDN118W1xcdUZERjAtXFx1RkRGQl18W1xcdUZFNzAtXFx1RkU3Ml18W1xcdUZFNzQtXFx1RkU3NF18W1xcdUZFNzYtXFx1RkVGQ118W1xcdUZGNjYtXFx1RkY2Rl18W1xcdUZGNzEtXFx1RkY5RF18W1xcdUZGQTAtXFx1RkZCRV18W1xcdUZGQzItXFx1RkZDN118W1xcdUZGQ0EtXFx1RkZDRl18W1xcdUZGRDItXFx1RkZEN118W1xcdUZGREEtXFx1RkZEQ10vLFxuXG4vKiBMID0gdW5pb24gb2YgdGhlIGJlbG93IFVuaWNvZGUgY2F0ZWdvcmllcyAqL1xuICBMdSAgIDogL1tcXHUwMDQxLVxcdTAwNUFdfFtcXHUwMEMwLVxcdTAwRDZdfFtcXHUwMEQ4LVxcdTAwREVdfFtcXHUwMTAwLVxcdTAxMDBdfFtcXHUwMTAyLVxcdTAxMDJdfFtcXHUwMTA0LVxcdTAxMDRdfFtcXHUwMTA2LVxcdTAxMDZdfFtcXHUwMTA4LVxcdTAxMDhdfFtcXHUwMTBBLVxcdTAxMEFdfFtcXHUwMTBDLVxcdTAxMENdfFtcXHUwMTBFLVxcdTAxMEVdfFtcXHUwMTEwLVxcdTAxMTBdfFtcXHUwMTEyLVxcdTAxMTJdfFtcXHUwMTE0LVxcdTAxMTRdfFtcXHUwMTE2LVxcdTAxMTZdfFtcXHUwMTE4LVxcdTAxMThdfFtcXHUwMTFBLVxcdTAxMUFdfFtcXHUwMTFDLVxcdTAxMUNdfFtcXHUwMTFFLVxcdTAxMUVdfFtcXHUwMTIwLVxcdTAxMjBdfFtcXHUwMTIyLVxcdTAxMjJdfFtcXHUwMTI0LVxcdTAxMjRdfFtcXHUwMTI2LVxcdTAxMjZdfFtcXHUwMTI4LVxcdTAxMjhdfFtcXHUwMTJBLVxcdTAxMkFdfFtcXHUwMTJDLVxcdTAxMkNdfFtcXHUwMTJFLVxcdTAxMkVdfFtcXHUwMTMwLVxcdTAxMzBdfFtcXHUwMTMyLVxcdTAxMzJdfFtcXHUwMTM0LVxcdTAxMzRdfFtcXHUwMTM2LVxcdTAxMzZdfFtcXHUwMTM5LVxcdTAxMzldfFtcXHUwMTNCLVxcdTAxM0JdfFtcXHUwMTNELVxcdTAxM0RdfFtcXHUwMTNGLVxcdTAxM0ZdfFtcXHUwMTQxLVxcdTAxNDFdfFtcXHUwMTQzLVxcdTAxNDNdfFtcXHUwMTQ1LVxcdTAxNDVdfFtcXHUwMTQ3LVxcdTAxNDddfFtcXHUwMTRBLVxcdTAxNEFdfFtcXHUwMTRDLVxcdTAxNENdfFtcXHUwMTRFLVxcdTAxNEVdfFtcXHUwMTUwLVxcdTAxNTBdfFtcXHUwMTUyLVxcdTAxNTJdfFtcXHUwMTU0LVxcdTAxNTRdfFtcXHUwMTU2LVxcdTAxNTZdfFtcXHUwMTU4LVxcdTAxNThdfFtcXHUwMTVBLVxcdTAxNUFdfFtcXHUwMTVDLVxcdTAxNUNdfFtcXHUwMTVFLVxcdTAxNUVdfFtcXHUwMTYwLVxcdTAxNjBdfFtcXHUwMTYyLVxcdTAxNjJdfFtcXHUwMTY0LVxcdTAxNjRdfFtcXHUwMTY2LVxcdTAxNjZdfFtcXHUwMTY4LVxcdTAxNjhdfFtcXHUwMTZBLVxcdTAxNkFdfFtcXHUwMTZDLVxcdTAxNkNdfFtcXHUwMTZFLVxcdTAxNkVdfFtcXHUwMTcwLVxcdTAxNzBdfFtcXHUwMTcyLVxcdTAxNzJdfFtcXHUwMTc0LVxcdTAxNzRdfFtcXHUwMTc2LVxcdTAxNzZdfFtcXHUwMTc4LVxcdTAxNzldfFtcXHUwMTdCLVxcdTAxN0JdfFtcXHUwMTdELVxcdTAxN0RdfFtcXHUwMTgxLVxcdTAxODJdfFtcXHUwMTg0LVxcdTAxODRdfFtcXHUwMTg2LVxcdTAxODddfFtcXHUwMTg5LVxcdTAxOEJdfFtcXHUwMThFLVxcdTAxOTFdfFtcXHUwMTkzLVxcdTAxOTRdfFtcXHUwMTk2LVxcdTAxOThdfFtcXHUwMTlDLVxcdTAxOURdfFtcXHUwMTlGLVxcdTAxQTBdfFtcXHUwMUEyLVxcdTAxQTJdfFtcXHUwMUE0LVxcdTAxQTRdfFtcXHUwMUE2LVxcdTAxQTddfFtcXHUwMUE5LVxcdTAxQTldfFtcXHUwMUFDLVxcdTAxQUNdfFtcXHUwMUFFLVxcdTAxQUZdfFtcXHUwMUIxLVxcdTAxQjNdfFtcXHUwMUI1LVxcdTAxQjVdfFtcXHUwMUI3LVxcdTAxQjhdfFtcXHUwMUJDLVxcdTAxQkNdfFtcXHUwMUM0LVxcdTAxQzRdfFtcXHUwMUM3LVxcdTAxQzddfFtcXHUwMUNBLVxcdTAxQ0FdfFtcXHUwMUNELVxcdTAxQ0RdfFtcXHUwMUNGLVxcdTAxQ0ZdfFtcXHUwMUQxLVxcdTAxRDFdfFtcXHUwMUQzLVxcdTAxRDNdfFtcXHUwMUQ1LVxcdTAxRDVdfFtcXHUwMUQ3LVxcdTAxRDddfFtcXHUwMUQ5LVxcdTAxRDldfFtcXHUwMURCLVxcdTAxREJdfFtcXHUwMURFLVxcdTAxREVdfFtcXHUwMUUwLVxcdTAxRTBdfFtcXHUwMUUyLVxcdTAxRTJdfFtcXHUwMUU0LVxcdTAxRTRdfFtcXHUwMUU2LVxcdTAxRTZdfFtcXHUwMUU4LVxcdTAxRThdfFtcXHUwMUVBLVxcdTAxRUFdfFtcXHUwMUVDLVxcdTAxRUNdfFtcXHUwMUVFLVxcdTAxRUVdfFtcXHUwMUYxLVxcdTAxRjFdfFtcXHUwMUY0LVxcdTAxRjRdfFtcXHUwMUZBLVxcdTAxRkFdfFtcXHUwMUZDLVxcdTAxRkNdfFtcXHUwMUZFLVxcdTAxRkVdfFtcXHUwMjAwLVxcdTAyMDBdfFtcXHUwMjAyLVxcdTAyMDJdfFtcXHUwMjA0LVxcdTAyMDRdfFtcXHUwMjA2LVxcdTAyMDZdfFtcXHUwMjA4LVxcdTAyMDhdfFtcXHUwMjBBLVxcdTAyMEFdfFtcXHUwMjBDLVxcdTAyMENdfFtcXHUwMjBFLVxcdTAyMEVdfFtcXHUwMjEwLVxcdTAyMTBdfFtcXHUwMjEyLVxcdTAyMTJdfFtcXHUwMjE0LVxcdTAyMTRdfFtcXHUwMjE2LVxcdTAyMTZdfFtcXHUwMzg2LVxcdTAzODZdfFtcXHUwMzg4LVxcdTAzOEFdfFtcXHUwMzhDLVxcdTAzOENdfFtcXHUwMzhFLVxcdTAzOEZdfFtcXHUwMzkxLVxcdTAzQTFdfFtcXHUwM0EzLVxcdTAzQUJdfFtcXHUwM0QyLVxcdTAzRDRdfFtcXHUwM0RBLVxcdTAzREFdfFtcXHUwM0RDLVxcdTAzRENdfFtcXHUwM0RFLVxcdTAzREVdfFtcXHUwM0UwLVxcdTAzRTBdfFtcXHUwM0UyLVxcdTAzRTJdfFtcXHUwM0U0LVxcdTAzRTRdfFtcXHUwM0U2LVxcdTAzRTZdfFtcXHUwM0U4LVxcdTAzRThdfFtcXHUwM0VBLVxcdTAzRUFdfFtcXHUwM0VDLVxcdTAzRUNdfFtcXHUwM0VFLVxcdTAzRUVdfFtcXHUwNDAxLVxcdTA0MENdfFtcXHUwNDBFLVxcdTA0MkZdfFtcXHUwNDYwLVxcdTA0NjBdfFtcXHUwNDYyLVxcdTA0NjJdfFtcXHUwNDY0LVxcdTA0NjRdfFtcXHUwNDY2LVxcdTA0NjZdfFtcXHUwNDY4LVxcdTA0NjhdfFtcXHUwNDZBLVxcdTA0NkFdfFtcXHUwNDZDLVxcdTA0NkNdfFtcXHUwNDZFLVxcdTA0NkVdfFtcXHUwNDcwLVxcdTA0NzBdfFtcXHUwNDcyLVxcdTA0NzJdfFtcXHUwNDc0LVxcdTA0NzRdfFtcXHUwNDc2LVxcdTA0NzZdfFtcXHUwNDc4LVxcdTA0NzhdfFtcXHUwNDdBLVxcdTA0N0FdfFtcXHUwNDdDLVxcdTA0N0NdfFtcXHUwNDdFLVxcdTA0N0VdfFtcXHUwNDgwLVxcdTA0ODBdfFtcXHUwNDkwLVxcdTA0OTBdfFtcXHUwNDkyLVxcdTA0OTJdfFtcXHUwNDk0LVxcdTA0OTRdfFtcXHUwNDk2LVxcdTA0OTZdfFtcXHUwNDk4LVxcdTA0OThdfFtcXHUwNDlBLVxcdTA0OUFdfFtcXHUwNDlDLVxcdTA0OUNdfFtcXHUwNDlFLVxcdTA0OUVdfFtcXHUwNEEwLVxcdTA0QTBdfFtcXHUwNEEyLVxcdTA0QTJdfFtcXHUwNEE0LVxcdTA0QTRdfFtcXHUwNEE2LVxcdTA0QTZdfFtcXHUwNEE4LVxcdTA0QThdfFtcXHUwNEFBLVxcdTA0QUFdfFtcXHUwNEFDLVxcdTA0QUNdfFtcXHUwNEFFLVxcdTA0QUVdfFtcXHUwNEIwLVxcdTA0QjBdfFtcXHUwNEIyLVxcdTA0QjJdfFtcXHUwNEI0LVxcdTA0QjRdfFtcXHUwNEI2LVxcdTA0QjZdfFtcXHUwNEI4LVxcdTA0QjhdfFtcXHUwNEJBLVxcdTA0QkFdfFtcXHUwNEJDLVxcdTA0QkNdfFtcXHUwNEJFLVxcdTA0QkVdfFtcXHUwNEMxLVxcdTA0QzFdfFtcXHUwNEMzLVxcdTA0QzNdfFtcXHUwNEM3LVxcdTA0QzddfFtcXHUwNENCLVxcdTA0Q0JdfFtcXHUwNEQwLVxcdTA0RDBdfFtcXHUwNEQyLVxcdTA0RDJdfFtcXHUwNEQ0LVxcdTA0RDRdfFtcXHUwNEQ2LVxcdTA0RDZdfFtcXHUwNEQ4LVxcdTA0RDhdfFtcXHUwNERBLVxcdTA0REFdfFtcXHUwNERDLVxcdTA0RENdfFtcXHUwNERFLVxcdTA0REVdfFtcXHUwNEUwLVxcdTA0RTBdfFtcXHUwNEUyLVxcdTA0RTJdfFtcXHUwNEU0LVxcdTA0RTRdfFtcXHUwNEU2LVxcdTA0RTZdfFtcXHUwNEU4LVxcdTA0RThdfFtcXHUwNEVBLVxcdTA0RUFdfFtcXHUwNEVFLVxcdTA0RUVdfFtcXHUwNEYwLVxcdTA0RjBdfFtcXHUwNEYyLVxcdTA0RjJdfFtcXHUwNEY0LVxcdTA0RjRdfFtcXHUwNEY4LVxcdTA0RjhdfFtcXHUwNTMxLVxcdTA1NTZdfFtcXHUxMEEwLVxcdTEwQzVdfFtcXHUxRTAwLVxcdTFFMDBdfFtcXHUxRTAyLVxcdTFFMDJdfFtcXHUxRTA0LVxcdTFFMDRdfFtcXHUxRTA2LVxcdTFFMDZdfFtcXHUxRTA4LVxcdTFFMDhdfFtcXHUxRTBBLVxcdTFFMEFdfFtcXHUxRTBDLVxcdTFFMENdfFtcXHUxRTBFLVxcdTFFMEVdfFtcXHUxRTEwLVxcdTFFMTBdfFtcXHUxRTEyLVxcdTFFMTJdfFtcXHUxRTE0LVxcdTFFMTRdfFtcXHUxRTE2LVxcdTFFMTZdfFtcXHUxRTE4LVxcdTFFMThdfFtcXHUxRTFBLVxcdTFFMUFdfFtcXHUxRTFDLVxcdTFFMUNdfFtcXHUxRTFFLVxcdTFFMUVdfFtcXHUxRTIwLVxcdTFFMjBdfFtcXHUxRTIyLVxcdTFFMjJdfFtcXHUxRTI0LVxcdTFFMjRdfFtcXHUxRTI2LVxcdTFFMjZdfFtcXHUxRTI4LVxcdTFFMjhdfFtcXHUxRTJBLVxcdTFFMkFdfFtcXHUxRTJDLVxcdTFFMkNdfFtcXHUxRTJFLVxcdTFFMkVdfFtcXHUxRTMwLVxcdTFFMzBdfFtcXHUxRTMyLVxcdTFFMzJdfFtcXHUxRTM0LVxcdTFFMzRdfFtcXHUxRTM2LVxcdTFFMzZdfFtcXHUxRTM4LVxcdTFFMzhdfFtcXHUxRTNBLVxcdTFFM0FdfFtcXHUxRTNDLVxcdTFFM0NdfFtcXHUxRTNFLVxcdTFFM0VdfFtcXHUxRTQwLVxcdTFFNDBdfFtcXHUxRTQyLVxcdTFFNDJdfFtcXHUxRTQ0LVxcdTFFNDRdfFtcXHUxRTQ2LVxcdTFFNDZdfFtcXHUxRTQ4LVxcdTFFNDhdfFtcXHUxRTRBLVxcdTFFNEFdfFtcXHUxRTRDLVxcdTFFNENdfFtcXHUxRTRFLVxcdTFFNEVdfFtcXHUxRTUwLVxcdTFFNTBdfFtcXHUxRTUyLVxcdTFFNTJdfFtcXHUxRTU0LVxcdTFFNTRdfFtcXHUxRTU2LVxcdTFFNTZdfFtcXHUxRTU4LVxcdTFFNThdfFtcXHUxRTVBLVxcdTFFNUFdfFtcXHUxRTVDLVxcdTFFNUNdfFtcXHUxRTVFLVxcdTFFNUVdfFtcXHUxRTYwLVxcdTFFNjBdfFtcXHUxRTYyLVxcdTFFNjJdfFtcXHUxRTY0LVxcdTFFNjRdfFtcXHUxRTY2LVxcdTFFNjZdfFtcXHUxRTY4LVxcdTFFNjhdfFtcXHUxRTZBLVxcdTFFNkFdfFtcXHUxRTZDLVxcdTFFNkNdfFtcXHUxRTZFLVxcdTFFNkVdfFtcXHUxRTcwLVxcdTFFNzBdfFtcXHUxRTcyLVxcdTFFNzJdfFtcXHUxRTc0LVxcdTFFNzRdfFtcXHUxRTc2LVxcdTFFNzZdfFtcXHUxRTc4LVxcdTFFNzhdfFtcXHUxRTdBLVxcdTFFN0FdfFtcXHUxRTdDLVxcdTFFN0NdfFtcXHUxRTdFLVxcdTFFN0VdfFtcXHUxRTgwLVxcdTFFODBdfFtcXHUxRTgyLVxcdTFFODJdfFtcXHUxRTg0LVxcdTFFODRdfFtcXHUxRTg2LVxcdTFFODZdfFtcXHUxRTg4LVxcdTFFODhdfFtcXHUxRThBLVxcdTFFOEFdfFtcXHUxRThDLVxcdTFFOENdfFtcXHUxRThFLVxcdTFFOEVdfFtcXHUxRTkwLVxcdTFFOTBdfFtcXHUxRTkyLVxcdTFFOTJdfFtcXHUxRTk0LVxcdTFFOTRdfFtcXHUxRUEwLVxcdTFFQTBdfFtcXHUxRUEyLVxcdTFFQTJdfFtcXHUxRUE0LVxcdTFFQTRdfFtcXHUxRUE2LVxcdTFFQTZdfFtcXHUxRUE4LVxcdTFFQThdfFtcXHUxRUFBLVxcdTFFQUFdfFtcXHUxRUFDLVxcdTFFQUNdfFtcXHUxRUFFLVxcdTFFQUVdfFtcXHUxRUIwLVxcdTFFQjBdfFtcXHUxRUIyLVxcdTFFQjJdfFtcXHUxRUI0LVxcdTFFQjRdfFtcXHUxRUI2LVxcdTFFQjZdfFtcXHUxRUI4LVxcdTFFQjhdfFtcXHUxRUJBLVxcdTFFQkFdfFtcXHUxRUJDLVxcdTFFQkNdfFtcXHUxRUJFLVxcdTFFQkVdfFtcXHUxRUMwLVxcdTFFQzBdfFtcXHUxRUMyLVxcdTFFQzJdfFtcXHUxRUM0LVxcdTFFQzRdfFtcXHUxRUM2LVxcdTFFQzZdfFtcXHUxRUM4LVxcdTFFQzhdfFtcXHUxRUNBLVxcdTFFQ0FdfFtcXHUxRUNDLVxcdTFFQ0NdfFtcXHUxRUNFLVxcdTFFQ0VdfFtcXHUxRUQwLVxcdTFFRDBdfFtcXHUxRUQyLVxcdTFFRDJdfFtcXHUxRUQ0LVxcdTFFRDRdfFtcXHUxRUQ2LVxcdTFFRDZdfFtcXHUxRUQ4LVxcdTFFRDhdfFtcXHUxRURBLVxcdTFFREFdfFtcXHUxRURDLVxcdTFFRENdfFtcXHUxRURFLVxcdTFFREVdfFtcXHUxRUUwLVxcdTFFRTBdfFtcXHUxRUUyLVxcdTFFRTJdfFtcXHUxRUU0LVxcdTFFRTRdfFtcXHUxRUU2LVxcdTFFRTZdfFtcXHUxRUU4LVxcdTFFRThdfFtcXHUxRUVBLVxcdTFFRUFdfFtcXHUxRUVDLVxcdTFFRUNdfFtcXHUxRUVFLVxcdTFFRUVdfFtcXHUxRUYwLVxcdTFFRjBdfFtcXHUxRUYyLVxcdTFFRjJdfFtcXHUxRUY0LVxcdTFFRjRdfFtcXHUxRUY2LVxcdTFFRjZdfFtcXHUxRUY4LVxcdTFFRjhdfFtcXHUxRjA4LVxcdTFGMEZdfFtcXHUxRjE4LVxcdTFGMURdfFtcXHUxRjI4LVxcdTFGMkZdfFtcXHUxRjM4LVxcdTFGM0ZdfFtcXHUxRjQ4LVxcdTFGNERdfFtcXHUxRjU5LVxcdTFGNTldfFtcXHUxRjVCLVxcdTFGNUJdfFtcXHUxRjVELVxcdTFGNURdfFtcXHUxRjVGLVxcdTFGNUZdfFtcXHUxRjY4LVxcdTFGNkZdfFtcXHUxRjg4LVxcdTFGOEZdfFtcXHUxRjk4LVxcdTFGOUZdfFtcXHUxRkE4LVxcdTFGQUZdfFtcXHUxRkI4LVxcdTFGQkNdfFtcXHUxRkM4LVxcdTFGQ0NdfFtcXHUxRkQ4LVxcdTFGREJdfFtcXHUxRkU4LVxcdTFGRUNdfFtcXHUxRkY4LVxcdTFGRkNdfFtcXHUyMTAyLVxcdTIxMDJdfFtcXHUyMTA3LVxcdTIxMDddfFtcXHUyMTBCLVxcdTIxMERdfFtcXHUyMTEwLVxcdTIxMTJdfFtcXHUyMTE1LVxcdTIxMTVdfFtcXHUyMTE5LVxcdTIxMURdfFtcXHUyMTI0LVxcdTIxMjRdfFtcXHUyMTI2LVxcdTIxMjZdfFtcXHUyMTI4LVxcdTIxMjhdfFtcXHUyMTJBLVxcdTIxMkRdfFtcXHUyMTMwLVxcdTIxMzFdfFtcXHUyMTMzLVxcdTIxMzNdfFtcXHVGRjIxLVxcdUZGM0FdLyxcbiAgTGwgICA6IC9bXFx1MDA2MS1cXHUwMDdBXXxbXFx1MDBBQS1cXHUwMEFBXXxbXFx1MDBCNS1cXHUwMEI1XXxbXFx1MDBCQS1cXHUwMEJBXXxbXFx1MDBERi1cXHUwMEY2XXxbXFx1MDBGOC1cXHUwMEZGXXxbXFx1MDEwMS1cXHUwMTAxXXxbXFx1MDEwMy1cXHUwMTAzXXxbXFx1MDEwNS1cXHUwMTA1XXxbXFx1MDEwNy1cXHUwMTA3XXxbXFx1MDEwOS1cXHUwMTA5XXxbXFx1MDEwQi1cXHUwMTBCXXxbXFx1MDEwRC1cXHUwMTBEXXxbXFx1MDEwRi1cXHUwMTBGXXxbXFx1MDExMS1cXHUwMTExXXxbXFx1MDExMy1cXHUwMTEzXXxbXFx1MDExNS1cXHUwMTE1XXxbXFx1MDExNy1cXHUwMTE3XXxbXFx1MDExOS1cXHUwMTE5XXxbXFx1MDExQi1cXHUwMTFCXXxbXFx1MDExRC1cXHUwMTFEXXxbXFx1MDExRi1cXHUwMTFGXXxbXFx1MDEyMS1cXHUwMTIxXXxbXFx1MDEyMy1cXHUwMTIzXXxbXFx1MDEyNS1cXHUwMTI1XXxbXFx1MDEyNy1cXHUwMTI3XXxbXFx1MDEyOS1cXHUwMTI5XXxbXFx1MDEyQi1cXHUwMTJCXXxbXFx1MDEyRC1cXHUwMTJEXXxbXFx1MDEyRi1cXHUwMTJGXXxbXFx1MDEzMS1cXHUwMTMxXXxbXFx1MDEzMy1cXHUwMTMzXXxbXFx1MDEzNS1cXHUwMTM1XXxbXFx1MDEzNy1cXHUwMTM4XXxbXFx1MDEzQS1cXHUwMTNBXXxbXFx1MDEzQy1cXHUwMTNDXXxbXFx1MDEzRS1cXHUwMTNFXXxbXFx1MDE0MC1cXHUwMTQwXXxbXFx1MDE0Mi1cXHUwMTQyXXxbXFx1MDE0NC1cXHUwMTQ0XXxbXFx1MDE0Ni1cXHUwMTQ2XXxbXFx1MDE0OC1cXHUwMTQ5XXxbXFx1MDE0Qi1cXHUwMTRCXXxbXFx1MDE0RC1cXHUwMTREXXxbXFx1MDE0Ri1cXHUwMTRGXXxbXFx1MDE1MS1cXHUwMTUxXXxbXFx1MDE1My1cXHUwMTUzXXxbXFx1MDE1NS1cXHUwMTU1XXxbXFx1MDE1Ny1cXHUwMTU3XXxbXFx1MDE1OS1cXHUwMTU5XXxbXFx1MDE1Qi1cXHUwMTVCXXxbXFx1MDE1RC1cXHUwMTVEXXxbXFx1MDE1Ri1cXHUwMTVGXXxbXFx1MDE2MS1cXHUwMTYxXXxbXFx1MDE2My1cXHUwMTYzXXxbXFx1MDE2NS1cXHUwMTY1XXxbXFx1MDE2Ny1cXHUwMTY3XXxbXFx1MDE2OS1cXHUwMTY5XXxbXFx1MDE2Qi1cXHUwMTZCXXxbXFx1MDE2RC1cXHUwMTZEXXxbXFx1MDE2Ri1cXHUwMTZGXXxbXFx1MDE3MS1cXHUwMTcxXXxbXFx1MDE3My1cXHUwMTczXXxbXFx1MDE3NS1cXHUwMTc1XXxbXFx1MDE3Ny1cXHUwMTc3XXxbXFx1MDE3QS1cXHUwMTdBXXxbXFx1MDE3Qy1cXHUwMTdDXXxbXFx1MDE3RS1cXHUwMTgwXXxbXFx1MDE4My1cXHUwMTgzXXxbXFx1MDE4NS1cXHUwMTg1XXxbXFx1MDE4OC1cXHUwMTg4XXxbXFx1MDE4Qy1cXHUwMThEXXxbXFx1MDE5Mi1cXHUwMTkyXXxbXFx1MDE5NS1cXHUwMTk1XXxbXFx1MDE5OS1cXHUwMTlCXXxbXFx1MDE5RS1cXHUwMTlFXXxbXFx1MDFBMS1cXHUwMUExXXxbXFx1MDFBMy1cXHUwMUEzXXxbXFx1MDFBNS1cXHUwMUE1XXxbXFx1MDFBOC1cXHUwMUE4XXxbXFx1MDFBQi1cXHUwMUFCXXxbXFx1MDFBRC1cXHUwMUFEXXxbXFx1MDFCMC1cXHUwMUIwXXxbXFx1MDFCNC1cXHUwMUI0XXxbXFx1MDFCNi1cXHUwMUI2XXxbXFx1MDFCOS1cXHUwMUJBXXxbXFx1MDFCRC1cXHUwMUJEXXxbXFx1MDFDNi1cXHUwMUM2XXxbXFx1MDFDOS1cXHUwMUM5XXxbXFx1MDFDQy1cXHUwMUNDXXxbXFx1MDFDRS1cXHUwMUNFXXxbXFx1MDFEMC1cXHUwMUQwXXxbXFx1MDFEMi1cXHUwMUQyXXxbXFx1MDFENC1cXHUwMUQ0XXxbXFx1MDFENi1cXHUwMUQ2XXxbXFx1MDFEOC1cXHUwMUQ4XXxbXFx1MDFEQS1cXHUwMURBXXxbXFx1MDFEQy1cXHUwMUREXXxbXFx1MDFERi1cXHUwMURGXXxbXFx1MDFFMS1cXHUwMUUxXXxbXFx1MDFFMy1cXHUwMUUzXXxbXFx1MDFFNS1cXHUwMUU1XXxbXFx1MDFFNy1cXHUwMUU3XXxbXFx1MDFFOS1cXHUwMUU5XXxbXFx1MDFFQi1cXHUwMUVCXXxbXFx1MDFFRC1cXHUwMUVEXXxbXFx1MDFFRi1cXHUwMUYwXXxbXFx1MDFGMy1cXHUwMUYzXXxbXFx1MDFGNS1cXHUwMUY1XXxbXFx1MDFGQi1cXHUwMUZCXXxbXFx1MDFGRC1cXHUwMUZEXXxbXFx1MDFGRi1cXHUwMUZGXXxbXFx1MDIwMS1cXHUwMjAxXXxbXFx1MDIwMy1cXHUwMjAzXXxbXFx1MDIwNS1cXHUwMjA1XXxbXFx1MDIwNy1cXHUwMjA3XXxbXFx1MDIwOS1cXHUwMjA5XXxbXFx1MDIwQi1cXHUwMjBCXXxbXFx1MDIwRC1cXHUwMjBEXXxbXFx1MDIwRi1cXHUwMjBGXXxbXFx1MDIxMS1cXHUwMjExXXxbXFx1MDIxMy1cXHUwMjEzXXxbXFx1MDIxNS1cXHUwMjE1XXxbXFx1MDIxNy1cXHUwMjE3XXxbXFx1MDI1MC1cXHUwMkE4XXxbXFx1MDM5MC1cXHUwMzkwXXxbXFx1MDNBQy1cXHUwM0NFXXxbXFx1MDNEMC1cXHUwM0QxXXxbXFx1MDNENS1cXHUwM0Q2XXxbXFx1MDNFMy1cXHUwM0UzXXxbXFx1MDNFNS1cXHUwM0U1XXxbXFx1MDNFNy1cXHUwM0U3XXxbXFx1MDNFOS1cXHUwM0U5XXxbXFx1MDNFQi1cXHUwM0VCXXxbXFx1MDNFRC1cXHUwM0VEXXxbXFx1MDNFRi1cXHUwM0YyXXxbXFx1MDQzMC1cXHUwNDRGXXxbXFx1MDQ1MS1cXHUwNDVDXXxbXFx1MDQ1RS1cXHUwNDVGXXxbXFx1MDQ2MS1cXHUwNDYxXXxbXFx1MDQ2My1cXHUwNDYzXXxbXFx1MDQ2NS1cXHUwNDY1XXxbXFx1MDQ2Ny1cXHUwNDY3XXxbXFx1MDQ2OS1cXHUwNDY5XXxbXFx1MDQ2Qi1cXHUwNDZCXXxbXFx1MDQ2RC1cXHUwNDZEXXxbXFx1MDQ2Ri1cXHUwNDZGXXxbXFx1MDQ3MS1cXHUwNDcxXXxbXFx1MDQ3My1cXHUwNDczXXxbXFx1MDQ3NS1cXHUwNDc1XXxbXFx1MDQ3Ny1cXHUwNDc3XXxbXFx1MDQ3OS1cXHUwNDc5XXxbXFx1MDQ3Qi1cXHUwNDdCXXxbXFx1MDQ3RC1cXHUwNDdEXXxbXFx1MDQ3Ri1cXHUwNDdGXXxbXFx1MDQ4MS1cXHUwNDgxXXxbXFx1MDQ5MS1cXHUwNDkxXXxbXFx1MDQ5My1cXHUwNDkzXXxbXFx1MDQ5NS1cXHUwNDk1XXxbXFx1MDQ5Ny1cXHUwNDk3XXxbXFx1MDQ5OS1cXHUwNDk5XXxbXFx1MDQ5Qi1cXHUwNDlCXXxbXFx1MDQ5RC1cXHUwNDlEXXxbXFx1MDQ5Ri1cXHUwNDlGXXxbXFx1MDRBMS1cXHUwNEExXXxbXFx1MDRBMy1cXHUwNEEzXXxbXFx1MDRBNS1cXHUwNEE1XXxbXFx1MDRBNy1cXHUwNEE3XXxbXFx1MDRBOS1cXHUwNEE5XXxbXFx1MDRBQi1cXHUwNEFCXXxbXFx1MDRBRC1cXHUwNEFEXXxbXFx1MDRBRi1cXHUwNEFGXXxbXFx1MDRCMS1cXHUwNEIxXXxbXFx1MDRCMy1cXHUwNEIzXXxbXFx1MDRCNS1cXHUwNEI1XXxbXFx1MDRCNy1cXHUwNEI3XXxbXFx1MDRCOS1cXHUwNEI5XXxbXFx1MDRCQi1cXHUwNEJCXXxbXFx1MDRCRC1cXHUwNEJEXXxbXFx1MDRCRi1cXHUwNEJGXXxbXFx1MDRDMi1cXHUwNEMyXXxbXFx1MDRDNC1cXHUwNEM0XXxbXFx1MDRDOC1cXHUwNEM4XXxbXFx1MDRDQy1cXHUwNENDXXxbXFx1MDREMS1cXHUwNEQxXXxbXFx1MDREMy1cXHUwNEQzXXxbXFx1MDRENS1cXHUwNEQ1XXxbXFx1MDRENy1cXHUwNEQ3XXxbXFx1MDREOS1cXHUwNEQ5XXxbXFx1MDREQi1cXHUwNERCXXxbXFx1MDRERC1cXHUwNEREXXxbXFx1MDRERi1cXHUwNERGXXxbXFx1MDRFMS1cXHUwNEUxXXxbXFx1MDRFMy1cXHUwNEUzXXxbXFx1MDRFNS1cXHUwNEU1XXxbXFx1MDRFNy1cXHUwNEU3XXxbXFx1MDRFOS1cXHUwNEU5XXxbXFx1MDRFQi1cXHUwNEVCXXxbXFx1MDRFRi1cXHUwNEVGXXxbXFx1MDRGMS1cXHUwNEYxXXxbXFx1MDRGMy1cXHUwNEYzXXxbXFx1MDRGNS1cXHUwNEY1XXxbXFx1MDRGOS1cXHUwNEY5XXxbXFx1MDU2MS1cXHUwNTg3XXxbXFx1MTBEMC1cXHUxMEY2XXxbXFx1MUUwMS1cXHUxRTAxXXxbXFx1MUUwMy1cXHUxRTAzXXxbXFx1MUUwNS1cXHUxRTA1XXxbXFx1MUUwNy1cXHUxRTA3XXxbXFx1MUUwOS1cXHUxRTA5XXxbXFx1MUUwQi1cXHUxRTBCXXxbXFx1MUUwRC1cXHUxRTBEXXxbXFx1MUUwRi1cXHUxRTBGXXxbXFx1MUUxMS1cXHUxRTExXXxbXFx1MUUxMy1cXHUxRTEzXXxbXFx1MUUxNS1cXHUxRTE1XXxbXFx1MUUxNy1cXHUxRTE3XXxbXFx1MUUxOS1cXHUxRTE5XXxbXFx1MUUxQi1cXHUxRTFCXXxbXFx1MUUxRC1cXHUxRTFEXXxbXFx1MUUxRi1cXHUxRTFGXXxbXFx1MUUyMS1cXHUxRTIxXXxbXFx1MUUyMy1cXHUxRTIzXXxbXFx1MUUyNS1cXHUxRTI1XXxbXFx1MUUyNy1cXHUxRTI3XXxbXFx1MUUyOS1cXHUxRTI5XXxbXFx1MUUyQi1cXHUxRTJCXXxbXFx1MUUyRC1cXHUxRTJEXXxbXFx1MUUyRi1cXHUxRTJGXXxbXFx1MUUzMS1cXHUxRTMxXXxbXFx1MUUzMy1cXHUxRTMzXXxbXFx1MUUzNS1cXHUxRTM1XXxbXFx1MUUzNy1cXHUxRTM3XXxbXFx1MUUzOS1cXHUxRTM5XXxbXFx1MUUzQi1cXHUxRTNCXXxbXFx1MUUzRC1cXHUxRTNEXXxbXFx1MUUzRi1cXHUxRTNGXXxbXFx1MUU0MS1cXHUxRTQxXXxbXFx1MUU0My1cXHUxRTQzXXxbXFx1MUU0NS1cXHUxRTQ1XXxbXFx1MUU0Ny1cXHUxRTQ3XXxbXFx1MUU0OS1cXHUxRTQ5XXxbXFx1MUU0Qi1cXHUxRTRCXXxbXFx1MUU0RC1cXHUxRTREXXxbXFx1MUU0Ri1cXHUxRTRGXXxbXFx1MUU1MS1cXHUxRTUxXXxbXFx1MUU1My1cXHUxRTUzXXxbXFx1MUU1NS1cXHUxRTU1XXxbXFx1MUU1Ny1cXHUxRTU3XXxbXFx1MUU1OS1cXHUxRTU5XXxbXFx1MUU1Qi1cXHUxRTVCXXxbXFx1MUU1RC1cXHUxRTVEXXxbXFx1MUU1Ri1cXHUxRTVGXXxbXFx1MUU2MS1cXHUxRTYxXXxbXFx1MUU2My1cXHUxRTYzXXxbXFx1MUU2NS1cXHUxRTY1XXxbXFx1MUU2Ny1cXHUxRTY3XXxbXFx1MUU2OS1cXHUxRTY5XXxbXFx1MUU2Qi1cXHUxRTZCXXxbXFx1MUU2RC1cXHUxRTZEXXxbXFx1MUU2Ri1cXHUxRTZGXXxbXFx1MUU3MS1cXHUxRTcxXXxbXFx1MUU3My1cXHUxRTczXXxbXFx1MUU3NS1cXHUxRTc1XXxbXFx1MUU3Ny1cXHUxRTc3XXxbXFx1MUU3OS1cXHUxRTc5XXxbXFx1MUU3Qi1cXHUxRTdCXXxbXFx1MUU3RC1cXHUxRTdEXXxbXFx1MUU3Ri1cXHUxRTdGXXxbXFx1MUU4MS1cXHUxRTgxXXxbXFx1MUU4My1cXHUxRTgzXXxbXFx1MUU4NS1cXHUxRTg1XXxbXFx1MUU4Ny1cXHUxRTg3XXxbXFx1MUU4OS1cXHUxRTg5XXxbXFx1MUU4Qi1cXHUxRThCXXxbXFx1MUU4RC1cXHUxRThEXXxbXFx1MUU4Ri1cXHUxRThGXXxbXFx1MUU5MS1cXHUxRTkxXXxbXFx1MUU5My1cXHUxRTkzXXxbXFx1MUU5NS1cXHUxRTlCXXxbXFx1MUVBMS1cXHUxRUExXXxbXFx1MUVBMy1cXHUxRUEzXXxbXFx1MUVBNS1cXHUxRUE1XXxbXFx1MUVBNy1cXHUxRUE3XXxbXFx1MUVBOS1cXHUxRUE5XXxbXFx1MUVBQi1cXHUxRUFCXXxbXFx1MUVBRC1cXHUxRUFEXXxbXFx1MUVBRi1cXHUxRUFGXXxbXFx1MUVCMS1cXHUxRUIxXXxbXFx1MUVCMy1cXHUxRUIzXXxbXFx1MUVCNS1cXHUxRUI1XXxbXFx1MUVCNy1cXHUxRUI3XXxbXFx1MUVCOS1cXHUxRUI5XXxbXFx1MUVCQi1cXHUxRUJCXXxbXFx1MUVCRC1cXHUxRUJEXXxbXFx1MUVCRi1cXHUxRUJGXXxbXFx1MUVDMS1cXHUxRUMxXXxbXFx1MUVDMy1cXHUxRUMzXXxbXFx1MUVDNS1cXHUxRUM1XXxbXFx1MUVDNy1cXHUxRUM3XXxbXFx1MUVDOS1cXHUxRUM5XXxbXFx1MUVDQi1cXHUxRUNCXXxbXFx1MUVDRC1cXHUxRUNEXXxbXFx1MUVDRi1cXHUxRUNGXXxbXFx1MUVEMS1cXHUxRUQxXXxbXFx1MUVEMy1cXHUxRUQzXXxbXFx1MUVENS1cXHUxRUQ1XXxbXFx1MUVENy1cXHUxRUQ3XXxbXFx1MUVEOS1cXHUxRUQ5XXxbXFx1MUVEQi1cXHUxRURCXXxbXFx1MUVERC1cXHUxRUREXXxbXFx1MUVERi1cXHUxRURGXXxbXFx1MUVFMS1cXHUxRUUxXXxbXFx1MUVFMy1cXHUxRUUzXXxbXFx1MUVFNS1cXHUxRUU1XXxbXFx1MUVFNy1cXHUxRUU3XXxbXFx1MUVFOS1cXHUxRUU5XXxbXFx1MUVFQi1cXHUxRUVCXXxbXFx1MUVFRC1cXHUxRUVEXXxbXFx1MUVFRi1cXHUxRUVGXXxbXFx1MUVGMS1cXHUxRUYxXXxbXFx1MUVGMy1cXHUxRUYzXXxbXFx1MUVGNS1cXHUxRUY1XXxbXFx1MUVGNy1cXHUxRUY3XXxbXFx1MUVGOS1cXHUxRUY5XXxbXFx1MUYwMC1cXHUxRjA3XXxbXFx1MUYxMC1cXHUxRjE1XXxbXFx1MUYyMC1cXHUxRjI3XXxbXFx1MUYzMC1cXHUxRjM3XXxbXFx1MUY0MC1cXHUxRjQ1XXxbXFx1MUY1MC1cXHUxRjU3XXxbXFx1MUY2MC1cXHUxRjY3XXxbXFx1MUY3MC1cXHUxRjdEXXxbXFx1MUY4MC1cXHUxRjg3XXxbXFx1MUY5MC1cXHUxRjk3XXxbXFx1MUZBMC1cXHUxRkE3XXxbXFx1MUZCMC1cXHUxRkI0XXxbXFx1MUZCNi1cXHUxRkI3XXxbXFx1MUZCRS1cXHUxRkJFXXxbXFx1MUZDMi1cXHUxRkM0XXxbXFx1MUZDNi1cXHUxRkM3XXxbXFx1MUZEMC1cXHUxRkQzXXxbXFx1MUZENi1cXHUxRkQ3XXxbXFx1MUZFMC1cXHUxRkU3XXxbXFx1MUZGMi1cXHUxRkY0XXxbXFx1MUZGNi1cXHUxRkY3XXxbXFx1MjA3Ri1cXHUyMDdGXXxbXFx1MjEwQS1cXHUyMTBBXXxbXFx1MjEwRS1cXHUyMTBGXXxbXFx1MjExMy1cXHUyMTEzXXxbXFx1MjExOC1cXHUyMTE4XXxbXFx1MjEyRS1cXHUyMTJGXXxbXFx1MjEzNC1cXHUyMTM0XXxbXFx1RkIwMC1cXHVGQjA2XXxbXFx1RkIxMy1cXHVGQjE3XXxbXFx1RkY0MS1cXHVGRjVBXS8sXG4gIEx0ICAgOiAvW1xcdTAxQzUtXFx1MDFDNV18W1xcdTAxQzgtXFx1MDFDOF18W1xcdTAxQ0ItXFx1MDFDQl18W1xcdTAxRjItXFx1MDFGMl0vLFxuICBMbSAgIDogL1tcXHUwMkIwLVxcdTAyQjhdfFtcXHUwMkJCLVxcdTAyQzFdfFtcXHUwMkQwLVxcdTAyRDFdfFtcXHUwMkUwLVxcdTAyRTRdfFtcXHUwMzdBLVxcdTAzN0FdfFtcXHUwNTU5LVxcdTA1NTldfFtcXHUwNjQwLVxcdTA2NDBdfFtcXHUwNkU1LVxcdTA2RTZdfFtcXHUwRTQ2LVxcdTBFNDZdfFtcXHUwRUM2LVxcdTBFQzZdfFtcXHUzMDA1LVxcdTMwMDVdfFtcXHUzMDMxLVxcdTMwMzVdfFtcXHUzMDlELVxcdTMwOUVdfFtcXHUzMEZDLVxcdTMwRkVdfFtcXHVGRjcwLVxcdUZGNzBdfFtcXHVGRjlFLVxcdUZGOUZdLyxcbiAgTG8gICA6IC9bXFx1MDFBQS1cXHUwMUFBXXxbXFx1MDFCQi1cXHUwMUJCXXxbXFx1MDFCRS1cXHUwMUMzXXxbXFx1MDNGMy1cXHUwM0YzXXxbXFx1MDRDMC1cXHUwNEMwXXxbXFx1MDVEMC1cXHUwNUVBXXxbXFx1MDVGMC1cXHUwNUYyXXxbXFx1MDYyMS1cXHUwNjNBXXxbXFx1MDY0MS1cXHUwNjRBXXxbXFx1MDY3MS1cXHUwNkI3XXxbXFx1MDZCQS1cXHUwNkJFXXxbXFx1MDZDMC1cXHUwNkNFXXxbXFx1MDZEMC1cXHUwNkQzXXxbXFx1MDZENS1cXHUwNkQ1XXxbXFx1MDkwNS1cXHUwOTM5XXxbXFx1MDkzRC1cXHUwOTNEXXxbXFx1MDk1MC1cXHUwOTUwXXxbXFx1MDk1OC1cXHUwOTYxXXxbXFx1MDk4NS1cXHUwOThDXXxbXFx1MDk4Ri1cXHUwOTkwXXxbXFx1MDk5My1cXHUwOUE4XXxbXFx1MDlBQS1cXHUwOUIwXXxbXFx1MDlCMi1cXHUwOUIyXXxbXFx1MDlCNi1cXHUwOUI5XXxbXFx1MDlEQy1cXHUwOUREXXxbXFx1MDlERi1cXHUwOUUxXXxbXFx1MDlGMC1cXHUwOUYxXXxbXFx1MEEwNS1cXHUwQTBBXXxbXFx1MEEwRi1cXHUwQTEwXXxbXFx1MEExMy1cXHUwQTI4XXxbXFx1MEEyQS1cXHUwQTMwXXxbXFx1MEEzMi1cXHUwQTMzXXxbXFx1MEEzNS1cXHUwQTM2XXxbXFx1MEEzOC1cXHUwQTM5XXxbXFx1MEE1OS1cXHUwQTVDXXxbXFx1MEE1RS1cXHUwQTVFXXxbXFx1MEE3Mi1cXHUwQTc0XXxbXFx1MEE4NS1cXHUwQThCXXxbXFx1MEE4RC1cXHUwQThEXXxbXFx1MEE4Ri1cXHUwQTkxXXxbXFx1MEE5My1cXHUwQUE4XXxbXFx1MEFBQS1cXHUwQUIwXXxbXFx1MEFCMi1cXHUwQUIzXXxbXFx1MEFCNS1cXHUwQUI5XXxbXFx1MEFCRC1cXHUwQUJEXXxbXFx1MEFEMC1cXHUwQUQwXXxbXFx1MEFFMC1cXHUwQUUwXXxbXFx1MEIwNS1cXHUwQjBDXXxbXFx1MEIwRi1cXHUwQjEwXXxbXFx1MEIxMy1cXHUwQjI4XXxbXFx1MEIyQS1cXHUwQjMwXXxbXFx1MEIzMi1cXHUwQjMzXXxbXFx1MEIzNi1cXHUwQjM5XXxbXFx1MEIzRC1cXHUwQjNEXXxbXFx1MEI1Qy1cXHUwQjVEXXxbXFx1MEI1Ri1cXHUwQjYxXXxbXFx1MEI4NS1cXHUwQjhBXXxbXFx1MEI4RS1cXHUwQjkwXXxbXFx1MEI5Mi1cXHUwQjk1XXxbXFx1MEI5OS1cXHUwQjlBXXxbXFx1MEI5Qy1cXHUwQjlDXXxbXFx1MEI5RS1cXHUwQjlGXXxbXFx1MEJBMy1cXHUwQkE0XXxbXFx1MEJBOC1cXHUwQkFBXXxbXFx1MEJBRS1cXHUwQkI1XXxbXFx1MEJCNy1cXHUwQkI5XXxbXFx1MEMwNS1cXHUwQzBDXXxbXFx1MEMwRS1cXHUwQzEwXXxbXFx1MEMxMi1cXHUwQzI4XXxbXFx1MEMyQS1cXHUwQzMzXXxbXFx1MEMzNS1cXHUwQzM5XXxbXFx1MEM2MC1cXHUwQzYxXXxbXFx1MEM4NS1cXHUwQzhDXXxbXFx1MEM4RS1cXHUwQzkwXXxbXFx1MEM5Mi1cXHUwQ0E4XXxbXFx1MENBQS1cXHUwQ0IzXXxbXFx1MENCNS1cXHUwQ0I5XXxbXFx1MENERS1cXHUwQ0RFXXxbXFx1MENFMC1cXHUwQ0UxXXxbXFx1MEQwNS1cXHUwRDBDXXxbXFx1MEQwRS1cXHUwRDEwXXxbXFx1MEQxMi1cXHUwRDI4XXxbXFx1MEQyQS1cXHUwRDM5XXxbXFx1MEQ2MC1cXHUwRDYxXXxbXFx1MEUwMS1cXHUwRTMwXXxbXFx1MEUzMi1cXHUwRTMzXXxbXFx1MEU0MC1cXHUwRTQ1XXxbXFx1MEU4MS1cXHUwRTgyXXxbXFx1MEU4NC1cXHUwRTg0XXxbXFx1MEU4Ny1cXHUwRTg4XXxbXFx1MEU4QS1cXHUwRThBXXxbXFx1MEU4RC1cXHUwRThEXXxbXFx1MEU5NC1cXHUwRTk3XXxbXFx1MEU5OS1cXHUwRTlGXXxbXFx1MEVBMS1cXHUwRUEzXXxbXFx1MEVBNS1cXHUwRUE1XXxbXFx1MEVBNy1cXHUwRUE3XXxbXFx1MEVBQS1cXHUwRUFCXXxbXFx1MEVBRC1cXHUwRUIwXXxbXFx1MEVCMi1cXHUwRUIzXXxbXFx1MEVCRC1cXHUwRUJEXXxbXFx1MEVDMC1cXHUwRUM0XXxbXFx1MEVEQy1cXHUwRUREXXxbXFx1MEYwMC1cXHUwRjAwXXxbXFx1MEY0MC1cXHUwRjQ3XXxbXFx1MEY0OS1cXHUwRjY5XXxbXFx1MEY4OC1cXHUwRjhCXXxbXFx1MTEwMC1cXHUxMTU5XXxbXFx1MTE1Ri1cXHUxMUEyXXxbXFx1MTFBOC1cXHUxMUY5XXxbXFx1MjEzNS1cXHUyMTM4XXxbXFx1MzAwNi1cXHUzMDA2XXxbXFx1MzA0MS1cXHUzMDk0XXxbXFx1MzBBMS1cXHUzMEZBXXxbXFx1MzEwNS1cXHUzMTJDXXxbXFx1MzEzMS1cXHUzMThFXXxbXFx1NEUwMC1cXHU5RkE1XXxbXFx1QUMwMC1cXHVEN0EzXXxbXFx1RjkwMC1cXHVGQTJEXXxbXFx1RkIxRi1cXHVGQjI4XXxbXFx1RkIyQS1cXHVGQjM2XXxbXFx1RkIzOC1cXHVGQjNDXXxbXFx1RkIzRS1cXHVGQjNFXXxbXFx1RkI0MC1cXHVGQjQxXXxbXFx1RkI0My1cXHVGQjQ0XXxbXFx1RkI0Ni1cXHVGQkIxXXxbXFx1RkJEMy1cXHVGRDNEXXxbXFx1RkQ1MC1cXHVGRDhGXXxbXFx1RkQ5Mi1cXHVGREM3XXxbXFx1RkRGMC1cXHVGREZCXXxbXFx1RkU3MC1cXHVGRTcyXXxbXFx1RkU3NC1cXHVGRTc0XXxbXFx1RkU3Ni1cXHVGRUZDXXxbXFx1RkY2Ni1cXHVGRjZGXXxbXFx1RkY3MS1cXHVGRjlEXXxbXFx1RkZBMC1cXHVGRkJFXXxbXFx1RkZDMi1cXHVGRkM3XXxbXFx1RkZDQS1cXHVGRkNGXXxbXFx1RkZEMi1cXHVGRkQ3XXxbXFx1RkZEQS1cXHVGRkRDXS8sXG4vKiAtLS0gKi9cblxuICBObCAgIDogL1tcXHUyMTYwLVxcdTIxODJdfFtcXHUzMDA3LVxcdTMwMDddfFtcXHUzMDIxLVxcdTMwMjldLyxcbiAgTW4gICA6IC9bXFx1MDMwMC1cXHUwMzQ1XXxbXFx1MDM2MC1cXHUwMzYxXXxbXFx1MDQ4My1cXHUwNDg2XXxbXFx1MDU5MS1cXHUwNUExXXxbXFx1MDVBMy1cXHUwNUI5XXxbXFx1MDVCQi1cXHUwNUJEXXxbXFx1MDVCRi1cXHUwNUJGXXxbXFx1MDVDMS1cXHUwNUMyXXxbXFx1MDVDNC1cXHUwNUM0XXxbXFx1MDY0Qi1cXHUwNjUyXXxbXFx1MDY3MC1cXHUwNjcwXXxbXFx1MDZENi1cXHUwNkRDXXxbXFx1MDZERi1cXHUwNkU0XXxbXFx1MDZFNy1cXHUwNkU4XXxbXFx1MDZFQS1cXHUwNkVEXXxbXFx1MDkwMS1cXHUwOTAyXXxbXFx1MDkzQy1cXHUwOTNDXXxbXFx1MDk0MS1cXHUwOTQ4XXxbXFx1MDk0RC1cXHUwOTREXXxbXFx1MDk1MS1cXHUwOTU0XXxbXFx1MDk2Mi1cXHUwOTYzXXxbXFx1MDk4MS1cXHUwOTgxXXxbXFx1MDlCQy1cXHUwOUJDXXxbXFx1MDlDMS1cXHUwOUM0XXxbXFx1MDlDRC1cXHUwOUNEXXxbXFx1MDlFMi1cXHUwOUUzXXxbXFx1MEEwMi1cXHUwQTAyXXxbXFx1MEEzQy1cXHUwQTNDXXxbXFx1MEE0MS1cXHUwQTQyXXxbXFx1MEE0Ny1cXHUwQTQ4XXxbXFx1MEE0Qi1cXHUwQTREXXxbXFx1MEE3MC1cXHUwQTcxXXxbXFx1MEE4MS1cXHUwQTgyXXxbXFx1MEFCQy1cXHUwQUJDXXxbXFx1MEFDMS1cXHUwQUM1XXxbXFx1MEFDNy1cXHUwQUM4XXxbXFx1MEFDRC1cXHUwQUNEXXxbXFx1MEIwMS1cXHUwQjAxXXxbXFx1MEIzQy1cXHUwQjNDXXxbXFx1MEIzRi1cXHUwQjNGXXxbXFx1MEI0MS1cXHUwQjQzXXxbXFx1MEI0RC1cXHUwQjREXXxbXFx1MEI1Ni1cXHUwQjU2XXxbXFx1MEI4Mi1cXHUwQjgyXXxbXFx1MEJDMC1cXHUwQkMwXXxbXFx1MEJDRC1cXHUwQkNEXXxbXFx1MEMzRS1cXHUwQzQwXXxbXFx1MEM0Ni1cXHUwQzQ4XXxbXFx1MEM0QS1cXHUwQzREXXxbXFx1MEM1NS1cXHUwQzU2XXxbXFx1MENCRi1cXHUwQ0JGXXxbXFx1MENDNi1cXHUwQ0M2XXxbXFx1MENDQy1cXHUwQ0NEXXxbXFx1MEQ0MS1cXHUwRDQzXXxbXFx1MEQ0RC1cXHUwRDREXXxbXFx1MEUzMS1cXHUwRTMxXXxbXFx1MEUzNC1cXHUwRTNBXXxbXFx1MEU0Ny1cXHUwRTRFXXxbXFx1MEVCMS1cXHUwRUIxXXxbXFx1MEVCNC1cXHUwRUI5XXxbXFx1MEVCQi1cXHUwRUJDXXxbXFx1MEVDOC1cXHUwRUNEXXxbXFx1MEYxOC1cXHUwRjE5XXxbXFx1MEYzNS1cXHUwRjM1XXxbXFx1MEYzNy1cXHUwRjM3XXxbXFx1MEYzOS1cXHUwRjM5XXxbXFx1MEY3MS1cXHUwRjdFXXxbXFx1MEY4MC1cXHUwRjg0XXxbXFx1MEY4Ni1cXHUwRjg3XXxbXFx1MEY5MC1cXHUwRjk1XXxbXFx1MEY5Ny1cXHUwRjk3XXxbXFx1MEY5OS1cXHUwRkFEXXxbXFx1MEZCMS1cXHUwRkI3XXxbXFx1MEZCOS1cXHUwRkI5XXxbXFx1MjBEMC1cXHUyMERDXXxbXFx1MjBFMS1cXHUyMEUxXXxbXFx1MzAyQS1cXHUzMDJGXXxbXFx1MzA5OS1cXHUzMDlBXXxbXFx1RkIxRS1cXHVGQjFFXXxbXFx1RkUyMC1cXHVGRTIzXS8sXG4gIE1jICAgOiAvW1xcdTA5MDMtXFx1MDkwM118W1xcdTA5M0UtXFx1MDk0MF18W1xcdTA5NDktXFx1MDk0Q118W1xcdTA5ODItXFx1MDk4M118W1xcdTA5QkUtXFx1MDlDMF18W1xcdTA5QzctXFx1MDlDOF18W1xcdTA5Q0ItXFx1MDlDQ118W1xcdTA5RDctXFx1MDlEN118W1xcdTBBM0UtXFx1MEE0MF18W1xcdTBBODMtXFx1MEE4M118W1xcdTBBQkUtXFx1MEFDMF18W1xcdTBBQzktXFx1MEFDOV18W1xcdTBBQ0ItXFx1MEFDQ118W1xcdTBCMDItXFx1MEIwM118W1xcdTBCM0UtXFx1MEIzRV18W1xcdTBCNDAtXFx1MEI0MF18W1xcdTBCNDctXFx1MEI0OF18W1xcdTBCNEItXFx1MEI0Q118W1xcdTBCNTctXFx1MEI1N118W1xcdTBCODMtXFx1MEI4M118W1xcdTBCQkUtXFx1MEJCRl18W1xcdTBCQzEtXFx1MEJDMl18W1xcdTBCQzYtXFx1MEJDOF18W1xcdTBCQ0EtXFx1MEJDQ118W1xcdTBCRDctXFx1MEJEN118W1xcdTBDMDEtXFx1MEMwM118W1xcdTBDNDEtXFx1MEM0NF18W1xcdTBDODItXFx1MEM4M118W1xcdTBDQkUtXFx1MENCRV18W1xcdTBDQzAtXFx1MENDNF18W1xcdTBDQzctXFx1MENDOF18W1xcdTBDQ0EtXFx1MENDQl18W1xcdTBDRDUtXFx1MENENl18W1xcdTBEMDItXFx1MEQwM118W1xcdTBEM0UtXFx1MEQ0MF18W1xcdTBENDYtXFx1MEQ0OF18W1xcdTBENEEtXFx1MEQ0Q118W1xcdTBENTctXFx1MEQ1N118W1xcdTBGM0UtXFx1MEYzRl18W1xcdTBGN0YtXFx1MEY3Rl0vLFxuICBOZCAgIDogL1tcXHUwMDMwLVxcdTAwMzldfFtcXHUwNjYwLVxcdTA2NjldfFtcXHUwNkYwLVxcdTA2RjldfFtcXHUwOTY2LVxcdTA5NkZdfFtcXHUwOUU2LVxcdTA5RUZdfFtcXHUwQTY2LVxcdTBBNkZdfFtcXHUwQUU2LVxcdTBBRUZdfFtcXHUwQjY2LVxcdTBCNkZdfFtcXHUwQkU3LVxcdTBCRUZdfFtcXHUwQzY2LVxcdTBDNkZdfFtcXHUwQ0U2LVxcdTBDRUZdfFtcXHUwRDY2LVxcdTBENkZdfFtcXHUwRTUwLVxcdTBFNTldfFtcXHUwRUQwLVxcdTBFRDldfFtcXHUwRjIwLVxcdTBGMjldfFtcXHVGRjEwLVxcdUZGMTldLyxcbiAgUGMgICA6IC9bXFx1MDA1Ri1cXHUwMDVGXXxbXFx1MjAzRi1cXHUyMDQwXXxbXFx1MzBGQi1cXHUzMEZCXXxbXFx1RkUzMy1cXHVGRTM0XXxbXFx1RkU0RC1cXHVGRTRGXXxbXFx1RkYzRi1cXHVGRjNGXXxbXFx1RkY2NS1cXHVGRjY1XS8sXG4gIFpzICAgOiAvW1xcdTIwMDAtXFx1MjAwQl18W1xcdTMwMDAtXFx1MzAwMF0vLFxufTtcbiJdfQ==
(23)
});
