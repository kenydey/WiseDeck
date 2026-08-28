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

// node_modules/jszip/dist/jszip.min.js
var require_jszip_min = __commonJS({
  "node_modules/jszip/dist/jszip.min.js"(exports, module) {
    !(function(e) {
      if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
      else if ("function" == typeof define && define.amd) define([], e);
      else {
        ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).JSZip = e();
      }
    })(function() {
      return (function s(a, o, h) {
        function u(r, e2) {
          if (!o[r]) {
            if (!a[r]) {
              var t = "function" == typeof __require && __require;
              if (!e2 && t) return t(r, true);
              if (l) return l(r, true);
              var n = new Error("Cannot find module '" + r + "'");
              throw n.code = "MODULE_NOT_FOUND", n;
            }
            var i = o[r] = { exports: {} };
            a[r][0].call(i.exports, function(e3) {
              var t2 = a[r][1][e3];
              return u(t2 || e3);
            }, i, i.exports, s, a, o, h);
          }
          return o[r].exports;
        }
        for (var l = "function" == typeof __require && __require, e = 0; e < h.length; e++) u(h[e]);
        return u;
      })({ 1: [function(e, t, r) {
        "use strict";
        var d = e("./utils"), c = e("./support"), p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        r.encode = function(e2) {
          for (var t2, r2, n, i, s, a, o, h = [], u = 0, l = e2.length, f = l, c2 = "string" !== d.getTypeOf(e2); u < e2.length; ) f = l - u, n = c2 ? (t2 = e2[u++], r2 = u < l ? e2[u++] : 0, u < l ? e2[u++] : 0) : (t2 = e2.charCodeAt(u++), r2 = u < l ? e2.charCodeAt(u++) : 0, u < l ? e2.charCodeAt(u++) : 0), i = t2 >> 2, s = (3 & t2) << 4 | r2 >> 4, a = 1 < f ? (15 & r2) << 2 | n >> 6 : 64, o = 2 < f ? 63 & n : 64, h.push(p.charAt(i) + p.charAt(s) + p.charAt(a) + p.charAt(o));
          return h.join("");
        }, r.decode = function(e2) {
          var t2, r2, n, i, s, a, o = 0, h = 0, u = "data:";
          if (e2.substr(0, u.length) === u) throw new Error("Invalid base64 input, it looks like a data url.");
          var l, f = 3 * (e2 = e2.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (e2.charAt(e2.length - 1) === p.charAt(64) && f--, e2.charAt(e2.length - 2) === p.charAt(64) && f--, f % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (l = c.uint8array ? new Uint8Array(0 | f) : new Array(0 | f); o < e2.length; ) t2 = p.indexOf(e2.charAt(o++)) << 2 | (i = p.indexOf(e2.charAt(o++))) >> 4, r2 = (15 & i) << 4 | (s = p.indexOf(e2.charAt(o++))) >> 2, n = (3 & s) << 6 | (a = p.indexOf(e2.charAt(o++))), l[h++] = t2, 64 !== s && (l[h++] = r2), 64 !== a && (l[h++] = n);
          return l;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, t, r) {
        "use strict";
        var n = e("./external"), i = e("./stream/DataWorker"), s = e("./stream/Crc32Probe"), a = e("./stream/DataLengthProbe");
        function o(e2, t2, r2, n2, i2) {
          this.compressedSize = e2, this.uncompressedSize = t2, this.crc32 = r2, this.compression = n2, this.compressedContent = i2;
        }
        o.prototype = { getContentWorker: function() {
          var e2 = new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")), t2 = this;
          return e2.on("end", function() {
            if (this.streamInfo.data_length !== t2.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), e2;
        }, getCompressedWorker: function() {
          return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, o.createWorkerFrom = function(e2, t2, r2) {
          return e2.pipe(new s()).pipe(new a("uncompressedSize")).pipe(t2.compressWorker(r2)).pipe(new a("compressedSize")).withStreamInfo("compression", t2);
        }, t.exports = o;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, t, r) {
        "use strict";
        var n = e("./stream/GenericWorker");
        r.STORE = { magic: "\0\0", compressWorker: function() {
          return new n("STORE compression");
        }, uncompressWorker: function() {
          return new n("STORE decompression");
        } }, r.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, t, r) {
        "use strict";
        var n = e("./utils");
        var o = (function() {
          for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
            e2 = r2;
            for (var n2 = 0; n2 < 8; n2++) e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
            t2[r2] = e2;
          }
          return t2;
        })();
        t.exports = function(e2, t2) {
          return void 0 !== e2 && e2.length ? "string" !== n.getTypeOf(e2) ? (function(e3, t3, r2, n2) {
            var i = o, s = n2 + r2;
            e3 ^= -1;
            for (var a = n2; a < s; a++) e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3[a])];
            return -1 ^ e3;
          })(0 | t2, e2, e2.length, 0) : (function(e3, t3, r2, n2) {
            var i = o, s = n2 + r2;
            e3 ^= -1;
            for (var a = n2; a < s; a++) e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3.charCodeAt(a))];
            return -1 ^ e3;
          })(0 | t2, e2, e2.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, t, r) {
        "use strict";
        r.base64 = false, r.binary = false, r.dir = false, r.createFolders = true, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
      }, {}], 6: [function(e, t, r) {
        "use strict";
        var n = null;
        n = "undefined" != typeof Promise ? Promise : e("lie"), t.exports = { Promise: n };
      }, { lie: 37 }], 7: [function(e, t, r) {
        "use strict";
        var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array, i = e("pako"), s = e("./utils"), a = e("./stream/GenericWorker"), o = n ? "uint8array" : "array";
        function h(e2, t2) {
          a.call(this, "FlateWorker/" + e2), this._pako = null, this._pakoAction = e2, this._pakoOptions = t2, this.meta = {};
        }
        r.magic = "\b\0", s.inherits(h, a), h.prototype.processChunk = function(e2) {
          this.meta = e2.meta, null === this._pako && this._createPako(), this._pako.push(s.transformTo(o, e2.data), false);
        }, h.prototype.flush = function() {
          a.prototype.flush.call(this), null === this._pako && this._createPako(), this._pako.push([], true);
        }, h.prototype.cleanUp = function() {
          a.prototype.cleanUp.call(this), this._pako = null;
        }, h.prototype._createPako = function() {
          this._pako = new i[this._pakoAction]({ raw: true, level: this._pakoOptions.level || -1 });
          var t2 = this;
          this._pako.onData = function(e2) {
            t2.push({ data: e2, meta: t2.meta });
          };
        }, r.compressWorker = function(e2) {
          return new h("Deflate", e2);
        }, r.uncompressWorker = function() {
          return new h("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, t, r) {
        "use strict";
        function A(e2, t2) {
          var r2, n2 = "";
          for (r2 = 0; r2 < t2; r2++) n2 += String.fromCharCode(255 & e2), e2 >>>= 8;
          return n2;
        }
        function n(e2, t2, r2, n2, i2, s2) {
          var a, o, h = e2.file, u = e2.compression, l = s2 !== O.utf8encode, f = I.transformTo("string", s2(h.name)), c = I.transformTo("string", O.utf8encode(h.name)), d = h.comment, p = I.transformTo("string", s2(d)), m = I.transformTo("string", O.utf8encode(d)), _ = c.length !== h.name.length, g = m.length !== d.length, b = "", v = "", y = "", w = h.dir, k = h.date, x = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          t2 && !r2 || (x.crc32 = e2.crc32, x.compressedSize = e2.compressedSize, x.uncompressedSize = e2.uncompressedSize);
          var S = 0;
          t2 && (S |= 8), l || !_ && !g || (S |= 2048);
          var z = 0, C = 0;
          w && (z |= 16), "UNIX" === i2 ? (C = 798, z |= (function(e3, t3) {
            var r3 = e3;
            return e3 || (r3 = t3 ? 16893 : 33204), (65535 & r3) << 16;
          })(h.unixPermissions, w)) : (C = 20, z |= (function(e3) {
            return 63 & (e3 || 0);
          })(h.dosPermissions)), a = k.getUTCHours(), a <<= 6, a |= k.getUTCMinutes(), a <<= 5, a |= k.getUTCSeconds() / 2, o = k.getUTCFullYear() - 1980, o <<= 4, o |= k.getUTCMonth() + 1, o <<= 5, o |= k.getUTCDate(), _ && (v = A(1, 1) + A(B(f), 4) + c, b += "up" + A(v.length, 2) + v), g && (y = A(1, 1) + A(B(p), 4) + m, b += "uc" + A(y.length, 2) + y);
          var E = "";
          return E += "\n\0", E += A(S, 2), E += u.magic, E += A(a, 2), E += A(o, 2), E += A(x.crc32, 4), E += A(x.compressedSize, 4), E += A(x.uncompressedSize, 4), E += A(f.length, 2), E += A(b.length, 2), { fileRecord: R.LOCAL_FILE_HEADER + E + f + b, dirRecord: R.CENTRAL_FILE_HEADER + A(C, 2) + E + A(p.length, 2) + "\0\0\0\0" + A(z, 4) + A(n2, 4) + f + b + p };
        }
        var I = e("../utils"), i = e("../stream/GenericWorker"), O = e("../utf8"), B = e("../crc32"), R = e("../signature");
        function s(e2, t2, r2, n2) {
          i.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = t2, this.zipPlatform = r2, this.encodeFileName = n2, this.streamFiles = e2, this.accumulate = false, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        I.inherits(s, i), s.prototype.push = function(e2) {
          var t2 = e2.meta.percent || 0, r2 = this.entriesCount, n2 = this._sources.length;
          this.accumulate ? this.contentBuffer.push(e2) : (this.bytesWritten += e2.data.length, i.prototype.push.call(this, { data: e2.data, meta: { currentFile: this.currentFile, percent: r2 ? (t2 + 100 * (r2 - n2 - 1)) / r2 : 100 } }));
        }, s.prototype.openedSource = function(e2) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = e2.file.name;
          var t2 = this.streamFiles && !e2.file.dir;
          if (t2) {
            var r2 = n(e2, t2, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: r2.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = true;
        }, s.prototype.closedSource = function(e2) {
          this.accumulate = false;
          var t2 = this.streamFiles && !e2.file.dir, r2 = n(e2, t2, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(r2.dirRecord), t2) this.push({ data: (function(e3) {
            return R.DATA_DESCRIPTOR + A(e3.crc32, 4) + A(e3.compressedSize, 4) + A(e3.uncompressedSize, 4);
          })(e2), meta: { percent: 100 } });
          else for (this.push({ data: r2.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, s.prototype.flush = function() {
          for (var e2 = this.bytesWritten, t2 = 0; t2 < this.dirRecords.length; t2++) this.push({ data: this.dirRecords[t2], meta: { percent: 100 } });
          var r2 = this.bytesWritten - e2, n2 = (function(e3, t3, r3, n3, i2) {
            var s2 = I.transformTo("string", i2(n3));
            return R.CENTRAL_DIRECTORY_END + "\0\0\0\0" + A(e3, 2) + A(e3, 2) + A(t3, 4) + A(r3, 4) + A(s2.length, 2) + s2;
          })(this.dirRecords.length, r2, e2, this.zipComment, this.encodeFileName);
          this.push({ data: n2, meta: { percent: 100 } });
        }, s.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, s.prototype.registerPrevious = function(e2) {
          this._sources.push(e2);
          var t2 = this;
          return e2.on("data", function(e3) {
            t2.processChunk(e3);
          }), e2.on("end", function() {
            t2.closedSource(t2.previous.streamInfo), t2._sources.length ? t2.prepareNextSource() : t2.end();
          }), e2.on("error", function(e3) {
            t2.error(e3);
          }), this;
        }, s.prototype.resume = function() {
          return !!i.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), true) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), true));
        }, s.prototype.error = function(e2) {
          var t2 = this._sources;
          if (!i.prototype.error.call(this, e2)) return false;
          for (var r2 = 0; r2 < t2.length; r2++) try {
            t2[r2].error(e2);
          } catch (e3) {
          }
          return true;
        }, s.prototype.lock = function() {
          i.prototype.lock.call(this);
          for (var e2 = this._sources, t2 = 0; t2 < e2.length; t2++) e2[t2].lock();
        }, t.exports = s;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, t, r) {
        "use strict";
        var u = e("../compressions"), n = e("./ZipFileWorker");
        r.generateWorker = function(e2, a, t2) {
          var o = new n(a.streamFiles, t2, a.platform, a.encodeFileName), h = 0;
          try {
            e2.forEach(function(e3, t3) {
              h++;
              var r2 = (function(e4, t4) {
                var r3 = e4 || t4, n3 = u[r3];
                if (!n3) throw new Error(r3 + " is not a valid compression method !");
                return n3;
              })(t3.options.compression, a.compression), n2 = t3.options.compressionOptions || a.compressionOptions || {}, i = t3.dir, s = t3.date;
              t3._compressWorker(r2, n2).withStreamInfo("file", { name: e3, dir: i, date: s, comment: t3.comment || "", unixPermissions: t3.unixPermissions, dosPermissions: t3.dosPermissions }).pipe(o);
            }), o.entriesCount = h;
          } catch (e3) {
            o.error(e3);
          }
          return o;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, t, r) {
        "use strict";
        function n() {
          if (!(this instanceof n)) return new n();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var e2 = new n();
            for (var t2 in this) "function" != typeof this[t2] && (e2[t2] = this[t2]);
            return e2;
          };
        }
        (n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.10.1", n.loadAsync = function(e2, t2) {
          return new n().loadAsync(e2, t2);
        }, n.external = e("./external"), t.exports = n;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, t, r) {
        "use strict";
        var u = e("./utils"), i = e("./external"), n = e("./utf8"), s = e("./zipEntries"), a = e("./stream/Crc32Probe"), l = e("./nodejsUtils");
        function f(n2) {
          return new i.Promise(function(e2, t2) {
            var r2 = n2.decompressed.getContentWorker().pipe(new a());
            r2.on("error", function(e3) {
              t2(e3);
            }).on("end", function() {
              r2.streamInfo.crc32 !== n2.decompressed.crc32 ? t2(new Error("Corrupted zip : CRC32 mismatch")) : e2();
            }).resume();
          });
        }
        t.exports = function(e2, o) {
          var h = this;
          return o = u.extend(o || {}, { base64: false, checkCRC32: false, optimizedBinaryString: false, createFolders: false, decodeFileName: n.utf8decode }), l.isNode && l.isStream(e2) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : u.prepareContent("the loaded zip file", e2, true, o.optimizedBinaryString, o.base64).then(function(e3) {
            var t2 = new s(o);
            return t2.load(e3), t2;
          }).then(function(e3) {
            var t2 = [i.Promise.resolve(e3)], r2 = e3.files;
            if (o.checkCRC32) for (var n2 = 0; n2 < r2.length; n2++) t2.push(f(r2[n2]));
            return i.Promise.all(t2);
          }).then(function(e3) {
            for (var t2 = e3.shift(), r2 = t2.files, n2 = 0; n2 < r2.length; n2++) {
              var i2 = r2[n2], s2 = i2.fileNameStr, a2 = u.resolve(i2.fileNameStr);
              h.file(a2, i2.decompressed, { binary: true, optimizedBinaryString: true, date: i2.date, dir: i2.dir, comment: i2.fileCommentStr.length ? i2.fileCommentStr : null, unixPermissions: i2.unixPermissions, dosPermissions: i2.dosPermissions, createFolders: o.createFolders }), i2.dir || (h.file(a2).unsafeOriginalName = s2);
            }
            return t2.zipComment.length && (h.comment = t2.zipComment), h;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, t, r) {
        "use strict";
        var n = e("../utils"), i = e("../stream/GenericWorker");
        function s(e2, t2) {
          i.call(this, "Nodejs stream input adapter for " + e2), this._upstreamEnded = false, this._bindStream(t2);
        }
        n.inherits(s, i), s.prototype._bindStream = function(e2) {
          var t2 = this;
          (this._stream = e2).pause(), e2.on("data", function(e3) {
            t2.push({ data: e3, meta: { percent: 0 } });
          }).on("error", function(e3) {
            t2.isPaused ? this.generatedError = e3 : t2.error(e3);
          }).on("end", function() {
            t2.isPaused ? t2._upstreamEnded = true : t2.end();
          });
        }, s.prototype.pause = function() {
          return !!i.prototype.pause.call(this) && (this._stream.pause(), true);
        }, s.prototype.resume = function() {
          return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), true);
        }, t.exports = s;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, t, r) {
        "use strict";
        var i = e("readable-stream").Readable;
        function n(e2, t2, r2) {
          i.call(this, t2), this._helper = e2;
          var n2 = this;
          e2.on("data", function(e3, t3) {
            n2.push(e3) || n2._helper.pause(), r2 && r2(t3);
          }).on("error", function(e3) {
            n2.emit("error", e3);
          }).on("end", function() {
            n2.push(null);
          });
        }
        e("../utils").inherits(n, i), n.prototype._read = function() {
          this._helper.resume();
        }, t.exports = n;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, t, r) {
        "use strict";
        t.exports = { isNode: "undefined" != typeof Buffer, newBufferFrom: function(e2, t2) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(e2, t2);
          if ("number" == typeof e2) throw new Error('The "data" argument must not be a number');
          return new Buffer(e2, t2);
        }, allocBuffer: function(e2) {
          if (Buffer.alloc) return Buffer.alloc(e2);
          var t2 = new Buffer(e2);
          return t2.fill(0), t2;
        }, isBuffer: function(e2) {
          return Buffer.isBuffer(e2);
        }, isStream: function(e2) {
          return e2 && "function" == typeof e2.on && "function" == typeof e2.pause && "function" == typeof e2.resume;
        } };
      }, {}], 15: [function(e, t, r) {
        "use strict";
        function s(e2, t2, r2) {
          var n2, i2 = u.getTypeOf(t2), s2 = u.extend(r2 || {}, f);
          s2.date = s2.date || /* @__PURE__ */ new Date(), null !== s2.compression && (s2.compression = s2.compression.toUpperCase()), "string" == typeof s2.unixPermissions && (s2.unixPermissions = parseInt(s2.unixPermissions, 8)), s2.unixPermissions && 16384 & s2.unixPermissions && (s2.dir = true), s2.dosPermissions && 16 & s2.dosPermissions && (s2.dir = true), s2.dir && (e2 = g(e2)), s2.createFolders && (n2 = _(e2)) && b.call(this, n2, true);
          var a2 = "string" === i2 && false === s2.binary && false === s2.base64;
          r2 && void 0 !== r2.binary || (s2.binary = !a2), (t2 instanceof c && 0 === t2.uncompressedSize || s2.dir || !t2 || 0 === t2.length) && (s2.base64 = false, s2.binary = true, t2 = "", s2.compression = "STORE", i2 = "string");
          var o2 = null;
          o2 = t2 instanceof c || t2 instanceof l ? t2 : p.isNode && p.isStream(t2) ? new m(e2, t2) : u.prepareContent(e2, t2, s2.binary, s2.optimizedBinaryString, s2.base64);
          var h2 = new d(e2, o2, s2);
          this.files[e2] = h2;
        }
        var i = e("./utf8"), u = e("./utils"), l = e("./stream/GenericWorker"), a = e("./stream/StreamHelper"), f = e("./defaults"), c = e("./compressedObject"), d = e("./zipObject"), o = e("./generate"), p = e("./nodejsUtils"), m = e("./nodejs/NodejsStreamInputAdapter"), _ = function(e2) {
          "/" === e2.slice(-1) && (e2 = e2.substring(0, e2.length - 1));
          var t2 = e2.lastIndexOf("/");
          return 0 < t2 ? e2.substring(0, t2) : "";
        }, g = function(e2) {
          return "/" !== e2.slice(-1) && (e2 += "/"), e2;
        }, b = function(e2, t2) {
          return t2 = void 0 !== t2 ? t2 : f.createFolders, e2 = g(e2), this.files[e2] || s.call(this, e2, null, { dir: true, createFolders: t2 }), this.files[e2];
        };
        function h(e2) {
          return "[object RegExp]" === Object.prototype.toString.call(e2);
        }
        var n = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(e2) {
          var t2, r2, n2;
          for (t2 in this.files) n2 = this.files[t2], (r2 = t2.slice(this.root.length, t2.length)) && t2.slice(0, this.root.length) === this.root && e2(r2, n2);
        }, filter: function(r2) {
          var n2 = [];
          return this.forEach(function(e2, t2) {
            r2(e2, t2) && n2.push(t2);
          }), n2;
        }, file: function(e2, t2, r2) {
          if (1 !== arguments.length) return e2 = this.root + e2, s.call(this, e2, t2, r2), this;
          if (h(e2)) {
            var n2 = e2;
            return this.filter(function(e3, t3) {
              return !t3.dir && n2.test(e3);
            });
          }
          var i2 = this.files[this.root + e2];
          return i2 && !i2.dir ? i2 : null;
        }, folder: function(r2) {
          if (!r2) return this;
          if (h(r2)) return this.filter(function(e3, t3) {
            return t3.dir && r2.test(e3);
          });
          var e2 = this.root + r2, t2 = b.call(this, e2), n2 = this.clone();
          return n2.root = t2.name, n2;
        }, remove: function(r2) {
          r2 = this.root + r2;
          var e2 = this.files[r2];
          if (e2 || ("/" !== r2.slice(-1) && (r2 += "/"), e2 = this.files[r2]), e2 && !e2.dir) delete this.files[r2];
          else for (var t2 = this.filter(function(e3, t3) {
            return t3.name.slice(0, r2.length) === r2;
          }), n2 = 0; n2 < t2.length; n2++) delete this.files[t2[n2].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(e2) {
          var t2, r2 = {};
          try {
            if ((r2 = u.extend(e2 || {}, { streamFiles: false, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = r2.type.toLowerCase(), r2.compression = r2.compression.toUpperCase(), "binarystring" === r2.type && (r2.type = "string"), !r2.type) throw new Error("No output type specified.");
            u.checkSupport(r2.type), "darwin" !== r2.platform && "freebsd" !== r2.platform && "linux" !== r2.platform && "sunos" !== r2.platform || (r2.platform = "UNIX"), "win32" === r2.platform && (r2.platform = "DOS");
            var n2 = r2.comment || this.comment || "";
            t2 = o.generateWorker(this, r2, n2);
          } catch (e3) {
            (t2 = new l("error")).error(e3);
          }
          return new a(t2, r2.type || "string", r2.mimeType);
        }, generateAsync: function(e2, t2) {
          return this.generateInternalStream(e2).accumulate(t2);
        }, generateNodeStream: function(e2, t2) {
          return (e2 = e2 || {}).type || (e2.type = "nodebuffer"), this.generateInternalStream(e2).toNodejsStream(t2);
        } };
        t.exports = n;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, t, r) {
        "use strict";
        t.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, t, r) {
        "use strict";
        var n = e("./DataReader");
        function i(e2) {
          n.call(this, e2);
          for (var t2 = 0; t2 < this.data.length; t2++) e2[t2] = 255 & e2[t2];
        }
        e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
          return this.data[this.zero + e2];
        }, i.prototype.lastIndexOfSignature = function(e2) {
          for (var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.length - 4; 0 <= s; --s) if (this.data[s] === t2 && this.data[s + 1] === r2 && this.data[s + 2] === n2 && this.data[s + 3] === i2) return s - this.zero;
          return -1;
        }, i.prototype.readAndCheckSignature = function(e2) {
          var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.readData(4);
          return t2 === s[0] && r2 === s[1] && n2 === s[2] && i2 === s[3];
        }, i.prototype.readData = function(e2) {
          if (this.checkOffset(e2), 0 === e2) return [];
          var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
          return this.index += e2, t2;
        }, t.exports = i;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, t, r) {
        "use strict";
        var n = e("../utils");
        function i(e2) {
          this.data = e2, this.length = e2.length, this.index = 0, this.zero = 0;
        }
        i.prototype = { checkOffset: function(e2) {
          this.checkIndex(this.index + e2);
        }, checkIndex: function(e2) {
          if (this.length < this.zero + e2 || e2 < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + e2 + "). Corrupted zip ?");
        }, setIndex: function(e2) {
          this.checkIndex(e2), this.index = e2;
        }, skip: function(e2) {
          this.setIndex(this.index + e2);
        }, byteAt: function() {
        }, readInt: function(e2) {
          var t2, r2 = 0;
          for (this.checkOffset(e2), t2 = this.index + e2 - 1; t2 >= this.index; t2--) r2 = (r2 << 8) + this.byteAt(t2);
          return this.index += e2, r2;
        }, readString: function(e2) {
          return n.transformTo("string", this.readData(e2));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var e2 = this.readInt(4);
          return new Date(Date.UTC(1980 + (e2 >> 25 & 127), (e2 >> 21 & 15) - 1, e2 >> 16 & 31, e2 >> 11 & 31, e2 >> 5 & 63, (31 & e2) << 1));
        } }, t.exports = i;
      }, { "../utils": 32 }], 19: [function(e, t, r) {
        "use strict";
        var n = e("./Uint8ArrayReader");
        function i(e2) {
          n.call(this, e2);
        }
        e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
          this.checkOffset(e2);
          var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
          return this.index += e2, t2;
        }, t.exports = i;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, t, r) {
        "use strict";
        var n = e("./DataReader");
        function i(e2) {
          n.call(this, e2);
        }
        e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
          return this.data.charCodeAt(this.zero + e2);
        }, i.prototype.lastIndexOfSignature = function(e2) {
          return this.data.lastIndexOf(e2) - this.zero;
        }, i.prototype.readAndCheckSignature = function(e2) {
          return e2 === this.readData(4);
        }, i.prototype.readData = function(e2) {
          this.checkOffset(e2);
          var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
          return this.index += e2, t2;
        }, t.exports = i;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, t, r) {
        "use strict";
        var n = e("./ArrayReader");
        function i(e2) {
          n.call(this, e2);
        }
        e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
          if (this.checkOffset(e2), 0 === e2) return new Uint8Array(0);
          var t2 = this.data.subarray(this.zero + this.index, this.zero + this.index + e2);
          return this.index += e2, t2;
        }, t.exports = i;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, t, r) {
        "use strict";
        var n = e("../utils"), i = e("../support"), s = e("./ArrayReader"), a = e("./StringReader"), o = e("./NodeBufferReader"), h = e("./Uint8ArrayReader");
        t.exports = function(e2) {
          var t2 = n.getTypeOf(e2);
          return n.checkSupport(t2), "string" !== t2 || i.uint8array ? "nodebuffer" === t2 ? new o(e2) : i.uint8array ? new h(n.transformTo("uint8array", e2)) : new s(n.transformTo("array", e2)) : new a(e2);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, t, r) {
        "use strict";
        r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, t, r) {
        "use strict";
        var n = e("./GenericWorker"), i = e("../utils");
        function s(e2) {
          n.call(this, "ConvertWorker to " + e2), this.destType = e2;
        }
        i.inherits(s, n), s.prototype.processChunk = function(e2) {
          this.push({ data: i.transformTo(this.destType, e2.data), meta: e2.meta });
        }, t.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, t, r) {
        "use strict";
        var n = e("./GenericWorker"), i = e("../crc32");
        function s() {
          n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(s, n), s.prototype.processChunk = function(e2) {
          this.streamInfo.crc32 = i(e2.data, this.streamInfo.crc32 || 0), this.push(e2);
        }, t.exports = s;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, t, r) {
        "use strict";
        var n = e("../utils"), i = e("./GenericWorker");
        function s(e2) {
          i.call(this, "DataLengthProbe for " + e2), this.propName = e2, this.withStreamInfo(e2, 0);
        }
        n.inherits(s, i), s.prototype.processChunk = function(e2) {
          if (e2) {
            var t2 = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = t2 + e2.data.length;
          }
          i.prototype.processChunk.call(this, e2);
        }, t.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, t, r) {
        "use strict";
        var n = e("../utils"), i = e("./GenericWorker");
        function s(e2) {
          i.call(this, "DataWorker");
          var t2 = this;
          this.dataIsReady = false, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = false, e2.then(function(e3) {
            t2.dataIsReady = true, t2.data = e3, t2.max = e3 && e3.length || 0, t2.type = n.getTypeOf(e3), t2.isPaused || t2._tickAndRepeat();
          }, function(e3) {
            t2.error(e3);
          });
        }
        n.inherits(s, i), s.prototype.cleanUp = function() {
          i.prototype.cleanUp.call(this), this.data = null;
        }, s.prototype.resume = function() {
          return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = true, n.delay(this._tickAndRepeat, [], this)), true);
        }, s.prototype._tickAndRepeat = function() {
          this._tickScheduled = false, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = true));
        }, s.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return false;
          var e2 = null, t2 = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              e2 = this.data.substring(this.index, t2);
              break;
            case "uint8array":
              e2 = this.data.subarray(this.index, t2);
              break;
            case "array":
            case "nodebuffer":
              e2 = this.data.slice(this.index, t2);
          }
          return this.index = t2, this.push({ data: e2, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, t.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, t, r) {
        "use strict";
        function n(e2) {
          this.name = e2 || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = true, this.isFinished = false, this.isLocked = false, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        n.prototype = { push: function(e2) {
          this.emit("data", e2);
        }, end: function() {
          if (this.isFinished) return false;
          this.flush();
          try {
            this.emit("end"), this.cleanUp(), this.isFinished = true;
          } catch (e2) {
            this.emit("error", e2);
          }
          return true;
        }, error: function(e2) {
          return !this.isFinished && (this.isPaused ? this.generatedError = e2 : (this.isFinished = true, this.emit("error", e2), this.previous && this.previous.error(e2), this.cleanUp()), true);
        }, on: function(e2, t2) {
          return this._listeners[e2].push(t2), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(e2, t2) {
          if (this._listeners[e2]) for (var r2 = 0; r2 < this._listeners[e2].length; r2++) this._listeners[e2][r2].call(this, t2);
        }, pipe: function(e2) {
          return e2.registerPrevious(this);
        }, registerPrevious: function(e2) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = e2.streamInfo, this.mergeStreamInfo(), this.previous = e2;
          var t2 = this;
          return e2.on("data", function(e3) {
            t2.processChunk(e3);
          }), e2.on("end", function() {
            t2.end();
          }), e2.on("error", function(e3) {
            t2.error(e3);
          }), this;
        }, pause: function() {
          return !this.isPaused && !this.isFinished && (this.isPaused = true, this.previous && this.previous.pause(), true);
        }, resume: function() {
          if (!this.isPaused || this.isFinished) return false;
          var e2 = this.isPaused = false;
          return this.generatedError && (this.error(this.generatedError), e2 = true), this.previous && this.previous.resume(), !e2;
        }, flush: function() {
        }, processChunk: function(e2) {
          this.push(e2);
        }, withStreamInfo: function(e2, t2) {
          return this.extraStreamInfo[e2] = t2, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var e2 in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, e2) && (this.streamInfo[e2] = this.extraStreamInfo[e2]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = true, this.previous && this.previous.lock();
        }, toString: function() {
          var e2 = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + e2 : e2;
        } }, t.exports = n;
      }, {}], 29: [function(e, t, r) {
        "use strict";
        var h = e("../utils"), i = e("./ConvertWorker"), s = e("./GenericWorker"), u = e("../base64"), n = e("../support"), a = e("../external"), o = null;
        if (n.nodestream) try {
          o = e("../nodejs/NodejsStreamOutputAdapter");
        } catch (e2) {
        }
        function l(e2, o2) {
          return new a.Promise(function(t2, r2) {
            var n2 = [], i2 = e2._internalType, s2 = e2._outputType, a2 = e2._mimeType;
            e2.on("data", function(e3, t3) {
              n2.push(e3), o2 && o2(t3);
            }).on("error", function(e3) {
              n2 = [], r2(e3);
            }).on("end", function() {
              try {
                var e3 = (function(e4, t3, r3) {
                  switch (e4) {
                    case "blob":
                      return h.newBlob(h.transformTo("arraybuffer", t3), r3);
                    case "base64":
                      return u.encode(t3);
                    default:
                      return h.transformTo(e4, t3);
                  }
                })(s2, (function(e4, t3) {
                  var r3, n3 = 0, i3 = null, s3 = 0;
                  for (r3 = 0; r3 < t3.length; r3++) s3 += t3[r3].length;
                  switch (e4) {
                    case "string":
                      return t3.join("");
                    case "array":
                      return Array.prototype.concat.apply([], t3);
                    case "uint8array":
                      for (i3 = new Uint8Array(s3), r3 = 0; r3 < t3.length; r3++) i3.set(t3[r3], n3), n3 += t3[r3].length;
                      return i3;
                    case "nodebuffer":
                      return Buffer.concat(t3);
                    default:
                      throw new Error("concat : unsupported type '" + e4 + "'");
                  }
                })(i2, n2), a2);
                t2(e3);
              } catch (e4) {
                r2(e4);
              }
              n2 = [];
            }).resume();
          });
        }
        function f(e2, t2, r2) {
          var n2 = t2;
          switch (t2) {
            case "blob":
            case "arraybuffer":
              n2 = "uint8array";
              break;
            case "base64":
              n2 = "string";
          }
          try {
            this._internalType = n2, this._outputType = t2, this._mimeType = r2, h.checkSupport(n2), this._worker = e2.pipe(new i(n2)), e2.lock();
          } catch (e3) {
            this._worker = new s("error"), this._worker.error(e3);
          }
        }
        f.prototype = { accumulate: function(e2) {
          return l(this, e2);
        }, on: function(e2, t2) {
          var r2 = this;
          return "data" === e2 ? this._worker.on(e2, function(e3) {
            t2.call(r2, e3.data, e3.meta);
          }) : this._worker.on(e2, function() {
            h.delay(t2, arguments, r2);
          }), this;
        }, resume: function() {
          return h.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(e2) {
          if (h.checkSupport("nodestream"), "nodebuffer" !== this._outputType) throw new Error(this._outputType + " is not supported by this method");
          return new o(this, { objectMode: "nodebuffer" !== this._outputType }, e2);
        } }, t.exports = f;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, t, r) {
        "use strict";
        if (r.base64 = true, r.array = true, r.string = true, r.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, r.nodebuffer = "undefined" != typeof Buffer, r.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) r.blob = false;
        else {
          var n = new ArrayBuffer(0);
          try {
            r.blob = 0 === new Blob([n], { type: "application/zip" }).size;
          } catch (e2) {
            try {
              var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              i.append(n), r.blob = 0 === i.getBlob("application/zip").size;
            } catch (e3) {
              r.blob = false;
            }
          }
        }
        try {
          r.nodestream = !!e("readable-stream").Readable;
        } catch (e2) {
          r.nodestream = false;
        }
      }, { "readable-stream": 16 }], 31: [function(e, t, s) {
        "use strict";
        for (var o = e("./utils"), h = e("./support"), r = e("./nodejsUtils"), n = e("./stream/GenericWorker"), u = new Array(256), i = 0; i < 256; i++) u[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1;
        u[254] = u[254] = 1;
        function a() {
          n.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function l() {
          n.call(this, "utf-8 encode");
        }
        s.utf8encode = function(e2) {
          return h.nodebuffer ? r.newBufferFrom(e2, "utf-8") : (function(e3) {
            var t2, r2, n2, i2, s2, a2 = e3.length, o2 = 0;
            for (i2 = 0; i2 < a2; i2++) 55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o2 += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
            for (t2 = h.uint8array ? new Uint8Array(o2) : new Array(o2), i2 = s2 = 0; s2 < o2; i2++) 55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
            return t2;
          })(e2);
        }, s.utf8decode = function(e2) {
          return h.nodebuffer ? o.transformTo("nodebuffer", e2).toString("utf-8") : (function(e3) {
            var t2, r2, n2, i2, s2 = e3.length, a2 = new Array(2 * s2);
            for (t2 = r2 = 0; t2 < s2; ) if ((n2 = e3[t2++]) < 128) a2[r2++] = n2;
            else if (4 < (i2 = u[n2])) a2[r2++] = 65533, t2 += i2 - 1;
            else {
              for (n2 &= 2 === i2 ? 31 : 3 === i2 ? 15 : 7; 1 < i2 && t2 < s2; ) n2 = n2 << 6 | 63 & e3[t2++], i2--;
              1 < i2 ? a2[r2++] = 65533 : n2 < 65536 ? a2[r2++] = n2 : (n2 -= 65536, a2[r2++] = 55296 | n2 >> 10 & 1023, a2[r2++] = 56320 | 1023 & n2);
            }
            return a2.length !== r2 && (a2.subarray ? a2 = a2.subarray(0, r2) : a2.length = r2), o.applyFromCharCode(a2);
          })(e2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2));
        }, o.inherits(a, n), a.prototype.processChunk = function(e2) {
          var t2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2.data);
          if (this.leftOver && this.leftOver.length) {
            if (h.uint8array) {
              var r2 = t2;
              (t2 = new Uint8Array(r2.length + this.leftOver.length)).set(this.leftOver, 0), t2.set(r2, this.leftOver.length);
            } else t2 = this.leftOver.concat(t2);
            this.leftOver = null;
          }
          var n2 = (function(e3, t3) {
            var r3;
            for ((t3 = t3 || e3.length) > e3.length && (t3 = e3.length), r3 = t3 - 1; 0 <= r3 && 128 == (192 & e3[r3]); ) r3--;
            return r3 < 0 ? t3 : 0 === r3 ? t3 : r3 + u[e3[r3]] > t3 ? r3 : t3;
          })(t2), i2 = t2;
          n2 !== t2.length && (h.uint8array ? (i2 = t2.subarray(0, n2), this.leftOver = t2.subarray(n2, t2.length)) : (i2 = t2.slice(0, n2), this.leftOver = t2.slice(n2, t2.length))), this.push({ data: s.utf8decode(i2), meta: e2.meta });
        }, a.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: s.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, s.Utf8DecodeWorker = a, o.inherits(l, n), l.prototype.processChunk = function(e2) {
          this.push({ data: s.utf8encode(e2.data), meta: e2.meta });
        }, s.Utf8EncodeWorker = l;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, t, a) {
        "use strict";
        var o = e("./support"), h = e("./base64"), r = e("./nodejsUtils"), u = e("./external");
        function n(e2) {
          return e2;
        }
        function l(e2, t2) {
          for (var r2 = 0; r2 < e2.length; ++r2) t2[r2] = 255 & e2.charCodeAt(r2);
          return t2;
        }
        e("setimmediate"), a.newBlob = function(t2, r2) {
          a.checkSupport("blob");
          try {
            return new Blob([t2], { type: r2 });
          } catch (e2) {
            try {
              var n2 = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return n2.append(t2), n2.getBlob(r2);
            } catch (e3) {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var i = { stringifyByChunk: function(e2, t2, r2) {
          var n2 = [], i2 = 0, s2 = e2.length;
          if (s2 <= r2) return String.fromCharCode.apply(null, e2);
          for (; i2 < s2; ) "array" === t2 || "nodebuffer" === t2 ? n2.push(String.fromCharCode.apply(null, e2.slice(i2, Math.min(i2 + r2, s2)))) : n2.push(String.fromCharCode.apply(null, e2.subarray(i2, Math.min(i2 + r2, s2)))), i2 += r2;
          return n2.join("");
        }, stringifyByChar: function(e2) {
          for (var t2 = "", r2 = 0; r2 < e2.length; r2++) t2 += String.fromCharCode(e2[r2]);
          return t2;
        }, applyCanBeUsed: { uint8array: (function() {
          try {
            return o.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length;
          } catch (e2) {
            return false;
          }
        })(), nodebuffer: (function() {
          try {
            return o.nodebuffer && 1 === String.fromCharCode.apply(null, r.allocBuffer(1)).length;
          } catch (e2) {
            return false;
          }
        })() } };
        function s(e2) {
          var t2 = 65536, r2 = a.getTypeOf(e2), n2 = true;
          if ("uint8array" === r2 ? n2 = i.applyCanBeUsed.uint8array : "nodebuffer" === r2 && (n2 = i.applyCanBeUsed.nodebuffer), n2) for (; 1 < t2; ) try {
            return i.stringifyByChunk(e2, r2, t2);
          } catch (e3) {
            t2 = Math.floor(t2 / 2);
          }
          return i.stringifyByChar(e2);
        }
        function f(e2, t2) {
          for (var r2 = 0; r2 < e2.length; r2++) t2[r2] = e2[r2];
          return t2;
        }
        a.applyFromCharCode = s;
        var c = {};
        c.string = { string: n, array: function(e2) {
          return l(e2, new Array(e2.length));
        }, arraybuffer: function(e2) {
          return c.string.uint8array(e2).buffer;
        }, uint8array: function(e2) {
          return l(e2, new Uint8Array(e2.length));
        }, nodebuffer: function(e2) {
          return l(e2, r.allocBuffer(e2.length));
        } }, c.array = { string: s, array: n, arraybuffer: function(e2) {
          return new Uint8Array(e2).buffer;
        }, uint8array: function(e2) {
          return new Uint8Array(e2);
        }, nodebuffer: function(e2) {
          return r.newBufferFrom(e2);
        } }, c.arraybuffer = { string: function(e2) {
          return s(new Uint8Array(e2));
        }, array: function(e2) {
          return f(new Uint8Array(e2), new Array(e2.byteLength));
        }, arraybuffer: n, uint8array: function(e2) {
          return new Uint8Array(e2);
        }, nodebuffer: function(e2) {
          return r.newBufferFrom(new Uint8Array(e2));
        } }, c.uint8array = { string: s, array: function(e2) {
          return f(e2, new Array(e2.length));
        }, arraybuffer: function(e2) {
          return e2.buffer;
        }, uint8array: n, nodebuffer: function(e2) {
          return r.newBufferFrom(e2);
        } }, c.nodebuffer = { string: s, array: function(e2) {
          return f(e2, new Array(e2.length));
        }, arraybuffer: function(e2) {
          return c.nodebuffer.uint8array(e2).buffer;
        }, uint8array: function(e2) {
          return f(e2, new Uint8Array(e2.length));
        }, nodebuffer: n }, a.transformTo = function(e2, t2) {
          if (t2 = t2 || "", !e2) return t2;
          a.checkSupport(e2);
          var r2 = a.getTypeOf(t2);
          return c[r2][e2](t2);
        }, a.resolve = function(e2) {
          for (var t2 = e2.split("/"), r2 = [], n2 = 0; n2 < t2.length; n2++) {
            var i2 = t2[n2];
            "." === i2 || "" === i2 && 0 !== n2 && n2 !== t2.length - 1 || (".." === i2 ? r2.pop() : r2.push(i2));
          }
          return r2.join("/");
        }, a.getTypeOf = function(e2) {
          return "string" == typeof e2 ? "string" : "[object Array]" === Object.prototype.toString.call(e2) ? "array" : o.nodebuffer && r.isBuffer(e2) ? "nodebuffer" : o.uint8array && e2 instanceof Uint8Array ? "uint8array" : o.arraybuffer && e2 instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, a.checkSupport = function(e2) {
          if (!o[e2.toLowerCase()]) throw new Error(e2 + " is not supported by this platform");
        }, a.MAX_VALUE_16BITS = 65535, a.MAX_VALUE_32BITS = -1, a.pretty = function(e2) {
          var t2, r2, n2 = "";
          for (r2 = 0; r2 < (e2 || "").length; r2++) n2 += "\\x" + ((t2 = e2.charCodeAt(r2)) < 16 ? "0" : "") + t2.toString(16).toUpperCase();
          return n2;
        }, a.delay = function(e2, t2, r2) {
          setImmediate(function() {
            e2.apply(r2 || null, t2 || []);
          });
        }, a.inherits = function(e2, t2) {
          function r2() {
          }
          r2.prototype = t2.prototype, e2.prototype = new r2();
        }, a.extend = function() {
          var e2, t2, r2 = {};
          for (e2 = 0; e2 < arguments.length; e2++) for (t2 in arguments[e2]) Object.prototype.hasOwnProperty.call(arguments[e2], t2) && void 0 === r2[t2] && (r2[t2] = arguments[e2][t2]);
          return r2;
        }, a.prepareContent = function(r2, e2, n2, i2, s2) {
          return u.Promise.resolve(e2).then(function(n3) {
            return o.blob && (n3 instanceof Blob || -1 !== ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(n3))) && "undefined" != typeof FileReader ? new u.Promise(function(t2, r3) {
              var e3 = new FileReader();
              e3.onload = function(e4) {
                t2(e4.target.result);
              }, e3.onerror = function(e4) {
                r3(e4.target.error);
              }, e3.readAsArrayBuffer(n3);
            }) : n3;
          }).then(function(e3) {
            var t2 = a.getTypeOf(e3);
            return t2 ? ("arraybuffer" === t2 ? e3 = a.transformTo("uint8array", e3) : "string" === t2 && (s2 ? e3 = h.decode(e3) : n2 && true !== i2 && (e3 = (function(e4) {
              return l(e4, o.uint8array ? new Uint8Array(e4.length) : new Array(e4.length));
            })(e3))), e3) : u.Promise.reject(new Error("Can't read the data of '" + r2 + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, t, r) {
        "use strict";
        var n = e("./reader/readerFor"), i = e("./utils"), s = e("./signature"), a = e("./zipEntry"), o = e("./support");
        function h(e2) {
          this.files = [], this.loadOptions = e2;
        }
        h.prototype = { checkSignature: function(e2) {
          if (!this.reader.readAndCheckSignature(e2)) {
            this.reader.index -= 4;
            var t2 = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(t2) + ", expected " + i.pretty(e2) + ")");
          }
        }, isSignature: function(e2, t2) {
          var r2 = this.reader.index;
          this.reader.setIndex(e2);
          var n2 = this.reader.readString(4) === t2;
          return this.reader.setIndex(r2), n2;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var e2 = this.reader.readData(this.zipCommentLength), t2 = o.uint8array ? "uint8array" : "array", r2 = i.transformTo(t2, e2);
          this.zipComment = this.loadOptions.decodeFileName(r2);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var e2, t2, r2, n2 = this.zip64EndOfCentralSize - 44; 0 < n2; ) e2 = this.reader.readInt(2), t2 = this.reader.readInt(4), r2 = this.reader.readData(t2), this.zip64ExtensibleData[e2] = { id: e2, length: t2, value: r2 };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var e2, t2;
          for (e2 = 0; e2 < this.files.length; e2++) t2 = this.files[e2], this.reader.setIndex(t2.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), t2.readLocalPart(this.reader), t2.handleUTF8(), t2.processAttributes();
        }, readCentralDir: function() {
          var e2;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER); ) (e2 = new a({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(e2);
          if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var e2 = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
          if (e2 < 0) throw !this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip: can't find end of central directory");
          this.reader.setIndex(e2);
          var t2 = e2;
          if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
            if (this.zip64 = true, (e2 = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(e2), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var r2 = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (r2 += 20, r2 += 12 + this.zip64EndOfCentralSize);
          var n2 = t2 - r2;
          if (0 < n2) this.isSignature(t2, s.CENTRAL_FILE_HEADER) || (this.reader.zero = n2);
          else if (n2 < 0) throw new Error("Corrupted zip: missing " + Math.abs(n2) + " bytes.");
        }, prepareReader: function(e2) {
          this.reader = n(e2);
        }, load: function(e2) {
          this.prepareReader(e2), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, t.exports = h;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, t, r) {
        "use strict";
        var n = e("./reader/readerFor"), s = e("./utils"), i = e("./compressedObject"), a = e("./crc32"), o = e("./utf8"), h = e("./compressions"), u = e("./support");
        function l(e2, t2) {
          this.options = e2, this.loadOptions = t2;
        }
        l.prototype = { isEncrypted: function() {
          return 1 == (1 & this.bitFlag);
        }, useUTF8: function() {
          return 2048 == (2048 & this.bitFlag);
        }, readLocalPart: function(e2) {
          var t2, r2;
          if (e2.skip(22), this.fileNameLength = e2.readInt(2), r2 = e2.readInt(2), this.fileName = e2.readData(this.fileNameLength), e2.skip(r2), -1 === this.compressedSize || -1 === this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if (null === (t2 = (function(e3) {
            for (var t3 in h) if (Object.prototype.hasOwnProperty.call(h, t3) && h[t3].magic === e3) return h[t3];
            return null;
          })(this.compressionMethod))) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
          this.decompressed = new i(this.compressedSize, this.uncompressedSize, this.crc32, t2, e2.readData(this.compressedSize));
        }, readCentralPart: function(e2) {
          this.versionMadeBy = e2.readInt(2), e2.skip(2), this.bitFlag = e2.readInt(2), this.compressionMethod = e2.readString(2), this.date = e2.readDate(), this.crc32 = e2.readInt(4), this.compressedSize = e2.readInt(4), this.uncompressedSize = e2.readInt(4);
          var t2 = e2.readInt(2);
          if (this.extraFieldsLength = e2.readInt(2), this.fileCommentLength = e2.readInt(2), this.diskNumberStart = e2.readInt(2), this.internalFileAttributes = e2.readInt(2), this.externalFileAttributes = e2.readInt(4), this.localHeaderOffset = e2.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          e2.skip(t2), this.readExtraFields(e2), this.parseZIP64ExtraField(e2), this.fileComment = e2.readData(this.fileCommentLength);
        }, processAttributes: function() {
          this.unixPermissions = null, this.dosPermissions = null;
          var e2 = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), 0 == e2 && (this.dosPermissions = 63 & this.externalFileAttributes), 3 == e2 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = true);
        }, parseZIP64ExtraField: function() {
          if (this.extraFields[1]) {
            var e2 = n(this.extraFields[1].value);
            this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = e2.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = e2.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = e2.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = e2.readInt(4));
          }
        }, readExtraFields: function(e2) {
          var t2, r2, n2, i2 = e2.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); e2.index + 4 < i2; ) t2 = e2.readInt(2), r2 = e2.readInt(2), n2 = e2.readData(r2), this.extraFields[t2] = { id: t2, length: r2, value: n2 };
          e2.setIndex(i2);
        }, handleUTF8: function() {
          var e2 = u.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = o.utf8decode(this.fileName), this.fileCommentStr = o.utf8decode(this.fileComment);
          else {
            var t2 = this.findExtraFieldUnicodePath();
            if (null !== t2) this.fileNameStr = t2;
            else {
              var r2 = s.transformTo(e2, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(r2);
            }
            var n2 = this.findExtraFieldUnicodeComment();
            if (null !== n2) this.fileCommentStr = n2;
            else {
              var i2 = s.transformTo(e2, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(i2);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var e2 = this.extraFields[28789];
          if (e2) {
            var t2 = n(e2.value);
            return 1 !== t2.readInt(1) ? null : a(this.fileName) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var e2 = this.extraFields[25461];
          if (e2) {
            var t2 = n(e2.value);
            return 1 !== t2.readInt(1) ? null : a(this.fileComment) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
          }
          return null;
        } }, t.exports = l;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, t, r) {
        "use strict";
        function n(e2, t2, r2) {
          this.name = e2, this.dir = r2.dir, this.date = r2.date, this.comment = r2.comment, this.unixPermissions = r2.unixPermissions, this.dosPermissions = r2.dosPermissions, this._data = t2, this._dataBinary = r2.binary, this.options = { compression: r2.compression, compressionOptions: r2.compressionOptions };
        }
        var s = e("./stream/StreamHelper"), i = e("./stream/DataWorker"), a = e("./utf8"), o = e("./compressedObject"), h = e("./stream/GenericWorker");
        n.prototype = { internalStream: function(e2) {
          var t2 = null, r2 = "string";
          try {
            if (!e2) throw new Error("No output type specified.");
            var n2 = "string" === (r2 = e2.toLowerCase()) || "text" === r2;
            "binarystring" !== r2 && "text" !== r2 || (r2 = "string"), t2 = this._decompressWorker();
            var i2 = !this._dataBinary;
            i2 && !n2 && (t2 = t2.pipe(new a.Utf8EncodeWorker())), !i2 && n2 && (t2 = t2.pipe(new a.Utf8DecodeWorker()));
          } catch (e3) {
            (t2 = new h("error")).error(e3);
          }
          return new s(t2, r2, "");
        }, async: function(e2, t2) {
          return this.internalStream(e2).accumulate(t2);
        }, nodeStream: function(e2, t2) {
          return this.internalStream(e2 || "nodebuffer").toNodejsStream(t2);
        }, _compressWorker: function(e2, t2) {
          if (this._data instanceof o && this._data.compression.magic === e2.magic) return this._data.getCompressedWorker();
          var r2 = this._decompressWorker();
          return this._dataBinary || (r2 = r2.pipe(new a.Utf8EncodeWorker())), o.createWorkerFrom(r2, e2, t2);
        }, _decompressWorker: function() {
          return this._data instanceof o ? this._data.getContentWorker() : this._data instanceof h ? this._data : new i(this._data);
        } };
        for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], l = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, f = 0; f < u.length; f++) n.prototype[u[f]] = l;
        t.exports = n;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, l, t) {
        (function(t2) {
          "use strict";
          var r, n, e2 = t2.MutationObserver || t2.WebKitMutationObserver;
          if (e2) {
            var i = 0, s = new e2(u), a = t2.document.createTextNode("");
            s.observe(a, { characterData: true }), r = function() {
              a.data = i = ++i % 2;
            };
          } else if (t2.setImmediate || void 0 === t2.MessageChannel) r = "document" in t2 && "onreadystatechange" in t2.document.createElement("script") ? function() {
            var e3 = t2.document.createElement("script");
            e3.onreadystatechange = function() {
              u(), e3.onreadystatechange = null, e3.parentNode.removeChild(e3), e3 = null;
            }, t2.document.documentElement.appendChild(e3);
          } : function() {
            setTimeout(u, 0);
          };
          else {
            var o = new t2.MessageChannel();
            o.port1.onmessage = u, r = function() {
              o.port2.postMessage(0);
            };
          }
          var h = [];
          function u() {
            var e3, t3;
            n = true;
            for (var r2 = h.length; r2; ) {
              for (t3 = h, h = [], e3 = -1; ++e3 < r2; ) t3[e3]();
              r2 = h.length;
            }
            n = false;
          }
          l.exports = function(e3) {
            1 !== h.push(e3) || n || r();
          };
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
      }, {}], 37: [function(e, t, r) {
        "use strict";
        var i = e("immediate");
        function u() {
        }
        var l = {}, s = ["REJECTED"], a = ["FULFILLED"], n = ["PENDING"];
        function o(e2) {
          if ("function" != typeof e2) throw new TypeError("resolver must be a function");
          this.state = n, this.queue = [], this.outcome = void 0, e2 !== u && d(this, e2);
        }
        function h(e2, t2, r2) {
          this.promise = e2, "function" == typeof t2 && (this.onFulfilled = t2, this.callFulfilled = this.otherCallFulfilled), "function" == typeof r2 && (this.onRejected = r2, this.callRejected = this.otherCallRejected);
        }
        function f(t2, r2, n2) {
          i(function() {
            var e2;
            try {
              e2 = r2(n2);
            } catch (e3) {
              return l.reject(t2, e3);
            }
            e2 === t2 ? l.reject(t2, new TypeError("Cannot resolve promise with itself")) : l.resolve(t2, e2);
          });
        }
        function c(e2) {
          var t2 = e2 && e2.then;
          if (e2 && ("object" == typeof e2 || "function" == typeof e2) && "function" == typeof t2) return function() {
            t2.apply(e2, arguments);
          };
        }
        function d(t2, e2) {
          var r2 = false;
          function n2(e3) {
            r2 || (r2 = true, l.reject(t2, e3));
          }
          function i2(e3) {
            r2 || (r2 = true, l.resolve(t2, e3));
          }
          var s2 = p(function() {
            e2(i2, n2);
          });
          "error" === s2.status && n2(s2.value);
        }
        function p(e2, t2) {
          var r2 = {};
          try {
            r2.value = e2(t2), r2.status = "success";
          } catch (e3) {
            r2.status = "error", r2.value = e3;
          }
          return r2;
        }
        (t.exports = o).prototype.finally = function(t2) {
          if ("function" != typeof t2) return this;
          var r2 = this.constructor;
          return this.then(function(e2) {
            return r2.resolve(t2()).then(function() {
              return e2;
            });
          }, function(e2) {
            return r2.resolve(t2()).then(function() {
              throw e2;
            });
          });
        }, o.prototype.catch = function(e2) {
          return this.then(null, e2);
        }, o.prototype.then = function(e2, t2) {
          if ("function" != typeof e2 && this.state === a || "function" != typeof t2 && this.state === s) return this;
          var r2 = new this.constructor(u);
          this.state !== n ? f(r2, this.state === a ? e2 : t2, this.outcome) : this.queue.push(new h(r2, e2, t2));
          return r2;
        }, h.prototype.callFulfilled = function(e2) {
          l.resolve(this.promise, e2);
        }, h.prototype.otherCallFulfilled = function(e2) {
          f(this.promise, this.onFulfilled, e2);
        }, h.prototype.callRejected = function(e2) {
          l.reject(this.promise, e2);
        }, h.prototype.otherCallRejected = function(e2) {
          f(this.promise, this.onRejected, e2);
        }, l.resolve = function(e2, t2) {
          var r2 = p(c, t2);
          if ("error" === r2.status) return l.reject(e2, r2.value);
          var n2 = r2.value;
          if (n2) d(e2, n2);
          else {
            e2.state = a, e2.outcome = t2;
            for (var i2 = -1, s2 = e2.queue.length; ++i2 < s2; ) e2.queue[i2].callFulfilled(t2);
          }
          return e2;
        }, l.reject = function(e2, t2) {
          e2.state = s, e2.outcome = t2;
          for (var r2 = -1, n2 = e2.queue.length; ++r2 < n2; ) e2.queue[r2].callRejected(t2);
          return e2;
        }, o.resolve = function(e2) {
          if (e2 instanceof this) return e2;
          return l.resolve(new this(u), e2);
        }, o.reject = function(e2) {
          var t2 = new this(u);
          return l.reject(t2, e2);
        }, o.all = function(e2) {
          var r2 = this;
          if ("[object Array]" !== Object.prototype.toString.call(e2)) return this.reject(new TypeError("must be an array"));
          var n2 = e2.length, i2 = false;
          if (!n2) return this.resolve([]);
          var s2 = new Array(n2), a2 = 0, t2 = -1, o2 = new this(u);
          for (; ++t2 < n2; ) h2(e2[t2], t2);
          return o2;
          function h2(e3, t3) {
            r2.resolve(e3).then(function(e4) {
              s2[t3] = e4, ++a2 !== n2 || i2 || (i2 = true, l.resolve(o2, s2));
            }, function(e4) {
              i2 || (i2 = true, l.reject(o2, e4));
            });
          }
        }, o.race = function(e2) {
          var t2 = this;
          if ("[object Array]" !== Object.prototype.toString.call(e2)) return this.reject(new TypeError("must be an array"));
          var r2 = e2.length, n2 = false;
          if (!r2) return this.resolve([]);
          var i2 = -1, s2 = new this(u);
          for (; ++i2 < r2; ) a2 = e2[i2], t2.resolve(a2).then(function(e3) {
            n2 || (n2 = true, l.resolve(s2, e3));
          }, function(e3) {
            n2 || (n2 = true, l.reject(s2, e3));
          });
          var a2;
          return s2;
        };
      }, { immediate: 36 }], 38: [function(e, t, r) {
        "use strict";
        var n = {};
        (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), t.exports = n;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, t, r) {
        "use strict";
        var a = e("./zlib/deflate"), o = e("./utils/common"), h = e("./utils/strings"), i = e("./zlib/messages"), s = e("./zlib/zstream"), u = Object.prototype.toString, l = 0, f = -1, c = 0, d = 8;
        function p(e2) {
          if (!(this instanceof p)) return new p(e2);
          this.options = o.assign({ level: f, method: d, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: c, to: "" }, e2 || {});
          var t2 = this.options;
          t2.raw && 0 < t2.windowBits ? t2.windowBits = -t2.windowBits : t2.gzip && 0 < t2.windowBits && t2.windowBits < 16 && (t2.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new s(), this.strm.avail_out = 0;
          var r2 = a.deflateInit2(this.strm, t2.level, t2.method, t2.windowBits, t2.memLevel, t2.strategy);
          if (r2 !== l) throw new Error(i[r2]);
          if (t2.header && a.deflateSetHeader(this.strm, t2.header), t2.dictionary) {
            var n2;
            if (n2 = "string" == typeof t2.dictionary ? h.string2buf(t2.dictionary) : "[object ArrayBuffer]" === u.call(t2.dictionary) ? new Uint8Array(t2.dictionary) : t2.dictionary, (r2 = a.deflateSetDictionary(this.strm, n2)) !== l) throw new Error(i[r2]);
            this._dict_set = true;
          }
        }
        function n(e2, t2) {
          var r2 = new p(t2);
          if (r2.push(e2, true), r2.err) throw r2.msg || i[r2.err];
          return r2.result;
        }
        p.prototype.push = function(e2, t2) {
          var r2, n2, i2 = this.strm, s2 = this.options.chunkSize;
          if (this.ended) return false;
          n2 = t2 === ~~t2 ? t2 : true === t2 ? 4 : 0, "string" == typeof e2 ? i2.input = h.string2buf(e2) : "[object ArrayBuffer]" === u.call(e2) ? i2.input = new Uint8Array(e2) : i2.input = e2, i2.next_in = 0, i2.avail_in = i2.input.length;
          do {
            if (0 === i2.avail_out && (i2.output = new o.Buf8(s2), i2.next_out = 0, i2.avail_out = s2), 1 !== (r2 = a.deflate(i2, n2)) && r2 !== l) return this.onEnd(r2), !(this.ended = true);
            0 !== i2.avail_out && (0 !== i2.avail_in || 4 !== n2 && 2 !== n2) || ("string" === this.options.to ? this.onData(h.buf2binstring(o.shrinkBuf(i2.output, i2.next_out))) : this.onData(o.shrinkBuf(i2.output, i2.next_out)));
          } while ((0 < i2.avail_in || 0 === i2.avail_out) && 1 !== r2);
          return 4 === n2 ? (r2 = a.deflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === l) : 2 !== n2 || (this.onEnd(l), !(i2.avail_out = 0));
        }, p.prototype.onData = function(e2) {
          this.chunks.push(e2);
        }, p.prototype.onEnd = function(e2) {
          e2 === l && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
        }, r.Deflate = p, r.deflate = n, r.deflateRaw = function(e2, t2) {
          return (t2 = t2 || {}).raw = true, n(e2, t2);
        }, r.gzip = function(e2, t2) {
          return (t2 = t2 || {}).gzip = true, n(e2, t2);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, t, r) {
        "use strict";
        var c = e("./zlib/inflate"), d = e("./utils/common"), p = e("./utils/strings"), m = e("./zlib/constants"), n = e("./zlib/messages"), i = e("./zlib/zstream"), s = e("./zlib/gzheader"), _ = Object.prototype.toString;
        function a(e2) {
          if (!(this instanceof a)) return new a(e2);
          this.options = d.assign({ chunkSize: 16384, windowBits: 0, to: "" }, e2 || {});
          var t2 = this.options;
          t2.raw && 0 <= t2.windowBits && t2.windowBits < 16 && (t2.windowBits = -t2.windowBits, 0 === t2.windowBits && (t2.windowBits = -15)), !(0 <= t2.windowBits && t2.windowBits < 16) || e2 && e2.windowBits || (t2.windowBits += 32), 15 < t2.windowBits && t2.windowBits < 48 && 0 == (15 & t2.windowBits) && (t2.windowBits |= 15), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new i(), this.strm.avail_out = 0;
          var r2 = c.inflateInit2(this.strm, t2.windowBits);
          if (r2 !== m.Z_OK) throw new Error(n[r2]);
          this.header = new s(), c.inflateGetHeader(this.strm, this.header);
        }
        function o(e2, t2) {
          var r2 = new a(t2);
          if (r2.push(e2, true), r2.err) throw r2.msg || n[r2.err];
          return r2.result;
        }
        a.prototype.push = function(e2, t2) {
          var r2, n2, i2, s2, a2, o2, h = this.strm, u = this.options.chunkSize, l = this.options.dictionary, f = false;
          if (this.ended) return false;
          n2 = t2 === ~~t2 ? t2 : true === t2 ? m.Z_FINISH : m.Z_NO_FLUSH, "string" == typeof e2 ? h.input = p.binstring2buf(e2) : "[object ArrayBuffer]" === _.call(e2) ? h.input = new Uint8Array(e2) : h.input = e2, h.next_in = 0, h.avail_in = h.input.length;
          do {
            if (0 === h.avail_out && (h.output = new d.Buf8(u), h.next_out = 0, h.avail_out = u), (r2 = c.inflate(h, m.Z_NO_FLUSH)) === m.Z_NEED_DICT && l && (o2 = "string" == typeof l ? p.string2buf(l) : "[object ArrayBuffer]" === _.call(l) ? new Uint8Array(l) : l, r2 = c.inflateSetDictionary(this.strm, o2)), r2 === m.Z_BUF_ERROR && true === f && (r2 = m.Z_OK, f = false), r2 !== m.Z_STREAM_END && r2 !== m.Z_OK) return this.onEnd(r2), !(this.ended = true);
            h.next_out && (0 !== h.avail_out && r2 !== m.Z_STREAM_END && (0 !== h.avail_in || n2 !== m.Z_FINISH && n2 !== m.Z_SYNC_FLUSH) || ("string" === this.options.to ? (i2 = p.utf8border(h.output, h.next_out), s2 = h.next_out - i2, a2 = p.buf2string(h.output, i2), h.next_out = s2, h.avail_out = u - s2, s2 && d.arraySet(h.output, h.output, i2, s2, 0), this.onData(a2)) : this.onData(d.shrinkBuf(h.output, h.next_out)))), 0 === h.avail_in && 0 === h.avail_out && (f = true);
          } while ((0 < h.avail_in || 0 === h.avail_out) && r2 !== m.Z_STREAM_END);
          return r2 === m.Z_STREAM_END && (n2 = m.Z_FINISH), n2 === m.Z_FINISH ? (r2 = c.inflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === m.Z_OK) : n2 !== m.Z_SYNC_FLUSH || (this.onEnd(m.Z_OK), !(h.avail_out = 0));
        }, a.prototype.onData = function(e2) {
          this.chunks.push(e2);
        }, a.prototype.onEnd = function(e2) {
          e2 === m.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = d.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
        }, r.Inflate = a, r.inflate = o, r.inflateRaw = function(e2, t2) {
          return (t2 = t2 || {}).raw = true, o(e2, t2);
        }, r.ungzip = o;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, t, r) {
        "use strict";
        var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
        r.assign = function(e2) {
          for (var t2 = Array.prototype.slice.call(arguments, 1); t2.length; ) {
            var r2 = t2.shift();
            if (r2) {
              if ("object" != typeof r2) throw new TypeError(r2 + "must be non-object");
              for (var n2 in r2) r2.hasOwnProperty(n2) && (e2[n2] = r2[n2]);
            }
          }
          return e2;
        }, r.shrinkBuf = function(e2, t2) {
          return e2.length === t2 ? e2 : e2.subarray ? e2.subarray(0, t2) : (e2.length = t2, e2);
        };
        var i = { arraySet: function(e2, t2, r2, n2, i2) {
          if (t2.subarray && e2.subarray) e2.set(t2.subarray(r2, r2 + n2), i2);
          else for (var s2 = 0; s2 < n2; s2++) e2[i2 + s2] = t2[r2 + s2];
        }, flattenChunks: function(e2) {
          var t2, r2, n2, i2, s2, a;
          for (t2 = n2 = 0, r2 = e2.length; t2 < r2; t2++) n2 += e2[t2].length;
          for (a = new Uint8Array(n2), t2 = i2 = 0, r2 = e2.length; t2 < r2; t2++) s2 = e2[t2], a.set(s2, i2), i2 += s2.length;
          return a;
        } }, s = { arraySet: function(e2, t2, r2, n2, i2) {
          for (var s2 = 0; s2 < n2; s2++) e2[i2 + s2] = t2[r2 + s2];
        }, flattenChunks: function(e2) {
          return [].concat.apply([], e2);
        } };
        r.setTyped = function(e2) {
          e2 ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, i)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, s));
        }, r.setTyped(n);
      }, {}], 42: [function(e, t, r) {
        "use strict";
        var h = e("./common"), i = true, s = true;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch (e2) {
          i = false;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch (e2) {
          s = false;
        }
        for (var u = new h.Buf8(256), n = 0; n < 256; n++) u[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1;
        function l(e2, t2) {
          if (t2 < 65537 && (e2.subarray && s || !e2.subarray && i)) return String.fromCharCode.apply(null, h.shrinkBuf(e2, t2));
          for (var r2 = "", n2 = 0; n2 < t2; n2++) r2 += String.fromCharCode(e2[n2]);
          return r2;
        }
        u[254] = u[254] = 1, r.string2buf = function(e2) {
          var t2, r2, n2, i2, s2, a = e2.length, o = 0;
          for (i2 = 0; i2 < a; i2++) 55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
          for (t2 = new h.Buf8(o), i2 = s2 = 0; s2 < o; i2++) 55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
          return t2;
        }, r.buf2binstring = function(e2) {
          return l(e2, e2.length);
        }, r.binstring2buf = function(e2) {
          for (var t2 = new h.Buf8(e2.length), r2 = 0, n2 = t2.length; r2 < n2; r2++) t2[r2] = e2.charCodeAt(r2);
          return t2;
        }, r.buf2string = function(e2, t2) {
          var r2, n2, i2, s2, a = t2 || e2.length, o = new Array(2 * a);
          for (r2 = n2 = 0; r2 < a; ) if ((i2 = e2[r2++]) < 128) o[n2++] = i2;
          else if (4 < (s2 = u[i2])) o[n2++] = 65533, r2 += s2 - 1;
          else {
            for (i2 &= 2 === s2 ? 31 : 3 === s2 ? 15 : 7; 1 < s2 && r2 < a; ) i2 = i2 << 6 | 63 & e2[r2++], s2--;
            1 < s2 ? o[n2++] = 65533 : i2 < 65536 ? o[n2++] = i2 : (i2 -= 65536, o[n2++] = 55296 | i2 >> 10 & 1023, o[n2++] = 56320 | 1023 & i2);
          }
          return l(o, n2);
        }, r.utf8border = function(e2, t2) {
          var r2;
          for ((t2 = t2 || e2.length) > e2.length && (t2 = e2.length), r2 = t2 - 1; 0 <= r2 && 128 == (192 & e2[r2]); ) r2--;
          return r2 < 0 ? t2 : 0 === r2 ? t2 : r2 + u[e2[r2]] > t2 ? r2 : t2;
        };
      }, { "./common": 41 }], 43: [function(e, t, r) {
        "use strict";
        t.exports = function(e2, t2, r2, n) {
          for (var i = 65535 & e2 | 0, s = e2 >>> 16 & 65535 | 0, a = 0; 0 !== r2; ) {
            for (r2 -= a = 2e3 < r2 ? 2e3 : r2; s = s + (i = i + t2[n++] | 0) | 0, --a; ) ;
            i %= 65521, s %= 65521;
          }
          return i | s << 16 | 0;
        };
      }, {}], 44: [function(e, t, r) {
        "use strict";
        t.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, t, r) {
        "use strict";
        var o = (function() {
          for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
            e2 = r2;
            for (var n = 0; n < 8; n++) e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
            t2[r2] = e2;
          }
          return t2;
        })();
        t.exports = function(e2, t2, r2, n) {
          var i = o, s = n + r2;
          e2 ^= -1;
          for (var a = n; a < s; a++) e2 = e2 >>> 8 ^ i[255 & (e2 ^ t2[a])];
          return -1 ^ e2;
        };
      }, {}], 46: [function(e, t, r) {
        "use strict";
        var h, c = e("../utils/common"), u = e("./trees"), d = e("./adler32"), p = e("./crc32"), n = e("./messages"), l = 0, f = 4, m = 0, _ = -2, g = -1, b = 4, i = 2, v = 8, y = 9, s = 286, a = 30, o = 19, w = 2 * s + 1, k = 15, x = 3, S = 258, z = S + x + 1, C = 42, E = 113, A = 1, I = 2, O = 3, B = 4;
        function R(e2, t2) {
          return e2.msg = n[t2], t2;
        }
        function T(e2) {
          return (e2 << 1) - (4 < e2 ? 9 : 0);
        }
        function D(e2) {
          for (var t2 = e2.length; 0 <= --t2; ) e2[t2] = 0;
        }
        function F(e2) {
          var t2 = e2.state, r2 = t2.pending;
          r2 > e2.avail_out && (r2 = e2.avail_out), 0 !== r2 && (c.arraySet(e2.output, t2.pending_buf, t2.pending_out, r2, e2.next_out), e2.next_out += r2, t2.pending_out += r2, e2.total_out += r2, e2.avail_out -= r2, t2.pending -= r2, 0 === t2.pending && (t2.pending_out = 0));
        }
        function N(e2, t2) {
          u._tr_flush_block(e2, 0 <= e2.block_start ? e2.block_start : -1, e2.strstart - e2.block_start, t2), e2.block_start = e2.strstart, F(e2.strm);
        }
        function U(e2, t2) {
          e2.pending_buf[e2.pending++] = t2;
        }
        function P(e2, t2) {
          e2.pending_buf[e2.pending++] = t2 >>> 8 & 255, e2.pending_buf[e2.pending++] = 255 & t2;
        }
        function L(e2, t2) {
          var r2, n2, i2 = e2.max_chain_length, s2 = e2.strstart, a2 = e2.prev_length, o2 = e2.nice_match, h2 = e2.strstart > e2.w_size - z ? e2.strstart - (e2.w_size - z) : 0, u2 = e2.window, l2 = e2.w_mask, f2 = e2.prev, c2 = e2.strstart + S, d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
          e2.prev_length >= e2.good_match && (i2 >>= 2), o2 > e2.lookahead && (o2 = e2.lookahead);
          do {
            if (u2[(r2 = t2) + a2] === p2 && u2[r2 + a2 - 1] === d2 && u2[r2] === u2[s2] && u2[++r2] === u2[s2 + 1]) {
              s2 += 2, r2++;
              do {
              } while (u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && s2 < c2);
              if (n2 = S - (c2 - s2), s2 = c2 - S, a2 < n2) {
                if (e2.match_start = t2, o2 <= (a2 = n2)) break;
                d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
              }
            }
          } while ((t2 = f2[t2 & l2]) > h2 && 0 != --i2);
          return a2 <= e2.lookahead ? a2 : e2.lookahead;
        }
        function j(e2) {
          var t2, r2, n2, i2, s2, a2, o2, h2, u2, l2, f2 = e2.w_size;
          do {
            if (i2 = e2.window_size - e2.lookahead - e2.strstart, e2.strstart >= f2 + (f2 - z)) {
              for (c.arraySet(e2.window, e2.window, f2, f2, 0), e2.match_start -= f2, e2.strstart -= f2, e2.block_start -= f2, t2 = r2 = e2.hash_size; n2 = e2.head[--t2], e2.head[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; ) ;
              for (t2 = r2 = f2; n2 = e2.prev[--t2], e2.prev[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; ) ;
              i2 += f2;
            }
            if (0 === e2.strm.avail_in) break;
            if (a2 = e2.strm, o2 = e2.window, h2 = e2.strstart + e2.lookahead, u2 = i2, l2 = void 0, l2 = a2.avail_in, u2 < l2 && (l2 = u2), r2 = 0 === l2 ? 0 : (a2.avail_in -= l2, c.arraySet(o2, a2.input, a2.next_in, l2, h2), 1 === a2.state.wrap ? a2.adler = d(a2.adler, o2, l2, h2) : 2 === a2.state.wrap && (a2.adler = p(a2.adler, o2, l2, h2)), a2.next_in += l2, a2.total_in += l2, l2), e2.lookahead += r2, e2.lookahead + e2.insert >= x) for (s2 = e2.strstart - e2.insert, e2.ins_h = e2.window[s2], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + 1]) & e2.hash_mask; e2.insert && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + x - 1]) & e2.hash_mask, e2.prev[s2 & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = s2, s2++, e2.insert--, !(e2.lookahead + e2.insert < x)); ) ;
          } while (e2.lookahead < z && 0 !== e2.strm.avail_in);
        }
        function Z(e2, t2) {
          for (var r2, n2; ; ) {
            if (e2.lookahead < z) {
              if (j(e2), e2.lookahead < z && t2 === l) return A;
              if (0 === e2.lookahead) break;
            }
            if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 !== r2 && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2)), e2.match_length >= x) if (n2 = u._tr_tally(e2, e2.strstart - e2.match_start, e2.match_length - x), e2.lookahead -= e2.match_length, e2.match_length <= e2.max_lazy_match && e2.lookahead >= x) {
              for (e2.match_length--; e2.strstart++, e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart, 0 != --e2.match_length; ) ;
              e2.strstart++;
            } else e2.strstart += e2.match_length, e2.match_length = 0, e2.ins_h = e2.window[e2.strstart], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + 1]) & e2.hash_mask;
            else n2 = u._tr_tally(e2, 0, e2.window[e2.strstart]), e2.lookahead--, e2.strstart++;
            if (n2 && (N(e2, false), 0 === e2.strm.avail_out)) return A;
          }
          return e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
        }
        function W(e2, t2) {
          for (var r2, n2, i2; ; ) {
            if (e2.lookahead < z) {
              if (j(e2), e2.lookahead < z && t2 === l) return A;
              if (0 === e2.lookahead) break;
            }
            if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), e2.prev_length = e2.match_length, e2.prev_match = e2.match_start, e2.match_length = x - 1, 0 !== r2 && e2.prev_length < e2.max_lazy_match && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2), e2.match_length <= 5 && (1 === e2.strategy || e2.match_length === x && 4096 < e2.strstart - e2.match_start) && (e2.match_length = x - 1)), e2.prev_length >= x && e2.match_length <= e2.prev_length) {
              for (i2 = e2.strstart + e2.lookahead - x, n2 = u._tr_tally(e2, e2.strstart - 1 - e2.prev_match, e2.prev_length - x), e2.lookahead -= e2.prev_length - 1, e2.prev_length -= 2; ++e2.strstart <= i2 && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 != --e2.prev_length; ) ;
              if (e2.match_available = 0, e2.match_length = x - 1, e2.strstart++, n2 && (N(e2, false), 0 === e2.strm.avail_out)) return A;
            } else if (e2.match_available) {
              if ((n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1])) && N(e2, false), e2.strstart++, e2.lookahead--, 0 === e2.strm.avail_out) return A;
            } else e2.match_available = 1, e2.strstart++, e2.lookahead--;
          }
          return e2.match_available && (n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1]), e2.match_available = 0), e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
        }
        function M(e2, t2, r2, n2, i2) {
          this.good_length = e2, this.max_lazy = t2, this.nice_length = r2, this.max_chain = n2, this.func = i2;
        }
        function H() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new c.Buf16(2 * w), this.dyn_dtree = new c.Buf16(2 * (2 * a + 1)), this.bl_tree = new c.Buf16(2 * (2 * o + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new c.Buf16(k + 1), this.heap = new c.Buf16(2 * s + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new c.Buf16(2 * s + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function G(e2) {
          var t2;
          return e2 && e2.state ? (e2.total_in = e2.total_out = 0, e2.data_type = i, (t2 = e2.state).pending = 0, t2.pending_out = 0, t2.wrap < 0 && (t2.wrap = -t2.wrap), t2.status = t2.wrap ? C : E, e2.adler = 2 === t2.wrap ? 0 : 1, t2.last_flush = l, u._tr_init(t2), m) : R(e2, _);
        }
        function K(e2) {
          var t2 = G(e2);
          return t2 === m && (function(e3) {
            e3.window_size = 2 * e3.w_size, D(e3.head), e3.max_lazy_match = h[e3.level].max_lazy, e3.good_match = h[e3.level].good_length, e3.nice_match = h[e3.level].nice_length, e3.max_chain_length = h[e3.level].max_chain, e3.strstart = 0, e3.block_start = 0, e3.lookahead = 0, e3.insert = 0, e3.match_length = e3.prev_length = x - 1, e3.match_available = 0, e3.ins_h = 0;
          })(e2.state), t2;
        }
        function Y(e2, t2, r2, n2, i2, s2) {
          if (!e2) return _;
          var a2 = 1;
          if (t2 === g && (t2 = 6), n2 < 0 ? (a2 = 0, n2 = -n2) : 15 < n2 && (a2 = 2, n2 -= 16), i2 < 1 || y < i2 || r2 !== v || n2 < 8 || 15 < n2 || t2 < 0 || 9 < t2 || s2 < 0 || b < s2) return R(e2, _);
          8 === n2 && (n2 = 9);
          var o2 = new H();
          return (e2.state = o2).strm = e2, o2.wrap = a2, o2.gzhead = null, o2.w_bits = n2, o2.w_size = 1 << o2.w_bits, o2.w_mask = o2.w_size - 1, o2.hash_bits = i2 + 7, o2.hash_size = 1 << o2.hash_bits, o2.hash_mask = o2.hash_size - 1, o2.hash_shift = ~~((o2.hash_bits + x - 1) / x), o2.window = new c.Buf8(2 * o2.w_size), o2.head = new c.Buf16(o2.hash_size), o2.prev = new c.Buf16(o2.w_size), o2.lit_bufsize = 1 << i2 + 6, o2.pending_buf_size = 4 * o2.lit_bufsize, o2.pending_buf = new c.Buf8(o2.pending_buf_size), o2.d_buf = 1 * o2.lit_bufsize, o2.l_buf = 3 * o2.lit_bufsize, o2.level = t2, o2.strategy = s2, o2.method = r2, K(e2);
        }
        h = [new M(0, 0, 0, 0, function(e2, t2) {
          var r2 = 65535;
          for (r2 > e2.pending_buf_size - 5 && (r2 = e2.pending_buf_size - 5); ; ) {
            if (e2.lookahead <= 1) {
              if (j(e2), 0 === e2.lookahead && t2 === l) return A;
              if (0 === e2.lookahead) break;
            }
            e2.strstart += e2.lookahead, e2.lookahead = 0;
            var n2 = e2.block_start + r2;
            if ((0 === e2.strstart || e2.strstart >= n2) && (e2.lookahead = e2.strstart - n2, e2.strstart = n2, N(e2, false), 0 === e2.strm.avail_out)) return A;
            if (e2.strstart - e2.block_start >= e2.w_size - z && (N(e2, false), 0 === e2.strm.avail_out)) return A;
          }
          return e2.insert = 0, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : (e2.strstart > e2.block_start && (N(e2, false), e2.strm.avail_out), A);
        }), new M(4, 4, 8, 4, Z), new M(4, 5, 16, 8, Z), new M(4, 6, 32, 32, Z), new M(4, 4, 16, 16, W), new M(8, 16, 32, 32, W), new M(8, 16, 128, 128, W), new M(8, 32, 128, 256, W), new M(32, 128, 258, 1024, W), new M(32, 258, 258, 4096, W)], r.deflateInit = function(e2, t2) {
          return Y(e2, t2, v, 15, 8, 0);
        }, r.deflateInit2 = Y, r.deflateReset = K, r.deflateResetKeep = G, r.deflateSetHeader = function(e2, t2) {
          return e2 && e2.state ? 2 !== e2.state.wrap ? _ : (e2.state.gzhead = t2, m) : _;
        }, r.deflate = function(e2, t2) {
          var r2, n2, i2, s2;
          if (!e2 || !e2.state || 5 < t2 || t2 < 0) return e2 ? R(e2, _) : _;
          if (n2 = e2.state, !e2.output || !e2.input && 0 !== e2.avail_in || 666 === n2.status && t2 !== f) return R(e2, 0 === e2.avail_out ? -5 : _);
          if (n2.strm = e2, r2 = n2.last_flush, n2.last_flush = t2, n2.status === C) if (2 === n2.wrap) e2.adler = 0, U(n2, 31), U(n2, 139), U(n2, 8), n2.gzhead ? (U(n2, (n2.gzhead.text ? 1 : 0) + (n2.gzhead.hcrc ? 2 : 0) + (n2.gzhead.extra ? 4 : 0) + (n2.gzhead.name ? 8 : 0) + (n2.gzhead.comment ? 16 : 0)), U(n2, 255 & n2.gzhead.time), U(n2, n2.gzhead.time >> 8 & 255), U(n2, n2.gzhead.time >> 16 & 255), U(n2, n2.gzhead.time >> 24 & 255), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 255 & n2.gzhead.os), n2.gzhead.extra && n2.gzhead.extra.length && (U(n2, 255 & n2.gzhead.extra.length), U(n2, n2.gzhead.extra.length >> 8 & 255)), n2.gzhead.hcrc && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending, 0)), n2.gzindex = 0, n2.status = 69) : (U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 3), n2.status = E);
          else {
            var a2 = v + (n2.w_bits - 8 << 4) << 8;
            a2 |= (2 <= n2.strategy || n2.level < 2 ? 0 : n2.level < 6 ? 1 : 6 === n2.level ? 2 : 3) << 6, 0 !== n2.strstart && (a2 |= 32), a2 += 31 - a2 % 31, n2.status = E, P(n2, a2), 0 !== n2.strstart && (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), e2.adler = 1;
          }
          if (69 === n2.status) if (n2.gzhead.extra) {
            for (i2 = n2.pending; n2.gzindex < (65535 & n2.gzhead.extra.length) && (n2.pending !== n2.pending_buf_size || (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending !== n2.pending_buf_size)); ) U(n2, 255 & n2.gzhead.extra[n2.gzindex]), n2.gzindex++;
            n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), n2.gzindex === n2.gzhead.extra.length && (n2.gzindex = 0, n2.status = 73);
          } else n2.status = 73;
          if (73 === n2.status) if (n2.gzhead.name) {
            i2 = n2.pending;
            do {
              if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                s2 = 1;
                break;
              }
              s2 = n2.gzindex < n2.gzhead.name.length ? 255 & n2.gzhead.name.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
            } while (0 !== s2);
            n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.gzindex = 0, n2.status = 91);
          } else n2.status = 91;
          if (91 === n2.status) if (n2.gzhead.comment) {
            i2 = n2.pending;
            do {
              if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                s2 = 1;
                break;
              }
              s2 = n2.gzindex < n2.gzhead.comment.length ? 255 & n2.gzhead.comment.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
            } while (0 !== s2);
            n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.status = 103);
          } else n2.status = 103;
          if (103 === n2.status && (n2.gzhead.hcrc ? (n2.pending + 2 > n2.pending_buf_size && F(e2), n2.pending + 2 <= n2.pending_buf_size && (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), e2.adler = 0, n2.status = E)) : n2.status = E), 0 !== n2.pending) {
            if (F(e2), 0 === e2.avail_out) return n2.last_flush = -1, m;
          } else if (0 === e2.avail_in && T(t2) <= T(r2) && t2 !== f) return R(e2, -5);
          if (666 === n2.status && 0 !== e2.avail_in) return R(e2, -5);
          if (0 !== e2.avail_in || 0 !== n2.lookahead || t2 !== l && 666 !== n2.status) {
            var o2 = 2 === n2.strategy ? (function(e3, t3) {
              for (var r3; ; ) {
                if (0 === e3.lookahead && (j(e3), 0 === e3.lookahead)) {
                  if (t3 === l) return A;
                  break;
                }
                if (e3.match_length = 0, r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++, r3 && (N(e3, false), 0 === e3.strm.avail_out)) return A;
              }
              return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
            })(n2, t2) : 3 === n2.strategy ? (function(e3, t3) {
              for (var r3, n3, i3, s3, a3 = e3.window; ; ) {
                if (e3.lookahead <= S) {
                  if (j(e3), e3.lookahead <= S && t3 === l) return A;
                  if (0 === e3.lookahead) break;
                }
                if (e3.match_length = 0, e3.lookahead >= x && 0 < e3.strstart && (n3 = a3[i3 = e3.strstart - 1]) === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3]) {
                  s3 = e3.strstart + S;
                  do {
                  } while (n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && i3 < s3);
                  e3.match_length = S - (s3 - i3), e3.match_length > e3.lookahead && (e3.match_length = e3.lookahead);
                }
                if (e3.match_length >= x ? (r3 = u._tr_tally(e3, 1, e3.match_length - x), e3.lookahead -= e3.match_length, e3.strstart += e3.match_length, e3.match_length = 0) : (r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++), r3 && (N(e3, false), 0 === e3.strm.avail_out)) return A;
              }
              return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
            })(n2, t2) : h[n2.level].func(n2, t2);
            if (o2 !== O && o2 !== B || (n2.status = 666), o2 === A || o2 === O) return 0 === e2.avail_out && (n2.last_flush = -1), m;
            if (o2 === I && (1 === t2 ? u._tr_align(n2) : 5 !== t2 && (u._tr_stored_block(n2, 0, 0, false), 3 === t2 && (D(n2.head), 0 === n2.lookahead && (n2.strstart = 0, n2.block_start = 0, n2.insert = 0))), F(e2), 0 === e2.avail_out)) return n2.last_flush = -1, m;
          }
          return t2 !== f ? m : n2.wrap <= 0 ? 1 : (2 === n2.wrap ? (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), U(n2, e2.adler >> 16 & 255), U(n2, e2.adler >> 24 & 255), U(n2, 255 & e2.total_in), U(n2, e2.total_in >> 8 & 255), U(n2, e2.total_in >> 16 & 255), U(n2, e2.total_in >> 24 & 255)) : (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), F(e2), 0 < n2.wrap && (n2.wrap = -n2.wrap), 0 !== n2.pending ? m : 1);
        }, r.deflateEnd = function(e2) {
          var t2;
          return e2 && e2.state ? (t2 = e2.state.status) !== C && 69 !== t2 && 73 !== t2 && 91 !== t2 && 103 !== t2 && t2 !== E && 666 !== t2 ? R(e2, _) : (e2.state = null, t2 === E ? R(e2, -3) : m) : _;
        }, r.deflateSetDictionary = function(e2, t2) {
          var r2, n2, i2, s2, a2, o2, h2, u2, l2 = t2.length;
          if (!e2 || !e2.state) return _;
          if (2 === (s2 = (r2 = e2.state).wrap) || 1 === s2 && r2.status !== C || r2.lookahead) return _;
          for (1 === s2 && (e2.adler = d(e2.adler, t2, l2, 0)), r2.wrap = 0, l2 >= r2.w_size && (0 === s2 && (D(r2.head), r2.strstart = 0, r2.block_start = 0, r2.insert = 0), u2 = new c.Buf8(r2.w_size), c.arraySet(u2, t2, l2 - r2.w_size, r2.w_size, 0), t2 = u2, l2 = r2.w_size), a2 = e2.avail_in, o2 = e2.next_in, h2 = e2.input, e2.avail_in = l2, e2.next_in = 0, e2.input = t2, j(r2); r2.lookahead >= x; ) {
            for (n2 = r2.strstart, i2 = r2.lookahead - (x - 1); r2.ins_h = (r2.ins_h << r2.hash_shift ^ r2.window[n2 + x - 1]) & r2.hash_mask, r2.prev[n2 & r2.w_mask] = r2.head[r2.ins_h], r2.head[r2.ins_h] = n2, n2++, --i2; ) ;
            r2.strstart = n2, r2.lookahead = x - 1, j(r2);
          }
          return r2.strstart += r2.lookahead, r2.block_start = r2.strstart, r2.insert = r2.lookahead, r2.lookahead = 0, r2.match_length = r2.prev_length = x - 1, r2.match_available = 0, e2.next_in = o2, e2.input = h2, e2.avail_in = a2, r2.wrap = s2, m;
        }, r.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, t, r) {
        "use strict";
        t.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
        };
      }, {}], 48: [function(e, t, r) {
        "use strict";
        t.exports = function(e2, t2) {
          var r2, n, i, s, a, o, h, u, l, f, c, d, p, m, _, g, b, v, y, w, k, x, S, z, C;
          r2 = e2.state, n = e2.next_in, z = e2.input, i = n + (e2.avail_in - 5), s = e2.next_out, C = e2.output, a = s - (t2 - e2.avail_out), o = s + (e2.avail_out - 257), h = r2.dmax, u = r2.wsize, l = r2.whave, f = r2.wnext, c = r2.window, d = r2.hold, p = r2.bits, m = r2.lencode, _ = r2.distcode, g = (1 << r2.lenbits) - 1, b = (1 << r2.distbits) - 1;
          e: do {
            p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = m[d & g];
            t: for (; ; ) {
              if (d >>>= y = v >>> 24, p -= y, 0 === (y = v >>> 16 & 255)) C[s++] = 65535 & v;
              else {
                if (!(16 & y)) {
                  if (0 == (64 & y)) {
                    v = m[(65535 & v) + (d & (1 << y) - 1)];
                    continue t;
                  }
                  if (32 & y) {
                    r2.mode = 12;
                    break e;
                  }
                  e2.msg = "invalid literal/length code", r2.mode = 30;
                  break e;
                }
                w = 65535 & v, (y &= 15) && (p < y && (d += z[n++] << p, p += 8), w += d & (1 << y) - 1, d >>>= y, p -= y), p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = _[d & b];
                r: for (; ; ) {
                  if (d >>>= y = v >>> 24, p -= y, !(16 & (y = v >>> 16 & 255))) {
                    if (0 == (64 & y)) {
                      v = _[(65535 & v) + (d & (1 << y) - 1)];
                      continue r;
                    }
                    e2.msg = "invalid distance code", r2.mode = 30;
                    break e;
                  }
                  if (k = 65535 & v, p < (y &= 15) && (d += z[n++] << p, (p += 8) < y && (d += z[n++] << p, p += 8)), h < (k += d & (1 << y) - 1)) {
                    e2.msg = "invalid distance too far back", r2.mode = 30;
                    break e;
                  }
                  if (d >>>= y, p -= y, (y = s - a) < k) {
                    if (l < (y = k - y) && r2.sane) {
                      e2.msg = "invalid distance too far back", r2.mode = 30;
                      break e;
                    }
                    if (S = c, (x = 0) === f) {
                      if (x += u - y, y < w) {
                        for (w -= y; C[s++] = c[x++], --y; ) ;
                        x = s - k, S = C;
                      }
                    } else if (f < y) {
                      if (x += u + f - y, (y -= f) < w) {
                        for (w -= y; C[s++] = c[x++], --y; ) ;
                        if (x = 0, f < w) {
                          for (w -= y = f; C[s++] = c[x++], --y; ) ;
                          x = s - k, S = C;
                        }
                      }
                    } else if (x += f - y, y < w) {
                      for (w -= y; C[s++] = c[x++], --y; ) ;
                      x = s - k, S = C;
                    }
                    for (; 2 < w; ) C[s++] = S[x++], C[s++] = S[x++], C[s++] = S[x++], w -= 3;
                    w && (C[s++] = S[x++], 1 < w && (C[s++] = S[x++]));
                  } else {
                    for (x = s - k; C[s++] = C[x++], C[s++] = C[x++], C[s++] = C[x++], 2 < (w -= 3); ) ;
                    w && (C[s++] = C[x++], 1 < w && (C[s++] = C[x++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (n < i && s < o);
          n -= w = p >> 3, d &= (1 << (p -= w << 3)) - 1, e2.next_in = n, e2.next_out = s, e2.avail_in = n < i ? i - n + 5 : 5 - (n - i), e2.avail_out = s < o ? o - s + 257 : 257 - (s - o), r2.hold = d, r2.bits = p;
        };
      }, {}], 49: [function(e, t, r) {
        "use strict";
        var I = e("../utils/common"), O = e("./adler32"), B = e("./crc32"), R = e("./inffast"), T = e("./inftrees"), D = 1, F = 2, N = 0, U = -2, P = 1, n = 852, i = 592;
        function L(e2) {
          return (e2 >>> 24 & 255) + (e2 >>> 8 & 65280) + ((65280 & e2) << 8) + ((255 & e2) << 24);
        }
        function s() {
          this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new I.Buf16(320), this.work = new I.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function a(e2) {
          var t2;
          return e2 && e2.state ? (t2 = e2.state, e2.total_in = e2.total_out = t2.total = 0, e2.msg = "", t2.wrap && (e2.adler = 1 & t2.wrap), t2.mode = P, t2.last = 0, t2.havedict = 0, t2.dmax = 32768, t2.head = null, t2.hold = 0, t2.bits = 0, t2.lencode = t2.lendyn = new I.Buf32(n), t2.distcode = t2.distdyn = new I.Buf32(i), t2.sane = 1, t2.back = -1, N) : U;
        }
        function o(e2) {
          var t2;
          return e2 && e2.state ? ((t2 = e2.state).wsize = 0, t2.whave = 0, t2.wnext = 0, a(e2)) : U;
        }
        function h(e2, t2) {
          var r2, n2;
          return e2 && e2.state ? (n2 = e2.state, t2 < 0 ? (r2 = 0, t2 = -t2) : (r2 = 1 + (t2 >> 4), t2 < 48 && (t2 &= 15)), t2 && (t2 < 8 || 15 < t2) ? U : (null !== n2.window && n2.wbits !== t2 && (n2.window = null), n2.wrap = r2, n2.wbits = t2, o(e2))) : U;
        }
        function u(e2, t2) {
          var r2, n2;
          return e2 ? (n2 = new s(), (e2.state = n2).window = null, (r2 = h(e2, t2)) !== N && (e2.state = null), r2) : U;
        }
        var l, f, c = true;
        function j(e2) {
          if (c) {
            var t2;
            for (l = new I.Buf32(512), f = new I.Buf32(32), t2 = 0; t2 < 144; ) e2.lens[t2++] = 8;
            for (; t2 < 256; ) e2.lens[t2++] = 9;
            for (; t2 < 280; ) e2.lens[t2++] = 7;
            for (; t2 < 288; ) e2.lens[t2++] = 8;
            for (T(D, e2.lens, 0, 288, l, 0, e2.work, { bits: 9 }), t2 = 0; t2 < 32; ) e2.lens[t2++] = 5;
            T(F, e2.lens, 0, 32, f, 0, e2.work, { bits: 5 }), c = false;
          }
          e2.lencode = l, e2.lenbits = 9, e2.distcode = f, e2.distbits = 5;
        }
        function Z(e2, t2, r2, n2) {
          var i2, s2 = e2.state;
          return null === s2.window && (s2.wsize = 1 << s2.wbits, s2.wnext = 0, s2.whave = 0, s2.window = new I.Buf8(s2.wsize)), n2 >= s2.wsize ? (I.arraySet(s2.window, t2, r2 - s2.wsize, s2.wsize, 0), s2.wnext = 0, s2.whave = s2.wsize) : (n2 < (i2 = s2.wsize - s2.wnext) && (i2 = n2), I.arraySet(s2.window, t2, r2 - n2, i2, s2.wnext), (n2 -= i2) ? (I.arraySet(s2.window, t2, r2 - n2, n2, 0), s2.wnext = n2, s2.whave = s2.wsize) : (s2.wnext += i2, s2.wnext === s2.wsize && (s2.wnext = 0), s2.whave < s2.wsize && (s2.whave += i2))), 0;
        }
        r.inflateReset = o, r.inflateReset2 = h, r.inflateResetKeep = a, r.inflateInit = function(e2) {
          return u(e2, 15);
        }, r.inflateInit2 = u, r.inflate = function(e2, t2) {
          var r2, n2, i2, s2, a2, o2, h2, u2, l2, f2, c2, d, p, m, _, g, b, v, y, w, k, x, S, z, C = 0, E = new I.Buf8(4), A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!e2 || !e2.state || !e2.output || !e2.input && 0 !== e2.avail_in) return U;
          12 === (r2 = e2.state).mode && (r2.mode = 13), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, f2 = o2, c2 = h2, x = N;
          e: for (; ; ) switch (r2.mode) {
            case P:
              if (0 === r2.wrap) {
                r2.mode = 13;
                break;
              }
              for (; l2 < 16; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              if (2 & r2.wrap && 35615 === u2) {
                E[r2.check = 0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0), l2 = u2 = 0, r2.mode = 2;
                break;
              }
              if (r2.flags = 0, r2.head && (r2.head.done = false), !(1 & r2.wrap) || (((255 & u2) << 8) + (u2 >> 8)) % 31) {
                e2.msg = "incorrect header check", r2.mode = 30;
                break;
              }
              if (8 != (15 & u2)) {
                e2.msg = "unknown compression method", r2.mode = 30;
                break;
              }
              if (l2 -= 4, k = 8 + (15 & (u2 >>>= 4)), 0 === r2.wbits) r2.wbits = k;
              else if (k > r2.wbits) {
                e2.msg = "invalid window size", r2.mode = 30;
                break;
              }
              r2.dmax = 1 << k, e2.adler = r2.check = 1, r2.mode = 512 & u2 ? 10 : 12, l2 = u2 = 0;
              break;
            case 2:
              for (; l2 < 16; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              if (r2.flags = u2, 8 != (255 & r2.flags)) {
                e2.msg = "unknown compression method", r2.mode = 30;
                break;
              }
              if (57344 & r2.flags) {
                e2.msg = "unknown header flags set", r2.mode = 30;
                break;
              }
              r2.head && (r2.head.text = u2 >> 8 & 1), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 3;
            case 3:
              for (; l2 < 32; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              r2.head && (r2.head.time = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, E[2] = u2 >>> 16 & 255, E[3] = u2 >>> 24 & 255, r2.check = B(r2.check, E, 4, 0)), l2 = u2 = 0, r2.mode = 4;
            case 4:
              for (; l2 < 16; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              r2.head && (r2.head.xflags = 255 & u2, r2.head.os = u2 >> 8), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 5;
            case 5:
              if (1024 & r2.flags) {
                for (; l2 < 16; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.length = u2, r2.head && (r2.head.extra_len = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0;
              } else r2.head && (r2.head.extra = null);
              r2.mode = 6;
            case 6:
              if (1024 & r2.flags && (o2 < (d = r2.length) && (d = o2), d && (r2.head && (k = r2.head.extra_len - r2.length, r2.head.extra || (r2.head.extra = new Array(r2.head.extra_len)), I.arraySet(r2.head.extra, n2, s2, d, k)), 512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, r2.length -= d), r2.length)) break e;
              r2.length = 0, r2.mode = 7;
            case 7:
              if (2048 & r2.flags) {
                if (0 === o2) break e;
                for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.name += String.fromCharCode(k)), k && d < o2; ) ;
                if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k) break e;
              } else r2.head && (r2.head.name = null);
              r2.length = 0, r2.mode = 8;
            case 8:
              if (4096 & r2.flags) {
                if (0 === o2) break e;
                for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.comment += String.fromCharCode(k)), k && d < o2; ) ;
                if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k) break e;
              } else r2.head && (r2.head.comment = null);
              r2.mode = 9;
            case 9:
              if (512 & r2.flags) {
                for (; l2 < 16; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (u2 !== (65535 & r2.check)) {
                  e2.msg = "header crc mismatch", r2.mode = 30;
                  break;
                }
                l2 = u2 = 0;
              }
              r2.head && (r2.head.hcrc = r2.flags >> 9 & 1, r2.head.done = true), e2.adler = r2.check = 0, r2.mode = 12;
              break;
            case 10:
              for (; l2 < 32; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              e2.adler = r2.check = L(u2), l2 = u2 = 0, r2.mode = 11;
            case 11:
              if (0 === r2.havedict) return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, 2;
              e2.adler = r2.check = 1, r2.mode = 12;
            case 12:
              if (5 === t2 || 6 === t2) break e;
            case 13:
              if (r2.last) {
                u2 >>>= 7 & l2, l2 -= 7 & l2, r2.mode = 27;
                break;
              }
              for (; l2 < 3; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              switch (r2.last = 1 & u2, l2 -= 1, 3 & (u2 >>>= 1)) {
                case 0:
                  r2.mode = 14;
                  break;
                case 1:
                  if (j(r2), r2.mode = 20, 6 !== t2) break;
                  u2 >>>= 2, l2 -= 2;
                  break e;
                case 2:
                  r2.mode = 17;
                  break;
                case 3:
                  e2.msg = "invalid block type", r2.mode = 30;
              }
              u2 >>>= 2, l2 -= 2;
              break;
            case 14:
              for (u2 >>>= 7 & l2, l2 -= 7 & l2; l2 < 32; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              if ((65535 & u2) != (u2 >>> 16 ^ 65535)) {
                e2.msg = "invalid stored block lengths", r2.mode = 30;
                break;
              }
              if (r2.length = 65535 & u2, l2 = u2 = 0, r2.mode = 15, 6 === t2) break e;
            case 15:
              r2.mode = 16;
            case 16:
              if (d = r2.length) {
                if (o2 < d && (d = o2), h2 < d && (d = h2), 0 === d) break e;
                I.arraySet(i2, n2, s2, d, a2), o2 -= d, s2 += d, h2 -= d, a2 += d, r2.length -= d;
                break;
              }
              r2.mode = 12;
              break;
            case 17:
              for (; l2 < 14; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              if (r2.nlen = 257 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ndist = 1 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ncode = 4 + (15 & u2), u2 >>>= 4, l2 -= 4, 286 < r2.nlen || 30 < r2.ndist) {
                e2.msg = "too many length or distance symbols", r2.mode = 30;
                break;
              }
              r2.have = 0, r2.mode = 18;
            case 18:
              for (; r2.have < r2.ncode; ) {
                for (; l2 < 3; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.lens[A[r2.have++]] = 7 & u2, u2 >>>= 3, l2 -= 3;
              }
              for (; r2.have < 19; ) r2.lens[A[r2.have++]] = 0;
              if (r2.lencode = r2.lendyn, r2.lenbits = 7, S = { bits: r2.lenbits }, x = T(0, r2.lens, 0, 19, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
                e2.msg = "invalid code lengths set", r2.mode = 30;
                break;
              }
              r2.have = 0, r2.mode = 19;
            case 19:
              for (; r2.have < r2.nlen + r2.ndist; ) {
                for (; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (b < 16) u2 >>>= _, l2 -= _, r2.lens[r2.have++] = b;
                else {
                  if (16 === b) {
                    for (z = _ + 2; l2 < z; ) {
                      if (0 === o2) break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    if (u2 >>>= _, l2 -= _, 0 === r2.have) {
                      e2.msg = "invalid bit length repeat", r2.mode = 30;
                      break;
                    }
                    k = r2.lens[r2.have - 1], d = 3 + (3 & u2), u2 >>>= 2, l2 -= 2;
                  } else if (17 === b) {
                    for (z = _ + 3; l2 < z; ) {
                      if (0 === o2) break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    l2 -= _, k = 0, d = 3 + (7 & (u2 >>>= _)), u2 >>>= 3, l2 -= 3;
                  } else {
                    for (z = _ + 7; l2 < z; ) {
                      if (0 === o2) break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    l2 -= _, k = 0, d = 11 + (127 & (u2 >>>= _)), u2 >>>= 7, l2 -= 7;
                  }
                  if (r2.have + d > r2.nlen + r2.ndist) {
                    e2.msg = "invalid bit length repeat", r2.mode = 30;
                    break;
                  }
                  for (; d--; ) r2.lens[r2.have++] = k;
                }
              }
              if (30 === r2.mode) break;
              if (0 === r2.lens[256]) {
                e2.msg = "invalid code -- missing end-of-block", r2.mode = 30;
                break;
              }
              if (r2.lenbits = 9, S = { bits: r2.lenbits }, x = T(D, r2.lens, 0, r2.nlen, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
                e2.msg = "invalid literal/lengths set", r2.mode = 30;
                break;
              }
              if (r2.distbits = 6, r2.distcode = r2.distdyn, S = { bits: r2.distbits }, x = T(F, r2.lens, r2.nlen, r2.ndist, r2.distcode, 0, r2.work, S), r2.distbits = S.bits, x) {
                e2.msg = "invalid distances set", r2.mode = 30;
                break;
              }
              if (r2.mode = 20, 6 === t2) break e;
            case 20:
              r2.mode = 21;
            case 21:
              if (6 <= o2 && 258 <= h2) {
                e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, R(e2, c2), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, 12 === r2.mode && (r2.back = -1);
                break;
              }
              for (r2.back = 0; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              if (g && 0 == (240 & g)) {
                for (v = _, y = g, w = b; g = (C = r2.lencode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                u2 >>>= v, l2 -= v, r2.back += v;
              }
              if (u2 >>>= _, l2 -= _, r2.back += _, r2.length = b, 0 === g) {
                r2.mode = 26;
                break;
              }
              if (32 & g) {
                r2.back = -1, r2.mode = 12;
                break;
              }
              if (64 & g) {
                e2.msg = "invalid literal/length code", r2.mode = 30;
                break;
              }
              r2.extra = 15 & g, r2.mode = 22;
            case 22:
              if (r2.extra) {
                for (z = r2.extra; l2 < z; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.length += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
              }
              r2.was = r2.length, r2.mode = 23;
            case 23:
              for (; g = (C = r2.distcode[u2 & (1 << r2.distbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              if (0 == (240 & g)) {
                for (v = _, y = g, w = b; g = (C = r2.distcode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                u2 >>>= v, l2 -= v, r2.back += v;
              }
              if (u2 >>>= _, l2 -= _, r2.back += _, 64 & g) {
                e2.msg = "invalid distance code", r2.mode = 30;
                break;
              }
              r2.offset = b, r2.extra = 15 & g, r2.mode = 24;
            case 24:
              if (r2.extra) {
                for (z = r2.extra; l2 < z; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.offset += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
              }
              if (r2.offset > r2.dmax) {
                e2.msg = "invalid distance too far back", r2.mode = 30;
                break;
              }
              r2.mode = 25;
            case 25:
              if (0 === h2) break e;
              if (d = c2 - h2, r2.offset > d) {
                if ((d = r2.offset - d) > r2.whave && r2.sane) {
                  e2.msg = "invalid distance too far back", r2.mode = 30;
                  break;
                }
                p = d > r2.wnext ? (d -= r2.wnext, r2.wsize - d) : r2.wnext - d, d > r2.length && (d = r2.length), m = r2.window;
              } else m = i2, p = a2 - r2.offset, d = r2.length;
              for (h2 < d && (d = h2), h2 -= d, r2.length -= d; i2[a2++] = m[p++], --d; ) ;
              0 === r2.length && (r2.mode = 21);
              break;
            case 26:
              if (0 === h2) break e;
              i2[a2++] = r2.length, h2--, r2.mode = 21;
              break;
            case 27:
              if (r2.wrap) {
                for (; l2 < 32; ) {
                  if (0 === o2) break e;
                  o2--, u2 |= n2[s2++] << l2, l2 += 8;
                }
                if (c2 -= h2, e2.total_out += c2, r2.total += c2, c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, a2 - c2) : O(r2.check, i2, c2, a2 - c2)), c2 = h2, (r2.flags ? u2 : L(u2)) !== r2.check) {
                  e2.msg = "incorrect data check", r2.mode = 30;
                  break;
                }
                l2 = u2 = 0;
              }
              r2.mode = 28;
            case 28:
              if (r2.wrap && r2.flags) {
                for (; l2 < 32; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (u2 !== (4294967295 & r2.total)) {
                  e2.msg = "incorrect length check", r2.mode = 30;
                  break;
                }
                l2 = u2 = 0;
              }
              r2.mode = 29;
            case 29:
              x = 1;
              break e;
            case 30:
              x = -3;
              break e;
            case 31:
              return -4;
            case 32:
            default:
              return U;
          }
          return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, (r2.wsize || c2 !== e2.avail_out && r2.mode < 30 && (r2.mode < 27 || 4 !== t2)) && Z(e2, e2.output, e2.next_out, c2 - e2.avail_out) ? (r2.mode = 31, -4) : (f2 -= e2.avail_in, c2 -= e2.avail_out, e2.total_in += f2, e2.total_out += c2, r2.total += c2, r2.wrap && c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, e2.next_out - c2) : O(r2.check, i2, c2, e2.next_out - c2)), e2.data_type = r2.bits + (r2.last ? 64 : 0) + (12 === r2.mode ? 128 : 0) + (20 === r2.mode || 15 === r2.mode ? 256 : 0), (0 == f2 && 0 === c2 || 4 === t2) && x === N && (x = -5), x);
        }, r.inflateEnd = function(e2) {
          if (!e2 || !e2.state) return U;
          var t2 = e2.state;
          return t2.window && (t2.window = null), e2.state = null, N;
        }, r.inflateGetHeader = function(e2, t2) {
          var r2;
          return e2 && e2.state ? 0 == (2 & (r2 = e2.state).wrap) ? U : ((r2.head = t2).done = false, N) : U;
        }, r.inflateSetDictionary = function(e2, t2) {
          var r2, n2 = t2.length;
          return e2 && e2.state ? 0 !== (r2 = e2.state).wrap && 11 !== r2.mode ? U : 11 === r2.mode && O(1, t2, n2, 0) !== r2.check ? -3 : Z(e2, t2, n2, n2) ? (r2.mode = 31, -4) : (r2.havedict = 1, N) : U;
        }, r.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, t, r) {
        "use strict";
        var D = e("../utils/common"), F = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], N = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], U = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], P = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        t.exports = function(e2, t2, r2, n, i, s, a, o) {
          var h, u, l, f, c, d, p, m, _, g = o.bits, b = 0, v = 0, y = 0, w = 0, k = 0, x = 0, S = 0, z = 0, C = 0, E = 0, A = null, I = 0, O = new D.Buf16(16), B = new D.Buf16(16), R = null, T = 0;
          for (b = 0; b <= 15; b++) O[b] = 0;
          for (v = 0; v < n; v++) O[t2[r2 + v]]++;
          for (k = g, w = 15; 1 <= w && 0 === O[w]; w--) ;
          if (w < k && (k = w), 0 === w) return i[s++] = 20971520, i[s++] = 20971520, o.bits = 1, 0;
          for (y = 1; y < w && 0 === O[y]; y++) ;
          for (k < y && (k = y), b = z = 1; b <= 15; b++) if (z <<= 1, (z -= O[b]) < 0) return -1;
          if (0 < z && (0 === e2 || 1 !== w)) return -1;
          for (B[1] = 0, b = 1; b < 15; b++) B[b + 1] = B[b] + O[b];
          for (v = 0; v < n; v++) 0 !== t2[r2 + v] && (a[B[t2[r2 + v]]++] = v);
          if (d = 0 === e2 ? (A = R = a, 19) : 1 === e2 ? (A = F, I -= 257, R = N, T -= 257, 256) : (A = U, R = P, -1), b = y, c = s, S = v = E = 0, l = -1, f = (C = 1 << (x = k)) - 1, 1 === e2 && 852 < C || 2 === e2 && 592 < C) return 1;
          for (; ; ) {
            for (p = b - S, _ = a[v] < d ? (m = 0, a[v]) : a[v] > d ? (m = R[T + a[v]], A[I + a[v]]) : (m = 96, 0), h = 1 << b - S, y = u = 1 << x; i[c + (E >> S) + (u -= h)] = p << 24 | m << 16 | _ | 0, 0 !== u; ) ;
            for (h = 1 << b - 1; E & h; ) h >>= 1;
            if (0 !== h ? (E &= h - 1, E += h) : E = 0, v++, 0 == --O[b]) {
              if (b === w) break;
              b = t2[r2 + a[v]];
            }
            if (k < b && (E & f) !== l) {
              for (0 === S && (S = k), c += y, z = 1 << (x = b - S); x + S < w && !((z -= O[x + S]) <= 0); ) x++, z <<= 1;
              if (C += 1 << x, 1 === e2 && 852 < C || 2 === e2 && 592 < C) return 1;
              i[l = E & f] = k << 24 | x << 16 | c - s | 0;
            }
          }
          return 0 !== E && (i[c + E] = b - S << 24 | 64 << 16 | 0), o.bits = k, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, t, r) {
        "use strict";
        t.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, t, r) {
        "use strict";
        var i = e("../utils/common"), o = 0, h = 1;
        function n(e2) {
          for (var t2 = e2.length; 0 <= --t2; ) e2[t2] = 0;
        }
        var s = 0, a = 29, u = 256, l = u + 1 + a, f = 30, c = 19, _ = 2 * l + 1, g = 15, d = 16, p = 7, m = 256, b = 16, v = 17, y = 18, w = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], k = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], S = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], z = new Array(2 * (l + 2));
        n(z);
        var C = new Array(2 * f);
        n(C);
        var E = new Array(512);
        n(E);
        var A = new Array(256);
        n(A);
        var I = new Array(a);
        n(I);
        var O, B, R, T = new Array(f);
        function D(e2, t2, r2, n2, i2) {
          this.static_tree = e2, this.extra_bits = t2, this.extra_base = r2, this.elems = n2, this.max_length = i2, this.has_stree = e2 && e2.length;
        }
        function F(e2, t2) {
          this.dyn_tree = e2, this.max_code = 0, this.stat_desc = t2;
        }
        function N(e2) {
          return e2 < 256 ? E[e2] : E[256 + (e2 >>> 7)];
        }
        function U(e2, t2) {
          e2.pending_buf[e2.pending++] = 255 & t2, e2.pending_buf[e2.pending++] = t2 >>> 8 & 255;
        }
        function P(e2, t2, r2) {
          e2.bi_valid > d - r2 ? (e2.bi_buf |= t2 << e2.bi_valid & 65535, U(e2, e2.bi_buf), e2.bi_buf = t2 >> d - e2.bi_valid, e2.bi_valid += r2 - d) : (e2.bi_buf |= t2 << e2.bi_valid & 65535, e2.bi_valid += r2);
        }
        function L(e2, t2, r2) {
          P(e2, r2[2 * t2], r2[2 * t2 + 1]);
        }
        function j(e2, t2) {
          for (var r2 = 0; r2 |= 1 & e2, e2 >>>= 1, r2 <<= 1, 0 < --t2; ) ;
          return r2 >>> 1;
        }
        function Z(e2, t2, r2) {
          var n2, i2, s2 = new Array(g + 1), a2 = 0;
          for (n2 = 1; n2 <= g; n2++) s2[n2] = a2 = a2 + r2[n2 - 1] << 1;
          for (i2 = 0; i2 <= t2; i2++) {
            var o2 = e2[2 * i2 + 1];
            0 !== o2 && (e2[2 * i2] = j(s2[o2]++, o2));
          }
        }
        function W(e2) {
          var t2;
          for (t2 = 0; t2 < l; t2++) e2.dyn_ltree[2 * t2] = 0;
          for (t2 = 0; t2 < f; t2++) e2.dyn_dtree[2 * t2] = 0;
          for (t2 = 0; t2 < c; t2++) e2.bl_tree[2 * t2] = 0;
          e2.dyn_ltree[2 * m] = 1, e2.opt_len = e2.static_len = 0, e2.last_lit = e2.matches = 0;
        }
        function M(e2) {
          8 < e2.bi_valid ? U(e2, e2.bi_buf) : 0 < e2.bi_valid && (e2.pending_buf[e2.pending++] = e2.bi_buf), e2.bi_buf = 0, e2.bi_valid = 0;
        }
        function H(e2, t2, r2, n2) {
          var i2 = 2 * t2, s2 = 2 * r2;
          return e2[i2] < e2[s2] || e2[i2] === e2[s2] && n2[t2] <= n2[r2];
        }
        function G(e2, t2, r2) {
          for (var n2 = e2.heap[r2], i2 = r2 << 1; i2 <= e2.heap_len && (i2 < e2.heap_len && H(t2, e2.heap[i2 + 1], e2.heap[i2], e2.depth) && i2++, !H(t2, n2, e2.heap[i2], e2.depth)); ) e2.heap[r2] = e2.heap[i2], r2 = i2, i2 <<= 1;
          e2.heap[r2] = n2;
        }
        function K(e2, t2, r2) {
          var n2, i2, s2, a2, o2 = 0;
          if (0 !== e2.last_lit) for (; n2 = e2.pending_buf[e2.d_buf + 2 * o2] << 8 | e2.pending_buf[e2.d_buf + 2 * o2 + 1], i2 = e2.pending_buf[e2.l_buf + o2], o2++, 0 === n2 ? L(e2, i2, t2) : (L(e2, (s2 = A[i2]) + u + 1, t2), 0 !== (a2 = w[s2]) && P(e2, i2 -= I[s2], a2), L(e2, s2 = N(--n2), r2), 0 !== (a2 = k[s2]) && P(e2, n2 -= T[s2], a2)), o2 < e2.last_lit; ) ;
          L(e2, m, t2);
        }
        function Y(e2, t2) {
          var r2, n2, i2, s2 = t2.dyn_tree, a2 = t2.stat_desc.static_tree, o2 = t2.stat_desc.has_stree, h2 = t2.stat_desc.elems, u2 = -1;
          for (e2.heap_len = 0, e2.heap_max = _, r2 = 0; r2 < h2; r2++) 0 !== s2[2 * r2] ? (e2.heap[++e2.heap_len] = u2 = r2, e2.depth[r2] = 0) : s2[2 * r2 + 1] = 0;
          for (; e2.heap_len < 2; ) s2[2 * (i2 = e2.heap[++e2.heap_len] = u2 < 2 ? ++u2 : 0)] = 1, e2.depth[i2] = 0, e2.opt_len--, o2 && (e2.static_len -= a2[2 * i2 + 1]);
          for (t2.max_code = u2, r2 = e2.heap_len >> 1; 1 <= r2; r2--) G(e2, s2, r2);
          for (i2 = h2; r2 = e2.heap[1], e2.heap[1] = e2.heap[e2.heap_len--], G(e2, s2, 1), n2 = e2.heap[1], e2.heap[--e2.heap_max] = r2, e2.heap[--e2.heap_max] = n2, s2[2 * i2] = s2[2 * r2] + s2[2 * n2], e2.depth[i2] = (e2.depth[r2] >= e2.depth[n2] ? e2.depth[r2] : e2.depth[n2]) + 1, s2[2 * r2 + 1] = s2[2 * n2 + 1] = i2, e2.heap[1] = i2++, G(e2, s2, 1), 2 <= e2.heap_len; ) ;
          e2.heap[--e2.heap_max] = e2.heap[1], (function(e3, t3) {
            var r3, n3, i3, s3, a3, o3, h3 = t3.dyn_tree, u3 = t3.max_code, l2 = t3.stat_desc.static_tree, f2 = t3.stat_desc.has_stree, c2 = t3.stat_desc.extra_bits, d2 = t3.stat_desc.extra_base, p2 = t3.stat_desc.max_length, m2 = 0;
            for (s3 = 0; s3 <= g; s3++) e3.bl_count[s3] = 0;
            for (h3[2 * e3.heap[e3.heap_max] + 1] = 0, r3 = e3.heap_max + 1; r3 < _; r3++) p2 < (s3 = h3[2 * h3[2 * (n3 = e3.heap[r3]) + 1] + 1] + 1) && (s3 = p2, m2++), h3[2 * n3 + 1] = s3, u3 < n3 || (e3.bl_count[s3]++, a3 = 0, d2 <= n3 && (a3 = c2[n3 - d2]), o3 = h3[2 * n3], e3.opt_len += o3 * (s3 + a3), f2 && (e3.static_len += o3 * (l2[2 * n3 + 1] + a3)));
            if (0 !== m2) {
              do {
                for (s3 = p2 - 1; 0 === e3.bl_count[s3]; ) s3--;
                e3.bl_count[s3]--, e3.bl_count[s3 + 1] += 2, e3.bl_count[p2]--, m2 -= 2;
              } while (0 < m2);
              for (s3 = p2; 0 !== s3; s3--) for (n3 = e3.bl_count[s3]; 0 !== n3; ) u3 < (i3 = e3.heap[--r3]) || (h3[2 * i3 + 1] !== s3 && (e3.opt_len += (s3 - h3[2 * i3 + 1]) * h3[2 * i3], h3[2 * i3 + 1] = s3), n3--);
            }
          })(e2, t2), Z(s2, u2, e2.bl_count);
        }
        function X(e2, t2, r2) {
          var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
          for (0 === a2 && (h2 = 138, u2 = 3), t2[2 * (r2 + 1) + 1] = 65535, n2 = 0; n2 <= r2; n2++) i2 = a2, a2 = t2[2 * (n2 + 1) + 1], ++o2 < h2 && i2 === a2 || (o2 < u2 ? e2.bl_tree[2 * i2] += o2 : 0 !== i2 ? (i2 !== s2 && e2.bl_tree[2 * i2]++, e2.bl_tree[2 * b]++) : o2 <= 10 ? e2.bl_tree[2 * v]++ : e2.bl_tree[2 * y]++, s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4));
        }
        function V(e2, t2, r2) {
          var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
          for (0 === a2 && (h2 = 138, u2 = 3), n2 = 0; n2 <= r2; n2++) if (i2 = a2, a2 = t2[2 * (n2 + 1) + 1], !(++o2 < h2 && i2 === a2)) {
            if (o2 < u2) for (; L(e2, i2, e2.bl_tree), 0 != --o2; ) ;
            else 0 !== i2 ? (i2 !== s2 && (L(e2, i2, e2.bl_tree), o2--), L(e2, b, e2.bl_tree), P(e2, o2 - 3, 2)) : o2 <= 10 ? (L(e2, v, e2.bl_tree), P(e2, o2 - 3, 3)) : (L(e2, y, e2.bl_tree), P(e2, o2 - 11, 7));
            s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4);
          }
        }
        n(T);
        var q = false;
        function J(e2, t2, r2, n2) {
          P(e2, (s << 1) + (n2 ? 1 : 0), 3), (function(e3, t3, r3, n3) {
            M(e3), n3 && (U(e3, r3), U(e3, ~r3)), i.arraySet(e3.pending_buf, e3.window, t3, r3, e3.pending), e3.pending += r3;
          })(e2, t2, r2, true);
        }
        r._tr_init = function(e2) {
          q || ((function() {
            var e3, t2, r2, n2, i2, s2 = new Array(g + 1);
            for (n2 = r2 = 0; n2 < a - 1; n2++) for (I[n2] = r2, e3 = 0; e3 < 1 << w[n2]; e3++) A[r2++] = n2;
            for (A[r2 - 1] = n2, n2 = i2 = 0; n2 < 16; n2++) for (T[n2] = i2, e3 = 0; e3 < 1 << k[n2]; e3++) E[i2++] = n2;
            for (i2 >>= 7; n2 < f; n2++) for (T[n2] = i2 << 7, e3 = 0; e3 < 1 << k[n2] - 7; e3++) E[256 + i2++] = n2;
            for (t2 = 0; t2 <= g; t2++) s2[t2] = 0;
            for (e3 = 0; e3 <= 143; ) z[2 * e3 + 1] = 8, e3++, s2[8]++;
            for (; e3 <= 255; ) z[2 * e3 + 1] = 9, e3++, s2[9]++;
            for (; e3 <= 279; ) z[2 * e3 + 1] = 7, e3++, s2[7]++;
            for (; e3 <= 287; ) z[2 * e3 + 1] = 8, e3++, s2[8]++;
            for (Z(z, l + 1, s2), e3 = 0; e3 < f; e3++) C[2 * e3 + 1] = 5, C[2 * e3] = j(e3, 5);
            O = new D(z, w, u + 1, l, g), B = new D(C, k, 0, f, g), R = new D(new Array(0), x, 0, c, p);
          })(), q = true), e2.l_desc = new F(e2.dyn_ltree, O), e2.d_desc = new F(e2.dyn_dtree, B), e2.bl_desc = new F(e2.bl_tree, R), e2.bi_buf = 0, e2.bi_valid = 0, W(e2);
        }, r._tr_stored_block = J, r._tr_flush_block = function(e2, t2, r2, n2) {
          var i2, s2, a2 = 0;
          0 < e2.level ? (2 === e2.strm.data_type && (e2.strm.data_type = (function(e3) {
            var t3, r3 = 4093624447;
            for (t3 = 0; t3 <= 31; t3++, r3 >>>= 1) if (1 & r3 && 0 !== e3.dyn_ltree[2 * t3]) return o;
            if (0 !== e3.dyn_ltree[18] || 0 !== e3.dyn_ltree[20] || 0 !== e3.dyn_ltree[26]) return h;
            for (t3 = 32; t3 < u; t3++) if (0 !== e3.dyn_ltree[2 * t3]) return h;
            return o;
          })(e2)), Y(e2, e2.l_desc), Y(e2, e2.d_desc), a2 = (function(e3) {
            var t3;
            for (X(e3, e3.dyn_ltree, e3.l_desc.max_code), X(e3, e3.dyn_dtree, e3.d_desc.max_code), Y(e3, e3.bl_desc), t3 = c - 1; 3 <= t3 && 0 === e3.bl_tree[2 * S[t3] + 1]; t3--) ;
            return e3.opt_len += 3 * (t3 + 1) + 5 + 5 + 4, t3;
          })(e2), i2 = e2.opt_len + 3 + 7 >>> 3, (s2 = e2.static_len + 3 + 7 >>> 3) <= i2 && (i2 = s2)) : i2 = s2 = r2 + 5, r2 + 4 <= i2 && -1 !== t2 ? J(e2, t2, r2, n2) : 4 === e2.strategy || s2 === i2 ? (P(e2, 2 + (n2 ? 1 : 0), 3), K(e2, z, C)) : (P(e2, 4 + (n2 ? 1 : 0), 3), (function(e3, t3, r3, n3) {
            var i3;
            for (P(e3, t3 - 257, 5), P(e3, r3 - 1, 5), P(e3, n3 - 4, 4), i3 = 0; i3 < n3; i3++) P(e3, e3.bl_tree[2 * S[i3] + 1], 3);
            V(e3, e3.dyn_ltree, t3 - 1), V(e3, e3.dyn_dtree, r3 - 1);
          })(e2, e2.l_desc.max_code + 1, e2.d_desc.max_code + 1, a2 + 1), K(e2, e2.dyn_ltree, e2.dyn_dtree)), W(e2), n2 && M(e2);
        }, r._tr_tally = function(e2, t2, r2) {
          return e2.pending_buf[e2.d_buf + 2 * e2.last_lit] = t2 >>> 8 & 255, e2.pending_buf[e2.d_buf + 2 * e2.last_lit + 1] = 255 & t2, e2.pending_buf[e2.l_buf + e2.last_lit] = 255 & r2, e2.last_lit++, 0 === t2 ? e2.dyn_ltree[2 * r2]++ : (e2.matches++, t2--, e2.dyn_ltree[2 * (A[r2] + u + 1)]++, e2.dyn_dtree[2 * N(t2)]++), e2.last_lit === e2.lit_bufsize - 1;
        }, r._tr_align = function(e2) {
          P(e2, 2, 3), L(e2, m, z), (function(e3) {
            16 === e3.bi_valid ? (U(e3, e3.bi_buf), e3.bi_buf = 0, e3.bi_valid = 0) : 8 <= e3.bi_valid && (e3.pending_buf[e3.pending++] = 255 & e3.bi_buf, e3.bi_buf >>= 8, e3.bi_valid -= 8);
          })(e2);
        };
      }, { "../utils/common": 41 }], 53: [function(e, t, r) {
        "use strict";
        t.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, t, r) {
        (function(e2) {
          !(function(r2, n) {
            "use strict";
            if (!r2.setImmediate) {
              var i, s, t2, a, o = 1, h = {}, u = false, l = r2.document, e3 = Object.getPrototypeOf && Object.getPrototypeOf(r2);
              e3 = e3 && e3.setTimeout ? e3 : r2, i = "[object process]" === {}.toString.call(r2.process) ? function(e4) {
                process.nextTick(function() {
                  c(e4);
                });
              } : (function() {
                if (r2.postMessage && !r2.importScripts) {
                  var e4 = true, t3 = r2.onmessage;
                  return r2.onmessage = function() {
                    e4 = false;
                  }, r2.postMessage("", "*"), r2.onmessage = t3, e4;
                }
              })() ? (a = "setImmediate$" + Math.random() + "$", r2.addEventListener ? r2.addEventListener("message", d, false) : r2.attachEvent("onmessage", d), function(e4) {
                r2.postMessage(a + e4, "*");
              }) : r2.MessageChannel ? ((t2 = new MessageChannel()).port1.onmessage = function(e4) {
                c(e4.data);
              }, function(e4) {
                t2.port2.postMessage(e4);
              }) : l && "onreadystatechange" in l.createElement("script") ? (s = l.documentElement, function(e4) {
                var t3 = l.createElement("script");
                t3.onreadystatechange = function() {
                  c(e4), t3.onreadystatechange = null, s.removeChild(t3), t3 = null;
                }, s.appendChild(t3);
              }) : function(e4) {
                setTimeout(c, 0, e4);
              }, e3.setImmediate = function(e4) {
                "function" != typeof e4 && (e4 = new Function("" + e4));
                for (var t3 = new Array(arguments.length - 1), r3 = 0; r3 < t3.length; r3++) t3[r3] = arguments[r3 + 1];
                var n2 = { callback: e4, args: t3 };
                return h[o] = n2, i(o), o++;
              }, e3.clearImmediate = f;
            }
            function f(e4) {
              delete h[e4];
            }
            function c(e4) {
              if (u) setTimeout(c, 0, e4);
              else {
                var t3 = h[e4];
                if (t3) {
                  u = true;
                  try {
                    !(function(e5) {
                      var t4 = e5.callback, r3 = e5.args;
                      switch (r3.length) {
                        case 0:
                          t4();
                          break;
                        case 1:
                          t4(r3[0]);
                          break;
                        case 2:
                          t4(r3[0], r3[1]);
                          break;
                        case 3:
                          t4(r3[0], r3[1], r3[2]);
                          break;
                        default:
                          t4.apply(n, r3);
                      }
                    })(t3);
                  } finally {
                    f(e4), u = false;
                  }
                }
              }
            }
            function d(e4) {
              e4.source === r2 && "string" == typeof e4.data && 0 === e4.data.indexOf(a) && c(+e4.data.slice(a.length));
            }
          })("undefined" == typeof self ? void 0 === e2 ? this : e2 : self);
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
      }, {}] }, {}, [10])(10);
    });
  }
});

// forked_pptxtojson/pptxtojson.js
var import_jszip = __toESM(require_jszip_min(), 1);

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
        pos = S.indexOf("<\/script>", pos);
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
function wisedeckApplyGraphicFramePlaceholderProps(node, target) {
  if (!target || typeof target !== "object") return target;
  const phIdxAttr = getTextByPathList(node, ["p:nvGraphicFramePr", "p:nvPr", "p:ph", "attrs", "idx"]);
  const phTypeAttr = getTextByPathList(node, ["p:nvGraphicFramePr", "p:nvPr", "p:ph", "attrs", "type"]);
  return wisedeckApplyPlaceholderProps(target, phIdxAttr, phTypeAttr);
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
  return wisedeckApplyGraphicFramePlaceholderProps(node, {
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
  });
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
  return wisedeckApplyGraphicFramePlaceholderProps(node, data);
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
  return wisedeckApplyGraphicFramePlaceholderProps(node, {
    type: "diagram",
    left,
    top,
    width,
    height,
    elements,
    textList,
    order
  });
}
export {
  parse2 as parse
};
/*! Bundled license information:

jszip/dist/jszip.min.js:
  (*!
  
  JSZip v3.10.1 - A JavaScript class for generating and reading zip files
  <http://stuartk.com/jszip>
  
  (c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
  Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.
  
  JSZip uses the library pako released under the MIT license :
  https://github.com/nodeca/pako/blob/main/LICENSE
  *)
*/
