!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ohm=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var ohm = _dereq_('..');
module.exports = ohm.makeRecipe(function() {
  return new this.newGrammar("BuiltInRules")
    .define("alnum", [], this.alt(this.app("letter"), this.app("digit")), "an alpha-numeric character")
    .define("letter", [], this.alt(this.app("lower"), this.app("upper")), "a letter")
    .define("lower", [], this.range("a", "z"), "a lower-case letter")
    .define("upper", [], this.range("A", "Z"), "an upper-case letter")
    .define("digit", [], this.range("0", "9"), "a digit")
    .define("hexDigit", [], this.alt(this.app("digit"), this.range("a", "f"), this.range("A", "F")), "a hexadecimal digit")
    .define("ListOf_some", ["elem", "sep"], this.seq(this.param(0), this.star(this.seq(this.param(1), this.param(0)))))
    .define("ListOf_none", ["elem", "sep"], this.seq())
    .define("ListOf", ["elem", "sep"], this.alt(this.app("ListOf_some", [this.app("elem"), this.app("sep")]), this.app("ListOf_none", [this.app("elem"), this.app("sep")])))
    .define("listOf_some", ["elem", "sep"], this.seq(this.param(0), this.star(this.seq(this.param(1), this.param(0)))))
    .define("listOf_none", ["elem", "sep"], this.seq())
    .define("listOf", ["elem", "sep"], this.alt(this.app("listOf_some", [this.app("elem"), this.app("sep")]), this.app("listOf_none", [this.app("elem"), this.app("sep")])))
    .build();
});


},{"..":28}],2:[function(_dereq_,module,exports){
var ohm = _dereq_('..');
module.exports = ohm.makeRecipe(function() {
  return new this.newGrammar("Ohm")
    .withDefaultStartRule('Grammars')
    .define("Grammars", [], this.star(this.app("Grammar")))
    .define("Grammar", [], this.seq(this.app("ident"), this.opt(this.app("SuperGrammar")), this.prim("{"), this.star(this.app("Rule")), this.prim("}")))
    .define("SuperGrammar", [], this.seq(this.prim("<:"), this.app("ident")))
    .define("Rule_define", [], this.seq(this.app("ident"), this.opt(this.app("Formals")), this.opt(this.app("ruleDescr")), this.prim("="), this.app("Alt")))
    .define("Rule_override", [], this.seq(this.app("ident"), this.opt(this.app("Formals")), this.prim(":="), this.app("Alt")))
    .define("Rule_extend", [], this.seq(this.app("ident"), this.opt(this.app("Formals")), this.prim("+="), this.app("Alt")))
    .define("Rule", [], this.alt(this.app("Rule_define"), this.app("Rule_override"), this.app("Rule_extend")))
    .define("Formals", [], this.seq(this.prim("<"), this.app("ListOf", [this.app("ident"), this.prim(",")]), this.prim(">")))
    .define("Params", [], this.seq(this.prim("<"), this.app("ListOf", [this.app("Seq"), this.prim(",")]), this.prim(">")))
    .define("Alt", [], this.seq(this.app("Term"), this.star(this.seq(this.prim("|"), this.app("Term")))))
    .define("Term_inline", [], this.seq(this.app("Seq"), this.app("caseName")))
    .define("Term", [], this.alt(this.app("Term_inline"), this.app("Seq")))
    .define("Seq", [], this.star(this.app("Iter")))
    .define("Iter_star", [], this.seq(this.app("Pred"), this.prim("*")))
    .define("Iter_plus", [], this.seq(this.app("Pred"), this.prim("+")))
    .define("Iter_opt", [], this.seq(this.app("Pred"), this.prim("?")))
    .define("Iter", [], this.alt(this.app("Iter_star"), this.app("Iter_plus"), this.app("Iter_opt"), this.app("Pred")))
    .define("Pred_not", [], this.seq(this.prim("~"), this.app("Lex")))
    .define("Pred_lookahead", [], this.seq(this.prim("&"), this.app("Lex")))
    .define("Pred", [], this.alt(this.app("Pred_not"), this.app("Pred_lookahead"), this.app("Lex")))
    .define("Lex_lex", [], this.seq(this.prim("#"), this.app("Base")))
    .define("Lex", [], this.alt(this.app("Lex_lex"), this.app("Base")))
    .define("Base_application", [], this.seq(this.app("ident"), this.opt(this.app("Params")), this.not(this.alt(this.seq(this.opt(this.app("ruleDescr")), this.prim("=")), this.prim(":="), this.prim("+=")))))
    .define("Base_range", [], this.seq(this.app("Prim"), this.prim(".."), this.app("Prim")))
    .define("Base_prim", [], this.app("Prim"))
    .define("Base_paren", [], this.seq(this.prim("("), this.app("Alt"), this.prim(")")))
    .define("Base_arr", [], this.seq(this.prim("["), this.app("Alt"), this.prim("]")))
    .define("Base_str", [], this.seq(this.prim("``"), this.app("Alt"), this.prim("''")))
    .define("Base_obj", [], this.seq(this.prim("{"), this.opt(this.prim("...")), this.prim("}")))
    .define("Base_objWithProps", [], this.seq(this.prim("{"), this.app("Props"), this.opt(this.seq(this.prim(","), this.prim("..."))), this.prim("}")))
    .define("Base", [], this.alt(this.app("Base_application"), this.app("Base_range"), this.app("Base_prim"), this.app("Base_paren"), this.app("Base_arr"), this.app("Base_str"), this.app("Base_obj"), this.app("Base_objWithProps")))
    .define("Prim", [], this.alt(this.app("keyword"), this.app("string"), this.app("number")))
    .define("Props", [], this.seq(this.app("Prop"), this.star(this.seq(this.prim(","), this.app("Prop")))))
    .define("Prop", [], this.seq(this.alt(this.app("name"), this.app("string")), this.prim(":"), this.app("Alt")))
    .define("ruleDescr", [], this.seq(this.prim("("), this.app("ruleDescrText"), this.prim(")")), "a rule description")
    .define("ruleDescrText", [], this.star(this.seq(this.not(this.prim(")")), this.app("_"))))
    .define("caseName", [], this.seq(this.prim("--"), this.star(this.seq(this.not(this.prim("\n")), this.app("space"))), this.app("name"), this.star(this.seq(this.not(this.prim("\n")), this.app("space"))), this.alt(this.prim("\n"), this.la(this.prim("}")))))
    .define("name", [], this.seq(this.app("nameFirst"), this.star(this.app("nameRest"))), "a name")
    .define("nameFirst", [], this.alt(this.prim("_"), this.app("letter")))
    .define("nameRest", [], this.alt(this.prim("_"), this.app("alnum")))
    .define("ident", [], this.seq(this.not(this.app("keyword")), this.app("name")), "an identifier")
    .define("keyword_null", [], this.seq(this.prim("null"), this.not(this.app("nameRest"))))
    .define("keyword_true", [], this.seq(this.prim("true"), this.not(this.app("nameRest"))))
    .define("keyword_false", [], this.seq(this.prim("false"), this.not(this.app("nameRest"))))
    .define("keyword", [], this.alt(this.app("keyword_null"), this.app("keyword_true"), this.app("keyword_false")))
    .define("string", [], this.seq(this.prim("\""), this.star(this.app("strChar")), this.prim("\"")))
    .define("strChar", [], this.alt(this.app("escapeChar"), this.seq(this.not(this.prim("\\")), this.not(this.prim("\"")), this.not(this.prim("\n")), this.app("_"))))
    .define("escapeChar_backslash", [], this.prim("\\\\"))
    .define("escapeChar_doubleQuote", [], this.prim("\\\""))
    .define("escapeChar_singleQuote", [], this.prim("\\'"))
    .define("escapeChar_backspace", [], this.prim("\\b"))
    .define("escapeChar_lineFeed", [], this.prim("\\n"))
    .define("escapeChar_carriageReturn", [], this.prim("\\r"))
    .define("escapeChar_tab", [], this.prim("\\t"))
    .define("escapeChar_unicodeEscape", [], this.seq(this.prim("\\u"), this.app("hexDigit"), this.app("hexDigit"), this.app("hexDigit"), this.app("hexDigit")))
    .define("escapeChar_hexEscape", [], this.seq(this.prim("\\x"), this.app("hexDigit"), this.app("hexDigit")))
    .define("escapeChar", [], this.alt(this.app("escapeChar_backslash"), this.app("escapeChar_doubleQuote"), this.app("escapeChar_singleQuote"), this.app("escapeChar_backspace"), this.app("escapeChar_lineFeed"), this.app("escapeChar_carriageReturn"), this.app("escapeChar_tab"), this.app("escapeChar_unicodeEscape"), this.app("escapeChar_hexEscape")), "an escape sequence")
    .define("number", [], this.seq(this.opt(this.prim("-")), this.plus(this.app("digit"))), "a number")
    .define("space_singleLine", [], this.seq(this.prim("//"), this.star(this.seq(this.not(this.prim("\n")), this.app("_"))), this.prim("\n")))
    .define("space_multiLine", [], this.seq(this.prim("/*"), this.star(this.seq(this.not(this.prim("*/")), this.app("_"))), this.prim("*/")))
    .extend("space", [], this.alt(this.alt(this.app("space_singleLine"), this.app("space_multiLine")), this.range("\u0000", " ")), "a space")
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
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

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
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

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

  range: function(from, to) {
    return new pexprs.Range(from, to);
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

  lex: function(expr) {
    return new pexprs.Lex(expr);
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

},{"./GrammarDecl":17,"./pexprs":43}],16:[function(_dereq_,module,exports){
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
        _iter: function(children) {
          stack.push(this._node);
          children.forEach(function(child) { child.setParents(); });
          stack.pop();
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
      return name === '_terminal' || name === '_iter' || name === '_default';
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
    if (actionName === '_default' || actionName === '_iter') {
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
    sb.append('  return new this.newGrammar(' + JSON.stringify(this.name) + ')\n');
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
      var formals = '[' + body.formals.map(JSON.stringify).join(', ') + ']';
      sb.append('(' + JSON.stringify(ruleName) + ', ' + formals + ', ');
      body.outputRecipe(sb, body.formals);
      if (body.description) {
        sb.append(', ' + JSON.stringify(body.description));
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
  space: new pexprs.Range('\x00', ' ').withFormals([]).withDescription('a space')
});

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Grammar;

},{"./InputStream":18,"./Interval":19,"./MatchResult":20,"./Semantics":23,"./State":24,"./common":26,"./errors":27,"./nodes":29,"./pexprs":43}],17:[function(_dereq_,module,exports){
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
    throw new errors.DuplicateParameterNames(name, duplicateParameterNames, body);
  }
  var baseRule = this.ensureSuperGrammar().ruleDict[name];
  if (formals.length !== baseRule.formals.length) {
    throw new errors.WrongNumberOfParameters(name, baseRule.formals.length, formals.length, body);
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
        function() { body.assertAllApplicationsAreValid(ruleName, grammar); },
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
    throw new errors.DuplicateRuleDeclaration(name, this.name, this.superGrammar.name, body);
  } else if (this.ruleDict[name]) {
    throw new errors.DuplicateRuleDeclaration(name, this.name, this.name, body);
  }
  var duplicateParameterNames = common.getDuplicates(formals);
  if (duplicateParameterNames.length > 0) {
    throw new errors.DuplicateParameterNames(name, duplicateParameterNames, body);
  }
  return this.install(name, formals, optDescr, body);
};

GrammarDecl.prototype.override = function(name, formals, body) {
  var baseRule = this.ensureSuperGrammar().ruleDict[name];
  if (!baseRule) {
    throw new errors.CannotOverrideUndeclaredRule(name, this.superGrammar.name, body);
  }
  this.installOverriddenOrExtendedRule(name, formals, body);
  return this;
};

GrammarDecl.prototype.extend = function(name, formals, body) {
  var baseRule = this.ensureSuperGrammar().ruleDict[name];
  if (!baseRule) {
    throw new errors.CannotExtendUndeclaredRule(name, this.superGrammar.name, body);
  }
  this.installOverriddenOrExtendedRule(
      name, formals, new pexprs.Extend(this.superGrammar, name, body));
  return this;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = GrammarDecl;

},{"./Grammar":16,"./common":26,"./errors":27,"./pexprs":43}],18:[function(_dereq_,module,exports){
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

  interval: function(startIdx, optEndIdx) {
    return new Interval(this, startIdx, optEndIdx ? optEndIdx : this.pos);
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
    var range = [this.startIdx, this.endIdx];
    return util.getLineAndColumnMessage(this.inputStream.source, this.startIdx, range);
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


},{"./errors":27,"./util":44}],20:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var inherits = _dereq_('inherits');

var common = _dereq_('./common');
var util = _dereq_('./util');
var Interval = _dereq_('./Interval');

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

MatchFailure.prototype.getInterval = function() {
  var pos = this.state.getFailuresPos();
  return new Interval(this.state.inputStream, pos, pos);
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

},{"./Interval":19,"./common":26,"./util":44,"inherits":12}],21:[function(_dereq_,module,exports){
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
  this.memo = {};

  // Redundant (could be generated from applicationStack) but it makes things simpler.
  // Note: this used to a dictionary, but that caused V8 to deoptimize the entire function,
  // so using an Array is actually faster (for now).
  this.activeApplications = [];
}

PosInfo.prototype = {
  isActive: function(application) {
    return this.activeApplications.indexOf(application.toMemoKey()) !== -1;
  },

  enter: function(application) {
    this.globalApplicationStack.push(application);
    this.applicationStack.push(application);
    this.activeApplications.push(application.toMemoKey());
  },

  exit: function() {
    this.globalApplicationStack.pop();
    this.applicationStack.pop();
    this.activeApplications.pop();
  },

  shouldUseMemoizedResult: function(application, memoRec) {
    var involvedApplications = memoRec.involvedApplications;
    if (involvedApplications != null) {
      var keys = Object.keys(involvedApplications);
      for (var i = 0; i < keys.length; ++i) {
        var memoKey = keys[i];
        if (involvedApplications[memoKey] && this.activeApplications.indexOf(memoKey) !== -1) {
          return false;
        }
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

  // Create the action dictionary for this operation / attribute. We begin by defining the default
  // behavior of terminal and iteration nodes, and add a '_default' action that throws an error if
  // a rule in the grammar doesn't have a corresponding action in this operation / attribute...
  var realActionDict = {
    _terminal: function() {
      return this.primitiveValue;
    },
    _iter: function(children) {
      // This CST node corresponds to an iteration expression in the grammar (*, +, or ?). The
      // default behavior is to map this operation or attribute over all of its child nodes.
      var thisSemantics = this._semantics;
      var thisThing = thisSemantics[typePlural][name];
      return children.map(function(child) { return thisThing.execute(thisSemantics, child); });
    },
    _default: function(children) {
      if (children.length === 1) {
        var thisSemantics = this._semantics;
        var thisThing = thisSemantics[typePlural][name];
        return thisThing.execute(thisSemantics, children[0]);
      }
      throw new Error('missing semantic action for ' + this.ctorName + ' in ' + name + ' ' + type);
    }
  };
  // ... and add in the actions supplied by the programmer, which may override some or all of the
  // default ones.
  Object.keys(actionDict).forEach(function(name) {
    realActionDict[name] = actionDict[name];
  });

  this[typePlural][name] = new Ctor(name, realActionDict);

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
  // Look for a semantic action whose name matches the node's constructor name, which is either the
  // name of a rule in the grammar, or '_terminal' (for a terminal node), or '_iter' (for an
  // iteration node). In the latter case, the action function receives a single argument, which is
  // an array containing all of the children of the CST node.
  var actionFn = this.actionDict[nodeWrapper._node.ctorName];
  if (actionFn) {
    return this.doAction(semantics, nodeWrapper, actionFn, nodeWrapper.isIteration());
  }

  // The action dictionary does not contain a semantic action for this specific type of node, so
  // invoke the '_default' semantic action. The built-in implementation of the `_default` semantic
  // action just throws an error, but the programmer may have overridden it.
  return this.doAction(semantics, nodeWrapper, this.actionDict._default, true);
};

// Invoke `actionFn` on the CST node that corresponds to `nodeWrapper`, in the context of
// `semantics`. If `optPassChildrenAsArray` is true, `actionFn` will be called with a single
// argument, which is an array of wrappers. Otherwise, the number of arguments to `actionFn` will
// be equal to the number of children in the CST node.
Operation.prototype.doAction = function(semantics, nodeWrapper, actionFn, optPassChildrenAsArray) {
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

var applySpaces_ = new pexprs.Apply('spaces_');

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

  currentApplication: function() {
    return this.applicationStack[this.applicationStack.length - 1];
  },

  inSyntacticRule: function() {
    if (typeof this.inputStream.source !== 'string') {
      return false;
    }
    var currentApplication = this.currentApplication();
    return currentApplication && currentApplication.isSyntactic();
  },

  skipSpaces: function() {
    this.ignoreFailures();
    applySpaces_.eval(this);
    this.bindings.pop();
    this.recordFailures();
    return this.inputStream.pos;
  },

  skipSpacesIfInSyntacticContext: function() {
    if (this.inSyntacticRule()) {
      this.skipSpaces();
    }
    return this.inputStream.pos;
  },

  truncateBindings: function(newLength) {
    while (this.bindings.length > newLength) {
      this.bindings.pop();
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
  },

  applySpaces_: applySpaces_
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = State;

},{"./PosInfo":22,"./Trace":25,"./pexprs":43}],25:[function(_dereq_,module,exports){
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
  throw new Error(
      'this method is abstract! ' +
      '(it has no implementation in class ' + this.constructor.name + ')');
};

exports.assert = function(cond, message) {
  if (!cond) {
    throw new Error(message);
  }
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

exports.repeatStr = function(str, n) {
  return new Array(n + 1).join(str);
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
    return exports.repeatStr(ch, len - str.length) + str;
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
      Object.defineProperty(this, 'shortMessage', {
        get: function() {
          return 'Expected ' + matchFailure.getExpectedText();
        }
      });
      this.interval = matchFailure.getInterval();
    }
);

// Undeclared grammar

var UndeclaredGrammar = makeCustomError(
    'ohm.error.UndeclaredGrammar',
    function(grammarName, namespace, interval) {
      this.grammarName = grammarName;
      this.namespace = namespace;
      if (this.namespace) {
        this.message = 'Grammar ' + this.grammarName +
            ' is not declared in namespace ' + Namespace.toString(this.namespace);
      } else {
        this.message = 'Undeclared grammar ' + this.grammarName;
      }
      this.interval = interval;
    }
);

// Duplicate grammar declaration

var DuplicateGrammarDeclaration = makeCustomError(
    'ohm.error.DuplicateGrammarDeclaration',
    function(grammar, namespace) {
      this.grammarName = grammar.name;
      this.namespace = namespace;
      this.message = 'Grammar ' + this.grammarName +
          ' is already declared in namespace ' + Namespace.toString(this.namespace);
      this.interval = grammar.definitionInterval;
    }
);

// ----------------- rules -----------------

// Undeclared rule

var UndeclaredRule = makeCustomError(
    'ohm.error.UndeclaredRule',
    function(ruleName, grammarName, expr) {
      this.ruleName = ruleName;
      this.grammarName = grammarName;
      this.message = 'Rule ' + this.ruleName + ' is not declared in grammar ' + this.grammarName;
      this.interval = expr.interval;
    }
);

// Cannot override undeclared rule

var CannotOverrideUndeclaredRule = makeCustomError(
    'ohm.error.CannotOverrideUndeclaredRule',
    function(ruleName, grammarName, body) {
      this.ruleName = ruleName;
      this.grammarName = grammarName;
      this.message =
          'Cannot override rule ' + this.ruleName +
          ' because it is not declared in ' + this.grammarName;
      this.interval = body.definitionInterval;
    }
);

// Cannot extend undeclared rule

var CannotExtendUndeclaredRule = makeCustomError(
    'ohm.error.CannotExtendUndeclaredRule',
    function(ruleName, grammarName, body) {
      this.ruleName = ruleName;
      this.grammarName = grammarName;
      this.message =
          'Cannot extend rule ' + this.ruleName +
          ' because it is not declared in ' + this.grammarName;
      this.interval = body.definitionInterval;
    }
);

// Duplicate rule declaration

var DuplicateRuleDeclaration = makeCustomError(
    'ohm.error.DuplicateRuleDeclaration',
    function(ruleName, offendingGrammarName, declGrammarName, body) {
      this.ruleName = ruleName;
      this.offendingGrammarName = offendingGrammarName;
      this.declGrammarName = declGrammarName;
      this.message = "Duplicate declaration for rule '" + this.ruleName +
                     "' in grammar '" + this.offendingGrammarName + "'";
      if (this.offendingGrammarName !== declGrammarName) {
        this.message += " (originally declared in grammar '" + this.declGrammarName + "')";
      }
      this.interval = body.definitionInterval;
    }
);

// Wrong number of parameters

var WrongNumberOfParameters = makeCustomError(
    'ohm.error.WrongNumberOfParameters',
    function(ruleName, expected, actual, body) {
      this.ruleName = ruleName;
      this.expected = expected;
      this.actual = actual;
      this.message = 'Wrong number of parameters for rule ' + this.ruleName +
                     ' (expected ' + this.expected + ', got ' + this.actual + ')';
      this.interval = body.definitionInterval;
    }
);

// Duplicate parameter names

var DuplicateParameterNames = makeCustomError(
    'ohm.error.DuplicateParameterNames',
    function(ruleName, duplicates, body) {
      this.ruleName = ruleName;
      this.duplicates = duplicates;
      this.message = 'Duplicate parameter names in rule ' + this.ruleName + ': ' +
          this.duplicates.join(',');
      this.interval = body.definitionInterval;
    }
);

// Invalid parameter expression

var InvalidParameter = makeCustomError(
    'ohm.error.InvalidParameter',
    function(ruleName, expr) {
      this.ruleName = ruleName;
      this.expr = expr;
      this.interval = expr.interval;
      this.message = 'Invalid parameter to rule ' + this.ruleName + ': ' + this.expr +
                     ' has arity ' + this.expr.getArity() + ', but parameter expressions ' +
                     'must have arity 1';
    }
);

// Application of syntactic rule from lexical rule

var ApplicationOfSyntacticRuleFromLexicalRule = makeCustomError(
    'ohm.error.ApplicationOfSyntacticRuleFromLexicalRule',
    function(lexicalRuleName, syntacticRuleName, applyExpr) {
      this.lexicalRuleName = lexicalRuleName;
      this.syntacticRuleName = syntacticRuleName;
      this.applyExpr = applyExpr;
      this.interval = applyExpr.interval;
      this.shortMessage =
          'Cannot apply syntactic rule ' + syntacticRuleName +
          ' from the body of lexical rule ' + lexicalRuleName;
      this.message = applyExpr.interval.getLineAndColumnMessage() + this.shortMessage;
    }
);

// ----------------- Kleene operators -----------------

var KleeneExprHasNullableOperand = makeCustomError(
    'ohm.error.KleeneExprHasNullableOperand',
    function(kleeneExpr) {
      this.expr = kleeneExpr;

      var operator = kleeneExpr.operator;
      var nullableExpr = kleeneExpr.expr;
      this.shortMessage = 'Nullable expression ' + nullableExpr.interval.contents +
                          " is not allowed inside '" + operator + "' (possible infinite loop)";
      this.message = nullableExpr.interval.getLineAndColumnMessage() + this.shortMessage;
      this.interval = nullableExpr.interval;
    }
);

// ----------------- arity -----------------

var InconsistentArity = makeCustomError(
    'ohm.error.InconsistentArity',
    function(ruleName, expected, actual, expr) {
      this.ruleName = ruleName;
      this.expected = expected;
      this.actual = actual;
      this.message =
          'Rule ' + this.ruleName + ' involves an alternation which has inconsistent arity ' +
          '(expected ' + this.expected + ', got ' + this.actual + ')';
      this.interval = expr.interval;
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
      // Let's use the first error.
      this.shortMessage = errors[0].shortMessage ? errors[0].shortMessage : errors[0].message;
      this.interval = errors[0].interval;
    }
);

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = {
  ApplicationOfSyntacticRuleFromLexicalRule: ApplicationOfSyntacticRuleFromLexicalRule,
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
      g.definitionInterval = this.interval.trimmed();
      if (grammarName in namespace) {
        throw new errors.DuplicateGrammarDeclaration(g, namespace);
      }
      namespace[grammarName] = g;
      return g;
    },

    SuperGrammar: function(_, n) {
      var superGrammarName = n.visit();
      if (superGrammarName === 'null') {
        decl.withSuperGrammar(null);
      } else {
        if (!namespace || !(superGrammarName in namespace)) {
          throw new errors.UndeclaredGrammar(superGrammarName, namespace, n.interval);
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

    Lex_lex: function(_, x) {
      return builder.lex(x.visit()).withInterval(this.interval);
    },

    Base_application: function(rule, ps) {
      return builder.app(rule.visit(), ps.visit()[0] || []).withInterval(this.interval);
    },
    Base_range: function(from, _, to) {
      return builder.range(from.visit(), to.visit()).withInterval(this.interval);
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
    }
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
},{"../dist/built-in-rules":1,"../dist/ohm-grammar":2,"./Builder":15,"./Grammar":16,"./Namespace":21,"./common":26,"./errors":27,"./util":44,"buffer":3}],29:[function(_dereq_,module,exports){
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
var errors = _dereq_('./errors');
var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertAllApplicationsAreValid = common.abstract;

pexprs.anything.assertAllApplicationsAreValid =
pexprs.end.assertAllApplicationsAreValid =
pexprs.Prim.prototype.assertAllApplicationsAreValid =
pexprs.Range.prototype.assertAllApplicationsAreValid =
pexprs.Param.prototype.assertAllApplicationsAreValid = function(ruleName, grammar) {
  // no-op
};

pexprs.Alt.prototype.assertAllApplicationsAreValid = function(ruleName, grammar) {
  for (var idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx].assertAllApplicationsAreValid(ruleName, grammar);
  }
};

pexprs.Seq.prototype.assertAllApplicationsAreValid = function(ruleName, grammar) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertAllApplicationsAreValid(ruleName, grammar);
  }
};

pexprs.Iter.prototype.assertAllApplicationsAreValid =
pexprs.Not.prototype.assertAllApplicationsAreValid =
pexprs.Lookahead.prototype.assertAllApplicationsAreValid =
pexprs.Lex.prototype.assertAllApplicationsAreValid =
pexprs.Arr.prototype.assertAllApplicationsAreValid =
pexprs.Str.prototype.assertAllApplicationsAreValid = function(ruleName, grammar) {
  this.expr.assertAllApplicationsAreValid(ruleName, grammar);
};

pexprs.Obj.prototype.assertAllApplicationsAreValid = function(ruleName, grammar) {
  for (var idx = 0; idx < this.properties.length; idx++) {
    this.properties[idx].pattern.assertAllApplicationsAreValid(ruleName, grammar);
  }
};

pexprs.Apply.prototype.assertAllApplicationsAreValid = function(ruleName, grammar) {
  var body = grammar.ruleDict[this.ruleName];

  // Make sure that the rule exists
  if (!body) {
    throw new errors.UndeclaredRule(this.ruleName, grammar.name, this);
  }

  // ... and that this application is allowed
  if (!common.isSyntactic(ruleName) && common.isSyntactic(this.ruleName)) {
    throw new errors.ApplicationOfSyntacticRuleFromLexicalRule(ruleName, this.ruleName, this);
  }

  // ... and that this application has the correct number of parameters
  var actual = this.params.length;
  var expected = body.formals.length;
  if (actual !== expected) {
    throw new errors.WrongNumberOfParameters(this.ruleName, expected, actual, this);
  }

  // ... and that all of the parameter expressions only have valid applications and have arity 1
  var self = this;
  this.params.forEach(function(param) {
    param.assertAllApplicationsAreValid(ruleName, grammar);
    if (param.getArity() !== 1) {
      throw new errors.InvalidParameter(self.ruleName, param);
    }
  });
};

},{"./common":26,"./errors":27,"./pexprs":43}],31:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common');
var errors = _dereq_('./errors');
var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertChoicesHaveUniformArity = common.abstract;

pexprs.anything.assertChoicesHaveUniformArity =
pexprs.end.assertChoicesHaveUniformArity =
pexprs.Prim.prototype.assertChoicesHaveUniformArity =
pexprs.Range.prototype.assertChoicesHaveUniformArity =
pexprs.Param.prototype.assertChoicesHaveUniformArity =
pexprs.Lex.prototype.assertChoicesHaveUniformArity = function(ruleName) {
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
      throw new errors.InconsistentArity(ruleName, arity, otherArity, this);
    }
  }
};

pexprs.Extend.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  // Extend is a special case of Alt that's guaranteed to have exactly two
  // cases: [extensions, origBody].
  var actualArity = this.terms[0].getArity();
  var expectedArity = this.terms[1].getArity();
  if (actualArity !== expectedArity) {
    throw new errors.InconsistentArity(ruleName, expectedArity, actualArity, this);
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

},{"./common":26,"./errors":27,"./pexprs":43}],32:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common');
var errors = _dereq_('./errors');
var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertIteratedExprsAreNotNullable = common.abstract;

pexprs.anything.assertIteratedExprsAreNotNullable =
pexprs.end.assertIteratedExprsAreNotNullable =
pexprs.Prim.prototype.assertIteratedExprsAreNotNullable =
pexprs.Prim.prototype.assertIteratedExprsAreNotNullable =
pexprs.Range.prototype.assertIteratedExprsAreNotNullable =
pexprs.Param.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
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
pexprs.Lex.prototype.assertIteratedExprsAreNotNullable =
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

},{"./common":26,"./errors":27,"./pexprs":43}],33:[function(_dereq_,module,exports){
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

pexprs.Range.prototype.check = function(grammar, vals) {
  return vals[0] instanceof nodes.Node &&
         vals[0].isTerminal() &&
         typeof vals[0].primitiveValue === typeof this.from;
};

pexprs.Param.prototype.check = function(grammar, vals) {
  return vals.length >= 1;
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

pexprs.Lookahead.prototype.check =
pexprs.Lex.prototype.check =
pexprs.Arr.prototype.check =
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

},{"./common":26,"./nodes":29,"./pexprs":43}],34:[function(_dereq_,module,exports){
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

/**
 *  Evaluate the expression and return `true` if it succeeded, `false` otherwise. On success, the
 *  bindings will have `this.arity` more elements than before, and the position may have increased.
 *  On failure, the bindings and position will be unchanged.
 */
pexprs.PExpr.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var origNumBindings = state.bindings.length;
  var origTrace = state.trace;

  if (state.isTracing()) {
    state.trace = [];
  }

  // Do the actual evaluation.
  var ans = this._eval(state);

  if (state.isTracing()) {
    var traceEntry = state.getTraceEntry(origPos, this, ans);
    origTrace.push(traceEntry);
    state.trace = origTrace;
  }

  if (!ans) {
    // Reset the position and the bindings.
    inputStream.pos = origPos;
    state.truncateBindings(origNumBindings);
  }

  return ans;
};

/**
 *  Evaluate the expression and return true if it succeeded, false otherwise.
 *  This method should not be called directly except by `eval`.
 *
 *  The contract of this method is as follows:
 *  - When the return value is true:
 *    - bindings will have expr.arity more elements than before
 *  - When the return value is false:
 *    - bindings may have more elements than before this call
 *    - position could be anywhere
 */
pexprs.PExpr.prototype._eval = common.abstract;

pexprs.anything._eval = function(state) {
  var origPos = state.skipSpacesIfInSyntacticContext();
  var inputStream = state.inputStream;
  var value = inputStream.next();
  if (value === common.fail) {
    state.recordFailure(origPos, this);
    return false;
  } else {
    var interval = inputStream.interval(origPos);
    state.bindings.push(new TerminalNode(state.grammar, value, interval));
    return true;
  }
};

pexprs.end._eval = function(state) {
  var origPos = state.skipSpacesIfInSyntacticContext();
  var inputStream = state.inputStream;
  if (inputStream.atEnd()) {
    var interval = inputStream.interval(inputStream.pos);
    state.bindings.push(new TerminalNode(state.grammar, undefined, interval));
    return true;
  } else {
    state.recordFailure(origPos, this);
    return false;
  }
};

pexprs.Prim.prototype._eval = function(state) {
  var origPos = state.skipSpacesIfInSyntacticContext();
  var inputStream = state.inputStream;
  if (this.match(inputStream) === common.fail) {
    state.recordFailure(origPos, this);
    return false;
  } else {
    var interval = inputStream.interval(origPos);
    var primitiveValue = this.obj;
    state.bindings.push(new TerminalNode(state.grammar, primitiveValue, interval));
    return true;
  }
};

pexprs.Prim.prototype.match = function(inputStream) {
  return inputStream.matchExactly(this.obj);
};

pexprs.StringPrim.prototype.match = function(inputStream) {
  return inputStream.matchString(this.obj);
};

pexprs.Range.prototype._eval = function(state) {
  var origPos = state.skipSpacesIfInSyntacticContext();
  var inputStream = state.inputStream;
  var obj = inputStream.next();
  if (typeof obj === typeof this.from && this.from <= obj && obj <= this.to) {
    var interval = inputStream.interval(origPos);
    state.bindings.push(new TerminalNode(state.grammar, obj, interval));
    return true;
  } else {
    state.recordFailure(origPos, this);
    return false;
  }
};

pexprs.Param.prototype._eval = function(state, inputStream) {
  return state.currentApplication().params[this.index].eval(state);
};

pexprs.Alt.prototype._eval = function(state) {
  for (var idx = 0; idx < this.terms.length; idx++) {
    if (this.terms[idx].eval(state)) {
      return true;
    }
  }
  return false;
};

pexprs.Seq.prototype._eval = function(state) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    var factor = this.factors[idx];
    if (!factor.eval(state)) {
      return false;
    }
  }
  return true;
};

pexprs.Iter.prototype._eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var arity = this.getArity();
  var cols = [];
  while (cols.length < arity) {
    cols.push([]);
  }
  var numMatches = 0;
  var idx;
  while (numMatches < this.maxNumMatches && this.expr.eval(state)) {
    numMatches++;
    var row = state.bindings.splice(state.bindings.length - arity, arity);
    for (idx = 0; idx < row.length; idx++) {
      cols[idx].push(row[idx]);
    }
  }
  if (numMatches < this.minNumMatches) {
    return false;
  }
  var interval;
  if (numMatches === 0) {
    interval = inputStream.interval(origPos, origPos);
  } else {
    var firstCol = cols[0];
    var lastCol = cols[cols.length - 1];
    interval = inputStream.interval(
        firstCol[0].interval.startIdx,
        lastCol[lastCol.length - 1].interval.endIdx);
  }
  for (idx = 0; idx < cols.length; idx++) {
    state.bindings.push(new Node(state.grammar, '_iter', cols[idx], interval));
  }
  return true;
};

pexprs.Not.prototype._eval = function(state) {
  /*
    TODO:
    - Right now we're just throwing away all of the failures that happen inside a `not`, and
      recording `this` as a failed expression.
    - Double negation should be equivalent to lookahead, but that's not the case right now wrt
      failures. E.g., ~~'foo' produces a failure for ~~'foo', but maybe it should produce
      a failure for 'foo' instead.
  */

  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var origNumBindings = state.bindings.length;
  state.ignoreFailures();
  var ans = this.expr.eval(state);
  state.recordFailures();
  if (ans) {
    state.recordFailure(origPos, this);
    state.truncateBindings(origNumBindings);
    return false;
  } else {
    inputStream.pos = origPos;
    return true;
  }
};

pexprs.Lookahead.prototype._eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (this.expr.eval(state)) {
    inputStream.pos = origPos;
    return true;
  } else {
    return false;
  }
};

pexprs.Lex.prototype._eval = function(state) {
  var app = state.currentApplication();
  app.lexify();
  var ans = this.expr.eval(state);
  app.unlexify();
  return ans;
};

pexprs.Arr.prototype._eval = function(state) {
  var obj = state.inputStream.next();
  if (Array.isArray(obj)) {
    var objInputStream = InputStream.newFor(obj);
    state.pushInputStream(objInputStream);
    var ans = this.expr.eval(state) && objInputStream.atEnd();
    state.popInputStream();
    return ans;
  } else {
    return false;
  }
};

pexprs.Str.prototype._eval = function(state) {
  var obj = state.inputStream.next();
  if (typeof obj === 'string') {
    var strInputStream = InputStream.newFor(obj);
    state.pushInputStream(strInputStream);
    var ans = this.expr.eval(state) && pexprs.end.eval(state);
    if (ans) {
      // Pop the binding that was added by `end`, which we don't want.
      state.bindings.pop();
    }
    state.popInputStream();
    return ans;
  } else {
    return false;
  }
};

pexprs.Obj.prototype._eval = function(state) {
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
      var valueInputStream = InputStream.newFor([value]);
      state.pushInputStream(valueInputStream);
      var matched = property.pattern.eval(state) && valueInputStream.atEnd();
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
      var interval = inputStream.interval(origPos);
      state.bindings.push(new TerminalNode(state.grammar, remainder, interval));
      return true;
    } else {
      return numOwnPropertiesMatched === Object.keys(obj).length;
    }
  } else {
    return false;
  }
};

function useMemoizedResult(state, application, memoRecOrLR) {
  var inputStream = state.inputStream;
  var bindings = state.bindings;

  inputStream.pos = memoRecOrLR.pos;
  if (memoRecOrLR.failureDescriptor) {
    state.recordFailures(memoRecOrLR.failureDescriptor, application);
  }
  if (state.isTracing()) {
    state.trace.push(memoRecOrLR.traceEntry);
  }
  if (memoRecOrLR.value) {
    bindings.push(memoRecOrLR.value);
    return true;
  }
  return false;
}

pexprs.Apply.prototype._eval = function(state) {
  var inputStream = state.inputStream;
  var grammar = state.grammar;
  var bindings = state.bindings;

  var caller = state.currentApplication();
  var actuals = caller ? caller.params : [];

  var app = this.substituteParams(actuals);
  var ruleName = app.ruleName;
  var memoKey = app.toMemoKey();

  if (this !== state.applySpaces_ && (caller && caller.isSyntactic() || app.isSyntactic())) {
    state.skipSpaces();
  }

  var origPos = inputStream.pos;
  var origPosInfo = state.getCurrentPosInfo();

  var memoRec = origPosInfo.memo[memoKey];
  var currentLR;
  if (memoRec && origPosInfo.shouldUseMemoizedResult(this, memoRec)) {
    return useMemoizedResult(state, this, memoRec);
  } else if (origPosInfo.isActive(app)) {
    currentLR = origPosInfo.getCurrentLeftRecursion();
    if (currentLR && currentLR.memoKey === memoKey) {
      origPosInfo.updateInvolvedApplications();
      return useMemoizedResult(state, this, currentLR);
    } else {
      origPosInfo.startLeftRecursion(app);
      return false;
    }
  } else {
    var body = grammar.ruleDict[ruleName];
    origPosInfo.enter(app);
    if (body.description) {
      state.ignoreFailures();
    }
    var value = app.evalOnce(body, state);
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
      if (!caller) {
        if (app.isSyntactic()) {
          state.skipSpaces();
        }
        // Only succeed if the top-level rule has consumed all of the input.
        // (The following will ignore spaces if the rule is syntactic.)
        ans = pexprs.end.eval(state);
        bindings.pop();  // pop the binding that was added by `end` in the statement above
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

pexprs.Apply.prototype.evalOnce = function(expr, state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (expr.eval(state)) {
    var arity = expr.getArity();
    var bindings = state.bindings.splice(state.bindings.length - arity, arity);
    var ans = new Node(state.grammar, this.ruleName, bindings, inputStream.interval(origPos));
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
    value = this.evalOnce(body, state);
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

},{"./InputStream":18,"./common":26,"./nodes":29,"./pexprs":43}],35:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common');
var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.getArity = common.abstract;

pexprs.anything.getArity =
pexprs.end.getArity =
pexprs.Prim.prototype.getArity =
pexprs.Range.prototype.getArity =
pexprs.Param.prototype.getArity =
pexprs.Apply.prototype.getArity = function() {
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
pexprs.Lex.prototype.getArity =
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

},{"./common":26,"./pexprs":43}],36:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common');
var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

// NOTE: the `introduceParams` method modifies the receiver in place.

pexprs.PExpr.prototype.introduceParams = common.abstract;

pexprs.anything.introduceParams =
pexprs.end.introduceParams =
pexprs.Prim.prototype.introduceParams =
pexprs.Range.prototype.introduceParams =
pexprs.Param.prototype.introduceParams = function(formals) {
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
pexprs.Lex.prototype.introduceParams =
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

},{"./common":26,"./pexprs":43}],37:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common');
var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

// Returns `true` if this parsing expression may accept without consuming any input.
pexprs.PExpr.prototype.isNullable = function(grammar) {
  return this._isNullable(grammar, Object.create(null));
};

pexprs.PExpr.prototype._isNullable = common.abstract;

pexprs.anything._isNullable =
pexprs.Prim.prototype._isNullable =
pexprs.Range.prototype._isNullable =
pexprs.Param.prototype._isNullable =
pexprs.Plus.prototype._isNullable =
pexprs.Arr.prototype._isNullable =
pexprs.Obj.prototype._isNullable = function(grammar, memo) {
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

pexprs.Lex.prototype._isNullable = function(grammar, memo) {
  return this.expr._isNullable(grammar, memo);
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

},{"./common":26,"./pexprs":43}],38:[function(_dereq_,module,exports){
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
  sb.append(typeof this.obj === 'string' ? JSON.stringify(this.obj) : '' + this.obj);
  sb.append(')');
};

pexprs.Range.prototype.outputRecipe = function(sb, formals) {
  sb.append('this.range(');
  sb.append(JSON.stringify(this.from));
  sb.append(', ');
  sb.append(JSON.stringify(this.to));
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

pexprs.Lex.prototype.outputRecipe = function(sb, formals) {
  sb.append('this.lex(');
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
    sb.append(JSON.stringify(prop.name));
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
  sb.append(JSON.stringify(this.ruleName));
  if (this.ruleName.indexOf('_') >= 0 && formals.length > 0) {
    var apps = formals.
        map(function(formal) { return 'this.app(' + JSON.stringify(formal) + ')'; });
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

},{"./common":26,"./pexprs":43}],39:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common');
var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.substituteParams = common.abstract;

pexprs.anything.substituteParams =
pexprs.end.substituteParams =
pexprs.Prim.prototype.substituteParams =
pexprs.Range.prototype.substituteParams =
pexprs.Prim.prototype.substituteParams = function(actuals) {
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
pexprs.Lex.prototype.substituteParams =
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

},{"./common":26,"./pexprs":43}],40:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common');
var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

// Returns a string representing the PExpr, for use as a UI label, etc.
pexprs.PExpr.prototype.toDisplayString = common.abstract;

pexprs.Alt.prototype.toDisplayString =
pexprs.Seq.prototype.toDisplayString =
pexprs.Iter.prototype.toDisplayString =
pexprs.Not.prototype.toDisplayString =
pexprs.Lookahead.prototype.toDisplayString =
pexprs.Lex.prototype.toDisplayString =
pexprs.Arr.prototype.toDisplayString =
pexprs.Str.prototype.toDisplayString =
pexprs.Obj.prototype.toDisplayString = function() {
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

pexprs.StringPrim.prototype.toDisplayString = function() {
  return '"' + this.obj + '"';
};

pexprs.Range.prototype.toDisplayString = function() {
  return JSON.stringify(this.from) + '..' + JSON.stringify(this.to);
};

pexprs.Param.prototype.toDisplayString = function() {
  return '#' + this.index;
};

pexprs.Apply.prototype.toDisplayString = function() {
  return this.ruleName;
};

},{"./common":26,"./pexprs":43}],41:[function(_dereq_,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common');
var pexprs = _dereq_('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.toExpected = common.abstract;

pexprs.anything.toExpected = function(ruleDict) {
  return 'any object';
};

pexprs.end.toExpected = function(ruleDict) {
  return 'end of input';
};

pexprs.Prim.prototype.toExpected = function(ruleDict) {
  return JSON.stringify(this.obj);
};

pexprs.Range.prototype.toExpected = function(ruleDict) {
  // TODO: come up with something better
  return JSON.stringify(this.from) + '..' + JSON.stringify(this.to);
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


},{"./common":26,"./pexprs":43}],42:[function(_dereq_,module,exports){
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

pexprs.Range.prototype.toString = function() {
  return JSON.stringify(this.from) + '..' + JSON.stringify(this.to);
};

pexprs.Param.prototype.toString = function() {
  return '$' + this.index;
};

pexprs.Lex.prototype.toString = function() {
  return '#(' + this.expr.toString() + ')';
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

},{"./common":26,"./pexprs":43}],43:[function(_dereq_,module,exports){
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

// Ranges

function Range(from, to) {
  this.from = from;
  this.to = to;
}
inherits(Range, PExpr);

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

// "Lexification"

function Lex(expr) {
  this.expr = expr;
}
inherits(Lex, PExpr);

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
  this.lexifyCount = 0;
}
inherits(Apply, PExpr);

Apply.prototype.lexify = function() {
  this.lexifyCount++;
};

Apply.prototype.unlexify = function() {
  this.lexifyCount--;
};

Apply.prototype.isSyntactic = function() {
  return this.lexifyCount === 0 && common.isSyntactic(this.ruleName);
};

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
  } else {
    return new Prim(obj);
  }
};

exports.PExpr = PExpr;
exports.anything = anything;
exports.end = end;
exports.Prim = Prim;
exports.StringPrim = StringPrim;
exports.Range = Range;
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
exports.Lex = Lex;
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
_dereq_('./pexprs-getArity');
_dereq_('./pexprs-outputRecipe');
_dereq_('./pexprs-introduceParams');
_dereq_('./pexprs-isNullable');
_dereq_('./pexprs-substituteParams');
_dereq_('./pexprs-toDisplayString');
_dereq_('./pexprs-toExpected');
_dereq_('./pexprs-toString');

},{"./common":26,"./errors":27,"./pexprs-assertAllApplicationsAreValid":30,"./pexprs-assertChoicesHaveUniformArity":31,"./pexprs-assertIteratedExprsAreNotNullable":32,"./pexprs-check":33,"./pexprs-eval":34,"./pexprs-getArity":35,"./pexprs-introduceParams":36,"./pexprs-isNullable":37,"./pexprs-outputRecipe":38,"./pexprs-substituteParams":39,"./pexprs-toDisplayString":40,"./pexprs-toExpected":41,"./pexprs-toString":42,"inherits":12}],44:[function(_dereq_,module,exports){
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

// Produce a new string that would be the result of copying the contents
// of the string `src` onto `dest` at offset `offest`.
function strcpy(dest, src, offset) {
  var origDestLen = dest.length;
  var start = dest.slice(0, offset);
  var end = dest.slice(offset + src.length);
  return (start + src + end).substr(0, origDestLen);
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
exports.getLineAndColumnMessage = function(str, offset /* ...ranges */) {
  var repeatStr = common.repeatStr;

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

  // Build up the line that points to the offset and possible indicates one or more ranges.
  // Start with a blank line, and indicate each range by overlaying a string of `~` chars.
  var lineLen = lineAndCol.line.length;
  var indicationLine = repeatStr(' ', lineLen + 1);
  var ranges = Array.prototype.slice.call(arguments, 2);
  for (var i = 0; i < ranges.length; ++i) {
    var startIdx = ranges[i][0];
    var endIdx = ranges[i][1];
    common.assert(startIdx >= 0 && startIdx <= endIdx, 'range start must be >= 0 and <= end');

    var lineStartOffset = offset - lineAndCol.colNum + 1;
    startIdx = Math.max(0, startIdx - lineStartOffset);
    endIdx = Math.min(endIdx - lineStartOffset, lineLen);

    indicationLine = strcpy(indicationLine, repeatStr('~', endIdx - startIdx), startIdx);
  }
  var gutterWidth = 2 + lineNumbers[1].length + 3;
  sb.append(repeatStr(' ', gutterWidth));
  indicationLine = strcpy(indicationLine, '^', lineAndCol.colNum - 1);
  sb.append(indicationLine.replace(/ +$/, '') + '\n');

  // Include the next line for context if possible.
  if (lineAndCol.nextLine != null) {
    appendLine(2, lineAndCol.nextLine, '  ');
  }
  return sb.contents();
};

},{"./common":26}]},{},[28])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hd2FydGgvcHJvZy9vb28vb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb29vL29obS9kaXN0L2J1aWx0LWluLXJ1bGVzLmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29vby9vaG0vZGlzdC9vaG0tZ3JhbW1hci5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vb28vb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb29vL29obS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vb28vb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb29vL29obS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvY3J5cHRvLWJyb3dzZXJpZnkvaGVscGVycy5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vb28vb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9jcnlwdG8tYnJvd3NlcmlmeS9pbmRleC5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vb28vb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9jcnlwdG8tYnJvd3NlcmlmeS9tZDUuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb29vL29obS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvY3J5cHRvLWJyb3dzZXJpZnkvcm5nLmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29vby9vaG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2NyeXB0by1icm93c2VyaWZ5L3NoYS5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vb28vb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9jcnlwdG8tYnJvd3NlcmlmeS9zaGEyNTYuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb29vL29obS9ub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vb28vb2htL25vZGVfbW9kdWxlcy9zeW1ib2wvaW5kZXguanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb29vL29obS9ub2RlX21vZHVsZXMvdXRpbC1leHRlbmQvZXh0ZW5kLmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29vby9vaG0vc3JjL0J1aWxkZXIuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb29vL29obS9zcmMvR3JhbW1hci5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vb28vb2htL3NyYy9HcmFtbWFyRGVjbC5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vb28vb2htL3NyYy9JbnB1dFN0cmVhbS5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vb28vb2htL3NyYy9JbnRlcnZhbC5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vb28vb2htL3NyYy9NYXRjaFJlc3VsdC5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vb28vb2htL3NyYy9OYW1lc3BhY2UuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb29vL29obS9zcmMvUG9zSW5mby5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vb28vb2htL3NyYy9TZW1hbnRpY3MuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb29vL29obS9zcmMvU3RhdGUuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb29vL29obS9zcmMvVHJhY2UuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb29vL29obS9zcmMvY29tbW9uLmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29vby9vaG0vc3JjL2Vycm9ycy5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vb28vb2htL3NyYy9tYWluLmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29vby9vaG0vc3JjL25vZGVzLmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29vby9vaG0vc3JjL3BleHBycy1hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZC5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vb28vb2htL3NyYy9wZXhwcnMtYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb29vL29obS9zcmMvcGV4cHJzLWFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZS5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vb28vb2htL3NyYy9wZXhwcnMtY2hlY2suanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb29vL29obS9zcmMvcGV4cHJzLWV2YWwuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb29vL29obS9zcmMvcGV4cHJzLWdldEFyaXR5LmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29vby9vaG0vc3JjL3BleHBycy1pbnRyb2R1Y2VQYXJhbXMuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb29vL29obS9zcmMvcGV4cHJzLWlzTnVsbGFibGUuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb29vL29obS9zcmMvcGV4cHJzLW91dHB1dFJlY2lwZS5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vb28vb2htL3NyYy9wZXhwcnMtc3Vic3RpdHV0ZVBhcmFtcy5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vb28vb2htL3NyYy9wZXhwcnMtdG9EaXNwbGF5U3RyaW5nLmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29vby9vaG0vc3JjL3BleHBycy10b0V4cGVjdGVkLmpzIiwiL1VzZXJzL2F3YXJ0aC9wcm9nL29vby9vaG0vc3JjL3BleHBycy10b1N0cmluZy5qcyIsIi9Vc2Vycy9hd2FydGgvcHJvZy9vb28vb2htL3NyYy9wZXhwcnMuanMiLCIvVXNlcnMvYXdhcnRoL3Byb2cvb29vL29obS9zcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNybENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9aQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIG9obSA9IHJlcXVpcmUoJy4uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IG9obS5tYWtlUmVjaXBlKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IHRoaXMubmV3R3JhbW1hcihcIkJ1aWx0SW5SdWxlc1wiKVxuICAgIC5kZWZpbmUoXCJhbG51bVwiLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoXCJsZXR0ZXJcIiksIHRoaXMuYXBwKFwiZGlnaXRcIikpLCBcImFuIGFscGhhLW51bWVyaWMgY2hhcmFjdGVyXCIpXG4gICAgLmRlZmluZShcImxldHRlclwiLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoXCJsb3dlclwiKSwgdGhpcy5hcHAoXCJ1cHBlclwiKSksIFwiYSBsZXR0ZXJcIilcbiAgICAuZGVmaW5lKFwibG93ZXJcIiwgW10sIHRoaXMucmFuZ2UoXCJhXCIsIFwielwiKSwgXCJhIGxvd2VyLWNhc2UgbGV0dGVyXCIpXG4gICAgLmRlZmluZShcInVwcGVyXCIsIFtdLCB0aGlzLnJhbmdlKFwiQVwiLCBcIlpcIiksIFwiYW4gdXBwZXItY2FzZSBsZXR0ZXJcIilcbiAgICAuZGVmaW5lKFwiZGlnaXRcIiwgW10sIHRoaXMucmFuZ2UoXCIwXCIsIFwiOVwiKSwgXCJhIGRpZ2l0XCIpXG4gICAgLmRlZmluZShcImhleERpZ2l0XCIsIFtdLCB0aGlzLmFsdCh0aGlzLmFwcChcImRpZ2l0XCIpLCB0aGlzLnJhbmdlKFwiYVwiLCBcImZcIiksIHRoaXMucmFuZ2UoXCJBXCIsIFwiRlwiKSksIFwiYSBoZXhhZGVjaW1hbCBkaWdpdFwiKVxuICAgIC5kZWZpbmUoXCJMaXN0T2Zfc29tZVwiLCBbXCJlbGVtXCIsIFwic2VwXCJdLCB0aGlzLnNlcSh0aGlzLnBhcmFtKDApLCB0aGlzLnN0YXIodGhpcy5zZXEodGhpcy5wYXJhbSgxKSwgdGhpcy5wYXJhbSgwKSkpKSlcbiAgICAuZGVmaW5lKFwiTGlzdE9mX25vbmVcIiwgW1wiZWxlbVwiLCBcInNlcFwiXSwgdGhpcy5zZXEoKSlcbiAgICAuZGVmaW5lKFwiTGlzdE9mXCIsIFtcImVsZW1cIiwgXCJzZXBcIl0sIHRoaXMuYWx0KHRoaXMuYXBwKFwiTGlzdE9mX3NvbWVcIiwgW3RoaXMuYXBwKFwiZWxlbVwiKSwgdGhpcy5hcHAoXCJzZXBcIildKSwgdGhpcy5hcHAoXCJMaXN0T2Zfbm9uZVwiLCBbdGhpcy5hcHAoXCJlbGVtXCIpLCB0aGlzLmFwcChcInNlcFwiKV0pKSlcbiAgICAuZGVmaW5lKFwibGlzdE9mX3NvbWVcIiwgW1wiZWxlbVwiLCBcInNlcFwiXSwgdGhpcy5zZXEodGhpcy5wYXJhbSgwKSwgdGhpcy5zdGFyKHRoaXMuc2VxKHRoaXMucGFyYW0oMSksIHRoaXMucGFyYW0oMCkpKSkpXG4gICAgLmRlZmluZShcImxpc3RPZl9ub25lXCIsIFtcImVsZW1cIiwgXCJzZXBcIl0sIHRoaXMuc2VxKCkpXG4gICAgLmRlZmluZShcImxpc3RPZlwiLCBbXCJlbGVtXCIsIFwic2VwXCJdLCB0aGlzLmFsdCh0aGlzLmFwcChcImxpc3RPZl9zb21lXCIsIFt0aGlzLmFwcChcImVsZW1cIiksIHRoaXMuYXBwKFwic2VwXCIpXSksIHRoaXMuYXBwKFwibGlzdE9mX25vbmVcIiwgW3RoaXMuYXBwKFwiZWxlbVwiKSwgdGhpcy5hcHAoXCJzZXBcIildKSkpXG4gICAgLmJ1aWxkKCk7XG59KTtcblxuIiwidmFyIG9obSA9IHJlcXVpcmUoJy4uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IG9obS5tYWtlUmVjaXBlKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IHRoaXMubmV3R3JhbW1hcihcIk9obVwiKVxuICAgIC53aXRoRGVmYXVsdFN0YXJ0UnVsZSgnR3JhbW1hcnMnKVxuICAgIC5kZWZpbmUoXCJHcmFtbWFyc1wiLCBbXSwgdGhpcy5zdGFyKHRoaXMuYXBwKFwiR3JhbW1hclwiKSkpXG4gICAgLmRlZmluZShcIkdyYW1tYXJcIiwgW10sIHRoaXMuc2VxKHRoaXMuYXBwKFwiaWRlbnRcIiksIHRoaXMub3B0KHRoaXMuYXBwKFwiU3VwZXJHcmFtbWFyXCIpKSwgdGhpcy5wcmltKFwie1wiKSwgdGhpcy5zdGFyKHRoaXMuYXBwKFwiUnVsZVwiKSksIHRoaXMucHJpbShcIn1cIikpKVxuICAgIC5kZWZpbmUoXCJTdXBlckdyYW1tYXJcIiwgW10sIHRoaXMuc2VxKHRoaXMucHJpbShcIjw6XCIpLCB0aGlzLmFwcChcImlkZW50XCIpKSlcbiAgICAuZGVmaW5lKFwiUnVsZV9kZWZpbmVcIiwgW10sIHRoaXMuc2VxKHRoaXMuYXBwKFwiaWRlbnRcIiksIHRoaXMub3B0KHRoaXMuYXBwKFwiRm9ybWFsc1wiKSksIHRoaXMub3B0KHRoaXMuYXBwKFwicnVsZURlc2NyXCIpKSwgdGhpcy5wcmltKFwiPVwiKSwgdGhpcy5hcHAoXCJBbHRcIikpKVxuICAgIC5kZWZpbmUoXCJSdWxlX292ZXJyaWRlXCIsIFtdLCB0aGlzLnNlcSh0aGlzLmFwcChcImlkZW50XCIpLCB0aGlzLm9wdCh0aGlzLmFwcChcIkZvcm1hbHNcIikpLCB0aGlzLnByaW0oXCI6PVwiKSwgdGhpcy5hcHAoXCJBbHRcIikpKVxuICAgIC5kZWZpbmUoXCJSdWxlX2V4dGVuZFwiLCBbXSwgdGhpcy5zZXEodGhpcy5hcHAoXCJpZGVudFwiKSwgdGhpcy5vcHQodGhpcy5hcHAoXCJGb3JtYWxzXCIpKSwgdGhpcy5wcmltKFwiKz1cIiksIHRoaXMuYXBwKFwiQWx0XCIpKSlcbiAgICAuZGVmaW5lKFwiUnVsZVwiLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoXCJSdWxlX2RlZmluZVwiKSwgdGhpcy5hcHAoXCJSdWxlX292ZXJyaWRlXCIpLCB0aGlzLmFwcChcIlJ1bGVfZXh0ZW5kXCIpKSlcbiAgICAuZGVmaW5lKFwiRm9ybWFsc1wiLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKFwiPFwiKSwgdGhpcy5hcHAoXCJMaXN0T2ZcIiwgW3RoaXMuYXBwKFwiaWRlbnRcIiksIHRoaXMucHJpbShcIixcIildKSwgdGhpcy5wcmltKFwiPlwiKSkpXG4gICAgLmRlZmluZShcIlBhcmFtc1wiLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKFwiPFwiKSwgdGhpcy5hcHAoXCJMaXN0T2ZcIiwgW3RoaXMuYXBwKFwiU2VxXCIpLCB0aGlzLnByaW0oXCIsXCIpXSksIHRoaXMucHJpbShcIj5cIikpKVxuICAgIC5kZWZpbmUoXCJBbHRcIiwgW10sIHRoaXMuc2VxKHRoaXMuYXBwKFwiVGVybVwiKSwgdGhpcy5zdGFyKHRoaXMuc2VxKHRoaXMucHJpbShcInxcIiksIHRoaXMuYXBwKFwiVGVybVwiKSkpKSlcbiAgICAuZGVmaW5lKFwiVGVybV9pbmxpbmVcIiwgW10sIHRoaXMuc2VxKHRoaXMuYXBwKFwiU2VxXCIpLCB0aGlzLmFwcChcImNhc2VOYW1lXCIpKSlcbiAgICAuZGVmaW5lKFwiVGVybVwiLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoXCJUZXJtX2lubGluZVwiKSwgdGhpcy5hcHAoXCJTZXFcIikpKVxuICAgIC5kZWZpbmUoXCJTZXFcIiwgW10sIHRoaXMuc3Rhcih0aGlzLmFwcChcIkl0ZXJcIikpKVxuICAgIC5kZWZpbmUoXCJJdGVyX3N0YXJcIiwgW10sIHRoaXMuc2VxKHRoaXMuYXBwKFwiUHJlZFwiKSwgdGhpcy5wcmltKFwiKlwiKSkpXG4gICAgLmRlZmluZShcIkl0ZXJfcGx1c1wiLCBbXSwgdGhpcy5zZXEodGhpcy5hcHAoXCJQcmVkXCIpLCB0aGlzLnByaW0oXCIrXCIpKSlcbiAgICAuZGVmaW5lKFwiSXRlcl9vcHRcIiwgW10sIHRoaXMuc2VxKHRoaXMuYXBwKFwiUHJlZFwiKSwgdGhpcy5wcmltKFwiP1wiKSkpXG4gICAgLmRlZmluZShcIkl0ZXJcIiwgW10sIHRoaXMuYWx0KHRoaXMuYXBwKFwiSXRlcl9zdGFyXCIpLCB0aGlzLmFwcChcIkl0ZXJfcGx1c1wiKSwgdGhpcy5hcHAoXCJJdGVyX29wdFwiKSwgdGhpcy5hcHAoXCJQcmVkXCIpKSlcbiAgICAuZGVmaW5lKFwiUHJlZF9ub3RcIiwgW10sIHRoaXMuc2VxKHRoaXMucHJpbShcIn5cIiksIHRoaXMuYXBwKFwiTGV4XCIpKSlcbiAgICAuZGVmaW5lKFwiUHJlZF9sb29rYWhlYWRcIiwgW10sIHRoaXMuc2VxKHRoaXMucHJpbShcIiZcIiksIHRoaXMuYXBwKFwiTGV4XCIpKSlcbiAgICAuZGVmaW5lKFwiUHJlZFwiLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoXCJQcmVkX25vdFwiKSwgdGhpcy5hcHAoXCJQcmVkX2xvb2thaGVhZFwiKSwgdGhpcy5hcHAoXCJMZXhcIikpKVxuICAgIC5kZWZpbmUoXCJMZXhfbGV4XCIsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oXCIjXCIpLCB0aGlzLmFwcChcIkJhc2VcIikpKVxuICAgIC5kZWZpbmUoXCJMZXhcIiwgW10sIHRoaXMuYWx0KHRoaXMuYXBwKFwiTGV4X2xleFwiKSwgdGhpcy5hcHAoXCJCYXNlXCIpKSlcbiAgICAuZGVmaW5lKFwiQmFzZV9hcHBsaWNhdGlvblwiLCBbXSwgdGhpcy5zZXEodGhpcy5hcHAoXCJpZGVudFwiKSwgdGhpcy5vcHQodGhpcy5hcHAoXCJQYXJhbXNcIikpLCB0aGlzLm5vdCh0aGlzLmFsdCh0aGlzLnNlcSh0aGlzLm9wdCh0aGlzLmFwcChcInJ1bGVEZXNjclwiKSksIHRoaXMucHJpbShcIj1cIikpLCB0aGlzLnByaW0oXCI6PVwiKSwgdGhpcy5wcmltKFwiKz1cIikpKSkpXG4gICAgLmRlZmluZShcIkJhc2VfcmFuZ2VcIiwgW10sIHRoaXMuc2VxKHRoaXMuYXBwKFwiUHJpbVwiKSwgdGhpcy5wcmltKFwiLi5cIiksIHRoaXMuYXBwKFwiUHJpbVwiKSkpXG4gICAgLmRlZmluZShcIkJhc2VfcHJpbVwiLCBbXSwgdGhpcy5hcHAoXCJQcmltXCIpKVxuICAgIC5kZWZpbmUoXCJCYXNlX3BhcmVuXCIsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oXCIoXCIpLCB0aGlzLmFwcChcIkFsdFwiKSwgdGhpcy5wcmltKFwiKVwiKSkpXG4gICAgLmRlZmluZShcIkJhc2VfYXJyXCIsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oXCJbXCIpLCB0aGlzLmFwcChcIkFsdFwiKSwgdGhpcy5wcmltKFwiXVwiKSkpXG4gICAgLmRlZmluZShcIkJhc2Vfc3RyXCIsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oXCJgYFwiKSwgdGhpcy5hcHAoXCJBbHRcIiksIHRoaXMucHJpbShcIicnXCIpKSlcbiAgICAuZGVmaW5lKFwiQmFzZV9vYmpcIiwgW10sIHRoaXMuc2VxKHRoaXMucHJpbShcIntcIiksIHRoaXMub3B0KHRoaXMucHJpbShcIi4uLlwiKSksIHRoaXMucHJpbShcIn1cIikpKVxuICAgIC5kZWZpbmUoXCJCYXNlX29ialdpdGhQcm9wc1wiLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKFwie1wiKSwgdGhpcy5hcHAoXCJQcm9wc1wiKSwgdGhpcy5vcHQodGhpcy5zZXEodGhpcy5wcmltKFwiLFwiKSwgdGhpcy5wcmltKFwiLi4uXCIpKSksIHRoaXMucHJpbShcIn1cIikpKVxuICAgIC5kZWZpbmUoXCJCYXNlXCIsIFtdLCB0aGlzLmFsdCh0aGlzLmFwcChcIkJhc2VfYXBwbGljYXRpb25cIiksIHRoaXMuYXBwKFwiQmFzZV9yYW5nZVwiKSwgdGhpcy5hcHAoXCJCYXNlX3ByaW1cIiksIHRoaXMuYXBwKFwiQmFzZV9wYXJlblwiKSwgdGhpcy5hcHAoXCJCYXNlX2FyclwiKSwgdGhpcy5hcHAoXCJCYXNlX3N0clwiKSwgdGhpcy5hcHAoXCJCYXNlX29ialwiKSwgdGhpcy5hcHAoXCJCYXNlX29ialdpdGhQcm9wc1wiKSkpXG4gICAgLmRlZmluZShcIlByaW1cIiwgW10sIHRoaXMuYWx0KHRoaXMuYXBwKFwia2V5d29yZFwiKSwgdGhpcy5hcHAoXCJzdHJpbmdcIiksIHRoaXMuYXBwKFwibnVtYmVyXCIpKSlcbiAgICAuZGVmaW5lKFwiUHJvcHNcIiwgW10sIHRoaXMuc2VxKHRoaXMuYXBwKFwiUHJvcFwiKSwgdGhpcy5zdGFyKHRoaXMuc2VxKHRoaXMucHJpbShcIixcIiksIHRoaXMuYXBwKFwiUHJvcFwiKSkpKSlcbiAgICAuZGVmaW5lKFwiUHJvcFwiLCBbXSwgdGhpcy5zZXEodGhpcy5hbHQodGhpcy5hcHAoXCJuYW1lXCIpLCB0aGlzLmFwcChcInN0cmluZ1wiKSksIHRoaXMucHJpbShcIjpcIiksIHRoaXMuYXBwKFwiQWx0XCIpKSlcbiAgICAuZGVmaW5lKFwicnVsZURlc2NyXCIsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oXCIoXCIpLCB0aGlzLmFwcChcInJ1bGVEZXNjclRleHRcIiksIHRoaXMucHJpbShcIilcIikpLCBcImEgcnVsZSBkZXNjcmlwdGlvblwiKVxuICAgIC5kZWZpbmUoXCJydWxlRGVzY3JUZXh0XCIsIFtdLCB0aGlzLnN0YXIodGhpcy5zZXEodGhpcy5ub3QodGhpcy5wcmltKFwiKVwiKSksIHRoaXMuYXBwKFwiX1wiKSkpKVxuICAgIC5kZWZpbmUoXCJjYXNlTmFtZVwiLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKFwiLS1cIiksIHRoaXMuc3Rhcih0aGlzLnNlcSh0aGlzLm5vdCh0aGlzLnByaW0oXCJcXG5cIikpLCB0aGlzLmFwcChcInNwYWNlXCIpKSksIHRoaXMuYXBwKFwibmFtZVwiKSwgdGhpcy5zdGFyKHRoaXMuc2VxKHRoaXMubm90KHRoaXMucHJpbShcIlxcblwiKSksIHRoaXMuYXBwKFwic3BhY2VcIikpKSwgdGhpcy5hbHQodGhpcy5wcmltKFwiXFxuXCIpLCB0aGlzLmxhKHRoaXMucHJpbShcIn1cIikpKSkpXG4gICAgLmRlZmluZShcIm5hbWVcIiwgW10sIHRoaXMuc2VxKHRoaXMuYXBwKFwibmFtZUZpcnN0XCIpLCB0aGlzLnN0YXIodGhpcy5hcHAoXCJuYW1lUmVzdFwiKSkpLCBcImEgbmFtZVwiKVxuICAgIC5kZWZpbmUoXCJuYW1lRmlyc3RcIiwgW10sIHRoaXMuYWx0KHRoaXMucHJpbShcIl9cIiksIHRoaXMuYXBwKFwibGV0dGVyXCIpKSlcbiAgICAuZGVmaW5lKFwibmFtZVJlc3RcIiwgW10sIHRoaXMuYWx0KHRoaXMucHJpbShcIl9cIiksIHRoaXMuYXBwKFwiYWxudW1cIikpKVxuICAgIC5kZWZpbmUoXCJpZGVudFwiLCBbXSwgdGhpcy5zZXEodGhpcy5ub3QodGhpcy5hcHAoXCJrZXl3b3JkXCIpKSwgdGhpcy5hcHAoXCJuYW1lXCIpKSwgXCJhbiBpZGVudGlmaWVyXCIpXG4gICAgLmRlZmluZShcImtleXdvcmRfbnVsbFwiLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKFwibnVsbFwiKSwgdGhpcy5ub3QodGhpcy5hcHAoXCJuYW1lUmVzdFwiKSkpKVxuICAgIC5kZWZpbmUoXCJrZXl3b3JkX3RydWVcIiwgW10sIHRoaXMuc2VxKHRoaXMucHJpbShcInRydWVcIiksIHRoaXMubm90KHRoaXMuYXBwKFwibmFtZVJlc3RcIikpKSlcbiAgICAuZGVmaW5lKFwia2V5d29yZF9mYWxzZVwiLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKFwiZmFsc2VcIiksIHRoaXMubm90KHRoaXMuYXBwKFwibmFtZVJlc3RcIikpKSlcbiAgICAuZGVmaW5lKFwia2V5d29yZFwiLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoXCJrZXl3b3JkX251bGxcIiksIHRoaXMuYXBwKFwia2V5d29yZF90cnVlXCIpLCB0aGlzLmFwcChcImtleXdvcmRfZmFsc2VcIikpKVxuICAgIC5kZWZpbmUoXCJzdHJpbmdcIiwgW10sIHRoaXMuc2VxKHRoaXMucHJpbShcIlxcXCJcIiksIHRoaXMuc3Rhcih0aGlzLmFwcChcInN0ckNoYXJcIikpLCB0aGlzLnByaW0oXCJcXFwiXCIpKSlcbiAgICAuZGVmaW5lKFwic3RyQ2hhclwiLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoXCJlc2NhcGVDaGFyXCIpLCB0aGlzLnNlcSh0aGlzLm5vdCh0aGlzLnByaW0oXCJcXFxcXCIpKSwgdGhpcy5ub3QodGhpcy5wcmltKFwiXFxcIlwiKSksIHRoaXMubm90KHRoaXMucHJpbShcIlxcblwiKSksIHRoaXMuYXBwKFwiX1wiKSkpKVxuICAgIC5kZWZpbmUoXCJlc2NhcGVDaGFyX2JhY2tzbGFzaFwiLCBbXSwgdGhpcy5wcmltKFwiXFxcXFxcXFxcIikpXG4gICAgLmRlZmluZShcImVzY2FwZUNoYXJfZG91YmxlUXVvdGVcIiwgW10sIHRoaXMucHJpbShcIlxcXFxcXFwiXCIpKVxuICAgIC5kZWZpbmUoXCJlc2NhcGVDaGFyX3NpbmdsZVF1b3RlXCIsIFtdLCB0aGlzLnByaW0oXCJcXFxcJ1wiKSlcbiAgICAuZGVmaW5lKFwiZXNjYXBlQ2hhcl9iYWNrc3BhY2VcIiwgW10sIHRoaXMucHJpbShcIlxcXFxiXCIpKVxuICAgIC5kZWZpbmUoXCJlc2NhcGVDaGFyX2xpbmVGZWVkXCIsIFtdLCB0aGlzLnByaW0oXCJcXFxcblwiKSlcbiAgICAuZGVmaW5lKFwiZXNjYXBlQ2hhcl9jYXJyaWFnZVJldHVyblwiLCBbXSwgdGhpcy5wcmltKFwiXFxcXHJcIikpXG4gICAgLmRlZmluZShcImVzY2FwZUNoYXJfdGFiXCIsIFtdLCB0aGlzLnByaW0oXCJcXFxcdFwiKSlcbiAgICAuZGVmaW5lKFwiZXNjYXBlQ2hhcl91bmljb2RlRXNjYXBlXCIsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oXCJcXFxcdVwiKSwgdGhpcy5hcHAoXCJoZXhEaWdpdFwiKSwgdGhpcy5hcHAoXCJoZXhEaWdpdFwiKSwgdGhpcy5hcHAoXCJoZXhEaWdpdFwiKSwgdGhpcy5hcHAoXCJoZXhEaWdpdFwiKSkpXG4gICAgLmRlZmluZShcImVzY2FwZUNoYXJfaGV4RXNjYXBlXCIsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oXCJcXFxceFwiKSwgdGhpcy5hcHAoXCJoZXhEaWdpdFwiKSwgdGhpcy5hcHAoXCJoZXhEaWdpdFwiKSkpXG4gICAgLmRlZmluZShcImVzY2FwZUNoYXJcIiwgW10sIHRoaXMuYWx0KHRoaXMuYXBwKFwiZXNjYXBlQ2hhcl9iYWNrc2xhc2hcIiksIHRoaXMuYXBwKFwiZXNjYXBlQ2hhcl9kb3VibGVRdW90ZVwiKSwgdGhpcy5hcHAoXCJlc2NhcGVDaGFyX3NpbmdsZVF1b3RlXCIpLCB0aGlzLmFwcChcImVzY2FwZUNoYXJfYmFja3NwYWNlXCIpLCB0aGlzLmFwcChcImVzY2FwZUNoYXJfbGluZUZlZWRcIiksIHRoaXMuYXBwKFwiZXNjYXBlQ2hhcl9jYXJyaWFnZVJldHVyblwiKSwgdGhpcy5hcHAoXCJlc2NhcGVDaGFyX3RhYlwiKSwgdGhpcy5hcHAoXCJlc2NhcGVDaGFyX3VuaWNvZGVFc2NhcGVcIiksIHRoaXMuYXBwKFwiZXNjYXBlQ2hhcl9oZXhFc2NhcGVcIikpLCBcImFuIGVzY2FwZSBzZXF1ZW5jZVwiKVxuICAgIC5kZWZpbmUoXCJudW1iZXJcIiwgW10sIHRoaXMuc2VxKHRoaXMub3B0KHRoaXMucHJpbShcIi1cIikpLCB0aGlzLnBsdXModGhpcy5hcHAoXCJkaWdpdFwiKSkpLCBcImEgbnVtYmVyXCIpXG4gICAgLmRlZmluZShcInNwYWNlX3NpbmdsZUxpbmVcIiwgW10sIHRoaXMuc2VxKHRoaXMucHJpbShcIi8vXCIpLCB0aGlzLnN0YXIodGhpcy5zZXEodGhpcy5ub3QodGhpcy5wcmltKFwiXFxuXCIpKSwgdGhpcy5hcHAoXCJfXCIpKSksIHRoaXMucHJpbShcIlxcblwiKSkpXG4gICAgLmRlZmluZShcInNwYWNlX211bHRpTGluZVwiLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKFwiLypcIiksIHRoaXMuc3Rhcih0aGlzLnNlcSh0aGlzLm5vdCh0aGlzLnByaW0oXCIqL1wiKSksIHRoaXMuYXBwKFwiX1wiKSkpLCB0aGlzLnByaW0oXCIqL1wiKSkpXG4gICAgLmV4dGVuZChcInNwYWNlXCIsIFtdLCB0aGlzLmFsdCh0aGlzLmFsdCh0aGlzLmFwcChcInNwYWNlX3NpbmdsZUxpbmVcIiksIHRoaXMuYXBwKFwic3BhY2VfbXVsdGlMaW5lXCIpKSwgdGhpcy5yYW5nZShcIlxcdTAwMDBcIiwgXCIgXCIpKSwgXCJhIHNwYWNlXCIpXG4gICAgLmJ1aWxkKCk7XG59KTtcblxuIiwiLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MlxuXG4vKipcbiAqIElmIGBCdWZmZXIuX3VzZVR5cGVkQXJyYXlzYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKGNvbXBhdGlibGUgZG93biB0byBJRTYpXG4gKi9cbkJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBEZXRlY3QgaWYgYnJvd3NlciBzdXBwb3J0cyBUeXBlZCBBcnJheXMuIFN1cHBvcnRlZCBicm93c2VycyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLFxuICAvLyBDaHJvbWUgNyssIFNhZmFyaSA1LjErLCBPcGVyYSAxMS42KywgaU9TIDQuMisuIElmIHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYWRkaW5nXG4gIC8vIHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcywgdGhlbiB0aGF0J3MgdGhlIHNhbWUgYXMgbm8gYFVpbnQ4QXJyYXlgIHN1cHBvcnRcbiAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gYWRkIGFsbCB0aGUgbm9kZSBCdWZmZXIgQVBJIG1ldGhvZHMuIFRoaXMgaXMgYW4gaXNzdWVcbiAgLy8gaW4gRmlyZWZveCA0LTI5LiBOb3cgZml4ZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOFxuICB0cnkge1xuICAgIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMClcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIDQyID09PSBhcnIuZm9vKCkgJiZcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAvLyBDaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59KSgpXG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybylcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0XG5cbiAgLy8gV29ya2Fyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5nc1xuICAvLyB3aGlsZSBiYXNlNjQtanMgZG9lcyBub3QuXG4gIGlmIChlbmNvZGluZyA9PT0gJ2Jhc2U2NCcgJiYgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBzdWJqZWN0ID0gc3RyaW5ndHJpbShzdWJqZWN0KVxuICAgIHdoaWxlIChzdWJqZWN0Lmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICAgIHN1YmplY3QgPSBzdWJqZWN0ICsgJz0nXG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gIHZhciBsZW5ndGhcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KVxuICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJylcbiAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZylcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKSAvLyBhc3N1bWUgdGhhdCBvYmplY3QgaXMgYXJyYXktbGlrZVxuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgYXJyYXkgb3Igc3RyaW5nLicpXG5cbiAgdmFyIGJ1ZlxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIC8vIFByZWZlcnJlZDogUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBidWYgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIFRISVMgaW5zdGFuY2Ugb2YgQnVmZmVyIChjcmVhdGVkIGJ5IGBuZXdgKVxuICAgIGJ1ZiA9IHRoaXNcbiAgICBidWYubGVuZ3RoID0gbGVuZ3RoXG4gICAgYnVmLl9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmIHR5cGVvZiBzdWJqZWN0LmJ5dGVMZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgLy8gU3BlZWQgb3B0aW1pemF0aW9uIC0tIHVzZSBzZXQgaWYgd2UncmUgY29weWluZyBmcm9tIGEgdHlwZWQgYXJyYXlcbiAgICBidWYuX3NldChzdWJqZWN0KVxuICB9IGVsc2UgaWYgKGlzQXJyYXlpc2goc3ViamVjdCkpIHtcbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXlcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3RbaV1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBidWYud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgIW5vWmVybykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYnVmW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuLy8gU1RBVElDIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiAoYikge1xuICByZXR1cm4gISEoYiAhPT0gbnVsbCAmJiBiICE9PSB1bmRlZmluZWQgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgdmFyIHJldFxuICBzdHIgPSBzdHIgKyAnJ1xuICBzd2l0Y2ggKGVuY29kaW5nIHx8ICd1dGY4Jykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoIC8gMlxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAqIDJcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGFzc2VydChpc0FycmF5KGxpc3QpLCAnVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4nICtcbiAgICAgICdsaXN0IHNob3VsZCBiZSBhbiBBcnJheS4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG90YWxMZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBCVUZGRVIgSU5TVEFOQ0UgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gX2hleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgYXNzZXJ0KHN0ckxlbiAlIDIgPT09IDAsICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBhc3NlcnQoIWlzTmFOKGJ5dGUpLCAnSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlXG4gIH1cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMlxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBfdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2FzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2JpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIF9hc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcbiAgc3RhcnQgPSBOdW1iZXIoc3RhcnQpIHx8IDBcbiAgZW5kID0gKGVuZCAhPT0gdW5kZWZpbmVkKVxuICAgID8gTnVtYmVyKGVuZClcbiAgICA6IGVuZCA9IHNlbGYubGVuZ3RoXG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoZW5kID09PSBzdGFydClcbiAgICByZXR1cm4gJydcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzXG5cbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKCF0YXJnZXRfc3RhcnQpIHRhcmdldF9zdGFydCA9IDBcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpXG4gIGFzc2VydCh0YXJnZXRfc3RhcnQgPj0gMCAmJiB0YXJnZXRfc3RhcnQgPCB0YXJnZXQubGVuZ3RoLFxuICAgICAgJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSBzb3VyY2UubGVuZ3RoLCAnc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aClcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KVxuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydFxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmIChsZW4gPCAxMDAgfHwgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRfc3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0Ll9zZXQodGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLCB0YXJnZXRfc3RhcnQpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBfdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJlcyA9ICcnXG4gIHZhciB0bXAgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gICAgICB0bXAgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXAgKz0gJyUnICsgYnVmW2ldLnRvU3RyaW5nKDE2KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF9hc2NpaVNsaWNlKGJ1Ziwgc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gX2hleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSsxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSBjbGFtcChzdGFydCwgbGVuLCAwKVxuICBlbmQgPSBjbGFtcChlbmQsIGxlbiwgbGVuKVxuXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5fYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmXG4gIH1cbn1cblxuLy8gYGdldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLmdldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMucmVhZFVJbnQ4KG9mZnNldClcbn1cblxuLy8gYHNldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHYsIG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLnNldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMud3JpdGVVSW50OCh2LCBvZmZzZXQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgdmFsID0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV1cbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDJdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgICB2YWwgfD0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0ICsgM10gPDwgMjQgPj4+IDApXG4gIH0gZWxzZSB7XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMV0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMl0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAzXVxuICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0XSA8PCAyNCA+Pj4gMClcbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICB2YXIgbmVnID0gdGhpc1tvZmZzZXRdICYgMHg4MFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQxNihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MzIoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMDAwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZmZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRmxvYXQgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWREb3VibGUgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuXG5cbiAgdGhpc1tvZmZzZXRdID0gdmFsdWVcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCAyKTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAgICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZmZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgNCk7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2YsIC0weDgwKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICB0aGlzLndyaXRlVUludDgodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICB0aGlzLndyaXRlVUludDgoMHhmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmLCAtMHg4MDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQxNihidWYsIDB4ZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQzMihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MzIoYnVmLCAweGZmZmZmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApXG4gIH1cblxuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpLCAndmFsdWUgaXMgbm90IGEgbnVtYmVyJylcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgdGhpcy5sZW5ndGgsICdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSB0aGlzLmxlbmd0aCwgJ2VuZCBvdXQgb2YgYm91bmRzJylcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG91dCA9IFtdXG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSlcbiAgICBpZiAoaSA9PT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPidcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBBcnJheUJ1ZmZlcmAgd2l0aCB0aGUgKmNvcGllZCogbWVtb3J5IG9mIHRoZSBidWZmZXIgaW5zdGFuY2UuXG4gKiBBZGRlZCBpbiBOb2RlIDAuMTIuIE9ubHkgYXZhaWxhYmxlIGluIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBBcnJheUJ1ZmZlci5cbiAqL1xuQnVmZmVyLnByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAgIHJldHVybiAobmV3IEJ1ZmZlcih0aGlzKSkuYnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBidWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmxlbmd0aClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBidWYubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpXG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQnVmZmVyLnRvQXJyYXlCdWZmZXIgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKVxuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxudmFyIEJQID0gQnVmZmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF1Z21lbnQgYSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgVWludDhBcnJheSBjbGFzcyEpIHdpdGggQnVmZmVyIG1ldGhvZHNcbiAqL1xuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgZ2V0L3NldCBtZXRob2RzIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX2dldCA9IGFyci5nZXRcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIG5vZGUgMC4xMytcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wIChpbmRleCwgbGVuLCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICBpbmRleCArPSBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBjb2VyY2UgKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpXG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aFxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChzdWJqZWN0KSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfSkoc3ViamVjdClcbn1cblxuZnVuY3Rpb24gaXNBcnJheWlzaCAoc3ViamVjdCkge1xuICByZXR1cm4gaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGIgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHN0YXJ0ID0gaVxuICAgICAgaWYgKGIgPj0gMHhEODAwICYmIGIgPD0gMHhERkZGKSBpKytcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5zbGljZShzdGFydCwgaSsxKSkuc3Vic3RyKDEpLnNwbGl0KCclJylcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShzdHIpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpXG4gICAgICBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyIChzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKSAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG4vKlxuICogV2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgYSB2YWxpZCBpbnRlZ2VyLiBUaGlzIG1lYW5zIHRoYXQgaXRcbiAqIGlzIG5vbi1uZWdhdGl2ZS4gSXQgaGFzIG5vIGZyYWN0aW9uYWwgY29tcG9uZW50IGFuZCB0aGF0IGl0IGRvZXMgbm90XG4gKiBleGNlZWQgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50ICh2YWx1ZSwgbWF4KSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA+PSAwLCAnc3BlY2lmaWVkIGEgbmVnYXRpdmUgdmFsdWUgZm9yIHdyaXRpbmcgYW4gdW5zaWduZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgaXMgbGFyZ2VyIHRoYW4gbWF4aW11bSB2YWx1ZSBmb3IgdHlwZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmc2ludCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG59XG5cbmZ1bmN0aW9uIGFzc2VydCAodGVzdCwgbWVzc2FnZSkge1xuICBpZiAoIXRlc3QpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdGYWlsZWQgYXNzZXJ0aW9uJylcbn1cbiIsInZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cdHZhciBQTFVTX1VSTF9TQUZFID0gJy0nLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIX1VSTF9TQUZFID0gJ18nLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUyB8fFxuXHRcdCAgICBjb2RlID09PSBQTFVTX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYyIC8vICcrJ1xuXHRcdGlmIChjb2RlID09PSBTTEFTSCB8fFxuXHRcdCAgICBjb2RlID09PSBTTEFTSF9VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MyAvLyAnLydcblx0XHRpZiAoY29kZSA8IE5VTUJFUilcblx0XHRcdHJldHVybiAtMSAvL25vIG1hdGNoXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIgKyAxMClcblx0XHRcdHJldHVybiBjb2RlIC0gTlVNQkVSICsgMjYgKyAyNlxuXHRcdGlmIChjb2RlIDwgVVBQRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gVVBQRVJcblx0XHRpZiAoY29kZSA8IExPV0VSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIExPV0VSICsgMjZcblx0fVxuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jylcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0dmFyIGxlbiA9IGI2NC5sZW5ndGhcblx0XHRwbGFjZUhvbGRlcnMgPSAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMikgPyAyIDogJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDEpID8gMSA6IDBcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cblx0XHR2YXIgTCA9IDBcblxuXHRcdGZ1bmN0aW9uIHB1c2ggKHYpIHtcblx0XHRcdGFycltMKytdID0gdlxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuXHRcdFx0cHVzaCgodG1wID4+IDgpICYgMHhGRilcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyXG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoXG5cblx0XHRmdW5jdGlvbiBlbmNvZGUgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cC5jaGFyQXQobnVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKG51bSA+PiAxOCAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiAxMiAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiA2ICYgMHgzRikgKyBlbmNvZGUobnVtICYgMHgzRilcblx0XHR9XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKVxuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAyKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSdcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSlcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDEwKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wID4+IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCAyKSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPSdcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0XG5cdH1cblxuXHRleHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXlcblx0ZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcgPyAodGhpcy5iYXNlNjRqcyA9IHt9KSA6IGV4cG9ydHMpKVxuIiwiZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IG0gKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAodmFsdWUgKiBjIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG4iLCJ2YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xudmFyIGludFNpemUgPSA0O1xudmFyIHplcm9CdWZmZXIgPSBuZXcgQnVmZmVyKGludFNpemUpOyB6ZXJvQnVmZmVyLmZpbGwoMCk7XG52YXIgY2hyc3ogPSA4O1xuXG5mdW5jdGlvbiB0b0FycmF5KGJ1ZiwgYmlnRW5kaWFuKSB7XG4gIGlmICgoYnVmLmxlbmd0aCAlIGludFNpemUpICE9PSAwKSB7XG4gICAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGggKyAoaW50U2l6ZSAtIChidWYubGVuZ3RoICUgaW50U2l6ZSkpO1xuICAgIGJ1ZiA9IEJ1ZmZlci5jb25jYXQoW2J1ZiwgemVyb0J1ZmZlcl0sIGxlbik7XG4gIH1cblxuICB2YXIgYXJyID0gW107XG4gIHZhciBmbiA9IGJpZ0VuZGlhbiA/IGJ1Zi5yZWFkSW50MzJCRSA6IGJ1Zi5yZWFkSW50MzJMRTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBidWYubGVuZ3RoOyBpICs9IGludFNpemUpIHtcbiAgICBhcnIucHVzaChmbi5jYWxsKGJ1ZiwgaSkpO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uIHRvQnVmZmVyKGFyciwgc2l6ZSwgYmlnRW5kaWFuKSB7XG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKHNpemUpO1xuICB2YXIgZm4gPSBiaWdFbmRpYW4gPyBidWYud3JpdGVJbnQzMkJFIDogYnVmLndyaXRlSW50MzJMRTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICBmbi5jYWxsKGJ1ZiwgYXJyW2ldLCBpICogNCwgdHJ1ZSk7XG4gIH1cbiAgcmV0dXJuIGJ1Zjtcbn1cblxuZnVuY3Rpb24gaGFzaChidWYsIGZuLCBoYXNoU2l6ZSwgYmlnRW5kaWFuKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIGJ1ZiA9IG5ldyBCdWZmZXIoYnVmKTtcbiAgdmFyIGFyciA9IGZuKHRvQXJyYXkoYnVmLCBiaWdFbmRpYW4pLCBidWYubGVuZ3RoICogY2hyc3opO1xuICByZXR1cm4gdG9CdWZmZXIoYXJyLCBoYXNoU2l6ZSwgYmlnRW5kaWFuKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IGhhc2g6IGhhc2ggfTtcbiIsInZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXJcbnZhciBzaGEgPSByZXF1aXJlKCcuL3NoYScpXG52YXIgc2hhMjU2ID0gcmVxdWlyZSgnLi9zaGEyNTYnKVxudmFyIHJuZyA9IHJlcXVpcmUoJy4vcm5nJylcbnZhciBtZDUgPSByZXF1aXJlKCcuL21kNScpXG5cbnZhciBhbGdvcml0aG1zID0ge1xuICBzaGExOiBzaGEsXG4gIHNoYTI1Njogc2hhMjU2LFxuICBtZDU6IG1kNVxufVxuXG52YXIgYmxvY2tzaXplID0gNjRcbnZhciB6ZXJvQnVmZmVyID0gbmV3IEJ1ZmZlcihibG9ja3NpemUpOyB6ZXJvQnVmZmVyLmZpbGwoMClcbmZ1bmN0aW9uIGhtYWMoZm4sIGtleSwgZGF0YSkge1xuICBpZighQnVmZmVyLmlzQnVmZmVyKGtleSkpIGtleSA9IG5ldyBCdWZmZXIoa2V5KVxuICBpZighQnVmZmVyLmlzQnVmZmVyKGRhdGEpKSBkYXRhID0gbmV3IEJ1ZmZlcihkYXRhKVxuXG4gIGlmKGtleS5sZW5ndGggPiBibG9ja3NpemUpIHtcbiAgICBrZXkgPSBmbihrZXkpXG4gIH0gZWxzZSBpZihrZXkubGVuZ3RoIDwgYmxvY2tzaXplKSB7XG4gICAga2V5ID0gQnVmZmVyLmNvbmNhdChba2V5LCB6ZXJvQnVmZmVyXSwgYmxvY2tzaXplKVxuICB9XG5cbiAgdmFyIGlwYWQgPSBuZXcgQnVmZmVyKGJsb2Nrc2l6ZSksIG9wYWQgPSBuZXcgQnVmZmVyKGJsb2Nrc2l6ZSlcbiAgZm9yKHZhciBpID0gMDsgaSA8IGJsb2Nrc2l6ZTsgaSsrKSB7XG4gICAgaXBhZFtpXSA9IGtleVtpXSBeIDB4MzZcbiAgICBvcGFkW2ldID0ga2V5W2ldIF4gMHg1Q1xuICB9XG5cbiAgdmFyIGhhc2ggPSBmbihCdWZmZXIuY29uY2F0KFtpcGFkLCBkYXRhXSkpXG4gIHJldHVybiBmbihCdWZmZXIuY29uY2F0KFtvcGFkLCBoYXNoXSkpXG59XG5cbmZ1bmN0aW9uIGhhc2goYWxnLCBrZXkpIHtcbiAgYWxnID0gYWxnIHx8ICdzaGExJ1xuICB2YXIgZm4gPSBhbGdvcml0aG1zW2FsZ11cbiAgdmFyIGJ1ZnMgPSBbXVxuICB2YXIgbGVuZ3RoID0gMFxuICBpZighZm4pIGVycm9yKCdhbGdvcml0aG06JywgYWxnLCAnaXMgbm90IHlldCBzdXBwb3J0ZWQnKVxuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIGlmKCFCdWZmZXIuaXNCdWZmZXIoZGF0YSkpIGRhdGEgPSBuZXcgQnVmZmVyKGRhdGEpXG4gICAgICAgIFxuICAgICAgYnVmcy5wdXNoKGRhdGEpXG4gICAgICBsZW5ndGggKz0gZGF0YS5sZW5ndGhcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcbiAgICBkaWdlc3Q6IGZ1bmN0aW9uIChlbmMpIHtcbiAgICAgIHZhciBidWYgPSBCdWZmZXIuY29uY2F0KGJ1ZnMpXG4gICAgICB2YXIgciA9IGtleSA/IGhtYWMoZm4sIGtleSwgYnVmKSA6IGZuKGJ1ZilcbiAgICAgIGJ1ZnMgPSBudWxsXG4gICAgICByZXR1cm4gZW5jID8gci50b1N0cmluZyhlbmMpIDogclxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBlcnJvciAoKSB7XG4gIHZhciBtID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpLmpvaW4oJyAnKVxuICB0aHJvdyBuZXcgRXJyb3IoW1xuICAgIG0sXG4gICAgJ3dlIGFjY2VwdCBwdWxsIHJlcXVlc3RzJyxcbiAgICAnaHR0cDovL2dpdGh1Yi5jb20vZG9taW5pY3RhcnIvY3J5cHRvLWJyb3dzZXJpZnknXG4gICAgXS5qb2luKCdcXG4nKSlcbn1cblxuZXhwb3J0cy5jcmVhdGVIYXNoID0gZnVuY3Rpb24gKGFsZykgeyByZXR1cm4gaGFzaChhbGcpIH1cbmV4cG9ydHMuY3JlYXRlSG1hYyA9IGZ1bmN0aW9uIChhbGcsIGtleSkgeyByZXR1cm4gaGFzaChhbGcsIGtleSkgfVxuZXhwb3J0cy5yYW5kb21CeXRlcyA9IGZ1bmN0aW9uKHNpemUsIGNhbGxiYWNrKSB7XG4gIGlmIChjYWxsYmFjayAmJiBjYWxsYmFjay5jYWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgdW5kZWZpbmVkLCBuZXcgQnVmZmVyKHJuZyhzaXplKSkpXG4gICAgfSBjYXRjaCAoZXJyKSB7IGNhbGxiYWNrKGVycikgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKHJuZyhzaXplKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBlYWNoKGEsIGYpIHtcbiAgZm9yKHZhciBpIGluIGEpXG4gICAgZihhW2ldLCBpKVxufVxuXG4vLyB0aGUgbGVhc3QgSSBjYW4gZG8gaXMgbWFrZSBlcnJvciBtZXNzYWdlcyBmb3IgdGhlIHJlc3Qgb2YgdGhlIG5vZGUuanMvY3J5cHRvIGFwaS5cbmVhY2goWydjcmVhdGVDcmVkZW50aWFscydcbiwgJ2NyZWF0ZUNpcGhlcidcbiwgJ2NyZWF0ZUNpcGhlcml2J1xuLCAnY3JlYXRlRGVjaXBoZXInXG4sICdjcmVhdGVEZWNpcGhlcml2J1xuLCAnY3JlYXRlU2lnbidcbiwgJ2NyZWF0ZVZlcmlmeSdcbiwgJ2NyZWF0ZURpZmZpZUhlbGxtYW4nXG4sICdwYmtkZjInXSwgZnVuY3Rpb24gKG5hbWUpIHtcbiAgZXhwb3J0c1tuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICBlcnJvcignc29ycnksJywgbmFtZSwgJ2lzIG5vdCBpbXBsZW1lbnRlZCB5ZXQnKVxuICB9XG59KVxuIiwiLypcclxuICogQSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBSU0EgRGF0YSBTZWN1cml0eSwgSW5jLiBNRDUgTWVzc2FnZVxyXG4gKiBEaWdlc3QgQWxnb3JpdGhtLCBhcyBkZWZpbmVkIGluIFJGQyAxMzIxLlxyXG4gKiBWZXJzaW9uIDIuMSBDb3B5cmlnaHQgKEMpIFBhdWwgSm9obnN0b24gMTk5OSAtIDIwMDIuXHJcbiAqIE90aGVyIGNvbnRyaWJ1dG9yczogR3JlZyBIb2x0LCBBbmRyZXcgS2VwZXJ0LCBZZG5hciwgTG9zdGluZXRcclxuICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIEJTRCBMaWNlbnNlXHJcbiAqIFNlZSBodHRwOi8vcGFqaG9tZS5vcmcudWsvY3J5cHQvbWQ1IGZvciBtb3JlIGluZm8uXHJcbiAqL1xyXG5cclxudmFyIGhlbHBlcnMgPSByZXF1aXJlKCcuL2hlbHBlcnMnKTtcclxuXHJcbi8qXHJcbiAqIFBlcmZvcm0gYSBzaW1wbGUgc2VsZi10ZXN0IHRvIHNlZSBpZiB0aGUgVk0gaXMgd29ya2luZ1xyXG4gKi9cclxuZnVuY3Rpb24gbWQ1X3ZtX3Rlc3QoKVxyXG57XHJcbiAgcmV0dXJuIGhleF9tZDUoXCJhYmNcIikgPT0gXCI5MDAxNTA5ODNjZDI0ZmIwZDY5NjNmN2QyOGUxN2Y3MlwiO1xyXG59XHJcblxyXG4vKlxyXG4gKiBDYWxjdWxhdGUgdGhlIE1ENSBvZiBhbiBhcnJheSBvZiBsaXR0bGUtZW5kaWFuIHdvcmRzLCBhbmQgYSBiaXQgbGVuZ3RoXHJcbiAqL1xyXG5mdW5jdGlvbiBjb3JlX21kNSh4LCBsZW4pXHJcbntcclxuICAvKiBhcHBlbmQgcGFkZGluZyAqL1xyXG4gIHhbbGVuID4+IDVdIHw9IDB4ODAgPDwgKChsZW4pICUgMzIpO1xyXG4gIHhbKCgobGVuICsgNjQpID4+PiA5KSA8PCA0KSArIDE0XSA9IGxlbjtcclxuXHJcbiAgdmFyIGEgPSAgMTczMjU4NDE5MztcclxuICB2YXIgYiA9IC0yNzE3MzM4Nzk7XHJcbiAgdmFyIGMgPSAtMTczMjU4NDE5NDtcclxuICB2YXIgZCA9ICAyNzE3MzM4Nzg7XHJcblxyXG4gIGZvcih2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSArPSAxNilcclxuICB7XHJcbiAgICB2YXIgb2xkYSA9IGE7XHJcbiAgICB2YXIgb2xkYiA9IGI7XHJcbiAgICB2YXIgb2xkYyA9IGM7XHJcbiAgICB2YXIgb2xkZCA9IGQ7XHJcblxyXG4gICAgYSA9IG1kNV9mZihhLCBiLCBjLCBkLCB4W2krIDBdLCA3ICwgLTY4MDg3NjkzNik7XHJcbiAgICBkID0gbWQ1X2ZmKGQsIGEsIGIsIGMsIHhbaSsgMV0sIDEyLCAtMzg5NTY0NTg2KTtcclxuICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpKyAyXSwgMTcsICA2MDYxMDU4MTkpO1xyXG4gICAgYiA9IG1kNV9mZihiLCBjLCBkLCBhLCB4W2krIDNdLCAyMiwgLTEwNDQ1MjUzMzApO1xyXG4gICAgYSA9IG1kNV9mZihhLCBiLCBjLCBkLCB4W2krIDRdLCA3ICwgLTE3NjQxODg5Nyk7XHJcbiAgICBkID0gbWQ1X2ZmKGQsIGEsIGIsIGMsIHhbaSsgNV0sIDEyLCAgMTIwMDA4MDQyNik7XHJcbiAgICBjID0gbWQ1X2ZmKGMsIGQsIGEsIGIsIHhbaSsgNl0sIDE3LCAtMTQ3MzIzMTM0MSk7XHJcbiAgICBiID0gbWQ1X2ZmKGIsIGMsIGQsIGEsIHhbaSsgN10sIDIyLCAtNDU3MDU5ODMpO1xyXG4gICAgYSA9IG1kNV9mZihhLCBiLCBjLCBkLCB4W2krIDhdLCA3ICwgIDE3NzAwMzU0MTYpO1xyXG4gICAgZCA9IG1kNV9mZihkLCBhLCBiLCBjLCB4W2krIDldLCAxMiwgLTE5NTg0MTQ0MTcpO1xyXG4gICAgYyA9IG1kNV9mZihjLCBkLCBhLCBiLCB4W2krMTBdLCAxNywgLTQyMDYzKTtcclxuICAgIGIgPSBtZDVfZmYoYiwgYywgZCwgYSwgeFtpKzExXSwgMjIsIC0xOTkwNDA0MTYyKTtcclxuICAgIGEgPSBtZDVfZmYoYSwgYiwgYywgZCwgeFtpKzEyXSwgNyAsICAxODA0NjAzNjgyKTtcclxuICAgIGQgPSBtZDVfZmYoZCwgYSwgYiwgYywgeFtpKzEzXSwgMTIsIC00MDM0MTEwMSk7XHJcbiAgICBjID0gbWQ1X2ZmKGMsIGQsIGEsIGIsIHhbaSsxNF0sIDE3LCAtMTUwMjAwMjI5MCk7XHJcbiAgICBiID0gbWQ1X2ZmKGIsIGMsIGQsIGEsIHhbaSsxNV0sIDIyLCAgMTIzNjUzNTMyOSk7XHJcblxyXG4gICAgYSA9IG1kNV9nZyhhLCBiLCBjLCBkLCB4W2krIDFdLCA1ICwgLTE2NTc5NjUxMCk7XHJcbiAgICBkID0gbWQ1X2dnKGQsIGEsIGIsIGMsIHhbaSsgNl0sIDkgLCAtMTA2OTUwMTYzMik7XHJcbiAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSsxMV0sIDE0LCAgNjQzNzE3NzEzKTtcclxuICAgIGIgPSBtZDVfZ2coYiwgYywgZCwgYSwgeFtpKyAwXSwgMjAsIC0zNzM4OTczMDIpO1xyXG4gICAgYSA9IG1kNV9nZyhhLCBiLCBjLCBkLCB4W2krIDVdLCA1ICwgLTcwMTU1ODY5MSk7XHJcbiAgICBkID0gbWQ1X2dnKGQsIGEsIGIsIGMsIHhbaSsxMF0sIDkgLCAgMzgwMTYwODMpO1xyXG4gICAgYyA9IG1kNV9nZyhjLCBkLCBhLCBiLCB4W2krMTVdLCAxNCwgLTY2MDQ3ODMzNSk7XHJcbiAgICBiID0gbWQ1X2dnKGIsIGMsIGQsIGEsIHhbaSsgNF0sIDIwLCAtNDA1NTM3ODQ4KTtcclxuICAgIGEgPSBtZDVfZ2coYSwgYiwgYywgZCwgeFtpKyA5XSwgNSAsICA1Njg0NDY0MzgpO1xyXG4gICAgZCA9IG1kNV9nZyhkLCBhLCBiLCBjLCB4W2krMTRdLCA5ICwgLTEwMTk4MDM2OTApO1xyXG4gICAgYyA9IG1kNV9nZyhjLCBkLCBhLCBiLCB4W2krIDNdLCAxNCwgLTE4NzM2Mzk2MSk7XHJcbiAgICBiID0gbWQ1X2dnKGIsIGMsIGQsIGEsIHhbaSsgOF0sIDIwLCAgMTE2MzUzMTUwMSk7XHJcbiAgICBhID0gbWQ1X2dnKGEsIGIsIGMsIGQsIHhbaSsxM10sIDUgLCAtMTQ0NDY4MTQ2Nyk7XHJcbiAgICBkID0gbWQ1X2dnKGQsIGEsIGIsIGMsIHhbaSsgMl0sIDkgLCAtNTE0MDM3ODQpO1xyXG4gICAgYyA9IG1kNV9nZyhjLCBkLCBhLCBiLCB4W2krIDddLCAxNCwgIDE3MzUzMjg0NzMpO1xyXG4gICAgYiA9IG1kNV9nZyhiLCBjLCBkLCBhLCB4W2krMTJdLCAyMCwgLTE5MjY2MDc3MzQpO1xyXG5cclxuICAgIGEgPSBtZDVfaGgoYSwgYiwgYywgZCwgeFtpKyA1XSwgNCAsIC0zNzg1NTgpO1xyXG4gICAgZCA9IG1kNV9oaChkLCBhLCBiLCBjLCB4W2krIDhdLCAxMSwgLTIwMjI1NzQ0NjMpO1xyXG4gICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2krMTFdLCAxNiwgIDE4MzkwMzA1NjIpO1xyXG4gICAgYiA9IG1kNV9oaChiLCBjLCBkLCBhLCB4W2krMTRdLCAyMywgLTM1MzA5NTU2KTtcclxuICAgIGEgPSBtZDVfaGgoYSwgYiwgYywgZCwgeFtpKyAxXSwgNCAsIC0xNTMwOTkyMDYwKTtcclxuICAgIGQgPSBtZDVfaGgoZCwgYSwgYiwgYywgeFtpKyA0XSwgMTEsICAxMjcyODkzMzUzKTtcclxuICAgIGMgPSBtZDVfaGgoYywgZCwgYSwgYiwgeFtpKyA3XSwgMTYsIC0xNTU0OTc2MzIpO1xyXG4gICAgYiA9IG1kNV9oaChiLCBjLCBkLCBhLCB4W2krMTBdLCAyMywgLTEwOTQ3MzA2NDApO1xyXG4gICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2krMTNdLCA0ICwgIDY4MTI3OTE3NCk7XHJcbiAgICBkID0gbWQ1X2hoKGQsIGEsIGIsIGMsIHhbaSsgMF0sIDExLCAtMzU4NTM3MjIyKTtcclxuICAgIGMgPSBtZDVfaGgoYywgZCwgYSwgYiwgeFtpKyAzXSwgMTYsIC03MjI1MjE5NzkpO1xyXG4gICAgYiA9IG1kNV9oaChiLCBjLCBkLCBhLCB4W2krIDZdLCAyMywgIDc2MDI5MTg5KTtcclxuICAgIGEgPSBtZDVfaGgoYSwgYiwgYywgZCwgeFtpKyA5XSwgNCAsIC02NDAzNjQ0ODcpO1xyXG4gICAgZCA9IG1kNV9oaChkLCBhLCBiLCBjLCB4W2krMTJdLCAxMSwgLTQyMTgxNTgzNSk7XHJcbiAgICBjID0gbWQ1X2hoKGMsIGQsIGEsIGIsIHhbaSsxNV0sIDE2LCAgNTMwNzQyNTIwKTtcclxuICAgIGIgPSBtZDVfaGgoYiwgYywgZCwgYSwgeFtpKyAyXSwgMjMsIC05OTUzMzg2NTEpO1xyXG5cclxuICAgIGEgPSBtZDVfaWkoYSwgYiwgYywgZCwgeFtpKyAwXSwgNiAsIC0xOTg2MzA4NDQpO1xyXG4gICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2krIDddLCAxMCwgIDExMjY4OTE0MTUpO1xyXG4gICAgYyA9IG1kNV9paShjLCBkLCBhLCBiLCB4W2krMTRdLCAxNSwgLTE0MTYzNTQ5MDUpO1xyXG4gICAgYiA9IG1kNV9paShiLCBjLCBkLCBhLCB4W2krIDVdLCAyMSwgLTU3NDM0MDU1KTtcclxuICAgIGEgPSBtZDVfaWkoYSwgYiwgYywgZCwgeFtpKzEyXSwgNiAsICAxNzAwNDg1NTcxKTtcclxuICAgIGQgPSBtZDVfaWkoZCwgYSwgYiwgYywgeFtpKyAzXSwgMTAsIC0xODk0OTg2NjA2KTtcclxuICAgIGMgPSBtZDVfaWkoYywgZCwgYSwgYiwgeFtpKzEwXSwgMTUsIC0xMDUxNTIzKTtcclxuICAgIGIgPSBtZDVfaWkoYiwgYywgZCwgYSwgeFtpKyAxXSwgMjEsIC0yMDU0OTIyNzk5KTtcclxuICAgIGEgPSBtZDVfaWkoYSwgYiwgYywgZCwgeFtpKyA4XSwgNiAsICAxODczMzEzMzU5KTtcclxuICAgIGQgPSBtZDVfaWkoZCwgYSwgYiwgYywgeFtpKzE1XSwgMTAsIC0zMDYxMTc0NCk7XHJcbiAgICBjID0gbWQ1X2lpKGMsIGQsIGEsIGIsIHhbaSsgNl0sIDE1LCAtMTU2MDE5ODM4MCk7XHJcbiAgICBiID0gbWQ1X2lpKGIsIGMsIGQsIGEsIHhbaSsxM10sIDIxLCAgMTMwOTE1MTY0OSk7XHJcbiAgICBhID0gbWQ1X2lpKGEsIGIsIGMsIGQsIHhbaSsgNF0sIDYgLCAtMTQ1NTIzMDcwKTtcclxuICAgIGQgPSBtZDVfaWkoZCwgYSwgYiwgYywgeFtpKzExXSwgMTAsIC0xMTIwMjEwMzc5KTtcclxuICAgIGMgPSBtZDVfaWkoYywgZCwgYSwgYiwgeFtpKyAyXSwgMTUsICA3MTg3ODcyNTkpO1xyXG4gICAgYiA9IG1kNV9paShiLCBjLCBkLCBhLCB4W2krIDldLCAyMSwgLTM0MzQ4NTU1MSk7XHJcblxyXG4gICAgYSA9IHNhZmVfYWRkKGEsIG9sZGEpO1xyXG4gICAgYiA9IHNhZmVfYWRkKGIsIG9sZGIpO1xyXG4gICAgYyA9IHNhZmVfYWRkKGMsIG9sZGMpO1xyXG4gICAgZCA9IHNhZmVfYWRkKGQsIG9sZGQpO1xyXG4gIH1cclxuICByZXR1cm4gQXJyYXkoYSwgYiwgYywgZCk7XHJcblxyXG59XHJcblxyXG4vKlxyXG4gKiBUaGVzZSBmdW5jdGlvbnMgaW1wbGVtZW50IHRoZSBmb3VyIGJhc2ljIG9wZXJhdGlvbnMgdGhlIGFsZ29yaXRobSB1c2VzLlxyXG4gKi9cclxuZnVuY3Rpb24gbWQ1X2NtbihxLCBhLCBiLCB4LCBzLCB0KVxyXG57XHJcbiAgcmV0dXJuIHNhZmVfYWRkKGJpdF9yb2woc2FmZV9hZGQoc2FmZV9hZGQoYSwgcSksIHNhZmVfYWRkKHgsIHQpKSwgcyksYik7XHJcbn1cclxuZnVuY3Rpb24gbWQ1X2ZmKGEsIGIsIGMsIGQsIHgsIHMsIHQpXHJcbntcclxuICByZXR1cm4gbWQ1X2NtbigoYiAmIGMpIHwgKCh+YikgJiBkKSwgYSwgYiwgeCwgcywgdCk7XHJcbn1cclxuZnVuY3Rpb24gbWQ1X2dnKGEsIGIsIGMsIGQsIHgsIHMsIHQpXHJcbntcclxuICByZXR1cm4gbWQ1X2NtbigoYiAmIGQpIHwgKGMgJiAofmQpKSwgYSwgYiwgeCwgcywgdCk7XHJcbn1cclxuZnVuY3Rpb24gbWQ1X2hoKGEsIGIsIGMsIGQsIHgsIHMsIHQpXHJcbntcclxuICByZXR1cm4gbWQ1X2NtbihiIF4gYyBeIGQsIGEsIGIsIHgsIHMsIHQpO1xyXG59XHJcbmZ1bmN0aW9uIG1kNV9paShhLCBiLCBjLCBkLCB4LCBzLCB0KVxyXG57XHJcbiAgcmV0dXJuIG1kNV9jbW4oYyBeIChiIHwgKH5kKSksIGEsIGIsIHgsIHMsIHQpO1xyXG59XHJcblxyXG4vKlxyXG4gKiBBZGQgaW50ZWdlcnMsIHdyYXBwaW5nIGF0IDJeMzIuIFRoaXMgdXNlcyAxNi1iaXQgb3BlcmF0aW9ucyBpbnRlcm5hbGx5XHJcbiAqIHRvIHdvcmsgYXJvdW5kIGJ1Z3MgaW4gc29tZSBKUyBpbnRlcnByZXRlcnMuXHJcbiAqL1xyXG5mdW5jdGlvbiBzYWZlX2FkZCh4LCB5KVxyXG57XHJcbiAgdmFyIGxzdyA9ICh4ICYgMHhGRkZGKSArICh5ICYgMHhGRkZGKTtcclxuICB2YXIgbXN3ID0gKHggPj4gMTYpICsgKHkgPj4gMTYpICsgKGxzdyA+PiAxNik7XHJcbiAgcmV0dXJuIChtc3cgPDwgMTYpIHwgKGxzdyAmIDB4RkZGRik7XHJcbn1cclxuXHJcbi8qXHJcbiAqIEJpdHdpc2Ugcm90YXRlIGEgMzItYml0IG51bWJlciB0byB0aGUgbGVmdC5cclxuICovXHJcbmZ1bmN0aW9uIGJpdF9yb2wobnVtLCBjbnQpXHJcbntcclxuICByZXR1cm4gKG51bSA8PCBjbnQpIHwgKG51bSA+Pj4gKDMyIC0gY250KSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWQ1KGJ1Zikge1xyXG4gIHJldHVybiBoZWxwZXJzLmhhc2goYnVmLCBjb3JlX21kNSwgMTYpO1xyXG59O1xyXG4iLCIvLyBPcmlnaW5hbCBjb2RlIGFkYXB0ZWQgZnJvbSBSb2JlcnQgS2llZmZlci5cbi8vIGRldGFpbHMgYXQgaHR0cHM6Ly9naXRodWIuY29tL2Jyb29mYS9ub2RlLXV1aWRcbihmdW5jdGlvbigpIHtcbiAgdmFyIF9nbG9iYWwgPSB0aGlzO1xuXG4gIHZhciBtYXRoUk5HLCB3aGF0d2dSTkc7XG5cbiAgLy8gTk9URTogTWF0aC5yYW5kb20oKSBkb2VzIG5vdCBndWFyYW50ZWUgXCJjcnlwdG9ncmFwaGljIHF1YWxpdHlcIlxuICBtYXRoUk5HID0gZnVuY3Rpb24oc2l6ZSkge1xuICAgIHZhciBieXRlcyA9IG5ldyBBcnJheShzaXplKTtcbiAgICB2YXIgcjtcblxuICAgIGZvciAodmFyIGkgPSAwLCByOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBpZiAoKGkgJiAweDAzKSA9PSAwKSByID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwO1xuICAgICAgYnl0ZXNbaV0gPSByID4+PiAoKGkgJiAweDAzKSA8PCAzKSAmIDB4ZmY7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ5dGVzO1xuICB9XG5cbiAgaWYgKF9nbG9iYWwuY3J5cHRvICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcbiAgICB3aGF0d2dSTkcgPSBmdW5jdGlvbihzaXplKSB7XG4gICAgICB2YXIgYnl0ZXMgPSBuZXcgVWludDhBcnJheShzaXplKTtcbiAgICAgIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnl0ZXMpO1xuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH1cbiAgfVxuXG4gIG1vZHVsZS5leHBvcnRzID0gd2hhdHdnUk5HIHx8IG1hdGhSTkc7XG5cbn0oKSlcbiIsIi8qXG4gKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFNlY3VyZSBIYXNoIEFsZ29yaXRobSwgU0hBLTEsIGFzIGRlZmluZWRcbiAqIGluIEZJUFMgUFVCIDE4MC0xXG4gKiBWZXJzaW9uIDIuMWEgQ29weXJpZ2h0IFBhdWwgSm9obnN0b24gMjAwMCAtIDIwMDIuXG4gKiBPdGhlciBjb250cmlidXRvcnM6IEdyZWcgSG9sdCwgQW5kcmV3IEtlcGVydCwgWWRuYXIsIExvc3RpbmV0XG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgQlNEIExpY2Vuc2VcbiAqIFNlZSBodHRwOi8vcGFqaG9tZS5vcmcudWsvY3J5cHQvbWQ1IGZvciBkZXRhaWxzLlxuICovXG5cbnZhciBoZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJzJyk7XG5cbi8qXG4gKiBDYWxjdWxhdGUgdGhlIFNIQS0xIG9mIGFuIGFycmF5IG9mIGJpZy1lbmRpYW4gd29yZHMsIGFuZCBhIGJpdCBsZW5ndGhcbiAqL1xuZnVuY3Rpb24gY29yZV9zaGExKHgsIGxlbilcbntcbiAgLyogYXBwZW5kIHBhZGRpbmcgKi9cbiAgeFtsZW4gPj4gNV0gfD0gMHg4MCA8PCAoMjQgLSBsZW4gJSAzMik7XG4gIHhbKChsZW4gKyA2NCA+PiA5KSA8PCA0KSArIDE1XSA9IGxlbjtcblxuICB2YXIgdyA9IEFycmF5KDgwKTtcbiAgdmFyIGEgPSAgMTczMjU4NDE5MztcbiAgdmFyIGIgPSAtMjcxNzMzODc5O1xuICB2YXIgYyA9IC0xNzMyNTg0MTk0O1xuICB2YXIgZCA9ICAyNzE3MzM4Nzg7XG4gIHZhciBlID0gLTEwMDk1ODk3NzY7XG5cbiAgZm9yKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpICs9IDE2KVxuICB7XG4gICAgdmFyIG9sZGEgPSBhO1xuICAgIHZhciBvbGRiID0gYjtcbiAgICB2YXIgb2xkYyA9IGM7XG4gICAgdmFyIG9sZGQgPSBkO1xuICAgIHZhciBvbGRlID0gZTtcblxuICAgIGZvcih2YXIgaiA9IDA7IGogPCA4MDsgaisrKVxuICAgIHtcbiAgICAgIGlmKGogPCAxNikgd1tqXSA9IHhbaSArIGpdO1xuICAgICAgZWxzZSB3W2pdID0gcm9sKHdbai0zXSBeIHdbai04XSBeIHdbai0xNF0gXiB3W2otMTZdLCAxKTtcbiAgICAgIHZhciB0ID0gc2FmZV9hZGQoc2FmZV9hZGQocm9sKGEsIDUpLCBzaGExX2Z0KGosIGIsIGMsIGQpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgc2FmZV9hZGQoc2FmZV9hZGQoZSwgd1tqXSksIHNoYTFfa3QoaikpKTtcbiAgICAgIGUgPSBkO1xuICAgICAgZCA9IGM7XG4gICAgICBjID0gcm9sKGIsIDMwKTtcbiAgICAgIGIgPSBhO1xuICAgICAgYSA9IHQ7XG4gICAgfVxuXG4gICAgYSA9IHNhZmVfYWRkKGEsIG9sZGEpO1xuICAgIGIgPSBzYWZlX2FkZChiLCBvbGRiKTtcbiAgICBjID0gc2FmZV9hZGQoYywgb2xkYyk7XG4gICAgZCA9IHNhZmVfYWRkKGQsIG9sZGQpO1xuICAgIGUgPSBzYWZlX2FkZChlLCBvbGRlKTtcbiAgfVxuICByZXR1cm4gQXJyYXkoYSwgYiwgYywgZCwgZSk7XG5cbn1cblxuLypcbiAqIFBlcmZvcm0gdGhlIGFwcHJvcHJpYXRlIHRyaXBsZXQgY29tYmluYXRpb24gZnVuY3Rpb24gZm9yIHRoZSBjdXJyZW50XG4gKiBpdGVyYXRpb25cbiAqL1xuZnVuY3Rpb24gc2hhMV9mdCh0LCBiLCBjLCBkKVxue1xuICBpZih0IDwgMjApIHJldHVybiAoYiAmIGMpIHwgKCh+YikgJiBkKTtcbiAgaWYodCA8IDQwKSByZXR1cm4gYiBeIGMgXiBkO1xuICBpZih0IDwgNjApIHJldHVybiAoYiAmIGMpIHwgKGIgJiBkKSB8IChjICYgZCk7XG4gIHJldHVybiBiIF4gYyBeIGQ7XG59XG5cbi8qXG4gKiBEZXRlcm1pbmUgdGhlIGFwcHJvcHJpYXRlIGFkZGl0aXZlIGNvbnN0YW50IGZvciB0aGUgY3VycmVudCBpdGVyYXRpb25cbiAqL1xuZnVuY3Rpb24gc2hhMV9rdCh0KVxue1xuICByZXR1cm4gKHQgPCAyMCkgPyAgMTUxODUwMDI0OSA6ICh0IDwgNDApID8gIDE4NTk3NzUzOTMgOlxuICAgICAgICAgKHQgPCA2MCkgPyAtMTg5NDAwNzU4OCA6IC04OTk0OTc1MTQ7XG59XG5cbi8qXG4gKiBBZGQgaW50ZWdlcnMsIHdyYXBwaW5nIGF0IDJeMzIuIFRoaXMgdXNlcyAxNi1iaXQgb3BlcmF0aW9ucyBpbnRlcm5hbGx5XG4gKiB0byB3b3JrIGFyb3VuZCBidWdzIGluIHNvbWUgSlMgaW50ZXJwcmV0ZXJzLlxuICovXG5mdW5jdGlvbiBzYWZlX2FkZCh4LCB5KVxue1xuICB2YXIgbHN3ID0gKHggJiAweEZGRkYpICsgKHkgJiAweEZGRkYpO1xuICB2YXIgbXN3ID0gKHggPj4gMTYpICsgKHkgPj4gMTYpICsgKGxzdyA+PiAxNik7XG4gIHJldHVybiAobXN3IDw8IDE2KSB8IChsc3cgJiAweEZGRkYpO1xufVxuXG4vKlxuICogQml0d2lzZSByb3RhdGUgYSAzMi1iaXQgbnVtYmVyIHRvIHRoZSBsZWZ0LlxuICovXG5mdW5jdGlvbiByb2wobnVtLCBjbnQpXG57XG4gIHJldHVybiAobnVtIDw8IGNudCkgfCAobnVtID4+PiAoMzIgLSBjbnQpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzaGExKGJ1Zikge1xuICByZXR1cm4gaGVscGVycy5oYXNoKGJ1ZiwgY29yZV9zaGExLCAyMCwgdHJ1ZSk7XG59O1xuIiwiXG4vKipcbiAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgU2VjdXJlIEhhc2ggQWxnb3JpdGhtLCBTSEEtMjU2LCBhcyBkZWZpbmVkXG4gKiBpbiBGSVBTIDE4MC0yXG4gKiBWZXJzaW9uIDIuMi1iZXRhIENvcHlyaWdodCBBbmdlbCBNYXJpbiwgUGF1bCBKb2huc3RvbiAyMDAwIC0gMjAwOS5cbiAqIE90aGVyIGNvbnRyaWJ1dG9yczogR3JlZyBIb2x0LCBBbmRyZXcgS2VwZXJ0LCBZZG5hciwgTG9zdGluZXRcbiAqXG4gKi9cblxudmFyIGhlbHBlcnMgPSByZXF1aXJlKCcuL2hlbHBlcnMnKTtcblxudmFyIHNhZmVfYWRkID0gZnVuY3Rpb24oeCwgeSkge1xuICB2YXIgbHN3ID0gKHggJiAweEZGRkYpICsgKHkgJiAweEZGRkYpO1xuICB2YXIgbXN3ID0gKHggPj4gMTYpICsgKHkgPj4gMTYpICsgKGxzdyA+PiAxNik7XG4gIHJldHVybiAobXN3IDw8IDE2KSB8IChsc3cgJiAweEZGRkYpO1xufTtcblxudmFyIFMgPSBmdW5jdGlvbihYLCBuKSB7XG4gIHJldHVybiAoWCA+Pj4gbikgfCAoWCA8PCAoMzIgLSBuKSk7XG59O1xuXG52YXIgUiA9IGZ1bmN0aW9uKFgsIG4pIHtcbiAgcmV0dXJuIChYID4+PiBuKTtcbn07XG5cbnZhciBDaCA9IGZ1bmN0aW9uKHgsIHksIHopIHtcbiAgcmV0dXJuICgoeCAmIHkpIF4gKCh+eCkgJiB6KSk7XG59O1xuXG52YXIgTWFqID0gZnVuY3Rpb24oeCwgeSwgeikge1xuICByZXR1cm4gKCh4ICYgeSkgXiAoeCAmIHopIF4gKHkgJiB6KSk7XG59O1xuXG52YXIgU2lnbWEwMjU2ID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4gKFMoeCwgMikgXiBTKHgsIDEzKSBeIFMoeCwgMjIpKTtcbn07XG5cbnZhciBTaWdtYTEyNTYgPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiAoUyh4LCA2KSBeIFMoeCwgMTEpIF4gUyh4LCAyNSkpO1xufTtcblxudmFyIEdhbW1hMDI1NiA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIChTKHgsIDcpIF4gUyh4LCAxOCkgXiBSKHgsIDMpKTtcbn07XG5cbnZhciBHYW1tYTEyNTYgPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiAoUyh4LCAxNykgXiBTKHgsIDE5KSBeIFIoeCwgMTApKTtcbn07XG5cbnZhciBjb3JlX3NoYTI1NiA9IGZ1bmN0aW9uKG0sIGwpIHtcbiAgdmFyIEsgPSBuZXcgQXJyYXkoMHg0MjhBMkY5OCwweDcxMzc0NDkxLDB4QjVDMEZCQ0YsMHhFOUI1REJBNSwweDM5NTZDMjVCLDB4NTlGMTExRjEsMHg5MjNGODJBNCwweEFCMUM1RUQ1LDB4RDgwN0FBOTgsMHgxMjgzNUIwMSwweDI0MzE4NUJFLDB4NTUwQzdEQzMsMHg3MkJFNUQ3NCwweDgwREVCMUZFLDB4OUJEQzA2QTcsMHhDMTlCRjE3NCwweEU0OUI2OUMxLDB4RUZCRTQ3ODYsMHhGQzE5REM2LDB4MjQwQ0ExQ0MsMHgyREU5MkM2RiwweDRBNzQ4NEFBLDB4NUNCMEE5REMsMHg3NkY5ODhEQSwweDk4M0U1MTUyLDB4QTgzMUM2NkQsMHhCMDAzMjdDOCwweEJGNTk3RkM3LDB4QzZFMDBCRjMsMHhENUE3OTE0NywweDZDQTYzNTEsMHgxNDI5Mjk2NywweDI3QjcwQTg1LDB4MkUxQjIxMzgsMHg0RDJDNkRGQywweDUzMzgwRDEzLDB4NjUwQTczNTQsMHg3NjZBMEFCQiwweDgxQzJDOTJFLDB4OTI3MjJDODUsMHhBMkJGRThBMSwweEE4MUE2NjRCLDB4QzI0QjhCNzAsMHhDNzZDNTFBMywweEQxOTJFODE5LDB4RDY5OTA2MjQsMHhGNDBFMzU4NSwweDEwNkFBMDcwLDB4MTlBNEMxMTYsMHgxRTM3NkMwOCwweDI3NDg3NzRDLDB4MzRCMEJDQjUsMHgzOTFDMENCMywweDRFRDhBQTRBLDB4NUI5Q0NBNEYsMHg2ODJFNkZGMywweDc0OEY4MkVFLDB4NzhBNTYzNkYsMHg4NEM4NzgxNCwweDhDQzcwMjA4LDB4OTBCRUZGRkEsMHhBNDUwNkNFQiwweEJFRjlBM0Y3LDB4QzY3MTc4RjIpO1xuICB2YXIgSEFTSCA9IG5ldyBBcnJheSgweDZBMDlFNjY3LCAweEJCNjdBRTg1LCAweDNDNkVGMzcyLCAweEE1NEZGNTNBLCAweDUxMEU1MjdGLCAweDlCMDU2ODhDLCAweDFGODNEOUFCLCAweDVCRTBDRDE5KTtcbiAgICB2YXIgVyA9IG5ldyBBcnJheSg2NCk7XG4gICAgdmFyIGEsIGIsIGMsIGQsIGUsIGYsIGcsIGgsIGksIGo7XG4gICAgdmFyIFQxLCBUMjtcbiAgLyogYXBwZW5kIHBhZGRpbmcgKi9cbiAgbVtsID4+IDVdIHw9IDB4ODAgPDwgKDI0IC0gbCAlIDMyKTtcbiAgbVsoKGwgKyA2NCA+PiA5KSA8PCA0KSArIDE1XSA9IGw7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbS5sZW5ndGg7IGkgKz0gMTYpIHtcbiAgICBhID0gSEFTSFswXTsgYiA9IEhBU0hbMV07IGMgPSBIQVNIWzJdOyBkID0gSEFTSFszXTsgZSA9IEhBU0hbNF07IGYgPSBIQVNIWzVdOyBnID0gSEFTSFs2XTsgaCA9IEhBU0hbN107XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCA2NDsgaisrKSB7XG4gICAgICBpZiAoaiA8IDE2KSB7XG4gICAgICAgIFdbal0gPSBtW2ogKyBpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFdbal0gPSBzYWZlX2FkZChzYWZlX2FkZChzYWZlX2FkZChHYW1tYTEyNTYoV1tqIC0gMl0pLCBXW2ogLSA3XSksIEdhbW1hMDI1NihXW2ogLSAxNV0pKSwgV1tqIC0gMTZdKTtcbiAgICAgIH1cbiAgICAgIFQxID0gc2FmZV9hZGQoc2FmZV9hZGQoc2FmZV9hZGQoc2FmZV9hZGQoaCwgU2lnbWExMjU2KGUpKSwgQ2goZSwgZiwgZykpLCBLW2pdKSwgV1tqXSk7XG4gICAgICBUMiA9IHNhZmVfYWRkKFNpZ21hMDI1NihhKSwgTWFqKGEsIGIsIGMpKTtcbiAgICAgIGggPSBnOyBnID0gZjsgZiA9IGU7IGUgPSBzYWZlX2FkZChkLCBUMSk7IGQgPSBjOyBjID0gYjsgYiA9IGE7IGEgPSBzYWZlX2FkZChUMSwgVDIpO1xuICAgIH1cbiAgICBIQVNIWzBdID0gc2FmZV9hZGQoYSwgSEFTSFswXSk7IEhBU0hbMV0gPSBzYWZlX2FkZChiLCBIQVNIWzFdKTsgSEFTSFsyXSA9IHNhZmVfYWRkKGMsIEhBU0hbMl0pOyBIQVNIWzNdID0gc2FmZV9hZGQoZCwgSEFTSFszXSk7XG4gICAgSEFTSFs0XSA9IHNhZmVfYWRkKGUsIEhBU0hbNF0pOyBIQVNIWzVdID0gc2FmZV9hZGQoZiwgSEFTSFs1XSk7IEhBU0hbNl0gPSBzYWZlX2FkZChnLCBIQVNIWzZdKTsgSEFTSFs3XSA9IHNhZmVfYWRkKGgsIEhBU0hbN10pO1xuICB9XG4gIHJldHVybiBIQVNIO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzaGEyNTYoYnVmKSB7XG4gIHJldHVybiBoZWxwZXJzLmhhc2goYnVmLCBjb3JlX3NoYTI1NiwgMzIsIHRydWUpO1xufTtcbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLyogVGhpcyBTb3VyY2UgQ29kZSBGb3JtIGlzIHN1YmplY3QgdG8gdGhlIHRlcm1zIG9mIHRoZSBNb3ppbGxhIFB1YmxpY1xuICogTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpc1xuICogZmlsZSwgWW91IGNhbiBvYnRhaW4gb25lIGF0IGh0dHA6Ly9tb3ppbGxhLm9yZy9NUEwvMi4wLy4gKi9cblxudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5mdW5jdGlvbiBuZXh0KCkge1xuICByZXR1cm4gXCJAQHN5bWJvbDpcIiArIGNyeXB0by5yYW5kb21CeXRlcyg4KS50b1N0cmluZygnaGV4Jyk7XG59XG5cblxuZnVuY3Rpb24gU3ltYm9sKGRlc2MpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFN5bWJvbCkpIHtcbiAgICByZXR1cm4gbmV3IFN5bWJvbChkZXNjKTtcbiAgfVxuICB2YXIgX3N5bWJvbCA9IHRoaXMuX3N5bWJvbCA9IG5leHQoKTtcbiAgZGVmaW5lUHJvcGVydHkodGhpcywgJ19kZXNjJywge1xuICAgIHZhbHVlOiBkZXNjLFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gIH0pO1xuICBkZWZpbmVQcm9wZXJ0eShPYmplY3QucHJvdG90eXBlLCBfc3ltYm9sLCB7XG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgZGVmaW5lUHJvcGVydHkodGhpcywgX3N5bWJvbCwge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cblxuU3ltYm9sLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gdGhpcy5fc3ltYm9sO1xufTtcblxudmFyIGdsb2JhbFN5bWJvbFJlZ2lzdHJ5ID0ge307XG5TeW1ib2wuZm9yID0gZnVuY3Rpb24gc3ltYm9sRm9yKGtleSkge1xuICBrZXkgPSBTdHJpbmcoa2V5KTtcbiAgcmV0dXJuIGdsb2JhbFN5bWJvbFJlZ2lzdHJ5W2tleV0gfHwgKGdsb2JhbFN5bWJvbFJlZ2lzdHJ5W2tleV0gPSBTeW1ib2woa2V5KSk7XG59O1xuXG5TeW1ib2wua2V5Rm9yID0gZnVuY3Rpb24ga2V5Rm9yKHN5bSkge1xuICBpZiAoIShzeW0gaW5zdGFuY2VvZiBTeW1ib2wpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5rZXlGb3IgcmVxdWlyZXMgYSBTeW1ib2wgYXJndW1lbnRcIik7XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIGdsb2JhbFN5bWJvbFJlZ2lzdHJ5KSB7XG4gICAgaWYgKGdsb2JhbFN5bWJvbFJlZ2lzdHJ5W2tleV0gPT09IHN5bSkge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdGhpcy5TeW1ib2wgfHwgU3ltYm9sO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kO1xuZnVuY3Rpb24gZXh0ZW5kKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgdHlwZW9mIGFkZCAhPT0gJ29iamVjdCcpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgR3JhbW1hckRlY2wgPSByZXF1aXJlKCcuL0dyYW1tYXJEZWNsJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIEJ1aWxkZXIoKSB7fVxuXG5CdWlsZGVyLnByb3RvdHlwZSA9IHtcbiAgbmV3R3JhbW1hcjogZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiBuZXcgR3JhbW1hckRlY2wobmFtZSk7XG4gIH0sXG5cbiAgYW55dGhpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBwZXhwcnMuYW55dGhpbmc7XG4gIH0sXG5cbiAgZW5kOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcGV4cHJzLmVuZDtcbiAgfSxcblxuICBwcmltOiBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHBleHBycy5tYWtlUHJpbSh4KTtcbiAgfSxcblxuICByYW5nZTogZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgICByZXR1cm4gbmV3IHBleHBycy5SYW5nZShmcm9tLCB0byk7XG4gIH0sXG5cbiAgcGFyYW06IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuUGFyYW0oaW5kZXgpO1xuICB9LFxuXG4gIGFsdDogZnVuY3Rpb24oLyogdGVybTEsIHRlcm0xLCAuLi4gKi8pIHtcbiAgICB2YXIgdGVybXMgPSBbXTtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcmd1bWVudHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1tpZHhdO1xuICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIHBleHBycy5BbHQpIHtcbiAgICAgICAgdGVybXMgPSB0ZXJtcy5jb25jYXQoYXJnLnRlcm1zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRlcm1zLnB1c2goYXJnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRlcm1zLmxlbmd0aCA9PT0gMSA/IHRlcm1zWzBdIDogbmV3IHBleHBycy5BbHQodGVybXMpO1xuICB9LFxuXG4gIHNlcTogZnVuY3Rpb24oLyogZmFjdG9yMSwgZmFjdG9yMiwgLi4uICovKSB7XG4gICAgdmFyIGZhY3RvcnMgPSBbXTtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcmd1bWVudHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1tpZHhdO1xuICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIHBleHBycy5TZXEpIHtcbiAgICAgICAgZmFjdG9ycyA9IGZhY3RvcnMuY29uY2F0KGFyZy5mYWN0b3JzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZhY3RvcnMucHVzaChhcmcpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFjdG9ycy5sZW5ndGggPT09IDEgPyBmYWN0b3JzWzBdIDogbmV3IHBleHBycy5TZXEoZmFjdG9ycyk7XG4gIH0sXG5cbiAgc3RhcjogZnVuY3Rpb24oZXhwcikge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLlN0YXIoZXhwcik7XG4gIH0sXG5cbiAgcGx1czogZnVuY3Rpb24oZXhwcikge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLlBsdXMoZXhwcik7XG4gIH0sXG5cbiAgb3B0OiBmdW5jdGlvbihleHByKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuT3B0KGV4cHIpO1xuICB9LFxuXG4gIG5vdDogZnVuY3Rpb24oZXhwcikge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLk5vdChleHByKTtcbiAgfSxcblxuICBsYTogZnVuY3Rpb24oZXhwcikge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLkxvb2thaGVhZChleHByKTtcbiAgfSxcblxuICBsZXg6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICByZXR1cm4gbmV3IHBleHBycy5MZXgoZXhwcik7XG4gIH0sXG5cbiAgYXJyOiBmdW5jdGlvbihleHByKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuQXJyKGV4cHIpO1xuICB9LFxuXG4gIHN0cjogZnVuY3Rpb24oZXhwcikge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLlN0cihleHByKTtcbiAgfSxcblxuICBvYmo6IGZ1bmN0aW9uKHByb3BlcnRpZXMsIGlzTGVuaWVudCkge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLk9iaihwcm9wZXJ0aWVzLCAhIWlzTGVuaWVudCk7XG4gIH0sXG5cbiAgYXBwOiBmdW5jdGlvbihydWxlTmFtZSwgb3B0UGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuQXBwbHkocnVsZU5hbWUsIG9wdFBhcmFtcyk7XG4gIH1cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1aWxkZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgSW5wdXRTdHJlYW0gPSByZXF1aXJlKCcuL0lucHV0U3RyZWFtJyk7XG52YXIgSW50ZXJ2YWwgPSByZXF1aXJlKCcuL0ludGVydmFsJyk7XG52YXIgTWF0Y2hSZXN1bHQgPSByZXF1aXJlKCcuL01hdGNoUmVzdWx0Jyk7XG52YXIgU2VtYW50aWNzID0gcmVxdWlyZSgnLi9TZW1hbnRpY3MnKTtcbnZhciBTdGF0ZSA9IHJlcXVpcmUoJy4vU3RhdGUnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgbm9kZXMgPSByZXF1aXJlKCcuL25vZGVzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIEdyYW1tYXIobmFtZSwgc3VwZXJHcmFtbWFyLCBydWxlRGljdCwgb3B0RGVmYXVsdFN0YXJ0UnVsZSkge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbiAgdGhpcy5ydWxlRGljdCA9IHJ1bGVEaWN0O1xuICBpZiAob3B0RGVmYXVsdFN0YXJ0UnVsZSkge1xuICAgIGlmICghKG9wdERlZmF1bHRTdGFydFJ1bGUgaW4gcnVsZURpY3QpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHN0YXJ0IHJ1bGU6ICdcIiArIG9wdERlZmF1bHRTdGFydFJ1bGUgK1xuICAgICAgICAgICAgICAgICAgICAgIFwiJyBpcyBub3QgYSBydWxlIGluIGdyYW1tYXIgJ1wiICsgbmFtZSArIFwiJ1wiKTtcbiAgICB9XG4gICAgdGhpcy5kZWZhdWx0U3RhcnRSdWxlID0gb3B0RGVmYXVsdFN0YXJ0UnVsZTtcbiAgfVxuICB0aGlzLmNvbnN0cnVjdG9ycyA9IHRoaXMuY3RvcnMgPSB0aGlzLmNyZWF0ZUNvbnN0cnVjdG9ycygpO1xufVxuXG5HcmFtbWFyLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0OiBmdW5jdGlvbihydWxlTmFtZSwgY2hpbGRyZW4pIHtcbiAgICB2YXIgYm9keSA9IHRoaXMucnVsZURpY3RbcnVsZU5hbWVdO1xuICAgIGlmICghYm9keSB8fCAhYm9keS5jaGVjayh0aGlzLCBjaGlsZHJlbikgfHwgY2hpbGRyZW4ubGVuZ3RoICE9PSBib2R5LmdldEFyaXR5KCkpIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuSW52YWxpZENvbnN0cnVjdG9yQ2FsbCh0aGlzLCBydWxlTmFtZSwgY2hpbGRyZW4pO1xuICAgIH1cbiAgICB2YXIgaW50ZXJ2YWwgPSBuZXcgSW50ZXJ2YWwoSW5wdXRTdHJlYW0ubmV3Rm9yKGNoaWxkcmVuKSwgMCwgY2hpbGRyZW4ubGVuZ3RoKTtcbiAgICByZXR1cm4gbmV3IG5vZGVzLk5vZGUodGhpcywgcnVsZU5hbWUsIGNoaWxkcmVuLCBpbnRlcnZhbCk7XG4gIH0sXG5cbiAgY3JlYXRlQ29uc3RydWN0b3JzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGNvbnN0cnVjdG9ycyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gbWFrZUNvbnN0cnVjdG9yKHJ1bGVOYW1lKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oLyogdmFsMSwgdmFsMiwgLi4uICovKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmNvbnN0cnVjdChydWxlTmFtZSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZvciAodmFyIHJ1bGVOYW1lIGluIHRoaXMucnVsZURpY3QpIHtcbiAgICAgIC8vIFdlIHdhbnQgKmFsbCogcHJvcGVydGllcywgbm90IGp1c3Qgb3duIHByb3BlcnRpZXMsIGJlY2F1c2Ugb2ZcbiAgICAgIC8vIHN1cGVyZ3JhbW1hcnMuXG4gICAgICBjb25zdHJ1Y3RvcnNbcnVsZU5hbWVdID0gbWFrZUNvbnN0cnVjdG9yKHJ1bGVOYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnN0cnVjdG9ycztcbiAgfSxcblxuICAvLyBSZXR1cm4gdHJ1ZSBpZiB0aGUgZ3JhbW1hciBpcyBhIGJ1aWx0LWluIGdyYW1tYXIsIG90aGVyd2lzZSBmYWxzZS5cbiAgLy8gTk9URTogVGhpcyBtaWdodCBnaXZlIGFuIHVuZXhwZWN0ZWQgcmVzdWx0IGlmIGNhbGxlZCBiZWZvcmUgQnVpbHRJblJ1bGVzIGlzIGRlZmluZWQhXG4gIGlzQnVpbHRJbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMgPT09IEdyYW1tYXIuUHJvdG9CdWlsdEluUnVsZXMgfHwgdGhpcyA9PT0gR3JhbW1hci5CdWlsdEluUnVsZXM7XG4gIH0sXG5cbiAgbWF0Y2g6IGZ1bmN0aW9uKG9iaiwgb3B0U3RhcnRSdWxlKSB7XG4gICAgdmFyIHN0YXJ0UnVsZSA9IG9wdFN0YXJ0UnVsZSB8fCB0aGlzLmRlZmF1bHRTdGFydFJ1bGU7XG4gICAgaWYgKCFzdGFydFJ1bGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBzdGFydCBydWxlIGFyZ3VtZW50IC0tIHRoZSBncmFtbWFyIGhhcyBubyBkZWZhdWx0IHN0YXJ0IHJ1bGUuJyk7XG4gICAgfVxuICAgIHZhciBzdGF0ZSA9IHRoaXMuX21hdGNoKG9iaiwgc3RhcnRSdWxlLCBmYWxzZSk7XG4gICAgcmV0dXJuIE1hdGNoUmVzdWx0Lm5ld0ZvcihzdGF0ZSk7XG4gIH0sXG5cbiAgX21hdGNoOiBmdW5jdGlvbihvYmosIHN0YXJ0UnVsZSwgdHJhY2luZ0VuYWJsZWQpIHtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBJbnB1dFN0cmVhbS5uZXdGb3IodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycgPyBvYmogOiBbb2JqXSk7XG4gICAgdmFyIHN0YXRlID0gbmV3IFN0YXRlKHRoaXMsIGlucHV0U3RyZWFtLCBzdGFydFJ1bGUsIHRyYWNpbmdFbmFibGVkKTtcbiAgICB2YXIgc3VjY2VlZGVkID0gbmV3IHBleHBycy5BcHBseShzdGFydFJ1bGUpLmV2YWwoc3RhdGUpO1xuICAgIGlmIChzdWNjZWVkZWQpIHtcbiAgICAgIC8vIExpbmsgZXZlcnkgQ1NUTm9kZSB0byBpdHMgcGFyZW50LlxuICAgICAgdmFyIHN0YWNrID0gW3VuZGVmaW5lZF07XG4gICAgICB2YXIgaGVscGVycyA9IHRoaXMuc2VtYW50aWNzKCkuYWRkT3BlcmF0aW9uKCdzZXRQYXJlbnRzJywge1xuICAgICAgICBfdGVybWluYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMuX25vZGUucGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgIH0sXG4gICAgICAgIF9pdGVyOiBmdW5jdGlvbihjaGlsZHJlbikge1xuICAgICAgICAgIHN0YWNrLnB1c2godGhpcy5fbm9kZSk7XG4gICAgICAgICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkgeyBjaGlsZC5zZXRQYXJlbnRzKCk7IH0pO1xuICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgIHRoaXMuX25vZGUucGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgIH0sXG4gICAgICAgIF9kZWZhdWx0OiBmdW5jdGlvbihjaGlsZHJlbikge1xuICAgICAgICAgIHN0YWNrLnB1c2godGhpcy5fbm9kZSk7XG4gICAgICAgICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkgeyBjaGlsZC5zZXRQYXJlbnRzKCk7IH0pO1xuICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgIHRoaXMuX25vZGUucGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaGVscGVycyhNYXRjaFJlc3VsdC5uZXdGb3Ioc3RhdGUpKS5zZXRQYXJlbnRzKCk7XG4gICAgfVxuICAgIHJldHVybiBzdGF0ZTtcbiAgfSxcblxuICB0cmFjZTogZnVuY3Rpb24ob2JqLCBvcHRTdGFydFJ1bGUpIHtcbiAgICB2YXIgc3RhcnRSdWxlID0gb3B0U3RhcnRSdWxlIHx8IHRoaXMuZGVmYXVsdFN0YXJ0UnVsZTtcbiAgICBpZiAoIXN0YXJ0UnVsZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHN0YXJ0IHJ1bGUgYXJndW1lbnQgLS0gdGhlIGdyYW1tYXIgaGFzIG5vIGRlZmF1bHQgc3RhcnQgcnVsZS4nKTtcbiAgICB9XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fbWF0Y2gob2JqLCBzdGFydFJ1bGUsIHRydWUpO1xuXG4gICAgdmFyIHJvb3RUcmFjZSA9IHN0YXRlLnRyYWNlWzBdO1xuICAgIHJvb3RUcmFjZS5zdGF0ZSA9IHN0YXRlO1xuICAgIHJvb3RUcmFjZS5yZXN1bHQgPSBNYXRjaFJlc3VsdC5uZXdGb3Ioc3RhdGUpO1xuICAgIHJldHVybiByb290VHJhY2U7XG4gIH0sXG5cbiAgc2VtYW50aWNzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gU2VtYW50aWNzLmNyZWF0ZVNlbWFudGljcyh0aGlzKTtcbiAgfSxcblxuICBleHRlbmRTZW1hbnRpY3M6IGZ1bmN0aW9uKHN1cGVyU2VtYW50aWNzKSB7XG4gICAgcmV0dXJuIFNlbWFudGljcy5jcmVhdGVTZW1hbnRpY3ModGhpcywgc3VwZXJTZW1hbnRpY3MuX2dldFNlbWFudGljcygpKTtcbiAgfSxcblxuICAvLyBDaGVjayB0aGF0IGV2ZXJ5IGtleSBpbiBgYWN0aW9uRGljdGAgY29ycmVzcG9uZHMgdG8gYSBzZW1hbnRpYyBhY3Rpb24sIGFuZCB0aGF0IGl0IG1hcHMgdG9cbiAgLy8gYSBmdW5jdGlvbiBvZiB0aGUgY29ycmVjdCBhcml0eS4gSWYgbm90LCB0aHJvdyBhbiBleGNlcHRpb24uXG4gIF9jaGVja1RvcERvd25BY3Rpb25EaWN0OiBmdW5jdGlvbih3aGF0LCBuYW1lLCBhY3Rpb25EaWN0KSB7XG4gICAgZnVuY3Rpb24gaXNTcGVjaWFsQWN0aW9uKG5hbWUpIHtcbiAgICAgIHJldHVybiBuYW1lID09PSAnX3Rlcm1pbmFsJyB8fCBuYW1lID09PSAnX2l0ZXInIHx8IG5hbWUgPT09ICdfZGVmYXVsdCc7XG4gICAgfVxuXG4gICAgdmFyIHByb2JsZW1zID0gW107XG4gICAgZm9yICh2YXIgayBpbiBhY3Rpb25EaWN0KSB7XG4gICAgICB2YXIgdiA9IGFjdGlvbkRpY3Rba107XG4gICAgICBpZiAoIWlzU3BlY2lhbEFjdGlvbihrKSAmJiAhKGsgaW4gdGhpcy5ydWxlRGljdCkpIHtcbiAgICAgICAgcHJvYmxlbXMucHVzaChcIidcIiArIGsgKyBcIicgaXMgbm90IGEgdmFsaWQgc2VtYW50aWMgYWN0aW9uIGZvciAnXCIgKyB0aGlzLm5hbWUgKyBcIidcIik7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHByb2JsZW1zLnB1c2goXG4gICAgICAgICAgICBcIidcIiArIGsgKyBcIicgbXVzdCBiZSBhIGZ1bmN0aW9uIGluIGFuIGFjdGlvbiBkaWN0aW9uYXJ5IGZvciAnXCIgKyB0aGlzLm5hbWUgKyBcIidcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgYWN0dWFsID0gdi5sZW5ndGg7XG4gICAgICAgIHZhciBleHBlY3RlZCA9IHRoaXMuX3RvcERvd25BY3Rpb25Bcml0eShrKTtcbiAgICAgICAgaWYgKGFjdHVhbCAhPT0gZXhwZWN0ZWQpIHtcbiAgICAgICAgICBwcm9ibGVtcy5wdXNoKFxuICAgICAgICAgICAgICBcIlNlbWFudGljIGFjdGlvbiAnXCIgKyBrICsgXCInIGhhcyB0aGUgd3JvbmcgYXJpdHk6IFwiICtcbiAgICAgICAgICAgICAgJ2V4cGVjdGVkICcgKyBleHBlY3RlZCArICcsIGdvdCAnICsgYWN0dWFsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJvYmxlbXMubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIHByZXR0eVByb2JsZW1zID0gcHJvYmxlbXMubWFwKGZ1bmN0aW9uKHByb2JsZW0pIHsgcmV0dXJuICctICcgKyBwcm9ibGVtOyB9KTtcbiAgICAgIHZhciBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgICBcIkZvdW5kIGVycm9ycyBpbiB0aGUgYWN0aW9uIGRpY3Rpb25hcnkgb2YgdGhlICdcIiArIG5hbWUgKyBcIicgXCIgKyB3aGF0ICsgJzpcXG4nICtcbiAgICAgICAgICBwcmV0dHlQcm9ibGVtcy5qb2luKCdcXG4nKSk7XG4gICAgICBlcnJvci5wcm9ibGVtcyA9IHByb2JsZW1zO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9LFxuXG4gIC8vIFJldHVybiB0aGUgZXhwZWN0ZWQgYXJpdHkgZm9yIGEgc2VtYW50aWMgYWN0aW9uIG5hbWVkIGBhY3Rpb25OYW1lYCwgd2hpY2hcbiAgLy8gaXMgZWl0aGVyIGEgcnVsZSBuYW1lIG9yIGEgc3BlY2lhbCBhY3Rpb24gbmFtZSBsaWtlICdfZGVmYXVsdCcuXG4gIF90b3BEb3duQWN0aW9uQXJpdHk6IGZ1bmN0aW9uKGFjdGlvbk5hbWUpIHtcbiAgICBpZiAoYWN0aW9uTmFtZSA9PT0gJ19kZWZhdWx0JyB8fCBhY3Rpb25OYW1lID09PSAnX2l0ZXInKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2UgaWYgKGFjdGlvbk5hbWUgPT09ICdfdGVybWluYWwnKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucnVsZURpY3RbYWN0aW9uTmFtZV0uZ2V0QXJpdHkoKTtcbiAgfSxcblxuICBfaW5oZXJpdHNGcm9tOiBmdW5jdGlvbihncmFtbWFyKSB7XG4gICAgdmFyIGcgPSB0aGlzLnN1cGVyR3JhbW1hcjtcbiAgICB3aGlsZSAoZykge1xuICAgICAgaWYgKGcgPT09IGdyYW1tYXIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBnID0gZy5zdXBlckdyYW1tYXI7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICB0b1JlY2lwZTogZnVuY3Rpb24ob3B0VmFyTmFtZSkge1xuICAgIGlmICh0aGlzLmlzQnVpbHRJbigpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ1doeSB3b3VsZCBhbnlvbmUgd2FudCB0byBnZW5lcmF0ZSBhIHJlY2lwZSBmb3IgdGhlICcgKyB0aGlzLm5hbWUgKyAnIGdyYW1tYXI/IT8hJyk7XG4gICAgfVxuXG4gICAgdmFyIHNiID0gbmV3IGNvbW1vbi5TdHJpbmdCdWZmZXIoKTtcbiAgICBpZiAob3B0VmFyTmFtZSkge1xuICAgICAgc2IuYXBwZW5kKCd2YXIgJyArIG9wdFZhck5hbWUgKyAnID0gJyk7XG4gICAgfVxuICAgIHNiLmFwcGVuZCgnKGZ1bmN0aW9uKCkge1xcbicpO1xuXG4gICAgLy8gSW5jbHVkZSB0aGUgc3VwZXJncmFtbWFyIGluIHRoZSByZWNpcGUgaWYgaXQncyBub3QgYSBidWlsdC1pbiBncmFtbWFyLlxuICAgIHZhciBzdXBlckdyYW1tYXJEZWNsID0gJyc7XG4gICAgaWYgKCF0aGlzLnN1cGVyR3JhbW1hci5pc0J1aWx0SW4oKSkge1xuICAgICAgc2IuYXBwZW5kKHRoaXMuc3VwZXJHcmFtbWFyLnRvUmVjaXBlKCdidWlsZFN1cGVyR3JhbW1hcicpKTtcbiAgICAgIHN1cGVyR3JhbW1hckRlY2wgPSAnICAgIC53aXRoU3VwZXJHcmFtbWFyKGJ1aWxkU3VwZXJHcmFtbWFyLmNhbGwodGhpcykpXFxuJztcbiAgICB9XG4gICAgc2IuYXBwZW5kKCcgIHJldHVybiBuZXcgdGhpcy5uZXdHcmFtbWFyKCcgKyBKU09OLnN0cmluZ2lmeSh0aGlzLm5hbWUpICsgJylcXG4nKTtcbiAgICBzYi5hcHBlbmQoc3VwZXJHcmFtbWFyRGVjbCk7XG5cbiAgICBpZiAodGhpcy5kZWZhdWx0U3RhcnRSdWxlKSB7XG4gICAgICBzYi5hcHBlbmQoXCIgICAgLndpdGhEZWZhdWx0U3RhcnRSdWxlKCdcIiArIHRoaXMuZGVmYXVsdFN0YXJ0UnVsZSArIFwiJylcXG5cIik7XG4gICAgfVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE9iamVjdC5rZXlzKHRoaXMucnVsZURpY3QpLmZvckVhY2goZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICAgIHZhciBib2R5ID0gc2VsZi5ydWxlRGljdFtydWxlTmFtZV07XG4gICAgICBzYi5hcHBlbmQoJyAgICAuJyk7XG4gICAgICBpZiAoc2VsZi5zdXBlckdyYW1tYXIucnVsZURpY3RbcnVsZU5hbWVdKSB7XG4gICAgICAgIHNiLmFwcGVuZChib2R5IGluc3RhbmNlb2YgcGV4cHJzLkV4dGVuZCA/ICdleHRlbmQnIDogJ292ZXJyaWRlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzYi5hcHBlbmQoJ2RlZmluZScpO1xuICAgICAgfVxuICAgICAgdmFyIGZvcm1hbHMgPSAnWycgKyBib2R5LmZvcm1hbHMubWFwKEpTT04uc3RyaW5naWZ5KS5qb2luKCcsICcpICsgJ10nO1xuICAgICAgc2IuYXBwZW5kKCcoJyArIEpTT04uc3RyaW5naWZ5KHJ1bGVOYW1lKSArICcsICcgKyBmb3JtYWxzICsgJywgJyk7XG4gICAgICBib2R5Lm91dHB1dFJlY2lwZShzYiwgYm9keS5mb3JtYWxzKTtcbiAgICAgIGlmIChib2R5LmRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHNiLmFwcGVuZCgnLCAnICsgSlNPTi5zdHJpbmdpZnkoYm9keS5kZXNjcmlwdGlvbikpO1xuICAgICAgfVxuICAgICAgc2IuYXBwZW5kKCcpXFxuJyk7XG4gICAgfSk7XG4gICAgc2IuYXBwZW5kKCcgICAgLmJ1aWxkKCk7XFxufSk7XFxuJyk7XG4gICAgcmV0dXJuIHNiLmNvbnRlbnRzKCk7XG4gIH0sXG5cbiAgLy8gVE9ETzogQ29tZSB1cCB3aXRoIGJldHRlciBuYW1lcyBmb3IgdGhlc2UgbWV0aG9kcy5cbiAgLy8gVE9ETzogV3JpdGUgdGhlIGFuYWxvZyBvZiB0aGVzZSBtZXRob2RzIGZvciBpbmhlcml0ZWQgYXR0cmlidXRlcy5cbiAgdG9PcGVyYXRpb25BY3Rpb25EaWN0aW9uYXJ5VGVtcGxhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl90b09wZXJhdGlvbk9yQXR0cmlidXRlQWN0aW9uRGljdGlvbmFyeVRlbXBsYXRlKCk7XG4gIH0sXG4gIHRvQXR0cmlidXRlQWN0aW9uRGljdGlvbmFyeVRlbXBsYXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fdG9PcGVyYXRpb25PckF0dHJpYnV0ZUFjdGlvbkRpY3Rpb25hcnlUZW1wbGF0ZSgpO1xuICB9LFxuXG4gIF90b09wZXJhdGlvbk9yQXR0cmlidXRlQWN0aW9uRGljdGlvbmFyeVRlbXBsYXRlOiBmdW5jdGlvbigpIHtcbiAgICAvLyBUT0RPOiBhZGQgdGhlIHN1cGVyLWdyYW1tYXIncyB0ZW1wbGF0ZXMgYXQgdGhlIHJpZ2h0IHBsYWNlLCBlLmcuLCBhIGNhc2UgZm9yIEFkZEV4cHJfcGx1c1xuICAgIC8vIHNob3VsZCBhcHBlYXIgbmV4dCB0byBvdGhlciBjYXNlcyBvZiBBZGRFeHByLlxuXG4gICAgdmFyIHNiID0gbmV3IGNvbW1vbi5TdHJpbmdCdWZmZXIoKTtcbiAgICBzYi5hcHBlbmQoJ3snKTtcblxuICAgIHZhciBmaXJzdCA9IHRydWU7XG4gICAgZm9yICh2YXIgcnVsZU5hbWUgaW4gdGhpcy5ydWxlRGljdCkge1xuICAgICAgaWYgKHJ1bGVOYW1lID09PSAnc3BhY2VzXycpIHtcbiAgICAgICAgLy8gVGhpcyBydWxlIGlzIG5vdCBmb3IgdGhlIHVzZXIsIGl0J3MgbW9yZSBvZiBhbiBpbXBsZW1lbnRhdGlvbiBkZXRhaWwgb2Ygc3ludGFjdGljIHJ1bGVzLlxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHZhciBib2R5ID0gdGhpcy5ydWxlRGljdFtydWxlTmFtZV07XG4gICAgICBpZiAoZmlyc3QpIHtcbiAgICAgICAgZmlyc3QgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNiLmFwcGVuZCgnLCcpO1xuICAgICAgfVxuICAgICAgc2IuYXBwZW5kKCdcXG4nKTtcbiAgICAgIHNiLmFwcGVuZCgnICAnKTtcbiAgICAgIHRoaXMuYWRkU2VtYW50aWNBY3Rpb25UZW1wbGF0ZShydWxlTmFtZSwgYm9keSwgc2IpO1xuICAgIH1cblxuICAgIHNiLmFwcGVuZCgnXFxufScpO1xuICAgIHJldHVybiBzYi5jb250ZW50cygpO1xuICB9LFxuXG4gIGFkZFNlbWFudGljQWN0aW9uVGVtcGxhdGU6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5LCBzYikge1xuICAgIHNiLmFwcGVuZChydWxlTmFtZSk7XG4gICAgc2IuYXBwZW5kKCc6IGZ1bmN0aW9uKCcpO1xuICAgIHZhciBhcml0eSA9IHRoaXMuX3RvcERvd25BY3Rpb25Bcml0eShydWxlTmFtZSk7XG4gICAgc2IuYXBwZW5kKGNvbW1vbi5yZXBlYXQoJ18nLCBhcml0eSkuam9pbignLCAnKSk7XG4gICAgc2IuYXBwZW5kKCcpIHtcXG4nKTtcbiAgICBzYi5hcHBlbmQoJyAgfScpO1xuICB9XG59O1xuXG4vLyBUaGUgZm9sbG93aW5nIGdyYW1tYXIgY29udGFpbnMgYSBmZXcgcnVsZXMgdGhhdCBjb3VsZG4ndCBiZSB3cml0dGVuICBpbiBcInVzZXJsYW5kXCIuXG4vLyBBdCB0aGUgYm90dG9tIG9mIHNyYy9tYWluLmpzLCB3ZSBjcmVhdGUgYSBzdWItZ3JhbW1hciBvZiB0aGlzIGdyYW1tYXIgdGhhdCdzIGNhbGxlZFxuLy8gYEJ1aWx0SW5SdWxlc2AuIFRoYXQgZ3JhbW1hciBjb250YWlucyBzZXZlcmFsIGNvbnZlbmllbmNlIHJ1bGVzLCBlLmcuLCBgbGV0dGVyYCBhbmRcbi8vIGBkaWdpdGAsIGFuZCBpcyBpbXBsaWNpdGx5IHRoZSBzdXBlci1ncmFtbWFyIG9mIGFueSBncmFtbWFyIHdob3NlIHN1cGVyLWdyYW1tYXJcbi8vIGlzbid0IHNwZWNpZmllZC5cbkdyYW1tYXIuUHJvdG9CdWlsdEluUnVsZXMgPSBuZXcgR3JhbW1hcignUHJvdG9CdWlsdEluUnVsZXMnLCB1bmRlZmluZWQsIHtcbiAgLy8gVGhlIGZvbGxvd2luZyBydWxlcyBjYW4ndCBiZSB3cml0dGVuIGluIHVzZXJsYW5kIGJlY2F1c2UgdGhleSByZWZlcmVuY2VcbiAgLy8gYGFueXRoaW5nYCBhbmQgYGVuZGAgZGlyZWN0bHkuXG4gIF86IHBleHBycy5hbnl0aGluZy53aXRoRm9ybWFscyhbXSksXG4gIGVuZDogcGV4cHJzLmVuZC53aXRoRm9ybWFscyhbXSksXG5cbiAgLy8gVGhlIGZvbGxvd2luZyBydWxlIGlzIHBhcnQgb2YgdGhlIE9obSBpbXBsZW1lbnRhdGlvbi4gSXRzIG5hbWUgZW5kcyB3aXRoICdfJyB0b1xuICAvLyBkaXNjb3VyYWdlIHByb2dyYW1tZXJzIGZyb20gaW52b2tpbmcsIGV4dGVuZGluZywgYW5kIG92ZXJyaWRpbmcgaXQuXG4gIHNwYWNlc186IG5ldyBwZXhwcnMuU3RhcihuZXcgcGV4cHJzLkFwcGx5KCdzcGFjZScpKS53aXRoRm9ybWFscyhbXSksXG5cbiAgLy8gVGhlIGBzcGFjZWAgcnVsZSBtdXN0IGJlIGRlZmluZWQgaGVyZSBiZWNhdXNlIGl0J3MgcmVmZXJlbmNlZCBieSBgc3BhY2VzX2AuXG4gIHNwYWNlOiBuZXcgcGV4cHJzLlJhbmdlKCdcXHgwMCcsICcgJykud2l0aEZvcm1hbHMoW10pLndpdGhEZXNjcmlwdGlvbignYSBzcGFjZScpXG59KTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gR3JhbW1hcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBHcmFtbWFyID0gcmVxdWlyZSgnLi9HcmFtbWFyJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIFN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBDb25zdHJ1Y3RvcnNcblxuZnVuY3Rpb24gR3JhbW1hckRlY2wobmFtZSkge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xufVxuXG4vLyBIZWxwZXJzXG5cbmZ1bmN0aW9uIG9uT2htRXJyb3IoZG9Gbiwgb25FcnJvckZuKSB7XG4gIHRyeSB7XG4gICAgZG9GbigpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGUgaW5zdGFuY2VvZiBlcnJvcnMuRXJyb3IpIHtcbiAgICAgIG9uRXJyb3JGbihlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH1cbn1cblxuR3JhbW1hckRlY2wucHJvdG90eXBlLmVuc3VyZVN1cGVyR3JhbW1hciA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuc3VwZXJHcmFtbWFyKSB7XG4gICAgdGhpcy53aXRoU3VwZXJHcmFtbWFyKFxuICAgICAgICAvLyBUT0RPOiBUaGUgY29uZGl0aW9uYWwgZXhwcmVzc2lvbiBiZWxvdyBpcyBhbiB1Z2x5IGhhY2suIEl0J3Mga2luZCBvZiBvayBiZWNhdXNlXG4gICAgICAgIC8vIEkgZG91YnQgYW55b25lIHdpbGwgZXZlciB0cnkgdG8gZGVjbGFyZSBhIGdyYW1tYXIgY2FsbGVkIGBCdWlsdEluUnVsZXNgLiBTdGlsbCxcbiAgICAgICAgLy8gd2Ugc2hvdWxkIHRyeSB0byBmaW5kIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzLlxuICAgICAgICB0aGlzLm5hbWUgPT09ICdCdWlsdEluUnVsZXMnID9cbiAgICAgICAgICAgIEdyYW1tYXIuUHJvdG9CdWlsdEluUnVsZXMgOlxuICAgICAgICAgICAgR3JhbW1hci5CdWlsdEluUnVsZXMpO1xuICB9XG4gIHJldHVybiB0aGlzLnN1cGVyR3JhbW1hcjtcbn07XG5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5pbnN0YWxsT3ZlcnJpZGRlbk9yRXh0ZW5kZWRSdWxlID0gZnVuY3Rpb24obmFtZSwgZm9ybWFscywgYm9keSkge1xuICB2YXIgZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMgPSBjb21tb24uZ2V0RHVwbGljYXRlcyhmb3JtYWxzKTtcbiAgaWYgKGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzKG5hbWUsIGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzLCBib2R5KTtcbiAgfVxuICB2YXIgYmFzZVJ1bGUgPSB0aGlzLmVuc3VyZVN1cGVyR3JhbW1hcigpLnJ1bGVEaWN0W25hbWVdO1xuICBpZiAoZm9ybWFscy5sZW5ndGggIT09IGJhc2VSdWxlLmZvcm1hbHMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5Xcm9uZ051bWJlck9mUGFyYW1ldGVycyhuYW1lLCBiYXNlUnVsZS5mb3JtYWxzLmxlbmd0aCwgZm9ybWFscy5sZW5ndGgsIGJvZHkpO1xuICB9XG4gIHJldHVybiB0aGlzLmluc3RhbGwobmFtZSwgZm9ybWFscywgYmFzZVJ1bGUuZGVzY3JpcHRpb24sIGJvZHkpO1xufTtcblxuR3JhbW1hckRlY2wucHJvdG90eXBlLmluc3RhbGwgPSBmdW5jdGlvbihuYW1lLCBmb3JtYWxzLCBkZXNjcmlwdGlvbiwgYm9keSkge1xuICBib2R5ID0gYm9keS5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gIGJvZHkuZm9ybWFscyA9IGZvcm1hbHM7XG4gIGJvZHkuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgdGhpcy5ydWxlRGljdFtuYW1lXSA9IGJvZHk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gU3R1ZmYgdGhhdCB5b3Ugc2hvdWxkIG9ubHkgZG8gb25jZVxuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUud2l0aFN1cGVyR3JhbW1hciA9IGZ1bmN0aW9uKHN1cGVyR3JhbW1hcikge1xuICBpZiAodGhpcy5zdXBlckdyYW1tYXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3RoZSBzdXBlciBncmFtbWFyIG9mIGEgR3JhbW1hckRlY2wgY2Fubm90IGJlIHNldCBtb3JlIHRoYW4gb25jZScpO1xuICB9XG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyO1xuICB0aGlzLnJ1bGVEaWN0ID0gT2JqZWN0LmNyZWF0ZShzdXBlckdyYW1tYXIucnVsZURpY3QpO1xuXG4gIC8vIEdyYW1tYXJzIHdpdGggYW4gZXhwbGljaXQgc3VwZXJncmFtbWFyIGluaGVyaXQgYSBkZWZhdWx0IHN0YXJ0IHJ1bGUuXG4gIGlmICghc3VwZXJHcmFtbWFyLmlzQnVpbHRJbigpKSB7XG4gICAgdGhpcy5kZWZhdWx0U3RhcnRSdWxlID0gc3VwZXJHcmFtbWFyLmRlZmF1bHRTdGFydFJ1bGU7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUud2l0aERlZmF1bHRTdGFydFJ1bGUgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmRlZmF1bHRTdGFydFJ1bGUgPSBydWxlTmFtZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBDcmVhdGVzIGEgR3JhbW1hciBpbnN0YW5jZSwgYW5kIGlmIGl0IHBhc3NlcyB0aGUgc2FuaXR5IGNoZWNrcywgcmV0dXJucyBpdC5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZ3JhbW1hciA9XG4gICAgICBuZXcgR3JhbW1hcih0aGlzLm5hbWUsIHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyKCksIHRoaXMucnVsZURpY3QsIHRoaXMuZGVmYXVsdFN0YXJ0UnVsZSk7XG4gIC8vIFRPRE86IGNoYW5nZSB0aGUgcGV4cHIucHJvdG90eXBlLmFzc2VydC4uLiBtZXRob2RzIHRvIG1ha2UgdGhlbSBhZGRcbiAgLy8gZXhjZXB0aW9ucyB0byBhbiBhcnJheSB0aGF0J3MgcHJvdmlkZWQgYXMgYW4gYXJnLiBUaGVuIHdlJ2xsIGJlIGFibGUgdG9cbiAgLy8gc2hvdyBtb3JlIHRoYW4gb25lIGVycm9yIG9mIHRoZSBzYW1lIHR5cGUgYXQgYSB0aW1lLlxuICAvLyBUT0RPOiBpbmNsdWRlIHRoZSBvZmZlbmRpbmcgcGV4cHIgaW4gdGhlIGVycm9ycywgdGhhdCB3YXkgd2UgY2FuIHNob3dcbiAgLy8gdGhlIHBhcnQgb2YgdGhlIHNvdXJjZSB0aGF0IGNhdXNlZCBpdC5cbiAgdmFyIGdyYW1tYXJFcnJvcnMgPSBbXTtcbiAgdmFyIGdyYW1tYXJIYXNJbnZhbGlkQXBwbGljYXRpb25zID0gZmFsc2U7XG4gIE9iamVjdC5rZXlzKGdyYW1tYXIucnVsZURpY3QpLmZvckVhY2goZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB2YXIgYm9keSA9IGdyYW1tYXIucnVsZURpY3RbcnVsZU5hbWVdO1xuICAgIG9uT2htRXJyb3IoXG4gICAgICAgIGZ1bmN0aW9uKCkgeyBib2R5LmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KHJ1bGVOYW1lKTsgfSxcbiAgICAgICAgZnVuY3Rpb24oZSkgeyBncmFtbWFyRXJyb3JzLnB1c2goZSk7IH0pO1xuICAgIG9uT2htRXJyb3IoXG4gICAgICAgIGZ1bmN0aW9uKCkgeyBib2R5LmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTsgfSxcbiAgICAgICAgZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGdyYW1tYXJFcnJvcnMucHVzaChlKTtcbiAgICAgICAgICBncmFtbWFySGFzSW52YWxpZEFwcGxpY2F0aW9ucyA9IHRydWU7XG4gICAgICAgIH0pO1xuICB9KTtcbiAgaWYgKCFncmFtbWFySGFzSW52YWxpZEFwcGxpY2F0aW9ucykge1xuICAgIC8vIFRoZSBmb2xsb3dpbmcgY2hlY2sgY2FuIG9ubHkgYmUgZG9uZSBpZiB0aGUgZ3JhbW1hciBoYXMgbm8gaW52YWxpZCBhcHBsaWNhdGlvbnMuXG4gICAgT2JqZWN0LmtleXMoZ3JhbW1hci5ydWxlRGljdCkuZm9yRWFjaChmdW5jdGlvbihydWxlTmFtZSkge1xuICAgICAgdmFyIGJvZHkgPSBncmFtbWFyLnJ1bGVEaWN0W3J1bGVOYW1lXTtcbiAgICAgIG9uT2htRXJyb3IoXG4gICAgICAgICAgZnVuY3Rpb24oKSB7IGJvZHkuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIsIHJ1bGVOYW1lKTsgfSxcbiAgICAgICAgICBmdW5jdGlvbihlKSB7IGdyYW1tYXJFcnJvcnMucHVzaChlKTsgfSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKGdyYW1tYXJFcnJvcnMubGVuZ3RoID4gMCkge1xuICAgIGVycm9ycy50aHJvd0Vycm9ycyhncmFtbWFyRXJyb3JzKTtcbiAgfVxuICByZXR1cm4gZ3JhbW1hcjtcbn07XG5cbi8vIFJ1bGUgZGVjbGFyYXRpb25zXG5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5kZWZpbmUgPSBmdW5jdGlvbihuYW1lLCBmb3JtYWxzLCBib2R5LCBvcHREZXNjcikge1xuICB0aGlzLmVuc3VyZVN1cGVyR3JhbW1hcigpO1xuICBpZiAodGhpcy5zdXBlckdyYW1tYXIucnVsZURpY3RbbmFtZV0pIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbihuYW1lLCB0aGlzLm5hbWUsIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUsIGJvZHkpO1xuICB9IGVsc2UgaWYgKHRoaXMucnVsZURpY3RbbmFtZV0pIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbihuYW1lLCB0aGlzLm5hbWUsIHRoaXMubmFtZSwgYm9keSk7XG4gIH1cbiAgdmFyIGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzID0gY29tbW9uLmdldER1cGxpY2F0ZXMoZm9ybWFscyk7XG4gIGlmIChkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5EdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyhuYW1lLCBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcywgYm9keSk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuaW5zdGFsbChuYW1lLCBmb3JtYWxzLCBvcHREZXNjciwgYm9keSk7XG59O1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUub3ZlcnJpZGUgPSBmdW5jdGlvbihuYW1lLCBmb3JtYWxzLCBib2R5KSB7XG4gIHZhciBiYXNlUnVsZSA9IHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyKCkucnVsZURpY3RbbmFtZV07XG4gIGlmICghYmFzZVJ1bGUpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkNhbm5vdE92ZXJyaWRlVW5kZWNsYXJlZFJ1bGUobmFtZSwgdGhpcy5zdXBlckdyYW1tYXIubmFtZSwgYm9keSk7XG4gIH1cbiAgdGhpcy5pbnN0YWxsT3ZlcnJpZGRlbk9yRXh0ZW5kZWRSdWxlKG5hbWUsIGZvcm1hbHMsIGJvZHkpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5leHRlbmQgPSBmdW5jdGlvbihuYW1lLCBmb3JtYWxzLCBib2R5KSB7XG4gIHZhciBiYXNlUnVsZSA9IHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyKCkucnVsZURpY3RbbmFtZV07XG4gIGlmICghYmFzZVJ1bGUpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkNhbm5vdEV4dGVuZFVuZGVjbGFyZWRSdWxlKG5hbWUsIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUsIGJvZHkpO1xuICB9XG4gIHRoaXMuaW5zdGFsbE92ZXJyaWRkZW5PckV4dGVuZGVkUnVsZShcbiAgICAgIG5hbWUsIGZvcm1hbHMsIG5ldyBwZXhwcnMuRXh0ZW5kKHRoaXMuc3VwZXJHcmFtbWFyLCBuYW1lLCBib2R5KSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gR3JhbW1hckRlY2w7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBJbnRlcnZhbCA9IHJlcXVpcmUoJy4vSW50ZXJ2YWwnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIElucHV0U3RyZWFtKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ0lucHV0U3RyZWFtIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXRcXCdzIGFic3RyYWN0Jyk7XG59XG5cbklucHV0U3RyZWFtLm5ld0ZvciA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbmV3IFN0cmluZ0lucHV0U3RyZWFtKG9iaik7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgcmV0dXJuIG5ldyBMaXN0SW5wdXRTdHJlYW0ob2JqKTtcbiAgfSBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBJbnB1dFN0cmVhbSkge1xuICAgIHJldHVybiBvYmo7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgbWFrZSBpbnB1dCBzdHJlYW0gZm9yICcgKyBvYmopO1xuICB9XG59O1xuXG5JbnB1dFN0cmVhbS5wcm90b3R5cGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMucG9zID0gMDtcbiAgICB0aGlzLnBvc0luZm9zID0gW107XG4gIH0sXG5cbiAgYXRFbmQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyA9PT0gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICB9LFxuXG4gIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmF0RW5kKCkpIHtcbiAgICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuc291cmNlW3RoaXMucG9zKytdO1xuICAgIH1cbiAgfSxcblxuICBtYXRjaEV4YWN0bHk6IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gdGhpcy5uZXh0KCkgPT09IHggPyB0cnVlIDogY29tbW9uLmZhaWw7XG4gIH0sXG5cbiAgc291cmNlU2xpY2U6IGZ1bmN0aW9uKHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnRJZHgsIGVuZElkeCk7XG4gIH0sXG5cbiAgaW50ZXJ2YWw6IGZ1bmN0aW9uKHN0YXJ0SWR4LCBvcHRFbmRJZHgpIHtcbiAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMsIHN0YXJ0SWR4LCBvcHRFbmRJZHggPyBvcHRFbmRJZHggOiB0aGlzLnBvcyk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIFN0cmluZ0lucHV0U3RyZWFtKHNvdXJjZSkge1xuICB0aGlzLmluaXQoc291cmNlKTtcbn1cblxuU3RyaW5nSW5wdXRTdHJlYW0ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJbnB1dFN0cmVhbS5wcm90b3R5cGUsIHtcbiAgbWF0Y2hTdHJpbmc6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24ocykge1xuICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoRXhhY3RseShzW2lkeF0pID09PSBjb21tb24uZmFpbCkge1xuICAgICAgICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG59KTtcblxuZnVuY3Rpb24gTGlzdElucHV0U3RyZWFtKHNvdXJjZSkge1xuICB0aGlzLmluaXQoc291cmNlKTtcbn1cblxuTGlzdElucHV0U3RyZWFtLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSW5wdXRTdHJlYW0ucHJvdG90eXBlLCB7XG4gIG1hdGNoU3RyaW5nOiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKHMpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hdGNoRXhhY3RseShzKTtcbiAgICB9XG4gIH1cbn0pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dFN0cmVhbTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIEludGVydmFsKGlucHV0U3RyZWFtLCBzdGFydElkeCwgZW5kSWR4KSB7XG4gIHRoaXMuaW5wdXRTdHJlYW0gPSBpbnB1dFN0cmVhbTtcbiAgdGhpcy5zdGFydElkeCA9IHN0YXJ0SWR4O1xuICB0aGlzLmVuZElkeCA9IGVuZElkeDtcbn1cblxuSW50ZXJ2YWwuY292ZXJhZ2UgPSBmdW5jdGlvbigvKiBpbnRlcnZhbDEsIGludGVydmFsMiwgLi4uICovKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IGFyZ3VtZW50c1swXS5pbnB1dFN0cmVhbTtcbiAgdmFyIHN0YXJ0SWR4ID0gYXJndW1lbnRzWzBdLnN0YXJ0SWR4O1xuICB2YXIgZW5kSWR4ID0gYXJndW1lbnRzWzBdLmVuZElkeDtcbiAgZm9yICh2YXIgaWR4ID0gMTsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB2YXIgaW50ZXJ2YWwgPSBhcmd1bWVudHNbaWR4XTtcbiAgICBpZiAoaW50ZXJ2YWwuaW5wdXRTdHJlYW0gIT09IGlucHV0U3RyZWFtKSB7XG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLkludGVydmFsU291cmNlc0RvbnRNYXRjaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydElkeCA9IE1hdGgubWluKHN0YXJ0SWR4LCBhcmd1bWVudHNbaWR4XS5zdGFydElkeCk7XG4gICAgICBlbmRJZHggPSBNYXRoLm1heChlbmRJZHgsIGFyZ3VtZW50c1tpZHhdLmVuZElkeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXcgSW50ZXJ2YWwoaW5wdXRTdHJlYW0sIHN0YXJ0SWR4LCBlbmRJZHgpO1xufTtcblxuSW50ZXJ2YWwucHJvdG90eXBlID0ge1xuICBjb3ZlcmFnZVdpdGg6IGZ1bmN0aW9uKC8qIGludGVydmFsMSwgaW50ZXJ2YWwyLCAuLi4gKi8pIHtcbiAgICB2YXIgaW50ZXJ2YWxzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBpbnRlcnZhbHMucHVzaCh0aGlzKTtcbiAgICByZXR1cm4gSW50ZXJ2YWwuY292ZXJhZ2UuYXBwbHkodW5kZWZpbmVkLCBpbnRlcnZhbHMpO1xuICB9LFxuXG4gIGNvbGxhcHNlZExlZnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgSW50ZXJ2YWwodGhpcy5pbnB1dFN0cmVhbSwgdGhpcy5zdGFydElkeCwgdGhpcy5zdGFydElkeCk7XG4gIH0sXG5cbiAgY29sbGFwc2VkUmlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgSW50ZXJ2YWwodGhpcy5pbnB1dFN0cmVhbSwgdGhpcy5lbmRJZHgsIHRoaXMuZW5kSWR4KTtcbiAgfSxcblxuICBnZXRMaW5lQW5kQ29sdW1uTWVzc2FnZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJhbmdlID0gW3RoaXMuc3RhcnRJZHgsIHRoaXMuZW5kSWR4XTtcbiAgICByZXR1cm4gdXRpbC5nZXRMaW5lQW5kQ29sdW1uTWVzc2FnZSh0aGlzLmlucHV0U3RyZWFtLnNvdXJjZSwgdGhpcy5zdGFydElkeCwgcmFuZ2UpO1xuICB9LFxuXG4gIC8vIFJldHVybnMgYSBuZXcgSW50ZXJ2YWwgd2hpY2ggY29udGFpbnMgdGhlIHNhbWUgY29udGVudHMgYXMgdGhpcyBvbmUsXG4gIC8vIGJ1dCB3aXRoIHdoaXRlc3BhY2UgdHJpbW1lZCBmcm9tIGJvdGggZW5kcy4gKFRoaXMgb25seSBtYWtlcyBzZW5zZSB3aGVuXG4gIC8vIHRoZSBpbnB1dCBzdHJlYW0gaXMgYSBzdHJpbmcuKVxuICB0cmltbWVkOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29udGVudHMgPSB0aGlzLmNvbnRlbnRzO1xuICAgIHZhciBzdGFydElkeCA9IHRoaXMuc3RhcnRJZHggKyBjb250ZW50cy5tYXRjaCgvXlxccyovKVswXS5sZW5ndGg7XG4gICAgdmFyIGVuZElkeCA9IHRoaXMuZW5kSWR4IC0gY29udGVudHMubWF0Y2goL1xccyokLylbMF0ubGVuZ3RoO1xuICAgIHJldHVybiBuZXcgSW50ZXJ2YWwodGhpcy5pbnB1dFN0cmVhbSwgc3RhcnRJZHgsIGVuZElkeCk7XG4gIH1cbn07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEludGVydmFsLnByb3RvdHlwZSwge1xuICBjb250ZW50czoge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fY29udGVudHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9jb250ZW50cyA9IHRoaXMuaW5wdXRTdHJlYW0uc291cmNlU2xpY2UodGhpcy5zdGFydElkeCwgdGhpcy5lbmRJZHgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRzO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogdHJ1ZVxuICB9XG59KTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJ2YWw7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBJbnRlcnZhbCA9IHJlcXVpcmUoJy4vSW50ZXJ2YWwnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIENyZWF0ZSBhIHNob3J0IGVycm9yIG1lc3NhZ2UgZm9yIGFuIGVycm9yIHRoYXQgb2NjdXJyZWQgZHVyaW5nIG1hdGNoaW5nLlxuZnVuY3Rpb24gZ2V0U2hvcnRNYXRjaEVycm9yTWVzc2FnZShwb3MsIHNvdXJjZSwgZGV0YWlsKSB7XG4gIHZhciBlcnJvckluZm8gPSB1dGlsLmdldExpbmVBbmRDb2x1bW4oc291cmNlLCBwb3MpO1xuICByZXR1cm4gJ0xpbmUgJyArIGVycm9ySW5mby5saW5lTnVtICsgJywgY29sICcgKyBlcnJvckluZm8uY29sTnVtICsgJzogJyArIGRldGFpbDtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gTWF0Y2hGYWlsdXJlIC0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIE1hdGNoUmVzdWx0KHN0YXRlKSB7XG4gIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgdGhpcy5fY3N0ID0gc3RhdGUuYmluZGluZ3NbMF07XG59XG5cbk1hdGNoUmVzdWx0Lm5ld0ZvciA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBzdWNjZWVkZWQgPSBzdGF0ZS5iaW5kaW5ncy5sZW5ndGggPT09IDE7XG4gIHJldHVybiBzdWNjZWVkZWQgPyBuZXcgTWF0Y2hSZXN1bHQoc3RhdGUpIDogbmV3IE1hdGNoRmFpbHVyZShzdGF0ZSk7XG59O1xuXG5NYXRjaFJlc3VsdC5wcm90b3R5cGUuZmFpbGVkID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbk1hdGNoUmVzdWx0LnByb3RvdHlwZS5zdWNjZWVkZWQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICF0aGlzLmZhaWxlZCgpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gTWF0Y2hGYWlsdXJlIC0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIE1hdGNoRmFpbHVyZShzdGF0ZSkge1xuICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gIGNvbW1vbi5kZWZpbmVMYXp5UHJvcGVydHkodGhpcywgJ19leHByc0FuZFN0YWNrcycsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLmdldEZhaWx1cmVzKCk7XG4gIH0pO1xuICBjb21tb24uZGVmaW5lTGF6eVByb3BlcnR5KHRoaXMsICdtZXNzYWdlJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNvdXJjZSA9IHRoaXMuc3RhdGUuaW5wdXRTdHJlYW0uc291cmNlO1xuICAgIGlmICh0eXBlb2Ygc291cmNlICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuICdtYXRjaCBmYWlsZWQgYXQgcG9zaXRpb24gJyArIHRoaXMuZ2V0UG9zKCk7XG4gICAgfVxuXG4gICAgdmFyIGRldGFpbCA9ICdFeHBlY3RlZCAnICsgdGhpcy5nZXRFeHBlY3RlZFRleHQoKTtcbiAgICByZXR1cm4gdXRpbC5nZXRMaW5lQW5kQ29sdW1uTWVzc2FnZShzb3VyY2UsIHRoaXMuZ2V0UG9zKCkpICsgZGV0YWlsO1xuICB9KTtcbiAgY29tbW9uLmRlZmluZUxhenlQcm9wZXJ0eSh0aGlzLCAnc2hvcnRNZXNzYWdlJywgZnVuY3Rpb24oKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnN0YXRlLmlucHV0U3RyZWFtLnNvdXJjZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiAnbWF0Y2ggZmFpbGVkIGF0IHBvc2l0aW9uICcgKyB0aGlzLmdldFBvcygpO1xuICAgIH1cbiAgICB2YXIgZGV0YWlsID0gJ2V4cGVjdGVkICcgKyB0aGlzLmdldEV4cGVjdGVkVGV4dCgpO1xuICAgIHJldHVybiBnZXRTaG9ydE1hdGNoRXJyb3JNZXNzYWdlKHRoaXMuZ2V0UG9zKCksIHRoaXMuc3RhdGUuaW5wdXRTdHJlYW0uc291cmNlLCBkZXRhaWwpO1xuICB9KTtcbn1cbmluaGVyaXRzKE1hdGNoRmFpbHVyZSwgTWF0Y2hSZXN1bHQpO1xuXG5NYXRjaEZhaWx1cmUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnW01hdGNoRmFpbHVyZSBhdCBwb3NpdGlvbiAnICsgdGhpcy5nZXRQb3MoKSArICddJztcbn07XG5cbk1hdGNoRmFpbHVyZS5wcm90b3R5cGUuZmFpbGVkID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0cnVlO1xufTtcblxuTWF0Y2hGYWlsdXJlLnByb3RvdHlwZS5nZXRQb3MgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuc3RhdGUuZ2V0RmFpbHVyZXNQb3MoKTtcbn07XG5cbk1hdGNoRmFpbHVyZS5wcm90b3R5cGUuZ2V0SW50ZXJ2YWwgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBvcyA9IHRoaXMuc3RhdGUuZ2V0RmFpbHVyZXNQb3MoKTtcbiAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLnN0YXRlLmlucHV0U3RyZWFtLCBwb3MsIHBvcyk7XG59O1xuXG4vLyBSZXR1cm4gYSBzdHJpbmcgc3VtbWFyaXppbmcgdGhlIGV4cGVjdGVkIGNvbnRlbnRzIG9mIHRoZSBpbnB1dCBzdHJlYW0gd2hlblxuLy8gdGhlIG1hdGNoIGZhaWx1cmUgb2NjdXJyZWQuXG5NYXRjaEZhaWx1cmUucHJvdG90eXBlLmdldEV4cGVjdGVkVGV4dCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2IgPSBuZXcgY29tbW9uLlN0cmluZ0J1ZmZlcigpO1xuICB2YXIgZXhwZWN0ZWQgPSB0aGlzLmdldEV4cGVjdGVkKCk7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGV4cGVjdGVkLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAoaWR4ID4gMCkge1xuICAgICAgaWYgKGlkeCA9PT0gZXhwZWN0ZWQubGVuZ3RoIC0gMSkge1xuICAgICAgICBzYi5hcHBlbmQoKGV4cGVjdGVkLmxlbmd0aCA+IDIgPyAnLCBvciAnIDogJyBvciAnKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzYi5hcHBlbmQoJywgJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHNiLmFwcGVuZChleHBlY3RlZFtpZHhdKTtcbiAgfVxuICByZXR1cm4gc2IuY29udGVudHMoKTtcbn07XG5cbi8vIFJldHVybiBhbiBBcnJheSBvZiB1bmlxdWUgc3RyaW5ncyByZXByZXNlbnRpbmcgdGhlIHRlcm1pbmFscyBvciBydWxlcyB0aGF0XG4vLyB3ZXJlIGV4cGVjdGVkIHRvIGJlIG1hdGNoZWQuXG5NYXRjaEZhaWx1cmUucHJvdG90eXBlLmdldEV4cGVjdGVkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBleHBlY3RlZCA9IHt9O1xuICB2YXIgcnVsZURpY3QgPSB0aGlzLnN0YXRlLmdyYW1tYXIucnVsZURpY3Q7XG4gIHRoaXMuX2V4cHJzQW5kU3RhY2tzLmZvckVhY2goZnVuY3Rpb24ob2JqKSB7XG4gICAgZXhwZWN0ZWRbb2JqLmV4cHIudG9FeHBlY3RlZChydWxlRGljdCldID0gdHJ1ZTtcbiAgfSk7XG4gIHJldHVybiBPYmplY3Qua2V5cyhleHBlY3RlZCk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBNYXRjaFJlc3VsdDtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBleHRlbmQgPSByZXF1aXJlKCd1dGlsLWV4dGVuZCcpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gTmFtZXNwYWNlKCkge1xufVxuTmFtZXNwYWNlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbk5hbWVzcGFjZS5hc05hbWVzcGFjZSA9IGZ1bmN0aW9uKG9iak9yTmFtZXNwYWNlKSB7XG4gIGlmIChvYmpPck5hbWVzcGFjZSBpbnN0YW5jZW9mIE5hbWVzcGFjZSkge1xuICAgIHJldHVybiBvYmpPck5hbWVzcGFjZTtcbiAgfVxuICByZXR1cm4gTmFtZXNwYWNlLmNyZWF0ZU5hbWVzcGFjZShvYmpPck5hbWVzcGFjZSk7XG59O1xuXG4vLyBDcmVhdGUgYSBuZXcgbmFtZXNwYWNlLiBJZiBgb3B0UHJvcHNgIGlzIHNwZWNpZmllZCwgYWxsIG9mIGl0cyBwcm9wZXJ0aWVzXG4vLyB3aWxsIGJlIGNvcGllZCB0byB0aGUgbmV3IG5hbWVzcGFjZS5cbk5hbWVzcGFjZS5jcmVhdGVOYW1lc3BhY2UgPSBmdW5jdGlvbihvcHRQcm9wcykge1xuICByZXR1cm4gTmFtZXNwYWNlLmV4dGVuZChOYW1lc3BhY2UucHJvdG90eXBlLCBvcHRQcm9wcyk7XG59O1xuXG4vLyBDcmVhdGUgYSBuZXcgbmFtZXNwYWNlIHdoaWNoIGV4dGVuZHMgYW5vdGhlciBuYW1lc3BhY2UuIElmIGBvcHRQcm9wc2AgaXNcbi8vIHNwZWNpZmllZCwgYWxsIG9mIGl0cyBwcm9wZXJ0aWVzIHdpbGwgYmUgY29waWVkIHRvIHRoZSBuZXcgbmFtZXNwYWNlLlxuTmFtZXNwYWNlLmV4dGVuZCA9IGZ1bmN0aW9uKG5hbWVzcGFjZSwgb3B0UHJvcHMpIHtcbiAgaWYgKG5hbWVzcGFjZSAhPT0gTmFtZXNwYWNlLnByb3RvdHlwZSAmJiAhKG5hbWVzcGFjZSBpbnN0YW5jZW9mIE5hbWVzcGFjZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdub3QgYSBOYW1lc3BhY2Ugb2JqZWN0OiAnICsgbmFtZXNwYWNlKTtcbiAgfVxuICB2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG5hbWVzcGFjZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogTmFtZXNwYWNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBleHRlbmQobnMsIG9wdFByb3BzKTtcbn07XG5cbi8vIFRPRE86IFNob3VsZCB0aGlzIGJlIGEgcmVndWxhciBtZXRob2Q/XG5OYW1lc3BhY2UudG9TdHJpbmcgPSBmdW5jdGlvbihucykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG5zKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hbWVzcGFjZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIFBvc0luZm8oZ2xvYmFsQXBwbGljYXRpb25TdGFjaykge1xuICB0aGlzLmdsb2JhbEFwcGxpY2F0aW9uU3RhY2sgPSBnbG9iYWxBcHBsaWNhdGlvblN0YWNrO1xuICB0aGlzLmFwcGxpY2F0aW9uU3RhY2sgPSBbXTtcbiAgdGhpcy5tZW1vID0ge307XG5cbiAgLy8gUmVkdW5kYW50IChjb3VsZCBiZSBnZW5lcmF0ZWQgZnJvbSBhcHBsaWNhdGlvblN0YWNrKSBidXQgaXQgbWFrZXMgdGhpbmdzIHNpbXBsZXIuXG4gIC8vIE5vdGU6IHRoaXMgdXNlZCB0byBhIGRpY3Rpb25hcnksIGJ1dCB0aGF0IGNhdXNlZCBWOCB0byBkZW9wdGltaXplIHRoZSBlbnRpcmUgZnVuY3Rpb24sXG4gIC8vIHNvIHVzaW5nIGFuIEFycmF5IGlzIGFjdHVhbGx5IGZhc3RlciAoZm9yIG5vdykuXG4gIHRoaXMuYWN0aXZlQXBwbGljYXRpb25zID0gW107XG59XG5cblBvc0luZm8ucHJvdG90eXBlID0ge1xuICBpc0FjdGl2ZTogZnVuY3Rpb24oYXBwbGljYXRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVBcHBsaWNhdGlvbnMuaW5kZXhPZihhcHBsaWNhdGlvbi50b01lbW9LZXkoKSkgIT09IC0xO1xuICB9LFxuXG4gIGVudGVyOiBmdW5jdGlvbihhcHBsaWNhdGlvbikge1xuICAgIHRoaXMuZ2xvYmFsQXBwbGljYXRpb25TdGFjay5wdXNoKGFwcGxpY2F0aW9uKTtcbiAgICB0aGlzLmFwcGxpY2F0aW9uU3RhY2sucHVzaChhcHBsaWNhdGlvbik7XG4gICAgdGhpcy5hY3RpdmVBcHBsaWNhdGlvbnMucHVzaChhcHBsaWNhdGlvbi50b01lbW9LZXkoKSk7XG4gIH0sXG5cbiAgZXhpdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5nbG9iYWxBcHBsaWNhdGlvblN0YWNrLnBvcCgpO1xuICAgIHRoaXMuYXBwbGljYXRpb25TdGFjay5wb3AoKTtcbiAgICB0aGlzLmFjdGl2ZUFwcGxpY2F0aW9ucy5wb3AoKTtcbiAgfSxcblxuICBzaG91bGRVc2VNZW1vaXplZFJlc3VsdDogZnVuY3Rpb24oYXBwbGljYXRpb24sIG1lbW9SZWMpIHtcbiAgICB2YXIgaW52b2x2ZWRBcHBsaWNhdGlvbnMgPSBtZW1vUmVjLmludm9sdmVkQXBwbGljYXRpb25zO1xuICAgIGlmIChpbnZvbHZlZEFwcGxpY2F0aW9ucyAhPSBudWxsKSB7XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGludm9sdmVkQXBwbGljYXRpb25zKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgbWVtb0tleSA9IGtleXNbaV07XG4gICAgICAgIGlmIChpbnZvbHZlZEFwcGxpY2F0aW9uc1ttZW1vS2V5XSAmJiB0aGlzLmFjdGl2ZUFwcGxpY2F0aW9ucy5pbmRleE9mKG1lbW9LZXkpICE9PSAtMSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICBnZXRDdXJyZW50TGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrKSB7XG4gICAgICByZXR1cm4gdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2tbdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2subGVuZ3RoIC0gMV07XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0TGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24oYXBwbGljYXRpb24pIHtcbiAgICBpZiAoIXRoaXMubGVmdFJlY3Vyc2lvblN0YWNrKSB7XG4gICAgICB0aGlzLmxlZnRSZWN1cnNpb25TdGFjayA9IFtdO1xuICAgIH1cbiAgICB0aGlzLmxlZnRSZWN1cnNpb25TdGFjay5wdXNoKHtcbiAgICAgICAgbWVtb0tleTogYXBwbGljYXRpb24udG9NZW1vS2V5KCksXG4gICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICAgICAgcG9zOiAtMSxcbiAgICAgICAgaW52b2x2ZWRBcHBsaWNhdGlvbnM6IHt9fSk7XG4gICAgdGhpcy51cGRhdGVJbnZvbHZlZEFwcGxpY2F0aW9ucygpO1xuICB9LFxuXG4gIGVuZExlZnRSZWN1cnNpb246IGZ1bmN0aW9uKGFwcGxpY2F0aW9uKSB7XG4gICAgdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2sucG9wKCk7XG4gIH0sXG5cbiAgdXBkYXRlSW52b2x2ZWRBcHBsaWNhdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJyZW50TGVmdFJlY3Vyc2lvbiA9IHRoaXMuZ2V0Q3VycmVudExlZnRSZWN1cnNpb24oKTtcbiAgICB2YXIgaW52b2x2ZWRBcHBsaWNhdGlvbnMgPSBjdXJyZW50TGVmdFJlY3Vyc2lvbi5pbnZvbHZlZEFwcGxpY2F0aW9ucztcbiAgICB2YXIgbHJBcHBsaWNhdGlvbk1lbW9LZXkgPSBjdXJyZW50TGVmdFJlY3Vyc2lvbi5tZW1vS2V5O1xuICAgIHZhciBpZHggPSB0aGlzLmFwcGxpY2F0aW9uU3RhY2subGVuZ3RoIC0gMTtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIG1lbW9LZXkgPSB0aGlzLmFwcGxpY2F0aW9uU3RhY2tbaWR4LS1dLnRvTWVtb0tleSgpO1xuICAgICAgaWYgKG1lbW9LZXkgPT09IGxyQXBwbGljYXRpb25NZW1vS2V5KSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaW52b2x2ZWRBcHBsaWNhdGlvbnNbbWVtb0tleV0gPSB0cnVlO1xuICAgIH1cbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gUG9zSW5mbztcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBTeW1ib2wgPSByZXF1aXJlKCdzeW1ib2wnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBNYXRjaFJlc3VsdCA9IHJlcXVpcmUoJy4vTWF0Y2hSZXN1bHQnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gV3JhcHBlcnMgLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gV3JhcHBlcnMgZGVjb3JhdGUgQ1NUIG5vZGVzIHdpdGggYWxsIG9mIHRoZSBmdW5jdGlvbmFsaXR5IChpLmUuLCBvcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzKVxuLy8gcHJvdmlkZWQgYnkgYSBTZW1hbnRpY3MgKHNlZSBiZWxvdykuIGBXcmFwcGVyYCBpcyB0aGUgYWJzdHJhY3Qgc3VwZXJjbGFzcyBvZiBhbGwgd3JhcHBlcnMuIEFcbi8vIGBXcmFwcGVyYCBtdXN0IGhhdmUgYF9ub2RlYCBhbmQgYF9zZW1hbnRpY3NgIGluc3RhbmNlIHZhcmlhYmxlcywgd2hpY2ggcmVmZXIgdG8gdGhlIENTVCBub2RlIGFuZFxuLy8gU2VtYW50aWNzIChyZXNwLikgZm9yIHdoaWNoIGl0IHdhcyBjcmVhdGVkLCBhbmQgYSBgX2NoaWxkV3JhcHBlcnNgIGluc3RhbmNlIHZhcmlhYmxlIHdoaWNoIGlzXG4vLyB1c2VkIHRvIGNhY2hlIHRoZSB3cmFwcGVyIGluc3RhbmNlcyB0aGF0IGFyZSBjcmVhdGVkIGZvciBpdHMgY2hpbGQgbm9kZXMuIFNldHRpbmcgdGhlc2UgaW5zdGFuY2Vcbi8vIHZhcmlhYmxlcyBpcyB0aGUgcmVzcG9uc2liaWxpdHkgb2YgdGhlIGNvbnN0cnVjdG9yIG9mIGVhY2ggU2VtYW50aWNzLXNwZWNpZmljIHN1YmNsYXNzIG9mXG4vLyBgV3JhcHBlcmAuXG5mdW5jdGlvbiBXcmFwcGVyKCkge31cblxuV3JhcHBlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdbc2VtYW50aWNzIHdyYXBwZXIgZm9yICcgKyB0aGlzLl9ub2RlLmdyYW1tYXIubmFtZSArICddJztcbn07XG5cbi8vIFJldHVybnMgdGhlIHdyYXBwZXIgb2YgdGhlIHNwZWNpZmllZCBjaGlsZCBub2RlLiBDaGlsZCB3cmFwcGVycyBhcmUgY3JlYXRlZCBsYXppbHkgYW5kIGNhY2hlZCBpblxuLy8gdGhlIHBhcmVudCB3cmFwcGVyJ3MgYF9jaGlsZFdyYXBwZXJzYCBpbnN0YW5jZSB2YXJpYWJsZS5cbldyYXBwZXIucHJvdG90eXBlLmNoaWxkID0gZnVuY3Rpb24oaWR4KSB7XG4gIGlmICghKDAgPD0gaWR4ICYmIGlkeCA8IHRoaXMuX25vZGUubnVtQ2hpbGRyZW4oKSkpIHtcbiAgICAvLyBUT0RPOiBDb25zaWRlciB0aHJvd2luZyBhbiBleGNlcHRpb24gaGVyZS5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHZhciBjaGlsZFdyYXBwZXIgPSB0aGlzLl9jaGlsZFdyYXBwZXJzW2lkeF07XG4gIGlmICghY2hpbGRXcmFwcGVyKSB7XG4gICAgY2hpbGRXcmFwcGVyID0gdGhpcy5fY2hpbGRXcmFwcGVyc1tpZHhdID0gdGhpcy5fc2VtYW50aWNzLndyYXAodGhpcy5fbm9kZS5jaGlsZEF0KGlkeCkpO1xuICB9XG4gIHJldHVybiBjaGlsZFdyYXBwZXI7XG59O1xuXG4vLyBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIHdyYXBwZXJzIG9mIGFsbCBvZiB0aGUgY2hpbGRyZW4gb2YgdGhlIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXNcbi8vIHdyYXBwZXIuXG5XcmFwcGVyLnByb3RvdHlwZS5fY2hpbGRyZW4gPSBmdW5jdGlvbigpIHtcbiAgLy8gRm9yY2UgdGhlIGNyZWF0aW9uIG9mIGFsbCBjaGlsZCB3cmFwcGVyc1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLl9ub2RlLm51bUNoaWxkcmVuKCk7IGlkeCsrKSB7XG4gICAgdGhpcy5jaGlsZChpZHgpO1xuICB9XG4gIHJldHVybiB0aGlzLl9jaGlsZFdyYXBwZXJzO1xufTtcblxuLy8gUmV0dXJucyB0aGUgd3JhcHBlciBvZiB0aGUgZmlyc3QgY2hpbGQgbm9kZS4gVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGUgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpc1xuLy8gd3JhcHBlciBkb2Vzbid0IGhhdmUgZXhhY3RseSBvbmUgY2hpbGQuXG5XcmFwcGVyLnByb3RvdHlwZS5fb25seUNoaWxkID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLl9ub2RlLm51bUNoaWxkcmVuKCkgIT09IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdjYW5ub3QgZ2V0IG9ubHkgY2hpbGQgb2YgYSBub2RlIG9mIHR5cGUgJyArIHRoaXMuY3Rvck5hbWUoKSArXG4gICAgICAgICcgKGl0IGhhcyAnICsgdGhpcy5fbm9kZS5udW1DaGlsZHJlbigpICsgJyBjaGlsZHJlbiknKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZCgwKTtcbiAgfVxufTtcblxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHdyYXBwZXIgY29ycmVzcG9uZHMgdG8gYW4gaXRlcmF0aW9uXG4vLyBleHByZXNzaW9uLCBpLmUuLCBhIEtsZWVuZS0qLCBLbGVlbmUtKywgb3IgYW4gb3B0aW9uYWwuIFJldHVybnMgYGZhbHNlYCBvdGhlcndpc2UuXG5XcmFwcGVyLnByb3RvdHlwZS5pc0l0ZXJhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5fbm9kZS5jdG9yTmFtZSA9PT0gJ19pdGVyJztcbn07XG5cbi8vIFJldHVybnMgYHRydWVgIGlmIHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyB3cmFwcGVyIGlzIGEgdGVybWluYWwgbm9kZSwgYGZhbHNlYFxuLy8gb3RoZXJ3aXNlLlxuV3JhcHBlci5wcm90b3R5cGUuaXNUZXJtaW5hbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5fbm9kZS5pc1Rlcm1pbmFsKCk7XG59O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhXcmFwcGVyLnByb3RvdHlwZSwge1xuICAvLyBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGNoaWxkcmVuIG9mIHRoaXMgQ1NUIG5vZGUuXG4gIGNoaWxkcmVuOiB7Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2NoaWxkcmVuKCk7IH19LFxuXG4gIC8vIFJldHVybnMgdGhlIG5hbWUgb2YgZ3JhbW1hciBydWxlIHRoYXQgY3JlYXRlZCB0aGlzIENTVCBub2RlLlxuICBjdG9yTmFtZToge2dldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9ub2RlLmN0b3JOYW1lOyB9fSxcblxuICAvLyBSZXR1cm5zIHRoZSBpbnRlcnZhbCBjb25zdW1lZCBieSB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlci5cbiAgaW50ZXJ2YWw6IHtnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fbm9kZS5pbnRlcnZhbDsgfX0sXG5cbiAgLy8gUmV0dXJucyB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuIG9mIHRoaXMgQ1NUIG5vZGUuXG4gIG51bUNoaWxkcmVuOiB7Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX25vZGUubnVtQ2hpbGRyZW4oKTsgfX0sXG5cbiAgLy8gUmV0dXJucyB0aGUgcHJpbWl0aXZlIHZhbHVlIG9mIHRoaXMgQ1NUIG5vZGUsIGlmIGl0J3MgYSB0ZXJtaW5hbCBub2RlLiBPdGhlcndpc2UsXG4gIC8vIHRocm93cyBhbiBleGNlcHRpb24uXG4gIHByaW1pdGl2ZVZhbHVlOiB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLmlzVGVybWluYWwoKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZS5wcmltaXRpdmVWYWx1ZTtcbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJ0cmllZCB0byBhY2Nlc3MgdGhlICdwcmltaXRpdmVWYWx1ZScgYXR0cmlidXRlIG9mIGEgbm9uLXRlcm1pbmFsIENTVCBub2RlXCIpO1xuICAgIH1cbiAgfVxufSk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIFNlbWFudGljcyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBBIFNlbWFudGljcyBpcyBhIGNvbnRhaW5lciBmb3IgYSBmYW1pbHkgb2YgT3BlcmF0aW9ucyBhbmQgQXR0cmlidXRlcyBmb3IgYSBnaXZlbiBncmFtbWFyLlxuLy8gU2VtYW50aWNzIGVuYWJsZSBtb2R1bGFyaXR5IChkaWZmZXJlbnQgY2xpZW50cyBvZiBhIGdyYW1tYXIgY2FuIGNyZWF0ZSB0aGVpciBzZXQgb2Ygb3BlcmF0aW9uc1xuLy8gYW5kIGF0dHJpYnV0ZXMgaW4gaXNvbGF0aW9uKSBhbmQgZXh0ZW5zaWJpbGl0eSBldmVuIHdoZW4gb3BlcmF0aW9ucyBhbmQgYXR0cmlidXRlcyBhcmUgbXV0dWFsbHktXG4vLyByZWN1cnNpdmUuIFRoaXMgY29uc3RydWN0b3Igc2hvdWxkIG5vdCBiZSBjYWxsZWQgZGlyZWN0bHkgZXhjZXB0IGZyb21cbi8vIGBTZW1hbnRpY3MuY3JlYXRlU2VtYW50aWNzYC4gVGhlIG5vcm1hbCB3YXlzIHRvIGNyZWF0ZSBhIFNlbWFudGljcywgZ2l2ZW4gYSBncmFtbWFyICdnJywgYXJlXG4vLyBgZy5zZW1hbnRpY3MoKWAgYW5kIGBnLmV4dGVuZFNlbWFudGljcyhwYXJlbnRTZW1hbnRpY3MpYC5cbmZ1bmN0aW9uIFNlbWFudGljcyhncmFtbWFyLCBvcHRTdXBlclNlbWFudGljcykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG4gIHRoaXMuY2hlY2tlZEFjdGlvbkRpY3RzID0gZmFsc2U7XG5cbiAgLy8gQ29uc3RydWN0b3IgZm9yIHdyYXBwZXIgaW5zdGFuY2VzLCB3aGljaCBhcmUgcGFzc2VkIGFzIHRoZSBhcmd1bWVudHMgdG8gdGhlIHNlbWFudGljIGFjdGlvbnNcbiAgLy8gb2YgYW4gb3BlcmF0aW9uIG9yIGF0dHJpYnV0ZS4gT3BlcmF0aW9ucyBhbmQgYXR0cmlidXRlcyByZXF1aXJlIGRvdWJsZSBkaXNwYXRjaDogdGhlIHNlbWFudGljXG4gIC8vIGFjdGlvbiBpcyBjaG9zZW4gYmFzZWQgb24gYm90aCB0aGUgbm9kZSdzIHR5cGUgYW5kIHRoZSBzZW1hbnRpY3MuIFdyYXBwZXJzIGVuc3VyZSB0aGF0XG4gIC8vIHRoZSBgZXhlY3V0ZWAgbWV0aG9kIGlzIGNhbGxlZCB3aXRoIHRoZSBjb3JyZWN0IChtb3N0IHNwZWNpZmljKSBzZW1hbnRpY3Mgb2JqZWN0IGFzIGFuXG4gIC8vIGFyZ3VtZW50LlxuICB0aGlzLldyYXBwZXIgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgc2VsZi5jaGVja0FjdGlvbkRpY3RzSWZIYXZlbnRBbHJlYWR5KCk7XG4gICAgdGhpcy5fc2VtYW50aWNzID0gc2VsZjtcbiAgICB0aGlzLl9ub2RlID0gbm9kZTtcbiAgICB0aGlzLl9jaGlsZFdyYXBwZXJzID0gW107XG4gIH07XG5cbiAgaWYgKG9wdFN1cGVyU2VtYW50aWNzKSB7XG4gICAgdGhpcy5zdXBlciA9IG9wdFN1cGVyU2VtYW50aWNzO1xuICAgIGlmIChncmFtbWFyICE9PSB0aGlzLnN1cGVyLmdyYW1tYXIgJiYgIWdyYW1tYXIuX2luaGVyaXRzRnJvbSh0aGlzLnN1cGVyLmdyYW1tYXIpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgXCJDYW5ub3QgZXh0ZW5kIGEgc2VtYW50aWNzIGZvciBncmFtbWFyICdcIiArIHRoaXMuc3VwZXIuZ3JhbW1hci5uYW1lICtcbiAgICAgICAgICBcIicgZm9yIHVzZSB3aXRoIGdyYW1tYXIgJ1wiICsgZ3JhbW1hci5uYW1lICsgXCInIChub3QgYSBzdWItZ3JhbW1hcilcIik7XG4gICAgfVxuICAgIGluaGVyaXRzKHRoaXMuV3JhcHBlciwgdGhpcy5zdXBlci5XcmFwcGVyKTtcbiAgICB0aGlzLm9wZXJhdGlvbnMgPSBPYmplY3QuY3JlYXRlKHRoaXMuc3VwZXIub3BlcmF0aW9ucyk7XG4gICAgdGhpcy5hdHRyaWJ1dGVzID0gT2JqZWN0LmNyZWF0ZSh0aGlzLnN1cGVyLmF0dHJpYnV0ZXMpO1xuICAgIHRoaXMuYXR0cmlidXRlS2V5cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICAvLyBBc3NpZ24gdW5pcXVlIHN5bWJvbHMgZm9yIGVhY2ggb2YgdGhlIGF0dHJpYnV0ZXMgaW5oZXJpdGVkIGZyb20gdGhlIHN1cGVyLXNlbWFudGljcyBzbyB0aGF0XG4gICAgLy8gdGhleSBhcmUgbWVtb2l6ZWQgaW5kZXBlbmRlbnRseS5cbiAgICBmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgICAgdGhpcy5hdHRyaWJ1dGVLZXlzW2F0dHJpYnV0ZU5hbWVdID0gU3ltYm9sKCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGluaGVyaXRzKHRoaXMuV3JhcHBlciwgV3JhcHBlcik7XG4gICAgdGhpcy5vcGVyYXRpb25zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0aGlzLmF0dHJpYnV0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRoaXMuYXR0cmlidXRlS2V5cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIH1cbn1cblxuU2VtYW50aWNzLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ1tzZW1hbnRpY3MgZm9yICcgKyB0aGlzLmdyYW1tYXIubmFtZSArICddJztcbn07XG5cblNlbWFudGljcy5wcm90b3R5cGUuY2hlY2tBY3Rpb25EaWN0c0lmSGF2ZW50QWxyZWFkeSA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuY2hlY2tlZEFjdGlvbkRpY3RzKSB7XG4gICAgdGhpcy5jaGVja0FjdGlvbkRpY3RzKCk7XG4gICAgdGhpcy5jaGVja2VkQWN0aW9uRGljdHMgPSB0cnVlO1xuICB9XG59O1xuXG4vLyBDaGVja3MgdGhhdCB0aGUgYWN0aW9uIGRpY3Rpb25hcmllcyBmb3IgYWxsIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgaW4gdGhpcyBzZW1hbnRpY3MsXG4vLyBpbmNsdWRpbmcgdGhlIG9uZXMgdGhhdCB3ZXJlIGluaGVyaXRlZCBmcm9tIHRoZSBzdXBlci1zZW1hbnRpY3MsIGFncmVlIHdpdGggdGhlIGdyYW1tYXIuXG4vLyBUaHJvd3MgYW4gZXhjZXB0aW9uIGlmIG9uZSBvciBtb3JlIG9mIHRoZW0gZG9lc24ndC5cblNlbWFudGljcy5wcm90b3R5cGUuY2hlY2tBY3Rpb25EaWN0cyA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBuYW1lIGluIHRoaXMub3BlcmF0aW9ucykge1xuICAgIHRoaXMub3BlcmF0aW9uc1tuYW1lXS5jaGVja0FjdGlvbkRpY3QodGhpcy5ncmFtbWFyKTtcbiAgfVxuICBmb3IgKG5hbWUgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgdGhpcy5hdHRyaWJ1dGVzW25hbWVdLmNoZWNrQWN0aW9uRGljdCh0aGlzLmdyYW1tYXIpO1xuICB9XG59O1xuXG5TZW1hbnRpY3MucHJvdG90eXBlLmFkZE9wZXJhdGlvbk9yQXR0cmlidXRlID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgYWN0aW9uRGljdCkge1xuICB2YXIgdHlwZVBsdXJhbCA9IHR5cGUgKyAncyc7XG4gIHZhciBDdG9yID0gdHlwZSA9PT0gJ29wZXJhdGlvbicgPyBPcGVyYXRpb24gOiBBdHRyaWJ1dGU7XG5cbiAgdGhpcy5hc3NlcnROZXdOYW1lKG5hbWUsIHR5cGUpO1xuXG4gIC8vIENyZWF0ZSB0aGUgYWN0aW9uIGRpY3Rpb25hcnkgZm9yIHRoaXMgb3BlcmF0aW9uIC8gYXR0cmlidXRlLiBXZSBiZWdpbiBieSBkZWZpbmluZyB0aGUgZGVmYXVsdFxuICAvLyBiZWhhdmlvciBvZiB0ZXJtaW5hbCBhbmQgaXRlcmF0aW9uIG5vZGVzLCBhbmQgYWRkIGEgJ19kZWZhdWx0JyBhY3Rpb24gdGhhdCB0aHJvd3MgYW4gZXJyb3IgaWZcbiAgLy8gYSBydWxlIGluIHRoZSBncmFtbWFyIGRvZXNuJ3QgaGF2ZSBhIGNvcnJlc3BvbmRpbmcgYWN0aW9uIGluIHRoaXMgb3BlcmF0aW9uIC8gYXR0cmlidXRlLi4uXG4gIHZhciByZWFsQWN0aW9uRGljdCA9IHtcbiAgICBfdGVybWluYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJpbWl0aXZlVmFsdWU7XG4gICAgfSxcbiAgICBfaXRlcjogZnVuY3Rpb24oY2hpbGRyZW4pIHtcbiAgICAgIC8vIFRoaXMgQ1NUIG5vZGUgY29ycmVzcG9uZHMgdG8gYW4gaXRlcmF0aW9uIGV4cHJlc3Npb24gaW4gdGhlIGdyYW1tYXIgKCosICssIG9yID8pLiBUaGVcbiAgICAgIC8vIGRlZmF1bHQgYmVoYXZpb3IgaXMgdG8gbWFwIHRoaXMgb3BlcmF0aW9uIG9yIGF0dHJpYnV0ZSBvdmVyIGFsbCBvZiBpdHMgY2hpbGQgbm9kZXMuXG4gICAgICB2YXIgdGhpc1NlbWFudGljcyA9IHRoaXMuX3NlbWFudGljcztcbiAgICAgIHZhciB0aGlzVGhpbmcgPSB0aGlzU2VtYW50aWNzW3R5cGVQbHVyYWxdW25hbWVdO1xuICAgICAgcmV0dXJuIGNoaWxkcmVuLm1hcChmdW5jdGlvbihjaGlsZCkgeyByZXR1cm4gdGhpc1RoaW5nLmV4ZWN1dGUodGhpc1NlbWFudGljcywgY2hpbGQpOyB9KTtcbiAgICB9LFxuICAgIF9kZWZhdWx0OiBmdW5jdGlvbihjaGlsZHJlbikge1xuICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB2YXIgdGhpc1NlbWFudGljcyA9IHRoaXMuX3NlbWFudGljcztcbiAgICAgICAgdmFyIHRoaXNUaGluZyA9IHRoaXNTZW1hbnRpY3NbdHlwZVBsdXJhbF1bbmFtZV07XG4gICAgICAgIHJldHVybiB0aGlzVGhpbmcuZXhlY3V0ZSh0aGlzU2VtYW50aWNzLCBjaGlsZHJlblswXSk7XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21pc3Npbmcgc2VtYW50aWMgYWN0aW9uIGZvciAnICsgdGhpcy5jdG9yTmFtZSArICcgaW4gJyArIG5hbWUgKyAnICcgKyB0eXBlKTtcbiAgICB9XG4gIH07XG4gIC8vIC4uLiBhbmQgYWRkIGluIHRoZSBhY3Rpb25zIHN1cHBsaWVkIGJ5IHRoZSBwcm9ncmFtbWVyLCB3aGljaCBtYXkgb3ZlcnJpZGUgc29tZSBvciBhbGwgb2YgdGhlXG4gIC8vIGRlZmF1bHQgb25lcy5cbiAgT2JqZWN0LmtleXMoYWN0aW9uRGljdCkuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgcmVhbEFjdGlvbkRpY3RbbmFtZV0gPSBhY3Rpb25EaWN0W25hbWVdO1xuICB9KTtcblxuICB0aGlzW3R5cGVQbHVyYWxdW25hbWVdID0gbmV3IEN0b3IobmFtZSwgcmVhbEFjdGlvbkRpY3QpO1xuXG4gIC8vIFRoZSBmb2xsb3dpbmcgY2hlY2sgaXMgbm90IHN0cmljdGx5IG5lY2Vzc2FyeSAoaXQgd2lsbCBoYXBwZW4gbGF0ZXIgYW55d2F5KSBidXQgaXQncyBiZXR0ZXIgdG9cbiAgLy8gY2F0Y2ggZXJyb3JzIGVhcmx5LlxuICB0aGlzW3R5cGVQbHVyYWxdW25hbWVdLmNoZWNrQWN0aW9uRGljdCh0aGlzLmdyYW1tYXIpO1xuXG4gIGZ1bmN0aW9uIGRvSXQoKSB7XG4gICAgLy8gRGlzcGF0Y2ggdG8gbW9zdCBzcGVjaWZpYyB2ZXJzaW9uIG9mIHRoaXMgb3BlcmF0aW9uIC8gYXR0cmlidXRlIC0tIGl0IG1heSBoYXZlIGJlZW5cbiAgICAvLyBvdmVycmlkZGVuIGJ5IGEgc3ViLXNlbWFudGljcy5cbiAgICB2YXIgdGhpc1RoaW5nID0gdGhpcy5fc2VtYW50aWNzW3R5cGVQbHVyYWxdW25hbWVdO1xuICAgIHJldHVybiB0aGlzVGhpbmcuZXhlY3V0ZSh0aGlzLl9zZW1hbnRpY3MsIHRoaXMpO1xuICB9XG5cbiAgaWYgKHR5cGUgPT09ICdvcGVyYXRpb24nKSB7XG4gICAgdGhpcy5XcmFwcGVyLnByb3RvdHlwZVtuYW1lXSA9IGRvSXQ7XG4gICAgdGhpcy5XcmFwcGVyLnByb3RvdHlwZVtuYW1lXS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICdbJyArIG5hbWUgKyAnIG9wZXJhdGlvbl0nO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuV3JhcHBlci5wcm90b3R5cGUsIG5hbWUsIHtnZXQ6IGRvSXR9KTtcbiAgICB0aGlzLmF0dHJpYnV0ZUtleXNbbmFtZV0gPSBTeW1ib2woKTtcbiAgfVxufTtcblxuU2VtYW50aWNzLnByb3RvdHlwZS5leHRlbmRPcGVyYXRpb25PckF0dHJpYnV0ZSA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIGFjdGlvbkRpY3QpIHtcbiAgdmFyIHR5cGVQbHVyYWwgPSB0eXBlICsgJ3MnO1xuICB2YXIgQ3RvciA9IHR5cGUgPT09ICdvcGVyYXRpb24nID8gT3BlcmF0aW9uIDogQXR0cmlidXRlO1xuXG4gIGlmICghKHRoaXMuc3VwZXIgJiYgbmFtZSBpbiB0aGlzLnN1cGVyW3R5cGVQbHVyYWxdKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGV4dGVuZCAnICsgdHlwZSArIFwiICdcIiArIG5hbWUgK1xuICAgICAgICBcIic6IGRpZCBub3QgaW5oZXJpdCBhbiBcIiArIHR5cGUgKyAnIHdpdGggdGhhdCBuYW1lJyk7XG4gIH1cbiAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzW3R5cGVQbHVyYWxdLCBuYW1lKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGV4dGVuZCAnICsgdHlwZSArIFwiICdcIiArIG5hbWUgKyBcIicgYWdhaW5cIik7XG4gIH1cblxuICAvLyBDcmVhdGUgYSBuZXcgb3BlcmF0aW9uIC8gYXR0cmlidXRlIHdob3NlIGFjdGlvbkRpY3QgZGVsZWdhdGVzIHRvIHRoZSBzdXBlciBvcGVyYXRpb24gL1xuICAvLyBhdHRyaWJ1dGUncyBhY3Rpb25EaWN0LCBhbmQgd2hpY2ggaGFzIGFsbCB0aGUga2V5cyBmcm9tIGBpbmhlcml0ZWRBY3Rpb25EaWN0YC5cbiAgdmFyIGluaGVyaXRlZEFjdGlvbkRpY3QgPSB0aGlzW3R5cGVQbHVyYWxdW25hbWVdLmFjdGlvbkRpY3Q7XG4gIHZhciBuZXdBY3Rpb25EaWN0ID0gT2JqZWN0LmNyZWF0ZShpbmhlcml0ZWRBY3Rpb25EaWN0KTtcbiAgT2JqZWN0LmtleXMoYWN0aW9uRGljdCkuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgbmV3QWN0aW9uRGljdFtuYW1lXSA9IGFjdGlvbkRpY3RbbmFtZV07XG4gIH0pO1xuXG4gIHRoaXNbdHlwZVBsdXJhbF1bbmFtZV0gPSBuZXcgQ3RvcihuYW1lLCBuZXdBY3Rpb25EaWN0KTtcblxuICAvLyBUaGUgZm9sbG93aW5nIGNoZWNrIGlzIG5vdCBzdHJpY3RseSBuZWNlc3NhcnkgKGl0IHdpbGwgaGFwcGVuIGxhdGVyIGFueXdheSkgYnV0IGl0J3MgYmV0dGVyIHRvXG4gIC8vIGNhdGNoIGVycm9ycyBlYXJseS5cbiAgdGhpc1t0eXBlUGx1cmFsXVtuYW1lXS5jaGVja0FjdGlvbkRpY3QodGhpcy5ncmFtbWFyKTtcbn07XG5cblNlbWFudGljcy5wcm90b3R5cGUuYXNzZXJ0TmV3TmFtZSA9IGZ1bmN0aW9uKG5hbWUsIHR5cGUpIHtcbiAgaWYgKFdyYXBwZXIucHJvdG90eXBlLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnQ2Fubm90IGFkZCAnICsgdHlwZSArIFwiICdcIiArIG5hbWUgKyBcIic6IHRoYXQncyBhIHJlc2VydmVkIG5hbWVcIik7XG4gIH1cbiAgaWYgKG5hbWUgaW4gdGhpcy5vcGVyYXRpb25zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnQ2Fubm90IGFkZCAnICsgdHlwZSArIFwiICdcIiArIG5hbWUgKyBcIic6IGFuIG9wZXJhdGlvbiB3aXRoIHRoYXQgbmFtZSBhbHJlYWR5IGV4aXN0c1wiKTtcbiAgfVxuICBpZiAobmFtZSBpbiB0aGlzLmF0dHJpYnV0ZXMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdDYW5ub3QgYWRkICcgKyB0eXBlICsgXCIgJ1wiICsgbmFtZSArIFwiJzogYW4gYXR0cmlidXRlIHdpdGggdGhhdCBuYW1lIGFscmVhZHkgZXhpc3RzXCIpO1xuICB9XG59O1xuXG4vLyBSZXR1cm5zIGEgd3JhcHBlciBmb3IgdGhlIGdpdmVuIENTVCBgbm9kZWAgaW4gdGhpcyBzZW1hbnRpY3MuXG5TZW1hbnRpY3MucHJvdG90eXBlLndyYXAgPSBmdW5jdGlvbihub2RlKSB7XG4gIHJldHVybiBuZXcgdGhpcy5XcmFwcGVyKG5vZGUpO1xufTtcblxuLy8gQ3JlYXRlcyBhIG5ldyBTZW1hbnRpY3MgaW5zdGFuY2UgZm9yIGBncmFtbWFyYCwgaW5oZXJpdGluZyBvcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzIGZyb21cbi8vIGBvcHRTdXBlclNlbWFudGljc2AsIGlmIGl0IGlzIHNwZWNpZmllZC4gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgYWN0cyBhcyBhIHByb3h5IGZvciB0aGUgbmV3XG4vLyBTZW1hbnRpY3MgaW5zdGFuY2UuIFdoZW4gdGhhdCBmdW5jdGlvbiBpcyBpbnZva2VkIHdpdGggYSBDU1Qgbm9kZSBhcyBhbiBhcmd1bWVudCwgaXQgcmV0dXJuc1xuLy8gYSB3cmFwcGVyIGZvciB0aGF0IG5vZGUgd2hpY2ggZ2l2ZXMgYWNjZXNzIHRvIHRoZSBvcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzIHByb3ZpZGVkIGJ5IHRoaXNcbi8vIHNlbWFudGljcy5cblNlbWFudGljcy5jcmVhdGVTZW1hbnRpY3MgPSBmdW5jdGlvbihncmFtbWFyLCBvcHRTdXBlclNlbWFudGljcykge1xuICB2YXIgcyA9IG5ldyBTZW1hbnRpY3MoZ3JhbW1hciwgb3B0U3VwZXJTZW1hbnRpY3MpO1xuXG4gIC8vIFRvIGVuYWJsZSBjbGllbnRzIHRvIGludm9rZSBhIHNlbWFudGljcyBsaWtlIGEgZnVuY3Rpb24sIHJldHVybiBhIGZ1bmN0aW9uIHRoYXQgYWN0cyBhcyBhIHByb3h5XG4gIC8vIGZvciBgc2AsIHdoaWNoIGlzIHRoZSByZWFsIGBTZW1hbnRpY3NgIGluc3RhbmNlLlxuICB2YXIgcHJveHkgPSBmdW5jdGlvbiBBU2VtYW50aWNzKG1hdGNoUmVzdWx0KSB7XG4gICAgaWYgKCEobWF0Y2hSZXN1bHQgaW5zdGFuY2VvZiBNYXRjaFJlc3VsdCkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgJ1NlbWFudGljcyBleHBlY3RlZCBhIE1hdGNoUmVzdWx0LCBidXQgZ290ICcgKyBjb21tb24udW5leHBlY3RlZE9ialRvU3RyaW5nKG1hdGNoUmVzdWx0KSk7XG4gICAgfVxuICAgIGlmICghbWF0Y2hSZXN1bHQuc3VjY2VlZGVkKCkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgJ2Nhbm5vdCBhcHBseSBTZW1hbnRpY3MgdG8gJyArIG1hdGNoUmVzdWx0LnRvU3RyaW5nKCkpO1xuICAgIH1cblxuICAgIHZhciBjc3QgPSBtYXRjaFJlc3VsdC5fY3N0O1xuICAgIGlmIChjc3QuZ3JhbW1hciAhPT0gZ3JhbW1hcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIFwiQ2Fubm90IHVzZSBhIENTVCBub2RlIGNyZWF0ZWQgYnkgZ3JhbW1hciAnXCIgKyBjc3QuZ3JhbW1hci5uYW1lICtcbiAgICAgICAgICBcIicgd2l0aCBhIHNlbWFudGljcyBmb3IgJ1wiICsgZ3JhbW1hci5uYW1lICsgXCInXCIpO1xuICAgIH1cbiAgICByZXR1cm4gcy53cmFwKGNzdCk7XG4gIH07XG5cbiAgLy8gRm9yd2FyZCBwdWJsaWMgbWV0aG9kcyBmcm9tIHRoZSBwcm94eSB0byB0aGUgc2VtYW50aWNzIGluc3RhbmNlLlxuICBwcm94eS5hZGRPcGVyYXRpb24gPSBmdW5jdGlvbihuYW1lLCBhY3Rpb25EaWN0KSB7XG4gICAgcy5hZGRPcGVyYXRpb25PckF0dHJpYnV0ZS5jYWxsKHMsICdvcGVyYXRpb24nLCBuYW1lLCBhY3Rpb25EaWN0KTtcbiAgICByZXR1cm4gcHJveHk7XG4gIH07XG4gIHByb3h5LmV4dGVuZE9wZXJhdGlvbiA9IGZ1bmN0aW9uKG5hbWUsIGFjdGlvbkRpY3QpIHtcbiAgICBzLmV4dGVuZE9wZXJhdGlvbk9yQXR0cmlidXRlLmNhbGwocywgJ29wZXJhdGlvbicsIG5hbWUsIGFjdGlvbkRpY3QpO1xuICAgIHJldHVybiBwcm94eTtcbiAgfTtcbiAgcHJveHkuYWRkQXR0cmlidXRlID0gZnVuY3Rpb24obmFtZSwgYWN0aW9uRGljdCkge1xuICAgIHMuYWRkT3BlcmF0aW9uT3JBdHRyaWJ1dGUuY2FsbChzLCAnYXR0cmlidXRlJywgbmFtZSwgYWN0aW9uRGljdCk7XG4gICAgcmV0dXJuIHByb3h5O1xuICB9O1xuICBwcm94eS5leHRlbmRBdHRyaWJ1dGUgPSBmdW5jdGlvbihuYW1lLCBhY3Rpb25EaWN0KSB7XG4gICAgcy5leHRlbmRPcGVyYXRpb25PckF0dHJpYnV0ZS5jYWxsKHMsICdhdHRyaWJ1dGUnLCBuYW1lLCBhY3Rpb25EaWN0KTtcbiAgICByZXR1cm4gcHJveHk7XG4gIH07XG5cbiAgLy8gTWFrZSB0aGUgcHJveHkncyB0b1N0cmluZygpIHdvcmsuXG4gIHByb3h5LnRvU3RyaW5nID0gcy50b1N0cmluZy5iaW5kKHMpO1xuXG4gIC8vIFJldHVybnMgdGhlIHNlbWFudGljcyBmb3IgdGhlIHByb3h5LlxuICBwcm94eS5fZ2V0U2VtYW50aWNzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHM7XG4gIH07XG5cbiAgcmV0dXJuIHByb3h5O1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gT3BlcmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEFuIE9wZXJhdGlvbiByZXByZXNlbnRzIGEgZnVuY3Rpb24gdG8gYmUgYXBwbGllZCB0byBhIGNvbmNyZXRlIHN5bnRheCB0cmVlIChDU1QpIC0tIGl0J3MgdmVyeVxuLy8gc2ltaWxhciB0byBhIFZpc2l0b3IgKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVmlzaXRvcl9wYXR0ZXJuKS4gQW4gb3BlcmF0aW9uIGlzIGV4ZWN1dGVkIGJ5XG4vLyByZWN1cnNpdmVseSB3YWxraW5nIHRoZSBDU1QsIGFuZCBhdCBlYWNoIG5vZGUsIGludm9raW5nIHRoZSBtYXRjaGluZyBzZW1hbnRpYyBhY3Rpb24gZnJvbVxuLy8gYGFjdGlvbkRpY3RgLiBTZWUgYE9wZXJhdGlvbi5wcm90b3R5cGUuZXhlY3V0ZWAgZm9yIGRldGFpbHMgb2YgaG93IGEgQ1NUIG5vZGUncyBtYXRjaGluZyBzZW1hbnRpY1xuLy8gYWN0aW9uIGlzIGZvdW5kLlxuZnVuY3Rpb24gT3BlcmF0aW9uKG5hbWUsIGFjdGlvbkRpY3QpIHtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbiAgdGhpcy5hY3Rpb25EaWN0ID0gYWN0aW9uRGljdDtcbn1cblxuT3BlcmF0aW9uLnByb3RvdHlwZS50eXBlTmFtZSA9ICdvcGVyYXRpb24nO1xuXG5PcGVyYXRpb24ucHJvdG90eXBlLmNoZWNrQWN0aW9uRGljdCA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgZ3JhbW1hci5fY2hlY2tUb3BEb3duQWN0aW9uRGljdCh0aGlzLnR5cGVOYW1lLCB0aGlzLm5hbWUsIHRoaXMuYWN0aW9uRGljdCk7XG59O1xuXG4vLyBFeGVjdXRlIHRoaXMgb3BlcmF0aW9uIG9uIHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggYG5vZGVXcmFwcGVyYCBpbiB0aGUgY29udGV4dCBvZiB0aGUgZ2l2ZW5cbi8vIFNlbWFudGljcyBpbnN0YW5jZS5cbk9wZXJhdGlvbi5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uKHNlbWFudGljcywgbm9kZVdyYXBwZXIpIHtcbiAgLy8gTG9vayBmb3IgYSBzZW1hbnRpYyBhY3Rpb24gd2hvc2UgbmFtZSBtYXRjaGVzIHRoZSBub2RlJ3MgY29uc3RydWN0b3IgbmFtZSwgd2hpY2ggaXMgZWl0aGVyIHRoZVxuICAvLyBuYW1lIG9mIGEgcnVsZSBpbiB0aGUgZ3JhbW1hciwgb3IgJ190ZXJtaW5hbCcgKGZvciBhIHRlcm1pbmFsIG5vZGUpLCBvciAnX2l0ZXInIChmb3IgYW5cbiAgLy8gaXRlcmF0aW9uIG5vZGUpLiBJbiB0aGUgbGF0dGVyIGNhc2UsIHRoZSBhY3Rpb24gZnVuY3Rpb24gcmVjZWl2ZXMgYSBzaW5nbGUgYXJndW1lbnQsIHdoaWNoIGlzXG4gIC8vIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBjaGlsZHJlbiBvZiB0aGUgQ1NUIG5vZGUuXG4gIHZhciBhY3Rpb25GbiA9IHRoaXMuYWN0aW9uRGljdFtub2RlV3JhcHBlci5fbm9kZS5jdG9yTmFtZV07XG4gIGlmIChhY3Rpb25Gbikge1xuICAgIHJldHVybiB0aGlzLmRvQWN0aW9uKHNlbWFudGljcywgbm9kZVdyYXBwZXIsIGFjdGlvbkZuLCBub2RlV3JhcHBlci5pc0l0ZXJhdGlvbigpKTtcbiAgfVxuXG4gIC8vIFRoZSBhY3Rpb24gZGljdGlvbmFyeSBkb2VzIG5vdCBjb250YWluIGEgc2VtYW50aWMgYWN0aW9uIGZvciB0aGlzIHNwZWNpZmljIHR5cGUgb2Ygbm9kZSwgc29cbiAgLy8gaW52b2tlIHRoZSAnX2RlZmF1bHQnIHNlbWFudGljIGFjdGlvbi4gVGhlIGJ1aWx0LWluIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgX2RlZmF1bHRgIHNlbWFudGljXG4gIC8vIGFjdGlvbiBqdXN0IHRocm93cyBhbiBlcnJvciwgYnV0IHRoZSBwcm9ncmFtbWVyIG1heSBoYXZlIG92ZXJyaWRkZW4gaXQuXG4gIHJldHVybiB0aGlzLmRvQWN0aW9uKHNlbWFudGljcywgbm9kZVdyYXBwZXIsIHRoaXMuYWN0aW9uRGljdC5fZGVmYXVsdCwgdHJ1ZSk7XG59O1xuXG4vLyBJbnZva2UgYGFjdGlvbkZuYCBvbiB0aGUgQ1NUIG5vZGUgdGhhdCBjb3JyZXNwb25kcyB0byBgbm9kZVdyYXBwZXJgLCBpbiB0aGUgY29udGV4dCBvZlxuLy8gYHNlbWFudGljc2AuIElmIGBvcHRQYXNzQ2hpbGRyZW5Bc0FycmF5YCBpcyB0cnVlLCBgYWN0aW9uRm5gIHdpbGwgYmUgY2FsbGVkIHdpdGggYSBzaW5nbGVcbi8vIGFyZ3VtZW50LCB3aGljaCBpcyBhbiBhcnJheSBvZiB3cmFwcGVycy4gT3RoZXJ3aXNlLCB0aGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBgYWN0aW9uRm5gIHdpbGxcbi8vIGJlIGVxdWFsIHRvIHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gaW4gdGhlIENTVCBub2RlLlxuT3BlcmF0aW9uLnByb3RvdHlwZS5kb0FjdGlvbiA9IGZ1bmN0aW9uKHNlbWFudGljcywgbm9kZVdyYXBwZXIsIGFjdGlvbkZuLCBvcHRQYXNzQ2hpbGRyZW5Bc0FycmF5KSB7XG4gIHJldHVybiBvcHRQYXNzQ2hpbGRyZW5Bc0FycmF5ID9cbiAgICAgIGFjdGlvbkZuLmNhbGwobm9kZVdyYXBwZXIsIG5vZGVXcmFwcGVyLl9jaGlsZHJlbigpKSA6XG4gICAgICBhY3Rpb25Gbi5hcHBseShub2RlV3JhcHBlciwgbm9kZVdyYXBwZXIuX2NoaWxkcmVuKCkpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gQXR0cmlidXRlIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEF0dHJpYnV0ZXMgYXJlIE9wZXJhdGlvbnMgd2hvc2UgcmVzdWx0cyBhcmUgbWVtb2l6ZWQuIFRoaXMgbWVhbnMgdGhhdCwgZm9yIGFueSBnaXZlbiBzZW1hbnRpY3MsXG4vLyB0aGUgc2VtYW50aWMgYWN0aW9uIGZvciBhIENTVCBub2RlIHdpbGwgYmUgaW52b2tlZCBubyBtb3JlIHRoYW4gb25jZS5cbmZ1bmN0aW9uIEF0dHJpYnV0ZShuYW1lLCBhY3Rpb25EaWN0KSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuYWN0aW9uRGljdCA9IGFjdGlvbkRpY3Q7XG59XG5pbmhlcml0cyhBdHRyaWJ1dGUsIE9wZXJhdGlvbik7XG5cbkF0dHJpYnV0ZS5wcm90b3R5cGUudHlwZU5hbWUgPSAnYXR0cmlidXRlJztcblxuQXR0cmlidXRlLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24oc2VtYW50aWNzLCBub2RlV3JhcHBlcikge1xuICB2YXIgbm9kZSA9IG5vZGVXcmFwcGVyLl9ub2RlO1xuICB2YXIga2V5ID0gc2VtYW50aWNzLmF0dHJpYnV0ZUtleXNbdGhpcy5uYW1lXTtcbiAgaWYgKCFub2RlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAvLyBUaGUgZm9sbG93aW5nIGlzIGEgc3VwZXItc2VuZCAtLSBpc24ndCBKUyBiZWF1dGlmdWw/IDovXG4gICAgbm9kZVtrZXldID0gT3BlcmF0aW9uLnByb3RvdHlwZS5leGVjdXRlLmNhbGwodGhpcywgc2VtYW50aWNzLCBub2RlV3JhcHBlcik7XG4gIH1cbiAgcmV0dXJuIG5vZGVba2V5XTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlbWFudGljcztcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBQb3NJbmZvID0gcmVxdWlyZSgnLi9Qb3NJbmZvJyk7XG52YXIgVHJhY2UgPSByZXF1aXJlKCcuL1RyYWNlJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBhcHBseVNwYWNlc18gPSBuZXcgcGV4cHJzLkFwcGx5KCdzcGFjZXNfJyk7XG5cbmZ1bmN0aW9uIFN0YXRlKGdyYW1tYXIsIGlucHV0U3RyZWFtLCBzdGFydFJ1bGUsIHRyYWNpbmdFbmFibGVkKSB7XG4gIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG4gIHRoaXMub3JpZ0lucHV0U3RyZWFtID0gaW5wdXRTdHJlYW07XG4gIHRoaXMuc3RhcnRSdWxlID0gc3RhcnRSdWxlO1xuICB0aGlzLnRyYWNpbmdFbmFibGVkID0gdHJhY2luZ0VuYWJsZWQ7XG4gIHRoaXMucmlnaHRtb3N0RmFpbFBvcyA9IC0xO1xuICB0aGlzLmluaXQoKTtcbn1cblxuU3RhdGUucHJvdG90eXBlID0ge1xuICBpbml0OiBmdW5jdGlvbihvcHRGYWlsdXJlc0FycmF5KSB7XG4gICAgdGhpcy5pbnB1dFN0cmVhbVN0YWNrID0gW107XG4gICAgdGhpcy5wb3NJbmZvc1N0YWNrID0gW107XG4gICAgdGhpcy5wdXNoSW5wdXRTdHJlYW0odGhpcy5vcmlnSW5wdXRTdHJlYW0pO1xuICAgIHRoaXMuYXBwbGljYXRpb25TdGFjayA9IFtdO1xuICAgIHRoaXMuYmluZGluZ3MgPSBbXTtcbiAgICB0aGlzLmZhaWx1cmVzID0gb3B0RmFpbHVyZXNBcnJheTtcbiAgICB0aGlzLmlnbm9yZUZhaWx1cmVzQ291bnQgPSAwO1xuICAgIGlmICh0aGlzLmlzVHJhY2luZygpKSB7XG4gICAgICB0aGlzLnRyYWNlID0gW107XG4gICAgfVxuICB9LFxuXG4gIGN1cnJlbnRBcHBsaWNhdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwbGljYXRpb25TdGFja1t0aGlzLmFwcGxpY2F0aW9uU3RhY2subGVuZ3RoIC0gMV07XG4gIH0sXG5cbiAgaW5TeW50YWN0aWNSdWxlOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRTdHJlYW0uc291cmNlICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgY3VycmVudEFwcGxpY2F0aW9uID0gdGhpcy5jdXJyZW50QXBwbGljYXRpb24oKTtcbiAgICByZXR1cm4gY3VycmVudEFwcGxpY2F0aW9uICYmIGN1cnJlbnRBcHBsaWNhdGlvbi5pc1N5bnRhY3RpYygpO1xuICB9LFxuXG4gIHNraXBTcGFjZXM6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaWdub3JlRmFpbHVyZXMoKTtcbiAgICBhcHBseVNwYWNlc18uZXZhbCh0aGlzKTtcbiAgICB0aGlzLmJpbmRpbmdzLnBvcCgpO1xuICAgIHRoaXMucmVjb3JkRmFpbHVyZXMoKTtcbiAgICByZXR1cm4gdGhpcy5pbnB1dFN0cmVhbS5wb3M7XG4gIH0sXG5cbiAgc2tpcFNwYWNlc0lmSW5TeW50YWN0aWNDb250ZXh0OiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5pblN5bnRhY3RpY1J1bGUoKSkge1xuICAgICAgdGhpcy5za2lwU3BhY2VzKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmlucHV0U3RyZWFtLnBvcztcbiAgfSxcblxuICB0cnVuY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihuZXdMZW5ndGgpIHtcbiAgICB3aGlsZSAodGhpcy5iaW5kaW5ncy5sZW5ndGggPiBuZXdMZW5ndGgpIHtcbiAgICAgIHRoaXMuYmluZGluZ3MucG9wKCk7XG4gICAgfVxuICB9LFxuXG4gIHB1c2hJbnB1dFN0cmVhbTogZnVuY3Rpb24oaW5wdXRTdHJlYW0pIHtcbiAgICB0aGlzLmlucHV0U3RyZWFtU3RhY2sucHVzaCh0aGlzLmlucHV0U3RyZWFtKTtcbiAgICB0aGlzLnBvc0luZm9zU3RhY2sucHVzaCh0aGlzLnBvc0luZm9zKTtcbiAgICB0aGlzLmlucHV0U3RyZWFtID0gaW5wdXRTdHJlYW07XG4gICAgdGhpcy5wb3NJbmZvcyA9IFtdO1xuICB9LFxuXG4gIHBvcElucHV0U3RyZWFtOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmlucHV0U3RyZWFtID0gdGhpcy5pbnB1dFN0cmVhbVN0YWNrLnBvcCgpO1xuICAgIHRoaXMucG9zSW5mb3MgPSB0aGlzLnBvc0luZm9zU3RhY2sucG9wKCk7XG4gIH0sXG5cbiAgZ2V0Q3VycmVudFBvc0luZm86IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBvc0luZm8odGhpcy5pbnB1dFN0cmVhbS5wb3MpO1xuICB9LFxuXG4gIGdldFBvc0luZm86IGZ1bmN0aW9uKHBvcykge1xuICAgIHZhciBwb3NJbmZvID0gdGhpcy5wb3NJbmZvc1twb3NdO1xuICAgIHJldHVybiBwb3NJbmZvIHx8ICh0aGlzLnBvc0luZm9zW3Bvc10gPSBuZXcgUG9zSW5mbyh0aGlzLmFwcGxpY2F0aW9uU3RhY2spKTtcbiAgfSxcblxuICByZWNvcmRGYWlsdXJlOiBmdW5jdGlvbihwb3MsIGV4cHIpIHtcbiAgICBpZiAodGhpcy5pZ25vcmVGYWlsdXJlc0NvdW50ID4gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocG9zIDwgdGhpcy5yaWdodG1vc3RGYWlsUG9zKSB7XG4gICAgICAvLyBpdCB3b3VsZCBiZSB1c2VsZXNzIHRvIHJlY29yZCB0aGlzIGZhaWx1cmUsIHNvIGRvbid0IGRvIGl0XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmIChwb3MgPiB0aGlzLnJpZ2h0bW9zdEZhaWxQb3MpIHtcbiAgICAgIC8vIG5ldyByaWdodG1vc3QgZmFpbHVyZSFcbiAgICAgIHRoaXMucmlnaHRtb3N0RmFpbFBvcyA9IHBvcztcbiAgICB9XG4gICAgaWYgKCF0aGlzLmZhaWx1cmVzKSB7XG4gICAgICAvLyB3ZSdyZSBub3QgcmVhbGx5IHJlY29yZGluZyBmYWlsdXJlcywgc28gd2UncmUgZG9uZVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRPRE86IGNvbnNpZGVyIG1ha2luZyB0aGlzIGNvZGUgbW9yZSBPTywgZS5nLiwgYWRkIGFuIEV4cHJBbmRTdGFja3MgY2xhc3NcbiAgICAvLyB0aGF0IHN1cHBvcnRzIGFuIGFkZFN0YWNrKHN0YWNrKSBtZXRob2QuXG4gICAgZnVuY3Rpb24gYWRkU3RhY2soc3RhY2ssIHN0YWNrcykge1xuICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgc3RhY2tzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgdmFyIG90aGVyU3RhY2sgPSBzdGFja3NbaWR4XTtcbiAgICAgICAgaWYgKHN0YWNrLmxlbmd0aCAhPT0gb3RoZXJTdGFjay5sZW5ndGgpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpZHgyID0gMDsgaWR4MiA8IHN0YWNrLmxlbmd0aDsgaWR4MisrKSB7XG4gICAgICAgICAgaWYgKHN0YWNrW2lkeDJdICE9PSBvdGhlclN0YWNrW2lkeDJdKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlkeDIgPT09IHN0YWNrLmxlbmd0aCkge1xuICAgICAgICAgIC8vIGZvdW5kIGl0LCBubyBuZWVkIHRvIGFkZFxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc3RhY2tzLnB1c2goc3RhY2spO1xuICAgIH1cblxuICAgIC8vIEFub3RoZXIgZmFpbHVyZSBhdCByaWdodC1tb3N0IHBvc2l0aW9uIC0tIHJlY29yZCBpdCBpZiBpdCB3YXNuJ3QgYWxyZWFkeS5cbiAgICB2YXIgc3RhY2sgPSB0aGlzLmFwcGxpY2F0aW9uU3RhY2suc2xpY2UoKTtcbiAgICB2YXIgZXhwcnNBbmRTdGFja3MgPSB0aGlzLmZhaWx1cmVzO1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGV4cHJzQW5kU3RhY2tzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBleHByQW5kU3RhY2tzID0gZXhwcnNBbmRTdGFja3NbaWR4XTtcbiAgICAgIGlmIChleHByQW5kU3RhY2tzLmV4cHIgPT09IGV4cHIpIHtcbiAgICAgICAgYWRkU3RhY2soc3RhY2ssIGV4cHJBbmRTdGFja3Muc3RhY2tzKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBleHByc0FuZFN0YWNrcy5wdXNoKHtleHByOiBleHByLCBzdGFja3M6IFtzdGFja119KTtcbiAgfSxcblxuICBpZ25vcmVGYWlsdXJlczogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pZ25vcmVGYWlsdXJlc0NvdW50Kys7XG4gIH0sXG5cbiAgcmVjb3JkRmFpbHVyZXM6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaWdub3JlRmFpbHVyZXNDb3VudC0tO1xuICB9LFxuXG4gIGdldEZhaWx1cmVzUG9zOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yaWdodG1vc3RGYWlsUG9zO1xuICB9LFxuXG4gIGdldEZhaWx1cmVzOiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuZmFpbHVyZXMpIHtcbiAgICAgIC8vIFJld2luZCwgdGhlbiB0cnkgdG8gbWF0Y2ggdGhlIGlucHV0IGFnYWluLCByZWNvcmRpbmcgZmFpbHVyZXMuXG4gICAgICB0aGlzLmluaXQoW10pO1xuICAgICAgdGhpcy50cmFjaW5nRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgdmFyIHN1Y2NlZWRlZCA9IG5ldyBwZXhwcnMuQXBwbHkodGhpcy5zdGFydFJ1bGUpLmV2YWwodGhpcyk7XG4gICAgICBpZiAoc3VjY2VlZGVkKSB7XG4gICAgICAgIHRoaXMuZmFpbHVyZXMgPSBbXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZmFpbHVyZXM7XG4gIH0sXG5cbiAgLy8gUmV0dXJucyB0aGUgbWVtb2l6ZWQgdHJhY2UgZW50cnkgZm9yIGBwb3NgIGFuZCBgZXhwcmAsIGlmIG9uZSBleGlzdHMuXG4gIGdldE1lbW9pemVkVHJhY2VFbnRyeTogZnVuY3Rpb24ocG9zLCBleHByKSB7XG4gICAgdmFyIHBvc0luZm8gPSB0aGlzLnBvc0luZm9zW3Bvc107XG4gICAgaWYgKHBvc0luZm8gJiYgZXhwci5ydWxlTmFtZSkge1xuICAgICAgdmFyIG1lbW9SZWMgPSBwb3NJbmZvLm1lbW9bZXhwci5ydWxlTmFtZV07XG4gICAgICBpZiAobWVtb1JlYykge1xuICAgICAgICByZXR1cm4gbWVtb1JlYy50cmFjZUVudHJ5O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcblxuICAvLyBNYWtlIGEgbmV3IHRyYWNlIGVudHJ5LCB1c2luZyB0aGUgY3VycmVudGx5IGFjdGl2ZSB0cmFjZSBhcnJheSBhcyB0aGVcbiAgLy8gbmV3IGVudHJ5J3MgY2hpbGRyZW4uXG4gIGdldFRyYWNlRW50cnk6IGZ1bmN0aW9uKHBvcywgZXhwciwgcmVzdWx0KSB7XG4gICAgdmFyIGVudHJ5ID0gdGhpcy5nZXRNZW1vaXplZFRyYWNlRW50cnkocG9zLCBleHByKTtcbiAgICBpZiAoIWVudHJ5KSB7XG4gICAgICBlbnRyeSA9IG5ldyBUcmFjZSh0aGlzLmlucHV0U3RyZWFtLCBwb3MsIGV4cHIsIHJlc3VsdCwgdGhpcy50cmFjZSk7XG4gICAgfVxuICAgIHJldHVybiBlbnRyeTtcbiAgfSxcblxuICBpc1RyYWNpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRyYWNpbmdFbmFibGVkO1xuICB9LFxuXG4gIGFwcGx5U3BhY2VzXzogYXBwbHlTcGFjZXNfXG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0ZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBJbnRlcnZhbCA9IHJlcXVpcmUoJy4vSW50ZXJ2YWwnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gVW5pY29kZSBjaGFyYWN0ZXJzIHRoYXQgYXJlIHVzZWQgaW4gdGhlIGB0b1N0cmluZ2Agb3V0cHV0LlxudmFyIEJBTExPVF9YID0gJ1xcdTI3MTcnO1xudmFyIENIRUNLX01BUksgPSAnXFx1MjcxMyc7XG52YXIgRE9UX09QRVJBVE9SID0gJ1xcdTIyQzUnO1xudmFyIFJJR0hUV0FSRFNfRE9VQkxFX0FSUk9XID0gJ1xcdTIxRDInO1xudmFyIFNZTUJPTF9GT1JfSE9SSVpPTlRBTF9UQUJVTEFUSU9OID0gJ1xcdTI0MDknO1xudmFyIFNZTUJPTF9GT1JfTElORV9GRUVEID0gJ1xcdTI0MEEnO1xudmFyIFNZTUJPTF9GT1JfQ0FSUklBR0VfUkVUVVJOID0gJ1xcdTI0MEQnO1xuXG5mdW5jdGlvbiBsaW5rTGVmdFJlY3Vyc2l2ZUNoaWxkcmVuKGNoaWxkcmVuKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICB2YXIgbmV4dENoaWxkID0gY2hpbGRyZW5baSArIDFdO1xuXG4gICAgaWYgKG5leHRDaGlsZCAmJiBjaGlsZC5leHByID09PSBuZXh0Q2hpbGQuZXhwcikge1xuICAgICAgY2hpbGQucmVwbGFjZWRCeSA9IG5leHRDaGlsZDtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc3BhY2VzKG4pIHtcbiAgcmV0dXJuIGNvbW1vbi5yZXBlYXQoJyAnLCBuKS5qb2luKCcnKTtcbn1cblxuLy8gUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgcG9ydGlvbiBvZiBgaW5wdXRTdHJlYW1gIGF0IG9mZnNldCBgcG9zYC5cbi8vIFRoZSByZXN1bHQgd2lsbCBjb250YWluIGV4YWN0bHkgYGxlbmAgY2hhcmFjdGVycy5cbmZ1bmN0aW9uIGdldElucHV0RXhjZXJwdChpbnB1dFN0cmVhbSwgcG9zLCBsZW4pIHtcbiAgdmFyIGV4Y2VycHQgPSBhc0VzY2FwZWRTdHJpbmcoaW5wdXRTdHJlYW0uc291cmNlU2xpY2UocG9zLCBwb3MgKyBsZW4pKTtcblxuICAvLyBQYWQgdGhlIG91dHB1dCBpZiBuZWNlc3NhcnkuXG4gIGlmIChleGNlcnB0Lmxlbmd0aCA8IGxlbikge1xuICAgIHJldHVybiBleGNlcnB0ICsgY29tbW9uLnJlcGVhdCgnICcsIGxlbiAtIGV4Y2VycHQubGVuZ3RoKS5qb2luKCcnKTtcbiAgfVxuICByZXR1cm4gZXhjZXJwdDtcbn1cblxuZnVuY3Rpb24gYXNFc2NhcGVkU3RyaW5nKG9iaikge1xuICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBSZXBsYWNlIG5vbi1wcmludGFibGUgY2hhcmFjdGVycyB3aXRoIHZpc2libGUgc3ltYm9scy5cbiAgICByZXR1cm4gb2JqXG4gICAgICAgIC5yZXBsYWNlKC8gL2csIERPVF9PUEVSQVRPUilcbiAgICAgICAgLnJlcGxhY2UoL1xcdC9nLCBTWU1CT0xfRk9SX0hPUklaT05UQUxfVEFCVUxBVElPTilcbiAgICAgICAgLnJlcGxhY2UoL1xcbi9nLCBTWU1CT0xfRk9SX0xJTkVfRkVFRClcbiAgICAgICAgLnJlcGxhY2UoL1xcci9nLCBTWU1CT0xfRk9SX0NBUlJJQUdFX1JFVFVSTik7XG4gIH1cbiAgcmV0dXJuIFN0cmluZyhvYmopO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBUcmFjZSAtLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBUcmFjZShpbnB1dFN0cmVhbSwgcG9zLCBleHByLCBhbnMsIG9wdENoaWxkcmVuKSB7XG4gIHRoaXMuY2hpbGRyZW4gPSBvcHRDaGlsZHJlbiB8fCBbXTtcbiAgdGhpcy5leHByID0gZXhwcjtcbiAgaWYgKGFucykge1xuICAgIHRoaXMuaW50ZXJ2YWwgPSBuZXcgSW50ZXJ2YWwoaW5wdXRTdHJlYW0sIHBvcywgaW5wdXRTdHJlYW0ucG9zKTtcbiAgfVxuICB0aGlzLmlzTGVmdFJlY3Vyc2l2ZSA9IGZhbHNlO1xuICB0aGlzLnBvcyA9IHBvcztcbiAgdGhpcy5pbnB1dFN0cmVhbSA9IGlucHV0U3RyZWFtO1xuICB0aGlzLnN1Y2NlZWRlZCA9ICEhYW5zO1xufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVHJhY2UucHJvdG90eXBlLCAnZGlzcGxheVN0cmluZycsIHtcbiAgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuZXhwci50b0Rpc3BsYXlTdHJpbmcoKTsgfVxufSk7XG5cblRyYWNlLnByb3RvdHlwZS5zZXRMZWZ0UmVjdXJzaXZlID0gZnVuY3Rpb24obGVmdFJlY3Vyc2l2ZSkge1xuICB0aGlzLmlzTGVmdFJlY3Vyc2l2ZSA9IGxlZnRSZWN1cnNpdmU7XG4gIGlmIChsZWZ0UmVjdXJzaXZlKSB7XG4gICAgbGlua0xlZnRSZWN1cnNpdmVDaGlsZHJlbih0aGlzLmNoaWxkcmVuKTtcbiAgfVxufTtcblxuLy8gUmVjdXJzaXZlbHkgdHJhdmVyc2UgdGhpcyB0cmFjZSBub2RlIGFuZCBhbGwgaXRzIGRlc2NlbmRlbnRzLCBjYWxsaW5nIGEgdmlzaXRvciBmdW5jdGlvblxuLy8gZm9yIGVhY2ggbm9kZSB0aGF0IGlzIHZpc2l0ZWQuIElmIGB2aXN0b3JPYmpPckZuYCBpcyBhbiBvYmplY3QsIHRoZW4gaXRzICdlbnRlcicgcHJvcGVydHlcbi8vIGlzIGEgZnVuY3Rpb24gdG8gY2FsbCBiZWZvcmUgdmlzaXRpbmcgdGhlIGNoaWxkcmVuIG9mIGEgbm9kZSwgYW5kIGl0cyAnZXhpdCcgcHJvcGVydHkgaXNcbi8vIGEgZnVuY3Rpb24gdG8gY2FsbCBhZnRlcndhcmRzLiBJZiBgdmlzaXRvck9iak9yRm5gIGlzIGEgZnVuY3Rpb24sIGl0IHJlcHJlc2VudHMgdGhlICdlbnRlcidcbi8vIGZ1bmN0aW9uLlxuLy9cbi8vIFRoZSBmdW5jdGlvbnMgYXJlIGNhbGxlZCB3aXRoIHRocmVlIGFyZ3VtZW50czogdGhlIFRyYWNlIG5vZGUsIGl0cyBwYXJlbnQgVHJhY2UsIGFuZCBhIG51bWJlclxuLy8gcmVwcmVzZW50aW5nIHRoZSBkZXB0aCBvZiB0aGUgbm9kZSBpbiB0aGUgdHJlZS4gKFRoZSByb290IG5vZGUgaGFzIGRlcHRoIDAuKSBgb3B0VGhpc0FyZ2AsIGlmXG4vLyBzcGVjaWZpZWQsIGlzIHRoZSB2YWx1ZSB0byB1c2UgZm9yIGB0aGlzYCB3aGVuIGV4ZWN1dGluZyB0aGUgdmlzaXRvciBmdW5jdGlvbnMuXG5UcmFjZS5wcm90b3R5cGUud2FsayA9IGZ1bmN0aW9uKHZpc2l0b3JPYmpPckZuLCBvcHRUaGlzQXJnKSB7XG4gIHZhciB2aXNpdG9yID0gdmlzaXRvck9iak9yRm47XG4gIGlmICh0eXBlb2YgdmlzaXRvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZpc2l0b3IgPSB7ZW50ZXI6IHZpc2l0b3J9O1xuICB9XG4gIHJldHVybiAoZnVuY3Rpb24gX3dhbGsobm9kZSwgcGFyZW50LCBkZXB0aCkge1xuICAgIGlmICh2aXNpdG9yLmVudGVyKSB7XG4gICAgICB2aXNpdG9yLmVudGVyLmNhbGwob3B0VGhpc0FyZywgbm9kZSwgcGFyZW50LCBkZXB0aCk7XG4gICAgfVxuICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjKSB7XG4gICAgICBpZiAoYyAmJiAoJ3dhbGsnIGluIGMpKSB7XG4gICAgICAgIF93YWxrKGMsIG5vZGUsIGRlcHRoICsgMSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHZpc2l0b3IuZXhpdCkge1xuICAgICAgdmlzaXRvci5leGl0LmNhbGwob3B0VGhpc0FyZywgbm9kZSwgcGFyZW50LCBkZXB0aCk7XG4gICAgfVxuICB9KSh0aGlzLCBudWxsLCAwKTtcbn07XG5cbi8vIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHJhY2UuXG4vLyBTYW1wbGU6XG4vLyAgICAgMTLii4Ur4ouFMuKLhSrii4UzIOKckyBleHAg4oeSICBcIjEyXCJcbi8vICAgICAxMuKLhSvii4Uy4ouFKuKLhTMgICDinJMgYWRkRXhwIChMUikg4oeSICBcIjEyXCJcbi8vICAgICAxMuKLhSvii4Uy4ouFKuKLhTMgICAgICAg4pyXIGFkZEV4cF9wbHVzXG5UcmFjZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNiID0gbmV3IGNvbW1vbi5TdHJpbmdCdWZmZXIoKTtcbiAgdGhpcy53YWxrKGZ1bmN0aW9uKG5vZGUsIHBhcmVudCwgZGVwdGgpIHtcbiAgICB2YXIgY3Rvck5hbWUgPSBub2RlLmV4cHIuY29uc3RydWN0b3IubmFtZTtcbiAgICBpZiAoY3Rvck5hbWUgPT09ICdBbHQnKSB7XG4gICAgICByZXR1cm47ICAvLyBEb24ndCBwcmludCBhbnl0aGluZyBmb3IgQWx0IG5vZGVzLlxuICAgIH1cbiAgICBzYi5hcHBlbmQoZ2V0SW5wdXRFeGNlcnB0KG5vZGUuaW5wdXRTdHJlYW0sIG5vZGUucG9zLCAxMCkgKyBzcGFjZXMoZGVwdGggKiAyICsgMSkpO1xuICAgIHNiLmFwcGVuZCgobm9kZS5zdWNjZWVkZWQgPyBDSEVDS19NQVJLIDogQkFMTE9UX1gpICsgJyAnICsgbm9kZS5kaXNwbGF5U3RyaW5nKTtcbiAgICBpZiAobm9kZS5pc0xlZnRSZWN1cnNpdmUpIHtcbiAgICAgIHNiLmFwcGVuZCgnIChMUiknKTtcbiAgICB9XG4gICAgaWYgKG5vZGUuc3VjY2VlZGVkKSB7XG4gICAgICB2YXIgY29udGVudHMgPSBhc0VzY2FwZWRTdHJpbmcobm9kZS5pbnRlcnZhbC5jb250ZW50cyk7XG4gICAgICBzYi5hcHBlbmQoJyAnICsgUklHSFRXQVJEU19ET1VCTEVfQVJST1cgKyAnICAnKTtcbiAgICAgIHNiLmFwcGVuZCh0eXBlb2YgY29udGVudHMgPT09ICdzdHJpbmcnID8gJ1wiJyArIGNvbnRlbnRzICsgJ1wiJyA6IGNvbnRlbnRzKTtcbiAgICB9XG4gICAgc2IuYXBwZW5kKCdcXG4nKTtcbiAgfSk7XG4gIHJldHVybiBzYi5jb250ZW50cygpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgndXRpbC1leHRlbmQnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgU3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEhlbHBlcnNcblxudmFyIGVzY2FwZVN0cmluZ0ZvciA9IHt9O1xuZm9yICh2YXIgYyA9IDA7IGMgPCAxMjg7IGMrKykge1xuICBlc2NhcGVTdHJpbmdGb3JbY10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpO1xufVxuZXNjYXBlU3RyaW5nRm9yW1wiJ1wiLmNoYXJDb2RlQXQoMCldICA9IFwiXFxcXCdcIjtcbmVzY2FwZVN0cmluZ0ZvclsnXCInLmNoYXJDb2RlQXQoMCldICA9ICdcXFxcXCInO1xuZXNjYXBlU3RyaW5nRm9yWydcXFxcJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcXFxcXCc7XG5lc2NhcGVTdHJpbmdGb3JbJ1xcYicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXGInO1xuZXNjYXBlU3RyaW5nRm9yWydcXGYnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxmJztcbmVzY2FwZVN0cmluZ0ZvclsnXFxuJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcbic7XG5lc2NhcGVTdHJpbmdGb3JbJ1xccicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHInO1xuZXNjYXBlU3RyaW5nRm9yWydcXHQnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFx0JztcbmVzY2FwZVN0cmluZ0ZvclsnXFx1MDAwYicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHYnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy5hYnN0cmFjdCA9IGZ1bmN0aW9uKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAndGhpcyBtZXRob2QgaXMgYWJzdHJhY3QhICcgK1xuICAgICAgJyhpdCBoYXMgbm8gaW1wbGVtZW50YXRpb24gaW4gY2xhc3MgJyArIHRoaXMuY29uc3RydWN0b3IubmFtZSArICcpJyk7XG59O1xuXG5leHBvcnRzLmFzc2VydCA9IGZ1bmN0aW9uKGNvbmQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFjb25kKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICB9XG59O1xuXG4vLyBEZWZpbmUgYSBsYXppbHktY29tcHV0ZWQsIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVkIGBwcm9wTmFtZWBcbi8vIG9uIHRoZSBvYmplY3QgYG9iamAuIGBnZXR0ZXJGbmAgd2lsbCBiZSBjYWxsZWQgdG8gY29tcHV0ZSB0aGUgdmFsdWUgdGhlXG4vLyBmaXJzdCB0aW1lIHRoZSBwcm9wZXJ0eSBpcyBhY2Nlc3NlZC5cbmV4cG9ydHMuZGVmaW5lTGF6eVByb3BlcnR5ID0gZnVuY3Rpb24ob2JqLCBwcm9wTmFtZSwgZ2V0dGVyRm4pIHtcbiAgdmFyIG1lbW87XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3BOYW1lLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghbWVtbykge1xuICAgICAgICBtZW1vID0gZ2V0dGVyRm4uY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH1cbiAgfSk7XG59O1xuXG5leHBvcnRzLmNsb25lID0gZnVuY3Rpb24ob2JqKSB7XG4gIGlmIChvYmopIHtcbiAgICByZXR1cm4gZXh0ZW5kKHt9LCBvYmopO1xuICB9XG4gIHJldHVybiBvYmo7XG59O1xuXG5leHBvcnRzLmV4dGVuZCA9IGV4dGVuZDtcblxuZXhwb3J0cy5yZXBlYXRGbiA9IGZ1bmN0aW9uKGZuLCBuKSB7XG4gIHZhciBhcnIgPSBbXTtcbiAgd2hpbGUgKG4tLSA+IDApIHtcbiAgICBhcnIucHVzaChmbigpKTtcbiAgfVxuICByZXR1cm4gYXJyO1xufTtcblxuZXhwb3J0cy5yZXBlYXRTdHIgPSBmdW5jdGlvbihzdHIsIG4pIHtcbiAgcmV0dXJuIG5ldyBBcnJheShuICsgMSkuam9pbihzdHIpO1xufTtcblxuZXhwb3J0cy5yZXBlYXQgPSBmdW5jdGlvbih4LCBuKSB7XG4gIHJldHVybiBleHBvcnRzLnJlcGVhdEZuKGZ1bmN0aW9uKCkgeyByZXR1cm4geDsgfSwgbik7XG59O1xuXG5leHBvcnRzLmdldER1cGxpY2F0ZXMgPSBmdW5jdGlvbihhcnJheSkge1xuICB2YXIgZHVwbGljYXRlcyA9IFtdO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcnJheS5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdmFyIHggPSBhcnJheVtpZHhdO1xuICAgIGlmIChhcnJheS5sYXN0SW5kZXhPZih4KSAhPT0gaWR4ICYmIGR1cGxpY2F0ZXMuaW5kZXhPZih4KSA8IDApIHtcbiAgICAgIGR1cGxpY2F0ZXMucHVzaCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGR1cGxpY2F0ZXM7XG59O1xuXG5leHBvcnRzLmZhaWwgPSB7fTtcblxuZXhwb3J0cy5pc1N5bnRhY3RpYyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHZhciBmaXJzdENoYXIgPSBydWxlTmFtZVswXTtcbiAgcmV0dXJuICgnQScgPD0gZmlyc3RDaGFyICYmIGZpcnN0Q2hhciA8PSAnWicpO1xufTtcblxuZXhwb3J0cy5wYWRMZWZ0ID0gZnVuY3Rpb24oc3RyLCBsZW4sIG9wdENoYXIpIHtcbiAgdmFyIGNoID0gb3B0Q2hhciB8fCAnICc7XG4gIGlmIChzdHIubGVuZ3RoIDwgbGVuKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMucmVwZWF0U3RyKGNoLCBsZW4gLSBzdHIubGVuZ3RoKSArIHN0cjtcbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuLy8gU3RyaW5nQnVmZmVyXG5cbmV4cG9ydHMuU3RyaW5nQnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3RyaW5ncyA9IFtdO1xufTtcblxuZXhwb3J0cy5TdHJpbmdCdWZmZXIucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKHN0cikge1xuICB0aGlzLnN0cmluZ3MucHVzaChzdHIpO1xufTtcblxuZXhwb3J0cy5TdHJpbmdCdWZmZXIucHJvdG90eXBlLmNvbnRlbnRzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnN0cmluZ3Muam9pbignJyk7XG59O1xuXG4vLyBDaGFyYWN0ZXIgZXNjYXBpbmcgYW5kIHVuZXNjYXBpbmdcblxuZXhwb3J0cy5lc2NhcGVDaGFyID0gZnVuY3Rpb24oYywgb3B0RGVsaW0pIHtcbiAgdmFyIGNoYXJDb2RlID0gYy5jaGFyQ29kZUF0KDApO1xuICBpZiAoKGMgPT09ICdcIicgfHwgYyA9PT0gXCInXCIpICYmIG9wdERlbGltICYmIGMgIT09IG9wdERlbGltKSB7XG4gICAgcmV0dXJuIGM7XG4gIH0gZWxzZSBpZiAoY2hhckNvZGUgPCAxMjgpIHtcbiAgICByZXR1cm4gZXNjYXBlU3RyaW5nRm9yW2NoYXJDb2RlXTtcbiAgfSBlbHNlIGlmICgxMjggPD0gY2hhckNvZGUgJiYgY2hhckNvZGUgPCAyNTYpIHtcbiAgICByZXR1cm4gJ1xcXFx4JyArIGV4cG9ydHMucGFkTGVmdChjaGFyQ29kZS50b1N0cmluZygxNiksIDIsICcwJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICdcXFxcdScgKyBleHBvcnRzLnBhZExlZnQoY2hhckNvZGUudG9TdHJpbmcoMTYpLCA0LCAnMCcpO1xuICB9XG59O1xuXG5leHBvcnRzLnVuZXNjYXBlQ2hhciA9IGZ1bmN0aW9uKHMpIHtcbiAgaWYgKHMuY2hhckF0KDApID09PSAnXFxcXCcpIHtcbiAgICBzd2l0Y2ggKHMuY2hhckF0KDEpKSB7XG4gICAgICBjYXNlICdiJzogcmV0dXJuICdcXGInO1xuICAgICAgY2FzZSAnZic6IHJldHVybiAnXFxmJztcbiAgICAgIGNhc2UgJ24nOiByZXR1cm4gJ1xcbic7XG4gICAgICBjYXNlICdyJzogcmV0dXJuICdcXHInO1xuICAgICAgY2FzZSAndCc6IHJldHVybiAnXFx0JztcbiAgICAgIGNhc2UgJ3YnOiByZXR1cm4gJ1xcdic7XG4gICAgICBjYXNlICd4JzogcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQocy5zdWJzdHJpbmcoMiwgNCksIDE2KSk7XG4gICAgICBjYXNlICd1JzogcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQocy5zdWJzdHJpbmcoMiwgNiksIDE2KSk7XG4gICAgICBkZWZhdWx0OiAgIHJldHVybiBzLmNoYXJBdCgxKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHM7XG4gIH1cbn07XG5cbi8vIEhlbHBlciBmb3IgcHJvZHVjaW5nIGEgZGVzY3JpcHRpb24gb2YgYW4gdW5rbm93biBvYmplY3QgaW4gYSBzYWZlIHdheS5cbi8vIEVzcGVjaWFsbHkgdXNlZnVsIGZvciBlcnJvciBtZXNzYWdlcyB3aGVyZSBhbiB1bmV4cGVjdGVkIHR5cGUgb2Ygb2JqZWN0IHdhcyBlbmNvdW50ZXJlZC5cbmV4cG9ydHMudW5leHBlY3RlZE9ialRvU3RyaW5nID0gZnVuY3Rpb24ob2JqKSB7XG4gIGlmIChvYmogPT0gbnVsbCkge1xuICAgIHJldHVybiBTdHJpbmcob2JqKTtcbiAgfVxuICB2YXIgYmFzZVRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaik7XG4gIHRyeSB7XG4gICAgdmFyIHR5cGVOYW1lO1xuICAgIGlmIChvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLm5hbWUpIHtcbiAgICAgIHR5cGVOYW1lID0gb2JqLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgfSBlbHNlIGlmIChiYXNlVG9TdHJpbmcuaW5kZXhPZignW29iamVjdCAnKSA9PT0gMCkge1xuICAgICAgdHlwZU5hbWUgPSBiYXNlVG9TdHJpbmcuc2xpY2UoOCwgLTEpOyAgLy8gRXh0cmFjdCBlLmcuIFwiQXJyYXlcIiBmcm9tIFwiW29iamVjdCBBcnJheV1cIi5cbiAgICB9IGVsc2Uge1xuICAgICAgdHlwZU5hbWUgPSB0eXBlb2Ygb2JqO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZU5hbWUgKyAnOiAnICsgSlNPTi5zdHJpbmdpZnkoU3RyaW5nKG9iaikpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGJhc2VUb1N0cmluZztcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBOYW1lc3BhY2UgPSByZXF1aXJlKCcuL05hbWVzcGFjZScpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gT2htRXJyb3IoKSB7fVxuT2htRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBtYWtlQ3VzdG9tRXJyb3IobmFtZSwgaW5pdEZuKSB7XG4gIC8vIE1ha2UgRSB0aGluayBpdCdzIHJlYWxseSBjYWxsZWQgT2htRXJyb3IsIHNvIHRoYXQgZXJyb3JzIGxvb2sgbmljZXIgd2hlbiB0aGV5J3JlXG4gIC8vIGNvbnNvbGUubG9nJ2VkIGluIENocm9tZS5cbiAgdmFyIEUgPSBmdW5jdGlvbiBPaG1FcnJvcigpIHtcbiAgICBpbml0Rm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAvLyBgY2FwdHVyZVN0YWNrVHJhY2VgIGlzIFY4LW9ubHkuXG4gICAgaWYgKHR5cGVvZiBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBlID0gbmV3IEVycm9yKCk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3N0YWNrJywge2dldDogZnVuY3Rpb24oKSB7IHJldHVybiBlLnN0YWNrOyB9fSk7XG4gICAgfVxuICB9O1xuICBFLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoT2htRXJyb3IucHJvdG90eXBlKTtcbiAgRS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBFO1xuICBFLnByb3RvdHlwZS5uYW1lID0gbmFtZTtcbiAgcmV0dXJuIEU7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIGVycm9ycyBhYm91dCBpbnRlcnZhbHMgLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIEludGVydmFsU291cmNlc0RvbnRNYXRjaCA9IG1ha2VDdXN0b21FcnJvcihcbiAgICAnb2htLmVycm9yLkludGVydmFsU291cmNlc0RvbnRNYXRjaCcsXG4gICAgZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSBcIkludGVydmFsIHNvdXJjZXMgZG9uJ3QgbWF0Y2hcIjtcbiAgICB9XG4pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBlcnJvcnMgYWJvdXQgZ3JhbW1hcnMgLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gR3JhbW1hciBzeW50YXggZXJyb3JcblxudmFyIEdyYW1tYXJTeW50YXhFcnJvciA9IG1ha2VDdXN0b21FcnJvcihcbiAgICAnb2htLmVycm9yLkdyYW1tYXJTeW50YXhFcnJvcicsXG4gICAgZnVuY3Rpb24obWF0Y2hGYWlsdXJlKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ21lc3NhZ2UnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuICdGYWlsZWQgdG8gcGFyc2UgZ3JhbW1hcjpcXG4nICsgbWF0Y2hGYWlsdXJlLm1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdzaG9ydE1lc3NhZ2UnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuICdFeHBlY3RlZCAnICsgbWF0Y2hGYWlsdXJlLmdldEV4cGVjdGVkVGV4dCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuaW50ZXJ2YWwgPSBtYXRjaEZhaWx1cmUuZ2V0SW50ZXJ2YWwoKTtcbiAgICB9XG4pO1xuXG4vLyBVbmRlY2xhcmVkIGdyYW1tYXJcblxudmFyIFVuZGVjbGFyZWRHcmFtbWFyID0gbWFrZUN1c3RvbUVycm9yKFxuICAgICdvaG0uZXJyb3IuVW5kZWNsYXJlZEdyYW1tYXInLFxuICAgIGZ1bmN0aW9uKGdyYW1tYXJOYW1lLCBuYW1lc3BhY2UsIGludGVydmFsKSB7XG4gICAgICB0aGlzLmdyYW1tYXJOYW1lID0gZ3JhbW1hck5hbWU7XG4gICAgICB0aGlzLm5hbWVzcGFjZSA9IG5hbWVzcGFjZTtcbiAgICAgIGlmICh0aGlzLm5hbWVzcGFjZSkge1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSAnR3JhbW1hciAnICsgdGhpcy5ncmFtbWFyTmFtZSArXG4gICAgICAgICAgICAnIGlzIG5vdCBkZWNsYXJlZCBpbiBuYW1lc3BhY2UgJyArIE5hbWVzcGFjZS50b1N0cmluZyh0aGlzLm5hbWVzcGFjZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSAnVW5kZWNsYXJlZCBncmFtbWFyICcgKyB0aGlzLmdyYW1tYXJOYW1lO1xuICAgICAgfVxuICAgICAgdGhpcy5pbnRlcnZhbCA9IGludGVydmFsO1xuICAgIH1cbik7XG5cbi8vIER1cGxpY2F0ZSBncmFtbWFyIGRlY2xhcmF0aW9uXG5cbnZhciBEdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24gPSBtYWtlQ3VzdG9tRXJyb3IoXG4gICAgJ29obS5lcnJvci5EdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24nLFxuICAgIGZ1bmN0aW9uKGdyYW1tYXIsIG5hbWVzcGFjZSkge1xuICAgICAgdGhpcy5ncmFtbWFyTmFtZSA9IGdyYW1tYXIubmFtZTtcbiAgICAgIHRoaXMubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuICAgICAgdGhpcy5tZXNzYWdlID0gJ0dyYW1tYXIgJyArIHRoaXMuZ3JhbW1hck5hbWUgK1xuICAgICAgICAgICcgaXMgYWxyZWFkeSBkZWNsYXJlZCBpbiBuYW1lc3BhY2UgJyArIE5hbWVzcGFjZS50b1N0cmluZyh0aGlzLm5hbWVzcGFjZSk7XG4gICAgICB0aGlzLmludGVydmFsID0gZ3JhbW1hci5kZWZpbml0aW9uSW50ZXJ2YWw7XG4gICAgfVxuKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gcnVsZXMgLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gVW5kZWNsYXJlZCBydWxlXG5cbnZhciBVbmRlY2xhcmVkUnVsZSA9IG1ha2VDdXN0b21FcnJvcihcbiAgICAnb2htLmVycm9yLlVuZGVjbGFyZWRSdWxlJyxcbiAgICBmdW5jdGlvbihydWxlTmFtZSwgZ3JhbW1hck5hbWUsIGV4cHIpIHtcbiAgICAgIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgICAgIHRoaXMuZ3JhbW1hck5hbWUgPSBncmFtbWFyTmFtZTtcbiAgICAgIHRoaXMubWVzc2FnZSA9ICdSdWxlICcgKyB0aGlzLnJ1bGVOYW1lICsgJyBpcyBub3QgZGVjbGFyZWQgaW4gZ3JhbW1hciAnICsgdGhpcy5ncmFtbWFyTmFtZTtcbiAgICAgIHRoaXMuaW50ZXJ2YWwgPSBleHByLmludGVydmFsO1xuICAgIH1cbik7XG5cbi8vIENhbm5vdCBvdmVycmlkZSB1bmRlY2xhcmVkIHJ1bGVcblxudmFyIENhbm5vdE92ZXJyaWRlVW5kZWNsYXJlZFJ1bGUgPSBtYWtlQ3VzdG9tRXJyb3IoXG4gICAgJ29obS5lcnJvci5DYW5ub3RPdmVycmlkZVVuZGVjbGFyZWRSdWxlJyxcbiAgICBmdW5jdGlvbihydWxlTmFtZSwgZ3JhbW1hck5hbWUsIGJvZHkpIHtcbiAgICAgIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgICAgIHRoaXMuZ3JhbW1hck5hbWUgPSBncmFtbWFyTmFtZTtcbiAgICAgIHRoaXMubWVzc2FnZSA9XG4gICAgICAgICAgJ0Nhbm5vdCBvdmVycmlkZSBydWxlICcgKyB0aGlzLnJ1bGVOYW1lICtcbiAgICAgICAgICAnIGJlY2F1c2UgaXQgaXMgbm90IGRlY2xhcmVkIGluICcgKyB0aGlzLmdyYW1tYXJOYW1lO1xuICAgICAgdGhpcy5pbnRlcnZhbCA9IGJvZHkuZGVmaW5pdGlvbkludGVydmFsO1xuICAgIH1cbik7XG5cbi8vIENhbm5vdCBleHRlbmQgdW5kZWNsYXJlZCBydWxlXG5cbnZhciBDYW5ub3RFeHRlbmRVbmRlY2xhcmVkUnVsZSA9IG1ha2VDdXN0b21FcnJvcihcbiAgICAnb2htLmVycm9yLkNhbm5vdEV4dGVuZFVuZGVjbGFyZWRSdWxlJyxcbiAgICBmdW5jdGlvbihydWxlTmFtZSwgZ3JhbW1hck5hbWUsIGJvZHkpIHtcbiAgICAgIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgICAgIHRoaXMuZ3JhbW1hck5hbWUgPSBncmFtbWFyTmFtZTtcbiAgICAgIHRoaXMubWVzc2FnZSA9XG4gICAgICAgICAgJ0Nhbm5vdCBleHRlbmQgcnVsZSAnICsgdGhpcy5ydWxlTmFtZSArXG4gICAgICAgICAgJyBiZWNhdXNlIGl0IGlzIG5vdCBkZWNsYXJlZCBpbiAnICsgdGhpcy5ncmFtbWFyTmFtZTtcbiAgICAgIHRoaXMuaW50ZXJ2YWwgPSBib2R5LmRlZmluaXRpb25JbnRlcnZhbDtcbiAgICB9XG4pO1xuXG4vLyBEdXBsaWNhdGUgcnVsZSBkZWNsYXJhdGlvblxuXG52YXIgRHVwbGljYXRlUnVsZURlY2xhcmF0aW9uID0gbWFrZUN1c3RvbUVycm9yKFxuICAgICdvaG0uZXJyb3IuRHVwbGljYXRlUnVsZURlY2xhcmF0aW9uJyxcbiAgICBmdW5jdGlvbihydWxlTmFtZSwgb2ZmZW5kaW5nR3JhbW1hck5hbWUsIGRlY2xHcmFtbWFyTmFtZSwgYm9keSkge1xuICAgICAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lO1xuICAgICAgdGhpcy5vZmZlbmRpbmdHcmFtbWFyTmFtZSA9IG9mZmVuZGluZ0dyYW1tYXJOYW1lO1xuICAgICAgdGhpcy5kZWNsR3JhbW1hck5hbWUgPSBkZWNsR3JhbW1hck5hbWU7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSBcIkR1cGxpY2F0ZSBkZWNsYXJhdGlvbiBmb3IgcnVsZSAnXCIgKyB0aGlzLnJ1bGVOYW1lICtcbiAgICAgICAgICAgICAgICAgICAgIFwiJyBpbiBncmFtbWFyICdcIiArIHRoaXMub2ZmZW5kaW5nR3JhbW1hck5hbWUgKyBcIidcIjtcbiAgICAgIGlmICh0aGlzLm9mZmVuZGluZ0dyYW1tYXJOYW1lICE9PSBkZWNsR3JhbW1hck5hbWUpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlICs9IFwiIChvcmlnaW5hbGx5IGRlY2xhcmVkIGluIGdyYW1tYXIgJ1wiICsgdGhpcy5kZWNsR3JhbW1hck5hbWUgKyBcIicpXCI7XG4gICAgICB9XG4gICAgICB0aGlzLmludGVydmFsID0gYm9keS5kZWZpbml0aW9uSW50ZXJ2YWw7XG4gICAgfVxuKTtcblxuLy8gV3JvbmcgbnVtYmVyIG9mIHBhcmFtZXRlcnNcblxudmFyIFdyb25nTnVtYmVyT2ZQYXJhbWV0ZXJzID0gbWFrZUN1c3RvbUVycm9yKFxuICAgICdvaG0uZXJyb3IuV3JvbmdOdW1iZXJPZlBhcmFtZXRlcnMnLFxuICAgIGZ1bmN0aW9uKHJ1bGVOYW1lLCBleHBlY3RlZCwgYWN0dWFsLCBib2R5KSB7XG4gICAgICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWU7XG4gICAgICB0aGlzLmV4cGVjdGVkID0gZXhwZWN0ZWQ7XG4gICAgICB0aGlzLmFjdHVhbCA9IGFjdHVhbDtcbiAgICAgIHRoaXMubWVzc2FnZSA9ICdXcm9uZyBudW1iZXIgb2YgcGFyYW1ldGVycyBmb3IgcnVsZSAnICsgdGhpcy5ydWxlTmFtZSArXG4gICAgICAgICAgICAgICAgICAgICAnIChleHBlY3RlZCAnICsgdGhpcy5leHBlY3RlZCArICcsIGdvdCAnICsgdGhpcy5hY3R1YWwgKyAnKSc7XG4gICAgICB0aGlzLmludGVydmFsID0gYm9keS5kZWZpbml0aW9uSW50ZXJ2YWw7XG4gICAgfVxuKTtcblxuLy8gRHVwbGljYXRlIHBhcmFtZXRlciBuYW1lc1xuXG52YXIgRHVwbGljYXRlUGFyYW1ldGVyTmFtZXMgPSBtYWtlQ3VzdG9tRXJyb3IoXG4gICAgJ29obS5lcnJvci5EdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcycsXG4gICAgZnVuY3Rpb24ocnVsZU5hbWUsIGR1cGxpY2F0ZXMsIGJvZHkpIHtcbiAgICAgIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgICAgIHRoaXMuZHVwbGljYXRlcyA9IGR1cGxpY2F0ZXM7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSAnRHVwbGljYXRlIHBhcmFtZXRlciBuYW1lcyBpbiBydWxlICcgKyB0aGlzLnJ1bGVOYW1lICsgJzogJyArXG4gICAgICAgICAgdGhpcy5kdXBsaWNhdGVzLmpvaW4oJywnKTtcbiAgICAgIHRoaXMuaW50ZXJ2YWwgPSBib2R5LmRlZmluaXRpb25JbnRlcnZhbDtcbiAgICB9XG4pO1xuXG4vLyBJbnZhbGlkIHBhcmFtZXRlciBleHByZXNzaW9uXG5cbnZhciBJbnZhbGlkUGFyYW1ldGVyID0gbWFrZUN1c3RvbUVycm9yKFxuICAgICdvaG0uZXJyb3IuSW52YWxpZFBhcmFtZXRlcicsXG4gICAgZnVuY3Rpb24ocnVsZU5hbWUsIGV4cHIpIHtcbiAgICAgIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgICAgIHRoaXMuZXhwciA9IGV4cHI7XG4gICAgICB0aGlzLmludGVydmFsID0gZXhwci5pbnRlcnZhbDtcbiAgICAgIHRoaXMubWVzc2FnZSA9ICdJbnZhbGlkIHBhcmFtZXRlciB0byBydWxlICcgKyB0aGlzLnJ1bGVOYW1lICsgJzogJyArIHRoaXMuZXhwciArXG4gICAgICAgICAgICAgICAgICAgICAnIGhhcyBhcml0eSAnICsgdGhpcy5leHByLmdldEFyaXR5KCkgKyAnLCBidXQgcGFyYW1ldGVyIGV4cHJlc3Npb25zICcgK1xuICAgICAgICAgICAgICAgICAgICAgJ211c3QgaGF2ZSBhcml0eSAxJztcbiAgICB9XG4pO1xuXG4vLyBBcHBsaWNhdGlvbiBvZiBzeW50YWN0aWMgcnVsZSBmcm9tIGxleGljYWwgcnVsZVxuXG52YXIgQXBwbGljYXRpb25PZlN5bnRhY3RpY1J1bGVGcm9tTGV4aWNhbFJ1bGUgPSBtYWtlQ3VzdG9tRXJyb3IoXG4gICAgJ29obS5lcnJvci5BcHBsaWNhdGlvbk9mU3ludGFjdGljUnVsZUZyb21MZXhpY2FsUnVsZScsXG4gICAgZnVuY3Rpb24obGV4aWNhbFJ1bGVOYW1lLCBzeW50YWN0aWNSdWxlTmFtZSwgYXBwbHlFeHByKSB7XG4gICAgICB0aGlzLmxleGljYWxSdWxlTmFtZSA9IGxleGljYWxSdWxlTmFtZTtcbiAgICAgIHRoaXMuc3ludGFjdGljUnVsZU5hbWUgPSBzeW50YWN0aWNSdWxlTmFtZTtcbiAgICAgIHRoaXMuYXBwbHlFeHByID0gYXBwbHlFeHByO1xuICAgICAgdGhpcy5pbnRlcnZhbCA9IGFwcGx5RXhwci5pbnRlcnZhbDtcbiAgICAgIHRoaXMuc2hvcnRNZXNzYWdlID1cbiAgICAgICAgICAnQ2Fubm90IGFwcGx5IHN5bnRhY3RpYyBydWxlICcgKyBzeW50YWN0aWNSdWxlTmFtZSArXG4gICAgICAgICAgJyBmcm9tIHRoZSBib2R5IG9mIGxleGljYWwgcnVsZSAnICsgbGV4aWNhbFJ1bGVOYW1lO1xuICAgICAgdGhpcy5tZXNzYWdlID0gYXBwbHlFeHByLmludGVydmFsLmdldExpbmVBbmRDb2x1bW5NZXNzYWdlKCkgKyB0aGlzLnNob3J0TWVzc2FnZTtcbiAgICB9XG4pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBLbGVlbmUgb3BlcmF0b3JzIC0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBLbGVlbmVFeHBySGFzTnVsbGFibGVPcGVyYW5kID0gbWFrZUN1c3RvbUVycm9yKFxuICAgICdvaG0uZXJyb3IuS2xlZW5lRXhwckhhc051bGxhYmxlT3BlcmFuZCcsXG4gICAgZnVuY3Rpb24oa2xlZW5lRXhwcikge1xuICAgICAgdGhpcy5leHByID0ga2xlZW5lRXhwcjtcblxuICAgICAgdmFyIG9wZXJhdG9yID0ga2xlZW5lRXhwci5vcGVyYXRvcjtcbiAgICAgIHZhciBudWxsYWJsZUV4cHIgPSBrbGVlbmVFeHByLmV4cHI7XG4gICAgICB0aGlzLnNob3J0TWVzc2FnZSA9ICdOdWxsYWJsZSBleHByZXNzaW9uICcgKyBudWxsYWJsZUV4cHIuaW50ZXJ2YWwuY29udGVudHMgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBpcyBub3QgYWxsb3dlZCBpbnNpZGUgJ1wiICsgb3BlcmF0b3IgKyBcIicgKHBvc3NpYmxlIGluZmluaXRlIGxvb3ApXCI7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSBudWxsYWJsZUV4cHIuaW50ZXJ2YWwuZ2V0TGluZUFuZENvbHVtbk1lc3NhZ2UoKSArIHRoaXMuc2hvcnRNZXNzYWdlO1xuICAgICAgdGhpcy5pbnRlcnZhbCA9IG51bGxhYmxlRXhwci5pbnRlcnZhbDtcbiAgICB9XG4pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBhcml0eSAtLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgSW5jb25zaXN0ZW50QXJpdHkgPSBtYWtlQ3VzdG9tRXJyb3IoXG4gICAgJ29obS5lcnJvci5JbmNvbnNpc3RlbnRBcml0eScsXG4gICAgZnVuY3Rpb24ocnVsZU5hbWUsIGV4cGVjdGVkLCBhY3R1YWwsIGV4cHIpIHtcbiAgICAgIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgICAgIHRoaXMuZXhwZWN0ZWQgPSBleHBlY3RlZDtcbiAgICAgIHRoaXMuYWN0dWFsID0gYWN0dWFsO1xuICAgICAgdGhpcy5tZXNzYWdlID1cbiAgICAgICAgICAnUnVsZSAnICsgdGhpcy5ydWxlTmFtZSArICcgaW52b2x2ZXMgYW4gYWx0ZXJuYXRpb24gd2hpY2ggaGFzIGluY29uc2lzdGVudCBhcml0eSAnICtcbiAgICAgICAgICAnKGV4cGVjdGVkICcgKyB0aGlzLmV4cGVjdGVkICsgJywgZ290ICcgKyB0aGlzLmFjdHVhbCArICcpJztcbiAgICAgIHRoaXMuaW50ZXJ2YWwgPSBleHByLmludGVydmFsO1xuICAgIH1cbik7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIHByb3BlcnRpZXMgLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIER1cGxpY2F0ZVByb3BlcnR5TmFtZXMgPSBtYWtlQ3VzdG9tRXJyb3IoXG4gICAgJ29obS5lcnJvci5EdXBsaWNhdGVQcm9wZXJ0eU5hbWVzJyxcbiAgICBmdW5jdGlvbihkdXBsaWNhdGVzKSB7XG4gICAgICB0aGlzLmR1cGxpY2F0ZXMgPSBkdXBsaWNhdGVzO1xuICAgICAgdGhpcy5tZXNzYWdlID0gJ09iamVjdCBwYXR0ZXJuIGhhcyBkdXBsaWNhdGUgcHJvcGVydHkgbmFtZXM6ICcgKyB0aGlzLmR1cGxpY2F0ZXMuam9pbignLCAnKTtcbiAgICB9XG4pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBjb25zdHJ1Y3RvcnMgLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIEludmFsaWRDb25zdHJ1Y3RvckNhbGwgPSBtYWtlQ3VzdG9tRXJyb3IoXG4gICAgJ29obS5lcnJvci5JbnZhbGlkQ29uc3RydWN0b3JDYWxsJyxcbiAgICBmdW5jdGlvbihncmFtbWFyLCBjdG9yTmFtZSwgY2hpbGRyZW4pIHtcbiAgICAgIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG4gICAgICB0aGlzLmN0b3JOYW1lID0gY3Rvck5hbWU7XG4gICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICB0aGlzLm1lc3NhZ2UgPSAnQXR0ZW1wdCB0byBpbnZva2UgY29uc3RydWN0b3IgJyArIHRoaXMuY3Rvck5hbWUgK1xuICAgICAgICAgICAgICAgICAgICAgJyB3aXRoIGludmFsaWQgb3IgdW5leHBlY3RlZCBhcmd1bWVudHMnO1xuICAgIH1cbik7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIGNvbnZlbmllbmNlIC0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBNdWx0aXBsZUVycm9ycyA9IG1ha2VDdXN0b21FcnJvcihcbiAgICAnb2htLmVycm9yLk11bHRpcGxlRXJyb3JzJyxcbiAgICBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHRoaXMuZXJyb3JzID0gZXJyb3JzO1xuICAgICAgdmFyIG1lc3NhZ2VzID0gZXJyb3JzLm1hcChmdW5jdGlvbihlKSB7IHJldHVybiBlLm1lc3NhZ2U7IH0pO1xuICAgICAgdGhpcy5tZXNzYWdlID0gWydFcnJvcnM6J10uY29uY2F0KG1lc3NhZ2VzKS5qb2luKCdcXG4tICcpO1xuICAgICAgLy8gTGV0J3MgdXNlIHRoZSBmaXJzdCBlcnJvci5cbiAgICAgIHRoaXMuc2hvcnRNZXNzYWdlID0gZXJyb3JzWzBdLnNob3J0TWVzc2FnZSA/IGVycm9yc1swXS5zaG9ydE1lc3NhZ2UgOiBlcnJvcnNbMF0ubWVzc2FnZTtcbiAgICAgIHRoaXMuaW50ZXJ2YWwgPSBlcnJvcnNbMF0uaW50ZXJ2YWw7XG4gICAgfVxuKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBBcHBsaWNhdGlvbk9mU3ludGFjdGljUnVsZUZyb21MZXhpY2FsUnVsZTogQXBwbGljYXRpb25PZlN5bnRhY3RpY1J1bGVGcm9tTGV4aWNhbFJ1bGUsXG4gIENhbm5vdEV4dGVuZFVuZGVjbGFyZWRSdWxlOiBDYW5ub3RFeHRlbmRVbmRlY2xhcmVkUnVsZSxcbiAgQ2Fubm90T3ZlcnJpZGVVbmRlY2xhcmVkUnVsZTogQ2Fubm90T3ZlcnJpZGVVbmRlY2xhcmVkUnVsZSxcbiAgRHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uOiBEdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24sXG4gIER1cGxpY2F0ZVBhcmFtZXRlck5hbWVzOiBEdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyxcbiAgRHVwbGljYXRlUHJvcGVydHlOYW1lczogRHVwbGljYXRlUHJvcGVydHlOYW1lcyxcbiAgRHVwbGljYXRlUnVsZURlY2xhcmF0aW9uOiBEdXBsaWNhdGVSdWxlRGVjbGFyYXRpb24sXG4gIEVycm9yOiBPaG1FcnJvcixcbiAgSW5jb25zaXN0ZW50QXJpdHk6IEluY29uc2lzdGVudEFyaXR5LFxuICBJbnRlcnZhbFNvdXJjZXNEb250TWF0Y2g6IEludGVydmFsU291cmNlc0RvbnRNYXRjaCxcbiAgSW52YWxpZENvbnN0cnVjdG9yQ2FsbDogSW52YWxpZENvbnN0cnVjdG9yQ2FsbCxcbiAgSW52YWxpZFBhcmFtZXRlcjogSW52YWxpZFBhcmFtZXRlcixcbiAgR3JhbW1hclN5bnRheEVycm9yOiBHcmFtbWFyU3ludGF4RXJyb3IsXG4gIEtsZWVuZUV4cHJIYXNOdWxsYWJsZU9wZXJhbmQ6IEtsZWVuZUV4cHJIYXNOdWxsYWJsZU9wZXJhbmQsXG4gIE11bHRpcGxlRXJyb3JzOiBNdWx0aXBsZUVycm9ycyxcbiAgVW5kZWNsYXJlZEdyYW1tYXI6IFVuZGVjbGFyZWRHcmFtbWFyLFxuICBVbmRlY2xhcmVkUnVsZTogVW5kZWNsYXJlZFJ1bGUsXG4gIFdyb25nTnVtYmVyT2ZQYXJhbWV0ZXJzOiBXcm9uZ051bWJlck9mUGFyYW1ldGVycyxcblxuICB0aHJvd0Vycm9yczogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgaWYgKGVycm9ycy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHRocm93IGVycm9yc1swXTtcbiAgICB9XG4gICAgaWYgKGVycm9ycy5sZW5ndGggPiAxKSB7XG4gICAgICB0aHJvdyBuZXcgTXVsdGlwbGVFcnJvcnMoZXJyb3JzKTtcbiAgICB9XG4gIH1cbn07XG4iLCIoZnVuY3Rpb24gKEJ1ZmZlcil7XG4vKiBnbG9iYWwgZG9jdW1lbnQsIEJ1ZmZlciwgWE1MSHR0cFJlcXVlc3QgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIEJ1aWxkZXIgPSByZXF1aXJlKCcuL0J1aWxkZXInKTtcbnZhciBHcmFtbWFyID0gcmVxdWlyZSgnLi9HcmFtbWFyJyk7XG52YXIgTmFtZXNwYWNlID0gcmVxdWlyZSgnLi9OYW1lc3BhY2UnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gVGhlIG1ldGFncmFtbWFyLCBpLmUuIHRoZSBncmFtbWFyIGZvciBPaG0gZ3JhbW1hcnMuIEluaXRpYWxpemVkIGF0IHRoZVxuLy8gYm90dG9tIG9mIHRoaXMgZmlsZSBiZWNhdXNlIGxvYWRpbmcgdGhlIGdyYW1tYXIgcmVxdWlyZXMgT2htIGl0c2VsZi5cbnZhciBvaG1HcmFtbWFyO1xuXG4vLyBBbiBvYmplY3Qgd2hpY2ggbWFrZXMgaXQgcG9zc2libGUgdG8gc3R1YiBvdXQgdGhlIGRvY3VtZW50IEFQSSBmb3IgdGVzdGluZy5cbnZhciBkb2N1bWVudEludGVyZmFjZSA9IHtcbiAgcXVlcnlTZWxlY3RvcjogZnVuY3Rpb24oc2VsKSB7IHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbCk7IH0sXG4gIHF1ZXJ5U2VsZWN0b3JBbGw6IGZ1bmN0aW9uKHNlbCkgeyByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpOyB9XG59O1xuXG4vLyBDaGVjayBpZiBgb2JqYCBpcyBhIERPTSBlbGVtZW50LlxuZnVuY3Rpb24gaXNFbGVtZW50KG9iaikge1xuICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKG9iaikge1xuICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG59XG5cbnZhciBNQVhfQVJSQVlfSU5ERVggPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuXG5mdW5jdGlvbiBpc0FycmF5TGlrZShvYmopIHtcbiAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsZW5ndGggPSBvYmoubGVuZ3RoO1xuICByZXR1cm4gdHlwZW9mIGxlbmd0aCA9PT0gJ251bWJlcicgJiYgbGVuZ3RoID49IDAgJiYgbGVuZ3RoIDw9IE1BWF9BUlJBWV9JTkRFWDtcbn1cblxuLy8gVE9ETzoganVzdCB1c2UgdGhlIGpRdWVyeSB0aGluZ1xuZnVuY3Rpb24gbG9hZCh1cmwpIHtcbiAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICByZXEub3BlbignR0VUJywgdXJsLCBmYWxzZSk7XG4gIHRyeSB7XG4gICAgcmVxLnNlbmQoKTtcbiAgICBpZiAocmVxLnN0YXR1cyA9PT0gMCB8fCByZXEuc3RhdHVzID09PSAyMDApIHtcbiAgICAgIHJldHVybiByZXEucmVzcG9uc2VUZXh0O1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge31cbiAgdGhyb3cgbmV3IEVycm9yKCd1bmFibGUgdG8gbG9hZCB1cmwgJyArIHVybCk7XG59XG5cbi8vIFJldHVybnMgYSBHcmFtbWFyIGluc3RhbmNlIChpLmUuLCBhbiBvYmplY3Qgd2l0aCBhIGBtYXRjaGAgbWV0aG9kKSBmb3Jcbi8vIGB0cmVlYCwgd2hpY2ggaXMgdGhlIGNvbmNyZXRlIHN5bnRheCB0cmVlIG9mIGEgdXNlci13cml0dGVuIGdyYW1tYXIuXG4vLyBUaGUgZ3JhbW1hciB3aWxsIGJlIGFzc2lnbmVkIGludG8gYG5hbWVzcGFjZWAgdW5kZXIgdGhlIG5hbWUgb2YgdGhlIGdyYW1tYXJcbi8vIGFzIHNwZWNpZmllZCBpbiB0aGUgc291cmNlLlxuZnVuY3Rpb24gYnVpbGRHcmFtbWFyKG1hdGNoLCBuYW1lc3BhY2UsIG9wdE9obUdyYW1tYXJGb3JUZXN0aW5nKSB7XG4gIHZhciBidWlsZGVyO1xuICB2YXIgZGVjbDtcbiAgdmFyIGN1cnJlbnRSdWxlTmFtZTtcbiAgdmFyIGN1cnJlbnRSdWxlRm9ybWFscztcbiAgdmFyIG92ZXJyaWRpbmcgPSBmYWxzZTtcbiAgdmFyIG1ldGFHcmFtbWFyID0gb3B0T2htR3JhbW1hckZvclRlc3RpbmcgfHwgb2htR3JhbW1hcjtcblxuICAvLyBBIHZpc2l0b3IgdGhhdCBwcm9kdWNlcyBhIEdyYW1tYXIgaW5zdGFuY2UgZnJvbSB0aGUgQ1NULlxuICB2YXIgaGVscGVycyA9IG1ldGFHcmFtbWFyLnNlbWFudGljcygpLmFkZE9wZXJhdGlvbigndmlzaXQnLCB7XG4gICAgR3JhbW1hcjogZnVuY3Rpb24obiwgcywgb3BlbiwgcnMsIGNsb3NlKSB7XG4gICAgICBidWlsZGVyID0gbmV3IEJ1aWxkZXIoKTtcbiAgICAgIHZhciBncmFtbWFyTmFtZSA9IG4udmlzaXQoKTtcbiAgICAgIGRlY2wgPSBidWlsZGVyLm5ld0dyYW1tYXIoZ3JhbW1hck5hbWUsIG5hbWVzcGFjZSk7XG4gICAgICBzLnZpc2l0KCk7XG4gICAgICBycy52aXNpdCgpO1xuICAgICAgdmFyIGcgPSBkZWNsLmJ1aWxkKCk7XG4gICAgICBnLmRlZmluaXRpb25JbnRlcnZhbCA9IHRoaXMuaW50ZXJ2YWwudHJpbW1lZCgpO1xuICAgICAgaWYgKGdyYW1tYXJOYW1lIGluIG5hbWVzcGFjZSkge1xuICAgICAgICB0aHJvdyBuZXcgZXJyb3JzLkR1cGxpY2F0ZUdyYW1tYXJEZWNsYXJhdGlvbihnLCBuYW1lc3BhY2UpO1xuICAgICAgfVxuICAgICAgbmFtZXNwYWNlW2dyYW1tYXJOYW1lXSA9IGc7XG4gICAgICByZXR1cm4gZztcbiAgICB9LFxuXG4gICAgU3VwZXJHcmFtbWFyOiBmdW5jdGlvbihfLCBuKSB7XG4gICAgICB2YXIgc3VwZXJHcmFtbWFyTmFtZSA9IG4udmlzaXQoKTtcbiAgICAgIGlmIChzdXBlckdyYW1tYXJOYW1lID09PSAnbnVsbCcpIHtcbiAgICAgICAgZGVjbC53aXRoU3VwZXJHcmFtbWFyKG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFuYW1lc3BhY2UgfHwgIShzdXBlckdyYW1tYXJOYW1lIGluIG5hbWVzcGFjZSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgZXJyb3JzLlVuZGVjbGFyZWRHcmFtbWFyKHN1cGVyR3JhbW1hck5hbWUsIG5hbWVzcGFjZSwgbi5pbnRlcnZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgZGVjbC53aXRoU3VwZXJHcmFtbWFyKG5hbWVzcGFjZVtzdXBlckdyYW1tYXJOYW1lXSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIFJ1bGVfZGVmaW5lOiBmdW5jdGlvbihuLCBmcywgZCwgXywgYikge1xuICAgICAgY3VycmVudFJ1bGVOYW1lID0gbi52aXNpdCgpO1xuICAgICAgY3VycmVudFJ1bGVGb3JtYWxzID0gZnMudmlzaXQoKVswXSB8fCBbXTtcbiAgICAgIC8vIElmIHRoZXJlIGlzIG5vIGRlZmF1bHQgc3RhcnQgcnVsZSB5ZXQsIHNldCBpdCBub3cuIFRoaXMgbXVzdCBiZSBkb25lIGJlZm9yZSB2aXNpdGluZ1xuICAgICAgLy8gdGhlIGJvZHksIGJlY2F1c2UgaXQgbWlnaHQgY29udGFpbiBhbiBpbmxpbmUgcnVsZSBkZWZpbml0aW9uLlxuICAgICAgaWYgKCFkZWNsLmRlZmF1bHRTdGFydFJ1bGUgJiYgZGVjbC5lbnN1cmVTdXBlckdyYW1tYXIoKSAhPT0gR3JhbW1hci5Qcm90b0J1aWx0SW5SdWxlcykge1xuICAgICAgICBkZWNsLndpdGhEZWZhdWx0U3RhcnRSdWxlKGN1cnJlbnRSdWxlTmFtZSk7XG4gICAgICB9XG4gICAgICB2YXIgYm9keSA9IGIudmlzaXQoKTtcbiAgICAgIGJvZHkuZGVmaW5pdGlvbkludGVydmFsID0gdGhpcy5pbnRlcnZhbC50cmltbWVkKCk7XG4gICAgICB2YXIgZGVzY3JpcHRpb24gPSBkLnZpc2l0KClbMF07XG4gICAgICByZXR1cm4gZGVjbC5kZWZpbmUoY3VycmVudFJ1bGVOYW1lLCBjdXJyZW50UnVsZUZvcm1hbHMsIGJvZHksIGRlc2NyaXB0aW9uKTtcbiAgICB9LFxuICAgIFJ1bGVfb3ZlcnJpZGU6IGZ1bmN0aW9uKG4sIGZzLCBfLCBiKSB7XG4gICAgICBjdXJyZW50UnVsZU5hbWUgPSBuLnZpc2l0KCk7XG4gICAgICBjdXJyZW50UnVsZUZvcm1hbHMgPSBmcy52aXNpdCgpWzBdIHx8IFtdO1xuICAgICAgb3ZlcnJpZGluZyA9IHRydWU7XG4gICAgICB2YXIgYm9keSA9IGIudmlzaXQoKTtcbiAgICAgIGJvZHkuZGVmaW5pdGlvbkludGVydmFsID0gdGhpcy5pbnRlcnZhbC50cmltbWVkKCk7XG4gICAgICB2YXIgYW5zID0gZGVjbC5vdmVycmlkZShjdXJyZW50UnVsZU5hbWUsIGN1cnJlbnRSdWxlRm9ybWFscywgYm9keSk7XG4gICAgICBvdmVycmlkaW5nID0gZmFsc2U7XG4gICAgICByZXR1cm4gYW5zO1xuICAgIH0sXG4gICAgUnVsZV9leHRlbmQ6IGZ1bmN0aW9uKG4sIGZzLCBfLCBiKSB7XG4gICAgICBjdXJyZW50UnVsZU5hbWUgPSBuLnZpc2l0KCk7XG4gICAgICBjdXJyZW50UnVsZUZvcm1hbHMgPSBmcy52aXNpdCgpWzBdIHx8IFtdO1xuICAgICAgdmFyIGJvZHkgPSBiLnZpc2l0KCk7XG4gICAgICB2YXIgYW5zID0gZGVjbC5leHRlbmQoY3VycmVudFJ1bGVOYW1lLCBjdXJyZW50UnVsZUZvcm1hbHMsIGJvZHkpO1xuICAgICAgZGVjbC5ydWxlRGljdFtjdXJyZW50UnVsZU5hbWVdLmRlZmluaXRpb25JbnRlcnZhbCA9IHRoaXMuaW50ZXJ2YWwudHJpbW1lZCgpO1xuICAgICAgcmV0dXJuIGFucztcbiAgICB9LFxuXG4gICAgRm9ybWFsczogZnVuY3Rpb24ob3BvaW50eSwgZnMsIGNwb2ludHkpIHtcbiAgICAgIHJldHVybiBmcy52aXNpdCgpO1xuICAgIH0sXG5cbiAgICBQYXJhbXM6IGZ1bmN0aW9uKG9wb2ludHksIHBzLCBjcG9pbnR5KSB7XG4gICAgICByZXR1cm4gcHMudmlzaXQoKTtcbiAgICB9LFxuXG4gICAgQWx0OiBmdW5jdGlvbih0ZXJtLCBfLCB0ZXJtcykge1xuICAgICAgdmFyIGFyZ3MgPSBbdGVybS52aXNpdCgpXS5jb25jYXQodGVybXMudmlzaXQoKSk7XG4gICAgICByZXR1cm4gYnVpbGRlci5hbHQuYXBwbHkoYnVpbGRlciwgYXJncykud2l0aEludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH0sXG5cbiAgICBUZXJtX2lubGluZTogZnVuY3Rpb24oYiwgbikge1xuICAgICAgdmFyIGlubGluZVJ1bGVOYW1lID0gY3VycmVudFJ1bGVOYW1lICsgJ18nICsgbi52aXNpdCgpO1xuICAgICAgdmFyIGJvZHkgPSBiLnZpc2l0KCk7XG4gICAgICBib2R5LmRlZmluaXRpb25JbnRlcnZhbCA9IHRoaXMuaW50ZXJ2YWwudHJpbW1lZCgpO1xuICAgICAgdmFyIGlzTmV3UnVsZURlY2xhcmF0aW9uID0gIShkZWNsLnN1cGVyR3JhbW1hciAmJiBkZWNsLnN1cGVyR3JhbW1hci5ydWxlRGljdFtpbmxpbmVSdWxlTmFtZV0pO1xuICAgICAgaWYgKG92ZXJyaWRpbmcgJiYgIWlzTmV3UnVsZURlY2xhcmF0aW9uKSB7XG4gICAgICAgIGRlY2wub3ZlcnJpZGUoaW5saW5lUnVsZU5hbWUsIGN1cnJlbnRSdWxlRm9ybWFscywgYm9keSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWNsLmRlZmluZShpbmxpbmVSdWxlTmFtZSwgY3VycmVudFJ1bGVGb3JtYWxzLCBib2R5KTtcbiAgICAgIH1cbiAgICAgIHZhciBwYXJhbXMgPSBjdXJyZW50UnVsZUZvcm1hbHMubWFwKGZ1bmN0aW9uKGZvcm1hbCkgeyByZXR1cm4gYnVpbGRlci5hcHAoZm9ybWFsKTsgfSk7XG4gICAgICByZXR1cm4gYnVpbGRlci5hcHAoaW5saW5lUnVsZU5hbWUsIHBhcmFtcykud2l0aEludGVydmFsKGJvZHkuaW50ZXJ2YWwpO1xuICAgIH0sXG5cbiAgICBTZXE6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICAgIHJldHVybiBidWlsZGVyLnNlcS5hcHBseShidWlsZGVyLCBleHByLnZpc2l0KCkpLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuXG4gICAgSXRlcl9zdGFyOiBmdW5jdGlvbih4LCBfKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5zdGFyKHgudmlzaXQoKSkud2l0aEludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH0sXG4gICAgSXRlcl9wbHVzOiBmdW5jdGlvbih4LCBfKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5wbHVzKHgudmlzaXQoKSkud2l0aEludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH0sXG4gICAgSXRlcl9vcHQ6IGZ1bmN0aW9uKHgsIF8pIHtcbiAgICAgIHJldHVybiBidWlsZGVyLm9wdCh4LnZpc2l0KCkpLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuXG4gICAgUHJlZF9ub3Q6IGZ1bmN0aW9uKF8sIHgpIHtcbiAgICAgIHJldHVybiBidWlsZGVyLm5vdCh4LnZpc2l0KCkpLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuICAgIFByZWRfbG9va2FoZWFkOiBmdW5jdGlvbihfLCB4KSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5sYSh4LnZpc2l0KCkpLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuXG4gICAgTGV4X2xleDogZnVuY3Rpb24oXywgeCkge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIubGV4KHgudmlzaXQoKSkud2l0aEludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH0sXG5cbiAgICBCYXNlX2FwcGxpY2F0aW9uOiBmdW5jdGlvbihydWxlLCBwcykge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIuYXBwKHJ1bGUudmlzaXQoKSwgcHMudmlzaXQoKVswXSB8fCBbXSkud2l0aEludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH0sXG4gICAgQmFzZV9yYW5nZTogZnVuY3Rpb24oZnJvbSwgXywgdG8pIHtcbiAgICAgIHJldHVybiBidWlsZGVyLnJhbmdlKGZyb20udmlzaXQoKSwgdG8udmlzaXQoKSkud2l0aEludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH0sXG4gICAgQmFzZV9wcmltOiBmdW5jdGlvbihleHByKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5wcmltKGV4cHIudmlzaXQoKSkud2l0aEludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH0sXG4gICAgQmFzZV9wYXJlbjogZnVuY3Rpb24ob3BlbiwgeCwgY2xvc2UpIHtcbiAgICAgIHJldHVybiB4LnZpc2l0KCk7XG4gICAgfSxcbiAgICBCYXNlX2FycjogZnVuY3Rpb24ob3BlbiwgeCwgY2xvc2UpIHtcbiAgICAgIHJldHVybiBidWlsZGVyLmFycih4LnZpc2l0KCkpLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuICAgIEJhc2Vfc3RyOiBmdW5jdGlvbihvcGVuLCB4LCBjbG9zZSkge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIuc3RyKHgudmlzaXQoKSk7XG4gICAgfSxcbiAgICBCYXNlX29iajogZnVuY3Rpb24ob3BlbiwgbGVuaWVudCwgY2xvc2UpIHtcbiAgICAgIHJldHVybiBidWlsZGVyLm9iaihbXSwgbGVuaWVudC52aXNpdCgpWzBdKTtcbiAgICB9LFxuXG4gICAgQmFzZV9vYmpXaXRoUHJvcHM6IGZ1bmN0aW9uKG9wZW4sIHBzLCBfLCBsZW5pZW50LCBjbG9zZSkge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIub2JqKHBzLnZpc2l0KCksIGxlbmllbnQudmlzaXQoKVswXSkud2l0aEludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH0sXG5cbiAgICBQcm9wczogZnVuY3Rpb24ocCwgXywgcHMpIHtcbiAgICAgIHJldHVybiBbcC52aXNpdCgpXS5jb25jYXQocHMudmlzaXQoKSk7XG4gICAgfSxcbiAgICBQcm9wOiBmdW5jdGlvbihuLCBfLCBwKSB7XG4gICAgICByZXR1cm4ge25hbWU6IG4udmlzaXQoKSwgcGF0dGVybjogcC52aXNpdCgpfTtcbiAgICB9LFxuXG4gICAgcnVsZURlc2NyOiBmdW5jdGlvbihvcGVuLCB0LCBjbG9zZSkge1xuICAgICAgcmV0dXJuIHQudmlzaXQoKTtcbiAgICB9LFxuICAgIHJ1bGVEZXNjclRleHQ6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzLnRyaW0oKTtcbiAgICB9LFxuXG4gICAgY2FzZU5hbWU6IGZ1bmN0aW9uKF8sIHNwYWNlMSwgbiwgc3BhY2UyLCBlbmQpIHtcbiAgICAgIHJldHVybiBuLnZpc2l0KCk7XG4gICAgfSxcblxuICAgIG5hbWU6IGZ1bmN0aW9uKGZpcnN0LCByZXN0KSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50cztcbiAgICB9LFxuICAgIG5hbWVGaXJzdDogZnVuY3Rpb24oZXhwcikge30sXG4gICAgbmFtZVJlc3Q6IGZ1bmN0aW9uKGV4cHIpIHt9LFxuXG4gICAga2V5d29yZF9udWxsOiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIGtleXdvcmRfdHJ1ZTogZnVuY3Rpb24oXykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBrZXl3b3JkX2ZhbHNlOiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIHN0cmluZzogZnVuY3Rpb24ob3BlbiwgY3MsIGNsb3NlKSB7XG4gICAgICByZXR1cm4gY3MudmlzaXQoKS5tYXAoZnVuY3Rpb24oYykgeyByZXR1cm4gY29tbW9uLnVuZXNjYXBlQ2hhcihjKTsgfSkuam9pbignJyk7XG4gICAgfSxcblxuICAgIHN0ckNoYXI6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzO1xuICAgIH0sXG5cbiAgICBlc2NhcGVDaGFyOiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50cztcbiAgICB9LFxuXG4gICAgbnVtYmVyOiBmdW5jdGlvbihfLCBkaWdpdHMpIHtcbiAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLmludGVydmFsLmNvbnRlbnRzKTtcbiAgICB9LFxuXG4gICAgc3BhY2U6IGZ1bmN0aW9uKGV4cHIpIHt9LFxuICAgIHNwYWNlX211bHRpTGluZTogZnVuY3Rpb24oc3RhcnQsIF8sIGVuZCkge30sXG4gICAgc3BhY2Vfc2luZ2xlTGluZTogZnVuY3Rpb24oc3RhcnQsIF8sIGVuZCkge30sXG5cbiAgICBMaXN0T2Zfc29tZTogZnVuY3Rpb24oeCwgXywgeHMpIHtcbiAgICAgIHJldHVybiBbeC52aXNpdCgpXS5jb25jYXQoeHMudmlzaXQoKSk7XG4gICAgfSxcbiAgICBMaXN0T2Zfbm9uZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGhlbHBlcnMobWF0Y2gpLnZpc2l0KCk7XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGVBbmRMb2FkKHNvdXJjZSwgbmFtZXNwYWNlKSB7XG4gIHZhciBtID0gb2htR3JhbW1hci5tYXRjaChzb3VyY2UsICdHcmFtbWFycycpO1xuICBpZiAobS5mYWlsZWQoKSkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuR3JhbW1hclN5bnRheEVycm9yKG0pO1xuICB9XG4gIHJldHVybiBidWlsZEdyYW1tYXIobSwgbmFtZXNwYWNlKTtcbn1cblxuLy8gUmV0dXJuIHRoZSBjb250ZW50cyBvZiBhIHNjcmlwdCBlbGVtZW50LCBmZXRjaGluZyBpdCB2aWEgWEhSIGlmIG5lY2Vzc2FyeS5cbmZ1bmN0aW9uIGdldFNjcmlwdEVsZW1lbnRDb250ZW50cyhlbCkge1xuICBpZiAoIWlzRWxlbWVudChlbCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhIERPTSBOb2RlLCBnb3QgJyArIGNvbW1vbi51bmV4cGVjdGVkT2JqVG9TdHJpbmcoZWwpKTtcbiAgfVxuICBpZiAoZWwudHlwZSAhPT0gJ3RleHQvb2htLWpzJykge1xuICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgYSBzY3JpcHQgdGFnIHdpdGggdHlwZT1cInRleHQvb2htLWpzXCIsIGdvdCAnICsgZWwpO1xuICB9XG4gIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUoJ3NyYycpID8gbG9hZChlbC5nZXRBdHRyaWJ1dGUoJ3NyYycpKSA6IGVsLmlubmVySFRNTDtcbn1cblxuZnVuY3Rpb24gZ3JhbW1hcihzb3VyY2UsIG9wdE5hbWVzcGFjZSkge1xuICB2YXIgbnMgPSBncmFtbWFycyhzb3VyY2UsIG9wdE5hbWVzcGFjZSk7XG5cbiAgLy8gRW5zdXJlIHRoYXQgdGhlIHNvdXJjZSBjb250YWluZWQgbm8gbW9yZSB0aGFuIG9uZSBncmFtbWFyIGRlZmluaXRpb24uXG4gIHZhciBncmFtbWFyTmFtZXMgPSBPYmplY3Qua2V5cyhucyk7XG4gIGlmIChncmFtbWFyTmFtZXMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGdyYW1tYXIgZGVmaW5pdGlvbicpO1xuICB9IGVsc2UgaWYgKGdyYW1tYXJOYW1lcy5sZW5ndGggPiAxKSB7XG4gICAgdmFyIHNlY29uZEdyYW1tYXIgPSBuc1tncmFtbWFyTmFtZXNbMV1dO1xuICAgIHZhciBpbnRlcnZhbCA9IHNlY29uZEdyYW1tYXIuZGVmaW5pdGlvbkludGVydmFsO1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgdXRpbC5nZXRMaW5lQW5kQ29sdW1uTWVzc2FnZShpbnRlcnZhbC5pbnB1dFN0cmVhbS5zb3VyY2UsIGludGVydmFsLnN0YXJ0SWR4KSArXG4gICAgICAgICdGb3VuZCBtb3JlIHRoYW4gb25lIGdyYW1tYXIgZGVmaW5pdGlvbiAtLSB1c2Ugb2htLmdyYW1tYXJzKCkgaW5zdGVhZC4nKTtcbiAgfVxuICByZXR1cm4gbnNbZ3JhbW1hck5hbWVzWzBdXTsgIC8vIFJldHVybiB0aGUgb25lIGFuZCBvbmx5IGdyYW1tYXIuXG59XG5cbmZ1bmN0aW9uIGdyYW1tYXJzKHNvdXJjZSwgb3B0TmFtZXNwYWNlKSB7XG4gIHZhciBucyA9IE5hbWVzcGFjZS5leHRlbmQoTmFtZXNwYWNlLmFzTmFtZXNwYWNlKG9wdE5hbWVzcGFjZSkpO1xuICBpZiAodHlwZW9mIHNvdXJjZSAhPT0gJ3N0cmluZycpIHtcbiAgICAvLyBGb3IgY29udmVuaWVuY2UsIGRldGVjdCBOb2RlLmpzIEJ1ZmZlciBvYmplY3RzIGFuZCBhdXRvbWF0aWNhbGx5IGNhbGwgdG9TdHJpbmcoKS5cbiAgICBpZiAoQnVmZmVyICYmIEJ1ZmZlci5pc0J1ZmZlcihzb3VyY2UpKSB7XG4gICAgICBzb3VyY2UgPSBzb3VyY2UudG9TdHJpbmcoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAnRXhwZWN0ZWQgc3RyaW5nIGFzIGZpcnN0IGFyZ3VtZW50LCBnb3QgJyArIGNvbW1vbi51bmV4cGVjdGVkT2JqVG9TdHJpbmcoc291cmNlKSk7XG4gICAgfVxuICB9XG4gIGNvbXBpbGVBbmRMb2FkKHNvdXJjZSwgbnMpO1xuICByZXR1cm4gbnM7XG59XG5cbmZ1bmN0aW9uIGdyYW1tYXJGcm9tU2NyaXB0RWxlbWVudChvcHROb2RlKSB7XG4gIHZhciBub2RlID0gb3B0Tm9kZTtcbiAgaWYgKGlzVW5kZWZpbmVkKG5vZGUpKSB7XG4gICAgdmFyIG5vZGVMaXN0ID0gZG9jdW1lbnRJbnRlcmZhY2UucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3R5cGU9XCJ0ZXh0L29obS1qc1wiXScpO1xuICAgIGlmIChub2RlTGlzdC5sZW5ndGggIT09IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnRXhwZWN0ZWQgZXhhY3RseSBvbmUgc2NyaXB0IHRhZyB3aXRoIHR5cGU9XCJ0ZXh0L29obS1qc1wiLCBmb3VuZCAnICsgbm9kZUxpc3QubGVuZ3RoKTtcbiAgICB9XG4gICAgbm9kZSA9IG5vZGVMaXN0WzBdO1xuICB9XG4gIHJldHVybiBncmFtbWFyKGdldFNjcmlwdEVsZW1lbnRDb250ZW50cyhub2RlKSk7XG59XG5cbmZ1bmN0aW9uIGdyYW1tYXJzRnJvbVNjcmlwdEVsZW1lbnRzKG9wdE5vZGVPck5vZGVMaXN0KSB7XG4gIC8vIFNpbXBsZSBjYXNlOiB0aGUgYXJndW1lbnQgaXMgYSBET00gbm9kZS5cbiAgaWYgKGlzRWxlbWVudChvcHROb2RlT3JOb2RlTGlzdCkpIHtcbiAgICByZXR1cm4gZ3JhbW1hcnMob3B0Tm9kZU9yTm9kZUxpc3QpO1xuICB9XG4gIC8vIE90aGVyd2lzZSwgaXQgbXVzdCBiZSBlaXRoZXIgdW5kZWZpbmVkIG9yIGEgTm9kZUxpc3QuXG4gIHZhciBub2RlTGlzdCA9IG9wdE5vZGVPck5vZGVMaXN0O1xuICBpZiAoaXNVbmRlZmluZWQobm9kZUxpc3QpKSB7XG4gICAgLy8gRmluZCBhbGwgc2NyaXB0IGVsZW1lbnRzIHdpdGggdHlwZT1cInRleHQvb2htLWpzXCIuXG4gICAgbm9kZUxpc3QgPSBkb2N1bWVudEludGVyZmFjZS5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHRbdHlwZT1cInRleHQvb2htLWpzXCJdJyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG5vZGVMaXN0ID09PSAnc3RyaW5nJyB8fCAoIWlzRWxlbWVudChub2RlTGlzdCkgJiYgIWlzQXJyYXlMaWtlKG5vZGVMaXN0KSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhIE5vZGUsIE5vZGVMaXN0LCBvciBBcnJheSwgYnV0IGdvdCAnICsgbm9kZUxpc3QpO1xuICB9XG4gIHZhciBucyA9IE5hbWVzcGFjZS5jcmVhdGVOYW1lc3BhY2UoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlTGlzdC5sZW5ndGg7ICsraSkge1xuICAgIC8vIENvcHkgdGhlIG5ldyBncmFtbWFycyBpbnRvIGBuc2AgdG8ga2VlcCB0aGUgbmFtZXNwYWNlIGZsYXQuXG4gICAgY29tbW9uLmV4dGVuZChucywgZ3JhbW1hcnMoZ2V0U2NyaXB0RWxlbWVudENvbnRlbnRzKG5vZGVMaXN0W2ldKSwgbnMpKTtcbiAgfVxuICByZXR1cm4gbnM7XG59XG5cbmZ1bmN0aW9uIG1ha2VSZWNpcGUocmVjaXBlRm4pIHtcbiAgcmV0dXJuIHJlY2lwZUZuLmNhbGwobmV3IEJ1aWxkZXIoKSk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBTdHVmZiB0aGF0IHVzZXJzIHNob3VsZCBrbm93IGFib3V0XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGVOYW1lc3BhY2U6IE5hbWVzcGFjZS5jcmVhdGVOYW1lc3BhY2UsXG4gIGVycm9yOiBlcnJvcnMsXG4gIGdyYW1tYXI6IGdyYW1tYXIsXG4gIGdyYW1tYXJzOiBncmFtbWFycyxcbiAgZ3JhbW1hckZyb21TY3JpcHRFbGVtZW50OiBncmFtbWFyRnJvbVNjcmlwdEVsZW1lbnQsXG4gIGdyYW1tYXJzRnJvbVNjcmlwdEVsZW1lbnRzOiBncmFtbWFyc0Zyb21TY3JpcHRFbGVtZW50cyxcbiAgbWFrZVJlY2lwZTogbWFrZVJlY2lwZSxcbiAgdXRpbDogdXRpbFxufTtcblxuLy8gU3R1ZmYgdGhhdCdzIG9ubHkgaGVyZSBmb3IgYm9vdHN0cmFwcGluZywgdGVzdGluZywgZXRjLlxuR3JhbW1hci5CdWlsdEluUnVsZXMgPSByZXF1aXJlKCcuLi9kaXN0L2J1aWx0LWluLXJ1bGVzJyk7XG5vaG1HcmFtbWFyID0gcmVxdWlyZSgnLi4vZGlzdC9vaG0tZ3JhbW1hcicpO1xubW9kdWxlLmV4cG9ydHMuX2J1aWxkR3JhbW1hciA9IGJ1aWxkR3JhbW1hcjtcbm1vZHVsZS5leHBvcnRzLl9zZXREb2N1bWVudEludGVyZmFjZUZvclRlc3RpbmcgPSBmdW5jdGlvbihkb2MpIHsgZG9jdW1lbnRJbnRlcmZhY2UgPSBkb2M7IH07XG5tb2R1bGUuZXhwb3J0cy5vaG1HcmFtbWFyID0gb2htR3JhbW1hcjtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyKSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIE5vZGUoZ3JhbW1hciwgY3Rvck5hbWUsIGNoaWxkcmVuLCBpbnRlcnZhbCkge1xuICB0aGlzLmdyYW1tYXIgPSBncmFtbWFyO1xuICB0aGlzLmN0b3JOYW1lID0gY3Rvck5hbWU7XG4gIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgdGhpcy5pbnRlcnZhbCA9IGludGVydmFsO1xufVxuXG5Ob2RlLnByb3RvdHlwZS5udW1DaGlsZHJlbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGg7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5jaGlsZEF0ID0gZnVuY3Rpb24oaWR4KSB7XG4gIHJldHVybiB0aGlzLmNoaWxkcmVuW2lkeF07XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5pbmRleE9mQ2hpbGQgPSBmdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uaW5kZXhPZihhcmcpO1xufTtcblxuTm9kZS5wcm90b3R5cGUuaGFzQ2hpbGRyZW4gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoID4gMDtcbn07XG5cbk5vZGUucHJvdG90eXBlLmhhc05vQ2hpbGRyZW4gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICF0aGlzLmhhc0NoaWxkcmVuKCk7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5vbmx5Q2hpbGQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnY2Fubm90IGdldCBvbmx5IGNoaWxkIG9mIGEgbm9kZSBvZiB0eXBlICcgKyB0aGlzLmN0b3JOYW1lICtcbiAgICAgICAgJyAoaXQgaGFzICcgKyB0aGlzLm51bUNoaWxkcmVuKCkgKyAnIGNoaWxkcmVuKScpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmZpcnN0Q2hpbGQoKTtcbiAgfVxufTtcblxuTm9kZS5wcm90b3R5cGUuZmlyc3RDaGlsZCA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5oYXNOb0NoaWxkcmVuKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdjYW5ub3QgZ2V0IGZpcnN0IGNoaWxkIG9mIGEgJyArIHRoaXMuY3Rvck5hbWUgKyAnIG5vZGUsIHdoaWNoIGhhcyBubyBjaGlsZHJlbicpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmNoaWxkQXQoMCk7XG4gIH1cbn07XG5cbk5vZGUucHJvdG90eXBlLmxhc3RDaGlsZCA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5oYXNOb0NoaWxkcmVuKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdjYW5ub3QgZ2V0IGxhc3QgY2hpbGQgb2YgYSAnICsgdGhpcy5jdG9yTmFtZSArICcgbm9kZSwgd2hpY2ggaGFzIG5vIGNoaWxkcmVuJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRBdCh0aGlzLm51bUNoaWxkcmVuKCkgLSAxKTtcbiAgfVxufTtcblxuTm9kZS5wcm90b3R5cGUuY2hpbGRCZWZvcmUgPSBmdW5jdGlvbihjaGlsZCkge1xuICB2YXIgY2hpbGRJZHggPSB0aGlzLmluZGV4T2ZDaGlsZChjaGlsZCk7XG4gIGlmIChjaGlsZElkeCA8IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vZGUuY2hpbGRCZWZvcmUoKSBjYWxsZWQgdy8gYW4gYXJndW1lbnQgdGhhdCBpcyBub3QgYSBjaGlsZCcpO1xuICB9IGVsc2UgaWYgKGNoaWxkSWR4ID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZ2V0IGNoaWxkIGJlZm9yZSBmaXJzdCBjaGlsZCcpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmNoaWxkQXQoY2hpbGRJZHggLSAxKTtcbiAgfVxufTtcblxuTm9kZS5wcm90b3R5cGUuY2hpbGRBZnRlciA9IGZ1bmN0aW9uKGNoaWxkKSB7XG4gIHZhciBjaGlsZElkeCA9IHRoaXMuaW5kZXhPZkNoaWxkKGNoaWxkKTtcbiAgaWYgKGNoaWxkSWR4IDwgMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm9kZS5jaGlsZEFmdGVyKCkgY2FsbGVkIHcvIGFuIGFyZ3VtZW50IHRoYXQgaXMgbm90IGEgY2hpbGQnKTtcbiAgfSBlbHNlIGlmIChjaGlsZElkeCA9PT0gdGhpcy5udW1DaGlsZHJlbigpIC0gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGdldCBjaGlsZCBhZnRlciBsYXN0IGNoaWxkJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRBdChjaGlsZElkeCArIDEpO1xuICB9XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5pc1Rlcm1pbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbk5vZGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgciA9IHt9O1xuICByW3RoaXMuY3Rvck5hbWVdID0gdGhpcy5jaGlsZHJlbjtcbiAgcmV0dXJuIHI7XG59O1xuXG5mdW5jdGlvbiBUZXJtaW5hbE5vZGUoZ3JhbW1hciwgdmFsdWUsIGludGVydmFsKSB7XG4gIE5vZGUuY2FsbCh0aGlzLCBncmFtbWFyLCAnX3Rlcm1pbmFsJywgW10sIGludGVydmFsKTtcbiAgdGhpcy5wcmltaXRpdmVWYWx1ZSA9IHZhbHVlO1xufVxuaW5oZXJpdHMoVGVybWluYWxOb2RlLCBOb2RlKTtcblxuVGVybWluYWxOb2RlLnByb3RvdHlwZS5pc1Rlcm1pbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0cnVlO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0ge05vZGU6IE5vZGUsIFRlcm1pbmFsTm9kZTogVGVybWluYWxOb2RlfTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnl0aGluZy5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG5wZXhwcnMuZW5kLmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbnBleHBycy5QcmltLnByb3RvdHlwZS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihydWxlTmFtZSwgZ3JhbW1hcikge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihydWxlTmFtZSwgZ3JhbW1hcikge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLnRlcm1zW2lkeF0uYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQocnVsZU5hbWUsIGdyYW1tYXIpO1xuICB9XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uKHJ1bGVOYW1lLCBncmFtbWFyKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy5mYWN0b3JzW2lkeF0uYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQocnVsZU5hbWUsIGdyYW1tYXIpO1xuICB9XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxucGV4cHJzLk5vdC5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxucGV4cHJzLkxleC5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxucGV4cHJzLkFyci5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxucGV4cHJzLlN0ci5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihydWxlTmFtZSwgZ3JhbW1hcikge1xuICB0aGlzLmV4cHIuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQocnVsZU5hbWUsIGdyYW1tYXIpO1xufTtcblxucGV4cHJzLk9iai5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihydWxlTmFtZSwgZ3JhbW1hcikge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQocnVsZU5hbWUsIGdyYW1tYXIpO1xuICB9XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24ocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgdmFyIGJvZHkgPSBncmFtbWFyLnJ1bGVEaWN0W3RoaXMucnVsZU5hbWVdO1xuXG4gIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBydWxlIGV4aXN0c1xuICBpZiAoIWJvZHkpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLlVuZGVjbGFyZWRSdWxlKHRoaXMucnVsZU5hbWUsIGdyYW1tYXIubmFtZSwgdGhpcyk7XG4gIH1cblxuICAvLyAuLi4gYW5kIHRoYXQgdGhpcyBhcHBsaWNhdGlvbiBpcyBhbGxvd2VkXG4gIGlmICghY29tbW9uLmlzU3ludGFjdGljKHJ1bGVOYW1lKSAmJiBjb21tb24uaXNTeW50YWN0aWModGhpcy5ydWxlTmFtZSkpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkFwcGxpY2F0aW9uT2ZTeW50YWN0aWNSdWxlRnJvbUxleGljYWxSdWxlKHJ1bGVOYW1lLCB0aGlzLnJ1bGVOYW1lLCB0aGlzKTtcbiAgfVxuXG4gIC8vIC4uLiBhbmQgdGhhdCB0aGlzIGFwcGxpY2F0aW9uIGhhcyB0aGUgY29ycmVjdCBudW1iZXIgb2YgcGFyYW1ldGVyc1xuICB2YXIgYWN0dWFsID0gdGhpcy5wYXJhbXMubGVuZ3RoO1xuICB2YXIgZXhwZWN0ZWQgPSBib2R5LmZvcm1hbHMubGVuZ3RoO1xuICBpZiAoYWN0dWFsICE9PSBleHBlY3RlZCkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuV3JvbmdOdW1iZXJPZlBhcmFtZXRlcnModGhpcy5ydWxlTmFtZSwgZXhwZWN0ZWQsIGFjdHVhbCwgdGhpcyk7XG4gIH1cblxuICAvLyAuLi4gYW5kIHRoYXQgYWxsIG9mIHRoZSBwYXJhbWV0ZXIgZXhwcmVzc2lvbnMgb25seSBoYXZlIHZhbGlkIGFwcGxpY2F0aW9ucyBhbmQgaGF2ZSBhcml0eSAxXG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5wYXJhbXMuZm9yRWFjaChmdW5jdGlvbihwYXJhbSkge1xuICAgIHBhcmFtLmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbiAgICBpZiAocGFyYW0uZ2V0QXJpdHkoKSAhPT0gMSkge1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5JbnZhbGlkUGFyYW1ldGVyKHNlbGYucnVsZU5hbWUsIHBhcmFtKTtcbiAgICB9XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnl0aGluZy5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG5wZXhwcnMuZW5kLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbnBleHBycy5QcmltLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxucGV4cHJzLkxleC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBpZiAodGhpcy50ZXJtcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGFyaXR5ID0gdGhpcy50ZXJtc1swXS5nZXRBcml0eSgpO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICB2YXIgdGVybSA9IHRoaXMudGVybXNbaWR4XTtcbiAgICB0ZXJtLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KCk7XG4gICAgdmFyIG90aGVyQXJpdHkgPSB0ZXJtLmdldEFyaXR5KCk7XG4gICAgaWYgKGFyaXR5ICE9PSBvdGhlckFyaXR5KSB7XG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLkluY29uc2lzdGVudEFyaXR5KHJ1bGVOYW1lLCBhcml0eSwgb3RoZXJBcml0eSwgdGhpcyk7XG4gICAgfVxuICB9XG59O1xuXG5wZXhwcnMuRXh0ZW5kLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIEV4dGVuZCBpcyBhIHNwZWNpYWwgY2FzZSBvZiBBbHQgdGhhdCdzIGd1YXJhbnRlZWQgdG8gaGF2ZSBleGFjdGx5IHR3b1xuICAvLyBjYXNlczogW2V4dGVuc2lvbnMsIG9yaWdCb2R5XS5cbiAgdmFyIGFjdHVhbEFyaXR5ID0gdGhpcy50ZXJtc1swXS5nZXRBcml0eSgpO1xuICB2YXIgZXhwZWN0ZWRBcml0eSA9IHRoaXMudGVybXNbMV0uZ2V0QXJpdHkoKTtcbiAgaWYgKGFjdHVhbEFyaXR5ICE9PSBleHBlY3RlZEFyaXR5KSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5JbmNvbnNpc3RlbnRBcml0eShydWxlTmFtZSwgZXhwZWN0ZWRBcml0eSwgYWN0dWFsQXJpdHksIHRoaXMpO1xuICB9XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy5mYWN0b3JzW2lkeF0uYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpO1xuICB9XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICAvLyBuby1vcCAobm90IHJlcXVpcmVkIGIvYyB0aGUgbmVzdGVkIGV4cHIgZG9lc24ndCBzaG93IHVwIGluIHRoZSBDU1QpXG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG5wZXhwcnMuQXJyLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG5wZXhwcnMuU3RyLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eShydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzW2lkeF0ucGF0dGVybi5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eShydWxlTmFtZSk7XG4gIH1cbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICAvLyBUaGUgYXJpdGllcyBvZiB0aGUgcGFyYW1ldGVyIGV4cHJlc3Npb25zIGlzIHJlcXVpcmVkIHRvIGJlIDEgYnlcbiAgLy8gYGFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKClgLlxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gY29tbW9uLmFic3RyYWN0O1xuXG5wZXhwcnMuYW55dGhpbmcuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbnBleHBycy5lbmQuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbnBleHBycy5QcmltLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLlByaW0ucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIHJ1bGVOYW1lKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLnRlcm1zW2lkeF0uYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIsIHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgcnVsZU5hbWUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLmZhY3RvcnNbaWR4XS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUoZ3JhbW1hciwgcnVsZU5hbWUpO1xuICB9XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgcnVsZU5hbWUpIHtcbiAgLy8gTm90ZTogdGhpcyBpcyB0aGUgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBtZXRob2QgZm9yIGBTdGFyYCBhbmQgYFBsdXNgIGV4cHJlc3Npb25zLlxuICAvLyBJdCBpcyBvdmVycmlkZGVuIGZvciBgT3B0YCBiZWxvdy5cbiAgdGhpcy5leHByLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyLCBydWxlTmFtZSk7XG4gIGlmICh0aGlzLmV4cHIuaXNOdWxsYWJsZShncmFtbWFyKSkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuS2xlZW5lRXhwckhhc051bGxhYmxlT3BlcmFuZCh0aGlzLCBydWxlTmFtZSk7XG4gIH1cbn07XG5cbnBleHBycy5PcHQucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG5wZXhwcnMuTm90LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbnBleHBycy5MZXgucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG5wZXhwcnMuQXJyLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLlN0ci5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgcnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyLCBydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIsIHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBydWxlTmFtZSkge1xuICB0aGlzLnBhcmFtcy5mb3JFYWNoKGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgcGFyYW0uYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIsIHJ1bGVOYW1lKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgbm9kZXMgPSByZXF1aXJlKCcuL25vZGVzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuY2hlY2sgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnl0aGluZy5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHZhbHMubGVuZ3RoID49IDE7XG59O1xuXG5wZXhwcnMuZW5kLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICByZXR1cm4gdmFsc1swXSBpbnN0YW5jZW9mIG5vZGVzLk5vZGUgJiZcbiAgICAgICAgIHZhbHNbMF0uaXNUZXJtaW5hbCgpICYmXG4gICAgICAgICB2YWxzWzBdLnByaW1pdGl2ZVZhbHVlID09PSB1bmRlZmluZWQ7XG59O1xuXG5wZXhwcnMuUHJpbS5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIHJldHVybiB2YWxzWzBdIGluc3RhbmNlb2Ygbm9kZXMuTm9kZSAmJlxuICAgICAgICAgdmFsc1swXS5pc1Rlcm1pbmFsKCkgJiZcbiAgICAgICAgIHZhbHNbMF0ucHJpbWl0aXZlVmFsdWUgPT09IHRoaXMub2JqO1xufTtcblxucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHZhbHNbMF0gaW5zdGFuY2VvZiBub2Rlcy5Ob2RlICYmXG4gICAgICAgICB2YWxzWzBdLmlzVGVybWluYWwoKSAmJlxuICAgICAgICAgdHlwZW9mIHZhbHNbMF0ucHJpbWl0aXZlVmFsdWUgPT09IHR5cGVvZiB0aGlzLmZyb207XG59O1xuXG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICByZXR1cm4gdmFscy5sZW5ndGggPj0gMTtcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudGVybXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdGVybSA9IHRoaXMudGVybXNbaV07XG4gICAgaWYgKHRlcm0uY2hlY2soZ3JhbW1hciwgdmFscykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgdmFyIHBvcyA9IDA7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGZhY3RvciA9IHRoaXMuZmFjdG9yc1tpXTtcbiAgICBpZiAoZmFjdG9yLmNoZWNrKGdyYW1tYXIsIHZhbHMuc2xpY2UocG9zKSkpIHtcbiAgICAgIHBvcyArPSBmYWN0b3IuZ2V0QXJpdHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnBleHBycy5JdGVyLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgdmFyIGFyaXR5ID0gdGhpcy5nZXRBcml0eSgpO1xuICB2YXIgY29sdW1ucyA9IHZhbHMuc2xpY2UoMCwgYXJpdHkpO1xuICBpZiAoY29sdW1ucy5sZW5ndGggIT09IGFyaXR5KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciByb3dDb3VudCA9IGNvbHVtbnNbMF0ubGVuZ3RoO1xuICB2YXIgaTtcbiAgZm9yIChpID0gMTsgaSA8IGFyaXR5OyBpKyspIHtcbiAgICBpZiAoY29sdW1uc1tpXS5sZW5ndGggIT09IHJvd0NvdW50KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IHJvd0NvdW50OyBpKyspIHtcbiAgICB2YXIgcm93ID0gW107XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBhcml0eTsgaisrKSB7XG4gICAgICByb3cucHVzaChjb2x1bW5zW2pdW2ldKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmV4cHIuY2hlY2soZ3JhbW1hciwgcm93KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuY2hlY2sgPVxucGV4cHJzLkxleC5wcm90b3R5cGUuY2hlY2sgPVxucGV4cHJzLkFyci5wcm90b3R5cGUuY2hlY2sgPVxucGV4cHJzLlN0ci5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuY2hlY2soZ3JhbW1hciwgdmFscyk7XG59O1xuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgdmFyIGZpeGVkQXJpdHkgPSB0aGlzLmdldEFyaXR5KCk7XG4gIGlmICh0aGlzLmlzTGVuaWVudCkge1xuICAgIGZpeGVkQXJpdHktLTtcbiAgfVxuXG4gIHZhciBwb3MgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpeGVkQXJpdHk7IGkrKykge1xuICAgIHZhciBwYXR0ZXJuID0gdGhpcy5wcm9wZXJ0aWVzW2ldLnBhdHRlcm47XG4gICAgaWYgKHBhdHRlcm4uY2hlY2soZ3JhbW1hciwgdmFscy5zbGljZShwb3MpKSkge1xuICAgICAgcG9zICs9IHBhdHRlcm4uZ2V0QXJpdHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzLmlzTGVuaWVudCA/IHR5cGVvZiB2YWxzW3Bvc10gPT09ICdvYmplY3QnICYmIHZhbHNbcG9zXSA6IHRydWU7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICBpZiAoISh2YWxzWzBdIGluc3RhbmNlb2Ygbm9kZXMuTm9kZSAmJlxuICAgICAgICB2YWxzWzBdLmdyYW1tYXIgPT09IGdyYW1tYXIgJiZcbiAgICAgICAgdmFsc1swXS5jdG9yTmFtZSA9PT0gdGhpcy5ydWxlTmFtZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBUT0RPOiB0aGluayBhYm91dCAqbm90KiBkb2luZyB0aGUgZm9sbG93aW5nIGNoZWNrcywgaS5lLiwgdHJ1c3RpbmcgdGhhdCB0aGUgcnVsZVxuICAvLyB3YXMgY29ycmVjdGx5IGNvbnN0cnVjdGVkLlxuICB2YXIgcnVsZU5vZGUgPSB2YWxzWzBdO1xuICB2YXIgYm9keSA9IGdyYW1tYXIucnVsZURpY3RbdGhpcy5ydWxlTmFtZV07XG4gIHJldHVybiBib2R5LmNoZWNrKGdyYW1tYXIsIHJ1bGVOb2RlLmNoaWxkcmVuKSAmJiBydWxlTm9kZS5udW1DaGlsZHJlbigpID09PSBib2R5LmdldEFyaXR5KCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIElucHV0U3RyZWFtID0gcmVxdWlyZSgnLi9JbnB1dFN0cmVhbScpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgbm9kZXMgPSByZXF1aXJlKCcuL25vZGVzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxudmFyIE5vZGUgPSBub2Rlcy5Ob2RlO1xudmFyIFRlcm1pbmFsTm9kZSA9IG5vZGVzLlRlcm1pbmFsTm9kZTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogIEV2YWx1YXRlIHRoZSBleHByZXNzaW9uIGFuZCByZXR1cm4gYHRydWVgIGlmIGl0IHN1Y2NlZWRlZCwgYGZhbHNlYCBvdGhlcndpc2UuIE9uIHN1Y2Nlc3MsIHRoZVxuICogIGJpbmRpbmdzIHdpbGwgaGF2ZSBgdGhpcy5hcml0eWAgbW9yZSBlbGVtZW50cyB0aGFuIGJlZm9yZSwgYW5kIHRoZSBwb3NpdGlvbiBtYXkgaGF2ZSBpbmNyZWFzZWQuXG4gKiAgT24gZmFpbHVyZSwgdGhlIGJpbmRpbmdzIGFuZCBwb3NpdGlvbiB3aWxsIGJlIHVuY2hhbmdlZC5cbiAqL1xucGV4cHJzLlBFeHByLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICB2YXIgb3JpZ051bUJpbmRpbmdzID0gc3RhdGUuYmluZGluZ3MubGVuZ3RoO1xuICB2YXIgb3JpZ1RyYWNlID0gc3RhdGUudHJhY2U7XG5cbiAgaWYgKHN0YXRlLmlzVHJhY2luZygpKSB7XG4gICAgc3RhdGUudHJhY2UgPSBbXTtcbiAgfVxuXG4gIC8vIERvIHRoZSBhY3R1YWwgZXZhbHVhdGlvbi5cbiAgdmFyIGFucyA9IHRoaXMuX2V2YWwoc3RhdGUpO1xuXG4gIGlmIChzdGF0ZS5pc1RyYWNpbmcoKSkge1xuICAgIHZhciB0cmFjZUVudHJ5ID0gc3RhdGUuZ2V0VHJhY2VFbnRyeShvcmlnUG9zLCB0aGlzLCBhbnMpO1xuICAgIG9yaWdUcmFjZS5wdXNoKHRyYWNlRW50cnkpO1xuICAgIHN0YXRlLnRyYWNlID0gb3JpZ1RyYWNlO1xuICB9XG5cbiAgaWYgKCFhbnMpIHtcbiAgICAvLyBSZXNldCB0aGUgcG9zaXRpb24gYW5kIHRoZSBiaW5kaW5ncy5cbiAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgIHN0YXRlLnRydW5jYXRlQmluZGluZ3Mob3JpZ051bUJpbmRpbmdzKTtcbiAgfVxuXG4gIHJldHVybiBhbnM7XG59O1xuXG4vKipcbiAqICBFdmFsdWF0ZSB0aGUgZXhwcmVzc2lvbiBhbmQgcmV0dXJuIHRydWUgaWYgaXQgc3VjY2VlZGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gKiAgVGhpcyBtZXRob2Qgc2hvdWxkIG5vdCBiZSBjYWxsZWQgZGlyZWN0bHkgZXhjZXB0IGJ5IGBldmFsYC5cbiAqXG4gKiAgVGhlIGNvbnRyYWN0IG9mIHRoaXMgbWV0aG9kIGlzIGFzIGZvbGxvd3M6XG4gKiAgLSBXaGVuIHRoZSByZXR1cm4gdmFsdWUgaXMgdHJ1ZTpcbiAqICAgIC0gYmluZGluZ3Mgd2lsbCBoYXZlIGV4cHIuYXJpdHkgbW9yZSBlbGVtZW50cyB0aGFuIGJlZm9yZVxuICogIC0gV2hlbiB0aGUgcmV0dXJuIHZhbHVlIGlzIGZhbHNlOlxuICogICAgLSBiaW5kaW5ncyBtYXkgaGF2ZSBtb3JlIGVsZW1lbnRzIHRoYW4gYmVmb3JlIHRoaXMgY2FsbFxuICogICAgLSBwb3NpdGlvbiBjb3VsZCBiZSBhbnl3aGVyZVxuICovXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLl9ldmFsID0gY29tbW9uLmFic3RyYWN0O1xuXG5wZXhwcnMuYW55dGhpbmcuX2V2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgb3JpZ1BvcyA9IHN0YXRlLnNraXBTcGFjZXNJZkluU3ludGFjdGljQ29udGV4dCgpO1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIHZhbHVlID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAodmFsdWUgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgc3RhdGUucmVjb3JkRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGludGVydmFsID0gaW5wdXRTdHJlYW0uaW50ZXJ2YWwob3JpZ1Bvcyk7XG4gICAgc3RhdGUuYmluZGluZ3MucHVzaChuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIHZhbHVlLCBpbnRlcnZhbCkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5wZXhwcnMuZW5kLl9ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIG9yaWdQb3MgPSBzdGF0ZS5za2lwU3BhY2VzSWZJblN5bnRhY3RpY0NvbnRleHQoKTtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIGlmIChpbnB1dFN0cmVhbS5hdEVuZCgpKSB7XG4gICAgdmFyIGludGVydmFsID0gaW5wdXRTdHJlYW0uaW50ZXJ2YWwoaW5wdXRTdHJlYW0ucG9zKTtcbiAgICBzdGF0ZS5iaW5kaW5ncy5wdXNoKG5ldyBUZXJtaW5hbE5vZGUoc3RhdGUuZ3JhbW1hciwgdW5kZWZpbmVkLCBpbnRlcnZhbCkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHN0YXRlLnJlY29yZEZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5wZXhwcnMuUHJpbS5wcm90b3R5cGUuX2V2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgb3JpZ1BvcyA9IHN0YXRlLnNraXBTcGFjZXNJZkluU3ludGFjdGljQ29udGV4dCgpO1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgaWYgKHRoaXMubWF0Y2goaW5wdXRTdHJlYW0pID09PSBjb21tb24uZmFpbCkge1xuICAgIHN0YXRlLnJlY29yZEZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHZhciBpbnRlcnZhbCA9IGlucHV0U3RyZWFtLmludGVydmFsKG9yaWdQb3MpO1xuICAgIHZhciBwcmltaXRpdmVWYWx1ZSA9IHRoaXMub2JqO1xuICAgIHN0YXRlLmJpbmRpbmdzLnB1c2gobmV3IFRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCBwcmltaXRpdmVWYWx1ZSwgaW50ZXJ2YWwpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24oaW5wdXRTdHJlYW0pIHtcbiAgcmV0dXJuIGlucHV0U3RyZWFtLm1hdGNoRXhhY3RseSh0aGlzLm9iaik7XG59O1xuXG5wZXhwcnMuU3RyaW5nUHJpbS5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbihpbnB1dFN0cmVhbSkge1xuICByZXR1cm4gaW5wdXRTdHJlYW0ubWF0Y2hTdHJpbmcodGhpcy5vYmopO1xufTtcblxucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5fZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBvcmlnUG9zID0gc3RhdGUuc2tpcFNwYWNlc0lmSW5TeW50YWN0aWNDb250ZXh0KCk7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb2JqID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAodHlwZW9mIG9iaiA9PT0gdHlwZW9mIHRoaXMuZnJvbSAmJiB0aGlzLmZyb20gPD0gb2JqICYmIG9iaiA8PSB0aGlzLnRvKSB7XG4gICAgdmFyIGludGVydmFsID0gaW5wdXRTdHJlYW0uaW50ZXJ2YWwob3JpZ1Bvcyk7XG4gICAgc3RhdGUuYmluZGluZ3MucHVzaChuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIG9iaiwgaW50ZXJ2YWwpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBzdGF0ZS5yZWNvcmRGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5fZXZhbCA9IGZ1bmN0aW9uKHN0YXRlLCBpbnB1dFN0cmVhbSkge1xuICByZXR1cm4gc3RhdGUuY3VycmVudEFwcGxpY2F0aW9uKCkucGFyYW1zW3RoaXMuaW5kZXhdLmV2YWwoc3RhdGUpO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuX2V2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAodGhpcy50ZXJtc1tpZHhdLmV2YWwoc3RhdGUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuX2V2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciBmYWN0b3IgPSB0aGlzLmZhY3RvcnNbaWR4XTtcbiAgICBpZiAoIWZhY3Rvci5ldmFsKHN0YXRlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnBleHBycy5JdGVyLnByb3RvdHlwZS5fZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIGFyaXR5ID0gdGhpcy5nZXRBcml0eSgpO1xuICB2YXIgY29scyA9IFtdO1xuICB3aGlsZSAoY29scy5sZW5ndGggPCBhcml0eSkge1xuICAgIGNvbHMucHVzaChbXSk7XG4gIH1cbiAgdmFyIG51bU1hdGNoZXMgPSAwO1xuICB2YXIgaWR4O1xuICB3aGlsZSAobnVtTWF0Y2hlcyA8IHRoaXMubWF4TnVtTWF0Y2hlcyAmJiB0aGlzLmV4cHIuZXZhbChzdGF0ZSkpIHtcbiAgICBudW1NYXRjaGVzKys7XG4gICAgdmFyIHJvdyA9IHN0YXRlLmJpbmRpbmdzLnNwbGljZShzdGF0ZS5iaW5kaW5ncy5sZW5ndGggLSBhcml0eSwgYXJpdHkpO1xuICAgIGZvciAoaWR4ID0gMDsgaWR4IDwgcm93Lmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGNvbHNbaWR4XS5wdXNoKHJvd1tpZHhdKTtcbiAgICB9XG4gIH1cbiAgaWYgKG51bU1hdGNoZXMgPCB0aGlzLm1pbk51bU1hdGNoZXMpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGludGVydmFsO1xuICBpZiAobnVtTWF0Y2hlcyA9PT0gMCkge1xuICAgIGludGVydmFsID0gaW5wdXRTdHJlYW0uaW50ZXJ2YWwob3JpZ1Bvcywgb3JpZ1Bvcyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGZpcnN0Q29sID0gY29sc1swXTtcbiAgICB2YXIgbGFzdENvbCA9IGNvbHNbY29scy5sZW5ndGggLSAxXTtcbiAgICBpbnRlcnZhbCA9IGlucHV0U3RyZWFtLmludGVydmFsKFxuICAgICAgICBmaXJzdENvbFswXS5pbnRlcnZhbC5zdGFydElkeCxcbiAgICAgICAgbGFzdENvbFtsYXN0Q29sLmxlbmd0aCAtIDFdLmludGVydmFsLmVuZElkeCk7XG4gIH1cbiAgZm9yIChpZHggPSAwOyBpZHggPCBjb2xzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBzdGF0ZS5iaW5kaW5ncy5wdXNoKG5ldyBOb2RlKHN0YXRlLmdyYW1tYXIsICdfaXRlcicsIGNvbHNbaWR4XSwgaW50ZXJ2YWwpKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLl9ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgLypcbiAgICBUT0RPOlxuICAgIC0gUmlnaHQgbm93IHdlJ3JlIGp1c3QgdGhyb3dpbmcgYXdheSBhbGwgb2YgdGhlIGZhaWx1cmVzIHRoYXQgaGFwcGVuIGluc2lkZSBhIGBub3RgLCBhbmRcbiAgICAgIHJlY29yZGluZyBgdGhpc2AgYXMgYSBmYWlsZWQgZXhwcmVzc2lvbi5cbiAgICAtIERvdWJsZSBuZWdhdGlvbiBzaG91bGQgYmUgZXF1aXZhbGVudCB0byBsb29rYWhlYWQsIGJ1dCB0aGF0J3Mgbm90IHRoZSBjYXNlIHJpZ2h0IG5vdyB3cnRcbiAgICAgIGZhaWx1cmVzLiBFLmcuLCB+fidmb28nIHByb2R1Y2VzIGEgZmFpbHVyZSBmb3Igfn4nZm9vJywgYnV0IG1heWJlIGl0IHNob3VsZCBwcm9kdWNlXG4gICAgICBhIGZhaWx1cmUgZm9yICdmb28nIGluc3RlYWQuXG4gICovXG5cbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICB2YXIgb3JpZ051bUJpbmRpbmdzID0gc3RhdGUuYmluZGluZ3MubGVuZ3RoO1xuICBzdGF0ZS5pZ25vcmVGYWlsdXJlcygpO1xuICB2YXIgYW5zID0gdGhpcy5leHByLmV2YWwoc3RhdGUpO1xuICBzdGF0ZS5yZWNvcmRGYWlsdXJlcygpO1xuICBpZiAoYW5zKSB7XG4gICAgc3RhdGUucmVjb3JkRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICBzdGF0ZS50cnVuY2F0ZUJpbmRpbmdzKG9yaWdOdW1CaW5kaW5ncyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3M7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLl9ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICBpZiAodGhpcy5leHByLmV2YWwoc3RhdGUpKSB7XG4gICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbnBleHBycy5MZXgucHJvdG90eXBlLl9ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGFwcCA9IHN0YXRlLmN1cnJlbnRBcHBsaWNhdGlvbigpO1xuICBhcHAubGV4aWZ5KCk7XG4gIHZhciBhbnMgPSB0aGlzLmV4cHIuZXZhbChzdGF0ZSk7XG4gIGFwcC51bmxleGlmeSgpO1xuICByZXR1cm4gYW5zO1xufTtcblxucGV4cHJzLkFyci5wcm90b3R5cGUuX2V2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgb2JqID0gc3RhdGUuaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgdmFyIG9iaklucHV0U3RyZWFtID0gSW5wdXRTdHJlYW0ubmV3Rm9yKG9iaik7XG4gICAgc3RhdGUucHVzaElucHV0U3RyZWFtKG9iaklucHV0U3RyZWFtKTtcbiAgICB2YXIgYW5zID0gdGhpcy5leHByLmV2YWwoc3RhdGUpICYmIG9iaklucHV0U3RyZWFtLmF0RW5kKCk7XG4gICAgc3RhdGUucG9wSW5wdXRTdHJlYW0oKTtcbiAgICByZXR1cm4gYW5zO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxucGV4cHJzLlN0ci5wcm90b3R5cGUuX2V2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgb2JqID0gc3RhdGUuaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgc3RySW5wdXRTdHJlYW0gPSBJbnB1dFN0cmVhbS5uZXdGb3Iob2JqKTtcbiAgICBzdGF0ZS5wdXNoSW5wdXRTdHJlYW0oc3RySW5wdXRTdHJlYW0pO1xuICAgIHZhciBhbnMgPSB0aGlzLmV4cHIuZXZhbChzdGF0ZSkgJiYgcGV4cHJzLmVuZC5ldmFsKHN0YXRlKTtcbiAgICBpZiAoYW5zKSB7XG4gICAgICAvLyBQb3AgdGhlIGJpbmRpbmcgdGhhdCB3YXMgYWRkZWQgYnkgYGVuZGAsIHdoaWNoIHdlIGRvbid0IHdhbnQuXG4gICAgICBzdGF0ZS5iaW5kaW5ncy5wb3AoKTtcbiAgICB9XG4gICAgc3RhdGUucG9wSW5wdXRTdHJlYW0oKTtcbiAgICByZXR1cm4gYW5zO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxucGV4cHJzLk9iai5wcm90b3R5cGUuX2V2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIHZhciBvYmogPSBpbnB1dFN0cmVhbS5uZXh0KCk7XG4gIGlmIChvYmogIT09IGNvbW1vbi5mYWlsICYmIG9iaiAmJiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICB2YXIgbnVtT3duUHJvcGVydGllc01hdGNoZWQgPSAwO1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgcHJvcGVydHkgPSB0aGlzLnByb3BlcnRpZXNbaWR4XTtcbiAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KHByb3BlcnR5Lm5hbWUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHZhciB2YWx1ZSA9IG9ialtwcm9wZXJ0eS5uYW1lXTtcbiAgICAgIHZhciB2YWx1ZUlucHV0U3RyZWFtID0gSW5wdXRTdHJlYW0ubmV3Rm9yKFt2YWx1ZV0pO1xuICAgICAgc3RhdGUucHVzaElucHV0U3RyZWFtKHZhbHVlSW5wdXRTdHJlYW0pO1xuICAgICAgdmFyIG1hdGNoZWQgPSBwcm9wZXJ0eS5wYXR0ZXJuLmV2YWwoc3RhdGUpICYmIHZhbHVlSW5wdXRTdHJlYW0uYXRFbmQoKTtcbiAgICAgIHN0YXRlLnBvcElucHV0U3RyZWFtKCk7XG4gICAgICBpZiAoIW1hdGNoZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgbnVtT3duUHJvcGVydGllc01hdGNoZWQrKztcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNMZW5pZW50KSB7XG4gICAgICB2YXIgcmVtYWluZGVyID0ge307XG4gICAgICBmb3IgKHZhciBwIGluIG9iaikge1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHApICYmIHRoaXMucHJvcGVydGllcy5pbmRleE9mKHApIDwgMCkge1xuICAgICAgICAgIHJlbWFpbmRlcltwXSA9IG9ialtwXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIGludGVydmFsID0gaW5wdXRTdHJlYW0uaW50ZXJ2YWwob3JpZ1Bvcyk7XG4gICAgICBzdGF0ZS5iaW5kaW5ncy5wdXNoKG5ldyBUZXJtaW5hbE5vZGUoc3RhdGUuZ3JhbW1hciwgcmVtYWluZGVyLCBpbnRlcnZhbCkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudW1Pd25Qcm9wZXJ0aWVzTWF0Y2hlZCA9PT0gT2JqZWN0LmtleXMob2JqKS5sZW5ndGg7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuZnVuY3Rpb24gdXNlTWVtb2l6ZWRSZXN1bHQoc3RhdGUsIGFwcGxpY2F0aW9uLCBtZW1vUmVjT3JMUikge1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIGJpbmRpbmdzID0gc3RhdGUuYmluZGluZ3M7XG5cbiAgaW5wdXRTdHJlYW0ucG9zID0gbWVtb1JlY09yTFIucG9zO1xuICBpZiAobWVtb1JlY09yTFIuZmFpbHVyZURlc2NyaXB0b3IpIHtcbiAgICBzdGF0ZS5yZWNvcmRGYWlsdXJlcyhtZW1vUmVjT3JMUi5mYWlsdXJlRGVzY3JpcHRvciwgYXBwbGljYXRpb24pO1xuICB9XG4gIGlmIChzdGF0ZS5pc1RyYWNpbmcoKSkge1xuICAgIHN0YXRlLnRyYWNlLnB1c2gobWVtb1JlY09yTFIudHJhY2VFbnRyeSk7XG4gIH1cbiAgaWYgKG1lbW9SZWNPckxSLnZhbHVlKSB7XG4gICAgYmluZGluZ3MucHVzaChtZW1vUmVjT3JMUi52YWx1ZSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLl9ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBncmFtbWFyID0gc3RhdGUuZ3JhbW1hcjtcbiAgdmFyIGJpbmRpbmdzID0gc3RhdGUuYmluZGluZ3M7XG5cbiAgdmFyIGNhbGxlciA9IHN0YXRlLmN1cnJlbnRBcHBsaWNhdGlvbigpO1xuICB2YXIgYWN0dWFscyA9IGNhbGxlciA/IGNhbGxlci5wYXJhbXMgOiBbXTtcblxuICB2YXIgYXBwID0gdGhpcy5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpO1xuICB2YXIgcnVsZU5hbWUgPSBhcHAucnVsZU5hbWU7XG4gIHZhciBtZW1vS2V5ID0gYXBwLnRvTWVtb0tleSgpO1xuXG4gIGlmICh0aGlzICE9PSBzdGF0ZS5hcHBseVNwYWNlc18gJiYgKGNhbGxlciAmJiBjYWxsZXIuaXNTeW50YWN0aWMoKSB8fCBhcHAuaXNTeW50YWN0aWMoKSkpIHtcbiAgICBzdGF0ZS5za2lwU3BhY2VzKCk7XG4gIH1cblxuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIG9yaWdQb3NJbmZvID0gc3RhdGUuZ2V0Q3VycmVudFBvc0luZm8oKTtcblxuICB2YXIgbWVtb1JlYyA9IG9yaWdQb3NJbmZvLm1lbW9bbWVtb0tleV07XG4gIHZhciBjdXJyZW50TFI7XG4gIGlmIChtZW1vUmVjICYmIG9yaWdQb3NJbmZvLnNob3VsZFVzZU1lbW9pemVkUmVzdWx0KHRoaXMsIG1lbW9SZWMpKSB7XG4gICAgcmV0dXJuIHVzZU1lbW9pemVkUmVzdWx0KHN0YXRlLCB0aGlzLCBtZW1vUmVjKTtcbiAgfSBlbHNlIGlmIChvcmlnUG9zSW5mby5pc0FjdGl2ZShhcHApKSB7XG4gICAgY3VycmVudExSID0gb3JpZ1Bvc0luZm8uZ2V0Q3VycmVudExlZnRSZWN1cnNpb24oKTtcbiAgICBpZiAoY3VycmVudExSICYmIGN1cnJlbnRMUi5tZW1vS2V5ID09PSBtZW1vS2V5KSB7XG4gICAgICBvcmlnUG9zSW5mby51cGRhdGVJbnZvbHZlZEFwcGxpY2F0aW9ucygpO1xuICAgICAgcmV0dXJuIHVzZU1lbW9pemVkUmVzdWx0KHN0YXRlLCB0aGlzLCBjdXJyZW50TFIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcmlnUG9zSW5mby5zdGFydExlZnRSZWN1cnNpb24oYXBwKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJvZHkgPSBncmFtbWFyLnJ1bGVEaWN0W3J1bGVOYW1lXTtcbiAgICBvcmlnUG9zSW5mby5lbnRlcihhcHApO1xuICAgIGlmIChib2R5LmRlc2NyaXB0aW9uKSB7XG4gICAgICBzdGF0ZS5pZ25vcmVGYWlsdXJlcygpO1xuICAgIH1cbiAgICB2YXIgdmFsdWUgPSBhcHAuZXZhbE9uY2UoYm9keSwgc3RhdGUpO1xuICAgIGN1cnJlbnRMUiA9IG9yaWdQb3NJbmZvLmdldEN1cnJlbnRMZWZ0UmVjdXJzaW9uKCk7XG4gICAgaWYgKGN1cnJlbnRMUikge1xuICAgICAgaWYgKGN1cnJlbnRMUi5tZW1vS2V5ID09PSBtZW1vS2V5KSB7XG4gICAgICAgIHZhbHVlID0gYXBwLmhhbmRsZUxlZnRSZWN1cnNpb24oYm9keSwgc3RhdGUsIG9yaWdQb3MsIGN1cnJlbnRMUiwgdmFsdWUpO1xuICAgICAgICBvcmlnUG9zSW5mby5tZW1vW21lbW9LZXldID0ge1xuICAgICAgICAgIHBvczogaW5wdXRTdHJlYW0ucG9zLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICBpbnZvbHZlZEFwcGxpY2F0aW9uczogY3VycmVudExSLmludm9sdmVkQXBwbGljYXRpb25zXG4gICAgICAgIH07XG4gICAgICAgIG9yaWdQb3NJbmZvLmVuZExlZnRSZWN1cnNpb24oYXBwKTtcbiAgICAgIH0gZWxzZSBpZiAoIWN1cnJlbnRMUi5pbnZvbHZlZEFwcGxpY2F0aW9uc1ttZW1vS2V5XSkge1xuICAgICAgICAvLyBPbmx5IG1lbW9pemUgaWYgdGhpcyBhcHBsaWNhdGlvbiBpcyBub3QgaW52b2x2ZWQgaW4gdGhlIGN1cnJlbnQgbGVmdCByZWN1cnNpb25cbiAgICAgICAgb3JpZ1Bvc0luZm8ubWVtb1ttZW1vS2V5XSA9IHtwb3M6IGlucHV0U3RyZWFtLnBvcywgdmFsdWU6IHZhbHVlfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3JpZ1Bvc0luZm8ubWVtb1ttZW1vS2V5XSA9IHtwb3M6IGlucHV0U3RyZWFtLnBvcywgdmFsdWU6IHZhbHVlfTtcbiAgICB9XG4gICAgaWYgKGJvZHkuZGVzY3JpcHRpb24pIHtcbiAgICAgIHN0YXRlLnJlY29yZEZhaWx1cmVzKCk7XG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHN0YXRlLnJlY29yZEZhaWx1cmUob3JpZ1BvcywgYXBwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gUmVjb3JkIHRyYWNlIGluZm9ybWF0aW9uIGluIHRoZSBtZW1vIHRhYmxlLCBzbyB0aGF0IGl0IGlzXG4gICAgLy8gYXZhaWxhYmxlIGlmIHRoZSBtZW1vaXplZCByZXN1bHQgaXMgdXNlZCBsYXRlci5cbiAgICBpZiAoc3RhdGUuaXNUcmFjaW5nKCkgJiYgb3JpZ1Bvc0luZm8ubWVtb1ttZW1vS2V5XSkge1xuICAgICAgdmFyIGVudHJ5ID0gc3RhdGUuZ2V0VHJhY2VFbnRyeShvcmlnUG9zLCBhcHAsIHZhbHVlKTtcbiAgICAgIGVudHJ5LnNldExlZnRSZWN1cnNpdmUoY3VycmVudExSICYmIChjdXJyZW50TFIubWVtb0tleSA9PT0gbWVtb0tleSkpO1xuICAgICAgb3JpZ1Bvc0luZm8ubWVtb1ttZW1vS2V5XS50cmFjZUVudHJ5ID0gZW50cnk7XG4gICAgfVxuICAgIHZhciBhbnM7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBiaW5kaW5ncy5wdXNoKHZhbHVlKTtcbiAgICAgIGlmICghY2FsbGVyKSB7XG4gICAgICAgIGlmIChhcHAuaXNTeW50YWN0aWMoKSkge1xuICAgICAgICAgIHN0YXRlLnNraXBTcGFjZXMoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBPbmx5IHN1Y2NlZWQgaWYgdGhlIHRvcC1sZXZlbCBydWxlIGhhcyBjb25zdW1lZCBhbGwgb2YgdGhlIGlucHV0LlxuICAgICAgICAvLyAoVGhlIGZvbGxvd2luZyB3aWxsIGlnbm9yZSBzcGFjZXMgaWYgdGhlIHJ1bGUgaXMgc3ludGFjdGljLilcbiAgICAgICAgYW5zID0gcGV4cHJzLmVuZC5ldmFsKHN0YXRlKTtcbiAgICAgICAgYmluZGluZ3MucG9wKCk7ICAvLyBwb3AgdGhlIGJpbmRpbmcgdGhhdCB3YXMgYWRkZWQgYnkgYGVuZGAgaW4gdGhlIHN0YXRlbWVudCBhYm92ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYW5zID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYW5zID0gZmFsc2U7XG4gICAgfVxuXG4gICAgb3JpZ1Bvc0luZm8uZXhpdCgpO1xuICAgIHJldHVybiBhbnM7XG4gIH1cbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuZXZhbE9uY2UgPSBmdW5jdGlvbihleHByLCBzdGF0ZSkge1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIGlmIChleHByLmV2YWwoc3RhdGUpKSB7XG4gICAgdmFyIGFyaXR5ID0gZXhwci5nZXRBcml0eSgpO1xuICAgIHZhciBiaW5kaW5ncyA9IHN0YXRlLmJpbmRpbmdzLnNwbGljZShzdGF0ZS5iaW5kaW5ncy5sZW5ndGggLSBhcml0eSwgYXJpdHkpO1xuICAgIHZhciBhbnMgPSBuZXcgTm9kZShzdGF0ZS5ncmFtbWFyLCB0aGlzLnJ1bGVOYW1lLCBiaW5kaW5ncywgaW5wdXRTdHJlYW0uaW50ZXJ2YWwob3JpZ1BvcykpO1xuICAgIHJldHVybiBhbnM7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmhhbmRsZUxlZnRSZWN1cnNpb24gPSBmdW5jdGlvbihib2R5LCBzdGF0ZSwgb3JpZ1BvcywgY3VycmVudExSLCBzZWVkVmFsdWUpIHtcbiAgaWYgKCFzZWVkVmFsdWUpIHtcbiAgICByZXR1cm4gc2VlZFZhbHVlO1xuICB9XG5cbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciB2YWx1ZSA9IHNlZWRWYWx1ZTtcbiAgY3VycmVudExSLnZhbHVlID0gc2VlZFZhbHVlO1xuICBjdXJyZW50TFIucG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgaWYgKHN0YXRlLmlzVHJhY2luZygpKSB7XG4gICAgICBjdXJyZW50TFIudHJhY2VFbnRyeSA9IGNvbW1vbi5jbG9uZShzdGF0ZS50cmFjZVtzdGF0ZS50cmFjZS5sZW5ndGggLSAxXSk7XG4gICAgfVxuXG4gICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICB2YWx1ZSA9IHRoaXMuZXZhbE9uY2UoYm9keSwgc3RhdGUpO1xuICAgIGlmICh2YWx1ZSAmJiBpbnB1dFN0cmVhbS5wb3MgPiBjdXJyZW50TFIucG9zKSB7XG4gICAgICAvLyBUaGUgbGVmdC1yZWN1cnNpdmUgcmVzdWx0IHdhcyBleHBhbmRlZCAtLSBrZWVwIGxvb3BpbmcuXG4gICAgICBjdXJyZW50TFIudmFsdWUgPSB2YWx1ZTtcbiAgICAgIGN1cnJlbnRMUi5wb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZhaWxlZCB0byBleHBhbmQgdGhlIHJlc3VsdC5cbiAgICAgIGlucHV0U3RyZWFtLnBvcyA9IGN1cnJlbnRMUi5wb3M7XG4gICAgICBpZiAoc3RhdGUuaXNUcmFjaW5nKCkpIHtcbiAgICAgICAgc3RhdGUudHJhY2UucG9wKCk7ICAvLyBEcm9wIGxhc3QgdHJhY2UgZW50cnkgc2luY2UgYHZhbHVlYCB3YXMgdW51c2VkLlxuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBjdXJyZW50TFIudmFsdWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuZ2V0QXJpdHkgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnl0aGluZy5nZXRBcml0eSA9XG5wZXhwcnMuZW5kLmdldEFyaXR5ID1cbnBleHBycy5QcmltLnByb3RvdHlwZS5nZXRBcml0eSA9XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmdldEFyaXR5ID1cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuZ2V0QXJpdHkgPVxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gMTtcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24oKSB7XG4gIC8vIFRoaXMgaXMgb2sgYi9jIGFsbCB0ZXJtcyBtdXN0IGhhdmUgdGhlIHNhbWUgYXJpdHkgLS0gdGhpcyBwcm9wZXJ0eSBpc1xuICAvLyBjaGVja2VkIGJ5IHRoZSBHcmFtbWFyIGNvbnN0cnVjdG9yLlxuICByZXR1cm4gdGhpcy50ZXJtcy5sZW5ndGggPT09IDAgPyAwIDogdGhpcy50ZXJtc1swXS5nZXRBcml0eSgpO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGFyaXR5ID0gMDtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBhcml0eSArPSB0aGlzLmZhY3RvcnNbaWR4XS5nZXRBcml0eSgpO1xuICB9XG4gIHJldHVybiBhcml0eTtcbn07XG5cbnBleHBycy5JdGVyLnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5leHByLmdldEFyaXR5KCk7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gMDtcbn07XG5cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmdldEFyaXR5ID1cbnBleHBycy5MZXgucHJvdG90eXBlLmdldEFyaXR5ID1cbnBleHBycy5BcnIucHJvdG90eXBlLmdldEFyaXR5ID1cbnBleHBycy5TdHIucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuZ2V0QXJpdHkoKTtcbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBhcml0eSA9IHRoaXMuaXNMZW5pZW50ID8gMSA6IDA7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgYXJpdHkgKz0gdGhpcy5wcm9wZXJ0aWVzW2lkeF0ucGF0dGVybi5nZXRBcml0eSgpO1xuICB9XG4gIHJldHVybiBhcml0eTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gTk9URTogdGhlIGBpbnRyb2R1Y2VQYXJhbXNgIG1ldGhvZCBtb2RpZmllcyB0aGUgcmVjZWl2ZXIgaW4gcGxhY2UuXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID0gY29tbW9uLmFic3RyYWN0O1xuXG5wZXhwcnMuYW55dGhpbmcuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5lbmQuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5QcmltLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPSBmdW5jdGlvbihmb3JtYWxzKSB7XG4gIHJldHVybiB0aGlzO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID0gZnVuY3Rpb24oZm9ybWFscykge1xuICB0aGlzLnRlcm1zLmZvckVhY2goZnVuY3Rpb24odGVybSwgaWR4LCB0ZXJtcykge1xuICAgIHRlcm1zW2lkeF0gPSB0ZXJtLmludHJvZHVjZVBhcmFtcyhmb3JtYWxzKTtcbiAgfSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID0gZnVuY3Rpb24oZm9ybWFscykge1xuICB0aGlzLmZhY3RvcnMuZm9yRWFjaChmdW5jdGlvbihmYWN0b3IsIGlkeCwgZmFjdG9ycykge1xuICAgIGZhY3RvcnNbaWR4XSA9IGZhY3Rvci5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gIH0pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbnBleHBycy5JdGVyLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxucGV4cHJzLk5vdC5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG5wZXhwcnMuTGV4LnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxucGV4cHJzLkFyci5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5TdHIucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGZ1bmN0aW9uKGZvcm1hbHMpIHtcbiAgdGhpcy5leHByID0gdGhpcy5leHByLmludHJvZHVjZVBhcmFtcyhmb3JtYWxzKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPSBmdW5jdGlvbihmb3JtYWxzKSB7XG4gIHRoaXMucHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5LCBpZHgpIHtcbiAgICBwcm9wZXJ0eS5wYXR0ZXJuID0gcHJvcGVydHkucGF0dGVybi5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gIH0pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID0gZnVuY3Rpb24oZm9ybWFscykge1xuICB2YXIgaW5kZXggPSBmb3JtYWxzLmluZGV4T2YodGhpcy5ydWxlTmFtZSk7XG4gIGlmIChpbmRleCA+PSAwKSB7XG4gICAgaWYgKHRoaXMucGFyYW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRklYTUU6IHNob3VsZCBjYXRjaCB0aGlzIGVhcmxpZXInKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuUGFyYW0oaW5kZXgpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMucGFyYW1zLmZvckVhY2goZnVuY3Rpb24ocGFyYW0sIGlkeCwgcGFyYW1zKSB7XG4gICAgICBwYXJhbXNbaWR4XSA9IHBhcmFtLmludHJvZHVjZVBhcmFtcyhmb3JtYWxzKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGlzIHBhcnNpbmcgZXhwcmVzc2lvbiBtYXkgYWNjZXB0IHdpdGhvdXQgY29uc3VtaW5nIGFueSBpbnB1dC5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuaXNOdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgcmV0dXJuIHRoaXMuX2lzTnVsbGFibGUoZ3JhbW1hciwgT2JqZWN0LmNyZWF0ZShudWxsKSk7XG59O1xuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLl9pc051bGxhYmxlID0gY29tbW9uLmFic3RyYWN0O1xuXG5wZXhwcnMuYW55dGhpbmcuX2lzTnVsbGFibGUgPVxucGV4cHJzLlByaW0ucHJvdG90eXBlLl9pc051bGxhYmxlID1cbnBleHBycy5SYW5nZS5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG5wZXhwcnMuUGx1cy5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxucGV4cHJzLkFyci5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxucGV4cHJzLk9iai5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnBleHBycy5lbmQuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLlN0cmluZ1ByaW0ucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICAvLyBUaGlzIGlzIGFuIG92ZXItc2ltcGxpZmljYXRpb246IGl0J3Mgb25seSBjb3JyZWN0IGlmIHRoZSBpbnB1dCBpcyBhIHN0cmluZy4gSWYgaXQncyBhbiBhcnJheVxuICAvLyBvciBhbiBvYmplY3QsIHRoZW4gdGhlIGVtcHR5IHN0cmluZyBwYXJzaW5nIGV4cHJlc3Npb24gaXMgbm90IG51bGxhYmxlLlxuICByZXR1cm4gdGhpcy5vYmogPT09ICcnO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHJldHVybiB0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMCB8fFxuICAgICAgdGhpcy50ZXJtcy5zb21lKGZ1bmN0aW9uKHRlcm0pIHsgcmV0dXJuIHRlcm0uX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7IH0pO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHJldHVybiB0aGlzLmZhY3RvcnMuZXZlcnkoZnVuY3Rpb24oZmFjdG9yKSB7IHJldHVybiBmYWN0b3IuX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7IH0pO1xufTtcblxucGV4cHJzLlN0YXIucHJvdG90eXBlLl9pc051bGxhYmxlID1cbnBleHBycy5PcHQucHJvdG90eXBlLl9pc051bGxhYmxlID1cbnBleHBycy5Ob3QucHJvdG90eXBlLl9pc051bGxhYmxlID1cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnBleHBycy5MZXgucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICByZXR1cm4gdGhpcy5leHByLl9pc051bGxhYmxlKGdyYW1tYXIsIG1lbW8pO1xufTtcblxucGV4cHJzLlN0ci5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIC8vIFRoaXMgaXMgYWxzbyBhbiBvdmVyLXNpbXBsaWZpY2F0aW9uIHRoYXQgaXMgb25seSBjb3JyZWN0IHdoZW4gdGhlIGlucHV0IGlzIGEgc3RyaW5nLlxuICByZXR1cm4gdGhpcy5leHByLl9pc051bGxhYmxlKGdyYW1tYXIsIG1lbW8pO1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIG1lbW8pIHtcbiAgdmFyIGtleSA9IHRoaXMudG9NZW1vS2V5KCk7XG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1lbW8sIGtleSkpIHtcbiAgICB2YXIgYm9keSA9IGdyYW1tYXIucnVsZURpY3RbdGhpcy5ydWxlTmFtZV07XG4gICAgdmFyIGlubGluZWQgPSBib2R5LnN1YnN0aXR1dGVQYXJhbXModGhpcy5wYXJhbXMpO1xuICAgIG1lbW9ba2V5XSA9IGZhbHNlO1xuICAgIG1lbW9ba2V5XSA9IGlubGluZWQuX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7XG4gIH1cbiAgcmV0dXJuIG1lbW9ba2V5XTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnl0aGluZy5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscykge1xuICBzYi5hcHBlbmQoJ3RoaXMuYW55dGhpbmcoKScpO1xufTtcblxucGV4cHJzLmVuZC5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscykge1xuICBzYi5hcHBlbmQoJ3RoaXMuZW5kKCknKTtcbn07XG5cbnBleHBycy5QcmltLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscykge1xuICBzYi5hcHBlbmQoJ3RoaXMucHJpbSgnKTtcbiAgc2IuYXBwZW5kKHR5cGVvZiB0aGlzLm9iaiA9PT0gJ3N0cmluZycgPyBKU09OLnN0cmluZ2lmeSh0aGlzLm9iaikgOiAnJyArIHRoaXMub2JqKTtcbiAgc2IuYXBwZW5kKCcpJyk7XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiLCBmb3JtYWxzKSB7XG4gIHNiLmFwcGVuZCgndGhpcy5yYW5nZSgnKTtcbiAgc2IuYXBwZW5kKEpTT04uc3RyaW5naWZ5KHRoaXMuZnJvbSkpO1xuICBzYi5hcHBlbmQoJywgJyk7XG4gIHNiLmFwcGVuZChKU09OLnN0cmluZ2lmeSh0aGlzLnRvKSk7XG4gIHNiLmFwcGVuZCgnKScpO1xufTtcblxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscykge1xuICBzYi5hcHBlbmQoJ3RoaXMucGFyYW0oJyArIHRoaXMuaW5kZXggKyAnKScpO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IsIGZvcm1hbHMpIHtcbiAgc2IuYXBwZW5kKCd0aGlzLmFsdCgnKTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKGlkeCA+IDApIHtcbiAgICAgIHNiLmFwcGVuZCgnLCAnKTtcbiAgICB9XG4gICAgdGhpcy50ZXJtc1tpZHhdLm91dHB1dFJlY2lwZShzYiwgZm9ybWFscyk7XG4gIH1cbiAgc2IuYXBwZW5kKCcpJyk7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscykge1xuICBzYi5hcHBlbmQoJ3RoaXMuc2VxKCcpO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChpZHggPiAwKSB7XG4gICAgICBzYi5hcHBlbmQoJywgJyk7XG4gICAgfVxuICAgIHRoaXMuZmFjdG9yc1tpZHhdLm91dHB1dFJlY2lwZShzYiwgZm9ybWFscyk7XG4gIH1cbiAgc2IuYXBwZW5kKCcpJyk7XG59O1xuXG5wZXhwcnMuU3Rhci5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IsIGZvcm1hbHMpIHtcbiAgc2IuYXBwZW5kKCd0aGlzLnN0YXIoJyk7XG4gIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUoc2IsIGZvcm1hbHMpO1xuICBzYi5hcHBlbmQoJyknKTtcbn07XG5cbnBleHBycy5QbHVzLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscykge1xuICBzYi5hcHBlbmQoJ3RoaXMucGx1cygnKTtcbiAgdGhpcy5leHByLm91dHB1dFJlY2lwZShzYiwgZm9ybWFscyk7XG4gIHNiLmFwcGVuZCgnKScpO1xufTtcblxucGV4cHJzLk9wdC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IsIGZvcm1hbHMpIHtcbiAgc2IuYXBwZW5kKCd0aGlzLm9wdCgnKTtcbiAgdGhpcy5leHByLm91dHB1dFJlY2lwZShzYiwgZm9ybWFscyk7XG4gIHNiLmFwcGVuZCgnKScpO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IsIGZvcm1hbHMpIHtcbiAgc2IuYXBwZW5kKCd0aGlzLm5vdCgnKTtcbiAgdGhpcy5leHByLm91dHB1dFJlY2lwZShzYiwgZm9ybWFscyk7XG4gIHNiLmFwcGVuZCgnKScpO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IsIGZvcm1hbHMpIHtcbiAgc2IuYXBwZW5kKCd0aGlzLmxhKCcpO1xuICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHNiLCBmb3JtYWxzKTtcbiAgc2IuYXBwZW5kKCcpJyk7XG59O1xuXG5wZXhwcnMuTGV4LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscykge1xuICBzYi5hcHBlbmQoJ3RoaXMubGV4KCcpO1xuICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHNiLCBmb3JtYWxzKTtcbiAgc2IuYXBwZW5kKCcpJyk7XG59O1xuXG5wZXhwcnMuQXJyLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscykge1xuICBzYi5hcHBlbmQoJ3RoaXMuYXJyKCcpO1xuICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHNiLCBmb3JtYWxzKTtcbiAgc2IuYXBwZW5kKCcpJyk7XG59O1xuXG5wZXhwcnMuU3RyLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscykge1xuICBzYi5hcHBlbmQoJ3RoaXMuc3RyKCcpO1xuICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHNiLCBmb3JtYWxzKTtcbiAgc2IuYXBwZW5kKCcpJyk7XG59O1xuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscykge1xuICBmdW5jdGlvbiBvdXRwdXRQcm9wZXJ0eVJlY2lwZShwcm9wKSB7XG4gICAgc2IuYXBwZW5kKCd7bmFtZTogJyk7XG4gICAgc2IuYXBwZW5kKEpTT04uc3RyaW5naWZ5KHByb3AubmFtZSkpO1xuICAgIHNiLmFwcGVuZCgnLCBwYXR0ZXJuOiAnKTtcbiAgICBwcm9wLnBhdHRlcm4ub3V0cHV0UmVjaXBlKHNiLCBmb3JtYWxzKTtcbiAgICBzYi5hcHBlbmQoJ30nKTtcbiAgfVxuXG4gIHNiLmFwcGVuZCgndGhpcy5vYmooWycpO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChpZHggPiAwKSB7XG4gICAgICBzYi5hcHBlbmQoJywgJyk7XG4gICAgfVxuICAgIG91dHB1dFByb3BlcnR5UmVjaXBlKHRoaXMucHJvcGVydGllc1tpZHhdKTtcbiAgfVxuICBzYi5hcHBlbmQoJ10sICcpO1xuICBzYi5hcHBlbmQoISF0aGlzLmlzTGVuaWVudCk7XG4gIHNiLmFwcGVuZCgnKScpO1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscykge1xuICBzYi5hcHBlbmQoJ3RoaXMuYXBwKCcpO1xuICBzYi5hcHBlbmQoSlNPTi5zdHJpbmdpZnkodGhpcy5ydWxlTmFtZSkpO1xuICBpZiAodGhpcy5ydWxlTmFtZS5pbmRleE9mKCdfJykgPj0gMCAmJiBmb3JtYWxzLmxlbmd0aCA+IDApIHtcbiAgICB2YXIgYXBwcyA9IGZvcm1hbHMuXG4gICAgICAgIG1hcChmdW5jdGlvbihmb3JtYWwpIHsgcmV0dXJuICd0aGlzLmFwcCgnICsgSlNPTi5zdHJpbmdpZnkoZm9ybWFsKSArICcpJzsgfSk7XG4gICAgc2IuYXBwZW5kKCcsIFsnICsgYXBwcy5qb2luKCcsICcpICsgJ10nKTtcbiAgfSBlbHNlIGlmICh0aGlzLnBhcmFtcy5sZW5ndGggPiAwKSB7XG4gICAgc2IuYXBwZW5kKCcsIFsnKTtcbiAgICB0aGlzLnBhcmFtcy5mb3JFYWNoKGZ1bmN0aW9uKHBhcmFtLCBpZHgpIHtcbiAgICAgIGlmIChpZHggPiAwKSB7XG4gICAgICAgIHNiLmFwcGVuZCgnLCAnKTtcbiAgICAgIH1cbiAgICAgIHBhcmFtLm91dHB1dFJlY2lwZShzYiwgZm9ybWFscyk7XG4gICAgfSk7XG4gICAgc2IuYXBwZW5kKCddJyk7XG4gIH1cbiAgc2IuYXBwZW5kKCcpJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGNvbW1vbi5hYnN0cmFjdDtcblxucGV4cHJzLmFueXRoaW5nLnN1YnN0aXR1dGVQYXJhbXMgPVxucGV4cHJzLmVuZC5zdWJzdGl0dXRlUGFyYW1zID1cbnBleHBycy5QcmltLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID1cbnBleHBycy5SYW5nZS5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG5wZXhwcnMuUHJpbS5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uKGFjdHVhbHMpIHtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbihhY3R1YWxzKSB7XG4gIHJldHVybiBhY3R1YWxzW3RoaXMuaW5kZXhdO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uKGFjdHVhbHMpIHtcbiAgcmV0dXJuIG5ldyBwZXhwcnMuQWx0KFxuICAgICAgdGhpcy50ZXJtcy5tYXAoZnVuY3Rpb24odGVybSkgeyByZXR1cm4gdGVybS5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpOyB9KSk7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID0gZnVuY3Rpb24oYWN0dWFscykge1xuICByZXR1cm4gbmV3IHBleHBycy5TZXEoXG4gICAgICB0aGlzLmZhY3RvcnMubWFwKGZ1bmN0aW9uKGZhY3RvcikgeyByZXR1cm4gZmFjdG9yLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscyk7IH0pKTtcbn07XG5cbnBleHBycy5JdGVyLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID1cbnBleHBycy5Ob3QucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG5wZXhwcnMuTGV4LnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID1cbnBleHBycy5BcnIucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxucGV4cHJzLlN0ci5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uKGFjdHVhbHMpIHtcbiAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMuZXhwci5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpKTtcbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbihhY3R1YWxzKSB7XG4gIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5wcm9wZXJ0aWVzLm1hcChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBwcm9wZXJ0eS5uYW1lLFxuICAgICAgcGF0dGVybjogcHJvcGVydHkucGF0dGVybi5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpXG4gICAgfTtcbiAgfSk7XG4gIHJldHVybiBuZXcgcGV4cHJzLk9iaihwcm9wZXJ0aWVzLCB0aGlzLmlzTGVuaWVudCk7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbihhY3R1YWxzKSB7XG4gIGlmICh0aGlzLnBhcmFtcy5sZW5ndGggPT09IDApIHtcbiAgICAvLyBBdm9pZCBtYWtpbmcgYSBjb3B5IG9mIHRoaXMgYXBwbGljYXRpb24sIGFzIGFuIG9wdGltaXphdGlvblxuICAgIHJldHVybiB0aGlzO1xuICB9IGVsc2Uge1xuICAgIHZhciBwYXJhbXMgPSB0aGlzLnBhcmFtcy5tYXAoZnVuY3Rpb24ocGFyYW0pIHsgcmV0dXJuIHBhcmFtLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscyk7IH0pO1xuICAgIHJldHVybiBuZXcgcGV4cHJzLkFwcGx5KHRoaXMucnVsZU5hbWUsIHBhcmFtcyk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIFBFeHByLCBmb3IgdXNlIGFzIGEgVUkgbGFiZWwsIGV0Yy5cbnBleHBycy5QRXhwci5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gY29tbW9uLmFic3RyYWN0O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPVxucGV4cHJzLlNlcS5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbnBleHBycy5JdGVyLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPVxucGV4cHJzLk5vdC5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9XG5wZXhwcnMuTGV4LnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPVxucGV4cHJzLkFyci5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbnBleHBycy5TdHIucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9XG5wZXhwcnMuT2JqLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuaW50ZXJ2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5pbnRlcnZhbC50cmltbWVkKCkuY29udGVudHM7XG4gIH1cbiAgcmV0dXJuICdbJyArIHRoaXMuY29uc3RydWN0b3IubmFtZSArICddJztcbn07XG5cbnBleHBycy5hbnl0aGluZy50b0Rpc3BsYXlTdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdfJztcbn07XG5cbnBleHBycy5lbmQudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnZW5kJztcbn07XG5cbnBleHBycy5QcmltLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFN0cmluZyh0aGlzLm9iaik7XG59O1xuXG5wZXhwcnMuU3RyaW5nUHJpbS5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnXCInICsgdGhpcy5vYmogKyAnXCInO1xufTtcblxucGV4cHJzLlJhbmdlLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuZnJvbSkgKyAnLi4nICsgSlNPTi5zdHJpbmdpZnkodGhpcy50byk7XG59O1xuXG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJyMnICsgdGhpcy5pbmRleDtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnJ1bGVOYW1lO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLnRvRXhwZWN0ZWQgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnl0aGluZy50b0V4cGVjdGVkID0gZnVuY3Rpb24ocnVsZURpY3QpIHtcbiAgcmV0dXJuICdhbnkgb2JqZWN0Jztcbn07XG5cbnBleHBycy5lbmQudG9FeHBlY3RlZCA9IGZ1bmN0aW9uKHJ1bGVEaWN0KSB7XG4gIHJldHVybiAnZW5kIG9mIGlucHV0Jztcbn07XG5cbnBleHBycy5QcmltLnByb3RvdHlwZS50b0V4cGVjdGVkID0gZnVuY3Rpb24ocnVsZURpY3QpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMub2JqKTtcbn07XG5cbnBleHBycy5SYW5nZS5wcm90b3R5cGUudG9FeHBlY3RlZCA9IGZ1bmN0aW9uKHJ1bGVEaWN0KSB7XG4gIC8vIFRPRE86IGNvbWUgdXAgd2l0aCBzb21ldGhpbmcgYmV0dGVyXG4gIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmZyb20pICsgJy4uJyArIEpTT04uc3RyaW5naWZ5KHRoaXMudG8pO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUudG9FeHBlY3RlZCA9IGZ1bmN0aW9uKHJ1bGVEaWN0KSB7XG4gIGlmICh0aGlzLmV4cHIgPT09IHBleHBycy5hbnl0aGluZykge1xuICAgIHJldHVybiAnbm90aGluZyc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICdub3QgJyArIHRoaXMuZXhwci50b0V4cGVjdGVkKHJ1bGVEaWN0KTtcbiAgfVxufTtcblxuLy8gVE9ETzogdGhpbmsgYWJvdXQgQXJyLCBTdHIsIGFuZCBPYmpcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS50b0V4cGVjdGVkID0gZnVuY3Rpb24ocnVsZURpY3QpIHtcbiAgdmFyIGRlc2NyaXB0aW9uID0gcnVsZURpY3RbdGhpcy5ydWxlTmFtZV0uZGVzY3JpcHRpb247XG4gIGlmIChkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiBkZXNjcmlwdGlvbjtcbiAgfSBlbHNlIHtcbiAgICB2YXIgYXJ0aWNsZSA9ICgvXlthZWlvdUFFSU9VXS8udGVzdCh0aGlzLnJ1bGVOYW1lKSA/ICdhbicgOiAnYScpO1xuICAgIHJldHVybiBhcnRpY2xlICsgJyAnICsgdGhpcy5ydWxlTmFtZTtcbiAgfVxufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qXG4gIGUxLnRvU3RyaW5nKCkgPT09IGUyLnRvU3RyaW5nKCkgPT0+IGUxIGFuZCBlMiBhcmUgc2VtYW50aWNhbGx5IGVxdWl2YWxlbnQuXG4gIE5vdGUgdGhhdCB0aGlzIGlzIG5vdCBhbiBpZmYgKDw9PT4pOiBlLmcuLFxuICAoflwiYlwiIFwiYVwiKS50b1N0cmluZygpICE9PSAoXCJhXCIpLnRvU3RyaW5nKCksIGV2ZW4gdGhvdWdoXG4gIH5cImJcIiBcImFcIiBhbmQgXCJhXCIgYXJlIGludGVyY2hhbmdlYWJsZSBpbiBhbnkgZ3JhbW1hcixcbiAgYm90aCBpbiB0ZXJtcyBvZiB0aGUgbGFuZ3VhZ2VzIHRoZXkgYWNjZXB0IGFuZCB0aGVpciBhcml0aWVzLlxuKi9cbnBleHBycy5QRXhwci5wcm90b3R5cGUudG9TdHJpbmcgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnl0aGluZy50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ18nO1xufTtcblxucGV4cHJzLmVuZC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ2VuZCc7XG59O1xuXG5wZXhwcnMuUHJpbS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMub2JqKTtcbn07XG5cbnBleHBycy5SYW5nZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuZnJvbSkgKyAnLi4nICsgSlNPTi5zdHJpbmdpZnkodGhpcy50byk7XG59O1xuXG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnJCcgKyB0aGlzLmluZGV4O1xufTtcblxucGV4cHJzLkxleC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICcjKCcgKyB0aGlzLmV4cHIudG9TdHJpbmcoKSArICcpJztcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMSA/XG4gICAgdGhpcy50ZXJtc1swXS50b1N0cmluZygpIDpcbiAgICAnKCcgKyB0aGlzLnRlcm1zLm1hcChmdW5jdGlvbih0ZXJtKSB7IHJldHVybiB0ZXJtLnRvU3RyaW5nKCk7IH0pLmpvaW4oJyB8ICcpICsgJyknO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZmFjdG9ycy5sZW5ndGggPT09IDEgP1xuICAgIHRoaXMuZmFjdG9yc1swXS50b1N0cmluZygpIDpcbiAgICAnKCcgKyB0aGlzLmZhY3RvcnMubWFwKGZ1bmN0aW9uKGZhY3RvcikgeyByZXR1cm4gZmFjdG9yLnRvU3RyaW5nKCk7IH0pLmpvaW4oJyAnKSArICcpJztcbn07XG5cbnBleHBycy5JdGVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5leHByICsgdGhpcy5vcGVyYXRvcjtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnficgKyB0aGlzLmV4cHI7XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJyYnICsgdGhpcy5leHByO1xufTtcblxucGV4cHJzLkFyci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdbJyArIHRoaXMuZXhwci50b1N0cmluZygpICsgJ10nO1xufTtcblxucGV4cHJzLlN0ci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdgYCcgKyB0aGlzLmV4cHIudG9TdHJpbmcoKSArIFwiJydcIjtcbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXJ0cyA9IFsneyddO1xuXG4gIHZhciBmaXJzdCA9IHRydWU7XG4gIGZ1bmN0aW9uIGVtaXQocGFydCkge1xuICAgIGlmIChmaXJzdCkge1xuICAgICAgZmlyc3QgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFydHMucHVzaCgnLCAnKTtcbiAgICB9XG4gICAgcGFydHMucHVzaChwYXJ0KTtcbiAgfVxuXG4gIHRoaXMucHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgZW1pdChKU09OLnN0cmluZ2lmeShwcm9wZXJ0eS5uYW1lKSArICc6ICcgKyBwcm9wZXJ0eS5wYXR0ZXJuLnRvU3RyaW5nKCkpO1xuICB9KTtcbiAgaWYgKHRoaXMuaXNMZW5pZW50KSB7XG4gICAgZW1pdCgnLi4uJyk7XG4gIH1cblxuICBwYXJ0cy5wdXNoKCd9Jyk7XG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMucGFyYW1zLmxlbmd0aCA+IDApIHtcbiAgICB2YXIgcHMgPSB0aGlzLnBhcmFtcy5tYXAoZnVuY3Rpb24ocGFyYW0pIHsgcmV0dXJuIHBhcmFtLnRvU3RyaW5nKCk7IH0pO1xuICAgIHJldHVybiB0aGlzLnJ1bGVOYW1lICsgJzwnICsgcHMuam9pbignLCcpICsgJz4nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLnJ1bGVOYW1lO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBHZW5lcmFsIHN0dWZmXG5cbmZ1bmN0aW9uIFBFeHByKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoXCJQRXhwciBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0J3MgYWJzdHJhY3RcIik7XG59XG5cblBFeHByLnByb3RvdHlwZS53aXRoRGVzY3JpcHRpb24gPSBmdW5jdGlvbihkZXNjcmlwdGlvbikge1xuICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gIHJldHVybiB0aGlzO1xufTtcblxuUEV4cHIucHJvdG90eXBlLndpdGhJbnRlcnZhbCA9IGZ1bmN0aW9uKGludGVydmFsKSB7XG4gIHRoaXMuaW50ZXJ2YWwgPSBpbnRlcnZhbC50cmltbWVkKCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuUEV4cHIucHJvdG90eXBlLndpdGhGb3JtYWxzID0gZnVuY3Rpb24oZm9ybWFscykge1xuICB0aGlzLmZvcm1hbHMgPSBmb3JtYWxzO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIEFueXRoaW5nXG5cbnZhciBhbnl0aGluZyA9IE9iamVjdC5jcmVhdGUoUEV4cHIucHJvdG90eXBlKTtcblxuLy8gRW5kXG5cbnZhciBlbmQgPSBPYmplY3QuY3JlYXRlKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIFByaW1pdGl2ZXNcblxuZnVuY3Rpb24gUHJpbShvYmopIHtcbiAgdGhpcy5vYmogPSBvYmo7XG59XG5pbmhlcml0cyhQcmltLCBQRXhwcik7XG5cbmZ1bmN0aW9uIFN0cmluZ1ByaW0ob2JqKSB7XG4gIHRoaXMub2JqID0gb2JqO1xufVxuaW5oZXJpdHMoU3RyaW5nUHJpbSwgUHJpbSk7XG5cbi8vIFJhbmdlc1xuXG5mdW5jdGlvbiBSYW5nZShmcm9tLCB0bykge1xuICB0aGlzLmZyb20gPSBmcm9tO1xuICB0aGlzLnRvID0gdG87XG59XG5pbmhlcml0cyhSYW5nZSwgUEV4cHIpO1xuXG4vLyBQYXJhbWV0ZXJzXG5cbmZ1bmN0aW9uIFBhcmFtKGluZGV4KSB7XG4gIHRoaXMuaW5kZXggPSBpbmRleDtcbn1cbmluaGVyaXRzKFBhcmFtLCBQRXhwcik7XG5cbi8vIEFsdGVybmF0aW9uXG5cbmZ1bmN0aW9uIEFsdCh0ZXJtcykge1xuICB0aGlzLnRlcm1zID0gdGVybXM7XG59XG5pbmhlcml0cyhBbHQsIFBFeHByKTtcblxuLy8gRXh0ZW5kIGlzIGFuIGltcGxlbWVudGF0aW9uIGRldGFpbCBvZiBydWxlIGV4dGVuc2lvblxuXG5mdW5jdGlvbiBFeHRlbmQoc3VwZXJHcmFtbWFyLCBuYW1lLCBib2R5KSB7XG4gIHZhciBvcmlnQm9keSA9IHN1cGVyR3JhbW1hci5ydWxlRGljdFtuYW1lXTtcbiAgdGhpcy50ZXJtcyA9IFtib2R5LCBvcmlnQm9keV07XG59XG5pbmhlcml0cyhFeHRlbmQsIEFsdCk7XG5cbi8vIFNlcXVlbmNlc1xuXG5mdW5jdGlvbiBTZXEoZmFjdG9ycykge1xuICB0aGlzLmZhY3RvcnMgPSBmYWN0b3JzO1xufVxuaW5oZXJpdHMoU2VxLCBQRXhwcik7XG5cbi8vIEl0ZXJhdG9ycyBhbmQgb3B0aW9uYWxzXG5cbmZ1bmN0aW9uIEl0ZXIoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoSXRlciwgUEV4cHIpO1xuXG5mdW5jdGlvbiBTdGFyKGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwcjtcbn1cbmluaGVyaXRzKFN0YXIsIEl0ZXIpO1xuXG5mdW5jdGlvbiBQbHVzKGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwcjtcbn1cbmluaGVyaXRzKFBsdXMsIEl0ZXIpO1xuXG5mdW5jdGlvbiBPcHQoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoT3B0LCBJdGVyKTtcblxuU3Rhci5wcm90b3R5cGUub3BlcmF0b3IgPSAnKic7XG5QbHVzLnByb3RvdHlwZS5vcGVyYXRvciA9ICcrJztcbk9wdC5wcm90b3R5cGUub3BlcmF0b3IgPSAnPyc7XG5cblN0YXIucHJvdG90eXBlLm1pbk51bU1hdGNoZXMgPSAwO1xuUGx1cy5wcm90b3R5cGUubWluTnVtTWF0Y2hlcyA9IDE7XG5PcHQucHJvdG90eXBlLm1pbk51bU1hdGNoZXMgPSAwO1xuXG5TdGFyLnByb3RvdHlwZS5tYXhOdW1NYXRjaGVzID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuUGx1cy5wcm90b3R5cGUubWF4TnVtTWF0Y2hlcyA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbk9wdC5wcm90b3R5cGUubWF4TnVtTWF0Y2hlcyA9IDE7XG5cbi8vIFByZWRpY2F0ZXNcblxuZnVuY3Rpb24gTm90KGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwcjtcbn1cbmluaGVyaXRzKE5vdCwgUEV4cHIpO1xuXG5mdW5jdGlvbiBMb29rYWhlYWQoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoTG9va2FoZWFkLCBQRXhwcik7XG5cbi8vIFwiTGV4aWZpY2F0aW9uXCJcblxuZnVuY3Rpb24gTGV4KGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwcjtcbn1cbmluaGVyaXRzKExleCwgUEV4cHIpO1xuXG4vLyBBcnJheSBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIEFycihleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhBcnIsIFBFeHByKTtcblxuLy8gU3RyaW5nIGRlY29tcG9zaXRpb25cblxuZnVuY3Rpb24gU3RyKGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwcjtcbn1cbmluaGVyaXRzKFN0ciwgUEV4cHIpO1xuXG4vLyBPYmplY3QgZGVjb21wb3NpdGlvblxuXG5mdW5jdGlvbiBPYmoocHJvcGVydGllcywgaXNMZW5pZW50KSB7XG4gIHZhciBuYW1lcyA9IHByb3BlcnRpZXMubWFwKGZ1bmN0aW9uKHByb3BlcnR5KSB7IHJldHVybiBwcm9wZXJ0eS5uYW1lOyB9KTtcbiAgdmFyIGR1cGxpY2F0ZXMgPSBjb21tb24uZ2V0RHVwbGljYXRlcyhuYW1lcyk7XG4gIGlmIChkdXBsaWNhdGVzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkR1cGxpY2F0ZVByb3BlcnR5TmFtZXMoZHVwbGljYXRlcyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcbiAgICB0aGlzLmlzTGVuaWVudCA9IGlzTGVuaWVudDtcbiAgfVxufVxuaW5oZXJpdHMoT2JqLCBQRXhwcik7XG5cbi8vIFJ1bGUgYXBwbGljYXRpb25cblxuZnVuY3Rpb24gQXBwbHkocnVsZU5hbWUsIG9wdFBhcmFtcykge1xuICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWU7XG4gIHRoaXMucGFyYW1zID0gb3B0UGFyYW1zIHx8IFtdO1xuICB0aGlzLmxleGlmeUNvdW50ID0gMDtcbn1cbmluaGVyaXRzKEFwcGx5LCBQRXhwcik7XG5cbkFwcGx5LnByb3RvdHlwZS5sZXhpZnkgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5sZXhpZnlDb3VudCsrO1xufTtcblxuQXBwbHkucHJvdG90eXBlLnVubGV4aWZ5ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMubGV4aWZ5Q291bnQtLTtcbn07XG5cbkFwcGx5LnByb3RvdHlwZS5pc1N5bnRhY3RpYyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5sZXhpZnlDb3VudCA9PT0gMCAmJiBjb21tb24uaXNTeW50YWN0aWModGhpcy5ydWxlTmFtZSk7XG59O1xuXG4vLyBUaGlzIG1ldGhvZCBqdXN0IGNhY2hlcyB0aGUgcmVzdWx0IG9mIGB0aGlzLnRvU3RyaW5nKClgIGluIGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHkuXG5BcHBseS5wcm90b3R5cGUudG9NZW1vS2V5ID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5fbWVtb0tleSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX21lbW9LZXknLCB7dmFsdWU6IHRoaXMudG9TdHJpbmcoKX0pO1xuICB9XG4gIHJldHVybiB0aGlzLl9tZW1vS2V5O1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMubWFrZVByaW0gPSBmdW5jdGlvbihvYmopIHtcbiAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnICYmIG9iai5sZW5ndGggIT09IDEpIHtcbiAgICByZXR1cm4gbmV3IFN0cmluZ1ByaW0ob2JqKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFByaW0ob2JqKTtcbiAgfVxufTtcblxuZXhwb3J0cy5QRXhwciA9IFBFeHByO1xuZXhwb3J0cy5hbnl0aGluZyA9IGFueXRoaW5nO1xuZXhwb3J0cy5lbmQgPSBlbmQ7XG5leHBvcnRzLlByaW0gPSBQcmltO1xuZXhwb3J0cy5TdHJpbmdQcmltID0gU3RyaW5nUHJpbTtcbmV4cG9ydHMuUmFuZ2UgPSBSYW5nZTtcbmV4cG9ydHMuUGFyYW0gPSBQYXJhbTtcbmV4cG9ydHMuQWx0ID0gQWx0O1xuZXhwb3J0cy5FeHRlbmQgPSBFeHRlbmQ7XG5leHBvcnRzLlNlcSA9IFNlcTtcbmV4cG9ydHMuSXRlciA9IEl0ZXI7XG5leHBvcnRzLlN0YXIgPSBTdGFyO1xuZXhwb3J0cy5QbHVzID0gUGx1cztcbmV4cG9ydHMuT3B0ID0gT3B0O1xuZXhwb3J0cy5Ob3QgPSBOb3Q7XG5leHBvcnRzLkxvb2thaGVhZCA9IExvb2thaGVhZDtcbmV4cG9ydHMuTGV4ID0gTGV4O1xuZXhwb3J0cy5BcnIgPSBBcnI7XG5leHBvcnRzLlN0ciA9IFN0cjtcbmV4cG9ydHMuT2JqID0gT2JqO1xuZXhwb3J0cy5BcHBseSA9IEFwcGx5O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXh0ZW5zaW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucmVxdWlyZSgnLi9wZXhwcnMtYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5Jyk7XG5yZXF1aXJlKCcuL3BleHBycy1hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWNoZWNrJyk7XG5yZXF1aXJlKCcuL3BleHBycy1ldmFsJyk7XG5yZXF1aXJlKCcuL3BleHBycy1nZXRBcml0eScpO1xucmVxdWlyZSgnLi9wZXhwcnMtb3V0cHV0UmVjaXBlJyk7XG5yZXF1aXJlKCcuL3BleHBycy1pbnRyb2R1Y2VQYXJhbXMnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWlzTnVsbGFibGUnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXN1YnN0aXR1dGVQYXJhbXMnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXRvRGlzcGxheVN0cmluZycpO1xucmVxdWlyZSgnLi9wZXhwcnMtdG9FeHBlY3RlZCcpO1xucmVxdWlyZSgnLi9wZXhwcnMtdG9TdHJpbmcnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gR2l2ZW4gYW4gYXJyYXkgb2YgbnVtYmVycyBgYXJyYCwgcmV0dXJuIGFuIGFycmF5IG9mIHRoZSBudW1iZXJzIGFzIHN0cmluZ3MsXG4vLyByaWdodC1qdXN0aWZpZWQgYW5kIHBhZGRlZCB0byB0aGUgc2FtZSBsZW5ndGguXG5mdW5jdGlvbiBwYWROdW1iZXJzVG9FcXVhbExlbmd0aChhcnIpIHtcbiAgdmFyIG1heExlbiA9IDA7XG4gIHZhciBzdHJpbmdzID0gYXJyLm1hcChmdW5jdGlvbihuKSB7XG4gICAgdmFyIHN0ciA9IG4udG9TdHJpbmcoKTtcbiAgICBtYXhMZW4gPSBNYXRoLm1heChtYXhMZW4sIHN0ci5sZW5ndGgpO1xuICAgIHJldHVybiBzdHI7XG4gIH0pO1xuICByZXR1cm4gc3RyaW5ncy5tYXAoZnVuY3Rpb24ocykgeyByZXR1cm4gY29tbW9uLnBhZExlZnQocywgbWF4TGVuKTsgfSk7XG59XG5cbi8vIFByb2R1Y2UgYSBuZXcgc3RyaW5nIHRoYXQgd291bGQgYmUgdGhlIHJlc3VsdCBvZiBjb3B5aW5nIHRoZSBjb250ZW50c1xuLy8gb2YgdGhlIHN0cmluZyBgc3JjYCBvbnRvIGBkZXN0YCBhdCBvZmZzZXQgYG9mZmVzdGAuXG5mdW5jdGlvbiBzdHJjcHkoZGVzdCwgc3JjLCBvZmZzZXQpIHtcbiAgdmFyIG9yaWdEZXN0TGVuID0gZGVzdC5sZW5ndGg7XG4gIHZhciBzdGFydCA9IGRlc3Quc2xpY2UoMCwgb2Zmc2V0KTtcbiAgdmFyIGVuZCA9IGRlc3Quc2xpY2Uob2Zmc2V0ICsgc3JjLmxlbmd0aCk7XG4gIHJldHVybiAoc3RhcnQgKyBzcmMgKyBlbmQpLnN1YnN0cigwLCBvcmlnRGVzdExlbik7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBSZXR1cm4gYW4gb2JqZWN0IHdpdGggdGhlIGxpbmUgYW5kIGNvbHVtbiBpbmZvcm1hdGlvbiBmb3IgdGhlIGdpdmVuXG4vLyBvZmZzZXQgaW4gYHN0cmAuXG5leHBvcnRzLmdldExpbmVBbmRDb2x1bW4gPSBmdW5jdGlvbihzdHIsIG9mZnNldCkge1xuICB2YXIgbGluZU51bSA9IDE7XG4gIHZhciBjb2xOdW0gPSAxO1xuXG4gIHZhciBjdXJyT2Zmc2V0ID0gMDtcbiAgdmFyIGxpbmVTdGFydE9mZnNldCA9IDA7XG5cbiAgdmFyIG5leHRMaW5lID0gbnVsbDtcbiAgdmFyIHByZXZMaW5lID0gbnVsbDtcbiAgdmFyIHByZXZMaW5lU3RhcnRPZmZzZXQgPSAtMTtcblxuICB3aGlsZSAoY3Vyck9mZnNldCA8IG9mZnNldCkge1xuICAgIHZhciBjID0gc3RyLmNoYXJBdChjdXJyT2Zmc2V0KyspO1xuICAgIGlmIChjID09PSAnXFxuJykge1xuICAgICAgbGluZU51bSsrO1xuICAgICAgY29sTnVtID0gMTtcbiAgICAgIHByZXZMaW5lU3RhcnRPZmZzZXQgPSBsaW5lU3RhcnRPZmZzZXQ7XG4gICAgICBsaW5lU3RhcnRPZmZzZXQgPSBjdXJyT2Zmc2V0O1xuICAgIH0gZWxzZSBpZiAoYyAhPT0gJ1xccicpIHtcbiAgICAgIGNvbE51bSsrO1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmQgdGhlIGVuZCBvZiB0aGUgdGFyZ2V0IGxpbmUuXG4gIHZhciBsaW5lRW5kT2Zmc2V0ID0gc3RyLmluZGV4T2YoJ1xcbicsIGxpbmVTdGFydE9mZnNldCk7XG4gIGlmIChsaW5lRW5kT2Zmc2V0ID09PSAtMSkge1xuICAgIGxpbmVFbmRPZmZzZXQgPSBzdHIubGVuZ3RoO1xuICB9IGVsc2Uge1xuICAgIC8vIEdldCB0aGUgbmV4dCBsaW5lLlxuICAgIHZhciBuZXh0TGluZUVuZE9mZnNldCA9IHN0ci5pbmRleE9mKCdcXG4nLCBsaW5lRW5kT2Zmc2V0ICsgMSk7XG4gICAgbmV4dExpbmUgPSBuZXh0TGluZUVuZE9mZnNldCA9PT0gLTEgPyBzdHIuc2xpY2UobGluZUVuZE9mZnNldClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHN0ci5zbGljZShsaW5lRW5kT2Zmc2V0LCBuZXh0TGluZUVuZE9mZnNldCk7XG4gICAgLy8gU3RyaXAgbGVhZGluZyBhbmQgdHJhaWxpbmcgRU9MIGNoYXIocykuXG4gICAgbmV4dExpbmUgPSBuZXh0TGluZS5yZXBsYWNlKC9eXFxyP1xcbi8sICcnKS5yZXBsYWNlKC9cXHIkLywgJycpO1xuICB9XG5cbiAgLy8gR2V0IHRoZSBwcmV2aW91cyBsaW5lLlxuICBpZiAocHJldkxpbmVTdGFydE9mZnNldCA+PSAwKSB7XG4gICAgcHJldkxpbmUgPSBzdHIuc2xpY2UocHJldkxpbmVTdGFydE9mZnNldCwgbGluZVN0YXJ0T2Zmc2V0KVxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xccj9cXG4kLywgJycpOyAgLy8gU3RyaXAgdHJhaWxpbmcgRU9MIGNoYXIocykuXG4gIH1cblxuICAvLyBHZXQgdGhlIHRhcmdldCBsaW5lLCBzdHJpcHBpbmcgYSB0cmFpbGluZyBjYXJyaWFnZSByZXR1cm4gaWYgbmVjZXNzYXJ5LlxuICB2YXIgbGluZSA9IHN0ci5zbGljZShsaW5lU3RhcnRPZmZzZXQsIGxpbmVFbmRPZmZzZXQpLnJlcGxhY2UoL1xcciQvLCAnJyk7XG5cbiAgcmV0dXJuIHtcbiAgICBsaW5lTnVtOiBsaW5lTnVtLFxuICAgIGNvbE51bTogY29sTnVtLFxuICAgIGxpbmU6IGxpbmUsXG4gICAgcHJldkxpbmU6IHByZXZMaW5lLFxuICAgIG5leHRMaW5lOiBuZXh0TGluZVxuICB9O1xufTtcblxuLy8gUmV0dXJuIGEgbmljZWx5LWZvcm1hdHRlZCBzdHJpbmcgZGVzY3JpYmluZyB0aGUgbGluZSBhbmQgY29sdW1uIGZvciB0aGVcbi8vIGdpdmVuIG9mZnNldCBpbiBgc3RyYC5cbmV4cG9ydHMuZ2V0TGluZUFuZENvbHVtbk1lc3NhZ2UgPSBmdW5jdGlvbihzdHIsIG9mZnNldCAvKiAuLi5yYW5nZXMgKi8pIHtcbiAgdmFyIHJlcGVhdFN0ciA9IGNvbW1vbi5yZXBlYXRTdHI7XG5cbiAgdmFyIGxpbmVBbmRDb2wgPSBleHBvcnRzLmdldExpbmVBbmRDb2x1bW4oc3RyLCBvZmZzZXQpO1xuICB2YXIgc2IgPSBuZXcgY29tbW9uLlN0cmluZ0J1ZmZlcigpO1xuICBzYi5hcHBlbmQoJ0xpbmUgJyArIGxpbmVBbmRDb2wubGluZU51bSArICcsIGNvbCAnICsgbGluZUFuZENvbC5jb2xOdW0gKyAnOlxcbicpO1xuXG4gIC8vIEFuIGFycmF5IG9mIHRoZSBwcmV2aW91cywgY3VycmVudCwgYW5kIG5leHQgbGluZSBudW1iZXJzIGFzIHN0cmluZ3Mgb2YgZXF1YWwgbGVuZ3RoLlxuICB2YXIgbGluZU51bWJlcnMgPSBwYWROdW1iZXJzVG9FcXVhbExlbmd0aChbXG4gICAgICBsaW5lQW5kQ29sLnByZXZMaW5lID09IG51bGwgPyAwIDogbGluZUFuZENvbC5saW5lTnVtIC0gMSxcbiAgICAgIGxpbmVBbmRDb2wubGluZU51bSxcbiAgICAgIGxpbmVBbmRDb2wubmV4dExpbmUgPT0gbnVsbCA/IDAgOiBsaW5lQW5kQ29sLmxpbmVOdW0gKyAxXG4gIF0pO1xuXG4gIC8vIEhlbHBlciBmb3IgYXBwZW5kaW5nIGZvcm1hdHRpbmcgaW5wdXQgbGluZXMgdG8gdGhlIGJ1ZmZlci5cbiAgZnVuY3Rpb24gYXBwZW5kTGluZShudW0sIGNvbnRlbnQsIHByZWZpeCkge1xuICAgIHNiLmFwcGVuZChwcmVmaXggKyBsaW5lTnVtYmVyc1tudW1dICsgJyB8ICcgKyBjb250ZW50ICsgJ1xcbicpO1xuICB9XG5cbiAgLy8gSW5jbHVkZSB0aGUgcHJldmlvdXMgbGluZSBmb3IgY29udGV4dCBpZiBwb3NzaWJsZS5cbiAgaWYgKGxpbmVBbmRDb2wucHJldkxpbmUgIT0gbnVsbCkge1xuICAgIGFwcGVuZExpbmUoMCwgbGluZUFuZENvbC5wcmV2TGluZSwgJyAgJyk7XG4gIH1cbiAgLy8gTGluZSB0aGF0IHRoZSBlcnJvciBvY2N1cnJlZCBvbi5cbiAgYXBwZW5kTGluZSgxLCBsaW5lQW5kQ29sLmxpbmUsICc+ICcpO1xuXG4gIC8vIEJ1aWxkIHVwIHRoZSBsaW5lIHRoYXQgcG9pbnRzIHRvIHRoZSBvZmZzZXQgYW5kIHBvc3NpYmxlIGluZGljYXRlcyBvbmUgb3IgbW9yZSByYW5nZXMuXG4gIC8vIFN0YXJ0IHdpdGggYSBibGFuayBsaW5lLCBhbmQgaW5kaWNhdGUgZWFjaCByYW5nZSBieSBvdmVybGF5aW5nIGEgc3RyaW5nIG9mIGB+YCBjaGFycy5cbiAgdmFyIGxpbmVMZW4gPSBsaW5lQW5kQ29sLmxpbmUubGVuZ3RoO1xuICB2YXIgaW5kaWNhdGlvbkxpbmUgPSByZXBlYXRTdHIoJyAnLCBsaW5lTGVuICsgMSk7XG4gIHZhciByYW5nZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHJhbmdlcy5sZW5ndGg7ICsraSkge1xuICAgIHZhciBzdGFydElkeCA9IHJhbmdlc1tpXVswXTtcbiAgICB2YXIgZW5kSWR4ID0gcmFuZ2VzW2ldWzFdO1xuICAgIGNvbW1vbi5hc3NlcnQoc3RhcnRJZHggPj0gMCAmJiBzdGFydElkeCA8PSBlbmRJZHgsICdyYW5nZSBzdGFydCBtdXN0IGJlID49IDAgYW5kIDw9IGVuZCcpO1xuXG4gICAgdmFyIGxpbmVTdGFydE9mZnNldCA9IG9mZnNldCAtIGxpbmVBbmRDb2wuY29sTnVtICsgMTtcbiAgICBzdGFydElkeCA9IE1hdGgubWF4KDAsIHN0YXJ0SWR4IC0gbGluZVN0YXJ0T2Zmc2V0KTtcbiAgICBlbmRJZHggPSBNYXRoLm1pbihlbmRJZHggLSBsaW5lU3RhcnRPZmZzZXQsIGxpbmVMZW4pO1xuXG4gICAgaW5kaWNhdGlvbkxpbmUgPSBzdHJjcHkoaW5kaWNhdGlvbkxpbmUsIHJlcGVhdFN0cignficsIGVuZElkeCAtIHN0YXJ0SWR4KSwgc3RhcnRJZHgpO1xuICB9XG4gIHZhciBndXR0ZXJXaWR0aCA9IDIgKyBsaW5lTnVtYmVyc1sxXS5sZW5ndGggKyAzO1xuICBzYi5hcHBlbmQocmVwZWF0U3RyKCcgJywgZ3V0dGVyV2lkdGgpKTtcbiAgaW5kaWNhdGlvbkxpbmUgPSBzdHJjcHkoaW5kaWNhdGlvbkxpbmUsICdeJywgbGluZUFuZENvbC5jb2xOdW0gLSAxKTtcbiAgc2IuYXBwZW5kKGluZGljYXRpb25MaW5lLnJlcGxhY2UoLyArJC8sICcnKSArICdcXG4nKTtcblxuICAvLyBJbmNsdWRlIHRoZSBuZXh0IGxpbmUgZm9yIGNvbnRleHQgaWYgcG9zc2libGUuXG4gIGlmIChsaW5lQW5kQ29sLm5leHRMaW5lICE9IG51bGwpIHtcbiAgICBhcHBlbmRMaW5lKDIsIGxpbmVBbmRDb2wubmV4dExpbmUsICcgICcpO1xuICB9XG4gIHJldHVybiBzYi5jb250ZW50cygpO1xufTtcbiJdfQ==
(28)
});
