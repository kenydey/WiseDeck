var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/process-nextick-args/index.js
var require_process_nextick_args = __commonJS({
  "node_modules/process-nextick-args/index.js"(exports, module) {
    "use strict";
    if (typeof process === "undefined" || !process.version || process.version.indexOf("v0.") === 0 || process.version.indexOf("v1.") === 0 && process.version.indexOf("v1.8.") !== 0) {
      module.exports = { nextTick };
    } else {
      module.exports = process;
    }
    function nextTick(fn, arg1, arg2, arg3) {
      if (typeof fn !== "function") {
        throw new TypeError('"callback" argument must be a function');
      }
      var len = arguments.length;
      var args, i;
      switch (len) {
        case 0:
        case 1:
          return process.nextTick(fn);
        case 2:
          return process.nextTick(function afterTickOne() {
            fn.call(null, arg1);
          });
        case 3:
          return process.nextTick(function afterTickTwo() {
            fn.call(null, arg1, arg2);
          });
        case 4:
          return process.nextTick(function afterTickThree() {
            fn.call(null, arg1, arg2, arg3);
          });
        default:
          args = new Array(len - 1);
          i = 0;
          while (i < args.length) {
            args[i++] = arguments[i];
          }
          return process.nextTick(function afterTick() {
            fn.apply(null, args);
          });
      }
    }
  }
});

// node_modules/isarray/index.js
var require_isarray = __commonJS({
  "node_modules/isarray/index.js"(exports, module) {
    var toString2 = {}.toString;
    module.exports = Array.isArray || function(arr) {
      return toString2.call(arr) == "[object Array]";
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/stream.js
var require_stream = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/stream.js"(exports, module) {
    module.exports = __require("stream");
  }
});

// node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/safe-buffer/index.js"(exports, module) {
    var buffer = __require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module.exports = buffer;
    } else {
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/core-util-is/lib/util.js
var require_util = __commonJS({
  "node_modules/core-util-is/lib/util.js"(exports) {
    function isArray(arg) {
      if (Array.isArray) {
        return Array.isArray(arg);
      }
      return objectToString(arg) === "[object Array]";
    }
    exports.isArray = isArray;
    function isBoolean(arg) {
      return typeof arg === "boolean";
    }
    exports.isBoolean = isBoolean;
    function isNull(arg) {
      return arg === null;
    }
    exports.isNull = isNull;
    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;
    function isNumber(arg) {
      return typeof arg === "number";
    }
    exports.isNumber = isNumber;
    function isString(arg) {
      return typeof arg === "string";
    }
    exports.isString = isString;
    function isSymbol(arg) {
      return typeof arg === "symbol";
    }
    exports.isSymbol = isSymbol;
    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;
    function isRegExp(re) {
      return objectToString(re) === "[object RegExp]";
    }
    exports.isRegExp = isRegExp;
    function isObject(arg) {
      return typeof arg === "object" && arg !== null;
    }
    exports.isObject = isObject;
    function isDate(d) {
      return objectToString(d) === "[object Date]";
    }
    exports.isDate = isDate;
    function isError(e) {
      return objectToString(e) === "[object Error]" || e instanceof Error;
    }
    exports.isError = isError;
    function isFunction(arg) {
      return typeof arg === "function";
    }
    exports.isFunction = isFunction;
    function isPrimitive(arg) {
      return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || // ES6 symbol
      typeof arg === "undefined";
    }
    exports.isPrimitive = isPrimitive;
    exports.isBuffer = __require("buffer").Buffer.isBuffer;
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports, module) {
    if (typeof Object.create === "function") {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/inherits/inherits.js"(exports, module) {
    try {
      util = __require("util");
      if (typeof util.inherits !== "function") throw "";
      module.exports = util.inherits;
    } catch (e) {
      module.exports = require_inherits_browser();
    }
    var util;
  }
});

// node_modules/readable-stream/lib/internal/streams/BufferList.js
var require_BufferList = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/BufferList.js"(exports, module) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Buffer2 = require_safe_buffer().Buffer;
    var util = __require("util");
    function copyBuffer(src, target, offset) {
      src.copy(target, offset);
    }
    module.exports = (function() {
      function BufferList() {
        _classCallCheck(this, BufferList);
        this.head = null;
        this.tail = null;
        this.length = 0;
      }
      BufferList.prototype.push = function push(v) {
        var entry = { data: v, next: null };
        if (this.length > 0) this.tail.next = entry;
        else this.head = entry;
        this.tail = entry;
        ++this.length;
      };
      BufferList.prototype.unshift = function unshift(v) {
        var entry = { data: v, next: this.head };
        if (this.length === 0) this.tail = entry;
        this.head = entry;
        ++this.length;
      };
      BufferList.prototype.shift = function shift() {
        if (this.length === 0) return;
        var ret = this.head.data;
        if (this.length === 1) this.head = this.tail = null;
        else this.head = this.head.next;
        --this.length;
        return ret;
      };
      BufferList.prototype.clear = function clear() {
        this.head = this.tail = null;
        this.length = 0;
      };
      BufferList.prototype.join = function join(s) {
        if (this.length === 0) return "";
        var p = this.head;
        var ret = "" + p.data;
        while (p = p.next) {
          ret += s + p.data;
        }
        return ret;
      };
      BufferList.prototype.concat = function concat(n) {
        if (this.length === 0) return Buffer2.alloc(0);
        var ret = Buffer2.allocUnsafe(n >>> 0);
        var p = this.head;
        var i = 0;
        while (p) {
          copyBuffer(p.data, ret, i);
          i += p.data.length;
          p = p.next;
        }
        return ret;
      };
      return BufferList;
    })();
    if (util && util.inspect && util.inspect.custom) {
      module.exports.prototype[util.inspect.custom] = function() {
        var obj = util.inspect({ length: this.length });
        return this.constructor.name + " " + obj;
      };
    }
  }
});

// node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/destroy.js"(exports, module) {
    "use strict";
    var pna = require_process_nextick_args();
    function destroy(err, cb) {
      var _this = this;
      var readableDestroyed = this._readableState && this._readableState.destroyed;
      var writableDestroyed = this._writableState && this._writableState.destroyed;
      if (readableDestroyed || writableDestroyed) {
        if (cb) {
          cb(err);
        } else if (err) {
          if (!this._writableState) {
            pna.nextTick(emitErrorNT, this, err);
          } else if (!this._writableState.errorEmitted) {
            this._writableState.errorEmitted = true;
            pna.nextTick(emitErrorNT, this, err);
          }
        }
        return this;
      }
      if (this._readableState) {
        this._readableState.destroyed = true;
      }
      if (this._writableState) {
        this._writableState.destroyed = true;
      }
      this._destroy(err || null, function(err2) {
        if (!cb && err2) {
          if (!_this._writableState) {
            pna.nextTick(emitErrorNT, _this, err2);
          } else if (!_this._writableState.errorEmitted) {
            _this._writableState.errorEmitted = true;
            pna.nextTick(emitErrorNT, _this, err2);
          }
        } else if (cb) {
          cb(err2);
        }
      });
      return this;
    }
    function undestroy() {
      if (this._readableState) {
        this._readableState.destroyed = false;
        this._readableState.reading = false;
        this._readableState.ended = false;
        this._readableState.endEmitted = false;
      }
      if (this._writableState) {
        this._writableState.destroyed = false;
        this._writableState.ended = false;
        this._writableState.ending = false;
        this._writableState.finalCalled = false;
        this._writableState.prefinished = false;
        this._writableState.finished = false;
        this._writableState.errorEmitted = false;
      }
    }
    function emitErrorNT(self2, err) {
      self2.emit("error", err);
    }
    module.exports = {
      destroy,
      undestroy
    };
  }
});

// node_modules/util-deprecate/node.js
var require_node = __commonJS({
  "node_modules/util-deprecate/node.js"(exports, module) {
    module.exports = __require("util").deprecate;
  }
});

// node_modules/readable-stream/lib/_stream_writable.js
var require_stream_writable = __commonJS({
  "node_modules/readable-stream/lib/_stream_writable.js"(exports, module) {
    "use strict";
    var pna = require_process_nextick_args();
    module.exports = Writable;
    function CorkedRequest(state) {
      var _this = this;
      this.next = null;
      this.entry = null;
      this.finish = function() {
        onCorkedFinish(_this, state);
      };
    }
    var asyncWrite = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
    var Duplex;
    Writable.WritableState = WritableState;
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var internalUtil = {
      deprecate: require_node()
    };
    var Stream = require_stream();
    var Buffer2 = require_safe_buffer().Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var destroyImpl = require_destroy();
    util.inherits(Writable, Stream);
    function nop() {
    }
    function WritableState(options, stream) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      var isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;
      var hwm = options.highWaterMark;
      var writableHwm = options.writableHighWaterMark;
      var defaultHwm = this.objectMode ? 16 : 16 * 1024;
      if (hwm || hwm === 0) this.highWaterMark = hwm;
      else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;
      else this.highWaterMark = defaultHwm;
      this.highWaterMark = Math.floor(this.highWaterMark);
      this.finalCalled = false;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      this.destroyed = false;
      var noDecode = options.decodeStrings === false;
      this.decodeStrings = !noDecode;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.length = 0;
      this.writing = false;
      this.corked = 0;
      this.sync = true;
      this.bufferProcessing = false;
      this.onwrite = function(er) {
        onwrite(stream, er);
      };
      this.writecb = null;
      this.writelen = 0;
      this.bufferedRequest = null;
      this.lastBufferedRequest = null;
      this.pendingcb = 0;
      this.prefinished = false;
      this.errorEmitted = false;
      this.bufferedRequestCount = 0;
      this.corkedRequestsFree = new CorkedRequest(this);
    }
    WritableState.prototype.getBuffer = function getBuffer() {
      var current = this.bufferedRequest;
      var out = [];
      while (current) {
        out.push(current);
        current = current.next;
      }
      return out;
    };
    (function() {
      try {
        Object.defineProperty(WritableState.prototype, "buffer", {
          get: internalUtil.deprecate(function() {
            return this.getBuffer();
          }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
        });
      } catch (_) {
      }
    })();
    var realHasInstance;
    if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
      realHasInstance = Function.prototype[Symbol.hasInstance];
      Object.defineProperty(Writable, Symbol.hasInstance, {
        value: function(object) {
          if (realHasInstance.call(this, object)) return true;
          if (this !== Writable) return false;
          return object && object._writableState instanceof WritableState;
        }
      });
    } else {
      realHasInstance = function(object) {
        return object instanceof this;
      };
    }
    function Writable(options) {
      Duplex = Duplex || require_stream_duplex();
      if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
        return new Writable(options);
      }
      this._writableState = new WritableState(options, this);
      this.writable = true;
      if (options) {
        if (typeof options.write === "function") this._write = options.write;
        if (typeof options.writev === "function") this._writev = options.writev;
        if (typeof options.destroy === "function") this._destroy = options.destroy;
        if (typeof options.final === "function") this._final = options.final;
      }
      Stream.call(this);
    }
    Writable.prototype.pipe = function() {
      this.emit("error", new Error("Cannot pipe, not readable"));
    };
    function writeAfterEnd(stream, cb) {
      var er = new Error("write after end");
      stream.emit("error", er);
      pna.nextTick(cb, er);
    }
    function validChunk(stream, state, chunk, cb) {
      var valid = true;
      var er = false;
      if (chunk === null) {
        er = new TypeError("May not write null values to stream");
      } else if (typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new TypeError("Invalid non-string/buffer chunk");
      }
      if (er) {
        stream.emit("error", er);
        pna.nextTick(cb, er);
        valid = false;
      }
      return valid;
    }
    Writable.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState;
      var ret = false;
      var isBuf = !state.objectMode && _isUint8Array(chunk);
      if (isBuf && !Buffer2.isBuffer(chunk)) {
        chunk = _uint8ArrayToBuffer(chunk);
      }
      if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (isBuf) encoding = "buffer";
      else if (!encoding) encoding = state.defaultEncoding;
      if (typeof cb !== "function") cb = nop;
      if (state.ended) writeAfterEnd(this, cb);
      else if (isBuf || validChunk(this, state, chunk, cb)) {
        state.pendingcb++;
        ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
      }
      return ret;
    };
    Writable.prototype.cork = function() {
      var state = this._writableState;
      state.corked++;
    };
    Writable.prototype.uncork = function() {
      var state = this._writableState;
      if (state.corked) {
        state.corked--;
        if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
      }
    };
    Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
      if (typeof encoding === "string") encoding = encoding.toLowerCase();
      if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + encoding);
      this._writableState.defaultEncoding = encoding;
      return this;
    };
    function decodeChunk(state, chunk, encoding) {
      if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
        chunk = Buffer2.from(chunk, encoding);
      }
      return chunk;
    }
    Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._writableState.highWaterMark;
      }
    });
    function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
      if (!isBuf) {
        var newChunk = decodeChunk(state, chunk, encoding);
        if (chunk !== newChunk) {
          isBuf = true;
          encoding = "buffer";
          chunk = newChunk;
        }
      }
      var len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      var ret = state.length < state.highWaterMark;
      if (!ret) state.needDrain = true;
      if (state.writing || state.corked) {
        var last = state.lastBufferedRequest;
        state.lastBufferedRequest = {
          chunk,
          encoding,
          isBuf,
          callback: cb,
          next: null
        };
        if (last) {
          last.next = state.lastBufferedRequest;
        } else {
          state.bufferedRequest = state.lastBufferedRequest;
        }
        state.bufferedRequestCount += 1;
      } else {
        doWrite(stream, state, false, len, chunk, encoding, cb);
      }
      return ret;
    }
    function doWrite(stream, state, writev, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      if (writev) stream._writev(chunk, state.onwrite);
      else stream._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    function onwriteError(stream, state, sync, er, cb) {
      --state.pendingcb;
      if (sync) {
        pna.nextTick(cb, er);
        pna.nextTick(finishMaybe, stream, state);
        stream._writableState.errorEmitted = true;
        stream.emit("error", er);
      } else {
        cb(er);
        stream._writableState.errorEmitted = true;
        stream.emit("error", er);
        finishMaybe(stream, state);
      }
    }
    function onwriteStateUpdate(state) {
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
    }
    function onwrite(stream, er) {
      var state = stream._writableState;
      var sync = state.sync;
      var cb = state.writecb;
      onwriteStateUpdate(state);
      if (er) onwriteError(stream, state, sync, er, cb);
      else {
        var finished = needFinish(state);
        if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
          clearBuffer(stream, state);
        }
        if (sync) {
          asyncWrite(afterWrite, stream, state, finished, cb);
        } else {
          afterWrite(stream, state, finished, cb);
        }
      }
    }
    function afterWrite(stream, state, finished, cb) {
      if (!finished) onwriteDrain(stream, state);
      state.pendingcb--;
      cb();
      finishMaybe(stream, state);
    }
    function onwriteDrain(stream, state) {
      if (state.length === 0 && state.needDrain) {
        state.needDrain = false;
        stream.emit("drain");
      }
    }
    function clearBuffer(stream, state) {
      state.bufferProcessing = true;
      var entry = state.bufferedRequest;
      if (stream._writev && entry && entry.next) {
        var l = state.bufferedRequestCount;
        var buffer = new Array(l);
        var holder = state.corkedRequestsFree;
        holder.entry = entry;
        var count = 0;
        var allBuffers = true;
        while (entry) {
          buffer[count] = entry;
          if (!entry.isBuf) allBuffers = false;
          entry = entry.next;
          count += 1;
        }
        buffer.allBuffers = allBuffers;
        doWrite(stream, state, true, state.length, buffer, "", holder.finish);
        state.pendingcb++;
        state.lastBufferedRequest = null;
        if (holder.next) {
          state.corkedRequestsFree = holder.next;
          holder.next = null;
        } else {
          state.corkedRequestsFree = new CorkedRequest(state);
        }
        state.bufferedRequestCount = 0;
      } else {
        while (entry) {
          var chunk = entry.chunk;
          var encoding = entry.encoding;
          var cb = entry.callback;
          var len = state.objectMode ? 1 : chunk.length;
          doWrite(stream, state, false, len, chunk, encoding, cb);
          entry = entry.next;
          state.bufferedRequestCount--;
          if (state.writing) {
            break;
          }
        }
        if (entry === null) state.lastBufferedRequest = null;
      }
      state.bufferedRequest = entry;
      state.bufferProcessing = false;
    }
    Writable.prototype._write = function(chunk, encoding, cb) {
      cb(new Error("_write() is not implemented"));
    };
    Writable.prototype._writev = null;
    Writable.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (chunk !== null && chunk !== void 0) this.write(chunk, encoding);
      if (state.corked) {
        state.corked = 1;
        this.uncork();
      }
      if (!state.ending) endWritable(this, state, cb);
    };
    function needFinish(state) {
      return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
    }
    function callFinal(stream, state) {
      stream._final(function(err) {
        state.pendingcb--;
        if (err) {
          stream.emit("error", err);
        }
        state.prefinished = true;
        stream.emit("prefinish");
        finishMaybe(stream, state);
      });
    }
    function prefinish(stream, state) {
      if (!state.prefinished && !state.finalCalled) {
        if (typeof stream._final === "function") {
          state.pendingcb++;
          state.finalCalled = true;
          pna.nextTick(callFinal, stream, state);
        } else {
          state.prefinished = true;
          stream.emit("prefinish");
        }
      }
    }
    function finishMaybe(stream, state) {
      var need = needFinish(state);
      if (need) {
        prefinish(stream, state);
        if (state.pendingcb === 0) {
          state.finished = true;
          stream.emit("finish");
        }
      }
      return need;
    }
    function endWritable(stream, state, cb) {
      state.ending = true;
      finishMaybe(stream, state);
      if (cb) {
        if (state.finished) pna.nextTick(cb);
        else stream.once("finish", cb);
      }
      state.ended = true;
      stream.writable = false;
    }
    function onCorkedFinish(corkReq, state, err) {
      var entry = corkReq.entry;
      corkReq.entry = null;
      while (entry) {
        var cb = entry.callback;
        state.pendingcb--;
        cb(err);
        entry = entry.next;
      }
      state.corkedRequestsFree.next = corkReq;
    }
    Object.defineProperty(Writable.prototype, "destroyed", {
      get: function() {
        if (this._writableState === void 0) {
          return false;
        }
        return this._writableState.destroyed;
      },
      set: function(value) {
        if (!this._writableState) {
          return;
        }
        this._writableState.destroyed = value;
      }
    });
    Writable.prototype.destroy = destroyImpl.destroy;
    Writable.prototype._undestroy = destroyImpl.undestroy;
    Writable.prototype._destroy = function(err, cb) {
      this.end();
      cb(err);
    };
  }
});

// node_modules/readable-stream/lib/_stream_duplex.js
var require_stream_duplex = __commonJS({
  "node_modules/readable-stream/lib/_stream_duplex.js"(exports, module) {
    "use strict";
    var pna = require_process_nextick_args();
    var objectKeys = Object.keys || function(obj) {
      var keys2 = [];
      for (var key in obj) {
        keys2.push(key);
      }
      return keys2;
    };
    module.exports = Duplex;
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var Readable = require_stream_readable();
    var Writable = require_stream_writable();
    util.inherits(Duplex, Readable);
    {
      keys = objectKeys(Writable.prototype);
      for (v = 0; v < keys.length; v++) {
        method = keys[v];
        if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
      }
    }
    var keys;
    var method;
    var v;
    function Duplex(options) {
      if (!(this instanceof Duplex)) return new Duplex(options);
      Readable.call(this, options);
      Writable.call(this, options);
      if (options && options.readable === false) this.readable = false;
      if (options && options.writable === false) this.writable = false;
      this.allowHalfOpen = true;
      if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;
      this.once("end", onend);
    }
    Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._writableState.highWaterMark;
      }
    });
    function onend() {
      if (this.allowHalfOpen || this._writableState.ended) return;
      pna.nextTick(onEndNT, this);
    }
    function onEndNT(self2) {
      self2.end();
    }
    Object.defineProperty(Duplex.prototype, "destroyed", {
      get: function() {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return false;
        }
        return this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function(value) {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return;
        }
        this._readableState.destroyed = value;
        this._writableState.destroyed = value;
      }
    });
    Duplex.prototype._destroy = function(err, cb) {
      this.push(null);
      this.end();
      pna.nextTick(cb, err);
    };
  }
});

// node_modules/string_decoder/lib/string_decoder.js
var require_string_decoder = __commonJS({
  "node_modules/string_decoder/lib/string_decoder.js"(exports) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var isEncoding = Buffer2.isEncoding || function(encoding) {
      encoding = "" + encoding;
      switch (encoding && encoding.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return true;
        default:
          return false;
      }
    };
    function _normalizeEncoding(enc) {
      if (!enc) return "utf8";
      var retried;
      while (true) {
        switch (enc) {
          case "utf8":
          case "utf-8":
            return "utf8";
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return "utf16le";
          case "latin1":
          case "binary":
            return "latin1";
          case "base64":
          case "ascii":
          case "hex":
            return enc;
          default:
            if (retried) return;
            enc = ("" + enc).toLowerCase();
            retried = true;
        }
      }
    }
    function normalizeEncoding(enc) {
      var nenc = _normalizeEncoding(enc);
      if (typeof nenc !== "string" && (Buffer2.isEncoding === isEncoding || !isEncoding(enc))) throw new Error("Unknown encoding: " + enc);
      return nenc || enc;
    }
    exports.StringDecoder = StringDecoder;
    function StringDecoder(encoding) {
      this.encoding = normalizeEncoding(encoding);
      var nb;
      switch (this.encoding) {
        case "utf16le":
          this.text = utf16Text;
          this.end = utf16End;
          nb = 4;
          break;
        case "utf8":
          this.fillLast = utf8FillLast;
          nb = 4;
          break;
        case "base64":
          this.text = base64Text;
          this.end = base64End;
          nb = 3;
          break;
        default:
          this.write = simpleWrite;
          this.end = simpleEnd;
          return;
      }
      this.lastNeed = 0;
      this.lastTotal = 0;
      this.lastChar = Buffer2.allocUnsafe(nb);
    }
    StringDecoder.prototype.write = function(buf) {
      if (buf.length === 0) return "";
      var r;
      var i;
      if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === void 0) return "";
        i = this.lastNeed;
        this.lastNeed = 0;
      } else {
        i = 0;
      }
      if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
      return r || "";
    };
    StringDecoder.prototype.end = utf8End;
    StringDecoder.prototype.text = utf8Text;
    StringDecoder.prototype.fillLast = function(buf) {
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
      this.lastNeed -= buf.length;
    };
    function utf8CheckByte(byte) {
      if (byte <= 127) return 0;
      else if (byte >> 5 === 6) return 2;
      else if (byte >> 4 === 14) return 3;
      else if (byte >> 3 === 30) return 4;
      return byte >> 6 === 2 ? -1 : -2;
    }
    function utf8CheckIncomplete(self2, buf, i) {
      var j = buf.length - 1;
      if (j < i) return 0;
      var nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) self2.lastNeed = nb - 1;
        return nb;
      }
      if (--j < i || nb === -2) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) self2.lastNeed = nb - 2;
        return nb;
      }
      if (--j < i || nb === -2) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) {
          if (nb === 2) nb = 0;
          else self2.lastNeed = nb - 3;
        }
        return nb;
      }
      return 0;
    }
    function utf8CheckExtraBytes(self2, buf, p) {
      if ((buf[0] & 192) !== 128) {
        self2.lastNeed = 0;
        return "\uFFFD";
      }
      if (self2.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 192) !== 128) {
          self2.lastNeed = 1;
          return "\uFFFD";
        }
        if (self2.lastNeed > 2 && buf.length > 2) {
          if ((buf[2] & 192) !== 128) {
            self2.lastNeed = 2;
            return "\uFFFD";
          }
        }
      }
    }
    function utf8FillLast(buf) {
      var p = this.lastTotal - this.lastNeed;
      var r = utf8CheckExtraBytes(this, buf, p);
      if (r !== void 0) return r;
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, p, 0, buf.length);
      this.lastNeed -= buf.length;
    }
    function utf8Text(buf, i) {
      var total = utf8CheckIncomplete(this, buf, i);
      if (!this.lastNeed) return buf.toString("utf8", i);
      this.lastTotal = total;
      var end = buf.length - (total - this.lastNeed);
      buf.copy(this.lastChar, 0, end);
      return buf.toString("utf8", i, end);
    }
    function utf8End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) return r + "\uFFFD";
      return r;
    }
    function utf16Text(buf, i) {
      if ((buf.length - i) % 2 === 0) {
        var r = buf.toString("utf16le", i);
        if (r) {
          var c = r.charCodeAt(r.length - 1);
          if (c >= 55296 && c <= 56319) {
            this.lastNeed = 2;
            this.lastTotal = 4;
            this.lastChar[0] = buf[buf.length - 2];
            this.lastChar[1] = buf[buf.length - 1];
            return r.slice(0, -1);
          }
        }
        return r;
      }
      this.lastNeed = 1;
      this.lastTotal = 2;
      this.lastChar[0] = buf[buf.length - 1];
      return buf.toString("utf16le", i, buf.length - 1);
    }
    function utf16End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString("utf16le", 0, end);
      }
      return r;
    }
    function base64Text(buf, i) {
      var n = (buf.length - i) % 3;
      if (n === 0) return buf.toString("base64", i);
      this.lastNeed = 3 - n;
      this.lastTotal = 3;
      if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
      } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
      }
      return buf.toString("base64", i, buf.length - n);
    }
    function base64End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
      return r;
    }
    function simpleWrite(buf) {
      return buf.toString(this.encoding);
    }
    function simpleEnd(buf) {
      return buf && buf.length ? this.write(buf) : "";
    }
  }
});

// node_modules/readable-stream/lib/_stream_readable.js
var require_stream_readable = __commonJS({
  "node_modules/readable-stream/lib/_stream_readable.js"(exports, module) {
    "use strict";
    var pna = require_process_nextick_args();
    module.exports = Readable;
    var isArray = require_isarray();
    var Duplex;
    Readable.ReadableState = ReadableState;
    var EE = __require("events").EventEmitter;
    var EElistenerCount = function(emitter, type) {
      return emitter.listeners(type).length;
    };
    var Stream = require_stream();
    var Buffer2 = require_safe_buffer().Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var debugUtil = __require("util");
    var debug = void 0;
    if (debugUtil && debugUtil.debuglog) {
      debug = debugUtil.debuglog("stream");
    } else {
      debug = function() {
      };
    }
    var BufferList = require_BufferList();
    var destroyImpl = require_destroy();
    var StringDecoder;
    util.inherits(Readable, Stream);
    var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
    function prependListener(emitter, event, fn) {
      if (typeof emitter.prependListener === "function") return emitter.prependListener(event, fn);
      if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);
      else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);
      else emitter._events[event] = [fn, emitter._events[event]];
    }
    function ReadableState(options, stream) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      var isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;
      var hwm = options.highWaterMark;
      var readableHwm = options.readableHighWaterMark;
      var defaultHwm = this.objectMode ? 16 : 16 * 1024;
      if (hwm || hwm === 0) this.highWaterMark = hwm;
      else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;
      else this.highWaterMark = defaultHwm;
      this.highWaterMark = Math.floor(this.highWaterMark);
      this.buffer = new BufferList();
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = null;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.resumeScheduled = false;
      this.destroyed = false;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.awaitDrain = 0;
      this.readingMore = false;
      this.decoder = null;
      this.encoding = null;
      if (options.encoding) {
        if (!StringDecoder) StringDecoder = require_string_decoder().StringDecoder;
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
      }
    }
    function Readable(options) {
      Duplex = Duplex || require_stream_duplex();
      if (!(this instanceof Readable)) return new Readable(options);
      this._readableState = new ReadableState(options, this);
      this.readable = true;
      if (options) {
        if (typeof options.read === "function") this._read = options.read;
        if (typeof options.destroy === "function") this._destroy = options.destroy;
      }
      Stream.call(this);
    }
    Object.defineProperty(Readable.prototype, "destroyed", {
      get: function() {
        if (this._readableState === void 0) {
          return false;
        }
        return this._readableState.destroyed;
      },
      set: function(value) {
        if (!this._readableState) {
          return;
        }
        this._readableState.destroyed = value;
      }
    });
    Readable.prototype.destroy = destroyImpl.destroy;
    Readable.prototype._undestroy = destroyImpl.undestroy;
    Readable.prototype._destroy = function(err, cb) {
      this.push(null);
      cb(err);
    };
    Readable.prototype.push = function(chunk, encoding) {
      var state = this._readableState;
      var skipChunkCheck;
      if (!state.objectMode) {
        if (typeof chunk === "string") {
          encoding = encoding || state.defaultEncoding;
          if (encoding !== state.encoding) {
            chunk = Buffer2.from(chunk, encoding);
            encoding = "";
          }
          skipChunkCheck = true;
        }
      } else {
        skipChunkCheck = true;
      }
      return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
    };
    Readable.prototype.unshift = function(chunk) {
      return readableAddChunk(this, chunk, null, true, false);
    };
    function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
      var state = stream._readableState;
      if (chunk === null) {
        state.reading = false;
        onEofChunk(stream, state);
      } else {
        var er;
        if (!skipChunkCheck) er = chunkInvalid(state, chunk);
        if (er) {
          stream.emit("error", er);
        } else if (state.objectMode || chunk && chunk.length > 0) {
          if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer2.prototype) {
            chunk = _uint8ArrayToBuffer(chunk);
          }
          if (addToFront) {
            if (state.endEmitted) stream.emit("error", new Error("stream.unshift() after end event"));
            else addChunk(stream, state, chunk, true);
          } else if (state.ended) {
            stream.emit("error", new Error("stream.push() after EOF"));
          } else {
            state.reading = false;
            if (state.decoder && !encoding) {
              chunk = state.decoder.write(chunk);
              if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);
              else maybeReadMore(stream, state);
            } else {
              addChunk(stream, state, chunk, false);
            }
          }
        } else if (!addToFront) {
          state.reading = false;
        }
      }
      return needMoreData(state);
    }
    function addChunk(stream, state, chunk, addToFront) {
      if (state.flowing && state.length === 0 && !state.sync) {
        stream.emit("data", chunk);
        stream.read(0);
      } else {
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront) state.buffer.unshift(chunk);
        else state.buffer.push(chunk);
        if (state.needReadable) emitReadable(stream);
      }
      maybeReadMore(stream, state);
    }
    function chunkInvalid(state, chunk) {
      var er;
      if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new TypeError("Invalid non-string/buffer chunk");
      }
      return er;
    }
    function needMoreData(state) {
      return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
    }
    Readable.prototype.isPaused = function() {
      return this._readableState.flowing === false;
    };
    Readable.prototype.setEncoding = function(enc) {
      if (!StringDecoder) StringDecoder = require_string_decoder().StringDecoder;
      this._readableState.decoder = new StringDecoder(enc);
      this._readableState.encoding = enc;
      return this;
    };
    var MAX_HWM = 8388608;
    function computeNewHighWaterMark(n) {
      if (n >= MAX_HWM) {
        n = MAX_HWM;
      } else {
        n--;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        n++;
      }
      return n;
    }
    function howMuchToRead(n, state) {
      if (n <= 0 || state.length === 0 && state.ended) return 0;
      if (state.objectMode) return 1;
      if (n !== n) {
        if (state.flowing && state.length) return state.buffer.head.data.length;
        else return state.length;
      }
      if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
      if (n <= state.length) return n;
      if (!state.ended) {
        state.needReadable = true;
        return 0;
      }
      return state.length;
    }
    Readable.prototype.read = function(n) {
      debug("read", n);
      n = parseInt(n, 10);
      var state = this._readableState;
      var nOrig = n;
      if (n !== 0) state.emittedReadable = false;
      if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
        debug("read: emitReadable", state.length, state.ended);
        if (state.length === 0 && state.ended) endReadable(this);
        else emitReadable(this);
        return null;
      }
      n = howMuchToRead(n, state);
      if (n === 0 && state.ended) {
        if (state.length === 0) endReadable(this);
        return null;
      }
      var doRead = state.needReadable;
      debug("need readable", doRead);
      if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug("length less than watermark", doRead);
      }
      if (state.ended || state.reading) {
        doRead = false;
        debug("reading or ended", doRead);
      } else if (doRead) {
        debug("do read");
        state.reading = true;
        state.sync = true;
        if (state.length === 0) state.needReadable = true;
        this._read(state.highWaterMark);
        state.sync = false;
        if (!state.reading) n = howMuchToRead(nOrig, state);
      }
      var ret;
      if (n > 0) ret = fromList(n, state);
      else ret = null;
      if (ret === null) {
        state.needReadable = true;
        n = 0;
      } else {
        state.length -= n;
      }
      if (state.length === 0) {
        if (!state.ended) state.needReadable = true;
        if (nOrig !== n && state.ended) endReadable(this);
      }
      if (ret !== null) this.emit("data", ret);
      return ret;
    };
    function onEofChunk(stream, state) {
      if (state.ended) return;
      if (state.decoder) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;
      emitReadable(stream);
    }
    function emitReadable(stream) {
      var state = stream._readableState;
      state.needReadable = false;
      if (!state.emittedReadable) {
        debug("emitReadable", state.flowing);
        state.emittedReadable = true;
        if (state.sync) pna.nextTick(emitReadable_, stream);
        else emitReadable_(stream);
      }
    }
    function emitReadable_(stream) {
      debug("emit readable");
      stream.emit("readable");
      flow(stream);
    }
    function maybeReadMore(stream, state) {
      if (!state.readingMore) {
        state.readingMore = true;
        pna.nextTick(maybeReadMore_, stream, state);
      }
    }
    function maybeReadMore_(stream, state) {
      var len = state.length;
      while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
        debug("maybeReadMore read 0");
        stream.read(0);
        if (len === state.length)
          break;
        else len = state.length;
      }
      state.readingMore = false;
    }
    Readable.prototype._read = function(n) {
      this.emit("error", new Error("_read() is not implemented"));
    };
    Readable.prototype.pipe = function(dest, pipeOpts) {
      var src = this;
      var state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1;
      debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
      var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
      var endFn = doEnd ? onend : unpipe;
      if (state.endEmitted) pna.nextTick(endFn);
      else src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable, unpipeInfo) {
        debug("onunpipe");
        if (readable === src) {
          if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
            unpipeInfo.hasUnpiped = true;
            cleanup();
          }
        }
      }
      function onend() {
        debug("onend");
        dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on("drain", ondrain);
      var cleanedUp = false;
      function cleanup() {
        debug("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        dest.removeListener("drain", ondrain);
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend);
        src.removeListener("end", unpipe);
        src.removeListener("data", ondata);
        cleanedUp = true;
        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
      }
      var increasedAwaitDrain = false;
      src.on("data", ondata);
      function ondata(chunk) {
        debug("ondata");
        increasedAwaitDrain = false;
        var ret = dest.write(chunk);
        if (false === ret && !increasedAwaitDrain) {
          if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
            debug("false write response, pause", state.awaitDrain);
            state.awaitDrain++;
            increasedAwaitDrain = true;
          }
          src.pause();
        }
      }
      function onerror(er) {
        debug("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (EElistenerCount(dest, "error") === 0) dest.emit("error", er);
      }
      prependListener(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        debug("onfinish");
        dest.removeListener("close", onclose);
        unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        debug("unpipe");
        src.unpipe(dest);
      }
      dest.emit("pipe", src);
      if (!state.flowing) {
        debug("pipe resume");
        src.resume();
      }
      return dest;
    };
    function pipeOnDrain(src) {
      return function() {
        var state = src._readableState;
        debug("pipeOnDrain", state.awaitDrain);
        if (state.awaitDrain) state.awaitDrain--;
        if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
          state.flowing = true;
          flow(src);
        }
      };
    }
    Readable.prototype.unpipe = function(dest) {
      var state = this._readableState;
      var unpipeInfo = { hasUnpiped: false };
      if (state.pipesCount === 0) return this;
      if (state.pipesCount === 1) {
        if (dest && dest !== state.pipes) return this;
        if (!dest) dest = state.pipes;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        if (dest) dest.emit("unpipe", this, unpipeInfo);
        return this;
      }
      if (!dest) {
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        for (var i = 0; i < len; i++) {
          dests[i].emit("unpipe", this, { hasUnpiped: false });
        }
        return this;
      }
      var index = indexOf(state.pipes, dest);
      if (index === -1) return this;
      state.pipes.splice(index, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1) state.pipes = state.pipes[0];
      dest.emit("unpipe", this, unpipeInfo);
      return this;
    };
    Readable.prototype.on = function(ev, fn) {
      var res = Stream.prototype.on.call(this, ev, fn);
      if (ev === "data") {
        if (this._readableState.flowing !== false) this.resume();
      } else if (ev === "readable") {
        var state = this._readableState;
        if (!state.endEmitted && !state.readableListening) {
          state.readableListening = state.needReadable = true;
          state.emittedReadable = false;
          if (!state.reading) {
            pna.nextTick(nReadingNextTick, this);
          } else if (state.length) {
            emitReadable(this);
          }
        }
      }
      return res;
    };
    Readable.prototype.addListener = Readable.prototype.on;
    function nReadingNextTick(self2) {
      debug("readable nexttick read 0");
      self2.read(0);
    }
    Readable.prototype.resume = function() {
      var state = this._readableState;
      if (!state.flowing) {
        debug("resume");
        state.flowing = true;
        resume(this, state);
      }
      return this;
    };
    function resume(stream, state) {
      if (!state.resumeScheduled) {
        state.resumeScheduled = true;
        pna.nextTick(resume_, stream, state);
      }
    }
    function resume_(stream, state) {
      if (!state.reading) {
        debug("resume read 0");
        stream.read(0);
      }
      state.resumeScheduled = false;
      state.awaitDrain = 0;
      stream.emit("resume");
      flow(stream);
      if (state.flowing && !state.reading) stream.read(0);
    }
    Readable.prototype.pause = function() {
      debug("call pause flowing=%j", this._readableState.flowing);
      if (false !== this._readableState.flowing) {
        debug("pause");
        this._readableState.flowing = false;
        this.emit("pause");
      }
      return this;
    };
    function flow(stream) {
      var state = stream._readableState;
      debug("flow", state.flowing);
      while (state.flowing && stream.read() !== null) {
      }
    }
    Readable.prototype.wrap = function(stream) {
      var _this = this;
      var state = this._readableState;
      var paused = false;
      stream.on("end", function() {
        debug("wrapped end");
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length) _this.push(chunk);
        }
        _this.push(null);
      });
      stream.on("data", function(chunk) {
        debug("wrapped data");
        if (state.decoder) chunk = state.decoder.write(chunk);
        if (state.objectMode && (chunk === null || chunk === void 0)) return;
        else if (!state.objectMode && (!chunk || !chunk.length)) return;
        var ret = _this.push(chunk);
        if (!ret) {
          paused = true;
          stream.pause();
        }
      });
      for (var i in stream) {
        if (this[i] === void 0 && typeof stream[i] === "function") {
          this[i] = /* @__PURE__ */ (function(method) {
            return function() {
              return stream[method].apply(stream, arguments);
            };
          })(i);
        }
      }
      for (var n = 0; n < kProxyEvents.length; n++) {
        stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
      }
      this._read = function(n2) {
        debug("wrapped _read", n2);
        if (paused) {
          paused = false;
          stream.resume();
        }
      };
      return this;
    };
    Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._readableState.highWaterMark;
      }
    });
    Readable._fromList = fromList;
    function fromList(n, state) {
      if (state.length === 0) return null;
      var ret;
      if (state.objectMode) ret = state.buffer.shift();
      else if (!n || n >= state.length) {
        if (state.decoder) ret = state.buffer.join("");
        else if (state.buffer.length === 1) ret = state.buffer.head.data;
        else ret = state.buffer.concat(state.length);
        state.buffer.clear();
      } else {
        ret = fromListPartial(n, state.buffer, state.decoder);
      }
      return ret;
    }
    function fromListPartial(n, list, hasStrings) {
      var ret;
      if (n < list.head.data.length) {
        ret = list.head.data.slice(0, n);
        list.head.data = list.head.data.slice(n);
      } else if (n === list.head.data.length) {
        ret = list.shift();
      } else {
        ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
      }
      return ret;
    }
    function copyFromBufferString(n, list) {
      var p = list.head;
      var c = 1;
      var ret = p.data;
      n -= ret.length;
      while (p = p.next) {
        var str = p.data;
        var nb = n > str.length ? str.length : n;
        if (nb === str.length) ret += str;
        else ret += str.slice(0, n);
        n -= nb;
        if (n === 0) {
          if (nb === str.length) {
            ++c;
            if (p.next) list.head = p.next;
            else list.head = list.tail = null;
          } else {
            list.head = p;
            p.data = str.slice(nb);
          }
          break;
        }
        ++c;
      }
      list.length -= c;
      return ret;
    }
    function copyFromBuffer(n, list) {
      var ret = Buffer2.allocUnsafe(n);
      var p = list.head;
      var c = 1;
      p.data.copy(ret);
      n -= p.data.length;
      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret, ret.length - n, 0, nb);
        n -= nb;
        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next) list.head = p.next;
            else list.head = list.tail = null;
          } else {
            list.head = p;
            p.data = buf.slice(nb);
          }
          break;
        }
        ++c;
      }
      list.length -= c;
      return ret;
    }
    function endReadable(stream) {
      var state = stream._readableState;
      if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');
      if (!state.endEmitted) {
        state.ended = true;
        pna.nextTick(endReadableNT, state, stream);
      }
    }
    function endReadableNT(state, stream) {
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit("end");
      }
    }
    function indexOf(xs, x) {
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) return i;
      }
      return -1;
    }
  }
});

// node_modules/readable-stream/lib/_stream_transform.js
var require_stream_transform = __commonJS({
  "node_modules/readable-stream/lib/_stream_transform.js"(exports, module) {
    "use strict";
    module.exports = Transform;
    var Duplex = require_stream_duplex();
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    util.inherits(Transform, Duplex);
    function afterTransform(er, data) {
      var ts = this._transformState;
      ts.transforming = false;
      var cb = ts.writecb;
      if (!cb) {
        return this.emit("error", new Error("write callback called multiple times"));
      }
      ts.writechunk = null;
      ts.writecb = null;
      if (data != null)
        this.push(data);
      cb(er);
      var rs = this._readableState;
      rs.reading = false;
      if (rs.needReadable || rs.length < rs.highWaterMark) {
        this._read(rs.highWaterMark);
      }
    }
    function Transform(options) {
      if (!(this instanceof Transform)) return new Transform(options);
      Duplex.call(this, options);
      this._transformState = {
        afterTransform: afterTransform.bind(this),
        needTransform: false,
        transforming: false,
        writecb: null,
        writechunk: null,
        writeencoding: null
      };
      this._readableState.needReadable = true;
      this._readableState.sync = false;
      if (options) {
        if (typeof options.transform === "function") this._transform = options.transform;
        if (typeof options.flush === "function") this._flush = options.flush;
      }
      this.on("prefinish", prefinish);
    }
    function prefinish() {
      var _this = this;
      if (typeof this._flush === "function") {
        this._flush(function(er, data) {
          done(_this, er, data);
        });
      } else {
        done(this, null, null);
      }
    }
    Transform.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      throw new Error("_transform() is not implemented");
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n) {
      var ts = this._transformState;
      if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        ts.needTransform = true;
      }
    };
    Transform.prototype._destroy = function(err, cb) {
      var _this2 = this;
      Duplex.prototype._destroy.call(this, err, function(err2) {
        cb(err2);
        _this2.emit("close");
      });
    };
    function done(stream, er, data) {
      if (er) return stream.emit("error", er);
      if (data != null)
        stream.push(data);
      if (stream._writableState.length) throw new Error("Calling transform done when ws.length != 0");
      if (stream._transformState.transforming) throw new Error("Calling transform done when still transforming");
      return stream.push(null);
    }
  }
});

// node_modules/readable-stream/lib/_stream_passthrough.js
var require_stream_passthrough = __commonJS({
  "node_modules/readable-stream/lib/_stream_passthrough.js"(exports, module) {
    "use strict";
    module.exports = PassThrough;
    var Transform = require_stream_transform();
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    util.inherits(PassThrough, Transform);
    function PassThrough(options) {
      if (!(this instanceof PassThrough)) return new PassThrough(options);
      Transform.call(this, options);
    }
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// node_modules/readable-stream/readable.js
var require_readable = __commonJS({
  "node_modules/readable-stream/readable.js"(exports, module) {
    var Stream = __require("stream");
    if (process.env.READABLE_STREAM === "disable" && Stream) {
      module.exports = Stream;
      exports = module.exports = Stream.Readable;
      exports.Readable = Stream.Readable;
      exports.Writable = Stream.Writable;
      exports.Duplex = Stream.Duplex;
      exports.Transform = Stream.Transform;
      exports.PassThrough = Stream.PassThrough;
      exports.Stream = Stream;
    } else {
      exports = module.exports = require_stream_readable();
      exports.Stream = Stream || exports;
      exports.Readable = exports;
      exports.Writable = require_stream_writable();
      exports.Duplex = require_stream_duplex();
      exports.Transform = require_stream_transform();
      exports.PassThrough = require_stream_passthrough();
    }
  }
});

// node_modules/jszip/lib/support.js
var require_support = __commonJS({
  "node_modules/jszip/lib/support.js"(exports) {
    "use strict";
    exports.base64 = true;
    exports.array = true;
    exports.string = true;
    exports.arraybuffer = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
    exports.nodebuffer = typeof Buffer !== "undefined";
    exports.uint8array = typeof Uint8Array !== "undefined";
    if (typeof ArrayBuffer === "undefined") {
      exports.blob = false;
    } else {
      buffer = new ArrayBuffer(0);
      try {
        exports.blob = new Blob([buffer], {
          type: "application/zip"
        }).size === 0;
      } catch (e) {
        try {
          Builder = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder;
          builder = new Builder();
          builder.append(buffer);
          exports.blob = builder.getBlob("application/zip").size === 0;
        } catch (e2) {
          exports.blob = false;
        }
      }
    }
    var buffer;
    var Builder;
    var builder;
    try {
      exports.nodestream = !!require_readable().Readable;
    } catch (e) {
      exports.nodestream = false;
    }
  }
});

// node_modules/jszip/lib/base64.js
var require_base64 = __commonJS({
  "node_modules/jszip/lib/base64.js"(exports) {
    "use strict";
    var utils = require_utils();
    var support = require_support();
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    exports.encode = function(input) {
      var output = [];
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0, len = input.length, remainingBytes = len;
      var isArray = utils.getTypeOf(input) !== "string";
      while (i < input.length) {
        remainingBytes = len - i;
        if (!isArray) {
          chr1 = input.charCodeAt(i++);
          chr2 = i < len ? input.charCodeAt(i++) : 0;
          chr3 = i < len ? input.charCodeAt(i++) : 0;
        } else {
          chr1 = input[i++];
          chr2 = i < len ? input[i++] : 0;
          chr3 = i < len ? input[i++] : 0;
        }
        enc1 = chr1 >> 2;
        enc2 = (chr1 & 3) << 4 | chr2 >> 4;
        enc3 = remainingBytes > 1 ? (chr2 & 15) << 2 | chr3 >> 6 : 64;
        enc4 = remainingBytes > 2 ? chr3 & 63 : 64;
        output.push(_keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4));
      }
      return output.join("");
    };
    exports.decode = function(input) {
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0, resultIndex = 0;
      var dataUrlPrefix = "data:";
      if (input.substr(0, dataUrlPrefix.length) === dataUrlPrefix) {
        throw new Error("Invalid base64 input, it looks like a data url.");
      }
      input = input.replace(/[^A-Za-z0-9+/=]/g, "");
      var totalLength = input.length * 3 / 4;
      if (input.charAt(input.length - 1) === _keyStr.charAt(64)) {
        totalLength--;
      }
      if (input.charAt(input.length - 2) === _keyStr.charAt(64)) {
        totalLength--;
      }
      if (totalLength % 1 !== 0) {
        throw new Error("Invalid base64 input, bad content length.");
      }
      var output;
      if (support.uint8array) {
        output = new Uint8Array(totalLength | 0);
      } else {
        output = new Array(totalLength | 0);
      }
      while (i < input.length) {
        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));
        chr1 = enc1 << 2 | enc2 >> 4;
        chr2 = (enc2 & 15) << 4 | enc3 >> 2;
        chr3 = (enc3 & 3) << 6 | enc4;
        output[resultIndex++] = chr1;
        if (enc3 !== 64) {
          output[resultIndex++] = chr2;
        }
        if (enc4 !== 64) {
          output[resultIndex++] = chr3;
        }
      }
      return output;
    };
  }
});

// node_modules/jszip/lib/nodejsUtils.js
var require_nodejsUtils = __commonJS({
  "node_modules/jszip/lib/nodejsUtils.js"(exports, module) {
    "use strict";
    module.exports = {
      /**
       * True if this is running in Nodejs, will be undefined in a browser.
       * In a browser, browserify won't include this file and the whole module
       * will be resolved an empty object.
       */
      isNode: typeof Buffer !== "undefined",
      /**
       * Create a new nodejs Buffer from an existing content.
       * @param {Object} data the data to pass to the constructor.
       * @param {String} encoding the encoding to use.
       * @return {Buffer} a new Buffer.
       */
      newBufferFrom: function(data, encoding) {
        if (Buffer.from && Buffer.from !== Uint8Array.from) {
          return Buffer.from(data, encoding);
        } else {
          if (typeof data === "number") {
            throw new Error('The "data" argument must not be a number');
          }
          return new Buffer(data, encoding);
        }
      },
      /**
       * Create a new nodejs Buffer with the specified size.
       * @param {Integer} size the size of the buffer.
       * @return {Buffer} a new Buffer.
       */
      allocBuffer: function(size) {
        if (Buffer.alloc) {
          return Buffer.alloc(size);
        } else {
          var buf = new Buffer(size);
          buf.fill(0);
          return buf;
        }
      },
      /**
       * Find out if an object is a Buffer.
       * @param {Object} b the object to test.
       * @return {Boolean} true if the object is a Buffer, false otherwise.
       */
      isBuffer: function(b) {
        return Buffer.isBuffer(b);
      },
      isStream: function(obj) {
        return obj && typeof obj.on === "function" && typeof obj.pause === "function" && typeof obj.resume === "function";
      }
    };
  }
});

// node_modules/immediate/lib/index.js
var require_lib = __commonJS({
  "node_modules/immediate/lib/index.js"(exports, module) {
    "use strict";
    var Mutation = global.MutationObserver || global.WebKitMutationObserver;
    var scheduleDrain;
    if (process.browser) {
      if (Mutation) {
        called = 0;
        observer = new Mutation(nextTick);
        element = global.document.createTextNode("");
        observer.observe(element, {
          characterData: true
        });
        scheduleDrain = function() {
          element.data = called = ++called % 2;
        };
      } else if (!global.setImmediate && typeof global.MessageChannel !== "undefined") {
        channel = new global.MessageChannel();
        channel.port1.onmessage = nextTick;
        scheduleDrain = function() {
          channel.port2.postMessage(0);
        };
      } else if ("document" in global && "onreadystatechange" in global.document.createElement("script")) {
        scheduleDrain = function() {
          var scriptEl = global.document.createElement("script");
          scriptEl.onreadystatechange = function() {
            nextTick();
            scriptEl.onreadystatechange = null;
            scriptEl.parentNode.removeChild(scriptEl);
            scriptEl = null;
          };
          global.document.documentElement.appendChild(scriptEl);
        };
      } else {
        scheduleDrain = function() {
          setTimeout(nextTick, 0);
        };
      }
    } else {
      scheduleDrain = function() {
        process.nextTick(nextTick);
      };
    }
    var called;
    var observer;
    var element;
    var channel;
    var draining;
    var queue = [];
    function nextTick() {
      draining = true;
      var i, oldQueue;
      var len = queue.length;
      while (len) {
        oldQueue = queue;
        queue = [];
        i = -1;
        while (++i < len) {
          oldQueue[i]();
        }
        len = queue.length;
      }
      draining = false;
    }
    module.exports = immediate;
    function immediate(task) {
      if (queue.push(task) === 1 && !draining) {
        scheduleDrain();
      }
    }
  }
});

// node_modules/lie/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/lie/lib/index.js"(exports, module) {
    "use strict";
    var immediate = require_lib();
    function INTERNAL() {
    }
    var handlers = {};
    var REJECTED = ["REJECTED"];
    var FULFILLED = ["FULFILLED"];
    var PENDING = ["PENDING"];
    if (!process.browser) {
      UNHANDLED = ["UNHANDLED"];
    }
    var UNHANDLED;
    module.exports = Promise2;
    function Promise2(resolver) {
      if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function");
      }
      this.state = PENDING;
      this.queue = [];
      this.outcome = void 0;
      if (!process.browser) {
        this.handled = UNHANDLED;
      }
      if (resolver !== INTERNAL) {
        safelyResolveThenable(this, resolver);
      }
    }
    Promise2.prototype.finally = function(callback) {
      if (typeof callback !== "function") {
        return this;
      }
      var p = this.constructor;
      return this.then(resolve2, reject2);
      function resolve2(value) {
        function yes() {
          return value;
        }
        return p.resolve(callback()).then(yes);
      }
      function reject2(reason) {
        function no() {
          throw reason;
        }
        return p.resolve(callback()).then(no);
      }
    };
    Promise2.prototype.catch = function(onRejected) {
      return this.then(null, onRejected);
    };
    Promise2.prototype.then = function(onFulfilled, onRejected) {
      if (typeof onFulfilled !== "function" && this.state === FULFILLED || typeof onRejected !== "function" && this.state === REJECTED) {
        return this;
      }
      var promise = new this.constructor(INTERNAL);
      if (!process.browser) {
        if (this.handled === UNHANDLED) {
          this.handled = null;
        }
      }
      if (this.state !== PENDING) {
        var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
        unwrap(promise, resolver, this.outcome);
      } else {
        this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
      }
      return promise;
    };
    function QueueItem(promise, onFulfilled, onRejected) {
      this.promise = promise;
      if (typeof onFulfilled === "function") {
        this.onFulfilled = onFulfilled;
        this.callFulfilled = this.otherCallFulfilled;
      }
      if (typeof onRejected === "function") {
        this.onRejected = onRejected;
        this.callRejected = this.otherCallRejected;
      }
    }
    QueueItem.prototype.callFulfilled = function(value) {
      handlers.resolve(this.promise, value);
    };
    QueueItem.prototype.otherCallFulfilled = function(value) {
      unwrap(this.promise, this.onFulfilled, value);
    };
    QueueItem.prototype.callRejected = function(value) {
      handlers.reject(this.promise, value);
    };
    QueueItem.prototype.otherCallRejected = function(value) {
      unwrap(this.promise, this.onRejected, value);
    };
    function unwrap(promise, func, value) {
      immediate(function() {
        var returnValue;
        try {
          returnValue = func(value);
        } catch (e) {
          return handlers.reject(promise, e);
        }
        if (returnValue === promise) {
          handlers.reject(promise, new TypeError("Cannot resolve promise with itself"));
        } else {
          handlers.resolve(promise, returnValue);
        }
      });
    }
    handlers.resolve = function(self2, value) {
      var result = tryCatch(getThen, value);
      if (result.status === "error") {
        return handlers.reject(self2, result.value);
      }
      var thenable = result.value;
      if (thenable) {
        safelyResolveThenable(self2, thenable);
      } else {
        self2.state = FULFILLED;
        self2.outcome = value;
        var i = -1;
        var len = self2.queue.length;
        while (++i < len) {
          self2.queue[i].callFulfilled(value);
        }
      }
      return self2;
    };
    handlers.reject = function(self2, error) {
      self2.state = REJECTED;
      self2.outcome = error;
      if (!process.browser) {
        if (self2.handled === UNHANDLED) {
          immediate(function() {
            if (self2.handled === UNHANDLED) {
              process.emit("unhandledRejection", error, self2);
            }
          });
        }
      }
      var i = -1;
      var len = self2.queue.length;
      while (++i < len) {
        self2.queue[i].callRejected(error);
      }
      return self2;
    };
    function getThen(obj) {
      var then = obj && obj.then;
      if (obj && (typeof obj === "object" || typeof obj === "function") && typeof then === "function") {
        return function appyThen() {
          then.apply(obj, arguments);
        };
      }
    }
    function safelyResolveThenable(self2, thenable) {
      var called = false;
      function onError(value) {
        if (called) {
          return;
        }
        called = true;
        handlers.reject(self2, value);
      }
      function onSuccess(value) {
        if (called) {
          return;
        }
        called = true;
        handlers.resolve(self2, value);
      }
      function tryToUnwrap() {
        thenable(onSuccess, onError);
      }
      var result = tryCatch(tryToUnwrap);
      if (result.status === "error") {
        onError(result.value);
      }
    }
    function tryCatch(func, value) {
      var out = {};
      try {
        out.value = func(value);
        out.status = "success";
      } catch (e) {
        out.status = "error";
        out.value = e;
      }
      return out;
    }
    Promise2.resolve = resolve;
    function resolve(value) {
      if (value instanceof this) {
        return value;
      }
      return handlers.resolve(new this(INTERNAL), value);
    }
    Promise2.reject = reject;
    function reject(reason) {
      var promise = new this(INTERNAL);
      return handlers.reject(promise, reason);
    }
    Promise2.all = all;
    function all(iterable) {
      var self2 = this;
      if (Object.prototype.toString.call(iterable) !== "[object Array]") {
        return this.reject(new TypeError("must be an array"));
      }
      var len = iterable.length;
      var called = false;
      if (!len) {
        return this.resolve([]);
      }
      var values = new Array(len);
      var resolved = 0;
      var i = -1;
      var promise = new this(INTERNAL);
      while (++i < len) {
        allResolver(iterable[i], i);
      }
      return promise;
      function allResolver(value, i2) {
        self2.resolve(value).then(resolveFromAll, function(error) {
          if (!called) {
            called = true;
            handlers.reject(promise, error);
          }
        });
        function resolveFromAll(outValue) {
          values[i2] = outValue;
          if (++resolved === len && !called) {
            called = true;
            handlers.resolve(promise, values);
          }
        }
      }
    }
    Promise2.race = race;
    function race(iterable) {
      var self2 = this;
      if (Object.prototype.toString.call(iterable) !== "[object Array]") {
        return this.reject(new TypeError("must be an array"));
      }
      var len = iterable.length;
      var called = false;
      if (!len) {
        return this.resolve([]);
      }
      var i = -1;
      var promise = new this(INTERNAL);
      while (++i < len) {
        resolver(iterable[i]);
      }
      return promise;
      function resolver(value) {
        self2.resolve(value).then(function(response) {
          if (!called) {
            called = true;
            handlers.resolve(promise, response);
          }
        }, function(error) {
          if (!called) {
            called = true;
            handlers.reject(promise, error);
          }
        });
      }
    }
  }
});

// node_modules/jszip/lib/external.js
var require_external = __commonJS({
  "node_modules/jszip/lib/external.js"(exports, module) {
    "use strict";
    var ES6Promise = null;
    if (typeof Promise !== "undefined") {
      ES6Promise = Promise;
    } else {
      ES6Promise = require_lib2();
    }
    module.exports = {
      Promise: ES6Promise
    };
  }
});

// node_modules/setimmediate/setImmediate.js
var require_setImmediate = __commonJS({
  "node_modules/setimmediate/setImmediate.js"(exports) {
    (function(global2, undefined2) {
      "use strict";
      if (global2.setImmediate) {
        return;
      }
      var nextHandle = 1;
      var tasksByHandle = {};
      var currentlyRunningATask = false;
      var doc = global2.document;
      var registerImmediate;
      function setImmediate2(callback) {
        if (typeof callback !== "function") {
          callback = new Function("" + callback);
        }
        var args = new Array(arguments.length - 1);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
        }
        var task = { callback, args };
        tasksByHandle[nextHandle] = task;
        registerImmediate(nextHandle);
        return nextHandle++;
      }
      function clearImmediate(handle) {
        delete tasksByHandle[handle];
      }
      function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
          case 0:
            callback();
            break;
          case 1:
            callback(args[0]);
            break;
          case 2:
            callback(args[0], args[1]);
            break;
          case 3:
            callback(args[0], args[1], args[2]);
            break;
          default:
            callback.apply(undefined2, args);
            break;
        }
      }
      function runIfPresent(handle) {
        if (currentlyRunningATask) {
          setTimeout(runIfPresent, 0, handle);
        } else {
          var task = tasksByHandle[handle];
          if (task) {
            currentlyRunningATask = true;
            try {
              run(task);
            } finally {
              clearImmediate(handle);
              currentlyRunningATask = false;
            }
          }
        }
      }
      function installNextTickImplementation() {
        registerImmediate = function(handle) {
          process.nextTick(function() {
            runIfPresent(handle);
          });
        };
      }
      function canUsePostMessage() {
        if (global2.postMessage && !global2.importScripts) {
          var postMessageIsAsynchronous = true;
          var oldOnMessage = global2.onmessage;
          global2.onmessage = function() {
            postMessageIsAsynchronous = false;
          };
          global2.postMessage("", "*");
          global2.onmessage = oldOnMessage;
          return postMessageIsAsynchronous;
        }
      }
      function installPostMessageImplementation() {
        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
          if (event.source === global2 && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
            runIfPresent(+event.data.slice(messagePrefix.length));
          }
        };
        if (global2.addEventListener) {
          global2.addEventListener("message", onGlobalMessage, false);
        } else {
          global2.attachEvent("onmessage", onGlobalMessage);
        }
        registerImmediate = function(handle) {
          global2.postMessage(messagePrefix + handle, "*");
        };
      }
      function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
          var handle = event.data;
          runIfPresent(handle);
        };
        registerImmediate = function(handle) {
          channel.port2.postMessage(handle);
        };
      }
      function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
          var script = doc.createElement("script");
          script.onreadystatechange = function() {
            runIfPresent(handle);
            script.onreadystatechange = null;
            html.removeChild(script);
            script = null;
          };
          html.appendChild(script);
        };
      }
      function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
          setTimeout(runIfPresent, 0, handle);
        };
      }
      var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global2);
      attachTo = attachTo && attachTo.setTimeout ? attachTo : global2;
      if ({}.toString.call(global2.process) === "[object process]") {
        installNextTickImplementation();
      } else if (canUsePostMessage()) {
        installPostMessageImplementation();
      } else if (global2.MessageChannel) {
        installMessageChannelImplementation();
      } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        installReadyStateChangeImplementation();
      } else {
        installSetTimeoutImplementation();
      }
      attachTo.setImmediate = setImmediate2;
      attachTo.clearImmediate = clearImmediate;
    })(typeof self === "undefined" ? typeof global === "undefined" ? exports : global : self);
  }
});

// node_modules/jszip/lib/utils.js
var require_utils = __commonJS({
  "node_modules/jszip/lib/utils.js"(exports) {
    "use strict";
    var support = require_support();
    var base64 = require_base64();
    var nodejsUtils = require_nodejsUtils();
    var external = require_external();
    require_setImmediate();
    function string2binary(str) {
      var result = null;
      if (support.uint8array) {
        result = new Uint8Array(str.length);
      } else {
        result = new Array(str.length);
      }
      return stringToArrayLike(str, result);
    }
    exports.newBlob = function(part, type) {
      exports.checkSupport("blob");
      try {
        return new Blob([part], {
          type
        });
      } catch (e) {
        try {
          var Builder = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder;
          var builder = new Builder();
          builder.append(part);
          return builder.getBlob(type);
        } catch (e2) {
          throw new Error("Bug : can't construct the Blob.");
        }
      }
    };
    function identity(input) {
      return input;
    }
    function stringToArrayLike(str, array) {
      for (var i = 0; i < str.length; ++i) {
        array[i] = str.charCodeAt(i) & 255;
      }
      return array;
    }
    var arrayToStringHelper = {
      /**
       * Transform an array of int into a string, chunk by chunk.
       * See the performances notes on arrayLikeToString.
       * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
       * @param {String} type the type of the array.
       * @param {Integer} chunk the chunk size.
       * @return {String} the resulting string.
       * @throws Error if the chunk is too big for the stack.
       */
      stringifyByChunk: function(array, type, chunk) {
        var result = [], k = 0, len = array.length;
        if (len <= chunk) {
          return String.fromCharCode.apply(null, array);
        }
        while (k < len) {
          if (type === "array" || type === "nodebuffer") {
            result.push(String.fromCharCode.apply(null, array.slice(k, Math.min(k + chunk, len))));
          } else {
            result.push(String.fromCharCode.apply(null, array.subarray(k, Math.min(k + chunk, len))));
          }
          k += chunk;
        }
        return result.join("");
      },
      /**
       * Call String.fromCharCode on every item in the array.
       * This is the naive implementation, which generate A LOT of intermediate string.
       * This should be used when everything else fail.
       * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
       * @return {String} the result.
       */
      stringifyByChar: function(array) {
        var resultStr = "";
        for (var i = 0; i < array.length; i++) {
          resultStr += String.fromCharCode(array[i]);
        }
        return resultStr;
      },
      applyCanBeUsed: {
        /**
         * true if the browser accepts to use String.fromCharCode on Uint8Array
         */
        uint8array: (function() {
          try {
            return support.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch (e) {
            return false;
          }
        })(),
        /**
         * true if the browser accepts to use String.fromCharCode on nodejs Buffer.
         */
        nodebuffer: (function() {
          try {
            return support.nodebuffer && String.fromCharCode.apply(null, nodejsUtils.allocBuffer(1)).length === 1;
          } catch (e) {
            return false;
          }
        })()
      }
    };
    function arrayLikeToString(array) {
      var chunk = 65536, type = exports.getTypeOf(array), canUseApply = true;
      if (type === "uint8array") {
        canUseApply = arrayToStringHelper.applyCanBeUsed.uint8array;
      } else if (type === "nodebuffer") {
        canUseApply = arrayToStringHelper.applyCanBeUsed.nodebuffer;
      }
      if (canUseApply) {
        while (chunk > 1) {
          try {
            return arrayToStringHelper.stringifyByChunk(array, type, chunk);
          } catch (e) {
            chunk = Math.floor(chunk / 2);
          }
        }
      }
      return arrayToStringHelper.stringifyByChar(array);
    }
    exports.applyFromCharCode = arrayLikeToString;
    function arrayLikeToArrayLike(arrayFrom, arrayTo) {
      for (var i = 0; i < arrayFrom.length; i++) {
        arrayTo[i] = arrayFrom[i];
      }
      return arrayTo;
    }
    var transform = {};
    transform["string"] = {
      "string": identity,
      "array": function(input) {
        return stringToArrayLike(input, new Array(input.length));
      },
      "arraybuffer": function(input) {
        return transform["string"]["uint8array"](input).buffer;
      },
      "uint8array": function(input) {
        return stringToArrayLike(input, new Uint8Array(input.length));
      },
      "nodebuffer": function(input) {
        return stringToArrayLike(input, nodejsUtils.allocBuffer(input.length));
      }
    };
    transform["array"] = {
      "string": arrayLikeToString,
      "array": identity,
      "arraybuffer": function(input) {
        return new Uint8Array(input).buffer;
      },
      "uint8array": function(input) {
        return new Uint8Array(input);
      },
      "nodebuffer": function(input) {
        return nodejsUtils.newBufferFrom(input);
      }
    };
    transform["arraybuffer"] = {
      "string": function(input) {
        return arrayLikeToString(new Uint8Array(input));
      },
      "array": function(input) {
        return arrayLikeToArrayLike(new Uint8Array(input), new Array(input.byteLength));
      },
      "arraybuffer": identity,
      "uint8array": function(input) {
        return new Uint8Array(input);
      },
      "nodebuffer": function(input) {
        return nodejsUtils.newBufferFrom(new Uint8Array(input));
      }
    };
    transform["uint8array"] = {
      "string": arrayLikeToString,
      "array": function(input) {
        return arrayLikeToArrayLike(input, new Array(input.length));
      },
      "arraybuffer": function(input) {
        return input.buffer;
      },
      "uint8array": identity,
      "nodebuffer": function(input) {
        return nodejsUtils.newBufferFrom(input);
      }
    };
    transform["nodebuffer"] = {
      "string": arrayLikeToString,
      "array": function(input) {
        return arrayLikeToArrayLike(input, new Array(input.length));
      },
      "arraybuffer": function(input) {
        return transform["nodebuffer"]["uint8array"](input).buffer;
      },
      "uint8array": function(input) {
        return arrayLikeToArrayLike(input, new Uint8Array(input.length));
      },
      "nodebuffer": identity
    };
    exports.transformTo = function(outputType, input) {
      if (!input) {
        input = "";
      }
      if (!outputType) {
        return input;
      }
      exports.checkSupport(outputType);
      var inputType = exports.getTypeOf(input);
      var result = transform[inputType][outputType](input);
      return result;
    };
    exports.resolve = function(path) {
      var parts = path.split("/");
      var result = [];
      for (var index = 0; index < parts.length; index++) {
        var part = parts[index];
        if (part === "." || part === "" && index !== 0 && index !== parts.length - 1) {
          continue;
        } else if (part === "..") {
          result.pop();
        } else {
          result.push(part);
        }
      }
      return result.join("/");
    };
    exports.getTypeOf = function(input) {
      if (typeof input === "string") {
        return "string";
      }
      if (Object.prototype.toString.call(input) === "[object Array]") {
        return "array";
      }
      if (support.nodebuffer && nodejsUtils.isBuffer(input)) {
        return "nodebuffer";
      }
      if (support.uint8array && input instanceof Uint8Array) {
        return "uint8array";
      }
      if (support.arraybuffer && input instanceof ArrayBuffer) {
        return "arraybuffer";
      }
    };
    exports.checkSupport = function(type) {
      var supported = support[type.toLowerCase()];
      if (!supported) {
        throw new Error(type + " is not supported by this platform");
      }
    };
    exports.MAX_VALUE_16BITS = 65535;
    exports.MAX_VALUE_32BITS = -1;
    exports.pretty = function(str) {
      var res = "", code, i;
      for (i = 0; i < (str || "").length; i++) {
        code = str.charCodeAt(i);
        res += "\\x" + (code < 16 ? "0" : "") + code.toString(16).toUpperCase();
      }
      return res;
    };
    exports.delay = function(callback, args, self2) {
      setImmediate(function() {
        callback.apply(self2 || null, args || []);
      });
    };
    exports.inherits = function(ctor, superCtor) {
      var Obj = function() {
      };
      Obj.prototype = superCtor.prototype;
      ctor.prototype = new Obj();
    };
    exports.extend = function() {
      var result = {}, i, attr;
      for (i = 0; i < arguments.length; i++) {
        for (attr in arguments[i]) {
          if (Object.prototype.hasOwnProperty.call(arguments[i], attr) && typeof result[attr] === "undefined") {
            result[attr] = arguments[i][attr];
          }
        }
      }
      return result;
    };
    exports.prepareContent = function(name, inputData, isBinary, isOptimizedBinaryString, isBase64) {
      var promise = external.Promise.resolve(inputData).then(function(data) {
        var isBlob = support.blob && (data instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(data)) !== -1);
        if (isBlob && typeof FileReader !== "undefined") {
          return new external.Promise(function(resolve, reject) {
            var reader = new FileReader();
            reader.onload = function(e) {
              resolve(e.target.result);
            };
            reader.onerror = function(e) {
              reject(e.target.error);
            };
            reader.readAsArrayBuffer(data);
          });
        } else {
          return data;
        }
      });
      return promise.then(function(data) {
        var dataType = exports.getTypeOf(data);
        if (!dataType) {
          return external.Promise.reject(
            new Error("Can't read the data of '" + name + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?")
          );
        }
        if (dataType === "arraybuffer") {
          data = exports.transformTo("uint8array", data);
        } else if (dataType === "string") {
          if (isBase64) {
            data = base64.decode(data);
          } else if (isBinary) {
            if (isOptimizedBinaryString !== true) {
              data = string2binary(data);
            }
          }
        }
        return data;
      });
    };
  }
});

// node_modules/jszip/lib/stream/GenericWorker.js
var require_GenericWorker = __commonJS({
  "node_modules/jszip/lib/stream/GenericWorker.js"(exports, module) {
    "use strict";
    function GenericWorker(name) {
      this.name = name || "default";
      this.streamInfo = {};
      this.generatedError = null;
      this.extraStreamInfo = {};
      this.isPaused = true;
      this.isFinished = false;
      this.isLocked = false;
      this._listeners = {
        "data": [],
        "end": [],
        "error": []
      };
      this.previous = null;
    }
    GenericWorker.prototype = {
      /**
       * Push a chunk to the next workers.
       * @param {Object} chunk the chunk to push
       */
      push: function(chunk) {
        this.emit("data", chunk);
      },
      /**
       * End the stream.
       * @return {Boolean} true if this call ended the worker, false otherwise.
       */
      end: function() {
        if (this.isFinished) {
          return false;
        }
        this.flush();
        try {
          this.emit("end");
          this.cleanUp();
          this.isFinished = true;
        } catch (e) {
          this.emit("error", e);
        }
        return true;
      },
      /**
       * End the stream with an error.
       * @param {Error} e the error which caused the premature end.
       * @return {Boolean} true if this call ended the worker with an error, false otherwise.
       */
      error: function(e) {
        if (this.isFinished) {
          return false;
        }
        if (this.isPaused) {
          this.generatedError = e;
        } else {
          this.isFinished = true;
          this.emit("error", e);
          if (this.previous) {
            this.previous.error(e);
          }
          this.cleanUp();
        }
        return true;
      },
      /**
       * Add a callback on an event.
       * @param {String} name the name of the event (data, end, error)
       * @param {Function} listener the function to call when the event is triggered
       * @return {GenericWorker} the current object for chainability
       */
      on: function(name, listener) {
        this._listeners[name].push(listener);
        return this;
      },
      /**
       * Clean any references when a worker is ending.
       */
      cleanUp: function() {
        this.streamInfo = this.generatedError = this.extraStreamInfo = null;
        this._listeners = [];
      },
      /**
       * Trigger an event. This will call registered callback with the provided arg.
       * @param {String} name the name of the event (data, end, error)
       * @param {Object} arg the argument to call the callback with.
       */
      emit: function(name, arg) {
        if (this._listeners[name]) {
          for (var i = 0; i < this._listeners[name].length; i++) {
            this._listeners[name][i].call(this, arg);
          }
        }
      },
      /**
       * Chain a worker with an other.
       * @param {Worker} next the worker receiving events from the current one.
       * @return {worker} the next worker for chainability
       */
      pipe: function(next) {
        return next.registerPrevious(this);
      },
      /**
       * Same as `pipe` in the other direction.
       * Using an API with `pipe(next)` is very easy.
       * Implementing the API with the point of view of the next one registering
       * a source is easier, see the ZipFileWorker.
       * @param {Worker} previous the previous worker, sending events to this one
       * @return {Worker} the current worker for chainability
       */
      registerPrevious: function(previous) {
        if (this.isLocked) {
          throw new Error("The stream '" + this + "' has already been used.");
        }
        this.streamInfo = previous.streamInfo;
        this.mergeStreamInfo();
        this.previous = previous;
        var self2 = this;
        previous.on("data", function(chunk) {
          self2.processChunk(chunk);
        });
        previous.on("end", function() {
          self2.end();
        });
        previous.on("error", function(e) {
          self2.error(e);
        });
        return this;
      },
      /**
       * Pause the stream so it doesn't send events anymore.
       * @return {Boolean} true if this call paused the worker, false otherwise.
       */
      pause: function() {
        if (this.isPaused || this.isFinished) {
          return false;
        }
        this.isPaused = true;
        if (this.previous) {
          this.previous.pause();
        }
        return true;
      },
      /**
       * Resume a paused stream.
       * @return {Boolean} true if this call resumed the worker, false otherwise.
       */
      resume: function() {
        if (!this.isPaused || this.isFinished) {
          return false;
        }
        this.isPaused = false;
        var withError = false;
        if (this.generatedError) {
          this.error(this.generatedError);
          withError = true;
        }
        if (this.previous) {
          this.previous.resume();
        }
        return !withError;
      },
      /**
       * Flush any remaining bytes as the stream is ending.
       */
      flush: function() {
      },
      /**
       * Process a chunk. This is usually the method overridden.
       * @param {Object} chunk the chunk to process.
       */
      processChunk: function(chunk) {
        this.push(chunk);
      },
      /**
       * Add a key/value to be added in the workers chain streamInfo once activated.
       * @param {String} key the key to use
       * @param {Object} value the associated value
       * @return {Worker} the current worker for chainability
       */
      withStreamInfo: function(key, value) {
        this.extraStreamInfo[key] = value;
        this.mergeStreamInfo();
        return this;
      },
      /**
       * Merge this worker's streamInfo into the chain's streamInfo.
       */
      mergeStreamInfo: function() {
        for (var key in this.extraStreamInfo) {
          if (!Object.prototype.hasOwnProperty.call(this.extraStreamInfo, key)) {
            continue;
          }
          this.streamInfo[key] = this.extraStreamInfo[key];
        }
      },
      /**
       * Lock the stream to prevent further updates on the workers chain.
       * After calling this method, all calls to pipe will fail.
       */
      lock: function() {
        if (this.isLocked) {
          throw new Error("The stream '" + this + "' has already been used.");
        }
        this.isLocked = true;
        if (this.previous) {
          this.previous.lock();
        }
      },
      /**
       *
       * Pretty print the workers chain.
       */
      toString: function() {
        var me = "Worker " + this.name;
        if (this.previous) {
          return this.previous + " -> " + me;
        } else {
          return me;
        }
      }
    };
    module.exports = GenericWorker;
  }
});

// node_modules/jszip/lib/utf8.js
var require_utf8 = __commonJS({
  "node_modules/jszip/lib/utf8.js"(exports) {
    "use strict";
    var utils = require_utils();
    var support = require_support();
    var nodejsUtils = require_nodejsUtils();
    var GenericWorker = require_GenericWorker();
    var _utf8len = new Array(256);
    for (i = 0; i < 256; i++) {
      _utf8len[i] = i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1;
    }
    var i;
    _utf8len[254] = _utf8len[254] = 1;
    var string2buf = function(str) {
      var buf, c, c2, m_pos, i2, str_len = str.length, buf_len = 0;
      for (m_pos = 0; m_pos < str_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
      }
      if (support.uint8array) {
        buf = new Uint8Array(buf_len);
      } else {
        buf = new Array(buf_len);
      }
      for (i2 = 0, m_pos = 0; i2 < buf_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        if (c < 128) {
          buf[i2++] = c;
        } else if (c < 2048) {
          buf[i2++] = 192 | c >>> 6;
          buf[i2++] = 128 | c & 63;
        } else if (c < 65536) {
          buf[i2++] = 224 | c >>> 12;
          buf[i2++] = 128 | c >>> 6 & 63;
          buf[i2++] = 128 | c & 63;
        } else {
          buf[i2++] = 240 | c >>> 18;
          buf[i2++] = 128 | c >>> 12 & 63;
          buf[i2++] = 128 | c >>> 6 & 63;
          buf[i2++] = 128 | c & 63;
        }
      }
      return buf;
    };
    var utf8border = function(buf, max) {
      var pos;
      max = max || buf.length;
      if (max > buf.length) {
        max = buf.length;
      }
      pos = max - 1;
      while (pos >= 0 && (buf[pos] & 192) === 128) {
        pos--;
      }
      if (pos < 0) {
        return max;
      }
      if (pos === 0) {
        return max;
      }
      return pos + _utf8len[buf[pos]] > max ? pos : max;
    };
    var buf2string = function(buf) {
      var i2, out, c, c_len;
      var len = buf.length;
      var utf16buf = new Array(len * 2);
      for (out = 0, i2 = 0; i2 < len; ) {
        c = buf[i2++];
        if (c < 128) {
          utf16buf[out++] = c;
          continue;
        }
        c_len = _utf8len[c];
        if (c_len > 4) {
          utf16buf[out++] = 65533;
          i2 += c_len - 1;
          continue;
        }
        c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
        while (c_len > 1 && i2 < len) {
          c = c << 6 | buf[i2++] & 63;
          c_len--;
        }
        if (c_len > 1) {
          utf16buf[out++] = 65533;
          continue;
        }
        if (c < 65536) {
          utf16buf[out++] = c;
        } else {
          c -= 65536;
          utf16buf[out++] = 55296 | c >> 10 & 1023;
          utf16buf[out++] = 56320 | c & 1023;
        }
      }
      if (utf16buf.length !== out) {
        if (utf16buf.subarray) {
          utf16buf = utf16buf.subarray(0, out);
        } else {
          utf16buf.length = out;
        }
      }
      return utils.applyFromCharCode(utf16buf);
    };
    exports.utf8encode = function utf8encode(str) {
      if (support.nodebuffer) {
        return nodejsUtils.newBufferFrom(str, "utf-8");
      }
      return string2buf(str);
    };
    exports.utf8decode = function utf8decode(buf) {
      if (support.nodebuffer) {
        return utils.transformTo("nodebuffer", buf).toString("utf-8");
      }
      buf = utils.transformTo(support.uint8array ? "uint8array" : "array", buf);
      return buf2string(buf);
    };
    function Utf8DecodeWorker() {
      GenericWorker.call(this, "utf-8 decode");
      this.leftOver = null;
    }
    utils.inherits(Utf8DecodeWorker, GenericWorker);
    Utf8DecodeWorker.prototype.processChunk = function(chunk) {
      var data = utils.transformTo(support.uint8array ? "uint8array" : "array", chunk.data);
      if (this.leftOver && this.leftOver.length) {
        if (support.uint8array) {
          var previousData = data;
          data = new Uint8Array(previousData.length + this.leftOver.length);
          data.set(this.leftOver, 0);
          data.set(previousData, this.leftOver.length);
        } else {
          data = this.leftOver.concat(data);
        }
        this.leftOver = null;
      }
      var nextBoundary = utf8border(data);
      var usableData = data;
      if (nextBoundary !== data.length) {
        if (support.uint8array) {
          usableData = data.subarray(0, nextBoundary);
          this.leftOver = data.subarray(nextBoundary, data.length);
        } else {
          usableData = data.slice(0, nextBoundary);
          this.leftOver = data.slice(nextBoundary, data.length);
        }
      }
      this.push({
        data: exports.utf8decode(usableData),
        meta: chunk.meta
      });
    };
    Utf8DecodeWorker.prototype.flush = function() {
      if (this.leftOver && this.leftOver.length) {
        this.push({
          data: exports.utf8decode(this.leftOver),
          meta: {}
        });
        this.leftOver = null;
      }
    };
    exports.Utf8DecodeWorker = Utf8DecodeWorker;
    function Utf8EncodeWorker() {
      GenericWorker.call(this, "utf-8 encode");
    }
    utils.inherits(Utf8EncodeWorker, GenericWorker);
    Utf8EncodeWorker.prototype.processChunk = function(chunk) {
      this.push({
        data: exports.utf8encode(chunk.data),
        meta: chunk.meta
      });
    };
    exports.Utf8EncodeWorker = Utf8EncodeWorker;
  }
});

// node_modules/jszip/lib/stream/ConvertWorker.js
var require_ConvertWorker = __commonJS({
  "node_modules/jszip/lib/stream/ConvertWorker.js"(exports, module) {
    "use strict";
    var GenericWorker = require_GenericWorker();
    var utils = require_utils();
    function ConvertWorker(destType) {
      GenericWorker.call(this, "ConvertWorker to " + destType);
      this.destType = destType;
    }
    utils.inherits(ConvertWorker, GenericWorker);
    ConvertWorker.prototype.processChunk = function(chunk) {
      this.push({
        data: utils.transformTo(this.destType, chunk.data),
        meta: chunk.meta
      });
    };
    module.exports = ConvertWorker;
  }
});

// node_modules/jszip/lib/nodejs/NodejsStreamOutputAdapter.js
var require_NodejsStreamOutputAdapter = __commonJS({
  "node_modules/jszip/lib/nodejs/NodejsStreamOutputAdapter.js"(exports, module) {
    "use strict";
    var Readable = require_readable().Readable;
    var utils = require_utils();
    utils.inherits(NodejsStreamOutputAdapter, Readable);
    function NodejsStreamOutputAdapter(helper, options, updateCb) {
      Readable.call(this, options);
      this._helper = helper;
      var self2 = this;
      helper.on("data", function(data, meta) {
        if (!self2.push(data)) {
          self2._helper.pause();
        }
        if (updateCb) {
          updateCb(meta);
        }
      }).on("error", function(e) {
        self2.emit("error", e);
      }).on("end", function() {
        self2.push(null);
      });
    }
    NodejsStreamOutputAdapter.prototype._read = function() {
      this._helper.resume();
    };
    module.exports = NodejsStreamOutputAdapter;
  }
});

// node_modules/jszip/lib/stream/StreamHelper.js
var require_StreamHelper = __commonJS({
  "node_modules/jszip/lib/stream/StreamHelper.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var ConvertWorker = require_ConvertWorker();
    var GenericWorker = require_GenericWorker();
    var base64 = require_base64();
    var support = require_support();
    var external = require_external();
    var NodejsStreamOutputAdapter = null;
    if (support.nodestream) {
      try {
        NodejsStreamOutputAdapter = require_NodejsStreamOutputAdapter();
      } catch (e) {
      }
    }
    function transformZipOutput(type, content, mimeType) {
      switch (type) {
        case "blob":
          return utils.newBlob(utils.transformTo("arraybuffer", content), mimeType);
        case "base64":
          return base64.encode(content);
        default:
          return utils.transformTo(type, content);
      }
    }
    function concat(type, dataArray) {
      var i, index = 0, res = null, totalLength = 0;
      for (i = 0; i < dataArray.length; i++) {
        totalLength += dataArray[i].length;
      }
      switch (type) {
        case "string":
          return dataArray.join("");
        case "array":
          return Array.prototype.concat.apply([], dataArray);
        case "uint8array":
          res = new Uint8Array(totalLength);
          for (i = 0; i < dataArray.length; i++) {
            res.set(dataArray[i], index);
            index += dataArray[i].length;
          }
          return res;
        case "nodebuffer":
          return Buffer.concat(dataArray);
        default:
          throw new Error("concat : unsupported type '" + type + "'");
      }
    }
    function accumulate(helper, updateCallback) {
      return new external.Promise(function(resolve, reject) {
        var dataArray = [];
        var chunkType = helper._internalType, resultType = helper._outputType, mimeType = helper._mimeType;
        helper.on("data", function(data, meta) {
          dataArray.push(data);
          if (updateCallback) {
            updateCallback(meta);
          }
        }).on("error", function(err) {
          dataArray = [];
          reject(err);
        }).on("end", function() {
          try {
            var result = transformZipOutput(resultType, concat(chunkType, dataArray), mimeType);
            resolve(result);
          } catch (e) {
            reject(e);
          }
          dataArray = [];
        }).resume();
      });
    }
    function StreamHelper(worker, outputType, mimeType) {
      var internalType = outputType;
      switch (outputType) {
        case "blob":
        case "arraybuffer":
          internalType = "uint8array";
          break;
        case "base64":
          internalType = "string";
          break;
      }
      try {
        this._internalType = internalType;
        this._outputType = outputType;
        this._mimeType = mimeType;
        utils.checkSupport(internalType);
        this._worker = worker.pipe(new ConvertWorker(internalType));
        worker.lock();
      } catch (e) {
        this._worker = new GenericWorker("error");
        this._worker.error(e);
      }
    }
    StreamHelper.prototype = {
      /**
       * Listen a StreamHelper, accumulate its content and concatenate it into a
       * complete block.
       * @param {Function} updateCb the update callback.
       * @return Promise the promise for the accumulation.
       */
      accumulate: function(updateCb) {
        return accumulate(this, updateCb);
      },
      /**
       * Add a listener on an event triggered on a stream.
       * @param {String} evt the name of the event
       * @param {Function} fn the listener
       * @return {StreamHelper} the current helper.
       */
      on: function(evt, fn) {
        var self2 = this;
        if (evt === "data") {
          this._worker.on(evt, function(chunk) {
            fn.call(self2, chunk.data, chunk.meta);
          });
        } else {
          this._worker.on(evt, function() {
            utils.delay(fn, arguments, self2);
          });
        }
        return this;
      },
      /**
       * Resume the flow of chunks.
       * @return {StreamHelper} the current helper.
       */
      resume: function() {
        utils.delay(this._worker.resume, [], this._worker);
        return this;
      },
      /**
       * Pause the flow of chunks.
       * @return {StreamHelper} the current helper.
       */
      pause: function() {
        this._worker.pause();
        return this;
      },
      /**
       * Return a nodejs stream for this helper.
       * @param {Function} updateCb the update callback.
       * @return {NodejsStreamOutputAdapter} the nodejs stream.
       */
      toNodejsStream: function(updateCb) {
        utils.checkSupport("nodestream");
        if (this._outputType !== "nodebuffer") {
          throw new Error(this._outputType + " is not supported by this method");
        }
        return new NodejsStreamOutputAdapter(this, {
          objectMode: this._outputType !== "nodebuffer"
        }, updateCb);
      }
    };
    module.exports = StreamHelper;
  }
});

// node_modules/jszip/lib/defaults.js
var require_defaults = __commonJS({
  "node_modules/jszip/lib/defaults.js"(exports) {
    "use strict";
    exports.base64 = false;
    exports.binary = false;
    exports.dir = false;
    exports.createFolders = true;
    exports.date = null;
    exports.compression = null;
    exports.compressionOptions = null;
    exports.comment = null;
    exports.unixPermissions = null;
    exports.dosPermissions = null;
  }
});

// node_modules/jszip/lib/stream/DataWorker.js
var require_DataWorker = __commonJS({
  "node_modules/jszip/lib/stream/DataWorker.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var GenericWorker = require_GenericWorker();
    var DEFAULT_BLOCK_SIZE = 16 * 1024;
    function DataWorker(dataP) {
      GenericWorker.call(this, "DataWorker");
      var self2 = this;
      this.dataIsReady = false;
      this.index = 0;
      this.max = 0;
      this.data = null;
      this.type = "";
      this._tickScheduled = false;
      dataP.then(function(data) {
        self2.dataIsReady = true;
        self2.data = data;
        self2.max = data && data.length || 0;
        self2.type = utils.getTypeOf(data);
        if (!self2.isPaused) {
          self2._tickAndRepeat();
        }
      }, function(e) {
        self2.error(e);
      });
    }
    utils.inherits(DataWorker, GenericWorker);
    DataWorker.prototype.cleanUp = function() {
      GenericWorker.prototype.cleanUp.call(this);
      this.data = null;
    };
    DataWorker.prototype.resume = function() {
      if (!GenericWorker.prototype.resume.call(this)) {
        return false;
      }
      if (!this._tickScheduled && this.dataIsReady) {
        this._tickScheduled = true;
        utils.delay(this._tickAndRepeat, [], this);
      }
      return true;
    };
    DataWorker.prototype._tickAndRepeat = function() {
      this._tickScheduled = false;
      if (this.isPaused || this.isFinished) {
        return;
      }
      this._tick();
      if (!this.isFinished) {
        utils.delay(this._tickAndRepeat, [], this);
        this._tickScheduled = true;
      }
    };
    DataWorker.prototype._tick = function() {
      if (this.isPaused || this.isFinished) {
        return false;
      }
      var size = DEFAULT_BLOCK_SIZE;
      var data = null, nextIndex = Math.min(this.max, this.index + size);
      if (this.index >= this.max) {
        return this.end();
      } else {
        switch (this.type) {
          case "string":
            data = this.data.substring(this.index, nextIndex);
            break;
          case "uint8array":
            data = this.data.subarray(this.index, nextIndex);
            break;
          case "array":
          case "nodebuffer":
            data = this.data.slice(this.index, nextIndex);
            break;
        }
        this.index = nextIndex;
        return this.push({
          data,
          meta: {
            percent: this.max ? this.index / this.max * 100 : 0
          }
        });
      }
    };
    module.exports = DataWorker;
  }
});

// node_modules/jszip/lib/crc32.js
var require_crc32 = __commonJS({
  "node_modules/jszip/lib/crc32.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function makeTable() {
      var c, table = [];
      for (var n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++) {
          c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
        }
        table[n] = c;
      }
      return table;
    }
    var crcTable = makeTable();
    function crc32(crc, buf, len, pos) {
      var t = crcTable, end = pos + len;
      crc = crc ^ -1;
      for (var i = pos; i < end; i++) {
        crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
      }
      return crc ^ -1;
    }
    function crc32str(crc, str, len, pos) {
      var t = crcTable, end = pos + len;
      crc = crc ^ -1;
      for (var i = pos; i < end; i++) {
        crc = crc >>> 8 ^ t[(crc ^ str.charCodeAt(i)) & 255];
      }
      return crc ^ -1;
    }
    module.exports = function crc32wrapper(input, crc) {
      if (typeof input === "undefined" || !input.length) {
        return 0;
      }
      var isArray = utils.getTypeOf(input) !== "string";
      if (isArray) {
        return crc32(crc | 0, input, input.length, 0);
      } else {
        return crc32str(crc | 0, input, input.length, 0);
      }
    };
  }
});

// node_modules/jszip/lib/stream/Crc32Probe.js
var require_Crc32Probe = __commonJS({
  "node_modules/jszip/lib/stream/Crc32Probe.js"(exports, module) {
    "use strict";
    var GenericWorker = require_GenericWorker();
    var crc32 = require_crc32();
    var utils = require_utils();
    function Crc32Probe() {
      GenericWorker.call(this, "Crc32Probe");
      this.withStreamInfo("crc32", 0);
    }
    utils.inherits(Crc32Probe, GenericWorker);
    Crc32Probe.prototype.processChunk = function(chunk) {
      this.streamInfo.crc32 = crc32(chunk.data, this.streamInfo.crc32 || 0);
      this.push(chunk);
    };
    module.exports = Crc32Probe;
  }
});

// node_modules/jszip/lib/stream/DataLengthProbe.js
var require_DataLengthProbe = __commonJS({
  "node_modules/jszip/lib/stream/DataLengthProbe.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var GenericWorker = require_GenericWorker();
    function DataLengthProbe(propName) {
      GenericWorker.call(this, "DataLengthProbe for " + propName);
      this.propName = propName;
      this.withStreamInfo(propName, 0);
    }
    utils.inherits(DataLengthProbe, GenericWorker);
    DataLengthProbe.prototype.processChunk = function(chunk) {
      if (chunk) {
        var length = this.streamInfo[this.propName] || 0;
        this.streamInfo[this.propName] = length + chunk.data.length;
      }
      GenericWorker.prototype.processChunk.call(this, chunk);
    };
    module.exports = DataLengthProbe;
  }
});

// node_modules/jszip/lib/compressedObject.js
var require_compressedObject = __commonJS({
  "node_modules/jszip/lib/compressedObject.js"(exports, module) {
    "use strict";
    var external = require_external();
    var DataWorker = require_DataWorker();
    var Crc32Probe = require_Crc32Probe();
    var DataLengthProbe = require_DataLengthProbe();
    function CompressedObject(compressedSize, uncompressedSize, crc32, compression, data) {
      this.compressedSize = compressedSize;
      this.uncompressedSize = uncompressedSize;
      this.crc32 = crc32;
      this.compression = compression;
      this.compressedContent = data;
    }
    CompressedObject.prototype = {
      /**
       * Create a worker to get the uncompressed content.
       * @return {GenericWorker} the worker.
       */
      getContentWorker: function() {
        var worker = new DataWorker(external.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new DataLengthProbe("data_length"));
        var that = this;
        worker.on("end", function() {
          if (this.streamInfo["data_length"] !== that.uncompressedSize) {
            throw new Error("Bug : uncompressed data size mismatch");
          }
        });
        return worker;
      },
      /**
       * Create a worker to get the compressed content.
       * @return {GenericWorker} the worker.
       */
      getCompressedWorker: function() {
        return new DataWorker(external.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
      }
    };
    CompressedObject.createWorkerFrom = function(uncompressedWorker, compression, compressionOptions) {
      return uncompressedWorker.pipe(new Crc32Probe()).pipe(new DataLengthProbe("uncompressedSize")).pipe(compression.compressWorker(compressionOptions)).pipe(new DataLengthProbe("compressedSize")).withStreamInfo("compression", compression);
    };
    module.exports = CompressedObject;
  }
});

// node_modules/jszip/lib/zipObject.js
var require_zipObject = __commonJS({
  "node_modules/jszip/lib/zipObject.js"(exports, module) {
    "use strict";
    var StreamHelper = require_StreamHelper();
    var DataWorker = require_DataWorker();
    var utf8 = require_utf8();
    var CompressedObject = require_compressedObject();
    var GenericWorker = require_GenericWorker();
    var ZipObject = function(name, data, options) {
      this.name = name;
      this.dir = options.dir;
      this.date = options.date;
      this.comment = options.comment;
      this.unixPermissions = options.unixPermissions;
      this.dosPermissions = options.dosPermissions;
      this._data = data;
      this._dataBinary = options.binary;
      this.options = {
        compression: options.compression,
        compressionOptions: options.compressionOptions
      };
    };
    ZipObject.prototype = {
      /**
       * Create an internal stream for the content of this object.
       * @param {String} type the type of each chunk.
       * @return StreamHelper the stream.
       */
      internalStream: function(type) {
        var result = null, outputType = "string";
        try {
          if (!type) {
            throw new Error("No output type specified.");
          }
          outputType = type.toLowerCase();
          var askUnicodeString = outputType === "string" || outputType === "text";
          if (outputType === "binarystring" || outputType === "text") {
            outputType = "string";
          }
          result = this._decompressWorker();
          var isUnicodeString = !this._dataBinary;
          if (isUnicodeString && !askUnicodeString) {
            result = result.pipe(new utf8.Utf8EncodeWorker());
          }
          if (!isUnicodeString && askUnicodeString) {
            result = result.pipe(new utf8.Utf8DecodeWorker());
          }
        } catch (e) {
          result = new GenericWorker("error");
          result.error(e);
        }
        return new StreamHelper(result, outputType, "");
      },
      /**
       * Prepare the content in the asked type.
       * @param {String} type the type of the result.
       * @param {Function} onUpdate a function to call on each internal update.
       * @return Promise the promise of the result.
       */
      async: function(type, onUpdate) {
        return this.internalStream(type).accumulate(onUpdate);
      },
      /**
       * Prepare the content as a nodejs stream.
       * @param {String} type the type of each chunk.
       * @param {Function} onUpdate a function to call on each internal update.
       * @return Stream the stream.
       */
      nodeStream: function(type, onUpdate) {
        return this.internalStream(type || "nodebuffer").toNodejsStream(onUpdate);
      },
      /**
       * Return a worker for the compressed content.
       * @private
       * @param {Object} compression the compression object to use.
       * @param {Object} compressionOptions the options to use when compressing.
       * @return Worker the worker.
       */
      _compressWorker: function(compression, compressionOptions) {
        if (this._data instanceof CompressedObject && this._data.compression.magic === compression.magic) {
          return this._data.getCompressedWorker();
        } else {
          var result = this._decompressWorker();
          if (!this._dataBinary) {
            result = result.pipe(new utf8.Utf8EncodeWorker());
          }
          return CompressedObject.createWorkerFrom(result, compression, compressionOptions);
        }
      },
      /**
       * Return a worker for the decompressed content.
       * @private
       * @return Worker the worker.
       */
      _decompressWorker: function() {
        if (this._data instanceof CompressedObject) {
          return this._data.getContentWorker();
        } else if (this._data instanceof GenericWorker) {
          return this._data;
        } else {
          return new DataWorker(this._data);
        }
      }
    };
    var removedMethods = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"];
    var removedFn = function() {
      throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
    };
    for (i = 0; i < removedMethods.length; i++) {
      ZipObject.prototype[removedMethods[i]] = removedFn;
    }
    var i;
    module.exports = ZipObject;
  }
});

// node_modules/pako/lib/utils/common.js
var require_common = __commonJS({
  "node_modules/pako/lib/utils/common.js"(exports) {
    "use strict";
    var TYPED_OK = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Int32Array !== "undefined";
    function _has(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    }
    exports.assign = function(obj) {
      var sources = Array.prototype.slice.call(arguments, 1);
      while (sources.length) {
        var source = sources.shift();
        if (!source) {
          continue;
        }
        if (typeof source !== "object") {
          throw new TypeError(source + "must be non-object");
        }
        for (var p in source) {
          if (_has(source, p)) {
            obj[p] = source[p];
          }
        }
      }
      return obj;
    };
    exports.shrinkBuf = function(buf, size) {
      if (buf.length === size) {
        return buf;
      }
      if (buf.subarray) {
        return buf.subarray(0, size);
      }
      buf.length = size;
      return buf;
    };
    var fnTyped = {
      arraySet: function(dest, src, src_offs, len, dest_offs) {
        if (src.subarray && dest.subarray) {
          dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
          return;
        }
        for (var i = 0; i < len; i++) {
          dest[dest_offs + i] = src[src_offs + i];
        }
      },
      // Join array of chunks to single array.
      flattenChunks: function(chunks) {
        var i, l, len, pos, chunk, result;
        len = 0;
        for (i = 0, l = chunks.length; i < l; i++) {
          len += chunks[i].length;
        }
        result = new Uint8Array(len);
        pos = 0;
        for (i = 0, l = chunks.length; i < l; i++) {
          chunk = chunks[i];
          result.set(chunk, pos);
          pos += chunk.length;
        }
        return result;
      }
    };
    var fnUntyped = {
      arraySet: function(dest, src, src_offs, len, dest_offs) {
        for (var i = 0; i < len; i++) {
          dest[dest_offs + i] = src[src_offs + i];
        }
      },
      // Join array of chunks to single array.
      flattenChunks: function(chunks) {
        return [].concat.apply([], chunks);
      }
    };
    exports.setTyped = function(on) {
      if (on) {
        exports.Buf8 = Uint8Array;
        exports.Buf16 = Uint16Array;
        exports.Buf32 = Int32Array;
        exports.assign(exports, fnTyped);
      } else {
        exports.Buf8 = Array;
        exports.Buf16 = Array;
        exports.Buf32 = Array;
        exports.assign(exports, fnUntyped);
      }
    };
    exports.setTyped(TYPED_OK);
  }
});

// node_modules/pako/lib/zlib/trees.js
var require_trees = __commonJS({
  "node_modules/pako/lib/zlib/trees.js"(exports) {
    "use strict";
    var utils = require_common();
    var Z_FIXED = 4;
    var Z_BINARY = 0;
    var Z_TEXT = 1;
    var Z_UNKNOWN = 2;
    function zero(buf) {
      var len = buf.length;
      while (--len >= 0) {
        buf[len] = 0;
      }
    }
    var STORED_BLOCK = 0;
    var STATIC_TREES = 1;
    var DYN_TREES = 2;
    var MIN_MATCH = 3;
    var MAX_MATCH = 258;
    var LENGTH_CODES = 29;
    var LITERALS = 256;
    var L_CODES = LITERALS + 1 + LENGTH_CODES;
    var D_CODES = 30;
    var BL_CODES = 19;
    var HEAP_SIZE = 2 * L_CODES + 1;
    var MAX_BITS = 15;
    var Buf_size = 16;
    var MAX_BL_BITS = 7;
    var END_BLOCK = 256;
    var REP_3_6 = 16;
    var REPZ_3_10 = 17;
    var REPZ_11_138 = 18;
    var extra_lbits = (
      /* extra bits for each length code */
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
    );
    var extra_dbits = (
      /* extra bits for each distance code */
      [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
    );
    var extra_blbits = (
      /* extra bits for each bit length code */
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
    );
    var bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    var DIST_CODE_LEN = 512;
    var static_ltree = new Array((L_CODES + 2) * 2);
    zero(static_ltree);
    var static_dtree = new Array(D_CODES * 2);
    zero(static_dtree);
    var _dist_code = new Array(DIST_CODE_LEN);
    zero(_dist_code);
    var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
    zero(_length_code);
    var base_length = new Array(LENGTH_CODES);
    zero(base_length);
    var base_dist = new Array(D_CODES);
    zero(base_dist);
    function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
      this.static_tree = static_tree;
      this.extra_bits = extra_bits;
      this.extra_base = extra_base;
      this.elems = elems;
      this.max_length = max_length;
      this.has_stree = static_tree && static_tree.length;
    }
    var static_l_desc;
    var static_d_desc;
    var static_bl_desc;
    function TreeDesc(dyn_tree, stat_desc) {
      this.dyn_tree = dyn_tree;
      this.max_code = 0;
      this.stat_desc = stat_desc;
    }
    function d_code(dist) {
      return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
    }
    function put_short(s, w) {
      s.pending_buf[s.pending++] = w & 255;
      s.pending_buf[s.pending++] = w >>> 8 & 255;
    }
    function send_bits(s, value, length) {
      if (s.bi_valid > Buf_size - length) {
        s.bi_buf |= value << s.bi_valid & 65535;
        put_short(s, s.bi_buf);
        s.bi_buf = value >> Buf_size - s.bi_valid;
        s.bi_valid += length - Buf_size;
      } else {
        s.bi_buf |= value << s.bi_valid & 65535;
        s.bi_valid += length;
      }
    }
    function send_code(s, c, tree) {
      send_bits(
        s,
        tree[c * 2],
        tree[c * 2 + 1]
        /*.Len*/
      );
    }
    function bi_reverse(code, len) {
      var res = 0;
      do {
        res |= code & 1;
        code >>>= 1;
        res <<= 1;
      } while (--len > 0);
      return res >>> 1;
    }
    function bi_flush(s) {
      if (s.bi_valid === 16) {
        put_short(s, s.bi_buf);
        s.bi_buf = 0;
        s.bi_valid = 0;
      } else if (s.bi_valid >= 8) {
        s.pending_buf[s.pending++] = s.bi_buf & 255;
        s.bi_buf >>= 8;
        s.bi_valid -= 8;
      }
    }
    function gen_bitlen(s, desc) {
      var tree = desc.dyn_tree;
      var max_code = desc.max_code;
      var stree = desc.stat_desc.static_tree;
      var has_stree = desc.stat_desc.has_stree;
      var extra = desc.stat_desc.extra_bits;
      var base = desc.stat_desc.extra_base;
      var max_length = desc.stat_desc.max_length;
      var h;
      var n, m;
      var bits;
      var xbits;
      var f;
      var overflow = 0;
      for (bits = 0; bits <= MAX_BITS; bits++) {
        s.bl_count[bits] = 0;
      }
      tree[s.heap[s.heap_max] * 2 + 1] = 0;
      for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
        n = s.heap[h];
        bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
        if (bits > max_length) {
          bits = max_length;
          overflow++;
        }
        tree[n * 2 + 1] = bits;
        if (n > max_code) {
          continue;
        }
        s.bl_count[bits]++;
        xbits = 0;
        if (n >= base) {
          xbits = extra[n - base];
        }
        f = tree[n * 2];
        s.opt_len += f * (bits + xbits);
        if (has_stree) {
          s.static_len += f * (stree[n * 2 + 1] + xbits);
        }
      }
      if (overflow === 0) {
        return;
      }
      do {
        bits = max_length - 1;
        while (s.bl_count[bits] === 0) {
          bits--;
        }
        s.bl_count[bits]--;
        s.bl_count[bits + 1] += 2;
        s.bl_count[max_length]--;
        overflow -= 2;
      } while (overflow > 0);
      for (bits = max_length; bits !== 0; bits--) {
        n = s.bl_count[bits];
        while (n !== 0) {
          m = s.heap[--h];
          if (m > max_code) {
            continue;
          }
          if (tree[m * 2 + 1] !== bits) {
            s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
            tree[m * 2 + 1] = bits;
          }
          n--;
        }
      }
    }
    function gen_codes(tree, max_code, bl_count) {
      var next_code = new Array(MAX_BITS + 1);
      var code = 0;
      var bits;
      var n;
      for (bits = 1; bits <= MAX_BITS; bits++) {
        next_code[bits] = code = code + bl_count[bits - 1] << 1;
      }
      for (n = 0; n <= max_code; n++) {
        var len = tree[n * 2 + 1];
        if (len === 0) {
          continue;
        }
        tree[n * 2] = bi_reverse(next_code[len]++, len);
      }
    }
    function tr_static_init() {
      var n;
      var bits;
      var length;
      var code;
      var dist;
      var bl_count = new Array(MAX_BITS + 1);
      length = 0;
      for (code = 0; code < LENGTH_CODES - 1; code++) {
        base_length[code] = length;
        for (n = 0; n < 1 << extra_lbits[code]; n++) {
          _length_code[length++] = code;
        }
      }
      _length_code[length - 1] = code;
      dist = 0;
      for (code = 0; code < 16; code++) {
        base_dist[code] = dist;
        for (n = 0; n < 1 << extra_dbits[code]; n++) {
          _dist_code[dist++] = code;
        }
      }
      dist >>= 7;
      for (; code < D_CODES; code++) {
        base_dist[code] = dist << 7;
        for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
          _dist_code[256 + dist++] = code;
        }
      }
      for (bits = 0; bits <= MAX_BITS; bits++) {
        bl_count[bits] = 0;
      }
      n = 0;
      while (n <= 143) {
        static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
      }
      while (n <= 255) {
        static_ltree[n * 2 + 1] = 9;
        n++;
        bl_count[9]++;
      }
      while (n <= 279) {
        static_ltree[n * 2 + 1] = 7;
        n++;
        bl_count[7]++;
      }
      while (n <= 287) {
        static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
      }
      gen_codes(static_ltree, L_CODES + 1, bl_count);
      for (n = 0; n < D_CODES; n++) {
        static_dtree[n * 2 + 1] = 5;
        static_dtree[n * 2] = bi_reverse(n, 5);
      }
      static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
      static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
      static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);
    }
    function init_block(s) {
      var n;
      for (n = 0; n < L_CODES; n++) {
        s.dyn_ltree[n * 2] = 0;
      }
      for (n = 0; n < D_CODES; n++) {
        s.dyn_dtree[n * 2] = 0;
      }
      for (n = 0; n < BL_CODES; n++) {
        s.bl_tree[n * 2] = 0;
      }
      s.dyn_ltree[END_BLOCK * 2] = 1;
      s.opt_len = s.static_len = 0;
      s.last_lit = s.matches = 0;
    }
    function bi_windup(s) {
      if (s.bi_valid > 8) {
        put_short(s, s.bi_buf);
      } else if (s.bi_valid > 0) {
        s.pending_buf[s.pending++] = s.bi_buf;
      }
      s.bi_buf = 0;
      s.bi_valid = 0;
    }
    function copy_block(s, buf, len, header) {
      bi_windup(s);
      if (header) {
        put_short(s, len);
        put_short(s, ~len);
      }
      utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
      s.pending += len;
    }
    function smaller(tree, n, m, depth) {
      var _n2 = n * 2;
      var _m2 = m * 2;
      return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
    }
    function pqdownheap(s, tree, k) {
      var v = s.heap[k];
      var j = k << 1;
      while (j <= s.heap_len) {
        if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
          j++;
        }
        if (smaller(tree, v, s.heap[j], s.depth)) {
          break;
        }
        s.heap[k] = s.heap[j];
        k = j;
        j <<= 1;
      }
      s.heap[k] = v;
    }
    function compress_block(s, ltree, dtree) {
      var dist;
      var lc;
      var lx = 0;
      var code;
      var extra;
      if (s.last_lit !== 0) {
        do {
          dist = s.pending_buf[s.d_buf + lx * 2] << 8 | s.pending_buf[s.d_buf + lx * 2 + 1];
          lc = s.pending_buf[s.l_buf + lx];
          lx++;
          if (dist === 0) {
            send_code(s, lc, ltree);
          } else {
            code = _length_code[lc];
            send_code(s, code + LITERALS + 1, ltree);
            extra = extra_lbits[code];
            if (extra !== 0) {
              lc -= base_length[code];
              send_bits(s, lc, extra);
            }
            dist--;
            code = d_code(dist);
            send_code(s, code, dtree);
            extra = extra_dbits[code];
            if (extra !== 0) {
              dist -= base_dist[code];
              send_bits(s, dist, extra);
            }
          }
        } while (lx < s.last_lit);
      }
      send_code(s, END_BLOCK, ltree);
    }
    function build_tree(s, desc) {
      var tree = desc.dyn_tree;
      var stree = desc.stat_desc.static_tree;
      var has_stree = desc.stat_desc.has_stree;
      var elems = desc.stat_desc.elems;
      var n, m;
      var max_code = -1;
      var node;
      s.heap_len = 0;
      s.heap_max = HEAP_SIZE;
      for (n = 0; n < elems; n++) {
        if (tree[n * 2] !== 0) {
          s.heap[++s.heap_len] = max_code = n;
          s.depth[n] = 0;
        } else {
          tree[n * 2 + 1] = 0;
        }
      }
      while (s.heap_len < 2) {
        node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
        tree[node * 2] = 1;
        s.depth[node] = 0;
        s.opt_len--;
        if (has_stree) {
          s.static_len -= stree[node * 2 + 1];
        }
      }
      desc.max_code = max_code;
      for (n = s.heap_len >> 1; n >= 1; n--) {
        pqdownheap(s, tree, n);
      }
      node = elems;
      do {
        n = s.heap[
          1
          /*SMALLEST*/
        ];
        s.heap[
          1
          /*SMALLEST*/
        ] = s.heap[s.heap_len--];
        pqdownheap(
          s,
          tree,
          1
          /*SMALLEST*/
        );
        m = s.heap[
          1
          /*SMALLEST*/
        ];
        s.heap[--s.heap_max] = n;
        s.heap[--s.heap_max] = m;
        tree[node * 2] = tree[n * 2] + tree[m * 2];
        s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
        tree[n * 2 + 1] = tree[m * 2 + 1] = node;
        s.heap[
          1
          /*SMALLEST*/
        ] = node++;
        pqdownheap(
          s,
          tree,
          1
          /*SMALLEST*/
        );
      } while (s.heap_len >= 2);
      s.heap[--s.heap_max] = s.heap[
        1
        /*SMALLEST*/
      ];
      gen_bitlen(s, desc);
      gen_codes(tree, max_code, s.bl_count);
    }
    function scan_tree(s, tree, max_code) {
      var n;
      var prevlen = -1;
      var curlen;
      var nextlen = tree[0 * 2 + 1];
      var count = 0;
      var max_count = 7;
      var min_count = 4;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      }
      tree[(max_code + 1) * 2 + 1] = 65535;
      for (n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen === nextlen) {
          continue;
        } else if (count < min_count) {
          s.bl_tree[curlen * 2] += count;
        } else if (curlen !== 0) {
          if (curlen !== prevlen) {
            s.bl_tree[curlen * 2]++;
          }
          s.bl_tree[REP_3_6 * 2]++;
        } else if (count <= 10) {
          s.bl_tree[REPZ_3_10 * 2]++;
        } else {
          s.bl_tree[REPZ_11_138 * 2]++;
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        } else if (curlen === nextlen) {
          max_count = 6;
          min_count = 3;
        } else {
          max_count = 7;
          min_count = 4;
        }
      }
    }
    function send_tree(s, tree, max_code) {
      var n;
      var prevlen = -1;
      var curlen;
      var nextlen = tree[0 * 2 + 1];
      var count = 0;
      var max_count = 7;
      var min_count = 4;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      }
      for (n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen === nextlen) {
          continue;
        } else if (count < min_count) {
          do {
            send_code(s, curlen, s.bl_tree);
          } while (--count !== 0);
        } else if (curlen !== 0) {
          if (curlen !== prevlen) {
            send_code(s, curlen, s.bl_tree);
            count--;
          }
          send_code(s, REP_3_6, s.bl_tree);
          send_bits(s, count - 3, 2);
        } else if (count <= 10) {
          send_code(s, REPZ_3_10, s.bl_tree);
          send_bits(s, count - 3, 3);
        } else {
          send_code(s, REPZ_11_138, s.bl_tree);
          send_bits(s, count - 11, 7);
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        } else if (curlen === nextlen) {
          max_count = 6;
          min_count = 3;
        } else {
          max_count = 7;
          min_count = 4;
        }
      }
    }
    function build_bl_tree(s) {
      var max_blindex;
      scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
      scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
      build_tree(s, s.bl_desc);
      for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
        if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
          break;
        }
      }
      s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
      return max_blindex;
    }
    function send_all_trees(s, lcodes, dcodes, blcodes) {
      var rank;
      send_bits(s, lcodes - 257, 5);
      send_bits(s, dcodes - 1, 5);
      send_bits(s, blcodes - 4, 4);
      for (rank = 0; rank < blcodes; rank++) {
        send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1], 3);
      }
      send_tree(s, s.dyn_ltree, lcodes - 1);
      send_tree(s, s.dyn_dtree, dcodes - 1);
    }
    function detect_data_type(s) {
      var black_mask = 4093624447;
      var n;
      for (n = 0; n <= 31; n++, black_mask >>>= 1) {
        if (black_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
          return Z_BINARY;
        }
      }
      if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
        return Z_TEXT;
      }
      for (n = 32; n < LITERALS; n++) {
        if (s.dyn_ltree[n * 2] !== 0) {
          return Z_TEXT;
        }
      }
      return Z_BINARY;
    }
    var static_init_done = false;
    function _tr_init(s) {
      if (!static_init_done) {
        tr_static_init();
        static_init_done = true;
      }
      s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
      s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
      s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
      s.bi_buf = 0;
      s.bi_valid = 0;
      init_block(s);
    }
    function _tr_stored_block(s, buf, stored_len, last) {
      send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
      copy_block(s, buf, stored_len, true);
    }
    function _tr_align(s) {
      send_bits(s, STATIC_TREES << 1, 3);
      send_code(s, END_BLOCK, static_ltree);
      bi_flush(s);
    }
    function _tr_flush_block(s, buf, stored_len, last) {
      var opt_lenb, static_lenb;
      var max_blindex = 0;
      if (s.level > 0) {
        if (s.strm.data_type === Z_UNKNOWN) {
          s.strm.data_type = detect_data_type(s);
        }
        build_tree(s, s.l_desc);
        build_tree(s, s.d_desc);
        max_blindex = build_bl_tree(s);
        opt_lenb = s.opt_len + 3 + 7 >>> 3;
        static_lenb = s.static_len + 3 + 7 >>> 3;
        if (static_lenb <= opt_lenb) {
          opt_lenb = static_lenb;
        }
      } else {
        opt_lenb = static_lenb = stored_len + 5;
      }
      if (stored_len + 4 <= opt_lenb && buf !== -1) {
        _tr_stored_block(s, buf, stored_len, last);
      } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
        send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
        compress_block(s, static_ltree, static_dtree);
      } else {
        send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
        send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
        compress_block(s, s.dyn_ltree, s.dyn_dtree);
      }
      init_block(s);
      if (last) {
        bi_windup(s);
      }
    }
    function _tr_tally(s, dist, lc) {
      s.pending_buf[s.d_buf + s.last_lit * 2] = dist >>> 8 & 255;
      s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 255;
      s.pending_buf[s.l_buf + s.last_lit] = lc & 255;
      s.last_lit++;
      if (dist === 0) {
        s.dyn_ltree[lc * 2]++;
      } else {
        s.matches++;
        dist--;
        s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++;
        s.dyn_dtree[d_code(dist) * 2]++;
      }
      return s.last_lit === s.lit_bufsize - 1;
    }
    exports._tr_init = _tr_init;
    exports._tr_stored_block = _tr_stored_block;
    exports._tr_flush_block = _tr_flush_block;
    exports._tr_tally = _tr_tally;
    exports._tr_align = _tr_align;
  }
});

// node_modules/pako/lib/zlib/adler32.js
var require_adler32 = __commonJS({
  "node_modules/pako/lib/zlib/adler32.js"(exports, module) {
    "use strict";
    function adler32(adler, buf, len, pos) {
      var s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
      while (len !== 0) {
        n = len > 2e3 ? 2e3 : len;
        len -= n;
        do {
          s1 = s1 + buf[pos++] | 0;
          s2 = s2 + s1 | 0;
        } while (--n);
        s1 %= 65521;
        s2 %= 65521;
      }
      return s1 | s2 << 16 | 0;
    }
    module.exports = adler32;
  }
});

// node_modules/pako/lib/zlib/crc32.js
var require_crc322 = __commonJS({
  "node_modules/pako/lib/zlib/crc32.js"(exports, module) {
    "use strict";
    function makeTable() {
      var c, table = [];
      for (var n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++) {
          c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
        }
        table[n] = c;
      }
      return table;
    }
    var crcTable = makeTable();
    function crc32(crc, buf, len, pos) {
      var t = crcTable, end = pos + len;
      crc ^= -1;
      for (var i = pos; i < end; i++) {
        crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
      }
      return crc ^ -1;
    }
    module.exports = crc32;
  }
});

// node_modules/pako/lib/zlib/messages.js
var require_messages = __commonJS({
  "node_modules/pako/lib/zlib/messages.js"(exports, module) {
    "use strict";
    module.exports = {
      2: "need dictionary",
      /* Z_NEED_DICT       2  */
      1: "stream end",
      /* Z_STREAM_END      1  */
      0: "",
      /* Z_OK              0  */
      "-1": "file error",
      /* Z_ERRNO         (-1) */
      "-2": "stream error",
      /* Z_STREAM_ERROR  (-2) */
      "-3": "data error",
      /* Z_DATA_ERROR    (-3) */
      "-4": "insufficient memory",
      /* Z_MEM_ERROR     (-4) */
      "-5": "buffer error",
      /* Z_BUF_ERROR     (-5) */
      "-6": "incompatible version"
      /* Z_VERSION_ERROR (-6) */
    };
  }
});

// node_modules/pako/lib/zlib/deflate.js
var require_deflate = __commonJS({
  "node_modules/pako/lib/zlib/deflate.js"(exports) {
    "use strict";
    var utils = require_common();
    var trees = require_trees();
    var adler32 = require_adler32();
    var crc32 = require_crc322();
    var msg = require_messages();
    var Z_NO_FLUSH = 0;
    var Z_PARTIAL_FLUSH = 1;
    var Z_FULL_FLUSH = 3;
    var Z_FINISH = 4;
    var Z_BLOCK = 5;
    var Z_OK = 0;
    var Z_STREAM_END = 1;
    var Z_STREAM_ERROR = -2;
    var Z_DATA_ERROR = -3;
    var Z_BUF_ERROR = -5;
    var Z_DEFAULT_COMPRESSION = -1;
    var Z_FILTERED = 1;
    var Z_HUFFMAN_ONLY = 2;
    var Z_RLE = 3;
    var Z_FIXED = 4;
    var Z_DEFAULT_STRATEGY = 0;
    var Z_UNKNOWN = 2;
    var Z_DEFLATED = 8;
    var MAX_MEM_LEVEL = 9;
    var MAX_WBITS = 15;
    var DEF_MEM_LEVEL = 8;
    var LENGTH_CODES = 29;
    var LITERALS = 256;
    var L_CODES = LITERALS + 1 + LENGTH_CODES;
    var D_CODES = 30;
    var BL_CODES = 19;
    var HEAP_SIZE = 2 * L_CODES + 1;
    var MAX_BITS = 15;
    var MIN_MATCH = 3;
    var MAX_MATCH = 258;
    var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
    var PRESET_DICT = 32;
    var INIT_STATE = 42;
    var EXTRA_STATE = 69;
    var NAME_STATE = 73;
    var COMMENT_STATE = 91;
    var HCRC_STATE = 103;
    var BUSY_STATE = 113;
    var FINISH_STATE = 666;
    var BS_NEED_MORE = 1;
    var BS_BLOCK_DONE = 2;
    var BS_FINISH_STARTED = 3;
    var BS_FINISH_DONE = 4;
    var OS_CODE = 3;
    function err(strm, errorCode) {
      strm.msg = msg[errorCode];
      return errorCode;
    }
    function rank(f) {
      return (f << 1) - (f > 4 ? 9 : 0);
    }
    function zero(buf) {
      var len = buf.length;
      while (--len >= 0) {
        buf[len] = 0;
      }
    }
    function flush_pending(strm) {
      var s = strm.state;
      var len = s.pending;
      if (len > strm.avail_out) {
        len = strm.avail_out;
      }
      if (len === 0) {
        return;
      }
      utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
      strm.next_out += len;
      s.pending_out += len;
      strm.total_out += len;
      strm.avail_out -= len;
      s.pending -= len;
      if (s.pending === 0) {
        s.pending_out = 0;
      }
    }
    function flush_block_only(s, last) {
      trees._tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
      s.block_start = s.strstart;
      flush_pending(s.strm);
    }
    function put_byte(s, b) {
      s.pending_buf[s.pending++] = b;
    }
    function putShortMSB(s, b) {
      s.pending_buf[s.pending++] = b >>> 8 & 255;
      s.pending_buf[s.pending++] = b & 255;
    }
    function read_buf(strm, buf, start, size) {
      var len = strm.avail_in;
      if (len > size) {
        len = size;
      }
      if (len === 0) {
        return 0;
      }
      strm.avail_in -= len;
      utils.arraySet(buf, strm.input, strm.next_in, len, start);
      if (strm.state.wrap === 1) {
        strm.adler = adler32(strm.adler, buf, len, start);
      } else if (strm.state.wrap === 2) {
        strm.adler = crc32(strm.adler, buf, len, start);
      }
      strm.next_in += len;
      strm.total_in += len;
      return len;
    }
    function longest_match(s, cur_match) {
      var chain_length = s.max_chain_length;
      var scan = s.strstart;
      var match;
      var len;
      var best_len = s.prev_length;
      var nice_match = s.nice_match;
      var limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
      var _win = s.window;
      var wmask = s.w_mask;
      var prev = s.prev;
      var strend = s.strstart + MAX_MATCH;
      var scan_end1 = _win[scan + best_len - 1];
      var scan_end = _win[scan + best_len];
      if (s.prev_length >= s.good_match) {
        chain_length >>= 2;
      }
      if (nice_match > s.lookahead) {
        nice_match = s.lookahead;
      }
      do {
        match = cur_match;
        if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
          continue;
        }
        scan += 2;
        match++;
        do {
        } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
        len = MAX_MATCH - (strend - scan);
        scan = strend - MAX_MATCH;
        if (len > best_len) {
          s.match_start = cur_match;
          best_len = len;
          if (len >= nice_match) {
            break;
          }
          scan_end1 = _win[scan + best_len - 1];
          scan_end = _win[scan + best_len];
        }
      } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
      if (best_len <= s.lookahead) {
        return best_len;
      }
      return s.lookahead;
    }
    function fill_window(s) {
      var _w_size = s.w_size;
      var p, n, m, more, str;
      do {
        more = s.window_size - s.lookahead - s.strstart;
        if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
          utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
          s.match_start -= _w_size;
          s.strstart -= _w_size;
          s.block_start -= _w_size;
          n = s.hash_size;
          p = n;
          do {
            m = s.head[--p];
            s.head[p] = m >= _w_size ? m - _w_size : 0;
          } while (--n);
          n = _w_size;
          p = n;
          do {
            m = s.prev[--p];
            s.prev[p] = m >= _w_size ? m - _w_size : 0;
          } while (--n);
          more += _w_size;
        }
        if (s.strm.avail_in === 0) {
          break;
        }
        n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
        s.lookahead += n;
        if (s.lookahead + s.insert >= MIN_MATCH) {
          str = s.strstart - s.insert;
          s.ins_h = s.window[str];
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask;
          while (s.insert) {
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
            s.prev[str & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = str;
            str++;
            s.insert--;
            if (s.lookahead + s.insert < MIN_MATCH) {
              break;
            }
          }
        }
      } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
    }
    function deflate_stored(s, flush) {
      var max_block_size = 65535;
      if (max_block_size > s.pending_buf_size - 5) {
        max_block_size = s.pending_buf_size - 5;
      }
      for (; ; ) {
        if (s.lookahead <= 1) {
          fill_window(s);
          if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        s.strstart += s.lookahead;
        s.lookahead = 0;
        var max_start = s.block_start + max_block_size;
        if (s.strstart === 0 || s.strstart >= max_start) {
          s.lookahead = s.strstart - max_start;
          s.strstart = max_start;
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
        if (s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = 0;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.strstart > s.block_start) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_NEED_MORE;
    }
    function deflate_fast(s, flush) {
      var hash_head;
      var bflush;
      for (; ; ) {
        if (s.lookahead < MIN_LOOKAHEAD) {
          fill_window(s);
          if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        hash_head = 0;
        if (s.lookahead >= MIN_MATCH) {
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
        }
        if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
          s.match_length = longest_match(s, hash_head);
        }
        if (s.match_length >= MIN_MATCH) {
          bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
          s.lookahead -= s.match_length;
          if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
            s.match_length--;
            do {
              s.strstart++;
              s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
              hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
              s.head[s.ins_h] = s.strstart;
            } while (--s.match_length !== 0);
            s.strstart++;
          } else {
            s.strstart += s.match_length;
            s.match_length = 0;
            s.ins_h = s.window[s.strstart];
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask;
          }
        } else {
          bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
          s.lookahead--;
          s.strstart++;
        }
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function deflate_slow(s, flush) {
      var hash_head;
      var bflush;
      var max_insert;
      for (; ; ) {
        if (s.lookahead < MIN_LOOKAHEAD) {
          fill_window(s);
          if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        hash_head = 0;
        if (s.lookahead >= MIN_MATCH) {
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
        }
        s.prev_length = s.match_length;
        s.prev_match = s.match_start;
        s.match_length = MIN_MATCH - 1;
        if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
          s.match_length = longest_match(s, hash_head);
          if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) {
            s.match_length = MIN_MATCH - 1;
          }
        }
        if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
          max_insert = s.strstart + s.lookahead - MIN_MATCH;
          bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
          s.lookahead -= s.prev_length - 1;
          s.prev_length -= 2;
          do {
            if (++s.strstart <= max_insert) {
              s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
              hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
              s.head[s.ins_h] = s.strstart;
            }
          } while (--s.prev_length !== 0);
          s.match_available = 0;
          s.match_length = MIN_MATCH - 1;
          s.strstart++;
          if (bflush) {
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
          }
        } else if (s.match_available) {
          bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
          if (bflush) {
            flush_block_only(s, false);
          }
          s.strstart++;
          s.lookahead--;
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        } else {
          s.match_available = 1;
          s.strstart++;
          s.lookahead--;
        }
      }
      if (s.match_available) {
        bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
        s.match_available = 0;
      }
      s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function deflate_rle(s, flush) {
      var bflush;
      var prev;
      var scan, strend;
      var _win = s.window;
      for (; ; ) {
        if (s.lookahead <= MAX_MATCH) {
          fill_window(s);
          if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        s.match_length = 0;
        if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
          scan = s.strstart - 1;
          prev = _win[scan];
          if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
            strend = s.strstart + MAX_MATCH;
            do {
            } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
            s.match_length = MAX_MATCH - (strend - scan);
            if (s.match_length > s.lookahead) {
              s.match_length = s.lookahead;
            }
          }
        }
        if (s.match_length >= MIN_MATCH) {
          bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);
          s.lookahead -= s.match_length;
          s.strstart += s.match_length;
          s.match_length = 0;
        } else {
          bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
          s.lookahead--;
          s.strstart++;
        }
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = 0;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function deflate_huff(s, flush) {
      var bflush;
      for (; ; ) {
        if (s.lookahead === 0) {
          fill_window(s);
          if (s.lookahead === 0) {
            if (flush === Z_NO_FLUSH) {
              return BS_NEED_MORE;
            }
            break;
          }
        }
        s.match_length = 0;
        bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = 0;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function Config(good_length, max_lazy, nice_length, max_chain, func) {
      this.good_length = good_length;
      this.max_lazy = max_lazy;
      this.nice_length = nice_length;
      this.max_chain = max_chain;
      this.func = func;
    }
    var configuration_table;
    configuration_table = [
      /*      good lazy nice chain */
      new Config(0, 0, 0, 0, deflate_stored),
      /* 0 store only */
      new Config(4, 4, 8, 4, deflate_fast),
      /* 1 max speed, no lazy matches */
      new Config(4, 5, 16, 8, deflate_fast),
      /* 2 */
      new Config(4, 6, 32, 32, deflate_fast),
      /* 3 */
      new Config(4, 4, 16, 16, deflate_slow),
      /* 4 lazy matches */
      new Config(8, 16, 32, 32, deflate_slow),
      /* 5 */
      new Config(8, 16, 128, 128, deflate_slow),
      /* 6 */
      new Config(8, 32, 128, 256, deflate_slow),
      /* 7 */
      new Config(32, 128, 258, 1024, deflate_slow),
      /* 8 */
      new Config(32, 258, 258, 4096, deflate_slow)
      /* 9 max compression */
    ];
    function lm_init(s) {
      s.window_size = 2 * s.w_size;
      zero(s.head);
      s.max_lazy_match = configuration_table[s.level].max_lazy;
      s.good_match = configuration_table[s.level].good_length;
      s.nice_match = configuration_table[s.level].nice_length;
      s.max_chain_length = configuration_table[s.level].max_chain;
      s.strstart = 0;
      s.block_start = 0;
      s.lookahead = 0;
      s.insert = 0;
      s.match_length = s.prev_length = MIN_MATCH - 1;
      s.match_available = 0;
      s.ins_h = 0;
    }
    function DeflateState() {
      this.strm = null;
      this.status = 0;
      this.pending_buf = null;
      this.pending_buf_size = 0;
      this.pending_out = 0;
      this.pending = 0;
      this.wrap = 0;
      this.gzhead = null;
      this.gzindex = 0;
      this.method = Z_DEFLATED;
      this.last_flush = -1;
      this.w_size = 0;
      this.w_bits = 0;
      this.w_mask = 0;
      this.window = null;
      this.window_size = 0;
      this.prev = null;
      this.head = null;
      this.ins_h = 0;
      this.hash_size = 0;
      this.hash_bits = 0;
      this.hash_mask = 0;
      this.hash_shift = 0;
      this.block_start = 0;
      this.match_length = 0;
      this.prev_match = 0;
      this.match_available = 0;
      this.strstart = 0;
      this.match_start = 0;
      this.lookahead = 0;
      this.prev_length = 0;
      this.max_chain_length = 0;
      this.max_lazy_match = 0;
      this.level = 0;
      this.strategy = 0;
      this.good_match = 0;
      this.nice_match = 0;
      this.dyn_ltree = new utils.Buf16(HEAP_SIZE * 2);
      this.dyn_dtree = new utils.Buf16((2 * D_CODES + 1) * 2);
      this.bl_tree = new utils.Buf16((2 * BL_CODES + 1) * 2);
      zero(this.dyn_ltree);
      zero(this.dyn_dtree);
      zero(this.bl_tree);
      this.l_desc = null;
      this.d_desc = null;
      this.bl_desc = null;
      this.bl_count = new utils.Buf16(MAX_BITS + 1);
      this.heap = new utils.Buf16(2 * L_CODES + 1);
      zero(this.heap);
      this.heap_len = 0;
      this.heap_max = 0;
      this.depth = new utils.Buf16(2 * L_CODES + 1);
      zero(this.depth);
      this.l_buf = 0;
      this.lit_bufsize = 0;
      this.last_lit = 0;
      this.d_buf = 0;
      this.opt_len = 0;
      this.static_len = 0;
      this.matches = 0;
      this.insert = 0;
      this.bi_buf = 0;
      this.bi_valid = 0;
    }
    function deflateResetKeep(strm) {
      var s;
      if (!strm || !strm.state) {
        return err(strm, Z_STREAM_ERROR);
      }
      strm.total_in = strm.total_out = 0;
      strm.data_type = Z_UNKNOWN;
      s = strm.state;
      s.pending = 0;
      s.pending_out = 0;
      if (s.wrap < 0) {
        s.wrap = -s.wrap;
      }
      s.status = s.wrap ? INIT_STATE : BUSY_STATE;
      strm.adler = s.wrap === 2 ? 0 : 1;
      s.last_flush = Z_NO_FLUSH;
      trees._tr_init(s);
      return Z_OK;
    }
    function deflateReset(strm) {
      var ret = deflateResetKeep(strm);
      if (ret === Z_OK) {
        lm_init(strm.state);
      }
      return ret;
    }
    function deflateSetHeader(strm, head) {
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      if (strm.state.wrap !== 2) {
        return Z_STREAM_ERROR;
      }
      strm.state.gzhead = head;
      return Z_OK;
    }
    function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
      if (!strm) {
        return Z_STREAM_ERROR;
      }
      var wrap = 1;
      if (level === Z_DEFAULT_COMPRESSION) {
        level = 6;
      }
      if (windowBits < 0) {
        wrap = 0;
        windowBits = -windowBits;
      } else if (windowBits > 15) {
        wrap = 2;
        windowBits -= 16;
      }
      if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED) {
        return err(strm, Z_STREAM_ERROR);
      }
      if (windowBits === 8) {
        windowBits = 9;
      }
      var s = new DeflateState();
      strm.state = s;
      s.strm = strm;
      s.wrap = wrap;
      s.gzhead = null;
      s.w_bits = windowBits;
      s.w_size = 1 << s.w_bits;
      s.w_mask = s.w_size - 1;
      s.hash_bits = memLevel + 7;
      s.hash_size = 1 << s.hash_bits;
      s.hash_mask = s.hash_size - 1;
      s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
      s.window = new utils.Buf8(s.w_size * 2);
      s.head = new utils.Buf16(s.hash_size);
      s.prev = new utils.Buf16(s.w_size);
      s.lit_bufsize = 1 << memLevel + 6;
      s.pending_buf_size = s.lit_bufsize * 4;
      s.pending_buf = new utils.Buf8(s.pending_buf_size);
      s.d_buf = 1 * s.lit_bufsize;
      s.l_buf = (1 + 2) * s.lit_bufsize;
      s.level = level;
      s.strategy = strategy;
      s.method = method;
      return deflateReset(strm);
    }
    function deflateInit(strm, level) {
      return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
    }
    function deflate(strm, flush) {
      var old_flush, s;
      var beg, val;
      if (!strm || !strm.state || flush > Z_BLOCK || flush < 0) {
        return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
      }
      s = strm.state;
      if (!strm.output || !strm.input && strm.avail_in !== 0 || s.status === FINISH_STATE && flush !== Z_FINISH) {
        return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR);
      }
      s.strm = strm;
      old_flush = s.last_flush;
      s.last_flush = flush;
      if (s.status === INIT_STATE) {
        if (s.wrap === 2) {
          strm.adler = 0;
          put_byte(s, 31);
          put_byte(s, 139);
          put_byte(s, 8);
          if (!s.gzhead) {
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
            put_byte(s, OS_CODE);
            s.status = BUSY_STATE;
          } else {
            put_byte(
              s,
              (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16)
            );
            put_byte(s, s.gzhead.time & 255);
            put_byte(s, s.gzhead.time >> 8 & 255);
            put_byte(s, s.gzhead.time >> 16 & 255);
            put_byte(s, s.gzhead.time >> 24 & 255);
            put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
            put_byte(s, s.gzhead.os & 255);
            if (s.gzhead.extra && s.gzhead.extra.length) {
              put_byte(s, s.gzhead.extra.length & 255);
              put_byte(s, s.gzhead.extra.length >> 8 & 255);
            }
            if (s.gzhead.hcrc) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
            }
            s.gzindex = 0;
            s.status = EXTRA_STATE;
          }
        } else {
          var header = Z_DEFLATED + (s.w_bits - 8 << 4) << 8;
          var level_flags = -1;
          if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
            level_flags = 0;
          } else if (s.level < 6) {
            level_flags = 1;
          } else if (s.level === 6) {
            level_flags = 2;
          } else {
            level_flags = 3;
          }
          header |= level_flags << 6;
          if (s.strstart !== 0) {
            header |= PRESET_DICT;
          }
          header += 31 - header % 31;
          s.status = BUSY_STATE;
          putShortMSB(s, header);
          if (s.strstart !== 0) {
            putShortMSB(s, strm.adler >>> 16);
            putShortMSB(s, strm.adler & 65535);
          }
          strm.adler = 1;
        }
      }
      if (s.status === EXTRA_STATE) {
        if (s.gzhead.extra) {
          beg = s.pending;
          while (s.gzindex < (s.gzhead.extra.length & 65535)) {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              flush_pending(strm);
              beg = s.pending;
              if (s.pending === s.pending_buf_size) {
                break;
              }
            }
            put_byte(s, s.gzhead.extra[s.gzindex] & 255);
            s.gzindex++;
          }
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          if (s.gzindex === s.gzhead.extra.length) {
            s.gzindex = 0;
            s.status = NAME_STATE;
          }
        } else {
          s.status = NAME_STATE;
        }
      }
      if (s.status === NAME_STATE) {
        if (s.gzhead.name) {
          beg = s.pending;
          do {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              flush_pending(strm);
              beg = s.pending;
              if (s.pending === s.pending_buf_size) {
                val = 1;
                break;
              }
            }
            if (s.gzindex < s.gzhead.name.length) {
              val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
            } else {
              val = 0;
            }
            put_byte(s, val);
          } while (val !== 0);
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          if (val === 0) {
            s.gzindex = 0;
            s.status = COMMENT_STATE;
          }
        } else {
          s.status = COMMENT_STATE;
        }
      }
      if (s.status === COMMENT_STATE) {
        if (s.gzhead.comment) {
          beg = s.pending;
          do {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              flush_pending(strm);
              beg = s.pending;
              if (s.pending === s.pending_buf_size) {
                val = 1;
                break;
              }
            }
            if (s.gzindex < s.gzhead.comment.length) {
              val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
            } else {
              val = 0;
            }
            put_byte(s, val);
          } while (val !== 0);
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          if (val === 0) {
            s.status = HCRC_STATE;
          }
        } else {
          s.status = HCRC_STATE;
        }
      }
      if (s.status === HCRC_STATE) {
        if (s.gzhead.hcrc) {
          if (s.pending + 2 > s.pending_buf_size) {
            flush_pending(strm);
          }
          if (s.pending + 2 <= s.pending_buf_size) {
            put_byte(s, strm.adler & 255);
            put_byte(s, strm.adler >> 8 & 255);
            strm.adler = 0;
            s.status = BUSY_STATE;
          }
        } else {
          s.status = BUSY_STATE;
        }
      }
      if (s.pending !== 0) {
        flush_pending(strm);
        if (strm.avail_out === 0) {
          s.last_flush = -1;
          return Z_OK;
        }
      } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH) {
        return err(strm, Z_BUF_ERROR);
      }
      if (s.status === FINISH_STATE && strm.avail_in !== 0) {
        return err(strm, Z_BUF_ERROR);
      }
      if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
        var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
        if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
          s.status = FINISH_STATE;
        }
        if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
          if (strm.avail_out === 0) {
            s.last_flush = -1;
          }
          return Z_OK;
        }
        if (bstate === BS_BLOCK_DONE) {
          if (flush === Z_PARTIAL_FLUSH) {
            trees._tr_align(s);
          } else if (flush !== Z_BLOCK) {
            trees._tr_stored_block(s, 0, 0, false);
            if (flush === Z_FULL_FLUSH) {
              zero(s.head);
              if (s.lookahead === 0) {
                s.strstart = 0;
                s.block_start = 0;
                s.insert = 0;
              }
            }
          }
          flush_pending(strm);
          if (strm.avail_out === 0) {
            s.last_flush = -1;
            return Z_OK;
          }
        }
      }
      if (flush !== Z_FINISH) {
        return Z_OK;
      }
      if (s.wrap <= 0) {
        return Z_STREAM_END;
      }
      if (s.wrap === 2) {
        put_byte(s, strm.adler & 255);
        put_byte(s, strm.adler >> 8 & 255);
        put_byte(s, strm.adler >> 16 & 255);
        put_byte(s, strm.adler >> 24 & 255);
        put_byte(s, strm.total_in & 255);
        put_byte(s, strm.total_in >> 8 & 255);
        put_byte(s, strm.total_in >> 16 & 255);
        put_byte(s, strm.total_in >> 24 & 255);
      } else {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 65535);
      }
      flush_pending(strm);
      if (s.wrap > 0) {
        s.wrap = -s.wrap;
      }
      return s.pending !== 0 ? Z_OK : Z_STREAM_END;
    }
    function deflateEnd(strm) {
      var status;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      status = strm.state.status;
      if (status !== INIT_STATE && status !== EXTRA_STATE && status !== NAME_STATE && status !== COMMENT_STATE && status !== HCRC_STATE && status !== BUSY_STATE && status !== FINISH_STATE) {
        return err(strm, Z_STREAM_ERROR);
      }
      strm.state = null;
      return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
    }
    function deflateSetDictionary(strm, dictionary) {
      var dictLength = dictionary.length;
      var s;
      var str, n;
      var wrap;
      var avail;
      var next;
      var input;
      var tmpDict;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      s = strm.state;
      wrap = s.wrap;
      if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
        return Z_STREAM_ERROR;
      }
      if (wrap === 1) {
        strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
      }
      s.wrap = 0;
      if (dictLength >= s.w_size) {
        if (wrap === 0) {
          zero(s.head);
          s.strstart = 0;
          s.block_start = 0;
          s.insert = 0;
        }
        tmpDict = new utils.Buf8(s.w_size);
        utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
        dictionary = tmpDict;
        dictLength = s.w_size;
      }
      avail = strm.avail_in;
      next = strm.next_in;
      input = strm.input;
      strm.avail_in = dictLength;
      strm.next_in = 0;
      strm.input = dictionary;
      fill_window(s);
      while (s.lookahead >= MIN_MATCH) {
        str = s.strstart;
        n = s.lookahead - (MIN_MATCH - 1);
        do {
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
          s.prev[str & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = str;
          str++;
        } while (--n);
        s.strstart = str;
        s.lookahead = MIN_MATCH - 1;
        fill_window(s);
      }
      s.strstart += s.lookahead;
      s.block_start = s.strstart;
      s.insert = s.lookahead;
      s.lookahead = 0;
      s.match_length = s.prev_length = MIN_MATCH - 1;
      s.match_available = 0;
      strm.next_in = next;
      strm.input = input;
      strm.avail_in = avail;
      s.wrap = wrap;
      return Z_OK;
    }
    exports.deflateInit = deflateInit;
    exports.deflateInit2 = deflateInit2;
    exports.deflateReset = deflateReset;
    exports.deflateResetKeep = deflateResetKeep;
    exports.deflateSetHeader = deflateSetHeader;
    exports.deflate = deflate;
    exports.deflateEnd = deflateEnd;
    exports.deflateSetDictionary = deflateSetDictionary;
    exports.deflateInfo = "pako deflate (from Nodeca project)";
  }
});

// node_modules/pako/lib/utils/strings.js
var require_strings = __commonJS({
  "node_modules/pako/lib/utils/strings.js"(exports) {
    "use strict";
    var utils = require_common();
    var STR_APPLY_OK = true;
    var STR_APPLY_UIA_OK = true;
    try {
      String.fromCharCode.apply(null, [0]);
    } catch (__) {
      STR_APPLY_OK = false;
    }
    try {
      String.fromCharCode.apply(null, new Uint8Array(1));
    } catch (__) {
      STR_APPLY_UIA_OK = false;
    }
    var _utf8len = new utils.Buf8(256);
    for (q = 0; q < 256; q++) {
      _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
    }
    var q;
    _utf8len[254] = _utf8len[254] = 1;
    exports.string2buf = function(str) {
      var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
      for (m_pos = 0; m_pos < str_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
      }
      buf = new utils.Buf8(buf_len);
      for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        if (c < 128) {
          buf[i++] = c;
        } else if (c < 2048) {
          buf[i++] = 192 | c >>> 6;
          buf[i++] = 128 | c & 63;
        } else if (c < 65536) {
          buf[i++] = 224 | c >>> 12;
          buf[i++] = 128 | c >>> 6 & 63;
          buf[i++] = 128 | c & 63;
        } else {
          buf[i++] = 240 | c >>> 18;
          buf[i++] = 128 | c >>> 12 & 63;
          buf[i++] = 128 | c >>> 6 & 63;
          buf[i++] = 128 | c & 63;
        }
      }
      return buf;
    };
    function buf2binstring(buf, len) {
      if (len < 65534) {
        if (buf.subarray && STR_APPLY_UIA_OK || !buf.subarray && STR_APPLY_OK) {
          return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
        }
      }
      var result = "";
      for (var i = 0; i < len; i++) {
        result += String.fromCharCode(buf[i]);
      }
      return result;
    }
    exports.buf2binstring = function(buf) {
      return buf2binstring(buf, buf.length);
    };
    exports.binstring2buf = function(str) {
      var buf = new utils.Buf8(str.length);
      for (var i = 0, len = buf.length; i < len; i++) {
        buf[i] = str.charCodeAt(i);
      }
      return buf;
    };
    exports.buf2string = function(buf, max) {
      var i, out, c, c_len;
      var len = max || buf.length;
      var utf16buf = new Array(len * 2);
      for (out = 0, i = 0; i < len; ) {
        c = buf[i++];
        if (c < 128) {
          utf16buf[out++] = c;
          continue;
        }
        c_len = _utf8len[c];
        if (c_len > 4) {
          utf16buf[out++] = 65533;
          i += c_len - 1;
          continue;
        }
        c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
        while (c_len > 1 && i < len) {
          c = c << 6 | buf[i++] & 63;
          c_len--;
        }
        if (c_len > 1) {
          utf16buf[out++] = 65533;
          continue;
        }
        if (c < 65536) {
          utf16buf[out++] = c;
        } else {
          c -= 65536;
          utf16buf[out++] = 55296 | c >> 10 & 1023;
          utf16buf[out++] = 56320 | c & 1023;
        }
      }
      return buf2binstring(utf16buf, out);
    };
    exports.utf8border = function(buf, max) {
      var pos;
      max = max || buf.length;
      if (max > buf.length) {
        max = buf.length;
      }
      pos = max - 1;
      while (pos >= 0 && (buf[pos] & 192) === 128) {
        pos--;
      }
      if (pos < 0) {
        return max;
      }
      if (pos === 0) {
        return max;
      }
      return pos + _utf8len[buf[pos]] > max ? pos : max;
    };
  }
});

// node_modules/pako/lib/zlib/zstream.js
var require_zstream = __commonJS({
  "node_modules/pako/lib/zlib/zstream.js"(exports, module) {
    "use strict";
    function ZStream() {
      this.input = null;
      this.next_in = 0;
      this.avail_in = 0;
      this.total_in = 0;
      this.output = null;
      this.next_out = 0;
      this.avail_out = 0;
      this.total_out = 0;
      this.msg = "";
      this.state = null;
      this.data_type = 2;
      this.adler = 0;
    }
    module.exports = ZStream;
  }
});

// node_modules/pako/lib/deflate.js
var require_deflate2 = __commonJS({
  "node_modules/pako/lib/deflate.js"(exports) {
    "use strict";
    var zlib_deflate = require_deflate();
    var utils = require_common();
    var strings = require_strings();
    var msg = require_messages();
    var ZStream = require_zstream();
    var toString2 = Object.prototype.toString;
    var Z_NO_FLUSH = 0;
    var Z_FINISH = 4;
    var Z_OK = 0;
    var Z_STREAM_END = 1;
    var Z_SYNC_FLUSH = 2;
    var Z_DEFAULT_COMPRESSION = -1;
    var Z_DEFAULT_STRATEGY = 0;
    var Z_DEFLATED = 8;
    function Deflate(options) {
      if (!(this instanceof Deflate)) return new Deflate(options);
      this.options = utils.assign({
        level: Z_DEFAULT_COMPRESSION,
        method: Z_DEFLATED,
        chunkSize: 16384,
        windowBits: 15,
        memLevel: 8,
        strategy: Z_DEFAULT_STRATEGY,
        to: ""
      }, options || {});
      var opt = this.options;
      if (opt.raw && opt.windowBits > 0) {
        opt.windowBits = -opt.windowBits;
      } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
        opt.windowBits += 16;
      }
      this.err = 0;
      this.msg = "";
      this.ended = false;
      this.chunks = [];
      this.strm = new ZStream();
      this.strm.avail_out = 0;
      var status = zlib_deflate.deflateInit2(
        this.strm,
        opt.level,
        opt.method,
        opt.windowBits,
        opt.memLevel,
        opt.strategy
      );
      if (status !== Z_OK) {
        throw new Error(msg[status]);
      }
      if (opt.header) {
        zlib_deflate.deflateSetHeader(this.strm, opt.header);
      }
      if (opt.dictionary) {
        var dict;
        if (typeof opt.dictionary === "string") {
          dict = strings.string2buf(opt.dictionary);
        } else if (toString2.call(opt.dictionary) === "[object ArrayBuffer]") {
          dict = new Uint8Array(opt.dictionary);
        } else {
          dict = opt.dictionary;
        }
        status = zlib_deflate.deflateSetDictionary(this.strm, dict);
        if (status !== Z_OK) {
          throw new Error(msg[status]);
        }
        this._dict_set = true;
      }
    }
    Deflate.prototype.push = function(data, mode) {
      var strm = this.strm;
      var chunkSize = this.options.chunkSize;
      var status, _mode;
      if (this.ended) {
        return false;
      }
      _mode = mode === ~~mode ? mode : mode === true ? Z_FINISH : Z_NO_FLUSH;
      if (typeof data === "string") {
        strm.input = strings.string2buf(data);
      } else if (toString2.call(data) === "[object ArrayBuffer]") {
        strm.input = new Uint8Array(data);
      } else {
        strm.input = data;
      }
      strm.next_in = 0;
      strm.avail_in = strm.input.length;
      do {
        if (strm.avail_out === 0) {
          strm.output = new utils.Buf8(chunkSize);
          strm.next_out = 0;
          strm.avail_out = chunkSize;
        }
        status = zlib_deflate.deflate(strm, _mode);
        if (status !== Z_STREAM_END && status !== Z_OK) {
          this.onEnd(status);
          this.ended = true;
          return false;
        }
        if (strm.avail_out === 0 || strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH)) {
          if (this.options.to === "string") {
            this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output, strm.next_out)));
          } else {
            this.onData(utils.shrinkBuf(strm.output, strm.next_out));
          }
        }
      } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);
      if (_mode === Z_FINISH) {
        status = zlib_deflate.deflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === Z_OK;
      }
      if (_mode === Z_SYNC_FLUSH) {
        this.onEnd(Z_OK);
        strm.avail_out = 0;
        return true;
      }
      return true;
    };
    Deflate.prototype.onData = function(chunk) {
      this.chunks.push(chunk);
    };
    Deflate.prototype.onEnd = function(status) {
      if (status === Z_OK) {
        if (this.options.to === "string") {
          this.result = this.chunks.join("");
        } else {
          this.result = utils.flattenChunks(this.chunks);
        }
      }
      this.chunks = [];
      this.err = status;
      this.msg = this.strm.msg;
    };
    function deflate(input, options) {
      var deflator = new Deflate(options);
      deflator.push(input, true);
      if (deflator.err) {
        throw deflator.msg || msg[deflator.err];
      }
      return deflator.result;
    }
    function deflateRaw(input, options) {
      options = options || {};
      options.raw = true;
      return deflate(input, options);
    }
    function gzip(input, options) {
      options = options || {};
      options.gzip = true;
      return deflate(input, options);
    }
    exports.Deflate = Deflate;
    exports.deflate = deflate;
    exports.deflateRaw = deflateRaw;
    exports.gzip = gzip;
  }
});

// node_modules/pako/lib/zlib/inffast.js
var require_inffast = __commonJS({
  "node_modules/pako/lib/zlib/inffast.js"(exports, module) {
    "use strict";
    var BAD = 30;
    var TYPE = 12;
    module.exports = function inflate_fast(strm, start) {
      var state;
      var _in;
      var last;
      var _out;
      var beg;
      var end;
      var dmax;
      var wsize;
      var whave;
      var wnext;
      var s_window;
      var hold;
      var bits;
      var lcode;
      var dcode;
      var lmask;
      var dmask;
      var here;
      var op;
      var len;
      var dist;
      var from;
      var from_source;
      var input, output;
      state = strm.state;
      _in = strm.next_in;
      input = strm.input;
      last = _in + (strm.avail_in - 5);
      _out = strm.next_out;
      output = strm.output;
      beg = _out - (start - strm.avail_out);
      end = _out + (strm.avail_out - 257);
      dmax = state.dmax;
      wsize = state.wsize;
      whave = state.whave;
      wnext = state.wnext;
      s_window = state.window;
      hold = state.hold;
      bits = state.bits;
      lcode = state.lencode;
      dcode = state.distcode;
      lmask = (1 << state.lenbits) - 1;
      dmask = (1 << state.distbits) - 1;
      top:
        do {
          if (bits < 15) {
            hold += input[_in++] << bits;
            bits += 8;
            hold += input[_in++] << bits;
            bits += 8;
          }
          here = lcode[hold & lmask];
          dolen:
            for (; ; ) {
              op = here >>> 24;
              hold >>>= op;
              bits -= op;
              op = here >>> 16 & 255;
              if (op === 0) {
                output[_out++] = here & 65535;
              } else if (op & 16) {
                len = here & 65535;
                op &= 15;
                if (op) {
                  if (bits < op) {
                    hold += input[_in++] << bits;
                    bits += 8;
                  }
                  len += hold & (1 << op) - 1;
                  hold >>>= op;
                  bits -= op;
                }
                if (bits < 15) {
                  hold += input[_in++] << bits;
                  bits += 8;
                  hold += input[_in++] << bits;
                  bits += 8;
                }
                here = dcode[hold & dmask];
                dodist:
                  for (; ; ) {
                    op = here >>> 24;
                    hold >>>= op;
                    bits -= op;
                    op = here >>> 16 & 255;
                    if (op & 16) {
                      dist = here & 65535;
                      op &= 15;
                      if (bits < op) {
                        hold += input[_in++] << bits;
                        bits += 8;
                        if (bits < op) {
                          hold += input[_in++] << bits;
                          bits += 8;
                        }
                      }
                      dist += hold & (1 << op) - 1;
                      if (dist > dmax) {
                        strm.msg = "invalid distance too far back";
                        state.mode = BAD;
                        break top;
                      }
                      hold >>>= op;
                      bits -= op;
                      op = _out - beg;
                      if (dist > op) {
                        op = dist - op;
                        if (op > whave) {
                          if (state.sane) {
                            strm.msg = "invalid distance too far back";
                            state.mode = BAD;
                            break top;
                          }
                        }
                        from = 0;
                        from_source = s_window;
                        if (wnext === 0) {
                          from += wsize - op;
                          if (op < len) {
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output;
                          }
                        } else if (wnext < op) {
                          from += wsize + wnext - op;
                          op -= wnext;
                          if (op < len) {
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = 0;
                            if (wnext < len) {
                              op = wnext;
                              len -= op;
                              do {
                                output[_out++] = s_window[from++];
                              } while (--op);
                              from = _out - dist;
                              from_source = output;
                            }
                          }
                        } else {
                          from += wnext - op;
                          if (op < len) {
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output;
                          }
                        }
                        while (len > 2) {
                          output[_out++] = from_source[from++];
                          output[_out++] = from_source[from++];
                          output[_out++] = from_source[from++];
                          len -= 3;
                        }
                        if (len) {
                          output[_out++] = from_source[from++];
                          if (len > 1) {
                            output[_out++] = from_source[from++];
                          }
                        }
                      } else {
                        from = _out - dist;
                        do {
                          output[_out++] = output[from++];
                          output[_out++] = output[from++];
                          output[_out++] = output[from++];
                          len -= 3;
                        } while (len > 2);
                        if (len) {
                          output[_out++] = output[from++];
                          if (len > 1) {
                            output[_out++] = output[from++];
                          }
                        }
                      }
                    } else if ((op & 64) === 0) {
                      here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                      continue dodist;
                    } else {
                      strm.msg = "invalid distance code";
                      state.mode = BAD;
                      break top;
                    }
                    break;
                  }
              } else if ((op & 64) === 0) {
                here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
                continue dolen;
              } else if (op & 32) {
                state.mode = TYPE;
                break top;
              } else {
                strm.msg = "invalid literal/length code";
                state.mode = BAD;
                break top;
              }
              break;
            }
        } while (_in < last && _out < end);
      len = bits >> 3;
      _in -= len;
      bits -= len << 3;
      hold &= (1 << bits) - 1;
      strm.next_in = _in;
      strm.next_out = _out;
      strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
      strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
      state.hold = hold;
      state.bits = bits;
      return;
    };
  }
});

// node_modules/pako/lib/zlib/inftrees.js
var require_inftrees = __commonJS({
  "node_modules/pako/lib/zlib/inftrees.js"(exports, module) {
    "use strict";
    var utils = require_common();
    var MAXBITS = 15;
    var ENOUGH_LENS = 852;
    var ENOUGH_DISTS = 592;
    var CODES = 0;
    var LENS = 1;
    var DISTS = 2;
    var lbase = [
      /* Length codes 257..285 base */
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      13,
      15,
      17,
      19,
      23,
      27,
      31,
      35,
      43,
      51,
      59,
      67,
      83,
      99,
      115,
      131,
      163,
      195,
      227,
      258,
      0,
      0
    ];
    var lext = [
      /* Length codes 257..285 extra */
      16,
      16,
      16,
      16,
      16,
      16,
      16,
      16,
      17,
      17,
      17,
      17,
      18,
      18,
      18,
      18,
      19,
      19,
      19,
      19,
      20,
      20,
      20,
      20,
      21,
      21,
      21,
      21,
      16,
      72,
      78
    ];
    var dbase = [
      /* Distance codes 0..29 base */
      1,
      2,
      3,
      4,
      5,
      7,
      9,
      13,
      17,
      25,
      33,
      49,
      65,
      97,
      129,
      193,
      257,
      385,
      513,
      769,
      1025,
      1537,
      2049,
      3073,
      4097,
      6145,
      8193,
      12289,
      16385,
      24577,
      0,
      0
    ];
    var dext = [
      /* Distance codes 0..29 extra */
      16,
      16,
      16,
      16,
      17,
      17,
      18,
      18,
      19,
      19,
      20,
      20,
      21,
      21,
      22,
      22,
      23,
      23,
      24,
      24,
      25,
      25,
      26,
      26,
      27,
      27,
      28,
      28,
      29,
      29,
      64,
      64
    ];
    module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
      var bits = opts.bits;
      var len = 0;
      var sym = 0;
      var min = 0, max = 0;
      var root = 0;
      var curr = 0;
      var drop = 0;
      var left = 0;
      var used = 0;
      var huff = 0;
      var incr;
      var fill;
      var low;
      var mask;
      var next;
      var base = null;
      var base_index = 0;
      var end;
      var count = new utils.Buf16(MAXBITS + 1);
      var offs = new utils.Buf16(MAXBITS + 1);
      var extra = null;
      var extra_index = 0;
      var here_bits, here_op, here_val;
      for (len = 0; len <= MAXBITS; len++) {
        count[len] = 0;
      }
      for (sym = 0; sym < codes; sym++) {
        count[lens[lens_index + sym]]++;
      }
      root = bits;
      for (max = MAXBITS; max >= 1; max--) {
        if (count[max] !== 0) {
          break;
        }
      }
      if (root > max) {
        root = max;
      }
      if (max === 0) {
        table[table_index++] = 1 << 24 | 64 << 16 | 0;
        table[table_index++] = 1 << 24 | 64 << 16 | 0;
        opts.bits = 1;
        return 0;
      }
      for (min = 1; min < max; min++) {
        if (count[min] !== 0) {
          break;
        }
      }
      if (root < min) {
        root = min;
      }
      left = 1;
      for (len = 1; len <= MAXBITS; len++) {
        left <<= 1;
        left -= count[len];
        if (left < 0) {
          return -1;
        }
      }
      if (left > 0 && (type === CODES || max !== 1)) {
        return -1;
      }
      offs[1] = 0;
      for (len = 1; len < MAXBITS; len++) {
        offs[len + 1] = offs[len] + count[len];
      }
      for (sym = 0; sym < codes; sym++) {
        if (lens[lens_index + sym] !== 0) {
          work[offs[lens[lens_index + sym]]++] = sym;
        }
      }
      if (type === CODES) {
        base = extra = work;
        end = 19;
      } else if (type === LENS) {
        base = lbase;
        base_index -= 257;
        extra = lext;
        extra_index -= 257;
        end = 256;
      } else {
        base = dbase;
        extra = dext;
        end = -1;
      }
      huff = 0;
      sym = 0;
      len = min;
      next = table_index;
      curr = root;
      drop = 0;
      low = -1;
      used = 1 << root;
      mask = used - 1;
      if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
        return 1;
      }
      for (; ; ) {
        here_bits = len - drop;
        if (work[sym] < end) {
          here_op = 0;
          here_val = work[sym];
        } else if (work[sym] > end) {
          here_op = extra[extra_index + work[sym]];
          here_val = base[base_index + work[sym]];
        } else {
          here_op = 32 + 64;
          here_val = 0;
        }
        incr = 1 << len - drop;
        fill = 1 << curr;
        min = fill;
        do {
          fill -= incr;
          table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
        } while (fill !== 0);
        incr = 1 << len - 1;
        while (huff & incr) {
          incr >>= 1;
        }
        if (incr !== 0) {
          huff &= incr - 1;
          huff += incr;
        } else {
          huff = 0;
        }
        sym++;
        if (--count[len] === 0) {
          if (len === max) {
            break;
          }
          len = lens[lens_index + work[sym]];
        }
        if (len > root && (huff & mask) !== low) {
          if (drop === 0) {
            drop = root;
          }
          next += min;
          curr = len - drop;
          left = 1 << curr;
          while (curr + drop < max) {
            left -= count[curr + drop];
            if (left <= 0) {
              break;
            }
            curr++;
            left <<= 1;
          }
          used += 1 << curr;
          if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
            return 1;
          }
          low = huff & mask;
          table[low] = root << 24 | curr << 16 | next - table_index | 0;
        }
      }
      if (huff !== 0) {
        table[next + huff] = len - drop << 24 | 64 << 16 | 0;
      }
      opts.bits = root;
      return 0;
    };
  }
});

// node_modules/pako/lib/zlib/inflate.js
var require_inflate = __commonJS({
  "node_modules/pako/lib/zlib/inflate.js"(exports) {
    "use strict";
    var utils = require_common();
    var adler32 = require_adler32();
    var crc32 = require_crc322();
    var inflate_fast = require_inffast();
    var inflate_table = require_inftrees();
    var CODES = 0;
    var LENS = 1;
    var DISTS = 2;
    var Z_FINISH = 4;
    var Z_BLOCK = 5;
    var Z_TREES = 6;
    var Z_OK = 0;
    var Z_STREAM_END = 1;
    var Z_NEED_DICT = 2;
    var Z_STREAM_ERROR = -2;
    var Z_DATA_ERROR = -3;
    var Z_MEM_ERROR = -4;
    var Z_BUF_ERROR = -5;
    var Z_DEFLATED = 8;
    var HEAD = 1;
    var FLAGS = 2;
    var TIME = 3;
    var OS = 4;
    var EXLEN = 5;
    var EXTRA = 6;
    var NAME = 7;
    var COMMENT = 8;
    var HCRC = 9;
    var DICTID = 10;
    var DICT = 11;
    var TYPE = 12;
    var TYPEDO = 13;
    var STORED = 14;
    var COPY_ = 15;
    var COPY = 16;
    var TABLE = 17;
    var LENLENS = 18;
    var CODELENS = 19;
    var LEN_ = 20;
    var LEN = 21;
    var LENEXT = 22;
    var DIST = 23;
    var DISTEXT = 24;
    var MATCH = 25;
    var LIT = 26;
    var CHECK = 27;
    var LENGTH = 28;
    var DONE = 29;
    var BAD = 30;
    var MEM = 31;
    var SYNC = 32;
    var ENOUGH_LENS = 852;
    var ENOUGH_DISTS = 592;
    var MAX_WBITS = 15;
    var DEF_WBITS = MAX_WBITS;
    function zswap32(q) {
      return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
    }
    function InflateState() {
      this.mode = 0;
      this.last = false;
      this.wrap = 0;
      this.havedict = false;
      this.flags = 0;
      this.dmax = 0;
      this.check = 0;
      this.total = 0;
      this.head = null;
      this.wbits = 0;
      this.wsize = 0;
      this.whave = 0;
      this.wnext = 0;
      this.window = null;
      this.hold = 0;
      this.bits = 0;
      this.length = 0;
      this.offset = 0;
      this.extra = 0;
      this.lencode = null;
      this.distcode = null;
      this.lenbits = 0;
      this.distbits = 0;
      this.ncode = 0;
      this.nlen = 0;
      this.ndist = 0;
      this.have = 0;
      this.next = null;
      this.lens = new utils.Buf16(320);
      this.work = new utils.Buf16(288);
      this.lendyn = null;
      this.distdyn = null;
      this.sane = 0;
      this.back = 0;
      this.was = 0;
    }
    function inflateResetKeep(strm) {
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      strm.total_in = strm.total_out = state.total = 0;
      strm.msg = "";
      if (state.wrap) {
        strm.adler = state.wrap & 1;
      }
      state.mode = HEAD;
      state.last = 0;
      state.havedict = 0;
      state.dmax = 32768;
      state.head = null;
      state.hold = 0;
      state.bits = 0;
      state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
      state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);
      state.sane = 1;
      state.back = -1;
      return Z_OK;
    }
    function inflateReset(strm) {
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      state.wsize = 0;
      state.whave = 0;
      state.wnext = 0;
      return inflateResetKeep(strm);
    }
    function inflateReset2(strm, windowBits) {
      var wrap;
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if (windowBits < 0) {
        wrap = 0;
        windowBits = -windowBits;
      } else {
        wrap = (windowBits >> 4) + 1;
        if (windowBits < 48) {
          windowBits &= 15;
        }
      }
      if (windowBits && (windowBits < 8 || windowBits > 15)) {
        return Z_STREAM_ERROR;
      }
      if (state.window !== null && state.wbits !== windowBits) {
        state.window = null;
      }
      state.wrap = wrap;
      state.wbits = windowBits;
      return inflateReset(strm);
    }
    function inflateInit2(strm, windowBits) {
      var ret;
      var state;
      if (!strm) {
        return Z_STREAM_ERROR;
      }
      state = new InflateState();
      strm.state = state;
      state.window = null;
      ret = inflateReset2(strm, windowBits);
      if (ret !== Z_OK) {
        strm.state = null;
      }
      return ret;
    }
    function inflateInit(strm) {
      return inflateInit2(strm, DEF_WBITS);
    }
    var virgin = true;
    var lenfix;
    var distfix;
    function fixedtables(state) {
      if (virgin) {
        var sym;
        lenfix = new utils.Buf32(512);
        distfix = new utils.Buf32(32);
        sym = 0;
        while (sym < 144) {
          state.lens[sym++] = 8;
        }
        while (sym < 256) {
          state.lens[sym++] = 9;
        }
        while (sym < 280) {
          state.lens[sym++] = 7;
        }
        while (sym < 288) {
          state.lens[sym++] = 8;
        }
        inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
        sym = 0;
        while (sym < 32) {
          state.lens[sym++] = 5;
        }
        inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
        virgin = false;
      }
      state.lencode = lenfix;
      state.lenbits = 9;
      state.distcode = distfix;
      state.distbits = 5;
    }
    function updatewindow(strm, src, end, copy) {
      var dist;
      var state = strm.state;
      if (state.window === null) {
        state.wsize = 1 << state.wbits;
        state.wnext = 0;
        state.whave = 0;
        state.window = new utils.Buf8(state.wsize);
      }
      if (copy >= state.wsize) {
        utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
        state.wnext = 0;
        state.whave = state.wsize;
      } else {
        dist = state.wsize - state.wnext;
        if (dist > copy) {
          dist = copy;
        }
        utils.arraySet(state.window, src, end - copy, dist, state.wnext);
        copy -= dist;
        if (copy) {
          utils.arraySet(state.window, src, end - copy, copy, 0);
          state.wnext = copy;
          state.whave = state.wsize;
        } else {
          state.wnext += dist;
          if (state.wnext === state.wsize) {
            state.wnext = 0;
          }
          if (state.whave < state.wsize) {
            state.whave += dist;
          }
        }
      }
      return 0;
    }
    function inflate(strm, flush) {
      var state;
      var input, output;
      var next;
      var put;
      var have, left;
      var hold;
      var bits;
      var _in, _out;
      var copy;
      var from;
      var from_source;
      var here = 0;
      var here_bits, here_op, here_val;
      var last_bits, last_op, last_val;
      var len;
      var ret;
      var hbuf = new utils.Buf8(4);
      var opts;
      var n;
      var order = (
        /* permutation of code lengths */
        [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
      );
      if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if (state.mode === TYPE) {
        state.mode = TYPEDO;
      }
      put = strm.next_out;
      output = strm.output;
      left = strm.avail_out;
      next = strm.next_in;
      input = strm.input;
      have = strm.avail_in;
      hold = state.hold;
      bits = state.bits;
      _in = have;
      _out = left;
      ret = Z_OK;
      inf_leave:
        for (; ; ) {
          switch (state.mode) {
            case HEAD:
              if (state.wrap === 0) {
                state.mode = TYPEDO;
                break;
              }
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.wrap & 2 && hold === 35615) {
                state.check = 0;
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
                hold = 0;
                bits = 0;
                state.mode = FLAGS;
                break;
              }
              state.flags = 0;
              if (state.head) {
                state.head.done = false;
              }
              if (!(state.wrap & 1) || /* check if zlib header allowed */
              (((hold & 255) << 8) + (hold >> 8)) % 31) {
                strm.msg = "incorrect header check";
                state.mode = BAD;
                break;
              }
              if ((hold & 15) !== Z_DEFLATED) {
                strm.msg = "unknown compression method";
                state.mode = BAD;
                break;
              }
              hold >>>= 4;
              bits -= 4;
              len = (hold & 15) + 8;
              if (state.wbits === 0) {
                state.wbits = len;
              } else if (len > state.wbits) {
                strm.msg = "invalid window size";
                state.mode = BAD;
                break;
              }
              state.dmax = 1 << len;
              strm.adler = state.check = 1;
              state.mode = hold & 512 ? DICTID : TYPE;
              hold = 0;
              bits = 0;
              break;
            case FLAGS:
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.flags = hold;
              if ((state.flags & 255) !== Z_DEFLATED) {
                strm.msg = "unknown compression method";
                state.mode = BAD;
                break;
              }
              if (state.flags & 57344) {
                strm.msg = "unknown header flags set";
                state.mode = BAD;
                break;
              }
              if (state.head) {
                state.head.text = hold >> 8 & 1;
              }
              if (state.flags & 512) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = TIME;
            /* falls through */
            case TIME:
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.head) {
                state.head.time = hold;
              }
              if (state.flags & 512) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                hbuf[2] = hold >>> 16 & 255;
                hbuf[3] = hold >>> 24 & 255;
                state.check = crc32(state.check, hbuf, 4, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = OS;
            /* falls through */
            case OS:
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.head) {
                state.head.xflags = hold & 255;
                state.head.os = hold >> 8;
              }
              if (state.flags & 512) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = EXLEN;
            /* falls through */
            case EXLEN:
              if (state.flags & 1024) {
                while (bits < 16) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.length = hold;
                if (state.head) {
                  state.head.extra_len = hold;
                }
                if (state.flags & 512) {
                  hbuf[0] = hold & 255;
                  hbuf[1] = hold >>> 8 & 255;
                  state.check = crc32(state.check, hbuf, 2, 0);
                }
                hold = 0;
                bits = 0;
              } else if (state.head) {
                state.head.extra = null;
              }
              state.mode = EXTRA;
            /* falls through */
            case EXTRA:
              if (state.flags & 1024) {
                copy = state.length;
                if (copy > have) {
                  copy = have;
                }
                if (copy) {
                  if (state.head) {
                    len = state.head.extra_len - state.length;
                    if (!state.head.extra) {
                      state.head.extra = new Array(state.head.extra_len);
                    }
                    utils.arraySet(
                      state.head.extra,
                      input,
                      next,
                      // extra field is limited to 65536 bytes
                      // - no need for additional size check
                      copy,
                      /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                      len
                    );
                  }
                  if (state.flags & 512) {
                    state.check = crc32(state.check, input, copy, next);
                  }
                  have -= copy;
                  next += copy;
                  state.length -= copy;
                }
                if (state.length) {
                  break inf_leave;
                }
              }
              state.length = 0;
              state.mode = NAME;
            /* falls through */
            case NAME:
              if (state.flags & 2048) {
                if (have === 0) {
                  break inf_leave;
                }
                copy = 0;
                do {
                  len = input[next + copy++];
                  if (state.head && len && state.length < 65536) {
                    state.head.name += String.fromCharCode(len);
                  }
                } while (len && copy < have);
                if (state.flags & 512) {
                  state.check = crc32(state.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                if (len) {
                  break inf_leave;
                }
              } else if (state.head) {
                state.head.name = null;
              }
              state.length = 0;
              state.mode = COMMENT;
            /* falls through */
            case COMMENT:
              if (state.flags & 4096) {
                if (have === 0) {
                  break inf_leave;
                }
                copy = 0;
                do {
                  len = input[next + copy++];
                  if (state.head && len && state.length < 65536) {
                    state.head.comment += String.fromCharCode(len);
                  }
                } while (len && copy < have);
                if (state.flags & 512) {
                  state.check = crc32(state.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                if (len) {
                  break inf_leave;
                }
              } else if (state.head) {
                state.head.comment = null;
              }
              state.mode = HCRC;
            /* falls through */
            case HCRC:
              if (state.flags & 512) {
                while (bits < 16) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (hold !== (state.check & 65535)) {
                  strm.msg = "header crc mismatch";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              if (state.head) {
                state.head.hcrc = state.flags >> 9 & 1;
                state.head.done = true;
              }
              strm.adler = state.check = 0;
              state.mode = TYPE;
              break;
            case DICTID:
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              strm.adler = state.check = zswap32(hold);
              hold = 0;
              bits = 0;
              state.mode = DICT;
            /* falls through */
            case DICT:
              if (state.havedict === 0) {
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                return Z_NEED_DICT;
              }
              strm.adler = state.check = 1;
              state.mode = TYPE;
            /* falls through */
            case TYPE:
              if (flush === Z_BLOCK || flush === Z_TREES) {
                break inf_leave;
              }
            /* falls through */
            case TYPEDO:
              if (state.last) {
                hold >>>= bits & 7;
                bits -= bits & 7;
                state.mode = CHECK;
                break;
              }
              while (bits < 3) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.last = hold & 1;
              hold >>>= 1;
              bits -= 1;
              switch (hold & 3) {
                case 0:
                  state.mode = STORED;
                  break;
                case 1:
                  fixedtables(state);
                  state.mode = LEN_;
                  if (flush === Z_TREES) {
                    hold >>>= 2;
                    bits -= 2;
                    break inf_leave;
                  }
                  break;
                case 2:
                  state.mode = TABLE;
                  break;
                case 3:
                  strm.msg = "invalid block type";
                  state.mode = BAD;
              }
              hold >>>= 2;
              bits -= 2;
              break;
            case STORED:
              hold >>>= bits & 7;
              bits -= bits & 7;
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
                strm.msg = "invalid stored block lengths";
                state.mode = BAD;
                break;
              }
              state.length = hold & 65535;
              hold = 0;
              bits = 0;
              state.mode = COPY_;
              if (flush === Z_TREES) {
                break inf_leave;
              }
            /* falls through */
            case COPY_:
              state.mode = COPY;
            /* falls through */
            case COPY:
              copy = state.length;
              if (copy) {
                if (copy > have) {
                  copy = have;
                }
                if (copy > left) {
                  copy = left;
                }
                if (copy === 0) {
                  break inf_leave;
                }
                utils.arraySet(output, input, next, copy, put);
                have -= copy;
                next += copy;
                left -= copy;
                put += copy;
                state.length -= copy;
                break;
              }
              state.mode = TYPE;
              break;
            case TABLE:
              while (bits < 14) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.nlen = (hold & 31) + 257;
              hold >>>= 5;
              bits -= 5;
              state.ndist = (hold & 31) + 1;
              hold >>>= 5;
              bits -= 5;
              state.ncode = (hold & 15) + 4;
              hold >>>= 4;
              bits -= 4;
              if (state.nlen > 286 || state.ndist > 30) {
                strm.msg = "too many length or distance symbols";
                state.mode = BAD;
                break;
              }
              state.have = 0;
              state.mode = LENLENS;
            /* falls through */
            case LENLENS:
              while (state.have < state.ncode) {
                while (bits < 3) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.lens[order[state.have++]] = hold & 7;
                hold >>>= 3;
                bits -= 3;
              }
              while (state.have < 19) {
                state.lens[order[state.have++]] = 0;
              }
              state.lencode = state.lendyn;
              state.lenbits = 7;
              opts = { bits: state.lenbits };
              ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
              state.lenbits = opts.bits;
              if (ret) {
                strm.msg = "invalid code lengths set";
                state.mode = BAD;
                break;
              }
              state.have = 0;
              state.mode = CODELENS;
            /* falls through */
            case CODELENS:
              while (state.have < state.nlen + state.ndist) {
                for (; ; ) {
                  here = state.lencode[hold & (1 << state.lenbits) - 1];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (here_val < 16) {
                  hold >>>= here_bits;
                  bits -= here_bits;
                  state.lens[state.have++] = here_val;
                } else {
                  if (here_val === 16) {
                    n = here_bits + 2;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    if (state.have === 0) {
                      strm.msg = "invalid bit length repeat";
                      state.mode = BAD;
                      break;
                    }
                    len = state.lens[state.have - 1];
                    copy = 3 + (hold & 3);
                    hold >>>= 2;
                    bits -= 2;
                  } else if (here_val === 17) {
                    n = here_bits + 3;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    len = 0;
                    copy = 3 + (hold & 7);
                    hold >>>= 3;
                    bits -= 3;
                  } else {
                    n = here_bits + 7;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    len = 0;
                    copy = 11 + (hold & 127);
                    hold >>>= 7;
                    bits -= 7;
                  }
                  if (state.have + copy > state.nlen + state.ndist) {
                    strm.msg = "invalid bit length repeat";
                    state.mode = BAD;
                    break;
                  }
                  while (copy--) {
                    state.lens[state.have++] = len;
                  }
                }
              }
              if (state.mode === BAD) {
                break;
              }
              if (state.lens[256] === 0) {
                strm.msg = "invalid code -- missing end-of-block";
                state.mode = BAD;
                break;
              }
              state.lenbits = 9;
              opts = { bits: state.lenbits };
              ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
              state.lenbits = opts.bits;
              if (ret) {
                strm.msg = "invalid literal/lengths set";
                state.mode = BAD;
                break;
              }
              state.distbits = 6;
              state.distcode = state.distdyn;
              opts = { bits: state.distbits };
              ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
              state.distbits = opts.bits;
              if (ret) {
                strm.msg = "invalid distances set";
                state.mode = BAD;
                break;
              }
              state.mode = LEN_;
              if (flush === Z_TREES) {
                break inf_leave;
              }
            /* falls through */
            case LEN_:
              state.mode = LEN;
            /* falls through */
            case LEN:
              if (have >= 6 && left >= 258) {
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                inflate_fast(strm, _out);
                put = strm.next_out;
                output = strm.output;
                left = strm.avail_out;
                next = strm.next_in;
                input = strm.input;
                have = strm.avail_in;
                hold = state.hold;
                bits = state.bits;
                if (state.mode === TYPE) {
                  state.back = -1;
                }
                break;
              }
              state.back = 0;
              for (; ; ) {
                here = state.lencode[hold & (1 << state.lenbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (here_op && (here_op & 240) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for (; ; ) {
                  here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (last_bits + here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= last_bits;
                bits -= last_bits;
                state.back += last_bits;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              state.back += here_bits;
              state.length = here_val;
              if (here_op === 0) {
                state.mode = LIT;
                break;
              }
              if (here_op & 32) {
                state.back = -1;
                state.mode = TYPE;
                break;
              }
              if (here_op & 64) {
                strm.msg = "invalid literal/length code";
                state.mode = BAD;
                break;
              }
              state.extra = here_op & 15;
              state.mode = LENEXT;
            /* falls through */
            case LENEXT:
              if (state.extra) {
                n = state.extra;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.length += hold & (1 << state.extra) - 1;
                hold >>>= state.extra;
                bits -= state.extra;
                state.back += state.extra;
              }
              state.was = state.length;
              state.mode = DIST;
            /* falls through */
            case DIST:
              for (; ; ) {
                here = state.distcode[hold & (1 << state.distbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if ((here_op & 240) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for (; ; ) {
                  here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (last_bits + here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= last_bits;
                bits -= last_bits;
                state.back += last_bits;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              state.back += here_bits;
              if (here_op & 64) {
                strm.msg = "invalid distance code";
                state.mode = BAD;
                break;
              }
              state.offset = here_val;
              state.extra = here_op & 15;
              state.mode = DISTEXT;
            /* falls through */
            case DISTEXT:
              if (state.extra) {
                n = state.extra;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.offset += hold & (1 << state.extra) - 1;
                hold >>>= state.extra;
                bits -= state.extra;
                state.back += state.extra;
              }
              if (state.offset > state.dmax) {
                strm.msg = "invalid distance too far back";
                state.mode = BAD;
                break;
              }
              state.mode = MATCH;
            /* falls through */
            case MATCH:
              if (left === 0) {
                break inf_leave;
              }
              copy = _out - left;
              if (state.offset > copy) {
                copy = state.offset - copy;
                if (copy > state.whave) {
                  if (state.sane) {
                    strm.msg = "invalid distance too far back";
                    state.mode = BAD;
                    break;
                  }
                }
                if (copy > state.wnext) {
                  copy -= state.wnext;
                  from = state.wsize - copy;
                } else {
                  from = state.wnext - copy;
                }
                if (copy > state.length) {
                  copy = state.length;
                }
                from_source = state.window;
              } else {
                from_source = output;
                from = put - state.offset;
                copy = state.length;
              }
              if (copy > left) {
                copy = left;
              }
              left -= copy;
              state.length -= copy;
              do {
                output[put++] = from_source[from++];
              } while (--copy);
              if (state.length === 0) {
                state.mode = LEN;
              }
              break;
            case LIT:
              if (left === 0) {
                break inf_leave;
              }
              output[put++] = state.length;
              left--;
              state.mode = LEN;
              break;
            case CHECK:
              if (state.wrap) {
                while (bits < 32) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold |= input[next++] << bits;
                  bits += 8;
                }
                _out -= left;
                strm.total_out += _out;
                state.total += _out;
                if (_out) {
                  strm.adler = state.check = /*UPDATE(state.check, put - _out, _out);*/
                  state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out);
                }
                _out = left;
                if ((state.flags ? hold : zswap32(hold)) !== state.check) {
                  strm.msg = "incorrect data check";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              state.mode = LENGTH;
            /* falls through */
            case LENGTH:
              if (state.wrap && state.flags) {
                while (bits < 32) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (hold !== (state.total & 4294967295)) {
                  strm.msg = "incorrect length check";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              state.mode = DONE;
            /* falls through */
            case DONE:
              ret = Z_STREAM_END;
              break inf_leave;
            case BAD:
              ret = Z_DATA_ERROR;
              break inf_leave;
            case MEM:
              return Z_MEM_ERROR;
            case SYNC:
            /* falls through */
            default:
              return Z_STREAM_ERROR;
          }
        }
      strm.next_out = put;
      strm.avail_out = left;
      strm.next_in = next;
      strm.avail_in = have;
      state.hold = hold;
      state.bits = bits;
      if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH)) {
        if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
          state.mode = MEM;
          return Z_MEM_ERROR;
        }
      }
      _in -= strm.avail_in;
      _out -= strm.avail_out;
      strm.total_in += _in;
      strm.total_out += _out;
      state.total += _out;
      if (state.wrap && _out) {
        strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
        state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out);
      }
      strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
      if ((_in === 0 && _out === 0 || flush === Z_FINISH) && ret === Z_OK) {
        ret = Z_BUF_ERROR;
      }
      return ret;
    }
    function inflateEnd(strm) {
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      var state = strm.state;
      if (state.window) {
        state.window = null;
      }
      strm.state = null;
      return Z_OK;
    }
    function inflateGetHeader(strm, head) {
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if ((state.wrap & 2) === 0) {
        return Z_STREAM_ERROR;
      }
      state.head = head;
      head.done = false;
      return Z_OK;
    }
    function inflateSetDictionary(strm, dictionary) {
      var dictLength = dictionary.length;
      var state;
      var dictid;
      var ret;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if (state.wrap !== 0 && state.mode !== DICT) {
        return Z_STREAM_ERROR;
      }
      if (state.mode === DICT) {
        dictid = 1;
        dictid = adler32(dictid, dictionary, dictLength, 0);
        if (dictid !== state.check) {
          return Z_DATA_ERROR;
        }
      }
      ret = updatewindow(strm, dictionary, dictLength, dictLength);
      if (ret) {
        state.mode = MEM;
        return Z_MEM_ERROR;
      }
      state.havedict = 1;
      return Z_OK;
    }
    exports.inflateReset = inflateReset;
    exports.inflateReset2 = inflateReset2;
    exports.inflateResetKeep = inflateResetKeep;
    exports.inflateInit = inflateInit;
    exports.inflateInit2 = inflateInit2;
    exports.inflate = inflate;
    exports.inflateEnd = inflateEnd;
    exports.inflateGetHeader = inflateGetHeader;
    exports.inflateSetDictionary = inflateSetDictionary;
    exports.inflateInfo = "pako inflate (from Nodeca project)";
  }
});

// node_modules/pako/lib/zlib/constants.js
var require_constants = __commonJS({
  "node_modules/pako/lib/zlib/constants.js"(exports, module) {
    "use strict";
    module.exports = {
      /* Allowed flush values; see deflate() and inflate() below for details */
      Z_NO_FLUSH: 0,
      Z_PARTIAL_FLUSH: 1,
      Z_SYNC_FLUSH: 2,
      Z_FULL_FLUSH: 3,
      Z_FINISH: 4,
      Z_BLOCK: 5,
      Z_TREES: 6,
      /* Return codes for the compression/decompression functions. Negative values
      * are errors, positive values are used for special but normal events.
      */
      Z_OK: 0,
      Z_STREAM_END: 1,
      Z_NEED_DICT: 2,
      Z_ERRNO: -1,
      Z_STREAM_ERROR: -2,
      Z_DATA_ERROR: -3,
      //Z_MEM_ERROR:     -4,
      Z_BUF_ERROR: -5,
      //Z_VERSION_ERROR: -6,
      /* compression levels */
      Z_NO_COMPRESSION: 0,
      Z_BEST_SPEED: 1,
      Z_BEST_COMPRESSION: 9,
      Z_DEFAULT_COMPRESSION: -1,
      Z_FILTERED: 1,
      Z_HUFFMAN_ONLY: 2,
      Z_RLE: 3,
      Z_FIXED: 4,
      Z_DEFAULT_STRATEGY: 0,
      /* Possible values of the data_type field (though see inflate()) */
      Z_BINARY: 0,
      Z_TEXT: 1,
      //Z_ASCII:                1, // = Z_TEXT (deprecated)
      Z_UNKNOWN: 2,
      /* The deflate compression method */
      Z_DEFLATED: 8
      //Z_NULL:                 null // Use -1 or null inline, depending on var type
    };
  }
});

// node_modules/pako/lib/zlib/gzheader.js
var require_gzheader = __commonJS({
  "node_modules/pako/lib/zlib/gzheader.js"(exports, module) {
    "use strict";
    function GZheader() {
      this.text = 0;
      this.time = 0;
      this.xflags = 0;
      this.os = 0;
      this.extra = null;
      this.extra_len = 0;
      this.name = "";
      this.comment = "";
      this.hcrc = 0;
      this.done = false;
    }
    module.exports = GZheader;
  }
});

// node_modules/pako/lib/inflate.js
var require_inflate2 = __commonJS({
  "node_modules/pako/lib/inflate.js"(exports) {
    "use strict";
    var zlib_inflate = require_inflate();
    var utils = require_common();
    var strings = require_strings();
    var c = require_constants();
    var msg = require_messages();
    var ZStream = require_zstream();
    var GZheader = require_gzheader();
    var toString2 = Object.prototype.toString;
    function Inflate(options) {
      if (!(this instanceof Inflate)) return new Inflate(options);
      this.options = utils.assign({
        chunkSize: 16384,
        windowBits: 0,
        to: ""
      }, options || {});
      var opt = this.options;
      if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
        opt.windowBits = -opt.windowBits;
        if (opt.windowBits === 0) {
          opt.windowBits = -15;
        }
      }
      if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
        opt.windowBits += 32;
      }
      if (opt.windowBits > 15 && opt.windowBits < 48) {
        if ((opt.windowBits & 15) === 0) {
          opt.windowBits |= 15;
        }
      }
      this.err = 0;
      this.msg = "";
      this.ended = false;
      this.chunks = [];
      this.strm = new ZStream();
      this.strm.avail_out = 0;
      var status = zlib_inflate.inflateInit2(
        this.strm,
        opt.windowBits
      );
      if (status !== c.Z_OK) {
        throw new Error(msg[status]);
      }
      this.header = new GZheader();
      zlib_inflate.inflateGetHeader(this.strm, this.header);
      if (opt.dictionary) {
        if (typeof opt.dictionary === "string") {
          opt.dictionary = strings.string2buf(opt.dictionary);
        } else if (toString2.call(opt.dictionary) === "[object ArrayBuffer]") {
          opt.dictionary = new Uint8Array(opt.dictionary);
        }
        if (opt.raw) {
          status = zlib_inflate.inflateSetDictionary(this.strm, opt.dictionary);
          if (status !== c.Z_OK) {
            throw new Error(msg[status]);
          }
        }
      }
    }
    Inflate.prototype.push = function(data, mode) {
      var strm = this.strm;
      var chunkSize = this.options.chunkSize;
      var dictionary = this.options.dictionary;
      var status, _mode;
      var next_out_utf8, tail, utf8str;
      var allowBufError = false;
      if (this.ended) {
        return false;
      }
      _mode = mode === ~~mode ? mode : mode === true ? c.Z_FINISH : c.Z_NO_FLUSH;
      if (typeof data === "string") {
        strm.input = strings.binstring2buf(data);
      } else if (toString2.call(data) === "[object ArrayBuffer]") {
        strm.input = new Uint8Array(data);
      } else {
        strm.input = data;
      }
      strm.next_in = 0;
      strm.avail_in = strm.input.length;
      do {
        if (strm.avail_out === 0) {
          strm.output = new utils.Buf8(chunkSize);
          strm.next_out = 0;
          strm.avail_out = chunkSize;
        }
        status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH);
        if (status === c.Z_NEED_DICT && dictionary) {
          status = zlib_inflate.inflateSetDictionary(this.strm, dictionary);
        }
        if (status === c.Z_BUF_ERROR && allowBufError === true) {
          status = c.Z_OK;
          allowBufError = false;
        }
        if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
          this.onEnd(status);
          this.ended = true;
          return false;
        }
        if (strm.next_out) {
          if (strm.avail_out === 0 || status === c.Z_STREAM_END || strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH)) {
            if (this.options.to === "string") {
              next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
              tail = strm.next_out - next_out_utf8;
              utf8str = strings.buf2string(strm.output, next_out_utf8);
              strm.next_out = tail;
              strm.avail_out = chunkSize - tail;
              if (tail) {
                utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0);
              }
              this.onData(utf8str);
            } else {
              this.onData(utils.shrinkBuf(strm.output, strm.next_out));
            }
          }
        }
        if (strm.avail_in === 0 && strm.avail_out === 0) {
          allowBufError = true;
        }
      } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);
      if (status === c.Z_STREAM_END) {
        _mode = c.Z_FINISH;
      }
      if (_mode === c.Z_FINISH) {
        status = zlib_inflate.inflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === c.Z_OK;
      }
      if (_mode === c.Z_SYNC_FLUSH) {
        this.onEnd(c.Z_OK);
        strm.avail_out = 0;
        return true;
      }
      return true;
    };
    Inflate.prototype.onData = function(chunk) {
      this.chunks.push(chunk);
    };
    Inflate.prototype.onEnd = function(status) {
      if (status === c.Z_OK) {
        if (this.options.to === "string") {
          this.result = this.chunks.join("");
        } else {
          this.result = utils.flattenChunks(this.chunks);
        }
      }
      this.chunks = [];
      this.err = status;
      this.msg = this.strm.msg;
    };
    function inflate(input, options) {
      var inflator = new Inflate(options);
      inflator.push(input, true);
      if (inflator.err) {
        throw inflator.msg || msg[inflator.err];
      }
      return inflator.result;
    }
    function inflateRaw(input, options) {
      options = options || {};
      options.raw = true;
      return inflate(input, options);
    }
    exports.Inflate = Inflate;
    exports.inflate = inflate;
    exports.inflateRaw = inflateRaw;
    exports.ungzip = inflate;
  }
});

// node_modules/pako/index.js
var require_pako = __commonJS({
  "node_modules/pako/index.js"(exports, module) {
    "use strict";
    var assign = require_common().assign;
    var deflate = require_deflate2();
    var inflate = require_inflate2();
    var constants = require_constants();
    var pako = {};
    assign(pako, deflate, inflate, constants);
    module.exports = pako;
  }
});

// node_modules/jszip/lib/flate.js
var require_flate = __commonJS({
  "node_modules/jszip/lib/flate.js"(exports) {
    "use strict";
    var USE_TYPEDARRAY = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Uint32Array !== "undefined";
    var pako = require_pako();
    var utils = require_utils();
    var GenericWorker = require_GenericWorker();
    var ARRAY_TYPE = USE_TYPEDARRAY ? "uint8array" : "array";
    exports.magic = "\b\0";
    function FlateWorker(action, options) {
      GenericWorker.call(this, "FlateWorker/" + action);
      this._pako = null;
      this._pakoAction = action;
      this._pakoOptions = options;
      this.meta = {};
    }
    utils.inherits(FlateWorker, GenericWorker);
    FlateWorker.prototype.processChunk = function(chunk) {
      this.meta = chunk.meta;
      if (this._pako === null) {
        this._createPako();
      }
      this._pako.push(utils.transformTo(ARRAY_TYPE, chunk.data), false);
    };
    FlateWorker.prototype.flush = function() {
      GenericWorker.prototype.flush.call(this);
      if (this._pako === null) {
        this._createPako();
      }
      this._pako.push([], true);
    };
    FlateWorker.prototype.cleanUp = function() {
      GenericWorker.prototype.cleanUp.call(this);
      this._pako = null;
    };
    FlateWorker.prototype._createPako = function() {
      this._pako = new pako[this._pakoAction]({
        raw: true,
        level: this._pakoOptions.level || -1
        // default compression
      });
      var self2 = this;
      this._pako.onData = function(data) {
        self2.push({
          data,
          meta: self2.meta
        });
      };
    };
    exports.compressWorker = function(compressionOptions) {
      return new FlateWorker("Deflate", compressionOptions);
    };
    exports.uncompressWorker = function() {
      return new FlateWorker("Inflate", {});
    };
  }
});

// node_modules/jszip/lib/compressions.js
var require_compressions = __commonJS({
  "node_modules/jszip/lib/compressions.js"(exports) {
    "use strict";
    var GenericWorker = require_GenericWorker();
    exports.STORE = {
      magic: "\0\0",
      compressWorker: function() {
        return new GenericWorker("STORE compression");
      },
      uncompressWorker: function() {
        return new GenericWorker("STORE decompression");
      }
    };
    exports.DEFLATE = require_flate();
  }
});

// node_modules/jszip/lib/signature.js
var require_signature = __commonJS({
  "node_modules/jszip/lib/signature.js"(exports) {
    "use strict";
    exports.LOCAL_FILE_HEADER = "PK";
    exports.CENTRAL_FILE_HEADER = "PK";
    exports.CENTRAL_DIRECTORY_END = "PK";
    exports.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07";
    exports.ZIP64_CENTRAL_DIRECTORY_END = "PK";
    exports.DATA_DESCRIPTOR = "PK\x07\b";
  }
});

// node_modules/jszip/lib/generate/ZipFileWorker.js
var require_ZipFileWorker = __commonJS({
  "node_modules/jszip/lib/generate/ZipFileWorker.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var GenericWorker = require_GenericWorker();
    var utf8 = require_utf8();
    var crc32 = require_crc32();
    var signature = require_signature();
    var decToHex = function(dec, bytes) {
      var hex = "", i;
      for (i = 0; i < bytes; i++) {
        hex += String.fromCharCode(dec & 255);
        dec = dec >>> 8;
      }
      return hex;
    };
    var generateUnixExternalFileAttr = function(unixPermissions, isDir) {
      var result = unixPermissions;
      if (!unixPermissions) {
        result = isDir ? 16893 : 33204;
      }
      return (result & 65535) << 16;
    };
    var generateDosExternalFileAttr = function(dosPermissions) {
      return (dosPermissions || 0) & 63;
    };
    var generateZipParts = function(streamInfo, streamedContent, streamingEnded, offset, platform, encodeFileName) {
      var file = streamInfo["file"], compression = streamInfo["compression"], useCustomEncoding = encodeFileName !== utf8.utf8encode, encodedFileName = utils.transformTo("string", encodeFileName(file.name)), utfEncodedFileName = utils.transformTo("string", utf8.utf8encode(file.name)), comment = file.comment, encodedComment = utils.transformTo("string", encodeFileName(comment)), utfEncodedComment = utils.transformTo("string", utf8.utf8encode(comment)), useUTF8ForFileName = utfEncodedFileName.length !== file.name.length, useUTF8ForComment = utfEncodedComment.length !== comment.length, dosTime, dosDate, extraFields = "", unicodePathExtraField = "", unicodeCommentExtraField = "", dir = file.dir, date = file.date;
      var dataInfo = {
        crc32: 0,
        compressedSize: 0,
        uncompressedSize: 0
      };
      if (!streamedContent || streamingEnded) {
        dataInfo.crc32 = streamInfo["crc32"];
        dataInfo.compressedSize = streamInfo["compressedSize"];
        dataInfo.uncompressedSize = streamInfo["uncompressedSize"];
      }
      var bitflag = 0;
      if (streamedContent) {
        bitflag |= 8;
      }
      if (!useCustomEncoding && (useUTF8ForFileName || useUTF8ForComment)) {
        bitflag |= 2048;
      }
      var extFileAttr = 0;
      var versionMadeBy = 0;
      if (dir) {
        extFileAttr |= 16;
      }
      if (platform === "UNIX") {
        versionMadeBy = 798;
        extFileAttr |= generateUnixExternalFileAttr(file.unixPermissions, dir);
      } else {
        versionMadeBy = 20;
        extFileAttr |= generateDosExternalFileAttr(file.dosPermissions, dir);
      }
      dosTime = date.getUTCHours();
      dosTime = dosTime << 6;
      dosTime = dosTime | date.getUTCMinutes();
      dosTime = dosTime << 5;
      dosTime = dosTime | date.getUTCSeconds() / 2;
      dosDate = date.getUTCFullYear() - 1980;
      dosDate = dosDate << 4;
      dosDate = dosDate | date.getUTCMonth() + 1;
      dosDate = dosDate << 5;
      dosDate = dosDate | date.getUTCDate();
      if (useUTF8ForFileName) {
        unicodePathExtraField = // Version
        decToHex(1, 1) + // NameCRC32
        decToHex(crc32(encodedFileName), 4) + // UnicodeName
        utfEncodedFileName;
        extraFields += // Info-ZIP Unicode Path Extra Field
        "up" + // size
        decToHex(unicodePathExtraField.length, 2) + // content
        unicodePathExtraField;
      }
      if (useUTF8ForComment) {
        unicodeCommentExtraField = // Version
        decToHex(1, 1) + // CommentCRC32
        decToHex(crc32(encodedComment), 4) + // UnicodeName
        utfEncodedComment;
        extraFields += // Info-ZIP Unicode Path Extra Field
        "uc" + // size
        decToHex(unicodeCommentExtraField.length, 2) + // content
        unicodeCommentExtraField;
      }
      var header = "";
      header += "\n\0";
      header += decToHex(bitflag, 2);
      header += compression.magic;
      header += decToHex(dosTime, 2);
      header += decToHex(dosDate, 2);
      header += decToHex(dataInfo.crc32, 4);
      header += decToHex(dataInfo.compressedSize, 4);
      header += decToHex(dataInfo.uncompressedSize, 4);
      header += decToHex(encodedFileName.length, 2);
      header += decToHex(extraFields.length, 2);
      var fileRecord = signature.LOCAL_FILE_HEADER + header + encodedFileName + extraFields;
      var dirRecord = signature.CENTRAL_FILE_HEADER + // version made by (00: DOS)
      decToHex(versionMadeBy, 2) + // file header (common to file and central directory)
      header + // file comment length
      decToHex(encodedComment.length, 2) + // disk number start
      "\0\0\0\0" + // external file attributes
      decToHex(extFileAttr, 4) + // relative offset of local header
      decToHex(offset, 4) + // file name
      encodedFileName + // extra field
      extraFields + // file comment
      encodedComment;
      return {
        fileRecord,
        dirRecord
      };
    };
    var generateCentralDirectoryEnd = function(entriesCount, centralDirLength, localDirLength, comment, encodeFileName) {
      var dirEnd = "";
      var encodedComment = utils.transformTo("string", encodeFileName(comment));
      dirEnd = signature.CENTRAL_DIRECTORY_END + // number of this disk
      "\0\0\0\0" + // total number of entries in the central directory on this disk
      decToHex(entriesCount, 2) + // total number of entries in the central directory
      decToHex(entriesCount, 2) + // size of the central directory   4 bytes
      decToHex(centralDirLength, 4) + // offset of start of central directory with respect to the starting disk number
      decToHex(localDirLength, 4) + // .ZIP file comment length
      decToHex(encodedComment.length, 2) + // .ZIP file comment
      encodedComment;
      return dirEnd;
    };
    var generateDataDescriptors = function(streamInfo) {
      var descriptor = "";
      descriptor = signature.DATA_DESCRIPTOR + // crc-32                          4 bytes
      decToHex(streamInfo["crc32"], 4) + // compressed size                 4 bytes
      decToHex(streamInfo["compressedSize"], 4) + // uncompressed size               4 bytes
      decToHex(streamInfo["uncompressedSize"], 4);
      return descriptor;
    };
    function ZipFileWorker(streamFiles, comment, platform, encodeFileName) {
      GenericWorker.call(this, "ZipFileWorker");
      this.bytesWritten = 0;
      this.zipComment = comment;
      this.zipPlatform = platform;
      this.encodeFileName = encodeFileName;
      this.streamFiles = streamFiles;
      this.accumulate = false;
      this.contentBuffer = [];
      this.dirRecords = [];
      this.currentSourceOffset = 0;
      this.entriesCount = 0;
      this.currentFile = null;
      this._sources = [];
    }
    utils.inherits(ZipFileWorker, GenericWorker);
    ZipFileWorker.prototype.push = function(chunk) {
      var currentFilePercent = chunk.meta.percent || 0;
      var entriesCount = this.entriesCount;
      var remainingFiles = this._sources.length;
      if (this.accumulate) {
        this.contentBuffer.push(chunk);
      } else {
        this.bytesWritten += chunk.data.length;
        GenericWorker.prototype.push.call(this, {
          data: chunk.data,
          meta: {
            currentFile: this.currentFile,
            percent: entriesCount ? (currentFilePercent + 100 * (entriesCount - remainingFiles - 1)) / entriesCount : 100
          }
        });
      }
    };
    ZipFileWorker.prototype.openedSource = function(streamInfo) {
      this.currentSourceOffset = this.bytesWritten;
      this.currentFile = streamInfo["file"].name;
      var streamedContent = this.streamFiles && !streamInfo["file"].dir;
      if (streamedContent) {
        var record = generateZipParts(streamInfo, streamedContent, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
        this.push({
          data: record.fileRecord,
          meta: { percent: 0 }
        });
      } else {
        this.accumulate = true;
      }
    };
    ZipFileWorker.prototype.closedSource = function(streamInfo) {
      this.accumulate = false;
      var streamedContent = this.streamFiles && !streamInfo["file"].dir;
      var record = generateZipParts(streamInfo, streamedContent, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
      this.dirRecords.push(record.dirRecord);
      if (streamedContent) {
        this.push({
          data: generateDataDescriptors(streamInfo),
          meta: { percent: 100 }
        });
      } else {
        this.push({
          data: record.fileRecord,
          meta: { percent: 0 }
        });
        while (this.contentBuffer.length) {
          this.push(this.contentBuffer.shift());
        }
      }
      this.currentFile = null;
    };
    ZipFileWorker.prototype.flush = function() {
      var localDirLength = this.bytesWritten;
      for (var i = 0; i < this.dirRecords.length; i++) {
        this.push({
          data: this.dirRecords[i],
          meta: { percent: 100 }
        });
      }
      var centralDirLength = this.bytesWritten - localDirLength;
      var dirEnd = generateCentralDirectoryEnd(this.dirRecords.length, centralDirLength, localDirLength, this.zipComment, this.encodeFileName);
      this.push({
        data: dirEnd,
        meta: { percent: 100 }
      });
    };
    ZipFileWorker.prototype.prepareNextSource = function() {
      this.previous = this._sources.shift();
      this.openedSource(this.previous.streamInfo);
      if (this.isPaused) {
        this.previous.pause();
      } else {
        this.previous.resume();
      }
    };
    ZipFileWorker.prototype.registerPrevious = function(previous) {
      this._sources.push(previous);
      var self2 = this;
      previous.on("data", function(chunk) {
        self2.processChunk(chunk);
      });
      previous.on("end", function() {
        self2.closedSource(self2.previous.streamInfo);
        if (self2._sources.length) {
          self2.prepareNextSource();
        } else {
          self2.end();
        }
      });
      previous.on("error", function(e) {
        self2.error(e);
      });
      return this;
    };
    ZipFileWorker.prototype.resume = function() {
      if (!GenericWorker.prototype.resume.call(this)) {
        return false;
      }
      if (!this.previous && this._sources.length) {
        this.prepareNextSource();
        return true;
      }
      if (!this.previous && !this._sources.length && !this.generatedError) {
        this.end();
        return true;
      }
    };
    ZipFileWorker.prototype.error = function(e) {
      var sources = this._sources;
      if (!GenericWorker.prototype.error.call(this, e)) {
        return false;
      }
      for (var i = 0; i < sources.length; i++) {
        try {
          sources[i].error(e);
        } catch (e2) {
        }
      }
      return true;
    };
    ZipFileWorker.prototype.lock = function() {
      GenericWorker.prototype.lock.call(this);
      var sources = this._sources;
      for (var i = 0; i < sources.length; i++) {
        sources[i].lock();
      }
    };
    module.exports = ZipFileWorker;
  }
});

// node_modules/jszip/lib/generate/index.js
var require_generate = __commonJS({
  "node_modules/jszip/lib/generate/index.js"(exports) {
    "use strict";
    var compressions = require_compressions();
    var ZipFileWorker = require_ZipFileWorker();
    var getCompression = function(fileCompression, zipCompression) {
      var compressionName = fileCompression || zipCompression;
      var compression = compressions[compressionName];
      if (!compression) {
        throw new Error(compressionName + " is not a valid compression method !");
      }
      return compression;
    };
    exports.generateWorker = function(zip, options, comment) {
      var zipFileWorker = new ZipFileWorker(options.streamFiles, comment, options.platform, options.encodeFileName);
      var entriesCount = 0;
      try {
        zip.forEach(function(relativePath, file) {
          entriesCount++;
          var compression = getCompression(file.options.compression, options.compression);
          var compressionOptions = file.options.compressionOptions || options.compressionOptions || {};
          var dir = file.dir, date = file.date;
          file._compressWorker(compression, compressionOptions).withStreamInfo("file", {
            name: relativePath,
            dir,
            date,
            comment: file.comment || "",
            unixPermissions: file.unixPermissions,
            dosPermissions: file.dosPermissions
          }).pipe(zipFileWorker);
        });
        zipFileWorker.entriesCount = entriesCount;
      } catch (e) {
        zipFileWorker.error(e);
      }
      return zipFileWorker;
    };
  }
});

// node_modules/jszip/lib/nodejs/NodejsStreamInputAdapter.js
var require_NodejsStreamInputAdapter = __commonJS({
  "node_modules/jszip/lib/nodejs/NodejsStreamInputAdapter.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var GenericWorker = require_GenericWorker();
    function NodejsStreamInputAdapter(filename, stream) {
      GenericWorker.call(this, "Nodejs stream input adapter for " + filename);
      this._upstreamEnded = false;
      this._bindStream(stream);
    }
    utils.inherits(NodejsStreamInputAdapter, GenericWorker);
    NodejsStreamInputAdapter.prototype._bindStream = function(stream) {
      var self2 = this;
      this._stream = stream;
      stream.pause();
      stream.on("data", function(chunk) {
        self2.push({
          data: chunk,
          meta: {
            percent: 0
          }
        });
      }).on("error", function(e) {
        if (self2.isPaused) {
          this.generatedError = e;
        } else {
          self2.error(e);
        }
      }).on("end", function() {
        if (self2.isPaused) {
          self2._upstreamEnded = true;
        } else {
          self2.end();
        }
      });
    };
    NodejsStreamInputAdapter.prototype.pause = function() {
      if (!GenericWorker.prototype.pause.call(this)) {
        return false;
      }
      this._stream.pause();
      return true;
    };
    NodejsStreamInputAdapter.prototype.resume = function() {
      if (!GenericWorker.prototype.resume.call(this)) {
        return false;
      }
      if (this._upstreamEnded) {
        this.end();
      } else {
        this._stream.resume();
      }
      return true;
    };
    module.exports = NodejsStreamInputAdapter;
  }
});

// node_modules/jszip/lib/object.js
var require_object = __commonJS({
  "node_modules/jszip/lib/object.js"(exports, module) {
    "use strict";
    var utf8 = require_utf8();
    var utils = require_utils();
    var GenericWorker = require_GenericWorker();
    var StreamHelper = require_StreamHelper();
    var defaults = require_defaults();
    var CompressedObject = require_compressedObject();
    var ZipObject = require_zipObject();
    var generate = require_generate();
    var nodejsUtils = require_nodejsUtils();
    var NodejsStreamInputAdapter = require_NodejsStreamInputAdapter();
    var fileAdd = function(name, data, originalOptions) {
      var dataType = utils.getTypeOf(data), parent;
      var o = utils.extend(originalOptions || {}, defaults);
      o.date = o.date || /* @__PURE__ */ new Date();
      if (o.compression !== null) {
        o.compression = o.compression.toUpperCase();
      }
      if (typeof o.unixPermissions === "string") {
        o.unixPermissions = parseInt(o.unixPermissions, 8);
      }
      if (o.unixPermissions && o.unixPermissions & 16384) {
        o.dir = true;
      }
      if (o.dosPermissions && o.dosPermissions & 16) {
        o.dir = true;
      }
      if (o.dir) {
        name = forceTrailingSlash(name);
      }
      if (o.createFolders && (parent = parentFolder(name))) {
        folderAdd.call(this, parent, true);
      }
      var isUnicodeString = dataType === "string" && o.binary === false && o.base64 === false;
      if (!originalOptions || typeof originalOptions.binary === "undefined") {
        o.binary = !isUnicodeString;
      }
      var isCompressedEmpty = data instanceof CompressedObject && data.uncompressedSize === 0;
      if (isCompressedEmpty || o.dir || !data || data.length === 0) {
        o.base64 = false;
        o.binary = true;
        data = "";
        o.compression = "STORE";
        dataType = "string";
      }
      var zipObjectContent = null;
      if (data instanceof CompressedObject || data instanceof GenericWorker) {
        zipObjectContent = data;
      } else if (nodejsUtils.isNode && nodejsUtils.isStream(data)) {
        zipObjectContent = new NodejsStreamInputAdapter(name, data);
      } else {
        zipObjectContent = utils.prepareContent(name, data, o.binary, o.optimizedBinaryString, o.base64);
      }
      var object = new ZipObject(name, zipObjectContent, o);
      this.files[name] = object;
    };
    var parentFolder = function(path) {
      if (path.slice(-1) === "/") {
        path = path.substring(0, path.length - 1);
      }
      var lastSlash = path.lastIndexOf("/");
      return lastSlash > 0 ? path.substring(0, lastSlash) : "";
    };
    var forceTrailingSlash = function(path) {
      if (path.slice(-1) !== "/") {
        path += "/";
      }
      return path;
    };
    var folderAdd = function(name, createFolders) {
      createFolders = typeof createFolders !== "undefined" ? createFolders : defaults.createFolders;
      name = forceTrailingSlash(name);
      if (!this.files[name]) {
        fileAdd.call(this, name, null, {
          dir: true,
          createFolders
        });
      }
      return this.files[name];
    };
    function isRegExp(object) {
      return Object.prototype.toString.call(object) === "[object RegExp]";
    }
    var out = {
      /**
       * @see loadAsync
       */
      load: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      },
      /**
       * Call a callback function for each entry at this folder level.
       * @param {Function} cb the callback function:
       * function (relativePath, file) {...}
       * It takes 2 arguments : the relative path and the file.
       */
      forEach: function(cb) {
        var filename, relativePath, file;
        for (filename in this.files) {
          file = this.files[filename];
          relativePath = filename.slice(this.root.length, filename.length);
          if (relativePath && filename.slice(0, this.root.length) === this.root) {
            cb(relativePath, file);
          }
        }
      },
      /**
       * Filter nested files/folders with the specified function.
       * @param {Function} search the predicate to use :
       * function (relativePath, file) {...}
       * It takes 2 arguments : the relative path and the file.
       * @return {Array} An array of matching elements.
       */
      filter: function(search) {
        var result = [];
        this.forEach(function(relativePath, entry) {
          if (search(relativePath, entry)) {
            result.push(entry);
          }
        });
        return result;
      },
      /**
       * Add a file to the zip file, or search a file.
       * @param   {string|RegExp} name The name of the file to add (if data is defined),
       * the name of the file to find (if no data) or a regex to match files.
       * @param   {String|ArrayBuffer|Uint8Array|Buffer} data  The file data, either raw or base64 encoded
       * @param   {Object} o     File options
       * @return  {JSZip|Object|Array} this JSZip object (when adding a file),
       * a file (when searching by string) or an array of files (when searching by regex).
       */
      file: function(name, data, o) {
        if (arguments.length === 1) {
          if (isRegExp(name)) {
            var regexp = name;
            return this.filter(function(relativePath, file) {
              return !file.dir && regexp.test(relativePath);
            });
          } else {
            var obj = this.files[this.root + name];
            if (obj && !obj.dir) {
              return obj;
            } else {
              return null;
            }
          }
        } else {
          name = this.root + name;
          fileAdd.call(this, name, data, o);
        }
        return this;
      },
      /**
       * Add a directory to the zip file, or search.
       * @param   {String|RegExp} arg The name of the directory to add, or a regex to search folders.
       * @return  {JSZip} an object with the new directory as the root, or an array containing matching folders.
       */
      folder: function(arg) {
        if (!arg) {
          return this;
        }
        if (isRegExp(arg)) {
          return this.filter(function(relativePath, file) {
            return file.dir && arg.test(relativePath);
          });
        }
        var name = this.root + arg;
        var newFolder = folderAdd.call(this, name);
        var ret = this.clone();
        ret.root = newFolder.name;
        return ret;
      },
      /**
       * Delete a file, or a directory and all sub-files, from the zip
       * @param {string} name the name of the file to delete
       * @return {JSZip} this JSZip object
       */
      remove: function(name) {
        name = this.root + name;
        var file = this.files[name];
        if (!file) {
          if (name.slice(-1) !== "/") {
            name += "/";
          }
          file = this.files[name];
        }
        if (file && !file.dir) {
          delete this.files[name];
        } else {
          var kids = this.filter(function(relativePath, file2) {
            return file2.name.slice(0, name.length) === name;
          });
          for (var i = 0; i < kids.length; i++) {
            delete this.files[kids[i].name];
          }
        }
        return this;
      },
      /**
       * @deprecated This method has been removed in JSZip 3.0, please check the upgrade guide.
       */
      generate: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      },
      /**
       * Generate the complete zip file as an internal stream.
       * @param {Object} options the options to generate the zip file :
       * - compression, "STORE" by default.
       * - type, "base64" by default. Values are : string, base64, uint8array, arraybuffer, blob.
       * @return {StreamHelper} the streamed zip file.
       */
      generateInternalStream: function(options) {
        var worker, opts = {};
        try {
          opts = utils.extend(options || {}, {
            streamFiles: false,
            compression: "STORE",
            compressionOptions: null,
            type: "",
            platform: "DOS",
            comment: null,
            mimeType: "application/zip",
            encodeFileName: utf8.utf8encode
          });
          opts.type = opts.type.toLowerCase();
          opts.compression = opts.compression.toUpperCase();
          if (opts.type === "binarystring") {
            opts.type = "string";
          }
          if (!opts.type) {
            throw new Error("No output type specified.");
          }
          utils.checkSupport(opts.type);
          if (opts.platform === "darwin" || opts.platform === "freebsd" || opts.platform === "linux" || opts.platform === "sunos") {
            opts.platform = "UNIX";
          }
          if (opts.platform === "win32") {
            opts.platform = "DOS";
          }
          var comment = opts.comment || this.comment || "";
          worker = generate.generateWorker(this, opts, comment);
        } catch (e) {
          worker = new GenericWorker("error");
          worker.error(e);
        }
        return new StreamHelper(worker, opts.type || "string", opts.mimeType);
      },
      /**
       * Generate the complete zip file asynchronously.
       * @see generateInternalStream
       */
      generateAsync: function(options, onUpdate) {
        return this.generateInternalStream(options).accumulate(onUpdate);
      },
      /**
       * Generate the complete zip file asynchronously.
       * @see generateInternalStream
       */
      generateNodeStream: function(options, onUpdate) {
        options = options || {};
        if (!options.type) {
          options.type = "nodebuffer";
        }
        return this.generateInternalStream(options).toNodejsStream(onUpdate);
      }
    };
    module.exports = out;
  }
});

// node_modules/jszip/lib/reader/DataReader.js
var require_DataReader = __commonJS({
  "node_modules/jszip/lib/reader/DataReader.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function DataReader(data) {
      this.data = data;
      this.length = data.length;
      this.index = 0;
      this.zero = 0;
    }
    DataReader.prototype = {
      /**
       * Check that the offset will not go too far.
       * @param {string} offset the additional offset to check.
       * @throws {Error} an Error if the offset is out of bounds.
       */
      checkOffset: function(offset) {
        this.checkIndex(this.index + offset);
      },
      /**
       * Check that the specified index will not be too far.
       * @param {string} newIndex the index to check.
       * @throws {Error} an Error if the index is out of bounds.
       */
      checkIndex: function(newIndex) {
        if (this.length < this.zero + newIndex || newIndex < 0) {
          throw new Error("End of data reached (data length = " + this.length + ", asked index = " + newIndex + "). Corrupted zip ?");
        }
      },
      /**
       * Change the index.
       * @param {number} newIndex The new index.
       * @throws {Error} if the new index is out of the data.
       */
      setIndex: function(newIndex) {
        this.checkIndex(newIndex);
        this.index = newIndex;
      },
      /**
       * Skip the next n bytes.
       * @param {number} n the number of bytes to skip.
       * @throws {Error} if the new index is out of the data.
       */
      skip: function(n) {
        this.setIndex(this.index + n);
      },
      /**
       * Get the byte at the specified index.
       * @param {number} i the index to use.
       * @return {number} a byte.
       */
      byteAt: function() {
      },
      /**
       * Get the next number with a given byte size.
       * @param {number} size the number of bytes to read.
       * @return {number} the corresponding number.
       */
      readInt: function(size) {
        var result = 0, i;
        this.checkOffset(size);
        for (i = this.index + size - 1; i >= this.index; i--) {
          result = (result << 8) + this.byteAt(i);
        }
        this.index += size;
        return result;
      },
      /**
       * Get the next string with a given byte size.
       * @param {number} size the number of bytes to read.
       * @return {string} the corresponding string.
       */
      readString: function(size) {
        return utils.transformTo("string", this.readData(size));
      },
      /**
       * Get raw data without conversion, <size> bytes.
       * @param {number} size the number of bytes to read.
       * @return {Object} the raw data, implementation specific.
       */
      readData: function() {
      },
      /**
       * Find the last occurrence of a zip signature (4 bytes).
       * @param {string} sig the signature to find.
       * @return {number} the index of the last occurrence, -1 if not found.
       */
      lastIndexOfSignature: function() {
      },
      /**
       * Read the signature (4 bytes) at the current position and compare it with sig.
       * @param {string} sig the expected signature
       * @return {boolean} true if the signature matches, false otherwise.
       */
      readAndCheckSignature: function() {
      },
      /**
       * Get the next date.
       * @return {Date} the date.
       */
      readDate: function() {
        var dostime = this.readInt(4);
        return new Date(Date.UTC(
          (dostime >> 25 & 127) + 1980,
          // year
          (dostime >> 21 & 15) - 1,
          // month
          dostime >> 16 & 31,
          // day
          dostime >> 11 & 31,
          // hour
          dostime >> 5 & 63,
          // minute
          (dostime & 31) << 1
        ));
      }
    };
    module.exports = DataReader;
  }
});

// node_modules/jszip/lib/reader/ArrayReader.js
var require_ArrayReader = __commonJS({
  "node_modules/jszip/lib/reader/ArrayReader.js"(exports, module) {
    "use strict";
    var DataReader = require_DataReader();
    var utils = require_utils();
    function ArrayReader(data) {
      DataReader.call(this, data);
      for (var i = 0; i < this.data.length; i++) {
        data[i] = data[i] & 255;
      }
    }
    utils.inherits(ArrayReader, DataReader);
    ArrayReader.prototype.byteAt = function(i) {
      return this.data[this.zero + i];
    };
    ArrayReader.prototype.lastIndexOfSignature = function(sig) {
      var sig0 = sig.charCodeAt(0), sig1 = sig.charCodeAt(1), sig2 = sig.charCodeAt(2), sig3 = sig.charCodeAt(3);
      for (var i = this.length - 4; i >= 0; --i) {
        if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) {
          return i - this.zero;
        }
      }
      return -1;
    };
    ArrayReader.prototype.readAndCheckSignature = function(sig) {
      var sig0 = sig.charCodeAt(0), sig1 = sig.charCodeAt(1), sig2 = sig.charCodeAt(2), sig3 = sig.charCodeAt(3), data = this.readData(4);
      return sig0 === data[0] && sig1 === data[1] && sig2 === data[2] && sig3 === data[3];
    };
    ArrayReader.prototype.readData = function(size) {
      this.checkOffset(size);
      if (size === 0) {
        return [];
      }
      var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
      this.index += size;
      return result;
    };
    module.exports = ArrayReader;
  }
});

// node_modules/jszip/lib/reader/StringReader.js
var require_StringReader = __commonJS({
  "node_modules/jszip/lib/reader/StringReader.js"(exports, module) {
    "use strict";
    var DataReader = require_DataReader();
    var utils = require_utils();
    function StringReader(data) {
      DataReader.call(this, data);
    }
    utils.inherits(StringReader, DataReader);
    StringReader.prototype.byteAt = function(i) {
      return this.data.charCodeAt(this.zero + i);
    };
    StringReader.prototype.lastIndexOfSignature = function(sig) {
      return this.data.lastIndexOf(sig) - this.zero;
    };
    StringReader.prototype.readAndCheckSignature = function(sig) {
      var data = this.readData(4);
      return sig === data;
    };
    StringReader.prototype.readData = function(size) {
      this.checkOffset(size);
      var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
      this.index += size;
      return result;
    };
    module.exports = StringReader;
  }
});

// node_modules/jszip/lib/reader/Uint8ArrayReader.js
var require_Uint8ArrayReader = __commonJS({
  "node_modules/jszip/lib/reader/Uint8ArrayReader.js"(exports, module) {
    "use strict";
    var ArrayReader = require_ArrayReader();
    var utils = require_utils();
    function Uint8ArrayReader(data) {
      ArrayReader.call(this, data);
    }
    utils.inherits(Uint8ArrayReader, ArrayReader);
    Uint8ArrayReader.prototype.readData = function(size) {
      this.checkOffset(size);
      if (size === 0) {
        return new Uint8Array(0);
      }
      var result = this.data.subarray(this.zero + this.index, this.zero + this.index + size);
      this.index += size;
      return result;
    };
    module.exports = Uint8ArrayReader;
  }
});

// node_modules/jszip/lib/reader/NodeBufferReader.js
var require_NodeBufferReader = __commonJS({
  "node_modules/jszip/lib/reader/NodeBufferReader.js"(exports, module) {
    "use strict";
    var Uint8ArrayReader = require_Uint8ArrayReader();
    var utils = require_utils();
    function NodeBufferReader(data) {
      Uint8ArrayReader.call(this, data);
    }
    utils.inherits(NodeBufferReader, Uint8ArrayReader);
    NodeBufferReader.prototype.readData = function(size) {
      this.checkOffset(size);
      var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
      this.index += size;
      return result;
    };
    module.exports = NodeBufferReader;
  }
});

// node_modules/jszip/lib/reader/readerFor.js
var require_readerFor = __commonJS({
  "node_modules/jszip/lib/reader/readerFor.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var support = require_support();
    var ArrayReader = require_ArrayReader();
    var StringReader = require_StringReader();
    var NodeBufferReader = require_NodeBufferReader();
    var Uint8ArrayReader = require_Uint8ArrayReader();
    module.exports = function(data) {
      var type = utils.getTypeOf(data);
      utils.checkSupport(type);
      if (type === "string" && !support.uint8array) {
        return new StringReader(data);
      }
      if (type === "nodebuffer") {
        return new NodeBufferReader(data);
      }
      if (support.uint8array) {
        return new Uint8ArrayReader(utils.transformTo("uint8array", data));
      }
      return new ArrayReader(utils.transformTo("array", data));
    };
  }
});

// node_modules/jszip/lib/zipEntry.js
var require_zipEntry = __commonJS({
  "node_modules/jszip/lib/zipEntry.js"(exports, module) {
    "use strict";
    var readerFor = require_readerFor();
    var utils = require_utils();
    var CompressedObject = require_compressedObject();
    var crc32fn = require_crc32();
    var utf8 = require_utf8();
    var compressions = require_compressions();
    var support = require_support();
    var MADE_BY_DOS = 0;
    var MADE_BY_UNIX = 3;
    var findCompression = function(compressionMethod) {
      for (var method in compressions) {
        if (!Object.prototype.hasOwnProperty.call(compressions, method)) {
          continue;
        }
        if (compressions[method].magic === compressionMethod) {
          return compressions[method];
        }
      }
      return null;
    };
    function ZipEntry(options, loadOptions) {
      this.options = options;
      this.loadOptions = loadOptions;
    }
    ZipEntry.prototype = {
      /**
       * say if the file is encrypted.
       * @return {boolean} true if the file is encrypted, false otherwise.
       */
      isEncrypted: function() {
        return (this.bitFlag & 1) === 1;
      },
      /**
       * say if the file has utf-8 filename/comment.
       * @return {boolean} true if the filename/comment is in utf-8, false otherwise.
       */
      useUTF8: function() {
        return (this.bitFlag & 2048) === 2048;
      },
      /**
       * Read the local part of a zip file and add the info in this object.
       * @param {DataReader} reader the reader to use.
       */
      readLocalPart: function(reader) {
        var compression, localExtraFieldsLength;
        reader.skip(22);
        this.fileNameLength = reader.readInt(2);
        localExtraFieldsLength = reader.readInt(2);
        this.fileName = reader.readData(this.fileNameLength);
        reader.skip(localExtraFieldsLength);
        if (this.compressedSize === -1 || this.uncompressedSize === -1) {
          throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
        }
        compression = findCompression(this.compressionMethod);
        if (compression === null) {
          throw new Error("Corrupted zip : compression " + utils.pretty(this.compressionMethod) + " unknown (inner file : " + utils.transformTo("string", this.fileName) + ")");
        }
        this.decompressed = new CompressedObject(this.compressedSize, this.uncompressedSize, this.crc32, compression, reader.readData(this.compressedSize));
      },
      /**
       * Read the central part of a zip file and add the info in this object.
       * @param {DataReader} reader the reader to use.
       */
      readCentralPart: function(reader) {
        this.versionMadeBy = reader.readInt(2);
        reader.skip(2);
        this.bitFlag = reader.readInt(2);
        this.compressionMethod = reader.readString(2);
        this.date = reader.readDate();
        this.crc32 = reader.readInt(4);
        this.compressedSize = reader.readInt(4);
        this.uncompressedSize = reader.readInt(4);
        var fileNameLength = reader.readInt(2);
        this.extraFieldsLength = reader.readInt(2);
        this.fileCommentLength = reader.readInt(2);
        this.diskNumberStart = reader.readInt(2);
        this.internalFileAttributes = reader.readInt(2);
        this.externalFileAttributes = reader.readInt(4);
        this.localHeaderOffset = reader.readInt(4);
        if (this.isEncrypted()) {
          throw new Error("Encrypted zip are not supported");
        }
        reader.skip(fileNameLength);
        this.readExtraFields(reader);
        this.parseZIP64ExtraField(reader);
        this.fileComment = reader.readData(this.fileCommentLength);
      },
      /**
       * Parse the external file attributes and get the unix/dos permissions.
       */
      processAttributes: function() {
        this.unixPermissions = null;
        this.dosPermissions = null;
        var madeBy = this.versionMadeBy >> 8;
        this.dir = this.externalFileAttributes & 16 ? true : false;
        if (madeBy === MADE_BY_DOS) {
          this.dosPermissions = this.externalFileAttributes & 63;
        }
        if (madeBy === MADE_BY_UNIX) {
          this.unixPermissions = this.externalFileAttributes >> 16 & 65535;
        }
        if (!this.dir && this.fileNameStr.slice(-1) === "/") {
          this.dir = true;
        }
      },
      /**
       * Parse the ZIP64 extra field and merge the info in the current ZipEntry.
       * @param {DataReader} reader the reader to use.
       */
      parseZIP64ExtraField: function() {
        if (!this.extraFields[1]) {
          return;
        }
        var extraReader = readerFor(this.extraFields[1].value);
        if (this.uncompressedSize === utils.MAX_VALUE_32BITS) {
          this.uncompressedSize = extraReader.readInt(8);
        }
        if (this.compressedSize === utils.MAX_VALUE_32BITS) {
          this.compressedSize = extraReader.readInt(8);
        }
        if (this.localHeaderOffset === utils.MAX_VALUE_32BITS) {
          this.localHeaderOffset = extraReader.readInt(8);
        }
        if (this.diskNumberStart === utils.MAX_VALUE_32BITS) {
          this.diskNumberStart = extraReader.readInt(4);
        }
      },
      /**
       * Read the central part of a zip file and add the info in this object.
       * @param {DataReader} reader the reader to use.
       */
      readExtraFields: function(reader) {
        var end = reader.index + this.extraFieldsLength, extraFieldId, extraFieldLength, extraFieldValue;
        if (!this.extraFields) {
          this.extraFields = {};
        }
        while (reader.index + 4 < end) {
          extraFieldId = reader.readInt(2);
          extraFieldLength = reader.readInt(2);
          extraFieldValue = reader.readData(extraFieldLength);
          this.extraFields[extraFieldId] = {
            id: extraFieldId,
            length: extraFieldLength,
            value: extraFieldValue
          };
        }
        reader.setIndex(end);
      },
      /**
       * Apply an UTF8 transformation if needed.
       */
      handleUTF8: function() {
        var decodeParamType = support.uint8array ? "uint8array" : "array";
        if (this.useUTF8()) {
          this.fileNameStr = utf8.utf8decode(this.fileName);
          this.fileCommentStr = utf8.utf8decode(this.fileComment);
        } else {
          var upath = this.findExtraFieldUnicodePath();
          if (upath !== null) {
            this.fileNameStr = upath;
          } else {
            var fileNameByteArray = utils.transformTo(decodeParamType, this.fileName);
            this.fileNameStr = this.loadOptions.decodeFileName(fileNameByteArray);
          }
          var ucomment = this.findExtraFieldUnicodeComment();
          if (ucomment !== null) {
            this.fileCommentStr = ucomment;
          } else {
            var commentByteArray = utils.transformTo(decodeParamType, this.fileComment);
            this.fileCommentStr = this.loadOptions.decodeFileName(commentByteArray);
          }
        }
      },
      /**
       * Find the unicode path declared in the extra field, if any.
       * @return {String} the unicode path, null otherwise.
       */
      findExtraFieldUnicodePath: function() {
        var upathField = this.extraFields[28789];
        if (upathField) {
          var extraReader = readerFor(upathField.value);
          if (extraReader.readInt(1) !== 1) {
            return null;
          }
          if (crc32fn(this.fileName) !== extraReader.readInt(4)) {
            return null;
          }
          return utf8.utf8decode(extraReader.readData(upathField.length - 5));
        }
        return null;
      },
      /**
       * Find the unicode comment declared in the extra field, if any.
       * @return {String} the unicode comment, null otherwise.
       */
      findExtraFieldUnicodeComment: function() {
        var ucommentField = this.extraFields[25461];
        if (ucommentField) {
          var extraReader = readerFor(ucommentField.value);
          if (extraReader.readInt(1) !== 1) {
            return null;
          }
          if (crc32fn(this.fileComment) !== extraReader.readInt(4)) {
            return null;
          }
          return utf8.utf8decode(extraReader.readData(ucommentField.length - 5));
        }
        return null;
      }
    };
    module.exports = ZipEntry;
  }
});

// node_modules/jszip/lib/zipEntries.js
var require_zipEntries = __commonJS({
  "node_modules/jszip/lib/zipEntries.js"(exports, module) {
    "use strict";
    var readerFor = require_readerFor();
    var utils = require_utils();
    var sig = require_signature();
    var ZipEntry = require_zipEntry();
    var support = require_support();
    function ZipEntries(loadOptions) {
      this.files = [];
      this.loadOptions = loadOptions;
    }
    ZipEntries.prototype = {
      /**
       * Check that the reader is on the specified signature.
       * @param {string} expectedSignature the expected signature.
       * @throws {Error} if it is an other signature.
       */
      checkSignature: function(expectedSignature) {
        if (!this.reader.readAndCheckSignature(expectedSignature)) {
          this.reader.index -= 4;
          var signature = this.reader.readString(4);
          throw new Error("Corrupted zip or bug: unexpected signature (" + utils.pretty(signature) + ", expected " + utils.pretty(expectedSignature) + ")");
        }
      },
      /**
       * Check if the given signature is at the given index.
       * @param {number} askedIndex the index to check.
       * @param {string} expectedSignature the signature to expect.
       * @return {boolean} true if the signature is here, false otherwise.
       */
      isSignature: function(askedIndex, expectedSignature) {
        var currentIndex = this.reader.index;
        this.reader.setIndex(askedIndex);
        var signature = this.reader.readString(4);
        var result = signature === expectedSignature;
        this.reader.setIndex(currentIndex);
        return result;
      },
      /**
       * Read the end of the central directory.
       */
      readBlockEndOfCentral: function() {
        this.diskNumber = this.reader.readInt(2);
        this.diskWithCentralDirStart = this.reader.readInt(2);
        this.centralDirRecordsOnThisDisk = this.reader.readInt(2);
        this.centralDirRecords = this.reader.readInt(2);
        this.centralDirSize = this.reader.readInt(4);
        this.centralDirOffset = this.reader.readInt(4);
        this.zipCommentLength = this.reader.readInt(2);
        var zipComment = this.reader.readData(this.zipCommentLength);
        var decodeParamType = support.uint8array ? "uint8array" : "array";
        var decodeContent = utils.transformTo(decodeParamType, zipComment);
        this.zipComment = this.loadOptions.decodeFileName(decodeContent);
      },
      /**
       * Read the end of the Zip 64 central directory.
       * Not merged with the method readEndOfCentral :
       * The end of central can coexist with its Zip64 brother,
       * I don't want to read the wrong number of bytes !
       */
      readBlockZip64EndOfCentral: function() {
        this.zip64EndOfCentralSize = this.reader.readInt(8);
        this.reader.skip(4);
        this.diskNumber = this.reader.readInt(4);
        this.diskWithCentralDirStart = this.reader.readInt(4);
        this.centralDirRecordsOnThisDisk = this.reader.readInt(8);
        this.centralDirRecords = this.reader.readInt(8);
        this.centralDirSize = this.reader.readInt(8);
        this.centralDirOffset = this.reader.readInt(8);
        this.zip64ExtensibleData = {};
        var extraDataSize = this.zip64EndOfCentralSize - 44, index = 0, extraFieldId, extraFieldLength, extraFieldValue;
        while (index < extraDataSize) {
          extraFieldId = this.reader.readInt(2);
          extraFieldLength = this.reader.readInt(4);
          extraFieldValue = this.reader.readData(extraFieldLength);
          this.zip64ExtensibleData[extraFieldId] = {
            id: extraFieldId,
            length: extraFieldLength,
            value: extraFieldValue
          };
        }
      },
      /**
       * Read the end of the Zip 64 central directory locator.
       */
      readBlockZip64EndOfCentralLocator: function() {
        this.diskWithZip64CentralDirStart = this.reader.readInt(4);
        this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8);
        this.disksCount = this.reader.readInt(4);
        if (this.disksCount > 1) {
          throw new Error("Multi-volumes zip are not supported");
        }
      },
      /**
       * Read the local files, based on the offset read in the central part.
       */
      readLocalFiles: function() {
        var i, file;
        for (i = 0; i < this.files.length; i++) {
          file = this.files[i];
          this.reader.setIndex(file.localHeaderOffset);
          this.checkSignature(sig.LOCAL_FILE_HEADER);
          file.readLocalPart(this.reader);
          file.handleUTF8();
          file.processAttributes();
        }
      },
      /**
       * Read the central directory.
       */
      readCentralDir: function() {
        var file;
        this.reader.setIndex(this.centralDirOffset);
        while (this.reader.readAndCheckSignature(sig.CENTRAL_FILE_HEADER)) {
          file = new ZipEntry({
            zip64: this.zip64
          }, this.loadOptions);
          file.readCentralPart(this.reader);
          this.files.push(file);
        }
        if (this.centralDirRecords !== this.files.length) {
          if (this.centralDirRecords !== 0 && this.files.length === 0) {
            throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
          } else {
          }
        }
      },
      /**
       * Read the end of central directory.
       */
      readEndOfCentral: function() {
        var offset = this.reader.lastIndexOfSignature(sig.CENTRAL_DIRECTORY_END);
        if (offset < 0) {
          var isGarbage = !this.isSignature(0, sig.LOCAL_FILE_HEADER);
          if (isGarbage) {
            throw new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          } else {
            throw new Error("Corrupted zip: can't find end of central directory");
          }
        }
        this.reader.setIndex(offset);
        var endOfCentralDirOffset = offset;
        this.checkSignature(sig.CENTRAL_DIRECTORY_END);
        this.readBlockEndOfCentral();
        if (this.diskNumber === utils.MAX_VALUE_16BITS || this.diskWithCentralDirStart === utils.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === utils.MAX_VALUE_16BITS || this.centralDirRecords === utils.MAX_VALUE_16BITS || this.centralDirSize === utils.MAX_VALUE_32BITS || this.centralDirOffset === utils.MAX_VALUE_32BITS) {
          this.zip64 = true;
          offset = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
          if (offset < 0) {
            throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
          }
          this.reader.setIndex(offset);
          this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
          this.readBlockZip64EndOfCentralLocator();
          if (!this.isSignature(this.relativeOffsetEndOfZip64CentralDir, sig.ZIP64_CENTRAL_DIRECTORY_END)) {
            this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
            if (this.relativeOffsetEndOfZip64CentralDir < 0) {
              throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            }
          }
          this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);
          this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
          this.readBlockZip64EndOfCentral();
        }
        var expectedEndOfCentralDirOffset = this.centralDirOffset + this.centralDirSize;
        if (this.zip64) {
          expectedEndOfCentralDirOffset += 20;
          expectedEndOfCentralDirOffset += 12 + this.zip64EndOfCentralSize;
        }
        var extraBytes = endOfCentralDirOffset - expectedEndOfCentralDirOffset;
        if (extraBytes > 0) {
          if (this.isSignature(endOfCentralDirOffset, sig.CENTRAL_FILE_HEADER)) {
          } else {
            this.reader.zero = extraBytes;
          }
        } else if (extraBytes < 0) {
          throw new Error("Corrupted zip: missing " + Math.abs(extraBytes) + " bytes.");
        }
      },
      prepareReader: function(data) {
        this.reader = readerFor(data);
      },
      /**
       * Read a zip file and create ZipEntries.
       * @param {String|ArrayBuffer|Uint8Array|Buffer} data the binary string representing a zip file.
       */
      load: function(data) {
        this.prepareReader(data);
        this.readEndOfCentral();
        this.readCentralDir();
        this.readLocalFiles();
      }
    };
    module.exports = ZipEntries;
  }
});

// node_modules/jszip/lib/load.js
var require_load = __commonJS({
  "node_modules/jszip/lib/load.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var external = require_external();
    var utf8 = require_utf8();
    var ZipEntries = require_zipEntries();
    var Crc32Probe = require_Crc32Probe();
    var nodejsUtils = require_nodejsUtils();
    function checkEntryCRC32(zipEntry) {
      return new external.Promise(function(resolve, reject) {
        var worker = zipEntry.decompressed.getContentWorker().pipe(new Crc32Probe());
        worker.on("error", function(e) {
          reject(e);
        }).on("end", function() {
          if (worker.streamInfo.crc32 !== zipEntry.decompressed.crc32) {
            reject(new Error("Corrupted zip : CRC32 mismatch"));
          } else {
            resolve();
          }
        }).resume();
      });
    }
    module.exports = function(data, options) {
      var zip = this;
      options = utils.extend(options || {}, {
        base64: false,
        checkCRC32: false,
        optimizedBinaryString: false,
        createFolders: false,
        decodeFileName: utf8.utf8decode
      });
      if (nodejsUtils.isNode && nodejsUtils.isStream(data)) {
        return external.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file."));
      }
      return utils.prepareContent("the loaded zip file", data, true, options.optimizedBinaryString, options.base64).then(function(data2) {
        var zipEntries = new ZipEntries(options);
        zipEntries.load(data2);
        return zipEntries;
      }).then(function checkCRC32(zipEntries) {
        var promises = [external.Promise.resolve(zipEntries)];
        var files = zipEntries.files;
        if (options.checkCRC32) {
          for (var i = 0; i < files.length; i++) {
            promises.push(checkEntryCRC32(files[i]));
          }
        }
        return external.Promise.all(promises);
      }).then(function addFiles(results) {
        var zipEntries = results.shift();
        var files = zipEntries.files;
        for (var i = 0; i < files.length; i++) {
          var input = files[i];
          var unsafeName = input.fileNameStr;
          var safeName = utils.resolve(input.fileNameStr);
          zip.file(safeName, input.decompressed, {
            binary: true,
            optimizedBinaryString: true,
            date: input.date,
            dir: input.dir,
            comment: input.fileCommentStr.length ? input.fileCommentStr : null,
            unixPermissions: input.unixPermissions,
            dosPermissions: input.dosPermissions,
            createFolders: options.createFolders
          });
          if (!input.dir) {
            zip.file(safeName).unsafeOriginalName = unsafeName;
          }
        }
        if (zipEntries.zipComment.length) {
          zip.comment = zipEntries.zipComment;
        }
        return zip;
      });
    };
  }
});

// node_modules/jszip/lib/index.js
var require_lib3 = __commonJS({
  "node_modules/jszip/lib/index.js"(exports, module) {
    "use strict";
    function JSZip2() {
      if (!(this instanceof JSZip2)) {
        return new JSZip2();
      }
      if (arguments.length) {
        throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
      }
      this.files = /* @__PURE__ */ Object.create(null);
      this.comment = null;
      this.root = "";
      this.clone = function() {
        var newObj = new JSZip2();
        for (var i in this) {
          if (typeof this[i] !== "function") {
            newObj[i] = this[i];
          }
        }
        return newObj;
      };
    }
    JSZip2.prototype = require_object();
    JSZip2.prototype.loadAsync = require_load();
    JSZip2.support = require_support();
    JSZip2.defaults = require_defaults();
    JSZip2.version = "3.10.1";
    JSZip2.loadAsync = function(content, options) {
      return new JSZip2().loadAsync(content, options);
    };
    JSZip2.external = require_external();
    module.exports = JSZip2;
  }
});

// forked_pptxtojson/pptxtojson.js
var import_jszip = __toESM(require_lib3(), 1);

// node_modules/txml/dist/txml.mjs
function parse(S, options) {
  "txml";
  options = options || {};
  var pos = options.pos || 0;
  var keepComments = !!options.keepComments;
  var keepWhitespace = !!options.keepWhitespace;
  var openBracket = "<";
  var openBracketCC = "<".charCodeAt(0);
  var closeBracket = ">";
  var closeBracketCC = ">".charCodeAt(0);
  var minusCC = "-".charCodeAt(0);
  var slashCC = "/".charCodeAt(0);
  var exclamationCC = "!".charCodeAt(0);
  var singleQuoteCC = "'".charCodeAt(0);
  var doubleQuoteCC = '"'.charCodeAt(0);
  var openCornerBracketCC = "[".charCodeAt(0);
  var closeCornerBracketCC = "]".charCodeAt(0);
  function parseChildren(tagName) {
    var children = [];
    while (S[pos]) {
      if (S.charCodeAt(pos) == openBracketCC) {
        if (S.charCodeAt(pos + 1) === slashCC) {
          var closeStart = pos + 2;
          pos = S.indexOf(closeBracket, pos);
          var closeTag = S.substring(closeStart, pos);
          if (closeTag.indexOf(tagName) == -1) {
            var parsedText = S.substring(0, pos).split("\n");
            throw new Error(
              "Unexpected close tag\nLine: " + (parsedText.length - 1) + "\nColumn: " + (parsedText[parsedText.length - 1].length + 1) + "\nChar: " + S[pos]
            );
          }
          if (pos + 1) pos += 1;
          return children;
        } else if (S.charCodeAt(pos + 1) === exclamationCC) {
          if (S.charCodeAt(pos + 2) == minusCC) {
            const startCommentPos = pos;
            while (pos !== -1 && !(S.charCodeAt(pos) === closeBracketCC && S.charCodeAt(pos - 1) == minusCC && S.charCodeAt(pos - 2) == minusCC && pos != -1)) {
              pos = S.indexOf(closeBracket, pos + 1);
            }
            if (pos === -1) {
              pos = S.length;
            }
            if (keepComments) {
              children.push(S.substring(startCommentPos, pos + 1));
            }
          } else if (S.charCodeAt(pos + 2) === openCornerBracketCC && S.charCodeAt(pos + 8) === openCornerBracketCC && S.substr(pos + 3, 5).toLowerCase() === "cdata") {
            var cdataEndIndex = S.indexOf("]]>", pos);
            if (cdataEndIndex == -1) {
              children.push(S.substr(pos + 9));
              pos = S.length;
            } else {
              children.push(S.substring(pos + 9, cdataEndIndex));
              pos = cdataEndIndex + 3;
            }
            continue;
          } else {
            const startDoctype = pos + 1;
            pos += 2;
            var encapsuled = false;
            while ((S.charCodeAt(pos) !== closeBracketCC || encapsuled === true) && S[pos]) {
              if (S.charCodeAt(pos) === openCornerBracketCC) {
                encapsuled = true;
              } else if (encapsuled === true && S.charCodeAt(pos) === closeCornerBracketCC) {
                encapsuled = false;
              }
              pos++;
            }
            children.push(S.substring(startDoctype, pos));
          }
          pos++;
          continue;
        }
        var node = parseNode();
        children.push(node);
        if (node.tagName[0] === "?") {
          children.push(...node.children);
          node.children = [];
        }
      } else {
        var text = parseText();
        if (keepWhitespace) {
          if (text.length > 0) {
            children.push(text);
          }
        } else {
          var trimmed = text.trim();
          if (trimmed.length > 0) {
            children.push(trimmed);
          }
        }
        pos++;
      }
    }
    return children;
  }
  function parseText() {
    var start = pos;
    pos = S.indexOf(openBracket, pos) - 1;
    if (pos === -2)
      pos = S.length;
    return S.slice(start, pos + 1);
  }
  var nameSpacer = "\r\n	>/= ";
  function parseName() {
    var start = pos;
    while (nameSpacer.indexOf(S[pos]) === -1 && S[pos]) {
      pos++;
    }
    return S.slice(start, pos);
  }
  var NoChildNodes = options.noChildNodes || ["img", "br", "input", "meta", "link", "hr"];
  function parseNode() {
    pos++;
    const tagName = parseName();
    const attributes = {};
    let children = [];
    while (S.charCodeAt(pos) !== closeBracketCC && S[pos]) {
      var c = S.charCodeAt(pos);
      if (c > 64 && c < 91 || c > 96 && c < 123) {
        var name = parseName();
        var code = S.charCodeAt(pos);
        while (code && code !== singleQuoteCC && code !== doubleQuoteCC && !(code > 64 && code < 91 || code > 96 && code < 123) && code !== closeBracketCC) {
          pos++;
          code = S.charCodeAt(pos);
        }
        if (code === singleQuoteCC || code === doubleQuoteCC) {
          var value = parseString();
          if (pos === -1) {
            return {
              tagName,
              attributes,
              children
            };
          }
        } else {
          value = null;
          pos--;
        }
        attributes[name] = value;
      }
      pos++;
    }
    if (S.charCodeAt(pos - 1) !== slashCC) {
      if (tagName == "script") {
        var start = pos + 1;
        pos = S.indexOf("</script>", pos);
        children = [S.slice(start, pos)];
        pos += 9;
      } else if (tagName == "style") {
        var start = pos + 1;
        pos = S.indexOf("</style>", pos);
        children = [S.slice(start, pos)];
        pos += 8;
      } else if (NoChildNodes.indexOf(tagName) === -1) {
        pos++;
        children = parseChildren(tagName);
      } else {
        pos++;
      }
    } else {
      pos++;
    }
    return {
      tagName,
      attributes,
      children
    };
  }
  function parseString() {
    var startChar = S[pos];
    var startpos = pos + 1;
    pos = S.indexOf(startChar, startpos);
    return S.slice(startpos, pos);
  }
  function findElements() {
    var r = new RegExp("\\s" + options.attrName + `\\s*=['"]` + options.attrValue + `['"]`).exec(S);
    if (r) {
      return r.index;
    } else {
      return -1;
    }
  }
  var out = null;
  if (options.attrValue !== void 0) {
    options.attrName = options.attrName || "id";
    var out = [];
    while ((pos = findElements()) !== -1) {
      pos = S.lastIndexOf("<", pos);
      if (pos !== -1) {
        out.push(parseNode());
      }
      S = S.substr(pos);
      pos = 0;
    }
  } else if (options.parseNode) {
    out = parseNode();
  } else {
    out = parseChildren("");
  }
  if (options.filter) {
    out = filter(out, options.filter);
  }
  if (options.simplify) {
    return simplify(Array.isArray(out) ? out : [out]);
  }
  if (options.setPos) {
    out.pos = pos;
  }
  return out;
}
function simplify(children) {
  var out = {};
  if (!children.length) {
    return "";
  }
  if (children.length === 1 && typeof children[0] == "string") {
    return children[0];
  }
  children.forEach(function(child) {
    if (typeof child !== "object") {
      return;
    }
    if (!out[child.tagName])
      out[child.tagName] = [];
    var kids = simplify(child.children);
    out[child.tagName].push(kids);
    if (Object.keys(child.attributes).length && typeof kids !== "string") {
      kids._attributes = child.attributes;
    }
  });
  for (var i in out) {
    if (out[i].length == 1) {
      out[i] = out[i][0];
    }
  }
  return out;
}
function filter(children, f, dept = 0, path = "") {
  var out = [];
  children.forEach(function(child, i) {
    if (typeof child === "object" && f(child, i, dept, path)) out.push(child);
    if (child.children) {
      var kids = filter(child.children, f, dept + 1, (path ? path + "." : "") + i + "." + child.tagName);
      out = out.concat(kids);
    }
  });
  return out;
}

// forked_pptxtojson/readXmlFile.js
var cust_attr_order = 0;
function isWhitespaceTextNode(node) {
  return typeof node === "string" && node.trim() === "";
}
function simplifyLostLess(children, parentAttributes = {}) {
  const out = {};
  if (!children.length) return out;
  if (children.length === 1 && typeof children[0] === "string") {
    return Object.keys(parentAttributes).length ? {
      attrs: { order: cust_attr_order++, ...parentAttributes },
      value: children[0]
    } : children[0];
  }
  for (const child of children) {
    if (isWhitespaceTextNode(child)) continue;
    if (typeof child !== "object") return;
    if (child.tagName === "?xml") continue;
    if (!out[child.tagName]) out[child.tagName] = [];
    const kids = simplifyLostLess(child.children || [], child.attributes);
    if (typeof kids === "object") {
      if (!kids.attrs) kids.attrs = { order: cust_attr_order++ };
      else kids.attrs.order = cust_attr_order++;
    }
    if (Object.keys(child.attributes || {}).length) {
      kids.attrs = { ...kids.attrs, ...child.attributes };
    }
    out[child.tagName].push(kids);
  }
  for (const child in out) {
    if (out[child].length === 1) out[child] = out[child][0];
  }
  return out;
}
async function readXmlFile(zip, filename) {
  try {
    const data = await zip.file(filename).async("string");
    return simplifyLostLess(parse(data, { keepWhitespace: true }));
  } catch {
    return null;
  }
}

// node_modules/tinycolor2/esm/tinycolor.js
function _typeof(obj) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof(obj);
}
var trimLeft = /^\s+/;
var trimRight = /\s+$/;
function tinycolor(color, opts) {
  color = color ? color : "";
  opts = opts || {};
  if (color instanceof tinycolor) {
    return color;
  }
  if (!(this instanceof tinycolor)) {
    return new tinycolor(color, opts);
  }
  var rgb = inputToRGB(color);
  this._originalInput = color, this._r = rgb.r, this._g = rgb.g, this._b = rgb.b, this._a = rgb.a, this._roundA = Math.round(100 * this._a) / 100, this._format = opts.format || rgb.format;
  this._gradientType = opts.gradientType;
  if (this._r < 1) this._r = Math.round(this._r);
  if (this._g < 1) this._g = Math.round(this._g);
  if (this._b < 1) this._b = Math.round(this._b);
  this._ok = rgb.ok;
}
tinycolor.prototype = {
  isDark: function isDark() {
    return this.getBrightness() < 128;
  },
  isLight: function isLight() {
    return !this.isDark();
  },
  isValid: function isValid() {
    return this._ok;
  },
  getOriginalInput: function getOriginalInput() {
    return this._originalInput;
  },
  getFormat: function getFormat() {
    return this._format;
  },
  getAlpha: function getAlpha() {
    return this._a;
  },
  getBrightness: function getBrightness() {
    var rgb = this.toRgb();
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
  },
  getLuminance: function getLuminance() {
    var rgb = this.toRgb();
    var RsRGB, GsRGB, BsRGB, R, G, B;
    RsRGB = rgb.r / 255;
    GsRGB = rgb.g / 255;
    BsRGB = rgb.b / 255;
    if (RsRGB <= 0.03928) R = RsRGB / 12.92;
    else R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    if (GsRGB <= 0.03928) G = GsRGB / 12.92;
    else G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    if (BsRGB <= 0.03928) B = BsRGB / 12.92;
    else B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  },
  setAlpha: function setAlpha(value) {
    this._a = boundAlpha(value);
    this._roundA = Math.round(100 * this._a) / 100;
    return this;
  },
  toHsv: function toHsv() {
    var hsv = rgbToHsv(this._r, this._g, this._b);
    return {
      h: hsv.h * 360,
      s: hsv.s,
      v: hsv.v,
      a: this._a
    };
  },
  toHsvString: function toHsvString() {
    var hsv = rgbToHsv(this._r, this._g, this._b);
    var h = Math.round(hsv.h * 360), s = Math.round(hsv.s * 100), v = Math.round(hsv.v * 100);
    return this._a == 1 ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this._roundA + ")";
  },
  toHsl: function toHsl() {
    var hsl = rgbToHsl(this._r, this._g, this._b);
    return {
      h: hsl.h * 360,
      s: hsl.s,
      l: hsl.l,
      a: this._a
    };
  },
  toHslString: function toHslString() {
    var hsl = rgbToHsl(this._r, this._g, this._b);
    var h = Math.round(hsl.h * 360), s = Math.round(hsl.s * 100), l = Math.round(hsl.l * 100);
    return this._a == 1 ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this._roundA + ")";
  },
  toHex: function toHex(allow3Char) {
    return rgbToHex(this._r, this._g, this._b, allow3Char);
  },
  toHexString: function toHexString(allow3Char) {
    return "#" + this.toHex(allow3Char);
  },
  toHex8: function toHex8(allow4Char) {
    return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
  },
  toHex8String: function toHex8String(allow4Char) {
    return "#" + this.toHex8(allow4Char);
  },
  toRgb: function toRgb() {
    return {
      r: Math.round(this._r),
      g: Math.round(this._g),
      b: Math.round(this._b),
      a: this._a
    };
  },
  toRgbString: function toRgbString() {
    return this._a == 1 ? "rgb(" + Math.round(this._r) + ", " + Math.round(this._g) + ", " + Math.round(this._b) + ")" : "rgba(" + Math.round(this._r) + ", " + Math.round(this._g) + ", " + Math.round(this._b) + ", " + this._roundA + ")";
  },
  toPercentageRgb: function toPercentageRgb() {
    return {
      r: Math.round(bound01(this._r, 255) * 100) + "%",
      g: Math.round(bound01(this._g, 255) * 100) + "%",
      b: Math.round(bound01(this._b, 255) * 100) + "%",
      a: this._a
    };
  },
  toPercentageRgbString: function toPercentageRgbString() {
    return this._a == 1 ? "rgb(" + Math.round(bound01(this._r, 255) * 100) + "%, " + Math.round(bound01(this._g, 255) * 100) + "%, " + Math.round(bound01(this._b, 255) * 100) + "%)" : "rgba(" + Math.round(bound01(this._r, 255) * 100) + "%, " + Math.round(bound01(this._g, 255) * 100) + "%, " + Math.round(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
  },
  toName: function toName() {
    if (this._a === 0) {
      return "transparent";
    }
    if (this._a < 1) {
      return false;
    }
    return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
  },
  toFilter: function toFilter(secondColor) {
    var hex8String = "#" + rgbaToArgbHex(this._r, this._g, this._b, this._a);
    var secondHex8String = hex8String;
    var gradientType = this._gradientType ? "GradientType = 1, " : "";
    if (secondColor) {
      var s = tinycolor(secondColor);
      secondHex8String = "#" + rgbaToArgbHex(s._r, s._g, s._b, s._a);
    }
    return "progid:DXImageTransform.Microsoft.gradient(" + gradientType + "startColorstr=" + hex8String + ",endColorstr=" + secondHex8String + ")";
  },
  toString: function toString(format) {
    var formatSet = !!format;
    format = format || this._format;
    var formattedString = false;
    var hasAlpha = this._a < 1 && this._a >= 0;
    var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");
    if (needsAlphaFormat) {
      if (format === "name" && this._a === 0) {
        return this.toName();
      }
      return this.toRgbString();
    }
    if (format === "rgb") {
      formattedString = this.toRgbString();
    }
    if (format === "prgb") {
      formattedString = this.toPercentageRgbString();
    }
    if (format === "hex" || format === "hex6") {
      formattedString = this.toHexString();
    }
    if (format === "hex3") {
      formattedString = this.toHexString(true);
    }
    if (format === "hex4") {
      formattedString = this.toHex8String(true);
    }
    if (format === "hex8") {
      formattedString = this.toHex8String();
    }
    if (format === "name") {
      formattedString = this.toName();
    }
    if (format === "hsl") {
      formattedString = this.toHslString();
    }
    if (format === "hsv") {
      formattedString = this.toHsvString();
    }
    return formattedString || this.toHexString();
  },
  clone: function clone() {
    return tinycolor(this.toString());
  },
  _applyModification: function _applyModification(fn, args) {
    var color = fn.apply(null, [this].concat([].slice.call(args)));
    this._r = color._r;
    this._g = color._g;
    this._b = color._b;
    this.setAlpha(color._a);
    return this;
  },
  lighten: function lighten() {
    return this._applyModification(_lighten, arguments);
  },
  brighten: function brighten() {
    return this._applyModification(_brighten, arguments);
  },
  darken: function darken() {
    return this._applyModification(_darken, arguments);
  },
  desaturate: function desaturate() {
    return this._applyModification(_desaturate, arguments);
  },
  saturate: function saturate() {
    return this._applyModification(_saturate, arguments);
  },
  greyscale: function greyscale() {
    return this._applyModification(_greyscale, arguments);
  },
  spin: function spin() {
    return this._applyModification(_spin, arguments);
  },
  _applyCombination: function _applyCombination(fn, args) {
    return fn.apply(null, [this].concat([].slice.call(args)));
  },
  analogous: function analogous() {
    return this._applyCombination(_analogous, arguments);
  },
  complement: function complement() {
    return this._applyCombination(_complement, arguments);
  },
  monochromatic: function monochromatic() {
    return this._applyCombination(_monochromatic, arguments);
  },
  splitcomplement: function splitcomplement() {
    return this._applyCombination(_splitcomplement, arguments);
  },
  // Disabled until https://github.com/bgrins/TinyColor/issues/254
  // polyad: function (number) {
  //   return this._applyCombination(polyad, [number]);
  // },
  triad: function triad() {
    return this._applyCombination(polyad, [3]);
  },
  tetrad: function tetrad() {
    return this._applyCombination(polyad, [4]);
  }
};
tinycolor.fromRatio = function(color, opts) {
  if (_typeof(color) == "object") {
    var newColor = {};
    for (var i in color) {
      if (color.hasOwnProperty(i)) {
        if (i === "a") {
          newColor[i] = color[i];
        } else {
          newColor[i] = convertToPercentage(color[i]);
        }
      }
    }
    color = newColor;
  }
  return tinycolor(color, opts);
};
function inputToRGB(color) {
  var rgb = {
    r: 0,
    g: 0,
    b: 0
  };
  var a = 1;
  var s = null;
  var v = null;
  var l = null;
  var ok = false;
  var format = false;
  if (typeof color == "string") {
    color = stringInputToObject(color);
  }
  if (_typeof(color) == "object") {
    if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
      rgb = rgbToRgb(color.r, color.g, color.b);
      ok = true;
      format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
      s = convertToPercentage(color.s);
      v = convertToPercentage(color.v);
      rgb = hsvToRgb(color.h, s, v);
      ok = true;
      format = "hsv";
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
      s = convertToPercentage(color.s);
      l = convertToPercentage(color.l);
      rgb = hslToRgb(color.h, s, l);
      ok = true;
      format = "hsl";
    }
    if (color.hasOwnProperty("a")) {
      a = color.a;
    }
  }
  a = boundAlpha(a);
  return {
    ok,
    format: color.format || format,
    r: Math.min(255, Math.max(rgb.r, 0)),
    g: Math.min(255, Math.max(rgb.g, 0)),
    b: Math.min(255, Math.max(rgb.b, 0)),
    a
  };
}
function rgbToRgb(r, g, b) {
  return {
    r: bound01(r, 255) * 255,
    g: bound01(g, 255) * 255,
    b: bound01(b, 255) * 255
  };
}
function rgbToHsl(r, g, b) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;
  if (max == min) {
    h = s = 0;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h,
    s,
    l
  };
}
function hslToRgb(h, s, l) {
  var r, g, b;
  h = bound01(h, 360);
  s = bound01(s, 100);
  l = bound01(l, 100);
  function hue2rgb(p2, q2, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p2 + (q2 - p2) * 6 * t;
    if (t < 1 / 2) return q2;
    if (t < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - t) * 6;
    return p2;
  }
  if (s === 0) {
    r = g = b = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: r * 255,
    g: g * 255,
    b: b * 255
  };
}
function rgbToHsv(r, g, b) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;
  var d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max == min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h,
    s,
    v
  };
}
function hsvToRgb(h, s, v) {
  h = bound01(h, 360) * 6;
  s = bound01(s, 100);
  v = bound01(v, 100);
  var i = Math.floor(h), f = h - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s), mod = i % 6, r = [v, q, p, p, t, v][mod], g = [t, v, v, q, p, p][mod], b = [p, p, t, v, v, q][mod];
  return {
    r: r * 255,
    g: g * 255,
    b: b * 255
  };
}
function rgbToHex(r, g, b, allow3Char) {
  var hex = [pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16))];
  if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
  }
  return hex.join("");
}
function rgbaToHex(r, g, b, a, allow4Char) {
  var hex = [pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16)), pad2(convertDecimalToHex(a))];
  if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
  }
  return hex.join("");
}
function rgbaToArgbHex(r, g, b, a) {
  var hex = [pad2(convertDecimalToHex(a)), pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16))];
  return hex.join("");
}
tinycolor.equals = function(color1, color2) {
  if (!color1 || !color2) return false;
  return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
};
tinycolor.random = function() {
  return tinycolor.fromRatio({
    r: Math.random(),
    g: Math.random(),
    b: Math.random()
  });
};
function _desaturate(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var hsl = tinycolor(color).toHsl();
  hsl.s -= amount / 100;
  hsl.s = clamp01(hsl.s);
  return tinycolor(hsl);
}
function _saturate(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var hsl = tinycolor(color).toHsl();
  hsl.s += amount / 100;
  hsl.s = clamp01(hsl.s);
  return tinycolor(hsl);
}
function _greyscale(color) {
  return tinycolor(color).desaturate(100);
}
function _lighten(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var hsl = tinycolor(color).toHsl();
  hsl.l += amount / 100;
  hsl.l = clamp01(hsl.l);
  return tinycolor(hsl);
}
function _brighten(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var rgb = tinycolor(color).toRgb();
  rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
  rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
  rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
  return tinycolor(rgb);
}
function _darken(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var hsl = tinycolor(color).toHsl();
  hsl.l -= amount / 100;
  hsl.l = clamp01(hsl.l);
  return tinycolor(hsl);
}
function _spin(color, amount) {
  var hsl = tinycolor(color).toHsl();
  var hue = (hsl.h + amount) % 360;
  hsl.h = hue < 0 ? 360 + hue : hue;
  return tinycolor(hsl);
}
function _complement(color) {
  var hsl = tinycolor(color).toHsl();
  hsl.h = (hsl.h + 180) % 360;
  return tinycolor(hsl);
}
function polyad(color, number) {
  if (isNaN(number) || number <= 0) {
    throw new Error("Argument to polyad must be a positive number");
  }
  var hsl = tinycolor(color).toHsl();
  var result = [tinycolor(color)];
  var step = 360 / number;
  for (var i = 1; i < number; i++) {
    result.push(tinycolor({
      h: (hsl.h + i * step) % 360,
      s: hsl.s,
      l: hsl.l
    }));
  }
  return result;
}
function _splitcomplement(color) {
  var hsl = tinycolor(color).toHsl();
  var h = hsl.h;
  return [tinycolor(color), tinycolor({
    h: (h + 72) % 360,
    s: hsl.s,
    l: hsl.l
  }), tinycolor({
    h: (h + 216) % 360,
    s: hsl.s,
    l: hsl.l
  })];
}
function _analogous(color, results, slices) {
  results = results || 6;
  slices = slices || 30;
  var hsl = tinycolor(color).toHsl();
  var part = 360 / slices;
  var ret = [tinycolor(color)];
  for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results; ) {
    hsl.h = (hsl.h + part) % 360;
    ret.push(tinycolor(hsl));
  }
  return ret;
}
function _monochromatic(color, results) {
  results = results || 6;
  var hsv = tinycolor(color).toHsv();
  var h = hsv.h, s = hsv.s, v = hsv.v;
  var ret = [];
  var modification = 1 / results;
  while (results--) {
    ret.push(tinycolor({
      h,
      s,
      v
    }));
    v = (v + modification) % 1;
  }
  return ret;
}
tinycolor.mix = function(color1, color2, amount) {
  amount = amount === 0 ? 0 : amount || 50;
  var rgb1 = tinycolor(color1).toRgb();
  var rgb2 = tinycolor(color2).toRgb();
  var p = amount / 100;
  var rgba = {
    r: (rgb2.r - rgb1.r) * p + rgb1.r,
    g: (rgb2.g - rgb1.g) * p + rgb1.g,
    b: (rgb2.b - rgb1.b) * p + rgb1.b,
    a: (rgb2.a - rgb1.a) * p + rgb1.a
  };
  return tinycolor(rgba);
};
tinycolor.readability = function(color1, color2) {
  var c1 = tinycolor(color1);
  var c2 = tinycolor(color2);
  return (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05);
};
tinycolor.isReadable = function(color1, color2, wcag2) {
  var readability = tinycolor.readability(color1, color2);
  var wcag2Parms, out;
  out = false;
  wcag2Parms = validateWCAG2Parms(wcag2);
  switch (wcag2Parms.level + wcag2Parms.size) {
    case "AAsmall":
    case "AAAlarge":
      out = readability >= 4.5;
      break;
    case "AAlarge":
      out = readability >= 3;
      break;
    case "AAAsmall":
      out = readability >= 7;
      break;
  }
  return out;
};
tinycolor.mostReadable = function(baseColor, colorList, args) {
  var bestColor = null;
  var bestScore = 0;
  var readability;
  var includeFallbackColors, level, size;
  args = args || {};
  includeFallbackColors = args.includeFallbackColors;
  level = args.level;
  size = args.size;
  for (var i = 0; i < colorList.length; i++) {
    readability = tinycolor.readability(baseColor, colorList[i]);
    if (readability > bestScore) {
      bestScore = readability;
      bestColor = tinycolor(colorList[i]);
    }
  }
  if (tinycolor.isReadable(baseColor, bestColor, {
    level,
    size
  }) || !includeFallbackColors) {
    return bestColor;
  } else {
    args.includeFallbackColors = false;
    return tinycolor.mostReadable(baseColor, ["#fff", "#000"], args);
  }
};
var names = tinycolor.names = {
  aliceblue: "f0f8ff",
  antiquewhite: "faebd7",
  aqua: "0ff",
  aquamarine: "7fffd4",
  azure: "f0ffff",
  beige: "f5f5dc",
  bisque: "ffe4c4",
  black: "000",
  blanchedalmond: "ffebcd",
  blue: "00f",
  blueviolet: "8a2be2",
  brown: "a52a2a",
  burlywood: "deb887",
  burntsienna: "ea7e5d",
  cadetblue: "5f9ea0",
  chartreuse: "7fff00",
  chocolate: "d2691e",
  coral: "ff7f50",
  cornflowerblue: "6495ed",
  cornsilk: "fff8dc",
  crimson: "dc143c",
  cyan: "0ff",
  darkblue: "00008b",
  darkcyan: "008b8b",
  darkgoldenrod: "b8860b",
  darkgray: "a9a9a9",
  darkgreen: "006400",
  darkgrey: "a9a9a9",
  darkkhaki: "bdb76b",
  darkmagenta: "8b008b",
  darkolivegreen: "556b2f",
  darkorange: "ff8c00",
  darkorchid: "9932cc",
  darkred: "8b0000",
  darksalmon: "e9967a",
  darkseagreen: "8fbc8f",
  darkslateblue: "483d8b",
  darkslategray: "2f4f4f",
  darkslategrey: "2f4f4f",
  darkturquoise: "00ced1",
  darkviolet: "9400d3",
  deeppink: "ff1493",
  deepskyblue: "00bfff",
  dimgray: "696969",
  dimgrey: "696969",
  dodgerblue: "1e90ff",
  firebrick: "b22222",
  floralwhite: "fffaf0",
  forestgreen: "228b22",
  fuchsia: "f0f",
  gainsboro: "dcdcdc",
  ghostwhite: "f8f8ff",
  gold: "ffd700",
  goldenrod: "daa520",
  gray: "808080",
  green: "008000",
  greenyellow: "adff2f",
  grey: "808080",
  honeydew: "f0fff0",
  hotpink: "ff69b4",
  indianred: "cd5c5c",
  indigo: "4b0082",
  ivory: "fffff0",
  khaki: "f0e68c",
  lavender: "e6e6fa",
  lavenderblush: "fff0f5",
  lawngreen: "7cfc00",
  lemonchiffon: "fffacd",
  lightblue: "add8e6",
  lightcoral: "f08080",
  lightcyan: "e0ffff",
  lightgoldenrodyellow: "fafad2",
  lightgray: "d3d3d3",
  lightgreen: "90ee90",
  lightgrey: "d3d3d3",
  lightpink: "ffb6c1",
  lightsalmon: "ffa07a",
  lightseagreen: "20b2aa",
  lightskyblue: "87cefa",
  lightslategray: "789",
  lightslategrey: "789",
  lightsteelblue: "b0c4de",
  lightyellow: "ffffe0",
  lime: "0f0",
  limegreen: "32cd32",
  linen: "faf0e6",
  magenta: "f0f",
  maroon: "800000",
  mediumaquamarine: "66cdaa",
  mediumblue: "0000cd",
  mediumorchid: "ba55d3",
  mediumpurple: "9370db",
  mediumseagreen: "3cb371",
  mediumslateblue: "7b68ee",
  mediumspringgreen: "00fa9a",
  mediumturquoise: "48d1cc",
  mediumvioletred: "c71585",
  midnightblue: "191970",
  mintcream: "f5fffa",
  mistyrose: "ffe4e1",
  moccasin: "ffe4b5",
  navajowhite: "ffdead",
  navy: "000080",
  oldlace: "fdf5e6",
  olive: "808000",
  olivedrab: "6b8e23",
  orange: "ffa500",
  orangered: "ff4500",
  orchid: "da70d6",
  palegoldenrod: "eee8aa",
  palegreen: "98fb98",
  paleturquoise: "afeeee",
  palevioletred: "db7093",
  papayawhip: "ffefd5",
  peachpuff: "ffdab9",
  peru: "cd853f",
  pink: "ffc0cb",
  plum: "dda0dd",
  powderblue: "b0e0e6",
  purple: "800080",
  rebeccapurple: "663399",
  red: "f00",
  rosybrown: "bc8f8f",
  royalblue: "4169e1",
  saddlebrown: "8b4513",
  salmon: "fa8072",
  sandybrown: "f4a460",
  seagreen: "2e8b57",
  seashell: "fff5ee",
  sienna: "a0522d",
  silver: "c0c0c0",
  skyblue: "87ceeb",
  slateblue: "6a5acd",
  slategray: "708090",
  slategrey: "708090",
  snow: "fffafa",
  springgreen: "00ff7f",
  steelblue: "4682b4",
  tan: "d2b48c",
  teal: "008080",
  thistle: "d8bfd8",
  tomato: "ff6347",
  turquoise: "40e0d0",
  violet: "ee82ee",
  wheat: "f5deb3",
  white: "fff",
  whitesmoke: "f5f5f5",
  yellow: "ff0",
  yellowgreen: "9acd32"
};
var hexNames = tinycolor.hexNames = flip(names);
function flip(o) {
  var flipped = {};
  for (var i in o) {
    if (o.hasOwnProperty(i)) {
      flipped[o[i]] = i;
    }
  }
  return flipped;
}
function boundAlpha(a) {
  a = parseFloat(a);
  if (isNaN(a) || a < 0 || a > 1) {
    a = 1;
  }
  return a;
}
function bound01(n, max) {
  if (isOnePointZero(n)) n = "100%";
  var processPercent = isPercentage(n);
  n = Math.min(max, Math.max(0, parseFloat(n)));
  if (processPercent) {
    n = parseInt(n * max, 10) / 100;
  }
  if (Math.abs(n - max) < 1e-6) {
    return 1;
  }
  return n % max / parseFloat(max);
}
function clamp01(val) {
  return Math.min(1, Math.max(0, val));
}
function parseIntFromHex(val) {
  return parseInt(val, 16);
}
function isOnePointZero(n) {
  return typeof n == "string" && n.indexOf(".") != -1 && parseFloat(n) === 1;
}
function isPercentage(n) {
  return typeof n === "string" && n.indexOf("%") != -1;
}
function pad2(c) {
  return c.length == 1 ? "0" + c : "" + c;
}
function convertToPercentage(n) {
  if (n <= 1) {
    n = n * 100 + "%";
  }
  return n;
}
function convertDecimalToHex(d) {
  return Math.round(parseFloat(d) * 255).toString(16);
}
function convertHexToDecimal(h) {
  return parseIntFromHex(h) / 255;
}
var matchers = (function() {
  var CSS_INTEGER = "[-\\+]?\\d+%?";
  var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
  var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
  var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
  var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
  return {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
    rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
    hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
    hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
    hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
    hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
  };
})();
function isValidCSSUnit(color) {
  return !!matchers.CSS_UNIT.exec(color);
}
function stringInputToObject(color) {
  color = color.replace(trimLeft, "").replace(trimRight, "").toLowerCase();
  var named = false;
  if (names[color]) {
    color = names[color];
    named = true;
  } else if (color == "transparent") {
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
      format: "name"
    };
  }
  var match;
  if (match = matchers.rgb.exec(color)) {
    return {
      r: match[1],
      g: match[2],
      b: match[3]
    };
  }
  if (match = matchers.rgba.exec(color)) {
    return {
      r: match[1],
      g: match[2],
      b: match[3],
      a: match[4]
    };
  }
  if (match = matchers.hsl.exec(color)) {
    return {
      h: match[1],
      s: match[2],
      l: match[3]
    };
  }
  if (match = matchers.hsla.exec(color)) {
    return {
      h: match[1],
      s: match[2],
      l: match[3],
      a: match[4]
    };
  }
  if (match = matchers.hsv.exec(color)) {
    return {
      h: match[1],
      s: match[2],
      v: match[3]
    };
  }
  if (match = matchers.hsva.exec(color)) {
    return {
      h: match[1],
      s: match[2],
      v: match[3],
      a: match[4]
    };
  }
  if (match = matchers.hex8.exec(color)) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      a: convertHexToDecimal(match[4]),
      format: named ? "name" : "hex8"
    };
  }
  if (match = matchers.hex6.exec(color)) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      format: named ? "name" : "hex"
    };
  }
  if (match = matchers.hex4.exec(color)) {
    return {
      r: parseIntFromHex(match[1] + "" + match[1]),
      g: parseIntFromHex(match[2] + "" + match[2]),
      b: parseIntFromHex(match[3] + "" + match[3]),
      a: convertHexToDecimal(match[4] + "" + match[4]),
      format: named ? "name" : "hex8"
    };
  }
  if (match = matchers.hex3.exec(color)) {
    return {
      r: parseIntFromHex(match[1] + "" + match[1]),
      g: parseIntFromHex(match[2] + "" + match[2]),
      b: parseIntFromHex(match[3] + "" + match[3]),
      format: named ? "name" : "hex"
    };
  }
  return false;
}
function validateWCAG2Parms(parms) {
  var level, size;
  parms = parms || {
    level: "AA",
    size: "small"
  };
  level = (parms.level || "AA").toUpperCase();
  size = (parms.size || "small").toLowerCase();
  if (level !== "AA" && level !== "AAA") {
    level = "AA";
  }
  if (size !== "small" && size !== "large") {
    size = "small";
  }
  return {
    level,
    size
  };
}

// forked_pptxtojson/utils.js
function base64ArrayBuffer(arrayBuffer) {
  const encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const bytes = new Uint8Array(arrayBuffer);
  const byteLength = bytes.byteLength;
  const byteRemainder = byteLength % 3;
  const mainLength = byteLength - byteRemainder;
  let base64 = "";
  let a, b, c, d;
  let chunk;
  for (let i = 0; i < mainLength; i = i + 3) {
    chunk = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
    a = (chunk & 16515072) >> 18;
    b = (chunk & 258048) >> 12;
    c = (chunk & 4032) >> 6;
    d = chunk & 63;
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }
  if (byteRemainder === 1) {
    chunk = bytes[mainLength];
    a = (chunk & 252) >> 2;
    b = (chunk & 3) << 4;
    base64 += encodings[a] + encodings[b] + "==";
  } else if (byteRemainder === 2) {
    chunk = bytes[mainLength] << 8 | bytes[mainLength + 1];
    a = (chunk & 64512) >> 10;
    b = (chunk & 1008) >> 4;
    c = (chunk & 15) << 2;
    base64 += encodings[a] + encodings[b] + encodings[c] + "=";
  }
  return base64;
}
function extractFileExtension(filename) {
  return filename.substr((~-filename.lastIndexOf(".") >>> 0) + 2);
}
function eachElement(node, func) {
  if (!node) return node;
  let result = "";
  if (node.constructor === Array) {
    for (let i = 0; i < node.length; i++) {
      result += func(node[i], i);
    }
  } else result += func(node, 0);
  return result;
}
function getTextByPathList(node, path) {
  if (!node) return node;
  for (const key of path) {
    node = node[key];
    if (!node) return node;
  }
  return node;
}
function angleToDegrees(angle) {
  if (!angle) return 0;
  return Math.round(angle / 6e4);
}
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
function getMimeType(imgFileExt) {
  let mimeType = "";
  switch (imgFileExt.toLowerCase()) {
    case "jpg":
    case "jpeg":
      mimeType = "image/jpeg";
      break;
    case "png":
      mimeType = "image/png";
      break;
    case "gif":
      mimeType = "image/gif";
      break;
    case "emf":
      mimeType = "image/x-emf";
      break;
    case "wmf":
      mimeType = "image/x-wmf";
      break;
    case "svg":
      mimeType = "image/svg+xml";
      break;
    case "mp4":
      mimeType = "video/mp4";
      break;
    case "webm":
      mimeType = "video/webm";
      break;
    case "ogg":
      mimeType = "video/ogg";
      break;
    case "avi":
      mimeType = "video/avi";
      break;
    case "mpg":
      mimeType = "video/mpg";
      break;
    case "wmv":
      mimeType = "video/wmv";
      break;
    case "mp3":
      mimeType = "audio/mpeg";
      break;
    case "wav":
      mimeType = "audio/wav";
      break;
    case "tif":
      mimeType = "image/tiff";
      break;
    case "tiff":
      mimeType = "image/tiff";
      break;
    default:
  }
  return mimeType;
}
function isVideoLink(vdoFile) {
  const urlRegex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlRegex.test(vdoFile);
}
function toHex2(n) {
  let hex = n.toString(16);
  while (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
}
function hasValidText(htmlString) {
  if (typeof DOMParser === "undefined") {
    const text2 = htmlString.replace(/<[^>]+>/g, "").replace(/\s+/g, " ");
    return text2.trim() !== "";
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const text = doc.body.textContent || doc.body.innerText;
  return text.trim() !== "";
}
function numberToFixed(num, fractionDigits = 4) {
  return parseFloat(num.toFixed(fractionDigits));
}

// forked_pptxtojson/schemeColor.js
function getSchemeColorFromTheme(schemeClr, warpObj, clrMap, phClr) {
  let color;
  let slideLayoutClrOvride;
  if (clrMap) slideLayoutClrOvride = clrMap;
  else {
    let sldClrMapOvr = getTextByPathList(warpObj["slideContent"], ["p:sld", "p:clrMapOvr", "a:overrideClrMapping", "attrs"]);
    if (sldClrMapOvr) slideLayoutClrOvride = sldClrMapOvr;
    else {
      sldClrMapOvr = getTextByPathList(warpObj["slideLayoutContent"], ["p:sldLayout", "p:clrMapOvr", "a:overrideClrMapping", "attrs"]);
      if (sldClrMapOvr) slideLayoutClrOvride = sldClrMapOvr;
      else {
        slideLayoutClrOvride = getTextByPathList(warpObj["slideMasterContent"], ["p:sldMaster", "p:clrMap", "attrs"]);
      }
    }
  }
  const schmClrName = schemeClr.substr(2);
  if (schmClrName === "phClr" && phClr) color = phClr;
  else {
    if (slideLayoutClrOvride) {
      switch (schmClrName) {
        case "tx1":
        case "tx2":
        case "bg1":
        case "bg2":
          schemeClr = "a:" + slideLayoutClrOvride[schmClrName];
          break;
        default:
          break;
      }
    } else {
      switch (schmClrName) {
        case "tx1":
          schemeClr = "a:dk1";
          break;
        case "tx2":
          schemeClr = "a:dk2";
          break;
        case "bg1":
          schemeClr = "a:lt1";
          break;
        case "bg2":
          schemeClr = "a:lt2";
          break;
        default:
          break;
      }
    }
    const refNode = getTextByPathList(warpObj["themeContent"], ["a:theme", "a:themeElements", "a:clrScheme", schemeClr]);
    color = getTextByPathList(refNode, ["a:srgbClr", "attrs", "val"]);
    if (!color && refNode) color = getTextByPathList(refNode, ["a:sysClr", "attrs", "lastClr"]);
  }
  return color;
}

// forked_pptxtojson/border.js
function getBorder(node, elType, warpObj) {
  let lineNode = getTextByPathList(node, ["p:spPr", "a:ln"]);
  if (!lineNode) {
    const lnRefNode = getTextByPathList(node, ["p:style", "a:lnRef"]);
    if (lnRefNode) {
      const lnIdx = getTextByPathList(lnRefNode, ["attrs", "idx"]);
      lineNode = warpObj["themeContent"]["a:theme"]["a:themeElements"]["a:fmtScheme"]["a:lnStyleLst"]["a:ln"][Number(lnIdx) - 1];
    }
  }
  if (!lineNode) lineNode = node;
  const isNoFill = getTextByPathList(lineNode, ["a:noFill"]);
  let borderWidth = isNoFill ? 0 : parseInt(getTextByPathList(lineNode, ["attrs", "w"])) / 12700;
  if (isNaN(borderWidth)) {
    if (lineNode) borderWidth = 0;
    else if (elType !== "obj") borderWidth = 0;
    else borderWidth = 1;
  }
  let borderColor = getTextByPathList(lineNode, ["a:solidFill", "a:srgbClr", "attrs", "val"]);
  if (!borderColor) {
    const schemeClrNode = getTextByPathList(lineNode, ["a:solidFill", "a:schemeClr"]);
    const schemeClr = "a:" + getTextByPathList(schemeClrNode, ["attrs", "val"]);
    borderColor = getSchemeColorFromTheme(schemeClr, warpObj);
  }
  if (!borderColor) {
    const schemeClrNode = getTextByPathList(node, ["p:style", "a:lnRef", "a:schemeClr"]);
    const schemeClr = "a:" + getTextByPathList(schemeClrNode, ["attrs", "val"]);
    borderColor = getSchemeColorFromTheme(schemeClr, warpObj);
    if (borderColor) {
      let shade = getTextByPathList(schemeClrNode, ["a:shade", "attrs", "val"]);
      if (shade) {
        shade = parseInt(shade) / 1e5;
        const color = tinycolor("#" + borderColor).toHsl();
        borderColor = tinycolor({ h: color.h, s: color.s, l: color.l * shade, a: color.a }).toHex();
      }
    }
  }
  if (!borderColor) borderColor = "#000000";
  else borderColor = `#${borderColor}`;
  const type = getTextByPathList(lineNode, ["a:prstDash", "attrs", "val"]);
  let borderType = "solid";
  let strokeDasharray = "0";
  switch (type) {
    case "solid":
      borderType = "solid";
      strokeDasharray = "0";
      break;
    case "dash":
      borderType = "dashed";
      strokeDasharray = "5";
      break;
    case "dashDot":
      borderType = "dashed";
      strokeDasharray = "5, 5, 1, 5";
      break;
    case "dot":
      borderType = "dotted";
      strokeDasharray = "1, 5";
      break;
    case "lgDash":
      borderType = "dashed";
      strokeDasharray = "10, 5";
      break;
    case "lgDashDotDot":
      borderType = "dotted";
      strokeDasharray = "10, 5, 1, 5, 1, 5";
      break;
    case "sysDash":
      borderType = "dashed";
      strokeDasharray = "5, 2";
      break;
    case "sysDashDot":
      borderType = "dotted";
      strokeDasharray = "5, 2, 1, 5";
      break;
    case "sysDashDotDot":
      borderType = "dotted";
      strokeDasharray = "5, 2, 1, 5, 1, 5";
      break;
    case "sysDot":
      borderType = "dotted";
      strokeDasharray = "2, 5";
      break;
    default:
  }
  return {
    borderColor,
    borderWidth,
    borderType,
    strokeDasharray
  };
}

// forked_pptxtojson/color.js
function hueToRgb(t1, t2, hue) {
  if (hue < 0) hue += 6;
  if (hue >= 6) hue -= 6;
  if (hue < 1) return (t2 - t1) * hue + t1;
  else if (hue < 3) return t2;
  else if (hue < 4) return (t2 - t1) * (4 - hue) + t1;
  return t1;
}
function hslToRgb2(hue, sat, light) {
  let t2;
  hue = hue / 60;
  if (light <= 0.5) {
    t2 = light * (sat + 1);
  } else {
    t2 = light + sat - light * sat;
  }
  const t1 = light * 2 - t2;
  const r = hueToRgb(t1, t2, hue + 2) * 255;
  const g = hueToRgb(t1, t2, hue) * 255;
  const b = hueToRgb(t1, t2, hue - 2) * 255;
  return { r, g, b };
}
function applyShade(rgbStr, shadeValue, isAlpha) {
  const color = tinycolor(rgbStr).toHsl();
  if (shadeValue >= 1) shadeValue = 1;
  const cacl_l = Math.min(color.l * shadeValue, 1);
  if (isAlpha) {
    return tinycolor({
      h: color.h,
      s: color.s,
      l: cacl_l,
      a: color.a
    }).toHex8();
  }
  return tinycolor({
    h: color.h,
    s: color.s,
    l: cacl_l,
    a: color.a
  }).toHex();
}
function applyTint(rgbStr, tintValue, isAlpha) {
  const color = tinycolor(rgbStr).toHsl();
  if (tintValue >= 1) tintValue = 1;
  const cacl_l = color.l * tintValue + (1 - tintValue);
  if (isAlpha) {
    return tinycolor({
      h: color.h,
      s: color.s,
      l: cacl_l,
      a: color.a
    }).toHex8();
  }
  return tinycolor({
    h: color.h,
    s: color.s,
    l: cacl_l,
    a: color.a
  }).toHex();
}
function applyLumOff(rgbStr, offset, isAlpha) {
  const color = tinycolor(rgbStr).toHsl();
  const lum = offset + color.l;
  if (lum >= 1) {
    if (isAlpha) {
      return tinycolor({
        h: color.h,
        s: color.s,
        l: 1,
        a: color.a
      }).toHex8();
    }
    return tinycolor({
      h: color.h,
      s: color.s,
      l: 1,
      a: color.a
    }).toHex();
  }
  if (isAlpha) {
    return tinycolor({
      h: color.h,
      s: color.s,
      l: lum,
      a: color.a
    }).toHex8();
  }
  return tinycolor({
    h: color.h,
    s: color.s,
    l: lum,
    a: color.a
  }).toHex();
}
function applyLumMod(rgbStr, multiplier, isAlpha) {
  const color = tinycolor(rgbStr).toHsl();
  let cacl_l = color.l * multiplier;
  if (cacl_l >= 1) cacl_l = 1;
  if (isAlpha) {
    return tinycolor({
      h: color.h,
      s: color.s,
      l: cacl_l,
      a: color.a
    }).toHex8();
  }
  return tinycolor({
    h: color.h,
    s: color.s,
    l: cacl_l,
    a: color.a
  }).toHex();
}
function applyHueMod(rgbStr, multiplier, isAlpha) {
  const color = tinycolor(rgbStr).toHsl();
  let cacl_h = color.h * multiplier;
  if (cacl_h >= 360) cacl_h = cacl_h - 360;
  if (isAlpha) {
    return tinycolor({
      h: cacl_h,
      s: color.s,
      l: color.l,
      a: color.a
    }).toHex8();
  }
  return tinycolor({
    h: cacl_h,
    s: color.s,
    l: color.l,
    a: color.a
  }).toHex();
}
function applySatMod(rgbStr, multiplier, isAlpha) {
  const color = tinycolor(rgbStr).toHsl();
  let cacl_s = color.s * multiplier;
  if (cacl_s >= 1) cacl_s = 1;
  if (isAlpha) {
    return tinycolor({
      h: color.h,
      s: cacl_s,
      l: color.l,
      a: color.a
    }).toHex8();
  }
  return tinycolor({
    h: color.h,
    s: cacl_s,
    l: color.l,
    a: color.a
  }).toHex();
}
function getColorName2Hex(name) {
  let hex;
  const colorName = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "DarkOrange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "RebeccaPurple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];
  const colorHex = ["f0f8ff", "faebd7", "00ffff", "7fffd4", "f0ffff", "f5f5dc", "ffe4c4", "000000", "ffebcd", "0000ff", "8a2be2", "a52a2a", "deb887", "5f9ea0", "7fff00", "d2691e", "ff7f50", "6495ed", "fff8dc", "dc143c", "00ffff", "00008b", "008b8b", "b8860b", "a9a9a9", "a9a9a9", "006400", "bdb76b", "8b008b", "556b2f", "ff8c00", "9932cc", "8b0000", "e9967a", "8fbc8f", "483d8b", "2f4f4f", "2f4f4f", "00ced1", "9400d3", "ff1493", "00bfff", "696969", "696969", "1e90ff", "b22222", "fffaf0", "228b22", "ff00ff", "dcdcdc", "f8f8ff", "ffd700", "daa520", "808080", "808080", "008000", "adff2f", "f0fff0", "ff69b4", "cd5c5c", "4b0082", "fffff0", "f0e68c", "e6e6fa", "fff0f5", "7cfc00", "fffacd", "add8e6", "f08080", "e0ffff", "fafad2", "d3d3d3", "d3d3d3", "90ee90", "ffb6c1", "ffa07a", "20b2aa", "87cefa", "778899", "778899", "b0c4de", "ffffe0", "00ff00", "32cd32", "faf0e6", "ff00ff", "800000", "66cdaa", "0000cd", "ba55d3", "9370db", "3cb371", "7b68ee", "00fa9a", "48d1cc", "c71585", "191970", "f5fffa", "ffe4e1", "ffe4b5", "ffdead", "000080", "fdf5e6", "808000", "6b8e23", "ffa500", "ff4500", "da70d6", "eee8aa", "98fb98", "afeeee", "db7093", "ffefd5", "ffdab9", "cd853f", "ffc0cb", "dda0dd", "b0e0e6", "800080", "663399", "ff0000", "bc8f8f", "4169e1", "8b4513", "fa8072", "f4a460", "2e8b57", "fff5ee", "a0522d", "c0c0c0", "87ceeb", "6a5acd", "708090", "708090", "fffafa", "00ff7f", "4682b4", "d2b48c", "008080", "d8bfd8", "ff6347", "40e0d0", "ee82ee", "f5deb3", "ffffff", "f5f5f5", "ffff00", "9acd32"];
  const nameLower = name.toLowerCase();
  const findIndx = colorName.findIndex((n) => n.toLowerCase() === nameLower);
  if (findIndx !== -1) hex = colorHex[findIndx];
  return hex;
}

// forked_pptxtojson/fill.js
function getFillType(node) {
  let fillType = "";
  if (node["a:noFill"]) fillType = "NO_FILL";
  if (node["a:solidFill"]) fillType = "SOLID_FILL";
  if (node["a:gradFill"]) fillType = "GRADIENT_FILL";
  if (node["a:pattFill"]) fillType = "PATTERN_FILL";
  if (node["a:blipFill"]) fillType = "PIC_FILL";
  if (node["a:grpFill"]) fillType = "GROUP_FILL";
  return fillType;
}
function createImageData(ref = "") {
  return {
    ref,
    base64: "",
    blob: ""
  };
}
function createMediaData(ref = "") {
  return {
    ref,
    blob: ""
  };
}
function getMediaCache(warpObj, cacheKey) {
  const cache = warpObj[cacheKey] || {};
  warpObj[cacheKey] = cache;
  return cache;
}
async function loadMedia(filePath, warpObj, cacheKey, mode = "base64") {
  if (!filePath || mode !== "base64" && mode !== "blob") return "";
  const normalizedPath = escapeHtml(filePath);
  const cache = getMediaCache(warpObj, cacheKey);
  const cacheItem = cache[normalizedPath] || { base64: "", blob: "" };
  cache[normalizedPath] = cacheItem;
  if (cacheItem[mode]) return cacheItem[mode];
  const fileExt = normalizedPath.split(".").pop().toLowerCase();
  if (fileExt === "xml") return "";
  const arrayBuffer = await warpObj["zip"].file(normalizedPath).async("arraybuffer");
  const mimeType = getMimeType(fileExt);
  if (mode === "base64") {
    cacheItem.base64 = `data:${mimeType};base64,${base64ArrayBuffer(arrayBuffer)}`;
  } else if (mode === "blob") {
    cacheItem.blob = URL.createObjectURL(new Blob([arrayBuffer], mimeType ? {
      type: mimeType
    } : void 0));
  }
  return cacheItem[mode];
}
async function loadImage(imgPath, warpObj, mode = "base64") {
  return await loadMedia(imgPath, warpObj, "loadedImages", mode);
}
async function loadVideo(videoPath, warpObj, mode = "blob") {
  if (mode !== "blob") return "";
  return await loadMedia(videoPath, warpObj, "loadedVideos", "blob");
}
async function loadAudio(audioPath, warpObj, mode = "blob") {
  if (mode !== "blob") return "";
  return await loadMedia(audioPath, warpObj, "loadedAudios", "blob");
}
function getImageMode(warpObj) {
  const imageMode = getTextByPathList(warpObj, ["options", "imageMode"]);
  if (imageMode === "blob" || imageMode === "both" || imageMode === "none") return imageMode;
  return "base64";
}
function getVideoMode(warpObj) {
  const videoMode = getTextByPathList(warpObj, ["options", "videoMode"]);
  if (videoMode === "blob") return "blob";
  return "none";
}
function getAudioMode(warpObj) {
  const audioMode = getTextByPathList(warpObj, ["options", "audioMode"]);
  if (audioMode === "blob") return "blob";
  return "none";
}
async function getImageData(imgPath, warpObj) {
  const imageData = createImageData(imgPath || "");
  if (!imgPath) return imageData;
  const imageMode = getImageMode(warpObj);
  if (imageMode === "base64" || imageMode === "both") {
    imageData.base64 = await loadImage(imgPath, warpObj, "base64");
  }
  if (imageMode === "blob" || imageMode === "both") {
    imageData.blob = await loadImage(imgPath, warpObj, "blob");
  }
  return imageData;
}
async function getVideoData(videoPath, warpObj) {
  const videoData = createMediaData(videoPath || "");
  if (!videoPath) return videoData;
  if (getVideoMode(warpObj) === "blob") {
    videoData.blob = await loadVideo(videoPath, warpObj, "blob");
  }
  return videoData;
}
async function getAudioData(audioPath, warpObj) {
  const audioData = createMediaData(audioPath || "");
  if (!audioPath) return audioData;
  if (getAudioMode(warpObj) === "blob") {
    audioData.blob = await loadAudio(audioPath, warpObj, "blob");
  }
  return audioData;
}
async function getPicFill(type, node, warpObj) {
  if (!node) return createImageData();
  const rId = getTextByPathList(node, ["a:blip", "attrs", "r:embed"]);
  let imgPath;
  if (type === "slideBg" || type === "slide") {
    imgPath = getTextByPathList(warpObj, ["slideResObj", rId, "target"]);
  } else if (type === "slideLayoutBg") {
    imgPath = getTextByPathList(warpObj, ["layoutResObj", rId, "target"]);
  } else if (type === "slideMasterBg") {
    imgPath = getTextByPathList(warpObj, ["masterResObj", rId, "target"]);
  } else if (type === "themeBg") {
    imgPath = getTextByPathList(warpObj, ["themeResObj", rId, "target"]);
  } else if (type === "diagramBg") {
    imgPath = getTextByPathList(warpObj, ["diagramResObj", rId, "target"]);
  }
  if (!imgPath) return createImageData();
  return await getImageData(imgPath, warpObj);
}
function getPicFillOpacity(node) {
  const aBlipNode = node["a:blip"];
  const aphaModFixNode = getTextByPathList(aBlipNode, ["a:alphaModFix", "attrs"]);
  let opacity = 1;
  if (aphaModFixNode && aphaModFixNode["amt"] && aphaModFixNode["amt"] !== "") {
    opacity = parseInt(aphaModFixNode["amt"]) / 1e5;
  }
  return opacity;
}
function getPicFilters(node) {
  if (!node) return null;
  const aBlipNode = node["a:blip"];
  if (!aBlipNode) return null;
  const filters = {};
  const extLstNode = aBlipNode["a:extLst"];
  if (extLstNode && extLstNode["a:ext"]) {
    const extNodes = Array.isArray(extLstNode["a:ext"]) ? extLstNode["a:ext"] : [extLstNode["a:ext"]];
    for (const extNode of extNodes) {
      if (!extNode["a14:imgProps"] || !extNode["a14:imgProps"]["a14:imgLayer"]) continue;
      const imgLayerNode = extNode["a14:imgProps"]["a14:imgLayer"];
      const imgEffects = imgLayerNode["a14:imgEffect"];
      if (!imgEffects) continue;
      const effectArray = Array.isArray(imgEffects) ? imgEffects : [imgEffects];
      for (const effect of effectArray) {
        if (effect["a14:saturation"]) {
          const satAttr = getTextByPathList(effect, ["a14:saturation", "attrs", "sat"]);
          if (satAttr) {
            filters.saturation = parseInt(satAttr) / 1e5;
          }
        }
        if (effect["a14:brightnessContrast"]) {
          const brightAttr = getTextByPathList(effect, ["a14:brightnessContrast", "attrs", "bright"]);
          const contrastAttr = getTextByPathList(effect, ["a14:brightnessContrast", "attrs", "contrast"]);
          if (brightAttr) {
            filters.brightness = parseInt(brightAttr) / 1e5;
          }
          if (contrastAttr) {
            filters.contrast = parseInt(contrastAttr) / 1e5;
          }
        }
        if (effect["a14:sharpenSoften"]) {
          const amountAttr = getTextByPathList(effect, ["a14:sharpenSoften", "attrs", "amount"]);
          if (amountAttr) {
            const amount = parseInt(amountAttr) / 1e5;
            if (amount > 0) {
              filters.sharpen = amount;
            } else {
              filters.soften = Math.abs(amount);
            }
          }
        }
        if (effect["a14:colorTemperature"]) {
          const tempAttr = getTextByPathList(effect, ["a14:colorTemperature", "attrs", "colorTemp"]);
          if (tempAttr) {
            filters.colorTemperature = parseInt(tempAttr);
          }
        }
      }
    }
  }
  return Object.keys(filters).length > 0 ? filters : null;
}
async function getBgPicFill(bgPr, sorce, warpObj) {
  const picFill = await getPicFill(sorce, bgPr["a:blipFill"], warpObj);
  const aBlipNode = bgPr["a:blipFill"]["a:blip"];
  const aphaModFixNode = getTextByPathList(aBlipNode, ["a:alphaModFix", "attrs"]);
  let opacity = 1;
  if (aphaModFixNode && aphaModFixNode["amt"] && aphaModFixNode["amt"] !== "") {
    opacity = parseInt(aphaModFixNode["amt"]) / 1e5;
  }
  return {
    ref: picFill.ref,
    base64: picFill.base64,
    blob: picFill.blob,
    opacity
  };
}
function getGradientFill(node, warpObj) {
  const gsLst = node["a:gsLst"]["a:gs"];
  const colors = [];
  for (let i = 0; i < gsLst.length; i++) {
    const lo_color = getSolidFill(gsLst[i], void 0, void 0, warpObj);
    const pos = getTextByPathList(gsLst[i], ["attrs", "pos"]);
    colors[i] = {
      pos: pos ? pos / 1e3 + "%" : "",
      color: lo_color
    };
  }
  const lin = node["a:lin"];
  let rot = 0;
  let pathType = "line";
  if (lin) rot = angleToDegrees(lin["attrs"]["ang"]);
  else {
    const path = node["a:path"];
    if (path && path["attrs"] && path["attrs"]["path"]) pathType = path["attrs"]["path"];
  }
  return {
    rot,
    path: pathType,
    colors: colors.sort((a, b) => parseInt(a.pos) - parseInt(b.pos))
  };
}
function getPatternFill(node, warpObj) {
  if (!node) return null;
  const pattFill = node["a:pattFill"];
  if (!pattFill) return null;
  const type = getTextByPathList(pattFill, ["attrs", "prst"]);
  const fgColorNode = pattFill["a:fgClr"];
  const bgColorNode = pattFill["a:bgClr"];
  let foregroundColor = "#000000";
  let backgroundColor = "#FFFFFF";
  if (fgColorNode) {
    foregroundColor = getSolidFill(fgColorNode, void 0, void 0, warpObj);
  }
  if (bgColorNode) {
    backgroundColor = getSolidFill(bgColorNode, void 0, void 0, warpObj);
  }
  return {
    type,
    foregroundColor,
    backgroundColor
  };
}
function getBgGradientFill(bgPr, phClr, slideMasterContent, warpObj) {
  if (bgPr) {
    const grdFill = bgPr["a:gradFill"];
    const gsLst = grdFill["a:gsLst"]["a:gs"];
    const colors = [];
    for (let i = 0; i < gsLst.length; i++) {
      const lo_color = getSolidFill(gsLst[i], slideMasterContent["p:sldMaster"]["p:clrMap"]["attrs"], phClr, warpObj);
      const pos = getTextByPathList(gsLst[i], ["attrs", "pos"]);
      colors[i] = {
        pos: pos ? pos / 1e3 + "%" : "",
        color: lo_color
      };
    }
    const lin = grdFill["a:lin"];
    let rot = 0;
    let pathType = "line";
    if (lin) rot = angleToDegrees(lin["attrs"]["ang"]) + 0;
    else {
      const path = grdFill["a:path"];
      if (path && path["attrs"] && path["attrs"]["path"]) pathType = path["attrs"]["path"];
    }
    return {
      rot,
      path: pathType,
      colors: colors.sort((a, b) => parseInt(a.pos) - parseInt(b.pos))
    };
  } else if (phClr) {
    return phClr.indexOf("#") === -1 ? `#${phClr}` : phClr;
  }
  return null;
}
async function getSlideBackgroundFill(warpObj) {
  const slideContent = warpObj["slideContent"];
  const slideLayoutContent = warpObj["slideLayoutContent"];
  const slideMasterContent = warpObj["slideMasterContent"];
  let bgPr = getTextByPathList(slideContent, ["p:sld", "p:cSld", "p:bg", "p:bgPr"]);
  let bgRef = getTextByPathList(slideContent, ["p:sld", "p:cSld", "p:bg", "p:bgRef"]);
  let background = "#fff";
  let backgroundType = "color";
  if (bgPr) {
    const bgFillTyp = getFillType(bgPr);
    if (bgFillTyp === "SOLID_FILL") {
      const sldFill = bgPr["a:solidFill"];
      let clrMapOvr;
      const sldClrMapOvr = getTextByPathList(slideContent, ["p:sld", "p:clrMapOvr", "a:overrideClrMapping", "attrs"]);
      if (sldClrMapOvr) clrMapOvr = sldClrMapOvr;
      else {
        const sldClrMapOvr2 = getTextByPathList(slideLayoutContent, ["p:sldLayout", "p:clrMapOvr", "a:overrideClrMapping", "attrs"]);
        if (sldClrMapOvr2) clrMapOvr = sldClrMapOvr2;
        else clrMapOvr = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:clrMap", "attrs"]);
      }
      const sldBgClr = getSolidFill(sldFill, clrMapOvr, void 0, warpObj);
      background = sldBgClr;
    } else if (bgFillTyp === "GRADIENT_FILL") {
      const gradientFill = getBgGradientFill(bgPr, void 0, slideMasterContent, warpObj);
      if (typeof gradientFill === "string") {
        background = gradientFill;
      } else if (gradientFill) {
        background = gradientFill;
        backgroundType = "gradient";
      }
    } else if (bgFillTyp === "PIC_FILL") {
      background = await getBgPicFill(bgPr, "slideBg", warpObj);
      backgroundType = "image";
    } else if (bgFillTyp === "PATTERN_FILL") {
      const patternFill = getPatternFill(bgPr, warpObj);
      if (patternFill) {
        background = patternFill;
        backgroundType = "pattern";
      }
    }
  } else if (bgRef) {
    let clrMapOvr;
    const sldClrMapOvr = getTextByPathList(slideContent, ["p:sld", "p:clrMapOvr", "a:overrideClrMapping", "attrs"]);
    if (sldClrMapOvr) clrMapOvr = sldClrMapOvr;
    else {
      const sldClrMapOvr2 = getTextByPathList(slideLayoutContent, ["p:sldLayout", "p:clrMapOvr", "a:overrideClrMapping", "attrs"]);
      if (sldClrMapOvr2) clrMapOvr = sldClrMapOvr2;
      else clrMapOvr = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:clrMap", "attrs"]);
    }
    const phClr = getSolidFill(bgRef, clrMapOvr, void 0, warpObj);
    const idx = Number(bgRef["attrs"]["idx"]);
    if (idx > 1e3) {
      const trueIdx = idx - 1e3;
      const bgFillLst = warpObj["themeContent"]["a:theme"]["a:themeElements"]["a:fmtScheme"]["a:bgFillStyleLst"];
      const sortblAry = [];
      Object.keys(bgFillLst).forEach((key) => {
        const bgFillLstTyp = bgFillLst[key];
        if (key !== "attrs") {
          if (bgFillLstTyp.constructor === Array) {
            for (let i = 0; i < bgFillLstTyp.length; i++) {
              const obj = {};
              obj[key] = bgFillLstTyp[i];
              if (bgFillLstTyp[i]["attrs"]) {
                obj["idex"] = bgFillLstTyp[i]["attrs"]["order"];
                obj["attrs"] = {
                  "order": bgFillLstTyp[i]["attrs"]["order"]
                };
              }
              sortblAry.push(obj);
            }
          } else {
            const obj = {};
            obj[key] = bgFillLstTyp;
            if (bgFillLstTyp["attrs"]) {
              obj["idex"] = bgFillLstTyp["attrs"]["order"];
              obj["attrs"] = {
                "order": bgFillLstTyp["attrs"]["order"]
              };
            }
            sortblAry.push(obj);
          }
        }
      });
      const sortByOrder = sortblAry.slice(0);
      sortByOrder.sort((a, b) => a.idex - b.idex);
      const bgFillLstIdx = sortByOrder[trueIdx - 1];
      const bgFillTyp = getFillType(bgFillLstIdx);
      if (bgFillTyp === "SOLID_FILL") {
        const sldFill = bgFillLstIdx["a:solidFill"];
        const sldBgClr = getSolidFill(sldFill, clrMapOvr, void 0, warpObj);
        background = sldBgClr;
      } else if (bgFillTyp === "GRADIENT_FILL") {
        const gradientFill = getBgGradientFill(bgFillLstIdx, phClr, slideMasterContent, warpObj);
        if (typeof gradientFill === "string") {
          background = gradientFill;
        } else if (gradientFill) {
          background = gradientFill;
          backgroundType = "gradient";
        }
      }
    }
  } else {
    bgPr = getTextByPathList(slideLayoutContent, ["p:sldLayout", "p:cSld", "p:bg", "p:bgPr"]);
    bgRef = getTextByPathList(slideLayoutContent, ["p:sldLayout", "p:cSld", "p:bg", "p:bgRef"]);
    let clrMapOvr;
    const sldClrMapOvr = getTextByPathList(slideLayoutContent, ["p:sldLayout", "p:clrMapOvr", "a:overrideClrMapping", "attrs"]);
    if (sldClrMapOvr) clrMapOvr = sldClrMapOvr;
    else clrMapOvr = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:clrMap", "attrs"]);
    if (bgPr) {
      const bgFillTyp = getFillType(bgPr);
      if (bgFillTyp === "SOLID_FILL") {
        const sldFill = bgPr["a:solidFill"];
        const sldBgClr = getSolidFill(sldFill, clrMapOvr, void 0, warpObj);
        background = sldBgClr;
      } else if (bgFillTyp === "GRADIENT_FILL") {
        const gradientFill = getBgGradientFill(bgPr, void 0, slideMasterContent, warpObj);
        if (typeof gradientFill === "string") {
          background = gradientFill;
        } else if (gradientFill) {
          background = gradientFill;
          backgroundType = "gradient";
        }
      } else if (bgFillTyp === "PIC_FILL") {
        background = await getBgPicFill(bgPr, "slideLayoutBg", warpObj);
        backgroundType = "image";
      } else if (bgFillTyp === "PATTERN_FILL") {
        const patternFill = getPatternFill(bgPr, warpObj);
        if (patternFill) {
          background = patternFill;
          backgroundType = "pattern";
        }
      }
    } else if (bgRef) {
      const phClr = getSolidFill(bgRef, clrMapOvr, void 0, warpObj);
      const idx = Number(bgRef["attrs"]["idx"]);
      if (idx > 1e3) {
        const trueIdx = idx - 1e3;
        const bgFillLst = warpObj["themeContent"]["a:theme"]["a:themeElements"]["a:fmtScheme"]["a:bgFillStyleLst"];
        const sortblAry = [];
        Object.keys(bgFillLst).forEach((key) => {
          const bgFillLstTyp = bgFillLst[key];
          if (key !== "attrs") {
            if (bgFillLstTyp.constructor === Array) {
              for (let i = 0; i < bgFillLstTyp.length; i++) {
                const obj = {};
                obj[key] = bgFillLstTyp[i];
                if (bgFillLstTyp[i]["attrs"]) {
                  obj["idex"] = bgFillLstTyp[i]["attrs"]["order"];
                  obj["attrs"] = {
                    "order": bgFillLstTyp[i]["attrs"]["order"]
                  };
                }
                sortblAry.push(obj);
              }
            } else {
              const obj = {};
              obj[key] = bgFillLstTyp;
              if (bgFillLstTyp["attrs"]) {
                obj["idex"] = bgFillLstTyp["attrs"]["order"];
                obj["attrs"] = {
                  "order": bgFillLstTyp["attrs"]["order"]
                };
              }
              sortblAry.push(obj);
            }
          }
        });
        const sortByOrder = sortblAry.slice(0);
        sortByOrder.sort((a, b) => a.idex - b.idex);
        const bgFillLstIdx = sortByOrder[trueIdx - 1];
        const bgFillTyp = getFillType(bgFillLstIdx);
        if (bgFillTyp === "SOLID_FILL") {
          const sldFill = bgFillLstIdx["a:solidFill"];
          const sldBgClr = getSolidFill(sldFill, clrMapOvr, void 0, warpObj);
          background = sldBgClr;
        } else if (bgFillTyp === "GRADIENT_FILL") {
          const gradientFill = getBgGradientFill(bgFillLstIdx, phClr, slideMasterContent, warpObj);
          if (typeof gradientFill === "string") {
            background = gradientFill;
          } else if (gradientFill) {
            background = gradientFill;
            backgroundType = "gradient";
          }
        } else if (bgFillTyp === "PIC_FILL") {
          background = await getBgPicFill(bgFillLstIdx, "themeBg", warpObj);
          backgroundType = "image";
        } else if (bgFillTyp === "PATTERN_FILL") {
          const patternFill = getPatternFill(bgFillLstIdx, warpObj);
          if (patternFill) {
            background = patternFill;
            backgroundType = "pattern";
          }
        }
      }
    } else {
      bgPr = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:cSld", "p:bg", "p:bgPr"]);
      bgRef = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:cSld", "p:bg", "p:bgRef"]);
      const clrMap = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:clrMap", "attrs"]);
      if (bgPr) {
        const bgFillTyp = getFillType(bgPr);
        if (bgFillTyp === "SOLID_FILL") {
          const sldFill = bgPr["a:solidFill"];
          const sldBgClr = getSolidFill(sldFill, clrMap, void 0, warpObj);
          background = sldBgClr;
        } else if (bgFillTyp === "GRADIENT_FILL") {
          const gradientFill = getBgGradientFill(bgPr, void 0, slideMasterContent, warpObj);
          if (typeof gradientFill === "string") {
            background = gradientFill;
          } else if (gradientFill) {
            background = gradientFill;
            backgroundType = "gradient";
          }
        } else if (bgFillTyp === "PIC_FILL") {
          background = await getBgPicFill(bgPr, "slideMasterBg", warpObj);
          backgroundType = "image";
        } else if (bgFillTyp === "PATTERN_FILL") {
          const patternFill = getPatternFill(bgPr, warpObj);
          if (patternFill) {
            background = patternFill;
            backgroundType = "pattern";
          }
        }
      } else if (bgRef) {
        const phClr = getSolidFill(bgRef, clrMap, void 0, warpObj);
        const idx = Number(bgRef["attrs"]["idx"]);
        if (idx > 1e3) {
          const trueIdx = idx - 1e3;
          const bgFillLst = warpObj["themeContent"]["a:theme"]["a:themeElements"]["a:fmtScheme"]["a:bgFillStyleLst"];
          const sortblAry = [];
          Object.keys(bgFillLst).forEach((key) => {
            const bgFillLstTyp = bgFillLst[key];
            if (key !== "attrs") {
              if (bgFillLstTyp.constructor === Array) {
                for (let i = 0; i < bgFillLstTyp.length; i++) {
                  const obj = {};
                  obj[key] = bgFillLstTyp[i];
                  if (bgFillLstTyp[i]["attrs"]) {
                    obj["idex"] = bgFillLstTyp[i]["attrs"]["order"];
                    obj["attrs"] = {
                      "order": bgFillLstTyp[i]["attrs"]["order"]
                    };
                  }
                  sortblAry.push(obj);
                }
              } else {
                const obj = {};
                obj[key] = bgFillLstTyp;
                if (bgFillLstTyp["attrs"]) {
                  obj["idex"] = bgFillLstTyp["attrs"]["order"];
                  obj["attrs"] = {
                    "order": bgFillLstTyp["attrs"]["order"]
                  };
                }
                sortblAry.push(obj);
              }
            }
          });
          const sortByOrder = sortblAry.slice(0);
          sortByOrder.sort((a, b) => a.idex - b.idex);
          const bgFillLstIdx = sortByOrder[trueIdx - 1];
          const bgFillTyp = getFillType(bgFillLstIdx);
          if (bgFillTyp === "SOLID_FILL") {
            const sldFill = bgFillLstIdx["a:solidFill"];
            const sldBgClr = getSolidFill(sldFill, clrMapOvr, void 0, warpObj);
            background = sldBgClr;
          } else if (bgFillTyp === "GRADIENT_FILL") {
            const gradientFill = getBgGradientFill(bgFillLstIdx, phClr, slideMasterContent, warpObj);
            if (typeof gradientFill === "string") {
              background = gradientFill;
            } else if (gradientFill) {
              background = gradientFill;
              backgroundType = "gradient";
            }
          } else if (bgFillTyp === "PIC_FILL") {
            background = await getBgPicFill(bgFillLstIdx, "themeBg", warpObj);
            backgroundType = "image";
          } else if (bgFillTyp === "PATTERN_FILL") {
            const patternFill = getPatternFill(bgFillLstIdx, warpObj);
            if (patternFill) {
              background = patternFill;
              backgroundType = "pattern";
            }
          }
        }
      }
    }
  }
  return {
    type: backgroundType,
    value: background
  };
}
async function getShapeFill(node, warpObj, source, groupHierarchy = []) {
  const fillType = getFillType(getTextByPathList(node, ["p:spPr"]));
  let type = "color";
  let fillValue = "";
  if (fillType === "NO_FILL") {
    return null;
  } else if (fillType === "SOLID_FILL") {
    const shpFill = node["p:spPr"]["a:solidFill"];
    fillValue = getSolidFill(shpFill, void 0, void 0, warpObj);
    type = "color";
  } else if (fillType === "GRADIENT_FILL") {
    const shpFill = node["p:spPr"]["a:gradFill"];
    fillValue = getGradientFill(shpFill, warpObj);
    type = "gradient";
  } else if (fillType === "PIC_FILL") {
    const shpFill = node["p:spPr"]["a:blipFill"];
    const picFill = await getPicFill(source, shpFill, warpObj);
    const opacity = getPicFillOpacity(shpFill);
    fillValue = {
      ref: picFill.ref,
      base64: picFill.base64,
      blob: picFill.blob,
      opacity
    };
    type = "image";
  } else if (fillType === "PATTERN_FILL") {
    const shpFill = node["p:spPr"]["a:pattFill"];
    fillValue = getPatternFill({ "a:pattFill": shpFill }, warpObj);
    type = "pattern";
  } else if (fillType === "GROUP_FILL") {
    return findFillInGroupHierarchy(groupHierarchy, warpObj, source);
  }
  if (!fillValue) {
    const clrName = getTextByPathList(node, ["p:style", "a:fillRef"]);
    fillValue = getSolidFill(clrName, void 0, void 0, warpObj);
    type = "color";
  }
  if (!fillValue) {
    return null;
  }
  return {
    type,
    value: fillValue
  };
}
async function findFillInGroupHierarchy(groupHierarchy, warpObj, source) {
  for (const groupNode of groupHierarchy) {
    if (!groupNode || !groupNode["p:grpSpPr"]) continue;
    const grpSpPr = groupNode["p:grpSpPr"];
    const fillType = getFillType(grpSpPr);
    if (fillType === "SOLID_FILL") {
      const shpFill = grpSpPr["a:solidFill"];
      const fillValue = getSolidFill(shpFill, void 0, void 0, warpObj);
      if (fillValue) {
        return {
          type: "color",
          value: fillValue
        };
      }
    } else if (fillType === "GRADIENT_FILL") {
      const shpFill = grpSpPr["a:gradFill"];
      const fillValue = getGradientFill(shpFill, warpObj);
      if (fillValue) {
        return {
          type: "gradient",
          value: fillValue
        };
      }
    } else if (fillType === "PIC_FILL") {
      const shpFill = grpSpPr["a:blipFill"];
      const picFill = await getPicFill(source, shpFill, warpObj);
      const opacity = getPicFillOpacity(shpFill);
      if (picFill.ref || picFill.base64 || picFill.blob) {
        return {
          type: "image",
          value: {
            ref: picFill.ref,
            base64: picFill.base64,
            blob: picFill.blob,
            opacity
          }
        };
      }
    } else if (fillType === "PATTERN_FILL") {
      const shpFill = grpSpPr["a:pattFill"];
      const fillValue = getPatternFill({ "a:pattFill": shpFill }, warpObj);
      if (fillValue) {
        return {
          type: "pattern",
          value: fillValue
        };
      }
    }
  }
  return null;
}
function getSolidFill(solidFill, clrMap, phClr, warpObj) {
  if (!solidFill) return "";
  let color = "";
  let clrNode;
  if (solidFill["a:srgbClr"]) {
    clrNode = solidFill["a:srgbClr"];
    color = getTextByPathList(clrNode, ["attrs", "val"]);
  } else if (solidFill["a:schemeClr"]) {
    clrNode = solidFill["a:schemeClr"];
    const schemeClr = "a:" + getTextByPathList(clrNode, ["attrs", "val"]);
    color = getSchemeColorFromTheme(schemeClr, warpObj, clrMap, phClr) || "";
  } else if (solidFill["a:scrgbClr"]) {
    clrNode = solidFill["a:scrgbClr"];
    const defBultColorVals = clrNode["attrs"];
    const red = defBultColorVals["r"].indexOf("%") !== -1 ? defBultColorVals["r"].split("%").shift() : defBultColorVals["r"];
    const green = defBultColorVals["g"].indexOf("%") !== -1 ? defBultColorVals["g"].split("%").shift() : defBultColorVals["g"];
    const blue = defBultColorVals["b"].indexOf("%") !== -1 ? defBultColorVals["b"].split("%").shift() : defBultColorVals["b"];
    color = toHex2(255 * (Number(red) / 100)) + toHex2(255 * (Number(green) / 100)) + toHex2(255 * (Number(blue) / 100));
  } else if (solidFill["a:prstClr"]) {
    clrNode = solidFill["a:prstClr"];
    const prstClr = getTextByPathList(clrNode, ["attrs", "val"]);
    color = getColorName2Hex(prstClr);
  } else if (solidFill["a:hslClr"]) {
    clrNode = solidFill["a:hslClr"];
    const defBultColorVals = clrNode["attrs"];
    const hue = Number(defBultColorVals["hue"]) / 1e5;
    const sat = Number(defBultColorVals["sat"].indexOf("%") !== -1 ? defBultColorVals["sat"].split("%").shift() : defBultColorVals["sat"]) / 100;
    const lum = Number(defBultColorVals["lum"].indexOf("%") !== -1 ? defBultColorVals["lum"].split("%").shift() : defBultColorVals["lum"]) / 100;
    const hsl2rgb = hslToRgb2(hue, sat, lum);
    color = toHex2(hsl2rgb.r) + toHex2(hsl2rgb.g) + toHex2(hsl2rgb.b);
  } else if (solidFill["a:sysClr"]) {
    clrNode = solidFill["a:sysClr"];
    const sysClr = getTextByPathList(clrNode, ["attrs", "lastClr"]);
    if (sysClr) color = sysClr;
  }
  let isAlpha = false;
  const alpha = parseInt(getTextByPathList(clrNode, ["a:alpha", "attrs", "val"])) / 1e5;
  if (!isNaN(alpha)) {
    const al_color = tinycolor(color);
    al_color.setAlpha(alpha);
    color = al_color.toHex8();
    isAlpha = true;
  }
  const hueMod = parseInt(getTextByPathList(clrNode, ["a:hueMod", "attrs", "val"])) / 1e5;
  if (!isNaN(hueMod)) {
    color = applyHueMod(color, hueMod, isAlpha);
  }
  const lumMod = parseInt(getTextByPathList(clrNode, ["a:lumMod", "attrs", "val"])) / 1e5;
  if (!isNaN(lumMod)) {
    color = applyLumMod(color, lumMod, isAlpha);
  }
  const lumOff = parseInt(getTextByPathList(clrNode, ["a:lumOff", "attrs", "val"])) / 1e5;
  if (!isNaN(lumOff)) {
    color = applyLumOff(color, lumOff, isAlpha);
  }
  const satMod = parseInt(getTextByPathList(clrNode, ["a:satMod", "attrs", "val"])) / 1e5;
  if (!isNaN(satMod)) {
    color = applySatMod(color, satMod, isAlpha);
  }
  const shade = parseInt(getTextByPathList(clrNode, ["a:shade", "attrs", "val"])) / 1e5;
  if (!isNaN(shade)) {
    color = applyShade(color, shade, isAlpha);
  }
  const tint = parseInt(getTextByPathList(clrNode, ["a:tint", "attrs", "val"])) / 1e5;
  if (!isNaN(tint)) {
    color = applyTint(color, tint, isAlpha);
  }
  if (color && color.indexOf("#") === -1) color = "#" + color;
  return color;
}

// forked_pptxtojson/chart.js
function extractChartColors(serNode, warpObj) {
  if (!serNode) return [];
  if (serNode.constructor !== Array) serNode = [serNode];
  const schemeClrs = [];
  for (const node of serNode) {
    let schemeClr = getTextByPathList(node, ["c:spPr", "a:solidFill", "a:schemeClr"]);
    if (!schemeClr) schemeClr = getTextByPathList(node, ["c:spPr", "a:ln", "a:solidFill", "a:schemeClr"]);
    if (!schemeClr) schemeClr = getTextByPathList(node, ["c:marker", "c:spPr", "a:ln", "a:solidFill", "a:schemeClr"]);
    let clr = getTextByPathList(schemeClr, ["attrs", "val"]);
    if (clr) {
      clr = getTextByPathList(warpObj["themeContent"], ["a:theme", "a:themeElements", "a:clrScheme", `a:${clr}`, "a:srgbClr", "attrs", "val"]);
      const tint = getTextByPathList(schemeClr, ["a:tint", "attrs", "val"]) / 1e5;
      if (clr && !isNaN(tint)) {
        clr = applyTint(clr, tint);
      }
    } else clr = getTextByPathList(node, ["c:spPr", "a:solidFill", "a:srgbClr", "attrs", "val"]);
    if (clr) clr = "#" + clr;
    schemeClrs.push(clr);
  }
  return schemeClrs;
}
function extractChartData(serNode) {
  const dataMat = [];
  if (!serNode) return dataMat;
  if (serNode["c:xVal"]) {
    let dataRow = [];
    eachElement(serNode["c:xVal"]["c:numRef"]["c:numCache"]["c:pt"], (innerNode) => {
      dataRow.push(parseFloat(innerNode["c:v"]));
      return "";
    });
    dataMat.push(dataRow);
    dataRow = [];
    eachElement(serNode["c:yVal"]["c:numRef"]["c:numCache"]["c:pt"], (innerNode) => {
      dataRow.push(parseFloat(innerNode["c:v"]));
      return "";
    });
    dataMat.push(dataRow);
  } else {
    eachElement(serNode, (innerNode, index) => {
      const dataRow = [];
      const colName = getTextByPathList(innerNode, ["c:tx", "c:strRef", "c:strCache", "c:pt", "c:v"]) || index;
      const rowNames = {};
      if (getTextByPathList(innerNode, ["c:cat", "c:strRef", "c:strCache", "c:pt"])) {
        eachElement(innerNode["c:cat"]["c:strRef"]["c:strCache"]["c:pt"], (innerNode2) => {
          rowNames[innerNode2["attrs"]["idx"]] = innerNode2["c:v"];
          return "";
        });
      } else if (getTextByPathList(innerNode, ["c:cat", "c:numRef", "c:numCache", "c:pt"])) {
        eachElement(innerNode["c:cat"]["c:numRef"]["c:numCache"]["c:pt"], (innerNode2) => {
          rowNames[innerNode2["attrs"]["idx"]] = innerNode2["c:v"];
          return "";
        });
      }
      if (getTextByPathList(innerNode, ["c:val", "c:numRef", "c:numCache", "c:pt"])) {
        eachElement(innerNode["c:val"]["c:numRef"]["c:numCache"]["c:pt"], (innerNode2) => {
          dataRow.push({
            x: innerNode2["attrs"]["idx"],
            y: parseFloat(innerNode2["c:v"])
          });
          return "";
        });
      }
      dataMat.push({
        key: colName,
        values: dataRow,
        xlabels: rowNames
      });
      return "";
    });
  }
  return dataMat;
}
function getChartInfo(plotArea, warpObj) {
  let chart = null;
  for (const key in plotArea) {
    if (!plotArea[key]["c:ser"]) continue;
    switch (key) {
      case "c:lineChart":
        chart = {
          type: "lineChart",
          data: extractChartData(plotArea[key]["c:ser"]),
          colors: extractChartColors(plotArea[key]["c:ser"], warpObj),
          grouping: getTextByPathList(plotArea[key], ["c:grouping", "attrs", "val"]),
          marker: plotArea[key]["c:marker"] ? true : false
        };
        break;
      case "c:line3DChart":
        chart = {
          type: "line3DChart",
          data: extractChartData(plotArea[key]["c:ser"]),
          colors: extractChartColors(plotArea[key]["c:ser"], warpObj),
          grouping: getTextByPathList(plotArea[key], ["c:grouping", "attrs", "val"])
        };
        break;
      case "c:barChart":
        chart = {
          type: "barChart",
          data: extractChartData(plotArea[key]["c:ser"]),
          colors: extractChartColors(plotArea[key]["c:ser"], warpObj),
          grouping: getTextByPathList(plotArea[key], ["c:grouping", "attrs", "val"]),
          barDir: getTextByPathList(plotArea[key], ["c:barDir", "attrs", "val"])
        };
        break;
      case "c:bar3DChart":
        chart = {
          type: "bar3DChart",
          data: extractChartData(plotArea[key]["c:ser"]),
          colors: extractChartColors(plotArea[key]["c:ser"], warpObj),
          grouping: getTextByPathList(plotArea[key], ["c:grouping", "attrs", "val"]),
          barDir: getTextByPathList(plotArea[key], ["c:barDir", "attrs", "val"])
        };
        break;
      case "c:pieChart":
        chart = {
          type: "pieChart",
          data: extractChartData(plotArea[key]["c:ser"]),
          colors: extractChartColors(plotArea[key]["c:ser"]["c:dPt"], warpObj)
        };
        break;
      case "c:pie3DChart":
        chart = {
          type: "pie3DChart",
          data: extractChartData(plotArea[key]["c:ser"]),
          colors: extractChartColors(plotArea[key]["c:ser"]["c:dPt"], warpObj)
        };
        break;
      case "c:doughnutChart":
        chart = {
          type: "doughnutChart",
          data: extractChartData(plotArea[key]["c:ser"]),
          colors: extractChartColors(plotArea[key]["c:ser"]["c:dPt"], warpObj),
          holeSize: getTextByPathList(plotArea[key], ["c:holeSize", "attrs", "val"])
        };
        break;
      case "c:areaChart":
        chart = {
          type: "areaChart",
          data: extractChartData(plotArea[key]["c:ser"]),
          colors: extractChartColors(plotArea[key]["c:ser"], warpObj),
          grouping: getTextByPathList(plotArea[key], ["c:grouping", "attrs", "val"])
        };
        break;
      case "c:area3DChart":
        chart = {
          type: "area3DChart",
          data: extractChartData(plotArea[key]["c:ser"]),
          colors: extractChartColors(plotArea[key]["c:ser"], warpObj),
          grouping: getTextByPathList(plotArea[key], ["c:grouping", "attrs", "val"])
        };
        break;
      case "c:scatterChart":
        chart = {
          type: "scatterChart",
          data: extractChartData(plotArea[key]["c:ser"]),
          colors: extractChartColors(plotArea[key]["c:ser"], warpObj),
          style: getTextByPathList(plotArea[key], ["c:scatterStyle", "attrs", "val"])
        };
        break;
      case "c:bubbleChart":
        chart = {
          type: "bubbleChart",
          data: extractChartData(plotArea[key]["c:ser"]),
          colors: extractChartColors(plotArea[key]["c:ser"], warpObj)
        };
        break;
      case "c:radarChart":
        chart = {
          type: "radarChart",
          data: extractChartData(plotArea[key]["c:ser"]),
          colors: extractChartColors(plotArea[key]["c:ser"], warpObj),
          style: getTextByPathList(plotArea[key], ["c:radarStyle", "attrs", "val"])
        };
        break;
      case "c:surfaceChart":
        chart = {
          type: "surfaceChart",
          data: extractChartData(plotArea[key]["c:ser"]),
          colors: extractChartColors(plotArea[key]["c:ser"], warpObj)
        };
        break;
      case "c:surface3DChart":
        chart = {
          type: "surface3DChart",
          data: extractChartData(plotArea[key]["c:ser"]),
          colors: extractChartColors(plotArea[key]["c:ser"], warpObj)
        };
        break;
      case "c:stockChart":
        chart = {
          type: "stockChart",
          data: extractChartData(plotArea[key]["c:ser"]),
          colors: []
        };
        break;
      default:
    }
  }
  return chart;
}

// forked_pptxtojson/paragraph.js
function getParagraphLevel(node) {
  let lvlIdx = 1;
  const lvlNode = getTextByPathList(node, ["a:pPr", "attrs", "lvl"]);
  if (lvlNode !== void 0) lvlIdx = parseInt(lvlNode) + 1;
  return lvlIdx;
}
function getAlignFromTextNode(node, lvlStr) {
  if (!node) return "";
  let algn = getTextByPathList(node, ["p:txBody", "a:lstStyle", lvlStr, "attrs", "algn"]);
  if (!algn) algn = getTextByPathList(node, ["p:txBody", "a:p", "a:pPr", "attrs", "algn"]);
  return algn || "";
}
function getHorizontalAlign(node, pNode, type, slideLayoutSpNode, slideMasterSpNode, warpObj) {
  let algn = getTextByPathList(node, ["a:pPr", "attrs", "algn"]);
  if (!algn) algn = getTextByPathList(pNode, ["p:txBody", "a:p", "a:pPr", "attrs", "algn"]);
  if (!algn) {
    const lvlIdx = getParagraphLevel(node);
    const lvlStr = "a:lvl" + lvlIdx + "pPr";
    algn = getAlignFromTextNode(slideLayoutSpNode, lvlStr);
    if (!algn) algn = getAlignFromTextNode(slideMasterSpNode, lvlStr);
    if (!algn && (type === "title" || type === "ctrTitle" || type === "subTitle")) {
      algn = getTextByPathList(warpObj, ["slideMasterTextStyles", "p:titleStyle", lvlStr, "attrs", "algn"]);
      if (!algn && type === "subTitle") {
        algn = getTextByPathList(warpObj, ["slideMasterTextStyles", "p:bodyStyle", lvlStr, "attrs", "algn"]);
      }
    } else if (!algn && type === "body") {
      algn = getTextByPathList(warpObj, ["slideMasterTextStyles", "p:bodyStyle", lvlStr, "attrs", "algn"]);
    } else if (!algn) {
      algn = getTextByPathList(warpObj, ["slideMasterTextStyles", "p:otherStyle", lvlStr, "attrs", "algn"]);
    }
  }
  let align = "left";
  if (algn) {
    switch (algn) {
      case "l":
        align = "left";
        break;
      case "r":
        align = "right";
        break;
      case "ctr":
        align = "center";
        break;
      case "just":
        align = "justify";
        break;
      case "dist":
        align = "justify";
        break;
      default:
        align = "inherit";
    }
  }
  return align;
}
function getVerticalAlign(node, slideLayoutSpNode, slideMasterSpNode) {
  let anchor = getTextByPathList(node, ["p:txBody", "a:bodyPr", "attrs", "anchor"]);
  if (!anchor) {
    anchor = getTextByPathList(slideLayoutSpNode, ["p:txBody", "a:bodyPr", "attrs", "anchor"]);
    if (!anchor) {
      anchor = getTextByPathList(slideMasterSpNode, ["p:txBody", "a:bodyPr", "attrs", "anchor"]);
      if (!anchor) anchor = "t";
    }
  }
  return anchor === "ctr" ? "mid" : anchor === "b" ? "down" : "up";
}
function getTextAutoFit(node, slideLayoutSpNode, slideMasterSpNode) {
  function checkBodyPr(bodyPr) {
    if (!bodyPr) return null;
    if (bodyPr["a:noAutofit"]) return { result: null };
    else if (bodyPr["a:spAutoFit"]) return { result: { type: "shape" } };
    else if (bodyPr["a:normAutofit"]) {
      const fontScale = getTextByPathList(bodyPr["a:normAutofit"], ["attrs", "fontScale"]);
      if (fontScale) {
        const scalePercent = parseInt(fontScale) / 1e3;
        return {
          result: {
            type: "text",
            fontScale: scalePercent
          }
        };
      }
      return { result: { type: "text" } };
    }
    return null;
  }
  const nodeCheck = checkBodyPr(getTextByPathList(node, ["p:txBody", "a:bodyPr"]));
  if (nodeCheck) return nodeCheck.result;
  const layoutCheck = checkBodyPr(getTextByPathList(slideLayoutSpNode, ["p:txBody", "a:bodyPr"]));
  if (layoutCheck) return layoutCheck.result;
  const masterCheck = checkBodyPr(getTextByPathList(slideMasterSpNode, ["p:txBody", "a:bodyPr"]));
  if (masterCheck) return masterCheck.result;
  return null;
}
function pushParagraphStyleNode(styleNodes, styleNode) {
  if (styleNode) styleNodes.push(styleNode);
}
function appendTextBodyParagraphStyleNodes(styleNodes, textBodyNode, lvl) {
  if (!textBodyNode) return;
  const lvlPath = `a:lvl${lvl}pPr`;
  pushParagraphStyleNode(styleNodes, getTextByPathList(textBodyNode, ["a:lstStyle", lvlPath]));
}
function appendShapeParagraphStyleNodes(styleNodes, shapeNode, lvl) {
  if (!shapeNode) return;
  const lvlPath = `a:lvl${lvl}pPr`;
  pushParagraphStyleNode(styleNodes, getTextByPathList(shapeNode, ["p:txBody", "a:lstStyle", lvlPath]));
  pushParagraphStyleNode(styleNodes, getTextByPathList(shapeNode, ["p:txBody", "a:p", "a:pPr"]));
}
function appendMasterTextParagraphStyleNodes(styleNodes, type, lvl, slideMasterTextStyles) {
  if (!slideMasterTextStyles) return;
  const lvlPath = `a:lvl${lvl}pPr`;
  if (type === "title" || type === "ctrTitle" || type === "subTitle") {
    pushParagraphStyleNode(styleNodes, getTextByPathList(slideMasterTextStyles, ["p:titleStyle", lvlPath]));
    if (type === "subTitle") {
      pushParagraphStyleNode(styleNodes, getTextByPathList(slideMasterTextStyles, ["p:bodyStyle", lvlPath]));
    }
  } else if (type === "body") {
    pushParagraphStyleNode(styleNodes, getTextByPathList(slideMasterTextStyles, ["p:bodyStyle", lvlPath]));
  } else {
    pushParagraphStyleNode(styleNodes, getTextByPathList(slideMasterTextStyles, ["p:otherStyle", lvlPath]));
  }
}
function appendDefaultTextParagraphStyleNodes(styleNodes, defaultTextStyle, lvl) {
  if (!defaultTextStyle) return;
  const lvlPath = `a:lvl${lvl}pPr`;
  pushParagraphStyleNode(styleNodes, getTextByPathList(defaultTextStyle, [lvlPath]));
  pushParagraphStyleNode(styleNodes, getTextByPathList(defaultTextStyle, ["a:defPPr"]));
}
function getParagraphStyleNodes(pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, warpObj) {
  if (!pNode) return null;
  const pPrNode = pNode["a:pPr"];
  const lvl = getParagraphLevel(pNode);
  const styleNodes = [];
  pushParagraphStyleNode(styleNodes, pPrNode);
  appendTextBodyParagraphStyleNodes(styleNodes, textBodyNode, lvl);
  appendShapeParagraphStyleNodes(styleNodes, slideLayoutSpNode, lvl);
  appendShapeParagraphStyleNodes(styleNodes, slideMasterSpNode, lvl);
  appendMasterTextParagraphStyleNodes(styleNodes, type, lvl, slideMasterTextStyles);
  appendDefaultTextParagraphStyleNodes(styleNodes, getTextByPathList(warpObj, ["defaultTextStyle"]), lvl);
  return styleNodes;
}
function getLineSpacingValue(spacingNode) {
  const spcPct = getTextByPathList(spacingNode, ["a:spcPct", "attrs", "val"]);
  const spcPts = getTextByPathList(spacingNode, ["a:spcPts", "attrs", "val"]);
  if (spcPct) return parseInt(spcPct) / 1e3 / 100;
  if (spcPts) return parseInt(spcPts) / 100 + "pt";
  return void 0;
}
function getParagraphSpacingValue(spacingNode) {
  const spcPct = getTextByPathList(spacingNode, ["a:spcPct", "attrs", "val"]);
  const spcPts = getTextByPathList(spacingNode, ["a:spcPts", "attrs", "val"]);
  if (spcPct) return parseInt(spcPct) / 1e3 + "em";
  if (spcPts) return parseInt(spcPts) / 100 + "pt";
  return void 0;
}
function getParagraphSpacing(pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, warpObj) {
  const styleNodes = getParagraphStyleNodes(pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, warpObj);
  if (!styleNodes) return null;
  const spacing = {};
  for (const styleNode of styleNodes) {
    if (spacing.lineSpacing === void 0) {
      const lineSpacing = getLineSpacingValue(styleNode["a:lnSpc"]);
      if (lineSpacing !== void 0) spacing.lineSpacing = lineSpacing;
    }
    if (spacing.spaceBefore === void 0) {
      const spaceBefore = getParagraphSpacingValue(styleNode["a:spcBef"]);
      if (spaceBefore !== void 0) spacing.spaceBefore = spaceBefore;
    }
    if (spacing.spaceAfter === void 0) {
      const spaceAfter = getParagraphSpacingValue(styleNode["a:spcAft"]);
      if (spaceAfter !== void 0) spacing.spaceAfter = spaceAfter;
    }
  }
  return Object.keys(spacing).length > 0 ? spacing : null;
}

// forked_pptxtojson/constants.js
var RATIO_Inches_EMUs = 914400;
var RATIO_Inches_Points = 72;
var RATIO_EMUs_Points = RATIO_Inches_Points / RATIO_Inches_EMUs;

// forked_pptxtojson/position.js
function getPosition(slideSpNode, slideLayoutSpNode, slideMasterSpNode) {
  let off;
  if (slideSpNode) off = slideSpNode["a:off"]["attrs"];
  else if (slideLayoutSpNode) off = slideLayoutSpNode["a:off"]["attrs"];
  else if (slideMasterSpNode) off = slideMasterSpNode["a:off"]["attrs"];
  if (!off) return { top: 0, left: 0 };
  return {
    top: numberToFixed(parseInt(off["y"]) * RATIO_EMUs_Points),
    left: numberToFixed(parseInt(off["x"]) * RATIO_EMUs_Points)
  };
}
function getSize(slideSpNode, slideLayoutSpNode, slideMasterSpNode) {
  let ext;
  if (slideSpNode) ext = slideSpNode["a:ext"]["attrs"];
  else if (slideLayoutSpNode) ext = slideLayoutSpNode["a:ext"]["attrs"];
  else if (slideMasterSpNode) ext = slideMasterSpNode["a:ext"]["attrs"];
  if (!ext) return { width: 0, height: 0 };
  return {
    width: numberToFixed(parseInt(ext["cx"]) * RATIO_EMUs_Points),
    height: numberToFixed(parseInt(ext["cy"]) * RATIO_EMUs_Points)
  };
}

// forked_pptxtojson/shadow.js
function getShadow(node, warpObj) {
  const chdwClrNode = getSolidFill(node, void 0, void 0, warpObj);
  const outerShdwAttrs = node["attrs"];
  const dir = outerShdwAttrs["dir"] ? parseInt(outerShdwAttrs["dir"]) / 6e4 : 0;
  const dist = outerShdwAttrs["dist"] ? parseInt(outerShdwAttrs["dist"]) * RATIO_EMUs_Points : 0;
  const blurRad = outerShdwAttrs["blurRad"] ? parseInt(outerShdwAttrs["blurRad"]) * RATIO_EMUs_Points : "";
  const vx = dist * Math.sin(dir * Math.PI / 180);
  const hx = dist * Math.cos(dir * Math.PI / 180);
  return {
    h: hx,
    v: vx,
    blur: blurRad,
    color: chdwClrNode
  };
}

// forked_pptxtojson/fontStyle.js
function pushStyleNode(styleNodes, styleNode) {
  if (styleNode) styleNodes.push(styleNode);
}
function getLevelPath(lvl) {
  return `a:lvl${lvl}pPr`;
}
function appendTextBodyStyleNodes(styleNodes, textBodyNode, lvl) {
  if (!textBodyNode) return;
  const lvlPath = getLevelPath(lvl);
  pushStyleNode(styleNodes, getTextByPathList(textBodyNode, ["a:lstStyle", lvlPath, "a:defRPr"]));
}
function appendShapeStyleNodes(styleNodes, shapeNode, lvl) {
  if (!shapeNode) return;
  const lvlPath = getLevelPath(lvl);
  pushStyleNode(styleNodes, getTextByPathList(shapeNode, ["p:txBody", "a:lstStyle", lvlPath, "a:defRPr"]));
  pushStyleNode(styleNodes, getTextByPathList(shapeNode, ["p:txBody", "a:p", "a:pPr", "a:defRPr"]));
}
function appendMasterTextStyleNodes(styleNodes, type, lvl, slideMasterTextStyles) {
  if (!slideMasterTextStyles) return;
  const lvlPath = getLevelPath(lvl);
  if (type === "title" || type === "ctrTitle" || type === "subTitle") {
    pushStyleNode(styleNodes, getTextByPathList(slideMasterTextStyles, ["p:titleStyle", lvlPath, "a:defRPr"]));
    if (type === "subTitle") {
      pushStyleNode(styleNodes, getTextByPathList(slideMasterTextStyles, ["p:bodyStyle", lvlPath, "a:defRPr"]));
    }
  } else if (type === "body") {
    pushStyleNode(styleNodes, getTextByPathList(slideMasterTextStyles, ["p:bodyStyle", lvlPath, "a:defRPr"]));
  } else {
    pushStyleNode(styleNodes, getTextByPathList(slideMasterTextStyles, ["p:otherStyle", lvlPath, "a:defRPr"]));
  }
}
function appendDefaultTextStyleNodes(styleNodes, lvl, defaultTextStyle) {
  if (!defaultTextStyle) return;
  const lvlPath = getLevelPath(lvl);
  pushStyleNode(styleNodes, getTextByPathList(defaultTextStyle, [lvlPath, "a:defRPr"]));
  pushStyleNode(styleNodes, getTextByPathList(defaultTextStyle, ["a:defPPr", "a:defRPr"]));
}
function getBaseFontStyleNodes(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, lvl) {
  const styleNodes = [];
  const runStyleNode = getTextByPathList(node, ["a:rPr"]);
  pushStyleNode(styleNodes, runStyleNode);
  if (!runStyleNode) {
    pushStyleNode(styleNodes, getTextByPathList(pNode, ["a:endParaRPr"]));
  }
  pushStyleNode(styleNodes, getTextByPathList(pNode, ["a:pPr", "a:defRPr"]));
  appendTextBodyStyleNodes(styleNodes, textBodyNode, lvl);
  appendShapeStyleNodes(styleNodes, slideLayoutSpNode, lvl);
  appendShapeStyleNodes(styleNodes, slideMasterSpNode, lvl);
  return styleNodes;
}
function getFontStyleNodes(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl) {
  const styleNodes = getBaseFontStyleNodes(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, lvl);
  appendMasterTextStyleNodes(styleNodes, type, lvl, slideMasterTextStyles);
  return styleNodes;
}
function getFontAttr(styleNodes, attrName) {
  for (const styleNode of styleNodes) {
    const attrValue = getTextByPathList(styleNode, ["attrs", attrName]);
    if (attrValue !== void 0 && attrValue !== "") return attrValue;
  }
  return "";
}
function getFontTypeface(styleNodes) {
  for (const styleNode of styleNodes) {
    const typeface = getTextByPathList(styleNode, ["a:latin", "attrs", "typeface"]) || getTextByPathList(styleNode, ["a:ea", "attrs", "typeface"]);
    if (typeface) return typeface;
  }
  return "";
}
function getColorFromNode(node, warpObj) {
  if (!node) return "";
  const fillType = getFillType(node);
  if (fillType === "SOLID_FILL") {
    return getSolidFill(node["a:solidFill"], void 0, void 0, warpObj);
  }
  if (fillType === "GRADIENT_FILL") {
    return getGradientFill(node["a:gradFill"], warpObj);
  }
  return "";
}
function getFontColorFromStyleNodes(styleNodes, warpObj) {
  for (const styleNode of styleNodes) {
    const color = getColorFromNode(styleNode, warpObj);
    if (color) return color;
  }
  return "";
}
function getTextShadowFromStyleNodes(styleNodes, warpObj) {
  for (const styleNode of styleNodes) {
    const txtShadow = getTextByPathList(styleNode, ["a:effectLst", "a:outerShdw"]);
    if (!txtShadow) continue;
    const shadow = getShadow(txtShadow, warpObj);
    if (shadow) return shadow;
  }
  return null;
}
function getFontType(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl, warpObj) {
  const styleNodes = getFontStyleNodes(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl);
  let typeface = getFontTypeface(styleNodes);
  if (!typeface || typeface.startsWith("+")) {
    const fontSchemeNode = getTextByPathList(warpObj["themeContent"], ["a:theme", "a:themeElements", "a:fontScheme"]);
    if (fontSchemeNode) {
      if (typeface && typeface.startsWith("+")) {
        switch (typeface) {
          case "+mj-lt":
            return getTextByPathList(fontSchemeNode, ["a:majorFont", "a:latin", "attrs", "typeface"]);
          case "+mn-lt":
            return getTextByPathList(fontSchemeNode, ["a:minorFont", "a:latin", "attrs", "typeface"]);
          case "+mj-ea":
            return getTextByPathList(fontSchemeNode, ["a:majorFont", "a:ea", "attrs", "typeface"]);
          case "+mn-ea":
            return getTextByPathList(fontSchemeNode, ["a:minorFont", "a:ea", "attrs", "typeface"]);
          default:
            return typeface.replace(/^\+/, "");
        }
      }
    }
    if (type === "title" || type === "subTitle" || type === "ctrTitle") {
      typeface = getTextByPathList(fontSchemeNode, ["a:majorFont", "a:latin", "attrs", "typeface"]) || getTextByPathList(fontSchemeNode, ["a:majorFont", "a:ea", "attrs", "typeface"]);
    } else {
      typeface = getTextByPathList(fontSchemeNode, ["a:minorFont", "a:latin", "attrs", "typeface"]);
    }
  }
  return typeface || "";
}
function getFontColor(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl, pFontStyle, warpObj) {
  const styleNodes = getBaseFontStyleNodes(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, lvl);
  let color = getFontColorFromStyleNodes(styleNodes, warpObj);
  if (!color) {
    if (pFontStyle) color = getSolidFill(pFontStyle, void 0, void 0, warpObj);
    if (!color) {
      const layoutFontStyle = getTextByPathList(slideLayoutSpNode, ["p:style", "a:fontRef"]);
      if (layoutFontStyle) color = getSolidFill(layoutFontStyle, void 0, void 0, warpObj);
    }
    if (!color) {
      const masterFontStyle = getTextByPathList(slideMasterSpNode, ["p:style", "a:fontRef"]);
      if (masterFontStyle) color = getSolidFill(masterFontStyle, void 0, void 0, warpObj);
    }
  }
  if (!color) {
    appendMasterTextStyleNodes(styleNodes, type, lvl, slideMasterTextStyles);
    color = getFontColorFromStyleNodes(styleNodes, warpObj);
  }
  return color || "";
}
function getFontSize(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl, defaultTextStyle) {
  const styleNodes = getFontStyleNodes(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl);
  appendDefaultTextStyleNodes(styleNodes, lvl, defaultTextStyle);
  const sz = getFontAttr(styleNodes, "sz");
  let fontSize = sz ? parseInt(sz) / 100 : void 0;
  if ((isNaN(fontSize) || !fontSize) && (type === "dt" || type === "sldNum")) fontSize = 12;
  fontSize = isNaN(fontSize) || !fontSize ? 18 : fontSize;
  return fontSize + "pt";
}
function getFontBold(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl) {
  const styleNodes = getFontStyleNodes(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl);
  return getFontAttr(styleNodes, "b") === "1" ? "bold" : "";
}
function getFontItalic(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl) {
  const styleNodes = getFontStyleNodes(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl);
  return getFontAttr(styleNodes, "i") === "1" ? "italic" : "";
}
function getFontDecoration(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl) {
  const styleNodes = getFontStyleNodes(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl);
  return getFontAttr(styleNodes, "u") === "sng" ? "underline" : "";
}
function getFontDecorationLine(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl) {
  const styleNodes = getFontStyleNodes(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl);
  return getFontAttr(styleNodes, "strike") === "sngStrike" ? "line-through" : "";
}
function getFontSpace(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl) {
  const styleNodes = getFontStyleNodes(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl);
  const spc = getFontAttr(styleNodes, "spc");
  return spc && parseInt(spc) !== 0 ? parseInt(spc) / 100 + "pt" : "";
}
function getFontSubscript(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl) {
  const styleNodes = getFontStyleNodes(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl);
  const baseline = getFontAttr(styleNodes, "baseline");
  if (!baseline || parseInt(baseline) === 0) return "";
  return parseInt(baseline) > 0 ? "super" : "sub";
}
function getFontShadow(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl, warpObj) {
  const styleNodes = getFontStyleNodes(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl);
  const shadow = getTextShadowFromStyleNodes(styleNodes, warpObj);
  if (shadow) {
    const { h, v, blur, color } = shadow;
    if (!isNaN(v) && !isNaN(h)) {
      return h + "pt " + v + "pt " + (blur ? blur + "pt" : "") + " " + color;
    }
  }
  return "";
}

// forked_pptxtojson/text.js
function getTextNodeValue(node) {
  if (typeof node === "string") return node;
  if (node && typeof node.value === "string") return node.value;
  return void 0;
}
function genTextBody(textBodyNode, spNode, slideLayoutSpNode, slideMasterSpNode, type, warpObj) {
  if (!textBodyNode) return "";
  let text = "";
  const pFontStyle = getTextByPathList(spNode, ["p:style", "a:fontRef"]);
  const slideMasterTextStyles = spNode && spNode["a:tcPr"] ? void 0 : warpObj["slideMasterTextStyles"];
  const defaultTextStyle = spNode && spNode["a:tcPr"] ? warpObj["defaultTextStyle"] : void 0;
  const pNode = textBodyNode["a:p"];
  const pNodes = pNode.constructor === Array ? pNode : [pNode];
  const listTypes = [];
  for (const pNode2 of pNodes) {
    let rNode = pNode2["a:r"];
    let fldNode = pNode2["a:fld"];
    let brNode = pNode2["a:br"];
    if (rNode) {
      rNode = rNode.constructor === Array ? rNode : [rNode];
      if (fldNode) {
        fldNode = fldNode.constructor === Array ? fldNode : [fldNode];
        rNode = rNode.concat(fldNode);
      }
      if (brNode) {
        brNode = brNode.constructor === Array ? brNode : [brNode];
        brNode.forEach((item) => item.type = "br");
        if (brNode.length > 1) brNode.shift();
        rNode = rNode.concat(brNode);
        rNode.sort((a, b) => {
          if (!a.attrs || !b.attrs) return true;
          return a.attrs.order - b.attrs.order;
        });
      }
    }
    const align = getHorizontalAlign(pNode2, spNode, type, slideLayoutSpNode, slideMasterSpNode, warpObj);
    const spacing = getParagraphSpacing(pNode2, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, warpObj);
    let styleText = `text-align: ${align};`;
    if (spacing) {
      if (spacing.lineSpacing) styleText += `line-height: ${spacing.lineSpacing};`;
      if (spacing.spaceBefore) styleText += `margin-top: ${spacing.spaceBefore};`;
      if (spacing.spaceAfter) styleText += `margin-bottom: ${spacing.spaceAfter};`;
    }
    const listType = getListType(pNode2);
    const listLevel = getListLevel(pNode2);
    if (listType) {
      while (listTypes.length > listLevel + 1) {
        const closedListType = listTypes.pop();
        text += `</${closedListType}>`;
      }
      if (listTypes[listLevel] === void 0) {
        text += `<${listType}>`;
        listTypes[listLevel] = listType;
      } else if (listTypes[listLevel] !== listType) {
        text += `</${listTypes[listLevel]}>`;
        text += `<${listType}>`;
        listTypes[listLevel] = listType;
      }
      text += `<li style="${styleText}">`;
    } else {
      while (listTypes.length > 0) {
        const closedListType = listTypes.pop();
        text += `</${closedListType}>`;
      }
      text += `<p style="${styleText}">`;
    }
    if (!rNode) {
      text += genSpanElement(pNode2, spNode, textBodyNode, pFontStyle, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, defaultTextStyle, warpObj);
    } else {
      let prevStyleInfo = null;
      let accumulatedText = "";
      for (const rNodeItem of rNode) {
        const styleInfo = getSpanStyleInfo(rNodeItem, pNode2, textBodyNode, pFontStyle, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, defaultTextStyle, warpObj);
        if (!prevStyleInfo || prevStyleInfo.styleText !== styleInfo.styleText || prevStyleInfo.hasLink !== styleInfo.hasLink || styleInfo.hasLink) {
          if (accumulatedText) {
            const processedText = accumulatedText.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\s/g, "&nbsp;");
            text += `<span style="${prevStyleInfo.styleText}">${processedText}</span>`;
            accumulatedText = "";
          }
          if (styleInfo.hasLink) {
            const processedText = styleInfo.text.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\s/g, "&nbsp;");
            text += `<span style="${styleInfo.styleText}"><a href="${styleInfo.linkURL}" target="_blank">${processedText}</a></span>`;
            prevStyleInfo = null;
          } else {
            prevStyleInfo = styleInfo;
            accumulatedText = styleInfo.text;
          }
        } else accumulatedText += styleInfo.text;
      }
      if (accumulatedText && prevStyleInfo) {
        const processedText = accumulatedText.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\s/g, "&nbsp;");
        text += `<span style="${prevStyleInfo.styleText}">${processedText}</span>`;
      }
    }
    if (listType) text += "</li>";
    else text += "</p>";
  }
  while (listTypes.length > 0) {
    const closedListType = listTypes.pop();
    text += `</${closedListType}>`;
  }
  return text;
}
function getListType(node) {
  const pPrNode = node["a:pPr"];
  if (!pPrNode) return "";
  if (pPrNode["a:buChar"]) return "ul";
  if (pPrNode["a:buAutoNum"]) return "ol";
  return "";
}
function getListLevel(node) {
  const pPrNode = node["a:pPr"];
  if (!pPrNode) return -1;
  const lvlNode = getTextByPathList(pPrNode, ["attrs", "lvl"]);
  if (lvlNode !== void 0) return parseInt(lvlNode);
  return 0;
}
function genSpanElement(node, pNode, textBodyNode, pFontStyle, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, defaultTextStyle, warpObj) {
  const { styleText, text, hasLink, linkURL } = getSpanStyleInfo(node, pNode, textBodyNode, pFontStyle, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, defaultTextStyle, warpObj);
  const processedText = text.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\s/g, "&nbsp;");
  if (hasLink) {
    return `<span style="${styleText}"><a href="${linkURL}" target="_blank">${processedText}</a></span>`;
  }
  return `<span style="${styleText}">${processedText}</span>`;
}
function getSpanStyleInfo(node, pNode, textBodyNode, pFontStyle, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, defaultTextStyle, warpObj) {
  let lvl = 1;
  const pPrNode = pNode["a:pPr"];
  const lvlNode = getTextByPathList(pPrNode, ["attrs", "lvl"]);
  if (lvlNode !== void 0) lvl = parseInt(lvlNode) + 1;
  let text = getTextNodeValue(node["a:t"]);
  if (typeof text !== "string") text = getTextNodeValue(getTextByPathList(node, ["a:fld", "a:t"]));
  if (typeof text !== "string") text = "&nbsp;";
  let styleText = "";
  const fontColor = getFontColor(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl, pFontStyle, warpObj);
  const fontSize = getFontSize(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl, defaultTextStyle);
  const fontType = getFontType(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl, warpObj);
  const fontBold = getFontBold(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl);
  const fontItalic = getFontItalic(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl);
  const fontDecoration = getFontDecoration(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl);
  const fontDecorationLine = getFontDecorationLine(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl);
  const fontSpace = getFontSpace(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl);
  const shadow = getFontShadow(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl, warpObj);
  const subscript = getFontSubscript(node, pNode, textBodyNode, slideLayoutSpNode, slideMasterSpNode, type, slideMasterTextStyles, lvl);
  if (fontColor) {
    if (typeof fontColor === "string") styleText += `color: ${fontColor};`;
    else if (fontColor.colors) {
      const { colors, rot } = fontColor;
      const stops = colors.map((item) => `${item.color} ${item.pos}`).join(", ");
      const gradientStyle = `linear-gradient(${rot + 90}deg, ${stops})`;
      styleText += `background: ${gradientStyle}; background-clip: text; color: transparent;`;
    }
  }
  if (fontSize) styleText += `font-size: ${fontSize};`;
  if (fontType) styleText += `font-family: ${fontType};`;
  if (fontBold) styleText += `font-weight: ${fontBold};`;
  if (fontItalic) styleText += `font-style: ${fontItalic};`;
  if (fontDecoration) styleText += `text-decoration: ${fontDecoration};`;
  if (fontDecorationLine) styleText += `text-decoration-line: ${fontDecorationLine};`;
  if (fontSpace) styleText += `letter-spacing: ${fontSpace};`;
  if (subscript) styleText += `vertical-align: ${subscript};`;
  if (shadow) styleText += `text-shadow: ${shadow};`;
  const linkID = getTextByPathList(node, ["a:rPr", "a:hlinkClick", "attrs", "r:id"]);
  const hasLink = linkID && warpObj["slideResObj"][linkID];
  return {
    styleText,
    text,
    hasLink,
    linkURL: hasLink ? warpObj["slideResObj"][linkID]["target"] : null
  };
}

// forked_pptxtojson/shape.js
function shapeArc(cX, cY, rX, rY, stAng, endAng, isClose) {
  let dData;
  let angle = stAng;
  if (endAng >= stAng) {
    while (angle <= endAng) {
      const radians = angle * (Math.PI / 180);
      const x = cX + Math.cos(radians) * rX;
      const y = cY + Math.sin(radians) * rY;
      if (angle === stAng) {
        dData = " M" + x + " " + y;
      }
      dData += " L" + x + " " + y;
      angle++;
    }
  } else {
    while (angle > endAng) {
      const radians = angle * (Math.PI / 180);
      const x = cX + Math.cos(radians) * rX;
      const y = cY + Math.sin(radians) * rY;
      if (angle === stAng) {
        dData = " M " + x + " " + y;
      }
      dData += " L " + x + " " + y;
      angle--;
    }
  }
  dData += isClose ? " z" : "";
  return dData;
}
function getCustomShapePath(custShapType, w, h) {
  const pathLstNode = getTextByPathList(custShapType, ["a:pathLst"]);
  let pathNodes = getTextByPathList(pathLstNode, ["a:path"]);
  if (Array.isArray(pathNodes)) pathNodes = pathNodes.shift();
  const maxX = parseInt(pathNodes["attrs"]["w"]);
  const maxY = parseInt(pathNodes["attrs"]["h"]);
  const cX = maxX === 0 ? 0 : 1 / maxX * w;
  const cY = maxY === 0 ? 0 : 1 / maxY * h;
  let d = "";
  let moveToNode = getTextByPathList(pathNodes, ["a:moveTo"]);
  let lnToNodes = pathNodes["a:lnTo"];
  let cubicBezToNodes = pathNodes["a:cubicBezTo"];
  let quadBezToNodes = pathNodes["a:quadBezTo"];
  const arcToNodes = pathNodes["a:arcTo"];
  let closeNode = getTextByPathList(pathNodes, ["a:close"]);
  if (!Array.isArray(moveToNode)) moveToNode = [moveToNode];
  const multiSapeAry = [];
  if (moveToNode.length > 0) {
    Object.keys(moveToNode).forEach((key) => {
      const moveToPtNode = moveToNode[key]["a:pt"];
      if (moveToPtNode) {
        Object.keys(moveToPtNode).forEach((key2) => {
          const moveToNoPt = moveToPtNode[key2];
          const spX = moveToNoPt["x"];
          const spY = moveToNoPt["y"];
          const order = moveToNoPt["order"];
          multiSapeAry.push({
            type: "movto",
            x: spX,
            y: spY,
            order
          });
        });
      }
    });
    if (lnToNodes) {
      if (!Array.isArray(lnToNodes)) lnToNodes = [lnToNodes];
      Object.keys(lnToNodes).forEach((key) => {
        const lnToPtNode = lnToNodes[key]["a:pt"];
        if (lnToPtNode) {
          Object.keys(lnToPtNode).forEach((key2) => {
            const lnToNoPt = lnToPtNode[key2];
            const ptX = lnToNoPt["x"];
            const ptY = lnToNoPt["y"];
            const order = lnToNoPt["order"];
            multiSapeAry.push({
              type: "lnto",
              x: ptX,
              y: ptY,
              order
            });
          });
        }
      });
    }
    if (cubicBezToNodes) {
      const cubicBezToPtNodesAry = [];
      if (!Array.isArray(cubicBezToNodes)) cubicBezToNodes = [cubicBezToNodes];
      Object.keys(cubicBezToNodes).forEach((key) => {
        cubicBezToPtNodesAry.push(cubicBezToNodes[key]["a:pt"]);
      });
      cubicBezToPtNodesAry.forEach((key) => {
        const pts_ary = [];
        key.forEach((pt) => {
          const pt_obj = {
            x: pt["attrs"]["x"],
            y: pt["attrs"]["y"]
          };
          pts_ary.push(pt_obj);
        });
        const order = key[0]["attrs"]["order"];
        multiSapeAry.push({
          type: "cubicBezTo",
          cubBzPt: pts_ary,
          order
        });
      });
    }
    if (quadBezToNodes) {
      const quadBezToPtNodesAry = [];
      if (!Array.isArray(quadBezToNodes)) quadBezToNodes = [quadBezToNodes];
      Object.keys(quadBezToNodes).forEach((key) => {
        quadBezToPtNodesAry.push(quadBezToNodes[key]["a:pt"]);
      });
      quadBezToPtNodesAry.forEach((key) => {
        const pts_ary = [];
        key.forEach((pt) => {
          const pt_obj = {
            x: pt["attrs"]["x"],
            y: pt["attrs"]["y"]
          };
          pts_ary.push(pt_obj);
        });
        const order = key[0]["attrs"]["order"];
        multiSapeAry.push({
          type: "quadBezTo",
          quadBzPt: pts_ary,
          order
        });
      });
    }
    if (arcToNodes) {
      const arcToNodesAry = Array.isArray(arcToNodes) ? arcToNodes : [arcToNodes];
      arcToNodesAry.forEach((arcToNodes2) => {
        const arcToNodesAttrs = arcToNodes2["attrs"];
        const order = arcToNodesAttrs["order"];
        const hR = arcToNodesAttrs["hR"];
        const wR = arcToNodesAttrs["wR"];
        const stAng = arcToNodesAttrs["stAng"];
        const swAng = arcToNodesAttrs["swAng"];
        let shftX = 0;
        let shftY = 0;
        const arcToPtNode = getTextByPathList(arcToNodes2, ["a:pt", "attrs"]);
        if (arcToPtNode) {
          shftX = arcToPtNode["x"];
          shftY = arcToPtNode["y"];
        }
        multiSapeAry.push({
          type: "arcTo",
          hR,
          wR,
          stAng,
          swAng,
          shftX,
          shftY,
          order
        });
      });
    }
    if (closeNode) {
      if (!Array.isArray(closeNode)) closeNode = [closeNode];
      Object.keys(closeNode).forEach(() => {
        multiSapeAry.push({
          type: "close",
          order: Infinity
        });
      });
    }
    multiSapeAry.sort((a, b) => a.order - b.order);
    let k = 0;
    while (k < multiSapeAry.length) {
      if (multiSapeAry[k].type === "movto") {
        const spX = parseInt(multiSapeAry[k].x) * cX;
        const spY = parseInt(multiSapeAry[k].y) * cY;
        d += " M" + spX + "," + spY;
      } else if (multiSapeAry[k].type === "lnto") {
        const Lx = parseInt(multiSapeAry[k].x) * cX;
        const Ly = parseInt(multiSapeAry[k].y) * cY;
        d += " L" + Lx + "," + Ly;
      } else if (multiSapeAry[k].type === "cubicBezTo") {
        const Cx1 = parseInt(multiSapeAry[k].cubBzPt[0].x) * cX;
        const Cy1 = parseInt(multiSapeAry[k].cubBzPt[0].y) * cY;
        const Cx2 = parseInt(multiSapeAry[k].cubBzPt[1].x) * cX;
        const Cy2 = parseInt(multiSapeAry[k].cubBzPt[1].y) * cY;
        const Cx3 = parseInt(multiSapeAry[k].cubBzPt[2].x) * cX;
        const Cy3 = parseInt(multiSapeAry[k].cubBzPt[2].y) * cY;
        d += " C" + Cx1 + "," + Cy1 + " " + Cx2 + "," + Cy2 + " " + Cx3 + "," + Cy3;
      } else if (multiSapeAry[k].type === "quadBezTo") {
        const Qx1 = parseInt(multiSapeAry[k].quadBzPt[0].x) * cX;
        const Qy1 = parseInt(multiSapeAry[k].quadBzPt[0].y) * cY;
        const Qx2 = parseInt(multiSapeAry[k].quadBzPt[1].x) * cX;
        const Qy2 = parseInt(multiSapeAry[k].quadBzPt[1].y) * cY;
        d += " Q" + Qx1 + "," + Qy1 + " " + Qx2 + "," + Qy2;
      } else if (multiSapeAry[k].type === "arcTo") {
        const hR = parseInt(multiSapeAry[k].hR) * cX;
        const wR = parseInt(multiSapeAry[k].wR) * cY;
        const stAng = parseInt(multiSapeAry[k].stAng) / 6e4;
        const swAng = parseInt(multiSapeAry[k].swAng) / 6e4;
        const endAng = stAng + swAng;
        d += shapeArc(wR, hR, wR, hR, stAng, endAng, false);
      } else if (multiSapeAry[k].type === "close") d += "z";
      k++;
    }
  }
  return d;
}
function identifyShape(shapeData) {
  const pathLst = shapeData["a:pathLst"];
  if (!pathLst || !pathLst["a:path"]) return "custom";
  const path = pathLst["a:path"];
  const pathWidth = parseInt(path.attrs?.w) || 0;
  const pathHeight = parseInt(path.attrs?.h) || 0;
  const commands = extractPathCommands(path);
  if (commands.length === 0) return "custom";
  const analysis = analyzePathCommands(commands, pathWidth, pathHeight);
  return matchShape(analysis);
}
function extractPathCommands(path) {
  const commands = [];
  if (path["a:moveTo"]) {
    const moveTo = path["a:moveTo"];
    const pt = moveTo["a:pt"];
    if (pt) {
      commands.push({
        type: "moveTo",
        points: [{ x: parseInt(pt.attrs?.x) || 0, y: parseInt(pt.attrs?.y) || 0 }]
      });
    }
  }
  const lineToList = normalizeToArray(path["a:lnTo"]);
  lineToList.forEach((lnTo) => {
    const pt = lnTo["a:pt"];
    if (pt) {
      commands.push({
        type: "lineTo",
        points: [{ x: parseInt(pt.attrs?.x) || 0, y: parseInt(pt.attrs?.y) || 0 }]
      });
    }
  });
  const cubicList = normalizeToArray(path["a:cubicBezTo"]);
  cubicList.forEach((cubic) => {
    const pts = normalizeToArray(cubic["a:pt"]);
    const points = pts.map((pt) => ({
      x: parseInt(pt.attrs?.x) || 0,
      y: parseInt(pt.attrs?.y) || 0
    }));
    if (points.length === 3) {
      commands.push({ type: "cubicBezTo", points });
    }
  });
  const arcList = normalizeToArray(path["a:arcTo"]);
  arcList.forEach((arc) => {
    commands.push({
      type: "arcTo",
      wR: parseInt(arc.attrs?.wR) || 0,
      hR: parseInt(arc.attrs?.hR) || 0,
      stAng: parseInt(arc.attrs?.stAng) || 0,
      swAng: parseInt(arc.attrs?.swAng) || 0
    });
  });
  const quadList = normalizeToArray(path["a:quadBezTo"]);
  quadList.forEach((quad) => {
    const pts = normalizeToArray(quad["a:pt"]);
    const points = pts.map((pt) => ({
      x: parseInt(pt.attrs?.x) || 0,
      y: parseInt(pt.attrs?.y) || 0
    }));
    commands.push({ type: "quadBezTo", points });
  });
  if (path["a:close"]) {
    commands.push({ type: "close" });
  }
  return commands;
}
function normalizeToArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}
function analyzePathCommands(commands, pathWidth, pathHeight) {
  const analysis = {
    lineCount: 0,
    curveCount: 0,
    arcCount: 0,
    isClosed: false,
    vertices: [],
    aspectRatio: pathHeight !== 0 ? pathWidth / pathHeight : 1,
    pathWidth,
    pathHeight,
    hasCurves: false,
    isCircular: false,
    commands
  };
  commands.forEach((cmd) => {
    switch (cmd.type) {
      case "moveTo":
        analysis.vertices.push(cmd.points[0]);
        break;
      case "lineTo":
        analysis.lineCount++;
        analysis.vertices.push(cmd.points[0]);
        break;
      case "cubicBezTo":
        analysis.curveCount++;
        analysis.hasCurves = true;
        if (cmd.points.length === 3) {
          analysis.vertices.push(cmd.points[2]);
        }
        break;
      case "quadBezTo":
        analysis.curveCount++;
        analysis.hasCurves = true;
        if (cmd.points.length >= 2) {
          analysis.vertices.push(cmd.points[cmd.points.length - 1]);
        }
        break;
      case "arcTo":
        analysis.arcCount++;
        analysis.hasCurves = true;
        break;
      case "close":
        analysis.isClosed = true;
        break;
      default:
        break;
    }
  });
  if (analysis.curveCount === 4 && analysis.lineCount === 0 && analysis.isClosed) {
    analysis.isCircular = checkIfCircular(commands, pathWidth, pathHeight);
  }
  return analysis;
}
function checkIfCircular(commands, width, height) {
  const bezierCommands = commands.filter((c) => c.type === "cubicBezTo");
  if (bezierCommands.length !== 4) return false;
  const endpoints = bezierCommands.map((cmd) => cmd.points[2]);
  const hasTop = endpoints.some((p) => Math.abs(p.y) < height * 0.1);
  const hasBottom = endpoints.some((p) => Math.abs(p.y - height) < height * 0.1);
  const hasLeft = endpoints.some((p) => Math.abs(p.x) < width * 0.1);
  const hasRight = endpoints.some((p) => Math.abs(p.x - width) < width * 0.1);
  return (hasTop || hasBottom) && (hasLeft || hasRight);
}
function matchShape(analysis) {
  const {
    lineCount,
    curveCount,
    isClosed,
    vertices,
    hasCurves,
    isCircular,
    pathWidth,
    pathHeight
  } = analysis;
  if (isCircular) return "ellipse";
  if (analysis.arcCount >= 2 && isClosed && lineCount === 0) return "ellipse";
  if (!hasCurves && isClosed && vertices.length >= 3) return matchPolygon(vertices, pathWidth, pathHeight);
  if (lineCount === 4 && curveCount === 4 && isClosed) return "roundRect";
  if (lineCount >= 3 && curveCount > 0 && curveCount <= lineCount && isClosed) {
    const baseShape = matchPolygonByLineCount(lineCount);
    if (baseShape !== "custom") return baseShape === "rectangle" ? "roundRect" : baseShape;
  }
  return "custom";
}
function matchPolygon(vertices, width, height) {
  const uniqueVertices = removeDuplicateVertices(vertices);
  const vertexCount = uniqueVertices.length;
  switch (vertexCount) {
    case 3:
      return "triangle";
    case 4:
      return matchQuadrilateral(uniqueVertices, width, height);
    case 5:
      return "pentagon";
    case 6:
      return "hexagon";
    case 7:
      return "heptagon";
    case 8:
      return "octagon";
    default:
      if (vertexCount > 8) {
        return "ellipse";
      }
      return "custom";
  }
}
function removeDuplicateVertices(vertices) {
  const threshold = 100;
  const unique = [];
  vertices.forEach((v) => {
    const isDuplicate = unique.some(
      (u) => Math.abs(u.x - v.x) < threshold && Math.abs(u.y - v.y) < threshold
    );
    if (!isDuplicate) unique.push(v);
  });
  return unique;
}
function matchQuadrilateral(vertices) {
  if (vertices.length !== 4) return "custom";
  const edges = [];
  for (let i = 0; i < 4; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % 4];
    edges.push({
      dx: p2.x - p1.x,
      dy: p2.y - p1.y,
      length: Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
    });
  }
  if (isRectangle(edges)) return "roundRect";
  if (isRhombus(edges)) return "rhombus";
  if (isParallelogram(edges)) return "parallelogram";
  if (isTrapezoid(edges)) return "trapezoid";
  return "custom";
}
function isRectangle(edges) {
  const tolerance = 0.1;
  const edge02Similar = Math.abs(edges[0].length - edges[2].length) / Math.max(edges[0].length, edges[2].length) < tolerance;
  const edge13Similar = Math.abs(edges[1].length - edges[3].length) / Math.max(edges[1].length, edges[3].length) < tolerance;
  if (!edge02Similar || !edge13Similar) return false;
  for (let i = 0; i < 4; i++) {
    const e1 = edges[i];
    const e2 = edges[(i + 1) % 4];
    const dotProduct = e1.dx * e2.dx + e1.dy * e2.dy;
    const cosAngle = dotProduct / (e1.length * e2.length);
    if (Math.abs(cosAngle) > 0.1) return false;
  }
  return true;
}
function isRhombus(edges) {
  const tolerance = 0.1;
  const avgLength = edges.reduce((sum, e) => sum + e.length, 0) / 4;
  return edges.every((e) => Math.abs(e.length - avgLength) / avgLength < tolerance);
}
function isParallelogram(edges) {
  const tolerance = 0.15;
  const slope0 = edges[0].dx !== 0 ? edges[0].dy / edges[0].dx : Infinity;
  const slope2 = edges[2].dx !== 0 ? edges[2].dy / edges[2].dx : Infinity;
  const slope1 = edges[1].dx !== 0 ? edges[1].dy / edges[1].dx : Infinity;
  const slope3 = edges[3].dx !== 0 ? edges[3].dy / edges[3].dx : Infinity;
  const parallel02 = Math.abs(slope0 - slope2) < tolerance || Math.abs(slope0) > 1e3 && Math.abs(slope2) > 1e3;
  const parallel13 = Math.abs(slope1 - slope3) < tolerance || Math.abs(slope1) > 1e3 && Math.abs(slope3) > 1e3;
  return parallel02 && parallel13;
}
function isTrapezoid(edges) {
  const tolerance = 0.15;
  const slope0 = edges[0].dx !== 0 ? edges[0].dy / edges[0].dx : Infinity;
  const slope2 = edges[2].dx !== 0 ? edges[2].dy / edges[2].dx : Infinity;
  const slope1 = edges[1].dx !== 0 ? edges[1].dy / edges[1].dx : Infinity;
  const slope3 = edges[3].dx !== 0 ? edges[3].dy / edges[3].dx : Infinity;
  const parallel02 = Math.abs(slope0 - slope2) < tolerance || Math.abs(slope0) > 1e3 && Math.abs(slope2) > 1e3;
  const parallel13 = Math.abs(slope1 - slope3) < tolerance || Math.abs(slope1) > 1e3 && Math.abs(slope3) > 1e3;
  return parallel02 && !parallel13 || !parallel02 && parallel13;
}
function matchPolygonByLineCount(lineCount) {
  switch (lineCount) {
    case 3:
      return "triangle";
    case 4:
      return "rectangle";
    case 5:
      return "pentagon";
    case 6:
      return "hexagon";
    case 7:
      return "heptagon";
    case 8:
      return "octagon";
    default:
      return "custom";
  }
}

// forked_pptxtojson/table.js
function getTableTextColor(tcTxStyle, warpObj) {
  if (!tcTxStyle) return void 0;
  return getSolidFill(tcTxStyle["a:solidFill"] || tcTxStyle, void 0, void 0, warpObj);
}
function getTableBorders(node, warpObj) {
  const borders = {};
  if (node["a:bottom"]) {
    const obj = {
      "p:spPr": {
        "a:ln": node["a:bottom"]["a:ln"]
      }
    };
    const border = getBorder(obj, void 0, warpObj);
    borders.bottom = border;
  }
  if (node["a:top"]) {
    const obj = {
      "p:spPr": {
        "a:ln": node["a:top"]["a:ln"]
      }
    };
    const border = getBorder(obj, void 0, warpObj);
    borders.top = border;
  }
  if (node["a:right"]) {
    const obj = {
      "p:spPr": {
        "a:ln": node["a:right"]["a:ln"]
      }
    };
    const border = getBorder(obj, void 0, warpObj);
    borders.right = border;
  }
  if (node["a:left"]) {
    const obj = {
      "p:spPr": {
        "a:ln": node["a:left"]["a:ln"]
      }
    };
    const border = getBorder(obj, void 0, warpObj);
    borders.left = border;
  }
  return borders;
}
async function getTableCellParams(tcNode, thisTblStyle, cellSource, warpObj) {
  const rowSpan = getTextByPathList(tcNode, ["attrs", "rowSpan"]);
  const colSpan = getTextByPathList(tcNode, ["attrs", "gridSpan"]);
  const vMerge = getTextByPathList(tcNode, ["attrs", "vMerge"]);
  const hMerge = getTextByPathList(tcNode, ["attrs", "hMerge"]);
  const anchor = getTextByPathList(tcNode, ["a:tcPr", "attrs", "anchor"]);
  let fillColor;
  let fontColor;
  let fontBold;
  const getCelFill = getTextByPathList(tcNode, ["a:tcPr"]);
  if (getCelFill) {
    const cellObj = { "p:spPr": getCelFill };
    const fill = await getShapeFill(cellObj, warpObj, "slide");
    if (fill && fill.type === "color" && fill.value) {
      fillColor = fill.value;
    }
  }
  if (!fillColor) {
    let bgFillschemeClr;
    if (cellSource) bgFillschemeClr = getTextByPathList(thisTblStyle, [cellSource, "a:tcStyle", "a:fill", "a:solidFill"]);
    if (bgFillschemeClr) {
      fillColor = getSolidFill(bgFillschemeClr, void 0, void 0, warpObj);
    }
  }
  let rowTxtStyl;
  if (cellSource) rowTxtStyl = getTextByPathList(thisTblStyle, [cellSource, "a:tcTxStyle"]);
  if (rowTxtStyl) {
    fontColor = getTableTextColor(rowTxtStyl, warpObj);
    if (getTextByPathList(rowTxtStyl, ["attrs", "b"]) === "on") fontBold = true;
  }
  let lin_bottm = getTextByPathList(tcNode, ["a:tcPr", "a:lnB"]);
  if (!lin_bottm) {
    if (cellSource) lin_bottm = getTextByPathList(thisTblStyle[cellSource], ["a:tcStyle", "a:tcBdr", "a:bottom", "a:ln"]);
    if (!lin_bottm) lin_bottm = getTextByPathList(thisTblStyle, ["a:wholeTbl", "a:tcStyle", "a:tcBdr", "a:bottom", "a:ln"]);
  }
  let lin_top = getTextByPathList(tcNode, ["a:tcPr", "a:lnT"]);
  if (!lin_top) {
    if (cellSource) lin_top = getTextByPathList(thisTblStyle[cellSource], ["a:tcStyle", "a:tcBdr", "a:top", "a:ln"]);
    if (!lin_top) lin_top = getTextByPathList(thisTblStyle, ["a:wholeTbl", "a:tcStyle", "a:tcBdr", "a:top", "a:ln"]);
  }
  let lin_left = getTextByPathList(tcNode, ["a:tcPr", "a:lnL"]);
  if (!lin_left) {
    if (cellSource) lin_left = getTextByPathList(thisTblStyle[cellSource], ["a:tcStyle", "a:tcBdr", "a:left", "a:ln"]);
    if (!lin_left) lin_left = getTextByPathList(thisTblStyle, ["a:wholeTbl", "a:tcStyle", "a:tcBdr", "a:left", "a:ln"]);
  }
  let lin_right = getTextByPathList(tcNode, ["a:tcPr", "a:lnR"]);
  if (!lin_right) {
    if (cellSource) lin_right = getTextByPathList(thisTblStyle[cellSource], ["a:tcStyle", "a:tcBdr", "a:right", "a:ln"]);
    if (!lin_right) lin_right = getTextByPathList(thisTblStyle, ["a:wholeTbl", "a:tcStyle", "a:tcBdr", "a:right", "a:ln"]);
  }
  const borders = {};
  if (lin_bottm) borders.bottom = getBorder(lin_bottm, void 0, warpObj);
  if (lin_top) borders.top = getBorder(lin_top, void 0, warpObj);
  if (lin_left) borders.left = getBorder(lin_left, void 0, warpObj);
  if (lin_right) borders.right = getBorder(lin_right, void 0, warpObj);
  return {
    fillColor,
    fontColor,
    fontBold,
    borders,
    vAlign: anchor === "ctr" ? "mid" : anchor === "b" ? "down" : "up",
    rowSpan: rowSpan ? +rowSpan : void 0,
    colSpan: colSpan ? +colSpan : void 0,
    vMerge: vMerge ? +vMerge : void 0,
    hMerge: hMerge ? +hMerge : void 0
  };
}
function getTableRowParams(trNodes, i, tblStylAttrObj, thisTblStyle, warpObj) {
  let fillColor;
  let fontColor;
  let fontBold;
  if (thisTblStyle && thisTblStyle["a:wholeTbl"]) {
    const bgFillschemeClr = getTextByPathList(thisTblStyle, ["a:wholeTbl", "a:tcStyle", "a:fill", "a:solidFill"]);
    if (bgFillschemeClr) {
      const local_fillColor = getSolidFill(bgFillschemeClr, void 0, void 0, warpObj);
      if (local_fillColor) fillColor = local_fillColor;
    }
    const rowTxtStyl = getTextByPathList(thisTblStyle, ["a:wholeTbl", "a:tcTxStyle"]);
    if (rowTxtStyl) {
      const local_fontColor = getTableTextColor(rowTxtStyl, warpObj);
      if (local_fontColor) fontColor = local_fontColor;
      if (getTextByPathList(rowTxtStyl, ["attrs", "b"]) === "on") fontBold = true;
    }
  }
  if (i === 0 && tblStylAttrObj["isFrstRowAttr"] === 1 && thisTblStyle) {
    const bgFillschemeClr = getTextByPathList(thisTblStyle, ["a:firstRow", "a:tcStyle", "a:fill", "a:solidFill"]);
    if (bgFillschemeClr) {
      const local_fillColor = getSolidFill(bgFillschemeClr, void 0, void 0, warpObj);
      if (local_fillColor) fillColor = local_fillColor;
    }
    const rowTxtStyl = getTextByPathList(thisTblStyle, ["a:firstRow", "a:tcTxStyle"]);
    if (rowTxtStyl) {
      const local_fontColor = getTableTextColor(rowTxtStyl, warpObj);
      if (local_fontColor) fontColor = local_fontColor;
      if (getTextByPathList(rowTxtStyl, ["attrs", "b"]) === "on") fontBold = true;
    }
  } else if (i > 0 && tblStylAttrObj["isBandRowAttr"] === 1 && thisTblStyle) {
    fillColor = "";
    if (i % 2 === 0 && thisTblStyle["a:band2H"]) {
      const bgFillschemeClr = getTextByPathList(thisTblStyle, ["a:band2H", "a:tcStyle", "a:fill", "a:solidFill"]);
      if (bgFillschemeClr) {
        const local_fillColor = getSolidFill(bgFillschemeClr, void 0, void 0, warpObj);
        if (local_fillColor) fillColor = local_fillColor;
      }
      const rowTxtStyl = getTextByPathList(thisTblStyle, ["a:band2H", "a:tcTxStyle"]);
      if (rowTxtStyl) {
        const local_fontColor = getTableTextColor(rowTxtStyl, warpObj);
        if (local_fontColor) fontColor = local_fontColor;
      }
      if (getTextByPathList(rowTxtStyl, ["attrs", "b"]) === "on") fontBold = true;
    }
    if (i % 2 !== 0 && thisTblStyle["a:band1H"]) {
      const bgFillschemeClr = getTextByPathList(thisTblStyle, ["a:band1H", "a:tcStyle", "a:fill", "a:solidFill"]);
      if (bgFillschemeClr) {
        const local_fillColor = getSolidFill(bgFillschemeClr, void 0, void 0, warpObj);
        if (local_fillColor) fillColor = local_fillColor;
      }
      const rowTxtStyl = getTextByPathList(thisTblStyle, ["a:band1H", "a:tcTxStyle"]);
      if (rowTxtStyl) {
        const local_fontColor = getTableTextColor(rowTxtStyl, warpObj);
        if (local_fontColor) fontColor = local_fontColor;
        if (getTextByPathList(rowTxtStyl, ["attrs", "b"]) === "on") fontBold = true;
      }
    }
  }
  if (i === trNodes.length - 1 && tblStylAttrObj["isLstRowAttr"] === 1 && thisTblStyle) {
    const bgFillschemeClr = getTextByPathList(thisTblStyle, ["a:lastRow", "a:tcStyle", "a:fill", "a:solidFill"]);
    if (bgFillschemeClr) {
      const local_fillColor = getSolidFill(bgFillschemeClr, void 0, void 0, warpObj);
      if (local_fillColor) {
        fillColor = local_fillColor;
      }
    }
    const rowTxtStyl = getTextByPathList(thisTblStyle, ["a:lastRow", "a:tcTxStyle"]);
    if (rowTxtStyl) {
      const local_fontColor = getTableTextColor(rowTxtStyl, warpObj);
      if (local_fontColor) fontColor = local_fontColor;
      if (getTextByPathList(rowTxtStyl, ["attrs", "b"]) === "on") fontBold = true;
    }
  }
  return {
    fillColor,
    fontColor,
    fontBold
  };
}

// forked_pptxtojson/math.js
function findOMath(obj) {
  let results = [];
  if (typeof obj !== "object") return results;
  if (obj["m:oMath"]) results = results.concat(obj["m:oMath"]);
  Object.values(obj).forEach((value) => {
    if (Array.isArray(value) || typeof value === "object") {
      results = results.concat(findOMath(value));
    }
  });
  return results;
}
function parseFraction(fraction) {
  const numerator = parseOMath(fraction["m:num"]);
  const denominator = parseOMath(fraction["m:den"]);
  return `\\frac{${numerator}}{${denominator}}`;
}
function parseSuperscript(superscript) {
  const base = parseOMath(superscript["m:e"]);
  const sup = parseOMath(superscript["m:sup"]);
  return `${base}^{${sup}}`;
}
function parseSubscript(subscript) {
  const base = parseOMath(subscript["m:e"]);
  const sub = parseOMath(subscript["m:sub"]);
  return `${base}_{${sub}}`;
}
function parseRadical(radical) {
  const degree = parseOMath(radical["m:deg"]);
  const expression = parseOMath(radical["m:e"]);
  return degree ? `\\sqrt[${degree}]{${expression}}` : `\\sqrt{${expression}}`;
}
function parseMatrix(matrix) {
  const rows = matrix["m:mr"];
  const matrixRows = rows.map((row) => {
    return row["m:e"].map((element) => parseOMath(element)).join(" & ");
  });
  return `\\begin{matrix} ${matrixRows.join(" \\\\ ")} \\end{matrix}`;
}
function parseNary(nary) {
  const op = getTextByPathList(nary, ["m:naryPr", "m:chr", "attrs", "m:val"]) || "\u222B";
  const sub = parseOMath(nary["m:sub"]);
  const sup = parseOMath(nary["m:sup"]);
  const e = parseOMath(nary["m:e"]);
  return `${op}_{${sub}}^{${sup}}{${e}}`;
}
function parseLimit(limit, type) {
  const base = parseOMath(limit["m:e"]);
  const lim = parseOMath(limit["m:lim"]);
  return type === "low" ? `${base}_{${lim}}` : `${base}^{${lim}}`;
}
function parseDelimiter(delimiter) {
  let left = getTextByPathList(delimiter, ["m:dPr", "m:begChr", "attrs", "m:val"]);
  let right = getTextByPathList(delimiter, ["m:dPr", "m:endChr", "attrs", "m:val"]);
  if (!left && !right) {
    left = "(";
    right = ")";
  }
  if (left && right) {
    left = `\\left${left}`;
    right = `\\right${right}`;
  }
  const e = parseOMath(delimiter["m:e"]);
  return `${left}${e}${right}`;
}
function parseFunction(func) {
  const name = parseOMath(func["m:fName"]);
  const arg = parseOMath(func["m:e"]);
  return `\\${name}{${arg}}`;
}
function parseGroupChr(groupChr) {
  const chr = getTextByPathList(groupChr, ["m:groupChrPr", "m:chr", "attrs", "m:val"]);
  const e = parseOMath(groupChr["m:e"]);
  return `${chr}${e}${chr}`;
}
function parseEqArr(eqArr) {
  const equations = eqArr["m:e"].map((eq) => parseOMath(eq)).join(" \\\\ ");
  return `\\begin{cases} ${equations} \\end{cases}`;
}
function parseBar(bar) {
  const e = parseOMath(bar["m:e"]);
  const pos = getTextByPathList(bar, ["m:barPr", "m:pos", "attrs", "m:val"]);
  return pos === "top" ? `\\overline{${e}}` : `\\underline{${e}}`;
}
function parseAccent(accent) {
  const chr = getTextByPathList(accent, ["m:accPr", "m:chr", "attrs", "m:val"]) || "^";
  const e = parseOMath(accent["m:e"]);
  switch (chr) {
    case "\u0301":
      return `\\acute{${e}}`;
    case "\u0300":
      return `\\grave{${e}}`;
    case "\u0302":
      return `\\hat{${e}}`;
    case "\u0303":
      return `\\tilde{${e}}`;
    case "\u0304":
      return `\\bar{${e}}`;
    case "\u0306":
      return `\\breve{${e}}`;
    case "\u0307":
      return `\\dot{${e}}`;
    case "\u0308":
      return `\\ddot{${e}}`;
    case "\u030A":
      return `\\mathring{${e}}`;
    case "\u030B":
      return `\\H{${e}}`;
    case "\u030C":
      return `\\check{${e}}`;
    case "\u0327":
      return `\\c{${e}}`;
    default:
      return `\\${chr}{${e}}`;
  }
}
function parseBox(box) {
  const e = parseOMath(box["m:e"]);
  return `\\boxed{${e}}`;
}
function parseOMath(oMath) {
  if (!oMath) return "";
  if (Array.isArray(oMath)) {
    return oMath.map((item) => parseOMath(item)).join("");
  }
  const oMathList = [];
  const keys = Object.keys(oMath);
  for (const key of keys) {
    if (Array.isArray(oMath[key])) {
      oMathList.push(...oMath[key].map((item) => ({ key, value: item })));
    } else oMathList.push({ key, value: oMath[key] });
  }
  oMathList.sort((a, b) => {
    let oA = 0;
    if (a.key === "m:r" && a.value && a.value["a:rPr"]) oA = a.value["a:rPr"]["attrs"]["order"];
    else if (a.value[`${a.key}Pr`] && a.value[`${a.key}Pr`]["m:ctrlPr"] && a.value[`${a.key}Pr`]["m:ctrlPr"]["a:rPr"]) {
      oA = a.value[`${a.key}Pr`] && a.value[`${a.key}Pr`]["m:ctrlPr"] && a.value[`${a.key}Pr`]["m:ctrlPr"]["a:rPr"] && a.value[`${a.key}Pr`]["m:ctrlPr"]["a:rPr"]["attrs"]["order"];
    }
    let oB = 0;
    if (b.key === "m:r" && b.value && b.value["a:rPr"]) oB = b.value["a:rPr"]["attrs"]["order"];
    else if (b.value[`${b.key}Pr`] && b.value[`${b.key}Pr`]["m:ctrlPr"] && b.value[`${b.key}Pr`]["m:ctrlPr"]["a:rPr"]) {
      oB = b.value[`${b.key}Pr`] && b.value[`${b.key}Pr`]["m:ctrlPr"] && b.value[`${b.key}Pr`]["m:ctrlPr"]["a:rPr"] && b.value[`${b.key}Pr`]["m:ctrlPr"]["a:rPr"]["attrs"]["order"];
    }
    return oA - oB;
  });
  return oMathList.map(({ key, value }) => {
    if (key === "m:f") return parseFraction(value);
    if (key === "m:sSup") return parseSuperscript(value);
    if (key === "m:sSub") return parseSubscript(value);
    if (key === "m:rad") return parseRadical(value);
    if (key === "m:nary") return parseNary(value);
    if (key === "m:limLow") return parseLimit(value, "low");
    if (key === "m:limUpp") return parseLimit(value, "upp");
    if (key === "m:d") return parseDelimiter(value);
    if (key === "m:func") return parseFunction(value);
    if (key === "m:groupChr") return parseGroupChr(value);
    if (key === "m:eqArr") return parseEqArr(value);
    if (key === "m:bar") return parseBar(value);
    if (key === "m:acc") return parseAccent(value);
    if (key === "m:borderBox") return parseBox(value);
    if (key === "m:m") return parseMatrix(value);
    if (key === "m:r") return parseOMath(value);
    if (key === "m:t") return value;
    return "";
  }).join("");
}
function latexFormart(latex) {
  return latex.replaceAll(/&lt;/g, "<").replaceAll(/&gt;/g, ">").replaceAll(/&amp;/g, "&").replaceAll(/&apos;/g, "'").replaceAll(/&quot;/g, '"');
}

// forked_pptxtojson/shapePath.js
function shapePie(H, w, adj1, adj2, isClose) {
  const pieVal = parseFloat(adj2);
  const piAngle = parseFloat(adj1);
  const size = parseInt(H);
  const radiusY = size / 2;
  const radiusX = w / 2;
  const centerX = radiusX;
  const centerY = radiusY;
  let value = pieVal - piAngle;
  if (value < 0) value = 360 + value;
  value = Math.min(Math.max(value, 0), 360);
  const startRadians = piAngle * Math.PI / 180;
  const endRadians = (piAngle + value) * Math.PI / 180;
  const startX = centerX + Math.cos(startRadians) * radiusX;
  const startY = centerY + Math.sin(startRadians) * radiusY;
  const endX = centerX + Math.cos(endRadians) * radiusX;
  const endY = centerY + Math.sin(endRadians) * radiusY;
  let longArc, d;
  if (isClose) {
    longArc = value <= 180 ? 0 : 1;
    d = `M${centerX},${centerY} L${startX},${startY} A${radiusX},${radiusY} 0 ${longArc},1 ${endX},${endY} z`;
  } else {
    longArc = value <= 180 ? 0 : 1;
    d = `M${startX},${startY} A${radiusX},${radiusY} 0 ${longArc},1 ${endX},${endY}`;
  }
  return d;
}
function shapeGear(h, points) {
  const innerRadius = h;
  const outerRadius = 1.5 * innerRadius;
  const cx = outerRadius;
  const cy = outerRadius;
  const notches = points;
  const radiusO = outerRadius;
  const radiusI = innerRadius;
  const taperO = 50;
  const taperI = 35;
  const pi2 = 2 * Math.PI;
  const angle = pi2 / (notches * 2);
  const taperAI = angle * taperI * 5e-3;
  const taperAO = angle * taperO * 5e-3;
  let a = angle;
  let toggle = false;
  let d = " M" + (cx + radiusO * Math.cos(taperAO)) + " " + (cy + radiusO * Math.sin(taperAO));
  for (; a <= pi2 + angle; a += angle) {
    if (toggle) {
      d += " L" + (cx + radiusI * Math.cos(a - taperAI)) + "," + (cy + radiusI * Math.sin(a - taperAI));
      d += " L" + (cx + radiusO * Math.cos(a + taperAO)) + "," + (cy + radiusO * Math.sin(a + taperAO));
    } else {
      d += " L" + (cx + radiusO * Math.cos(a - taperAO)) + "," + (cy + radiusO * Math.sin(a - taperAO));
      d += " L" + (cx + radiusI * Math.cos(a + taperAI)) + "," + (cy + radiusI * Math.sin(a + taperAI));
    }
    toggle = !toggle;
  }
  d += " ";
  return d;
}
function shapeArc2(cX, cY, rX, rY, stAng, endAng, isClose) {
  let dData = "";
  const increment = endAng >= stAng ? 1 : -1;
  let angle = stAng;
  const condition = (a) => increment > 0 ? a <= endAng : a >= endAng;
  while (condition(angle)) {
    const radians = angle * (Math.PI / 180);
    const x = cX + Math.cos(radians) * rX;
    const y = cY + Math.sin(radians) * rY;
    if (angle === stAng) {
      dData = ` M${x} ${y}`;
    }
    dData += ` L${x} ${y}`;
    angle += increment;
  }
  if (isClose) {
    dData += " z";
  }
  return dData;
}
function shapeSnipRoundRect(w, h, adj1, adj2, shapeType, adjType) {
  let adjA, adjB, adjC, adjD;
  switch (adjType) {
    case "cornr1":
      adjA = 0;
      adjB = 0;
      adjC = 0;
      adjD = adj1;
      break;
    case "cornr2":
      adjA = adj1;
      adjB = adj2;
      adjC = adj2;
      adjD = adj1;
      break;
    case "cornrAll":
      adjA = adj1;
      adjB = adj1;
      adjC = adj1;
      adjD = adj1;
      break;
    case "diag":
      adjA = adj1;
      adjB = adj2;
      adjC = adj1;
      adjD = adj2;
      break;
    case "cornrTL":
      adjA = adj1;
      adjB = 0;
      adjC = 0;
      adjD = 0;
      break;
    default:
      adjA = adjB = adjC = adjD = 0;
  }
  if (shapeType === "round") {
    return `M0,${h / 2 + (1 - adjB) * (h / 2)} Q0,${h} ${adjB * (w / 2)},${h} L${w / 2 + (1 - adjC) * (w / 2)},${h} Q${w},${h} ${w},${h / 2 + h / 2 * (1 - adjC)} L${w},${h / 2 * adjD} Q${w},0 ${w / 2 + w / 2 * (1 - adjD)},0 L${w / 2 * adjA},0 Q0,0 0,${h / 2 * adjA} z`;
  } else if (shapeType === "snip") {
    return `M0,${adjA * (h / 2)} L0,${h / 2 + h / 2 * (1 - adjB)} L${adjB * (w / 2)},${h} L${w / 2 + w / 2 * (1 - adjC)},${h} L${w},${h / 2 + h / 2 * (1 - adjC)} L${w},${adjD * (h / 2)} L${w / 2 + w / 2 * (1 - adjD)},0 L${w / 2 * adjA},0 z`;
  }
  return "";
}
function getShapePath(shapType, w, h, node) {
  let pathData = "";
  switch (shapType) {
    case "rect":
    case "actionButtonBlank":
      pathData = `M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`;
      break;
    case "flowChartPredefinedProcess":
      pathData = `M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z M ${w * (1 / 8)} 0 L ${w * (1 / 8)} ${h} M ${w * (7 / 8)} 0 L ${w * (7 / 8)} ${h}`;
      break;
    case "flowChartInternalStorage":
      pathData = `M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z M ${w * (1 / 8)} 0 L ${w * (1 / 8)} ${h} M 0 ${h * (1 / 8)} L ${w} ${h * (1 / 8)}`;
      break;
    case "flowChartCollate":
      pathData = `M 0,0 L ${w},0 L 0,${h} L ${w},${h} z`;
      break;
    case "flowChartDocument":
      {
        const x1 = w * 10800 / 21600;
        const y1 = h * 17322 / 21600;
        const y2 = h * 20172 / 21600;
        const y3 = h * 23922 / 21600;
        pathData = `M 0,0 L ${w},0 L ${w},${y1} C ${x1},${y1} ${x1},${y3} 0,${y2} z`;
      }
      break;
    case "flowChartMultidocument":
      {
        const y1 = h * 18022 / 21600;
        const y2 = h * 3675 / 21600;
        const y3 = h * 23542 / 21600;
        const y4 = h * 1815 / 21600;
        const y5 = h * 16252 / 21600;
        const y6 = h * 16352 / 21600;
        const y7 = h * 14392 / 21600;
        const y8 = h * 20782 / 21600;
        const y9 = h * 14467 / 21600;
        const x1 = w * 1532 / 21600;
        const x2 = w * 2e4 / 21600;
        const x3 = w * 9298 / 21600;
        const x4 = w * 19298 / 21600;
        const x5 = w * 18595 / 21600;
        const x6 = w * 2972 / 21600;
        const x7 = w * 20800 / 21600;
        pathData = `M 0,${y2} L ${x5},${y2} L ${x5},${y1} C ${x3},${y1} ${x3},${y3} 0,${y8} z M ${x1},${y2} L ${x1},${y4} L ${x2},${y4} L ${x2},${y5} C ${x4},${y5} ${x5},${y6} ${x5},${y6} M ${x6},${y4} L ${x6},0 L ${w},0 L ${w},${y7} C ${x7},${y7} ${x2},${y9} ${x2},${y9}`;
      }
      break;
    case "actionButtonBackPrevious":
      {
        const hc = w / 2, vc = h / 2, ss = Math.min(w, h);
        const dx2 = ss * 3 / 8;
        const g9 = vc - dx2;
        const g10 = vc + dx2;
        const g11 = hc - dx2;
        const g12 = hc + dx2;
        pathData = `M 0,0 L ${w},0 L ${w},${h} L 0,${h} z M ${g11},${vc} L ${g12},${g9} L ${g12},${g10} z`;
      }
      break;
    case "actionButtonBeginning":
      {
        const hc = w / 2, vc = h / 2, ss = Math.min(w, h);
        const dx2 = ss * 3 / 8;
        const g9 = vc - dx2;
        const g10 = vc + dx2;
        const g11 = hc - dx2;
        const g12 = hc + dx2;
        const g13 = ss * 3 / 4;
        const g14 = g13 / 8;
        const g15 = g13 / 4;
        const g16 = g11 + g14;
        const g17 = g11 + g15;
        pathData = `M 0,0 L ${w},0 L ${w},${h} L 0,${h} z M ${g17},${vc} L ${g12},${g9} L ${g12},${g10} z M ${g16},${g9} L ${g11},${g9} L ${g11},${g10} L ${g16},${g10} z`;
      }
      break;
    case "actionButtonDocument":
      {
        const hc = w / 2, vc = h / 2, ss = Math.min(w, h);
        const dx2 = ss * 3 / 8;
        const g9 = vc - dx2;
        const g10 = vc + dx2;
        const dx1 = ss * 9 / 32;
        const g11 = hc - dx1;
        const g12 = hc + dx1;
        const g13 = ss * 3 / 16;
        const g14 = g12 - g13;
        const g15 = g9 + g13;
        pathData = `M 0,0 L ${w},0 L ${w},${h} L 0,${h} z M ${g11},${g9} L ${g14},${g9} L ${g12},${g15} L ${g12},${g10} L ${g11},${g10} z M ${g14},${g9} L ${g14},${g15} L ${g12},${g15} z`;
      }
      break;
    case "actionButtonEnd":
      {
        const hc = w / 2, vc = h / 2, ss = Math.min(w, h);
        const dx2 = ss * 3 / 8;
        const g9 = vc - dx2;
        const g10 = vc + dx2;
        const g11 = hc - dx2;
        const g12 = hc + dx2;
        const g13 = ss * 3 / 4;
        const g14 = g13 * 3 / 4;
        const g15 = g13 * 7 / 8;
        const g16 = g11 + g14;
        const g17 = g11 + g15;
        pathData = `M 0,${h} L ${w},${h} L ${w},0 L 0,0 z M ${g17},${g9} L ${g12},${g9} L ${g12},${g10} L ${g17},${g10} z M ${g16},${vc} L ${g11},${g9} L ${g11},${g10} z`;
      }
      break;
    case "actionButtonForwardNext":
      {
        const hc = w / 2, vc = h / 2, ss = Math.min(w, h);
        const dx2 = ss * 3 / 8;
        const g9 = vc - dx2;
        const g10 = vc + dx2;
        const g11 = hc - dx2;
        const g12 = hc + dx2;
        pathData = `M 0,${h} L ${w},${h} L ${w},0 L 0,0 z M ${g12},${vc} L ${g11},${g9} L ${g11},${g10} z`;
      }
      break;
    case "actionButtonHelp":
      {
        const hc = w / 2, vc = h / 2, ss = Math.min(w, h);
        const dx2 = ss * 3 / 8;
        const g9 = vc - dx2;
        const g11 = hc - dx2;
        const g13 = ss * 3 / 4;
        const g14 = g13 / 7;
        const g15 = g13 * 3 / 14;
        const g16 = g13 * 2 / 7;
        const g19 = g13 * 3 / 7;
        const g20 = g13 * 4 / 7;
        const g21 = g13 * 17 / 28;
        const g23 = g13 * 21 / 28;
        const g24 = g13 * 11 / 14;
        const g27 = g9 + g16;
        const g29 = g9 + g21;
        const g30 = g9 + g23;
        const g31 = g9 + g24;
        const g33 = g11 + g15;
        const g36 = g11 + g19;
        const g37 = g11 + g20;
        const g41 = g13 / 14;
        const g42 = g13 * 3 / 28;
        const cX1 = g33 + g16;
        const cX2 = g36 + g14;
        const cY3 = g31 + g42;
        const cX4 = (g37 + g36 + g16) / 2;
        pathData = `M 0,0 L ${w},0 L ${w},${h} L 0,${h} z M ${g33},${g27} ${shapeArc2(cX1, g27, g16, g16, 180, 360, false).replace("M", "L")} ${shapeArc2(cX4, g27, g14, g15, 0, 90, false).replace("M", "L")} ${shapeArc2(cX4, g29, g41, g42, 270, 180, false).replace("M", "L")} L ${g37},${g30} L ${g36},${g30} L ${g36},${g29} ${shapeArc2(cX2, g29, g14, g15, 180, 270, false).replace("M", "L")} ${shapeArc2(g37, g27, g41, g42, 90, 0, false).replace("M", "L")} ${shapeArc2(cX1, g27, g14, g14, 0, -180, false).replace("M", "L")} z M ${hc},${g31} ${shapeArc2(hc, cY3, g42, g42, 270, 630, false).replace("M", "L")} z`;
      }
      break;
    case "actionButtonHome":
      {
        const hc = w / 2, vc = h / 2, ss = Math.min(w, h);
        const dx2 = ss * 3 / 8;
        const g9 = vc - dx2;
        const g10 = vc + dx2;
        const g11 = hc - dx2;
        const g12 = hc + dx2;
        const g13 = ss * 3 / 4;
        const g14 = g13 / 16;
        const g15 = g13 / 8;
        const g16 = g13 * 3 / 16;
        const g17 = g13 * 5 / 16;
        const g18 = g13 * 7 / 16;
        const g19 = g13 * 9 / 16;
        const g20 = g13 * 11 / 16;
        const g21 = g13 * 3 / 4;
        const g22 = g13 * 13 / 16;
        const g23 = g13 * 7 / 8;
        const g24 = g9 + g14;
        const g25 = g9 + g16;
        const g26 = g9 + g17;
        const g27 = g9 + g21;
        const g28 = g11 + g15;
        const g29 = g11 + g18;
        const g30 = g11 + g19;
        const g31 = g11 + g20;
        const g32 = g11 + g22;
        const g33 = g11 + g23;
        pathData = `M 0,0 L ${w},0 L ${w},${h} L 0,${h} z M ${hc},${g9} L ${g11},${vc} L ${g28},${vc} L ${g28},${g10} L ${g33},${g10} L ${g33},${vc} L ${g12},${vc} L ${g32},${g26} L ${g32},${g24} L ${g31},${g24} L ${g31},${g25} z M ${g29},${g27} L ${g30},${g27} L ${g30},${g10} L ${g29},${g10} z`;
      }
      break;
    case "actionButtonInformation":
      {
        const hc = w / 2, vc = h / 2, ss = Math.min(w, h);
        const dx2 = ss * 3 / 8;
        const g9 = vc - dx2;
        const g11 = hc - dx2;
        const g13 = ss * 3 / 4;
        const g14 = g13 / 32;
        const g17 = g13 * 5 / 16;
        const g18 = g13 * 3 / 8;
        const g19 = g13 * 13 / 32;
        const g20 = g13 * 19 / 32;
        const g22 = g13 * 11 / 16;
        const g23 = g13 * 13 / 16;
        const g24 = g13 * 7 / 8;
        const g25 = g9 + g14;
        const g28 = g9 + g17;
        const g29 = g9 + g18;
        const g30 = g9 + g23;
        const g31 = g9 + g24;
        const g32 = g11 + g17;
        const g34 = g11 + g19;
        const g35 = g11 + g20;
        const g37 = g11 + g22;
        const g38 = g13 * 3 / 32;
        const cY1 = g9 + dx2;
        const cY2 = g25 + g38;
        pathData = `M 0,0 L ${w},0 L ${w},${h} L 0,${h} z M ${hc},${g9} ${shapeArc2(hc, cY1, dx2, dx2, 270, 630, false).replace("M", "L")} z M ${hc},${g25} ${shapeArc2(hc, cY2, g38, g38, 270, 630, false).replace("M", "L")} M ${g32},${g28} L ${g35},${g28} L ${g35},${g30} L ${g37},${g30} L ${g37},${g31} L ${g32},${g31} L ${g32},${g30} L ${g34},${g30} L ${g34},${g29} L ${g32},${g29} z`;
      }
      break;
    case "actionButtonMovie":
      {
        const hc = w / 2, vc = h / 2, ss = Math.min(w, h);
        const g11 = hc - ss * 3 / 8;
        const g9 = vc - ss * 3 / 8;
        const g12 = hc + ss * 3 / 8;
        const g13 = ss * 3 / 4;
        const g14 = g13 * 1455 / 21600;
        const g15 = g13 * 1905 / 21600;
        const g16 = g13 * 2325 / 21600;
        const g17 = g13 * 16155 / 21600;
        const g18 = g13 * 17010 / 21600;
        const g19 = g13 * 19335 / 21600;
        const g20 = g13 * 19725 / 21600;
        const g21 = g13 * 20595 / 21600;
        const g22 = g13 * 5280 / 21600;
        const g23 = g13 * 5730 / 21600;
        const g24 = g13 * 6630 / 21600;
        const g25 = g13 * 7492 / 21600;
        const g26 = g13 * 9067 / 21600;
        const g27 = g13 * 9555 / 21600;
        const g28 = g13 * 13342 / 21600;
        const g29 = g13 * 14580 / 21600;
        const g30 = g13 * 15592 / 21600;
        const g31 = g11 + g14;
        const g32 = g11 + g15;
        const g33 = g11 + g16;
        const g34 = g11 + g17;
        const g35 = g11 + g18;
        const g36 = g11 + g19;
        const g37 = g11 + g20;
        const g38 = g11 + g21;
        const g39 = g9 + g22;
        const g40 = g9 + g23;
        const g41 = g9 + g24;
        const g42 = g9 + g25;
        const g43 = g9 + g26;
        const g44 = g9 + g27;
        const g45 = g9 + g28;
        const g46 = g9 + g29;
        const g47 = g9 + g30;
        pathData = `M 0,${h} L ${w},${h} L ${w},0 L 0,0 z M ${g11},${g39} L ${g11},${g44} L ${g31},${g44} L ${g32},${g43} L ${g33},${g43} L ${g33},${g47} L ${g35},${g47} L ${g35},${g45} L ${g36},${g45} L ${g38},${g46} L ${g12},${g46} L ${g12},${g41} L ${g38},${g41} L ${g37},${g42} L ${g35},${g42} L ${g35},${g41} L ${g34},${g40} L ${g32},${g40} L ${g31},${g39} z`;
      }
      break;
    case "actionButtonReturn":
      {
        const hc = w / 2, vc = h / 2, ss = Math.min(w, h);
        const dx2 = ss * 3 / 8;
        const g9 = vc - dx2;
        const g10 = vc + dx2;
        const g11 = hc - dx2;
        const g12 = hc + dx2;
        const g13 = ss * 3 / 4;
        const g14 = g13 * 7 / 8;
        const g15 = g13 * 3 / 4;
        const g16 = g13 * 5 / 8;
        const g17 = g13 * 3 / 8;
        const g18 = g13 / 4;
        const g19 = g9 + g15;
        const g20 = g9 + g16;
        const g21 = g9 + g18;
        const g22 = g11 + g14;
        const g23 = g11 + g15;
        const g24 = g11 + g16;
        const g25 = g11 + g17;
        const g26 = g11 + g18;
        const g27 = g13 / 8;
        const cX1 = g24 - g27;
        const cY2 = g19 - g27;
        const cX3 = g11 + g17;
        const cY4 = g10 - g17;
        pathData = `M 0,${h} L ${w},${h} L ${w},0 L 0,0 z M ${g12},${g21} L ${g23},${g9} L ${hc},${g21} L ${g24},${g21} L ${g24},${g20} ${shapeArc2(cX1, g20, g27, g27, 0, 90, false).replace("M", "L")} L ${g25},${g19} ${shapeArc2(g25, cY2, g27, g27, 90, 180, false).replace("M", "L")} L ${g26},${g21} L ${g11},${g21} L ${g11},${g20} ${shapeArc2(cX3, g20, g17, g17, 180, 90, false).replace("M", "L")} L ${hc},${g10} ${shapeArc2(hc, cY4, g17, g17, 90, 0, false).replace("M", "L")} L ${g22},${g21} z`;
      }
      break;
    case "actionButtonSound":
      {
        const hc = w / 2, vc = h / 2, ss = Math.min(w, h);
        const dx2 = ss * 3 / 8;
        const g9 = vc - dx2;
        const g10 = vc + dx2;
        const g11 = hc - dx2;
        const g12 = hc + dx2;
        const g13 = ss * 3 / 4;
        const g14 = g13 / 8;
        const g15 = g13 * 5 / 16;
        const g16 = g13 * 5 / 8;
        const g17 = g13 * 11 / 16;
        const g18 = g13 * 3 / 4;
        const g19 = g13 * 7 / 8;
        const g20 = g9 + g14;
        const g21 = g9 + g15;
        const g22 = g9 + g17;
        const g23 = g9 + g19;
        const g24 = g11 + g15;
        const g25 = g11 + g16;
        const g26 = g11 + g18;
        pathData = `M 0,0 L ${w},0 L ${w},${h} L 0,${h} z M ${g11},${g21} L ${g24},${g21} L ${g25},${g9} L ${g25},${g10} L ${g24},${g22} L ${g11},${g22} z M ${g26},${g21} L ${g12},${g20} M ${g26},${vc} L ${g12},${vc} M ${g26},${g22} L ${g12},${g23}`;
      }
      break;
    case "irregularSeal1":
      pathData = `M ${w * 10800 / 21600},${h * 5800 / 21600} L ${w * 14522 / 21600},0 L ${w * 14155 / 21600},${h * 5325 / 21600} L ${w * 18380 / 21600},${h * 4457 / 21600} L ${w * 16702 / 21600},${h * 7315 / 21600} L ${w * 21097 / 21600},${h * 8137 / 21600} L ${w * 17607 / 21600},${h * 10475 / 21600} L ${w},${h * 13290 / 21600} L ${w * 16837 / 21600},${h * 12942 / 21600} L ${w * 18145 / 21600},${h * 18095 / 21600} L ${w * 14020 / 21600},${h * 14457 / 21600} L ${w * 13247 / 21600},${h * 19737 / 21600} L ${w * 10532 / 21600},${h * 14935 / 21600} L ${w * 8485 / 21600},${h} L ${w * 7715 / 21600},${h * 15627 / 21600} L ${w * 4762 / 21600},${h * 17617 / 21600} L ${w * 5667 / 21600},${h * 13937 / 21600} L ${w * 135 / 21600},${h * 14587 / 21600} L ${w * 3722 / 21600},${h * 11775 / 21600} L 0,${h * 8615 / 21600} L ${w * 4627 / 21600},${h * 7617 / 21600} L ${w * 370 / 21600},${h * 2295 / 21600} L ${w * 7312 / 21600},${h * 6320 / 21600} L ${w * 8352 / 21600},${h * 2295 / 21600} z`;
      break;
    case "irregularSeal2":
      pathData = `M ${w * 11462 / 21600},${h * 4342 / 21600} L ${w * 14790 / 21600},0 L ${w * 14525 / 21600},${h * 5777 / 21600} L ${w * 18007 / 21600},${h * 3172 / 21600} L ${w * 16380 / 21600},${h * 6532 / 21600} L ${w},${h * 6645 / 21600} L ${w * 16985 / 21600},${h * 9402 / 21600} L ${w * 18270 / 21600},${h * 11290 / 21600} L ${w * 16380 / 21600},${h * 12310 / 21600} L ${w * 18877 / 21600},${h * 15632 / 21600} L ${w * 14640 / 21600},${h * 14350 / 21600} L ${w * 14942 / 21600},${h * 17370 / 21600} L ${w * 12180 / 21600},${h * 15935 / 21600} L ${w * 11612 / 21600},${h * 18842 / 21600} L ${w * 9872 / 21600},${h * 17370 / 21600} L ${w * 8700 / 21600},${h * 19712 / 21600} L ${w * 7527 / 21600},${h * 18125 / 21600} L ${w * 4917 / 21600},${h} L ${w * 4805 / 21600},${h * 18240 / 21600} L ${w * 1285 / 21600},${h * 17825 / 21600} L ${w * 3330 / 21600},${h * 15370 / 21600} L 0,${h * 12877 / 21600} L ${w * 3935 / 21600},${h * 11592 / 21600} L ${w * 1172 / 21600},${h * 8270 / 21600} L ${w * 5372 / 21600},${h * 7817 / 21600} L ${w * 4502 / 21600},${h * 3625 / 21600} L ${w * 8550 / 21600},${h * 6382 / 21600} L ${w * 9722 / 21600},${h * 1887 / 21600} z`;
      break;
    case "flowChartTerminator":
      {
        const cd2 = 180, cd4 = 90, c3d4 = 270;
        const x1 = w * 3475 / 21600;
        const x2 = w * 18125 / 21600;
        const y1 = h * 10800 / 21600;
        pathData = `M ${x1},0 L ${x2},0 ${shapeArc2(x2, h / 2, x1, y1, c3d4, c3d4 + cd2, false).replace("M", "L")} L ${x1},${h} ${shapeArc2(x1, h / 2, x1, y1, cd4, cd4 + cd2, false).replace("M", "L")} z`;
      }
      break;
    case "flowChartPunchedTape":
      {
        const cd2 = 180;
        const x1 = w * 5 / 20;
        const y1 = h * 2 / 20;
        const y2 = h * 18 / 20;
        pathData = `M 0,${y1} ${shapeArc2(x1, y1, x1, y1, cd2, 0, false).replace("M", "L")} ${shapeArc2(w * (3 / 4), y1, x1, y1, cd2, 360, false).replace("M", "L")} L ${w},${y2} ${shapeArc2(w * (3 / 4), y2, x1, y1, 0, -cd2, false).replace("M", "L")} ${shapeArc2(x1, y2, x1, y1, 0, cd2, false).replace("M", "L")} z`;
      }
      break;
    case "flowChartOnlineStorage":
      {
        const c3d4 = 270, cd4 = 90;
        const x1 = w * 1 / 6;
        const y1 = h * 3 / 6;
        pathData = `M ${x1},0 L ${w},0 ${shapeArc2(w, h / 2, x1, y1, c3d4, 90, false).replace("M", "L")} L ${x1},${h} ${shapeArc2(x1, h / 2, x1, y1, cd4, 270, false).replace("M", "L")} z`;
      }
      break;
    case "flowChartDisplay":
      {
        const c3d4 = 270, cd2 = 180;
        const x1 = w * 1 / 6;
        const x2 = w * 5 / 6;
        const y1 = h * 3 / 6;
        pathData = `M 0,${y1} L ${x1},0 L ${x2},0 ${shapeArc2(w, h / 2, x1, y1, c3d4, c3d4 + cd2, false).replace("M", "L")} L ${x1},${h} z`;
      }
      break;
    case "flowChartDelay":
      {
        const wd2 = w / 2, hd2 = h / 2, cd2 = 180, c3d4 = 270;
        pathData = `M 0,0 L ${wd2},0 ${shapeArc2(wd2, hd2, wd2, hd2, c3d4, c3d4 + cd2, false).replace("M", "L")} L 0,${h} z`;
      }
      break;
    case "flowChartMagneticTape":
      {
        const wd2 = w / 2, hd2 = h / 2, cd2 = 180, c3d4 = 270, cd4 = 90;
        const idy = hd2 * Math.sin(Math.PI / 4);
        const ib = hd2 + idy;
        const ang1 = Math.atan(h / w);
        const ang1Dg = ang1 * 180 / Math.PI;
        pathData = `M ${wd2},${h} ${shapeArc2(wd2, hd2, wd2, hd2, cd4, cd2, false).replace("M", "L")} ${shapeArc2(wd2, hd2, wd2, hd2, cd2, c3d4, false).replace("M", "L")} ${shapeArc2(wd2, hd2, wd2, hd2, c3d4, 360, false).replace("M", "L")} ${shapeArc2(wd2, hd2, wd2, hd2, 0, ang1Dg, false).replace("M", "L")} L ${w},${ib} L ${w},${h} z`;
      }
      break;
    case "ellipse":
    case "flowChartConnector":
    case "flowChartSummingJunction":
    case "flowChartOr":
      {
        const cx = w / 2;
        const cy = h / 2;
        const rx = w / 2;
        const ry = h / 2;
        pathData = `M ${cx - rx},${cy} A ${rx},${ry} 0 1,0 ${cx + rx},${cy} A ${rx},${ry} 0 1,0 ${cx - rx},${cy} Z`;
        if (shapType === "flowChartOr") {
          pathData += ` M ${w / 2} 0 L ${w / 2} ${h} M 0 ${h / 2} L ${w} ${h / 2}`;
        } else if (shapType === "flowChartSummingJunction") {
          const angVal = Math.PI / 4;
          const iDx = w / 2 * Math.cos(angVal);
          const idy = h / 2 * Math.sin(angVal);
          const il = cx - iDx;
          const ir = cx + iDx;
          const it = cy - idy;
          const ib = cy + idy;
          pathData += ` M ${il} ${it} L ${ir} ${ib} M ${ir} ${it} L ${il} ${ib}`;
        }
      }
      break;
    case "roundRect":
    case "round1Rect":
    case "round2DiagRect":
    case "round2SameRect":
    case "snip1Rect":
    case "snip2DiagRect":
    case "snip2SameRect":
    case "flowChartAlternateProcess":
    case "flowChartPunchedCard":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let sAdj1_val, sAdj2_val;
        let shpTyp, adjTyp;
        if (shapAdjst_ary && Array.isArray(shapAdjst_ary)) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              const sAdj1 = getTextByPathList(adj, ["attrs", "fmla"]);
              sAdj1_val = parseInt(sAdj1.substring(4)) / 5e4;
            } else if (sAdj_name === "adj2") {
              const sAdj2 = getTextByPathList(adj, ["attrs", "fmla"]);
              sAdj2_val = parseInt(sAdj2.substring(4)) / 5e4;
            }
          }
        } else if (shapAdjst_ary) {
          const sAdj = getTextByPathList(shapAdjst_ary, ["attrs", "fmla"]);
          sAdj1_val = parseInt(sAdj.substring(4)) / 5e4;
          sAdj2_val = 0;
        }
        switch (shapType) {
          case "roundRect":
          case "flowChartAlternateProcess":
            shpTyp = "round";
            adjTyp = "cornrAll";
            if (sAdj1_val === void 0) sAdj1_val = 0.33334;
            sAdj2_val = 0;
            break;
          case "round1Rect":
            shpTyp = "round";
            adjTyp = "cornr1";
            if (sAdj1_val === void 0) sAdj1_val = 0.33334;
            sAdj2_val = 0;
            break;
          case "round2DiagRect":
            shpTyp = "round";
            adjTyp = "diag";
            if (sAdj1_val === void 0) sAdj1_val = 0.33334;
            if (sAdj2_val === void 0) sAdj2_val = 0;
            break;
          case "round2SameRect":
            shpTyp = "round";
            adjTyp = "cornr2";
            if (sAdj1_val === void 0) sAdj1_val = 0.33334;
            if (sAdj2_val === void 0) sAdj2_val = 0;
            break;
          case "snip1Rect":
            shpTyp = "snip";
            adjTyp = "cornr1";
            if (sAdj1_val === void 0) sAdj1_val = 0.33334;
            sAdj2_val = 0;
            break;
          case "flowChartPunchedCard":
            shpTyp = "snip";
            adjTyp = "cornrTL";
            if (sAdj1_val === void 0) sAdj1_val = 0.33334;
            sAdj2_val = 0;
            break;
          case "snip2DiagRect":
            shpTyp = "snip";
            adjTyp = "diag";
            if (sAdj1_val === void 0) sAdj1_val = 0;
            if (sAdj2_val === void 0) sAdj2_val = 0.33334;
            break;
          case "snip2SameRect":
            shpTyp = "snip";
            adjTyp = "cornr2";
            if (sAdj1_val === void 0) sAdj1_val = 0.33334;
            if (sAdj2_val === void 0) sAdj2_val = 0;
            break;
          default:
        }
        pathData = shapeSnipRoundRect(w, h, sAdj1_val, sAdj2_val, shpTyp, adjTyp);
      }
      break;
    case "snipRoundRect":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let sAdj1_val = 0.33334;
        let sAdj2_val = 0.33334;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              const sAdj1 = getTextByPathList(adj, ["attrs", "fmla"]);
              sAdj1_val = parseInt(sAdj1.substring(4)) / 5e4;
            } else if (sAdj_name === "adj2") {
              const sAdj2 = getTextByPathList(adj, ["attrs", "fmla"]);
              sAdj2_val = parseInt(sAdj2.substring(4)) / 5e4;
            }
          }
        }
        pathData = `M0,${h} L${w},${h} L${w},${h / 2 * sAdj2_val} L${w / 2 + w / 2 * (1 - sAdj2_val)},0 L${w / 2 * sAdj1_val},0 Q0,0 0,${h / 2 * sAdj1_val} z`;
      }
      break;
    case "bentConnector2":
      pathData = `M ${w} 0 L ${w} ${h} L 0 ${h}`;
      break;
    case "rtTriangle":
      pathData = `M 0 0 L 0 ${h} L ${w} ${h} Z`;
      break;
    case "triangle":
    case "flowChartExtract":
    case "flowChartMerge":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let shapAdjst_val = 0.5;
        if (shapAdjst) {
          shapAdjst_val = parseInt(shapAdjst.substring(4)) * RATIO_EMUs_Points;
        }
        let p1x = w * shapAdjst_val;
        let p1y = 0;
        let p2x = 0;
        let p2y = h;
        let p3x = w;
        let p3y = h;
        if (shapType === "flowChartMerge") {
          [p1x, p1y] = [w - p1x, h - p1y];
          [p2x, p2y] = [w - p2x, h - p2y];
          [p3x, p3y] = [w - p3x, h - p3y];
        }
        pathData = `M ${p1x} ${p1y} L ${p2x} ${p2y} L ${p3x} ${p3y} Z`;
      }
      break;
    case "diamond":
    case "flowChartDecision":
    case "flowChartSort":
      pathData = `M ${w / 2} 0 L 0 ${h / 2} L ${w / 2} ${h} L ${w} ${h / 2} Z`;
      if (shapType === "flowChartSort") {
        pathData += ` M 0 ${h / 2} L ${w} ${h / 2}`;
      }
      break;
    case "trapezoid":
    case "flowChartManualOperation":
    case "flowChartManualInput":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let adjst_val = 0.2;
        const max_adj_const = 0.7407;
        if (shapAdjst) {
          const adjst = parseInt(shapAdjst.substring(4)) * RATIO_EMUs_Points;
          adjst_val = adjst * 0.5 / max_adj_const;
        }
        let p1x = w * adjst_val, p1y = 0;
        let p2x = 0, p2y = h;
        let p3x = w, p3y = h;
        let p4x = (1 - adjst_val) * w, p4y = 0;
        if (shapType === "flowChartManualInput") {
          adjst_val = 0;
          p1y = h / 5;
          p1x = w * adjst_val;
          p4x = (1 - adjst_val) * w;
        }
        if (shapType === "flowChartManualOperation") {
          [p1x, p1y] = [w - p1x, h - p1y];
          [p2x, p2y] = [w - p2x, h - p2y];
          [p3x, p3y] = [w - p3x, h - p3y];
          [p4x, p4y] = [w - p4x, h - p4y];
        }
        pathData = `M ${p1x} ${p1y} L ${p2x} ${p2y} L ${p3x} ${p3y} L ${p4x} ${p4y} Z`;
      }
      break;
    case "parallelogram":
    case "flowChartInputOutput":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let adjst_val = 0.25;
        if (shapAdjst) {
          const max_adj_const = w > h ? w / h : h / w;
          const adjst = parseInt(shapAdjst.substring(4)) / 1e5;
          adjst_val = adjst / max_adj_const;
        }
        pathData = `M ${adjst_val * w} 0 L 0 ${h} L ${(1 - adjst_val) * w} ${h} L ${w} 0 Z`;
      }
      break;
    case "pentagon":
      pathData = `M ${0.5 * w} 0 L 0 ${0.375 * h} L ${0.15 * w} ${h} L ${0.85 * w} ${h} L ${w} ${0.375 * h} Z`;
      break;
    case "hexagon":
    case "flowChartPreparation":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let adj = 25e3 * RATIO_EMUs_Points;
        if (shapAdjst) {
          adj = parseInt(shapAdjst.substring(4)) * RATIO_EMUs_Points;
        }
        const vf = 115470 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        const angVal1 = 60 * Math.PI / 180;
        const ss = Math.min(w, h);
        const maxAdj = cnstVal1 * w / ss;
        const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
        const hd2 = h / 2;
        const shd2 = hd2 * vf / cnstVal2;
        const x1 = ss * a / cnstVal2;
        const x2 = w - x1;
        const dy1 = shd2 * Math.sin(angVal1);
        const vc = h / 2;
        const y1 = vc - dy1;
        const y2 = vc + dy1;
        pathData = `M 0,${vc} L ${x1},${y1} L ${x2},${y1} L ${w},${vc} L ${x2},${y2} L ${x1},${y2} z`;
      }
      break;
    case "heptagon":
      pathData = `M ${0.5 * w} 0 L ${w / 8} ${h / 4} L 0 ${5 / 8 * h} L ${w / 4} ${h} L ${3 / 4 * w} ${h} L ${w} ${5 / 8 * h} L ${7 / 8 * w} ${h / 4} Z`;
      break;
    case "octagon":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let adj1 = 0.25;
        if (shapAdjst) {
          adj1 = parseInt(shapAdjst.substring(4)) / 1e5;
        }
        const adj2 = 1 - adj1;
        pathData = `M ${adj1 * w} 0 L 0 ${adj1 * h} L 0 ${adj2 * h} L ${adj1 * w} ${h} L ${adj2 * w} ${h} L ${w} ${adj2 * h} L ${w} ${adj1 * h} L ${adj2 * w} 0 Z`;
      }
      break;
    case "decagon":
      pathData = `M ${3 / 8 * w} 0 L ${w / 8} ${h / 8} L 0 ${h / 2} L ${w / 8} ${7 / 8 * h} L ${3 / 8 * w} ${h} L ${5 / 8 * w} ${h} L ${7 / 8 * w} ${7 / 8 * h} L ${w} ${h / 2} L ${7 / 8 * w} ${h / 8} L ${5 / 8 * w} 0 Z`;
      break;
    case "dodecagon":
      pathData = `M ${3 / 8 * w} 0 L ${w / 8} ${h / 8} L 0 ${3 / 8 * h} L 0 ${5 / 8 * h} L ${w / 8} ${7 / 8 * h} L ${3 / 8 * w} ${h} L ${5 / 8 * w} ${h} L ${7 / 8 * w} ${7 / 8 * h} L ${w} ${5 / 8 * h} L ${w} ${3 / 8 * h} L ${7 / 8 * w} ${h / 8} L ${5 / 8 * w} 0 Z`;
      break;
    case "star4":
      {
        const hc = w / 2, vc = h / 2, wd2 = w / 2, hd2 = h / 2;
        let adj = 19098 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        if (shapAdjst) {
          const name = shapAdjst["attrs"]["name"];
          if (name === "adj") {
            adj = parseInt(shapAdjst["attrs"]["fmla"].substring(4)) * RATIO_EMUs_Points;
          }
        }
        const a = adj < 0 ? 0 : adj > cnstVal1 ? cnstVal1 : adj;
        const iwd2 = wd2 * a / cnstVal1;
        const ihd2 = hd2 * a / cnstVal1;
        const sdx = iwd2 * Math.cos(0.7853981634);
        const sdy = ihd2 * Math.sin(0.7853981634);
        const sx1 = hc - sdx;
        const sx2 = hc + sdx;
        const sy1 = vc - sdy;
        const sy2 = vc + sdy;
        pathData = `M 0,${vc} L ${sx1},${sy1} L ${hc},0 L ${sx2},${sy1} L ${w},${vc} L ${sx2},${sy2} L ${hc},${h} L ${sx1},${sy2} z`;
      }
      break;
    case "star5":
      {
        const hc = w / 2, vc = h / 2, wd2 = w / 2, hd2 = h / 2;
        let adj = 19098 * RATIO_EMUs_Points;
        let hf = 105146 * RATIO_EMUs_Points;
        let vf = 110557 * RATIO_EMUs_Points;
        const maxAdj = 5e4 * RATIO_EMUs_Points;
        const cnstVal1 = 1e5 * RATIO_EMUs_Points;
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        if (shapAdjst) {
          Object.keys(shapAdjst).forEach((key) => {
            const name = shapAdjst[key]["attrs"]["name"];
            if (name === "adj") {
              adj = parseInt(shapAdjst[key]["attrs"]["fmla"].substring(4)) * RATIO_EMUs_Points;
            } else if (name === "hf") {
              hf = parseInt(shapAdjst[key]["attrs"]["fmla"].substring(4)) * RATIO_EMUs_Points;
            } else if (name === "vf") {
              vf = parseInt(shapAdjst[key]["attrs"]["fmla"].substring(4)) * RATIO_EMUs_Points;
            }
          });
        }
        const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
        const swd2 = wd2 * hf / cnstVal1;
        const shd2 = hd2 * vf / cnstVal1;
        const svc = vc * vf / cnstVal1;
        const dx1 = swd2 * Math.cos(0.31415926536);
        const dx2 = swd2 * Math.cos(5.3407075111);
        const dy1 = shd2 * Math.sin(0.31415926536);
        const dy2 = shd2 * Math.sin(5.3407075111);
        const x1 = hc - dx1;
        const x2 = hc - dx2;
        const x3 = hc + dx2;
        const x4 = hc + dx1;
        const y1 = svc - dy1;
        const y2 = svc - dy2;
        const iwd2 = swd2 * a / maxAdj;
        const ihd2 = shd2 * a / maxAdj;
        const sdx1 = iwd2 * Math.cos(5.9690260418);
        const sdx2 = iwd2 * Math.cos(0.94247779608);
        const sdy1 = ihd2 * Math.sin(0.94247779608);
        const sdy2 = ihd2 * Math.sin(5.9690260418);
        const sx1 = hc - sdx1;
        const sx2 = hc - sdx2;
        const sx3 = hc + sdx2;
        const sx4 = hc + sdx1;
        const sy1 = svc - sdy1;
        const sy2 = svc - sdy2;
        const sy3 = svc + ihd2;
        pathData = `M ${x1},${y1} L ${sx2},${sy1} L ${hc},0 L ${sx3},${sy1} L ${x4},${y1} L ${sx4},${sy2} L ${x3},${y2} L ${hc},${sy3} L ${x2},${y2} L ${sx1},${sy2} z`;
      }
      break;
    case "star6":
      {
        const hc = w / 2, vc = h / 2, wd2 = w / 2, hd2 = h / 2, hd4 = h / 4;
        let adj = 28868 * RATIO_EMUs_Points;
        let hf = 115470 * RATIO_EMUs_Points;
        const maxAdj = 5e4 * RATIO_EMUs_Points;
        const cnstVal1 = 1e5 * RATIO_EMUs_Points;
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        if (shapAdjst) {
          Object.keys(shapAdjst).forEach((key) => {
            const name = shapAdjst[key]["attrs"]["name"];
            if (name === "adj") {
              adj = parseInt(shapAdjst[key]["attrs"]["fmla"].substring(4)) * RATIO_EMUs_Points;
            } else if (name === "hf") {
              hf = parseInt(shapAdjst[key]["attrs"]["fmla"].substring(4)) * RATIO_EMUs_Points;
            }
          });
        }
        const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
        const swd2 = wd2 * hf / cnstVal1;
        const dx1 = swd2 * Math.cos(0.5235987756);
        const x1 = hc - dx1;
        const x2 = hc + dx1;
        const y2 = vc + hd4;
        const iwd2 = swd2 * a / maxAdj;
        const ihd2 = hd2 * a / maxAdj;
        const sdx2 = iwd2 / 2;
        const sx1 = hc - iwd2;
        const sx2 = hc - sdx2;
        const sx3 = hc + sdx2;
        const sx4 = hc + iwd2;
        const sdy1 = ihd2 * Math.sin(1.0471975512);
        const sy1 = vc - sdy1;
        const sy2 = vc + sdy1;
        pathData = `M ${x1},${hd4} L ${sx2},${sy1} L ${hc},0 L ${sx3},${sy1} L ${x2},${hd4} L ${sx4},${vc} L ${x2},${y2} L ${sx3},${sy2} L ${hc},${h} L ${sx2},${sy2} L ${x1},${y2} L ${sx1},${vc} z`;
      }
      break;
    case "star7":
      {
        const hc = w / 2, vc = h / 2, wd2 = w / 2, hd2 = h / 2;
        let adj = 34601 * RATIO_EMUs_Points;
        let hf = 102572 * RATIO_EMUs_Points;
        let vf = 105210 * RATIO_EMUs_Points;
        const maxAdj = 5e4 * RATIO_EMUs_Points;
        const cnstVal1 = 1e5 * RATIO_EMUs_Points;
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        if (shapAdjst) {
          Object.keys(shapAdjst).forEach((key) => {
            const name = shapAdjst[key]["attrs"]["name"];
            if (name === "adj") {
              adj = parseInt(shapAdjst[key]["attrs"]["fmla"].substring(4)) * RATIO_EMUs_Points;
            } else if (name === "hf") {
              hf = parseInt(shapAdjst[key]["attrs"]["fmla"].substring(4)) * RATIO_EMUs_Points;
            } else if (name === "vf") {
              vf = parseInt(shapAdjst[key]["attrs"]["fmla"].substring(4)) * RATIO_EMUs_Points;
            }
          });
        }
        const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
        const swd2 = wd2 * hf / cnstVal1;
        const shd2 = hd2 * vf / cnstVal1;
        const svc = vc * vf / cnstVal1;
        const dx1 = swd2 * 97493 / 1e5;
        const dx2 = swd2 * 78183 / 1e5;
        const dx3 = swd2 * 43388 / 1e5;
        const dy1 = shd2 * 62349 / 1e5;
        const dy2 = shd2 * 22252 / 1e5;
        const dy3 = shd2 * 90097 / 1e5;
        const x1 = hc - dx1;
        const x2 = hc - dx2;
        const x3 = hc - dx3;
        const x4 = hc + dx3;
        const x5 = hc + dx2;
        const x6 = hc + dx1;
        const y1 = svc - dy1;
        const y2 = svc + dy2;
        const y3 = svc + dy3;
        const iwd2 = swd2 * a / maxAdj;
        const ihd2 = shd2 * a / maxAdj;
        const sdx1 = iwd2 * 97493 / 1e5;
        const sdx2 = iwd2 * 78183 / 1e5;
        const sdx3 = iwd2 * 43388 / 1e5;
        const sx1 = hc - sdx1;
        const sx2 = hc - sdx2;
        const sx3 = hc - sdx3;
        const sx4 = hc + sdx3;
        const sx5 = hc + sdx2;
        const sx6 = hc + sdx1;
        const sdy1 = ihd2 * 90097 / 1e5;
        const sdy2 = ihd2 * 22252 / 1e5;
        const sdy3 = ihd2 * 62349 / 1e5;
        const sy1 = svc - sdy1;
        const sy2 = svc - sdy2;
        const sy3 = svc + sdy3;
        const sy4 = svc + ihd2;
        pathData = `M ${x1},${y2} L ${sx1},${sy2} L ${x2},${y1} L ${sx3},${sy1} L ${hc},0 L ${sx4},${sy1} L ${x5},${y1} L ${sx6},${sy2} L ${x6},${y2} L ${sx5},${sy3} L ${x4},${y3} L ${hc},${sy4} L ${x3},${y3} L ${sx2},${sy3} z`;
      }
      break;
    case "star8":
      {
        const hc = w / 2, vc = h / 2, wd2 = w / 2, hd2 = h / 2;
        let adj = 37500 * RATIO_EMUs_Points;
        const maxAdj = 5e4 * RATIO_EMUs_Points;
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        if (shapAdjst) {
          const name = shapAdjst["attrs"]["name"];
          if (name === "adj") {
            adj = parseInt(shapAdjst["attrs"]["fmla"].substring(4)) * RATIO_EMUs_Points;
          }
        }
        const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
        const dx1 = wd2 * Math.cos(0.7853981634);
        const x1 = hc - dx1;
        const x2 = hc + dx1;
        const dy1 = hd2 * Math.sin(0.7853981634);
        const y1 = vc - dy1;
        const y2 = vc + dy1;
        const iwd2 = wd2 * a / maxAdj;
        const ihd2 = hd2 * a / maxAdj;
        const sdx1 = iwd2 * 92388 / 1e5;
        const sdx2 = iwd2 * 38268 / 1e5;
        const sdy1 = ihd2 * 92388 / 1e5;
        const sdy2 = ihd2 * 38268 / 1e5;
        const sx1 = hc - sdx1;
        const sx2 = hc - sdx2;
        const sx3 = hc + sdx2;
        const sx4 = hc + sdx1;
        const sy1 = vc - sdy1;
        const sy2 = vc - sdy2;
        const sy3 = vc + sdy2;
        const sy4 = vc + sdy1;
        pathData = `M 0,${vc} L ${sx1},${sy2} L ${x1},${y1} L ${sx2},${sy1} L ${hc},0 L ${sx3},${sy1} L ${x2},${y1} L ${sx4},${sy2} L ${w},${vc} L ${sx4},${sy3} L ${x2},${y2} L ${sx3},${sy4} L ${hc},${h} L ${sx2},${sy4} L ${x1},${y2} L ${sx1},${sy3} z`;
      }
      break;
    case "star10":
      {
        const hc = w / 2, vc = h / 2, wd2 = w / 2, hd2 = h / 2;
        let adj = 42533 * RATIO_EMUs_Points;
        let hf = 105146 * RATIO_EMUs_Points;
        const maxAdj = 5e4 * RATIO_EMUs_Points;
        const cnstVal1 = 1e5 * RATIO_EMUs_Points;
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        if (shapAdjst) {
          Object.keys(shapAdjst).forEach((key) => {
            const name = shapAdjst[key]["attrs"]["name"];
            if (name === "adj") {
              adj = parseInt(shapAdjst[key]["attrs"]["fmla"].substring(4)) * RATIO_EMUs_Points;
            } else if (name === "hf") {
              hf = parseInt(shapAdjst[key]["attrs"]["fmla"].substring(4)) * RATIO_EMUs_Points;
            }
          });
        }
        const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
        const swd2 = wd2 * hf / cnstVal1;
        const dx1 = swd2 * 95106 / 1e5;
        const dx2 = swd2 * 58779 / 1e5;
        const x1 = hc - dx1;
        const x2 = hc - dx2;
        const x3 = hc + dx2;
        const x4 = hc + dx1;
        const dy1 = hd2 * 80902 / 1e5;
        const dy2 = hd2 * 30902 / 1e5;
        const y1 = vc - dy1;
        const y2 = vc - dy2;
        const y3 = vc + dy2;
        const y4 = vc + dy1;
        const iwd2 = swd2 * a / maxAdj;
        const ihd2 = hd2 * a / maxAdj;
        const sdx1 = iwd2 * 80902 / 1e5;
        const sdx2 = iwd2 * 30902 / 1e5;
        const sdy1 = ihd2 * 95106 / 1e5;
        const sdy2 = ihd2 * 58779 / 1e5;
        const sx1 = hc - iwd2;
        const sx2 = hc - sdx1;
        const sx3 = hc - sdx2;
        const sx4 = hc + sdx2;
        const sx5 = hc + sdx1;
        const sx6 = hc + iwd2;
        const sy1 = vc - sdy1;
        const sy2 = vc - sdy2;
        const sy3 = vc + sdy2;
        const sy4 = vc + sdy1;
        pathData = `M ${x1},${y2} L ${sx2},${sy2} L ${x2},${y1} L ${sx3},${sy1} L ${hc},0 L ${sx4},${sy1} L ${x3},${y1} L ${sx5},${sy2} L ${x4},${y2} L ${sx6},${vc} L ${x4},${y3} L ${sx5},${sy3} L ${x3},${y4} L ${sx4},${sy4} L ${hc},${h} L ${sx3},${sy4} L ${x2},${y4} L ${sx2},${sy3} L ${x1},${y3} L ${sx1},${vc} z`;
      }
      break;
    case "star12":
      {
        const hc = w / 2, vc = h / 2, wd2 = w / 2, hd2 = h / 2, hd4 = h / 4, wd4 = w / 4;
        let adj = 37500 * RATIO_EMUs_Points;
        const maxAdj = 5e4 * RATIO_EMUs_Points;
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        if (shapAdjst) {
          const name = shapAdjst["attrs"]["name"];
          if (name === "adj") {
            adj = parseInt(shapAdjst["attrs"]["fmla"].substring(4)) * RATIO_EMUs_Points;
          }
        }
        const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
        const dx1 = wd2 * Math.cos(0.5235987756);
        const dy1 = hd2 * Math.sin(1.0471975512);
        const x1 = hc - dx1;
        const x3 = w * 3 / 4;
        const x4 = hc + dx1;
        const y1 = vc - dy1;
        const y3 = h * 3 / 4;
        const y4 = vc + dy1;
        const iwd2 = wd2 * a / maxAdj;
        const ihd2 = hd2 * a / maxAdj;
        const sdx1 = iwd2 * Math.cos(0.2617993878);
        const sdx2 = iwd2 * Math.cos(0.7853981634);
        const sdx3 = iwd2 * Math.cos(1.308996939);
        const sdy1 = ihd2 * Math.sin(1.308996939);
        const sdy2 = ihd2 * Math.sin(0.7853981634);
        const sdy3 = ihd2 * Math.sin(0.2617993878);
        const sx1 = hc - sdx1;
        const sx2 = hc - sdx2;
        const sx3 = hc - sdx3;
        const sx4 = hc + sdx3;
        const sx5 = hc + sdx2;
        const sx6 = hc + sdx1;
        const sy1 = vc - sdy1;
        const sy2 = vc - sdy2;
        const sy3 = vc - sdy3;
        const sy4 = vc + sdy3;
        const sy5 = vc + sdy2;
        const sy6 = vc + sdy1;
        pathData = `M 0,${vc} L ${sx1},${sy3} L ${x1},${hd4} L ${sx2},${sy2} L ${wd4},${y1} L ${sx3},${sy1} L ${hc},0 L ${sx4},${sy1} L ${x3},${y1} L ${sx5},${sy2} L ${x4},${hd4} L ${sx6},${sy3} L ${w},${vc} L ${sx6},${sy4} L ${x4},${y3} L ${sx5},${sy5} L ${x3},${y4} L ${sx4},${sy6} L ${hc},${h} L ${sx3},${sy6} L ${wd4},${y4} L ${sx2},${sy5} L ${x1},${y3} L ${sx1},${sy4} z`;
      }
      break;
    case "star16":
      {
        const hc = w / 2, vc = h / 2, wd2 = w / 2, hd2 = h / 2;
        let adj = 37500 * RATIO_EMUs_Points;
        const maxAdj = 5e4 * RATIO_EMUs_Points;
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        if (shapAdjst) {
          const name = shapAdjst["attrs"]["name"];
          if (name === "adj") {
            adj = parseInt(shapAdjst["attrs"]["fmla"].substring(4)) * RATIO_EMUs_Points;
          }
        }
        const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
        const dx1 = wd2 * 92388 / 1e5;
        const dx2 = wd2 * 70711 / 1e5;
        const dx3 = wd2 * 38268 / 1e5;
        const dy1 = hd2 * 92388 / 1e5;
        const dy2 = hd2 * 70711 / 1e5;
        const dy3 = hd2 * 38268 / 1e5;
        const x1 = hc - dx1;
        const x2 = hc - dx2;
        const x3 = hc - dx3;
        const x4 = hc + dx3;
        const x5 = hc + dx2;
        const x6 = hc + dx1;
        const y1 = vc - dy1;
        const y2 = vc - dy2;
        const y3 = vc - dy3;
        const y4 = vc + dy3;
        const y5 = vc + dy2;
        const y6 = vc + dy1;
        const iwd2 = wd2 * a / maxAdj;
        const ihd2 = hd2 * a / maxAdj;
        const sdx1 = iwd2 * 98079 / 1e5;
        const sdx2 = iwd2 * 83147 / 1e5;
        const sdx3 = iwd2 * 55557 / 1e5;
        const sdx4 = iwd2 * 19509 / 1e5;
        const sdy1 = ihd2 * 98079 / 1e5;
        const sdy2 = ihd2 * 83147 / 1e5;
        const sdy3 = ihd2 * 55557 / 1e5;
        const sdy4 = ihd2 * 19509 / 1e5;
        const sx1 = hc - sdx1;
        const sx2 = hc - sdx2;
        const sx3 = hc - sdx3;
        const sx4 = hc - sdx4;
        const sx5 = hc + sdx4;
        const sx6 = hc + sdx3;
        const sx7 = hc + sdx2;
        const sx8 = hc + sdx1;
        const sy1 = vc - sdy1;
        const sy2 = vc - sdy2;
        const sy3 = vc - sdy3;
        const sy4 = vc - sdy4;
        const sy5 = vc + sdy4;
        const sy6 = vc + sdy3;
        const sy7 = vc + sdy2;
        const sy8 = vc + sdy1;
        pathData = `M 0,${vc} L ${sx1},${sy4} L ${x1},${y3} L ${sx2},${sy3} L ${x2},${y2} L ${sx3},${sy2} L ${x3},${y1} L ${sx4},${sy1} L ${hc},0 L ${sx5},${sy1} L ${x4},${y1} L ${sx6},${sy2} L ${x5},${y2} L ${sx7},${sy3} L ${x6},${y3} L ${sx8},${sy4} L ${w},${vc} L ${sx8},${sy5} L ${x6},${y4} L ${sx7},${sy6} L ${x5},${y5} L ${sx6},${sy7} L ${x4},${y6} L ${sx5},${sy8} L ${hc},${h} L ${sx4},${sy8} L ${x3},${y6} L ${sx3},${sy7} L ${x2},${y5} L ${sx2},${sy6} L ${x1},${y4} L ${sx1},${sy5} z`;
      }
      break;
    case "star24":
      {
        const hc = w / 2, vc = h / 2, wd2 = w / 2, hd2 = h / 2, hd4 = h / 4, wd4 = w / 4;
        let adj = 37500 * RATIO_EMUs_Points;
        const maxAdj = 5e4 * RATIO_EMUs_Points;
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        if (shapAdjst) {
          const name = shapAdjst["attrs"]["name"];
          if (name === "adj") {
            adj = parseInt(shapAdjst["attrs"]["fmla"].substring(4)) * RATIO_EMUs_Points;
          }
        }
        const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
        const dx1 = wd2 * Math.cos(0.2617993878);
        const dx2 = wd2 * Math.cos(0.5235987756);
        const dx3 = wd2 * Math.cos(0.7853981634);
        const dx4 = wd4;
        const dx5 = wd2 * Math.cos(1.308996939);
        const dy1 = hd2 * Math.sin(1.308996939);
        const dy2 = hd2 * Math.sin(1.0471975512);
        const dy3 = hd2 * Math.sin(0.7853981634);
        const dy4 = hd4;
        const dy5 = hd2 * Math.sin(0.2617993878);
        const x1 = hc - dx1;
        const x2 = hc - dx2;
        const x3 = hc - dx3;
        const x4 = hc - dx4;
        const x5 = hc - dx5;
        const x6 = hc + dx5;
        const x7 = hc + dx4;
        const x8 = hc + dx3;
        const x9 = hc + dx2;
        const x10 = hc + dx1;
        const y1 = vc - dy1;
        const y2 = vc - dy2;
        const y3 = vc - dy3;
        const y4 = vc - dy4;
        const y5 = vc - dy5;
        const y6 = vc + dy5;
        const y7 = vc + dy4;
        const y8 = vc + dy3;
        const y9 = vc + dy2;
        const y10 = vc + dy1;
        const iwd2 = wd2 * a / maxAdj;
        const ihd2 = hd2 * a / maxAdj;
        const sdx1 = iwd2 * 99144 / 1e5;
        const sdx2 = iwd2 * 92388 / 1e5;
        const sdx3 = iwd2 * 79335 / 1e5;
        const sdx4 = iwd2 * 60876 / 1e5;
        const sdx5 = iwd2 * 38268 / 1e5;
        const sdx6 = iwd2 * 13053 / 1e5;
        const sdy1 = ihd2 * 99144 / 1e5;
        const sdy2 = ihd2 * 92388 / 1e5;
        const sdy3 = ihd2 * 79335 / 1e5;
        const sdy4 = ihd2 * 60876 / 1e5;
        const sdy5 = ihd2 * 38268 / 1e5;
        const sdy6 = ihd2 * 13053 / 1e5;
        const sx1 = hc - sdx1;
        const sx2 = hc - sdx2;
        const sx3 = hc - sdx3;
        const sx4 = hc - sdx4;
        const sx5 = hc - sdx5;
        const sx6 = hc - sdx6;
        const sx7 = hc + sdx6;
        const sx8 = hc + sdx5;
        const sx9 = hc + sdx4;
        const sx10 = hc + sdx3;
        const sx11 = hc + sdx2;
        const sx12 = hc + sdx1;
        const sy1 = vc - sdy1;
        const sy2 = vc - sdy2;
        const sy3 = vc - sdy3;
        const sy4 = vc - sdy4;
        const sy5 = vc - sdy5;
        const sy6 = vc - sdy6;
        const sy7 = vc + sdy6;
        const sy8 = vc + sdy5;
        const sy9 = vc + sdy4;
        const sy10 = vc + sdy3;
        const sy11 = vc + sdy2;
        const sy12 = vc + sdy1;
        pathData = `M 0,${vc} L ${sx1},${sy6} L ${x1},${y5} L ${sx2},${sy5} L ${x2},${y4} L ${sx3},${sy4} L ${x3},${y3} L ${sx4},${sy3} L ${x4},${y2} L ${sx5},${sy2} L ${x5},${y1} L ${sx6},${sy1} L ${hc},0 L ${sx7},${sy1} L ${x6},${y1} L ${sx8},${sy2} L ${x7},${y2} L ${sx9},${sy3} L ${x8},${y3} L ${sx10},${sy4} L ${x9},${y4} L ${sx11},${sy5} L ${x10},${y5} L ${sx12},${sy6} L ${w},${vc} L ${sx12},${sy7} L ${x10},${y6} L ${sx11},${sy8} L ${x9},${y7} L ${sx10},${sy9} L ${x8},${y8} L ${sx9},${sy10} L ${x7},${y9} L ${sx8},${sy11} L ${x6},${y10} L ${sx7},${sy12} L ${hc},${h} L ${sx6},${sy12} L ${x5},${y10} L ${sx5},${sy11} L ${x4},${y9} L ${sx4},${sy10} L ${x3},${y8} L ${sx3},${sy9} L ${x2},${y7} L ${sx2},${sy8} L ${x1},${y6} L ${sx1},${sy7} z`;
      }
      break;
    case "star32":
      {
        const hc = w / 2, vc = h / 2, wd2 = w / 2, hd2 = h / 2;
        let adj = 37500 * RATIO_EMUs_Points;
        const maxAdj = 5e4 * RATIO_EMUs_Points;
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        if (shapAdjst) {
          const name = shapAdjst["attrs"]["name"];
          if (name === "adj") {
            adj = parseInt(shapAdjst["attrs"]["fmla"].substring(4)) * RATIO_EMUs_Points;
          }
        }
        const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
        const dx1 = wd2 * 98079 / 1e5;
        const dx2 = wd2 * 92388 / 1e5;
        const dx3 = wd2 * 83147 / 1e5;
        const dx4 = wd2 * Math.cos(0.7853981634);
        const dx5 = wd2 * 55557 / 1e5;
        const dx6 = wd2 * 38268 / 1e5;
        const dx7 = wd2 * 19509 / 1e5;
        const dy1 = hd2 * 98079 / 1e5;
        const dy2 = hd2 * 92388 / 1e5;
        const dy3 = hd2 * 83147 / 1e5;
        const dy4 = hd2 * Math.sin(0.7853981634);
        const dy5 = hd2 * 55557 / 1e5;
        const dy6 = hd2 * 38268 / 1e5;
        const dy7 = hd2 * 19509 / 1e5;
        const x1 = hc - dx1;
        const x2 = hc - dx2;
        const x3 = hc - dx3;
        const x4 = hc - dx4;
        const x5 = hc - dx5;
        const x6 = hc - dx6;
        const x7 = hc - dx7;
        const x8 = hc + dx7;
        const x9 = hc + dx6;
        const x10 = hc + dx5;
        const x11 = hc + dx4;
        const x12 = hc + dx3;
        const x13 = hc + dx2;
        const x14 = hc + dx1;
        const y1 = vc - dy1;
        const y2 = vc - dy2;
        const y3 = vc - dy3;
        const y4 = vc - dy4;
        const y5 = vc - dy5;
        const y6 = vc - dy6;
        const y7 = vc - dy7;
        const y8 = vc + dy7;
        const y9 = vc + dy6;
        const y10 = vc + dy5;
        const y11 = vc + dy4;
        const y12 = vc + dy3;
        const y13 = vc + dy2;
        const y14 = vc + dy1;
        const iwd2 = wd2 * a / maxAdj;
        const ihd2 = hd2 * a / maxAdj;
        const sdx1 = iwd2 * 99518 / 1e5;
        const sdx2 = iwd2 * 95694 / 1e5;
        const sdx3 = iwd2 * 88192 / 1e5;
        const sdx4 = iwd2 * 77301 / 1e5;
        const sdx5 = iwd2 * 63439 / 1e5;
        const sdx6 = iwd2 * 47140 / 1e5;
        const sdx7 = iwd2 * 29028 / 1e5;
        const sdx8 = iwd2 * 9802 / 1e5;
        const sdy1 = ihd2 * 99518 / 1e5;
        const sdy2 = ihd2 * 95694 / 1e5;
        const sdy3 = ihd2 * 88192 / 1e5;
        const sdy4 = ihd2 * 77301 / 1e5;
        const sdy5 = ihd2 * 63439 / 1e5;
        const sdy6 = ihd2 * 47140 / 1e5;
        const sdy7 = ihd2 * 29028 / 1e5;
        const sdy8 = ihd2 * 9802 / 1e5;
        const sx1 = hc - sdx1;
        const sx2 = hc - sdx2;
        const sx3 = hc - sdx3;
        const sx4 = hc - sdx4;
        const sx5 = hc - sdx5;
        const sx6 = hc - sdx6;
        const sx7 = hc - sdx7;
        const sx8 = hc - sdx8;
        const sx9 = hc + sdx8;
        const sx10 = hc + sdx7;
        const sx11 = hc + sdx6;
        const sx12 = hc + sdx5;
        const sx13 = hc + sdx4;
        const sx14 = hc + sdx3;
        const sx15 = hc + sdx2;
        const sx16 = hc + sdx1;
        const sy1 = vc - sdy1;
        const sy2 = vc - sdy2;
        const sy3 = vc - sdy3;
        const sy4 = vc - sdy4;
        const sy5 = vc - sdy5;
        const sy6 = vc - sdy6;
        const sy7 = vc - sdy7;
        const sy8 = vc - sdy8;
        const sy9 = vc + sdy8;
        const sy10 = vc + sdy7;
        const sy11 = vc + sdy6;
        const sy12 = vc + sdy5;
        const sy13 = vc + sdy4;
        const sy14 = vc + sdy3;
        const sy15 = vc + sdy2;
        const sy16 = vc + sdy1;
        pathData = `M 0,${vc} L ${sx1},${sy8} L ${x1},${y7} L ${sx2},${sy7} L ${x2},${y6} L ${sx3},${sy6} L ${x3},${y5} L ${sx4},${sy5} L ${x4},${y4} L ${sx5},${sy4} L ${x5},${y3} L ${sx6},${sy3} L ${x6},${y2} L ${sx7},${sy2} L ${x7},${y1} L ${sx8},${sy1} L ${hc},0 L ${sx9},${sy1} L ${x8},${y1} L ${sx10},${sy2} L ${x9},${y2} L ${sx11},${sy3} L ${x10},${y3} L ${sx12},${sy4} L ${x11},${y4} L ${sx13},${sy5} L ${x12},${y5} L ${sx14},${sy6} L ${x13},${y6} L ${sx15},${sy7} L ${x14},${y7} L ${sx16},${sy8} L ${w},${vc} L ${sx16},${sy9} L ${x14},${y8} L ${sx15},${sy10} L ${x13},${y9} L ${sx14},${sy11} L ${x12},${y10} L ${sx13},${sy12} L ${x11},${y11} L ${sx12},${sy13} L ${x10},${y12} L ${sx11},${sy14} L ${x9},${y13} L ${sx10},${sy15} L ${x8},${y14} L ${sx9},${sy16} L ${hc},${h} L ${sx8},${sy16} L ${x7},${y14} L ${sx7},${sy15} L ${x6},${y13} L ${sx6},${sy14} L ${x5},${y12} L ${sx5},${sy13} L ${x4},${y11} L ${sx4},${sy12} L ${x3},${y10} L ${sx3},${sy11} L ${x2},${y9} L ${sx2},${sy10} L ${x1},${y8} L ${sx1},${sy9} z`;
      }
      break;
    case "pie":
    case "pieWedge":
    case "arc":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1, adj2, H, isClose;
        if (shapType === "pie") {
          adj1 = 0;
          adj2 = 270;
          H = h;
          isClose = true;
        } else if (shapType === "pieWedge") {
          adj1 = 180;
          adj2 = 270;
          H = 2 * h;
          isClose = true;
        } else if (shapType === "arc") {
          adj1 = 270;
          adj2 = 0;
          H = h;
          isClose = false;
        }
        if (shapAdjst) {
          const shapAdjstAry = Array.isArray(shapAdjst) ? shapAdjst : [shapAdjst];
          for (const adj of shapAdjstAry) {
            const name = getTextByPathList(adj, ["attrs", "name"]);
            const fmla = getTextByPathList(adj, ["attrs", "fmla"]);
            if (!name || !fmla) continue;
            if (name === "adj1") {
              adj1 = parseInt(fmla.substring(4)) / 6e4;
            } else if (name === "adj2") {
              adj2 = parseInt(fmla.substring(4)) / 6e4;
            }
          }
        }
        pathData = shapePie(H, w, adj1, adj2, isClose);
      }
      break;
    case "chord":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let sAdj1_val = 45;
        let sAdj2_val = 270;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              const sAdj1 = getTextByPathList(adj, ["attrs", "fmla"]);
              sAdj1_val = parseInt(sAdj1.substring(4)) / 6e4;
            } else if (sAdj_name === "adj2") {
              const sAdj2 = getTextByPathList(adj, ["attrs", "fmla"]);
              sAdj2_val = parseInt(sAdj2.substring(4)) / 6e4;
            }
          }
        }
        const hR = h / 2;
        const wR = w / 2;
        pathData = shapeArc2(wR, hR, wR, hR, sAdj1_val, sAdj2_val, true);
      }
      break;
    case "frame":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let adj1 = 12500 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst) {
          adj1 = parseInt(shapAdjst.substring(4)) * RATIO_EMUs_Points;
        }
        const a1 = adj1 < 0 ? 0 : adj1 > cnstVal1 ? cnstVal1 : adj1;
        const x1 = Math.min(w, h) * a1 / cnstVal2;
        const x4 = w - x1;
        const y4 = h - x1;
        pathData = `M 0,0 L ${w},0 L ${w},${h} L 0,${h} z M ${x1},${x1} L ${x1},${y4} L ${x4},${y4} L ${x4},${x1} z`;
      }
      break;
    case "donut":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let adj = 25e3 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst) {
          adj = parseInt(shapAdjst.substring(4)) * RATIO_EMUs_Points;
        }
        const a = adj < 0 ? 0 : adj > cnstVal1 ? cnstVal1 : adj;
        const dr = Math.min(w, h) * a / cnstVal2;
        const iwd2 = w / 2 - dr;
        const ihd2 = h / 2 - dr;
        const outerPath = `M ${w / 2 - w / 2},${h / 2} A ${w / 2},${h / 2} 0 1,0 ${w / 2 + w / 2},${h / 2} A ${w / 2},${h / 2} 0 1,0 ${w / 2 - w / 2},${h / 2} Z`;
        const innerPath = `M ${w / 2 + iwd2},${h / 2} A ${iwd2},${ihd2} 0 1,0 ${w / 2 - iwd2},${h / 2} A ${iwd2},${ihd2} 0 1,0 ${w / 2 + iwd2},${h / 2} Z`;
        pathData = `${outerPath} ${innerPath}`;
      }
      break;
    case "noSmoking":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let adj = 18750 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst) {
          adj = parseInt(shapAdjst.substring(4)) * RATIO_EMUs_Points;
        }
        const a = adj < 0 ? 0 : adj > cnstVal1 ? cnstVal1 : adj;
        const dr = Math.min(w, h) * a / cnstVal2;
        const iwd2 = w / 2 - dr;
        const ihd2 = h / 2 - dr;
        const ang = Math.atan(h / w);
        const ct = ihd2 * Math.cos(ang);
        const st = iwd2 * Math.sin(ang);
        const m = Math.sqrt(ct * ct + st * st);
        const n = iwd2 * ihd2 / m;
        const drd2 = dr / 2;
        const dang = Math.atan(drd2 / n);
        const swAng = -Math.PI + dang * 2;
        const stAng1 = ang - dang;
        const stAng2 = stAng1 - Math.PI;
        const ct1 = ihd2 * Math.cos(stAng1);
        const st1 = iwd2 * Math.sin(stAng1);
        const m1 = Math.sqrt(ct1 * ct1 + st1 * st1);
        const n1 = iwd2 * ihd2 / m1;
        const dx1 = n1 * Math.cos(stAng1);
        const dy1 = n1 * Math.sin(stAng1);
        const x1 = w / 2 + dx1;
        const y1 = h / 2 + dy1;
        const x2 = w / 2 - dx1;
        const y2 = h / 2 - dy1;
        const stAng1deg = stAng1 * 180 / Math.PI;
        const stAng2deg = stAng2 * 180 / Math.PI;
        const swAng2deg = swAng * 180 / Math.PI;
        const outerCircle = `M ${w / 2 - w / 2},${h / 2} A ${w / 2},${h / 2} 0 1,0 ${w / 2 + w / 2},${h / 2} A ${w / 2},${h / 2} 0 1,0 ${w / 2 - w / 2},${h / 2} Z`;
        const slash1 = `M ${x1},${y1} ${shapeArc2(w / 2, h / 2, iwd2, ihd2, stAng1deg, stAng1deg + swAng2deg, false).replace("M", "L")} z`;
        const slash2 = `M ${x2},${y2} ${shapeArc2(w / 2, h / 2, iwd2, ihd2, stAng2deg, stAng2deg + swAng2deg, false).replace("M", "L")} z`;
        pathData = `${outerCircle} ${slash1} ${slash2}`;
      }
      break;
    case "halfFrame":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let sAdj1_val = 3.5;
        let sAdj2_val = 3.5;
        const cnsVal = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              sAdj1_val = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              sAdj2_val = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const minWH = Math.min(w, h);
        const maxAdj2 = cnsVal * w / minWH;
        const a2 = sAdj2_val < 0 ? 0 : sAdj2_val > maxAdj2 ? maxAdj2 : sAdj2_val;
        const x1 = minWH * a2 / cnsVal;
        const g2 = h - h * x1 / w;
        const maxAdj1 = cnsVal * g2 / minWH;
        const a1 = sAdj1_val < 0 ? 0 : sAdj1_val > maxAdj1 ? maxAdj1 : sAdj1_val;
        const y1 = minWH * a1 / cnsVal;
        const x2 = w - y1 * w / h;
        const y2 = h - x1 * h / w;
        pathData = `M 0,0 L ${w},0 L ${x2},${y1} L ${x1},${y1} L ${x1},${y2} L 0,${h} z`;
      }
      break;
    case "blockArc":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 180;
        let adj2 = 0;
        let adj3 = 25e3 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 6e4;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 6e4;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const cd1 = 360;
        const stAng = adj1 < 0 ? 0 : adj1 > cd1 ? cd1 : adj1;
        const istAng = adj2 < 0 ? 0 : adj2 > cd1 ? cd1 : adj2;
        const a3 = adj3 < 0 ? 0 : adj3 > cnstVal1 ? cnstVal1 : adj3;
        const sw11 = istAng - stAng;
        const sw12 = sw11 + cd1;
        const swAng = sw11 > 0 ? sw11 : sw12;
        const iswAng = -swAng;
        const endAng = stAng + swAng;
        const iendAng = istAng + iswAng;
        const stRd = stAng * Math.PI / 180;
        const istRd = istAng * Math.PI / 180;
        const wd2 = w / 2;
        const hd2 = h / 2;
        const hc = w / 2;
        const vc = h / 2;
        let x1, y1;
        if (stAng > 90 && stAng < 270) {
          const wt1 = wd2 * Math.sin(Math.PI / 2 - stRd);
          const ht1 = hd2 * Math.cos(Math.PI / 2 - stRd);
          const dx1 = wd2 * Math.cos(Math.atan(ht1 / wt1));
          const dy1 = hd2 * Math.sin(Math.atan(ht1 / wt1));
          x1 = hc - dx1;
          y1 = vc - dy1;
        } else {
          const wt1 = wd2 * Math.sin(stRd);
          const ht1 = hd2 * Math.cos(stRd);
          const dx1 = wd2 * Math.cos(Math.atan(wt1 / ht1));
          const dy1 = hd2 * Math.sin(Math.atan(wt1 / ht1));
          x1 = hc + dx1;
          y1 = vc + dy1;
        }
        const dr = Math.min(w, h) * a3 / cnstVal2;
        const iwd2 = wd2 - dr;
        const ihd2 = hd2 - dr;
        let x2, y2;
        if (endAng <= 450 && endAng > 270 || endAng >= 630 && endAng < 720) {
          const wt2 = iwd2 * Math.sin(istRd);
          const ht2 = ihd2 * Math.cos(istRd);
          const dx2 = iwd2 * Math.cos(Math.atan(wt2 / ht2));
          const dy2 = ihd2 * Math.sin(Math.atan(wt2 / ht2));
          x2 = hc + dx2;
          y2 = vc + dy2;
        } else {
          const wt2 = iwd2 * Math.sin(Math.PI / 2 - istRd);
          const ht2 = ihd2 * Math.cos(Math.PI / 2 - istRd);
          const dx2 = iwd2 * Math.cos(Math.atan(ht2 / wt2));
          const dy2 = ihd2 * Math.sin(Math.atan(ht2 / wt2));
          x2 = hc - dx2;
          y2 = vc - dy2;
        }
        pathData = `M ${x1},${y1} ${shapeArc2(wd2, hd2, wd2, hd2, stAng, endAng, false).replace("M", "L")} L ${x2},${y2} ${shapeArc2(wd2, hd2, iwd2, ihd2, istAng, iendAng, false).replace("M", "L")} z`;
      }
      break;
    case "bracePair":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let adj = 8333 * RATIO_EMUs_Points;
        const cnstVal1 = 25e3 * RATIO_EMUs_Points;
        const cnstVal2 = 5e4 * RATIO_EMUs_Points;
        const cnstVal3 = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst) {
          adj = parseInt(shapAdjst.substring(4)) * RATIO_EMUs_Points;
        }
        const vc = h / 2, cd2 = 180, cd4 = 90, c3d4 = 270;
        const a = adj < 0 ? 0 : adj > cnstVal1 ? cnstVal1 : adj;
        const minWH = Math.min(w, h);
        const x1 = minWH * a / cnstVal3;
        const x2 = minWH * a / cnstVal2;
        const x3 = w - x2;
        const x4 = w - x1;
        const y2 = vc - x1;
        const y3 = vc + x1;
        const y4 = h - x1;
        pathData = `M ${x2},${h} ${shapeArc2(x2, y4, x1, x1, cd4, cd2, false).replace("M", "L")} L ${x1},${y3} ${shapeArc2(0, y3, x1, x1, 0, -cd4, false).replace("M", "L")} ${shapeArc2(0, y2, x1, x1, cd4, 0, false).replace("M", "L")} L ${x1},${x1} ${shapeArc2(x2, x1, x1, x1, cd2, c3d4, false).replace("M", "L")} M ${x3},0 ${shapeArc2(x3, x1, x1, x1, c3d4, 360, false).replace("M", "L")} L ${x4},${y2} ${shapeArc2(w, y2, x1, x1, cd2, cd4, false).replace("M", "L")} ${shapeArc2(w, y3, x1, x1, c3d4, cd2, false).replace("M", "L")} L ${x4},${y4} ${shapeArc2(x3, y4, x1, x1, 0, cd4, false).replace("M", "L")}`;
      }
      break;
    case "leftBrace":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 8333 * RATIO_EMUs_Points;
        let adj2 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const cd2 = 180, cd4 = 90, c3d4 = 270;
        const a2 = adj2 < 0 ? 0 : adj2 > cnstVal2 ? cnstVal2 : adj2;
        const minWH = Math.min(w, h);
        const q1 = cnstVal2 - a2;
        const q2 = q1 < a2 ? q1 : a2;
        const q3 = q2 / 2;
        const maxAdj1 = q3 * h / minWH;
        const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
        const y1 = minWH * a1 / cnstVal2;
        const y3 = h * a2 / cnstVal2;
        const y2 = y3 - y1;
        const y4 = y3 + y1;
        pathData = `M ${w},${h} ${shapeArc2(w, h - y1, w / 2, y1, cd4, cd2, false).replace("M", "L")} L ${w / 2},${y4} ${shapeArc2(0, y4, w / 2, y1, 0, -cd4, false).replace("M", "L")} ${shapeArc2(0, y2, w / 2, y1, cd4, 0, false).replace("M", "L")} L ${w / 2},${y1} ${shapeArc2(w, y1, w / 2, y1, cd2, c3d4, false).replace("M", "L")}`;
      }
      break;
    case "rightBrace":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 8333 * RATIO_EMUs_Points;
        let adj2 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const cd = 360, cd2 = 180, cd4 = 90, c3d4 = 270;
        const a2 = adj2 < 0 ? 0 : adj2 > cnstVal2 ? cnstVal2 : adj2;
        const minWH = Math.min(w, h);
        const q1 = cnstVal2 - a2;
        const q2 = q1 < a2 ? q1 : a2;
        const q3 = q2 / 2;
        const maxAdj1 = q3 * h / minWH;
        const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
        const y1 = minWH * a1 / cnstVal2;
        const y3 = h * a2 / cnstVal2;
        const y2 = y3 - y1;
        const y4 = h - y1;
        pathData = `M 0,0 ${shapeArc2(0, y1, w / 2, y1, c3d4, cd, false).replace("M", "L")} L ${w / 2},${y2} ${shapeArc2(w, y2, w / 2, y1, cd2, cd4, false).replace("M", "L")} ${shapeArc2(w, y3 + y1, w / 2, y1, c3d4, cd2, false).replace("M", "L")} L ${w / 2},${y4} ${shapeArc2(0, y4, w / 2, y1, 0, cd4, false).replace("M", "L")}`;
      }
      break;
    case "bracketPair":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let adj = 16667 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst) {
          adj = parseInt(shapAdjst.substring(4)) * RATIO_EMUs_Points;
        }
        const cd2 = 180, cd4 = 90, c3d4 = 270;
        const a = adj < 0 ? 0 : adj > cnstVal1 ? cnstVal1 : adj;
        const x1 = Math.min(w, h) * a / cnstVal2;
        const x2 = w - x1;
        const y2 = h - x1;
        pathData = `${shapeArc2(x1, x1, x1, x1, c3d4, cd2, false)} ${shapeArc2(x1, y2, x1, x1, cd2, cd4, false).replace("M", "L")} ${shapeArc2(x2, x1, x1, x1, c3d4, c3d4 + cd4, false)} ${shapeArc2(x2, y2, x1, x1, 0, cd4, false).replace("M", "L")}`;
      }
      break;
    case "leftBracket":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let adj = 8333 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        const maxAdj = cnstVal1 * h / Math.min(w, h);
        if (shapAdjst) {
          adj = parseInt(shapAdjst.substring(4)) * RATIO_EMUs_Points;
        }
        const cd2 = 180, cd4 = 90, c3d4 = 270;
        const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
        let y1 = Math.min(w, h) * a / cnstVal2;
        if (y1 > w) y1 = w;
        const y2 = h - y1;
        pathData = `M ${w},${h} ${shapeArc2(y1, y2, y1, y1, cd4, cd2, false).replace("M", "L")} L 0,${y1} ${shapeArc2(y1, y1, y1, y1, cd2, c3d4, false).replace("M", "L")} L ${w},0`;
      }
      break;
    case "rightBracket":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let adj = 8333 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        const maxAdj = cnstVal1 * h / Math.min(w, h);
        if (shapAdjst) {
          adj = parseInt(shapAdjst.substring(4)) * RATIO_EMUs_Points;
        }
        const cd = 360, cd4 = 90, c3d4 = 270;
        const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
        const y1 = Math.min(w, h) * a / cnstVal2;
        const y2 = h - y1;
        const y3 = w - y1;
        pathData = `M 0,${h} ${shapeArc2(y3, y2, y1, y1, cd4, 0, false).replace("M", "L")} L ${w},${h / 2} ${shapeArc2(y3, y1, y1, y1, cd, c3d4, false).replace("M", "L")} L 0,0`;
      }
      break;
    case "moon":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let adj = 0.5;
        if (shapAdjst) {
          adj = parseInt(shapAdjst.substring(4)) / 1e5;
        }
        const hd2 = h / 2;
        const cd2 = 180;
        const cd4 = 90;
        const adj2 = (1 - adj) * w;
        pathData = `M ${w},${h} ${shapeArc2(w, hd2, w, hd2, cd4, cd4 + cd2, false).replace("M", "L")} ${shapeArc2(w, hd2, adj2, hd2, cd4 + cd2, cd4, false).replace("M", "L")} z`;
      }
      break;
    case "corner":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let sAdj1_val = 5e4 * RATIO_EMUs_Points;
        let sAdj2_val = 5e4 * RATIO_EMUs_Points;
        const cnsVal = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              sAdj1_val = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              sAdj2_val = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const minWH = Math.min(w, h);
        const maxAdj1 = cnsVal * h / minWH;
        const maxAdj2 = cnsVal * w / minWH;
        const a1 = sAdj1_val < 0 ? 0 : sAdj1_val > maxAdj1 ? maxAdj1 : sAdj1_val;
        const a2 = sAdj2_val < 0 ? 0 : sAdj2_val > maxAdj2 ? maxAdj2 : sAdj2_val;
        const x1 = minWH * a2 / cnsVal;
        const dy1 = minWH * a1 / cnsVal;
        const y1 = h - dy1;
        pathData = `M 0,0 L ${x1},0 L ${x1},${y1} L ${w},${y1} L ${w},${h} L 0,${h} z`;
      }
      break;
    case "diagStripe":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let sAdj1_val = 5e4 * RATIO_EMUs_Points;
        const cnsVal = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst) {
          sAdj1_val = parseInt(shapAdjst.substring(4)) * RATIO_EMUs_Points;
        }
        const a1 = sAdj1_val < 0 ? 0 : sAdj1_val > cnsVal ? cnsVal : sAdj1_val;
        const x2 = w * a1 / cnsVal;
        const y2 = h * a1 / cnsVal;
        pathData = `M 0,${y2} L ${x2},0 L ${w},0 L 0,${h} z`;
      }
      break;
    case "gear6":
    case "gear9":
      pathData = shapeGear(w, h / 3.5, parseInt(shapType.substring(4)));
      break;
    case "bentConnector3":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let shapAdjst_val = 0.5;
        if (shapAdjst) {
          shapAdjst_val = parseInt(shapAdjst.substring(4)) / 1e5;
        }
        pathData = `M 0 0 L ${shapAdjst_val * w} 0 L ${shapAdjst_val * w} ${h} L ${w} ${h}`;
      }
      break;
    case "plus":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let adj1 = 0.25;
        if (shapAdjst) {
          adj1 = parseInt(shapAdjst.substring(4)) / 1e5;
        }
        const adj2 = 1 - adj1;
        pathData = `M ${adj1 * w} 0 L ${adj1 * w} ${adj1 * h} L 0 ${adj1 * h} L 0 ${adj2 * h} L ${adj1 * w} ${adj2 * h} L ${adj1 * w} ${h} L ${adj2 * w} ${h} L ${adj2 * w} ${adj2 * h} L ${w} ${adj2 * h} L ${w} ${adj1 * h} L ${adj2 * w} ${adj1 * h} L ${adj2 * w} 0 Z`;
      }
      break;
    case "teardrop":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let adj1 = 1e5 * RATIO_EMUs_Points;
        const cnsVal1 = adj1;
        const cnsVal2 = 2e5 * RATIO_EMUs_Points;
        if (shapAdjst) {
          adj1 = parseInt(shapAdjst.substring(4)) * RATIO_EMUs_Points;
        }
        const a1 = adj1 < 0 ? 0 : adj1 > cnsVal2 ? cnsVal2 : adj1;
        const r2 = Math.sqrt(2);
        const tw = r2 * (w / 2);
        const th = r2 * (h / 2);
        const sw = tw * a1 / cnsVal1;
        const sh = th * a1 / cnsVal1;
        const rd45 = 45 * Math.PI / 180;
        const dx1 = sw * Math.cos(rd45);
        const dy1 = sh * Math.cos(rd45);
        const x1 = w / 2 + dx1;
        const y1 = h / 2 - dy1;
        const x2 = (w / 2 + x1) / 2;
        const y2 = (h / 2 + y1) / 2;
        pathData = `${shapeArc2(w / 2, h / 2, w / 2, h / 2, 180, 270, false)} Q ${x2},0 ${x1},${y1} Q ${w},${y2} ${w},${h / 2} ${shapeArc2(w / 2, h / 2, w / 2, h / 2, 0, 90, false).replace("M", "L")} ${shapeArc2(w / 2, h / 2, w / 2, h / 2, 90, 180, false).replace("M", "L")} z`;
      }
      break;
    case "plaque":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let adj1 = 16667 * RATIO_EMUs_Points;
        const cnsVal1 = 5e4 * RATIO_EMUs_Points;
        const cnsVal2 = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst) {
          adj1 = parseInt(shapAdjst.substring(4)) * RATIO_EMUs_Points;
        }
        const a1 = adj1 < 0 ? 0 : adj1 > cnsVal1 ? cnsVal1 : adj1;
        const x1 = a1 * Math.min(w, h) / cnsVal2;
        const x2 = w - x1;
        const y2 = h - x1;
        pathData = `M 0,${x1} ${shapeArc2(0, 0, x1, x1, 90, 0, false).replace("M", "L")} L ${x2},0 ${shapeArc2(w, 0, x1, x1, 180, 90, false).replace("M", "L")} L ${w},${y2} ${shapeArc2(w, h, x1, x1, 270, 180, false).replace("M", "L")} L ${x1},${h} ${shapeArc2(0, h, x1, x1, 0, -90, false).replace("M", "L")} z`;
      }
      break;
    case "sun":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        const refr = RATIO_EMUs_Points;
        let adj1 = 25e3 * refr;
        const cnstVal1 = 12500 * refr;
        const cnstVal2 = 46875 * refr;
        if (shapAdjst) {
          adj1 = parseInt(shapAdjst.substring(4)) * refr;
        }
        const a1 = adj1 < cnstVal1 ? cnstVal1 : adj1 > cnstVal2 ? cnstVal2 : adj1;
        const cnstVa3 = 5e4 * refr;
        const cnstVa4 = 1e5 * refr;
        const g0 = cnstVa3 - a1;
        const g1 = g0 * 30274 / 32768;
        const g2 = g0 * 12540 / 32768;
        const g5 = cnstVa3 - g1;
        const g6 = cnstVa3 - g2;
        const g10 = g5 * 3 / 4;
        const g11 = g6 * 3 / 4;
        const g12 = g10 + 3662 * refr;
        const g13 = g11 + 36620 * refr;
        const g14 = g11 + 12500 * refr;
        const g15 = cnstVa4 - g10;
        const g16 = cnstVa4 - g12;
        const g17 = cnstVa4 - g13;
        const g18 = cnstVa4 - g14;
        const ox1 = w * 18436 / 21600;
        const oy1 = h * 3163 / 21600;
        const ox2 = w * 3163 / 21600;
        const oy2 = h * 18436 / 21600;
        const x10 = w * g10 / cnstVa4;
        const x12 = w * g12 / cnstVa4;
        const x13 = w * g13 / cnstVa4;
        const x14 = w * g14 / cnstVa4;
        const x15 = w * g15 / cnstVa4;
        const x16 = w * g16 / cnstVa4;
        const x17 = w * g17 / cnstVa4;
        const x18 = w * g18 / cnstVa4;
        const x19 = w * a1 / cnstVa4;
        const wR = w * g0 / cnstVa4;
        const hR = h * g0 / cnstVa4;
        const y10 = h * g10 / cnstVa4;
        const y12 = h * g12 / cnstVa4;
        const y13 = h * g13 / cnstVa4;
        const y14 = h * g14 / cnstVa4;
        const y15 = h * g15 / cnstVa4;
        const y16 = h * g16 / cnstVa4;
        const y17 = h * g17 / cnstVa4;
        const y18 = h * g18 / cnstVa4;
        pathData = `M ${w},${h / 2} L ${x15},${y18} L ${x15},${y14} z M ${ox1},${oy1} L ${x16},${y17} L ${x13},${y12} z M ${w / 2},0 L ${x18},${y10} L ${x14},${y10} z M ${ox2},${oy1} L ${x17},${y12} L ${x12},${y17} z M 0,${h / 2} L ${x10},${y14} L ${x10},${y18} z M ${ox2},${oy2} L ${x12},${y13} L ${x17},${y16} z M ${w / 2},${h} L ${x14},${y15} L ${x18},${y15} z M ${ox1},${oy2} L ${x13},${y16} L ${x16},${y13} z M ${x19},${h / 2} ${shapeArc2(w / 2, h / 2, wR, hR, 180, 540, false).replace("M", "L")} z`;
      }
      break;
    case "heart":
      {
        const dx1 = w * 49 / 48;
        const dx2 = w * 10 / 48;
        const x1 = w / 2 - dx1;
        const x2 = w / 2 - dx2;
        const x3 = w / 2 + dx2;
        const x4 = w / 2 + dx1;
        const y1 = -h / 3;
        pathData = `M ${w / 2},${h / 4} C ${x3},${y1} ${x4},${h / 4} ${w / 2},${h} C ${x1},${h / 4} ${x2},${y1} ${w / 2},${h / 4} z`;
      }
      break;
    case "lightningBolt":
      {
        const x1 = w * 5022 / 21600, x2 = w * 11050 / 21600, x3 = w * 8472 / 21600, x5 = w * 10012 / 21600, x6 = w * 14767 / 21600, x7 = w * 12222 / 21600, x8 = w * 12860 / 21600, x10 = w * 7602 / 21600, x11 = w * 16577 / 21600, y1 = h * 3890 / 21600, y2 = h * 6080 / 21600, y3 = h * 6797 / 21600, y5 = h * 12877 / 21600, y6 = h * 9705 / 21600, y7 = h * 12007 / 21600, y8 = h * 13987 / 21600, y9 = h * 8382 / 21600, y11 = h * 14915 / 21600;
        pathData = `M ${x3},0 L ${x8},${y2} L ${x2},${y3} L ${x11},${y7} L ${x6},${y5} L ${w},${h} L ${x5},${y11} L ${x7},${y8} L ${x1},${y6} L ${x10},${y9} L 0,${y1} z`;
      }
      break;
    case "cube":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        const refr = RATIO_EMUs_Points;
        let adj = 25e3 * refr;
        if (shapAdjst) {
          adj = parseInt(shapAdjst.substring(4)) * refr;
        }
        const cnstVal2 = 1e5 * refr;
        const ss = Math.min(w, h);
        const a = adj < 0 ? 0 : adj > cnstVal2 ? cnstVal2 : adj;
        const y1 = ss * a / cnstVal2;
        const y4 = h - y1;
        const x4 = w - y1;
        pathData = `M 0,${y1} L ${y1},0 L ${w},0 L ${w},${y4} L ${x4},${h} L 0,${h} z M 0,${y1} L ${x4},${y1} M ${x4},${y1} L ${w},0 M ${x4},${y1} L ${x4},${h}`;
      }
      break;
    case "bevel":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        const refr = RATIO_EMUs_Points;
        let adj = 12500 * refr;
        if (shapAdjst) {
          adj = parseInt(shapAdjst.substring(4)) * refr;
        }
        const cnstVal1 = 5e4 * refr;
        const cnstVal2 = 1e5 * refr;
        const ss = Math.min(w, h);
        const a = adj < 0 ? 0 : adj > cnstVal1 ? cnstVal1 : adj;
        const x1 = ss * a / cnstVal2;
        const x2 = w - x1;
        const y2 = h - x1;
        pathData = `M 0,0 L ${w},0 L ${w},${h} L 0,${h} z M ${x1},${x1} L ${x2},${x1} L ${x2},${y2} L ${x1},${y2} z M 0,0 L ${x1},${x1} M 0,${h} L ${x1},${y2} M ${w},0 L ${x2},${x1} M ${w},${h} L ${x2},${y2}`;
      }
      break;
    case "foldedCorner":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        const refr = RATIO_EMUs_Points;
        let adj = 16667 * refr;
        if (shapAdjst) {
          adj = parseInt(shapAdjst.substring(4)) * refr;
        }
        const cnstVal1 = 5e4 * refr;
        const cnstVal2 = 1e5 * refr;
        const ss = Math.min(w, h);
        const a = adj < 0 ? 0 : adj > cnstVal1 ? cnstVal1 : adj;
        const dy2 = ss * a / cnstVal2;
        const dy1 = dy2 / 5;
        const x1 = w - dy2;
        const x2 = x1 + dy1;
        const y2 = h - dy2;
        const y1 = y2 + dy1;
        pathData = `M ${x1},${h} L ${x2},${y1} L ${w},${y2} L ${x1},${h} L 0,${h} L 0,0 L ${w},0 L ${w},${y2}`;
      }
      break;
    case "cloud":
    case "cloudCallout":
      {
        const x0 = w * 3900 / 43200;
        const y0 = h * 14370 / 43200;
        const rX1 = w * 6753 / 43200, rY1 = h * 9190 / 43200, rX2 = w * 5333 / 43200, rY2 = h * 7267 / 43200, rX3 = w * 4365 / 43200, rY3 = h * 5945 / 43200, rX4 = w * 4857 / 43200, rY4 = h * 6595 / 43200, rY5 = h * 7273 / 43200, rX6 = w * 6775 / 43200, rY6 = h * 9220 / 43200, rX7 = w * 5785 / 43200, rY7 = h * 7867 / 43200, rX8 = w * 6752 / 43200, rY8 = h * 9215 / 43200, rX9 = w * 7720 / 43200, rY9 = h * 10543 / 43200, rX10 = w * 4360 / 43200, rY10 = h * 5918 / 43200, rX11 = w * 4345 / 43200;
        const sA1 = -11429249 / 6e4, wA1 = 7426832 / 6e4, sA2 = -8646143 / 6e4, wA2 = 5396714 / 6e4, sA3 = -8748475 / 6e4, wA3 = 5983381 / 6e4, sA4 = -7859164 / 6e4, wA4 = 7034504 / 6e4, sA5 = -4722533 / 6e4, wA5 = 6541615 / 6e4, sA6 = -2776035 / 6e4, wA6 = 7816140 / 6e4, sA7 = 37501 / 6e4, wA7 = 6842e3 / 6e4, sA8 = 1347096 / 6e4, wA8 = 6910353 / 6e4, sA9 = 3974558 / 6e4, wA9 = 4542661 / 6e4, sA10 = -16496525 / 6e4, wA10 = 8804134 / 6e4, sA11 = -14809710 / 6e4, wA11 = 9151131 / 6e4;
        const getArc = (startX, startY, rX, rY, sA, wA) => {
          const cX = startX - rX * Math.cos(sA * Math.PI / 180);
          const cY = startY - rY * Math.sin(sA * Math.PI / 180);
          return shapeArc2(cX, cY, rX, rY, sA, sA + wA, false).replace("M", "L");
        };
        let cloudPath = `M ${x0},${y0}`;
        let lastPoint = [x0, y0];
        const arcs = [
          [rX1, rY1, sA1, wA1],
          [rX2, rY2, sA2, wA2],
          [rX3, rY3, sA3, wA3],
          [rX4, rY4, sA4, wA4],
          [rX2, rY5, sA5, wA5],
          [rX6, rY6, sA6, wA6],
          [rX7, rY7, sA7, wA7],
          [rX8, rY8, sA8, wA8],
          [rX9, rY9, sA9, wA9],
          [rX10, rY10, sA10, wA10],
          [rX11, rY3, sA11, wA11]
        ];
        for (const arcParams of arcs) {
          const arcPath = getArc(lastPoint[0], lastPoint[1], ...arcParams);
          cloudPath += arcPath;
          const lastL = arcPath.lastIndexOf("L");
          const coords = arcPath.substring(lastL + 1).split(" ");
          lastPoint = [parseFloat(coords[0]), parseFloat(coords[1])];
        }
        cloudPath += " z";
        if (shapType === "cloudCallout") {
          const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
          const refr = RATIO_EMUs_Points;
          let adj1 = -20833 * refr;
          let adj2 = 62500 * refr;
          if (shapAdjst_ary) {
            for (const adj of shapAdjst_ary) {
              const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
              if (sAdj_name === "adj1") {
                adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
              } else if (sAdj_name === "adj2") {
                adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
              }
            }
          }
          const cnstVal2 = 1e5 * refr;
          const ss = Math.min(w, h);
          const wd2 = w / 2, hd2 = h / 2;
          const dxPos = w * adj1 / cnstVal2;
          const dyPos = h * adj2 / cnstVal2;
          const xPos = wd2 + dxPos;
          const yPos = hd2 + dyPos;
          const ht = hd2 * Math.cos(Math.atan(dyPos / dxPos));
          const wt = wd2 * Math.sin(Math.atan(dyPos / dxPos));
          const g2 = wd2 * Math.cos(Math.atan(wt / ht));
          const g3 = hd2 * Math.sin(Math.atan(wt / ht));
          const g4 = adj1 >= 0 ? wd2 + g2 : wd2 - g2;
          const g5 = adj1 >= 0 ? hd2 + g3 : hd2 - g3;
          const g6 = g4 - xPos;
          const g7 = g5 - yPos;
          const g8 = Math.sqrt(g6 * g6 + g7 * g7);
          const g9 = ss * 6600 / 21600;
          const g10 = g8 - g9;
          const g11 = g10 / 3;
          const g12 = ss * 1800 / 21600;
          const g13 = g11 + g12;
          const g16 = g13 * g6 / g8 + xPos;
          const g17 = g13 * g7 / g8 + yPos;
          const g18 = ss * 4800 / 21600;
          const g20 = g18 + g11 * 2;
          const g23 = g20 * g6 / g8 + xPos;
          const g24 = g20 * g7 / g8 + yPos;
          const g25 = ss * 1200 / 21600;
          const g26 = ss * 600 / 21600;
          const x23 = xPos + g26;
          const x24 = g16 + g25;
          const x25 = g23 + g12;
          const calloutPath = `${shapeArc2(x23 - g26, yPos, g26, g26, 0, 360, true)} M ${x24},${g17} ${shapeArc2(x24 - g25, g17, g25, g25, 0, 360, true).replace("M", "L")} M ${x25},${g24} ${shapeArc2(x25 - g12, g24, g12, g12, 0, 360, true).replace("M", "L")}`;
          cloudPath += calloutPath;
        }
        pathData = cloudPath;
      }
      break;
    case "smileyFace":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        const refr = RATIO_EMUs_Points;
        let adj = 4653 * refr;
        if (shapAdjst) {
          adj = parseInt(shapAdjst.substring(4)) * refr;
        }
        const cnstVal1 = 5e4 * refr;
        const cnstVal2 = 1e5 * refr;
        const cnstVal3 = 4653 * refr;
        const wd2 = w / 2, hd2 = h / 2;
        const a = adj < -cnstVal3 ? -cnstVal3 : adj > cnstVal3 ? cnstVal3 : adj;
        const x2 = w * 6215 / 21600;
        const x3 = w * 13135 / 21600;
        const x4 = w * 16640 / 21600;
        const y1 = h * 7570 / 21600;
        const y3 = h * 16515 / 21600;
        const dy2 = h * a / cnstVal2;
        const y2 = y3 - dy2;
        const y4 = y3 + dy2;
        const dy3 = h * a / cnstVal1;
        const y5 = y4 + dy3;
        const wR = w * 1125 / 21600;
        const hR = h * 1125 / 21600;
        const cX1 = x2;
        const cY1 = y1;
        const cX2 = x3;
        const x1_mouth = w * 4969 / 21699;
        pathData = `${shapeArc2(cX1, cY1, wR, hR, 0, 360, true)} ${shapeArc2(cX2, cY1, wR, hR, 0, 360, true)} M ${x1_mouth},${y2} Q ${wd2},${y5} ${x4},${y2} Q ${wd2},${y5} ${x1_mouth},${y2} M 0,${hd2} ${shapeArc2(wd2, hd2, wd2, hd2, 180, 540, false).replace("M", "L")} z`;
      }
      break;
    case "verticalScroll":
    case "horizontalScroll":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        const refr = RATIO_EMUs_Points;
        let adj = 12500 * refr;
        if (shapAdjst) {
          adj = parseInt(shapAdjst.substring(4)) * refr;
        }
        const cnstVal1 = 25e3 * refr;
        const cnstVal2 = 1e5 * refr;
        const ss = Math.min(w, h);
        const t = 0, l = 0, b = h, r = w;
        const a = adj < 0 ? 0 : adj > cnstVal1 ? cnstVal1 : adj;
        const ch = ss * a / cnstVal2;
        const ch2 = ch / 2;
        const ch4 = ch / 4;
        if (shapType === "verticalScroll") {
          const x3 = ch + ch2;
          const x4 = ch + ch;
          const x6 = r - ch;
          const x7 = r - ch2;
          const x5 = x6 - ch2;
          const y3 = b - ch;
          const y4 = b - ch2;
          pathData = `M ${ch},${y3} L ${ch},${ch2} ${shapeArc2(x3, ch2, ch2, ch2, 180, 270, false).replace("M", "L")} L ${x7},${t} ${shapeArc2(x7, ch2, ch2, ch2, 270, 450, false).replace("M", "L")} L ${x6},${ch} L ${x6},${y4} ${shapeArc2(x5, y4, ch2, ch2, 0, 90, false).replace("M", "L")} L ${ch2},${b} ${shapeArc2(ch2, y4, ch2, ch2, 90, 270, false).replace("M", "L")} z M ${x3},${t} ${shapeArc2(x3, ch2, ch2, ch2, 270, 450, false).replace("M", "L")} ${shapeArc2(x3, x3 / 2, ch4, ch4, 90, 270, false).replace("M", "L")} L ${x4},${ch2} M ${x6},${ch} L ${x3},${ch} M ${ch},${y4} ${shapeArc2(ch2, y4, ch2, ch2, 0, 270, false).replace("M", "L")} ${shapeArc2(ch2, (y4 + y3) / 2, ch4, ch4, 270, 450, false).replace("M", "L")} z M ${ch},${y4} L ${ch},${y3}`;
        } else if (shapType === "horizontalScroll") {
          const y3 = ch + ch2;
          const y4 = ch + ch;
          const y6 = b - ch;
          const y7 = b - ch2;
          const y5 = y6 - ch2;
          const x3 = r - ch;
          const x4 = r - ch2;
          pathData = `M ${l},${y3} ${shapeArc2(ch2, y3, ch2, ch2, 180, 270, false).replace("M", "L")} L ${x3},${ch} L ${x3},${ch2} ${shapeArc2(x4, ch2, ch2, ch2, 180, 360, false).replace("M", "L")} L ${r},${y5} ${shapeArc2(x4, y5, ch2, ch2, 0, 90, false).replace("M", "L")} L ${ch},${y6} L ${ch},${y7} ${shapeArc2(ch2, y7, ch2, ch2, 0, 180, false).replace("M", "L")} z M ${x4},${ch} ${shapeArc2(x4, ch2, ch2, ch2, 90, -180, false).replace("M", "L")} ${shapeArc2((x3 + x4) / 2, ch2, ch4, ch4, 180, 0, false).replace("M", "L")} z M ${x4},${ch} L ${x3},${ch} M ${ch2},${y4} L ${ch2},${y3} ${shapeArc2(y3 / 2, y3, ch4, ch4, 180, 360, false).replace("M", "L")} ${shapeArc2(ch2, y3, ch2, ch2, 0, 180, false).replace("M", "L")} M ${ch},${y3} L ${ch},${y6}`;
        }
      }
      break;
    case "wedgeEllipseCallout":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        const refr = RATIO_EMUs_Points;
        let adj1 = -20833 * refr;
        let adj2 = 62500 * refr;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            }
          }
        }
        const cnstVal1 = 1e5 * RATIO_EMUs_Points;
        const angVal1 = 11 * Math.PI / 180;
        const vc = h / 2, hc = w / 2;
        const dxPos = w * adj1 / cnstVal1;
        const dyPos = h * adj2 / cnstVal1;
        const xPos = hc + dxPos;
        const yPos = vc + dyPos;
        const pang = Math.atan2(dyPos * w, dxPos * h);
        const stAng = pang + angVal1;
        const enAng = pang - angVal1;
        const dx1 = hc * Math.cos(stAng);
        const dy1 = vc * Math.sin(stAng);
        const dx2 = hc * Math.cos(enAng);
        const dy2 = vc * Math.sin(enAng);
        const x1 = hc + dx1;
        const y1 = vc + dy1;
        const x2 = hc + dx2;
        const y2 = vc + dy2;
        pathData = `M ${x1},${y1} L ${xPos},${yPos} L ${x2},${y2} ${shapeArc2(hc, vc, hc, vc, enAng * 180 / Math.PI, stAng * 180 / Math.PI, true).replace("M", "L")}`;
      }
      break;
    case "wedgeRectCallout":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        const refr = RATIO_EMUs_Points;
        let adj1 = -20833 * refr;
        let adj2 = 62500 * refr;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            }
          }
        }
        const cnstVal1 = 1e5 * RATIO_EMUs_Points;
        const vc = h / 2, hc = w / 2;
        const dxPos = w * adj1 / cnstVal1;
        const dyPos = h * adj2 / cnstVal1;
        const xPos = hc + dxPos;
        const yPos = vc + dyPos;
        const dq = dxPos * h / w;
        const dz = Math.abs(dyPos) - Math.abs(dq);
        const xg1 = dxPos > 0 ? 7 : 2;
        const xg2 = dxPos > 0 ? 10 : 5;
        const x1 = w * xg1 / 12;
        const x2 = w * xg2 / 12;
        const yg1 = dyPos > 0 ? 7 : 2;
        const yg2 = dyPos > 0 ? 10 : 5;
        const y1 = h * yg1 / 12;
        const y2 = h * yg2 / 12;
        const xl = dz > 0 ? 0 : dxPos > 0 ? 0 : xPos;
        const xt = dz > 0 ? dyPos > 0 ? x1 : xPos : x1;
        const xr = dz > 0 ? w : dxPos > 0 ? xPos : w;
        const xb = dz > 0 ? dyPos > 0 ? xPos : x1 : x1;
        const yl = dz > 0 ? y1 : dxPos > 0 ? y1 : yPos;
        const yt = dz > 0 ? dyPos > 0 ? 0 : yPos : 0;
        const yr = dz > 0 ? y1 : dxPos > 0 ? yPos : y1;
        const yb = dz > 0 ? dyPos > 0 ? yPos : h : h;
        pathData = `M 0,0 L ${x1},0 L ${xt},${yt} L ${x2},0 L ${w},0 L ${w},${y1} L ${xr},${yr} L ${w},${y2} L ${w},${h} L ${x2},${h} L ${xb},${yb} L ${x1},${h} L 0,${h} L 0,${y2} L ${xl},${yl} L 0,${y1} z`;
      }
      break;
    case "wedgeRoundRectCallout":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        const refr = RATIO_EMUs_Points;
        let adj1 = -20833 * refr;
        let adj2 = 62500 * refr;
        let adj3 = 16667 * refr;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            }
          }
        }
        const cnstVal1 = 1e5 * RATIO_EMUs_Points;
        const ss = Math.min(w, h);
        const vc = h / 2, hc = w / 2;
        const dxPos = w * adj1 / cnstVal1;
        const dyPos = h * adj2 / cnstVal1;
        const xPos = hc + dxPos;
        const yPos = vc + dyPos;
        const dq = dxPos * h / w;
        const dz = Math.abs(dyPos) - Math.abs(dq);
        const xg1 = dxPos > 0 ? 7 : 2;
        const xg2 = dxPos > 0 ? 10 : 5;
        const x1 = w * xg1 / 12;
        const x2 = w * xg2 / 12;
        const yg1 = dyPos > 0 ? 7 : 2;
        const yg2 = dyPos > 0 ? 10 : 5;
        const y1 = h * yg1 / 12;
        const y2 = h * yg2 / 12;
        const xl = dz > 0 ? 0 : dxPos > 0 ? 0 : xPos;
        const xt = dz > 0 ? dyPos > 0 ? x1 : xPos : x1;
        const xr = dz > 0 ? w : dxPos > 0 ? xPos : w;
        const xb = dz > 0 ? dyPos > 0 ? xPos : x1 : x1;
        const yl = dz > 0 ? y1 : dxPos > 0 ? y1 : yPos;
        const yt = dz > 0 ? dyPos > 0 ? 0 : yPos : 0;
        const yr = dz > 0 ? y1 : dxPos > 0 ? yPos : y1;
        const yb = dz > 0 ? dyPos > 0 ? yPos : h : h;
        const u1 = ss * adj3 / cnstVal1;
        const u2 = w - u1;
        const v2 = h - u1;
        pathData = `M 0,${u1} ${shapeArc2(u1, u1, u1, u1, 180, 270, false).replace("M", "L")} L ${x1},0 L ${xt},${yt} L ${x2},0 L ${u2},0 ${shapeArc2(u2, u1, u1, u1, 270, 360, false).replace("M", "L")} L ${w},${y1} L ${xr},${yr} L ${w},${y2} L ${w},${v2} ${shapeArc2(u2, v2, u1, u1, 0, 90, false).replace("M", "L")} L ${x2},${h} L ${xb},${yb} L ${x1},${h} L ${u1},${h} ${shapeArc2(u1, v2, u1, u1, 90, 180, false).replace("M", "L")} L 0,${y2} L ${xl},${yl} L 0,${y1} z`;
      }
      break;
    case "accentBorderCallout1":
    case "accentBorderCallout2":
    case "accentBorderCallout3":
    case "borderCallout1":
    case "borderCallout2":
    case "borderCallout3":
    case "accentCallout1":
    case "accentCallout2":
    case "accentCallout3":
    case "callout1":
    case "callout2":
    case "callout3":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        const refr = RATIO_EMUs_Points;
        let adj1 = 18750 * refr;
        let adj2 = -8333 * refr;
        let adj3 = 18750 * refr;
        let adj4 = -16667 * refr;
        let adj5 = 1e5 * refr;
        let adj6 = -16667 * refr;
        let adj7 = 112963 * refr;
        let adj8 = -8333 * refr;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            } else if (sAdj_name === "adj4") {
              adj4 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            } else if (sAdj_name === "adj5") {
              adj5 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            } else if (sAdj_name === "adj6") {
              adj6 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            } else if (sAdj_name === "adj7") {
              adj7 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            } else if (sAdj_name === "adj8") {
              adj8 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            }
          }
        }
        const cnstVal1 = 1e5 * refr;
        let x1, y1, x2, y2, x3, y3, x4, y4;
        const baseRect = `M 0,0 L ${w},0 L ${w},${h} L 0,${h} z`;
        switch (shapType) {
          case "borderCallout1":
          case "callout1":
            if (!shapAdjst_ary) {
              adj1 = 18750 * refr;
              adj2 = -8333 * refr;
              adj3 = 112500 * refr;
              adj4 = -38333 * refr;
            }
            y1 = h * adj1 / cnstVal1;
            x1 = w * adj2 / cnstVal1;
            y2 = h * adj3 / cnstVal1;
            x2 = w * adj4 / cnstVal1;
            pathData = `${baseRect} M ${x1},${y1} L ${x2},${y2}`;
            break;
          case "borderCallout2":
          case "callout2":
            if (!shapAdjst_ary) {
              adj1 = 18750 * refr;
              adj2 = -8333 * refr;
              adj3 = 18750 * refr;
              adj4 = -16667 * refr;
              adj5 = 112500 * refr;
              adj6 = -46667 * refr;
            }
            y1 = h * adj1 / cnstVal1;
            x1 = w * adj2 / cnstVal1;
            y2 = h * adj3 / cnstVal1;
            x2 = w * adj4 / cnstVal1;
            y3 = h * adj5 / cnstVal1;
            x3 = w * adj6 / cnstVal1;
            pathData = `${baseRect} M ${x1},${y1} L ${x2},${y2} L ${x3},${y3}`;
            break;
          case "borderCallout3":
          case "callout3":
            if (!shapAdjst_ary) {
              adj1 = 18750 * refr;
              adj2 = -8333 * refr;
              adj3 = 18750 * refr;
              adj4 = -16667 * refr;
              adj5 = 1e5 * refr;
              adj6 = -16667 * refr;
              adj7 = 112963 * refr;
              adj8 = -8333 * refr;
            }
            y1 = h * adj1 / cnstVal1;
            x1 = w * adj2 / cnstVal1;
            y2 = h * adj3 / cnstVal1;
            x2 = w * adj4 / cnstVal1;
            y3 = h * adj5 / cnstVal1;
            x3 = w * adj6 / cnstVal1;
            y4 = h * adj7 / cnstVal1;
            x4 = w * adj8 / cnstVal1;
            pathData = `${baseRect} M ${x1},${y1} L ${x2},${y2} L ${x3},${y3} L ${x4},${y4}`;
            break;
          case "accentBorderCallout1":
          case "accentCallout1":
            if (!shapAdjst_ary) {
              adj1 = 18750 * refr;
              adj2 = -8333 * refr;
              adj3 = 112500 * refr;
              adj4 = -38333 * refr;
            }
            y1 = h * adj1 / cnstVal1;
            x1 = w * adj2 / cnstVal1;
            y2 = h * adj3 / cnstVal1;
            x2 = w * adj4 / cnstVal1;
            pathData = `${baseRect} M ${x1},${y1} L ${x2},${y2} M ${x1},0 L ${x1},${h}`;
            break;
          case "accentBorderCallout2":
          case "accentCallout2":
            if (!shapAdjst_ary) {
              adj1 = 18750 * refr;
              adj2 = -8333 * refr;
              adj3 = 18750 * refr;
              adj4 = -16667 * refr;
              adj5 = 112500 * refr;
              adj6 = -46667 * refr;
            }
            y1 = h * adj1 / cnstVal1;
            x1 = w * adj2 / cnstVal1;
            y2 = h * adj3 / cnstVal1;
            x2 = w * adj4 / cnstVal1;
            y3 = h * adj5 / cnstVal1;
            x3 = w * adj6 / cnstVal1;
            pathData = `${baseRect} M ${x1},${y1} L ${x2},${y2} L ${x3},${y3} M ${x1},0 L ${x1},${h}`;
            break;
          case "accentBorderCallout3":
          case "accentCallout3":
            if (!shapAdjst_ary) {
              adj1 = 18750 * refr;
              adj2 = -8333 * refr;
              adj3 = 18750 * refr;
              adj4 = -16667 * refr;
              adj5 = 1e5 * refr;
              adj6 = -16667 * refr;
              adj7 = 112963 * refr;
              adj8 = -8333 * refr;
            }
            y1 = h * adj1 / cnstVal1;
            x1 = w * adj2 / cnstVal1;
            y2 = h * adj3 / cnstVal1;
            x2 = w * adj4 / cnstVal1;
            y3 = h * adj5 / cnstVal1;
            x3 = w * adj6 / cnstVal1;
            y4 = h * adj7 / cnstVal1;
            x4 = w * adj8 / cnstVal1;
            pathData = `${baseRect} M ${x1},${y1} L ${x2},${y2} L ${x3},${y3} L ${x4},${y4} M ${x1},0 L ${x1},${h}`;
            break;
          default:
        }
      }
      break;
    case "leftRightRibbon":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        const refr = RATIO_EMUs_Points;
        let adj1 = 5e4 * refr;
        let adj2 = 5e4 * refr;
        let adj3 = 16667 * refr;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            }
          }
        }
        const cnstVal1 = 33333 * refr;
        const cnstVal2 = 1e5 * refr;
        const cnstVal3 = 2e5 * refr;
        const cnstVal4 = 4e5 * refr;
        const ss = Math.min(w, h);
        const hc = w / 2, vc = h / 2;
        const a3 = adj3 < 0 ? 0 : adj3 > cnstVal1 ? cnstVal1 : adj3;
        const maxAdj1 = cnstVal2 - a3;
        const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
        const w1 = hc - w / 32;
        const maxAdj2 = cnstVal2 * w1 / ss;
        const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
        const x1 = ss * a2 / cnstVal2;
        const x4 = w - x1;
        const dy1 = h * a1 / cnstVal3;
        const dy2 = h * a3 / -cnstVal3;
        const ly1 = vc + dy2 - dy1;
        const ry4 = vc + dy1 - dy2;
        const ly2 = ly1 + dy1;
        const ry3 = h - ly2;
        const ly4 = ly2 * 2;
        const ry2 = h - (ly4 - ly1);
        const hR = a3 * ss / cnstVal4;
        const x2 = hc - w / 32;
        const x3 = hc + w / 32;
        const y1 = ly1 + hR;
        const y2_arc = ry2 - hR;
        pathData = `M 0,${ly2} L ${x1},0 L ${x1},${ly1} L ${hc},${ly1} ${shapeArc2(hc, y1, w / 32, hR, 270, 450, false).replace("M", "L")} ${shapeArc2(hc, y2_arc, w / 32, hR, 270, 90, false).replace("M", "L")} L ${x4},${ry2} L ${x4},${h - ly4} L ${w},${ry3} L ${x4},${h} L ${x4},${ry4} L ${hc},${ry4} ${shapeArc2(hc, ry4 - hR, w / 32, hR, 90, 180, false).replace("M", "L")} L ${x2},${ly4 - ly1} L ${x1},${ly4 - ly1} L ${x1},${ly4} z M ${x3},${y1} L ${x3},${ry2} M ${x2},${y2_arc} L ${x2},${ly4 - ly1}`;
      }
      break;
    case "ribbon":
    case "ribbon2":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 16667 * RATIO_EMUs_Points;
        let adj2 = 5e4 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const cnstVal1 = 25e3 * RATIO_EMUs_Points;
        const cnstVal2 = 33333 * RATIO_EMUs_Points;
        const cnstVal3 = 75e3 * RATIO_EMUs_Points;
        const cnstVal4 = 1e5 * RATIO_EMUs_Points;
        const cnstVal5 = 2e5 * RATIO_EMUs_Points;
        const cnstVal6 = 4e5 * RATIO_EMUs_Points;
        const hc = w / 2, t = 0, l = 0, b = h, r = w, wd8 = w / 8, wd32 = w / 32;
        const a1 = adj1 < 0 ? 0 : adj1 > cnstVal2 ? cnstVal2 : adj1;
        const a2 = adj2 < cnstVal1 ? cnstVal1 : adj2 > cnstVal3 ? cnstVal3 : adj2;
        const x10 = r - wd8;
        const dx2 = w * a2 / cnstVal5;
        const x2 = hc - dx2;
        const x9 = hc + dx2;
        const x3 = x2 + wd32;
        const x8 = x9 - wd32;
        const x5 = x2 + wd8;
        const x6 = x9 - wd8;
        const x4 = x5 - wd32;
        const x7 = x6 + wd32;
        const hR = h * a1 / cnstVal6;
        if (shapType === "ribbon2") {
          const dy1 = h * a1 / cnstVal5;
          const y1 = b - dy1;
          const dy2 = h * a1 / cnstVal4;
          const y2 = b - dy2;
          const y4 = t + dy2;
          const y3 = (y4 + b) / 2;
          const y6 = b - hR;
          const y7 = y1 - hR;
          pathData = `M ${l},${b} L ${wd8},${y3} L ${l},${y4} L ${x2},${y4} L ${x2},${hR} ${shapeArc2(x3, hR, wd32, hR, 180, 270, false).replace("M", "L")} L ${x8},${t} ${shapeArc2(x8, hR, wd32, hR, 270, 360, false).replace("M", "L")} L ${x9},${y4} L ${r},${y4} L ${x10},${y3} L ${r},${b} L ${x7},${b} ${shapeArc2(x7, y6, wd32, hR, 90, 270, false).replace("M", "L")} L ${x8},${y1} ${shapeArc2(x8, y7, wd32, hR, 90, -90, false).replace("M", "L")} L ${x3},${y2} ${shapeArc2(x3, y7, wd32, hR, 270, 90, false).replace("M", "L")} L ${x4},${y1} ${shapeArc2(x4, y6, wd32, hR, 270, 450, false).replace("M", "L")} z M ${x5},${y2} L ${x5},${y6} M ${x6},${y6} L ${x6},${y2} M ${x2},${y7} L ${x2},${y4} M ${x9},${y4} L ${x9},${y7}`;
        } else if (shapType === "ribbon") {
          const y1 = h * a1 / cnstVal5;
          const y2 = h * a1 / cnstVal4;
          const y4 = b - y2;
          const y3 = y4 / 2;
          const y5 = b - hR;
          const y6 = y2 - hR;
          pathData = `M ${l},${t} L ${x4},${t} ${shapeArc2(x4, hR, wd32, hR, 270, 450, false).replace("M", "L")} L ${x3},${y1} ${shapeArc2(x3, y6, wd32, hR, 270, 90, false).replace("M", "L")} L ${x8},${y2} ${shapeArc2(x8, y6, wd32, hR, 90, -90, false).replace("M", "L")} L ${x7},${y1} ${shapeArc2(x7, hR, wd32, hR, 90, 270, false).replace("M", "L")} L ${r},${t} L ${x10},${y3} L ${r},${y4} L ${x9},${y4} L ${x9},${y5} ${shapeArc2(x8, y5, wd32, hR, 0, 90, false).replace("M", "L")} L ${x3},${b} ${shapeArc2(x3, y5, wd32, hR, 90, 180, false).replace("M", "L")} L ${x2},${y4} L ${l},${y4} L ${wd8},${y3} z M ${x5},${hR} L ${x5},${y2} M ${x6},${y2} L ${x6},${hR} M ${x2},${y4} L ${x2},${y6} M ${x9},${y6} L ${x9},${y4}`;
        }
      }
      break;
    case "doubleWave":
    case "wave":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = shapType === "doubleWave" ? 6250 * RATIO_EMUs_Points : 12500 * RATIO_EMUs_Points;
        let adj2 = 0;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const cnstVal2 = -1e4 * RATIO_EMUs_Points;
        const cnstVal3 = 5e4 * RATIO_EMUs_Points;
        const cnstVal4 = 1e5 * RATIO_EMUs_Points;
        const l = 0, b = h, r = w;
        if (shapType === "doubleWave") {
          const cnstVal1 = 12500 * RATIO_EMUs_Points;
          const a1 = adj1 < 0 ? 0 : adj1 > cnstVal1 ? cnstVal1 : adj1;
          const a2 = adj2 < cnstVal2 ? cnstVal2 : adj2 > cnstVal4 ? cnstVal4 : adj2;
          const y1 = h * a1 / cnstVal4;
          const dy2 = y1 * 10 / 3;
          const y2 = y1 - dy2;
          const y3 = y1 + dy2;
          const y4 = b - y1;
          const y5 = y4 - dy2;
          const y6 = y4 + dy2;
          const of2 = w * a2 / cnstVal3;
          const dx2 = of2 > 0 ? 0 : of2;
          const x2 = l - dx2;
          const dx8 = of2 > 0 ? of2 : 0;
          const x8 = r - dx8;
          const dx3 = (dx2 + x8) / 6;
          const x3 = x2 + dx3;
          const dx4 = (dx2 + x8) / 3;
          const x4 = x2 + dx4;
          const x5 = (x2 + x8) / 2;
          const x6 = x5 + dx3;
          const x7 = (x6 + x8) / 2;
          const x9 = l + dx8;
          const x15 = r + dx2;
          const x10 = x9 + dx3;
          const x11 = x9 + dx4;
          const x12 = (x9 + x15) / 2;
          const x13 = x12 + dx3;
          const x14 = (x13 + x15) / 2;
          pathData = `M ${x2},${y1} C ${x3},${y2} ${x4},${y3} ${x5},${y1} C ${x6},${y2} ${x7},${y3} ${x8},${y1} L ${x15},${y4} C ${x14},${y6} ${x13},${y5} ${x12},${y4} C ${x11},${y6} ${x10},${y5} ${x9},${y4} z`;
        } else if (shapType === "wave") {
          const cnstVal5 = 2e4 * RATIO_EMUs_Points;
          const a1 = adj1 < 0 ? 0 : adj1 > cnstVal5 ? cnstVal5 : adj1;
          const a2 = adj2 < cnstVal2 ? cnstVal2 : adj2 > cnstVal4 ? cnstVal4 : adj2;
          const y1 = h * a1 / cnstVal4;
          const dy2 = y1 * 10 / 3;
          const y2 = y1 - dy2;
          const y3 = y1 + dy2;
          const y4 = b - y1;
          const y5 = y4 - dy2;
          const y6 = y4 + dy2;
          const of2 = w * a2 / cnstVal3;
          const dx2 = of2 > 0 ? 0 : of2;
          const x2 = l - dx2;
          const dx5 = of2 > 0 ? of2 : 0;
          const x5 = r - dx5;
          const dx3 = (dx2 + x5) / 3;
          const x3 = x2 + dx3;
          const x4 = (x3 + x5) / 2;
          const x6 = l + dx5;
          const x10 = r + dx2;
          const x7 = x6 + dx3;
          const x8 = (x7 + x10) / 2;
          pathData = `M ${x2},${y1} C ${x3},${y2} ${x4},${y3} ${x5},${y1} L ${x10},${y4} C ${x8},${y6} ${x7},${y5} ${x6},${y4} z`;
        }
      }
      break;
    case "ellipseRibbon":
    case "ellipseRibbon2":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 25e3 * RATIO_EMUs_Points;
        let adj2 = 5e4 * RATIO_EMUs_Points;
        let adj3 = 12500 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const cnstVal1 = 25e3 * RATIO_EMUs_Points;
        const cnstVal3 = 75e3 * RATIO_EMUs_Points;
        const cnstVal4 = 1e5 * RATIO_EMUs_Points;
        const cnstVal5 = 2e5 * RATIO_EMUs_Points;
        const hc = w / 2, t = 0, l = 0, b = h, r = w, wd8 = w / 8;
        const a1 = adj1 < 0 ? 0 : adj1 > cnstVal4 ? cnstVal4 : adj1;
        const a2 = adj2 < cnstVal1 ? cnstVal1 : adj2 > cnstVal3 ? cnstVal3 : adj2;
        const q10 = cnstVal4 - a1;
        const minAdj3 = a1 - q10 / 2 > 0 ? a1 - q10 / 2 : 0;
        const a3 = adj3 < minAdj3 ? minAdj3 : adj3 > a1 ? a1 : adj3;
        const dx2 = w * a2 / cnstVal5;
        const x2 = hc - dx2;
        const x3 = x2 + wd8;
        const x4 = r - x3;
        const x5 = r - x2;
        const x6 = r - wd8;
        const dy1 = h * a3 / cnstVal4;
        const f1 = 4 * dy1 / w;
        const q2 = x3 - x3 * x3 / w;
        const cx1 = x3 / 2;
        const cx2 = r - cx1;
        const q1_h = h * a1 / cnstVal4;
        const dy3 = q1_h - dy1;
        const q4 = x2 - x2 * x2 / w;
        const q5 = f1 * q4;
        const rh = b - q1_h;
        const q8 = dy1 * 14 / 16;
        const cx4 = x2 / 2;
        const q9 = f1 * cx4;
        const cx5 = r - cx4;
        if (shapType === "ellipseRibbon") {
          const y1 = f1 * q2;
          const cy1 = f1 * cx1;
          const y3 = q5 + dy3;
          const q6 = dy1 + dy3 - y3;
          const cy3 = q6 + dy1 + dy3;
          const y2 = (q8 + rh) / 2;
          const y5 = q5 + rh;
          const y6 = y3 + rh;
          const cy4 = q9 + rh;
          const cy6 = cy3 + rh;
          const y7 = y1 + dy3;
          pathData = `M ${l},${t} Q ${cx1},${cy1} ${x3},${y1} L ${x2},${y3} Q ${hc},${cy3} ${x5},${y3} L ${x4},${y1} Q ${cx2},${cy1} ${r},${t} L ${x6},${y2} L ${r},${rh} Q ${cx5},${cy4} ${x5},${y5} L ${x5},${y6} Q ${hc},${cy6} ${x2},${y6} L ${x2},${y5} Q ${cx4},${cy4} ${l},${rh} L ${wd8},${y2} z M ${x2},${y5} L ${x2},${y3} M ${x5},${y3} L ${x5},${y5} M ${x3},${y1} L ${x3},${y7} M ${x4},${y7} L ${x4},${y1}`;
        } else if (shapType === "ellipseRibbon2") {
          const u1 = f1 * q2;
          const y1 = b - u1;
          const cu1 = f1 * cx1;
          const cy1 = b - cu1;
          const u3 = q5 + dy3;
          const y3 = b - u3;
          const q6 = dy1 + dy3 - u3;
          const cu3 = q6 + dy1 + dy3;
          const cy3 = b - cu3;
          const u2 = (q8 + rh) / 2;
          const y2 = b - u2;
          const u5 = q5 + rh;
          const y5 = b - u5;
          const u6 = u3 + rh;
          const y6 = b - u6;
          const cu4 = q9 + rh;
          const cy4 = b - cu4;
          const cu6 = cu3 + rh;
          const cy6 = b - cu6;
          const u7 = u1 + dy3;
          const y7 = b - u7;
          pathData = `M ${l},${b} L ${wd8},${y2} L ${l},${q1_h} Q ${cx4},${cy4} ${x2},${y5} L ${x2},${y6} Q ${hc},${cy6} ${x5},${y6} L ${x5},${y5} Q ${cx5},${cy4} ${r},${q1_h} L ${x6},${y2} L ${r},${b} Q ${cx2},${cy1} ${x4},${y1} L ${x5},${y3} Q ${hc},${cy3} ${x2},${y3} L ${x3},${y1} Q ${cx1},${cy1} ${l},${b} z M ${x2},${y3} L ${x2},${y5} M ${x5},${y5} L ${x5},${y3} M ${x3},${y7} L ${x3},${y1} M ${x4},${y1} L ${x4},${y7}`;
        }
      }
      break;
    case "line":
    case "straightConnector1":
    case "bentConnector4":
    case "bentConnector5":
    case "curvedConnector2":
    case "curvedConnector3":
    case "curvedConnector4":
    case "curvedConnector5":
      pathData = `M 0 0 L ${w} ${h}`;
      break;
    case "rightArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let sAdj1_val = 0.25;
        let sAdj2_val = 0.5;
        if (shapAdjst_ary) {
          const max_sAdj2_const = w / h;
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              sAdj1_val = 0.5 - parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 2e5;
            } else if (sAdj_name === "adj2") {
              const sAdj2_val2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 1e5;
              sAdj2_val = 1 - sAdj2_val2 / max_sAdj2_const;
            }
          }
        }
        pathData = `M ${w} ${h / 2} L ${sAdj2_val * w} 0 L ${sAdj2_val * w} ${sAdj1_val * h} L 0 ${sAdj1_val * h} L 0 ${(1 - sAdj1_val) * h} L ${sAdj2_val * w} ${(1 - sAdj1_val) * h} L ${sAdj2_val * w} ${h} Z`;
      }
      break;
    case "leftArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let sAdj1_val = 0.25;
        let sAdj2_val = 0.5;
        if (shapAdjst_ary) {
          const max_sAdj2_const = w / h;
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              sAdj1_val = 0.5 - parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 2e5;
            } else if (sAdj_name === "adj2") {
              const sAdj2_val2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 1e5;
              sAdj2_val = sAdj2_val2 / max_sAdj2_const;
            }
          }
        }
        pathData = `M 0 ${h / 2} L ${sAdj2_val * w} ${h} L ${sAdj2_val * w} ${(1 - sAdj1_val) * h} L ${w} ${(1 - sAdj1_val) * h} L ${w} ${sAdj1_val * h} L ${sAdj2_val * w} ${sAdj1_val * h} L ${sAdj2_val * w} 0 Z`;
      }
      break;
    case "downArrow":
    case "flowChartOffpageConnector":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let sAdj1_val = 0.25;
        let sAdj2_val = 0.5;
        if (shapAdjst_ary) {
          const max_sAdj2_const = h / w;
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              sAdj1_val = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 2e5;
            } else if (sAdj_name === "adj2") {
              const sAdj2_val2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 1e5;
              sAdj2_val = sAdj2_val2 / max_sAdj2_const;
            }
          }
        }
        if (shapType === "flowChartOffpageConnector") {
          sAdj1_val = 0.5;
          sAdj2_val = 0.212;
        }
        pathData = `M ${(0.5 - sAdj1_val) * w} 0 L ${(0.5 - sAdj1_val) * w} ${(1 - sAdj2_val) * h} L 0 ${(1 - sAdj2_val) * h} L ${w / 2} ${h} L ${w} ${(1 - sAdj2_val) * h} L ${(0.5 + sAdj1_val) * w} ${(1 - sAdj2_val) * h} L ${(0.5 + sAdj1_val) * w} 0 Z`;
      }
      break;
    case "upArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let sAdj1_val = 0.25;
        let sAdj2_val = 0.5;
        if (shapAdjst_ary) {
          const max_sAdj2_const = h / w;
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              sAdj1_val = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 2e5;
            } else if (sAdj_name === "adj2") {
              const sAdj2_val2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 1e5;
              sAdj2_val = sAdj2_val2 / max_sAdj2_const;
            }
          }
        }
        pathData = `M ${w / 2} 0 L 0 ${sAdj2_val * h} L ${(0.5 - sAdj1_val) * w} ${sAdj2_val * h} L ${(0.5 - sAdj1_val) * w} ${h} L ${(0.5 + sAdj1_val) * w} ${h} L ${(0.5 + sAdj1_val) * w} ${sAdj2_val * h} L ${w} ${sAdj2_val * h} Z`;
      }
      break;
    case "leftRightArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let sAdj1_val = 0.25;
        let sAdj2_val = 0.25;
        if (shapAdjst_ary) {
          const max_sAdj2_const = w / h;
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              sAdj1_val = 0.5 - parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 2e5;
            } else if (sAdj_name === "adj2") {
              const sAdj2_val2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 1e5;
              sAdj2_val = sAdj2_val2 / max_sAdj2_const;
            }
          }
        }
        pathData = `M 0 ${h / 2} L ${sAdj2_val * w} ${h} L ${sAdj2_val * w} ${(1 - sAdj1_val) * h} L ${(1 - sAdj2_val) * w} ${(1 - sAdj1_val) * h} L ${(1 - sAdj2_val) * w} ${h} L ${w} ${h / 2} L ${(1 - sAdj2_val) * w} 0 L ${(1 - sAdj2_val) * w} ${sAdj1_val * h} L ${sAdj2_val * w} ${sAdj1_val * h} L ${sAdj2_val * w} 0 Z`;
      }
      break;
    case "upDownArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let sAdj1_val = 0.25;
        let sAdj2_val = 0.25;
        if (shapAdjst_ary) {
          const max_sAdj2_const = h / w;
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              sAdj1_val = 0.5 - parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 2e5;
            } else if (sAdj_name === "adj2") {
              const sAdj2_val2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 1e5;
              sAdj2_val = sAdj2_val2 / max_sAdj2_const;
            }
          }
        }
        pathData = `M ${w / 2} 0 L 0 ${sAdj2_val * h} L ${sAdj1_val * w} ${sAdj2_val * h} L ${sAdj1_val * w} ${(1 - sAdj2_val) * h} L 0 ${(1 - sAdj2_val) * h} L ${w / 2} ${h} L ${w} ${(1 - sAdj2_val) * h} L ${(1 - sAdj1_val) * w} ${(1 - sAdj2_val) * h} L ${(1 - sAdj1_val) * w} ${sAdj2_val * h} L ${w} ${sAdj2_val * h} Z`;
      }
      break;
    case "quadArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 22500 * RATIO_EMUs_Points;
        let adj2 = 22500 * RATIO_EMUs_Points;
        let adj3 = 22500 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        const cnstVal3 = 2e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const vc = h / 2, hc = w / 2;
        const minWH = Math.min(w, h);
        const a2 = adj2 < 0 ? 0 : adj2 > cnstVal1 ? cnstVal1 : adj2;
        const maxAdj1 = 2 * a2;
        const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
        const q1 = cnstVal2 - maxAdj1;
        const maxAdj3 = q1 / 2;
        const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
        const x1 = minWH * a3 / cnstVal2;
        const dx2 = minWH * a2 / cnstVal2;
        const x2 = hc - dx2;
        const x5 = hc + dx2;
        const dx3 = minWH * a1 / cnstVal3;
        const x3 = hc - dx3;
        const x4 = hc + dx3;
        const x6 = w - x1;
        const y2 = vc - dx2;
        const y5 = vc + dx2;
        const y3 = vc - dx3;
        const y4 = vc + dx3;
        const y6 = h - x1;
        pathData = `M 0,${vc} L ${x1},${y2} L ${x1},${y3} L ${x3},${y3} L ${x3},${x1} L ${x2},${x1} L ${hc},0 L ${x5},${x1} L ${x4},${x1} L ${x4},${y3} L ${x6},${y3} L ${x6},${y2} L ${w},${vc} L ${x6},${y5} L ${x6},${y4} L ${x4},${y4} L ${x4},${y6} L ${x5},${y6} L ${hc},${h} L ${x2},${y6} L ${x3},${y6} L ${x3},${y4} L ${x1},${y4} L ${x1},${y5} z`;
      }
      break;
    case "leftRightUpArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 25e3 * RATIO_EMUs_Points;
        let adj2 = 25e3 * RATIO_EMUs_Points;
        let adj3 = 25e3 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        const cnstVal3 = 2e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const hc = w / 2;
        const minWH = Math.min(w, h);
        const a2 = adj2 < 0 ? 0 : adj2 > cnstVal1 ? cnstVal1 : adj2;
        const maxAdj1 = 2 * a2;
        const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
        const q1 = cnstVal2 - maxAdj1;
        const maxAdj3 = q1 / 2;
        const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
        const x1 = minWH * a3 / cnstVal2;
        const dx2 = minWH * a2 / cnstVal2;
        const x2 = hc - dx2;
        const x5 = hc + dx2;
        const dx3 = minWH * a1 / cnstVal3;
        const x3 = hc - dx3;
        const x4 = hc + dx3;
        const x6 = w - x1;
        const dy2 = minWH * a2 / cnstVal1;
        const y2 = h - dy2;
        const y4 = h - dx2;
        const y3 = y4 - dx3;
        const y5 = y4 + dx3;
        pathData = `M 0,${y4} L ${x1},${y2} L ${x1},${y3} L ${x3},${y3} L ${x3},${x1} L ${x2},${x1} L ${hc},0 L ${x5},${x1} L ${x4},${x1} L ${x4},${y3} L ${x6},${y3} L ${x6},${y2} L ${w},${y4} L ${x6},${h} L ${x6},${y5} L ${x1},${y5} L ${x1},${h} z`;
      }
      break;
    case "leftUpArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 25e3 * RATIO_EMUs_Points;
        let adj2 = 25e3 * RATIO_EMUs_Points;
        let adj3 = 25e3 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        const cnstVal3 = 2e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const minWH = Math.min(w, h);
        const a2 = adj2 < 0 ? 0 : adj2 > cnstVal1 ? cnstVal1 : adj2;
        const maxAdj1 = 2 * a2;
        const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
        const maxAdj3 = cnstVal2 - maxAdj1;
        const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
        const x1 = minWH * a3 / cnstVal2;
        const dx2 = minWH * a2 / cnstVal1;
        const x2 = w - dx2;
        const y2 = h - dx2;
        const dx4 = minWH * a2 / cnstVal2;
        const x4 = w - dx4;
        const y4 = h - dx4;
        const dx3 = minWH * a1 / cnstVal3;
        const x3 = x4 - dx3;
        const x5 = x4 + dx3;
        const y3 = y4 - dx3;
        const y5 = y4 + dx3;
        pathData = `M 0,${y4} L ${x1},${y2} L ${x1},${y3} L ${x3},${y3} L ${x3},${x1} L ${x2},${x1} L ${x4},0 L ${w},${x1} L ${x5},${x1} L ${x5},${y5} L ${x1},${y5} L ${x1},${h} z`;
      }
      break;
    case "bentUpArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 25e3 * RATIO_EMUs_Points;
        let adj2 = 25e3 * RATIO_EMUs_Points;
        let adj3 = 25e3 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        const cnstVal3 = 2e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const minWH = Math.min(w, h);
        const a1 = adj1 < 0 ? 0 : adj1 > cnstVal1 ? cnstVal1 : adj1;
        const a2 = adj2 < 0 ? 0 : adj2 > cnstVal1 ? cnstVal1 : adj2;
        const a3 = adj3 < 0 ? 0 : adj3 > cnstVal1 ? cnstVal1 : adj3;
        const y1 = minWH * a3 / cnstVal2;
        const dx1 = minWH * a2 / cnstVal1;
        const x1 = w - dx1;
        const dx3 = minWH * a2 / cnstVal2;
        const x3 = w - dx3;
        const dx2 = minWH * a1 / cnstVal3;
        const x2 = x3 - dx2;
        const x4 = x3 + dx2;
        const dy2 = minWH * a1 / cnstVal2;
        const y2 = h - dy2;
        pathData = `M 0,${y2} L ${x2},${y2} L ${x2},${y1} L ${x1},${y1} L ${x3},0 L ${w},${y1} L ${x4},${y1} L ${x4},${h} L 0,${h} z`;
      }
      break;
    case "bentArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 25e3 * RATIO_EMUs_Points;
        let adj2 = 25e3 * RATIO_EMUs_Points;
        let adj3 = 25e3 * RATIO_EMUs_Points;
        let adj4 = 43750 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj4") {
              adj4 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const minWH = Math.min(w, h);
        const a2 = adj2 < 0 ? 0 : adj2 > cnstVal1 ? cnstVal1 : adj2;
        const maxAdj1 = 2 * a2;
        const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
        const a3 = adj3 < 0 ? 0 : adj3 > cnstVal1 ? cnstVal1 : adj3;
        const th = minWH * a1 / cnstVal2;
        const aw2 = minWH * a2 / cnstVal2;
        const th2 = th / 2;
        const dh2 = aw2 - th2;
        const ah = minWH * a3 / cnstVal2;
        const bw = w - ah;
        const bh = h - dh2;
        const bs = bw < bh ? bw : bh;
        const maxAdj4 = cnstVal2 * bs / minWH;
        const a4 = adj4 < 0 ? 0 : adj4 > maxAdj4 ? maxAdj4 : adj4;
        const bd = minWH * a4 / cnstVal2;
        const bd3 = bd - th;
        const bd2 = bd3 > 0 ? bd3 : 0;
        const x3 = th + bd2;
        const x4 = w - ah;
        const y3 = dh2 + th;
        const y4 = y3 + dh2;
        const y5 = dh2 + bd;
        const y6 = y3 + bd2;
        pathData = `M 0,${h} L 0,${y5} ${shapeArc2(bd, y5, bd, bd, 180, 270, false).replace("M", "L")} L ${x4},${dh2} L ${x4},0 L ${w},${aw2} L ${x4},${y4} L ${x4},${y3} L ${x3},${y3} ${shapeArc2(x3, y6, bd2, bd2, 270, 180, false).replace("M", "L")} L ${th},${h} z`;
      }
      break;
    case "uturnArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 25e3 * RATIO_EMUs_Points;
        let adj2 = 25e3 * RATIO_EMUs_Points;
        let adj3 = 25e3 * RATIO_EMUs_Points;
        let adj4 = 43750 * RATIO_EMUs_Points;
        let adj5 = 75e3 * RATIO_EMUs_Points;
        const cnstVal1 = 25e3 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj4") {
              adj4 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj5") {
              adj5 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const minWH = Math.min(w, h);
        const a2 = adj2 < 0 ? 0 : adj2 > cnstVal1 ? cnstVal1 : adj2;
        const maxAdj1 = 2 * a2;
        const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
        const q2 = a1 * minWH / h;
        const q3 = cnstVal2 - q2;
        const maxAdj3 = q3 * h / minWH;
        const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
        const q1 = a3 + a1;
        const minAdj5 = q1 * minWH / h;
        const a5 = adj5 < minAdj5 ? minAdj5 : adj5 > cnstVal2 ? cnstVal2 : adj5;
        const th = minWH * a1 / cnstVal2;
        const aw2 = minWH * a2 / cnstVal2;
        const th2 = th / 2;
        const dh2 = aw2 - th2;
        const y5 = h * a5 / cnstVal2;
        const ah = minWH * a3 / cnstVal2;
        const y4 = y5 - ah;
        const x9 = w - dh2;
        const bw = x9 / 2;
        const bs = bw < y4 ? bw : y4;
        const maxAdj4 = cnstVal2 * bs / minWH;
        const a4 = adj4 < 0 ? 0 : adj4 > maxAdj4 ? maxAdj4 : adj4;
        const bd = minWH * a4 / cnstVal2;
        const bd3 = bd - th;
        const bd2 = bd3 > 0 ? bd3 : 0;
        const x3 = th + bd2;
        const x8 = w - aw2;
        const x6 = x8 - aw2;
        const x7 = x6 + dh2;
        const x4 = x9 - bd;
        const x5 = x7 - bd2;
        pathData = `M 0,${h} L 0,${bd} ${shapeArc2(bd, bd, bd, bd, 180, 270, false).replace("M", "L")} L ${x4},0 ${shapeArc2(x4, bd, bd, bd, 270, 360, false).replace("M", "L")} L ${x9},${y4} L ${w},${y4} L ${x8},${y5} L ${x6},${y4} L ${x7},${y4} L ${x7},${x3} ${shapeArc2(x5, x3, bd2, bd2, 0, -90, false).replace("M", "L")} L ${x3},${th} ${shapeArc2(x3, x3, bd2, bd2, 270, 180, false).replace("M", "L")} L ${th},${h} z`;
      }
      break;
    case "stripedRightArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 5e4 * RATIO_EMUs_Points;
        let adj2 = 5e4 * RATIO_EMUs_Points;
        const cnstVal1 = 1e5 * RATIO_EMUs_Points;
        const cnstVal2 = 2e5 * RATIO_EMUs_Points;
        const cnstVal3 = 84375 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const vc = h / 2;
        const minWH = Math.min(w, h);
        const maxAdj2 = cnstVal3 * w / minWH;
        const a1 = adj1 < 0 ? 0 : adj1 > cnstVal1 ? cnstVal1 : adj1;
        const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
        const x4 = minWH * 5 / 32;
        const dx5 = minWH * a2 / cnstVal1;
        const x5 = w - dx5;
        const dy1 = h * a1 / cnstVal2;
        const y1 = vc - dy1;
        const y2 = vc + dy1;
        const ssd8 = minWH / 8, ssd16 = minWH / 16, ssd32 = minWH / 32;
        pathData = `M 0,${y1} L ${ssd32},${y1} L ${ssd32},${y2} L 0,${y2} z M ${ssd16},${y1} L ${ssd8},${y1} L ${ssd8},${y2} L ${ssd16},${y2} z M ${x4},${y1} L ${x5},${y1} L ${x5},0 L ${w},${vc} L ${x5},${h} L ${x5},${y2} L ${x4},${y2} z`;
      }
      break;
    case "notchedRightArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 5e4 * RATIO_EMUs_Points;
        let adj2 = 5e4 * RATIO_EMUs_Points;
        const cnstVal1 = 1e5 * RATIO_EMUs_Points;
        const cnstVal2 = 2e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const vc = h / 2, hd2 = vc;
        const minWH = Math.min(w, h);
        const maxAdj2 = cnstVal1 * w / minWH;
        const a1 = adj1 < 0 ? 0 : adj1 > cnstVal1 ? cnstVal1 : adj1;
        const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
        const dx2 = minWH * a2 / cnstVal1;
        const x2 = w - dx2;
        const dy1 = h * a1 / cnstVal2;
        const y1 = vc - dy1;
        const y2 = vc + dy1;
        const x1 = dy1 * dx2 / hd2;
        pathData = `M 0,${y1} L ${x2},${y1} L ${x2},0 L ${w},${vc} L ${x2},${h} L ${x2},${y2} L 0,${y2} L ${x1},${vc} z`;
      }
      break;
    case "homePlate":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let adj = 5e4 * RATIO_EMUs_Points;
        const cnstVal1 = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst) {
          adj = parseInt(shapAdjst.substring(4)) * RATIO_EMUs_Points;
        }
        const vc = h / 2;
        const minWH = Math.min(w, h);
        const maxAdj = cnstVal1 * w / minWH;
        const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
        const dx1 = minWH * a / cnstVal1;
        const x1 = w - dx1;
        pathData = `M 0,0 L ${x1},0 L ${w},${vc} L ${x1},${h} L 0,${h} z`;
      }
      break;
    case "chevron":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let adj = 5e4 * RATIO_EMUs_Points;
        const cnstVal1 = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst) {
          adj = parseInt(shapAdjst.substring(4)) * RATIO_EMUs_Points;
        }
        const vc = h / 2;
        const minWH = Math.min(w, h);
        const maxAdj = cnstVal1 * w / minWH;
        const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
        const x1 = minWH * a / cnstVal1;
        const x2 = w - x1;
        pathData = `M 0,0 L ${x2},0 L ${w},${vc} L ${x2},${h} L 0,${h} L ${x1},${vc} z`;
      }
      break;
    case "rightArrowCallout":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 25e3 * RATIO_EMUs_Points;
        let adj2 = 25e3 * RATIO_EMUs_Points;
        let adj3 = 25e3 * RATIO_EMUs_Points;
        let adj4 = 64977 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        const cnstVal3 = 2e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj4") {
              adj4 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const vc = h / 2, r = w, b = h, l = 0, t = 0;
        const ss = Math.min(w, h);
        const maxAdj2 = cnstVal1 * h / ss;
        const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
        const maxAdj1 = a2 * 2;
        const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
        const maxAdj3 = cnstVal2 * w / ss;
        const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
        const q2 = a3 * ss / w;
        const maxAdj4 = cnstVal2 - q2;
        const a4 = adj4 < 0 ? 0 : adj4 > maxAdj4 ? maxAdj4 : adj4;
        const dy1 = ss * a2 / cnstVal2;
        const dy2 = ss * a1 / cnstVal3;
        const y1 = vc - dy1;
        const y2 = vc - dy2;
        const y3 = vc + dy2;
        const y4 = vc + dy1;
        const dx3 = ss * a3 / cnstVal2;
        const x3 = r - dx3;
        const x2 = w * a4 / cnstVal2;
        pathData = `M ${l},${t} L ${x2},${t} L ${x2},${y2} L ${x3},${y2} L ${x3},${y1} L ${r},${vc} L ${x3},${y4} L ${x3},${y3} L ${x2},${y3} L ${x2},${b} L ${l},${b} z`;
      }
      break;
    case "downArrowCallout":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 25e3 * RATIO_EMUs_Points;
        let adj2 = 25e3 * RATIO_EMUs_Points;
        let adj3 = 25e3 * RATIO_EMUs_Points;
        let adj4 = 64977 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        const cnstVal3 = 2e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj4") {
              adj4 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const hc = w / 2, r = w, b = h, l = 0, t = 0;
        const ss = Math.min(w, h);
        const maxAdj2 = cnstVal1 * w / ss;
        const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
        const maxAdj1 = a2 * 2;
        const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
        const maxAdj3 = cnstVal2 * h / ss;
        const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
        const q2 = a3 * ss / h;
        const maxAdj4 = cnstVal2 - q2;
        const a4 = adj4 < 0 ? 0 : adj4 > maxAdj4 ? maxAdj4 : adj4;
        const dx1 = ss * a2 / cnstVal2;
        const dx2 = ss * a1 / cnstVal3;
        const x1 = hc - dx1;
        const x2 = hc - dx2;
        const x3 = hc + dx2;
        const x4 = hc + dx1;
        const dy3 = ss * a3 / cnstVal2;
        const y3 = b - dy3;
        const y2 = h * a4 / cnstVal2;
        pathData = `M ${l},${t} L ${r},${t} L ${r},${y2} L ${x3},${y2} L ${x3},${y3} L ${x4},${y3} L ${hc},${b} L ${x1},${y3} L ${x2},${y3} L ${x2},${y2} L ${l},${y2} z`;
      }
      break;
    case "leftArrowCallout":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 25e3 * RATIO_EMUs_Points;
        let adj2 = 25e3 * RATIO_EMUs_Points;
        let adj3 = 25e3 * RATIO_EMUs_Points;
        let adj4 = 64977 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        const cnstVal3 = 2e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj4") {
              adj4 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const vc = h / 2, r = w, b = h, l = 0, t = 0;
        const ss = Math.min(w, h);
        const maxAdj2 = cnstVal1 * h / ss;
        const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
        const maxAdj1 = a2 * 2;
        const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
        const maxAdj3 = cnstVal2 * w / ss;
        const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
        const q2 = a3 * ss / w;
        const maxAdj4 = cnstVal2 - q2;
        const a4 = adj4 < 0 ? 0 : adj4 > maxAdj4 ? maxAdj4 : adj4;
        const dy1 = ss * a2 / cnstVal2;
        const dy2 = ss * a1 / cnstVal3;
        const y1 = vc - dy1;
        const y2 = vc - dy2;
        const y3 = vc + dy2;
        const y4 = vc + dy1;
        const x1 = ss * a3 / cnstVal2;
        const dx2 = w * a4 / cnstVal2;
        const x2 = r - dx2;
        pathData = `M ${l},${vc} L ${x1},${y1} L ${x1},${y2} L ${x2},${y2} L ${x2},${t} L ${r},${t} L ${r},${b} L ${x2},${b} L ${x2},${y3} L ${x1},${y3} L ${x1},${y4} z`;
      }
      break;
    case "upArrowCallout":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 25e3 * RATIO_EMUs_Points;
        let adj2 = 25e3 * RATIO_EMUs_Points;
        let adj3 = 25e3 * RATIO_EMUs_Points;
        let adj4 = 64977 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        const cnstVal3 = 2e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj4") {
              adj4 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const hc = w / 2, r = w, b = h, l = 0, t = 0;
        const ss = Math.min(w, h);
        const maxAdj2 = cnstVal1 * w / ss;
        const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
        const maxAdj1 = a2 * 2;
        const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
        const maxAdj3 = cnstVal2 * h / ss;
        const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
        const q2 = a3 * ss / h;
        const maxAdj4 = cnstVal2 - q2;
        const a4 = adj4 < 0 ? 0 : adj4 > maxAdj4 ? maxAdj4 : adj4;
        const dx1 = ss * a2 / cnstVal2;
        const dx2 = ss * a1 / cnstVal3;
        const x1 = hc - dx1;
        const x2 = hc - dx2;
        const x3 = hc + dx2;
        const x4 = hc + dx1;
        const y1 = ss * a3 / cnstVal2;
        const dy2 = h * a4 / cnstVal2;
        const y2 = b - dy2;
        pathData = `M ${l},${y2} L ${x2},${y2} L ${x2},${y1} L ${x1},${y1} L ${hc},${t} L ${x4},${y1} L ${x3},${y1} L ${x3},${y2} L ${r},${y2} L ${r},${b} L ${l},${b} z`;
      }
      break;
    case "leftRightArrowCallout":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 25e3 * RATIO_EMUs_Points;
        let adj2 = 25e3 * RATIO_EMUs_Points;
        let adj3 = 25e3 * RATIO_EMUs_Points;
        let adj4 = 48123 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        const cnstVal3 = 2e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj4") {
              adj4 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const vc = h / 2, hc = w / 2, r = w, b = h, l = 0, t = 0;
        const ss = Math.min(w, h);
        const maxAdj2 = cnstVal1 * h / ss;
        const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
        const maxAdj1 = a2 * 2;
        const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
        const maxAdj3 = cnstVal1 * w / ss;
        const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
        const q2 = a3 * ss / (w / 2);
        const maxAdj4 = cnstVal2 - q2;
        const a4 = adj4 < 0 ? 0 : adj4 > maxAdj4 ? maxAdj4 : adj4;
        const dy1 = ss * a2 / cnstVal2;
        const dy2 = ss * a1 / cnstVal3;
        const y1 = vc - dy1;
        const y2 = vc - dy2;
        const y3 = vc + dy2;
        const y4 = vc + dy1;
        const x1 = ss * a3 / cnstVal2;
        const x4 = r - x1;
        const dx2 = w * a4 / cnstVal3;
        const x2 = hc - dx2;
        const x3 = hc + dx2;
        pathData = `M ${l},${vc} L ${x1},${y1} L ${x1},${y2} L ${x2},${y2} L ${x2},${t} L ${x3},${t} L ${x3},${y2} L ${x4},${y2} L ${x4},${y1} L ${r},${vc} L ${x4},${y4} L ${x4},${y3} L ${x3},${y3} L ${x3},${b} L ${x2},${b} L ${x2},${y3} L ${x1},${y3} L ${x1},${y4} z`;
      }
      break;
    case "quadArrowCallout":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 18515 * RATIO_EMUs_Points;
        let adj2 = 18515 * RATIO_EMUs_Points;
        let adj3 = 18515 * RATIO_EMUs_Points;
        let adj4 = 48123 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        const cnstVal3 = 2e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj4") {
              adj4 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const vc = h / 2, hc = w / 2, r = w, b = h, l = 0, t = 0;
        const ss = Math.min(w, h);
        const a2 = adj2 < 0 ? 0 : adj2 > cnstVal1 ? cnstVal1 : adj2;
        const maxAdj1 = a2 * 2;
        const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
        const maxAdj3 = cnstVal1 - a2;
        const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
        const q2 = a3 * 2;
        const maxAdj4 = cnstVal2 - q2;
        const a4 = adj4 < a1 ? a1 : adj4 > maxAdj4 ? maxAdj4 : adj4;
        const dx2 = ss * a2 / cnstVal2;
        const dx3 = ss * a1 / cnstVal3;
        const ah = ss * a3 / cnstVal2;
        const dx1 = w * a4 / cnstVal3;
        const dy1 = h * a4 / cnstVal3;
        const x8 = r - ah;
        const x2 = hc - dx1;
        const x7 = hc + dx1;
        const x3 = hc - dx2;
        const x6 = hc + dx2;
        const x4 = hc - dx3;
        const x5 = hc + dx3;
        const y8 = b - ah;
        const y2 = vc - dy1;
        const y7 = vc + dy1;
        const y3 = vc - dx2;
        const y6 = vc + dx2;
        const y4 = vc - dx3;
        const y5 = vc + dx3;
        pathData = `M ${l},${vc} L ${ah},${y3} L ${ah},${y4} L ${x2},${y4} L ${x2},${y2} L ${x4},${y2} L ${x4},${ah} L ${x3},${ah} L ${hc},${t} L ${x6},${ah} L ${x5},${ah} L ${x5},${y2} L ${x7},${y2} L ${x7},${y4} L ${x8},${y4} L ${x8},${y3} L ${r},${vc} L ${x8},${y6} L ${x8},${y5} L ${x7},${y5} L ${x7},${y7} L ${x5},${y7} L ${x5},${y8} L ${x6},${y8} L ${hc},${b} L ${x3},${y8} L ${x4},${y8} L ${x4},${y7} L ${x2},${y7} L ${x2},${y5} L ${ah},${y5} L ${ah},${y6} z`;
      }
      break;
    case "curvedDownArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 25e3 * RATIO_EMUs_Points;
        let adj2 = 5e4 * RATIO_EMUs_Points;
        let adj3 = 25e3 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const wd2 = w / 2, r = w, b = h, t = 0, c3d4 = 270, cd2 = 180, cd4 = 90;
        const ss = Math.min(w, h);
        const maxAdj2 = cnstVal1 * w / ss;
        const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
        const a1 = adj1 < 0 ? 0 : adj1 > cnstVal2 ? cnstVal2 : adj1;
        const th = ss * a1 / cnstVal2;
        const aw = ss * a2 / cnstVal2;
        const q1 = (th + aw) / 4;
        const wR = wd2 - q1;
        const q7 = wR * 2;
        const q11 = Math.sqrt(q7 * q7 - th * th);
        const idy = q11 * h / q7;
        const maxAdj3 = cnstVal2 * idy / ss;
        const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
        const ah = ss * a3 / cnstVal2;
        const x3 = wR + th;
        const q5 = Math.sqrt(h * h - ah * ah);
        const dx = q5 * wR / h;
        const x5 = wR + dx;
        const x7 = x3 + dx;
        const dh = (aw - th) / 2;
        const x4 = x5 - dh;
        const x8 = x7 + dh;
        const x6 = r - aw / 2;
        const y1 = b - ah;
        const swAng = Math.atan(dx / ah);
        const swAngDeg = swAng * 180 / Math.PI;
        const mswAng = -swAngDeg;
        const dang2 = Math.atan(th / 2 / idy);
        const dang2Deg = dang2 * 180 / Math.PI;
        const stAng = c3d4 + swAngDeg;
        const stAng2 = c3d4 - dang2Deg;
        const swAng2 = dang2Deg - cd4;
        const swAng3 = cd4 + dang2Deg;
        pathData = `M ${x6},${b} L ${x4},${y1} L ${x5},${y1} ${shapeArc2(wR, h, wR, h, stAng, stAng + mswAng, false).replace("M", "L")} L ${x3},${t} ${shapeArc2(x3, h, wR, h, c3d4, c3d4 + swAngDeg, false).replace("M", "L")} L ${x5 + th},${y1} L ${x8},${y1} z M ${x3},${t} ${shapeArc2(x3, h, wR, h, stAng2, stAng2 + swAng2, false).replace("M", "L")} ${shapeArc2(wR, h, wR, h, cd2, cd2 + swAng3, false).replace("M", "L")}`;
      }
      break;
    case "curvedLeftArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 25e3 * RATIO_EMUs_Points;
        let adj2 = 5e4 * RATIO_EMUs_Points;
        let adj3 = 25e3 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const hd2 = h / 2, r = w, b = h, l = 0, t = 0, c3d4 = 270, cd4 = 90;
        const ss = Math.min(w, h);
        const maxAdj2 = cnstVal1 * h / ss;
        const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
        const a1 = adj1 < 0 ? 0 : adj1 > a2 ? a2 : adj1;
        const th = ss * a1 / cnstVal2;
        const aw = ss * a2 / cnstVal2;
        const q1 = (th + aw) / 4;
        const hR = hd2 - q1;
        const q7 = hR * 2;
        const q11 = Math.sqrt(q7 * q7 - th * th);
        const iDx = q11 * w / q7;
        const maxAdj3 = cnstVal2 * iDx / ss;
        const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
        const ah = ss * a3 / cnstVal2;
        const y3 = hR + th;
        const q5 = Math.sqrt(w * w - ah * ah);
        const dy = q5 * hR / w;
        const y5 = hR + dy;
        const y7 = y3 + dy;
        const dh = (aw - th) / 2;
        const y4 = y5 - dh;
        const y8 = y7 + dh;
        const y6 = b - aw / 2;
        const x1 = l + ah;
        const swAng = Math.atan(dy / ah);
        const dang2 = Math.atan(th / 2 / iDx);
        const swAng2 = dang2 - swAng;
        const swAngDg = swAng * 180 / Math.PI;
        const swAng2Dg = swAng2 * 180 / Math.PI;
        pathData = `M ${r},${y3} ${shapeArc2(l, hR, w, hR, 0, -cd4, false).replace("M", "L")} L ${l},${t} ${shapeArc2(l, y3, w, hR, c3d4, c3d4 + cd4, false).replace("M", "L")} L ${r},${y3} ${shapeArc2(l, y3, w, hR, 0, swAngDg, false).replace("M", "L")} L ${x1},${y7} L ${x1},${y8} L ${l},${y6} L ${x1},${y4} L ${x1},${y5} ${shapeArc2(l, hR, w, hR, swAngDg, swAngDg + swAng2Dg, false).replace("M", "L")} ${shapeArc2(l, hR, w, hR, 0, -cd4, false).replace("M", "L")} ${shapeArc2(l, y3, w, hR, c3d4, c3d4 + cd4, false).replace("M", "L")}`;
      }
      break;
    case "curvedRightArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 25e3 * RATIO_EMUs_Points;
        let adj2 = 5e4 * RATIO_EMUs_Points;
        let adj3 = 25e3 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const hd2 = h / 2, r = w, b = h, l = 0, cd2 = 180, cd4 = 90, c3d4 = 270;
        const ss = Math.min(w, h);
        const maxAdj2 = cnstVal1 * h / ss;
        const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
        const a1 = adj1 < 0 ? 0 : adj1 > a2 ? a2 : adj1;
        const th = ss * a1 / cnstVal2;
        const aw = ss * a2 / cnstVal2;
        const q1 = (th + aw) / 4;
        const hR = hd2 - q1;
        const q7 = hR * 2;
        const q11 = Math.sqrt(q7 * q7 - th * th);
        const iDx = q11 * w / q7;
        const maxAdj3 = cnstVal2 * iDx / ss;
        const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
        const ah = ss * a3 / cnstVal2;
        const y3 = hR + th;
        const q5 = Math.sqrt(w * w - ah * ah);
        const dy = q5 * hR / w;
        const y5 = hR + dy;
        const y7 = y3 + dy;
        const dh = (aw - th) / 2;
        const y4 = y5 - dh;
        const y8 = y7 + dh;
        const y6 = b - aw / 2;
        const x1 = r - ah;
        const swAng = Math.atan(dy / ah);
        const stAng = Math.PI - swAng;
        const mswAng = -swAng;
        const dang2 = Math.atan(th / 2 / iDx);
        const swAng2 = dang2 - Math.PI / 2;
        const stAngDg = stAng * 180 / Math.PI;
        const mswAngDg = mswAng * 180 / Math.PI;
        const swAngDg = swAng * 180 / Math.PI;
        const swAng2dg = swAng2 * 180 / Math.PI;
        pathData = `M ${l},${hR} ${shapeArc2(w, hR, w, hR, cd2, cd2 + mswAngDg, false).replace("M", "L")} L ${x1},${y5} L ${x1},${y4} L ${r},${y6} L ${x1},${y8} L ${x1},${y7} ${shapeArc2(w, y3, w, hR, stAngDg, stAngDg + swAngDg, false).replace("M", "L")} L ${l},${hR} ${shapeArc2(w, hR, w, hR, cd2, cd2 + cd4, false).replace("M", "L")} L ${r},${th} ${shapeArc2(w, y3, w, hR, c3d4, c3d4 + swAng2dg, false).replace("M", "L")}`;
      }
      break;
    case "curvedUpArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 25e3 * RATIO_EMUs_Points;
        let adj2 = 5e4 * RATIO_EMUs_Points;
        let adj3 = 25e3 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const wd2 = w / 2, r = w, b = h, t = 0, cd2 = 180, cd4 = 90;
        const ss = Math.min(w, h);
        const maxAdj2 = cnstVal1 * w / ss;
        const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
        const a1 = adj1 < 0 ? 0 : adj1 > cnstVal2 ? cnstVal2 : adj1;
        const th = ss * a1 / cnstVal2;
        const aw = ss * a2 / cnstVal2;
        const q1 = (th + aw) / 4;
        const wR = wd2 - q1;
        const q7 = wR * 2;
        const q11 = Math.sqrt(q7 * q7 - th * th);
        const idy = q11 * h / q7;
        const maxAdj3 = cnstVal2 * idy / ss;
        const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
        const ah = ss * a3 / cnstVal2;
        const x3 = wR + th;
        const q5 = Math.sqrt(h * h - ah * ah);
        const dx = q5 * wR / h;
        const x5 = wR + dx;
        const x7 = x3 + dx;
        const dh = (aw - th) / 2;
        const x4 = x5 - dh;
        const x8 = x7 + dh;
        const x6 = r - aw / 2;
        const y1 = t + ah;
        const swAng = Math.atan(dx / ah);
        const dang2 = Math.atan(th / 2 / idy);
        const swAng2 = dang2 - swAng;
        const stAng3 = Math.PI / 2 - swAng;
        const stAng2 = Math.PI / 2 - dang2;
        const stAng2dg = stAng2 * 180 / Math.PI;
        const swAng2dg = swAng2 * 180 / Math.PI;
        const stAng3dg = stAng3 * 180 / Math.PI;
        const swAngDg = swAng * 180 / Math.PI;
        pathData = `${shapeArc2(wR, 0, wR, h, stAng2dg, stAng2dg + swAng2dg, false)} L ${x5},${y1} L ${x4},${y1} L ${x6},${t} L ${x8},${y1} L ${x7},${y1} ${shapeArc2(x3, 0, wR, h, stAng3dg, stAng3dg + swAngDg, false).replace("M", "L")} L ${wR},${b} ${shapeArc2(wR, 0, wR, h, cd4, cd2, false).replace("M", "L")} L ${th},${t} ${shapeArc2(x3, 0, wR, h, cd2, cd4, false).replace("M", "L")}`;
      }
      break;
    case "mathDivide":
    case "mathEqual":
    case "mathMinus":
    case "mathMultiply":
    case "mathNotEqual":
    case "mathPlus":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1, adj2, adj3;
        if (shapAdjst_ary) {
          if (Array.isArray(shapAdjst_ary)) {
            for (const adj of shapAdjst_ary) {
              const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
              if (sAdj_name === "adj1") {
                adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4));
              } else if (sAdj_name === "adj2") {
                adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4));
              } else if (sAdj_name === "adj3") {
                adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4));
              }
            }
          } else {
            adj1 = parseInt(getTextByPathList(shapAdjst_ary, ["attrs", "fmla"]).substring(4));
          }
        }
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        const cnstVal3 = 2e5 * RATIO_EMUs_Points;
        const hc = w / 2, vc = h / 2, hd2 = h / 2;
        if (shapType === "mathNotEqual") {
          if (adj1 === void 0) adj1 = 23520;
          if (adj2 === void 0) adj2 = 110 * 6e4;
          if (adj3 === void 0) adj3 = 11760;
          adj1 *= RATIO_EMUs_Points;
          adj2 = adj2 / 6e4 * Math.PI / 180;
          adj3 *= RATIO_EMUs_Points;
          const angVal1 = 70 * Math.PI / 180, angVal2 = 110 * Math.PI / 180;
          const cnstVal4 = 73490 * RATIO_EMUs_Points;
          const a1 = adj1 < 0 ? 0 : adj1 > cnstVal1 ? cnstVal1 : adj1;
          const crAng = adj2 < angVal1 ? angVal1 : adj2 > angVal2 ? angVal2 : adj2;
          const maxAdj3 = cnstVal2 - a1 * 2;
          const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
          const dy1 = h * a1 / cnstVal2;
          const dy2 = h * a3 / cnstVal3;
          const dx1 = w * cnstVal4 / cnstVal3;
          const x1 = hc - dx1;
          const x8 = hc + dx1;
          const y2 = vc - dy2;
          const y3 = vc + dy2;
          const y1 = y2 - dy1;
          const y4 = y3 + dy1;
          const cadj2 = crAng - Math.PI / 2;
          const xadj2 = hd2 * Math.tan(cadj2);
          const len = Math.sqrt(xadj2 * xadj2 + hd2 * hd2);
          const bhw = len * dy1 / hd2;
          const bhw2 = bhw / 2;
          const x7 = hc + xadj2 - bhw2;
          const dx67 = xadj2 * y1 / hd2;
          const x6 = x7 - dx67;
          const dx57 = xadj2 * y2 / hd2;
          const x5 = x7 - dx57;
          const dx47 = xadj2 * y3 / hd2;
          const x4 = x7 - dx47;
          const dx37 = xadj2 * y4 / hd2;
          const x3 = x7 - dx37;
          const rx6 = x6 + bhw;
          const rx5 = x5 + bhw;
          const rx4 = x4 + bhw;
          const rx3 = x3 + bhw;
          const dx7 = dy1 * hd2 / len;
          const rxt = x7 + dx7;
          const lxt = x7 + bhw - dx7;
          const rx = cadj2 > 0 ? rxt : x7 + bhw;
          const lx = cadj2 > 0 ? x7 : lxt;
          const dy3 = dy1 * xadj2 / len;
          const ry = cadj2 > 0 ? dy3 : 0;
          const ly = cadj2 > 0 ? 0 : -dy3;
          const dlx = w - rx;
          const drx = w - lx;
          const dly = h - ry;
          const dry = h - ly;
          pathData = `M ${x1},${y1} L ${x6},${y1} L ${lx},${ly} L ${rx},${ry} L ${rx6},${y1} L ${x8},${y1} L ${x8},${y2} L ${rx5},${y2} L ${rx4},${y3} L ${x8},${y3} L ${x8},${y4} L ${rx3},${y4} L ${drx},${dry} L ${dlx},${dly} L ${x3},${y4} L ${x1},${y4} L ${x1},${y3} L ${x4},${y3} L ${x5},${y2} L ${x1},${y2} z`;
        } else if (shapType === "mathDivide") {
          if (adj1 === void 0) adj1 = 23520;
          if (adj2 === void 0) adj2 = 5880;
          if (adj3 === void 0) adj3 = 11760;
          adj1 *= RATIO_EMUs_Points;
          adj2 *= RATIO_EMUs_Points;
          adj3 *= RATIO_EMUs_Points;
          const cnstVal4 = 1e3 * RATIO_EMUs_Points;
          const cnstVal5 = 36745 * RATIO_EMUs_Points;
          const cnstVal6 = 73490 * RATIO_EMUs_Points;
          const a1 = adj1 < cnstVal4 ? cnstVal4 : adj1 > cnstVal5 ? cnstVal5 : adj1;
          const ma3h = (cnstVal6 - a1) / 4;
          const ma3w = cnstVal5 * w / h;
          const maxAdj3 = ma3h < ma3w ? ma3h : ma3w;
          const a3 = adj3 < cnstVal4 ? cnstVal4 : adj3 > maxAdj3 ? maxAdj3 : adj3;
          const maxAdj2 = cnstVal6 - 4 * a3 - a1;
          const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
          const dy1 = h * a1 / cnstVal3;
          const yg = h * a2 / cnstVal2;
          const rad = h * a3 / cnstVal2;
          const dx1 = w * cnstVal6 / cnstVal3;
          const y3 = vc - dy1;
          const y4 = vc + dy1;
          const y2 = y3 - (yg + rad);
          const y1 = y2 - rad;
          const y5 = h - y1;
          const x1 = hc - dx1;
          const x3 = hc + dx1;
          pathData = `M ${hc},${y1} A ${rad},${rad} 0 1,0 ${hc},${y1 + 2 * rad} A ${rad},${rad} 0 1,0 ${hc},${y1} z M ${hc},${y5} A ${rad},${rad} 0 1,1 ${hc},${y5 - 2 * rad} A ${rad},${rad} 0 1,1 ${hc},${y5} z M ${x1},${y3} L ${x3},${y3} L ${x3},${y4} L ${x1},${y4} z`;
        } else if (shapType === "mathEqual") {
          if (adj1 === void 0) adj1 = 23520;
          if (adj2 === void 0) adj2 = 11760;
          adj1 *= RATIO_EMUs_Points;
          adj2 *= RATIO_EMUs_Points;
          const cnstVal5 = 36745 * RATIO_EMUs_Points;
          const cnstVal6 = 73490 * RATIO_EMUs_Points;
          const a1 = adj1 < 0 ? 0 : adj1 > cnstVal5 ? cnstVal5 : adj1;
          const mAdj2 = cnstVal2 - a1 * 2;
          const a2 = adj2 < 0 ? 0 : adj2 > mAdj2 ? mAdj2 : adj2;
          const dy1 = h * a1 / cnstVal2;
          const dy2 = h * a2 / cnstVal3;
          const dx1 = w * cnstVal6 / cnstVal3;
          const y2 = vc - dy2;
          const y3 = vc + dy2;
          const y1 = y2 - dy1;
          const y4 = y3 + dy1;
          const x1 = hc - dx1;
          const x2 = hc + dx1;
          pathData = `M ${x1},${y1} L ${x2},${y1} L ${x2},${y2} L ${x1},${y2} z M ${x1},${y3} L ${x2},${y3} L ${x2},${y4} L ${x1},${y4} z`;
        } else if (shapType === "mathMinus") {
          if (adj1 === void 0) adj1 = 23520;
          adj1 *= RATIO_EMUs_Points;
          const cnstVal6 = 73490 * RATIO_EMUs_Points;
          const a1 = adj1 < 0 ? 0 : adj1 > cnstVal2 ? cnstVal2 : adj1;
          const dy1 = h * a1 / cnstVal3;
          const dx1 = w * cnstVal6 / cnstVal3;
          const y1 = vc - dy1;
          const y2 = vc + dy1;
          const x1 = hc - dx1;
          const x2 = hc + dx1;
          pathData = `M ${x1},${y1} L ${x2},${y1} L ${x2},${y2} L ${x1},${y2} z`;
        } else if (shapType === "mathMultiply") {
          if (adj1 === void 0) adj1 = 23520;
          adj1 *= RATIO_EMUs_Points;
          const cnstVal6 = 51965 * RATIO_EMUs_Points;
          const ss = Math.min(w, h);
          const a1 = adj1 < 0 ? 0 : adj1 > cnstVal6 ? cnstVal6 : adj1;
          const th = ss * a1 / cnstVal2;
          const a = Math.atan(h / w);
          const sa = Math.sin(a);
          const ca = Math.cos(a);
          const ta = Math.tan(a);
          const dl = Math.sqrt(w * w + h * h);
          const lM = dl - dl * cnstVal6 / cnstVal2;
          const xM = ca * lM / 2;
          const yM = sa * lM / 2;
          const dxAM = sa * th / 2;
          const dyAM = ca * th / 2;
          const xA = xM - dxAM;
          const yA = yM + dyAM;
          const xB = xM + dxAM;
          const yB = yM - dyAM;
          const yC = (hc - xB) * ta + yB;
          const xD = w - xB;
          const xE = w - xA;
          const xF = xE - (vc - yA) / ta;
          const xL = xA + (vc - yA) / ta;
          const yG = h - yA;
          const yH = h - yB;
          const yI = h - yC;
          pathData = `M ${xA},${yA} L ${xB},${yB} L ${hc},${yC} L ${xD},${yB} L ${xE},${yA} L ${xF},${vc} L ${xE},${yG} L ${xD},${yH} L ${hc},${yI} L ${xB},${yH} L ${xA},${yG} L ${xL},${vc} z`;
        } else if (shapType === "mathPlus") {
          if (adj1 === void 0) adj1 = 23520;
          adj1 *= RATIO_EMUs_Points;
          const cnstVal6 = 73490 * RATIO_EMUs_Points;
          const ss = Math.min(w, h);
          const a1 = adj1 < 0 ? 0 : adj1 > cnstVal6 ? cnstVal6 : adj1;
          const dx1 = w * cnstVal6 / cnstVal3;
          const dy1 = h * cnstVal6 / cnstVal3;
          const dx2 = ss * a1 / cnstVal3;
          const x1 = hc - dx1;
          const x2 = hc - dx2;
          const x3 = hc + dx2;
          const x4 = hc + dx1;
          const y1 = vc - dy1;
          const y2 = vc - dx2;
          const y3 = vc + dx2;
          const y4 = vc + dy1;
          pathData = `M ${x1},${y2} L ${x2},${y2} L ${x2},${y1} L ${x3},${y1} L ${x3},${y2} L ${x4},${y2} L ${x4},${y3} L ${x3},${y3} L ${x3},${y4} L ${x2},${y4} L ${x2},${y3} L ${x1},${y3} z`;
        }
      }
      break;
    case "can":
    case "flowChartMagneticDisk":
    case "flowChartMagneticDrum":
      {
        const shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
        let adj = 25e3 * RATIO_EMUs_Points;
        const cnstVal1 = 5e4 * RATIO_EMUs_Points;
        const cnstVal2 = 2e5 * RATIO_EMUs_Points;
        if (shapAdjst) {
          adj = parseInt(shapAdjst.substring(4)) * RATIO_EMUs_Points;
        }
        if (shapType === "flowChartMagneticDisk" || shapType === "flowChartMagneticDrum") {
          adj = 5e4 * RATIO_EMUs_Points;
        }
        const ss = Math.min(w, h);
        const maxAdj = cnstVal1 * h / ss;
        const a = adj < 0 ? 0 : adj > maxAdj ? maxAdj : adj;
        const y1 = ss * a / cnstVal2;
        const y3 = h - y1;
        const cd2 = 180, wd2 = w / 2;
        let dVal = `${shapeArc2(wd2, y1, wd2, y1, 0, cd2, false)} ${shapeArc2(wd2, y1, wd2, y1, cd2, cd2 + cd2, false).replace("M", "L")} L ${w},${y3} ${shapeArc2(wd2, y3, wd2, y1, 0, cd2, false).replace("M", "L")} L 0,${y1}`;
        if (shapType === "flowChartMagneticDrum") {
          dVal = dVal.replace(/([MLQC])\s*([-\d.e]+)\s*([-\d.e]+)/gi, (match, command, x, y) => {
            const newX = w / 2 - (parseFloat(y) - h / 2);
            const newY = h / 2 + (parseFloat(x) - w / 2);
            return `${command}${newX} ${newY}`;
          }).replace(/([MLQC])\s*([-\d.e]+)\s*([-\d.e]+)\s*([-\d.e]+)\s*([-\d.e]+)/gi, (match, command, c1x, c1y, x, y) => {
            const newC1X = w / 2 - (parseFloat(c1y) - h / 2);
            const newC1Y = h / 2 + (parseFloat(c1x) - w / 2);
            const newX = w / 2 - (parseFloat(y) - h / 2);
            const newY = h / 2 + (parseFloat(x) - w / 2);
            return `${command}${newC1X} ${newC1Y} ${newX} ${newY}`;
          });
        }
        pathData = dVal;
      }
      break;
    case "swooshArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        const refr = RATIO_EMUs_Points;
        let adj1 = 25e3 * refr;
        let adj2 = 16667 * refr;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * refr;
            }
          }
        }
        const cnstVal1 = 1 * refr;
        const cnstVal2 = 7e4 * refr;
        const cnstVal3 = 75e3 * refr;
        const cnstVal4 = 1e5 * refr;
        const ss = Math.min(w, h);
        const ssd8 = ss / 8;
        const hd6 = h / 6;
        const a1 = adj1 < cnstVal1 ? cnstVal1 : adj1 > cnstVal3 ? cnstVal3 : adj1;
        const maxAdj2 = cnstVal2 * w / ss;
        const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
        const ad1 = h * a1 / cnstVal4;
        const ad2 = ss * a2 / cnstVal4;
        const xB = w - ad2;
        const yB = ssd8;
        const alfa = Math.PI / 2 / 14;
        const dx0 = ssd8 * Math.tan(alfa);
        const xC = xB - dx0;
        const dx1 = ad1 * Math.tan(alfa);
        const yF = yB + ad1;
        const xF = xB + dx1;
        const xE = xF + dx0;
        const yE = yF + ssd8;
        const dy22 = yE / 2;
        const dy3 = h / 20;
        const yD = dy22 - dy3;
        const yP1 = hd6 + hd6;
        const xP1 = w / 6;
        const yP2 = yF + hd6 / 2;
        const xP2 = w / 4;
        pathData = `M 0,${h} Q ${xP1},${yP1} ${xB},${yB} L ${xC},0 L ${w},${yD} L ${xE},${yE} L ${xF},${yF} Q ${xP2},${yP2} 0,${h} z`;
      }
      break;
    case "circularArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 12500 * RATIO_EMUs_Points;
        let adj2 = 1142319 / 6e4 * Math.PI / 180;
        let adj3 = 20457681 / 6e4 * Math.PI / 180;
        let adj4 = 108e5 / 6e4 * Math.PI / 180;
        let adj5 = 12500 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 6e4 * Math.PI / 180;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 6e4 * Math.PI / 180;
            } else if (sAdj_name === "adj4") {
              adj4 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 6e4 * Math.PI / 180;
            } else if (sAdj_name === "adj5") {
              adj5 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const hc = w / 2, vc = h / 2, wd2 = w / 2, hd2 = h / 2;
        const ss = Math.min(w, h);
        const cnstVal1 = 25e3 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        const rdAngVal1 = 1 / 6e4 * Math.PI / 180;
        const rdAngVal2 = 21599999 / 6e4 * Math.PI / 180;
        const rdAngVal3 = 2 * Math.PI;
        const a5 = adj5 < 0 ? 0 : adj5 > cnstVal1 ? cnstVal1 : adj5;
        const maxAdj1 = a5 * 2;
        const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
        const enAng = adj3 < rdAngVal1 ? rdAngVal1 : adj3 > rdAngVal2 ? rdAngVal2 : adj3;
        const stAng = adj4 < 0 ? 0 : adj4 > rdAngVal2 ? rdAngVal2 : adj4;
        const th = ss * a1 / cnstVal2;
        const thh = ss * a5 / cnstVal2;
        const th2 = th / 2;
        const rw1 = wd2 + th2 - thh;
        const rh1 = hd2 + th2 - thh;
        const rw2 = rw1 - th;
        const rh2 = rh1 - th;
        const rw3 = rw2 + th2;
        const rh3 = rh2 + th2;
        const wtH = rw3 * Math.sin(enAng);
        const htH = rh3 * Math.cos(enAng);
        const dxH = rw3 * Math.cos(Math.atan2(wtH, htH));
        const dyH = rh3 * Math.sin(Math.atan2(wtH, htH));
        const xH = hc + dxH;
        const yH = vc + dyH;
        const rI = Math.min(rw2, rh2);
        const u8 = 1 - (dxH * dxH - rI * rI) * (dyH * dyH - rI * rI) / (dxH * dxH * dyH * dyH);
        const u9 = Math.sqrt(u8);
        const u12 = (1 + u9) / ((dxH * dxH - rI * rI) / dxH / dyH);
        const u15 = Math.atan2(u12, 1) > 0 ? Math.atan2(u12, 1) : Math.atan2(u12, 1) + rdAngVal3;
        const u18 = u15 - enAng > 0 ? u15 - enAng : u15 - enAng + rdAngVal3;
        const u21 = u18 - Math.PI > 0 ? u18 - rdAngVal3 : u18;
        const maxAng = Math.abs(u21);
        const aAng = adj2 < 0 ? 0 : adj2 > maxAng ? maxAng : adj2;
        const ptAng = enAng + aAng;
        const wtA = rw3 * Math.sin(ptAng);
        const htA = rh3 * Math.cos(ptAng);
        const dxA = rw3 * Math.cos(Math.atan2(wtA, htA));
        const dyA = rh3 * Math.sin(Math.atan2(wtA, htA));
        const xA = hc + dxA;
        const yA = vc + dyA;
        const dxG = thh * Math.cos(ptAng);
        const dyG = thh * Math.sin(ptAng);
        const xG = xH + dxG;
        const yG = yH + dyG;
        const dxB = thh * Math.cos(ptAng);
        const dyB = thh * Math.sin(ptAng);
        const xB = xH - dxB;
        const yB = yH - dyB;
        const sx1 = xB - hc;
        const sy1 = yB - vc;
        const sx2 = xG - hc;
        const sy2 = yG - vc;
        const rO = Math.min(rw1, rh1);
        const x1O = sx1 * rO / rw1;
        const y1O = sy1 * rO / rh1;
        const x2O = sx2 * rO / rw1;
        const y2O = sy2 * rO / rh1;
        const dxO = x2O - x1O;
        const dyO = y2O - y1O;
        const dO = Math.sqrt(dxO * dxO + dyO * dyO);
        const DO = x1O * y2O - x2O * y1O;
        const sdelO = Math.sqrt(Math.max(0, rO * rO * dO * dO - DO * DO));
        const sdyO = dyO * -1 > 0 ? -1 : 1;
        const dxF1 = (DO * dyO + sdyO * dxO * sdelO) / (dO * dO);
        const dxF2 = (DO * dyO - sdyO * dxO * sdelO) / (dO * dO);
        const dyF1 = (-DO * dxO + Math.abs(dyO) * sdelO) / (dO * dO);
        const dyF2 = (-DO * dxO - Math.abs(dyO) * sdelO) / (dO * dO);
        const q22 = Math.sqrt((x2O - dxF2) ** 2 + (y2O - dyF2) ** 2) - Math.sqrt((x2O - dxF1) ** 2 + (y2O - dyF1) ** 2);
        const dxF = q22 > 0 ? dxF1 : dxF2;
        const dyF = q22 > 0 ? dyF1 : dyF2;
        const xF = hc + dxF * rw1 / rO;
        const yF = vc + dyF * rh1 / rO;
        const x1I = sx1 * rI / rw2;
        const y1I = sy1 * rI / rh2;
        const x2I = sx2 * rI / rw2;
        const y2I = sy2 * rI / rh2;
        const dxI = x2I - x1I;
        const dyI = y2I - y1I;
        const dI = Math.sqrt(dxI * dxI + dyI * dyI);
        const DI = x1I * y2I - x2I * y1I;
        const sdelI = Math.sqrt(Math.max(0, rI * rI * dI * dI - DI * DI));
        const dxC1 = (DI * dyI + sdyO * dxI * sdelI) / (dI * dI);
        const dxC2 = (DI * dyI - sdyO * dxI * sdelI) / (dI * dI);
        const dyC1 = (-DI * dxI + Math.abs(dyI) * sdelI) / (dI * dI);
        const dyC2 = (-DI * dxI - Math.abs(dyI) * sdelI) / (dI * dI);
        const v22 = Math.sqrt((x1I - dxC2) ** 2 + (y1I - dyC2) ** 2) - Math.sqrt((x1I - dxC1) ** 2 + (y1I - dyC1) ** 2);
        const dxC = v22 > 0 ? dxC1 : dxC2;
        const dyC = v22 > 0 ? dyC1 : dyC2;
        const xC = hc + dxC * rw2 / rI;
        const yC = vc + dyC * rh2 / rI;
        const ist0 = Math.atan2(dyC * rh2 / rI, dxC * rw2 / rI);
        const istAng = ist0 > 0 ? ist0 : ist0 + rdAngVal3;
        const isw1 = stAng - istAng;
        const iswAng = isw1 > 0 ? isw1 - rdAngVal3 : isw1;
        const p5 = Math.sqrt((xF - xC) ** 2 + (yF - yC) ** 2) / 2 - thh;
        const xGp = p5 > 0 ? xF : xG;
        const yGp = p5 > 0 ? yF : yG;
        const xBp = p5 > 0 ? xC : xB;
        const yBp = p5 > 0 ? yC : yB;
        const en0 = Math.atan2(yF - vc, xF - hc);
        const en2 = en0 > 0 ? en0 : en0 + rdAngVal3;
        const sw0 = en2 - stAng;
        const swAng = sw0 > 0 ? sw0 : sw0 + rdAngVal3;
        const strtAng = stAng * 180 / Math.PI;
        const endAngVal = strtAng + swAng * 180 / Math.PI;
        const stiAng = istAng * 180 / Math.PI;
        const ediAng = stiAng + iswAng * 180 / Math.PI;
        pathData = `${shapeArc2(w / 2, h / 2, rw1, rh1, strtAng, endAngVal, false)} L ${xGp},${yGp} L ${xA},${yA} L ${xBp},${yBp} L ${xC},${yC} ${shapeArc2(w / 2, h / 2, rw2, rh2, stiAng, ediAng, false).replace("M", "L")} z`;
      }
      break;
    case "leftCircularArrow":
      {
        const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
        let adj1 = 12500 * RATIO_EMUs_Points;
        let adj2 = -1142319 / 6e4 * Math.PI / 180;
        let adj3 = 1142319 / 6e4 * Math.PI / 180;
        let adj4 = 108e5 / 6e4 * Math.PI / 180;
        let adj5 = 12500 * RATIO_EMUs_Points;
        if (shapAdjst_ary) {
          for (const adj of shapAdjst_ary) {
            const sAdj_name = getTextByPathList(adj, ["attrs", "name"]);
            if (sAdj_name === "adj1") {
              adj1 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            } else if (sAdj_name === "adj2") {
              adj2 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 6e4 * Math.PI / 180;
            } else if (sAdj_name === "adj3") {
              adj3 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 6e4 * Math.PI / 180;
            } else if (sAdj_name === "adj4") {
              adj4 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) / 6e4 * Math.PI / 180;
            } else if (sAdj_name === "adj5") {
              adj5 = parseInt(getTextByPathList(adj, ["attrs", "fmla"]).substring(4)) * RATIO_EMUs_Points;
            }
          }
        }
        const hc = w / 2, vc = h / 2, wd2 = w / 2, hd2 = h / 2;
        const ss = Math.min(w, h);
        const cnstVal1 = 25e3 * RATIO_EMUs_Points;
        const cnstVal2 = 1e5 * RATIO_EMUs_Points;
        const rdAngVal1 = 1 / 6e4 * Math.PI / 180;
        const rdAngVal2 = 21599999 / 6e4 * Math.PI / 180;
        const rdAngVal3 = 2 * Math.PI;
        const a5 = adj5 < 0 ? 0 : adj5 > cnstVal1 ? cnstVal1 : adj5;
        const maxAdj1 = a5 * 2;
        const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
        const enAng = adj3 < rdAngVal1 ? rdAngVal1 : adj3 > rdAngVal2 ? rdAngVal2 : adj3;
        const stAng = adj4 < 0 ? 0 : adj4 > rdAngVal2 ? rdAngVal2 : adj4;
        const th = ss * a1 / cnstVal2;
        const thh = ss * a5 / cnstVal2;
        const th2 = th / 2;
        const rw1 = wd2 + th2 - thh;
        const rh1 = hd2 + th2 - thh;
        const rw2 = rw1 - th;
        const rh2 = rh1 - th;
        const rw3 = rw2 + th2;
        const rh3 = rh2 + th2;
        const dxH = rw3 * Math.cos(enAng);
        const dyH = rh3 * Math.sin(enAng);
        const xH = hc + dxH;
        const yH = vc + dyH;
        const rI = Math.min(rw2, rh2);
        const u8 = 1 - (dxH * dxH - rI * rI) * (dyH * dyH - rI * rI) / (dxH * dxH * dyH * dyH);
        const u9 = Math.sqrt(u8);
        const u12 = (1 + u9) / ((dxH * dxH - rI * rI) / dxH / dyH);
        const u15 = Math.atan2(u12, 1) > 0 ? Math.atan2(u12, 1) : Math.atan2(u12, 1) + rdAngVal3;
        const u18 = u15 - enAng > 0 ? u15 - enAng : u15 - enAng + rdAngVal3;
        const u21 = u18 - Math.PI > 0 ? u18 - rdAngVal3 : u18;
        const minAng = -Math.abs(u21);
        const aAng = adj2 < minAng ? minAng : adj2 > 0 ? 0 : adj2;
        const ptAng = enAng + aAng;
        const dxA = rw3 * Math.cos(ptAng);
        const dyA = rh3 * Math.sin(ptAng);
        const xA = hc + dxA;
        const yA = vc + dyA;
        const dxE = rw1 * Math.cos(stAng);
        const dyE = rh1 * Math.sin(stAng);
        const xE = hc + dxE;
        const yE = vc + dyE;
        const dxD = rw2 * Math.cos(stAng);
        const dyD = rh2 * Math.sin(stAng);
        const xD = hc + dxD;
        const yD = vc + dyD;
        const dxG = thh * Math.cos(ptAng);
        const dyG = thh * Math.sin(ptAng);
        const xG = xH + dxG;
        const yG = yH + dyG;
        const dxB = thh * Math.cos(ptAng);
        const dyB = thh * Math.sin(ptAng);
        const xB = xH - dxB;
        const yB = yH - dyB;
        const sx1 = xB - hc;
        const sy1 = yB - vc;
        const sx2 = xG - hc;
        const sy2 = yG - vc;
        const rO = Math.min(rw1, rh1);
        const x1O = sx1 * rO / rw1;
        const y1O = sy1 * rO / rh1;
        const x2O = sx2 * rO / rw1;
        const y2O = sy2 * rO / rh1;
        const dxO = x2O - x1O;
        const dyO = y2O - y1O;
        const dO = Math.sqrt(dxO * dxO + dyO * dyO);
        const DO = x1O * y2O - x2O * y1O;
        const sdelO = Math.sqrt(Math.max(0, rO * rO * dO * dO - DO * DO));
        const sdyO = dyO * -1 > 0 ? -1 : 1;
        const dxF1 = (DO * dyO + sdyO * dxO * sdelO) / (dO * dO);
        const dxF2 = (DO * dyO - sdyO * dxO * sdelO) / (dO * dO);
        const dyF1 = (-DO * dxO + Math.abs(dyO) * sdelO) / (dO * dO);
        const dyF2 = (-DO * dxO - Math.abs(dyO) * sdelO) / (dO * dO);
        const q22 = Math.sqrt((x2O - dxF2) ** 2 + (y2O - dyF2) ** 2) - Math.sqrt((x2O - dxF1) ** 2 + (y2O - dyF1) ** 2);
        const dxF = q22 > 0 ? dxF1 : dxF2;
        const dyF = q22 > 0 ? dyF1 : dyF2;
        const xF = hc + dxF * rw1 / rO;
        const yF = vc + dyF * rh1 / rO;
        const x1I = sx1 * rI / rw2;
        const y1I = sy1 * rI / rh2;
        const x2I = sx2 * rI / rw2;
        const y2I = sy2 * rI / rh2;
        const dxI = x2I - x1I;
        const dyI = y2I - y1I;
        const dI = Math.sqrt(dxI * dxI + dyI * dyI);
        const DI = x1I * y2I - x2I * y1I;
        const sdelI = Math.sqrt(Math.max(0, rI * rI * dI * dI - DI * DI));
        const dxC1 = (DI * dyI + sdyO * dxI * sdelI) / (dI * dI);
        const dxC2 = (DI * dyI - sdyO * dxI * sdelI) / (dI * dI);
        const dyC1 = (-DI * dxI + Math.abs(dyI) * sdelI) / (dI * dI);
        const dyC2 = (-DI * dxI - Math.abs(dyI) * sdelI) / (dI * dI);
        const v22 = Math.sqrt((x1I - dxC2) ** 2 + (y1I - dyC2) ** 2) - Math.sqrt((x1I - dxC1) ** 2 + (y1I - dyC1) ** 2);
        const dxC = v22 > 0 ? dxC1 : dxC2;
        const dyC = v22 > 0 ? dyC1 : dyC2;
        const xC = hc + dxC * rw2 / rI;
        const yC = vc + dyC * rh2 / rI;
        const ist0 = Math.atan2(dyC * rh2 / rI, dxC * rw2 / rI);
        const istAng0 = ist0 > 0 ? ist0 : ist0 + rdAngVal3;
        const isw1 = stAng - istAng0;
        const iswAng0 = isw1 > 0 ? isw1 : isw1 + rdAngVal3;
        const istAng = istAng0 + iswAng0;
        const iswAng = -iswAng0;
        const p5 = Math.sqrt((xF - xC) ** 2 + (yF - yC) ** 2) / 2 - thh;
        const xGp = p5 > 0 ? xF : xG;
        const yGp = p5 > 0 ? yF : yG;
        const xBp = p5 > 0 ? xC : xB;
        const yBp = p5 > 0 ? yC : yB;
        const en0 = Math.atan2(yF - vc, xF - hc);
        const en2 = en0 > 0 ? en0 : en0 + rdAngVal3;
        const sw0 = en2 - stAng;
        const swAng = sw0 > 0 ? sw0 - rdAngVal3 : sw0;
        const stAng0 = stAng + swAng;
        const strtAng = stAng0 * 180 / Math.PI;
        const endAngVal = stAng * 180 / Math.PI;
        const stiAng = istAng * 180 / Math.PI;
        const ediAng = stiAng + iswAng * 180 / Math.PI;
        pathData = `M ${xE},${yE} L ${xD},${yD} ${shapeArc2(w / 2, h / 2, rw2, rh2, stiAng, ediAng, false).replace("M", "L")} L ${xBp},${yBp} L ${xA},${yA} L ${xGp},${yGp} L ${xF},${yF} ${shapeArc2(w / 2, h / 2, rw1, rh1, strtAng, endAngVal, false).replace("M", "L")} z`;
      }
      break;
    case "leftRightCircularArrow":
    case "chartPlus":
    case "chartStar":
    case "chartX":
    case "cornerTabs":
    case "flowChartOfflineStorage":
    case "folderCorner":
    case "funnel":
    case "lineInv":
    case "nonIsoscelesTrapezoid":
    case "plaqueTabs":
    case "squareTabs":
    case "upDownArrowCallout":
      pathData = `M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`;
      break;
    default:
      pathData = `M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`;
  }
  return pathData;
}

// forked_pptxtojson/animation.js
function findTransitionNode(content, rootElement) {
  if (!content || !rootElement) return null;
  const path1 = [rootElement, "p:transition"];
  let transitionNode = getTextByPathList(content, path1);
  if (transitionNode) return transitionNode;
  const path2 = [rootElement, "mc:AlternateContent", "mc:Choice", "p:transition"];
  transitionNode = getTextByPathList(content, path2);
  if (transitionNode) return transitionNode;
  const path3 = [rootElement, "mc:AlternateContent", "mc:Fallback", "p:transition"];
  transitionNode = getTextByPathList(content, path3);
  return transitionNode;
}
function parseTransition(transitionNode) {
  if (!transitionNode) return null;
  const transition = {
    type: "none",
    duration: 1e3,
    direction: null
  };
  const attrs = transitionNode.attrs || {};
  let durationFound = false;
  const durRegex = /^p\d{2}:dur$/;
  for (const key in attrs) {
    if (durRegex.test(key) && !isNaN(parseInt(attrs[key], 10))) {
      transition.duration = parseInt(attrs[key], 10);
      durationFound = true;
      break;
    }
  }
  if (!durationFound && attrs.spd) {
    switch (attrs.spd) {
      case "slow":
        transition.duration = 1e3;
        break;
      case "med":
        transition.duration = 800;
        break;
      case "fast":
        transition.duration = 500;
        break;
      default:
        transition.duration = 1e3;
        break;
    }
  }
  if (attrs.advClick === "0" && attrs.advTm) {
    transition.autoNextAfter = parseInt(attrs.advTm, 10);
  }
  const effectRegex = /^(p|p\d{2}):/;
  for (const key in transitionNode) {
    if (key !== "attrs" && effectRegex.test(key)) {
      const effectNode = transitionNode[key];
      transition.type = key.substring(key.indexOf(":") + 1);
      if (effectNode && effectNode.attrs) {
        const effectAttrs = effectNode.attrs;
        if (effectAttrs.dur && !isNaN(parseInt(effectAttrs.dur, 10))) {
          if (!durationFound) transition.duration = parseInt(effectAttrs.dur, 10);
        }
        if (effectAttrs.dir) transition.direction = effectAttrs.dir;
      }
      break;
    }
  }
  return transition;
}

// forked_pptxtojson/diagram.js
async function loadDiagramFile(warpObj, filename, transformDrawing = false) {
  if (!filename) return null;
  const cacheKey = `${transformDrawing ? "drawing:" : "xml:"}${filename}`;
  if (warpObj.diagramFileCache[cacheKey]) return warpObj.diagramFileCache[cacheKey];
  let content = await readXmlFile(warpObj["zip"], filename);
  if (content && transformDrawing) {
    const contentStr = JSON.stringify(content).replace(/dsp:/g, "p:");
    content = JSON.parse(contentStr);
  }
  warpObj.diagramFileCache[cacheKey] = content;
  return content;
}
function getDiagramDrawingRelId(dataContent) {
  let extNodes = getTextByPathList(dataContent, ["dgm:dataModel", "dgm:extLst", "a:ext"]);
  if (!extNodes) return "";
  if (!Array.isArray(extNodes)) extNodes = [extNodes];
  for (const extNode of extNodes) {
    const relId = getTextByPathList(extNode, ["dsp:dataModelExt", "attrs", "relId"]);
    if (relId) return relId;
  }
  return "";
}
async function getDiagramNodeContext(node, warpObj) {
  const relIds = getTextByPathList(node, ["a:graphic", "a:graphicData", "dgm:relIds", "attrs"]) || {};
  const diagramContent = {
    data: null,
    layout: null,
    quickStyle: null,
    colors: null,
    drawing: null
  };
  let digramFileContent = {};
  const diagramResObj = {};
  const diagramDataTarget = getTextByPathList(warpObj["slideResObj"], [relIds["r:dm"], "target"]);
  const diagramLayoutTarget = getTextByPathList(warpObj["slideResObj"], [relIds["r:lo"], "target"]);
  const diagramQuickStyleTarget = getTextByPathList(warpObj["slideResObj"], [relIds["r:qs"], "target"]);
  const diagramColorsTarget = getTextByPathList(warpObj["slideResObj"], [relIds["r:cs"], "target"]);
  if (diagramDataTarget) diagramContent.data = await loadDiagramFile(warpObj, diagramDataTarget);
  if (diagramLayoutTarget) diagramContent.layout = await loadDiagramFile(warpObj, diagramLayoutTarget);
  if (diagramQuickStyleTarget) diagramContent.quickStyle = await loadDiagramFile(warpObj, diagramQuickStyleTarget);
  if (diagramColorsTarget) diagramContent.colors = await loadDiagramFile(warpObj, diagramColorsTarget);
  const drawingRelId = diagramContent.data ? getDiagramDrawingRelId(diagramContent.data) : "";
  const drawingTarget = getTextByPathList(warpObj["slideResObj"], [drawingRelId, "target"]);
  if (drawingTarget) {
    digramFileContent = await loadDiagramFile(warpObj, drawingTarget, true) || {};
    diagramContent.drawing = digramFileContent;
    const drawingName = drawingTarget.split("/").pop();
    const diagramResFileName = drawingTarget.replace(drawingName, "_rels/" + drawingName) + ".rels";
    const digramResContent = await readXmlFile(warpObj["zip"], diagramResFileName);
    if (digramResContent) {
      let relationshipArray = digramResContent["Relationships"]["Relationship"];
      if (relationshipArray && relationshipArray.constructor !== Array) relationshipArray = [relationshipArray];
      if (relationshipArray) {
        for (const relationshipArrayItem of relationshipArray) {
          let relTarget = relationshipArrayItem["attrs"]["Target"];
          if (relTarget.indexOf("../") !== -1) relTarget = relTarget.replace("../", "ppt/");
          else relTarget = drawingTarget.replace(drawingName, "") + relTarget;
          diagramResObj[relationshipArrayItem["attrs"]["Id"]] = {
            type: relationshipArrayItem["attrs"]["Type"].replace("http://schemas.openxmlformats.org/officeDocument/2006/relationships/", ""),
            target: relTarget
          };
        }
      }
    }
  }
  return {
    ...warpObj,
    digramFileContent,
    diagramResObj,
    diagramContent
  };
}
function getSmartArtTextData(dataContent) {
  const result = [];
  let ptLst = getTextByPathList(dataContent, ["dgm:dataModel", "dgm:ptLst", "dgm:pt"]);
  if (!ptLst) return result;
  if (!Array.isArray(ptLst)) ptLst = [ptLst];
  for (const pt of ptLst) {
    const textBody = getTextByPathList(pt, ["dgm:t"]);
    if (textBody) {
      let nodeText = "";
      let paragraphs = getTextByPathList(textBody, ["a:p"]);
      if (paragraphs) {
        if (!Array.isArray(paragraphs)) paragraphs = [paragraphs];
        paragraphs.forEach((p) => {
          let runs = getTextByPathList(p, ["a:r"]);
          if (runs) {
            if (!Array.isArray(runs)) runs = [runs];
            runs.forEach((r) => {
              const t = getTextNodeValue(getTextByPathList(r, ["a:t"]));
              if (t && typeof t === "string") nodeText += t;
            });
          }
          if (nodeText.length > 0) nodeText += "\n";
        });
      }
      const cleanText = nodeText.trim();
      if (cleanText) {
        result.push(cleanText);
      }
    }
  }
  return result;
}

// forked_pptxtojson/pptxtojson.js
function wisedeckApplyPlaceholderProps(target, phIdxAttr, phTypeAttr) {
  if (!target || typeof target !== "object") return target;
  const hasIdx = phIdxAttr !== void 0 && phIdxAttr !== null && String(phIdxAttr).length > 0;
  const hasType = phTypeAttr !== void 0 && phTypeAttr !== null && String(phTypeAttr).length > 0;
  if (!hasIdx && !hasType) return target;
  target.isPlaceholder = true;
  if (hasType) target.placeholderType = phTypeAttr;
  if (hasIdx) target.placeholderIdx = String(phIdxAttr);
  return target;
}
async function parse2(file, options = {}) {
  const slides = [];
  const loadedImages = {};
  const loadedVideos = {};
  const loadedAudios = {};
  const parseOptions = {
    ...options,
    imageMode: options.imageMode || "base64",
    videoMode: options.videoMode || "none",
    audioMode: options.audioMode || "none"
  };
  const zip = await import_jszip.default.loadAsync(file);
  const filesInfo = await getContentTypes(zip);
  const { width, height, defaultTextStyle } = await getSlideInfo(zip);
  const { themeContent, themeColors } = await getTheme(zip);
  const usedFonts = await getUsedFonts(zip);
  for (const filename of filesInfo.slides) {
    const singleSlide = await processSingleSlide(zip, filename, themeContent, defaultTextStyle, loadedImages, loadedVideos, loadedAudios, parseOptions);
    slides.push(singleSlide);
  }
  return {
    slides,
    usedFonts,
    themeColors,
    size: {
      width,
      height
    }
  };
}
async function getContentTypes(zip) {
  const ContentTypesJson = await readXmlFile(zip, "[Content_Types].xml");
  const subObj = ContentTypesJson["Types"]["Override"];
  let slidesLocArray = [];
  let slideLayoutsLocArray = [];
  for (const item of subObj) {
    switch (item["attrs"]["ContentType"]) {
      case "application/vnd.openxmlformats-officedocument.presentationml.slide+xml":
        slidesLocArray.push(item["attrs"]["PartName"].substr(1));
        break;
      case "application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml":
        slideLayoutsLocArray.push(item["attrs"]["PartName"].substr(1));
        break;
      default:
    }
  }
  const sortSlideXml = (p1, p2) => {
    const n1 = +/(\d+)\.xml/.exec(p1)[1];
    const n2 = +/(\d+)\.xml/.exec(p2)[1];
    return n1 - n2;
  };
  slidesLocArray = slidesLocArray.sort(sortSlideXml);
  slideLayoutsLocArray = slideLayoutsLocArray.sort(sortSlideXml);
  return {
    slides: slidesLocArray,
    slideLayouts: slideLayoutsLocArray
  };
}
async function getUsedFonts(zip) {
  const content = await readXmlFile(zip, "ppt/presentation.xml");
  const embeddedFontList = getTextByPathList(content, ["p:presentation", "p:embeddedFontLst", "p:embeddedFont"]);
  const usedFonts = [];
  if (!embeddedFontList) return usedFonts;
  const embeddedFonts = embeddedFontList.constructor === Array ? embeddedFontList : [embeddedFontList];
  for (const embeddedFont of embeddedFonts) {
    const typeface = getTextByPathList(embeddedFont, ["p:font", "attrs", "typeface"]);
    if (typeface && !usedFonts.includes(typeface)) usedFonts.push(typeface);
  }
  return usedFonts;
}
async function getSlideInfo(zip) {
  const content = await readXmlFile(zip, "ppt/presentation.xml");
  const sldSzAttrs = content["p:presentation"]["p:sldSz"]["attrs"];
  const defaultTextStyle = content["p:presentation"]["p:defaultTextStyle"];
  return {
    width: parseInt(sldSzAttrs["cx"]) * RATIO_EMUs_Points,
    height: parseInt(sldSzAttrs["cy"]) * RATIO_EMUs_Points,
    defaultTextStyle
  };
}
async function getTheme(zip) {
  const preResContent = await readXmlFile(zip, "ppt/_rels/presentation.xml.rels");
  const relationshipArray = preResContent["Relationships"]["Relationship"];
  let themeURI;
  if (relationshipArray.constructor === Array) {
    for (const relationshipItem of relationshipArray) {
      if (relationshipItem["attrs"]["Type"] === "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme") {
        themeURI = relationshipItem["attrs"]["Target"];
        break;
      }
    }
  } else if (relationshipArray["attrs"]["Type"] === "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme") {
    themeURI = relationshipArray["attrs"]["Target"];
  }
  const themeContent = await readXmlFile(zip, "ppt/" + themeURI);
  const themeColors = [];
  const clrScheme = getTextByPathList(themeContent, ["a:theme", "a:themeElements", "a:clrScheme"]);
  if (clrScheme) {
    for (let i = 1; i <= 6; i++) {
      if (clrScheme[`a:accent${i}`] === void 0) break;
      const color = getTextByPathList(clrScheme, [`a:accent${i}`, "a:srgbClr", "attrs", "val"]);
      if (color) themeColors.push("#" + color);
    }
  }
  return { themeContent, themeColors };
}
async function processSingleSlide(zip, sldFileName, themeContent, defaultTextStyle, loadedImages, loadedVideos, loadedAudios, options) {
  const resName = sldFileName.replace("slides/slide", "slides/_rels/slide") + ".rels";
  const resContent = await readXmlFile(zip, resName);
  let relationshipArray = resContent["Relationships"]["Relationship"];
  if (relationshipArray.constructor !== Array) relationshipArray = [relationshipArray];
  let noteFilename = "";
  let layoutFilename = "";
  let masterFilename = "";
  let themeFilename = "";
  const slideResObj = {};
  const layoutResObj = {};
  const masterResObj = {};
  const themeResObj = {};
  for (const relationshipArrayItem of relationshipArray) {
    const relType = relationshipArrayItem["attrs"]["Type"].replace("http://schemas.openxmlformats.org/officeDocument/2006/relationships/", "");
    let relTarget = relationshipArrayItem["attrs"]["Target"];
    const isExternal = relationshipArrayItem["attrs"]["TargetMode"] === "External";
    if (!isExternal) {
      if (relTarget.indexOf("../") !== -1) relTarget = relTarget.replace("../", "ppt/");
      else relTarget = "ppt/slides/" + relTarget;
    }
    switch (relationshipArrayItem["attrs"]["Type"]) {
      case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout":
        layoutFilename = relTarget;
        slideResObj[relationshipArrayItem["attrs"]["Id"]] = {
          type: relType,
          target: relTarget
        };
        break;
      case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide":
        noteFilename = relTarget;
        slideResObj[relationshipArrayItem["attrs"]["Id"]] = {
          type: relType,
          target: relTarget
        };
        break;
      case "http://schemas.microsoft.com/office/2007/relationships/diagramDrawing":
      case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramData":
      case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramLayout":
      case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramQuickStyle":
      case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramColors":
        slideResObj[relationshipArrayItem["attrs"]["Id"]] = {
          type: relType,
          target: relTarget
        };
        break;
      case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image":
      case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart":
      case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink":
      default:
        slideResObj[relationshipArrayItem["attrs"]["Id"]] = {
          type: relType,
          target: relTarget
        };
    }
  }
  const slideNotesContent = await readXmlFile(zip, noteFilename);
  const note = getNote(slideNotesContent);
  const slideLayoutContent = await readXmlFile(zip, layoutFilename);
  const slideLayoutTables = await indexNodes(slideLayoutContent);
  const slideLayoutResFilename = layoutFilename.replace("slideLayouts/slideLayout", "slideLayouts/_rels/slideLayout") + ".rels";
  const slideLayoutResContent = await readXmlFile(zip, slideLayoutResFilename);
  relationshipArray = slideLayoutResContent["Relationships"]["Relationship"];
  if (relationshipArray.constructor !== Array) relationshipArray = [relationshipArray];
  for (const relationshipArrayItem of relationshipArray) {
    const relType = relationshipArrayItem["attrs"]["Type"].replace("http://schemas.openxmlformats.org/officeDocument/2006/relationships/", "");
    let relTarget = relationshipArrayItem["attrs"]["Target"];
    if (relTarget.indexOf("../") !== -1) relTarget = relTarget.replace("../", "ppt/");
    else relTarget = "ppt/slideLayouts/" + relTarget;
    switch (relationshipArrayItem["attrs"]["Type"]) {
      case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster":
        masterFilename = relTarget;
        break;
      default:
        layoutResObj[relationshipArrayItem["attrs"]["Id"]] = {
          type: relType,
          target: relTarget
        };
    }
  }
  const slideMasterContent = await readXmlFile(zip, masterFilename);
  const slideMasterTextStyles = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:txStyles"]);
  const slideMasterTables = indexNodes(slideMasterContent);
  const slideMasterResFilename = masterFilename.replace("slideMasters/slideMaster", "slideMasters/_rels/slideMaster") + ".rels";
  const slideMasterResContent = await readXmlFile(zip, slideMasterResFilename);
  relationshipArray = slideMasterResContent["Relationships"]["Relationship"];
  if (relationshipArray.constructor !== Array) relationshipArray = [relationshipArray];
  for (const relationshipArrayItem of relationshipArray) {
    const relType = relationshipArrayItem["attrs"]["Type"].replace("http://schemas.openxmlformats.org/officeDocument/2006/relationships/", "");
    let relTarget = relationshipArrayItem["attrs"]["Target"];
    if (relTarget.indexOf("../") !== -1) relTarget = relTarget.replace("../", "ppt/");
    else relTarget = "ppt/slideMasters/" + relTarget;
    switch (relationshipArrayItem["attrs"]["Type"]) {
      case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme":
        themeFilename = relTarget;
        break;
      default:
        masterResObj[relationshipArrayItem["attrs"]["Id"]] = {
          type: relType,
          target: relTarget
        };
    }
  }
  if (themeFilename) {
    const themeName = themeFilename.split("/").pop();
    const themeResFileName = themeFilename.replace(themeName, "_rels/" + themeName) + ".rels";
    const themeResContent = await readXmlFile(zip, themeResFileName);
    if (themeResContent) {
      relationshipArray = themeResContent["Relationships"]["Relationship"];
      if (relationshipArray) {
        if (relationshipArray.constructor !== Array) relationshipArray = [relationshipArray];
        for (const relationshipArrayItem of relationshipArray) {
          themeResObj[relationshipArrayItem["attrs"]["Id"]] = {
            "type": relationshipArrayItem["attrs"]["Type"].replace("http://schemas.openxmlformats.org/officeDocument/2006/relationships/", ""),
            "target": relationshipArrayItem["attrs"]["Target"].replace("../", "ppt/")
          };
        }
      }
    }
  }
  const tableStyles = await readXmlFile(zip, "ppt/tableStyles.xml");
  const slideContent = await readXmlFile(zip, sldFileName);
  const nodes = slideContent["p:sld"]["p:cSld"]["p:spTree"];
  const warpObj = {
    zip,
    loadedImages,
    loadedVideos,
    loadedAudios,
    options,
    slideLayoutContent,
    slideLayoutTables,
    slideMasterContent,
    slideMasterTables,
    slideContent,
    tableStyles,
    slideResObj,
    slideMasterTextStyles,
    layoutResObj,
    masterResObj,
    themeContent,
    themeResObj,
    diagramFileCache: {},
    defaultTextStyle
  };
  const layoutElements = await getLayoutElements(warpObj);
  const fill = await getSlideBackgroundFill(warpObj);
  const elements = [];
  for (const nodeKey in nodes) {
    if (nodes[nodeKey].constructor !== Array) nodes[nodeKey] = [nodes[nodeKey]];
    for (const node of nodes[nodeKey]) {
      const ret = await processNodesInSlide(nodeKey, node, warpObj, "slide");
      if (ret) elements.push(ret);
    }
  }
  let transitionNode = findTransitionNode(slideContent, "p:sld");
  if (!transitionNode) transitionNode = findTransitionNode(slideLayoutContent, "p:sldLayout");
  if (!transitionNode) transitionNode = findTransitionNode(slideMasterContent, "p:sldMaster");
  const transition = parseTransition(transitionNode);
  return {
    fill,
    elements,
    layoutElements,
    note,
    transition
  };
}
function getHyperlinkFromCNvPr(cNvPr, warpObj) {
  const hlinkClick = getTextByPathList(cNvPr, ["a:hlinkClick", "attrs"]);
  if (!hlinkClick) return null;
  const linkId = hlinkClick["r:id"];
  if (!linkId) return null;
  const res = warpObj["slideResObj"][linkId];
  if (!res) return null;
  if (res["type"] !== "hyperlink") return null;
  const target = res["target"];
  if (!target || !/^https?:\/\//.test(target)) return null;
  return target;
}
function getNote(noteContent) {
  let text = "";
  let spNodes = getTextByPathList(noteContent, ["p:notes", "p:cSld", "p:spTree", "p:sp"]);
  if (!spNodes) return "";
  if (spNodes.constructor !== Array) spNodes = [spNodes];
  for (const spNode of spNodes) {
    const phType = getTextByPathList(spNode, ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "type"]);
    if (phType !== "body") continue;
    const textBody = getTextByPathList(spNode, ["p:txBody"]);
    if (!textBody) continue;
    let pNode = textBody["a:p"];
    if (!pNode) continue;
    if (pNode.constructor !== Array) pNode = [pNode];
    const listTypes = [];
    for (const p of pNode) {
      const pPr = p["a:pPr"];
      const algn = getTextByPathList(pPr, ["attrs", "algn"]);
      let align = "left";
      if (algn) {
        switch (algn) {
          case "r":
            align = "right";
            break;
          case "ctr":
            align = "center";
            break;
          case "just":
          case "dist":
            align = "justify";
            break;
          default:
            break;
        }
      }
      let listType = "";
      if (pPr) {
        if (pPr["a:buChar"]) listType = "ul";
        else if (pPr["a:buAutoNum"]) listType = "ol";
      }
      const lvlNode = getTextByPathList(pPr, ["attrs", "lvl"]);
      const listLevel = lvlNode !== void 0 ? parseInt(lvlNode) : 0;
      if (listType) {
        while (listTypes.length > listLevel + 1) {
          text += `</${listTypes.pop()}>`;
        }
        if (listTypes[listLevel] === void 0) {
          text += `<${listType}>`;
          listTypes[listLevel] = listType;
        } else if (listTypes[listLevel] !== listType) {
          text += `</${listTypes[listLevel]}>`;
          text += `<${listType}>`;
          listTypes[listLevel] = listType;
        }
        text += `<li style="text-align:${align};">`;
      } else {
        while (listTypes.length > 0) {
          text += `</${listTypes.pop()}>`;
        }
        text += `<p style="text-align:${align};">`;
      }
      let rNodes = p["a:r"];
      if (rNodes) {
        if (rNodes.constructor !== Array) rNodes = [rNodes];
        for (const r of rNodes) {
          const t = getTextNodeValue(getTextByPathList(r, ["a:t"]));
          if (t && typeof t === "string") text += t;
        }
      }
      if (listType) text += "</li>";
      else text += "</p>";
    }
    while (listTypes.length > 0) {
      text += `</${listTypes.pop()}>`;
    }
  }
  return text;
}
async function getLayoutElements(warpObj) {
  const elements = [];
  const slideLayoutContent = warpObj["slideLayoutContent"];
  const slideMasterContent = warpObj["slideMasterContent"];
  const nodesSldLayout = getTextByPathList(slideLayoutContent, ["p:sldLayout", "p:cSld", "p:spTree"]);
  const nodesSldMaster = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:cSld", "p:spTree"]);
  const showMasterSp = getTextByPathList(slideLayoutContent, ["p:sldLayout", "attrs", "showMasterSp"]);
  if (nodesSldLayout) {
    for (const nodeKey in nodesSldLayout) {
      if (nodesSldLayout[nodeKey].constructor === Array) {
        for (let i = 0; i < nodesSldLayout[nodeKey].length; i++) {
          const ph = getTextByPathList(nodesSldLayout[nodeKey][i], ["p:nvSpPr", "p:nvPr", "p:ph"]);
          if (!ph) {
            const ret = await processNodesInSlide(nodeKey, nodesSldLayout[nodeKey][i], warpObj, "slideLayoutBg");
            if (ret) elements.push(ret);
          }
        }
      } else {
        const ph = getTextByPathList(nodesSldLayout[nodeKey], ["p:nvSpPr", "p:nvPr", "p:ph"]);
        if (!ph) {
          const ret = await processNodesInSlide(nodeKey, nodesSldLayout[nodeKey], warpObj, "slideLayoutBg");
          if (ret) elements.push(ret);
        }
      }
    }
  }
  if (nodesSldMaster && showMasterSp !== "0") {
    for (const nodeKey in nodesSldMaster) {
      if (nodesSldMaster[nodeKey].constructor === Array) {
        for (let i = 0; i < nodesSldMaster[nodeKey].length; i++) {
          const ph = getTextByPathList(nodesSldMaster[nodeKey][i], ["p:nvSpPr", "p:nvPr", "p:ph"]);
          if (!ph) {
            const ret = await processNodesInSlide(nodeKey, nodesSldMaster[nodeKey][i], warpObj, "slideMasterBg");
            if (ret) elements.push(ret);
          }
        }
      } else {
        const ph = getTextByPathList(nodesSldMaster[nodeKey], ["p:nvSpPr", "p:nvPr", "p:ph"]);
        if (!ph) {
          const ret = await processNodesInSlide(nodeKey, nodesSldMaster[nodeKey], warpObj, "slideMasterBg");
          if (ret) elements.push(ret);
        }
      }
    }
  }
  return elements;
}
function indexNodes(content) {
  const keys = Object.keys(content);
  const spTreeNode = content[keys[0]]["p:cSld"]["p:spTree"];
  const idTable = {};
  const idxTable = {};
  const typeTable = {};
  for (const key in spTreeNode) {
    if (key === "p:nvGrpSpPr" || key === "p:grpSpPr") continue;
    const targetNode = spTreeNode[key];
    if (targetNode.constructor === Array) {
      for (const targetNodeItem of targetNode) {
        const nvSpPrNode = targetNodeItem["p:nvSpPr"];
        const id = getTextByPathList(nvSpPrNode, ["p:cNvPr", "attrs", "id"]);
        const idx = getTextByPathList(nvSpPrNode, ["p:nvPr", "p:ph", "attrs", "idx"]);
        const type = getTextByPathList(nvSpPrNode, ["p:nvPr", "p:ph", "attrs", "type"]);
        if (id) idTable[id] = targetNodeItem;
        if (idx) idxTable[idx] = targetNodeItem;
        if (type && !typeTable[type]) typeTable[type] = targetNodeItem;
      }
    } else {
      const nvSpPrNode = targetNode["p:nvSpPr"];
      const id = getTextByPathList(nvSpPrNode, ["p:cNvPr", "attrs", "id"]);
      const idx = getTextByPathList(nvSpPrNode, ["p:nvPr", "p:ph", "attrs", "idx"]);
      const type = getTextByPathList(nvSpPrNode, ["p:nvPr", "p:ph", "attrs", "type"]);
      if (id) idTable[id] = targetNode;
      if (idx) idxTable[idx] = targetNode;
      if (type && !typeTable[type]) typeTable[type] = targetNode;
    }
  }
  return { idTable, idxTable, typeTable };
}
async function processNodesInSlide(nodeKey, nodeValue, warpObj, source, groupHierarchy = []) {
  let json;
  switch (nodeKey) {
    case "p:sp":
      json = await processSpNode(nodeValue, warpObj, source, groupHierarchy);
      break;
    case "p:cxnSp":
      json = await processCxnSpNode(nodeValue, warpObj, source);
      break;
    case "p:pic":
      json = await processPicNode(nodeValue, warpObj, source);
      break;
    case "p:graphicFrame":
      json = await processGraphicFrameNode(nodeValue, warpObj, source);
      break;
    case "p:grpSp":
      json = await processGroupSpNode(nodeValue, warpObj, source, groupHierarchy);
      break;
    case "mc:AlternateContent":
      if (getTextByPathList(nodeValue, ["mc:Fallback", "p:grpSpPr", "a:xfrm"])) {
        json = await processGroupSpNode(getTextByPathList(nodeValue, ["mc:Fallback"]), warpObj, source, groupHierarchy);
      } else if (getTextByPathList(nodeValue, ["mc:Choice"])) {
        json = await processMathNode(nodeValue, warpObj, source);
      }
      break;
    default:
  }
  return json;
}
async function processMathNode(node, warpObj, source) {
  const choice = getTextByPathList(node, ["mc:Choice"]);
  const fallback = getTextByPathList(node, ["mc:Fallback"]);
  const order = node["attrs"]["order"];
  const xfrmNode = getTextByPathList(choice, ["p:sp", "p:spPr", "a:xfrm"]);
  const { top, left } = getPosition(xfrmNode, void 0, void 0);
  const { width, height } = getSize(xfrmNode, void 0, void 0);
  const oMath = findOMath(choice)[0];
  const latex = latexFormart(parseOMath(oMath));
  const blipFill = getTextByPathList(fallback, ["p:sp", "p:spPr", "a:blipFill"]);
  const picFill = await getPicFill(source, blipFill, warpObj);
  let text = "";
  if (getTextByPathList(choice, ["p:sp", "p:txBody", "a:p", "a:r"])) {
    const sp = getTextByPathList(choice, ["p:sp"]);
    text = genTextBody(sp["p:txBody"], sp, void 0, void 0, void 0, warpObj);
  }
  return {
    type: "math",
    top,
    left,
    width,
    height,
    latex,
    picRef: picFill.ref,
    picBase64: picFill.base64,
    picBlob: picFill.blob,
    text,
    order
  };
}
async function processGroupSpNode(node, warpObj, source, parentGroupHierarchy = []) {
  const order = node["attrs"]["order"];
  const xfrmNode = getTextByPathList(node, ["p:grpSpPr", "a:xfrm"]);
  if (!xfrmNode) return null;
  const x = parseInt(xfrmNode["a:off"]["attrs"]["x"]) * RATIO_EMUs_Points;
  const y = parseInt(xfrmNode["a:off"]["attrs"]["y"]) * RATIO_EMUs_Points;
  const chx = parseInt(xfrmNode["a:chOff"]["attrs"]["x"]) * RATIO_EMUs_Points;
  const chy = parseInt(xfrmNode["a:chOff"]["attrs"]["y"]) * RATIO_EMUs_Points;
  const cx = parseInt(xfrmNode["a:ext"]["attrs"]["cx"]) * RATIO_EMUs_Points;
  const cy = parseInt(xfrmNode["a:ext"]["attrs"]["cy"]) * RATIO_EMUs_Points;
  const chcx = parseInt(xfrmNode["a:chExt"]["attrs"]["cx"]) * RATIO_EMUs_Points;
  const chcy = parseInt(xfrmNode["a:chExt"]["attrs"]["cy"]) * RATIO_EMUs_Points;
  const isFlipV = getTextByPathList(xfrmNode, ["attrs", "flipV"]) === "1";
  const isFlipH = getTextByPathList(xfrmNode, ["attrs", "flipH"]) === "1";
  let rotate = getTextByPathList(xfrmNode, ["attrs", "rot"]) || 0;
  if (rotate) rotate = angleToDegrees(rotate);
  const ws = cx / chcx;
  const hs = cy / chcy;
  const currentGroupHierarchy = [...parentGroupHierarchy, node];
  const elements = [];
  for (const nodeKey in node) {
    if (node[nodeKey].constructor === Array) {
      for (const item of node[nodeKey]) {
        const ret = await processNodesInSlide(nodeKey, item, warpObj, source, currentGroupHierarchy);
        if (ret) elements.push(ret);
      }
    } else {
      const ret = await processNodesInSlide(nodeKey, node[nodeKey], warpObj, source, currentGroupHierarchy);
      if (ret) elements.push(ret);
    }
  }
  const processedElements = elements.map((element) => ({
    ...element,
    left: numberToFixed((element.left - chx) * ws),
    top: numberToFixed((element.top - chy) * hs),
    width: numberToFixed(element.width * ws),
    height: numberToFixed(element.height * hs),
    ...element.type === "group" && element.elements ? {
      elements: processNestedGroupElements(element.elements, ws, hs)
    } : {}
  }));
  function processNestedGroupElements(elements2, ws2, hs2, depth = 0) {
    if (depth > 10) return elements2;
    return elements2.map((element) => {
      const processed = {
        ...element,
        left: numberToFixed(element.left * ws2),
        top: numberToFixed(element.top * hs2),
        width: numberToFixed(element.width * ws2),
        height: numberToFixed(element.height * hs2)
      };
      if (element.type === "group" && element.elements) {
        processed.elements = processNestedGroupElements(element.elements, ws2, hs2, depth + 1);
      }
      return processed;
    });
  }
  return {
    type: "group",
    top: numberToFixed(y),
    left: numberToFixed(x),
    width: numberToFixed(cx),
    height: numberToFixed(cy),
    rotate,
    order,
    isFlipV,
    isFlipH,
    elements: processedElements
  };
}
async function processSpNode(node, warpObj, source, groupHierarchy = []) {
  const cNvPr = getTextByPathList(node, ["p:nvSpPr", "p:cNvPr"]);
  const name = getTextByPathList(cNvPr, ["attrs", "name"]);
  const phIdxAttr = getTextByPathList(node, ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "idx"]);
  const phTypeAttr = getTextByPathList(node, ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "type"]);
  const idx = phIdxAttr;
  let type = phTypeAttr;
  const order = getTextByPathList(node, ["attrs", "order"]);
  let slideLayoutSpNode, slideMasterSpNode;
  if (type) {
    if (idx) {
      slideLayoutSpNode = warpObj["slideLayoutTables"]["idxTable"][idx];
      slideMasterSpNode = warpObj["slideMasterTables"]["idxTable"][idx];
      if (!slideLayoutSpNode) slideLayoutSpNode = warpObj["slideLayoutTables"]["typeTable"][type];
      if (!slideMasterSpNode) slideMasterSpNode = warpObj["slideMasterTables"]["typeTable"][type];
    } else {
      slideLayoutSpNode = warpObj["slideLayoutTables"]["typeTable"][type];
      slideMasterSpNode = warpObj["slideMasterTables"]["typeTable"][type];
    }
  } else if (idx) {
    slideLayoutSpNode = warpObj["slideLayoutTables"]["idxTable"][idx];
    slideMasterSpNode = warpObj["slideMasterTables"]["idxTable"][idx];
  }
  if (!type) {
    const txBoxVal = getTextByPathList(node, ["p:nvSpPr", "p:cNvSpPr", "attrs", "txBox"]);
    if (txBoxVal === "1") type = "text";
  }
  if (!type) type = getTextByPathList(slideLayoutSpNode, ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "type"]);
  if (!type) type = getTextByPathList(slideMasterSpNode, ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "type"]);
  if (!slideMasterSpNode && type === "ctrTitle") slideMasterSpNode = warpObj["slideMasterTables"]["typeTable"]["title"];
  if (!type) {
    if (source === "diagramBg") type = "diagram";
    else type = "obj";
  }
  const link = getHyperlinkFromCNvPr(cNvPr, warpObj);
  return await genShape(node, slideLayoutSpNode, slideMasterSpNode, name, type, order, warpObj, source, link, groupHierarchy, phIdxAttr, phTypeAttr);
}
async function processCxnSpNode(node, warpObj, source) {
  const cNvPr = getTextByPathList(node, ["p:nvCxnSpPr", "p:cNvPr"]);
  const name = getTextByPathList(cNvPr, ["attrs", "name"]);
  const phIdxAttr = getTextByPathList(node, ["p:nvCxnSpPr", "p:nvPr", "p:ph", "attrs", "idx"]);
  const phTypeAttr = getTextByPathList(node, ["p:nvCxnSpPr", "p:nvPr", "p:ph", "attrs", "type"]);
  const type = phTypeAttr;
  const order = node["attrs"]["order"];
  const link = getHyperlinkFromCNvPr(cNvPr, warpObj);
  return await genShape(node, void 0, void 0, name, type, order, warpObj, source, link, [], phIdxAttr, phTypeAttr);
}
async function genShape(node, slideLayoutSpNode, slideMasterSpNode, name, type, order, warpObj, source, link, groupHierarchy = [], phIdxAttr = void 0, phTypeAttr = void 0) {
  const fin = (o) => wisedeckApplyPlaceholderProps(o, phIdxAttr, phTypeAttr);
  const xfrmList = ["p:spPr", "a:xfrm"];
  const slideXfrmNode = getTextByPathList(node, xfrmList);
  const slideLayoutXfrmNode = getTextByPathList(slideLayoutSpNode, xfrmList);
  const slideMasterXfrmNode = getTextByPathList(slideMasterSpNode, xfrmList);
  const shapType = getTextByPathList(node, ["p:spPr", "a:prstGeom", "attrs", "prst"]);
  const custShapType = getTextByPathList(node, ["p:spPr", "a:custGeom"]);
  const keypoints = {};
  if (shapType) {
    const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
    if (shapAdjst_ary) {
      const adjList = Array.isArray(shapAdjst_ary) ? shapAdjst_ary : [shapAdjst_ary];
      for (const adj of adjList) {
        const name2 = getTextByPathList(adj, ["attrs", "name"]);
        const fmla = getTextByPathList(adj, ["attrs", "fmla"]);
        if (name2 && fmla && fmla.startsWith("val ")) {
          keypoints[name2] = parseInt(fmla.substring(4)) / 5e4;
        }
      }
    }
  }
  const { top, left } = getPosition(slideXfrmNode, slideLayoutXfrmNode, slideMasterXfrmNode);
  const { width, height } = getSize(slideXfrmNode, slideLayoutXfrmNode, slideMasterXfrmNode);
  const isFlipV = getTextByPathList(slideXfrmNode, ["attrs", "flipV"]) === "1";
  const isFlipH = getTextByPathList(slideXfrmNode, ["attrs", "flipH"]) === "1";
  const rotate = angleToDegrees(getTextByPathList(slideXfrmNode, ["attrs", "rot"]));
  const txtXframeNode = getTextByPathList(node, ["p:txXfrm"]);
  let txtRotate;
  if (txtXframeNode) {
    const txtXframeRot = getTextByPathList(txtXframeNode, ["attrs", "rot"]);
    if (txtXframeRot) txtRotate = angleToDegrees(txtXframeRot) + 90;
  } else txtRotate = rotate;
  let content = "";
  if (node["p:txBody"]) content = genTextBody(node["p:txBody"], node, slideLayoutSpNode, slideMasterSpNode, type, warpObj);
  const { borderColor, borderWidth, borderType, strokeDasharray } = getBorder(node, type, warpObj);
  const fill = await getShapeFill(node, warpObj, source, groupHierarchy);
  let shadow;
  const outerShdwNode = getTextByPathList(node, ["p:spPr", "a:effectLst", "a:outerShdw"]);
  if (outerShdwNode) shadow = getShadow(outerShdwNode, warpObj);
  const vAlign = getVerticalAlign(node, slideLayoutSpNode, slideMasterSpNode, type);
  const isVertical = getTextByPathList(node, ["p:txBody", "a:bodyPr", "attrs", "vert"]) === "eaVert";
  const autoFit = getTextAutoFit(node, slideLayoutSpNode, slideMasterSpNode);
  const data = {
    left,
    top,
    width,
    height,
    borderColor,
    borderWidth,
    borderType,
    borderStrokeDasharray: strokeDasharray,
    fill,
    content,
    isFlipV,
    isFlipH,
    rotate,
    vAlign,
    name,
    order
  };
  if (shadow) data.shadow = shadow;
  if (autoFit) data.autoFit = autoFit;
  if (link) data.link = link;
  const isHasValidText = data.content && hasValidText(data.content);
  if (custShapType && type !== "diagram") {
    const ext = getTextByPathList(slideXfrmNode, ["a:ext", "attrs"]);
    const w = parseInt(ext["cx"]) * RATIO_EMUs_Points;
    const h = parseInt(ext["cy"]) * RATIO_EMUs_Points;
    const d = getCustomShapePath(custShapType, w, h);
    if (!isHasValidText) data.content = "";
    return fin({
      ...data,
      type: "shape",
      shapType: "custom",
      path: d
    });
  }
  let shapePath = "";
  if (shapType) shapePath = getShapePath(shapType, width, height, node);
  if (shapType && (type === "obj" || !type || shapType !== "rect")) {
    if (!isHasValidText) data.content = "";
    return fin({
      ...data,
      type: "shape",
      shapType,
      path: shapePath,
      keypoints
    });
  }
  if (shapType && !isHasValidText && (fill || borderWidth)) {
    return fin({
      ...data,
      type: "shape",
      content: "",
      shapType,
      path: shapePath,
      keypoints
    });
  }
  return fin({
    ...data,
    type: "text",
    isVertical,
    rotate: txtRotate
  });
}
async function processPicNode(node, warpObj, source) {
  let resObj;
  if (source === "slideMasterBg") resObj = warpObj["masterResObj"];
  else if (source === "slideLayoutBg") resObj = warpObj["layoutResObj"];
  else resObj = warpObj["slideResObj"];
  const cNvPr = getTextByPathList(node, ["p:nvPicPr", "p:cNvPr"]);
  const link = getHyperlinkFromCNvPr(cNvPr, warpObj);
  const order = node["attrs"]["order"];
  const phIdxAttrPic = getTextByPathList(node, ["p:nvPicPr", "p:nvPr", "p:ph", "attrs", "idx"]);
  const phTypeAttrPic = getTextByPathList(node, ["p:nvPicPr", "p:nvPr", "p:ph", "attrs", "type"]);
  const picFin = (o) => o ? wisedeckApplyPlaceholderProps(o, phIdxAttrPic, phTypeAttrPic) : o;
  const rid = node["p:blipFill"]["a:blip"]["attrs"]["r:embed"];
  if (!rid || !resObj[rid]) return null;
  const imgName = resObj[rid]["target"];
  let xfrmNode = node["p:spPr"]["a:xfrm"];
  if (!xfrmNode) {
    const idx = getTextByPathList(node, ["p:nvPicPr", "p:nvPr", "p:ph", "attrs", "idx"]);
    if (idx) xfrmNode = getTextByPathList(warpObj["slideLayoutTables"], ["idxTable", idx, "p:spPr", "a:xfrm"]);
  }
  const { top, left } = getPosition(xfrmNode, void 0, void 0);
  const { width, height } = getSize(xfrmNode, void 0, void 0);
  const imageData = await getImageData(imgName, warpObj);
  const isFlipV = getTextByPathList(xfrmNode, ["attrs", "flipV"]) === "1";
  const isFlipH = getTextByPathList(xfrmNode, ["attrs", "flipH"]) === "1";
  let rotate = 0;
  const rotateNode = getTextByPathList(node, ["p:spPr", "a:xfrm", "attrs", "rot"]);
  if (rotateNode) rotate = angleToDegrees(rotateNode);
  const videoNode = getTextByPathList(node, ["p:nvPicPr", "p:nvPr", "a:videoFile"]);
  let videoRid, videoFile, videoFileExt;
  let videoData = {
    ref: "",
    blob: ""
  };
  let isVdeoLink = false;
  if (videoNode) {
    videoRid = videoNode["attrs"]["r:link"];
    videoFile = resObj[videoRid]["target"];
    if (isVideoLink(videoFile)) {
      videoFile = escapeHtml(videoFile);
      isVdeoLink = true;
    } else {
      videoFileExt = extractFileExtension(videoFile).toLowerCase();
      if (videoFileExt === "mp4" || videoFileExt === "webm" || videoFileExt === "ogg") {
        videoData = await getVideoData(videoFile, warpObj);
      } else {
        videoData = {
          ref: videoFile,
          blob: ""
        };
      }
    }
    if (isVdeoLink) {
      videoData = {
        ref: videoFile,
        blob: ""
      };
    }
  }
  const audioNode = getTextByPathList(node, ["p:nvPicPr", "p:nvPr", "a:audioFile"]);
  let audioRid, audioFile, audioFileExt;
  let audioData = {
    ref: "",
    blob: ""
  };
  if (audioNode) {
    audioRid = audioNode["attrs"]["r:link"];
    audioFile = resObj[audioRid]["target"];
    audioFileExt = extractFileExtension(audioFile).toLowerCase();
    if (audioFileExt === "mp3" || audioFileExt === "wav" || audioFileExt === "ogg") {
      audioData = await getAudioData(audioFile, warpObj);
    } else {
      audioData = {
        ref: audioFile,
        blob: ""
      };
    }
  }
  if (videoNode && !isVdeoLink) {
    return picFin({
      type: "video",
      top,
      left,
      width,
      height,
      rotate,
      ref: videoData.ref,
      blob: videoData.blob,
      order
    });
  }
  if (videoNode && isVdeoLink) {
    return picFin({
      type: "video",
      top,
      left,
      width,
      height,
      rotate,
      ref: videoData.ref,
      blob: videoData.blob,
      order
    });
  }
  if (audioNode) {
    return picFin({
      type: "audio",
      top,
      left,
      width,
      height,
      rotate,
      ref: audioData.ref,
      blob: audioData.blob,
      order
    });
  }
  let rect;
  const srcRectAttrs = getTextByPathList(node, ["p:blipFill", "a:srcRect", "attrs"]);
  if (srcRectAttrs && (srcRectAttrs.t || srcRectAttrs.b || srcRectAttrs.l || srcRectAttrs.r)) {
    rect = {};
    if (srcRectAttrs.t) rect.t = srcRectAttrs.t / 1e3;
    if (srcRectAttrs.b) rect.b = srcRectAttrs.b / 1e3;
    if (srcRectAttrs.l) rect.l = srcRectAttrs.l / 1e3;
    if (srcRectAttrs.r) rect.r = srcRectAttrs.r / 1e3;
  }
  let geom = "rect";
  const prstGeom = getTextByPathList(node, ["p:spPr", "a:prstGeom", "attrs", "prst"]);
  const custGeom = getTextByPathList(node, ["p:spPr", "a:custGeom"]);
  if (prstGeom) {
    geom = prstGeom;
  } else if (custGeom) {
    geom = identifyShape(custGeom);
    if (geom !== "custom") geom = `custom:${geom}`;
  }
  const { borderColor, borderWidth, borderType, strokeDasharray } = getBorder(node, void 0, warpObj);
  const filters = getPicFilters(node["p:blipFill"]);
  const imageDataJson = {
    type: "image",
    top,
    left,
    width,
    height,
    rotate,
    ref: imageData.ref,
    base64: imageData.base64,
    blob: imageData.blob,
    isFlipV,
    isFlipH,
    order,
    rect,
    geom,
    borderColor,
    borderWidth,
    borderType,
    borderStrokeDasharray: strokeDasharray
  };
  if (filters) imageDataJson.filters = filters;
  if (link) imageDataJson.link = link;
  return picFin(imageDataJson);
}
async function processGraphicFrameNode(node, warpObj, source) {
  const graphicTypeUri = getTextByPathList(node, ["a:graphic", "a:graphicData", "attrs", "uri"]);
  let result;
  switch (graphicTypeUri) {
    case "http://schemas.openxmlformats.org/drawingml/2006/table":
      result = await genTable(node, warpObj);
      break;
    case "http://schemas.openxmlformats.org/drawingml/2006/chart":
      result = await genChart(node, warpObj);
      break;
    case "http://schemas.openxmlformats.org/drawingml/2006/diagram":
      result = await genDiagram(node, warpObj);
      break;
    case "http://schemas.openxmlformats.org/presentationml/2006/ole":
      let oleObjNode = getTextByPathList(node, ["a:graphic", "a:graphicData", "mc:AlternateContent", "mc:Fallback", "p:oleObj"]);
      if (!oleObjNode) oleObjNode = getTextByPathList(node, ["a:graphic", "a:graphicData", "p:oleObj"]);
      if (oleObjNode) result = await processGroupSpNode(oleObjNode, warpObj, source);
      break;
    default:
  }
  return result;
}
async function genTable(node, warpObj) {
  const order = node["attrs"]["order"];
  const tableNode = getTextByPathList(node, ["a:graphic", "a:graphicData", "a:tbl"]);
  const xfrmNode = getTextByPathList(node, ["p:xfrm"]);
  const { top, left } = getPosition(xfrmNode, void 0, void 0);
  const { width, height } = getSize(xfrmNode, void 0, void 0);
  const getTblPr = getTextByPathList(node, ["a:graphic", "a:graphicData", "a:tbl", "a:tblPr"]);
  let getColsGrid = getTextByPathList(node, ["a:graphic", "a:graphicData", "a:tbl", "a:tblGrid", "a:gridCol"]);
  if (getColsGrid.constructor !== Array) getColsGrid = [getColsGrid];
  const colWidths = [];
  if (getColsGrid) {
    for (const item of getColsGrid) {
      const colWidthParam = getTextByPathList(item, ["attrs", "w"]) || 0;
      const colWidth = parseInt(colWidthParam) * RATIO_EMUs_Points;
      colWidths.push(colWidth);
    }
  }
  const firstRowAttr = getTblPr["attrs"] ? getTblPr["attrs"]["firstRow"] : void 0;
  const firstColAttr = getTblPr["attrs"] ? getTblPr["attrs"]["firstCol"] : void 0;
  const lastRowAttr = getTblPr["attrs"] ? getTblPr["attrs"]["lastRow"] : void 0;
  const lastColAttr = getTblPr["attrs"] ? getTblPr["attrs"]["lastCol"] : void 0;
  const bandRowAttr = getTblPr["attrs"] ? getTblPr["attrs"]["bandRow"] : void 0;
  const bandColAttr = getTblPr["attrs"] ? getTblPr["attrs"]["bandCol"] : void 0;
  const tblStylAttrObj = {
    isFrstRowAttr: firstRowAttr && firstRowAttr === "1" ? 1 : 0,
    isFrstColAttr: firstColAttr && firstColAttr === "1" ? 1 : 0,
    isLstRowAttr: lastRowAttr && lastRowAttr === "1" ? 1 : 0,
    isLstColAttr: lastColAttr && lastColAttr === "1" ? 1 : 0,
    isBandRowAttr: bandRowAttr && bandRowAttr === "1" ? 1 : 0,
    isBandColAttr: bandColAttr && bandColAttr === "1" ? 1 : 0
  };
  let thisTblStyle;
  const tbleStyleId = getTblPr["a:tableStyleId"];
  if (tbleStyleId) {
    const tbleStylList = warpObj["tableStyles"]["a:tblStyleLst"]["a:tblStyle"];
    if (tbleStylList) {
      if (tbleStylList.constructor === Array) {
        for (let k = 0; k < tbleStylList.length; k++) {
          if (tbleStylList[k]["attrs"]["styleId"] === tbleStyleId) {
            thisTblStyle = tbleStylList[k];
          }
        }
      } else {
        if (tbleStylList["attrs"]["styleId"] === tbleStyleId) {
          thisTblStyle = tbleStylList;
        }
      }
    }
  }
  if (thisTblStyle) thisTblStyle["tblStylAttrObj"] = tblStylAttrObj;
  let borders = {};
  const tblStyl = getTextByPathList(thisTblStyle, ["a:wholeTbl", "a:tcStyle"]);
  const tblBorderStyl = getTextByPathList(tblStyl, ["a:tcBdr"]);
  if (tblBorderStyl) borders = getTableBorders(tblBorderStyl, warpObj);
  let tbl_bgcolor = "";
  let tbl_bgFillschemeClr = getTextByPathList(thisTblStyle, ["a:tblBg", "a:fillRef"]);
  if (tbl_bgFillschemeClr) {
    tbl_bgcolor = getSolidFill(tbl_bgFillschemeClr, void 0, void 0, warpObj);
  }
  if (tbl_bgFillschemeClr === void 0) {
    tbl_bgFillschemeClr = getTextByPathList(thisTblStyle, ["a:wholeTbl", "a:tcStyle", "a:fill", "a:solidFill"]);
    tbl_bgcolor = getSolidFill(tbl_bgFillschemeClr, void 0, void 0, warpObj);
  }
  let trNodes = tableNode["a:tr"];
  if (trNodes.constructor !== Array) trNodes = [trNodes];
  const data = [];
  const rowHeights = [];
  for (let i = 0; i < trNodes.length; i++) {
    const trNode = trNodes[i];
    const rowHeightParam = getTextByPathList(trNodes[i], ["attrs", "h"]) || 0;
    const rowHeight = parseInt(rowHeightParam) * RATIO_EMUs_Points;
    rowHeights.push(rowHeight);
    const {
      fillColor,
      fontColor,
      fontBold
    } = getTableRowParams(trNodes, i, tblStylAttrObj, thisTblStyle, warpObj);
    const tcNodes = trNode["a:tc"];
    const tr = [];
    if (tcNodes.constructor === Array) {
      for (let j = 0; j < tcNodes.length; j++) {
        const tcNode = tcNodes[j];
        let a_sorce;
        if (j === 0 && tblStylAttrObj["isFrstColAttr"] === 1) {
          a_sorce = "a:firstCol";
          if (tblStylAttrObj["isLstRowAttr"] === 1 && i === trNodes.length - 1 && getTextByPathList(thisTblStyle, ["a:seCell"])) {
            a_sorce = "a:seCell";
          } else if (tblStylAttrObj["isFrstRowAttr"] === 1 && i === 0 && getTextByPathList(thisTblStyle, ["a:neCell"])) {
            a_sorce = "a:neCell";
          }
        } else if (j > 0 && tblStylAttrObj["isBandColAttr"] === 1 && !(tblStylAttrObj["isFrstColAttr"] === 1 && i === 0) && !(tblStylAttrObj["isLstRowAttr"] === 1 && i === trNodes.length - 1) && j !== tcNodes.length - 1) {
          if (j % 2 !== 0) {
            let aBandNode = getTextByPathList(thisTblStyle, ["a:band2V"]);
            if (aBandNode === void 0) {
              aBandNode = getTextByPathList(thisTblStyle, ["a:band1V"]);
              if (aBandNode) a_sorce = "a:band2V";
            } else a_sorce = "a:band2V";
          }
        }
        if (j === tcNodes.length - 1 && tblStylAttrObj["isLstColAttr"] === 1) {
          a_sorce = "a:lastCol";
          if (tblStylAttrObj["isLstRowAttr"] === 1 && i === trNodes.length - 1 && getTextByPathList(thisTblStyle, ["a:swCell"])) {
            a_sorce = "a:swCell";
          } else if (tblStylAttrObj["isFrstRowAttr"] === 1 && i === 0 && getTextByPathList(thisTblStyle, ["a:nwCell"])) {
            a_sorce = "a:nwCell";
          }
        }
        const text = genTextBody(tcNode["a:txBody"], tcNode, void 0, void 0, void 0, warpObj);
        const cell = await getTableCellParams(tcNode, thisTblStyle, a_sorce, warpObj);
        const td = { text };
        if (cell.rowSpan) td.rowSpan = cell.rowSpan;
        if (cell.colSpan) td.colSpan = cell.colSpan;
        if (cell.vMerge) td.vMerge = cell.vMerge;
        if (cell.hMerge) td.hMerge = cell.hMerge;
        if (cell.vAlign) td.vAlign = cell.vAlign;
        if (cell.fontBold || fontBold) td.fontBold = cell.fontBold || fontBold;
        if (cell.fontColor || fontColor) td.fontColor = cell.fontColor || fontColor;
        if (cell.fillColor || fillColor || tbl_bgcolor) td.fillColor = cell.fillColor || fillColor || tbl_bgcolor;
        if (cell.borders) td.borders = cell.borders;
        tr.push(td);
      }
    } else {
      let a_sorce;
      if (tblStylAttrObj["isFrstColAttr"] === 1 && tblStylAttrObj["isLstRowAttr"] !== 1) {
        a_sorce = "a:firstCol";
      } else if (tblStylAttrObj["isBandColAttr"] === 1 && tblStylAttrObj["isLstRowAttr"] !== 1) {
        let aBandNode = getTextByPathList(thisTblStyle, ["a:band2V"]);
        if (!aBandNode) {
          aBandNode = getTextByPathList(thisTblStyle, ["a:band1V"]);
          if (aBandNode) a_sorce = "a:band2V";
        } else a_sorce = "a:band2V";
      }
      if (tblStylAttrObj["isLstColAttr"] === 1 && tblStylAttrObj["isLstRowAttr"] !== 1) {
        a_sorce = "a:lastCol";
      }
      const text = genTextBody(tcNodes["a:txBody"], tcNodes, void 0, void 0, void 0, warpObj);
      const cell = await getTableCellParams(tcNodes, thisTblStyle, a_sorce, warpObj);
      const td = { text };
      if (cell.rowSpan) td.rowSpan = cell.rowSpan;
      if (cell.colSpan) td.colSpan = cell.colSpan;
      if (cell.vMerge) td.vMerge = cell.vMerge;
      if (cell.hMerge) td.hMerge = cell.hMerge;
      if (cell.vAlign) td.vAlign = cell.vAlign;
      if (cell.fontBold || fontBold) td.fontBold = cell.fontBold || fontBold;
      if (cell.fontColor || fontColor) td.fontColor = cell.fontColor || fontColor;
      if (cell.fillColor || fillColor || tbl_bgcolor) td.fillColor = cell.fillColor || fillColor || tbl_bgcolor;
      if (cell.borders) td.borders = cell.borders;
      tr.push(td);
    }
    data.push(tr);
  }
  let actualTableWidth = colWidths.reduce((sum, width2) => sum + width2, 0);
  if (actualTableWidth) actualTableWidth = numberToFixed(actualTableWidth);
  return {
    type: "table",
    top,
    left,
    width: actualTableWidth || width,
    height,
    data,
    order,
    borders,
    rowHeights,
    colWidths
  };
}
async function genChart(node, warpObj) {
  const order = node["attrs"]["order"];
  const xfrmNode = getTextByPathList(node, ["p:xfrm"]);
  const { top, left } = getPosition(xfrmNode, void 0, void 0);
  const { width, height } = getSize(xfrmNode, void 0, void 0);
  const rid = node["a:graphic"]["a:graphicData"]["c:chart"]["attrs"]["r:id"];
  let refName = getTextByPathList(warpObj["slideResObj"], [rid, "target"]);
  if (!refName) refName = getTextByPathList(warpObj["layoutResObj"], [rid, "target"]);
  if (!refName) refName = getTextByPathList(warpObj["masterResObj"], [rid, "target"]);
  if (!refName) return null;
  const content = await readXmlFile(warpObj["zip"], refName);
  const plotArea = getTextByPathList(content, ["c:chartSpace", "c:chart", "c:plotArea"]);
  const chart = getChartInfo(plotArea, warpObj);
  if (!chart) return null;
  const data = {
    type: "chart",
    top,
    left,
    width,
    height,
    data: chart.data,
    colors: chart.colors,
    chartType: chart.type,
    order
  };
  if (chart.marker !== void 0) data.marker = chart.marker;
  if (chart.barDir !== void 0) data.barDir = chart.barDir;
  if (chart.holeSize !== void 0) data.holeSize = chart.holeSize;
  if (chart.grouping !== void 0) data.grouping = chart.grouping;
  if (chart.style !== void 0) data.style = chart.style;
  return data;
}
async function genDiagram(node, warpObj) {
  const order = node["attrs"]["order"];
  const xfrmNode = getTextByPathList(node, ["p:xfrm"]);
  const { left, top } = getPosition(xfrmNode, void 0, void 0);
  const { width, height } = getSize(xfrmNode, void 0, void 0);
  const diagramWarpObj = await getDiagramNodeContext(node, warpObj);
  const dgmDrwSpArray = getTextByPathList(diagramWarpObj["digramFileContent"], ["p:drawing", "p:spTree", "p:sp"]);
  const elements = [];
  let textList = [];
  if (dgmDrwSpArray) {
    const spList = Array.isArray(dgmDrwSpArray) ? dgmDrwSpArray : [dgmDrwSpArray];
    for (const item of spList) {
      const el = await processSpNode(item, diagramWarpObj, "diagramBg");
      if (el) elements.push(el);
    }
  }
  if (diagramWarpObj.diagramContent && diagramWarpObj.diagramContent.data) {
    textList = getSmartArtTextData(diagramWarpObj.diagramContent.data);
  }
  return {
    type: "diagram",
    left,
    top,
    width,
    height,
    elements,
    textList,
    order
  };
}
export {
  parse2 as parse
};
